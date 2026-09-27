/* ============================================
   YADSTORE — ARTICLES v2 (Iframe Mode)
   Baca artikel di dalam app, iklan tetap muncul
   ============================================ */

const Articles = {
  CONFIG: {
    READ_TIME: 60,
    MAX_PER_DAY: 10,
    REWARD_DEFAULT: 50,
    COOLDOWN: 30,
  },

  LIST: [
    {title: 'Cara Belajar Coding untuk Pemula', url: 'https://www.dicoding.com/blog/cara-belajar-coding-untuk-pemula/', icon: '💻', reward: 50},
    {title: 'Tips Belajar Bahasa Inggris Cepat', url: 'https://www.ruangguru.com/blog/tips-belajar-bahasa-inggris', icon: '🇬🇧', reward: 50},
    {title: 'Cara Cerdas Mengatur Uang Jajan', url: 'https://www.ocbc.id/id/article/2023/05/22/mengatur-uang-jajan', icon: '💰', reward: 50},
    {title: 'Manfaat Belajar Matematika Sehari-hari', url: 'https://www.zenius.net/blog/manfaat-belajar-matematika', icon: '🔢', reward: 50},
    {title: 'Tips Sukses Belajar Online', url: 'https://www.kompas.com/', icon: '🎓', reward: 50},
    {title: 'Cara Mengatur Waktu dengan Baik', url: 'https://www.bola.com/', icon: '⏰', reward: 50},
    {title: 'Panduan Investasi untuk Pemula', url: 'https://www.investopedia.com/', icon: '📈', reward: 50},
    {title: 'Cara Meningkatkan Fokus Belajar', url: 'https://www.healthline.com/', icon: '🧠', reward: 50}
  ],

  currentArticle: null,
  currentArticleIndex: null,
  currentTimer: null,
  secondsRead: 0,
  isReading: false,

  // ============================================
  // STORAGE
  // ============================================
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
  // BUKA ARTIKEL (MODE IFRAME)
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

    this.showIframeModal(article);
  },

  // ============================================
  // MODAL IFRAME (ARTIKEL + IKLAN)
  // ============================================
  showIframeModal: function(article) {
    var modal = document.getElementById('reward-modal');
    if (!modal) return;

    var self = this;
    
    // HTML modal full screen
    modal.innerHTML = 
      '<div class="modal-content" style="max-width:100%;width:100%;height:100vh;max-height:100vh;border-radius:0;padding:0;display:flex;flex-direction:column;background:#f0f0f0">' +
        
        // ===== TOP BAR (header + timer) =====
        '<div style="background:linear-gradient(135deg,#a855f7,#7c3aed);padding:12px 16px;display:flex;align-items:center;gap:12px;flex-shrink:0">' +
          '<button onclick="Articles.cancelRead()" style="background:rgba(255,255,255,0.2);border:none;color:white;width:36px;height:36px;border-radius:50%;font-size:18px;font-weight:900;cursor:pointer;flex-shrink:0">✕</button>' +
          '<div style="flex:1;min-width:0">' +
            '<div style="color:white;font-size:14px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + article.icon + ' ' + this.esc(article.title) + '</div>' +
            '<div id="article-timer-text" style="color:white;font-size:12px;font-weight:700;opacity:0.9;margin-top:2px">⏱️ 60 detik</div>' +
          '</div>' +
          '<div style="background:white;color:#a855f7;padding:6px 12px;border-radius:999px;font-size:13px;font-weight:900;flex-shrink:0">+' + article.reward + ' 🪙</div>' +
        '</div>' +

        // ===== PROGRESS BAR =====
        '<div style="height:4px;background:rgba(168,85,247,0.2);flex-shrink:0">' +
          '<div id="article-progress-bar" style="height:100%;width:0%;background:#a855f7;transition:width 1s linear"></div>' +
        '</div>' +

        // ===== BANNER AD SLOT (DI ATAS) =====
        '<div id="article-banner-top" style="background:#fff9e6;border-bottom:2px solid #ffc800;padding:8px;text-align:center;flex-shrink:0;min-height:60px;display:flex;align-items:center;justify-content:center">' +
          '<div style="font-size:11px;color:#7a5d00;font-weight:700">📢 Iklan</div>' +
        '</div>' +

        // ===== IFRAME ARTICLE =====
        '<div style="flex:1;overflow:hidden;position:relative">' +
          '<iframe id="article-iframe" src="' + article.url + '" ' +
            'style="width:100%;height:100%;border:none;background:white" ' +
            'sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox" ' +
            'referrerpolicy="no-referrer" ' +
            'onload="Articles.onIframeLoad()" ' +
          '></iframe>' +
          
          // Overlay info kalau iframe gagal load
          '<div id="article-iframe-error" style="display:none;position:absolute;inset:0;background:white;padding:24px;text-align:center;flex-direction:column;align-items:center;justify-content:center">' +
            '<div style="font-size:60px;margin-bottom:16px">🔒</div>' +
            '<h3 style="font-size:16px;font-weight:900;margin-bottom:8px">Artikel tidak bisa dimuat di dalam app</h3>' +
            '<p style="font-size:13px;color:#666;margin-bottom:16px">Klik tombol di bawah untuk buka di browser</p>' +
            '<button onclick="Articles.openExternal()" class="btn-primary" style="padding:12px 24px">🌐 Buka di Browser</button>' +
          '</div>' +
        '</div>' +

        // ===== BANNER AD SLOT (DI BAWAH) =====
        '<div id="article-banner-bottom" style="background:#fff9e6;border-top:2px solid #ffc800;padding:8px;text-align:center;flex-shrink:0;min-height:60px;display:flex;align-items:center;justify-content:center">' +
          '<div style="font-size:11px;color:#7a5d00;font-weight:700">📢 Iklan</div>' +
        '</div>' +

        // ===== BOTTOM INFO =====
        '<div style="background:white;padding:10px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0;border-top:2px solid #e5e5e5">' +
          '<div style="font-size:12px;color:#666;font-weight:700;flex:1">💡 Baca sampai timer selesai untuk dapat koin</div>' +
          '<div id="article-coin-badge" style="background:#a855f7;color:white;padding:6px 12px;border-radius:999px;font-size:12px;font-weight:900">+' + article.reward + ' 🪙</div>' +
        '</div>' +
      '</div>';

    modal.classList.add('active');

    // Inject banner ads ke slot
    this.injectBannerAds();

    // Start timer
    this.startTimer();
  },

  // ============================================
  // INJECT BANNER ADS
  // ============================================
  injectBannerAds: function() {
    // Iklan banner dari Adsterra/Monetag
    // Karena mereka biasanya inject via script global, kita cuma trigger re-render
    
    // Cara 1: Kalau AdsManager punya method banner
    if (typeof AdsManager !== 'undefined') {
      try {
        // Trigger refresh banner (kalau ada)
        if (AdsManager.refreshBanners) {
          AdsManager.refreshBanners();
        }
      } catch (e) {}
    }

    // Cara 2: Manual create ad slot dengan Monetag script
    var bannerTop = document.getElementById('article-banner-top');
    var bannerBottom = document.getElementById('article-banner-bottom');

    // Kalau ada script Monetag untuk banner, inject di sini
    // Contoh: kalau kamu punya zone banner
    if (bannerTop && !bannerTop.dataset.loaded) {
      bannerTop.dataset.loaded = 'true';
      // Inject Monetag banner script (kalau ada zone banner)
      // Untuk sekarang, tampilkan placeholder + trigger Adsterra popunder untuk banner
    }
  },

  // ============================================
  // IFRAME ONLOAD
  // ============================================
  onIframeLoad: function() {
    console.log('[Articles] Iframe loaded');
    // Reset error state
    var err = document.getElementById('article-iframe-error');
    if (err) err.style.display = 'none';
  },

  // ============================================
  // BUKA DI BROWSER (fallback)
  // ============================================
  openExternal: function() {
    var article = this.currentArticle;
    if (!article) return;
    
    // Simpan state
    localStorage.setItem('learnearn_article_pending', JSON.stringify({
      index: this.currentArticleIndex,
      startedAt: Date.now(),
      reward: article.reward,
    }));
    
    // Buka di browser
    window.open(article.url, '_blank');
  },

  // ============================================
  // TIMER
  // ============================================
  startTimer: function() {
    var self = this;
    this.secondsRead = 0;
    var totalTime = this.CONFIG.READ_TIME;

    if (this.currentTimer) clearInterval(this.currentTimer);

    this.currentTimer = setInterval(function() {
      self.secondsRead++;
      var remain = totalTime - self.secondsRead;

      // Update UI
      var textEl = document.getElementById('article-timer-text');
      var progressEl = document.getElementById('article-progress-bar');

      if (textEl) {
        if (remain > 0) {
          textEl.textContent = '⏱️ ' + remain + ' detik';
        } else {
          textEl.textContent = '✅ Selesai!';
        }
      }
      if (progressEl) {
        progressEl.style.width = ((self.secondsRead / totalTime) * 100) + '%';
      }

      if (self.secondsRead >= totalTime) {
        clearInterval(self.currentTimer);
        self.currentTimer = null;
        self.isReading = false;
        self.finishReading();
      }
    }, 1000);
  },

  // ============================================
  // SELESAI BACA
  // ============================================
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

  // ============================================
  // CANCEL
  // ============================================
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
    // Clear iframe to stop loading
    var iframe = document.getElementById('article-iframe');
    if (iframe) iframe.src = 'about:blank';
  },

  // ============================================
  // RENDER HALAMAN ARTIKEL
  // ============================================
  render: function() {
    var c = document.getElementById('articles-content');
    if (!c) return;

    var state = this.getState();
    var self = this;

    var html = '';

    // Stats card
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
        '📖 Baca artikel selama <strong>' + this.CONFIG.READ_TIME + ' detik</strong><br>' +
        '💰 Dapat <strong>+' + this.CONFIG.REWARD_DEFAULT + ' koin</strong> per artikel<br>' +
        '⏰ Max <strong>' + this.CONFIG.MAX_PER_DAY + ' artikel/hari</strong>' +
      '</div>' +
    '</div>';

    // Cooldown info
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

  // ============================================
  // CHECK PENDING (kalau user balik dari browser)
  // ============================================
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
  console.log('[articles] v2 loaded (iframe mode) — ' + Articles.LIST.length + ' artikel');
}
