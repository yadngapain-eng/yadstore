/* ============================================
   ANTI-CHEAT SYSTEM
   Deteksi DevTools, Console, Auto-Click, Tamper
   Mode: detect+report
   ============================================ */

(function() {
  'use strict';

  console.log('[AntiCheat] Loading...');

  window.AntiCheat = {
    VERSION: 'v1',
    MODE: 'detect+report',

    // ============================================
    // STATE
    // ============================================
    violations: [],
    devtoolsOpen: false,
    suspicionScore: 0,
    sessionStart: Date.now(),

    // Storage key
    STORAGE_KEY: 'yadstore_anticheat',

    // ============================================
    // STORAGE
    // ============================================
    getStoredViolations: function() {
      try {
        var v = localStorage.getItem(this.STORAGE_KEY);
        return v ? JSON.parse(v) : [];
      } catch (e) { return []; }
    },

    saveViolation: function(violation) {
      try {
        var stored = this.getStoredViolations();
        stored.push(violation);
        // Keep max 100
        if (stored.length > 100) stored = stored.slice(-100);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stored));
      } catch (e) {}
    },

    // ============================================
    // LOG VIOLATION
    // ============================================
    logViolation: function(type, details, severity) {
      severity = severity || 'low';
      
      var violation = {
        type: type,
        details: details || {},
        severity: severity,
        time: new Date().toISOString(),
        url: location.href,
        ua: navigator.userAgent.substring(0, 100),
      };

      this.violations.push(violation);
      this.saveViolation(violation);

      // Increase suspicion
      var score = { low: 1, medium: 5, high: 20, critical: 50 };
      this.suspicionScore += (score[severity] || 1);

      console.warn('[AntiCheat] ⚠️', type, '|', severity, '|', JSON.stringify(details).substring(0, 100));

      // Report
      if (this.MODE === 'detect+report' || this.MODE === 'detect+block') {
        this.report(violation);
      }

      // Block jika critical
      if (this.MODE === 'detect+block' && severity === 'critical') {
        this.blockUser(violation);
      }

      return violation;
    },

    // ============================================
    // REPORT KE TELEGRAM/SERVER
    // ============================================
    report: function(violation) {
      // Cek apakah sudah report (rate limit)
      var lastReport = parseInt(sessionStorage.getItem('anticheat_last_report') || '0');
      var now = Date.now();
      
      // Report max 1x per 30 detik
      if (now - lastReport < 30000) return;

      sessionStorage.setItem('anticheat_last_report', String(now));

      try {
        // Kirim ke Telegram
        var msg = '🚨 <b>ANTI-CHEAT ALERT</b>\n\n' +
          '🏷️ Type: <code>' + violation.type + '</code>\n' +
          '⚠️ Severity: <b>' + violation.severity.toUpperCase() + '</b>\n' +
          '📊 Score: ' + this.suspicionScore + '\n' +
          '🕐 ' + new Date().toLocaleString('id-ID') + '\n' +
          '🌐 ' + violation.url.substring(0, 80);

        // Coba kirim via TELEGRAM_CONFIG
        if (typeof TELEGRAM_CONFIG !== 'undefined' && TELEGRAM_CONFIG.sendMessage) {
          TELEGRAM_CONFIG.sendMessage(msg).catch(function() {});
        }

        // Simpan di localStorage untuk admin cek
        var reports = [];
        try {
          reports = JSON.parse(localStorage.getItem('yadstore_anticheat_reports') || '[]');
        } catch (e) {}
        reports.push(violation);
        if (reports.length > 50) reports = reports.slice(-50);
        localStorage.setItem('yadstore_anticheat_reports', JSON.stringify(reports));

      } catch (e) {
        console.warn('[AntiCheat] Report failed:', e);
      }
    },

    // ============================================
    // BLOCK USER
    // ============================================
    blockUser: function(violation) {
      console.error('[AntiCheat] 🚫 BLOCKING USER');
      
      // Overlay pesan
      var overlay = document.createElement('div');
      overlay.id = 'anticheat-block';
      overlay.style.cssText = 
        'position:fixed;inset:0;z-index:999999;' +
        'background:linear-gradient(135deg,#ff4b4b,#ea2b2b);' +
        'display:flex;align-items:center;justify-content:center;' +
        'color:white;padding:20px;text-align:center;';
      
      overlay.innerHTML = 
        '<div style="max-width:400px">' +
          '<div style="font-size:80px;margin-bottom:20px">🚫</div>' +
          '<div style="font-size:24px;font-weight:900;margin-bottom:12px">Aktivitas Mencurigakan Terdeteksi</div>' +
          '<div style="font-size:14px;line-height:1.6;margin-bottom:20px">' +
            'Kami mendeteksi penggunaan tools untuk memanipulasi aplikasi. ' +
            'Sesi Anda telah dihentikan sementara.' +
          '</div>' +
          '<div style="background:rgba(0,0,0,0.2);border-radius:10px;padding:12px;font-size:12px;margin-bottom:20px">' +
            'Hubungi admin jika ini kesalahan:<br>' +
            '<strong>support@duniamu.my.id</strong>' +
          '</div>' +
          '<button onclick="location.reload()" style="padding:12px 30px;background:white;color:#ff4b4b;border:none;border-radius:10px;font-weight:900;cursor:pointer;font-size:14px">' +
            'Muat Ulang' +
          '</button>' +
        '</div>';
      
      document.body.appendChild(overlay);
      
      // Cegah scroll
      document.body.style.overflow = 'hidden';
    },

    // ============================================
    // DETEKSI 1: DevTools Open
    // ============================================
    detectDevTools: function() {
      var self = this;
      var threshold = 160;
      var checkInterval = null;

      // Metode 1: Window size comparison
      function checkSize() {
        var widthDiff = window.outerWidth - window.innerWidth;
        var heightDiff = window.outerHeight - window.innerHeight;
        
        // DevTools terbuka di samping atau bawah
        var isOpen = widthDiff > threshold || heightDiff > threshold;
        
        if (isOpen && !self.devtoolsOpen) {
          self.devtoolsOpen = true;
          self.logViolation('devtools_opened', {
            widthDiff: widthDiff,
            heightDiff: heightDiff,
          }, 'high');
        } else if (!isOpen && self.devtoolsOpen) {
          self.devtoolsOpen = false;
        }
      }

      // Cek setiap 500ms
      checkInterval = setInterval(checkSize, 500);
      checkSize();

      // Metode 2: Debugger detection
      var startTime = performance.now();
      /* eslint-disable no-debugger */
      debugger;
      /* eslint-enable no-debugger */
      var endTime = performance.now();
      
      if (endTime - startTime > 100) {
        self.logViolation('debugger_detected', {
          timeDiff: Math.round(endTime - startTime),
        }, 'critical');
      }

      // Metode 3: toString detection
      var element = new Image();
      var before = element.id;
      
      Object.defineProperty(element, 'id', {
        get: function() {
          self.logViolation('devtools_id_access', {}, 'medium');
          return before;
        }
      });
      
      // Trigger - hanya jalan kalau DevTools terbuka
      try {
        console.log('%c', element);
      } catch (e) {}
    },

    // ============================================
    // DETEKSI 2: Console Usage
    // ============================================
    detectConsoleUsage: function() {
      var self = this;
      
      // Override console.log untuk deteksi log mencurigakan
      var originalLog = console.log;
      var originalWarn = console.warn;
      var originalError = console.error;

      // Track log dari user (bukan dari app)
      var appLogs = ['[AdsManager]', '[AdsReward]', '[KoinTopUp]', '[AntiCheat]', 
                     '[telegram]', '[TopUpUI]', '[Rewards]', '[App]', '[Auth]'];
      
      function isAppLog(args) {
        if (args.length === 0) return false;
        var first = String(args[0]);
        for (var i = 0; i < appLogs.length; i++) {
          if (first.indexOf(appLogs[i]) === 0) return true;
        }
        return false;
      }

      console.log = function() {
        if (!isAppLog(arguments)) {
          self.logViolation('console_log_user', {
            args: Array.from(arguments).map(function(a) {
              return String(a).substring(0, 100);
            }),
          }, 'low');
        }
        return originalLog.apply(console, arguments);
      };

      // Deteksi stack trace (DevTools inspect)
      var checkInspect = function() {
        var err = new Error();
        var stack = err.stack || '';
        
        // Kalau stack punya lebih banyak frame dari biasanya → di-inspect
        if (stack.split('\n').length > 10) {
          self.logViolation('stack_inspect', {}, 'medium');
        }
      };

      // Cek random interval
      setInterval(checkInspect, 10000);
    },

    // ============================================
    // DETEKSI 3: Auto Click / Bot
    // ============================================
    detectAutoClick: function() {
      var self = this;
      var clickTimes = [];
      var clickIntervalThreshold = 100; // 100ms minimal antar klik

      document.addEventListener('click', function(e) {
        var now = Date.now();
        clickTimes.push(now);
        if (clickTimes.length > 10) clickTimes.shift();

        // Cek pattern auto-click
        if (clickTimes.length >= 5) {
          var intervals = [];
          for (var i = 1; i < clickTimes.length; i++) {
            intervals.push(clickTimes[i] - clickTimes[i - 1]);
          }
          
          var avgInterval = intervals.reduce(function(a, b) { return a + b; }, 0) / intervals.length;
          var variance = intervals.reduce(function(a, b) { 
            return a + Math.pow(b - avgInterval, 2); 
          }, 0) / intervals.length;
          
          // Auto-click punya variance rendah & interval konsisten
          if (avgInterval < clickIntervalThreshold && variance < 100) {
            self.logViolation('auto_click_detected', {
              avgInterval: Math.round(avgInterval),
              variance: Math.round(variance),
              clicks: clickTimes.length,
            }, 'high');
          }
        }
      });
    },

    // ============================================
    // DETEKSI 4: Storage Tampering
    // ============================================
    detectStorageTampering: function() {
      var self = this;
      var lastBalance = null;
      var lastChecks = {};

      setInterval(function() {
        // Cek balance
        var balance = parseFloat(localStorage.getItem('yadstore_reward_balance') || '0');
        
        if (lastBalance !== null) {
          var diff = balance - lastBalance;
          
          // Kenaikan drastis dalam 1 detik = curang
          if (diff > 50000) {
            self.logViolation('balance_spike', {
              from: lastBalance,
              to: balance,
              diff: diff,
            }, 'critical');
          }
        }
        
        lastBalance = balance;

        // Cek achievements
        var achievements = localStorage.getItem('yadstore_achievements') || '[]';
        var parsed = [];
        try { parsed = JSON.parse(achievements); } catch (e) {}
        
        // Cek kalau achievements tiba-tiba 50+ dalam 10 detik
        if (parsed.length > 50 && !lastChecks.achievementsChecked) {
          var lastCount = lastChecks.achievementsCount || 0;
          if (parsed.length - lastCount > 10) {
            self.logViolation('achievements_spike', {
              from: lastCount,
              to: parsed.length,
            }, 'high');
          }
          lastChecks.achievementsChecked = true;
          lastChecks.achievementsCount = parsed.length;
        }
      }, 1000);
    },

    // ============================================
    // DETEKSI 5: Function Override
    // ============================================
    detectFunctionOverride: function() {
      var self = this;
      
      // Simpan referensi asli
      var originalRewards = {};
      var originalFunctions = {};
      
      setTimeout(function() {
        // Snapshot fungsi penting
        if (typeof Rewards !== 'undefined') {
          if (Rewards.addCoin) originalRewards.addCoin = Rewards.addCoin.toString();
          if (Rewards.spendCoin) originalRewards.spendCoin = Rewards.spendCoin.toString();
        }
        
        // Cek setiap 5 detik
        setInterval(function() {
          if (typeof Rewards !== 'undefined') {
            if (Rewards.addCoin && originalRewards.addCoin) {
              if (Rewards.addCoin.toString() !== originalRewards.addCoin) {
                self.logViolation('function_override', {
                  function: 'Rewards.addCoin',
                }, 'critical');
              }
            }
          }
        }, 5000);
      }, 1000);
    },

    // ============================================
    // DETEKSI 6: Emulator/VM Detection
    // ============================================
    detectEmulator: function() {
      var self = this;
      
      // Cek user agent untuk emulator
      var ua = navigator.userAgent.toLowerCase();
      var emulatorKeywords = ['headless', 'phantom', 'selenium', 'puppeteer', 'playwright'];
      
      for (var i = 0; i < emulatorKeywords.length; i++) {
        if (ua.indexOf(emulatorKeywords[i]) !== -1) {
          self.logViolation('emulator_detected', {
            keyword: emulatorKeywords[i],
            ua: ua.substring(0, 100),
          }, 'high');
          break;
        }
      }

      // Cek automation properties
      var automationProps = ['webdriver', '__nightmare', '_phantom', 'callPhantom', '_selenium'];
      for (var j = 0; j < automationProps.length; j++) {
        if (window[automationProps[j]]) {
          self.logViolation('automation_detected', {
            property: automationProps[j],
          }, 'critical');
        }
      }
    },

    // ============================================
    // DETEKSI 7: Right Click / Inspect
    // ============================================
    detectRightClick: function() {
      var self = this;
      
      document.addEventListener('contextmenu', function(e) {
        self.logViolation('right_click', {
          target: e.target.tagName,
        }, 'low');
      });

      // Deteksi F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      document.addEventListener('keydown', function(e) {
        // F12
        if (e.key === 'F12' || e.keyCode === 123) {
          self.logViolation('f12_pressed', {}, 'medium');
        }
        
        // Ctrl+Shift+I / J / C
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || 
            e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
          self.logViolation('devtools_shortcut', {
            key: e.key,
          }, 'medium');
        }
        
        // Ctrl+U (view source)
        if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
          self.logViolation('view_source', {}, 'medium');
        }
      });
    },

    // ============================================
    // GET REPORT
    // ============================================
    getReport: function() {
      return {
        version: this.VERSION,
        mode: this.MODE,
        suspicionScore: this.suspicionScore,
        devtoolsOpen: this.devtoolsOpen,
        sessionDuration: Math.round((Date.now() - this.sessionStart) / 1000),
        violations: this.violations,
        totalViolations: this.violations.length,
        storedViolations: this.getStoredViolations().length,
      };
    },

    // ============================================
    // INIT
    // ============================================
    init: function() {
      console.log('[AntiCheat] Init mode:', this.MODE);
      
      var self = this;
      
      try {
        // Delay sedikit biar page settle
        setTimeout(function() {
          self.detectEmulator();
          self.detectRightClick();
          self.detectAutoClick();
          self.detectDevTools();
          self.detectConsoleUsage();
          self.detectStorageTampering();
          self.detectFunctionOverride();
          
          console.log('[AntiCheat] All detectors active');
        }, 2000);
      } catch (e) {
        console.error('[AntiCheat] Init error:', e);
      }
    },
  };

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(function() { window.AntiCheat.init(); }, 1000);
    });
  } else {
    setTimeout(function() { window.AntiCheat.init(); }, 1000);
  }

  console.log('[AntiCheat] Loaded — mode: detect+report');
})();
