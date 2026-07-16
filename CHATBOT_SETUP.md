# PANTHRA Chatbot Setup Guide

## How it works

The PANTHRA chatbot always works in **fallback mode** out of the box — it answers
common questions about the four service pillars, the Predator Method™, Canadian
compliance, and pricing (which it routes to the contact page) using built-in
keyword responses. No configuration or API key is required for this.

Optionally, you can enable **AI mode** for free-form answers. For security, AI
mode is served through a **server-side proxy** that you host — the OpenAI API key
lives only on your server and is never shipped to the browser.

## Enabling AI mode (server-side proxy)

1. Create a backend endpoint (e.g. `/api/chat`) on your own server or a
   serverless platform. It should:
   - Accept a `POST` request with JSON body `{ "messages": [ { "role", "content" }, ... ] }`
   - Forward those messages to the OpenAI Chat Completions API using an API key
     stored **only** in a server-side environment variable
   - Return JSON containing the assistant reply as `{ "message": "..." }`
     (the client also accepts `reply` or `content`)

2. Point the chatbot at your endpoint by adding this before `chatbot.js` loads:

   ```html
   <script>
     window.PANTHRA_CHAT_ENDPOINT = 'https://your-domain.com/api/chat';
   </script>
   ```

3. Refresh the page. The console will log `AI mode enabled (server proxy)`.

If the endpoint is unset or unreachable, the chatbot automatically falls back to
the built-in keyword responses.

## Why not call OpenAI directly from the browser?

- **Key exposure**: any key sent from the browser is visible in DevTools /
  Network and can be extracted and abused.
- **CORS**: OpenAI blocks direct browser calls, so a browser-side key would not
  work reliably anyway.

A thin server-side proxy solves both — and lets you add rate limiting and auth.

## Getting an OpenAI API Key (for your server)

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to the API Keys section
4. Create a new secret key and store it as a server environment variable

## Features

- ✅ Zero-config fallback responses (no key needed)
- ✅ Optional AI mode via a secure server proxy
- ✅ Context-aware conversations (last 8 messages sent to the proxy)
- ✅ Automatic pricing detection → redirects to contact
- ✅ Knowledgeable about all PANTHRA services
- ✅ Canadian compliance standards aware

## Testing

1. Open the chatbot
2. Ask questions like:
   - "What services do you offer?"
   - "Tell me about threat monitoring"
   - "How much does it cost?" (should redirect to contact)
   - "What is the Predator Method?"
   - "Are you Canadian?"

## Troubleshooting

- **Chatbot not responding**: Check the browser console for errors
- **AI not working**: Verify `window.PANTHRA_CHAT_ENDPOINT` is set and your proxy
  returns `{ "message": "..." }`
- **Rate limits**: OpenAI has usage limits based on your plan — enforce your own
  limits in the proxy
