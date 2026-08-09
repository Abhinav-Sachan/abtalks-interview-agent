const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://abtalks-interview-agent-1.onrender.com/api';

export const interviewApi = {
  async startSession(sessionData) {
    const response = await fetch(`${API_BASE_URL}/interview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidate: sessionData || { name: "Abhinav", role: "Engineer" }
      }),
    });
    if (!response.ok) throw new Error('Failed to start session');
    const data = await response.json();
    return {
      session_id: data.session_id,
      reply: data.reply,
      is_complete: data.is_complete || false
    };
  },

  async sendMessage(sessionId, messageText) {
    const response = await fetch(`${API_BASE_URL}/interview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: sessionId,
        message: messageText
      }),
    });
    if (!response.ok) throw new Error('Failed to send message');
    const data = await response.json();
    return {
      reply: data.reply,
      is_complete: data.is_complete || false,
      feedback: data.feedback
    };
  }
};