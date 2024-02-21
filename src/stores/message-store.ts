import { ref } from "vue";
import { defineStore } from "pinia";
import type { MessageLog } from "~/types/MessageLog";
import { USER } from "~/enums/AI";

export const useMessageStore = defineStore("message", () => {
  const openAILogs: Ref<MessageLog[]> = ref([]);
  const geminiAILogs: Ref<MessageLog[]> = ref([]);
  const isOpenAITyping = ref(false);
  const isGeminiAITyping = ref(false);

  function addMessageList(sentBy: string, message: string) {
    switch (sentBy) {
      case USER.OPENAI: {
        openAILogs.value.push({
          sender: sentBy,
          content: message,
        });
        break;
      }
      case USER.GEMINI: {
        geminiAILogs.value.push({
          sender: sentBy,
          content: message,
        });
        break;
      }
      default: {
        openAILogs.value.push({
          sender: sentBy,
          content: message,
        });
        geminiAILogs.value.push({
          sender: sentBy,
          content: message,
        });
      }
    }
  }

  function updateTypingStatus(system: string, status: boolean) {
    if (system === USER.OPENAI) {
      isOpenAITyping.value = status;
    }
    if (system === USER.GEMINI) {
      isGeminiAITyping.value = status;
    }
  }

  return {
    openAILogs,
    geminiAILogs,
    isOpenAITyping,
    isGeminiAITyping,
    addMessageList,
    updateTypingStatus,
  };
});
