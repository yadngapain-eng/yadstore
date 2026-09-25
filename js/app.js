/* ============================================
   YADSTORE — app.js
   ============================================ */

// ---------- TOAST ----------
function showToast(msg, type) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast show' + (type ? ' ' + type : '');
  clearTimeout(t._timer);
  t._timer = setTimeout(function() { t.className = 'toast'; }, 3000);
}

// ---------- LIVE COUNT ----------
function initLiveCount() {
  const el = document.getElementById('liveCount');
  if (!el) return;
  let n = Math.floor(Math.random() * 200) + 400;
  el.textContent = n;
  setInterval(function() {
    n += Math.floor(Math.random() * 11) - 5;
    if (n < 350) n = 350;
    if (n > 700) n = 700;
    el.textContent = n;
  }, 2500);
}

// ---------- STAT COUNTER ----------
function initCounters() {
  document.querySelectorAll('.stat-num[data-count]').forEach(function(el) {
    const target = parseInt(el.dataset.count);
    let cur = 0;
    const step = Math.max(1, Math.floor(target / 60));
    const t = setInterval(function() {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(t); }
      el.textContent = cur + (target >= 1000 ? '+' : '');
    }, 25);
  });
}

// ---------- NAV ACTIVE ----------
function initNavActive() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function(a) {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
    else a.classList.remove('active');
  });
}

// ---------- ADMIN LOGIN ----------
function adminLogin() {
  const u = prompt('Username:');
  if (u !== 'YADI') { showToast('❌ Username salah', 'error'); return; }
  const p = prompt('Password:');
  if (p !== 'YADIGANTENG2026') { showToast('❌ Password salah', 'error'); return; }
  showToast('✅ Login berhasil!', 'success');
  sessionStorage.setItem('admin', '1');
}

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', function() {
  initNavActive();
  initLiveCount();
  initCounters();

  document.querySelectorAll('.modal').forEach(function(m) {
    m.addEventListener('click', function(e) {
      if (e.target === m) m.classList.remove('open');
    });
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.open').forEach(function(m) { m.classList.remove('open'); });
    }
  });
});
