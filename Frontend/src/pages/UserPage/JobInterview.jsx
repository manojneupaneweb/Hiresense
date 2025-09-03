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
  const [showReport, setShowReport] = useState(false);
  const [interviewReport, setInterviewReport] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inactivityWarning, setInactivityWarning] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  
  const { id } = useParams();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const warningTimerRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results).map(r => r[0].transcript).join('');
        setTranscript(transcript);
        
        if (socket && interviewStarted) {
          socket.emit('real_time_transcript', {
            socketId: socket.id,
            transcript: transcript,
            timestamp: new Date().toISOString(),
            isFinal: false
          });
        }
        
        const finalResult = Array.from(event.results).find(r => r.isFinal);
        if (finalResult) {
          setMessages(prev => [...prev, {
            id: Date.now(),
            type: "user",
            text: transcript,
            timestamp: new Date().toLocaleTimeString()
          }]);
          setTranscript('');
          
          if (socket && interviewStarted) {
            socket.emit('user_response', {
              socketId: socket.id,
              message: transcript,
              timestamp: new Date().toISOString(),
              isFinal: true
            });
            resetInactivityTimer();
          }
        }
      };
      
      recognition.onerror = (event) => {
        if (event.error === 'not-allowed') {
          setError('Microphone access denied');
        }
      };
      
      recognition.onend = () => {
        if (interviewStarted && micEnabled) recognition.start();
      };
      
      setRecognition(recognition);
    } else {
      setError('Speech recognition not supported');
    }
  }, []);

  useEffect(() => {
    if (recognition) {
      if (interviewStarted && micEnabled) {
        recognition.start();
      } else {
        recognition.stop();
      }
    }
  }, [interviewStarted, micEnabled, recognition]);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/job/jobdetails/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setJobDetails(response.data);
      } catch (err) {
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchJobDetails();
  }, [id]);

  useEffect(() => {
    const newSocket = io('http://localhost:8000');
    setSocket(newSocket);
    
    newSocket.on('connect', () => setConnectionStatus('connected'));
    newSocket.on('disconnect', () => setConnectionStatus('disconnected'));
    
    const handleMessage = (data) => {
      const message = {
        id: Date.now(),
        type: "ai",
        text: data.text,
        timestamp: data.timestamp ? new Date(data.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, message]);
      speakMessage(data.text);
      resetInactivityTimer();
    };
    
    newSocket.on('ai_message', handleMessage);
    newSocket.on('interview_message', handleMessage);
    newSocket.on('interview_complete', (data) => generateInterviewReport(data.feedback));
    
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    let timer;
    if (interviewStarted) {
      timer = setInterval(() => setInterviewTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [interviewStarted]);

  useEffect(() => {
    const enableStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: cameraEnabled, 
          audio: micEnabled 
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {}
    };

    if (cameraEnabled || micEnabled) {
      enableStream();
    } else if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
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
    if (!interviewStarted) return;
    clearTimeout(inactivityTimerRef.current);
    clearTimeout(warningTimerRef.current);
    setInactivityWarning(false);
    
    warningTimerRef.current = setTimeout(() => {
      setInactivityWarning(true);
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: "system",
        text: "Please respond to continue",
        timestamp: new Date().toLocaleTimeString()
      }]);
    }, 7000);
    
    inactivityTimerRef.current = setTimeout(() => {
      const message = {
        id: Date.now(),
        type: "system",
        text: "Interview ended due to inactivity",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, message]);
      
      if (socket) {
        socket.emit('inactivity_detected', {
          socketId: socket.id,
          timestamp: new Date().toISOString()
        });
      }
      generateInterviewReport("Interview ended due to inactivity");
    }, 10000);
  };

  const generateInterviewReport = (feedback) => {
    const report = {
      duration: interviewTime,
      totalQuestions: messages.filter(msg => msg.type === 'ai').length,
      feedback: feedback || "Thank you for your time",
      jobTitle: jobDetails?.title || 'Position'
    };
    setInterviewReport(report);
    setShowReport(true);
    setInterviewStarted(false);
    setInactivityWarning(false);
    clearTimeout(inactivityTimerRef.current);
    clearTimeout(warningTimerRef.current);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startInterview = () => {
    setInterviewStarted(true);
    setInterviewTime(0);
    setShowReport(false);
    setInterviewReport(null);
    setMessages([]);
    setInactivityWarning(false);
    
    if (socket && jobDetails) {
      socket.emit('start_interview', {
        socketId: socket.id,
        timestamp: new Date().toISOString(),
        jobDetails: {
          jobDescription: jobDetails.description,
          requirements: jobDetails.requirements,
          responsibilities: jobDetails.responsibilities,
          skills: jobDetails.skills,
          title: jobDetails.title,
          company: jobDetails.company
        }
      });
    }
    resetInactivityTimer();
  };

  const speakMessage = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
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
    window.speechSynthesis.cancel();
    clearTimeout(inactivityTimerRef.current);
    clearTimeout(warningTimerRef.current);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="bg-red-900 text-red-100 p-4 rounded-lg">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 bg-blue-600 text-white rounded px-4 py-2">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="max-w-7xl mx-auto bg-gray-800 rounded-xl overflow-hidden">
        <div className="bg-gray-900 p-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">AI Interview</h1>
            {jobDetails && <p className="text-sm text-gray-300">{jobDetails.title} at {jobDetails.company}</p>}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className={`h-3 w-3 rounded-full mr-2 ${cameraEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>Camera</span>
            </div>
            <div className="flex items-center">
              <div className={`h-3 w-3 rounded-full mr-2 ${micEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>Mic</span>
            </div>
            <div className="flex items-center">
              <div className={`h-3 w-3 rounded-full mr-2 ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{connectionStatus}</span>
            </div>
          </div>
        </div>
        
        {showReport && interviewReport && (
          <div className="bg-blue-900 p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Interview Complete</h2>
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-800 p-4 rounded text-center">
                <p className="text-sm text-blue-300">Duration</p>
                <p className="text-2xl font-semibold">{formatTime(interviewReport.duration)}</p>
              </div>
              <div className="bg-blue-800 p-4 rounded text-center">
                <p className="text-sm text-blue-300">Questions</p>
                <p className="text-2xl font-semibold">{interviewReport.totalQuestions}</p>
              </div>
              <div className="bg-blue-800 p-4 rounded text-center">
                <p className="text-sm text-blue-300">Status</p>
                <p className="text-2xl font-semibold">Complete</p>
              </div>
            </div>
            <div className="bg-blue-800 p-6 rounded">
              <h3 className="text-lg font-semibold mb-3">Feedback</h3>
              <p>{interviewReport.feedback}</p>
            </div>
            <div className="mt-6 flex justify-center">
              <button onClick={() => { setShowReport(false); startInterview(); }} className="bg-green-600 text-white rounded px-8 py-3">
                Start New Interview
              </button>
            </div>
          </div>
        )}
        
        {!showReport && (
          <div className="flex">
            <div className="w-2/5 relative min-h-[500px] bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
              <div className={`w-32 h-32 rounded-full overflow-hidden border-4 ${isSpeaking ? 'border-blue-500 animate-pulse' : 'border-gray-600'}`}>
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="AI" className="w-full h-full object-cover" />
              </div>
              
              <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded">
                <span className="font-mono text-xl">{formatTime(interviewTime)}</span>
              </div>
              
              <div className="absolute bottom-4 right-4 w-40 h-24 bg-black rounded overflow-hidden border-2 border-gray-600">
                {cameraEnabled ? (
                  <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="absolute bottom-4 left-4 flex space-x-3">
                <button onClick={() => setCameraEnabled(!cameraEnabled)} className={`p-3 rounded-full ${cameraEnabled ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button onClick={() => setMicEnabled(!micEnabled)} className={`p-3 rounded-full ${micEnabled ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="w-3/5 flex flex-col h-[600px]">
              <div className="p-4 border-b border-gray-700 bg-gray-800">
                <h2 className="text-lg font-semibold">Interview Chat</h2>
              </div>
              
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 bg-gray-900 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : message.type === 'system' ? 'justify-center' : 'justify-start'}`}>
                    <div className={`max-w-lg rounded p-4 ${message.type === 'user' ? 'bg-blue-600 text-white' : message.type === 'system' ? 'bg-yellow-800 text-yellow-100' : 'bg-gray-700 text-white'}`}>
                      <p>{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                    </div>
                  </div>
                ))}
                
                {transcript && (
                  <div className="flex justify-end">
                    <div className="max-w-lg rounded p-4 bg-blue-800 text-white opacity-80">
                      <p>{transcript}</p>
                      <p className="text-xs opacity-70 mt-1">Transcribing...</p>
                    </div>
                  </div>
                )}
                
                {messages.length === 0 && !transcript && (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <p>Ready to begin interview?</p>
                      <p className="mt-2 text-sm">Enable microphone and click Start</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-700 bg-gray-800">
                {!interviewStarted ? (
                  <div>
                    <button onClick={startInterview} disabled={!cameraEnabled || !micEnabled || connectionStatus !== 'connected' || !jobDetails} className={`w-full py-3 rounded text-lg font-semibold ${cameraEnabled && micEnabled && connectionStatus === 'connected' && jobDetails ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}>
                      Start Interview
                    </button>
                    {connectionStatus !== 'connected' && (
                      <div className="p-3 bg-red-900 text-red-100 rounded mt-4">
                        <p>Server not connected</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-green-400">Interview in progress</p>
                      {inactivityWarning && <p className="text-yellow-400">Please respond</p>}
                    </div>
                    <button onClick={stopInterview} className="bg-red-600 text-white rounded px-4 py-2">
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