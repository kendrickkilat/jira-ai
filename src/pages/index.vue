<template>
  <div class="flex bg-gray-700 flex-col h-screen w-full pt-10 px-20">
    <div class="grid w-full">
      <label class="text-white">INPUT INSTRUCTIONS:</label>
      <Textarea class="col-12 p-3" v-model="newMessage" rows="10" cols="10" placeholder="Enter your instructions"/>
      <Button class="bg-green-400 my-1 p-2 col-12 w-full text-white" label="Submit" @click="submit" />      
    </div>
    <div class="overflow-y-auto">
      <talk :messages="AILogs" class="flex flex-col w-full justify-stretch" />
      <TypingBubble :isTyping="isAITyping" class="justify-center" />
    </div>

  </div>
</template>

<script setup lang="ts">
const {
  AILogs,
  isAITyping,
  startTalking,
  saveToLocalStorage,
  loadFromLocalStorage,
} = useTalkAI();

const { submitGeminiAI } = useGeminiAI();
const newMessage = ref("");

function submit() {
  startTalking(newMessage.value);
  newMessage.value = "";
}
</script>
