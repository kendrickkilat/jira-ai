<template>
  <div class="flex bg-gray-700 flex-col h-screen w-full pt-3 px-3">
    <!-- <Button class="bg-green-600 text-h5 mb-5 p-1 col-12 w-64 text-center text-white" label="Show List of Generated Tasks/Issues" @click="toggleModal"></Button> -->
    <div v-if="!showInput" class="flex gap-3 justify-center">
      <Button icon="pi pi-eye" class="bg-green-600 text-h5 p-3 text-white" label="SHOW INPUT" @click="toggleInput"></Button>
    </div>
    <div v-else="showInput" class="flex flex-col ">
      <span class="flex justify-between items-end">
        <label class="text-white my-3 text-h4">INPUT INSTRUCTIONS:</label>
        <Button icon="pi pi-eye-slash" class="text-h5 p-3 text-white" @click="toggleInput"></Button>
      </span>
      <Textarea class="col-12 p-3" v-model="newMessage" rows="10" cols="10" placeholder="Enter your instructions"/>
      <div class="flex flex-row gap-1 justify-center">
        <Button icon="pi pi-cog" class="bg-pink-600 my-2 p-2 w-40 text-h5 text-white" label="GENERATE" @click="submitGemini" />
      </div>
    </div>
    <div class="overflow-y-auto py-5 px-10 my-3 rounded-xl bg-opacity-55">
      <!-- <Talk :messages="AILogs" class="flex flex-col w-full justify-stretch" />
      <TypingBubble :isTyping="isAITyping" class="justify-center" /> -->
      <GenerateObjectProcess :processes="ProcessLogs" @toggleModal="toggleModal" />
    </div>
    <Dialog class="bg-gray-800 dark" v-model:visible="visible" modal header="Generated Tasks/Issues" :style="{ width: '100rem' }">
        <DataTable :value="generatedData" class="" tableStyle="min-width: 50rem">
          <Column field="project" header="Project Key">
            <template #body="slotProps">
              {{ slotProps.data.project.key }}
            </template>
          </Column>
            <Column field="summary" header="Summary"/>
            <Column field="description" header="Description"/>
            <Column field="issuetype" header="Issue Type">
                <template #body="slotProps">
                  {{ slotProps.data.issuetype.id }}
                </template>
            </Column>
            <Column field="" header="Actions">
                <template #body>
                  <div class="flex gap-1">
                    <Button icon="pi pi-pencil" class="bg-green-500 text-h5 p-2 text-center text-white"></Button>
                    <Button icon="pi pi-trash" class="bg-red-500 text-h5 p-2 text-center text-white"></Button>
                  </div>
                </template>
            </Column>
        </DataTable>
        <template #footer>
          <div class=" flex gap-3 py-1">
            <Button class="bg-green-500 text-h5 p-2 text-center text-white" label="Close" @click="toggleModal()"></Button>
            <Button class="bg-green-500 text-h5 p-2 text-center text-white" label="Submit to JIRA" @click="submitToJIRA"></Button>
          </div>
        </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">

const { submitToAI, AIModel, generatedData, ProcessLogs } = useAI();

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
  toggleInput();

}

function submitOpenAI() {
  AIModel.value = 'OPENAI';
  submitToAI(newMessage.value);
  newMessage.value = "";
  toggleInput();
}

function submitToJIRA() {
  toggleModal()
  console.log("SENDING THIS OBJECT:", generatedData)
}

const test = [
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
]

const mappedTest = test.map((obj: { fields: any; }) => obj.fields);
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
