<div align="center">

  <img src="public/favicon.svg" alt="FuturePath Logo" width="100" height="100" />

  # FuturePath

  ### *Your skills today. Your possibilities tomorrow.*

  An explainable, privacy-first career exploration and reskilling platform.<br/>
  Empowering learners, working adults, and career switchers to navigate technological disruption with confidence.

  <p align="center">
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-6.1-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://tanstack.com/query"><img src="https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=flat-square&logo=reactquery&logoColor=white" alt="TanStack Query" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg?style=flat-square" alt="License: MIT" /></a>
  </p>

  <p align="center">
    <a href="#-key-features">Key Features</a> •
    <a href="#-user-journey">User Journey</a> •
    <a href="#-explainable-matching-engine">Matching Engine</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-safety--methodology-boundaries">Safety Boundaries</a> •
    <a href="#-license">License</a>
  </p>

</div>

---

## 💡 Overview

**FuturePath** is an interactive, browser-based career navigation tool built for the era of AI and workforce transition. Rather than relying on black-box algorithms or opaque generative text, FuturePath provides **100% deterministic, explainable career matching**, combining your current skills, sector interests, and verified job-market keyword signals into a clear, actionable reskilling roadmap.

All user profile data and learning progress remain strictly inside your browser's local storage.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **🎯 Skills Profile Intake** | Select your capabilities across 6 domains (Technical, AI & Digital, Human, Business, Green, Design) without uploading resumes or PII. |
| **📡 Signal Radar** | Track live & cached keyword mention frequency from public job postings (Remotive) with disclosed methodologies. |
| **🔍 Explainable Matches** | View full formula breakdowns for 14 benchmark roles with explicit readiness, interest, and demand scores. |
| **⚡ Disruption Scenarios** | Compare career viability under **Moderate** vs. **Fast AI disruption** side-by-side. |
| **🗺️ Learning Pathway** | Ordered week-by-week curriculum with free course links (MDN, Kaggle, OpenLearn, Coursera), milestones, and skill badges. |
| **🌍 SDG Impact Mapping** | Direct mapping linking each skill and career to the 17 UN Sustainable Development Goals. |
| **📊 Global Skills Tracker** | Direct exploration links and context from UNESCO-UNEVOC and Lightcast data. |
| **🌐 Trilingual Localization** | Seamless, instant switching between **English**, **Bahasa Melayu**, and **中文 (简体)**. |

---

## 🧭 User Journey

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  1. Profile     │ ───>  │  2. Radar       │ ───>  │  3. Matches     │
│  Select skills, │       │  Observe demand │       │  Rank roles &   │
│  hours & sector │       │  keyword shares │       │  compare gaps   │
└─────────────────┘       └─────────────────┘       └─────────────────┘
                                                             │
                                                             ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  6. Global View │ <───  │  5. SDG Impact  │ <───  │  4. Pathway     │
│  UNESCO-UNEVOC  │       │  Track United   │       │  Week-by-week   │
│  macro context  │       │  Nations goals  │       │  learning steps │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

---

## 🔬 Explainable Matching Engine

FuturePath explicitly rejects black-box scoring. Every recommendation is calculated transparently:

```math
\text{Match Score} = (\text{Readiness} \times W_r) + (\text{Interest} \times 0.15) + (\text{Demand} \times W_d) - \text{Scenario Penalty}
```

- **Readiness Score ($0 - 100$)**: Proportion of a target role's mapped skills that you already possess.
- **Interest Score ($0$ or $100$)**: Boost when your selected sectors align with the career domain.
- **Demand Score ($0 - 100$)**: Average keyword mention frequency across recent public job postings.
- **Scenario Weights ($W_r, W_d$)**:
  - *Moderate Scenario*: $65\%$ Readiness, $15\%$ Interest, $20\%$ Demand ($-8$ pt penalty for routine-task exposed roles).
  - *Fast Disruption Scenario*: $55\%$ Readiness, $15\%$ Interest, $30\%$ Demand ($-18$ pt penalty for routine-task exposed roles).
- *Feed Offline Fallback*: When public feeds are unreachable, scores automatically adjust to $85\%$ Readiness $+ 15\%$ Interest without fabricating statistics.

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.0.0 or higher)
- [npm](https://www.npmjs.com/) (v10 or higher)

### Installation & Run

```bash
# 1. Clone repository
git clone https://github.com/koominqi/Job.git futurepath
cd futurepath

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit [`http://localhost:3000`](http://localhost:3000) in your browser.

### Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Launch local Vite dev server on `http://0.0.0.0:3000` |
| `npm run build` | Compile TypeScript and produce production bundle in `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run TypeScript type checks (`tsc --noEmit`) |

---

## 🛡️ Safety & Methodology Boundaries

We adhere to strict ethical and design boundaries:

| Boundary | Policy |
| :--- | :--- |
| **🔒 Local-Only Storage** | Profiles, study schedules, and pathway checkboxes remain solely in your browser's `localStorage`. No accounts, tracking cookies, or remote databases. |
| **🚫 No Hallucinations** | All matches are produced via audited, deterministic formulas. No Large Language Models (LLMs) generate unverified career predictions. |
| **📈 Evidence, Not Forecasts** | Job signal counts represent cross-sectional keyword shares from Remotive postings, not guaranteed future employment. |
| **🇲🇾 Geographic Disclosure** | Remotive reflects global remote listings; it does not claim to represent the complete national labor force. |
| **📚 Independent Resources** | All pathway courses link directly to free, official sources (Kaggle Learn, OpenLearn, MDN, Microsoft Learn, Cisco, etc.). FuturePath does not gatekeep certificates. |
| **⚖️ Non-Discriminatory** | Matching logic does not evaluate gender, age, nationality, or demographic attributes. |

---

## 📁 Repository Structure

```
futurepath/
├── public/                 # Static assets, SVG icons, screenshot references
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── components/         # Reusable UI components, navigation & Radix primitives
│   │   ├── badges.tsx      # Gamified skill badges & trophy shelves
│   │   ├── bits.tsx        # Meters, skeletons, headers, error boundaries
│   │   ├── guide.tsx       # FAQs, facts, and guidance callouts
│   │   ├── layout.tsx      # Responsive sidebar navigation & language selector
│   │   └── ui/             # Radix UI accessible component primitives
│   ├── hooks/              # Custom React utility hooks
│   ├── lib/
│   │   ├── api-client.ts   # TanStack Query hooks & async API client
│   │   ├── career-catalog.ts # 25 skills, 14 roles, 17 SDGs, 25 learning resources
│   │   ├── career-engine.ts  # Deterministic matching & pathway builder algorithms
│   │   ├── career-signals.ts # Remotive public job feed fetcher & keyword parser
│   │   ├── i18n/           # English, Bahasa Melayu, & Chinese dictionaries
│   │   ├── learning.ts     # Pathway re-planning logic & badge verification
│   │   ├── store.tsx       # Centralized browser persistence store
│   │   └── types.ts        # Comprehensive TypeScript interface definitions
│   ├── pages/              # Primary route views
│   │   ├── home.tsx        # Career snapshot & readiness overview
│   │   ├── profile.tsx     # Skills intake & scenario configuration
│   │   ├── radar.tsx       # Job postings & keyword demand radar
│   │   ├── matches.tsx     # Ranked role matches & scenario comparator
│   │   ├── pathway.tsx     # Ordered learning pathway & badge tracking
│   │   ├── impact.tsx      # UN Sustainable Development Goals (SDGs)
│   │   ├── global-skills-tracker.tsx # UNESCO-UNEVOC external tracker
│   │   └── not-found.tsx   # 404 handler
│   ├── App.tsx             # Root router & application provider tree
│   ├── index.css           # Tailwind CSS theme & typography tokens
│   └── main.tsx            # DOM mount entry point
├── package.json            # Project dependencies & build scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite bundler configuration
└── LICENSE                 # MIT License
```

---

## 🌍 Sustainable Development Goals (SDG) Alignment

FuturePath actively supports the United Nations 2030 Agenda:
- **Goal 4 (Quality Education)**: Expanding access to free, self-paced workplace upskilling.
- **Goal 8 (Decent Work & Economic Growth)**: Helping workers transition into resilient, green, and future-ready roles.
- **Goal 9 (Industry, Innovation & Infrastructure)**: Fostering digital literacy, AI ethics, and technical readiness.
- **Goal 10 (Reduced Inequalities)**: Providing transparent, accessible career guidance free of bias or paywalls.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.
