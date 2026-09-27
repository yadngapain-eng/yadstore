/* ============================================
   YADSTORE — REWARD SYSTEM v3 (CLEAN)
   ============================================ */

var Rewards = {
  CONFIG: {
    MISSION_REWARDS: {
      daily_login: 15,
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
    LEVEL_REWARDS: function(level) { return level * 50; },
    COIN_TO_RUPIAH: 1,
    MIN_WITHDRAW: 1000,
    AD_WATCH_LIMIT: 5,
    AD_COOLDOWN_SECONDS: 30,
  },

  // ===== STORAGE =====
  get: function(key, def) {
    try {
      var v = localStorage.getItem('yadstore_reward_' + key);
      return v !== null ? JSON.parse(v) : def;
    } catch (e) { return def; }
  },
  set: function(key, val) {
    try { localStorage.setItem('yadstore_reward_' + key, JSON.stringify(val)); } catch (e) {}
  },

  // ===== STATE =====
  getState: function() {
    var today = new Date().toISOString().split('T')[0];
    return {
      balance: this.get('balance', 0),
      totalEarned: this.get('totalEarned', 0),
      totalSpent: this.get('totalSpent', 0),
      totalWithdrawn: this.get('totalWithdrawn', 0),
      withdrawCount: this.get('withdrawCount', 0),
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

  save: function(state) {
    var self = this;
    Object.keys(state).forEach(function(k) { self.set(k, state[k]); });
  },

  // ===== ADD COIN =====
  addCoin: function(amount, reason) {
    var state = this.getState();
    state.balance += amount;
    state.totalEarned += amount;
    state.history.unshift({
      type: 'earn',
      amount: amount,
      reason: reason || 'Reward',
      date: new Date().toISOString(),
    });
    if (state.history.length > 200) state.history = state.history.slice(0, 200);
    this.save(state);
    if (typeof Animate !== 'undefined') Animate.toast('+' + amount + ' koin 🪙', 'success');
    this.syncToFirestore();
    return state.balance;
  },

  spendCoin: function(amount, reason) {
    var state = this.getState();
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
    this.syncToFirestore();
    return true;
  },

  // ===== SYNC TO FIRESTORE =====
  syncToFirestore: function() {
    if (typeof Auth === 'undefined' || !Auth.db || !Auth.user || Auth.user.isLocal) return;
    try {
      var state = this.getState();
      Auth.db.collection('users').doc(Auth.user.uid).set({
        balance: state.balance,
        totalEarned: state.totalEarned,
        totalSpent: state.totalSpent,
        totalWithdrawn: state.totalWithdrawn,
        withdrawCount: state.withdrawCount || 0,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (e) { console.warn('[Rewards] sync error:', e); }
  },

  // ===== DAILY LOGIN =====
  checkDailyLogin: function() {
    var state = this.getState();
    var today = new Date().toISOString().split('T')[0];
    if (state.lastLogin === today) return 0;
    state.lastLogin = today;
    this.save(state);
    var reward = this.CONFIG.MISSION_REWARDS.daily_login;
    this.addCoin(reward, 'Login harian');
    if (typeof DL !== 'undefined' && DL.addHeart) DL.addHeart(1);
    return reward;
  },

  // ===== RANDOM COIN =====
  getRandomRange: function(min, max) {
    var range = max - min + 1;
    try {
      if (window.crypto && window.crypto.getRandomValues) {
        var arr = new Uint32Array(1);
        window.crypto.getRandomValues(arr);
        return min + (arr[0] % range);
      }
    } catch (e) {}
    return min + Math.floor(Math.random() * range);
  },

  getRandomCoin: function() {
    return this.getRandomRange(1, 100);
  },

  // ===== WATCH AD =====
  canWatchAd: function() {
    var state = this.getState();
    var today = new Date().toISOString().split('T')[0];
    if (state.lastAdDate !== today) return true;
    if (state.lastAdWatch >= this.CONFIG.AD_WATCH_LIMIT) return false;
    var now = Date.now();
    if (state.lastAdTime && (now - state.lastAdTime) < this.CONFIG.AD_COOLDOWN_SECONDS * 1000) return false;
    return true;
  },

  getAdCooldownRemaining: function() {
    var state = this.getState();
    if (!state.lastAdTime) return 0;
    var elapsed = (Date.now() - state.lastAdTime) / 1000;
    var remain = this.CONFIG.AD_COOLDOWN_SECONDS - elapsed;
    return remain > 0 ? Math.ceil(remain) : 0;
  },

  getAdWatchedToday: function() {
    var state = this.getState();
    var today = new Date().toISOString().split('T')[0];
    if (state.lastAdDate !== today) return 0;
    return state.lastAdWatch;
  },

  watchAdFlow: function() {
    var self = this;
    if (!this.canWatchAd()) {
      var cd = this.getAdCooldownRemaining();
      if (cd > 0) {
        if (typeof Animate !== 'undefined') Animate.toast('Tunggu ' + cd + ' detik lagi', 'error');
      } else {
        if (typeof Animate !== 'undefined') Animate.toast('Batas harian (5 iklan) tercapai', 'error');
      }
      return false;
    }

    if (typeof window.AdsManager === 'undefined') {
      if (typeof Animate !== 'undefined') Animate.toast('Iklan belum siap, coba lagi', 'error');
      return false;
    }

    if (typeof Animate !== 'undefined') Animate.toast('Membuka iklan di tab baru...', 'info');

    window.AdsManager.openRewarded().then(function(result) {
      if (!result.success) {
        if (result.reason === 'cooldown') {
          if (typeof Animate !== 'undefined') Animate.toast('Tunggu ' + result.remain + ' detik lagi', 'error');
        } else {
          if (typeof Animate !== 'undefined') Animate.toast('Iklan gagal dibuka', 'error');
        }
        return;
      }

      if (result.method === 'redirect') {
        try { localStorage.setItem('yadstore_ad_pending', Date.now().toString()); } catch (e) {}
        return;
      }

      if (typeof Animate !== 'undefined') {
        Animate.toast('Nonton iklan dulu, lalu tutup tab-nya ✅', 'info');
      }
      setTimeout(function() { self.giveAdReward(); }, 8000);
    });

    return true;
  },

  giveAdReward: function() {
    var state = this.getState();
    var today = new Date().toISOString().split('T')[0];

    if (state.lastAdDate !== today) {
      state.lastAdWatch = 0;
      state.lastAdDate = today;
    }
    state.lastAdWatch += 1;
    state.lastAdTime = Date.now();
    this.save(state);

    var randomCoin = this.getRandomCoin();
    this.addCoin(randomCoin, 'Nonton iklan (random ' + randomCoin + ')');

    if (state.lastAdWatch === 5) {
      this.addCoin(this.CONFIG.MISSION_REWARDS.watch_5_ads, 'Bonus 5 iklan');
    }

    if (Math.random() < 0.3) {
      if (typeof DL !== 'undefined' && DL.addHeart) DL.addHeart(1);
    }

    if (typeof Animate !== 'undefined') {
      Animate.confetti();
      if (randomCoin >= 90) {
        Animate.toast('🎉 JACKPOT! +' + randomCoin + ' koin! 🪙', 'success');
      } else if (randomCoin >= 50) {
        Animate.toast('🎊 +' + randomCoin + ' koin! 🪙', 'success');
      } else {
        Animate.toast('+' + randomCoin + ' koin! 🪙', 'success');
      }
    }

    if (typeof App !== 'undefined' && App.currentTab === 'rewards') {
      var el = document.getElementById('rewards-content');
      if (el) el.innerHTML = this.renderRewardsPage();
    }
  },

  // ===== LESSON COMPLETE =====
  onLessonComplete: function(perfect) {
    var randomCoin;
    if (perfect) {
      randomCoin = this.getRandomRange(250, 500);
    } else {
      randomCoin = this.getRandomRange(50, 250);
    }
    this.addCoin(randomCoin, 'Lesson selesai (random ' + randomCoin + ')');

    if (Math.random() < 0.5) {
      if (typeof DL !== 'undefined' && DL.addHeart) {
        DL.addHeart(1);
        var self = this;
        setTimeout(function() {
          if (typeof Animate !== 'undefined') Animate.toast('❤️ +1 heart bonus!', 'success');
        }, 800);
      }
    }

    if (randomCoin >= 300) {
      setTimeout(function() {
        if (typeof Animate !== 'undefined') Animate.confetti();
      }, 500);
    }

    return randomCoin;
  },

  // ===== LEVEL UP =====
  onLevelUp: function(newLevel) {
    var state = this.getState();
    var id = 'level_' + newLevel;
    if (state.unlockedRewards.indexOf(id) !== -1) return 0;
    state.unlockedRewards.push(id);
    this.save(state);
    var reward = this.CONFIG.LEVEL_REWARDS(newLevel);
    this.addCoin(reward, 'Naik level ' + newLevel);
    return reward;
  },

  // ===== TOP UP =====
  onTopUp: function() {
    this.addCoin(this.CONFIG.MISSION_REWARDS.topup_any, 'Order Top Up');
    if (typeof DL !== 'undefined' && DL.addHeart) {
      DL.addHeart(2);
      setTimeout(function() {
        if (typeof Animate !== 'undefined') Animate.toast('❤️ +2 hearts dari top up!', 'success');
      }, 500);
    }
  },

  // ===== REFERRAL =====
  generateReferralCode: function() {
    var code = 'YAD' + Math.random().toString(36).substr(2, 6).toUpperCase();
    this.set('referralCode', code);
    return code;
  },

  getReferralCode: function() {
    var code = this.get('referralCode', null);
    if (!code) code = this.generateReferralCode();
    return code;
  },

  applyReferral: function(code) {
    if (!code) return false;
    var used = this.get('usedReferral', null);
    if (used) {
      if (typeof Animate !== 'undefined') Animate.toast('Kode sudah dipakai', 'error');
      return false;
    }
    this.set('usedReferral', code);
    this.addCoin(this.CONFIG.MISSION_REWARDS.invite_friend, 'Referral: ' + code);
    return true;
  },

  // ============================================
  // MIN WITHDRAW — AUTO INCREMENT
  // ============================================
  getUserMinWithdraw: function() {
    // Cek custom limit dari admin
    if (typeof Auth !== 'undefined' && Auth.profile) {
      var custom = Auth.profile.custom_min_withdraw;
      if (custom !== undefined && custom !== null && custom > 0) {
        return custom;
      }
    }
    // Auto increment: 1000 + (withdrawCount * 1500)
    var state = this.getState();
    var withdrawCount = state.withdrawCount || 0;
    return 1000 + (withdrawCount * 1500);
  },

  getNextMinWithdraw: function() {
    var state = this.getState();
    var nextCount = (state.withdrawCount || 0) + 1;
    return 1000 + (nextCount * 1500);
  },

  getWithdrawInfo: function() {
    var state = this.getState();
    var count = state.withdrawCount || 0;
    return {
      count: count,
      currentMin: this.getUserMinWithdraw(),
      nextMin: this.getNextMinWithdraw(),
      increase: 1500,
    };
  },

  canWithdraw: function() {
    var min = this.getUserMinWithdraw();
    return this.getState().balance >= min;
  },

  syncWithdrawConfig: function() {
    if (typeof Auth === 'undefined' || !Auth.db) return;
    var self = this;
    Auth.db.collection('config').doc('withdraw_config').get().then(function(doc) {
      if (doc.exists) {
        try {
          localStorage.setItem('yadstore_withdraw_config', JSON.stringify(doc.data()));
        } catch (e) {}
      }
    }).catch(function() {});
  },

  requestWithdraw: function(amount, method, account, name) {
    var state = this.getState();
    var minWd = this.getUserMinWithdraw();
    if (amount < minWd) {
      if (typeof Animate !== 'undefined') Animate.toast('Minimal Rp ' + minWd.toLocaleString('id-ID'), 'error');
      return Promise.resolve(false);
    }
    if (state.balance < amount) {
      if (typeof Animate !== 'undefined') Animate.toast('Saldo tidak cukup', 'error');
      return Promise.resolve(false);
    }

    var withdrawId = 'WD' + Date.now().toString(36).toUpperCase();
    var newCount = (state.withdrawCount || 0) + 1;
    var nextMin = 1000 + (newCount * 1500);

    var withdraw = {
      id: withdrawId,
      userId: (typeof Auth !== 'undefined' && Auth.user) ? Auth.user.uid : 'anon',
      userName: (typeof Auth !== 'undefined') ? Auth.getName() : 'Guest',
      amount: amount,
      method: method,
      account: account,
      name: name || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      withdrawNumber: newCount,
      minAtTime: minWd,
    };

    var self = this;
    var promises = [];

    // Save to Firestore
    if (typeof Auth !== 'undefined' && Auth.db && Auth.user && !Auth.user.isLocal) {
      promises.push(
        Auth.db.collection('users').doc(Auth.user.uid)
          .collection('withdrawals').doc(withdrawId).set(withdraw).catch(function() {})
      );
      promises.push(
        Auth.db.collection('withdrawals').doc(withdrawId).set(withdraw).catch(function() {})
      );
      promises.push(
        Auth.db.collection('users').doc(Auth.user.uid).update({
          withdrawCount: newCount,
          nextMinWithdraw: nextMin,
          lastWithdrawAt: new Date().toISOString(),
        }).catch(function() {})
      );
    }

    // Update state
    state.balance -= amount;
    state.totalWithdrawn += amount;
    state.withdrawCount = newCount;
    state.history.unshift({
      type: 'withdraw',
      amount: amount,
      reason: 'Withdraw ke-' + newCount + ' (' + method + ')',
      date: new Date().toISOString(),
      status: 'pending',
    });
    this.save(state);
    this.syncToFirestore();

    // Telegram
    if (typeof window.TELEGRAM_CONFIG !== 'undefined' && window.TELEGRAM_CONFIG.ENABLED) {
      var msg = '💸 <b>WITHDRAW REQUEST</b>\n\n' +
        '🆔 ' + withdrawId + '\n' +
        '👤 ' + withdraw.userName + '\n' +
        '🔢 Withdraw ke-' + newCount + '\n' +
        '💰 Rp ' + amount.toLocaleString('id-ID') + '\n' +
        '💳 ' + method + '\n' +
        '📱 ' + account + '\n' +
        '📊 Min withdraw berikutnya: Rp ' + nextMin.toLocaleString('id-ID') + '\n' +
        '📅 ' + new Date().toLocaleString('id-ID');
      promises.push(window.TELEGRAM_CONFIG.sendMessage(msg).catch(function() {}));
    }

    return Promise.all(promises).then(function() { return true; });
  },

  // ============================================
  // RENDER REWARDS PAGE
  // ============================================
  renderRewardsPage: function() {
    var state = this.getState();
    var rupiah = state.balance * this.CONFIG.COIN_TO_RUPIAH;
    var adWatched = this.getAdWatchedToday();
    var adLeft = this.CONFIG.AD_WATCH_LIMIT - adWatched;
    var cooldown = this.getAdCooldownRemaining();
    var t = (typeof I18n !== 'undefined')
      ? function(k) { return I18n.t(k); }
      : function(k) { return k; };

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
      (cooldown > 0
        ? '<button class="btn-ad" disabled>⏱️ ' + t('reward_ad_cooldown') + ' ' + cooldown + 's</button>'
        : '<button class="btn-ad" onclick="Rewards.watchAdFlow()" ' + (adLeft > 0 ? '' : 'disabled') + '>' +
          (adLeft > 0 ? t('reward_ad_btn') : '✅ ' + t('reward_ad_limit_reached')) +
          '</button>') +
      '</div>';

    // Missions
    html += '<div class="reward-missions">' +
      '<h3>' + t('reward_missions_title') + '</h3>' +
      this.renderMissions() +
      '</div>';

    // Level rewards
    var lv = (typeof DL !== 'undefined') ? DL.getLevel().level : 1;
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
    // ===== REFERRAL PLACEHOLDER =====
    html += '<div id="referral-section-placeholder"></div>';

    // History
    html += '<div class="reward-history">' +
      '<h3>' + t('reward_history_title') + '</h3>' +
      this.renderHistory() +
      '</div>';

    // Withdraw
    var wdInfo = this.getWithdrawInfo();
    var nextWithdrawNumber = wdInfo.count + 1;
    html += '<div class="reward-withdraw-section">' +
      '<h3>' + t('reward_withdraw_title') + '</h3>' +
      '<div class="wd-info-box">' +
        '<div class="wd-info-row">' +
          '<span>📊 Total withdraw kamu</span>' +
          '<strong>' + wdInfo.count + ' kali</strong>' +
        '</div>' +
        '<div class="wd-info-row">' +
          '<span>💰 Min withdraw sekarang</span>' +
          '<strong style="color:#58cc02">Rp ' + wdInfo.currentMin.toLocaleString('id-ID') + '</strong>' +
        '</div>' +
        '<div class="wd-info-row next">' +
          '<span>📈 Min berikutnya (ke-' + nextWithdrawNumber + ')</span>' +
          '<strong style="color:#ff9600">Rp ' + wdInfo.nextMin.toLocaleString('id-ID') + '</strong>' +
        '</div>' +
        '<div class="wd-note">Naik +Rp 1.500 setiap withdraw berhasil</div>' +
      '</div>' +
      '<button class="btn-primary btn-full" onclick="Rewards.openWithdraw()" ' + (this.canWithdraw() ? '' : 'disabled') + '>' +
        (this.canWithdraw() ? t('reward_withdraw_btn') : t('reward_withdraw_locked')) +
      '</button>' +
      '</div>';

    return html;
  },

  renderMissions: function() {
    var t = (typeof I18n !== 'undefined')
      ? function(k) { return I18n.t(k); }
      : function(k) { return k; };
    var missions = [
      { id: 'login', icon: '📅', titleKey: 'mission_login', reward: 15 },
      { id: 'lesson', icon: '📚', titleKey: 'mission_lesson', reward: '50-500' },
      { id: 'perfect', icon: '🎯', titleKey: 'mission_perfect', reward: '250-500' },
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

  renderHistory: function() {
    var state = this.getState();
    if (!state.history.length) {
      return '<p class="empty-msg">' + ((typeof I18n !== 'undefined') ? I18n.t('reward_history_empty') : 'Belum ada transaksi') + '</p>';
    }
    return state.history.slice(0, 15).map(function(h) {
      var icon = h.type === 'earn' ? '📈' : (h.type === 'spend' ? '📉' : '💸');
      var color = h.type === 'earn' ? '#58cc02' : '#ff4b4b';
      var sign = h.type === 'earn' ? '+' : '-';
      var date = new Date(h.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
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

  copyReferral: function() {
    var input = document.getElementById('ref-code');
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
  openWithdraw: function() {
    var state = this.getState();
    var methods = ['DANA', 'OVO', 'GoPay', 'ShopeePay', 'SEABANK'];
    var wdInfo = this.getWithdrawInfo();
    var nextWithdrawNumber = wdInfo.count + 1;

    var modal = document.getElementById('reward-modal');
    if (!modal) return;

    modal.innerHTML = '<div class="modal-content">' +
      '<div class="modal-header" style="background: linear-gradient(135deg, #58cc02, #89e219)">' +
        '<button class="modal-close" onclick="Rewards.closeModal()">X</button>' +
        '<h2>💸 Withdraw</h2>' +
        '<p>Saldo: ' + this.formatRp(state.balance) + '</p>' +
      '</div>' +
      '<div class="modal-body">' +

        '<div class="wd-number-badge">📊 Withdraw ke-<strong>' + nextWithdrawNumber + '</strong></div>' +

        '<div class="wd-info-modal">' +
          '<div class="wd-row">' +
            '<span>Min withdraw saat ini</span>' +
            '<strong>Rp ' + wdInfo.currentMin.toLocaleString('id-ID') + '</strong>' +
          '</div>' +
          '<div class="wd-row highlight">' +
            '<span>Min withdraw berikutnya</span>' +
            '<strong>Rp ' + wdInfo.nextMin.toLocaleString('id-ID') + '</strong>' +
          '</div>' +
        '</div>' +

        '<div class="form-group">' +
          '<label>Jumlah (min Rp ' + wdInfo.currentMin.toLocaleString('id-ID') + ')</label>' +
          '<input type="number" id="wd-amount" value="' + Math.max(wdInfo.currentMin, state.balance) + '" min="' + wdInfo.currentMin + '" max="' + state.balance + '">' +
        '</div>' +

        '<div class="form-group">' +
          '<label>Metode</label>' +
          '<select id="wd-method">' + methods.map(function(m) { return '<option value="' + m + '">' + m + '</option>'; }).join('') + '</select>' +
        '</div>' +

        '<div class="form-group">' +
          '<label>Nomor Tujuan</label>' +
          '<input type="text" id="wd-account" placeholder="081234567890">' +
        '</div>' +

        '<div class="form-group">' +
          '<label>Nama Pemilik</label>' +
          '<input type="text" id="wd-name" placeholder="Nama lengkap">' +
        '</div>' +

        '<div class="payment-notice">' +
          '<p><strong>ℹ️ Info:</strong> Withdraw diproses 1-3 hari kerja.</p>' +
          '<p><strong>⚠️ Catatan:</strong> Setelah sukses, min withdraw naik jadi <strong>Rp ' + wdInfo.nextMin.toLocaleString('id-ID') + '</strong></p>' +
        '</div>' +

        '<button class="btn-primary btn-full" onclick="Rewards.submitWithdraw()">Ajukan Withdraw</button>' +
      '</div>' +
      '</div>';
    modal.classList.add('active');
  },

  submitWithdraw: function() {
    var amount = parseInt(document.getElementById('wd-amount').value);
    var method = document.getElementById('wd-method').value;
    var account = document.getElementById('wd-account').value.trim();
    var name = document.getElementById('wd-name').value.trim();

    var minWd = this.getUserMinWithdraw();
    if (!amount || amount < minWd) {
      alert('Minimal ' + this.formatRp(minWd));
      return;
    }
    if (!account) { alert('Masukkan nomor tujuan'); return; }
    if (!name) { alert('Masukkan nama pemilik'); return; }

    var self = this;
    this.requestWithdraw(amount, method, account, name).then(function(ok) {
      if (ok) {
        self.closeModal();
        if (typeof Animate !== 'undefined') {
          Animate.confetti();
          Animate.toast('Withdraw diajukan! Cek Telegram.', 'success');
        }
        if (typeof App !== 'undefined' && App.currentTab === 'rewards') {
          var el = document.getElementById('rewards-content');
          if (el) el.innerHTML = self.renderRewardsPage();
        }
      }
    });
  },

  closeModal: function() {
    var modal = document.getElementById('reward-modal');
    if (modal) { modal.classList.remove('active'); modal.innerHTML = ''; }
  },

  formatRp: function(n) {
    try { return 'Rp ' + n.toLocaleString('id-ID'); } catch (e) { return 'Rp ' + n; }
  },
};

if (typeof window !== 'undefined') window.Rewards = Rewards;
console.log('[rewards] v3 CLEAN loaded');
