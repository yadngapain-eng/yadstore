
/* ============================================
   ARTICLE — Premium Render + Timer Coin
   ============================================ */
(function() {
  'use strict';

  if (typeof Articles === 'undefined') {
    console.warn('[ArticleUI] Articles tidak ditemukan');
    return;
  }

  var TimerState = {
    active: false,
    secondsLeft: 0,
    totalSeconds: 60,
    intervalId: null,
    articleIndex: null,
    article: null,
    canClaim: false
  };

  var CAT_COLORS = {
    'pendidikan': { bg: 'rgba(3,105,161,0.12)', color: '#0369a1', icon: '📚' },
    'teknologi': { bg: 'rgba(124,58,237,0.12)', color: '#7c3aed', icon: '💻' },
    'umum': { bg: 'rgba(5,150,105,0.12)', color: '#059669', icon: '🌍' },
    'coding': { bg: 'rgba(220,38,38,0.12)', color: '#dc2626', icon: '⌨️' },
    'tutorial': { bg: 'rgba(234,88,12,0.12)', color: '#ea580c', icon: '💡' }
  };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ============================================
  // RENDER PAGE
  // ============================================
  Articles.render = function() {
    var c = document.getElementById('articles-content');
    if (!c) return;

    var state = this.getState ? this.getState() : { todayCount: 0, totalRead: 0, totalEarned: 0 };
    var self = this;
    var cats = this.getCategories ? this.getCategories() : {};
    var currentCat = this.currentCategory || 'all';

    // ===== HERO =====
    var html = '<div class="article-hero">' +
      '<div class="article-hero-content">' +
        '<div class="article-hero-badge">📖 Baca & Dapat Koin</div>' +
        '<div class="article-hero-title">Baca Artikel,<br>Dapat Koin!</div>' +
        '<div class="article-hero-subtitle">Baca 1 menit, dapat ' + (this.CONFIG ? this.CONFIG.REWARD_DEFAULT : 50) + ' koin. Max ' + (this.CONFIG ? this.CONFIG.MAX_PER_DAY : 10) + ' artikel/hari.</div>' +
        '<div class="article-hero-stats">' +
          '<div class="article-stat">' +
            '<div class="article-stat-value">' + state.todayCount + '</div>' +
            '<div class="article-stat-label">Hari Ini</div>' +
          '</div>' +
          '<div class="article-stat">' +
            '<div class="article-stat-value">' + state.totalRead + '</div>' +
            '<div class="article-stat-label">Total Baca</div>' +
          '</div>' +
          '<div class="article-stat">' +
            '<div class="article-stat-value">+' + state.totalEarned + '</div>' +
            '<div class="article-stat-label">Koin</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

    // ===== CATEGORY PILLS =====
    html += '<div class="article-cats">';
    var allActive = currentCat === 'all' ? 'active' : '';
    html += '<button class="article-cat-pill ' + allActive + '" onclick="Articles.setCategory(\'all\')">🎯 Semua</button>';

    var catKeys = Object.keys(cats);
    catKeys.forEach(function(k) {
      var cat = cats[k];
      var active = currentCat === k ? 'active' : '';
      var count = (self.LIST || []).filter(function(a) {
        return self.getArticleCategory(a.url) === k;
      }).length;
      html += '<button class="article-cat-pill ' + active + '" onclick="Articles.setCategory(\'' + k + '\')">' +
        cat.icon + ' ' + cat.label + ' (' + count + ')' +
      '</button>';
    });
    html += '</div>';

    // ===== FILTER ARTICLES =====
    var filtered = this.LIST || [];
    if (currentCat !== 'all') {
      filtered = filtered.filter(function(a) {
        return self.getArticleCategory(a.url) === currentCat;
      });
    }

    // ===== SECTION TITLE =====
    html += '<div class="article-section-title">' +
      '<h3>📚 ' + (currentCat === 'all' ? 'Semua Artikel' : (cats[currentCat] && cats[currentCat].label) || 'Artikel') + '</h3>' +
      '<span class="article-section-count">' + filtered.length + ' artikel</span>' +
    '</div>';

    // ===== ARTICLE LIST =====
    if (filtered.length === 0) {
      html += '<div class="article-empty">' +
        '<span class="article-empty-icon">📭</span>' +
        '<div class="article-empty-text">Belum ada artikel di kategori ini</div>' +
        '<div class="article-empty-sub">Coba kategori lain</div>' +
      '</div>';
    } else {
      html += '<div class="article-list">';
      filtered.forEach(function(article) {
        var index = self.LIST.indexOf(article);
        var read = self.hasRead ? self.hasRead(article.url) : false;
        var cat = self.getArticleCategory(article.url);
        var catInfo = CAT_COLORS[cat] || CAT_COLORS.umum;
        var catData = cats[cat] || { label: 'Umum' };

        html += '<div class="article-card ' + (read ? 'read' : '') + '" onclick="Articles.open(' + index + ')">' +
          '<div class="article-icon">' + article.icon + '</div>' +
          '<div class="article-body">' +
            '<div class="article-cat-badge" style="background:' + catInfo.bg + ';color:' + catInfo.color + '">' +
              catInfo.icon + ' ' + (catData.label || 'Umum') +
            '</div>' +
            '<div class="article-title">' + esc(article.title) + '</div>' +
            '<div class="article-meta">' +
              '<span class="article-meta-item">⏱️ 1 menit</span>' +
              '<span class="article-meta-item">💰 +' + (article.reward || 50) + ' koin</span>' +
              (read ? '<span class="article-read-badge">✓ Sudah dibaca</span>' : '') +
            '</div>' +
          '</div>' +
          '<div class="article-reward">' +
            '<div class="article-reward-coin">🪙 +' + (article.reward || 50) + '</div>' +
            '<div class="article-arrow">›</div>' +
          '</div>' +
        '</div>';
      });
      html += '</div>';
    }

    c.innerHTML = html;
  };

  // ============================================
  // OPEN ARTICLE — Show Reader Modal
  // ============================================
  Articles.open = function(index) {
    var article = this.LIST[index];
    if (!article) return;

    var check = this.canRead ? this.canRead() : { ok: true };
    if (!check.ok) {
      if (typeof Animate !== 'undefined') Animate.toast('⚠️ ' + check.reason, 'error');
      return;
    }
    if (this.hasRead && this.hasRead(article.url)) {
      if (typeof Animate !== 'undefined') Animate.toast('Artikel ini sudah kamu baca hari ini', 'error');
      return;
    }

    this.currentArticle = article;
    this.currentArticleIndex = index;

    // Show reader dengan timer
    showReader(article, index);
  };

  // ============================================
  // READER MODAL + TIMER
  // ============================================
  function showReader(article, index) {
    var existing = document.getElementById('article-reader');
    if (existing) existing.remove();

    var totalSeconds = 60;
    TimerState.active = true;
    TimerState.secondsLeft = totalSeconds;
    TimerState.totalSeconds = totalSeconds;
    TimerState.articleIndex = index;
    TimerState.article = article;
    TimerState.canClaim = false;

    var reader = document.createElement('div');
    reader.id = 'article-reader';
    reader.className = 'article-reader active';
    reader.innerHTML =
      '<div class="article-reader-topbar">' +
        '<button class="article-reader-close" onclick="window.ArticleUI.close()">✕</button>' +
        '<div class="article-reader-info">' +
          '<div class="article-reader-title">' + esc(article.title) + '</div>' +
          '<div class="article-reader-cat">' + article.icon + ' Baca ' + totalSeconds + ' detik untuk dapat koin</div>' +
        '</div>' +
        '<div style="font-size:12px;font-weight:900;color:#58cc02;background:rgba(88,204,2,0.12);padding:6px 12px;border-radius:999px" id="reader-countdown">⏱️ ' + totalSeconds + 's</div>' +
      '</div>' +
      '<div class="article-reader-progress">' +
        '<div class="article-reader-progress-fill" id="reader-progress"></div>' +
      '</div>' +
      '<iframe class="article-reader-iframe" id="article-reader-iframe" ' +
        'src="' + article.url + '" ' +
        'sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox" ' +
        'referrerpolicy="no-referrer">' +
      '</iframe>' +
      // Floating coin counter
      '<div class="article-reader-coin-float" id="coin-float">' +
        '<div class="article-reader-coin-ring">' +
          '<svg width="80" height="80" viewBox="0 0 80 80">' +
            '<circle class="ring-bg" cx="40" cy="40" r="34" />' +
            '<circle class="ring-fill" cx="40" cy="40" r="34" ' +
              'style="stroke-dasharray:213.6;stroke-dashoffset:213.6" id="coin-ring" />' +
          '</svg>' +
          '<div class="article-reader-coin-center" id="coin-center">60</div>' +
        '</div>' +
      '</div>' +
      // Bottom CTA (muncul saat timer 0)
      '<div class="article-reader-cta" id="reader-cta">' +
        '<button class="article-reader-cta-btn" onclick="window.ArticleUI.claim()">' +
          '<span style="font-size:24px">🪙</span>' +
          '<span>Ambil +' + (article.reward || 50) + ' Koin</span>' +
        '</button>' +
      '</div>';

    document.body.appendChild(reader);
    document.body.style.overflow = 'hidden';

    // Start timer
    startTimer(article);
  }

  function startTimer(article) {
    clearInterval(TimerState.intervalId);
    TimerState.secondsLeft = TimerState.totalSeconds;

    var ringLength = 213.6; // 2 * PI * r (r=34)

    updateTimerUI();

    TimerState.intervalId = setInterval(function() {
      TimerState.secondsLeft--;

      if (TimerState.secondsLeft < 0) {
        TimerState.secondsLeft = 0;
      }

      updateTimerUI();

      if (TimerState.secondsLeft <= 0) {
        clearInterval(TimerState.intervalId);
        TimerState.intervalId = null;
        TimerState.canClaim = true;
        onTimerComplete();
      }
    }, 1000);
  }

  function updateTimerUI() {
    var s = TimerState.secondsLeft;
    var total = TimerState.totalSeconds;
    var ringLength = 213.6;
    var offset = ringLength * (1 - (s / total));

    // Update countdown in topbar
    var cd = document.getElementById('reader-countdown');
    if (cd) cd.textContent = '⏱️ ' + s + 's';

    // Update progress bar
    var pb = document.getElementById('reader-progress');
    if (pb) pb.style.width = ((total - s) / total * 100) + '%';

    // Update ring
    var ring = document.getElementById('coin-ring');
    if (ring) ring.style.strokeDashoffset = offset;

    // Update coin center
    var center = document.getElementById('coin-center');
    if (center) center.textContent = s;

    // Pulse effect saat < 10 detik
    if (s <= 10 && s > 0 && center) {
      center.style.animation = 'timerPulse 0.5s ease-in-out infinite';
      if (typeof UI !== 'undefined' && UI.haptic && s <= 5) {
        UI.haptic(20);
      }
    }
  }

  function onTimerComplete() {
    // Hide floating coin counter
    var float = document.getElementById('coin-float');
    if (float) float.classList.add('hidden');

    // Show CTA
    var cta = document.getElementById('reader-cta');
    if (cta) cta.classList.add('show');

    // Sound & haptic
    if (typeof UI !== 'undefined') {
      if (UI.sound) UI.sound('success');
      if (UI.haptic) UI.haptic([30, 50, 30]);
    }

    // Confetti kecil
    if (typeof UI !== 'undefined' && UI.confetti) {
      // Confetti mini di reader
      var container = document.createElement('div');
      container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:99999;overflow:hidden';
      document.body.appendChild(container);
      for (var i = 0; i < 30; i++) {
        var el = document.createElement('div');
        var size = Math.random() * 10 + 5;
        var colors = ['#fbbf24', '#f59e0b', '#58cc02', '#89e219'];
        var color = colors[Math.floor(Math.random() * colors.length)];
        el.style.cssText = 'position:absolute;width:' + size + 'px;height:' + size + 'px;background:' + color + ';left:' + (Math.random() * 100) + '%;top:-20px;border-radius:' + (Math.random() > 0.5 ? '50%' : '3px') + ';animation:confettiFall ' + (Math.random() * 2 + 2) + 's linear forwards;animation-delay:' + (Math.random() * 0.3) + 's';
        container.appendChild(el);
      }
      setTimeout(function() { container.remove(); }, 4500);
    }
  }

  // ============================================
  // CLAIM COIN (Klik untuk ambil)
  // ============================================
  Articles.claim = function() {
    if (!TimerState.canClaim) return;
    var article = TimerState.article;
    if (!article) return;

    // Save state
    var state = this.getState ? this.getState() : { todayCount: 0, todayArticles: [], totalRead: 0, totalEarned: 0 };
    state.todayCount = (state.todayCount || 0) + 1;
    state.todayArticles = state.todayArticles || [];
    state.todayArticles.push(article.url);
    state.totalRead = (state.totalRead || 0) + 1;
    state.totalEarned = (state.totalEarned || 0) + (article.reward || 50);
    state.lastReadTime = Date.now();

    if (this.set) {
      this.set('todayCount', state.todayCount);
      this.set('todayArticles', state.todayArticles);
      this.set('totalRead', state.totalRead);
      this.set('totalEarned', state.totalEarned);
      this.set('lastReadTime', state.lastReadTime);
    }

    // Add coin
    if (typeof Rewards !== 'undefined' && Rewards.addCoin) {
      try { Rewards.addCoin(article.reward || 50, '📖 ' + article.title); } catch (e) {}
    }

    // Show earned popup
    showEarnedPopup(article);

    // Reset timer state
    TimerState.canClaim = false;
  };

  function showEarnedPopup(article) {
    var popup = document.createElement('div');
    popup.className = 'coin-earned-popup';
    popup.innerHTML =
      '<div class="coin-earned-card">' +
        '<span class="coin-earned-emoji">🪙</span>' +
        '<div class="coin-earned-title">SELAMAT!</div>' +
        '<div class="coin-earned-amount">+' + (article.reward || 50) + '</div>' +
        '<div class="coin-earned-sub">Koin berhasil ditambahkan ke saldo kamu</div>' +
        '<button class="coin-earned-btn" onclick="window.ArticleUI.closeEarned()">Lanjut Baca 📖</button>' +
      '</div>';
    document.body.appendChild(popup);

    // Sound
    if (typeof UI !== 'undefined' && UI.sound) UI.sound('coin');
    if (typeof UI !== 'undefined' && UI.haptic) UI.haptic([50, 30, 50]);

    // Confetti
    if (typeof UI !== 'undefined' && UI.confetti) UI.confetti();
  }

  Articles.closeEarned = function() {
    var popup = document.querySelector('.coin-earned-popup');
    if (popup) {
      popup.style.animation = 'fadeIn 0.3s ease reverse';
      setTimeout(function() { popup.remove(); }, 300);
    }
    // Close reader & refresh list
    Articles.close();
    Articles.render();
  };

  Articles.close = function() {
    clearInterval(TimerState.intervalId);
    TimerState.intervalId = null;
    TimerState.active = false;

    var reader = document.getElementById('article-reader');
    if (reader) {
      reader.style.animation = 'readerSlideIn 0.3s ease reverse';
      setTimeout(function() { reader.remove(); }, 300);
    }
    document.body.style.overflow = '';

    // Refresh article list
    setTimeout(function() {
      if (typeof Articles !== 'undefined' && Articles.render) Articles.render();
    }, 350);
  };

  // ============================================
  // CANCEL (fallback ke cancelRead lama)
  // ============================================
  Articles.cancelRead = function() {
    Articles.close();
  };

  // Expose ArticleUI ke window untuk onclick
  window.ArticleUI = {
    close: Articles.close.bind(Articles),
    claim: Articles.claim.bind(Articles),
    closeEarned: Articles.closeEarned.bind(Articles)
  };

  console.log('[ArticleUI] Premium loaded');
})();
