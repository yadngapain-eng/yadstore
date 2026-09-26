/* ============================================
   YADSTORE — ADMIN PANEL v2 + MARKUP
   ============================================ */

const Admin = {
  section: 'dash',
  password: 'admin123',

  PRICE_KEY: 'yadstore_prices',
  MARKUP_KEY: 'yadstore_config',

  init() {
    // Load password
    try {
      const savedPwd = localStorage.getItem('yadstore_admin_pwd');
      if (savedPwd) this.password = savedPwd;
    } catch(e) {}

    if (sessionStorage.getItem('yadstore_admin') === 'true') {
      document.getElementById('login-modal').classList.remove('active');
      this.render();
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
          products: 'Produk & Markup',
          settings: 'Pengaturan'
        };
        document.getElementById('sec-title').textContent = titles[this.section] || this.section;
        this.render();
      });
    });
  },

  // ============================================
  // LOGIN / LOGOUT
  // ============================================
  login() {
    const pwd = document.getElementById('login-pwd').value;
    if (pwd === this.password) {
      sessionStorage.setItem('yadstore_admin', 'true');
      document.getElementById('login-modal').classList.remove('active');
      this.render();
    } else {
      alert('Password salah!');
    }
  },

  logout() {
    sessionStorage.removeItem('yadstore_admin');
    document.getElementById('login-modal').classList.add('active');
    document.getElementById('login-pwd').value = '';
  },

  // ============================================
  // STORAGE
  // ============================================
  getPrices() {
    try { return JSON.parse(localStorage.getItem(this.PRICE_KEY) || '{}'); } catch(e) { return {}; }
  },
  savePrices(p) { localStorage.setItem(this.PRICE_KEY, JSON.stringify(p)); },

  getMarkup() {
    try { return JSON.parse(localStorage.getItem(this.MARKUP_KEY) || '{}'); } catch(e) { return {}; }
  },
  saveMarkup(m) { localStorage.setItem(this.MARKUP_KEY, JSON.stringify(m)); },

  getGlobalMarkup() {
    const m = this.getMarkup();
    return m.global_markup || 0;
  },

  // ============================================
  // RENDER
  // ============================================
  render() {
    const c = document.getElementById('content');
    if (this.section === 'dash') c.innerHTML = this.dash();
    else if (this.section === 'orders') c.innerHTML = this.orders();
    else if (this.section === 'products') c.innerHTML = this.products();
    else if (this.section === 'settings') c.innerHTML = this.settings();
  },

  // ============================================
  // DASHBOARD
  // ============================================
  getOrders() {
    try { return JSON.parse(localStorage.getItem('yadstore_orders') || '[]'); } catch(e) { return []; }
  },

  dash() {
    const orders = this.getOrders();
    const total = orders.reduce((s, o) => s + (o.total || 0), 0);
    const pending = orders.filter(o => o.status === 'pending').length;
    const processing = orders.filter(o => o.status === 'processing').length;
    const success = orders.filter(o => o.status === 'success').length;

    return '<div class="stats-grid">' +
      '<div class="stat-card"><div class="stat-val">' + orders.length + '</div><div class="stat-label">Total Order</div></div>' +
      '<div class="stat-card"><div class="stat-val">Rp ' + total.toLocaleString('id-ID') + '</div><div class="stat-label">Revenue</div></div>' +
      '<div class="stat-card"><div class="stat-val">' + pending + '</div><div class="stat-label">Pending</div></div>' +
      '<div class="stat-card"><div class="stat-val">' + processing + '</div><div class="stat-label">Diproses</div></div>' +
      '<div class="stat-card"><div class="stat-val">' + success + '</div><div class="stat-label">Sukses</div></div>' +
      '</div>' +
      '<div class="card"><h3>Order Terbaru</h3>' +
      (orders.length === 0 ? '<p style="color:#777">Belum ada order</p>' :
      '<table><thead><tr><th>ID</th><th>Layanan</th><th>Produk</th><th>Total</th><th>Status</th></tr></thead><tbody>' +
      orders.slice(0, 10).map(o => '<tr><td><strong>' + o.id + '</strong></td><td>' + o.item + '</td><td>' + o.product + '</td><td>Rp ' + (o.total||0).toLocaleString('id-ID') + '</td><td><span class="badge badge-' + o.status + '">' + o.status + '</span></td></tr>').join('') +
      '</tbody></table>') + '</div>';
  },

  // ============================================
  // ORDERS
  // ============================================
  orders() {
    const orders = this.getOrders();
    if (!orders.length) return '<div class="card"><p style="color:#777">Belum ada order</p></div>';
    return '<div class="card"><h3>Semua Pesanan</h3><table><thead><tr><th>ID</th><th>Layanan</th><th>Produk</th><th>User</th><th>Total</th><th>Status</th><th>Ubah</th></tr></thead><tbody>' +
      orders.map(o => '<tr>' +
        '<td><strong>' + o.id + '</strong></td>' +
        '<td>' + o.item + '</td>' +
        '<td>' + o.product + '</td>' +
        '<td>' + (Object.values(o.userData || {}).join(' / ') || '-') + '</td>' +
        '<td>Rp ' + (o.total||0).toLocaleString('id-ID') + '</td>' +
        '<td><span class="badge badge-' + o.status + '">' + o.status + '</span></td>' +
        '<td><select onchange="Admin.setStatus(\'' + o.id + '\', this.value)"><option value="pending"' + (o.status==='pending'?' selected':'') + '>Pending</option><option value="processing"' + (o.status==='processing'?' selected':'') + '>Processing</option><option value="success"' + (o.status==='success'?' selected':'') + '>Success</option><option value="failed"' + (o.status==='failed'?' selected':'') + '>Failed</option></select></td>' +
        '</tr>').join('') + '</tbody></table></div>';
  },

  setStatus(id, status) {
    const orders = this.getOrders();
    const o = orders.find(x => x.id === id);
    if (o) o.status = status;
    localStorage.setItem('yadstore_orders', JSON.stringify(orders));
  },

  // ============================================
  // PRODUCTS + MARKUP (FITUR BARU)
  // ============================================
  products() {
    const globalMarkup = this.getGlobalMarkup();
    const prices = this.getPrices();
    const all = [].concat(window.GAMES || [], window.DATA_PACKAGES || []);

    // ===== PANEL GLOBAL MARKUP =====
    let html = '<div class="card" style="background:linear-gradient(135deg,#f0fff0,#e6ffe6);border:2px solid #89e219">' +
      '<h3 style="color:#2c5a00">⚡ Global Markup — Semua Produk</h3>' +
      '<p style="color:#555;font-size:13px;margin-bottom:14px">Naikkan harga SEMUA produk sekaligus dengan nominal tertentu</p>' +

      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">' +
      '<button class="btn-preset" onclick="Admin.applyGlobalMarkup(500)">+ Rp 500</button>' +
      '<button class="btn-preset" onclick="Admin.applyGlobalMarkup(1000)">+ Rp 1.000</button>' +
      '<button class="btn-preset" onclick="Admin.applyGlobalMarkup(2000)">+ Rp 2.000</button>' +
      '<button class="btn-preset" onclick="Admin.applyGlobalMarkup(3000)">+ Rp 3.000</button>' +
      '<button class="btn-preset" onclick="Admin.applyGlobalMarkup(5000)">+ Rp 5.000</button>' +
      '<button class="btn-preset" onclick="Admin.applyGlobalMarkup(10000)">+ Rp 10.000</button>' +
      '</div>' +

      '<div style="display:flex;gap:8px;margin-bottom:14px">' +
      '<input type="number" id="custom-markup" placeholder="Nominal lain (contoh: 1500)" style="flex:1;padding:12px;border:2px solid #e5e5e5;border-radius:8px;font-size:14px;font-weight:700">' +
      '<button class="btn-primary" onclick="Admin.applyCustomMarkup()" style="padding:12px 24px">Terapkan</button>' +
      '</div>' +

      '<div style="background:white;padding:12px;border-radius:8px;margin-bottom:12px">' +
      '<strong style="color:#2c5a00;font-size:14px">💰 Global markup aktif: +Rp ' + globalMarkup.toLocaleString('id-ID') + '</strong>' +
      '</div>' +

      '<button class="btn-danger" onclick="Admin.resetAllMarkup()" style="width:100%">🔄 Reset Semua Markup</button>' +
      '</div>';

    // ===== DAFTAR PRODUK =====
    html += '<div class="card"><h3>📋 Daftar Produk & Harga</h3>' +
      '<p style="color:#666;font-size:13px;margin-bottom:14px">Edit harga per produk atau tambah markup individual</p>' +
      '<div style="max-height:600px;overflow-y:auto">';

    all.forEach(item => {
      html += '<div style="margin-bottom:20px;border:1px solid #eee;border-radius:12px;overflow:hidden">' +
        '<div style="padding:12px;background:#f7f7f7;font-weight:900;font-size:14px">' +
        (item.icon || '') + ' ' + item.name +
        '</div>' +
        '<table style="width:100%"><thead><tr style="background:#fafafa">' +
        '<th style="padding:8px;font-size:11px;text-align:left">Produk</th>' +
        '<th style="padding:8px;font-size:11px;text-align:right">Dasar</th>' +
        '<th style="padding:8px;font-size:11px;text-align:right">Jual</th>' +
        '<th style="padding:8px;font-size:11px;text-align:center">Markup</th>' +
        '<th style="padding:8px;font-size:11px;text-align:center">Aksi</th>' +
        '</tr></thead><tbody>';

      item.products.forEach(p => {
        const key = item.id + '_' + p.id;
        const custom = prices[key] || {};
        const finalPrice = custom.final || (p.price + globalMarkup);
        const diff = finalPrice - p.price;
        const diffColor = diff > 0 ? '#58cc02' : (diff < 0 ? '#ff4b4b' : '#999');
        const diffText = diff >= 0 ? '+' + diff.toLocaleString('id-ID') : diff.toLocaleString('id-ID');

        html += '<tr style="border-bottom:1px solid #f0f0f0">' +
          '<td style="padding:8px;font-size:12px">' + p.name + '</td>' +
          '<td style="padding:8px;font-size:12px;text-align:right;color:#888">' + p.price.toLocaleString('id-ID') + '</td>' +
          '<td style="padding:8px;text-align:right">' +
          '<input type="number" value="' + finalPrice + '" ' +
          'onchange="Admin.updatePrice(\'' + item.id + '\', \'' + p.id + '\', this.value)" ' +
          'style="width:90px;padding:6px 8px;border:2px solid #e5e5e5;border-radius:6px;font-size:12px;font-weight:700;text-align:right">' +
          '</td>' +
          '<td style="padding:8px;font-size:11px;font-weight:800;color:' + diffColor + ';text-align:center">' + diffText + '</td>' +
          '<td style="padding:8px;text-align:center">' +
          '<button onclick="Admin.resetPrice(\'' + item.id + '\', \'' + p.id + '\')" ' +
          'style="padding:4px 8px;background:#f0f0f0;border:none;border-radius:6px;font-size:10px;font-weight:700;cursor:pointer">Reset</button>' +
          '</td>' +
          '</tr>';
      });

      html += '</tbody></table></div>';
    });

    html += '</div></div>';

    return html;
  },

  // ===== UPDATE HARGA 1 PRODUK =====
  updatePrice(itemId, prodId, value) {
    const price = parseInt(value) || 0;
    const prices = this.getPrices();
    const key = itemId + '_' + prodId;
    prices[key] = { final: price, updated: new Date().toISOString() };
    this.savePrices(prices);
    // Show toast
    if (typeof Animate !== 'undefined') Animate.toast('Harga diupdate: Rp ' + price.toLocaleString('id-ID'), 'success');
  },

  // ===== RESET HARGA 1 PRODUK =====
  resetPrice(itemId, prodId) {
    const prices = this.getPrices();
    delete prices[itemId + '_' + prodId];
    this.savePrices(prices);
    this.render();
    if (typeof Animate !== 'undefined') Animate.toast('Harga direset', 'info');
  },

  // ===== GLOBAL MARKUP =====
  applyGlobalMarkup(amount) {
    const m = this.getMarkup();
    m.global_markup = (m.global_markup || 0) + amount;
    this.saveMarkup(m);
    if (typeof Animate !== 'undefined') Animate.toast('Markup +Rp ' + amount.toLocaleString('id-ID'), 'success');
    else alert('Markup ditambah +Rp ' + amount.toLocaleString('id-ID'));
    this.render();
  },

  applyCustomMarkup() {
    const input = document.getElementById('custom-markup');
    const amount = parseInt(input.value) || 0;
    if (amount === 0) { alert('Masukkan nominal > 0'); return; }
    this.applyGlobalMarkup(amount);
    input.value = '';
  },

  resetAllMarkup() {
    if (!confirm('⚠️ Reset SEMUA markup ke harga default?')) return;
    localStorage.removeItem(this.PRICE_KEY);
    localStorage.removeItem(this.MARKUP_KEY);
    alert('✅ Semua markup direset!');
    this.render();
  },

  // ============================================
  // SETTINGS
  // ============================================
  settings() {
    return '<div class="card"><h3>🔐 Ganti Password</h3>' +
      '<div class="form-group"><label>Password Baru</label>' +
      '<input type="text" id="new-pwd" value="' + this.password + '"></div>' +
      '<button class="btn-primary" onclick="Admin.savePwd()">Simpan</button></div>' +

      '<div class="card"><h3>📞 Nomor WhatsApp Admin</h3>' +
      '<div class="form-group"><label>Nomor WA</label>' +
      '<input type="text" id="cfg-wa" placeholder="628xxx" value="' + (localStorage.getItem('yadstore_wa') || '') + '"></div>' +
      '<button class="btn-primary" onclick="Admin.saveWa()">Simpan</button></div>' +

      '<div class="card" style="background:#fff9e6;border:2px solid #ffe58f">' +
      '<h3 style="color:#7a5d00">⚠️ Danger Zone</h3>' +
      '<p style="color:#7a5d00;font-size:13px;margin-bottom:12px">Hapus semua order (tidak bisa dibalikin)</p>' +
      '<button class="btn-danger" onclick="Admin.resetOrders()">Hapus Semua Order</button>' +
      '</div>';
  },

  savePwd() {
    const v = document.getElementById('new-pwd').value;
    if (v) {
      this.password = v;
      localStorage.setItem('yadstore_admin_pwd', v);
      alert('✅ Password diubah!');
    }
  },

  saveWa() {
    const wa = document.getElementById('cfg-wa').value;
    localStorage.setItem('yadstore_wa', wa);
    alert('✅ Nomor WA disimpan!');
  },

  resetOrders() {
    if (!confirm('Hapus SEMUA order?')) return;
    localStorage.removeItem('yadstore_orders');
    alert('✅ Order dihapus');
    this.render();
  },
};

document.addEventListener('DOMContentLoaded', () => Admin.init());
if (typeof window !== 'undefined') window.Admin = Admin;
