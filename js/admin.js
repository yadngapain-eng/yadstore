/* ============================================
   YADSTORE — ADMIN PANEL LOGIC
   ============================================
   ⚠️ Ini frontend-only. Untuk produksi,
   pindahkan auth ke backend.
   ============================================ */

// ---------- CONFIG ----------
const ADMIN_USER = 'YADI';
const ADMIN_PASS = 'YADIGANTENG2026';
const SESSION_KEY = 'yadstore_admin_session';
const SESSION_TTL = 60 * 60 * 1000; // 1 jam

// ---------- TOAST ----------
function toast(msg, type) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast show' + (type ? ' ' + type : '');
  clearTimeout(t._timer);
  t._timer = setTimeout(function() { t.className = 'toast'; }, 3000);
}

// ---------- AUTH ----------
function doLogin() {
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value;
  const err = document.getElementById('loginError');

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ user: user, at: Date.now() }));
    err.textContent = '';
    showAdminApp();
    toast('✅ Login berhasil!', 'success');
  } else {
    err.textContent = '❌ Username atau password salah.';
    toast('❌ Login gagal', 'error');
  }
}

function doLogout() {
  if (!confirm('Yakin mau keluar dari admin panel?')) return;
  sessionStorage.removeItem(SESSION_KEY);
  location.reload();
}

function checkSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw);
    if (Date.now() - session.at > SESSION_TTL) {
      sessionStorage.removeItem(SESSION_KEY);
      return false;
    }
    return true;
  } catch (e) { return false; }
}

function showAdminApp() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('adminApp').classList.add('active');
  document.getElementById('adminWelcome').textContent = 'Halo, ' + ADMIN_USER;
  if (window.innerWidth < 900) {
    document.getElementById('menuBtn').style.display = 'inline-flex';
  }
  refreshDashboard();
  renderArticlesTable();
  renderProductsTable();
  renderUsersTable();
  renderAnalytics();
}

// Auto-logout check tiap 5 menit
setInterval(function() {
  if (document.getElementById('adminApp').classList.contains('active') && !checkSession()) {
    toast('⏰ Sesi berakhir, silakan login ulang', 'error');
    setTimeout(function() { location.reload(); }, 1500);
  }
}, 5 * 60 * 1000);

// Enter untuk login
document.addEventListener('DOMContentLoaded', function() {
  ['loginUser', 'loginPass'].forEach(function(id) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') doLogin();
    });
  });

  if (checkSession()) showAdminApp();
  else document.getElementById('loginScreen').classList.remove('hidden');

  // Init date default
  const artDate = document.getElementById('artDate');
  if (artDate) artDate.value = new Date().toISOString().split('T')[0];

  // Init calc
  initCalc();
  initFilters();
});

// ---------- NAV ----------
function switchSection(name) {
  document.querySelectorAll('.admin-menu-item').forEach(function(b) {
    b.classList.toggle('active', b.dataset.section === name);
  });
  document.querySelectorAll('.admin-section').forEach(function(s) {
    s.classList.toggle('active', s.dataset.section === name);
  });
  if (window.innerWidth < 900) {
    document.getElementById('adminSidebar').classList.remove('open');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.admin-menu-item').forEach(function(btn) {
    btn.addEventListener('click', function() { switchSection(btn.dataset.section); });
  });
});

function toggleSidebar() {
  document.getElementById('adminSidebar').classList.toggle('open');
}

// ---------- MODALS ----------
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

document.querySelectorAll('.admin-modal').forEach(function(m) {
  m.addEventListener('click', function(e) {
    if (e.target === m) m.classList.remove('open');
  });
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.admin-modal.open').forEach(function(m) { m.classList.remove('open'); });
  }
});

// ============================================
// DATA STORAGE (localStorage)
// ============================================
const STORE_KEY = 'yadstore_admin_data';

function getStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return getDefaultStore();
}

function saveStore(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

function getDefaultStore() {
  return {
    articles: [
      { id: 'html-pertama', title: 'Membuat Halaman HTML Pertamamu', category: 'tutorial', author: 'Ysdev', date: '2026-09-01', readTime: 8, cover: '📄', excerpt: 'Panduan langkah demi langkah...', status: 'live' },
      { id: 'css-cantik', title: 'Membuat Website Cantik dengan CSS', category: 'tutorial', author: 'Ysdev', date: '2026-09-03', readTime: 10, cover: '🎨', excerpt: 'CSS adalah senjata rahasia...', status: 'live' },
      { id: 'ai-masa-depan', title: 'AI dan Masa Depan Coding', category: 'berita', author: 'Ysdev', date: '2026-09-11', readTime: 7, cover: '🤖', excerpt: 'AI seperti ChatGPT...', status: 'live' },
      { id: 'jangan-takut-error', title: 'Jangan Takut Error', category: 'opini', author: 'Ysdev', date: '2026-09-19', readTime: 5, cover: '💭', excerpt: 'Error bukan tanda kegagalan...', status: 'live' },
      { id: 'novel-kode-pertama', title: 'Kode Pertama — Bab 1', category: 'novel', author: 'Ysdev', date: '2026-09-26', readTime: 12, cover: '📖', excerpt: 'Kisah seorang pemuda desa...', status: 'live' },
    ],
    products: [
      { id: 'p1', name: 'Quiz Master', icon: '🎯', type: 'game', buyPrice: 0, markup: 0, ops: 0, sellPrice: 0, stock: 999, desc: 'Uji pengetahuan coding', featured: true, active: true },
      { id: 'p2', name: 'Code Puzzle', icon: '🧩', type: 'game', buyPrice: 0, markup: 0, ops: 0, sellPrice: 0, stock: 999, desc: 'Susun kode yang benar', featured: false, active: true },
      { id: 'p3', name: 'Bug Hunter', icon: '⚔️', type: 'game', buyPrice: 0, markup: 0, ops: 0, sellPrice: 0, stock: 999, desc: 'Tangkap bug di kode', featured: false, active: true },
      { id: 'p4', name: 'Skin Emas', icon: '✨', type: 'item', buyPrice: 50000, markup: 30, ops: 2000, sellPrice: 67000, stock: 25, desc: 'Skin premium untuk karakter', featured: true, active: true },
      { id: 'p5', name: 'Voucher 100K', icon: '🎫', type: 'voucher', buyPrice: 90000, markup: 15, ops: 1000, sellPrice: 104500, stock: 50, desc: 'Voucher belanja 100K', featured: false, active: true },
    ],
    users: [
      { id: 'u1', name: 'Andi Pratama', email: 'andi@mail.com', role: 'user', status: 'active', joined: '2026-08-01' },
      { id: 'u2', name: 'Sinta Dewi', email: 'sinta@mail.com', role: 'user', status: 'active', joined: '2026-08-15' },
      { id: 'u3', name: 'Budi Santoso', email: 'budi@mail.com', role: 'moderator', status: 'active', joined: '2026-07-20' },
      { id: 'u4', name: 'Rina Marlina', email: 'rina@mail.com', role: 'user', status: 'active', joined: '2026-09-01' },
      { id: 'u5', name: 'Dimas Anggara', email: 'dimas@mail.com', role: 'user', status: 'banned', joined: '2026-09-10' },
    ],
    settings: {
      siteName: 'YadStore',
      tagline: 'Belajar coding, game store, article',
      email: 'admin@yadstore.com',
      year: '2026',
      maintenance: false,
      comments: true,
      analytics: true,
      autoBackup: true,
    },
    activity: [],
  };
}

// Activity log
function logActivity(text, icon) {
  const store = getStore();
  store.activity = store.activity || [];
  store.activity.unshift({
    text: text,
    icon: icon || '📌',
    time: new Date().toISOString(),
  });
  store.activity = store.activity.slice(0, 20);
  saveStore(store);
}

// ============================================
// DASHBOARD
// ============================================
function refreshDashboard() {
  const store = getStore();
  const stats = [
    { icon: '📰', num: store.articles.length, label: 'Artikel', trend: '+2 minggu ini' },
    { icon: '🎮', num: store.products.length, label: 'Produk', trend: '+1 minggu ini' },
    { icon: '👥', num: store.users.length, label: 'Users', trend: '+3 minggu ini' },
    { icon: '💰', num: 'Rp ' + formatNumber(totalRevenue()), label: 'Est. Revenue', trend: '+23%' },
  ];
  const el = document.getElementById('dashboardStats');
  el.innerHTML = stats.map(function(s) {
    return '<div class="admin-stat">' +
      '<div class="admin-stat-icon">' + s.icon + '</div>' +
      '<span class="admin-stat-num">' + s.num + '</span>' +
      '<span class="admin-stat-label">' + s.label + '</span>' +
      '<div class="admin-stat-trend">↑ ' + s.trend + '</div>' +
    '</div>';
  }).join('');

  // Activity
  const actEl = document.getElementById('dashboardActivity');
  const acts = store.activity && store.activity.length > 0 ? store.activity : [
    { text: 'Sistem diinisialisasi', icon: '🚀', time: new Date().toISOString() },
  ];
  actEl.innerHTML = acts.slice(0, 8).map(function(a) {
    const time = new Date(a.time);
    const ago = timeAgo(time);
    return '<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid rgba(42,49,85,.4)">' +
      '<div style="font-size:24px">' + a.icon + '</div>' +
      '<div style="flex:1"><div style="font-weight:700;font-size:14px">' + a.text + '</div>' +
      '<div style="font-size:11px;color:var(--text-muted);margin-top:2px">' + ago + '</div></div>' +
    '</div>';
  }).join('');

  // Top articles placeholder
  const topEl = document.getElementById('topArticles');
  if (topEl) {
    topEl.innerHTML = store.articles.slice(0, 5).map(function(a, i) {
      const views = 1200 - (i * 180) + Math.floor(Math.random() * 100);
      return '<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid rgba(42,49,85,.4)">' +
        '<div style="font-size:20px;font-weight:900;color:var(--primary);width:32px">#' + (i + 1) + '</div>' +
        '<div style="flex:1"><div style="font-weight:700;font-size:14px">' + a.cover + ' ' + a.title + '</div>' +
        '<div style="font-size:11px;color:var(--text-muted)">' + views.toLocaleString() + ' views</div></div>' +
      '</div>';
    }).join('');
  }
}

function totalRevenue() {
  const store = getStore();
  return store.products.reduce(function(sum, p) {
    const profit = (p.sellPrice || 0) - (p.buyPrice || 0) - (p.ops || 0);
    return sum + profit * Math.min(p.stock || 0, 100);
  }, 0);
}

function formatNumber(n) {
  return Math.round(n).toLocaleString('id-ID');
}

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'baru saja';
  if (seconds < 3600) return Math.floor(seconds / 60) + ' menit lalu';
  if (seconds < 86400) return Math.floor(seconds / 3600) + ' jam lalu';
  return Math.floor(seconds / 86400) + ' hari lalu';
}

// ============================================
// ARTICLES CRUD
// ============================================
function renderArticlesTable() {
  const store = getStore();
  const search = (document.getElementById('articleSearchInput')?.value || '').toLowerCase();
  const cat = document.getElementById('articleCatFilter')?.value || 'all';

  const filtered = store.articles.filter(function(a) {
    if (cat !== 'all' && a.category !== cat) return false;
    if (search && a.title.toLowerCase().indexOf(search) === -1 && a.author.toLowerCase().indexOf(search) === -1) return false;
    return true;
  });

  const tbody = document.getElementById('articleTableBody');
  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7"><div class="admin-empty"><div class="admin-empty-icon">📭</div><p>Tidak ada artikel.</p></div></td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(function(a) {
    const statusCls = a.status === 'draft' ? 'status-draft' : 'status-live';
    const statusText = a.status === 'draft' ? 'Draft' : 'Live';
    return '<tr>' +
      '<td style="font-size:24px">' + a.cover + '</td>' +
      '<td><b>' + a.title + '</b><br><span style="font-size:12px;color:var(--text-muted)">' + a.excerpt.substring(0, 50) + '...</span></td>' +
      '<td><span class="article-cat">' + a.category + '</span></td>' +
      '<td>' + a.author + '</td>' +
      '<td>' + a.date + '</td>' +
      '<td><span class="admin-badge-status ' + statusCls + '">' + statusText + '</span></td>' +
      '<td><div class="actions">' +
        '<button class="admin-btn secondary small" onclick="editArticle(\'' + a.id + '\')">✏️</button>' +
        '<button class="admin-btn danger small" onclick="deleteArticle(\'' + a.id + '\')">🗑️</button>' +
      '</div></td>' +
    '</tr>';
  }).join('');
}

function openArticleModal() {
  document.getElementById('articleModalTitle').textContent = '📰 Tambah Artikel';
  document.getElementById('artId').value = '';
  document.getElementById('artTitle').value = '';
  document.getElementById('artCover').value = '📄';
  document.getElementById('artCategory').value = 'tutorial';
  document.getElementById('artAuthor').value = 'Ysdev';
  document.getElementById('artDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('artReadTime').value = '5';
  document.getElementById('artExcerpt').value = '';
  document.getElementById('artContent').value = '';
  document.getElementById('artDraft').checked = false;
  openModal('articleModal');
}

function editArticle(id) {
  const store = getStore();
  const a = store.articles.find(function(x) { return x.id === id; });
  if (!a) return;
  document.getElementById('articleModalTitle').textContent = '✏️ Edit Artikel';
  document.getElementById('artId').value = a.id;
  document.getElementById('artTitle').value = a.title;
  document.getElementById('artCover').value = a.cover;
  document.getElementById('artCategory').value = a.category;
  document.getElementById('artAuthor').value = a.author;
  document.getElementById('artDate').value = a.date;
  document.getElementById('artReadTime').value = a.readTime;
  document.getElementById('artExcerpt').value = a.excerpt;
  document.getElementById('artContent').value = a.content || '';
  document.getElementById('artDraft').checked = a.status === 'draft';
  openModal('articleModal');
}

function saveArticle(e) {
  e.preventDefault();
  const store = getStore();
  const id = document.getElementById('artId').value;
  const data = {
    title: document.getElementById('artTitle').value,
    cover: document.getElementById('artCover').value,
    category: document.getElementById('artCategory').value,
    author: document.getElementById('artAuthor').value,
    date: document.getElementById('artDate').value,
    readTime: parseInt(document.getElementById('artReadTime').value),
    excerpt: document.getElementById('artExcerpt').value,
    content: document.getElementById('artContent').value,
    status: document.getElementById('artDraft').checked ? 'draft' : 'live',
  };

  if (id) {
    const idx = store.articles.findIndex(function(x) { return x.id === id; });
    store.articles[idx] = Object.assign(store.articles[idx], data);
    logActivity('Edit artikel: ' + data.title, '✏️');
    toast('✅ Artikel diupdate', 'success');
  } else {
    data.id = 'art-' + Date.now();
    store.articles.unshift(data);
    logActivity('Tambah artikel: ' + data.title, '➕');
    toast('✅ Artikel ditambahkan', 'success');
  }

  saveStore(store);
  closeModal('articleModal');
  renderArticlesTable();
  refreshDashboard();
}

function deleteArticle(id) {
  if (!confirm('Yakin hapus artikel ini?')) return;
  const store = getStore();
  const a = store.articles.find(function(x) { return x.id === id; });
  store.articles = store.articles.filter(function(x) { return x.id !== id; });
  logActivity('Hapus artikel: ' + (a ? a.title : id), '🗑️');
  saveStore(store);
  renderArticlesTable();
  refreshDashboard();
  toast('🗑️ Artikel dihapus', 'success');
}

// ============================================
// PRODUCTS CRUD
// ============================================
function renderProductsTable() {
  const store = getStore();
  const search = (document.getElementById('productSearchInput')?.value || '').toLowerCase();
  const type = document.getElementById('productTypeFilter')?.value || 'all';

  const filtered = store.products.filter(function(p) {
    if (type !== 'all' && p.type !== type) return false;
    if (search && p.name.toLowerCase().indexOf(search) === -1) return false;
    return true;
  });

  const tbody = document.getElementById('productTableBody');
  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9"><div class="admin-empty"><div class="admin-empty-icon">📭</div><p>Tidak ada produk.</p></div></td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(function(p) {
    const statusCls = p.active ? 'status-live' : 'status-draft';
    const statusText = p.active ? 'Aktif' : 'Nonaktif';
    const featuredBadge = p.featured ? ' <span class="admin-badge-status status-featured">⭐</span>' : '';
    return '<tr>' +
      '<td style="font-size:24px">' + p.icon + '</td>' +
      '<td><b>' + p.name + '</b>' + featuredBadge + '</td>' +
      '<td><span class="article-cat">' + p.type + '</span></td>' +
      '<td>Rp ' + formatNumber(p.buyPrice || 0) + '</td>' +
      '<td>' + (p.markup || 0) + '%</td>' +
      '<td><b style="color:var(--primary)">Rp ' + formatNumber(p.sellPrice || 0) + '</b></td>' +
      '<td>' + (p.stock || 0) + '</td>' +
      '<td><span class="admin-badge-status ' + statusCls + '">' + statusText + '</span></td>' +
      '<td><div class="actions">' +
        '<button class="admin-btn secondary small" onclick="editProduct(\'' + p.id + '\')">✏️</button>' +
        '<button class="admin-btn danger small" onclick="deleteProduct(\'' + p.id + '\')">🗑️</button>' +
      '</div></td>' +
    '</tr>';
  }).join('');
}

function openProductModal() {
  document.getElementById('productModalTitle').textContent = '🎮 Tambah Produk';
  document.getElementById('prodId').value = '';
  document.getElementById('prodName').value = '';
  document.getElementById('prodIcon').value = '🎮';
  document.getElementById('prodType').value = 'game';
  document.getElementById('prodStock').value = '10';
  document.getElementById('prodBuyPrice').value = '50000';
  document.getElementById('prodMarkup').value = '30';
  document.getElementById('prodOps').value = '2000';
  document.getElementById('prodDesc').value = '';
  document.getElementById('prodFeatured').checked = false;
  document.getElementById('prodActive').checked = true;
  calcProductPrice();
  openModal('productModal');
}

function editProduct(id) {
  const store = getStore();
  const p = store.products.find(function(x) { return x.id === id; });
  if (!p) return;
  document.getElementById('productModalTitle').textContent = '✏️ Edit Produk';
  document.getElementById('prodId').value = p.id;
  document.getElementById('prodName').value = p.name;
  document.getElementById('prodIcon').value = p.icon;
  document.getElementById('prodType').value = p.type;
  document.getElementById('prodStock').value = p.stock;
  document.getElementById('prodBuyPrice').value = p.buyPrice || 0;
  document.getElementById('prodMarkup').value = p.markup || 0;
  document.getElementById('prodOps').value = p.ops || 0;
  document.getElementById('prodDesc').value = p.desc || '';
  document.getElementById('prodFeatured').checked = !!p.featured;
  document.getElementById('prodActive').checked = p.active !== false;
  calcProductPrice();
  openModal('productModal');
}

function calcProductPrice() {
  const buy = parseFloat(document.getElementById('prodBuyPrice').value) || 0;
  const markup = parseFloat(document.getElementById('prodMarkup').value) || 0;
  const ops = parseFloat(document.getElementById('prodOps').value) || 0;
  const stock = parseInt(document.getElementById('prodStock').value) || 0;

  const baseWithMarkup = buy * (1 + markup / 100);
  const sell = Math.ceil((baseWithMarkup + ops) / 1000) * 1000;
  const profit = sell - buy - ops;

  document.getElementById('prodSellPreview').textContent = 'Rp ' + formatNumber(sell);
  document.getElementById('prodProfitPreview').textContent = 'Rp ' + formatNumber(profit);
  document.getElementById('prodTotalProfit').textContent = 'Rp ' + formatNumber(profit * stock);
}

function saveProduct(e) {
  e.preventDefault();
  const store = getStore();
  const id = document.getElementById('prodId').value;
  const buy = parseFloat(document.getElementById('prodBuyPrice').value) || 0;
  const markup = parseFloat(document.getElementById('prodMarkup').value) || 0;
  const ops = parseFloat(document.getElementById('prodOps').value) || 0;
  const stock = parseInt(document.getElementById('prodStock').value) || 0;
  const sell = Math.ceil((buy * (1 + markup / 100) + ops) / 1000) * 1000;

  const data = {
    name: document.getElementById('prodName').value,
    icon: document.getElementById('prodIcon').value,
    type: document.getElementById('prodType').value,
    buyPrice: buy,
    markup: markup,
    ops: ops,
    sellPrice: sell,
    stock: stock,
    desc: document.getElementById('prodDesc').value,
    featured: document.getElementById('prodFeatured').checked,
    active: document.getElementById('prodActive').checked,
  };

  if (id) {
    const idx = store.products.findIndex(function(x) { return x.id === id; });
    store.products[idx] = Object.assign(store.products[idx], data);
    logActivity('Edit produk: ' + data.name, '✏️');
    toast('✅ Produk diupdate', 'success');
  } else {
    data.id = 'prod-' + Date.now();
    store.products.push(data);
    logActivity('Tambah produk: ' + data.name, '➕');
    toast('✅ Produk ditambahkan', 'success');
  }

  saveStore(store);
  closeModal('productModal');
  renderProductsTable();
  refreshDashboard();
}

function deleteProduct(id) {
  if (!confirm('Yakin hapus produk ini?')) return;
  const store = getStore();
  const p = store.products.find(function(x) { return x.id === id; });
  store.products = store.products.filter(function(x) { return x.id !== id; });
  logActivity('Hapus produk: ' + (p ? p.name : id), '🗑️');
  saveStore(store);
  renderProductsTable();
  refreshDashboard();
  toast('🗑️ Produk dihapus', 'success');
}

// ============================================
// USERS CRUD
// ============================================
function renderUsersTable() {
  const store = getStore();
  const search = (document.getElementById('userSearchInput')?.value || '').toLowerCase();

  const filtered = store.users.filter(function(u) {
    if (!search) return true;
    return u.name.toLowerCase().indexOf(search) !== -1 || u.email.toLowerCase().indexOf(search) !== -1;
  });

  const tbody = document.getElementById('userTableBody');
  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7"><div class="admin-empty"><div class="admin-empty-icon">📭</div><p>Tidak ada user.</p></div></td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(function(u) {
    const statusCls = u.status === 'banned' ? 'status-sold' : 'status-live';
    const statusText = u.status === 'banned' ? 'Banned' : 'Aktif';
    return '<tr>' +
      '<td><div class="admin-avatar">' + u.name.charAt(0) + '</div></td>' +
      '<td><b>' + u.name + '</b></td>' +
      '<td>' + u.email + '</td>' +
      '<td><span class="article-cat">' + u.role + '</span></td>' +
      '<td><span class="admin-badge-status ' + statusCls + '">' + statusText + '</span></td>' +
      '<td>' + u.joined + '</td>' +
      '<td><div class="actions">' +
        '<button class="admin-btn secondary small" onclick="editUser(\'' + u.id + '\')">✏️</button>' +
        '<button class="admin-btn danger small" onclick="deleteUser(\'' + u.id + '\')">🗑️</button>' +
      '</div></td>' +
    '</tr>';
  }).join('');
}

function openUserModal() {
  document.getElementById('userModalTitle').textContent = '👤 Tambah User';
  document.getElementById('userId').value = '';
  document.getElementById('userName').value = '';
  document.getElementById('userEmail').value = '';
  document.getElementById('userRole').value = 'user';
  document.getElementById('userStatus').value = 'active';
  openModal('userModal');
}

function editUser(id) {
  const store = getStore();
  const u = store.users.find(function(x) { return x.id === id; });
  if (!u) return;
  document.getElementById('userModalTitle').textContent = '✏️ Edit User';
  document.getElementById('userId').value = u.id;
  document.getElementById('userName').value = u.name;
  document.getElementById('userEmail').value = u.email;
  document.getElementById('userRole').value = u.role;
  document.getElementById('userStatus').value = u.status;
  openModal('userModal');
}

function saveUser(e) {
  e.preventDefault();
  const store = getStore();
  const id = document.getElementById('userId').value;
  const data = {
    name: document.getElementById('userName').value,
    email: document.getElementById('userEmail').value,
    role: document.getElementById('userRole').value,
    status: document.getElementById('userStatus').value,
  };

  if (id) {
    const idx = store.users.findIndex(function(x) { return x.id === id; });
    store.users[idx] = Object.assign(store.users[idx], data);
    logActivity('Edit user: ' + data.name, '✏️');
    toast('✅ User diupdate', 'success');
  } else {
    data.id = 'u-' + Date.now();
    data.joined = new Date().toISOString().split('T')[0];
    store.users.push(data);
    logActivity('Tambah user: ' + data.name, '➕');
    toast('✅ User ditambahkan', 'success');
  }

  saveStore(store);
  closeModal('userModal');
  renderUsersTable();
  refreshDashboard();
}

function deleteUser(id) {
  if (!confirm('Yakin hapus user ini?')) return;
  const store = getStore();
  const u = store.users.find(function(x) { return x.id === id; });
  store.users = store.users.filter(function(x) { return x.id !== id; });
  logActivity('Hapus user: ' + (u ? u.name : id), '🗑️');
  saveStore(store);
  renderUsersTable();
  refreshDashboard();
  toast('🗑️ User dihapus', 'success');
}

// ============================================
// PRICING CALCULATOR
// ============================================
function initCalc() {
  ['calcBuy', 'calcMarkup', 'calcOps'].forEach(function(id) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateCalc);
  });
  updateCalc();
}

function updateCalc() {
  const buy = parseFloat(document.getElementById('calcBuy')?.value) || 0;
  const markup = parseFloat(document.getElementById('calcMarkup')?.value) || 0;
  const ops = parseFloat(document.getElementById('calcOps')?.value) || 0;

  const sell = Math.ceil((buy * (1 + markup / 100) + ops) / 1000) * 1000;
  const profit = sell - buy - ops;
  const margin = sell > 0 ? (profit / sell) * 100 : 0;

  document.getElementById('calcSell').textContent = 'Rp ' + formatNumber(sell);
  document.getElementById('calcProfit').textContent = 'Rp ' + formatNumber(profit);
  document.getElementById('calcMargin').textContent = margin.toFixed(1) + '%';
}

function quickMarkup(pct) {
  document.getElementById('calcMarkup').value = pct;
  updateCalc();
  toast('📊 Markup ' + pct + '% diterapkan', 'success');
}

// ============================================
// ANALYTICS
// ============================================
function renderAnalytics() {
  const views = 15000 + Math.floor(Math.random() * 5000);
  const users = 800 + Math.floor(Math.random() * 400);
  document.getElementById('anViews').textContent = views.toLocaleString('id-ID');
  document.getElementById('anUsers').textContent = users.toLocaleString('id-ID');
  document.getElementById('anRevenue').textContent = 'Rp ' + formatNumber(totalRevenue());
}

// ============================================
// SETTINGS
// ============================================
function saveSettings() {
  const store = getStore();
  store.settings = {
    siteName: document.getElementById('setSiteName').value,
    tagline: document.getElementById('setTagline').value,
    email: document.getElementById('setEmail').value,
    year: document.getElementById('setYear').value,
    maintenance: document.getElementById('setMaintenance').checked,
    comments: document.getElementById('setComments').checked,
    analytics: document.getElementById('setAnalytics').checked,
    autoBackup: document.getElementById('setAutoBackup').checked,
  };
  saveStore(store);
  logActivity('Update settings', '⚙️');
  toast('✅ Settings disimpan', 'success');
}

// ============================================
// EXPORT / IMPORT
// ============================================
function exportData() {
  const store = getStore();
  const blob = new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'yadstore-backup-' + new Date().toISOString().split('T')[0] + '.json';
  a.click();
  URL.revokeObjectURL(url);
  toast('💾 Data diexport', 'success');
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    try {
      const data = JSON.parse(ev.target.result);
      if (!data.articles || !data.products) throw new Error('Format tidak valid');
      if (!confirm('Yakin import? Data lama akan ditimpa.')) return;
      saveStore(data);
      logActivity('Import data dari file', '📤');
      toast('✅ Data diimport', 'success');
      setTimeout(function() { location.reload(); }, 1000);
    } catch (err) {
      toast('❌ File tidak valid: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
}

function resetData() {
  if (!confirm('⚠️ Yakin reset ke data default? Semua perubahan akan hilang!')) return;
  if (!confirm('Konfirmasi sekali lagi. Ini tidak bisa dibatalkan.')) return;
  localStorage.removeItem(STORE_KEY);
  toast('🗑️ Data direset', 'success');
  setTimeout(function() { location.reload(); }, 800);
}

// ============================================
// FILTER INIT
// ============================================
function initFilters() {
  const artSearch = document.getElementById('articleSearchInput');
  const artCat = document.getElementById('articleCatFilter');
  if (artSearch) artSearch.addEventListener('input', renderArticlesTable);
  if (artCat) artCat.addEventListener('change', renderArticlesTable);

  const prodSearch = document.getElementById('productSearchInput');
  const prodType = document.getElementById('productTypeFilter');
  if (prodSearch) prodSearch.addEventListener('input', renderProductsTable);
  if (prodType) prodType.addEventListener('change', renderProductsTable);

  const userSearch = document.getElementById('userSearchInput');
  if (userSearch) userSearch.addEventListener('input', renderUsersTable);
}
