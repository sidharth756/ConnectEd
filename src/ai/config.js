import dotenv from 'dotenv';
dotenv.config();

export const config = {
  geminiApiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '',
  modelName: process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest',
};
