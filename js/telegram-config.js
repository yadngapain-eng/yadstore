/* TELEGRAM BOT — SECURE PROXY VERSION */
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
      return { ok: false };
    });
  },

  sendPhoto: function(photoData, caption) {
    if (!this.ENABLED) return Promise.resolve({ ok: false });
    return fetch(this.PROXY_URL + '/photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photo: photoData, caption: caption || '' })
    })
    .then(function(r) { return r.json(); })
    .catch(function(e) { return { ok: false }; });
  },

  notifyOrder: function(order, pay) {
    if (!this.ENABLED) return Promise.resolve({ ok: false });
    var lines = [
      '🛒 <b>ORDER BARU</b>',
      '📋 ID: <code>' + order.id + '</code>',
      '🎮 ' + order.item + ' - ' + order.product,
      '💰 Rp ' + (order.total || 0).toLocaleString('id-ID'),
      '💳 ' + order.payment,
      '🕐 ' + new Date().toLocaleString('id-ID')
    ];
    var self = this;
    return this.sendMessage(lines.join('\n')).then(function() {
      if (order.proof) {
        return self.sendPhoto(order.proof, 'Bukti: ' + order.id);
      }
    });
  },

  test: function() {
    return this.sendMessage('Test bot aktif via proxy!');
  }
};

console.log('[telegram] loaded (secure proxy)');
