import React from 'react';
import { 
  FiX, 
  FiStar, 
  FiClock, 
  FiMessageSquare, 
  FiCheckCircle, 
  FiMessageCircle, 
  FiUser,
  FiCpu 
} from 'react-icons/fi';

const ScoreCard = ({ scoreData, onClose }) => {
  if (!scoreData) {
    return null;
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '--:--:--';
    try {
      const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      return '--:--:--';
    }
  };

  const totalMessages = scoreData.conversation?.length || 0;
  const aiMessages = scoreData.conversation?.filter(m => m.type === 'ai').length || 0;
  const userMessages = scoreData.conversation?.filter(m => m.type === 'user').length || 0;
  const systemMessages = scoreData.conversation?.filter(m => m.type === 'system').length || 0;
  
  const averageResponseTime = scoreData.duration / Math.max(userMessages, 1);
  const conversationDensity = totalMessages / Math.max(scoreData.duration / 60, 1);
  const responseRate = aiMessages > 0 ? Math.round((userMessages / aiMessages) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-xl text-white">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold">Interview Results</h2>
              <p className="text-blue-100 mt-1">
                {totalMessages > 0 
                  ? `Analyzed ${totalMessages} messages across ${formatTime(scoreData.duration)}` 
                  : 'Interview completed'
                }
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors bg-white bg-opacity-20 p-2 rounded-full"
            >
              <FiX size={24} />
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-6 mt-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-white border-opacity-30">
                <div className="text-center">
                  <div className="text-2xl font-bold">{scoreData.score}</div>
                  <div className="text-xs opacity-90">/ 100</div>
                </div>
              </div>
              <div className="text-sm font-medium">Overall Score</div>
            </div>
            
            <div className="text-center">
              <FiClock className="mx-auto mb-2" size={24} />
              <div className="text-xl font-bold">{formatTime(scoreData.duration)}</div>
              <div className="text-sm opacity-90">Total Duration</div>
            </div>
            
            <div className="text-center">
              <FiMessageSquare className="mx-auto mb-2" size={24} />
              <div className="text-xl font-bold">{totalMessages}</div>
              <div className="text-sm opacity-90">Total Messages</div>
            </div>
            
            <div className="text-center">
              <FiStar className="mx-auto mb-2" size={24} />
              <div className="text-xl font-bold">
                {scoreData.totalQuestions > 0 ? Math.round(scoreData.score / scoreData.totalQuestions) : 'N/A'}
              </div>
              <div className="text-sm opacity-90">Avg Question Score</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b bg-gray-50">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{aiMessages}</div>
            <div className="text-sm text-gray-600">AI Questions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{userMessages}</div>
            <div className="text-sm text-gray-600">Your Answers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{systemMessages}</div>
            <div className="text-sm text-gray-600">System Messages</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(conversationDensity * 10) / 10}
            </div>
            <div className="text-sm text-gray-600">Msgs/Min</div>
          </div>
        </div>

        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <FiCheckCircle className="mr-2 text-green-600" />
            Overall Feedback & Analysis
          </h3>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
            <p className="text-gray-700 text-sm leading-relaxed">
              {scoreData.feedback}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
              <div>
                <strong>Response Rate:</strong> {userMessages}/{aiMessages} ({responseRate}%)
              </div>
              <div>
                <strong>Avg Response Time:</strong> {Math.round(averageResponseTime)}s
              </div>
              <div>
                <strong>Conversation Flow:</strong> {conversationDensity > 2 ? 'Active' : 'Moderate'}
              </div>
              <div>
                <strong>Completion:</strong> {scoreData.totalQuestions > 0 ? 'Completed' : 'Partial'}
              </div>
            </div>
          </div>
        </div>

        {scoreData.conversation && scoreData.conversation.length > 0 ? (
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiMessageCircle className="mr-2 text-purple-600" />
              Complete Conversation History ({scoreData.conversation.length} messages)
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto bg-gray-50 p-4 rounded-lg">
              {scoreData.conversation.map((message, index) => (
                <div key={message.id || index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-2xl rounded-lg p-4 border ${
                    message.type === 'user' 
                      ? 'bg-blue-100 border-blue-200 text-blue-800 rounded-br-none' 
                      : message.type === 'system'
                      ? 'bg-yellow-100 border-yellow-200 text-yellow-800 rounded-bl-none'
                      : 'bg-gray-100 border-gray-200 text-gray-800 rounded-bl-none'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {message.type === 'user' ? (
                        <FiUser className="text-blue-600" size={16} />
                      ) : message.type === 'system' ? (
                        <FiMessageCircle className="text-yellow-600" size={16} />
                      ) : (
                        <FiCpu className="text-gray-600" size={16} />
                      )}
                      <div className="font-medium text-sm">
                        {message.type === 'user' ? 'You' : message.type === 'system' ? 'System' : 'AI Interviewer'}
                        {message.questionNumber && ` • Question ${message.questionNumber}`}
                      </div>
                      <div className="text-xs opacity-70 ml-auto">
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-opacity-30 border-current">
                      <div className="text-xs opacity-70">
                        {message.type.toUpperCase()} • {message.text?.length || 0} chars
                      </div>
                      {message.type === 'ai' && message.questionNumber && (
                        <div className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                          Q{message.questionNumber}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiMessageCircle className="mr-2 text-purple-600" />
              Conversation History
            </h3>
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <FiMessageCircle className="mx-auto text-gray-400 mb-2" size={48} />
              <p className="text-gray-500">No conversation data available</p>
              <p className="text-sm text-gray-400 mt-1">The interview may have ended before any messages were recorded</p>
            </div>
          </div>
        )}

        {scoreData.answers && scoreData.answers.length > 0 ? (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Question Analysis</h3>
            <div className="space-y-4">
              {scoreData.answers.map((answer, index) => (
                <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <div className="font-medium text-gray-800 text-sm">
                          Question {index + 1}
                        </div>
                        <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          Score: {answer.score}/10
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-xs text-gray-500 mb-1 font-medium">QUESTION:</div>
                        <div className="text-sm text-gray-800 bg-gray-50 p-3 rounded border">
                          {answer.question}
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <div className="text-xs text-gray-500 mb-1 font-medium">YOUR ANSWER:</div>
                        <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded border border-blue-200">
                          {answer.userAnswer}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-green-700 font-medium bg-green-50 px-3 py-1 rounded border border-green-200">
                      💡 {answer.feedback}
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        answer.score >= 9 ? 'text-green-600' : 
                        answer.score >= 7 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {answer.score}/10
                      </div>
                      <div className="text-xs text-gray-500">
                        {answer.score >= 9 ? 'Excellent' : answer.score >= 7 ? 'Good' : 'Needs Work'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Question Analysis</h3>
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <FiMessageSquare className="mx-auto text-gray-400 mb-2" size={48} />
              <p className="text-gray-500">No question analysis available</p>
              <p className="text-sm text-gray-400 mt-1">Questions and answers were not recorded for analysis</p>
            </div>
          </div>
        )}

        <div className="p-6 border-t bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Performance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Interview Time:</span>
                <span className="font-medium">{formatTime(scoreData.duration)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Questions Attempted:</span>
                <span className="font-medium">{userMessages} of {aiMessages}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Response Score:</span>
                <span className="font-medium">
                  {scoreData.answers?.length > 0 
                    ? (scoreData.answers.reduce((sum, a) => sum + a.score, 0) / scoreData.answers.length).toFixed(1)
                    : 'N/A'
                  }/10
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Conversation Density:</span>
                <span className="font-medium">{Math.round(conversationDensity * 10) / 10} msg/min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Response Rate:</span>
                <span className="font-medium">{responseRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Overall Performance:</span>
                <span className={`font-medium ${
                  scoreData.score >= 90 ? 'text-green-600' : 
                  scoreData.score >= 80 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {scoreData.score >= 90 ? 'Excellent' : 
                   scoreData.score >= 80 ? 'Good' : 
                   scoreData.score >= 70 ? 'Satisfactory' : 'Needs Improvement'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-white rounded-b-xl">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              Complete Interview
            </button>
            <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center">
              📄 Download Detailed Report
            </button>
          </div>
          <p className="text-center text-sm text-gray-500 mt-3">
            Interview completed • All resources released • {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;