/* ============================================
   YADSTORE — ARTICLES DATA
   ============================================
   📌 CARA TAMBAH ARTIKEL BARU:
   1. Copy salah satu object di array `ARTICLES`
   2. Isi field: id, title, category, author, date, readTime, cover, excerpt, content
   3. Save → otomatis muncul di article.html
   ============================================ */

const ARTICLE_CATEGORIES = {
  all:      { label: 'Semua',       icon: '✨' },
  tutorial: { label: 'Tutorial',    icon: '🛠️' },
  berita:   { label: 'Berita',      icon: '📰' },
  opini:    { label: 'Opini',       icon: '💭' },
  novel:    { label: 'Novel',       icon: '📖' },
  tips:     { label: 'Tips',        icon: '💡' },
  karir:    { label: 'Karir',       icon: '💼' },
};

const ARTICLES = [

  /* ==========================================
     🛠️ TUTORIAL
     ========================================== */
  {
    id: 'html-pertama',
    title: 'Membuat Halaman HTML Pertamamu dari Nol',
    category: 'tutorial',
    author: 'Ysdev',
    date: '2026-09-01',
    readTime: 8,
    cover: '📄',
    excerpt: 'Panduan langkah demi langkah membuat halaman web pertama dengan HTML — cocok untuk yang benar-benar baru mulai.',
    content: `
<h2>Pendahuluan</h2>
<p>HTML adalah fondasi dari semua website di dunia. Tanpa HTML, tidak akan ada halaman web yang bisa kamu lihat. Di artikel ini, kita akan membuat halaman HTML pertama kamu dari nol — benar-benar dari nol.</p>

<h2>Apa itu HTML?</h2>
<p>HTML singkatan dari <b>HyperText Markup Language</b>. Ini bukan bahasa pemrograman, melainkan bahasa <i>markup</i> yang memberi tahu browser bagaimana menampilkan konten. Anggap saja HTML itu seperti kerangka tubuh manusia — dia memberi struktur, sedangkan CSS adalah pakaian, dan JavaScript adalah otot yang membuatnya bergerak.</p>

<h2>Alat yang Dibutuhkan</h2>
<ul>
  <li><b>Text editor</b> — VS Code, Notepad++, atau bahkan Notepad biasa</li>
  <li><b>Browser</b> — Chrome, Firefox, atau Edge</li>
  <li><b>Niat belajar</b> — yang paling penting! 🔥</li>
</ul>

<h2>Langkah 1: Buat File</h2>
<p>Buka text editor, buat file baru, lalu simpan dengan nama <code>index.html</code>. Ekstensi <code>.html</code> wajib — kalau tidak, browser akan menganggapnya file teks biasa.</p>

<h2>Langkah 2: Tulis Struktur Dasar</h2>
<p>Setiap halaman HTML punya struktur dasar yang sama:</p>
<pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="id"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;title&gt;Halaman Pertamaku&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;h1&gt;Halo, Dunia!&lt;/h1&gt;
  &lt;p&gt;Ini halaman HTML pertamaku.&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>

<p>Mari kita bedah satu per satu:</p>
<ul>
  <li><code>&lt;!DOCTYPE html&gt;</code> — memberitahu browser ini HTML5</li>
  <li><code>&lt;html&gt;</code> — elemen root, semua konten dibungkus di sini</li>
  <li><code>&lt;head&gt;</code> — informasi meta (judul, charset, dll)</li>
  <li><code>&lt;body&gt;</code> — konten yang terlihat di layar</li>
  <li><code>&lt;h1&gt;</code> — heading terbesar</li>
  <li><code>&lt;p&gt;</code> — paragraf teks</li>
</ul>

<h2>Langkah 3: Buka di Browser</h2>
<p>Klik dua kali file <code>index.html</code>, atau drag ke browser. Kamu akan lihat "Halo, Dunia!" muncul di layar. 🎉</p>

<h2>Langkah 4: Tambah Konten</h2>
<p>Setelah struktur dasar jalan, coba tambahkan elemen lain:</p>
<pre><code>&lt;h2&gt;Tentang Saya&lt;/h2&gt;
&lt;p&gt;Nama saya Budi. Saya sedang belajar coding.&lt;/p&gt;

&lt;h3&gt;Hobi Saya&lt;/h3&gt;
&lt;ul&gt;
  &lt;li&gt;Membaca&lt;/li&gt;
  &lt;li&gt;Coding&lt;/li&gt;
  &lt;li&gt;Main game&lt;/li&gt;
&lt;/ul&gt;

&lt;a href="https://google.com"&gt;Kunjungi Google&lt;/a&gt;
&lt;img src="foto.jpg" alt="Foto saya"&gt;</code></pre>

<h2>Kesalahan Umum Pemula</h2>
<ol>
  <li><b>Lupa tutup tag</b> — setiap <code>&lt;div&gt;</code> harus ditutup dengan <code>&lt;/div&gt;</code></li>
  <li><b>Salah kapitalisasi</b> — HTML tidak case-sensitive, tapi biasakan lowercase</li>
  <li><b>Nested salah</b> — tag yang dibuka terakhir harus ditutup pertama</li>
  <li><b>Path gambar salah</b> — pastikan file gambar ada di folder yang benar</li>
</ol>

<h2>Latihan</h2>
<p>Coba buat halaman "Profil Diri" yang berisi:</p>
<ul>
  <li>Nama lengkap (h1)</li>
  <li>Foto (img)</li>
  <li>Bio singkat (p)</li>
  <li>Daftar hobi (ul)</li>
  <li>Link sosial media (a)</li>
</ul>

<h2>Penutup</h2>
<p>Selamat! Kamu baru saja membuat halaman HTML pertamamu. Ini adalah langkah kecil, tapi langkah pertama selalu yang paling penting. Di artikel selanjutnya, kita akan belajar <b>CSS</b> untuk mempercantik halaman ini.</p>
<p>Ingat: <b>konsistensi lebih penting daripada intensitas</b>. 30 menit sehari lebih baik daripada 5 jam sekali seminggu.</p>
    `,
  },

  {
    id: 'css-cantik',
    title: 'Membuat Website Cantik dengan CSS dalam 30 Menit',
    category: 'tutorial',
    author: 'Ysdev',
    date: '2026-09-03',
    readTime: 10,
    cover: '🎨',
    excerpt: 'CSS adalah senjata rahasia untuk membuat website terlihat profesional. Pelajari dasar-dasarnya di sini.',
    content: `
<h2>Apa itu CSS?</h2>
<p>CSS singkatan dari <b>Cascading Style Sheets</b>. Kalau HTML adalah kerangka, CSS adalah pakaian, makeup, dan aksesorisnya. Dengan CSS, kamu bisa mengubah warna, ukuran, posisi, animasi — semua aspek visual halaman web.</p>

<h2>Tiga Cara Menambahkan CSS</h2>
<ol>
  <li><b>Inline</b> — langsung di atribut style: <code>&lt;p style="color:red"&gt;</code></li>
  <li><b>Internal</b> — di dalam tag <code>&lt;style&gt;</code> di head</li>
  <li><b>External</b> — file terpisah <code>.css</code> (paling direkomendasikan)</li>
</ol>

<h2>Selector Dasar</h2>
<pre><code>/* Element selector */
h1 { color: blue; }

/* Class selector */
.card { background: white; }

/* ID selector */
#header { padding: 20px; }

/* Universal */
* { margin: 0; padding: 0; }</code></pre>

<h2>Box Model — Konsep Terpenting</h2>
<p>Setiap elemen HTML adalah "kotak" dengan 4 lapisan:</p>
<ol>
  <li><b>Content</b> — isi elemen (teks, gambar)</li>
  <li><b>Padding</b> — jarak dalam dari border ke content</li>
  <li><b>Border</b> — garis tepi</li>
  <li><b>Margin</b> — jarak luar antar elemen</li>
</ol>
<pre><code>.card {
  padding: 20px;
  border: 1px solid #ccc;
  margin: 10px;
}</code></pre>

<h2>Warna & Tipografi</h2>
<pre><code>body {
  font-family: 'Inter', sans-serif;
  color: #333;
  background: #f5f5f5;
  font-size: 16px;
  line-height: 1.6;
}

h1 {
  color: #00e5ff;
  font-size: 48px;
  font-weight: 900;
}</code></pre>

<h2>Layout dengan Flexbox</h2>
<p>Flexbox adalah cara modern untuk layout 1 dimensi:</p>
<pre><code>.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}</code></pre>

<h2>Layout dengan Grid</h2>
<p>Grid untuk layout 2 dimensi (baris + kolom):</p>
<pre><code>.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}</code></pre>

<h2>Responsive dengan Media Query</h2>
<pre><code>/* Default: mobile */
.card { width: 100%; }

/* Tablet ke atas */
@media (min-width: 768px) {
  .card { width: 50%; }
}

/* Desktop ke atas */
@media (min-width: 1024px) {
  .card { width: 33.33%; }
}</code></pre>

<h2>Animasi & Transisi</h2>
<pre><code>.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0,229,255,.5);
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.float { animation: float 3s ease-in-out infinite; }</code></pre>

<h2>Variabel CSS</h2>
<p>Cara modern untuk kelola warna & ukuran:</p>
<pre><code>:root {
  --primary: #00e5ff;
  --bg: #060918;
  --radius: 12px;
}

.btn {
  background: var(--primary);
  border-radius: var(--radius);
}</code></pre>

<h2>Praktik Terbaik</h2>
<ul>
  <li>Gunakan <b>class</b>, hindari <b>id</b> untuk styling</li>
  <li>Beri nama class yang <b>deskriptif</b>: <code>.card-title</code> bukan <code>.ct</code></li>
  <li>Gunakan <b>variabel</b> untuk warna & ukuran yang sering dipakai</li>
  <li>Mobile-first: styling dari layar kecil dulu</li>
  <li>Jangan berlebihan: simple is better</li>
</ul>

<h2>Penutup</h2>
<p>CSS itu luas banget, tapi kamu nggak perlu hafal semua. Yang penting paham <b>box model</b>, <b>flexbox</b>, <b>grid</b>, dan <b>responsive</b>. Sisanya tinggal cari di Google saat butuh.</p>
<p>Latihan terbaik: coba tiru desain website yang kamu suka. Nggak perlu sempurna, yang penting proses belajarnya.</p>
    `,
  },

  {
    id: 'javascript-interaktif',
    title: 'JavaScript: Membuat Website Jadi Hidup',
    category: 'tutorial',
    author: 'Ysdev',
    date: '2026-09-05',
    readTime: 12,
    cover: '⚡',
    excerpt: 'Dari tombol yang bisa diklik sampai animasi keren — semua berkat JavaScript.',
    content: `
<h2>Kenapa JavaScript?</h2>
<p>HTML = struktur, CSS = tampilan, JavaScript = <b>perilaku</b>. Tanpa JS, website hanya bisa dilihat. Dengan JS, website bisa <i>bereaksi</i> terhadap user.</p>
<p>JS juga satu-satunya bahasa yang berjalan native di browser. Kalau kamu mau bikin web interaktif, JS itu wajib.</p>

<h2>Variabel Modern</h2>
<pre><code>let nama = "YadStore";     // bisa diubah
const umur = 5;            // tidak bisa diubah
// var sudah usang, hindari</code></pre>

<h2>Tipe Data</h2>
<pre><code>let angka = 42;              // number
let teks = "halo";           // string
let benar = true;            // boolean
let kosong = null;           // null
let belum;                   // undefined
let arr = [1, 2, 3];         // array
let obj = { nama: "Budi" };  // object</code></pre>

<h2>Function</h2>
<pre><code>// Cara klasik
function sapa(nama) {
  return "Halo " + nama;
}

// Arrow function (modern)
const sapa = (nama) => "Halo " + nama;

// Function tanpa parameter
const halo = () => console.log("Halo!");</code></pre>

<h2>Manipulasi DOM</h2>
<p>DOM = Document Object Model. Ini cara JS "menyentuh" HTML:</p>
<pre><code>// Ambil elemen
const judul = document.getElementById('judul');
const kartu = document.querySelector('.card');

// Ubah konten
judul.textContent = 'Judul Baru';
judul.innerHTML = '&lt;b&gt;Tebal&lt;/b&gt;';

// Ubah style
judul.style.color = 'red';
judul.style.fontSize = '32px';

// Tambah/hapus class
kartu.classList.add('active');
kartu.classList.remove('hidden');
kartu.classList.toggle('dark');</code></pre>

<h2>Event Handling</h2>
<pre><code>const tombol = document.getElementById('tombol');

tombol.addEventListener('click', () => {
  alert('Tombol diklik!');
});

// Event lain: mouseover, keydown, submit, dll</code></pre>

<h2>Array Methods Esensial</h2>
<pre><code>const angka = [1, 2, 3, 4, 5];

// map — transformasi
const dobel = angka.map(n => n * 2);  // [2,4,6,8,10]

// filter — saring
const genap = angka.filter(n => n % 2 === 0);  // [2,4]

// reduce — jumlahkan
const total = angka.reduce((a, b) => a + b, 0);  // 15

// find — cari satu
const found = angka.find(n => n > 3);  // 4

// forEach — loop
angka.forEach(n => console.log(n));</code></pre>

<h2>Async / Await</h2>
<pre><code>async function ambilData() {
  try {
    const res = await fetch('https://api.example.com/data');
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error('Error:', err);
  }
}</code></pre>

<h2>Local Storage</h2>
<pre><code>// Simpan
localStorage.setItem('nama', 'Budi');
localStorage.setItem('skor', '100');

// Ambil
const nama = localStorage.getItem('nama');

// Hapus
localStorage.removeItem('nama');
localStorage.clear();</code></pre>

<h2>Contoh Mini Project: Counter</h2>
<pre><code>&lt;button id="kurang"&gt;-&lt;/button&gt;
&lt;span id="nilai"&gt;0&lt;/span&gt;
&lt;button id="tambah"&gt;+&lt;/button&gt;

&lt;script&gt;
let nilai = 0;
const elNilai = document.getElementById('nilai');

document.getElementById('kurang').onclick = () => {
  nilai--;
  elNilai.textContent = nilai;
};

document.getElementById('tambah').onclick = () => {
  nilai++;
  elNilai.textContent = nilai;
};
&lt;/script&gt;</code></pre>

<h2>Tips Belajar JS</h2>
<ul>
  <li><b>Praktik langsung</b> — jangan cuma nonton tutorial</li>
  <li><b>Baca error</b> — console adalah sahabatmu</li>
  <li><b>Bangun proyek kecil</b> — to-do list, kalkulator, quiz</li>
  <li><b>Baca dokumentasi</b> — MDN adalah referensi terbaik</li>
  <li><b>Jangan takut error</b> — error = belajar</li>
</ul>

<h2>Penutup</h2>
<p>JavaScript itu luas, tapi jangan kewalahan. Fokus ke dasar dulu: variabel, function, DOM, event. Setelah itu, baru eksplor async, fetch, dan framework seperti React atau Vue.</p>
<p>Yang penting: <b>konsisten latihan</b>. Coding itu seperti otot — makin dilatih makin kuat.</p>
    `,
  },

  {
    id: 'python-pemula',
    title: 'Python untuk Pemula: Bahasa Paling Ramah',
    category: 'tutorial',
    author: 'Ysdev',
    date: '2026-09-07',
    readTime: 9,
    cover: '🐍',
    excerpt: 'Python terkenal karena sintaksnya yang sederhana. Ini panduan pertamamu.',
    content: `
<h2>Kenapa Python?</h2>
<p>Python adalah salah satu bahasa pemrograman paling populer di dunia. Digunakan untuk web development, data science, AI, automation, dan masih banyak lagi. Yang membuatnya spesial: <b>sintaksnya sangat mudah dibaca</b>, hampir seperti bahasa Inggris.</p>

<h2>Install Python</h2>
<ol>
  <li>Download dari <b>python.org</b></li>
  <li>Install (centang "Add Python to PATH")</li>
  <li>Buka terminal, ketik <code>python --version</code></li>
</ol>

<h2>Program Pertama</h2>
<pre><code>print("Halo, Dunia!")</code></pre>
<p>Selesai. Itu program Python pertamamu. Bandingkan dengan bahasa lain yang butuh setup panjang. Itulah kenapa Python disebut ramah pemula.</p>

<h2>Variabel</h2>
<pre><code>nama = "Budi"
umur = 17
tinggi = 170.5
aktif = True

print(f"Nama: {nama}, Umur: {umur}")</code></pre>
<p>Python tidak butuh keyword <code>let</code> atau <code>var</code>. Langsung tulis nama variabel dan nilainya.</p>

<h2>Input dari User</h2>
<pre><code>nama = input("Siapa namamu? ")
print(f"Halo, {nama}!")

umur = int(input("Umurmu? "))
print(f"Tahun depan kamu {umur + 1} tahun.")</code></pre>

<h2>Kondisi</h2>
<pre><code>nilai = 85

if nilai >= 90:
    print("Grade A")
elif nilai >= 80:
    print("Grade B")
elif nilai >= 70:
    print("Grade C")
else:
    print("Grade D")</code></pre>

<h2>Loop</h2>
<pre><code># for loop
for i in range(5):
    print(i)

# while loop
n = 0
while n < 5:
    print(n)
    n += 1

# loop list
buah = ["apel", "mangga", "jeruk"]
for b in buah:
    print(b)</code></pre>

<h2>List & Dictionary</h2>
<pre><code># List
angka = [1, 2, 3, 4, 5]
angka.append(6)
print(angka[0])

# Dictionary
user = {
    "nama": "Budi",
    "umur": 17,
    "kota": "Jakarta"
}
print(user["nama"])</code></pre>

<h2>Function</h2>
<pre><code>def sapa(nama):
    return f"Halo, {nama}!"

print(sapa("Budi"))

def luas_persegi(sisi):
    return sisi * sisi

print(luas_persegi(5))</code></pre>

<h2>Class & Object</h2>
<pre><code>class User:
    def __init__(self, nama, umur):
        self.nama = nama
        self.umur = umur

    def sapa(self):
        return f"Halo, saya {self.nama}, {self.umur} tahun"

u = User("Budi", 17)
print(u.sapa())</code></pre>

<h2>Import Library</h2>
<pre><code>import random
import datetime

# Angka random
angka = random.randint(1, 100)

# Tanggal sekarang
sekarang = datetime.datetime.now()
print(sekarang)</code></pre>

<h2>Mini Project: Kalkulator</h2>
<pre><code>def kalkulator():
    print("=== Kalkulator Sederhana ===")
    a = float(input("Angka pertama: "))
    op = input("Operator (+ - * /): ")
    b = float(input("Angka kedua: "))

    if op == "+":
        print(f"Hasil: {a + b}")
    elif op == "-":
        print(f"Hasil: {a - b}")
    elif op == "*":
        print(f"Hasil: {a * b}")
    elif op == "/":
        if b == 0:
            print("Tidak bisa bagi nol!")
        else:
            print(f"Hasil: {a / b}")
    else:
        print("Operator tidak valid")

kalkulator()</code></pre>

<h2>Ke Mana Setelah Ini?</h2>
<ul>
  <li><b>Web</b> → Django, Flask, FastAPI</li>
  <li><b>Data</b> → pandas, numpy, matplotlib</li>
  <li><b>AI/ML</b> → scikit-learn, TensorFlow, PyTorch</li>
  <li><b>Automation</b> → selenium, requests, beautifulsoup</li>
  <li><b>Game</b> → pygame</li>
</ul>

<h2>Penutup</h2>
<p>Python itu pintu masuk yang sempurna ke dunia programming. Jangan terlena dengan betapa mudahnya — tetap butuh latihan untuk mahir.</p>
<p>Mulai dari proyek kecil: kalkulator, to-do list, atau game tebak angka. Semakin banyak proyek, semakin cepat kamu berkembang.</p>
    `,
  },

  {
    id: 'git-github',
    title: 'Git & GitHub: Wajib untuk Semua Developer',
    category: 'tutorial',
    author: 'Ysdev',
    date: '2026-09-09',
    readTime: 11,
    cover: '🔀',
    excerpt: 'Kalau kamu serius mau jadi developer, Git dan GitHub bukan opsional — mereka wajib.',
    content: `
<h2>Apa itu Git?</h2>
<p>Git adalah <b>version control system</b> — alat untuk melacak perubahan kode dari waktu ke waktu. Bayangkan seperti "history" di Google Docs, tapi jauh lebih powerful dan bisa dipakai untuk proyek sebesar apapun.</p>

<h2>Apa itu GitHub?</h2>
<p>GitHub adalah platform online untuk menyimpan proyek Git. Kalau Git itu alatnya, GitHub itu "rumah" untuk proyek kamu. Ada juga alternatif seperti GitLab, Bitbucket, tapi GitHub paling populer.</p>

<h2>Kenapa Wajib?</h2>
<ul>
  <li><b>Backup</b> — kode aman di cloud</li>
  <li><b>Kolaborasi</b> — banyak orang kerja di proyek yang sama</li>
  <li><b>Portfolio</b> — recruiter lihat GitHub kamu</li>
  <li><b>History</b> — bisa balik ke versi lama kapan saja</li>
  <li><b>Branching</b> — coba fitur baru tanpa ganggu kode utama</li>
</ul>

<h2>Setup Awal</h2>
<pre><code>git config --global user.name "Nama Kamu"
git config --global user.email "email@kamu.com"</code></pre>

<h2>Perintah Dasar</h2>

<h3>1. Clone Repository</h3>
<pre><code>git clone https://github.com/user/repo.git</code></pre>

<h3>2. Cek Status</h3>
<pre><code>git status</code></pre>

<h3>3. Tambah ke Staging</h3>
<pre><code>git add file.txt       # satu file
git add .              # semua file</code></pre>

<h3>4. Commit</h3>
<pre><code>git commit -m "feat: tambah fitur login"</code></pre>

<h3>5. Push ke GitHub</h3>
<pre><code>git push origin main</code></pre>

<h3>6. Pull dari GitHub</h3>
<pre><code>git pull origin main</code></pre>

<h2>Conventional Commits</h2>
<p>Biasakan format commit yang rapi:</p>
<ul>
  <li><code>feat:</code> fitur baru</li>
  <li><code>fix:</code> perbaikan bug</li>
  <li><code>docs:</code> dokumentasi</li>
  <li><code>style:</code> formatting</li>
  <li><code>refactor:</code> ubah struktur tanpa ubah fungsi</li>
  <li><code>chore:</code> maintenance</li>
</ul>

<h2>Branching</h2>
<pre><code># Buat branch baru
git checkout -b fitur-login

# Lihat semua branch
git branch

# Pindah branch
git checkout main

# Gabung branch
git merge fitur-login

# Hapus branch
git branch -d fitur-login</code></pre>

<h2>Workflow Tim</h2>
<ol>
  <li>Fork atau clone repo</li>
  <li>Buat branch baru untuk fitur kamu</li>
  <li>Kerjakan, commit secara berkala</li>
  <li>Push branch ke GitHub</li>
  <li>Buat <b>Pull Request</b></li>
  <li>Tim review, kalau OK baru di-merge</li>
</ol>

<h2>.gitignore</h2>
<p>File untuk menentukan apa yang TIDAK di-track Git:</p>
<pre><code>node_modules/
.env
*.log
dist/
.DS_Store</code></pre>

<h2>Kesalahan Umum</h2>
<ul>
  <li><b>Commit file sensitif</b> (password, API key) — pakai .gitignore!</li>
  <li><b>Commit terlalu jarang</b> — commit tiap selesai satu fitur kecil</li>
  <li><b>Commit message asal</b> — "update" tidak informatif</li>
  <li><b>Force push ke main</b> — bisa hilangkan kerjaan orang lain</li>
</ul>

<h2>GitHub Features</h2>
<ul>
  <li><b>Issues</b> — track bug & fitur request</li>
  <li><b>Pull Requests</b> — kolaborasi kode</li>
  <li><b>Actions</b> — CI/CD otomatis</li>
  <li><b>Pages</b> — hosting gratis untuk static site</li>
  <li><b>Projects</b> — kanban board</li>
</ul>

<h2>Penutup</h2>
<p>Git dan GitHub itu skill wajib. Nggak perlu hafal semua perintah — cukup paham konsepnya, sisanya tinggal cari saat butuh.</p>
<p>Buat akun GitHub sekarang kalau belum. Upload proyek pertamamu. Bangun portfolio. 5 tahun dari sekarang, kamu akan berterima kasih ke diri sendiri.</p>
    `,
  },

  /* ==========================================
     📰 BERITA
     ========================================== */
  {
    id: 'ai-masa-depan',
    title: 'AI dan Masa Depan Coding: Ancaman atau Peluang?',
    category: 'berita',
    author: 'Ysdev',
    date: '2026-09-11',
    readTime: 7,
    cover: '🤖',
    excerpt: 'AI seperti ChatGPT dan Copilot makin pintar. Apakah programmer masih dibutuhkan?',
    content: `
<h2>Konteks</h2>
<p>Sejak 2023, AI generatif seperti ChatGPT, Claude, dan GitHub Copilot mengubah cara kita menulis kode. Banyak yang bertanya: apakah programmer masih dibutuhkan? Apakah AI akan menggantikan kita semua?</p>

<h2>Realita</h2>
<p>Faktanya: <b>AI belum bisa menggantikan programmer</b>, tapi AI mengubah cara programmer bekerja. AI menjadi <i>co-pilot</i> — partner yang bantu kita lebih cepat, bukan pengganti kita.</p>

<h2>Apa yang AI Bisa Lakukan</h2>
<ul>
  <li>Menulis boilerplate code (kode template)</li>
  <li>Menjelaskan error message</li>
  <li>Suggest perbaikan</li>
  <li>Convert kode antar bahasa</li>
  <li>Buat unit test</li>
  <li>Refactor kode</li>
</ul>

<h2>Apa yang AI Belum Bisa</h2>
<ul>
  <li>Memahami <b>business logic</b> kompleks</li>
  <li>Design arsitektur sistem besar</li>
  <li>Debug masalah yang belum pernah terjadi</li>
  <li>Komunikasi dengan stakeholder</li>
  <li>Ambil keputusan teknis yang strategis</li>
  <li>Berkolaborasi dalam tim</li>
</ul>

<h2>Skill yang Makin Penting</h2>
<ol>
  <li><b>Problem solving</b> — AI memang pintar, tapi kita yang tahu masalah apa yang harus dipecahkan</li>
  <li><b>System design</b> — AI bisa bikin komponen, kita yang design keseluruhan</li>
  <li><b>Prompt engineering</b> — cara ngomong ke AI biar output bagus</li>
  <li><b>Code review</b> — AI bisa bikin kode, kita yang verify</li>
  <li><b>Soft skills</b> — komunikasi, kolaborasi, leadership</li>
</ol>

<h2>Analogi</h2>
<p>Waktu mesin jahit ditemukan, penjahit nggak hilang — mereka jadi lebih produktif. Waktu kalkulator ditemukan, akuntan nggak hilang — mereka fokus ke analisis. AI akan sama: programmer nggak hilang, tapi perannya berubah.</p>

<h2>Data</h2>
<p>Menurut survei GitHub 2025:</p>
<ul>
  <li>92% developer pakai AI tools</li>
  <li>70% bilang produktivitas naik</li>
  <li>Tapi 88% bilang <b>review manual masih penting</b></li>
</ul>

<h2>Perspektif Sejarah</h2>
<p>Setiap revolusi teknologi selalu ditakuti:</p>
<ul>
  <li>1950-an: "Komputer akan gantikan akuntan" — ternyata tidak</li>
  <li>1980-an: "Spreadsheet akan gantikan akuntan" — ternyata tidak</li>
  <li>2000-an: "Internet akan gantikan toko fisik" — ternyata tidak semua</li>
  <li>2020-an: "AI akan gantikan programmer" — ???</li>
</ul>

<h2>Yang Perlu Kamu Lakukan</h2>
<ol>
  <li><b>Pelajari AI tools</b> — jangan tolak, gunakan</li>
  <li><b>Perkuat fundamental</b> — AI butuh konteks yang jelas</li>
  <li><b>Fokus ke soft skills</b> — yang tidak bisa diotomasi</li>
  <li><b>Berkembang terus</b> — bidang ini bergerak cepat</li>
</ol>

<h2>Kesimpulan</h2>
<p>AI bukan ancaman, tapi <b>peluang</b>. Programmer yang pakai AI akan mengalahkan programmer yang tidak pakai AI. Yang akan hilang bukan profesi programmer, tapi programmer yang tidak mau belajar.</p>
<p>Masa depan itu bukan "AI vs manusia", tapi "manusia dengan AI vs manusia tanpa AI". Pilih tim yang mana?</p>
    `,
  },

  {
    id: 'web3-realita',
    title: 'Web3: Hype atau Masa Depan Internet?',
    category: 'berita',
    author: 'Ysdev',
    date: '2026-09-13',
    readTime: 6,
    cover: '🌐',
    excerpt: 'Web3 dijanjikan sebagai internet terdesentralisasi. Tapi kenyataannya?',
    content: `
<h2>Definisi</h2>
<p>Web3 adalah visi internet generasi ketiga yang <b>terdesentralisasi</b>, dibangun di atas blockchain. Kalau Web1 itu "read-only" (halaman statis), Web2 itu "read-write" (sosial media), maka Web3 dijanjikan "read-write-own" — kamu memiliki data dan aset digitalmu.</p>

<h2>Janji-Jani Web3</h2>
<ul>
  <li>Data milik user, bukan korporasi</li>
  <li>Transaksi tanpa perantara</li>
  <li>Identitas digital yang portabel</li>
  <li>Ekonomi terdesentralisasi (DeFi)</li>
  <li>Aplikasi tanpa izin (permissionless)</li>
</ul>

<h2>Realita Saat Ini</h2>
<p>Jujur saja: Web3 belum sepenuhnya terwujud. Yang ada sekarang:</p>
<ul>
  <li><b>Kripto</b> — sudah nyata, tapi volatil</li>
  <li><b>NFT</b> — hype sudah turun drastis</li>
  <li><b>DeFi</b> — berjalan, tapi niche</li>
  <li><b>dApps</b> — masih sedikit pengguna</li>
  <li><b>DAO</b> — masih eksperimental</li>
</ul>

<h2>Masalah Web3</h2>
<ol>
  <li><b>Kompleksitas</b> — user experience masih buruk</li>
  <li><b>Biaya</b> — gas fee bisa mahal</li>
  <li><b>Kecepatan</b> — blockchain lebih lambat dari database biasa</li>
  <li><b>Skalabilitas</b> — belum bisa handle jutaan user</li>
  <li><b>Regulasi</b> — belum jelas di banyak negara</li>
</ol>

<h2>Yang Sudah Berhasil</h2>
<ul>
  <li><b>Stablecoin</b> — USDT, USDC dipakai untuk remitansi</li>
  <li><b>Smart contract</b> — otomatisasi tanpa perantara</li>
  <li><b>Wallet</b> — MetaMask, dll</li>
  <li><b>Layer 2</b> — Solana, Polygon untuk skalabilitas</li>
</ul>

<h2>Perbandingan</h2>
<p>Web2 vs Web3:</p>
<ul>
  <li><b>Web2</b>: Cepat, murah, user-friendly, tapi terpusat</li>
  <li><b>Web3</b>: Transparan, user-owned, tapi lambat & mahal</li>
</ul>
<p>Mana yang lebih baik? Tergantung use case. Untuk sosial media sehari-hari, Web2 masih menang. Untuk transaksi keuangan lintas negara, Web3 lebih unggul.</p>

<h2>Pendapat Developer</h2>
<p>Sebagai developer, penting untuk <b>belajar konsep Web3</b> tanpa terjebak hype. Pahami:</p>
<ul>
  <li>Cara kerja blockchain</li>
  <li>Smart contract (Solidity)</li>
  <li>Wallet & signing</li>
  <li>Konsep decentralisasi</li>
</ul>
<p>Tapi juga kritis: tidak semua yang disebut "Web3" itu benar-benar terdesentralisasi. Banyak proyek hanya pakai buzzword.</p>

<h2>Kesimpulan</h2>
<p>Web3 itu bukan scam, tapi juga bukan revolusi instan. Ini evolusi bertahap. Beberapa bagian akan bertahan (smart contract, stablecoin), beberapa akan hilang (NFT hype).</p>
<p>Pelajari konsepnya. Jangan FOMO. Fokus ke fundamental. Kalau Web3 benar-benar jadi masa depan, kamu sudah siap. Kalau tidak, kamu tidak kehilangan apa-apa.</p>
    `,
  },

  {
    id: 'no-code-developer',
    title: 'No-Code Tools: Apakah Developer Masih Dibutuhkan?',
    category: 'berita',
    author: 'Ysdev',
    date: '2026-09-15',
    readTime: 7,
    cover: '🧱',
    excerpt: 'Webflow, Bubble, Framer makin canggih. Apakah kita masih perlu belajar coding?',
    content: `
<h2>Apa itu No-Code?</h2>
<p>No-code adalah platform yang memungkinkan orang membuat aplikasi <b>tanpa menulis kode</b>. Contoh: Webflow (website), Bubble (web app), Glide (mobile app), Zapier (automation).</p>

<h2>Kemampuan No-Code</h2>
<ul>
  <li>Landing page</li>
  <li>E-commerce sederhana</li>
  <li>Form & survey</li>
  <li>Internal tools</li>
  <li>Automation workflow</li>
  <li>Prototype aplikasi</li>
</ul>

<h2>Keterbatasan No-Code</h2>
<ul>
  <li><b>Customization terbatas</b> — mentok di fitur platform</li>
  <li><b>Vendor lock-in</b> — susah pindah platform</li>
  <li><b>Performa</b> — biasanya lebih lambat dari kode custom</li>
  <li><b>Skalabilitas</b> — susah handle jutaan user</li>
  <li><b>Biaya jangka panjang</b> — subscription bisa mahal</li>
  <li><b>Kompleksitas logic</b> — susah untuk algoritma rumit</li>
</ul>

<h2>Kapan No-Code Cocok</h2>
<ul>
  <li>MVP (Minimum Viable Product)</li>
  <li>Internal tools perusahaan</li>
  <li>Prototype cepat</li>
  <li>Landing page marketing</li>
  <li>Side project</li>
  <li>Non-developer yang butuh tools</li>
</ul>

<h2>Kapan Harus Coding</h2>
<ul>
  <li>Aplikasi dengan logic kompleks</li>
  <li>Butuh performa tinggi</li>
  <li>Skala besar (jutaan user)</li>
  <li>Integrasi sistem kustom</li>
  <li>Keamanan tingkat tinggi</li>
  <li>Butuh kontrol penuh</li>
</ul>

<h2>Ancaman atau Peluang?</h2>
<p>No-code <b>bukan ancaman</b> untuk developer. Justru sebaliknya — no-code menciptakan <b>permintaan baru</b>. Perusahaan yang pakai no-code untuk 80% kebutuhannya tetap butuh developer untuk 20% yang kustom.</p>
<p>No-code juga membebaskan developer dari pekerjaan repetitif. Daripada bikin landing page dari nol, developer bisa fokus ke fitur inti.</p>

<h2>Analogi</h2>
<p>Sama seperti WordPress. Dulu orang takut WordPress akan gantikan web developer. Faktanya: WordPress membuka pasar untuk jutaan website, dan developer yang spesialis WordPress malah kebanjiran order.</p>

<h2>Skill yang Tetap Penting</h2>
<ul>
  <li><b>Fundamental coding</b> — untuk hal yang tidak bisa no-code</li>
  <li><b>System thinking</b> — design arsitektur</li>
  <li><b>Problem solving</b> — no-code nggak bisa solve semua</li>
  <li><b>Integrasi</b> — sambungin berbagai tools</li>
  <li><b>Customization</b> — tambah kode di atas no-code</li>
</ul>

<h2>Hybrid Approach</h2>
<p>Pendekatan modern: <b>no-code dulu, code kalau perlu</b>. Mulai dengan tool no-code untuk validasi ide. Kalau sudah terbukti, baru invest ke custom development.</p>

<h2>Kesimpulan</h2>
<p>No-code dan coding bukan musuh. Mereka <b>saling melengkapi</b>. No-code untuk cepat & murah, coding untuk kontrol & skala.</p>
<p>Yang perlu kamu lakukan: <b>pahami keduanya</b>. Tahu kapan pakai no-code, tahu kapan harus coding. Itu skill yang langka dan bernilai.</p>
    `,
  },

  {
    id: 'remote-work-2026',
    title: 'Remote Work di 2026: Tren dan Tantangan',
    category: 'berita',
    author: 'Ysdev',
    date: '2026-09-17',
    readTime: 6,
    cover: '🏠',
    excerpt: 'Setelah pandemi, remote work jadi norma baru. Tapi apakah semua kembali ke kantor?',
    content: `
<h2>Sejarah Singkat</h2>
<p>Sebelum 2020, remote work itu privilege. Waktu pandemi, semua dipaksa WFH. Setelah pandemi, banyak perusahaan bingung: kembali ke kantor, atau lanjut remote?</p>

<h2>Data 2026</h2>
<ul>
  <li><b>35%</b> pekerja tech full remote</li>
  <li><b>45%</b> hybrid (2-3 hari di kantor)</li>
  <li><b>20%</b> full office</li>
  <li>Perusahaan yang full remote: GitLab, Automattic, Zapier</li>
  <li>Perusahaan yang paksa kembali: Amazon, Google, Apple</li>
</ul>

<h2>Tren 2026</h2>
<ol>
  <li><b>Hybrid jadi default</b> — bukan full remote atau full office</li>
  <li><b>Async communication</b> — kerja kapan saja, yang penting selesai</li>
  <li><b>Global hiring</b> — perusahaan hire dari seluruh dunia</li>
  <li><b>Co-working space</b> — naik lagi untuk freelancer</li>
  <li><b>Digital nomad</b> — makin banyak, terutama developer</li>
</ol>

<h2>Keuntungan Remote</h2>
<ul>
  <li>Hemat waktu & biaya commuting</li>
  <li>Fleksibilitas waktu</li>
  <li>Bisa kerja dari mana saja</li>
  <li>Kesempatan global</li>
  <li>Work-life balance lebih baik (kalau diatur)</li>
</ul>

<h2>Tantangan Remote</h2>
<ul>
  <li><b>Isolasi sosial</b> — kurang interaksi manusia</li>
  <li><b>Blur batas kerja & pribadi</b> — kerja jadi 24/7</li>
  <li><b>Komunikasi</b> — lebih susah dari tatap muka</li>
  <li><b>Overwork</b> — susah "pulang" karena rumah = kantor</li>
  <li><b>Karier</b> — visibility lebih rendah untuk promosi</li>
</ul>

<h2>Skill yang Penting di Remote</h2>
<ol>
  <li><b>Komunikasi tertulis</b> — Slack, email, dokumentasi</li>
  <li><b>Manajemen waktu</b> — tanpa atasan mengawasi</li>
  <li><b>Self-motivation</b> — nggak ada yang nyuruh</li>
  <li><b>Async collaboration</b> — kerja lintas timezone</li>
  <li><b>Digital tools</b> — Notion, Figma, Linear, dll</li>
</ol>

<h2>Setup Ideal untuk Remote</h2>
<ul>
  <li><b>Kursi ergonomis</b> — jangan remehkan kesehatan punggung</li>
  <li><b>Meja terpisah</b> — kalau bisa, ruangan khusus</li>
  <li><b>Internet stabil</b> — invest ke koneksi yang bagus</li>
  <li><b>Headset</b> — untuk meeting</li>
  <li><b>Pencahayaan baik</b> — hindari mata lelah</li>
</ul>

<h2>Masa Depan</h2>
<p>Saya percaya <b>hybrid akan jadi norma</b>. Full remote mungkin hanya untuk perusahaan tertentu (terutama startup & tech companies). Full office akan jadi minoritas.</p>
<p>Yang penting bukan "di mana kerja", tapi "bagaimana kerja". Output lebih penting dari kehadiran.</p>

<h2>Tips untuk Remote Worker</h2>
<ul>
  <li><b>Rutinitas pagi</b> — bangun, olahraga, mandi, baru kerja</li>
  <li><b>Jadwal jelas</b> — jam mulai & selesai</li>
  <li><b>Ruang khusus</b> — jangan kerja di kasur</li>
  <li><b>Interaksi sosial</b> — lunch bareng teman, join komunitas</li>
  <li><b>Istirahat teratur</b> — tiap 50 menit, 10 menit break</li>
</ul>

<h2>Kesimpulan</h2>
<p>Remote work bukan untuk semua orang, dan bukan untuk semua pekerjaan. Tapi untuk developer, ini <b>peluang emas</b> untuk bekerja di perusahaan global tanpa pindah negara.</p>
<p>Kalau kamu nyaman remote, bangun skill komunikasi dan self-management. Kalau kamu lebih suka kantor, cari perusahaan hybrid. Yang penting: <b>tahu apa yang kamu butuhkan</b>.</p>
    `,
  },

  /* ==========================================
     💭 OPINI
     ========================================== */
  {
    id: 'jangan-takut-error',
    title: 'Jangan Takut Error: Filosofi Belajar Coding',
    category: 'opini',
    author: 'Ysdev',
    date: '2026-09-19',
    readTime: 5,
    cover: '💭',
    excerpt: 'Error bukan tanda kegagalan — dia adalah guru terbaik seorang programmer.',
    content: `
<h2>Ketakutan Pemula</h2>
<p>Salah satu hal yang paling menghambat pemula belajar coding adalah <b>takut error</b>. Melihat tulisan merah di console bikin panik. "Kenapa kodeku nggak jalan? Apa aku bodoh?"</p>
<p>Saya di sini untuk bilang: <b>berhenti takut</b>. Error itu bukan musuh. Error itu guru.</p>

<h2>Realita Programmer Profesional</h2>
<p>Programmer dengan 10 tahun pengalaman masih error setiap hari. Bedanya: mereka <b>tidak panik</b>. Mereka baca error message, pahami penyebabnya, cari solusi, perbaiki, lanjut.</p>
<p>Faktanya: <b>semua programmer error</b>. Semua. Termasuk yang di Google, Microsoft, Apple. Bedanya cuma pengalaman dalam menghadapi.</p>

<h2>Error = Belajar</h2>
<p>Setiap error adalah kesempatan belajar:</p>
<ul>
  <li><b>Syntax error</b> — belajar aturan bahasa</li>
  <li><b>Type error</b> — belajar tipe data</li>
  <li><b>Reference error</b> — belajar scope & deklarasi</li>
  <li><b>Logic error</b> — belajar berpikir algoritmik</li>
</ul>
<p>Kalau kode kamu jalan sempurna dari awal, berarti kamu <b>tidak belajar apa-apa</b>. Yang belajar adalah ketika kamu stuck, cari solusi, dan berhasil.</p>

<h2>Kisah Nyata</h2>
<p>Waktu saya pertama kali belajar JavaScript, saya habis <b>3 jam</b> cari error hanya karena salah tulis <code>=</code> vs <code>===</code>. Frustrasi? Ya. Tapi saya tidak pernah lupa pelajaran itu sampai sekarang.</p>
<p>Sekarang, ketika lihat error itu lagi, saya langsung tahu. Itu hasil dari pengalaman.</p>

<h2>Cara Menghadapi Error</h2>
<ol>
  <li><b>Baca pesan error</b> — jangan di-skip</li>
  <li><b>Cari baris error</b> — pesan biasanya kasih nomor baris</li>
  <li><b>Isolasi masalah</b> — comment kode sampai ketemu yang salah</li>
  <li><b>Google error message</b> — orang lain pasti pernah kena</li>
  <li><b>Rubber duck debugging</b> — jelaskan kode ke bebek/benda mati</li>
  <li><b>Istirahat</b> — kadang 15 menit break lebih efektif dari 3 jam ngoding</li>
</ol>

<h2>Mindset yang Salah</h2>
<ul>
  <li>❌ "Kalau error, berarti aku gagal" → ✅ "Error = data untuk belajar"</li>
  <li>❌ "Programmer hebat tidak error" → ✅ "Programmer hebat error lebih cepat dan lebih baik"</li>
  <li>❌ "Aku terlalu bodoh untuk ini" → ✅ "Aku sedang belajar, semua butuh waktu"</li>
  <li>❌ "Kode orang lain selalu sempurna" → ✅ "Kamu hanya tidak lihat proses debug-nya"</li>
</ul>

<h2>Growth Mindset</h2>
<p>Carol Dweck, psikolog Stanford, bedakan dua mindset:</p>
<ul>
  <li><b>Fixed mindset</b> — bakat itu bawaan, gagal = bukti tidak berbakat</li>
  <li><b>Growth mindset</b> — kemampuan bisa dilatih, gagal = kesempatan belajar</li>
</ul>
<p>Programmer sukses punya <b>growth mindset</b>. Mereka tidak takut salah. Mereka takut <b>tidak berkembang</b>.</p>

<h2>Error di Dunia Nyata</h2>
<p>Beberapa bug paling terkenal dalam sejarah:</p>
<ul>
  <li><b>Ariane 5 rocket</b> — meledak karena integer overflow</li>
  <li><b>Mars Climate Orbiter</b> — hilang karena salah satuan (metric vs imperial)</li>
  <li><b>Knight Capital</b> — rugi $440 juta dalam 45 menit karena bug</li>
  <li><b>Therac-25</b> — radiasi berlebih karena race condition</li>
</ul>
<p>Semua bug ini dibuat oleh programmer berpengalaman. Artinya: <b>error itu normal</b>, bahkan untuk yang terbaik.</p>

<h2>Kesimpulan</h2>
<p>Jangan takut error. <b>Rangkul error</b>. Error adalah tanda kamu sedang belajar, sedang tumbuh, sedang jadi lebih baik.</p>
<p>Setiap programmer yang kamu kagumi pernah jadi pemula yang error ratusan kali. Bedanya: mereka tidak berhenti.</p>
<p><b>Keep coding. Keep erroring. Keep growing.</b> 🚀</p>
    `,
  },

  {
    id: 'tutorial-vs-proyek',
    title: 'Tutorial Hell: Kenapa Nonton Tutorial Terus Bikin Stuck',
    category: 'opini',
    author: 'Ysdev',
    date: '2026-09-21',
    readTime: 6,
    cover: '📺',
    excerpt: 'Nonton 100 jam tutorial tidak sama dengan bisa coding. Ini fenomena "tutorial hell" dan cara keluarnya.',
    content: `
<h2>Apa itu Tutorial Hell?</h2>
<p>Tutorial hell adalah kondisi di mana kamu terus menonton tutorial, mengikuti kursus, membaca buku — tapi tetap <b>tidak bisa membangun apapun sendiri</b>. Kamu paham konsepnya, tapi ketika buka editor kosong, bingung mulai dari mana.</p>

<h2>Gejalanya</h2>
<ul>
  <li>Sudah nonton puluhan jam tutorial</li>
  <li>Punya banyak sertifikat kursus</li>
  <li>Tapi belum pernah bikin proyek sendiri</li>
  <li>Kalau buka editor kosong, bingung</li>
  <li>Merasa "belum siap" untuk proyek nyata</li>
  <li>Terus cari "tutorial yang lebih bagus"</li>
</ul>

<h2>Kenapa Terjadi?</h2>
<p>Bukan salah kamu — ini masalah struktural:</p>
<ol>
  <li><b>Tutorial itu pasif</b> — kamu menonton, bukan mengerjakan</li>
  <li><b>Ada jawaban di depan mata</b> — kamu ikut, bukan mikir</li>
  <li><b>Tidak ada masalah nyata</b> — semua sudah diatur</li>
  <li><b>Dopamin instan</b> — nonton terasa produktif, padahal tidak</li>
  <li><b>Terlalu banyak pilihan</b> — bingung mana yang "benar"</li>
</ol>

<h2>Analogi</h2>
<p>Nonton tutorial coding itu seperti nonton video tutorial renang. Kamu bisa hafal semua teori: cara gerakkan tangan, cara napas, cara tendang kaki. Tapi begitu masuk kolam, kamu tetap tenggelam.</p>
<p>Kenapa? Karena <b>renang itu skill, bukan pengetahuan</b>. Coding juga.</p>

<h2>Tanda Kamu di Tutorial Hell</h2>
<ul>
  <li>Sudah nonton 5+ tutorial hal yang sama</li>
  <li>Belum pernah bikin proyek dari nol</li>
  <li>Kalau stuck, langsung cari tutorial</li>
  <li>Bisa jelaskan konsep, tapi tidak bisa implementasi</li>
  <li>Merasa "hampir siap" tapi tidak pernah mulai</li>
</ul>

<h2>Cara Keluar</h2>
<ol>
  <li><b>Stop nonton, mulai ngoding</b> — begitu paham dasar, langsung praktik</li>
  <li><b>Bangun proyek kecil</b> — to-do list, kalkulator, quiz</li>
  <li><b>Batasi tutorial</b> — maksimal 20% nonton, 80% praktik</li>
  <li><b>Terima ketidaksempurnaan</b> — proyek jadi jelek, itu normal</li>
  <li><b>Debug sendiri</b> — sebelum Google, coba 15 menit sendiri</li>
  <li><b>Bangun berulang</b> — bikin 10 proyek kecil > 1 proyek sempurna</li>
</ol>

<h2>Metode 80/20</h2>
<p>Rule of thumb: <b>20% waktu untuk belajar teori, 80% untuk praktik</b>. Kalau kamu nonton 2 jam, harus ngoding 8 jam. Kalau tidak, kamu cuma mengumpulkan pengetahuan tanpa skill.</p>

<h2>Proyek untuk Pemula</h2>
<p>Mulai dari yang kecil:</p>
<ul>
  <li><b>Level 1</b>: To-do list, kalkulator, jam digital</li>
  <li><b>Level 2</b>: Quiz app, weather app, notes app</li>
  <li><b>Level 3</b>: Blog sederhana, e-commerce, chat app</li>
  <li><b>Level 4</b>: Aplikasi dengan database, authentication</li>
</ul>
<p>Kuncinya: <b>mulai dari yang bisa kamu selesaikan</b>, bukan yang paling keren.</p>

<h2>Filosofi "Done is Better than Perfect"</h2>
<p>Proyek yang selesai (walaupun jelek) lebih berharga dari proyek yang sempurna (tapi tidak selesai). Karena kamu belajar dari <b>menyelesaikan</b>, bukan dari <b>merencanakan</b>.</p>

<h2>Kesimpulan</h2>
<p>Tutorial itu alat, bukan tujuan. Gunakan seperlunya. Setelah paham dasar, <b>keluar dari zona nyaman</b> dan bangun sesuatu.</p>
<p>Ingat: <b>programmer belajar dengan menulis kode</b>, bukan dengan menonton orang menulis kode. Kode pertama kamu akan jelek. Kode ke-100 akan lebih baik. Kode ke-1000 akan hebat.</p>
<p>Stop watching. Start building. 🚀</p>
    `,
  },

  {
    id: 'coding-bukan-bakat',
    title: 'Coding Bukan Bakat, Tapi Latihan',
    category: 'opini',
    author: 'Ysdev',
    date: '2026-09-23',
    readTime: 5,
    cover: '🏋️',
    excerpt: 'Banyak yang berpikir programmer itu "berbakat". Ini salah besar.',
    content: `
<h2>Mitos Bakat</h2>
<p>Masyarakat kita percaya bahwa programmer itu "<b>orang jenius</b>". Mereka yang bisa coding itu "berbakat matematika", "otak kiri dominan", atau "memang dari sononya pinter".</p>
<p>Ini <b>mitos</b>. Dan mitos ini berbahaya karena bikin banyak orang menyerah sebelum mulai.</p>

<h2>Realita</h2>
<p>Kebenarannya: <b>coding adalah skill, bukan bakat</b>. Seperti bahasa, memasak, atau olahraga. Semua orang bisa belajar kalau mau.</p>
<p>Tentu ada yang belajar lebih cepat dari yang lain. Tapi kecepatan bukan segalanya. <b>Konsistensi</b> jauh lebih penting.</p>

<h2>Data</h2>
<p>Penelitian Anders Ericsson tentang "deliberate practice" menunjukkan: <b>10.000 jam latihan terfokus</b> adalah yang membedakan expert dari amatir. Bukan IQ. Bukan bakat. Latihan.</p>
<p>Banyak programmer top dunia yang <b>bukan</b> dari sekolah elite, <b>bukan</b> juara olimpiade, <b>bukan</b> anak berbakat. Mereka cuma <b>tidak berhenti</b>.</p>

<h2>Kisah Nyata</h2>
<ul>
  <li><b>Mark Zuckerberg</b> — mulai coding umur 12, tapi bukan karena bakat, karena minat</li>
  <li><b>Linus Torvalds</b> — buat Linux di umur 21, setelah bertahun-tahun ngoprek komputer</li>
  <li><b>Margaret Hamilton</b> — bikin software Apollo 11, belajar sambil kerja</li>
  <li>Dan jutaan programmer biasa yang tidak terkenal, yang juga hebat</li>
</ul>

<h2>Bakat vs Latihan</h2>
<ul>
  <li><b>Bakat</b> — bawaan, tidak bisa diubah, tidak bisa diandalkan</li>
  <li><b>Latihan</b> — bisa dilakukan siapa saja, kapan saja, hasil bisa diprediksi</li>
</ul>
<p>Orang dengan bakat tapi malas akan kalah dari orang biasa yang tekun. Setiap saat.</p>

<h2>Kalau Bukan Bakat, Apa?</h2>
<ol>
  <li><b>Minat</b> — kamu harus menikmati prosesnya</li>
  <li><b>Konsistensi</b> — 1 jam sehari lebih baik dari 10 jam seminggu sekali</li>
  <li><b>Rasa ingin tahu</b> — selalu bertanya "kenapa" dan "bagaimana"</li>
  <li><b>Mentalitas growth</b> — percaya bisa berkembang</li>
  <li><b>Komunitas</b> — belajar bareng lebih efektif</li>
</ol>

<h2>Analogi</h2>
<p>Bayangkan kamu mau belajar gitar. Apakah kamu butuh "bakat gitar"? Tidak. Kamu butuh:</p>
<ul>
  <li>Gitar (alat yang tepat)</li>
  <li>Guru/tutorial (bimbingan)</li>
  <li>Latihan rutin (jam terbang)</li>
  <li>Kesabaran (hasil tidak instan)</li>
</ul>
<p>Sama dengan coding. Tidak ada yang namanya "bakat coding". Yang ada: <b>latihan coding</b>.</p>

<h2>Yang Bikin Orang Gagal</h2>
<ul>
  <li><b>Ekspektasi tidak realistis</b> — mau jago dalam 1 bulan</li>
  <li><b>Bandingkan diri dengan senior</b> — lupa mereka mulai dari nol</li>
  <li><b>Tidak sabar</b> — berhenti saat hasil belum kelihatan</li>
  <li><b>Belajar pasif</b> — nonton tutorial tanpa praktik</li>
  <li><b>Sendiri</b> — tanpa komunitas, mudah menyerah</li>
</ul>

<h2>Tips untuk Pemula</h2>
<ul>
  <li><b>Mulai kecil</b> — jangan langsung mau bikin Facebook</li>
  <li><b>Rayakan progress kecil</b> — setiap bug yang berhasil di-fix</li>
  <li><b>Bergabung komunitas</b> — Discord, Reddit, lokal</li>
  <li><b>Ajari orang lain</b> — mengajar = belajar dua kali</li>
  <li><b>Jangan berhenti</b> — yang penting konsisten</li>
</ul>

<h2>Kesimpulan</h2>
<p>Kalau kamu bisa belajar bahasa Indonesia, kamu bisa belajar bahasa pemrograman. Kalau kamu bisa belajar matematika dasar, kamu bisa belajar logika coding.</p>
<p>Bukan bakat yang menentukan, tapi <b>kemauan untuk terus belajar</b>. Setiap programmer hebat dulunya pemula yang tidak menyerah.</p>
<p>Kamu bisa. Mulai hari ini. 🚀</p>
    `,
  },

  {
    id: 'gaji-programmer',
    title: 'Berapa Gaji Programmer di 2026? Ini Faktanya',
    category: 'opini',
    author: 'Ysdev',
    date: '2026-09-25',
    readTime: 7,
    cover: '💰',
    excerpt: 'Mau jadi programmer karena gaji tinggi? Simak dulu realitanya.',
    content: `
<h2>Alasan Banyak Orang Belajar Coding</h2>
<p>Jujur saja — banyak yang belajar coding karena <b>gaji tinggi</b>. Ini wajar. Siapa yang tidak mau penghasilan besar? Tapi sebelum terjun, penting tahu realitanya.</p>

<h2>Range Gaji Programmer (Indonesia, 2026)</h2>
<ul>
  <li><b>Fresh graduate</b>: Rp 5-10 juta/bulan</li>
  <li><b>1-3 tahun</b>: Rp 10-18 juta/bulan</li>
  <li><b>3-5 tahun</b>: Rp 18-30 juta/bulan</li>
  <li><b>Senior (5+ tahun)</b>: Rp 30-60 juta/bulan</li>
  <li><b>Tech Lead / Architect</b>: Rp 60-120 juta/bulan</li>
</ul>
<p>Angka ini variatif tergantung perusahaan, kota, dan skill.</p>

<h2>Range Gaji Remote (Global)</h2>
<ul>
  <li><b>Junior</b>: $30-60k/tahun (Rp 40-80 juta/bulan)</li>
  <li><b>Mid</b>: $60-120k/tahun (Rp 80-160 juta/bulan)</li>
  <li><b>Senior</b>: $120-250k/tahun (Rp 160-330 juta/bulan)</li>
  <li><b>Staff/Principal</b>: $250-500k+/tahun</li>
</ul>
<p>Ini yang bikin banyak orang Indonesia tertarik remote work. Gaji US, biaya hidup Indonesia.</p>

<h2>Faktor yang Mempengaruhi Gaji</h2>
<ol>
  <li><b>Skill</b> — bukan hanya tahu, tapi mahir</li>
  <li><b>Pengalaman</b> — tahun kerja, tapi kualitas lebih penting</li>
  <li><b>Portfolio</b> — proyek nyata lebih berharga dari CV</li>
  <li><b>Bahasa Inggris</b> — buka peluang global</li>
  <li><b>Spesialisasi</b> — AI/ML biasanya lebih tinggi</li>
  <li><b>Soft skills</b> — komunikasi, leadership</li>
  <li><b>Lokasi</b> — Jakarta > kota lain (tapi remote mengubah ini)</li>
  <li><b>Perusahaan</b> — startup vs korporat vs unicorn</li>
</ol>

<h2>Spesialisasi Paling Dibayar</h2>
<ol>
  <li><b>AI/ML Engineer</b> — paling tinggi saat ini</li>
  <li><b>Blockchain Developer</b> — niche tapi mahal</li>
  <li><b>DevOps/SRE</b> — selalu dicari</li>
  <li><b>Security Engineer</b> — specialist</li>
  <li><b>Data Engineer</b> — high demand</li>
  <li><b>Full-stack Developer</b> — fleksibel</li>
  <li><b>Mobile Developer</b> — iOS lebih tinggi dari Android</li>
</ol>

<h2>Realita yang Jarang Dibahas</h2>
<ul>
  <li><b>Tidak semua programmer gaji besar</b> — banyak yang stuck di 5-10 juta</li>
  <li><b>Gaji tinggi butuh pengalaman</b> — bukan langsung setelah kursus 3 bulan</li>
  <li><b>Perlu terus belajar</b> — teknologi berubah cepat</li>
  <li><b>Stress tinggi</b> — deadline, bug, on-call</li>
  <li><b>Burnout nyata</b> — banyak programmer mengalami</li>
  <li><b>Kerja bisa 60+ jam/minggu</b> — terutama di startup</li>
</ul>

<h2>Kisah Nyata</h2>
<p>Saya kenal programmer yang belajar sendiri (self-taught), mulai dari nol, dan sekarang gaji <b>$150k/tahun</b> kerja remote untuk perusahaan US. Butuh <b>5 tahun</b> konsisten.</p>
<p>Saya juga kenal yang sudah 3 tahun coding tapi gaji masih <b>Rp 8 juta</b>, karena tidak upgrade skill dan tidak punya portfolio.</p>
<p>Bedanya: <b>usaha dan strategi</b>, bukan keberuntungan.</p>

<h2>Kalau Mau Gaji Tinggi</h2>
<ol>
  <li><b>Kuasai fundamental</b> — jangan cuma framework</li>
  <li><b>Bangun portfolio</b> — GitHub adalah CV baru</li>
  <li><b>Belajar bahasa Inggris</b> — buka peluang global</li>
  <li><b>Spesialisasi</b> — jangan generalis semua</li>
  <li><b>Networking</b> — banyak peluang dari koneksi</li>
  <li><b>Jangan puas</b> — terus belajar & naik level</li>
</ol>

<h2>Peringatan</h2>
<p>Jangan belajar coding <b>hanya</b> karena uang. Kalau tidak menikmati prosesnya, kamu akan:</p>
<ul>
  <li>Stress berat</li>
  <li>Burnout</li>
  <li>Berhenti di tengah jalan</li>
  <li>Jadi programmer "medioker" yang tidak berkembang</li>
</ul>
<p>Uang itu <b>hasil</b>, bukan <b>tujuan</b>. Fokus ke skill, uang akan mengikuti.</p>

<h2>Kesimpulan</h2>
<p>Ya, programmer bisa bergaji besar. Tapi itu <b>tidak instan</b> dan <b>tidak otomatis</b>. Butuh kerja keras, konsistensi, dan strategi.</p>
<p>Kalau kamu serius, mulai hari ini. Bangun skill. Bangun portfolio. Dalam 3-5 tahun, kamu bisa ada di posisi yang kamu impikan.</p>
<p>Tapi ingat: <b>yang penting bukan gajinya, tapi kebebasan dan kepuasan kerja</b>. Programmer bisa kerja remote, fleksibel waktu, dan menciptakan sesuatu yang berdampak. Itu yang jauh lebih berharga dari angka di rekening.</p>
    `,
  },

  /* ==========================================
     📖 NOVEL
     ========================================== */
  {
    id: 'novel-kode-pertama',
    title: 'Novel: Kode Pertama — Bab 1',
    category: 'novel',
    author: 'Ysdev',
    date: '2026-09-26',
    readTime: 12,
    cover: '📖',
    excerpt: 'Kisah seorang pemuda desa yang menemukan passion coding dari warnet sederhana.',
    content: `
<h2>Prolog: Layar yang Menyala</h2>
<p>Malam itu hujan turun deras di desa kecil di kaki gunung. Rian, 16 tahun, duduk di bangku kayu warnet Pak Slamet. Wajahnya diterangi cahaya layar komputer tua yang berkedip-kedip.</p>
<p>Di depannya, sebuah halaman web sederhana terbuka: latar putih, teks hitam, tulisan besar di tengah: <b>"Hello, World!"</b>.</p>
<p>Rian menatapnya lama. Ada yang aneh dari perasaan itu — campuran kagum, bingung, dan semangat. Bagaimana mungkin beberapa baris teks bisa membuat komputer menampilkan sesuatu?</p>
<p>Dia belum tahu, tapi malam itu adalah awal dari segalanya.</p>

<h2>Bab 1: Warnet dan Mimpi</h2>
<p>Rian tinggal bersama neneknya di desa Sukamaju. Orang tuanya merantau ke kota, jarang pulang. Ekonomi keluarga pas-pasan. Komputer bukan barang yang bisa dimiliki sembarang orang di desanya.</p>
<p>Satu-satunya akses Rian ke dunia digital adalah warnet Pak Slamet — 6 komputer tua, tarif Rp 3.000 per jam. Rian sering hanya punya Rp 1.000, cukup untuk 20 menit. Tapi 20 menit itu sangat berharga.</p>

<h2>Penemuan</h2>
<p>Suatu hari, Rian melihat kakak kelasnya, Doni, sedang mengetik sesuatu di Notepad. Bukan sekadar mengetik — Doni menulis kode.</p>
<p>"Itu apa?" tanya Rian.</p>
<p>"HTML," jawab Doni singkat. "Bikin website."</p>
<p>Rian terpesona. Dia duduk di samping Doni, memperhatikan setiap baris yang ditulis. Doni menjelaskan dasar-dasarnya: tag, elemen, atribut. Rian menyerap semuanya seperti spons.</p>
<p>"Kamu bisa coba," kata Doni sambil berdiri. "Aku udah mau pulang."</p>
<p>Sesi itu tersisa 30 menit. Rian langsung duduk, buka Notepad, dan mulai menulis baris pertama:</p>
<pre><code>&lt;h1&gt;Halo Dunia&lt;/h1&gt;</code></pre>
<p>Dia save sebagai <code>coba.html</code>, buka di browser. Muncul tulisan tebal besar. Rian tersenyum lebar. Itu momen ajaib.</p>

<h2>Belajar Sendiri</h2>
<p>Sejak hari itu, Rian mulai belajar coding setiap kali ada kesempatan. Uang jajan disisihkan. Waktu istirahat dipakai ke warnet. Buku-buku pemrograman dipinjam dari perpustakaan sekolah (walau jumlahnya sedikit).</p>
<p>Yang paling membantu: HP Android seharga Rp 800 ribu, pemberian orang tuanya waktu pulang lebaran. Dengan HP itu, Rian bisa belajar coding di kamar, tanpa bayar warnet.</p>
<p>Dia install aplikasi text editor. Buka browser. Belajar dari tutorial YouTube (download pakai WiFi gratis di balai desa).</p>

<h2>Tantangan</h2>
<p>Belajar coding tanpa mentor tidak mudah. Rian sering stuck berhari-hari karena:</p>
<ul>
  <li>Tidak paham error message</li>
  <li>Tidak ada yang bisa ditanya</li>
  <li>Koneksi internet lambat</li>
  <li>Uang tidak cukup untuk kursus</li>
</ul>
<p>Tapi Rian tidak menyerah. Setiap error dianggap pelajaran. Setiap stuck dianggap ujian.</p>

<h2>Penemuan Penting</h2>
<p>Suatu malam, Rian menemukan <b>freeCodeCamp</b> — platform belajar coding gratis. Di situ ada ratusan jam materi, dari HTML sampai algoritma. Rian terharu — akhirnya dia punya akses ke pendidikan yang layak.</p>
<p>Dia mulai ikut kursus online. Ikut komunitas Discord. Bertanya kepada senior via forum. Pelan-pelan, potongan puzzle mulai nyambung.</p>

<h2>Proyek Pertama</h2>
<p>Setelah 6 bulan belajar, Rian memberanikan diri membuat website pertama: <b>blog sederhana tentang desanya</b>. Berisi sejarah desa, foto-foto, dan cerita rakyat.</p>
<p>Dia hosting gratis di GitHub Pages. Domain gratis dari Freenom. Total biaya: Rp 0.</p>
<p>Ketika link-nya dikirim ke grup WhatsApp keluarga, semua heboh. Neneknya yang tidak mengerti teknologi ikut bangga.</p>
<p>"Rian bisa bikin internet," kata neneknya ke tetangga.</p>
<p>Rian tersenyum. Ini baru permulaan.</p>

<h2>Penutup Bab 1</h2>
<p>Malam itu, Rian duduk di beranda rumah, memandangi langit berbintang. HP di tangan masih menyala, menampilkan halaman web buatannya sendiri.</p>
<p>Dia teringat ucapan Pak Slamet: <i>"Nak, dunia ini makin ke depan butuh orang yang paham komputer. Kamu punya kesempatan."</i></p>
<p>Rian mengepalkan tangan. Di dalam hati, dia bertekad: <b>"Suatu hari, aku akan jadi programmer hebat. Bukan cuma buat diriku, tapi buat desa ini."</b></p>
<p>Dan begitulah perjalanan dimulai.</p>
    `,
  },

  {
    id: 'novel-bug-terakhir',
    title: 'Novel: Bug Terakhir — Sebuah Cerita Pendek',
    category: 'novel',
    author: 'Ysdev',
    date: '2026-09-27',
    readTime: 10,
    cover: '🐛',
    excerpt: 'Cerita tentang seorang programmer yang harus fix satu bug misterius sebelum deadline.',
    content: `
<h2>03:47 AM</h2>
<p>Ruang kantor sepi. Hanya suara AC dan lampu neon yang berkedip. Sarah, 28 tahun, masih duduk di meja kerjanya. Matanya merah. Kopi kelima sudah dingin sejak satu jam lalu.</p>
<p>Deadline: 6 jam lagi. Aplikasi e-commerce mereka akan launching untuk klien besar. Tapi ada satu bug yang belum ketemu.</p>

<h2>Bug Misterius</h2>
<p>Bug-nya aneh. Aplikasi berjalan sempurna di lingkungan development. Berjalan normal di staging. Tapi di production, <b>kadang</b> — hanya kadang — user gagal login.</p>
<p>Tidak konsisten. Tidak bisa direproduksi. Tidak ada di log. Ini jenis bug yang paling dibenci programmer.</p>

<h2>Tiga Hari Sebelumnya</h2>
<p>Sarah ingat ketika bug ini pertama muncul. Customer service melaporkan 3 kasus. Kemudian 5. Kemudian 12. Semua dengan keluhan sama: "Login gagal, padahal password benar."</p>
<p>Tim sudah mencoba berbagai cara:</p>
<ul>
  <li>Cek database — normal</li>
  <li>Cek server — normal</li>
  <li>Cek jaringan — normal</li>
  <li>Cek kode — tidak ada yang salah</li>
</ul>
<p>Semua normal. Tapi bug tetap ada.</p>

<h2>Malam Panjang</h2>
<p>Sarah membaca ulang kode login. Sudah 20 kali. Setiap baris. Setiap fungsi. Tidak ada yang mencurigakan.</p>
<p>Dia mulai curiga: mungkin bukan di kode login. Mungkin di tempat lain.</p>
<p>Pukul 04:15, dia buka file yang belum pernah dia buka: <code>session-handler.js</code>. File ini ditulis oleh programmer yang sudah resign 6 bulan lalu.</p>
<p>Di baris 47, ada sesuatu:</p>
<pre><code>if (user.id !== null && user.id != undefined) {</code></pre>
<p>Sarah menatap baris itu lama. <code>!==</code> dan <code>!=</code>. Dua operator yang berbeda. Satu strict, satu tidak.</p>
<p>Bagaimana kalau <code>user.id</code> bernilai <code>0</code>? Dengan <code>!==</code>, <code>0 !== null</code> = true. Tapi dengan <code>!=</code>, <code>0 != null</code> = false. Aneh, tapi bukan bug.</p>
<p>Dia lanjut baca. Baris 89:</p>
<pre><code>setTimeout(checkSession, 30000);</code></pre>
<p>30 detik. Fungsi cek session dipanggil setiap 30 detik. Tidak ada yang salah... atau ada?</p>

<h2>Penemuan</h2>
<p>Sarah buka log server untuk user yang gagal login. Tanggal, waktu, IP. Semua normal. Tapi ada satu pola: <b>semua user yang gagal login sudah login lebih dari 25 menit sebelumnya</b>.</p>
<p>Dia cek <code>checkSession()</code>. Fungsi ini memanggil API ke server. Kalau server lambat, fungsi menunggu. Kalau gagal, dia coba lagi.</p>
<p>Tapi tidak ada <b>timeout</b>. Kalau server hang, fungsi ini nunggu selamanya. Dan kalau ada request baru (login) masuk, request baru itu... <b>blocked</b>.</p>
<p>Itu dia. Race condition. Session handler lama yang hang, dan tidak dilepas, membuat request baru tersangkut.</p>

<h2>Fix</h2>
<p>Pukul 05:02, Sarah menulis fix:</p>
<pre><code>const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

fetch('/api/check-session', { signal: controller.signal })
  .then(res => res.json())
  .then(data => { clearTimeout(timeoutId); handleSession(data); })
  .catch(err => {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      console.log('Session check timeout, retrying...');
    }
  });</code></pre>
<p>Timeout 5 detik. Kalau server tidak respons dalam 5 detik, request dibatalkan, coba lagi. Tidak ada yang hang. Tidak ada yang block.</p>

<h2>Testing</h2>
<p>Pukul 05:30, Sarah deploy ke staging. Testing dengan simulasi server lambat. Testing dengan request bertubi-tubi. Testing dengan user lama login.</p>
<p>Hasilnya: <b>tidak ada bug</b>.</p>
<p>Dia deploy ke production. Pukul 06:00. Aplikasi launch pukul 10:00. Lega.</p>

<h2>Refleksi</h2>
<p>Sarah duduk di kursinya, menatap layar. Bug itu mengajarkan dia sesuatu:</p>
<ul>
  <li>Bug tidak selalu di tempat yang kamu cari</li>
  <li>Kode lama adalah sumber bug potensial</li>
  <li>Network selalu unreliable, harus handle</li>
  <li>Timeout bukan opsional, tapi wajib</li>
  <li>Race condition adalah mimpi buruk</li>
</ul>

<h2>Pagi</h2>
<p>Matahari mulai terbit. Sarah menutup laptop. Di luar kantor, kota mulai hidup. Kopi kelima masih di meja, dingin sepenuhnya.</p>
<p>Dia tersenyum kecil. Ini bagian dari pekerjaan. Bukan selalu glamor. Bukan selalu seru. Tapi momen seperti ini — ketika akhirnya menemukan bug yang sudah lama dicari — rasanya <b>luar biasa</b>.</p>
<p>Sarah melangkah keluar kantor, membeli sarapan, dan bersiap untuk hari baru. Deadline hari ini terpenuhi. Besok, akan ada bug baru untuk dipecahkan.</p>
<p>Dan dia siap.</p>
    `,
  },

  /* ==========================================
     💡 TIPS
     ========================================== */
  {
    id: 'tips-produktif-coding',
    title: '10 Tips Produktif Coding untuk Pemula',
    category: 'tips',
    author: 'Ysdev',
    date: '2026-09-28',
    readTime: 6,
    cover: '⚡',
    excerpt: 'Produktif bukan berarti kerja 12 jam sehari. Ini cara kerja lebih pintar.',
    content: `
<h2>1. Timeboxing — Kerja dalam Blok Waktu</h2>
<p>Jangan kerja "sampai selesai". Kerja dalam blok 25-50 menit, lalu istirahat 5-10 menit. Teknik Pomodoro terbukti efektif.</p>
<ul>
  <li>25 menit fokus → 5 menit istirahat</li>
  <li>Setelah 4 sesi → istirahat panjang 15-30 menit</li>
  <li>Matikan notifikasi HP saat sesi fokus</li>
</ul>

<h2>2. Tidur Cukup</h2>
<p>Programmer yang kurang tidur bikin <b>3x lebih banyak bug</b>. Ini bukan mitos — otak butuh istirahat untuk konsolidasi memori dan problem solving.</p>
<ul>
  <li>Minimal 7 jam tidur</li>
  <li>Jangan begadang "biar cepat selesai" — hasilnya lebih lambat</li>
  <li>Tidur siang 20 menit bisa boost produktivitas</li>
</ul>

<h2>3. Olahraga Rutin</h2>
<p>Duduk 8 jam sehari bikin otak lemot. Olahraga 30 menit sehari bisa:</p>
<ul>
  <li>Meningkatkan fokus</li>
  <li>Mengurangi stress</li>
  <li>Memperbaiki mood</li>
  <li>Menambah energi</li>
</ul>
<p>Nggak perlu gym. Jalan kaki, stretching, atau push-up di rumah sudah cukup.</p>

<h2>4. Belajar Touch Typing</h2>
<p>Kalau kamu masih ngeliat keyboard waktu ngetik, kamu buang banyak waktu. Touch typing bisa 2-3x lebih cepat.</p>
<ul>
  <li>Latihan 15 menit sehari</li>
  <li>Pakai situs seperti keybr.com atau typing.com</li>
  <li>Dalam 1 bulan, kecepatan akan naik drastis</li>
</ul>

<h2>5. Kuasai Shortcut Editor</h2>
<p>VS Code punya ratusan shortcut. Yang wajib:</p>
<ul>
  <li><code>Ctrl+P</code> — buka file cepat</li>
  <li><code>Ctrl+Shift+P</code> — command palette</li>
  <li><code>Ctrl+D</code> — select next occurrence</li>
  <li><code>Alt+↑/↓</code> — pindah baris</li>
  <li><code>Ctrl+/</code> — comment</li>
  <li><code>Ctrl+B</code> — toggle sidebar</li>
</ul>

<h2>6. Pakai AI Sebagai Co-pilot</h2>
<p>AI seperti ChatGPT dan Copilot bukan pengganti kamu, tapi <b>mempercepat</b> kamu. Gunakan untuk:</p>
<ul>
  <li>Boilerplate code</li>
  <li>Jelaskan error</li>
  <li>Suggest perbaikan</li>
  <li>Buat test case</li>
  <li>Refactor kode</li>
</ul>
<p>Tapi jangan <b>percaya buta</b>. Selalu review output AI.</p>

<h2>7. Belajar Satu Hal Sekaligus</h2>
<p>Multitasking itu mitos. Otak tidak bisa fokus ke dua hal kompleks sekaligus. Fokus ke satu task, selesaikan, baru pindah.</p>
<ul>
  <li>Tutup tab browser yang tidak perlu</li>
  <li>Matikan Slack/email saat deep work</li>
  <li>Kalau ada ide lain, catat dulu, lanjut kerja</li>
</ul>

<h2>8. Istirahat Teratur</h2>
<p>Setiap 50 menit, istirahat 10 menit. Setiap 2 jam, istirahat 20 menit. Setiap hari, minimal 1 jam tanpa layar.</p>
<p>Kenapa? Karena otak butuh waktu untuk "konsolidasi" — memproses apa yang sudah dipelajari. Kadang solusi muncul justru saat mandi atau jalan-jalan.</p>

<h2>9. Dokumentasi Kode</h2>
<p>Tulis komentar & dokumentasi sambil coding. Kenapa?</p>
<ul>
  <li>Kamu 6 bulan lagi akan lupa kode ini</li>
  <li>Rekan tim butuh paham</li>
  <li>Menulis = memperjelas pikiran</li>
  <li>Kode yang susah dijelaskan = kode yang perlu di-refactor</li>
</ul>

<h2>10. Rayakan Progress Kecil</h2>
<p>Jangan tunggu sampai "jago" baru bangga. Rayakan setiap:</p>
<ul>
  <li>Bug yang berhasil di-fix</li>
  <li>Fitur yang selesai</li>
  <li>Konsep yang dipahami</li>
  <li>Proyek yang di-deploy</li>
</ul>
<p>Dopamin dari pencapaian kecil bikin kamu terus termotivasi.</p>

<h2>Bonus: Jaga Kesehatan Mental</h2>
<ul>
  <li>Jangan bandingkan diri dengan senior</li>
  <li>Imposter syndrome itu normal</li>
  <li>Istirahat kalau burnout</li>
  <li>Punya hobi non-coding</li>
  <li>Bergabung komunitas supportif</li>
</ul>

<h2>Kesimpulan</h2>
<p>Produktif bukan soal <b>berapa lama</b> kamu kerja, tapi <b>seberapa efektif</b>. Kerja 4 jam fokus lebih baik dari 10 jam sambil scroll sosmed.</p>
<p>Coba tips di atas satu per satu. Tidak perlu semua sekaligus. Mulai dari yang paling mudah, dan rasakan bedanya.</p>
    `,
  },

  {
    id: 'tips-debug',
    title: 'Cara Debug Kode Seperti Senior Programmer',
    category: 'tips',
    author: 'Ysdev',
    date: '2026-09-29',
    readTime: 7,
    cover: '🐛',
    excerpt: 'Debugging bukan soal keberuntungan. Ini proses sistematis yang bisa dipelajari.',
    content: `
<h2>Debugging Itu Skill</h2>
<p>Banyak programmer pemula menganggap debugging itu "nasib" — kadang ketemu, kadang nggak. Padahal debugging adalah <b>skill</b> yang bisa dilatih. Senior programmer bukan lebih pintar, mereka cuma punya <b>metode</b> yang lebih baik.</p>

<h2>Prinsip Dasar</h2>
<ol>
  <li><b>Bug itu logis</b> — selalu ada penyebab</li>
  <li><b>Bug itu bisa direproduksi</b> — kalau tidak, cari kondisi yang tepat</li>
  <li><b>Isolasi dulu</b> — jangan ubah banyak hal sekaligus</li>
  <li><b>Ubah satu variabel</b> — satu perubahan, satu tes</li>
  <li><b>Baca error message</b> — jangan panik, baca pelan-pelan</li>
</ol>

<h2>Langkah 1: Reproduce Bug</h2>
<p>Bug yang tidak bisa direproduksi tidak bisa di-fix. Cari tahu:</p>
<ul>
  <li>Kapan bug muncul?</li>
  <li>Di browser/device apa?</li>
  <li>Input apa yang memicu?</li>
  <li>Berapa sering?</li>
  <li>Bisa diprediksi atau random?</li>
</ul>

<h2>Langkah 2: Baca Error Message</h2>
<p>Error message itu <b>petunjuk</b>, bukan hukuman. Yang perlu dibaca:</p>
<ul>
  <li><b>Jenis error</b> — TypeError, ReferenceError, dll</li>
  <li><b>Baris ke berapa</b> — line number di stack trace</li>
  <li><b>File mana</b> — pastikan file yang benar</li>
  <li><b>Pesan detail</b> — biasanya menjelaskan penyebab</li>
</ul>
<p>Kalau tidak paham, <b>Google pesan error-nya</b>. Orang lain pasti pernah kena.</p>

<h2>Langkah 3: Isolasi Masalah</h2>
<p>Teknik klasik: <b>comment out code sampai bug hilang</b>. Ketika bug hilang, berarti masalahnya di bagian yang baru kamu comment.</p>
<pre><code>function proses(data) {
  console.log('1. Mulai');
  const step1 = transform(data);
  console.log('2. Setelah transform:', step1);

  const step2 = validate(step1);
  console.log('3. Setelah validate:', step2);

  return save(step2);
}</code></pre>
<p>Dengan log bertahap, kamu tahu di mana kode gagal.</p>

<h2>Langkah 4: Rubber Duck Debugging</h2>
<p>Jelaskan kode kamu ke <b>bebek karet</b> (atau benda mati apapun). Kenapa efektif?</p>
<ul>
  <li>Memaksa kamu verbalisasi logika</li>
  <li>Sering solusi muncul saat kamu jelaskan</li>
  <li>Menemukan asumsi yang salah</li>
</ul>
<p>Programmer profesional benar-benar melakukan ini. Serius.</p>

<h2>Langkah 5: Cek Asumsi</h2>
<p>90% bug datang dari asumsi yang salah:</p>
<ul>
  <li>"Variabel ini pasti number" — ternyata string</li>
  <li>"Fungsi ini pasti selesai" — ternyata async</li>
  <li>"Array ini pasti ada isinya" — ternyata kosong</li>
  <li>"User ini pasti login" — ternyata belum</li>
</ul>
<p>Solusi: <b>verify dengan log</b> sebelum asumsi.</p>
<pre><code>console.log(typeof data, data);</code></pre>

<h2>Langkah 6: Cek Batasan (Edge Case)</h2>
<p>Bug sering muncul di kondisi ekstrem:</p>
<ul>
  <li>Array kosong</li>
  <li>Angka 0</li>
  <li>String kosong</li>
  <li>null / undefined</li>
  <li>Angka negatif</li>
  <li>Angka sangat besar</li>
  <li>Unicode aneh</li>
</ul>

<h2>Langkah 7: Breakpoint Debugging</h2>
<p>Console.log itu bagus, tapi breakpoint lebih powerful. Di browser:</p>
<ol>
  <li>Buka DevTools (F12)</li>
  <li>Tab Sources</li>
  <li>Klik nomor baris untuk pasang breakpoint</li>
  <li>Refresh — eksekusi akan berhenti di titik itu</li>
  <li>Inspect semua variabel</li>
  <li>Step through baris per baris</li>
</ol>

<h2>Langkah 8: Cek Versi & Environment</h2>
<p>Bug "hanya di production" sering karena:</p>
<ul>
  <li>Versi Node.js berbeda</li>
  <li>Environment variable tidak di-set</li>
  <li>Cache browser</li>
  <li>Data production tidak sama dengan development</li>
  <li>CDN masih serve versi lama</li>
</ul>

<h2>Langkah 9: Tulis Test</h2>
<p>Setelah fix bug, <b>tulis test case</b> yang mencakup kasus itu. Biar tidak terulang.</p>
<pre><code>test('handle empty array', () => {
  expect(proses([])).toEqual([]);
});</code></pre>

<h2>Langkah 10: Istirahat</h2>
<p>Kalau sudah 1-2 jam stuck, <b>tinggalkan</b>. Jalan-jalan. Mandi. Tidur.</p>
<p>Otak butuh waktu "background processing". Sering solusi muncul saat kita tidak fokus ke masalah.</p>

<h2>Kesalahan Umum</h2>
<ul>
  <li><b>Panik</b> — lihat error merah langsung stress</li>
  <li><b>Ubah banyak hal</b> — nggak tahu yang mana berhasil</li>
  <li><b>Copy-paste dari Stack Overflow</b> — tanpa paham</li>
  <li><b>Anggap bug itu "random"</b> — selalu ada penyebab</li>
  <li><b>Nggak baca dokumentasi</b> — asal tebak</li>
</ul>

<h2>Kesimpulan</h2>
<p>Debugging itu <b>proses</b>, bukan sihir. Semakin banyak kamu debug, semakin cepat kamu menemukan bug. Senior programmer bukan lebih pintar — mereka cuma lebih berpengalaman <b>mengenali pola</b>.</p>
<p>Bug adalah guru terbaik. Setiap bug yang berhasil di-fix membuat kamu programmer yang lebih baik.</p>
    `,
  },

  {
    id: 'tips-portfolio',
    title: 'Membangun Portfolio Coding yang Dilirik Recruiter',
    category: 'tips',
    author: 'Ysdev',
    date: '2026-09-30',
    readTime: 6,
    cover: '📁',
    excerpt: 'Tanpa portfolio, CV kamu cuma kertas. Ini cara membangun portfolio yang menjual.',
    content: `
<h2>Kenapa Portfolio Penting?</h2>
<p>Di dunia tech, <b>portfolio > CV</b>. Recruiter lebih percaya kode yang kamu tulis daripada tulisan "mahir JavaScript" di CV.</p>
<p>Portfolio membuktikan:</p>
<ul>
  <li>Kamu bisa <b>menyelesaikan</b> proyek</li>
  <li>Kamu bisa <b>menulis kode bersih</b></li>
  <li>Kamu bisa <b>belajar mandiri</b></li>
  <li>Kamu <b>passionate</b> dengan coding</li>
</ul>

<h2>1. Bangun GitHub yang Rapi</h2>
<p>GitHub adalah "CV baru" untuk programmer. Yang recruiter lihat:</p>
<ul>
  <li>Profile README yang menarik</li>
  <li>Repo dengan dokumentasi jelas</li>
  <li>Commit history yang konsisten</li>
  <li>Kontribusi ke open source</li>
</ul>

<h2>2. Pilih 3-5 Proyek Terbaik</h2>
<p>Kualitas > kuantitas. Lebih baik 3 proyek bagus dari 20 proyek asal-asalan.</p>
<p>Setiap proyek harus punya:</p>
<ul>
  <li><b>README lengkap</b> — apa, kenapa, bagaimana</li>
  <li><b>Screenshot/demo</b> — link live</li>
  <li><b>Tech stack jelas</b> — bahasa, framework</li>
  <li><b>Cara install</b> — biar orang bisa coba</li>
  <li><b>Fitur list</b> — apa saja yang bisa dilakukan</li>
</ul>

<h2>3. Tunjukkan Progress, Bukan Kesempurnaan</h2>
<p>Proyek yang <b>selesai</b> (walaupun sederhana) lebih baik dari proyek ambisius yang tidak selesai. Recruiter mau lihat kamu bisa <b>ship</b>.</p>

<h2>4. Variety Itu Baik</h2>
<p>Tunjukkan kamu bisa handle berbagai jenis proyek:</p>
<ul>
  <li><b>Web app</b> — to-do, notes, blog</li>
  <li><b>API/backend</b> — REST API, auth</li>
  <li><b>CLI tool</b> — automation script</li>
  <li><b>Library</b> — kalau ada</li>
  <li><b>Mobile app</b> — React Native, Flutter</li>
</ul>

<h2>5. Live Demo</h2>
<p>Deploy proyek kamu. Recruiter nggak mau clone & install untuk lihat hasilnya.</p>
<ul>
  <li><b>Vercel</b> — frontend/static</li>
  <li><b>Netlify</b> — frontend/static</li>
  <li><b>Railway</b> — backend + database</li>
  <li><b>Render</b> — full-stack</li>
  <li><b>GitHub Pages</b> — static gratis</li>
</ul>

<h2>6. Personal Website</h2>
<p>Punya website pribadi bikin kamu terlihat profesional. Isi:</p>
<ul>
  <li>About me</li>
  <li>Skills</li>
  <li>Projects</li>
  <li>Blog (opsional)</li>
  <li>Contact</li>
</ul>
<p>Bisa dibangun dengan HTML/CSS/JS biasa, atau pakai framework seperti Next.js.</p>

<h2>7. Tulis Blog / Artikel</h2>
<p>Menulis tentang coding menunjukkan:</p>
<ul>
  <li>Kamu paham konsep</li>
  <li>Kamu bisa komunikasi</li>
  <li>Kamu berkontribusi ke komunitas</li>
</ul>
<p>Platform: Dev.to, Medium, Hashnode, atau blog sendiri.</p>

<h2>8. Kontribusi Open Source</h2>
<p>Kontribusi ke proyek open source menunjukkan kamu bisa kerja di <b>kodebase orang lain</b>.</p>
<p>Mulai dari yang kecil:</p>
<ul>
  <li>Fix typo di dokumentasi</li>
  <li>Report bug</li>
  <li>Tambah test</li>
  <li>Fix bug kecil</li>
</ul>

<h2>9. Komunikasi di README</h2>
<p>README yang bagus punya:</p>
<pre><code># Nama Proyek
Deskripsi singkat 1-2 kalimat.

## Demo
[Link live demo]

## Fitur
- Fitur 1
- Fitur 2

## Tech Stack
- React, Node.js, MongoDB

## Instalasi
\`\`\`bash
git clone ...
npm install
npm start
\`\`\`

## Screenshot
![Screenshot](link)

## Lisensi
MIT</code></pre>

<h2>10. Update Berkala</h2>
<p>Portfolio bukan proyek sekali jadi. Update terus:</p>
<ul>
  <li>Tambah proyek baru</li>
  <li>Refactor proyek lama</li>
  <li>Perbaiki dokumentasi</li>
  <li>Responsif ke feedback</li>
</ul>

<h2>Contoh Portfolio yang Bagus</h2>
<ul>
  <li><b>brittanychiang.com</b> — portfolio designer</li>
  <li><b>github.com/sindresorhus</b> — banyak library open source</li>
  <li><b>github.com/torvalds</b> — Linux (untuk inspirasi)</li>
</ul>

<h2>Kesalahan Umum</h2>
<ul>
  <li><b>Tidak ada README</b> — recruiter bingung</li>
  <li><b>Tidak bisa dijalankan</b> — dependency rusak</li>
  <li><b>Tidak ada live demo</b> — susah dinilai</li>
  <li><b>Terlalu banyak proyek tutorial</b> — bukan proyek original</li>
  <li><b>Commit message asal</b> — "update" 100x</li>
  <li><b>Tidak pernah update</b> — terlihat malas</li>
</ul>

<h2>Kesimpulan</h2>
<p>Portfolio bukan tentang jumlah proyek, tapi <b>kualitas dan cerita di baliknya</b>. Recruiter mau lihat:</p>
<ul>
  <li>Kamu bisa <b>menyelesaikan</b> sesuatu</li>
  <li>Kamu bisa <b>belajar</b> hal baru</li>
  <li>Kamu bisa <b>komunikasi</b> hasil kerja</li>
</ul>
<p>Mulai hari ini. Bangun 1 proyek kecil. Push ke GitHub. Tulis README yang bagus. 3 bulan dari sekarang, kamu akan punya portfolio yang bisa dibanggakan.</p>
    `,
  },

  /* ==========================================
     💼 KARIR
     ========================================== */
  {
    id: 'karir-jalur-programmer',
    title: 'Jalur Karir Programmer: Dari Junior sampai CTO',
    category: 'karir',
    author: 'Ysdev',
    date: '2026-10-01',
    readTime: 8,
    cover: '📈',
    excerpt: 'Bingung arah karir? Ini peta jalur karir programmer dari nol sampai puncak.',
    content: `
<h2>Overview</h2>
<p>Karir programmer itu bukan linear — ada banyak jalur. Tapi secara umum, ada 3 track:</p>
<ol>
  <li><b>Individual Contributor (IC)</b> — fokus teknis</li>
  <li><b>Management</b> — fokus people</li>
  <li><b>Founder/Entrepreneur</b> — bangun sendiri</li>
</ol>

<h2>Jalur IC (Individual Contributor)</h2>
<p>Untuk yang cinta coding dan mau tetap teknis:</p>

<h3>1. Junior Developer (0-2 tahun)</h3>
<ul>
  <li><b>Fokus</b>: belajar, ikut task kecil</li>
  <li><b>Gaji</b>: Rp 5-10 juta/bulan</li>
  <li><b>Skill</b>: dasar bahasa, framework, Git</li>
  <li><b>Target</b>: bisa selesaikan task tanpa terlalu banyak bantuan</li>
</ul>

<h3>2. Mid-Level Developer (2-5 tahun)</h3>
<ul>
  <li><b>Fokus</b>: handle fitur sendiri</li>
  <li><b>Gaji</b>: Rp 10-18 juta/bulan</li>
  <li><b>Skill</b>: system design dasar, testing, debugging</li>
  <li><b>Target</b>: bisa bantu junior</li>
</ul>

<h3>3. Senior Developer (5-8 tahun)</h3>
<ul>
  <li><b>Fokus</b>: design sistem, mentor, code review</li>
  <li><b>Gaji</b>: Rp 18-35 juta/bulan</li>
  <li><b>Skill</b>: arsitektur, perf, decision teknis</li>
  <li><b>Target</b>: dipercaya handle proyek besar</li>
</ul>

<h3>4. Staff / Principal Engineer (8+ tahun)</h3>
<ul>
  <li><b>Fokus</b>: technical strategy, cross-team impact</li>
  <li><b>Gaji</b>: Rp 35-80 juta/bulan</li>
  <li><b>Skill</b>: pengaruh di banyak tim</li>
  <li><b>Target</b>: jadi "otak" di balik keputusan besar</li>
</ul>

<h3>5. Distinguished / Fellow Engineer (langka)</h3>
<ul>
  <li><b>Fokus</b>: industri-wide impact</li>
  <li><b>Gaji</b>: Rp 80 juta+/bulan</li>
  <li><b>Contoh</b>: Guido van Rossum (Python), Linus Torvalds (Linux)</li>
</ul>

<h2>Jalur Management</h2>
<p>Kalau kamu suka ngurus orang:</p>

<h3>1. Tech Lead (transisi)</h3>
<ul>
  <li>50% coding, 50% management</li>
  <li>Guide tim teknis</li>
  <li>Gaji: Rp 25-40 juta</li>
</ul>

<h3>2. Engineering Manager</h3>
<ul>
  <li>100% management</li>
  <li>Hire, review, growth team</li>
  <li>Gaji: Rp 35-70 juta</li>
</ul>

<h3>3. Director of Engineering</h3>
<ul>
  <li>Manage multiple EM</li>
  <li>Strategy tingkat divisi</li>
  <li>Gaji: Rp 70-150 juta</li>
</ul>

<h3>4. VP of Engineering</h3>
<ul>
  <li>Lead seluruh engineering org</li>
  <li>Align tech dengan business</li>
  <li>Gaji: Rp 150-300 juta</li>
</ul>

<h3>5. CTO</h3>
<ul>
  <li>Top tech executive</li>
  <li>Tech vision perusahaan</li>
  <li>Gaji: Rp 300 juta+ atau equity</li>
</ul>

<h2>Jalur Founder</h2>
<p>Untuk yang mau bangun bisnis sendiri:</p>
<ul>
  <li><b>Solo founder</b> — bangun SaaS, apps</li>
  <li><b>Co-founder teknis</b> — partner dengan business person</li>
  <li><b>Freelance</b> — jasa untuk klien</li>
  <li><b>Consultant</b> — expert advice</li>
  <li><b>Indie hacker</b> — small products, high margin</li>
</ul>

<h2>Transisi Umum</h2>
<ul>
  <li>Junior → Mid: 2-3 tahun</li>
  <li>Mid → Senior: 3-5 tahun</li>
  <li>Senior → Staff: 2-4 tahun</li>
  <li>Senior → EM: bisa kapan saja</li>
  <li>EM → Director: 2-5 tahun</li>
</ul>

<h2>Skill per Level</h2>

<h3>Junior</h3>
<ul>
  <li>1 bahasa pemrograman</li>
  <li>1 framework</li>
  <li>Git dasar</li>
  <li>Debugging dasar</li>
</ul>

<h3>Mid</h3>
<ul>
  <li>Multiple bahasa</li>
  <li>Testing & CI/CD</li>
  <li>Database</li>
  <li>Code review</li>
</ul>

<h3>Senior</h3>
<ul>
  <li>System design</li>
  <li>Performance</li>
  <li>Mentorship</li>
  <li>Tech decision</li>
</ul>

<h3>Staff+</h3>
<ul>
  <li>Multi-team impact</li>
  <li>Tech strategy</li>
  <li>Industry presence</li>
</ul>

<h2>Faktor Sukses</h2>
<ol>
  <li><b>Konsistensi</b> — belajar terus, jangan stagnan</li>
  <li><b>Networking</b> — banyak peluang dari koneksi</li>
  <li><b>Portfolio</b> — bukti nyata skill kamu</li>
  <li><b>Komunikasi</b> — makin senior, makin penting</li>
  <li><b>Spesialisasi</b> — punya "T-shape": luas + dalam</li>
</ol>

<h2>Kesimpulan</h2>
<p>Jalur karir programmer itu <b>luas</b>. Kamu bisa pilih:</p>
<ul>
  <li>Fokus teknis (IC)</li>
  <li>Fokus people (Management)</li>
  <li>Fokus bisnis (Founder)</li>
</ul>
<p>Nggak ada yang "benar". Yang penting: <b>kenali dirimu</b> — suka coding? Suka ngurus orang? Suka bangun bisnis? Pilih yang sesuai, dan jalani dengan konsisten.</p>
<p>Yang pasti: <b>mulai dari bawah</b>. Nggak ada CTO yang langsung jadi CTO. Semua mulai dari junior, belajar, dan naik perlahan.</p>
    `,
  },

  {
    id: 'karir-freelance',
    title: 'Panduan Freelance Programmer untuk Pemula',
    category: 'karir',
    author: 'Ysdev',
    date: '2026-10-02',
    readTime: 7,
    cover: '💼',
    excerpt: 'Mau kerja bebas tanpa bos? Freelance bisa jadi jalannya. Ini panduan lengkapnya.',
    content: `
<h2>Kenapa Freelance?</h2>
<ul>
  <li>Fleksibel waktu</li>
  <li>Kerja dari mana saja</li>
  <li>Pilih klien sendiri</li>
  <li>Potensi penghasilan tidak terbatas</li>
  <li>Bisa sambil kerja full-time</li>
</ul>

<h2>Tantangan Freelance</h2>
<ul>
  <li>Penghasilan tidak stabil</li>
  <li>Harus cari klien sendiri</li>
  <li>Tanggung jawab semua sendiri</li>
  <li>Tidak ada benefit (BPJS, dll)</li>
  <li>Klien kadang sulit</li>
</ul>

<h2>1. Tentukan Niche</h2>
<p>Jangan generalis. Pilih spesialisasi:</p>
<ul>
  <li><b>Web development</b> — landing page, e-commerce</li>
  <li><b>Mobile apps</b> — iOS, Android</li>
  <li><b>WordPress</b> — banyak kebutuhan</li>
  <li><b>Automation</b> — script, bot</li>
  <li><b>Data</b> — scraping, analysis</li>
</ul>
<p>Niche memudahkan marketing: orang tahu kamu spesialis apa.</p>

<h2>2. Bangun Portfolio</h2>
<p>Sebelum cari klien, siapkan:</p>
<ul>
  <li>3-5 proyek (bisa proyek pribadi)</li>
  <li>Live demo yang bisa dilihat</li>
  <li>Studi kasus: problem → solusi → hasil</li>
  <li>Testimoni (kalau sudah ada klien)</li>
</ul>

<h2>3. Platform Freelance</h2>

<h3>Lokal</h3>
<ul>
  <li><b>Sribu</b> — platform Indonesia</li>
  <li><b>Projects.co.id</b> — lokal</li>
  <li><b>Fastwork</b> — populer</li>
</ul>

<h3>Internasional</h3>
<ul>
  <li><b>Upwork</b> — terbesar</li>
  <li><b>Fiverr</b> — gig-based</li>
  <li><b>Freelancer</b> — variatif</li>
  <li><b>Toptal</b> — top 3%</li>
</ul>

<h3>Alternatif</h3>
<ul>
  <li>Twitter/X — banyak klien dari sini</li>
  <li>LinkedIn — networking</li>
  <li>Discord/Slack komunitas</li>
  <li>Word of mouth</li>
</ul>

<h2>4. Pricing</h2>
<p>3 model pricing:</p>

<h3>Hourly</h3>
<ul>
  <li>Cocok untuk kerja belum jelas</li>
  <li>Rate: $10-50/jam untuk pemula</li>
  <li>Semakin expert, semakin tinggi</li>
</ul>

<h3>Fixed Price</h3>
<ul>
  <li>Harga disepakati di awal</li>
  <li>Resiko: scope creep</li>
  <li>Harus jelas scope-nya</li>
</ul>

<h3>Retainer</h3>
<ul>
  <li>Kontrak bulanan</li>
  <li>Cocok untuk maintenance</li>
  <li>Penghasilan stabil</li>
</ul>

<h2>5. Cari Klien Pertama</h2>
<p>Cara termudah:</p>
<ol>
  <li><b>Mulai dari kenalan</b> — teman, keluarga, tetangga</li>
  <li><b>Gratis dulu</b> — untuk portfolio & testimoni</li>
  <li><b>Komunitas lokal</b> — UMKM butuh website</li>
  <li><b>Platform freelance</b> — bid di project kecil</li>
  <li><b>Sosial media</b> — share karya, aktif</li>
</ol>

<h2>6. Komunikasi Klien</h2>
<ul>
  <li><b>Jelas</b> — hindari jargon teknis</li>
  <li><b>Cepat respons</b> — klien suka yang responsif</li>
  <li><b>Update berkala</b> — progress report</li>
  <li><b>Handle revisi</b> — biasanya ada 2-3x revisi</li>
  <li><b>Manage ekspektasi</b> — jangan over-promise</li>
</ul>

<h2>7. Kontrak & Pembayaran</h2>
<p>Selalu:</p>
<ul>
  <li><b>Tulis kontrak</b> — walau sederhana</li>
  <li><b>DP 30-50%</b> — sebelum mulai</li>
  <li><b>Milestone</b> — pembayaran bertahap</li>
  <li><b>Invoice jelas</b> — nomor, tanggal, jumlah</li>
  <li><b>Metode pembayaran</b> — transfer, PayPal, Wise</li>
</ul>

<h2>8. Legal & Pajak</h2>
<ul>
  <li><b>NPWP</b> — wajib untuk pajak</li>
  <li><b>Rekening terpisah</b> — untuk bisnis</li>
  <li><b>Catat penghasilan</b> — untuk pajak tahunan</li>
  <li><b>Pajak</b> — di Indonesia, freelance kena PPh</li>
</ul>

<h2>9. Skill Non-Teknis</h2>
<ul>
  <li>Komunikasi</li>
  <li>Negosiasi</li>
  <li>Time management</li>
  <li>Marketing diri</li>
  <li>Accounting dasar</li>
</ul>

<h2>10. Scale Up</h2>
<p>Setelah stabil:</p>
<ul>
  <li><b>Naikkan rate</b> — setiap 6 bulan</li>
  <li><b>Pilih klien</b> — jangan ambil semua</li>
  <li><b>Produk digital</b> — template, kursus</li>
  <li><b>Bangun tim</b> — subcontract</li>
  <li><b>Agency</b> — scale lebih besar</li>
</ul>

<h2>Kesalahan Umum</h2>
<ul>
  <li><b>Rate terlalu murah</b> — susah naik nanti</li>
  <li><b>Tidak ada kontrak</b> — klien bisa kabur</li>
  <li><b>Over-promise</b> — deadline tidak realistis</li>
  <li><b>Ambil semua project</b> — burnout</li>
  <li><b>Tidak invest ke skill</b> — stuck di rate rendah</li>
</ul>

<h2>Kesimpulan</h2>
<p>Freelance itu <b>jalan yang valid</b> untuk programmer. Bukan untuk semua orang, tapi kalau kamu:</p>
<ul>
  <li>Suka kebebasan</li>
  <li>Disiplin self-managed</li>
  <li>Nyaman dengan ketidakpastian</li>
  <li>Suka belajar bisnis</li>
</ul>
<p>...maka freelance bisa jadi karir yang memuaskan.</p>
<p>Mulai dari kecil. Bangun portfolio. Cari klien pertama. Naikkan rate perlahan. Dalam 2-3 tahun, kamu bisa punya penghasilan lebih besar dari karyawan kantoran.</p>
    `,
  },
];

if (typeof window !== 'undefined') {
  window.ARTICLES = ARTICLES;
  window.ARTICLE_CATEGORIES = ARTICLE_CATEGORIES;
}
