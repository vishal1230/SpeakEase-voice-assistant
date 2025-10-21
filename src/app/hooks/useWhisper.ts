import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { TranscriptionResult } from '../../types/audio';

export const useWhisper = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  
  const recognitionRef = useRef<any>(null);
  
  useEffect(() => {
    // No workers - direct speech recognition
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition && navigator.onLine) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onresult = (event: any) => {
          const lastResultIndex = event.results.length - 1;
          const lastResult = event.results[lastResultIndex];
          
          if (lastResult.isFinal) {
            const transcript = lastResult[0].transcript.trim();
            const confidence = lastResult[0].confidence;
            
            if (transcript) {
              setTranscription({
                text: transcript,
                confidence: confidence || 0.9,
                timestamp: Date.now()
              });
            }
          }
        };
        
        recognitionRef.current.onerror = (event: any) => {
          setError(`Speech recognition error: ${event.error}`);
          setIsRecording(false);
        };
        
        recognitionRef.current.onend = () => {
          if (isRecording) {
            setTimeout(() => {
              try {
                recognitionRef.current?.start();
              } catch (e) {
                setIsRecording(false);
              }
            }, 100);
          }
        };
        
        setIsInitialized(true);
      } else {
        setError('Speech recognition not supported or offline');
        setIsInitialized(true);
      }
    }
  }, [isRecording]);
  
  const startRecording = useCallback(() => {
    if (recognitionRef.current && !isRecording) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        setError(null);
      } catch (error) {
        setError('Failed to start recording');
      }
    }
  }, [isRecording]);
  
  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  // --- ADD THIS FUNCTION ---
  const clearTranscription = useCallback(() => {
    setTranscription(null);
  }, []);
  
  // --- WRAP RETURN IN useMemo ---
  return useMemo(() => ({
    isInitialized,
    isRecording,
    transcription,
    error,
    isOnline,
    startRecording,
    stopRecording,
    clearTranscription // <-- EXPORT THE NEW FUNCTION
  }), [isInitialized, isRecording, transcription, error, isOnline, startRecording, stopRecording, clearTranscription]);
};