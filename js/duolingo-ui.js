const DuoUI = {
  currentLesson: null, currentQuestion: 0, score: 0, questions: [], currentCat: 'coding',

  getLessons(cat) {
    if (cat === 'english') return window.ENGLISH_LESSONS || [];
    if (cat === 'math') return window.MATH_LESSONS || [];
    if (cat === 'science') return window.SCIENCE_LESSONS || [];
    return window.CODING_LESSONS || [];
  },

  getCategories() {
    return window.LESSON_CATEGORIES || { coding: { label: 'Coding', icon: 'C', color: '#1cb0f6' } };
  },

  renderStats() {
    try {
      var s = DL.getState(); var lv = DL.getLevel();
      var set = function(id, v) { var e = document.getElementById(id); if (e) e.textContent = v; };
      set('stat-streak', s.streak); set('stat-gems', s.gems);
      set('stat-hearts', s.hearts); set('stat-xp', s.xp); set('stat-level', lv.level);
      var pe = document.getElementById('level-progress');
      if (pe) pe.style.width = ((lv.currentXp / lv.neededXp) * 100) + '%';
      var li = document.getElementById('level-info');
      if (li) li.textContent = lv.currentXp + ' / ' + lv.neededXp + ' XP';
    } catch (e) { console.error('[DuoUI] renderStats:', e); }
  },

  renderCategories() {
    try {
      var c = document.getElementById('category-tabs');
      if (!c) { console.error('[DuoUI] category-tabs not found'); return; }
      var cats = this.getCategories();
      var keys = Object.keys(cats);
      console.log('[DuoUI] render ' + keys.length + ' categories');
      c.innerHTML = keys.map(function(k) {
        var cat = cats[k];
        var act = k === DuoUI.currentCat ? 'active' : '';
        return '<button class="cat-tab ' + act + '" onclick="DuoUI.switchCat(\'' + k + '\')" style="--cat-color: ' + cat.color + '">' +
          '<span class="cat-icon" style="background:' + cat.color + '">' + cat.icon + '</span>' +
          '<span class="cat-label">' + cat.label + '</span></button>';
      }).join('');
    } catch (e) { console.error('[DuoUI] renderCategories:', e); }
  },

  switchCat(cat) { this.currentCat = cat; this.renderCategories(); this.renderLessons(); },

  renderLessons() {
    try {
      var c = document.getElementById('lessons-list');
      if (!c) { console.error('[DuoUI] lessons-list not found'); return; }
      var lessons = this.getLessons(this.currentCat);
      console.log('[DuoUI] render ' + lessons.length + ' lessons for ' + this.currentCat);
      if (lessons.length === 0) { c.innerHTML = '<p class="empty-msg">Belum ada lesson.</p>'; return; }
      c.innerHTML = lessons.map(function(l) {
        var done = DL.isCompleted(l.id);
        return '<div class="lesson-card ' + (done ? 'done' : '') + '" onclick="DuoUI.start(\'' + l.id + '\')">' +
          '<div class="lesson-icon">' + l.icon + '</div>' +
          '<div class="lesson-info"><h3>' + l.title + (done ? ' OK' : '') + '</h3>' +
          '<p>' + l.desc + '</p>' +
          '<div class="lesson-meta"><span>' + (l.level || 'Pemula') + '</span>' +
          '<span>+' + (l.xp || 10) + ' XP</span>' +
          '<span>' + l.questions.length + ' soal</span></div></div>' +
          '<div class="lesson-status">' + (done ? 'OK' : '>') + '</div></div>';
      }).join('');
    } catch (e) { console.error('[DuoUI] renderLessons:', e); }
  },

  start(id) {
    try {
      var all = [].concat(window.CODING_LESSONS||[], window.ENGLISH_LESSONS||[], window.MATH_LESSONS||[], window.SCIENCE_LESSONS||[]);
      var lesson = all.find(function(l) { return l.id === id; });
      if (!lesson) return;
      var hearts = DL.regenHearts();
      if (hearts <= 0) { Animate.toast('Hearts habis!', 'error'); return; }
      this.currentLesson = lesson;
      this.questions = lesson.questions.slice().sort(function() { return Math.random() - 0.5; });
      this.currentQuestion = 0; this.score = 0;
      this.renderQuiz();
    } catch (e) { console.error('[DuoUI] start:', e); }
  },

  renderQuiz() {
    var m = document.getElementById('lesson-modal');
    var q = this.questions[this.currentQuestion];
    var total = this.questions.length;
    var prog = (this.currentQuestion / total) * 100;
    m.innerHTML = '<div class="modal-content lesson-modal-content">' +
      '<div class="lesson-topbar">' +
      '<button class="lesson-close" onclick="DuoUI.exit()">X</button>' +
      '<div class="lesson-progress-bar"><div class="lesson-progress-fill" style="width: ' + prog + '%"></div></div>' +
      '<div class="lesson-hearts">Hearts: ' + DL.getState().hearts + '</div></div>' +
      '<div class="lesson-body">' +
      '<p class="question-counter">Soal ' + (this.currentQuestion + 1) + ' / ' + total + '</p>' +
      '<h2 class="question-text">' + q.q + '</h2>' +
      '<div class="options-list">' +
      q.o.map(function(opt, i) { return '<button class="option-btn" onclick="DuoUI.answer(' + i + ')">' + opt + '</button>'; }).join('') +
      '</div></div></div>';
    m.classList.add('active');
  },

  answer(i) {
    var q = this.questions[this.currentQuestion];
    var btns = document.querySelectorAll('.option-btn');
    var ok = i === q.a;
    btns.forEach(function(b, idx) {
      b.disabled = true;
      if (idx === q.a) b.classList.add('correct');
      if (idx === i && !ok) b.classList.add('wrong');
    });
    if (ok) this.score++; else DL.loseHeart();
    var self = this;
    setTimeout(function() {
      self.currentQuestion++;
      if (self.currentQuestion >= self.questions.length) self.finish();
      else self.renderQuiz();
    }, 900);
  },

  finish() {
    var l = this.currentLesson;
    var total = this.questions.length;
    var score = this.score;
    var r = DL.completeLesson(l.id, score, total, l.xp || 10);
    var m = document.getElementById('lesson-modal');
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
    var m = document.getElementById('lesson-modal');
    if (m) { m.classList.remove('active'); m.innerHTML = ''; }
    this.renderStats(); this.renderLessons(); this.renderAch(); this.renderProfile();
  },

  renderAch() {
    try {
      var c = document.getElementById('achievements-list');
      if (!c) return;
      var achs = DL.getAch();
      console.log('[DuoUI] render ' + achs.length + ' achievements');
      c.innerHTML = achs.map(function(a) {
        return '<div class="achievement-card ' + (a.unlocked ? 'unlocked' : 'locked') + '">' +
          '<div class="achievement-icon">' + (a.unlocked ? a.icon : 'L') + '</div>' +
          '<div class="achievement-info"><h4>' + a.title + '</h4><p>' + a.desc + '</p></div></div>';
      }).join('');
    } catch (e) { console.error('[DuoUI] renderAch:', e); }
  },

  renderProfile() {
    try {
      var s = DL.getState(); var lv = DL.getLevel();
      var set = function(id, v) { var e = document.getElementById(id); if (e) e.textContent = v; };
      set('profile-level', lv.level); set('profile-xp', s.xp); set('profile-streak', s.streak);
      set('profile-gems', s.gems); set('profile-lessons', s.completedLessons.length);
      set('profile-correct', s.totalCorrect); set('profile-wrong', s.totalWrong);
      var pe = document.getElementById('profile-level-progress');
      if (pe) pe.style.width = ((lv.currentXp / lv.neededXp) * 100) + '%';
    } catch (e) { console.error('[DuoUI] renderProfile:', e); }
  },

  refill() {
    var s = DL.getState();
    if (s.gems < 50) { Animate.toast('Gems tidak cukup', 'error'); return; }
    DL.addGems(-50); DL.refillHearts();
    this.renderStats(); Animate.toast('Hearts penuh!', 'success');
  },
};

function showAchPopup(a) {
  var p = document.createElement('div');
  p.className = 'achievement-popup';
  p.innerHTML = '<div class="achievement-popup-icon">' + a.icon + '</div>' +
    '<div class="achievement-popup-info"><strong>Achievement!</strong><span>' + a.title + '</span></div>';
  document.body.appendChild(p);
  setTimeout(function() { p.classList.add('show'); }, 100);
  setTimeout(function() { p.classList.remove('show'); setTimeout(function() { p.remove(); }, 300); }, 3000);
}
console.log('[duolingo-ui] loaded');
if (typeof window !== 'undefined') { window.DuoUI = DuoUI; window.showAchPopup = showAchPopup; }
