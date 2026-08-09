const API_BASE_URL = 'http://localhost:8000/api/interview';

export const interviewApi = {
  async startSession(candidateData) {
    const response = await fetch(`${API_BASE_URL}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: candidateData.name,
        target_role: candidateData.role,
        experience_level: candidateData.level
      }),
    });
    if (!response.ok) throw new Error('Failed to start interview');
    return response.json(); 
  },

  async sendMessage(sessionId, message) {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        message: message
      }),
    });
    if (!response.ok) throw new Error('Failed to send message');
    return response.json(); 
  },

  // 🔌 NEW: Fetch the dynamic report
  async getEvaluation() {
    const response = await fetch(`${API_BASE_URL}/evaluate/latest`);
    if (!response.ok) throw new Error('Failed to fetch evaluation');
    return response.json();
  }
};