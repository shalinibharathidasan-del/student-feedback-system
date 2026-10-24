// Small fetch wrapper: adds the JWT token and turns error responses into exceptions
export async function api(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('token')
  const res = await fetch(`/api${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

export const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent']

// '2026-10-24 17:20:00' -> '24 Oct 2026'
export const formatDate = (value) =>
  new Date(value.replace(' ', 'T')).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
