/* ============================================
   SOCIAL PROOF — LIVE NOTIFICATION
   Notifikasi palsu: user lain dapat koin, beli, dll
   Membuat website terlihat ramai
   ============================================ */

(function() {
  'use strict';

  console.log('[SocialProof] Loading...');

  window.SocialProof = {
    VERSION: 'v1',

    CONFIG: {
      // Interval notif baru (detik)
      MIN_INTERVAL: 15,
      MAX_INTERVAL: 35,

      // Durasi tampil notif (detik)
      DISPLAY_DURATION: 6,

      // Max notif per halaman
      MAX_PER_SESSION: 30,

      // Delay sebelum notif pertama (detik)
      INITIAL_DELAY: 8,
    },

    // ============================================
    // DATA NAMA USER (terlihat natural)
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
    ],

    // ============================================
    // TEMPLATE NOTIFIKASI
    // ============================================
    TEMPLATES: [
      // Tipe: dapat koin dari tonton iklan
      {
        type: 'earn',
        icon: '🎬',
        color: '#fbbf24',
        build: function(name, data) {
          return '<strong>' + name + '</strong> baru dapat <strong>' + data.koin + ' koin</strong> dari tonton iklan!';
        },
        dataPool: {
          koin: [50, 100, 150, 250, 500, 750, 1000, 1500, 2500, 5000, 10000],
          weight: [30, 25, 15, 10, 8, 5, 3, 2, 1, 0.8, 0.2], // 10000 = 0.2% (langka)
        },
      },
      // Tipe: beli top up dengan koin
      {
        type: 'buy',
        icon: '🛒',
        color: '#58cc02',
        build: function(name, data) {
          return '<strong>' + name + '</strong> baru beli <strong>' + data.item + '</strong> pakai koin!';
        },
        dataPool: {
          item: [
            '5 Diamond MLBB',
            '12 Diamond FF',
            '28 Diamond MLBB',
            '60 UC PUBG',
            '80 CP COD',
            '100 Genesis Genshin',
            '5 Voucher AOV',
            '400 Robux',
            'Pulsa 10.000',
            'Kuota 5GB',
          ],
        },
      },
      // Tipe: beli icon
      {
        type: 'icon',
        icon: '🎮',
        color: '#a855f7',
        build: function(name, data) {
          return '<strong>' + name + '</strong> baru beli icon <strong>' + data.icon + '</strong>!';
        },
        dataPool: {
          icon: ['MLBB', 'Free Fire', 'PUBG', 'Genshin', 'Roblox', 'Valorant', 'Minecraft', 'COC'],
        },
      },
      // Tipe: referral bonus
      {
        type: 'referral',
        icon: '🎁',
        color: '#1cb0f6',
        build: function(name, data) {
          return '<strong>' + name + '</strong> dapat <strong>' + data.koin + ' koin</strong> dari referral!';
        },
        dataPool: {
          koin: [500, 1000, 1500, 2000, 2500],
          weight: [40, 25, 20, 10, 5],
        },
      },
      // Tipe: jackpot
      {
        type: 'jackpot',
        icon: '🎉',
        color: '#ef4444',
        build: function(name, data) {
          return '🎉 <strong>' + name + '</strong> JACKPOT dapat <strong>' + data.koin + ' koin</strong>!';
        },
        dataPool: {
          koin: [5000, 10000],
          weight: [70, 30],
        },
      },
      // Tipe: milestone
      {
        type: 'milestone',
        icon: '🔥',
        color: '#ff9600',
        build: function(name, data) {
          return '<strong>' + name + '</strong> udah kumpulin <strong>' + data.total + ' koin</strong>!';
        },
        dataPool: {
          total: [5000, 10000, 25000, 50000, 100000, 250000],
          weight: [30, 25, 20, 15, 7, 3],
        },
      },
    ],

    // ============================================
    // STATE
    // ============================================
    shownCount: 0,
    _started: false,

    // ============================================
    // HELPERS
    // ============================================
    randomItem: function(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    },

    // Weighted random untuk data
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

    formatNumber: function(n) {
      try { return n.toLocaleString('id-ID'); } catch (e) { return '' + n; }
    },

    // ============================================
    // GENERATE NOTIFIKASI
    // ============================================
    generateNotif: function() {
      // Pilih tipe notif
      var template = this.randomItem(this.TEMPLATES);

      // Pilih nama
      var name = this.randomItem(this.NAMES);

      // Siapkan data
      var data = {};
      if (template.dataPool.koin) {
        var koin = template.dataPool.weight
          ? this.weightedRandom(template.dataPool.koin, template.dataPool.weight)
          : this.randomItem(template.dataPool.koin);
        data.koin = this.formatNumber(koin);
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
        data.total = this.formatNumber(total);
      }

      return {
        icon: template.icon,
        color: template.color,
        type: template.type,
        html: template.build(name, data),
      };
    },

    // ============================================
    // SHOW NOTIFIKASI
    // ============================================
    show: function(notif) {
      // Cek limit
      if (this.shownCount >= this.CONFIG.MAX_PER_SESSION) {
        console.log('[SocialProof] Max session reached');
        return;
      }

      // Cek element exist, kalau belum buat
      var container = document.getElementById('social-proof-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'social-proof-container';
        container.style.cssText = 
          'position:fixed;' +
          'bottom:80px;' +
          'left:12px;' +
          'right:12px;' +
          'z-index:9990;' +
          'pointer-events:none;' +
          'display:flex;' +
          'flex-direction:column;' +
          'gap:8px;' +
          'max-width:400px;' +
          'margin:0 auto;';
        document.body.appendChild(container);
      }

      // Buat notif card
      var card = document.createElement('div');
      card.style.cssText = 
        'background:white;' +
        'border-radius:14px;' +
        'padding:12px 14px;' +
        'box-shadow:0 8px 24px rgba(0,0,0,0.15);' +
        'display:flex;' +
        'align-items:center;' +
        'gap:10px;' +
        'opacity:0;' +
        'transform:translateY(20px);' +
        'transition:all 0.4s cubic-bezier(0.68,-0.55,0.265,1.55);' +
        'border-left:4px solid ' + notif.color + ';' +
        'pointer-events:auto;';

      card.innerHTML = 
        '<div style="width:36px;height:36px;border-radius:50%;background:' + notif.color + '20;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">' + notif.icon + '</div>' +
        '<div style="flex:1;min-width:0;font-size:12px;line-height:1.4;color:#333">' +
          notif.html +
          '<div style="font-size:10px;color:#999;margin-top:2px">🕐 barusan</div>' +
        '</div>' +
        '<div style="width:8px;height:8px;border-radius:50%;background:' + notif.color + ';flex-shrink:0;animation:pulse 1.5s infinite"></div>';

      container.appendChild(card);

      // Animate in
      setTimeout(function() {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 50);

      // Auto remove
      var self = this;
      setTimeout(function() {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(function() {
          if (card.parentNode) card.parentNode.removeChild(card);
        }, 400);
      }, self.CONFIG.DISPLAY_DURATION * 1000);

      this.shownCount++;
      console.log('[SocialProof] Shown: ' + this.shownCount + ' — ' + notif.type);
    },

    // ============================================
    // START LOOP
    // ============================================
    start: function() {
      if (this._started) return;
      this._started = true;

      console.log('[SocialProof] Started');

      var self = this;

      // Delay awal
      setTimeout(function() {
        // Notif pertama
        self.show(self.generateNotif());

        // Loop berikutnya
        function scheduleNext() {
          var delay = self.CONFIG.MIN_INTERVAL + Math.random() * (self.CONFIG.MAX_INTERVAL - self.CONFIG.MIN_INTERVAL);
          setTimeout(function() {
            if (self.shownCount >= self.CONFIG.MAX_PER_SESSION) return;
            self.show(self.generateNotif());
            scheduleNext();
          }, delay * 1000);
        }
        scheduleNext();
      }, self.CONFIG.INITIAL_DELAY * 1000);
    },

    // ============================================
    // INIT
    // ============================================
    init: function() {
      console.log('[SocialProof] Init');

      // Inject CSS animation
      if (!document.getElementById('socialproof-style')) {
        var style = document.createElement('style');
        style.id = 'socialproof-style';
        style.textContent = '@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.3)}}';
        document.head.appendChild(style);
      }

      this.start();
    },
  };

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(function() { window.SocialProof.init(); }, 1000);
    });
  } else {
    setTimeout(function() { window.SocialProof.init(); }, 1000);
  }

  console.log('[SocialProof] Loaded');
})();
