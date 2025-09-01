import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const allowedOrigins = ['http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  credentials: true // allow cookies
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/job.route.js";
app.use("/api/user", userRoutes);
app.use("/api/job", jobRoutes);

export default app;
