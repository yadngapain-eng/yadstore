/* ============================================
   TELEGRAM BOT CONFIG
   Auto-generated: 2026-10-03 03:22:40
   ============================================ */

window.TELEGRAM_CONFIG = {
  BOT_TOKEN: '8835865194:AAFtF9ZoNCoK1HtlF1_jEx29l75Hjxd1iko',
  CHAT_ID: '8254733927',
  ENABLED: true,
  API_BASE: 'https://api.telegram.org/bot',

  // ====== KIRIM PESAN TEKS ======
  sendMessage: function(text) {
    if (!this.ENABLED) return Promise.resolve({ ok: false });
    var url = this.API_BASE + this.BOT_TOKEN + '/sendMessage';
    return fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        chat_id: this.CHAT_ID,
        text: text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (!data.ok) console.warn('[Telegram] Send failed:', data);
      else console.log('[Telegram] ✅ Sent');
      return data;
    })
    .catch(function(e) {
      console.warn('[Telegram] error:', e);
      return { ok: false, error: e.message };
    });
  },

  // ====== KIRIM FOTO + CAPTION ======
  sendPhoto: function(photoData, caption) {
    if (!this.ENABLED) return Promise.resolve({ ok: false });
    var self = this;
    return new Promise(function(resolve) {
      try {
        if (photoData.indexOf('data:') === 0) {
          var parts = photoData.split(',');
          var mimeMatch = parts[0].match(/:(.*?);/);
          var mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
          var binary = atob(parts[1]);
          var arr = new Uint8Array(binary.length);
          for (var i = 0; i < binary.length; i++) {
            arr[i] = binary.charCodeAt(i);
          }
          var blob = new Blob([arr], { type: mime });
          self._uploadPhoto(blob, caption).then(resolve);
        } else {
          fetch(photoData)
            .then(function(r) { return r.blob(); })
            .then(function(b) { self._uploadPhoto(b, caption).then(resolve); })
            .catch(function(e) { resolve({ ok: false, error: e.message }); });
        }
      } catch (e) {
        resolve({ ok: false, error: e.message });
      }
    });
  },

  _uploadPhoto: function(blob, caption) {
    var url = this.API_BASE + this.BOT_TOKEN + '/sendPhoto';
    var fd = new FormData();
    fd.append('chat_id', this.CHAT_ID);
    fd.append('caption', caption || '');
    fd.append('parse_mode', 'HTML');
    fd.append('photo', blob, 'proof.jpg');
    return fetch(url, { method: 'POST', body: fd })
      .then(function(r) { return r.json(); })
      .catch(function(e) { return { ok: false, error: e.message }; });
  },

  // ====== NOTIFIKASI ORDER LENGKAP ======
  notifyOrder: function(order, pay) {
    if (!this.ENABLED) return Promise.resolve({ ok: false });

    var lines = [];
    lines.push('🛒 <b>ORDER BARU</b>');
    lines.push('━━━━━━━━━━━━━━━━━━━━');
    lines.push('📋 <b>ID:</b> <code>' + (order.id || '-') + '</code>');
    lines.push('🎮 <b>Layanan:</b> ' + (order.item || '-'));
    lines.push('📦 <b>Produk:</b> ' + (order.product || '-'));
    lines.push('');

    var userData = order.userData || {};
    var keys = Object.keys(userData);
    if (keys.length > 0) {
      lines.push('👤 <b>Data Akun:</b>');
      keys.forEach(function(k) {
        var label = k.replace(/_/g, ' ').replace(/\b\w/g, function(l) { return l.toUpperCase(); });
        lines.push('  • ' + label + ': <code>' + userData[k] + '</code>');
      });
      lines.push('');
    }

    lines.push('💰 <b>Total:</b> <b>Rp ' + (order.total || 0).toLocaleString('id-ID') + '</b>');
    lines.push('💳 <b>Metode:</b> ' + (order.payment || '-'));

    if (pay && pay.account) {
      lines.push('🏦 <b>No. Rek:</b> <code>' + pay.account + '</code>');
      if (pay.holder) {
        lines.push('👤 <b>Atas Nama:</b> ' + pay.holder);
      }
    }

    lines.push('');
    lines.push('🕐 ' + new Date().toLocaleString('id-ID'));
    lines.push('━━━━━━━━━━━━━━━━━━━━');

    var text = lines.join('\n');
    var self = this;

    return this.sendMessage(text).then(function(result) {
      if (order.proof) {
        var caption = '📸 <b>Bukti Transfer</b>\nOrder: <code>' + (order.id || '-') + '</code>';
        return self.sendPhoto(order.proof, caption);
      }
      return result;
    });
  },

  // ====== TEST ======
  test: function() {
    return this.sendMessage('🧪 <b>Test</b> — Bot aktif!\n🕐 ' + new Date().toLocaleString('id-ID'));
  }
};

console.log('[telegram] Loaded — Chat ID:', '8254733927');
