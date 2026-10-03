/* ============================================
   ADS CONFIG — Adsterra (duniamu.my.id)
   Zone IDs: 31533043, 31533051, 31533052
   ============================================ */

window.ADS_CONFIG = {
  NETWORK: 'adsterra',
  DOMAIN: 'duniamu.my.id',
  ENABLED: true,

  ADSTERRA: {
    zones: {
      popunder: 31533043,
      socialbar: 31533051,
      smartlink: 31533052,
    },
    scripts: {
      popunder: 'https://pl31633542.profitableratecpmnetwork.com/2b/27/b1/2b27b195615029bd80cdff8d1c17e40c.js',
      socialbar: 'https://pl31633550.profitableratecpmnetwork.com/7b/1c/31/7b1c31412b8f5e830a1e189f92f840b7.js',
      smartlink: 'https://www.profitableratecpmnetwork.com/rnve2ckg?key=f15341dc4ed341cc62411d69d314d518',
    },
  },
};

(function() {
  if (typeof window === 'undefined') return;

  function registerSW() {
    if ('serviceWorker' in navigator) {
      var swUrl = '/sw.js?v=' + Date.now();
      navigator.serviceWorker.register(swUrl)
        .then(function() { console.log('[SW] registered'); })
        .catch(function(e) { console.warn('[SW] fail:', e.message); });
    }
  }

  if (document.readyState === 'complete') {
    setTimeout(registerSW, 2000);
  } else {
    window.addEventListener('load', function() {
      setTimeout(registerSW, 2000);
    });
  }
})();

console.log('[ads-config] Adsterra for duniamu.my.id');
