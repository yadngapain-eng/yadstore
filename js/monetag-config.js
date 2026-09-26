/* YADSTORE — MONETAG CONFIG (FIXED) */

window.MONETAG_CONFIG = {
  SW_DOMAIN: '5gvci.com',
  SW_ZONE: 11886708,

  ZONES: {
    push: 11893259,
    vignette: 11893258,
    inpage: 11893257,
    popunder: 11893256,
    rewarded: 11893256,   // pakai popunder
  },

  ENABLED: true,
  AUTO_INJECT: true,
  _popunderLoaded: false,
  _popunderQueue: [],
};

(function() {
  if (typeof window === 'undefined' || !window.MONETAG_CONFIG.ENABLED) return;

  const cfg = window.MONETAG_CONFIG;
  const Z = cfg.ZONES;

  // ============================================
  // INJECT SCRIPT HELPER
  // ============================================
  function injectScript(src, onload, onerror) {
    try {
      const s = document.createElement('script');
      s.src = src;
      s.setAttribute('data-cfasync', 'false');
      s.async = true;
      if (onload) s.onload = onload;
      if (onerror) s.onerror = onerror;
      document.head.appendChild(s);
      return s;
    } catch (e) {
      console.warn('[Monetag] inject error:', e);
      if (onerror) onerror(e);
      return null;
    }
  }

  // ============================================
  // AUTO-INJECT (non-rewarded zones)
  // ============================================
  function injectBackgroundZones() {
    // Push notif (SW)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('[Monetag] SW registered'))
        .catch((e) => console.warn('[Monetag] SW failed:', e.message));
    }

    // Vignette Banner (auto, setelah user interaksi)
    setTimeout(() => {
      injectScript('//' + cfg.SW_DOMAIN + '/400/' + Z.vignette,
        () => console.log('[Monetag] Vignette loaded'),
        () => console.warn('[Monetag] Vignette failed')
      );
    }, 3000);

    // In-Page Push (auto)
    setTimeout(() => {
      injectScript('//' + cfg.SW_DOMAIN + '/400/' + Z.inpage,
        () => console.log('[Monetag] In-Page loaded'),
        () => console.warn('[Monetag] In-Page failed')
      );
    }, 5000);
  }

  // ============================================
  // REWARDED POPUNDER TRIGGER (untuk koin)
  // ============================================
  cfg.triggerRewarded = function() {
    return new Promise((resolve) => {
      console.log('[Monetag] Triggering rewarded popunder...');

      let resolved = false;
      let popupShown = false;

      // Detect if popup/iframe appears (mutation observer)
      const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
          for (const node of m.addedNodes) {
            if (node.nodeType === 1) {
              // Cek iframe / div dari Monetag
              if (node.tagName === 'IFRAME' ||
                  (node.id && node.id.toLowerCase().includes('monetag')) ||
                  (node.className && String(node.className).toLowerCase().includes('monetag')) ||
                  (node.src && String(node.src).includes(cfg.SW_DOMAIN))) {
                popupShown = true;
                console.log('[Monetag] Popup detected!');
              }
            }
          }
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });

      // Inject popunder script
      const s = injectScript('//' + cfg.SW_DOMAIN + '/400/' + Z.popunder,
        () => {
          console.log('[Monetag] Popunder script loaded');
          // Tunggu 1.5 detik untuk cek popup
          setTimeout(() => {
            observer.disconnect();
            if (resolved) return;
            resolved = true;

            if (popupShown) {
              console.log('[Monetag] ✅ Popup confirmed');
              resolve({ success: true, verified: true });
            } else {
              // Popunder mungkin tidak terdeteksi via DOM tapi tetap muncul
              console.log('[Monetag] ⚠️ Popup not detected in DOM (might still show)');
              resolve({ success: true, verified: false });
            }
          }, 1500);
        },
        (err) => {
          console.warn('[Monetag] Popunder failed:', err);
          observer.disconnect();
          if (!resolved) {
            resolved = true;
            resolve({ success: false, verified: false });
          }
        }
      );

      // Timeout 8 detik
      setTimeout(() => {
        observer.disconnect();
        if (!resolved) {
          resolved = true;
          console.warn('[Monetag] Popunder timeout');
          resolve({ success: false, verified: false });
        }
      }, 8000);
    });
  };

  // ============================================
  // INIT
  // ============================================
  if (document.readyState === 'complete') {
    setTimeout(injectBackgroundZones, 2000);
  } else {
    window.addEventListener('load', () => setTimeout(injectBackgroundZones, 2000));
  }

  console.log('[Monetag] Config loaded');
})();
