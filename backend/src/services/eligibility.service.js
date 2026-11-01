/**
 * YojanaMitra Deterministic Rule-Based Eligibility Engine.
 *
 * Supported operators:
 * - eq, neq, gte, gt, lte, lt, in, not_in, exists
 *
 * Output Statuses:
 * - POTENTIALLY_ELIGIBLE: All mandatory criteria are confirmed met.
 * - NOT_ELIGIBLE: At least one criterion is confirmed failed.
 * - NEEDS_INFORMATION: No criteria failed, but missing information is required to confirm.
 *
 * Unknown information NEVER counts as eligible.
 */

export const ELIGIBILITY_STATUS = {
  POTENTIALLY_ELIGIBLE: 'POTENTIALLY_ELIGIBLE',
  NOT_ELIGIBLE: 'NOT_ELIGIBLE',
  NEEDS_INFORMATION: 'NEEDS_INFORMATION',
};

/**
 * Normalizes values for comparison (case-insensitive strings, numbers, booleans)
 */
function normalizeValue(val) {
  if (typeof val === 'string') return val.trim().toLowerCase();
  return val;
}

/**
 * Evaluates a single criterion against a user value.
 * Returns: { evaluated: boolean, passed: boolean }
 */
export function evaluateCriterion(criterion, userProfile) {
  const { field, operator, value, isMandatory = true, labelEn, labelHi } = criterion;
  const userVal = userProfile?.[field];

  // Operator: exists
  if (operator === 'exists') {
    const exists = userVal !== undefined && userVal !== null && userVal !== '';
    const passed = exists === Boolean(value);
    return {
      field,
      operator,
      expected: value,
      actual: userVal,
      isMandatory,
      labelEn,
      labelHi,
      evaluated: true,
      passed,
    };
  }

  // If user value is undefined or null, information is missing
  if (userVal === undefined || userVal === null || userVal === '') {
    return {
      field,
      operator,
      expected: value,
      actual: null,
      isMandatory,
      labelEn,
      labelHi,
      evaluated: false, // Unknown
      passed: false,
    };
  }

  let passed = false;
  const normUser = normalizeValue(userVal);
  const normExpected = normalizeValue(value);

  switch (operator) {
    case 'eq':
      passed = normUser === normExpected;
      break;

    case 'neq':
      passed = normUser !== normExpected;
      break;

    case 'gte':
      passed = Number(userVal) >= Number(value);
      break;

    case 'gt':
      passed = Number(userVal) > Number(value);
      break;

    case 'lte':
      passed = Number(userVal) <= Number(value);
      break;

    case 'lt':
      passed = Number(userVal) < Number(value);
      break;

    case 'in': {
      const list = Array.isArray(value) ? value : [value];
      const normList = list.map(normalizeValue);
      passed = normList.includes(normUser);
      break;
    }

    case 'not_in': {
      const list = Array.isArray(value) ? value : [value];
      const normList = list.map(normalizeValue);
      passed = !normList.includes(normUser);
      break;
    }

    default:
      passed = false;
  }

  return {
    field,
    operator,
    expected: value,
    actual: userVal,
    isMandatory,
    labelEn,
    labelHi,
    evaluated: true,
    passed,
  };
}

/**
 * Evaluates a scheme's full criteria set against a user profile.
 *
 * @param {Object} scheme - Scheme object with criteria array
 * @param {Object} userProfile - Key-value map of applicant attributes
 * @returns {Object} Evaluation summary
 */
export function evaluateSchemeEligibility(scheme, userProfile = {}) {
  const criteria = scheme.criteria || [];

  const passedCriteria = [];
  const failedCriteria = [];
  const unknownCriteria = [];

  for (const criterion of criteria) {
    const result = evaluateCriterion(criterion, userProfile);

    if (!result.evaluated) {
      unknownCriteria.push(result);
    } else if (result.passed) {
      passedCriteria.push(result);
    } else {
      failedCriteria.push(result);
    }
  }

  let status;
  if (failedCriteria.some((c) => c.isMandatory)) {
    status = ELIGIBILITY_STATUS.NOT_ELIGIBLE;
  } else if (unknownCriteria.some((c) => c.isMandatory)) {
    status = ELIGIBILITY_STATUS.NEEDS_INFORMATION;
  } else {
    status = ELIGIBILITY_STATUS.POTENTIALLY_ELIGIBLE;
  }

  return {
    schemeId: scheme.id,
    schemeCode: scheme.code,
    schemeTitleEn: scheme.titleEn,
    schemeTitleHi: scheme.titleHi,
    status,
    passedCriteria,
    failedCriteria,
    unknownCriteria,
  };
}

/**
 * Evaluates multiple schemes and groups them by eligibility status.
 */
export function evaluateMultipleSchemes(schemes, userProfile) {
  const evaluations = schemes.map((scheme) => evaluateSchemeEligibility(scheme, userProfile));

  return {
    potentiallyEligible: evaluations.filter(
      (e) => e.status === ELIGIBILITY_STATUS.POTENTIALLY_ELIGIBLE
    ),
    needsInformation: evaluations.filter((e) => e.status === ELIGIBILITY_STATUS.NEEDS_INFORMATION),
    notEligible: evaluations.filter((e) => e.status === ELIGIBILITY_STATUS.NOT_ELIGIBLE),
    all: evaluations,
  };
}
