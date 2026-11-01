import { Router } from 'express';
import { checkDatabaseConnection } from '../db/prisma.js';
import { isGeminiConfigured, getGeminiModel } from '../services/llm.service.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const dbStatus = await checkDatabaseConnection();
    const aiConfigured = isGeminiConfigured();

    const response = {
      status: 'UP',
      service: 'YojanaMitra Backend API',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
      database: {
        connected: dbStatus.connected,
        message: dbStatus.message,
      },
      ai: {
        provider: 'Google Gemini',
        sdk: '@google/genai',
        configured: aiConfigured,
        model: getGeminiModel(),
        message: aiConfigured
          ? 'Gemini API key configured and ready.'
          : 'Gemini API key not configured. Offline rule-engine and deterministic extractors active.',
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
