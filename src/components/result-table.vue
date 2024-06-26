<template>
    <div>
        <DataTable v-model:editingRows="editingRows" :value="props.data" editMode="row"
            class="overflow-auto sm:w-96 md:w-full" v-on:row-edit-save="onRowEditSave" :pt="{
                column: {
                    bodycell: ({ state }: IBodyCellData) => ({
                        style: state['d_editing'] && 'padding-top: 0.6rem; padding-bottom: 0.6rem'
                    })
                }
            }">
            <Column v-for="col of columns" :field="col.field" :header="col.header" :key="col.field">
                <template #body="{ data, field }">
                    <span v-if="field === 'project'">
                        {{ data[field].key }}
                    </span>
                    <span v-else-if="field === 'issuetype'">
                        {{ data[field].id }}
                    </span>
                    <span v-else>
                        {{ data[field] }}
                    </span>
                </template>
                <template #editor="{ data, field, index }">
                    <InputText v-if="field === 'project'" class="p-3 w-20" v-model="data[field].key" autofocus />
                    <InputText v-else-if="field === 'issuetype'" class="p-3 w-20" v-model="data[field].id" autofocus />
                    <base-textarea v-else-if="field === 'description'" @input="onTextAreaInput($event, index)"
                        className="min-h-20 max-h-40">
                        {{ data[field] }}
                    </base-textarea>
                    <InputText v-else class="p-3" v-model="data[field]" autofocus />
                </template>
            </Column>
            <Column header="Actions" :row-editor="true" bodyStyle="text-align:center">
                <template #body="{ index, editorInitCallback }">
                    <div class="grid md:grid-flow-col grid-flow-row gap-1">
                        <Button icon="pi pi-pencil" class="bg-green-500 text-h5 p-2 text-center text-white"
                            @click="editorInitCallback"></Button>
                        <Button icon="pi pi-trash" class="bg-red-500 text-h5 p-2 text-center text-white"
                            @click="deleteIssue(index)"></Button>
                    </div>
                </template>
                <template #editor="{ editorCancelCallback, editorSaveCallback, index }">
                    <div class="grid md:grid-flow-col grid-flow-row gap-1">
                        <Button icon="pi pi-check" class="bg-green-500 text-h5 p-2 text-center text-white"
                            @click="editorSaveCallback"></Button>
                        <Button icon="pi pi-times" class="bg-yellow-500 text-h5 p-2 text-center text-white"
                            @click="editorCancelCallback"></Button>
                        <Button icon="pi pi-trash" class="bg-red-500 text-h5 p-2 text-center text-white"
                            @click="deleteIssue(index)"></Button>
                    </div>
                </template>
            </Column>
        </DataTable>

        <div class="flex gap-3 py-1">
            <Button class=" border-green-500 border-solid border-2 text-h5 p-2 text-center text-green-500 "
                label="Close" @click="toggleModal()"></Button>
            <Button class="bg-green-500 text-h5 p-2 text-center text-white" label="Submit to JIRA"
                @click="submitToJIRA"></Button>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { DataTableRowEditSaveEvent } from 'primevue/datatable';
interface IBodyCellData {
    state: {
        d_editing: boolean
    }
}

type TextAreaValue = {
    data: string;
    index: number;
}

const props = defineProps(['data']);
const emit = defineEmits(['toggleModal', 'showSuccess'])

const editingRows = ref([]);
const textAreaValue = ref<TextAreaValue[]>([]);

const { tableData, columns } = useAI();

watchEffect(() => {
    tableData.value = props.data;
})

function onTextAreaInput(value: string, index: number) {
    console.log('onTextAreaInput: ', value);

    const indexExists = textAreaValue.value.some(item => item.index === index);
    if (!indexExists) {
        textAreaValue.value.push({
            data: value,
            index,
        });
    } else {
        textAreaValue.value = textAreaValue.value.map(item => {
            if (item.index === index) {
                return {
                    ...item,
                    data: value
                }
            }
            return item;
        })
    }
}

function deleteIssue(index: number) {
    console.log('delete: ', index);

    // test.value.splice(index, 1);
    tableData.value.splice(index, 1);
}
function onRowEditSave(e: DataTableRowEditSaveEvent) {
    console.log('save: ', e);
    const data = {
        ...e.newData,
        description: textAreaValue.value.find((item) => item.index === e.index)?.data ?? e.newData.description,
    }
    tableData.value[e.index] = data;

    textAreaValue.value = textAreaValue.value.filter((item) => item.index !== e.index);
}

async function submitToJIRA() {
    emit('showSuccess', true)
    console.log("SENDING THIS OBJECT:", tableData);

    const convertedData = tableData.value.map(obj => {
        return {
            fields: obj
        }
    })
    try {
        const { data } = await useFetch('/api/jira', {
            method: 'post',
            body: convertedData
        });
        const hello = data.value as { data: string, status: string };
        console.log('api: ', hello.data);

       emit('showSuccess', true)

    } catch (e) {
        console.error('error when submitting to JIRA: ', e);
    }
}
</script>