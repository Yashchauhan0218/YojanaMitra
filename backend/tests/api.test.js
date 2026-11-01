import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

test('GET /api/health returns 200 and accurate system state', async () => {
  const res = await request(app).get('/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'UP');
  assert.equal(typeof res.body.uptimeSeconds, 'number');
  assert.equal(typeof res.body.database.connected, 'boolean');
  assert.equal(typeof res.body.ai.configured, 'boolean');
});

test('GET /api/schemes returns list of verified schemes', async () => {
  const res = await request(app).get('/api/schemes');
  assert.equal(res.status, 200);
  assert.equal(Array.isArray(res.body.schemes), true);
  assert.ok(res.body.schemes.length > 0);
  assert.equal(typeof res.body.total, 'number');

  const first = res.body.schemes[0];
  assert.ok(first.code);
  assert.ok(first.titleEn);
  assert.ok(first.titleHi);
});

test('GET /api/schemes with search query filters results', async () => {
  const res = await request(app).get('/api/schemes?search=kisan');
  assert.equal(res.status, 200);
  assert.ok(res.body.schemes.length >= 1);
  assert.ok(res.body.schemes.some((s) => s.code.includes('KISAN')));
});

test('GET /api/schemes/categories returns unique categories', async () => {
  const res = await request(app).get('/api/schemes/categories');
  assert.equal(res.status, 200);
  assert.equal(Array.isArray(res.body.categories), true);
  assert.ok(res.body.categories.includes('Agriculture'));
});

test('GET /api/schemes/:id returns scheme details or 404', async () => {
  const validRes = await request(app).get('/api/schemes/PM-KISAN');
  assert.equal(validRes.status, 200);
  assert.equal(validRes.body.scheme.code, 'PM-KISAN');

  const invalidRes = await request(app).get('/api/schemes/NONEXISTENT-CODE');
  assert.equal(invalidRes.status, 404);
});

test('POST /api/eligibility/check evaluates user profile correctly', async () => {
  const res = await request(app)
    .post('/api/eligibility/check')
    .send({
      profile: {
        occupation: 'FARMER',
        age: 32,
      },
    });

  assert.equal(res.status, 200);
  assert.ok(res.body.summary);
  assert.ok(Array.isArray(res.body.results.potentiallyEligible));
  // PM-KISAN should be potentially eligible
  const isEligibleForKisan = res.body.results.potentiallyEligible.some(
    (s) => s.schemeCode === 'PM-KISAN'
  );
  assert.equal(isEligibleForKisan, true);
});

test('POST /api/profile/extract parses natural language details', async () => {
  const res = await request(app)
    .post('/api/profile/extract')
    .send({
      text: 'Main UP se ek 25 saal ka kisan hu',
    });

  assert.equal(res.status, 200);
  assert.equal(res.body.profile.age, 25);
  assert.equal(res.body.profile.occupation, 'FARMER');
  assert.equal(res.body.profile.state, 'Uttar Pradesh');
});

test('Admin routes enforce security authorization', async () => {
  // Attempt unauthorized creation
  const unauthRes = await request(app)
    .post('/api/admin/schemes')
    .send({
      code: 'UNAUTH-TEST',
      titleEn: 'Test Scheme',
      titleHi: 'टेस्ट स्कीम',
      summaryEn: 'Summary english',
      summaryHi: 'समरी हिंदी',
      benefitsEn: 'Benefits',
      benefitsHi: 'लाभ',
      category: 'Education',
      sourceUrl: 'https://myscheme.gov.in',
    });

  assert.equal(unauthRes.status, 401);
  assert.equal(unauthRes.body.error, 'UNAUTHORIZED');
});
