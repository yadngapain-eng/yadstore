/* ============================================
   YADSTORE — ADS MANAGER v11
   Adsterra + Monetag (Multi Network)
   ============================================ */

window.AdsManager = {
  VERSION: 'v11',

  NETWORKS: {
    monetag: {
      name: 'Monetag',
      enabled: true,
      priority: 1,
      swDomain: '5gvci.com',
      zones: {
        push: 11893259,
        vignette: 11893258,
        inpage: 11893257,
        popunder: 11893256,
      },
      swZone: 11886708,
    },
    adsterra: {
      name: 'Adsterra',
      enabled: true,
      priority: 2,
      scripts: {
        popunder: 'https://pl31468159.profitableratecpmnetwork.com/43/b7/10/43b7103677aebe9ac1a73fef2f093d8e.js',
        socialbar: 'https://pl31468161.profitableratecpmnetwork.com/5a/74/05/5a7405d3227ef77d3f28c27fb6024aa6.js',
      },
      smartlink: 'https://www.profitableratecpmnetwork.com/hs7rgc2qv?key=ee5218af9bd180dc813a71fe59ddb5dd',
    },
  },

  MODE: 'monetag-priority',
  currentRotation: 'adsterra',
  loadedScripts: {},
  injected: {},
  initialized: false,

  // Cooldowns
  lastSmartlinkOpen: 0,
  SMARTLINK_COOLDOWN: 30 * 1000,

  // ============================================
  // INIT
  // ============================================
  init() {
    if (this.initialized) return;
    this.initialized = true;
    console.log('[AdsManager] ' + this.VERSION + ' init (mode: ' + this.MODE + ')');

    // Register Service Worker (untuk Monetag)
    if (this.NETWORKS.monetag.enabled) {
      this.registerSW();
    }

    // Load sesuai prioritas
    var order = this.getLoadOrder();
    console.log('[AdsManager] Load order:', order);

    var self = this;
    var delay = 300;
    order.forEach(function(network) {
      setTimeout(function() {
        if (network === 'monetag') self.loadMonetagAds();
        else if (network === 'adsterra') self.loadAdsterraAds();
      }, delay);
      delay += 1500;
    });

    // Re-inject backup
    setTimeout(function() { self.reinjectAll(); }, 10000);
    setTimeout(function() { self.reinjectAll(); }, 25000);
    setInterval(function() { self.reinjectFailed(); }, 30000);

    console.log('[AdsManager] Ready');
  },

  // ============================================
  // LOAD ORDER berdasarkan MODE
  // ============================================
  getLoadOrder() {
    var m = this.NETWORKS.monetag;
    var a = this.NETWORKS.adsterra;

    if (this.MODE === 'adsterra-priority') {
      return ['adsterra', 'monetag'].filter(function(n) {
        return (n === 'adsterra' && a.enabled) || (n === 'monetag' && m.enabled);
      });
    }
    if (this.MODE === 'balanced') {
      return ['monetag', 'adsterra'].filter(function(n) {
        return (n === 'monetag' && m.enabled) || (n === 'adsterra' && a.enabled);
      });
    }
    // Default: monetag-priority
    return ['monetag', 'adsterra'].filter(function(n) {
      return (n === 'monetag' && m.enabled) || (n === 'adsterra' && a.enabled);
    });
  },

  // ============================================
  // SERVICE WORKER (Monetag)
  // ============================================
  registerSW() {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.getRegistrations().then(function(regs) {
      regs.forEach(function(reg) { reg.unregister(); });

      var swUrl = '/sw.js?v=' + Date.now();
      navigator.serviceWorker.register(swUrl)
        .then(function(reg) {
          console.log('[AdsManager] SW registered');
          if (reg.update) reg.update();
        })
        .catch(function(e) {
          console.warn('[AdsManager] SW fail:', e.message);
        });
    });
  },

  // ============================================
  // LOAD MONETAG
  // ============================================
  loadMonetagAds(force) {
    var m = this.NETWORKS.monetag;
    if (!m.enabled) return;

    console.log('[AdsManager] Loading MONETAG' + (force ? ' (force)' : ''));

    var d = m.swDomain;
    var z = m.zones;
    var cb = Date.now();
    var self = this;

    // Vignette — P1
    setTimeout(function() {
      if (force || !self.injected['monetag-vignette']) {
        self.injectScript('https://' + d + '/act/files/tag.min.js?z=' + z.vignette + '&cb=' + cb, 'monetag-vignette');
        self.injected['monetag-vignette'] = true;
      }
    }, 300);

    // In-Page
    setTimeout(function() {
      if (force || !self.injected['monetag-inpage']) {
        self.injectScript('https://' + d + '/act/files/tag.min.js?z=' + z.inpage + '&cb=' + cb, 'monetag-inpage');
        self.injected['monetag-inpage'] = true;
      }
    }, 1200);

    // Popunder
    setTimeout(function() {
      if (force || !self.injected['monetag-popunder']) {
        self.injectScript('https://' + d + '/act/files/tag.min.js?z=' + z.popunder + '&cb=' + cb, 'monetag-popunder');
        self.injected['monetag-popunder'] = true;
      }
    }, 2000);

    // Push
    setTimeout(function() {
      if (force || !self.injected['monetag-push']) {
        self.injectScript('https://' + d + '/act/files/tag.min.js?z=' + z.push + '&cb=' + cb, 'monetag-push');
        self.injected['monetag-push'] = true;
      }
    }, 2800);
  },

  // ============================================
  // LOAD ADSTERRA
  // ============================================
  loadAdsterraAds(force) {
    var a = this.NETWORKS.adsterra;
    if (!a.enabled) return;

    console.log('[AdsManager] Loading ADSTERRA' + (force ? ' (force)' : ''));

    var cb = Date.now();
    var self = this;

    // Popunder
    setTimeout(function() {
      if (force || !self.injected['adsterra-popunder']) {
        self.injectScript(a.scripts.popunder + '?cb=' + cb, 'adsterra-popunder');
        self.injected['adsterra-popunder'] = true;
        console.log('[AdsManager] ✓ adsterra-popunder');
      }
    }, 500);

    // Social Bar
    setTimeout(function() {
      if (force || !self.injected['adsterra-socialbar']) {
        self.injectScript(a.scripts.socialbar + '?cb=' + cb, 'adsterra-socialbar');
        self.injected['adsterra-socialbar'] = true;
        console.log('[AdsManager] ✓ adsterra-socialbar');
      }
    }, 1800);
  },

  // ============================================
  // REINJECT ALL
  // ============================================
  reinjectAll() {
    console.log('[AdsManager] Re-inject all...');
    if (this.NETWORKS.monetag.enabled) this.loadMonetagAds(true);
    if (this.NETWORKS.adsterra.enabled) this.loadAdsterraAds(true);
  },

  reinjectFailed() {
    var self = this;
    Object.keys(this.loadedScripts).forEach(function(id) {
      if (self.loadedScripts[id] === false) {
        console.log('[AdsManager] Re-inject failed:', id);
        self.injected[id] = false;
      }
    });
  },

  // ============================================
  // OPEN REWARDED AD
  // ============================================
  async openRewarded() {
    // Coba Adsterra smartlink (paling reliable)
    return this.openAdsterraRewarded();
  },

  async openAdsterraRewarded() {
    var now = Date.now();
    if (now - this.lastSmartlinkOpen < this.SMARTLINK_COOLDOWN) {
      var remain = Math.ceil((this.SMARTLINK_COOLDOWN - (now - this.lastSmartlinkOpen)) / 1000);
      return { success: false, reason: 'cooldown', remain: remain };
    }

    var smartlink = this.NETWORKS.adsterra.smartlink;
    if (!smartlink) return { success: false, reason: 'no_smartlink' };

    console.log('[AdsManager] Opening Adsterra smartlink...');

    var popup = null;
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

  // ============================================
  // INJECT SCRIPT
  // ============================================
  injectScript(src, id) {
    var self = this;
    return new Promise(function(resolve) {
      try {
        var old = document.getElementById(id);
        if (old) old.remove();

        var s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.setAttribute('data-cfasync', 'false');
        s.setAttribute('data-zone', id);
        if (id) s.id = id;

        var resolved = false;
        var done = function(ok) {
          if (resolved) return;
          resolved = true;
          self.loadedScripts[id] = ok;
          console.log('[AdsManager] ' + (ok ? '✓' : '✗') + ' ' + id);
          resolve(ok);
        };

        s.onload = function() { done(true); };
        s.onerror = function() { done(false); };
        setTimeout(function() { done(true); }, 8000);
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
    document.addEventListener('DOMContentLoaded', function() {
      window.AdsManager.init();
    });
  } else {
    window.AdsManager.init();
  }
}

console.log('[ads-manager] ' + window.AdsManager.VERSION + ' loaded — mode: ' + window.AdsManager.MODE);
