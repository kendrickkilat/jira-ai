import { USER } from "~/enums/AI";
import { useMessageStore } from "~/stores/message-store";

export default function useOpenAI() {
  const { openAILogs, isOpenAITyping } = storeToRefs(useMessageStore());
  const { updateTypingStatus, addMessageList } = useMessageStore();

  async function submitOpenAI(newMessage: string) {
    if (!newMessage) {
      addMessageList(USER.SYSTEM, "invalid input");
      return;
    }
    addMessageList(USER.ME_OPENAI, newMessage);
    updateTypingStatus(USER.OPENAI, true);

    useFetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `${useRuntimeConfig().public.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: USER.ME_OPENAI, content: newMessage }],
      }),
    })
      .then((response) => response.data.value)
      .then((data: any) => {
        updateTypingStatus(USER.OPENAI, false);
        console.log(data.choices[0].message);
        if (data.error != null) {
          addMessageList(USER.OPENAI, data.error.message);
        } else {
          const formattedResponse = data.choices[0].message.content;
          addMessageList(USER.OPENAI, formattedResponse);
        }
      });
  }

  return {
    openAILogs,
    isOpenAITyping,
    submitOpenAI,
  };
}
