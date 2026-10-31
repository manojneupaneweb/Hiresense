# Responsible use

Hiresense recommends a score. It does not decide who gets a job.

## Human oversight

`recommendation` is advice for a reviewer. The hiring action is `humanDecision` (`advance`, `hold`, or `reject`), written by an authenticated user after the score exists. The product copy says "consistent and explainable scoring", not an objective judgment.

## Fairness limits

The fallback scorer uses answer length, a few hedging phrases, and a short list of technical words. People who write less, or who explain skill without those words, score lower even when they could do the work. Names are not an input to the numeric score. `npm run eval` checks three names on one answer. That is a smoke test, not a bias audit. It does not cover gender, age, accent, disability, or language.

Do not use the score as the only reason to reject someone.

## Data retention

Transcripts and the agent step log stay on the evaluation job in process memory (and in Mongo only if a later feature persists them). The job store is in-memory today, so a process restart drops it.

`PURGE_RECORDINGS=true` deletes a local file under `Backend/public/temp` after scoring. It does not delete Cloudinary objects. Do not commit resumes. The PDFs already in `public/temp` should be removed from history if they are real CVs.

## Regulation

Tools that score people for jobs can be regulated. Examples include the EU AI Act (employment is a high-risk use) and New York City Local Law 144 (automated employment decision tools, bias audits, and notice). This repository does not implement those obligations. Get legal advice before using it on real candidates.
