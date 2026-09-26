/* YADSTORE - ADS CONFIG (SAFE) */

window.ADS_CONFIG = {
  TAG_URL: 'https://quge5.com/88/tag.min.js',
  TAG_ZONE: '286791',
};

// Inject tag SETELAH semua script utama load (delay 3 detik)
// supaya tidak blocking render
(function() {
  if (typeof window === 'undefined') return;

  function injectTag() {
    try {
      var s = document.createElement('script');
      s.src = window.ADS_CONFIG.TAG_URL;
      s.setAttribute('data-zone', window.ADS_CONFIG.TAG_ZONE);
      s.setAttribute('data-cfasync', 'false');
      s.async = true;
      s.onerror = function() { console.warn('[Ads] gagal load, skip'); };
      document.head.appendChild(s);
      console.log('[Ads] tag injected');
    } catch (e) {
      console.warn('[Ads] error:', e.message);
    }
  }

  // Tunggu window fully loaded + 3 detik
  if (document.readyState === 'complete') {
    setTimeout(injectTag, 3000);
  } else {
    window.addEventListener('load', function() {
      setTimeout(injectTag, 3000);
    });
  }
})();
