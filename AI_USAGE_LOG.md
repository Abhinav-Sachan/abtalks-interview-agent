# AI Usage Log — The Interview Agent

This project was built and debugged with extensive help from **Claude (Anthropic)**. Below is an honest account of what AI assistance was used for, in the order it happened.

---

## Summary

The Interview Agent's core modules (session management, AI question generation via Groq, and evaluation/scoring) existed but were never actually wired together, and the frontend had several integration bugs. Claude was used to diagnose and fix these issues end-to-end: backend routing, local dev environment setup, frontend/backend integration, and production deployment on Render.

## What AI Was Used For

### 1. Backend integration
The live API route handler (`backend/api/interview.py`) was a disconnected stub — it never called the actual session manager, AI agent, or evaluator modules; it just echoed the user's message back. Claude rewrote the route handler to properly create/retrieve sessions, call the Groq-powered `generate_response()` function for each turn, and call `generate_report()` to produce real scored feedback when an interview ends.

### 2. Local dev environment troubleshooting
- Diagnosed a Python import path mismatch after the route handler was rewritten (initial fix assumed a `services/` folder; actual structure used `interview/`).
- Diagnosed VS Code/Pylance showing false "import could not be resolved" errors — caused by VS Code pointing at a stray empty `.venv` at the project root instead of the real `backend/venv`. Fixed by manually selecting the correct interpreter.

### 3. Frontend/backend integration bug (root cause of a persistent 404)
Diagnosed that `frontend/src/services/api.js` was generating its own fake session ID (`"session-" + Date.now()`) on the client instead of using the real UUID the backend actually created via `create_session()`. This meant every second message in a conversation failed with a 404, since the backend had no record of the fake ID. Claude rewrote `api.js` to use the backend-issued `session_id` from the response instead.

### 4. Removing fake/hardcoded evaluation data
`api.js` had a `getEvaluation()` function returning static hardcoded scores (always 88%, "Recommended for Hire") regardless of actual interview performance, and `FeedbackReport.jsx` called it independently instead of using the real report already returned by the backend. Claude removed the fake function and rewired `InterviewRoom.jsx` → `App.jsx` → `FeedbackReport.jsx` to pass the real, Groq-generated feedback object through React state instead.

### 5. Production deployment (Render)
Diagnosed a failed Render deploy caused by an incorrect default Start Command (`gunicorn your_application.wsgi`, a template placeholder that didn't match this project). Corrected it to run the FastAPI app properly with Uvicorn (`uvicorn main:app --host 0.0.0.0 --port $PORT`), and verified Root Directory and environment variable (`GROQ_API_KEY`) configuration on Render until the backend deployed successfully and responded correctly at its public URL.

## Files Directly Modified with AI Assistance

- `backend/api/interview.py` — full rewrite to wire up session/AI/evaluation logic
- `frontend/src/services/api.js` — fixed session ID handling, removed fake evaluation data
- `frontend/src/pages/InterviewRoom.jsx` — passes real feedback object on interview completion
- `frontend/src/pages/FeedbackReport.jsx` — uses real feedback prop instead of fake fetch
- `frontend/src/App.jsx` — added feedback state and proper prop threading between views
- Render deployment configuration (Start Command, Environment variables)

## What Was NOT AI-Generated

The original application concept, UI design, component structure, Groq prompt engineering in `ai_agent.py` and `evaluator.py`, and the overall project scaffolding (`session_manager.py`, curriculum/candidate analysis modules) were authored independently prior to this debugging session.