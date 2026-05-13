import type { ColDef } from "ag-grid-community";
import type { TCustomColId } from "./models";
export type TRecord = Record<string, unknown> & {
    id: number;
};
export type TAggridGenericData = {
    items: TRecord[];
    length: number;
};
export type TResourceColumnMetaData = {
    raw_field_name: string;
    field_name: TCustomColId;
    label_name: string;
    field_type: "string" | "number" | "date" | "datetime" | "boolean" | "object";
    association_name: string | null;
    association_type: 'belongs_to' | 'has_one' | 'has_many' | 'has_and_belongs_to_many' | null;
    association_class_name: string | null;
};
export type TCustomColumnRegistration = {
    dependsOn?: TCustomColId[];
    colDef: ColDef<TRecord> & {
        colId: TCustomColId;
    };
};
