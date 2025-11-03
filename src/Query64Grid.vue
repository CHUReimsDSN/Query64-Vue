<script setup lang="ts" generic="T extends TRecord">
import { themeAlpine } from "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { onMounted, ref } from "vue";
import {
  TRecord,
  TResourceColumnProfil,
  TResourceColumnMetaData,
  TQuery64GridProps,
  TQuery64GridExpose,
} from "./models";
import AgGridFrenchTranslate from "./locale.fr";
import { ColumnFactory } from "./column-factory";
import type {
  ColDef,
  ColTypeDef,
  Column,
  ColumnVisibleEvent,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  IServerSideGetRowsRequest,
  ModelUpdatedEvent,
} from "ag-grid-community";

// props
const propsComponent = withDefaults(defineProps<TQuery64GridProps<T>>(), {
  getMetadata: async () => [],
  getRows: async () => {
    return { items: [], length: 0 };
  },
  showRowCount: true,
  aggridTheme: themeAlpine,
  gridStyle:
    "box-shadow: 0 1px 8px rgba(0, 0, 0, 0.2), 0 3px 4px rgba(0, 0, 0, 0.14), 0 3px 3px -2px rgba(0, 0, 0, 0.12);",
});

// consts
let resourceMetaDatas: TResourceColumnMetaData[] = [];
const columnFactory = new ColumnFactory(
  propsComponent.resourceName,
  propsComponent.globalColumnSettings,
  propsComponent.hasManyColumnSettings,
  propsComponent.actionColumnSettings,
  propsComponent.overloads,
  propsComponent.additionals
);

// refs
const gridOptions = ref<GridOptions<T>>({
  localeText: AgGridFrenchTranslate,
  suppressMiddleClickScrolls: true,
  suppressNoRowsOverlay: false,
  rowSelection: "multiple",
  rowModelType: "serverSide",
  rowGroupPanelShow: "onlyWhenGrouping",
  groupDisplayType: "singleColumn",
  autoGroupColumnDef: {
    minWidth: 200,
    cellRendererParams: {
      innerRenderer: (params: ICellRendererParams) => {
        // pas beau mais pas le choix, keyCreator sur les colDefs marche po :<
        params.node.key = params.data.__group_key ?? null;
        return params.data.__label;
      },
    },
  },
  columnTypes: columnFactory.globalColumnSettings.columnTypeConfig as {
    [key: string]: ColTypeDef<T>;
  },
  columnDefs: [],
  serverSideDatasource: setupRowData(),
  getRowId,
  getChildCount,
  maxConcurrentDatasourceRequests: 1,
  cacheBlockSize: 50,
  maxBlocksInCache: 4,
  rowHeight: 35,
});
const gridApi = ref<GridApi<T>>();
const rowCountString = ref("0 ligne");
const isLoadingSettingUpGrid = ref(true);
const lastGetRowsParams = ref<IServerSideGetRowsParams<T>["request"] | null>(
  null
);
const lastDisplayedCols = ref<string[]>([]);

// functions
async function setupResourceMetaData() {
  const response = await propsComponent.getMetadata({
    resourceName: propsComponent.resourceName,
    context: propsComponent.context,
  });
  resourceMetaDatas = response;
}
function getRowId(params: GetRowIdParams) {
if (params.data.__id) {
  return params.data.__id.toString(); // Group Mode usage, generate by the server
}
  return params.data.id.toString();
}
function getChildCount(dataItem: GetRowIdParams["data"]) {
  return dataItem.__childCount;
}
function setupRowData(): IServerSideDatasource<T> {
  return {
    getRows: (params) => {
      const displayedCols =
        params.api
          .getColumns()
          ?.filter((column) => {
            return column.isVisible();
          })
          .map((column) => {
            return column.getColId();
          }) ?? [];
      if (displayedCols.length === 0) {
        params.success({
          rowData: [],
          rowCount: 0,
        });
        return;
      }
      const shallReturnCount =
        JSON.stringify({
          ...params.request,
          endRow: 0,
          startRow: 0,
          sortModel: [],
        }) !==
          JSON.stringify({
            ...lastGetRowsParams.value,
            endRow: 0,
            startRow: 0,
            sortModel: [],
          }) || lastDisplayedCols.value.join(", ") !== displayedCols.join(", ");
      lastDisplayedCols.value = displayedCols;
      lastGetRowsParams.value = params.request;
      const groupCols = params.api.getRowGroupColumns().map((groupColumn) => {
        return groupColumn.getColId();
      });
      displayedCols.push(...groupCols);
      propsComponent
        .getRows({
          resourceName: propsComponent.resourceName,
          agGridServerParams: { ...params.request },
          columnsToDisplay: displayedCols,
          shallReturnCount: shallReturnCount,
          context: propsComponent.context,
        })
        .then((response) => {
          let jsonKeysToParse: (keyof T)[] = [];
          const isGroupMode =
            params.request.rowGroupCols.length !== 0 &&
            params.request.rowGroupCols.length !==
              params.request.groupKeys.length;
          if (!isGroupMode) {
            jsonKeysToParse = displayedCols
              .filter((col) => {
                return col.includes(".");
              })
              .map((col) => {
                return col.split(".").at(0) ?? "";
              }) as (keyof T)[];
          }
          const items = response.items.map((item) => {
            jsonKeysToParse.forEach((key) => {
              item[key] = JSON.parse(item[key] as string);
            });
            return item;
          });
          if (shallReturnCount) {
            params.success({
              rowData: items,
              rowCount: response.length,
            });
          } else {
            params.success({
              rowData: items,
            });
          }
          if (
            (shallReturnCount && response.length === 0) ||
            (!shallReturnCount && response.items.length === 0)
          ) {
            gridApi.value?.showNoRowsOverlay();
          } else {
            gridApi.value?.hideOverlay();
          }
        })
        .catch((error) => {
          params.fail();
          console.error(error);
        });
    },
  };
}
function setupGridColumns(columnProfils?: TResourceColumnProfil[]) {
  if (!gridApi.value || !resourceMetaDatas) return;
  let resourceColumns: ColDef<T>[];
  if (columnProfils) {
    resourceColumns = columnFactory.getResourceColumnsByProfils<T>(
      columnProfils,
      resourceMetaDatas,
      propsComponent.resourceName
    );
  } else {
    resourceColumns = columnFactory.getResourceColumnsDefault<T>(
      resourceMetaDatas,
      propsComponent.resourceName
    );
  }
  gridApi.value.setGridOption("columnDefs", resourceColumns);
}
function setupGridFiltersSortsAndGroups(
  filterModel?: IServerSideGetRowsRequest["filterModel"],
  sortModel?: IServerSideGetRowsRequest["sortModel"],
  rowgroupCols?: IServerSideGetRowsRequest["rowGroupCols"]
) {
  if (!gridApi.value) return;
  if (filterModel) {
    gridApi.value.setFilterModel(filterModel);
  }
  if (sortModel) {
    gridApi.value.applyColumnState({ state: sortModel });
  }
  if (rowgroupCols) {
    const allGridColumns = gridApi.value.getAllGridColumns();
    const rowsGroup: Column[] = rowgroupCols
      .map((rowGroup) => {
        return allGridColumns.find((gridColumn) => {
          return gridColumn.getColId() == rowGroup.field;
        });
      })
      .filter((rowGroup) => {
        return rowGroup !== undefined;
      });
    gridApi.value.setRowGroupColumns(rowsGroup);
  }
}
function updateGridParams(
  columnProfils?: TResourceColumnProfil[],
  filterModel?: IServerSideGetRowsRequest["filterModel"],
  sortModel?: IServerSideGetRowsRequest["sortModel"],
  rowGroupCols?: IServerSideGetRowsRequest["rowGroupCols"]
) {
  if (!gridApi.value) return;
  setupGridColumns(columnProfils);
  setupGridFiltersSortsAndGroups(filterModel, sortModel, rowGroupCols);
}
function setRowCountString() {
  if (!gridApi.value) return;
  const rowCount = gridApi.value.getDisplayedRowCount();
  rowCountString.value = `${rowCount} ligne${rowCount > 0 ? "s" : ""}`;
}
function inheritGridOptionsProps() {
  if (!propsComponent.initialGridParams?.gridOptions) return;
  const optionsToFreeze: (keyof GridOptions<T>)[] = [
    "localeText",
    "rowModelType",
    "columnTypes",
    "columnDefs",
    "serverSideDatasource",
    "getRowId",
    "getChildCount",
  ];
  Object.entries(propsComponent.initialGridParams.gridOptions).forEach(
    (attribute) => {
      const attributeForReal = attribute as [keyof GridOptions<T>, unknown];
      if (optionsToFreeze.includes(attributeForReal[0])) return;
      gridOptions.value[attributeForReal[0]] = attribute[1];
    }
  );
}
function setupGridEvents() {
  const baseOnGridReady = gridOptions.value.onGridReady;
  gridOptions.value.onGridReady = (params: GridReadyEvent) => {
    gridApi.value = params.api;
    updateGridParams(
      propsComponent.initialGridParams?.columnProfils,
      propsComponent.initialGridParams?.filterModel,
      propsComponent.initialGridParams?.sortModel,
      propsComponent.initialGridParams?.rowgroupCols
    );
    if (baseOnGridReady) baseOnGridReady(params);
  };
  const baseOnModeleUpdated = gridOptions.value.onModelUpdated;
  gridOptions.value.onModelUpdated = (params: ModelUpdatedEvent) => {
    if (baseOnModeleUpdated) baseOnModeleUpdated(params);
    setTimeout(() => {
      setRowCountString();
    }, 100);
  };
  const baseOnColumnVisible = gridOptions.value.onColumnVisible;
  gridOptions.value.onColumnVisible = (params: ColumnVisibleEvent) => {
    if (baseOnColumnVisible) baseOnColumnVisible(params);
    if (!params.column || !params.visible || !gridApi.value) return;
    gridApi.value.refreshServerSide();
  };
}
function resetGridParams() {
  if (!gridApi.value) return;
  gridApi.value.setFilterModel(null);
  gridApi.value.resetColumnState();
  gridApi.value.setRowGroupColumns([]);
}

// lifeCycle
onMounted(async () => {
  inheritGridOptionsProps();
  await setupResourceMetaData();
  setupGridEvents();
  isLoadingSettingUpGrid.value = false;
});

// Expose
defineExpose<TQuery64GridExpose<T>>({
  resetGridParams,
  updateGridParams,
  gridOptions,
  gridApi,
  lastGetRowsParams,
  isLoadingSettingUpGrid,
} as unknown as TQuery64GridExpose<T>);
// VueJS automatically unwrap refs and reactive, meaning type system will be wrong if saying ref are Ref<> and acessing .value
// https://vuejs.org/api/sfc-script-setup#defineexpose
</script>

<template>
  <div
    v-if="!isLoadingSettingUpGrid"
    style="display: flex; flex-direction: column; height: 100%"
  >
    <AgGridVue
      :gridOptions="(gridOptions as GridOptions<T>)"
      :theme="propsComponent.aggridTheme"
      :style="`height: 100%; width: 100%; ${propsComponent.gridStyle}`"
    />
    <div
      v-if="propsComponent.showRowCount"
      style="
        display: flex;
        flex-direction: row;
        justify-content: end;
        align-items: center;
        padding: 4px 4px;
        padding-right: 8px;
      "
    >
      {{ rowCountString }}
    </div>
  </div>
</template>
