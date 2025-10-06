---
title: Ajout de colonne
---

# Ajout de colonne

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

```vue
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
```vue
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
