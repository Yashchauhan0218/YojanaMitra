import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

/**
 * Check if the PostgreSQL database is reachable.
 * Never claims to be connected without executing a verification query.
 */
export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      connected: true,
      message: 'PostgreSQL connection verified successfully.',
    };
  } catch (error) {
    return {
      connected: false,
      message: error instanceof Error ? error.message : 'Database connection failed.',
    };
  }
}
