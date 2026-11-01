import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateCriterion,
  evaluateSchemeEligibility,
  ELIGIBILITY_STATUS,
} from '../src/services/eligibility.service.js';

test('evaluateCriterion with eq and neq', () => {
  const eqCriterion = {
    field: 'gender',
    operator: 'eq',
    value: 'FEMALE',
    labelEn: 'Must be female',
    labelHi: 'महिला होनी चाहिए',
  };

  assert.equal(evaluateCriterion(eqCriterion, { gender: 'female' }).passed, true);
  assert.equal(evaluateCriterion(eqCriterion, { gender: 'MALE' }).passed, false);
  assert.equal(evaluateCriterion(eqCriterion, {}).evaluated, false);

  const neqCriterion = { field: 'state', operator: 'neq', value: 'Goa' };
  assert.equal(evaluateCriterion(neqCriterion, { state: 'Bihar' }).passed, true);
  assert.equal(evaluateCriterion(neqCriterion, { state: 'Goa' }).passed, false);
});

test('evaluateCriterion with gte, gt, lte, lt', () => {
  const gteCrit = { field: 'age', operator: 'gte', value: 18 };
  assert.equal(evaluateCriterion(gteCrit, { age: 18 }).passed, true);
  assert.equal(evaluateCriterion(gteCrit, { age: 17 }).passed, false);

  const gtCrit = { field: 'age', operator: 'gt', value: 18 };
  assert.equal(evaluateCriterion(gtCrit, { age: 18 }).passed, false);
  assert.equal(evaluateCriterion(gtCrit, { age: 19 }).passed, true);

  const lteCrit = { field: 'annual_income', operator: 'lte', value: 250000 };
  assert.equal(evaluateCriterion(lteCrit, { annual_income: 250000 }).passed, true);
  assert.equal(evaluateCriterion(lteCrit, { annual_income: 300000 }).passed, false);

  const ltCrit = { field: 'annual_income', operator: 'lt', value: 250000 };
  assert.equal(evaluateCriterion(ltCrit, { annual_income: 250000 }).passed, false);
  assert.equal(evaluateCriterion(ltCrit, { annual_income: 200000 }).passed, true);
});

test('evaluateCriterion with in and not_in', () => {
  const inCrit = {
    field: 'caste_category',
    operator: 'in',
    value: ['SC', 'ST', 'OBC'],
  };
  assert.equal(evaluateCriterion(inCrit, { caste_category: 'OBC' }).passed, true);
  assert.equal(evaluateCriterion(inCrit, { caste_category: 'GEN' }).passed, false);

  const notInCrit = {
    field: 'occupation',
    operator: 'not_in',
    value: ['GOVERNMENT_SERVANT', 'POLITICIAN'],
  };
  assert.equal(evaluateCriterion(notInCrit, { occupation: 'FARMER' }).passed, true);
  assert.equal(
    evaluateCriterion(notInCrit, { occupation: 'GOVERNMENT_SERVANT' }).passed,
    false
  );
});

test('evaluateCriterion with exists', () => {
  const existsCrit = { field: 'bpl_card_number', operator: 'exists', value: true };
  assert.equal(evaluateCriterion(existsCrit, { bpl_card_number: 'BPL123' }).passed, true);
  assert.equal(evaluateCriterion(existsCrit, {}).passed, false);
});

test('evaluateSchemeEligibility returns POTENTIALLY_ELIGIBLE when all mandatory criteria pass', () => {
  const scheme = {
    id: 'scheme-1',
    code: 'TEST-SCHEME',
    titleEn: 'Test Scheme',
    titleHi: 'परीक्षण योजना',
    criteria: [
      { field: 'age', operator: 'gte', value: 18, isMandatory: true },
      { field: 'annual_income', operator: 'lte', value: 200000, isMandatory: true },
    ],
  };

  const result = evaluateSchemeEligibility(scheme, { age: 22, annual_income: 150000 });
  assert.equal(result.status, ELIGIBILITY_STATUS.POTENTIALLY_ELIGIBLE);
  assert.equal(result.passedCriteria.length, 2);
  assert.equal(result.failedCriteria.length, 0);
  assert.equal(result.unknownCriteria.length, 0);
});

test('evaluateSchemeEligibility returns NOT_ELIGIBLE when any mandatory criterion fails', () => {
  const scheme = {
    id: 'scheme-2',
    code: 'TEST-SCHEME-FAIL',
    titleEn: 'Test Scheme',
    titleHi: 'परीक्षण योजना',
    criteria: [
      { field: 'age', operator: 'gte', value: 18, isMandatory: true },
      { field: 'annual_income', operator: 'lte', value: 200000, isMandatory: true },
    ],
  };

  const result = evaluateSchemeEligibility(scheme, { age: 16, annual_income: 100000 });
  assert.equal(result.status, ELIGIBILITY_STATUS.NOT_ELIGIBLE);
  assert.equal(result.failedCriteria.length, 1);
});

test('evaluateSchemeEligibility returns NEEDS_INFORMATION when missing data and none failed', () => {
  const scheme = {
    id: 'scheme-3',
    code: 'TEST-SCHEME-INCOMPLETE',
    titleEn: 'Test Scheme',
    titleHi: 'परीक्षण योजना',
    criteria: [
      { field: 'age', operator: 'gte', value: 18, isMandatory: true },
      { field: 'annual_income', operator: 'lte', value: 200000, isMandatory: true },
    ],
  };

  // Only age is provided, annual_income is unknown
  const result = evaluateSchemeEligibility(scheme, { age: 25 });
  assert.equal(result.status, ELIGIBILITY_STATUS.NEEDS_INFORMATION);
  assert.equal(result.passedCriteria.length, 1);
  assert.equal(result.unknownCriteria.length, 1);
  assert.equal(result.unknownCriteria[0].field, 'annual_income');
});
