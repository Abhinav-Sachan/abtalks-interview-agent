from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from interview import session_manager
from interview import ai_agent  # 🔌 This imports the new brain!

router = APIRouter()

class CandidateInit(BaseModel):
    name: str
    target_role: str
    experience_level: str

class ChatMessage(BaseModel):
    session_id: str
    message: str

@router.post("/start")
def start_interview(candidate: CandidateInit):
    try:
        session_id = session_manager.create_session(candidate.model_dump())
        return {"session_id": session_id, "status": "Ready"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat")
def chat_with_agent(payload: ChatMessage):
    try:
        session = session_manager.get_session(payload.session_id)
        
        # 1. Log candidate's input
        session_manager.update_session(payload.session_id, {"role": "user", "content": payload.message})

        # 2. Call the REAL Breeth logic
        candidate_data = session["candidate"]
        chat_history = session["history"]
        ai_reply = ai_agent.generate_response(candidate_data, chat_history)
        
        # 3. Log AI's response
        session_manager.update_session(payload.session_id, {"role": "assistant", "content": ai_reply})

        return {
            "session_id": payload.session_id,
            "reply": ai_reply,
            "is_complete": session["is_complete"],
            "questions_asked": session["questions_asked"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from interview import evaluator

@router.get("/evaluate/latest")
def get_latest_evaluation():
    try:
        # Hackathon shortcut: grab the most recently created session
        sessions = session_manager._SESSIONS
        if not sessions:
            raise HTTPException(status_code=404, detail="No sessions found")
            
        latest_session_id = list(sessions.keys())[-1]
        session = sessions[latest_session_id]
        
        report = evaluator.generate_report(session["history"])
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))