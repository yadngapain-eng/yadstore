/* Learn Earn — Advanced Log Tracker (Bridge to Android) */

window.LogTracker = {
  // ===== INIT =====
  init() {
    try {
      this.log('INFO', 'LogTracker init');
      this.installErrorHandler();
      this.installPromiseHandler();
      this.logDeviceInfo();
      this.logNavigation();
      this.startHeartbeat();
      console.log('[LogTracker] Ready');
    } catch (e) {
      console.warn('[LogTracker] init failed:', e);
    }
  },

  // ===== SEND LOG KE ANDROID =====
  log(level, msg) {
    var fullMsg = '[JS] ' + msg;
    console.log('[' + level + '] ' + msg);

    try {
      // Cek apakah di dalam APK (Android bridge)
      if (window.AndroidLogger && typeof window.AndroidLogger.log === 'function') {
        window.AndroidLogger.log(level, fullMsg);
      }
    } catch (e) { /* ignore */ }

    // Simpan juga di localStorage buat backup
    try {
      var logs = JSON.parse(localStorage.getItem('yad_logs') || '[]');
      logs.unshift({
        t: new Date().toISOString(),
        l: level,
        m: msg
      });
      if (logs.length > 500) logs = logs.slice(0, 500);
      localStorage.setItem('yad_logs', JSON.stringify(logs));
    } catch (e) { /* ignore */ }
  },

  i(msg) { this.log('INFO', msg); },
  w(msg) { this.log('WARN', msg); },
  e(msg) { this.log('ERROR', msg); },

  // ===== INSTALL ERROR HANDLER =====
  installErrorHandler() {
    var self = this;
    window.addEventListener('error', function(evt) {
      var msg = evt.message || 'Unknown error';
      var file = evt.filename || '?';
      var line = evt.lineno || '?';
      var col = evt.colno || '?';
      self.e('JS Error: ' + msg + ' @ ' + file + ':' + line + ':' + col);
      if (evt.error && evt.error.stack) {
        self.e('Stack: ' + evt.error.stack);
      }
    });

    window.addEventListener('unhandledrejection', function(evt) {
      var reason = evt.reason || 'Unknown rejection';
      self.e('Promise Rejection: ' + (reason.message || reason));
    });
  },

  // ===== INSTALL PROMISE HANDLER (sudah di error handler) =====
  installPromiseHandler() {
    // Sudah ter-cover di installErrorHandler
  },

  // ===== DEVICE INFO =====
  logDeviceInfo() {
    try {
      this.i('UA: ' + navigator.userAgent);
      this.i('Platform: ' + navigator.platform);
      this.i('Language: ' + navigator.language);
      this.i('Online: ' + navigator.onLine);
      this.i('Screen: ' + window.screen.width + 'x' + window.screen.height);
      this.i('Viewport: ' + window.innerWidth + 'x' + window.innerHeight);
      this.i('DPR: ' + (window.devicePixelRatio || 1));
      this.i('Timezone: ' + (Intl.DateTimeFormat().resolvedOptions().timeZone || '?'));
      if (navigator.connection) {
        this.i('Connection: ' + (navigator.connection.effectiveType || '?') + ' (' + (navigator.connection.downlink || '?') + 'Mbps)');
      }
    } catch (e) { /* ignore */ }
  },

  // ===== NAVIGATION LOGGER =====
  logNavigation() {
    var self = this;

    // Track page visibility
    document.addEventListener('visibilitychange', function() {
      self.i('Visibility: ' + (document.hidden ? 'hidden' : 'visible'));
    });

    // Track tab switch (kalau ada)
    window.addEventListener('hashchange', function() {
      self.i('Hash changed: ' + location.hash);
    });

    // Track online/offline
    window.addEventListener('online', function() { self.i('Connection: online'); });
    window.addEventListener('offline', function() { self.w('Connection: offline'); });
  },

  // ===== HEARTBEAT =====
  startHeartbeat() {
    var self = this;
    var count = 0;
    setInterval(function() {
      count++;
      var mem = '?';
      try {
        if (performance.memory) {
          mem = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB';
        }
      } catch (e) {}
      self.i('Heartbeat #' + count + ' | Memory: ' + mem + ' | Online: ' + navigator.onLine);
    }, 60000); // tiap 1 menit
  },

  // ===== EXPORT (untuk user copy) =====
  export() {
    try {
      var logs = JSON.parse(localStorage.getItem('yad_logs') || '[]');
      var txt = logs.map(function(x) {
        return '[' + x.t + '] [' + x.l + '] ' + x.m;
      }).join('\n');
      return txt;
    } catch (e) {
      return '(error: ' + e.message + ')';
    }
  },

  // ===== CLEAR =====
  clear() {
    try {
      localStorage.removeItem('yad_logs');
      this.i('Logs cleared');
    } catch (e) {}
  }
};

// Auto-init
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      window.LogTracker.init();
    });
  } else {
    window.LogTracker.init();
  }
}
console.log('[log-tracker] loaded');
