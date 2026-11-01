import { Router } from 'express';
import { extractProfileFromText } from '../services/extraction.service.js';
import { validateRequest } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const extractBodySchema = z.object({
  text: z.string().min(1, 'Text to extract is required.'),
  existingProfile: z.record(z.any()).optional().default({}),
});

router.post(
  '/extract',
  validateRequest({ body: extractBodySchema }),
  async (req, res, next) => {
    try {
      const { text, existingProfile } = req.body;
      const result = await extractProfileFromText(text, existingProfile);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
