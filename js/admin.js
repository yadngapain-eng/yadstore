const ADMIN_USER = 'YADI';
const ADMIN_PASS = 'YADIGANTENG2026';

function adminLogin(){
  const u = document.getElementById('adminUser').value.trim();
  const p = document.getElementById('adminPass').value.trim();
  const err = document.getElementById('loginError');
  if (u === ADMIN_USER && p === ADMIN_PASS){
    sessionStorage.setItem('yad_admin', '1');
    err.textContent = '';
    showAdmin();
  } else {
    err.textContent = '❌ Username atau password salah.';
  }
}
function adminLogout(e){ e.preventDefault(); sessionStorage.removeItem('yad_admin'); location.reload() }

function showAdmin(){
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'block';
  document.getElementById('logoutBtn').style.display = 'inline-block';
  renderAdminGames(); renderAdminLessons(); renderAdminArticles(); updateStats();
}
function showTab(id){
  document.querySelectorAll('.admin-tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  event.target.classList.add('active');
}
function loadFileToTextarea(inputId, textareaId){
  const f = document.getElementById(inputId).files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = e => { document.getElementById(textareaId).value = e.target.result };
  reader.readAsText(f);
}

function renderAdminGames(){
  const games = DB.get('games', []);
  const box = document.getElementById('adminGameList');
  box.innerHTML = games.map(g => '<div class="admin-list-item"><div class="info"><b>'+g.img+' '+g.name+'</b> — '+g.genre+' — '+g.price+'</div><div class="actions">' +
    '<button class="btn btn-small btn-secondary" onclick="editGame(\''+g.id+'\')">Edit</button>' +
    '<button class="btn btn-small btn-danger" onclick="delGame(\''+g.id+'\')">Hapus</button></div></div>').join('') || '<p style="color:var(--text-muted)">Belum ada game.</p>';
}
function saveGame(e){
  e.preventDefault();
  const id = document.getElementById('gameId').value || 'g'+Date.now();
  const games = DB.get('games', []);
  const data = {id, name:document.getElementById('gameName').value, genre:document.getElementById('gameGenre').value,
    price:document.getElementById('gamePrice').value, img:document.getElementById('gameImg').value,
    desc:document.getElementById('gameDesc').value};
  const idx = games.findIndex(x => x.id === id);
  if (idx >= 0) games[idx] = data; else games.push(data);
  DB.set('games', games);
  document.getElementById('gameForm').reset();
  document.getElementById('gameId').value = '';
  renderAdminGames(); updateStats();
  alert('✅ Game disimpan!');
}
function editGame(id){
  const g = DB.get('games', []).find(x => x.id === id);
  if (!g) return;
  document.getElementById('gameId').value = g.id;
  document.getElementById('gameName').value = g.name;
  document.getElementById('gameGenre').value = g.genre;
  document.getElementById('gamePrice').value = g.price;
  document.getElementById('gameImg').value = g.img;
  document.getElementById('gameDesc').value = g.desc;
}
function delGame(id){
  if (!confirm('Hapus game ini?')) return;
  DB.set('games', DB.get('games', []).filter(x => x.id !== id));
  renderAdminGames(); updateStats();
}

function renderAdminLessons(){
  const items = DB.get('lessons', []);
  const box = document.getElementById('adminLessonList');
  box.innerHTML = items.map(l => '<div class="admin-list-item"><div class="info"><b>'+l.icon+' '+l.title+'</b> — '+(l.quiz||[]).length+' soal</div><div class="actions">' +
    '<button class="btn btn-small btn-secondary" onclick="editLesson(\''+l.id+'\')">Edit</button>' +
    '<button class="btn btn-small btn-danger" onclick="delLesson(\''+l.id+'\')">Hapus</button></div></div>').join('') || '<p style="color:var(--text-muted)">Belum ada pelajaran.</p>';
}
function saveLesson(e){
  e.preventDefault();
  const id = document.getElementById('lessonId').value || 'l'+Date.now();
  const items = DB.get('lessons', []);
  const existing = items.find(x => x.id === id);
  const data = {id, icon:document.getElementById('lessonIcon').value,
    title:document.getElementById('lessonTitle').value,
    desc:document.getElementById('lessonDesc').value,
    content:document.getElementById('lessonContent').value,
    quiz: existing?.quiz || [{q:'Contoh soal?', o:['A','B','C','D'], c:0}]};
  const idx = items.findIndex(x => x.id === id);
  if (idx >= 0) items[idx] = data; else items.push(data);
  DB.set('lessons', items);
  document.getElementById('lessonForm').reset();
  document.getElementById('lessonId').value = '';
  renderAdminLessons(); updateStats();
  alert('✅ Pelajaran disimpan!');
}
function editLesson(id){
  const l = DB.get('lessons', []).find(x => x.id === id);
  if (!l) return;
  document.getElementById('lessonId').value = l.id;
  document.getElementById('lessonTitle').value = l.title;
  document.getElementById('lessonIcon').value = l.icon;
  document.getElementById('lessonDesc').value = l.desc;
  document.getElementById('lessonContent').value = l.content;
}
function delLesson(id){
  if (!confirm('Hapus pelajaran ini?')) return;
  DB.set('lessons', DB.get('lessons', []).filter(x => x.id !== id));
  renderAdminLessons(); updateStats();
}

function renderAdminArticles(){
  const items = DB.get('articles', []);
  const box = document.getElementById('adminArticleList');
  box.innerHTML = items.map(a => '<div class="admin-list-item"><div class="info"><b>'+a.title+'</b> — '+a.type+' — '+a.author+'</div><div class="actions">' +
    '<button class="btn btn-small btn-secondary" onclick="editArticle(\''+a.id+'\')">Edit</button>' +
    '<button class="btn btn-small btn-danger" onclick="delArticle(\''+a.id+'\')">Hapus</button></div></div>').join('') || '<p style="color:var(--text-muted)">Belum ada article.</p>';
}
function saveArticle(e){
  e.preventDefault();
  const id = document.getElementById('articleId').value || 'a'+Date.now();
  const items = DB.get('articles', []);
  const data = {id, title:document.getElementById('articleTitle').value,
    type:document.getElementById('articleType').value,
    author:document.getElementById('articleAuthor').value,
    excerpt:document.getElementById('articleExcerpt').value,
    content:document.getElementById('articleContent').value};
  const idx = items.findIndex(x => x.id === id);
  if (idx >= 0) items[idx] = data; else items.push(data);
  DB.set('articles', items);
  document.getElementById('articleForm').reset();
  document.getElementById('articleId').value = '';
  renderAdminArticles(); updateStats();
  alert('✅ Article disimpan!');
}
function editArticle(id){
  const a = DB.get('articles', []).find(x => x.id === id);
  if (!a) return;
  document.getElementById('articleId').value = a.id;
  document.getElementById('articleTitle').value = a.title;
  document.getElementById('articleType').value = a.type;
  document.getElementById('articleAuthor').value = a.author;
  document.getElementById('articleExcerpt').value = a.excerpt;
  document.getElementById('articleContent').value = a.content;
}
function delArticle(id){
  if (!confirm('Hapus article ini?')) return;
  DB.set('articles', DB.get('articles', []).filter(x => x.id !== id));
  renderAdminArticles(); updateStats();
}

function saveSettings(){
  DB.set('settings', {siteName:document.getElementById('setSiteName').value,
    tagline:document.getElementById('setTagline').value,
    themeColor:document.getElementById('setThemeColor').value});
  alert('✅ Pengaturan disimpan!');
}
function exportData(){
  const data = {games:DB.get('games', []), lessons:DB.get('lessons', []),
    articles:DB.get('articles', []), settings:DB.get('settings', {})};
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'yadstore-backup.json'; a.click();
}
function importData(e){
  const f = e.target.files[0]; if (!f) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      if (data.games) DB.set('games', data.games);
      if (data.lessons) DB.set('lessons', data.lessons);
      if (data.articles) DB.set('articles', data.articles);
      if (data.settings) DB.set('settings', data.settings);
      alert('✅ Data di-import!'); location.reload();
    } catch { alert('❌ File tidak valid.') }
  };
  reader.readAsText(f);
}
function resetAllData(){
  if (!confirm('Yakin reset SEMUA data?')) return;
  ['games','lessons','articles','settings','views','total_views'].forEach(k => localStorage.removeItem('yadstore_'+k));
  alert('🗑️ Data direset.'); location.reload();
}
function updateStats(){
  document.getElementById('statGames').textContent = DB.get('games', []).length;
  document.getElementById('statLessons').textContent = DB.get('lessons', []).length;
  document.getElementById('statArticles').textContent = DB.get('articles', []).length;
  document.getElementById('statViews').textContent = DB.get('total_views', 0);
}
document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('yad_admin') === '1') showAdmin();
  document.getElementById('adminPass')?.addEventListener('keypress', e => {
    if (e.key === 'Enter') adminLogin();
  });
});
