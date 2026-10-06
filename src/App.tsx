import { useEffect, useRef, useState } from 'react'
import { AppHeader } from './components/AppHeader'
import { EventList } from './components/EventList'
import { PriorityRow } from './components/PriorityRow'
import { patient } from './data/patient'
import type { SourceId } from './data/clinical'
import { useRoute } from './navigation'
import { BloodPressureDetail } from './components/BloodPressureDetail'
import { EvidenceDrawer } from './components/EvidenceDrawer'
import { HealthOverTime } from './components/HealthOverTime'

export function App() {
  const route = useRoute()
  const mainRef = useRef<HTMLElement>(null)
  const [evidence, setEvidence] = useState<{ source?: SourceId } | null>(null)
  const previousPage = useRef(route.page)
  useEffect(() => {
    document.title = `${route.page === 'today' ? 'Today' : route.page === 'blood-pressure' ? 'Blood pressure' : 'Health over time'} · PHC`
    if (previousPage.current !== route.page) {
      window.scrollTo(0, 0)
      mainRef.current?.focus({ preventScroll: true })
      previousPage.current = route.page
    }
    setEvidence(null)
  }, [route.page, route.lens, route.filter])
  const openEvidence = (source?: SourceId) => setEvidence({ source })
  return (
    <>
      <a className="skip-link" href="#main-content" onClick={(event) => { event.preventDefault(); mainRef.current?.focus(); mainRef.current?.scrollIntoView() }}>Skip to main content</a>
      <AppHeader route={route} />
      <main id="main-content" ref={mainRef} className={`main-content page-${route.page}`} tabIndex={-1}>
        {route.page === 'today' ? <>
        <section className="page-intro" aria-labelledby="page-heading">
          <div className="intro-topline"><p className="greeting">Good morning, {patient.firstName}</p><time dateTime={patient.snapshotDate}>{patient.snapshotLabel}</time></div>
          <h1 id="page-heading">What matters right now</h1>
          <p className="intro-copy">Years of health information, reduced to the items most relevant to your care and upcoming plan.</p>
          <div className="intro-metadata"><span>{patient.priorities.length} active priorities</span><span>Next PHC visit: <strong>Oct 14</strong></span>{route.lens === 'clinician' && <span>Clinician lens · {patient.name}, {patient.age}</span>}</div>
        </section>
        <section className="priorities" aria-labelledby="priorities-heading">
          <div className="section-heading"><h2 id="priorities-heading">Current priorities</h2></div>
          <div className="priority-sheet">
            <div className="priority-columns" aria-hidden="true"><span>Priority</span><span>What changed</span><span>What happens next</span></div>
            {patient.priorities.map((priority) => <PriorityRow key={priority.id} priority={priority} lens={route.lens} />)}
          </div>
        </section>
        <div className="supporting-information">
          <EventList title="Coming up" id="coming-up" events={patient.upcoming} />
          <EventList title="Recently changed" id="recently-changed" events={patient.recent} />
        </div>
        </> : route.page === 'blood-pressure' ? <BloodPressureDetail lens={route.lens} onEvidence={openEvidence} /> : <HealthOverTime route={route} onSource={openEvidence} />}
      </main>
      <footer className="app-footer"><span>Precision Health Centre</span><p>Synthetic patient data for demonstration only.</p></footer>
      {evidence && <EvidenceDrawer initialSource={evidence.source} onClose={() => setEvidence(null)} />}
    </>
  )
}
