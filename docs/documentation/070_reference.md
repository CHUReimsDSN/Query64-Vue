---
title: Réference
---

# Réference

Il est possible de définir une référence sur le composant Query64Grid afin d'accèder à des méthodes ou données utilitaires.

Exemple d'accès à la gridApi :
```vue
<script setup lang="ts">
import { Query64Grid } from 'query64-vue';
import type { TQuery64GridExpose } from 'query64-vue';

const query64Grid = ref<TQuery64GridExpose>()

function example() {
  if (!query64Grid.value) return
  gridApi = query64Grid.value.gridApi
  // ... more code with the AgGrid api
}
</script>

<template>
  <Query64Grid ref="query64Grid" />
</template>
```

::: warning Important 
Consulter la [Définition API](/api-definition/models.md#TQuery64GridExpose) pour connaitre les méthodes disponibles. 
:::


