import { CATEGORIES } from "./schemas.js";

const TECH = [
  "index", "query", "latency", "cache", "redis", "api", "test", "schema",
  "react", "node", "mongodb", "complexity", "transaction", "deploy", "monitor",
  "sql", "docker", "queue",
];

// Drop instructions hidden in an answer so they cannot move the score.
export function sanitizeCandidateText(text) {
  return String(text ?? "")
    .replace(/ignore (the |all )?(rubric|instructions|previous|rules)[^.?!]*/gi, " ")
    .replace(/give me\s+\d+\s*\/\s*10[^.?!]*/gi, " ")
    .replace(/you are now[^.?!]*/gi, " ")
    .replace(/system prompt[^.?!]*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isShallow(answer) {
  const text = sanitizeCandidateText(answer);
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length < 12) return true;
  const specifics = text.match(/\b(because|for example|for instance|measured|reduced|increased|i built|i used)\b/gi);
  return !specifics && words.length < 28;
}

function clamp(n) {
  return Math.max(0, Math.min(10, n));
}

export function quoteEvidence(text) {
  const clean = sanitizeCandidateText(text);
  const sentence = clean.split(/(?<=[.!?])\s+/)[0] || clean || "No candidate text.";
  return sentence.slice(0, 180);
}

export function scoreAnswers(answers) {
  const blob = answers.map((a) => sanitizeCandidateText(a)).join(" ");
  const words = blob.split(/\s+/).filter(Boolean);
  const n = words.length;
  const lower = blob.toLowerCase();
  const hits = TECH.filter((term) => lower.includes(term)).length;
  const hedges = (blob.match(/\b(maybe|perhaps|not sure|i guess|kinda|sort of)\b/gi) || []).length;
  const examples = (blob.match(/\b(for example|for instance|because|measured|reduced|increased)\b/gi) || []).length;

  const communication = clamp(Math.round(Math.min(n, 100) / 8));
  const confidence = clamp(communication + Math.min(examples, 2) - hedges * 2);
  let technical = hits * 2 + Math.min(examples, 2);
  // Short answers cannot reach a high technical score by listing keywords.
  if (n < 25) technical = Math.min(technical, 3);
  else if (n < 55) technical = Math.min(technical, 6);
  technical = clamp(technical);

  const evidence = [quoteEvidence(blob)];
  const byCategory = {
    communication,
    confidence,
    technical_knowledge: technical,
  };

  return CATEGORIES.map((category) => ({
    category,
    score: byCategory[category],
    reasoning: reasoningFor(category, byCategory[category], n, hits),
    evidence,
  }));
}

function reasoningFor(category, score, words, hits) {
  if (category === "communication") {
    return `Based on ${words} words of candidate text after untrusted instructions were removed. Score ${score}/10.`;
  }
  if (category === "confidence") {
    return `Hedging lowered this score and concrete examples raised it. Score ${score}/10.`;
  }
  return `Matched ${hits} technical terms from the screening lexicon. Score ${score}/10.`;
}

export function recommend(scores) {
  const avg = scores.reduce((sum, row) => sum + row.score, 0) / scores.length;
  if (avg >= 7) return "advance_to_human_review";
  if (avg >= 4) return "needs_human_review";
  return "do_not_advance";
}

export function planTopics(rubric) {
  const fromRubric = rubric?.topics?.length ? rubric.topics : CATEGORIES;
  return fromRubric.slice(0, 5);
}

export function followUpQuestion(question) {
  return `Could you walk through one specific example related to ${question || "that"}?`;
}
