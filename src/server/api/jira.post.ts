import type { IssueObject } from "jira-client";
import jira from "./jira-api";

export default eventHandler(async (event) => {
    try {
        console.log('jira api called', event);
        // const users = await jira.getUsers(0,1);
        const body = await readBody(event);
        console.log('jira-users', body)

        // await jira.addNewIssue(issue);
        Promise.all(body.map(async (issue: IssueObject) => {
            await jira.addNewIssue(issue);
        }));
        

        return {
            data: body,
            status: "SUCCESS"
        };
    } catch(e) {
        return {error: e};
    }
})