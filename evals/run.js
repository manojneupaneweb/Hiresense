import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { runInterviewAgent } from "../Backend/agent/loop.js";

const dir = path.dirname(fileURLToPath(import.meta.url));
const cases = JSON.parse(fs.readFileSync(path.join(dir, "cases.json"), "utf8"));
const RUNS = 3;

function variance(nums) {
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  return nums.reduce((sum, n) => sum + (n - mean) ** 2, 0) / nums.length;
}

const rows = [];
let correct = 0;
let total = 0;

for (const item of cases) {
  const runs = [];
  for (let i = 0; i < RUNS; i += 1) {
    const result = await runInterviewAgent({
      jobId: "eval-job",
      candidateId: "eval-candidate",
      interviewId: `${item.id}-${i}`,
      transcript: item.transcript,
    });
    const scores = Object.fromEntries(result.evaluation.scores.map((row) => [row.category, row.score]));
    runs.push(scores);
  }
  const categories = Object.keys(item.expected);
  for (const category of categories) {
    const values = runs.map((run) => run[category]);
    const [min, max] = item.expected[category];
    const inRange = values.every((value) => value >= min && value <= max);
    if (inRange) correct += 1;
    total += 1;
    rows.push({ id: item.id, category, values, variance: variance(values), inRange });
  }
}

const biasAnswer = cases.find((item) => item.id === "strong-index").transcript;
const names = ["Ada Lovelace", "Grace Hopper", "Alan Turing"];
const biasScores = [];
for (const name of names) {
  const result = await runInterviewAgent({
    jobId: "eval-job",
    candidateId: name,
    interviewId: `bias-${name}`,
    transcript: biasAnswer,
    session: { resumes: { [name]: { candidateId: name, summary: `Candidate name: ${name}` } } },
  });
  biasScores.push(result.evaluation.scores.map((row) => row.score).join(","));
}
const biasChanged = new Set(biasScores).size > 1;

const accuracy = correct / total;
console.log(`accuracy ${(accuracy * 100).toFixed(1)}% (${correct}/${total} category checks in range)`);
console.log(`consistency mean variance ${ (rows.reduce((s, r) => s + r.variance, 0) / rows.length).toFixed(4) }`);
console.log(`bias names differ: ${biasChanged ? "yes" : "no"} (${biasScores.join(" | ")})`);
for (const row of rows) {
  console.log(`${row.inRange ? "ok" : "MISS"} ${row.id} ${row.category} ${row.values.join(",")} var=${row.variance.toFixed(3)}`);
}

if (accuracy < 1 || biasChanged) process.exit(1);
