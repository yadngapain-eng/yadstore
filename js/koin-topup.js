/* ============================================
   KOIN TOPUP SYSTEM
   Bayar top up dengan koin
   1 koin = Rp 1
   ============================================ */

(function() {
  'use strict';

  console.log('[KoinTopUp] Loading...');

  window.KoinTopUp = {
    VERSION: 'v2',

    CONFIG: {
      KOIN_PER_RUPIAH: 1,  // 1 koin = Rp 1
      ENABLED: true,
    },

    // ============================================
    // HITUNG KOIN DARI HARGA (1:1)
    // ============================================
    hitungKoin: function(hargaRupiah) {
      // 1 koin = Rp 1 → koin dibutuhkan = harga rupiah
      return Math.ceil(hargaRupiah);
    },

    // ============================================
    // CEK SALDO USER
    // ============================================
    getSaldoKoin: function() {
      try {
        if (typeof Rewards !== 'undefined' && Rewards.getState) {
          return Rewards.getState().balance || 0;
        }
      } catch (e) {}

      try {
        var bal = parseFloat(localStorage.getItem('yadstore_reward_balance') || '0');
        return bal;
      } catch (e) {}

      return 0;
    },

    // ============================================
    // CEK BISA BAYAR DENGAN KOIN
    // ============================================
    bisaKoin: function(hargaRupiah) {
      var koinDibutuhkan = this.hitungKoin(hargaRupiah);
      var saldoKoin = this.getSaldoKoin();

      return {
        bisa: saldoKoin >= koinDibutuhkan,
        koinDibutuhkan: koinDibutuhkan,
        saldoKoin: saldoKoin,
        kurang: Math.max(0, koinDibutuhkan - saldoKoin),
      };
    },

    fmt: function(n) {
      try { return n.toLocaleString('id-ID'); } catch (e) { return '' + n; }
    },

    // ============================================
    // BAYAR DENGAN KOIN
    // ============================================
    bayarKoin: function(orderId, hargaRupiah) {
      var check = this.bisaKoin(hargaRupiah);

      if (!check.bisa) {
        return {
          success: false,
          reason: 'saldo_kurang',
          kurang: check.kurang,
          message: 'Koin kurang ' + this.fmt(check.kurang) + ' lagi',
        };
      }

      // Kurangi koin
      try {
        if (typeof Rewards !== 'undefined') {
          var ok = Rewards.spendCoin(
            check.koinDibutuhkan,
            '💰 Bayar top up (Order: ' + orderId + ')'
          );

          if (!ok) {
            return {
              success: false,
              reason: 'spend_failed',
              message: 'Gagal kurangi koin',
            };
          }
        } else {
          var bal = parseFloat(localStorage.getItem('yadstore_reward_balance') || '0');
          localStorage.setItem('yadstore_reward_balance', String(bal - check.koinDibutuhkan));
        }
      } catch (e) {
        return { success: false, reason: 'error', message: e.message };
      }

      console.log('[KoinTopUp] ✅ Bayar ' + check.koinDibutuhkan + ' koin untuk Rp ' + hargaRupiah);

      return {
        success: true,
        koinDipakai: check.koinDibutuhkan,
        sisaKoin: this.getSaldoKoin(),
      };
    },

    // ============================================
    // KONFIRMASI BAYAR DENGAN KOIN
    // ============================================
    confirmKoin: function(orderKey, hargaRupiah) {
      var check = this.bisaKoin(hargaRupiah);

      if (!check.bisa) {
        alert('❌ Koin tidak cukup. Kurang ' + this.fmt(check.kurang) + ' koin.');
        return;
      }

      var konfirmasi = confirm(
        '💰 Bayar dengan Koin?\n\n' +
        'Koin dipakai: ' + this.fmt(check.koinDibutuhkan) + ' koin\n' +
        'Setara: Rp ' + this.fmt(hargaRupiah) + '\n' +
        'Saldo sekarang: ' + this.fmt(check.saldoKoin) + ' koin\n' +
        'Sisa setelah bayar: ' + this.fmt(check.saldoKoin - check.koinDibutuhkan) + ' koin\n\n' +
        'Lanjutkan?'
      );

      if (!konfirmasi) return;

      var result = this.bayarKoin(orderKey, hargaRupiah);

      if (!result.success) {
        alert('❌ ' + result.message);
        return;
      }

      this.onKoinPaid(orderKey, hargaRupiah, result.koinDipakai);
    },

    // ============================================
    // KONFIRMASI BAYAR DENGAN RUPIAH
    // ============================================
    confirmRupiah: function(paymentId, hargaRupiah) {
      if (typeof TopUpUI !== 'undefined' && TopUpUI.submit) {
        TopUpUI.submit(paymentId);
      }
    },

    // ============================================
    // HANDLER SETELAH BAYAR KOIN SUKSES
    // ============================================
    onKoinPaid: function(orderKey, hargaRupiah, koinDipakai) {
      var orderId = 'YDS' + Date.now().toString(36).toUpperCase();

      var order = {
        id: orderId,
        item: (typeof TopUpUI !== 'undefined' && TopUpUI.currentItem) ? TopUpUI.currentItem.name : '-',
        itemIcon: (typeof TopUpUI !== 'undefined' && TopUpUI.currentItem) ? TopUpUI.currentItem.icon : '',
        product: (typeof TopUpUI !== 'undefined' && TopUpUI.currentProduct) ? TopUpUI.currentProduct.name : '-',
        price: hargaRupiah,
        fee: 0,
        total: hargaRupiah,
        userData: (typeof TopUpUI !== 'undefined') ? TopUpUI.userData : {},
        payment: 'Koin 🪙',
        paymentMethod: 'koin',
        koinDipakai: koinDipakai,
        status: 'success',
        proof: null,
        date: new Date().toISOString(),
        paidWithCoins: true,
      };

      // Simpan order
      try {
        if (typeof TopUpUI !== 'undefined' && TopUpUI.saveOrders) {
          var orders = TopUpUI.getOrders();
          orders.unshift(order);
          TopUpUI.saveOrders(orders);
        }
      } catch (e) {
        console.warn('[KoinTopUp] Save order error:', e);
      }

      // Kirim notif Telegram
      try {
        if (typeof window.TELEGRAM_CONFIG !== 'undefined' && window.TELEGRAM_CONFIG.ENABLED) {
          var msg = '💰 <b>ORDER BARU (KOIN)</b>\n\n' +
            '📋 ID: <code>' + orderId + '</code>\n' +
            '🎮 ' + order.item + ' - ' + order.product + '\n' +
            '💵 Total: Rp ' + hargaRupiah.toLocaleString('id-ID') + '\n' +
            '🪙 Koin dipakai: ' + koinDipakai.toLocaleString('id-ID') + '\n' +
            '🕐 ' + new Date().toLocaleString('id-ID');

          if (window.TELEGRAM_CONFIG.sendMessage) {
            window.TELEGRAM_CONFIG.sendMessage(msg).catch(function(e) {
              console.warn('[KoinTopUp] Telegram error:', e);
            });
          }
        }
      } catch (e) {}

      this.showSuccess(orderId, koinDipakai, hargaRupiah);
    },

    // ============================================
    // SHOW SUCCESS
    // ============================================
    showSuccess: function(orderId, koinDipakai, hargaRupiah) {
      var modal = document.getElementById('game-modal');
      if (!modal) return;

      modal.innerHTML = '<div class="modal-content"><div class="modal-body success-body" style="text-align:center;padding:30px 20px">' +
        '<div style="font-size:72px;margin-bottom:16px">🎉</div>' +
        '<h2 style="font-size:22px;font-weight:900;margin-bottom:8px">Pembayaran Berhasil!</h2>' +
        '<p style="font-size:14px;color:#666;margin-bottom:20px">Order ID: ' + orderId + '</p>' +

        '<div style="background:linear-gradient(135deg,#fef3c7,#fde68a);border:2px solid #f59e0b;border-radius:12px;padding:16px;margin-bottom:20px">' +
          '<div style="font-size:11px;font-weight:700;color:#78350f;text-transform:uppercase;margin-bottom:4px">Koin dipakai</div>' +
          '<div style="font-size:28px;font-weight:900;color:#92400e">🪙 ' + this.fmt(koinDipakai) + '</div>' +
          '<div style="font-size:12px;color:#78350f;margin-top:4px">= Rp ' + this.fmt(hargaRupiah) + '</div>' +
        '</div>' +

        '<div style="background:#d1fae5;border:1px solid #10b981;border-radius:10px;padding:12px;margin-bottom:20px">' +
          '<div style="font-size:12px;color:#065f46;font-weight:700">✅ Order akan diproses admin</div>' +
        '</div>' +

        '<button onclick="TopUpUI.close(); if(typeof App !== \'undefined\') App.switchTab(\'orders\')" ' +
          'style="' +
            'width:100%;' +
            'padding:14px;' +
            'background:linear-gradient(135deg,#58cc02,#89e219);' +
            'color:white;' +
            'border:none;' +
            'border-radius:12px;' +
            'font-family:inherit;' +
            'font-size:14px;' +
            'font-weight:900;' +
            'cursor:pointer;' +
            'box-shadow:0 4px 0 #46a302;' +
          '">Lihat Pesanan</button>' +
      '</div></div>';

      if (typeof Animate !== 'undefined' && Animate.confetti) {
        Animate.confetti();
      }
      if (typeof UI !== 'undefined') {
        if (UI.haptic) UI.haptic([50, 30, 50]);
        if (UI.sound) UI.sound('achievement');
      }
    },
  };

  console.log('[KoinTopUp] Loaded v2 (1 koin = Rp 1)');
})();
