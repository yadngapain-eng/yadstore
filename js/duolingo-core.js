/* ============================================
   YADSTORE — DUOLINGO CORE
   XP, Streak, Hearts, Gems, Level, Achievements
   ============================================ */

const DL = {

  get(key, def) {
    try {
      const v = localStorage.getItem('yadstore_' + key);
      return v !== null ? JSON.parse(v) : def;
    } catch (e) { return def; }
  },
  set(key, val) {
    try { localStorage.setItem('yadstore_' + key, JSON.stringify(val)); }
    catch (e) {}
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
      dailyXp: this.get('dailyXp', 0),
      dailyXpDate: this.get('dailyXpDate', null),
    };
  },

  saveState(state) {
    Object.keys(state).forEach(k => this.set(k, state[k]));
  },

  // ===== HEARTS REGEN =====
  regenHearts() {
    const state = this.getState();
    const now = Date.now();
    const elapsed = now - state.heartsUpdated;
    const REGEN_TIME = 4 * 60 * 60 * 1000;
    const regenCount = Math.floor(elapsed / REGEN_TIME);

    if (regenCount > 0 && state.hearts < 5) {
      state.hearts = Math.min(5, state.hearts + regenCount);
      state.heartsUpdated = now;
      this.saveState(state);
    }
    return state.hearts;
  },

  // ===== LEVEL =====
  getLevel() {
    const xp = this.getState().xp;
    let level = 1;
    let needed = 100;
    let accumulated = 0;
    while (xp >= accumulated + needed) {
      accumulated += needed;
      level++;
      needed = Math.round(needed * 1.3);
    }
    return {
      level: level,
      currentXp: xp - accumulated,
      neededXp: needed,
      totalXp: xp
    };
  },

  addXp(amount) {
    const state = this.getState();
    state.xp += amount;
    const today = new Date().toISOString().split('T')[0];
    if (state.dailyXpDate !== today) {
      state.dailyXpDate = today;
      state.dailyXp = 0;
    }
    state.dailyXp += amount;
    this.saveState(state);
    return this.getLevel();
  },

  // ===== STREAK =====
  updateStreak() {
    const state = this.getState();
    const today = new Date().toISOString().split('T')[0];
    if (state.lastStudy === today) return state.streak;

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (state.lastStudy === yesterday) {
      state.streak += 1;
    } else if (state.lastStudy !== today) {
      state.streak = 1;
    }
    state.lastStudy = today;
    this.saveState(state);
    return state.streak;
  },

  // ===== HEARTS =====
  loseHeart() {
    const state = this.getState();
    if (state.hearts <= 0) return 0;
    state.hearts -= 1;
    state.heartsUpdated = Date.now();
    this.saveState(state);
    return state.hearts;
  },

  refillHearts() {
    const state = this.getState();
    state.hearts = 5;
    state.heartsUpdated = Date.now();
    this.saveState(state);
  },

  // ===== GEMS =====
  addGems(amount) {
    const state = this.getState();
    state.gems += amount;
    if (state.gems < 0) state.gems = 0;
    this.saveState(state);
    return state.gems;
  },

  // ===== LESSON COMPLETE (support xpReward dari lesson) =====
  completeLesson(lessonId, score, total, xpReward) {
    const state = this.getState();
    if (!state.completedLessons.includes(lessonId)) {
      state.completedLessons.push(lessonId);
    }
    const perfect = score === total;
    const xpEarned = xpReward + (perfect ? 5 : 0);
    state.xp += xpEarned;
    state.gems += perfect ? 5 : 2;
    state.totalCorrect += score;
    state.totalWrong += (total - score);

    const today = new Date().toISOString().split('T')[0];
    if (state.dailyXpDate !== today) {
      state.dailyXpDate = today;
      state.dailyXp = 0;
    }
    state.dailyXp += xpEarned;

    this.saveState(state);
    this.updateStreak();
    this.checkAchievements({ perfect: perfect });

    return { xpEarned, perfect, level: this.getLevel() };
  },

  isLessonCompleted(id) {
    return this.getState().completedLessons.includes(id);
  },

  // ===== ACHIEVEMENTS =====
  ACHIEVEMENTS: [
    { id: 'first_lesson', icon: '🎯', title: 'First Steps', desc: 'Selesaikan 1 lesson', check: s => s.completedLessons.length >= 1 },
    { id: 'five_lessons', icon: '🌟', title: 'Getting Started', desc: 'Selesaikan 5 lesson', check: s => s.completedLessons.length >= 5 },
    { id: 'ten_lessons', icon: '💎', title: 'Committed', desc: 'Selesaikan 10 lesson', check: s => s.completedLessons.length >= 10 },
    { id: 'twenty_lessons', icon: '🧠', title: 'Scholar', desc: 'Selesaikan 20 lesson', check: s => s.completedLessons.length >= 20 },
    { id: 'streak_3', icon: '🔥', title: 'On Fire', desc: 'Streak 3 hari', check: s => s.streak >= 3 },
    { id: 'streak_7', icon: '🔥', title: 'Unstoppable', desc: 'Streak 7 hari', check: s => s.streak >= 7 },
    { id: 'xp_100', icon: '⭐', title: 'Century', desc: 'Kumpulkan 100 XP', check: s => s.xp >= 100 },
    { id: 'xp_500', icon: '🌠', title: 'XP Master', desc: 'Kumpulkan 500 XP', check: s => s.xp >= 500 },
    { id: 'xp_1000', icon: '🚀', title: 'XP Legend', desc: 'Kumpulkan 1000 XP', check: s => s.xp >= 1000 },
    { id: 'perfect', icon: '🏆', title: 'Perfectionist', desc: 'Dapat skor 100% di 1 lesson', check: (s, extra) => extra && extra.perfect },
    { id: 'shopper', icon: '🛒', title: 'First Order', desc: 'Top up 1x', check: s => (DL.get('orders', []).length >= 1) },
    { id: 'big_spender', icon: '💰', title: 'Big Spender', desc: 'Top up 5x', check: s => (DL.get('orders', []).length >= 5) },
  ],

  checkAchievements(extra) {
    extra = extra || {};
    const state = this.getState();
    const unlocked = [...state.achievements];
    this.ACHIEVEMENTS.forEach(a => {
      if (!unlocked.includes(a.id) && a.check(state, extra)) {
        unlocked.push(a.id);
        if (typeof showAchievementPopup === 'function') {
          showAchievementPopup(a);
        }
      }
    });
    state.achievements = unlocked;
    this.saveState(state);
    return unlocked;
  },

  getAchievements() {
    const state = this.getState();
    return this.ACHIEVEMENTS.map(a => ({
      ...a,
      unlocked: state.achievements.includes(a.id)
    }));
  },

  reset() {
    const keys = ['xp','gems','hearts','heartsUpdated','streak','lastStudy',
                  'completedLessons','achievements','totalCorrect','totalWrong',
                  'dailyXp','dailyXpDate','orders'];
    keys.forEach(k => localStorage.removeItem('yadstore_' + k));
  },
};

if (typeof window !== 'undefined') window.DL = DL;
