import { useState, useRef, useEffect, useCallback } from 'react';

// SETTINGS
const MAX_FRAMES = 300; // ~15 mins of history
const CAPTURE_INTERVAL = 3000; // Capture every 3 seconds

interface VideoFrame {
  timestamp: number;
  dataUrl: string; // The image data in Base64
}

export function useVideoMemory() {
  const [isRecording, setIsRecording] = useState(false);
  const [bufferUsage, setBufferUsage] = useState(0); 
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user'); // New State
  
  // REFS
  const framesBuffer = useRef<VideoFrame[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 1. START RECORDING
  // Now accepts an optional mode argument, defaults to current state
  const startRecording = useCallback(async (modeOverride?: 'user' | 'environment') => {
    try {
      const modeToUse = modeOverride || facingMode;
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: modeToUse } 
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setIsRecording(true);
      
      // Clear any existing interval just in case
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(captureFrame, CAPTURE_INTERVAL);

    } catch (err: any) {
      console.error("Camera Error:", err);
      alert(`Camera Error: ${err.name} - ${err.message}`);
    }
  }, [facingMode]);

  // 2. STOP RECORDING
  const stopRecording = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    setStream(null);
    setIsRecording(false);
  }, [stream]);

  // 3. SWITCH CAMERA (New Function)
  const switchCamera = useCallback(async () => {
    // 1. Determine new mode
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);

    // 2. If currently recording, we need to restart the stream seamlessly
    if (isRecording) {
      // Stop the *stream* but don't clear the *buffer* (memory)
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      // Restart with new mode
      await startRecording(newMode);
    }
  }, [facingMode, isRecording, stream, startRecording]);

  // 4. CAPTURE FRAME
  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const width = videoRef.current.videoWidth;
    const height = videoRef.current.videoHeight;
    
    canvasRef.current.width = width;
    canvasRef.current.height = height;

    ctx.drawImage(videoRef.current, 0, 0, width, height);
    
    const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.6);

    framesBuffer.current.push({
      timestamp: Date.now(),
      dataUrl: dataUrl
    });

    if (framesBuffer.current.length > MAX_FRAMES) {
      framesBuffer.current.shift(); 
    }

    setBufferUsage(Math.round((framesBuffer.current.length / MAX_FRAMES) * 100));
  };

  const getRecentFrames = (sampleRate = 5) => {
    return framesBuffer.current
      .filter((_, index) => index % sampleRate === 0)
      .map(f => f.dataUrl.split(',')[1]); 
  };

  useEffect(() => {
    return () => stopRecording();
  }, []);

  return {
    isRecording,
    bufferUsage,
    startRecording,
    stopRecording,
    switchCamera, // Export this new function
    facingMode,   // Export state so UI knows which icon to show
    videoRef, 
    canvasRef, 
    getRecentFrames
  };
}
