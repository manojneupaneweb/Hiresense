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
      
      console.log('🎥 Video tracks:', videoTracks.length);
      console.log('🎤 Audio tracks:', audioTracks.length);
      
      setDevices({
        cameraEnabled: videoTracks.length > 0 && videoTracks[0].enabled,
        micEnabled: audioTracks.length > 0 && audioTracks[0].enabled,
        initialized: true
      });

      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
        console.log('✅ Video stream attached to video element');
      }
    } catch (err) {
      console.error('❌ Media access error:', err);
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
    if (!streamRef.current || !devices.initialized) {
      console.log('❌ Cannot toggle camera: No stream or not initialized');
      return;
    }
    
    const videoTracks = streamRef.current.getVideoTracks();
    console.log('🎥 Toggling camera. Current tracks:', videoTracks.length);
    
    if (videoTracks.length > 0) {
      const videoTrack = videoTracks[0];
      const newState = !videoTrack.enabled;
      
      console.log('🎥 Camera current state:', videoTrack.enabled, '-> New state:', newState);
      
      videoTrack.enabled = newState;
      setDevices(prev => ({ 
        ...prev, 
        cameraEnabled: newState 
      }));
      
      console.log('✅ Camera toggled to:', newState);
    } else {
      console.log('❌ No video tracks found');
    }
  }, [devices.initialized]);

  const toggleMic = useCallback(() => {
    if (!streamRef.current || !devices.initialized) {
      console.log('❌ Cannot toggle mic: No stream or not initialized');
      return;
    }
    
    const audioTracks = streamRef.current.getAudioTracks();
    console.log('🎤 Toggling mic. Current tracks:', audioTracks.length);
    
    if (audioTracks.length > 0) {
      const audioTrack = audioTracks[0];
      const newState = !audioTrack.enabled;
      
      console.log('🎤 Mic current state:', audioTrack.enabled, '-> New state:', newState);
      
      audioTrack.enabled = newState;
      setDevices(prev => ({ 
        ...prev, 
        micEnabled: newState 
      }));
      
      console.log('✅ Mic toggled to:', newState);
    } else {
      console.log('❌ No audio tracks found');
    }
  }, [devices.initialized]);

  // Auto-initialize media on component mount
  useEffect(() => {
    console.log('🚀 Initializing media devices...');
    initializeMedia();
    
    return () => {
      // Cleanup stream on unmount
      if (streamRef.current) {
        console.log('🧹 Cleaning up media stream');
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

  return {
    devices,
    streamRef,
    userVideoRef,
    error,
    initializeMedia,
    toggleCamera,
    toggleMic,
    handleErrorClose,
    handleErrorRetry
  };
};

export default useMediaDevices;