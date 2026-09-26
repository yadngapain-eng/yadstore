const TopUpUI = {
  currentItem: null, currentProduct: null, userData: {}, proofImage: null,

  render() {
    const c = document.getElementById('topup-grid');
    if (!c) return;
    const items = this.getItems();
    c.innerHTML = items.map(item =>
      '<div class="game-card" onclick="TopUpUI.open(\'' + item.id + '\')" style="--game-color: ' + item.color + '">' +
      '<img src="' + item.icon + '" class="game-icon-img" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
      '<div class="game-icon-fallback" style="display:none;background:' + item.color + '">' + item.name.charAt(0) + '</div>' +
      '<div class="game-info"><h3>' + item.name + '</h3><p>' + item.desc + '</p></div></div>'
    ).join('');
  },
  getItems() {
    return [...GAMES, ...DATA_PACKAGES].filter(i => i.category === 'game' || i.category === 'kuota' || i.category === 'voucher');
  },
  open(id) {
    const all = [...GAMES, ...DATA_PACKAGES];
    const item = all.find(i => i.id === id);
    if (!item) return;
    this.currentItem = item;
    const m = document.getElementById('game-modal');
    m.innerHTML = '<div class="modal-content">' +
      '<div class="modal-header" style="background: ' + item.color + '">' +
      '<button class="modal-close" onclick="TopUpUI.close()">X</button>' +
      '<img src="' + item.icon + '" class="modal-icon-img" onerror="this.style.display=\'none\'">' +
      '<h2>' + item.name + '</h2><p>' + item.desc + '</p></div>' +
      '<div class="modal-body">' +
      (item.fields && item.fields.length > 0 ? '<h3 class="section-title">Data Akun</h3>' +
        item.fields.map(f => '<div class="form-group"><label>' + f.label + '</label>' +
          '<input type="text" id="field-' + f.id + '" placeholder="' + f.placeholder + '"></div>').join('') : '') +
      '<h3 class="section-title">Pilih Nominal</h3>' +
      '<div class="products-grid">' +
      item.products.map(p => '<div class="product-card" onclick="TopUpUI.pick(\'' + p.id + '\')">' +
        '<div class="product-name">' + p.name + '</div>' +
        (p.bonus ? '<div class="product-bonus">' + p.bonus + '</div>' : '') +
        '<div class="product-price">Rp ' + p.price.toLocaleString('id-ID') + '</div></div>').join('') +
      '</div></div></div>';
    m.classList.add('active');
  },
  pick(pid) {
    const item = this.currentItem;
    const p = item.products.find(x => x.id === pid);
    if (!p) return;
    const ud = {};
    if (item.fields) {
      for (const f of item.fields) {
        const v = document.getElementById('field-' + f.id)?.value?.trim();
        if (!v) { Animate.toast('Isi ' + f.label + '!', 'error'); return; }
        ud[f.id] = v;
      }
    }
    this.currentProduct = p; this.userData = ud;
    this.showOrder();
  },
  showOrder() {
    const item = this.currentItem; const p = this.currentProduct;
    const m = document.getElementById('game-modal');
    m.innerHTML = '<div class="modal-content">' +
      '<div class="modal-header" style="background: ' + item.color + '">' +
      '<button class="modal-close" onclick="TopUpUI.close()">X</button>' +
      '<h2>Konfirmasi</h2></div>' +
      '<div class="modal-body">' +
      '<div class="order-summary">' +
      '<div class="order-row"><span>Layanan</span><strong>' + item.name + '</strong></div>' +
      '<div class="order-row"><span>Item</span><strong>' + p.name + '</strong></div>' +
      Object.keys(this.userData).map(k => '<div class="order-row"><span>' + k + '</span><strong>' + this.userData[k] + '</strong></div>').join('') +
      '<div class="order-row total"><span>Total</span><strong>Rp ' + p.price.toLocaleString('id-ID') + '</strong></div></div>' +
      '<h3 class="section-title">Pilih Pembayaran</h3>' +
      '<div class="payments-grid">' +
      PAYMENTS.map(pay => '<div class="payment-card" onclick="TopUpUI.submit(\'' + pay.id + '\')">' +
        '<div class="payment-name">' + pay.name + '</div>' +
        (pay.fee > 0 ? '<div class="payment-fee">+Rp ' + pay.fee.toLocaleString('id-ID') + '</div>' : '<div class="payment-fee">Gratis</div>') +
        '</div>').join('') + '</div>' +
      '<button class="btn-secondary btn-full" onclick="TopUpUI.open(\'' + item.id + '\')">Kembali</button>' +
      '</div></div>';
  },
  submit(pid) {
    const pay = PAYMENTS.find(p => p.id === pid);
    const order = {
      id: 'YDS' + Date.now().toString(36).toUpperCase(),
      item: this.currentItem.name, itemIcon: this.currentItem.icon,
      product: this.currentProduct.name, price: this.currentProduct.price,
      fee: pay.fee, total: this.currentProduct.price + pay.fee,
      userData: this.userData, payment: pay.name, status: 'pending',
      proof: null, date: new Date().toISOString(),
    };
    const orders = this.getOrders();
    orders.unshift(order);
    this.saveOrders(orders);
    this.showPayment(order, pay);
  },
  showPayment(order, pay) {
    const m = document.getElementById('game-modal');
    m.innerHTML = '<div class="modal-content">' +
      '<div class="modal-header" style="background: #58cc02">' +
      '<button class="modal-close" onclick="TopUpUI.close()">X</button>' +
      '<h2>Pembayaran</h2><p>Order: ' + order.id + '</p></div>' +
      '<div class="modal-body">' +
      '<div class="order-summary">' +
      '<div class="order-row"><span>Total Bayar</span><strong style="color:#58cc02;font-size:20px">Rp ' + order.total.toLocaleString('id-ID') + '</strong></div></div>' +
      '<div class="payment-info">' +
      '<h3 class="section-title">Bayar via ' + pay.name + '</h3>' +
      '<div class="pay-detail">' +
      '<div class="pay-row"><span>Metode</span><strong>' + pay.name + '</strong></div>' +
      '<div class="pay-row"><span>Nominal</span><strong>Rp ' + order.total.toLocaleString('id-ID') + '</strong></div>' +
      '<div class="pay-row"><span>Tujuan</span><strong>081234567890 a/n YadStore</strong></div></div></div>' +
      '<h3 class="section-title">Upload Bukti Transfer</h3>' +
      '<div class="form-group"><input type="file" id="proof-input" accept="image/*" onchange="TopUpUI.handleProof(this)">' +
      '<div id="proof-preview"></div></div>' +
      '<button class="btn-primary btn-full" onclick="TopUpUI.confirm(\'' + order.id + '\')">Saya Sudah Bayar</button>' +
      '<button class="btn-secondary btn-full" onclick="TopUpUI.close()">Nanti</button>' +
      '</div></div>';
  },
  handleProof(input) {
    const f = input.files && input.files[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) { Animate.toast('Max 2MB', 'error'); return; }
    const rd = new FileReader();
    rd.onload = (e) => {
      this.proofImage = e.target.result;
      const prev = document.getElementById('proof-preview');
      if (prev) prev.innerHTML = '<img src="' + this.proofImage + '" style="max-width:100%;max-height:200px;border-radius:8px;margin-top:8px">';
      Animate.toast('Bukti terupload', 'success');
    };
    rd.readAsDataURL(f);
  },
  confirm(id) {
    if (!this.proofImage) { Animate.toast('Upload bukti dulu!', 'error'); return; }
    const orders = this.getOrders();
    const o = orders.find(x => x.id === id);
    if (o) { o.proof = this.proofImage; o.status = 'processing'; this.saveOrders(orders); }
    this.proofImage = null;
    const m = document.getElementById('game-modal');
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
    const c = document.getElementById('orders-list');
    if (!c) return;
    const orders = this.getOrders();
    if (!orders.length) { c.innerHTML = '<p class="empty-msg">Belum ada pesanan.</p>'; return; }
    c.innerHTML = orders.map(o =>
      '<div class="order-card"><div class="order-card-header">' +
      '<strong>' + o.item + '</strong>' +
      '<span class="order-status status-' + o.status + '">' + o.status.toUpperCase() + '</span></div>' +
      '<div class="order-card-body">' +
      '<div class="order-info"><span>Item</span><strong>' + o.product + '</strong></div>' +
      '<div class="order-info"><span>Order ID</span><strong>' + o.id + '</strong></div>' +
      '<div class="order-info"><span>Bayar</span><strong>' + o.payment + '</strong></div>' +
      '<div class="order-info total"><span>Total</span><strong>Rp ' + o.total.toLocaleString('id-ID') + '</strong></div>' +
      (o.proof ? '<img src="' + o.proof + '" style="max-width:100%;border-radius:8px;margin-top:8px">' : '') +
      '</div></div>'
    ).join('');
  },
  close() {
    const m = document.getElementById('game-modal');
    if (m) { m.classList.remove('active'); m.innerHTML = ''; }
    this.currentItem = null; this.currentProduct = null; this.userData = {}; this.proofImage = null;
  },
};
if (typeof window !== 'undefined') window.TopUpUI = TopUpUI;
