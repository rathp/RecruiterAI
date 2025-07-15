# 🤖 RecruiterAI

**RecruiterAI** is Aberdeen’s internal GenAI-powered recruitment assistant that automates resume screening, interview question generation, calendar scheduling, and candidate communication — all through an intuitive web interface. This tool is designed to accelerate recruiter workflows by combining the power of large language models (LLMs) with modern web development tools.

---

## ✨ Features

- 🔍 AI-powered matching of resumes to job descriptions  
- 🧠 Automatic generation of 5–6 interview questions tailored to each candidate  
- 📅 Google Calendar-based interview scheduling between candidate and recruiter  
- ✉️ Automated welcome email for selected candidates (Development in-progress)

---

## 🛠️ Tech Stack

### 🧩 Frontend – `React + Vite`
- React 18 with Hooks
- Axios (API requests)

### ⚙️ Backend – `FastAPI`
- `fastapi` – Lightweight Python web server
- `PyMuPDF` – PDF parsing for resumes
- `sentence-transformers` – Semantic matching using embeddings
- `scikit-learn` – For cosine similarity
- `openai` – GPT-4 based interview question generation

---

## ⚡ GenAI Integration

The GenAI component uses **OpenAI's GPT-4** via the `openai` Python SDK to:

- Generate personalized interview questions for each matched resume
- Provide a short 1–2 sentence **fit summary** explaining why a resume is a strong match for the given job

To activate this feature, ensure your OpenAI API key is available in the backend `.env` file as:

```env
OPENAI_API_KEY=sk-...
```
---

## 🚀 Run Locally

Follow these steps to run RecruiterAI on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/recruiterai.git
cd recruiterai
```

### 2. Start backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```
### 3. Enter your OpenAPI key in .env file
```env
OPENAI_API_KEY=sk-xxxxxxx
```

### Start Frontend to launch locally
```bash
cd frontend
npm install
npm run dev
```



