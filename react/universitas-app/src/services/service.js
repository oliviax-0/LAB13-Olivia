/**
 * Minimal auth service helper for the React frontend.
 * Posts `{ email, password }` to the Django JWT login endpoint and
 * returns parsed JSON or throws parsed error for the caller to handle.
 */

// By default point to the Django development server. If your backend
// runs on a different host/port in production, change this or pass a
// custom endpoint when calling `login`.
const DEFAULT_BACKEND = 'http://127.0.0.1:8000';

export async function login(email, password, endpoint = DEFAULT_BACKEND + '/api/auth/login/') {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = { message: text };
  }

  if (!res.ok) {
    throw data || { message: res.statusText || 'Login failed' };
  }

  return data;
}

export async function register({ email, full_name, major, password, password_confirmation, username }, endpoint = DEFAULT_BACKEND + '/api/auth/register/') {
  // If username not provided, derive from email local-part
  const derivedUsername = username || (email ? String(email).split('@')[0] : '');
  const body = { email, username: derivedUsername, full_name, major, password, password_confirmation };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = { message: text };
  }

  if (!res.ok) {
    throw data || { message: res.statusText || 'Registration failed' };
  }

  return data;
}

export default { login, register };
