const App = {
  currentTab: 'learn',

  init() {
    Animate.init();
    DL.regenHearts();
    DuoUI.renderStats();
    DuoUI.renderCategories();
    DuoUI.renderLessons();
    DuoUI.renderAch();
    DuoUI.renderProfile();
    TopUpUI.render();
    this.switchTab('learn');
    DL.updateStreak();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  },
  switchTab(tab) {
    this.currentTab = tab;
    document.querySelectorAll('.tab-page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    const p = document.getElementById('page-' + tab);
    if (p) p.classList.add('active');
    const b = document.querySelector('.nav-btn[data-tab="' + tab + '"]');
    if (b) b.classList.add('active');
    if (tab === 'learn') { DuoUI.renderStats(); DuoUI.renderLessons(); DuoUI.renderAch(); }
    else if (tab === 'topup') TopUpUI.render();
    else if (tab === 'profile') DuoUI.renderProfile();
    else if (tab === 'orders') TopUpUI.renderOrders();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
  resetAll() {
    if (!confirm('Reset SEMUA data?')) return;
    DL.reset();
    alert('Data direset!');
    location.reload();
  },
};
document.addEventListener('DOMContentLoaded', () => App.init());
setInterval(() => { DL.regenHearts(); DuoUI.renderStats(); }, 60000);
if (typeof window !== 'undefined') window.App = App;
