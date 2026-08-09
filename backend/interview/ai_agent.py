import os
import requests
import json
from groq import Groq
from dotenv import load_dotenv

# Load our vault
load_dotenv()
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
BREETH_API_KEY = os.environ.get("BREETH_API_KEY")

if not GROQ_API_KEY:
    print("⚠️ CRITICAL: GROQ_API_KEY missing from .env file!")

client = Groq(api_key=GROQ_API_KEY)

def generate_response(candidate_data: dict, history: list) -> str:
    # Extract the raw candidate data provided by the hackathon evaluator
    raw_candidate = candidate_data.get("raw_candidate", {})
    
    system_prompt = f"""You are an expert technical interviewer for an enterprise AI Engineering Cohort.
The candidate has completed a 31-day curriculum covering RAG, Vector Databases, Prompt Engineering, Agentic AI, MCP, and Deployment.

Here is the candidate's exact profile and mission history:
{json.dumps(raw_candidate, indent=2)}

CRITICAL RULES:
1. Ask exactly ONE technical question at a time based on the specific missions they passed, failed, or skipped.
2. Adapt naturally to their answers and ask intelligent follow-up questions.
3. Keep your tone professional and conversational."""

    # --- 1. GENERATE THE RESPONSE WITH GROQ ---
    # Groq expects a clean list of dictionaries for messages
    messages = [{"role": "system", "content": system_prompt}]
    
    # Map our history into Groq's format
    for msg in history:
        # Our session manager uses "assistant", Groq supports "assistant" and "user"
        messages.append({"role": msg["role"], "content": msg["content"]})
        
    try:
        chat_completion = client.chat.completions.create(
            messages=messages,
            model="llama-3.1-8b-instant", # The upgraded lightning fast model
            temperature=0.7,
        )
        ai_reply = chat_completion.choices[0].message.content
    except Exception as e:
        print(f"🔥 Groq API Error: {e}")
        ai_reply = "I experienced a brief connection drop. Could you elaborate slightly on your last point?"

    # --- 2. LOG THE MEMORY TO BREETH (Sponsor Requirement) ---
    if BREETH_API_KEY:
        try:
            breeth_messages = [{"role": m["role"], "content": m["content"]} for m in history]
            breeth_messages.append({"role": "assistant", "content": ai_reply})
            
            requests.post(
                "https://api.thebreeth.com/v1/episodes",
                headers={
                    "Authorization": f"Bearer {BREETH_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={"messages": breeth_messages},
                timeout=2 
            )
            print("✅ Successfully logged episode to Breeth memory.")
        except Exception as e:
            print(f"⚠️ Breeth Logging Warning: {e}")

    return ai_reply