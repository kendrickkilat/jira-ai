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
    const chat = model.startChat();
    const prompt = newMessage;
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    // const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${useRuntimeConfig().public.GEMINI_API_KEY}`;

    // const data = useFetch(url, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     contents: [
    //       {
    //         parts: [
    //           {
    //             text: newMessage,
    //           },
    //         ],
    //       },
    //     ],
    //   }),
    // }).then((response) => {
    //   response.data.value;
    //   console.log(response.data.value);
    // });

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
