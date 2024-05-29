<template>
    <div v-for="(data, index) in processes" :key="index" class="flex flex-col">
        <div class="bg-gray-800 text-white p-3 rounded-xl flex-1">
            <span class="m-3 py-3">
                <i :class="renderStatus(data.status)"></i>
                <span class="ml-3">{{ renderLabel(data.type) }}</span>
            </span>
            <div v-if="data.content != ''" id="instructions" class="bg-gray-900 p-3 mt-2 rounded-xl">
                <p v-if="data.type !== PROCESS.ELABORATED && data.type !== PROCESS.GENERATE_OBJECT_DONE"  style="white-space: pre-wrap">{{ data.content }}</p>
                <div v-else-if="data.type === PROCESS.GENERATE_OBJECT_DONE" class="flex justify-center">
                    <Button class="bg-green-600 text-h5 p-4 text-center text-white" label="Show List of Generated Tasks/Issues" @click="emit('toggleModal')"></Button>
                </div>
                <p v-else v-html="data.content"></p>
            </div>
        </div>
        <div v-if="index != processes.length - 1" id="progress-line"  class="bg-gray-800 w-2 h-16 self-center"></div>
    </div>
</template>
<script setup lang="ts">
import { PROCESS, PROCESS_STATUS } from '~/enums/AI';

defineProps(["processes"])
const emit = defineEmits(["toggleModal"]);

function renderLabel(label:string) {
    switch(label) {
        case PROCESS.ELABORATING:
            return "Elaborating Instructions";
        case PROCESS.ELABORATED:
            return "Elaborated Instructions";
        case PROCESS.GENERATE_OBJECT:
            return "Generating Object";
        case PROCESS.GENERATE_OBJECT_DONE:
            return "Object Generated";
        case PROCESS.ERROR:
            return "Error";
        default:
            return "Processing Data";
    }
}

function renderStatus(status:string) {
    switch(status) {
        case PROCESS_STATUS.IN_PROGRESS:
            return "pi pi-spin pi-spinner";
        case PROCESS_STATUS.SUCCESS:
            return "pi pi-check-circle text-green-300";
        case PROCESS_STATUS.FAILED:
            return "pi pi-times-circle text-red-300";
        default:
            return "pi pi-info-circle text-yellow-300";
    }
}
</script>