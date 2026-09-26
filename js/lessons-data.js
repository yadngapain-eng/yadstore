/* ============================================
   YADSTORE — LESSONS DATA (Dual Language)
   Setiap lesson punya versi ID + EN
   ============================================ */

const LESSON_CATEGORIES = {
  coding:  { label: 'Coding',     label_en: 'Coding',   icon: '💻', color: '#1cb0f6' },
  english: { label: 'English',    label_en: 'English',  icon: '🇬🇧', color: '#ce82ff' },
  math:    { label: 'Matematika', label_en: 'Math',     icon: '🔢', color: '#ff9600' },
  science: { label: 'Sains',      label_en: 'Science',  icon: '🔬', color: '#58cc02' },
};

// ============================================
// CODING LESSONS
// ============================================
const CODING_LESSONS = [
  {
    id: 'c1', icon: '🌐',
    title:    'HTML Dasar',
    title_en: 'HTML Basics',
    desc:     'Struktur halaman web',
    desc_en:  'Structure of web pages',
    level:    'Pemula',    level_en: 'Beginner',
    xp: 10,
    questions: [
      { q: 'Apa kepanjangan HTML?', q_en: 'What does HTML stand for?',
        o: ['HyperText Markup Language', 'High Tech Modern Lang', 'Home Tool Markup Lang', 'Hyperlink Text Markup'], a: 0 },
      { q: 'Tag untuk heading terbesar?', q_en: 'Tag for the largest heading?',
        o: ['&lt;h6&gt;', '&lt;h1&gt;', '&lt;head&gt;', '&lt;heading&gt;'], a: 1 },
      { q: 'Tag untuk paragraf?', q_en: 'Tag for paragraph?',
        o: ['&lt;para&gt;', '&lt;p&gt;', '&lt;pg&gt;', '&lt;text&gt;'], a: 1 },
      { q: 'Tag untuk link?', q_en: 'Tag for links?',
        o: ['&lt;link&gt;', '&lt;a&gt;', '&lt;href&gt;', '&lt;url&gt;'], a: 1 },
      { q: 'Tag untuk gambar?', q_en: 'Tag for images?',
        o: ['&lt;image&gt;', '&lt;picture&gt;', '&lt;img&gt;', '&lt;src&gt;'], a: 2 },
      { q: 'Tag untuk list bernomor?', q_en: 'Tag for ordered list?',
        o: ['&lt;ul&gt;', '&lt;ol&gt;', '&lt;li&gt;', '&lt;list&gt;'], a: 1 },
    ]
  },
  {
    id: 'c2', icon: '🎨',
    title:    'CSS Dasar',
    title_en: 'CSS Basics',
    desc:     'Styling halaman web',
    desc_en:  'Styling web pages',
    level:    'Pemula', level_en: 'Beginner',
    xp: 10,
    questions: [
      { q: 'CSS singkatan dari?', q_en: 'CSS stands for?',
        o: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Colorful Style Sheets'], a: 1 },
      { q: 'Properti warna teks?', q_en: 'Property for text color?',
        o: ['text-color', 'font-color', 'color', 'text-style'], a: 2 },
      { q: 'Selector untuk class?', q_en: 'Selector for class?',
        o: ['#nama', '.nama', 'nama', '*nama'], a: 1 },
      { q: 'Selector untuk id?', q_en: 'Selector for id?',
        o: ['#nama', '.nama', 'nama', '@nama'], a: 0 },
      { q: 'Properti ukuran font?', q_en: 'Property for font size?',
        o: ['font-size', 'text-size', 'size', 'font-style'], a: 0 },
    ]
  },
  {
    id: 'c3', icon: '⚡',
    title:    'JavaScript Dasar',
    title_en: 'JavaScript Basics',
    desc:     'Bikin web interaktif',
    desc_en:  'Make interactive websites',
    level:    'Pemula', level_en: 'Beginner',
    xp: 15,
    questions: [
      { q: 'Keyword variabel konstanta?', q_en: 'Keyword for constant variable?',
        o: ['var', 'let', 'const', 'static'], a: 2 },
      { q: 'Print ke console?', q_en: 'Print to console?',
        o: ['print()', 'log()', 'console.log()', 'echo()'], a: 2 },
      { q: 'Tipe data teks?', q_en: 'Data type for text?',
        o: ['int', 'string', 'bool', 'float'], a: 1 },
      { q: 'Cara deklarasi function?', q_en: 'How to declare a function?',
        o: ['function nama() {}', 'def nama() {}', 'func nama() {}', 'void nama() {}'], a: 0 },
      { q: 'Hasil 2 + "2"?', q_en: 'Result of 2 + "2"?',
        o: ['4', '"22"', 'NaN', 'Error'], a: 1 },
      { q: 'Operator strict equality?', q_en: 'Strict equality operator?',
        o: ['=', '==', '===', '!='], a: 2 },
    ]
  },
  {
    id: 'c4', icon: '🐍',
    title:    'Python Dasar',
    title_en: 'Python Basics',
    desc:     'Bahasa ramah pemula',
    desc_en:  'Beginner-friendly language',
    level:    'Pemula', level_en: 'Beginner',
    xp: 15,
    questions: [
      { q: 'Print di Python?', q_en: 'Print in Python?',
        o: ['echo()', 'print()', 'console.log()', 'printf()'], a: 1 },
      { q: 'Keyword function?', q_en: 'Keyword for function?',
        o: ['function', 'def', 'func', 'void'], a: 1 },
      { q: 'Tipe data teks?', q_en: 'Data type for text?',
        o: ['str', 'string', 'text', 'char'], a: 0 },
      { q: 'Cara komentar?', q_en: 'How to comment?',
        o: ['//', '#', '/* */', '<!-- -->'], a: 1 },
      { q: 'Ambil input?', q_en: 'Take input?',
        o: ['input()', 'scan()', 'read()', 'get()'], a: 0 },
    ]
  },
  {
    id: 'c5', icon: '🌳',
    title:    'JavaScript DOM',
    title_en: 'JavaScript DOM',
    desc:     'Manipulasi HTML',
    desc_en:  'Manipulate HTML',
    level:    'Menengah', level_en: 'Intermediate',
    xp: 20,
    questions: [
      { q: 'DOM singkatan?', q_en: 'DOM stands for?',
        o: ['Data Object Model', 'Document Object Model', 'Digital Object Model', 'Document Oriented Model'], a: 1 },
      { q: 'Ambil elemen by id?', q_en: 'Get element by id?',
        o: ['getElementById()', 'getId()', 'queryId()', 'findId()'], a: 0 },
      { q: 'Event klik tombol?', q_en: 'Button click event?',
        o: ['onhover', 'onclick', 'onpress', 'ontap'], a: 1 },
      { q: 'Tambah class?', q_en: 'Add class?',
        o: ['classList.add()', 'addClass()', 'class.add()', 'className.add()'], a: 0 },
    ]
  },
  {
    id: 'c6', icon: '📐',
    title:    'CSS Flexbox',
    title_en: 'CSS Flexbox',
    desc:     'Layout modern',
    desc_en:  'Modern layout',
    level:    'Menengah', level_en: 'Intermediate',
    xp: 20,
    questions: [
      { q: 'Aktifkan flexbox?', q_en: 'Enable flexbox?',
        o: ['display: block', 'display: flex', 'display: grid', 'display: inline'], a: 1 },
      { q: 'Posisi horizontal?', q_en: 'Horizontal position?',
        o: ['align-items', 'justify-content', 'text-align', 'flex-align'], a: 1 },
      { q: 'Posisi vertikal?', q_en: 'Vertical position?',
        o: ['align-items', 'justify-content', 'vertical-align', 'flex-align'], a: 0 },
      { q: 'Jarak antar item?', q_en: 'Space between items?',
        o: ['margin', 'padding', 'gap', 'space'], a: 2 },
    ]
  },
  {
    id: 'c7', icon: '🔲',
    title:    'CSS Grid',
    title_en: 'CSS Grid',
    desc:     'Layout 2 dimensi',
    desc_en:  '2D layout',
    level:    'Menengah', level_en: 'Intermediate',
    xp: 20,
    questions: [
      { q: 'Aktifkan grid?', q_en: 'Enable grid?',
        o: ['display: block', 'display: flex', 'display: grid', 'display: inline'], a: 2 },
      { q: 'Atur kolom?', q_en: 'Set columns?',
        o: ['grid-template-columns', 'grid-columns', 'columns', 'grid-cols'], a: 0 },
      { q: '1fr artinya?', q_en: 'What does 1fr mean?',
        o: ['1 pixel', '1 fragment', '1 fraction', '1 free'], a: 2 },
    ]
  },
  {
    id: 'c8', icon: '🔀',
    title:    'Git & GitHub',
    title_en: 'Git & GitHub',
    desc:     'Version control',
    desc_en:  'Version control',
    level:    'Pemula', level_en: 'Beginner',
    xp: 15,
    questions: [
      { q: 'Inisialisasi repo?', q_en: 'Initialize repo?',
        o: ['git start', 'git init', 'git new', 'git create'], a: 1 },
      { q: 'Tambah file ke staging?', q_en: 'Add file to staging?',
        o: ['git add', 'git push', 'git commit', 'git save'], a: 0 },
      { q: 'Simpan perubahan?', q_en: 'Save changes?',
        o: ['git add', 'git commit', 'git push', 'git save'], a: 1 },
      { q: 'Upload ke remote?', q_en: 'Upload to remote?',
        o: ['git add', 'git commit', 'git push', 'git pull'], a: 2 },
    ]
  },
  {
    id: 'c9', icon: '⏳',
    title:    'JavaScript Async',
    title_en: 'JavaScript Async',
    desc:     'Promise & async',
    desc_en:  'Promise & async',
    level:    'Lanjutan', level_en: 'Advanced',
    xp: 25,
    questions: [
      { q: 'Async function return?', q_en: 'Async function returns?',
        o: ['Promise', 'Object', 'Array', 'String'], a: 0 },
      { q: 'Keyword await?', q_en: 'Keyword await?',
        o: ['async', 'await', 'wait', 'then'], a: 1 },
      { q: 'Handle promise?', q_en: 'Handle promise?',
        o: ['.then()', '.handle()', '.catch()', 'a dan c'], a: 3 },
    ]
  },
  {
    id: 'c10', icon: '🧬',
    title:    'Python OOP',
    title_en: 'Python OOP',
    desc:     'Class & Object',
    desc_en:  'Class & Object',
    level:    'Menengah', level_en: 'Intermediate',
    xp: 25,
    questions: [
      { q: 'Keyword class?', q_en: 'Keyword for class?',
        o: ['class', 'struct', 'object', 'def'], a: 0 },
      { q: 'Method inisialisasi?', q_en: 'Initialization method?',
        o: ['__init__', '__new__', '__start__', '__begin__'], a: 0 },
      { q: 'Parameter self artinya?', q_en: 'Parameter self means?',
        o: ['Diri sendiri', 'Static', 'Global', 'Kelas'], a: 0 },
    ]
  },
  {
    id: 'c11', icon: '🗄️',
    title:    'SQL Dasar',
    title_en: 'SQL Basics',
    desc:     'Database query',
    desc_en:  'Database query',
    level:    'Menengah', level_en: 'Intermediate',
    xp: 20,
    questions: [
      { q: 'Ambil semua data?', q_en: 'Get all data?',
        o: ['SELECT * FROM tabel', 'GET * FROM tabel', 'FETCH * tabel', 'TAKE * tabel'], a: 0 },
      { q: 'Filter data?', q_en: 'Filter data?',
        o: ['WHERE', 'FILTER', 'IF', 'WHEN'], a: 0 },
      { q: 'Urutkan naik?', q_en: 'Sort ascending?',
        o: ['ORDER BY ASC', 'SORT UP', 'ORDER ASC', 'SORT BY'], a: 0 },
    ]
  },
  {
    id: 'c12', icon: '⚛️',
    title:    'React Dasar',
    title_en: 'React Basics',
    desc:     'Library UI populer',
    desc_en:  'Popular UI library',
    level:    'Lanjutan', level_en: 'Advanced',
    xp: 25,
    questions: [
      { q: 'React dibuat oleh?', q_en: 'React made by?',
        o: ['Google', 'Facebook', 'Microsoft', 'Amazon'], a: 1 },
      { q: 'File ekstensi React?', q_en: 'React file extension?',
        o: ['.jsx', '.react', '.rjs', '.js'], a: 0 },
      { q: 'State di function component?', q_en: 'State in function component?',
        o: ['useState', 'setState', 'state', 'this.state'], a: 0 },
    ]
  },
];

// ============================================
// ENGLISH LESSONS
// ============================================
const ENGLISH_LESSONS = [
  {
    id: 'e1', icon: '👋',
    title: 'Greetings', title_en: 'Greetings',
    desc: 'Sapaan dasar', desc_en: 'Basic greetings',
    level: 'Beginner', level_en: 'Beginner', xp: 10,
    questions: [
      { q: '"Good morning" artinya?', q_en: 'What does "Good morning" mean?',
        o: ['Selamat pagi', 'Selamat malam', 'Selamat siang', 'Selamat sore'], a: 0 },
      { q: 'Cara bilang "Terima kasih"?', q_en: 'How to say "Thank you"?',
        o: ['Sorry', 'Thank you', 'Please', 'Hello'], a: 1 },
      { q: '"How are you?" artinya?', q_en: 'What does "How are you?" mean?',
        o: ['Apa kabar?', 'Siapa kamu?', 'Di mana?', 'Kapan?'], a: 0 },
      { q: 'Balasan "I am fine"?', q_en: 'Response to "I am fine"?',
        o: ['Saya baik', 'Saya lapar', 'Saya lelah', 'Saya sibuk'], a: 0 },
      { q: '"Goodbye" artinya?', q_en: 'What does "Goodbye" mean?',
        o: ['Halo', 'Selamat tinggal', 'Terima kasih', 'Maaf'], a: 1 },
    ]
  },
  {
    id: 'e2', icon: '🔢',
    title: 'Numbers', title_en: 'Numbers',
    desc: 'Angka 1-100', desc_en: 'Numbers 1-100',
    level: 'Beginner', level_en: 'Beginner', xp: 10,
    questions: [
      { q: '"Five" artinya?', q_en: 'What does "Five" mean?',
        o: ['4', '5', '6', '7'], a: 1 },
      { q: 'Angka "10" dalam Inggris?', q_en: 'Number "10" in English?',
        o: ['Ten', 'Nine', 'Eleven', 'Twelve'], a: 0 },
      { q: '"Twenty" artinya?', q_en: 'What does "Twenty" mean?',
        o: ['12', '20', '22', '200'], a: 1 },
      { q: '"One hundred" artinya?', q_en: 'What does "One hundred" mean?',
        o: ['10', '100', '1000', '1'], a: 1 },
    ]
  },
  {
    id: 'e3', icon: '🎨',
    title: 'Colors', title_en: 'Colors',
    desc: 'Warna-warna', desc_en: 'Colors',
    level: 'Beginner', level_en: 'Beginner', xp: 10,
    questions: [
      { q: '"Red" artinya?', q_en: 'What does "Red" mean?',
        o: ['Biru', 'Merah', 'Kuning', 'Hijau'], a: 1 },
      { q: '"Blue" artinya?', q_en: 'What does "Blue" mean?',
        o: ['Biru', 'Merah', 'Kuning', 'Hijau'], a: 0 },
      { q: '"Green" artinya?', q_en: 'What does "Green" mean?',
        o: ['Biru', 'Merah', 'Kuning', 'Hijau'], a: 3 },
      { q: '"Yellow" artinya?', q_en: 'What does "Yellow" mean?',
        o: ['Biru', 'Merah', 'Kuning', 'Hijau'], a: 2 },
      { q: '"Black" artinya?', q_en: 'What does "Black" mean?',
        o: ['Putih', 'Hitam', 'Abu-abu', 'Cokelat'], a: 1 },
    ]
  },
  {
    id: 'e4', icon: '👨‍👩‍👧',
    title: 'Family', title_en: 'Family',
    desc: 'Anggota keluarga', desc_en: 'Family members',
    level: 'Beginner', level_en: 'Beginner', xp: 15,
    questions: [
      { q: '"Father" artinya?', q_en: 'What does "Father" mean?',
        o: ['Ibu', 'Ayah', 'Kakak', 'Adik'], a: 1 },
      { q: '"Mother" artinya?', q_en: 'What does "Mother" mean?',
        o: ['Ibu', 'Ayah', 'Kakak', 'Adik'], a: 0 },
      { q: '"Brother" artinya?', q_en: 'What does "Brother" mean?',
        o: ['Kakak/Adik perempuan', 'Kakak/Adik laki-laki', 'Ayah', 'Ibu'], a: 1 },
      { q: '"Sister" artinya?', q_en: 'What does "Sister" mean?',
        o: ['Kakak/Adik perempuan', 'Kakak/Adik laki-laki', 'Ayah', 'Ibu'], a: 0 },
    ]
  },
  {
    id: 'e5', icon: '🍔',
    title: 'Food & Drink', title_en: 'Food & Drink',
    desc: 'Makanan & minuman', desc_en: 'Food & drinks',
    level: 'Beginner', level_en: 'Beginner', xp: 15,
    questions: [
      { q: '"Rice" artinya?', q_en: 'What does "Rice" mean?',
        o: ['Nasi', 'Roti', 'Mie', 'Air'], a: 0 },
      { q: '"Water" artinya?', q_en: 'What does "Water" mean?',
        o: ['Nasi', 'Roti', 'Mie', 'Air'], a: 3 },
      { q: '"Bread" artinya?', q_en: 'What does "Bread" mean?',
        o: ['Nasi', 'Roti', 'Mie', 'Air'], a: 1 },
      { q: '"Chicken" artinya?', q_en: 'What does "Chicken" mean?',
        o: ['Sapi', 'Ayam', 'Ikan', 'Kambing'], a: 1 },
    ]
  },
  {
    id: 'e6', icon: '🏃',
    title: 'Verbs', title_en: 'Verbs',
    desc: 'Kata kerja umum', desc_en: 'Common verbs',
    level: 'Beginner', level_en: 'Beginner', xp: 15,
    questions: [
      { q: '"Eat" artinya?', q_en: 'What does "Eat" mean?',
        o: ['Minum', 'Makan', 'Tidur', 'Jalan'], a: 1 },
      { q: '"Drink" artinya?', q_en: 'What does "Drink" mean?',
        o: ['Minum', 'Makan', 'Tidur', 'Jalan'], a: 0 },
      { q: '"Sleep" artinya?', q_en: 'What does "Sleep" mean?',
        o: ['Minum', 'Makan', 'Tidur', 'Jalan'], a: 2 },
      { q: '"Walk" artinya?', q_en: 'What does "Walk" mean?',
        o: ['Minum', 'Makan', 'Tidur', 'Jalan'], a: 3 },
      { q: '"Run" artinya?', q_en: 'What does "Run" mean?',
        o: ['Berlari', 'Berjalan', 'Melompat', 'Duduk'], a: 0 },
    ]
  },
  {
    id: 'e7', icon: '⏰',
    title: 'Time & Days', title_en: 'Time & Days',
    desc: 'Waktu & hari', desc_en: 'Time & days',
    level: 'Beginner', level_en: 'Beginner', xp: 15,
    questions: [
      { q: '"Today" artinya?', q_en: 'What does "Today" mean?',
        o: ['Kemarin', 'Hari ini', 'Besok', 'Sekarang'], a: 1 },
      { q: '"Tomorrow" artinya?', q_en: 'What does "Tomorrow" mean?',
        o: ['Kemarin', 'Hari ini', 'Besok', 'Sekarang'], a: 2 },
      { q: '"Yesterday" artinya?', q_en: 'What does "Yesterday" mean?',
        o: ['Kemarin', 'Hari ini', 'Besok', 'Sekarang'], a: 0 },
      { q: '"Monday" artinya?', q_en: 'What does "Monday" mean?',
        o: ['Senin', 'Selasa', 'Rabu', 'Kamis'], a: 0 },
      { q: '"Sunday" artinya?', q_en: 'What does "Sunday" mean?',
        o: ['Sabtu', 'Minggu', 'Senin', 'Jumat'], a: 1 },
    ]
  },
  {
    id: 'e8', icon: '📝',
    title: 'Simple Present', title_en: 'Simple Present',
    desc: 'Tenses dasar', desc_en: 'Basic tense',
    level: 'Intermediate', level_en: 'Intermediate', xp: 20,
    questions: [
      { q: '"I ___ a student"', q_en: '"I ___ a student"',
        o: ['am', 'is', 'are', 'be'], a: 0 },
      { q: '"She ___ to school"', q_en: '"She ___ to school"',
        o: ['go', 'goes', 'going', 'went'], a: 1 },
      { q: '"They ___ happy"', q_en: '"They ___ happy"',
        o: ['am', 'is', 'are', 'be'], a: 2 },
      { q: '"He ___ English"', q_en: '"He ___ English"',
        o: ['speak', 'speaks', 'speaking', 'spoke'], a: 1 },
    ]
  },
  {
    id: 'e9', icon: '📚',
    title: 'Past Tense', title_en: 'Past Tense',
    desc: 'Waktu lampau', desc_en: 'Past time',
    level: 'Intermediate', level_en: 'Intermediate', xp: 20,
    questions: [
      { q: 'V2 dari "go"?', q_en: 'V2 of "go"?',
        o: ['goed', 'went', 'gone', 'going'], a: 1 },
      { q: 'V2 dari "eat"?', q_en: 'V2 of "eat"?',
        o: ['eated', 'ate', 'eaten', 'eating'], a: 1 },
      { q: 'V2 dari "see"?', q_en: 'V2 of "see"?',
        o: ['seed', 'saw', 'seen', 'seeing'], a: 1 },
      { q: 'V2 dari "buy"?', q_en: 'V2 of "buy"?',
        o: ['buyed', 'bought', 'buying', 'buys'], a: 1 },
    ]
  },
  {
    id: 'e10', icon: '💼',
    title: 'Business English', title_en: 'Business English',
    desc: 'Bahasa kerja', desc_en: 'Work language',
    level: 'Advanced', level_en: 'Advanced', xp: 25,
    questions: [
      { q: '"Meeting" artinya?', q_en: 'What does "Meeting" mean?',
        o: ['Rapat', 'Libur', 'Istirahat', 'Kerja'], a: 0 },
      { q: '"Deadline" artinya?', q_en: 'What does "Deadline" mean?',
        o: ['Tenggat', 'Garis mati', 'Akhir', 'Mulai'], a: 0 },
      { q: '"Invoice" artinya?', q_en: 'What does "Invoice" mean?',
        o: ['Faktur', 'Resi', 'Kuitansi', 'Nota'], a: 0 },
      { q: '"Colleague" artinya?', q_en: 'What does "Colleague" mean?',
        o: ['Kolega', 'Koleksi', 'Kantor', 'Klien'], a: 0 },
    ]
  },
];

// ============================================
// MATH LESSONS
// ============================================
const MATH_LESSONS = [
  {
    id: 'm1', icon: '➕',
    title: 'Penjumlahan', title_en: 'Addition',
    desc: 'Tambah-tambahan', desc_en: 'Adding numbers',
    level: 'Dasar', level_en: 'Basic', xp: 10,
    questions: [
      { q: '5 + 3 = ?', q_en: '5 + 3 = ?', o: ['7', '8', '9', '10'], a: 1 },
      { q: '12 + 8 = ?', q_en: '12 + 8 = ?', o: ['18', '19', '20', '21'], a: 2 },
      { q: '25 + 15 = ?', q_en: '25 + 15 = ?', o: ['35', '40', '45', '50'], a: 1 },
    ]
  },
  {
    id: 'm2', icon: '➖',
    title: 'Pengurangan', title_en: 'Subtraction',
    desc: 'Kurang-kurangan', desc_en: 'Subtracting numbers',
    level: 'Dasar', level_en: 'Basic', xp: 10,
    questions: [
      { q: '10 - 4 = ?', q_en: '10 - 4 = ?', o: ['5', '6', '7', '8'], a: 1 },
      { q: '20 - 7 = ?', q_en: '20 - 7 = ?', o: ['11', '12', '13', '14'], a: 2 },
      { q: '50 - 25 = ?', q_en: '50 - 25 = ?', o: ['20', '25', '30', '35'], a: 1 },
    ]
  },
  {
    id: 'm3', icon: '✖️',
    title: 'Perkalian', title_en: 'Multiplication',
    desc: 'Kali-kalian', desc_en: 'Multiplying numbers',
    level: 'Dasar', level_en: 'Basic', xp: 15,
    questions: [
      { q: '7 x 8 = ?', q_en: '7 x 8 = ?', o: ['54', '56', '58', '60'], a: 1 },
      { q: '9 x 9 = ?', q_en: '9 x 9 = ?', o: ['72', '81', '90', '99'], a: 1 },
      { q: '12 x 12 = ?', q_en: '12 x 12 = ?', o: ['124', '134', '144', '154'], a: 2 },
    ]
  },
  {
    id: 'm4', icon: '➗',
    title: 'Pembagian', title_en: 'Division',
    desc: 'Bagi-bagian', desc_en: 'Dividing numbers',
    level: 'Dasar', level_en: 'Basic', xp: 15,
    questions: [
      { q: '20 / 4 = ?', q_en: '20 / 4 = ?', o: ['4', '5', '6', '7'], a: 1 },
      { q: '72 / 8 = ?', q_en: '72 / 8 = ?', o: ['8', '9', '10', '11'], a: 1 },
      { q: '100 / 5 = ?', q_en: '100 / 5 = ?', o: ['15', '20', '25', '30'], a: 1 },
    ]
  },
];

// ============================================
// SCIENCE LESSONS
// ============================================
const SCIENCE_LESSONS = [
  {
    id: 's1', icon: '🌍',
    title: 'Tata Surya', title_en: 'Solar System',
    desc: 'Planet-planet', desc_en: 'The planets',
    level: 'Dasar', level_en: 'Basic', xp: 15,
    questions: [
      { q: 'Planet terdekat matahari?', q_en: 'Closest planet to the sun?',
        o: ['Venus', 'Merkurius', 'Bumi', 'Mars'], a: 1 },
      { q: 'Planet terbesar?', q_en: 'Largest planet?',
        o: ['Saturnus', 'Jupiter', 'Neptunus', 'Uranus'], a: 1 },
      { q: 'Planet merah?', q_en: 'The red planet?',
        o: ['Venus', 'Mars', 'Jupiter', 'Merkurius'], a: 1 },
      { q: 'Satelit bumi?', q_en: "Earth's satellite?",
        o: ['Matahari', 'Bulan', 'Mars', 'Venus'], a: 1 },
    ]
  },
  {
    id: 's2', icon: '🧪',
    title: 'Kimia Dasar', title_en: 'Basic Chemistry',
    desc: 'Unsur & senyawa', desc_en: 'Elements & compounds',
    level: 'Dasar', level_en: 'Basic', xp: 15,
    questions: [
      { q: 'Simbol air?', q_en: 'Symbol for water?',
        o: ['CO2', 'H2O', 'O2', 'NaCl'], a: 1 },
      { q: 'Simbol oksigen?', q_en: 'Symbol for oxygen?',
        o: ['O', 'O2', 'Ox', 'Og'], a: 1 },
      { q: 'Simbol emas?', q_en: 'Symbol for gold?',
        o: ['Go', 'Au', 'Ag', 'Em'], a: 1 },
    ]
  },
  {
    id: 's3', icon: '🧬',
    title: 'Biologi', title_en: 'Biology',
    desc: 'Makhluk hidup', desc_en: 'Living things',
    level: 'Dasar', level_en: 'Basic', xp: 15,
    questions: [
      { q: 'Unit terkecil makhluk hidup?', q_en: 'Smallest unit of living things?',
        o: ['Atom', 'Sel', 'Organ', 'Jaringan'], a: 1 },
      { q: 'Fotosintesis terjadi di?', q_en: 'Photosynthesis happens in?',
        o: ['Akar', 'Batang', 'Daun', 'Bunga'], a: 2 },
      { q: 'Alat pernapasan manusia?', q_en: 'Human respiratory organ?',
        o: ['Insang', 'Paru-paru', 'Trakea', 'Kulit'], a: 1 },
    ]
  },
];

// ============================================
// HELPER: Ambil lessons sesuai bahasa
// ============================================
function getLessonsByLang(cat, lang) {
  let lessons = [];
  if (cat === 'english') lessons = ENGLISH_LESSONS;
  else if (cat === 'math') lessons = MATH_LESSONS;
  else if (cat === 'science') lessons = SCIENCE_LESSONS;
  else lessons = CODING_LESSONS;

  if (lang === 'en') {
    return lessons.map(l => ({
      ...l,
      title: l.title_en || l.title,
      desc: l.desc_en || l.desc,
      level: l.level_en || l.level,
      questions: l.questions.map(q => ({
        q: q.q_en || q.q,
        o: q.o,
        a: q.a,
      })),
    }));
  }
  return lessons;
}

if (typeof window !== 'undefined') {
  window.LESSON_CATEGORIES = LESSON_CATEGORIES;
  window.CODING_LESSONS = CODING_LESSONS;
  window.ENGLISH_LESSONS = ENGLISH_LESSONS;
  window.MATH_LESSONS = MATH_LESSONS;
  window.SCIENCE_LESSONS = SCIENCE_LESSONS;
  window.getLessonsByLang = getLessonsByLang;
}

console.log('[lessons-data] dual language loaded');
