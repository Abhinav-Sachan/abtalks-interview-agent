import { useState } from 'react';
import StartScreen from './pages/StartScreen';
import InterviewRoom from './pages/InterviewRoom';
import FeedbackReport from './pages/FeedbackReport';

export default function App() {
  const [currentView, setCurrentView] = useState('start');
  const [sessionData, setSessionData] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleStartInterview = (data) => {
    setSessionData(data);
    setCurrentView('interview');
  };

  const handleEndInterview = (feedbackData) => {
    setFeedback(feedbackData);
    setCurrentView('feedback');
  };

  const handleRestart = () => {
    setSessionData(null);
    setFeedback(null);
    setCurrentView('start');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <main className="flex-grow flex flex-col">
        {currentView === 'start' && <StartScreen onStart={handleStartInterview} />}

        {currentView === 'interview' && (
          <InterviewRoom
            sessionData={sessionData}
            onEnd={handleEndInterview}
          />
        )}

        {currentView === 'feedback' && (
          <FeedbackReport
            sessionData={sessionData}
            feedback={feedback}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  );
}
