import { useCallback, useEffect, useRef, useState } from 'react';
import { TranscriptionResult } from '../../types/audio';

export const useWhisper = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      // Initialize speech recognition if online
      if (navigator.onLine) {
        initializeSpeechRecognition();
      } else {
        // Set as initialized but show offline message
        setIsInitialized(true);
        setError('Currently offline - Speech recognition requires internet connection');
      }
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.log('Error stopping recognition on cleanup:', error);
        }
      }
    };
  }, []);
  
  const initializeSpeechRecognition = useCallback(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;  // ✅ Enable continuous listening
        recognitionRef.current.interimResults = true;  // ✅ Get intermediate results
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.maxAlternatives = 1;
        
        let lastSpeechTime = Date.now();
        let processingResult = false;
        
        recognitionRef.current.onresult = (event: any) => {
          // Update last speech time
          lastSpeechTime = Date.now();
          
          // Get the most recent result
          const lastResultIndex = event.results.length - 1;
          const lastResult = event.results[lastResultIndex];
          const transcript = lastResult[0].transcript.trim();
          const confidence = lastResult[0].confidence;
          const isFinal = lastResult.isFinal;
          
          // Clear existing silence timer
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
          
          // Only process final results and avoid duplicate processing
          if (isFinal && transcript && !processingResult) {
            processingResult = true;
            
            setTranscription({
              text: transcript,
              confidence: confidence || 0.9,
              timestamp: Date.now()
            });
            setError(null);
            
            // Reset processing flag after a short delay
            setTimeout(() => {
              processingResult = false;
            }, 1000);
            
            // Set up silence detection for next speech input
            silenceTimerRef.current = setTimeout(() => {
              // Keep the recognition active, ready for next input
              console.log('Ready for next speech input...');
            }, 2000);
          }
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event);
          
          switch (event.error) {
            case 'network':
              setError('Speech recognition requires internet connection. Please check your connection and try again.');
              break;
            case 'not-allowed':
              setError('Microphone access denied. Please allow microphone permissions.');
              break;
            case 'no-speech':
              // Don't show error for no speech in continuous mode, just keep listening
              console.log('No speech detected, continuing to listen...');
              break;
            case 'audio-capture':
              setError('Audio capture failed. Check your microphone.');
              break;
            case 'service-not-allowed':
              setError('Speech service not allowed. Try using HTTPS or localhost.');
              break;
            case 'aborted':
              // Recognition was aborted, don't show as error if intentional
              console.log('Speech recognition aborted');
              break;
            default:
              setError(`Speech recognition error: ${event.error}`);
          }
          
          // Don't stop recording for minor errors in continuous mode
          if (event.error !== 'no-speech' && event.error !== 'aborted') {
            setIsRecording(false);
          }
        };
        
        recognitionRef.current.onend = () => {
          console.log('Speech recognition ended');
          
          // Automatically restart if we're supposed to be recording
          if (isRecording && isOnline) {
            try {
              // Small delay before restarting to avoid rapid restart cycles
              setTimeout(() => {
                if (isRecording && recognitionRef.current) {
                  recognitionRef.current.start();
                  console.log('Speech recognition restarted automatically');
                }
              }, 100);
            } catch (error) {
              console.log('Recognition restart failed:', error);
              setIsRecording(false);
            }
          }
        };
        
        recognitionRef.current.onstart = () => {
          console.log('Speech recognition started');
          setError(null);
        };
        
        recognitionRef.current.onspeechstart = () => {
          console.log('Speech detected');
        };
        
        recognitionRef.current.onspeechend = () => {
          console.log('Speech ended, processing...');
        };
        
        setIsInitialized(true);
        setError(null);
      } else {
        setError('Speech recognition not supported in this browser - Try Chrome or Edge');
        setIsInitialized(true);
      }
    }
  }, [isRecording, isOnline]);
  
  // Re-initialize when coming back online
  useEffect(() => {
    if (isOnline && !recognitionRef.current) {
      initializeSpeechRecognition();
    } else if (!isOnline) {
      setError('Currently offline - Speech recognition requires internet connection');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.log('Error stopping recognition when offline:', error);
        }
      }
    }
  }, [isOnline, initializeSpeechRecognition]);
  
  const startRecording = useCallback(() => {
    // Check online status first
    if (!navigator.onLine) {
      setError('No internet connection - Speech recognition requires internet access');
      
      // Offer text input as fallback
      const userInput = window.prompt(
        "You're currently offline and speech recognition requires internet connection.\n\nPlease type what you want to say:"
      );
      
      if (userInput && userInput.trim()) {
        setTranscription({
          text: userInput.trim(),
          confidence: 1.0,
          timestamp: Date.now()
        });
        setError(null);
      }
      return;
    }
    
    if (recognitionRef.current && isInitialized && !isRecording) {
      try {
        setTranscription(null);
        setError(null);
        recognitionRef.current.start();
        setIsRecording(true);
        console.log('Starting continuous speech recognition...');
      } catch (error: any) {
        // If already running, don't show error
        if (error.name === 'InvalidStateError') {
          console.log('Recognition already running');
          setIsRecording(true);
        } else {
          setError(`Failed to start speech recognition: ${error.message}`);
          console.error('Speech recognition start error:', error);
        }
      }
    }
  }, [isInitialized, isRecording]);
  
  const stopRecording = useCallback(() => {
    if (recognitionRef.current && isRecording) {
      try {
        recognitionRef.current.stop();
        setIsRecording(false);
        console.log('Stopped speech recognition');
        
        // Clear any pending timers
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
      } catch (error) {
        console.error('Error stopping recognition:', error);
        setIsRecording(false);
      }
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [isRecording]);
  
  return {
    isInitialized,
    isRecording,
    transcription,
    error,
    isOnline,
    startRecording,
    stopRecording
  };
};
