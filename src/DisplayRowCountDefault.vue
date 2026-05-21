<script setup lang="ts">
import type { GridApi } from 'ag-grid-community';
import type { TRecord } from './private-models';

// props
const propsComponent = defineProps<{
    rowCount: number;
    gridApi: GridApi<TRecord>;
}>()
</script>

<template>
    <div style="
        display: flex;
        flex-direction: row;
        justify-content: end;
        align-items: center;
        padding: 4px 4px;
        padding-right: 8px;
      ">
        {{ propsComponent.rowCount }} ligne{{ propsComponent.rowCount > 0 ? 's' : '' }}
    </div>
</template>
