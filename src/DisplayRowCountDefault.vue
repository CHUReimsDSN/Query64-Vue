<script setup lang="ts">
import { TQuery64GridApi } from './models';

// props
const propsComponent = defineProps<{
    query64GridApi: TQuery64GridApi;
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
        {{ propsComponent.query64GridApi.refs.rowCount.value }} ligne{{
            propsComponent.query64GridApi.refs.rowCount.value > 0 ? 's' : '' }}
    </div>
</template>
