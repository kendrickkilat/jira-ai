import { ref } from "vue";
import { defineStore } from "pinia";
import type { MessageLog } from "~/types/MessageLog";
import { USER } from "~/enums/AI";
import type { Process } from "~/types/Process";

export const useMessageStore = defineStore("message", () => {
  const openAILogs: Ref<MessageLog[]> = ref([]);
  const geminiAILogs: Ref<MessageLog[]> = ref([]);
  const AILogs: Ref<MessageLog[]> = ref([]);
  const ProcessLogs: Ref<Process[]> = ref([]);
  const isAITyping = ref(false);
  const isOpenAITyping = ref(false);
  const isGeminiAITyping = ref(false);

  function addMessageList(sentBy: string, message: string) {
    switch (sentBy) {
      case USER.ME_OPENAI:
      case USER.OPENAI: {
        openAILogs.value.push({
          sender: sentBy,
          content: message,
        });
        break;
      }
      case USER.ME_GEMINI:
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

  function addConversationLog(sentBy: string, message: string) {
    AILogs.value.push({
      sender: sentBy,
      content: message,
    });
  }

  function removeProcess(type: string) {
    const itemIndex = ProcessLogs.value.findIndex(item => item.type === type);
    if (itemIndex !== -1) {
      ProcessLogs.value.splice(itemIndex, 1);
    }
  }

  function updateProcess(type: string, message: string, status:string) {
    const itemIndex = ProcessLogs.value.findIndex(item => item.type === type);
    if (itemIndex !== -1) {
      ProcessLogs.value[itemIndex] = {
        type: type,
        content: message,
        status: status,
      };
    }
  }

  function addToProcessList(type: string, message: string, status:string) {
    ProcessLogs.value.push({
      type: type,
      content: message,
      status: status,
    });
  }

  function isTyping(status: boolean) {
    isAITyping.value = status;
  }

  function updateTypingStatus(system: string, status: boolean) {
    if (system === USER.OPENAI) {
      isOpenAITyping.value = status;
    }
    if (system === USER.GEMINI) {
      isGeminiAITyping.value = status;
    }
  }

  function saveToLocalStorage() {
    localStorage.setItem("AILogs", JSON.stringify(AILogs.value));
  }

  function loadFromLocalStorage() {
    const data = localStorage.getItem("AILogs");
    const logs = data ? JSON.parse(data) : [];
    AILogs.value = logs;
  }

  return {
    openAILogs,
    geminiAILogs,
    AILogs,
    isAITyping,
    isOpenAITyping,
    isGeminiAITyping,
    ProcessLogs,
    addMessageList,
    updateTypingStatus,
    addConversationLog,
    updateProcess,
    removeProcess,
    addToProcessList,
    isTyping,
    saveToLocalStorage,
    loadFromLocalStorage,
  };
});
