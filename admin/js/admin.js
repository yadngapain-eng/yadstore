const Admin = {
  section: 'dash', password: 'admin123',

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
        const titles = { dash: 'Dashboard', orders: 'Pesanan', products: 'Produk', settings: 'Pengaturan' };
        document.getElementById('sec-title').textContent = titles[this.section] || this.section;
        this.render();
      });
    });
  },

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

  render() {
    const c = document.getElementById('content');
    if (this.section === 'dash') c.innerHTML = this.dash();
    else if (this.section === 'orders') c.innerHTML = this.orders();
    else if (this.section === 'products') c.innerHTML = this.products();
    else if (this.section === 'settings') c.innerHTML = this.settings();
  },

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

  products() {
    const all = [...(window.GAMES || []), ...(window.DATA_PACKAGES || [])];
    let html = '';
    all.forEach(item => {
      html += '<div class="card"><h3>' + item.name + '</h3><table><thead><tr><th>Produk</th><th>Harga</th></tr></thead><tbody>' +
        item.products.map(p => '<tr><td>' + p.name + '</td><td>Rp ' + p.price.toLocaleString('id-ID') + '</td></tr>').join('') +
        '</tbody></table></div>';
    });
    return html;
  },

  settings() {
    return '<div class="card"><h3>Ganti Password</h3>' +
      '<div class="form-group"><label>Password Baru</label><input type="text" id="new-pwd"></div>' +
      '<button class="btn-primary" onclick="Admin.savePwd()">Simpan</button></div>' +
      '<div class="card"><h3>Reset Data</h3>' +
      '<button class="btn-danger" onclick="Admin.reset()">Hapus Semua Order</button></div>';
  },

  savePwd() {
    const v = document.getElementById('new-pwd').value;
    if (v) { this.password = v; alert('Password diubah!'); }
  },

  reset() {
    if (!confirm('Reset semua order?')) return;
    localStorage.removeItem('yadstore_orders');
    alert('Direset!');
    location.reload();
  },
};

document.addEventListener('DOMContentLoaded', () => Admin.init());
if (typeof window !== 'undefined') window.Admin = Admin;
