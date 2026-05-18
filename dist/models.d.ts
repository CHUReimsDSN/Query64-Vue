import type { ColDef, GridApi, GridOptions, IServerSideGetRowsRequest } from "ag-grid-community";
import { Component, type Ref } from "vue";
import type { TAggridGenericData, TCustomColumnRegistration, TRecord, TResourceColumnMetaData } from "./private-models";
/**
 * @exportToDoc
 */
export type TColumnProfil = {
    colId: string;
    width: number;
    visible: boolean;
    order: number;
    pinned?: 'right' | 'left' | undefined;
};
/**
 * @exportToDoc
 */
export type TQuery64Config = {
    columnTypeConfig: Record<string, ColDef<TRecord>>;
    columnDateFormater: (dateValue: string | Date) => string;
    columnDatetimeFormater: (dateValue: string | Date) => string;
    columnHasManyRenderComponent: Component;
    translation: Record<string, string>;
    aggridTheme: any;
};
export type TCustomColId = string;
export type TColumnQuery64Context = {
    type: "generated" | "add" | "overload";
    dependsOn?: TCustomColId[];
};
export type TCustomColumn = ColDef<TRecord> & {
    colId: TCustomColId;
    query64Context: TColumnQuery64Context;
    context: Record<string, unknown>;
};
/**
 * @exportToDoc
 */
export type TQuery64GetMetadataParams = {
    resourceName: string;
    context?: Record<string, unknown>;
};
/**
 * @exportToDoc
 */
export type TQuery64GetRowsParams = {
    resourceName: string;
    agGridServerParams: IServerSideGetRowsRequest;
    columnsToDisplay: string[];
    shallReturnCount: boolean;
    quickSearch: string | null;
    context?: Record<string, unknown>;
};
/**
 * @exportToDoc
 */
export type TQuery64GridProps = {
    resourceName: string;
    getMetadata: (query64Params: TQuery64GetMetadataParams) => Promise<TResourceColumnMetaData[]>;
    getRows: (query64Params: TQuery64GetRowsParams) => Promise<TAggridGenericData>;
    showRowCount?: boolean;
    aggridTheme?: any;
    aggridThemeMode?: "light" | "dark" | "dark-blue";
    gridStyle?: string;
    config?: TQuery64Config;
    additionals?: TCustomColumnRegistration[];
    overloads?: TCustomColumnRegistration[];
    initialGridParams?: {
        gridOptions?: GridOptions<TRecord>;
        columnProfils?: TColumnProfil[];
        filterModel?: IServerSideGetRowsRequest["filterModel"];
        sortModel?: IServerSideGetRowsRequest["sortModel"];
        rowGroupCols?: IServerSideGetRowsRequest["rowGroupCols"];
    };
    context?: Record<string, unknown>;
};
/**
 * @exportToDoc
 */
export type TQuery64GridApi<T = TRecord> = {
    resetGridParams: () => void;
    updateGridParams: (columnProfils?: TColumnProfil[], filterModel?: IServerSideGetRowsRequest["filterModel"], sortModel?: IServerSideGetRowsRequest["sortModel"], rowgroupCols?: IServerSideGetRowsRequest["rowGroupCols"], forceReset?: boolean) => void;
    gridOptions: Ref<GridOptions<T> | null>;
    gridApi: Ref<GridApi<T> | null>;
    getLastGetRowsParams: () => TQuery64GetRowsParams | null;
    isLoadingSettingUpGrid: Ref<boolean>;
    isLoadingServer: Ref<boolean>;
    triggerQuickFilter: (search: string) => void | Promise<void>;
};
