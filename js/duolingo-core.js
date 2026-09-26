/* YADSTORE — DUOLINGO CORE v2 (Achievement + Coin) */

const DL = {
  get(k, d) {
    try { const v = localStorage.getItem('yadstore_' + k); return v !== null ? JSON.parse(v) : d; }
    catch (e) { return d; }
  },
  set(k, v) {
    try { localStorage.setItem('yadstore_' + k, JSON.stringify(v)); } catch (e) {}
  },
  getState() {
    return {
      xp: this.get('xp', 0), gems: this.get('gems', 0),
      hearts: this.get('hearts', 5), heartsUpdated: this.get('heartsUpdated', Date.now()),
      streak: this.get('streak', 0), lastStudy: this.get('lastStudy', null),
      completedLessons: this.get('completedLessons', []),
      achievements: this.get('achievements', []),
      totalCorrect: this.get('totalCorrect', 0), totalWrong: this.get('totalWrong', 0),
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
    s.lastStudy = today; this.save(s); return s.streak;
  },
  completeLesson(id, score, total, reward) {
    const s = this.getState();
    if (!s.completedLessons.includes(id)) s.completedLessons.push(id);
    const perfect = score === total;
    const xpEarned = reward + (perfect ? 5 : 0);
    s.xp += xpEarned;
    s.gems += perfect ? 5 : 2;
    s.totalCorrect += score; s.totalWrong += (total - score);
    this.save(s);
    this.updateStreak();
    this.checkAch({ perfect });
    if (typeof Rewards !== 'undefined') {
      try { Rewards.onLessonComplete(perfect); } catch(e) {}
    }
    return { xpEarned, perfect };
  },
  isCompleted(id) { return this.getState().completedLessons.includes(id); },

  ACH: [
    { id: 'first', icon: '🎯', title: 'First Steps', title_en: 'First Steps',
      desc: 'Selesaikan 1 lesson', desc_en: 'Complete 1 lesson',
      coin: 50, difficulty: 'easy', check: s => s.completedLessons.length >= 1 },
    { id: 'five', icon: '🌟', title: 'Getting Started', title_en: 'Getting Started',
      desc: 'Selesaikan 5 lesson', desc_en: 'Complete 5 lessons',
      coin: 150, difficulty: 'easy', check: s => s.completedLessons.length >= 5 },
    { id: 'ten', icon: '💎', title: 'Committed', title_en: 'Committed',
      desc: 'Selesaikan 10 lesson', desc_en: 'Complete 10 lessons',
      coin: 300, difficulty: 'medium', check: s => s.completedLessons.length >= 10 },
    { id: 'twenty', icon: '🧠', title: 'Scholar', title_en: 'Scholar',
      desc: 'Selesaikan 20 lesson', desc_en: 'Complete 20 lessons',
      coin: 750, difficulty: 'medium', check: s => s.completedLessons.length >= 20 },
    { id: 'thirty', icon: '👨‍🎓', title: 'Graduate', title_en: 'Graduate',
      desc: 'Selesaikan 30 lesson', desc_en: 'Complete 30 lessons',
      coin: 1500, difficulty: 'hard', check: s => s.completedLessons.length >= 30 },
    { id: 'all', icon: '👑', title: 'Master', title_en: 'Master',
      desc: 'Selesaikan 40 lesson', desc_en: 'Complete 40 lessons',
      coin: 3000, difficulty: 'epic', check: s => s.completedLessons.length >= 40 },
    { id: 's3', icon: '🔥', title: 'On Fire', title_en: 'On Fire',
      desc: 'Streak 3 hari', desc_en: '3 days streak',
      coin: 100, difficulty: 'easy', check: s => s.streak >= 3 },
    { id: 's7', icon: '🔥', title: 'Unstoppable', title_en: 'Unstoppable',
      desc: 'Streak 7 hari', desc_en: '7 days streak',
      coin: 500, difficulty: 'medium', check: s => s.streak >= 7 },
    { id: 's30', icon: '💪', title: 'Legend', title_en: 'Legend',
      desc: 'Streak 30 hari', desc_en: '30 days streak',
      coin: 2500, difficulty: 'hard', check: s => s.streak >= 30 },
    { id: 'xp100', icon: '⭐', title: 'Century', title_en: 'Century',
      desc: 'Kumpulkan 100 XP', desc_en: 'Earn 100 XP',
      coin: 100, difficulty: 'easy', check: s => s.xp >= 100 },
    { id: 'xp500', icon: '🌠', title: 'XP Master', title_en: 'XP Master',
      desc: 'Kumpulkan 500 XP', desc_en: 'Earn 500 XP',
      coin: 500, difficulty: 'medium', check: s => s.xp >= 500 },
    { id: 'xp1000', icon: '🚀', title: 'XP Legend', title_en: 'XP Legend',
      desc: 'Kumpulkan 1000 XP', desc_en: 'Earn 1000 XP',
      coin: 1200, difficulty: 'hard', check: s => s.xp >= 1000 },
    { id: 'xp5000', icon: '🏅', title: 'XP God', title_en: 'XP God',
      desc: 'Kumpulkan 5000 XP', desc_en: 'Earn 5000 XP',
      coin: 5000, difficulty: 'epic', check: s => s.xp >= 5000 },
    { id: 'perfect', icon: '🏆', title: 'Perfectionist', title_en: 'Perfectionist',
      desc: 'Skor 100% di 1 lesson', desc_en: 'Perfect score in 1 lesson',
      coin: 200, difficulty: 'easy', check: (s, e) => e && e.perfect },
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

  reset() {
    ['xp','gems','hearts','heartsUpdated','streak','lastStudy','completedLessons','achievements','totalCorrect','totalWrong','orders']
      .forEach(k => localStorage.removeItem('yadstore_' + k));
  },
};
if (typeof window !== 'undefined') window.DL = DL;
console.log('[duolingo-core] v2 — ' + DL.ACH.length + ' achievements with coin rewards');
