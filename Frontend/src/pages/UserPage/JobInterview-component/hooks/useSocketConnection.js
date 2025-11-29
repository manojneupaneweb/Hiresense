import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const useSocketConnection = (id) => {
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [messages, setMessages] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showScoreCard, setShowScoreCard] = useState(false);
  const [scoreData, setScoreData] = useState(null);

  const socketRef = useRef(null);
  const speakMessageRef = useRef(null);
  const interviewStartTimeRef = useRef(null);
  const messagesRef = useRef([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/job/jobdetails/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        setJobDetails(response.data);
      } catch (err) {
        setJobDetails({
          title: 'Software Developer',
          company: 'Tech Company',
          description: 'Backend development position'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  useEffect(() => {
    const newSocket = io('http://localhost:8000', {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);
    interviewStartTimeRef.current = new Date();

    newSocket.on('connect', () => {
      setConnectionStatus('connected');
    });

    newSocket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    newSocket.on('interview_message', (data) => {
      if (data.text && data.text.toLowerCase().includes('stop_interview')) {
        generateScoreCard();
        return;
      }

      const newMessage = {
        id: Date.now(),
        type: "ai",
        text: data.text,
        timestamp: data.timestamp || new Date().toISOString(),
        questionNumber: data.questionNumber || null
      };

      setMessages(prev => [...prev, newMessage]);

      if (speakMessageRef.current && data.text) {
        speakMessageRef.current(data.text);
      }
    });

    newSocket.on('system_message', (data) => {
      const newMessage = {
        id: Date.now(),
        type: "system",
        text: data.text,
        timestamp: data.timestamp || new Date().toISOString(),
      };
      setMessages(prev => [...prev, newMessage]);
    });

    newSocket.on('interview_complete', (data) => {
      generateScoreCard(data);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const generateScoreCard = async (backendData = null) => {
    const duration = Math.floor((new Date() - interviewStartTimeRef.current) / 1000);
    const allMessages = messagesRef.current;

    const aiMessages = allMessages.filter(m => m.type === 'ai' && m.questionNumber);
    const userMessages = allMessages.filter(m => m.type === 'user');

    const totalQuestions = aiMessages.length;
    const totalAnswers = userMessages.length;

    const baseScore = Math.floor(Math.random() * 25) + 70;
    const answerRatio = totalAnswers / Math.max(totalQuestions, 1);
    const adjustedScore = Math.min(100, Math.floor(baseScore * answerRatio));

    const feedbacks = [
      "Excellent communication skills...",
      "Strong problem-solving approach...",
      "Good understanding of core concepts...",
      "Demonstrated solid technical foundation...",
      "Impressive ability to articulate complex concepts...",
      "Consistent performance across all questions..."
    ];

    const randomFeedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];

    const finalData = {
      score: adjustedScore,
      totalQuestions,
      totalAnswers,
      duration,
      feedback: randomFeedback,
      conversation: [...allMessages],
      answers: aiMessages.map((aiMsg, index) => {
        const userResponse = userMessages[index];
        return {
          question: aiMsg.text,
          userAnswer: userResponse?.text || "No response provided",
          score: Math.floor(Math.random() * 3) + 8,
          feedback: ["Excellent answer", "Good response", "Adequate answer", "Could be better"][Math.floor(Math.random() * 4)]
        };
      })
    };




    try {
      await axios.post('/api/ai/interview/score', finalData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        withCredentials: true
      });

    } catch (error) {
      console.error('Error sending score data:', error);
    }

    setScoreData(finalData);
    setShowScoreCard(true);
    cleanupResources();
  };


  const cleanupResources = () => {
    if (socketRef.current) {
      socketRef.current.close();
      setSocket(null);
      setConnectionStatus('disconnected');
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const setSpeakMessage = (speakFn) => {
    speakMessageRef.current = speakFn;
  };

  const closeScoreCard = () => {
    setShowScoreCard(false);
    setScoreData(null);
    cleanupResources();
  };

  return {
    socket: socketRef.current,
    connectionStatus,
    messages,
    setMessages,
    jobDetails,
    loading,
    showScoreCard,
    scoreData,
    setSpeakMessage,
    closeScoreCard,
    cleanupResources
  };
};

export default useSocketConnection;