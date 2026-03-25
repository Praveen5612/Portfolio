import { v4 as uuidv4 } from 'uuid'
import { trackingApi } from '../services/tracking.api.js'

const VISITOR_KEY = 'pf_visitor_id'
const SESSION_KEY = 'pf_session_id'
const SESSION_START_KEY = 'pf_session_start'

export const getVisitorId = () => {
  let id = localStorage.getItem(VISITOR_KEY)
  if (!id) { id = uuidv4(); localStorage.setItem(VISITOR_KEY, id) }
  return id
}

export const getSessionId = () => {
  let id = sessionStorage.getItem(SESSION_KEY)
  if (!id) {
    id = uuidv4()
    sessionStorage.setItem(SESSION_KEY, id)
    sessionStorage.setItem(SESSION_START_KEY, Date.now().toString())
  }
  return id
}

export const initTracker = async () => {
  try {
    const visitorId = getVisitorId()
    const sessionId = getSessionId()
    const referrer = document.referrer
    const urlParams = new URLSearchParams(window.location.search)

    await trackingApi.trackVisitorStart({
      visitor_id: visitorId,
      session_id: sessionId,
      referrer,
      utm_source: urlParams.get('utm_source') || '',
      utm_medium: urlParams.get('utm_medium') || '',
      utm_campaign: urlParams.get('utm_campaign') || '',
      page: window.location.pathname,
    })
    return { visitorId, sessionId }
  } catch { return { visitorId: getVisitorId(), sessionId: getSessionId() } }
}

export const trackPage = async (pagePath, pageTitle) => {
  try {
    await trackingApi.trackPageView({
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
      page_path: pagePath,
      page_title: pageTitle,
      time_on_page: 0,
    })
  } catch {}
}

export const trackEvent = async (eventType, eventData = {}, pagePath) => {
  try {
    await trackingApi.trackEvent({
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
      event_type: eventType,
      event_data: eventData,
      page_path: pagePath || window.location.pathname,
    })
  } catch {}
}

export const trackProjectClick = async (projectId, clickType = 'view') => {
  try {
    await trackingApi.trackProjectClick({
      visitor_id: getVisitorId(),
      project_id: projectId,
      click_type: clickType,
    })
  } catch {}
}

export const endSession = () => {
  const sessionId = sessionStorage.getItem(SESSION_KEY)
  const startTime = sessionStorage.getItem(SESSION_START_KEY)
  if (!sessionId) return
  const timeSpent = startTime ? Math.round((Date.now() - parseInt(startTime)) / 1000) : 0
  
  // Use navigator.sendBeacon for reliable async tracking during page unload
  const data = JSON.stringify({ session_id: sessionId, time_spent: timeSpent });
  const blob = new Blob([data], { type: 'application/json' });
  navigator.sendBeacon('/api/analytics/session-end', blob);
}
