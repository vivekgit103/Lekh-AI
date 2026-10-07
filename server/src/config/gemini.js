import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

export const isGeminiConfigured = Boolean(apiKey && apiKey.trim().length > 10 && !apiKey.includes('your_gemini'));

if (isGeminiConfigured) {
  console.log('✅ Google Gemini API configured');
} else {
  console.log('ℹ️ Gemini API key not found. Using intelligent demo fallback engine.');
}

const genAI = isGeminiConfigured ? new GoogleGenerativeAI(apiKey.trim()) : null;

export const getGeminiModel = (modelName = 'gemini-3.5-flash-lite') => {
  if (!genAI) return null;
  return genAI.getGenerativeModel({ model: modelName });
};
