# Sakhyam-AI — AI Livelihood Intelligence Platform

### Comprehensive Feature Documentation (PM-AJAY / Smart India Hackathon)

**One-line USP:** *"From what a beneficiary can say, to what they can learn, to where they can earn."*

**Core Positioning:** This is **not** an AI voice chatbot that recommends courses. It is an **AI-powered livelihood decision and execution platform** that sits as an *intelligence layer above* the existing government ecosystem (Skill India Digital Hub, NCS, e-Shram, BHASHINI, PM-DAKSH), rather than duplicating it.

The platform answers five questions for every beneficiary:
1. Who is this person?
2. What can this person realistically do?
3. What does the local economy actually need?
4. What is the shortest viable path from their current state to that opportunity?
5. What happens after training?

---

## Table of Contents

1. [Why This Differs From Existing Government Platforms](#1-why-this-differs-from-existing-government-platforms)
2. [System Architecture Overview](#2-system-architecture-overview)
3. [Layer 1 — Beneficiary-Facing Features](#3-layer-1--beneficiary-facing-features)
4. [Layer 2 — Field Worker / NGO Copilot Features](#4-layer-2--field-worker--ngo-copilot-features)
5. [Layer 3 — Government / District Intelligence Features](#5-layer-3--government--district-intelligence-features)
6. [Cross-Cutting Trust, Safety & Accessibility Features](#6-cross-cutting-trust-safety--accessibility-features)
7. [Data Model](#7-data-model)
8. [Recommended Hackathon MVP (10 Features)](#8-recommended-hackathon-mvp-10-features)
9. [Suggested Demo Flow](#9-suggested-demo-flow)
10. [The Real Moat](#10-the-real-moat)
11. [Product Naming](#11-product-naming)
12. [Guardrails — What Not to Claim](#12-guardrails--what-not-to-claim)

---

## 1. Why This Differs From Existing Government Platforms

| Platform | Main Role Today |
|---|---|
| **e-Shram** | National database of unorganised workers (occupation, address, education, skill type) |
| **Skill India Digital Hub (SIDH)** | Courses, training, assessment, certification, employment, entrepreneurship, apprenticeship — 7,000+ training providers, 70+ assessment agencies, 68,000+ employers, 1.5 crore+ candidates |
| **Skill India Assistant** | Existing AI WhatsApp chatbot for course recommendation, nearby centres, jobs, quizzes |
| **National Career Service (NCS)** | Job discovery, internships, career counsellors, AI interview coach, mentoring |
| **BHASHINI** | Multilingual AI/translation/voice infra — 36+ languages, 23+ language services |
| **PM-DAKSH** | Skill training with RPL (Recognition of Prior Learning) and entrepreneurship pathways for target groups |

**Conclusion:** "AI + WhatsApp + course recommendation" and "supports regional languages" are **already solved** by government platforms and are **not** sufficient differentiators. The differentiation must come from an **intelligence and orchestration layer** that connects person-level data, local labour-market data, and government scheme data into one continuous decision-and-execution pipeline — something none of the individual platforms currently do end-to-end.

---

## 2. System Architecture Overview

```
                 YOUR PLATFORM
                  AI LIVELIHOOD
                  INTELLIGENCE
                        │
       ┌────────────────┼─────────────────┐
       │                │                 │
  PERSON MODEL     LOCAL ECONOMY      GOVERNMENT
       │                │              ECOSYSTEM
  aspirations      demand              SIDH
  skills           wages               NCS
  constraints      employers           e-Shram
  education        enterprises         PM-AJAY
  experience       migration           PM-DAKSH
       │
       ▼
  LIVELIHOOD PATHWAY → TRAINING + FINANCE → EMPLOYMENT/ENTERPRISE → OUTCOME MONITORING
```

Three product surfaces sit on top of one shared intelligence core:

- **Layer 1 — Beneficiary:** AI Livelihood Assistant (voice-first)
- **Layer 2 — Field Worker:** Livelihood Copilot
- **Layer 3 — Government:** Livelihood Intelligence Dashboard

---

## 3. Layer 1 — Beneficiary-Facing Features

### 3.1 AI Livelihood Profiling Engine (Primary AI Component)
Instead of asking "which course do you want?", the assistant conducts a **10–15 minute conversational livelihood interview** in the beneficiary's own language/dialect. From a statement like *"खेती करता हूं और थोड़ा बहुत मोटर और पंप का काम भी कर लेता हूं"* the AI derives current occupation, informal skills, latent experience, and a candidate skill cluster — without the beneficiary ever needing to know a formal job-role name.

### 3.2 Hidden / Informal Skill Discovery
Converts informal self-descriptions ("मैं घर में पंखा, मोटर, वायरिंग ठीक कर देता हूं") into structured capabilities (electrical repair, wiring, motor troubleshooting, tool handling, safety awareness), which are then mapped onto NSQF/NOS codes. This is far more valuable than a dropdown occupation picker and is one of the strongest differentiators.

### 3.3 Traditional Skill → Modern Job Mapping
Never tells a traditional worker (weaver, potter, bamboo artisan, tailor, food processor, livestock handler) to abandon their occupation. Instead evaluates whether the existing livelihood can be **upgraded**:
```
Traditional weaving + Digital design + Quality standards + Product finishing
+ Packaging + Digital marketing → Higher-value textile enterprise
```
Aligned with PM-DAKSH's explicit support for Recognition of Prior Learning (RPL) and entrepreneurship pathways.

### 3.4 AI Skill Gap Analysis
Generates a visual current-skill profile and compares it against a target occupation's required-skill profile, producing a plain-language explanation such as: *"You already have 3 of the core skills required. You mainly need solar installation, safety certification and practical training."*

### 3.5 NSQF Career Graph
Rather than a flat course list, builds a **navigable career graph** where every node carries NSQF level, QP code, NOS, prerequisites, training duration, centre, assessment, certification, expected job types, and self-employment potential — creating a technically defensible recommendation engine grounded in the official NSQF/NOS/QP structure.

### 3.6 Local Opportunity Intelligence Engine ★ (Signature Feature)
Converts a recommendation from *"popular course"* to *"27 relevant opportunities within 80 km, district-identified renewable-energy demand, your existing electrical experience, nearest training centre 32 km away."* Combines person data (education, age, skills, experience, mobility, gender, household constraints) with local data (District Skill Development Plans, NCS jobs, training-centre availability, employer demand, wages, seasonal/migration patterns).

### 3.7 Livelihood Opportunity Heatmap
A district-level visual map of sector demand (🟢 high / 🟡 medium / 🔵 low) that, on click, expands into opportunity count, training-centre count, median distance, relevant NSQF roles, training duration, and self-employment potential for that sector.

### 3.8 Constraint-Aware Recommendation Engine
Two people with identical skills can need entirely different recommendations depending on mobility, marital/caregiving status, urgency of income, or physical capability. Recommendation score is computed as a weighted sum:
```
Score = Skill Fit + Interest Fit + Local Demand + Income Potential + Accessibility
        + Training Availability + Mobility Fit + Financial Feasibility + Time-to-Income
```

### 3.9 Explainable "Why This Recommendation?" Panel
Every suggestion is accompanied by a plain-language rationale (existing skills, stated interest, local demand, training distance, NSQF alignment, employment/self-employment options) — essential for government-deployment trust.

### 3.10 Three Parallel Livelihood Pathways
Presents **Fast Income**, **Career Growth**, and **Entrepreneurship** paths side by side instead of a single course recommendation, matching PM-AJAY's comprehensive livelihood approach.

### 3.11 "Time to Income" Simulator
A comparison table (training duration, travel burden, initial cost, income route) across candidate pathways so the beneficiary can weigh trade-offs, without promising guaranteed income.

### 3.12 Training Centre Intelligence
Recommends the actual nearest suitable centre with distance, hostel availability, women-friendliness, batch start date, seat availability, transport, placement support and OJT availability (can integrate with SIDH data).

### 3.13 "Show Me Another Option"
The beneficiary can reject a recommendation conversationally ("मुझे यह काम पसंद नहीं है") and receive alternate ranked options, making the system feel like a counsellor rather than a form.

### 3.14 Family Livelihood Graph
Profiles the household rather than only the individual, and recommends **complementary** livelihood combinations (e.g., father → agriculture upgrade, mother → food-processing enterprise, son → digital marketing, daughter → packaging/accounts) — well suited to GIA's comprehensive livelihood scope.

### 3.15 Enterprise Builder
For self-employment-oriented beneficiaries, auto-generates a mini business plan (location, target customers, equipment cost, working capital, skill gap, financing routes, operating expenses, break-even estimate, risks) — directly supporting PM-AJAY's requirement for financial literacy and basic project-proposal preparation.

### 3.16 Scheme Convergence Engine
Converts a maze of scheme names into a single **Livelihood Action Plan** (complete training → obtain certification → prepare business plan → apply for eligible financial support → register enterprise → get market linkage), addressing the scheme-coordination gap PM-AJAY itself was created to solve.

### 3.17 "One Beneficiary, One Livelihood Passport"
A structured, evolving profile card (education, current work, skills, experience, mobility, preference, language, NSQF progression, verified skills, training completed, certification, employment status) that travels with the beneficiary.

### 3.18 Portable Skill Identity
Beneficiaries never repeat their story from scratch — skills, certificates, experience and employment history persist and compound over time, aligned with SIDH's move toward digitally verifiable, portable credentials.

### 3.19 AI-Generated Certificate Explanation
Translates opaque QP codes into plain-language explanations of what the certification actually qualifies the person to do, with local-language job examples.

### 3.20 Skill-Based Job Matching with Bridge Modules
Matches verified skills (not just course titles) against job requirements, and where a partial gap exists, recommends a short bridge module instead of full retraining.

### 3.21 Local Wage & Opportunity Intelligence
Answers conversational queries like *"अगर मैं यह training करूँ तो मेरे आसपास कहाँ काम मिल सकता है?"* with a ranked list of nearby towns/opportunity counts, distinguishing local employment from migration-required employment.

### 3.22 Migration-Aware Recommendations
Explicitly frames Stay-Local / Nearby-District / Migration options with their respective income potential and relocation burden, respecting the beneficiary's real constraints instead of only maximizing opportunity count.

### 3.23 Seasonal Livelihood Intelligence
For agriculture-linked households, recommends **portfolio livelihoods** across Kharif/off-season (agriculture ↔ food processing / repair work / construction / handicraft / local services) rather than assuming one static occupation.

### 3.24 Household Income Diversification Engine
Analyzes current single-income households and proposes complementary income streams (e.g., agriculture + food processing + livestock + repair services) to build livelihood security rather than single-course enrollment.

### 3.25 Adaptive AI Interviewer
Dynamically decides the next question based on the previous answer (e.g., discovering that a stated hobby "YouTube देखकर सीखा mobile repair" actually includes 2 years of shop experience) instead of running a static, fixed-order form.

### 3.26 Voice-Based Skill Assessment
Conducts spoken diagnostic questions (e.g., "अगर motor start नहीं हो रही है तो आप सबसे पहले क्या check करेंगे?") and scores concept understanding, safety awareness, troubleshooting ability and practical experience — strengthening self-declared skill claims with an assessed signal.

### 3.27 "Livelihood Journey" Visual Progress Tracker
Replaces a complex dashboard with a simple linear journey view: Profile → Skill Assessment → Training → Certification → Job/Business → Income Stability, with clear checkmarks for what's done.

### 3.28 AI Livelihood Digital Twin ★ (Signature / "Killer" Feature)
Every beneficiary gets a continuously-updated dynamic model combining Capability + Aspiration + Constraint, cross-referenced against the Local Economy (jobs/training/enterprise) to produce a live, re-computable AI Pathway. The twin **re-optimizes automatically** as new facts arrive — e.g., recommended training turns out to be too far → system finds an alternate centre or occupation; certification completes → system surfaces job + enterprise options; no employment after 3 months → system triggers bridge training, job matching, and field-worker intervention.

---

## 4. Layer 2 — Field Worker / NGO Copilot Features

### 4.1 Field Worker Task Dashboard
A prioritized daily task list (profiling pending, document verification, training follow-up, placement follow-up, dropout risk, grievances) queryable in natural language (*"Show me people who completed training but don't have employment"*).

### 4.2 Assisted Interview Mode
The field worker opens "Start Beneficiary Interview," hands the phone over, and the AI conducts the entire structured interview — drastically reducing the field worker's own training burden.

### 4.3 AI Dropout Prediction
Flags at-risk beneficiaries before they drop out using signals such as falling attendance, travel difficulty, stipend delay, family constraints, training difficulty, low motivation, or poor trainer interaction — framed as a **support trigger**, not a punitive flag.

### 4.4 Voice-Based Attendance & Check-Ins
Simple yes/no or short conversational voice check-ins ("आप आज training में गए थे?", "Training कैसी चल रही है?") extract attendance, sentiment, and issue signals for the monitoring dashboard without requiring app literacy.

### 4.5 Voice Grievance System
Converts a spoken complaint ("Training centre mein stipend nahi mila") into a structured, categorized, prioritized grievance case with the original voice recording as evidence.

### 4.6 "Call Me Later" Intelligence
If a beneficiary is unavailable ("अभी खेत में हूँ"), the system reschedules and automatically re-initiates the IVR call at the agreed time instead of failing the interaction.

### 4.7 Voice Family-Member Support
Allows a trusted family member or field worker to participate in or relay the interview with explicit consent and role-based access, for beneficiaries uncomfortable with technology.

### 4.8 Offline-First Field Worker Mode
Conducts interviews without connectivity — records locally (encrypted), syncs to the cloud when network returns, then runs AI processing — essential for genuinely rural deployment.

### 4.9 Low-Bandwidth Voice Pipeline
Compresses and processes audio into structured profile data rather than retaining and transmitting large raw audio files, minimizing data cost and storage footprint.

### 4.10 Employer Feedback Loop
Post-placement, employers rate the candidate (technical skills, communication, reliability, digital skills) and this feedback flows back into the recommendation and training-improvement engine, creating a closed-loop labour-intelligence system.

---

## 5. Layer 3 — Government / District Intelligence Features

### 5.1 AI-Generated District Livelihood Report
On demand, produces a full district report: beneficiaries profiled, top aspirations, top local opportunities, skill gaps, training capacity, mismatch analysis, and recommended interventions — directly supporting the decentralized planning mandate of District Skill Committees.

### 5.2 Perspective Plan Generator
Combines district data, beneficiary aspirations, skill gaps, local demand, training capacity, and budget into an AI-assisted sector-wise beneficiary/budget/training-centre/placement projection — connecting the platform directly to official PM-AJAY state/UT perspective planning requirements.

### 5.3 Project Recommendation Engine for GIA
Cross-references high local demand, high beneficiary interest, and available infrastructure (ITI, polytechnic, skill centre, SHG network) to propose ready-to-submit GIA livelihood project packages (training + OJT + toolkits + enterprise support + employer linkage).

### 5.4 Budget-to-Outcome Scenario Simulator
Given a budget figure, simulates multiple allocation scenarios (more beneficiaries/short courses vs. fewer beneficiaries/higher-value training vs. training+enterprise vs. training+placement+retention) and projects beneficiaries reached, completion, certification, placement, enterprise creation, and expected follow-up workload — explicitly framed as a **planning scenario simulator**, not a guaranteed ROI calculator.

### 5.5 Training Centre Quality Scorecard
Tracks enrolled → completed → certified → placed → still-employed-after-6-months → dropout rate per centre, shifting the KPI from "number trained" to **"number successfully transitioned to a sustainable livelihood."**

### 5.6 Funding Leakage / Anomaly Detection
Flags centres whose claimed completion rate diverges sharply from actual attendance/certification/placement data, and flags centres with persistently high dropout, low placement, or high grievance rates.

### 5.7 Placement Authenticity Verification (Sustainable Livelihood Rate)
Tracks 30/90/180-day post-placement status (still employed? same occupation? income level?) to compute a **Sustainable Livelihood Rate** as a stronger outcome metric than a one-time placement rate.

### 5.8 District Demand Heatmap & Skill-Gap View
Government-facing version of the beneficiary opportunity heatmap: aggregated top aspirations, top demand sectors, and quantified skill mismatch per sector, at a glance.

---

## 6. Cross-Cutting Trust, Safety & Accessibility Features

### 6.1 Explainable AI with Confidence Scores
Every recommendation shows a confidence percentage and the specific evidentiary factors behind it, and explicitly states when required local data (e.g., verified wage data) is missing rather than letting the LLM invent it.

### 6.2 AI Safety / Misinformation Guardrails
Never states unverifiable income guarantees (e.g., "this course guarantees ₹30,000/month"); instead reports ranges from verified sources. Architecture explicitly routes scheme/policy answers through a **Policy/Scheme RAG layer** backed by verified government data rather than raw LLM generation.

### 6.3 Fraud & Scam Protection
Beneficiaries can submit a suspicious message, job ad, phone number, or screenshot ("Someone asked me ₹5,000 for a government job") and the AI checks it against verified sources and flags/blocks trust in unverified claims, mirroring NCS's existing fraud warnings.

### 6.4 Dialect Adaptation Layer
Goes beyond language selection (Hindi/Odia/English) into dialect- and locally-specific vocabulary mapping, normalizing varied local expressions for the same occupation into one canonical NCO/skill-taxonomy/NSQF/QP entry — building on BHASHINI's multilingual infrastructure rather than duplicating it.

### 6.5 Skill Ontology Bridge Layer
The critical technical bridge that converts raw local speech ("Motor ka kaam karta hoon") into a formal QP/NSQF code via: local speech → concept extraction → skill ontology → occupation classification → NCO → QP/NOS → NSQF. This ontology is arguably the platform's single strongest technical asset.

### 6.6 Multi-Channel, IVR-First Architecture
Doesn't assume smartphone ownership. Four access channels: (1) Toll-free IVR with language selection, (2) WhatsApp voice notes with voice replies, (3) lightweight smartphone app, (4) assisted kiosk/CSC mode operated by a field worker.

### 6.7 Accessibility Beyond Language
Voice-only navigation, large buttons, minimal text, audio confirmation, "repeat question," slower-speech mode, keypad fallback, visual icons, and screen-reader compatibility for low-literacy usability.

---

## 7. Data Model

```
Beneficiary                     Skill                          Opportunity
 ├── Demographics                ├── Skill taxonomy              ├── Employer
 ├── Education                   ├── NCO mapping                 ├── Location
 ├── Skills                      ├── QP/NOS mapping               ├── Job role
 ├── Experience                  └── NSQF level                   ├── Skills
 ├── Occupation                                                    ├── Wage range
 ├── Aspirations                Training                          └── Demand level
 ├── Mobility                    ├── QP code
 ├── Constraints                 ├── NSQF level                  Pathway
 └── Household                   ├── Duration                     ├── Current state
                                  ├── Centre                       ├── Skill gaps
                                  ├── Seats                        ├── Training
                                  └── Certification                ├── Job
                                                                    ├── Enterprise
                                                                    └── Outcome
```

**Recommended processing pipeline:**
```
Voice Input → Speech-to-Text → Language/Dialect Detection → Conversational AI
   → [Profile Extraction] + [Intent Detection] → Skill Ontology
   → NSQF/QP/NOS Graph → Local Labour Graph → Constraint Engine
   → Recommendation Engine → Explainable Ranking → Voice Response
```
The **LLM** is responsible for conversation, extraction, language handling, reasoning and explanation. **Structured engines** (graph databases, rules engines) are responsible for eligibility, NSQF mapping, constraints, geographic filtering, job matching, and scheme rules — this hybrid design keeps the system auditable and prevents the LLM from hallucinating labour-market facts.

---

## 8. Recommended Hackathon MVP (10 Features)

Build these ten extremely well rather than attempting all features above:

1. 🎙️ **AI Voice Livelihood Interview** — 10-minute conversational profiling in Odia/Hindi/English
2. 🧠 **AI Skill Extraction** — informal speech → structured skills
3. 🧩 **NSQF Skill Mapping** — skills → occupations → QP/NOS → NSQF
4. 📍 **Local Opportunity Engine** — real local jobs, training, employers, sectors
5. 🎯 **Explainable Recommendations** — visible reasoning behind each pathway
6. 🛣️ **Livelihood Pathway** — skills → skill gap → training → certification → job/enterprise
7. 💰 **Enterprise Planner** — auto-generated basic business plan
8. 📞 **Voice Follow-Up** — automated post-training check-ins
9. 🧑‍💼 **District Dashboard** — demand, aspirations, skill gaps, training capacity, placement, dropout
10. 🤖 **AI Livelihood Twin** — continuously-updated beneficiary journey model

---

## 9. Suggested Demo Flow

1. Beneficiary calls the AI Livelihood Assistant (📞 IVR); AI explains the ~10-minute process in the local language.
2. Beneficiary describes current work informally ("मैं खेती करता हूं और motor pump भी ठीक कर लेता हूं") → AI extracts agriculture + electrical basics + motor/pump repair.
3. AI asks about mobility ("क्या आप गांव से बाहर जाकर काम कर सकते हैं?") → constraint captured (e.g., 20–30 km).
4. AI asks about employment preference (job vs. self-employment) → preference captured.
5. System combines skills + NSQF + local demand + training + mobility + preference to generate **three ranked, explained pathways** (e.g., Solar PV Technician 88% fit / Pump Technician 91% fit / Electrical Service Technician 83% fit), each annotated with local demand and self-employment potential.
6. Beneficiary selects a pathway; AI explains the specific skill gap and produces a month-by-month livelihood plan (training → OJT → certification → local employment/enterprise → 6-month follow-up).
7. **Pivot to the government dashboard**: show the same data aggregated at district level (top aspirations, local demand, skill mismatch, training capacity) with an AI-generated planning recommendation (e.g., "Increase solar and electrical training capacity in Block X, prioritize candidates with existing electrical experience") — demonstrating policy intelligence, not just conversational AI.

---

## 10. The Real Moat

The defensible advantage is **not** the LLM call — anyone can call an LLM API. The moat is the combination of:

1. **Indian livelihood ontology** — local occupation → skills → NCO → NSQF/QP/NOS mapping
2. **Beneficiary profile graph** — structured aspirations, skills, and constraints
3. **District opportunity graph** — jobs + enterprises + training + infrastructure + demand
4. **Livelihood pathway engine** — person → skill gap → training → employment/enterprise
5. **Outcome feedback loop** — training → job → retention → income → employer feedback
6. **Government workflow integration** — beneficiary → field worker → district → state → PM-AJAY planning
7. **Voice/dialect layer** — genuine low-literacy, low-connectivity accessibility

---

## 11. Product Naming

Recommended: **Sakhyam-AI — AI Livelihood Intelligence Platform**

Other candidate names considered: Sakhyam-AI Saathi, Kaushal Saathi AI, KaushalSetu, Rozgar Saathi, Sakhyam-AIMitra, KaushalPath, Sakhyam-AI Navigator.

**Proposed product architecture under the Sakhyam-AI brand:**
```
Sakhyam-AI
├── 01. AI Voice Assistant (IVR / WhatsApp Voice / App / Assisted Mode)
├── 02. Beneficiary Intelligence (Profile, Skill Extraction, Assessment, Constraints, Twin)
├── 03. Skill Intelligence (Ontology, NSQF, QP/NOS, NCO, Gap Engine)
├── 04. Opportunity Intelligence (Jobs, Employers, Demand, Training Centres, Enterprise)
├── 05. Recommendation Engine (Job / Training / Enterprise / Migration-aware / Family pathways)
├── 06. Government Convergence (Schemes, Finance, PM-AJAY, SIDH, NCS, e-Shram)
├── 07. Post-Training (Placement, OJT, 30/90/180-day tracking, Employer feedback, Retention)
├── 08. Field Operations (Copilot, Verification, Grievances, Intervention)
└── 09. Government Intelligence (District Dashboard, Demand Heatmap, Perspective Plan, Budget Simulation, Impact Monitoring)
```

---

## 12. Guardrails — What Not to Claim

- **Do not** headline "AI prediction of income" — income depends on location, employer, experience, seasonality, migration, capital, and market conditions. Use **"evidence-based livelihood pathway"** with visible underlying evidence instead.
- **Do not** claim the AI "guarantees placement." Use: *"Our platform connects training pathways with verified opportunities and tracks post-training outcomes."*
- **Do not** let the LLM answer scheme/policy questions from memory — always route through a verified-data RAG layer.
- **Do not** position the product as replacing SIDH, NCS, e-Shram, or BHASHINI — position it as the **intelligence and orchestration layer** that fits into and strengthens the existing ecosystem.