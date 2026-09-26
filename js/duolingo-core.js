/* ============================================
   LEARN EARN — DUOLINGO CORE v3
   40+ Achievements dengan Tier & Coin
   ============================================ */

const DL = {
  get(k, d) {
    try { const v = localStorage.getItem('learnearn_' + k); return v !== null ? JSON.parse(v) : d; }
    catch (e) { return d; }
  },
  set(k, v) {
    try { localStorage.setItem('learnearn_' + k, JSON.stringify(v)); } catch (e) {}
  },
  getState() {
    return {
      xp: this.get('xp', 0), gems: this.get('gems', 0),
      hearts: this.get('hearts', 5), heartsUpdated: this.get('heartsUpdated', Date.now()),
      streak: this.get('streak', 0), lastStudy: this.get('lastStudy', null),
      completedLessons: this.get('completedLessons', []),
      achievements: this.get('achievements', []),
      totalCorrect: this.get('totalCorrect', 0), totalWrong: this.get('totalWrong', 0),
      totalLessonsCompleted: this.get('totalLessonsCompleted', 0),
      perfectLessons: this.get('perfectLessons', 0),
      topupCount: this.get('topupCount', 0),
      adWatchTotal: this.get('adWatchTotal', 0),
      cryptoEarned: this.get('cryptoEarned', 0),
      dailyStreakMax: this.get('dailyStreakMax', 0),
    };
  },
  save(s) {
    Object.keys(s).forEach(k => this.set(k, s[k]));
    if (typeof Auth !== 'undefined' && Auth.user && !Auth.user.isLocal) {
      try { Auth.saveProfile(s); } catch(e) {}
    }
  },
  regenHearts() {
    const s = this.getState(); const now = Date.now();
    const count = Math.floor((now - s.heartsUpdated) / (30 * 60 * 1000));
    if (count > 0 && s.hearts < 5) {
      s.hearts = Math.min(5, s.hearts + count); s.heartsUpdated = now; this.save(s);
    }
    return s.hearts;
  },
  getLevel() {
    const xp = this.getState().xp;
    let lv = 1, need = 100, acc = 0;
    while (xp >= acc + need) { acc += need; lv++; need = Math.round(need * 1.3); }
    return { level: lv, currentXp: xp - acc, neededXp: need, totalXp: xp };
  },
  addXp(n) {
    const s = this.getState();
    const oldLevel = this.getLevel().level;
    s.xp += n;
    this.save(s);
    const newLevel = this.getLevel().level;
    if (newLevel > oldLevel && typeof Rewards !== 'undefined') {
      try { Rewards.onLevelUp(newLevel); } catch(e) {}
    }
    return this.getLevel();
  },
  addGems(n) { const s = this.getState(); s.gems = Math.max(0, s.gems + n); this.save(s); return s.gems; },
  loseHeart() { const s = this.getState(); if (s.hearts > 0) { s.hearts--; s.heartsUpdated = Date.now(); this.save(s); } return s.hearts; },
  refillHearts() { const s = this.getState(); s.hearts = 5; s.heartsUpdated = Date.now(); this.save(s); },
  addHeart(amount) {
    const s = this.getState();
    s.hearts = Math.min(5, s.hearts + (amount || 1));
    s.heartsUpdated = Date.now();
    this.save(s);
    return s.hearts;
  },
  updateStreak() {
    const s = this.getState();
    const today = new Date().toISOString().split('T')[0];
    if (s.lastStudy === today) return s.streak;
    const y = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (s.lastStudy === y) s.streak += 1; else s.streak = 1;
    s.lastStudy = today;
    if (s.streak > (s.dailyStreakMax || 0)) s.dailyStreakMax = s.streak;
    this.save(s);
    return s.streak;
  },
  completeLesson(id, score, total, reward) {
    const s = this.getState();
    if (!s.completedLessons.includes(id)) s.completedLessons.push(id);
    const perfect = score === total;
    const xpEarned = reward + (perfect ? 5 : 0);
    s.xp += xpEarned;
    s.gems += perfect ? 5 : 2;
    s.totalCorrect += score; s.totalWrong += (total - score);
    s.totalLessonsCompleted = (s.totalLessonsCompleted || 0) + 1;
    if (perfect) s.perfectLessons = (s.perfectLessons || 0) + 1;
    this.save(s);
    this.updateStreak();
    this.checkAch({ perfect, score, total });
    if (typeof Rewards !== 'undefined') {
      try { Rewards.onLessonComplete(perfect); } catch(e) {}
    }
    return { xpEarned, perfect };
  },
  isCompleted(id) { return this.getState().completedLessons.includes(id); },

  // ============================================
  // 40+ ACHIEVEMENTS dengan 5 TIER
  // ============================================
  TIERS: {
    common:    { name: 'Common',    color: '#94a3b8', icon: '🥉', multiplier: 1 },
    rare:      { name: 'Rare',      color: '#3b82f6', icon: '🥈', multiplier: 2 },
    epic:      { name: 'Epic',      color: '#a855f7', icon: '🥇', multiplier: 4 },
    legendary: { name: 'Legendary', color: '#f59e0b', icon: '💎', multiplier: 8 },
    mythic:    { name: 'Mythic',    color: '#ef4444', icon: '👑', multiplier: 15 },
  },

  ACH: [
    // ============================================
    // TIER: COMMON (Easy) — coin 50-200
    // ============================================
    { id: 'first', icon: '🎯', title: 'First Steps', title_en: 'First Steps',
      desc: 'Selesaikan 1 lesson', desc_en: 'Complete 1 lesson',
      coin: 50, tier: 'common', check: s => s.completedLessons.length >= 1 },
    { id: 'five', icon: '🌟', title: 'Getting Started', title_en: 'Getting Started',
      desc: 'Selesaikan 5 lesson', desc_en: 'Complete 5 lessons',
      coin: 100, tier: 'common', check: s => s.completedLessons.length >= 5 },
    { id: 'login2', icon: '📅', title: 'Come Back', title_en: 'Come Back',
      desc: 'Login 2 hari berturut', desc_en: 'Login 2 days in a row',
      coin: 75, tier: 'common', check: s => s.streak >= 2 },
    { id: 's3', icon: '🔥', title: 'On Fire', title_en: 'On Fire',
      desc: 'Streak 3 hari', desc_en: '3 days streak',
      coin: 150, tier: 'common', check: s => s.streak >= 3 },
    { id: 'xp50', icon: '⭐', title: 'Starter', title_en: 'Starter',
      desc: 'Kumpulkan 50 XP', desc_en: 'Earn 50 XP',
      coin: 60, tier: 'common', check: s => s.xp >= 50 },
    { id: 'xp100', icon: '🌠', title: 'Century', title_en: 'Century',
      desc: 'Kumpulkan 100 XP', desc_en: 'Earn 100 XP',
      coin: 100, tier: 'common', check: s => s.xp >= 100 },
    { id: 'perfect', icon: '🏆', title: 'Perfectionist', title_en: 'Perfectionist',
      desc: 'Skor 100% di 1 lesson', desc_en: 'Perfect score in 1 lesson',
      coin: 100, tier: 'common', check: (s, e) => e && e.perfect },
    { id: 'firstgem', icon: '💎', title: 'First Gem', title_en: 'First Gem',
      desc: 'Kumpulkan 5 gems', desc_en: 'Collect 5 gems',
      coin: 50, tier: 'common', check: s => s.gems >= 5 },
    { id: 'firstcoin', icon: '🪙', title: 'First Coin', title_en: 'First Coin',
      desc: 'Kumpulkan 500 koin', desc_en: 'Collect 500 coins',
      coin: 50, tier: 'common', check: () => (typeof Rewards !== 'undefined' && Rewards.getState().totalEarned >= 500) },
    { id: 'firsttopup', icon: '🛒', title: 'First Order', title_en: 'First Order',
      desc: 'Top up pertama kali', desc_en: 'First top up',
      coin: 150, tier: 'common', check: s => (s.topupCount || 0) >= 1 },
    { id: 'watcher', icon: '🎬', title: 'Ad Watcher', title_en: 'Ad Watcher',
      desc: 'Nonton 10 iklan', desc_en: 'Watch 10 ads',
      coin: 100, tier: 'common', check: s => (s.adWatchTotal || 0) >= 10 },
    { id: 'lesson5', icon: '📚', title: 'Reader', title_en: 'Reader',
      desc: 'Total 5 lesson selesai', desc_en: '5 total lessons completed',
      coin: 100, tier: 'common', check: s => (s.totalLessonsCompleted || 0) >= 5 },

    // ============================================
    // TIER: RARE (Medium) — coin 300-800
    // ============================================
    { id: 'ten', icon: '💎', title: 'Committed', title_en: 'Committed',
      desc: 'Selesaikan 10 lesson', desc_en: 'Complete 10 lessons',
      coin: 300, tier: 'rare', check: s => s.completedLessons.length >= 10 },
    { id: 's7', icon: '🔥', title: 'Unstoppable', title_en: 'Unstoppable',
      desc: 'Streak 7 hari', desc_en: '7 days streak',
      coin: 500, tier: 'rare', check: s => s.streak >= 7 },
    { id: 'xp500', icon: '🌠', title: 'XP Master', title_en: 'XP Master',
      desc: 'Kumpulkan 500 XP', desc_en: 'Earn 500 XP',
      coin: 500, tier: 'rare', check: s => s.xp >= 500 },
    { id: 'perfect5', icon: '✨', title: 'Perfect 5', title_en: 'Perfect 5',
      desc: 'Skor 100% 5 kali', desc_en: 'Perfect score 5 times',
      coin: 400, tier: 'rare', check: s => (s.perfectLessons || 0) >= 5 },
    { id: 'gem50', icon: '💎', title: 'Gem Collector', title_en: 'Gem Collector',
      desc: 'Kumpulkan 50 gems', desc_en: 'Collect 50 gems',
      coin: 350, tier: 'rare', check: s => s.gems >= 50 },
    { id: 'coin5k', icon: '💰', title: 'Coin Saver', title_en: 'Coin Saver',
      desc: 'Kumpulkan 5.000 koin', desc_en: 'Collect 5,000 coins',
      coin: 400, tier: 'rare', check: () => (typeof Rewards !== 'undefined' && Rewards.getState().totalEarned >= 5000) },
    { id: 'topup5', icon: '🛒', title: 'Loyal Buyer', title_en: 'Loyal Buyer',
      desc: 'Top up 5 kali', desc_en: 'Top up 5 times',
      coin: 600, tier: 'rare', check: s => (s.topupCount || 0) >= 5 },
    { id: 'watcher50', icon: '📺', title: 'Ad Addict', title_en: 'Ad Addict',
      desc: 'Nonton 50 iklan', desc_en: 'Watch 50 ads',
      coin: 500, tier: 'rare', check: s => (s.adWatchTotal || 0) >= 50 },
    { id: 'lesson20', icon: '📖', title: 'Bookworm', title_en: 'Bookworm',
      desc: 'Total 20 lesson', desc_en: '20 total lessons',
      coin: 600, tier: 'rare', check: s => (s.totalLessonsCompleted || 0) >= 20 },
    { id: 'streakmax7', icon: '🏃', title: 'Daily Runner', title_en: 'Daily Runner',
      desc: 'Max streak 7 hari', desc_en: 'Max streak 7 days',
      coin: 500, tier: 'rare', check: s => (s.dailyStreakMax || 0) >= 7 },
    { id: 'level5', icon: '🎖️', title: 'Level 5', title_en: 'Level 5',
      desc: 'Capai level 5', desc_en: 'Reach level 5',
      coin: 400, tier: 'rare', check: () => DL.getLevel().level >= 5 },
    { id: 'perfect10', icon: '🌟', title: 'Perfect 10', title_en: 'Perfect 10',
      desc: 'Skor 100% 10 kali', desc_en: 'Perfect score 10 times',
      coin: 700, tier: 'rare', check: s => (s.perfectLessons || 0) >= 10 },
    { id: 'allcat', icon: '🎓', title: 'All-Rounder', title_en: 'All-Rounder',
      desc: 'Belajar di 4 kategori', desc_en: 'Study in all 4 categories',
      coin: 800, tier: 'rare', check: s => {
        const cl = s.completedLessons;
        const cats = ['c', 'e', 'm', 's'];
        return cats.every(c => cl.some(id => id.startsWith(c)));
      }
    },

    // ============================================
    // TIER: EPIC (Hard) — coin 1500-3500
    // ============================================
    { id: 'twenty', icon: '🧠', title: 'Scholar', title_en: 'Scholar',
      desc: 'Selesaikan 20 lesson', desc_en: 'Complete 20 lessons',
      coin: 1500, tier: 'epic', check: s => s.completedLessons.length >= 20 },
    { id: 'thirty', icon: '👨‍🎓', title: 'Graduate', title_en: 'Graduate',
      desc: 'Selesaikan 30 lesson', desc_en: 'Complete 30 lessons',
      coin: 2500, tier: 'epic', check: s => s.completedLessons.length >= 30 },
    { id: 's14', icon: '🔥', title: 'Two Weeks Strong', title_en: 'Two Weeks Strong',
      desc: 'Streak 14 hari', desc_en: '14 days streak',
      coin: 2000, tier: 'epic', check: s => s.streak >= 14 },
    { id: 'xp1000', icon: '🚀', title: 'XP Legend', title_en: 'XP Legend',
      desc: 'Kumpulkan 1000 XP', desc_en: 'Earn 1000 XP',
      coin: 1200, tier: 'epic', check: s => s.xp >= 1000 },
    { id: 'xp2000', icon: '🌌', title: 'XP Overlord', title_en: 'XP Overlord',
      desc: 'Kumpulkan 2000 XP', desc_en: 'Earn 2000 XP',
      coin: 2200, tier: 'epic', check: s => s.xp >= 2000 },
    { id: 'coin25k', icon: '💰', title: 'Coin Tycoon', title_en: 'Coin Tycoon',
      desc: 'Kumpulkan 25.000 koin', desc_en: 'Collect 25,000 coins',
      coin: 2000, tier: 'epic', check: () => (typeof Rewards !== 'undefined' && Rewards.getState().totalEarned >= 25000) },
    { id: 'gem200', icon: '💎', title: 'Gem Hoarder', title_en: 'Gem Hoarder',
      desc: 'Kumpulkan 200 gems', desc_en: 'Collect 200 gems',
      coin: 1500, tier: 'epic', check: s => s.gems >= 200 },
    { id: 'perfect25', icon: '🏅', title: 'Perfect 25', title_en: 'Perfect 25',
      desc: 'Skor 100% 25 kali', desc_en: 'Perfect score 25 times',
      coin: 2500, tier: 'epic', check: s => (s.perfectLessons || 0) >= 25 },
    { id: 'topup20', icon: '🛍️', title: 'Top Up Master', title_en: 'Top Up Master',
      desc: 'Top up 20 kali', desc_en: 'Top up 20 times',
      coin: 2000, tier: 'epic', check: s => (s.topupCount || 0) >= 20 },
    { id: 'watcher200', icon: '📺', title: 'Ad Master', title_en: 'Ad Master',
      desc: 'Nonton 200 iklan', desc_en: 'Watch 200 ads',
      coin: 1800, tier: 'epic', check: s => (s.adWatchTotal || 0) >= 200 },
    { id: 'level10', icon: '🎖️', title: 'Level 10', title_en: 'Level 10',
      desc: 'Capai level 10', desc_en: 'Reach level 10',
      coin: 2500, tier: 'epic', check: () => DL.getLevel().level >= 10 },
    { id: 'halfway', icon: '⚡', title: 'Halfway There', title_en: 'Halfway There',
      desc: 'Selesaikan 50% lesson', desc_en: 'Complete 50% lessons',
      coin: 1500, tier: 'epic', check: s => {
        const total = (window.CODING_LESSONS||[]).length + (window.ENGLISH_LESSONS||[]).length + (window.MATH_LESSONS||[]).length + (window.SCIENCE_LESSONS||[]).length;
        return total > 0 && s.completedLessons.length >= Math.floor(total * 0.5);
      }
    },

    // ============================================
    // TIER: LEGENDARY (Very Hard) — coin 5000-15000
    // ============================================
    { id: 'all', icon: '👑', title: 'Master', title_en: 'Master',
      desc: 'Selesaikan SEMUA lesson', desc_en: 'Complete ALL lessons',
      coin: 8000, tier: 'legendary', check: s => {
        const total = (window.CODING_LESSONS||[]).length + (window.ENGLISH_LESSONS||[]).length + (window.MATH_LESSONS||[]).length + (window.SCIENCE_LESSONS||[]).length;
        return s.completedLessons.length >= total && total > 0;
      }
    },
    { id: 's30', icon: '💪', title: 'One Month Strong', title_en: 'One Month Strong',
      desc: 'Streak 30 hari', desc_en: '30 days streak',
      coin: 5000, tier: 'legendary', check: s => s.streak >= 30 },
    { id: 's60', icon: '🔥', title: 'Two Months Fire', title_en: 'Two Months Fire',
      desc: 'Streak 60 hari', desc_en: '60 days streak',
      coin: 10000, tier: 'legendary', check: s => s.streak >= 60 },
    { id: 'xp5000', icon: '🏅', title: 'XP God', title_en: 'XP God',
      desc: 'Kumpulkan 5000 XP', desc_en: 'Earn 5000 XP',
      coin: 5000, tier: 'legendary', check: s => s.xp >= 5000 },
    { id: 'xp10000', icon: '🌌', title: 'XP Immortal', title_en: 'XP Immortal',
      desc: 'Kumpulkan 10.000 XP', desc_en: 'Earn 10,000 XP',
      coin: 12000, tier: 'legendary', check: s => s.xp >= 10000 },
    { id: 'coin50k', icon: '💎', title: 'Coin Millionaire', title_en: 'Coin Millionaire',
      desc: 'Kumpulkan 50.000 koin', desc_en: 'Collect 50,000 coins',
      coin: 8000, tier: 'legendary', check: () => (typeof Rewards !== 'undefined' && Rewards.getState().totalEarned >= 50000) },
    { id: 'perfect50', icon: '🏆', title: 'Perfect 50', title_en: 'Perfect 50',
      desc: 'Skor 100% 50 kali', desc_en: 'Perfect score 50 times',
      coin: 6000, tier: 'legendary', check: s => (s.perfectLessons || 0) >= 50 },
    { id: 'level20', icon: '🎖️', title: 'Level 20', title_en: 'Level 20',
      desc: 'Capai level 20', desc_en: 'Reach level 20',
      coin: 10000, tier: 'legendary', check: () => DL.getLevel().level >= 20 },
    { id: 'topup50', icon: '💳', title: 'Top Up Legend', title_en: 'Top Up Legend',
      desc: 'Top up 50 kali', desc_en: 'Top up 50 times',
      coin: 5000, tier: 'legendary', check: s => (s.topupCount || 0) >= 50 },
    { id: 'watcher1000', icon: '📺', title: 'Ad Legend', title_en: 'Ad Legend',
      desc: 'Nonton 1000 iklan', desc_en: 'Watch 1000 ads',
      coin: 6000, tier: 'legendary', check: s => (s.adWatchTotal || 0) >= 1000 },
    { id: 'withdraw1', icon: '💸', title: 'First Withdraw', title_en: 'First Withdraw',
      desc: 'Withdraw pertama', desc_en: 'First withdraw',
      coin: 3000, tier: 'legendary', check: () => (typeof Rewards !== 'undefined' && Rewards.getState().totalWithdrawn > 0) },
    { id: 'withdraw10k', icon: '🏦', title: 'Withdraw 10rb', title_en: 'Withdraw 10k',
      desc: 'Total withdraw 10.000', desc_en: 'Total withdraw Rp 10,000',
      coin: 5000, tier: 'legendary', check: () => (typeof Rewards !== 'undefined' && Rewards.getState().totalWithdrawn >= 10000) },
    { id: 'perfect100', icon: '👑', title: 'Perfection Incarnate', title_en: 'Perfection Incarnate',
      desc: 'Skor 100% 100 kali', desc_en: 'Perfect score 100 times',
      coin: 15000, tier: 'legendary', check: s => (s.perfectLessons || 0) >= 100 },
    { id: 'allperfect', icon: '✨', title: 'Perfect Master', title_en: 'Perfect Master',
      desc: 'Semua lesson perfect (100%)', desc_en: 'All lessons perfect',
      coin: 12000, tier: 'legendary', check: s => {
        const total = (window.CODING_LESSONS||[]).length + (window.ENGLISH_LESSONS||[]).length + (window.MATH_LESSONS||[]).length + (window.SCIENCE_LESSONS||[]).length;
        return total > 0 && s.perfectLessons >= total;
      }
    },

    // ============================================
    // TIER: MYTHIC (Extreme) — coin 20.000-100.000
    // ============================================
    { id: 's100', icon: '🏔️', title: 'Century Streak', title_en: 'Century Streak',
      desc: 'Streak 100 hari', desc_en: '100 days streak',
      coin: 25000, tier: 'mythic', check: s => s.streak >= 100 },
    { id: 's365', icon: '🌋', title: 'One Year Legend', title_en: 'One Year Legend',
      desc: 'Streak 365 hari (1 tahun!)', desc_en: '365 days streak (1 year!)',
      coin: 100000, tier: 'mythic', check: s => s.streak >= 365 },
    { id: 'xp50000', icon: '⭐', title: 'XP Immortal', title_en: 'XP Immortal',
      desc: 'Kumpulkan 50.000 XP', desc_en: 'Earn 50,000 XP',
      coin: 25000, tier: 'mythic', check: s => s.xp >= 50000 },
    { id: 'coin500k', icon: '💰', title: 'Coin Emperor', title_en: 'Coin Emperor',
      desc: 'Kumpulkan 500.000 koin', desc_en: 'Collect 500,000 coins',
      coin: 50000, tier: 'mythic', check: () => (typeof Rewards !== 'undefined' && Rewards.getState().totalEarned >= 500000) },
    { id: 'level50', icon: '🌟', title: 'Level 50', title_en: 'Level 50',
      desc: 'Capai level 50', desc_en: 'Reach level 50',
      coin: 40000, tier: 'mythic', check: () => DL.getLevel().level >= 50 },
    { id: 'perfect365', icon: '🏆', title: 'Perfect Year', title_en: 'Perfect Year',
      desc: 'Skor 100% 365 kali', desc_en: 'Perfect score 365 times',
      coin: 50000, tier: 'mythic', check: s => (s.perfectLessons || 0) >= 365 },
    { id: 'topup365', icon: '🛒', title: 'Top Up King', title_en: 'Top Up King',
      desc: 'Top up 365 kali', desc_en: 'Top up 365 times',
      coin: 30000, tier: 'mythic', check: s => (s.topupCount || 0) >= 365 },
    { id: 'watcher5000', icon: '📺', title: 'Ad God', title_en: 'Ad God',
      desc: 'Nonton 5000 iklan', desc_en: 'Watch 5000 ads',
      coin: 40000, tier: 'mythic', check: s => (s.adWatchTotal || 0) >= 5000 },
    { id: 'withdraw1m', icon: '💎', title: 'Withdraw Jutawan', title_en: 'Millionaire Withdraw',
      desc: 'Withdraw total Rp 1.000.000', desc_en: 'Total withdraw Rp 1,000,000',
      coin: 60000, tier: 'mythic', check: () => (typeof Rewards !== 'undefined' && Rewards.getState().totalWithdrawn >= 1000000) },
  ],

  checkAch(extra) {
    extra = extra || {};
    const s = this.getState();
    const unlocked = [...s.achievements];
    const newUnlocks = [];

    this.ACH.forEach(a => {
      if (!unlocked.includes(a.id) && a.check(s, extra)) {
        unlocked.push(a.id);
        newUnlocks.push(a);
        if (typeof showAchPopup === 'function') showAchPopup(a);
        if (typeof Rewards !== 'undefined' && a.coin) {
          setTimeout(() => {
            Rewards.addCoin(a.coin, '🏆 ' + (a.title || 'Achievement'));
            if (typeof Animate !== 'undefined') {
              setTimeout(() => Animate.confetti(), 300);
            }
          }, 1000);
        }
      }
    });

    s.achievements = unlocked;
    this.save(s);
    return { unlocked, newUnlocks };
  },

  getAch() {
    const s = this.getState();
    return this.ACH.map(a => ({ ...a, unlocked: s.achievements.includes(a.id) }));
  },

  // ============================================
  // GROUP BY TIER
  // ============================================
  getAchByTier() {
    const byTier = { common: [], rare: [], epic: [], legendary: [], mythic: [] };
    this.getAch().forEach(a => {
      const tier = a.tier || 'common';
      if (byTier[tier]) byTier[tier].push(a);
    });
    return byTier;
  },

  reset() {
    ['xp','gems','hearts','heartsUpdated','streak','lastStudy','completedLessons','achievements','totalCorrect','totalWrong','orders','totalLessonsCompleted','perfectLessons','topupCount','adWatchTotal','dailyStreakMax']
      .forEach(k => localStorage.removeItem('learnearn_' + k));
  },
};
if (typeof window !== 'undefined') window.DL = DL;
console.log('[duolingo-core] v3 — ' + DL.ACH.length + ' achievements loaded');
