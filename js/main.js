// YADSTORE — Main
function toggleNav(){document.querySelector('.nav-links').classList.toggle('open')}

const DB = {
  get(k,d){try{const v=localStorage.getItem('yadstore_'+k);return v?JSON.parse(v):d}catch{return d}},
  set(k,v){localStorage.setItem('yadstore_'+k,JSON.stringify(v))}
};

function trackView(type,id){
  const views = DB.get('views',{});
  views[type] = views[type]||{};
  views[type][id] = (views[type][id]||0)+1;
  DB.set('views',views);
  DB.set('total_views', DB.get('total_views',0)+1);
}

function getRecommended(){
  const games = DB.get('games',[]);
  const lessons = DB.get('lessons',[]);
  const articles = DB.get('articles',[]);
  const pool = [];
  games.slice(0,3).forEach(g=>pool.push({type:'game',id:g.id,title:g.name,desc:g.genre+' • '+g.price,icon:g.img||'🎮'}));
  lessons.slice(0,3).forEach(l=>pool.push({type:'lesson',id:l.id,title:l.title,desc:l.desc,icon:l.icon||'📚'}));
  articles.slice(0,3).forEach(a=>pool.push({type:'article',id:a.id,title:a.title,desc:a.type+' • '+a.author,icon:'📖'}));
  return pool.sort(()=>Math.random()-0.5).slice(0,6);
}

function renderRecommend(){
  const box = document.getElementById('recommendBox');
  if (!box) return;
  const items = getRecommended();
  if (items.length === 0){
    box.innerHTML = '<p style="color:var(--text-muted)">Belum ada konten. Tambah lewat admin panel.</p>';
    return;
  }
  box.innerHTML = items.map(it=>{
    const link = it.type==='game'?'store.html':it.type==='lesson'?'learn.html':'article.html';
    return '<a href="'+link+'" class="feature-card" onclick="trackView(\''+it.type+'\',\''+it.id+'\')">'+
      '<div class="feature-icon">'+it.icon+'</div><h3>'+it.title+'</h3><p>'+it.desc+'</p></a>';
  }).join('');
}

document.addEventListener('DOMContentLoaded', renderRecommend);
