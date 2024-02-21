<template>
  <div class="chat-container">
    <div class="message-area">
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="bubble-container"
      >
        <div v-if="message.sender === 'me'" class="sender-bubble">
          {{ message.content }}
        </div>
        <div v-else class="receiver-bubble">
          <p v-html="message.content"></p>
        </div>
      </div>
      <div v-if="isTyping" class="typing-indicator">
        <div class="dot" :class="{ 'dot-animated': isTyping }"></div>
        <div class="dot" :class="{ 'dot-animated': isTyping }"></div>
        <div class="dot" :class="{ 'dot-animated': isTyping }"></div>
      </div>
      <div ref="scrollRef"></div>
    </div>
    <input
      type="text"
      onkeydown="if (event.keyCode === 13 && event.shiftKey) this.value += '\n';"
      v-model="newMessage"
      placeholder="Type your message..."
    />
    <button type="submit" @click="submit()">Send</button>
  </div>
</template>

<script setup lang="ts">
import { useMessageStore } from "~/store/message-store";
import useOpenAI from "../composables/useOpenAI";

const { messages, isTyping, submitOpenAI } = useOpenAI();
const newMessage = ref("");

function submit() {
  submitOpenAI(newMessage.value);
  newMessage.value = "";
}
</script>
