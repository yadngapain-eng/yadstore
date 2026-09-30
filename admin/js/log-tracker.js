
/* ============================================
   ADMIN LOG TRACKER
   Capture semua error, console, network, Firestore
   ============================================ */
(function() {
  'use strict';

  window.AdminLog = window.AdminLog || {};

  // ===== STATE =====
  AdminLog.logs = [];
  AdminLog.MAX_LOGS = 1000;
  AdminLog.filter = 'all';  // all | error | warn | info

  // ===== INIT =====
  AdminLog.init = function() {
    console.log('[AdminLog] Init...');

    // Hook console methods
    AdminLog.hookConsole();

    // Hook window.onerror
    AdminLog.hookGlobalError();

    // Hook unhandledrejection
    AdminLog.hookPromiseRejection();

    // Hook fetch
    AdminLog.hookFetch();

    // Add initial log
    AdminLog.log('info', 'Log Tracker', 'Started at ' + new Date().toLocaleString('id-ID'));

    // Log device info
    AdminLog.logDeviceInfo();

    console.log('[AdminLog] Ready');
  };

  // ===== ADD LOG =====
  AdminLog.log = function(type, source, message, details) {
    var entry = {
      id: Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      time: new Date().toISOString(),
      timeLocal: new Date().toLocaleString('id-ID'),
      type: type,  // error | warn | info | network | firestore
      source: source,
      message: message,
      details: details || null,
      url: window.location.href,
    };

    AdminLog.logs.unshift(entry);

    // Limit
    if (AdminLog.logs.length > AdminLog.MAX_LOGS) {
      AdminLog.logs = AdminLog.logs.slice(0, AdminLog.MAX_LOGS);
    }

    // Auto-refresh UI kalau sedang di halaman Debug
    if (AdminLog.isDebugPageActive()) {
      AdminLog.renderDebugUI();
    }

    return entry;
  };

  // ===== HOOK CONSOLE =====
  AdminLog.hookConsole = function() {
    var methods = ['log', 'warn', 'error', 'info'];

    methods.forEach(function(method) {
      var original = console[method];
      console[method] = function() {
        var args = Array.prototype.slice.call(arguments);
        var message = args.map(function(a) {
          try {
            if (typeof a === 'object') return JSON.stringify(a);
            return String(a);
          } catch (e) { return '[object]'; }
        }).join(' ');

        // Tentukan type
        var type = 'info';
        if (method === 'warn') type = 'warn';
        else if (method === 'error') type = 'error';

        // Skip log dari AdminLog sendiri (biar tidak infinite loop)
        if (message.indexOf('[AdminLog]') !== 0 && message.indexOf('[LogTracker]') !== 0) {
          AdminLog.log(type, 'console.' + method, message);
        }

        // Panggil original
        original.apply(console, args);
      };
    });
  };

  // ===== HOOK GLOBAL ERROR =====
  AdminLog.hookGlobalError = function() {
    window.addEventListener('error', function(e) {
      var message = e.message || 'Unknown error';
      var details = {
        filename: e.filename || 'unknown',
        lineno: e.lineno || 0,
        colno: e.colno || 0,
        stack: e.error && e.error.stack ? e.error.stack : null,
      };
      AdminLog.log('error', 'window.onerror', message, details);
    });
  };

  // ===== HOOK PROMISE REJECTION =====
  AdminLog.hookPromiseRejection = function() {
    window.addEventListener('unhandledrejection', function(e) {
      var reason = e.reason || 'Unknown rejection';
      var message = reason.message || String(reason);
      var details = {
        stack: reason.stack || null,
        name: reason.name || null,
      };
      AdminLog.log('error', 'unhandledrejection', message, details);
    });
  };

  // ===== HOOK FETCH =====
  AdminLog.hookFetch = function() {
    var originalFetch = window.fetch;
    window.fetch = function() {
      var args = arguments;
      var url = args[0];
      var options = args[1] || {};
      var method = (options.method || 'GET').toUpperCase();
      var startTime = Date.now();

      return originalFetch.apply(window, args)
        .then(function(response) {
          var duration = Date.now() - startTime;

          // Log kalau error
          if (!response.ok) {
            AdminLog.log('network', 'fetch',
              method + ' ' + url + ' → ' + response.status,
              {
                status: response.status,
                statusText: response.statusText,
                duration: duration + 'ms',
              }
            );
          }

          return response;
        })
        .catch(function(error) {
          var duration = Date.now() - startTime;
          AdminLog.log('network', 'fetch',
            method + ' ' + url + ' → FAILED',
            {
              error: error.message,
              duration: duration + 'ms',
            }
          );
          throw error;
        });
    };
  };

  // ===== DEVICE INFO =====
  AdminLog.logDeviceInfo = function() {
    var info = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: window.screen.width + 'x' + window.screen.height,
      viewport: window.innerWidth + 'x' + window.innerHeight,
      dpr: window.devicePixelRatio,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      online: navigator.onLine,
    };

    if (navigator.connection) {
      info.connection = navigator.connection.effectiveType;
      info.downlink = navigator.connection.downlink + 'Mbps';
    }

    AdminLog.log('info', 'device', 'Device Info', info);
  };

  // ===== CHECK DEBUG PAGE =====
  AdminLog.isDebugPageActive = function() {
    var debugPage = document.getElementById('admin-debug');
    return debugPage && debugPage.classList.contains('active');
  };

  // ===== RENDER DEBUG UI =====
  AdminLog.renderDebugUI = function() {
    var container = document.getElementById('admin-debug');
    if (!container) return;

    var logs = AdminLog.logs;

    // Filter
    if (AdminLog.filter !== 'all') {
      logs = logs.filter(function(l) {
        if (AdminLog.filter === 'error') return l.type === 'error' || l.type === 'network';
        if (AdminLog.filter === 'warn') return l.type === 'warn';
        if (AdminLog.filter === 'info') return l.type === 'info' || l.type === 'firestore';
        return true;
      });
    }

    // Stats
    var stats = {
      total: AdminLog.logs.length,
      error: AdminLog.logs.filter(function(l) { return l.type === 'error'; }).length,
      warn: AdminLog.logs.filter(function(l) { return l.type === 'warn'; }).length,
      network: AdminLog.logs.filter(function(l) { return l.type === 'network'; }).length,
      info: AdminLog.logs.filter(function(l) { return l.type === 'info' || l.type === 'firestore'; }).length,
    };

    var html = '';

    // Header
    html += '<div style="background:linear-gradient(135deg,#1f2937,#111827);color:white;padding:20px;border-radius:16px;margin-bottom:16px">';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:16px">';
    html += '<div>';
    html += '<div style="font-size:20px;font-weight:900;margin-bottom:4px">📋 Log & Error Tracker</div>';
    html += '<div style="font-size:12px;color:#9ca3af">Capture semua error, console, network, Firestore</div>';
    html += '</div>';
    html += '<div style="display:flex;gap:8px">';
    html += '<button onclick="AdminLog.copyAll()" style="padding:10px 16px;background:linear-gradient(135deg,#58cc02,#89e219);color:white;border:none;border-radius:8px;font-family:inherit;font-weight:900;font-size:12px;cursor:pointer">📋 Copy Semua</button>';
    html += '<button onclick="AdminLog.downloadTxt()" style="padding:10px 16px;background:linear-gradient(135deg,#6366f1,#4f46e5);color:white;border:none;border-radius:8px;font-family:inherit;font-weight:900;font-size:12px;cursor:pointer">📥 Download TXT</button>';
    html += '<button onclick="AdminLog.clearAll()" style="padding:10px 16px;background:linear-gradient(135deg,#ff4b4b,#ea2b2b);color:white;border:none;border-radius:8px;font-family:inherit;font-weight:900;font-size:12px;cursor:pointer">🗑️ Clear</button>';
    html += '</div>';
    html += '</div>';

    // Stats grid
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:10px">';
    html += AdminLog.statCard('📊', stats.total, 'Total', '#9ca3af');
    html += AdminLog.statCard('❌', stats.error, 'Error', '#ef4444');
    html += AdminLog.statCard('⚠️', stats.warn, 'Warning', '#f59e0b');
    html += AdminLog.statCard('🌐', stats.network, 'Network', '#6366f1');
    html += AdminLog.statCard('ℹ️', stats.info, 'Info', '#58cc02');
    html += '</div>';
    html += '</div>';

    // Filter tabs
    html += '<div style="display:flex;gap:8px;margin-bottom:16px;overflow-x:auto;padding-bottom:6px">';
    html += AdminLog.filterTab('all', '🎯 Semua', stats.total);
    html += AdminLog.filterTab('error', '❌ Error', stats.error);
    html += AdminLog.filterTab('warn', '⚠️ Warning', stats.warn);
    html += AdminLog.filterTab('info', 'ℹ️ Info', stats.info);
    html += '</div>';

    // Log list
    if (logs.length === 0) {
      html += '<div style="text-align:center;padding:60px 20px;color:#999">';
      html += '<div style="font-size:60px;margin-bottom:12px">✨</div>';
      html += '<div style="font-size:14px;font-weight:800">Tidak ada log</div>';
      html += '<div style="font-size:12px;margin-top:4px">Semua bersih!</div>';
      html += '</div>';
    } else {
      html += '<div style="display:flex;flex-direction:column;gap:8px">';
      logs.slice(0, 200).forEach(function(log, i) {
        html += AdminLog.renderLogItem(log, i);
      });
      html += '</div>';

      if (logs.length > 200) {
        html += '<div style="text-align:center;padding:16px;color:#999;font-size:12px">';
        html += 'Menampilkan 200 dari ' + logs.length + ' log. Download TXT untuk lihat semua.';
        html += '</div>';
      }
    }

    container.innerHTML = html;
  };

  AdminLog.statCard = function(icon, value, label, color) {
    return '<div style="background:rgba(255,255,255,0.1);padding:12px;border-radius:10px;text-align:center">' +
      '<div style="font-size:20px;margin-bottom:4px">' + icon + '</div>' +
      '<div style="font-size:18px;font-weight:900;color:' + color + '">' + value + '</div>' +
      '<div style="font-size:10px;color:#9ca3af;text-transform:uppercase;font-weight:700">' + label + '</div>' +
    '</div>';
  };

  AdminLog.filterTab = function(type, label, count) {
    var active = AdminLog.filter === type;
    var bg = active ? 'linear-gradient(135deg,#58cc02,#89e219)' : 'white';
    var color = active ? 'white' : '#666';
    var border = active ? 'transparent' : '#e5e5e5';
    return '<button onclick="AdminLog.setFilter(\'' + type + '\')" style="padding:8px 14px;background:' + bg + ';color:' + color + ';border:2px solid ' + border + ';border-radius:999px;font-family:inherit;font-size:12px;font-weight:800;cursor:pointer;white-space:nowrap">' +
      label + ' (' + count + ')' +
    '</button>';
  };

  AdminLog.renderLogItem = function(log, index) {
    var colors = {
      error: { bg: '#fef2f2', border: '#ef4444', text: '#7f1d1d' },
      warn: { bg: '#fef3c7', border: '#f59e0b', text: '#78350f' },
      info: { bg: '#f0fdf4', border: '#58cc02', text: '#14532d' },
      network: { bg: '#eef2ff', border: '#6366f1', text: '#312e81' },
      firestore: { bg: '#fdf4ff', border: '#a855f7', text: '#581c87' },
    };
    var c = colors[log.type] || colors.info;

    var detailsHtml = '';
    if (log.details) {
      var detailsStr = JSON.stringify(log.details, null, 2);
      detailsHtml = '<pre style="margin-top:8px;padding:8px;background:rgba(0,0,0,0.05);border-radius:6px;font-size:11px;overflow-x:auto;white-space:pre-wrap;word-break:break-all">' +
        AdminLog.escapeHtml(detailsStr) +
      '</pre>';
    }

    return '<div style="background:' + c.bg + ';border-left:4px solid ' + c.border + ';border-radius:8px;padding:12px">' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px">' +
        '<div style="font-size:10px;font-weight:900;color:' + c.text + ';text-transform:uppercase;letter-spacing:0.5px">' +
          log.type + ' • ' + log.source +
        '</div>' +
        '<div style="font-size:10px;color:#999;font-weight:700;white-space:nowrap">' + log.timeLocal + '</div>' +
      '</div>' +
      '<div style="font-size:13px;font-weight:700;color:#1a1a1a;word-break:break-word">' + AdminLog.escapeHtml(log.message) + '</div>' +
      detailsHtml +
    '</div>';
  };

  AdminLog.escapeHtml = function(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  // ===== ACTIONS =====
  AdminLog.setFilter = function(type) {
    AdminLog.filter = type;
    AdminLog.renderDebugUI();
  };

  AdminLog.copyAll = function() {
    var text = AdminLog.exportText();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function() {
          alert('✅ ' + AdminLog.logs.length + ' log berhasil di-copy ke clipboard!');
        }).catch(function() {
          AdminLog.fallbackCopy(text);
        });
      } else {
        AdminLog.fallbackCopy(text);
      }
    } catch (e) {
      AdminLog.fallbackCopy(text);
    }
  };

  AdminLog.fallbackCopy = function(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      alert('✅ ' + AdminLog.logs.length + ' log berhasil di-copy!');
    } catch (e) {
      alert('❌ Gagal copy. Coba download TXT.');
    }
    ta.remove();
  };

  AdminLog.downloadTxt = function() {
    var text = AdminLog.exportText();
    var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    var timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    a.download = 'admin-log-' + timestamp + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  AdminLog.exportText = function() {
    var lines = [];

    lines.push('================================================================');
    lines.push('           ADMIN PANEL LOG EXPORT');
    lines.push('================================================================');
    lines.push('');
    lines.push('Export Date : ' + new Date().toLocaleString('id-ID'));
    lines.push('Total Logs  : ' + AdminLog.logs.length);
    lines.push('URL         : ' + window.location.href);
    lines.push('User Agent  : ' + navigator.userAgent);
    lines.push('');
    lines.push('================================================================');
    lines.push('                    LOG DETAILS');
    lines.push('================================================================');
    lines.push('');

    AdminLog.logs.forEach(function(log, i) {
      lines.push('----------------------------------------------------------------');
      lines.push('#' + (i + 1) + ' [' + log.type.toUpperCase() + '] ' + log.source);
      lines.push('----------------------------------------------------------------');
      lines.push('Time    : ' + log.timeLocal);
      lines.push('URL     : ' + log.url);
      lines.push('Message : ' + log.message);
      if (log.details) {
        lines.push('Details :');
        lines.push(JSON.stringify(log.details, null, 2));
      }
      lines.push('');
    });

    lines.push('================================================================');
    lines.push('                    END OF LOG');
    lines.push('================================================================');

    return lines.join('\n');
  };

  AdminLog.clearAll = function() {
    if (!confirm('Hapus semua log? (' + AdminLog.logs.length + ' log akan dihapus)')) return;
    AdminLog.logs = [];
    AdminLog.renderDebugUI();
    console.log('[AdminLog] Logs cleared');
  };

  // ===== AUTO INIT =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(AdminLog.init, 500);
    });
  } else {
    setTimeout(AdminLog.init, 500);
  }

  window.AdminLog = AdminLog;
})();
