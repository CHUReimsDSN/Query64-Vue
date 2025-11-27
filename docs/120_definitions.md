---
title: Définitions
---

# Définitions

## TQuery64GridExpose
```typescript
type TQuery64GridExpose<T = object> = {
  /*
  * Réinitialise les filtres, tris, ordre et groupes de la grille et re-alimente la grille en données 
  */
  resetGridParams: () => void;

  /*
  * Applique des filtres, tris, ordres et groupes à la grille et re-alimente la grille en données 
  */
  updateGridParams: (
    columnProfils?: TResourceColumnProfil[],
    filterModel?: IServerSideGetRowsRequest["filterModel"],
    sortModel?: IServerSideGetRowsRequest["sortModel"],
    rowgroupCols?: IServerSideGetRowsRequest["rowGroupCols"]
  ) => void;

  /*
  *  Accès aux options de la grille
  */
  gridOptions: GridOptions<T>;

  /*
  * Accès à l'API de la grille  
  */
  gridApi: GridApi<T> | undefined;

  /*
  * Dernier paramètre envoyer au serveur pour obtenir les lignes
  */
  lastGetRowsParams: TQuery64GetRowsParams | null;

  /*
  * Référence de chargement de la grille
  */
  isLoadingSettingUpGrid: boolean;
};
```

