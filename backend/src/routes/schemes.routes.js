import { Router } from 'express';
import { getSchemes, getSchemeByIdOrCode, getCategories } from '../services/scheme.service.js';
import { z } from 'zod';
import { validateRequest } from '../middleware/validate.js';

const router = Router();

const schemesQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  state: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
});

router.get(
  '/',
  validateRequest({ query: schemesQuerySchema }),
  async (req, res, next) => {
    try {
      const result = await getSchemes(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/categories', async (req, res, next) => {
  try {
    const categories = await getCategories();
    res.json({ categories });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { scheme, source } = await getSchemeByIdOrCode(req.params.id);
    if (!scheme) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: `Scheme with identifier '${req.params.id}' was not found.`,
      });
    }

    res.json({ scheme, source });
  } catch (error) {
    next(error);
  }
});

export default router;
