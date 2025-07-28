<div align="center">
  <img src="./assets/logo.png" alt="Query64 Vue Logo" width="200" />
</div>

# Query64 - Vue

Query64 donne accès à l'exploitation des données des modèles d'un serveur backend par les filtres de l'AgGrid.  
L'outil met à disposition : 
- définition automatique des colonnes par ressource
- système de surcharge de colonne
- système d'ajout de colonne
- système de modification sur mesure sur les grilles

Cette bibliothèque complémente et est destinée à être utilisé avec Query64 - Rails.

- [Installation](#installation)
- [Utilisation](#utilisation)
- [Surcharge de colonne](#surcharge-de-colonne)
- [Ajout de colonne](#ajout-de-colonne)
- [Méthodes de référence](#méthodes-de-référence)
- [Exemples](#exemples)
- [Contributer](#contribuer)

<br /><br />

## Installation

L'installation du paquet nécessite l'accès au Gitlab.  
**Note :** nécessite les prérequis suivants :  
- AgGrid Enterprise `>= 33.0.2`
- VueJS ` >= 3.0`


``` typescript
// package.json
{
  "dependencies": {
    "query64-vue": "git+ssh://git@github.com:CHUReimsDSN/Query64-Vue.git"
  }
}
```
```sh
npm install
```

<br /><br />

## Utilisation
Enregistrement de la clé et des modules AgGrid.
Il est préferable d'utiliser cette méthode une unique fois dans le client.

```typescript
// src/boot/query64.ts
import { Query64 } from 'query64-vue'

Query64.registerAgGridKeyAndModules('myAgGridKey')
```

Utilisation du composant :
```typescript
<script setup lang="ts">
import type { IServerSideGetRowsRequest } from 'ag-grid-enterprise';
import type { 
  TAggridGenericData,   
  TQuery64GetMetadataParams,
  TQuery64GetRowsParams
} from 'query64-vue';
import { Query64Grid } from 'query64-vue';

async function getMetadata(query64MetadataParams: TQuery64GetMetadataParams) {
  return (
    await api.post('mon-api/get-metadata', {
      query64Params: query64MetadataParams,
    })
  ).data;
}

async function getRows(
  query64RowParams: TQuery64GetRowsParams
): Promise<TAggridGenericData> {
  return (
    await api.post('mon-api/get-rows', {
      query64Params: query64RowParams,
    })
  ).data;
}
</script>

<template>
  <Query64Grid style="height: 50vh;" resourceName="User" :getMetadata="getMetadata" :getRows="getRows" />
</template>
```

<br /><br />

## Surcharge de colonne
Il est possible de surcharger les colonnes génerées par Query64 de deux manières différentes : globalement et localement

### Surcharge globale
La surcharge globale permet de surcharger une colonne pour une ressource pour toute l'application.
Peu import si une ou plusieurs grilles de Query64 pointent sur la même ressource, la surcharge aura lieu sur toutes ces grilles.


Exemple avec composant custom : 
```typescript
// Ici la colonne 'id_res' de la ressource 'User' sera remplacer par la nouvelle définition
Query64.registerColumnOverload({
    resourceName: 'User'
    columnName: 'id_res'
  },
  {
      width: 200,
      cellRenderer: CellCustomIdRes
  }
)
```

```typescript
<script setup lang="ts">
// CellCustomIdRes.vue
// Les données de la ligne sont passer en props automatiquement au composant de la cellule

import type { ICellRendererParams } from 'ag-grid-enterprise';

const propsComponent = defineProps<{
  params: ICellRendererParams
}>();
</script>

<template>
  <div style="background-color: green;">
    {{ propsComponent.params.data.id_res }} but everything is customizable!
  </div>
</template>
```
### Surchage locale
La surcharge locale permet de surcharger les colonnes d'une ressource pour une grille unique.

Exemple avec un composant custom :
```typescript
// Ici la colonne 'id_res' de la ressource 'User' sera remplacer par la nouvelle définition
<script setup lang="ts">
import { Query64Grid } from 'query64-vue';

const userColumnOverloads = [
  {
    resourceColumnRegister: {
        columnName: 'id_res'
    },
    colDef:  {
      width: 200,
      cellRenderer: CellCustomIdRes
    }
  }
]
</script>

<template>
  <Query64Grid resourceName="User" :overloads="userColumnOverloads" />
</template>
```

```typescript
<script setup lang="ts">
// CellCustomIdRes.vue
// Les données de la ligne sont passer en props automatiquement au composant de la cellule

import type { ICellRendererParams } from 'ag-grid-enterprise';

const propsComponent = defineProps<{
  params: ICellRendererParams
}>();
</script>

<template>
  <div style="background-color: green;">
    {{ propsComponent.params.data.id_res }} but everything is customizable!
  </div>
</template>
```

<br /><br />


## Ajout de colonne

Comme la surcharge, il est possible d'ajouter des colonnes de deux manières différentes : globalement et localement

### Ajout global
L'ajout global permet d'ajouter une colonne pour une ressource pour toute l'application.
Peu import si une ou plusieurs grilles de Query64 pointent sur la même ressource, l'ajout aura lieu sur toutes ces grilles.

Exemple avec un composant custom :
```typescript
// Ici la colonne 'myAdditionalColumn' sera ajouter à toute les grilles pour la resource 'User'
Query64.registerColumnAdditional('User'
 {
    colId: 'myAdditionalColumn',
    width: 200,
    cellRenderer: CellCustomAdditionalColumn
 }
)
```

```typescript
<script setup lang="ts">
// CellCustomAdditionalColumn.vue
// Les données de la ligne sont passer en props automatiquement au composant de la cellule

import type { ICellRendererParams } from 'ag-grid-enterprise';

const propsComponent = defineProps<{
  params: ICellRendererParams
}>();
</script>

<template>
  <div style="background-color: purple;">
    {{ propsComponent.params.data.id_res === propsComponent.params.data.id_res_bis 'OK' : 'PAS OK' }}
  </div>
</template>
```

### Ajout local
L'ajout local permet d'ajouter des colonnes sur une ressource pour une grille unique.

Exemple :
```typescript
// Ici la colonne 'myAdditionalColumn' sera ajouter uniquement à la grille composant
<script setup lang="ts">
import { Query64Grid } from 'query64-vue';

const userColumnAdditionals = [
  {
    colId: 'myAdditionalColumn',
    width: 200,
  }
]
</script>

<template>
  <Query64Grid resourceName="User" :additionals="userColumnAdditionals" />
</template>
```

<br /><br />

## Méthodes de référence
Il est possible de définir une référence sur le composant Query64Grid afin d'accèder à des méthodes ou données utilitaires.

- `resetGridParams` Réinitialise les filtres, tris, ordre et groupes de la grille et re-alimente la grille en données  
- `updateGridParams` Applique des filtres, tris, ordres et groupes à la grille et re-alimente la grille en données 
- `gridOptions` Accès aux options de la grille
- `gridApi` Accès à l'API de la grille  
- `lastGetRowsParams` Dernier paramètre AgGrid envoyer au serveur  
- `isLoadingSettingUpGrid` Référence de chargement de la grille

Exemple d'accès à la gridApi :
```typescript
<script setup lang="ts">
import { Query64Grid } from 'query64-vue';
import type { TQuery64GridExpose } from 'query64-vue';

// DEPRECIATED : TQuery64GridExpose
const query64Grid = ref<TQuery64GridExpose>()

function example() {
  if (!query64Grid.value) return
  gridApi = query64Grid.value.gridApi
  // ... more code
}
</script>

<template>
  <Query64Grid ref="query64Grid" />
</template>
```

<br /><br />

## Exemples

Exemple pour définir une colonne par défaut sur une grille précise : 
```typescript
<script setup lang="ts">
import { Query64Grid } from 'query64-vue';
import MyActionColumn from './MyActionColumn.vue'

const actionColumnSettings = {
  defaultComponent: MyActionColumn
}
</script>

<template>
  <Query64Grid :actionColumnSettings="actionColumnSettings" />
</template>
```


Exemple système de préferences utilisateur : 
```typescript
<script setup lang="ts">
import { Query64Grid } from 'query64-vue';

const preference = {
  columnProfils: [
    {
      "order": 0,
      "width": 100,
      "visible": true,
      "field_name": "id"
    },
    {
      "order": 1,
      "width": 140,
      "visible": false,
      "field_name": "id_res"
    },
  ],
  filterModel: {},
  sortModel: {},
  rowGroupCols: {}
}
</script>

<template>
  <Query64Grid :initialGridParams="preference" />
</template>
```



Exemple de surcharge des gridOptions : 
```typescript
<script setup lang="ts">
import { Query64Grid } from 'query64-vue';
import type { GridOptions } from 'ag-grid-enterprise';

const gridOptions: GridOptions = {
  cacheBlockSize: 100,
  rowHeight: 60
}
</script>

<template>
  <Query64Grid :initialGridParams="{
      gridOptions
    }"
  />
</template>
```

Exemple de définition de contexte : 
```typescript

<script setup lang="ts">
import { Query64Grid } from 'query64-vue';
import type { GridOptions } from 'ag-grid-enterprise';

const context = {
  template: 'Template1'
}
</script>

<template>
  <Query64Grid :context="context"
  />
</template>
```

<br /><br />

## Contribuer

Vous devez vous assurer d'avoir les paquets suivants :

- `npm install -D vue@3 @vitejs/plugin-vue typescript vite`  
- `npm install -D @vue/compiler-sfc`  

Installer les dépendances : `npm install`  

Build le paquet avant de push : `npm run build`  
