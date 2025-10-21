import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { messages } = await request.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // Check if Google AI API key exists
    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json(
        { error: 'Google AI API key not configured' },
        { status: 500 }
      );
    }

    const lastMessage = messages[messages.length - 1]?.content || '';
    
    const prompt = `You are an intelligent and helpful AI assistant. The user has asked: "${lastMessage}"

Please provide a comprehensive, detailed response that:
- Explains the topic thoroughly
- Includes relevant examples or context
- Offers additional insights or related information
- Is informative yet easy to understand

Give a well-structured response of 4-6 sentences that fully addresses the user's question.`;

    // Add timeout for network requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 10 second timeout

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        }),
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.text();
      
      // Handle network errors more gracefully
      if (response.status === 0 || !response.status) {
        return NextResponse.json(
          { error: 'Network unavailable - please check your internet connection', offline: true },
          { status: 503 }
        );
      }
      
      console.error('Gemini API error:', response.status, errorData);
      throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
    
    return NextResponse.json({ reply });
  } catch (apiError: any) {
    console.error('Complete API error:', apiError);
    
    // Handle network timeout/abort errors
    if (apiError.name === 'AbortError' || apiError.message.includes('fetch')) {
      return NextResponse.json(
        { 
          error: 'Unable to connect to AI service. Please check your internet connection and try again.',
          offline: true 
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: `Failed to process request: ${apiError.message}` },
      { status: 500 }
    );
  }
}
