// ============================
// YADSTORE — Main
// ============================

function toggleNav(){ document.querySelector('.nav-links').classList.toggle('open') }

const DB = {
  get(k, d){ try{ const v = localStorage.getItem('yadstore_'+k); return v?JSON.parse(v):d }catch{ return d } },
  set(k, v){ localStorage.setItem('yadstore_'+k, JSON.stringify(v)) }
};

function trackView(type, id){
  const views = DB.get('views', {});
  views[type] = views[type] || {};
  views[type][id] = (views[type][id] || 0) + 1;
  DB.set('views', views);
  DB.set('total_views', DB.get('total_views', 0) + 1);
}

// ===== RECOMMEND =====
function getRecommended(){
  const games = DB.get('games', []);
  const lessons = DB.get('lessons', []);
  const articles = DB.get('articles', []);
  const pool = [];
  games.slice(0,3).forEach(g => pool.push({type:'game', id:g.id, title:g.name, desc:g.genre+' • '+g.price, icon:g.img||'🎮'}));
  lessons.slice(0,3).forEach(l => pool.push({type:'lesson', id:l.id, title:l.title, desc:l.desc, icon:l.icon||'📚'}));
  articles.slice(0,3).forEach(a => pool.push({type:'article', id:a.id, title:a.title, desc:a.type+' • '+a.author, icon:'📖'}));
  return pool.sort(() => Math.random() - 0.5).slice(0, 6);
}

function renderRecommend(){
  const box = document.getElementById('recommendBox');
  if (!box) return;
  const items = getRecommended();
  if (items.length === 0){
    box.innerHTML = '<p style="color:var(--text-muted);text-align:center">Belum ada konten. Tambah lewat admin panel.</p>';
    return;
  }
  box.innerHTML = items.map(it => {
    const link = it.type === 'game' ? 'store.html' : it.type === 'lesson' ? 'learn.html' : 'article.html';
    return '<a href="'+link+'" class="feature-card fade-in" onclick="trackView(\''+it.type+'\',\''+it.id+'\')">' +
      '<div class="feature-icon-svg" style="font-size:48px">'+it.icon+'</div>' +
      '<h3>'+it.title+'</h3><p>'+it.desc+'</p></a>';
  }).join('');
}

// ===== LIVE COUNTER =====
function startLiveCounter(){
  const el = document.getElementById('liveCount');
  if (!el) return;
  let base = 1247;
  setInterval(() => {
    base += Math.floor(Math.random() * 9) - 4;
    if (base < 1200) base = 1200;
    if (base > 1350) base = 1350;
    el.textContent = base.toLocaleString('id-ID');
  }, 2500);
}

// ===== LIVE FEED =====
const FEED_EVENTS = [
  'Yadi baru saja membeli Shadow Legends',
  'Ani menyelesaikan quiz Java Dasar dengan skor 100%',
  'Budi membaca novel "Petualangan di Negeri Kode"',
  'Citra menambahkan game baru ke wishlist',
  'Dewi menyelesaikan 5 pelajaran berturut-turut',
  'Eko baru saja bergabung dengan YadStore',
  'Fani membeli Battle Pass Season 1',
  'Gita membaca article "Belajar Coding dari Nol"',
  'Hadi menang quiz Kotlin Dasar',
  'Indra membeli Diamond Pack 500'
];

function startLiveFeed(){
  const el = document.getElementById('liveFeed');
  if (!el) return;
  let idx = 0;
  setInterval(() => {
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = FEED_EVENTS[idx % FEED_EVENTS.length];
      el.style.opacity = '1';
      idx++;
    }, 400);
  }, 3500);
}

// ===== ACTIVITY FEED =====
const NAMES = ['Yadi','Ani','Budi','Citra','Dewi','Eko','Fani','Gita','Hadi','Indra'];
const ACTIONS = [
  'membeli {game}',
  'menyelesaikan quiz {lesson}',
  'membaca {article}',
  'bergabung dengan YadStore',
  'menambahkan {game} ke wishlist'
];

function getRandomActivity(){
  const games = DB.get('games', []);
  const lessons = DB.get('lessons', []);
  const articles = DB.get('articles', []);
  const name = NAMES[Math.floor(Math.random() * NAMES.length)];
  const actionTpl = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
  let action = actionTpl;

  if (actionTpl.includes('{game}') && games.length) {
    action = actionTpl.replace('{game}', games[Math.floor(Math.random()*games.length)].name);
  } else if (actionTpl.includes('{lesson}') && lessons.length) {
    action = actionTpl.replace('{lesson}', lessons[Math.floor(Math.random()*lessons.length)].title);
  } else if (actionTpl.includes('{article}') && articles.length) {
    action = actionTpl.replace('{article}', '\'' + articles[Math.floor(Math.random()*articles.length)].title + '\'');
  } else {
    action = 'bergabung dengan YadStore';
  }

  return {
    name, action,
    time: Math.floor(Math.random() * 59) + 1 + ' menit lalu',
    initial: name[0]
  };
}

function renderActivity(){
  const box = document.getElementById('activityFeed');
  if (!box) return;
  const items = [];
  for (let i = 0; i < 8; i++) items.push(getRandomActivity());
  box.innerHTML = items.map(it =>
    '<div class="activity-item">' +
      '<div class="activity-avatar">' + it.initial + '</div>' +
      '<div class="activity-text"><b>' + it.name + '</b> ' + it.action + '</div>' +
      '<div class="activity-time">' + it.time + '</div>' +
    '</div>'
  ).join('');
  // Tambah baru tiap 5 detik
  setInterval(() => {
    const newItem = getRandomActivity();
    const div = document.createElement('div');
    div.className = 'activity-item';
    div.innerHTML = '<div class="activity-avatar">' + newItem.initial + '</div>' +
      '<div class="activity-text"><b>' + newItem.name + '</b> ' + newItem.action + '</div>' +
      '<div class="activity-time">baru saja</div>';
    box.insertBefore(div, box.firstChild);
    while (box.children.length > 8) box.removeChild(box.lastChild);
  }, 5000);
}

// ===== STATS COUNTER =====
function animateStats(){
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    let cur = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(timer); }
      el.textContent = cur.toLocaleString('id-ID');
    }, 25);
  });
}

// ===== SCROLL ANIMATION =====
function initScrollAnim(){
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in, .feature-card, .lesson-card, .store-card, .article-card')
    .forEach(el => { el.classList.add('fade-in'); observer.observe(el); });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderRecommend();
  startLiveCounter();
  startLiveFeed();
  renderActivity();
  animateStats();
  initScrollAnim();
});
