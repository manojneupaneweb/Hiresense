import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const useSocketConnection = (id) => {
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [messages, setMessages] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/job/jobdetails/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJobDetails(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  useEffect(() => {
    const s = io("http://localhost:8000");
    setSocket(s);

    s.on("connect", () => setConnectionStatus("connected"));
    s.on("disconnect", () => setConnectionStatus("disconnected"));

    s.on("interview_message", (data) => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          type: "ai",
          text: data.text,
          timestamp: new Date(data.timestamp).toLocaleTimeString(),
        }
      ]);
    });

    return () => s.close();
  }, []);

  const sendMessage = (text) => {
    console.log(`send message text`, text);
    
    if (!socket) return;
    if (!text.trim()) return;

    socket.emit("user_message", { text });

    /// UI Show
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        type: "user",
        text,
        timestamp: new Date().toLocaleTimeString(),
      }
    ]);
  };

  // ⭐ Start interview must be called ONCE
  const startInterview = () => {
    if (socket && jobDetails) {
      socket.emit("start_interview", jobDetails);
    }
  };

  return {
    socket,
    sendMessage,
    startInterview,
    messages,
    jobDetails,
    loading,
    connectionStatus
  };
};

export default useSocketConnection;
