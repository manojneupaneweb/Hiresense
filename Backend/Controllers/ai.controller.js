
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

export const clearConversation = (socketId) => {
  conversations.delete(socketId);
  console.log(`🗑️ Conversation cleared for socket: ${socketId}`);
};

export const generateJobInterviewQuestions = async (socketId, jobDetails) => {
  const { jobDescription, requirements, responsibilities, skills, title, company } = jobDetails;

  if (!conversations.has(socketId)) {
    conversations.set(socketId, {
      messages: [],
      jobDetails: { jobDescription, requirements, responsibilities, skills, title, company }
    });
  }

  const conv = conversations.get(socketId);
  const chatHistory = conv.messages;

  const aiAgent = createAgent({
    model: gemini({
      model: "gemini-1.5-flash",
      apiKey: process.env.GEMINI_API_KEY,
    }),
    name: "AI Interview Assistant",
    system: `
      You are a professional AI interviewer conducting a job interview for the position: ${title} at ${company}.
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      REQUIREMENTS:
      ${requirements}
      
      RESPONSIBILITIES:
      ${responsibilities}
      
      REQUIRED SKILLS:
      ${skills}

      INTERVIEW FLOW RULES:
      1. Start with a warm welcome and introduction
      2. Ask only ONE technical or behavioral question at a time
      3. Questions should progress from general to specific
      4. After 5-7 questions, conclude the interview politely
      5. Never answer questions for the candidate
      6. Maintain professional and friendly tone

      RESPONSE FORMAT:
      Return ONLY valid JSON with this exact structure:
      {
        "text": "Your question or message here",
        "timestamp": "Current ISO timestamp"
      }

      IMPORTANT: No markdown, no code blocks, no additional text outside the JSON.
    `,
  });

  // Build conversation context
  let conversationContext = "";
  if (chatHistory.length > 0) {
    conversationContext = "CONVERSATION HISTORY:\n" +
      chatHistory.map(msg =>
        `${msg.type === 'ai' ? 'INTERVIEWER' : 'CANDIDATE'}: ${msg.text}`
      ).join('\n') +
      "\n\n";
  }

  const prompt = `
    ${conversationContext}
    
    Generate the NEXT SINGLE interview question based on:
    1. The job details above
    2. The conversation history so far
    3. What would be the most appropriate question to ask next
    
    Return ONLY ONE question in the specified JSON format.
  `;

  try {
    const response = await aiAgent.run(prompt);
    const raw = response.output[0]?.content || "";

    if (!raw.trim()) {
      console.error("❌ Empty response from AI");
      return [];
    }

    // Clean the response
    const cleanResponse = raw.replace(/```json\s*|```/g, "").trim();

    let message;
    try {
      message = JSON.parse(cleanResponse);
    } catch (parseError) {
      console.error("❌ JSON parse error:", parseError.message);
      console.error("Raw response:", raw);
      return [];
    }

    // Validate structure
    if (!message.text || !message.timestamp) {
      console.error("❌ Invalid message structure:", message);
      return [];
    }

    // Add to conversation history
    const aiMessage = {
      type: "ai",
      text: message.text,
      timestamp: message.timestamp,
      questionNumber: chatHistory.filter(m => m.type === 'ai').length + 1
    };

    conv.messages.push(aiMessage);
    conversations.set(socketId, conv);

    console.log("✅ Generated question #" + aiMessage.questionNumber + ":", aiMessage.text);
    return [message];

  } catch (error) {
    console.error("❌ Failed to generate question:", error.message);
    return [];
  }
};

export const processUserResponse = async (socketId, userResponse, currentQuestion, jobDetails) => {
  const conv = conversations.get(socketId);
  if (!conv) {
    console.error("❌ No conversation found for socket:", socketId);
    return null;
  }

  const { jobDescription, requirements, responsibilities, skills, title, company } = jobDetails;
  const chatHistory = conv.messages;

  // Add user response to conversation history
  const userMessage = {
    type: "user",
    text: userResponse,
    timestamp: new Date().toISOString(),
    question: currentQuestion.text
  };

  conv.messages.push(userMessage);
  conversations.set(socketId, conv);

  console.log("✅ Saved user response to question:", currentQuestion.text);

  const aiAgent = createAgent({
    model: gemini({
      model: "gemini-1.5-flash",
      apiKey: process.env.GEMINI_API_KEY,
    }),
    name: "AI Interview Assistant",
    system: `
      You are a professional AI interviewer conducting a job interview for: ${title} at ${company}.
      
      JOB DETAILS:
      - Description: ${jobDescription}
      - Requirements: ${requirements}
      - Responsibilities: ${responsibilities}
      - Skills: ${skills}

      CONVERSATION HISTORY:
      ${chatHistory.map(msg =>
      `${msg.type === 'ai' ? 'INTERVIEWER' : 'CANDIDATE'}: ${msg.text}`
    ).join('\n')}

      CURRENT INTERACTION:
      - Your last question: "${currentQuestion.text}"
      - Candidate's response: "${userResponse}"

      YOUR TASK:
      1. Briefly acknowledge the candidate's response (1 sentence max)
      2. Ask the NEXT SINGLE relevant question based on:
         - Job requirements
         - Conversation flow
         - Candidate's previous answer
      3. Keep questions technical and role-specific
      4. After 5-7 total questions, conclude the interview

      RESPONSE FORMAT:
      Return ONLY valid JSON with this exact structure:
      {
        "text": "Your acknowledgement and next question",
        "timestamp": "Current ISO timestamp"
      }

      IMPORTANT: No markdown, no code blocks, no additional text.
    `,
  });

  const prompt = `
    Analyze the candidate's response and generate the next appropriate interview question.
    
    Candidate's response to "${currentQuestion.text}":
    "${userResponse}"
    
    Return ONLY a JSON object with the next question.
  `;

  try {
    const response = await aiAgent.run(prompt);
    const raw = response.output[0]?.content || "";

    if (!raw.trim()) {
      console.error("❌ Empty response from AI for user response");
      return null;
    }

    const cleanResponse = raw.replace(/```json\s*|```/g, "").trim();
    const message = JSON.parse(cleanResponse);

    if (!message.text || !message.timestamp) {
      console.error("❌ Invalid message structure:", message);
      return null;
    }

    // Add AI response to conversation history
    const aiMessage = {
      type: "ai",
      text: message.text,
      timestamp: message.timestamp,
      questionNumber: chatHistory.filter(m => m.type === 'ai').length + 1
    };

    conv.messages.push(aiMessage);
    conversations.set(socketId, conv);

    console.log("✅ Generated follow-up question #" + aiMessage.questionNumber + ":", aiMessage.text);
    return message;

  } catch (error) {
    console.error("❌ Failed to process user response:", error.message);
    return null;
  }
};

// Helper function to get conversation history
export const getConversationHistory = (socketId) => {
  const conv = conversations.get(socketId);
  return conv ? conv.messages : [];
};

// Helper function to get conversation stats
export const getConversationStats = (socketId) => {
  const conv = conversations.get(socketId);
  if (!conv) return null;

  const aiMessages = conv.messages.filter(m => m.type === 'ai');
  const userMessages = conv.messages.filter(m => m.type === 'user');

  return {
    totalMessages: conv.messages.length,
    questionsAsked: aiMessages.length,
    userResponses: userMessages.length,
    lastQuestion: aiMessages.length > 0 ? aiMessages[aiMessages.length - 1].text : null
  };
};
// Add this function to your ai.controller.js
export const analyzeSpeechPattern = async (transcript, currentQuestion, previousPatterns) => {
  // Simple analysis logic - you can enhance this with AI
  const transcriptLength = transcript.length;
  const wordCount = transcript.split(' ').length;
  
  let analysis = {
    transcriptLength: transcriptLength,
    wordCount: wordCount,
    confidence: "medium",
    completeness: "partial",
    feedback: ""
  };
  
  if (wordCount < 5) {
    analysis.confidence = "low";
    analysis.completeness = "very_brief";
    analysis.feedback = "Response was very brief. Consider providing more detailed answers.";
  } else if (wordCount < 15) {
    analysis.confidence = "medium";
    analysis.completeness = "brief";
    analysis.feedback = "Response was concise. Could benefit from more elaboration.";
  } else if (wordCount < 30) {
    analysis.confidence = "high";
    analysis.completeness = "adequate";
    analysis.feedback = "Response was well-formed and appropriate in length.";
  } else {
    analysis.confidence = "very_high";
    analysis.completeness = "detailed";
    analysis.feedback = "Response was detailed and comprehensive.";
  }
  
  // Check if question was answered (simple keyword matching)
  const questionKeywords = currentQuestion ? currentQuestion.toLowerCase().split(' ') : [];
  const answerKeywords = transcript.toLowerCase().split(' ');
  
  const matchingKeywords = questionKeywords.filter(keyword => 
    answerKeywords.some(answerWord => answerWord.includes(keyword))
  );
  
  if (matchingKeywords.length > 0) {
    analysis.feedback += " Response addressed the question well.";
  } else {
    analysis.feedback += " Consider ensuring your response directly addresses the question asked.";
  }
  
  return analysis;
};