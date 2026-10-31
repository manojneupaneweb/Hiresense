# Hiresense

AI interview screening with a score a person can check, and a decision only a person can make.

[![CI](https://github.com/manojneupaneweb/Hiresense/actions/workflows/ci.yml/badge.svg)](https://github.com/manojneupaneweb/Hiresense/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Hiresense runs a first-round interview, scores communication, confidence, and technical knowledge from 0 to 10, and stores the reasoning plus quotes from the candidate's words. A reviewer records advance, hold, or reject.

## Demo

<!-- Replace these with a GIF or screenshots of the interview and the score card. -->

![Interview](Frontend/public/Hiresense.png)

Video: add a link to a short recording of an interview and the scoring job status.

## Features

- Candidate and recruiter sign-in with a JWT access token
- Job posts and an organization dashboard
- CV upload (PDF only, 10 MB) and a Gemini match score when `GEMINI_API_KEY` is set
- Live interview over Socket.io. Questions come from Gemini. Speech recognition runs in the browser
- Scoring agent: plan, follow up on shallow answers, call tools, score, stop. See `Backend/agent`
- Structured scores (Zod): category, 0–10, reasoning, evidence quote
- BullMQ when `REDIS_URL` is set. Otherwise the API scores in-process and still returns a job id
- Job status on the interview result card
- Reviewer decision endpoint. The model does not hire anyone
- OpenAPI at `/api-docs`
- Eval set and a name-swap check (`npm run eval`)

## Tech stack

| Layer | What the code uses |
| --- | --- |
| Frontend | React 19, Vite, React Router. Tailwind is loaded from a CDN in `Frontend/index.html` |
| Backend | Node.js, Express 5 |
| Database | MongoDB via Mongoose |
| Queue | BullMQ and Redis. Inline runner when Redis is off |
| Auth | JWT access tokens (`ACCESS_TOKEN_SECRET`) |
| Live interview | `@inngest/agent-kit` and Gemini (`GEMINI_API_KEY`) |
| Scoring agent | OpenAI Chat Completions function calling, with a deterministic fallback |
| Speech | Browser speech recognition. The server does not call Whisper |
| Docs | Swagger UI at `/api-docs` |

## Quick start

### Docker

```bash
docker compose up --build
```

API: http://localhost:8000  
Web: http://localhost:5173  
API docs: http://localhost:8000/api-docs

Compose sets development JWT secrets. Put real secrets in the environment before any shared deployment. `OPENAI_API_KEY` and `GEMINI_API_KEY` are optional. Without them, scoring uses the fallback and live questions fail closed (the interview returns no question).

### Manual

MongoDB must be running.

```bash
cp Backend/.env.example Backend/.env
cp Frontend/.env.example Frontend/.env
cd Backend && npm install && npm run dev
```

In another terminal:

```bash
cd Frontend && npm install && npm run dev
```

From the repo root, `npm test` and `npm run eval` run both apps' checks (eval is backend-only).

## Environment

See `Backend/.env.example` and `Frontend/.env.example`. No real secrets belong in those files.

| Variable | Role |
| --- | --- |
| `MONGO_URI` | Mongo connection string |
| `ACCESS_TOKEN_SECRET` / `REFRESH_TOKEN_SECRET` | JWT signing. Auth checks the access secret. There is no refresh route |
| `JWT_SECRET` | Listed for older notes. The running auth code does not read it |
| `GEMINI_API_KEY` | Live interview questions and CV analysis |
| `OPENAI_API_KEY` / `OPENAI_MODEL` | Scoring agent. Empty key selects the fallback |
| `REDIS_URL` / `QUEUE_INLINE` | BullMQ. `QUEUE_INLINE=true` scores inside the API process |
| `PURGE_RECORDINGS` | `true` deletes a file under `Backend/public/temp` after a successful score |
| `CLIENT_ORIGIN` | CORS origin |
| `CLOUDINARY_*` | Optional media upload |
| `KHALTI_SECRET_KEY` | Optional payments |
| `MAIL_USER` / `MAIL_PASSWORD` | Optional. The mail helper is not mounted |
| `VITE_API_URL` | Browser API origin |

## Scoring

1. The agent loads the job, rubric, and resume summary with tools.
2. For each answer it logs whether it would ask a follow-up. Short answers and answers with no concrete example count as shallow.
3. Each category gets 0–10, a reason, and a quote taken from the candidate text.
4. Text that tells the model to ignore the rubric or assign 10/10 is stripped before the fallback scores. The same answer with and without that sentence keeps the same numbers (see `Backend/test/agent.test.js`).
5. The result is a recommendation: `advance_to_human_review`, `needs_human_review`, or `do_not_advance`. `humanDecision` stays empty until `POST /api/evaluations/:id/decision`.

With no OpenAI key, scores come from length, hedging, and a fixed list of technical terms. That is consistent and explainable. It is not a measure of job performance. Details: `docs/ARCHITECTURE.md` and `docs/EVALS.md`.

## Security and privacy

- Helmet, CORS, a request rate limit, Zod bodies, and upload type/size checks
- Candidate text is wrapped as data in the prompt
- Agent steps (questions, tool calls, results) are stored on the job so a score can be audited
- `PURGE_RECORDINGS=true` deletes only files inside `public/temp`
- Cloudinary and Khalti credentials are environment variables

## Limitations

- The fallback scorer is a heuristic. A live model can disagree with `evals/cases.json`
- The name-swap check only proves this fallback ignores the name string
- Browser speech recognition is not server-side transcription
- Refresh tokens are generated on the user model and are not exposed as an API
- Lint covers the agent, scoring services, and the score card, not every legacy page
- Legacy CV files in `Backend/public/temp` were already in the repo. Do not add more resumes

## Roadmap

- Real-time feedback during the interview
- A wider fairness eval than a three-name swap
- PDF export of the score and the step log
- HR-system export

## Author

Manoj Neupane  
https://manoj-neupane.com.np  
https://github.com/manojneupaneweb

## License

MIT. See [LICENSE](LICENSE).
