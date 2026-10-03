/* ============================================
   GAME STORE — Beli Item Game dengan Koin
   Harga otomatis dari games-data.js + markup
   1 koin = Rp 1
   ============================================ */

(function() {
  'use strict';

  console.log('[GameStore] Loading...');

  window.GameStore = {
    VERSION: 'v2',

    CONFIG: {
      KOIN_PER_RUPIAH: 1,
      CACHE_TTL: 60000,  // Cache markup 60 detik
    },

    _markupCache: null,
    _markupCacheTime: 0,

    // ============================================
    // GET MARKUP DARI SERVER (Firestore)
    // ============================================
    getMarkup: function() {
      var now = Date.now();

      // Pakai cache
      if (this._markupCache !== null && (now - this._markupCacheTime) < this.CONFIG.CACHE_TTL) {
        return this._markupCache;
      }

      var markup = 0;

      // 1. Cek di localStorage dulu
      try {
        var config = JSON.parse(localStorage.getItem('learnearn_config') || '{}');
        markup = config.global_markup || 0;
      } catch (e) {}

      // 2. Cek di Firestore
      try {
        if (typeof Auth !== 'undefined' && Auth.db) {
          Auth.db.collection('config').doc('markup').get().then(function(doc) {
            if (doc.exists) {
              var data = doc.data();
              var newMarkup = data.global_markup || 0;
              try {
                localStorage.setItem('learnearn_config', JSON.stringify({ global_markup: newMarkup }));
              } catch (e) {}
            }
          }).catch(function() {});
        }
      } catch (e) {}

      // 3. Cek di prices (kalau ada harga custom)
      try {
        var prices = JSON.parse(localStorage.getItem('learnearn_prices') || '{}');
        // Prices di-set admin per product, format: { "game_id_prod_id": { final: 5000 } }
        // Kalau ada, harga final sudah include markup
      } catch (e) {}

      this._markupCache = markup;
      this._markupCacheTime = now;
      return markup;
    },

    // ============================================
    // HITUNG HARGA FINAL (Rp)
    // ============================================
    hitungHargaFinal: function(gameId, productId, hargaDasar) {
      // 1. Cek harga custom dari admin
      try {
        var prices = JSON.parse(localStorage.getItem('learnearn_prices') || '{}');
        var key = gameId + '_' + productId;
        if (prices[key] && prices[key].final) {
          return prices[key].final;
        }
      } catch (e) {}

      // 2. Hitung dari harga dasar + markup global
      var markup = this.getMarkup();
      return hargaDasar + markup;
    },

    // ============================================
    // HITUNG KOIN DARI HARGA (1:1)
    // ============================================
    hitungKoin: function(hargaFinal) {
      return Math.ceil(hargaFinal * this.CONFIG.KOIN_PER_RUPIAH);
    },

    // ============================================
    // HELPER
    // ============================================
    fmt: function(n) {
      try { return n.toLocaleString('id-ID'); } catch (e) { return '' + n; }
    },

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

    // ============================================
    // GET DAFTAR GAME DARI GLOBAL
    // ============================================
    getGames: function() {
      // Ambil dari window.GAMES (games-data.js)
      try {
        return [].concat(window.GAMES || []);
      } catch (e) {
        return [];
      }
    },

    // ============================================
    // RENDER DAFTAR GAME
    // ============================================
    renderList: function() {
      var self = this;
      var games = this.getGames();
      var saldo = this.getSaldo();

      if (games.length === 0) {
        return '<div style="padding:40px;text-align:center;color:#999">' +
          '<div style="font-size:64px;margin-bottom:12px">😅</div>' +
          '<div style="font-size:14px;font-weight:700">Game data belum termuat</div>' +
          '<div style="font-size:12px;margin-top:4px">Coba refresh halaman</div>' +
        '</div>';
      }

      var html = '' +
        '<div style="padding:16px;padding-bottom:80px">' +

          '<div style="background:linear-gradient(135deg,#7c3aed,#a855f7);border-radius:20px;padding:20px;margin-bottom:16px;color:white;box-shadow:0 12px 32px rgba(124,58,237,0.35);position:relative;overflow:hidden">' +
            '<div style="position:absolute;top:-20px;right:-20px;font-size:100px;opacity:0.15">🎮</div>' +
            '<div style="position:relative;z-index:1">' +
              '<div style="font-size:22px;font-weight:900;margin-bottom:4px">Game Store</div>' +
              '<div style="font-size:12px;opacity:0.9;margin-bottom:14px">Beli item game dengan koin</div>' +
              '<div style="background:rgba(255,255,255,0.2);border-radius:12px;padding:12px;display:flex;justify-content:space-between;align-items:center">' +
                '<div>' +
                  '<div style="font-size:10px;font-weight:700;opacity:0.9;text-transform:uppercase">Saldo Koin</div>' +
                  '<div style="font-size:22px;font-weight:900">🪙 ' + this.fmt(saldo) + '</div>' +
                '</div>' +
                '<div style="text-align:right">' +
                  '<div style="font-size:10px;font-weight:700;opacity:0.9;text-transform:uppercase">Kurs</div>' +
                  '<div style="font-size:14px;font-weight:900">1 koin = Rp 1</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +

          '<div style="font-size:16px;font-weight:900;margin-bottom:12px">🎮 Pilih Game</div>' +
          '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px">';

      games.forEach(function(game) {
        var produkCount = (game.products || []).length;
        html += '<div onclick="GameStore.openGame(\'' + game.id + '\')" ' +
          'style="background:white;border-radius:16px;padding:14px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.06);cursor:pointer">' +
          '<img src="' + game.icon + '" alt="' + game.name + '" style="width:70px;height:70px;object-fit:contain;margin-bottom:8px">' +
          '<div style="font-size:13px;font-weight:900;margin-bottom:2px;line-height:1.3">' + self.esc(game.name) + '</div>' +
          '<div style="font-size:10px;color:#999;font-weight:700">' + produkCount + ' produk</div>' +
        '</div>';
      });

      html += '</div></div>';
      return html;
    },

    esc: function(s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    },

    // ============================================
    // BUKA DETAIL GAME
    // ============================================
    openGame: function(gameId) {
      var self = this;
      var games = this.getGames();
      var game = games.find(function(g) { return g.id === gameId; });
      if (!game) return;

      var saldo = this.getSaldo();
      var content = document.getElementById('gamestore-content');
      if (!content) return;

      var html = '' +
        '<div style="padding:16px;padding-bottom:80px">' +

          '<div style="background:linear-gradient(135deg,#7c3aed,#a855f7);border-radius:16px;padding:14px;margin-bottom:16px;color:white;display:flex;justify-content:space-between;align-items:center">' +
            '<div>' +
              '<div style="font-size:10px;font-weight:700;opacity:0.9;text-transform:uppercase">Saldo Koin</div>' +
              '<div style="font-size:20px;font-weight:900">🪙 ' + this.fmt(saldo) + '</div>' +
            '</div>' +
            '<div style="text-align:right">' +
              '<div style="font-size:10px;opacity:0.9">1 koin = Rp 1</div>' +
            '</div>' +
          '</div>' +

          '<div style="background:white;border-radius:16px;padding:16px;margin-bottom:16px;text-align:center">' +
            '<img src="' + game.icon + '" alt="' + game.name + '" style="width:80px;height:80px;object-fit:contain;margin-bottom:12px">' +
            '<div style="font-size:18px;font-weight:900;margin-bottom:4px">' + this.esc(game.name) + '</div>' +
            '<div style="font-size:12px;color:#666">' + this.esc(game.desc || '') + '</div>' +
          '</div>';

      // FORM DATA AKUN
      if (game.fields && game.fields.length > 0) {
        html += '<div style="background:white;border-radius:16px;padding:16px;margin-bottom:16px">' +
          '<div style="font-size:14px;font-weight:900;margin-bottom:12px">📝 Data Akun</div>';

        game.fields.forEach(function(field) {
          html += '<div style="margin-bottom:12px">' +
            '<label style="display:block;font-size:12px;font-weight:800;margin-bottom:6px">' + self.esc(field.label) + '</label>' +
            '<input type="text" id="gs-field-' + field.id + '" placeholder="' + self.esc(field.placeholder) + '" ' +
              'style="width:100%;padding:12px;border:2px solid #e5e5e5;border-radius:10px;font-family:inherit;font-size:14px;font-weight:700;outline:none;box-sizing:border-box">' +
          '</div>';
        });

        html += '</div>';
      }

      // LIST PRODUK
      html += '<div style="background:white;border-radius:16px;padding:16px">' +
        '<div style="font-size:14px;font-weight:900;margin-bottom:12px">💎 Pilih Produk</div>';

      (game.products || []).forEach(function(product) {
        var hargaFinal = self.hitungHargaFinal(game.id, product.id, product.price);
        var koin = self.hitungKoin(hargaFinal);
        var bisa = saldo >= koin;
        var btnColor = bisa ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : '#e5e5e5';
        var btnTextColor = bisa ? 'white' : '#999';

        html += '<div style="border:2px solid ' + (bisa ? '#e5e5e5' : '#f0f0f0') + ';border-radius:12px;padding:12px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;gap:12px;' + (bisa ? '' : 'opacity:0.6;') + '">' +
          '<div style="flex:1;min-width:0">' +
            '<div style="font-size:14px;font-weight:900;margin-bottom:2px">' + self.esc(product.name) + '</div>' +
            (product.bonus ? '<div style="font-size:11px;color:#10b981;font-weight:800">+' + self.esc(product.bonus) + '</div>' : '') +
            '<div style="font-size:11px;color:#999;margin-top:2px">Rp ' + self.fmt(hargaFinal) + '</div>' +
          '</div>' +
          '<button ' + (bisa ? '' : 'disabled') + ' ' +
            'onclick="GameStore.beli(\'' + game.id + '\', \'' + product.id + '\')" ' +
            'style="padding:10px 14px;background:' + btnColor + ';color:' + btnTextColor + ';border:none;border-radius:10px;font-family:inherit;font-size:12px;font-weight:900;cursor:' + (bisa ? 'pointer' : 'not-allowed') + ';white-space:nowrap">' +
            (bisa ? '🪙 ' + self.fmt(koin) : '🔒 ' + self.fmt(koin)) +
          '</button>' +
        '</div>';
      });

      html += '</div>';

      html += '<button onclick="GameStore.open()" style="width:100%;padding:12px;background:#f0f0f0;color:#666;border:none;border-radius:10px;font-family:inherit;font-size:13px;font-weight:900;cursor:pointer;margin-top:16px">' +
        '← Kembali ke Daftar Game' +
      '</button>';

      html += '</div>';

      content.innerHTML = html;
    },

    // ============================================
    // BELI PRODUK
    // ============================================
    beli: function(gameId, productId) {
      var self = this;
      var games = this.getGames();
      var game = games.find(function(g) { return g.id === gameId; });
      if (!game) return;

      var product = (game.products || []).find(function(p) { return p.id === productId; });
      if (!product) return;

      var hargaFinal = this.hitungHargaFinal(game.id, product.id, product.price);
      var koin = this.hitungKoin(hargaFinal);

      // Validasi form
      var userData = {};
      if (game.fields && game.fields.length > 0) {
        for (var i = 0; i < game.fields.length; i++) {
          var field = game.fields[i];
          var el = document.getElementById('gs-field-' + field.id);
          var val = el ? el.value.trim() : '';
          if (!val) {
            if (typeof Animate !== 'undefined') {
              Animate.toast('Isi ' + field.label + ' dulu!', 'error');
            } else {
              alert('Isi ' + field.label + ' dulu!');
            }
            return;
          }
          userData[field.id] = val;
        }
      }

      // Cek saldo
      var saldo = this.getSaldo();
      if (saldo < koin) {
        var kurang = koin - saldo;
        if (typeof Animate !== 'undefined') {
          Animate.toast('Koin kurang ' + this.fmt(kurang), 'error');
        } else {
          alert('Koin kurang ' + this.fmt(kurang));
        }
        return;
      }

      // Konfirmasi
      var konfirmasi = confirm(
        '🎮 Beli dengan Koin?\n\n' +
        'Game: ' + game.name + '\n' +
        'Produk: ' + product.name + '\n' +
        'Harga: Rp ' + this.fmt(hargaFinal) + '\n' +
        'Koin: 🪙 ' + this.fmt(koin) + '\n' +
        'Saldo: 🪙 ' + this.fmt(saldo) + '\n' +
        'Sisa: 🪙 ' + this.fmt(saldo - koin) + '\n\n' +
        'Lanjutkan?'
      );

      if (!konfirmasi) return;

      // Kurangi koin
      try {
        if (typeof Rewards !== 'undefined' && Rewards.spendCoin) {
          var ok = Rewards.spendCoin(koin, '🎮 ' + game.name + ' - ' + product.name);
          if (!ok) {
            alert('Gagal kurangi koin');
            return;
          }
        } else {
          var bal = parseFloat(localStorage.getItem('yadstore_reward_balance') || '0');
          localStorage.setItem('yadstore_reward_balance', String(bal - koin));
        }
      } catch (e) {
        alert('Error: ' + e.message);
        return;
      }

      // Simpan order
      var orderId = 'GS' + Date.now().toString(36).toUpperCase();
      var order = {
        id: orderId,
        item: game.name,
        itemIcon: game.icon,
        product: product.name,
        price: hargaFinal,
        fee: 0,
        total: hargaFinal,
        userData: userData,
        payment: 'Koin 🪙',
        paymentMethod: 'koin',
        koinDipakai: koin,
        status: 'success',
        proof: null,
        date: new Date().toISOString(),
        paidWithCoins: true,
        source: 'game-store',
      };

      try {
        if (typeof TopUpUI !== 'undefined' && TopUpUI.saveOrders) {
          var orders = TopUpUI.getOrders();
          orders.unshift(order);
          TopUpUI.saveOrders(orders);
        } else {
          var orders2 = JSON.parse(localStorage.getItem('learnearn_orders') || '[]');
          orders2.unshift(order);
          localStorage.setItem('learnearn_orders', JSON.stringify(orders2));
        }
      } catch (e) {
        console.warn('[GameStore] Save order error:', e);
      }

      // Notif Telegram
      try {
        if (typeof window.TELEGRAM_CONFIG !== 'undefined' && window.TELEGRAM_CONFIG.ENABLED) {
          var msg = '🎮 <b>ORDER GAME STORE</b>\n\n' +
            '📋 ID: <code>' + orderId + '</code>\n' +
            '🎮 ' + game.name + ' - ' + product.name + '\n' +
            '💰 Rp ' + this.fmt(hargaFinal) + '\n' +
            '🪙 Koin: ' + this.fmt(koin) + '\n';

          if (Object.keys(userData).length > 0) {
            msg += '\n👤 Data Akun:\n';
            Object.keys(userData).forEach(function(k) {
              msg += '  • ' + k + ': <code>' + userData[k] + '</code>\n';
            });
          }

          msg += '\n🕐 ' + new Date().toLocaleString('id-ID');

          if (window.TELEGRAM_CONFIG.sendMessage) {
            window.TELEGRAM_CONFIG.sendMessage(msg).catch(function() {});
          }
        }
      } catch (e) {}

      this.showSuccess(orderId, product, game, hargaFinal, koin);
    },

    // ============================================
    // SHOW SUCCESS
    // ============================================
    showSuccess: function(orderId, product, game, hargaFinal, koin) {
      var content = document.getElementById('gamestore-content');
      if (!content) return;

      content.innerHTML = '' +
        '<div style="padding:40px 20px;text-align:center">' +
          '<div style="font-size:80px;margin-bottom:16px">🎉</div>' +
          '<div style="font-size:22px;font-weight:900;margin-bottom:8px">Berhasil!</div>' +
          '<div style="font-size:13px;color:#666;margin-bottom:20px">Order ID: ' + orderId + '</div>' +

          '<div style="background:linear-gradient(135deg,#fef3c7,#fde68a);border:2px solid #f59e0b;border-radius:16px;padding:16px;margin-bottom:20px">' +
            '<div style="font-size:12px;color:#78350f;margin-bottom:6px">' + this.esc(game.name) + '</div>' +
            '<div style="font-size:16px;font-weight:900;color:#92400e;margin-bottom:8px">' + this.esc(product.name) + '</div>' +
            '<div style="font-size:24px;font-weight:900;color:#92400e">🪙 ' + this.fmt(koin) + '</div>' +
            '<div style="font-size:11px;color:#78350f;margin-top:4px">= Rp ' + this.fmt(hargaFinal) + '</div>' +
          '</div>' +

          '<div style="background:#d1fae5;border:1px solid #10b981;border-radius:12px;padding:12px;margin-bottom:20px">' +
            '<div style="font-size:12px;color:#065f46;font-weight:700">✅ Order akan diproses admin</div>' +
          '</div>' +

          '<button onclick="GameStore.open()" style="width:100%;padding:14px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:white;border:none;border-radius:12px;font-family:inherit;font-size:14px;font-weight:900;cursor:pointer;margin-bottom:8px">' +
            '🛒 Beli Lagi' +
          '</button>' +
          '<button onclick="GameStore.close()" style="width:100%;padding:14px;background:#f0f0f0;color:#666;border:none;border-radius:12px;font-family:inherit;font-size:14px;font-weight:900;cursor:pointer">' +
            '✕ Tutup' +
          '</button>' +
        '</div>';

      if (typeof Animate !== 'undefined' && Animate.confetti) Animate.confetti();
      if (typeof UI !== 'undefined') {
        if (UI.haptic) UI.haptic([50, 30, 50]);
        if (UI.sound) UI.sound('achievement');
      }
    },

    // ============================================
    // OPEN MODAL
    // ============================================
    open: function() {
      var existing = document.getElementById('gamestore-modal');
      if (existing) existing.remove();

      var modal = document.createElement('div');
      modal.id = 'gamestore-modal';
      modal.style.cssText = 'position:fixed;inset:0;background:#f7f8fa;z-index:9998;overflow-y:auto';

      modal.innerHTML = '' +
        '<div style="background:white;border-bottom:1.5px solid #e5e5e5;padding:12px 16px;display:flex;align-items:center;gap:12px;position:sticky;top:0;z-index:10;box-shadow:0 2px 8px rgba(0,0,0,0.06)">' +
          '<button onclick="GameStore.close()" style="width:40px;height:40px;border-radius:12px;background:#f3f4f6;border:none;font-size:20px;font-weight:900;cursor:pointer;flex-shrink:0">←</button>' +
          '<div style="flex:1">' +
            '<div style="font-size:16px;font-weight:900">Game Store</div>' +
            '<div style="font-size:11px;color:#999">Beli item game dengan koin</div>' +
          '</div>' +
        '</div>' +
        '<div id="gamestore-content">' + this.renderList() + '</div>';

      document.body.appendChild(modal);
      document.body.style.overflow = 'hidden';
    },

    close: function() {
      var modal = document.getElementById('gamestore-modal');
      if (modal) modal.remove();
      document.body.style.overflow = '';
    },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(function() { window.GameStore.init && window.GameStore.init(); }, 500);
    });
  }

  console.log('[GameStore] Loaded v2');
})();
