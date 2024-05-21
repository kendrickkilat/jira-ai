<template>
  <div v-for="(message, index) in messages" :key="index" class="mt-5">
    <div :class="{ 'flex justify-end': message.sender === USER.OPENAI }">
      <div
        v-if="message.sender === USER.OPENAI"
        class="bg-green-600 text-white max-w-3xl p-3 mb-3 rounded-xl mr-4"
      >
        <label class="mb-2 font-bold">USER</label>
        <p v-html="message.content" />
      </div>
      <div
        v-else
        class="bg-purple-700 text-white max-w-3xl p-3 mb-3 rounded-xl ml-4"
      >
        <label class="mb-2 font-bold">GEMINI</label>
          <p v-html="message.content" markdown="1"></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { USER } from "~/enums/AI";
defineProps(["messages"]);
</script>
