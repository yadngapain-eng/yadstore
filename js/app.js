const App = {
  currentTab: 'learn',
  init() {
    try {
      if (typeof Animate !== 'undefined') Animate.init();
      if (typeof DL !== 'undefined') DL.regenHearts();
      if (typeof DuoUI !== 'undefined') {
        DuoUI.renderStats(); DuoUI.renderCategories();
        DuoUI.renderLessons(); DuoUI.renderAch(); DuoUI.renderProfile();
      }
      if (typeof TopUpUI !== 'undefined') TopUpUI.render();
      this.switchTab('learn');
      if (typeof DL !== 'undefined') DL.updateStreak();
    } catch (e) { console.error('[App]', e); }
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
      if (tab === 'learn' && typeof DuoUI !== 'undefined') { DuoUI.renderStats(); DuoUI.renderLessons(); DuoUI.renderAch(); }
      else if (tab === 'topup' && typeof TopUpUI !== 'undefined') { TopUpUI.render(); }
      else if (tab === 'profile' && typeof DuoUI !== 'undefined') { DuoUI.renderProfile(); }
      else if (tab === 'orders' && typeof TopUpUI !== 'undefined') { TopUpUI.renderOrders(); }
    } catch (e) { console.error('[App] tab', e); }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
  resetAll() {
    if (!confirm('Reset SEMUA data?')) return;
    if (typeof DL !== 'undefined') DL.reset();
    alert('Data direset!'); location.reload();
  },
};
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() { App.init(); });
} else { App.init(); }
setInterval(function() {
  if (typeof DL !== 'undefined' && typeof DuoUI !== 'undefined') { DL.regenHearts(); DuoUI.renderStats(); }
}, 60000);
if (typeof window !== 'undefined') window.App = App;
