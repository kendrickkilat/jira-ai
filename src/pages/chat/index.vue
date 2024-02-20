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
      <typing-bubble></typing-bubble>
      <div ref="scrollRef"></div>
    </div>
    <form class="input-form" @submit.prevent="submitOpenAI">
      <input
        type="text"
        onkeydown="if (event.keyCode === 13 && event.shiftKey) this.value += '\n';"
        v-model="newMessage"
        placeholder="Type your message..."
      />
      <button type="submit">Send</button>
    </form>
    <button @click="retrieveHistory" class="" v-if="retrieveDisabled">
      Retrieve History
    </button>
  </div>
</template>

<script setup lang="ts">
import useChat from "../../composables/useChat";
import useOpenAI from "../../composables/useOpenAI";

const {
  messages,
  scrollRef,
  addMessageToList,
  retrieveHistory,
  retrieveDisabled,
} = useChat();
const { newMessage, messagesTemp, submitOpenAI } = useOpenAI();
</script>
