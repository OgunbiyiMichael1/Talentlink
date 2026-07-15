// Determine API base URL with sensible defaults and override options.
// Priority: <meta name="api-base"> -> window.__API_BASE -> localhost detection -> production render URL
let API_BASE
try {
  const meta = document.querySelector('meta[name="api-base"]')
  if (meta && meta.content) {
    API_BASE = meta.content
  } else if (window.__API_BASE) {
    API_BASE = window.__API_BASE
  } else if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    API_BASE = 'http://localhost:5000'
  } else {
    API_BASE = 'https://talentlink-giqi.onrender.com'
  }
} catch (e) {
  API_BASE = 'https://talentlink-giqi.onrender.com'
}

const api = {
  get: (endpoint) => fetch(`${API_BASE}${endpoint}`, { credentials: 'include' }),
  post: (endpoint, data) => fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  }),
  patch: (endpoint, data) => fetch(`${API_BASE}${endpoint}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  }),
  delete: (endpoint) => fetch(`${API_BASE}${endpoint}`, {
    method: 'DELETE',
    credentials: 'include'
  })
}