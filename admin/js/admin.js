/* ============================================
   YADSTORE — ADMIN PANEL v2
   + Fitur Markup Harga
   ============================================ */

const Admin = {
  section: 'dash',
  password: 'admin123',

  // ============================================
  // STORAGE KEYS
  // ============================================
  PRICE_KEY: 'yadstore_prices',
  CONFIG_KEY: 'yadstore_config',

  // ============================================
  // INIT
  // ============================================
  init() {
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
        const titles = { dash: 'Dashboard', orders: 'Pesanan', products: 'Produk & Markup', settings: 'Pengaturan' };
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
  // PRICE MARKUP STORAGE
  // ============================================
  getPrices() {
    try { return JSON.parse(localStorage.getItem(this.PRICE_KEY) || '{}'); } catch(e) { return {}; }
  },
  savePrices(p) {
    localStorage.setItem(this.PRICE_KEY, JSON.stringify(p));
  },
  getMarkup() {
    try { return JSON.parse(localStorage.getItem(this.CONFIG_KEY) || '{}'); } catch(e) { return {}; }
  },
  saveMarkup(c) {
    localStorage.setItem(this.CONFIG_KEY, JSON.stringify(c));
  },
  getConfig() {
    try { return JSON.parse(localStorage.getItem('yadstore_cfg') || '{}'); } catch(e) { return {}; }
  },

  // Ambil harga final (dengan markup)
  getFinalPrice(itemId, prodId, defaultPrice) {
    const prices = this.getPrices();
    const key = itemId + '_' + prodId;
    if (prices[key] && prices[key].final) return prices[key].final;
    const markup = this.getMarkup();
    const add = markup.global_markup || 0;
    return defaultPrice + add;
  },

  // Set harga final untuk 1 produk
  setProductPrice(itemId, prodId, finalPrice) {
    const prices = this.getPrices();
    const key = itemId + '_' + prodId;
    if (!prices[key]) prices[key] = {};
    prices[key].final = parseInt(finalPrice) || 0;
    prices[key].updated = new Date().toISOString();
    this.savePrices(prices);
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
  // PRODUCTS & MARKUP (FITUR BARU)
  // ============================================
  products() {
    const markup = this.getMarkup();
    const globalMarkup = markup.global_markup || 0;

    // ===== GLOBAL MARKUP PANEL =====
    let html = '<div class="card" style="background:linear-gradient(135deg,#f0fff0,#e6ffe6);border-color:#89e219">' +
      '<h3>⚡ Global Markup (Semua Produk)</h3>' +
      '<p style="color:#666;font-size:13px;margin-bottom:12px">Naikkan harga SEMUA produk sekaligus dengan nominal tertentu</p>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">' +
      '<button class="btn-preset" onclick="Admin.applyGlobalMarkup(500)">+ Rp 500</button>' +
      '<button class="btn-preset" onclick="Admin.applyGlobalMarkup(1000)">+ Rp 1.000</button>' +
      '<button class="btn-preset" onclick="Admin.applyGlobalMarkup(2000)">+ Rp 2.000</button>' +
      '<button class="btn-preset" onclick="Admin.applyGlobalMarkup(3000)">+ Rp 3.000</button>' +
      '<button class="btn-preset" onclick="Admin.applyGlobalMarkup(5000)">+ Rp 5.000</button>' +
      '<button class="btn-preset" onclick="Admin.applyGlobalMarkup(10000)">+ Rp 10.000</button>' +
      '</div>' +
      '<div style="display:flex;gap:8px">' +
      '<input type="number" id="custom-markup" placeholder="Nominal lain..." style="flex:1;padding:10px;border:2px solid #e5e5e5;border-radius:8px;font-size:14px;font-weight:700">' +
      '<button class="btn-primary" onclick="Admin.applyCustomMarkup()">Terapkan</button>' +
      '</div>' +
      '<p style="margin-top:12px;font-size:13px;color:#555"><strong>Global markup aktif:</strong> +Rp ' + globalMarkup.toLocaleString('id-ID') + '</p>' +
      '<button class="btn-danger" style="margin-top:8px" onclick="Admin.resetAllMarkup()">Reset Semua Markup</button>' +
      '</div>';

    // ===== DAFTAR PRODUK =====
    const all = [...(window.GAMES || []), ...(window.DATA_PACKAGES || [])];
    const prices = this.getPrices();

    html += '<div class="card"><h3>Daftar Produk & Harga</h3>' +
      '<p style="color:#666;font-size:13px;margin-bottom:12px">Edit harga satu-satu, atau tambah markup individual</p>' +
      '<div style="max-height:600px;overflow-y:auto">';

    all.forEach(item => {
      html += '<div style="margin-bottom:20px">' +
        '<h4 style="font-size:14px;font-weight:900;margin-bottom:8px;padding:8px;background:#f7f7f7;border-radius:8px">' +
        item.icon + ' ' + item.name +
        '</h4>' +
        '<table><thead><tr><th>Produk</th><th>Harga Dasar</th><th>Harga Jual</th><th>Markup</th><th>Aksi</th></tr></thead><tbody>';

      item.products.forEach(p => {
        const key = item.id + '_' + p.id;
        const custom = prices[key] || {};
        const finalPrice = custom.final || (p.price + globalMarkup);
        const diff = finalPrice - p.price;
        const diffColor = diff > 0 ? '#58cc02' : (diff < 0 ? '#ff4b4b' : '#999');
        const diffText = diff >= 0 ? '+' + diff.toLocaleString('id-ID') : diff.toLocaleString('id-ID');

        html += '<tr>' +
          '<td>' + p.name + '</td>' +
          '<td>Rp ' + p.price.toLocaleString('id-ID') + '</td>' +
          '<td><input type="number" class="price-edit" value="' + finalPrice + '" onchange="Admin.updatePrice(\'' + item.id + '\', \'' + p.id + '\', this.value)" style="width:110px"></td>' +
          '<td style="color:' + diffColor + ';font-weight:800">' + diffText + '</td>' +
          '<td><button class="btn-secondary" style="padding:4px 10px;font-size:11px" onclick="Admin.resetPrice(\'' + item.id + '\', \'' + p.id + '\')">Reset</button></td>' +
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
    this.setProductPrice(itemId, prodId, price);
    this.render();
  },

  // ===== RESET HARGA 1 PRODUK =====
  resetPrice(itemId, prodId) {
    const prices = this.getPrices();
    const key = itemId + '_' + prodId;
    delete prices[key];
    this.savePrices(prices);
    this.render();
  },

  // ===== GLOBAL MARKUP =====
  applyGlobalMarkup(amount) {
    const markup = this.getMarkup();
    markup.global_markup = (markup.global_markup || 0) + amount;
    this.saveMarkup(markup);
    alert('Global markup ditambah +Rp ' + amount.toLocaleString('id-ID') + '\nTotal markup sekarang: Rp ' + markup.global_markup.toLocaleString('id-ID'));
    this.render();
  },

  applyCustomMarkup() {
    const input = document.getElementById('custom-markup');
    const amount = parseInt(input.value) || 0;
    if (amount === 0) { alert('Masukkan nominal'); return; }
    this.applyGlobalMarkup(amount);
  },

  resetAllMarkup() {
    if (!confirm('Reset SEMUA markup dan kembali ke harga dasar?')) return;
    localStorage.removeItem(this.PRICE_KEY);
    localStorage.removeItem(this.CONFIG_KEY);
    alert('Semua markup direset');
    this.render();
  },

  // ============================================
  // SETTINGS
  // ============================================
  settings() {
    const cfg = this.getConfig();
    return '<div class="card"><h3>Ganti Password</h3>' +
      '<div class="form-group"><label>Password Baru</label><input type="text" id="new-pwd" value="' + this.password + '"></div>' +
      '<button class="btn-primary" onclick="Admin.savePwd()">Simpan</button></div>' +

      '<div class="card"><h3>Nomor WhatsApp Admin</h3>' +
      '<div class="form-group"><label>Nomor WA (untuk notifikasi user)</label><input type="text" id="cfg-wa" value="' + (cfg.wa || '') + '" placeholder="628xxx"></div>' +
      '<button class="btn-primary" onclick="Admin.saveCfg()">Simpan</button></div>' +

      '<div class="card" style="background:#fff9e6;border-color:#ffe58f">' +
      '<h3>⚠️ Danger Zone</h3>' +
      '<p style="color:#7a5d00;font-size:13px;margin-bottom:12px">Reset semua data order</p>' +
      '<button class="btn-danger" onclick="Admin.resetOrders()">Hapus Semua Order</button>' +
      '</div>';
  },

  savePwd() {
    const v = document.getElementById('new-pwd').value;
    if (v) {
      this.password = v;
      localStorage.setItem('yadstore_admin_pwd', v);
      alert('Password diubah! (tersimpan di browser ini)');
    }
  },

  saveCfg() {
    const cfg = this.getConfig();
    cfg.wa = document.getElementById('cfg-wa').value;
    localStorage.setItem('yadstore_cfg', JSON.stringify(cfg));
    alert('Nomor WA disimpan!');
  },

  resetOrders() {
    if (!confirm('Hapus SEMUA order?')) return;
    localStorage.removeItem('yadstore_orders');
    alert('Semua order dihapus');
    this.render();
  },
};

// Load password dari storage
try {
  const savedPwd = localStorage.getItem('yadstore_admin_pwd');
  if (savedPwd) Admin.password = savedPwd;
} catch(e) {}

document.addEventListener('DOMContentLoaded', () => Admin.init());
if (typeof window !== 'undefined') window.Admin = Admin;
