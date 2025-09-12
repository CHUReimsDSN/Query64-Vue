---
title: GridOptions
layout: default
parent: Exemples
nav_order: 1
---

# Exemple de surcharge des gridOptions : 
```vue
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