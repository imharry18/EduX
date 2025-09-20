import React, { useState } from 'react';

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 ml-2 group-hover:translate-x-1 transition-transform duration-300">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const Home = ({ onQuizStart }) => {
  const [currentView, setCurrentView] = useState('landing');
  const [userDetails, setUserDetails] = useState({
    name: '',
    rollNo: '',
    branch: ''
  });
  const [errors, setErrors] = useState({});
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);

  const branchOptions = [
    "Computer Science and Engineering",
    "Electronics and CS Engineering",
    "Electronics",
    "Information Technology Engineering",
    "AI & ML",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!userDetails.name.trim()) newErrors.name = "Name is required";
    if (!userDetails.rollNo.trim()) newErrors.rollNo = "Roll No. is required";
    if (!userDetails.branch) newErrors.branch = "Please select a branch";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShowConfirmation = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setConfirmationVisible(true);
    }
  };

  const handleStartQuiz = () => {
    console.log("Starting quiz for:", userDetails);
    onQuizStart(userDetails);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-sans overflow-hidden bg-gray-900">
      {/* Background Image */}
      <div 
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1528645038029-7d0d575d_de2?q=80&w=2070&auto=format&fit=crop')",
          filter: currentView === 'landing' && !isConfirmationVisible ? 'blur(0px)' : 'blur(8px)',
          transform: currentView === 'landing' && !isConfirmationVisible ? 'scale(1)' : 'scale(1.1)',
        }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        {/* Landing View */}
        <div className={`transition-all duration-700 ease-in-out ${currentView === 'landing' ? 'opacity-100' : 'opacity-0 pointer-events-none absolute'}`}>
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">Welcome to the Quiz Portal</h1>
            <p className="text-lg text-gray-200 mb-8">Press the button below to begin the test.</p>
            <button
              onClick={() => setCurrentView('form')}
              className="group inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg shadow-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-105"
            >
              Start the Test
              <ArrowRightIcon />
            </button>
          </div>
        </div>

        {/* Form View */}
        <div className={`transition-all duration-700 ease-in-out ${currentView === 'form' ? 'opacity-100' : 'opacity-0 pointer-events-none absolute w-full left-0 px-4'}`}>
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20">
            <h2 className="text-3xl font-bold text-white text-center mb-6">Enter Your Details</h2>
            <form onSubmit={handleShowConfirmation} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">Name</label>
                <input type="text" id="name" name="name" value={userDetails.name} onChange={handleChange} className="w-full px-4 py-3 bg-white/20 text-white rounded-lg border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-300" placeholder="e.g., John Doe" />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="rollNo" className="block text-sm font-medium text-gray-200 mb-2">Roll No.</label>
                <input type="text" id="rollNo" name="rollNo" value={userDetails.rollNo} onChange={handleChange} className="w-full px-4 py-3 bg-white/20 text-white rounded-lg border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-300" placeholder="e.g., 2K22/IT/123" />
                {errors.rollNo && <p className="text-red-400 text-sm mt-1">{errors.rollNo}</p>}
              </div>
              <div>
                <label htmlFor="branch" className="block text-sm font-medium text-gray-200 mb-2">Branch</label>
                <select id="branch" name="branch" value={userDetails.branch} onChange={handleChange} className="w-full px-4 py-3 bg-white/20 text-white rounded-lg border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none">
                  <option value="" disabled>Select your branch</option>
                  {branchOptions.map(b => (<option key={b} value={b} className="bg-gray-800">{b}</option>))}
                </select>
                {errors.branch && <p className="text-red-400 text-sm mt-1">{errors.branch}</p>}
              </div>
              <button type="submit" className="w-full group inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-bold text-lg rounded-lg shadow-xl hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-all duration-300 transform hover:scale-105">Submit Details</button>
            </form>
          </div>
        </div>
      </div>

      {isConfirmationVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 text-white w-full max-w-sm mx-4">
            <h3 className="text-2xl font-bold text-center mb-6">Confirm Your Details</h3>
            <div className="space-y-4 text-lg">
              <p><span className="font-semibold text-gray-300">Name:</span> {userDetails.name}</p>
              <p><span className="font-semibold text-gray-300">Roll No:</span> {userDetails.rollNo}</p>
              <p><span className="font-semibold text-gray-300">Branch:</span> {userDetails.branch}</p>
            </div>
            <div className="mt-8 flex justify-between gap-4">
              <button onClick={() => setConfirmationVisible(false)} className="w-full px-4 py-2 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors">Go Back</button>
              <button onClick={handleStartQuiz} className="w-full px-4 py-2 bg-green-600 text-white font-bold rounded-lg shadow-xl hover:bg-green-700 transition-colors">Start Quiz</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;