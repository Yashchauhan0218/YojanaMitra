import { isGeminiConfigured, generateContent } from './llm.service.js';
import { ELIGIBILITY_STATUS } from './eligibility.service.js';

/**
 * Builds a deterministic grounded explanation from evaluation output.
 */
function buildDeterministicExplanation(scheme, evaluation, language = 'en') {
  const isHi = language === 'hi';
  const { status, passedCriteria, failedCriteria, unknownCriteria } = evaluation;

  let header = '';
  let reason = '';
  let missing = '';

  if (status === ELIGIBILITY_STATUS.POTENTIALLY_ELIGIBLE) {
    header = isHi
      ? `आप ${scheme.titleHi} के लिए संभावित रूप से पात्र हैं!`
      : `You are potentially eligible for ${scheme.titleEn}!`;
    reason = isHi
      ? `आपके द्वारा दी गई जानकारी सभी आवश्यक पात्रता शर्तों को पूरा करती है। (जैसे: ${passedCriteria.map((c) => c.labelHi || c.field).join(', ')})`
      : `All your provided profile details satisfy the mandatory criteria (including: ${passedCriteria.map((c) => c.labelEn || c.field).join(', ')}).`;
  } else if (status === ELIGIBILITY_STATUS.NOT_ELIGIBLE) {
    header = isHi
      ? `आप वर्तमान में ${scheme.titleHi} के लिए पात्र नहीं हैं।`
      : `You are currently not eligible for ${scheme.titleEn}.`;
    reason = isHi
      ? `अपात्रता का कारण: ${failedCriteria.map((c) => `${c.labelHi || c.field} (आवश्यक: ${c.expected}, आपका मान: ${c.actual})`).join('; ')}`
      : `Reason: ${failedCriteria.map((c) => `${c.labelEn || c.field} (Required: ${c.expected}, Your value: ${c.actual})`).join('; ')}`;
  } else {
    header = isHi
      ? `${scheme.titleHi} के लिए कुछ और जानकारी की आवश्यकता है।`
      : `Additional information is required for ${scheme.titleEn}.`;
    missing = isHi
      ? `कृपया पुष्टि करें: ${unknownCriteria.map((c) => c.labelHi || c.field).join(', ')}`
      : `Please confirm: ${unknownCriteria.map((c) => c.labelEn || c.field).join(', ')}`;
  }

  const benefits = isHi ? scheme.benefitsHi : scheme.benefitsEn;
  const officialSource = `Official Source: ${scheme.sourceUrl}`;

  return {
    explanation: [header, reason, missing, isHi ? `मुख्य लाभ: ${benefits}` : `Key Benefits: ${benefits}`, officialSource]
      .filter(Boolean)
      .join('\n\n'),
    isAiGenerated: false,
    source: 'deterministic_rule_engine',
  };
}

/**
 * Generates an explanation grounded strictly in the rule engine results and verified scheme data.
 * The LLM NEVER decides eligibility; it only articulates the engine's verdict in natural language.
 */
export async function generateGroundedExplanation({
  scheme,
  evaluation,
  userProfile,
  language = 'en',
}) {
  // If Gemini is not configured, return deterministic verified explanation
  if (!isGeminiConfigured()) {
    return buildDeterministicExplanation(scheme, evaluation, language);
  }

  try {
    const isHi = language === 'hi';
    const systemInstruction = `
You are a factual government welfare advisor for Indian citizens.
CRITICAL MANDATE:
1. You DO NOT determine eligibility. The deterministic decision is ALREADY MADE and provided in the prompt.
2. Under no circumstances may you alter or contradict the status: "${evaluation.status}".
3. Ground every statement strictly in the provided Scheme Details and Criteria Evaluation.
4. Do NOT hallucinate rules, funds, or deadlines.
5. Provide a helpful, respectful, and empathetic summary in ${isHi ? 'clear Hindi' : 'simple English'}.
6. Mention what action the citizen should take next (e.g. visit the official portal at ${scheme.sourceUrl} or provide missing info).
`;

    const prompt = `
Scheme Name: ${scheme.titleEn} (${scheme.titleHi})
Official Portal: ${scheme.sourceUrl}
Key Benefits: ${isHi ? scheme.benefitsHi : scheme.benefitsEn}

Rule Engine Status: ${evaluation.status}
Passed Criteria: ${JSON.stringify(evaluation.passedCriteria)}
Failed Criteria: ${JSON.stringify(evaluation.failedCriteria)}
Missing / Unknown Criteria: ${JSON.stringify(evaluation.unknownCriteria)}

Applicant Details: ${JSON.stringify(userProfile)}

Explain why this citizen is "${evaluation.status}" for this scheme in 3-4 concise, easy-to-understand sentences in ${isHi ? 'Hindi' : 'English'}.
`;

    const response = await generateContent({
      prompt,
      systemInstruction,
      temperature: 0.2,
    });

    return {
      explanation: response.text.trim(),
      isAiGenerated: true,
      source: 'gemini_grounded',
    };
  } catch (error) {
    console.warn('Gemini explanation generation failed, falling back to rule engine:', error.message);
    return buildDeterministicExplanation(scheme, evaluation, language);
  }
}
