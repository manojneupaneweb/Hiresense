import React from 'react';

const InterviewControls = ({ 
  interviewStarted, 
  cameraEnabled, 
  micEnabled, 
  connectionStatus, 
  jobDetails, 
  inactivityWarning, 
  onStartInterview, 
  onStopInterview 
}) => {
  if (!interviewStarted) {
    return (
      <div className="flex flex-col space-y-4">
        <button
          onClick={onStartInterview}
          disabled={!cameraEnabled || !micEnabled || connectionStatus !== 'connected' || !jobDetails}
          className={`w-full py-3 rounded-lg text-lg font-semibold transition-all ${
            cameraEnabled && micEnabled && connectionStatus === 'connected' && jobDetails
              ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          Start Interview
        </button>
        
        {connectionStatus !== 'connected' && (
          <div className="p-3 bg-red-900 text-red-100 rounded-lg">
            <p>Cannot connect to server.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center">
      <div className="flex-1">
        <p className="text-green-400">Interview in progress... Please speak your responses</p>
        {inactivityWarning && (
          <p className="text-yellow-400 mt-1">Warning: No activity detected.</p>
        )}
      </div>
      <button
        onClick={onStopInterview}
        className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 font-medium"
      >
        End Interview
      </button>
    </div>
  );
};

export default InterviewControls;