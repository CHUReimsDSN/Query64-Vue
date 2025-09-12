---
title: Réference
layout: default
nav_order: 70
---

# Réference

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
