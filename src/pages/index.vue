<template>
  <div class="flex bg-gray-700 flex-col h-screen w-full ">
    <div class="flex flex-row bg-gray-900">
      <span class=" flex flex-row items-center p-3">
        <!-- <Button class=" text-white active:border-0" icon="pi pi-bars" @click=""></Button> -->
        <h3 class="text-h4">JIRA-AI</h3>
      </span>
    </div>
    
    <div class="overflow-y-auto py-5 px-10 mb-3 rounded-xl bg-opacity-55 my-3 text-center">
      <span class=" text-center">API Initiialized...</span>
    </div>
    <ResultModal :visible="visible" @toggle-modal="toggleModal" :data="tableData" />
    <SuccessModal :visible="showSuccessModal" @toggle-modal="toggleSuccessModal" />
  </div>
</template>

<script setup lang="ts">

const { submitToAI, AIModel, generatedData, ProcessLogs, tableData, columns } = useAI();

const visible = ref(false);
const showSuccessModal = ref(false);

const newMessage = ref("");
const showInput = ref(true);

toggleSuccessModal();

function toggleDebug() {
  tableData.value = test.value
  toggleModal()
}

function toggleSuccessModal() {
  showSuccessModal.value = !showSuccessModal.value;
}
function toggleInput() {
  showInput.value = !showInput.value;
}

function toggleModal() {
  visible.value = !visible.value;
}

function submit() {{
  // AIModel.value = "GEMINI";
  AIModel.value = "OPENAI";
  submitToAI(newMessage.value);
  newMessage.value = "";
  toggleInput();
}}


let testIndex = 0;

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
].map((obj: { fields: any; }) => {
  const newObj = {
    ...obj.fields,
    id: testIndex
  }

  testIndex++;
  return newObj
}));


</script>
<style>
::-webkit-scrollbar {
  width: 20px;
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
