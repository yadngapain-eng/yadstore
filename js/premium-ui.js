
/* ============================================
   LEARN EARN — Premium UI v3
   Dark Mode + Sound + Haptic + Semua efek
   ============================================ */
(function() {
  'use strict';

  window.UI = window.UI || {};

  /* ========== 1. DARK MODE ========== */
  var THEME_KEY = 'yadstore_theme';
  var currentTheme = localStorage.getItem(THEME_KEY) || 'light';

  UI.setTheme = function(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    currentTheme = theme;
    localStorage.setItem(THEME_KEY, theme);
    updateThemeBtn();
  };

  UI.toggleTheme = function() {
    UI.setTheme(currentTheme === 'light' ? 'dark' : 'light');
    UI.haptic(20);
    UI.sound('click');
  };

  function updateThemeBtn() {
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = currentTheme === 'light' ? '🌙' : '☀️';
  }

  function initThemeToggle() {
    if (document.getElementById('theme-toggle')) return;
    var btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.className = 'theme-toggle';
    btn.title = 'Toggle Theme';
    btn.textContent = currentTheme === 'light' ? '🌙' : '☀️';
    btn.onclick = UI.toggleTheme;
    document.body.appendChild(btn);
  }

  // Apply theme on load
  UI.setTheme(currentTheme);

  /* ========== 2. SOUND EFFECTS (Web Audio) ========== */
  var audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {}
    }
    return audioCtx;
  }

  UI.sound = function(type) {
    var soundEnabled = localStorage.getItem('yadstore_sound') !== 'off';
    if (!soundEnabled) return;

    var ctx = getAudioCtx();
    if (!ctx) return;

    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    var now = ctx.currentTime;
    var freq = 800, dur = 0.1;

    if (type === 'click') { freq = 800; dur = 0.05; }
    else if (type === 'success') { freq = 1000; dur = 0.15; gain.gain.setValueAtTime(0.15, now); }
    else if (type === 'error') { freq = 300; dur = 0.2; }
    else if (type === 'coin') { freq = 1500; dur = 0.08; }
    else if (type === 'achievement') { freq = 1200; dur = 0.3; gain.gain.setValueAtTime(0.2, now); }

    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + dur);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    osc.start(now);
    osc.stop(now + dur);
  };

  UI.toggleSound = function() {
    var enabled = localStorage.getItem('yadstore_sound') !== 'off';
    localStorage.setItem('yadstore_sound', enabled ? 'off' : 'on');
    if (!enabled) UI.sound('click');
    if (typeof Animate !== 'undefined') {
      Animate.toast(enabled ? '🔇 Suara OFF' : '🔊 Suara ON', 'success');
    }
  };

  /* ========== 3. HAPTIC FEEDBACK ========== */
  UI.haptic = function(ms) {
    ms = ms || 10;
    if (navigator.vibrate) {
      try { navigator.vibrate(ms); } catch (e) {}
    }
  };

  /* ========== 4. CONFETTI MERIAH ========== */
  UI.confetti = function() {
    var colors = ['#58cc02', '#1cb0f6', '#ce82ff', '#ffc800', '#ff4081', '#f59e0b', '#10b981'];
    var shapes = ['circle', 'square', 'triangle'];
    var container = document.createElement('div');
    container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:99999;overflow:hidden';
    document.body.appendChild(container);

    var COUNT = 120;

    for (var i = 0; i < COUNT; i++) {
      var el = document.createElement('div');
      var size = Math.random() * 12 + 6;
      var color = colors[Math.floor(Math.random() * colors.length)];
      var shape = shapes[Math.floor(Math.random() * shapes.length)];
      var left = Math.random() * 100;
      var delay = Math.random() * 0.5;
      var duration = Math.random() * 2 + 2;
      var rotation = Math.random() * 720 - 360;
      var drift = (Math.random() - 0.5) * 200;

      var borderRadius = shape === 'circle' ? '50%' : (shape === 'square' ? '3px' : '0');
      var clipPath = shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none';

      el.style.cssText =
        'position:absolute;' +
        'width:' + size + 'px;' +
        'height:' + size + 'px;' +
        'background:' + color + ';' +
        'left:' + left + '%;' +
        'top:-20px;' +
        'border-radius:' + borderRadius + ';' +
        'clip-path:' + clipPath + ';' +
        'transform:rotate(' + rotation + 'deg);' +
        'animation:confettiFall ' + duration + 's linear ' + delay + 's forwards;' +
        '--drift:' + drift + 'px;';

      container.appendChild(el);
    }

    setTimeout(function() { container.remove(); }, 5000);
  };

  // CSS untuk confetti (inject sekali)
  if (!document.getElementById('confetti-style')) {
    var style = document.createElement('style');
    style.id = 'confetti-style';
    style.textContent = '@keyframes confettiFall{0%{transform:translateY(0) translateX(0) rotate(0);opacity:1}100%{transform:translateY(110vh) translateX(var(--drift,0)) rotate(720deg);opacity:0}}';
    document.head.appendChild(style);
  }

  /* ========== 5. PROGRESS RING (Profile) ========== */
  UI.renderProgressRing = function(containerId, percent, label, sublabel) {
    var el = document.getElementById(containerId);
    if (!el) return;

    var radius = 70;
    var circumference = 2 * Math.PI * radius;
    var offset = circumference - (percent / 100) * circumference;

    el.innerHTML =
      '<div class="progress-ring-wrap">' +
        '<svg class="progress-ring" width="160" height="160" viewBox="0 0 160 160">' +
          '<defs>' +
            '<linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">' +
              '<stop offset="0%" stop-color="#58cc02" />' +
              '<stop offset="100%" stop-color="#1cb0f6" />' +
            '</linearGradient>' +
          '</defs>' +
          '<circle class="ring-bg" cx="80" cy="80" r="' + radius + '" />' +
          '<circle class="ring-fill" cx="80" cy="80" r="' + radius + '" ' +
            'style="stroke-dasharray:' + circumference + ';stroke-dashoffset:' + circumference + '" />' +
        '</svg>' +
        '<div class="progress-ring-label">' +
          '<div class="num">' + percent + '%</div>' +
          '<div class="txt">' + (label || 'Progress') + '</div>' +
        '</div>' +
      '</div>';

    // Animate
    setTimeout(function() {
      var ring = el.querySelector('.ring-fill');
      if (ring) ring.style.strokeDashoffset = offset;
    }, 100);
  };

  /* ========== 6. LEADERBOARD ========== */
  UI.renderLeaderboard = async function(containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = '<p style="text-align:center;padding:20px;color:#999">⏳ Memuat leaderboard...</p>';

    try {
      if (typeof Auth === 'undefined' || !Auth.db) throw new Error('No DB');

      // Ambil top 10 user berdasarkan XP
      var snap = await Auth.db.collection('users')
        .orderBy('xp', 'desc')
        .limit(10)
        .get();

      if (snap.empty) {
        el.innerHTML = '<p style="text-align:center;padding:20px;color:#999">Belum ada data leaderboard</p>';
        return;
      }

      var users = snap.docs.map(function(d) { return d.data(); });
      var html = '<div class="leaderboard-list">';

      users.forEach(function(u, i) {
        var rank = i + 1;
        var medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '#' + rank;
        var topClass = rank <= 3 ? ' top-' + rank : '';
        var name = u.displayName || 'Guest';
        var avatar = u.avatar || '👤';
        var xp = u.xp || 0;
        var level = u.level || 1;

        html += '<div class="lb-item' + topClass + '">' +
          '<div class="lb-rank">' + medal + '</div>' +
          '<div class="lb-avatar">' + avatar + '</div>' +
          '<div class="lb-info">' +
            '<div class="lb-name">' + name + '</div>' +
            '<div class="lb-xp">Lv ' + level + ' • ' + xp.toLocaleString('id-ID') + ' XP</div>' +
          '</div>' +
          '<div class="lb-value">' + xp.toLocaleString('id-ID') + '</div>' +
        '</div>';
      });

      html += '</div>';
      el.innerHTML = html;
    } catch (e) {
      console.error('[Leaderboard]', e);
      el.innerHTML = '<p style="text-align:center;padding:20px;color:#999">Belum ada data</p>';
    }
  };

  /* ========== 7. DAILY REWARDS CALENDAR ========== */
  UI.renderDailyCalendar = function(containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;

    // Ambil data streak dari DL
    var streak = 0;
    try {
      if (typeof DL !== 'undefined') {
        streak = DL.getState().streak || 0;
      }
    } catch (e) {}

    var today = new Date().getDate();
    var html = '<div class="daily-calendar">';

    for (var i = 1; i <= 30; i++) {
      var isClaimed = i <= streak;
      var isToday = i === streak + 1;
      var isMissed = i < streak && !isClaimed;

      var cls = 'cal-day';
      if (isClaimed) cls += ' claimed';
      else if (isToday) cls += ' today';
      else if (isMissed) cls += ' missed';

      var icon = isClaimed ? '✓' : (isToday ? '🎁' : '•');

      html += '<div class="' + cls + '" title="Hari ' + i + '">' +
        '<div class="num">' + i + '</div>' +
        '<div class="icon">' + icon + '</div>' +
      '</div>';
    }

    html += '</div>';

    var info = '<div style="text-align:center;font-size:13px;font-weight:700;color:#666;margin-top:12px">' +
      '🔥 Streak kamu: <strong style="color:#58cc02">' + streak + ' hari</strong>';

    if (streak < 7) info += ' • ' + (7 - streak) + ' hari lagi untuk bonus 150 koin!';
    else if (streak < 30) info += ' • ' + (30 - streak) + ' hari lagi untuk 1000 koin!';
    else info += ' • 🏆 LUAR BIASA!';

    info += '</div>';

    el.innerHTML = html + info;
  };

  /* ========== 8. PULL TO REFRESH ========== */
  function initPullToRefresh() {
    var startY = 0;
    var currentY = 0;
    var isPulling = false;
    var threshold = 80;
    var indicator = null;

    function createIndicator() {
      if (indicator) return indicator;
      indicator = document.createElement('div');
      indicator.className = 'pull-indicator';
      indicator.innerHTML = '<span class="icon">🔄</span> Tarik untuk refresh';
      document.body.appendChild(indicator);
      return indicator;
    }

    document.addEventListener('touchstart', function(e) {
      if (window.scrollY > 0) return;
      startY = e.touches[0].clientY;
      isPulling = true;
    }, { passive: true });

    document.addEventListener('touchmove', function(e) {
      if (!isPulling) return;
      currentY = e.touches[0].clientY;
      var diff = currentY - startY;

      if (diff > 30 && window.scrollY === 0) {
        var ind = createIndicator();
        ind.classList.add('show');
        if (diff >= threshold) {
          ind.innerHTML = '<span class="icon">🔄</span> Lepas untuk refresh';
        } else {
          ind.innerHTML = '<span class="icon">🔄</span> Tarik untuk refresh';
        }
      }
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
      if (!isPulling) return;
      var diff = currentY - startY;
      isPulling = false;

      if (diff >= threshold && indicator) {
        indicator.classList.add('loading');
        indicator.innerHTML = '<span class="icon">🔄</span> Memuat...';
        UI.haptic(30);

        setTimeout(function() {
          location.reload();
        }, 300);
      } else if (indicator) {
        indicator.classList.remove('show');
      }

      startY = 0;
      currentY = 0;
    }, { passive: true });
  }

  /* ========== 9. SEARCH BAR ========== */
  UI.initSearchBar = function(inputId, targetSelector, itemSelector) {
    var input = document.getElementById(inputId);
    if (!input) return;

    input.addEventListener('input', function() {
      var q = this.value.toLowerCase().trim();
      var items = document.querySelectorAll(itemSelector);

      items.forEach(function(item) {
        var text = item.textContent.toLowerCase();
        if (q === '' || text.includes(q)) {
          item.style.display = '';
          item.style.animation = 'cardFadeIn 0.3s ease';
        } else {
          item.style.display = 'none';
        }
      });
    });
  };

  /* ========== 10. LOADING SCREEN ========== */
  function initLoadingScreen() {
    // Kalau sudah ada #app-splash, skip
    if (document.getElementById('app-splash')) return;

    var loader = document.createElement('div');
    loader.id = 'premium-loader';
    loader.innerHTML =
      '<div class="logo">LE</div>' +
      '<div class="progress-bar"><div class="progress-fill" id="loader-progress"></div></div>' +
      '<div class="txt" id="loader-text">Memuat aplikasi...</div>';

    document.body.insertBefore(loader, document.body.firstChild);

    var progress = 0;
    var messages = [
      'Memuat aplikasi...',
      'Menyiapkan data...',
      'Mengambil lesson...',
      'Hampir selesai...',
      'Siap! 🚀'
    ];
    var interval = setInterval(function() {
      progress += Math.random() * 20;
      if (progress > 100) progress = 100;
      var fill = document.getElementById('loader-progress');
      if (fill) fill.style.width = progress + '%';

      var msgIdx = Math.min(Math.floor(progress / 25), messages.length - 1);
      var txt = document.getElementById('loader-text');
      if (txt) txt.textContent = messages[msgIdx];

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(function() {
          loader.classList.add('hide');
          setTimeout(function() { loader.remove(); }, 700);
        }, 300);
      }
    }, 200);
  }

  /* ========== 11. AUTO-INJECT & INIT ========== */
  function init() {
    // Theme toggle button
    initThemeToggle();

    // Pull to refresh (hanya di mobile)
    if ('ontouchstart' in window) {
      initPullToRefresh();
    }

    // Sound & haptic di semua button
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('button, .game-card, .lesson-card, .cat-tab, .nav-btn, .payment-card');
      if (btn) {
        UI.haptic(8);
        UI.sound('click');
      }
    }, { passive: true });

    // Loading screen (kalau tidak ada #app-splash)
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initLoadingScreen);
    } else {
      initLoadingScreen();
    }

    console.log('[UI] Premium v3 loaded');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose ke window
  window.UI = UI;
})();
