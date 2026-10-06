import { patient } from '../data/patient'
import { href, type Route } from '../navigation'

export function AppHeader({ route }: { route: Route }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <a className="brand" href={href('today', route.lens)} aria-label="Precision Health Centre, Today">
          <span className="brand-monogram">PHC</span>
          <span className="brand-name">Precision<br />Health Centre</span>
        </a>
        <nav className="primary-nav" aria-label="Main navigation">
          <a href={href('today', route.lens)} aria-current={route.page === 'today' ? 'page' : route.page === 'blood-pressure' ? 'location' : undefined}>Today</a>
          <a href={href('health-over-time', route.lens)} aria-current={route.page === 'health-over-time' ? 'page' : undefined}>Health over time</a>
        </nav>
        <div className="header-tools">
          <div className="lens-control" role="group" aria-label="Viewing lens">
            <button type="button" aria-pressed={route.lens === 'patient'} onClick={() => { window.location.hash = href(route.page, 'patient', route.filter) }}>Patient</button>
            <button type="button" aria-pressed={route.lens === 'clinician'} onClick={() => { window.location.hash = href(route.page, 'clinician', route.filter) }}>Clinician</button>
          </div>
          <div className="patient-identity">
            <span className="patient-avatar" aria-hidden="true">{patient.initials}</span>
            <span>{patient.name}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
