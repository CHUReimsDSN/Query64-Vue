---
title: Colonne d'action
layout: default
parent: Exemples
nav_order: 1
---

# Exemple pour définir une colonne d'action sur une grille précise : 
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
