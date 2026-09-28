
/* ============================================
   RETENTION HOOKS
   ============================================ */
(function() {
  'use strict';
  var LAST = 'yadstore_last_visit';
  var IDLE_LIMIT = 90 * 1000;
  var idleTimer = null;

  function checkWelcome() {
    try {
      var last = parseInt(localStorage.getItem(LAST) || '0');
      var now = Date.now();
      var hours = (now - last) / (1000 * 60 * 60);
      localStorage.setItem(LAST, now.toString());

      if (hours > 24 && hours < 24 * 30) {
        var days = Math.floor(hours / 24);
        var msg = days === 1 ? '👋 Welcome back! Kangen nih 😊' : '👋 Kangen! ' + days + ' hari tidak main';
        setTimeout(function() {
          if (typeof Animate !== 'undefined' && Animate.toast) Animate.toast(msg, 'success');
          if (typeof window.UI !== 'undefined') window.UI.sound('achievement');
        }, 3500);
      }
    } catch (e) {}
  }

  function resetIdle() {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(showNudge, IDLE_LIMIT);
  }

  function showNudge() {
    var tips = [
      '💡 Tips: Login harian dapat 15 koin GRATIS!',
      '🎬 Nonton iklan dapat 1-100 koin (max 5x/hari)',
      '🔥 Streak 7 hari dapat 150 koin bonus!',
      '🎁 Ajak teman pakai referral, dapat 500 koin',
      '📚 Selesaikan lesson dapat XP + Gems',
      '💰 Koin bisa diwithdraw ke DANA/OVO/GoPay!',
      '🌙 Klik tombol 🌙 di kanan atas untuk Dark Mode'
    ];
    var tip = tips[Math.floor(Math.random() * tips.length)];
    if (typeof Animate !== 'undefined' && Animate.toast) Animate.toast(tip, 'info');
    resetIdle();
  }

  ['click', 'touchstart', 'scroll', 'keydown', 'mousemove'].forEach(function(evt) {
    document.addEventListener(evt, resetIdle, { passive: true });
  });
  resetIdle();

  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(checkWelcome, 3000);
  });
})();
