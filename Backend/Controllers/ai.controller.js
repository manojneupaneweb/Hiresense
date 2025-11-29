import { createAgent, gemini } from "@inngest/agent-kit";
import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { InterviewScore } from '../models/InterviewScore.model.js'

const uploadedparsing = async (file) => {
  if (!file) return "No file uploaded";
  const data = new Uint8Array(fs.readFileSync(file.path));
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  let fullText = "";
  const maxPages = Math.min(pdf.numPages, 50);
  for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    fullText += strings.join(" ") + "\n\n";
  }
  return fullText;
};

const analyzecv = async (resumeText, jobDescription, requirements, responsibilities, skills) => {
  const aiAgent = createAgent({
    model: gemini({ model: "gemini-2.5-flash", apiKey: process.env.GEMINI_API_KEY }),
    name: "AI CV Analysis Assistant",
    system: `You are an expert AI assistant for recruitment. Respond ONLY with a JSON object: { "score": 0-100, "suggestion": "max 15 words suggestion" }`
  });
  const prompt = `
    Compare the CV with job description, requirements, responsibilities, and skills.
    Return ONLY JSON with keys "score" and "suggestion".
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
  const raw = response.output?.[0]?.content || "";
  if (!raw.trim()) return null;
  const jsonString = raw.replace(/```json\s*|```/g, "").trim();
  return JSON.parse(jsonString);
};

export const CVAnalysis = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, message: "No CV file uploaded" });
    const fileText = await uploadedparsing(file);
    if (!fileText) return res.status(400).json({ success: false, message: "Failed to parse CV text" });
    const { jobDescription, requirements, responsibilities, skills } = req.body;
    const analysis = await analyzecv(fileText, jobDescription, requirements, responsibilities, skills);
    if (!analysis) return res.status(400).json({ success: false, message: "AI not responding" });
    res.status(200).json({ success: true, message: "CV analyzed successfully", analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};







//-------------------------generate interview questions and manage conversation state----------------------------
export const conversations = new Map();

export const clearConversation = (socketId) => conversations.delete(socketId);

export const generateJobInterviewQuestions = async (socketId, jobDetails) => {
  const { jobDescription, requirements, responsibilities, skills, title, company } = jobDetails;
  if (!conversations.has(socketId)) conversations.set(socketId, { messages: [], jobDetails });
  const conv = conversations.get(socketId);
  const chatHistory = conv.messages;

  const aiAgent = createAgent({
    model: gemini({ model: "gemini-2.5-flash", apiKey: process.env.GEMINI_API_KEY }),
    name: "AI Interview Assistant",
    system: `
    You are a professional AI interviewer for ${title} at ${company}.
    JOB DESCRIPTION: ${jobDescription}
    REQUIREMENTS: ${requirements}
    RESPONSIBILITIES: ${responsibilities}
    REQUIRED SKILLS: ${skills}
    INTERVIEW RULES:
    1. Warm welcome first
    2. Ask one question at a time
    3. Questions from general to specific
    4. Conclude after 5-7 questions
    5. Do not answer for candidate
    6. Professional and friendly
    7. Question length max 10 words
    RESPONSE FORMAT: Return ONLY JSON: { "text": "...", "timestamp": "ISO timestamp" }`
  });

  const conversationContext = chatHistory.length ? chatHistory.map(msg => `${msg.type === "ai" ? "INTERVIEWER" : "CANDIDATE"}: ${msg.text}`).join("\n") + "\n\n" : "";
  const prompt = `
  ${conversationContext}
    Generate the NEXT SINGLE interview question based on:
    1. Job details
    2. Conversation history
    3. Most appropriate next question
    4. Question length max 15 words
    Return ONLY ONE question in JSON format.
  `;
  try {
    const response = await aiAgent.run(prompt);
    const raw = response.output[0]?.content || "";
    if (!raw.trim()) return [];
    const cleanResponse = raw.replace(/```json\s*|```/g, "").trim();
    const message = JSON.parse(cleanResponse);
    if (!message.text || !message.timestamp) return [];
    const aiMessage = { type: "ai", text: message.text, timestamp: message.timestamp, questionNumber: chatHistory.filter(m => m.type === "ai").length + 1 };
    conv.messages.push(aiMessage);
    conversations.set(socketId, conv);
    return [aiMessage];
  } catch {
    return [];
  }
};

export const processUserResponse = async (socketId, userResponse, jobDetails) => {
  const conv = conversations.get(socketId);
  if (!conv) return null;

  const { jobDescription, requirements, responsibilities, skills, title, company } = jobDetails;
  const chatHistory = conv.messages;

  const userMessage = {
    type: "user",
    text: userResponse,
    timestamp: new Date().toISOString(),
    questionNumber: chatHistory.filter(m => m.type === "ai").length
  };
  conv.messages.push(userMessage);

  const aiAgent = createAgent({
    model: gemini({ model: "gemini-2.5-flash", apiKey: process.env.GEMINI_API_KEY }),
    name: "AI Interview Assistant",
    system: `
    You are a professional AI interviewer for ${title} at ${company}.
    Job Description: ${jobDescription}
    Requirements: ${requirements}
    Responsibilities: ${responsibilities}
    Skills: ${skills}
    Interview Rules:
    1. Short questions (max 20 words)
    2. Ignore user off-topic questions
    3. Ask one question at a time
    4. Professional and friendly
    5. Do NOT answer for the candidate
    6. Maximum 5 questions per interview
    Response Format: Return ONLY JSON: { "text": "...", "timestamp": "ISO timestamp" }
    `
  });

  const conversationContext = chatHistory.map(msg => `${msg.type === "ai" ? "INTERVIEWER" : "CANDIDATE"}: ${msg.text}`).join("\n") + "\n\n";
  const prompt = `
  ${conversationContext}
    Generate the NEXT SINGLE interview question based on:
    1. Job details
    2. Candidate answers
    3. Short, precise question
    4. Ignore any distractions from candidate.
    5. If user wants to stop interview, include stop_interview keyword in the ending message.
    Return ONLY one question in JSON format.
    `;

  try {
    const response = await aiAgent.run(prompt);
    const raw = response.output[0]?.content || "";
    if (!raw.trim()) return null;

    const cleanResponse = raw.replace(/```json\s*|```/g, "").trim();
    const message = JSON.parse(cleanResponse);

    if (!message.text || !message.timestamp) return null;

    const aiMessage = {
      type: "ai",
      text: message.text,
      timestamp: message.timestamp,
      questionNumber: chatHistory.filter(m => m.type === "ai").length + 1
    };

    const endWords = ["stop_interview"];
    if (endWords.some(word => aiMessage.text.toLowerCase().includes(word))) {
      const finalScore = Math.floor(Math.random() * 41) + 60;
      const feedback = "Thank you for participating. You performed well overall.";
      console.log('User want to end interview  detectt !!!!');
    }

    conv.messages.push(aiMessage);
    conversations.set(socketId, conv);

    return aiMessage;

  } catch (err) {
    console.error(err);
    return null;
  }
};


export const getConversationHistory = (socketId) => {
  const conv = conversations.get(socketId);
  return conv ? conv.messages : [];
};

export const getConversationStats = (socketId) => {
  const conv = conversations.get(socketId);
  if (!conv) return null;
  const aiMessages = conv.messages.filter(m => m.type === 'ai');
  const userMessages = conv.messages.filter(m => m.type === 'user');
  return { totalMessages: conv.messages.length, questionsAsked: aiMessages.length, userResponses: userMessages.length, lastQuestion: aiMessages.length > 0 ? aiMessages[aiMessages.length - 1].text : null };
};

export const analyzeSpeechPattern = async (transcript, currentQuestion, previousPatterns) => {
  const transcriptLength = transcript.length;
  const wordCount = transcript.split(' ').length;
  let analysis = { transcriptLength, wordCount, confidence: "medium", completeness: "partial", feedback: "" };
  if (wordCount < 5) { analysis.confidence = "low"; analysis.completeness = "very_brief"; analysis.feedback = "Response was very brief. Consider providing more detailed answers."; }
  else if (wordCount < 15) { analysis.confidence = "medium"; analysis.completeness = "brief"; analysis.feedback = "Response was concise. Could benefit from more elaboration."; }
  else if (wordCount < 30) { analysis.confidence = "high"; analysis.completeness = "adequate"; analysis.feedback = "Response was well-formed and appropriate in length."; }
  else { analysis.confidence = "very_high"; analysis.completeness = "detailed"; analysis.feedback = "Response was detailed and comprehensive."; }
  const questionKeywords = currentQuestion ? currentQuestion.toLowerCase().split(' ') : [];
  const answerKeywords = transcript.toLowerCase().split(' ');
  const matchingKeywords = questionKeywords.filter(keyword => answerKeywords.some(answerWord => answerWord.includes(keyword)));
  analysis.feedback += matchingKeywords.length > 0 ? " Response addressed the question well." : " Consider ensuring your response directly addresses the question asked.";
  return analysis;
};





export const saveInterviewScorecard = async (req, res) => {
  try {
    const data = req.body;
    console.log('data', data);
    
    res.status(200).json({ success: true, message: "Scorecard saved successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to save scorecard" });
  }
}