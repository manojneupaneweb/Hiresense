# Hiresense audit

Short review of the repo as it existed before the phased work. Claims below are about that snapshot.

## What exists

- **Frontend** (`Frontend/`): Vite + React 19 + React Router. Pages for home, jobs, pricing, contact, candidate apply/interview, and an organization dashboard. Axios calls `http://localhost:8000`. Socket.io client drives the live interview.
- **Backend** (`Backend/`): Express 5, Mongoose, JWT auth, job CRUD, Khalti payment routes, CV PDF parsing, and a Gemini interviewer via `@inngest/agent-kit`. Chat state lives in an in-memory `Map`.
- **Models**: User, JobPost, Candidate, InterviewScore.
- **Interview UI**: media hooks, chat, score card, and a client-side speech helper. The browser posts a score payload to `/api/interviewScore/store-score`.

## What is broken

- README setup uses `backend/` and `frontend/`. The real folders are `Backend` and `Frontend` (case-sensitive on Linux and in Docker).
- Backend `package.json` has no `dev` or `start` script. `npm test` is a stub that exits 1. README says `npm run dev`.
- No `.env.example`, no `LICENSE` file, no Vite config, no proxy. Frontend hardcodes the API host.
- `saveInterviewScorecard` logs the body and returns success. It does not persist a score. The interview client calls a route that is not mounted in `app.js`.
- End-of-interview “score” in the controller is `Math.random()` and is never returned.
- `cloudiny.util.js` embeds Cloudinary credentials in source. Those must come from env and the leaked values should be rotated.
- Mail helper reads `process.env.mail` in one place and `MAIL_USER` in another.
- Mongoose connect options `useNewUrlParser` / `useUnifiedTopology` are obsolete and can warn or fail on current drivers.
- Upload middleware accepts any file, any size, and writes the original filename into `public/temp`. Several real CVs are already in that folder.
- README says transcription, configurable rubrics, purge-after-scoring, refresh tokens in the product sense, Hugging Face, and Whisper. None of those are implemented. Auth issues an access token; a refresh-token field exists on the user model but there is no refresh route.
- `sequelize` and `request` are dependencies and unused. `rechart` (typo package) sits next to `recharts`.
- No tests, lint script on the backend, CI, Docker, OpenAPI, queue, or structured scoring schema.
- CORS is fixed to `http://localhost:5173`. No Helmet, no rate limit, no centralized error handler. Logging is `console.log`.

## What is missing

- An agent loop (plan, ask, follow-up, tools, evaluate, finish) with step limits, timeouts, retries, and a model fallback.
- Zod-validated scores with category, reasoning, and transcript quotes.
- Prompt-injection handling and an audit log of agent steps.
- A human decision separate from the model recommendation.
- Evals, a bias check, and docs that match the code.
- BullMQ (or any queue), job status in the UI, Swagger, pino, and a routes/controllers/services/middleware/config layout for the new scoring path.
- Jest, Supertest, Vitest, ESLint/Prettier at repo level, GitHub Actions, Docker Compose (API, web, Mongo, Redis).

## Scoring path today

Upload CV → parse PDF text → one Gemini JSON call → `{ score, suggestion }`.  
Live interview → Gemini returns the next question as loosely parsed JSON. No tools, no rubric categories, no follow-up policy, no transcript evidence.
