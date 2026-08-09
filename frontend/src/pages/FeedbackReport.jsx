import { CheckCircle2, AlertCircle, RefreshCw, Award, Code, Brain } from 'lucide-react';

export default function FeedbackReport({ sessionData, feedback, onRestart }) {
  const report = feedback;

  if (!report) return <div className="text-white text-center mt-20">Error loading report.</div>;

  const categoryIcons = [Code, Brain, Award];

  return (
    <div className="flex-grow flex items-center justify-center bg-slate-900 p-6">
      <div className="max-w-3xl w-full bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">

        {/* Header */}
        <div className="p-8 bg-slate-800/80 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Interview Assessment</h1>
            <p className="text-slate-400 text-sm">
              Candidate: <span className="text-slate-200 font-medium">{sessionData?.name || "Candidate"}</span> ({sessionData?.level} {sessionData?.role})
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-extrabold text-blue-400">{report.overallScore}%</span>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Overall Rating</p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Decision Banner */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3 text-emerald-400">
            <CheckCircle2 size={24} />
            <div>
              <p className="font-semibold text-sm">AI Recommendation</p>
              <p className="text-lg font-bold">{report.decision}</p>
            </div>
          </div>

          {/* Skill Breakdown */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Competency Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {report.categories.map((cat, idx) => {
                const IconComponent = categoryIcons[idx % categoryIcons.length];
                return (
                  <div key={idx} className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 text-center">
                    <IconComponent size={20} className="mx-auto text-blue-400 mb-2" />
                    <p className="text-xs text-slate-400 mb-1">{cat.name}</p>
                    <p className="text-xl font-bold text-white">{cat.score}%</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/40 border border-slate-700/40 rounded-xl p-5">
              <h4 className="text-emerald-400 font-semibold text-sm mb-3 flex items-center gap-2">
                <CheckCircle2 size={16} /> Key Strengths
              </h4>
              <ul className="space-y-2 text-sm text-slate-300">
                {report.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="text-emerald-400">•</span> {s}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900/40 border border-slate-700/40 rounded-xl p-5">
              <h4 className="text-amber-400 font-semibold text-sm mb-3 flex items-center gap-2">
                <AlertCircle size={16} /> Areas for Growth
              </h4>
              <ul className="space-y-2 text-sm text-slate-300">
                {report.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="text-amber-400">•</span> {imp}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-700 flex justify-end">
            <button onClick={onRestart} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
              <RefreshCw size={18} /> Start New Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}