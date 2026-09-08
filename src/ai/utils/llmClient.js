import { config } from '../config.js';

/**
 * Call Gemini API using native fetch with structured JSON response.
 * Fallback to keyword matching if API key is missing or offline.
 * 
 * @param {string} prompt - Prompt instruction for Gemini
 * @param {Object} jsonSchema - Expected Zod schema or JSON format description
 * @returns {Promise<Object>} Parsed JSON object from model response
 */
export async function generateStructuredJson(prompt, schema) {
  const apiKey = config.geminiApiKey;

  if (!apiKey) {
    console.warn('[AI Engine] GEMINI_API_KEY is not set in environment. Operating in offline fallback mode.');
    return null;
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.modelName}:generateContent?key=${apiKey}`;
    
    const requestBody = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[AI Engine] Gemini API call failed (${response.status}):`, errorText);
      return null;
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      console.warn('[AI Engine] Empty text response received from Gemini.');
      return null;
    }

    const parsedData = JSON.parse(candidateText);

    // Validate with Zod schema if provided
    if (schema && typeof schema.parse === 'function') {
      return schema.parse(parsedData);
    }

    return parsedData;
  } catch (error) {
    console.error('[AI Engine] Exception in generateStructuredJson:', error.message);
    return null;
  }
}
