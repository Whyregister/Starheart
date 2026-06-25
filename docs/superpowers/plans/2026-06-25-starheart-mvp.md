# Starheart MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Starheart / 星心 static React MVP from `Starheart_Project_Plan.md`.

**Architecture:** A pure frontend Vite SPA with React Router pages, local React state only, static data modules, and deterministic utility functions for MBTI scoring, zodiac lookup, nickname generation, and lucky numbers. No backend, database, login, persistence, or runtime AI image generation.

**Tech Stack:** React, Vite, TypeScript, Tailwind CSS, React Router, lucide-react, Vitest.

---

### Task 1: Project Skeleton

**Files:**
- Create: `package.json`, `index.html`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, `README.md`, `nginx-starheart.conf`
- Create: `src/main.tsx`, `src/index.css`, `src/app/App.tsx`

- [x] Create Vite/React/TypeScript configuration and scripts.
- [x] Configure Tailwind and app entry.
- [x] Add README and Nginx static deployment notes.

### Task 2: Core Tests

**Files:**
- Create: `src/lib/*.test.ts`

- [x] Write tests for MBTI scoring ties and dominant dimensions.
- [x] Write tests for zodiac date lookup.
- [x] Write tests for nickname uniqueness and count limits.
- [x] Write tests for deterministic lucky numbers and invalid templates.
- [x] Run tests once before implementation and observe missing-module failures.

### Task 3: Core Types, Data, and Algorithms

**Files:**
- Create: `src/types/*.ts`, `src/data/*.ts`, `src/lib/*.ts`

- [x] Implement 32 MBTI questions and 16 MBTI profiles.
- [x] Implement 12 zodiac profiles.
- [x] Implement deterministic PRNG, MBTI scoring, zodiac lookup, nickname generation, lucky number generation, and validators.
- [x] Run unit tests until green.

### Task 4: Components and Pages

**Files:**
- Create: `src/components/**`, `src/pages/**`, `src/app/routes.tsx`

- [x] Implement layout, common controls, profile cards, selectors, generators, template editor, and combo preview.
- [x] Implement routes: `/`, `/mbti`, `/mbti/result`, `/zodiac`, `/cards`, `/nickname`, `/lucky`, `/about`.
- [x] Keep all user data in React state only.

### Task 5: Verification

**Files:**
- Build output: `dist/`

- [x] Install dependencies.
- [x] Run `npm test -- --run`.
- [x] Run `npm run build`.
- [x] Run `pnpm build` if a working pnpm can be installed.
- [x] Start a local dev server and provide the URL.
