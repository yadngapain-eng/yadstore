/* ============================================
   YADSTORE — ARTICLES v4 (Wikipedia Style)
   Tampilan seperti baca Wikipedia
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

  // ============================================
  // KATEGORI ARTIKEL
  // ============================================
  getCategories: function() {
    var cats = {
      'pendidikan': { label: 'Pendidikan', icon: '📚', color: '#0369a1' },
      'teknologi': { label: 'Teknologi', icon: '💻', color: '#7c3aed' },
      'umum': { label: 'Umum', icon: '🌍', color: '#059669' },
      'coding': { label: 'Coding', icon: '⌨️', color: '#dc2626' },
      'tutorial': { label: 'Tutorial', icon: '💡', color: '#ea580c' },
    };
    return cats;
  },

  getArticleCategory: function(url) {
    if (url.includes('developer.mozilla.org')) return 'coding';
    if (url.includes('wikihow.com')) return 'tutorial';
    if (url.includes('wikipedia.org')) {
      var lower = url.toLowerCase();
      if (lower.includes('komputer') || lower.includes('internet') ||
          lower.includes('kecerdasan') || lower.includes('pemrograman') ||
          lower.includes('teknologi')) return 'teknologi';
      if (lower.includes('matematika') || lower.includes('fisika') ||
          lower.includes('biologi') || lower.includes('kimia') ||
          lower.includes('sains') || lower.includes('astronomi')) return 'pendidikan';
      return 'umum';
    }
    return 'umum';
  },

  // ============================================
  // OPEN ARTICLE — WIKIPEDIA STYLE
  // ============================================
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
    this.showWikipediaModal(article);
  },

  // ============================================
  // MODAL WIKIPEDIA STYLE
  // ============================================
  showWikipediaModal: function(article) {
    var modal = document.getElementById('reward-modal');
    if (!modal) return;

    modal.innerHTML = 
      '<div class="modal-content" style="max-width:100%;width:100%;height:100vh;max-height:100vh;border-radius:0;padding:0;display:flex;flex-direction:column;background:#fff">' +
        
        // ===== TOP BAR (Wikipedia style) =====
        '<div style="background:#fff;border-bottom:1px solid #a2a9b1;padding:10px 16px;display:flex;align-items:center;gap:12px;flex-shrink:0;box-shadow:0 1px 3px rgba(0,0,0,0.05)">' +
          '<button onclick="Articles.cancelRead()" style="background:#f8f9fa;border:1px solid #a2a9b1;color:#54595d;width:36px;height:36px;border-radius:2px;font-size:18px;font-weight:900;cursor:pointer;flex-shrink:0">←</button>' +
          '<div style="flex:1;min-width:0;display:flex;align-items:center;gap:10px">' +
            '<div style="width:36px;height:36px;background:linear-gradient(135deg,#636466,#202122);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px;font-weight:900;flex-shrink:0">W</div>' +
            '<div style="flex:1;min-width:0">' +
              '<div style="font-size:15px;font-weight:700;color:#202122;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + this.esc(article.title) + '</div>' +
              '<div style="font-size:11px;color:#54595d;font-weight:400">Wikipedia Indonesia</div>' +
            '</div>' +
          '</div>' +
          '<div style="background:#f8f9fa;border:1px solid #a2a9b1;color:#202122;padding:6px 12px;border-radius:2px;font-size:13px;font-weight:700;flex-shrink:0" id="article-timer-text">⏱️ 60</div>' +
        '</div>' +

        // ===== PROGRESS BAR =====
        '<div style="height:3px;background:#eaecf0;flex-shrink:0">' +
          '<div id="article-progress-bar" style="height:100%;width:0%;background:#36c;transition:width 1s linear"></div>' +
        '</div>' +

        // ===== IFRAME WIKIPEDIA =====
        '<div style="flex:1;overflow:hidden;position:relative;background:#fff">' +
          '<iframe id="article-iframe" src="' + article.url + '" ' +
            'style="width:100%;height:100%;border:none;background:#fff" ' +
            'sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox" ' +
            'referrerpolicy="no-referrer" ' +
          '></iframe>' +
        '</div>' +

        // ===== BOTTOM BAR (Wikipedia style) =====
        '<div style="background:#f8f9fa;border-top:1px solid #a2a9b1;padding:10px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0">' +
          '<div style="flex:1;min-width:0">' +
            '<div style="font-size:11px;color:#54595d;font-weight:400">💰 Hadiah baca</div>' +
            '<div style="font-size:15px;font-weight:700;color:#202122">+' + article.reward + ' koin</div>' +
          '</div>' +
          '<button onclick="Articles.cancelRead()" style="background:#f8f9fa;border:1px solid #a2a9b1;color:#202122;padding:8px 16px;border-radius:2px;font-size:13px;font-weight:700;cursor:pointer">Tutup</button>' +
        '</div>' +
      '</div>';

    modal.classList.add('active');
    this.startTimer();
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

      if (textEl) textEl.textContent = remain > 0 ? '⏱️ ' + remain : '✓';
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
      modal.innerHTML = '<div class="modal-content" style="max-width:420px;margin:auto;padding:0;border-radius:8px;overflow:hidden">' +
        '<div style="background:linear-gradient(135deg,#10b981,#059669);padding:20px;text-align:center;color:#fff">' +
          '<div style="font-size:60px;margin-bottom:8px">🏆</div>' +
          '<h2 style="font-size:20px;font-weight:900;margin:0">+' + article.reward + ' Koin!</h2>' +
        '</div>' +
        '<div style="padding:20px;text-align:center;background:#fff">' +
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

  // ============================================
  // RENDER LIST — WIKIPEDIA STYLE
  // ============================================
  render: function() {
    var c = document.getElementById('articles-content');
    if (!c) return;

    var state = this.getState();
    var self = this;
    var cats = this.getCategories();

    var html = '';

    // ===== WIKIPEDIA HEADER =====
    html += '<div style="background:#fff;border:1px solid #a2a9b1;border-radius:2px;margin-bottom:16px;overflow:hidden">' +
      // Top strip (like Wikipedia main page)
      '<div style="background:#eaecf0;border-bottom:1px solid #a2a9b1;padding:8px 12px;display:flex;align-items:center;gap:10px">' +
        '<div style="width:40px;height:40px;background:linear-gradient(135deg,#636466,#202122);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px;font-weight:900;font-family:Georgia,serif">W</div>' +
        '<div style="flex:1">' +
          '<div style="font-family:Georgia,serif;font-size:18px;font-weight:700;color:#202122;line-height:1.2">Wikipedia</div>' +
          '<div style="font-family:Georgia,serif;font-size:11px;color:#54595d;font-style:italic">Ensiklopedia Bebas</div>' +
        '</div>' +
      '</div>' +
      
      // Title section
      '<div style="padding:16px 20px;background:#fff;border-bottom:1px solid #a2a9b1">' +
        '<h1 style="font-family:Georgia,serif;font-size:24px;font-weight:400;color:#000;margin:0 0 4px 0;border-bottom:1px solid #a2a9b1;padding-bottom:8px">Baca Artikel</h1>' +
        '<div style="font-family:Georgia,serif;font-size:13px;color:#54595d;font-style:italic">Baca artikel selama 1 menit dan dapatkan koin</div>' +
      '</div>' +
      
      // Stats section (like Wikipedia infobox)
      '<div style="padding:14px 20px;background:#f8f9fa">' +
        '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;font-family:Georgia,serif">' +
          '<div style="text-align:center">' +
            '<div style="font-size:22px;font-weight:700;color:#36c">' + state.todayCount + '</div>' +
            '<div style="font-size:11px;color:#54595d;text-transform:uppercase;letter-spacing:0.5px">Hari Ini</div>' +
          '</div>' +
          '<div style="text-align:center">' +
            '<div style="font-size:22px;font-weight:700;color:#36c">' + state.totalRead + '</div>' +
            '<div style="font-size:11px;color:#54595d;text-transform:uppercase;letter-spacing:0.5px">Total Baca</div>' +
          '</div>' +
          '<div style="text-align:center">' +
            '<div style="font-size:22px;font-weight:700;color:#14866d">+' + state.totalEarned + '</div>' +
            '<div style="font-size:11px;color:#54595d;text-transform:uppercase;letter-spacing:0.5px">Koin</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

    // ===== COOLDOWN WARNING =====
    var check = this.canRead();
    if (!check.ok && check.cooldown) {
      html += '<div style="background:#fef6e7;border:1px solid #fc3;border-radius:2px;padding:12px;margin-bottom:16px;font-family:Georgia,serif;font-size:13px;color:#ac6600;text-align:center">⏰ ' + check.reason + '</div>';
    }

    // ===== KATEGORI TABS =====
    html += '<div style="background:#fff;border:1px solid #a2a9b1;border-radius:2px;margin-bottom:16px;overflow:hidden">' +
      '<div style="padding:8px 12px;background:#eaecf0;border-bottom:1px solid #a2a9b1;font-family:Georgia,serif;font-size:13px;font-weight:700;color:#202122">Daftar Artikel</div>' +
      '<div style="padding:12px 16px;display:flex;flex-wrap:wrap;gap:6px">';
    
    var catKeys = Object.keys(cats);
    var allCatActive = this.currentCategory === 'all' ? 'background:#eaecf0;border-color:#a2a9b1;color:#202122' : 'background:#fff;border-color:#c8ccd1;color:#36c';
    html += '<button onclick="Articles.setCategory(\'all\')" style="padding:6px 12px;border:1px solid #c8ccd1;border-radius:2px;font-family:Georgia,serif;font-size:12px;font-weight:700;cursor:pointer;' + allCatActive + '">🎯 Semua</button>';

    catKeys.forEach(function(k) {
      var cat = cats[k];
      var active = self.currentCategory === k ? 'background:#eaecf0;border-color:#a2a9b1;color:#202122' : 'background:#fff;border-color:#c8ccd1;color:#36c';
      var count = self.LIST.filter(function(a) { return self.getArticleCategory(a.url) === k; }).length;
      html += '<button onclick="Articles.setCategory(\'' + k + '\')" style="padding:6px 12px;border:1px solid #c8ccd1;border-radius:2px;font-family:Georgia,serif;font-size:12px;font-weight:700;cursor:pointer;' + active + '">' + cat.icon + ' ' + cat.label + ' (' + count + ')</button>';
    });

    html += '</div></div>';

    // ===== FILTER ARTIKEL =====
    var filtered = this.LIST;
    if (this.currentCategory !== 'all') {
      filtered = this.LIST.filter(function(a) {
        return self.getArticleCategory(a.url) === self.currentCategory;
      });
    }

    // ===== LIST ARTIKEL (WIKIPEDIA STYLE) =====
    html += '<div style="background:#fff;border:1px solid #a2a9b1;border-radius:2px;overflow:hidden">';
    html += '<div style="padding:8px 12px;background:#eaecf0;border-bottom:1px solid #a2a9b1;font-family:Georgia,serif;font-size:13px;font-weight:700;color:#202122">' + filtered.length + ' Artikel Tersedia</div>';

    if (filtered.length === 0) {
      html += '<div style="padding:24px;text-align:center;color:#54595d;font-family:Georgia,serif;font-size:13px">Tidak ada artikel di kategori ini</div>';
    } else {
      filtered.forEach(function(article) {
        var index = self.LIST.indexOf(article);
        var read = self.hasRead(article.url);
        var cat = self.getArticleCategory(article.url);
        var catInfo = cats[cat] || cats.umum;
        
        html += '<div onclick="Articles.open(' + index + ')" style="' +
          'padding:12px 16px;' +
          'border-bottom:1px solid #eaecf0;' +
          'cursor:pointer;' +
          'display:flex;align-items:flex-start;gap:12px;' +
          (read ? 'background:#f8f9fa;' : '') +
          'transition:background 0.15s' +
          '" onmouseover="this.style.background=\'#f8f9fa\'" onmouseout="this.style.background=\'' + (read ? '#f8f9fa' : '#fff') + '\'">' +
          
          // Icon
          '<div style="width:40px;height:40px;background:#f8f9fa;border:1px solid #c8ccd1;border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">' + article.icon + '</div>' +
          
          // Info
          '<div style="flex:1;min-width:0">' +
            // Title (Wikipedia blue link style)
            '<div style="font-family:Georgia,serif;font-size:15px;font-weight:400;color:' + (read ? '#72777d' : '#36c') + ';margin-bottom:2px;line-height:1.3">' + self.esc(article.title) + '</div>' +
            
            // Meta info
            '<div style="font-family:Georgia,serif;font-size:11px;color:#54595d;font-style:italic;margin-bottom:4px">' + catInfo.icon + ' ' + catInfo.label + ' • Wikipedia Indonesia</div>' +
            
            // Reward/Status
            '<div style="font-family:Georgia,serif;font-size:11px;font-weight:700">' +
              (read 
                ? '<span style="color:#14866d">✓ Sudah dibaca hari ini</span>' 
                : '<span style="color:#ac6600">💰 +' + article.reward + ' koin</span>') +
            '</div>' +
          '</div>' +
          
          // Arrow
          '<div style="color:#36c;font-size:16px;font-weight:900;align-self:center">' + (read ? '' : '›') + '</div>' +
        '</div>';
      });
    }
    
    html += '</div>';

    // ===== INFO BACA (Wikipedia style) =====
    html += '<div style="background:#f8f9fa;border:1px solid #a2a9b1;border-radius:2px;padding:12px 16px;margin-top:16px;font-family:Georgia,serif;font-size:12px;color:#54595d;line-height:1.6">' +
      '<div style="font-weight:700;color:#202122;margin-bottom:6px">ℹ️ Cara Kerja</div>' +
      '• Baca artikel selama <strong>' + this.CONFIG.READ_TIME + ' detik</strong><br>' +
      '• Dapat <strong>+' + this.CONFIG.REWARD_DEFAULT + ' koin</strong> per artikel<br>' +
      '• Max <strong>' + this.CONFIG.MAX_PER_DAY + ' artikel</strong> per hari<br>' +
      '• Tidak bisa baca artikel yang sama 2x dalam 1 hari' +
    '</div>';

    c.innerHTML = html;
  },

  setCategory: function(cat) {
    this.currentCategory = cat;
    this.render();
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
  console.log('[articles] v4 loaded (Wikipedia style) — ' + Articles.LIST.length + ' artikel');
}
