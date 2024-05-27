<template>
    <Dialog v-model:visible="visible" modal header="Generated Tasks/Issues">
        <DataTable :value="data" tableStyle="min-width: 50rem">
            <Column field="summary" header="Summary"/>
        </DataTable>
    </Dialog>
</template>
<script setup lang="ts">
const { data } = defineProps(['data']);
const visible = ref(false);
</script>