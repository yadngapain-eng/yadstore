/* ============================================
   LIVE NOTIFICATION — REAL-TIME
   Notif bergerak terus, berganti setiap saat
   Seperti Facebook/TikTok Live
   ============================================ */

(function() {
  'use strict';

  console.log('[LiveNotif] Loading...');

  window.SocialProof = {
    VERSION: 'v2-live',

    CONFIG: {
      MIN_INTERVAL: 5,
      MAX_INTERVAL: 15,
      DISPLAY_DURATION: 5,
      MAX_PER_SESSION: 999,  // Terus jalan
      INITIAL_DELAY: 2,
      SHOW_COUNTER: true,
    },

    // ============================================
    // NAMA USER (60 nama Indonesia)
    // ============================================
    NAMES: [
      'Reyhan', 'Amel', 'Budi', 'Sari', 'Andi', 'Dewi', 'Fajar', 'Gita',
      'Hendra', 'Indah', 'Joko', 'Kartika', 'Lina', 'Made', 'Nisa', 'Oki',
      'Putri', 'Rani', 'Sinta', 'Tono', 'Umar', 'Vina', 'Wawan', 'Yanti',
      'Zaki', 'Adit', 'Bella', 'Cinta', 'Doni', 'Eka', 'Fani', 'Gunawan',
      'Hana', 'Iwan', 'Jihan', 'Kirana', 'Lukman', 'Maya', 'Nanda', 'Ovi',
      'Pandu', 'Qori', 'Rizki', 'Siska', 'Tari', 'Udin', 'Vera', 'Wulan',
      'Yoga', 'Zahra', 'Ayu', 'Bagus', 'Cahyo', 'Dian', 'Eko', 'Fitri',
      'Gilang', 'Hesti', 'Ilham', 'Jasmine', 'Krisna', 'Lisa', 'Miko',
      'Nadia', 'Oki', 'Putra', 'Qila', 'Rio', 'Sinta', 'Taufik', 'Ulfa',
      'Vino', 'Winda', 'Yudi', 'Zaki', 'Ahmad', 'Bayu', 'Cindy', 'Dimas',
    ],

    // ============================================
    // TEMPLATE NOTIFIKASI (LEBIH VARIATIF)
    // ============================================
    TEMPLATES: [
      // 1. Tonton iklan dapat koin
      {
        type: 'earn',
        icon: '🎬',
        color: '#fbbf24',
        weight: 35,
        build: function(name, data) {
          return '<strong>' + name + '</strong> baru dapat <strong>' + data.koin + ' koin</strong> dari tonton iklan!';
        },
        dataPool: {
          koin: [50, 100, 150, 250, 500, 750, 1000, 1500, 2500, 5000, 10000],
          weight: [25, 25, 15, 12, 10, 6, 4, 1.5, 0.7, 0.5, 0.3],
        },
      },
      // 2. Beli top up dengan koin
      {
        type: 'buy',
        icon: '🛒',
        color: '#58cc02',
        weight: 25,
        build: function(name, data) {
          return '<strong>' + name + '</strong> baru beli <strong>' + data.item + '</strong>!';
        },
        dataPool: {
          item: [
            '5 Diamond MLBB', '12 Diamond FF', '28 Diamond MLBB',
            '60 UC PUBG', '80 CP COD', '100 Genesis Genshin',
            '5 Voucher AOV', '400 Robux', 'Pulsa 10.000',
            'Kuota 5GB', '12 Diamond MLBB', '86 Diamond MLBB',
            '170 Gems BS', '50 Genesis HSR',
          ],
        },
      },
      // 3. Beli icon
      {
        type: 'icon',
        icon: '🎮',
        color: '#a855f7',
        weight: 10,
        build: function(name, data) {
          return '<strong>' + name + '</strong> baru beli icon <strong>' + data.icon + '</strong>!';
        },
        dataPool: {
          icon: ['MLBB', 'Free Fire', 'PUBG', 'Genshin', 'Roblox', 'Valorant', 'Minecraft', 'COC', 'COD'],
        },
      },
      // 4. Referral bonus
      {
        type: 'referral',
        icon: '🎁',
        color: '#1cb0f6',
        weight: 8,
        build: function(name, data) {
          return '<strong>' + name + '</strong> dapat <strong>' + data.koin + ' koin</strong> dari referral!';
        },
        dataPool: {
          koin: [500, 1000, 1500, 2000, 2500, 5000],
          weight: [35, 25, 15, 12, 8, 5],
        },
      },
      // 5. Milestone koin
      {
        type: 'milestone',
        icon: '🔥',
        color: '#ff9600',
        weight: 7,
        build: function(name, data) {
          return '<strong>' + name + '</strong> udah kumpulin <strong>' + data.total + ' koin</strong>!';
        },
        dataPool: {
          total: [1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000],
          weight: [30, 25, 18, 12, 8, 4, 2, 1],
        },
      },
      // 6. JACKPOT
      {
        type: 'jackpot',
        icon: '🎉',
        color: '#ef4444',
        weight: 3,
        build: function(name, data) {
          return '🎉 <strong>' + name + '</strong> JACKPOT dapat <strong>' + data.koin + ' koin</strong>!';
        },
        dataPool: {
          koin: [5000, 10000],
          weight: [70, 30],
        },
      },
      // 7. Streak / aktivitas
      {
        type: 'streak',
        icon: '⚡',
        color: '#8b5cf6',
        weight: 5,
        build: function(name, data) {
          return '<strong>' + name + '</strong> udah nonton <strong>' + data.total + ' iklan</strong> hari ini!';
        },
        dataPool: {
          total: [5, 10, 15, 20, 25, 30, 50, 100],
          weight: [30, 25, 18, 12, 8, 4, 2, 1],
        },
      },
      // 8. Baru join
      {
        type: 'join',
        icon: '✨',
        color: '#10b981',
        weight: 4,
        build: function(name, data) {
          return '<strong>' + name + '</strong> baru gabung dan siap cuan!';
        },
      },
      // 9. Bukti withdraw (WAJIB sosial proof paling kuat!)
      {
        type: 'withdraw',
        icon: '💸',
        color: '#06b6d4',
        weight: 3,
        build: function(name, data) {
          return '<strong>' + name + '</strong> baru withdraw <strong>Rp ' + data.rupiah + '</strong>!';
        },
        dataPool: {
          rupiah: [10000, 15000, 25000, 50000, 75000, 100000, 250000],
          weight: [30, 25, 20, 12, 8, 4, 1],
        },
      },
    ],

    // State
    shownCount: 0,
    _started: false,
    _queue: [],
    _timer: null,

    // ============================================
    // HELPERS
    // ============================================
    randomItem: function(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    },

    weightedRandom: function(items, weights) {
      var total = weights.reduce(function(a, b) { return a + b; }, 0);
      var random = Math.random() * total;
      var cumulative = 0;
      for (var i = 0; i < items.length; i++) {
        cumulative += weights[i];
        if (random <= cumulative) return items[i];
      }
      return items[0];
    },

    fmt: function(n) {
      try { return n.toLocaleString('id-ID'); } catch (e) { return '' + n; }
    },

    // Weighted template picker
    pickTemplate: function() {
      var self = this;
      var totalWeight = 0;
      this.TEMPLATES.forEach(function(t) {
        totalWeight += (t.weight || 1);
      });

      var random = Math.random() * totalWeight;
      var cumulative = 0;

      for (var i = 0; i < this.TEMPLATES.length; i++) {
        cumulative += (this.TEMPLATES[i].weight || 1);
        if (random <= cumulative) {
          return this.TEMPLATES[i];
        }
      }
      return this.TEMPLATES[0];
    },

    // ============================================
    // GENERATE NOTIFIKASI
    // ============================================
    generateNotif: function() {
      var template = this.pickTemplate();
      var name = this.randomItem(this.NAMES);
      var data = {};

      if (template.dataPool) {
        if (template.dataPool.koin) {
          var koin = template.dataPool.weight
            ? this.weightedRandom(template.dataPool.koin, template.dataPool.weight)
            : this.randomItem(template.dataPool.koin);
          data.koin = this.fmt(koin);
        }
        if (template.dataPool.item) {
          data.item = this.randomItem(template.dataPool.item);
        }
        if (template.dataPool.icon) {
          data.icon = this.randomItem(template.dataPool.icon);
        }
        if (template.dataPool.total) {
          var total = template.dataPool.weight
            ? this.weightedRandom(template.dataPool.total, template.dataPool.weight)
            : this.randomItem(template.dataPool.total);
          data.total = this.fmt(total);
        }
        if (template.dataPool.rupiah) {
          var rupiah = template.dataPool.weight
            ? this.weightedRandom(template.dataPool.rupiah, template.dataPool.weight)
            : this.randomItem(template.dataPool.rupiah);
          data.rupiah = this.fmt(rupiah);
        }
      }

      return {
        icon: template.icon,
        color: template.color,
        type: template.type,
        html: template.build(name, data),
        avatar: name.charAt(0).toUpperCase(),
      };
    },

    // ============================================
    // CREATE CONTAINER + COUNTER LIVE
    // ============================================
    createContainer: function() {
      if (document.getElementById('social-proof-container')) return;

      var wrapper = document.createElement('div');
      wrapper.id = 'social-proof-container';
      wrapper.style.cssText =
        'position:fixed;' +
        'bottom:80px;' +
        'left:12px;' +
        'right:12px;' +
        'z-index:9990;' +
        'pointer-events:none;' +
        'display:flex;' +
        'flex-direction:column;' +
        'gap:8px;' +
        'max-width:380px;' +
        'margin:0 auto;';

      document.body.appendChild(wrapper);

      // LIVE COUNTER (di pojok kanan atas notif)
      if (this.CONFIG.SHOW_COUNTER) {
        var counter = document.createElement('div');
        counter.id = 'live-counter';
        counter.style.cssText =
          'position:fixed;' +
          'top:70px;' +
          'right:12px;' +
          'z-index:9989;' +
          'background:linear-gradient(135deg,#ef4444,#dc2626);' +
          'color:white;' +
          'padding:6px 12px;' +
          'border-radius:999px;' +
          'font-family:inherit;' +
          'font-size:11px;' +
          'font-weight:900;' +
          'box-shadow:0 4px 16px rgba(239,68,68,0.4);' +
          'display:flex;' +
          'align-items:center;' +
          'gap:6px;' +
          'animation:livePulse 2s infinite;';

        var randomOnline = 200 + Math.floor(Math.random() * 800);
        counter.innerHTML =
          '<span style="width:8px;height:8px;border-radius:50%;background:#fff;animation:blink 1s infinite"></span>' +
          '<span>🔴 LIVE</span>' +
          '<span id="live-online-count" style="background:rgba(255,255,255,0.25);padding:1px 6px;border-radius:999px">' +
            randomOnline +
          '</span>' +
          '<span style="font-size:9px;opacity:0.9">online</span>';

        document.body.appendChild(counter);

        // Update counter setiap 3-8 detik
        var self = this;
        setInterval(function() {
          var el = document.getElementById('live-online-count');
          if (!el) return;
          var current = parseInt(el.textContent) || 500;
          // Fluktuasi ±50 user
          var change = Math.floor(Math.random() * 40) - 20;
          var newVal = Math.max(150, Math.min(1500, current + change));
          el.textContent = newVal;
        }, 3000 + Math.random() * 5000);
      }
    },

    // ============================================
    // SHOW NOTIF
    // ============================================
    show: function(notif) {
      var container = document.getElementById('social-proof-container');
      if (!container) {
        this.createContainer();
        container = document.getElementById('social-proof-container');
      }

      // Limit tampil: max 3 notif sekaligus
      while (container.children.length >= 3) {
        container.removeChild(container.firstChild);
      }

      var card = document.createElement('div');
      var isSpecial = (notif.type === 'jackpot' || notif.type === 'withdraw');

      card.style.cssText =
        'background:white;' +
        'border-radius:14px;' +
        'padding:10px 12px;' +
        'box-shadow:0 8px 24px rgba(0,0,0,0.15);' +
        'display:flex;' +
        'align-items:center;' +
        'gap:10px;' +
        'opacity:0;' +
        'transform:translateX(-30px) scale(0.9);' +
        'transition:all 0.5s cubic-bezier(0.68,-0.55,0.265,1.55);' +
        'border-left:4px solid ' + notif.color + ';' +
        'pointer-events:auto;' +
        (isSpecial ? 'box-shadow:0 8px 32px ' + notif.color + '66, 0 0 0 2px ' + notif.color + '33;' : '');

      card.innerHTML =
        '<div style="width:38px;height:38px;border-radius:50%;background:' + notif.color + ';display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;color:white;flex-shrink:0;position:relative">' +
          notif.avatar +
          '<span style="position:absolute;bottom:-2px;right:-2px;font-size:12px">' + notif.icon + '</span>' +
        '</div>' +
        '<div style="flex:1;min-width:0;font-size:12px;line-height:1.4;color:#333">' +
          notif.html +
          '<div style="font-size:10px;color:#999;margin-top:2px">🕐 baru saja</div>' +
        '</div>' +
        '<div style="width:6px;height:6px;border-radius:50%;background:' + notif.color + ';flex-shrink:0;animation:livePulse 1.5s infinite"></div>';

      container.appendChild(card);

      // Animate in
      setTimeout(function() {
        card.style.opacity = '1';
        card.style.transform = 'translateX(0) scale(1)';
      }, 30);

      // Auto remove
      var self = this;
      setTimeout(function() {
        card.style.opacity = '0';
        card.style.transform = 'translateX(-30px) scale(0.9)';
        setTimeout(function() {
          if (card.parentNode) card.parentNode.removeChild(card);
        }, 500);
      }, self.CONFIG.DISPLAY_DURATION * 1000);

      this.shownCount++;
      console.log('[LiveNotif] #' + this.shownCount + ' — ' + notif.type);
    },

    // ============================================
    // LOOP TERUS MENERUS
    // ============================================
    startLoop: function() {
      var self = this;

      function next() {
        // Cek dokumen masih aktif
        if (document.hidden) {
          // HP lock/layar mati, tunggu 30 detik
          self._timer = setTimeout(next, 30000);
          return;
        }

        self.show(self.generateNotif());

        // Delay berikutnya (random 5-15 detik)
        var delay = self.CONFIG.MIN_INTERVAL + Math.random() * (self.CONFIG.MAX_INTERVAL - self.CONFIG.MIN_INTERVAL);
        self._timer = setTimeout(next, delay * 1000);
      }

      // Start setelah delay awal
      self._timer = setTimeout(next, self.CONFIG.INITIAL_DELAY * 1000);
    },

    // ============================================
    // INIT
    // ============================================
    init: function() {
      if (this._started) return;
      this._started = true;

      console.log('[LiveNotif] Init — Live mode active');

      // Inject CSS animations
      if (!document.getElementById('livenotif-style')) {
        var style = document.createElement('style');
        style.id = 'livenotif-style';
        style.textContent = 
          '@keyframes livePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.7;transform:scale(1.15)}}' +
          '@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}';
        document.head.appendChild(style);
      }

      this.createContainer();
      this.startLoop();
    },
  };

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(function() { window.SocialProof.init(); }, 800);
    });
  } else {
    setTimeout(function() { window.SocialProof.init(); }, 800);
  }

  console.log('[LiveNotif] Loaded');
})();
