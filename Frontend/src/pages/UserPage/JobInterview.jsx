import React from 'react';
import { useParams } from 'react-router-dom';
import useMediaDevices from './JobInterview-component/hooks/useMediaDevices';
import useSpeechRecognition from './JobInterview-component/hooks/useSpeechRecognition';
import useInterviewFlow from './JobInterview-component/hooks/useInterviewFlow';
import useSocketConnection from './JobInterview-component/hooks/useSocketConnection';
import StatusIndicator from './JobInterview-component/StatusIndicator';
import InterviewReport from './JobInterview-component/InterviewReport';
import ChatInterface from './JobInterview-component/ChatInterface';
import InterviewControls from './JobInterview-component/InterviewControls';
import ErrorModal from './JobInterview-component/ErrorModal';
import { VideoDisplay } from './JobInterview-component/VideoCallInterface';

const JobInterview = () => {
  const { id } = useParams();
  
  const {
    devices,
    userVideoRef,
    error,
    toggleCamera,
    toggleMic,
    handleErrorClose,
    handleErrorRetry
  } = useMediaDevices();

  const {
    socket,
    connectionStatus,
    messages,
    setMessages,
    jobDetails,
    loading
  } = useSocketConnection(id);

  const {
    interview,
    showReport,
    interviewReport,
    inactivityWarning,
    startInterview,
    stopInterview,
    interviewStartedRef
  } = useInterviewFlow(jobDetails, socket);

  const {
    speech,
    transcript,
    aiSpeakingOverlap,
    speakMessage
  } = useSpeechRecognition(socket, interviewStartedRef, devices.micEnabled, setMessages);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!jobDetails && !loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">Failed to load job details</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-600 px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <ErrorModal error={error} onClose={handleErrorClose} onRetry={handleErrorRetry} />
      
      {showReport && interviewReport ? (
        <InterviewReport report={interviewReport} />
      ) : (
        <div className="flex flex-col h-screen">
          <div className="bg-gray-800 border-b border-gray-700 px-6 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600 w-3 h-3 rounded-full animate-pulse"></div>
                <div>
                  <h1 className="text-lg font-semibold">AI Interview Call</h1>
                  <p className="text-sm text-gray-400">
                    {jobDetails?.title} at {jobDetails?.company}
                  </p>
                </div>
              </div>
              <StatusIndicator 
                cameraEnabled={devices.cameraEnabled}
                micEnabled={devices.micEnabled}
                connectionStatus={connectionStatus}
                isSpeaking={speech.aiSpeaking}
                isListening={speech.listening}
                userSpeaking={speech.userSpeaking}
                inactivityWarning={inactivityWarning}
              />
            </div>
          </div>

          <div className="flex-1 flex">
            <div className="flex-1 bg-gray-800 border-r border-gray-700">
              <VideoDisplay
                cameraEnabled={devices.cameraEnabled}
                micEnabled={devices.micEnabled}
                userVideoRef={userVideoRef}
                isSpeaking={speech.aiSpeaking}
                interviewTime={interview.time}
                onCameraToggle={toggleCamera}
                onMicToggle={toggleMic}
              />
            </div>

            <div className="w-96 bg-gray-900 flex flex-col">
              <div className="flex-1 overflow-hidden">
                <ChatInterface 
                  messages={messages} 
                  transcript={transcript}
                  jobDetails={jobDetails}
                />
              </div>

              <div className="border-t border-gray-700 p-4 bg-gray-800">
                <InterviewControls 
                  interviewStarted={interview.started}
                  cameraEnabled={devices.cameraEnabled}
                  micEnabled={devices.micEnabled}
                  connectionStatus={connectionStatus}
                  jobDetails={jobDetails}
                  inactivityWarning={inactivityWarning}
                  onStartInterview={startInterview}
                  onStopInterview={stopInterview}
                />
              </div>
            </div>
          </div>

          {aiSpeakingOverlap && (
            <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg">
              AI is speaking, please wait...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobInterview;