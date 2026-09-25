/* ============================================
   YADSTORE — MAIN APP
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

    const page = document.getElementById('page-' + tab);
    if (page) page.classList.add('active');

    const btn = document.querySelector(`.nav-btn[data-tab="${tab}"]`);
    if (btn) btn.classList.add('active');

    if (tab === 'learn') {
      DuoUI.renderStats();
      DuoUI.renderLessons();
      DuoUI.renderAchievements();
    } else if (tab === 'topup') {
      GamesUI.render();
    } else if (tab === 'profile') {
      DuoUI.renderProfile();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  resetAll() {
    if (!confirm('⚠️ Yakin reset SEMUA data? XP, streak, gems, dll akan hilang.')) return;
    DL.reset();
    alert('✅ Data berhasil direset!');
    location.reload();
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());

// Regen hearts tiap 1 menit
setInterval(() => {
  DL.regenHearts();
  DuoUI.renderStats();
}, 60 * 1000);

if (typeof window !== 'undefined') window.App = App;
