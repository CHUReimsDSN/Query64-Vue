import type { ColDef } from "ag-grid-enterprise";
import type { TColumnProfil as TColumnPreference, TCustomColumn, TQuery64Config, TCustomColId, TColumnQuery64Context, TCustomColumnRegistration, TResourceColumnMetaData } from "./models";
import type { TRecord } from "./private-models";
export declare class ColumnFactory {
    resourceName: string;
    config: TQuery64Config;
    customColumnsMap: Map<TCustomColId, TCustomColumn>;
    columnsMetadataMap: Map<TCustomColId, TResourceColumnMetaData>;
    constructor(resourceName: string, columnsMetadatas: TResourceColumnMetaData[], config?: TQuery64Config, additionals?: TCustomColumnRegistration[], overloads?: TCustomColumnRegistration[]);
    getColumns(): TCustomColumn[];
    getColumnsByProfils(preferences: TColumnPreference[]): TCustomColumn[];
    getMetadataByColId(colId: TCustomColId): TResourceColumnMetaData | undefined;
    getColumnByColId(colId: TCustomColId): TCustomColumn | undefined;
    getColIdList(): string[];
    getAllColumnDepedencies(): string[];
    columnExist(colId: TCustomColId): boolean;
    private getGenericColumnString;
    private getGenericColumnNumber;
    private getGenericColumnDate;
    private getGenericColumnDatetime;
    private getGenericColumnBoolean;
    private getGenericColumnObject;
    private getGenericColumnValueGetterRelation;
    private generateSafeColDefStyle;
    private detectDeadDepedencies;
    static generateCustomColumn(column: ColDef<TRecord>, query64Context: TColumnQuery64Context): TCustomColumn;
}
