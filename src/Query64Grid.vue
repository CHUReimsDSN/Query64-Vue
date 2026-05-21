<script setup lang="ts">
import { AgGridVue } from "ag-grid-vue3";
import { computed, nextTick, onMounted, ref } from "vue";
import type {
  TQuery64GridProps,
  TQuery64GridApi,
  TQuery64GetRowsParams,
  TColumnPreference
} from "./models";
import { GridFactory } from "./grid-factory";
import {
  Component,
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
import { Query64Logger } from "./logger";
import { Query64 } from "./query64";

// props
const propsComponent = withDefaults(defineProps<TQuery64GridProps>(), {
  showRowCount: true,
});

// lets
let lastGetRowsParams: TQuery64GetRowsParams | null = null;
let lastDisplayedCols: string[] = [];
let quickSearch: string | null = null

// refs
const gridOptions = ref<GridOptions<TRecord> | null>(null);
const gridApi = ref<GridApi<TRecord> | null>(null);
const gridFactory = ref<GridFactory | null>(null);
const rowCountRef = ref(0);
const isLoadingSettingUpGrid = ref(true);
const isLoadingServer = ref(true);
const themeMode = ref<TQuery64GridProps["themeMode"]>("light");

// functions
async function setupGrid() {
  const response = await propsComponent.initialGridParams.getMetadata({
    resourceName: propsComponent.resourceName,
    context: propsComponent.context,
  });
  gridFactory.value = new GridFactory(
    propsComponent.resourceName,
    response,
    propsComponent.initialGridParams.getRows,
    propsComponent.initialGridParams.gridConfig,
    propsComponent.initialGridParams.additionals,
    propsComponent.initialGridParams.overloads
  )
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
      if (!gridFactory) {
        params.fail()
        return
      }
      const displayedCols =
        params.api
          .getColumns()
          ?.filter((column) => {
            return column.isVisible() || gridFactory.value!.getAllColumnDepedencies().includes(column.getColId());
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
      gridFactory.value!.getRowsFn(lastGetRowsParams)
        .then((response) => {
          isLoadingServer.value = false
          let jsonKeysToParse: Map<keyof TRecord, boolean> = new Map();
          const isGroupMode =
            params.request.rowGroupCols.length !== 0 &&
            params.request.rowGroupCols.length !==
            params.request.groupKeys.length;
          if (!isGroupMode) {
            for (const displayedCol of displayedCols) {
              const metadataCol = gridFactory.value!.getMetadataByColId(displayedCol)
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
          if (response.row_count !== -1) {
            params.success({
              rowData: items,
              rowCount: response.row_count,
            });
          } else {
            params.success({
              rowData: items,
            });
          }
          if (
            (shallReturnCount && response.row_count === 0) ||
            (!shallReturnCount && response.items.length === 0)
          ) {
            gridApi.value?.showNoRowsOverlay();
          } else {
            gridApi.value?.hideOverlay();
          }
        })
        .catch((error) => {
          params.fail();
          console.log(error) // TODO remove
          Query64Logger.tryLog(error)
          isLoadingServer.value = false
        });
    },
  };
}
function setupGridColumns(preferences?: TColumnPreference[]) {
  if (!gridApi.value || !gridFactory.value) {
    return;
  }
  let resourceColumns: ColDef<TRecord>[];
  if (preferences) {
    resourceColumns = gridFactory.value.getColumnsByPreferences(preferences);
  } else {
    resourceColumns = gridFactory.value.getColumns();
  }
  gridApi.value.setGridOption("columnDefs", resourceColumns);
}
function setupGridFiltersSortsAndGroups(
  filterModel?: IServerSideGetRowsRequest["filterModel"],
  sortModel?: IServerSideGetRowsRequest["sortModel"],
  rowgroupCols?: IServerSideGetRowsRequest["rowGroupCols"],
  forceReset = false
) {
  if (!gridApi.value) {
    return;
  }
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
  columnPreferences?: TColumnPreference[],
  filterModel?: IServerSideGetRowsRequest["filterModel"],
  sortModel?: IServerSideGetRowsRequest["sortModel"],
  rowGroupCols?: IServerSideGetRowsRequest["rowGroupCols"],
  forceReset = false
) {
  if (!gridApi.value) {
    return;
  }
  setupGridColumns(columnPreferences);
  setupGridFiltersSortsAndGroups(filterModel, sortModel, rowGroupCols, forceReset);
}
function setRowCountString() {
  if (!gridApi.value) {
    return;
  }
  rowCountRef.value = gridApi.value.getDisplayedRowCount();
}
function resetGridParams() {
  if (!gridApi.value) {
    return;
  }
  gridApi.value.setFilterModel(null);
  gridApi.value.resetColumnState();
  gridApi.value.setRowGroupColumns([]);
}
function setupThemeMode() {
  if (propsComponent.themeMode) {
    themeMode.value = propsComponent.themeMode;
    return
  }
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    themeMode.value = "dark";
  }
}
function getLastGetRowsParams() {
  return lastGetRowsParams
}
function setupGridOptionsConfig() {
  if (!gridFactory.value) {
    Query64Logger.tryLog('')
    return
  }
  const gridOptionBuilding: GridOptions<TRecord> = {
    localeText: gridFactory.value.gridConfig.translation,
    suppressMiddleClickScrolls: true,
    suppressNoRowsOverlay: false,
    rowSelection: "multiple",
    rowModelType: "serverSide",
    rowGroupPanelShow: "onlyWhenGrouping",
    groupDisplayType: "singleColumn",
    theme: gridFactory.value.gridConfig.aggridTheme,
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
    columnTypes: gridFactory.value.gridConfig.columnTypeConfig,
    columnDefs: [],
    serverSideDatasource: setupRowData(),
    getRowId,
    getChildCount,
    maxConcurrentDatasourceRequests: 1,
    cacheBlockSize: 50,
    maxBlocksInCache: 4,
    rowHeight: 35,
  }
  const baseOnGridReady = gridOptionBuilding.onGridReady;
  gridOptionBuilding.onGridReady = (params: GridReadyEvent) => {
    gridApi.value = params.api;
    updateGridParams(propsComponent.initialGridParams.preferences,
      propsComponent.initialGridParams.filterModel,
      propsComponent.initialGridParams.sortModel,
      propsComponent.initialGridParams.rowgroupCols
    )
    if (baseOnGridReady) {
      baseOnGridReady(params);
    }
  };
  const baseOnModeleUpdated = gridOptionBuilding.onModelUpdated;
  gridOptionBuilding.onModelUpdated = (params: ModelUpdatedEvent) => {
    if (baseOnModeleUpdated) {
      baseOnModeleUpdated(params);
    }
    void nextTick(() => {
      Query64Logger.debug('onModeleUpdated, should setRowCountString')
      setRowCountString(); // TODO
    })
  };
  const baseOnColumnVisible = gridOptionBuilding.onColumnVisible;
  gridOptionBuilding.onColumnVisible = (params: ColumnVisibleEvent) => {
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
  gridOptions.value = gridOptionBuilding
}
function triggerQuickFilter(search: string) {
  if (!gridApi.value) {
    return
  }
  quickSearch = search
  gridApi.value.refreshServerSide()
}

// computeds
const computedContainerStyle = computed(() => {
  if (propsComponent.containerStyle) {
    return propsComponent.containerStyle
  }
  return Query64.getGlobalConfig().containerStyle
})
const computedGridStyle = computed(() => {
  if (propsComponent.gridStyle) {
    return propsComponent.gridStyle
  }
  return Query64.getGlobalConfig().gridStyle
})
const computedRowComponent = computed(() => {
  if (propsComponent.displayRowComponent) {
    return propsComponent.displayRowComponent
  }
  return Query64.getGlobalConfig().displayRowComponent
})

// lifeCycle
onMounted(async () => {
  await setupGrid();
  setupGridOptionsConfig();
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
  <div v-if="!isLoadingSettingUpGrid && gridOptions && gridFactory" :style="computedContainerStyle"
    :data-ag-theme-mode="themeMode">
    <AgGridVue :gridOptions="gridOptions" :style="computedGridStyle" />
    <Component v-if="gridApi && propsComponent.showRowCount" :is="computedRowComponent" :gridApi="gridApi"
      :rowCount="rowCountRef" />
  </div>
</template>
