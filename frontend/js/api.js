const API_BASE = 'https://talentlink-giqi.onrender.com'

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