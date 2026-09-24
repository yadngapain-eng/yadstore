const DEFAULT_ARTICLES = [
  {id:'a1',title:'Belajar Coding dari Nol',type:'article',author:'Ysdev',
   excerpt:'Panduan untuk pemula yang ingin mulai belajar coding.',
   content:'<p>Belajar coding itu seperti belajar bahasa baru. Mulai sederhana, konsisten, jangan takut error.</p>'},
  {id:'a2',title:'Perkembangan AI di 2026',type:'berita',author:'Redaksi',
   excerpt:'AI semakin canggih dan terintegrasi.',
   content:'<p>Di 2026, AI sudah jadi bagian pekerjaan sehari-hari.</p>'},
  {id:'a3',title:'Petualangan di Negeri Kode',type:'novel',author:'Ysdev',
   excerpt:'Cerita pemuda yang tersedot ke dunia kode.',
   content:'<p>Bab 1: Hujan turun deras. Andi masih di depan laptop...</p>'}
];

function ensureArticles(){ if(!DB.get('articles',null)) DB.set('articles',DEFAULT_ARTICLES); return DB.get('articles',[]) }

function renderArticle(){
  const grid = document.getElementById('articleGrid');
  if (!grid) return;
  let arts = ensureArticles();
  const q = (document.getElementById('searchArticle')?.value || '').toLowerCase();
  const type = document.getElementById('filterType')?.value || '';
  if (q) arts = arts.filter(a => a.title.toLowerCase().includes(q));
  if (type) arts = arts.filter(a => a.type === type);
  if (arts.length === 0){ grid.innerHTML = '<p style="color:var(--text-muted)">Tidak ada hasil.</p>'; return }
  grid.innerHTML = arts.map(a => '<div class="article-card" onclick="openReader(\''+a.id+'\')">' +
    '<span class="article-type type-'+a.type+'">'+a.type+'</span>' +
    '<h3>'+a.title+'</h3><p class="article-excerpt">'+a.excerpt+'</p>' +
    '<p class="article-author">✍️ '+a.author+'</p></div>').join('');
}

function openReader(id){
  const a = ensureArticles().find(x => x.id === id);
  if (!a) return;
  trackView('article', id);
  document.getElementById('readerContent').innerHTML =
    '<div class="reader-content"><h1>'+a.title+'</h1>' +
    '<p class="meta">'+a.type.toUpperCase()+' • '+a.author+'</p>' +
    '<div class="body">'+a.content+'</div></div>';
  document.getElementById('readerModal').classList.add('open');
}
function closeReader(){ document.getElementById('readerModal').classList.remove('open') }

document.addEventListener('DOMContentLoaded', renderArticle);
