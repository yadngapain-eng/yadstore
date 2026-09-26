/* YADSTORE — REWARD SYSTEM v2 */

const Rewards = {
  CONFIG: {
    MAX_HEARTS: 5,
    HEART_REGEN_HOURS: 4,
    HEART_COST_GEMS: 50,

    MISSION_REWARDS: {
      daily_login: 10,
      watch_ad: 1,
      complete_lesson: 5,
      perfect_score: 20,
      topup_any: 100,
      watch_5_ads: 10,
      streak_3: 50,
      streak_7: 150,
      streak_30: 1000,
      invite_friend: 500,
    },

    LEVEL_REWARDS: (level) => level * 50,

    COIN_TO_RUPIAH: 1,
    MIN_WITHDRAW: 10000,
    AD_WATCH_LIMIT: 5,
    AD_COOLDOWN_SECONDS: 60,
  },

  get(key, def) {
    try {
      const v = localStorage.getItem('yadstore_reward_' + key);
      return v !== null ? JSON.parse(v) : def;
    } catch (e) { return def; }
  },
  set(key, val) {
    try { localStorage.setItem('yadstore_reward_' + key, JSON.stringify(val)); } catch (e) {}
  },

  getState() {
    const today = new Date().toISOString().split('T')[0];
    return {
      balance: this.get('balance', 0),
      totalEarned: this.get('totalEarned', 0),
      totalSpent: this.get('totalSpent', 0),
      totalWithdrawn: this.get('totalWithdrawn', 0),
      lastLogin: this.get('lastLogin', null),
      lastAdWatch: this.get('lastAdWatch', 0),
      lastAdDate: this.get('lastAdDate', today),
      lastAdTime: this.get('lastAdTime', 0),
      unlockedRewards: this.get('unlockedRewards', []),
      history: this.get('history', []),
      referralCode: this.get('referralCode', null),
      usedReferral: this.get('usedReferral', null),
    };
  },

  save(state) {
    Object.keys(state).forEach(k => this.set(k, state[k]));
  },

  addCoin(amount, reason) {
    const state = this.getState();
    state.balance += amount;
    state.totalEarned += amount;
    state.history.unshift({
      type: 'earn',
      amount,
      reason: reason || 'Reward',
      date: new Date().toISOString(),
    });
    if (state.history.length > 200) state.history = state.history.slice(0, 200);
    this.save(state);

    if (typeof Animate !== 'undefined') Animate.toast('+' + amount + ' koin 🪙', 'success');
    this.syncToFirestore();
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
      amount,
      reason: reason || 'Pembelian',
      date: new Date().toISOString(),
    });
    this.save(state);
    this.syncToFirestore();
    return true;
  },

  // ============================================
  // SYNC TO FIRESTORE
  // ============================================
  syncToFirestore() {
    if (typeof Auth === 'undefined' || !Auth.db || !Auth.user || Auth.user.isLocal) return;
    try {
      const state = this.getState();
      Auth.db.collection('users').doc(Auth.user.uid).set({
        balance: state.balance,
        totalEarned: state.totalEarned,
        totalSpent: state.totalSpent,
        totalWithdrawn: state.totalWithdrawn,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (e) { console.warn('[Rewards] sync error:', e); }
  },

  // ============================================
  // DAILY LOGIN
  // ============================================
  checkDailyLogin() {
    const state = this.getState();
    const today = new Date().toISOString().split('T')[0];
    if (state.lastLogin === today) return 0;

    state.lastLogin = today;
    this.save(state);
    const reward = this.CONFIG.MISSION_REWARDS.daily_login;
    this.addCoin(reward, 'Login harian');
    return reward;
  },

  // ============================================
  // WATCH AD (dengan Monetag)
  // ============================================
  canWatchAd() {
    const state = this.getState();
    const today = new Date().toISOString().split('T')[0];
    if (state.lastAdDate !== today) return true;
    if (state.lastAdWatch >= this.CONFIG.AD_WATCH_LIMIT) return false;
    // Cooldown check
    const now = Date.now();
    if (state.lastAdTime && (now - state.lastAdTime) < this.CONFIG.AD_COOLDOWN_SECONDS * 1000) return false;
    return true;
  },

  getAdCooldownRemaining() {
    const state = this.getState();
    if (!state.lastAdTime) return 0;
    const elapsed = (Date.now() - state.lastAdTime) / 1000;
    const remain = this.CONFIG.AD_COOLDOWN_SECONDS - elapsed;
    return remain > 0 ? Math.ceil(remain) : 0;
  },

  getAdWatchedToday() {
    const state = this.getState();
    const today = new Date().toISOString().split('T')[0];
    if (state.lastAdDate !== today) return 0;
    return state.lastAdWatch;
  },

  async watchAdFlow() {
    if (!this.canWatchAd()) {
      const cd = this.getAdCooldownRemaining();
      if (cd > 0) {
        if (typeof Animate !== 'undefined') Animate.toast('Tunggu ' + cd + ' detik lagi', 'error');
      } else {
        if (typeof Animate !== 'undefined') Animate.toast('Batas harian (5 iklan) tercapai', 'error');
      }
      return false;
    }

    if (typeof Animate !== 'undefined') Animate.toast('Membuka iklan...', 'info');

    // Trigger Monetag popunder
    let ok = true;
    if (window.MONETAG_CONFIG && window.MONETAG_CONFIG.triggerRewarded) {
      try {
        ok = await window.MONETAG_CONFIG.triggerRewarded();
      } catch (e) { ok = true; }
    } else {
      // Fallback: timer 5 detik
      await new Promise(r => setTimeout(r, 5000));
    }

    if (!ok) return false;

    // Beri reward
    const state = this.getState();
    const today = new Date().toISOString().split('T')[0];
    if (state.lastAdDate !== today) {
      state.lastAdWatch = 0;
      state.lastAdDate = today;
    }
    state.lastAdWatch += 1;
    state.lastAdTime = Date.now();
    this.save(state);

    this.addCoin(this.CONFIG.MISSION_REWARDS.watch_ad, 'Nonton iklan');

    // Bonus 5 iklan
    if (state.lastAdWatch === 5) {
      this.addCoin(this.CONFIG.MISSION_REWARDS.watch_5_ads, 'Bonus 5 iklan');
    }

    if (typeof Animate !== 'undefined') {
      Animate.confetti();
      Animate.toast('+1 koin! 🪙', 'success');
    }

    // Refresh halaman rewards
    if (typeof App !== 'undefined' && App.currentTab === 'rewards') {
      document.getElementById('rewards-content').innerHTML = this.renderRewardsPage();
    }
    return true;
  },

  // ============================================
  // LESSON COMPLETE
  // ============================================
  onLessonComplete(perfect) {
    this.addCoin(this.CONFIG.MISSION_REWARDS.complete_lesson, 'Lesson selesai');
    if (perfect) this.addCoin(this.CONFIG.MISSION_REWARDS.perfect_score, 'Skor sempurna');
  },

  // ============================================
  // LEVEL UP
  // ============================================
  onLevelUp(newLevel) {
    const state = this.getState();
    const id = 'level_' + newLevel;
    if (state.unlockedRewards.includes(id)) return 0;
    state.unlockedRewards.push(id);
    this.save(state);

    const reward = this.CONFIG.LEVEL_REWARDS(newLevel);
    this.addCoin(reward, 'Naik level ' + newLevel);
    return reward;
  },

  // ============================================
  // TOP UP
  // ============================================
  onTopUp() {
    this.addCoin(this.CONFIG.MISSION_REWARDS.topup_any, 'Order Top Up');
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
      if (typeof Animate !== 'undefined') Animate.toast('Kode sudah dipakai', 'error');
      return false;
    }
    this.set('usedReferral', code);
    this.addCoin(this.CONFIG.MISSION_REWARDS.invite_friend, 'Referral: ' + code);
    return true;
  },

  // ============================================
  // WITHDRAW
  // ============================================
  canWithdraw() {
    return this.getState().balance >= this.CONFIG.MIN_WITHDRAW;
  },

  async requestWithdraw(amount, method, account, name) {
    const state = this.getState();
    if (amount < this.CONFIG.MIN_WITHDRAW) {
      if (typeof Animate !== 'undefined') Animate.toast('Minimal Rp ' + this.CONFIG.MIN_WITHDRAW.toLocaleString('id-ID'), 'error');
      return false;
    }
    if (state.balance < amount) {
      if (typeof Animate !== 'undefined') Animate.toast('Saldo tidak cukup', 'error');
      return false;
    }

    const withdrawId = 'WD' + Date.now().toString(36).toUpperCase();
    const withdraw = {
      id: withdrawId,
      userId: typeof Auth !== 'undefined' && Auth.user ? Auth.user.uid : 'anon',
      userName: typeof Auth !== 'undefined' ? Auth.getName() : 'Guest',
      amount,
      method,
      account,
      name: name || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Simpan di Firestore
    if (typeof Auth !== 'undefined' && Auth.db && Auth.user && !Auth.user.isLocal) {
      try {
        await Auth.db.collection('users').doc(Auth.user.uid)
          .collection('withdrawals').doc(withdrawId).set(withdraw);
        // Juga di global collections untuk admin
        await Auth.db.collection('withdrawals').doc(withdrawId).set(withdraw);
      } catch (e) { console.error('[Withdraw] save error:', e); }
    }

    // Update state (potong saldo langsung)
    state.balance -= amount;
    state.totalWithdrawn += amount;
    state.history.unshift({
      type: 'withdraw',
      amount,
      reason: 'Withdraw ' + method + ' - ' + account,
      date: new Date().toISOString(),
      status: 'pending',
    });
    this.save(state);
    this.syncToFirestore();

    // Kirim ke Telegram
    try {
      if (typeof window.TELEGRAM_CONFIG !== 'undefined' && window.TELEGRAM_CONFIG.ENABLED) {
        const msg = '💸 <b>WITHDRAW REQUEST</b>\n\n' +
          '🆔 ' + withdrawId + '\n' +
          '👤 ' + withdraw.userName + '\n' +
          '💰 Rp ' + amount.toLocaleString('id-ID') + '\n' +
          '💳 ' + method + '\n' +
          '📱 ' + account + '\n' +
          '📅 ' + new Date().toLocaleString('id-ID');
        await window.TELEGRAM_CONFIG.sendMessage(msg);
      }
    } catch (e) { console.warn('[Withdraw] telegram error:', e); }

    return true;
  },

  // ============================================
  // RENDER PAGE
  // ============================================
  renderRewardsPage() {
    const state = this.getState();
    const rupiah = state.balance * this.CONFIG.COIN_TO_RUPIAH;
    const adWatched = this.getAdWatchedToday();
    const adLeft = this.CONFIG.AD_WATCH_LIMIT - adWatched;
    const cooldown = this.getAdCooldownRemaining();

    let html = '<div class="reward-hero">' +
      '<div class="reward-balance-label">Saldo Kamu</div>' +
      '<div class="reward-balance">' + this.formatRp(rupiah) + '</div>' +
      '<div class="reward-coin">' + state.balance.toLocaleString('id-ID') + ' koin 🪙</div>' +
      '<div class="reward-convert-info">1 koin = Rp 1</div>' +
      '</div>';

    // Ads Section
    html += '<div class="reward-ads-section">' +
      '<h3>🎬 Nonton Iklan</h3>' +
      '<p style="color:#666;font-size:13px;margin-bottom:8px">Dapat <b>1 koin</b> per iklan (max 5/hari)</p>' +
      '<div class="ad-counter">' + adWatched + ' / ' + this.CONFIG.AD_WATCH_LIMIT + ' hari ini' +
      (adLeft > 0 ? ' • sisa ' + adLeft : ' • batas tercapai') + '</div>' +
      (cooldown > 0 ?
        '<button class="btn-ad" disabled>⏱️ Tunggu ' + cooldown + 's</button>' :
        '<button class="btn-ad" onclick="Rewards.watchAdFlow()" ' + (adLeft > 0 ? '' : 'disabled') + '>' +
        (adLeft > 0 ? '🎬 Nonton Iklan (+1 koin)' : '✅ Batas tercapai') +
        '</button>') +
      '</div>';

    // Missions
    html += '<div class="reward-missions">' +
      '<h3>🎯 Misi & Reward</h3>' +
      this.renderMissions() +
      '</div>';

    // Level rewards
    const lv = typeof DL !== 'undefined' ? DL.getLevel().level : 1;
    const nextReward = this.CONFIG.LEVEL_REWARDS(lv + 1);
    html += '<div class="reward-missions">' +
      '<h3>📈 Reward Naik Level</h3>' +
      '<div class="mission-card">' +
      '<div class="mission-icon">🎖️</div>' +
      '<div class="mission-info">' +
      '<div class="mission-title">Level ' + (lv + 1) + ' = +' + nextReward + ' koin</div>' +
      '<div class="mission-reward">Semakin tinggi = makin besar</div>' +
      '</div>' +
      '</div>' +
      '</div>';

    // Referral
    const refCode = this.getReferralCode();
    html += '<div class="reward-missions">' +
      '<h3>🎁 Referral</h3>' +
      '<p style="font-size:13px;color:#666;margin-bottom:8px">Ajak teman, dapat <b>500 koin</b> per referral</p>' +
      '<div class="referral-box">' +
      '<input type="text" value="' + refCode + '" readonly id="ref-code">' +
      '<button class="btn-primary" onclick="Rewards.copyReferral()">📋 Copy</button>' +
      '</div>' +
      '</div>';

    // History
    html += '<div class="reward-history">' +
      '<h3>📜 Riwayat Koin</h3>' +
      this.renderHistory() +
      '</div>';

    // Withdraw
    html += '<div class="reward-withdraw-section">' +
      '<h3>💸 Withdraw ke Uang</h3>' +
      '<p style="font-size:13px;color:#666;margin-bottom:12px">Minimal ' + this.formatRp(this.CONFIG.MIN_WITHDRAW) + '</p>' +
      '<button class="btn-primary btn-full" onclick="Rewards.openWithdraw()" ' + (this.canWithdraw() ? '' : 'disabled') + '>' +
      (this.canWithdraw() ? '💸 Withdraw Sekarang' : '🔒 Saldo belum cukup') +
      '</button>' +
      '</div>';

    return html;
  },

  renderMissions() {
    const missions = [
      { id: 'login', icon: '📅', title: 'Login Harian', reward: 10 },
      { id: 'lesson', icon: '📚', title: 'Selesaikan Lesson', reward: 5 },
      { id: 'perfect', icon: '🎯', title: 'Skor 100%', reward: 20 },
      { id: 'topup', icon: '🛒', title: 'Top Up Sekali', reward: 100 },
      { id: 'ad5', icon: '🎬', title: 'Nonton 5 Iklan', reward: 10 },
      { id: 'streak3', icon: '🔥', title: 'Streak 3 Hari', reward: 50 },
      { id: 'streak7', icon: '🔥', title: 'Streak 7 Hari', reward: 150 },
    ];

    return missions.map(m => {
      return '<div class="mission-card">' +
        '<div class="mission-icon">' + m.icon + '</div>' +
        '<div class="mission-info">' +
        '<div class="mission-title">' + m.title + '</div>' +
        '<div class="mission-reward">+' + m.reward + ' koin</div>' +
        '</div>' +
        '</div>';
    }).join('');
  },

  renderHistory() {
    const state = this.getState();
    if (!state.history.length) return '<p class="empty-msg">Belum ada transaksi</p>';

    return state.history.slice(0, 15).map(h => {
      const icon = h.type === 'earn' ? '📈' : (h.type === 'spend' ? '📉' : '💸');
      const color = h.type === 'earn' ? '#58cc02' : '#ff4b4b';
      const sign = h.type === 'earn' ? '+' : '-';
      const date = new Date(h.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
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

  copyReferral() {
    const input = document.getElementById('ref-code');
    if (!input) return;
    input.select();
    try {
      document.execCommand('copy');
      if (typeof Animate !== 'undefined') Animate.toast('Kode dicopy!', 'success');
    } catch (e) {}
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
      '<h2>💸 Withdraw</h2>' +
      '<p>Saldo: ' + this.formatRp(state.balance) + '</p>' +
      '</div>' +
      '<div class="modal-body">' +
      '<div class="form-group"><label>Jumlah (min Rp 10.000)</label>' +
      '<input type="number" id="wd-amount" value="' + state.balance + '" min="' + this.CONFIG.MIN_WITHDRAW + '" max="' + state.balance + '"></div>' +
      '<div class="form-group"><label>Metode</label>' +
      '<select id="wd-method">' + methods.map(m => '<option value="' + m + '">' + m + '</option>').join('') + '</select></div>' +
      '<div class="form-group"><label>Nomor Tujuan</label>' +
      '<input type="text" id="wd-account" placeholder="081234567890"></div>' +
      '<div class="form-group"><label>Nama Pemilik</label>' +
      '<input type="text" id="wd-name" placeholder="Nama lengkap"></div>' +
      '<div class="payment-notice"><p><strong>ℹ️ Info:</strong> Withdraw diproses 1-3 hari kerja. Pastikan nomor & nama benar.</p></div>' +
      '<button class="btn-primary btn-full" onclick="Rewards.submitWithdraw()">Ajukan Withdraw</button>' +
      '</div>' +
      '</div>';
    modal.classList.add('active');
  },

  async submitWithdraw() {
    const amount = parseInt(document.getElementById('wd-amount').value);
    const method = document.getElementById('wd-method').value;
    const account = document.getElementById('wd-account').value.trim();
    const name = document.getElementById('wd-name').value.trim();

    if (!amount || amount < this.CONFIG.MIN_WITHDRAW) {
      alert('Minimal ' + this.formatRp(this.CONFIG.MIN_WITHDRAW));
      return;
    }
    if (!account) { alert('Masukkan nomor tujuan'); return; }
    if (!name) { alert('Masukkan nama pemilik'); return; }

    const ok = await this.requestWithdraw(amount, method, account, name);
    if (ok) {
      this.closeModal();
      if (typeof Animate !== 'undefined') {
        Animate.confetti();
        Animate.toast('Withdraw diajukan! Cek Telegram.', 'success');
      }
      if (typeof App !== 'undefined' && App.currentTab === 'rewards') {
        document.getElementById('rewards-content').innerHTML = this.renderRewardsPage();
      }
    }
  },

  closeModal() {
    const modal = document.getElementById('reward-modal');
    if (modal) { modal.classList.remove('active'); modal.innerHTML = ''; }
  },

  formatRp(n) {
    try { return 'Rp ' + n.toLocaleString('id-ID'); } catch (e) { return 'Rp ' + n; }
  },
};

if (typeof window !== 'undefined') window.Rewards = Rewards;
console.log('[rewards] loaded');
