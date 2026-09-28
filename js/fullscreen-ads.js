
/* ============================================
   FULLSCREEN ARTICLE + ADS EVERYWHERE
   ============================================ */
(function() {
  'use strict';

  window.FSArticle = window.FSArticle || {};

  var AD_CONTAINER_CLASS = 'ad-slot';
  var adLoadedCount = 0;
  var adFailedCount = 0;
  var stickyAdDismissed = false;

  /* ============================================
     1. FULLSCREEN ARTICLE MODE
     ============================================ */
  FSArticle.enterFullscreen = function() {
    if (document.body.classList.contains('article-fullscreen')) return;
    document.body.classList.add('article-fullscreen');
    createFullscreenTopbar();
    console.log('[FS] Entered article fullscreen');
  };

  FSArticle.exitFullscreen = function() {
    if (!document.body.classList.contains('article-fullscreen')) return;
    document.body.classList.remove('article-fullscreen');
    removeFullscreenTopbar();
    console.log('[FS] Exited article fullscreen');
  };

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

    // Insert sebagai elemen pertama di body
    document.body.insertBefore(bar, document.body.firstChild);

    // Update coins
    updateFSCoins();
  }

  function removeFullscreenTopbar() {
    var bar = document.getElementById('fs-topbar');
    if (bar) bar.remove();
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

  FSArticle.goRewards = function() {
    if (typeof App !== 'undefined' && App.switchTab) {
      FSArticle.exitFullscreen();
      App.switchTab('rewards');
    }
  };

  FSArticle.openMenu = function() {
    if (typeof UI !== 'undefined' && UI.toggleMenu) {
      UI.toggleMenu();
    }
  };

  /* ============================================
     2. AUTO FULLSCREEN SAAT TAB ARTICLE
     ============================================ */
  function patchAppSwitchTab() {
    if (typeof App === 'undefined' || !App.switchTab) {
      setTimeout(patchAppSwitchTab, 200);
      return;
    }
    if (App._fsPatched) return;
    App._fsPatched = true;

    var origSwitch = App.switchTab;
    App.switchTab = function(tab) {
      origSwitch.call(App, tab);

      // Update fullscreen state
      if (tab === 'articles') {
        setTimeout(function() {
          FSArticle.enterFullscreen();
          // Re-inject ads after render
          setTimeout(injectAdsToArticles, 300);
        }, 100);
      } else {
        FSArticle.exitFullscreen();
      }
    };

    // Kalau default tab = articles, aktifkan fullscreen
    if (App.currentTab === 'articles') {
      setTimeout(function() {
        FSArticle.enterFullscreen();
        setTimeout(injectAdsToArticles, 300);
      }, 500);
    }
  }

  // Monitor perubahan tab-page active
  function monitorTabChanges() {
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        if (m.target.id === 'page-articles' && m.target.classList.contains('active')) {
          FSArticle.enterFullscreen();
          setTimeout(injectAdsToArticles, 300);
        }
      });
    });

    var el = document.getElementById('page-articles');
    if (el) {
      observer.observe(el, { attributes: true, attributeFilter: ['class'] });
    } else {
      setTimeout(monitorTabChanges, 500);
    }
  }

  /* ============================================
     3. INJECT ADS KE SEMUA MENU
     ============================================ */
  function createAdSlot(className, id) {
    var div = document.createElement('div');
    div.className = AD_CONTAINER_CLASS + ' ' + (className || '');
    if (id) div.id = id;
    div.innerHTML = '<div style="color:#ccc;font-size:11px;font-weight:600">Loading ad...</div>';
    return div;
  }

  function injectAdsToArticles() {
    var container = document.getElementById('articles-content');
    if (!container) return;
    if (container.dataset.adsInjected === 'true') {
      // Re-trigger ad refresh
      refreshAdsInContainer(container);
      return;
    }

    container.dataset.adsInjected = 'true';

    // Inject top ad (setelah hero, sebelum section title)
    var sectionTitle = container.querySelector('.article-section-title');
    if (sectionTitle && !container.querySelector('.ad-slot-top')) {
      var topAd = createAdSlot('ad-slot-top', 'ad-article-top');
      sectionTitle.parentNode.insertBefore(topAd, sectionTitle);
    }

    // Inject middle ad (setelah 3 article cards)
    var cards = container.querySelectorAll('.article-card');
    if (cards.length > 3) {
      var midAd = createAdSlot('ad-slot-middle', 'ad-article-mid');
      cards[2].parentNode.insertBefore(midAd, cards[3]);
    }

    // Inject bottom ad
    if (!container.querySelector('.ad-slot-bottom')) {
      var botAd = createAdSlot('ad-slot-bottom', 'ad-article-bottom');
      container.appendChild(botAd);
    }

    // Trigger ads load
    setTimeout(function() {
      loadAllAds();
    }, 500);
  }

  function injectAdsToContainer(containerId, position) {
    var container = document.getElementById(containerId);
    if (!container) return;
    if (container.dataset.adsInjected === 'true') {
      refreshAdsInContainer(container);
      return;
    }
    container.dataset.adsInjected = 'true';

    if (position === 'top' || !position) {
      var topAd = createAdSlot('ad-slot-top', 'ad-' + containerId + '-top');
      container.insertBefore(topAd, container.firstChild);
    }

    if (position === 'bottom' || !position) {
      var botAd = createAdSlot('ad-slot-bottom', 'ad-' + containerId + '-bottom');
      container.appendChild(botAd);
    }

    setTimeout(loadAllAds, 500);
  }

  // Auto inject ads ke semua menu utama
  function injectAdsAllMenus() {
    // Articles
    injectAdsToArticles();

    // Other pages — inject ads ringan di bawah
    var otherPages = ['page-learn', 'page-topup', 'page-orders', 'page-achievements', 'page-rewards', 'page-profile', 'page-help'];
    otherPages.forEach(function(pageId) {
      var page = document.getElementById(pageId);
      if (!page) return;
      if (page.dataset.adsInjected === 'true') return;
      page.dataset.adsInjected = 'true';

      // Inject bottom ad aja (biar tidak ganggu)
      var botAd = createAdSlot('ad-slot-bottom', 'ad-' + pageId);
      page.appendChild(botAd);
    });

    // Trigger load
    setTimeout(loadAllAds, 800);
  }

  /* ============================================
     4. LOAD ADS — Pakai AdsManager
     ============================================ */
  function loadAllAds() {
    // Kalau AdsManager ada, coba init
    if (typeof AdsManager !== 'undefined') {
      if (!AdsManager.initialized && AdsManager.init) {
        try { AdsManager.init(); } catch(e) {}
      }
    }

    // Untuk setiap ad slot, inject script Monetag vignette (yang paling aman)
    var slots = document.querySelectorAll('.ad-slot:not(.ad-loaded):not(.ad-failed)');
    slots.forEach(function(slot, idx) {
      loadAdInSlot(slot, idx);
    });
  }

  function loadAdInSlot(slot, idx) {
    try {
      var iframeId = 'ad-iframe-' + Date.now() + '-' + idx;

      // Buat iframe untuk ad (isolated)
      var iframe = document.createElement('iframe');
      iframe.id = iframeId;
      iframe.style.cssText = 'width:100%;height:100%;border:none;background:transparent;min-height:inherit';
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox');
      iframe.setAttribute('scrolling', 'no');

      // Isi iframe dengan script Monetag in-page
      var doc = iframe.contentWindow.document;
      doc.open();
      doc.write('<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;padding:0;overflow:hidden;display:flex;align-items:center;justify-content:center;background:transparent;font-family:system-ui,sans-serif}iframe,img{max-width:100%;max-height:100%}</style></head><body></body></html>');
      doc.close();

      slot.innerHTML = '';
      slot.appendChild(iframe);

      // Track load attempt
      setTimeout(function() {
        // Kalau iframe punya konten, anggap loaded
        var hasContent = false;
        try {
          hasContent = doc.body && doc.body.children.length > 0;
        } catch (e) {
          hasContent = true;
        }

        if (hasContent || idx < 3) {
          // Asumsikan loaded untuk slot prioritas
          slot.classList.add('ad-loaded');
          adLoadedCount++;
        } else {
          // Slot kosong → sembunyikan
          slot.classList.add('ad-failed');
          adFailedCount++;
        }
      }, 2500);

      // Coba inject script Monetag ke dalam iframe
      try {
        var script = doc.createElement('script');
        script.src = 'https://quge5.com/88/tag.min.js';
        script.setAttribute('data-zone', '286791');
        script.setAttribute('data-cfasync', 'false');
        script.async = true;
        script.onerror = function() {
          slot.classList.add('ad-failed');
          adFailedCount++;
        };
        doc.head.appendChild(script);
      } catch (e) {
        // Cross-origin iframe issue, tapi slot tetap ada
      }

    } catch (e) {
      console.warn('[Ads] Slot ' + idx + ' error:', e);
      slot.classList.add('ad-failed');
    }
  }

  function refreshAdsInContainer(container) {
    var slots = container.querySelectorAll('.ad-slot');
    slots.forEach(function(slot) {
      slot.classList.remove('ad-loaded', 'ad-failed');
      slot.innerHTML = '<div style="color:#ccc;font-size:11px;font-weight:600">Loading ad...</div>';
    });
    setTimeout(loadAllAds, 300);
  }

  /* ============================================
     5. STICKY BOTTOM AD
     ============================================ */
  function createStickyAd() {
    if (document.getElementById('sticky-bottom-ad')) return;
    if (stickyAdDismissed) return;

    var ad = document.createElement('div');
    ad.id = 'sticky-bottom-ad';
    ad.className = 'sticky-bottom-ad show';
    ad.innerHTML =
      '<button class="sticky-bottom-ad-close" onclick="FSArticle.dismissStickyAd()">✕</button>' +
      '<div class="sticky-bottom-ad-content" id="sticky-ad-content">' +
        '<div style="color:#ccc;font-size:11px">Loading ad...</div>' +
      '</div>';
    document.body.appendChild(ad);

    // Load ad
    setTimeout(function() {
      var content = document.getElementById('sticky-ad-content');
      if (content) {
        content.innerHTML = '<div style="padding:12px;text-align:center;color:#58cc02;font-size:12px;font-weight:700">📢 Iklan</div>';
      }
    }, 1500);
  }

  FSArticle.dismissStickyAd = function() {
    stickyAdDismissed = true;
    var ad = document.getElementById('sticky-bottom-ad');
    if (ad) {
      ad.classList.remove('show');
      setTimeout(function() { ad.remove(); }, 300);
    }
  };

  /* ============================================
     6. MONITOR ARTICLE RENDER (re-inject after render)
     ============================================ */
  function monitorArticleRender() {
    if (typeof Articles === 'undefined') {
      setTimeout(monitorArticleRender, 300);
      return;
    }
    if (Articles._fsAdsPatched) return;
    Articles._fsAdsPatched = true;

    var origRender = Articles.render;
    Articles.render = function() {
      origRender.call(Articles);
      // Re-inject ads after render
      setTimeout(injectAdsToArticles, 100);
    };
  }

  /* ============================================
     7. INIT
     ============================================ */
  function init() {
    patchAppSwitchTab();
    monitorTabChanges();
    monitorArticleRender();

    // Sticky ad setelah 5 detik
    setTimeout(function() {
      // Jangan tampilkan di halaman topup/orders (biar tidak ganggu transaksi)
      var skipSticky = false;
      try {
        if (typeof App !== 'undefined' && (App.currentTab === 'topup' || App.currentTab === 'orders')) {
          skipSticky = true;
        }
      } catch (e) {}
      if (!skipSticky) createStickyAd();
    }, 5000);

    // Inject ads ke semua menu (setelah app ready)
    setTimeout(injectAdsAllMenus, 2000);

    // Re-check setiap 10 detik (biar tidak ketinggalan)
    setInterval(function() {
      var activePage = document.querySelector('.tab-page.active');
      if (activePage && activePage.id === 'page-articles') {
        injectAdsToArticles();
      }
      updateFSCoins();
    }, 10000);

    console.log('[FSArticle + Ads] Loaded');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(init, 500);
    });
  } else {
    setTimeout(init, 500);
  }

  // Expose API
  window.FSArticle = FSArticle;
})();
