/* ============================================
   COIN HEADER + REWARD PAGE
   Icon coin di header → klik → halaman reward
   ============================================ */

(function() {
  'use strict';

  console.log('[CoinHeader] Loading...');

  window.CoinHeader = {
    VERSION: 'v1',

    // ============================================
    // GET SALDO
    // ============================================
    getSaldo: function() {
      try {
        if (typeof Rewards !== 'undefined' && Rewards.getState) {
          return Rewards.getState().balance || 0;
        }
      } catch (e) {}
      try {
        return parseFloat(localStorage.getItem('yadstore_reward_balance') || '0');
      } catch (e) {}
      return 0;
    },

    fmt: function(n) {
      try { return n.toLocaleString('id-ID'); } catch (e) { return '' + n; }
    },

    // ============================================
    // INJECT COIN BUTTON DI HEADER
    // ============================================
    injectHeaderButton: function() {
      // Cek sudah ada?
      if (document.getElementById('coin-header-btn')) return;

      // Cari header-inner
      var headerInner = document.querySelector('.header-inner');
      if (!headerInner) {
        setTimeout(this.injectHeaderButton.bind(this), 500);
        return;
      }

      // Cari brand (untuk insert setelah brand)
      var brand = headerInner.querySelector('.brand');
      
      // Buat tombol coin
      var btn = document.createElement('button');
      btn.id = 'coin-header-btn';
      btn.onclick = function() { window.CoinHeader.openReward(); };
      btn.style.cssText = 
        'display:flex;align-items:center;gap:5px;' +
        'background:linear-gradient(135deg,#fbbf24,#f59e0b);' +
        'border:none;padding:6px 12px;border-radius:999px;' +
        'color:white;font-family:inherit;font-weight:900;font-size:12px;' +
        'cursor:pointer;box-shadow:0 4px 0 #b45309;' +
        'transition:all 0.2s;flex-shrink:0;' +
        'margin-left:auto;margin-right:6px;';
      
      btn.innerHTML = 
        '<span style="font-size:14px">🪙</span>' +
        '<span id="coin-header-value">0</span>' +
        '<span style="font-size:10px;opacity:0.9">🖼️</span>';

      // Tambahkan hover effect
      btn.onmouseenter = function() {
        btn.style.transform = 'translateY(-2px)';
      };
      btn.onmouseleave = function() {
        btn.style.transform = 'translateY(0)';
      };

      // Insert setelah brand
      if (brand && brand.nextSibling) {
        headerInner.insertBefore(btn, brand.nextSibling);
      } else {
        headerInner.appendChild(btn);
      }

      // Update nilai
      this.updateHeaderValue();

      console.log('[CoinHeader] Button injected');
    },

    // ============================================
    // UPDATE NILAI COIN DI HEADER
    // ============================================
    updateHeaderValue: function() {
      var el = document.getElementById('coin-header-value');
      if (!el) return;
      
      var saldo = this.getSaldo();
      el.textContent = this.fmt(saldo);
    },

    // ============================================
    // BUKA HALAMAN REWARD
    // ============================================
    openReward: function() {
      // Cek halaman reward ada
      var page = document.getElementById('page-reward');
      
      if (!page) {
        // Buat halaman baru
        this.createRewardPage();
        page = document.getElementById('page-reward');
      }

      // Switch ke halaman reward
      if (typeof App !== 'undefined' && App.switchTab) {
        // Cek apakah 'reward' tab ada di menu
        try {
          App.switchTab('reward');
        } catch (e) {
          // Manual switch
          document.querySelectorAll('.tab-page').forEach(function(p) {
            p.classList.remove('active');
          });
          if (page) page.classList.add('active');
          window.scrollTo(0, 0);
        }
      } else {
        // Manual
        document.querySelectorAll('.tab-page').forEach(function(p) {
          p.classList.remove('active');
        });
        if (page) page.classList.add('active');
        window.scrollTo(0, 0);
      }

      // Render reward page
      this.renderRewardPage();
    },

    // ============================================
    // CREATE REWARD PAGE (kalau belum ada)
    // ============================================
    createRewardPage: function() {
      var main = document.querySelector('.app-main');
      if (!main) return;

      var page = document.createElement('section');
      page.className = 'tab-page';
      page.id = 'page-reward';
      page.innerHTML = '<div id="reward-page-content"></div>';
      main.appendChild(page);
    },

    // ============================================
    // RENDER REWARD PAGE
    // ============================================
    renderRewardPage: function() {
      var content = document.getElementById('reward-page-content');
      if (!content) return;

      var saldo = this.getSaldo();
      var rupiah = saldo / 100;

      var html = '' +
        '<div class="page-header">' +
          '<h1>💰 Reward</h1>' +
          '<p>Kumpulkan koin untuk top up & beli icon</p>' +
        '</div>' +

        // ===== SALDO CARD =====
        '<div style="background:linear-gradient(135deg,#fbbf24,#f59e0b);border-radius:20px;padding:24px 20px;margin-bottom:16px;color:white;box-shadow:0 12px 32px rgba(251,191,36,0.35);position:relative;overflow:hidden">' +
          '<div style="position:absolute;top:-30px;right:-30px;font-size:120px;opacity:0.15">🪙</div>' +
          '<div style="position:relative;z-index:1;text-align:center">' +
            '<div style="font-size:12px;font-weight:700;opacity:0.9;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Saldo Koin Kamu</div>' +
            '<div style="font-size:44px;font-weight:900;line-height:1;margin-bottom:4px">🪙 ' + this.fmt(saldo) + '</div>' +
            '<div style="font-size:14px;opacity:0.95;margin-bottom:12px">= Rp ' + this.fmt(Math.floor(rupiah)) + '</div>' +
            '<div style="background:rgba(255,255,255,0.2);border-radius:10px;padding:8px 12px;font-size:11px;display:inline-block">' +
              '<strong>100 koin = Rp 1</strong> • Hanya untuk top up & beli icon' +
            '</div>' +
          '</div>' +
        '</div>' +

        // ===== TOMBOL TONTON IKLAN =====
        '<div style="background:linear-gradient(135deg,#1cb0f6,#0891b2);border-radius:20px;padding:20px;margin-bottom:16px;color:white;box-shadow:0 12px 32px rgba(28,176,246,0.35);position:relative;overflow:hidden">' +
          '<div style="position:absolute;top:-20px;right:-20px;font-size:100px;opacity:0.15">🎬</div>' +
          '<div style="position:relative;z-index:1">' +
            '<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">' +
              '<span style="font-size:32px">🎬</span>' +
              '<div>' +
                '<div style="font-size:16px;font-weight:900;margin-bottom:2px">Tonton Iklan Dapat Koin</div>' +
                '<div style="font-size:11px;opacity:0.9">Dapat 25-100 koin per tonton</div>' +
              '</div>' +
            '</div>' +
            '<div id="tonton-iklan-container"></div>' +
          '</div>' +
        '</div>' +

        // ===== TOMBOL ICON SHOP =====
        '<div style="background:linear-gradient(135deg,#a855f7,#7c3aed);border-radius:20px;padding:20px;margin-bottom:16px;color:white;box-shadow:0 12px 32px rgba(168,85,247,0.35);position:relative;overflow:hidden">' +
          '<div style="position:absolute;top:-20px;right:-20px;font-size:100px;opacity:0.15">🖼️</div>' +
          '<div style="position:relative;z-index:1">' +
            '<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">' +
              '<span style="font-size:32px">🖼️</span>' +
              '<div>' +
                '<div style="font-size:16px;font-weight:900;margin-bottom:2px">Icon Shop</div>' +
                '<div style="font-size:11px;opacity:0.9">Beli icon game dengan koin</div>' +
              '</div>' +
            '</div>' +
            '<button onclick="IconShop.open()" style="width:100%;padding:14px;background:white;color:#7c3aed;border:none;border-radius:12px;font-family:inherit;font-size:14px;font-weight:900;cursor:pointer;box-shadow:0 4px 0 #6d28d9">' +
              '🖼️ BUKA ICON SHOP' +
            '</button>' +
          '</div>' +
        '</div>' +

        // ===== CARA DAPAT KOIN =====
        '<div style="background:white;border-radius:16px;padding:16px;margin-bottom:16px;box-shadow:0 4px 12px rgba(0,0,0,0.06)">' +
          '<div style="font-size:14px;font-weight:900;margin-bottom:12px">💰 Cara Dapat Koin</div>' +
          '<div style="display:flex;flex-direction:column;gap:10px">' +
            '<div style="display:flex;align-items:center;gap:12px;padding:10px;background:#f7f8fa;border-radius:10px">' +
              '<span style="font-size:24px">🎬</span>' +
              '<div style="flex:1"><div style="font-size:13px;font-weight:900">Tonton Iklan</div><div style="font-size:11px;color:#666">25-100 koin per tonton</div></div>' +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:12px;padding:10px;background:#f7f8fa;border-radius:10px">' +
              '<span style="font-size:24px">🛒</span>' +
              '<div style="flex:1"><div style="font-size:13px;font-weight:900">Top Up</div><div style="font-size:11px;color:#666">Bonus 100 koin per order</div></div>' +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:12px;padding:10px;background:#f7f8fa;border-radius:10px">' +
              '<span style="font-size:24px">🎁</span>' +
              '<div style="flex:1"><div style="font-size:13px;font-weight:900">Referral</div><div style="font-size:11px;color:#666">500 koin per teman</div></div>' +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:12px;padding:10px;background:#f7f8fa;border-radius:10px">' +
              '<span style="font-size:24px">📖</span>' +
              '<div style="flex:1"><div style="font-size:13px;font-weight:900">Baca Artikel</div><div style="font-size:11px;color:#666">50 koin per artikel</div></div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        // ===== CARA PAKAI KOIN =====
        '<div style="background:white;border-radius:16px;padding:16px;margin-bottom:16px;box-shadow:0 4px 12px rgba(0,0,0,0.06)">' +
          '<div style="font-size:14px;font-weight:900;margin-bottom:12px">🎯 Koin Bisa Dipakai Untuk</div>' +
          '<div style="display:flex;flex-direction:column;gap:10px">' +
            '<div style="display:flex;align-items:center;gap:12px;padding:10px;background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:10px">' +
              '<span style="font-size:24px">🛒</span>' +
              '<div style="flex:1"><div style="font-size:13px;font-weight:900">Beli Produk Top Up</div><div style="font-size:11px;color:#78350f">Diamond, Pulsa, Voucher</div></div>' +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:12px;padding:10px;background:linear-gradient(135deg,#f3e8ff,#e9d5ff);border-radius:10px">' +
              '<span style="font-size:24px">🖼️</span>' +
              '<div style="flex:1"><div style="font-size:13px;font-weight:900">Beli Icon Game</div><div style="font-size:11px;color:#6d28d9">500-1000 koin per icon</div></div>' +
            '</div>' +
          '</div>' +
        '</div>';

      content.innerHTML = html;

      // Inject tombol Tonton Iklan
      this.injectTontonIklanButton();
    },

    // ============================================
    // INJECT TOMBOL TONTON IKLAN
    // ============================================
    injectTontonIklanButton: function() {
      var container = document.getElementById('tonton-iklan-container');
      if (!container) return;

      // Kalau TontonIklan sudah ada
      if (typeof TontonIklan !== 'undefined' && TontonIklan.renderUI) {
        container.innerHTML = TontonIklan.renderUI();
        return;
      }

      // Fallback: tombol sederhana
      var html = '' +
        '<button onclick="CoinHeader.klikIklan()" style="' +
          'width:100%;padding:14px;' +
          'background:linear-gradient(135deg,#fbbf24,#f59e0b);' +
          'color:white;border:none;border-radius:12px;' +
          'font-family:inherit;font-size:14px;font-weight:900;' +
          'cursor:pointer;box-shadow:0 4px 0 #b45309' +
        '">🎬 TONTON IKLAN DAPAT KOIN</button>' +
        '<div style="text-align:center;font-size:11px;margin-top:8px;opacity:0.9">' +
          'Klik → nonton iklan → dapat 25-100 koin' +
        '</div>';

      container.innerHTML = html;
    },

    // ============================================
    // KLIK IKLAN (fallback)
    // ============================================
    klikIklan: function() {
      // Coba pakai TontonIklan
      if (typeof TontonIklan !== 'undefined' && TontonIklan.klik) {
        TontonIklan.klik();
        return;
      }

      // Coba pakai AdsManager
      if (typeof AdsManager !== 'undefined' && AdsManager.openRewarded) {
        AdsManager.openRewarded().then(function(r) {
          if (r && r.success) {
            if (typeof Animate !== 'undefined') {
              Animate.toast('🎬 Iklan terbuka, tunggu selesai', 'info');
            }
            // Kasih koin
            setTimeout(function() {
              var koin = 25 + Math.floor(Math.random() * 75);
              if (typeof Rewards !== 'undefined' && Rewards.addCoin) {
                Rewards.addCoin(koin, '🎬 Tonton Iklan');
              }
              alert('🎉 Dapat ' + koin + ' koin!');
            }, 8000);
          }
        });
        return;
      }

      // Last fallback
      alert('⚠️ Fitur iklan belum siap. Coba refresh halaman.');
    },

    // ============================================
    // INIT
    // ============================================
    init: function() {
      console.log('[CoinHeader] Init...');

      var self = this;

      // Inject tombol coin di header
      setTimeout(function() {
        self.injectHeaderButton();
      }, 800);

      // Update nilai coin setiap 3 detik
      setInterval(function() {
        self.updateHeaderValue();
      }, 3000);

      // Update reward page kalau ada
      setInterval(function() {
        var page = document.getElementById('page-reward');
        if (page && page.classList.contains('active')) {
          self.renderRewardPage();
        }
      }, 5000);

      // Hook ke Rewards.addCoin untuk update header
      setTimeout(function() {
        if (typeof Rewards !== 'undefined' && Rewards.addCoin && !Rewards._coinHeaderHooked) {
          Rewards._coinHeaderHooked = true;
          var origAddCoin = Rewards.addCoin;
          Rewards.addCoin = function(amount, reason) {
            var r = origAddCoin.call(Rewards, amount, reason);
            setTimeout(function() { self.updateHeaderValue(); }, 100);
            return r;
          };
        }
        if (typeof Rewards !== 'undefined' && Rewards.spendCoin && !Rewards._coinHeaderSpendHooked) {
          Rewards._coinHeaderSpendHooked = true;
          var origSpend = Rewards.spendCoin;
          Rewards.spendCoin = function(amount, reason) {
            var r = origSpend.call(Rewards, amount, reason);
            setTimeout(function() { self.updateHeaderValue(); }, 100);
            return r;
          };
        }
      }, 2000);

      console.log('[CoinHeader] Ready');
    },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(function() { window.CoinHeader.init(); }, 1000);
    });
  } else {
    setTimeout(function() { window.CoinHeader.init(); }, 1000);
  }

  console.log('[CoinHeader] Loaded');
})();
