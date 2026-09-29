
/* ============================================
   LANDING PAGE + PROMO POPUP
   ============================================ */
(function() {
  'use strict';

  window.Landing = window.Landing || {};

  Landing.render = function() {
    var container = document.getElementById('articles-content');
    if (!container) return;

    var html = '';

    /* ===== HERO ===== */
    html += '<div class="landing-hero">' +
      '<div class="landing-hero-content">' +
        '<div class="landing-hero-badge">🔥 GRATIS • TANPA MODAL</div>' +
        '<div class="landing-hero-title">HP Kamu Bisa<br>Hasilkan Uang!</div>' +
        '<div class="landing-hero-subtitle">Baca artikel, main kuis, top up game —<br>dapat koin, withdraw ke DANA/OVO/GoPay!</div>' +
        '<button class="landing-hero-cta" onclick="Landing.startNow()">' +
          '💰 Mulai Cuan Sekarang' +
        '</button>' +
        '<div class="landing-hero-trust">' +
          '<span>⭐ 4.9/5</span>' +
          '<span>👥 10.000+ User</span>' +
          '<span>💸 Withdraw Nyata</span>' +
        '</div>' +
      '</div>' +
    '</div>';

    /* ===== CARA KERJA ===== */
    html += '<div style="text-align:center;margin:24px 0 16px">' +
      '<div class="landing-section-title">🎯 Cara Dapat Cuan</div>' +
      '<div class="landing-section-sub">3 langkah simpel, langsung bisa coba!</div>' +
    '</div>';

    html += '<div class="step-list">' +
      '<div class="step-card">' +
        '<div class="step-num">1</div>' +
        '<div class="step-content">' +
          '<div class="step-title">📱 Daftar Gratis</div>' +
          '<div class="step-desc">Cukup 30 detik, tanpa kartu kredit, tanpa syarat aneh.</div>' +
          '<div class="step-earn">🎁 +250 koin bonus</div>' +
        '</div>' +
      '</div>' +
      '<div class="step-card">' +
        '<div class="step-num">2</div>' +
        '<div class="step-content">' +
          '<div class="step-title">💰 Kumpulkan Koin</div>' +
          '<div class="step-desc">Baca artikel, main kuis, top up game, spin harian, ajak teman.</div>' +
          '<div class="step-earn">📈 Rp 17.900+/bulan</div>' +
        '</div>' +
      '</div>' +
      '<div class="step-card">' +
        '<div class="step-num">3</div>' +
        '<div class="step-content">' +
          '<div class="step-title">💸 Withdraw</div>' +
          '<div class="step-desc">Minimal Rp 1.000, cair ke DANA/OVO/GoPay/ShopeePay.</div>' +
          '<div class="step-earn">⚡ Proses 1-3 hari</div>' +
        '</div>' +
      '</div>' +
    '</div>';

    /* ===== POTENSI ===== */
    html += '<div class="potential-card">' +
      '<div class="potential-content">' +
        '<div class="potential-title">💰 Potensi Penghasilan</div>' +
        '<div class="potential-subtitle">Perhitungan realistis per bulan</div>' +
        '<div class="potential-rows">' +
          '<div class="potential-row"><div class="potential-row-label">📖 Baca 3 artikel/hari</div><div class="potential-row-value">Rp 4.500</div></div>' +
          '<div class="potential-row"><div class="potential-row-label">🎓 5 lesson/hari</div><div class="potential-row-value">Rp 3.000</div></div>' +
          '<div class="potential-row"><div class="potential-row-label">🎰 Spin harian</div><div class="potential-row-value">Rp 7.500</div></div>' +
          '<div class="potential-row"><div class="potential-row-label">🎁 Referral 5 teman</div><div class="potential-row-value">Rp 2.500</div></div>' +
          '<div class="potential-row"><div class="potential-row-label">🛒 Top up 1x/minggu</div><div class="potential-row-value">Rp 400</div></div>' +
        '</div>' +
        '<div class="potential-total">' +
          '<div class="potential-total-label">💰 TOTAL POTENSI</div>' +
          '<div class="potential-total-value">Rp 17.900+</div>' +
        '</div>' +
        '<div class="potential-note">⏱️ Cuma 15-20 menit/hari • 📱 100% dari HP • 💵 100% gratis</div>' +
      '</div>' +
    '</div>';

    /* ===== FEATURES ===== */
    html += '<div style="text-align:center;margin:24px 0 16px">' +
      '<div class="landing-section-title">✨ Fitur Unggulan</div>' +
      '<div class="landing-section-sub">Semua yang kamu butuhkan untuk cuan</div>' +
    '</div>';

    html += '<div class="features-grid">' +
      '<div class="feature-card"><span class="feature-icon">📖</span><div class="feature-title">Baca Artikel</div><div class="feature-desc">+50 koin/artikel</div></div>' +
      '<div class="feature-card"><span class="feature-icon">🎓</span><div class="feature-title">Belajar Kuis</div><div class="feature-desc">+XP + Gems</div></div>' +
      '<div class="feature-card"><span class="feature-icon">🛒</span><div class="feature-title">Top Up Game</div><div class="feature-desc">+100 koin/order</div></div>' +
      '<div class="feature-card"><span class="feature-icon">🎰</span><div class="feature-title">Spin Harian</div><div class="feature-desc">s.d. 5.000 koin</div></div>' +
      '<div class="feature-card"><span class="feature-icon">🎁</span><div class="feature-title">Ajak Teman</div><div class="feature-desc">+500 koin/orang</div></div>' +
      '<div class="feature-card"><span class="feature-icon">💸</span><div class="feature-title">Withdraw</div><div class="feature-desc">DANA/OVO/GoPay</div></div>' +
    '</div>';

    /* ===== TESTIMONI ===== */
    html += '<div style="text-align:center;margin:24px 0 16px">' +
      '<div class="landing-section-title">💬 Kata Mereka</div>' +
      '<div class="landing-section-sub">Yang udah coba & berhasil</div>' +
    '</div>';

    html += '<div class="testi-list">' +
      '<div class="testi-card">' +
        '<div class="testi-stars">⭐⭐⭐⭐⭐</div>' +
        '<div class="testi-text">"Awalnya iseng, cuma nyoba. Ternyata cair ke DANA! Udah 3x withdraw, total Rp 250.000 dalam 2 minggu."</div>' +
        '<div class="testi-author"><div class="testi-avatar">A</div><div><div class="testi-name">Andi</div><div class="testi-role">Mahasiswa, Bandung</div></div></div>' +
      '</div>' +
      '<div class="testi-card">' +
        '<div class="testi-stars">⭐⭐⭐⭐⭐</div>' +
        '<div class="testi-text">"Buat ibu rumah tangga kaya aku, ini sangat membantu. Sambil jaga anak bisa baca artikel. Bulan ini udah Rp 150.000."</div>' +
        '<div class="testi-author"><div class="testi-avatar">S</div><div><div class="testi-name">Sari</div><div class="testi-role">Ibu Rumah Tangga, Surabaya</div></div></div>' +
      '</div>' +
      '<div class="testi-card">' +
        '<div class="testi-stars">⭐⭐⭐⭐⭐</div>' +
        '<div class="testi-text">"Top up game jadi lebih murah + dapat bonus koin! Kombinasi pas buat gamer."</div>' +
        '<div class="testi-author"><div class="testi-avatar">B</div><div><div class="testi-name">Budi</div><div class="testi-role">Gamer, Jakarta</div></div></div>' +
      '</div>' +
    '</div>';

    /* ===== CTA FINAL ===== */
    html += '<div class="landing-cta-card">' +
      '<div class="landing-cta-content">' +
        '<span class="landing-cta-emoji">🎁</span>' +
        '<div class="landing-cta-title">Siap Mulai Cuan?</div>' +
        '<div class="landing-cta-sub">Klaim +250 koin gratis sekarang!<br>Tanpa modal, tanpa syarat.</div>' +
        '<button class="landing-cta-btn" onclick="Landing.startNow()">💰 Ambil Koin Gratis</button>' +
      '</div>' +
    '</div>';

    container.innerHTML = html;
  };

  Landing.startNow = function() {
    if (typeof App !== 'undefined' && App.switchTab) {
      App.switchTab('learn');
    }
    if (typeof Animate !== 'undefined') {
      Animate.toast('🎉 Yuk mulai belajar untuk dapat koin!', 'success');
    }
    if (typeof UI !== 'undefined' && UI.haptic) UI.haptic(15);
  };

  Landing.showWelcomePopup = function() {
    var POPUP_KEY = 'yadstore_welcome_popup_v1';
    if (localStorage.getItem(POPUP_KEY)) return;

    var popup = document.createElement('div');
    popup.className = 'promo-popup';
    popup.id = 'welcome-popup';
    popup.innerHTML =
      '<div class="promo-popup-content">' +
        '<div class="promo-popup-inner">' +
          '<div class="promo-popup-badge">🎁 BONUS SPESIAL</div>' +
          '<span class="promo-popup-emoji">💰</span>' +
          '<div class="promo-popup-title">Selamat Datang!<br>Kamu Dapat Bonus!</div>' +
          '<div class="promo-popup-sub">Klaim koin gratis sekarang dan mulai hasilkan uang dari HP kamu!</div>' +
          '<div class="promo-popup-bonus">' +
            '<div class="promo-popup-bonus-amount">+250</div>' +
            '<div class="promo-popup-bonus-label">KOIN<br>GRATIS</div>' +
          '</div>' +
          '<button class="promo-popup-btn" onclick="Landing.claimBonus()">💰 Klaim +250 Koin Sekarang</button>' +
          '<button class="promo-popup-skip" onclick="Landing.skipBonus()">Gak, saya gak butuh uang</button>' +
          '<div class="promo-popup-timer" id="popup-timer">⏰ Bonus hilang dalam 05:00</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(popup);

    var secondsLeft = 300;
    var timerEl = document.getElementById('popup-timer');
    var timer = setInterval(function() {
      secondsLeft--;
      var mins = Math.floor(secondsLeft / 60);
      var secs = secondsLeft % 60;
      if (timerEl) {
        timerEl.textContent = '⏰ Bonus hilang dalam ' +
          String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
      }
      if (secondsLeft <= 0) { clearInterval(timer); Landing.skipBonus(); }
    }, 1000);

    Landing._timer = timer;
    localStorage.setItem(POPUP_KEY, Date.now().toString());
  };

  Landing.claimBonus = function() {
    if (Landing._timer) clearInterval(Landing._timer);
    try {
      if (typeof Rewards !== 'undefined' && Rewards.addCoin) {
        Rewards.addCoin(250, '🎁 Bonus selamat datang');
      } else {
        var balance = parseFloat(localStorage.getItem('yadstore_reward_balance') || '0');
        localStorage.setItem('yadstore_reward_balance', String(balance + 250));
      }
    } catch (e) {}
    Landing.closePopup();
    if (typeof Animate !== 'undefined') {
      Animate.confetti();
      setTimeout(function() { Animate.toast('🎉 +250 koin berhasil diklaim!', 'success'); }, 300);
    }
    if (typeof UI !== 'undefined') {
      if (UI.sound) UI.sound('achievement');
      if (UI.haptic) UI.haptic([50, 30, 50]);
    }
  };

  Landing.skipBonus = function() {
    if (Landing._timer) clearInterval(Landing._timer);
    Landing.closePopup();
    setTimeout(function() {
      if (typeof Animate !== 'undefined') {
        Animate.toast('💡 Kamu masih bisa klaim +250 koin nanti di halaman Reward!', 'info');
      }
    }, 3000);
  };

  Landing.closePopup = function() {
    var popup = document.getElementById('welcome-popup');
    if (popup) {
      popup.style.animation = 'fadeIn 0.3s reverse';
      setTimeout(function() { popup.remove(); }, 300);
    }
  };

  Landing.showFloatingCTA = function() {
    if (document.getElementById('floating-cta')) return;
    var cta = document.createElement('button');
    cta.id = 'floating-cta';
    cta.className = 'floating-cta';
    cta.innerHTML = '💰 Mulai Cuan';
    cta.onclick = Landing.startNow;
    setTimeout(function() {
      document.body.appendChild(cta);
      setTimeout(function() {
        if (cta.parentNode) {
          cta.style.animation = 'fadeIn 0.3s reverse';
          setTimeout(function() { cta.remove(); }, 300);
        }
      }, 30000);
    }, 15000);
  };

  function init() {
    function patchArticles() {
      if (typeof Articles === 'undefined' || !Articles.render) {
        setTimeout(patchArticles, 300);
        return;
      }
      if (Articles._landingPatched) return;
      Articles._landingPatched = true;
      Articles.render = function() { Landing.render(); };
      console.log('[Landing] Articles.render patched');
    }
    setTimeout(patchArticles, 1000);
    setTimeout(function() { Landing.showWelcomePopup(); }, 3000);
    setTimeout(function() { Landing.showFloatingCTA(); }, 5000);
    console.log('[Landing] Init loaded');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(init, 1000); });
  } else {
    setTimeout(init, 1000);
  }

  window.Landing = Landing;
})();
