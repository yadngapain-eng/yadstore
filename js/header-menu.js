
/* ============================================
   HEADER MENU DRAWER
   ============================================ */
(function() {
  'use strict';

  var MENU_ITEMS = [
    { tab: 'articles',     icon: '📖', text: 'Artikel',    badge: 'Baca & dapat koin' },
    { tab: 'learn',        icon: '📚', text: 'Belajar',    badge: 'XP & Gems' },
    { tab: 'iconshop',     icon: '🖼️', text: 'Icon Shop',  badge: 'Beli icon' },
    { tab: 'topup',        icon: '🛒', text: 'Top Up',     badge: 'Game & Pulsa' },
    { tab: 'orders',       icon: '📦', text: 'Pesanan',    badge: 'Riwayat' },
    { tab: 'achievements', icon: '🏆', text: 'Achievement',badge: 'Kumpulkan' },
    { tab: 'rewards',      icon: '💰', text: 'Reward',     badge: 'Withdraw' },
    { tab: 'profile',      icon: '👤', text: 'Profile',    badge: 'Akun saya' },
    { tab: 'help',         icon: '❓', text: 'Bantuan',    badge: 'FAQ' }
  ];

  var DRAWER_ID = 'header-menu-drawer';
  var BTN_ID = 'header-menu-btn';

  function createDrawer() {
    if (document.getElementById(DRAWER_ID)) return;

    var html = 
      '<div class="menu-drawer" id="' + DRAWER_ID + '">' +
        '<div class="menu-drawer-backdrop" onclick="UI.closeMenu()"></div>' +
        '<div class="menu-drawer-content">' +
          // Header
          '<div class="menu-drawer-header">' +
            '<div class="menu-drawer-logo">LE</div>' +
            '<div class="menu-drawer-info">' +
              '<div class="menu-drawer-title" id="menu-user-name">Learn Earn</div>' +
              '<div class="menu-drawer-subtitle" id="menu-user-status">Belajar • Main • Cuan</div>' +
            '</div>' +
          '</div>' +
          // List
          '<div class="menu-drawer-list">' +
            MENU_ITEMS.map(function(item) {
              return '<button class="menu-drawer-item" data-tab="' + item.tab + '" onclick="UI.switchMenuTab(\'' + item.tab + '\')">' +
                '<div class="menu-drawer-icon">' + item.icon + '</div>' +
                '<div class="menu-drawer-label">' +
                  '<span class="menu-drawer-text">' + item.text + '</span>' +
                  '<span class="menu-drawer-badge">' + item.badge + '</span>' +
                '</div>' +
                '<div class="menu-drawer-arrow">›</div>' +
              '</button>';
            }).join('') +
            // Divider
            '<div class="menu-drawer-divider"></div>' +
            // Theme toggle
            '<button class="menu-drawer-item" onclick="UI.toggleTheme(); UI.closeMenu();">' +
              '<div class="menu-drawer-icon" id="menu-theme-icon">🌙</div>' +
              '<div class="menu-drawer-label">' +
                '<span class="menu-drawer-text">Dark Mode</span>' +
                '<span class="menu-drawer-badge">Ganti tema</span>' +
              '</div>' +
              '<div class="menu-drawer-arrow">›</div>' +
            '</button>' +
            // Sound toggle
            '<button class="menu-drawer-item" onclick="UI.toggleSound(); UI.closeMenu();">' +
              '<div class="menu-drawer-icon" id="menu-sound-icon">🔊</div>' +
              '<div class="menu-drawer-label">' +
                '<span class="menu-drawer-text">Suara</span>' +
                '<span class="menu-drawer-badge">ON/OFF</span>' +
              '</div>' +
              '<div class="menu-drawer-arrow">›</div>' +
            '</button>' +
          '</div>' +
          // Footer
          '<div class="menu-drawer-footer">' +
            '<button class="menu-drawer-footer-btn" onclick="UI.closeMenu()">✕ Tutup Menu</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    var div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div.firstChild);

    // Update user info
    setTimeout(updateUserInfo, 100);
  }

  function updateUserInfo() {
    var nameEl = document.getElementById('menu-user-name');
    var statusEl = document.getElementById('menu-user-status');
    if (!nameEl) return;

    try {
      if (typeof Auth !== 'undefined') {
        nameEl.textContent = Auth.getName() || 'Guest';
        statusEl.textContent = Auth.isAnonymous() ? '👤 Mode Guest' : '✅ ' + (Auth.user.email || 'Logged in');
      }
    } catch (e) {}
  }

  function createMenuButton() {
    if (document.getElementById(BTN_ID)) return;

    // Cari header-inner
    var headerInner = document.querySelector('.header-inner');
    if (!headerInner) {
      console.warn('[Menu] .header-inner tidak ditemukan');
      return;
    }

    // Buat tombol hamburger
    var btn = document.createElement('button');
    btn.id = BTN_ID;
    btn.className = 'menu-btn';
    btn.setAttribute('aria-label', 'Menu');
    btn.innerHTML = '<span class="line"></span><span class="line"></span><span class="line"></span>';
    btn.onclick = function() { UI.toggleMenu(); };

    // Insert sebagai elemen pertama di header-inner
    headerInner.insertBefore(btn, headerInner.firstChild);
  }

  /* ========== PUBLIC API ========== */
  window.UI = window.UI || {};

  UI.toggleMenu = function() {
    var drawer = document.getElementById(DRAWER_ID);
    var btn = document.getElementById(BTN_ID);
    if (!drawer) return;

    var isOpen = drawer.classList.contains('open');
    if (isOpen) {
      UI.closeMenu();
    } else {
      updateUserInfo();
      drawer.classList.add('open');
      if (btn) btn.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (UI.haptic) UI.haptic(10);
      if (UI.sound) UI.sound('click');
    }
  };

  UI.closeMenu = function() {
    var drawer = document.getElementById(DRAWER_ID);
    var btn = document.getElementById(BTN_ID);
    if (drawer) drawer.classList.remove('open');
    if (btn) btn.classList.remove('active');
    document.body.style.overflow = '';
  };

  UI.switchMenuTab = function(tab) {
    UI.closeMenu();
    if (typeof App !== 'undefined' && App.switchTab) {
      App.switchTab(tab);
    }
    setTimeout(function() {
      UI.updateMenuActive();
    }, 100);
    if (UI.haptic) UI.haptic(15);
    if (UI.sound) UI.sound('click');
  };

  UI.updateMenuActive = function() {
    var current = 'learn';
    try {
      if (typeof App !== 'undefined' && App.currentTab) {
        current = App.currentTab;
      }
    } catch (e) {}

    document.querySelectorAll('.menu-drawer-item[data-tab]').forEach(function(item) {
      var isActive = item.getAttribute('data-tab') === current;
      item.classList.toggle('active', isActive);
    });
  };

  UI.updateThemeIcon = function() {
    var icon = document.getElementById('menu-theme-icon');
    if (!icon) return;
    var theme = localStorage.getItem('yadstore_theme') || 'light';
    icon.textContent = theme === 'light' ? '🌙' : '☀️';
  };

  UI.updateSoundIcon = function() {
    var icon = document.getElementById('menu-sound-icon');
    if (!icon) return;
    var enabled = localStorage.getItem('yadstore_sound') !== 'off';
    icon.textContent = enabled ? '🔊' : '🔇';
  };

  /* ========== INIT ========== */
  function init() {
    createDrawer();
    createMenuButton();
    UI.updateMenuActive();
    UI.updateThemeIcon();
    UI.updateSoundIcon();

    // Update icon saat theme/sound berubah
    var origToggleTheme = UI.toggleTheme;
    UI.toggleTheme = function() {
      if (origToggleTheme) origToggleTheme();
      setTimeout(UI.updateThemeIcon, 100);
    };

    var origToggleSound = UI.toggleSound;
    UI.toggleSound = function() {
      if (origToggleSound) origToggleSound();
      setTimeout(UI.updateSoundIcon, 100);
    };

    // Sync active tab saat App.switchTab dipanggil
    if (typeof App !== 'undefined' && App.switchTab) {
      var origSwitch = App.switchTab;
      App.switchTab = function(tab) {
        origSwitch.call(App, tab);
        setTimeout(UI.updateMenuActive, 100);
      };
    }

    // ESC untuk tutup
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') UI.closeMenu();
    });

    console.log('[HeaderMenu] Loaded');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 500);
  }
})();
