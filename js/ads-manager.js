/* ============================================
   YADSTORE — ADS MANAGER v17
   Script untuk domain: duniamu.my.id
   Zone ID: 31533043, 31533051, 31533052
   Updated: 2026-10-03 04:18:47
   ============================================ */

(function() {
  'use strict';

  window.AdsManager = {
    VERSION: 'v17',
    DOMAIN: 'duniamu.my.id',
    NETWORK: 'adsterra',

    CONFIG: {
      POPUNDER_ENABLED: true,
      SOCIALBAR_ENABLED: true,
      SMARTLINK_ENABLED: true,
    },

    // ============================================
    // SCRIPT ADSTERRA BARU (duniamu.my.id)
    // Zone IDs: 31533043, 31533051, 31533052
    // ============================================
    SCRIPTS: {
      popunder: 'https://pl31633542.profitableratecpmnetwork.com/2b/27/b1/2b27b195615029bd80cdff8d1c17e40c.js',
      socialbar: 'https://pl31633550.profitableratecpmnetwork.com/7b/1c/31/7b1c31412b8f5e830a1e189f92f840b7.js',
      smartlink: 'https://www.profitableratecpmnetwork.com/rnve2ckg?key=f15341dc4ed341cc62411d69d314d518',
    },

    // ============================================
    // STATE
    // ============================================
    loadedScripts: {},
    injected: {},
    initialized: false,
    lastSmartlinkOpen: 0,
    SMARTLINK_COOLDOWN: 30 * 1000,

    // ============================================
    // INIT
    // ============================================
    init() {
      if (this.initialized) {
        console.log('[AdsManager] Already init');
        return;
      }
      this.initialized = true;
      console.log('[AdsManager] ' + this.VERSION + ' INIT');
      console.log('[AdsManager] Domain: ' + this.DOMAIN);
      console.log('[AdsManager] Config:', this.CONFIG);

      this.loadAds();
    },

    loadAds(force) {
      var self = this;
      var cb = Date.now();

      // POPUNDER (Zone 31533043)
      if (this.CONFIG.POPUNDER_ENABLED) {
        setTimeout(function() {
          if (force || !self.injected['adsterra-popunder']) {
            console.log('[AdsManager] Inject popunder (zone 31533043)...');
            self.injectScript(self.SCRIPTS.popunder + '?cb=' + cb, 'adsterra-popunder');
            self.injected['adsterra-popunder'] = true;
          }
        }, 500);
      }

      // SOCIALBAR (Zone 31533051)
      if (this.CONFIG.SOCIALBAR_ENABLED) {
        setTimeout(function() {
          if (force || !self.injected['adsterra-socialbar']) {
            console.log('[AdsManager] Inject socialbar (zone 31533051)...');
            self.injectScript(self.SCRIPTS.socialbar + '?cb=' + cb, 'adsterra-socialbar');
            self.injected['adsterra-socialbar'] = true;
          }
        }, 1500);
      }
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
          s.onerror = function(e) {
            console.error('[AdsManager] ✗ Error ' + id, e);
            done(false);
          };
          setTimeout(function() { done(true); }, 8000);
          document.head.appendChild(s);
        } catch (e) {
          console.error('[AdsManager] Inject error:', e);
          resolve(false);
        }
      });
    },

    // ============================================
    // OPEN REWARDED AD (Smartlink)
    // Zone 31533052
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
      var popup = null;
      try {
        popup = window.open(smartlink, '_blank', 'width=800,height=600');
      } catch (e) {}

      if (!popup || popup.closed) {
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

    getActiveNetwork() { return 'adsterra'; },
  };

  // ============================================
  // AUTO INIT
  // ============================================
  function startAds() {
    console.log('[AdsManager] Starting...');
    try {
      window.AdsManager.init();
    } catch (e) {
      console.error('[AdsManager] Init error:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAds);
  } else {
    setTimeout(startAds, 100);
  }

  // Force restart setelah 3 detik
  setTimeout(function() {
    if (window.AdsManager && window.AdsManager.initialized) {
      console.log('[AdsManager] Force reload scripts');
      window.AdsManager.loadAds(true);
    }
  }, 3000);

  console.log('[ads-manager] ' + window.AdsManager.VERSION + ' loaded for ' + window.AdsManager.DOMAIN);
})();
