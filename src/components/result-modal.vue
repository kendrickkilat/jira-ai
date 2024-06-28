<template>
     <base-dialog class="bg-gray-800 dark mx-3 p-3" :visible="props.visible" modal header="Generated Tasks/Issues">
        <ResultTable :data="props.data" />     
        <template #footer>
         <Button class=" border-green-500 border-solid border-2 text-h5 p-2 text-center text-green-500 "
                label="Close" @click="emit('toggle-modal')"></Button>
        </template>
     </base-dialog>
</template>
<script setup lang="ts">
import ResultTable from './result-table.vue';

const props = defineProps(['visible', 'data']);
const emit = defineEmits(['toggle-modal']);

</script>