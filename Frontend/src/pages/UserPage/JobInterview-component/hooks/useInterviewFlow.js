import { useState, useEffect, useRef, useCallback } from 'react';

const useInterviewFlow = (jobDetails, socket) => {
  const [interview, setInterview] = useState({
    started: false,
    time: 0,
    questions: []
  });
  const [showReport, setShowReport] = useState(false);
  const [interviewReport, setInterviewReport] = useState(null);
  const [inactivityWarning, setInactivityWarning] = useState(false);
  
  // Create ref for interview started state
  const interviewStartedRef = useRef(false);

  // Keep ref in sync with state
  useEffect(() => {
    interviewStartedRef.current = interview.started;
  }, [interview.started]);

  useEffect(() => {
    let interviewTimer;
    if (interview.started) {
      interviewTimer = setInterval(() => {
        setInterview(prev => ({ ...prev, time: prev.time + 1 }));
      }, 1000);
    }
    return () => clearInterval(interviewTimer);
  }, [interview.started]);

  const startInterview = useCallback(async () => {
    setInterview({
      started: true,
      time: 0,
      questions: []
    });
    setShowReport(false);
    setInterviewReport(null);
    setInactivityWarning(false);
    
    interviewStartedRef.current = true;

    if (socket && jobDetails) {
      socket.emit('start_interview', {
        jobDescription: jobDetails.description,
        requirements: jobDetails.requirements,
        title: jobDetails.title,
        company: jobDetails.company
      });
    }
  }, [socket, jobDetails]);

  const stopInterview = useCallback(() => {
    if (socket) socket.emit('end_interview');
    setInterview(prev => ({ ...prev, started: false }));
    setInactivityWarning(false);
    interviewStartedRef.current = false;
  }, [socket]);

  const generateInterviewReport = useCallback((feedback) => {
    const report = {
      duration: interview.time,
      totalQuestions: interview.questions.length,
      feedback: feedback || 'Thank you for your time.',
      jobTitle: jobDetails?.title || 'Unknown Position'
    };
    setInterviewReport(report);
    setShowReport(true);
    setInterview(prev => ({ ...prev, started: false }));
    setInactivityWarning(false);
    interviewStartedRef.current = false;
  }, [interview.time, interview.questions.length, jobDetails]);

  return {
    interview,
    showReport,
    interviewReport,
    inactivityWarning,
    startInterview,
    stopInterview,
    generateInterviewReport,
    interviewStartedRef // Export the ref
  };
};

export default useInterviewFlow;