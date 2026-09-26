/* YADSTORE — AUTH v3 (per-user data) */

const Auth = {
  user: null,
  profile: null,
  db: null,
  auth: null,
  lastUid: null,

  generateRandomName() {
    const adj = ['Cepat','Pintar','Ganteng','Cantik','Keren','Pro','Master','Jago','Cerdas','Hebat','Juara','Sakti','Top','Bintang','Raja','Ratu','Super','Mega','Ultra','Turbo'];
    const noun = ['Gamer','Player','Hero','Sultan','Petarung','Jagoan','Champion','Knight','Warrior','Hunter','Sniper','Mage','Pahlawan','Ksatria','Pendekar','Penguasa'];
    const a = adj[Math.floor(Math.random() * adj.length)];
    const n = noun[Math.floor(Math.random() * noun.length)];
    const num = Math.floor(Math.random() * 9000) + 1000;
    return a + n + num;
  },

  generateAvatar(name) {
    const emojis = ['🎮','🎯','🔥','⚔️','👑','🎖️','🏆','💎','🚀','⭐','🌟','✨','🎪','🎨','🎭','🎬','🦁','🐯','🐉','🦅'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return emojis[Math.abs(hash) % emojis.length];
  },

  async init() {
    console.log('[Auth] Init...');

    if (typeof firebase === 'undefined') {
      this.initLocalOnly();
      return;
    }

    try {
      if (!firebase.apps.length) firebase.initializeApp(window.FIREBASE_CONFIG);
      this.auth = firebase.auth();
      this.db = firebase.firestore();

      this.auth.onAuthStateChanged(async (user) => {
        if (user) {
          console.log('[Auth] User:', user.uid, user.isAnonymous ? '(anon)' : '(google)');

          // ===== DETEKSI USER GANTI =====
          if (this.lastUid && this.lastUid !== user.uid) {
            console.log('[Auth] User changed! Clearing old data...', this.lastUid, '→', user.uid);
            this.clearLocalData();
          }
          this.lastUid = user.uid;

          this.user = user;
          await this.loadProfile();
          this.syncLocalFromProfile();
          this.updateUI();
          this.notifyApp();
        } else {
          try { await this.auth.signInAnonymously(); }
          catch (e) { this.initLocalOnly(); }
        }
      });
    } catch (e) {
      console.error('[Auth] init error:', e);
      this.initLocalOnly();
    }
  },

  // ============================================
  // CLEAR DATA LAMA saat user ganti
  // ============================================
  clearLocalData() {
    console.log('[Auth] Clearing all yadstore_* keys...');

    const keysToKeep = [
      'yadstore_lang',           // bahasa tetap
      'yadstore_admin_hash',     // admin password
      'yadstore_admin',          // admin session
    ];

    const keysToClear = [
      'yadstore_xp', 'yadstore_gems', 'yadstore_hearts', 'yadstore_heartsUpdated',
      'yadstore_streak', 'yadstore_lastStudy', 'yadstore_completedLessons',
      'yadstore_achievements', 'yadstore_totalCorrect', 'yadstore_totalWrong',
      'yadstore_dailyXp', 'yadstore_dailyXpDate', 'yadstore_orders',
      'yadstore_reward_balance', 'yadstore_reward_totalEarned',
      'yadstore_reward_totalSpent', 'yadstore_reward_totalWithdrawn',
      'yadstore_reward_lastLogin', 'yadstore_reward_lastAdWatch',
      'yadstore_reward_lastAdDate', 'yadstore_reward_lastAdTime',
      'yadstore_reward_unlockedRewards', 'yadstore_reward_history',
      'yadstore_reward_referralCode', 'yadstore_reward_usedReferral',
      'yadstore_prices', 'yadstore_config', 'yadstore_cfg',
      'yadstore_local_user', 'yadstore_ad_pending',
    ];

    keysToClear.forEach(k => {
      try { localStorage.removeItem(k); } catch (e) {}
    });

    console.log('[Auth] Old data cleared');
  },

  // ============================================
  // LOAD PROFILE dari Firestore
  // ============================================
  async loadProfile() {
    if (!this.db || !this.user) return;

    const ref = this.db.collection('users').doc(this.user.uid);
    try {
      const doc = await ref.get();
      if (!doc.exists) {
        const name = this.user.displayName || this.generateRandomName();
        this.profile = {
          displayName: name,
          avatar: this.generateAvatar(name),
          isAnonymous: this.user.isAnonymous,
          email: this.user.email || null,
          // Game stats
          xp: 0, gems: 0, hearts: 5, streak: 0,
          completedLessons: [], achievements: [],
          totalCorrect: 0, totalWrong: 0,
          lastStudy: null,
          dailyXp: 0, dailyXpDate: null,
          // Reward
          balance: 0, totalEarned: 0, totalSpent: 0, totalWithdrawn: 0,
          lastAdWatch: 0, lastAdDate: null, lastAdTime: 0,
          referralCode: null,
          usedReferral: null,
          // Meta
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await ref.set(this.profile);
        console.log('[Auth] Profile created:', name);
      } else {
        this.profile = doc.data();
        console.log('[Auth] Profile loaded:', this.profile.displayName);
      }
    } catch (e) {
      console.error('[Auth] loadProfile:', e);
      const name = this.user.displayName || this.generateRandomName();
      this.profile = {
        displayName: name,
        avatar: this.generateAvatar(name),
        isAnonymous: this.user.isAnonymous,
        xp: 0, gems: 0, hearts: 5, streak: 0,
        completedLessons: [], achievements: [],
        totalCorrect: 0, totalWrong: 0,
        balance: 0,
      };
    }
  },

  // ============================================
  // SYNC FIRESTORE → LOCALSTORAGE
  // ============================================
  syncLocalFromProfile() {
    if (!this.profile) return;
    const p = this.profile;

    // Game stats
    const map = {
      'xp': p.xp || 0,
      'gems': p.gems || 0,
      'hearts': p.hearts !== undefined ? p.hearts : 5,
      'heartsUpdated': p.heartsUpdated || Date.now(),
      'streak': p.streak || 0,
      'lastStudy': p.lastStudy || null,
      'completedLessons': p.completedLessons || [],
      'achievements': p.achievements || [],
      'totalCorrect': p.totalCorrect || 0,
      'totalWrong': p.totalWrong || 0,
      'dailyXp': p.dailyXp || 0,
      'dailyXpDate': p.dailyXpDate || null,
    };

    Object.keys(map).forEach(k => {
      try { localStorage.setItem('yadstore_' + k, JSON.stringify(map[k])); } catch (e) {}
    });

    // Reward
    const rewardMap = {
      'yadstore_reward_balance': p.balance || 0,
      'yadstore_reward_totalEarned': p.totalEarned || 0,
      'yadstore_reward_totalSpent': p.totalSpent || 0,
      'yadstore_reward_totalWithdrawn': p.totalWithdrawn || 0,
      'yadstore_reward_lastAdWatch': p.lastAdWatch || 0,
      'yadstore_reward_lastAdDate': p.lastAdDate || null,
      'yadstore_reward_lastAdTime': p.lastAdTime || 0,
      'yadstore_reward_referralCode': p.referralCode || null,
      'yadstore_reward_usedReferral': p.usedReferral || null,
      'yadstore_reward_unlockedRewards': p.unlockedRewards || [],
    };

    Object.keys(rewardMap).forEach(k => {
      try { localStorage.setItem(k, JSON.stringify(rewardMap[k])); } catch (e) {}
    });

    console.log('[Auth] Local synced from profile');
  },

  // ============================================
  // SYNC LOCAL → FIRESTORE (dipanggil DL.save)
  // ============================================
  async saveProfile(data) {
    if (!this.db || !this.user) return;
    try {
      const ref = this.db.collection('users').doc(this.user.uid);
      await ref.set(Object.assign({}, data, { updatedAt: new Date().toISOString() }), { merge: true });
      Object.assign(this.profile, data);
    } catch (e) { console.error('[Auth] saveProfile:', e); }
  },

  // ============================================
  // LOCAL MODE (fallback)
  // ============================================
  initLocalOnly() {
    let u = null;
    try { u = JSON.parse(localStorage.getItem('yadstore_local_user') || 'null'); } catch (e) {}
    if (!u) {
      const name = this.generateRandomName();
      u = { uid: 'local_' + Date.now().toString(36), displayName: name, isAnonymous: true, isLocal: true, avatar: this.generateAvatar(name) };
      localStorage.setItem('yadstore_local_user', JSON.stringify(u));
    }
    this.user = u;
    this.lastUid = u.uid;
    this.profile = { displayName: u.displayName, avatar: u.avatar, isAnonymous: true };
    this.updateUI();
    this.notifyApp();
  },

  // ============================================
  // LOGIN GOOGLE
  // ============================================
  async loginGoogle() {
    if (!this.auth) { alert('Firebase belum aktif'); return; }
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
      if (isMobile) {
        await this.auth.signInWithRedirect(provider);
      } else {
        await this.auth.signInWithPopup(provider);
      }
    } catch (e) {
      console.error('[Auth] login error:', e);
      if (e.code === 'auth/unauthorized-domain') {
        alert('Domain belum di-whitelist di Firebase Console');
      } else if (e.code !== 'auth/popup-closed-by-user') {
        alert('Login gagal: ' + (e.message || e));
      }
    }
  },

  // ============================================
  // LOGOUT
  // ============================================
  async logout() {
    if (this.auth && this.user && !this.user.isLocal) {
      try {
        // Clear data dulu sebelum logout
        this.clearLocalData();
        await this.auth.signOut();
        // Akan otomatis bikin anonymous baru
        await this.auth.signInAnonymously();
      } catch (e) { console.error('[Auth] logout:', e); }
    } else {
      this.clearLocalData();
      localStorage.removeItem('yadstore_local_user');
      this.initLocalOnly();
    }
  },

  // ============================================
  // HELPERS
  // ============================================
  getName() { return this.profile ? this.profile.displayName : 'Guest'; },
  getAvatar() { return this.profile ? this.profile.avatar : '👤'; },
  isAnonymous() { return this.user ? this.user.isAnonymous : true; },
  isLoggedIn() { return this.user && !this.user.isAnonymous; },

  updateUI() {
    const set = (id, text) => { const e = document.getElementById(id); if (e) e.textContent = text; };
    set('profile-name', this.getName());
    set('profile-avatar-emoji', this.getAvatar());
    set('profile-status', this.isAnonymous() ? '👤 Mode Anonim' : '✅ Login Google');
    set('header-name', this.getName());
    set('header-avatar', this.getAvatar());

    const btnLogin = document.getElementById('btn-login-google');
    const btnLogout = document.getElementById('btn-logout');
    const btnChange = document.getElementById('btn-change-name');
    if (btnLogin) btnLogin.style.display = this.isAnonymous() ? 'flex' : 'none';
    if (btnLogout) btnLogout.style.display = this.isAnonymous() ? 'none' : 'block';
    if (btnChange) btnChange.style.display = this.isAnonymous() ? 'block' : 'none';
  },

  notifyApp() {
    if (typeof App !== 'undefined' && App.onUserChanged) App.onUserChanged(this.user);
  },
};

if (typeof window !== 'undefined') window.Auth = Auth;
console.log('[auth] v3 loaded');
