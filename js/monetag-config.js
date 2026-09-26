/* LEARN EARN — MONETAG v3 (multi-strategy) */

window.MONETAG_CONFIG = {
  SW_DOMAIN: '5gvci.com',
  SW_ZONE: 11886708,

  ZONES: {
    push: 11893259,
    vignette: 11893258,
    inpage: 11893257,
    popunder: 11893256,
  },

  ENABLED: true,
};

(function() {
  if (typeof window === 'undefined') return;
  const cfg = window.MONETAG_CONFIG;
  const Z = cfg.ZONES;

  function inject(src) {
    return new Promise((resolve) => {
      try {
        const s = document.createElement('script');
        s.src = src;
        s.setAttribute('data-cfasync', 'false');
        s.async = true;
        s.onload = () => resolve({ ok: true, src });
        s.onerror = () => resolve({ ok: false, src });
        document.head.appendChild(s);
        setTimeout(() => resolve({ ok: true, src, timeout: true }), 3000);
      } catch (e) {
        resolve({ ok: false, src, error: e.message });
      }
    });
  }

  // ============================================
  // WATCH AD — Multi-strategy
  // ============================================
  cfg.triggerRewarded = async function() {
    console.log('[Monetag] Trigger watch ad...');

    // Strategy 1: Vignette (support mobile) — auto open overlay
    const vignetteUrl = '//' + cfg.SW_DOMAIN + '/400/' + Z.vignette;
    console.log('[Monetag] Strategy 1: Vignette');
    const r1 = await inject(vignetteUrl);
    console.log('[Monetag] Vignette result:', r1);

    // Tunggu 3 detik user lihat iklan
    await new Promise(r => setTimeout(r, 3000));

    // Strategy 2: In-Page push sebagai backup
    const inpageUrl = '//' + cfg.SW_DOMAIN + '/400/' + Z.inpage;
    console.log('[Monetag] Strategy 2: In-Page');
    await inject(inpageUrl);

    // Strategy 3: Popunder (jika user pakai desktop)
    const popunderUrl = '//' + cfg.SW_DOMAIN + '/400/' + Z.popunder;
    console.log('[Monetag] Strategy 3: Popunder');
    await inject(popunderUrl);

    // Tunggu 4 detik lagi
    await new Promise(r => setTimeout(r, 4000));

    // Anggap sukses kalau salah satu script load OK
    const success = r1.ok || r1.timeout;

    console.log('[Monetag] Final result:', success ? 'SUCCESS' : 'FAILED');
    return { success: success, method: 'multi' };
  };

  // ============================================
  // AUTO-INJECT background
  // ============================================
  function autoInject() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('[Monetag] SW OK'))
        .catch(e => console.warn('[Monetag] SW fail:', e.message));
    }
    console.log('[Monetag] Auto-inject complete');
  }

  if (document.readyState === 'complete') {
    setTimeout(autoInject, 1500);
  } else {
    window.addEventListener('load', () => setTimeout(autoInject, 1500));
  }

  console.log('[Monetag] v3 loaded');
})();
