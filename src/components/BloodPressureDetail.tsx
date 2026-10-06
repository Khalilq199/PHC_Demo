import { baseline, bloodPressure, bpDetail, clinic, formatBP, homeMean, sources, type SourceId } from '../data/clinical'
import { href, type Lens } from '../navigation'
import { BloodPressureChart } from './BloodPressureChart'

export function BloodPressureDetail({ lens, onEvidence }: { lens: Lens; onEvidence: (source?: SourceId) => void }) {
  const clinician = lens === 'clinician'
  return (
    <>
      <a className="back-link" href={href('today', lens)}>Back to Today</a>
      <section className="detail-intro" aria-labelledby="page-heading">
        <div className="detail-title"><h1 id="page-heading">Blood pressure</h1><span className="status status-needs-review"><span className="status-dot" aria-hidden="true" />Needs review</span></div>
        <p className="detail-interpretation">{bpDetail.interpretation}</p>
        <p className="detail-basis">{bpDetail.basis}</p>
        <div className="detail-tools"><span>PHC summary <span className="review-separator">/</span> {bpDetail.review.status} {bpDetail.review.dateLabel}</span><button className="evidence-trigger" type="button" onClick={() => onEvidence()}>Why am I seeing this?</button></div>
      </section>
      <div className="detail-layout">
        <div className="detail-primary">
          <BloodPressureChart onSource={onEvidence} />
          <section className="detail-explanation" aria-labelledby="change-heading"><h2 id="change-heading">What changed</h2><p>{bpDetail.whatChanged}</p><p className="data-note">This is a comparison with your recorded history, not a diagnosis.</p></section>
        </div>
        <aside className="next-plan" aria-labelledby="next-heading">
          <h2 id="next-heading">What happens next</h2>
          <div className="appointment-date"><span>October</span><strong>14</strong><span>2026</span></div>
          <h3>PHC follow-up</h3><p>{bpDetail.nextAction}</p>
          <dl className="owner-line"><dt>Owner</dt><dd>{clinician ? bloodPressure.nextAction.owner : 'You + PHC'}</dd></dl>
          <div className="existing-plan"><h3>Your existing plan</h3><p>{bpDetail.existingPlan}</p></div>
          <button className="text-action" type="button" onClick={() => onEvidence()}>See supporting evidence</button>
        </aside>
      </div>
      {clinician && <section className="clinical-section" aria-labelledby="clinical-heading">
        <div className="section-heading"><h2 id="clinical-heading">Clinical context</h2><span>Same patient story, additional detail</span></div>
        <dl className="clinical-facts">
          <div><dt>Recent home mean</dt><dd>{formatBP(homeMean)} <small>mmHg</small></dd><dd className="data-note">Recent observations: n = {homeMean.count}</dd></div>
          <div><dt>Earlier baseline</dt><dd>{formatBP(baseline)} <small>mmHg</small></dd><dd className="data-note">Baseline observations: n = {baseline.count}</dd></div>
          <div><dt>Latest clinic measurement</dt><dd>{formatBP(clinic)} <small>mmHg</small></dd><dd className="data-note">{clinic.period}</dd></div>
          <div><dt>Trend onset</dt><dd>{bpDetail.onset}</dd><dd className="data-note">Recorded longitudinal context</dd></div>
        </dl>
        <div className="clinical-columns">
          <section><h3>Relevant context</h3><ol className="clinical-context">{bpDetail.context.map((item) => <li key={item.date}><span>{item.date}</span><p>{item.label}</p></li>)}</ol></section>
          <section><h3>Unresolved workflow items</h3><ul className="workflow-list">{bpDetail.workflow.map((item) => <li key={item}>{item}</li>)}</ul><p className="data-note">Open questions for follow-up; no new treatment recommendation.</p></section>
        </div>
        <section className="supporting-records"><h3>Supporting records</h3><div>{[sources[1], sources[0], sources[2]].map((source) => <button key={source.id} type="button" onClick={() => onEvidence(source.id)}><span>{source.title}</span><span>{source.period}</span><span className="source-link-label">View source</span></button>)}</div></section>
      </section>}
    </>
  )
}
