import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Code2 } from 'lucide-react';
import { interviewApi } from '../services/api';

export default function InterviewRoom({ sessionData, onEnd }) {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => scrollToBottom(), [messages, isLoading]);

  useEffect(() => {
    const initializeInterview = async () => {
      try {
        const data = await interviewApi.startSession(sessionData);
        setSessionId(data.session_id);

        setMessages([{
          role: 'assistant',
          content: `Hello ${sessionData.name}. I am your AI interviewer for the ${sessionData.level} ${sessionData.role} position. Are you ready to begin?`
        }]);
      } catch (err) {
        setError("Failed to connect to the interview server. Make sure the Python backend is running.");
      } finally {
        setIsLoading(false);
      }
    };
    initializeInterview();
  }, [sessionData]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !sessionId) return;

    const userMessage = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await interviewApi.sendMessage(sessionId, userMessage);

      setMessages(prev => [...prev, { role: 'assistant', content: response.reply }]);

      if (response.is_complete) {
        // Pass the REAL feedback object up to App, not a re-fetch
        setTimeout(() => onEnd(response.feedback), 3000);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'system', content: 'Connection error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex-grow flex items-center justify-center bg-slate-900 text-red-400 p-6 text-center">
        <div>
          <p className="text-xl font-bold mb-4">Connection Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col bg-slate-900 max-w-4xl w-full mx-auto shadow-2xl border-x border-slate-800">
      <div className="bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400"><Code2 size={20}/></div>
          <div>
            <h2 className="text-white font-bold">{sessionData.role} Interview</h2>
            <p className="text-slate-400 text-xs">Candidate: {sessionData.name}</p>
          </div>
        </div>
        <button onClick={() => onEnd(null)} className="text-sm text-red-400 hover:text-red-300 transition-colors">
          End Early
        </button>
      </div>

      <div className="flex-grow p-4 overflow-y-auto space-y-4 scroll-smooth">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-sm'
                : msg.role === 'system'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/50 mx-auto'
                  : 'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && messages.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-slate-800 text-slate-400 rounded-2xl rounded-bl-sm p-4 border border-slate-700 flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" /> Analyzing response...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-800 border-t border-slate-700">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading || !sessionId}
            placeholder="Type your response..."
            className="flex-grow bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
