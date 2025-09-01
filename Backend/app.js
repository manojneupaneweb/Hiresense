import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";


const app = express();
dotenv.config();

app.use(cors());

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


import userRoutes from "./routes/userRoutes.js";

app.use("/api/user", userRoutes); 





export default app;