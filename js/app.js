/* ============================================
   YADSTORE — APP
   ============================================ */

const App = {
  currentTab: 'learn',

  init() {
    console.log('🎮 YadStore init...');
    DL.regenHearts();
    this.renderAll();
    this.switchTab('learn');
    DL.updateStreak();
    DL.checkAchievements({});
    DuoUI.renderStats();

    // Register Service Worker (Monetag)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(
        () => console.log('✅ SW registered'),
        (e) => console.log('SW skip:', e.message)
      );
    }
    console.log('✅ YadStore ready!');
  },

  renderAll() {
    DuoUI.renderStats();
    DuoUI.renderCategoryTabs();
    DuoUI.renderLessons();
    DuoUI.renderAchievements();
    DuoUI.renderProfile();
    GamesUI.render();
  },

  switchTab(tab) {
    this.currentTab = tab;
    document.querySelectorAll('.tab-page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    const p = document.getElementById('page-' + tab);
    if (p) p.classList.add('active');
    const b = document.querySelector(`.nav-btn[data-tab="${tab}"]`);
    if (b) b.classList.add('active');

    if (tab === 'learn') { DuoUI.renderStats(); DuoUI.renderLessons(); DuoUI.renderAchievements(); }
    else if (tab === 'topup') GamesUI.render();
    else if (tab === 'profile') DuoUI.renderProfile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  resetAll() {
    if (!confirm('⚠️ Reset SEMUA data?')) return;
    DL.reset();
    alert('✅ Data direset!');
    location.reload();
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
setInterval(() => { DL.regenHearts(); DuoUI.renderStats(); }, 60000);
if (typeof window !== 'undefined') window.App = App;
