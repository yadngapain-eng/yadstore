/* LEARN EARN - ADS ACTIVE */
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
      console.log('[Ads] tag injected');
    } catch (e) { console.warn('[Ads] error:', e.message); }
  }

  function registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(function() { console.log('[SW] registered'); })
        .catch(function(e) { console.warn('[SW] fail:', e.message); });
    }
  }

  if (document.readyState === 'complete') {
    setTimeout(injectTag, 3000);
    setTimeout(registerSW, 4000);
  } else {
    window.addEventListener('load', function() {
      setTimeout(injectTag, 3000);
      setTimeout(registerSW, 4000);
    });
  }
})();
