<template>
  <div
    class="flex bg-gradient-to-b from-black via-sky-800 to-sky-300 flex-col align-bottom justify-end h-screen overflow-y-hidden"
  >
    <div class="overflow-y-auto">
      <talk
        :messages="AILogs"
        class="flex flex-col-reverse w-full justify-stretch"
      />
      <TypingBubble :isTyping="isAITyping" class="justify-center" />
    </div>

    <InputGroup class="p-4">
      <FloatLabel>
        <InputText
          class="pl-2 pr-2 rounded-s-md h-12"
          v-model="newMessage"
          @keydown.enter="submit"
        />
        <label class="text-gray-700">Start a topic...</label>
      </FloatLabel>
      <Button class="bg-green-400" icon="pi pi-send" @click="submit" />
      <Button
        :disabled="AILogs.length == 0"
        class="bg-lime-400"
        icon="pi pi-save"
        @click="saveToLocalStorage"
      />
      <Button
        class="bg-emerald-400"
        icon="pi pi-download"
        @click="loadFromLocalStorage"
      />
    </InputGroup>
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
const newMessage = ref("how is your day?");

function submit() {
  startTalking(newMessage.value);
  newMessage.value = "";
}
</script>
