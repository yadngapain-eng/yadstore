/* ============================================
   YADSTORE — DUOLINGO UI (Deploy Version)
   Baca lesson dari lessons-data.js
   Support kategori: Coding + English
   ============================================ */

const DuoUI = {
  currentLesson: null,
  currentQuestion: 0,
  score: 0,
  questions: [],
  currentCategory: 'coding',

  // ===== AMBIL LESSON SESUAI KATEGORI =====
  getLessons(category) {
    if (category === 'english') return window.ENGLISH_LESSONS || [];
    return window.CODING_LESSONS || [];
  },

  getCategories() {
    return window.LESSON_CATEGORIES || {
      coding: { label: 'Coding', icon: '💻', color: '#1cb0f6' },
      english: { label: 'English', icon: '🇬🇧', color: '#ce82ff' },
    };
  },

  // ===== HEADER STATS =====
  renderStats() {
    const state = DL.getState();
    const level = DL.getLevel();

    const el = (id) => document.getElementById(id);
    if (el('stat-streak')) el('stat-streak').textContent = state.streak;
    if (el('stat-gems')) el('stat-gems').textContent = state.gems;
    if (el('stat-hearts')) el('stat-hearts').textContent = state.hearts;
    if (el('stat-xp')) el('stat-xp').textContent = state.xp;
    if (el('stat-level')) el('stat-level').textContent = level.level;

    const progressEl = el('level-progress');
    if (progressEl) {
      const pct = (level.currentXp / level.neededXp) * 100;
      progressEl.style.width = pct + '%';
    }
    const levelInfo = el('level-info');
    if (levelInfo) {
      levelInfo.textContent = `${level.currentXp} / ${level.neededXp} XP`;
    }
  },

  // ===== KATEGORI TABS =====
  renderCategoryTabs() {
    const container = document.getElementById('category-tabs');
    if (!container) return;
    const cats = this.getCategories();
    container.innerHTML = Object.keys(cats).map(key => {
      const c = cats[key];
      const active = key === this.currentCategory ? 'active' : '';
      return `
        <button class="cat-tab ${active}" onclick="DuoUI.switchCategory('${key}')"
                style="--cat-color: ${c.color}">
          <span class="cat-icon">${c.icon}</span>
          <span class="cat-label">${c.label}</span>
        </button>
      `;
    }).join('');
  },

  switchCategory(cat) {
    this.currentCategory = cat;
    this.renderCategoryTabs();
    this.renderLessons();
  },

  // ===== LESSON LIST =====
  renderLessons() {
    const container = document.getElementById('lessons-list');
    if (!container) return;

    const lessons = this.getLessons(this.currentCategory);
    if (!lessons.length) {
      container.innerHTML = '<p class="empty-msg">Belum ada lesson.</p>';
      return;
    }

    container.innerHTML = lessons.map((les) => {
      const done = DL.isLessonCompleted(les.id);
      const total = les.questions.length;
      return `
        <div class="lesson-card ${done ? 'done' : ''}" onclick="DuoUI.startLesson('${les.id}')">
          <div class="lesson-icon">${les.icon}</div>
          <div class="lesson-info">
            <div class="lesson-title-row">
              <h3>${les.title}</h3>
              ${done ? '<span class="done-badge">✓</span>' : ''}
            </div>
            <p>${les.desc}</p>
            <div class="lesson-meta">
              <span class="lesson-level">${les.level || 'Pemula'}</span>
              <span class="lesson-xp">+${les.xp || 10} XP</span>
              <span class="lesson-q">${total} soal</span>
            </div>
          </div>
          <div class="lesson-status">${done ? '✔' : '›'}</div>
        </div>
      `;
    }).join('');
  },

  // ===== START LESSON =====
  startLesson(lessonId) {
    const allLessons = [
      ...(window.CODING_LESSONS || []),
      ...(window.ENGLISH_LESSONS || [])
    ];
    const lesson = allLessons.find(l => l.id === lessonId);
    if (!lesson) return;

    const hearts = DL.regenHearts();
    if (hearts <= 0) {
      alert('❤️ Hearts habis! Tunggu 4 jam atau isi ulang dengan 50 💎.');
      return;
    }

    this.currentLesson = lesson;
    // Shuffle + convert format o/a ke options/answer
    this.questions = [...lesson.questions]
      .sort(() => Math.random() - 0.5)
      .map(q => ({
        q: q.q,
        options: q.o || q.options,
        answer: q.a !== undefined ? q.a : q.answer
      }));
    this.currentQuestion = 0;
    this.score = 0;

    this.renderQuiz();
  },

  renderQuiz() {
    const modal = document.getElementById('lesson-modal');
    if (!modal) return;

    const q = this.questions[this.currentQuestion];
    const total = this.questions.length;
    const progress = ((this.currentQuestion) / total) * 100;

    modal.innerHTML = `
      <div class="modal-content lesson-modal-content">
        <div class="lesson-topbar">
          <button class="lesson-close" onclick="DuoUI.exitLesson()">✕</button>
          <div class="lesson-progress-bar">
            <div class="lesson-progress-fill" style="width: ${progress}%"></div>
          </div>
          <div class="lesson-hearts">❤️ ${DL.getState().hearts}</div>
        </div>

        <div class="lesson-body">
          <p class="question-counter">Soal ${this.currentQuestion + 1} / ${total}</p>
          <h2 class="question-text">${q.q}</h2>

          <div class="options-list">
            ${q.options.map((opt, i) => `
              <button class="option-btn" onclick="DuoUI.answer(${i})">
                ${opt}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    modal.classList.add('active');
  },

  answer(index) {
    const q = this.questions[this.currentQuestion];
    const buttons = document.querySelectorAll('.option-btn');
    const correct = index === q.answer;

    buttons.forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.answer) btn.classList.add('correct');
      if (i === index && !correct) btn.classList.add('wrong');
    });

    if (correct) {
      this.score++;
    } else {
      DL.loseHeart();
    }

    setTimeout(() => {
      this.currentQuestion++;
      if (this.currentQuestion >= this.questions.length) {
        this.finishLesson();
      } else {
        this.renderQuiz();
      }
    }, 900);
  },

  finishLesson() {
    const lesson = this.currentLesson;
    const total = this.questions.length;
    const score = this.score;
    const perfect = score === total;
    const xpReward = lesson.xp || 10;

    const result = DL.completeLesson(lesson.id, score, total, xpReward);

    const modal = document.getElementById('lesson-modal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-content lesson-modal-content">
        <div class="lesson-result">
          <div class="result-icon">${perfect ? '🏆' : '🎉'}</div>
          <h2>${perfect ? 'Sempurna!' : 'Lesson Selesai!'}</h2>
          <p class="result-score">Skor: ${score} / ${total}</p>

          <div class="result-stats">
            <div class="result-stat"><span>+${result.xpEarned} XP</span></div>
            <div class="result-stat"><span>+${perfect ? 5 : 2} 💎</span></div>
          </div>

          ${perfect ? '<p class="perfect-badge">✨ Bonus Perfect! ✨</p>' : ''}

          <button class="btn-primary btn-full" onclick="DuoUI.exitLesson()">
            Lanjut
          </button>
        </div>
      </div>
    `;
  },

  exitLesson() {
    const modal = document.getElementById('lesson-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.innerHTML = '';
    }
    this.currentLesson = null;
    this.renderStats();
    this.renderLessons();
    this.renderAchievements();
  },

  // ===== ACHIEVEMENTS =====
  renderAchievements() {
    const container = document.getElementById('achievements-list');
    if (!container) return;

    const achievements = DL.getAchievements();
    container.innerHTML = achievements.map(a => `
      <div class="achievement-card ${a.unlocked ? 'unlocked' : 'locked'}">
        <div class="achievement-icon">${a.unlocked ? a.icon : '🔒'}</div>
        <div class="achievement-info">
          <h4>${a.title}</h4>
          <p>${a.desc}</p>
        </div>
      </div>
    `).join('');
  },

  // ===== PROFILE =====
  renderProfile() {
    const state = DL.getState();
    const level = DL.getLevel();

    const el = (id) => document.getElementById(id);
    if (el('profile-level')) el('profile-level').textContent = level.level;
    if (el('profile-xp')) el('profile-xp').textContent = state.xp;
    if (el('profile-streak')) el('profile-streak').textContent = state.streak;
    if (el('profile-gems')) el('profile-gems').textContent = state.gems;
    if (el('profile-lessons')) el('profile-lessons').textContent = state.completedLessons.length;
    if (el('profile-correct')) el('profile-correct').textContent = state.totalCorrect;
    if (el('profile-wrong')) el('profile-wrong').textContent = state.totalWrong;
    if (el('profile-orders')) el('profile-orders').textContent = DL.get('orders', []).length;

    const progressEl = el('profile-level-progress');
    if (progressEl) {
      const pct = (level.currentXp / level.neededXp) * 100;
      progressEl.style.width = pct + '%';
    }
  },

  refillHeartsWithGems() {
    const state = DL.getState();
    if (state.gems < 50) {
      alert('💎 Gems tidak cukup! Butuh 50 gems.');
      return;
    }
    DL.addGems(-50);
    DL.refillHearts();
    this.renderStats();
    alert('❤️ Hearts penuh!');
  },
};

// ===== ACHIEVEMENT POPUP =====
function showAchievementPopup(achievement) {
  const popup = document.createElement('div');
  popup.className = 'achievement-popup';
  popup.innerHTML = `
    <div class="achievement-popup-icon">${achievement.icon}</div>
    <div class="achievement-popup-info">
      <strong>Achievement Unlocked!</strong>
      <span>${achievement.title}</span>
    </div>
  `;
  document.body.appendChild(popup);
  setTimeout(() => popup.classList.add('show'), 100);
  setTimeout(() => {
    popup.classList.remove('show');
    setTimeout(() => popup.remove(), 300);
  }, 3000);
}

if (typeof window !== 'undefined') {
  window.DuoUI = DuoUI;
  window.showAchievementPopup = showAchievementPopup;
}
