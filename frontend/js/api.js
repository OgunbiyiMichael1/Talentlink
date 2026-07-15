const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://127.0.0.1:5000'
  : 'https://talentlink-giqi.onrender.com'

const getHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

// Wrapper for direct fetch calls (when you need custom config)
const fetchWithAuth = (url, options = {}) => {
  const token = localStorage.getItem('token')
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...(options.headers || {})
    }
  })
}


const api = {
  get: (endpoint) => fetch(`${API_BASE}${endpoint}`, {
    credentials: 'include',
    headers: getHeaders()
  }),
  post: (endpoint, data) => fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify(data)
  }),
  patch: (endpoint, data) => fetch(`${API_BASE}${endpoint}`, {
    method: 'PATCH',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify(data)
  }),
  delete: (endpoint) => fetch(`${API_BASE}${endpoint}`, {
    method: 'DELETE',
    headers: getHeaders(),
    credentials: 'include'
  })
}