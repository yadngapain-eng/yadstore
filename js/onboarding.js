
/* ============================================
   ONBOARDING TOUR
   ============================================ */
(function() {
  'use strict';
  var KEY = 'yadstore_onboarded_v1';
  if (localStorage.getItem(KEY)) return;

  var steps = [
    { icon: '👋', title: 'Selamat Datang!', desc: 'Belajar sambil dapat koin. Kumpulkan sampai bisa withdraw ke DANA/OVO/GoPay!', btn: 'Mulai →' },
    { icon: '📚', title: 'Belajar', desc: 'Pilih kategori (Coding, English, Math, Science). Setiap lesson selesai = +XP & +Gems.', btn: 'Lanjut →' },
    { icon: '🛒', title: 'Top Up', desc: 'Beli Diamond MLBB, FF, PUBG, dan pulsa/kuota. Proses cepat 1 detik!', btn: 'Lanjut →' },
    { icon: '💰', title: 'Reward', desc: 'Nonton iklan 5x/hari untuk koin. Login harian bonus. Streak 7 hari dapat jackpot!', btn: 'Lanjut →' },
    { icon: '🌙', title: 'Dark Mode', desc: 'Klik tombol 🌙 di kanan atas untuk ganti tema. Nyaman di mata!', btn: 'Lanjut →' },
    { icon: '🎁', title: 'Referral', desc: 'Ajak teman pakai kode referral. Dapat 500 koin per teman!', btn: 'Siap! 🚀' }
  ];
  var current = 0;

  function show() {
    var step = steps[current];
    var ov = document.getElementById('onboard-overlay');
    if (!ov) {
      ov = document.createElement('div');
      ov.id = 'onboard-overlay';
      ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.75);backdrop-filter:blur(8px);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px';
      document.body.appendChild(ov);
    }
    var dots = steps.map(function(_, i) {
      var a = i === current;
      return '<span style="width:' + (a ? '24px' : '8px') + ';height:8px;border-radius:4px;background:' + (a ? '#58cc02' : 'rgba(255,255,255,0.4)') + ';transition:all 0.3s;display:inline-block"></span>';
    }).join('');

    ov.innerHTML =
      '<div style="background:white;border-radius:24px;padding:32px 24px;max-width:400px;width:100%;text-align:center;box-shadow:0 24px 60px rgba(0,0,0,0.4);animation:popIn 0.5s cubic-bezier(0.68,-0.55,0.265,1.55)">' +
        '<div style="font-size:80px;margin-bottom:16px">' + step.icon + '</div>' +
        '<h2 style="font-size:24px;font-weight:900;color:#1a1a1a;margin-bottom:12px">' + step.title + '</h2>' +
        '<p style="font-size:15px;color:#666;line-height:1.6;margin-bottom:24px;font-weight:500">' + step.desc + '</p>' +
        '<div style="display:flex;gap:6px;justify-content:center;margin-bottom:20px">' + dots + '</div>' +
        '<button id="onboard-next" style="width:100%;padding:14px;background:linear-gradient(135deg,#58cc02,#89e219);color:white;border:none;border-radius:12px;font-family:inherit;font-size:15px;font-weight:900;cursor:pointer;box-shadow:0 4px 0 #46a302">' + step.btn + '</button>' +
        '<button id="onboard-skip" style="width:100%;padding:10px;background:transparent;color:#999;border:none;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;margin-top:8px">Lewati tour</button>' +
      '</div>';

    document.getElementById('onboard-next').onclick = function() {
      current++;
      if (typeof window.UI !== 'undefined') {
        window.UI.haptic(15);
        window.UI.sound('click');
      }
      if (current >= steps.length) close();
      else show();
    };
    document.getElementById('onboard-skip').onclick = close;
  }

  function close() {
    localStorage.setItem(KEY, 'true');
    var ov = document.getElementById('onboard-overlay');
    if (ov) {
      ov.style.opacity = '0';
      ov.style.transition = 'opacity 0.3s';
      setTimeout(function() { ov.remove(); }, 300);
    }
    if (typeof window.UI !== 'undefined') window.UI.confetti();
  }

  // Munculkan setelah 2 detik
  setTimeout(show, 2000);
})();
