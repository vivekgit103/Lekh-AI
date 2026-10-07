# DocuSaathi (दस्तावेज़ साथी)

> **Understand your documents. Know what to do next.**
>
> Intelligent Document Processing (IDP) & Action Assistant built for Hackathon 2026.

DocuSaathi bridges the gap between intimidating official documents (Income Tax notices, GST invoices, loan sanction letters, rent agreements) and actionable next steps. It combines **Google Gemini 1.5 Flash multimodal intelligence** with **deterministic JavaScript validation rules** to classify paperwork, detect risks, track deadlines, audit financial calculations, and provide an interactive document Q&A assistant.

---

## 📌 Problem Statement

Every month, millions of Indian taxpayers, freelancers, and small businesses receive complex, dense paperwork:
- **Income Tax Intimations (Section 143(1), 139(9), 148)**: Demands and calculation variances often go unnoticed until bank accounts face statutory adjustments under Section 220(2).
- **GST Invoices**: B2B invoices with CGST/SGST/IGST breakdowns, TDS u/s 194C, and e-invoice IRNs are prone to calculation errors or missed GSTR-2B ITC filing windows.
- **Bank Loan Sanction Letters**: Complex floating rate resets (EBR-linked), non-refundable processing fees, and tight 60-day document acceptance deadlines.
- **Tenancy & Lease Agreements**: Onerous 6-month lock-in clauses and deposit forfeiture stipulations hidden in legal boilerplate.

---

## 💡 Solution

DocuSaathi delivers a **hybrid AI + deterministic validation pipeline**:
1. **Multimodal Ingestion**: Accepts PDF, PNG, JPG, and WebP (up to 15MB) with in-memory streaming to protect user privacy.
2. **Gemini Document Understanding**: Zero-shot classification, entity extraction (PAN, GSTIN, invoice #), and understandable plain-language summaries.
3. **Deterministic Rule Validation**: Math and deadlines are never left to LLM hallucinations. Deterministic JavaScript rules audit:
   - $\text{Subtotal} + \text{Tax} \approx \text{Total}$ with tolerance
   - Required tracking identifiers (PAN, GSTIN, Invoice/Notice #)
   - Overdue vs. upcoming deadlines evaluated against the live calendar
4. **Action Plan & Risk Mitigation**: Highlights legal/financial exposure (`LOW`, `MEDIUM`, `HIGH`) and prioritizes concrete next steps with urgency tags.
5. **Interactive Document Q&A**: Lets users chat with their document in natural language (grounded strictly in the document context).
6. **Guaranteed Demo Mode**: Includes an instant **"Try Demo"** path featuring a realistic Indian tax notice scenario that operates reliably even during network or third-party API outages.

---

## 🚀 Key Features

| Feature | Description |
| :--- | :--- |
| **Multimodal Upload** | PDF, PNG, and JPG files streamed into memory; zero persistent local storage on Render. |
| **Gemini AI Understanding** | Extracts issuers, dates, monetary values, and plain-language summaries without rigid templates. |
| **Deterministic Rule Engine** | Pure JavaScript checks for arithmetic parity, missing reference fields, and expired dates. |
| **Objective Risk Scoring** | Normalized severity (`LOW`, `MEDIUM`, `HIGH`) derived deterministically from expired deadlines and calculation variances. |
| **Deadline Tracking** | Extracts obligations, monitors days remaining, and flags overdue actions with priority tags. |
| **Actionable Next Steps** | Numbered sequence of practical steps linking to portals (e.g. incometax.gov.in) with urgency levels. |
| **Document AI Chat** | Conversational assistant strictly grounded on the document with suggested prompt pills and disclaimer. |
| **Live Dashboard Metrics** | Real-time counts of Total Documents, High Risk Documents, Upcoming Deadlines, and Overdue Documents. |
| **Guaranteed Demo Mode** | Instant 1-click test drive clearly labeled as **"Sample / Demo Data"** to guarantee presentation reliability. |

---

## 🏗️ Architecture & Pipeline

```
                               ┌─────────────────────────────────────────┐
                               │          React + Vite Frontend          │
                               │   (Tailwind CSS, React Router, Axios)   │
                               └────────────────────┬────────────────────┘
                                                    │ Bearer JWT / Demo
                                                    ▼
                               ┌─────────────────────────────────────────┐
                               │          Express.js API Server          │
                               │    (Multer memory storage, CORS, Zod)   │
                               └─────────────┬───────────────────────────┘
                                             │
                   ┌─────────────────────────┼─────────────────────────┐
                   ▼                         ▼                         ▼
        ┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
        │  Google Gemini API  │   │ Deterministic Logic │   │  Supabase Database  │
        │ (Multimodal Vision  │   │ (Math, Dates, IDs,  │   │ (PostgreSQL, JSONB, │
        │  & Structured JSON) │   │  Risk Rules Engine) │   │  RLS, Supabase Auth)│
        └─────────────────────┘   └─────────────────────┘   └─────────────────────┘
```

### 13-Stage Document Ingestion Pipeline:
```
1. Authenticated User Verification (Supabase JWT / Demo)
2. File Header & MIME Validation (PDF / JPG / PNG, <= 15MB)
3. In-Memory Buffer Streaming
4. Gemini 1.5 Multimodal Extraction
5. Safe JSON Parsing & Repair Engine
6. Zod Schema Sanitization & Type Coercion
7. Deterministic Arithmetic Check (Subtotal + Tax ≈ Total)
8. Category Required Field Audit (PAN / GSTIN / Invoice #)
9. Deadline Expiration Audit (Upcoming vs Overdue)
10. Objective Risk Level Calculation (LOW / MEDIUM / HIGH)
11. Action Plan Sequencing
12. Database Persistence (Supabase JSONB with RLS)
13. Normalized Response to Frontend
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router v6, Tailwind CSS, Lucide React, Axios, Supabase JS Client
- **Backend**: Node.js (v24), Express.js, Multer (memory storage), `@google/generative-ai`, `@supabase/supabase-js`, Zod, Dotenv, CORS
- **Database & Auth**: Supabase PostgreSQL with `JSONB` columns, Row Level Security (RLS), and Supabase JWT Auth
- **AI**: Google Gemini 1.5 Flash Multimodal Vision & Generation

## 🎨 Visual Identity & Editorial Design System

DocuSaathi employs a **high-contrast editorial monograph & precision document interface** rather than a generic SaaS card layout:
- **Warm Ivory Canvas (`--paper: #F1EBDD`)**: Warm paper tone evoking official archival stationery.
- **Deep Navy (`--navy: #101B2D`)**: High-contrast, authoritative typography and primary accents.
- **Cobalt Blue (`--blue: #3158A8`)**: Muted royal blue reserved for active pipeline stages and section numbering.
- **Thin Divider Rules (`--line: #D5CEC1`)**: Fine horizontal lines organizing data instead of floating bubbly cards.
- **Typography Pairing**:
  - **Display / Headings**: *Playfair Display* (Editorial high-contrast serif for headlines and document titles).
  - **Labels / Data**: *IBM Plex Mono* (Technical monospace for section numbers, metadata, dates, amounts, and buttons).

---

## 📂 Project Structure

```
DocuSaathi/
├── client/                      # Frontend React + Vite app
│   ├── src/
│   │   ├── components/          # Reusable UI (DocumentHeader, ValidationCard, DeadlineCard, ExtractedDataCard, ActionList, ProcessingSteps, RiskBadge)
│   │   ├── context/             # AuthContext (Supabase Auth + Demo Mode bypass)
│   │   ├── layouts/             # AppLayout
│   │   ├── pages/               # Landing, Login, Signup, Dashboard, Upload, Processing, DocumentResult, DocumentChat
│   │   ├── services/            # Axios API client & Supabase browser client
│   │   ├── utils/               # Currency (INR ₹), date, and relative time formatters
│   │   ├── App.jsx              # Routes & ProtectedRoute guards
│   │   ├── main.jsx             # React entry
│   │   └── index.css            # Tailwind directives & design tokens
│   ├── .env.example             # Frontend environment template
│   └── package.json
│
├── server/                      # Backend Express.js API
│   ├── src/
│   │   ├── config/              # Gemini & Supabase clients with fallback detectors
│   │   ├── controllers/         # Document & Dashboard controllers
│   │   ├── middleware/          # Supabase JWT auth & Multer upload middleware
│   │   ├── models/              # Zod validation schemas
│   │   ├── routes/              # Document, Dashboard, and Health routes
│   │   ├── services/            # gemini.service.js, extraction.service.js, validation.service.js, documentService.js
│   │   └── app.js               # Express application configuration & safe logger
│   ├── server.js                # Server entry point (Port 5001)
│   ├── supabase/
│   │   └── schema.sql           # Complete Supabase PostgreSQL migration (RLS, JSONB, indexes, triggers)
│   ├── .env.example             # Backend environment template
│   └── package.json
│
├── package.json                 # Monorepo root workspace configuration
├── .gitignore                   # Security ignore rules
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
```ini
PORT=5001
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key_here
SUPABASE_URL=https://aimdhqfzyzqhsnusaxab.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Frontend (`client/.env`)
```ini
VITE_API_URL=http://localhost:5001/api
VITE_API_BASE_URL=http://localhost:5001/api
VITE_SUPABASE_URL=https://aimdhqfzyzqhsnusaxab.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Security Note:** The `GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` exist exclusively on the backend and are NEVER exposed to the frontend browser bundle.

---

## 🗄️ Supabase Database Setup

1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to the **SQL Editor** in the left navigation.
3. Open [`server/supabase/schema.sql`](file:///m:/Docusaathi/server/supabase/schema.sql) and paste into the editor.
4. Click **Run**. This will:
   - Create `profiles`, `documents`, and `chat_messages` tables.
   - Configure PostgreSQL `JSONB` columns for structured fields, amounts, dates, deadlines, risks, actions, and validation checks.
   - Enforce **Row Level Security (RLS)** so users can only access their own data.
   - Establish the `on_auth_user_created` trigger that automatically provisions user profiles upon signup.

---

## 💻 Local Development Commands

### 1. Install Dependencies
From the repository root:
```bash
npm run install:all
```
*(Or navigate to `server` and `client` individually and run `npm install`)*

### 2. Start Backend Server
```bash
npm run server
# Starts backend on http://localhost:5001
```

### 3. Start Frontend Client
```bash
npm run client
# Starts Vite frontend on http://localhost:5174 (or 5173)
```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Health check & service readiness | No |
| `GET` | `/api/dashboard/stats` | KPIs (Total, High Risk, Upcoming, Overdue) | Yes (Bearer JWT) |
| `POST` | `/api/documents/upload` | Upload PDF/image for Gemini extraction & validation | Yes (Bearer JWT) |
| `GET` | `/api/documents/demo-sample` | Retrieve pre-verified sample document | Yes (Bearer JWT) |
| `GET` | `/api/documents` | Retrieve all documents for authenticated user | Yes (Bearer JWT) |
| `GET` | `/api/documents/:id` | Fetch detailed analysis for single document | Yes (Bearer JWT) |
| `DELETE`| `/api/documents/:id` | Delete document and its chat messages | Yes (Bearer JWT) |
| `POST` | `/api/documents/:id/chat` | Send question and get Gemini-grounded reply | Yes (Bearer JWT) |
| `GET` | `/api/documents/:id/chat` | Retrieve full Q&A chat history for document | Yes (Bearer JWT) |

---

## 🎯 Hackathon Presentation / Demo Instructions

### Option A: 1-Click Guaranteed Demo Mode (Zero-Upload & Offline-Resilient)
1. On the landing page, click **"Try Demo"** (available in the Hero, Navbar, Upload page, and Dashboard).
2. The application loads the certified **Income Tax Notice u/s 143(1)** scenario:
   - Notice banner clearly marked: **"Sample / Demo Data — Pre-computed reference scenario for presentation reliability (Not generated by Gemini)"**
   - Shows:
     - **Document Type**: Tax Notice
     - **Issuer**: Income Tax Department, Government of India (CPC Bengaluru)
     - **Amount**: ₹24,850 Tax Demand Payable
     - **Reference Number**: PAN: ABCDE1234F / Communication Ref No: CPC/2324/1431/9876543210
     - **Important Dates**: Notice Date 2024-09-15, Return Filed 2024-07-28
     - **Validation**: 5 deterministic rule audits (Arithmetic check, Reference check, Issuer check, Deadline audit)
     - **Risk**: HIGH RISK with Section 220(2) interest warning
     - **Deadline**: 2024-10-15 (Flagged as OVERDUE)
     - **Action Plan**: 4 numbered, prioritized steps
     - **Explanation**: Plain-language legal breakdown
3. Click the **"Document Q&A Chat"** tab, click a suggested question (*"What is the deadline?"* or *"What should I do next?"*), and inspect the instant grounded response.

### Option B: Real Multimodal Processing Flow
1. Click **"Analyze Document"** to open the Upload page.
2. Drag and drop any real PDF, JPG, or PNG document (or select an instant preset like GST Invoice or SBI Loan Sanction).
3. Click **"Analyze Document"**.
4. Watch the animated **Processing Screen** execute all 6 stages:
   - ✓ Uploading document
   - ✓ Understanding document
   - ✓ Extracting information
   - ✓ Validating information
   - ✓ Detecting risks
   - ✓ Finding deadlines
5. Inspect the generated analysis, deterministic checks, and ask questions in the document chat.

---

## 🔒 Security & Privacy Standards

- **In-Memory Streaming**: Uploaded document buffers are kept in memory and streamed directly to Gemini without saving files to disk.
- **Log Sanitization**: Raw binary streams, tokens, and API credentials are never output to server console logs.
- **Key Isolation**: The `GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` exist only on the backend.
- **Row-Level Security**: Supabase RLS policies guarantee users can only access their own records.
- **Strict Grounding**: Gemini chat is instructed to answer strictly based on the document context, returning *"I couldn't find that information in this document."* when data is absent.
