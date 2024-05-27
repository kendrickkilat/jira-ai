import { USER } from "~/enums/AI";

export default function useAI() {
    // determine the AI being used

    const AIModel = ref('');

    const { callGemini } = useGeminiAI();
    const { AILogs, isAITyping } = storeToRefs(useMessageStore());

    const { $mdRenderer: mdRenderer } = useNuxtApp();
    const generatedData = ref([]);

    const {
        isTyping,
        addConversationLog,
        updateTypingStatus,
    } = useMessageStore();


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
        const instruction = `Is this a valid list of issues/task that can be added in JIRA?: ${message}`;
        const res = await callAI(instruction);
    
        if(!res) {
          return false;
        }

        const isValidated = res.includes('Yes');
        
        if(!isValidated) {
            addConversationLog(USER.GEMINI, res);
        }
    
        return res.includes('Yes');
    }

    
    // format the message

    function modifyMessage(message:string) {
        return `
          Before you reply, I want you to remove the markdown symbols and the programming language name being used on your response.
          Then I want you to create an array of json objects like this one where the each item of that list is a step of an instruction: 
          {[
            "fields": {
              "project": {
                "key": string;
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
            return;
        }

        addConversationLog(USER.OPENAI, message);
        isTyping(true);

        const isMessageAnInstruction = await validateMessage(message);

         if(!isMessageAnInstruction) {
            isTyping(false);
            return
         }

         const elaboratedMessage = await elaborateMessage(message);

         if(!elaboratedMessage){
            isTyping(false);
            addConversationLog(USER.GEMINI, 'Cant Generate the Message');
            return
         }
         addConversationLog(USER.GEMINI, mdRenderer.render(elaboratedMessage));

         const modifiedMessage = modifyMessage(elaboratedMessage);
         updateTypingStatus(USER.GEMINI, true);

         try {
             const generatedObjString = await callAI(modifiedMessage)
             const data = removeCodeBlock(generatedObjString ?? '');
    
             addConversationLog(USER.GEMINI,`Object Generated: ${data}` ?? 'Cant Generate the Message');
             isTyping(false)
    
             if(data) {
                const generatedObj = JSON.parse(data);

                console.log('generatedObj: ', generatedObj);

                generatedData.value = generatedObj.map((obj: { fields: any; }) => obj.fields);
    
                // for(let i=0; i<generatedObj.length; i++) {
                //     const data = generatedObj[i].fields;

                //     addConversationLog(USER.GEMINI, `Task Summary: ${data.summary}`);
                // }
             }
         } catch (err) {
            isTyping(false);
            console.error(err);
         }
    }

    return {
        AILogs,
        isAITyping,
        AIModel,
        submitToAI,
        generatedData
    }
}