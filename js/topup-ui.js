const TopUpUI = {
  // ===== Helper: format tanggal Indonesia =====
  formatDate: function(isoString) {
    if (!isoString) return '-';
    try {
      var d = new Date(isoString);
      var days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
      var months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
      var dayName = days[d.getDay()];
      var day = d.getDate();
      var month = months[d.getMonth()];
      var year = d.getFullYear();
      var hours = String(d.getHours()).padStart(2, '0');
      var mins = String(d.getMinutes()).padStart(2, '0');
      return dayName + ', ' + day + ' ' + month + ' ' + year + ' • ' + hours + ':' + mins;
    } catch(e) { return isoString; }
  },

  // ===== HELPER: Ambil harga final (dengan markup) =====
  getFinalPrice: function(itemId, prodId, defaultPrice) {
    try {
      var prices = JSON.parse(localStorage.getItem('yadstore_prices') || '{}');
      var key = itemId + '_' + prodId;
      if (prices[key] && prices[key].final) return prices[key].final;
      var cfg = JSON.parse(localStorage.getItem('yadstore_config') || '{}');
      var add = cfg.global_markup || 0;
      return defaultPrice + add;
    } catch(e) { return defaultPrice; }
  },

  currentItem: null, currentProduct: null, userData: {}, proofImage: null,
  rendered: false,

  esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); },
  fmt(n) { try { return n.toLocaleString('id-ID'); } catch(e) { return '' + n; } },

  render(force) {
    var c = document.getElementById('topup-grid');
    if (!c) return;
    // Jangan re-render kalau sudah ada & tidak dipaksa
    if (!force && this.rendered && c.children.length > 0) {
      console.log('[TopUpUI] skip re-render');
      return;
    }
    var items = this.getItems();
    var self = this;
    c.innerHTML = items.map(function(item) {
      var initial = item.name.charAt(0);
      return '<div class="game-card" onclick="TopUpUI.open(\'' + item.id + '\')" style="--game-color: ' + item.color + '">' +
        '<div class="game-icon-wrap" style="background: ' + item.color + '15">' +
          '<img src="' + item.icon + '" class="game-icon-img" alt="' + self.esc(item.name) + '" ' +
               'onload="this.style.opacity=1" ' +
               'style="opacity:0;transition:opacity 0.3s" ' +
               'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
          '<div class="game-icon-fallback" style="display:none;background:' + item.color + '">' + initial + '</div>' +
        '</div>' +
        '<div class="game-info"><h3>' + self.esc(item.name) + '</h3><p>' + self.esc(item.desc) + '</p></div>' +
      '</div>';
    }).join('');
    this.rendered = true;
    console.log('[TopUpUI] rendered ' + items.length + ' items');
  },

  getItems() {
    try { return [].concat(window.GAMES || [], window.DATA_PACKAGES || []); } catch (e) { return []; }
  },

  open(id) {
    var all = this.getItems();
    var item = all.find(function(i) { return i.id === id; });
    if (!item) return;
    this.currentItem = item;
    var m = document.getElementById('game-modal');
    var self = this;
    m.innerHTML = '<div class="modal-content">' +
      '<div class="modal-header" style="background: ' + item.color + '">' +
      '<button class="modal-close" onclick="TopUpUI.close()">X</button>' +
      '<div class="modal-icon-wrap">' +
        '<img src="' + item.icon + '" class="modal-icon-img" alt="' + self.esc(item.name) + '" ' +
             'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
        '<div class="modal-icon-fallback" style="display:none;background:rgba(0,0,0,0.2)">' + item.name.charAt(0) + '</div>' +
      '</div>' +
      '<h2>' + self.esc(item.name) + '</h2><p>' + self.esc(item.desc) + '</p></div>' +
      '<div class="modal-body">' +
      (item.fields && item.fields.length > 0 ? '<h3 class="section-title">' + ((typeof I18n !== 'undefined') ? I18n.t('topup_account_data') : 'Data Akun') + '</h3>' +
        item.fields.map(function(f) { return '<div class="form-group"><label>' + self.esc(f.label) + '</label>' +
          '<input type="text" id="field-' + f.id + '" placeholder="' + self.esc(f.placeholder) + '"></div>'; }).join('') : '') +
      '<h3 class="section-title">' + ((typeof I18n !== 'undefined') ? I18n.t('topup_select_nominal') : 'Pilih Nominal') + '</h3>' +
      '<div class="products-grid">' +
      item.products.map(function(p) { return '<div class="product-card" onclick="TopUpUI.pick(\'' + p.id + '\')">' +
        '<div class="product-name">' + self.esc(p.name) + '</div>' +
        (p.bonus ? '<div class="product-bonus">' + self.esc(p.bonus) + '</div>' : '') +
        '<div class="product-price">Rp ' + self.fmt(self.getFinalPrice(item.id, p.id, p.price)) + '</div></div>'; }).join('') +
      '</div></div></div>';
    m.classList.add('active');
  },

  pick(pid) {
    var item = this.currentItem;
    var p = item.products.find(function(x) { return x.id === pid; });
    if (!p) return;
    var ud = {};
    if (item.fields) {
      for (var i = 0; i < item.fields.length; i++) {
        var f = item.fields[i];
        var el = document.getElementById('field-' + f.id);
        var v = el ? el.value.trim() : '';
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
    var self = this;
    m.innerHTML = '<div class="modal-content">' +
      '<div class="modal-header" style="background: ' + item.color + '">' +
      '<button class="modal-close" onclick="TopUpUI.close()">X</button>' +
      '<h2>' + ((typeof I18n !== 'undefined') ? I18n.t('topup_confirm_order') : 'Konfirmasi') + '</h2></div>' +
      '<div class="modal-body">' +
      '<div class="order-summary">' +
      '<div class="order-row"><span>Layanan</span><strong>' + self.esc(item.name) + '</strong></div>' +
      '<div class="order-row"><span>Item</span><strong>' + self.esc(p.name) + '</strong></div>' +
      Object.keys(this.userData).map(function(k) { return '<div class="order-row"><span>' + self.esc(k) + '</span><strong>' + self.esc(self.userData[k]) + '</strong></div>'; }).join('') +
      '<div class="order-row total"><span>Total</span><strong>Rp ' + self.fmt(self.getFinalPrice(item.id, p.id, p.price)) + '</strong></div></div>' +
      '<h3 class="section-title">' + ((typeof I18n !== 'undefined') ? I18n.t('topup_choose_payment') : 'Pilih Pembayaran') + '</h3>' +
      '<div class="payments-grid">' +
      PAYMENTS.map(function(pay) { return '<div class="payment-card" onclick="TopUpUI.submit(\'' + pay.id + '\')">' +
        '<div class="payment-name">' + self.esc(pay.name) + '</div>' +
        (pay.fee > 0 ? '<div class="payment-fee">+Rp ' + self.fmt(pay.fee) + '</div>' : '<div class="payment-fee">Gratis</div>') +
        '</div>'; }).join('') + '</div>' +
      '<button class="btn-secondary btn-full" onclick="TopUpUI.open(\'' + item.id + '\')">Kembali</button>' +
      '</div></div>';
  },

  submit(pid) {
    var pay = PAYMENTS.find(function(p) { return p.id === pid; });
    var order = {
      id: 'YDS' + Date.now().toString(36).toUpperCase(),
      item: this.currentItem.name, itemIcon: this.currentItem.icon,
      product: this.currentProduct.name,
      price: this.getFinalPrice(this.currentItem.id, this.currentProduct.id, this.currentProduct.price),
      fee: pay.fee, total: this.getFinalPrice(this.currentItem.id, this.currentProduct.id, this.currentProduct.price) + pay.fee,
      userData: this.userData, payment: pay.name, status: 'pending',
      proof: null, date: new Date().toISOString(),
    };
    var orders = this.getOrders();
    orders.unshift(order);
    this.saveOrders(orders);
    // Reward top up
    if (typeof Rewards !== 'undefined') {
      try { Rewards.onTopUp(); } catch(e) {}
    }
    this.showPayment(order, pay);
  },

  showPayment(order, pay) {
    var m = document.getElementById('game-modal');
    var self = this;
    var accountInfo = '';
    if (pay.account) {
      accountInfo = '<div class="pay-row"><span>Nomor Rekening</span><strong style="color:#58cc02;font-size:18px;letter-spacing:1px">' + pay.account + '</strong></div>' +
                    '<div class="pay-row"><span>Atas Nama</span><strong>' + (pay.holder || 'YadStore') + '</strong></div>';
    }
    m.innerHTML = '<div class="modal-content">' +
      '<div class="modal-header" style="background: #58cc02">' +
      '<button class="modal-close" onclick="TopUpUI.close()">X</button>' +
      '<h2>' + ((typeof I18n !== 'undefined') ? I18n.t('topup_payment_title') : 'Pembayaran') + '</h2><p>Order: ' + order.id + '</p></div>' +
      '<div class="modal-body">' +
      '<div class="order-summary"><div class="order-row"><span>Total Bayar</span><strong style="color:#58cc02;font-size:20px">Rp ' + self.fmt(order.total) + '</strong></div></div>' +
      '<div class="payment-info"><h3 class="section-title">Bayar via ' + self.esc(pay.name) + '</h3>' +
      '<div class="pay-detail">' +
      '<div class="pay-row"><span>Metode</span><strong>' + self.esc(pay.name) + '</strong></div>' +
      '<div class="pay-row"><span>Nominal</span><strong>Rp ' + self.fmt(order.total) + '</strong></div>' +
      accountInfo +
      '</div></div>' +
      '<div class="payment-notice">' +
      '<p>Transfer sesuai nominal <strong>Rp ' + self.fmt(order.total) + '</strong> ke rekening di atas.</p>' +
      '<p>Setelah transfer, upload bukti di bawah.</p>' +
      '</div>' +
      '<h3 class="section-title">' + ((typeof I18n !== 'undefined') ? I18n.t('topup_upload_proof') : 'Upload Bukti Transfer') + '</h3>' +
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
    if (o) {
      o.proof = this.proofImage;
      o.status = 'processing';
      this.saveOrders(orders);
    }

    // ===== TELEGRAM NOTIFIKASI =====
    if (o && typeof window.TELEGRAM_CONFIG !== 'undefined' && window.TELEGRAM_CONFIG.ENABLED) {
      try {
        var pay = PAYMENTS.find(function(p) { return p.id === o.paymentId; });
        if (!pay) pay = { name: o.payment };
        window.TELEGRAM_CONFIG.notifyOrder(o, pay)
          .then(function() { console.log('[Telegram] Sent!'); })
          .catch(function(e) { console.warn('[Telegram] Error:', e); });
      } catch (e) {
        console.warn('[TopUpUI] Telegram error:', e);
      }
    }

    this.proofImage = null;

    var m = document.getElementById('game-modal');
    m.innerHTML = '<div class="modal-content"><div class="modal-body success-body">' +
      '<div class="success-icon">OK</div><h2>Pesanan Dikirim!</h2>' +
      '<p class="success-sub">Order: ' + id + '</p>' +
      '<p style="color:#777;margin:16px 0">' + ((typeof I18n !== 'undefined') ? I18n.t('topup_success_desc') : 'Admin akan verifikasi segera.') + '</p>' +
      '<button class="btn-primary btn-full" onclick="TopUpUI.close(); App.switchTab(\'orders\')">Lihat Pesanan</button>' +
      '</div></div>';
    Animate.confetti();
  },

  getOrders() { try { return JSON.parse(localStorage.getItem('yadstore_orders') || '[]'); } catch(e) { return []; } },
  saveOrders(o) {
    try { localStorage.setItem('yadstore_orders', JSON.stringify(o)); } catch(e) {}
    if (typeof Auth !== 'undefined' && Auth.db && Auth.user && !Auth.user.isLocal) {
      try {
        const ref = Auth.db.collection('users').doc(Auth.user.uid).collection('orders');
        o.slice(0, 5).forEach(function(order) { ref.doc(order.id).set(order); });
      } catch(e) {}
    }
  },

  renderOrders() {
    var c = document.getElementById('orders-list');
    if (!c) return;
    var orders = this.getOrders();
    var self = this;
    if (!orders.length) {
      c.innerHTML = '<p class="empty-msg">' + ((typeof I18n !== 'undefined') ? I18n.t('orders_empty') : 'Belum ada pesanan') + '</p>';
      return;
    }
    c.innerHTML = orders.map(function(o) {
      // Format tanggal
      var dateStr = o.date ? self.formatDate(o.date) : '-';

      // Data user (jika ada)
      var userDataStr = '';
      if (o.userData) {
        var keys = Object.keys(o.userData);
        if (keys.length > 0) {
          userDataStr = keys.map(function(k) {
            return '<div class="order-info"><span>' + k.replace(/_/g, ' ') + '</span><strong>' + self.esc(o.userData[k]) + '</strong></div>';
          }).join('');
        }
      }

      // NOTE: Bukti transfer TIDAK ditampilkan (hanya admin yang lihat)

      return '<div class="order-card">' +
        '<div class="order-card-header">' +
        '<strong>' + self.esc(o.item) + '</strong>' +
        '<span class="order-status status-' + o.status + '">' + o.status.toUpperCase() + '</span>' +
        '</div>' +
        '<div class="order-card-body">' +
        '<div class="order-info" style="color:#58cc02;font-weight:800"><span>' + ((typeof I18n !== 'undefined') ? I18n.t('orders_date_label') : '📅 Tanggal') + '</span><strong>' + dateStr + '</strong></div>' +
        '<div class="order-info"><span>' + ((typeof I18n !== 'undefined') ? I18n.t('orders_id_label') : 'Order ID') + '</span><strong>' + self.esc(o.id) + '</strong></div>' +
        '<div class="order-info"><span>' + ((typeof I18n !== 'undefined') ? I18n.t('orders_product_label') : 'Produk') + '</span><strong>' + self.esc(o.product) + '</strong></div>' +
        userDataStr +
        '<div class="order-info"><span>' + ((typeof I18n !== 'undefined') ? I18n.t('orders_method_label') : 'Metode Bayar') + '</span><strong>' + self.esc(o.payment) + '</strong></div>' +
        '<div class="order-info total"><span>Total</span><strong>Rp ' + self.fmt(o.total) + '</strong></div>' +
        '</div></div>';
    }).join('');
  },

  close() {
    var m = document.getElementById('game-modal');
    if (m) { m.classList.remove('active'); m.innerHTML = ''; }
    this.currentItem = null; this.currentProduct = null; this.userData = {}; this.proofImage = null;
  },
};
if (typeof window !== 'undefined') window.TopUpUI = TopUpUI;
console.log('[topup-ui] loaded');
