import { Router } from "express";
import { z } from "zod";
import verifyJwt from "../middleware/auth.middleware.js";
import { enqueueEvaluation } from "../services/evaluationQueue.js";
import { getEvaluationJob, setHumanDecision } from "../services/evaluationService.js";

const router = Router();

const createSchema = z.object({
  interviewId: z.string().min(1).optional(),
  jobId: z.string().min(1),
  candidateId: z.string().min(1),
  transcript: z.union([z.string().min(1), z.array(z.object({
    question: z.string().optional(),
    answer: z.string().optional(),
    text: z.string().optional(),
  })).min(1)]),
  recordingPath: z.string().optional(),
});

const decisionSchema = z.object({
  decision: z.enum(["advance", "hold", "reject"]),
});

router.post("/", verifyJwt, async (req, res, next) => {
  try {
    const payload = createSchema.parse(req.body);
    const queued = await enqueueEvaluation(payload);
    res.status(202).json({ success: true, ...queued });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", verifyJwt, (req, res) => {
  const job = getEvaluationJob(req.params.id);
  if (!job) return res.status(404).json({ success: false, message: "Job not found" });
  res.json({
    success: true,
    id: job.id,
    status: job.status,
    error: job.error,
    result: job.result,
  });
});

router.post("/:id/decision", verifyJwt, (req, res, next) => {
  try {
    const { decision } = decisionSchema.parse(req.body);
    const job = setHumanDecision(req.params.id, decision);
    if (!job) return res.status(409).json({ success: false, message: "Score is not ready for a decision" });
    res.json({ success: true, id: job.id, humanDecision: decision });
  } catch (error) {
    next(error);
  }
});

export default router;
