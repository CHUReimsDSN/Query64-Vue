<script setup lang="ts">
import { AgGridVue } from "ag-grid-vue3";
import { nextTick, onMounted, ref } from "vue";
import type {
  TColumnProfil as TColumnPreference,
  TQuery64GridProps,
  TQuery64GridApi,
  TQuery64GetRowsParams,
  TResourceColumnMetaData
} from "./models";
import { ColumnFactory } from "./column-factory";
import {
  type ColDef,
  type Column,
  type ColumnVisibleEvent,
  type GetRowIdParams,
  type GridApi,
  type GridOptions,
  type GridReadyEvent,
  type ICellRendererParams,
  type IServerSideDatasource,
  type IServerSideGetRowsRequest,
  type ModelUpdatedEvent,
} from "ag-grid-community";
import type { TRecord } from "./private-models";
import { Logger } from "./logger";
import { Utils } from "./utils";

// props
const propsComponent = withDefaults(defineProps<TQuery64GridProps>(), {
  getMetadata: async () => [],
  getRows: async () => {
    return { items: [], length: 0 };
  },
  showRowCount: true,
  gridStyle: Utils.gridStyle(),
});

// lets
let lastGetRowsParams: TQuery64GetRowsParams | null = null;
let lastDisplayedCols: string[] = [];
let quickSearch: string | null = null
let columnFactory: ColumnFactory | null = null;

// refs
const gridOptions = ref<GridOptions<TRecord> | null>(null);
const gridApi = ref<GridApi<TRecord> | null>(null);
const rowCountString = ref("0 ligne");
const isLoadingSettingUpGrid = ref(true);
const isLoadingServer = ref(true);
const themeMode = ref<TQuery64GridProps["aggridThemeMode"]>("light");

// functions
async function setupColumns() {
  const response = await propsComponent.getMetadata({
    resourceName: propsComponent.resourceName,
    context: propsComponent.context,
  });
  columnFactory = new ColumnFactory(
    propsComponent.resourceName,
    response,
    propsComponent.config,
    propsComponent.additionals,
    propsComponent.overloads
  )
  gridOptions.value = getGridOptionsConfig(columnFactory)
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
function setupRowData(): IServerSideDatasource<TRecord> {
  return {
    getRows: (params) => {
      if (!columnFactory) {
        params.fail()
        return
      }
      const displayedCols =
        params.api
          .getColumns()
          ?.filter((column) => {
            return column.isVisible() || columnFactory!.getAllColumnDepedencies().includes(column.getColId());
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
          ...lastGetRowsParams?.agGridServerParams ?? {},
          endRow: 0,
          startRow: 0,
          sortModel: [],
        }) || (lastDisplayedCols.join(", ") !== displayedCols.join(", ")) || (lastGetRowsParams !== null && (lastGetRowsParams.quickSearch !== quickSearch));
      lastDisplayedCols = displayedCols;
      const groupCols = params.api.getRowGroupColumns().map((groupColumn) => {
        return groupColumn.getColId();
      });
      displayedCols.push(...groupCols);
      lastGetRowsParams = {
        resourceName: propsComponent.resourceName,
        agGridServerParams: { ...params.request },
        columnsToDisplay: displayedCols,
        shallReturnCount: shallReturnCount,
        quickSearch: quickSearch,
        context: propsComponent.context,
      };
      isLoadingServer.value = true
      propsComponent
        .getRows(lastGetRowsParams)
        .then((response) => {
          isLoadingServer.value = false
          let jsonKeysToParse: Map<keyof TRecord, boolean> = new Map();
          const isGroupMode =
            params.request.rowGroupCols.length !== 0 &&
            params.request.rowGroupCols.length !==
            params.request.groupKeys.length;
          if (!isGroupMode) {
            for (const displayedCol of displayedCols) {
              const metadataCol = columnFactory!.getMetadataByColId(displayedCol)
              if (!metadataCol) {
                continue;
              }
              let parseToSingle = true
              if (metadataCol.association_type === 'has_many' || metadataCol.association_type === 'has_and_belongs_to_many') {
                parseToSingle = false
              }
              jsonKeysToParse.set(
                (displayedCol.split(".")[0] ?? "") as keyof TRecord,
                parseToSingle
              );
            }
          }
          const items = response.items.map((item) => {
            for (const entry of jsonKeysToParse.entries()) {
              item[entry[0]] = JSON.parse(item[entry[0]] as string);
              if (entry[1]) {
                item[entry[0]] = (item[entry[0]] as TRecord[]).at(0)
              }
            }
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
          Logger.tryLog(error)
          isLoadingServer.value = false
        });
    },
  };
}
function setupGridColumns(preferences?: TColumnPreference[]) {
  if (!gridApi.value || !columnFactory) {
    return;
  }
  let resourceColumns: ColDef<TRecord>[];
  if (preferences) {
    resourceColumns = columnFactory.getColumnsByProfils(preferences);
  } else {
    resourceColumns = columnFactory.getColumns();
  }
  gridApi.value.setGridOption("columnDefs", resourceColumns);
}
function setupGridFiltersSortsAndGroups(
  filterModel?: IServerSideGetRowsRequest["filterModel"],
  sortModel?: IServerSideGetRowsRequest["sortModel"],
  rowgroupCols?: IServerSideGetRowsRequest["rowGroupCols"],
  forceReset = false
) {
  if (!gridApi.value) return;
  if (filterModel) {
    if (forceReset) {
      gridApi.value.setFilterModel(null)
    }
    gridApi.value.setFilterModel(filterModel);
  }
  if (sortModel) {
    if (forceReset) {
      gridApi.value.resetColumnState()
    }
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
    if (forceReset) {
      gridApi.value.setRowGroupColumns([])
    }
    gridApi.value.setRowGroupColumns(rowsGroup);
  }
}
function updateGridParams(
  columnProfils?: TColumnPreference[],
  filterModel?: IServerSideGetRowsRequest["filterModel"],
  sortModel?: IServerSideGetRowsRequest["sortModel"],
  rowGroupCols?: IServerSideGetRowsRequest["rowGroupCols"],
  forceReset = false
) {
  if (!gridApi.value) {
    return;
  }
  setupGridColumns(columnProfils);
  setupGridFiltersSortsAndGroups(filterModel, sortModel, rowGroupCols, forceReset);
}
function setRowCountString() {
  if (!gridApi.value) return;
  const rowCount = gridApi.value.getDisplayedRowCount();
  rowCountString.value = `${rowCount} ligne${rowCount > 0 ? "s" : ""}`;
}
function resetGridParams() {
  if (!gridApi.value) return;
  gridApi.value.setFilterModel(null);
  gridApi.value.resetColumnState();
  gridApi.value.setRowGroupColumns([]);
}
function setupThemeMode() {
  if (propsComponent.aggridThemeMode) {
    themeMode.value = propsComponent.aggridThemeMode;
    return
  }
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    themeMode.value = "dark";
  }
}
function getLastGetRowsParams() {
  return lastGetRowsParams
}
function getGridOptionsConfig(columnFactory: ColumnFactory): GridOptions<TRecord> {
  const gridOptions: GridOptions<TRecord> = {
    localeText: columnFactory.config.translation,
    suppressMiddleClickScrolls: true,
    suppressNoRowsOverlay: false,
    rowSelection: "multiple",
    rowModelType: "serverSide",
    rowGroupPanelShow: "onlyWhenGrouping",
    groupDisplayType: "singleColumn",
    theme: columnFactory.config.aggridTheme,
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
    columnTypes: columnFactory.config.columnTypeConfig,
    columnDefs: [],
    serverSideDatasource: setupRowData(),
    getRowId,
    getChildCount,
    maxConcurrentDatasourceRequests: 1,
    cacheBlockSize: 50,
    maxBlocksInCache: 4,
    rowHeight: 35,
  }
  if (propsComponent.initialGridParams?.gridOptions) {
    const optionsToFreeze: (keyof GridOptions<TRecord>)[] = [
      "localeText",
      "rowModelType",
      "columnTypes",
      "columnDefs",
      "serverSideDatasource",
      "getRowId",
      "getChildCount",
    ];
    for (const entry of Object.entries(propsComponent.initialGridParams.gridOptions)) {
      const attributeForReal = entry as [keyof GridOptions<TRecord>, unknown];
      if (optionsToFreeze.includes(attributeForReal[0])) {
        continue;
      }
      gridOptions[attributeForReal[0]] = entry[1];
    }
  }
  const baseOnGridReady = gridOptions.onGridReady;
  gridOptions.onGridReady = (params: GridReadyEvent) => {
    gridApi.value = params.api;
    updateGridParams(
      propsComponent.initialGridParams?.columnProfils,
      propsComponent.initialGridParams?.filterModel,
      propsComponent.initialGridParams?.sortModel,
      propsComponent.initialGridParams?.rowGroupCols
    );
    if (baseOnGridReady) {
      baseOnGridReady(params);
    }
  };
  const baseOnModeleUpdated = gridOptions.onModelUpdated;
  gridOptions.onModelUpdated = (params: ModelUpdatedEvent) => {
    if (baseOnModeleUpdated) {
      baseOnModeleUpdated(params);
    }
    void nextTick(() => {
      Logger.debug('onModeleUpdated, should setRowCountString')
      setRowCountString(); // TODO
    })
  };
  const baseOnColumnVisible = gridOptions.onColumnVisible;
  gridOptions.onColumnVisible = (params: ColumnVisibleEvent) => {
    if (baseOnColumnVisible) {
      baseOnColumnVisible(params);
    }
    if (!params.column || !gridApi.value) {
      return;
    }
    if (params.visible) {
      gridApi.value.refreshServerSide();
    } else {
      if (lastGetRowsParams?.columnsToDisplay) {
        lastGetRowsParams.columnsToDisplay = lastGetRowsParams.columnsToDisplay.filter((columnToDisplay) => {
          return columnToDisplay !== params.column!.getColId()
        })
      }
    }
  };
  return gridOptions
}
function triggerQuickFilter(search: string) {
  if (!gridApi.value) {
    return
  }
  quickSearch = search
  gridApi.value.refreshServerSide()
}

// lifeCycle
onMounted(async () => {
  await setupColumns();
  isLoadingSettingUpGrid.value = false;
  setupThemeMode();
});

// expose
defineExpose<TQuery64GridApi>({
  resetGridParams,
  updateGridParams,
  gridOptions,
  gridApi,
  getLastGetRowsParams,
  triggerQuickFilter,
  isLoadingSettingUpGrid,
  isLoadingServer
});
</script>

<template>
  <div v-if="!isLoadingSettingUpGrid && gridOptions" style="display: flex; flex-direction: column; height: 100%"
    :data-ag-theme-mode="themeMode">
    <AgGridVue :gridOptions="gridOptions" :style="`height: 100%; width: 100%; ${propsComponent.gridStyle}`" />
    <div v-if="propsComponent.showRowCount" style="
        display: flex;
        flex-direction: row;
        justify-content: end;
        align-items: center;
        padding: 4px 4px;
        padding-right: 8px;
      ">
      {{ rowCountString }}
    </div>
  </div>
</template>
