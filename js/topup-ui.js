const TopUpUI = {
  currentItem: null, currentProduct: null, userData: {}, proofImage: null,

  fmt(n) { try { return n.toLocaleString('id-ID'); } catch(e) { return '' + n; } },

  render() {
    try {
      var c = document.getElementById('topup-grid');
      if (!c) { console.error('[TopUpUI] topup-grid not found'); return; }
      var items = this.getItems();
      console.log('[TopUpUI] rendering ' + items.length + ' items');
      if (items.length === 0) {
        c.innerHTML = '<p class="empty-msg">Tidak ada layanan</p>';
        return;
      }
      c.innerHTML = items.map(function(item) {
        var initial = item.name.charAt(0);
        return '<div class="game-card" onclick="TopUpUI.open(\'' + item.id + '\')" style="--game-color: ' + item.color + '">' +
          '<div class="game-icon-fallback" style="background:' + item.color + '">' + item.icon + '</div>' +
          '<div class="game-info"><h3>' + item.name + '</h3><p>' + item.desc + '</p></div></div>';
      }).join('');
    } catch (e) {
      console.error('[TopUpUI] render error:', e);
      var c2 = document.getElementById('topup-grid');
      if (c2) c2.innerHTML = '<p class="empty-msg" style="color:#ff4b4b">Error: ' + e.message + '</p>';
    }
  },

  getItems() {
    try {
      var games = window.GAMES || [];
      var pkgs = window.DATA_PACKAGES || [];
      return games.concat(pkgs);
    } catch (e) {
      console.error('[TopUpUI] getItems error:', e);
      return [];
    }
  },

  open(id) {
    try {
      var all = this.getItems();
      var item = all.find(function(i) { return i.id === id; });
      if (!item) return;
      this.currentItem = item;
      var m = document.getElementById('game-modal');
      m.innerHTML = '<div class="modal-content">' +
        '<div class="modal-header" style="background: ' + item.color + '">' +
        '<button class="modal-close" onclick="TopUpUI.close()">X</button>' +
        '<div style="font-size:40px;font-weight:900;color:white">' + item.icon + '</div>' +
        '<h2>' + item.name + '</h2><p>' + item.desc + '</p></div>' +
        '<div class="modal-body">' +
        (item.fields && item.fields.length > 0 ? '<h3 class="section-title">Data Akun</h3>' +
          item.fields.map(function(f) { return '<div class="form-group"><label>' + f.label + '</label>' +
            '<input type="text" id="field-' + f.id + '" placeholder="' + f.placeholder + '"></div>'; }).join('') : '') +
        '<h3 class="section-title">Pilih Nominal</h3>' +
        '<div class="products-grid">' +
        item.products.map(function(p) { return '<div class="product-card" onclick="TopUpUI.pick(\'' + p.id + '\')">' +
          '<div class="product-name">' + p.name + '</div>' +
          (p.bonus ? '<div class="product-bonus">' + p.bonus + '</div>' : '') +
          '<div class="product-price">Rp ' + TopUpUI.fmt(p.price) + '</div></div>'; }).join('') +
        '</div></div></div>';
      m.classList.add('active');
    } catch (e) { console.error('[TopUpUI] open error:', e); }
  },

  pick(pid) {
    var item = this.currentItem;
    var p = item.products.find(function(x) { return x.id === pid; });
    if (!p) return;
    var ud = {};
    if (item.fields) {
      for (var i = 0; i < item.fields.length; i++) {
        var f = item.fields[i];
        var v = document.getElementById('field-' + f.id);
        v = v ? v.value.trim() : '';
        if (!v) { Animate.toast('Isi ' + f.label + '!', 'error'); return; }
        ud[f.id] = v;
      }
    }
    this.currentProduct = p; this.userData = ud;
    this.showOrder();
  },

  showOrder() {
    var item = this.currentItem; var p = this.currentProduct;
    var m = document.getElementById('game-modal');
    m.innerHTML = '<div class="modal-content">' +
      '<div class="modal-header" style="background: ' + item.color + '">' +
      '<button class="modal-close" onclick="TopUpUI.close()">X</button>' +
      '<h2>Konfirmasi</h2></div>' +
      '<div class="modal-body">' +
      '<div class="order-summary">' +
      '<div class="order-row"><span>Layanan</span><strong>' + item.name + '</strong></div>' +
      '<div class="order-row"><span>Item</span><strong>' + p.name + '</strong></div>' +
      Object.keys(this.userData).map(function(k) { return '<div class="order-row"><span>' + k + '</span><strong>' + TopUpUI.userData[k] + '</strong></div>'; }).join('') +
      '<div class="order-row total"><span>Total</span><strong>Rp ' + TopUpUI.fmt(p.price) + '</strong></div></div>' +
      '<h3 class="section-title">Pilih Pembayaran</h3>' +
      '<div class="payments-grid">' +
      PAYMENTS.map(function(pay) { return '<div class="payment-card" onclick="TopUpUI.submit(\'' + pay.id + '\')">' +
        '<div class="payment-name">' + pay.name + '</div>' +
        (pay.fee > 0 ? '<div class="payment-fee">+Rp ' + TopUpUI.fmt(pay.fee) + '</div>' : '<div class="payment-fee">Gratis</div>') +
        '</div>'; }).join('') + '</div>' +
      '<button class="btn-secondary btn-full" onclick="TopUpUI.open(\'' + item.id + '\')">Kembali</button>' +
      '</div></div>';
  },

  submit(pid) {
    var pay = PAYMENTS.find(function(p) { return p.id === pid; });
    var order = {
      id: 'YDS' + Date.now().toString(36).toUpperCase(),
      item: this.currentItem.name, itemIcon: this.currentItem.icon,
      product: this.currentProduct.name, price: this.currentProduct.price,
      fee: pay.fee, total: this.currentProduct.price + pay.fee,
      userData: this.userData, payment: pay.name, status: 'pending',
      proof: null, date: new Date().toISOString(),
    };
    var orders = this.getOrders();
    orders.unshift(order);
    this.saveOrders(orders);
    this.showPayment(order, pay);
  },

  showPayment(order, pay) {
    var m = document.getElementById('game-modal');
    m.innerHTML = '<div class="modal-content">' +
      '<div class="modal-header" style="background: #58cc02">' +
      '<button class="modal-close" onclick="TopUpUI.close()">X</button>' +
      '<h2>Pembayaran</h2><p>Order: ' + order.id + '</p></div>' +
      '<div class="modal-body">' +
      '<div class="order-summary"><div class="order-row"><span>Total Bayar</span><strong style="color:#58cc02;font-size:20px">Rp ' + TopUpUI.fmt(order.total) + '</strong></div></div>' +
      '<div class="payment-info"><h3 class="section-title">Bayar via ' + pay.name + '</h3>' +
      '<div class="pay-detail">' +
      '<div class="pay-row"><span>Metode</span><strong>' + pay.name + '</strong></div>' +
      '<div class="pay-row"><span>Nominal</span><strong>Rp ' + TopUpUI.fmt(order.total) + '</strong></div>' +
      '<div class="pay-row"><span>Tujuan</span><strong>081234567890 a/n YadStore</strong></div></div></div>' +
      '<h3 class="section-title">Upload Bukti Transfer</h3>' +
      '<div class="form-group"><input type="file" id="proof-input" accept="image/*" onchange="TopUpUI.handleProof(this)">' +
      '<div id="proof-preview"></div></div>' +
      '<button class="btn-primary btn-full" onclick="TopUpUI.confirm(\'' + order.id + '\')">Saya Sudah Bayar</button>' +
      '<button class="btn-secondary btn-full" onclick="TopUpUI.close()">Nanti</button>' +
      '</div></div>';
  },

  handleProof(input) {
    var f = input.files && input.files[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) { Animate.toast('Max 2MB', 'error'); return; }
    var rd = new FileReader();
    var self = this;
    rd.onload = function(e) {
      self.proofImage = e.target.result;
      var prev = document.getElementById('proof-preview');
      if (prev) prev.innerHTML = '<img src="' + self.proofImage + '" style="max-width:100%;max-height:200px;border-radius:8px;margin-top:8px">';
      Animate.toast('Bukti terupload', 'success');
    };
    rd.readAsDataURL(f);
  },

  confirm(id) {
    if (!this.proofImage) { Animate.toast('Upload bukti dulu!', 'error'); return; }
    var orders = this.getOrders();
    var o = orders.find(function(x) { return x.id === id; });
    if (o) { o.proof = this.proofImage; o.status = 'processing'; this.saveOrders(orders); }
    this.proofImage = null;
    var m = document.getElementById('game-modal');
    m.innerHTML = '<div class="modal-content"><div class="modal-body success-body">' +
      '<div class="success-icon">OK</div><h2>Pesanan Dikirim!</h2>' +
      '<p class="success-sub">Order: ' + id + '</p>' +
      '<p style="color:#777;margin:16px 0">Admin akan verifikasi segera.</p>' +
      '<button class="btn-primary btn-full" onclick="TopUpUI.close(); App.switchTab(\'orders\')">Lihat Pesanan</button>' +
      '</div></div>';
    Animate.confetti();
  },

  getOrders() {
    try { return JSON.parse(localStorage.getItem('yadstore_orders') || '[]'); } catch(e) { return []; }
  },
  saveOrders(o) { try { localStorage.setItem('yadstore_orders', JSON.stringify(o)); } catch(e) {} },

  renderOrders() {
    var c = document.getElementById('orders-list');
    if (!c) return;
    var orders = this.getOrders();
    if (!orders.length) { c.innerHTML = '<p class="empty-msg">Belum ada pesanan.</p>'; return; }
    c.innerHTML = orders.map(function(o) {
      return '<div class="order-card"><div class="order-card-header">' +
        '<strong>' + o.item + '</strong>' +
        '<span class="order-status status-' + o.status + '">' + o.status.toUpperCase() + '</span></div>' +
        '<div class="order-card-body">' +
        '<div class="order-info"><span>Item</span><strong>' + o.product + '</strong></div>' +
        '<div class="order-info"><span>Order ID</span><strong>' + o.id + '</strong></div>' +
        '<div class="order-info"><span>Bayar</span><strong>' + o.payment + '</strong></div>' +
        '<div class="order-info total"><span>Total</span><strong>Rp ' + TopUpUI.fmt(o.total) + '</strong></div>' +
        (o.proof ? '<img src="' + o.proof + '" style="max-width:100%;border-radius:8px;margin-top:8px">' : '') +
        '</div></div>';
    }).join('');
  },

  close() {
    var m = document.getElementById('game-modal');
    if (m) { m.classList.remove('active'); m.innerHTML = ''; }
    this.currentItem = null; this.currentProduct = null; this.userData = {}; this.proofImage = null;
  },
};
console.log('[topup-ui] loaded');
if (typeof window !== 'undefined') window.TopUpUI = TopUpUI;
