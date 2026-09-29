
/* ============================================
   LEARN EARN — Premium Features v2
   ============================================ */
(function() {
  'use strict';

  window.Features = window.Features || {};

  /* ============================================
     1. NOTIFICATION CENTER
     ============================================ */
  Features.Notif = {
    KEY: 'yadstore_notifications',
    MAX: 50,

    get: function() {
      try {
        return JSON.parse(localStorage.getItem(this.KEY) || '[]');
      } catch (e) { return []; }
    },

    save: function(list) {
      try {
        localStorage.setItem(this.KEY, JSON.stringify(list.slice(0, this.MAX)));
      } catch (e) {}
      this.updateBadge();
    },

    push: function(type, title, desc) {
      var iconMap = {
        earn: '💰', order: '🛒', ach: '🏆', withdraw: '💸', system: '📢'
      };
      var notif = {
        id: Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        type: type || 'system',
        icon: iconMap[type] || '📢',
        title: title,
        desc: desc || '',
        time: Date.now(),
        read: false,
      };
      var list = this.get();
      list.unshift(notif);
      this.save(list);
      this.showToast(notif);
      return notif;
    },

    unreadCount: function() {
      return this.get().filter(function(n) { return !n.read; }).length;
    },

    markAllRead: function() {
      var list = this.get();
      list.forEach(function(n) { n.read = true; });
      this.save(list);
      this.render();
    },

    clearAll: function() {
      if (!confirm('Hapus semua notifikasi?')) return;
      this.save([]);
      this.render();
    },

    updateBadge: function() {
      var badge = document.getElementById('notif-badge');
      var bell = document.getElementById('notif-bell');
      if (!badge || !bell) return;

      var count = this.unreadCount();
      if (count > 0) {
        badge.textContent = count > 99 ? '99+' : count;
        badge.style.display = 'flex';
        bell.classList.add('has-unread');
      } else {
        badge.style.display = 'none';
        bell.classList.remove('has-unread');
      }
    },

    showToast: function(notif) {
      if (typeof Animate !== 'undefined' && Animate.toast) {
        var msg = notif.icon + ' ' + notif.title;
        Animate.toast(msg, 'success');
      }
    },

    timeAgo: function(ts) {
      var sec = Math.floor((Date.now() - ts) / 1000);
      if (sec < 60) return 'Baru saja';
      if (sec < 3600) return Math.floor(sec / 60) + ' menit lalu';
      if (sec < 86400) return Math.floor(sec / 3600) + ' jam lalu';
      if (sec < 604800) return Math.floor(sec / 86400) + ' hari lalu';
      return new Date(ts).toLocaleDateString('id-ID');
    },

    render: function() {
      var listEl = document.getElementById('notif-list');
      if (!listEl) return;

      var list = this.get();
      if (list.length === 0) {
        listEl.innerHTML =
          '<div class="notif-empty">' +
            '<span class="notif-empty-icon">🔕</span>' +
            '<div style="font-size:14px;font-weight:800;color:#666">Belum ada notifikasi</div>' +
            '<div style="font-size:12px;color:#999;margin-top:4px">Aktivitas kamu akan muncul di sini</div>' +
          '</div>';
        return;
      }

      var self = this;
      listEl.innerHTML = list.map(function(n) {
        return '<div class="notif-item ' + (n.read ? '' : 'unread') + '">' +
          '<div class="notif-item-icon ' + n.type + '">' + n.icon + '</div>' +
          '<div class="notif-item-content">' +
            '<div class="notif-item-title">' + n.title + '</div>' +
            (n.desc ? '<div class="notif-item-desc">' + n.desc + '</div>' : '') +
            '<div class="notif-item-time">' + self.timeAgo(n.time) + '</div>' +
          '</div>' +
        '</div>';
      }).join('');
    },

    open: function() {
      var panel = document.getElementById('notif-panel');
      if (!panel) return;
      panel.classList.add('open');
      document.body.style.overflow = 'hidden';
      this.render();
      // Mark all as read after 1 second
      var self = this;
      setTimeout(function() { self.markAllRead(); }, 1000);
      if (typeof UI !== 'undefined' && UI.haptic) UI.haptic(10);
    },

    close: function() {
      var panel = document.getElementById('notif-panel');
      if (panel) panel.classList.remove('open');
      document.body.style.overflow = '';
    },

    injectBell: function() {
      if (document.getElementById('notif-bell')) return;

      var headerStats = document.querySelector('.header-stats');
      if (!headerStats) {
        setTimeout(this.injectBell.bind(this), 500);
        return;
      }

      var bell = document.createElement('button');
      bell.id = 'notif-bell';
      bell.className = 'notif-bell';
      bell.title = 'Notifikasi';
      bell.innerHTML = '🔔<span class="notif-badge" id="notif-badge" style="display:none">0</span>';
      bell.onclick = function() { Features.Notif.open(); };

      headerStats.insertBefore(bell, headerStats.firstChild);
      this.updateBadge();

      // Inject panel
      this.injectPanel();
    },

    injectPanel: function() {
      if (document.getElementById('notif-panel')) return;

      var panel = document.createElement('div');
      panel.id = 'notif-panel';
      panel.className = 'notif-panel';
      panel.innerHTML =
        '<div class="notif-panel-header">' +
          '<div>' +
            '<div class="notif-panel-title">🔔 Notifikasi</div>' +
            '<div class="notif-panel-actions">' +
              '<button onclick="Features.Notif.markAllRead()">✓ Tandai Baca</button>' +
              '<button onclick="Features.Notif.clearAll()">🗑️ Hapus</button>' +
            '</div>' +
          '</div>' +
          '<button class="notif-panel-close" onclick="Features.Notif.close()">✕</button>' +
        '</div>' +
        '<div class="notif-list" id="notif-list"></div>';
      document.body.appendChild(panel);

      // Backdrop click to close
      panel.addEventListener('click', function(e) {
        if (e.target === panel) Features.Notif.close();
      });
    },
  };

  /* ============================================
     2. LIVE ACTIVITY FEED
     ============================================ */
  Features.LiveFeed = {
    EVENTS: [
      { icon: '🎉', text: '{name} baru dapat {coin} koin', color: '#58cc02' },
      { icon: '🛒', text: '{name} baru top up {game}', color: '#1cb0f6' },
      { icon: '🏆', text: '{name} unlock achievement baru', color: '#f59e0b' },
      { icon: '💰', text: '{name} withdraw Rp {amount}', color: '#10b981' },
      { icon: '📖', text: '{name} baca "{article}"', color: '#6366f1' },
      { icon: '🔥', text: '{name} streak {days} hari!', color: '#ef4444' },
      { icon: '💎', text: '{name} dapat {gems} gems', color: '#a855f7' },
    ],

    NAMES: ['Andi', 'Budi', 'Citra', 'Dewi', 'Eka', 'Fajar', 'Gita', 'Hadi', 'Indra', 'Joko', 'Kartika', 'Lina', 'Made', 'Nisa', 'Oki', 'Putri', 'Rani', 'Sari', 'Tono', 'Umar'],

    GAMES: ['MLBB', 'Free Fire', 'PUBG', 'Genshin', 'Telkomsel', 'Indosat'],

    ARTICLES: ['Tata Surya', 'Komputer', 'Matematika', 'Sejarah', 'Biologi'],

    container: null,
    timer: null,
    shown: 0,

    randomItem: function(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    },

    randomNum: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    generateEvent: function() {
      var evt = this.randomItem(this.EVENTS);
      var name = this.randomItem(this.NAMES) + '***';
      var text = evt.text
        .replace('{name}', name)
        .replace('{coin}', this.randomNum(10, 500))
        .replace('{game}', this.randomItem(this.GAMES))
        .replace('{amount}', (this.randomNum(10, 200) * 1000).toLocaleString('id-ID'))
        .replace('{article}', this.randomItem(this.ARTICLES))
        .replace('{days}', this.randomNum(3, 30))
        .replace('{gems}', this.randomNum(2, 50));
      return { icon: evt.icon, text: text, color: evt.color };
    },

    show: function(event) {
      if (!this.container) return;

      var item = document.createElement('div');
      item.className = 'live-feed-item';
      item.innerHTML =
        '<div class="live-feed-icon" style="background:' + event.color + '20;color:' + event.color + '">' + event.icon + '</div>' +
        '<div class="live-feed-content">' +
          '<div class="live-feed-text">' + event.text + '</div>' +
          '<div class="live-feed-time">Baru saja</div>' +
        '</div>' +
        '<div class="live-dot"></div>';

      this.container.appendChild(item);

      // Animate in
      setTimeout(function() { item.classList.add('show'); }, 50);

      // Auto remove after 6s
      var self = this;
      setTimeout(function() {
        item.classList.add('fade-out');
        setTimeout(function() { item.remove(); }, 500);
      }, 6000);

      // Limit to 3 items
      while (this.container.children.length > 3) {
        this.container.removeChild(this.container.firstChild);
      }
    },

    init: function() {
      if (this.container) return;

      this.container = document.createElement('div');
      this.container.className = 'live-feed';
      this.container.id = 'live-feed';
      document.body.appendChild(this.container);

      // Show first event after 8s
      var self = this;
      setTimeout(function() {
        self.show(self.generateEvent());
        // Then every 12-20s
        self.timer = setInterval(function() {
          self.show(self.generateEvent());
        }, 15000);
      }, 8000);
    },
  };

  /* ============================================
     3. SOCIAL PROOF
     ============================================ */
  Features.SocialProof = {
    STATS: {
      users: 10000,
      transactions: 50000,
      coins: 500000000,
    },

    formatNum: function(n) {
      if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
      if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
      return n.toString();
    },

    render: function() {
      var container = document.createElement('div');
      container.className = 'social-proof';
      container.id = 'social-proof';
      container.innerHTML =
        '<div class="social-proof-item">' +
          '<span class="social-proof-value">⭐ 4.9</span>' +
          '<div class="social-proof-label">Rating User</div>' +
        '</div>' +
        '<div class="social-proof-item">' +
          '<span class="social-proof-value">' + this.formatNum(this.STATS.users) + '+</span>' +
          '<div class="social-proof-label">User Aktif</div>' +
        '</div>' +
        '<div class="social-proof-item">' +
          '<span class="social-proof-value">' + this.formatNum(this.STATS.transactions) + '+</span>' +
          '<div class="social-proof-label">Transaksi</div>' +
        '</div>';
      return container;
    },

    inject: function() {
      if (document.getElementById('social-proof')) return;

      // Inject sebelum page-header di halaman pertama yang visible
      var pages = document.querySelectorAll('.tab-page');
      var visiblePage = null;
      pages.forEach(function(p) {
        if (p.classList.contains('active')) visiblePage = p;
      });

      if (!visiblePage) {
        setTimeout(this.inject.bind(this), 500);
        return;
      }

      var pageHeader = visiblePage.querySelector('.page-header');
      if (pageHeader && !visiblePage.querySelector('.social-proof')) {
        var proof = this.render();
        pageHeader.parentNode.insertBefore(proof, pageHeader.nextSibling);
      }
    },
  };

  /* ============================================
     4. DAILY MISSIONS
     ============================================ */
  Features.Missions = {
    KEY: 'yadstore_missions',

    getDefault: function() {
      return {
        date: new Date().toISOString().split('T')[0],
        missions: [
          { id: 'login', icon: '📅', title: 'Login harian', reward: 15, done: false },
          { id: 'read1', icon: '📖', title: 'Baca 1 artikel', reward: 50, done: false },
          { id: 'read3', icon: '📚', title: 'Baca 3 artikel', reward: 150, done: false },
          { id: 'lesson', icon: '🎓', title: 'Selesaikan 1 lesson', reward: 10, done: false },
          { id: 'ad5', icon: '🎬', title: 'Nonton 5 iklan', reward: 200, done: false },
        ],
        progress: {
          readCount: 0,
          lessonCount: 0,
          adCount: 0,
        },
      };
    },

    get: function() {
      try {
        var data = JSON.parse(localStorage.getItem(this.KEY) || 'null');
        var today = new Date().toISOString().split('T')[0];
        if (!data || data.date !== today) {
          data = this.getDefault();
          this.save(data);
        }
        return data;
      } catch (e) {
        var def = this.getDefault();
        this.save(def);
        return def;
      }
    },

    save: function(data) {
      try {
        localStorage.setItem(this.KEY, JSON.stringify(data));
      } catch (e) {}
    },

    updateProgress: function(type) {
      var data = this.get();
      if (type === 'read') data.progress.readCount++;
      else if (type === 'lesson') data.progress.lessonCount++;
      else if (type === 'ad') data.progress.adCount++;

      // Auto-mark missions
      if (data.progress.readCount >= 1) data.missions[1].done = true;
      if (data.progress.readCount >= 3) data.missions[2].done = true;
      if (data.progress.lessonCount >= 1) data.missions[3].done = true;
      if (data.progress.adCount >= 5) data.missions[4].done = true;

      this.save(data);
      this.render();

      // Check if all done
      var allDone = data.missions.every(function(m) { return m.done; });
      if (allDone) {
        setTimeout(function() {
          if (typeof Animate !== 'undefined') {
            Animate.confetti();
            Animate.toast('🎉 Semua misi selesai! +425 koin bonus!', 'success');
          }
          if (typeof Rewards !== 'undefined') {
            Rewards.addCoin(425, '🎯 Semua misi harian selesai');
          }
        }, 500);
      }
    },

    claimMission: function(id) {
      var data = this.get();
      var mission = data.missions.find(function(m) { return m.id === id; });
      if (!mission || !mission.done) return;

      if (typeof Rewards !== 'undefined') {
        Rewards.addCoin(mission.reward, '🎯 ' + mission.title);
      }
      mission.claimed = true;
      this.save(data);
      this.render();

      if (typeof Animate !== 'undefined') {
        Animate.confetti();
        Animate.toast('💰 +' + mission.reward + ' koin!', 'success');
      }
      if (typeof Features.Notif !== 'undefined') {
        Features.Notif.push('earn', 'Misi selesai!', mission.title + ' → +' + mission.reward + ' koin');
      }
    },

    render: function() {
      var container = document.getElementById('missions-container');
      if (!container) return;

      var data = this.get();
      var doneCount = data.missions.filter(function(m) { return m.done; }).length;
      var total = data.missions.length;
      var percent = Math.round((doneCount / total) * 100);

      // Time until reset
      var now = new Date();
      var tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      var diff = tomorrow - now;
      var hours = Math.floor(diff / (1000 * 60 * 60));
      var mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      container.innerHTML =
        '<div class="missions-card">' +
          '<div class="missions-header">' +
            '<div class="missions-title">🎯 Misi Hari Ini</div>' +
            '<div class="missions-reset">Reset: ' + hours + 'j ' + mins + 'm</div>' +
          '</div>' +
          '<div class="missions-progress">' +
            '<div class="missions-progress-fill" style="width:' + percent + '%"></div>' +
          '</div>' +
          data.missions.map(function(m) {
            return '<div class="mission-item ' + (m.done ? 'done' : '') + '">' +
              '<div class="mission-check">' + (m.done ? '✓' : '') + '</div>' +
              '<div class="mission-info">' +
                '<div class="mission-title">' + m.icon + ' ' + m.title + '</div>' +
              '</div>' +
              '<div class="mission-reward">+' + m.reward + '</div>' +
            '</div>';
          }).join('') +
          '<div style="text-align:center;margin-top:12px;font-size:11px;color:#999;font-weight:700">' +
            'Progress: ' + doneCount + '/' + total + ' • ' + percent + '%' +
          '</div>' +
        '</div>';
    },

    inject: function() {
      var target = document.getElementById('articles-content') ||
                   document.querySelector('.tab-page.active');
      if (!target) {
        setTimeout(this.inject.bind(this), 500);
        return;
      }
      if (document.getElementById('missions-container')) return;

      var div = document.createElement('div');
      div.id = 'missions-container';
      target.insertBefore(div, target.firstChild);
      this.render();
    },
  };

  /* ============================================
     5. SPIN WHEEL
     ============================================ */
  Features.Spin = {
    KEY: 'yadstore_spin',
    REWARDS: [
      { type: 'coin', value: 25, weight: 30 },
      { type: 'coin', value: 50, weight: 25 },
      { type: 'coin', value: 100, weight: 15 },
      { type: 'coin', value: 250, weight: 10 },
      { type: 'coin', value: 500, weight: 8 },
      { type: 'coin', value: 1000, weight: 6 },
      { type: 'heart', value: 5, weight: 4 },
      { type: 'coin', value: 5000, weight: 2 },
    ],

    getLastSpin: function() {
      try {
        return JSON.parse(localStorage.getItem(this.KEY) || 'null');
      } catch (e) { return null; }
    },

    canSpin: function() {
      var last = this.getLastSpin();
      if (!last) return true;
      var today = new Date().toISOString().split('T')[0];
      return last.date !== today;
    },

    doSpin: function() {
      if (!this.canSpin()) return null;

      // Weighted random
      var totalWeight = this.REWARDS.reduce(function(s, r) { return s + r.weight; }, 0);
      var random = Math.random() * totalWeight;
      var cumulative = 0;
      var selected = this.REWARDS[0];
      for (var i = 0; i < this.REWARDS.length; i++) {
        cumulative += this.REWARDS[i].weight;
        if (random < cumulative) {
          selected = this.REWARDS[i];
          break;
        }
      }

      // Save
      var today = new Date().toISOString().split('T')[0];
      try {
        localStorage.setItem(this.KEY, JSON.stringify({
          date: today,
          reward: selected,
          ts: Date.now(),
        }));
      } catch (e) {}

      // Apply reward
      if (selected.type === 'coin') {
        if (typeof Rewards !== 'undefined') {
          Rewards.addCoin(selected.value, '🎰 Spin harian');
        }
      } else if (selected.type === 'heart') {
        if (typeof DL !== 'undefined' && DL.addHeart) {
          DL.addHeart(selected.value);
        }
      }

      // Notif
      if (typeof Features.Notif !== 'undefined') {
        Features.Notif.push('earn', '🎰 Spin berhasil!', 'Dapat ' + selected.value + ' ' + (selected.type === 'coin' ? 'koin' : 'heart'));
      }

      // Mission update (spin juga dihitung sebagai "aktivitas")
      if (typeof Features.Missions !== 'undefined') {
        Features.Missions.updateProgress('ad');
      }

      return selected;
    },

    render: function() {
      var container = document.getElementById('spin-container');
      if (!container) return;

      var canSpin = this.canSpin();
      var last = this.getLastSpin();
      var lastInfo = '';

      if (!canSpin && last) {
        lastInfo = 'Kamu sudah spin hari ini. Kembali besok!';
      } else {
        lastInfo = '1x spin gratis setiap hari!';
      }

      container.innerHTML =
        '<div class="spin-card">' +
          '<div class="spin-title">🎰 Spin & Win</div>' +
          '<div class="spin-desc">' + lastInfo + '</div>' +
          '<div class="spin-wheel-wrap">' +
            '<div class="spin-pointer">▼</div>' +
            '<div class="spin-wheel" id="spin-wheel"></div>' +
          '</div>' +
          '<button class="spin-btn" id="spin-btn" ' + (canSpin ? '' : 'disabled') + ' onclick="Features.Spin.startSpin()">' +
            (canSpin ? '🎰 SPIN SEKARANG' : '✅ Sudah Spin Hari Ini') +
          '</button>' +
          '<div class="spin-info">' +
            'Hadiah: 🪙 Koin, ❤️ Heart, hingga 5.000 koin!' +
          '</div>' +
        '</div>';
    },

    startSpin: function() {
      if (!this.canSpin()) {
        if (typeof Animate !== 'undefined') {
          Animate.toast('⏰ Kembali besok untuk spin lagi!', 'error');
        }
        return;
      }

      var wheel = document.getElementById('spin-wheel');
      var btn = document.getElementById('spin-btn');
      if (!wheel || !btn) return;

      btn.disabled = true;
      btn.textContent = '🎰 Memutar...';

      var reward = this.doSpin();
      if (!reward) return;

      // Random rotation 5-8 turns
      var spins = 5 + Math.floor(Math.random() * 4);
      var extraDeg = Math.floor(Math.random() * 360);
      var totalDeg = spins * 360 + extraDeg;
      wheel.style.transform = 'rotate(' + totalDeg + 'deg)';

      var self = this;
      setTimeout(function() {
        self.showResult(reward);
      }, 4200);
    },

    showResult: function(reward) {
      var modal = document.createElement('div');
      modal.className = 'spin-result-modal';
      modal.id = 'spin-result-modal';

      var emoji = reward.type === 'coin' ? '🪙' : '❤️';
      var label = reward.type === 'coin' ? 'koin' : 'heart';

      modal.innerHTML =
        '<div class="spin-result-card">' +
          '<span class="spin-result-emoji">' + emoji + '</span>' +
          '<div class="spin-result-title">SELAMAT!</div>' +
          '<div class="spin-result-amount">+' + reward.value.toLocaleString('id-ID') + '</div>' +
          '<div class="spin-result-sub">' + label + ' berhasil ditambahkan!</div>' +
          '<button class="spin-result-btn" onclick="Features.Spin.closeResult()">Lanjut 🎉</button>' +
        '</div>';

      document.body.appendChild(modal);

      if (typeof UI !== 'undefined') {
        if (UI.confetti) UI.confetti();
        if (UI.sound) UI.sound('achievement');
        if (UI.haptic) UI.haptic([50, 30, 50]);
      }

      this.render();
    },

    closeResult: function() {
      var modal = document.getElementById('spin-result-modal');
      if (modal) {
        modal.style.animation = 'fadeIn 0.3s reverse';
        setTimeout(function() { modal.remove(); }, 300);
      }
    },

    inject: function() {
      var target = document.getElementById('articles-content') ||
                   document.querySelector('.tab-page.active');
      if (!target) {
        setTimeout(this.inject.bind(this), 500);
        return;
      }
      if (document.getElementById('spin-container')) return;

      var div = document.createElement('div');
      div.id = 'spin-container';
      var missionsContainer = document.getElementById('missions-container');
      if (missionsContainer && missionsContainer.nextSibling) {
        target.insertBefore(div, missionsContainer.nextSibling);
      } else {
        target.insertBefore(div, target.firstChild);
      }
      this.render();
    },
  };

  /* ============================================
     6. TOPUP REDESIGN
     ============================================ */
  Features.TopUpRedesign = {
    inject: function() {
      var page = document.getElementById('page-topup');
      if (!page) return;
      if (document.getElementById('topup-hero')) return;

      var header = page.querySelector('.page-header');
      if (!header) return;

      var hero = document.createElement('div');
      hero.id = 'topup-hero';
      hero.className = 'topup-hero';
      hero.innerHTML =
        '<div class="topup-hero-content">' +
          '<div class="topup-promo-badge">🔥 PROMO HARI INI</div>' +
          '<div class="topup-hero-title">Top Up Instan!</div>' +
          '<div class="topup-hero-sub">Proses 1 detik, harga termurah, langsung masuk!</div>' +
          '<div class="topup-benefits">' +
            '<div class="topup-benefit"><span class="icon">⚡</span>Proses Cepat</div>' +
            '<div class="topup-benefit"><span class="icon">🛡️</span>Aman 100%</div>' +
            '<div class="topup-benefit"><span class="icon">💰</span>Harga Murah</div>' +
          '</div>' +
        '</div>';
      header.parentNode.insertBefore(hero, header.nextSibling);

      // Bonus bar
      var bonusBar = document.createElement('div');
      bonusBar.className = 'topup-bonus-bar';
      bonusBar.innerHTML =
        '<div class="topup-bonus-icon">🎁</div>' +
        '<div class="topup-bonus-text">' +
          '<strong>BONUS SETIAP TOP UP:</strong><br>' +
          '+100 koin • +2 heart gratis • Gratis biaya admin' +
        '</div>';
      hero.parentNode.insertBefore(bonusBar, hero.nextSibling);
    },
  };

  /* ============================================
     INIT ALL
     ============================================ */
  function initAll() {
    console.log('[Features] Init all...');

    // 1. Notification
    setTimeout(function() { Features.Notif.injectBell(); }, 500);

    // 2. Live feed
    setTimeout(function() { Features.LiveFeed.init(); }, 5000);

    // 3. Social proof
    setTimeout(function() { Features.SocialProof.inject(); }, 800);

    // 4. Missions
    setTimeout(function() { Features.Missions.inject(); }, 1200);

    // 5. Spin
    setTimeout(function() { Features.Spin.inject(); }, 1400);

    // 6. TopUp redesign
    setTimeout(function() { Features.TopUpRedesign.inject(); }, 1000);

    // Hook into existing features
    setTimeout(function() {
      // Hook Rewards.addCoin → notif
      if (typeof Rewards !== 'undefined' && Rewards.addCoin && !Rewards._notifHooked) {
        Rewards._notifHooked = true;
        var origAddCoin = Rewards.addCoin;
        Rewards.addCoin = function(amount, reason) {
          var result = origAddCoin.call(Rewards, amount, reason);
          if (typeof Features.Notif !== 'undefined' && amount >= 50) {
            Features.Notif.push('earn', '💰 +' + amount + ' koin', reason || 'Reward');
          }
          return result;
        };
      }

      // Hook DL.completeLesson → mission
      if (typeof DL !== 'undefined' && DL.completeLesson && !DL._missionHooked) {
        DL._missionHooked = true;
        var origComplete = DL.completeLesson;
        DL.completeLesson = function(id, score, total, reward) {
          var result = origComplete.call(DL, id, score, total, reward);
          if (typeof Features.Missions !== 'undefined') {
            Features.Missions.updateProgress('lesson');
          }
          return result;
        };
      }

      // Hook Articles.claim → mission
      if (typeof Articles !== 'undefined' && Articles.claim && !Articles._missionHooked) {
        Articles._missionHooked = true;
        var origClaim = Articles.claim;
        Articles.claim = function() {
          var result = origClaim.call(Articles);
          if (typeof Features.Missions !== 'undefined') {
            Features.Missions.updateProgress('read');
          }
          return result;
        };
      }

      // Hook Rewards.giveAdReward → mission
      if (typeof Rewards !== 'undefined' && Rewards.giveAdReward && !Rewards._missionHooked) {
        Rewards._missionHooked = true;
        var origAd = Rewards.giveAdReward;
        Rewards.giveAdReward = function() {
          var result = origAd.call(Rewards);
          if (typeof Features.Missions !== 'undefined') {
            Features.Missions.updateProgress('ad');
          }
          return result;
        };
      }

      console.log('[Features] Hooks installed');
    }, 2000);

    console.log('[Features] All features loaded ✅');
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(initAll, 1500);
    });
  } else {
    setTimeout(initAll, 1500);
  }

  // Re-inject on tab switch
  setInterval(function() {
    Features.SocialProof.inject();
    Features.Missions.inject();
    Features.Spin.inject();
    Features.TopUpRedesign.inject();
  }, 3000);
})();
