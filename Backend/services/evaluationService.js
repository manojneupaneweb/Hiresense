import { randomUUID } from "crypto";
import { runInterviewAgent } from "../agent/loop.js";
import { createOpenAIComplete } from "../agent/openai.js";
import { purgeRecording } from "./recordings.js";
import logger from "../config/logger.js";

const jobs = new Map();

export function getEvaluationJob(id) {
  return jobs.get(id) || null;
}

export function setHumanDecision(id, decision) {
  const job = jobs.get(id);
  if (!job?.result) return null;
  job.result.humanDecision = decision;
  job.updatedAt = new Date().toISOString();
  return job;
}

export async function processEvaluation(id) {
  const job = jobs.get(id);
  if (!job) return;
  job.status = "active";
  try {
    const complete = createOpenAIComplete();
    const outcome = await runInterviewAgent({
      jobId: job.payload.jobId,
      candidateId: job.payload.candidateId,
      interviewId: job.payload.interviewId || id,
      transcript: job.payload.transcript,
      complete: complete || undefined,
      session: job.payload.session,
    });
    const purged = purgeRecording(job.payload.recordingPath);
    job.status = "completed";
    job.result = {
      evaluation: outcome.evaluation,
      steps: outcome.steps,
      humanDecision: null,
      recordingPurged: purged,
    };
    logger.info({ id, steps: outcome.steps.length }, "evaluation completed");
  } catch (error) {
    job.status = "failed";
    job.error = error.message;
    logger.error({ id, err: error.message }, "evaluation failed");
  }
  job.updatedAt = new Date().toISOString();
  return job;
}

export function createEvaluationJob(payload) {
  const id = randomUUID();
  const job = {
    id,
    status: "queued",
    payload,
    result: null,
    error: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  jobs.set(id, job);
  return job;
}

export function listJobs() {
  return jobs;
}
