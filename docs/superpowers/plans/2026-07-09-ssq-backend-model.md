# SSQ Backend And Model Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic lucky-number workflow with a Double Color Ball focused experience backed by a local Node API, cached draw history, and a lightweight statistical generator.

**Architecture:** Keep the React app as the user-facing SPA and add a small Node HTTP server under `server/`. Shared frontend model code lives in `src/lib/ssqModel.ts`; server code has its own JavaScript implementation for API runtime simplicity. Draw history is cached as JSON so the first VPS deployment does not require database setup.

**Tech Stack:** React, TypeScript, Vitest, Node.js built-in HTTP server, JSON file cache, fetch, Vite proxy.

## Global Constraints

- The `/lucky` page keeps zodiac and MBTI selection.
- Custom lucky-number templates are removed from the user interface.
- The generated result is always one Double Color Ball ticket: 6 red balls from 01-33 and 1 blue ball from 01-16.
- Historical red balls must preserve draw order when the source provides it.
- The UI must clearly state that model output is entertainment only and cannot predict winning numbers.

---

### Task 1: Shared SSQ Model

**Files:**
- Create: `src/types/ssq.ts`
- Create: `src/data/sampleSsqDraws.ts`
- Create: `src/lib/ssqModel.ts`
- Test: `src/lib/ssqModel.test.ts`

**Interfaces:**
- Produces: `generateSsqTicket(input: SsqGenerateInput): SsqGeneratedTicket`
- Produces: `normalizeSsqDraws(draws: SsqDraw[]): SsqDraw[]`

- [ ] Write failing tests for draw normalization and deterministic generation.
- [ ] Run `npx vitest run src/lib/ssqModel.test.ts` and confirm missing module failure.
- [ ] Implement minimal model and sample draws.
- [ ] Re-run the test and confirm pass.

### Task 2: Backend API

**Files:**
- Create: `server/ssq-data.mjs`
- Create: `server/ssq-model.mjs`
- Create: `server/index.mjs`
- Modify: `package.json`
- Modify: `vite.config.ts`

**Interfaces:**
- Consumes: cached draw objects with `{ issue, drawDate, redOrder, redSorted, blue, sourceUrl }`
- Produces: `GET /api/ssq/history?limit=100`
- Produces: `POST /api/ssq/generate`
- Produces: `POST /api/ssq/sync`

- [ ] Add a backend using Node's built-in HTTP server.
- [ ] Implement CORS and JSON body parsing.
- [ ] Implement history fetch/cache with sample fallback.
- [ ] Implement generate endpoint using the server-side model.
- [ ] Add Vite proxy to `http://127.0.0.1:8787`.

### Task 3: Lucky Page UI

**Files:**
- Modify: `src/pages/LuckyPage.tsx`
- Modify: `src/index.css`
- Modify: `src/app/AppContext.tsx`

**Interfaces:**
- Consumes: `/api/ssq/history`
- Consumes: `/api/ssq/generate`

- [ ] Remove custom-template UI from the lucky page.
- [ ] Keep zodiac and MBTI selectors.
- [ ] Render generated SSQ balls.
- [ ] Render mobile-friendly recent trend table.
- [ ] Show loading, error, data-source and entertainment states.

### Task 4: Documentation And Verification

**Files:**
- Modify: `detail.md`

- [ ] Update project details with server architecture and new lucky page behavior.
- [ ] Run `npx vitest run`.
- [ ] Run `npm run build`.
