import { useMessageStore } from "~/store/message-store";

export default function useOpenAI() {
  const { messages, isTyping } = storeToRefs(useMessageStore());
  const { updateTypingStatus, addMessageList } = useMessageStore();

  async function submitOpenAI(newMessage: string) {
    if (!newMessage) {
      addMessageList("system", "invalid input");
      return;
    }
    addMessageList("me", newMessage);
    updateTypingStatus(true);

    useFetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `${useRuntimeConfig().public.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: newMessage }],
      }),
    })
      .then((response) => response.data.value)
      .then((data: any) => {
        updateTypingStatus(false);
        console.log(data.choices[0].message);
        if (data.error != null) {
          addMessageList("chatGPT", data.error.message);
        } else {
          const formattedResponse = data.choices[0].message.content;
          addMessageList("chatGPT", formattedResponse);
        }
      });
  }

  return {
    messages,
    isTyping,
    submitOpenAI,
  };
}
