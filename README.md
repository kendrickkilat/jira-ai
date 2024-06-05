# Jira-AI

- AI attempts to generate requirements based from user Input
- Generated requirements will be converted to JIRA tasks/issues using their API

## Setup

Make sure to install the dependencies:

```bash
# pnpm
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# pnpm
pnpm run dev
```

## Environment Variables

Get your OpenAI API Key here: https://platform.openai.com/api-keys

Get your Google Gemini API Key here: https://ai.google.dev/tutorials/setup?authuser=2

Create a `.env` file and add the variables as `OPENAI_API_KEY` and `GOOGLE_GEMINI_KEY`
Sample
```bash
OPENAI_API_KEY = Bearer <your-key-here>
GOOGLE_GEMINI_KEY = <your-key-here>
```
