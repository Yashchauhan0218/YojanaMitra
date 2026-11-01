import { isGeminiConfigured, generateContent } from './llm.service.js';
import { z } from 'zod';

export const UserProfileSchema = z.object({
  age: z.number().int().min(0).max(120).nullable().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'TRANSGENDER']).nullable().optional(),
  annual_income: z.number().min(0).nullable().optional(),
  state: z.string().nullable().optional(),
  district: z.string().nullable().optional(),
  caste_category: z.enum(['GEN', 'OBC', 'SC', 'ST', 'EWS']).nullable().optional(),
  occupation: z.string().nullable().optional(),
  is_student: z.boolean().nullable().optional(),
  is_disability: z.boolean().nullable().optional(),
  land_ownership_acres: z.number().nullable().optional(),
  bpl_card_holder: z.boolean().nullable().optional(),
  marital_status: z.enum(['SINGLE', 'MARRIED', 'WIDOWED', 'DIVORCED']).nullable().optional(),
});

const EXTRACTION_SYSTEM_PROMPT = `
You are an expert bilingual data extraction assistant for YojanaMitra, an Indian government scheme discovery portal.
Your job is to extract user demographic and socio-economic facts from citizen queries in English, Hindi, or Hinglish.

CRITICAL RULES:
1. ONLY extract information that is EXPLICITLY stated in the user text.
2. DO NOT make assumptions or hallucinate values. If not mentioned, set the field to null.
3. Handle Hindi & Hinglish numbers and terms correctly:
   - "25 saal", "25 varsh", "पच्चीस साल" -> age: 25
   - "mahila", "aurat", "female", "लड़की", "महिला" -> gender: "FEMALE"
   - "purush", "aadmi", "male", "पुरुष" -> gender: "MALE"
   - "kisan", "farmer", "किसान" -> occupation: "FARMER"
   - "vidyarthi", "student", "छात्र", "college me padhta hu" -> is_student: true
   - "kamai", "income", "aamdani", "2 lakh rupaye saal" -> annual_income: 200000
   - "UP", "uttar pradesh", "bihar", "rajasthan", etc. -> state: canonical state name
   - "divyang", "viklang", "disability", "दिव्यांग" -> is_disability: true
4. Return ONLY valid JSON adhering strictly to the schema.
`;

/**
 * Extracts structured profile information from user text using Gemini or deterministic fallback.
 *
 * @param {string} userText - User query in Hindi, English, or Hinglish
 * @param {Object} [existingProfile] - Any profile data collected from earlier interactions
 */
export async function extractProfileFromText(userText, existingProfile = {}) {
  if (!userText || typeof userText !== 'string' || !userText.trim()) {
    return {
      profile: existingProfile || {},
      isAiExtracted: false,
      followUpQuestions: [
        'कृपया अपनी उम्र, राज्य, और व्यवसाय बताएं। (Please share your age, state, and occupation)',
      ],
    };
  }

  // If Gemini API is configured, use LLM extraction
  if (isGeminiConfigured()) {
    try {
      const prompt = `
User Query: "${userText}"
Current Known Profile: ${JSON.stringify(existingProfile)}

Task: Extract all updated citizen facts. Return a JSON object with:
1. "profile": extracted fields (age, gender, annual_income, state, district, caste_category, occupation, is_student, is_disability, land_ownership_acres, bpl_card_holder, marital_status)
2. "missingImportantFields": array of names of fields that are still missing and essential for government scheme matching (e.g., "state", "annual_income", "occupation", "age")
3. "followUpQuestionEn": A courteous follow-up question in English asking for the most important missing field.
4. "followUpQuestionHi": The same follow-up question in Hindi.
`;

      const response = await generateContent({
        prompt,
        systemInstruction: EXTRACTION_SYSTEM_PROMPT,
        temperature: 0.1,
      });

      let jsonStr = response.text.trim();
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```/g, '').trim();
      }

      const parsed = JSON.parse(jsonStr);
      const validated = UserProfileSchema.partial().safeParse(parsed.profile || {});

      const mergedProfile = {
        ...existingProfile,
        ...(validated.success ? validated.data : {}),
      };

      // Clean nulls
      Object.keys(mergedProfile).forEach((k) => {
        if (mergedProfile[k] === null || mergedProfile[k] === undefined) {
          delete mergedProfile[k];
        }
      });

      return {
        profile: mergedProfile,
        isAiExtracted: true,
        missingFields: parsed.missingImportantFields || [],
        followUpQuestionEn: parsed.followUpQuestionEn || null,
        followUpQuestionHi: parsed.followUpQuestionHi || null,
      };
    } catch (error) {
      console.warn('Gemini extraction error, falling back to deterministic parser:', error.message);
    }
  }

  // Graceful deterministic extraction fallback (when API key is not configured or fails)
  const extracted = { ...existingProfile };
  const lower = userText.toLowerCase();

  // Age regex (e.g., "25 years", "25 yr", "25 saal", "age 25")
  const ageMatch = lower.match(/(?:age\s*[:=]?\s*|mer[ie]\s*umr\s*|umr\s*)?(\d{1,2})\s*(?:years|year|yr|saal|varsh|साल|वर्ष)?/i);
  if (ageMatch && ageMatch[1]) {
    const ageNum = parseInt(ageMatch[1], 10);
    if (ageNum >= 5 && ageNum <= 110) {
      extracted.age = ageNum;
    }
  }

  // Gender
  if (/महिला|mahila|aurat|female|girl|woman/i.test(lower)) {
    extracted.gender = 'FEMALE';
  } else if (/पुरुष|purush|aadmi|male|boy|man/i.test(lower)) {
    extracted.gender = 'MALE';
  }

  // Occupation
  if (/किसान|kisan|farmer|krishi|farming/i.test(lower)) {
    extracted.occupation = 'FARMER';
  } else if (/छात्र|vidyarthi|student|padhai|college|school/i.test(lower)) {
    extracted.occupation = 'STUDENT';
    extracted.is_student = true;
  } else if (/मजदूर|mazdoor|shramik|worker|labour|labor/i.test(lower)) {
    extracted.occupation = 'DAILY_WAGE_WORKER';
  }

  // State detection
  const indianStates = [
    'Uttar Pradesh', 'Bihar', 'Madhya Pradesh', 'Rajasthan', 'Maharashtra',
    'West Bengal', 'Gujarat', 'Karnataka', 'Tamil Nadu', 'Punjab', 'Haryana',
    'Delhi', 'Odisha', 'Kerala', 'Jharkhand', 'Assam', 'Chhattisgarh'
  ];
  for (const st of indianStates) {
    if (lower.includes(st.toLowerCase())) {
      extracted.state = st;
      break;
    }
  }
  if (!extracted.state && (lower.includes('up') || lower.includes('यू पी'))) {
    extracted.state = 'Uttar Pradesh';
  }

  // Identify missing critical fields
  const missing = [];
  if (!extracted.age) missing.push('age');
  if (!extracted.state) missing.push('state');
  if (!extracted.occupation) missing.push('occupation');
  if (!extracted.annual_income) missing.push('annual_income');

  return {
    profile: extracted,
    isAiExtracted: false,
    missingFields: missing,
    followUpQuestionEn: missing.length > 0
      ? `To find exact schemes for you, could you please also share your ${missing[0].replace('_', ' ')}?`
      : null,
    followUpQuestionHi: missing.length > 0
      ? `सटीक योजनाओं की जांच के लिए, क्या आप अपना ${missing[0] === 'age' ? 'उम्र' : missing[0] === 'state' ? 'राज्य' : 'व्यवसाय या आय'} भी बता सकते हैं?`
      : null,
    note: isGeminiConfigured()
      ? undefined
      : 'Gemini API key is not configured. Running in offline deterministic extraction mode.',
  };
}
