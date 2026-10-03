/* ============================================
   YS STORE — HOME PAGE RENDERER
   ============================================ */

(function() {
  'use strict';

  window.YSHome = window.YSHome || {};

  var HOME_STATE = {
    currentCategory: 'all',
    searchQuery: ''
  };

  var CATEGORIES = [
    { id: 'all', label: 'Semua', icon: '🎯' },
    { id: 'moba', label: 'MOBA', icon: '⚔️' },
    { id: 'battle-royale', label: 'Battle Royale', icon: '🎯' },
    { id: 'gacha', label: 'Gacha/RPG', icon: '⚜️' },
    { id: 'shooter', label: 'Shooter', icon: '🔫' },
    { id: 'populer', label: 'Populer', icon: '🔥' },
    { id: 'voucher', label: 'Voucher', icon: '🎫' },
    { id: 'pulsa', label: 'Pulsa & Kuota', icon: '📱' }
  ];

  YSHome.render = function() {
    var container = document.getElementById('articles-content');
    if (!container) {
      container = document.getElementById('ys-home-content');
    }
    if (!container) return;

    var allItems = [].concat(window.GAMES || [], window.DATA_PACKAGES || []);

    // Filter
    var filtered = allItems;
    if (HOME_STATE.currentCategory !== 'all') {
      filtered = allItems.filter(function(item) {
        return item.category === HOME_STATE.currentCategory;
      });
    }

    if (HOME_STATE.searchQuery) {
      var q = HOME_STATE.searchQuery.toLowerCase();
      filtered = filtered.filter(function(item) {
        return item.name.toLowerCase().indexOf(q) !== -1;
      });
    }

    var html = '';

    // ===== HERO =====
    html += '<div class="home-hero">' +
      '<div class="home-hero-content">' +
        '<div class="home-hero-badge">⚡ PROSES 1 DETIK</div>' +
        '<div class="home-hero-title">YS Store</div>' +
        '<div class="home-hero-subtitle">Top up game, pulsa & voucher<br>Harga termurah, proses instan!</div>' +
        '<div class="home-hero-stats">' +
          '<div class="home-hero-stat">' +
            '<div class="home-hero-stat-value">' + allItems.length + '+</div>' +
            '<div class="home-hero-stat-label">Produk</div>' +
          '</div>' +
          '<div class="home-hero-stat">' +
            '<div class="home-hero-stat-value">50K+</div>' +
            '<div class="home-hero-stat-label">Transaksi</div>' +
          '</div>' +
          '<div class="home-hero-stat">' +
            '<div class="home-hero-stat-value">⭐ 4.9</div>' +
            '<div class="home-hero-stat-label">Rating</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

    // ===== PROCESS NOTICE =====
    html += '<div class="process-notice">' +
      '<div class="process-notice-icon">⚡</div>' +
      '<div class="process-notice-text">' +
        '<strong>Proses Instan 1-5 Menit!</strong><br>' +
        'Transfer → Upload bukti → Otomatis diproses' +
      '</div>' +
    '</div>';

    // ===== SEARCH BAR =====
    html += '<div style="position:relative;margin-bottom:16px">' +
      '<input type="text" id="ys-search" placeholder="🔍 Cari game, pulsa, atau voucher..." ' +
        'value="' + HOME_STATE.searchQuery + '" ' +
        'oninput="YSHome.onSearch(this.value)" ' +
        'style="width:100%;padding:14px 18px;border:2px solid rgba(99,102,241,0.15);border-radius:14px;font-family:inherit;font-size:14px;font-weight:600;background:white;outline:none;transition:all 0.2s">' +
    '</div>';

    // ===== CATEGORIES =====
    html += '<div class="ys-cats">';
    CATEGORIES.forEach(function(cat) {
      var active = HOME_STATE.currentCategory === cat.id ? 'active' : '';
      var count = cat.id === 'all' ? allItems.length :
                  allItems.filter(function(x) { return x.category === cat.id; }).length;
      html += '<button class="ys-cat-pill ' + active + '" onclick="YSHome.setCategory(\'' + cat.id + '\')">' +
        '<span>' + cat.icon + '</span><span>' + cat.label + '</span>' +
        '<span style="opacity:0.6;font-size:11px">(' + count + ')</span>' +
      '</button>';
    });
    html += '</div>';

    // ===== SECTION TITLE =====
    var catLabel = 'Semua Produk';
    var currentCat = CATEGORIES.find(function(c) { return c.id === HOME_STATE.currentCategory; });
    if (currentCat && currentCat.id !== 'all') catLabel = currentCat.label;

    html += '<div class="ys-section-title">' +
      '<h2>🎮 ' + catLabel + '</h2>' +
      '<span class="ys-section-count">' + filtered.length + ' item</span>' +
    '</div>';

    // ===== GRID =====
    if (filtered.length === 0) {
      html += '<div style="text-align:center;padding:60px 20px;color:#999">' +
        '<div style="font-size:60px;margin-bottom:12px">🔍</div>' +
        '<div style="font-size:14px;font-weight:800">Tidak ada hasil</div>' +
        '<div style="font-size:12px;margin-top:4px">Coba kata kunci lain</div>' +
      '</div>';
    } else {
      html += '<div class="topup-grid">';
      filtered.forEach(function(item) {
        html += '<div class="game-card" onclick="TopUpUI.open(\'' + item.id + '\')" ' +
          'style="--game-color: ' + item.color + '">' +
          '<div class="game-icon-wrap" style="background: ' + item.color + '15">' +
            '<img src="' + item.icon + '" class="game-icon-img" alt="' + item.name + '" ' +
                 'onload="this.style.opacity=1" ' +
                 'style="opacity:0;transition:opacity 0.3s" ' +
                 'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
            '<div class="game-icon-fallback" style="display:none;background:' + item.color + '">' +
              (item.short || item.name.charAt(0)) +
            '</div>' +
          '</div>' +
          '<div class="game-info">' +
            '<h3>' + item.name + '</h3>' +
            '<p>' + item.desc + '</p>' +
          '</div>' +
        '</div>';
      });
      html += '</div>';
    }

    // ===== INFO CARD =====
    html += '<div style="margin-top:24px;background:linear-gradient(135deg,#f0f9ff,#e0f2fe);border:2px solid #0ea5e9;border-radius:16px;padding:16px">' +
      '<div style="font-size:14px;font-weight:900;color:#0c4a6e;margin-bottom:10px">💡 Kenapa YS Store?</div>' +
      '<div style="display:flex;flex-direction:column;gap:8px;font-size:13px;color:#075985;font-weight:600">' +
        '<div>⚡ Proses instan 1-5 menit setelah upload bukti</div>' +
        '<div>💰 Harga termurah & bersaing</div>' +
        '<div>🔒 Aman & terpercaya sejak 2024</div>' +
        '<div>🎁 Bonus setiap pembelian</div>' +
        '<div>🛡️ Garansi 100% uang kembali jika gagal</div>' +
      '</div>' +
    '</div>';

    container.innerHTML = html;
  };

  YSHome.setCategory = function(cat) {
    HOME_STATE.currentCategory = cat;
    YSHome.render();
    if (typeof UI !== 'undefined' && UI.haptic) UI.haptic(10);
  };

  YSHome.onSearch = function(query) {
    HOME_STATE.searchQuery = query;
    // Re-render grid saja (tanpa kehilangan fokus input)
    var grid = document.querySelector('.topup-grid');
    if (!grid) return;
    // Simple: re-render only grid
    var allItems = [].concat(window.GAMES || [], window.DATA_PACKAGES || []);
    var filtered = allItems;
    if (HOME_STATE.currentCategory !== 'all') {
      filtered = allItems.filter(function(item) { return item.category === HOME_STATE.currentCategory; });
    }
    if (query) {
      var q = query.toLowerCase();
      filtered = filtered.filter(function(item) {
        return item.name.toLowerCase().indexOf(q) !== -1;
      });
    }
    if (filtered.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px 20px;color:#999">' +
        '<div style="font-size:60px;margin-bottom:12px">🔍</div>' +
        '<div style="font-size:14px;font-weight:800">Tidak ada hasil untuk "' + query + '"</div>' +
      '</div>';
    } else {
      grid.innerHTML = filtered.map(function(item) {
        return '<div class="game-card" onclick="TopUpUI.open(\'' + item.id + '\')" ' +
          'style="--game-color: ' + item.color + '">' +
          '<div class="game-icon-wrap" style="background: ' + item.color + '15">' +
            '<img src="' + item.icon + '" class="game-icon-img" alt="' + item.name + '" ' +
                 'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
            '<div class="game-icon-fallback" style="display:none;background:' + item.color + '">' +
              (item.short || item.name.charAt(0)) +
            '</div>' +
          '</div>' +
          '<div class="game-info">' +
            '<h3>' + item.name + '</h3>' +
            '<p>' + item.desc + '</p>' +
          '</div>' +
        '</div>';
      }).join('');
    }
  };

  console.log('[YSHome] Loaded');
})();
