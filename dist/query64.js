import { CellStyleModule, ClientSideRowModelApiModule, ClientSideRowModelModule, ColumnApiModule, ColumnAutoSizeModule, DateFilterModule, EventApiModule, InfiniteRowModelModule, LocaleModule, ModuleRegistry, NumberFilterModule, PaginationModule, RenderApiModule, RowAutoHeightModule, RowDragModule, RowStyleModule, TextFilterModule, themeAlpine, } from "ag-grid-community";
import { ColumnMenuModule, ContextMenuModule, MasterDetailModule, RowGroupingPanelModule, LicenseManager, ServerSideRowModelApiModule, ServerSideRowModelModule, SetFilterModule, } from "ag-grid-enterprise";
import { Query64Logger } from "./logger";
import CellDefaultListValue from "./CellDefaultListValue.vue";
import DisplayRowCountDefault from "./DisplayRowCountDefault.vue";
import { GridFactory } from "./grid-factory";
export class Query64 {
    static _instance = new Query64();
    globalOverloadColumnsMap = new Map();
    globalAdditionalColumnsMap = new Map();
    globalConfig = {
        displayRowComponent: DisplayRowCountDefault,
        gridStyle: GridFactory.defaultGridStyle(),
        containerStyle: GridFactory.defaultContainerStyle(),
    };
    globalGridConfig = {
        columnDateFormater: GridFactory.formatDateFn,
        columnDatetimeFormater: GridFactory.formatDatetimeFn,
        columnTypeConfig: GridFactory.defaultColumnTypesConfig(),
        columnHasManyRenderComponent: CellDefaultListValue,
        translation: GridFactory.getFrenchTranslate(),
        aggridTheme: themeAlpine,
    };
    loggerConfig = Query64Logger.getDefaultConfig();
    static getGlobalAdditionalColumnsByResourceName(resourceName) {
        return this._instance.globalAdditionalColumnsMap.get(resourceName) ?? [];
    }
    static getGlobalOverloadColumnsByResourceName(resourceName) {
        return this._instance.globalOverloadColumnsMap.get(resourceName) ?? [];
    }
    static registerGlobalAdditionals(resourceName, columnRegistrations) {
        const columnMapByResource = this._instance.globalAdditionalColumnsMap.get(resourceName) ?? [];
        columnMapByResource.push(...columnRegistrations);
        this._instance.globalAdditionalColumnsMap.set(resourceName, columnMapByResource);
    }
    static registerGlobalOverloads(resourceName, columnRegistrations) {
        const columnMapByResource = this._instance.globalOverloadColumnsMap.get(resourceName) ?? [];
        columnMapByResource.push(...columnRegistrations);
        this._instance.globalOverloadColumnsMap.set(resourceName, columnMapByResource);
    }
    static registerAgGridKeyAndModules(key, additionalModules = []) {
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
            SetFilterModule,
            ...additionalModules,
        ];
        ModuleRegistry.registerModules(modulesToRegister);
        LicenseManager.setLicenseKey(key);
    }
    static getGlobalGridConfig() {
        return this._instance.globalGridConfig;
    }
    static registerGlobalGridConfig(globalGridConfig) {
        this._instance.globalGridConfig = {
            ...this._instance.globalGridConfig,
            ...globalGridConfig,
        };
    }
    static getGlobalConfig() {
        return this._instance.globalConfig;
    }
    static registerGlobalConfig(globalConfig) {
        this._instance.globalConfig = {
            ...this._instance.globalConfig,
            ...globalConfig,
        };
    }
    static getLoggerConfig() {
        return this._instance.loggerConfig;
    }
    static registerLoggerConfig(loggerConfig) {
        this._instance.loggerConfig = {
            ...this.getLoggerConfig(),
            ...loggerConfig,
        };
    }
    constructor() { }
}
