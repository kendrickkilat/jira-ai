import { onMounted, onUpdated, ref } from "vue";
import type { MessageLog } from "~/types/MessageLog";

export default function useChat() {
  const messages = ref();
  const scrollRef = ref();
  let messageHistory = localStorage.getItem("messagesHistory");
  let parsedHistory = messageHistory !== null ? JSON.parse(messageHistory) : [];
  const retrieveDisabled = ref(false);

  onMounted(() => {
    messageHistory = localStorage.getItem("messagesHistory");
    parsedHistory = messageHistory !== null ? JSON.parse(messageHistory) : [];
    retrieveDisabled.value = messageHistory !== null;
  });

  onUpdated(() => {
    messageHistory = localStorage.getItem("messagesHistory");
    parsedHistory = messageHistory !== null ? JSON.parse(messageHistory) : [];
    retrieveDisabled.value = messageHistory !== null;
  });

  function addMessageToList(sentBy: string, message: string) {
    messages.value.push({
      sender: sentBy,
      content: message,
    });
    saveData();
    scrollTo();
  }

  function saveData() {
    const storageData = JSON.stringify(messages.value);
    localStorage.setItem("messagesHistory", storageData);
  }

  function scrollTo() {
    scrollRef.value.scrollIntoView({ behavior: "smooth" });
    scrollRef.value.scrollTop = scrollRef.value.scrollHeight;
  }

  function retrieveHistory() {
    if (messageHistory !== null) {
      console.log(parsedHistory);
      parsedHistory.forEach((element: MessageLog) => {
        messages.value.push({
          sender: element.sender,
          content: element.content,
        });
      });
    } else {
      console.log("empty");
    }
  }

  return {
    messages,
    scrollRef,
    retrieveDisabled,
    addMessageToList,
    retrieveHistory,
  };
}
