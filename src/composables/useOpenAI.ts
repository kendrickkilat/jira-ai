import { USER } from "~/enums/AI";
import { useMessageStore } from "~/stores/message-store";
import OpenAI from "openai";

export default function useOpenAI() {
  const { openAILogs, isOpenAITyping } = storeToRefs(useMessageStore());
  const { updateTypingStatus, addMessageList, addConversationLog, isTyping } =
    useMessageStore();

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
        if (data.error != null) {
          addMessageList(USER.OPENAI, data.error.message);
        } else {
          const formattedResponse = data.choices[0].message.content;
          addMessageList(USER.OPENAI, formattedResponse);
        }
      });
  }

  async function talkToOpenAI(message: string): Promise<string> {
    const { $mdRenderer: mdRenderer } = useNuxtApp();

    const response = useFetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `${useRuntimeConfig().public.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: USER.ME_OPENAI, content: message }],
      }),
    })
      .then((response) => response.data.value)
      .then((data: any) => {
        isTyping(false);
        if (data.error != null) {
          addConversationLog(USER.OPENAI, data.error.message);
          return data.error.message;
        } else {
          const formattedResponse = data.choices[0].message.content;
          addConversationLog(USER.OPENAI, mdRenderer.render(formattedResponse));
          return formattedResponse;
        }
      })
      .catch((error) => {
        addConversationLog(USER.OPENAI, error);
      });

    // const openai = new OpenAI({
    //   apiKey: useRuntimeConfig().public.OPENAI_API_KEY,

    //   dangerouslyAllowBrowser: true,
    // });

    // console.log(openai);

    // let response = "";

    // const stream = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   messages: [{ role: "user", content: message }],
    //   stream: true,
    // });
    // for await (const chunk of stream) {
    //   response += chunk.choices[0]?.delta?.content || "";
    // }

    // isTyping(false);
    // addConversationLog(USER.OPENAI, mdRenderer.render(response));

    return response;
  }

  return {
    openAILogs,
    isOpenAITyping,
    submitOpenAI,
    talkToOpenAI,
  };
}
