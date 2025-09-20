import React, { useState } from 'react';
import Home from './Home.jsx';
import QuizPage from './QuizPage.jsx';
import ResultPage from './ResultPage.jsx';

// The main App component manages which page is currently visible.
const App = () => {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'quiz', 'results'
  const [userDetails, setUserDetails] = useState(null);
  const [quizResults, setQuizResults] = useState(null);

  // Function to navigate from Home to Quiz
  const handleQuizStart = (details) => {
    setUserDetails(details);
    setCurrentPage('quiz');
  };

  // Function to navigate from Quiz to Results
  const handleQuizComplete = (answers) => {
    // In a real app, you'd calculate the score based on answers.
    // For now, we'll generate mock results.
    const mockResults = {
        "Maths": { score: Math.floor(Math.random() * 2) + 1, total: 2 },
        "Logical Reasoning": { score: Math.floor(Math.random() * 2) + 1, total: 2 },
        "English": { score: Math.floor(Math.random() * 2) + 1, total: 2 },
        "Personality": { score: 2, total: 2 } // Personality might be scored differently
    };
    setQuizResults(mockResults);
    setCurrentPage('results');
  };

  return (
    <div>
      {currentPage === 'home' && <Home onQuizStart={handleQuizStart} />}
      {currentPage === 'quiz' && <QuizPage onQuizComplete={handleQuizComplete} />}
      {currentPage === 'results' && <ResultPage results={quizResults} user={userDetails} />}
    </div>
  );
};

export default App;