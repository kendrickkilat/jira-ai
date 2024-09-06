import useOpenAI from "./openai-api";

export default eventHandler(async (event) => {
    try {
        // console.log('debug: ', event);
        const body = await readBody(event);
        console.log('body: ', body);
    
        const { callOpenAI } = useOpenAI();
        
        const data = await callOpenAI(body.message); //todo figure out what the the insides of body look like, and make sure the open ai key matches the one in the forge app
        console.log('openai api called', data);
    
        
        return {
            data,
            status: "SUCCESS"
        }
    }
    catch(e) {
        return {
            data: {},
            status: e
        }
    }
})