---
title: Définition API
icon: api
---

# Définition API


## TColumnPreference
```ts
export type TColumnPreference = {
  colId: string;
  width: number;
  visible: boolean;
  order: number;
  pinned?: ColDef["pinned"];
};
```


## TQuery64Config
```ts
export type TQuery64Config = {
  gridStyle: string;
  containerStyle: string;
  displayRowComponent: Component;
};
```


## TQuery64GridConfig
```ts
export type TQuery64GridConfig = {
  columnTypeConfig: Record<string, ColDef<TRecord>>;
  columnDateFormater: (dateValue: string | Date) => string;
  columnDatetimeFormater: (dateValue: string | Date) => string;
  columnHasManyRenderComponent: Component;
  translation: Record<string, string>;
  showPrimaryKeyByDefault: boolean;
  showForeignKeyByDefault: boolean;
  aggridTheme: any;
};
```


## TQuery64GetMetadataParams
```ts
export type TQuery64GetMetadataParams = {
  resourceName: string;
  context?: Record<string, unknown>;
};
```


## TQuery64GetRowsParams
```ts
export type TQuery64GetRowsParams = {
  resourceName: string;
  agGridServerParams: IServerSideGetRowsRequest;
  columnsToDisplay: string[];
  shallReturnCount: boolean;
  quickSearch: string | null;
  context?: Record<string, unknown>;
};
```


## TQuery64GridProps
```ts
export type TQuery64GridProps = {
  resourceName: string;
  initialGridParams: {
    getMetadata: (
      query64Params: TQuery64GetMetadataParams,
    ) => Promise<TResourceColumnMetaData[]>;
    getRows: (
      query64Params: TQuery64GetRowsParams,
    ) => Promise<TAggridGenericData>;
    gridOptions?: Partial<GridOptions<TRecord>>;
    additionals?: TCustomColumnRegistration[];
    overloads?: TCustomColumnRegistration[];
    gridConfig?: Partial<TQuery64GridConfig>;
    preferences?: TColumnPreference[];
    filterModel?: IServerSideGetRowsRequest["filterModel"];
    sortModel?: IServerSideGetRowsRequest["sortModel"];
    rowGroupCols?: IServerSideGetRowsRequest["rowGroupCols"];
    quickSearch?: string;
  };
  showRowCount?: boolean;
  gridStyle?: string;
  containerStyle?: string;
  displayRowComponent?: Component;
  themeMode?: TAgGridThemeMode;
  context?: Record<string, unknown>;
};
```


## TQuery64GridApi
```ts
export type TQuery64GridApi = {
  /*
   * Réinitialise les filtres, tris, ordre et groupes de la grille et re-alimente la grille en données
   */
  resetGridParams: () => void;

  /*
   * Applique des filtres, tris, ordres et groupes à la grille et re-alimente la grille en données
   */
  updateGridParams: (
    columnPreferences?: TColumnPreference[],
    filterModel?: IServerSideGetRowsRequest["filterModel"],
    sortModel?: IServerSideGetRowsRequest["sortModel"],
    rowgroupCols?: IServerSideGetRowsRequest["rowGroupCols"],
    quickSearch?: string,
    forceReset?: boolean, // default = false
  ) => void;

  /*
   * Dernier paramètre envoyer au serveur pour obtenir les lignes
   */
  getLastGetRowsParams: () => TQuery64GetRowsParams | null;

  /*
   * Déclenche le filtre rapide (filtre sur toutes les colonnes)
   */
  triggerQuickFilter: (search: string) => void | Promise<void>;

  /*
   * Contient les refs readonly de Query64Grid
   */
  refs: {
    /*
     * Référence de chargement de la grille
     */
    isLoadingSettingUpGrid: Readonly<Ref<boolean>>;

    /*
     * Référence de chargement du serveur
     */
    isLoadingServer: Readonly<Ref<boolean>>;

    /*
     *  Référence des options de la grille
     */
    gridOptions: Readonly<Ref<GridOptions<TRecord> | null>>;

    /*
     * Référence à l'API de la grille
     */
    gridApi: Readonly<Ref<GridApi<TRecord> | null>>;


    /*
    * Référence du nombre de ligne 
    */
    rowCount: Readonly<Ref<number>>;
  };
};
```
