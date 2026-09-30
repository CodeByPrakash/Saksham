# Sakhyam-AI — Gamified Design System & Auth UI Specification

## 1. Visual Identity & Mood

The visual language of **Sakhyam-AI** merges an **ambient dark cosmic aesthetic** (inspired by deep obsidian, midnight sapphire, and glowing cyan auroras) with an **empowering gamified livelihood progression theme**. 

Every interaction is designed to feel like an empowering, rewarding quest—turning government livelihood discovery, skill assessment, and vocational training into an exciting, accessible journey.

```
                      ┌──────────────────────────────────────┐
                      │        Sakhyam-AI VISUAL MATRIX         │
                      ├──────────────────┬───────────────────┤
                      │ Aesthetic        │ Midnight Aurora   │
                      │ Texture          │ Frosted Glass     │
                      │ Gamification     │ Livelihood Quests │
                      │ Primary Accent   │ Electric Cyan     │
                      │ Secondary Accent │ Solar Gold (XP)   │
                      │ Auth Provider    │ Google OAuth Only │
                      └──────────────────┴───────────────────┘
```

---

## 2. Color Palette & Tokens

| Token | Hex | Role & Usage |
|---|---|---|
| `bg-obsidian` | `#050811` | Deepest root background canvas |
| `bg-midnight` | `#0B1220` | Secondary background / Card surface |
| `surface-glass` | `rgba(255, 255, 255, 0.06)` | Translucent frosted glass containers |
| `surface-glass-border` | `rgba(255, 255, 255, 0.12)` | Subtle glassmorphic borders |
| `accent-cyan-400` | `#38BDF8` | Primary CTA top gradient & focus ring |
| `accent-cyan-500` | `#0EA5E9` | Interactive glow & highlights |
| `accent-blue-600` | `#2563EB` | Primary CTA bottom gradient |
| `gamify-gold` | `#FBBF24` | XP, Star points, and Achievement Badges |
| `gamify-emerald` | `#10B981` | Verification success, step completions |
| `text-primary` | `#F8FAFC` | Headlines, primary button labels |
| `text-secondary` | `#94A3B8` | Body descriptions, input placeholders |
| `text-muted` | `#64748B` | Footers, legal links, disclaimers |

---

## 3. Application Flow & Screen Hierarchy

### 3.1 Splash & Onboarding Carousel (`src/app/index.tsx`)
- **3 Gamified Slides with Custom Vector Illustrations**:
  1. *Voice Awakening*: "From What You Can Say to What You Learn" (+25 XP)
  2. *Skill Twin*: "Discover Your Skill Twin & Level Up" (+50 XP)
  3. *Local Opportunities*: "Where You Can Earn & Thrive Locally" (+100 XP)
- **Controls**: Skip button, animated pill dots, and glowing circular next button.

### 3.2 Language Selection Screen (`src/app/(onboarding)/language-select.tsx`)
- **Step 1: Voice Medium Setup (+15 XP)**
- English (Active / Default) + upcoming regional dialects previewed.
- Primary CTA: "Continue to Login ➔".

### 3.3 Google OAuth Login Screen (`src/app/(auth)/login.tsx`)
1. **Brand Bar**: Sakhyam-AI glowing emblem + Level 1 Explorer XP badge.
2. **Hero Typography**: "Hi There!" + personalized livelihood quest subtitle.
3. **Core Feature Cards**:
   - ⚡ Instant Skill Discovery (AI voice assessment in regional dialects)
   - 🛡️ Verified NSQF Alignment (SIDH & PM-AJAY mapped pathways)
   - 📍 Local District Opportunities (Training centres & job links)
4. **Google Sign-In Button**:
   - Sole OAuth method: **"Continue with Google"** with official vector logo and frosted glass container.
5. **Social Proof & Community**: "👥 Joined by 100,000+ rural aspirants".

### 3.4 Dashboard & Post-Login Hub (`src/app/(dashboard)/index.tsx`)
1. **User Status & Greeting**: Displays active user name, avatar, and identifier.
2. **Level Progress Bar**: XP progression and daily quest rewards.
3. **Core Livelihood Quests**: Voice Assessment, NSQF Graph, District Map.
4. **Prominent Log Out Button**: 1-tap sign-out returning to splash flow.

---

## 4. Accessibility & Responsiveness

- **Tap Targets**: Minimum 52px height on all interactive buttons.
- **Contrast**: WCAG AA compliance (>4.5:1 text-to-background contrast).
- **Responsive Scaling**: Fluid layout adaptable to entry-level Android devices and high-end iOS displays.
