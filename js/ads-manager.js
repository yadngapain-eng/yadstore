/* ============================================
   ADS MANAGER v12 — More Robust
   Adsterra + Monetag + Retry Logic
   ============================================ */

window.AdsManager = {
  VERSION: 'v12',
  MODE: 'monetag-priority',

  NETWORKS: {
    monetag: {
      enabled: true,
      priority: 1,
      swDomain: '5gvci.com',
      zones: {
        push: 11893259,
        vignette: 11893258,
        inpage: 11893257,
        popunder: 11893256,
      },
    },
    adsterra: {
      enabled: true,
      priority: 2,
      scripts: {
        popunder: 'https://pl31468159.profitableratecpmnetwork.com/43/b7/10/43b7103677aebe9ac1a73fef2f093d8e.js',
        socialbar: 'https://pl31468161.profitableratecpmnetwork.com/5a/74/05/5a7405d3227ef77d3f28c27fb6024aa6.js',
      },
      smartlink: 'https://www.profitableratecpmnetwork.com/hs7rgc2qv?key=ee5218af9bd180dc813a71fe59ddb5dd',
    },
  },

  loadedScripts: {},
  injected: {},
  initialized: false,
  lastSmartlinkOpen: 0,
  SMARTLINK_COOLDOWN: 30 * 1000,

  init() {
    if (this.initialized) return;
    this.initialized = true;
    console.log('[AdsManager] ' + this.VERSION + ' init');

    // Load Monetag DULU
    this.loadMonetagAds();

    // Load Adsterra setelah delay
    var self = this;
    setTimeout(function() { self.loadAdsterraAds(); }, 2000);

    // Re-inject kalau gagal
    setTimeout(function() { self.reinjectAll(); }, 10000);
    setTimeout(function() { self.reinjectAll(); }, 30000);

    console.log('[AdsManager] Ready');
  },

  loadMonetagAds(force) {
    var m = this.NETWORKS.monetag;
    if (!m.enabled) return;

    console.log('[AdsManager] Monetag loading...');
    var d = m.swDomain, z = m.zones, cb = Date.now(), self = this;

    // Vignette
    setTimeout(function() {
      self.injectScript('https://' + d + '/act/files/tag.min.js?z=' + z.vignette + '&cb=' + cb, 'monetag-vignette');
    }, 300);

    // In-Page
    setTimeout(function() {
      self.injectScript('https://' + d + '/act/files/tag.min.js?z=' + z.inpage + '&cb=' + cb, 'monetag-inpage');
    }, 1000);

    // Popunder
    setTimeout(function() {
      self.injectScript('https://' + d + '/act/files/tag.min.js?z=' + z.popunder + '&cb=' + cb, 'monetag-popunder');
    }, 1800);
  },

  loadAdsterraAds(force) {
    var a = this.NETWORKS.adsterra;
    if (!a.enabled) return;

    console.log('[AdsManager] Adsterra loading...');
    var cb = Date.now(), self = this;

    setTimeout(function() {
      self.injectScript(a.scripts.popunder + '?cb=' + cb, 'adsterra-popunder');
    }, 500);

    setTimeout(function() {
      self.injectScript(a.scripts.socialbar + '?cb=' + cb, 'adsterra-socialbar');
    }, 1800);
  },

  reinjectAll() {
    console.log('[AdsManager] Re-inject all');
    this.loadMonetagAds(true);
    this.loadAdsterraAds(true);
  },

  async openRewarded() {
    var now = Date.now();
    if (now - this.lastSmartlinkOpen < this.SMARTLINK_COOLDOWN) {
      var remain = Math.ceil((this.SMARTLINK_COOLDOWN - (now - this.lastSmartlinkOpen)) / 1000);
      return { success: false, reason: 'cooldown', remain: remain };
    }

    var smartlink = this.NETWORKS.adsterra.smartlink;
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
};

// AUTO INIT
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      window.AdsManager.init();
    });
  } else {
    setTimeout(function() { window.AdsManager.init(); }, 100);
  }
}

console.log('[ads-manager] ' + window.AdsManager.VERSION + ' loaded');
