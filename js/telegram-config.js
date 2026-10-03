/* ============================================
   TELEGRAM BOT CONFIG — ANTI-SPAM VERSION
   - Rate limiting
   - Deduplication
   - Queue
   ============================================ */

window.TELEGRAM_CONFIG = {
  BOT_TOKEN: '8835865194:AAFtF9ZoNCoK1HtlF1_jEx29l75Hjxd1iko',
  CHAT_ID: '8254733927',
  ENABLED: true,
  API_BASE: 'https://api.telegram.org/bot',
  
  // ============================================
  // KONFIGURASI ANTI-SPAM
  // ============================================
  CONFIG: {
    // Minimal interval antar kirim (ms)
    MIN_INTERVAL: 300 * 1000,
    
    // Max pesan per menit
    MAX_PER_MINUTE: 2,
    
    // Max pesan per jam
    MAX_PER_HOUR: 20,
    
    // Dedup pesan (kalau sama dalam X detik, skip)
    DEDUP_WINDOW: 60000,
    
    // Hanya kirim yang penting
    FILTER_LEVELS: ['error', 'critical', 'order', 'payment'],
  },
  
  // State
  _lastSendTime: 0,
  _sendsThisMinute: 0,
  _sendsThisHour: 0,
  _minuteStart: Date.now(),
  _hourStart: Date.now(),
  _recentMessages: {},  // Untuk dedup
  
  // Queue
  _queue: [],
  _processing: false,

  // ============================================
  // HELPERS
  // ============================================
  _checkRateLimit: function() {
    var now = Date.now();
    
    // Reset counters
    if (now - this._minuteStart > 60000) {
      this._minuteStart = now;
      this._sendsThisMinute = 0;
    }
    if (now - this._hourStart > 3600000) {
      this._hourStart = now;
      this._sendsThisHour = 0;
    }
    
    // Cek limit
    if (this._sendsThisMinute >= this.CONFIG.MAX_PER_MINUTE) {
      console.warn('[Telegram] Rate limit: per minute exceeded');
      return false;
    }
    if (this._sendsThisHour >= this.CONFIG.MAX_PER_HOUR) {
      console.warn('[Telegram] Rate limit: per hour exceeded');
      return false;
    }
    
    // Cek interval
    if (now - this._lastSendTime < this.CONFIG.MIN_INTERVAL) {
      var wait = this.CONFIG.MIN_INTERVAL - (now - this._lastSendTime);
      console.warn('[Telegram] Cooldown: wait ' + Math.ceil(wait/1000) + 's');
      return false;
    }
    
    return true;
  },
  
  _checkDuplicate: function(text) {
    var now = Date.now();
    var hash = this._hashText(text);
    var lastSeen = this._recentMessages[hash] || 0;
    
    if (now - lastSeen < this.CONFIG.DEDUP_WINDOW) {
      console.log('[Telegram] Duplicate message, skip');
      return true;  // Is duplicate
    }
    
    this._recentMessages[hash] = now;
    
    // Cleanup old entries
    var self = this;
    Object.keys(this._recentMessages).forEach(function(k) {
      if (now - self._recentMessages[k] > self.CONFIG.DEDUP_WINDOW * 2) {
        delete self._recentMessages[k];
      }
    });
    
    return false;
  },
  
  _hashText: function(text) {
    var hash = 0;
    for (var i = 0; i < text.length; i++) {
      var char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return 'h' + Math.abs(hash);
  },

  // ============================================
  // KIRIM PESAN TEKS
  // ============================================
  sendMessage: function(text) {
    if (!this.ENABLED) return Promise.resolve({ ok: false, reason: 'disabled' });
    
    var self = this;
    
    return new Promise(function(resolve) {
      // Cek dedup
      if (self._checkDuplicate(text)) {
        resolve({ ok: false, reason: 'duplicate' });
        return;
      }
      
      // Cek rate limit
      if (!self._checkRateLimit()) {
        // Masukkan ke queue
        if (self._queue.length < 10) {
          self._queue.push({ text: text, resolve: resolve });
        } else {
          resolve({ ok: false, reason: 'queue_full' });
        }
        return;
      }
      
      // Kirim
      self._doSend(text).then(function(result) {
        // Update counters
        self._lastSendTime = Date.now();
        self._sendsThisMinute++;
        self._sendsThisHour++;
        resolve(result);
      });
    });
  },
  
  _doSend: function(text) {
    var url = this.API_BASE + this.BOT_TOKEN + '/sendMessage';
    
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: this.CHAT_ID,
        text: text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.ok) {
        console.log('[Telegram] ✅ Sent');
      } else {
        console.warn('[Telegram] Failed:', data);
      }
      return data;
    })
    .catch(function(e) {
      console.warn('[Telegram] Error:', e);
      return { ok: false, error: e.message };
    });
  },
  
  // ============================================
  // PROCESS QUEUE
  // ============================================
  _processQueue: function() {
    if (this._processing) return;
    if (this._queue.length === 0) return;
    
    this._processing = true;
    var self = this;
    
    var item = this._queue.shift();
    
    setTimeout(function() {
      self._checkRateLimit();
      
      self._doSend(item.text).then(function(result) {
        item.resolve(result);
        self._processing = false;
        
        // Process next
        self._processQueue();
      });
    }, 1000);
  },

  // ============================================
  // NOTIFIKASI ORDER
  // ============================================
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
        lines.push('  • ' + k + ': <code>' + userData[k] + '</code>');
      });
      lines.push('');
    }
    
    lines.push('💰 <b>Total:</b> Rp ' + (order.total || 0).toLocaleString('id-ID'));
    lines.push('💳 <b>Metode:</b> ' + (order.payment || '-'));
    lines.push('');
    lines.push('🕐 ' + new Date().toLocaleString('id-ID'));
    
    return this.sendMessage(lines.join('\n'));
  },

  // ============================================
  // TEST
  // ============================================
  test: function() {
    return this.sendMessage('🧪 Test — ' + new Date().toLocaleString('id-ID'));
  },
  
  // ============================================
  // STATUS
  // ============================================
  getStatus: function() {
    return {
      sendsThisMinute: this._sendsThisMinute,
      sendsThisHour: this._sendsThisHour,
      queueLength: this._queue.length,
      lastSendTime: this._lastSendTime,
    };
  },
};

// Start queue processor
setInterval(function() {
  if (window.TELEGRAM_CONFIG && window.TELEGRAM_CONFIG._processQueue) {
    window.TELEGRAM_CONFIG._processQueue();
  }
}, 5000);

console.log('[telegram] Anti-spam version loaded');
