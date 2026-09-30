
/* ============================================
   ADMIN KONFIRMASI — ORDER & WITHDRAW
   ============================================ */
(function() {
  'use strict';

  window.AdminKonfirmasi = window.AdminKonfirmasi || {};

  var Confirm = AdminKonfirmasi;

  /* ============================================
     1. RENDER KONFIRMASI ORDERS
     ============================================ */
  Confirm.renderOrders = async function(container) {
    container.innerHTML = '<div class="loading-inline">Memuat pesanan...</div>';

    try {
      // Ambil dari collection global 'orders'
      var snap = await Admin.db.collection('orders')
        .orderBy('date', 'desc')
        .limit(200)
        .get();

      var orders = snap.docs.map(function(d) {
        return Object.assign({ _id: d.id }, d.data());
      });

      // Filter stats
      var stats = {
        all: orders.length,
        pending: orders.filter(function(o) { return o.status === 'pending'; }).length,
        processing: orders.filter(function(o) { return o.status === 'processing'; }).length,
        success: orders.filter(function(o) { return o.status === 'success' || o.status === 'completed'; }).length,
        failed: orders.filter(function(o) { return o.status === 'failed' || o.status === 'cancelled'; }).length,
      };

      var html = '';

      // ===== HEADER =====
      html += '<div style="background:linear-gradient(135deg,#1f2937,#111827);color:white;padding:20px;border-radius:16px;margin-bottom:16px">';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:16px">';
      html += '<div>';
      html += '<div style="font-size:20px;font-weight:900;margin-bottom:4px">📦 Konfirmasi Pesanan</div>';
      html += '<div style="font-size:12px;color:#9ca3af">Kelola & konfirmasi pesanan user</div>';
      html += '</div>';
      html += '</div>';

      // ===== STATS =====
      html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(90px,1fr));gap:10px">';
      html += Confirm.statCard('📊', stats.all, 'Total', '#9ca3af');
      html += Confirm.statCard('⏳', stats.pending, 'Pending', '#f59e0b');
      html += Confirm.statCard('🔄', stats.processing, 'Proses', '#3b82f6');
      html += Confirm.statCard('✅', stats.success, 'Sukses', '#58cc02');
      html += Confirm.statCard('❌', stats.failed, 'Gagal', '#ef4444');
      html += '</div>';
      html += '</div>';

      // ===== FILTER TABS =====
      html += '<div style="display:flex;gap:8px;margin-bottom:16px;overflow-x:auto;padding-bottom:6px">';
      html += Confirm.filterTab('all', '🎯 Semua', stats.all);
      html += Confirm.filterTab('pending', '⏳ Pending', stats.pending);
      html += Confirm.filterTab('processing', '🔄 Proses', stats.processing);
      html += Confirm.filterTab('success', '✅ Sukses', stats.success);
      html += Confirm.filterTab('failed', '❌ Gagal', stats.failed);
      html += '</div>';

      // ===== ORDERS LIST =====
      if (orders.length === 0) {
        html += '<div class="card" style="text-align:center;padding:60px 20px">';
        html += '<div style="font-size:60px;margin-bottom:12px">📭</div>';
        html += '<div style="font-size:14px;font-weight:800;color:#666">Belum ada pesanan</div>';
        html += '<div style="font-size:12px;color:#999;margin-top:4px">Pesanan dari user akan muncul di sini</div>';
        html += '</div>';
      } else {
        // Sort: pending & processing dulu
        orders.sort(function(a, b) {
          var priority = { pending: 0, processing: 1, success: 2, failed: 3, cancelled: 3 };
          var pa = priority[a.status] !== undefined ? priority[a.status] : 2;
          var pb = priority[b.status] !== undefined ? priority[b.status] : 2;
          return pa - pb;
        });

        html += '<div style="display:flex;flex-direction:column;gap:12px">';
        orders.forEach(function(order, i) {
          html += Confirm.renderOrderCard(order, i);
        });
        html += '</div>';
      }

      container.innerHTML = html;
      Confirm._currentOrders = orders;

    } catch (e) {
      console.error('[AdminKonfirmasi] renderOrders error:', e);
      container.innerHTML = '<div class="card"><p style="color:red">❌ Error: ' + e.message + '</p>' +
        '<p style="font-size:12px;color:#666;margin-top:8px">Cek Firestore Rules — pastikan admin punya akses ke collection orders.</p>' +
        '</div>';
    }
  };

  /* ============================================
     2. RENDER ORDER CARD
     ============================================ */
  Confirm.renderOrderCard = function(order, index) {
    var statusColors = {
      pending: { bg: '#fff7e0', color: '#b07800', label: '⏳ Pending' },
      processing: { bg: '#e8f6ff', color: '#1cb0f6', label: '🔄 Diproses' },
      success: { bg: '#d7ffb8', color: '#46a302', label: '✅ Sukses' },
      completed: { bg: '#d7ffb8', color: '#46a302', label: '✅ Sukses' },
      failed: { bg: '#ffdfe0', color: '#ff4b4b', label: '❌ Gagal' },
      cancelled: { bg: '#ffdfe0', color: '#ff4b4b', label: '❌ Dibatalkan' },
    };
    var sc = statusColors[order.status] || statusColors.pending;

    var date = order.date ? new Date(order.date).toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }) : '-';

    // User data
    var userDataStr = '';
    if (order.userData) {
      var keys = Object.keys(order.userData);
      userDataStr = keys.map(function(k) {
        return '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px dashed #e5e5e5;font-size:12px">' +
          '<span style="color:#666;font-weight:600">' + k + '</span>' +
          '<strong>' + order.userData[k] + '</strong>' +
        '</div>';
      }).join('');
    }

    var html = '<div class="card" style="padding:16px;border-left:4px solid ' + sc.color + '">';

    // Header
    html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:12px">';
    html += '<div style="flex:1;min-width:0">';
    html += '<div style="font-size:14px;font-weight:900;color:#1a1a1a;margin-bottom:2px">' + (order.item || 'Order') + ' → ' + (order.product || '-') + '</div>';
    html += '<div style="font-size:11px;color:#999;font-family:monospace">' + (order.id || order._id) + '</div>';
    html += '</div>';
    html += '<span style="background:' + sc.bg + ';color:' + sc.color + ';padding:4px 10px;border-radius:999px;font-size:10px;font-weight:900;white-space:nowrap">' + sc.label + '</span>';
    html += '</div>';

    // Info
    html += '<div style="background:#f8f9fa;border-radius:10px;padding:12px;margin-bottom:12px">';
    html += '<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:12px"><span style="color:#666">📅 Tanggal</span><strong>' + date + '</strong></div>';
    html += '<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:12px"><span style="color:#666">💰 Total</span><strong style="color:#58cc02">Rp ' + (order.total || 0).toLocaleString('id-ID') + '</strong></div>';
    html += '<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:12px"><span style="color:#666">💳 Metode</span><strong>' + (order.payment || '-') + '</strong></div>';
    html += '</div>';

    // User data
    if (userDataStr) {
      html += '<div style="margin-bottom:12px">';
      html += '<div style="font-size:11px;font-weight:900;color:#999;margin-bottom:6px;text-transform:uppercase">👤 Data User</div>';
      html += '<div style="background:#fff9e6;border-radius:10px;padding:10px">' + userDataStr + '</div>';
      html += '</div>';
    }

    // Bukti transfer (kalau ada)
    if (order.proof) {
      html += '<div style="margin-bottom:12px">';
      html += '<div style="font-size:11px;font-weight:900;color:#999;margin-bottom:6px;text-transform:uppercase">📸 Bukti Transfer</div>';
      html += '<img src="' + order.proof + '" style="width:100%;max-height:300px;object-fit:contain;border-radius:10px;background:#f8f9fa;cursor:pointer" onclick="window.open(this.src, \'_blank\')">';
      html += '</div>';
    }

    // Actions
    if (order.status === 'pending' || order.status === 'processing') {
      html += '<div style="display:flex;gap:8px;flex-wrap:wrap">';
      html += '<button onclick="AdminKonfirmasi.approveOrder(\'' + order._id + '\')" style="flex:1;min-width:120px;padding:12px;background:linear-gradient(135deg,#58cc02,#89e219);color:white;border:none;border-radius:10px;font-family:inherit;font-weight:900;font-size:13px;cursor:pointer">✅ Konfirmasi</button>';
      html += '<button onclick="AdminKonfirmasi.rejectOrder(\'' + order._id + '\')" style="flex:1;min-width:120px;padding:12px;background:linear-gradient(135deg,#ff4b4b,#ea2b2b);color:white;border:none;border-radius:10px;font-family:inherit;font-weight:900;font-size:13px;cursor:pointer">❌ Tolak</button>';
      html += '<button onclick="AdminKonfirmasi.deleteOrder(\'' + order._id + '\')" style="padding:12px 16px;background:#f3f4f6;color:#666;border:none;border-radius:10px;font-family:inherit;font-weight:900;font-size:13px;cursor:pointer">🗑️</button>';
      html += '</div>';
    } else {
      html += '<div style="display:flex;gap:8px;flex-wrap:wrap">';
      html += '<button onclick="AdminKonfirmasi.changeStatus(\'' + order._id + '\')" style="flex:1;padding:10px;background:#f3f4f6;color:#666;border:none;border-radius:10px;font-family:inherit;font-weight:800;font-size:12px;cursor:pointer">🔄 Ubah Status</button>';
      html += '<button onclick="AdminKonfirmasi.deleteOrder(\'' + order._id + '\')" style="padding:10px 16px;background:#f3f4f6;color:#666;border:none;border-radius:10px;font-family:inherit;font-weight:800;font-size:12px;cursor:pointer">🗑️</button>';
      html += '</div>';
    }

    html += '</div>';
    return html;
  };

  /* ============================================
     3. APPROVE ORDER
     ============================================ */
  Confirm.approveOrder = async function(orderId) {
    var notes = prompt('📝 Catatan (opsional):\nContoh: "Diamond sudah masuk ke akun"', 'Order berhasil diproses');
    if (notes === null) return;

    try {
      await Admin.db.collection('orders').doc(orderId).update({
        status: 'success',
        approvedAt: new Date().toISOString(),
        approvedBy: Admin.user.email,
        adminNotes: notes || 'Order berhasil diproses',
        updatedAt: new Date().toISOString(),
      });

      // Log ke admin log
      if (typeof AdminLog !== 'undefined') {
        AdminLog.log('info', 'admin.confirm', '✅ Order approved: ' + orderId);
      }

      // Notif Telegram ke user
      Confirm.notifyUserOrder(orderId, 'success', notes);

      alert('✅ Order dikonfirmasi!');
      Confirm.refreshCurrentView();
    } catch (e) {
      alert('❌ Error: ' + e.message);
    }
  };

  /* ============================================
     4. REJECT ORDER
     ============================================ */
  Confirm.rejectOrder = async function(orderId) {
    var reason = prompt('❌ Alasan penolakan:\nContoh: "Bukti transfer tidak valid"', 'Bukti transfer tidak valid');
    if (reason === null) return;

    try {
      await Admin.db.collection('orders').doc(orderId).update({
        status: 'failed',
        rejectedAt: new Date().toISOString(),
        rejectedBy: Admin.user.email,
        adminNotes: reason || 'Order ditolak',
        updatedAt: new Date().toISOString(),
      });

      if (typeof AdminLog !== 'undefined') {
        AdminLog.log('warn', 'admin.confirm', '❌ Order rejected: ' + orderId + ' — ' + reason);
      }

      Confirm.notifyUserOrder(orderId, 'failed', reason);

      alert('❌ Order ditolak!');
      Confirm.refreshCurrentView();
    } catch (e) {
      alert('❌ Error: ' + e.message);
    }
  };

  /* ============================================
     5. CHANGE STATUS (manual)
     ============================================ */
  Confirm.changeStatus = async function(orderId) {
    var status = prompt('🔄 Ubah status ke:\n(pending/processing/success/failed)', 'processing');
    if (!status) return;

    var valid = ['pending', 'processing', 'success', 'failed'];
    if (valid.indexOf(status) === -1) {
      alert('❌ Status tidak valid. Pilih: ' + valid.join(', '));
      return;
    }

    try {
      await Admin.db.collection('orders').doc(orderId).update({
        status: status,
        updatedAt: new Date().toISOString(),
        updatedBy: Admin.user.email,
      });

      alert('✅ Status diubah ke: ' + status);
      Confirm.refreshCurrentView();
    } catch (e) {
      alert('❌ Error: ' + e.message);
    }
  };

  /* ============================================
     6. DELETE ORDER
     ============================================ */
  Confirm.deleteOrder = async function(orderId) {
    if (!confirm('🗑️ Hapus order ini? Tidak bisa dibatalkan.')) return;

    try {
      await Admin.db.collection('orders').doc(orderId).delete();

      if (typeof AdminLog !== 'undefined') {
        AdminLog.log('warn', 'admin.delete', '🗑️ Order deleted: ' + orderId);
      }

      alert('✅ Order dihapus!');
      Confirm.refreshCurrentView();
    } catch (e) {
      alert('❌ Error: ' + e.message);
    }
  };

  /* ============================================
     7. NOTIFIKASI USER VIA TELEGRAM
     ============================================ */
  Confirm.notifyUserOrder = async function(orderId, status, notes) {
    try {
      var orderDoc = await Admin.db.collection('orders').doc(orderId).get();
      if (!orderDoc.exists) return;

      var order = orderDoc.data();
      var emoji = status === 'success' ? '✅' : '❌';
      var title = status === 'success' ? 'PESANAN SUKSES' : 'PESANAN DITOLAK';

      var text = emoji + ' <b>' + title + '</b>\n\n' +
        '📋 ID: <code>' + (order.id || orderId) + '</code>\n' +
        '🎮 Item: ' + (order.item || '-') + ' → ' + (order.product || '-') + '\n' +
        '💰 Total: Rp ' + (order.total || 0).toLocaleString('id-ID') + '\n\n' +
        '📝 Catatan: ' + (notes || '-') + '\n\n' +
        '🕐 ' + new Date().toLocaleString('id-ID');

      if (typeof TELEGRAM_CONFIG !== 'undefined' && TELEGRAM_CONFIG.sendMessage) {
        TELEGRAM_CONFIG.sendMessage(text);
      }
    } catch (e) {
      console.warn('[Confirm] notify error:', e);
    }
  };

  /* ============================================
     8. RENDER KONFIRMASI WITHDRAW
     ============================================ */
  Confirm.renderWithdrawals = async function(container) {
    container.innerHTML = '<div class="loading-inline">Memuat withdraw...</div>';

    try {
      var snap = await Admin.db.collection('withdrawals')
        .orderBy('createdAt', 'desc')
        .limit(200)
        .get();

      var wds = snap.docs.map(function(d) {
        return Object.assign({ _id: d.id }, d.data());
      });

      var stats = {
        all: wds.length,
        pending: wds.filter(function(w) { return w.status === 'pending'; }).length,
        approved: wds.filter(function(w) { return w.status === 'approved'; }).length,
        rejected: wds.filter(function(w) { return w.status === 'rejected'; }).length,
        totalPending: wds.filter(function(w) { return w.status === 'pending'; })
          .reduce(function(s, w) { return s + (w.amount || 0); }, 0),
      };

      var html = '';

      // Header
      html += '<div style="background:linear-gradient(135deg,#7c3aed,#a855f7);color:white;padding:20px;border-radius:16px;margin-bottom:16px">';
      html += '<div style="font-size:20px;font-weight:900;margin-bottom:4px">💸 Konfirmasi Withdraw</div>';
      html += '<div style="font-size:12px;opacity:0.9">Kelola permintaan withdraw user</div>';
      html += '</div>';

      // Stats
      html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(90px,1fr));gap:10px;margin-bottom:16px">';
      html += '<div class="card" style="text-align:center"><div style="font-size:18px;font-weight:900">' + stats.all + '</div><div style="font-size:10px;color:#999;text-transform:uppercase;font-weight:700">Total</div></div>';
      html += '<div class="card" style="text-align:center;background:#fff7e0"><div style="font-size:18px;font-weight:900;color:#b07800">' + stats.pending + '</div><div style="font-size:10px;color:#b07800;text-transform:uppercase;font-weight:700">Pending</div></div>';
      html += '<div class="card" style="text-align:center;background:#d7ffb8"><div style="font-size:18px;font-weight:900;color:#46a302">' + stats.approved + '</div><div style="font-size:10px;color:#46a302;text-transform:uppercase;font-weight:700">Approved</div></div>';
      html += '<div class="card" style="text-align:center;background:#ffdfe0"><div style="font-size:18px;font-weight:900;color:#ff4b4b">' + stats.rejected + '</div><div style="font-size:10px;color:#ff4b4b;text-transform:uppercase;font-weight:700">Rejected</div></div>';
      html += '</div>';

      // Total pending
      if (stats.totalPending > 0) {
        html += '<div class="card" style="background:linear-gradient(135deg,#fff9e6,#fff4cc);border:2px solid #ffc800;margin-bottom:16px">';
        html += '<div style="text-align:center">';
        html += '<div style="font-size:12px;font-weight:700;color:#7a5d00;margin-bottom:4px">💰 Total Pending Withdraw</div>';
        html += '<div style="font-size:24px;font-weight:900;color:#b07800">Rp ' + stats.totalPending.toLocaleString('id-ID') + '</div>';
        html += '</div>';
        html += '</div>';
      }

      // List
      if (wds.length === 0) {
        html += '<div class="card" style="text-align:center;padding:60px 20px">';
        html += '<div style="font-size:60px;margin-bottom:12px">💭</div>';
        html += '<div style="font-size:14px;font-weight:800;color:#666">Belum ada withdraw</div>';
        html += '</div>';
      } else {
        // Sort pending first
        wds.sort(function(a, b) {
          var priority = { pending: 0, approved: 1, rejected: 2 };
          var pa = priority[a.status] !== undefined ? priority[a.status] : 1;
          var pb = priority[b.status] !== undefined ? priority[b.status] : 1;
          return pa - pb;
        });

        html += '<div style="display:flex;flex-direction:column;gap:12px">';
        wds.forEach(function(wd) {
          html += Confirm.renderWithdrawCard(wd);
        });
        html += '</div>';
      }

      container.innerHTML = html;

    } catch (e) {
      console.error('[AdminKonfirmasi] renderWithdrawals error:', e);
      container.innerHTML = '<div class="card"><p style="color:red">❌ Error: ' + e.message + '</p></div>';
    }
  };

  /* ============================================
     9. RENDER WITHDRAW CARD
     ============================================ */
  Confirm.renderWithdrawCard = function(wd) {
    var statusColors = {
      pending: { bg: '#fff7e0', color: '#b07800', label: '⏳ Pending' },
      approved: { bg: '#d7ffb8', color: '#46a302', label: '✅ Approved' },
      rejected: { bg: '#ffdfe0', color: '#ff4b4b', label: '❌ Rejected' },
    };
    var sc = statusColors[wd.status] || statusColors.pending;

    var date = wd.createdAt ? new Date(wd.createdAt).toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }) : '-';

    var html = '<div class="card" style="padding:16px;border-left:4px solid ' + sc.color + '">';

    // Header
    html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:12px">';
    html += '<div style="flex:1;min-width:0">';
    html += '<div style="font-size:14px;font-weight:900;color:#1a1a1a;margin-bottom:2px">💸 Rp ' + (wd.amount || 0).toLocaleString('id-ID') + '</div>';
    html += '<div style="font-size:11px;color:#999;font-family:monospace">' + (wd.id || wd._id) + '</div>';
    html += '</div>';
    html += '<span style="background:' + sc.bg + ';color:' + sc.color + ';padding:4px 10px;border-radius:999px;font-size:10px;font-weight:900">' + sc.label + '</span>';
    html += '</div>';

    // Detail
    html += '<div style="background:#f8f9fa;border-radius:10px;padding:12px;margin-bottom:12px">';
    html += '<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:12px"><span style="color:#666">👤 User</span><strong>' + (wd.userName || '-') + '</strong></div>';
    html += '<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:12px"><span style="color:#666">📅 Tanggal</span><strong>' + date + '</strong></div>';
    html += '<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:12px"><span style="color:#666">💳 Metode</span><strong>' + (wd.method || '-') + '</strong></div>';
    html += '<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:12px"><span style="color:#666">📱 Nomor</span><strong style="font-family:monospace">' + (wd.account || '-') + '</strong></div>';
    html += '<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:12px"><span style="color:#666">👤 Nama Rekening</span><strong>' + (wd.name || '-') + '</strong></div>';
    html += '</div>';

    // Actions
    if (wd.status === 'pending') {
      html += '<div style="display:flex;gap:8px;flex-wrap:wrap">';
      html += '<button onclick="AdminKonfirmasi.approveWithdraw(\'' + wd._id + '\')" style="flex:1;min-width:120px;padding:12px;background:linear-gradient(135deg,#58cc02,#89e219);color:white;border:none;border-radius:10px;font-family:inherit;font-weight:900;font-size:13px;cursor:pointer">✅ Setuju (Sudah Transfer)</button>';
      html += '<button onclick="AdminKonfirmasi.rejectWithdraw(\'' + wd._id + '\')" style="flex:1;min-width:120px;padding:12px;background:linear-gradient(135deg,#ff4b4b,#ea2b2b);color:white;border:none;border-radius:10px;font-family:inherit;font-weight:900;font-size:13px;cursor:pointer">❌ Tolak</button>';
      html += '<button onclick="AdminKonfirmasi.deleteWithdraw(\'' + wd._id + '\')" style="padding:12px 16px;background:#f3f4f6;color:#666;border:none;border-radius:10px;font-family:inherit;font-weight:900;font-size:13px;cursor:pointer">🗑️</button>';
      html += '</div>';
    } else {
      html += '<div style="display:flex;gap:8px">';
      html += '<button onclick="AdminKonfirmasi.deleteWithdraw(\'' + wd._id + '\')" style="padding:10px 16px;background:#f3f4f6;color:#666;border:none;border-radius:10px;font-family:inherit;font-weight:800;font-size:12px;cursor:pointer">🗑️ Hapus</button>';
      html += '</div>';
    }

    html += '</div>';
    return html;
  };

  /* ============================================
     10. APPROVE WITHDRAW
     ============================================ */
  Confirm.approveWithdraw = async function(wdId) {
    var notes = prompt('✅ Konfirmasi transfer sudah dilakukan.\n\nCatatan (opsional):\nContoh: "Transfer ke DANA 08123456789, ref: TXN123"', 'Transfer berhasil');
    if (notes === null) return;

    try {
      await Admin.db.collection('withdrawals').doc(wdId).update({
        status: 'approved',
        approvedAt: new Date().toISOString(),
        approvedBy: Admin.user.email,
        adminNotes: notes || 'Transfer berhasil',
        updatedAt: new Date().toISOString(),
      });

      if (typeof AdminLog !== 'undefined') {
        AdminLog.log('info', 'admin.withdraw', '✅ Withdraw approved: ' + wdId);
      }

      Confirm.notifyUserWithdraw(wdId, 'approved', notes);

      alert('✅ Withdraw disetujui!');
      Confirm.refreshCurrentView();
    } catch (e) {
      alert('❌ Error: ' + e.message);
    }
  };

  /* ============================================
     11. REJECT WITHDRAW
     ============================================ */
  Confirm.rejectWithdraw = async function(wdId) {
    var reason = prompt('❌ Alasan penolakan:\nContoh: "Nomor rekening tidak valid"', 'Nomor rekening tidak valid');
    if (reason === null) return;

    try {
      // Ambil data withdraw untuk refund saldo
      var wdDoc = await Admin.db.collection('withdrawals').doc(wdId).get();
      var wd = wdDoc.data();

      // Update status withdraw
      await Admin.db.collection('withdrawals').doc(wdId).update({
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        rejectedBy: Admin.user.email,
        adminNotes: reason || 'Withdraw ditolak',
        updatedAt: new Date().toISOString(),
      });

      // Refund saldo ke user
      if (wd.userId && wd.amount) {
        try {
          var userRef = Admin.db.collection('users').doc(wd.userId);
          var userDoc = await userRef.get();
          if (userDoc.exists) {
            var userData = userDoc.data();
            var newBalance = (userData.balance || 0) + wd.amount;
            await userRef.update({
              balance: newBalance,
              totalWithdrawn: Math.max(0, (userData.totalWithdrawn || 0) - wd.amount),
              updatedAt: new Date().toISOString(),
            });
            console.log('[Confirm] Refunded ' + wd.amount + ' to user ' + wd.userId);
          }
        } catch (refundErr) {
          console.warn('[Confirm] Refund error:', refundErr);
        }
      }

      if (typeof AdminLog !== 'undefined') {
        AdminLog.log('warn', 'admin.withdraw', '❌ Withdraw rejected: ' + wdId + ' — ' + reason + ' (saldo dikembalikan)');
      }

      Confirm.notifyUserWithdraw(wdId, 'rejected', reason);

      alert('❌ Withdraw ditolak & saldo dikembalikan ke user!');
      Confirm.refreshCurrentView();
    } catch (e) {
      alert('❌ Error: ' + e.message);
    }
  };

  /* ============================================
     12. DELETE WITHDRAW
     ============================================ */
  Confirm.deleteWithdraw = async function(wdId) {
    if (!confirm('🗑️ Hapus data withdraw ini? Tidak bisa dibatalkan.')) return;

    try {
      await Admin.db.collection('withdrawals').doc(wdId).delete();
      alert('✅ Data withdraw dihapus!');
      Confirm.refreshCurrentView();
    } catch (e) {
      alert('❌ Error: ' + e.message);
    }
  };

  /* ============================================
     13. NOTIFIKASI USER WITHDRAW
     ============================================ */
  Confirm.notifyUserWithdraw = async function(wdId, status, notes) {
    try {
      var wdDoc = await Admin.db.collection('withdrawals').doc(wdId).get();
      if (!wdDoc.exists) return;

      var wd = wdDoc.data();
      var emoji = status === 'approved' ? '✅' : '❌';
      var title = status === 'approved' ? 'WITHDRAW BERHASIL' : 'WITHDRAW DITOLAK';

      var text = emoji + ' <b>' + title + '</b>\n\n' +
        '🆔 ID: <code>' + (wd.id || wdId) + '</code>\n' +
        '👤 User: ' + (wd.userName || '-') + '\n' +
        '💰 Jumlah: Rp ' + (wd.amount || 0).toLocaleString('id-ID') + '\n' +
        '💳 Metode: ' + (wd.method || '-') + '\n' +
        '📱 Nomor: ' + (wd.account || '-') + '\n\n' +
        '📝 Catatan: ' + (notes || '-') + '\n\n' +
        '🕐 ' + new Date().toLocaleString('id-ID');

      if (typeof TELEGRAM_CONFIG !== 'undefined' && TELEGRAM_CONFIG.sendMessage) {
        TELEGRAM_CONFIG.sendMessage(text);
      }
    } catch (e) {
      console.warn('[Confirm] notify error:', e);
    }
  };

  /* ============================================
     14. HELPERS
     ============================================ */
  Confirm.statCard = function(icon, value, label, color) {
    return '<div style="background:rgba(255,255,255,0.1);padding:12px;border-radius:10px;text-align:center">' +
      '<div style="font-size:18px;margin-bottom:4px">' + icon + '</div>' +
      '<div style="font-size:16px;font-weight:900;color:' + color + '">' + value + '</div>' +
      '<div style="font-size:9px;color:#9ca3af;text-transform:uppercase;font-weight:700">' + label + '</div>' +
    '</div>';
  };

  Confirm.filterTab = function(type, label, count) {
    var active = Confirm._filter === type;
    var bg = active ? 'linear-gradient(135deg,#58cc02,#89e219)' : 'white';
    var color = active ? 'white' : '#666';
    return '<button onclick="AdminKonfirmasi.setFilter(\'' + type + '\')" style="padding:8px 14px;background:' + bg + ';color:' + color + ';border:2px solid ' + (active ? 'transparent' : '#e5e5e5') + ';border-radius:999px;font-family:inherit;font-size:12px;font-weight:800;cursor:pointer;white-space:nowrap">' +
      label + ' (' + count + ')' +
    '</button>';
  };

  Confirm.setFilter = function(type) {
    Confirm._filter = type;
    var container = document.getElementById('content');
    if (container) Confirm.renderOrders(container);
  };

  Confirm.refreshCurrentView = function() {
    var container = document.getElementById('content');
    if (!container) return;

    // Refresh based on section
    if (Admin.section === 'pesanan' || Admin.section === 'orders') {
      Confirm.renderOrders(container);
    } else if (Admin.section === 'withdrawals') {
      Confirm.renderWithdrawals(container);
    }
  };

  /* ============================================
     15. INIT — Override Admin.renderOrders & renderWithdrawals
     ============================================ */
  function init() {
    if (typeof Admin === 'undefined') {
      setTimeout(init, 300);
      return;
    }
    if (Admin._konfirmasiPatched) return;
    Admin._konfirmasiPatched = true;

    // Override renderOrders
    Admin.renderOrders = function(c) {
      Confirm.renderOrders(c);
    };

    // Override renderWithdrawals
    Admin.renderWithdrawals = function(c) {
      Confirm.renderWithdrawals(c);
    };

    console.log('[AdminKonfirmasi] Patched ✅');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(init, 1500);
    });
  } else {
    setTimeout(init, 1500);
  }

  window.AdminKonfirmasi = Confirm;
})();
