import React from 'react';

const ChatInterface = ({ messages, transcript, jobDetails }) => {
  const ChatMessage = ({ message, transcript }) => {
    if (transcript) {
      return (
        <div className="flex justify-end mb-4">
          <div className="bg-blue-600 text-white rounded-2xl rounded-br-none px-4 py-2 max-w-xs">
            <p className="text-sm">{transcript}</p>
            <p className="text-xs opacity-70 mt-1">Typing...</p>
          </div>
        </div>
      );
    }

    if (message.type === 'system' || message.text?.includes('User connected') || message.text?.includes('Outgoing')) {
      return (
        <div className="flex justify-center mb-2">
          <div className="bg-gray-700 text-gray-300 rounded-lg px-3 py-1 text-xs max-w-md">
            {message.text?.includes('User connected') && '🟢 '}
            {message.text?.includes('Outgoing') && '📤 '}
            {message.text}
          </div>
        </div>
      );
    }

    if (message.type === 'ai' && message.questionNumber) {
      return (
        <div className="flex justify-start mb-4">
          <div className="bg-gray-200 text-gray-800 rounded-2xl rounded-bl-none px-4 py-3 max-w-xs">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-medium text-gray-600">Question {message.questionNumber}</span>
            </div>
            <p className="text-sm">{message.text}</p>
            <p className="text-xs opacity-70 mt-2">{message.timestamp}</p>
          </div>
        </div>
      );
    }

    return (
      <div className={`flex mb-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div className={`rounded-2xl px-4 py-2 max-w-xs ${
          message.type === 'user' 
            ? 'bg-blue-600 text-white rounded-br-none' 
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}>
          <p className="text-sm">{message.text}</p>
          <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 bg-white">
        {messages.length === 0 && !transcript && (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="font-medium">AI Interview Ready</p>
              <p className="text-sm mt-1">Start the interview to begin conversation</p>
            </div>
          </div>
        )}

        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}

        {transcript && <ChatMessage transcript={transcript} />}
      </div>
    </div>
  );
};

export default ChatInterface;