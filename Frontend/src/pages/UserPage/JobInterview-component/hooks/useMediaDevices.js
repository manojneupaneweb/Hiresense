import { useState, useRef, useCallback, useEffect } from 'react';

const useMediaDevices = () => {
  const [devices, setDevices] = useState({
    cameraEnabled: false,
    micEnabled: false,
    initialized: false
  });
  const [error, setError] = useState(null);
  
  const streamRef = useRef(null);
  const userVideoRef = useRef(null);
  const interviewStartedRef = useRef(false);

  const setInterviewStarted = useCallback((started) => {
    interviewStartedRef.current = started;
  }, []);

  const initializeMedia = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      streamRef.current = stream;
      
      const videoTracks = stream.getVideoTracks();
      const audioTracks = stream.getAudioTracks();
      
      setDevices({
        cameraEnabled: videoTracks.length > 0 && videoTracks[0].enabled,
        micEnabled: audioTracks.length > 0 && audioTracks[0].enabled,
        initialized: true
      });

      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      let errorMessage = 'Failed to access camera and microphone. ';
      if (err.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera and microphone permissions.';
      } else if (err.name === 'NotFoundError') {
        errorMessage += 'No camera or microphone found.';
      } else if (err.name === 'NotReadableError') {
        errorMessage += 'Camera or microphone is already in use.';
      } else {
        errorMessage += 'Please check your device permissions.';
      }
      setError(errorMessage);
      setDevices({ cameraEnabled: false, micEnabled: false, initialized: false });
    }
  }, []);

  const toggleCamera = useCallback(() => {
    if (interviewStartedRef.current) {
      return;
    }

    if (!streamRef.current || !devices.initialized) {
      return;
    }
    
    const videoTracks = streamRef.current.getVideoTracks();
    
    if (videoTracks.length > 0) {
      const videoTrack = videoTracks[0];
      const newState = !videoTrack.enabled;
      
      videoTrack.enabled = newState;
      setDevices(prev => ({ 
        ...prev, 
        cameraEnabled: newState 
      }));
    }
  }, [devices.initialized]);

  const toggleMic = useCallback(() => {
    if (interviewStartedRef.current) {
      return;
    }

    if (!streamRef.current || !devices.initialized) {
      return;
    }
    
    const audioTracks = streamRef.current.getAudioTracks();
    
    if (audioTracks.length > 0) {
      const audioTrack = audioTracks[0];
      const newState = !audioTrack.enabled;
      
      audioTrack.enabled = newState;
      setDevices(prev => ({ 
        ...prev, 
        micEnabled: newState 
      }));
    }
  }, [devices.initialized]);

  useEffect(() => {
    initializeMedia();
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [initializeMedia]);

  const handleErrorClose = useCallback(() => {
    setError(null);
  }, []);

  const handleErrorRetry = useCallback(() => {
    setError(null);
    initializeMedia();
  }, [initializeMedia]);

  const stopAllMedia = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    setDevices({
      cameraEnabled: false,
      micEnabled: false,
      initialized: false
    });
  }, []);

  return {
    devices,
    streamRef,
    userVideoRef,
    error,
    initializeMedia,
    toggleCamera,
    toggleMic,
    setInterviewStarted,
    stopAllMedia,
    handleErrorClose,
    handleErrorRetry
  };
};

export default useMediaDevices;