import { Router } from 'express';
import { extractProfileFromText } from '../services/extraction.service.js';
import { getSchemes } from '../services/scheme.service.js';
import { evaluateMultipleSchemes } from '../services/eligibility.service.js';
import { isGeminiConfigured, generateContent } from '../services/llm.service.js';
import { validateRequest } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const chatBodySchema = z.object({
  message: z.string().min(1, 'Message is required.'),
  currentProfile: z.record(z.any()).optional().default({}),
  language: z.enum(['en', 'hi']).default('hi'),
});

router.post(
  '/',
  validateRequest({ body: chatBodySchema }),
  async (req, res, next) => {
    try {
      const { message, currentProfile, language } = req.body;
      const isHi = language === 'hi';

      // 1. Extract newly mentioned facts from the user message
      const extractionResult = await extractProfileFromText(message, currentProfile);
      const updatedProfile = extractionResult.profile;

      // 2. Run deterministic evaluation against verified schemes
      const { schemes } = await getSchemes({ limit: 100 });
      const evaluation = evaluateMultipleSchemes(schemes, updatedProfile);

      // 3. Formulate conversational response grounded strictly in verified data and evaluation
      let botReply = '';

      if (isGeminiConfigured()) {
        try {
          const systemInstruction = `
You are YojanaMitra, an empathetic, respectful, and authoritative AI assistant helping Indian citizens find verified government schemes.
COMMUNICATION LANGUAGE: ${isHi ? 'Hindi (हिंदी)' : 'English'}.
CRITICAL RULES:
1. You DO NOT invent schemes or criteria. Only refer to the verified schemes and evaluation results provided.
2. Ground your response in the rule engine results:
   - Potentially eligible schemes: ${JSON.stringify(evaluation.potentiallyEligible.map((s) => s.schemeTitleEn || s.schemeTitleHi))}
   - Schemes needing more info: ${JSON.stringify(evaluation.needsInformation.map((s) => s.schemeTitleEn || s.schemeTitleHi))}
3. If criteria are missing (e.g. state, income, age, occupation), politely ask for them to narrow down schemes.
4. Keep answers concise, citizen-friendly, and polite (use 'आप' in Hindi). Never give false promises.
`;

          const prompt = `
User Message: "${message}"
Citizen Profile: ${JSON.stringify(updatedProfile)}
Potentially Eligible Schemes: ${JSON.stringify(
            evaluation.potentiallyEligible.map((e) => ({
              code: e.schemeCode,
              title: isHi ? e.schemeTitleHi : e.schemeTitleEn,
              passed: e.passedCriteria.map((c) => (isHi ? c.labelHi : c.labelEn)),
            }))
          )}
Schemes Needing Information: ${JSON.stringify(
            evaluation.needsInformation.slice(0, 3).map((e) => ({
              code: e.schemeCode,
              title: isHi ? e.schemeTitleHi : e.schemeTitleEn,
              missing: e.unknownCriteria.map((c) => (isHi ? c.labelHi : c.labelEn)),
            }))
          )}
Follow-up Question Needed: ${
            isHi ? extractionResult.followUpQuestionHi : extractionResult.followUpQuestionEn
          }

Provide a helpful, warm, concise reply in ${isHi ? 'Hindi' : 'English'}.
`;

          const aiResponse = await generateContent({
            prompt,
            systemInstruction,
            temperature: 0.3,
          });

          botReply = aiResponse.text.trim();
        } catch (llmError) {
          console.warn('Gemini chat generation failed, using structured template:', llmError.message);
        }
      }

      // If Gemini reply is not available (not configured or failed), use clear deterministic reply
      if (!botReply) {
        const eligibleCount = evaluation.potentiallyEligible.length;
        const needsInfoCount = evaluation.needsInformation.length;

        if (isHi) {
          const eligibleNames = evaluation.potentiallyEligible
            .map((s) => `• **${s.schemeTitleHi}**`)
            .join('\n');

          const missingText = extractionResult.followUpQuestionHi || '';

          botReply = [
            `नमस्ते! आपकी दी गई जानकारी (${Object.entries(updatedProfile)
              .map(([k, v]) => `${k}: ${v}`)
              .join(', ') || 'प्राप्त'}) के अनुसार:`,
            eligibleCount > 0
              ? `आप **${eligibleCount} योजनाओं** के लिए संभावित रूप से पात्र हैं:\n${eligibleNames}`
              : `वर्तमान विवरण के अनुसार अभी कोई योजना पूर्णतः मेल नहीं खाती।`,
            needsInfoCount > 0
              ? `अन्य **${needsInfoCount} योजनाओं** के लिए कुछ अतिरिक्त जानकारी चाहिए।`
              : '',
            missingText,
          ]
            .filter(Boolean)
            .join('\n\n');
        } else {
          const eligibleNames = evaluation.potentiallyEligible
            .map((s) => `• **${s.schemeTitleEn}**`)
            .join('\n');

          const missingText = extractionResult.followUpQuestionEn || '';

          botReply = [
            `Hello! Based on the details provided (${Object.entries(updatedProfile)
              .map(([k, v]) => `${k}: ${v}`)
              .join(', ') || 'received'}):`,
            eligibleCount > 0
              ? `You are potentially eligible for **${eligibleCount} scheme(s)**:\n${eligibleNames}`
              : `No schemes directly match yet based on current details.`,
            needsInfoCount > 0
              ? `We need a few more details to check eligibility for **${needsInfoCount} other scheme(s)**.`
              : '',
            missingText,
          ]
            .filter(Boolean)
            .join('\n\n');
        }
      }

      res.json({
        reply: botReply,
        updatedProfile,
        evaluation: {
          potentiallyEligible: evaluation.potentiallyEligible,
          needsInformation: evaluation.needsInformation,
          notEligibleCount: evaluation.notEligible.length,
        },
        missingFields: extractionResult.missingFields,
        isAiGenerated: isGeminiConfigured(),
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
