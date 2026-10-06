import { patient, type PriorityId } from './patient'

export const bloodPressure = patient.priorities.find((item) => item.id === 'blood-pressure')!
export const vitaminD = patient.priorities.find((item) => item.id === 'vitamin-d')!
export const baseline = bloodPressure.observations[0]
export const homeMean = bloodPressure.observations[1]
export const clinic = bloodPressure.observations[2]
export const formatBP = (value: { value: number; secondaryValue?: number }) => `${value.value} / ${value.secondaryValue}`

export const homeReadings = [
  { date: '2026-09-12', label: 'Sep 12', value: 136, secondaryValue: 84 },
  { date: '2026-09-13', label: 'Sep 13', value: 137, secondaryValue: 85 },
  { date: '2026-09-14', label: 'Sep 14', value: 140, secondaryValue: 87 },
  { date: '2026-09-15', label: 'Sep 15', value: 136, secondaryValue: 86 },
  { date: '2026-09-16', label: 'Sep 16', value: 139, secondaryValue: 86 },
  { date: '2026-09-17', label: 'Sep 17', value: 138, secondaryValue: 87 },
  { date: '2026-09-18', label: 'Sep 18', value: 140, secondaryValue: 87 },
]

export const bpDetail = {
  interpretation: 'Your recent blood pressure readings have been higher than your earlier 2026 baseline.',
  basis: 'Based on home measurements and your most recent PHC visit.',
  whatChanged: 'Your recent home readings are higher than measurements recorded earlier this year.',
  nextAction: 'Review your recent readings at your PHC appointment.',
  existingPlan: 'Continue recording home measurements according to your existing plan.',
  evidenceInterpretation: 'Recent blood pressure readings differ from your earlier recorded baseline.',
  review: { interpretation: 'PHC summary', status: 'Clinician reviewed', date: '2026-09-20', dateLabel: 'Sep 20, 2026' },
  onset: 'Jul 2026',
  context: [
    { date: 'Jul 2026', label: 'Upward trend begins' },
    { date: 'Sep 12', label: 'Home monitoring entries added' },
    { date: 'Sep 18', label: 'Clinic reading recorded' },
    { date: 'Oct 14', label: 'Scheduled review' },
  ],
  workflow: ['Confirm home measurement consistency', 'Review longitudinal trend during follow-up'],
}

export type SourceId = 'bp-home' | 'bp-clinic' | 'bp-baseline'
export const sources = [
  { id: 'bp-home', title: 'Home blood pressure log', period: 'Sep 12–18, 2026', provenance: 'Patient-recorded home measurements', observation: homeMean, countLabel: '7 readings', valueLabel: 'Average', note: 'Daily readings recorded in the home blood pressure log.' },
  { id: 'bp-clinic', title: 'PHC visit', period: 'Sep 18, 2026', provenance: 'Clinic-recorded measurement', observation: clinic, countLabel: '1 measurement', valueLabel: 'Recorded value', note: 'Blood pressure recorded during the PHC visit. This source contains one measurement.' },
  { id: 'bp-baseline', title: 'Historical measurements', period: 'Apr–Jun 2026', provenance: 'Earlier recorded measurements', observation: baseline, countLabel: '18 measurements', valueLabel: 'Average', note: 'A summary of 18 earlier measurements. Individual readings and their collection settings are not included in this prototype.' },
] satisfies { id: SourceId; title: string; period: string; provenance: string; observation: typeof baseline; countLabel: string; valueLabel: string; note: string }[]

export interface TimelineEvent {
  id: string
  priorityId: PriorityId
  date: string
  dateLabel: string
  title: string
  detail: string
  note?: string
  kind: 'Measurement' | 'Treatment' | 'Imaging' | 'Care plan'
  provenance: string
  sourceId?: SourceId
}

export const timelineEvents: TimelineEvent[] = [
  { id: 'timeline-clinic', priorityId: 'blood-pressure', date: '2026-09-18', dateLabel: 'Sep 18, 2026', title: 'Blood pressure', detail: `${formatBP(clinic)} mmHg recorded during PHC visit`, kind: 'Measurement', provenance: 'PHC visit', sourceId: 'bp-clinic' },
  { id: 'timeline-vd-sep', priorityId: 'vitamin-d', date: '2026-09-12', dateLabel: 'Sep 12, 2026', title: 'Vitamin D', detail: `${vitaminD.observations[2].value} nmol/L`, note: 'Increased from previous result', kind: 'Measurement', provenance: 'Vitamin D result' },
  { id: 'timeline-vd-jul', priorityId: 'vitamin-d', date: '2026-07', dateLabel: 'Jul 2026', title: 'Vitamin D', detail: `${vitaminD.observations[1].value} nmol/L`, kind: 'Measurement', provenance: 'Vitamin D result' },
  { id: 'timeline-supplement', priorityId: 'vitamin-d', date: '2026-05', dateLabel: 'May 2026', title: 'Vitamin D supplementation', detail: 'Added to care plan', kind: 'Treatment', provenance: 'Existing care plan' },
  { id: 'timeline-vd-may', priorityId: 'vitamin-d', date: '2026-05', dateLabel: 'May 2026', title: 'Vitamin D', detail: `${vitaminD.observations[0].value} nmol/L`, kind: 'Measurement', provenance: 'Vitamin D result' },
  { id: 'timeline-thyroid', priorityId: 'thyroid', date: '2025-11', dateLabel: 'Nov 2025', title: 'Thyroid ultrasound', detail: 'Imaging completed', kind: 'Imaging', provenance: 'Recorded imaging event' },
  { id: 'timeline-imaging-plan', priorityId: 'thyroid', date: '2025-11', dateLabel: 'Nov 2025', title: 'Follow-up imaging planned', detail: 'Repeat imaging recorded in care plan', kind: 'Care plan', provenance: 'Existing care plan' },
]
