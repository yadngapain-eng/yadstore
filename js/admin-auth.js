/* YADSTORE — ADMIN AUTH */
const ADMIN_LOCAL_USER = 'YADI';
const ADMIN_LOCAL_PASS = 'YADIGANTENG2026';
const TOKEN_KEY = 'yadstore_admin_token';
const USER_KEY = 'yadstore_admin_user';
let API_AVAILABLE = null;

async function checkApi() {
  if (API_AVAILABLE !== null) return API_AVAILABLE;
  try {
    const res = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ping: true }),
    });
    API_AVAILABLE = res.status !== 404;
  } catch (e) { API_AVAILABLE = false; }
  return API_AVAILABLE;
}

async function loginAdmin(username, password) {
  const apiOk = await checkApi();
  if (apiOk) {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        sessionStorage.setItem(TOKEN_KEY, data.token);
        sessionStorage.setItem(USER_KEY, data.user);
        sessionStorage.setItem('yadstore_admin_session', JSON.stringify({ user: data.user, at: Date.now() }));
        return { ok: true, user: data.user, method: 'api' };
      }
      return { ok: false, error: data.error || 'Login gagal' };
    } catch (e) {}
  }
  if (username === ADMIN_LOCAL_USER && password === ADMIN_LOCAL_PASS) {
    sessionStorage.setItem(USER_KEY, username);
    sessionStorage.setItem('yadstore_admin_session', JSON.stringify({ user: username, at: Date.now() }));
    return { ok: true, user: username, method: 'local' };
  }
  return { ok: false, error: 'Username atau password salah' };
}

async function verifyAdminSession() {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (token) {
    const apiOk = await checkApi();
    if (apiOk) {
      try {
        const res = await fetch('/api/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        });
        const data = await res.json();
        return data.valid === true;
      } catch (e) { return false; }
    }
  }
  try {
    const raw = sessionStorage.getItem('yadstore_admin_session');
    if (!raw) return false;
    const s = JSON.parse(raw);
    return Date.now() - s.at < 60 * 60 * 1000;
  } catch (e) { return false; }
}

function logoutAdmin() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem('yadstore_admin_session');
}

window.loginAdmin = loginAdmin;
window.logoutAdmin = logoutAdmin;
window.verifyAdminSession = verifyAdminSession;
