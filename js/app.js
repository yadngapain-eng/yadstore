/* YADSTORE — APP v4 (fix achievements) */

const App = {
  currentTab: 'learn',

  async init() {
    this.checkPendingAdReward();
    console.log('[App] Initializing...');

    if (typeof I18n !== 'undefined') I18n.init();
    if (typeof Auth !== 'undefined') await Auth.init();

    setTimeout(() => {
      this.renderAll();
      if (typeof Rewards !== 'undefined') {
        Rewards.checkDailyLogin();
      }
      this.switchTab('learn');
    }, 800);
  },

  onLangChanged(lang) {
    console.log('[App] Lang changed:', lang);
    try {
      if (typeof I18n !== 'undefined') I18n.applyAll();
      if (typeof DuoUI !== 'undefined') {
        DuoUI.renderCategories();
        DuoUI.renderLessons();
      }
      if (typeof TopUpUI !== 'undefined') TopUpUI.render();
      if (this.currentTab === 'achievements' && typeof DuoUI !== 'undefined') {
        DuoUI.renderAch();
      }
      if (this.currentTab === 'rewards' && typeof Rewards !== 'undefined') {
        document.getElementById('rewards-content').innerHTML = Rewards.renderRewardsPage();
      }
    } catch (e) { console.error('[App] onLangChanged:', e); }
  },

  checkPendingAdReward() {
    try {
      const pending = localStorage.getItem('yadstore_ad_pending');
      if (pending) {
        const elapsed = Date.now() - parseInt(pending);
        if (elapsed < 5 * 60 * 1000) {
          console.log('[App] Processing pending ad reward');
          setTimeout(() => {
            if (typeof Rewards !== 'undefined') Rewards.giveAdReward();
          }, 1500);
        }
        localStorage.removeItem('yadstore_ad_pending');
      }
    } catch (e) {}
  },

  onUserChanged(user) {
    console.log('[App] User changed:', user ? user.uid : 'none');
    this.renderAll();
  },

  renderAll() {
    try {
      if (typeof Animate !== 'undefined') Animate.init();
      if (typeof DL !== 'undefined') DL.regenHearts();
      if (typeof DuoUI !== 'undefined') {
        DuoUI.renderStats();
        DuoUI.renderCategories();
        DuoUI.renderLessons();
        DuoUI.renderProfile();
      }
      if (typeof TopUpUI !== 'undefined') TopUpUI.render();
      if (typeof Auth !== 'undefined') Auth.updateUI();
    } catch (e) { console.error('[App] renderAll:', e); }
  },

  switchTab(tab) {
    this.currentTab = tab;
    document.querySelectorAll('.tab-page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    const p = document.getElementById('page-' + tab);
    if (p) p.classList.add('active');
    const b = document.querySelector('.nav-btn[data-tab="' + tab + '"]');
    if (b) b.classList.add('active');

    try {
      if (tab === 'learn' && typeof DuoUI !== 'undefined') {
        DuoUI.renderStats();
        DuoUI.renderCategories();
        DuoUI.renderLessons();
      } else if (tab === 'topup' && typeof TopUpUI !== 'undefined') {
        TopUpUI.render();
      } else if (tab === 'profile' && typeof DuoUI !== 'undefined') {
        DuoUI.renderProfile();
        if (typeof Auth !== 'undefined') Auth.updateUI();
      } else if (tab === 'orders' && typeof TopUpUI !== 'undefined') {
        TopUpUI.renderOrders();
      } else if (tab === 'achievements' && typeof DuoUI !== 'undefined') {
        DuoUI.renderAch();
      } else if (tab === 'rewards' && typeof Rewards !== 'undefined') {
        const el = document.getElementById('rewards-content');
        if (el) el.innerHTML = Rewards.renderRewardsPage();
      }
    } catch (e) { console.error('[App] switchTab:', e); }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  changeName() {
    if (typeof Auth === 'undefined') return;
    const newName = Auth.generateRandomName();
    const newAvatar = Auth.generateAvatar(newName);
    Auth.profile.displayName = newName;
    Auth.profile.avatar = newAvatar;
    Auth.saveProfile({ displayName: newName, avatar: newAvatar });
    Auth.updateUI();
    if (typeof DuoUI !== 'undefined') DuoUI.renderProfile();
    if (typeof Animate !== 'undefined') Animate.toast('Nama baru: ' + newName, 'success');
  },

  resetAll() {
    if (!confirm('Reset SEMUA data?')) return;
    if (typeof DL !== 'undefined') DL.reset();
    localStorage.removeItem('yadstore_orders');
    alert('Data direset!');
    location.reload();
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
setInterval(() => {
  if (typeof DL !== 'undefined' && typeof DuoUI !== 'undefined') {
    DL.regenHearts();
    DuoUI.renderStats();
  }
}, 60000);
if (typeof window !== 'undefined') window.App = App;
console.log('[app] v4 loaded');
