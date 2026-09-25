/* ============================================
   YADSTORE — GAMES UI (Top Up)
   ============================================ */

const GamesUI = {
  currentGame: null,
  currentProduct: null,

  render() {
    const container = document.getElementById('games-grid');
    if (!container) return;

    container.innerHTML = GAMES.map(game => `
      <div class="game-card" onclick="GamesUI.openGame('${game.id}')" style="--game-color: ${game.color}">
        <div class="game-icon">${game.icon}</div>
        <div class="game-info">
          <h3>${game.name}</h3>
          <p>${game.desc}</p>
        </div>
        <div class="game-arrow">›</div>
      </div>
    `).join('');
  },

  openGame(gameId) {
    const game = GAMES.find(g => g.id === gameId);
    if (!game) return;
    this.currentGame = game;
    const modal = document.getElementById('game-modal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-content game-modal-content">
        <div class="modal-header" style="background: ${game.color}">
          <button class="modal-close" onclick="GamesUI.closeModal()">✕</button>
          <div class="modal-game-icon">${game.icon}</div>
          <h2>${game.name}</h2>
          <p>${game.desc}</p>
        </div>
        <div class="modal-body">
          <h3 class="section-title">Pilih Nominal</h3>
          <div class="products-grid">
            ${game.products.map(p => `
              <div class="product-card" onclick="GamesUI.selectProduct('${p.id}')">
                <div class="product-name">${p.name}</div>
                ${p.bonus ? `<div class="product-bonus">${p.bonus}</div>` : ''}
                <div class="product-price">Rp ${p.price.toLocaleString('id-ID')}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    modal.classList.add('active');
  },

  selectProduct(productId) {
    if (!this.currentGame) return;
    const product = this.currentGame.products.find(p => p.id === productId);
    if (!product) return;
    this.currentProduct = product;
    this.showOrderForm();
  },

  showOrderForm() {
    const game = this.currentGame;
    const product = this.currentProduct;
    const modal = document.getElementById('game-modal');
    if (!modal || !game || !product) return;

    modal.innerHTML = `
      <div class="modal-content game-modal-content">
        <div class="modal-header" style="background: ${game.color}">
          <button class="modal-close" onclick="GamesUI.closeModal()">✕</button>
          <h2>Konfirmasi Pesanan</h2>
        </div>
        <div class="modal-body">
          <div class="order-summary">
            <div class="order-row">
              <span>Game</span>
              <strong>${game.icon} ${game.name}</strong>
            </div>
            <div class="order-row">
              <span>Item</span>
              <strong>${product.name}</strong>
            </div>
            ${product.bonus ? `
            <div class="order-row">
              <span>Bonus</span>
              <strong class="text-green">${product.bonus}</strong>
            </div>` : ''}
            <div class="order-row total">
              <span>Total</span>
              <strong>Rp ${product.price.toLocaleString('id-ID')}</strong>
            </div>
          </div>

          <div class="form-group">
            <label>User ID / Nickname</label>
            <input type="text" id="order-userid" placeholder="Masukkan User ID">
          </div>

          <div class="form-group">
            <label>Metode Pembayaran</label>
            <select id="order-payment">
              <option value="qris">QRIS</option>
              <option value="dana">DANA</option>
              <option value="gopay">GoPay</option>
              <option value="ovo">OVO</option>
              <option value="shopeepay">ShopeePay</option>
            </select>
          </div>

          <button class="btn-primary btn-full" onclick="GamesUI.submitOrder()">
            Pesan Sekarang — Rp ${product.price.toLocaleString('id-ID')}
          </button>
          <button class="btn-secondary btn-full" onclick="GamesUI.openGame('${game.id}')">
            ← Kembali
          </button>
        </div>
      </div>
    `;
  },

  submitOrder() {
    const userId = document.getElementById('order-userid')?.value?.trim();
    const payment = document.getElementById('order-payment')?.value;

    if (!userId) {
      alert('Masukkan User ID terlebih dahulu!');
      return;
    }

    const orderId = 'YDS' + Date.now().toString(36).toUpperCase();
    const order = {
      id: orderId,
      game: this.currentGame.name,
      gameIcon: this.currentGame.icon,
      product: this.currentProduct.name,
      price: this.currentProduct.price,
      userId: userId,
      payment: payment,
      status: 'pending',
      date: new Date().toISOString(),
    };

    const orders = DL.get('orders', []);
    orders.unshift(order);
    DL.set('orders', orders);

    DL.addXp(10);
    DL.addGems(5);
    DL.checkAchievements({});

    this.showSuccess(order);
  },

  showSuccess(order) {
    const modal = document.getElementById('game-modal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-content game-modal-content">
        <div class="modal-body success-body">
          <div class="success-icon">✅</div>
          <h2>Pesanan Berhasil!</h2>
          <p class="success-sub">Order ID: <strong>${order.id}</strong></p>

          <div class="order-summary">
            <div class="order-row">
              <span>Game</span>
              <strong>${order.gameIcon} ${order.game}</strong>
            </div>
            <div class="order-row">
              <span>Item</span>
              <strong>${order.product}</strong>
            </div>
            <div class="order-row">
              <span>User ID</span>
              <strong>${order.userId}</strong>
            </div>
            <div class="order-row">
              <span>Pembayaran</span>
              <strong>${order.payment.toUpperCase()}</strong>
            </div>
            <div class="order-row total">
              <span>Total</span>
              <strong>Rp ${order.price.toLocaleString('id-ID')}</strong>
            </div>
          </div>

          <div class="reward-badge">
            <span>+10 XP</span>
            <span>+5 💎</span>
          </div>

          <button class="btn-primary btn-full" onclick="GamesUI.closeModal()">
            Selesai
          </button>
        </div>
      </div>
    `;
  },

  closeModal() {
    const modal = document.getElementById('game-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.innerHTML = '';
    }
    this.currentGame = null;
    this.currentProduct = null;
    if (typeof DuoUI !== 'undefined' && DuoUI.renderStats) {
      DuoUI.renderStats();
      DuoUI.renderProfile();
    }
  },

  getOrders() {
    return DL.get('orders', []);
  },
};

if (typeof window !== 'undefined') window.GamesUI = GamesUI;
