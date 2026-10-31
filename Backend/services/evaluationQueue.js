import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import logger from "../config/logger.js";
import { createEvaluationJob, processEvaluation } from "./evaluationService.js";

let queue;

function redisOn() {
  return Boolean(process.env.REDIS_URL) && process.env.QUEUE_INLINE !== "true";
}

function connection() {
  return new IORedis(process.env.REDIS_URL, { maxRetriesPerRequest: null });
}

export function startEvaluationWorker() {
  if (!redisOn()) {
    logger.info("evaluation queue inline (no REDIS_URL)");
    return null;
  }
  const worker = new Worker(
    "evaluations",
    async (bullJob) => {
      await processEvaluation(bullJob.data.id);
      return { id: bullJob.data.id };
    },
    { connection: connection() },
  );
  worker.on("failed", (job, error) => {
    logger.error({ id: job?.id, err: error.message }, "bull job failed");
  });
  return worker;
}

export async function enqueueEvaluation(payload) {
  const job = createEvaluationJob(payload);
  if (!redisOn()) {
    setImmediate(() => {
      processEvaluation(job.id);
    });
    return { id: job.id, status: "queued" };
  }
  if (!queue) queue = new Queue("evaluations", { connection: connection() });
  await queue.add("score", { id: job.id }, {
    attempts: 3,
    backoff: { type: "exponential", delay: 500 },
    removeOnComplete: 100,
  });
  return { id: job.id, status: "queued" };
}
