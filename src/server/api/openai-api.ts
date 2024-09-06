import OpenAI from "openai";

export default function useOpenAI() {
    
  async function callOpenAI(message:string) {
    try {

      console.log('api key', useRuntimeConfig().public.OPENAI_API_KEY)
      const openai = new OpenAI({
        apiKey: `${useRuntimeConfig().public.OPENAI_API_KEY}`,
        dangerouslyAllowBrowser: true,
      });
  
      const completion = await openai.chat.completions.create({
        messages: [{ role: "assistant", content: message }],
        model: "gpt-4",
        temperature: 0.5,
        max_tokens: 1000,
      });
  
      return completion.choices[0].message.content;
    } catch(e) {
      return 'API Error: ' + e;
    }
  }

  return {
    callOpenAI,
  };
}
