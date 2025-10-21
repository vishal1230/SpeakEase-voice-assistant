import { useCallback, useEffect, useState } from 'react';

export const useTTS = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        setIsInitialized(true);
        setError(null);
      } else {
        setError('Text-to-speech not supported in this browser');
      }
    }
  }, []);
  
  const synthesize = useCallback((text: string) => {
    if (!isInitialized || !text.trim()) return;
    
    try {
      setIsSynthesizing(true);
      setError(null);
      
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        utterance.lang = 'en-US';
        
        utterance.onstart = () => {
          console.log('TTS started');
        };
        
        utterance.onend = () => {
          setIsSynthesizing(false);
          console.log('TTS completed');
        };
        
        // --- THIS IS THE UPDATED PART ---
        utterance.onerror = (event) => {
          // Ignore the 'interrupted' error, since we cause it intentionally.
          if (event.error === 'interrupted') {
            console.log('TTS intentionally interrupted');
            // We also need to ensure the synthesizing state is false here
            setIsSynthesizing(false);
            return; 
          }
          
          setIsSynthesizing(false);
          setError(`TTS error: ${event.error}`);
          console.error('TTS error:', event);
        };
        
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      setIsSynthesizing(false);
      setError('Failed to synthesize speech');
      console.error('TTS synthesis error:', error);
    }
  }, [isInitialized]);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSynthesizing(false);
    }
  }, []);
  
  return {
    isInitialized,
    isSynthesizing,
    error,
    synthesize,
    stop
  };
};