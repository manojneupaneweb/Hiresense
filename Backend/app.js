import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const allowedOrigins = ['http://localhost:5173'];

// Add this middleware to set CORS headers for specific routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});
// Handle preflight requests
// app.options('*', cors({
//     origin: allowedOrigins,
//     credentials: true
// }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import userRoutes from "./routes/userRoutes.js";
app.use("/api/user", userRoutes);

export default app;