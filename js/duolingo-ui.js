/* YADSTORE — DUOLINGO UI */

const DuoUI = {
  currentLesson: null,
  currentQuestion: 0,
  score: 0,
  questions: [],
  currentCategory: 'coding',

  getLessons(cat) {
    if (cat === 'english') return window.ENGLISH_LESSONS || [];
    if (cat === 'math') return window.MATH_LESSONS || [];
    if (cat === 'science') return window.SCIENCE_LESSONS || [];
    return window.CODING_LESSONS || [];
  },
  getCategories() {
    return window.LESSON_CATEGORIES || {
      coding: { label: 'Coding', icon: '💻', color: '#1cb0f6' },
      english: { label: 'English', icon: '🇬🇧', color: '#ce82ff' },
    };
  },
  renderStats() {
    const s = DL.getState();
    const lv = DL.getLevel();
    const el = (id) => document.getElementById(id);
    if (el('stat-streak')) el('stat-streak').textContent = s.streak;
    if (el('stat-gems')) el('stat-gems').textContent = s.gems;
    if (el('stat-hearts')) el('stat-hearts').textContent = s.hearts;
    if (el('stat-xp')) el('stat-xp').textContent = s.xp;
    if (el('stat-level')) el('stat-level').textContent = lv.level;
    const pe = el('level-progress');
    if (pe) pe.style.width = ((lv.currentXp / lv.neededXp) * 100) + '%';
    const li = el('level-info');
    if (li) li.textContent = lv.currentXp + ' / ' + lv.neededXp + ' XP';
  },
  renderCategoryTabs() {
    const c = document.getElementById('category-tabs');
    if (!c) return;
    const cats = this.getCategories();
    c.innerHTML = Object.keys(cats).map(k => {
      const cat = cats[k];
      const act = k === this.currentCategory ? 'active' : '';
      return '<button class="cat-tab ' + act + '" onclick="DuoUI.switchCategory(\'' + k + '\')" style="--cat-color: ' + cat.color + '">' +
        '<span class="cat-icon">' + cat.icon + '</span><span class="cat-label">' + cat.label + '</span></button>';
    }).join('');
  },
  switchCategory(c) {
    this.currentCategory = c;
    this.renderCategoryTabs();
    this.renderLessons();
  },
  renderLessons() {
    const c = document.getElementById('lessons-list');
    if (!c) return;
    const lessons = this.getLessons(this.currentCategory);
    if (!lessons.length) { c.innerHTML = '<p class="empty-msg">Belum ada lesson.</p>'; return; }
    c.innerHTML = lessons.map(l => {
      const done = DL.isLessonCompleted(l.id);
      return '<div class="lesson-card ' + (done ? 'done' : '') + '" onclick="DuoUI.startLesson(\'' + l.id + '\')">' +
        '<div class="lesson-icon">' + l.icon + '</div>' +
        '<div class="lesson-info">' +
        '<div class="lesson-title-row"><h3>' + l.title + '</h3>' + (done ? '<span class="done-badge">OK</span>' : '') + '</div>' +
        '<p>' + l.desc + '</p>' +
        '<div class="lesson-meta">' +
        '<span class="lesson-level">' + (l.level || 'Pemula') + '</span>' +
        '<span class="lesson-xp">+' + (l.xp || 10) + ' XP</span>' +
        '<span class="lesson-q">' + l.questions.length + ' soal</span>' +
        '</div></div>' +
        '<div class="lesson-status">' + (done ? 'OK' : '>') + '</div></div>';
    }).join('');
  },
  startLesson(id) {
    const all = [...(window.CODING_LESSONS||[]), ...(window.ENGLISH_LESSONS||[]), ...(window.MATH_LESSONS||[]), ...(window.SCIENCE_LESSONS||[])];
    const lesson = all.find(l => l.id === id);
    if (!lesson) return;
    const hearts = DL.regenHearts();
    if (hearts <= 0) { alert('Hearts habis! Tunggu 4 jam atau isi ulang (50 gems).'); return; }
    this.currentLesson = lesson;
    this.questions = [...lesson.questions].sort(() => Math.random() - 0.5)
      .map(q => ({ q: q.q, options: q.o || q.options, answer: q.a !== undefined ? q.a : q.answer }));
    this.currentQuestion = 0;
    this.score = 0;
    this.renderQuiz();
  },
  renderQuiz() {
    const m = document.getElementById('lesson-modal');
    if (!m) return;
    const q = this.questions[this.currentQuestion];
    const total = this.questions.length;
    const prog = (this.currentQuestion / total) * 100;
    m.innerHTML = '<div class="modal-content lesson-modal-content">' +
      '<div class="lesson-topbar">' +
      '<button class="lesson-close" onclick="DuoUI.exitLesson()">X</button>' +
      '<div class="lesson-progress-bar"><div class="lesson-progress-fill" style="width: ' + prog + '%"></div></div>' +
      '<div class="lesson-hearts">' + DL.getState().hearts + '</div></div>' +
      '<div class="lesson-body">' +
      '<p class="question-counter">Soal ' + (this.currentQuestion + 1) + ' / ' + total + '</p>' +
      '<h2 class="question-text">' + q.q + '</h2>' +
      '<div class="options-list">' +
      q.options.map((opt, i) => '<button class="option-btn" onclick="DuoUI.answer(' + i + ')">' + opt + '</button>').join('') +
      '</div></div></div>';
    m.classList.add('active');
  },
  answer(i) {
    const q = this.questions[this.currentQuestion];
    const btns = document.querySelectorAll('.option-btn');
    const ok = i === q.answer;
    btns.forEach((b, idx) => {
      b.disabled = true;
      if (idx === q.answer) b.classList.add('correct');
      if (idx === i && !ok) b.classList.add('wrong');
    });
    if (ok) this.score++; else DL.loseHeart();
    setTimeout(() => {
      this.currentQuestion++;
      if (this.currentQuestion >= this.questions.length) this.finishLesson();
      else this.renderQuiz();
    }, 900);
  },
  finishLesson() {
    const l = this.currentLesson;
    const total = this.questions.length;
    const score = this.score;
    const perfect = score === total;
    const r = DL.completeLesson(l.id, score, total, l.xp || 10);
    const m = document.getElementById('lesson-modal');
    if (!m) return;
    m.innerHTML = '<div class="modal-content lesson-modal-content">' +
      '<div class="lesson-result">' +
      '<div class="result-icon">' + (perfect ? 'WIN' : 'DONE') + '</div>' +
      '<h2>' + (perfect ? 'Sempurna!' : 'Lesson Selesai!') + '</h2>' +
      '<p class="result-score">Skor: ' + score + ' / ' + total + '</p>' +
      '<div class="result-stats">' +
      '<div class="result-stat"><span>+' + r.xpEarned + ' XP</span></div>' +
      '<div class="result-stat"><span>+' + (perfect ? 5 : 2) + ' Gems</span></div>' +
      '</div>' +
      (perfect ? '<p class="perfect-badge">Bonus Perfect!</p>' : '') +
      '<button class="btn-primary btn-full" onclick="DuoUI.exitLesson()">Lanjut</button>' +
      '</div></div>';
  },
  exitLesson() {
    const m = document.getElementById('lesson-modal');
    if (m) { m.classList.remove('active'); m.innerHTML = ''; }
    this.currentLesson = null;
    this.renderStats();
    this.renderLessons();
    this.renderAchievements();
    this.renderProfile();
  },
  renderAchievements() {
    const c = document.getElementById('achievements-list');
    if (!c) return;
    const a = DL.getAchievements();
    c.innerHTML = a.map(x =>
      '<div class="achievement-card ' + (x.unlocked ? 'unlocked' : 'locked') + '">' +
      '<div class="achievement-icon">' + (x.unlocked ? x.icon : 'LOCK') + '</div>' +
      '<div class="achievement-info"><h4>' + x.title + '</h4><p>' + x.desc + '</p></div></div>'
    ).join('');
  },
  renderProfile() {
    const s = DL.getState();
    const lv = DL.getLevel();
    const el = (id) => document.getElementById(id);
    if (el('profile-level')) el('profile-level').textContent = lv.level;
    if (el('profile-xp')) el('profile-xp').textContent = s.xp;
    if (el('profile-streak')) el('profile-streak').textContent = s.streak;
    if (el('profile-gems')) el('profile-gems').textContent = s.gems;
    if (el('profile-lessons')) el('profile-lessons').textContent = s.completedLessons.length;
    if (el('profile-correct')) el('profile-correct').textContent = s.totalCorrect;
    if (el('profile-wrong')) el('profile-wrong').textContent = s.totalWrong;
    const pe = el('profile-level-progress');
    if (pe) pe.style.width = ((lv.currentXp / lv.neededXp) * 100) + '%';
  },
  refillHeartsWithGems() {
    const s = DL.getState();
    if (s.gems < 50) { alert('Gems tidak cukup! Butuh 50 gems.'); return; }
    DL.addGems(-50);
    DL.refillHearts();
    this.renderStats();
    alert('Hearts penuh!');
  },
};

function showAchievementPopup(a) {
  const p = document.createElement('div');
  p.className = 'achievement-popup';
  p.innerHTML = '<div class="achievement-popup-icon">' + a.icon + '</div>' +
    '<div class="achievement-popup-info"><strong>Achievement Unlocked!</strong><span>' + a.title + '</span></div>';
  document.body.appendChild(p);
  setTimeout(() => p.classList.add('show'), 100);
  setTimeout(() => { p.classList.remove('show'); setTimeout(() => p.remove(), 300); }, 3000);
}

if (typeof window !== 'undefined') {
  window.DuoUI = DuoUI;
  window.showAchievementPopup = showAchievementPopup;
}
