import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def generate_report(history: list) -> dict:
    if len(history) < 2:
        return {
            "overallScore": 0,
            "decision": "Not Enough Data",
            "categories": [{"name": "Technical", "score": 0}, {"name": "Communication", "score": 0}, {"name": "Problem Solving", "score": 0}],
            "strengths": ["Not enough interaction to determine strengths."],
            "improvements": ["Please complete a full interview."]
        }

    # Convert the chat history into a readable transcript format
    transcript = "\n".join([f"{msg['role'].upper()}: {msg['content']}" for msg in history])

    system_prompt = f"""You are an expert technical recruiter grading a candidate. Analyze this interview transcript.
You MUST return ONLY a raw JSON object matching this exact structure, with no markdown formatting or extra text:
{{
  "overallScore": 85,
  "decision": "Pass / Recommend Next Round",
  "categories": [
    {{"name": "Technical Accuracy", "score": 80}},
    {{"name": "Communication", "score": 90}},
    {{"name": "Problem Solving", "score": 85}}
  ],
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"]
}}

Transcript:
{transcript}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": system_prompt}],
            response_format={"type": "json_object"}, # Forces Groq to return perfect JSON
            temperature=0.2
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"🔥 Evaluator Error: {e}")
        return {"overallScore": 50, "decision": "Error generating report", "categories": [], "strengths": [], "improvements": []}