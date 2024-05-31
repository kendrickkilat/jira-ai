import jira from "./jira-api";

export default eventHandler(async (event) => {
    try {
        console.log('jira api called', event);
        // const users = await jira.getUsers(0,1);
        const body = await readBody(event);
        console.log('jira-users', body)

        // const issue = {
        //     "fields": {
        //         "project": {
        //             "key": "AI"
        //         },
        //         "summary": "Create an HTML Document",
        //         "description": "Open a text editor like Notepad or Visual Studio Code. Create a new file and save it as \"login.html\". Start the HTML document with the following code:\n\n```html\n<!DOCTYPE html>\n<html>\n<head>\n  <title>Login Page</title>\n</head>\n<body>\n```",
        //         "issuetype": {
        //             "id": 10001
        //         }
        //     }
        // }; 


        // await jira.addNewIssue(issue);

        return {
            data: body,
            status: "SUCCESS"
        };
    } catch(e) {
        return {error: e};
    }
})