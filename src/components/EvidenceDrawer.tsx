import { useEffect, useRef, useState } from 'react'
import { bpDetail, formatBP, homeReadings, sources, type SourceId } from '../data/clinical'

export function EvidenceDrawer({ initialSource, onClose }: { initialSource?: SourceId; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const backRef = useRef<HTMLButtonElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const previousSource = useRef<SourceId | undefined>(initialSource)
  const evidenceScroll = useRef(0)
  const [sourceId, setSourceId] = useState<SourceId | undefined>(initialSource)
  const source = sources.find((item) => item.id === sourceId)

  useEffect(() => {
    const dialog = dialogRef.current!
    const trigger = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      trigger?.focus({ preventScroll: true })
    }
  }, [])

  useEffect(() => {
    if (sourceId) {
      scrollRef.current?.scrollTo(0, 0)
      backRef.current?.focus({ preventScroll: true })
    } else {
      scrollRef.current?.scrollTo(0, evidenceScroll.current)
      // Native focus scrolling also handles direct-source entry and resized drawers.
      if (previousSource.current) document.getElementById(`source-button-${previousSource.current}`)?.focus()
    }
  }, [sourceId])

  return (
    <dialog ref={dialogRef} className="evidence-drawer" aria-modal="true" aria-labelledby="drawer-heading" onKeyDown={(event) => {
      if (event.key !== 'Tab') return
      const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], [tabindex="0"]'))
      const first = controls[0], last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }} onCancel={(event) => { event.preventDefault(); onClose() }} onClick={(event) => { if (event.target === event.currentTarget) { const box = event.currentTarget.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right) onClose() } }}>
      <div className="drawer-header"><div><h2 id="drawer-heading">{source ? source.title : 'Why this is a priority'}</h2><p className="drawer-context">Blood pressure · Supporting evidence</p></div><button className="close-button" type="button" aria-label="Close evidence" onClick={onClose}><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg></button></div>
      <div className="drawer-scroll" ref={scrollRef}>
        {source ? <>
          <button ref={backRef} type="button" className="text-action source-back" onClick={() => setSourceId(undefined)}>Back to evidence</button>
          <section className="source-record" aria-labelledby="source-record-heading">
            <h3 id="source-record-heading">{source.provenance}</h3><p className="record-period">{source.period}</p><p className="source-description">{source.note}</p>
            <div className="source-summary"><span>{source.valueLabel}</span><strong>{formatBP(source.observation)} <small>mmHg</small></strong><span>{source.countLabel}</span></div>
            {source.id === 'bp-home' ? <table className="source-table"><caption>Home blood pressure readings · September 2026</caption><thead><tr><th scope="col">Date</th><th scope="col">Systolic</th><th scope="col">Diastolic</th></tr></thead><tbody>{homeReadings.map((reading) => <tr key={reading.date}><th scope="row"><time dateTime={reading.date}>{reading.label}</time></th><td>{reading.value}</td><td>{reading.secondaryValue}</td></tr>)}</tbody><tfoot><tr><th scope="row">Mean</th><td>{source.observation.value}</td><td>{source.observation.secondaryValue}</td></tr></tfoot></table> : <dl className="record-fields"><div><dt>Record type</dt><dd>{source.id === 'bp-clinic' ? 'PHC visit measurement' : 'Historical measurement summary'}</dd></div><div><dt>Recorded period</dt><dd>{source.period}</dd></div><div><dt>Observations</dt><dd>{source.observation.count}</dd></div></dl>}
            <p className="data-note">Values in mmHg. {source.id === 'bp-home' ? 'Average calculated across all seven supplied readings.' : 'Recorded information; interpretation is shown separately in the evidence overview.'}</p>
          </section>
        </> : <>
          <section className="evidence-interpretation"><h3>PHC interpretation</h3><p>{bpDetail.evidenceInterpretation}</p></section>
          <section aria-labelledby="supporting-heading"><h3 id="supporting-heading">Supporting information</h3><div className="evidence-records">{sources.map((item) => <article className="evidence-record" key={item.id}><h4>{item.title}</h4><p className="record-period">{item.period}</p><p className="record-value">{item.valueLabel}: <strong>{formatBP(item.observation)} <small>mmHg</small></strong></p><div className="record-bottom"><span>{item.countLabel}</span><button id={`source-button-${item.id}`} className="text-action" type="button" aria-label={`View source: ${item.title}`} onClick={() => { evidenceScroll.current = scrollRef.current?.scrollTop ?? 0; previousSource.current = item.id; setSourceId(item.id) }}>View source</button></div></article>)}</div></section>
          <section className="review-section"><h3>Review</h3><dl className="record-fields"><div><dt>Interpretation</dt><dd>{bpDetail.review.interpretation}</dd></div><div><dt>Review status</dt><dd>{bpDetail.review.status}<br /><time dateTime={bpDetail.review.date}>{bpDetail.review.dateLabel}</time></dd></div></dl><p className="data-note">The summary has been reviewed. The planned blood pressure follow-up is still due.</p></section>
        </>}
      </div>
      <div className="drawer-footer">Synthetic patient data for demonstration only.</div>
    </dialog>
  )
}
