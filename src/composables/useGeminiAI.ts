import { USER } from "~/enums/AI";
import { useMessageStore } from "~/stores/message-store";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function useGeminiAI() {
  const { geminiAILogs, isGeminiAITyping } = storeToRefs(useMessageStore());
  const { updateTypingStatus, addMessageList, addConversationLog, isTyping } =
    useMessageStore();

  const { $mdRenderer: mdRenderer } = useNuxtApp();

  // Access your API key as an environment variable (see "Set up your API key" above)
  const genAI = new GoogleGenerativeAI(
    useRuntimeConfig().public.GEMINI_API_KEY
  );

  async function validateMessage(message: string ) {
    console.log("validating message");
    
    const instruction = `Answer only in yes or no. Is this a valid list of instructions: ${message} P.S answer only in yes or no. No extra words.`;
    const res = await callGemini(instruction);

    console.log(res);
    return res;
  }

  async function elaborateMessage(message: string) {
    const instruction = `Can you elaborate this list of instructions even further: ${message}`;
    const res = await callGemini(instruction);
    return res ?? 'Instructions cannot be elaborated.'
  }

  function modifyMessage(message:string) {
    return `
      Before you reply, I want you to remove the markdown symbols and the programming language name being used on your response.
      Create an array of objects with this format:
      {
        fields: {
          project: {
            id: number;
          },
          summary: string,
          description:string,
          issuetype: {
            id: number
          }
        }
      }
      
      based from this list mentioned below: ${message} 
    `
  }

  function removeCodeBlock(text: string): string {
    const regex = /`(?:json|javascript)[\s\S]*?`/g;
    return text.replace(regex, "");
  }


  async function submitGeminiAI(newMessage: string) {
    console.log('submitGeminiAI', newMessage);
    if (!newMessage) {
      addMessageList(USER.SYSTEM, "invalid input");
      return;
    }

    const validatedMessage = await validateMessage(newMessage);

    if(validatedMessage?.toLowerCase() == 'no') {
      addMessageList(USER.SYSTEM, "not an instruction");
      addConversationLog(USER.GEMINI, 'Not a valid list of instructions');
      isTyping(false);
      return;
    }

    const elaboratedMessage = await elaborateMessage(newMessage);
    addConversationLog(USER.GEMINI, mdRenderer.render(elaboratedMessage) ?? 'Cant Generate the Message');

    const modifiedMessage = modifyMessage(elaboratedMessage);
    addMessageList(USER.ME_GEMINI, elaboratedMessage ?? '');

    addMessageList(USER.ME_GEMINI, modifiedMessage);
    updateTypingStatus(USER.GEMINI, true);

    try {
      const res = await callGemini(modifiedMessage)

      if(res) {
      let data;
      try {
        console.log('res:', res);
        data = JSON.parse(res);
        console.log('parsed json', data);
      } catch (e) {
        data = [];
      }
      }

      // const wrappedData = "```javascript" + res;

      addConversationLog(USER.GEMINI,`Generated Object: ${removeCodeBlock(res ?? '')}` ?? 'Cant Generate the Message');
      isTyping(false);
    } catch(e) {
      console.error(e);
      isTyping(false)
    }

  }

  async function callGemini(message: string) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat();
    const prompt = message;
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.candidates ? response.candidates[0].content.parts[0].text : ''


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
    submitGeminiAI,
    talkToGemini,
  };
}
