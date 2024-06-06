<template>
    <Dialog v-model:visible="props.visible" :dismissable-mask="true" modal style="width:25rem;" :closable="false":pt="{
        footer: {
            class:'justify-center'
        }
    }">
        <div id="content" class="text-center">
            <i class="pi pi-check-circle pb-5 text-green-500" style="font-size:50px"></i>
            <h1 class="text-h1">Operation Success</h1>
        </div>
        <template #footer >
            <Button class=" border-green-500 border-solid border-2 text-h5 py-2 px-3 text-center text-green-500" label="Okay" @click="emit('toggleModal')"></Button>
        </template>
    </Dialog>
</template>

<script setup lang="ts">
const emit = defineEmits(["toggleModal"]);
const props = defineProps(["visible"]);
</script>

<style scoped>
    .p-dialog-footer {
        justify-content: center;
    }
</style>