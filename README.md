# Understanding

This is an LLM-backed app for turn-based conversational translation.  I developed this while on a trip to Japan and have had good luck in using it to navigate in an environment where I don't know the language.

Usage requires a ChatGPT API key.  It can be deployed to Vercel with no extra configuration.

## Getting Started

First, run the development server:

```bash
nvm install # or nvm use, if you already have the pertinent version
corepack enable
yarn

# Add `OPENAI_API_KEY` to `.env.local`

yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Real World Usage

Deply to Vercel.  Open in Safari on your phone, and install to home screen.  Voila!  You're done!

I suggest installing the Japanese IME on your phone, so you can switch to something locals will be familiar with when having them use your phone to respond.

## Keeping API Usage Down During Development

In your `.env.local` file, add the following:

```bash
NEXT_PUBLIC_SKIP_TRANSLATION=true
```

This will stub out OpenAI API calls, returning dummy text.
