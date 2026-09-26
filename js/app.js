const App = {
  currentTab: 'learn',

  init() {
    console.log('=== APP INIT ===');
    try {
      if (typeof Animate !== 'undefined') { Animate.init(); console.log('Animate: OK'); }
      if (typeof DL !== 'undefined') { DL.regenHearts(); console.log('DL: OK'); }
      if (typeof DuoUI !== 'undefined') {
        DuoUI.renderStats(); console.log('renderStats: OK');
        DuoUI.renderCategories(); console.log('renderCategories: OK');
        DuoUI.renderLessons(); console.log('renderLessons: OK');
        DuoUI.renderAch(); console.log('renderAch: OK');
        DuoUI.renderProfile(); console.log('renderProfile: OK');
      }
      if (typeof TopUpUI !== 'undefined') { TopUpUI.render(); console.log('TopUpUI: OK'); }
      this.switchTab('learn');
      if (typeof DL !== 'undefined') DL.updateStreak();
      console.log('=== APP READY ===');
    } catch (e) {
      console.error('=== APP ERROR ===', e);
      document.body.innerHTML = '<div style="padding:20px;font-family:monospace;background:#ffe0e0">' +
        '<h2 style="color:red">Error:</h2><pre>' + (e.message || e) + '\n\n' + (e.stack || '') + '</pre>' +
        '<p>Fix dan refresh.</p></div>';
    }
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
    } catch (e) { console.error('[App] switchTab:', e); }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  resetAll() {
    if (!confirm('Reset SEMUA data?')) return;
    if (typeof DL !== 'undefined') DL.reset();
    alert('Data direset!');
    location.reload();
  },
};

document.addEventListener('DOMContentLoaded', function() { App.init(); });
setInterval(function() {
  if (typeof DL !== 'undefined' && typeof DuoUI !== 'undefined') {
    DL.regenHearts(); DuoUI.renderStats();
  }
}, 60000);
console.log('[app] loaded');
if (typeof window !== 'undefined') window.App = App;
