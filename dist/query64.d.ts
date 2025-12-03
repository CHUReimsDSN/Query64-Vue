import { ColDef } from "ag-grid-community";
export type TResourceColumnOverload = {
    resourceName: string;
    columnName: string;
    associationName?: string;
};
export type TColumnOverload = {
    resourceColumnRegister: TResourceColumnOverload;
    colDef: ColDef;
    id: string;
};
export type TColumnAdditional = {
    resourceName: string;
    colDef: ColDef;
    id: string;
};
export declare class Query64 {
    private static _instance;
    private overloads;
    private additionals;
    private hasRegisterKeyAndModule;
    static getColumnOverloadsByResourceName(resourceName: string): TColumnOverload[];
    static getColumnAdditionalsByResourceName(resourceName: string): TColumnAdditional[];
    /**
     * Enregistre une surcharge de colonne
     * Un identifiant unique est créer par enregistrement : `resourceName` + `columnName` + `associationName`
     * Les appels successifs de cette méthode pour une même donnée viendront remplacer la valeur pour un même identifiant
     * @param resourceColumnRegister
     * @param colDef
     */
    static registerColumnOverload(resourceColumnRegister: TResourceColumnOverload, colDef: ColDef): void;
    /**
     * Enregistre une colonne additionnelle
     * Un identifiant unique est créer par enregistrement, basé sur la propriété colId de la colonne
     * Les appels successifs de cette méthode pour une même donnée viendront remplacer la valeur pour un même identifiant
     * @param resourceName
     * @param colDef
     */
    static registerColumnAdditional(resourceName: string, colDef: ColDef): void;
    /**
     * Enregistre la clé AgGrid Enterprise et les modules nécéssaire à Query64
     * @param key
     * @param envMode
     */
    static registerAgGridKeyAndModules(key: string, devMode?: boolean): void;
    static getColumnTypesDefaultConfig(): Record<string, ColDef<any, any>>;
    static getAgGridFrenchTranslate(): Record<string, string>;
    private constructor();
}
