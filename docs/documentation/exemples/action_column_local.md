---
title: Colonne d'action
---

# Exemple pour définir une colonne d'action sur une grille précise :

```vue
<script setup lang="ts">
// ArticlePage.vue
import { Query64Grid } from "query64-vue";
import ColumnActionArticle from "./ColumnActionArticle.vue";

type Article = {
  id: number;
  title: string;
};

const actionColumnSettings = {
  defaultComponent: ColumnActionArticle,
};
</script>

<template>
  <Query64Grid :actionColumnSettings="actionColumnSettings" />
</template>
```

Dans le composant, il est possible de récupérer les données de la ligne courante via les props,
à travers la propriété `params.data`.

```vue
<script setup lang="ts">
// ColumnActionArticle.vue
import type { Article } from './ArticlePage.vue'

const propsComponent = defineProps<{
  params: {
    data: Article
  }
}>();
</script>

<template>
  <div>
    <router-link
      :to="{ name: 'article-by-id', params: { id: propsComponent.params.data.id }}"
    >
      <div>See more</div>
    </router-link>
  </div>
</template>
```

{: .highlight }
Plus d'infos sur les props dans la documentation de l'AgGrid : [Custom Components](https://www.ag-grid.com/vue-data-grid/component-cell-renderer/#custom-components)

## Exemple avec une suppression de ligne

```vue
<script setup lang="ts">
// ColumnActionArticle.vue
import type { Article } from './ArticlePage.vue'
import type { GridApi } from 'ag-grid-enterprise';
const propsComponent = defineProps<{
  params: {
    data: Article;
    api: GridApi;
  }
}>();

async function deleteArticleById() {
  await api.delete(`my-api/article/${propsComponent.params.data.id}`)
  propsComponent.params.api.refreshServerSide();
}
</script>

<template>
  <div>
    <btn @click="deleteArticleById">Supprimer</btn>
  </div>
</template>
```

{: .important }
Query64 utilise le mode `ServerSide` d'AgGrid. Il n'est donc pas possible d'utiliser les méthodes `applyTransaction` et `applyTransactionAsync`. Il faut donc utiliser la méthode `refreshServerSide` pour se resynchroniser sur les données.