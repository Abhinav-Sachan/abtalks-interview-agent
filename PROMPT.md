# P2 — The Interview Agent

## Project Context

We are building **Problem 2: The Interview Agent** for the ABTalks Hackathon.

The goal is to build a reliable, personalized AI technical interviewer that interviews a candidate based on their actual learning history and adapts to their answers.

## Core Principle

> **Interview the candidate, not the curriculum.**

The curriculum provides the available topics.

The candidate's learning history determines which topics and difficulty levels should be assessed.

The candidate's answers determine what happens next.

The system must behave like a realistic technical interviewer, not a scripted questionnaire.

---

## Repository Structure

```text
backend/
├── api/
│   └── interview.py
├── interview/
│   ├── candidate_analyzer.py
│   ├── curriculum_analyzer.py
│   ├── evaluator.py
│   ├── fallback.py
│   ├── feedback.py
│   ├── planner.py
│   ├── question_engine.py
│   └── session_manager.py
├── tests/
│   ├── test_api.py
│   ├── test_interview.py
│   └── test_sessions.py
├── .env.example
├── main.py
└── requirements.txt

frontend/
├── src/
│   ├── components/
│   │   ├── ChatBubbles.jsx
│   │   └── StatusCards.jsx
│   ├── pages/
│   │   ├── FeedbackReport.jsx
│   │   ├── InterviewRoom.jsx
│   │   └── StartScreen.jsx
│   ├── services/
│   │   └── api.js
│   └── App.jsx
└── package.json

AI_USAGE_LOG.md
README.md
.gitignore
PROMPT.md
