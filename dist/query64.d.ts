import { ModuleRegistry } from "ag-grid-community";
import { type TLoggerConfig } from "./logger";
import type { TQuery64Config } from "./models";
import type { TCustomColumnRegistration } from "./private-models";
export declare class Query64 {
    private static _instance;
    private globalOverloadColumnsMap;
    private globalAdditionalColumnsMap;
    private globalConfig;
    private loggerConfig;
    static getGlobalAdditionalColumnsByResourceName(resourceName: string): TCustomColumnRegistration[];
    static getGlobalOverloadColumnsByResourceName(resourceName: string): TCustomColumnRegistration[];
    static registerGlobalAdditionals(resourceName: string, columnRegistrations: TCustomColumnRegistration[]): void;
    static registerGlobalOverloads(resourceName: string, columnRegistrations: TCustomColumnRegistration[]): void;
    static registerAgGridKeyAndModules(key: string, additionalModules?: Parameters<typeof ModuleRegistry.registerModules>[0]): void;
    static getGlobalConfig(): TQuery64Config;
    static registerGlobalConfig(globalConfig: Partial<TQuery64Config>): void;
    static getLoggerConfig(): TLoggerConfig;
    static registerLoggerConfig(loggerConfig: Partial<TLoggerConfig>): void;
    private constructor();
}
