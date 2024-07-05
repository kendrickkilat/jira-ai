import OpenAI from "openai";
import { useMessageStore } from "~/stores/message-store";

export default function useOpenAI() {
  const { openAILogs, isOpenAITyping } = storeToRefs(useMessageStore());
    
  async function callOpenAI(message:string) {
    try {

      console.log('callOpenAI: ', message, useRuntimeConfig().public.OPENAI_API_KEY)
      const openai = new OpenAI({
        apiKey: `${useRuntimeConfig().public.OPENAI_API_KEY}`,
        dangerouslyAllowBrowser: true,
      });
  
      const completion = await openai.chat.completions.create({
        messages: [{ role: "assistant", content: message }],
        model: "gpt-4",
      });
  
      return completion.choices[0].message.content;
    } catch(e) {
      return 'API Error: ' + e;
    }
  }

  return {
    openAILogs,
    isOpenAITyping,
    callOpenAI,
  };
}
