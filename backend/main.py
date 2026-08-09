from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from api.interview import router as interview_router

app = FastAPI(title="The Interview Agent Backend")

# Open CORS so Vite can talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount our interview routes
app.include_router(interview_router, prefix="/api/interview")

@app.get("/")
def health_check():
    return {"status": "operational"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)