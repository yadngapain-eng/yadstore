/* YADSTORE — ADS MANAGER v10 (MONETAG PRIORITY) */

window.AdsManager = {
  NETWORKS: {
    monetag: {
      name: 'Monetag',
      enabled: true,
      priority: 1,        // ← MONETAG UTAMA
      swDomain: '5gvci.com',
      zones: {
        push: 11893259,
        vignette: 11893258,      // ← CPM tertinggi
        inpage: 11893257,
        popunder: 11893256,
      },
      swZone: 11886708,
      // Link untuk rewarded (vignette direct)


    },
    adsterra: {
      name: 'Adsterra',
      enabled: true,
      priority: 2,        // ← FALLBACK
      scripts: {
        popunder: 'https://pl31468159.profitableratecpmnetwork.com/43/b7/10/43b7103677aebe9ac1a73fef2f093d8e.js',
        socialbar: 'https://pl31468161.profitableratecpmnetwork.com/5a/74/05/5a7405d3227ef77d3f28c27fb6024aa6.js',
      },
      smartlink: 'https://www.profitableratecpmnetwork.com/hs7rgc2qv?key=ee5218af9bd180dc813a71fe59ddb5dd',
    },
  },

  VERSION: 'v10',

  currentRotation: 'monetag',
  lastRotation: 0,
  ROTATION_INTERVAL: 60 * 1000,
  lastSmartlinkOpen: 0,
  lastMonetagOpen: 0,
  SMARTLINK_COOLDOWN: 30 * 1000,
  MONETAG_COOLDOWN: 30 * 1000,
  loadedScripts: {},
  injected: {},
  initialized: false,

  // ============================================
  // INIT
  // ============================================
  init() {
    if (this.initialized) return;
    this.initialized = true;
    console.log('[AdsManager] ' + this.VERSION + ' init (Monetag Priority)');

    // Register SW
    this.registerSW();

    // Inject Monetag DULU (prioritas)
    this.loadMonetagAds();

    // Adsterra sebagai fallback (delay lebih lama)
    setTimeout(() => this.loadAdsterraAds(), 3000);

    // Re-inject backup
    setTimeout(() => this.loadMonetagAds(true), 8000);
    setTimeout(() => this.loadAdsterraAds(true), 15000);

    // Reinject failed
    setInterval(() => this.reinjectFailed(), 30000);

    console.log('[AdsManager] Ready');
  },

  registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(regs => {
        regs.forEach(reg => reg.unregister());
        const swUrl = '/sw.js?v=' + Date.now();
        navigator.serviceWorker.register(swUrl)
          .then(reg => {
            console.log('[AdsManager] SW registered');
            if (reg.update) reg.update();
          })
          .catch(e => console.warn('[AdsManager] SW fail:', e.message));
      });
    }
  },

  // ============================================
  // LOAD MONETAG ADS (PRIORITAS)
  // ============================================
  loadMonetagAds(force) {
    console.log('[AdsManager] Loading MONETAG ads...' + (force ? ' (force)' : ''));
    const m = this.NETWORKS.monetag;
    if (!m.enabled) return;

    const d = m.swDomain;
    const z = m.zones;
    const cb = Date.now();

    // Vignette — PRIORITAS 1 (CPM tertinggi)
    setTimeout(() => {
      if (force || !this.injected['monetag-vignette']) {
        this.injectScript('https://' + d + '/act/files/tag.min.js?z=' + z.vignette + '&cb=' + cb, 'monetag-vignette');
        this.injected['monetag-vignette'] = true;
        console.log('[AdsManager] ✓ monetag-vignette (P1)');
      }
    }, 300);

    // In-Page Push — PRIORITAS 2
    setTimeout(() => {
      if (force || !this.injected['monetag-inpage']) {
        this.injectScript('https://' + d + '/act/files/tag.min.js?z=' + z.inpage + '&cb=' + cb, 'monetag-inpage');
        this.injected['monetag-inpage'] = true;
        console.log('[AdsManager] ✓ monetag-inpage (P2)');
      }
    }, 1200);

    // Popunder — PRIORITAS 3
    setTimeout(() => {
      if (force || !this.injected['monetag-popunder']) {
        this.injectScript('https://' + d + '/act/files/tag.min.js?z=' + z.popunder + '&cb=' + cb, 'monetag-popunder');
        this.injected['monetag-popunder'] = true;
        console.log('[AdsManager] ✓ monetag-popunder (P3)');
      }
    }, 2000);

    // Push — PRIORITAS 4 (optional)
    setTimeout(() => {
      if (force || !this.injected['monetag-push']) {
        this.injectScript('https://' + d + '/act/files/tag.min.js?z=' + z.push + '&cb=' + cb, 'monetag-push');
        this.injected['monetag-push'] = true;
        console.log('[AdsManager] ✓ monetag-push (P4)');
      }
    }, 2800);

    console.log('[AdsManager] Monetag ads injected');
  },

  // ============================================
  // LOAD ADSTERRA (FALLBACK)
  // ============================================
  loadAdsterraAds(force) {
    console.log('[AdsManager] Loading Adsterra (fallback)...');
    const a = this.NETWORKS.adsterra;
    if (!a.enabled) return;

    const cb = Date.now();

    if (force || !this.injected['adsterra-popunder']) {
      this.injectScript(a.scripts.popunder + '?cb=' + cb, 'adsterra-popunder');
      this.injected['adsterra-popunder'] = true;
    }

    setTimeout(() => {
      if (force || !this.injected['adsterra-socialbar']) {
        this.injectScript(a.scripts.socialbar + '?cb=' + cb, 'adsterra-socialbar');
        this.injected['adsterra-socialbar'] = true;
      }
    }, 1500);

    console.log('[AdsManager] Adsterra ads injected');
  },

  reinjectFailed() {
    Object.keys(this.loadedScripts).forEach(id => {
      if (this.loadedScripts[id] === false) {
        console.log('[AdsManager] Re-inject failed:', id);
        this.injected[id] = false;
      }
    });
  },

  // ============================================
  // OPEN REWARDED — MONETAG UTAMA
  // ============================================
  async openRewarded() {
    // ============================================================
    // REWARDED: Pakai Adsterra Smartlink (PROVEN WORKS)
    // Monetag TIDAK PUNYA direct-link rewarded — cuma script-based
    // Jadi background ads pakai Monetag, klik rewarded pakai Adsterra
    // ============================================================
    console.log('[AdsManager] Rewarded → Adsterra smartlink');
    return this.openAdsterraRewarded();
  },

  // ============================================
  // ADSTERRA REWARDED (FALLBACK)
  // ============================================
  async openAdsterraRewarded() {
    const now = Date.now();
    if (now - this.lastSmartlinkOpen < this.SMARTLINK_COOLDOWN) {
      const remain = Math.ceil((this.SMARTLINK_COOLDOWN - (now - this.lastSmartlinkOpen)) / 1000);
      return { success: false, reason: 'cooldown', remain: remain };
    }

    const smartlink = this.NETWORKS.adsterra.smartlink;
    if (!smartlink) return { success: false, reason: 'no_smartlink' };

    console.log('[AdsManager] Opening Adsterra (fallback)...');

    let popup = null;
    try {
      popup = window.open(smartlink, '_blank', 'width=800,height=600');
    } catch (e) {}

    if (!popup || popup.closed) {
      try {
        localStorage.setItem('yadstore_ad_pending', Date.now().toString());
        window.location.href = smartlink;
        return { success: true, method: 'redirect', network: 'adsterra' };
      } catch (e) {
        return { success: false, reason: 'popup_blocked' };
      }
    }

    this.lastSmartlinkOpen = Date.now();
    return { success: true, method: 'popup', network: 'adsterra' };
  },

  injectScript(src, id) {
    return new Promise((resolve) => {
      try {
        const old = document.getElementById(id);
        if (old) old.remove();

        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.setAttribute('data-cfasync', 'false');
        s.setAttribute('data-zone', id);
        if (id) s.id = id;

        let resolved = false;
        const done = (ok) => {
          if (resolved) return;
          resolved = true;
          this.loadedScripts[id] = ok;
          console.log('[AdsManager] ' + (ok ? '✓' : '✗') + ' ' + id + ' = ' + ok);
          resolve(ok);
        };

        s.onload = () => done(true);
        s.onerror = () => done(false);
        setTimeout(() => done(true), 8000);
        document.head.appendChild(s);
      } catch (e) {
        resolve(false);
      }
    });
  },

  getActiveNetwork() { return this.currentRotation; },
};

// ============================================
// AUTO INIT
// ============================================
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.AdsManager.init());
  } else {
    window.AdsManager.init();
  }
}
console.log('[ads-manager] v10 loaded (Monetag Priority)');
