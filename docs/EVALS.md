# Evals

`npm run eval` (from `Backend`, or `npm run eval` at the repo root) runs `evals/run.js`.

There are 10 finished transcripts: three strong, four medium, three weak. Each one is scored three times. Accuracy is the share of category scores that land in the expected range in `evals/cases.json`. Consistency is the variance of those three runs. The fallback scorer is deterministic, so variance is 0 unless a live model is wired in and its temperature is above 0.

## Bias check

The same strong answer is scored with three candidate names stored only in the resume summary. The numeric scores are compared. The fallback does not read the name. A difference is a failure.

These checks do not prove the system is fair. They only show that this scorer does not change its number when the name string changes. See `docs/RESPONSIBLE_AI.md`.
