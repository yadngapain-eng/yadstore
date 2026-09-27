/* LEARN EARN — APP v4 (fix achievements) */

const App = {
  currentTab: 'learn',

  async init() {
    this.checkPendingAdReward();
    console.log('[App] Initializing...');

    if (typeof I18n !== 'undefined') I18n.init();
    if (typeof Auth !== 'undefined') await Auth.init();

    setTimeout(async () => {
      // Sync ad counter dari Firestore dulu
      if (typeof Rewards !== 'undefined' && Rewards.syncFromFirestore) {
        try { await Rewards.syncFromFirestore(); } catch(e) {}
      }
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
      const pending = localStorage.getItem('learnearn_ad_pending');
      if (pending) {
        const elapsed = Date.now() - parseInt(pending);
        if (elapsed < 5 * 60 * 1000) {
          console.log('[App] Processing pending ad reward');
          setTimeout(() => {
            if (typeof Rewards !== 'undefined') Rewards.giveAdReward();
          }, 1500);
        }
        localStorage.removeItem('learnearn_ad_pending');
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
        if (el) {
          // ===== SELF-DIAGNOSTIC =====
          try {
            console.log('[Reward Debug] Starting render...');
            console.log('[Reward Debug] Rewards object:', typeof Rewards);
            console.log('[Reward Debug] renderRewardsPage:', typeof Rewards.renderRewardsPage);
            console.log('[Reward Debug] Auth.user:', window.Auth ? (window.Auth.user ? window.Auth.user.uid : 'null') : 'Auth undefined');
            console.log('[Reward Debug] Rewards.getState:', typeof Rewards.getState);
            
            // Coba panggil getState
            try {
              var testState = Rewards.getState();
              console.log('[Reward Debug] getState() returned:', testState);
            } catch (e) {
              console.error('[Reward Debug] getState() ERROR:', e);
              throw new Error('getState() error: ' + e.message);
            }
            
            // Coba render
            var html = Rewards.renderRewardsPage();
            console.log('[Reward Debug] render returned length:', html ? html.length : 0);
            
            if (!html || html.length < 50) {
              throw new Error('Render returned empty or too short HTML');
            }
            
            el.innerHTML = html;
            console.log('[Reward Debug] ✅ Render success!');
            
            if (Rewards.loadReferralAsync) Rewards.loadReferralAsync();
            
          } catch (err) {
            console.error('[Reward Debug] FATAL:', err);
            // TAMPILKAN ERROR DI HALAMAN
            el.innerHTML = '<div style="margin:20px;padding:20px;background:#fff3cd;border:2px solid #ffc800;border-radius:12px">' +
              '<h3 style="color:#7a5d00;margin:0 0 12px 0">⚠️ Menu Reward Error</h3>' +
              '<p style="font-size:13px;color:#7a5d00;margin:0 0 8px 0"><strong>Pesan:</strong></p>' +
              '<div style="background:white;padding:12px;border-radius:8px;font-family:monospace;font-size:12px;color:#c00;word-break:break-word;margin-bottom:12px">' +
                (err.message || String(err)) +
              '</div>' +
              '<p style="font-size:13px;color:#7a5d00;margin:0 0 8px 0"><strong>Detail:</strong></p>' +
              '<div style="background:white;padding:12px;border-radius:8px;font-family:monospace;font-size:11px;color:#666;word-break:break-word;white-space:pre-wrap">' +
                (err.stack || 'No stack trace') +
              '</div>' +
              '<button onclick="location.reload()" style="margin-top:12px;padding:10px 20px;background:#58cc02;color:white;border:none;border-radius:8px;font-weight:900;cursor:pointer">🔄 Refresh</button>' +
              '</div>';
          }
        }
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
    localStorage.removeItem('learnearn_orders');
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
