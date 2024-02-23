<template>
  <div v-for="(message, index) in messages" :key="index" class="mt-5">
    <div :class="{ 'flex justify-end': message.sender === USER.OPENAI }">
      <div
        v-if="message.sender === USER.OPENAI"
        class="bg-gradient-to-br from-white via-gray-200 to-black max-w-3xl p-3 mb-3 rounded-xl mr-4"
      >
        <label class="mb-2 font-bold">OPENAI</label>
        <p v-html="message.content" />
      </div>
      <div
        v-else
        class="bg-gradient-to-bl from-blue-100 via-purple-400 to-red-500 max-w-3xl p-3 mb-3 rounded-xl ml-4"
      >
        <label class="mb-2 font-bold">GEMINI</label>
        <p v-html="message.content"></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { USER } from "~/enums/AI";
defineProps(["messages"]);
</script>
