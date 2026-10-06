export type PriorityId = 'blood-pressure' | 'vitamin-d' | 'thyroid'
export type PriorityStatus = 'needs-review' | 'improving' | 'action-due'

export interface Observation {
  id: string
  date: string
  period: string
  value: number
  secondaryValue?: number
  unit: string
  source: string
  count?: number
}

export interface Priority {
  id: PriorityId
  title: string
  status: PriorityStatus
  patientSummary: string
  clinicianSummary: string | null
  reviewState: 'needs-review' | 'not-specified'
  nextAction: { timing: string; label: string; owner: string }
  observations: Observation[]
  treatment?: string
  evidenceIds: string[]
  relatedEventIds: string[]
}

export interface CareEvent {
  id: string
  priorityId: PriorityId
  date: string
  dateLabel: string
  title: string
  description?: string
}

export const statusLabels: Record<PriorityStatus, string> = {
  'needs-review': 'Needs review',
  improving: 'Improving',
  'action-due': 'Action due',
}

export const patient = {
  id: 'maya-patel-demo',
  name: 'Maya Patel',
  firstName: 'Maya',
  initials: 'MP',
  age: 47,
  synthetic: true,
  snapshotDate: '2026-10-06',
  snapshotLabel: 'Tuesday, October 6, 2026',
  priorities: [
    {
      id: 'blood-pressure',
      title: 'Blood pressure',
      status: 'needs-review',
      patientSummary: 'Your recent blood pressure readings have been higher than your earlier 2026 baseline.',
      clinicianSummary: null,
      reviewState: 'needs-review',
      nextAction: { timing: 'Oct 14', label: 'Review at your PHC visit', owner: 'Maya + PHC' },
      observations: [
        { id: 'bp-baseline', date: '2026-06', period: 'Apr–Jun 2026', value: 126, secondaryValue: 78, unit: 'mmHg', source: 'Earlier baseline', count: 18 },
        { id: 'bp-home', date: '2026-09', period: 'Sep 2026', value: 138, secondaryValue: 86, unit: 'mmHg', source: 'Home readings', count: 7 },
        { id: 'bp-clinic', date: '2026-09-18', period: 'Sep 18, 2026', value: 142, secondaryValue: 88, unit: 'mmHg', source: 'Clinic measurement', count: 1 },
      ],
      evidenceIds: ['bp-baseline', 'bp-home', 'bp-clinic'],
      relatedEventIds: ['bp-visit', 'bp-clinic-added', 'bp-log-updated'],
    },
    {
      id: 'vitamin-d',
      title: 'Vitamin D',
      status: 'improving',
      patientSummary: 'Your level has increased since supplementation began.',
      clinicianSummary: null,
      reviewState: 'not-specified',
      nextAction: { timing: 'November', label: 'Repeat test as planned', owner: 'Not specified in the care plan' },
      observations: [
        { id: 'vd-may', date: '2026-05', period: 'May', value: 21, unit: 'nmol/L', source: 'Vitamin D result' },
        { id: 'vd-july', date: '2026-07', period: 'Jul', value: 38, unit: 'nmol/L', source: 'Vitamin D result' },
        { id: 'vd-sept', date: '2026-09', period: 'Sep', value: 57, unit: 'nmol/L', source: 'Vitamin D result' },
      ],
      treatment: 'Supplementation added in May',
      evidenceIds: ['vd-may', 'vd-july', 'vd-sept'],
      relatedEventIds: ['vd-test', 'vd-result-added'],
    },
    {
      id: 'thyroid',
      title: 'Thyroid follow-up',
      status: 'action-due',
      patientSummary: 'Follow-up imaging in your existing care plan is due this month.',
      clinicianSummary: null,
      reviewState: 'not-specified',
      nextAction: { timing: 'PHC coordinating', label: 'Thyroid ultrasound', owner: 'PHC' },
      observations: [],
      evidenceIds: [],
      relatedEventIds: ['thyroid-imaging', 'thyroid-previous'],
    },
  ] satisfies Priority[],
  upcoming: [
    { id: 'bp-visit', priorityId: 'blood-pressure', date: '2026-10-14', dateLabel: 'Oct 14', title: 'PHC follow-up', description: 'Review blood pressure readings' },
    { id: 'thyroid-imaging', priorityId: 'thyroid', date: '2026-10', dateLabel: 'October', title: 'Thyroid ultrasound', description: 'PHC coordinating' },
    { id: 'vd-test', priorityId: 'vitamin-d', date: '2026-11', dateLabel: 'November', title: 'Vitamin D repeat test' },
  ] satisfies CareEvent[],
  recent: [
    { id: 'bp-clinic-added', priorityId: 'blood-pressure', date: '2026-09-18', dateLabel: 'Sep 18', title: 'Clinic blood pressure reading added' },
    { id: 'vd-result-added', priorityId: 'vitamin-d', date: '2026-09-12', dateLabel: 'Sep 12', title: 'Vitamin D result added' },
    { id: 'bp-log-updated', priorityId: 'blood-pressure', date: '2026-09-01', dateLabel: 'Sep 01', title: 'Home blood pressure log updated' },
  ] satisfies CareEvent[],
  history: [
    { id: 'thyroid-previous', priorityId: 'thyroid', date: '2025-11', dateLabel: 'Nov 2025', title: 'Thyroid ultrasound', description: 'Follow-up imaging recorded in care plan' },
  ] satisfies CareEvent[],
}
