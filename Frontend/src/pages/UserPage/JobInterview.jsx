import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const JobInterview = () => {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewTime, setInterviewTime] = useState(0);
  const [messages, setMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [socketId, setSocketId] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [interviewReport, setInterviewReport] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inactivityWarning, setInactivityWarning] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [userSpeaking, setUserSpeaking] = useState(false);
  
  const { id } = useParams();
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const warningTimerRef = useRef(null);
  const userActivityTimerRef = useRef(null);
  const speechStopTimerRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        const results = event.results;
        const transcript = Array.from(results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setTranscript(transcript);
        
        // User is speaking, reset speech stop timer
        setUserSpeaking(true);
        clearTimeout(speechStopTimerRef.current);
        
        const finalResult = Array.from(results)
          .find(result => result.isFinal);
        
        if (finalResult) {
          const userMessage = {
            id: Date.now(),
            type: "user",
            text: transcript,
            timestamp: new Date().toLocaleTimeString()
          };
          
          setMessages(prev => [...prev, userMessage]);
          setTranscript('');
          
          if (socket && interviewStarted) {
            socket.emit('user_message', transcript);
            console.log("📤 Sent user message to backend:", transcript);
            
            // Set timer to detect when user stops speaking
            speechStopTimerRef.current = setTimeout(() => {
              setUserSpeaking(false);
              // Send speech stopped event to backend after 2 seconds
              if (socket && interviewStarted) {
                socket.emit('speech_stopped', {
                  socketId: socket.id,
                  timestamp: new Date().toISOString(),
                  message: "User stopped speaking for 2 seconds",
                  lastTranscript: transcript
                });
                console.log("📤 Sent speech stopped event to backend");
              }
            }, 2000);
            
            resetInactivityTimer();
          }
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          setError('Microphone access is not allowed. Please enable microphone permissions.');
        }
      };
      
      recognition.onend = () => {
        if (interviewStarted && micEnabled) {
          recognition.start();
        }
      };
      
      recognition.onspeechstart = () => {
        setUserSpeaking(true);
        clearTimeout(speechStopTimerRef.current);
      };
      
      recognition.onspeechend = () => {
        // Set timer to detect when user stops speaking
        speechStopTimerRef.current = setTimeout(() => {
          setUserSpeaking(false);
          // Send speech stopped event to backend after 2 seconds
          if (socket && interviewStarted) {
            socket.emit('speech_stopped', {
              socketId: socket.id,
              timestamp: new Date().toISOString(),
              message: "User stopped speaking for 2 seconds",
              lastTranscript: transcript
            });
            console.log("📤 Sent speech stopped event to backend");
          }
        }, 2000);
      };
      
      setRecognition(recognition);
    } else {
      setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
    }
  }, [socket, interviewStarted]);

  useEffect(() => {
    if (recognition) {
      if (interviewStarted && micEnabled) {
        setIsListening(true);
        recognition.start();
      } else {
        setIsListening(false);
        recognition.stop();
        clearTimeout(speechStopTimerRef.current);
        setUserSpeaking(false);
      }
    }
  }, [interviewStarted, micEnabled, recognition]);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/job/jobdetails/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        
        setJobDetails(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load job details');
        setLoading(false);
        console.error('Error fetching job details:', err);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  useEffect(() => {
    const newSocket = io('http://localhost:8000');
    setSocket(newSocket);
    
    newSocket.on('connect', () => {
      setConnectionStatus('connected');
      setSocketId(newSocket.id);
      console.log('✅ Connected to server with ID:', newSocket.id);
    });
    
    newSocket.on('disconnect', () => {
      setConnectionStatus('disconnected');
      console.log('❌ Disconnected from server');
    });
    
    newSocket.on('connect_error', (error) => {
      console.log('❌ Connection error:', error);
    });
    
    newSocket.on('interview_message', (data) => {
      const aiMessage = {
        id: Date.now(),
        type: "ai",
        text: data.text,
        timestamp: new Date(data.timestamp).toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      speakMessage(data.text);
      resetInactivityTimer();
    });

    newSocket.on('interview_complete', (data) => {
      generateInterviewReport(data.feedback);
    });
    
    newSocket.on('speech_analysis', (data) => {
      console.log("📥 Received speech analysis from backend:", data);
      // You can display this analysis in the UI if needed
      if (data.feedback) {
        const analysisMessage = {
          id: Date.now(),
          type: "system",
          text: data.feedback,
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, analysisMessage]);
      }
    });
    
    return () => {
      newSocket.close();
      clearTimeout(speechStopTimerRef.current);
    };
  }, []);

  useEffect(() => {
    let interviewTimer;
    if (interviewStarted) {
      interviewTimer = setInterval(() => {
        setInterviewTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interviewTimer);
  }, [interviewStarted]);

  useEffect(() => {
    const enableStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: cameraEnabled, 
          audio: micEnabled 
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };

    if (cameraEnabled || micEnabled) {
      enableStream();
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraEnabled, micEnabled]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, transcript]);

  const resetInactivityTimer = () => {
    if (interviewStarted) {
      clearTimeout(inactivityTimerRef.current);
      clearTimeout(warningTimerRef.current);
      setInactivityWarning(false);
      
      warningTimerRef.current = setTimeout(() => {
        setInactivityWarning(true);
        
        const warningMessage = {
          id: Date.now(),
          type: "system",
          text: "No response detected. The interview will end in 3 seconds if no activity.",
          timestamp: new Date().toLocaleTimeString()
        };
        
        setMessages(prev => [...prev, warningMessage]);
      }, 7000);
      
      inactivityTimerRef.current = setTimeout(() => {
        endInterviewDueToInactivity();
      }, 10000);
    }
  };

  const endInterviewDueToInactivity = () => {
    if (interviewStarted && socket) {
      const inactivityMessage = {
        id: Date.now(),
        type: "system",
        text: "Interview ended due to 10 seconds of inactivity.",
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, inactivityMessage]);
      
      socket.emit('inactivity_detected', {
        socketId: socket.id,
        timestamp: new Date().toISOString()
      });
      
      generateInterviewReport("The interview was automatically ended due to 10 seconds of inactivity. Please try again when you're ready to respond.");
    }
  };

  const generateInterviewReport = (feedback) => {
    const aiMessages = messages.filter(msg => msg.type === 'ai');
    
    const report = {
      duration: interviewTime,
      totalQuestions: aiMessages.length,
      feedback: feedback || "Thank you for your time. We'll review your responses and be in touch soon.",
      jobTitle: jobDetails?.title || 'Unknown Position'
    };
    
    setInterviewReport(report);
    setShowReport(true);
    setInterviewStarted(false);
    setInactivityWarning(false);
    
    clearTimeout(inactivityTimerRef.current);
    clearTimeout(warningTimerRef.current);
    clearTimeout(speechStopTimerRef.current);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
  };

  const toggleMic = () => {
    setMicEnabled(!micEnabled);
  };

  const startInterview = () => {
    setInterviewStarted(true);
    setInterviewTime(0);
    setShowReport(false);
    setInterviewReport(null);
    setMessages([]);
    setInactivityWarning(false);
    setUserSpeaking(false);
    
    if (socket && jobDetails) {
      socket.emit('start_interview', {
        jobDescription: jobDetails.description,
        requirements: jobDetails.requirements,
        responsibilities: jobDetails.responsibilities,
        skills: jobDetails.skills,
        title: jobDetails.title,
        company: jobDetails.company
      });
    }
    
    resetInactivityTimer();
  };

  const speakMessage = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopInterview = () => {
    if (socket) {
      socket.emit('end_interview', {
        socketId: socket.id,
        timestamp: new Date().toISOString()
      });
    }
    
    setInterviewStarted(false);
    setInactivityWarning(false);
    setUserSpeaking(false);
    window.speechSynthesis.cancel();
    clearTimeout(inactivityTimerRef.current);
    clearTimeout(warningTimerRef.current);
    clearTimeout(speechStopTimerRef.current);
  };

  const restartInterview = () => {
    setShowReport(false);
    setInterviewReport(null);
    setMessages([]);
    setInactivityWarning(false);
    setUserSpeaking(false);
    startInterview();
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-900 text-red-100 p-4 rounded-lg max-w-md">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gray-900 p-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Professional AI Interview</h1>
            {jobDetails && (
              <p className="text-sm text-gray-300">Position: {jobDetails.title} at {jobDetails.company}</p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className={`h-3 w-3 rounded-full mr-2 ${cameraEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>Camera</span>
            </div>
            <div className="flex items-center">
              <div className={`h-3 w-3 rounded-full mr-2 ${micEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>Microphone</span>
            </div>
            <div className="flex items-center">
              <div className={`h-3 w-3 rounded-full mr-2 ${
                connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span>Server: {connectionStatus}</span>
            </div>
            {isSpeaking && (
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full mr-2 bg-blue-500 animate-pulse"></div>
                <span>AI Speaking</span>
              </div>
            )}
            {isListening && (
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full mr-2 bg-green-500 animate-pulse"></div>
                <span>Listening</span>
              </div>
            )}
            {userSpeaking && (
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full mr-2 bg-purple-500 animate-pulse"></div>
                <span>User Speaking</span>
              </div>
            )}
            {inactivityWarning && (
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full mr-2 bg-yellow-500 animate-pulse"></div>
                <span>Inactivity Warning</span>
              </div>
            )}
          </div>
        </div>
        
        {showReport && interviewReport && (
          <div className="bg-blue-900 p-6 border-b border-blue-700">
            <h2 className="text-2xl font-bold mb-4 text-center">Interview Complete - {interviewReport.jobTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-800 p-4 rounded-lg text-center">
                <p className="text-sm text-blue-300">Duration</p>
                <p className="text-2xl font-semibold">{formatTime(interviewReport.duration)}</p>
              </div>
              <div className="bg-blue-800 p-4 rounded-lg text-center">
                <p className="text-sm text-blue-300">Questions Asked</p>
                <p className="text-2xl font-semibold">{interviewReport.totalQuestions}</p>
              </div>
              <div className="bg-blue-800 p-4 rounded-lg text-center">
                <p className="text-sm text-blue-300">Status</p>
                <p className="text-2xl font-semibold">Completed</p>
              </div>
            </div>
            <div className="bg-blue-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-blue-300">Feedback</h3>
              <p className="text-lg">{interviewReport.feedback}</p>
            </div>
            <div className="mt-6 flex justify-center">

              <a href="/job"
                className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-8 py-3 font-medium text-lg"
              
              > Exit Interview</a>
              {/* <button
                onClick={restartInterview}
              >
                Start New Interview
              </button> */}
            </div>
          </div>
        )}
        
        {!showReport && (
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-2/5 relative overflow-hidden min-h-[500px]">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
                <div className={`w-34 h-34 rounded-full overflow-hidden border-4 ${isSpeaking ? 'border-blue-500 animate-pulse' : 'border-gray-600'}`}>
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="AI Interviewer" 
                    className="w-34 h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg">
                <span className="font-mono text-xl">{formatTime(interviewTime)}</span>
              </div>
              
              <div className="absolute bottom-4 right-4 w-40 h-24 bg-black rounded-lg overflow-hidden shadow-lg border-2 border-gray-600">
                {cameraEnabled ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="absolute bottom-4 left-4 flex space-x-3">
                <button
                  onClick={toggleCamera}
                  className={`p-3 rounded-full transition-all ${cameraEnabled
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                    } shadow-md`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>

                <button
                  onClick={toggleMic}
                  className={`p-3 rounded-full transition-all ${micEnabled
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                    } shadow-md`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="lg:w-3/5 flex flex-col h-[600px]">
              <div className="p-4 border-b border-gray-700 bg-gray-800">
                <h2 className="text-lg font-semibold">Interview Conversation</h2>
                <p className="text-sm text-gray-400">
                  The AI interviewer will ask you questions about the position. Please respond clearly.
                </p>
              </div>
              
              <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 bg-gray-900 space-y-4"
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 
                                message.type === 'system' ? 'justify-center' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-4 ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : message.type === 'system'
                          ? 'bg-yellow-800 text-yellow-100'
                          : 'bg-gray-700 text-white'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                    </div>
                  </div>
                ))}
                
                {transcript && (
                  <div className="flex justify-end">
                    <div className="max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-4 bg-blue-800 text-white opacity-80">
                      <p className="whitespace-pre-wrap">{transcript}</p>
                      <p className="text-xs opacity-70 mt-1">Transcribing...</p>
                    </div>
                  </div>
                )}
                
                {messages.length === 0 && !transcript && (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <p>Ready to begin your interview for {jobDetails?.title}?</p>
                      <p className="mt-2 text-sm">Ensure your microphone is enabled and click Start Interview</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-700 bg-gray-800">
                {!interviewStarted ? (
                  <div className="flex flex-col space-y-4">
                    <button
                      onClick={startInterview}
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
                        <p>Cannot connect to server. Please make sure the server is running on port 8000.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="text-green-400">Interview in progress... Please speak your responses</p>
                      {inactivityWarning && (
                        <p className="text-yellow-400 mt-1">Warning: No activity detected. Interview will end soon.</p>
                      )}
                    </div>
                    <button
                      onClick={stopInterview}
                      className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 font-medium"
                    >
                      End Interview
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobInterview;