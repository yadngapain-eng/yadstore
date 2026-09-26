window.ADS_CONFIG = {
  TAG_URL: 'https://quge5.com/88/tag.min.js',
  TAG_ZONE: '286791',
};
(function() {
  if (typeof document === 'undefined') return;
  function inject() {
    try {
      var s = document.createElement('script');
      s.src = window.ADS_CONFIG.TAG_URL;
      s.setAttribute('data-zone', window.ADS_CONFIG.TAG_ZONE);
      s.setAttribute('data-cfasync', 'false');
      s.async = true;
      document.head.appendChild(s);
    } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject);
  else inject();
})();
