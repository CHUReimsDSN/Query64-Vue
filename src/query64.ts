import {
  CellStyleModule,
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColumnApiModule,
  ColumnAutoSizeModule,
  DateFilterModule,
  EventApiModule,
  InfiniteRowModelModule,
  LocaleModule,
  ModuleRegistry,
  NumberFilterModule,
  PaginationModule,
  RenderApiModule,
  RowAutoHeightModule,
  RowDragModule,
  RowStyleModule,
  TextFilterModule,
  themeAlpine,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  MasterDetailModule,
  RowGroupingPanelModule,
  LicenseManager,
  ServerSideRowModelApiModule,
  ServerSideRowModelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { Logger, type TLoggerConfig } from "./logger";
import type { TQuery64Config } from "./models";
import { Utils } from "./utils";
import CellDefaultListValue from "./CellDefaultListValue.vue";
import type { TCustomColumnRegistration } from "./private-models";

export class Query64 {
  private static _instance: Query64 = new Query64();
  private globalOverloadColumnsMap: Map<string, TCustomColumnRegistration[]> =
    new Map();
  private globalAdditionalColumnsMap: Map<string, TCustomColumnRegistration[]> =
    new Map();
  private globalConfig: TQuery64Config = {
    columnDateFormater: Utils.formatDate,
    columnDatetimeFormater: Utils.formatDatetime,
    columnTypeConfig: Utils.columnTypesConfig(),
    columnHasManyRenderComponent: CellDefaultListValue,
    translation: Utils.getFrenchTranslate(),
    aggridTheme: themeAlpine
  };
  private loggerConfig: TLoggerConfig = Logger.getDefaultConfig();

  static getGlobalAdditionalColumnsByResourceName(
    resourceName: string,
  ): TCustomColumnRegistration[] {
    return this._instance.globalAdditionalColumnsMap.get(resourceName) ?? [];
  }

  static getGlobalOverloadColumnsByResourceName(
    resourceName: string,
  ): TCustomColumnRegistration[] {
    return this._instance.globalOverloadColumnsMap.get(resourceName) ?? [];
  }

  static registerGlobalAdditionals(
    resourceName: string,
    columnRegistrations: TCustomColumnRegistration[],
  ) {
    const columnMapByResource =
      this._instance.globalAdditionalColumnsMap.get(resourceName) ?? [];
    columnMapByResource.push(...columnRegistrations);
    this._instance.globalAdditionalColumnsMap.set(
      resourceName,
      columnMapByResource,
    );
  }

  static registerGlobalOverloads(
    resourceName: string,
    columnRegistrations: TCustomColumnRegistration[],
  ) {
    const columnMapByResource =
      this._instance.globalOverloadColumnsMap.get(resourceName) ?? [];
    columnMapByResource.push(...columnRegistrations);
    this._instance.globalOverloadColumnsMap.set(
      resourceName,
      columnMapByResource,
    );
  }

  static registerAgGridKeyAndModules(
    key: string,
    additionalModules: Parameters<
      typeof ModuleRegistry.registerModules
    >[0] = [],
  ) {
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

  static getGlobalConfig() {
    return this._instance.globalConfig;
  }
  static registerGlobalConfig(globalConfig: Partial<TQuery64Config>) {
    this._instance.globalConfig = {
      ...this._instance.globalConfig,
      ...globalConfig,
    };
  }

  static getLoggerConfig() {
    return this._instance.loggerConfig;
  }

  static registerLoggerConfig(loggerConfig: Partial<TLoggerConfig>) {
    this._instance.loggerConfig = {
      ...this.getLoggerConfig(),
      ...loggerConfig,
    };
  }

  private constructor() {}
}
