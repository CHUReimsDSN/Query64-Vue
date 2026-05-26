---
title: Préferences utilisateur
---

# Exemple système de préferences utilisateur :

```vue
<script setup lang="ts">
import { Query64Grid } from "query64-vue";

const preferences = [
  {
    order: 0,
    width: 100,
    visible: true,
    colId: "id",
  },
  {
    order: 1,
    width: 140,
    visible: false,
    colId: "article.label",
    pinned: "right",
  },
];
</script>

<template>
  <Query64Grid
    :initialGridParams="{
      preferences
    }"
  />
</template>
```

Charger des préférences
```vue
<script setup lang="ts">
import { Query64Grid } from "query64-vue";
import { ref } from 'vue';

const query64Grid = ref<TQuery64GridApi>()

function updatePreferences() {
  if (!query64Grid.value) {
    return
  }
  const preferences = []
  query64Grid.value.updateGridParams(preferences)
}
</script>

<template>
  <Query64Grid 
    ref=query64grid"
  />
</template>
```