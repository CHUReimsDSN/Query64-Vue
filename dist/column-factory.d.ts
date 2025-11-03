import type { ColDef } from "ag-grid-enterprise";
import { TResourceColumnProfil, TResourceColumnMetaData, TAdditionalsProps, TOverloadsProps, TGlobalColumnProps, THasManyColumnProps, TActionColumnProps } from "./models";
export declare class ColumnFactory {
    private static getColumnTypesDefaultConfig;
    resourceName: string;
    globalColumnSettings: TGlobalColumnProps & {
        columnTypeConfig: Record<string, ColDef>;
    };
    hasManyColumnSettings: THasManyColumnProps;
    actionColumnSettings?: TActionColumnProps;
    overloadSettings: TOverloadsProps[];
    additionalSettings: TAdditionalsProps[];
    constructor(resourceName: string, globalColumnProps?: TGlobalColumnProps, hasManyColumnProps?: THasManyColumnProps, actionColumnProps?: TActionColumnProps, overloadProps?: TOverloadsProps[], additionalProps?: TAdditionalsProps[]);
    getResourceColumnsDefault<T>(resourceMetaDatas: TResourceColumnMetaData[], resourceName: string): ColDef<T>[];
    getResourceColumnsByProfils<T>(columnData: TResourceColumnProfil[], resourceMetaDatas: TResourceColumnMetaData[], resourceName: string): ColDef<T>[];
    private getAllResourceColumns;
    private getGenericColumnAction;
    private getGenericColumnString;
    private getGenericColumnNumber;
    private getGenericColumnDate;
    private getGenericColumnBoolean;
    private getGenericColumnObject;
    private getGenericColumnValueGetterRelation;
    private generateSafeColDefStyle;
}
