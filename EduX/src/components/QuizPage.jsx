import React, { useState, useEffect } from 'react';

// Data would typically be imported from a JSON file or fetched from an API
const quizData = [
    { "Type": "Maths", "Q_Num": 1, "Question": "25 × 36 ÷ 12 = ?", "Options": ["72", "75", "70", "78"], "Answer": "75" },
    { "Type": "Maths", "Q_Num": 2, "Question": "If x + 5 = 12, find x.", "Options": ["5", "6", "7", "8"], "Answer": "7" },
    { "Type": "Logical Reasoning", "Q_Num": 16, "Question": "What comes next: 2, 6, 12, 20, ?", "Options": ["28", "30", "32", "24"], "Answer": "30" },
    { "Type": "Logical Reasoning", "Q_Num": 17, "Question": "Find the odd one out: 3, 5, 7, 9, 11", "Options": ["3", "5", "7", "9"], "Answer": "9" },
    { "Type": "English", "Q_Num": 11, "Question": "Choose the correct synonym of 'Happy'.", "Options": ["Sad", "Joyful", "Angry", "Tired"], "Answer": "Joyful" },
    { "Type": "English", "Q_Num": 12, "Question": "Fill in the blank: She ___ to school yesterday.", "Options": ["go", "went", "gone", "going"], "Answer": "went" },
    { "Type": "Personality", "Q_Num": 21, "Question": "I feel confident speaking in front of a group.", "Options": ["Strongly Agree", "Agree", "Disagree", "Strongly Disagree"], "Answer": "" },
    { "Type": "Personality", "Q_Num": 22, "Question": "I enjoy working in a team.", "Options": ["Strongly Agree", "Agree", "Disagree", "Strongly Disagree"], "Answer": "" },
];

// --- ICONS ---
const CheckCircleIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PendingCircleIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="8" strokeWidth={2} strokeDasharray="1 3" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>;
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h17" /></svg>;


// --- UI COMPONENTS ---
const TopicStepper = ({ topics, onStartTopic }) => (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Quiz Progress</h2>
        <div className="space-y-4">
            {topics.map((topic, index) => (
                <div
                    key={topic.name}
                    className={`p-4 rounded-lg flex items-center justify-between transition-all duration-300 ${topic.status === 'completed'
                            ? 'bg-green-500/10 border-l-4 border-green-500'
                            : (topics.find(t => t.status === 'pending')?.name === topic.name ? 'bg-blue-500/10 border-l-4 border-blue-500 cursor-pointer hover:bg-blue-500/20' : 'bg-slate-700/50 border-l-4 border-slate-600')
                        }`}
                    onClick={() => topic.status !== 'completed' && onStartTopic(topic.name)}
                >
                    <div className="flex items-center">
                        {topic.status === 'completed'
                            ? <CheckCircleIcon className="h-6 w-6 text-green-400" />
                            : <PendingCircleIcon className="h-6 w-6 text-slate-400" />
                        }
                        <span className="ml-4 text-lg font-semibold text-slate-200">{index + 1}. {topic.name}</span>
                    </div>
                    {topic.status === 'completed' && <span className="font-semibold text-green-400 text-sm">Completed</span>}
                </div>
            ))}
        </div>
    </div>
);


const QuizPage = () => {
    const [view, setView] = useState('topics'); // topics, quiz, break, results
    const [topics, setTopics] = useState([]);
    const [activeTopic, setActiveTopic] = useState(null);
    const [questionsForTopic, setQuestionsForTopic] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [isSubmitConfirmVisible, setSubmitConfirmVisible] = useState(false);
    const [breakTimeLeft, setBreakTimeLeft] = useState(30);

    // Initialize topics from quizData
    useEffect(() => {
        const uniqueTypes = [...new Set(quizData.map(item => item.Type))];
        const initialTopics = uniqueTypes.map(type => ({
            name: type,
            status: 'pending', // pending, completed
            time: 30 * 60, // Fixed 30 minutes for each section
        }));
        setTopics(initialTopics);
    }, []);

    // Timer logic for quiz and break sections
    useEffect(() => {
        let timerId;
        if (view === 'quiz' && timeLeft > 0) {
            timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (view === 'quiz' && timeLeft === 0) {
            handleSubmitSection();
        } else if (view === 'break' && breakTimeLeft > 0) {
            timerId = setInterval(() => setBreakTimeLeft(prev => prev - 1), 1000);
        } else if (view === 'break' && breakTimeLeft === 0) {
            handleStartNextTopic();
        }
        return () => clearInterval(timerId);
    }, [view, timeLeft, breakTimeLeft]);


    const handleStartTopic = (topicName) => {
        const selectedTopic = topics.find(t => t.name === topicName);
        if (!selectedTopic || selectedTopic.status === 'completed') return;
        
        // Ensure we only start the next pending topic
        const firstPending = topics.find(t => t.status === 'pending');
        if (firstPending && topicName !== firstPending.name) return;

        setActiveTopic(topicName);
        setQuestionsForTopic(quizData.filter(q => q.Type === topicName));
        setTimeLeft(selectedTopic.time);
        setCurrentQuestionIndex(0);
        setView('quiz');
    };

    const handleStartNextTopic = () => {
        const nextTopic = topics.find(t => t.status === 'pending');
        if (nextTopic) {
            handleStartTopic(nextTopic.name);
        } else {
            setView('results');
        }
    };
    
    const handleAnalyzeResults = () => {
        console.log("Navigating to results analysis page...");
        // In a real application, you would use a router to navigate to a different page.
        // For example: navigate('/results-analysis');
        alert("Navigating to the results page!");
    };

    const handleAnswerSelect = (questionNum, answer) => {
        setUserAnswers(prev => ({ ...prev, [questionNum]: answer }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questionsForTopic.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmitSection = () => {
        setTopics(prev => prev.map(t => t.name === activeTopic ? { ...t, status: 'completed' } : t));
        setActiveTopic(null);
        setSubmitConfirmVisible(false);
        setBreakTimeLeft(30);
        
        // We need to check against the *new* state of topics
        const allCompleted = topics.every(t => (t.name === activeTopic ? true : t.status === 'completed'));
        setView(allCompleted ? 'results' : 'break');
    };


    const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${('0' + seconds % 60).slice(-2)}`;
    
    const currentQuestion = questionsForTopic[currentQuestionIndex];

    // --- RENDER FUNCTIONS ---
    const renderContent = () => {
        switch (view) {
            case 'topics':
                return (
                    <div className="w-full max-w-2xl animate-fade-in">
                        <TopicStepper topics={topics} onStartTopic={handleStartTopic} />
                    </div>
                );
            case 'break':
                 return (
                    <div className="w-full max-w-2xl text-center text-white animate-fade-in">
                        <h2 className="text-3xl font-bold mb-4">Section Completed!</h2>
                        <p className="text-slate-300 mb-8">Take a short break. The next section will begin automatically.</p>
                         <div className="mb-8">
                           <p className="text-slate-300 mb-2">Next section starts in:</p>
                           <p className="text-6xl font-bold text-blue-400">{breakTimeLeft}</p>
                         </div>
                        <TopicStepper topics={topics} onStartTopic={() => {}} />
                        <button
                            onClick={handleStartNextTopic}
                            className="mt-8 w-full max-w-xs mx-auto group inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold text-lg rounded-lg shadow-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105">
                            Start Next Now
                        </button>
                    </div>
                );
            case 'quiz':
                if (!currentQuestion) return null;
                return (
                    <div className="w-full max-w-4xl h-[90vh] flex flex-col bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 animate-fade-in">
                        {/* Navbar */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
                            <h2 className="text-xl font-bold text-white">{activeTopic}</h2>
                            <div className="flex items-center px-4 py-2 bg-slate-700/50 rounded-lg text-white font-semibold">
                                <ClockIcon />
                                <span>{formatTime(timeLeft)}</span>
                            </div>
                            <button onClick={() => setSubmitConfirmVisible(true)} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                Submit Section
                            </button>
                        </div>

                        {/* Main Content */}
                        <div className="flex-grow p-8 overflow-y-auto text-white">
                            <p className="text-sm font-semibold text-slate-400 mb-2">Question {currentQuestionIndex + 1} of {questionsForTopic.length}</p>
                            <h3 className="text-2xl font-semibold mb-8">{currentQuestion.Question}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {currentQuestion.Options.map((option, index) => (
                                    <button 
                                        key={index}
                                        onClick={() => handleAnswerSelect(currentQuestion.Q_Num, option)}
                                        className={`p-4 rounded-lg text-left text-base transition-all duration-200 border-2 text-slate-200
                                            ${userAnswers[currentQuestion.Q_Num] === option 
                                                ? 'bg-blue-600 border-blue-500 shadow-lg' 
                                                : 'bg-slate-700 border-slate-600 hover:bg-slate-600 hover:border-slate-500'}`
                                        }
                                    >
                                        <span className="font-mono mr-3 text-blue-300">{String.fromCharCode(65 + index)}.</span>{option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Footer Controls */}
                        <div className="flex items-center justify-between p-4 border-t border-slate-700 flex-shrink-0">
                            <button onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0} className="flex items-center px-5 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-500 transition-colors disabled:bg-slate-700 disabled:cursor-not-allowed disabled:text-slate-500">
                                <ArrowLeftIcon /> Previous
                            </button>
                            <button onClick={handleNextQuestion} disabled={currentQuestionIndex >= questionsForTopic.length - 1} className="flex items-center px-5 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-500 transition-colors disabled:bg-slate-700 disabled:cursor-not-allowed disabled:text-slate-500">
                                Next <ArrowRightIcon />
                            </button>
                        </div>
                    </div>
                );
            case 'results':
                return (
                     <div className="w-full max-w-2xl text-center text-white animate-fade-in">
                        <h1 className="text-4xl font-bold mb-4">Quiz Finished!</h1>
                        <p className="text-slate-300 text-lg mb-8">You have successfully completed all sections of the quiz.</p>
                         <div className="mb-8">
                             <TopicStepper topics={topics} onStartTopic={() => {}} />
                         </div>
                         <button
                            onClick={handleAnalyzeResults}
                            className="w-full max-w-xs mx-auto group inline-flex items-center justify-center px-6 py-4 bg-green-600 text-white font-bold text-lg rounded-lg shadow-xl hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 transition-all duration-300 transform hover:scale-105">
                            Analyze Your Progress
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="min-h-screen w-full flex items-center justify-center font-sans bg-slate-900 p-4">
            {renderContent()}

            {isSubmitConfirmVisible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
                    <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 text-white w-full max-w-sm mx-4 text-center">
                        <h3 className="text-2xl font-bold mb-4">Confirm Submission</h3>
                        <p className="text-slate-300 mb-8">You cannot change your answers for this section once submitted. Are you sure you want to proceed?</p>
                        <div className="flex justify-between gap-4">
                            <button onClick={() => setSubmitConfirmVisible(false)} className="w-full py-2 bg-slate-600 rounded-lg hover:bg-slate-500 transition-colors">Cancel</button>
                            <button onClick={handleSubmitSection} className="w-full py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors">Confirm & Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizPage;

