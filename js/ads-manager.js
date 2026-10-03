/* ============================================
   ADS MANAGER — ULTRA FALLBACK v30
   Working di semua browser
   Multiple load strategies
   ============================================ */

(function() {
  'use strict';
  
  console.log('[AdsManager] Loading...');

  window.AdsManager = {
    VERSION: 'v30',
    NETWORK: 'adsterra',
    
    // ============================================
    // SCRIPT ADSTERRA (duniamu.my.id)
    // ============================================
    SCRIPTS: {
      popunder: 'https://pl31633542.profitableratecpmnetwork.com/2b/27/b1/2b27b195615029bd80cdff8d1c17e40c.js',
      socialbar: 'https://pl31633550.profitableratecpmnetwork.com/7b/1c/31/7b1c31412b8f5e830a1e189f92f840b7.js',
      smartlink: 'https://www.profitableratecpmnetwork.com/rnve2ckg?key=f15341dc4ed341cc62411d69d314d518',
    },
    
    CONFIG: {
      POPUNDER_ENABLED: true,
      SOCIALBAR_ENABLED: true,
      SMARTLINK_ENABLED: true,
    },
    
    loadedScripts: {},
    initialized: false,
    initAttempts: 0,

    // ============================================
    // INIT — Multi-trigger
    // ============================================
    init: function() {
      if (this.initialized) {
        console.log('[AdsManager] Already initialized');
        return;
      }
      
      this.initAttempts++;
      console.log('[AdsManager] === INIT attempt #' + this.initAttempts + ' ===');
      
      this.initialized = true;
      
      // Load 1: Setelah 100ms
      var self = this;
      setTimeout(function() {
        console.log('[AdsManager] Load attempt 1');
        self.loadScripts();
      }, 100);
      
      // Load 2: Setelah 3 detik
      setTimeout(function() {
        console.log('[AdsManager] Load attempt 2');
        self.loadScripts(true);
      }, 3000);
      
      // Load 3: Setelah 8 detik
      setTimeout(function() {
        console.log('[AdsManager] Load attempt 3');
        self.loadScripts(true);
      }, 8000);
    },

    // ============================================
    // LOAD SCRIPTS
    // ============================================
    loadScripts: function(force) {
      var cb = Date.now();
      
      if (this.CONFIG.POPUNDER_ENABLED) {
        this.injectScript(this.SCRIPTS.popunder + '?cb=' + cb, 'adsterra-popunder');
      }
      
      if (this.CONFIG.SOCIALBAR_ENABLED) {
        setTimeout(function() {
          window.AdsManager.injectScript(
            window.AdsManager.SCRIPTS.socialbar + '?cb=' + cb,
            'adsterra-socialbar'
          );
        }, 500);
      }
    },

    // ============================================
    // INJECT SCRIPT — Multiple fallback methods
    // ============================================
    injectScript: function(src, id) {
      var self = this;
      
      try {
        // Hapus script lama
        var old = document.getElementById(id);
        if (old) old.remove();
        
        // Method 1: createElement
        var s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.setAttribute('data-cfasync', 'false');
        s.setAttribute('data-cfasync', 'false');
        s.id = id;
        
        s.onload = function() {
          console.log('[AdsManager] ✓ ' + id + ' loaded');
          self.loadedScripts[id] = true;
        };
        
        s.onerror = function(e) {
          console.error('[AdsManager] ✗ ' + id + ' failed');
          self.loadedScripts[id] = false;
          
          // Fallback method: document.write (last resort)
          try {
            console.log('[AdsManager] Trying document.write fallback...');
            var w = document.createElement('div');
            w.innerHTML = '<script src="' + src + '" data-cfasync="false"><\/script>';
            document.body.appendChild(w);
          } catch (err) {
            console.error('[AdsManager] Fallback failed:', err);
          }
        };
        
        // Append ke head ATAU body
        var parent = document.head || document.body || document.documentElement;
        parent.appendChild(s);
        
        console.log('[AdsManager] Injected ' + id + ' → ' + src.substring(0, 60) + '...');
        
        // Timeout: anggap sukses kalau tidak ada error
        setTimeout(function() {
          if (self.loadedScripts[id] === undefined) {
            self.loadedScripts[id] = true;
            console.log('[AdsManager] ✓ ' + id + ' assumed OK (timeout)');
          }
        }, 8000);
        
        return true;
      } catch (e) {
        console.error('[AdsManager] Inject failed:', e);
        return false;
      }
    },

    // ============================================
    // REWARDED AD
    // ============================================
    openRewarded: function() {
      var self = this;
      var smartlink = this.SCRIPTS.smartlink;
      
      console.log('[AdsManager] Opening smartlink...');
      
      return new Promise(function(resolve) {
        var popup = null;
        try {
          popup = window.open(smartlink, '_blank', 'width=800,height=600');
        } catch (e) {
          console.warn('[AdsManager] popup blocked');
        }
        
        if (!popup || popup.closed) {
          try {
            localStorage.setItem('yadstore_ad_pending', Date.now().toString());
            window.location.href = smartlink;
            resolve({ success: true, method: 'redirect' });
          } catch (e) {
            resolve({ success: false, reason: 'popup_blocked' });
          }
        } else {
          resolve({ success: true, method: 'popup' });
        }
      });
    },
  };

  // ============================================
  // AUTO-INIT — Multiple triggers
  // ============================================
  
  // Trigger 1: DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      console.log('[AdsManager] DOMContentLoaded');
      setTimeout(function() { window.AdsManager.init(); }, 100);
    });
  } else {
    setTimeout(function() { window.AdsManager.init(); }, 100);
  }
  
  // Trigger 2: window load
  window.addEventListener('load', function() {
    console.log('[AdsManager] Window load');
    if (!window.AdsManager.initialized) {
      window.AdsManager.init();
    }
  });
  
  // Trigger 3: Force setelah 2 detik
  setTimeout(function() {
    if (!window.AdsManager.initialized) {
      console.log('[AdsManager] Force init (2s)');
      window.AdsManager.init();
    }
  }, 2000);
  
  // Trigger 4: Force setelah 5 detik
  setTimeout(function() {
    if (window.AdsManager.initAttempts < 2) {
      console.log('[AdsManager] Re-init (5s)');
      window.AdsManager.loadScripts(true);
    }
  }, 5000);
  
  console.log('[AdsManager] Setup complete');
})();
