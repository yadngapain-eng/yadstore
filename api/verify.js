// ============================================
// YADSTORE — API: Verify Token
// ============================================

const crypto = require('crypto');

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '').trim();

  if (!token) {
    return res.status(200).json({ valid: false, error: 'No token' });
  }

  const JWT_SECRET = process.env.JWT_SECRET || 'yadstore-dev-secret-change-me';

  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid format');

    const header = parts[0];
    const body = parts[1];
    const signature = parts[2];

    const expected = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(header + '.' + body)
      .digest('base64url');

    if (signature !== expected) throw new Error('Invalid signature');

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (payload.exp && Date.now() > payload.exp) {
      throw new Error('Token expired');
    }

    return res.status(200).json({ valid: true, user: payload.user, role: payload.role });
  } catch (e) {
    return res.status(200).json({ valid: false, error: e.message });
  }
};
