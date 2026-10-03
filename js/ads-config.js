/* ============================================
   ADS CONFIG — Adsterra Only
   Monetag sudah dihapus
   ============================================ */

window.ADS_CONFIG = {
  NETWORK: 'adsterra',
  ENABLED: true,

  // Adsterra URLs (untuk referensi)
  ADSTERRA: {
    popunder: 'https://pl31468159.profitableratecpmnetwork.com/43/b7/10/43b7103677aebe9ac1a73fef2f093d8e.js',
    socialbar: 'https://pl31468161.profitableratecpmnetwork.com/5a/74/05/5a7405d3227ef77d3f28c27fb6024aa6.js',
    smartlink: 'https://www.profitableratecpmnetwork.com/hs7rgc2qv?key=ee5218af9bd180dc813a71fe59ddb5dd',
  },
};

(function() {
  if (typeof window === 'undefined') return;

  function registerSW() {
    if ('serviceWorker' in navigator) {
      // Hanya register SW kita sendiri, tanpa Monetag
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

console.log('[ads-config] Adsterra only mode');
