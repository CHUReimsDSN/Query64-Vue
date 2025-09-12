---
title: Préferences utilisateur
layout: default
parent: Exemples
nav_order: 1
---

# Exemple système de préferences utilisateur : 
```vue
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