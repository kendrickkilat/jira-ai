import JiraApi from 'jira-client';

const jira = new JiraApi({
    protocol: "https",
    host: "millercodefactory.atlassian.net",
    username: "kendrick.kilat@mllrdev.com",
    password: useRuntimeConfig().public.JIRA_API_KEY,
    apiVersion: "2",
    strictSSL: true,
});


export default jira

