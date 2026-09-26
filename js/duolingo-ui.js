const DuoUI = {
  currentLesson: null, currentQuestion: 0, score: 0, questions: [], currentCat: 'coding',
  chatHistory: [],

  // Escape HTML supaya <h1> jadi teks bukan tag
  esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  getLessons(cat) {
    var lang = (typeof I18n !== 'undefined') ? I18n.getLang() : 'id';
    if (typeof window.getLessonsByLang === 'function') {
      return window.getLessonsByLang(cat, lang);
    }
    // Fallback
    if (cat === 'english') return window.ENGLISH_LESSONS || [];
    if (cat === 'math') return window.MATH_LESSONS || [];
    if (cat === 'science') return window.SCIENCE_LESSONS || [];
    return window.CODING_LESSONS || [];
  },

  getCategories() {
    var lang = (typeof I18n !== 'undefined') ? I18n.getLang() : 'id';
    var cats = window.LESSON_CATEGORIES || { coding: { label: 'Coding', icon: '💻', color: '#1cb0f6' } };
    // Buat versi sesuai bahasa
    var result = {};
    Object.keys(cats).forEach(function(k) {
      result[k] = {
        label: (lang === 'en' && cats[k].label_en) ? cats[k].label_en : cats[k].label,
        icon: cats[k].icon,
        color: cats[k].color,
      };
    });
    return result;
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
    } catch (e) { console.error('[DuoUI]', e); }
  },

  renderCategories() {
    var c = document.getElementById('category-tabs');
    if (!c) return;
    var cats = this.getCategories();
    var keys = Object.keys(cats);
    var self = this;
    c.innerHTML = keys.map(function(k) {
      var cat = cats[k];
      var act = k === self.currentCat ? 'active' : '';
      return '<button class="cat-tab ' + act + '" onclick="DuoUI.switchCat(\'' + k + '\')" style="--cat-color: ' + cat.color + '">' +
        '<span class="cat-icon" style="background:' + cat.color + '">' + cat.icon + '</span>' +
        '<span class="cat-label">' + cat.label + '</span></button>';
    }).join('');
  },

  switchCat(cat) { this.currentCat = cat; this.renderCategories(); this.renderLessons(); },

  renderLessons() {
    var c = document.getElementById('lessons-list');
    if (!c) return;
    var lessons = this.getLessons(this.currentCat);
    if (lessons.length === 0) { c.innerHTML = '<p class="empty-msg">Belum ada lesson.</p>'; return; }
    var self = this;
    c.innerHTML = lessons.map(function(l) {
      var done = DL.isCompleted(l.id);
      return '<div class="lesson-card ' + (done ? 'done' : '') + '" onclick="DuoUI.start(\'' + l.id + '\')">' +
        '<div class="lesson-icon">' + l.icon + '</div>' +
        '<div class="lesson-info"><h3>' + self.esc(l.title) + (done ? ' ✓' : '') + '</h3>' +
        '<p>' + self.esc(l.desc) + '</p>' +
        '<div class="lesson-meta"><span>' + (l.level || 'Pemula') + '</span>' +
        '<span>+' + (l.xp || 10) + ' XP</span>' +
        '<span>' + l.questions.length + ' soal</span></div></div>' +
        '<div class="lesson-status">' + (done ? '✓' : '›') + '</div></div>';
    }).join('');
  },

  start(id) {
    var all = [].concat(window.CODING_LESSONS||[], window.ENGLISH_LESSONS||[], window.MATH_LESSONS||[], window.SCIENCE_LESSONS||[]);
    var lesson = all.find(function(l) { return l.id === id; });
    if (!lesson) return;
    var hearts = DL.regenHearts();
    if (hearts <= 0) { Animate.toast('Hearts habis!', 'error'); return; }
    this.currentLesson = lesson;
    this.questions = lesson.questions.slice().sort(function() { return Math.random() - 0.5; });
    this.currentQuestion = 0; this.score = 0;
    this.chatHistory = [];
    this.openChatRoom();
  },

  openChatRoom() {
    var modal = document.getElementById('lesson-modal');
    modal.classList.add('active');
    modal.classList.add('wa-mode');
    this.renderChat();
    // Push pertanyaan pertama ke chat
    var q = this.questions[0];
    var now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    this.chatHistory = [{ type: 'bot-question', text: q.q, time: now }];
    this.renderChat();
  },

  renderChat() {
    var modal = document.getElementById('lesson-modal');
    var l = this.currentLesson;
    var s = DL.getState();
    var total = this.questions.length;

    modal.innerHTML =
      '<div class="wa-app">' +
      '<div class="wa-topbar">' +
        '<button class="wa-back" onclick="DuoUI.exit()">←</button>' +
        '<div class="wa-avatar">' + l.icon + '</div>' +
        '<div class="wa-contact">' +
          '<div class="wa-name">' + this.esc(l.title) + '</div>' +
          '<div class="wa-status">online • ' + Math.min(this.currentQuestion + 1, total) + '/' + total + '</div>' +
        '</div>' +
        '<div class="wa-hearts">❤️ ' + s.hearts + '</div>' +
      '</div>' +
      '<div class="wa-progress"><div class="wa-progress-fill" style="width:' + ((this.currentQuestion/total)*100) + '%"></div></div>' +
      '<div class="wa-chat-body" id="wa-chat-body">' + this.renderChatMessages() + '</div>' +
      '<div class="wa-input-area" id="wa-input-area">' + this.renderOptions() + '</div>' +
      '</div>';
  },

  renderChatMessages() {
    var html = '';
    var today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    html += '<div class="wa-date">' + today + '</div>';
    var self = this;

    this.chatHistory.forEach(function(msg) {
      if (msg.type === 'bot-question') {
        html += '<div class="wa-row wa-row-bot">' +
          '<div class="wa-bubble wa-bubble-bot">' + self.esc(msg.text) + '</div>' +
          '<div class="wa-time">' + msg.time + '</div>' +
        '</div>';
      } else if (msg.type === 'user-answer') {
        html += '<div class="wa-row wa-row-user">' +
          '<div class="wa-bubble wa-bubble-user ' + (msg.correct ? 'correct' : 'wrong') + '">' +
            self.esc(msg.text) + (msg.correct ? ' ✓' : ' ✗') +
          '</div>' +
          '<div class="wa-time">' + msg.time + '</div>' +
        '</div>';
      } else if (msg.type === 'bot-reply') {
        html += '<div class="wa-row wa-row-bot">' +
          '<div class="wa-bubble wa-bubble-bot ' + (msg.correct ? 'reply-correct' : 'reply-wrong') + '">' + self.esc(msg.text) + '</div>' +
          '<div class="wa-time">' + msg.time + '</div>' +
        '</div>';
      }
    });

    return html;
  },

  renderOptions() {
    if (this.currentQuestion >= this.questions.length) {
      return '<button class="wa-send-btn" onclick="DuoUI.finish()">Lihat Hasil →</button>';
    }
    var q = this.questions[this.currentQuestion];
    var self = this;
    return '<div class="wa-options">' +
      q.o.map(function(opt, i) {
        return '<button class="wa-option-btn" onclick="DuoUI.answer(' + i + ')">' + self.esc(opt) + '</button>';
      }).join('') +
    '</div>';
  },

  scrollChat() {
    setTimeout(function() {
      var body = document.getElementById('wa-chat-body');
      if (body) body.scrollTop = body.scrollHeight;
    }, 50);
  },

  answer(i) {
    var q = this.questions[this.currentQuestion];
    var ok = i === q.a;
    var now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    // Push user answer
    this.chatHistory.push({
      type: 'user-answer',
      text: q.o[i],
      correct: ok,
      time: now
    });

    // Push bot reply
    var reply = ok ? ((typeof I18n !== 'undefined' ? I18n.t('correct') : 'Benar! 🎉')) : ((typeof I18n !== 'undefined' ? I18n.t('wrong') : 'Salah. Jawaban benar:') + ' ' + q.o[q.a]);
    this.chatHistory.push({
      type: 'bot-reply',
      text: reply,
      correct: ok,
      time: now
    });

    if (ok) this.score++; else DL.loseHeart();

    this.renderChat();
    this.scrollChat();

    var self = this;
    setTimeout(function() {
      self.currentQuestion++;
      if (self.currentQuestion < self.questions.length) {
        var nq = self.questions[self.currentQuestion];
        var t = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        self.chatHistory.push({ type: 'bot-question', text: nq.q, time: t });
        self.renderChat();
        self.scrollChat();
      } else {
        self.renderChat();
        self.scrollChat();
      }
    }, 900);
  },

  finish() {
    var l = this.currentLesson;
    var total = this.questions.length;
    var score = this.score;
    var r = DL.completeLesson(l.id, score, total, l.xp || 10);
    var modal = document.getElementById('lesson-modal');
    modal.classList.remove('wa-mode');
    modal.innerHTML = '<div class="modal-content lesson-modal-content"><div class="lesson-result">' +
      '<div class="result-icon">' + (r.perfect ? '🏆' : '🎉') + '</div>' +
      '<h2>' + (typeof I18n !== 'undefined' ? I18n.t(r.perfect ? 'lesson_perfect' : 'lesson_complete') : (r.perfect ? 'Sempurna!' : 'Selesai!')) + '</h2>' +
      '<p class="result-score">' + (typeof I18n !== 'undefined' ? I18n.t('score') : 'Skor') + ': ' + score + ' / ' + total + '</p>' +
      '<div class="result-stats"><div class="result-stat">+' + r.xpEarned + ' XP</div>' +
      '<div class="result-stat">+' + (r.perfect ? 5 : 2) + ' Gems</div></div>' +
      '<button class="btn-primary btn-full" onclick="DuoUI.exit()">' + (typeof I18n !== 'undefined' ? I18n.t('btn_continue') : 'Lanjut') + '</button>' +
      '</div></div>';
    Animate.confetti();
  },

  exit() {
    var m = document.getElementById('lesson-modal');
    if (m) { m.classList.remove('active'); m.classList.remove('wa-mode'); m.innerHTML = ''; }
    this.renderStats(); this.renderLessons(); this.renderAch(); this.renderProfile();
  },

  renderAch() {
    var c = document.getElementById('achievements-list');
    if (!c) return;

    // ===== RENDER STATS =====
    this.renderAchStats();

    // ===== RENDER TIER TABS =====
    this.renderTierTabs();

    // ===== RENDER LIST (sesuai filter tier) =====
    this.renderAchList();
  },

  // ============================================
  // ACHIEVEMENT STATS
  // ============================================
  renderAchStats() {
    var el = document.getElementById('ach-stats');
    if (!el) return;

    var achs = DL.getAch();
    var unlocked = achs.filter(function(a) { return a.unlocked; }).length;
    var total = achs.length;
    var totalCoin = 0;
    achs.forEach(function(a) { if (a.unlocked) totalCoin += (a.coin || 0); });

    el.innerHTML =
      '<div class="ach-stat">' +
        '<div class="ach-stat-value">' + unlocked + ' / ' + total + '</div>' +
        '<div class="ach-stat-label">Unlocked</div>' +
      '</div>' +
      '<div class="ach-stat">' +
        '<div class="ach-stat-value">+' + totalCoin.toLocaleString('id-ID') + ' 🪙</div>' +
        '<div class="ach-stat-label">Coin Earned</div>' +
      '</div>';
  },

  // ============================================
  // TIER TABS
  // ============================================
  currentTier: 'all',

  renderTierTabs() {
    var c = document.getElementById('ach-tier-tabs');
    if (!c) return;

    var achs = DL.getAch();
    var tierOrder = ['common', 'rare', 'epic', 'legendary', 'mythic'];
    var tierCounts = { all: achs.length };

    tierOrder.forEach(function(t) {
      tierCounts[t] = achs.filter(function(a) { return a.tier === t; }).length;
    });

    var tabs = [
      { id: 'all', label: 'Semua', icon: '🎯', color: '#58cc02' }
    ];
    tierOrder.forEach(function(t) {
      var tier = DL.TIERS[t];
      tabs.push({
        id: t,
        label: tier.name,
        icon: tier.icon,
        color: tier.color
      });
    });

    var self = this;
    c.innerHTML = tabs.map(function(t) {
      var active = self.currentTier === t.id ? 'active' : '';
      var count = tierCounts[t.id] || 0;
      return '<button class="ach-tier-tab ' + active + '" ' +
        'onclick="DuoUI.switchTier('' + t.id + '')" ' +
        'style="--tier-color: ' + t.color + '">' +
        '<span class="ach-tier-icon">' + t.icon + '</span>' +
        '<span class="ach-tier-label">' + t.label + '</span>' +
        '<span class="ach-tier-count">' + count + '</span>' +
        '</button>';
    }).join('');
  },

  switchTier(tier) {
    this.currentTier = tier;
    this.renderTierTabs();
    this.renderAchList();
  },

  // ============================================
  // ACHIEVEMENT LIST
  // ============================================
  renderAchList() {
    var c = document.getElementById('achievements-list');
    if (!c) return;

    var achs = DL.getAch();
    var self = this;

    // Filter by tier
    if (this.currentTier !== 'all') {
      achs = achs.filter(function(a) { return a.tier === self.currentTier; });
    }

    // Sort: unlocked last, then by tier difficulty
    var tierOrder = { mythic: 0, legendary: 1, epic: 2, rare: 3, common: 4 };
    achs.sort(function(a, b) {
      if (a.unlocked && !b.unlocked) return 1;
      if (!a.unlocked && b.unlocked) return -1;
      return (tierOrder[a.tier] || 4) - (tierOrder[b.tier] || 4);
    });

    if (achs.length === 0) {
      c.innerHTML = '<p class="empty-msg">Belum ada achievement</p>';
      return;
    }

    c.innerHTML = achs.map(function(a) {
      var tier = DL.TIERS[a.tier] || DL.TIERS.common;
      var cardClass = a.unlocked ? 'unlocked' : 'locked';
      var iconDisplay = a.unlocked ? a.icon : '🔒';

      return '<div class="achievement-card ' + cardClass + ' achievement-tier-' + (a.tier || 'common') + '">' +
        '<div class="achievement-icon" style="background:linear-gradient(135deg,' + tier.color + ',' + tier.color + 'cc)">' + iconDisplay + '</div>' +
        '<div class="achievement-info">' +
          '<div class="achievement-tier-badge" style="background:' + tier.color + '">' + tier.icon + ' ' + tier.name + '</div>' +
          '<h4>' + self.esc(a.title) + '</h4>' +
          '<p>' + self.esc(a.desc) + '</p>' +
          '<div class="achievement-reward">+' + a.coin + ' 🪙</div>' +
        '</div>' +
      '</div>';
    }).join('');
  },

  renderProfile() {
    var s = DL.getState(); var lv = DL.getLevel();
    var set = function(id, v) { var e = document.getElementById(id); if (e) e.textContent = v; };
    set('profile-level', lv.level); set('profile-xp', s.xp); set('profile-streak', s.streak);
    set('profile-gems', s.gems); set('profile-lessons', s.completedLessons.length);
    set('profile-correct', s.totalCorrect); set('profile-wrong', s.totalWrong);
    var pe = document.getElementById('profile-level-progress');
    if (pe) pe.style.width = ((lv.currentXp / lv.neededXp) * 100) + '%';
  },

  refill() {
    var s = DL.getState();
    if (s.gems < 20) { Animate.toast('Gems tidak cukup', 'error'); return; }
    DL.addGems(-20); DL.refillHearts();
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
if (typeof window !== 'undefined') { window.DuoUI = DuoUI; window.showAchPopup = showAchPopup; }
