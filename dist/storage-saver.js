export class GridSaver {
    gridPreference;
    query64Api;
    gridName;
    changeTimeout = null;
    constructor(gridPref, query64Api, gridName) {
        this.gridPreference = gridPref;
        this.query64Api = query64Api;
        this.gridName = `query64_${gridName}`;
    }
    static findOrCreate(gridName, query64Api) {
        let gridPreference = this.getFromStorage(gridName);
        if (!gridPreference) {
            gridPreference = this.getDefaultGridPref(query64Api);
        }
        const instance = new this(gridPreference, query64Api, gridName);
        return instance;
    }
    static getFromStorage(gridName) {
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
        this.query64Api.updateGridParams(this.gridPreference.columns_data, this.gridPreference.grid_params_data.filterModel, this.gridPreference.grid_params_data.sortModel, this.gridPreference.grid_params_data.rowGroupCols, "", true);
    }
    watchChanges() {
        const updateGridPreference = () => {
            const columnData = this.query64Api.refs.gridApi.value
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
            const gridParamsData = this.query64Api.getLastGetRowsParams()?.agGridServerParams;
            if (!gridParamsData) {
                return;
            }
            this.gridPreference.columns_data = columnData;
            this.gridPreference.grid_params_data = gridParamsData;
        };
        const customDebounce = (callback, delay = 300) => {
            if (this.changeTimeout) {
                clearTimeout(this.changeTimeout);
            }
            this.changeTimeout = setTimeout(() => {
                callback();
                this.changeTimeout = null;
            }, delay);
        };
        this.query64Api.refs.gridApi.value?.addEventListener("filterChanged", () => {
            customDebounce(updateGridPreference);
        });
        this.query64Api.refs.gridApi.value?.addEventListener("columnMoved", (event) => {
            if (event.finished) {
                customDebounce(updateGridPreference);
            }
        });
        this.query64Api.refs.gridApi.value?.addEventListener("columnResized", (event) => {
            if (event.finished) {
                customDebounce(updateGridPreference);
            }
        });
        this.query64Api.refs.gridApi.value?.addEventListener("columnVisible", () => {
            customDebounce(updateGridPreference);
        });
        this.query64Api.refs.gridApi.value?.addEventListener("sortChanged", () => {
            customDebounce(updateGridPreference);
        });
        this.query64Api.refs.gridApi.value?.addEventListener("columnRowGroupChanged", () => {
            customDebounce(updateGridPreference);
        });
        this.query64Api.refs.gridApi.value?.addEventListener("columnPivotChanged", () => {
            customDebounce(updateGridPreference);
        });
        this.query64Api.refs.gridApi.value?.addEventListener("columnPinned", () => {
            customDebounce(updateGridPreference);
        });
    }
    static getDefaultGridPref(query64Api) {
        return {
            columns_data: query64Api.refs.gridApi.value
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
            grid_params_data: query64Api.getLastGetRowsParams()?.agGridServerParams ?? {},
        };
    }
}
