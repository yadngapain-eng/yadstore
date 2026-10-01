
/* ============================================
   ANALYTICS HELPER
   Support GA4 + Sentry + Custom events
   ============================================ */
(function() {
  'use strict';

  window.Analytics = window.Analytics || {};

  // ⚠️ GANTI DENGAN ID KAMU
  var CONFIG = window.ANALYTICS_CONFIG || {
    GA4_ID: '',
    SENTRY_DSN: '',
    ENABLED: false,
  };

  if (!CONFIG.GA4_ID) {
    CONFIG.ENABLED = false;
    console.log('[Analytics] Disabled — GA4_ID kosong');
  }

  // ============================================
  // GA4 INIT
  // ============================================
  Analytics.initGA4 = function() {
    if (!CONFIG.GA4_ID) {
      console.log('[Analytics] GA4 ID not set, skip');
      return;
    }

    // Load gtag script
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + CONFIG.GA4_ID;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', CONFIG.GA4_ID, {
      'send_page_view': true,
      'cookie_flags': 'SameSite=None;Secure'
    });

    console.log('[Analytics] GA4 initialized:', CONFIG.GA4_ID);
  };

  // ============================================
  // SENTRY INIT
  // ============================================
  Analytics.initSentry = function() {
    if (!CONFIG.SENTRY_DSN) {
      console.log('[Analytics] Sentry DSN not set, skip');
      return;
    }

    var script = document.createElement('script');
    script.src = 'https://browser.sentry-cdn.com/7.99.0/bundle.min.js';
    script.crossOrigin = 'anonymous';
    script.onload = function() {
      if (typeof Sentry !== 'undefined') {
        Sentry.init({
          dsn: CONFIG.SENTRY_DSN,
          environment: 'production',
          tracesSampleRate: 0.1,
          beforeSend: function(event) {
            // Filter error yang tidak penting
            if (event.message && event.message.includes('ResizeObserver')) return null;
            return event;
          }
        });
        console.log('[Analytics] Sentry initialized');
      }
    };
    document.head.appendChild(script);
  };

  // ============================================
  // TRACK EVENT
  // ============================================
  Analytics.track = function(eventName, params) {
    if (!CONFIG.ENABLED) return;

    params = params || {};

    // GA4
    if (typeof gtag !== 'undefined') {
      try {
        gtag('event', eventName, params);
      } catch (e) {}
    }

    console.log('[Analytics] Event:', eventName, params);
  };

  // ============================================
  // TRACK PAGE VIEW
  // ============================================
  Analytics.trackPageView = function(pageName) {
    Analytics.track('page_view', {
      page_title: pageName,
      page_location: window.location.href,
      page_path: window.location.pathname
    });
  };

  // ============================================
  // AUTO HOOKS
  // ============================================
  function installHooks() {
    // Hook tab switch
    if (typeof App !== 'undefined' && App.switchTab && !App._analyticsHooked) {
      App._analyticsHooked = true;
      var origSwitch = App.switchTab;
      App.switchTab = function(tab) {
        origSwitch.call(App, tab);
        Analytics.trackPageView(tab);
      };
    }

    // Hook rewards addCoin
    if (typeof Rewards !== 'undefined' && Rewards.addCoin && !Rewards._analyticsHooked) {
      Rewards._analyticsHooked = true;
      var origAddCoin = Rewards.addCoin;
      Rewards.addCoin = function(amount, reason) {
        var result = origAddCoin.call(Rewards, amount, reason);
        Analytics.track('coin_earned', {
          value: amount,
          currency: 'IDR',
          reason: reason || 'unknown'
        });
        return result;
      };
    }

    // Hook lesson complete
    if (typeof DL !== 'undefined' && DL.completeLesson && !DL._analyticsHooked) {
      DL._analyticsHooked = true;
      var origComplete = DL.completeLesson;
      DL.completeLesson = function(id, score, total, reward) {
        var result = origComplete.call(DL, id, score, total, reward);
        Analytics.track('lesson_completed', {
          lesson_id: id,
          score: score,
          total: total,
          perfect: score === total
        });
        return result;
      };
    }

    // Hook articles claim
    if (typeof Articles !== 'undefined' && Articles.claim && !Articles._analyticsHooked) {
      Articles._analyticsHooked = true;
      var origClaim = Articles.claim;
      Articles.claim = function() {
        var result = origClaim.call(Articles);
        Analytics.track('article_claimed');
        return result;
      };
    }
  }

  // ============================================
  // INIT
  // ============================================
  function init() {
    Analytics.initGA4();
    Analytics.initSentry();
    installHooks();

    // Track initial page
    Analytics.trackPageView('home');

    console.log('[Analytics] Ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(init, 2000);
    });
  } else {
    setTimeout(init, 2000);
  }

  window.Analytics = Analytics;
})();
