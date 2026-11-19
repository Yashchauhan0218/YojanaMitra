export type Language = 'en' | 'hi';

export interface SchemeCriterion {
  id?: string;
  field: string;
  operator: 'eq' | 'neq' | 'gte' | 'gt' | 'lte' | 'lt' | 'in' | 'not_in' | 'exists';
  value: any;
  labelEn: string;
  labelHi: string;
  isMandatory?: boolean;
}

export interface SchemeSource {
  id?: string;
  title: string;
  url: string;
  verifiedDate?: string;
  sourceType?: string;
  notes?: string;
}

export interface Scheme {
  id: string;
  code: string;
  titleEn: string;
  titleHi: string;
  summaryEn: string;
  summaryHi: string;
  detailsEn?: string;
  detailsHi?: string;
  benefitsEn: string;
  benefitsHi: string;
  category: string;
  level: 'CENTRAL' | 'STATE';
  state?: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  sourceUrl: string;
  applicationUrl?: string | null;
  verifiedAt: string;
  criteria?: SchemeCriterion[];
  sources?: SchemeSource[];
}

export interface CriterionEvaluationResult {
  field: string;
  operator: string;
  expected: any;
  actual: any;
  isMandatory: boolean;
  labelEn?: string;
  labelHi?: string;
  evaluated: boolean;
  passed: boolean;
}

export interface SchemeEvaluation {
  schemeId: string;
  schemeCode: string;
  schemeTitleEn: string;
  schemeTitleHi: string;
  status: 'POTENTIALLY_ELIGIBLE' | 'NOT_ELIGIBLE' | 'NEEDS_INFORMATION';
  passedCriteria: CriterionEvaluationResult[];
  failedCriteria: CriterionEvaluationResult[];
  unknownCriteria: CriterionEvaluationResult[];
  explanation?: {
    explanation: string;
    isAiGenerated: boolean;
    source: string;
  };
}

export interface EligibilityCheckResponse {
  profile: Record<string, any>;
  summary: {
    totalChecked: number;
    potentiallyEligibleCount: number;
    needsInformationCount: number;
    notEligibleCount: number;
  };
  results: {
    potentiallyEligible: SchemeEvaluation[];
    needsInformation: SchemeEvaluation[];
    notEligible: SchemeEvaluation[];
    all: SchemeEvaluation[];
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isAiGenerated?: boolean;
  evaluation?: {
    potentiallyEligible: SchemeEvaluation[];
    needsInformation: SchemeEvaluation[];
    notEligibleCount: number;
  };
}

export interface HealthStatus {
  status: string;
  service: string;
  uptimeSeconds: number;
  database: {
    connected: boolean;
    message: string;
  };
  ai: {
    provider: string;
    sdk: string;
    configured: boolean;
    model: string;
    message: string;
  };
}
