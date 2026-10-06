# PHC patient dashboard

Presentation-ready Precision Health Centre prototype after the Step 3 polish pass: Today, blood pressure detail, evidence/source records, and a longitudinal health timeline, using synthetic data only.

## Run locally

Requires Node.js 22.12+ (or Node.js 20.19+).

```sh
npm install
npm run dev
```

Open the local URL printed by Vite (normally http://127.0.0.1:5173).

```sh
npm run build
npm run preview
```

The production preview normally opens at http://127.0.0.1:4173. Use this build for the presentation; it does not depend on the development hot-reload server.

## Structure

- `src/data/patient.ts`: shared, typed patient story, recorded observations, care-plan actions, and events.
- `src/data/clinical.ts`: shared detail summaries, source provenance, home readings, and timeline events.
- `src/navigation.ts`: hash navigation with persistent lens/filter selection and browser history support.
- `src/components/`: reusable header, priority rows, chart, evidence drawer, and timeline.
- `src/styles.css`: semantic design tokens, desktop layout, and responsive reflow.
- `docs/today-direction.md`: Step 1 composition and scope.
- `docs/step-2-direction.md`: preserved foundation and interaction design decisions.
- `docs/step-2-verification.md`: verification coverage and prototype limitations.
- `docs/final-qa.md`: final results, demo walkthrough, and remaining verification limits.
- `DESIGN.md`: implemented design system.

All dates belong to the fixed October 6, 2026 demo snapshot. Missing clinical interpretations and review states stay explicitly unspecified. No live data, backend, or medical decision logic is present.

## Verification

```sh
npm test
npm run test:production
```

Browser checks use an existing Microsoft Edge installation through Playwright. Ten tests cover navigation, lens/filter state, chart selection and label readability, evidence/source drill-down, keyboard focus, drawer scrolling, source arithmetic, layout collisions, clipping, overflow, reduced motion, and axe accessibility checks. Full journeys run at 1440px, 1024px, 390px, and 320px; additional reflow checks cover 720px, 820px, and 900px. Short 640px-high viewports exercise the drawer. Captures are written to `.impeccable/review/final/` (ignored by Git).

`test:production` builds first and runs the same suite against a fresh production preview on port 4173; stop any existing preview on that port before running it. The standard `npm test` uses the dev server on port 5173. On a machine without Edge, install it with `npx playwright install msedge` or configure another Playwright browser in `playwright.config.ts`.

## Presentation path

1. Start at Today with Patient selected.
2. Open Blood pressure; compare the recorded baseline with the recent summaries and next action.
3. Open **Why am I seeing this?**, then the home log's **View source**.
4. Return to evidence or close the drawer; switch to Clinician for counts, dates, and supporting-record drill-down.
5. Open Health over time and select Vitamin D to show supplementation followed by later results.
6. Return to Patient; the topic remains selected. Browser Back/Forward and refresh preserve the encoded route, lens, and filter.

To reset the demo, open `/#today` without a lens query. On short displays, scroll inside the drawer; Escape and the close button return to its opener.

## Prototype scope

Today is the entry screen. Blood pressure opens its detail view; Vitamin D and Thyroid open their filtered history. Patient/Clinician switching preserves the current page. Clinician adds observation counts, longitudinal context, workflow questions, and supporting-record drill-down. Evidence and source views share one dismissible drawer.

The chart shows recorded summaries, not invented individual readings. Historical raw measurements and July/August samples were not supplied. Vitamin D shows supplementation followed by results without asserting causation. This is a read-only synthetic prototype, not an EHR or a clinical decision system.
