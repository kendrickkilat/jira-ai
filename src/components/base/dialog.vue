<template>
    <Dialog :dismissable-mask="props.dismissable ?? true" :class="'bg-gray-800 dark mx-3 p-3' + className" v-model:visible="props.visible" v-on:update:visible="emit('toggle-modal')" modal :header="header" :pt="pt ?? {}">
        <template #header>
            <slot name="header"></slot>
        </template>
        <slot></slot>
        <template #footer>
            <slot name="footer"></slot>
        </template>
    </Dialog>
</template>
<script setup lang="ts">
const props = defineProps(['visible', 'header', 'className', 'pt', 'dismissable']);
const showModal = ref(props.visible);
const emit = defineEmits(['toggle-modal']);

</script>