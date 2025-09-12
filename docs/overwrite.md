---
title: Surcharge de colonne
layout: default
nav_order: 50
---

# Surcharge de colonne

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
