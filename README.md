# SpeakEase - AI Voice Assistant - Next.js PWA

A modern, feature-rich voice assistant built with Next.js 14, TypeScript, and Google Gemini AI. This Progressive Web App (PWA) provides offline capabilities, real-time speech processing, and intelligent conversational AI responses.

## 🚀 Live Demo

🌐 **Deployed on Netlify:**  
[https://speakease-voice-assistant.netlify.app/](https://speakease-voice-assistant.netlify.app/)

## 🌟 Features

- **🎤 Multiple Input Methods**: Voice recording, quick text input, and direct chat interface
- **🤖 AI-Powered Responses**: Integrated with Google Gemini AI for intelligent conversations
- **🔊 Text-to-Speech**: Built-in speech synthesis for audio responses
- **📱 Progressive Web App**: Installable with offline functionality
- **⚡ Real-time Performance**: Latency monitoring and optimization
- **🎨 Modern UI/UX**: Beautiful glassmorphism design with responsive layout
- **🔄 Response Modes**: Toggle between brief and detailed AI responses
- **📊 Performance Metrics**: Real-time tracking of speech recognition, API, and TTS latencies
- **🎯 Continuous Speech**: Seamless conversation flow without manual restarts
- **🌐 Offline Support**: Graceful fallback to text input when offline

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom glassmorphism design
- **AI Integration**: Google Gemini 1.5 Flash API
- **Speech Processing**: Web Speech API for recognition and synthesis
- **PWA**: Service Worker with caching strategies
- **Audio Processing**: Web Workers for background processing

## 📋 Prerequisites

- Node.js 16.0 or higher
- npm or yarn package manager
- Google AI API key (free tier available)
- Modern web browser (Chrome/Edge recommended for best speech recognition)

## 🚀 Getting Started

### 1. Clone the Repository

### 2. Install Dependencies

### 3. Environment Setup

Create a `.env.local` file in the project root:

### 4. Configuration Files

Ensure these configuration files exist in your project root:

**postcss.config.js**
**tailwind.config.js**

### 5. Run the Development Server

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure
```
next-stt-app/
├── public/
│ ├── manifest.json # PWA manifest
│ ├── icon-192.png # App icons
│ └── icon-512.png
├── src/
│ ├── app/
│ │ ├── api/
│ │ │ └── chat/
│ │ │ └── route.ts # Google Gemini API integration
│ │ ├── components/
│ │ │ ├── AudioRecorder.tsx # Audio recording component
│ │ │ ├── LatencyMonitor.tsx # Performance monitoring
│ │ │ └── VoiceAssistant.tsx # Main chat interface
│ │ ├── hooks/
│ │ │ ├── useWhisper.ts # Speech recognition hook
│ │ │ └── useTTS.ts # Text-to-speech hook
│ │ ├── workers/
│ │ │ ├── whisper.worker.ts # Speech processing worker
│ │ │ └── tts.worker.ts # TTS processing worker
│ │ ├── globals.css # Global styles
│ │ ├── layout.tsx # App layout
│ │ └── page.tsx # Main page
│ └── types/
│ └── audio.ts # TypeScript type definitions
├── .env.local # Environment variables
├── next.config.js # Next.js configuration
├── package.json # Dependencies
├── postcss.config.js # PostCSS configuration
├── tailwind.config.js # Tailwind CSS configuration
└── tsconfig.json # TypeScript configuration
```

## 🎯 Usage

### Voice Input
1. Click the **"Talk"** button in the left sidebar
2. Allow microphone permissions when prompted
3. Start speaking - the system will continuously listen
4. Speak multiple questions in sequence without clicking again
5. Click **"Stop"** when you finish the conversation

### Text Input Options
1. **Quick Message**: Use the textarea in the left sidebar for longer messages
2. **Direct Chat**: Type directly in the conversation box at the bottom for instant messaging

### Response Modes
- **Brief**: Concise, 1-2 sentence responses for quick interactions
- **Detailed**: Comprehensive, 4-6 sentence responses with examples and context

### Performance Monitoring
View real-time metrics in the Performance panel:
- Speech Recognition latency
- AI API response time
- Text-to-Speech processing time
- Total response time

## 🔧 API Integration

The app uses Google Gemini 1.5 Flash API for AI responses. Key configuration:

## ⚡ Performance Targets

The app aims for optimal performance metrics:
- **Total Response Time**: < 1200ms
- **Speech Recognition**: Real-time continuous processing
- **API Response**: < 2000ms
- **TTS Generation**: < 500ms

**Recommended**: Chrome or Edge for best experience with continuous speech recognition

## 🐛 Troubleshooting

### Common Issues

**Speech Recognition Not Working**
- Ensure you're using Chrome or Edge
- Access via `http://localhost:3000` (not IP address)
- Check microphone permissions
- Verify stable internet connection

**Continuous Recognition Stops**
- Check browser console for errors
- Ensure microphone stays connected
- Verify internet connection remains stable
- Try refreshing the page and restarting

**API Errors**
- Verify Google AI API key is correctly set in `.env.local`
- Check API key has sufficient quota
- Ensure API key has proper permissions

**Build Failures**
- Clear cache: `rm -rf .next node_modules package-lock.json`
- Reinstall dependencies: `npm install`
- Check all configuration files are present

## 🎨 Key Features Highlight

### Continuous Speech Recognition
- **Start once, talk continuously**: No need to restart for each question
- **Natural conversation flow**: Like talking to a real assistant
- **Auto-recovery**: Handles network interruptions gracefully
- **Smart silence detection**: Processes speech when you finish talking

### Multiple Input Methods
- **Voice Input**: Continuous speech recognition with auto-restart
- **Quick Message**: Textarea for longer, structured messages
- **Direct Chat**: Instant messaging style input at bottom of conversation

### Aesthetic Interface
- **Glassmorphism design**: Modern, translucent interface elements
- **Gradient themes**: Beautiful blue-purple color schemes
- **Responsive layout**: Works perfectly on all device sizes
- **Smooth animations**: Professional-grade transitions and effects

### Intelligent Response System
- **Brief mode**: Quick, concise answers (1-2 sentences)
- **Detailed mode**: Comprehensive responses (4-6 sentences)
- **Context awareness**: Maintains conversation context
- **Real-time typing indicators**: Shows when AI is thinking

## 🎯 Demo Instructions

1. **Start the application**: `npm run dev`
2. **Click "Talk"**: Begin continuous speech recognition
3. **Ask multiple questions**: No need to restart between questions
4. **Try different modes**: Switch between Brief and Detailed responses
5. **Test offline**: Disconnect internet to see offline fallback
6. **Show performance**: Monitor real-time latency metrics

**Built with ❤️ for modern web development and conversational AI**
