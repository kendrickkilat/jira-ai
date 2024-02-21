import { ref } from "vue";
import { defineStore } from "pinia";
import type { MessageLog } from "~/types/MessageLog";

export const useMessageStore = defineStore("message", () => {
  const messages: Ref<MessageLog[]> = ref([]);
  const isTyping = ref(false);

  function addMessageList(sentBy: string, message: string) {
    messages.value.push({
      sender: sentBy,
      content: message,
    });
  }

  function updateTypingStatus(status: boolean) {
    console.log(status);
    isTyping.value = status;
  }

  return { messages, isTyping, addMessageList, updateTypingStatus };
});
