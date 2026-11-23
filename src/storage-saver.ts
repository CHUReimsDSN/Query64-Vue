import type { ColDef, IServerSideGetRowsRequest } from "ag-grid-community";
import type { TQuery64GridApi } from "./models";

export type TSaverStrategy = 'none' | 'storage'

type TGridPreference = {
  columns_data: TGridPreferencesColumnData[];
  grid_params_data: Partial<IServerSideGetRowsRequest>;
};
type TGridPreferencesColumnData = {
  colId: string;
  width: number;
  visible: boolean;
  order: number;
  pinned: ColDef["pinned"];
};

export class GridSaver {
  private gridPreference: TGridPreference;
  private query64Api: TQuery64GridApi;
  private gridName: string;
  private changeTimeout: NodeJS.Timeout | null = null;

  private constructor(
    gridPref: TGridPreference,
    query64Api: TQuery64GridApi,
    gridName: string,
  ) {
    this.gridPreference = gridPref;
    this.query64Api = query64Api;
    this.gridName = `query64_${gridName}`;
  }

  static findOrCreate(
    gridName: string,
    query64Api: TQuery64GridApi,
  ): GridSaver {
    let gridPreference = this.getFromStorage(gridName);
    if (!gridPreference) {
      gridPreference = this.getDefaultGridPref(query64Api);
    }
    const instance = new this(gridPreference, query64Api, gridName);
    return instance;
  }

  private static getFromStorage(gridName: string): TGridPreference | null {
    const item = localStorage.getItem(gridName);
    if (!item) {
      return null;
    }
    return JSON.parse(item);
  }

  saveToStorage() {
    localStorage.setItem(this.gridName, JSON.stringify(this.gridPreference));
  }

  applyPreferenceToGrid() {
    this.query64Api.updateGridParams(
      this.gridPreference.columns_data,
      this.gridPreference.grid_params_data.filterModel,
      this.gridPreference.grid_params_data.sortModel,
      this.gridPreference.grid_params_data.rowGroupCols,
      "",
      true,
    );
  }

  watchChanges() {
    const updateGridPreference = () => {
      const columnData =
        this.query64Api.refs.gridApi.value
          ?.getAllGridColumns()
          .map((column, indexColumn) => {
            return {
              colId: column.getColId(),
              width: column.getActualWidth(),
              visible: column.isVisible(),
              order: indexColumn,
              pinned: column.getPinned(),
            };
          }) ?? [];
      const gridParamsData =
        this.query64Api.getLastGetRowsParams()?.agGridServerParams;
      if (!gridParamsData) {
        return;
      }
      this.gridPreference.columns_data = columnData;
      this.gridPreference.grid_params_data = gridParamsData;
    };
    const customDebounce = (callback: () => unknown, delay = 300) => {
      if (this.changeTimeout) {
        clearTimeout(this.changeTimeout);
      }
      this.changeTimeout = setTimeout(() => {
        callback();
        this.changeTimeout = null;
      }, delay);
    };
    this.query64Api.refs.gridApi.value?.addEventListener(
      "filterChanged",
      () => {
        customDebounce(updateGridPreference);
      },
    );
    this.query64Api.refs.gridApi.value?.addEventListener(
      "columnMoved",
      (event) => {
        if (event.finished) {
          customDebounce(updateGridPreference);
        }
      },
    );
    this.query64Api.refs.gridApi.value?.addEventListener(
      "columnResized",
      (event) => {
        if (event.finished) {
          customDebounce(updateGridPreference);
        }
      },
    );
    this.query64Api.refs.gridApi.value?.addEventListener(
      "columnVisible",
      () => {
        customDebounce(updateGridPreference);
      },
    );
    this.query64Api.refs.gridApi.value?.addEventListener("sortChanged", () => {
      customDebounce(updateGridPreference);
    });
    this.query64Api.refs.gridApi.value?.addEventListener(
      "columnRowGroupChanged",
      () => {
        customDebounce(updateGridPreference);
      },
    );
    this.query64Api.refs.gridApi.value?.addEventListener(
      "columnPivotChanged",
      () => {
        customDebounce(updateGridPreference);
      },
    );
    this.query64Api.refs.gridApi.value?.addEventListener("columnPinned", () => {
      customDebounce(updateGridPreference);
    });
  }

  private static getDefaultGridPref(
    query64Api: TQuery64GridApi,
  ): TGridPreference {
    return {
      columns_data:
        query64Api.refs.gridApi.value
          ?.getAllGridColumns()
          .map((column, indexColumn) => {
            return {
              colId: column.getColId(),
              width: column.getActualWidth(),
              visible: column.isVisible(),
              order: indexColumn,
              pinned: column.getPinned(),
            };
          }) ?? [],
      grid_params_data:
        query64Api.getLastGetRowsParams()?.agGridServerParams ?? {},
    };
  }
}
