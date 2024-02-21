import { USER } from "~/enums/AI";
import { useMessageStore } from "~/stores/message-store";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function useGeminiAI() {
  const { geminiAILogs, isGeminiAITyping } = storeToRefs(useMessageStore());
  const { updateTypingStatus, addMessageList } = useMessageStore();
  // Access your API key as an environment variable (see "Set up your API key" above)
  const genAI = new GoogleGenerativeAI(
    useRuntimeConfig().public.GEMINI_API_KEY
  );

  async function submitGeminiAI(newMessage: string) {
    if (!newMessage) {
      addMessageList(USER.SYSTEM, "invalid input");
      return;
    }
    addMessageList(USER.ME_GEMINI, newMessage);
    updateTypingStatus(USER.GEMINI, true);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = newMessage;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    updateTypingStatus(USER.GEMINI, false);
    addMessageList(USER.GEMINI, text);
    console.log(text);
  }

  return {
    geminiAILogs,
    isGeminiAITyping,
    submitGeminiAI,
  };
}
