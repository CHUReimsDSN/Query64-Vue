---
title: Démarage rapide
layout: default
nav_order: 40
---
# Démarrage rapide

Query64 fonctionne sur [AgGrid](https://www.ag-grid.com/).  
Certaines fonctionnalité de Query64 nécéssite la version _Enterprise_. 
Il est donc nécessaire d'enregistrer la clé de license et les modules AgGrid.  
Il est préferable d'utiliser cette méthode une unique fois dans le client.  

```ts
// src/boot/query64.ts
import { Query64 } from 'query64-vue'

Query64.registerAgGridKeyAndModules('myAgGridKey')
```

Utiliser le composant `Query64Grid` pour afficher la grille :

```vue
<script setup lang="ts">
import { Query64Grid } from 'query64-vue';
</script>

<template>
  <Query64Grid 
    style="height: 50vh;" 
    resourceName="MaRessource" 
    :getMetadata="getMetadataQuery64" 
    :getRows="getRowsQuery64" 
  />
</template>
```

Obtenir les informations via HTTP (ici avec Axios) :
```ts
import type { 
  TAggridGenericData,   
  TQuery64GetMetadataParams,
  TQuery64GetRowsParams
} from 'query64-vue';
import { api } from 'boot/axios';

export async function getMetadataQuery64(
  query64MetadataParams: TQuery64GetMetadataParams
) {
  return (
    await api.post('my-api/get-metadata-query64', {
      query64Params: query64MetadataParams,
    })
  ).data;
}

export async function getRowsQuery64(
  query64RowParams: TQuery64GetRowsParams
): Promise<TAggridGenericData> {
  return (
    await api.post('my-api/get-rows-query64', {
      query64Params: query64RowParams,
    })
  ).data;
}
```
