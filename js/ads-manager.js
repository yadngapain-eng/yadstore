/* ============================================
   YADSTORE — ADS MANAGER v20
   FORCE RESTORE Adsterra
   Script untuk domain: duniamu.my.id
   Generated: 2026-10-03 05:11:38
   ============================================ */

(function() {
  'use strict';
  
  console.log('[AdsManager] Script loaded, initializing...');

  window.AdsManager = {
    VERSION: 'v20',
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

    // State
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
        console.log('[AdsManager] Already initialized');
        return;
      }
      this.initialized = true;
      console.log('[AdsManager] === INIT ===');
      console.log('[AdsManager] Domain: ' + this.DOMAIN);
      console.log('[AdsManager] Config:', this.CONFIG);

      this.loadAds(false);

      // Retry setelah 5 detik
      var self = this;
      setTimeout(function() {
        console.log('[AdsManager] Retry load setelah 5s...');
        self.loadAds(true);
      }, 5000);

      // Retry lagi setelah 15 detik
      setTimeout(function() {
        console.log('[AdsManager] Retry load setelah 15s...');
        self.loadAds(true);
      }, 15000);

      console.log('[AdsManager] Ready');
    },

    // ============================================
    // LOAD ADS
    // ============================================
    loadAds(force) {
      var self = this;
      var cb = Date.now();

      if (this.CONFIG.POPUNDER_ENABLED) {
        setTimeout(function() {
          console.log('[AdsManager] Injecting popunder...');
          self.injectScript(self.SCRIPTS.popunder + '?cb=' + cb, 'adsterra-popunder');
        }, 200);
      }

      if (this.CONFIG.SOCIALBAR_ENABLED) {
        setTimeout(function() {
          console.log('[AdsManager] Injecting socialbar...');
          self.injectScript(self.SCRIPTS.socialbar + '?cb=' + cb, 'adsterra-socialbar');
        }, 1000);
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

          s.onload = function() { 
            console.log('[AdsManager] Script loaded: ' + id);
            done(true); 
          };
          s.onerror = function(e) { 
            console.error('[AdsManager] Script failed: ' + id, e);
            done(false); 
          };
          setTimeout(function() { done(true); }, 8000);
          document.head.appendChild(s);
          console.log('[AdsManager] Injected: ' + src.substring(0, 80));
        } catch (e) {
          console.error('[AdsManager] Inject error:', e);
          resolve(false);
        }
      });
    },

    // ============================================
    // REWARDED AD
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

      console.log('[AdsManager] Opening smartlink...');
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
  // AUTO INIT — Multiple triggers
  // ============================================
  function startAds() {
    console.log('[AdsManager] === START ADS ===');
    if (!window.AdsManager) {
      console.error('[AdsManager] Not defined!');
      return;
    }
    try {
      window.AdsManager.init();
    } catch (e) {
      console.error('[AdsManager] Init error:', e);
    }
  }

  // Trigger 1: DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAds);
  } else {
    setTimeout(startAds, 100);
  }

  // Trigger 2: window load
  window.addEventListener('load', function() {
    console.log('[AdsManager] Window loaded, force init...');
    setTimeout(startAds, 500);
  });

  // Trigger 3: Force after 3s
  setTimeout(function() {
    if (window.AdsManager && !window.AdsManager.initialized) {
      console.log('[AdsManager] Force init (3s timeout)');
      startAds();
    }
  }, 3000);

  console.log('[AdsManager] Script setup complete');
})();
