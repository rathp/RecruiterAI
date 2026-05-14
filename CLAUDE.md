# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Backend
```bash
# From project root — activate venv first
source venv/bin/activate

# Install dependencies (requirements.txt is at root, not inside backend/)
pip install -r requirements.txt

# Run the backend (must be run from backend/ so relative paths resolve)
cd backend
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev        # dev server at http://localhost:5173
npm run build      # production build
```

## Architecture

### Two matcher implementations

`backend/resume_matcher.py` is the **active** implementation imported by `main.py`. It uses a LangChain RAG pipeline: resumes are chunked with `RecursiveCharacterTextSplitter`, embedded via `OpenAIEmbeddings`, stored in a FAISS in-memory vector store, and retrieved with `RetrievalQA`. The top 3 candidates come from source document metadata after a similarity search against the job description.

`backend/resume_matcher_basic.py` is an **alternative/reference** implementation that uses OpenAI `text-embedding-3-large` + cosine similarity directly (no LangChain). It has large commented-out blocks. It is not imported anywhere and does not run.

To swap implementations, change `main.py` to `from resume_matcher_basic import app`.

### `generate_questions` reads from disk, not uploaded files

The `/generate_questions` endpoint in both matchers reads resumes from `backend/data/resumes/<filename>` on disk. The frontend passes the `filename` (e.g. `Alice_Smith.pdf`) as the `resume_text` field — **not** the actual text. This means question generation only works for resumes that physically exist in `data/resumes/`. Uploaded resumes that are not pre-stored there will cause a file-not-found error.

### Frontend is a single monolithic component

All UI logic lives in `frontend/src/App.tsx`. The `frontend/src/components/` directory exists but every file is a one-line placeholder comment. The `backendURL` is hardcoded as `http://localhost:8000` in `App.tsx`.

### Stub integrations

`backend/scheduler.py` and `backend/emailer.py` define route functions using `@app.post(...)` but never import or instantiate `app`. They are not loaded by uvicorn and the routes are unreachable. To activate them, import `app` from `resume_matcher` and register the routes there, or restructure into a single FastAPI app.

### Environment

`backend/.env` must contain `OPENAI_API_KEY`. The `venv/` lives at the project root. The backend must be started from inside `backend/` because `resume_matcher.py` uses relative paths like `data/resumes/<filename>` and `temp_<filename>` for disk I/O.
