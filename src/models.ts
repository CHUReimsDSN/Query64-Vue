import type {
  ColDef,
  GridApi,
  GridOptions,
  IServerSideGetRowsRequest,
} from "ag-grid-community";
import { Component, type Ref } from "vue";
import type {
  TAggridGenericData,
  TCustomColumnRegistration,
  TRecord,
  TResourceColumnMetaData,
} from "./private-models";

/**
 * @exportToDoc
 */
export type TColumnProfil = {
  colId: string;
  width: number;
  visible: boolean;
  order: number;
  pinned?: 'right' | 'left' | undefined;
};

/**
 * @exportToDoc
 */
export type TQuery64Config = {
  columnTypeConfig: Record<string, ColDef<TRecord>>;
  columnDateFormater: (dateValue: string | Date) => string;
  columnDatetimeFormater: (dateValue: string | Date) => string;
  columnHasManyRenderComponent: Component;
  translation: Record<string, string>;
};

export type TCustomColId = string;

export type TColumnQuery64Context = {
  type: "generated" | "add" | "overload";
  dependsOn?: TCustomColId[];
};

export type TCustomColumn = ColDef<TRecord> & {
  colId: TCustomColId;
  query64Context: TColumnQuery64Context;
  context: Record<string, unknown>;
};

/**
 * @exportToDoc
 */
export type TQuery64GetMetadataParams = {
  resourceName: string;
  context?: Record<string, unknown>;
};

/**
 * @exportToDoc
 */
export type TQuery64GetRowsParams = {
  resourceName: string;
  agGridServerParams: IServerSideGetRowsRequest;
  columnsToDisplay: string[];
  shallReturnCount: boolean;
  quickSearch: string | null;
  context?: Record<string, unknown>;
};

/**
 * @exportToDoc
 */
export type TQuery64GridProps = {
  resourceName: string;
  getMetadata: (
    query64Params: TQuery64GetMetadataParams,
  ) => Promise<TResourceColumnMetaData[]>;
  getRows: (
    query64Params: TQuery64GetRowsParams,
  ) => Promise<TAggridGenericData>;
  showRowCount?: boolean;
  aggridTheme?: any;
  aggridThemeMode?: "light" | "dark" | "dark-blue";
  gridStyle?: string;
  config?: TQuery64Config;
  additionals?: TCustomColumnRegistration[];
  overloads?: TCustomColumnRegistration[];
  initialGridParams?: {
    gridOptions?: GridOptions<TRecord>;
    columnProfils?: TColumnProfil[];
    filterModel?: IServerSideGetRowsRequest["filterModel"];
    sortModel?: IServerSideGetRowsRequest["sortModel"];
    rowGroupCols?: IServerSideGetRowsRequest["rowGroupCols"];
  };
  context?: Record<string, unknown>;
};

/**
 * @exportToDoc
 */
export type TQuery64GridApi<T = TRecord> = {
  /*
   * Réinitialise les filtres, tris, ordre et groupes de la grille et re-alimente la grille en données
   */
  resetGridParams: () => void;

  /*
   * Applique des filtres, tris, ordres et groupes à la grille et re-alimente la grille en données
   */
  updateGridParams: (
    columnProfils?: TColumnProfil[],
    filterModel?: IServerSideGetRowsRequest["filterModel"],
    sortModel?: IServerSideGetRowsRequest["sortModel"],
    rowgroupCols?: IServerSideGetRowsRequest["rowGroupCols"],
    forceReset?: boolean, // default = false
  ) => void;

  /*
   *  Accès aux options de la grille
   */
  gridOptions: Ref<GridOptions<T> | null>;

  /*
   * Accès à l'API de la grille
   */
  gridApi: Ref<GridApi<T> | null>;

  /*
   * Dernier paramètre envoyer au serveur pour obtenir les lignes
   */
  getLastGetRowsParams: () => TQuery64GetRowsParams | null;

  /*
   * Référence de chargement de la grille
   */
  isLoadingSettingUpGrid: Ref<boolean>;

  /*
   * Référence de chargement du serveur
   */
  isLoadingServer: Ref<boolean>;

  /*
   * Déclenche le filtre rapide (filtre sur toutes les colonnes)
   */
  triggerQuickFilter: (search: string) => void | Promise<void>;
};
