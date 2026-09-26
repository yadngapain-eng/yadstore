/* YADSTORE — APP v3 */

const App = {
  currentTab: 'learn',

  async init() {
    console.log('[App] Initializing...');
    if (typeof Auth !== 'undefined') await Auth.init();
    setTimeout(() => {
      this.renderAll();
      // Rewards: cek login harian
      if (typeof Rewards !== 'undefined') {
        Rewards.checkDailyLogin();
      }
      this.switchTab('learn');
    }, 800);
  },

  onUserChanged(user) {
    console.log('[App] User changed:', user ? user.uid : 'none');
    this.renderAll();
      // Rewards: cek login harian
      if (typeof Rewards !== 'undefined') {
        Rewards.checkDailyLogin();
      }
  },

  renderAll() {
    try {
      if (typeof Animate !== 'undefined') Animate.init();
      if (typeof DL !== 'undefined') DL.regenHearts();
      if (typeof DuoUI !== 'undefined') {
        DuoUI.renderStats(); DuoUI.renderCategories();
        DuoUI.renderLessons(); DuoUI.renderAch(); DuoUI.renderProfile();
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
        DuoUI.renderStats(); DuoUI.renderLessons(); DuoUI.renderAch();
      } else if (tab === 'topup' && typeof TopUpUI !== 'undefined') {
        TopUpUI.render();
      } else if (tab === 'profile' && typeof DuoUI !== 'undefined') {
        DuoUI.renderProfile();
        if (typeof Auth !== 'undefined') Auth.updateUI();
      } else if (tab === 'orders' && typeof TopUpUI !== 'undefined') {
        TopUpUI.renderOrders();
      } else if (tab === 'rewards' && typeof Rewards !== 'undefined') {
        document.getElementById('rewards-content').innerHTML = Rewards.renderRewardsPage();
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
    DL.regenHearts(); DuoUI.renderStats();
  }
}, 60000);
if (typeof window !== 'undefined') window.App = App;
