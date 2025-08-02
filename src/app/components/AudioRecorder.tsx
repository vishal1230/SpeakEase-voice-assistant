'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface AudioRecorderProps {
  onAudioData: (data: Float32Array) => void;
  isRecording: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ 
  onAudioData, 
  isRecording 
}) => {
  const [hasPermission, setHasPermission] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  
  useEffect(() => {
    requestMicrophonePermission();
  }, []);
  
  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      setupAudioProcessing(stream);
    } catch (error) {
      console.error('Microphone permission denied:', error);
    }
  };
  
  const setupAudioProcessing = (stream: MediaStream) => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 2048;
    
    source.connect(analyserRef.current);
    
    // Set up media recorder for continuous audio capture
    mediaRecorderRef.current = new MediaRecorder(stream);
    
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        // Convert blob to Float32Array and send to parent
        event.data.arrayBuffer().then(buffer => {
          const audioData = new Float32Array(buffer.byteLength / 4);
          onAudioData(audioData);
        });
      }
    };
  };
  
  useEffect(() => {
    if (mediaRecorderRef.current) {
      if (isRecording && mediaRecorderRef.current.state === 'inactive') {
        mediaRecorderRef.current.start(100); // Capture every 100ms
      } else if (!isRecording && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    }
  }, [isRecording]);
  
  if (!hasPermission) {
    return (
      <div className="text-center p-4">
        <p>Microphone permission required</p>
        <button 
          onClick={requestMicrophonePermission}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Grant Permission
        </button>
      </div>
    );
  }
  
  return null;
};
