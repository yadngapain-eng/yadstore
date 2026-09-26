const App = {
  currentTab: 'learn',
  logs: [],

  log(msg, type) {
    type = type || 'info';
    var entry = '[' + new Date().toLocaleTimeString() + '] ' + msg;
    this.logs.push({ text: entry, type: type });
    console.log(entry);
    this.updateDebugPanel();
  },

  updateDebugPanel() {
    var panel = document.getElementById('debug-panel');
    if (!panel) return;
    var html = '<div style="font-size:12px;line-height:1.6">';
    this.logs.slice(-15).forEach(function(l) {
      var color = l.type === 'error' ? '#ff4b4b' : (l.type === 'ok' ? '#58cc02' : '#333');
      html += '<div style="color:' + color + ';font-family:monospace">' + l.text.replace(/</g, '&lt;') + '</div>';
    });
    html += '</div>';
    panel.innerHTML = html;
  },

  showError(msg, err) {
    var stack = err && err.stack ? err.stack : '';
    this.log('ERROR: ' + msg, 'error');
    if (stack) this.log(stack.split('\n')[0], 'error');
    var panel = document.getElementById('debug-panel');
    if (panel) {
      panel.style.background = '#ffe0e0';
      panel.style.border = '2px solid #ff4b4b';
      panel.insertAdjacentHTML('afterbegin',
        '<div style="background:#ff4b4b;color:white;padding:8px;border-radius:6px;margin-bottom:8px;font-weight:900">' +
        'ERROR: ' + msg + '<br><small>' + stack.split('\n').slice(0, 3).join('<br>') + '</small></div>');
    }
  },

  init() {
    console.log('=== APP INIT ===');

    // Buat debug panel
    var panel = document.createElement('div');
    panel.id = 'debug-panel';
    panel.style.cssText = 'position:fixed;bottom:100px;left:8px;right:8px;max-height:200px;overflow-y:auto;background:white;padding:10px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.2);z-index:9999;font-family:monospace';
    document.body.appendChild(panel);

    this.log('=== APP INIT ===', 'ok');

    // Test step by step
    try {
      this.log('Animate: ' + (typeof Animate));
      if (typeof Animate !== 'undefined') { Animate.init(); this.log('Animate.init() OK', 'ok'); }
      else { this.log('Animate UNDEFINED', 'error'); }
    } catch (e) { this.showError('Animate.init', e); }

    try {
      this.log('DL: ' + (typeof DL));
      if (typeof DL !== 'undefined') { DL.regenHearts(); this.log('DL.regenHearts OK', 'ok'); }
      else { this.log('DL UNDEFINED', 'error'); }
    } catch (e) { this.showError('DL.regenHearts', e); }

    try {
      this.log('DuoUI: ' + (typeof DuoUI));
      if (typeof DuoUI !== 'undefined') {
        DuoUI.renderStats(); this.log('renderStats OK', 'ok');
        DuoUI.renderCategories(); this.log('renderCategories OK', 'ok');
        DuoUI.renderLessons(); this.log('renderLessons OK', 'ok');
        DuoUI.renderAch(); this.log('renderAch OK', 'ok');
        DuoUI.renderProfile(); this.log('renderProfile OK', 'ok');
      } else { this.log('DuoUI UNDEFINED', 'error'); }
    } catch (e) { this.showError('DuoUI render', e); }

    try {
      this.log('TopUpUI: ' + (typeof TopUpUI));
      if (typeof TopUpUI !== 'undefined') { TopUpUI.render(); this.log('TopUpUI.render OK', 'ok'); }
      else { this.log('TopUpUI UNDEFINED', 'error'); }
    } catch (e) { this.showError('TopUpUI.render', e); }

    try {
      this.log('GAMES: ' + (typeof GAMES) + ' len=' + (window.GAMES ? window.GAMES.length : '?'));
      this.log('LESSONS: ' + (typeof CODING_LESSONS));
    } catch (e) { this.showError('Data check', e); }

    // Tombol hide panel
    var btn = document.createElement('button');
    btn.textContent = 'X';
    btn.style.cssText = 'position:absolute;top:4px;right:4px;background:#ff4b4b;color:white;border:none;border-radius:50%;width:24px;height:24px;cursor:pointer;font-weight:900';
    btn.onclick = function() { panel.style.display = 'none'; };
    panel.appendChild(btn);

    // Tandai selesai
    this.log('=== INIT DONE ===', 'ok');

    try { this.switchTab('learn'); } catch(e) { this.showError('switchTab', e); }
  },

  switchTab(tab) {
    this.currentTab = tab;
    document.querySelectorAll('.tab-page').forEach(function(p) { p.classList.remove('active'); });
    document.querySelectorAll('.nav-btn').forEach(function(b) { b.classList.remove('active'); });
    var p = document.getElementById('page-' + tab);
    if (p) p.classList.add('active');
    var b = document.querySelector('.nav-btn[data-tab="' + tab + '"]');
    if (b) b.classList.add('active');
    try {
      if (tab === 'learn' && typeof DuoUI !== 'undefined') {
        DuoUI.renderStats(); DuoUI.renderLessons(); DuoUI.renderAch();
      } else if (tab === 'topup' && typeof TopUpUI !== 'undefined') {
        TopUpUI.render();
      } else if (tab === 'profile' && typeof DuoUI !== 'undefined') {
        DuoUI.renderProfile();
      } else if (tab === 'orders' && typeof TopUpUI !== 'undefined') {
        TopUpUI.renderOrders();
      }
    } catch (e) { this.showError('switchTab ' + tab, e); }
  },

  resetAll() {
    if (!confirm('Reset?')) return;
    if (typeof DL !== 'undefined') DL.reset();
    location.reload();
  },
};

document.addEventListener('DOMContentLoaded', function() { App.init(); });
setInterval(function() {
  if (typeof DL !== 'undefined' && typeof DuoUI !== 'undefined') {
    DL.regenHearts(); DuoUI.renderStats();
  }
}, 60000);
if (typeof window !== 'undefined') window.App = App;
