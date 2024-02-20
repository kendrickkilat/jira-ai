import { ref } from "vue";
import useChat from "./useChat";
import { type MessageLog } from "@/types/MessageLog";
import OpenAI from "openai";

export default function useOpenAI() {
  const { messages, scrollRef, addMessageToList, retrieveHistory } = useChat();
  const newMessage = ref("");
  const messagesTemp: MessageLog[] = [];
  const isTyping = ref(false);
  const openai = new OpenAI({
    organization: `${useRuntimeConfig().OPENAI_ORG_KEY}`,
  });

  async function submitOpenAI() {
    if (newMessage.value == null || newMessage.value == "") {
      addMessageToList("system", "invalid input");
      return;
    }
    addMessageToList("me", newMessage.value);
    isTyping.value = !isTyping.value;

    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: newMessage.value }],
      stream: true,
    });

    isTyping.value = !isTyping.value;

    for await (const chunk of stream) {
      addMessageToList("chatGPT", chunk.choices[0]?.delta?.content || "");
    }

    // Clear the message input field
    newMessage.value = "";
  }
  return {
    newMessage,
    messagesTemp,
    isTyping,
    submitOpenAI,
  };
}
