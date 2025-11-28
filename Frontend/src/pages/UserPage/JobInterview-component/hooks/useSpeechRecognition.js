import { useState, useEffect, useRef, useCallback } from 'react';

const useSpeechRecognition = (socket, interviewStarted, micEnabled, setMessages) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);
  
  const recognitionRef = useRef(null);
  const speechTimerRef = useRef(null);

  // Safe setMessages function
  const safeSetMessages = useCallback((message) => {
    if (setMessages && typeof setMessages === 'function') {
      setMessages(prev => [...prev, message]);
    } else {
      console.error('setMessages is not a function:', setMessages);
    }
  }, [setMessages]);

  // Initialize Speech Recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      console.log('Speech Recognition not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('🎤 Speech recognition started');
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      if (isAISpeaking) return;

      let final = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      // Show real-time typing
      if (interim) {
        setTranscript(interim);
        setUserSpeaking(true);
        clearTimeout(speechTimerRef.current);
      }

      // Handle final result
      if (final) {
        console.log('✅ Final transcript:', final);
        
        // Add to chat immediately using safe function
        const userMessage = {
          id: Date.now(),
          type: 'user',
          text: final,
          timestamp: new Date().toLocaleTimeString()
        };
        
        safeSetMessages(userMessage);
        setTranscript('');
        setUserSpeaking(true);

        // Wait 2 seconds then send to AI via Socket.IO
        clearTimeout(speechTimerRef.current);
        speechTimerRef.current = setTimeout(() => {
          const isInterviewActive = typeof interviewStarted === 'boolean' ? interviewStarted : interviewStarted?.current;
          const isSocketConnected = socket?.connected;
          
          console.log('🔴 DEBUG: Interview active?', isInterviewActive);
          console.log('🔴 DEBUG: Socket connected?', isSocketConnected);
          
          if (socket && isSocketConnected && isInterviewActive) {
            console.log('✅ Sending user_message to backend:', final);
            socket.emit('user_message', final);
          } else {
            console.log('❌ Cannot send - conditions not met');
          }
          setUserSpeaking(false);
        }, 2000);
      }
    };

    recognition.onerror = (event) => {
      console.log('❌ Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log('🔴 Speech recognition ended');
      setIsListening(false);
      
      // Auto-restart if should be listening
      const isInterviewActive = typeof interviewStarted === 'boolean' ? interviewStarted : interviewStarted?.current;
      if (isInterviewActive && micEnabled && !isAISpeaking) {
        setTimeout(() => {
          try {
            // Check if already started before restarting
            if (recognitionRef.current) {
              recognitionRef.current.start();
            }
          } catch (error) {
            if (error.name !== 'InvalidStateError') {
              console.log('Failed to restart:', error);
            }
            // Ignore InvalidStateError (already started)
          }
        }, 1000);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          // Ignore errors during cleanup
        }
      }
      clearTimeout(speechTimerRef.current);
    };
  }, [isAISpeaking, interviewStarted, micEnabled, socket, safeSetMessages]);

  // Control speech recognition based on states
  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    const isInterviewActive = typeof interviewStarted === 'boolean' ? interviewStarted : interviewStarted?.current;

    if (isInterviewActive && micEnabled && !isAISpeaking) {
      console.log('🚀 Starting recognition - Interview started');
      try {
        recognition.start();
      } catch (error) {
        if (error.name !== 'InvalidStateError') {
          console.log('Start error:', error);
        }
      }
    } else {
      console.log('🛑 Stopping recognition');
      try {
        recognition.stop();
      } catch (error) {
        // Ignore stop errors
      }
      setTranscript('');
      setUserSpeaking(false);
      clearTimeout(speechTimerRef.current);
    }
  }, [interviewStarted, micEnabled, isAISpeaking]);

  // AI Speech Function
  const speakMessage = useCallback((text) => {
    if (!('speechSynthesis' in window)) return Promise.resolve();

    return new Promise((resolve) => {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1;

      // Get female voice
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('Samantha') ||
        voice.name.includes('Karen') ||
        voice.name.includes('Tessa') ||
        voice.name.includes('Zira') ||
        voice.name.includes('Hazel')
      );
      
      if (femaleVoice) utterance.voice = femaleVoice;

      utterance.onstart = () => {
        console.log('🗣️ AI started speaking');
        setIsAISpeaking(true);
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch (error) {
            // Ignore stop errors
          }
        }
      };

      utterance.onend = () => {
        console.log('✅ AI finished speaking');
        setIsAISpeaking(false);
        
        // Restart listening after AI speaks
        setTimeout(() => {
          const isInterviewActive = typeof interviewStarted === 'boolean' ? interviewStarted : interviewStarted?.current;
          if (isInterviewActive && micEnabled && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (error) {
              if (error.name !== 'InvalidStateError') {
                console.log('Restart error:', error);
              }
            }
          }
        }, 1000);
        
        resolve();
      };

      utterance.onerror = () => {
        console.log('❌ AI speech error');
        setIsAISpeaking(false);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }, [interviewStarted, micEnabled]);

  // Listen for AI messages from socket
  useEffect(() => {
    if (!socket) return;

    const handleAIMessage = (data) => {
      if (data.text && data.type === 'ai') {
        speakMessage(data.text);
      }
    };

    socket.on('interview_message', handleAIMessage);
    socket.on('ai_message', handleAIMessage);

    return () => {
      socket.off('interview_message', handleAIMessage);
      socket.off('ai_message', handleAIMessage);
    };
  }, [socket, speakMessage]);

  return {
    speech: {
      aiSpeaking: isAISpeaking,
      userSpeaking: userSpeaking,
      listening: isListening
    },
    transcript,
    aiSpeakingOverlap: isAISpeaking && userSpeaking,
    speakMessage
  };
};

export default useSpeechRecognition;