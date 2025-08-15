import "dotenv/config";
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Create Gemini client with API key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function callGemini() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "Say this is a test";

    const result = await model.generateContent(prompt);
    console.log("Gemini Response:", result.response.text());
  } catch (err) {
    console.error("Error calling Gemini API:", err);
  }
}

// Call API once at startup
callGemini();

// Set up Express server
const app = express();
const port = 3080;

app.get("/", (req, res) => {
  res.send("Hello World from Gemini API!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


// import "dotenv/config";
// import OpenAI from "openai";

// // Create OpenAI client with API key from .env
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// async function callApi() {
//   try {
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini", // works with $5 free trial credits
//       messages: [{ role: "user", content: "say this is a test" }],
//       max_tokens: 10,
//       temperature: 0,
//     });

//     console.log(completion.choices[0].message.content.trim());
//   } catch (err) {
//     console.error("Error calling OpenAI API:", err);
//   }
// }

// callApi();


// const express=require('express')
// const app=express()
// const port=3000

// app.get('/',(req,res)=>{
//   res.send('Hello World!')
// });

// app.listen(port,()=>{
//   console.log(`Example app listening at http'
//   localhost:${port}`)
// });
