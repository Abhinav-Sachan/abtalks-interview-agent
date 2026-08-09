from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from interview import session_manager, ai_agent, evaluator

# Initialize the router here!
router = APIRouter()

class InterviewRequest(BaseModel):
    sessionId: str
    candidate: Optional[Dict[str, Any]] = None
    message: Optional[str] = None

@router.post("/interview")
def handle_official_interview(payload: InterviewRequest):
    try:
        session_id = payload.sessionId

        # 1. Start Interview Turn (Bot sends candidate data)
        if payload.candidate is not None:
            # We save the raw candidate JSON so the AI can read their missions
            session_manager.create_session_with_id(session_id, {"raw_candidate": payload.candidate})
            return {
                "reply": "Welcome to your AI Cohort technical interview. Let's discuss the systems you've built.",
                "done": False
            }

        # 2. Conversation Turn (Bot sends user message)
        session = session_manager.get_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")

        user_message = payload.message or ""
        session_manager.update_session(session_id, {"role": "user", "content": user_message})

        # End interview after 8 questions (per the minimum requirements)
        if session.get("questions_asked", 0) >= 8:
            report = evaluator.generate_report(session["history"])
            return {
                "reply": "Thank you for completing the interview.",
                "done": True,
                "feedback": {
                    "summary": report.get("decision", "Completed"),
                    "strengths": report.get("strengths", []),
                    "gaps": report.get("improvements", []),
                    "next": ["Review skipped modules", "Continue building"]
                }
            }

        # Generate AI response
        ai_reply = ai_agent.generate_response(session["candidate"], session["history"])
        session_manager.update_session(session_id, {"role": "assistant", "content": ai_reply})

        return {
            "reply": ai_reply,
            "done": False
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))