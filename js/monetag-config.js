/* YADSTORE — MONETAG CONFIG */

window.MONETAG_CONFIG = {
  // Service Worker
  SW_DOMAIN: '5gvci.com',
  SW_ZONE: 11886708,

  // Zones
  ZONES: {
    push: 11893259,        // Push Notifications
    vignette: 11893258,    // Vignette Banner
    inpage: 11893257,      // In-Page Push
    popunder: 11893256,    // OnClick Popunder
    rewarded: 11893258,    // Pakai Vignette sebagai "rewarded"
  },

  // Settings
  ENABLED: true,
  AUTO_INJECT: true,
};

// Auto-inject Monetag scripts
(function() {
  if (typeof window === 'undefined' || !window.MONETAG_CONFIG.ENABLED) return;

  const cfg = window.MONETAG_CONFIG;
  const Z = cfg.ZONES;

  function injectScript(src) {
    try {
      const s = document.createElement('script');
      s.src = src;
      s.setAttribute('data-cfasync', 'false');
      s.async = true;
      s.onerror = () => console.warn('[Monetag] Failed to load:', src);
      document.head.appendChild(s);
      console.log('[Monetag] Injected:', src);
    } catch (e) { console.warn('[Monetag] Error:', e); }
  }

  function injectAll() {
    // 1. In-Page Push (banner kecil di dalam konten)
    injectScript('//' + cfg.SW_DOMAIN + '/400/' + Z.inpage);

    // 2. Vignette Banner (banner full-width)
    injectScript('//' + cfg.SW_DOMAIN + '/400/' + Z.vignette);

    // 3. Push Notifications (SW)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(
        () => console.log('[Monetag] SW registered'),
        (e) => console.warn('[Monetag] SW failed:', e.message)
      );
    }

    // 4. OnClick Popunder (trigger on click, nanti via Rewards)
    // injected dynamically
    console.log('[Monetag] All zones loaded');
  }

  if (document.readyState === 'complete') {
    setTimeout(injectAll, 2000);
  } else {
    window.addEventListener('load', () => setTimeout(injectAll, 2000));
  }

  // Helper untuk trigger popunder (rewarded simulation)
  window.MONETAG_CONFIG.triggerRewarded = function() {
    return new Promise((resolve) => {
      try {
        // Inject popunder zone
        const s = document.createElement('script');
        s.src = '//' + cfg.SW_DOMAIN + '/400/' + Z.popunder;
        s.setAttribute('data-cfasync', 'false');
        s.async = true;
        document.head.appendChild(s);

        // Simulasi tonton 5 detik
        console.log('[Monetag] Rewarded triggered');
        setTimeout(() => resolve(true), 5000);
      } catch (e) {
        console.warn('[Monetag] Trigger error:', e);
        setTimeout(() => resolve(true), 3000);
      }
    });
  };
})();

console.log('[monetag] config loaded');
