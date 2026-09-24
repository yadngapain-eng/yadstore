// ============================
// SIDEBAR KIRI — Menu lengkap semua fitur
// ============================

const SIDEBAR_ITEMS = [
  { group:'UTAMA', items:[
    { href:'index.html', icon:'🏠', label:'Home' },
    { href:'learn.html', icon:'📚', label:'Learn Code' },
    { href:'store.html', icon:'🎮', label:'Game Store' },
    { href:'article.html', icon:'📖', label:'Article & Novel' },
    { href:'credit.html', icon:'💝', label:'Credit' },
  ]},
  { group:'LEARN CODE', items:[
    { href:'learn.html?t=java', icon:'☕', label:'Java Dasar' },
    { href:'learn.html?t=android', icon:'📱', label:'Android' },
    { href:'learn.html?t=layout', icon:'🎨', label:'Layout XML' },
    { href:'learn.html?t=build', icon:'🔨', label:'Build APK' },
    { href:'learn.html?t=webview', icon:'🌐', label:'WebView' },
    { href:'learn.html?t=security', icon:'🔐', label:'Keamanan' },
    { href:'learn.html?t=kotlin', icon:'🟣', label:'Kotlin' },
    { href:'learn.html?t=git', icon:'🐙', label:'Version Control' },
    { href:'learn.html?t=ui', icon:'✨', label:'UI/UX Design' },
    { href:'learn.html?t=perf', icon:'🚀', label:'Optimasi Performa' },
  ]},
  { group:'STORE', items:[
    { href:'store.html?g=Action', icon:'⚔️', label:'Action' },
    { href:'store.html?g=Adventure', icon:'🗺️', label:'Adventure' },
    { href:'store.html?g=RPG', icon:'🔮', label:'RPG' },
    { href:'store.html?g=Strategy', icon:'🏰', label:'Strategy' },
    { href:'store.html?g=Sports', icon:'⚽', label:'Sports' },
    { href:'store.html?g=Racing', icon:'🏎️', label:'Racing' },
    { href:'store.html?g=Puzzle', icon:'🧩', label:'Puzzle' },
    { href:'store.html?g=Simulation', icon:'🌾', label:'Simulation' },
    { href:'store.html?g=Horror', icon:'🧟', label:'Horror' },
    { href:'store.html?g=Item', icon:'💎', label:'Item & DLC' },
  ]},
  { group:'ARTICLE', items:[
    { href:'article.html?t=article', icon:'📝', label:'Article' },
    { href:'article.html?t=berita', icon:'📰', label:'Berita' },
    { href:'article.html?t=novel', icon:'📕', label:'Novel' },
  ]},
  { group:'ADMIN', items:[
    { href:'admin.html', icon:'⚙️', label:'Admin Panel' },
  ]}
];

function renderSidebar(){
  const html = `
    <div class="sidebar-overlay" onclick="closeSidebar()"></div>
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-head">
        <span class="logo-svg">
          <svg viewBox="0 0 40 40" width="36" height="36">
            <defs><linearGradient id="lgs" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stop-color="#00e5ff"/><stop offset="100%" stop-color="#7c4dff"/>
            </linearGradient></defs>
            <rect width="40" height="40" rx="11" fill="url(#lgs)"/>
            <text x="20" y="28" font-family="Arial" font-size="22" font-weight="900" fill="#fff" text-anchor="middle">Y</text>
          </svg>
        </span>
        <span class="brand-name">YadStore</span>
        <button class="sidebar-close" onclick="closeSidebar()">✕</button>
      </div>
      <nav class="sidebar-nav">
        ${SIDEBAR_ITEMS.map(grp => `
          <div class="sidebar-group">
            <div class="sidebar-group-title">${grp.group}</div>
            ${grp.items.map(it => `
              <a href="${it.href}" class="sidebar-link">
                <span class="sidebar-icon">${it.icon}</span>
                <span>${it.label}</span>
              </a>
            `).join('')}
          </div>
        `).join('')}
      </nav>
      <div class="sidebar-foot">
        <p>© 2026 YadStore</p>
        <p style="font-size:11px;opacity:.6">Dibuat oleh Ysdev</p>
      </div>
    </aside>
  `;
  document.body.insertAdjacentHTML('afterbegin', html);
}

function openSidebar(){
  document.getElementById('sidebar').classList.add('open');
  document.querySelector('.sidebar-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeSidebar(){
  document.getElementById('sidebar').classList.remove('open');
  document.querySelector('.sidebar-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// Auto inject hamburger button ke navbar
function injectHamburger(){
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const btn = document.createElement('button');
  btn.className = 'sidebar-toggle';
  btn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
  btn.onclick = openSidebar;
  navbar.insertBefore(btn, navbar.firstChild);

  // Ganti nav-toggle lama dengan yang baru kalau ada
  const old = navbar.querySelector('.nav-toggle');
  if (old) old.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  injectHamburger();

  // Handle query param untuk auto-filter
  const params = new URLSearchParams(location.search);
  const t = params.get('t');
  const g = params.get('g');
  setTimeout(() => {
    if (g && document.getElementById('filterGenre')) {
      document.getElementById('filterGenre').value = g;
      if (typeof renderStore === 'function') renderStore();
    }
    if (t && document.getElementById('filterType')) {
      document.getElementById('filterType').value = t;
      if (typeof renderArticle === 'function') renderArticle();
    }
  }, 200);
});
