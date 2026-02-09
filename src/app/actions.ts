'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function askGemini(question: string, base64Frames: string[]) {
  try {
    // 1. Select the Gemini 3 Flash model (Optimized for speed/multimodal)
    // Note: If 'gemini-3-flash-preview' is not yet active in your region, 
    // fallback to 'gemini-2.0-flash-exp' or 'gemini-1.5-flash'.
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    // 2. Prepare the prompt parts
    // We convert the base64 strings into the format Gemini expects (inlineData)
    const promptParts = [
      ...base64Frames.map(frame => ({
        inlineData: {
          data: frame,
          mimeType: 'image/jpeg',
        },
      })),
      { text: question }, // The user's question comes last
    ];

    // 3. Generate Content
    const result = await model.generateContent(promptParts);
    const response = await result.response;
    const text = response.text();

    return { success: true, text };
    
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return { 
      success: false, 
      text: "I'm having trouble connecting to the Gemini 3 network. Please check your API key." 
    };
  }
}