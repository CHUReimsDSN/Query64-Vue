<script setup lang="ts" generic="T extends TRecord">
import type { ICellRendererParams } from "ag-grid-enterprise";
import type { TRecord } from "./private-models";

// props
const propsComponents = defineProps<{
  params: ICellRendererParams<T>;
}>();
</script>

<template>
  <div style="display: flex; flex-direction: column">
    <div>
      <template v-for="value in propsComponents.params.value" :key="value">
        <div>- {{ value }}</div>
      </template>
    </div>
  </div>
</template>
