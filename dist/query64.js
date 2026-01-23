import { CellStyleModule, ClientSideRowModelApiModule, ClientSideRowModelModule, ColumnApiModule, ColumnAutoSizeModule, DateFilterModule, EventApiModule, InfiniteRowModelModule, LocaleModule, ModuleRegistry, NumberFilterModule, PaginationModule, RenderApiModule, RowAutoHeightModule, RowDragModule, RowStyleModule, TextFilterModule, ValidationModule, } from "ag-grid-community";
import { ColumnMenuModule, ContextMenuModule, MasterDetailModule, RowGroupingPanelModule, LicenseManager, ServerSideRowModelApiModule, ServerSideRowModelModule, SetFilterModule, } from "ag-grid-enterprise";
import { ColumnFactory } from "./column-factory";
import AgGridFrenchTranslate from "./locale.fr";
export class Query64 {
    static _instance = new Query64();
    overloads = [];
    additionals = [];
    columnTypeConfig = ColumnFactory.getColumnTypesDefaultConfig();
    translate = AgGridFrenchTranslate;
    hasRegisterKeyAndModule = false;
    static getColumnOverloadsByResourceName(resourceName) {
        return this._instance.overloads.filter((overload) => {
            return overload.resourceColumnRegister.resourceName === resourceName;
        });
    }
    static getColumnAdditionalsByResourceName(resourceName) {
        return this._instance.additionals.filter((additional) => {
            return additional.resourceName === resourceName;
        });
    }
    /**
     * Enregistre une surcharge de colonne
     * Un identifiant unique est créer par enregistrement : `resourceName` + `columnName` + `associationName`
     * Les appels successifs de cette méthode pour une même donnée viendront remplacer la valeur pour un même identifiant
     * @param resourceColumnRegister
     * @param colDef
     */
    static registerColumnOverload(resourceColumnRegister, colDef) {
        const id = `${resourceColumnRegister.resourceName}::${resourceColumnRegister.columnName}.${resourceColumnRegister.associationName}`;
        const existingOverload = this._instance.overloads.find((overload) => {
            return overload.id === id;
        });
        if (existingOverload) {
            existingOverload.colDef = colDef;
            return;
        }
        this._instance.overloads.push({
            resourceColumnRegister,
            colDef,
            id,
        });
    }
    /**
     * Enregistre une colonne additionnelle
     * Un identifiant unique est créer par enregistrement, basé sur la propriété colId de la colonne
     * Les appels successifs de cette méthode pour une même donnée viendront remplacer la valeur pour un même identifiant
     * @param resourceName
     * @param colDef
     */
    static registerColumnAdditional(resourceName, colDef) {
        const id = `additional::${colDef.colId ?? new Date().getTime()}`;
        const existingAdditional = this._instance.additionals.find((additional) => {
            return additional.id === id;
        });
        if (existingAdditional) {
            existingAdditional.colDef = colDef;
            return;
        }
        this._instance.additionals.push({
            resourceName,
            colDef,
            id,
        });
    }
    /**
     * Enregistre la clé AgGrid Enterprise et les modules nécéssaire à Query64
     * @param key
     * @param envMode
     */
    static registerAgGridKeyAndModules(key, devMode) {
        const modulesToRegister = [
            ServerSideRowModelModule,
            MasterDetailModule,
            LocaleModule,
            DateFilterModule,
            NumberFilterModule,
            TextFilterModule,
            PaginationModule,
            ContextMenuModule,
            RowStyleModule,
            CellStyleModule,
            ClientSideRowModelModule,
            InfiniteRowModelModule,
            RowDragModule,
            ClientSideRowModelApiModule,
            RenderApiModule,
            EventApiModule,
            ColumnApiModule,
            ColumnMenuModule,
            ServerSideRowModelApiModule,
            ColumnAutoSizeModule,
            RowAutoHeightModule,
            RowGroupingPanelModule,
            SetFilterModule
        ];
        if (devMode) {
            modulesToRegister.push(ValidationModule);
        }
        ModuleRegistry.registerModules(modulesToRegister);
        LicenseManager.setLicenseKey(key);
        this._instance.hasRegisterKeyAndModule = true;
    }
    static getAgGridGlobalTranslate() {
        return this._instance.translate;
    }
    static registerAgGridBlobalTranslate(translate) {
        this._instance.translate = translate;
    }
    static getColumnTypesGlobalConfig() {
        return this._instance.columnTypeConfig;
    }
    static registerColumnTypesConfig(columnTypeConfig) {
        this._instance.columnTypeConfig = columnTypeConfig;
    }
    constructor() { }
}
