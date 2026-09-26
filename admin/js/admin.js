/* ============================================
   YADSTORE — ADMIN PANEL (Firebase Auth)
   ============================================ */

const Admin = {
  user: null,
  isAdmin: false,
  section: 'dash',
  auth: null,
  db: null,

  // ============================================
  // INIT
  // ============================================
  async init() {
    console.log('[Admin] Init...');

    // Init Firebase
    if (typeof firebase !== 'undefined') {
      if (!firebase.apps.length) {
        firebase.initializeApp(window.FIREBASE_CONFIG);
      }
      this.auth = firebase.auth();
      this.db = firebase.firestore();

      // Listen auth state
      this.auth.onAuthStateChanged(async (user) => {
        this.user = user;

        if (!user) {
          // Belum login
          this.showLogin();
          return;
        }

        // Cek admin claim
        try {
          const idTokenResult = await user.getIdTokenResult(true);
          this.isAdmin = idTokenResult.claims.admin === true;

          console.log('[Admin] User:', user.email, '| Admin:', this.isAdmin);

          if (this.isAdmin) {
            this.showAdmin();
            this.updateUserInfo();
            this.render();
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

    // Nav clicks
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
          products: 'Produk & Markup',
          users: 'Users',
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

  // ============================================
  // AUTH
  // ============================================
  async loginGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await this.auth.signInWithPopup(provider);
      // Akan trigger onAuthStateChanged
    } catch (e) {
      console.error('[Admin] login error:', e);
      alert('Login gagal: ' + e.message);
    }
  },

  async logout() {
    if (this.auth) {
      await this.auth.signOut();
      location.reload();
    }
  },

  // ============================================
  // RENDER
  // ============================================
  render() {
    const c = document.getElementById('content');
    if (this.section === 'dash') this.renderDash(c);
    else if (this.section === 'orders') this.renderOrders(c);
    else if (this.section === 'withdrawals') this.renderWithdrawals(c);
    else if (this.section === 'products') this.renderProducts(c);
    else if (this.section === 'users') this.renderUsers(c);
    else if (this.section === 'settings') this.renderSettings(c);
  },

  // ============================================
  // DASHBOARD
  // ============================================
  async renderDash(c) {
    c.innerHTML = '<div class="loading-inline">Memuat data...</div>';

    try {
      // Count orders
      const ordersSnap = await this.db.collection('orders').get();
      const orders = ordersSnap.docs.map(d => d.data());

      const total = orders.reduce((s, o) => s + (o.total || 0), 0);
      const pending = orders.filter(o => o.status === 'pending').length;
      const processing = orders.filter(o => o.status === 'processing').length;
      const success = orders.filter(o => o.status === 'success').length;

      // Count withdrawals
      const wdSnap = await this.db.collection('withdrawals').get();
      const wds = wdSnap.docs.map(d => d.data());
      const wdPending = wds.filter(w => w.status === 'pending').length;
      const wdTotal = wds.filter(w => w.status === 'pending').reduce((s, w) => s + (w.amount || 0), 0);

      // Count users
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
      console.error('[Admin] dash error:', e);
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

      if (orders.length === 0) {
        c.innerHTML = '<div class="card"><p class="empty-msg">Belum ada order</p></div>';
        return;
      }

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

      if (wds.length === 0) {
        c.innerHTML = '<div class="card"><p class="empty-msg">Belum ada withdraw request</p></div>';
        return;
      }

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
            '</td>' +
            '</tr>';
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
    } catch (e) {
      alert('Error: ' + e.message);
    }
  },

  async rejectWd(id) {
    if (!confirm('Reject withdraw ini? Saldo akan dikembalikan ke user.')) return;
    try {
      // Get withdrawal data
      const doc = await this.db.collection('withdrawals').doc(id).get();
      const wd = doc.data();

      // Update status
      await this.db.collection('withdrawals').doc(id).update({
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        rejectedBy: this.user.email,
      });

      alert('❌ Rejected! (Kembalikan saldo manual ke user)');
      this.renderWithdrawals(document.getElementById('content'));
    } catch (e) {
      alert('Error: ' + e.message);
    }
  },

  // ============================================
  // PRODUCTS & MARKUP
  // ============================================
  async renderProducts(c) {
    c.innerHTML = '<div class="loading-inline">Memuat config...</div>';
    try {
      // Load markup config
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
    } catch (e) {
      alert('Error: ' + e.message);
    }
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
  // SETTINGS
  // ============================================
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
    } catch (e) {
      alert('Error: ' + e.message);
    }
  },
};

document.addEventListener('DOMContentLoaded', () => Admin.init());
if (typeof window !== 'undefined') window.Admin = Admin;
