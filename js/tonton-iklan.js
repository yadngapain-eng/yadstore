/* ============================================
   TONTON IKLAN DAPAT KOIN
   Pakai Adsterra Smartlink
   100 koin = Rp 1, koin hanya untuk top up
   ============================================ */

(function() {
  'use strict';

  console.log('[TontonIklan] Loading...');

  window.TontonIklan = {
    VERSION: 'v1',

    CONFIG: {
      // Adsterra Smartlink untuk duniamu.my.id
      SMARTLINK: 'https://www.profitableratecpmnetwork.com/rnve2ckg?key=f15341dc4ed341cc62411d69d314d518',
      KOIN_MIN: 25,
      KOIN_MAX: 100,
      COOLDOWN_SEC: 60,
      MAX_PER_DAY: 20,
      KOIN_PER_RUPIAH: 100,
    },

    // Storage keys
    KEY_PENDING: 'yadstore_tonton_pending',
    KEY_LAST: 'yadstore_tonton_last',
    KEY_TODAY: 'yadstore_tonton_today',
    KEY_DATE: 'yadstore_tonton_date',

    // ============================================
    // HELPER
    // ============================================
    get: function(key, def) {
      try {
        var v = localStorage.getItem(key);
        return v !== null ? JSON.parse(v) : def;
      } catch (e) { return def; }
    },

    set: function(key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
    },

    today: function() {
      return new Date().toISOString().split('T')[0];
    },

    fmt: function(n) {
      try { return n.toLocaleString('id-ID'); } catch (e) { return '' + n; }
    },

    // ============================================
    // CEK BISA KLIK
    // ============================================
    canClick: function() {
      var today = this.today();
      var storedDate = this.get(this.KEY_DATE, '');
      var todayCount = this.get(this.KEY_TODAY, 0);
      var lastClick = this.get(this.KEY_LAST, 0);

      // Reset harian
      if (storedDate !== today) {
        this.set(this.KEY_DATE, today);
        this.set(this.KEY_TODAY, 0);
        todayCount = 0;
      }

      // Cek limit harian
      if (todayCount >= this.CONFIG.MAX_PER_DAY) {
        return {
          ok: false,
          reason: 'limit_harian',
          message: 'Limit harian tercapai (' + this.CONFIG.MAX_PER_DAY + 'x). Kembali besok!',
        };
      }

      // Cek cooldown
      var elapsed = (Date.now() - lastClick) / 1000;
      if (elapsed < this.CONFIG.COOLDOWN_SEC) {
        var remain = Math.ceil(this.CONFIG.COOLDOWN_SEC - elapsed);
        return {
          ok: false,
          reason: 'cooldown',
          remain: remain,
          message: 'Tunggu ' + remain + ' detik lagi',
        };
      }

      return {
        ok: true,
        todayCount: todayCount,
        remaining: this.CONFIG.MAX_PER_DAY - todayCount,
      };
    },

    // ============================================
    // KLIK → BUKA IKLAN
    // ============================================
    klik: function() {
      var check = this.canClick();
      if (!check.ok) {
        if (typeof Animate !== 'undefined') {
          Animate.toast('⚠️ ' + check.message, 'error');
        } else {
          alert(check.message);
        }
        return;
      }

      console.log('[TontonIklan] Opening ad...');

      // Simpan pending
      this.set(this.KEY_PENDING, Date.now());

      // Buka smartlink (popup dulu, redirect kalau popup block)
      var popup = null;
      try {
        popup = window.open(this.CONFIG.SMARTLINK, '_blank', 'width=800,height=600');
      } catch (e) {}

      if (!popup || popup.closed) {
        // Popup block → redirect
        window.location.href = this.CONFIG.SMARTLINK;
      } else {
        // Popup OK
        if (typeof Animate !== 'undefined') {
          Animate.toast('🎬 Nonton iklan dulu, lalu tutup tab-nya', 'info');
        }

        // Auto-detect return setelah 8 detik
        var self = this;
        setTimeout(function() {
          self.checkPending();
        }, 8000);
      }
    },

    // ============================================
    // CEK PENDING (saat user kembali)
    // ============================================
    checkPending: function() {
      var pending = this.get(this.KEY_PENDING, 0);
      if (!pending) return;

      var elapsed = Date.now() - pending;
      console.log('[TontonIklan] Pending detected: ' + Math.round(elapsed/1000) + 's');

      // Kasih reward kalau kembali setelah 5-60 detik
      if (elapsed > 5000 && elapsed < 60000) {
        this.giveReward();
      }

      this.set(this.KEY_PENDING, 0);
    },

    // ============================================
    // BERI REWARD
    // ============================================
    giveReward: function() {
      var koin = this.getRandomReward();

      // Update state
      var today = this.today();
      var todayCount = this.get(this.KEY_TODAY, 0);

      this.set(this.KEY_LAST, Date.now());
      this.set(this.KEY_TODAY, todayCount + 1);
      this.set(this.KEY_DATE, today);

      // Tambah koin ke user
      try {
        if (typeof Rewards !== 'undefined' && Rewards.addCoin) {
          Rewards.addCoin(koin, '🎬 Tonton Iklan');
        }
      } catch (e) {
        console.warn('[TontonIklan] Add coin error:', e);
      }

      console.log('[TontonIklan] ✅ +' + koin + ' koin');

      // Popup reward
      this.showPopup(koin);
    },

    // ============================================
    // RANDOM REWARD (weighted)
    // ============================================
    getRandomReward: function() {
      var min = this.CONFIG.KOIN_MIN;
      var max = this.CONFIG.KOIN_MAX;
      var random = Math.random();

      var reward;
      if (random < 0.50) {
        reward = Math.floor(min + (max - min) * 0.15 * Math.random());
      } else if (random < 0.80) {
        reward = Math.floor(min + (max - min) * 0.4 * Math.random());
      } else if (random < 0.95) {
        reward = Math.floor(min + (max - min) * 0.7 * Math.random());
      } else {
        reward = max;
      }

      return Math.max(min, Math.min(max, reward));
    },

    // ============================================
    // POPUP REWARD
    // ============================================
    showPopup: function(koin) {
      var rupiah = (koin / 100).toFixed(2);
      var emoji = koin >= 90 ? '🎉' : (koin >= 50 ? '💰' : '🪙');
      var title = koin >= 90 ? 'JACKPOT!' : 'SELAMAT!';

      var old = document.getElementById('tonton-popup');
      if (old) old.remove();

      var modal = document.createElement('div');
      modal.id = 'tonton-popup';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(12px);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px';

      modal.innerHTML =
        '<div style="background:linear-gradient(135deg,#fbbf24,#f59e0b);border-radius:28px;padding:40px 32px;text-align:center;max-width:360px;width:100%;color:white;box-shadow:0 24px 80px rgba(0,0,0,0.4)">' +
          '<div style="font-size:80px;margin-bottom:16px">' + emoji + '</div>' +
          '<div style="font-size:20px;font-weight:900;margin-bottom:8px">' + title + '</div>' +
          '<div style="font-size:56px;font-weight:900;line-height:1;margin-bottom:12px">+' + koin + '</div>' +
          '<div style="font-size:14px;font-weight:700;opacity:0.95;margin-bottom:20px">Koin (Rp ' + rupiah + ')</div>' +
          '<div style="background:rgba(255,255,255,0.2);border-radius:12px;padding:12px;margin-bottom:20px;font-size:12px">' +
            'Koin bisa dipakai untuk bayar top up<br>' +
            '<strong>100 koin = Rp 1</strong>' +
          '</div>' +
          '<button onclick="this.closest('#tonton-popup').remove()" style="padding:14px 40px;background:white;color:#b45309;border:none;border-radius:999px;font-family:inherit;font-size:15px;font-weight:900;cursor:pointer">Lanjut 🎉</button>' +
        '</div>';

      document.body.appendChild(modal);

      if (koin >= 50 && typeof UI !== 'undefined' && UI.confetti) {
        UI.confetti();
      }
      if (typeof Animate !== 'undefined' && Animate.confetti) {
        Animate.confetti();
      }
      if (typeof UI !== 'undefined') {
        if (UI.haptic) UI.haptic([50, 30, 50]);
        if (UI.sound) UI.sound('achievement');
      }
    },

    // ============================================
    // RENDER UI — Kartu di halaman top up
    // ============================================
    renderUI: function() {
      var check = this.canClick();
      var todayCount = this.get(this.KEY_TODAY, 0);
      var today = this.today();
      var storedDate = this.get(this.KEY_DATE, '');
      if (storedDate !== today) todayCount = 0;

      var btnDisabled = !check.ok;
      var btnText = '🎬 TONTON IKLAN DAPAT KOIN';
      var btnSub = 'Dapat ' + this.CONFIG.KOIN_MIN + '-' + this.CONFIG.KOIN_MAX + ' koin per tonton';

      if (check.reason === 'cooldown') {
        btnText = '⏱️ Tunggu ' + check.remain + 's';
        btnSub = 'Cooldown antar klik';
      } else if (check.reason === 'limit_harian') {
        btnText = '✅ Limit Harian Tercapai';
        btnSub = 'Kembali besok untuk tonton lagi';
      }

      // Cek saldo koin
      var saldo = 0;
      try {
        if (typeof Rewards !== 'undefined' && Rewards.getState) {
          saldo = Rewards.getState().balance || 0;
        }
      } catch (e) {}

      var html = '' +
        '<div class="tonton-card" style="' +
          'background: linear-gradient(135deg, #1cb0f6 0%, #0891b2 100%);' +
          'border-radius: 20px;' +
          'padding: 20px;' +
          'margin-bottom: 16px;' +
          'color: white;' +
          'box-shadow: 0 12px 32px rgba(28,176,246,0.35);' +
          'position: relative;' +
          'overflow: hidden;' +
        '">' +
          '<div style="position:absolute;top:-30px;right:-30px;font-size:120px;opacity:0.15;transform:rotate(-15deg)">🎬</div>' +
          '<div style="position:relative;z-index:1">' +
            '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">' +
              '<span style="font-size:32px">🎬</span>' +
              '<div style="flex:1">' +
                '<div style="font-size:18px;font-weight:900;margin-bottom:2px">Tonton Iklan, Dapat Koin!</div>' +
                '<div style="font-size:11px;opacity:0.9">100 koin = Rp 1 • Koin untuk top up</div>' +
              '</div>' +
            '</div>' +

            '<div style="background:rgba(255,255,255,0.15);border-radius:12px;padding:12px;margin-bottom:14px">' +
              '<div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:12px">' +
                '<span>💰 Saldo koin kamu</span>' +
                '<strong>' + this.fmt(saldo) + ' 🪙</strong>' +
              '</div>' +
              '<div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:12px">' +
                '<span>📊 Hari ini</span>' +
                '<strong>' + todayCount + '/' + this.CONFIG.MAX_PER_DAY + '</strong>' +
              '</div>' +
              '<div style="display:flex;justify-content:space-between;font-size:12px">' +
                '<span>🎁 Reward per tonton</span>' +
                '<strong>' + this.CONFIG.KOIN_MIN + '-' + this.CONFIG.KOIN_MAX + ' 🪙</strong>' +
              '</div>' +
            '</div>' +

            '<button ' +
              'id="tonton-btn" ' +
              'onclick="TontonIklan.klik()" ' +
              'style="' +
                'width:100%;' +
                'padding:16px;' +
                'background:linear-gradient(135deg,#fbbf24,#f59e0b);' +
                'color:white;' +
                'border:none;' +
                'border-radius:12px;' +
                'font-family:inherit;' +
                'font-size:15px;' +
                'font-weight:900;' +
                'cursor:' + (btnDisabled ? 'not-allowed' : 'pointer') + ';' +
                'box-shadow:0 4px 0 #b45309;' +
                'text-transform:uppercase;' +
                'letter-spacing:0.5px;' +
                'opacity:' + (btnDisabled ? '0.6' : '1') + ';' +
              '" ' +
              (btnDisabled ? 'disabled' : '') +
            '>' +
              btnText +
            '</button>' +

            '<div style="text-align:center;font-size:11px;margin-top:8px;opacity:0.9">' +
              btnSub +
            '</div>' +
          '</div>' +
        '</div>';

      return html;
    },

    // ============================================
    // UPDATE UI
    // ============================================
    updateUI: function() {
      var container = document.getElementById('tonton-container');
      if (container) {
        container.innerHTML = this.renderUI();
      }
    },

    // ============================================
    // INIT — Inject ke halaman
    // ============================================
    init: function() {
      console.log('[TontonIklan] Init...');

      var self = this;

      // Cek pending reward
      setTimeout(function() {
        self.checkPending();
      }, 1000);

      // Inject UI setelah halaman siap
      setTimeout(function() {
        self.injectUI();
      }, 1500);

      // Update UI setiap 1 detik (untuk cooldown)
      setInterval(function() {
        self.updateUI();
      }, 1000);
    },

    injectUI: function() {
      // Cari halaman top up
      var topupPage = document.getElementById('page-topup');
      if (!topupPage) {
        setTimeout(this.injectUI.bind(this), 1000);
        return;
      }

      // Sudah ada?
      if (document.getElementById('tonton-container')) return;

      // Buat container
      var container = document.createElement('div');
      container.id = 'tonton-container';
      container.innerHTML = this.renderUI();

      // Sisipkan setelah page-header
      var header = topupPage.querySelector('.page-header');
      if (header && header.parentNode) {
        header.parentNode.insertBefore(container, header.nextSibling);
      } else {
        topupPage.insertBefore(container, topupPage.firstChild);
      }

      console.log('[TontonIklan] UI injected');
    },
  };

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(function() { window.TontonIklan.init(); }, 500);
    });
  } else {
    setTimeout(function() { window.TontonIklan.init(); }, 500);
  }

  console.log('[TontonIklan] Loaded');
})();
