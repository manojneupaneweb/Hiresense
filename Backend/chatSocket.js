import {
  generateJobInterviewQuestions,
  clearConversation,
  processUserResponse,
  getConversationHistory,
  getConversationStats,
  analyzeSpeechPattern
} from "./Controllers/ai.controller.js";

const conversations = new Map();

function logMessage(direction, socketId, message) {
  const timestamp = new Date().toISOString();
  console.log(`${direction} (${socketId}):`, { ...message, timestamp });
}

export function setupChatSocket(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("start_interview", async (jobDetails) => {
      try {
        clearConversation(socket.id);

        const conversation = {
          messages: [],
          jobDetails,
          currentQuestion: null,
          speechPatterns: [],
          startTime: new Date()
        };

        conversations.set(socket.id, conversation);

        const questions = await generateJobInterviewQuestions(socket.id, jobDetails);
        if (questions.length > 0) {
          const firstQuestion = questions[0];
          socket.emit("interview_message", firstQuestion);
          logMessage("📤 Outgoing", socket.id, firstQuestion);
          conversation.currentQuestion = firstQuestion;
          conversation.messages.push({
            type: "ai",
            text: firstQuestion.text,
            timestamp: firstQuestion.timestamp,
            questionNumber: 1
          });
        }
      } catch (error) {
        console.error("Error starting interview:", error);
        socket.emit("interview_error", {
          message: "Failed to start interview. Please try again."
        });
      }
    });

    socket.on("user_message", async (messageText) => {
      try {
        console.log('User Mmessage :', messageText);

        // Handle both string and object formats
        const text = typeof messageText === 'string' ? messageText : messageText.text;

        logMessage("📥 Incoming", socket.id, { text: text });

        const conversation = conversations.get(socket.id);
        if (!conversation?.currentQuestion) {
          socket.emit("interview_message", {
            text: "Please start the interview first.",
            timestamp: new Date().toISOString()
          });
          return;
        }
        const userMessage = {
          type: "user",
          text: text,
          timestamp: new Date().toISOString(),
          question: conversation.currentQuestion.text
        };

        conversation.messages.push(userMessage);

        const nextQuestion = await processUserResponse(
          socket.id,
          text,
          conversation.currentQuestion,
          conversation.jobDetails
        );

        if (nextQuestion) {
          socket.emit("interview_message", nextQuestion);
          logMessage("📤 Outgoing", socket.id, nextQuestion);
          conversation.currentQuestion = nextQuestion;
          conversation.messages.push({
            type: "ai",
            text: nextQuestion.text,
            timestamp: nextQuestion.timestamp,
            questionNumber: conversation.messages.filter(m => m.type === 'ai').length
          });
        }
      } catch (error) {
        console.error("Error processing user message:", error);
        socket.emit("interview_error", {
          message: "Error processing your response."
        });
      }
    });

    socket.on("speech_stopped", async (data) => {
      try {
        const conversation = conversations.get(socket.id);
        if (!conversation) return;

        const analysis = await analyzeSpeechPattern(
          data.lastTranscript,
          conversation.currentQuestion?.text || "No current question",
          conversation.speechPatterns
        );

        conversation.speechPatterns.push({
          timestamp: new Date().toISOString(),
          lastTranscript: data.lastTranscript,
          analysis: analysis,
          duration: "2_seconds_pause"
        });

        socket.emit("speech_analysis", {
          ...analysis,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error("Error analyzing speech pattern:", error);
      }
    });

    socket.on("get_conversation_history", () => {
      try {
        const history = getConversationHistory(socket.id);
        socket.emit("conversation_history", history);
      } catch (error) {
        console.error("Error getting conversation history:", error);
      }
    });

    socket.on("get_conversation_stats", () => {
      try {
        const stats = getConversationStats(socket.id);
        socket.emit("conversation_stats", stats);
      } catch (error) {
        console.error("Error getting conversation stats:", error);
      }
    });

    socket.on("inactivity_detected", () => {
      const conversation = conversations.get(socket.id);
      if (conversation) {
        conversation.speechPatterns.push({
          timestamp: new Date().toISOString(),
          event: "inactivity",
          duration: "10_seconds",
          analysis: "User was inactive for extended period"
        });
      }
    });

    socket.on("end_interview", () => {
      try {
        const conversation = conversations.get(socket.id);
        if (conversation) generateFinalFeedback(conversation, socket);
        clearConversation(socket.id);
      } catch (error) {
        console.error("Error ending interview:", error);
      }
    });

    socket.on("disconnect", () => {
      const conversation = conversations.get(socket.id);
      if (conversation?.messages.length > 2) {
        generateFinalFeedback(conversation, socket);
      }
      clearConversation(socket.id);
    });

    async function checkInterviewCompletion(conversation, socket) {
      const stats = getConversationStats(socket.id);
      if (stats?.questionsAsked >= 5) {
        if (stats.questionsAsked >= 7 || Math.random() > 0.6) {
          setTimeout(() => {
            endInterview(conversation, socket);
          }, 2000);
        }
      }
    }

    async function endInterview(conversation, socket) {
      const endMessage = {
        text: "Thank you for your responses. This concludes our interview. We'll review your answers and be in touch soon!",
        timestamp: new Date().toISOString()
      };

      socket.emit("interview_message", endMessage);
      logMessage("📤 Outgoing", socket.id, endMessage);

      conversation.messages.push({
        type: "ai",
        text: endMessage.text,
        timestamp: endMessage.timestamp,
        questionNumber: null
      });

      generateFinalFeedback(conversation, socket);
    }

    function generateFinalFeedback(conversation, socket) {
      try {
        const stats = getConversationStats(socket.id);
        let feedback = "Thank you for participating. We'll review the information you provided.";

        if (stats.questionsAsked >= 5) {
          feedback = "Thank you for completing the interview. You provided detailed responses to all questions.";
        } else if (stats.questionsAsked >= 3) {
          feedback = "Thank you for your time. We appreciate your responses to our questions.";
        }

        if (conversation.speechPatterns.length > 0) {
          const pauses = conversation.speechPatterns.filter(p => p.duration === "2_seconds_pause").length;
          if (pauses > 0) {
            feedback += ` You took ${pauses} thoughtful pause${pauses > 1 ? 's' : ''} during your responses.`;
          }
        }

        const duration = Math.floor((new Date() - conversation.startTime) / 1000);
        const report = {
          duration,
          totalQuestions: stats.questionsAsked,
          totalResponses: stats.userResponses,
          feedback,
          jobTitle: conversation.jobDetails?.title || 'Unknown Position',
          completed: stats.questionsAsked >= 5
        };

        socket.emit("interview_complete", report);
      } catch (error) {
        console.error("Error generating final feedback:", error);
      }
    }
  });
}