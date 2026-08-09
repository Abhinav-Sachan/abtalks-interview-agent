import { useState } from 'react';
import { Bot, ChevronRight } from 'lucide-react';

export default function StartScreen({ onStart }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Full-Stack Engineer');
  const [level, setLevel] = useState('Junior');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onStart({ name, role, level });
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
        <div className="p-8 text-center bg-slate-800/50 border-b border-slate-700">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-xl mb-4 text-blue-400">
            <Bot size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">The Interview Agent</h1>
          <p className="text-slate-400 text-sm">Adaptive AI Technical Screening</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Candidate Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              placeholder="e.g. Abhinav Sachan"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option>Full-Stack Engineer</option>
                <option>Frontend Developer</option>
                <option>Backend Developer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Level</label>
              <select 
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option>Junior</option>
                <option>Mid-Level</option>
                <option>Senior</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-all"
          >
            Start Interview <ChevronRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}