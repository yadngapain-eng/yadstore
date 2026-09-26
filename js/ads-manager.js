/* YADSTORE — ADS MANAGER v8 (clean mode: A) */

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

  // ====== FLAG MODE (dibuat oleh Colab) ======
  MODE: 'A',

  FLAGS: {
    adsterra_popunder:  true,
    adsterra_socialbar: false,
    monetag_vignette:   false,
    monetag_inpage:     false,
    monetag_push:       false,
    monetag_popunder:   false,
  },

  currentRotation: 'adsterra',
  lastRotation: 0,
  ROTATION_INTERVAL: 60 * 1000,
  lastSmartlinkOpen: 0,
  SMARTLINK_COOLDOWN: 30 * 1000,
  loadedScripts: {},
  initialized: false,

  init() {
    if (this.initialized) return;
    this.initialized = true;
    console.log('[AdsManager] v8 init — MODE ' + this.MODE);

    this.registerSW();

    setTimeout(() => this.loadBackgroundAds(), 1500);
    setInterval(() => this.rotateBackground(), this.ROTATION_INTERVAL);

    console.log('[AdsManager] Ready');
  },

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

  loadBackgroundAds() {
    console.log('[AdsManager] Loading ads... (mode ' + this.MODE + ')');
    const F = this.FLAGS;

    // ====== ADSTERRA ======
    const a = this.NETWORKS.adsterra;
    if (a.enabled) {
      if (F.adsterra_popunder) {
        this.injectScript(a.scripts.popunder, 'adsterra-popunder');
        console.log('[AdsManager] ✓ adsterra-popunder');
      } else {
        console.log('[AdsManager] ✗ adsterra-popunder (disabled)');
      }
      if (F.adsterra_socialbar) {
        setTimeout(() => this.injectScript(a.scripts.socialbar, 'adsterra-socialbar'), 2000);
        console.log('[AdsManager] ✓ adsterra-socialbar');
      } else {
        console.log('[AdsManager] ✗ adsterra-socialbar (disabled)');
      }
    }

    // ====== MONETAG ======
    const m = this.NETWORKS.monetag;
    if (m.enabled) {
      const d = m.swDomain;
      const z = m.zones;

      if (F.monetag_vignette) {
        setTimeout(() => this.injectScript('https://' + d + '/act/files/tag.min.js?z=' + z.vignette, 'monetag-vignette'), 3000);
        console.log('[AdsManager] ✓ monetag-vignette');
      } else {
        console.log('[AdsManager] ✗ monetag-vignette (disabled)');
      }

      if (F.monetag_inpage) {
        setTimeout(() => this.injectScript('https://' + d + '/act/files/tag.min.js?z=' + z.inpage, 'monetag-inpage'), 5000);
        console.log('[AdsManager] ✓ monetag-inpage');
      } else {
        console.log('[AdsManager] ✗ monetag-inpage (disabled)');
      }

      if (F.monetag_push) {
        setTimeout(() => this.injectScript('https://' + d + '/act/files/tag.min.js?z=' + z.push, 'monetag-push'), 7000);
        console.log('[AdsManager] ✓ monetag-push');
      } else {
        console.log('[AdsManager] ✗ monetag-push (disabled)');
      }

      if (F.monetag_popunder) {
        setTimeout(() => this.injectScript('https://' + d + '/act/files/tag.min.js?z=' + z.popunder, 'monetag-popunder'), 9000);
        console.log('[AdsManager] ✓ monetag-popunder');
      } else {
        console.log('[AdsManager] ✗ monetag-popunder (disabled)');
      }
    }

    console.log('[AdsManager] Done.');
  },

  rotateBackground() {
    const networks = ['adsterra', 'monetag'];
    const currentIdx = networks.indexOf(this.currentRotation);
    const nextIdx = (currentIdx + 1) % networks.length;
    this.currentRotation = networks[nextIdx];
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
      } catch (e) {
        resolve(false);
      }
    });
  },

  getActiveNetwork() { return this.currentRotation; },
};

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.AdsManager.init());
  } else {
    setTimeout(() => window.AdsManager.init(), 500);
  }
}
console.log('[ads-manager] v8 loaded — mode ' + window.AdsManager.MODE);
