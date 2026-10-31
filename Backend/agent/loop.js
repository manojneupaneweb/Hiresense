import { evaluationSchema } from "./schemas.js";
import { SYSTEM_PROMPT, wrapCandidateText } from "./prompts.js";
import { createToolRuntime, TOOL_DEFINITIONS } from "./tools.js";
import {
  followUpQuestion,
  isShallow,
  planTopics,
  recommend,
  scoreAnswers,
} from "./fallback.js";

const DEFAULT_MAX_STEPS = 8;
const DEFAULT_TIMEOUT_MS = 20000;

export function withTimeout(promise, ms, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

export async function withRetry(fn, attempts = 2) {
  let lastError;
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await fn(i);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

function pairsFromTranscript(transcript) {
  if (Array.isArray(transcript)) {
    return transcript.map((turn) => ({
      question: turn.question || turn.prompt || "",
      answer: turn.answer || turn.text || "",
    }));
  }
  return [{ question: "Tell me about your experience.", answer: String(transcript || "") }];
}

/**
 * One interview pass:
 * plan (job + rubric + resume tools) -> follow-up decisions -> score -> save_evaluation.
 * `complete` is optional. When it is missing or it throws, scoring uses the deterministic fallback.
 * The fallback ignores names and injected instructions. See Backend/agent/fallback.js.
 */
export async function runInterviewAgent(input) {
  const maxSteps = input.maxSteps ?? DEFAULT_MAX_STEPS;
  const timeoutMs = input.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const steps = [];
  const session = input.session || {};
  const runtime = createToolRuntime(session);
  const pairs = pairsFromTranscript(input.transcript);

  async function callTool(name, args) {
    if (steps.length >= maxSteps) {
      throw new Error("Agent step limit reached");
    }
    const result = await withTimeout(runtime[name](args), timeoutMs, name);
    steps.push({ type: "tool", name, args, result });
    return result;
  }

  const job = await callTool("get_job_description", { jobId: input.jobId || "job" });
  const rubric = await callTool("get_rubric", { jobId: input.jobId || "job" });
  const resume = await callTool("get_resume_summary", { candidateId: input.candidateId || "candidate" });
  const topics = planTopics(rubric);
  steps.push({ type: "plan", topics, jobTitle: job.title, resume: resume.summary });

  const followUps = [];
  for (const pair of pairs) {
    if (steps.length >= maxSteps) break;
    const shallow = isShallow(pair.answer);
    const question = shallow ? followUpQuestion(pair.question) : null;
    steps.push({
      type: "ask",
      question: pair.question,
      candidate: wrapCandidateText(pair.answer),
      followUp: question,
      reason: shallow ? "Answer was vague or shallow." : "Answer was specific enough to move on.",
    });
    if (question) {
      followUps.push({
        afterAnswer: String(pair.answer).slice(0, 120),
        question,
        reason: "Answer was vague or shallow.",
      });
    }
  }

  let evaluation;
  try {
    if (typeof input.complete === "function") {
      evaluation = await withRetry(
        () => withTimeout(
          input.complete({
            system: SYSTEM_PROMPT,
            tools: TOOL_DEFINITIONS,
            transcript: pairs.map((pair) => ({
              question: pair.question,
              answer: wrapCandidateText(pair.answer),
            })),
            topics,
          }),
          timeoutMs,
          "model",
        ),
        input.retries ?? 2,
      );
    } else {
      throw new Error("No model configured");
    }
  } catch (error) {
    steps.push({ type: "fallback", message: error.message });
    const scores = scoreAnswers(pairs.map((pair) => pair.answer));
    evaluation = {
      topics,
      followUps,
      scores,
      summary: `Recommended for human review. ${scores.map((row) => `${row.category} ${row.score}/10`).join(", ")}.`,
      recommendation: recommend(scores),
    };
  }

  const parsed = evaluationSchema.parse({
    ...evaluation,
    topics: evaluation.topics?.length ? evaluation.topics : topics,
    followUps: evaluation.followUps || followUps,
  });

  if (steps.length < maxSteps) {
    await callTool("save_evaluation", {
      interviewId: input.interviewId || "interview",
      scores: parsed.scores,
    });
  }

  steps.push({
    type: "finish",
    summary: parsed.summary,
    recommendation: parsed.recommendation,
    humanDecision: null,
  });

  return { evaluation: parsed, steps, saved: session.saved };
}
