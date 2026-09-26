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
    const count = Math.floor((now - s.heartsUpdated) / (4 * 60 * 60 * 1000));
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
    // Level up reward
    if (newLevel > oldLevel && typeof Rewards !== 'undefined') {
      try { Rewards.onLevelUp(newLevel); } catch(e) {}
    }
    return this.getLevel();
  },
  addGems(n) { const s = this.getState(); s.gems = Math.max(0, s.gems + n); this.save(s); return s.gems; },
  loseHeart() { const s = this.getState(); if (s.hearts > 0) { s.hearts--; s.heartsUpdated = Date.now(); this.save(s); } return s.hearts; },
  refillHearts() { const s = this.getState(); s.hearts = 5; s.heartsUpdated = Date.now(); this.save(s); },
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
    // Reward koin
    if (typeof Rewards !== 'undefined') {
      try { Rewards.onLessonComplete(perfect); } catch(e) {}
    }
    return { xpEarned, perfect };
  },
  isCompleted(id) { return this.getState().completedLessons.includes(id); },
  ACH: [
    { id: 'first', icon: '1', title: 'First Steps', desc: 'Selesaikan 1 lesson', check: s => s.completedLessons.length >= 1 },
    { id: 'five', icon: '5', title: 'Getting Started', desc: '5 lesson', check: s => s.completedLessons.length >= 5 },
    { id: 'ten', icon: '10', title: 'Committed', desc: '10 lesson', check: s => s.completedLessons.length >= 10 },
    { id: 'twenty', icon: '20', title: 'Scholar', desc: '20 lesson', check: s => s.completedLessons.length >= 20 },
    { id: 'all', icon: 'A', title: 'Master', desc: '30 lesson', check: s => s.completedLessons.length >= 30 },
    { id: 's3', icon: 'S3', title: 'On Fire', desc: 'Streak 3 hari', check: s => s.streak >= 3 },
    { id: 's7', icon: 'S7', title: 'Unstoppable', desc: 'Streak 7 hari', check: s => s.streak >= 7 },
    { id: 'xp100', icon: 'XP', title: 'Century', desc: '100 XP', check: s => s.xp >= 100 },
    { id: 'xp500', icon: 'XP', title: 'XP Master', desc: '500 XP', check: s => s.xp >= 500 },
    { id: 'xp1000', icon: 'XP', title: 'XP Legend', desc: '1000 XP', check: s => s.xp >= 1000 },
    { id: 'perfect', icon: 'P', title: 'Perfectionist', desc: '100% lesson', check: (s, e) => e && e.perfect },
  ],
  checkAch(extra) {
    extra = extra || {};
    const s = this.getState();
    const unlocked = [...s.achievements];
    this.ACH.forEach(a => {
      if (!unlocked.includes(a.id) && a.check(s, extra)) {
        unlocked.push(a.id);
        if (typeof showAchPopup === 'function') showAchPopup(a);
      }
    });
    s.achievements = unlocked; this.save(s); return unlocked;
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
