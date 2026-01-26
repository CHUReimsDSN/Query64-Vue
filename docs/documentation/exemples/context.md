---
title: Context
---

# Exemple de définition de contexte : 
```vue
<script setup lang="ts">
import { Query64Grid } from 'query64-vue';

const context = {
  template: 'Template1'
}
</script>

<template>
  <Query64Grid :context="context"
  />
</template>
```