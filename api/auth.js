// ============================================
// YADSTORE — API: Login
// Environment Variables (set di Vercel):
//   ADMIN_USER, ADMIN_PASS, JWT_SECRET
// ============================================

const crypto = require('crypto');

module.exports = function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};
  const { username, password } = body;

  const ADMIN_USER = process.env.ADMIN_USER || 'YADI';
  const ADMIN_PASS = process.env.ADMIN_PASS || 'YADIGANTENG2026';
  const JWT_SECRET = process.env.JWT_SECRET || 'yadstore-dev-secret-change-me';

  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    return res.status(401).json({ ok: false, error: 'Username atau password salah' });
  }

  // Buat JWT sederhana
  const payload = {
    user: username,
    role: 'admin',
    iat: Date.now(),
    exp: Date.now() + 60 * 60 * 1000,
  };

  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const bodyPart = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(header + '.' + bodyPart)
    .digest('base64url');
  const token = header + '.' + bodyPart + '.' + signature;

  return res.status(200).json({
    ok: true,
    token: token,
    user: username,
    expiresIn: 3600,
  });
};
