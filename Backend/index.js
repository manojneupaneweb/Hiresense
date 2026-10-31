import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/DBconnect.js";
import app from "./app.js";
import { setupChatSocket } from "./chatSocket.js";
import logger from "./config/logger.js";
import { startEvaluationWorker } from "./services/evaluationQueue.js";

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: ["http://localhost:5173"], // your frontend URL
        methods: ["GET", "POST"],
      },
    });

    // Initialize Socket.io events
    setupChatSocket(io);
    startEvaluationWorker();

    server.listen(PORT, () => {
      logger.info({ port: PORT }, "server listening");
    });
  })
  .catch((err) => {
    logger.error({ err: err.message }, "DB connection failed");
  });
