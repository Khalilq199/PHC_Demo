import { useEffect, useState } from 'react'
import type { PriorityId } from './data/patient'

export type Lens = 'patient' | 'clinician'
export type Page = 'today' | 'blood-pressure' | 'health-over-time'
export type Filter = 'all' | PriorityId
export interface Route { page: Page; lens: Lens; filter: Filter }

function readRoute(): Route {
  const [path, query] = window.location.hash.slice(1).split('?')
  const params = new URLSearchParams(query)
  const filter = params.get('filter')
  return {
    page: path === 'blood-pressure' || path === 'health-over-time' ? path : 'today',
    lens: params.get('lens') === 'clinician' ? 'clinician' : 'patient',
    filter: filter === 'blood-pressure' || filter === 'vitamin-d' || filter === 'thyroid' ? filter : 'all',
  }
}

export function href(page: Page, lens: Lens, filter: Filter = 'all') {
  const params = new URLSearchParams()
  if (lens === 'clinician') params.set('lens', lens)
  if (page === 'health-over-time' && filter !== 'all') params.set('filter', filter)
  return `#${page}${params.size ? `?${params}` : ''}`
}

export function useRoute() {
  const [route, setRoute] = useState(readRoute)
  useEffect(() => {
    const update = () => setRoute(readRoute())
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])
  return route
}
