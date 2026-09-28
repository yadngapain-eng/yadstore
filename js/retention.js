
/* ============================================
   RETENTION HOOKS — Welcome back + Idle nudge
   ============================================ */
(function() {
  'use strict';
  
  var LAST_VISIT_KEY = 'yadstore_last_visit';
  var IDLE_LIMIT = 90 * 1000; // 90 detik
  var lastActivity = Date.now();
  
  // ===== 1. WELCOME BACK MESSAGE =====
  function checkWelcomeBack() {
    try {
      var last = parseInt(localStorage.getItem(LAST_VISIT_KEY) || '0');
      var now = Date.now();
      var diff = now - last;
      var hours = diff / (1000 * 60 * 60);
      
      localStorage.setItem(LAST_VISIT_KEY, now.toString());
      
      if (hours > 24 && hours < 24 * 30) {
        var days = Math.floor(hours / 24);
        var msg = days === 1 ? '👋 Selamat datang kembali! 1 hari tidak ketemu 😊' :
                  '👋 Kangen nih! ' + days + ' hari tidak main 😊';
        setTimeout(function() {
          if (typeof Animate !== 'undefined' && Animate.toast) {
            Animate.toast(msg, 'success');
          }
        }, 2500);
      }
    } catch (e) {}
  }
  
  // ===== 2. IDLE NUDGE — Reminder setelah 90 detik idle =====
  var idleTimer = null;
  function resetIdle() {
    lastActivity = Date.now();
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(showIdleNudge, IDLE_LIMIT);
  }
  
  function showIdleNudge() {
    // Random tips
    var tips = [
      '💡 Tips: Login harian dapat 15 koin GRATIS!',
      '🎬 Nonton iklan dapat 1-100 koin (max 5x/hari)',
      '🔥 Streak 7 hari dapat 150 koin bonus!',
      '🎁 Ajak teman pakai referral, dapat 500 koin',
      '📚 Selesaikan lesson dapat XP + Gems',
      '💰 Koin bisa diwithdraw ke DANA/OVO/GoPay!'
    ];
    var tip = tips[Math.floor(Math.random() * tips.length)];
    
    if (typeof Animate !== 'undefined' && Animate.toast) {
      Animate.toast(tip, 'info');
    }
    
    resetIdle();
  }
  
  ['click', 'touchstart', 'scroll', 'keydown', 'mousemove'].forEach(function(evt) {
    document.addEventListener(evt, resetIdle, { passive: true });
  });
  resetIdle();
  
  // ===== 3. INIT =====
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(checkWelcomeBack, 3000);
  });
})();
