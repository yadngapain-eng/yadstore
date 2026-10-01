
/* ============================================
   LESSONS DATA — BAHASA JAWA
   Dengan Ngoko, Krama Madya, Krama Inggil
   ============================================ */

const JAWA_LESSONS = [
  // ==========================================
  // LEVEL 1: SAPAAN (GREETINGS)
  // ==========================================
  {
    id: 'jw1',
    icon: '🙏',
    title: 'Sapaan / Salam',
    title_en: 'Javanese Greetings',
    desc: 'Sinau salam lan sapaan basa Jawa',
    desc_en: 'Learn Javanese greetings',
    level: 'Pemula',
    level_en: 'Beginner',
    xp: 15,
    type: 'chat',
    questions: [
      {
        q: 'Sugeng enjing, pripun kabare?',
        q_en: 'Good morning, how are you?',
        o: [
          'Sugeng enjing, sae kula',
          'Sugeng dalu, sae',
          'Matur nuwun',
          'Sugeng tindak'
        ],
        a: 0,
        // Voice recognition
        voice_text: 'Sugeng enjing, sae kula',
        correct_pronunciation: 'su-geng en-jing, sa-e ku-la',
        explanation: '"Sugeng enjing" = selamat pagi. "Sae kula" = saya baik.',
        explanation_en: '"Sugeng enjing" = good morning. "Sae kula" = I am fine.'
      },
      {
        q: 'Sugeng sonten, nembe rawuh?',
        q_en: 'Good evening, just arrived?',
        o: [
          'Inggih, nembe rawuh',
          'Sugeng enjing',
          'Matur nuwun sanget',
          'Sampun dangu'
        ],
        a: 0,
        voice_text: 'Inggih, nembe rawuh',
        correct_pronunciation: 'ing-gih, nem-be ra-wuh',
        explanation: '"Sugeng sonten" = selamat sore. "Nembe rawuh" = baru datang.',
        explanation_en: '"Sugeng sonten" = good evening. "Nembe rawuh" = just arrived.'
      },
      {
        q: 'Matur nuwun sanget, Pak.',
        q_en: 'Thank you very much, Sir.',
        o: [
          'Sami-sami, Nak',
          'Sugeng enjing',
          'Pripun kabare',
          'Sugeng tindak'
        ],
        a: 0,
        voice_text: 'Sami-sami, Nak',
        correct_pronunciation: 'sa-mi sa-mi, nak',
        explanation: '"Matur nuwun" = terima kasih. "Sami-sami" = sama-sama.',
        explanation_en: '"Matur nuwun" = thank you. "Sami-sami" = you are welcome.'
      },
      {
        q: 'Nyuwun pangapunten, kula badhe takon.',
        q_en: 'Excuse me, I want to ask.',
        o: [
          'Inggih, mangga',
          'Sugeng dalu',
          'Matur nuwun',
          'Sampun'
        ],
        a: 0,
        voice_text: 'Inggih, mangga',
        correct_pronunciation: 'ing-gih, mang-ga',
        explanation: '"Nyuwun pangapunten" = minta maaf/permisi. "Mangga" = silakan.',
        explanation_en: '"Nyuwun pangapunten" = excuse me. "Mangga" = please/go ahead.'
      },
      {
        q: 'Sugeng dalu, sare ingkang sae.',
        q_en: 'Good night, sleep well.',
        o: [
          'Matur nuwun, sami-sami',
          'Sugeng enjing',
          'Pripun kabare',
          'Mangga'
        ],
        a: 0,
        voice_text: 'Matur nuwun, sami-sami',
        correct_pronunciation: 'ma-tur nu-wun, sa-mi sa-mi',
        explanation: '"Sugeng dalu" = selamat malam. Balasan: "Matur nuwun".',
        explanation_en: '"Sugeng dalu" = good night. Response: "Matur nuwun".'
      }
    ]
  },

  // ==========================================
  // LEVEL 2: ANGKA (NUMBERS)
  // ==========================================
  {
    id: 'jw2',
    icon: '🔢',
    title: 'Angka / Wilangan',
    title_en: 'Numbers',
    desc: 'Sinau angka basa Jawa',
    desc_en: 'Learn Javanese numbers',
    level: 'Pemula',
    level_en: 'Beginner',
    xp: 15,
    type: 'chat',
    questions: [
      {
        q: 'Bahasa Jawa dari "satu" yaiku?',
        q_en: 'Javanese for "one" is?',
        o: ['Siji', 'Loro', 'Telu', 'Papat'],
        a: 0,
        voice_text: 'Siji',
        correct_pronunciation: 'si-ji',
        explanation: 'Siji = satu. Loro = dua. Telu = tiga. Papat = empat.',
        explanation_en: 'Siji = one. Loro = two. Telu = three. Papat = four.'
      },
      {
        q: 'Bahasa Jawa dari "lima" yaiku?',
        q_en: 'Javanese for "five" is?',
        o: ['Lima', 'Limo', 'Limo', 'Gangsal'],
        a: 3,
        voice_text: 'Gangsal',
        correct_pronunciation: 'gang-sal',
        explanation: 'Gangsal = lima (krama). Lima = lima (ngoko).',
        explanation_en: 'Gangsal = five (krama). Lima = five (ngoko).'
      },
      {
        q: 'Bahasa Jawa dari "sepuluh" yaiku?',
        q_en: 'Javanese for "ten" is?',
        o: ['Sepuluh', 'Sedasa', 'Sewelas', 'Rolas'],
        a: 1,
        voice_text: 'Sedasa',
        correct_pronunciation: 'se-da-sa',
        explanation: 'Sedasa = sepuluh (krama). Sepuluh = sepuluh (ngoko).',
        explanation_en: 'Sedasa = ten (krama). Sepuluh = ten (ngoko).'
      },
      {
        q: 'Bahasa Jawa dari "dua puluh lima" yaiku?',
        q_en: 'Javanese for "twenty five" is?',
        o: ['Selawe', 'Rolas', 'Telung puluh', 'Seket'],
        a: 0,
        voice_text: 'Selawe',
        correct_pronunciation: 'se-la-we',
        explanation: 'Selawe = 25 (spesial, bukan "loro puluh lima").',
        explanation_en: 'Selawe = 25 (special word).'
      },
      {
        q: 'Bahasa Jawa dari "seratus" yaiku?',
        q_en: 'Javanese for "one hundred" is?',
        o: ['Satus', 'Sewu', 'Satak', 'Sayuta'],
        a: 0,
        voice_text: 'Satus',
        correct_pronunciation: 'sa-tus',
        explanation: 'Satus = seratus. Sewu = seribu. Sayuta = sejuta.',
        explanation_en: 'Satus = 100. Sewu = 1,000. Sayuta = 1,000,000.'
      }
    ]
  },

  // ==========================================
  // LEVEL 3: ANGGOTA KELUARGA (FAMILY)
  // ==========================================
  {
    id: 'jw3',
    icon: '👨‍👩‍👧',
    title: 'Kulawarga',
    title_en: 'Family',
    desc: 'Sinau anggota kulawarga basa Jawa',
    desc_en: 'Learn Javanese family members',
    level: 'Pemula',
    level_en: 'Beginner',
    xp: 20,
    type: 'chat',
    questions: [
      {
        q: 'Bapak kula nembe tindak kantor. "Bapak" tegesipun?',
        q_en: 'My father just went to office. "Bapak" means?',
        o: ['Ibu', 'Bapak', 'Simbah', 'Kakang'],
        a: 1,
        voice_text: 'Bapak',
        correct_pronunciation: 'ba-pak',
        explanation: 'Bapak = ayah. Ibu = ibu. Simbah = kakek/nenek.',
        explanation_en: 'Bapak = father. Ibu = mother. Simbah = grandparent.'
      },
      {
        q: 'Ibu saweg masak ing pawon. "Pawon" tegesipun?',
        q_en: 'Mother is cooking in the kitchen. "Pawon" means?',
        o: ['Kamar', 'Dapur', 'Ruang tamu', 'Kamar mandi'],
        a: 1,
        voice_text: 'Pawon',
        correct_pronunciation: 'pa-won',
        explanation: 'Pawon = dapur. Kamar = kamar. Kamar mandi = jedhing.',
        explanation_en: 'Pawon = kitchen. Kamar = bedroom. Jedhing = bathroom.'
      },
      {
        q: 'Simbah sampun sepuh. "Simbah" tegesipun?',
        q_en: 'Grandparent is already old. "Simbah" means?',
        o: ['Kakak', 'Adik', 'Kakek/Nenek', 'Paman'],
        a: 2,
        voice_text: 'Simbah',
        correct_pronunciation: 'sim-bah',
        explanation: 'Simbah = kakek/nenek. Kakang = kakak laki-laki. Adhi = adik.',
        explanation_en: 'Simbah = grandparent. Kakang = older brother. Adhi = younger sibling.'
      },
      {
        q: 'Kakang kula sampun kuliah. "Kakang" tegesipun?',
        q_en: 'My older brother is already in college. "Kakang" means?',
        o: ['Adik', 'Kakak laki-laki', 'Kakak perempuan', 'Sepupu'],
        a: 1,
        voice_text: 'Kakang',
        correct_pronunciation: 'ka-kang',
        explanation: 'Kakang = kakak laki-laki. Mbak yu = kakak perempuan.',
        explanation_en: 'Kakang = older brother. Mbak yu = older sister.'
      },
      {
        q: 'Adhi kula nembe sinau. "Adhi" tegesipun?',
        q_en: 'My younger sibling is studying. "Adhi" means?',
        o: ['Kakak', 'Adik', 'Sepupu', 'Keponakan'],
        a: 1,
        voice_text: 'Adhi',
        correct_pronunciation: 'a-dhi',
        explanation: 'Adhi = adik. Kakang = kakak laki-laki. Mbak yu = kakak perempuan.',
        explanation_en: 'Adhi = younger sibling. Kakang = older brother. Mbak yu = older sister.'
      }
    ]
  },

  // ==========================================
  // LEVEL 4: KEGIATAN SEHARI-HARI (DAILY ACTIVITIES)
  // ==========================================
  {
    id: 'jw4',
    icon: '🍚',
    title: 'Kegiatan Saben Dinten',
    title_en: 'Daily Activities',
    desc: 'Sinau kegiatan saben dinten',
    desc_en: 'Learn daily activities in Javanese',
    level: 'Menengah',
    level_en: 'Intermediate',
    xp: 25,
    type: 'chat',
    questions: [
      {
        q: 'Aku arep mangan. "Mangan" tegesipun?',
        q_en: 'I want to eat. "Mangan" means?',
        o: ['Minum', 'Makan', 'Tidur', 'Mandi'],
        a: 1,
        voice_text: 'Mangan',
        correct_pronunciation: 'ma-ngan',
        explanation: 'Mangan = makan (ngoko). Dhahar = makan (krama).',
        explanation_en: 'Mangan = eat (ngoko). Dhahar = eat (krama).'
      },
      {
        q: 'Simbah badhe dhahar. "Dhahar" tegesipun?',
        q_en: 'Grandparent wants to eat. "Dhahar" means?',
        o: ['Makan (krama)', 'Minum (krama)', 'Tidur (krama)', 'Mandi (krama)'],
        a: 0,
        voice_text: 'Dhahar',
        correct_pronunciation: 'dha-har',
        explanation: 'Dhahar = makan (krama inggil). Untuk orang yang dihormati.',
        explanation_en: 'Dhahar = eat (krama inggil). For respected people.'
      },
      {
        q: 'Aku turu jam sanga. "Turu" tegesipun?',
        q_en: 'I sleep at 9. "Turu" means?',
        o: ['Bangun', 'Tidur', 'Makan', 'Mandi'],
        a: 1,
        voice_text: 'Turu',
        correct_pronunciation: 'tu-ru',
        explanation: 'Turu = tidur (ngoko). Sare = tidur (krama).',
        explanation_en: 'Turu = sleep (ngoko). Sare = sleep (krama).'
      },
      {
        q: 'Aku adus esuk. "Adus" tegesipun?',
        q_en: 'I bathe in the morning. "Adus" means?',
        o: ['Makan', 'Tidur', 'Mandi', 'Sikat gigi'],
        a: 2,
        voice_text: 'Adus',
        correct_pronunciation: 'a-dus',
        explanation: 'Adus = mandi (ngoko). Siram = mandi (krama).',
        explanation_en: 'Adus = bathe (ngoko). Siram = bathe (krama).'
      },
      {
        q: 'Aku lungo menyang pasar. "Lungo" tegesipun?',
        q_en: 'I go to the market. "Lungo" means?',
        o: ['Pulang', 'Pergi', 'Datang', 'Tinggal'],
        a: 1,
        voice_text: 'Lungo',
        correct_pronunciation: 'lu-ngo',
        explanation: 'Lungo = pergi (ngoko). Tindak = pergi (krama).',
        explanation_en: 'Lungo = go (ngoko). Tindak = go (krama).'
      }
    ]
  },

  // ==========================================
  // LEVEL 5: PERCAKAPAN (CONVERSATION)
  // ==========================================
  {
    id: 'jw5',
    icon: '💬',
    title: 'Pacelathon',
    title_en: 'Conversation',
    desc: 'Sinau pacelathon saben dinten',
    desc_en: 'Learn daily conversation',
    level: 'Menengah',
    level_en: 'Intermediate',
    xp: 30,
    type: 'chat',
    questions: [
      {
        q: 'Pinten reginipun? (Berapa harganya?)',
        q_en: 'How much is the price?',
        o: [
          'Reginipun sedasa ewu',
          'Matur nuwun',
          'Sugeng enjing',
          'Pripun kabare'
        ],
        a: 0,
        voice_text: 'Reginipun sedasa ewu',
        correct_pronunciation: 're-gi-ni-pun se-da-sa e-wu',
        explanation: 'Reginipun = harganya. Sedasa ewu = sepuluh ribu.',
        explanation_en: 'Reginipun = the price. Sedasa ewu = ten thousand.'
      },
      {
        q: 'Nyuwun sewu, dalan menyang pasar pundi?',
        q_en: 'Excuse me, where is the road to market?',
        o: [
          'Mangga lurus mawon',
          'Matur nuwun',
          'Sugeng dalu',
          'Sami-sami'
        ],
        a: 0,
        voice_text: 'Mangga lurus mawon',
        correct_pronunciation: 'mang-ga lu-rus ma-won',
        explanation: 'Mangga = silakan. Lurus mawon = lurus saja.',
        explanation_en: 'Mangga = please. Lurus mawon = just straight.'
      },
      {
        q: 'Kula badhe tumbas sega pecel.',
        q_en: 'I want to buy rice with pecel.',
        o: [
          'Inggih, pinten?',
          'Sugeng enjing',
          'Matur nuwun',
          'Sami-sami'
        ],
        a: 0,
        voice_text: 'Inggih, pinten?',
        correct_pronunciation: 'ing-gih, pin-ten',
        explanation: 'Pinten = berapa. Untuk tanya jumlah.',
        explanation_en: 'Pinten = how much. To ask quantity.'
      },
      {
        q: 'Matur nuwun, Pak. Kula badhe wangsul.',
        q_en: 'Thank you, Sir. I want to go home.',
        o: [
          'Inggih, ati-ati',
          'Mangga kersa',
          'Sugeng enjing',
          'Sami-sami'
        ],
        a: 0,
        voice_text: 'Inggih, ati-ati',
        correct_pronunciation: 'ing-gih, a-ti a-ti',
        explanation: 'Ati-ati = hati-hati. Untuk mendoakan yang pulang.',
        explanation_en: 'Ati-ati = be careful. To wish someone safe.'
      },
      {
        q: 'Sugeng riyadi, nyuwun pangapunten lair lan batin.',
        q_en: 'Happy Eid, forgive me physically and spiritually.',
        o: [
          'Sugeng riyadi, sami-sami',
          'Matur nuwun',
          'Sugeng enjing',
          'Sami-sami'
        ],
        a: 0,
        voice_text: 'Sugeng riyadi, sami-sami',
        correct_pronunciation: 'su-geng ri-ya-di, sa-mi sa-mi',
        explanation: 'Sugeng riyadi = selamat hari raya. Sami-sami = sama-sama.',
        explanation_en: 'Sugeng riyadi = happy Eid. Sami-sami = you too.'
      }
    ]
  }
];

// ============================================
// KATEGORI BARU: JAWA
// ============================================
if (typeof LESSON_CATEGORIES !== 'undefined') {
  LESSON_CATEGORIES.jawa = {
    label: 'Bahasa Jawa',
    label_en: 'Javanese',
    icon: '🎭',
    color: '#a855f7',
    description: 'Sinau basa Jawa saka ngoko nganti krama',
    hasVoice: true,
  };
}

// ============================================
// EXPORT
// ============================================
if (typeof window !== 'undefined') {
  window.JAWA_LESSONS = JAWA_LESSONS;

  function patchGetLessons() {
    if (typeof window.getLessonsByLang !== 'function') {
      setTimeout(patchGetLessons, 100);
      return;
    }
    if (window.getLessonsByLang.__jawaPatched) return;

    var orig = window.getLessonsByLang;
    window.getLessonsByLang = function(cat, lang) {
      if (cat === 'jawa') {
        if (lang === 'en') {
          return JAWA_LESSONS.map(function(l) {
            return Object.assign({}, l, {
              title: l.title_en || l.title,
              desc: l.desc_en || l.desc,
              level: l.level_en || l.level,
              questions: l.questions.map(function(q) {
                return Object.assign({}, q, {
                  q: q.q_en || q.q,
                  explanation: q.explanation_en || q.explanation,
                });
              }),
            });
          });
        }
        return JAWA_LESSONS;
      }
      return orig(cat, lang);
    };
    window.getLessonsByLang.__jawaPatched = true;
    console.log('[jawa-data] getLessonsByLang patched');
  }

  patchGetLessons();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(patchGetLessons, 50);
    });
  } else {
    setTimeout(patchGetLessons, 50);
  }
}

console.log('[jawa-data] Loaded ' + JAWA_LESSONS.length + ' Javanese lessons');
