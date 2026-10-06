import { timelineEvents, type SourceId } from '../data/clinical'
import { href, type Route, type Filter } from '../navigation'
import { VitaminProgression } from './VitaminProgression'

const filters: { id: Filter; label: string }[] = [{ id: 'all', label: 'All' }, { id: 'blood-pressure', label: 'Blood pressure' }, { id: 'vitamin-d', label: 'Vitamin D' }, { id: 'thyroid', label: 'Thyroid' }]

export function HealthOverTime({ route, onSource }: { route: Route; onSource: (source: SourceId) => void }) {
  const events = timelineEvents.filter((event) => route.filter === 'all' || event.priorityId === route.filter)
  return (
    <>
      <section className="page-intro timeline-intro" aria-labelledby="page-heading"><h1 id="page-heading">Health over time</h1><p className="intro-copy">See results, treatments, and care events together rather than as separate records.</p></section>
      <div className="timeline-filters" role="group" aria-label="Filter health events">{filters.map((filter) => <button key={filter.id} type="button" aria-pressed={route.filter === filter.id} onClick={() => { window.location.hash = href('health-over-time', route.lens, filter.id) }}>{filter.label}</button>)}</div>
      {route.filter === 'vitamin-d' && <section className="response-story" aria-labelledby="response-heading"><div className="section-heading"><h2 id="response-heading">Supplementation and the results that followed</h2><span className="status status-improving"><span className="status-dot" aria-hidden="true" />Improving</span></div><VitaminProgression expanded /><p className="response-next"><strong>Next in your plan</strong> November · Repeat test as planned</p></section>}
      {route.filter === 'thyroid' && <div className="timeline-plan"><strong>Next in your plan</strong><span>October 2026 · Repeat thyroid ultrasound</span><span>PHC coordinating</span></div>}
      {route.filter === 'blood-pressure' && <div className="timeline-plan"><strong>Next PHC visit: Oct 14</strong><span>Review recent blood pressure readings</span><a className="text-action" href={href('blood-pressure', route.lens)}>View priority</a></div>}
      <div className="timeline-toolbar"><h2>Recorded history</h2><p aria-live="polite" aria-atomic="true">{events.length} {events.length === 1 ? 'event' : 'events'} <span aria-hidden="true">·</span> Most recent first</p></div>
      <ol className="health-timeline" aria-label="Recorded health events">
        {events.map((event) => <li className={`timeline-event${event.kind === 'Treatment' ? ' timeline-treatment' : ''}`} key={event.id}>
          <time dateTime={event.date}>{event.dateLabel}</time><div className="timeline-marker" aria-hidden="true"><span /></div>
          <article className="timeline-event-content"><div className="timeline-event-heading"><h3>{event.title}</h3><span className="event-kind">{event.kind}</span></div><p>{event.detail}</p>{event.note && <p className="data-note">{event.note}</p>}{route.lens === 'clinician' && <p className="event-provenance">Recorded source: {event.provenance}</p>}{event.sourceId && <button type="button" className="text-action" onClick={() => onSource(event.sourceId!)}>View source</button>}</article>
        </li>)}
      </ol>
      <p className="timeline-end">Recorded history since {events[events.length - 1]?.dateLabel}{route.filter !== 'all' ? ' · Showing filtered events' : ''}</p>
    </>
  )
}
