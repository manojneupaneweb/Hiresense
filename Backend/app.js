import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/job.route.js";
import paymentRoutes from "./routes/payment.route.js";
import AIRoutes from "./routes/ai.route.js";
import evaluationRoutes from "./routes/evaluation.routes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { openApiSpec } from "./openapi.js";

const app = express();
dotenv.config();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(helmet({ contentSecurityPolicy: false }));
app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true }));
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  credentials: true,
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api-docs.json", (_req, res) => res.json(openApiSpec));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.use("/api/user", userRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/ai", AIRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/evaluations", evaluationRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
