import { 
  generateJobInterviewQuestions, 
  clearConversation, 
  processUserResponse,
  getConversationHistory,
  getConversationStats,
  analyzeSpeechPattern
} from "./Controllers/ai.controller.js"; 

const conversations = new Map();

export function setupChatSocket(io) {
  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // Start interview
    socket.on("start_interview", async (jobDetails) => {
      try {
        clearConversation(socket.id);
        
        conversations.set(socket.id, { 
          messages: [], 
          jobDetails,
          currentQuestion: null,
          speechPatterns: []
        });
        
        const conv = conversations.get(socket.id);

        // Generate welcome message
        const welcomeMessage = {
          text: "Hello! Welcome to your interview. I'll be asking you questions about your experience and skills related to this position.",
          timestamp: new Date().toISOString(),
        };
        
        socket.emit("interview_message", welcomeMessage);
        
        // Add to conversation history
        conv.messages.push({
          type: "ai",
          text: welcomeMessage.text,
          timestamp: welcomeMessage.timestamp,
          questionNumber: 0
        });
        
        console.log("📥 Logged welcome message");

        // Generate first question
        const questions = await generateJobInterviewQuestions(socket.id, jobDetails);
        if (questions.length > 0) {
          const firstQuestion = questions[0];
          socket.emit("interview_message", firstQuestion);
          conv.currentQuestion = firstQuestion;
          conv.messages.push({
            type: "ai",
            text: firstQuestion.text,
            timestamp: firstQuestion.timestamp,
            questionNumber: 1
          });
          console.log("📥 Sent first question");
        }
      } catch (error) {
        console.error("❌ Error starting interview:", error);
        socket.emit("interview_error", {
          message: "Failed to start interview. Please try again."
        });
      }
    });

    // Receive user messages
    socket.on("user_message", async (messageText) => {
      try {
        console.log("📥 Received user message:", messageText);
        
        const conv = conversations.get(socket.id);
        if (!conv || !conv.currentQuestion) {
          console.log("❌ No active conversation or question found");
          socket.emit("interview_message", {
            text: "Please start the interview first.",
            timestamp: new Date().toISOString()
          });
          return;
        }

        // Add user message to conversation history
        const userMessage = {
          type: "user",
          text: messageText,
          timestamp: new Date().toISOString(),
          question: conv.currentQuestion.text
        };
        
        conv.messages.push(userMessage);
        console.log("📥 Logged user response");

        // Process user response and get next question
        const nextQuestion = await processUserResponse(
          socket.id, 
          messageText, 
          conv.currentQuestion,
          conv.jobDetails
        );

        if (nextQuestion) {
          socket.emit("interview_message", nextQuestion);
          conv.currentQuestion = nextQuestion;
          
          // Add to conversation history
          conv.messages.push({
            type: "ai",
            text: nextQuestion.text,
            timestamp: nextQuestion.timestamp,
            questionNumber: conv.messages.filter(m => m.type === 'ai').length
          });
          
          console.log("📥 Sent next question");
          
          // Check if we should end interview (after 5-7 questions)
          const stats = getConversationStats(socket.id);
          if (stats && stats.questionsAsked >= 5) {
            // Randomly decide to end between 5-7 questions
            if (stats.questionsAsked >= 7 || Math.random() > 0.6) {
              const endMessage = {
                text: "Thank you for your responses. This concludes our interview. We'll review your answers and be in touch soon!",
                timestamp: new Date().toISOString()
              };
              
              setTimeout(() => {
                socket.emit("interview_message", endMessage);
                
                // Add to conversation history
                conv.messages.push({
                  type: "ai",
                  text: endMessage.text,
                  timestamp: endMessage.timestamp,
                  questionNumber: null
                });
                
                console.log("📥 Interview completed");
                
                // Generate final feedback
                generateFinalFeedback(socket.id, socket);
              }, 2000);
            }
          }
        } else {
          const endMessage = {
            text: "Your interview is over. Thank you for your time!",
            timestamp: new Date().toISOString()
          };
          socket.emit("interview_message", endMessage);
          
          // Add to conversation history
          conv.messages.push({
            type: "ai",
            text: endMessage.text,
            timestamp: endMessage.timestamp,
            questionNumber: null
          });
          
          console.log("📥 Interview ended");
          
          // Generate final feedback
          generateFinalFeedback(socket.id, socket);
        }
      } catch (error) {
        console.error("❌ Error processing user message:", error);
        socket.emit("interview_error", {
          message: "Error processing your response. Please try again."
        });
      }
    });

    // Handle speech stopped event
    socket.on("speech_stopped", async (data) => {
      try {
        console.log("🔇 Speech stopped detected:", data);
        
        const conv = conversations.get(socket.id);
        if (!conv) return;
        
        // Analyze speech pattern
        const analysis = await analyzeSpeechPattern(
          data.lastTranscript, 
          conv.currentQuestion ? conv.currentQuestion.text : "No current question",
          conv.speechPatterns
        );
        
        // Store speech pattern data
        conv.speechPatterns.push({
          timestamp: new Date().toISOString(),
          lastTranscript: data.lastTranscript,
          analysis: analysis,
          duration: "2_seconds_pause"
        });
        
        console.log("📊 Speech analysis:", analysis);
        
        // Send analysis back to frontend
        socket.emit("speech_analysis", {
          ...analysis,
          timestamp: new Date().toISOString()
        });
        
      } catch (error) {
        console.error("❌ Error analyzing speech pattern:", error);
      }
    });

    // Get conversation history
    socket.on("get_conversation_history", () => {
      try {
        const history = getConversationHistory(socket.id);
        socket.emit("conversation_history", history);
        console.log("📋 Sent conversation history");
      } catch (error) {
        console.error("❌ Error getting conversation history:", error);
      }
    });

    // Get conversation stats
    socket.on("get_conversation_stats", () => {
      try {
        const stats = getConversationStats(socket.id);
        socket.emit("conversation_stats", stats);
        console.log("📈 Sent conversation stats");
      } catch (error) {
        console.error("❌ Error getting conversation stats:", error);
      }
    });

    // Handle inactivity
    socket.on("inactivity_detected", (data) => {
      console.log("⏰ Inactivity detected for socket:", data.socketId);
      
      const conv = conversations.get(socket.id);
      if (conv) {
        conv.speechPatterns.push({
          timestamp: new Date().toISOString(),
          event: "inactivity",
          duration: "10_seconds",
          analysis: "User was inactive for extended period"
        });
      }
    });

    // End interview manually
    socket.on("end_interview", (data) => {
      try {
        console.log("🛑 Interview ended by user for socket:", data.socketId);
        
        const conv = conversations.get(socket.id);
        if (conv) {
          // Generate final feedback before clearing
          generateFinalFeedback(socket.id, socket);
        }
        
        clearConversation(socket.id);
        
      } catch (error) {
        console.error("❌ Error ending interview:", error);
      }
    });

    // Handle errors
    socket.on("error", (error) => {
      console.error("❌ Socket error:", error);
    });

    // Handle disconnect
    socket.on("disconnect", (reason) => {
      console.log("🔴 User disconnected:", socket.id, "Reason:", reason);
      
      const conv = conversations.get(socket.id);
      if (conv) {
        // Generate final feedback before clearing if interview was in progress
        if (conv.messages.length > 2) { // More than just welcome message
          generateFinalFeedback(socket.id, socket);
        }
      }
      
      clearConversation(socket.id);
    });

    // Generate final feedback function
    const generateFinalFeedback = async (socketId, socket) => {
      try {
        const conv = conversations.get(socketId);
        if (!conv) return;
        
        const stats = getConversationStats(socketId);
        const history = getConversationHistory(socketId);
        
        // Simple feedback based on conversation length
        let feedback = "";
        if (stats.questionsAsked >= 5) {
          feedback = "Thank you for completing the interview. You provided detailed responses to all questions.";
        } else if (stats.questionsAsked >= 3) {
          feedback = "Thank you for your time. We appreciate your responses to our questions.";
        } else {
          feedback = "Thank you for participating. We'll review the information you provided.";
        }
        
        // Add speech pattern analysis to feedback
        if (conv.speechPatterns.length > 0) {
          const pauses = conv.speechPatterns.filter(p => p.duration === "2_seconds_pause").length;
          if (pauses > 0) {
            feedback += ` You took ${pauses} thoughtful pause${pauses > 1 ? 's' : ''} during your responses, which shows careful consideration.`;
          }
        }
        
        const report = {
          duration: Math.floor((new Date() - new Date(conv.messages[0]?.timestamp)) / 1000),
          totalQuestions: stats.questionsAsked,
          totalResponses: stats.userResponses,
          feedback: feedback,
          jobTitle: conv.jobDetails?.title || 'Unknown Position',
          completed: stats.questionsAsked >= 5
        };
        
        socket.emit("interview_complete", report);
        console.log("📊 Interview report generated:", report);
        
      } catch (error) {
        console.error("❌ Error generating final feedback:", error);
      }
    };
  });
}