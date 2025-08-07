# 🤖 RecruiterAI

**RecruiterAI** is Aberdeen’s internal GenAI-powered recruitment assistant that automates resume screening, interview question generation, calendar scheduling, and candidate communication — all through an intuitive web interface. By combining the power of large language models (LLMs), **LangChain**, and **retrieval-augmented generation (RAG)**, this tool accelerates recruiter workflows with smart, contextual, and explainable recommendations.

<!-- RecruiterAI Screenshots -->
<div align="center">
  <table>
    <tr>
      <td>
        <img src="/RecruiterAIBestMatches.png" alt="Best Matches" width="350"/>
      </td>
      <td>
        <img src="/RecruiterAIGenerateQuestions.png" alt="Generate Questions" width="350"/>
      </td>
    </tr>
    <tr>
      <td colspan="2" align="center">
        <img src="/RecruiterAIHomePage.png" alt="Home Page" width="500"/>
      </td>
    </tr>
  </table>
</div>


---

## ✨ Features

- 🔍 AI-powered matching of resumes to job descriptions using vector search and semantic retrieval  
- 🧠 LLM-generated interview questions tailored to each candidate and job role  
- 💡 Concise, human-readable fit summaries powered by prompt engineering  
- 📅 Google Calendar-based interview scheduling between candidate and recruiter  
- ✉️ Automated welcome email for selected candidates *(coming soon)*

---

## 🛠️ Tech Stack

### 🧩 Frontend – `React + Vite`
- React 18 with Hooks  
- Axios for async API requests  
- Local state-driven UI interactions  

### ⚙️ Backend – `FastAPI + LangChain`
- `FastAPI` – Python async web API framework  
- `PyMuPDF` – PDF parsing from resumes  
- `LangChain` – Semantic search and RAG pipeline for resume matching  
- `FAISS` – In-memory vector database for document retrieval  
- `OpenAI` – GPT-4o for question generation and fit summaries  
- `RecursiveCharacterTextSplitter` – For chunking long documents into semantically meaningful vectors  

---

## 🧠 GenAI & RAG Integration

RecruiterAI leverages **LangChain’s RetrievalQA chain** with **FAISS vector search** to semantically compare candidate resumes against the job description in a **retrieval-augmented generation (RAG)** framework. Top-matching candidates are surfaced using vector similarity, and then **prompt-engineered GPT-4 completions** generate:

- ✅ Concise **1–2 sentence summaries** of why each applicant is a good fit  
- ❓ **5–6 contextual interview questions** aligned with the job role and resume  

To enable these features, store your OpenAI API key in the backend `.env` file:

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

### 2. Configure backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Enter your OpenAPI key in .env file
If you don’t have one yet, follow the instructions in the [🔑 How to Get an OpenAI API Key](#-how-to-get-an-openai-api-key) section.

```bash
echo "OPENAI_API_KEY=sk-xxxxxxxx" > .env
```

### Start backend
```bash
uvicorn main:app --reload
```

### Start Frontend to launch locally
```bash
cd frontend
npm install
npm run dev
```

## 🔑 How to Get an OpenAI API Key

To use the GenAI features (resume summaries, question generation), you'll need an OpenAI API key.


### Steps to Generate an API Key:

1. Go to the OpenAI platform: [https://platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys)

2. Log in or create a free account.

3. Click **"Create new secret key"**.

4. Copy the generated key (starts with `sk-...`).  
   ⚠️ **You won't be able to see it again**, so store it securely.

5. Create a `.env` file in your `/backend` directory and add:

   ```env
   OPENAI_API_KEY=sk-your-key-here


### Folder structure
```bash
recruiterai/
├── backend/                 # FastAPI + LangChain + OpenAI logic
│   ├── resume_matcher.py    # Core matching logic and RAG pipeline
│   └── .env                 # API keys and secrets
├── frontend/                # React + Vite frontend
│   └── App.tsx              # Interactive UI logic
```




