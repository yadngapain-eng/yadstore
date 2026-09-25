/* ============================================
   YADSTORE — ARTICLES RENDERER
   ============================================ */

let articleCategory = 'all';
let articleSearch = '';

// ---------- LIST PAGE ----------
function renderArticles(filter) {
  filter = filter || {};
  const listEl = document.getElementById('articleList');
  if (!listEl) return;

  const cat = filter.cat || articleCategory;
  const search = (filter.search !== undefined ? filter.search : articleSearch).toLowerCase();

  const filtered = (window.ARTICLES || []).filter(function(a) {
    if (cat !== 'all' && a.category !== cat) return false;
    if (search) {
      return a.title.toLowerCase().indexOf(search) !== -1 ||
             a.excerpt.toLowerCase().indexOf(search) !== -1 ||
             a.author.toLowerCase().indexOf(search) !== -1;
    }
    return true;
  });

  if (filtered.length === 0) {
    listEl.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted)">' +
      '<div style="font-size:64px;margin-bottom:16px;opacity:.5">📭</div>' +
      '<p>Tidak ada artikel yang cocok.</p></div>';
    return;
  }

  listEl.innerHTML = filtered.map(function(a) {
    const catInfo = (window.ARTICLE_CATEGORIES || {})[a.category] || { icon: '📄', label: a.category };
    return '<a href="article-reader.html?id=' + a.id + '" class="article-card" style="text-decoration:none;color:inherit">' +
      '<div class="article-cover">' + a.cover + '</div>' +
      '<div class="article-body">' +
        '<div class="article-meta">' +
          '<span class="article-cat">' + catInfo.icon + ' ' + catInfo.label + '</span>' +
          '<span class="article-dot">•</span>' +
          '<span>' + a.readTime + ' min baca</span>' +
        '</div>' +
        '<h3 class="article-title">' + a.title + '</h3>' +
        '<p class="article-excerpt">' + a.excerpt + '</p>' +
        '<div class="article-footer">' +
          '<span class="article-author">✍️ ' + a.author + '</span>' +
          '<span class="article-date">📅 ' + a.date + '</span>' +
        '</div>' +
      '</div>' +
    '</a>';
  }).join('');
}

function renderArticleCategories() {
  const el = document.getElementById('articleCats');
  if (!el) return;
  const cats = window.ARTICLE_CATEGORIES || {};
  el.innerHTML = Object.keys(cats).map(function(key) {
    const c = cats[key];
    return '<button class="article-cat' + (key === 'all' ? ' active' : '') + '" data-cat="' + key + '">' +
      c.icon + ' ' + c.label + '</button>';
  }).join('');
  el.querySelectorAll('.article-cat').forEach(function(btn) {
    btn.addEventListener('click', function() {
      el.querySelectorAll('.article-cat').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      articleCategory = btn.dataset.cat;
      renderArticles();
    });
  });
}

function initArticleSearch() {
  const input = document.getElementById('articleSearch');
  if (!input) return;
  let timer;
  input.addEventListener('input', function() {
    clearTimeout(timer);
    timer = setTimeout(function() {
      articleSearch = input.value.trim();
      renderArticles();
    }, 200);
  });
}

// ---------- READER PAGE ----------
function renderArticleReader() {
  const container = document.getElementById('readerContainer');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const article = (window.ARTICLES || []).find(function(a) { return a.id === id; });

  if (!article) {
    container.innerHTML = '<div style="text-align:center;padding:80px 20px">' +
      '<div style="font-size:72px;margin-bottom:20px">😕</div>' +
      '<h1>Artikel tidak ditemukan</h1>' +
      '<p style="color:var(--text-muted);margin:16px 0 32px">Artikel yang kamu cari mungkin sudah dihapus.</p>' +
      '<a href="article.html" class="btn btn-primary">← Kembali ke Daftar</a>' +
    '</div>';
    document.title = 'Artikel Tidak Ditemukan — YadStore';
    return;
  }

  document.title = article.title + ' — YadStore';
  const catInfo = (window.ARTICLE_CATEGORIES || {})[article.category] || { icon: '📄', label: article.category };

  // Related: same category, different id, max 3
  const related = (window.ARTICLES || [])
    .filter(function(a) { return a.category === article.category && a.id !== article.id; })
    .slice(0, 3);

  container.innerHTML =
    '<a href="article.html" class="reader-back">← Kembali ke Article</a>' +
    '<article class="reader-article">' +
      '<div class="reader-hero">' +
        '<div class="reader-cover">' + article.cover + '</div>' +
        '<div class="reader-cats">' +
          '<span class="article-cat active">' + catInfo.icon + ' ' + catInfo.label + '</span>' +
        '</div>' +
        '<h1 class="reader-title">' + article.title + '</h1>' +
        '<div class="reader-meta">' +
          '<span>✍️ ' + article.author + '</span>' +
          '<span class="article-dot">•</span>' +
          '<span>📅 ' + article.date + '</span>' +
          '<span class="article-dot">•</span>' +
          '<span>⏱️ ' + article.readTime + ' min baca</span>' +
        '</div>' +
      '</div>' +
      '<div class="reader-content">' + article.content + '</div>' +
    '</article>' +
    (related.length > 0 ?
      '<section class="reader-related">' +
        '<h2>📚 Artikel Terkait</h2>' +
        '<div class="reader-related-grid">' +
          related.map(function(a) {
            return '<a href="article-reader.html?id=' + a.id + '" class="reader-related-card">' +
              '<div class="reader-related-icon">' + a.cover + '</div>' +
              '<div>' +
                '<h4>' + a.title + '</h4>' +
                '<p>' + a.readTime + ' min baca</p>' +
              '</div>' +
            '</a>';
          }).join('') +
        '</div>' +
      '</section>' : ''
    );

  // Scroll top
  window.scrollTo(0, 0);
}

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('articleList')) {
    renderArticleCategories();
    initArticleSearch();
    renderArticles();
  }
  if (document.getElementById('readerContainer')) {
    renderArticleReader();
  }
});
