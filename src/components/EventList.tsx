import type { CareEvent } from '../data/patient'

export function EventList({ title, id, events }: { title: string; id: string; events: CareEvent[] }) {
  return (
    <section className={`support-section ${id}`} aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`}>{title}</h2>
      <ul className="event-list">
        {events.map((event) => (
          <li key={event.id}>
            <time dateTime={event.date}>{event.dateLabel}</time>
            <div><p className="event-title">{event.title}</p>{event.description && <p className="event-description">{event.description}</p>}</div>
          </li>
        ))}
      </ul>
    </section>
  )
}
