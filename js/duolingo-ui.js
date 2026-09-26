const DuoUI = {
  currentLesson: null, currentQuestion: 0, score: 0, questions: [], currentCat: 'coding',

  getLessons(cat) {
    if (cat === 'english') return window.ENGLISH_LESSONS || [];
    if (cat === 'math') return window.MATH_LESSONS || [];
    if (cat === 'science') return window.SCIENCE_LESSONS || [];
    return window.CODING_LESSONS || [];
  },
  getCategories() {
    return window.LESSON_CATEGORIES || {};
  },
  renderStats() {
    const s = DL.getState(); const lv = DL.getLevel();
    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    set('stat-streak', s.streak); set('stat-gems', s.gems);
    set('stat-hearts', s.hearts); set('stat-xp', s.xp); set('stat-level', lv.level);
    const pe = document.getElementById('level-progress');
    if (pe) pe.style.width = ((lv.currentXp / lv.neededXp) * 100) + '%';
    const li = document.getElementById('level-info');
    if (li) li.textContent = lv.currentXp + ' / ' + lv.neededXp + ' XP';
  },
  renderCategories() {
    const c = document.getElementById('category-tabs');
    if (!c) return;
    const cats = this.getCategories();
    c.innerHTML = Object.keys(cats).map(k => {
      const cat = cats[k];
      const act = k === this.currentCat ? 'active' : '';
      return '<button class="cat-tab ' + act + '" onclick="DuoUI.switchCat(\'' + k + '\')" style="--cat-color: ' + cat.color + '">' +
        '<span class="cat-icon" style="background:' + cat.color + '">' + cat.icon + '</span>' +
        '<span class="cat-label">' + cat.label + '</span></button>';
    }).join('');
  },
  switchCat(cat) { this.currentCat = cat; this.renderCategories(); this.renderLessons(); },
  renderLessons() {
    const c = document.getElementById('lessons-list');
    if (!c) return;
    const lessons = this.getLessons(this.currentCat);
    if (!lessons.length) { c.innerHTML = '<p class="empty-msg">Belum ada lesson.</p>'; return; }
    c.innerHTML = lessons.map(l => {
      const done = DL.isCompleted(l.id);
      return '<div class="lesson-card ' + (done ? 'done' : '') + '" onclick="DuoUI.start(\'' + l.id + '\')">' +
        '<div class="lesson-icon">' + l.icon + '</div>' +
        '<div class="lesson-info"><h3>' + l.title + (done ? ' OK' : '') + '</h3>' +
        '<p>' + l.desc + '</p>' +
        '<div class="lesson-meta"><span>' + (l.level || 'Pemula') + '</span>' +
        '<span>+' + (l.xp || 10) + ' XP</span>' +
        '<span>' + l.questions.length + ' soal</span></div></div>' +
        '<div class="lesson-status">' + (done ? 'OK' : '>') + '</div></div>';
    }).join('');
  },
  start(id) {
    const all = [...(window.CODING_LESSONS||[]), ...(window.ENGLISH_LESSONS||[]), ...(window.MATH_LESSONS||[]), ...(window.SCIENCE_LESSONS||[])];
    const lesson = all.find(l => l.id === id);
    if (!lesson) return;
    const hearts = DL.regenHearts();
    if (hearts <= 0) { Animate.toast('Hearts habis!', 'error'); return; }
    this.currentLesson = lesson;
    this.questions = [...lesson.questions].sort(() => Math.random() - 0.5);
    this.currentQuestion = 0; this.score = 0;
    this.renderQuiz();
  },
  renderQuiz() {
    const m = document.getElementById('lesson-modal');
    const q = this.questions[this.currentQuestion];
    const total = this.questions.length;
    const prog = (this.currentQuestion / total) * 100;
    m.innerHTML = '<div class="modal-content lesson-modal-content">' +
      '<div class="lesson-topbar">' +
      '<button class="lesson-close" onclick="DuoUI.exit()">X</button>' +
      '<div class="lesson-progress-bar"><div class="lesson-progress-fill" style="width: ' + prog + '%"></div></div>' +
      '<div class="lesson-hearts">Hearts: ' + DL.getState().hearts + '</div></div>' +
      '<div class="lesson-body">' +
      '<p class="question-counter">Soal ' + (this.currentQuestion + 1) + ' / ' + total + '</p>' +
      '<h2 class="question-text">' + q.q + '</h2>' +
      '<div class="options-list">' +
      q.o.map((opt, i) => '<button class="option-btn" onclick="DuoUI.answer(' + i + ')">' + opt + '</button>').join('') +
      '</div></div></div>';
    m.classList.add('active');
  },
  answer(i) {
    const q = this.questions[this.currentQuestion];
    const btns = document.querySelectorAll('.option-btn');
    const ok = i === q.a;
    btns.forEach((b, idx) => {
      b.disabled = true;
      if (idx === q.a) b.classList.add('correct');
      if (idx === i && !ok) b.classList.add('wrong');
    });
    if (ok) this.score++; else DL.loseHeart();
    setTimeout(() => {
      this.currentQuestion++;
      if (this.currentQuestion >= this.questions.length) this.finish();
      else this.renderQuiz();
    }, 900);
  },
  finish() {
    const l = this.currentLesson;
    const total = this.questions.length;
    const score = this.score;
    const r = DL.completeLesson(l.id, score, total, l.xp || 10);
    const m = document.getElementById('lesson-modal');
    m.innerHTML = '<div class="modal-content lesson-modal-content"><div class="lesson-result">' +
      '<div class="result-icon">' + (r.perfect ? 'WIN' : 'DONE') + '</div>' +
      '<h2>' + (r.perfect ? 'Sempurna!' : 'Selesai!') + '</h2>' +
      '<p class="result-score">Skor: ' + score + ' / ' + total + '</p>' +
      '<div class="result-stats"><div class="result-stat">+' + r.xpEarned + ' XP</div>' +
      '<div class="result-stat">+' + (r.perfect ? 5 : 2) + ' Gems</div></div>' +
      '<button class="btn-primary btn-full" onclick="DuoUI.exit()">Lanjut</button>' +
      '</div></div>';
    Animate.confetti();
  },
  exit() {
    const m = document.getElementById('lesson-modal');
    if (m) { m.classList.remove('active'); m.innerHTML = ''; }
    this.renderStats(); this.renderLessons(); this.renderAch(); this.renderProfile();
  },
  renderAch() {
    const c = document.getElementById('achievements-list');
    if (!c) return;
    c.innerHTML = DL.getAch().map(a =>
      '<div class="achievement-card ' + (a.unlocked ? 'unlocked' : 'locked') + '">' +
      '<div class="achievement-icon">' + (a.unlocked ? a.icon : 'L') + '</div>' +
      '<div class="achievement-info"><h4>' + a.title + '</h4><p>' + a.desc + '</p></div></div>'
    ).join('');
  },
  renderProfile() {
    const s = DL.getState(); const lv = DL.getLevel();
    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    set('profile-level', lv.level); set('profile-xp', s.xp); set('profile-streak', s.streak);
    set('profile-gems', s.gems); set('profile-lessons', s.completedLessons.length);
    set('profile-correct', s.totalCorrect); set('profile-wrong', s.totalWrong);
    const pe = document.getElementById('profile-level-progress');
    if (pe) pe.style.width = ((lv.currentXp / lv.neededXp) * 100) + '%';
  },
  refill() {
    const s = DL.getState();
    if (s.gems < 50) { Animate.toast('Gems tidak cukup', 'error'); return; }
    DL.addGems(-50); DL.refillHearts();
    this.renderStats(); Animate.toast('Hearts penuh!', 'success');
  },
};
function showAchPopup(a) {
  const p = document.createElement('div');
  p.className = 'achievement-popup';
  p.innerHTML = '<div class="achievement-popup-icon">' + a.icon + '</div>' +
    '<div class="achievement-popup-info"><strong>Achievement!</strong><span>' + a.title + '</span></div>';
  document.body.appendChild(p);
  setTimeout(() => p.classList.add('show'), 100);
  setTimeout(() => { p.classList.remove('show'); setTimeout(() => p.remove(), 300); }, 3000);
}
if (typeof window !== 'undefined') { window.DuoUI = DuoUI; window.showAchPopup = showAchPopup; }
