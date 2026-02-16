---
title: Recherche rapide
---

# Recherche rapide

Il est possible d'effectuer une recherche rapide à travers toutes les colonnes d'une grille (hors association).

```vue
<script setup lang="ts">
import { ref, watch } from 'vue';
import { Query64Grid } from 'query64-vue';
import type { TQuery64GridExpose } from 'query64-vue';

const query64Grid = ref<TQuery64GridExpose>()
const quickSearch = ref('')

watch(quicSearch, (newValue) => {
    if (!query64Grid.value) {
        return
    }
    query64Grid.triggerQuickFilter(newValue)
})
</script>

<template>
    <input v-model="quickSearch" />
  <Query64Grid ref="query64Grid" />
</template>
```
