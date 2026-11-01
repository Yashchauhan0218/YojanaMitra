import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';

import healthRoutes from './routes/health.routes.js';
import schemesRoutes from './routes/schemes.routes.js';
import profileRoutes from './routes/profile.routes.js';
import eligibilityRoutes from './routes/eligibility.routes.js';
import chatRoutes from './routes/chat.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Security Middleware
app.use(helmet());

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in local development
    },
    credentials: true,
  })
);

// Rate Limiting (150 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'TOO_MANY_REQUESTS',
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
});
app.use('/api/', limiter);

// Request parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/schemes', schemesRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/eligibility', eligibilityRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: `Resource '${req.method} ${req.originalUrl}' not found on YojanaMitra API.`,
  });
});

// Centralized Error Handling
app.use(errorHandler);

export default app;
