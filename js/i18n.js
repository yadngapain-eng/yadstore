/* YADSTORE — i18n v2 (Full Translation) */

const I18n = {
  currentLang: 'id',
  SUPPORTED: ['id', 'en'],

  TRANSLATIONS: {
    id: {
      // Header
      brand: 'YadStore',
      // Tabs
      tab_learn: 'Learn',
      tab_topup: 'Top Up',
      tab_orders: 'Pesanan',
      tab_profile: 'Profile',
      tab_reward: 'Reward',
      tab_help: 'Bantuan',
      // Page headers
      learn_title: '📚 Belajar',
      learn_subtitle: 'Selesaikan lesson untuk dapat XP & Gems',
      achievements_title: '🏆 Achievements',
      achievements_subtitle: 'Kumpulkan achievement, dapat koin!',
      topup_title: '🛒 Top Up Instan',
      topup_subtitle: 'Game, Pulsa & Kuota - Proses 1 detik',
      orders_title: '📦 Pesanan',
      orders_subtitle: 'Riwayat transaksi kamu',
      profile_title: '👤 Profile',
      profile_subtitle: 'Statistik & pencapaianmu',
      help_title: '💬 Bantuan',
      help_subtitle: 'Pertanyaan umum',
      reward_title: '💰 Reward',
      reward_subtitle: 'Kumpulkan koin, tukar jadi uang',

      // ===== HELP PAGE =====
      help_q1: 'Cara belajar?',
      help_a1: 'Pilih kategori → pilih lesson → jawab soal → dapat XP.',
      help_q2: 'Cara top up?',
      help_a2: 'Pilih game/pulsa → isi data → pilih nominal → bayar → upload bukti.',
      help_q3: 'Metode bayar?',
      help_a3: 'QRIS, DANA, GoPay, OVO, ShopeePay, BCA, BNI, BRI, Mandiri.',
      help_q4: 'Bagaimana cara dapat koin?',
      help_a4: 'Login harian, selesaikan lesson, nonton iklan, atau top up. Setiap aktivitas dapat koin!',
      help_q5: 'Bagaimana cara withdraw?',
      help_a5: 'Kumpulkan koin minimal Rp 10.000, lalu withdraw ke DANA/OVO/GoPay/ShopeePay/SEABANK.',
      help_q6: 'Apakah website ini aman?',
      help_a6: 'Ya. Kami pakai Firebase + server-side validation. Data kamu terenkripsi dan aman.',

      // ===== REWARD PAGE =====
      reward_balance_label: 'SALDO KAMU',
      reward_coin_unit: 'koin',
      reward_coin_rate: '1 koin = Rp 1',
      reward_watch_ad_title: '🎬 Nonton Iklan',
      reward_watch_ad_desc: 'Dapat 1-100 koin per iklan (max 5/hari)',
      reward_ad_counter: 'hari ini',
      reward_ad_remaining: 'sisa',
      reward_ad_limit_reached: 'batas tercapai',
      reward_ad_btn: '🎬 Nonton Iklan (+1-100 koin)',
      reward_ad_cooldown: 'Tunggu',
      reward_missions_title: '🎯 Misi & Reward',
      reward_level_title: '📈 Reward Naik Level',
      reward_level_next: 'Level',
      reward_level_coin: 'koin',
      reward_level_desc: 'Semakin tinggi = makin besar',
      reward_referral_title: '🎁 Referral',
      reward_referral_desc: 'Ajak teman, dapat 500 koin per referral',
      reward_referral_copy: '📋 Copy',
      reward_history_title: '📜 Riwayat Koin',
      reward_history_empty: 'Belum ada transaksi',
      reward_withdraw_title: '💸 Withdraw ke Uang',
      reward_withdraw_min: 'Minimal Rp 10.000',
      reward_withdraw_btn: '💸 Withdraw Sekarang',
      reward_withdraw_locked: '🔒 Saldo belum cukup',

      // Missions
      mission_login: 'Login Harian',
      mission_lesson: 'Selesaikan Lesson',
      mission_perfect: 'Skor 100%',
      mission_topup: 'Top Up Sekali',
      mission_ad5: 'Nonton 5 Iklan',
      mission_streak3: 'Streak 3 Hari',
      mission_streak7: 'Streak 7 Hari',
      // Daily Spin
      spin_title: '🎰 Spin Harian',
      spin_desc: 'Putar sekali sehari, dapat 1-10 heart!',
      spin_btn: '🎰 SPIN SEKARANG',
      spin_already: '✅ Sudah spin hari ini',
      spin_next: 'Kembali besok ya!',
      spin_win: 'Dapat {n} heart!',
      spin_spinning: '🎰 Memutar...',
      spin_result: 'SELAMAT!',
      ad_reward_coin: '+{n} koin!',
      ad_reward_jackpot: '🎉 JACKPOT! +{n} koin!',
      mission_coin_suffix: 'koin',

      // ===== TOP UP PAGE =====
      topup_select_game: 'Pilih Game / Layanan',
      topup_account_data: 'Data Akun',
      topup_select_nominal: 'Pilih Nominal',
      topup_confirm_order: 'Konfirmasi Pesanan',
      topup_game_label: 'Layanan',
      topup_item_label: 'Item',
      topup_total_label: 'Total',
      topup_choose_payment: 'Pilih Pembayaran',
      topup_btn_order: 'Pesan Sekarang',
      topup_btn_back: 'Kembali',
      topup_payment_title: 'Pembayaran',
      topup_order_label: 'Order',
      topup_total_pay: 'Total Bayar',
      topup_pay_via: 'Bayar via',
      topup_method_label: 'Metode',
      topup_amount_label: 'Nominal',
      topup_account_number: 'Nomor Rekening',
      topup_account_name: 'Atas Nama',
      topup_upload_proof: 'Upload Bukti Transfer',
      topup_notice: 'Transfer sesuai nominal ke rekening di atas. Setelah transfer, upload bukti di bawah.',
      topup_btn_paid: 'Saya Sudah Bayar',
      topup_btn_later: 'Nanti',
      topup_success_title: 'Pesanan Dikirim!',
      topup_success_desc: 'Admin akan verifikasi segera. Cek status di menu Pesanan.',
      topup_btn_view_orders: 'Lihat Pesanan',

      // ===== ORDERS PAGE =====
      orders_empty: 'Belum ada pesanan',
      orders_date_label: '📅 Tanggal',
      orders_id_label: 'Order ID',
      orders_product_label: 'Produk',
      orders_method_label: 'Metode Bayar',
      orders_total_label: 'Total',

      // ===== PROFILE PAGE =====
      profile_mode_anon: '👤 Mode Anonim',
      profile_mode_google: '✅ Login Google',
      profile_level: 'Level',
      profile_btn_login: 'Login dengan Google',
      profile_btn_change_name: '🎲 Ganti Nama Random',
      profile_btn_logout: '🚪 Logout',
      profile_btn_refill: 'Isi Hearts (20 💎)',
      profile_btn_reset: 'Reset Data',

      // Stats
      stat_xp: 'Total XP',
      stat_streak: 'Streak',
      stat_gems: 'Gems',
      stat_lessons: 'Lesson',
      stat_correct: 'Benar',
      stat_wrong: 'Salah',

      // ===== LESSON =====
      lesson_question: 'Soal',
      lesson_correct: 'Benar! 🎉',
      lesson_wrong: 'Salah. Jawaban benar:',
      lesson_try_again: '❌ Belum tepat. Coba lagi ya! 💪',
      lesson_result_perfect: 'Sempurna!',
      lesson_result_done: 'Selesai!',
      lesson_score: 'Skor',
      lesson_btn_continue: 'Lanjut',

      // Toast
      toast_name_changed: 'Nama baru:',
      toast_coin_earned: '+1 koin! 🪙',
      toast_ad_opening: 'Membuka iklan...',
      toast_ad_failed: '❌ Iklan gagal dimuat',
      toast_ad_not_ready: '⚠️ Iklan belum siap, coba lagi',
      toast_withdraw_success: 'Withdraw diajukan! Cek Telegram.',
      toast_hearts_full: 'Hearts penuh!',
      toast_gems_low: 'Gems tidak cukup',

      // Language
      lang_select: 'Bahasa',
      lang_id: '🇮🇩 Indonesia',
      lang_en: '🇬🇧 English',
    },

    en: {
      // Header
      brand: 'YadStore',
      // Tabs
      tab_learn: 'Learn',
      tab_topup: 'Top Up',
      tab_orders: 'Orders',
      tab_profile: 'Profile',
      tab_reward: 'Reward',
      tab_help: 'Help',
      // Page headers
      learn_title: '📚 Learn',
      learn_subtitle: 'Complete lessons to earn XP & Gems',
      achievements_title: '🏆 Achievements',
      achievements_subtitle: 'Kumpulkan achievement, dapat koin!',
      topup_title: '🛒 Instant Top Up',
      topup_subtitle: 'Games, Pulsa & Data - 1 second process',
      orders_title: '📦 Orders',
      orders_subtitle: 'Your transaction history',
      profile_title: '👤 Profile',
      profile_subtitle: 'Your stats & achievements',
      help_title: '💬 Help',
      help_subtitle: 'Frequently asked questions',
      reward_title: '💰 Rewards',
      reward_subtitle: 'Collect coins, exchange for money',

      // ===== HELP PAGE =====
      help_q1: 'How to learn?',
      help_a1: 'Choose category → pick lesson → answer → earn XP.',
      help_q2: 'How to top up?',
      help_a2: 'Choose game/pulsa → fill data → pick nominal → pay → upload proof.',
      help_q3: 'Payment methods?',
      help_a3: 'QRIS, DANA, GoPay, OVO, ShopeePay, BCA, BNI, BRI, Mandiri.',
      help_q4: 'How to earn coins?',
      help_a4: 'Daily login, complete lessons, watch ads, or top up. Every activity earns coins!',
      help_q5: 'How to withdraw?',
      help_a5: 'Collect at least Rp 10.000, then withdraw to DANA/OVO/GoPay/ShopeePay/SEABANK.',
      help_q6: 'Is this website safe?',
      help_a6: 'Yes. We use Firebase + server-side validation. Your data is encrypted and safe.',

      // ===== REWARD PAGE =====
      reward_balance_label: 'YOUR BALANCE',
      reward_coin_unit: 'coins',
      reward_coin_rate: '1 coin = Rp 1',
      reward_watch_ad_title: '🎬 Watch Ads',
      reward_watch_ad_desc: 'Get 1-100 coins per ad (max 5/day)',
      reward_ad_counter: 'today',
      reward_ad_remaining: 'left',
      reward_ad_limit_reached: 'limit reached',
      reward_ad_btn: '🎬 Watch Ad (+1-100 coins)',
      reward_ad_cooldown: 'Wait',
      reward_missions_title: '🎯 Missions & Rewards',
      reward_level_title: '📈 Level Up Reward',
      reward_level_next: 'Level',
      reward_level_coin: 'coins',
      reward_level_desc: 'Higher = bigger reward',
      reward_referral_title: '🎁 Referral',
      reward_referral_desc: 'Invite friends, earn 500 coins per referral',
      reward_referral_copy: '📋 Copy',
      reward_history_title: '📜 Coin History',
      reward_history_empty: 'No transactions yet',
      reward_withdraw_title: '💸 Withdraw to Money',
      reward_withdraw_min: 'Minimum Rp 10.000',
      reward_withdraw_btn: '💸 Withdraw Now',
      reward_withdraw_locked: '🔒 Balance not enough',

      // Missions
      mission_login: 'Daily Login',
      mission_lesson: 'Complete Lesson',
      mission_perfect: 'Perfect Score',
      mission_topup: 'Top Up Once',
      mission_ad5: 'Watch 5 Ads',
      mission_streak3: 'Streak 3 Days',
      mission_streak7: 'Streak 7 Days',
      // Daily Spin
      spin_title: '🎰 Daily Spin',
      spin_desc: 'Spin once a day, get 1-10 hearts!',
      spin_btn: '🎰 SPIN NOW',
      spin_already: '✅ Already spun today',
      spin_next: 'Come back tomorrow!',
      spin_win: 'Got {n} hearts!',
      spin_spinning: '🎰 Spinning...',
      spin_result: 'CONGRATS!',
      ad_reward_coin: '+{n} coins!',
      ad_reward_jackpot: '🎉 JACKPOT! +{n} coins!',
      mission_coin_suffix: 'coins',

      // ===== TOP UP PAGE =====
      topup_select_game: 'Choose Game / Service',
      topup_account_data: 'Account Data',
      topup_select_nominal: 'Select Nominal',
      topup_confirm_order: 'Confirm Order',
      topup_game_label: 'Service',
      topup_item_label: 'Item',
      topup_total_label: 'Total',
      topup_choose_payment: 'Choose Payment',
      topup_btn_order: 'Order Now',
      topup_btn_back: 'Back',
      topup_payment_title: 'Payment',
      topup_order_label: 'Order',
      topup_total_pay: 'Total Payment',
      topup_pay_via: 'Pay via',
      topup_method_label: 'Method',
      topup_amount_label: 'Amount',
      topup_account_number: 'Account Number',
      topup_account_name: 'Account Name',
      topup_upload_proof: 'Upload Payment Proof',
      topup_notice: 'Transfer the exact amount to the account above. After transfer, upload the proof below.',
      topup_btn_paid: 'I Have Paid',
      topup_btn_later: 'Later',
      topup_success_title: 'Order Sent!',
      topup_success_desc: 'Admin will verify soon. Check status in Orders menu.',
      topup_btn_view_orders: 'View Orders',

      // ===== ORDERS PAGE =====
      orders_empty: 'No orders yet',
      orders_date_label: '📅 Date',
      orders_id_label: 'Order ID',
      orders_product_label: 'Product',
      orders_method_label: 'Payment',
      orders_total_label: 'Total',

      // ===== PROFILE PAGE =====
      profile_mode_anon: '👤 Anonymous Mode',
      profile_mode_google: '✅ Google Logged In',
      profile_level: 'Level',
      profile_btn_login: 'Login with Google',
      profile_btn_change_name: '🎲 Change Random Name',
      profile_btn_logout: '🚪 Logout',
      profile_btn_refill: 'Refill Hearts (20 💎)',
      profile_btn_reset: 'Reset Data',

      // Stats
      stat_xp: 'Total XP',
      stat_streak: 'Streak',
      stat_gems: 'Gems',
      stat_lessons: 'Lessons',
      stat_correct: 'Correct',
      stat_wrong: 'Wrong',

      // ===== LESSON =====
      lesson_question: 'Question',
      lesson_correct: 'Correct! 🎉',
      lesson_wrong: 'Wrong. Correct answer:',
      lesson_try_again: '❌ Not quite. Try again! 💪',
      lesson_result_perfect: 'Perfect!',
      lesson_result_done: 'Complete!',
      lesson_score: 'Score',
      lesson_btn_continue: 'Continue',

      // Toast
      toast_name_changed: 'New name:',
      toast_coin_earned: '+1 coin! 🪙',
      toast_ad_opening: 'Opening ad...',
      toast_ad_failed: '❌ Ad failed to load',
      toast_ad_not_ready: '⚠️ Ad not ready, try again',
      toast_withdraw_success: 'Withdraw requested! Check Telegram.',
      toast_hearts_full: 'Hearts full!',
      toast_gems_low: 'Not enough gems',

      // Language
      lang_select: 'Language',
      lang_id: '🇮🇩 Indonesia',
      lang_en: '🇬🇧 English',
    },
  },

  init() {
    try {
      const saved = localStorage.getItem('yadstore_lang');
      if (saved && this.SUPPORTED.includes(saved)) this.currentLang = saved;
    } catch (e) {}
    console.log('[i18n] Lang:', this.currentLang);
    this.applyAll();
  },

  t(key) {
    const lang = this.currentLang;
    if (this.TRANSLATIONS[lang] && this.TRANSLATIONS[lang][key] !== undefined) {
      return this.TRANSLATIONS[lang][key];
    }
    if (this.TRANSLATIONS.id[key] !== undefined) return this.TRANSLATIONS.id[key];
    return key;
  },

  setLang(lang) {
    if (!this.SUPPORTED.includes(lang)) return;
    this.currentLang = lang;
    try { localStorage.setItem('yadstore_lang', lang); } catch (e) {}
    console.log('[i18n] Switched to:', lang);
    this.applyAll();
    this.notifyApp();
  },

  getLang() { return this.currentLang; },

  applyAll() {
    // Update semua elemen dengan data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = this.t(key);
      if (text) el.textContent = text;
    });

    // Placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const text = this.t(key);
      if (text) el.placeholder = text;
    });

    // Update lang selector
    const sel = document.getElementById('lang-selector');
    if (sel) sel.value = this.currentLang;
  },

  notifyApp() {
    if (typeof App !== 'undefined' && App.onLangChanged) App.onLangChanged(this.currentLang);
  },
};

if (typeof window !== 'undefined') window.I18n = I18n;
console.log('[i18n] v2 loaded');
