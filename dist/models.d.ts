import { ColDef, GridApi, GridOptions, IServerSideGetRowsRequest } from "ag-grid-community";
import { Component } from "vue";
import { TResourceColumnOverload } from "./query64";
import type { TRecord } from "./private-models";
export type TAggridGenericData<T = TRecord> = {
    items: T[];
    length: number;
};
export type TResourceColumnMetaData = {
    raw_field_name: string;
    field_name: string;
    label_name: string;
    field_type: "string" | "number" | "date" | "boolean" | "object";
    association_name: string | null;
    association_type: string | null;
    association_class_name: string | null;
};
export type TResourceColumnProfil = {
    field_name: string;
    width: number;
    visible: boolean;
    order: number;
};
export type TGlobalColumnProps = {
    columnTypeConfig?: Record<string, ColDef>;
    columnDateFormater?: (dateValue: string | Date) => string;
};
export type TActionColumnProps = {
    defaultComponent: Component;
};
export type THasManyColumnProps = {
    purgeNullValue: boolean;
    customComponent: Component;
};
export type TOverloadsProps = {
    resourceColumnRegister: Omit<TResourceColumnOverload, "resourceName">;
    colDef: ColDef;
};
export type TAdditionalsProps = {
    colDef: ColDef;
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
export type TQuery64GridProps<T = TRecord> = {
    resourceName: string;
    getMetadata: (query64Params: TQuery64GetMetadataParams) => Promise<TResourceColumnMetaData[]>;
    getRows: (query64Params: TQuery64GetRowsParams) => Promise<TAggridGenericData<T>>;
    showRowCount?: boolean;
    aggridTheme?: any;
    aggridThemeMode?: "light" | "dark" | "dark-blue";
    gridStyle?: string;
    globalColumnSettings?: TGlobalColumnProps;
    hasManyColumnSettings?: THasManyColumnProps;
    actionColumnSettings?: TActionColumnProps;
    overloads?: TOverloadsProps[];
    additionals?: TAdditionalsProps[];
    initialGridParams?: {
        gridOptions?: GridOptions<T>;
        columnProfils?: TResourceColumnProfil[];
        filterModel?: IServerSideGetRowsRequest["filterModel"];
        sortModel?: IServerSideGetRowsRequest["sortModel"];
        rowGroupCols?: IServerSideGetRowsRequest["rowGroupCols"];
    };
    context?: Record<string, unknown>;
};
/**
 * @exportToDoc
 */
export type TQuery64GridExpose<T = TRecord> = {
    resetGridParams: () => void;
    updateGridParams: (columnProfils?: TResourceColumnProfil[], filterModel?: IServerSideGetRowsRequest["filterModel"], sortModel?: IServerSideGetRowsRequest["sortModel"], rowgroupCols?: IServerSideGetRowsRequest["rowGroupCols"]) => void;
    gridOptions: GridOptions<T>;
    gridApi: GridApi<T> | undefined;
    getLastGetRowsParams: () => TQuery64GetRowsParams | null;
    isLoadingSettingUpGrid: boolean;
    triggerQuickFilter: (search: string) => void | Promise<void>;
};
