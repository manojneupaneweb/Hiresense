
import { createAgent, gemini } from "@inngest/agent-kit";
import { log } from "console";
import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

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
// Analyze CV with Gemini AI
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
  console.log('response :', response.output[0].content);
  
  const raw = response.output[0]?.content;
  console.log('raw :', raw);
  
  if (raw == '') return null;

  // Strip ```json and ``` if AI wraps it
  const jsonString = raw.replace(/```json\s*|```/g, "").trim();

//   const jsonString = JSON.parse(raw);

  console.log('jsonString ', jsonString);
  

return JSON.parse(jsonString);
  try {
  } catch (e) {
    console.log("Failed to parse JSON from AI response:", e.message, raw);
    return null;
  }
};

// Controller
const CVAnalysis = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: "No CV file uploaded" });
    }

    // Your working PDF-to-text converter
    const filetext = await uploadedparsing(file);
    if (!filetext) {
      return res.status(400).json({ success: false, message: "Failed to parse CV text" });
    }

    const { jobDescription, requirements, responsibilities, skills } = req.body;

    // Call AI analyzer
    const analysis = await analyzecv(filetext, jobDescription, requirements, responsibilities, skills);

    res.status(200).json({
      success: true,
      message: "CV analyzed successfully",
      jobDescription,
      requirements,
      responsibilities,
      skills,
      filetext,
      analysis // { score, suggestion }
    });
  } catch (error) {
    console.error("CVAnalysis error:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export { CVAnalysis };
