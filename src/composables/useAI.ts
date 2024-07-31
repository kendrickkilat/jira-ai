import { PROCESS, PROCESS_STATUS, USER } from "~/enums/AI";

export type TableData = {
  id: number;
  description: string;
  issuetype: {name: string};
  project: {key: string};
  summary: string;
}

export type JiraIssue = {
  fields: {
    project: {
      key: string;
    };
    summary: string;
    description: string;
    issuetype: {
      name: string;
    };
  }
}

export default function useAI() {
    // determine the AI being used

    const AIModel = ref('');

    const { callGemini } = useGeminiAI();
    const { callOpenAI } = useOpenAI();
    const { AILogs, isAITyping, ProcessLogs } = storeToRefs(useMessageStore());

    // const { $mdRenderer: mdRenderer } = useNuxtApp();
    const generatedData = ref<JiraIssue[]>([]);
    const tableData = ref<TableData[]>([]);

    const columns = ref([
      {field: 'selected', header: ''},
      {field: 'project', header: 'Project Key'},
      {field: 'summary', header: 'Summary'},
      {field: 'description', header: 'Description'},
      {field: 'issuetype', header: 'Issue Type'},
    ]);

    const {
        isTyping,
        updateProcess,
        addToProcessList,
        removeProcess,
    } = useMessageStore();

    async function callAI(message:string): Promise<string | undefined | null> {
        switch(AIModel.value) {
            case 'OPENAI': return await callOpenAI(message);
            case 'GEMINI': return await callGemini(message);
            default: console.error('Invalid AI Model');
        }
    }

    // validate the message if its valid instruction or not
    async function validateMessage(message: string) {
        const instruction = `Answer only in yes or no, Is this a valid list of issues/task that can be added in JIRA?: ${message}`;
        const res = await callAI(instruction);
    
        if(!res) {
          return false;
        }

        const isValidated = res.toLocaleLowerCase().includes('yes');

        console.log('is validated: ', res)
        
        if(!isValidated) {
            console.error(res);
            updateProcess(PROCESS.ELABORATING, res, PROCESS_STATUS.FAILED);
        }
    
        return res.toLocaleLowerCase().includes('yes');;
    }
    function nonAIValidator(json:string) {
      try {
        const data = JSON.parse(json);

        data.forEach((e:any) => {
          if(e.fields.project.key != "AI" || e.fields.issuetype != 10001) { // for issue type might add a switch case where the default returns false maybe?
            return false;
          }
        });

        return true;
      } catch(err) {
        return false;
      }
    }

    async function generateObject(instructions:string) {
      removeProcess(PROCESS.GENERATE_OBJECT);
      addToProcessList(PROCESS.GENERATE_OBJECT, 'Attempting to Regenerate the Message', PROCESS_STATUS.IN_PROGRESS);

      const modifiedInstructions = modifyMessage(instructions);
      const res = await callAI(modifiedInstructions);

      return res;
    }

    async function validateJSON(instructions: string, json: string) {
      
      // first check if json is valid
      const nonAIValidated = nonAIValidator(json);
      if(!nonAIValidated) {
        updateProcess(PROCESS.GENERATE_OBJECT, 'Regenerating Object...', PROCESS_STATUS.IN_PROGRESS);
        const res = await generateObject(instructions);
    
        if(res) {
          const newJSON = removeCodeBlock(res);
          return await validateJSON(instructions, newJSON);
        }
      }


      //second check if json is valid

      const instruction = `Answer only in yes or no, Is this JSON/Javascript Object: ${json} satisfy this instruction? "${instructions}"`;

      const res = await callAI(instruction);

      if(!res) {
        updateProcess(PROCESS.GENERATE_OBJECT, 'Cant Generate the Message', PROCESS_STATUS.FAILED);
        return false;
      }

      const isValidated = res.toLocaleLowerCase().includes('yes');
      
      if(!isValidated) {
          const res = await generateObject(instructions);
          if(res){
            const newJSON = removeCodeBlock(res);
            return await validateJSON(instructions, newJSON);
          }
      }

      return json;
    }

    
    // format the message

    function modifyMessage(message:string) {
        return `
          Before you reply, I want you to remove the markdown symbols and the programming language name being used on your response.
          Then I want you to create an array of valid json objects like this one where each item of that list is a step of an instruction that will be passed to the JIRA API: 
          {[
            "fields": {
              "project": {
                "key": "AI";
              },
              "summary": string,
              "description":string,
              "issuetype": {
                "id": 10001
              }
            }
          ]}
          Based from this list of instructions mentioned below: ${message}
        `
      }

    // removes ``` json markdown symbols on the generated output
      function removeCodeBlock(text: string): string {
        const regex = /`(?:json|javascript)[\s\S]*?`/g;
        const newStr = text.replace(regex, "");
    
        return newStr
      }

    // generate the elaborated code

    async function elaborateMessage(requirements: string) {
        const instruction = `I want you to act as a product owner in this chat and help me write user stories. A proper user story should contain the WHO, the WHAT and the WHY. I will send a business requirement or problem and I want you to break that into user stories. As I will take the stories and put them into our Application Lifecycle tool, each story should come with a headline that is NOT formatted as a user story, rather the shortest possible sentence to describe it. Each story should then contain a story and additional information describing it. \n\n Business Requirements: \n\n${requirements}. Start the result of each backlog with this sign "###"`;
        const res = await callAI(instruction);
        return res ?? 'Instructions cannot be elaborated.'
    }
    // generate the generated json object

    async function submitToAI(message:string) {
        if (!message) {
            addToProcessList(PROCESS.ERROR, "Invalid Input", PROCESS_STATUS.FAILED);
            return;
        }

        try {
           addToProcessList(PROCESS.ELABORATING, message, PROCESS_STATUS.IN_PROGRESS);
   
           const isMessageAnInstruction = await validateMessage(message);
   
            if(!isMessageAnInstruction) {
               updateProcess(PROCESS.ELABORATING, "Can't elaborate since it's not a valid instruction.", PROCESS_STATUS.FAILED);
               return
            }
   
            const elaboratedMessage = await elaborateMessage(message);

            
            if(!elaboratedMessage){
              isTyping(false);
              updateProcess(PROCESS.ELABORATING, 'Cant Elaborate the Message', PROCESS_STATUS.FAILED);
              return
            }

            
            const generatedIssues: JiraIssue[] = elaboratedMessage
              .trim()
              // .split(/(?:1\. |2\. |3\. |4\. |5\. |6\. |7\. |8\. |9\. |10\. )/)
              .split('###')
              .map((line: string) => ({
                fields: {
                  project: {
                    key: 'AIW',
                  },
                  summary: line.substring(0, line.indexOf('\n')), 
                  description: line,
                  issuetype: {
                    name: 'Task',
                  },
                },
              }));


            const jiraIssues = generatedIssues.filter(item => item.fields.summary !== '' || item.fields.description !== '');
   
            updateProcess(PROCESS.ELABORATING, message, PROCESS_STATUS.SUCCESS);
            // addToProcessList(PROCESS.ELABORATED, mdRenderer.render(elaboratedMessage), PROCESS_STATUS.SUCCESS);
   
            // const modifiedMessage = modifyMessage(elaboratedMessage); // no longer neeeded as this was done programttically
   
            addToProcessList(PROCESS.GENERATE_OBJECT, '', PROCESS_STATUS.IN_PROGRESS);
            //  const generatedObjString = await callAI(modifiedMessage)
            //  const data = removeCodeBlock(generatedObjString ?? '');
            //  const validatedJSON = await validateJSON(elaboratedMessage, data);

            //  if(validatedJSON) {
                
                // const generatedObj = JSON.parse(validatedJSON);

                generatedData.value = jiraIssues;
                let index=0;
                tableData.value = jiraIssues.map((obj: { fields: any; }) =>{
                  const data = {
                    ...obj.fields,
                    id: index,
                  }
                  index++;
                  return data;
                });
                
                removeProcess(PROCESS.GENERATE_OBJECT)
                addToProcessList(PROCESS.GENERATE_OBJECT_DONE, `Object Generated!`, PROCESS_STATUS.SUCCESS);
            //  }

         } catch (err) {
            addToProcessList(PROCESS.ERROR, `Cant Generate the Message: ${err}`, PROCESS_STATUS.FAILED);
            console.error(err);
         }
    }

    return {
        AILogs,
        isAITyping,
        AIModel,
        submitToAI,
        generatedData,
        ProcessLogs,
        tableData,
        columns,
    }
}