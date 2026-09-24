const DEFAULT_GAMES = [
  // ===== GAME POPULER MOBILE =====
  {id:'m1',name:'Mobile Legends: Bang Bang',genre:'MOBA',price:'Gratis',img:'⚔️',
   desc:'Game MOBA 5v5 paling populer di Indonesia. Pilih hero, kerja sama tim, hancurkan base musuh.',
   rating:4.8,players:'1M+',developer:'Moonton'},
  {id:'m2',name:'Free Fire',genre:'Battle Royale',price:'Gratis',img:'🔥',
   desc:'Battle royale 50 pemain. Jump, loot, dan jadi yang terakhir bertahan.',
   rating:4.7,players:'800K+',developer:'Garena'},
  {id:'m3',name:'PUBG Mobile',genre:'Battle Royale',price:'Gratis',img:'🎯',
   desc:'Battle royale realistis dengan grafis HD. 100 pemain, 1 pemenang.',
   rating:4.6,players:'500K+',developer:'Tencent'},
  {id:'m4',name:'Genshin Impact',genre:'RPG',price:'Gratis',img:'🌸',
   desc:'Open world RPG dengan grafis anime cantik. Jelajahi Teyvat, kumpulkan karakter.',
   rating:4.9,players:'300K+',developer:'HoYoverse'},
  {id:'m5',name:'Honkai: Star Rail',genre:'RPG',price:'Gratis',img:'🚂',
   desc:'Turn-based RPG dari HoYoverse. Jelajahi galaksi dengan Astral Express.',
   rating:4.8,players:'250K+',developer:'HoYoverse'},
  {id:'m6',name:'Call of Duty Mobile',genre:'FPS',price:'Gratis',img:'🎖️',
   desc:'FPS multiplayer dengan map ikonik. Mode battle royale & multiplayer.',
   rating:4.5,players:'400K+',developer:'Activision'},
  {id:'m7',name:'Clash of Clans',genre:'Strategy',price:'Gratis',img:'🏰',
   desc:'Bangun desa, latih pasukan, serang clan lain. Klasik strategi mobile.',
   rating:4.7,players:'350K+',developer:'Supercell'},
  {id:'m8',name:'Clash Royale',genre:'Strategy',price:'Gratis',img:'👑',
   desc:'Card battle real-time. Kumpulkan kartu, susun deck, hancurkan tower musuh.',
   rating:4.6,players:'300K+',developer:'Supercell'},
  {id:'m9',name:'Valorant Mobile',genre:'FPS',price:'Gratis',img:'💥',
   desc:'Tactical shooter 5v5 dengan agent unik. Aim + strategi = menang.',
   rating:4.8,players:'200K+',developer:'Riot Games'},
  {id:'m10',name:'Among Us',genre:'Party',price:'Gratis',img:'🚀',
   desc:'Game sosial di luar angkasa. Temukan impostor sebelum dia bunuh semua.',
   rating:4.4,players:'150K+',developer:'InnerSloth'},

  // ===== GAME PREMIUM =====
  {id:'p1',name:'Minecraft',genre:'Sandbox',price:'Rp 89.000',img:'⛏️',
   desc:'Bangun apa pun yang kamu mau. Survival atau creative mode.',
   rating:4.9,players:'600K+',developer:'Mojang'},
  {id:'p2',name:'Stardew Valley',genre:'Simulation',price:'Rp 79.000',img:'🌾',
   desc:'Kelola pertanian, temui penduduk desa, bangun kehidupan baru.',
   rating:4.9,players:'200K+',developer:'ConcernedApe'},
  {id:'p3',name:'Terraria',genre:'Sandbox',price:'Rp 59.000',img:'🗡️',
   desc:'2D adventure dengan crafting, building, dan boss battle.',
   rating:4.8,players:'150K+',developer:'Re-Logic'},
  {id:'p4',name:'Dead Cells',genre:'Roguelike',price:'Rp 99.000',img:'💀',
   desc:'Roguelike action cepat dengan level random. Mati, ulang, jadi lebih kuat.',
   rating:4.8,players:'100K+',developer:'Motion Twin'},
  {id:'p5',name:'Slay the Spire',genre:'Card',price:'Rp 89.000',img:'🃏',
   desc:'Deck-building roguelike. Susun deck terbaik untuk naik menara.',
   rating:4.9,players:'120K+',developer:'Mega Crit'},

  // ===== ITEM TOP-UP ML =====
  {id:'ml1',name:'ML Diamond 86',genre:'Item ML',price:'Rp 20.000',img:'💎',
   desc:'86 Diamond Mobile Legends. Cukup untuk beli hero baru.'},
  {id:'ml2',name:'ML Diamond 172',genre:'Item ML',price:'Rp 40.000',img:'💎',
   desc:'172 Diamond ML. Cocok untuk skin epic.'},
  {id:'ml3',name:'ML Diamond 257',genre:'Item ML',price:'Rp 60.000',img:'💎',
   desc:'257 Diamond ML. Beli skin legend!'},
  {id:'ml4',name:'ML Diamond 706',genre:'Item ML',price:'Rp 150.000',img:'💎',
   desc:'706 Diamond ML. Paket hemat untuk skin collector.'},
  {id:'ml5',name:'ML Starlight Card',genre:'Item ML',price:'Rp 35.000',img:'⭐',
   desc:'Starlight Membership ML. Dapat skin eksklusif bulanan.'},

  // ===== ITEM FF =====
  {id:'ff1',name:'FF Diamond 70',genre:'Item FF',price:'Rp 15.000',img:'💠',
   desc:'70 Diamond Free Fire. Buat beli karakter atau bundle.'},
  {id:'ff2',name:'FF Diamond 140',genre:'Item FF',price:'Rp 30.000',img:'💠',
   desc:'140 Diamond FF. Paket populer untuk elite pass.'},
  {id:'ff3',name:'FF Diamond 355',genre:'Item FF',price:'Rp 70.000',img:'💠',
   desc:'355 Diamond FF. Beli bundle keren di shop.'},
  {id:'ff4',name:'FF Weekly Membership',genre:'Item FF',price:'Rp 25.000',img:'🎫',
   desc:'Weekly Membership FF. Diamond + bonus harian 7 hari.'},
  {id:'ff5',name:'FF Elite Pass',genre:'Item FF',price:'Rp 50.000',img:'🏆',
   desc:'Elite Pass FF. Buka reward eksklusif season ini.'},

  // ===== ITEM PUBG =====
  {id:'pm1',name:'PUBG UC 60',genre:'Item PUBG',price:'Rp 15.000',img:'🪙',
   desc:'60 UC PUBG Mobile. Beli skin senjata atau outfit.'},
  {id:'pm2',name:'PUBG UC 325',genre:'Item PUBG',price:'Rp 70.000',img:'🪙',
   desc:'325 UC PUBG. Paket hemat untuk Royal Pass.'},
  {id:'pm3',name:'PUBG Royal Pass',genre:'Item PUBG',price:'Rp 60.000',img:'👑',
   desc:'Royal Pass PUBG. Buka semua reward season ini.'},

  // ===== ITEM GENSHIN =====
  {id:'gi1',name:'Genshin Genesis Crystal 60',genre:'Item Genshin',price:'Rp 15.000',img:'💫',
   desc:'60 Genesis Crystal Genshin Impact.'},
  {id:'gi2',name:'Genshin Blessing of Welkin Moon',genre:'Item Genshin',price:'Rp 75.000',img:'🌙',
   desc:'Blessing of Welkin Moon. 300 Crystal + 90 Primogem/hari selama 30 hari.'},
  {id:'gi3',name:'Genshin Battle Pass',genre:'Item Genshin',price:'Rp 89.000',img:'⚜️',
   desc:'Gnostic Hymn Battle Pass. Buka reward eksklusif + Primogem.'},

  // ===== ITEM COD =====
  {id:'cd1',name:'COD CP 80',genre:'Item COD',price:'Rp 15.000',img:'🔫',
   desc:'80 CP Call of Duty Mobile.'},
  {id:'cd2',name:'COD Battle Pass',genre:'Item COD',price:'Rp 55.000',img:'🎖️',
   desc:'Battle Pass COD Mobile. Buka karakter & senjata eksklusif.'},
  {id:'cd3',name:'COD CP 420',genre:'Item COD',price:'Rp 70.000',img:'🔫',
   desc:'420 CP COD. Paket hemat untuk beli bundle.'},

  // ===== VOUCHER =====
  {id:'v1',name:'Voucher Google Play 50K',genre:'Voucher',price:'Rp 50.000',img:'🎁',
   desc:'Voucher Google Play Rp 50.000. Bisa buat beli game & item.'},
  {id:'v2',name:'Voucher Google Play 100K',genre:'Voucher',price:'Rp 100.000',img:'🎁',
   desc:'Voucher Google Play Rp 100.000.'},
  {id:'v3',name:'Voucher Steam Wallet 60K',genre:'Voucher',price:'Rp 60.000',img:'🎮',
   desc:'Steam Wallet Code Rp 60.000. Buat beli game PC.'}
];

function ensureGames(){
  // Selalu update ke versi terbaru kalau masih pakai default lama
  const existing = DB.get('games', null);
  if (!existing || existing.length < 20) {
    DB.set('games', DEFAULT_GAMES);
  }
  return DB.get('games', []);
}

function renderStore(){
  const grid = document.getElementById('storeGrid');
  if (!grid) return;
  let games = ensureGames();
  const q = (document.getElementById('searchStore')?.value || '').toLowerCase();
  const genre = document.getElementById('filterGenre')?.value || '';
  if (q) games = games.filter(g => g.name.toLowerCase().includes(q) || g.genre.toLowerCase().includes(q));
  if (genre) games = games.filter(g => g.genre === genre);
  if (games.length === 0){ grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px">Tidak ada hasil.</p>'; return }

  grid.innerHTML = games.map(g => '<div class="store-card" onclick="openGame(\''+g.id+'\')">' +
    '<div class="store-img">'+g.img+'</div><div class="store-info">' +
    '<span class="store-genre">'+g.genre+'</span><h3>'+g.name+'</h3>' +
    (g.rating ? '<div class="store-rating">⭐ '+g.rating+' • 👥 '+g.players+'</div>' : '') +
    '<div class="store-price">'+g.price+'</div></div></div>').join('');
}

function openGame(id){
  const g = ensureGames().find(x => x.id === id);
  if (!g) return;
  trackView('game', id);
  document.getElementById('gameContent').innerHTML =
    '<div style="text-align:center;font-size:90px;margin-bottom:20px">'+g.img+'</div>' +
    '<h1>'+g.name+'</h1>' +
    '<div style="display:flex;gap:10px;flex-wrap:wrap;margin:12px 0">' +
      '<span class="store-genre">'+g.genre+'</span>' +
      (g.rating ? '<span class="store-genre">⭐ '+g.rating+'</span>' : '') +
      (g.players ? '<span class="store-genre">👥 '+g.players+'</span>' : '') +
      (g.developer ? '<span class="store-genre">🏢 '+g.developer+'</span>' : '') +
    '</div>' +
    '<p style="margin:20px 0;color:var(--text-muted);line-height:1.8">'+g.desc+'</p>' +
    '<div class="store-price" style="font-size:32px;margin:24px 0">'+g.price+'</div>' +
    '<button class="btn btn-primary" onclick="buyGame(\''+g.id+'\')">🛒 Beli Sekarang</button> ' +
    '<button class="btn btn-secondary" onclick="closeGame()">Tutup</button>';
  document.getElementById('gameModal').classList.add('open');
}
function closeGame(){ document.getElementById('gameModal').classList.remove('open') }
function buyGame(id){
  const g = ensureGames().find(x => x.id === id);
  alert('Terima kasih sudah membeli ' + g.name + '!\n\n(Ini demo — pembayaran belum aktif)');
}

document.addEventListener('DOMContentLoaded', renderStore);
