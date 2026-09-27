/* ============================================
   YADSTORE — ARTICLES v3
   39 artikel iframe-friendly + banner ads
   ============================================ */

const Articles = {
  CONFIG: {
    READ_TIME: 60,
    MAX_PER_DAY: 10,
    REWARD_DEFAULT: 50,
    COOLDOWN: 30,
  },

  LIST: [
    {title: 'Apa itu Komputer?', url: 'https://id.wikipedia.org/wiki/Komputer', icon: '💻', reward: 50},
    {title: 'Belajar Matematika', url: 'https://id.wikipedia.org/wiki/Matematika', icon: '🔢', reward: 50},
    {title: 'Bahasa Inggris', url: 'https://id.wikipedia.org/wiki/Bahasa_Inggris', icon: '🇬🇧', reward: 50},
    {title: 'Sejarah Indonesia', url: 'https://id.wikipedia.org/wiki/Sejarah_Indonesia', icon: '📚', reward: 50},
    {title: 'Tata Surya', url: 'https://id.wikipedia.org/wiki/Tata_Surya', icon: '🌍', reward: 50},
    {title: 'Fisika Dasar', url: 'https://id.wikipedia.org/wiki/Fisika', icon: '⚡', reward: 50},
    {title: 'Biologi', url: 'https://id.wikipedia.org/wiki/Biologi', icon: '🧬', reward: 50},
    {title: 'Kimia', url: 'https://id.wikipedia.org/wiki/Kimia', icon: '🧪', reward: 50},
    {title: 'Ekonomi', url: 'https://id.wikipedia.org/wiki/Ekonomi', icon: '💰', reward: 50},
    {title: 'Internet', url: 'https://id.wikipedia.org/wiki/Internet', icon: '🌐', reward: 50},
    {title: 'Artificial Intelligence', url: 'https://id.wikipedia.org/wiki/Kecerdasan_buatan', icon: '🤖', reward: 50},
    {title: 'Pemrograman', url: 'https://id.wikipedia.org/wiki/Pemrograman', icon: '⌨️', reward: 50},
    {title: 'Indonesia', url: 'https://id.wikipedia.org/wiki/Indonesia', icon: '🇮🇩', reward: 50},
    {title: 'Jakarta', url: 'https://id.wikipedia.org/wiki/Jakarta', icon: '🏙️', reward: 50},
    {title: 'Pancasila', url: 'https://id.wikipedia.org/wiki/Pancasila', icon: '🇮🇩', reward: 50},
    {title: 'Bumi', url: 'https://id.wikipedia.org/wiki/Bumi', icon: '🌎', reward: 50},
    {title: 'Matahari', url: 'https://id.wikipedia.org/wiki/Matahari', icon: '☀️', reward: 50},
    {title: 'Bulan', url: 'https://id.wikipedia.org/wiki/Bulan', icon: '🌙', reward: 50},
    {title: 'Air', url: 'https://id.wikipedia.org/wiki/Air', icon: '💧', reward: 50},
    {title: 'Udara', url: 'https://id.wikipedia.org/wiki/Udara', icon: '🌬️', reward: 50},
    {title: 'Manusia', url: 'https://id.wikipedia.org/wiki/Manusia', icon: '👤', reward: 50},
    {title: 'Kesehatan', url: 'https://id.wikipedia.org/wiki/Kesehatan', icon: '💊', reward: 50},
    {title: 'Olahraga', url: 'https://id.wikipedia.org/wiki/Olahraga', icon: '⚽', reward: 50},
    {title: 'Musik', url: 'https://id.wikipedia.org/wiki/Musik', icon: '🎵', reward: 50},
    {title: 'Seni', url: 'https://id.wikipedia.org/wiki/Seni', icon: '🎨', reward: 50},
    {title: 'Film', url: 'https://id.wikipedia.org/wiki/Film', icon: '🎬', reward: 50},
    {title: 'Buku', url: 'https://id.wikipedia.org/wiki/Buku', icon: '📖', reward: 50},
    {title: 'Teknologi', url: 'https://id.wikipedia.org/wiki/Teknologi', icon: '⚙️', reward: 50},
    {title: 'Sains', url: 'https://id.wikipedia.org/wiki/Sains', icon: '🔬', reward: 50},
    {title: 'Sejarah Dunia', url: 'https://id.wikipedia.org/wiki/Sejarah_dunia', icon: '🏛️', reward: 50},
    {title: 'Geografi', url: 'https://id.wikipedia.org/wiki/Geografi', icon: '🗺️', reward: 50},
    {title: 'Astronomi', url: 'https://id.wikipedia.org/wiki/Astronomi', icon: '🔭', reward: 50},
    {title: 'Cara Belajar Efektif', url: 'https://id.wikihow.com/Belajar-Secara-Efektif', icon: '📚', reward: 50},
    {title: 'Cara Mengatur Waktu', url: 'https://id.wikihow.com/Mengatur-Waktu', icon: '⏰', reward: 50},
    {title: 'Cara Menghemat Uang', url: 'https://id.wikihow.com/Menghemat-Uang', icon: '💰', reward: 50},
    {title: 'Cara Sukses di Sekolah', url: 'https://id.wikihow.com/Sukses-di-Sekolah', icon: '🎓', reward: 50},
    {title: 'Belajar HTML', url: 'https://developer.mozilla.org/id/docs/Learn/HTML', icon: '🌐', reward: 50},
    {title: 'Belajar CSS', url: 'https://developer.mozilla.org/id/docs/Learn/CSS', icon: '🎨', reward: 50},
    {title: 'Belajar JavaScript', url: 'https://developer.mozilla.org/id/docs/Learn/JavaScript', icon: '⚡', reward: 50}
  ],

  currentArticle: null,
  currentArticleIndex: null,
  currentTimer: null,
  secondsRead: 0,
  isReading: false,
  currentCategory: 'all',

  get: function(key, def) {
    try {
      var v = localStorage.getItem('learnearn_article_' + key);
      return v !== null ? JSON.parse(v) : def;
    } catch (e) { return def; }
  },
  set: function(key, val) {
    try { localStorage.setItem('learnearn_article_' + key, JSON.stringify(val)); } catch (e) {}
  },

  getState: function() {
    var today = new Date().toISOString().split('T')[0];
    var lastDate = this.get('lastDate', null);
    if (lastDate !== today) {
      this.set('todayCount', 0);
      this.set('lastDate', today);
      this.set('todayArticles', []);
    }
    return {
      todayCount: this.get('todayCount', 0),
      todayArticles: this.get('todayArticles', []),
      totalRead: this.get('totalRead', 0),
      totalEarned: this.get('totalEarned', 0),
      lastDate: lastDate,
      lastReadTime: this.get('lastReadTime', 0),
    };
  },

  canRead: function() {
    var state = this.getState();
    if (state.todayCount >= this.CONFIG.MAX_PER_DAY) {
      return { ok: false, reason: 'Batas harian tercapai (max ' + this.CONFIG.MAX_PER_DAY + ')' };
    }
    var now = Date.now();
    if (state.lastReadTime && (now - state.lastReadTime) < this.CONFIG.COOLDOWN * 1000) {
      var remain = Math.ceil((this.CONFIG.COOLDOWN * 1000 - (now - state.lastReadTime)) / 1000);
      return { ok: false, reason: 'Tunggu ' + remain + ' detik lagi', cooldown: remain };
    }
    return { ok: true };
  },

  hasRead: function(articleUrl) {
    var state = this.getState();
    return state.todayArticles.indexOf(articleUrl) !== -1;
  },

  open: function(index) {
    var article = this.LIST[index];
    if (!article) return;
    var check = this.canRead();
    if (!check.ok) {
      if (typeof Animate !== 'undefined') Animate.toast('⚠️ ' + check.reason, 'error');
      return;
    }
    if (this.hasRead(article.url)) {
      if (typeof Animate !== 'undefined') Animate.toast('Artikel ini sudah kamu baca hari ini', 'error');
      return;
    }
    this.currentArticle = article;
    this.currentArticleIndex = index;
    this.secondsRead = 0;
    this.isReading = true;
    this.showIframeModal(article);
  },

  showIframeModal: function(article) {
    var modal = document.getElementById('reward-modal');
    if (!modal) return;

    modal.innerHTML = 
      '<div class="modal-content" style="max-width:100%;width:100%;height:100vh;max-height:100vh;border-radius:0;padding:0;display:flex;flex-direction:column;background:#f0f0f0">' +
        
        '<div style="background:linear-gradient(135deg,#a855f7,#7c3aed);padding:12px 16px;display:flex;align-items:center;gap:12px;flex-shrink:0">' +
          '<button onclick="Articles.cancelRead()" style="background:rgba(255,255,255,0.2);border:none;color:white;width:36px;height:36px;border-radius:50%;font-size:18px;font-weight:900;cursor:pointer;flex-shrink:0">✕</button>' +
          '<div style="flex:1;min-width:0">' +
            '<div style="color:white;font-size:14px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + article.icon + ' ' + this.esc(article.title) + '</div>' +
            '<div id="article-timer-text" style="color:white;font-size:12px;font-weight:700;opacity:0.9;margin-top:2px">⏱️ 60 detik</div>' +
          '</div>' +
          '<div style="background:white;color:#a855f7;padding:6px 12px;border-radius:999px;font-size:13px;font-weight:900;flex-shrink:0">+' + article.reward + ' 🪙</div>' +
        '</div>' +

        '<div style="height:4px;background:rgba(168,85,247,0.2);flex-shrink:0">' +
          '<div id="article-progress-bar" style="height:100%;width:0%;background:#a855f7;transition:width 1s linear"></div>' +
        '</div>' +

        // Banner ad atas
        '<div id="article-banner-top" style="background:white;border-bottom:2px solid #ffc800;padding:0;text-align:center;flex-shrink:0;min-height:50px;display:flex;align-items:center;justify-content:center;overflow:hidden">' +
          '<div style="font-size:11px;color:#999;font-weight:700;padding:16px">📢 Iklan (banner)</div>' +
        '</div>' +

        // Iframe
        '<div style="flex:1;overflow:hidden;position:relative">' +
          '<iframe id="article-iframe" src="' + article.url + '" ' +
            'style="width:100%;height:100%;border:none;background:white" ' +
            'sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox" ' +
            'referrerpolicy="no-referrer" ' +
          '></iframe>' +
        '</div>' +

        // Banner ad bawah
        '<div id="article-banner-bottom" style="background:white;border-top:2px solid #ffc800;padding:0;text-align:center;flex-shrink:0;min-height:50px;display:flex;align-items:center;justify-content:center;overflow:hidden">' +
          '<div style="font-size:11px;color:#999;font-weight:700;padding:16px">📢 Iklan (banner)</div>' +
        '</div>' +

        '<div style="background:white;padding:10px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0;border-top:2px solid #e5e5e5">' +
          '<div style="font-size:12px;color:#666;font-weight:700;flex:1">💡 Baca sampai timer selesai untuk dapat koin</div>' +
          '<div id="article-coin-badge" style="background:#a855f7;color:white;padding:6px 12px;border-radius:999px;font-size:12px;font-weight:900">+' + article.reward + ' 🪙</div>' +
        '</div>' +
      '</div>';

    modal.classList.add('active');
    this.injectBannerAds();
    this.startTimer();
  },

  injectBannerAds: function() {
    // Kalau user sudah punya AdsManager banner, trigger refresh
    if (typeof AdsManager !== 'undefined') {
      try {
        if (AdsManager.refreshBanners) AdsManager.refreshBanners();
      } catch (e) {}
    }
  },

  startTimer: function() {
    var self = this;
    this.secondsRead = 0;
    var totalTime = this.CONFIG.READ_TIME;

    if (this.currentTimer) clearInterval(this.currentTimer);

    this.currentTimer = setInterval(function() {
      self.secondsRead++;
      var remain = totalTime - self.secondsRead;

      var textEl = document.getElementById('article-timer-text');
      var progressEl = document.getElementById('article-progress-bar');

      if (textEl) textEl.textContent = remain > 0 ? '⏱️ ' + remain + ' detik' : '✅ Selesai!';
      if (progressEl) progressEl.style.width = ((self.secondsRead / totalTime) * 100) + '%';

      if (self.secondsRead >= totalTime) {
        clearInterval(self.currentTimer);
        self.currentTimer = null;
        self.isReading = false;
        self.finishReading();
      }
    }, 1000);
  },

  finishReading: function() {
    var article = this.currentArticle;
    if (!article) return;

    var state = this.getState();
    state.todayCount += 1;
    state.todayArticles.push(article.url);
    state.totalRead += 1;
    state.totalEarned += article.reward;
    state.lastReadTime = Date.now();

    this.set('todayCount', state.todayCount);
    this.set('todayArticles', state.todayArticles);
    this.set('totalRead', state.totalRead);
    this.set('totalEarned', state.totalEarned);
    this.set('lastReadTime', state.lastReadTime);

    if (typeof Rewards !== 'undefined' && Rewards.addCoin) {
      Rewards.addCoin(article.reward, '📖 Baca: ' + article.title);
    }

    var modal = document.getElementById('reward-modal');
    if (modal) {
      modal.innerHTML = '<div class="modal-content" style="max-width:420px;margin:auto;padding:0">' +
        '<div class="modal-header" style="background:linear-gradient(135deg,#10b981,#059669)">' +
          '<button class="modal-close" onclick="Articles.closeModal()">X</button>' +
          '<h2 style="color:white">🎉 Berhasil!</h2>' +
        '</div>' +
        '<div class="modal-body" style="text-align:center;padding:24px">' +
          '<div style="font-size:80px;margin-bottom:16px">🏆</div>' +
          '<h3 style="font-size:20px;font-weight:900;color:#10b981;margin-bottom:8px">+' + article.reward + ' Koin!</h3>' +
          '<p style="font-size:14px;color:#666;margin-bottom:16px">Kamu berhasil baca artikel</p>' +
          '<div style="background:#f0fdf4;border:2px solid #10b981;border-radius:12px;padding:12px;margin-bottom:16px">' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' +
              '<div><div style="font-size:20px;font-weight:900;color:#059669">' + state.todayCount + '</div><div style="font-size:11px;color:#666;font-weight:700">Hari Ini</div></div>' +
              '<div><div style="font-size:20px;font-weight:900;color:#059669">' + state.totalRead + '</div><div style="font-size:11px;color:#666;font-weight:700">Total</div></div>' +
            '</div>' +
          '</div>' +
          '<button onclick="Articles.closeModal(); Articles.render()" class="btn-primary btn-full">📖 Baca Lagi</button>' +
        '</div>' +
      '</div>';
    }

    if (typeof Animate !== 'undefined') Animate.confetti();
    this.currentArticle = null;
  },

  cancelRead: function() {
    if (this.currentTimer) {
      clearInterval(this.currentTimer);
      this.currentTimer = null;
    }
    this.isReading = false;
    this.secondsRead = 0;
    this.currentArticle = null;
    this.closeModal();
    if (typeof Animate !== 'undefined') Animate.toast('Dibatalkan', 'error');
  },

  closeModal: function() {
    var modal = document.getElementById('reward-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.innerHTML = '';
    }
    var iframe = document.getElementById('article-iframe');
    if (iframe) iframe.src = 'about:blank';
  },

  render: function() {
    var c = document.getElementById('articles-content');
    if (!c) return;

    var state = this.getState();
    var self = this;

    var html = '';

    // Stats
    html += '<div style="background:linear-gradient(135deg,#a855f7,#7c3aed);border-radius:16px;padding:16px;color:white;margin-bottom:16px;box-shadow:0 8px 24px rgba(168,85,247,0.3)">' +
      '<div style="display:flex;justify-content:space-between;align-items:center">' +
        '<div>' +
          '<div style="font-size:11px;opacity:0.9;font-weight:700;text-transform:uppercase">Artikel Hari Ini</div>' +
          '<div style="font-size:28px;font-weight:900;margin-top:4px">' + state.todayCount + ' / ' + this.CONFIG.MAX_PER_DAY + '</div>' +
        '</div>' +
        '<div style="text-align:right">' +
          '<div style="font-size:11px;opacity:0.9;font-weight:700;text-transform:uppercase">Total Koin</div>' +
          '<div style="font-size:28px;font-weight:900;margin-top:4px">+' + state.totalEarned + ' 🪙</div>' +
        '</div>' +
      '</div>' +
    '</div>';

    // Info
    html += '<div style="background:#faf5ff;border:2px solid #a855f7;border-radius:12px;padding:12px;margin-bottom:16px;text-align:center">' +
      '<div style="font-size:13px;color:#6b21a8;font-weight:800;line-height:1.6">' +
        '📖 Baca artikel <strong>' + this.CONFIG.READ_TIME + ' detik</strong> → <strong>+' + this.CONFIG.REWARD_DEFAULT + ' koin</strong><br>' +
        '📚 Total <strong>' + this.LIST.length + ' artikel</strong> tersedia<br>' +
        '⏰ Max <strong>' + this.CONFIG.MAX_PER_DAY + '/hari</strong>' +
      '</div>' +
    '</div>';

    var check = this.canRead();
    if (!check.ok && check.cooldown) {
      html = '<div style="background:#fff3cd;border:2px solid #ffc800;border-radius:12px;padding:12px;margin-bottom:16px;text-align:center;font-size:13px;font-weight:800;color:#7a5d00">⏰ ' + check.reason + '</div>' + html;
    }

    // List artikel
    html += '<div style="display:flex;flex-direction:column;gap:10px">';
    this.LIST.forEach(function(article, i) {
      var read = self.hasRead(article.url);
      html += '<div onclick="Articles.open(' + i + ')" style="' +
        'background:white;border:2px solid ' + (read ? '#10b981' : '#e5e5e5') + ';' +
        'border-radius:12px;padding:14px;cursor:pointer;display:flex;align-items:center;gap:12px;' +
        (read ? 'opacity:0.6;' : '') +
        '">' +
        '<div style="width:48px;height:48px;background:linear-gradient(135deg,#a855f7,#7c3aed);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0">' + article.icon + '</div>' +
        '<div style="flex:1;min-width:0">' +
          '<div style="font-size:14px;font-weight:800;margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">' + article.title + '</div>' +
          '<div style="font-size:12px;color:#a855f7;font-weight:800">' +
            (read ? '✅ Sudah dibaca' : '💰 +' + article.reward + ' koin') +
          '</div>' +
        '</div>' +
        '<div style="font-size:20px;color:' + (read ? '#10b981' : '#a855f7') + ';font-weight:900">' + (read ? '✓' : '›') + '</div>' +
      '</div>';
    });
    html += '</div>';

    c.innerHTML = html;
  },

  esc: function(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  checkPending: function() {
    try {
      var pending = localStorage.getItem('learnearn_article_pending');
      if (!pending) return;
      var data = JSON.parse(pending);
      var elapsed = Date.now() - (data.startedAt || 0);
      if (elapsed >= 60000 && elapsed < 5 * 60 * 1000) {
        var article = this.LIST[data.index];
        if (article) {
          this.currentArticle = article;
          this.currentArticleIndex = data.index;
          this.finishReading();
        }
      }
      localStorage.removeItem('learnearn_article_pending');
    } catch (e) {}
  },
};

if (typeof window !== 'undefined') {
  window.Articles = Articles;
  console.log('[articles] v3 loaded — ' + Articles.LIST.length + ' artikel');
}
