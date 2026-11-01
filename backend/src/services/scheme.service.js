import { prisma, checkDatabaseConnection } from '../db/prisma.js';
import { VERIFIED_SCHEMES } from '../data/verifiedSchemes.js';

/**
 * Retrieves all published schemes with optional filtering by category, search text, or state.
 */
export async function getSchemes({ category, search, state, limit = 50, offset = 0 } = {}) {
  const dbHealth = await checkDatabaseConnection();

  if (dbHealth.connected) {
    try {
      const where = {
        status: 'PUBLISHED',
      };

      if (category && category !== 'All') {
        where.category = { equals: category, mode: 'insensitive' };
      }

      if (state) {
        where.OR = [{ state: null }, { state: { equals: state, mode: 'insensitive' } }];
      }

      if (search && search.trim()) {
        const query = search.trim();
        where.OR = [
          ...(where.OR || []),
          { titleEn: { contains: query, mode: 'insensitive' } },
          { titleHi: { contains: query, mode: 'insensitive' } },
          { summaryEn: { contains: query, mode: 'insensitive' } },
          { summaryHi: { contains: query, mode: 'insensitive' } },
          { code: { contains: query, mode: 'insensitive' } },
        ];
      }

      const [schemes, total] = await Promise.all([
        prisma.scheme.findMany({
          where,
          include: {
            criteria: true,
            sources: true,
          },
          take: Number(limit),
          skip: Number(offset),
          orderBy: { createdAt: 'desc' },
        }),
        prisma.scheme.count({ where }),
      ]);

      return {
        schemes,
        total,
        source: 'database',
      };
    } catch (dbError) {
      console.warn('Database query failed, falling back to verified dataset:', dbError.message);
    }
  }

  // In-memory verified dataset fallback
  let list = VERIFIED_SCHEMES.filter((s) => s.status === 'PUBLISHED');

  if (category && category !== 'All') {
    list = list.filter((s) => s.category.toLowerCase() === category.toLowerCase());
  }

  if (state) {
    list = list.filter((s) => !s.state || s.state.toLowerCase() === state.toLowerCase());
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(
      (s) =>
        s.titleEn.toLowerCase().includes(q) ||
        s.titleHi.toLowerCase().includes(q) ||
        s.summaryEn.toLowerCase().includes(q) ||
        s.summaryHi.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q)
    );
  }

  const paginated = list.slice(Number(offset), Number(offset) + Number(limit));

  return {
    schemes: paginated,
    total: list.length,
    source: 'in_memory_verified_cache',
  };
}

/**
 * Retrieves a single scheme by ID or Code.
 */
export async function getSchemeByIdOrCode(identifier) {
  const dbHealth = await checkDatabaseConnection();

  if (dbHealth.connected) {
    try {
      const scheme = await prisma.scheme.findFirst({
        where: {
          OR: [{ id: identifier }, { code: identifier }],
        },
        include: {
          criteria: true,
          sources: true,
        },
      });

      if (scheme) return { scheme, source: 'database' };
    } catch (err) {
      console.warn('DB lookup failed, trying verified fallback:', err.message);
    }
  }

  const found = VERIFIED_SCHEMES.find(
    (s) =>
      s.id.toLowerCase() === identifier.toLowerCase() ||
      s.code.toLowerCase() === identifier.toLowerCase()
  );

  return {
    scheme: found || null,
    source: 'in_memory_verified_cache',
  };
}

/**
 * Get distinct categories available in schemes.
 */
export async function getCategories() {
  const result = await getSchemes({ limit: 1000 });
  const categories = [...new Set(result.schemes.map((s) => s.category))].sort();
  return categories;
}
