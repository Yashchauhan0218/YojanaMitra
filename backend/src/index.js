import app from './app.js';
import { checkDatabaseConnection } from './db/prisma.js';
import { isGeminiConfigured } from './services/llm.service.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`\n======================================================`);
  console.log(`🚀 YojanaMitra API Server running on port ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Schemes API: http://localhost:${PORT}/api/schemes`);
  console.log(`======================================================`);

  // Verify PostgreSQL connection at startup
  const dbStatus = await checkDatabaseConnection();
  if (dbStatus.connected) {
    console.log(`✅ Database: Connected to PostgreSQL via Prisma.`);
  } else {
    console.log(`⚠️  Database: PostgreSQL is not connected (${dbStatus.message}).`);
    console.log(`   Running with authenticated in-memory verified schemes dataset.`);
    console.log(`   Configure DATABASE_URL and run 'npm run prisma:migrate' when PostgreSQL is ready.`);
  }

  // Verify Gemini AI configuration at startup
  if (isGeminiConfigured()) {
    console.log(`✅ AI Engine: Google Gemini API is configured and operational.`);
  } else {
    console.log(`⚠️  AI Engine: GEMINI_API_KEY is not set in backend/.env.`);
    console.log(`   Running in offline deterministic mode with rule-based extraction.`);
    console.log(`   Add GEMINI_API_KEY in backend/.env to unlock conversational AI.`);
  }
  console.log(`======================================================\n`);
});
