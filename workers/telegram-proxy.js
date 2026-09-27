/**
 * Cloudflare Worker — Telegram Proxy
 * Amankan BOT_TOKEN dari client-side exposure.
 *
 * Deploy: wrangler deploy workers/telegram-proxy.js --name=telegram-proxy
 * Set secret:
 *   wrangler secret put BOT_TOKEN
 *   wrangler secret put CHAT_ID
 *
 * Di frontend, ganti direct call ke:
 *   fetch('/api/notify', { method:'POST', body: JSON.stringify({ text }) })
 */

export default {
  async fetch(request, env) {
    // CORS
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: cors });
    }

    try {
      const body = await request.json();
      const text = body.text || '';
      if (!text) {
        return new Response(JSON.stringify({ ok: false, error: 'text required' }), {
          status: 400,
          headers: { ...cors, 'Content-Type': 'application/json' }
        });
      }

      const url = `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`;
      const tgRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.CHAT_ID,
          text: text,
          parse_mode: 'HTML',
          disable_web_page_preview: true
        })
      });

      const data = await tgRes.json();
      return new Response(JSON.stringify(data), {
        status: tgRes.status,
        headers: { ...cors, 'Content-Type': 'application/json' }
      });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: e.message }), {
        status: 500,
        headers: { ...cors, 'Content-Type': 'application/json' }
      });
    }
  }
};
