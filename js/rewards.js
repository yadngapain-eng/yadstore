/* ============================================
   YADSTORE — REWARDS SYSTEM
   Hearts, Koin, Saldo, Misi, Level Reward
   ============================================ */

const Rewards = {
  // ============================================
  // CONFIG
  // ============================================
  CONFIG: {
    HEART_REGEN_HOURS: 4,        // Regen 1 heart per 4 jam
    MAX_HEARTS: 5,
    HEART_FROM_LESSON: 0,        // Lesson tidak dapat heart
    HEART_COST_GEMS: 50,          // Isi heart pakai gems

    // Reward per misi (dalam koin 1 koin = Rp 1)
    MISSION_REWARDS: {
      daily_login: 10,           // Login harian
      watch_ad: 1,                // Nonton iklan
      complete_lesson: 5,         // Selesaikan 1 lesson
      complete_5_lessons: 50,     // 5 lesson
      perfect_score: 20,          // Skor 100%
      topup_any: 100,             // Order top up
      share_app: 25,              // Share ke sosmed
      invite_friend: 500,         // Referral (butuh validasi)
      watch_5_ads: 10,            // Bonus nonton 5 iklan
      streak_3: 50,               // Streak 3 hari
      streak_7: 150,              // Streak 7 hari
      streak_30: 1000,            // Streak 30 hari
    },

    // Level reward (naik ke level X dapat koin)
    LEVEL_REWARDS: function(level) {
      // Semakin tinggi level, semakin besar reward
      return level * 50;  // Level 2 = 100 koin, Level 5 = 250 koin
    },

    // Convert rate
    COIN_TO_RUPIAH: 1,            // 1 koin = Rp 1 (gampang)
    MIN_WITHDRAW: 10000,          // Min Rp 10.000 untuk withdraw
    AD_WATCH_LIMIT: 5,            // Max 5 iklan/hari
  },

  // ============================================
  // STORAGE
  // ============================================
  get(key, def) {
    try {
      const v = localStorage.getItem('yadstore_reward_' + key);
      return v !== null ? JSON.parse(v) : def;
    } catch (e) { return def; }
  },
  set(key, val) {
    try { localStorage.setItem('yadstore_reward_' + key, JSON.stringify(val)); }
    catch (e) {}
  },

  // ============================================
  // GET STATE
  // ============================================
  getState() {
    const today = new Date().toISOString().split('T')[0];
    return {
      balance: this.get('balance', 0),           // Saldo koin (bisa di-withdraw)
      totalEarned: this.get('totalEarned', 0),   // Total koin diperoleh
      totalSpent: this.get('totalSpent', 0),     // Total koin dibelanjakan
      lastLogin: this.get('lastLogin', null),
      lastAdWatch: this.get('lastAdWatch', 0),   // Count hari ini
      lastAdDate: this.get('lastAdDate', today),
      missionsDone: this.get('missionsDone', {}), // { missionId: timestamp }
      dailyMissions: this.get('dailyMissions', {}), // { date: [missionIds] }
      unlockedRewards: this.get('unlockedRewards', []),
      history: this.get('history', []),
    };
  },

  save(state) {
    Object.keys(state).forEach(k => this.set(k, state[k]));
  },

  // ============================================
  // ADD COIN
  // ============================================
  addCoin(amount, reason) {
    const state = this.getState();
    state.balance += amount;
    state.totalEarned += amount;

    // Catat history
    state.history.unshift({
      type: 'earn',
      amount: amount,
      reason: reason || 'Reward',
      date: new Date().toISOString(),
    });
    if (state.history.length > 100) state.history = state.history.slice(0, 100);

    this.save(state);

    if (typeof Animate !== 'undefined') {
      Animate.toast('+' + amount + ' koin! 🪙', 'success');
    }
    if (typeof Auth !== 'undefined' && Auth.saveProfile) {
      Auth.saveProfile({ balance: state.balance, totalEarned: state.totalEarned });
    }
    return state.balance;
  },

  spendCoin(amount, reason) {
    const state = this.getState();
    if (state.balance < amount) {
      if (typeof Animate !== 'undefined') Animate.toast('Saldo tidak cukup', 'error');
      return false;
    }
    state.balance -= amount;
    state.totalSpent += amount;
    state.history.unshift({
      type: 'spend',
      amount: amount,
      reason: reason || 'Pembelian',
      date: new Date().toISOString(),
    });
    this.save(state);
    return true;
  },

  // ============================================
  // DAILY LOGIN REWARD
  // ============================================
  checkDailyLogin() {
    const state = this.getState();
    const today = new Date().toISOString().split('T')[0];

    if (state.lastLogin === today) return null;

    state.lastLogin = today;
    this.save(state);

    // Kasih reward
    const reward = this.CONFIG.MISSION_REWARDS.daily_login;
    this.addCoin(reward, 'Login harian');

    return reward;
  },

  // ============================================
  // WATCH AD
  // ============================================
  canWatchAd() {
    const state = this.getState();
    const today = new Date().toISOString().split('T')[0];

    if (state.lastAdDate !== today) {
      // Reset counter hari ini
      state.lastAdDate = today;
      state.lastAdWatch = 0;
      this.save(state);
      return true;
    }
    return state.lastAdWatch < this.CONFIG.AD_WATCH_LIMIT;
  },

  getAdWatchedToday() {
    const state = this.getState();
    const today = new Date().toISOString().split('T')[0];
    if (state.lastAdDate !== today) return 0;
    return state.lastAdWatch;
  },

  watchAd() {
    if (!this.canWatchAd()) {
      if (typeof Animate !== 'undefined') Animate.toast('Batas iklan harian tercapai (5/hari)', 'error');
      return false;
    }
    const state = this.getState();
    state.lastAdWatch += 1;
    state.lastAdDate = new Date().toISOString().split('T')[0];
    this.save(state);

    const reward = this.CONFIG.MISSION_REWARDS.watch_ad;
    this.addCoin(reward, 'Nonton iklan');

    // Bonus nonton 5 iklan
    if (state.lastAdWatch === 5) {
      this.addCoin(this.CONFIG.MISSION_REWARDS.watch_5_ads, 'Bonus nonton 5 iklan');
    }
    return true;
  },

  // ============================================
  // LESSON COMPLETE REWARD
  // ============================================
  onLessonComplete(perfect) {
    const reward = this.CONFIG.MISSION_REWARDS.complete_lesson;
    this.addCoin(reward, 'Lesson selesai');

    if (perfect) {
      this.addCoin(this.CONFIG.MISSION_REWARDS.perfect_score, 'Skor sempurna');
    }

    // Cek total lessons
    if (typeof DL !== 'undefined') {
      const total = DL.getState().completedLessons.length;
      if (total === 5) {
        this.addCoin(this.CONFIG.MISSION_REWARDS.complete_5_lessons, '5 lesson');
      }
    }
  },

  // ============================================
  // LEVEL UP REWARD
  // ============================================
  onLevelUp(newLevel) {
    const state = this.getState();
    const rewardId = 'level_' + newLevel;

    if (state.unlockedRewards.includes(rewardId)) return 0;

    const reward = this.CONFIG.LEVEL_REWARDS(newLevel);
    state.unlockedRewards.push(rewardId);
    this.save(state);

    this.addCoin(reward, 'Naik level ' + newLevel);
    return reward;
  },

  // ============================================
  // TOP UP REWARD
  // ============================================
  onTopUp() {
    const reward = this.CONFIG.MISSION_REWARDS.topup_any;
    this.addCoin(reward, 'Order Top Up');
  },

  // ============================================
  // HEART FROM MISSIONS
  // ============================================
  addHeart(amount) {
    if (typeof DL === 'undefined') return;
    const state = DL.getState();
    const max = this.CONFIG.MAX_HEARTS;
    state.hearts = Math.min(max, state.hearts + amount);
    state.heartsUpdated = Date.now();
    DL.saveState(state);
    if (typeof Animate !== 'undefined') Animate.toast('+' + amount + ' ❤️', 'success');
  },

  // ============================================
  // REFERRAL
  // ============================================
  generateReferralCode() {
    const code = 'YAD' + Math.random().toString(36).substr(2, 6).toUpperCase();
    this.set('referralCode', code);
    return code;
  },

  getReferralCode() {
    let code = this.get('referralCode', null);
    if (!code) code = this.generateReferralCode();
    return code;
  },

  applyReferral(code) {
    if (!code) return false;
    const used = this.get('usedReferral', null);
    if (used) {
      if (typeof Animate !== 'undefined') Animate.toast('Kode referral sudah dipakai', 'error');
      return false;
    }
    this.set('usedReferral', code);
    this.addCoin(this.CONFIG.MISSION_REWARDS.invite_friend, 'Referral: ' + code);
    return true;
  },

  // ============================================
  // WITHDRAW (demo only)
  // ============================================
  canWithdraw() {
    const state = this.getState();
    return state.balance >= this.CONFIG.MIN_WITHDRAW;
  },

  requestWithdraw(amount, method, account) {
    const state = this.getState();
    if (amount < this.CONFIG.MIN_WITHDRAW) {
      if (typeof Animate !== 'undefined') Animate.toast('Minimal withdraw Rp ' + this.CONFIG.MIN_WITHDRAW.toLocaleString('id-ID'), 'error');
      return false;
    }
    if (state.balance < amount) {
      if (typeof Animate !== 'undefined') Animate.toast('Saldo tidak cukup', 'error');
      return false;
    }

    // Demo: langsung potong saldo (production: butuh approval admin)
    state.balance -= amount;
    state.history.unshift({
      type: 'withdraw',
      amount: amount,
      reason: 'Withdraw ke ' + method + ' - ' + account,
      date: new Date().toISOString(),
      status: 'pending',
    });
    this.save(state);

    // Kirim ke Telegram
    if (typeof TELEGRAM_CONFIG !== 'undefined' && TELEGRAM_CONFIG.ENABLED) {
      TELEGRAM_CONFIG.sendMessage('💰 <b>WITHDRAW REQUEST</b>\n\n' +
        'Jumlah: Rp ' + amount.toLocaleString('id-ID') + '\n' +
        'Metode: ' + method + '\n' +
        'Akun: ' + account + '\n' +
        'User: ' + (typeof Auth !== 'undefined' ? Auth.getName() : 'Unknown'));
    }

    return true;
  },

  // ============================================
  // FORMAT
  // ============================================
  formatRp(n) {
    try { return 'Rp ' + n.toLocaleString('id-ID'); } catch(e) { return 'Rp ' + n; }
  },

  // ============================================
  // RENDER REWARDS PAGE
  // ============================================
  renderRewardsPage() {
    const state = this.getState();
    const balance = state.balance;
    const rupiah = balance * this.CONFIG.COIN_TO_RUPIAH;

    return '<div class="reward-hero">' +
      '<div class="reward-balance-label">Saldo Kamu</div>' +
      '<div class="reward-balance">' + this.formatRp(rupiah) + '</div>' +
      '<div class="reward-coin">' + balance.toLocaleString('id-ID') + ' koin 🪙</div>' +
      '<div class="reward-convert-info">100 koin = Rp 100</div>' +
      '</div>' +

      '<div class="reward-missions">' +
      '<h3>🎯 Misi Harian</h3>' +
      this.renderMissions() +
      '</div>' +

      '<div class="reward-ads-section">' +
      '<h3>🎬 Nonton Iklan</h3>' +
      '<p>Dapat 1 koin per iklan</p>' +
      '<div class="ad-counter">' + this.getAdWatchedToday() + ' / ' + this.CONFIG.AD_WATCH_LIMIT + ' hari ini</div>' +
      '<button class="btn-ad" onclick="Rewards.watchAdFlow()" ' + (this.canWatchAd() ? '' : 'disabled') + '>' +
      (this.canWatchAd() ? '🎬 Nonton Iklan (+1 koin)' : '✅ Batas harian tercapai') +
      '</button>' +
      '</div>' +

      '<div class="reward-history">' +
      '<h3>📜 Riwayat Koin</h3>' +
      this.renderHistory() +
      '</div>' +

      '<div class="reward-withdraw-section">' +
      '<h3>💸 Withdraw</h3>' +
      '<p>Minimal ' + this.formatRp(this.CONFIG.MIN_WITHDRAW) + '</p>' +
      '<button class="btn-primary btn-full" onclick="Rewards.openWithdraw()" ' + (this.canWithdraw() ? '' : 'disabled') + '>' +
      (this.canWithdraw() ? '💸 Withdraw Sekarang' : 'Saldo belum cukup') +
      '</button>' +
      '</div>';
  },

  renderMissions() {
    const missions = [
      { id: 'daily_login', icon: '📅', title: 'Login Harian', reward: 10, check: () => true },
      { id: 'complete_lesson', icon: '📚', title: 'Selesaikan 1 Lesson', reward: 5, check: () => true },
      { id: 'topup_any', icon: '🛒', title: 'Top Up Sekali', reward: 100, check: () => true },
    ];

    return missions.map(m => {
      const done = this.get('mission_' + m.id + '_' + new Date().toISOString().split('T')[0], false);
      return '<div class="mission-card ' + (done ? 'done' : '') + '">' +
        '<div class="mission-icon">' + m.icon + '</div>' +
        '<div class="mission-info">' +
        '<div class="mission-title">' + m.title + '</div>' +
        '<div class="mission-reward">+' + m.reward + ' koin</div>' +
        '</div>' +
        (done ? '<div class="mission-check">✅</div>' : '') +
        '</div>';
    }).join('');
  },

  renderHistory() {
    const state = this.getState();
    if (!state.history.length) return '<p class="empty-msg">Belum ada transaksi</p>';

    return state.history.slice(0, 10).map(h => {
      const icon = h.type === 'earn' ? '📈' : (h.type === 'spend' ? '📉' : '💸');
      const color = h.type === 'earn' ? '#58cc02' : '#ff4b4b';
      const sign = h.type === 'earn' ? '+' : '-';
      const date = new Date(h.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      return '<div class="history-item">' +
        '<div class="history-icon">' + icon + '</div>' +
        '<div class="history-info">' +
        '<div class="history-reason">' + h.reason + '</div>' +
        '<div class="history-date">' + date + '</div>' +
        '</div>' +
        '<div class="history-amount" style="color:' + color + '">' + sign + h.amount + '</div>' +
        '</div>';
    }).join('');
  },

  // ============================================
  // WATCH AD FLOW
  // ============================================
  watchAdFlow() {
    if (!this.canWatchAd()) return;

    // Trigger ad banner
    if (typeof Animate !== 'undefined') {
      Animate.toast('Membuka iklan...', 'info');
    }

    // Simulasi nonton iklan (production: integrate AdMob/Monetag video)
    setTimeout(() => {
      const ok = this.watchAd();
      if (ok) {
        if (typeof Animate !== 'undefined') {
          Animate.confetti();
          Animate.toast('+1 koin! 🪙', 'success');
        }
        // Refresh halaman
        if (typeof App !== 'undefined') App.switchTab('rewards');
      }
    }, 2000);
  },

  // ============================================
  // WITHDRAW MODAL
  // ============================================
  openWithdraw() {
    const state = this.getState();
    const methods = ['DANA', 'OVO', 'GoPay', 'ShopeePay', 'SEABANK'];

    const modal = document.getElementById('reward-modal');
    modal.innerHTML = '<div class="modal-content">' +
      '<div class="modal-header" style="background: linear-gradient(135deg, #58cc02, #89e219)">' +
      '<button class="modal-close" onclick="Rewards.closeModal()">X</button>' +
      '<h2>💸 Withdraw Saldo</h2>' +
      '<p>Saldo: ' + this.formatRp(state.balance) + '</p>' +
      '</div>' +
      '<div class="modal-body">' +
      '<div class="form-group"><label>Jumlah</label>' +
      '<input type="number" id="wd-amount" value="' + state.balance + '" min="' + this.CONFIG.MIN_WITHDRAW + '" max="' + state.balance + '"></div>' +
      '<div class="form-group"><label>Metode</label>' +
      '<select id="wd-method">' + methods.map(m => '<option value="' + m + '">' + m + '</option>').join('') + '</select></div>' +
      '<div class="form-group"><label>Nomor Tujuan</label>' +
      '<input type="text" id="wd-account" placeholder="081234567890"></div>' +
      '<div class="payment-notice"><p><strong>⚠️ Demo:</strong> Withdraw real butuh approval admin + payment gateway.</p></div>' +
      '<button class="btn-primary btn-full" onclick="Rewards.submitWithdraw()">Ajukan Withdraw</button>' +
      '</div>' +
      '</div>';
    modal.classList.add('active');
  },

  submitWithdraw() {
    const amount = parseInt(document.getElementById('wd-amount').value);
    const method = document.getElementById('wd-method').value;
    const account = document.getElementById('wd-account').value.trim();

    if (!amount || amount < this.CONFIG.MIN_WITHDRAW) {
      alert('Minimal ' + this.formatRp(this.CONFIG.MIN_WITHDRAW));
      return;
    }
    if (!account) {
      alert('Masukkan nomor tujuan');
      return;
    }

    if (this.requestWithdraw(amount, method, account)) {
      this.closeModal();
      if (typeof Animate !== 'undefined') {
        Animate.confetti();
        Animate.toast('Withdraw diajukan! Tunggu approval admin.', 'success');
      }
      if (typeof App !== 'undefined') App.switchTab('rewards');
    }
  },

  closeModal() {
    const modal = document.getElementById('reward-modal');
    if (modal) { modal.classList.remove('active'); modal.innerHTML = ''; }
  },
};

if (typeof window !== 'undefined') window.Rewards = Rewards;
console.log('[rewards] loaded');
