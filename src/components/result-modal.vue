<template>
     <base-dialog class="bg-gray-800 dark mx-3 p-3" :visible="props.visible" modal header="Generated Tasks/Issues">
        <ResultTable :data="props.data" />     
     </base-dialog>
</template>
<script setup lang="ts">
import ResultTable from './result-table.vue';

const props = defineProps(['visible', 'data']);

</script>