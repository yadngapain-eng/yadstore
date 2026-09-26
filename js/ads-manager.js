/* ============================================
   YADSTORE — ADS MANAGER v7
   Auto: Popunder, Social Bar, Vignette, In-Page, Push
   Manual: Smartlink (Rewarded)
   ============================================ */

window.AdsManager = {
  // ============================================
  // CONFIG SEMUA NETWORK
  // ============================================
  NETWORKS: {
    adsterra: {
      name: 'Adsterra',
      enabled: true,
      // Auto-inject scripts
      scripts: {
        popunder: 'https://pl31468159.profitableratecpmnetwork.com/43/b7/10/43b7103677aebe9ac1a73fef2f093d8e.js',
        socialbar: 'https://pl31468161.profitableratecpmnetwork.com/5a/74/05/5a7405d3227ef77d3f28c27fb6024aa6.js',
      },
      // Smartlink untuk rewarded (HANYA saat klik "Nonton Iklan")
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
      smartlink: null,
    },
  },

  // ============================================
  // STATE
  // ============================================
  currentRotation: 'adsterra',
  lastRotation: 0,
  ROTATION_INTERVAL: 60 * 1000,
  lastSmartlinkOpen: 0,
  SMARTLINK_COOLDOWN: 30 * 1000,
  loadedScripts: {},

  // ============================================
  // INIT
  // ============================================
  init() {
    console.log('[AdsManager] v7 — Full ads enabled');

    // 1. Register Service Worker
    this.registerSW();

    // 2. Auto-inject SEMUA background ads
    setTimeout(() => this.loadBackgroundAds(), 2000);

    // 3. Rotasi network tiap menit
    setInterval(() => this.rotateBackground(), this.ROTATION_INTERVAL);

    console.log('[AdsManager] Ready');
  },

  // ============================================
  // SERVICE WORKER
  // ============================================
  registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => {
          console.log('[AdsManager] SW registered');
          if (reg.update) reg.update();
        })
        .catch(e => console.warn('[AdsManager] SW fail:', e.message));
    }
  },

  // ============================================
  // AUTO-LOAD SEMUA BACKGROUND ADS
  // ============================================
  loadBackgroundAds() {
    console.log('[AdsManager] Loading all background ads...');

    // ===== Adsterra =====
    const adsterra = this.NETWORKS.adsterra;
    if (adsterra.enabled) {
      this.injectScript(adsterra.scripts.popunder, 'adsterra-popunder');
      setTimeout(() => {
        this.injectScript(adsterra.scripts.socialbar, 'adsterra-socialbar');
      }, 2000);
    }

    // ===== Monetag =====
    const monetag = this.NETWORKS.monetag;
    if (monetag.enabled) {
      const domain = monetag.swDomain;
      const z = monetag.zones;

      setTimeout(() => {
        this.injectScript('https://' + domain + '/act/files/tag.min.js?z=' + z.vignette, 'monetag-vignette');
      }, 3000);

      setTimeout(() => {
        this.injectScript('https://' + domain + '/act/files/tag.min.js?z=' + z.inpage, 'monetag-inpage');
      }, 5000);

      setTimeout(() => {
        this.injectScript('https://' + domain + '/act/files/tag.min.js?z=' + z.push, 'monetag-push');
      }, 7000);

      setTimeout(() => {
        this.injectScript('https://' + domain + '/act/files/tag.min.js?z=' + z.popunder, 'monetag-popunder');
      }, 9000);
    }

    console.log('[AdsManager] All background ads injected');
  },

  // ============================================
  // ROTATE BACKGROUND
  // ============================================
  rotateBackground() {
    const networks = Object.keys(this.NETWORKS).filter(k => this.NETWORKS[k].enabled);
    if (networks.length < 2) return;

    const currentIdx = networks.indexOf(this.currentRotation);
    const nextIdx = (currentIdx + 1) % networks.length;
    this.currentRotation = networks[nextIdx];

    console.log('[AdsManager] Rotation:', this.currentRotation);
    this.lastRotation = Date.now();

    // Reload ads untuk network baru
    if (this.currentRotation === 'adsterra') {
      this.injectScript(this.NETWORKS.adsterra.scripts.socialbar, 'adsterra-socialbar-r' + Date.now());
    } else if (this.currentRotation === 'monetag') {
      this.injectScript(
        'https://' + this.NETWORKS.monetag.swDomain + '/act/files/tag.min.js?z=' + this.NETWORKS.monetag.zones.vignette + '&t=' + Date.now(),
        'monetag-vignette-r' + Date.now()
      );
    }
  },

  // ============================================
  // SMARTLINK (HANYA dipanggil saat user klik "Nonton Iklan")
  // ============================================
  async openRewarded() {
    const now = Date.now();
    if (now - this.lastSmartlinkOpen < this.SMARTLINK_COOLDOWN) {
      const remain = Math.ceil((this.SMARTLINK_COOLDOWN - (now - this.lastSmartlinkOpen)) / 1000);
      return { success: false, reason: 'cooldown', remain: remain };
    }

    const smartlink = this.NETWORKS.adsterra.smartlink;
    if (!smartlink) {
      return { success: false, reason: 'no_smartlink' };
    }

    console.log('[AdsManager] Opening smartlink');

    // Coba popup (tab baru)
    let popup = null;
    try {
      popup = window.open(smartlink, '_blank', 'width=800,height=600,noopener,noreferrer');
    } catch (e) {
      console.warn('[AdsManager] popup error:', e);
    }

    // Kalau popup diblokir → redirect
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
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

  // ============================================
  // INJECT SCRIPT HELPER
  // ============================================
  injectScript(src, id) {
    return new Promise((resolve) => {
      if (id && document.getElementById(id)) {
        resolve(true);
        return;
      }

      try {
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.setAttribute('data-cfasync', 'false');
        if (id) s.id = id;

        let resolved = false;
        const done = (ok) => {
          if (resolved) return;
          resolved = true;
          this.loadedScripts[id] = ok;
          resolve(ok);
        };

        s.onload = () => done(true);
        s.onerror = () => done(false);
        setTimeout(() => done(true), 5000);

        document.head.appendChild(s);
        console.log('[AdsManager] Injected:', id || src.slice(-30));
      } catch (e) {
        console.warn('[AdsManager] inject error:', e);
        resolve(false);
      }
    });
  },

  getActiveNetwork() {
    return this.currentRotation;
  },
};

// ============================================
// AUTO INIT
// ============================================
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.AdsManager.init());
  } else {
    setTimeout(() => window.AdsManager.init(), 300);
  }
}
console.log('[ads-manager] v7 loaded — FULL ADS');
