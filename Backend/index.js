import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/DBconnect.js";
import app from "./app.js";
import { setupChatSocket } from "./chatSocket.js"; // must match the export

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    console.log("✅ Database connected successfully");

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: ["http://localhost:5173"], // your frontend URL
        methods: ["GET", "POST"],
      },
    });

    // Initialize Socket.io events
    setupChatSocket(io);

    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT} with Socket.io`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err);
  });
