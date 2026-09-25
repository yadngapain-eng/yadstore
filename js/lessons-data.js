/* ============================================
   YADSTORE — LESSONS DATA (Duolingo Style)
   ============================================ */

const LESSON_CATEGORIES = {
  coding: { label: 'Coding', icon: '💻', color: '#1cb0f6' },
  english: { label: 'English', icon: '🇬🇧', color: '#ce82ff' },
};

const CODING_LESSONS = [
  {
    id: 'c1', icon: '🌐', title: 'HTML Dasar', desc: 'Struktur halaman web',
    level: 'Pemula', xp: 10, questions: [
      { q: 'Apa kepanjangan HTML?', o: ['HyperText Markup Language', 'High Tech Modern Lang', 'Home Tool Markup Lang', 'Hyperlink Text Markup'], a: 0 },
      { q: 'Tag untuk heading terbesar?', o: ['&lt;h6&gt;', '&lt;h1&gt;', '&lt;head&gt;', '&lt;heading&gt;'], a: 1 },
      { q: 'Tag untuk paragraf?', o: ['&lt;para&gt;', '&lt;p&gt;', '&lt;pg&gt;', '&lt;text&gt;'], a: 1 },
      { q: 'Tag untuk link?', o: ['&lt;link&gt;', '&lt;a&gt;', '&lt;href&gt;', '&lt;url&gt;'], a: 1 },
      { q: 'Tag untuk gambar?', o: ['&lt;image&gt;', '&lt;picture&gt;', '&lt;img&gt;', '&lt;src&gt;'], a: 2 },
    ]
  },
  {
    id: 'c2', icon: '🎨', title: 'CSS Dasar', desc: 'Styling halaman web',
    level: 'Pemula', xp: 10, questions: [
      { q: 'CSS singkatan dari?', o: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Colorful Style Sheets'], a: 1 },
      { q: 'Properti warna teks?', o: ['text-color', 'font-color', 'color', 'text-style'], a: 2 },
      { q: 'Selector untuk class?', o: ['#nama', '.nama', 'nama', '*nama'], a: 1 },
      { q: 'Selector untuk id?', o: ['#nama', '.nama', 'nama', '@nama'], a: 0 },
    ]
  },
  {
    id: 'c3', icon: '⚡', title: 'JavaScript Dasar', desc: 'Bikin web interaktif',
    level: 'Pemula', xp: 15, questions: [
      { q: 'Keyword variabel konstanta?', o: ['var', 'let', 'const', 'static'], a: 2 },
      { q: 'Print ke console?', o: ['print()', 'log()', 'console.log()', 'echo()'], a: 2 },
      { q: 'Tipe data teks?', o: ['int', 'string', 'bool', 'float'], a: 1 },
      { q: 'Cara deklarasi function?', o: ['function nama() {}', 'def nama() {}', 'func nama() {}', 'void nama() {}'], a: 0 },
      { q: 'Hasil 2 + "2"?', o: ['4', '"22"', 'NaN', 'Error'], a: 1 },
    ]
  },
  {
    id: 'c4', icon: '🐍', title: 'Python Dasar', desc: 'Bahasa ramah pemula',
    level: 'Pemula', xp: 15, questions: [
      { q: 'Print di Python?', o: ['echo()', 'print()', 'console.log()', 'printf()'], a: 1 },
      { q: 'Keyword function?', o: ['function', 'def', 'func', 'void'], a: 1 },
      { q: 'Tipe data teks?', o: ['str', 'string', 'text', 'char'], a: 0 },
      { q: 'Cara komentar?', o: ['//', '#', '/* */', '<!-- -->'], a: 1 },
      { q: 'Ambil input?', o: ['input()', 'scan()', 'read()', 'get()'], a: 0 },
    ]
  },
  {
    id: 'c5', icon: '🌳', title: 'JavaScript DOM', desc: 'Manipulasi HTML',
    level: 'Menengah', xp: 20, questions: [
      { q: 'DOM singkatan?', o: ['Data Object Model', 'Document Object Model', 'Digital Object Model', 'Document Oriented Model'], a: 1 },
      { q: 'Ambil elemen by id?', o: ['getElementById()', 'getId()', 'queryId()', 'findId()'], a: 0 },
      { q: 'Event klik tombol?', o: ['onhover', 'onclick', 'onpress', 'ontap'], a: 1 },
      { q: 'Tambah class?', o: ['classList.add()', 'addClass()', 'class.add()', 'className.add()'], a: 0 },
    ]
  },
  {
    id: 'c6', icon: '📐', title: 'CSS Flexbox', desc: 'Layout modern',
    level: 'Menengah', xp: 20, questions: [
      { q: 'Aktifkan flexbox?', o: ['display: block', 'display: flex', 'display: grid', 'display: inline'], a: 1 },
      { q: 'Posisi horizontal?', o: ['align-items', 'justify-content', 'text-align', 'flex-align'], a: 1 },
      { q: 'Posisi vertikal?', o: ['align-items', 'justify-content', 'vertical-align', 'flex-align'], a: 0 },
      { q: 'Jarak antar item?', o: ['margin', 'padding', 'gap', 'space'], a: 2 },
    ]
  },
  {
    id: 'c7', icon: '🔲', title: 'CSS Grid', desc: 'Layout 2 dimensi',
    level: 'Menengah', xp: 20, questions: [
      { q: 'Aktifkan grid?', o: ['display: block', 'display: flex', 'display: grid', 'display: inline'], a: 2 },
      { q: 'Atur kolom?', o: ['grid-template-columns', 'grid-columns', 'columns', 'grid-cols'], a: 0 },
      { q: '1fr artinya?', o: ['1 pixel', '1 fragment', '1 fraction', '1 free'], a: 2 },
    ]
  },
  {
    id: 'c8', icon: '🔀', title: 'Git & GitHub', desc: 'Version control',
    level: 'Pemula', xp: 15, questions: [
      { q: 'Inisialisasi repo?', o: ['git start', 'git init', 'git new', 'git create'], a: 1 },
      { q: 'Tambah file ke staging?', o: ['git add', 'git push', 'git commit', 'git save'], a: 0 },
      { q: 'Simpan perubahan?', o: ['git add', 'git commit', 'git push', 'git save'], a: 1 },
      { q: 'Upload ke remote?', o: ['git add', 'git commit', 'git push', 'git pull'], a: 2 },
    ]
  },
  {
    id: 'c9', icon: '⏳', title: 'JavaScript Async', desc: 'Promise & async',
    level: 'Lanjutan', xp: 25, questions: [
      { q: 'Async function return?', o: ['Promise', 'Object', 'Array', 'String'], a: 0 },
      { q: 'Keyword await?', o: ['async', 'await', 'wait', 'then'], a: 1 },
      { q: 'Handle promise?', o: ['.then()', '.handle()', '.catch()', 'a dan c'], a: 3 },
    ]
  },
  {
    id: 'c10', icon: '🧬', title: 'Python OOP', desc: 'Class & Object',
    level: 'Menengah', xp: 25, questions: [
      { q: 'Keyword class?', o: ['class', 'struct', 'object', 'def'], a: 0 },
      { q: 'Method inisialisasi?', o: ['__init__', '__new__', '__start__', '__begin__'], a: 0 },
      { q: 'Parameter self artinya?', o: ['Diri sendiri', 'Static', 'Global', 'Kelas'], a: 0 },
    ]
  },
];

const ENGLISH_LESSONS = [
  {
    id: 'e1', icon: '👋', title: 'Greetings', desc: 'Sapaan dasar',
    level: 'Beginner', xp: 10, questions: [
      { q: '"Good morning" artinya?', o: ['Selamat pagi', 'Selamat malam', 'Selamat siang', 'Selamat sore'], a: 0 },
      { q: 'Cara bilang "Terima kasih"?', o: ['Sorry', 'Thank you', 'Please', 'Hello'], a: 1 },
      { q: '"How are you?" artinya?', o: ['Apa kabar?', 'Siapa kamu?', 'Di mana?', 'Kapan?'], a: 0 },
      { q: 'Balasan "I\'m fine" artinya?', o: ['Saya baik', 'Saya lapar', 'Saya lelah', 'Saya sibuk'], a: 0 },
      { q: '"Goodbye" artinya?', o: ['Halo', 'Selamat tinggal', 'Terima kasih', 'Maaf'], a: 1 },
    ]
  },
  {
    id: 'e2', icon: '🔢', title: 'Numbers', desc: 'Angka 1-100',
    level: 'Beginner', xp: 10, questions: [
      { q: '"Five" artinya?', o: ['4', '5', '6', '7'], a: 1 },
      { q: 'Angka "10" dalam bahasa Inggris?', o: ['Ten', 'Nine', 'Eleven', 'Twelve'], a: 0 },
      { q: '"Twenty" artinya?', o: ['12', '20', '22', '200'], a: 1 },
      { q: '"One hundred" artinya?', o: ['10', '100', '1000', '1'], a: 1 },
    ]
  },
  {
    id: 'e3', icon: '🎨', title: 'Colors', desc: 'Warna-warna',
    level: 'Beginner', xp: 10, questions: [
      { q: '"Red" artinya?', o: ['Biru', 'Merah', 'Kuning', 'Hijau'], a: 1 },
      { q: '"Blue" artinya?', o: ['Biru', 'Merah', 'Kuning', 'Hijau'], a: 0 },
      { q: '"Green" artinya?', o: ['Biru', 'Merah', 'Kuning', 'Hijau'], a: 3 },
      { q: '"Yellow" artinya?', o: ['Biru', 'Merah', 'Kuning', 'Hijau'], a: 2 },
      { q: '"Black" artinya?', o: ['Putih', 'Hitam', 'Abu-abu', 'Cokelat'], a: 1 },
    ]
  },
  {
    id: 'e4', icon: '👨‍👩‍👧', title: 'Family', desc: 'Anggota keluarga',
    level: 'Beginner', xp: 15, questions: [
      { q: '"Father" artinya?', o: ['Ibu', 'Ayah', 'Kakak', 'Adik'], a: 1 },
      { q: '"Mother" artinya?', o: ['Ibu', 'Ayah', 'Kakak', 'Adik'], a: 0 },
      { q: '"Brother" artinya?', o: ['Kakak/Adik perempuan', 'Kakak/Adik laki-laki', 'Ayah', 'Ibu'], a: 1 },
      { q: '"Sister" artinya?', o: ['Kakak/Adik perempuan', 'Kakak/Adik laki-laki', 'Ayah', 'Ibu'], a: 0 },
    ]
  },
  {
    id: 'e5', icon: '🍔', title: 'Food & Drink', desc: 'Makanan & minuman',
    level: 'Beginner', xp: 15, questions: [
      { q: '"Rice" artinya?', o: ['Nasi', 'Roti', 'Mie', 'Air'], a: 0 },
      { q: '"Water" artinya?', o: ['Nasi', 'Roti', 'Mie', 'Air'], a: 3 },
      { q: '"Bread" artinya?', o: ['Nasi', 'Roti', 'Mie', 'Air'], a: 1 },
      { q: '"Chicken" artinya?', o: ['Sapi', 'Ayam', 'Ikan', 'Kambing'], a: 1 },
    ]
  },
  {
    id: 'e6', icon: '🏃', title: 'Verbs', desc: 'Kata kerja umum',
    level: 'Beginner', xp: 15, questions: [
      { q: '"Eat" artinya?', o: ['Minum', 'Makan', 'Tidur', 'Jalan'], a: 1 },
      { q: '"Drink" artinya?', o: ['Minum', 'Makan', 'Tidur', 'Jalan'], a: 0 },
      { q: '"Sleep" artinya?', o: ['Minum', 'Makan', 'Tidur', 'Jalan'], a: 2 },
      { q: '"Walk" artinya?', o: ['Minum', 'Makan', 'Tidur', 'Jalan'], a: 3 },
      { q: '"Run" artinya?', o: ['Berlari', 'Berjalan', 'Melompat', 'Duduk'], a: 0 },
    ]
  },
  {
    id: 'e7', icon: '⏰', title: 'Time', desc: 'Waktu & hari',
    level: 'Beginner', xp: 15, questions: [
      { q: '"Today" artinya?', o: ['Kemarin', 'Hari ini', 'Besok', 'Sekarang'], a: 1 },
      { q: '"Tomorrow" artinya?', o: ['Kemarin', 'Hari ini', 'Besok', 'Sekarang'], a: 2 },
      { q: '"Yesterday" artinya?', o: ['Kemarin', 'Hari ini', 'Besok', 'Sekarang'], a: 0 },
      { q: '"Monday" artinya?', o: ['Senin', 'Selasa', 'Rabu', 'Kamis'], a: 0 },
    ]
  },
  {
    id: 'e8', icon: '📝', title: 'Simple Present', desc: 'Tenses dasar',
    level: 'Intermediate', xp: 20, questions: [
      { q: '"I ___ a student"', o: ['am', 'is', 'are', 'be'], a: 0 },
      { q: '"She ___ to school"', o: ['go', 'goes', 'going', 'went'], a: 1 },
      { q: '"They ___ happy"', o: ['am', 'is', 'are', 'be'], a: 2 },
      { q: '"He ___ English"', o: ['speak', 'speaks', 'speaking', 'spoke'], a: 1 },
    ]
  },
  {
    id: 'e9', icon: '📚', title: 'Past Tense', desc: 'Waktu lampau',
    level: 'Intermediate', xp: 20, questions: [
      { q: 'V2 dari "go"?', o: ['goed', 'went', 'gone', 'going'], a: 1 },
      { q: 'V2 dari "eat"?', o: ['eated', 'ate', 'eaten', 'eating'], a: 1 },
      { q: 'V2 dari "see"?', o: ['seed', 'saw', 'seen', 'seeing'], a: 1 },
      { q: 'V2 dari "buy"?', o: ['buyed', 'bought', 'buying', 'buys'], a: 1 },
    ]
  },
  {
    id: 'e10', icon: '💼', title: 'Business English', desc: 'Bahasa Inggris kerja',
    level: 'Advanced', xp: 25, questions: [
      { q: '"Meeting" artinya?', o: ['Rapat', 'Libur', 'Istirahat', 'Kerja'], a: 0 },
      { q: '"Deadline" artinya?', o: ['Tenggat', 'Garis mati', 'Akhir', 'Mulai'], a: 0 },
      { q: '"Invoice" artinya?', o: ['Faktur', 'Resi', 'Kuitansi', 'Nota'], a: 0 },
      { q: '"Colleague" artinya?', o: ['Kolega', 'Koleksi', 'Kantor', 'Klien'], a: 0 },
    ]
  },
];

if (typeof window !== 'undefined') {
  window.LESSON_CATEGORIES = LESSON_CATEGORIES;
  window.CODING_LESSONS = CODING_LESSONS;
  window.ENGLISH_LESSONS = ENGLISH_LESSONS;
}
