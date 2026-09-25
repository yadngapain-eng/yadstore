/* ============================================
   YADSTORE — GAMES UI
   ============================================ */

const GamesUI = {
  currentGame: null,
  currentProduct: null,

  render() {
    const c = document.getElementById('games-grid');
    if (!c) return;
    c.innerHTML = GAMES.map(g => `
      <div class="game-card" onclick="GamesUI.openGame('${g.id}')" style="--game-color: ${g.color}">
        <div class="game-icon">${g.icon}</div>
        <div class="game-info"><h3>${g.name}</h3><p>${g.desc}</p></div>
        <div class="game-arrow">›</div>
      </div>`).join('');
  },

  openGame(id) {
    const g = GAMES.find(x => x.id === id);
    if (!g) return;
    this.currentGame = g;
    const m = document.getElementById('game-modal');
    if (!m) return;
    m.innerHTML = `
      <div class="modal-content game-modal-content">
        <div class="modal-header" style="background: ${g.color}">
          <button class="modal-close" onclick="GamesUI.closeModal()">✕</button>
          <div class="modal-game-icon">${g.icon}</div>
          <h2>${g.name}</h2><p>${g.desc}</p>
        </div>
        <div class="modal-body">
          <h3 class="section-title">Pilih Nominal</h3>
          <div class="products-grid">
            ${g.products.map(p => `<div class="product-card" onclick="GamesUI.selectProduct('${p.id}')">
              <div class="product-name">${p.name}</div>
              ${p.bonus ? `<div class="product-bonus">${p.bonus}</div>` : ''}
              <div class="product-price">Rp ${p.price.toLocaleString('id-ID')}</div>
            </div>`).join('')}
          </div>
        </div>
      </div>`;
    m.classList.add('active');
  },

  selectProduct(id) {
    if (!this.currentGame) return;
    const p = this.currentGame.products.find(x => x.id === id);
    if (!p) return;
    this.currentProduct = p;
    this.showOrderForm();
  },

  showOrderForm() {
    const g = this.currentGame, p = this.currentProduct;
    const m = document.getElementById('game-modal');
    if (!m || !g || !p) return;
    m.innerHTML = `
      <div class="modal-content game-modal-content">
        <div class="modal-header" style="background: ${g.color}">
          <button class="modal-close" onclick="GamesUI.closeModal()">✕</button>
          <h2>Konfirmasi Pesanan</h2>
        </div>
        <div class="modal-body">
          <div class="order-summary">
            <div class="order-row"><span>Game</span><strong>${g.icon} ${g.name}</strong></div>
            <div class="order-row"><span>Item</span><strong>${p.name}</strong></div>
            ${p.bonus ? `<div class="order-row"><span>Bonus</span><strong class="text-green">${p.bonus}</strong></div>` : ''}
            <div class="order-row total"><span>Total</span><strong>Rp ${p.price.toLocaleString('id-ID')}</strong></div>
          </div>
          <div class="form-group"><label>User ID / Nickname</label>
            <input type="text" id="order-userid" placeholder="Masukkan User ID"></div>
          <div class="form-group"><label>Metode Pembayaran</label>
            <select id="order-payment">
              <option value="qris">QRIS</option><option value="dana">DANA</option>
              <option value="gopay">GoPay</option><option value="ovo">OVO</option>
              <option value="shopeepay">ShopeePay</option>
            </select></div>
          <button class="btn-primary btn-full" onclick="GamesUI.submitOrder()">
            Pesan — Rp ${p.price.toLocaleString('id-ID')}</button>
          <button class="btn-secondary btn-full" onclick="GamesUI.openGame('${g.id}')">← Kembali</button>
        </div>
      </div>`;
  },

  submitOrder() {
    const uid = document.getElementById('order-userid')?.value?.trim();
    const pay = document.getElementById('order-payment')?.value;
    if (!uid) { alert('Masukkan User ID!'); return; }
    const oid = 'YDS' + Date.now().toString(36).toUpperCase();
    const order = {
      id: oid, game: this.currentGame.name, gameIcon: this.currentGame.icon,
      product: this.currentProduct.name, price: this.currentProduct.price,
      userId: uid, payment: pay, status: 'pending', date: new Date().toISOString(),
    };
    const orders = DL.get('orders', []);
    orders.unshift(order);
    DL.set('orders', orders);
    DL.addXp(10);
    DL.addGems(5);
    DL.checkAchievements({});
    this.showSuccess(order);
  },

  showSuccess(o) {
    const m = document.getElementById('game-modal');
    if (!m) return;
    m.innerHTML = `
      <div class="modal-content game-modal-content">
        <div class="modal-body success-body">
          <div class="success-icon">✅</div>
          <h2>Pesanan Berhasil!</h2>
          <p class="success-sub">Order ID: <strong>${o.id}</strong></p>
          <div class="order-summary">
            <div class="order-row"><span>Game</span><strong>${o.gameIcon} ${o.game}</strong></div>
            <div class="order-row"><span>Item</span><strong>${o.product}</strong></div>
            <div class="order-row"><span>User ID</span><strong>${o.userId}</strong></div>
            <div class="order-row"><span>Pembayaran</span><strong>${o.payment.toUpperCase()}</strong></div>
            <div class="order-row total"><span>Total</span><strong>Rp ${o.price.toLocaleString('id-ID')}</strong></div>
          </div>
          <div class="reward-badge"><span>+10 XP</span><span>+5 💎</span></div>
          <button class="btn-primary btn-full" onclick="GamesUI.closeModal()">Selesai</button>
        </div>
      </div>`;
  },

  closeModal() {
    const m = document.getElementById('game-modal');
    if (m) { m.classList.remove('active'); m.innerHTML = ''; }
    this.currentGame = null;
    this.currentProduct = null;
    if (typeof DuoUI !== 'undefined') { DuoUI.renderStats(); DuoUI.renderProfile(); }
  },
};

if (typeof window !== 'undefined') window.GamesUI = GamesUI;
