# Schemes & Data Verification Workflow

## 1. Overview
YojanaMitra operates under a strict principle of **Grounded Truth**:
- Schemes are sourced exclusively from authentic, verified Indian government portals.
- AI must never invent, hallucinate, or assume government schemes or eligibility criteria.
- Unknown applicant attributes must never be assumed as "eligible".

## 2. Authorized Official Portals
1. **myScheme Portal (Government of India)**: [https://www.myscheme.gov.in/](https://www.myscheme.gov.in/)
2. **National Portal of India**: [https://www.india.gov.in/my-government/schemes](https://www.india.gov.in/my-government/schemes)
3. **Open Government Data (OGD) Platform India**: [https://www.data.gov.in/](https://www.data.gov.in/)
4. **Ministry-specific Portals**: Official `.gov.in` and `.nic.in` domains (e.g., Ministry of Agriculture & Farmers Welfare, Ministry of Education, MoHFW, etc.).

## 3. Data Ingestion & Verification Protocol
1. **Source Discovery**: Scheme metadata and guidelines are retrieved directly from official government gazettes, portal documentation, or `.gov.in` announcements.
2. **Criterion Formalization**:
   - Each eligibility clause is mapped into deterministic rule criteria (`eq`, `neq`, `gte`, `gt`, `lte`, `lt`, `in`, `not_in`, `exists`).
   - Fields supported: `age`, `gender`, `annual_income`, `caste_category`, `state`, `occupation`, `disability_status`, `is_student`, etc.
3. **Bilingual Verification**:
   - Title, summary, and benefits are verified in both English and Hindi.
4. **Auditing & Timestamps**:
   - Every scheme record retains `sourceUrl`, `verifiedAt`, and publishing status (`PUBLISHED` vs `DRAFT`).
5. **No Unauthorized Web Scraping**:
   - Automated scrapers must not breach terms of service. Manual verification or approved API feeds/datasets are required for production data.
