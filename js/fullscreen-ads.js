/* ============================================
   FULLSCREEN ARTICLE MODE (tanpa ad slot)
   Header hilang saat buka artikel
   ============================================ */
(function() {
  'use strict';

  window.FSArticle = window.FSArticle || {};

  /* ============================================
     1. ENTER / EXIT FULLSCREEN
     ============================================ */
  FSArticle.enterFullscreen = function() {
    if (document.body.classList.contains('article-fullscreen')) return;
    document.body.classList.add('article-fullscreen');
    createFullscreenTopbar();
    console.log('[FS] Entered fullscreen');
  };

  FSArticle.exitFullscreen = function() {
    if (!document.body.classList.contains('article-fullscreen')) return;
    document.body.classList.remove('article-fullscreen');
    var bar = document.getElementById('fs-topbar');
    if (bar) bar.remove();
    console.log('[FS] Exited fullscreen');
  };

  /* ============================================
     2. TOPBAR CUSTOM (saat fullscreen)
     ============================================ */
  function createFullscreenTopbar() {
    if (document.getElementById('fs-topbar')) return;
    var bar = document.createElement('div');
    bar.id = 'fs-topbar';
    bar.className = 'article-fullscreen-bar';
    bar.innerHTML =
      '<div class="fs-logo">LE</div>' +
      '<div class="fs-title">📖 Artikel</div>' +
      '<div class="fs-coins" onclick="FSArticle.goRewards()" style="cursor:pointer">' +
        '<span>🪙</span><span id="fs-coins-value">0</span>' +
      '</div>' +
      '<button class="fs-menu-btn" onclick="FSArticle.openMenu()">☰</button>';
    document.body.insertBefore(bar, document.body.firstChild);
    updateFSCoins();
  }

  function updateFSCoins() {
    var el = document.getElementById('fs-coins-value');
    if (!el) return;
    try {
      if (typeof Rewards !== 'undefined' && Rewards.getState) {
        var s = Rewards.getState();
        el.textContent = (s.balance || 0).toLocaleString('id-ID');
      }
    } catch (e) {}
  }

  /* ============================================
     3. ACTIONS
     ============================================ */
  FSArticle.goRewards = function() {
    FSArticle.exitFullscreen();
    if (typeof App !== 'undefined' && App.switchTab) App.switchTab('rewards');
  };

  FSArticle.openMenu = function() {
    if (typeof UI !== 'undefined' && UI.toggleMenu) UI.toggleMenu();
  };

  /* ============================================
     4. PATCH App.switchTab
     ============================================ */
  function patchApp() {
    if (typeof App === 'undefined' || !App.switchTab) {
      setTimeout(patchApp, 200);
      return;
    }
    if (App._fsPatched) return;
    App._fsPatched = true;

    var orig = App.switchTab;
    App.switchTab = function(tab) {
      orig.call(App, tab);
      if (tab === 'articles') {
        setTimeout(function() { FSArticle.enterFullscreen(); }, 100);
      } else {
        FSArticle.exitFullscreen();
      }
    };

    // Kalau default tab = articles, aktifkan fullscreen
    if (App.currentTab === 'articles') {
      setTimeout(function() { FSArticle.enterFullscreen(); }, 500);
    }

    console.log('[FS] App.switchTab patched');
  }

  /* ============================================
     5. MONITOR TAB CHANGE (fallback)
     ============================================ */
  function monitorTabs() {
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        if (m.target.id === 'page-articles' && m.target.classList.contains('active')) {
          FSArticle.enterFullscreen();
        }
      });
    });
    var el = document.getElementById('page-articles');
    if (el) {
      observer.observe(el, { attributes: true, attributeFilter: ['class'] });
    } else {
      setTimeout(monitorTabs, 500);
    }
  }

  /* ============================================
     6. INIT
     ============================================ */
  function init() {
    patchApp();
    monitorTabs();

    // Update coins tiap 5 detik
    setInterval(updateFSCoins, 5000);

    console.log('[FS] Fullscreen-only mode loaded');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(init, 300);
    });
  } else {
    setTimeout(init, 300);
  }

  // Expose
  window.FSArticle = FSArticle;
})();
