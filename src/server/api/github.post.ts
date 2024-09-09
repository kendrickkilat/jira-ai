// import useOpenAI from "./openai-api";

export default eventHandler(async (event) => {
    try {
        // console.log('debug: ', event);
        const body = await readBody(event);
        console.log('body: ', body);
    
        // const { callOpenAI } = useOpenAI();
        
        // const data = await callOpenAI(body);
        console.log('openai api called', body);
    
        
        return {
            body,
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