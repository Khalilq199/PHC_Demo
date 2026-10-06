---
name: "PHC patient dashboard"
description: "Restrained clinical interface with editorial priority rows."
colors:
  brand: "#204f46"
  brand-hover: "#173e36"
  brand-soft: "#edf3ef"
  background: "#f6f7f5"
  surface: "#ffffff"
  text: "#253632"
  muted: "#606c66"
  border: "#dce2dc"
  subtle: "#f9faf8"
  amber: "#856026"
  green: "#35694b"
  blue: "#466b84"
  chart-record-border: "#9bafa1"
  evidence-trigger-border: "#a2b3a9"
  plan-separator: "#c9d7cc"
  evidence-backdrop: "rgb(25 42 35 / 27%)"
typography:
  headline: {"fontFamily": "'Public Sans Variable', 'Segoe UI', sans-serif", "fontSize": "clamp(28px, 2.7vw, 36px)", "fontWeight": 570, "lineHeight": 1.25, "letterSpacing": "-1.1px"}
  title: {"fontFamily": "'Public Sans Variable', 'Segoe UI', sans-serif", "fontSize": "17px", "fontWeight": 600, "lineHeight": 1.5, "letterSpacing": "-.3px"}
  body: {"fontFamily": "'Public Sans Variable', 'Segoe UI', sans-serif", "fontSize": "14px", "fontWeight": 400, "lineHeight": 1.65}
  label: {"fontFamily": "'Public Sans Variable', 'Segoe UI', sans-serif", "fontSize": "12px", "fontWeight": 550, "lineHeight": 1.5}
  measurement: {"fontFamily": "'Public Sans Variable', 'Segoe UI', sans-serif", "fontSize": "23px", "fontWeight": 550, "lineHeight": 1.2, "letterSpacing": "-.6px"}
rounded:
  surface: "8px"
  lens: "5px"
  action: "6px"
  circle: "50%"
  intervention-marker: "1px"
spacing:
  inset-4: "4px"
  gap-12: "12px"
  gap-16: "16px"
  gap-20: "20px"
  gap-24: "24px"
  gap-28: "28px"
  gap-32: "32px"
components:
  lens-patient: {"backgroundColor": "{colors.brand}", "textColor": "{colors.surface}", "rounded": "{rounded.lens}", "padding": "8px 12px"}
  lens-patient-hover: {"backgroundColor": "{colors.brand-hover}"}
  lens-clinician: {"backgroundColor": "transparent", "textColor": "{colors.muted}", "rounded": "{rounded.lens}", "padding": "8px 12px"}
  navigation: {"textColor": "{colors.brand}", "padding": "2px 0 0"}
  priority-action: {"backgroundColor": "{colors.surface}", "textColor": "{colors.brand}", "rounded": "{rounded.action}", "padding": "7px 10px"}
  status-needs-review: {"textColor": "{colors.amber}", "typography": "{typography.label}"}
  status-improving: {"textColor": "{colors.green}", "typography": "{typography.label}"}
  status-action-due: {"textColor": "{colors.blue}", "typography": "{typography.label}"}
  priority-sheet: {"backgroundColor": "{colors.surface}", "rounded": "{rounded.surface}"}
  event-list: {"textColor": "{colors.text}"}
  chart-record-selected: {"backgroundColor": "{colors.brand-soft}", "textColor": "{colors.text}", "rounded": "{rounded.action}", "padding": "12px 10px"}
  evidence-trigger: {"backgroundColor": "{colors.surface}", "textColor": "{colors.brand}", "rounded": "{rounded.action}", "padding": "11px 14px"}
  timeline-filter-selected: {"backgroundColor": "{colors.brand}", "textColor": "{colors.surface}", "rounded": "{rounded.action}", "padding": "9px 16px"}
---

# Design System: PHC patient dashboard

## Overview

**Creative North Star: "Restrained clinical editorial rows"**

Calm, readable clinical information uses a light neutral canvas, white surfaces, forest green identity, and Public Sans. Thin separators and compact controls keep attention on the patient story.

The browser implementation is visual authority; there is no image comp. Step 2 preserves the Step 1 shell and Today composition, extending them with live navigation, Patient/Clinician lenses, blood pressure detail, evidence/source records, and filtered history. Step 3 adds final interaction and responsive polish without changing this visual world. Verification and presentation instructions are recorded in `docs/final-qa.md`.

**Key Characteristics:**

- Shared editorial rows with change and next action visible together.
- Text accompanies every status color.
- Flat surfaces, small corners, and minimal decoration.

## Colors

Primary: forest green (`brand`) identifies PHC, active navigation, the selected lens/filter, timing, and keyboard focus. `brand-hover` darkens the selected lens; `brand-soft` backs patient initials, selected chart records, intervention stages, and next plans.
Neutral: `background` is the page canvas; `surface` is the white header, priority sheet, and evidence drawer; `text` carries content; `muted` carries supporting text and unselected controls; `border` separates content; `subtle` backs column headings, unselected chart records, and priority-row hover/focus.
Status accents: amber means Needs review, green means Improving, and blue means Action due. These are semantic labels, not additional brand palettes; no tonal ramps are implemented.
Intentional implemented accents: `chart-record-border` marks selected chart records, priority-action hover, and vitamin-stage rules; `evidence-trigger-border` outlines the evidence action; `plan-separator` divides the existing plan; `evidence-backdrop` dims the page behind the modal. These extend the incumbent palette without replacing it.

## Typography

Public Sans Variable is locally imported in `src/main.tsx`, with Segoe UI and sans-serif fallbacks. The hierarchy is purpose-specific, not a geometric scale.
The headline is the page title; title covers section and priority headings; body describes priority summaries (maximum 53ch); label captures status text. Intro copy uses 14px/1.7 and a 76ch maximum; metadata uses 11–12px.
Measurements use tabular numerals, reducing to 21px at 1264px. Earlier blood pressure readings use weight 450 and muted text. Vitamin stages use 21px/550 readings (28px expanded), with the latest reading green. The page headline becomes 29px at 560px. Chart labels remain 11px at every width; responsive geometry reflows the plot instead of shrinking its text.

## Layout

The white flex header has an 88px minimum height, 1360px outer maximum, and 32px horizontal padding. Main content has a 1200px inner maximum, 32px gutters, and 35px top padding; the intro ends with a 31px gap.
The shared priority sheet uses three columns: `minmax(150px, .82fr) minmax(290px, 1.9fr) minmax(210px, 1fr)`, with 32px gaps and 28px horizontal inset. Rows have 25px vertical padding; column headings have 13px. Supporting event lists form equal columns with a 64px gap and 30px vertical padding.
At 1264px, row gaps/insets become 24px and tracks become `minmax(155px, .85fr) minmax(300px, 1.9fr) minmax(185px, 1fr)`; supporting gaps become 40px. At 1000px, row gaps/insets become 20px and tracks become `150px minmax(250px, 1.8fr) minmax(160px, 1fr)`; the avatar disappears.
At 820px, navigation wraps below the header, column headings disappear, and priority identity spans summary/action columns (`minmax(0, 1fr) minmax(155px, .6fr)`). Main gutters become 24px and top padding 28px. At 560px, rows and support lists stack in document order, next actions gain a top divider, gutters become 20px, and the footer stacks. Body minimum width is 320px.
Blood pressure detail pairs a flexible chart with a 280px plan column and 32px gap. At 1100px the plan becomes 250px, the gap 24px, and panel insets 20px; at 820px it stacks. At 560px chart records stack and trend-panel insets become 16px. The chart's `ResizeObserver` measures actual SVG width, sets `viewBox="0 0 [actual width] 270"`, and remaps x positions with `48 + (position - 48) / 622 * (width - 68)`, preserving the y scale and 11px labels. Its 270px rendered height is reserved before measurement; footnotes are 11px. A stable root scrollbar gutter prevents page shifts when the drawer opens.
The right-edge evidence dialog is 500px wide, capped at 100% of the available viewport width, with height/max-height 100dvh. Header/footer remain visible while the flex body scrolls internally (`min-height: 0`, `overflow: auto`, contained overscroll); 24px/28px body insets become 20px at 560px. Timeline rows use `126px 32px minmax(0, 1fr)` tracks and 20px gaps, becoming `80px 14px minmax(0, 1fr)` with 10px gaps at 560px; both compact and expanded vitamin sequences become two columns (`1fr 1.3fr`) there, keeping the treatment label intact.

## Elevation & Depth

No shadows or gradients. White and subtle surfaces, thin borders, whitespace, and typography establish hierarchy. The native evidence modal occupies the top layer with the translucent evidence backdrop and a left border; it adds no shadow.

## Shapes

The priority sheet and lens group use the surface radius; lens buttons and priority actions use their smaller radii. Borders are 1px. Status dots are 6px circles; patient initials occupy a 34px circle. Status labels have no pill background.
Timeline events use 7px circular markers; treatment events use a 9px square with the intentional 1px intervention-marker radius. The chart distinguishes systolic circles from diastolic squares as well as using color.

## Components

- `AppHeader`: PHC wordmark, live Today/Health over time links, lens group, and patient identity. The active navigation link has a 3px forest underline; Today remains the parent location on blood pressure detail with `aria-current="location"`; links hover on the subtle surface. Both lenses work with `aria-pressed`; switching preserves page and topic. Hash routes retain lens/filter state through refresh and browser history. Clinician adds counts, context, workflow questions, and provenance to the same patient story.
- `PriorityRow`: editorial article with identity/status, summary/measurements, and timing/action. Blood pressure compares recent and earlier readings; vitamin D pairs three readings with supplementation; thyroid shows summary and planned imaging without measurements.
- View priority / View history: live bordered links with forest text, white surface, 36px minimum height, and an inline chevron; hover uses brand-soft and chart-record-border. Blood pressure opens detail; vitamin D and thyroid open their filtered histories. Priority titles share those destinations; rows highlight on hover/focus-within.
- `EventList`: open rows separated by rules; date/content tracks are 78px/remaining width with an 18px gap and 11px vertical padding. At 820px, date tracks become 65px and gaps 12px. No input fields are implemented.
- `BloodPressureChart`: shaded Apr–Jun aggregate baseline, dashed summary connections, and three selectable record buttons with `aria-pressed`. Hovering plot points also selects a record; the live inspection announces its count and View source opens that record. Preserve explicit summary wording: no fabricated July/August measurements or historical raw readings.
- `EvidenceDrawer`: native `<dialog>.showModal()` blocks background interaction and locks body scrolling. Close, Escape, and backdrop click dismiss it; Tab/Shift+Tab loop through controls and dismissal restores opener focus. Sources are nested states in the same modal: changing source resets internal scroll, focuses Back to evidence, and returning restores the prior evidence scroll position and reveals the focused source trigger. The close control is 44px square; context appears below the drawer title, and source dates below provenance headings. Only the seven supplied home readings form a raw-data table. Summary review status remains separate from priority follow-up status.
- `HealthOverTime` / `VitaminProgression`: All, Blood pressure, Vitamin D, and Thyroid filters use `aria-pressed`, a forest selected fill, and an announced event count. History runs most recent first. The Vitamin D response runs earliest to latest: initial result, supplementation, July result, September result; brand-soft distinguishes the intervention and green the latest reading. Its expanded view includes the planned November repeat test and states that timing is not proof of causation.
- Keyboard: skip link reveals on focus; focus-visible uses a 2px brand outline, 5px offset, and 3px corners. Page changes focus main content and reset scroll. Buttons/links generally transition background and text color over 140ms ease; lens/filter buttons use `transition: none` to prevent transient contrast during selection. Reduced motion removes control and priority-row transitions. At 560px and below, lens/filter buttons, priority links, text actions, and Back links are at least 44px high.

## Do's and Don'ts

- Do preserve neutral/white surfaces, forest green, Public Sans, and editorial rows.
- Do keep status text, visible units, dates, and next actions alongside their associated content.
- Do preserve keyboard focus, the skip link, document order, and reduced-motion behavior.
- Don't add gradients, shadows, speculative palettes, or unimplemented components.
- Don't describe the implemented navigation, lenses, priority links, or evidence controls as disabled placeholders.
