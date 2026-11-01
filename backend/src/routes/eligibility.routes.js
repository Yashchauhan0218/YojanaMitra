import { Router } from 'express';
import { getSchemes, getSchemeByIdOrCode } from '../services/scheme.service.js';
import { evaluateMultipleSchemes, evaluateSchemeEligibility } from '../services/eligibility.service.js';
import { generateGroundedExplanation } from '../services/explanation.service.js';
import { validateRequest } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const checkBodySchema = z.object({
  profile: z.record(z.any()).default({}),
  schemeId: z.string().optional(),
  language: z.enum(['en', 'hi']).default('en'),
  includeExplanations: z.boolean().default(false),
});

router.post(
  '/check',
  validateRequest({ body: checkBodySchema }),
  async (req, res, next) => {
    try {
      const { profile, schemeId, language, includeExplanations } = req.body;

      if (schemeId) {
        const { scheme } = await getSchemeByIdOrCode(schemeId);
        if (!scheme) {
          return res.status(404).json({
            error: 'NOT_FOUND',
            message: `Scheme '${schemeId}' not found.`,
          });
        }

        const evaluation = evaluateSchemeEligibility(scheme, profile);
        let explanation = null;
        if (includeExplanations) {
          explanation = await generateGroundedExplanation({
            scheme,
            evaluation,
            userProfile: profile,
            language,
          });
        }

        return res.json({
          evaluation,
          explanation,
        });
      }

      // Check against all published schemes
      const { schemes } = await getSchemes({ limit: 100 });
      const grouped = evaluateMultipleSchemes(schemes, profile);

      // Attach grounded explanations to potentially eligible and needs-information if requested
      if (includeExplanations) {
        const attachExplanation = async (evalItem) => {
          const scheme = schemes.find((s) => s.id === evalItem.schemeId);
          if (scheme) {
            const exp = await generateGroundedExplanation({
              scheme,
              evaluation: evalItem,
              userProfile: profile,
              language,
            });
            return { ...evalItem, explanation: exp };
          }
          return evalItem;
        };

        grouped.potentiallyEligible = await Promise.all(
          grouped.potentiallyEligible.map(attachExplanation)
        );
        grouped.needsInformation = await Promise.all(
          grouped.needsInformation.map(attachExplanation)
        );
      }

      res.json({
        profile,
        summary: {
          totalChecked: schemes.length,
          potentiallyEligibleCount: grouped.potentiallyEligible.length,
          needsInformationCount: grouped.needsInformation.length,
          notEligibleCount: grouped.notEligible.length,
        },
        results: grouped,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
