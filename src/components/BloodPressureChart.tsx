import { useEffect, useRef, useState } from 'react'
import { baseline, clinic, formatBP, homeMean, type SourceId } from '../data/clinical'

const chartPoints = [
  { observation: baseline, label: 'Earlier baseline', x: 255, source: 'bp-baseline' as const },
  { observation: homeMean, label: 'Recent home average', x: 576, source: 'bp-home' as const },
  { observation: clinic, label: 'Latest clinic', x: 630, source: 'bp-clinic' as const },
]
const y = (value: number) => 220 - (value - 60) * 1.8

export function BloodPressureChart({ onSource }: { onSource: (id: SourceId) => void }) {
  const [selected, setSelected] = useState(1)
  const chartRef = useRef<SVGSVGElement>(null)
  const [chartWidth, setChartWidth] = useState(700)
  useEffect(() => {
    const chart = chartRef.current!
    const observer = new ResizeObserver(([entry]) => setChartWidth(entry.contentRect.width))
    observer.observe(chart)
    return () => observer.disconnect()
  }, [])
  // Reflow the plot rather than shrinking its labels on narrow screens.
  const x = (position: number) => 48 + (position - 48) / 622 * (chartWidth - 68)
  const current = chartPoints[selected]
  return (
    <section className="trend-panel" aria-labelledby="trend-heading">
      <div className="trend-heading"><h2 id="trend-heading">Blood pressure over time</h2><span className="data-note">Apr–Sep 2026 · mmHg</span></div>
      <div className="chart-legend"><span><i className="legend-circle" />Systolic <span className="legend-explainer">(upper number)</span></span><span><i className="legend-square" />Diastolic <span className="legend-explainer">(lower number)</span></span></div>
      <svg ref={chartRef} className="bp-chart" viewBox={`0 0 ${chartWidth} 270`} role="img" aria-labelledby="chart-title chart-description">
        <title id="chart-title">Blood pressure relative to the earlier baseline</title>
        <desc id="chart-description">Earlier baseline: 126 over 78, April to June. September home average: 138 over 86. September 18 clinic: 142 over 88. Dashed lines connect summaries, not individual measurements. Select a record below to inspect it.</desc>
        {[60, 80, 100, 120, 140, 160].map((value) => <g key={value}><line className="chart-grid" x1="48" x2={x(670)} y1={y(value)} y2={y(value)} /><text className="chart-label" x="34" y={y(value) + 4} textAnchor="end">{value}</text></g>)}
        <rect className="baseline-period" x={x(58)} y="30" width={x(255) - x(58)} height="190" />
        <text className="chart-label" x={x(68)} y="22">Baseline period</text>
        {[{ value: baseline.value, recent: homeMean.value, latest: clinic.value, cls: 'systolic' }, { value: baseline.secondaryValue!, recent: homeMean.secondaryValue!, latest: clinic.secondaryValue!, cls: 'diastolic' }].map((series) => <g key={series.cls} className={series.cls}><line x1={x(58)} x2={x(255)} y1={y(series.value)} y2={y(series.value)} /><path d={`M${x(255)} ${y(series.value)} L${x(576)} ${y(series.recent)} L${x(630)} ${y(series.latest)}`} strokeDasharray="5 5" /></g>)}
        {chartPoints.map((point, index) => <g key={point.source} onMouseEnter={() => setSelected(index)}><circle className="systolic-point" cx={x(point.x)} cy={y(point.observation.value)} r={selected === index ? 6 : 4} /><rect className="diastolic-point" x={x(point.x) - (selected === index ? 5 : 3)} y={y(point.observation.secondaryValue!) - (selected === index ? 5 : 3)} width={selected === index ? 10 : 6} height={selected === index ? 10 : 6} /></g>)}
        {([['Apr', 58], ['May', 156], ['Jun', 255], ['Jul', 355], ['Aug', 455], ['Sep', 604]] as const).map(([label, position]) => <text key={label} className="chart-label" x={x(position)} y="250" textAnchor="middle">{label}</text>)}
      </svg>
      <div className="chart-records" role="group" aria-label="Inspect a blood pressure record">
        {chartPoints.map((point, index) => <button key={point.source} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}><span>{point.label}</span><strong>{formatBP(point.observation)} <small>mmHg</small></strong><span>{point.observation.period}</span></button>)}
      </div>
      <div className="chart-inspection" aria-live="polite"><p>{current.label}: <strong>{current.observation.count} {current.observation.count === 1 ? 'measurement' : 'measurements'}</strong></p><button className="text-action" type="button" onClick={() => onSource(current.source)}>View source</button></div>
      <p className="chart-footnote">The shaded period represents the recorded baseline average. Dashed lines connect summaries; individual July and August readings are not shown.</p>
    </section>
  )
}
