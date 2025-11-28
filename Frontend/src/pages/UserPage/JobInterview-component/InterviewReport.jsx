import React from 'react';

const InterviewReport = ({ report }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-blue-900 p-6 border-b border-blue-700">
      <h2 className="text-2xl font-bold mb-4 text-center">Interview Complete - {report.jobTitle}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-800 p-4 rounded-lg text-center">
          <p className="text-sm text-blue-300">Duration</p>
          <p className="text-2xl font-semibold">{formatTime(report.duration)}</p>
        </div>
        <div className="bg-blue-800 p-4 rounded-lg text-center">
          <p className="text-sm text-blue-300">Questions Asked</p>
          <p className="text-2xl font-semibold">{report.totalQuestions}</p>
        </div>
        <div className="bg-blue-800 p-4 rounded-lg text-center">
          <p className="text-sm text-blue-300">Status</p>
          <p className="text-2xl font-semibold">Completed</p>
        </div>
      </div>
      <div className="bg-blue-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-blue-300">Feedback</h3>
        <p className="text-lg">{report.feedback}</p>
      </div>
      <div className="mt-6 flex justify-center">
        <a href="/job" className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-8 py-3 font-medium text-lg">
          Exit Interview
        </a>
      </div>
    </div>
  );
};

export default InterviewReport;