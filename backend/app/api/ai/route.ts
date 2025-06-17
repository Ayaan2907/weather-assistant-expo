import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Simple cache for repeated weather conditions (keep it minimal)
const simpleCache = new Map<string, { content: string; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

function getCacheKey(weatherCode: number, temperature: number, mode: string): string {
  const roundedTemp = Math.round(temperature / 5) * 5;
  return `${mode}:${weatherCode}:${roundedTemp}`;
}

function getWeatherContext(weatherCode: number, temperature: number): string {
  if (temperature < 0) return "freezing cold";
  if (temperature < 10) return "cold";
  if (temperature > 30) return "very hot";
  if (temperature > 25) return "warm";
  
  if (weatherCode >= 51 && weatherCode <= 67) return "rainy";
  if (weatherCode >= 71 && weatherCode <= 86) return "snowy";
  if (weatherCode >= 95) return "stormy";
  if (weatherCode === 0 || weatherCode === 1) return "sunny and clear";
  
  return "mild";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { weatherCode, temperature, description, mode, userMessage, chatHistory, location } = body;
    
    // Validate required fields
    if (!weatherCode || !temperature || !mode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check simple cache for initial weather tips
    if (mode === 'initial') {
      const cacheKey = getCacheKey(weatherCode, temperature, mode);
      const cached = simpleCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return NextResponse.json({ content: cached.content, cached: true });
      }
    }

    let systemPrompt: string;
    let userPrompt: string;
    
    if (mode === 'initial') {
      // Initial weather tip - keep it simple and short
      systemPrompt = "You are a friendly weather assistant. Give brief, practical advice in exactly 2 lines.";
      userPrompt = `Current weather: ${description}, ${temperature}°C, weather code ${weatherCode}, location: ${location}.
      
      Give me a brief 2-line suggestion about what to wear and one activity recommendation or any other tips as a friend.`;
      
    } else if (mode === 'chat') {
      // Chat mode - use conversation context
      systemPrompt = `You are a helpful weather assistant. Current conditions: ${description}, ${temperature}°C (${getWeatherContext(weatherCode, temperature)}). 
      
      You're having a conversation about weather. Be friendly, helpful, and consider the current weather and location in your responses.`;
      
      // Build context from chat history (keep last 3 messages for simplicity)
      const recentHistory = chatHistory ? chatHistory.slice(-3) : [];
      const contextMessages = recentHistory
        .map((msg: any) => `${msg.isAssistant ? 'Assistant' : 'User'}: ${msg.text}`)
        .join('\n');
      
      userPrompt = `Previous conversation:
${contextMessages}

User's new message: ${userMessage}

Respond naturally, considering the current weather conditions.`;
    } else {
      return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
    }

    // Call Groq AI
    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: mode === 'initial' ? 0.7 : 0.8,
      max_tokens: mode === 'initial' ? 100 : 200,
    });

    const content = response.choices[0].message.content;

    if (!content) {
      throw new Error('No response from AI');
    }

    // Cache initial weather tips
    if (mode === 'initial') {
      const cacheKey = getCacheKey(weatherCode, temperature, mode);
      simpleCache.set(cacheKey, { content, timestamp: Date.now() });
      
      // Simple cleanup - remove old entries
      if (simpleCache.size > 50) {
        const now = Date.now();
        for (const [key, value] of simpleCache.entries()) {
          if (now - value.timestamp > CACHE_DURATION) {
            simpleCache.delete(key);
          }
        }
      }
    }

    return NextResponse.json({ 
      content,
      cached: false,
      mode 
    });

  } catch (error) {
    console.error('AI API Error:', error);
    
    try {
      const body = await request.json();
      const fallback = getFallbackMessage(body?.weatherCode || 0, body?.mode || 'initial');
      
      return NextResponse.json({
        content: fallback,
        fallback: true,
        mode: body?.mode || 'initial'
      });
    } catch {
      return NextResponse.json({
        content: "I'm having trouble right now. Please try again!",
        fallback: true,
        mode: 'initial'
      });
    }
  }
}

function getFallbackMessage(weatherCode: number, mode: string): string {
  if (mode === 'initial') {
    if (weatherCode >= 51 && weatherCode <= 67) {
      return "Looks like rain! Grab an umbrella and wear a light jacket.\nPerfect weather for a cozy indoor day with hot coffee.";
    }
    if (weatherCode >= 71 && weatherCode <= 86) {
      return "Snow day! Bundle up in warm layers and waterproof boots.\nGreat time for hot chocolate or building a snowman.";
    }
    if (weatherCode === 0 || weatherCode === 1) {
      return "Beautiful sunny weather! Light clothing and sunglasses recommended.\nPerfect for a walk in the park or outdoor activities.";
    }
    return "Check the current conditions and dress accordingly.\nGood day to plan activities based on the weather.";
  } else {
    return "I'm having trouble right now, but I'm here to help with any weather questions!";
  }
}