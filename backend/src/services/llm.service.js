import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

let clientInstance = null;

export function isGeminiConfigured() {
  const apiKey = process.env.GEMINI_API_KEY;
  return Boolean(apiKey && apiKey.trim() !== '' && !apiKey.includes('your-gemini-api-key'));
}

export function getGeminiModel() {
  return process.env.GEMINI_MODEL || 'gemini-2.5-flash';
}

export function getGeminiClient() {
  if (!isGeminiConfigured()) {
    throw new Error(
      'Gemini API key is not configured. Please set a valid GEMINI_API_KEY in backend/.env to enable AI features.'
    );
  }

  if (!clientInstance) {
    clientInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  return clientInstance;
}

/**
 * Generate content using Gemini.
 * @param {Object} options
 * @param {string} options.prompt - Main user prompt
 * @param {string} [options.systemInstruction] - System instruction
 * @param {Object} [options.responseSchema] - Optional JSON Schema for structured output
 * @param {number} [options.temperature] - Sampling temperature
 */
export async function generateContent({
  prompt,
  systemInstruction,
  responseSchema,
  temperature = 0.2,
}) {
  const client = getGeminiClient();
  const model = getGeminiModel();

  const config = {
    temperature,
  };

  if (systemInstruction) {
    config.systemInstruction = systemInstruction;
  }

  if (responseSchema) {
    config.responseMimeType = 'application/json';
    config.responseSchema = responseSchema;
  }

  const response = await client.models.generateContent({
    model,
    contents: prompt,
    config,
  });

  return {
    text: response.text,
    raw: response,
  };
}
