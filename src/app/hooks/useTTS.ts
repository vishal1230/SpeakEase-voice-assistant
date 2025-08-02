import { useCallback, useEffect, useRef, useState } from 'react';

export const useTTS = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const workerRef = useRef<Worker | null>(null);
  
  useEffect(() => {
    // Only initialize on client side
    if (typeof window === 'undefined') return;
    
    try {
      workerRef.current = new Worker(
        new URL('../workers/tts.worker.ts', import.meta.url)
      );
      
      workerRef.current.onmessage = (event) => {
        const { type, data } = event.data;
        
        switch (type) {
          case 'INITIALIZED':
            setIsInitialized(true);
            setError(null);
            break;
          case 'SYNTHESIS_COMPLETE':
            playAudio(data.text);
            setIsSynthesizing(false);
            break;
          case 'ERROR':
            setError(data.message);
            setIsSynthesizing(false);
            break;
        }
      };
      
      workerRef.current.onerror = (error) => {
        setError('TTS worker initialization failed');
        console.error('TTS Worker error:', error);
      };
      
      // Initialize the worker
      workerRef.current.postMessage({ type: 'INIT' });
    } catch (err) {
      setError('Failed to initialize TTS worker');
      console.error('TTS initialization error:', err);
    }
    
    return () => {
      workerRef.current?.terminate();
    };
  }, []);
  
  const synthesize = useCallback((text: string) => {
    if (workerRef.current && isInitialized) {
      setIsSynthesizing(true);
      workerRef.current.postMessage({ 
        type: 'SYNTHESIZE', 
        data: { text } 
      });
    } else {
      // Fallback to direct Web Speech API
      playAudio(text);
    }
  }, [isInitialized]);
  
  const playAudio = useCallback((text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }, []);
  
  return {
    isInitialized,
    isSynthesizing,
    error,
    synthesize
  };
};
