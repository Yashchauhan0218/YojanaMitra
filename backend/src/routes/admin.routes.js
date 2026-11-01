import { Router } from 'express';
import { prisma, checkDatabaseConnection } from '../db/prisma.js';
import { requireAdminAuth } from '../middleware/auth.js';
import { VERIFIED_SCHEMES } from '../data/verifiedSchemes.js';
import { validateRequest } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();

// In-memory audit log fallback for development when DB is offline
const inMemoryAuditLogs = [];

const createSchemeSchema = z.object({
  code: z.string().min(2),
  titleEn: z.string().min(3),
  titleHi: z.string().min(3),
  summaryEn: z.string().min(10),
  summaryHi: z.string().min(10),
  benefitsEn: z.string().min(5),
  benefitsHi: z.string().min(5),
  category: z.string().min(2),
  level: z.enum(['CENTRAL', 'STATE']).default('CENTRAL'),
  state: z.string().nullable().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  sourceUrl: z.string().url(),
  applicationUrl: z.string().url().nullable().optional(),
  criteria: z
    .array(
      z.object({
        field: z.string(),
        operator: z.enum(['eq', 'neq', 'gte', 'gt', 'lte', 'lt', 'in', 'not_in', 'exists']),
        value: z.any(),
        labelEn: z.string(),
        labelHi: z.string(),
        isMandatory: z.boolean().default(true),
      })
    )
    .optional()
    .default([]),
});

const updateStatusSchema = z.object({
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
});

// List all schemes (including drafts)
router.get('/schemes', async (req, res, next) => {
  try {
    const dbStatus = await checkDatabaseConnection();
    if (dbStatus.connected) {
      const schemes = await prisma.scheme.findMany({
        include: { criteria: true, sources: true },
        orderBy: { updatedAt: 'desc' },
      });
      return res.json({ schemes, source: 'database' });
    }

    res.json({ schemes: VERIFIED_SCHEMES, source: 'in_memory_verified_cache' });
  } catch (error) {
    next(error);
  }
});

// Create a new scheme (Admin Auth Protected)
router.post(
  '/schemes',
  requireAdminAuth,
  validateRequest({ body: createSchemeSchema }),
  async (req, res, next) => {
    try {
      const { criteria, ...schemeData } = req.body;
      const dbStatus = await checkDatabaseConnection();

      if (dbStatus.connected) {
        const created = await prisma.scheme.create({
          data: {
            ...schemeData,
            criteria: {
              create: criteria,
            },
            sources: {
              create: {
                title: `${schemeData.titleEn} Official Portal`,
                url: schemeData.sourceUrl,
                sourceType: 'GOVERNMENT_PORTAL',
              },
            },
          },
          include: { criteria: true, sources: true },
        });

        await prisma.adminAuditLog.create({
          data: {
            adminAction: 'CREATE_SCHEME',
            entityId: created.id,
            entityType: 'Scheme',
            performedBy: 'admin',
            metadata: { code: created.code, titleEn: created.titleEn },
          },
        });

        return res.status(201).json({
          message: 'Scheme created successfully.',
          scheme: created,
        });
      }

      // Offline in-memory fallback
      const newScheme = {
        id: `custom-${Date.now()}`,
        ...schemeData,
        criteria,
        verifiedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      VERIFIED_SCHEMES.unshift(newScheme);

      inMemoryAuditLogs.unshift({
        id: `log-${Date.now()}`,
        adminAction: 'CREATE_SCHEME',
        entityId: newScheme.id,
        entityType: 'Scheme',
        performedBy: 'admin',
        metadata: { code: newScheme.code },
        timestamp: new Date(),
      });

      res.status(201).json({
        message: 'Scheme created in memory cache (Database offline).',
        scheme: newScheme,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update scheme publishing status (Admin Auth Protected)
router.patch(
  '/schemes/:id/status',
  requireAdminAuth,
  validateRequest({ body: updateStatusSchema }),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const dbStatus = await checkDatabaseConnection();

      if (dbStatus.connected) {
        const updated = await prisma.scheme.update({
          where: { id },
          data: { status },
        });

        await prisma.adminAuditLog.create({
          data: {
            adminAction: 'UPDATE_STATUS',
            entityId: id,
            entityType: 'Scheme',
            performedBy: 'admin',
            metadata: { newStatus: status },
          },
        });

        return res.json({ message: 'Status updated successfully.', scheme: updated });
      }

      const found = VERIFIED_SCHEMES.find((s) => s.id === id || s.code === id);
      if (!found) {
        return res.status(404).json({ error: 'NOT_FOUND', message: 'Scheme not found.' });
      }
      found.status = status;

      inMemoryAuditLogs.unshift({
        id: `log-${Date.now()}`,
        adminAction: 'UPDATE_STATUS',
        entityId: id,
        entityType: 'Scheme',
        performedBy: 'admin',
        metadata: { newStatus: status },
        timestamp: new Date(),
      });

      res.json({ message: 'Status updated in memory.', scheme: found });
    } catch (error) {
      next(error);
    }
  }
);

// View Audit Logs
router.get('/audit-logs', async (req, res, next) => {
  try {
    const dbStatus = await checkDatabaseConnection();
    if (dbStatus.connected) {
      const logs = await prisma.adminAuditLog.findMany({
        orderBy: { timestamp: 'desc' },
        take: 100,
      });
      return res.json({ logs });
    }

    res.json({ logs: inMemoryAuditLogs });
  } catch (error) {
    next(error);
  }
});

export default router;
