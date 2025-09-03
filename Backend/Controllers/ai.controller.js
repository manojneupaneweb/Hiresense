
import { createAgent, gemini } from "@inngest/agent-kit";
import { log } from "console";
import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { InterviewScore } from '../models/InterviewScore.model.js'

const uploadedparsing = async (file) => {
  try {
    if (!file) {
      return ("No file uploaded");
    }

    // Read PDF as buffer
    const data = new Uint8Array(fs.readFileSync(file.path));

    // Load PDF
    const pdf = await pdfjsLib.getDocument({ data }).promise;

    let fullText = "";
    const maxPages = Math.min(pdf.numPages, 50);

    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str);
      fullText += strings.join(" ") + "\n\n";
    }

    return fullText
  } catch (err) {
    console.error("PDF parse error:", err);
  }
};


const analyzecv = async (resumeText, jobDescription, requirements, responsibilities, skills) => {
  const aiAgent = createAgent({
    model: gemini({
      model: "gemini-1.5-flash",
      apiKey: process.env.GEMINI_API_KEY,
    }),
    name: "AI CV Analysis Assistant",
    system: `
You are an expert AI assistant for recruitment. 
Compare a candidate's CV with the provided job details.
Respond ONLY with a JSON object containing:

{{
  "score": 0-100,
  "suggestion": "max 15 words suggestion"
}}

Do NOT include markdown, code fences, comments, or extra text.
    `,
  });

  const prompt = `
Compare the following resume with the job description, requirements, responsibilities, and skills.
Return ONLY a JSON object with keys "score" and "suggestion".

Resume:
${resumeText}

Job Description:
${jobDescription}

Requirements:
${requirements}

Responsibilities:
${responsibilities}

Skills:
${skills}
`;

  const response = await aiAgent.run(prompt);
  // console.log('response :', response.output[0].content);

  const raw = response.output[0]?.content;
  // console.log('raw :', raw);

  if (raw == '') return null;

  // Strip ```json and ``` if AI wraps it
  const jsonString = raw.replace(/```json\s*|```/g, "").trim();

  //   const jsonString = JSON.parse(raw);

  // console.log('jsonString ', jsonString);


  return JSON.parse(jsonString);
  try {
  } catch (e) {
    console.log("Failed to parse JSON from AI response:", e.message, raw);
    return null;
  }
};


export const CVAnalysis = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: "No CV file uploaded" });
    }
    const fileText = await uploadedparsing(file);
    if (!fileText) {
      return res.status(400).json({ success: false, message: "Failed to parse CV text" });
    }

    const { jobDescription, requirements, responsibilities, skills } = req.body;

    // analyze CV
    const analysis = await analyzecv(fileText, jobDescription, requirements, responsibilities, skills);
    if (!analysis) {
      return res.status(400).json({ success: false, message: "AI not responding" });
    }

    res.status(200).json({
      success: true,
      message: "CV analyzed successfully",
      analysis
    });

  } catch (error) {
    console.error("CVAnalysis error:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};










/// =------------------------------chat with ai ------------------

const conversations = new Map();

// 🔹 Clear old conversation for a candidate/socket
export const clearConversation = (socketId) => {
  conversations.delete(socketId);
  console.log(`🗑️ Conversation cleared for socket: ${socketId}`);
};

export const generateJobInterviewQuestions = async (socketId, jobDetails) => {
  const { jobDescription, requirements, responsibilities, skills } = jobDetails;

  // Keep conversation history for each socket
  if (!conversations.has(socketId)) conversations.set(socketId, []);
  const chatHistory = conversations.get(socketId);

  const aiAgent = createAgent({
    model: gemini({
      model: "gemini-1.5-flash",
      apiKey: process.env.GEMINI_API_KEY,
    }),
    name: "AI Interview Assistant",
    system: `
      You are a professional AI interviewer.
      Flow of conversation should strictly follow:
      1. Start with a greeting: "Hello! Welcome to your interview."
      2. Wait for candidate to respond (example: "Hi").
      3. Ask one interview question at a time, based ONLY on job details.
      4. After the candidate answers, continue with another question.
      5. When 5–7 questions are completed, say: "Your interview is over. Thank you!"
      Rules:
      - Only return interviewer messages, never return the candidate's text.
      - Always respond in JSON array format:
        [{ "text": "message or question", "timestamp": "current time" }]
      - Do not include markdown, extra explanations, or formatting.
    `,
  });

  const prompt = `
    Job Details:
    - Description: ${jobDescription}
    - Requirements: ${requirements}
    - Responsibilities: ${responsibilities}
    - Skills: ${skills}

    Conversation so far:
    ${chatHistory.map((q) => q.text).join("\n")}

    Continue the structured interview according to the flow above.
  `;

  const response = await aiAgent.run(prompt);

  const raw = response.output[0]?.content || "";

  if (!raw.trim()) return [];

  // Remove ```json if AI accidentally wraps JSON
  const jsonString = raw.replace(/```json\s*|```/g, "").trim();

  let messages;
  try {
    messages = JSON.parse(jsonString);
  } catch (error) {
    console.error("❌ Failed to parse AI response:", error.message, "\nRaw:", raw);
    return [];
  }

  // Save conversation
  chatHistory.push(...messages);
  conversations.set(socketId, chatHistory);

  console.log("✅ New Messages:", messages);

  return messages;
};


