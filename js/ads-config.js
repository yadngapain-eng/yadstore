/* YADSTORE - ADS CONFIG (safe) */
window.ADS_CONFIG = {
  TAG_URL: 'https://quge5.com/88/tag.min.js',
  TAG_ZONE: '286791',
};

(function() {
  if (typeof window === 'undefined') return;
  function injectTag() {
    try {
      var s = document.createElement('script');
      s.src = window.ADS_CONFIG.TAG_URL;
      s.setAttribute('data-zone', window.ADS_CONFIG.TAG_ZONE);
      s.setAttribute('data-cfasync', 'false');
      s.async = true;
      s.onerror = function() { console.warn('[Ads] fail'); };
      document.head.appendChild(s);
    } catch (e) { console.warn('[Ads] error:', e.message); }
  }
  // Tunggu 4 detik setelah load supaya tidak block render
  if (document.readyState === 'complete') {
    setTimeout(injectTag, 4000);
  } else {
    window.addEventListener('load', function() { setTimeout(injectTag, 4000); });
  }
})();
