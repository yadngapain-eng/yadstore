// ============================================
// YADSTORE — API: Upload (Cloudinary)
// Environment Variables:
//   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
// ============================================

const crypto = require('crypto');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
  const API_KEY = process.env.CLOUDINARY_API_KEY;
  const API_SECRET = process.env.CLOUDINARY_API_SECRET;

  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return res.status(200).json({
      ok: false,
      error: 'Cloudinary belum dikonfigurasi',
      hint: 'Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET di Vercel Environment Variables',
    });
  }

  try {
    const body = req.body || {};
    const { image, folder } = body;
    if (!image) return res.status(400).json({ ok: false, error: 'No image' });

    const timestamp = Math.floor(Date.now() / 1000);
    const folderName = folder || 'yadstore';

    const paramsToSign = 'folder=' + folderName + '&timestamp=' + timestamp;
    const signature = crypto
      .createHash('sha1')
      .update(paramsToSign + API_SECRET)
      .digest('hex');

    const formData = new URLSearchParams();
    formData.append('file', image);
    formData.append('api_key', API_KEY);
    formData.append('timestamp', timestamp);
    formData.append('folder', folderName);
    formData.append('signature', signature);

    const cloudRes = await fetch(
      'https://api.cloudinary.com/v1_1/' + CLOUD_NAME + '/image/upload',
      { method: 'POST', body: formData }
    );

    const data = await cloudRes.json();
    if (!cloudRes.ok) {
      return res.status(500).json({ ok: false, error: (data.error && data.error.message) || 'Upload gagal' });
    }

    return res.status(200).json({
      ok: true,
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
};
