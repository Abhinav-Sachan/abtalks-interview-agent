from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any

from interview.session_manager import create_session, get_session, update_session
from interview.ai_agent import generate_response
from interview.evaluator import generate_report

router = APIRouter()

class InterviewRequest(BaseModel):
    sessionId: Optional[str] = None
    candidate: Optional[Dict[str, Any]] = None
    message: Optional[str] = None


@router.post("/interview")
def handle_interview(payload: InterviewRequest):
    try:
        # --- Case 1: Starting a NEW session ---
        if payload.candidate is not None:
            session_id = create_session(payload.candidate)
            greeting = f"Hello {payload.candidate.get('name', 'there')}. I am your AI interviewer for the {payload.candidate.get('level','')} {payload.candidate.get('role','')} position. Are you ready to begin?"

            update_session(session_id, {"role": "assistant", "content": greeting})

            return {
                "session_id": session_id,
                "reply": greeting,
                "is_complete": False
            }

        # --- Case 2: Continuing an EXISTING session ---
        if not payload.sessionId:
            raise HTTPException(status_code=400, detail="Missing sessionId for message.")

        session = get_session(payload.sessionId)  # raises ValueError if not found
        user_message = payload.message or ""

        # Log user's message
        update_session(payload.sessionId, {"role": "user", "content": user_message})

        # Check for manual end
        if user_message.strip().lower() == "end interview":
            session["is_complete"] = True
        else:
            ai_reply = generate_response(
                {"raw_candidate": session["candidate"]},
                session["history"]
            )
            update_session(payload.sessionId, {"role": "assistant", "content": ai_reply})

        session = get_session(payload.sessionId)  # refresh after update

        if session["is_complete"]:
            report = generate_report(session["history"])
            return {
                "reply": "Thank you, that concludes the interview. Generating your feedback report now.",
                "is_complete": True,
                "feedback": report
            }

        return {
            "reply": session["history"][-1]["content"],
            "is_complete": False
        }

    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))