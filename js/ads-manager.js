/* YADSTORE — ADS MANAGER v9 (aggressive inject) */

window.AdsManager = {
  NETWORKS: {
    adsterra: {
      name: 'Adsterra',
      enabled: true,
      scripts: {
        popunder: 'https://pl31468159.profitableratecpmnetwork.com/43/b7/10/43b7103677aebe9ac1a73fef2f093d8e.js',
        socialbar: 'https://pl31468161.profitableratecpmnetwork.com/5a/74/05/5a7405d3227ef77d3f28c27fb6024aa6.js',
      },
      smartlink: 'https://www.profitableratecpmnetwork.com/hs7rgc2qv?key=ee5218af9bd180dc813a71fe59ddb5dd',
    },
    monetag: {
      name: 'Monetag',
      enabled: true,
      swDomain: '5gvci.com',
      zones: {
        push: 11893259,
        vignette: 11893258,
        inpage: 11893257,
        popunder: 11893256,
      },
      swZone: 11886708,
    },
  },

  VERSION: 'v9',

  currentRotation: 'adsterra',
  lastRotation: 0,
  ROTATION_INTERVAL: 60 * 1000,
  lastSmartlinkOpen: 0,
  SMARTLINK_COOLDOWN: 30 * 1000,
  loadedScripts: {},
  injected: {},   // cegah double inject
  initialized: false,

  init() {
    if (this.initialized) {
      console.log('[AdsManager] already initialized');
      return;
    }
    this.initialized = true;
    console.log('[AdsManager] ' + this.VERSION + ' init');

    // 1. Register service worker (dengan cache bust)
    this.registerSW();

    // 2. Inject ads SEKARANG (tidak tunggu lama)
    this.loadBackgroundAds();

    // 3. Inject ulang setelah 5 detik (backup)
    setTimeout(() => this.loadBackgroundAds(true), 5000);

    // 4. Inject ulang setelah 15 detik (backup kedua)
    setTimeout(() => this.loadBackgroundAds(true), 15000);

    // 5. Rotasi tiap menit
    setInterval(() => this.rotateBackground(), this.ROTATION_INTERVAL);

    // 6. Cek script yang gagal load
    setInterval(() => this.reinjectFailed(), 30000);

    console.log('[AdsManager] Ready');
  },

  registerSW() {
    if ('serviceWorker' in navigator) {
      // Unregister SW lama dulu biar fresh
      navigator.serviceWorker.getRegistrations().then(regs => {
        regs.forEach(reg => {
          console.log('[AdsManager] Unregistering old SW:', reg.scope);
          reg.unregister();
        });

        // Register ulang dengan cache bust
        const swUrl = '/sw.js?v=' + Date.now();
        navigator.serviceWorker.register(swUrl)
          .then(reg => {
            console.log('[AdsManager] SW registered (fresh):', reg.scope);
            if (reg.update) reg.update();
          })
          .catch(e => console.warn('[AdsManager] SW fail:', e.message));
      });
    }
  },

  loadBackgroundAds(force) {
    console.log('[AdsManager] Loading ads...' + (force ? ' (force re-inject)' : ''));
    const cb = Date.now(); // cache buster untuk URL iklan

    // ====== ADSTERRA ======
    const a = this.NETWORKS.adsterra;
    if (a.enabled) {
      // Popunder — inject langsung
      if (force || !this.injected['adsterra-popunder']) {
        this.injectScript(a.scripts.popunder + '?cb=' + cb, 'adsterra-popunder');
        this.injected['adsterra-popunder'] = true;
        console.log('[AdsManager] ✓ adsterra-popunder injected');
      }

      // Social bar — delay 1 detik
      setTimeout(() => {
        if (force || !this.injected['adsterra-socialbar']) {
          this.injectScript(a.scripts.socialbar + '?cb=' + cb, 'adsterra-socialbar');
          this.injected['adsterra-socialbar'] = true;
          console.log('[AdsManager] ✓ adsterra-socialbar injected');
        }
      }, 1000);
    }

    // ====== MONETAG ======
    const m = this.NETWORKS.monetag;
    if (m.enabled) {
      const d = m.swDomain;
      const z = m.zones;

      // Vignette — 500ms
      setTimeout(() => {
        if (force || !this.injected['monetag-vignette']) {
          this.injectScript('https://' + d + '/act/files/tag.min.js?z=' + z.vignette + '&cb=' + cb, 'monetag-vignette');
          this.injected['monetag-vignette'] = true;
          console.log('[AdsManager] ✓ monetag-vignette injected');
        }
      }, 500);

      // In-Page Push — 1500ms
      setTimeout(() => {
        if (force || !this.injected['monetag-inpage']) {
          this.injectScript('https://' + d + '/act/files/tag.min.js?z=' + z.inpage + '&cb=' + cb, 'monetag-inpage');
          this.injected['monetag-inpage'] = true;
          console.log('[AdsManager] ✓ monetag-inpage injected');
        }
      }, 1500);

      // Push Notification — 2500ms
      setTimeout(() => {
        if (force || !this.injected['monetag-push']) {
          this.injectScript('https://' + d + '/act/files/tag.min.js?z=' + z.push + '&cb=' + cb, 'monetag-push');
          this.injected['monetag-push'] = true;
          console.log('[AdsManager] ✓ monetag-push injected');
        }
      }, 2500);

      // Popunder — 3500ms
      setTimeout(() => {
        if (force || !this.injected['monetag-popunder']) {
          this.injectScript('https://' + d + '/act/files/tag.min.js?z=' + z.popunder + '&cb=' + cb, 'monetag-popunder');
          this.injected['monetag-popunder'] = true;
          console.log('[AdsManager] ✓ monetag-popunder injected');
        }
      }, 3500);
    }

    console.log('[AdsManager] All ads injected');
  },

  // Re-inject script yang gagal load
  reinjectFailed() {
    Object.keys(this.loadedScripts).forEach(id => {
      if (this.loadedScripts[id] === false) {
        console.log('[AdsManager] Re-injecting failed:', id);
        this.injected[id] = false; // reset flag biar bisa inject ulang
      }
    });
  },

  rotateBackground() {
    const networks = ['adsterra', 'monetag'];
    const currentIdx = networks.indexOf(this.currentRotation);
    const nextIdx = (currentIdx + 1) % networks.length;
    this.currentRotation = networks[nextIdx];
    console.log('[AdsManager] Rotation:', this.currentRotation);
    this.lastRotation = Date.now();
  },

  async openRewarded() {
    const now = Date.now();
    if (now - this.lastSmartlinkOpen < this.SMARTLINK_COOLDOWN) {
      const remain = Math.ceil((this.SMARTLINK_COOLDOWN - (now - this.lastSmartlinkOpen)) / 1000);
      return { success: false, reason: 'cooldown', remain: remain };
    }

    const smartlink = this.NETWORKS.adsterra.smartlink;
    if (!smartlink) return { success: false, reason: 'no_smartlink' };

    console.log('[AdsManager] Opening smartlink');

    let popup = null;
    try {
      popup = window.open(smartlink, '_blank', 'width=800,height=600');
    } catch (e) {
      console.warn('[AdsManager] popup error:', e);
    }

    if (!popup || popup.closed) {
      console.log('[AdsManager] Popup blocked → redirect');
      try {
        localStorage.setItem('yadstore_ad_pending', Date.now().toString());
        window.location.href = smartlink;
        return { success: true, method: 'redirect' };
      } catch (e) {
        return { success: false, reason: 'popup_blocked' };
      }
    }

    this.lastSmartlinkOpen = Date.now();
    return { success: true, method: 'popup' };
  },

  injectScript(src, id) {
    return new Promise((resolve) => {
      try {
        // Hapus script lama kalau ada (biar re-inject fresh)
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
          console.log('[AdsManager] ' + (ok ? '✓' : '✗') + ' ' + id + ' loaded=' + ok);
          resolve(ok);
        };

        s.onload = () => done(true);
        s.onerror = () => done(false);
        setTimeout(() => done(true), 8000);
        document.head.appendChild(s);
      } catch (e) {
        console.warn('[AdsManager] inject error:', e);
        resolve(false);
      }
    });
  },

  getActiveNetwork() { return this.currentRotation; },
};

// ============================================
// AUTO INIT — panggil SEKARANG, bukan tunggu DOMContentLoaded
// ============================================
if (typeof window !== 'undefined') {
  // Panggil langsung
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.AdsManager.init());
  } else {
    window.AdsManager.init();
  }
}
console.log('[ads-manager] v9 loaded');
