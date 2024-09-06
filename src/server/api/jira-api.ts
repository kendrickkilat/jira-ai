import JiraApi from 'jira-client';

const jira = new JiraApi({
    protocol: "https",
    host: useRuntimeConfig().public.JIRA_HOST,
    username: useRuntimeConfig().public.JIRA_USERNAME,
    password: useRuntimeConfig().public.JIRA_API_KEY,
    apiVersion: "2",
    strictSSL: true,
});


export default jira

