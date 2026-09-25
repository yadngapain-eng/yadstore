/* ============================================
   YADSTORE — Animation Helpers
   - Scroll reveal
   - Navbar scroll
   - Scroll progress
   - Ripple effect
   - Custom cursor
   - Typing effect
   - Counter animation (enhanced)
   ============================================ */

(function() {
  'use strict';

  // ===== SCROLL REVEAL =====
  function initScrollReveal() {
    const els = document.querySelectorAll('.reveal, .feature-card, .lesson-card, .gate-card, .article-card, .stat-item, .gate-stat');
    if (!els.length) return;

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    els.forEach(function(el, i) {
      if (!el.classList.contains('visible')) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity .8s ease ' + (i * 0.05) + 's, transform .8s ease ' + (i * 0.05) + 's';
        observer.observe(el);
      }
    });
  }

  // ===== NAVBAR SCROLL =====
  function initNavbarScroll() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
      const y = window.scrollY;
      if (y > 50) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
      lastScroll = y;
    }, { passive: true });
  }

  // ===== SCROLL PROGRESS =====
  function initScrollProgress() {
    if (document.getElementById('scrollProgress')) return;
    const bar = document.createElement('div');
    bar.id = 'scrollProgress';
    document.body.appendChild(bar);

    window.addEventListener('scroll', function() {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  // ===== RIPPLE EFFECT =====
  function initRipple() {
    document.addEventListener('click', function(e) {
      const target = e.target.closest('.btn, .gate-card, .article-card, .feature-card, .lesson-card');
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

      if (getComputedStyle(target).position === 'static') {
        target.style.position = 'relative';
      }
      target.style.overflow = 'hidden';
      target.appendChild(ripple);

      setTimeout(function() { ripple.remove(); }, 600);
    });
  }

  // ===== CUSTOM CURSOR (desktop) =====
  function initCustomCursor() {
    if (window.innerWidth < 1024) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const cursor = document.createElement('div');
    cursor.id = 'customCursor';
    document.body.appendChild(cursor);

    let mx = 0, my = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', function(e) {
      mx = e.clientX;
      my = e.clientY;
    });

    function animateCursor() {
      cx += (mx - cx) * 0.2;
      cy += (my - cy) * 0.2;
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.addEventListener('mouseover', function(e) {
      const t = e.target.closest('a, button, .btn, .gate-card, .article-card');
      if (t) cursor.classList.add('hover');
    });
    document.addEventListener('mouseout', function(e) {
      const t = e.target.closest('a, button, .btn, .gate-card, .article-card');
      if (t) cursor.classList.remove('hover');
    });
  }

  // ===== TYPING EFFECT =====
  function typeWriter(el, text, speed, callback) {
    let i = 0;
    el.textContent = '';
    el.classList.add('typing');

    function type() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        el.classList.remove('typing');
        if (callback) callback();
      }
    }
    type();
  }
  window.typeWriter = typeWriter;

  // ===== ENHANCED COUNTER =====
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-num[data-count], .gate-stat-num[data-count]');
    counters.forEach(function(el) {
      if (el.dataset.animated) return;
      const target = parseInt(el.dataset.count);
      const duration = 1500;
      const start = performance.now();
      const suffix = target >= 1000 ? '+' : (target >= 10 ? '+' : '');

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else {
          el.textContent = target + suffix;
          el.dataset.animated = '1';
        }
      }
      requestAnimationFrame(step);
    });
  }
  window.animateCounters = animateCounters;

  // ===== PARALLAX HERO =====
  function initParallax() {
    const hero = document.querySelector('.hero-content, .gate-hero');
    if (!hero || window.innerWidth < 768) return;
    window.addEventListener('scroll', function() {
      const y = window.scrollY;
      if (y < 600) {
        hero.style.transform = 'translateY(' + (y * 0.3) + 'px)';
        hero.style.opacity = Math.max(0, 1 - y / 500);
      }
    }, { passive: true });
  }

  // ===== LETTER FLOAT ANIMATION =====
  function initLetterFloat() {
    document.querySelectorAll('.gate-title, .hero-title').forEach(function(el) {
      if (el.dataset.letters) return;
      el.dataset.letters = '1';
      const text = el.textContent;
      el.textContent = '';
      text.split('').forEach(function(ch, i) {
        const span = document.createElement('span');
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        span.style.display = 'inline-block';
        span.style.animation = 'letterFloat ' + (2 + Math.random()) + 's ease-in-out ' + (i * 0.05) + 's infinite';
        el.appendChild(span);
      });
    });
  }

  // ===== INIT =====
  document.addEventListener('DOMContentLoaded', function() {
    initScrollReveal();
    initNavbarScroll();
    initScrollProgress();
    initRipple();
    initCustomCursor();
    initParallax();

    setTimeout(function() {
      animateCounters();
      initLetterFloat();
    }, 300);
  });

  // Re-run reveal saat halaman di-load lebih banyak konten
  window.refreshAnimations = function() {
    initScrollReveal();
    animateCounters();
  };
})();
