/* YADSTORE — DUOLINGO CORE */

const DL = {
  get(key, def) {
    try {
      const v = localStorage.getItem('yadstore_' + key);
      return v !== null ? JSON.parse(v) : def;
    } catch (e) { return def; }
  },
  set(key, val) {
    try { localStorage.setItem('yadstore_' + key, JSON.stringify(val)); } catch (e) {}
  },
  getState() {
    return {
      xp: this.get('xp', 0),
      gems: this.get('gems', 0),
      hearts: this.get('hearts', 5),
      heartsUpdated: this.get('heartsUpdated', Date.now()),
      streak: this.get('streak', 0),
      lastStudy: this.get('lastStudy', null),
      completedLessons: this.get('completedLessons', []),
      achievements: this.get('achievements', []),
      totalCorrect: this.get('totalCorrect', 0),
      totalWrong: this.get('totalWrong', 0),
    };
  },
  saveState(state) { Object.keys(state).forEach(k => this.set(k, state[k])); },
  regenHearts() {
    const s = this.getState();
    const now = Date.now();
    const elapsed = now - s.heartsUpdated;
    const REGEN = 4 * 60 * 60 * 1000;
    const count = Math.floor(elapsed / REGEN);
    if (count > 0 && s.hearts < 5) {
      s.hearts = Math.min(5, s.hearts + count);
      s.heartsUpdated = now;
      this.saveState(s);
    }
    return s.hearts;
  },
  getLevel() {
    const xp = this.getState().xp;
    let level = 1, needed = 100, acc = 0;
    while (xp >= acc + needed) { acc += needed; level++; needed = Math.round(needed * 1.3); }
    return { level, currentXp: xp - acc, neededXp: needed, totalXp: xp };
  },
  addXp(amount) {
    const s = this.getState();
    s.xp += amount;
    this.saveState(s);
    return this.getLevel();
  },
  updateStreak() {
    const s = this.getState();
    const today = new Date().toISOString().split('T')[0];
    if (s.lastStudy === today) return s.streak;
    const y = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (s.lastStudy === y) s.streak += 1; else s.streak = 1;
    s.lastStudy = today;
    this.saveState(s);
    return s.streak;
  },
  loseHeart() {
    const s = this.getState();
    if (s.hearts <= 0) return 0;
    s.hearts -= 1;
    s.heartsUpdated = Date.now();
    this.saveState(s);
    return s.hearts;
  },
  refillHearts() {
    const s = this.getState();
    s.hearts = 5;
    s.heartsUpdated = Date.now();
    this.saveState(s);
  },
  addGems(amount) {
    const s = this.getState();
    s.gems += amount;
    if (s.gems < 0) s.gems = 0;
    this.saveState(s);
    return s.gems;
  },
  completeLesson(id, score, total, xpReward) {
    const s = this.getState();
    if (!s.completedLessons.includes(id)) s.completedLessons.push(id);
    const perfect = score === total;
    const xpEarned = xpReward + (perfect ? 5 : 0);
    s.xp += xpEarned;
    s.gems += perfect ? 5 : 2;
    s.totalCorrect += score;
    s.totalWrong += (total - score);
    this.saveState(s);
    this.updateStreak();
    this.checkAchievements({ perfect });
    return { xpEarned, perfect, level: this.getLevel() };
  },
  isLessonCompleted(id) { return this.getState().completedLessons.includes(id); },
  ACHIEVEMENTS: [
    { id: 'first_lesson', icon: '🎯', title: 'First Steps', desc: 'Selesaikan 1 lesson', check: s => s.completedLessons.length >= 1 },
    { id: 'five_lessons', icon: '🌟', title: 'Getting Started', desc: 'Selesaikan 5 lesson', check: s => s.completedLessons.length >= 5 },
    { id: 'ten_lessons', icon: '💎', title: 'Committed', desc: 'Selesaikan 10 lesson', check: s => s.completedLessons.length >= 10 },
    { id: 'twenty_lessons', icon: '🧠', title: 'Scholar', desc: 'Selesaikan 20 lesson', check: s => s.completedLessons.length >= 20 },
    { id: 'all_lessons', icon: '👑', title: 'Master', desc: 'Selesaikan 30 lesson', check: s => s.completedLessons.length >= 30 },
    { id: 'streak_3', icon: '🔥', title: 'On Fire', desc: 'Streak 3 hari', check: s => s.streak >= 3 },
    { id: 'streak_7', icon: '🔥', title: 'Unstoppable', desc: 'Streak 7 hari', check: s => s.streak >= 7 },
    { id: 'streak_30', icon: '💪', title: 'Legend', desc: 'Streak 30 hari', check: s => s.streak >= 30 },
    { id: 'xp_100', icon: '⭐', title: 'Century', desc: '100 XP', check: s => s.xp >= 100 },
    { id: 'xp_500', icon: '🌠', title: 'XP Master', desc: '500 XP', check: s => s.xp >= 500 },
    { id: 'xp_1000', icon: '🚀', title: 'XP Legend', desc: '1000 XP', check: s => s.xp >= 1000 },
    { id: 'perfect', icon: '🏆', title: 'Perfectionist', desc: 'Skor 100% 1 lesson', check: (s, e) => e && e.perfect },
  ],
  checkAchievements(extra) {
    extra = extra || {};
    const s = this.getState();
    const unlocked = [...s.achievements];
    this.ACHIEVEMENTS.forEach(a => {
      if (!unlocked.includes(a.id) && a.check(s, extra)) {
        unlocked.push(a.id);
        if (typeof showAchievementPopup === 'function') showAchievementPopup(a);
      }
    });
    s.achievements = unlocked;
    this.saveState(s);
    return unlocked;
  },
  getAchievements() {
    const s = this.getState();
    return this.ACHIEVEMENTS.map(a => ({ ...a, unlocked: s.achievements.includes(a.id) }));
  },
  reset() {
    ['xp','gems','hearts','heartsUpdated','streak','lastStudy','completedLessons','achievements','totalCorrect','totalWrong']
      .forEach(k => localStorage.removeItem('yadstore_' + k));
  },
};

if (typeof window !== 'undefined') window.DL = DL;
