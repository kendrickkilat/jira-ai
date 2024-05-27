<template>
  <div class="flex bg-gray-700 flex-col h-screen w-full pt-10 px-20">
    <!-- <Button class="bg-green-600 text-h3 mb-5 p-5 col-12 w-full text-white" label="Toggle Input" @click="toggleInput"></Button> -->
    <Button class="bg-green-600 text-h5 mb-5 p-3 col-12 w-64 text-center text-white" label="Show List of Generated Tasks/Issues" @click="toggleModal"></Button>
    <div v-if="showInput" class="grid w-full">
      <label class="text-white">INPUT INSTRUCTIONS:</label>
      <Textarea class="col-12 p-3" v-model="newMessage" rows="10" cols="10" placeholder="Enter your instructions"/>
      <div class="flex flex-row gap-1">
        <Button class="bg-pink-600 my-2 p-2 col-12 w-full text-h5 text-white" label="Submit to Gemini" @click="submitGemini" />
        <Button disabled class="bg-green-600 my-2 p-2 col-12 w-full text-h5 text-white" label="Submit to Open AI  [WORK IN PROGRESS]" @click="submitOpenAI" />      
      </div>
    </div>
    <div class="overflow-y-auto ">
      <Talk :messages="AILogs" class="flex flex-col w-full justify-stretch" />
      <TypingBubble :isTyping="isAITyping" class="justify-center" />
    </div>
    <Dialog v-model:visible="visible" modal header="Generated Tasks/Issues" :style="{ width: '100rem' }">
        <DataTable :value="generatedData" tableStyle="min-width: 50rem">
            <Column field="summary" header="Summary"/>
            <Column field="description" header="Description"/>
        </DataTable>
    </Dialog>
  </div>
</template>

<script setup lang="ts">

const { submitToAI, AIModel, AILogs, isAITyping, generatedData } = useAI();

const visible = ref(false);

const newMessage = ref("");
const showInput = ref(true);

function toggleInput() {
  showInput.value = !showInput.value;
}

function toggleModal() {
  visible.value = !visible.value;
}

function submitGemini() {
  AIModel.value = "GEMINI";
  submitToAI(newMessage.value);
  newMessage.value = "";
}

function submitOpenAI() {
  AIModel.value = 'OPENAI';
  submitToAI(newMessage.value);
  newMessage.value = "";
}
</script>
