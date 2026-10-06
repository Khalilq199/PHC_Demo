import { vitaminD } from '../data/clinical'

export function VitaminProgression({ expanded = false }: { expanded?: boolean }) {
  return (
    <div className={`vitamin-journey${expanded ? ' vitamin-journey-expanded' : ''}`}>
      <ol className="vitamin-stages" aria-label="Vitamin D results and supplementation, earliest to latest">
        <li><span className="stage-date">May 2026</span><strong>{vitaminD.observations[0].value}<small> nmol/L</small></strong><span className="stage-description">Initial result</span></li>
        <li className="intervention-stage"><span className="stage-date">May 2026</span><strong>Supplementation</strong><span className="stage-description">Added to care plan</span></li>
        <li><span className="stage-date">Jul 2026</span><strong>{vitaminD.observations[1].value}<small> nmol/L</small></strong><span className="stage-description">Follow-up result</span></li>
        <li><span className="stage-date">Sep 2026</span><strong>{vitaminD.observations[2].value}<small> nmol/L</small></strong><span className="stage-description">Latest result</span></li>
      </ol>
      {expanded && <p className="data-note">Results increased after supplementation was added to the care plan. This sequence shows timing, not proof of a cause.</p>}
    </div>
  )
}
