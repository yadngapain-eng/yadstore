/* ============================================
   YADSTORE — FEATURE REGISTRY v2
   ============================================
   📌 CARA TAMBAH FITUR BARU:
   1. Buka file ini
   2. Copy object fitur di array `features`
   3. Isi field-fieldnya
   4. Save → fitur otomatis muncul di gateway
   ============================================ */

const FEATURE_REGISTRY = {

  categories: {
    all:     { label: 'Semua',   icon: '✨' },
    belajar: { label: 'Belajar', icon: '📚' },
    game:    { label: 'Game',    icon: '🎮' },
    konten:  { label: 'Konten',  icon: '📰' },
    tools:   { label: 'Tools',   icon: '🛠️' },
    admin:   { label: 'Admin',   icon: '🔐' },
  },

  statuses: {
    live:  { label: 'Live',   cls: 'tag-live'  },
    new:   { label: 'New',    cls: 'tag-new'   },
    beta:  { label: 'Beta',   cls: 'tag-beta'  },
    soon:  { label: 'Segera', cls: 'tag-soon'  },
    pro:   { label: 'Pro',    cls: 'tag-pro'   },
    admin: { label: 'Admin',  cls: 'tag-admin' },
  },

  features: [
    {
      id: 'home',
      icon: '🏠',
      title: 'Home',
      desc: 'Landing page utama YadStore dengan hero, stats, dan highlight fitur.',
      href: 'index.html',
      category: 'konten',
      status: ['live'],
      order: 1,
    },
    {
      id: 'learn',
      icon: '📚',
      title: 'Belajar Coding',
      desc: '10 pelajaran coding interaktif + quiz stickman yang seru.',
      href: 'learn.html',
      category: 'belajar',
      status: ['live', 'new'],
      order: 2,
    },
    {
      id: 'store',
      icon: '🎮',
      title: 'Game Store',
      desc: '16 game & item seru siap dimainkan dan dikoleksi.',
      href: 'store.html',
      category: 'game',
      status: ['live', 'new'],
      order: 3,
    },
    {
      id: 'article',
      icon: '📰',
      title: 'Article & Novel',
      desc: '20+ article, berita, dan novel panjang untuk dibaca.',
      href: 'article.html',
      category: 'konten',
      status: ['live', 'pro'],
      order: 4,
    },
    {
      id: 'credit',
      icon: '💎',
      title: 'Credit',
      desc: 'Tentang YadStore, visi, misi, dan tim di baliknya.',
      href: 'credit.html',
      category: 'konten',
      status: ['live'],
      order: 5,
    },
    {
      id: 'admin',
      icon: '🔐',
      title: 'Admin Panel',
      desc: 'Panel admin lengkap untuk kelola konten YadStore.',
      href: 'admin.html',
      category: 'admin',
      status: ['admin'],
      order: 99,
    },

    /* ==========================================
       🎯 TEMPLATE FITUR BARU — uncomment saat siap
       ==========================================
    {
      id: 'certificate',
      icon: '🏅',
      title: 'Certificate',
      desc: 'Dapatkan sertifikat setelah menyelesaikan materi.',
      href: 'certificate.html',
      category: 'belajar',
      status: ['soon'],
      order: 10,
    },
    {
      id: 'leaderboard',
      icon: '🏆',
      title: 'Leaderboard',
      desc: 'Ranking coders terbaik mingguan & all-time.',
      href: 'leaderboard.html',
      category: 'game',
      status: ['soon'],
      order: 11,
    },
    {
      id: 'playground',
      icon: '🧪',
      title: 'Playground',
      desc: 'Live code editor untuk HTML, CSS, JS.',
      href: 'playground.html',
      category: 'tools',
      status: ['soon'],
      order: 12,
    },
    {
      id: 'profile',
      icon: '👤',
      title: 'Profile',
      desc: 'Profil user dengan progress & achievement.',
      href: 'profile.html',
      category: 'tools',
      status: ['soon'],
      order: 13,
    },
    {
      id: 'chat',
      icon: '💬',
      title: 'Community Chat',
      desc: 'Chat real-time dengan coders lain.',
      href: 'chat.html',
      category: 'tools',
      status: ['soon'],
      order: 14,
    },
    */
  ],

  site: {
    name: 'YadStore',
    tagline: 'Belajar coding, game store, article — semua di satu tempat.',
    footer: 'Made with 💙 by Ysdev',
    year: '2026',
  },
};

if (typeof window !== 'undefined') window.FEATURE_REGISTRY = FEATURE_REGISTRY;
