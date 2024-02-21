<template>
  <div class="chat-container">
    <div class="message-area">
      <openai :messages="openAILogs" :isTyping="isOpenAITyping" />
      <gemini :messages="geminiAILogs" :isTyping="isGeminiAITyping" />
    </div>

    <input
      type="text"
      onkeydown="if (event.keyCode === 13 && event.shiftKey) this.value += '\n';"
      @keydown.enter="submit"
      v-model="newMessage"
      placeholder="Type your message..."
    />
    <button type="submit" @click="submit()" @keyup.enter="submit()">
      Send
    </button>
  </div>
</template>

<script setup lang="ts">
import useOpenAI from "../composables/useOpenAI";
import useGeminiAI from "../composables/useGeminiAI";

const { openAILogs, isOpenAITyping, submitOpenAI } = useOpenAI();
const { geminiAILogs, isGeminiAITyping, submitGeminiAI } = useGeminiAI();
const newMessage = ref("");

function submit() {
  submitOpenAI(newMessage.value);
  submitGeminiAI(newMessage.value);
  newMessage.value = "";
}
</script>
