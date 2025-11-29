import { useState, useEffect, useRef, useCallback } from 'react';

const useSpeechRecognition = (socket, interviewStarted, micEnabled, setMessages) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);

  const recognitionRef = useRef(null);
  const speechTimerRef = useRef(null);

  const safeSetMessages = useCallback((message) => {
    if (setMessages && typeof setMessages === 'function') {
      setMessages(prev => [...prev, message]);
    }
  }, [setMessages]);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
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

      if (interim) {
        setTranscript(interim);
        setUserSpeaking(true);
        clearTimeout(speechTimerRef.current);
      }

      if (final) {
        const userMessage = {
          id: Date.now(),
          type: 'user',
          text: final,
          timestamp: new Date().toLocaleTimeString()
        };

        safeSetMessages(userMessage);
        setTranscript('');
        setUserSpeaking(true);

        clearTimeout(speechTimerRef.current);
        speechTimerRef.current = setTimeout(() => {
          const isInterviewActive = typeof interviewStarted === 'boolean' ? interviewStarted : interviewStarted?.current;
          const isSocketConnected = socket?.connected;

          if (socket && isSocketConnected && isInterviewActive) {
            socket.emit('user_message', final);
          }
          setUserSpeaking(false);
        }, 2000);
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);

      const isInterviewActive = typeof interviewStarted === 'boolean' ? interviewStarted : interviewStarted?.current;
      if (isInterviewActive && micEnabled && !isAISpeaking) {
        setTimeout(() => {
          try {
            if (recognitionRef.current) {
              recognitionRef.current.start();
            }
          } catch (error) {
            if (error.name !== 'InvalidStateError') {
            }
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
        }
      }
      clearTimeout(speechTimerRef.current);
    };
  }, [isAISpeaking, interviewStarted, micEnabled, socket, safeSetMessages]);

  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    const isInterviewActive = typeof interviewStarted === 'boolean' ? interviewStarted : interviewStarted?.current;

    if (isInterviewActive && micEnabled && !isAISpeaking) {
      try {
        recognition.start();
      } catch (error) {
        if (error.name !== 'InvalidStateError') {
        }
      }
    } else {
      try {
        recognition.stop();
      } catch (error) {
      }
      setTranscript('');
      setUserSpeaking(false);
      clearTimeout(speechTimerRef.current);
    }
  }, [interviewStarted, micEnabled, isAISpeaking]);

  const speakMessage = useCallback((text) => {
    if (!('speechSynthesis' in window)) return Promise.resolve();

    return new Promise((resolve) => {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1;

      const voices = window.speechSynthesis.getVoices();
      const priority = ["Samantha", "Hazel", "Zira", "Karen", "Tessa"];

      let femaleVoice = null;
      for (const name of priority) {
        const v = voices.find(voice => voice.name.includes(name));
        if (v) {
          femaleVoice = v;
          break;
        }
      }

      if (!femaleVoice) {
        femaleVoice = voices.find(voice =>
          voice.name.toLowerCase().includes("female")
        );
      }

      if (femaleVoice) utterance.voice = femaleVoice;

      utterance.onstart = () => {
        setIsAISpeaking(true);
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch (error) { }
        }
      };

      utterance.onend = () => {
        setIsAISpeaking(false);

        setTimeout(() => {
          const isInterviewActive = typeof interviewStarted === 'boolean'
            ? interviewStarted
            : interviewStarted?.current;

          if (isInterviewActive && micEnabled && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (error) {
              if (error.name !== 'InvalidStateError') {
              }
            }
          }
        }, 1000);

        resolve();
      };

      utterance.onerror = () => {
        setIsAISpeaking(false);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }, [interviewStarted, micEnabled]);

  useEffect(() => {
    if (!socket) return;

    const handleAIMessage = (data) => {
      if (data.text) {
        speakMessage(data.text);
      }
    };

    socket.on('interview_message', handleAIMessage);

    return () => {
      socket.off('interview_message', handleAIMessage);
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