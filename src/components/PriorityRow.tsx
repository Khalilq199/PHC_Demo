import { statusLabels, type Observation, type Priority } from '../data/patient'
import { baseline, homeMean, bpDetail } from '../data/clinical'
import { href, type Lens } from '../navigation'
import { VitaminProgression } from './VitaminProgression'

function Chevron() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
}

function BloodPressureValue({ observation, label }: { observation: Observation; label: string }) {
  return (
    <div className="bp-measurement">
      <dt>{label}</dt>
      <dd><span className="measurement-value">{observation.value} <span className="value-divider">/</span> {observation.secondaryValue}</span> <span className="unit">{observation.unit}</span></dd>
      <dd className="measurement-period">{observation.period}</dd>
    </div>
  )
}

function PriorityMeasurements({ priority }: { priority: Priority }) {
  if (priority.id === 'blood-pressure') {
    const baseline = priority.observations.find((observation) => observation.id === 'bp-baseline')!
    const recent = priority.observations.find((observation) => observation.id === 'bp-home')!
    const recentY = 27 - (recent.value - baseline.value) * 1.6
    return <><dl className="bp-comparison"><BloodPressureValue observation={recent} label="Recent average" /><BloodPressureValue observation={baseline} label="Earlier baseline" /></dl><div className="inline-trend"><svg viewBox="0 0 164 34" width="164" height="34" role="img" aria-label={`Systolic average rose from ${baseline.value} to ${recent.value} mmHg`}><path d="M6 27H60" /><path d={`M60 27L154 ${recentY}`} strokeDasharray="4 4" /><circle cx="6" cy="27" r="3" /><circle cx="154" cy={recentY} r="3" /></svg><span>Earlier baseline to recent home average</span></div></>
  }
  if (priority.id === 'vitamin-d') {
    return <VitaminProgression />
  }
  return null
}

export function PriorityRow({ priority, lens }: { priority: Priority; lens: Lens }) {
  const destination = priority.id === 'blood-pressure' ? href('blood-pressure', lens) : href('health-over-time', lens, priority.id)
  return (
    <article className="priority-row" aria-labelledby={`${priority.id}-title`}>
      <div className="priority-identity">
        <h3 id={`${priority.id}-title`}><a href={destination}>{priority.title}</a></h3>
        <span className={`status status-${priority.status}`}><span className="status-dot" aria-hidden="true" />{statusLabels[priority.status]}</span>
        {lens === 'clinician' && priority.id === 'blood-pressure' && <p className="clinician-row-note">Summary reviewed<br />{bpDetail.review.dateLabel}</p>}
      </div>
      <div className="priority-summary">
        <p>{priority.patientSummary}</p>
        <PriorityMeasurements priority={priority} />
        {lens === 'clinician' && priority.id === 'blood-pressure' && <p className="clinician-row-note">Home n = {homeMean.count} · Baseline n = {baseline.count} · Onset {bpDetail.onset}</p>}
      </div>
      <div className="priority-next">
        <p className="next-timing">{priority.nextAction.timing}</p>
        <p className="next-description">{priority.nextAction.label}</p>
        <a className="priority-action" href={destination} aria-label={`${priority.id === 'blood-pressure' ? 'View priority' : 'View history'}: ${priority.title}`}>
          {priority.id === 'blood-pressure' ? 'View priority' : 'View history'} <Chevron />
        </a>
      </div>
    </article>
  )
}
