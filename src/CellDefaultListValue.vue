<script setup lang="ts">
import type { ICellRendererParams } from "ag-grid-enterprise";
import type { TRecord } from "./private-models";
import { computed } from "vue";

// props
const propsComponents = defineProps<{
  params: ICellRendererParams<TRecord>;
}>();

// computeds
const prefix = computed(() => {
  if (Array.isArray(propsComponents.params.value && propsComponents.params.value.length > 0)) {
    return '-'
  }
  return ''
})
</script>

<template>
  <div style="display: flex; flex-direction: column">
    <div>
      <template v-for="value in propsComponents.params.value" :key="value">
        <div>{{ prefix }} {{ value }}</div>
      </template>
    </div>
  </div>
</template>
