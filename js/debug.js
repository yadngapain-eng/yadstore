/* YADSTORE — DEBUG TOOL */

(function() {
  if (typeof window === 'undefined') return;

  // Buat debug panel
  function createPanel() {
    var p = document.getElementById('debug-panel');
    if (p) return p;
    p = document.createElement('div');
    p.id = 'debug-panel';
    p.style.cssText = 'position:fixed;bottom:0;left:0;right:0;max-height:50vh;overflow-y:auto;background:#1a1a1a;color:#fff;padding:10px;font-family:monospace;font-size:11px;z-index:99999;border-top:4px solid #ff4b4b;display:none';
    p.innerHTML = '<div style="display:flex;justify-content:space-between;margin-bottom:8px;align-items:center"><strong style="color:#ff4b4b">🐛 DEBUG</strong><button onclick="document.getElementById(\'debug-panel\').style.display=\'none\'" style="background:#ff4b4b;color:#fff;border:none;padding:2px 8px;border-radius:4px;cursor:pointer">X</button></div><div id="debug-log"></div>';
    document.body.appendChild(p);
    return p;
  }

  // Log ke panel
  function log(msg, type) {
    type = type || 'info';
    console.log('[' + type.toUpperCase() + '] ' + msg);
    var p = createPanel();
    p.style.display = 'block';
    var logEl = document.getElementById('debug-log');
    var color = type === 'error' ? '#ff4b4b' : (type === 'warn' ? '#ffc800' : (type === 'ok' ? '#58cc02' : '#fff'));
    var time = new Date().toLocaleTimeString();
    logEl.innerHTML += '<div style="color:' + color + ';margin-bottom:4px">[' + time + '] ' + msg + '</div>';
    logEl.scrollTop = logEl.scrollHeight;
  }

  // Global error handler
  window.addEventListener('error', function(e) {
    log('ERROR: ' + (e.message || e.error) + ' @ ' + (e.filename || '?') + ':' + (e.lineno || '?'), 'error');
  });

  // Unhandled rejection
  window.addEventListener('unhandledrejection', function(e) {
    log('PROMISE REJECT: ' + (e.reason ? (e.reason.message || e.reason) : 'unknown'), 'error');
  });

  // Tunggu DOM ready
  window.addEventListener('load', function() {
    log('Window loaded', 'ok');

    // Cek semua script ada
    var checks = [
      ['window.DL', typeof window.DL],
      ['window.DuoUI', typeof window.DuoUI],
      ['window.App', typeof window.App],
      ['window.Auth', typeof window.Auth],
      ['window.Rewards', typeof window.Rewards],
      ['window.I18n', typeof window.I18n],
      ['window.TopUpUI', typeof window.TopUpUI],
      ['window.Animate', typeof window.Animate],
      ['window.GAMES', typeof window.GAMES],
      ['window.CODING_LESSONS', typeof window.CODING_LESSONS],
      ['window.LESSON_CATEGORIES', typeof window.LESSON_CATEGORIES],
    ];

    checks.forEach(function(c) {
      var ok = c[1] !== 'undefined';
      log(c[0] + ' = ' + c[1], ok ? 'ok' : 'error');
    });

    // Cek elemen
    setTimeout(function() {
      var els = [
        'category-tabs', 'lessons-list', 'achievements-list',
        'ach-stats', 'ach-tier-tabs', 'topup-grid'
      ];
      els.forEach(function(id) {
        var el = document.getElementById(id);
        if (!el) { log('#' + id + ' = MISSING', 'error'); return; }
        var count = el.children.length;
        log('#' + id + ' children = ' + count, count > 0 ? 'ok' : 'warn');
      });

      // Cek App.init dipanggil
      if (window.App && window.App.currentTab) {
        log('App.currentTab = ' + window.App.currentTab, 'ok');
      } else {
        log('App.currentTab = undefined', 'error');
      }

      log('=== Debug panel ready ===', 'ok');
    }, 2000);
  });

  log('Debug tool injected', 'ok');
})();
