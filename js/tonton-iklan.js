/* ============================================
   TONTON IKLAN DAPAT KOIN
   Sistem: Weighted Random (semakin tinggi koin, semakin kecil winrate)
   Iklan: Adsterra Smartlink
   Coin = Rp (1:1)
   ============================================ */

(function() {
  'use strict';

  console.log('[TontonIklan] Loading...');

  window.TontonIklan = {
    VERSION: 'v3',

    CONFIG: {
      // Adsterra Smartlink untuk duniamu.my.id
      SMARTLINK: 'https://www.profitableratecpmnetwork.com/rnve2ckg?key=f15341dc4ed341cc62411d69d314d518',
      COOLDOWN: 30,
      MAX_PER_DAY: 20,
    },

    // ============================================
    // REWARD TABLE — WEIGHTED RANDOM
    // Semakin tinggi koin → semakin kecil winrate
    // Total weight = 100 (100%)
    // ============================================
    REWARD_TABLE: [
      // Koin      Weight (%)  Label           Kategori
      { koin: 10,    weight: 45.00,  label: '10 koin',    tier: 'common' },
      { koin: 25,    weight: 25.00,  label: '25 koin',    tier: 'common' },
      { koin: 50,    weight: 15.00,  label: '50 koin',    tier: 'uncommon' },
      { koin: 100,   weight: 8.00,   label: '100 koin',   tier: 'uncommon' },
      { koin: 250,   weight: 4.00,   label: '250 koin',   tier: 'rare' },
      { koin: 500,   weight: 2.00,   label: '500 koin',   tier: 'rare' },
      { koin: 1000,  weight: 0.80,   label: '1.000 koin', tier: 'epic' },
      { koin: 2500,  weight: 0.15,   label: '2.500 koin', tier: 'epic' },
      { koin: 5000,  weight: 0.04,   label: '5.000 koin', tier: 'legendary' },
      { koin: 10000, weight: 0.01,   label: '10.000 koin 🎉 JACKPOT!', tier: 'legendary' },
    ],

    // Total weight validation
    TOTAL_WEIGHT: 100.00,

    // Storage keys
    KEY_PENDING: 'yadstore_tonton_pending',
    KEY_LAST: 'yadstore_tonton_last',
    KEY_TODAY: 'yadstore_tonton_today',
    KEY_DATE: 'yadstore_tonton_date',
    KEY_HISTORY: 'yadstore_tonton_history',

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
    // WEIGHTED RANDOM
    // Return reward object { koin, label, tier }
    // ============================================
    getRandomReward: function() {
      // Hitung total weight
      var totalWeight = 0;
      for (var i = 0; i < this.REWARD_TABLE.length; i++) {
        totalWeight += this.REWARD_TABLE[i].weight;
      }

      // Random 0 - totalWeight
      var random = Math.random() * totalWeight;
      var cumulative = 0;

      for (var j = 0; j < this.REWARD_TABLE.length; j++) {
        cumulative += this.REWARD_TABLE[j].weight;
        if (random <= cumulative) {
          return this.REWARD_TABLE[j];
        }
      }

      // Fallback (harusnya tidak sampai sini)
      return this.REWARD_TABLE[0];
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
      if (elapsed < this.CONFIG.COOLDOWN) {
        var remain = Math.ceil(this.CONFIG.COOLDOWN - elapsed);
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

      // Buka smartlink
      var popup = null;
      try {
        popup = window.open(this.CONFIG.SMARTLINK, '_blank', 'width=800,height=600');
      } catch (e) {}

      if (!popup || popup.closed) {
        // Popup blocked → redirect
        window.location.href = this.CONFIG.SMARTLINK;
      } else {
        if (typeof Animate !== 'undefined') {
          Animate.toast('🎬 Nonton iklan dulu, lalu tutup tab', 'info');
        }

        // Detect return
        var self = this;
        setTimeout(function() {
          self.checkPending();
        }, 8000);
      }
    },

    // ============================================
    // CEK PENDING
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
      var reward = this.getRandomReward();
      var koin = reward.koin;

      // Update state
      var today = this.today();
      var todayCount = this.get(this.KEY_TODAY, 0);

      this.set(this.KEY_LAST, Date.now());
      this.set(this.KEY_TODAY, todayCount + 1);
      this.set(this.KEY_DATE, today);

      // Save history
      var history = this.get(this.KEY_HISTORY, []);
      history.unshift({
        koin: koin,
        tier: reward.tier,
        date: new Date().toISOString(),
      });
      if (history.length > 100) history = history.slice(0, 100);
      this.set(this.KEY_HISTORY, history);

      // Tambah koin ke user
      try {
        if (typeof Rewards !== 'undefined' && Rewards.addCoin) {
          Rewards.addCoin(koin, '🎬 Tonton Iklan (' + reward.label + ')');
        }
      } catch (e) {
        console.warn('[TontonIklan] Add coin error:', e);
      }

      console.log('[TontonIklan] ✅ +' + koin + ' koin (' + reward.tier + ')');

      // Popup
      this.showPopup(reward);
    },

    // ============================================
    // POPUP REWARD
    // ============================================
    showPopup: function(reward) {
      var koin = reward.koin;
      var tier = reward.tier;

      // Warna & emoji berdasarkan tier
      var tierConfig = {
        common:    { bg: 'linear-gradient(135deg,#58cc02,#89e219)', emoji: '🪙', title: 'SELAMAT!' },
        uncommon:  { bg: 'linear-gradient(135deg,#1cb0f6,#0891b2)', emoji: '💙', title: 'BAGUS!' },
        rare:      { bg: 'linear-gradient(135deg,#a855f7,#7c3aed)', emoji: '💎', title: 'RARE!' },
        epic:      { bg: 'linear-gradient(135deg,#f59e0b,#d97706)', emoji: '👑', title: 'EPIC!' },
        legendary: { bg: 'linear-gradient(135deg,#ef4444,#dc2626,#f59e0b)', emoji: '🎉', title: 'JACKPOT!' },
      };

      var cfg = tierConfig[tier] || tierConfig.common;

      // Remove existing
      var old = document.getElementById('tonton-popup');
      if (old) old.remove();

      var modal = document.createElement('div');
      modal.id = 'tonton-popup';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(12px);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px';

      modal.innerHTML =
        '<div style="background:' + cfg.bg + ';border-radius:28px;padding:40px 32px;text-align:center;max-width:360px;width:100%;color:white;box-shadow:0 24px 80px rgba(0,0,0,0.5);position:relative;overflow:hidden">' +
          '<div style="position:absolute;top:-20px;right:-20px;font-size:120px;opacity:0.15">' + cfg.emoji + '</div>' +
          '<div style="position:relative;z-index:1">' +
            '<div style="font-size:80px;margin-bottom:16px">' + cfg.emoji + '</div>' +
            '<div style="font-size:20px;font-weight:900;margin-bottom:8px;letter-spacing:1px">' + cfg.title + '</div>' +
            '<div style="font-size:56px;font-weight:900;line-height:1;margin-bottom:12px">+' + this.fmt(koin) + '</div>' +
            '<div style="font-size:14px;font-weight:700;opacity:0.95;margin-bottom:20px">koin = Rp ' + this.fmt(koin) + '</div>' +
            '<div style="background:rgba(0,0,0,0.2);border-radius:12px;padding:10px;margin-bottom:20px;font-size:12px">' +
              '<div style="font-weight:900;text-transform:uppercase;font-size:10px;opacity:0.9;margin-bottom:4px">' + tier + '</div>' +
              '<div>Koin bisa dipakai untuk top up & beli icon</div>' +
            '</div>' +
            '<button onclick="this.closest(\'#tonton-popup\').remove()" style="padding:14px 40px;background:white;color:#1a1a1a;border:none;border-radius:999px;font-family:inherit;font-size:15px;font-weight:900;cursor:pointer">Lanjut 🎉</button>' +
          '</div>' +
        '</div>';

      document.body.appendChild(modal);

      // Confetti untuk tier rare ke atas
      if ((tier === 'rare' || tier === 'epic' || tier === 'legendary') && typeof Animate !== 'undefined' && Animate.confetti) {
        Animate.confetti();
      }

      // Sound & haptic
      if (typeof UI !== 'undefined') {
        if (UI.haptic) UI.haptic(tier === 'legendary' ? [50, 30, 50, 30, 50] : [50, 30, 50]);
        if (UI.sound) UI.sound(tier === 'legendary' || tier === 'epic' ? 'achievement' : 'coin');
      }

      // Update coin header
      if (typeof CoinHeader !== 'undefined' && CoinHeader.updateHeaderValue) {
        setTimeout(function() { CoinHeader.updateHeaderValue(); }, 200);
      }
    },

    // ============================================
    // RENDER UI (untuk halaman Reward)
    // ============================================
    renderUI: function() {
      var check = this.canClick();
      var todayCount = this.get(this.KEY_TODAY, 0);
      var today = this.today();
      var storedDate = this.get(this.KEY_DATE, '');
      if (storedDate !== today) todayCount = 0;

      var btnDisabled = !check.ok;
      var btnText = '🎬 TONTON IKLAN DAPAT KOIN';
      var btnSub = 'Dapat 10-10.000 koin (semakin tinggi, semakin langka)';

      if (check.reason === 'cooldown') {
        btnText = '⏱️ Tunggu ' + check.remain + 's';
        btnSub = 'Cooldown antar klik';
      } else if (check.reason === 'limit_harian') {
        btnText = '✅ Limit Harian Tercapai';
        btnSub = 'Kembali besok untuk nonton lagi';
      }

      return '' +
        '<button ' +
          'id="tonton-btn" ' +
          'onclick="TontonIklan.klik()" ' +
          'style="' +
            'width:100%;padding:16px;' +
            'background:linear-gradient(135deg,#fbbf24,#f59e0b);' +
            'color:white;border:none;border-radius:12px;' +
            'font-family:inherit;font-size:15px;font-weight:900;' +
            'cursor:' + (btnDisabled ? 'not-allowed' : 'pointer') + ';' +
            'box-shadow:0 4px 0 #b45309;' +
            'text-transform:uppercase;letter-spacing:0.5px;' +
            'opacity:' + (btnDisabled ? '0.6' : '1') + ';' +
          '" ' +
          (btnDisabled ? 'disabled' : '') +
        '>' +
          btnText +
        '</button>' +
        '<div style="text-align:center;font-size:11px;margin-top:8px;opacity:0.9">' +
          btnSub +
        '</div>' +
        '<div style="text-align:center;font-size:11px;margin-top:4px;opacity:0.7">' +
          '📊 Hari ini: ' + todayCount + '/' + this.CONFIG.MAX_PER_DAY +
        '</div>';
    },

    // ============================================
    // INIT
    // ============================================
    init: function() {
      console.log('[TontonIklan] Init — Weighted Random v3');
      console.log('[TontonIklan] Reward distribution:');
      var self = this;
      this.REWARD_TABLE.forEach(function(r) {
        console.log('  • ' + r.label + ' → ' + r.weight + '%');
      });

      // Cek pending
      var self2 = this;
      setTimeout(function() {
        self2.checkPending();
      }, 1000);

      // Update UI tiap 1 detik
      setInterval(function() {
        var container = document.getElementById('tonton-iklan-container');
        if (container) {
          container.innerHTML = self.renderUI();
        }
      }, 1000);
    },
  };

  // Auto init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(function() { window.TontonIklan.init(); }, 500);
    });
  } else {
    setTimeout(function() { window.TontonIklan.init(); }, 500);
  }

  console.log('[TontonIklan] Loaded v3 (Weighted Random)');
})();
