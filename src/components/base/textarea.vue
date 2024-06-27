<template>
    <div id="alt-textarea" @input="onInput" contenteditable="true" :placeholder="placeholder?placeholder : 'Enter Text Here'" :class="'p-3 bg-gray-900 rounded-xl overflow-auto ' + className">
        <slot>
        </slot>
    </div>
</template>
<script setup lang="ts">
    const emit = defineEmits(['input']);
    const { content, className, placeholder} = defineProps(['content', 'className', 'placeholder']);

    function onInput(e: Event) {
        const text = (e.target as HTMLTextAreaElement).innerText;
        emit('input', text);
    }
</script>
<style>
    [contenteditable=true]:empty:before{
        content: attr(placeholder);
        pointer-events: none;
        display: block; /* For Firefox */
        color: gray
    }
</style>