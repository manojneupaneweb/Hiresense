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
import { VideoDisplay } from './JobInterview-component/VideoDisplay';
import ScoreCard from './JobInterview-component/ScoreCard.jsx';

const JobInterview = () => {
  const { id } = useParams();

  const {
    devices,
    userVideoRef,
    error,
    toggleCamera,
    toggleMic,
    setInterviewStarted,
    handleErrorClose,
    handleErrorRetry
  } = useMediaDevices();

  const {
    socket,
    connectionStatus,
    messages,
    setMessages,
    jobDetails,
    loading,
    showScoreCard,
    scoreData,
    setSpeakMessage,
    closeScoreCard
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

  React.useEffect(() => {
    if (speakMessage) {
      setSpeakMessage(speakMessage);
    }
  }, [speakMessage, setSpeakMessage]);

  React.useEffect(() => {
    if (setInterviewStarted) {
      setInterviewStarted(interview.started);
    }
  }, [interview.started, setInterviewStarted]);

  const handleScoreCardClose = () => {
    if (devices.streamRef?.current) {
      devices.streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
    }

    closeScoreCard();

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

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
            className="mt-4 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-colors"
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

      {showScoreCard && (
        <ScoreCard scoreData={scoreData} onClose={handleScoreCardClose} />
      )}

      {!showScoreCard ? (
        showReport && interviewReport ? (
          <InterviewReport report={interviewReport} />
        ) : (
          <div className="flex flex-col h-screen">
            <div className="bg-gray-800 border-b border-gray-700 px-6 py-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <div>
                    <h1 className="text-lg font-semibold">AI Interview Call</h1>
                    <p className="text-sm text-gray-400">
                      {jobDetails?.title} at {jobDetails?.company}
                      {interview.started && ` • ${Math.floor(interview.time / 60)}:${(interview.time % 60).toString().padStart(2, '0')}`}
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
                  interviewStarted={interview.started}
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
              <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce">
                🎤 AI is speaking, please wait...
              </div>
            )}

            {connectionStatus !== 'connected' && (
              <div className="fixed bottom-4 left-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg">
                🔌 Connection lost - Attempting to reconnect...
              </div>
            )}
          </div>
        )
      ) : (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-xl text-gray-300">Generating your interview results...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait while we analyze your performance</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobInterview;