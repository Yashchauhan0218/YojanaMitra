# YojanaMitra (योजनामित्र)

> **The Right Government Schemes, Made Simple.**  
> *सरकारी योजनाओं की सही जानकारी, आसानी से।*

**YojanaMitra** is an AI-powered, voice-enabled, bilingual (Hindi & English) public welfare scheme discovery platform for India. Built as a B.Tech CSE capstone project, it addresses the digital divide by enabling citizens to discover and verify authentic central and state welfare benefits through natural conversation, voice input, and deterministic rule matching.

---

## 🏛 Core Principles

1. **Grounded Truth & Zero Hallucination**:
   - The LLM **never** determines final eligibility.
   - Eligibility is decided exclusively by a deterministic rule engine (`eq`, `neq`, `gte`, `gt`, `lte`, `lt`, `in`, `not_in`, `exists`).
   - Unknown information is categorized as `NEEDS_INFORMATION` and **never** assumed as eligible.
2. **Authentic Government Citations**:
   - Sourced exclusively from official portals: [myScheme](https://www.myscheme.gov.in), [india.gov.in](https://www.india.gov.in), and ministerial gazettes.
   - Every scheme maintains an official source URL, application URL, and verification timestamp.
3. **Voice & Language Accessibility**:
   - Real-time Web Speech recognition in Hindi (`hi-IN`) and English (`en-IN`).
   - Seamless one-click bilingual switching across all interfaces.
4. **Offline Resilience**:
   - Operates gracefully even if PostgreSQL or Gemini API credentials are not yet configured on the local machine.

---

## 🏗 Architecture & Stack

```
YojanaMitra/
├── frontend/             # Next.js (App Router), TypeScript, Tailwind CSS, Lucide React
│   ├── src/
│   │   ├── app/          # App Router: Home, Assistant, Schemes, Scheme Details, About, Admin
│   │   ├── components/   # Navbar, Footer, SchemeCard
│   │   ├── context/      # Bilingual LanguageProvider (Hindi/English)
│   │   ├── hooks/        # useVoiceRecognition (Web Speech API)
│   │   └── lib/          # API Client & TypeScript Types
├── backend/              # Node.js, Express.js REST API
│   ├── prisma/           # PostgreSQL Schema & Seed Script
│   ├── src/
│   │   ├── db/           # Prisma Client with connection verification
│   │   ├── services/     # llm.service.js, extraction.service.js, explanation.service.js,
│   │   │                 # eligibility.service.js, scheme.service.js
│   │   ├── routes/       # Health, Schemes, Profile, Eligibility, Chat, Admin
│   │   └── middleware/   # Security (Helmet, CORS, Rate Limit, Auth, Centralized Error)
│   └── tests/            # Automated unit and API integration test suites
├── docs/                 # Verification protocol & data sources documentation
├── .gitignore            # Git configuration
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v20 or higher (v24 recommended)
- **npm**: v10 or higher
- **PostgreSQL**: (Optional for initial run; verified in-memory fallback is active when offline)
- **Google Gemini API Key**: [Get key from Google AI Studio](https://aistudio.google.com/)

---

### 2. Setup Backend

```bash
cd backend

# Install dependencies (already completed in workspace)
npm install

# Configure environment variables
# Copy .env.example to .env
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/yojanamitra?schema=public"
GEMINI_API_KEY="your-gemini-api-key-here"
GEMINI_MODEL="gemini-2.5-flash"
FRONTEND_URL="http://localhost:3000"
ADMIN_API_KEY="admin-secret-token-change-in-production"
```

#### Run Automated Tests
```bash
npm test
```
*Executes unit tests for the deterministic eligibility rule engine and full REST API integration tests.*

#### Database Setup (When PostgreSQL is running)
```bash
# Push schema migrations
npm run prisma:migrate

# Seed verified Government of India schemes
npm run prisma:seed
```

#### Start Backend Server
```bash
npm run dev
# Server runs at http://localhost:5000
# Health Check: http://localhost:5000/api/health
```

---

### 3. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend runs at http://localhost:3000
```

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health, DB connectivity, and Gemini AI status | Public |
| `GET` | `/api/schemes` | Search & filter published schemes | Public |
| `GET` | `/api/schemes/categories` | Distinct categories (Agriculture, Healthcare, etc.) | Public |
| `GET` | `/api/schemes/:id` | Detailed scheme view with criteria and sources | Public |
| `POST` | `/api/chat` | Bilingual conversational assistant with extraction | Public |
| `POST` | `/api/profile/extract` | Structured demographic extraction from plain text | Public |
| `POST` | `/api/eligibility/check` | Deterministic rule matching engine | Public |
| `GET` | `/api/admin/schemes` | List all schemes (including drafts) | Public |
| `POST` | `/api/admin/schemes` | Add new verified scheme with criteria | **Admin Key** |
| `PATCH` | `/api/admin/schemes/:id/status` | Publish / Draft / Archive scheme | **Admin Key** |
| `GET` | `/api/admin/audit-logs` | Administrative action audit trail | Public |

---

## 🎙 Voice Assistant Usage
1. Open `http://localhost:3000/assistant` in Chrome, Edge, or Safari.
2. Click the microphone icon to activate voice input.
3. Speak naturally in Hindi or English (e.g. *"मैं उत्तर प्रदेश से एक 35 वर्षीय किसान हूँ"* or *"I am a 22 year old college student with family income 2 lakhs"*).
4. View the real-time extracted demographic facts and matched verified schemes.
5. Click **Listen (सुनें)** on any response to hear audio text-to-speech feedback.

---

## 🔒 Security & Verification
- **Helmet**: Secures HTTP response headers.
- **Rate Limiting**: Defends endpoints against spam/abuse.
- **Admin Auth**: Administrative operations require a protected header `x-admin-key`.
- **Zod Validation**: Validates all incoming payloads before business execution.
