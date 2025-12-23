# SpeakEase - AI Voice Assistant - Next.js PWA

SpeakEase is a sophisticated, web-based AI voice assistant designed to showcase the power of modern frontend technologies, real-time speech processing, and seamless integration with large language models. This project demonstrates a complete, end-to-end application with user authentication, persistent state, and a focus on an intuitive, voice-first user experience.

## 🚀 Live Demo

🌐 **Deployed on Netlify:** [https://speakease-voice-assistant.netlify.app/](https://speakease-voice-assistant.netlify.app/)

## ✨ Why SpeakEase?

This project is more than just a chatbot; it's a practical demonstration of building a modern, full-featured web application. It was created to explore the intersection of:

  * **Conversational AI:** Integrating Google's powerful Gemini Pro model to create natural and intelligent human-computer interactions.
  * **Progressive Web Apps (PWAs):** Building an installable, app-like experience that works seamlessly across devices, complete with offline support.
  * **Secure Authentication:** Implementing industry-standard OAuth with NextAuth.js to provide personalized and secure user sessions.
  * **User-Centric Design:** Focusing on user controls, such as audio toggles, conversation management, and real-time performance feedback.

## 🌟 Features

  - **🔐 Google OAuth Authentication**: Securely sign in with your Google account for a personalized experience.
  - **💾 Persistent Chat History**: Conversations are automatically saved to your browser and restored when you log back in.
  - **🗑️ Conversation Management**: Includes the ability to delete your saved conversation history.
  - **🎤 Multiple Input Methods**: Voice recording, quick text input, and direct chat interface.
  - **🤖 AI-Powered Responses**: Integrated with Google Gemini Pro for intelligent conversations.
  - **🔊 Text-to-Speech Controls**:
      - **🔇 Audio Toggle**: Enable or disable the AI's voice response.
      - **🛑 Stop Playback**: Instantly interrupt and stop the AI's voice while it's speaking.
  - **📱 Progressive Web App**: Installable with offline functionality.
  - **⚡ Real-time Performance**: Latency monitoring and optimization.
  - **🎨 Modern UI/UX**: Beautiful glassmorphism design with a responsive layout.
  - **🔄 Response Modes**: Toggle between brief and detailed AI responses.

## 🛠️ Tech Stack

  - **Frontend**: Next.js 14, React 18, TypeScript
  - **Authentication**: NextAuth.js (Auth.js)
  - **Styling**: Tailwind CSS
  - **AI Integration**: Google Gemini Pro API
  - **Speech Processing**: Web Speech API for recognition and synthesis
  - **PWA**: `@ducanh2912/next-pwa`

## 📋 Prerequisites

  - Node.js 18.0 or higher
  - npm or yarn package manager
  - **Google Cloud Project** with the following enabled:
      - **Gemini API** (or Generative Language API)
      - **OAuth 2.0 Credentials** (Client ID & Client Secret)
  - Modern web browser (Chrome/Edge recommended for best speech recognition)

## 🚀 Getting Started

### 1\. Clone the Repository

```bash
git clone https://github.com/your-username/speakease-voice-assistant.git
cd speakease-voice-assistant
```

### 2\. Install Dependencies

```bash
npm install
```

### 3\. Environment Setup

Create a `.env.local` file in the project root and add your secret keys.

```
# Google AI API Key
GOOGLE_AI_API_KEY="YOUR_GEMINI_API_KEY"

# Google OAuth Credentials
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"

# NextAuth.js Configuration
# Generate a secret key with: openssl rand -base64 32
NEXTAUTH_SECRET="YOUR_GENERATED_NEXTAUTH_SECRET"
NEXTAUTH_URL="http://localhost:3000"
```

### 4\. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
speakease-voice-assistant/
├── public/
│   └── manifest.json
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/  # NextAuth.js dynamic route
│   │   │   │   └── route.ts
│   │   │   └── chat/                 # Gemini API route
│   │   │       └── route.ts
│   │   ├── components/
│   │   │   ├── AuthProvider.tsx      # Session provider for NextAuth
│   │   │   ├── LoginButton.tsx       # Sign In/Out UI component
│   │   │   └── VoiceAssistant.tsx    # Main chat interface
│   │   ├── hooks/
│   │   │   ├── useWhisper.ts         # Speech recognition hook
│   │   │   └── useTTS.ts             # Text-to-speech hook
│   │   └── ... (globals.css, layout.tsx, page.tsx)
│   ├── lib/
│   │   └── auth.ts                   # Shared NextAuth configuration
│   └── types/
│       └── audio.ts
├── .env.local                        # Environment variables
├── next.config.js
├── package.json
└── tsconfig.json
```

## 🎯 Usage

### Authentication

1.  Click the **"Sign In with Google"** button in the top-right corner.
2.  Complete the Google authentication flow.
3.  Your conversation will now be saved. When you sign out, the conversation will be cleared from the screen.

### Voice and Text Input

  - **Voice**: Click the microphone button to start continuous listening.
  - **Text**: Use the "Quick Message" box or type directly into the conversation panel.

### Audio Controls

  - **Toggle AI Voice**: Use the "Audio Output" switch on the left panel to turn the AI's voice on or off.
  - **Stop Playback**: When the AI is speaking, a "Stop Audio" button will appear below the microphone. Click it to interrupt the playback immediately.

## 🐛 Troubleshooting

### Common Issues

**Speech Recognition Not Working**

  - Ensure you're using Chrome or Edge.
  - Access via `http://localhost:3000` (not an IP address).
  - Check microphone permissions in your browser.

**API Errors**

  - Verify all environment variables in `.env.local` are correct and the server has been restarted.
  - Ensure the Gemini API is enabled in your Google Cloud Project.
  - Ensure your Google Cloud Project has an active billing account linked.

**Build Failures**

  - Clear cache: `rm -rf .next node_modules`
  - Reinstall dependencies: `npm install`

**Built with ❤️ for modern web development and conversational AI**
