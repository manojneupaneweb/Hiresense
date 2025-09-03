import { generateJobInterviewQuestions, clearConversation } from "./Controllers/ai.controller.js"; 

// Map to track ongoing conversations per socket
const conversations = new Map();

export function setupChatSocket(io) {
  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // Start interview
    socket.on("start_interview", async (jobDetails) => {
      // Clear previous conversation
      clearConversation(socket.id, conversations);

      // Initialize conversation with jobDetails
      conversations.set(socket.id, { messages: [], jobDetails, questionQueue: [] });

      // Send welcome message
      socket.emit("interview_message", {
        text: "Hello! Welcome to your interview.",
        timestamp: new Date().toISOString(),
      });

      // Generate first question
      const questions = await generateJobInterviewQuestions(socket.id, jobDetails);
      if (questions.length > 0) {
        // Store questions in queue
        conversations.get(socket.id).questionQueue = questions;
        socket.emit("interview_message", questions[0]);
      }
    });

    // Receive user messages
    socket.on("user_message", async (messageText) => {
      const conv = conversations.get(socket.id);
      if (!conv) return;

      // Save user message
      conv.messages.push({ text: messageText, timestamp: new Date().toISOString() });

      // Get next question from queue
      let nextQuestion = conv.questionQueue.shift();
      if (!nextQuestion) {
        // Generate new question based on latest message
        const newQuestions = await generateJobInterviewQuestions(socket.id, conv.jobDetails);
        if (newQuestions.length > 0) {
          conv.questionQueue = newQuestions;
          nextQuestion = newQuestions.shift();
        }
      }

      // Send next question or end interview
      if (nextQuestion) {
        socket.emit("interview_message", nextQuestion);
      } else {
        socket.emit("interview_message", {
          text: "Your interview is over. Thank you!",
          timestamp: new Date().toISOString(),
        });
        clearConversation(socket.id, conversations);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
      clearConversation(socket.id, conversations);
    });
  });
}
