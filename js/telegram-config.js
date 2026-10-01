/* ============================================
   TELEGRAM BOT — SECURE PROXY VERSION
   Token TIDAK di client-side.
   ============================================ */

window.TELEGRAM_CONFIG = {
  PROXY_URL: '/api/notify',
  ENABLED: true,

  sendMessage: function(text) {
    if (!this.ENABLED) return Promise.resolve({ ok: false });
    return fetch(this.PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text })
    })
    .then(function(r) { return r.json(); })
    .catch(function(e) {
      console.warn('[Telegram] error:', e);
      return { ok: false, error: e.message };
    });
  },

  sendPhoto: function(photoData, caption) {
    if (!this.ENABLED) return Promise.resolve({ ok: false });
    return fetch(this.PROXY_URL + '/photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        photo: photoData,
        caption: caption || ''
      })
    })
    .then(function(r) { return r.json(); })
    .catch(function(e) {
      return { ok: false, error: e.message };
    });
  },

  notifyOrder: function(order, pay) {
    if (!this.ENABLED) return Promise.resolve({ ok: false });

    var lines = [];
    lines.push('🛒 <b>ORDER BARU</b>');
    lines.push('━━━━━━━━━━━━━━━━━━━━');
    lines.push('📋 <b>ID:</b> <code>' + order.id + '</code>');
    lines.push('🎮 <b>Layanan:</b> ' + order.item);
    lines.push('📦 <b>Produk:</b> ' + order.product);

    var userData = order.userData || {};
    var keys = Object.keys(userData);
    if (keys.length > 0) {
      lines.push('👤 <b>Data Akun:</b>');
      keys.forEach(function(k) {
        lines.push('  • ' + k + ': <code>' + userData[k] + '</code>');
      });
    }

    lines.push('💰 <b>Total:</b> Rp ' + (order.total || 0).toLocaleString('id-ID'));
    lines.push('💳 <b>Metode:</b> ' + order.payment);
    lines.push('🕐 ' + new Date().toLocaleString('id-ID'));

    var text = lines.join('\n');
    var self = this;

    return this.sendMessage(text).then(function() {
      if (order.proof) {
        var caption = '📸 <b>Bukti Transfer</b> — ' + order.id;
        return self.sendPhoto(order.proof, caption);
      }
    });
  },

  test: function() {
    return this.sendMessage('🧪 Bot aktif via proxy!');
  }
};

console.log('[telegram] loaded (secure proxy mode)');
