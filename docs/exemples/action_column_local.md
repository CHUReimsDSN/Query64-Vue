---
title: Colonne d'action
layout: default
parent: Exemples
nav_order: 1
---

# Exemple pour définir une colonne d'action sur une grille précise : 
```vue
<script setup lang="ts">
// MyPage.vue
import { Query64Grid } from 'query64-vue';
import MyActionColumn from './MyActionColumn.vue'

type Article = {
  id: number;
  title: string;
}

const actionColumnSettings = {
  defaultComponent: MyActionColumn
}
</script>

<template>
  <Query64Grid :actionColumnSettings="actionColumnSettings" />
</template>
```

Dans le composant, il est possible de récupérer les données de la ligne courante via les props.
```vue
<script setup lang="ts">
// MyActionColumn.vue
import type Article from './MyPage.vue'

const propsComponent = defineProps<{
  params: {
    data: Article
  }
}>();
</script>

<template>
  <div>
    <router-link
      :to="{ name: 'random-route', params: { id: propsComponent.params.data.id }}"
    >
        <q-tooltip> See more </q-tooltip>
      </q-icon>
    </router-link>
  </div>
</template>

```
