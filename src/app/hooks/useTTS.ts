import { useCallback, useEffect, useState } from 'react';

export const useTTS = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Initialize TTS without worker for Netlify compatibility
    if (typeof window !== 'undefined') {
      // Check if browser supports speech synthesis
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
      
      // Use Web Speech API directly (no worker)
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        // Cancel any ongoing speech
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
        
        utterance.onerror = (event) => {
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
  
  return {
    isInitialized,
    isSynthesizing,
    error,
    synthesize
  };
};
