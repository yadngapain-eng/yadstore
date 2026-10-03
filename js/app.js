/* ============================================
   YS STORE — APP v1
   ============================================ */

const App = {
  currentTab: 'home',

  async init() {
    console.log('[YS Store] Initializing...');

    if (typeof Auth !== 'undefined') await Auth.init();

    setTimeout(async () => {
      this.renderAll();
      this.switchTab('home');
    }, 500);
  },

  onUserChanged(user) {
    console.log('[YS Store] User changed:', user ? user.uid : 'none');
    this.renderAll();
  },

  renderAll() {
    try {
      if (typeof Animate !== 'undefined') Animate.init();
      if (typeof YSHome !== 'undefined') YSHome.render();
      if (typeof Auth !== 'undefined') Auth.updateUI();
      if (typeof TopUpUI !== 'undefined') TopUpUI.render(true);
    } catch (e) {
      console.error('[YS Store] renderAll:', e);
    }
  },

  switchTab(tab) {
    this.currentTab = tab;
    document.querySelectorAll('.tab-page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    var p = document.getElementById('page-' + tab);
    if (p) p.classList.add('active');
    var b = document.querySelector('.nav-btn[data-tab="' + tab + '"]');
    if (b) b.classList.add('active');

    try {
      if (tab === 'home') {
        if (typeof YSHome !== 'undefined') YSHome.render();
      } else if (tab === 'orders') {
        if (typeof TopUpUI !== 'undefined') TopUpUI.renderOrders();
      } else if (tab === 'profile') {
        if (typeof Auth !== 'undefined') Auth.updateUI();
        this.renderProfileStats();
      }
    } catch (e) {
      console.error('[YS Store] switchTab error:', e);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  renderProfileStats() {
    try {
      var orders = JSON.parse(localStorage.getItem('learnearn_orders') || '[]');
      var total = orders.reduce(function(s, o) { return s + (o.total || 0); }, 0);
      var el1 = document.getElementById('profile-orders');
      var el2 = document.getElementById('profile-spent');
      if (el1) el1.textContent = orders.length;
      if (el2) el2.textContent = 'Rp ' + total.toLocaleString('id-ID');
    } catch (e) {}
  },

  changeName() {
    if (typeof Auth === 'undefined') return;
    var newName = Auth.generateRandomName();
    var newAvatar = Auth.generateAvatar(newName);
    Auth.profile.displayName = newName;
    Auth.profile.avatar = newAvatar;
    Auth.saveProfile({ displayName: newName, avatar: newAvatar });
    Auth.updateUI();
    if (typeof Animate !== 'undefined') Animate.toast('Nama baru: ' + newName, 'success');
  },
};

document.addEventListener('DOMContentLoaded', function() { App.init(); });

if (typeof window !== 'undefined') window.App = App;
console.log('[YS Store] app.js loaded');
