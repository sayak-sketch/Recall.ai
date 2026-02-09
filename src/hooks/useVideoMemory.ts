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
  const [bufferUsage, setBufferUsage] = useState(0); // 0% to 100%
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  // REFS (Like RAM registers)
  const framesBuffer = useRef<VideoFrame[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 1. START RECORDING
  const startRecording = useCallback(async () => {
    try {
      // FIX: Relaxed constraints. 
      // We ask for "facingMode: user" (selfie cam) but don't force a resolution.
      // This prevents "OverconstrainedError" on some devices.
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setIsRecording(true);
      
      // Start the Capture Loop
      intervalRef.current = setInterval(captureFrame, CAPTURE_INTERVAL);

    } catch (err: any) {
      console.error("Camera Error:", err);
      // Detailed error alert for debugging
      alert(`Camera Error: ${err.name} - ${err.message}`);
    }
  }, []);

  // 2. STOP RECORDING
  const stopRecording = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    setStream(null);
    setIsRecording(false);
  }, [stream]);

  // 3. CAPTURE FRAME (The "Clock Cycle")
  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Draw video frame to canvas
    // We use the ACTUAL video width/height to avoid stretching
    const width = videoRef.current.videoWidth;
    const height = videoRef.current.videoHeight;
    
    canvasRef.current.width = width;
    canvasRef.current.height = height;

    ctx.drawImage(videoRef.current, 0, 0, width, height);
    
    // Convert to JPEG (smaller size than PNG)
    const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.6); // Lower quality (0.6) for better performance

    // Push to Buffer
    framesBuffer.current.push({
      timestamp: Date.now(),
      dataUrl: dataUrl
    });

    // Circular Buffer Logic: If full, remove oldest (FIFO)
    if (framesBuffer.current.length > MAX_FRAMES) {
      framesBuffer.current.shift(); 
    }

    // Update UI (Buffer Percentage)
    setBufferUsage(Math.round((framesBuffer.current.length / MAX_FRAMES) * 100));
  };

  // 4. GET RELEVANT FRAMES (For the AI)
  const getRecentFrames = (sampleRate = 5) => {
    return framesBuffer.current
      .filter((_, index) => index % sampleRate === 0)
      .map(f => f.dataUrl.split(',')[1]); 
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopRecording();
  }, []);

  return {
    isRecording,
    bufferUsage,
    startRecording,
    stopRecording,
    videoRef, 
    canvasRef, 
    getRecentFrames
  };
}
