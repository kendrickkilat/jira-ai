import { USER } from "~/enums/AI";
import { useMessageStore } from "~/stores/message-store";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function useGeminiAI() {
  const { geminiAILogs, isGeminiAITyping } = storeToRefs(useMessageStore());
  const { updateTypingStatus, addMessageList, addConversationLog, isTyping } =
    useMessageStore();

  // Access your API key as an environment variable (see "Set up your API key" above)
  const genAI = new GoogleGenerativeAI(
    useRuntimeConfig().public.GEMINI_API_KEY
  );


  async function callGemini(message: string) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat();
    const prompt = message;
    const result = await chat.sendMessage(prompt);
    const response = await result.response;

    console.log('gemini response: ',  response);
    if(!response.candidates) {
      return '';
    }

    if(!response.candidates[0].content && response.candidates[0].safetyRatings) {
      console.log('invalid input: ', response);

      let reason;
      const safetyRatings = response.candidates[0].safetyRatings;
      
      for(let i = 0; i <= safetyRatings?.length; i++) {
        if(safetyRatings[i].probability === "HIGH") {
          reason = safetyRatings[i].category;
          break;
        }
      }
      
      return `Invalid Input. Reason: ${reason}`;
    } else if(!response.candidates[0].content) {
      return `API Error: ${response.candidates[0].finishReason}`;
    }
    
    const text = response.candidates[0].content.parts[0].text;

    return text;
  }
  async function talkToGemini(message: string): Promise<string> {
    const { $mdRenderer: mdRenderer } = useNuxtApp();

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat();
    const prompt = message;
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    isTyping(false);
    addConversationLog(USER.GEMINI, mdRenderer.render(text));
    return text;
  }

  return {
    geminiAILogs,
    isGeminiAITyping,
    talkToGemini,
    callGemini,
  };
}
