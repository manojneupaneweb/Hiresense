import { ZodError } from "zod";
import logger from "../config/logger.js";

export function notFound(_req, res) {
  res.status(404).json({ success: false, message: "Not found" });
}

export function errorHandler(err, _req, res, _next) {
  if (err instanceof ZodError) {
    return res.status(400).json({ success: false, message: "Invalid input", issues: err.issues });
  }
  logger.error({ err: err.message }, "request failed");
  const status = err.status || 500;
  res.status(status).json({ success: false, message: status === 500 ? "Something went wrong" : err.message });
}
