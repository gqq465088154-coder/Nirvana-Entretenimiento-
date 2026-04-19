const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = { 'Content-Type': 'application/json', ...options.headers };

  const token = typeof window !== 'undefined' ? localStorage.getItem('nirvana_token') : null;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data?.error?.message || `Request failed: ${res.status}`);
    error.status = res.status;
    throw error;
  }

  return data;
}

export async function getHealth() {
  return request('/api/health');
}

export async function loginUser(email, password) {
  const data = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  if (typeof window !== 'undefined' && data.token) {
    localStorage.setItem('nirvana_token', data.token);
    localStorage.setItem('nirvana_refresh_token', data.refreshToken);
  }
  return data;
}

export async function registerUser(username, email, password) {
  const data = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password })
  });
  if (typeof window !== 'undefined' && data.token) {
    localStorage.setItem('nirvana_token', data.token);
    localStorage.setItem('nirvana_refresh_token', data.refreshToken);
  }
  return data;
}

export async function refreshAccessToken() {
  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('nirvana_refresh_token') : null;
  if (!refreshToken) throw new Error('No refresh token');
  const data = await request('/api/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken })
  });
  if (typeof window !== 'undefined' && data.token) {
    localStorage.setItem('nirvana_token', data.token);
    localStorage.setItem('nirvana_refresh_token', data.refreshToken);
  }
  return data;
}

export async function getDemoToken() {
  return request('/api/auth/token', { method: 'POST', body: JSON.stringify({}) });
}

export async function getSportsbookEvents() {
  return request('/api/sportsbook/events');
}

export async function placeBet(eventId, market, stake) {
  return request('/api/sportsbook/bets', {
    method: 'POST',
    body: JSON.stringify({ eventId, market, stake })
  });
}

export async function getCasinoGames() {
  return request('/api/casino/games');
}

export async function createCasinoSession(gameId) {
  return request('/api/casino/session', {
    method: 'POST',
    body: JSON.stringify({ gameId })
  });
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('nirvana_token');
    localStorage.removeItem('nirvana_refresh_token');
  }
}

export function isLoggedIn() {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('nirvana_token');
}
