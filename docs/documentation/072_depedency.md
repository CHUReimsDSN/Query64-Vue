---
title: Dépendance de colonne
---

# Dépendance de colonne

Dans les définitions de colonne additionnelle et de surcharge, il est possible d'indiquer une dépendance à d'autres colonnes.
Comme Query64 ne requête que les colonnes affichées, cela permet de demander des colonnes supplémentaires pour le bon fonctionnement des rendus.

```vue
<script setup lang="ts">
import { Query64Grid } from 'query64-vue';

const additionals = [
    {
        dependsOn: [
            'name',
            'surname',
            'soulmate.name',
            'soulmate.surname'
        ],
        colDef: {
            colid: 'couple_fullname',
            cellRenderer: ColumnCoupleFullname
        }
    }
]

</script>

<template>
  <Query64Grid :additionals="additionals" />
</template>
```

```vue
<script setup lang="ts">
// ColumnCoupleFullname.vue
import type { ICellRendererParams } from 'ag-grid-enterprise';

const propsComponent = defineProps<{
  params: ICellRendererParams
}>();
</script>

<template>
  <div>
    <div>{{ propsComponent.params.data.name }} {{ propsComponent.params.data.surname }}</div>
    <div>{{ propsComponent.params.data.soulmate.name }} {{ propsComponent.params.data.soulmate.surname }}</div>
  </div>
</template>
```
