# Gemini-GPT (TalkAI)

- Created this to try to simulate OpenAI and Google Gemini to talk to each other

- Saves the conversation in localhost

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

## How does it work:
1. Start with sending a topic to GEMINI as OPENAI
2. Look at them talk to each other

> ME(as OPENAI) -> GEMINI -> OPENAI -> GEMINI -> ...

## POTENTIAL ISSUES
- API requests might send an error
- **MIGHT CAUSE AN INFINITE LOOP!**
- other potential bugs I did not account
