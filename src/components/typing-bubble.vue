<template>
  <div v-if="isTyping" class="typing-indicator">
    <div class="dot" :class="{ 'dot-animated': isTyping }"></div>
    <div class="dot" :class="{ 'dot-animated': isTyping }"></div>
    <div class="dot" :class="{ 'dot-animated': isTyping }"></div>
  </div>
</template>

<script setup>
defineProps(["isTyping"]);
</script>
