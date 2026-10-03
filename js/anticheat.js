/* ============================================
   ANTI-CHEAT — SMART MODE
   Deteksi real threat, NO SPAM
   ============================================ */

(function() {
  'use strict';

  console.log('[AntiCheat] Loading (SMART MODE)...');

  window.AntiCheat = {
    VERSION: 'v2',
    MODE: 'smart',
    
    // ============================================
    // KONFIGURASI ANTI-SPAM
    // ============================================
    CONFIG: {
      // Hanya laporkan kalau suspicion score > threshold
      THRESHOLD: 80,
      
      // Minimal 1x lapor per 10 menit
      REPORT_INTERVAL: 600000,
      
      // Cooldown per jenis alert (5 menit)
      ALERT_COOLDOWN: 300000,
      
      // Batas total laporan per hari
      MAX_REPORTS_PER_DAY: 3,
      
      // Ignore user action yang tidak berbahaya
      IGNORE_MINOR: true,
    },

    // ============================================
    // STATE
    // ============================================
    violations: [],
    suspicionScore: 0,
    lastReportTime: 0,
    lastReportType: {},
    reportsToday: 0,
    lastReportDate: null,
    devtoolsOpen: false,
    
    // Untuk dedup
    _initTime: Date.now(),

    // ============================================
    // LOG VIOLATION — HANYA YANG PENTING
    // ============================================
    log: function(type, severity, details) {
      // Skip kalau mode off
      if (this.MODE === 'off') return;

      severity = severity || 'low';
      details = details || {};

      // Cek cooldown per jenis alert
      var now = Date.now();
      var lastType = this.lastReportType[type] || 0;
      if (now - lastType < this.CONFIG.ALERT_COOLDOWN) {
        // Skip karena cooldown
        return;
      }

      // Skip minor violations (kalau IGNORE_MINOR)
      if (this.CONFIG.IGNORE_MINOR && severity === 'low') {
        return;
      }

      // Skip kalau baru init (< 5 detik) — user lagi load page
      if (now - this._initTime < 5000) {
        return;
      }

      var violation = {
        type: type,
        severity: severity,
        details: details,
        time: new Date().toISOString(),
      };

      this.violations.push(violation);
      this.lastReportType[type] = now;

      // Update score
      var scoreMap = { low: 1, medium: 5, high: 20, critical: 50 };
      this.suspicionScore += (scoreMap[severity] || 1);

      console.log('[AntiCheat] ⚠️', type, '(' + severity + ')', 'score: ' + this.suspicionScore);

      // Cek apakah perlu report
      this.maybeReport(violation);
    },

    // ============================================
    // MAYBE REPORT — Cek semua kondisi dulu
    // ============================================
    maybeReport: function(violation) {
      var now = Date.now();
      var today = new Date().toISOString().split('T')[0];

      // Reset harian
      if (this.lastReportDate !== today) {
        this.lastReportDate = today;
        this.reportsToday = 0;
      }

      // 1. Cek limit harian
      if (this.reportsToday >= this.CONFIG.MAX_REPORTS_PER_DAY) {
        console.log('[AntiCheat] Daily report limit reached, skip');
        return;
      }

      // 2. Cek interval global
      if (now - this.lastReportTime < this.CONFIG.REPORT_INTERVAL) {
        console.log('[AntiCheat] Report interval, skip');
        return;
      }

      // 3. Cek threshold (untuk mode 'smart')
      if (this.MODE === 'smart' && this.suspicionScore < this.CONFIG.THRESHOLD) {
        console.log('[AntiCheat] Score below threshold (' + this.suspicionScore + '/' + this.CONFIG.THRESHOLD + '), skip');
        return;
      }

      // 4. Cek harus ada minimal 2 violation berbeda
      var uniqueTypes = new Set(this.violations.map(function(v) { return v.type; }));
      if (this.MODE === 'smart' && uniqueTypes.size < 2) {
        console.log('[AntiCheat] Only 1 violation type, skip');
        return;
      }

      // ===== LOLOS SEMUA CEK — REPORT =====
      this.report(violation);
    },

    // ============================================
    // REPORT KE TELEGRAM
    // ============================================
    report: function(violation) {
      var now = Date.now();
      this.lastReportTime = now;
      this.reportsToday++;

      console.log('[AntiCheat] 📢 REPORTING... (total hari ini: ' + this.reportsToday + ')');

      // Format pesan ringkas
      var violationList = this.violations
        .slice(-5)
        .map(function(v) { return '• ' + v.type + ' (' + v.severity + ')'; })
        .join('\n');

      var msg = '🚨 <b>ANTI-CHEAT ALERT</b>\n\n' +
        '📊 Score: <b>' + this.suspicionScore + '</b>\n' +
        '⚠️ Level: <b>' + (this.suspicionScore >= 100 ? 'CRITICAL' : this.suspicionScore >= 80 ? 'HIGH' : 'MEDIUM') + '</b>\n' +
        '🕐 ' + new Date().toLocaleString('id-ID') + '\n\n' +
        '📋 <b>Violations:</b>\n' + violationList + '\n\n' +
        '🌐 ' + location.href.substring(0, 80);

      try {
        if (typeof TELEGRAM_CONFIG !== 'undefined' && TELEGRAM_CONFIG.sendMessage) {
          TELEGRAM_CONFIG.sendMessage(msg).then(function(r) {
            if (r && r.ok) {
              console.log('[AntiCheat] ✅ Reported to Telegram');
            } else {
              console.warn('[AntiCheat] Report failed:', r);
            }
          }).catch(function(e) {
            console.warn('[AntiCheat] Telegram error:', e);
          });
        }
      } catch (e) {
        console.warn('[AntiCheat] Report error:', e);
      }
    },

    // ============================================
    // DETEKSI SEDERHANA — Hanya yang penting
    // ============================================

    // 1. Detect storage tampering (balance spike)
    detectStorageTampering: function() {
      var self = this;
      var lastBalance = null;
      var lastCheckTime = Date.now();

      setInterval(function() {
        var now = Date.now();
        var balance = parseFloat(localStorage.getItem('yadstore_reward_balance') || '0');

        if (lastBalance !== null) {
          var diff = balance - lastBalance;
          var elapsed = (now - lastCheckTime) / 1000;

          // Kenaikan > 100.000 koin dalam < 5 detik = curang
          if (diff > 100000 && elapsed < 5) {
            self.log('balance_spike', 'critical', {
              diff: diff,
              elapsed: elapsed,
            });
          }
        }

        lastBalance = balance;
        lastCheckTime = now;
      }, 3000);
    },

    // 2. Detect achievements spike
    detectAchievementsSpike: function() {
      var self = this;
      var lastCount = 0;
      var reported = false;

      setInterval(function() {
        try {
          var a = JSON.parse(localStorage.getItem('yadstore_achievements') || '[]');
          var count = a.length;

          // Kalau langsung > 40 achievement dalam sekali cek = curang
          if (count >= 40 && lastCount === 0 && !reported) {
            self.log('achievements_spike', 'critical', {
              count: count,
            });
            reported = true;
          }

          lastCount = count;
        } catch (e) {}
      }, 5000);
    },

    // 3. Detect function override
    detectFunctionOverride: function() {
      var self = this;
      
      setTimeout(function() {
        var originalAddCoin = null;
        try {
          if (typeof Rewards !== 'undefined' && Rewards.addCoin) {
            originalAddCoin = Rewards.addCoin.toString();
          }
        } catch (e) {}

        setInterval(function() {
          try {
            if (originalAddCoin && typeof Rewards !== 'undefined' && Rewards.addCoin) {
              if (Rewards.addCoin.toString() !== originalAddCoin) {
                self.log('function_override', 'critical', {
                  function: 'Rewards.addCoin',
                });
              }
            }
          } catch (e) {}
        }, 10000);
      }, 3000);
    },

    // 4. Detect emulator/bot
    detectEmulator: function() {
      var ua = navigator.userAgent.toLowerCase();
      var bots = ['headless', 'phantom', 'selenium', 'puppeteer', 'playwright'];
      var found = null;

      for (var i = 0; i < bots.length; i++) {
        if (ua.indexOf(bots[i]) !== -1) {
          found = bots[i];
          break;
        }
      }

      if (found) {
        this.log('emulator', 'critical', { keyword: found });
      }

      // Automation props
      var props = ['webdriver', '__nightmare', '_phantom', 'callPhantom', '_selenium'];
      for (var j = 0; j < props.length; j++) {
        if (window[props[j]]) {
          this.log('automation', 'critical', { prop: props[j] });
        }
      }
    },

    // ============================================
    // INIT
    // ============================================
    init: function() {
      console.log('[AntiCheat] Init mode:', this.MODE, 'threshold:', this.CONFIG.THRESHOLD);

      if (this.MODE === 'off') {
        console.log('[AntiCheat] OFF — no detection');
        return;
      }

      var self = this;

      setTimeout(function() {
        self.detectEmulator();
        self.detectStorageTampering();
        self.detectAchievementsSpike();
        self.detectFunctionOverride();
        console.log('[AntiCheat] Detectors active');
      }, 3000);
    },

    // ============================================
    // GET REPORT (untuk admin)
    // ============================================
    getReport: function() {
      return {
        score: this.suspicionScore,
        violations: this.violations,
        reportsToday: this.reportsToday,
        devtoolsOpen: this.devtoolsOpen,
      };
    },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(function() { window.AntiCheat.init(); }, 1000);
    });
  } else {
    setTimeout(function() { window.AntiCheat.init(); }, 1000);
  }

  console.log('[AntiCheat] Loaded v2 (SMART MODE)');
})();
