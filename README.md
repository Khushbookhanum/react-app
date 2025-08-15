# React + Gemini Chat App

A minimal chat UI built with React that calls Google’s **Generative Language (Gemini)** API to generate responses.

## ✨ Features
- Clean chat interface with auto-scroll
- Sends user prompts to Gemini and displays replies
- Keyboard submit + send icon
- Small, single-file React component to learn from

---

## ✅ Prerequisites

- **Node.js** ≥ 18 and **npm** (or yarn/pnpm)
- A **Google AI Studio (Generative Language)** API key (Gemini)
  - Create one in Google AI Studio.
- (Optional) Basic React knowledge

---

## 1) Get the Code

If you already have the files, skip to **Step 2**.

```bash
# Create a new React app (CRA example)
npx create-react-app gemini-chat
cd gemini-chat

# or with Vite
# npm create vite@latest gemini-chat -- --template react
# cd gemini-chat && npm install
```

Add your `App.jsx`/`App.js`, `App.css`, and `normalize.css` as in your project.

Install dependencies:
```bash
npm install react-icons
# If you plan to import normalize from npm instead of a local file:
# npm install normalize.css
```

---

## 2) Configure Your API Key (Important)

### a) Put your key in an environment file

- **Create React App (CRA)**: create a file named `.env` in the project root:

```dotenv
REACT_APP_GEMINI_API_KEY=YOUR_REAL_KEY_HERE
```

- **Vite**: use `.env` with the prefix `VITE_`:

```dotenv
VITE_GEMINI_API_KEY=YOUR_REAL_KEY_HERE
```

> Never hardcode your API key in source. Env files are not secure in client builds either—use a server proxy for production (see Step 8).

### b) Fix the line in your code

Your current line is a string literal and won’t read the env var:

```js
// ❌ Wrong
const REACT_APP_GEMINI_API_KEY = " process.env.GEMINI_API_KEY";
```

Change it to:

- **CRA**:
```js
const REACT_APP_GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
```

- **Vite**:
```js
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
```
…and use `GEMINI_API_KEY` where you build the request URL.

---

## 3) Verify Styles

You import:

```js
import './App.css';
import './normalize.css';
```

- If you have your own `normalize.css`, keep this as is.
- If you want to use the npm package instead, install `normalize.css` and replace with:
  ```js
  import 'normalize.css';
  import './App.css';
  ```

---

## 4) Run the App Locally

```bash
npm start
# Vite:
# npm run dev
```

Open the URL shown in your terminal (usually http://localhost:3000 for CRA).

---

## 5) How the App Works (Step-by-Step)

1. **State & Refs**  
   - `input`: the current text field value  
   - `chatLog`: array of messages like `{ user: 'me' | 'gpt', message: string }`  
   - `chatEndRef`: points to the bottom of the chat to auto-scroll

2. **Auto-scroll**  
   On every `chatLog` change, `useEffect` scrolls into view.

3. **Submit**  
   - Prevents default form submit.  
   - Ignores empty messages.  
   - Pushes the user’s message to `chatLog` and clears the input.

4. **Call Gemini**  
   Sends a `POST` to:
   ```
   https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_KEY
   ```
   with body:
   ```json
   {
     "contents": [{ "parts": [{ "text": "USER_INPUT" }] }]
   }
   ```

5. **Handle Response**  
   Safely pulls `data.candidates[0].content.parts[0].text`, or shows a fallback.

6. **Render**  
   Maps `chatLog` to `ChatMessage` components (avatar + text).

---

## 6) File/Folder Hints

```
src/
  App.jsx (or App.js)     # your main component
  App.css                 # your styles
  normalize.css           # optional local normalize (or use 'normalize.css' from npm)
  index.js / main.jsx     # React entry point
```

---

## 7) Common Customizations

- **New Chat button**: Clear history
  ```js
  // inside App
  const newChat = () => setChatLog([]);
  // bind to sidebar button onClick={newChat}
  ```

- **Enter-to-send**: Already works via form submit; add Shift+Enter for newline if you switch to `<textarea>`.

- **Loading state**: Disable the send button while awaiting a response.

- **Assistant avatar/name**: Replace the SVG or use an icon from `react-icons`.

- **Model / system prompt**: You can prepend instructions in the `contents` payload.

---

## 8) Production Note: Hide Your API Key (Proxy)

Shipping a **client-side** key is insecure. Use a tiny backend (server or serverless) to proxy requests:

**Example: Express server (very brief)**

```js
// server.js
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate', async (req, res) => {
  const { text } = req.body;
  const r = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + process.env.GEMINI_API_KEY,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text }] }] })
    }
  );
  const data = await r.json();
  res.json(data);
});

app.listen(8080, () => console.log('Proxy on http://localhost:8080'));
```

Then call `/api/generate` from your React app **without** exposing the key.

---

## 9) Troubleshooting

- **⚠️ No response**  
  The API returned an unexpected shape. Log `data` to inspect:
  ```js
  console.log(data);
  ```
- **401/403 Unauthorized**  
  Bad/missing key or API not enabled for your project. Check `.env` and restart dev server.
- **CORS errors**  
  Use the proxy (Step 8) in development/production.
- **`process.env` is undefined** (Vite)  
  Use `import.meta.env.VITE_*` variables instead.
- **Rate limit/429**  
  Slow down or implement exponential backoff.

---

## 10) Scripts

CRA:
```json
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build"
}
```

Vite:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

---

## 11) License

MIT (or your choice).

---

## 12) Acknowledgements

- Google **Generative Language (Gemini)** API  
- `react-icons` for the send icon  
- `normalize.css`

---

### Quick Checklist
- [ ] Env var set (`REACT_APP_GEMINI_API_KEY` or `VITE_GEMINI_API_KEY`)  
- [ ] Code reads the env var (no quotes)  
- [ ] App runs locally  
- [ ] (Prod) Use a proxy to hide your key
