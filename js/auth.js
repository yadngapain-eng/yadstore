/* YADSTORE — AUTH MANAGER */

const Auth = {
  user: null,
  profile: null,
  db: null,
  auth: null,

  generateRandomName() {
    const adj = ['Cepat','Pintar','Ganteng','Cantik','Keren','Pro','Master','Jago','Cerdas','Hebat','Juara','Sakti','Top','Bintang','Raja','Ratu','Super','Mega','Ultra','Turbo','Epic','Legend','Mythic'];
    const noun = ['Gamer','Player','Hero','Sultan','Petarung','Jagoan','Champion','Knight','Warrior','Hunter','Sniper','Mage','Pahlawan','Ksatria','Pendekar','Penguasa'];
    const a = adj[Math.floor(Math.random() * adj.length)];
    const n = noun[Math.floor(Math.random() * noun.length)];
    const num = Math.floor(Math.random() * 9000) + 1000;
    return a + n + num;
  },

  generateAvatar(name) {
    const emojis = ['🎮','🎯','🔥','⚔️','👑','🎖️','🏆','💎','🚀','⭐','🌟','✨','🎪','🎨','🎭','🎬','🦁','🐯','🐉','🦅','🐺','🦊','🐻','🦄'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return emojis[Math.abs(hash) % emojis.length];
  },

  async init() {
    console.log('[Auth] Initializing...');
    if (typeof firebase === 'undefined') {
      console.warn('[Auth] Firebase SDK missing');
      this.initLocalOnly();
      return;
    }
    try {
      if (!firebase.apps.length) firebase.initializeApp(window.FIREBASE_CONFIG);
      this.auth = firebase.auth();
      this.db = firebase.firestore();

      console.log('[Auth] Firebase initialized');

      this.auth.onAuthStateChanged(async (user) => {
        if (user) {
          console.log('[Auth] User logged in:', user.uid, user.isAnonymous ? '(anon)' : '(google)');
          this.user = user;
          await this.loadProfile();
          this.updateUI();
          this.notifyApp();
        } else {
          console.log('[Auth] No user, creating anonymous...');
          try {
            await this.auth.signInAnonymously();
          } catch (e) {
            console.error('[Auth] Anonymous failed:', e);
            this.initLocalOnly();
          }
        }
      });
    } catch (e) {
      console.error('[Auth] init error:', e);
      this.initLocalOnly();
    }
  },

  initLocalOnly() {
    console.log('[Auth] Fallback to local mode');
    let u = null;
    try { u = JSON.parse(localStorage.getItem('yadstore_local_user') || 'null'); } catch(e) {}
    if (!u) {
      const name = this.generateRandomName();
      u = { uid: 'local_' + Date.now().toString(36), displayName: name, isAnonymous: true, isLocal: true, avatar: this.generateAvatar(name) };
      localStorage.setItem('yadstore_local_user', JSON.stringify(u));
    }
    this.user = u;
    this.profile = { displayName: u.displayName, avatar: u.avatar, isAnonymous: u.isAnonymous };
    this.updateUI();
    this.notifyApp();
  },

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
          xp: 0, gems: 0, hearts: 5, streak: 0,
          completedLessons: [], achievements: [],
          totalCorrect: 0, totalWrong: 0,
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
      console.error('[Auth] loadProfile error:', e);
      this.profile = {
        displayName: this.user.displayName || this.generateRandomName(),
        isAnonymous: this.user.isAnonymous,
        avatar: this.generateAvatar('Player')
      };
    }
  },

  async saveProfile(data) {
    if (!this.db || !this.user) return;
    try {
      const ref = this.db.collection('users').doc(this.user.uid);
      await ref.set(Object.assign({}, data, { updatedAt: new Date().toISOString() }), { merge: true });
      Object.assign(this.profile, data);
    } catch (e) { console.error('[Auth] saveProfile error:', e); }
  },

  async loginGoogle() {
    if (!this.auth) { alert('Firebase belum aktif'); return; }
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await this.auth.signInWithPopup(provider);
      console.log('[Auth] Google login OK:', result.user.email);
      return result.user;
    } catch (e) {
      console.error('[Auth] login error:', e);
      if (e.code === 'auth/popup-blocked') alert('Popup diblokir. Izinkan popup di browser.');
      else if (e.code === 'auth/popup-closed-by-user') return;
      else if (e.code === 'auth/unauthorized-domain') alert('Domain belum di-whitelist.\n\nBuka Firebase Console → Authentication → Settings → Authorized domains → Tambah: duniamu.my.id');
      else alert('Login gagal: ' + (e.message || e));
    }
  },

  async logout() {
    if (this.auth && this.user && !this.user.isLocal) {
      try {
        await this.auth.signOut();
        await this.auth.signInAnonymously();
        console.log('[Auth] Logged out, new anonymous created');
      } catch (e) { console.error('[Auth] logout error:', e); }
    } else {
      localStorage.removeItem('yadstore_local_user');
      this.initLocalOnly();
    }
  },

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
