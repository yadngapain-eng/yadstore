
/* ============================================
   DEFAULT TAB = ARTICLE
   ============================================ */
(function() {
  'use strict';

  // Override App.init untuk default ke article
  function waitForApp() {
    if (typeof App === 'undefined' || !App.init) {
      setTimeout(waitForApp, 100);
      return;
    }

    // Simpan original init
    var origInit = App.init;
    App.init = async function() {
      await origInit.call(App);

      // Override tab ke article
      setTimeout(function() {
        try {
          if (typeof App !== 'undefined' && App.switchTab) {
            App.switchTab('articles');
          }
          if (typeof DuoUI !== 'undefined' && DuoUI.renderCategories) {
            DuoUI.renderCategories();
            console.log('[DefaultTab] Categories re-rendered');
          }
        } catch (e) {
          console.warn('[DefaultTab] error:', e);
        }
      }, 500);
    };

    // Override switchTab juga biar konsisten
    var origSwitch = App.switchTab;
    App.switchTab = function(tab) {
      origSwitch.call(App, tab);
      // Update active state di drawer
      setTimeout(function() {
        if (typeof UI !== 'undefined' && UI.updateMenuActive) {
          UI.updateMenuActive();
        }
      }, 100);
    };

    console.log('[DefaultTab] Loaded');
  }

  // Kalau App sudah ada, langsung patch
  if (typeof App !== 'undefined') {
    waitForApp();
  } else {
    // Tunggu App muncul
    var interval = setInterval(function() {
      if (typeof App !== 'undefined' && App.init) {
        clearInterval(interval);
        waitForApp();
      }
    }, 100);
    // Max 10 detik
    setTimeout(function() { clearInterval(interval); }, 10000);
  }

  // Force default tab pada DOM ready (fallback)
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      // Update UI tab active
      document.querySelectorAll('.tab-page').forEach(function(p) {
        p.classList.remove('active');
      });
      var articlePage = document.getElementById('page-articles');
      if (articlePage) articlePage.classList.add('active');

      // Update nav active (kalau masih ada)
      document.querySelectorAll('.nav-btn').forEach(function(b) {
        b.classList.remove('active');
      });
      var articleBtn = document.querySelector('.nav-btn[data-tab="articles"]');
      if (articleBtn) articleBtn.classList.add('active');

      // Update App.currentTab
      if (typeof App !== 'undefined') {
        App.currentTab = 'articles';
      }

      // Update menu drawer active
      if (typeof UI !== 'undefined' && UI.updateMenuActive) {
        UI.updateMenuActive();
      }
    }, 1000);
  });
})();
