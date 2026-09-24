const DEFAULT_GAMES = [
  {id:'g1',name:'Shadow Legends',genre:'RPG',price:'Rp 79.000',img:'⚔️',desc:'Petualangan epik.'},
  {id:'g2',name:'Speed Rush',genre:'Racing',price:'Rp 59.000',img:'🏎️',desc:'Balapan liar.'},
  {id:'g3',name:'Zombie Survivor',genre:'Horror',price:'Rp 89.000',img:'🧟',desc:'Bertahan hidup.'},
  {id:'g4',name:'Puzzle Master',genre:'Puzzle',price:'Rp 29.000',img:'🧩',desc:'Teka-teki seru.'},
  {id:'g5',name:'Football Star',genre:'Sports',price:'Rp 69.000',img:'⚽',desc:'Legenda sepak bola.'},
  {id:'g6',name:'Kingdom Builder',genre:'Strategy',price:'Rp 99.000',img:'🏰',desc:'Bangun kerajaan.'},
  {id:'g7',name:'Farm Life',genre:'Simulation',price:'Rp 49.000',img:'🌾',desc:'Kelola pertanian.'},
  {id:'g8',name:'Dragon Quest',genre:'Adventure',price:'Rp 109.000',img:'🐉',desc:'Kalahkan naga.'},
  {id:'g9',name:'Space Explorer',genre:'Adventure',price:'Rp 119.000',img:'🚀',desc:'Jelajahi galaksi.'},
  {id:'g10',name:'Ninja Shadow',genre:'Action',price:'Rp 84.000',img:'🥷',desc:'Aksi ninja.'},
  {id:'g11',name:'Battle Royale X',genre:'Action',price:'Gratis',img:'🎯',desc:'100 pemain.'},
  {id:'g12',name:'Mystic World',genre:'RPG',price:'Rp 129.000',img:'🔮',desc:'Dunia sihir.'},
  {id:'i1',name:'Diamond Pack 500',genre:'Item',price:'Rp 25.000',img:'💎',desc:'500 diamond.'},
  {id:'i2',name:'Starter Bundle',genre:'Item',price:'Rp 15.000',img:'🎁',desc:'Paket pemula.'},
  {id:'i3',name:'Battle Pass S1',genre:'Item',price:'Rp 45.000',img:'🎫',desc:'Battle pass.'},
  {id:'i4',name:'Legendary Skin',genre:'Item',price:'Rp 75.000',img:'👑',desc:'Skin legendaris.'}
];

function ensureGames(){ if(!DB.get('games',null)) DB.set('games',DEFAULT_GAMES); return DB.get('games',[]) }

function renderStore(){
  const grid = document.getElementById('storeGrid');
  if (!grid) return;
  let games = ensureGames();
  const q = (document.getElementById('searchStore')?.value||'').toLowerCase();
  const genre = document.getElementById('filterGenre')?.value||'';
  if (q) games = games.filter(g=>g.name.toLowerCase().includes(q));
  if (genre) games = games.filter(g=>g.genre===genre);
  if (games.length===0){ grid.innerHTML='<p style="color:var(--text-muted)">Tidak ada hasil.</p>'; return }
  grid.innerHTML = games.map(g=>'<div class="store-card" onclick="openGame(\''+g.id+'\')">'+
    '<div class="store-img">'+g.img+'</div><div class="store-info">'+
    '<span class="store-genre">'+g.genre+'</span><h3>'+g.name+'</h3>'+
    '<div class="store-price">'+g.price+'</div></div></div>').join('');
}

function openGame(id){
  const g = ensureGames().find(x=>x.id===id);
  if (!g) return;
  trackView('game',id);
  document.getElementById('gameContent').innerHTML =
    '<div style="text-align:center;font-size:80px;margin-bottom:20px">'+g.img+'</div>'+
    '<h1>'+g.name+'</h1><span class="store-genre">'+g.genre+'</span>'+
    '<p style="margin:20px 0;color:var(--text-muted)">'+g.desc+'</p>'+
    '<div class="store-price" style="font-size:28px;margin-bottom:24px">'+g.price+'</div>'+
    '<button class="btn btn-primary" onclick="buyGame(\''+g.id+'\')">🛒 Beli Sekarang</button>';
  document.getElementById('gameModal').classList.add('open');
}

function closeGame(){ document.getElementById('gameModal').classList.remove('open') }

function buyGame(id){
  const g = ensureGames().find(x=>x.id===id);
  alert('Terima kasih sudah membeli '+g.name+'!\n\n(Ini demo — pembayaran belum aktif)');
}

document.addEventListener('DOMContentLoaded', renderStore);
