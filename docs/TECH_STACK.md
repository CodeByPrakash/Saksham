# Sakhyam-AI — Tech Stack (React Native + Expo)

*This app is built fully on **React Native with Expo**, covering all three user roles — Beneficiary, Field Worker, and Government Officer — as role-gated screens/navigators inside one Expo app, with IVR/WhatsApp as lightweight backend-connected companion channels for beneficiaries without a smartphone.*

---

## Table of Contents

1. [App Structure](#1-app-structure)
2. [Core Expo / React Native Setup](#2-core-expo--react-native-setup)
3. [Navigation & State Management](#3-navigation--state-management)
4. [UI, Styling & Accessibility](#4-ui-styling--accessibility)
5. [Voice, Audio & Speech Layer](#5-voice-audio--speech-layer)
6. [Offline-First Local Data Layer](#6-offline-first-local-data-layer)
7. [Maps & Local Opportunity Intelligence](#7-maps--local-opportunity-intelligence)
8. [Charts & Graph Visuals](#8-charts--graph-visuals)
9. [Authentication & Security](#9-authentication--security)
10. [Push Notifications & Background Sync](#10-push-notifications--background-sync)
11. [Backend Services (API Layer)](#11-backend-services-api-layer)
12. [Conversational AI & Skill Ontology (Server-Side)](#12-conversational-ai--skill-ontology-server-side)
13. [Non-Smartphone Channels (IVR / WhatsApp)](#13-non-smartphone-channels-ivr--whatsapp)
14. [Build, Distribution & OTA Updates (EAS)](#14-build-distribution--ota-updates-eas)
15. [CI/CD](#15-cicd)
16. [Testing](#16-testing)
17. [Suggested Minimal SIH Hackathon Stack](#17-suggested-minimal-sih-hackathon-stack)
18. [Suggested Repo Structure](#18-suggested-repo-structure)
19. [Key Expo Managed-Workflow Caveats](#19-key-expo-managed-workflow-caveats)

---

## 1. App Structure

One Expo app, three role-gated experiences, selected after OTP login based on the user's registered role:

```
                    ONE EXPO APP (React Native)
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                      │
  BENEFICIARY STACK    FIELD WORKER STACK      OFFICER STACK
  Voice interview       Task list               District dashboard
  Livelihood twin       Assisted interview       (mobile charts,
  Pathway/journey        Grievance capture        drill-down reports)
  view                  Offline sync
```

Each role is its own **navigator** (React Navigation stack/tab) mounted conditionally after login, sharing the same Expo project, component library, offline DB layer, and API client — avoiding three separate codebases while keeping bundle size reasonable via lazy-loaded routes.

---

## 2. Core Expo / React Native Setup

| Component | Choice | Notes |
|---|---|---|
| **Framework** | React Native via **Expo (SDK, latest stable)** | Managed workflow strongly preferred for hackathon speed; use **EAS Build** (not the deprecated classic `expo build`) for custom native code when needed |
| **Language** | TypeScript | Strong typing for the skill/recommendation/pathway data models shared with the backend |
| **Package manager** | `npm` or `yarn` | Either is fine; keep it consistent across the team |
| **Routing** | **Expo Router** (file-based routing, built on React Navigation) | Recommended over manually wiring React Navigation — faster to set up role-based route groups (`app/(beneficiary)`, `app/(field-worker)`, `app/(officer)`) |
| **Environment config** | `expo-constants` + `.env` via `react-native-dotenv` or `expo-env` | Keep API base URL, BHASHINI keys, Firebase config out of source |
| **Dev tooling** | Expo Go for rapid iteration during development; EAS Dev Client once native modules (audio, secure storage, maps) are added | Expo Go alone won't support all native modules listed below — a custom dev client build is expected fairly early |

---

## 3. Navigation & State Management

| Component | Fast MVP | Production Scale |
|---|---|---|
| **Navigation** | Expo Router (file-based, wraps React Navigation) | Same, with deep-linking configured for push-notification-driven navigation (e.g., "Day-30 check-in" opens directly to that screen) |
| **Global state** | **Zustand** (lightweight, minimal boilerplate) | Zustand, or Redux Toolkit if the team needs stricter middleware/dev-tools conventions |
| **Server state / data fetching** | **TanStack Query (React Query)** for API calls, caching, retries | Same, paired with the offline queue (§6) for writes made while offline |
| **Forms** | `react-hook-form` (for officer/field-worker structured forms; beneficiary flow is mostly voice-driven, not form-driven) | Same |

---

## 4. UI, Styling & Accessibility

| Component | Choice | Notes |
|---|---|---|
| **Component library** | **React Native Paper** (Material Design, accessible defaults) or **Tamagui** for a more custom design system | Paper is faster to adopt for a hackathon; Tamagui gives better performance/theming control at scale |
| **Styling** | `StyleSheet` API + a small design-token file (colors, spacing, type scale) | NativeWind (Tailwind for RN) if the team prefers utility classes |
| **Icons** | `@expo/vector-icons` (bundled with Expo, no extra linking) | Same |
| **Accessibility** | Large tap targets, `accessibilityLabel`/`accessibilityRole` props on every interactive element, `expo-speech` for "repeat question" TTS fallback, dynamic font scaling support (`react-native` accessibility APIs) | Screen-reader (TalkBack) testing pass before any release |
| **Localization (in-app UI strings)** | `i18next` + `react-i18next` with Hindi/Odia/English string bundles | Content strings only — spoken conversation language is handled by BHASHINI server-side, described below |

---

## 5. Voice, Audio & Speech Layer

| Component | Fast MVP | Production Scale |
|---|---|---|
| **Audio recording** | **`expo-av`** (`Audio.Recording` API) — works in managed workflow, no ejecting needed | Same, or migrate to `expo-audio` (newer Expo audio API) as it stabilizes |
| **Audio playback** (AI voice replies) | `expo-av` (`Audio.Sound`) | Same |
| **On-device TTS fallback** (UI prompts, "repeat question") | **`expo-speech`** (device TTS, works offline, good for English/Hindi on most Android devices) | Same, reserved for simple UI prompts; full conversational TTS still goes through BHASHINI for accurate regional pronunciation |
| **Speech-to-Text (regional languages, conversation)** | Record audio with `expo-av` → upload to backend → backend calls **BHASHINI ASR API** → text returned to app | Same, with streaming chunked upload for lower latency |
| **Text-to-Speech (AI conversational replies)** | Backend calls **BHASHINI TTS API** → returns audio URL/blob → app plays via `expo-av` | Same, with client-side caching (`expo-file-system`) of frequently reused prompt audio to cut repeat API calls |
| **Translation** | BHASHINI Translation API, called server-side | Same |
| **Audio compression before upload** | Record at a lower sample rate/bitrate (configurable in `expo-av` recording options) to keep uploads light on 2G/3G | Adaptive bitrate based on `expo-network` connection type |
| **Permissions** | `expo-av` / `expo-media-library` permission prompts, requested contextually (only when the mic button is first tapped) | Same, plus a clear consent screen explaining why audio is recorded (DPDP-aligned) |

---

## 6. Offline-First Local Data Layer

| Component | Fast MVP | Production Scale |
|---|---|---|
| **Local database** | **`expo-sqlite`** (bundled, no ejecting) | Same, or **WatermelonDB** with the Expo config plugin if the team needs a richer reactive-query layer and is comfortable with a custom dev client |
| **Local file/audio storage** | **`expo-file-system`** (sandboxed app storage) | Same, with encryption via `expo-crypto` before writing sensitive audio to disk |
| **Secure key/token storage** | **`expo-secure-store`** (Keychain/Keystore-backed) | Same |
| **Sync engine** | Manual "Sync now" action + auto-trigger on app foreground/reconnect, using a simple outbox table of pending records | Background sync via `expo-background-fetch` / `expo-task-manager`, with retry/backoff and conflict resolution (last-write-wins + audit log) |
| **Connectivity detection** | **`expo-network` / `@react-native-community/netinfo`** | Same, with network-quality-aware behavior (defer large audio uploads on detected 2G) |
| **Bundled reference/seed data** | Ship a seed JSON (sample NSQF list, nearby training centres, demo opportunities) inside the app bundle via `expo-asset` | Same, versioned and incrementally patched rather than fully re-shipped each release |

---

## 7. Maps & Local Opportunity Intelligence

| Component | Fast MVP | Production Scale |
|---|---|---|
| **In-app maps** | **`react-native-maps`** (Expo config plugin, works with EAS Build) using OpenStreetMap tile overlay or default provider | Same, or Google Maps provider (`PROVIDER_GOOGLE`) if richer POI data justifies the API cost |
| **Heatmap / clustered markers** (district opportunity heatmap) | `react-native-maps` `Marker` clustering via **`react-native-map-clustering`** | Server-pre-aggregated heatmap data for large districts, fetched as lightweight GeoJSON |
| **Distance/routing to training centres** | Backend computes via OSRM; app just renders the returned distance/duration text | Same, cached per centre-district pair |
| **Geolocation** | **`expo-location`**, requested contextually with a clear permission rationale | Same, with low-frequency background location for field-worker route logging (`expo-location` background updates) |

---

## 8. Charts & Graph Visuals

| Component | Choice | Notes |
|---|---|---|
| **Charts (skill-gap bars, district stats)** | **`react-native-gifted-charts`** or **`victory-native`** | Both work well in Expo managed workflow without ejecting |
| **Career/skill graph (node-link diagram)** | **`react-native-svg`** with a custom force-layout drawn manually, or a lightweight pre-computed layout from the backend rendered as static SVG nodes/edges | Full interactive pan/zoom graph library if time allows (e.g., a custom `react-native-svg` + gesture-handler combination) |
| **Journey/progress stepper** | Simple custom component using `react-native-svg` or styled `View`s with connecting lines and checkmarks | Animated transitions via `react-native-reanimated` (Expo-compatible) |
| **Gestures** (map pan/zoom, graph pan/zoom) | **`react-native-gesture-handler`** + **`react-native-reanimated`** (both first-class Expo-supported) | Same |

---

## 9. Authentication & Security

| Component | Fast MVP | Production Scale |
|---|---|---|
| **Auth method** | **Google OAuth 2.0** via **Clerk** (`@clerk/expo` paired with `expo-secure-store` token cache) | Same + optional DigiLocker/Aadhaar e-KYC as a consent-driven verification step for certificate issuance, handled via a backend-mediated web-view flow |
| **Session tokens** | JWT issued by backend, stored via `expo-secure-store` | Same, with short-lived access tokens + refresh-token rotation |
| **Role-based UI gating** | Role claim returned at login decides which Expo Router route group loads | Full RBAC enforced server-side on every API call — client-side gating is UX only, never the security boundary |
| **On-device data encryption** | `expo-secure-store` for tokens; `expo-crypto` to encrypt sensitive fields before writing to `expo-sqlite` | Same, with a documented key-rotation policy |
| **Data minimization** | Delete local raw audio (`expo-file-system.deleteAsync`) once successfully synced and transcribed | Same, with a configurable retention window for audit/dispute purposes |
| **Compliance** | Explicit consent screens (audio recording, location, data use) aligned with India's **DPDP Act, 2023**; in-app "delete my data" request flow | Same, plus a formal in-app grievance-redressal screen |

---

## 10. Push Notifications & Background Sync

| Component | Fast MVP | Production Scale |
|---|---|---|
| **Push notifications** | **`expo-notifications`** with Expo's push notification service (works well with EAS Build; no manual FCM/APNs cert wrangling needed) | Same, or migrate to raw FCM if very high volume / advanced targeting is needed later |
| **Scheduled local reminders** (offline-queued check-ins) | `expo-notifications` local notification scheduling | Same |
| **Background tasks** (periodic sync, dropout-risk polling) | **`expo-background-fetch`** + **`expo-task-manager`** | Same, tuned for battery/OS background-execution limits on Android |

---

## 11. Backend Services (API Layer)

The app is "pure mobile," but AI orchestration, the knowledge graph, and district aggregation still live server-side — invisible to the phone, with the Expo app as the only client consuming a clean JSON/REST (or GraphQL) API.

| Component | Fast MVP | Production Scale |
|---|---|---|
| **BaaS & Realtime Database** | **Convex** (Serverless backend, reactive subscriptions, built-in real-time sync) | Same, integrated with Clerk Auth & custom background workers |
| **API & Server Functions** | Convex Queries, Mutations & Actions | Convex + FastAPI microservices where Python ML/Ontology execution is needed |
| **Conversation/session state** | Convex reactive tables with beneficiary indexing | Resumable state machines & Redis for ultra-low-latency streaming |
| **Recommendation engine** | Convex Actions calling Python/Claude scoring endpoint | Same, with a learned ranking model behind standard API contract |
| **Skill ontology / knowledge graph** | Convex indexed records + Neo4j Community Edition | Neo4j enterprise cluster |
| **Sync API** | Convex `syncBatch` mutation accepting queued local SQLite records | Same, idempotent, chunked for large batches with per-record ack/retry |
| **Vector search** | Convex Vector Search / pgvector on PostgreSQL | Managed vector DB (Pinecone/Qdrant) |
| **Relational / Document data** | **Convex Database** (ACID, automatic TypeScript schemas) | Convex + PostgreSQL for external analytics |

---

## 12. Conversational AI & Skill Ontology (Server-Side)

| Component | Fast MVP | Production Scale |
|---|---|---|
| **LLM** | Claude API (function-calling for structured skill/constraint extraction from ASR transcripts) | Claude for reasoning/explanation + a smaller fine-tuned model for high-volume structured extraction |
| **RAG for scheme/policy answers** | Vector search over curated PM-AJAY/SIDH/NCS documents | Curated, versioned, citation-backed verified-knowledge-base with a human review workflow |
| **Skill ontology data** | Neo4j seeded with sample NCO/NSQF/QP/NOS data | Formal OWL/RDF ontology authored in Protégé, versioned in Git |
| **Guardrails** | Rule-based checks (no income guarantees, no invented schemes) + an LLM self-check pass before the response is sent to the app | Dedicated moderation classifier + policy-as-code guardrails with full audit logging |

---

## 13. Non-Smartphone Channels (IVR / WhatsApp)

Kept as separate, lightweight backend integrations — not part of the Expo app itself — for beneficiaries without a capable smartphone. Both hit the *same* backend conversation/recommendation service as the app, so no logic is duplicated:

| Channel | Stack |
|---|---|
| **IVR (toll-free)** | Exotel / Knowlarity webhook → backend conversation service → BHASHINI ASR/TTS |
| **WhatsApp voice/text** | WhatsApp Cloud API (Meta) → backend conversation service |
| **SMS fallback** (reminders/scheduling) | MSG91 / Twilio, DLT-registered sender ID for India |

---

## 14. Build, Distribution & OTA Updates (EAS)

| Component | Fast MVP | Production Scale |
|---|---|---|
| **Native builds** | **EAS Build** (`eas build --platform android`) — handles signing, no local Android Studio setup required for the team | Same, with separate build profiles (`development`, `preview`, `production`) in `eas.json` |
| **Distribution for demo/pilot** | **EAS Submit** to internal testing track, or share the built APK directly / via Expo's internal distribution link | Google Play Store (required for broad rural distribution + auto-updates); staged rollout (5% → 20% → 100%) |
| **Over-the-air updates** | **`expo-updates`** (EAS Update) — push JS/asset changes (copy fixes, config, minor logic) without a full store release | Same, with rollback support if a bad OTA update is detected |
| **App size / low-end device support** | Keep native modules minimal; test build size on an actual entry-level Android device | Consider Android App Bundles (`.aab`) for Play Store to auto-optimize per-device downloads |

---

## 15. CI/CD

| Component | Fast MVP | Production Scale |
|---|---|---|
| **Mobile CI/CD** | **GitHub Actions** triggering `eas build` on push to `main`, uploading build artifact link as a PR comment | Same, with automated `eas submit` to Play Store internal testing track and Slack/Teams notification on build completion |
| **OTA update pipeline** | Manual `eas update` command run before a demo | GitHub Actions step running `eas update` automatically on merge to `release/*` branches |
| **Backend CI/CD** | GitHub Actions building/deploying the FastAPI service in Docker | Same, staged across dev/staging/prod environments |

---

## 16. Testing

| Layer | Tooling |
|---|---|
| **Unit tests (TS logic, hooks, stores)** | **Jest** + `@testing-library/react-hooks` |
| **Component tests** | **React Native Testing Library** |
| **End-to-end tests** | **Maestro** (works well with Expo dev-client builds, YAML-based flows — good hackathon-speed choice) or Detox for deeper native-level E2E | 
| **Backend API tests** | `pytest` + `httpx` against FastAPI endpoints |
| **Manual field testing** | Install the EAS build on an actual entry-level Android phone over throttled 3G/2G before the demo — catches real offline/audio issues emulators miss |

---

## 17. Suggested Minimal SIH Hackathon Stack

The leanest Expo-based stack that still demonstrates every headline feature end-to-end from one installable build:

```
App framework:            Expo (managed workflow) + React Native + TypeScript
Routing:                  Expo Router
State management:         Zustand + TanStack Query
UI components:            React Native Paper
Audio record/playback:    expo-av
On-device TTS fallback:   expo-speech
Offline DB:                expo-sqlite
Secure storage:            expo-secure-store
Local files (audio cache): expo-file-system
Maps:                       react-native-maps (OSM tiles)
Charts:                     react-native-gifted-charts
Graphs/diagrams:            react-native-svg
Auth:                        Clerk (Google OAuth 2.0 + expo-secure-store)
Push notifications:         expo-notifications
Background sync:            expo-background-fetch + expo-task-manager
Build/distribution:         EAS Build + EAS Update

Backend BaaS & Database:  Convex (serverless real-time database & backend functions)
Conversational AI:         Claude API (function calling for extraction)
Speech (ASR/TTS/Translate): BHASHINI APIs (called from backend / Convex Actions)
Skill ontology/graph:      Convex indexed records + Neo4j Community Edition
Vector search:             Convex Vector Search / pgvector
Hosting:                   Convex Cloud + optional Docker Compose for local ML
CI/CD:                     GitHub Actions (eas build + convex deploy on push)

Companion channels:        WhatsApp Cloud API sandbox (optional, if time allows)
```

This lets the demo show: install one Expo/EAS build → beneficiary voice interview (offline-capable) → skill extraction → NSQF mapping → local opportunity map → explainable recommendation → livelihood journey view → switch to Field Worker mode → switch to Officer mode for a district summary — entirely from one app talking to one lightweight backend.

---

## 18. Suggested Repo Structure

```
Sakhyam-AI-app/                  # Expo project (React Native + TypeScript)
├── app/                          # Expo Router file-based routes
│   ├── (auth)/                   # OTP login
│   ├── (beneficiary)/            # Voice interview, twin, journey, pathways
│   ├── (field-worker)/           # Task list, assisted interview, grievances
│   └── (officer)/                # District dashboard, reports
├── components/                   # Shared UI: voice button, journey stepper, charts
├── hooks/                        # useAudioRecorder, useSync, useRecommendations, etc.
├── services/
│   ├── api/                      # TanStack Query hooks + API client
│   ├── offlineDb/                # expo-sqlite models, outbox/sync logic
│   └── auth/                     # Clerk auth provider, secure-store helpers
├── store/                        # Zustand stores
├── assets/                       # Seed JSON, bundled prompt audio, icons
├── eas.json                      # EAS Build profiles
├── app.json / app.config.ts      # Expo config, plugins
└── tests/                        # Jest + RNTL + Maestro flows

backend/
├── app/
│   ├── conversation_service/
│   ├── ontology_service/
│   ├── recommendation_service/
│   ├── sync_service/
│   └── main.py                   # FastAPI entrypoint
├── data/seed/                    # Sample NCO/NSQF/QP/NOS + district data
└── infra/docker-compose.yml

docs/
├── FEATURES.md
└── TECH_STACK.md
```

---

## 19. Key Expo Managed-Workflow Caveats

Worth knowing before the team commits fully to Expo managed workflow:

- **Expo Go vs. Dev Client:** Expo Go (the quick-start app) cannot run several native modules used here (background tasks, some map/audio configurations). Plan to switch to an **EAS-built custom Dev Client** early — usually within the first day or two of development — rather than discovering this late.
- **`react-native-maps` requires a config plugin** and a custom dev client / EAS build; it will not run in plain Expo Go.
- **Clerk Auth (`@clerk/expo`)** works seamlessly with `expo-secure-store` for token caching across both Expo Go and EAS Dev Client builds.
- **No project should need to "eject"** from Expo for anything in this stack — everything listed here is supported via Expo config plugins and EAS Build, which is why Expo remains a good fit even for a fairly native-module-heavy app like this one.
- **OTA updates (`expo-updates`) only cover JS/asset changes** — any change to native modules/permissions (e.g., adding a new native library) still requires a fresh EAS build and store/APK redistribution, not just an OTA push.