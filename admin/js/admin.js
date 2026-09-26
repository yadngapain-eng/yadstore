/* ============================================
   LEARN EARN — ADMIN PANEL v4
   + Min Withdraw per user + Pilih Semua
   ============================================ */

const Admin = {
  user: null,
  isAdmin: false,
  section: 'dash',
  auth: null,
  db: null,
  selectedUsers: {},  // untuk "pilih semua"

  // ============================================
  // INIT
  // ============================================
  async init() {
    console.log('[Admin] Init v4...');

    if (typeof firebase !== 'undefined') {
      if (!firebase.apps.length) firebase.initializeApp(window.FIREBASE_CONFIG);
      this.auth = firebase.auth();
      this.db = firebase.firestore();

      this.auth.onAuthStateChanged(async (user) => {
        this.user = user;
        if (!user) { this.showLogin(); return; }
        try {
          const idTokenResult = await user.getIdTokenResult(true);
          this.isAdmin = idTokenResult.claims.admin === true;
          console.log('[Admin] User:', user.email, '| Admin:', this.isAdmin);
          if (this.isAdmin) { this.showAdmin(); this.updateUserInfo(); this.render(); }
          else { this.showDenied(); }
        } catch (e) { console.error('[Admin] claim error:', e); this.showDenied(); }
      });
    } else {
      document.getElementById('loading').innerHTML = '<p>❌ Firebase SDK not loaded</p>';
    }

    document.querySelectorAll('.nav-item').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.section = el.dataset.sec;
        document.querySelectorAll('.nav-item').forEach(x => x.classList.remove('active'));
        el.classList.add('active');
        const titles = {
          dash: 'Dashboard',
          orders: 'Pesanan',
          withdrawals: 'Withdraw Request',
          limits: 'Min Withdraw Limit',
          products: 'Produk & Markup',
          users: 'Users',
          debug: '🐛 Debug & Monitor',
          settings: 'Pengaturan'
        };
        document.getElementById('sec-title').textContent = titles[this.section] || this.section;
        this.render();
      });
    });
  },

  // ============================================
  // UI STATES
  // ============================================
  showLogin() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('login').style.display = 'flex';
    document.getElementById('denied').style.display = 'none';
    document.getElementById('admin-app').style.display = 'none';
  },
  showDenied() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('login').style.display = 'none';
    document.getElementById('denied').style.display = 'flex';
    document.getElementById('admin-app').style.display = 'none';
    if (this.user) document.getElementById('denied-email').textContent = this.user.email || this.user.uid.slice(0, 8);
  },
  showAdmin() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('login').style.display = 'none';
    document.getElementById('denied').style.display = 'none';
    document.getElementById('admin-app').style.display = 'flex';
  },
  updateUserInfo() {
    if (!this.user) return;
    const email = this.user.email || 'Anonymous';
    const name = this.user.displayName || email.split('@')[0];
    document.getElementById('admin-name').textContent = name;
    document.getElementById('admin-email').textContent = email;
    document.getElementById('admin-avatar').textContent = (name[0] || '?').toUpperCase();
  },

  // ============================================
  // AUTH
  // ============================================
  async loginGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await this.auth.signInWithPopup(provider);
    } catch (e) { console.error(e); alert('Login gagal: ' + e.message); }
  },
  async logout() {
    if (this.auth) { await this.auth.signOut(); location.reload(); }
  },

  // ============================================
  // RENDER DISPATCHER
  // ============================================
  render() {
    const c = document.getElementById('content');
    if (this.section === 'dash') this.renderDash(c);
    else if (this.section === 'orders') this.renderOrders(c);
    else if (this.section === 'withdrawals') this.renderWithdrawals(c);
    else if (this.section === 'limits') this.renderLimits(c);
    else if (this.section === 'products') this.renderProducts(c);
    else if (this.section === 'users') this.renderUsers(c);
    else if (this.section === 'debug') this.renderDebug(c);
    else if (this.section === 'settings') this.renderSettings(c);
  },

  // ============================================
  // DASHBOARD
  // ============================================
  async renderDash(c) {
    c.innerHTML = '<div class="loading-inline">Memuat data...</div>';
    try {
      const ordersSnap = await this.db.collection('orders').get();
      const orders = ordersSnap.docs.map(d => d.data());
      const total = orders.reduce((s, o) => s + (o.total || 0), 0);
      const pending = orders.filter(o => o.status === 'pending').length;
      const processing = orders.filter(o => o.status === 'processing').length;
      const success = orders.filter(o => o.status === 'success').length;

      const wdSnap = await this.db.collection('withdrawals').get();
      const wds = wdSnap.docs.map(d => d.data());
      const wdPending = wds.filter(w => w.status === 'pending').length;
      const wdTotal = wds.filter(w => w.status === 'pending').reduce((s, w) => s + (w.amount || 0), 0);

      const usersSnap = await this.db.collection('users').get();
      const userCount = usersSnap.size;

      c.innerHTML = '<div class="stats-grid">' +
        '<div class="stat-card"><div class="stat-icon">🛒</div><div class="stat-val">' + orders.length + '</div><div class="stat-label">Total Order</div></div>' +
        '<div class="stat-card"><div class="stat-icon">💰</div><div class="stat-val">Rp ' + total.toLocaleString('id-ID') + '</div><div class="stat-label">Revenue</div></div>' +
        '<div class="stat-card"><div class="stat-icon">⏳</div><div class="stat-val">' + pending + '</div><div class="stat-label">Pending</div></div>' +
        '<div class="stat-card"><div class="stat-icon">🔄</div><div class="stat-val">' + processing + '</div><div class="stat-label">Diproses</div></div>' +
        '<div class="stat-card"><div class="stat-icon">✅</div><div class="stat-val">' + success + '</div><div class="stat-label">Sukses</div></div>' +
        '<div class="stat-card"><div class="stat-icon">👥</div><div class="stat-val">' + userCount + '</div><div class="stat-label">Users</div></div>' +
        '<div class="stat-card" style="background:linear-gradient(135deg,#fff9e6,#ffefb3);border-color:#ffe58f"><div class="stat-icon">💸</div><div class="stat-val">' + wdPending + '</div><div class="stat-label">Withdraw Pending</div></div>' +
        '<div class="stat-card" style="background:linear-gradient(135deg,#ffe6e6,#ffcccc);border-color:#ff9b9b"><div class="stat-icon">💰</div><div class="stat-val">Rp ' + wdTotal.toLocaleString('id-ID') + '</div><div class="stat-label">Withdraw Amount</div></div>' +
        '</div>' +
        '<div class="card"><h3>Order Terbaru</h3>' +
        (orders.length === 0 ? '<p class="empty-msg">Belum ada order</p>' :
        '<table><thead><tr><th>ID</th><th>Layanan</th><th>Produk</th><th>Total</th><th>Status</th></tr></thead><tbody>' +
        orders.slice(0, 10).map(o => '<tr><td><strong>' + (o.id || '') + '</strong></td><td>' + (o.item || '') + '</td><td>' + (o.product || '') + '</td><td>Rp ' + (o.total || 0).toLocaleString('id-ID') + '</td><td><span class="badge badge-' + o.status + '">' + o.status + '</span></td></tr>').join('') +
        '</tbody></table>') + '</div>';
    } catch (e) {
      c.innerHTML = '<div class="card"><p style="color:red">Error: ' + e.message + '</p></div>';
    }
  },

  // ============================================
  // ORDERS
  // ============================================
  async renderOrders(c) {
    c.innerHTML = '<div class="loading-inline">Memuat orders...</div>';
    try {
      const snap = await this.db.collection('orders').orderBy('date', 'desc').limit(100).get();
      const orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (orders.length === 0) { c.innerHTML = '<div class="card"><p class="empty-msg">Belum ada order</p></div>'; return; }
      c.innerHTML = '<div class="card"><h3>Semua Pesanan (' + orders.length + ')</h3>' +
        '<div class="table-wrap"><table><thead><tr><th>ID</th><th>Tanggal</th><th>Layanan</th><th>Produk</th><th>User</th><th>Total</th><th>Status</th></tr></thead><tbody>' +
        orders.map(o => {
          const date = o.date ? new Date(o.date).toLocaleString('id-ID', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' }) : '-';
          const userData = o.userData ? Object.values(o.userData).join(' / ') : '-';
          return '<tr><td><strong>' + o.id + '</strong></td><td style="font-size:11px">' + date + '</td><td>' + (o.item || '') + '</td><td>' + (o.product || '') + '</td><td style="font-size:11px">' + userData + '</td><td>Rp ' + (o.total || 0).toLocaleString('id-ID') + '</td><td><span class="badge badge-' + o.status + '">' + o.status + '</span></td></tr>';
        }).join('') + '</tbody></table></div></div>';
    } catch (e) {
      c.innerHTML = '<div class="card"><p style="color:red">Error: ' + e.message + '</p></div>';
    }
  },

  // ============================================
  // WITHDRAWALS
  // ============================================
  async renderWithdrawals(c) {
    c.innerHTML = '<div class="loading-inline">Memuat withdraw requests...</div>';
    try {
      const snap = await this.db.collection('withdrawals').orderBy('createdAt', 'desc').limit(100).get();
      const wds = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (wds.length === 0) { c.innerHTML = '<div class="card"><p class="empty-msg">Belum ada withdraw request</p></div>'; return; }

      c.innerHTML = '<div class="card"><h3>Withdraw Requests (' + wds.length + ')</h3>' +
        '<div class="table-wrap"><table><thead><tr><th>ID</th><th>User</th><th>Amount</th><th>Metode</th><th>Akun</th><th>Nama</th><th>Status</th><th>Aksi</th></tr></thead><tbody>' +
        wds.map(w => {
          return '<tr>' +
            '<td><strong>' + w.id.slice(0, 12) + '</strong></td>' +
            '<td>' + (w.userName || '-') + '</td>' +
            '<td><strong>Rp ' + (w.amount || 0).toLocaleString('id-ID') + '</strong></td>' +
            '<td>' + (w.method || '-') + '</td>' +
            '<td><code>' + (w.account || '-') + '</code></td>' +
            '<td>' + (w.name || '-') + '</td>' +
            '<td><span class="badge badge-' + (w.status === 'pending' ? 'pending' : (w.status === 'approved' ? 'success' : 'failed')) + '">' + (w.status || 'pending') + '</span></td>' +
            '<td>' +
            (w.status === 'pending' ?
              '<button class="btn-sm btn-success" onclick="Admin.approveWd(\'' + w.id + '\')">✅ Approve</button> ' +
              '<button class="btn-sm btn-danger" onclick="Admin.rejectWd(\'' + w.id + '\')">❌ Reject</button>'
              : '-') +
            '</td></tr>';
        }).join('') + '</tbody></table></div></div>';
    } catch (e) {
      c.innerHTML = '<div class="card"><p style="color:red">Error: ' + e.message + '</p></div>';
    }
  },

  async approveWd(id) {
    if (!confirm('Approve withdraw ini? Pastikan sudah transfer ke user.')) return;
    try {
      await this.db.collection('withdrawals').doc(id).update({
        status: 'approved',
        approvedAt: new Date().toISOString(),
        approvedBy: this.user.email,
      });
      alert('✅ Approved!');
      this.renderWithdrawals(document.getElementById('content'));
    } catch (e) { alert('Error: ' + e.message); }
  },

  async rejectWd(id) {
    if (!confirm('Reject withdraw ini?')) return;
    try {
      await this.db.collection('withdrawals').doc(id).update({
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        rejectedBy: this.user.email,
      });
      alert('❌ Rejected!');
      this.renderWithdrawals(document.getElementById('content'));
    } catch (e) { alert('Error: ' + e.message); }
  },

  // ============================================
  // MIN WITHDRAW LIMIT (NEW)
  // ============================================
  async renderLimits(c) {
    c.innerHTML = '<div class="loading-inline">Memuat data user...</div>';
    this.selectedUsers = {};

    try {
      // 1. Get default limit
      let defaultLimit = 10000;
      try {
        const cfgDoc = await this.db.collection('config').doc('withdraw_config').get();
        if (cfgDoc.exists) defaultLimit = cfgDoc.data().default_min_withdraw || 10000;
      } catch (e) {}

      // 2. Get all users
      const usersSnap = await this.db.collection('users').limit(200).get();
      const users = usersSnap.docs.map(d => ({ uid: d.id, ...d.data() }));

      const customUsers = users.filter(u => u.custom_min_withdraw !== undefined && u.custom_min_withdraw !== null);

      let html = '';

      // ===== PANEL DEFAULT =====
      html += '<div class="card" style="background:linear-gradient(135deg,#f0fff0,#e6ffe6);border:2px solid #89e219">' +
        '<h3 style="color:#2c5a00">⚙️ Default Min Withdraw (Semua User)</h3>' +
        '<p style="color:#555;font-size:13px;margin-bottom:14px">Berlaku untuk user yang tidak punya custom limit</p>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">' +
        '<button class="btn-preset" onclick="Admin.setDefaultLimit(5000)">Rp 5.000</button>' +
        '<button class="btn-preset" onclick="Admin.setDefaultLimit(10000)">Rp 10.000</button>' +
        '<button class="btn-preset" onclick="Admin.setDefaultLimit(20000)">Rp 20.000</button>' +
        '<button class="btn-preset" onclick="Admin.setDefaultLimit(50000)">Rp 50.000</button>' +
        '<button class="btn-preset" onclick="Admin.setDefaultLimit(100000)">Rp 100.000</button>' +
        '</div>' +
        '<div style="display:flex;gap:8px">' +
        '<input type="number" id="custom-default" placeholder="Nominal lain" style="flex:1;padding:12px;border:2px solid #e5e5e5;border-radius:8px;font-size:14px;font-weight:700">' +
        '<button class="btn-primary" onclick="Admin.applyCustomDefault()" style="padding:12px 24px">Set</button>' +
        '</div>' +
        '<div style="background:white;padding:12px;border-radius:8px;margin-top:12px">' +
        '<strong style="color:#2c5a00">💰 Default: Rp ' + defaultLimit.toLocaleString('id-ID') + '</strong>' +
        '</div>' +
        '</div>';

      // ===== STATS =====
      html += '<div class="stats-grid">' +
        '<div class="stat-card"><div class="stat-val">' + users.length + '</div><div class="stat-label">Total Users</div></div>' +
        '<div class="stat-card" style="background:linear-gradient(135deg,#fff9e6,#ffefb3)"><div class="stat-val">' + customUsers.length + '</div><div class="stat-label">Custom Limit</div></div>' +
        '<div class="stat-card"><div class="stat-val">' + (users.length - customUsers.length) + '</div><div class="stat-label">Default</div></div>' +
        '</div>';

      // ===== PANEL MASS EDIT (PILIH SEMUA) =====
      html += '<div class="card" style="background:linear-gradient(135deg,#fff9e6,#fff4cc);border:2px solid #ffc800">' +
        '<h3 style="color:#7a5d00">⚡ Set Massal (Pilih Semua)</h3>' +
        '<p style="color:#7a5d00;font-size:13px;margin-bottom:14px">Set custom min withdraw untuk BANYAK user sekaligus</p>' +

        '<div style="display:flex;gap:8px;align-items:center;margin-bottom:12px">' +
        '<label style="display:flex;align-items:center;gap:8px;font-weight:800;font-size:13px;cursor:pointer">' +
        '<input type="checkbox" id="select-all-users" onchange="Admin.toggleSelectAll(this)" style="width:20px;height:20px;cursor:pointer">' +
        '<span>Pilih Semua User</span>' +
        '</label>' +
        '<span id="selected-count" style="margin-left:auto;background:#fff;padding:4px 12px;border-radius:999px;font-weight:900;font-size:12px;color:#7a5d00">0 dipilih</span>' +
        '</div>' +

        '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">' +
        '<button class="btn-preset" onclick="Admin.setMassLimit(5000)">Rp 5.000</button>' +
        '<button class="btn-preset" onclick="Admin.setMassLimit(10000)">Rp 10.000</button>' +
        '<button class="btn-preset" onclick="Admin.setMassLimit(20000)">Rp 20.000</button>' +
        '<button class="btn-preset" onclick="Admin.setMassLimit(50000)">Rp 50.000</button>' +
        '</div>' +

        '<div style="display:flex;gap:8px">' +
        '<input type="number" id="mass-limit-input" placeholder="Nominal lain" style="flex:1;padding:12px;border:2px solid #e5e5e5;border-radius:8px;font-size:14px;font-weight:700">' +
        '<button class="btn-primary" onclick="Admin.applyMassLimit()" style="padding:12px 24px">Terapkan ke Terpilih</button>' +
        '</div>' +

        '<button class="btn-danger" onclick="Admin.removeMassLimit()" style="width:100%;margin-top:12px">🗑️ Hapus Custom Limit (User Terpilih)</button>' +
        '</div>';

      // ===== CUSTOM USERS =====
      html += '<div class="card"><h3>🎯 User dengan Custom Limit (' + customUsers.length + ')</h3>';
      if (customUsers.length === 0) {
        html += '<p class="empty-msg">Belum ada user dengan custom limit</p>';
      } else {
        html += '<div class="table-wrap"><table><thead><tr><th>User</th><th>Email</th><th>Custom Min</th><th>Saldo</th><th>Aksi</th></tr></thead><tbody>';
        customUsers.forEach(u => {
          html += '<tr>' +
            '<td>' + (u.avatar || '👤') + ' ' + (u.displayName || '-') + '</td>' +
            '<td style="font-size:11px">' + (u.email || '-') + '</td>' +
            '<td><strong style="color:#58cc02">Rp ' + (u.custom_min_withdraw || 0).toLocaleString('id-ID') + '</strong></td>' +
            '<td>Rp ' + (u.balance || 0).toLocaleString('id-ID') + '</td>' +
            '<td><button class="btn-sm btn-danger" onclick="Admin.removeLimit(\'' + u.uid + '\')">🗑️ Hapus</button></td>' +
            '</tr>';
        });
        html += '</tbody></table></div>';
      }
      html += '</div>';

      // ===== ALL USERS (dengan checkbox) =====
      html += '<div class="card"><h3>👥 Semua User</h3>' +
        '<p style="color:#666;font-size:13px;margin-bottom:12px">Centang user, lalu set limit massal</p>';

      if (users.length === 0) {
        html += '<p class="empty-msg">Belum ada user</p>';
      } else {
        html += '<div class="table-wrap"><table><thead><tr>' +
          '<th style="width:40px"><input type="checkbox" onchange="Admin.toggleSelectAll(this)" style="width:18px;height:18px"></th>' +
          '<th>User</th><th>Email</th><th>Saldo</th><th>Min Withdraw</th><th>Status</th></tr></thead><tbody>';
        users.forEach(u => {
          const hasCustom = u.custom_min_withdraw !== undefined && u.custom_min_withdraw !== null;
          const currentLimit = hasCustom ? u.custom_min_withdraw : defaultLimit;

          html += '<tr>' +
            '<td><input type="checkbox" class="user-checkbox" data-uid="' + u.uid + '" onchange="Admin.toggleUser(this)" style="width:18px;height:18px;cursor:pointer"></td>' +
            '<td>' + (u.avatar || '👤') + ' ' + (u.displayName || '-') + '</td>' +
            '<td style="font-size:11px">' + (u.email || '-') + '</td>' +
            '<td>Rp ' + (u.balance || 0).toLocaleString('id-ID') + '</td>' +
            '<td><strong>Rp ' + currentLimit.toLocaleString('id-ID') + '</strong></td>' +
            '<td>' + (hasCustom ? '<span style="color:#58cc02;font-size:10px;font-weight:800">CUSTOM</span>' : '<span style="color:#999;font-size:11px">Default</span>') + '</td>' +
            '</tr>';
        });
        html += '</tbody></table></div>';
      }
      html += '</div>';

      c.innerHTML = html;
    } catch (e) {
      console.error('[Admin] renderLimits error:', e);
      c.innerHTML = '<div class="card"><p style="color:red">Error: ' + e.message + '</p></div>';
    }
  },

  // ===== SET DEFAULT GLOBAL =====
  async setDefaultLimit(amount) {
    if (!confirm('Set default min withdraw ke Rp ' + amount.toLocaleString('id-ID') + '?')) return;
    try {
      await this.db.collection('config').doc('withdraw_config').set({
        default_min_withdraw: amount,
        updatedAt: new Date().toISOString(),
        updatedBy: this.user.email,
      }, { merge: true });
      alert('✅ Default min withdraw: Rp ' + amount.toLocaleString('id-ID'));
      this.renderLimits(document.getElementById('content'));
    } catch (e) { alert('Error: ' + e.message); }
  },

  applyCustomDefault() {
    const v = parseInt(document.getElementById('custom-default').value) || 0;
    if (v < 1000) { alert('Minimal Rp 1.000'); return; }
    this.setDefaultLimit(v);
  },

  // ===== TOGGLE SELECTION =====
  toggleSelectAll(checkbox) {
    const checked = checkbox.checked;
    document.querySelectorAll('.user-checkbox').forEach(cb => {
      cb.checked = checked;
      const uid = cb.getAttribute('data-uid');
      if (checked) this.selectedUsers[uid] = true;
      else delete this.selectedUsers[uid];
    });
    // Sync checkbox "select all" atas
    const topCheckbox = document.getElementById('select-all-users');
    if (topCheckbox) topCheckbox.checked = checked;
    this.updateSelectedCount();
  },

  toggleUser(checkbox) {
    const uid = checkbox.getAttribute('data-uid');
    if (checkbox.checked) this.selectedUsers[uid] = true;
    else delete this.selectedUsers[uid];
    this.updateSelectedCount();
  },

  updateSelectedCount() {
    const count = Object.keys(this.selectedUsers).length;
    const el = document.getElementById('selected-count');
    if (el) el.textContent = count + ' dipilih';
  },

  // ===== SET MASS LIMIT =====
  async setMassLimit(amount) {
    const uids = Object.keys(this.selectedUsers);
    if (uids.length === 0) { alert('Pilih user dulu!'); return; }
    if (!confirm('Set min withdraw Rp ' + amount.toLocaleString('id-ID') + ' untuk ' + uids.length + ' user?')) return;

    try {
      const batch = this.db.batch();
      uids.forEach(uid => {
        const ref = this.db.collection('users').doc(uid);
        batch.update(ref, {
          custom_min_withdraw: amount,
          custom_min_withdraw_updated: new Date().toISOString(),
          custom_min_withdraw_by: this.user.email,
        });
      });
      await batch.commit();
      alert('✅ ' + uids.length + ' user berhasil di-update!');
      this.renderLimits(document.getElementById('content'));
    } catch (e) { alert('Error: ' + e.message); }
  },

  applyMassLimit() {
    const v = parseInt(document.getElementById('mass-limit-input').value) || 0;
    if (v < 1000) { alert('Minimal Rp 1.000'); return; }
    this.setMassLimit(v);
  },

  // ===== REMOVE MASS LIMIT =====
  async removeMassLimit() {
    const uids = Object.keys(this.selectedUsers);
    if (uids.length === 0) { alert('Pilih user dulu!'); return; }
    if (!confirm('Hapus custom limit untuk ' + uids.length + ' user? (Kembali ke default)')) return;

    try {
      const batch = this.db.batch();
      uids.forEach(uid => {
        const ref = this.db.collection('users').doc(uid);
        batch.update(ref, {
          custom_min_withdraw: firebase.firestore.FieldValue.delete(),
          custom_min_withdraw_updated: firebase.firestore.FieldValue.delete(),
          custom_min_withdraw_by: firebase.firestore.FieldValue.delete(),
        });
      });
      await batch.commit();
      alert('✅ ' + uids.length + ' user custom limit dihapus!');
      this.renderLimits(document.getElementById('content'));
    } catch (e) { alert('Error: ' + e.message); }
  },

  // ===== REMOVE SINGLE =====
  async removeLimit(uid) {
    if (!confirm('Hapus custom limit user ini?')) return;
    try {
      await this.db.collection('users').doc(uid).update({
        custom_min_withdraw: firebase.firestore.FieldValue.delete(),
        custom_min_withdraw_updated: firebase.firestore.FieldValue.delete(),
        custom_min_withdraw_by: firebase.firestore.FieldValue.delete(),
      });
      alert('✅ Custom limit dihapus');
      this.renderLimits(document.getElementById('content'));
    } catch (e) { alert('Error: ' + e.message); }
  },

  // ============================================
  // PRODUCTS & MARKUP
  // ============================================
  async renderProducts(c) {
    c.innerHTML = '<div class="loading-inline">Memuat config...</div>';
    try {
      const cfgDoc = await this.db.collection('config').doc('markup').get();
      const cfg = cfgDoc.exists ? cfgDoc.data() : {};
      const globalMarkup = cfg.global_markup || 0;

      let html = '<div class="card markup-card">' +
        '<h3>⚡ Global Markup</h3>' +
        '<p>Naikkan harga SEMUA produk</p>' +
        '<div class="preset-row">' +
        '<button class="btn-preset" onclick="Admin.applyGlobalMarkup(500)">+500</button>' +
        '<button class="btn-preset" onclick="Admin.applyGlobalMarkup(1000)">+1.000</button>' +
        '<button class="btn-preset" onclick="Admin.applyGlobalMarkup(2000)">+2.000</button>' +
        '<button class="btn-preset" onclick="Admin.applyGlobalMarkup(3000)">+3.000</button>' +
        '<button class="btn-preset" onclick="Admin.applyGlobalMarkup(5000)">+5.000</button>' +
        '<button class="btn-preset" onclick="Admin.applyGlobalMarkup(10000)">+10.000</button>' +
        '</div>' +
        '<div class="custom-row">' +
        '<input type="number" id="custom-markup" placeholder="Nominal lain">' +
        '<button class="btn-primary" onclick="Admin.applyCustomMarkup()">Terapkan</button>' +
        '</div>' +
        '<div class="markup-status">💰 Global markup: <strong>+Rp ' + globalMarkup.toLocaleString('id-ID') + '</strong></div>' +
        '<button class="btn-danger" onclick="Admin.resetMarkup()">Reset Semua</button>' +
        '</div>';

      html += '<div class="card"><h3>📋 Daftar Produk</h3>';
      const all = [].concat(window.GAMES || [], window.DATA_PACKAGES || []);
      all.forEach(item => {
        html += '<div class="product-group"><h4>' + (item.icon || '') + ' ' + item.name + '</h4>' +
          '<table><thead><tr><th>Produk</th><th>Dasar</th><th>Jual</th></tr></thead><tbody>';
        item.products.forEach(p => {
          const final = p.price + globalMarkup;
          html += '<tr><td>' + p.name + '</td><td>Rp ' + p.price.toLocaleString('id-ID') + '</td><td><strong>Rp ' + final.toLocaleString('id-ID') + '</strong></td></tr>';
        });
        html += '</tbody></table></div>';
      });
      html += '</div>';
      c.innerHTML = html;
    } catch (e) {
      c.innerHTML = '<div class="card"><p style="color:red">Error: ' + e.message + '</p></div>';
    }
  },

  async applyGlobalMarkup(amount) {
    try {
      const doc = await this.db.collection('config').doc('markup').get();
      const cfg = doc.exists ? doc.data() : {};
      const newMarkup = (cfg.global_markup || 0) + amount;
      await this.db.collection('config').doc('markup').set({
        global_markup: newMarkup,
        updatedAt: new Date().toISOString(),
        updatedBy: this.user.email,
      }, { merge: true });
      alert('✅ Markup +Rp ' + amount.toLocaleString('id-ID'));
      this.renderProducts(document.getElementById('content'));
    } catch (e) { alert('Error: ' + e.message); }
  },

  applyCustomMarkup() {
    const v = parseInt(document.getElementById('custom-markup').value) || 0;
    if (v === 0) return;
    this.applyGlobalMarkup(v);
  },

  async resetMarkup() {
    if (!confirm('Reset markup?')) return;
    await this.db.collection('config').doc('markup').set({ global_markup: 0 }, { merge: true });
    alert('✅ Reset');
    this.renderProducts(document.getElementById('content'));
  },

  // ============================================
  // USERS
  // ============================================
  async renderUsers(c) {
    c.innerHTML = '<div class="loading-inline">Memuat users...</div>';
    try {
      const snap = await this.db.collection('users').limit(100).get();
      const users = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
      c.innerHTML = '<div class="card"><h3>Users (' + users.length + ')</h3>' +
        '<div class="table-wrap"><table><thead><tr><th>UID</th><th>Nama</th><th>Email</th><th>Saldo</th><th>XP</th><th>Joined</th></tr></thead><tbody>' +
        users.map(u => {
          const date = u.createdAt ? new Date(u.createdAt).toLocaleDateString('id-ID') : '-';
          return '<tr>' +
            '<td><code style="font-size:10px">' + u.uid.slice(0, 8) + '</code></td>' +
            '<td>' + (u.avatar || '') + ' ' + (u.displayName || '-') + '</td>' +
            '<td style="font-size:11px">' + (u.email || '-') + '</td>' +
            '<td><strong>Rp ' + (u.balance || 0).toLocaleString('id-ID') + '</strong></td>' +
            '<td>' + (u.xp || 0) + '</td>' +
            '<td style="font-size:11px">' + date + '</td>' +
            '</tr>';
        }).join('') + '</tbody></table></div></div>';
    } catch (e) {
      c.innerHTML = '<div class="card"><p style="color:red">Error: ' + e.message + '</p></div>';
    }
  },

// ============================================
  // DEBUG & MONITOR — Aktivitas Live duniamu.my.id
  // ============================================
  _debugTimer: null,
  _debugT0: 0,

  async renderDebug(c) {
    // Bersihkan timer lama kalau ada
    if (this._debugTimer) { clearInterval(this._debugTimer); this._debugTimer = null; }

    c.innerHTML =
      '<div class="card" style="background:linear-gradient(135deg,#0d1117,#161b22);border:2px solid #58cc02;color:#c9d1d9">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
          '<h3 style="color:#58cc02;margin:0">🐛 Live Monitor — duniamu.my.id</h3>' +
          '<div style="font-size:12px">' +
            '<span id="dbg-status" style="color:#3fb950">● LIVE</span> ' +
            '<span style="color:#8b949e">| refresh tiap 10s</span>' +
          '</div>' +
        '</div>' +
        '<div style="font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px;color:#8b949e">' +
          'Terakhir update: <span id="dbg-last-update">-</span>' +
        '</div>' +
      '</div>' +

      '<div class="stats-grid" id="dbg-stats">' +
        '<div class="loading-inline">Memuat statistik...</div>' +
      '</div>' +

      '<div class="card"><h3>🟢 User Online (aktif < 5 menit)</h3>' +
        '<div id="dbg-online"><div class="loading-inline">Memuat...</div></div>' +
      '</div>' +

      '<div class="card"><h3>🛒 Order Terbaru (10 menit terakhir)</h3>' +
        '<div id="dbg-orders"><div class="loading-inline">Memuat...</div></div>' +
      '</div>' +

      '<div class="card"><h3>💸 Withdraw Terbaru (pending)</h3>' +
        '<div id="dbg-withdrawals"><div class="loading-inline">Memuat...</div></div>' +
      '</div>' +

      '<div class="card"><h3>🏆 Aktivitas Belajar (top user hari ini)</h3>' +
        '<div id="dbg-learn"><div class="loading-inline">Memuat...</div></div>' +
      '</div>' +

      '<div class="card"><h3>📊 Statistik Global</h3>' +
        '<div id="dbg-global"><div class="loading-inline">Memuat...</div></div>' +
      '</div>';

    // Panggil sekali, lalu auto-refresh tiap 10 detik
    await this._refreshDebug();
    this._debugTimer = setInterval(() => {
      // Stop kalau user pindah section
      if (this.section !== 'debug') {
        clearInterval(this._debugTimer);
        this._debugTimer = null;
        return;
      }
      this._refreshDebug();
    }, 10000);
  },

  async _refreshDebug() {
    const db = this.db;
    const now = Date.now();
    const FIVE_MIN  = 5 * 60 * 1000;
    const TEN_MIN   = 10 * 60 * 1000;

    try {
      // ===== 1. Semua user (limit 500) =====
      const usersSnap = await db.collection('users').limit(500).get();
      const users = usersSnap.docs.map(d => ({ uid: d.id, ...d.data() }));

      // ===== 2. Orders terbaru =====
      const ordersSnap = await db.collection('orders').orderBy('date','desc').limit(50).get();
      const orders = ordersSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      // ===== 3. Withdrawals pending =====
      const wdSnap = await db.collection('withdrawals').orderBy('createdAt','desc').limit(50).get();
      const wds = wdSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      // ===== HITUNG STATISTIK =====
      // Online: user yang updatedAt < 5 menit lalu
      const online = users.filter(u => {
        if (!u.updatedAt) return false;
        const t = new Date(u.updatedAt).getTime();
        return (now - t) < FIVE_MIN;
      }).sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      // Order 10 menit terakhir
      const recentOrders = orders.filter(o => {
        if (!o.date) return false;
        return (now - new Date(o.date).getTime()) < TEN_MIN;
      });

      // Withdraw pending
      const wdPending = wds.filter(w => w.status === 'pending');

      // Top learner hari ini (dari xp; asumsi xp global, tidak per-hari. Kita pakai total xp)
      const topLearners = users
        .filter(u => (u.xp || 0) > 0)
        .sort((a,b) => (b.xp || 0) - (a.xp || 0))
        .slice(0, 10);

      // Total stats
      const totalUser  = users.length;
      const totalBal   = users.reduce((s,u) => s + (u.balance || 0), 0);
      const totalOrder = orders.length;
      const totalRevenue = orders.reduce((s,o) => s + (o.total || 0), 0);

      // ===== UPDATE UI =====
      // Stats cards
      document.getElementById('dbg-stats').innerHTML =
        this._statCard('👥', totalUser, 'Total User') +
        this._statCard('🟢', online.length, 'Online Sekarang') +
        this._statCard('🛒', totalOrder, 'Total Order') +
        this._statCard('💰', 'Rp ' + totalRevenue.toLocaleString('id-ID'), 'Revenue') +
        this._statCard('💳', 'Rp ' + totalBal.toLocaleString('id-ID'), 'Saldo User') +
        this._statCard('💸', wdPending.length, 'Withdraw Pending');

      // User online
      if (online.length === 0) {
        document.getElementById('dbg-online').innerHTML = '<p class="empty-msg">Tidak ada user online saat ini</p>';
      } else {
        document.getElementById('dbg-online').innerHTML =
          '<div class="table-wrap"><table><thead><tr><th>User</th><th>Email</th><th>Level</th><th>Terakhir Aktif</th><th>Saldo</th></tr></thead><tbody>' +
          online.map(u => {
            const t = new Date(u.updatedAt);
            const ago = Math.round((now - t.getTime()) / 1000);
            const agoStr = ago < 60 ? ago + 's lalu' : Math.round(ago/60) + 'm lalu';
            return '<tr>' +
              '<td>' + (u.avatar || '👤') + ' ' + (u.displayName || '-') + '</td>' +
              '<td style="font-size:11px">' + (u.email || 'anon') + '</td>' +
              '<td>Lv ' + (u.level || 1) + '</td>' +
              '<td><span style="color:#3fb950;font-weight:800">' + agoStr + '</span></td>' +
              '<td>Rp ' + (u.balance || 0).toLocaleString('id-ID') + '</td>' +
              '</tr>';
          }).join('') +
          '</tbody></table></div>';
      }

      // Order terbaru
      if (recentOrders.length === 0) {
        document.getElementById('dbg-orders').innerHTML = '<p class="empty-msg">Tidak ada order 10 menit terakhir</p>';
      } else {
        document.getElementById('dbg-orders').innerHTML =
          '<div class="table-wrap"><table><thead><tr><th>ID</th><th>User</th><th>Produk</th><th>Total</th><th>Status</th></tr></thead><tbody>' +
          recentOrders.map(o => {
            const userData = o.userData ? Object.values(o.userData).join(' / ') : '-';
            return '<tr>' +
              '<td><strong>' + o.id + '</strong></td>' +
              '<td style="font-size:11px">' + userData + '</td>' +
              '<td>' + (o.product || '-') + '</td>' +
              '<td>Rp ' + (o.total || 0).toLocaleString('id-ID') + '</td>' +
              '<td><span class="badge badge-' + (o.status || 'pending') + '">' + (o.status || 'pending') + '</span></td>' +
              '</tr>';
          }).join('') +
          '</tbody></table></div>';
      }

      // Withdraw pending
      if (wdPending.length === 0) {
        document.getElementById('dbg-withdrawals').innerHTML = '<p class="empty-msg">Tidak ada withdraw pending</p>';
      } else {
        document.getElementById('dbg-withdrawals').innerHTML =
          '<div class="table-wrap"><table><thead><tr><th>ID</th><th>User</th><th>Amount</th><th>Metode</th><th>Akun</th><th>Aksi</th></tr></thead><tbody>' +
          wdPending.map(w => {
            return '<tr>' +
              '<td>' + (w.id || '').slice(0,10) + '</td>' +
              '<td>' + (w.userName || '-') + '</td>' +
              '<td><strong>Rp ' + (w.amount || 0).toLocaleString('id-ID') + '</strong></td>' +
              '<td>' + (w.method || '-') + '</td>' +
              '<td><code>' + (w.account || '-') + '</code></td>' +
              '<td><button class="btn-sm btn-success" onclick="Admin.approveWd(\'' + w.id + '\')">✅</button> ' +
                  '<button class="btn-sm btn-danger" onclick="Admin.rejectWd(\'' + w.id + '\')">❌</button></td>' +
              '</tr>';
          }).join('') +
          '</tbody></table></div>';
      }

      // Top learner
      if (topLearners.length === 0) {
        document.getElementById('dbg-learn').innerHTML = '<p class="empty-msg">Belum ada yang belajar</p>';
      } else {
        document.getElementById('dbg-learn').innerHTML =
          '<div class="table-wrap"><table><thead><tr><th>#</th><th>User</th><th>Level</th><th>XP</th><th>Streak</th><th>Lesson Selesai</th></tr></thead><tbody>' +
          topLearners.map((u, i) => {
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '#' + (i+1);
            return '<tr>' +
              '<td>' + medal + '</td>' +
              '<td>' + (u.avatar || '👤') + ' ' + (u.displayName || '-') + '</td>' +
              '<td>Lv ' + (u.level || 1) + '</td>' +
              '<td><strong>' + (u.xp || 0) + '</strong></td>' +
              '<td>🔥 ' + (u.streak || 0) + '</td>' +
              '<td>' + ((u.completedLessons || []).length) + '</td>' +
              '</tr>';
          }).join('') +
          '</tbody></table></div>';
      }

      // Global stats
      const totalLessons = users.reduce((s,u) => s + ((u.completedLessons || []).length), 0);
      const totalAch     = users.reduce((s,u) => s + ((u.achievements || []).length), 0);
      const totalAds     = users.reduce((s,u) => s + (u.adWatchTotal || 0), 0);
      document.getElementById('dbg-global').innerHTML =
        '<div class="stats-grid">' +
          this._statCard('📚', totalLessons, 'Total Lesson Selesai') +
          this._statCard('🏆', totalAch, 'Total Achievement Unlocked') +
          this._statCard('🎬', totalAds, 'Total Iklan Ditonton') +
          this._statCard('💰', users.reduce((s,u) => s + (u.totalEarned || 0), 0).toLocaleString('id-ID'), 'Total Koin Earned') +
        '</div>';

      // Update timestamp
      const lu = document.getElementById('dbg-last-update');
      if (lu) lu.textContent = new Date().toLocaleTimeString('id-ID');
      const st = document.getElementById('dbg-status');
      if (st) {
        st.style.color = '#3fb950';
        st.textContent = '● LIVE';
      }

    } catch (e) {
      console.error('[Admin Debug] error:', e);
      const st = document.getElementById('dbg-status');
      if (st) { st.style.color = '#f85149'; st.textContent = '● ERROR'; }
      ['dbg-online','dbg-orders','dbg-withdrawals','dbg-learn','dbg-global'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '<p style="color:red">Error: ' + e.message + '</p>';
      });
    }
  },

  _statCard(icon, value, label) {
    return '<div class="stat-card">' +
      '<div class="stat-icon">' + icon + '</div>' +
      '<div class="stat-val">' + value + '</div>' +
      '<div class="stat-label">' + label + '</div>' +
    '</div>';
  },

  // ============================================
  // SETTINGS
  renderSettings(c) {
    c.innerHTML = '<div class="card"><h3>🔐 Admin Info</h3>' +
      '<p><strong>Email:</strong> ' + (this.user.email || '-') + '</p>' +
      '<p><strong>UID:</strong> <code>' + this.user.uid + '</code></p>' +
      '<p><strong>Admin Claim:</strong> ✅ Active</p>' +
      '</div>' +
      '<div class="card"><h3>⚠️ Danger Zone</h3>' +
      '<p>Hapus semua order (tidak bisa dibalikin)</p>' +
      '<button class="btn-danger" onclick="Admin.clearOrders()">Hapus Semua Order</button>' +
      '</div>';
  },

  async clearOrders() {
    if (!confirm('⚠️ Hapus SEMUA order?')) return;
    if (!confirm('Yakin? Ini tidak bisa dibatalkan!')) return;
    try {
      const snap = await this.db.collection('orders').get();
      const batch = this.db.batch();
      snap.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
      alert('✅ Semua order dihapus');
    } catch (e) { alert('Error: ' + e.message); }
  },
};

document.addEventListener('DOMContentLoaded', () => Admin.init());
if (typeof window !== 'undefined') window.Admin = Admin;
console.log('[admin] v4 loaded');
