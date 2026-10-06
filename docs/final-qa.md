# Final polish and QA

Scope: `steps/00_CONTEXT.md` and `steps/03_POLISH_AND_QA.md`. Final bounded pass; no new product features or visual redesign.

## Corrections

- Fixed nested-source Back restoring focus below the visible drawer on short screens. The evidence scroll position is saved and restored; direct-source entry also reveals its overview trigger when returning.
- Kept Today highlighted as the parent location while viewing Blood Pressure detail, without mislabeling it as the current page.
- Corrected the filtered count to `1 event`; its complete message is announced atomically.
- Removed the duplicate priority count. Today now uses the supplied earlier-2026-baseline wording consistently with detail, instead of the ambiguous three-month "usual range" phrasing.
- Refined drawer heading/context spacing and source heading/date order. Enlarged the close control to 44px and mobile lens/filter/link controls to at least 44px high.
- Preserved 11px chart labels and reserved the chart's 270px height before measurement. Increased chart footnote/mobile-unit readability without changing the data scale or aggregate semantics.
- Wrapped compact and expanded Vitamin D stages into chronological pairs on mobile, with a wider treatment column to prevent broken words. Improved small-screen dates and explanatory text.
- Reserved the page scrollbar gutter to prevent modal-opening shifts. Drawer width is capped to the available viewport width, including the gutter.
- Removed unused Step 1 progression styling. Added a production-build test command rather than relying only on the dev server.

## Automated verification

- Production TypeScript/Vite build: passed.
- `npm test`: 10 passed against the development server.
- `npm run test:production`: build passed, then 10 passed against a fresh production preview.
- Full care journey at 1440, 1024, 390, and 320 CSS pixels, plus intermediate reflow at 720, 820, and 900. The 720px check represents the available CSS width at 200% zoom on a 1440px display, not an actual browser-zoom test.
- Drawer checks at 1024×640 and 320×640: keyboard loop, nested Back, saved scroll, visible focus, direct-source return, Escape, close, backdrop dismissal, and body-scroll restoration.
- Keyboard activation, skip link, parent-navigation state, Patient/Clinician switching, persistent chart selection, filter retention, Back/Forward, and route refresh.
- Axe checks on Today and all-event history include WCAG 2.2 AA tags; detail, evidence, source, clinician, and Vitamin D checks cover WCAG 2/2.1 A/AA. No violations in tested states. This is not a full accessibility certification.
- No page/console errors on full journeys; no detected horizontal overflow, clipped element content, or structural overlap. Home-reading arithmetic still agrees with the supplied mean.
- One Impeccable scan: two pre-existing advisory documentation gaps (3px focus radius and selection color), no new findings. No visual changes were made solely to silence these advisories.

## Live production walkthrough

Separate from the automated suite, an agent-guided browser session used live clicks, keyboard input, scrolling, Back/Forward, and refresh against `http://127.0.0.1:4173`:

Today → Blood Pressure detail → Why am I seeing this? → Evidence → Home source → Back/close → Clinician → Supporting source → Health over time → Vitamin D → Patient.

Walked at 1440×900 and 1024×640 and inspected rendered captures, including source scrolling and return-focus visibility. Console/page error collection remained empty. Reviewed additional final mobile and intermediate-width captures. Automated captures are in `.impeccable/review/final/`; guided-session captures are in `.impeccable/review/step-3/` (both ignored by Git).

Independent read-only finish review inspected 14 required final captures and sampled source. Final disposition: `ship`; no material fixes requested.

## Remaining limits

- Verified in installed Microsoft Edge/Chromium on Windows. Safari, Firefox, physical touch devices, and assistive-technology speech output were not separately tested.
- CSS reflow was tested; actual browser zoom and OS high-contrast modes were not separately exercised.
- Data is synthetic and fixed to October 6, 2026. No backend, authentication, live records, editing, or clinical recommendations are provided.
- Historical BP observations are available only as a summary; connecting lines do not assert unprovided monthly measurements. Vitamin D chronology is explicitly not proof of causation.
- No known blocking demo issue remains in the tested paths. Stop after this pass; remaining production-system work is outside the prototype scope.
