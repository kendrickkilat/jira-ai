import { PROCESS, PROCESS_STATUS, USER } from "~/enums/AI";

export default function useAI() {
    // determine the AI being used

    const AIModel = ref('');

    const { callGemini } = useGeminiAI();
    const { AILogs, isAITyping, ProcessLogs } = storeToRefs(useMessageStore());

    const { $mdRenderer: mdRenderer } = useNuxtApp();
    const generatedData = ref([]);

    const {
        isTyping,
        addConversationLog,
        updateProcess,
        addToProcessList,
        updateTypingStatus,
        removeProcess,
    } = useMessageStore();

    // TODO: ADD AN ERROR IF THE API WONT RESPOND WITH ERROR CODE
    async function callAI(message:string): Promise<string | undefined> {
        switch(AIModel.value) {
            // case 'OPENAI': return await callOpenAI(message);
            case 'GEMINI': return await callGemini(message);
            default: console.error('Invalid AI Model');
        }
    }

    // validate the message if its valid instruction or not
    async function validateMessage(message: string) {
        console.log('validating: ', message)
        const instruction = `Answer in yes or no, Is this a valid list of issues/task that can be added in JIRA?: ${message}`;
        const res = await callAI(instruction);
    
        if(!res) {
          return false;
        }

        const isValidated = res.toLocaleLowerCase().includes('yes');
        
        if(!isValidated) {
            addToProcessList(PROCESS.ELABORATING, res, PROCESS_STATUS.FAILED);
        }
    
        return res.toLocaleLowerCase().includes('yes');;
    }

    async function validateJSON(instructions: string, json: string) {
      console.log('validating json');

      const instruction = `Answer in yes or no, Is this instruction "${instructions}" satisfy this JSON/javascript object: ${json}`;

      const res = await callAI(instruction);
      console.log('response: ', res);

      if(!res) {
        return false;
      }

      const isValidated = res.toLocaleLowerCase().includes('yes');
      
      if(!isValidated) {
          removeProcess(PROCESS.GENERATE_OBJECT);
          addToProcessList(PROCESS.GENERATE_OBJECT, 'Attempting to Regenerate the Message', PROCESS_STATUS.IN_PROGRESS);
          const res = await callAI(instructions);

          if(res){
            const newJSON = removeCodeBlock(res);
            return await validateJSON(instructions, newJSON);
          }
      }

      return isValidated;
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
                "id": number
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

    async function elaborateMessage(message: string) {
        const instruction = `Can you elaborate this list of instructions even further: ${message}`;
        const res = await callGemini(instruction);
        return res ?? 'Instructions cannot be elaborated.'
    }
    // generate the generated json object

    async function submitToAI(message:string) {
        if (!message) {
            addConversationLog(USER.SYSTEM, "invalid input");
            addToProcessList(PROCESS.ERROR, "Invalid Input", PROCESS_STATUS.FAILED);
            return;
        }

        addToProcessList(PROCESS.ELABORATING, message, PROCESS_STATUS.IN_PROGRESS);
        isTyping(true);

        const isMessageAnInstruction = await validateMessage(message);

         if(!isMessageAnInstruction) {
            isTyping(false);
            return
         }

         const elaboratedMessage = await elaborateMessage(message);

         if(!elaboratedMessage){
            isTyping(false);
            addToProcessList(PROCESS.ERROR, 'Cant Generate the Message', PROCESS_STATUS.FAILED);
            return
         }


         updateProcess(PROCESS.ELABORATING, message, PROCESS_STATUS.SUCCESS);
         addToProcessList(PROCESS.ELABORATED, mdRenderer.render(elaboratedMessage), PROCESS_STATUS.SUCCESS);

         const modifiedMessage = modifyMessage(elaboratedMessage);
         updateTypingStatus(USER.GEMINI, true);

         addToProcessList(PROCESS.GENERATE_OBJECT, '', PROCESS_STATUS.IN_PROGRESS);
         try {
             const generatedObjString = await callAI(modifiedMessage)
             const data = removeCodeBlock(generatedObjString ?? '');
             console.log('filteredData: ', data);

             if(await validateJSON(elaboratedMessage, data)) {
                const generatedObj = JSON.parse(data);

                console.log('generatedObj: ', generatedObj);

                generatedData.value = generatedObj.map((obj: { fields: any; }) => obj.fields);
                
                removeProcess(PROCESS.GENERATE_OBJECT)
                addToProcessList(PROCESS.GENERATE_OBJECT_DONE, `Object Generated!`, PROCESS_STATUS.SUCCESS);
             }

         } catch (err) {
            isTyping(false);
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
    }
}