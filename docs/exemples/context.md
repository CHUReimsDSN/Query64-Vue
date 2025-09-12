---
title: Context
layout: default
parent: Exemples
nav_order: 1
---

# Exemple de définition de contexte : 
```vue
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