import { USER } from "~/enums/AI";

export default function useTalkAI() {
  const { talkToOpenAI } = useOpenAI();
  const { talkToGemini } = useGeminiAI();
  const { AILogs, isAITyping } = storeToRefs(useMessageStore());
  const {
    isTyping,
    addConversationLog,
    saveToLocalStorage,
    loadFromLocalStorage,
  } = useMessageStore();

  let iteration = 0;

  function startTalking(message: string) {
    if (!message) {
      addConversationLog(USER.SYSTEM, "invalid input");
      return;
    }
    addConversationLog(USER.OPENAI, message);
    isTyping(true);
    talk(USER.OPENAI, message);
  }

  //initiate convo -> openai -> gemini -> openai -> ...

  async function talk(ai: string, message: string) {
    iteration++;
    // while (iteration < 6) {

    // }
    if (ai === USER.OPENAI) {
      isTyping(true);
      //call gemini
      talk(USER.GEMINI, await talkToGemini(message));
    }
    if (ai === USER.GEMINI) {
      isTyping(true);
      //call openai
      talk(USER.OPENAI, await talkToOpenAI(message));
    }
    isTyping(false);
  }

  return {
    AILogs,
    isAITyping,
    startTalking,
    saveToLocalStorage,
    loadFromLocalStorage,
  };
}
