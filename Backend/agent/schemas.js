import { z } from "zod";

// Scores are a recommendation for a person. They are not a hiring decision.
export const CATEGORIES = ["communication", "confidence", "technical_knowledge"];

export const categoryScoreSchema = z.object({
  category: z.enum(CATEGORIES),
  score: z.number().min(0).max(10),
  reasoning: z.string().min(1),
  evidence: z.array(z.string().min(1)).min(1),
});

export const evaluationSchema = z.object({
  topics: z.array(z.string()).min(1),
  followUps: z.array(z.object({
    afterAnswer: z.string(),
    question: z.string().min(1),
    reason: z.string().min(1),
  })),
  scores: z.array(categoryScoreSchema).length(3),
  summary: z.string().min(1),
  recommendation: z.enum([
    "advance_to_human_review",
    "needs_human_review",
    "do_not_advance",
  ]),
});

export const toolArgsSchema = {
  get_job_description: z.object({ jobId: z.string().min(1) }),
  get_rubric: z.object({ jobId: z.string().min(1) }),
  get_resume_summary: z.object({ candidateId: z.string().min(1) }),
  save_evaluation: z.object({
    interviewId: z.string().min(1),
    scores: z.array(categoryScoreSchema).length(3),
  }),
};
