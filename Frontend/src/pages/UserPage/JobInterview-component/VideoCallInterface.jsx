import React from "react";
import {
  FiMic,
  FiMicOff,
  FiVideo,
  FiVideoOff,
} from "react-icons/fi";

const VideoDisplay = ({
  cameraEnabled,
  micEnabled,
  userVideoRef,
  isSpeaking,
  interviewTime,
  onCameraToggle,
  onMicToggle,
}) => {
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-full w-full flex bg-black text-white">
      {/* LEFT SIDE - AI window */}
      <div className="flex-1 relative bg-gradient-to-br from-[#1e1e40] to-[#050b18] rounded-xl overflow-hidden m-4">
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
          <div className="w-36 h-36 bg-blue-600 rounded-full flex justify-center items-center text-4xl font-bold shadow-lg">
            AI
          </div>
          <p className="text-2xl font-semibold mt-4">AI Interviewer</p>
          <p className="text-gray-300">Ready to begin your interview</p>
        </div>

        {/* Voice Indicator */}
        {isSpeaking && (
          <div className="absolute top-4 left-4 bg-blue-600 px-4 py-2 rounded-full flex items-center gap-2 text-sm shadow-md">
            <div className="w-2 h-2 rounded-full bg-white animate-ping"></div>
            AI is speaking
          </div>
        )}

        {/* Timer */}
        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur px-4 py-2 rounded-lg text-center">
          <p className="text-xl font-mono font-bold">{formatTime(interviewTime)}</p>
          <p className="text-xs text-gray-300">Duration</p>
        </div>
      </div>

      {/* RIGHT SIDE - User */}
      <div className="w-[420px] bg-[#111] rounded-xl overflow-hidden m-4 flex flex-col">
        {/* User video */}
        <div className="relative flex-1 bg-black rounded-lg overflow-hidden">
          <video
            ref={userVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          <span className="absolute top-3 left-3 px-3 py-1 bg-blue-600 rounded-full text-sm">
            You
          </span>

          {!cameraEnabled && (
            <div className="absolute inset-0 bg-black/80 flex flex-col justify-center items-center">
              <FiVideoOff size={48} className="text-gray-400 mb-2" />
              <p className="text-lg text-gray-300">Camera Off</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="h-28 bg-[#0d0d0d] border-t border-gray-800 flex flex-col justify-center items-center gap-4">
          <div className="flex items-center gap-4 text-gray-300 text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${cameraEnabled ? "bg-green-500" : "bg-red-500"}`} />
              Camera
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${micEnabled ? "bg-green-500" : "bg-red-500"}`} />
              Mic
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-6">
            {/* Mic Button */}
            <button
              onClick={onMicToggle}
              className={`w-14 h-14 rounded-full flex justify-center items-center shadow-lg transition-all
                ${micEnabled ? "bg-[#1e8f3e]" : "bg-red-600"} hover:scale-110`}
            >
              {micEnabled ? <FiMic size={26} /> : <FiMicOff size={26} />}
            </button>

            {/* Camera Button */}
            <button
              onClick={onCameraToggle}
              className={`w-14 h-14 rounded-full flex justify-center items-center shadow-lg transition-all
                ${cameraEnabled ? "bg-[#1e8f3e]" : "bg-red-600"} hover:scale-110`}
            >
              {cameraEnabled ? <FiVideo size={26} /> : <FiVideoOff size={26} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { VideoDisplay };
