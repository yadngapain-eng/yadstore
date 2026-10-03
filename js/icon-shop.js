/* ============================================
   ICON SHOP — Beli Icon dengan Koin
   Koin hanya bisa dipakai untuk top up & beli icon
   100 koin = Rp 1
   ============================================ */

(function() {
  'use strict';

  console.log('[IconShop] Loading...');

  window.IconShop = {
    VERSION: 'v1',

    CONFIG: {
      KOIN_PER_RUPIAH: 100,
      DISCOUNT_KOIN: 0.2,  // 20% lebih murah pakai koin
    },

    // ============================================
    // DAFTAR ICON YANG BISA DIBELI
    // ============================================
    ICONS: [
      // Icons game (basic)
      { id: 'aov',       name: 'Arena of Valor',   file: '/icons/games/aov.png',       price_koin: 500,   category: 'moba' },
      { id: 'hok',       name: 'Honor of Kings',   file: '/icons/games/hok.png',       price_koin: 500,   category: 'moba' },
      { id: 'mlbb',      name: 'Mobile Legends',   file: '/icons/games/mlbb.png',      price_koin: 500,   category: 'moba' },
      { id: 'wildrift',  name: 'Wild Rift',        file: '/icons/games/wildrift.png',  price_koin: 500,   category: 'moba' },
      { id: 'ff',        name: 'Free Fire',        file: '/icons/games/ff.png',        price_koin: 500,   category: 'br' },
      { id: 'pubg',      name: 'PUBG Mobile',      file: '/icons/games/pubg.png',      price_koin: 500,   category: 'br' },
      { id: 'codm',      name: 'COD Mobile',       file: '/icons/games/codm.png',      price_koin: 500,   category: 'fps' },
      { id: 'valorant',  name: 'Valorant',         file: '/icons/games/valorant.png',  price_koin: 750,   category: 'fps' },
      { id: 'csgo',      name: 'CS2 / CS:GO',      file: '/icons/games/csgo.png',      price_koin: 750,   category: 'fps' },
      { id: 'genshin',   name: 'Genshin Impact',   file: '/icons/games/genshin.png',   price_koin: 750,   category: 'rpg' },
      { id: 'hsr',       name: 'Honkai Star Rail', file: '/icons/games/hsr.png',       price_koin: 750,   category: 'rpg' },
      { id: 'roblox',    name: 'Roblox',           file: '/icons/games/roblox.png',    price_koin: 500,   category: 'platform' },
      { id: 'minecraft', name: 'Minecraft',        file: '/icons/games/minecraft.png', price_koin: 750,   category: 'sandbox' },
      { id: 'coc',       name: 'Clash of Clans',   file: '/icons/games/coc.png',       price_koin: 750,   category: 'strategy' },
      { id: 'cr',        name: 'Clash Royale',     file: '/icons/games/cr.png',        price_koin: 750,   category: 'strategy' },
      { id: 'brawlstars',name: 'Brawl Stars',      file: '/icons/games/brawlstars.png',price_koin: 500,   category: 'moba' },
      { id: 'steam',     name: 'Steam Wallet',     file: '/icons/games/steam.png',     price_koin: 1000,  category: 'voucher' },
      { id: 'gplay',     name: 'Google Play',      file: '/icons/games/gplay.svg',     price_koin: 1000,  category: 'voucher' },
      { id: 'itunes',    name: 'iTunes',           file: '/icons/games/itunes.png',    price_koin: 1000,  category: 'voucher' },
      { id: 'psn',       name: 'PlayStation',      file: '/icons/games/psn.png',       price_koin: 1000,  category: 'voucher' },
    ],

    // ============================================
    // STORAGE
    // ============================================
    get: function(key, def) {
      try {
        var v = localStorage.getItem('yadstore_iconshop_' + key);
        return v !== null ? JSON.parse(v) : def;
      } catch (e) { return def; }
    },

    set: function(key, val) {
      try { localStorage.setItem('yadstore_iconshop_' + key, JSON.stringify(val)); } catch (e) {}
    },

    // ============================================
    // CEK KEPEMILIKAN
    // ============================================
    getOwned: function() {
      return this.get('owned', []);
    },

    isOwned: function(iconId) {
      return this.getOwned().indexOf(iconId) !== -1;
    },

    // ============================================
    // BELI ICON
    // ============================================
    buy: function(iconId) {
      var icon = this.ICONS.find(function(i) { return i.id === iconId; });
      if (!icon) {
        return { success: false, reason: 'not_found', message: 'Icon tidak ditemukan' };
      }

      if (this.isOwned(iconId)) {
        return { success: false, reason: 'already_owned', message: 'Icon sudah dimiliki' };
      }

      // Cek saldo
      var saldo = 0;
      try {
        if (typeof Rewards !== 'undefined' && Rewards.getState) {
          saldo = Rewards.getState().balance || 0;
        }
      } catch (e) {}

      if (saldo < icon.price_koin) {
        return {
          success: false,
          reason: 'insufficient',
          message: 'Koin kurang ' + (icon.price_koin - saldo).toLocaleString('id-ID'),
          kurang: icon.price_koin - saldo,
        };
      }

      // Kurangi koin
      try {
        if (typeof Rewards !== 'undefined' && Rewards.spendCoin) {
          var ok = Rewards.spendCoin(icon.price_koin, '🖼️ Beli icon: ' + icon.name);
          if (!ok) {
            return { success: false, reason: 'spend_failed', message: 'Gagal kurangi koin' };
          }
        }
      } catch (e) {
        return { success: false, reason: 'error', message: e.message };
      }

      // Tambah ke owned
      var owned = this.getOwned();
      owned.push(iconId);
      this.set('owned', owned);

      console.log('[IconShop] ✅ Bought: ' + icon.name + ' (' + icon.price_koin + ' koin)');

      return {
        success: true,
        icon: icon,
        remaining: saldo - icon.price_koin,
      };
    },

    // ============================================
    // FORMAT
    // ============================================
    fmt: function(n) {
      try { return n.toLocaleString('id-ID'); } catch (e) { return '' + n; }
    },

    // ============================================
    // GET SALDO
    // ============================================
    getSaldo: function() {
      try {
        if (typeof Rewards !== 'undefined' && Rewards.getState) {
          return Rewards.getState().balance || 0;
        }
      } catch (e) {}
      return 0;
    },

    // ============================================
    // RENDER UI
    // ============================================
    render: function() {
      var self = this;
      var saldo = this.getSaldo();
      var owned = this.getOwned();

      var html = '' +
        '<div style="padding:16px;padding-bottom:80px">' +

          // HEADER
          '<div style="background:linear-gradient(135deg,#a855f7,#7c3aed);border-radius:20px;padding:20px;margin-bottom:16px;color:white;box-shadow:0 12px 32px rgba(168,85,247,0.35);position:relative;overflow:hidden">' +
            '<div style="position:absolute;top:-20px;right:-20px;font-size:100px;opacity:0.15">🖼️</div>' +
            '<div style="position:relative;z-index:1">' +
              '<div style="font-size:22px;font-weight:900;margin-bottom:4px">Icon Shop 🖼️</div>' +
              '<div style="font-size:12px;opacity:0.9;margin-bottom:14px">Beli icon game dengan koin</div>' +
              '<div style="background:rgba(255,255,255,0.2);border-radius:12px;padding:12px;display:flex;justify-content:space-between;align-items:center">' +
                '<div>' +
                  '<div style="font-size:10px;font-weight:700;opacity:0.9;text-transform:uppercase">Saldo Koin</div>' +
                  '<div style="font-size:22px;font-weight:900">🪙 ' + this.fmt(saldo) + '</div>' +
                '</div>' +
                '<div style="text-align:right">' +
                  '<div style="font-size:10px;font-weight:700;opacity:0.9;text-transform:uppercase">Dimiliki</div>' +
                  '<div style="font-size:22px;font-weight:900">' + owned.length + '/' + this.ICONS.length + '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +

          // GRID ICONS
          '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px">';

      this.ICONS.forEach(function(icon) {
        var isOwned = self.isOwned(icon.id);
        var canAfford = saldo >= icon.price_koin;

        html += '<div style="background:white;border-radius:16px;padding:14px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.06);border:2px solid ' + (isOwned ? '#58cc02' : '#e5e5e5') + ';position:relative">';

        // Badge owned
        if (isOwned) {
          html += '<div style="position:absolute;top:8px;right:8px;background:#58cc02;color:white;font-size:10px;font-weight:900;padding:2px 8px;border-radius:999px">✓ OWNED</div>';
        }

        // Icon
        html += '<img src="' + icon.file + '" alt="' + icon.name + '" style="width:80px;height:80px;object-fit:contain;margin-bottom:8px;filter:' + (isOwned ? 'none' : 'grayscale(0.3)') + '">';

        // Name
        html += '<div style="font-size:13px;font-weight:900;margin-bottom:4px;min-height:36px;line-height:1.3">' + icon.name + '</div>';

        // Price
        html += '<div style="font-size:11px;color:#999;font-weight:700;margin-bottom:8px;text-transform:uppercase">' + icon.category + '</div>';

        // Buy button
        if (isOwned) {
          html += '<button disabled style="width:100%;padding:10px;background:#f0f0f0;color:#999;border:none;border-radius:10px;font-family:inherit;font-size:12px;font-weight:900">✅ Dimiliki</button>';
        } else {
          var btnBg = canAfford ? 'linear-gradient(135deg,#fbbf24,#f59e0b)' : '#e5e5e5';
          var btnColor = canAfford ? 'white' : '#999';
          var btnShadow = canAfford ? 'box-shadow:0 4px 0 #b45309;' : '';
          html += '<button onclick="IconShop.handleBuy(\'' + icon.id + '\')" style="width:100%;padding:10px;background:' + btnBg + ';color:' + btnColor + ';border:none;border-radius:10px;font-family:inherit;font-size:12px;font-weight:900;cursor:pointer;' + btnShadow + '">🪙 ' + self.fmt(icon.price_koin) + '</button>';
        }

        html += '</div>';
      });

      html += '</div>' +
        '</div>';

      return html;
    },

    // ============================================
    // HANDLE BUY
    // ============================================
    handleBuy: function(iconId) {
      var icon = this.ICONS.find(function(i) { return i.id === iconId; });
      if (!icon) return;

      var saldo = this.getSaldo();

      var konfirmasi = confirm(
        '🖼️ Beli Icon?\n\n' +
        'Nama: ' + icon.name + '\n' +
        'Harga: 🪙 ' + this.fmt(icon.price_koin) + ' koin\n' +
        'Saldo: 🪙 ' + this.fmt(saldo) + ' koin\n' +
        'Sisa setelah beli: 🪙 ' + this.fmt(saldo - icon.price_koin) + ' koin\n\n' +
        'Lanjutkan?'
      );

      if (!konfirmasi) return;

      var result = this.buy(iconId);

      if (result.success) {
        // Popup sukses
        this.showSuccess(result, icon);
        this.refresh();
      } else {
        if (typeof Animate !== 'undefined') {
          Animate.toast('❌ ' + result.message, 'error');
        } else {
          alert(result.message);
        }
      }
    },

    // ============================================
    // SHOW SUCCESS
    // ============================================
    showSuccess: function(result, icon) {
      var modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(12px);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px';

      modal.innerHTML =
        '<div style="background:linear-gradient(135deg,#58cc02,#89e219);border-radius:24px;padding:32px 24px;text-align:center;max-width:340px;width:100%;color:white;box-shadow:0 24px 80px rgba(0,0,0,0.4)">' +
          '<div style="font-size:72px;margin-bottom:12px">🎉</div>' +
          '<div style="font-size:20px;font-weight:900;margin-bottom:8px">Berhasil!</div>' +
          '<img src="' + icon.file + '" style="width:80px;height:80px;object-fit:contain;margin:12px auto;display:block;background:white;border-radius:16px;padding:8px">' +
          '<div style="font-size:16px;font-weight:900;margin-bottom:16px">' + icon.name + '</div>' +
          '<div style="background:rgba(0,0,0,0.15);border-radius:12px;padding:12px;margin-bottom:16px">' +
            '<div style="font-size:11px;opacity:0.9">Koin terpakai</div>' +
            '<div style="font-size:22px;font-weight:900">🪙 ' + this.fmt(icon.price_koin) + '</div>' +
            '<div style="font-size:11px;margin-top:6px;opacity:0.9">Sisa: ' + this.fmt(result.remaining) + ' koin</div>' +
          '</div>' +
          '<button onclick="this.closest(\'div[style*="position:fixed"]\').remove()" style="padding:12px 32px;background:white;color:#46a302;border:none;border-radius:999px;font-family:inherit;font-size:14px;font-weight:900;cursor:pointer">OK 🎉</button>' +
        '</div>';

      document.body.appendChild(modal);

      if (typeof UI !== 'undefined' && UI.confetti) UI.confetti();
      if (typeof UI !== 'undefined' && UI.haptic) UI.haptic([50, 30, 50]);
      if (typeof UI !== 'undefined' && UI.sound) UI.sound('achievement');
    },

    // ============================================
    // REFRESH
    // ============================================
    refresh: function() {
      var container = document.getElementById('iconshop-content');
      if (container) {
        container.innerHTML = this.render();
      }
    },

    // ============================================
    // INIT
    // ============================================
    init: function() {
      console.log('[IconShop] Init');
      var self = this;

      // Inject UI ke halaman (nanti dipanggil dari App.switchTab)
      // Untuk sekarang, tampilkan via menu
    },

    // ============================================
    // OPEN (dipanggil dari menu)
    // ============================================
    open: function() {
      // Buat halaman modal fullscreen
      var existing = document.getElementById('iconshop-modal');
      if (existing) existing.remove();

      var modal = document.createElement('div');
      modal.id = 'iconshop-modal';
      modal.style.cssText = 'position:fixed;inset:0;background:#f7f8fa;z-index:9998;overflow-y:auto';

      modal.innerHTML = '' +
        '<div style="background:white;border-bottom:1.5px solid #e5e5e5;padding:12px 16px;display:flex;align-items:center;gap:12px;position:sticky;top:0;z-index:10;box-shadow:0 2px 8px rgba(0,0,0,0.06)">' +
          '<button onclick="IconShop.close()" style="width:40px;height:40px;border-radius:12px;background:#f3f4f6;border:none;font-size:20px;font-weight:900;cursor:pointer;flex-shrink:0">←</button>' +
          '<div style="flex:1">' +
            '<div style="font-size:16px;font-weight:900">Icon Shop</div>' +
            '<div style="font-size:11px;color:#999">Beli icon dengan koin</div>' +
          '</div>' +
        '</div>' +
        '<div id="iconshop-content">' + this.render() + '</div>';

      document.body.appendChild(modal);
      document.body.style.overflow = 'hidden';
    },

    close: function() {
      var modal = document.getElementById('iconshop-modal');
      if (modal) modal.remove();
      document.body.style.overflow = '';
    },
  };

  // Auto init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(function() { window.IconShop.init(); }, 500);
    });
  } else {
    setTimeout(function() { window.IconShop.init(); }, 500);
  }

  console.log('[IconShop] Loaded');
})();
