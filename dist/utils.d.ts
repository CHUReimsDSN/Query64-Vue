import type { ColDef } from "ag-grid-community";
import type { TRecord } from "./private-models";
export declare abstract class Utils {
    static formatDate(dateValue: string | Date): string;
    static formatDatetime(dateValue: string | Date): string;
    static columnTypesConfig(): Record<string, ColDef<TRecord>>;
    static gridStyle(): string;
    static getFrenchTranslate(): Record<string, string>;
}
