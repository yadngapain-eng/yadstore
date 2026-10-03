/* ============================================
   YADSTORE — ADS MANAGER v13 (ADSTERRA ONLY)
   Semua iklan dari Adsterra
   ============================================ */

window.AdsManager = {
  VERSION: 'v13',
  NETWORK: 'adsterra',

  CONFIG: {
    POPUNDER_ENABLED: true,
    SOCIALBAR_ENABLED: true,
    SMARTLINK_ENABLED: true,
  },

  // ============================================
  // URL SCRIPT ADSTERRA
  // ============================================
  SCRIPTS: {
    popunder: 'https://pl31468159.profitableratecpmnetwork.com/43/b7/10/43b7103677aebe9ac1a73fef2f093d8e.js',
    socialbar: 'https://pl31468161.profitableratecpmnetwork.com/5a/74/05/5a7405d3227ef77d3f28c27fb6024aa6.js',
    smartlink: 'https://www.profitableratecpmnetwork.com/hs7rgc2qv?key=ee5218af9bd180dc813a71fe59ddb5dd',
  },

  // ============================================
  // STATE
  // ============================================
  loadedScripts: {},
  injected: {},
  initialized: false,
  lastSmartlinkOpen: 0,
  SMARTLINK_COOLDOWN: 30 * 1000,
  reinjectTimers: [],

  // ============================================
  // INIT
  // ============================================
  init() {
    if (this.initialized) return;
    this.initialized = true;
    console.log('[AdsManager] ' + this.VERSION + ' init (Adsterra only)');

    var self = this;

    // Load Adsterra scripts
    this.loadAdsterraAds();

    // Backup re-inject
    setTimeout(function() { self.loadAdsterraAds(true); }, 10000);
    setTimeout(function() { self.loadAdsterraAds(true); }, 25000);

    // Reinject failed setiap 30 detik
    setInterval(function() { self.reinjectFailed(); }, 30000);

    console.log('[AdsManager] Ready');
  },

  // ============================================
  // LOAD ADSTERRA
  // ============================================
  loadAdsterraAds(force) {
    var self = this;
    console.log('[AdsManager] Loading Adsterra' + (force ? ' (force)' : '') + '...');

    var cb = Date.now();

    // Popunder
    if (this.CONFIG.POPUNDER_ENABLED) {
      setTimeout(function() {
        if (force || !self.injected['adsterra-popunder']) {
          self.injectScript(self.SCRIPTS.popunder + '?cb=' + cb, 'adsterra-popunder');
          self.injected['adsterra-popunder'] = true;
        }
      }, 500);
    }

    // Social Bar
    if (this.CONFIG.SOCIALBAR_ENABLED) {
      setTimeout(function() {
        if (force || !self.injected['adsterra-socialbar']) {
          self.injectScript(self.SCRIPTS.socialbar + '?cb=' + cb, 'adsterra-socialbar');
          self.injected['adsterra-socialbar'] = true;
        }
      }, 1800);
    }

    console.log('[AdsManager] Adsterra loaded');
  },

  // ============================================
  // REINJECT FAILED
  // ============================================
  reinjectFailed() {
    var self = this;
    Object.keys(this.loadedScripts).forEach(function(id) {
      if (self.loadedScripts[id] === false) {
        console.log('[AdsManager] Re-inject failed:', id);
        self.injected[id] = false;
        // Re-trigger load
        if (id === 'adsterra-popunder') self.loadAdsterraAds(true);
      }
    });
  },

  // ============================================
  // OPEN REWARDED AD (Smartlink)
  // ============================================
  async openRewarded() {
    if (!this.CONFIG.SMARTLINK_ENABLED) {
      return { success: false, reason: 'smartlink_disabled' };
    }

    var now = Date.now();
    if (now - this.lastSmartlinkOpen < this.SMARTLINK_COOLDOWN) {
      var remain = Math.ceil((this.SMARTLINK_COOLDOWN - (now - this.lastSmartlinkOpen)) / 1000);
      return { success: false, reason: 'cooldown', remain: remain };
    }

    var smartlink = this.SCRIPTS.smartlink;
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
        s.id = id;

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

  getActiveNetwork() { return 'adsterra'; },
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
    setTimeout(function() { window.AdsManager.init(); }, 100);
  }
}

console.log('[ads-manager] ' + window.AdsManager.VERSION + ' loaded (Adsterra only)');
