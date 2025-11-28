import React from 'react';

const ErrorModal = ({ error, onClose, onRetry }) => {
  if (!error) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 border border-gray-600 shadow-2xl">
        <div className="flex items-center mb-6">
          <div className="bg-red-900 p-3 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Media Access Required</h2>
            <p className="text-gray-400 text-sm mt-1">Camera and microphone are essential</p>
          </div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <p className="text-gray-300 text-center font-medium">{error}</p>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={onRetry}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            Retry Connection
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white rounded-lg px-6 py-3 font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;