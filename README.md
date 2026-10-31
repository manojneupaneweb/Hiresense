# Hiresense

**Smart AI Interview Evaluation System**

[![GitHub repo](https://img.shields.io/badge/GitHub-Hiresense-blue?logo=github)](https://github.com/manojneupaneweb/Hiresense)

---

## 🧠 Overview

**Hiresense** is an AI-powered interview screening system that helps companies evaluate candidates faster and more fairly.  
It analyzes video, audio, or text responses using **NLP and ML**, then generates detailed **scores** based on communication, confidence, and technical knowledge.

This system automates the **first-round interview process** while keeping transparency and human review at the core.

---

## 🚀 Features

- 🎥 Candidate interview submissions (video/audio/text)
- 🧾 Automatic transcription (Speech-to-Text)
- 🤖 AI-driven response analysis and scoring
- 📊 Admin dashboard with candidate insights
- 🔒 Secure authentication (JWT-based)
- 🗂️ Cloud upload (via Multer or similar)
- 📈 Configurable evaluation rubrics
- 🧩 Modular backend architecture

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React 19 + Vite. Tailwind is loaded from the CDN in `Frontend/index.html` |
| **Backend** | Node.js + Express 5 |
| **Database** | MongoDB (Mongoose) |
| **Auth** | JWT access tokens (`ACCESS_TOKEN_SECRET`). A refresh-token method exists on the user model; there is no refresh route |
| **AI** | Google Gemini (`gemini-2.5-flash`) through `@inngest/agent-kit` |
| **Speech** | Browser speech recognition in the interview UI. The server does not call a transcription API |
| **Storage** | Local disk via Multer (`Backend/public/temp`). Cloudinary is optional and only used if those env vars are set |

---

## 🏗️ Architecture

1. **Frontend:** User-friendly React interface for candidates and admins  
2. **Backend API:** Express server for auth, uploads, and scoring  
3. **AI Engine:** ML models handle transcription + NLP scoring  
4. **Database:** Stores users, interviews, and score data  

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/manojneupaneweb/Hiresense.git
cd Hiresense
````

### 2️⃣ Install dependencies

For backend:

```bash
cd Backend
npm install
```

For frontend:

```bash
cd ../Frontend
npm install
```

### 3️⃣ Setup environment variables

Copy the example env file in each app. MongoDB must already be running at `MONGO_URI`.

```bash
cp Backend/.env.example Backend/.env
cp Frontend/.env.example Frontend/.env
```

Fill `MONGO_URI`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, and `GEMINI_API_KEY`. Leave secrets out of git. `JWT_SECRET` is listed for compatibility; the running auth code reads `ACCESS_TOKEN_SECRET`.

### 4️⃣ Run locally

Start the API from `Backend` (port 8000):

```bash
npm run dev
```

Start the web app from `Frontend` (port 5173):

```bash
npm run dev
```

## 🧮 How Scoring Works

1. Candidate submits answers →
2. System transcribes audio/video →
3. NLP model analyzes tone, content, and structure →
4. Generates per-category score (0–10) →
5. Admin dashboard displays summary & insights.

---

## 🔐 Security & Privacy

* All media and personal data stored securely
* JWT-based access control
* Option to purge recordings after scoring
* Role-based admin access

---

## 🧠 Future Improvements

* 🔊 Real-time interview feedback
* 📉 Bias detection & fairness metrics
* 🧾 Detailed PDF reports
* ☁️ Integration with HR tools (e.g., Workable, LinkedIn)


## 🧑‍💻 Author

**Manoj Neupane**
🌐 [manoj-neupane.com.np](https://manoj-neupane.com.np)
💻 [GitHub](https://github.com/manojneupaneweb)

---

## 📜 License

This project is licensed under the **MIT License**.
See the [LICENSE](LICENSE) file for details.


