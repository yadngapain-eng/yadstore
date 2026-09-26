/* YADSTORE — REWARD SYSTEM v2 */

const Rewards = {
  CONFIG: {
    MAX_HEARTS: 5,
    HEART_REGEN_HOURS: 4,
    HEART_COST_GEMS: 50,

    MISSION_REWARDS: {
      daily_login: 15,   // naik dari 10 → 15
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
    AD_COOLDOWN_SECONDS: 30,

    // ====== DAILY SPIN HEART (peluang berjenjang) ======
    SPIN_REWARDS: [
      { hearts: 1,  chance: 45 },   // 45%
      { hearts: 2,  chance: 25 },   // 25%
      { hearts: 3,  chance: 15 },   // 15%
      { hearts: 5,  chance: 8  },   // 8%
      { hearts: 8,  chance: 5  },   // 5%
      { hearts: 10, chance: 2  },   // 2%
    ],

    // ====== AD COIN REWARDS (peluang berjenjang) ======
    // Semakin besar coin → semakin kecil peluang
    AD_REWARDS: [
      { coins: 1,   chance: 45.0 },   // 45%   — paling sering
      { coins: 2,   chance: 25.0 },   // 25%
      { coins: 5,   chance: 15.0 },   // 15%
      { coins: 10,  chance: 8.0  },   // 8%
      { coins: 20,  chance: 4.0  },   // 4%
      { coins: 30,  chance: 2.0  },   // 2%
      { coins: 50,  chance: 0.8  },   // 0.8%
      { coins: 75,  chance: 0.15 },   // 0.15%
      { coins: 100, chance: 0.04 },   // 0.04%
      { coins: 200, chance: 0.01 },   // 0.01% — SUPER JACKPOT
    ],
  },

  // ============================================
  // SISTEM PELUANG BERJENJANG
  // ============================================
  _rollReward: function(rewardsList) {
    // Total chance harus 100 (kalau tidak, normalisasi otomatis)
    var total = 0;
    for (var i = 0; i < rewardsList.length; i++) total += rewardsList[i].chance;

    // Ambil angka random 0-100
    var roll = Math.random() * total;
    var cumulative = 0;

    for (var j = 0; j < rewardsList.length; j++) {
      cumulative += rewardsList[j].chance;
      if (roll < cumulative) return rewardsList[j];
    }
    return rewardsList[rewardsList.length - 1]; // fallback: hadiah terakhir
  },

  // ============================================
  // DAILY SPIN HEART (1x/hari)
  // ============================================
  canSpinToday: function() {
    var today = new Date().toISOString().split('T')[0];
    var lastSpin = this.get('lastSpinDate', null);
    return lastSpin !== today;
  },

  getLastSpinDate: function() {
    return this.get('lastSpinDate', null);
  },

  async doSpin() {
    if (!this.canSpinToday()) {
      return { success: false, reason: 'already_spun' };
    }
    var today = new Date().toISOString().split('T')[0];
    this.set('lastSpinDate', today);

    // Roll reward
    var reward = this._rollReward(this.CONFIG.SPIN_REWARDS);
    var hearts = reward.hearts;

    // Tambah heart ke player
    if (typeof DL !== 'undefined' && DL.addHeart) {
      // addHeart max 5 default. Bypass limit untuk spin reward
      var s = DL.getState();
      s.hearts = Math.min(5, (s.hearts || 0) + hearts);
      s.heartsUpdated = Date.now();
      DL.save(s);
    }

    // Simpan history
    var state = this.getState();
    state.history = state.history || [];
    state.history.unshift({
      type: 'spin',
      amount: hearts,
      reason: 'Daily Spin (+' + hearts + ' heart)',
      date: new Date().toISOString(),
    });
    if (state.history.length > 200) state.history = state.history.slice(0, 200);
    this.save(state);

    // Sync ke Firestore
    this.syncToFirestore();

    // Update UI stats
    if (typeof DuoUI !== 'undefined' && DuoUI.renderStats) {
      try { DuoUI.renderStats(); } catch(e) {}
    }

    return { success: true, hearts: hearts };
  },

  // ============================================
  // GET AD REWARD (pakai peluang berjenjang)
  // ============================================
  _getAdRewardCoin: function() {
    var reward = this._rollReward(this.CONFIG.AD_REWARDS);
    return reward.coins;
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
    var lastAdDate = this.get('lastAdDate', null);

    // Kalau lastAdDate berbeda dari hari ini → reset counter (hari baru)
    if (lastAdDate !== today) {
      this.set('lastAdWatch', 0);
      this.set('lastAdDate', today);
      this.set('lastAdTime', 0);
      lastAdDate = today;
    }

    return {
      balance: this.get('balance', 0),
      totalEarned: this.get('totalEarned', 0),
      totalSpent: this.get('totalSpent', 0),
      totalWithdrawn: this.get('totalWithdrawn', 0),
      lastLogin: this.get('lastLogin', null),
      lastAdWatch: this.get('lastAdWatch', 0),
      lastAdDate: lastAdDate,
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
        // ===== AD COUNTER (sync biar tidak reset) =====
        lastAdWatch: state.lastAdWatch || 0,
        lastAdDate: state.lastAdDate || null,
        lastAdTime: state.lastAdTime || 0,
        // ===== DAILY SPIN =====
        lastSpinDate: this.get('lastSpinDate', null),
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (e) { console.warn('[Rewards] sync error:', e); }
  },

  // ============================================
  // SYNC FROM FIRESTORE (dipanggil saat app load)
  // Ambil data ad counter dari Firestore ke localStorage
  // ============================================
  async syncFromFirestore() {
    if (typeof Auth === 'undefined' || !Auth.db || !Auth.user || Auth.user.isLocal) return;
    try {
      const doc = await Auth.db.collection('users').doc(Auth.user.uid).get();
      if (!doc.exists) return;
      const data = doc.data();

      const today = new Date().toISOString().split('T')[0];
      const lastAdDate = data.lastAdDate || null;
      const lastAdWatch = data.lastAdWatch || 0;

      // Kalau lastAdDate di Firestore = hari ini, pakai jumlahnya
      // Kalau lastAdDate hari lain, reset ke 0 (hari baru)
      if (lastAdDate === today) {
        this.set('lastAdWatch', lastAdWatch);
        this.set('lastAdDate', lastAdDate);
        this.set('lastAdTime', data.lastAdTime || 0);
        console.log('[Rewards] Ad counter synced from Firestore:', lastAdWatch, '/', this.CONFIG.AD_WATCH_LIMIT);
      } else {
        // Hari baru → reset
        this.set('lastAdWatch', 0);
        this.set('lastAdDate', today);
        this.set('lastAdTime', 0);
        console.log('[Rewards] New day, ad counter reset to 0');
        // Sync balik ke Firestore
        this.syncToFirestore();
      }
    } catch (e) {
      console.warn('[Rewards] syncFromFirestore error:', e);
    }
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

    // Bonus hearts
    if (typeof DL !== 'undefined' && DL.addHeart) {
      DL.addHeart(1);
    }
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

    if (typeof window.AdsManager === 'undefined') {
      if (typeof Animate !== 'undefined') Animate.toast('Iklan belum siap, tunggu sebentar', 'error');
      return false;
    }

    if (typeof Animate !== 'undefined') {
      Animate.toast('Membuka iklan di tab baru...', 'info');
    }

    // Buka smartlink
    const result = await window.AdsManager.openRewarded();

    if (!result.success) {
      if (result.reason === 'cooldown') {
        if (typeof Animate !== 'undefined') Animate.toast('Tunggu ' + result.remain + ' detik lagi', 'error');
      } else {
        if (typeof Animate !== 'undefined') Animate.toast('Iklan gagal dibuka', 'error');
      }
      return false;
    }

    // Kalau redirect — proses reward saat balik
    if (result.method === 'redirect') {
      try { localStorage.setItem('yadstore_ad_pending', Date.now().toString()); } catch (e) {}
      return true;
    }

    // Kalau popup — kasih reward setelah delay
    if (typeof Animate !== 'undefined') {
      Animate.toast('Nonton iklan dulu, lalu tutup tab-nya ✅', 'info');
    }

    setTimeout(() => { this.giveAdReward(); }, 8000);
    return true;
  },

  // ============================================
  // RANDOM COIN GENERATOR (crypto-grade)
  // ============================================
  getRandomCoin() {
    // Pakai crypto.getRandomValues untuk random yang BENAR-BENAR random
    try {
      if (window.crypto && window.crypto.getRandomValues) {
        const arr = new Uint32Array(1);
        window.crypto.getRandomValues(arr);
        // Modulo 100 + 1 → range 1-100
        return (arr[0] % 100) + 1;
      }
    } catch (e) {}

    // Fallback: Math.random
    return Math.floor(Math.random() * 100) + 1;
  },

  // ============================================
  // GIVE AD REWARD (Random 1-100)
  // ============================================
  giveAdReward() {
    const state = this.getState();
    const today = new Date().toISOString().split('T')[0];

    if (state.lastAdDate !== today) {
      state.lastAdWatch = 0;
      state.lastAdDate = today;
    }

    state.lastAdWatch += 1;
    state.lastAdTime = Date.now();
    this.save(state);

    // ====== RANDOM COIN 1-100 ======
    const randomCoin = this.getRandomCoin();

    // Bonus kalau dapat 100 (jackpot!)
    const isJackpot = randomCoin === 100;

    // Kirim reward
    this.addCoin(randomCoin, 'Nonton iklan (random ' + randomCoin + ')');

    // Bonus 5 iklan
    if (state.lastAdWatch === 5) {
      this.addCoin(this.CONFIG.MISSION_REWARDS.watch_5_ads, 'Bonus 5 iklan');
    }

    // ====== TAMBAH HEART (bonus kecil) ======
    // Setiap nonton iklan, 30% chance dapat +1 heart
    if (Math.random() < 0.3) {
      if (typeof DL !== 'undefined' && DL.addHeart) {
        DL.addHeart(1);
      }
    }

    // Popup efek keren
    if (typeof Animate !== 'undefined') {
      Animate.confetti();

      if (isJackpot) {
        Animate.toast('🎉 JACKPOT! +100 koin! 🪙', 'success');
        // Extra confetti
        setTimeout(() => Animate.confetti(), 500);
      } else if (randomCoin >= 50) {
        Animate.toast('🎊 +' + randomCoin + ' koin! 🪙', 'success');
      } else {
        Animate.toast('+' + randomCoin + ' koin! 🪙', 'success');
      }
    }

    // ===== SYNC KE FIRESTORE (biar tidak reset saat refresh) =====
    this.syncToFirestore();

    // Refresh halaman reward
    if (typeof App !== 'undefined' && App.currentTab === 'rewards') {
      const el = document.getElementById('rewards-content');
      if (el) el.innerHTML = this.renderRewardsPage();
    }
  },


  // ============================================
  // LESSON COMPLETE
  // ============================================
  onLessonComplete(perfect) {
    this.addCoin(this.CONFIG.MISSION_REWARDS.complete_lesson, 'Lesson selesai');
    if (perfect) this.addCoin(this.CONFIG.MISSION_REWARDS.perfect_score, 'Skor sempurna');

    // BONUS HEART: Setiap selesai lesson, 50% chance dapat +1 heart
    if (Math.random() < 0.5) {
      if (typeof DL !== 'undefined' && DL.addHeart) {
        DL.addHeart(1);
        if (typeof Animate !== 'undefined') {
          setTimeout(() => Animate.toast('❤️ +1 heart bonus!', 'success'), 800);
        }
      }
    }
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

    // Bonus: Top up = +2 hearts
    if (typeof DL !== 'undefined' && DL.addHeart) {
      DL.addHeart(2);
      if (typeof Animate !== 'undefined') {
        setTimeout(() => Animate.toast('❤️ +2 hearts dari top up!', 'success'), 500);
      }
    }
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
  // ============================================
  // GET USER MIN WITHDRAW (support custom)
  // ============================================
  getUserMinWithdraw() {
    // Cek custom limit dari Auth profile
    if (typeof Auth !== 'undefined' && Auth.profile) {
      const custom = Auth.profile.custom_min_withdraw;
      if (custom !== undefined && custom !== null && custom > 0) {
        return custom;
      }
    }
    // Cek default dari config (cache)
    try {
      const cfg = JSON.parse(localStorage.getItem('yadstore_withdraw_config') || '{}');
      if (cfg.default_min_withdraw) return cfg.default_min_withdraw;
    } catch (e) {}
    // Fallback ke CONFIG
    return this.CONFIG.MIN_WITHDRAW;
  },

  // Sync withdraw config dari Firestore
  async syncWithdrawConfig() {
    if (typeof Auth === 'undefined' || !Auth.db) return;
    try {
      const doc = await Auth.db.collection('config').doc('withdraw_config').get();
      if (doc.exists) {
        localStorage.setItem('yadstore_withdraw_config', JSON.stringify(doc.data()));
      }
    } catch (e) {}
  },

  canWithdraw() {
    const min = this.getUserMinWithdraw();
    return this.getState().balance >= min;
  },

  async requestWithdraw(amount, method, account, name) {
    const state = this.getState();
    const minWd = this.getUserMinWithdraw();
    if (amount < minWd) {
      if (typeof Animate !== 'undefined') Animate.toast('Minimal Rp ' + minWd.toLocaleString('id-ID'), 'error');
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
    var state = this.getState();
    var rupiah = state.balance * this.CONFIG.COIN_TO_RUPIAH;
    var adWatched = this.getAdWatchedToday();
    var adLeft = this.CONFIG.AD_WATCH_LIMIT - adWatched;
    var cooldown = this.getAdCooldownRemaining();
    var t = (typeof I18n !== 'undefined') ? function(k) { return I18n.t(k); } : function(k) { return k; };

    var html = '<div class="reward-hero">' +
      '<div class="reward-balance-label">' + t('reward_balance_label') + '</div>' +
      '<div class="reward-balance">' + this.formatRp(rupiah) + '</div>' +
      '<div class="reward-coin">' + state.balance.toLocaleString('id-ID') + ' ' + t('reward_coin_unit') + ' 🪙</div>' +
      '<div class="reward-convert-info">' + t('reward_coin_rate') + '</div>' +
      '</div>';

    // Ads Section
    html += '<div class="reward-ads-section">' +
      '<h3>' + t('reward_watch_ad_title') + '</h3>' +
      '<p style="color:#666;font-size:13px;margin-bottom:8px">' + t('reward_watch_ad_desc') + '</p>' +
      '<div class="ad-counter">' + adWatched + ' / ' + this.CONFIG.AD_WATCH_LIMIT + ' ' + t('reward_ad_counter') +
      (adLeft > 0 ? ' • ' + t('reward_ad_remaining') + ' ' + adLeft : ' • ' + t('reward_ad_limit_reached')) + '</div>' +
      (cooldown > 0 ?
        '<button class="btn-ad" disabled>⏱️ ' + t('reward_ad_cooldown') + ' ' + cooldown + 's</button>' :
        '<button class="btn-ad" onclick="Rewards.watchAdFlow()" ' + (adLeft > 0 ? '' : 'disabled') + '>' +
        (adLeft > 0 ? t('reward_ad_btn') : '✅ ' + t('reward_ad_limit_reached')) +
        '</button>') +
      '</div>';

    // ====== DAILY SPIN HEART ======
    var canSpin = this.canSpinToday();
    html += '<div class="reward-missions" style="background:linear-gradient(135deg,#fff9e6,#fff4cc);border:2px solid #ffc800">' +
      '<h3>' + t('spin_title') + '</h3>' +
      '<p style="color:#7a5d00;font-size:13px;margin-bottom:10px">' + t('spin_desc') + '</p>' +
      (canSpin ?
        '<button class="btn-primary" style="width:100%;background:linear-gradient(135deg,#ffc800,#ff9600);box-shadow:0 4px 0 #cc7800" onclick="Rewards.doSpinUI()">' + t('spin_btn') + '</button>' :
        '<div style="text-align:center;padding:14px;background:white;border-radius:12px;font-weight:800;color:#2c5a00">' +
          t('spin_already') + '<br><span style="font-size:12px;color:#999">' + t('spin_next') + '</span>' +
        '</div>') +
      '</div>';

    // Missions
    html += '<div class="reward-missions">' +
      '<h3>' + t('reward_missions_title') + '</h3>' +
      this.renderMissions() +
      '</div>';

    // Level rewards
    var lv = typeof DL !== 'undefined' ? DL.getLevel().level : 1;
    var nextReward = this.CONFIG.LEVEL_REWARDS(lv + 1);
    html += '<div class="reward-missions">' +
      '<h3>' + t('reward_level_title') + '</h3>' +
      '<div class="mission-card">' +
      '<div class="mission-icon">🎖️</div>' +
      '<div class="mission-info">' +
      '<div class="mission-title">' + t('reward_level_next') + ' ' + (lv + 1) + ' = +' + nextReward + ' ' + t('mission_coin_suffix') + '</div>' +
      '<div class="mission-reward">' + t('reward_level_desc') + '</div>' +
      '</div>' +
      '</div>' +
      '</div>';

    // Referral
    var refCode = this.getReferralCode();
    html += '<div class="reward-missions">' +
      '<h3>' + t('reward_referral_title') + '</h3>' +
      '<p style="font-size:13px;color:#666;margin-bottom:8px">' + t('reward_referral_desc') + '</p>' +
      '<div class="referral-box">' +
      '<input type="text" value="' + refCode + '" readonly id="ref-code">' +
      '<button class="btn-primary" onclick="Rewards.copyReferral()">' + t('reward_referral_copy') + '</button>' +
      '</div>' +
      '</div>';

    // History
    html += '<div class="reward-history">' +
      '<h3>' + t('reward_history_title') + '</h3>' +
      this.renderHistory() +
      '</div>';

    // Withdraw
    html += '<div class="reward-withdraw-section">' +
      '<h3>' + t('reward_withdraw_title') + '</h3>' +
      '<p style="font-size:13px;color:#666;margin-bottom:12px">Minimal Rp ' + this.getUserMinWithdraw().toLocaleString('id-ID') + '</p>' +
      '<button class="btn-primary btn-full" onclick="Rewards.openWithdraw()" ' + (this.canWithdraw() ? '' : 'disabled') + '>' +
      (this.canWithdraw() ? t('reward_withdraw_btn') : t('reward_withdraw_locked')) +
      '</button>' +
      '</div>';

    return html;
  },

  renderMissions() {
    var t = (typeof I18n !== 'undefined') ? function(k) { return I18n.t(k); } : function(k) { return k; };
    var missions = [
      { id: 'login', icon: '📅', titleKey: 'mission_login', reward: 10 },
      { id: 'lesson', icon: '📚', titleKey: 'mission_lesson', reward: 5 },
      { id: 'perfect', icon: '🎯', titleKey: 'mission_perfect', reward: 20 },
      { id: 'topup', icon: '🛒', titleKey: 'mission_topup', reward: 100 },
      { id: 'ad5', icon: '🎬', titleKey: 'mission_ad5', reward: 10 },
      { id: 'streak3', icon: '🔥', titleKey: 'mission_streak3', reward: 50 },
      { id: 'streak7', icon: '🔥', titleKey: 'mission_streak7', reward: 150 },
    ];
    return missions.map(function(m) {
      return '<div class="mission-card">' +
        '<div class="mission-icon">' + m.icon + '</div>' +
        '<div class="mission-info">' +
        '<div class="mission-title">' + t(m.titleKey) + '</div>' +
        '<div class="mission-reward">+' + m.reward + ' ' + t('mission_coin_suffix') + '</div>' +
        '</div>' +
        '</div>';
    }).join('');
  },

  renderHistory() {
    const state = this.getState();
    if (!state.history.length) return '<p class="empty-msg">' + ((typeof I18n !== 'undefined') ? I18n.t('reward_history_empty') : 'Belum ada transaksi') + '</p>';

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
      '<div class="form-group"><label>Jumlah (min Rp ' + this.getUserMinWithdraw().toLocaleString('id-ID') + ')</label>' +
      '<input type="number" id="wd-amount" value="' + state.balance + '" min="' + this.getUserMinWithdraw() + '" max="' + state.balance + '"></div>' +
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

    const minWd = this.getUserMinWithdraw();
    if (!amount || amount < minWd) {
      alert('Minimal ' + this.formatRp(minWd));
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

  // ============================================
  // DAILY SPIN UI
  // ============================================
  async doSpinUI() {
    if (!this.canSpinToday()) {
      if (typeof Animate !== 'undefined') Animate.toast('Sudah spin hari ini', 'error');
      return;
    }

    // Tampilkan animasi spin
    var modal = document.getElementById('reward-modal');
    modal.innerHTML = '<div class="modal-content" style="max-width:400px">' +
      '<div class="modal-header" style="background:linear-gradient(135deg,#ffc800,#ff9600)">' +
      '<h2>🎰 ' + ((typeof I18n !== 'undefined') ? I18n.t('spin_title') : 'Spin Harian') + '</h2>' +
      '</div>' +
      '<div class="modal-body" style="text-align:center;padding:30px">' +
      '<div id="spin-wheel" style="font-size:80px;animation:spinAnim 2s linear infinite">🎰</div>' +
      '<h3 style="margin-top:20px;color:#666">' + ((typeof I18n !== 'undefined') ? I18n.t('spin_spinning') : 'Memutar...') + '</h3>' +
      '</div>' +
      '</div>';
    modal.classList.add('active');

    // Trigger spin logic
    var result = await this.doSpin();

    setTimeout(() => {
      var wheel = document.getElementById('spin-wheel');
      if (wheel) {
        wheel.style.animation = 'none';
        wheel.style.fontSize = '100px';
        wheel.textContent = '🎉';
      }

      var body = modal.querySelector('.modal-body');
      if (body) {
        var t = (typeof I18n !== 'undefined') ? I18n.t : function(k){return k;};
        var msg = t('spin_win').replace('{n}', result.hearts);
        body.innerHTML =
          '<div style="font-size:80px;margin-bottom:16px">🎉</div>' +
          '<h2 style="color:#2c5a00;font-size:32px;margin-bottom:8px">+' + result.hearts + ' ❤️</h2>' +
          '<p style="color:#666;font-size:15px;margin-bottom:20px">' + msg + '</p>' +
          '<button class="btn-primary btn-full" onclick="Rewards.closeModal(); if(typeof App!==\'undefined\') App.switchTab(\'rewards\')">OK</button>';
      }

      if (typeof Animate !== 'undefined') Animate.confetti();
    }, 2000);
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
