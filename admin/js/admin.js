/* ============================================
   YS STORE — ADMIN PANEL v1
   Top Up Management + Markup
   ============================================ */

const Admin = {
  user: null,
  isAdmin: false,
  section: 'orders',
  auth: null,
  db: null,

  async init() {
    console.log('[Admin] Init...');

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
          if (this.isAdmin) {
            this.showAdmin();
            this.updateUserInfo();
            this.render();
            this.updateNavBadges();
          } else {
            this.showDenied();
          }
        } catch (e) {
          console.error('[Admin] claim error:', e);
          this.showDenied();
        }
      });
    } else {
      document.getElementById('loading').innerHTML = '<p>❌ Firebase SDK not loaded</p>';
    }

    // Nav
    document.querySelectorAll('.nav-item').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.section = el.dataset.sec;
        document.querySelectorAll('.nav-item').forEach(x => x.classList.remove('active'));
        el.classList.add('active');
        const titles = {
          orders:    { title: '📦 Pesanan',        sub: 'Kelola & konfirmasi pesanan user' },
          markup:    { title: '💰 Markup Harga',   sub: 'Atur markup harga produk' },
          products:  { title: '🏷️ Harga Produk',   sub: 'Edit harga per produk' },
          users:     { title: '👥 Users',          sub: 'Daftar user terdaftar' },
          settings:  { title: '⚙️ Pengaturan',     sub: 'Konfigurasi admin panel' },
        };
        const info = titles[this.section] || { title: this.section, sub: '' };
        document.getElementById('sec-title').textContent = info.title;
        document.getElementById('sec-subtitle').textContent = info.sub;
        this.render();
      });
    });
  },

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
    if (this.user) {
      document.getElementById('denied-email').textContent = this.user.email || this.user.uid.slice(0, 8);
    }
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

  async loginGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await this.auth.signInWithPopup(provider);
    } catch (e) {
      console.error(e);
      alert('Login gagal: ' + e.message);
    }
  },

  async logout() {
    if (this.auth) {
      try { await this.auth.signOut(); } catch (e) {}
    }
    location.reload();
  },

  toggleSidebar() {
    var sidebar = document.getElementById('admin-sidebar');
    var overlay = document.getElementById('mobile-overlay');
    if (!sidebar) return;
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('show');
  },

  async updateNavBadges() {
    if (!this.db) return;
    try {
      var snap = await this.db.collection('orders').where('status', '==', 'pending').get();
      var badge = document.getElementById('nav-badge-orders');
      if (badge) {
        if (snap.size > 0) {
          badge.textContent = snap.size > 99 ? '99+' : snap.size;
          badge.style.display = 'inline-block';
        } else {
          badge.style.display = 'none';
        }
      }
    } catch (e) {}
  },

  render() {
    const c = document.getElementById('content');
    if (this.section === 'orders') this.renderOrders(c);
    else if (this.section === 'markup') this.renderMarkup(c);
    else if (this.section === 'products') this.renderProducts(c);
    else if (this.section === 'users') this.renderUsers(c);
    else if (this.section === 'settings') this.renderSettings(c);
  },

  // ============================================
  // ORDERS
  // ============================================
  async renderOrders(c) {
    c.innerHTML = '<div class="loading-inline">Memuat pesanan...</div>';
    try {
      const snap = await this.db.collection('orders')
        .orderBy('date', 'desc')
        .limit(200)
        .get();
      const orders = snap.docs.map(d => ({ _id: d.id, ...d.data() }));

      // Stats
      const stats = {
        all: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        success: orders.filter(o => o.status === 'success').length,
        failed: orders.filter(o => o.status === 'failed').length,
        revenue: orders.filter(o => o.status === 'success').reduce((s, o) => s + (o.total || 0), 0),
      };

      let html = '';

      // Stats cards
      html += '<div class="stats-grid">';
      html += this._statCard('📊', stats.all, 'Total', '');
      html += this._statCard('⏳', stats.pending, 'Pending', 'yellow');
      html += this._statCard('🔄', stats.processing, 'Proses', 'blue');
      html += this._statCard('✅', stats.success, 'Sukses', 'green');
      html += this._statCard('❌', stats.failed, 'Gagal', 'red');
      html += this._statCard('💰', 'Rp ' + stats.revenue.toLocaleString('id-ID'), 'Revenue', 'purple');
      html += '</div>';

      // Filter tabs
      html += '<div style="display:flex;gap:8px;margin-bottom:16px;overflow-x:auto;padding-bottom:6px">';
      html += this._filterTab('all', '🎯 Semua', stats.all);
      html += this._filterTab('pending', '⏳ Pending', stats.pending);
      html += this._filterTab('processing', '🔄 Proses', stats.processing);
      html += this._filterTab('success', '✅ Sukses', stats.success);
      html += this._filterTab('failed', '❌ Gagal', stats.failed);
      html += '</div>';

      // Orders list
      if (orders.length === 0) {
        html += '<div class="card"><p class="empty-msg">Belum ada pesanan</p></div>';
      } else {
        // Sort: pending & processing first
        const priority = { pending: 0, processing: 1, success: 2, failed: 3 };
        orders.sort((a, b) => (priority[a.status] || 2) - (priority[b.status] || 2));

        html += '<div style="display:flex;flex-direction:column;gap:12px">';
        orders.forEach(order => {
          html += this._renderOrderCard(order);
        });
        html += '</div>';
      }

      c.innerHTML = html;
    } catch (e) {
      console.error('[Admin] renderOrders error:', e);
      c.innerHTML = '<div class="card"><p style="color:red">❌ Error: ' + e.message + '</p></div>';
    }
  },

  _statCard(icon, value, label, colorClass) {
    return '<div class="stat-card ' + (colorClass || '') + '">' +
      '<div class="stat-header"><span class="stat-icon">' + icon + '</span></div>' +
      '<div class="stat-value">' + value + '</div>' +
      '<div class="stat-label">' + label + '</div>' +
      '</div>';
  },

  _filterTab(type, label, count) {
    var active = this._orderFilter === type;
    var bg = active ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'white';
    var color = active ? 'white' : '#666';
    return '<button onclick="Admin.setOrderFilter(\'' + type + '\')" ' +
      'style="padding:8px 14px;background:' + bg + ';color:' + color + ';border:2px solid ' +
      (active ? 'transparent' : '#e5e5e5') +
      ';border-radius:999px;font-family:inherit;font-size:12px;font-weight:800;cursor:pointer;white-space:nowrap">' +
      label + '</button>';
  },

  _orderFilter: 'all',

  setOrderFilter(type) {
    this._orderFilter = type;
    this.renderOrders(document.getElementById('content'));
  },

  _renderOrderCard(order) {
    const statusColors = {
      pending: { bg: '#fff7e0', color: '#b07800', label: '⏳ Pending' },
      processing: { bg: '#e8f6ff', color: '#0ea5e9', label: '🔄 Diproses' },
      success: { bg: '#d7ffb8', color: '#059669', label: '✅ Sukses' },
      failed: { bg: '#ffdfe0', color: '#ef4444', label: '❌ Gagal' },
    };
    const sc = statusColors[order.status] || statusColors.pending;

    const date = order.date ? new Date(order.date).toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }) : '-';

    let userDataStr = '';
    if (order.userData) {
      const keys = Object.keys(order.userData);
      userDataStr = keys.map(k =>
        '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px dashed #e5e5e5;font-size:12px">' +
          '<span style="color:#666;font-weight:600">' + k + '</span>' +
          '<strong>' + order.userData[k] + '</strong>' +
        '</div>'
      ).join('');
    }

    let html = '<div class="card" style="padding:16px;border-left:4px solid ' + sc.color + '">';

    // Header
    html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:12px;flex-wrap:wrap">';
    html += '<div style="flex:1;min-width:0">';
    html += '<div style="font-size:14px;font-weight:900;color:#1a1a1a;margin-bottom:2px">' + (order.item || 'Order') + ' → ' + (order.product || '-') + '</div>';
    html += '<div style="font-size:11px;color:#999;font-family:monospace">' + (order.id || order._id) + '</div>';
    html += '</div>';
    html += '<span class="badge badge-' + (order.status || 'pending') + '">' + sc.label + '</span>';
    html += '</div>';

    // Info
    html += '<div style="background:#f8f9fa;border-radius:10px;padding:12px;margin-bottom:12px">';
    html += '<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:12px"><span style="color:#666">📅 Tanggal</span><strong>' + date + '</strong></div>';
    html += '<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:12px"><span style="color:#666">💰 Total</span><strong style="color:#6366f1">Rp ' + (order.total || 0).toLocaleString('id-ID') + '</strong></div>';
    html += '<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:12px"><span style="color:#666">💳 Metode</span><strong>' + (order.payment || '-') + '</strong></div>';
    html += '</div>';

    // User data
    if (userDataStr) {
      html += '<div style="margin-bottom:12px">';
      html += '<div style="font-size:11px;font-weight:900;color:#999;margin-bottom:6px;text-transform:uppercase">👤 Data User</div>';
      html += '<div style="background:#fff9e6;border-radius:10px;padding:10px">' + userDataStr + '</div>';
      html += '</div>';
    }

    // Proof
    if (order.proof) {
      html += '<div style="margin-bottom:12px">';
      html += '<div style="font-size:11px;font-weight:900;color:#999;margin-bottom:6px;text-transform:uppercase">📸 Bukti Transfer</div>';
      html += '<img src="' + order.proof + '" style="width:100%;max-height:300px;object-fit:contain;border-radius:10px;background:#f8f9fa;cursor:pointer" onclick="window.open(this.src, \'_blank\')">';
      html += '</div>';
    }

    // Actions
    if (order.status === 'pending' || order.status === 'processing') {
      html += '<div style="display:flex;gap:8px;flex-wrap:wrap">';
      html += '<button onclick="Admin.approveOrder(\'' + order._id + '\')" class="btn-success btn-sm" style="flex:1;min-width:100px;padding:12px">✅ Konfirmasi</button>';
      html += '<button onclick="Admin.rejectOrder(\'' + order._id + '\')" class="btn-danger btn-sm" style="flex:1;min-width:100px;padding:12px">❌ Tolak</button>';
      html += '<button onclick="Admin.deleteOrder(\'' + order._id + '\')" class="btn-secondary btn-sm" style="padding:12px 16px">🗑️</button>';
      html += '</div>';
    } else {
      html += '<div style="display:flex;gap:8px;flex-wrap:wrap">';
      html += '<button onclick="Admin.changeStatus(\'' + order._id + '\')" class="btn-secondary btn-sm" style="flex:1;padding:10px">🔄 Ubah Status</button>';
      html += '<button onclick="Admin.deleteOrder(\'' + order._id + '\')" class="btn-secondary btn-sm" style="padding:10px 16px">🗑️</button>';
      html += '</div>';
    }

    html += '</div>';
    return html;
  },

  async approveOrder(orderId) {
    const notes = prompt('📝 Catatan (opsional):', 'Order berhasil diproses');
    if (notes === null) return;
    try {
      await this.db.collection('orders').doc(orderId).update({
        status: 'success',
        approvedAt: new Date().toISOString(),
        approvedBy: this.user.email,
        adminNotes: notes || 'Order berhasil diproses',
        updatedAt: new Date().toISOString(),
      });
      alert('✅ Order dikonfirmasi!');
      this.renderOrders(document.getElementById('content'));
      this.updateNavBadges();
    } catch (e) {
      alert('❌ Error: ' + e.message);
    }
  },

  async rejectOrder(orderId) {
    const reason = prompt('❌ Alasan penolakan:', 'Bukti transfer tidak valid');
    if (reason === null) return;
    try {
      await this.db.collection('orders').doc(orderId).update({
        status: 'failed',
        rejectedAt: new Date().toISOString(),
        rejectedBy: this.user.email,
        adminNotes: reason || 'Order ditolak',
        updatedAt: new Date().toISOString(),
      });
      alert('❌ Order ditolak!');
      this.renderOrders(document.getElementById('content'));
      this.updateNavBadges();
    } catch (e) {
      alert('❌ Error: ' + e.message);
    }
  },

  async changeStatus(orderId) {
    const status = prompt('🔄 Ubah status ke:\n(pending/processing/success/failed)', 'processing');
    if (!status) return;
    const valid = ['pending', 'processing', 'success', 'failed'];
    if (valid.indexOf(status) === -1) {
      alert('❌ Status tidak valid');
      return;
    }
    try {
      await this.db.collection('orders').doc(orderId).update({
        status,
        updatedAt: new Date().toISOString(),
        updatedBy: this.user.email,
      });
      alert('✅ Status diubah ke: ' + status);
      this.renderOrders(document.getElementById('content'));
      this.updateNavBadges();
    } catch (e) {
      alert('❌ Error: ' + e.message);
    }
  },

  async deleteOrder(orderId) {
    if (!confirm('🗑️ Hapus order ini? Tidak bisa dibatalkan.')) return;
    try {
      await this.db.collection('orders').doc(orderId).delete();
      alert('✅ Order dihapus!');
      this.renderOrders(document.getElementById('content'));
      this.updateNavBadges();
    } catch (e) {
      alert('❌ Error: ' + e.message);
    }
  },

  // ============================================
  // MARKUP — Global + Per Game
  // ============================================
  async renderMarkup(c) {
    c.innerHTML = '<div class="loading-inline">Memuat markup config...</div>';
    try {
      const cfgDoc = await this.db.collection('config').doc('markup').get();
      const cfg = cfgDoc.exists ? cfgDoc.data() : {};
      const globalMarkup = cfg.global_markup || 0;
      const gameMarkups = cfg.game_markups || {};

      let html = '';

      // ===== GLOBAL MARKUP =====
      html += '<div class="markup-card">' +
        '<h3>⚡ Global Markup</h3>' +
        '<p>Naikkan harga SEMUA produk sekaligus</p>' +
        '<div class="preset-row">' +
        '<button class="btn-preset" onclick="Admin.applyGlobalMarkup(500)">+500</button>' +
        '<button class="btn-preset" onclick="Admin.applyGlobalMarkup(1000)">+1.000</button>' +
        '<button class="btn-preset" onclick="Admin.applyGlobalMarkup(2000)">+2.000</button>' +
        '<button class="btn-preset" onclick="Admin.applyGlobalMarkup(3000)">+3.000</button>' +
        '<button class="btn-preset" onclick="Admin.applyGlobalMarkup(5000)">+5.000</button>' +
        '<button class="btn-preset" onclick="Admin.applyGlobalMarkup(10000)">+10.000</button>' +
        '</div>' +
        '<div class="custom-row">' +
        '<input type="number" id="custom-markup" placeholder="Nominal lain (contoh: 1500)">' +
        '<button class="btn-primary" onclick="Admin.applyCustomMarkup()">Terapkan</button>' +
        '</div>' +
        '<div class="markup-status">💰 Global markup: <strong>+Rp ' + globalMarkup.toLocaleString('id-ID') + '</strong></div>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
        '<button class="btn-danger btn-sm" onclick="Admin.setGlobalMarkup(0)" style="flex:1">🔽 Reset ke 0</button>' +
        '<button class="btn-warning btn-sm" onclick="Admin.showSetExact()" style="flex:1">✏️ Set Nominal</button>' +
        '</div>' +
        '</div>';

      // ===== INFO =====
      html += '<div class="card" style="background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #3b82f6">' +
        '<div style="font-size:13px;color:#1e40af;font-weight:600;line-height:1.6">' +
        '💡 <strong>Cara kerja markup:</strong><br>' +
        '• Markup global ditambahkan ke SEMUA produk<br>' +
        '• Markup per game ditambahkan khusus game tersebut<br>' +
        '• Total markup = global + per game<br>' +
        '• Harga final = harga dasar + total markup' +
        '</div>' +
        '</div>';

      // ===== PER-GAME MARKUP =====
      html += '<div class="card">';
      html += '<div class="card-header">';
      html += '<div>';
      html += '<div class="card-title">🎮 Markup Per Game</div>';
      html += '<div class="card-subtitle">Atur markup khusus per game</div>';
      html += '</div>';
      html += '</div>';

      const allItems = [].concat(window.GAMES || [], window.DATA_PACKAGES || []);
      allItems.forEach(item => {
        const currentMarkup = gameMarkups[item.id] || 0;
        html += '<div class="game-markup-item">' +
          '<div class="game-markup-header">' +
            '<div class="game-markup-icon" style="background:' + item.color + '">' + (item.short || item.name.charAt(0)) + '</div>' +
            '<div class="game-markup-info">' +
              '<div class="game-markup-name">' + item.name + '</div>' +
              '<div class="game-markup-desc">' + (item.products ? item.products.length : 0) + ' produk</div>' +
            '</div>' +
          '</div>' +
          '<div class="game-markup-controls">' +
            '<input type="number" id="gm-' + item.id + '" value="' + currentMarkup + '" placeholder="0" min="0" step="500">' +
            '<button class="btn-primary btn-sm" onclick="Admin.saveGameMarkup(\'' + item.id + '\')">💾 Simpan</button>' +
            (currentMarkup > 0 ? '<button class="btn-secondary btn-sm" onclick="Admin.clearGameMarkup(\'' + item.id + '\')">🗑️</button>' : '') +
          '</div>' +
        '</div>';
      });

      html += '</div>';

      c.innerHTML = html;
    } catch (e) {
      console.error('[Admin] renderMarkup error:', e);
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
      alert('✅ Markup +Rp ' + amount.toLocaleString('id-ID') + '\nTotal: +Rp ' + newMarkup.toLocaleString('id-ID'));
      this.renderMarkup(document.getElementById('content'));
    } catch (e) {
      alert('Error: ' + e.message);
    }
  },

  applyCustomMarkup() {
    const v = parseInt(document.getElementById('custom-markup').value) || 0;
    if (v === 0) { alert('Masukkan nominal'); return; }
    this.applyGlobalMarkup(v);
  },

  async setGlobalMarkup(amount) {
    if (amount !== 0) {
      const input = prompt('Set global markup ke (Rp):', String(amount));
      if (input === null) return;
      amount = parseInt(input) || 0;
    } else {
      if (!confirm('Reset global markup ke 0?')) return;
    }
    try {
      await this.db.collection('config').doc('markup').set({
        global_markup: amount,
        updatedAt: new Date().toISOString(),
        updatedBy: this.user.email,
      }, { merge: true });
      alert('✅ Global markup: Rp ' + amount.toLocaleString('id-ID'));
      this.renderMarkup(document.getElementById('content'));
    } catch (e) {
      alert('Error: ' + e.message);
    }
  },

  showSetExact() {
    const input = prompt('Set global markup (Rp):', '0');
    if (input === null) return;
    const v = parseInt(input) || 0;
    this.setGlobalMarkupExact(v);
  },

  async setGlobalMarkupExact(amount) {
    try {
      await this.db.collection('config').doc('markup').set({
        global_markup: amount,
        updatedAt: new Date().toISOString(),
        updatedBy: this.user.email,
      }, { merge: true });
      alert('✅ Global markup: Rp ' + amount.toLocaleString('id-ID'));
      this.renderMarkup(document.getElementById('content'));
    } catch (e) {
      alert('Error: ' + e.message);
    }
  },

  async saveGameMarkup(gameId) {
    const input = document.getElementById('gm-' + gameId);
    if (!input) return;
    const value = parseInt(input.value) || 0;

    try {
      await this.db.collection('config').doc('markup').set({
        game_markups: { [gameId]: value },
        updatedAt: new Date().toISOString(),
        updatedBy: this.user.email,
      }, { merge: true });
      alert('✅ Markup untuk ' + gameId + ': Rp ' + value.toLocaleString('id-ID'));
      this.renderMarkup(document.getElementById('content'));
    } catch (e) {
      alert('Error: ' + e.message);
    }
  },

  async clearGameMarkup(gameId) {
    if (!confirm('Hapus markup untuk game ini?')) return;
    try {
      const doc = await this.db.collection('config').doc('markup').get();
      const cfg = doc.exists ? doc.data() : {};
      const gameMarkups = cfg.game_markups || {};
      delete gameMarkups[gameId];

      await this.db.collection('config').doc('markup').set({
        game_markups: gameMarkups,
        updatedAt: new Date().toISOString(),
        updatedBy: this.user.email,
      }, { merge: true });
      alert('✅ Markup dihapus');
      this.renderMarkup(document.getElementById('content'));
    } catch (e) {
      alert('Error: ' + e.message);
    }
  },

  // ============================================
  // PRODUCTS — Edit harga per produk
  // ============================================
  async renderProducts(c) {
    c.innerHTML = '<div class="loading-inline">Memuat harga produk...</div>';
    try {
      const pricesDoc = await this.db.collection('config').doc('prices').get();
      const prices = pricesDoc.exists ? pricesDoc.data() : {};

      let html = '';

      html += '<div class="card" style="background:linear-gradient(135deg,#eff6ff,#dbeafe);border:2px solid #3b82f6">' +
        '<div style="font-size:13px;color:#1e40af;font-weight:600;line-height:1.6">' +
        '💡 <strong>Edit harga per produk:</strong><br>' +
        '• Kosongkan = pakai harga default + markup<br>' +
        '• Isi = override harga dengan nilai yang kamu isi<br>' +
        '• Perubahan langsung terlihat di website' +
        '</div>' +
        '</div>';

      const allItems = [].concat(window.GAMES || [], window.DATA_PACKAGES || []);

      allItems.forEach(item => {
        html += '<div class="card">';
        html += '<div class="card-header">';
        html += '<div style="display:flex;align-items:center;gap:12px">';
        html += '<div class="game-markup-icon" style="background:' + item.color + '">' + (item.short || item.name.charAt(0)) + '</div>';
        html += '<div>';
        html += '<div class="card-title">' + item.name + '</div>';
        html += '<div class="card-subtitle">' + item.products.length + ' produk</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        item.products.forEach(p => {
          const key = item.id + '_' + p.id;
          const customPrice = prices[key] || '';
          const finalPrice = customPrice || p.price;

          html += '<div class="product-price-item">' +
            '<div style="flex:1;min-width:0">' +
              '<div class="product-price-name">' + p.name + '</div>' +
              '<div style="font-size:11px;color:#999;font-weight:600">Harga dasar: Rp ' + p.price.toLocaleString('id-ID') + '</div>' +
            '</div>' +
            '<input type="number" class="product-price-input" id="price-' + key + '" ' +
              'value="' + customPrice + '" placeholder="' + p.price + '">' +
            '<button class="product-save-btn" onclick="Admin.saveProductPrice(\'' + item.id + '\',\'' + p.id + '\')">💾</button>' +
          '</div>';
        });

        html += '</div>';
      });

      c.innerHTML = html;
    } catch (e) {
      console.error('[Admin] renderProducts error:', e);
      c.innerHTML = '<div class="card"><p style="color:red">Error: ' + e.message + '</p></div>';
    }
  },

  async saveProductPrice(gameId, productId) {
    const key = gameId + '_' + productId;
    const input = document.getElementById('price-' + key);
    if (!input) return;
    const value = input.value.trim();

    try {
      if (value === '') {
        // Hapus override
        const doc = await this.db.collection('config').doc('prices').get();
        const prices = doc.exists ? doc.data() : {};
        delete prices[key];
        await this.db.collection('config').doc('prices').set(prices);
        alert('✅ Harga direset ke default');
      } else {
        const price = parseInt(value);
        if (price < 0) { alert('Harga harus >= 0'); return; }
        await this.db.collection('config').doc('prices').set({
          [key]: price,
        }, { merge: true });
        alert('✅ Harga disimpan: Rp ' + price.toLocaleString('id-ID'));
      }
    } catch (e) {
      alert('Error: ' + e.message);
    }
  },

  // ============================================
  // USERS
  // ============================================
  async renderUsers(c) {
    c.innerHTML = '<div class="loading-inline">Memuat users...</div>';
    try {
      const snap = await this.db.collection('users').limit(200).get();
      const users = snap.docs.map(d => ({ uid: d.id, ...d.data() }));

      let html = '<div class="stats-grid">' +
        this._statCard('👥', users.length, 'Total Users', 'blue') +
        '</div>';

      html += '<div class="card">' +
        '<div class="card-header">' +
        '<div class="card-title">👥 Users (' + users.length + ')</div>' +
        '</div>' +
        '<div class="table-wrap"><table>' +
        '<thead><tr><th>UID</th><th>Nama</th><th>Email</th><th>Joined</th></tr></thead>' +
        '<tbody>';

      users.forEach(u => {
        const date = u.createdAt ? new Date(u.createdAt).toLocaleDateString('id-ID') : '-';
        html += '<tr>' +
          '<td><code style="font-size:10px">' + u.uid.slice(0, 8) + '</code></td>' +
          '<td>' + (u.avatar || '👤') + ' ' + (u.displayName || '-') + '</td>' +
          '<td style="font-size:11px">' + (u.email || '-') + '</td>' +
          '<td style="font-size:11px">' + date + '</td>' +
          '</tr>';
      });

      html += '</tbody></table></div></div>';

      c.innerHTML = html;
    } catch (e) {
      console.error('[Admin] renderUsers error:', e);
      c.innerHTML = '<div class="card"><p style="color:red">Error: ' + e.message + '</p></div>';
    }
  },

  // ============================================
  // SETTINGS
  // ============================================
  renderSettings(c) {
    c.innerHTML = '<div class="card">' +
      '<div class="card-header"><div class="card-title">🔐 Admin Info</div></div>' +
      '<div style="padding:12px;background:#f8f9fa;border-radius:10px;margin-bottom:12px">' +
        '<div style="font-size:12px;color:#666;margin-bottom:4px">Email</div>' +
        '<div style="font-weight:900">' + (this.user.email || '-') + '</div>' +
      '</div>' +
      '<div style="padding:12px;background:#f8f9fa;border-radius:10px">' +
        '<div style="font-size:12px;color:#666;margin-bottom:4px">UID</div>' +
        '<code style="font-size:11px;word-break:break-all">' + this.user.uid + '</code>' +
      '</div>' +
      '</div>' +

      '<div class="card">' +
      '<div class="card-header"><div class="card-title">🗑️ Danger Zone</div></div>' +
      '<p style="font-size:13px;color:#666;margin-bottom:12px">Hapus semua order (tidak bisa dibalikin)</p>' +
      '<button class="btn-danger btn-full" onclick="Admin.clearAllOrders()">Hapus Semua Order</button>' +
      '</div>' +

      '<div class="card">' +
      '<div class="card-header"><div class="card-title">ℹ️ Info Sistem</div></div>' +
      '<div style="font-size:13px;color:#666;line-height:1.8">' +
        '<div>📦 Version: <strong>YS Store Admin v1</strong></div>' +
        '<div>🎨 Theme: <strong>Biru-Ungu</strong></div>' +
        '<div>🔧 Status: <strong style="color:#10b981">● Online</strong></div>' +
      '</div>' +
      '</div>';
  },

  async clearAllOrders() {
    if (!confirm('⚠️ Hapus SEMUA order?')) return;
    if (!confirm('Yakin? Tidak bisa dibatalkan!')) return;
    try {
      const snap = await this.db.collection('orders').get();
      const batch = this.db.batch();
      snap.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
      alert('✅ Semua order dihapus');
      this.renderOrders(document.getElementById('content'));
    } catch (e) {
      alert('Error: ' + e.message);
    }
  },
};

document.addEventListener('DOMContentLoaded', () => Admin.init());
if (typeof window !== 'undefined') window.Admin = Admin;
console.log('[Admin] YS Store v1 loaded');
