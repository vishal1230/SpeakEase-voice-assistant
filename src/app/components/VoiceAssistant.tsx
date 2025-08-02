'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useWhisper } from '../hooks/useWhisper';
import { useTTS } from '../hooks/useTTS';
import { AudioRecorder } from './AudioRecorder';
import { LatencyMonitor } from './LatencyMonitor';
import { LatencyMetrics } from '../../types/audio';

export const VoiceAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [conversation, setConversation] = useState<string[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<LatencyMetrics | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [textInput, setTextInput] = useState('');
  const [conversationInput, setConversationInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [responseLength, setResponseLength] = useState<'short' | 'long'>('long');
  const conversationEndRef = useRef<HTMLDivElement>(null);
  
  const whisper = useWhisper();
  const tts = useTTS();
  
  const handleAudioData = useCallback((audioData: Float32Array) => {
    // Audio data handling
  }, []);
  
  const sendToGemini = useCallback(async (text: string): Promise<string> => {
    const apiStartTime = Date.now();
    setIsTyping(true);
    
    const systemPrompts = {
      short: 'You are a helpful voice assistant. Keep responses concise and natural for speech (1-2 sentences).',
      long: 'You are a knowledgeable AI assistant. Provide detailed, comprehensive responses with explanations, examples, and context. Make your answers informative and thorough while remaining engaging and easy to understand. Aim for responses that are 4-6 sentences long with rich detail.'
    };
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompts[responseLength] },
            { role: 'user', content: text }
          ]
        }),
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      const apiLatency = Date.now() - apiStartTime;
      
      setCurrentMetrics(prev => prev ? {
        ...prev,
        apiLatency
      } : null);
      
      return data.reply;
    } catch (error) {
      console.error('Gemini API error:', error);
      return 'Sorry, I encountered an error processing your request.';
    } finally {
      setIsTyping(false);
    }
  }, [responseLength]);
  
  const processText = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    setConversation(prev => [...prev, `User: ${text}`]);
    
    const reply = await sendToGemini(text);
    setConversation(prev => [...prev, `Assistant: ${reply}`]);
    tts.synthesize(reply);
  }, [sendToGemini, tts.synthesize]);
  
  // Handle transcription results
  useEffect(() => {
    if (whisper.transcription && whisper.transcription.text.trim()) {
      const sttLatency = Date.now() - startTime;
      
      setCurrentMetrics({
        sttLatency,
        apiLatency: 0,
        ttsLatency: 0,
        totalLatency: 0
      });
      
      processText(whisper.transcription.text);
    }
  }, [whisper.transcription, processText, startTime]);
  
  // Auto scroll to bottom of conversation
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);
  
  const toggleRecording = useCallback(() => {
    if (!isActive) {
      setStartTime(Date.now());
      whisper.startRecording();
      setIsActive(true);
    } else {
      whisper.stopRecording();
      setIsActive(false);
    }
  }, [isActive, whisper.startRecording, whisper.stopRecording]);
  
  const handleTextSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      processText(textInput);
      setTextInput('');
    }
  }, [textInput, processText]);
  
  const handleConversationSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (conversationInput.trim()) {
      processText(conversationInput);
      setConversationInput('');
    }
  }, [conversationInput, processText]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              SpeakEase
            </h1>
            <p className="text-gray-600 max-w-md mx-auto">
              Speak naturally or type to have intelligent conversations powered by Google Gemini AI
            </p>
            
            {/* Status Indicators */}
            <div className="flex justify-center items-center gap-6 mt-6">
              <div className="flex items-center gap-2 px-3 py-2 bg-white/60 rounded-full shadow-sm">
                <div className={`w-3 h-3 rounded-full ${
                  whisper.isInitialized ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`}></div>
                <span className="text-sm font-medium text-gray-700">
                  Speech {whisper.isInitialized ? 'Ready' : 'Loading'}
                </span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-2 bg-white/60 rounded-full shadow-sm">
                <div className={`w-3 h-3 rounded-full ${
                  tts.isInitialized ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`}></div>
                <span className="text-sm font-medium text-gray-700">
                  TTS {tts.isInitialized ? 'Ready' : 'Loading'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1">
            {/* Voice Input */}
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Voice Input</h3>
              <div className="text-center">
                <button
                  onClick={toggleRecording}
                  disabled={!whisper.isInitialized || !tts.isInitialized}
                  className={`w-24 h-24 rounded-full text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${
                    isActive 
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 focus:ring-red-500 animate-pulse shadow-xl' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:ring-blue-500 shadow-lg'
                  } disabled:bg-gray-400 disabled:transform-none disabled:cursor-not-allowed`}
                >
                  {isActive ? (
                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  )}
                </button>
                <p className="mt-4 text-sm text-gray-600">
                  {isActive ? 'Recording... Click to stop' : 'Click to start speaking'}
                </p>
              </div>
            </div>
            
            {/* Response Length Control */}
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Response Style</h3>
              <div className="flex bg-gray-100 rounded-2xl p-1">
                <button
                  onClick={() => setResponseLength('short')}
                  className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    responseLength === 'short'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Brief
                </button>
                <button
                  onClick={() => setResponseLength('long')}
                  className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    responseLength === 'long'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Detailed
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                {responseLength === 'short' ? 'Quick, concise answers' : 'Comprehensive, detailed responses'}
              </p>
            </div>
            
            {/* Quick Text Input */}
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Message</h3>
              <form onSubmit={handleTextSubmit} className="space-y-3">
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white/80 backdrop-blur-sm"
                  rows={3}
                />
                <button
                  type="submit"
                  disabled={!textInput.trim()}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-2xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  Send Message
                </button>
              </form>
            </div>
            
            {/* Performance Monitor */}
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20">
              <LatencyMonitor metrics={currentMetrics} />
            </div>
          </div>
          
          {/* Right Column - Conversation */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white/20 overflow-hidden h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Conversation
                </h3>
              </div>
              
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {conversation.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-gray-400 text-lg">Start a conversation!</p>
                    <p className="text-gray-300 text-sm mt-2">Use voice input, quick message, or type directly below</p>
                  </div>
                ) : (
                  conversation.map((message, index) => {
                    const isUser = message.startsWith('User:');
                    const content = message.replace(/^(User:|Assistant:)\s/, '');
                    
                    return (
                      <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-sm lg:max-w-lg px-4 py-3 rounded-2xl shadow-sm ${
                          isUser 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-sm' 
                            : 'bg-white/80 text-gray-800 rounded-bl-sm border border-gray-100'
                        }`}>
                          <div className="flex items-start gap-2">
                            {!isUser && (
                              <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{content}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-sm lg:max-w-lg px-4 py-3 rounded-2xl bg-white/80 text-gray-800 rounded-bl-sm border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={conversationEndRef} />
              </div>
              
              {/* Direct Input in Conversation */}
              <div className="px-6 py-4 border-t border-gray-200/50 bg-white/50">
                <form onSubmit={handleConversationSubmit} className="flex gap-3">
                  <input
                    type="text"
                    value={conversationInput}
                    onChange={(e) => setConversationInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  />
                  <button
                    type="submit"
                    disabled={!conversationInput.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-2xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <AudioRecorder 
        onAudioData={handleAudioData}
        isRecording={whisper.isRecording}
      />
      
      {/* Error Display */}
      {(whisper.error || tts.error) && (
        <div className="fixed bottom-4 right-4 max-w-sm bg-red-500/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-xl border border-red-400/20">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-200 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="text-sm font-medium">Error</p>
              <p className="text-xs mt-1 text-red-100">{whisper.error || tts.error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
