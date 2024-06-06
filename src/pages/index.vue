<template>
  <div class="flex bg-gray-700 flex-col h-screen w-full ">
    <div class="flex flex-row bg-gray-900">
      <span class=" flex flex-row items-center">
        <Button class="py-3 text-white active:border-0" icon="pi pi-bars" @click=""></Button>
        <h3 class="text-h4">JIRA-AI</h3>
      </span>
      <span class="flex flex-1 justify-end">
        <Button class="py-3 text-white" icon="pi pi-clone" @click="toggleDebug"></Button>
        <Button class="py-3 text-white" icon="pi pi-check-circle" @click="showSuccessModal = true"></Button>
      </span>
    </div>
    <div v-if="!showInput" class="flex gap-3 justify-center my-10">
      <Button icon="pi pi-eye" class=" text-h5 p-3 text-white" label="SHOW INPUT" @click="toggleInput"></Button>
    </div>
    <div v-if="showInput" class="flex flex-col p-3">
      <span class="flex justify-between items-end">
        <Button icon="pi pi-eye-slash" class="text-h5 p-3 text-white" @click="toggleInput"></Button>
      </span>
      <Textarea class="col-12 p-3" v-model="newMessage" rows="10" cols="10" placeholder="Enter your instructions"/>
      <div class="flex flex-row gap-1 justify-center">
        <Button icon="pi pi-cog text-h3" class="hover:bg-pink-600 my-2 p-3 px-5 w-50 text-h3 rounded-full text-white" label="GENERATE" @click="submitGemini" />
      </div>
    </div>
    <div class="overflow-y-auto py-5 px-10 my-3 rounded-xl bg-opacity-55">
      <GenerateObjectProcess :processes="ProcessLogs" @toggleModal="toggleModal" />
    </div>
    <Dialog class="bg-gray-800 dark mx-3 p-3" v-model:visible="visible" modal header="Generated Tasks/Issues">
          <DataTable v-model:editingRows="editingRows" :value="tableData" editMode="row" class="overflow-auto sm:w-96 md:w-full" v-on:row-edit-save="onRowEditSave" :pt="{
                  column: {
                      bodycell: ({ state }: IBodyCellData) => ({
                          style:  state['d_editing']&&'padding-top: 0.6rem; padding-bottom: 0.6rem'
                      })
                  }
              }">
            <Column v-for="col of columns" :field="col.field" :header="col.header" :key="col.field" >
              <template #body="{data, field}">
                <span v-if="field==='project'">
                  {{ data[field].key }}
                </span>
                <span v-else-if="field==='issuetype'">
                  {{ data[field].id }}
                </span>
                <span v-else>
                  {{ data[field] }}
                </span>
              </template>
              <template #editor="{data, field, index}">
                <InputText v-if="field==='project'" class="p-3 w-20"  v-model="data[field].key" autofocus/>
                <InputText v-else-if="field==='issuetype'"class="p-3 w-20" v-model="data[field].id" autofocus />
                <!-- <Textarea  v-else-if="field==='description'" class="p-3" rows="4" cols="50" v-model="data[field]" autofocus :autoResize="false" /> -->
                <div v-else-if="field==='description'" @input="onTextAreaInput($event, index)" contenteditable="true" class="p-3 bg-gray-900 rounded-xl min-h-20 max-h-40 overflow-auto">{{ data[field] }}</div>
                <InputText v-else class="p-3" v-model="data[field]" autofocus />
              </template>
            </Column>
            <Column header="Actions" :row-editor="true" bodyStyle="text-align:center">
              <template #body="{index, editorInitCallback}">
                  <div class="grid md:grid-flow-col grid-flow-row gap-1">
                      <Button icon="pi pi-pencil" class="bg-green-500 text-h5 p-2 text-center text-white"@click="editorInitCallback"></Button>
                      <Button icon="pi pi-trash" class="bg-red-500 text-h5 p-2 text-center text-white" @click="deleteIssue(index)"></Button>
                  </div>
                </template>
                <template #editor="{editorCancelCallback, editorSaveCallback, index}">
                  <div class="grid md:grid-flow-col grid-flow-row gap-1">
                    <Button icon="pi pi-check" class="bg-green-500 text-h5 p-2 text-center text-white"@click="editorSaveCallback"></Button>
                    <Button icon="pi pi-times" class="bg-yellow-500 text-h5 p-2 text-center text-white"@click="editorCancelCallback"></Button>
                    <Button icon="pi pi-trash" class="bg-red-500 text-h5 p-2 text-center text-white" @click="deleteIssue(index)"></Button>
                  </div>
                </template>
            </Column>
          </DataTable>
        <template #footer>
          <div class="flex gap-3 py-1">
            <Button class=" border-green-500 border-solid border-2 text-h5 p-2 text-center text-green-500 hover:bg-green-400 hover:text-white" label="Close" @click="toggleModal()"></Button>
            <Button class="bg-green-500 text-h5 p-2 text-center text-white" label="Submit to JIRA" @click="submitToJIRA"></Button>
          </div>
        </template>
    </Dialog>
    <SuccessModal v-model:visible="showSuccessModal" @toggle-modal="showSuccessModal=false"/>
  </div>
</template>

<script setup lang="ts">
import type { DataTableRowEditSaveEvent } from 'primevue/datatable';


interface IBodyCellData {
  state: {
    d_editing: boolean}
}

type TextAreaValue = {
  data: string;
  index: number;
}

const { submitToAI, AIModel, generatedData, ProcessLogs, tableData, columns } = useAI();

const visible = ref(false);
const isEditable = ref(false);
const showSuccessModal = ref(false);

const editingRows = ref([])

const newMessage = ref("");
const showInput = ref(true);

// this is for contenteditable element cuz textarea looks ugly
const textAreaValue = ref<TextAreaValue[]>([]);

function toggleDebug() {
  tableData.value = test.value
  toggleModal()
}

function onTextAreaInput(e: Event, index:number) {
  const value = (e.target as HTMLTextAreaElement).innerText;
  console.log('target: ', value);
  
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
  toggleInput();

}


function onRowEditSave(e: DataTableRowEditSaveEvent) {
  console.log('save: ', e);
  const data = {
    ...e.newData,
    description: textAreaValue.value.find((item) => item.index === e.index)?.data,
  }
  tableData.value[e.index] = data;

  textAreaValue.value = textAreaValue.value.filter((item) => item.index !== e.index);
}
// function submitOpenAI() {
//   AIModel.value = 'OPENAI';
//   submitToAI(newMessage.value);
//   newMessage.value = "";
//   toggleInput();
// }

function deleteIssue(index: number) {
  console.log('delete: ', index);

  // test.value.splice(index, 1);
  tableData.value.splice(index, 1);
}

function editIssue(callback: Function) {
  isEditable.value = true;
  callback();
}

async function submitToJIRA() {
  toggleModal()
  console.log("SENDING THIS OBJECT:", tableData);
  try {
    const { data }  = await useFetch('/api/jira', {
      method: 'post',
      body: generatedData
    });
    const hello = data.value as { data: string, status:string};
    console.log('api: ', hello.data);

    showSuccessModal.value = true;

  } catch (e) {
    console.error('error when submitting to JIRA: ', e);
  }

}

const test = ref([
    {
        "fields": {
            "project": {
                "key": "AI"
            },
            "summary": "Create an HTML Document",
            "description": "Open a text editor like Notepad or Visual Studio Code. Create a new file and save it as \"login.html\". Start the HTML document with the following code:\n\n```html\n<!DOCTYPE html>\n<html>\n<head>\n  <title>Login Page</title>\n</head>\n<body>\n```",
            "issuetype": {
                "id": 5
            }
        }
    },
    {
        "fields": {
            "project": {
                "key": "AI"
            },
            "summary": "Form Structure",
            "description": "Inside the `<body>` tag, create a form using the following code:\n```html\n<form action=\"login.php\" method=\"post\">\n```\n\nThe \"action\" attribute specifies where the form data will be sent when submitted.\n\nThe \"method\" attribute specifies how the form data will be sent (POST in this case).",
            "issuetype": {
                "id": 5
            }
        }
    },
    {
        "fields": {
            "project": {
                "key": "AI"
            },
            "summary": "Form Fields",
            "description": "Create the necessary form fields for login, such as username and password:\n\n```html\n<label for=\"username\">Username</label>\n<input type=\"text\" id=\"username\" name=\"username\" required>\n<br>\n<label for=\"password\">Password</label>\n<input type=\"password\" id=\"password\" name=\"password\" required>\n<br>\n```\n\nUse the \"label\" element to display a text description (label) for each field.\n\nSet the \"id\" and \"name\" attributes for each field to identify them.\n\nSet the \"required\" attribute to indicate that the field must be filled out.",
            "issuetype": {
                "id": 5
            }
        }
    },
    {
        "fields": {
            "project": {
                "key": "AI"
            },
            "summary": "Submit Button",
            "description": "Create a submit button for the form:\n\n```html\n<input type=\"submit\" value=\"Login\">\n```\n\nThe \"type\" attribute specifies that this is a submit button.\n\nThe \"value\" attribute specifies the text that will appear on the button.",
            "issuetype": {
                "id": 5
            }
        }
    },
    {
        "fields": {
            "project": {
                "key": "AI"
            },
            "summary": "Form End",
            "description": "Close the form with the following code:\n\n```html\n</form>\n```",
            "issuetype": {
                "id": 5
            }
        }
    },
    {
        "fields": {
            "project": {
                "key": "AI"
            },
            "summary": "Close the HTML Document",
            "description": "Close the `<body>` and `</html>` tags to complete the HTML document.\n\n```html\n</body>\n</html>\n```",
            "issuetype": {
                "id": 5
            }
        }
    },
    {
        "fields": {
            "project": {
                "key": "AI"
            },
            "summary": "Styling",
            "description": "You can add CSS styles to enhance the appearance of the login page.",
            "issuetype": {
                "id": 5
            }
        }
    },
    {
        "fields": {
            "project": {
                "key": "AI"
            },
            "summary": "Error Handling",
            "description": "Consider adding error handling to your PHP script to handle incorrect username or password inputs.",
            "issuetype": {
                "id": 5
            }
        }
    },
    {
        "fields": {
            "project": {
                "key": "AI"
            },
            "summary": "Security",
            "description": "Implement security measures such as input validation and session management to protect against vulnerabilities.",
            "issuetype": {
                "id": 5
            }
        }
    },
    {
        "fields": {
            "project": {
                "key": "AI"
            },
            "summary": "Redirect",
            "description": "After successful login, redirect the user to the appropriate page.",
            "issuetype": {
                "id": 5
            }
        }
    }
].map((obj: { fields: any; }) => obj.fields));


</script>
<style>
  ::-webkit-scrollbar {
    width:20px;
  }

  ::-webkit-scrollbar-track {
    background-color: #111827;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #1f2937;
    border: 5px solid #111827;
    border-radius: 10px;
  }


  /*dialog*/
</style>
