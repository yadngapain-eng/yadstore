const DEFAULT_ARTICLES = [
  // ===== ARTICLE =====
  {id:'a1',title:'Belajar Coding dari Nol untuk Pemula',type:'article',author:'Ysdev',date:'20 Sep 2026',read:8,
   excerpt:'Panduan lengkap memulai perjalanan coding tanpa latar belakang IT.',
   content:'<h2>Kenapa Harus Belajar Coding?</h2><p>Coding bukan cuma buat programmer. Di era digital, coding adalah <b>kemampuan literasi baru</b> — seperti membaca dan menulis. Dengan coding, kamu bisa bikin website, aplikasi, game, atau otomatisasi pekerjaan.</p><h2>1. Pilih Bahasa Pertama</h2><p>Jangan bingung. Untuk pemula, rekomendasi:<br><b>Python</b> — sintaks sederhana, cocok untuk logika dasar.<br><b>JavaScript</b> — langsung jalan di browser, hasilnya kelihatan.<br><b>Kotlin</b> — kalau mau bikin aplikasi Android.</p><h2>2. Kuasai Dasar Logika</h2><p>Semua bahasa punya konsep yang sama: variabel, kondisi (if-else), perulangan (for/while), fungsi, dan struktur data (array, object).</p><h2>3. Latihan Setiap Hari</h2><p>15 menit sehari lebih baik dari 5 jam sekali seminggu. Konsistensi > intensitas.</p><h2>4. Bangun Proyek Kecil</h2><p>Kalkulator, to-do list, atau game tebak angka. Proyek nyata bikin kamu cepat paham.</p><h2>5. Jangan Takut Error</h2><p>Error adalah guru terbaik. Setiap bug yang kamu selesaikan = skill naik 1 level.</p><h2>Kesimpulan</h2><p>Belajar coding itu maraton, bukan sprint. Fokus, sabar, dan terus latihan. Selamat berpetualang!</p>'},

  {id:'a2',title:'10 Kesalahan Programmer Pemula',type:'article',author:'Ysdev',date:'18 Sep 2026',read:6,
   excerpt:'Hindari 10 jebakan umum ini biar perjalanan codingmu lancar.',
   content:'<h2>1. Langsung Lompat ke Framework</h2><p>Belum paham dasar JavaScript, langsung React. Belum paham Java, langsung Spring Boot. Ini resep gagal.</p><h2>2. Copy-Paste Tanpa Paham</h2><p>Stack Overflow itu teman, bukan pengganti otak. Pahami dulu, baru pakai.</p><h2>3. Tidak Pakai Version Control</h2><p>Git itu wajib. Bayangkan kerja 3 hari, laptop rusak, kode ilang semua.</p><h2>4. Skip Dokumentasi</h2><p>Dokumentasi resmi adalah sumber paling akurat. Biasanya lebih update dari tutorial.</p><h2>5. Takut Bertanya</h2><p>Nggak ada pertanyaan bodoh. Yang bodoh itu diam dan stuck berhari-hari.</p><h2>6. Tidak Bikin Catatan</h2><p>Catat error & solusinya. Nanti bisa jadi cheat sheet pribadi.</p><h2>7. Belajar Terlalu Banyak Bahasa</h2><p>Kuasai 1 dulu sampai mahir, baru eksplorasi.</p><h2>8. Tidak Pernah Selesai Proyek</h2><p>Mulai 10 proyek, selesai 0. Lebih baik 1 proyek jadi.</p><h2>9. Mengabaikan Kesehatan</h2><p>Duduk 12 jam, mata rusak, punggung sakit. Istirahat itu produktif.</p><h2>10. Berhenti di Tengah Jalan</h2><p>Belajar coding 3 bulan lalu berhenti? Sayang. Terus lanjut!</p>'},

  {id:'a3',title:'Roadmap Full-Stack Developer 2026',type:'article',author:'Ysdev',date:'15 Sep 2026',read:12,
   excerpt:'Urutan belajar dari HTML sampai deploy — lengkap dan terstruktur.',
   content:'<h2>Frontend (3-6 bulan)</h2><p>1. HTML & CSS — struktur & tampilan<br>2. JavaScript ES6+ — interaksi<br>3. Responsive Design — mobile-first<br>4. Framework (React/Vue) — komponen<br>5. State Management — Redux/Pinia<br>6. Build Tools — Vite/Webpack</p><h2>Backend (6-9 bulan)</h2><p>1. Node.js / Python / Go<br>2. REST API & GraphQL<br>3. Database (SQL + NoSQL)<br>4. Authentication (JWT, OAuth)<br>5. Caching (Redis)<br>6. Message Queue (RabbitMQ/Kafka)</p><h2>DevOps (9-12 bulan)</h2><p>1. Linux basic<br>2. Docker & Container<br>3. CI/CD Pipeline<br>4. Cloud Hosting<br>5. Monitoring & Logging</p><h2>Soft Skills</h2><p>Komunikasi, teamwork, problem solving, dan kemampuan belajar cepat.</p><h2>Tips</h2><p>Fokus 1 stack dulu. Bangun 5 proyek portfolio. Kontribusi ke open source kecil-kecilan.</p>'},

  {id:'a4',title:'Cara Optimasi Performa Website',type:'article',author:'Ysdev',date:'12 Sep 2026',read:7,
   excerpt:'Teknik-teknik bikin website kamu ngebut kayak kilat.',
   content:'<h2>1. Optimasi Gambar</h2><p>Pakai format WebP/AVIF, compress, lazy load. Gambar adalah penyebab utama website lelet.</p><h2>2. Minify CSS & JS</h2><p>Hapus spasi, komentar, karakter tidak perlu. Ukuran file turun drastis.</p><h2>3. Gunakan CDN</h2><p>Content Delivery Network nyimpen file di server terdekat user.</p><h2>4. Cache Everything</h2><p>Browser cache, server cache, database cache. Cache = kunci performa.</p><h2>5. Kurangi HTTP Request</h2><p>Gabungkan CSS, JS. Pakai sprite untuk icon. Kecil-kecil banyak = lambat.</p><h2>6. Defer & Async JavaScript</h2><p>Jangan block rendering. Pakai defer/async untuk script non-kritis.</p><h2>7. Optimasi Font</h2><p>Pakai font-display:swap, subset, format woff2. Font sering jadi bottleneck.</p><h2>8. Audit Reguler</h2><p>Pakai Lighthouse atau PageSpeed Insights tiap 2 minggu.</p>'},

  {id:'a5',title:'Panduan Git untuk Pemula',type:'article',author:'Ysdev',date:'10 Sep 2026',read:9,
   excerpt:'Semua perintah Git yang kamu butuhkan sehari-hari.',
   content:'<h2>Setup Awal</h2><p><code>git config --global user.name "Nama"</code><br><code>git config --global user.email "email"</code></p><h2>Alur Dasar</h2><p><code>git init</code> — inisialisasi repo<br><code>git add .</code> — stage semua perubahan<br><code>git commit -m "pesan"</code> — simpan snapshot<br><code>git push origin main</code> — kirim ke server</p><h2>Branch</h2><p><code>git branch fitur-baru</code><br><code>git checkout fitur-baru</code><br><code>git merge fitur-baru</code></p><h2>Perintah Sering Dipakai</h2><p><code>git status</code> — cek status<br><code>git log --oneline</code> — lihat history<br><code>git pull</code> — ambil update<br><code>git diff</code> — lihat perubahan</p><h2>Tips</h2><p>Commit kecil-kecil, pesan jelas, branch untuk tiap fitur. Jangan pernah commit password!</p>'},

  {id:'a6',title:'Docker untuk Developer Modern',type:'article',author:'Ysdev',date:'8 Sep 2026',read:10,
   excerpt:'Kenapa Docker wajib dikuasai developer 2026.',
   content:'<h2>Apa itu Docker?</h2><p>Docker = container. Bayangkan seperti kotak yang berisi aplikasi + semua dependensinya. Jalan di mana aja hasilnya sama.</p><h2>Masalah yang Diselesaikan</h2><p>"Di laptop gue jalan, di server nggak." Docker menyelesaikan ini.</p><h2>Konsep Dasar</h2><p><b>Image</b> — template aplikasi<br><b>Container</b> — instance image yang jalan<br><b>Dockerfile</b> — resep bikin image<br><b>Volume</b> — penyimpanan persisten</p><h2>Perintah Dasar</h2><p><code>docker build -t app .</code><br><code>docker run -p 8080:80 app</code><br><code>docker ps</code><br><code>docker stop [id]</code></p><h2>Docker Compose</h2><p>Untuk manage multi-container (app + db + cache) dalam 1 file YAML.</p>'},

  {id:'a7',title:'Belajar Algoritma & Struktur Data',type:'article',author:'Ysdev',date:'5 Sep 2026',read:11,
   excerpt:'Fundamental yang membedakan programmer biasa dan hebat.',
   content:'<h2>Kenapa Penting?</h2><p>Algoritma & struktur data bukan hafalan. Ini cara berpikir. Bikin kode kamu efisien, cepat, hemat memori.</p><h2>Struktur Data Esensial</h2><p><b>Array</b> — akses cepat O(1)<br><b>Linked List</b> — insert/delete cepat<br><b>Stack</b> — LIFO<br><b>Queue</b> — FIFO<br><b>HashMap</b> — key-value O(1)<br><b>Tree</b> — hierarki<br><b>Graph</b> — relasi kompleks</p><h2>Algoritma Wajib</h2><p>Sorting (Bubble, Merge, Quick)<br>Searching (Linear, Binary)<br>Recursion<br>Dynamic Programming<br>Greedy<br>BFS & DFS</p><h2>Cara Belajar</h2><p>Practice di platform seperti LeetCode, HackerRank. Mulai dari Easy, naik bertahap.</p>'},

  // ===== BERITA =====
  {id:'b1',title:'AI Generatif Mengubah Dunia Kerja 2026',type:'berita',author:'Redaksi',date:'22 Sep 2026',read:5,
   excerpt:'Survei global: 68% developer sudah pakai AI assistant harian.',
   content:'<p><b>JAKARTA</b> — Survei terbaru dari komunitas developer global menunjukkan 68% programmer sudah menggunakan AI assistant dalam pekerjaan harian mereka. Angka ini naik 3x lipat dibanding 2 tahun lalu.</p><p>AI sekarang dipakai untuk: menulis boilerplate code, review PR, debugging, sampai dokumentasi otomatis.</p><p>"AI bukan pengganti developer, tapi amplifier. Yang bisa pakai AI akan mengalahkan yang tidak," kata seorang senior engineer.</p><p>Dampak ke industri: permintaan skill AI prompt engineering naik drastis. Perusahaan mulai investasi training AI untuk tim.</p>'},

  {id:'b2',title:'Startup Lokal Raih Pendanaan Rp 500 M',type:'berita',author:'Redaksi',date:'20 Sep 2026',read:4,
   excerpt:'Startup edtech asal Surabaya menembus pasar Asia Tenggara.',
   content:'<p><b>SURABAYA</b> — Sebuah startup edtech lokal berhasil meraih pendanaan seri B sebesar Rp 500 miliar. Dana akan dipakai ekspansi ke 5 negara Asia Tenggara.</p><p>Produk mereka: platform belajar coding interaktif dengan gamifikasi. Sudah dipakai 2 juta pelajar di Indonesia.</p><p>"Fokus kami bukan cuma konten, tapi engagement. Belajar harus kayak main game," ujar CEO-nya.</p><p>Investor percaya pasar edtech Indonesia masih punya ruang tumbuh besar.</p>'},

  {id:'b3',title:'Bahasa Pemrograman Paling Dicari 2026',type:'berita',author:'Redaksi',date:'18 Sep 2026',read:6,
   excerpt:'Python masih juara, tapi Rust dan Go naik pesat.',
   content:'<p><b>Data</b> dari laporan industri menunjukkan urutan bahasa pemrograman paling dicari di 2026:</p><p>1. <b>Python</b> — dominasi AI/ML<br>2. <b>JavaScript/TypeScript</b> — web everywhere<br>3. <b>Java</b> — enterprise tetap kuat<br>4. <b>Go</b> — backend & cloud<br>5. <b>Rust</b> — sistem & performance<br>6. <b>Kotlin</b> — Android modern<br>7. <b>Swift</b> — iOS</p><p>Menariknya, Rust dan Go naik paling cepat. Banyak perusahaan migrasi dari bahasa lama ke keduanya untuk performa dan safety.</p>'},

  {id:'b4',title:'Kesehatan Mental Programmer Jadi Sorotan',type:'berita',author:'Redaksi',date:'15 Sep 2026',read:5,
   excerpt:'Burnout jadi masalah serius di industri teknologi.',
   content:'<p><b>Diskusi</b> soal burnout di kalangan developer semakin ramai. Survei internal perusahaan teknologi besar menunjukkan 42% engineer pernah alami burnout.</p><p>Penyebab: deadline ketat, on-call 24/7, dan budaya kerja berlebihan.</p><p>Beberapa perusahaan mulai adopsi kebijakan: no-meeting-day, cuti mental health, dan limit jam kerja.</p><p>"Produktivitas jangka panjang lebih penting dari sprint sesaat," ujar seorang VP Engineering.</p>'},

  {id:'b5',title:'Web3 & Blockchain: Masih Relevan?',type:'berita',author:'Redaksi',date:'12 Sep 2026',read:7,
   excerpt:'Setelah hype 2021, ke mana arah Web3 sekarang?',
   content:'<p><b>Analisis</b> — Setelah euforia 2021, Web3 masuk fase realistis. Banyak proyek mati, tapi yang survive mulai punya use case nyata.</p><p>Yang bertahan: stablecoin untuk pembayaran cross-border, NFT untuk ticketing & membership, dan smart contract untuk supply chain.</p><p>Yang lesu: metaverse virtual land, P2E game tanpa gameplay.</p><p>Kesimpulan: hype boleh lewat, tapi teknologi dasarnya tetap berkembang.</p>'},

  // ===== NOVEL =====
  {id:'n1',title:'Petualangan di Negeri Kode — Bab 1',type:'novel',author:'Ysdev',date:'19 Sep 2026',read:10,
   excerpt:'Seorang pemuda tersedot ke dunia yang dibangun dari kode.',
   content:'<p><i>Malam itu hujan turun deras. Andi masih di depan laptop, mencoba memperbaiki bug yang tak kunjung hilang. Jam sudah menunjukkan 02:47.</i></p><p>"Sial," gumamnya. Baris ke-247 masih merah.</p><p>Tiba-tiba layar berkedip. Bukan kedip biasa — seluruh monitor menyala putih, lalu ada teks muncul: <b>"Selamat datang, Andi."</b></p><p>Belum sempat Andi bereaksi, tubuhnya terasa ringan. Lantai kamar menghilang. Dia jatuh... ke dalam cahaya.</p><p>Ketika membuka mata, dia berdiri di padang rumput digital. Langit berwarna #0a0e27. Pohon-pohon berbentuk <code>{ }</code>. Ada sungai mengalir dengan teks biru.</p><p>"Apa-apaan ini?" Andi menoleh. Seekor rubah neon mendekat, matanya seperti terminal.</p><p>"Kamu pemanggil baru ya?" kata rubah itu. "Selamat datang di Negeri Kode. Di sini, setiap baris yang kamu tulis jadi kenyataan."</p><p><i>Bersambung...</i></p>'},

  {id:'n2',title:'Petualangan di Negeri Kode — Bab 2',type:'novel',author:'Ysdev',date:'21 Sep 2026',read:10,
   excerpt:'Andi bertemu guild pertama dan harus menyelesaikan quest pertama.',
   content:'<p><i>Rubah neon itu bernama Compilo. Dia memandu Andi ke desa terdekat.</i></p><p>Desa itu bernama "Sintaksia". Rumah-rumahnya terbuat dari balok kayu bertekstur kode.</p><p>"Kamu harus daftar ke guild," kata Compilo. "Pilih satu: Frontend, Backend, atau Fullstack."</p><p>Andi bingung. "Apa bedanya?"</p><p>"Frontend = yang bertarung di depan, bikin tampilan. Backend = yang atur strategi dari balik layar. Fullstack = bisa keduanya, tapi harus lebih kuat."</p><p>Andi memilih <b>Fullstack</b>. Compilo mengangguk. "Pilihan berani. Sekarang quest pertama: temukan Bug di Hutan Loop."</p><p>Di hutan, Andi bertemu makhluk-makhluk aneh: <i>NullPointer</i>, <i>StackOverflow</i>, dan <i>InfiniteLoop</i>.</p><p>InfiniteLoop paling berbahaya. Dia berputar tanpa henti, menghisap energi siapa pun yang dekat.</p><p>"Kamu harus <code>break</code> dia," bisik Compilo. "Atau <code>return</code> sebelum dia selesai."</p><p><i>Bersambung...</i></p>'},

  {id:'n3',title:'Petualangan di Negeri Kode — Bab 3',type:'novel',author:'Ysdev',date:'22 Sep 2026',read:10,
   excerpt:'Andi melawan InfiniteLoop dan menemukan kekuatan barunya.',
   content:'<p><i>Angin bertiup. Daun-daun digital beterbangan. InfiniteLoop berputar makin cepat.</i></p><p>Andi mengangkat tangan. Di telapak tangannya muncul tombol keyboard transparan.</p><p>"Apa yang harus aku tulis?" tanyanya.</p><p>"Apa pun. Tapi harus bener," jawab Compilo. "Salah satu karakter, kamu bisa terperangkap di loop juga."</p><p>Andi mikir keras. Dia ingat pelajaran pertama: <code>for</code> loop butuh kondisi berhenti.</p><p>Dia menulis: <code>while(true) { if (musuh.lelah) break; }</code></p><p>InfiniteLoop melambat. Pelan-pelan berhenti. Lalu pecah jadi serpihan cahaya.</p><p>"Kamu lulus," kata Compilo. "Sekarang kamu punya kekuatan pertama: <b>Debugging</b>."</p><p>Andi menatap tangannya. Ada tato kecil di pergelangan: <code>{ }</code>.</p><p>Di kejauhan, langit berubah gelap. Ada bayangan besar mendekat.</p><p>"Bersiap," kata Compilo. "Itu <b>Compiler</b>. Bos pertama."</p><p><i>Bersambung...</i></p>'}
];

function ensureArticles(){
  if (!DB.get('articles', null)) DB.set('articles', DEFAULT_ARTICLES);
  return DB.get('articles', []);
}

function renderArticle(){
  const grid = document.getElementById('articleGrid');
  if (!grid) return;
  let arts = ensureArticles();
  const q = (document.getElementById('searchArticle')?.value || '').toLowerCase();
  const type = document.getElementById('filterType')?.value || '';
  if (q) arts = arts.filter(a => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q));
  if (type) arts = arts.filter(a => a.type === type);
  if (arts.length === 0){ grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px">Tidak ada hasil.</p>'; return }
  grid.innerHTML = arts.map(a => '<div class="article-card" onclick="openReader(\''+a.id+'\')">' +
    '<span class="article-type type-'+a.type+'">'+a.type+'</span>' +
    '<h3>'+a.title+'</h3><p class="article-excerpt">'+a.excerpt+'</p>' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px">' +
      '<p class="article-author">✍️ '+a.author+'</p>' +
      '<p class="article-author">📖 '+a.read+' min</p>' +
    '</div></div>').join('');
}

function openReader(id){
  const a = ensureArticles().find(x => x.id === id);
  if (!a) return;
  trackView('article', id);
  document.getElementById('readerContent').innerHTML =
    '<div class="reader-content"><h1>'+a.title+'</h1>' +
    '<p class="meta"><span class="article-type type-'+a.type+'">'+a.type+'</span> • '+a.author+' • '+a.date+' • '+a.read+' min baca</p>' +
    '<div class="body">'+a.content+'</div></div>';
  document.getElementById('readerModal').classList.add('open');
}
function closeReader(){ document.getElementById('readerModal').classList.remove('open') }

document.addEventListener('DOMContentLoaded', renderArticle);
