import uuid

_SESSIONS = {}

def create_session(candidate_data):
    session_id = str(uuid.uuid4())
    _SESSIONS[session_id] = {
        "candidate": candidate_data,
        "history": [],
        "questions_asked": 0,
        "is_complete": False
    }
    return session_id

def get_session(session_id):
    if session_id not in _SESSIONS:
        raise ValueError("Session not found.")
    return _SESSIONS[session_id]

def update_session(session_id, message_data):
    session = get_session(session_id)
    session["history"].append(message_data)
    
    if message_data.get("role") == "assistant":
        session["questions_asked"] += 1
        
    if session["questions_asked"] >= 8:
        session["is_complete"] = True