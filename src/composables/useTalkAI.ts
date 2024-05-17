import { USER } from "~/enums/AI";

export default function useTalkAI() {
  // const { talkToOpenAI } = useOpenAI();
  const { submitGeminiAI } = useGeminiAI();
  const { AILogs, isAITyping } = storeToRefs(useMessageStore());
  const {
    isTyping,
    addConversationLog,
    saveToLocalStorage,
    loadFromLocalStorage,
  } = useMessageStore();

  let iteration = 0;

  function modifyMessage(message: string) {
    return `
      Before you reply, Your output should remove the markdown and language name.

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

  function startTalking(message: string) {
    if (!message) {
      addConversationLog(USER.SYSTEM, "invalid input");
      return;
    }

    const modifiedMessage = modifyMessage(message);
    
    addConversationLog(USER.OPENAI, message);
    isTyping(true);
    submitGeminiAI(modifiedMessage);
  }

  //initiate convo -> openai -> gemini -> openai -> ...

  // async function talk(ai: string, message: string) {
  //   iteration++;
  //   // while (iteration < 6) {

  //   // }
  //   if (ai === USER.OPENAI) {
  //     isTyping(true);
  //     // call gemini
  //     talk(USER.OPENAI, await talkToGemini(message));
  //   }
  //   if (ai === USER.GEMINI) {
  //     isTyping(true);
  //   //   //call openai
  //     talk(USER.OPENAI, await talkToOpenAI(message));
  //   }
  //   isTyping(false);
  // }

  return {
    AILogs,
    isAITyping,
    startTalking,
    saveToLocalStorage,
    loadFromLocalStorage,
  };
}
