---
title: Colonne d'action
---

# Exemple pour définir une colonne d'action sur une grille :

```vue
<script setup lang="ts">
// ArticlePage.vue
import { Query64Grid } from "query64-vue";
import ColumnActionArticle from "./ColumnActionArticle.vue";

type Article = {
  id: number;
  title: string;
};

const additionals = [
  {
    colDef: {
      colId: 'actions',
      cellRenderer: ColumnActionArticle
    }
  }
]
</script>

<template>
  <Query64Grid :additionals="additionals" />
</template>
```

Dans le composant, il est possible de récupérer les données de la ligne courante via les props,
à travers la propriété `params.data`.

```vue
<script setup lang="ts">
// ColumnActionArticle.vue
import type { Article } from './article'
import type { ICellRendererParams } from 'ag-grid-enterprise';

const propsComponent = defineProps<{
  params: ICellRendererParams<Article>
}>();
</script>

<template>
  <div>
    <router-link
      :to="{ name: 'article-by-id', params: { id: propsComponent.params.data.id }}"
    >
      <div>Voir</div>
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
import type { ICellRendererParams } from 'ag-grid-enterprise';

const propsComponent = defineProps<{
  params: ICellRendererParams<Article>
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