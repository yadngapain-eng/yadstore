/* ============================================
   KOIN TOPUP SYSTEM
   Bayar top up dengan koin
   100 koin = Rp 1
   ============================================ */

(function() {
  'use strict';

  console.log('[KoinTopUp] Loading...');

  window.KoinTopUp = {
    VERSION: 'v1',
    
    CONFIG: {
      KOIN_PER_RUPIAH: 100,
      ENABLED: true,
    },
    
    // ============================================
    // HITUNG KOIN DARI HARGA
    // ============================================
    hitungKoin: function(hargaRupiah) {
      return Math.ceil(hargaRupiah * this.CONFIG.KOIN_PER_RUPIAH);
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
    
    // ============================================
    // FORMAT ANGKA
    // ============================================
    fmt: function(n) {
      try {
        return n.toLocaleString('id-ID');
      } catch (e) {
        return '' + n;
      }
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
          // Rewards.spendCoin return boolean
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
          // Fallback: kurangi localStorage langsung
          var bal = parseFloat(localStorage.getItem('yadstore_reward_balance') || '0');
          localStorage.setItem('yadstore_reward_balance', String(bal - check.koinDibutuhkan));
        }
      } catch (e) {
        console.error('[KoinTopUp] Error:', e);
        return {
          success: false,
          reason: 'error',
          message: e.message,
        };
      }
      
      console.log('[KoinTopUp] ✅ Bayar berhasil dengan ' + check.koinDibutuhkan + ' koin');
      
      return {
        success: true,
        koinDipakai: check.koinDibutuhkan,
        sisaKoin: this.getSaldoKoin(),
      };
    },
    
    // ============================================
    // RENDER PAYMENT OPTIONS UNTUK MODAL
    // ============================================
    renderPaymentOptions: function(hargaRupiah, itemName, productName) {
      var check = this.bisaKoin(hargaRupiah);
      var saldo = this.getSaldoKoin();
      
      var koinDisabled = !check.bisa;
      var koinOpacity = koinDisabled ? '0.5' : '1';
      var koinCursor = koinDisabled ? 'not-allowed' : 'pointer';
      
      var html = '';
      
      // ===== HEADER =====
      html += '<div style="margin-bottom:16px">' +
        '<h3 style="font-size:15px;font-weight:900;margin-bottom:4px">Pilih Metode Pembayaran</h3>' +
        '<p style="font-size:12px;color:#666">Pilih bayar dengan Rupiah atau Koin</p>' +
      '</div>';
      
      // ===== INFO SALDO KOIN =====
      html += '<div style="background:linear-gradient(135deg,#fef3c7,#fde68a);border:2px solid #f59e0b;border-radius:12px;padding:12px;margin-bottom:16px">' +
        '<div style="display:flex;justify-content:space-between;align-items:center">' +
          '<div>' +
            '<div style="font-size:11px;font-weight:700;color:#78350f;text-transform:uppercase">Saldo Koin Kamu</div>' +
            '<div style="font-size:20px;font-weight:900;color:#92400e">🪙 ' + this.fmt(saldo) + '</div>' +
            '<div style="font-size:11px;color:#78350f">= Rp ' + this.fmt(Math.floor(saldo / this.CONFIG.KOIN_PER_RUPIAH)) + '</div>' +
          '</div>' +
          '<div style="font-size:32px">🪙</div>' +
        '</div>' +
      '</div>';
      
      // ===== BAYAR DENGAN KOIN =====
      html += '<div style="margin-bottom:12px">' +
        '<div style="font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:0.5px;color:#f59e0b;margin-bottom:8px">💰 Bayar dengan Koin</div>' +
        '<button ' +
          'onclick="KoinTopUp.confirmKoin('' + orderId_safe(itemName + '_' + productName) + '', ' + hargaRupiah + ')" ' +
          'style="' +
            'width:100%;' +
            'padding:16px;' +
            'background:linear-gradient(135deg,#fbbf24,#f59e0b);' +
            'color:white;' +
            'border:none;' +
            'border-radius:12px;' +
            'font-family:inherit;' +
            'font-size:14px;' +
            'font-weight:900;' +
            'cursor:' + koinCursor + ';' +
            'box-shadow:0 4px 0 #b45309;' +
            'opacity:' + koinOpacity + ';' +
            'text-align:left;' +
            'display:flex;justify-content:space-between;align-items:center;' +
          '" ' +
          (koinDisabled ? 'disabled' : '') +
        '>' +
          '<div>' +
            '<div style="font-size:15px;font-weight:900">🪙 Bayar ' + this.fmt(check.koinDibutuhkan) + ' koin</div>' +
            '<div style="font-size:11px;opacity:0.9;margin-top:2px">= Rp ' + this.fmt(hargaRupiah) + '</div>' +
            (koinDisabled ? 
              '<div style="font-size:11px;color:#ffe4e1;margin-top:4px;font-weight:800">❌ Kurang ' + this.fmt(check.kurang) + ' koin</div>' 
              : '<div style="font-size:11px;color:#d1fae5;margin-top:4px;font-weight:800">✅ Saldo cukup</div>') +
          '</div>' +
          '<div style="font-size:24px">' + (koinDisabled ? '🔒' : '✅') + '</div>' +
        '</button>' +
      '</div>';
      
      // ===== BAYAR DENGAN RUPIAH =====
      html += '<div style="margin-bottom:12px">' +
        '<div style="font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:0.5px;color:#1cb0f6;margin-bottom:8px">💵 Bayar dengan Rupiah</div>';
      
      // Payment methods (dari PAYMENTS global)
      if (typeof PAYMENTS !== 'undefined' && PAYMENTS.length > 0) {
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">';
        PAYMENTS.forEach(function(pay) {
          html += '<button ' +
            'onclick="KoinTopUp.confirmRupiah('' + pay.id + '', ' + hargaRupiah + ')" ' +
            'style="' +
              'padding:12px;' +
              'background:white;' +
              'border:2px solid #e5e5e5;' +
              'border-radius:10px;' +
              'font-family:inherit;' +
              'font-size:13px;' +
              'font-weight:900;' +
              'cursor:pointer;' +
              'text-align:left;' +
            '">' +
              '<div style="font-size:14px;font-weight:900">' + pay.name + '</div>' +
              '<div style="font-size:10px;color:#999;margin-top:2px">' + (pay.fee > 0 ? '+Rp ' + pay.fee : 'Gratis') + '</div>' +
            '</button>';
        });
        html += '</div>';
      } else {
        html += '<div style="color:#999;font-size:12px">Metode pembayaran tidak tersedia</div>';
      }
      
      html += '</div>';
      
      // ===== INFO =====
      html += '<div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:10px;padding:10px;margin-top:12px">' +
        '<div style="font-size:11px;color:#0369a1;line-height:1.5">' +
          '<strong>ℹ️ Info:</strong><br>' +
          '• Bayar dengan koin = instan (tidak perlu upload bukti)<br>' +
          '• Bayar dengan Rupiah = perlu upload bukti transfer<br>' +
          '• Kurs: 100 koin = Rp 1' +
        '</div>' +
      '</div>';
      
      return html;
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
      
      // Proses bayar
      var result = this.bayarKoin(orderKey, hargaRupiah);
      
      if (!result.success) {
        alert('❌ ' + result.message);
        return;
      }
      
      // Sukses — panggil handler dari TopUpUI
      this.onKoinPaid(orderKey, hargaRupiah, result.koinDipakai);
    },
    
    // ============================================
    // KONFIRMASI BAYAR DENGAN RUPIAH
    // ============================================
    confirmRupiah: function(paymentId, hargaRupiah) {
      // Panggil metode yang ada di TopUpUI
      if (typeof TopUpUI !== 'undefined' && TopUpUI.submit) {
        // Backup: panggil ulang topup flow dengan paymentId
        TopUpUI.submit(paymentId);
      }
    },
    
    // ============================================
    // HANDLER SETELAH BAYAR KOIN SUKSES
    // ============================================
    onKoinPaid: function(orderKey, hargaRupiah, koinDipakai) {
      // Buat order object
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
        status: 'success',  // Langsung sukses karena bayar koin
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
      
      // Tutup modal & tampilkan sukses
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
        
        '<button onclick="TopUpUI.close(); if(typeof App !== 'undefined') App.switchTab('orders')" ' +
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
      
      // Confetti
      if (typeof Animate !== 'undefined' && Animate.confetti) {
        Animate.confetti();
      }
      if (typeof UI !== 'undefined') {
        if (UI.haptic) UI.haptic([50, 30, 50]);
        if (UI.sound) UI.sound('achievement');
      }
    },
  };
  
  // Helper
  function orderId_safe(s) {
    return String(s).replace(/[^a-z0-9]/gi, '_').toLowerCase();
  }

  console.log('[KoinTopUp] Loaded');
})();
