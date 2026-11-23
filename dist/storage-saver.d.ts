import type { TQuery64GridApi } from "./models";
export type TSaverStrategy = 'none' | 'storage';
export declare class GridSaver {
    private gridPreference;
    private query64Api;
    private gridName;
    private changeTimeout;
    private constructor();
    static findOrCreate(gridName: string, query64Api: TQuery64GridApi): GridSaver;
    private static getFromStorage;
    saveToStorage(): void;
    applyPreferenceToGrid(): void;
    watchChanges(): void;
    private static getDefaultGridPref;
}
