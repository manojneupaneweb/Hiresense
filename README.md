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
| **Frontend** | React + Tailwind CSS |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB |
| **Auth** | JWT + Refresh Tokens |
| **AI / NLP** | OpenAI / Hugging Face Transformers |
| **Speech-to-Text** | Whisper API or other STT providers |
| **Storage** | Cloudinary / github |

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
cd backend
npm install
```

For frontend:

```bash
cd ../frontend
npm install
```

### 3️⃣ Setup environment variables

Copy `.env.example` to `.env` and add your credentials:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
OPENAI_API_KEY=your_api_key
```

### 4️⃣ Run locally

Start backend:

```bash
npm run dev
```

Start frontend:

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


