/* ============================================
   YS STORE — GAMES DATA v2
   25+ games top up populer
   ============================================ */

const GAMES = [
  // ==========================================
  // MOBA
  // ==========================================
  {
    id: 'aov',
    name: 'Arena of Valor',
    short: 'AOV',
    icon: '🎮',
    color: '#7c3aed',
    category: 'moba',
    desc: 'Top up Voucher AOV',
    fields: [
      { id: 'user_id', label: 'Player ID', placeholder: '123456789' }
    ],
    products: [
      { id: 'aov_16', name: '16 Vouchers', price: 5000 },
      { id: 'aov_35', name: '35 Vouchers', price: 10000 },
      { id: 'aov_70', name: '70 Vouchers', price: 20000 },
      { id: 'aov_140', name: '140 Vouchers', price: 40000 },
      { id: 'aov_355', name: '355 Vouchers', price: 100000 },
      { id: 'aov_720', name: '720 Vouchers', price: 200000 },
      { id: 'aov_1500', name: '1500 Vouchers', price: 400000, bonus: '+Bonus' },
      { id: 'aov_4000', name: '4000 Vouchers', price: 1000000, bonus: '+Bonus' }
    ]
  },
  {
    id: 'hok',
    name: 'Honor of Kings',
    short: 'HOK',
    icon: '👑',
    color: '#f59e0b',
    category: 'moba',
    desc: 'Top up Tokens HOK',
    fields: [
      { id: 'user_id', label: 'Open ID', placeholder: '123456789' }
    ],
    products: [
      { id: 'hok_16', name: '16 Tokens', price: 5000 },
      { id: 'hok_80', name: '80 Tokens', price: 15000 },
      { id: 'hok_240', name: '240 Tokens', price: 45000 },
      { id: 'hok_400', name: '400 Tokens', price: 75000 },
      { id: 'hok_800', name: '800 Tokens', price: 148000 },
      { id: 'hok_1600', name: '1600 Tokens', price: 290000 },
      { id: 'hok_4000', name: '4000 Tokens', price: 720000 }
    ]
  },
  {
    id: 'mlbb',
    name: 'Mobile Legends',
    short: 'MLBB',
    icon: '⚔️',
    color: '#1cb0f6',
    category: 'moba',
    desc: 'Top up Diamond MLBB',
    fields: [
      { id: 'user_id', label: 'User ID', placeholder: '12345678' },
      { id: 'zone_id', label: 'Zone ID', placeholder: '1234' }
    ],
    products: [
      { id: 'ml_5', name: '5 Diamond', price: 1500 },
      { id: 'ml_12', name: '12 Diamond', price: 3500 },
      { id: 'ml_19', name: '19 Diamond', price: 5500 },
      { id: 'ml_28', name: '28 Diamond', price: 8000 },
      { id: 'ml_44', name: '44 Diamond', price: 12000 },
      { id: 'ml_86', name: '86 Diamond', price: 22000 },
      { id: 'ml_172', name: '172 Diamond', price: 43000 },
      { id: 'ml_257', name: '257 Diamond', price: 64000 },
      { id: 'ml_344', name: '344 Diamond', price: 85000 },
      { id: 'ml_514', name: '514 Diamond', price: 128000 },
      { id: 'ml_1050', name: '1050 Diamond', price: 256000, bonus: '+100' },
      { id: 'ml_2195', name: '2195 Diamond', price: 512000, bonus: '+200' }
    ]
  },
  {
    id: 'wildrift',
    name: 'Wild Rift',
    short: 'WR',
    icon: '🌀',
    color: '#0ea5e9',
    category: 'moba',
    desc: 'Top up Wild Core',
    fields: [
      { id: 'user_id', label: 'Riot ID', placeholder: 'Player#1234' }
    ],
    products: [
      { id: 'wr_125', name: '125 Wild Core', price: 15000 },
      { id: 'wr_420', name: '420 Wild Core', price: 48000 },
      { id: 'wr_700', name: '700 Wild Core', price: 78000 },
      { id: 'wr_1375', name: '1375 Wild Core', price: 152000 },
      { id: 'wr_2800', name: '2800 Wild Core', price: 300000 }
    ]
  },

  // ==========================================
  // BATTLE ROYALE
  // ==========================================
  {
    id: 'ff',
    name: 'Free Fire',
    short: 'FF',
    icon: '🔥',
    color: '#ff4081',
    category: 'battle-royale',
    desc: 'Top up Diamond FF',
    fields: [
      { id: 'user_id', label: 'User ID', placeholder: '123456789' }
    ],
    products: [
      { id: 'ff_5', name: '5 Diamond', price: 1500 },
      { id: 'ff_12', name: '12 Diamond', price: 3500 },
      { id: 'ff_50', name: '50 Diamond', price: 7500 },
      { id: 'ff_70', name: '70 Diamond', price: 10000 },
      { id: 'ff_140', name: '140 Diamond', price: 19000 },
      { id: 'ff_355', name: '355 Diamond', price: 48000 },
      { id: 'ff_720', name: '720 Diamond', price: 95000 },
      { id: 'ff_1440', name: '1440 Diamond', price: 190000 },
      { id: 'ff_2200', name: '2200 Diamond', price: 285000 }
    ]
  },
  {
    id: 'pubg',
    name: 'PUBG Mobile',
    short: 'PUBG',
    icon: '🎯',
    color: '#ff9800',
    category: 'battle-royale',
    desc: 'Top up UC PUBG',
    fields: [
      { id: 'user_id', label: 'Character ID', placeholder: '51234567' }
    ],
    products: [
      { id: 'pubg_60', name: '60 UC', price: 15000 },
      { id: 'pubg_325', name: '325 UC', price: 70000 },
      { id: 'pubg_660', name: '660 UC', price: 140000 },
      { id: 'pubg_1800', name: '1800 UC', price: 350000 },
      { id: 'pubg_3850', name: '3850 UC', price: 700000 },
      { id: 'pubg_8100', name: '8100 UC', price: 1400000 }
    ]
  },
  {
    id: 'codm',
    name: 'COD Mobile',
    short: 'CODM',
    icon: '💥',
    color: '#4caf50',
    category: 'battle-royale',
    desc: 'Top up CP COD',
    fields: [
      { id: 'user_id', label: 'Open ID', placeholder: '6512345678' }
    ],
    products: [
      { id: 'cod_80', name: '80 CP', price: 15000 },
      { id: 'cod_420', name: '420 CP', price: 70000 },
      { id: 'cod_880', name: '880 CP', price: 140000 },
      { id: 'cod_2400', name: '2400 CP', price: 350000 },
      { id: 'cod_5000', name: '5000 CP', price: 700000 }
    ]
  },

  // ==========================================
  // GACHA / RPG
  // ==========================================
  {
    id: 'genshin',
    name: 'Genshin Impact',
    short: 'GI',
    icon: '⚜️',
    color: '#7c4dff',
    category: 'gacha',
    desc: 'Top up Genesis Crystals',
    fields: [
      { id: 'user_id', label: 'UID', placeholder: '812345678' },
      { id: 'server', label: 'Server', placeholder: 'Asia / America / Europe' }
    ],
    products: [
      { id: 'gi_60', name: '60 Genesis', price: 16000 },
      { id: 'gi_300', name: '300+30 Genesis', price: 75000 },
      { id: 'gi_980', name: '980+110 Genesis', price: 240000 },
      { id: 'gi_1980', name: '1980+260 Genesis', price: 480000 },
      { id: 'gi_3280', name: '3280+600 Genesis', price: 800000 },
      { id: 'gi_6480', name: '6480+1600 Genesis', price: 1600000 }
    ]
  },
  {
    id: 'hsr',
    name: 'Honkai Star Rail',
    short: 'HSR',
    icon: '✨',
    color: '#a855f7',
    category: 'gacha',
    desc: 'Top up Oneiric Shard',
    fields: [
      { id: 'user_id', label: 'UID', placeholder: '812345678' },
      { id: 'server', label: 'Server', placeholder: 'Asia / America / Europe' }
    ],
    products: [
      { id: 'hsr_60', name: '60 Shards', price: 16000 },
      { id: 'hsr_300', name: '300+30 Shards', price: 75000 },
      { id: 'hsr_980', name: '980+110 Shards', price: 240000 },
      { id: 'hsr_1980', name: '1980+260 Shards', price: 480000 },
      { id: 'hsr_3280', name: '3280+600 Shards', price: 800000 }
    ]
  },
  {
    id: 'arknights',
    name: 'Arknights',
    short: 'AK',
    icon: '🛡️',
    color: '#06b6d4',
    category: 'gacha',
    desc: 'Top up Originium',
    fields: [
      { id: 'user_id', label: 'UID', placeholder: '12345678' }
    ],
    products: [
      { id: 'ak_5', name: '5 Originium', price: 15000 },
      { id: 'ak_20', name: '20 Originium', price: 55000 },
      { id: 'ak_40', name: '40 Originium', price: 105000 },
      { id: 'ak_80', name: '80 Originium', price: 200000 },
      { id: 'ak_180', name: '180 Originium', price: 420000 }
    ]
  },
  {
    id: 'bluearchive',
    name: 'Blue Archive',
    short: 'BA',
    icon: '🔷',
    color: '#3b82f6',
    category: 'gacha',
    desc: 'Top up Pyroxene',
    fields: [
      { id: 'user_id', label: 'UID', placeholder: '12345678' }
    ],
    products: [
      { id: 'ba_70', name: '70 Pyroxene', price: 15000 },
      { id: 'ba_350', name: '350 Pyroxene', price: 65000 },
      { id: 'ba_700', name: '700 Pyroxene', price: 120000 },
      { id: 'ba_1500', name: '1500 Pyroxene', price: 240000 },
      { id: 'ba_3000', name: '3000 Pyroxene', price: 470000 }
    ]
  },
  {
    id: 'nikke',
    name: 'Nikke',
    short: 'NIKKE',
    icon: '🎀',
    color: '#ec4899',
    category: 'gacha',
    desc: 'Top up Gems',
    fields: [
      { id: 'user_id', label: 'Player ID', placeholder: '12345678' }
    ],
    products: [
      { id: 'nikke_60', name: '60 Gems', price: 15000 },
      { id: 'nikke_300', name: '300 Gems', price: 65000 },
      { id: 'nikke_980', name: '980 Gems', price: 200000 },
      { id: 'nikke_1980', name: '1980 Gems', price: 400000 }
    ]
  },

  // ==========================================
  // SHOOTER
  // ==========================================
  {
    id: 'valorant',
    name: 'Valorant',
    short: 'VAL',
    icon: '🎯',
    color: '#ff4655',
    category: 'shooter',
    desc: 'Top up Valorant Points',
    fields: [
      { id: 'user_id', label: 'Riot ID', placeholder: 'Player#TAG' }
    ],
    products: [
      { id: 'val_125', name: '125 VP', price: 15000 },
      { id: 'val_420', name: '420 VP', price: 48000 },
      { id: 'val_700', name: '700 VP', price: 78000 },
      { id: 'val_1375', name: '1375 VP', price: 152000 },
      { id: 'val_2400', name: '2400 VP', price: 260000 },
      { id: 'val_4000', name: '4000 VP', price: 430000 }
    ]
  },
  {
    id: 'csgo',
    name: 'CS2 / CS:GO',
    short: 'CS2',
    icon: '🔫',
    color: '#fbbf24',
    category: 'shooter',
    desc: 'Top up Prime / Cases',
    fields: [
      { id: 'user_id', label: 'Steam ID', placeholder: '7656119...' }
    ],
    products: [
      { id: 'cs_prime', name: 'Prime Status', price: 220000 },
      { id: 'cs_5', name: '$5 Wallet', price: 85000 },
      { id: 'cs_10', name: '$10 Wallet', price: 165000 },
      { id: 'cs_20', name: '$20 Wallet', price: 330000 }
    ]
  },

  // ==========================================
  // POPULER LAIN
  // ==========================================
  {
    id: 'roblox',
    name: 'Roblox',
    short: 'RBX',
    icon: '🎲',
    color: '#e91e63',
    category: 'populer',
    desc: 'Top up Robux',
    fields: [
      { id: 'user_id', label: 'Username', placeholder: 'Player123' }
    ],
    products: [
      { id: 'rbx_80', name: '80 Robux', price: 15000 },
      { id: 'rbx_400', name: '400 Robux', price: 70000 },
      { id: 'rbx_800', name: '800 Robux', price: 138000 },
      { id: 'rbx_1700', name: '1700 Robux', price: 280000 },
      { id: 'rbx_4500', name: '4500 Robux', price: 720000 }
    ]
  },
  {
    id: 'minecraft',
    name: 'Minecraft',
    short: 'MC',
    icon: '⛏️',
    color: '#8b5cf6',
    category: 'populer',
    desc: 'Top up Minecraft Coins',
    fields: [
      { id: 'user_id', label: 'Username', placeholder: 'Player123' }
    ],
    products: [
      { id: 'mc_500', name: '500 Minecoins', price: 55000 },
      { id: 'mc_1000', name: '1000 Minecoins', price: 105000 },
      { id: 'mc_1720', name: '1720 Minecoins', price: 175000 },
      { id: 'mc_3500', name: '3500 Minecoins', price: 340000 }
    ]
  },
  {
    id: 'coc',
    name: 'Clash of Clans',
    short: 'COC',
    icon: '🏰',
    color: '#f59e0b',
    category: 'populer',
    desc: 'Top up Gems COC',
    fields: [
      { id: 'user_id', label: 'Player Tag', placeholder: '#ABC123XY' }
    ],
    products: [
      { id: 'coc_80', name: '80 Gems', price: 15000 },
      { id: 'coc_500', name: '500 Gems', price: 65000 },
      { id: 'coc_1200', name: '1200 Gems', price: 145000 },
      { id: 'coc_2500', name: '2500 Gems', price: 285000 },
      { id: 'coc_6500', name: '6500 Gems', price: 720000 }
    ]
  },
  {
    id: 'cr',
    name: 'Clash Royale',
    short: 'CR',
    icon: '👑',
    color: '#ef4444',
    category: 'populer',
    desc: 'Top up Gems CR',
    fields: [
      { id: 'user_id', label: 'Player Tag', placeholder: '#ABC123XY' }
    ],
    products: [
      { id: 'cr_80', name: '80 Gems', price: 15000 },
      { id: 'cr_500', name: '500 Gems', price: 65000 },
      { id: 'cr_1200', name: '1200 Gems', price: 145000 },
      { id: 'cr_2500', name: '2500 Gems', price: 285000 }
    ]
  },
  {
    id: 'brawlstars',
    name: 'Brawl Stars',
    short: 'BS',
    icon: '💎',
    color: '#8b5cf6',
    category: 'populer',
    desc: 'Top up Gems BS',
    fields: [
      { id: 'user_id', label: 'Player Tag', placeholder: '#ABC123XY' }
    ],
    products: [
      { id: 'bs_30', name: '30 Gems', price: 15000 },
      { id: 'bs_80', name: '80 Gems', price: 35000 },
      { id: 'bs_170', name: '170 Gems', price: 70000 },
      { id: 'bs_360', name: '360 Gems', price: 145000 },
      { id: 'bs_950', name: '950 Gems', price: 350000 }
    ]
  },

  // ==========================================
  // VOUCHER
  // ==========================================
  {
    id: 'steam',
    name: 'Steam Wallet',
    short: 'Steam',
    icon: '🎮',
    color: '#607d8b',
    category: 'voucher',
    desc: 'Voucher Steam',
    fields: [],
    products: [
      { id: 'stm_12k', name: 'IDR 12.000', price: 15000 },
      { id: 'stm_45k', name: 'IDR 45.000', price: 50000 },
      { id: 'stm_60k', name: 'IDR 60.000', price: 65000 },
      { id: 'stm_90k', name: 'IDR 90.000', price: 95000 },
      { id: 'stm_250k', name: 'IDR 250.000', price: 260000 },
      { id: 'stm_500k', name: 'IDR 500.000', price: 515000 }
    ]
  },
  {
    id: 'gplay',
    name: 'Google Play',
    short: 'GPlay',
    icon: '▶️',
    color: '#4caf50',
    category: 'voucher',
    desc: 'Voucher Google Play',
    fields: [],
    products: [
      { id: 'gp_20k', name: 'IDR 20.000', price: 22000 },
      { id: 'gp_50k', name: 'IDR 50.000', price: 53000 },
      { id: 'gp_100k', name: 'IDR 100.000', price: 103000 },
      { id: 'gp_300k', name: 'IDR 300.000', price: 305000 }
    ]
  },
  {
    id: 'itunes',
    name: 'iTunes',
    short: 'iTunes',
    icon: '🍎',
    color: '#007aff',
    category: 'voucher',
    desc: 'Voucher iTunes',
    fields: [],
    products: [
      { id: 'it_50k', name: 'IDR 50.000', price: 55000 },
      { id: 'it_100k', name: 'IDR 100.000', price: 108000 },
      { id: 'it_200k', name: 'IDR 200.000', price: 215000 }
    ]
  },
  {
    id: 'psn',
    name: 'PlayStation',
    short: 'PSN',
    icon: '🎮',
    color: '#003791',
    category: 'voucher',
    desc: 'Voucher PSN',
    fields: [],
    products: [
      { id: 'psn_50k', name: 'IDR 50.000', price: 55000 },
      { id: 'psn_100k', name: 'IDR 100.000', price: 108000 },
      { id: 'psn_200k', name: 'IDR 200.000', price: 215000 },
      { id: 'psn_500k', name: 'IDR 500.000', price: 520000 }
    ]
  }
];

// ============================================
// DATA PACKAGES (PULSA & KUOTA)
// ============================================
const DATA_PACKAGES = [
  {
    id: 'telkomsel',
    name: 'Telkomsel',
    short: 'TSEL',
    icon: '📱',
    color: '#e60000',
    category: 'pulsa',
    desc: 'Pulsa & Kuota Telkomsel',
    fields: [
      { id: 'phone', label: 'Nomor HP', placeholder: '08xxxxxxxxxx' }
    ],
    products: [
      { id: 'tsel_5k', name: 'Pulsa 5.000', price: 6500 },
      { id: 'tsel_10k', name: 'Pulsa 10.000', price: 11500 },
      { id: 'tsel_25k', name: 'Pulsa 25.000', price: 26500 },
      { id: 'tsel_50k', name: 'Pulsa 50.000', price: 51500 },
      { id: 'tsel_100k', name: 'Pulsa 100.000', price: 101500 },
      { id: 'tsel_1gb', name: 'Kuota 1 GB', price: 12000 },
      { id: 'tsel_3gb', name: 'Kuota 3 GB', price: 30000 },
      { id: 'tsel_5gb', name: 'Kuota 5 GB', price: 45000 },
      { id: 'tsel_10gb', name: 'Kuota 10 GB', price: 80000 },
      { id: 'tsel_25gb', name: 'Kuota 25 GB', price: 150000 }
    ]
  },
  {
    id: 'indosat',
    name: 'Indosat',
    short: 'ISAT',
    icon: '📱',
    color: '#ffcc00',
    category: 'pulsa',
    desc: 'Pulsa & Kuota Indosat',
    fields: [
      { id: 'phone', label: 'Nomor HP', placeholder: '08xxxxxxxxxx' }
    ],
    products: [
      { id: 'isat_5k', name: 'Pulsa 5.000', price: 6500 },
      { id: 'isat_10k', name: 'Pulsa 10.000', price: 11500 },
      { id: 'isat_25k', name: 'Pulsa 25.000', price: 26500 },
      { id: 'isat_50k', name: 'Pulsa 50.000', price: 51500 },
      { id: 'isat_5gb', name: 'Kuota 5 GB', price: 42000 },
      { id: 'isat_10gb', name: 'Kuota 10 GB', price: 75000 },
      { id: 'isat_25gb', name: 'Kuota 25 GB', price: 140000 }
    ]
  },
  {
    id: 'xl',
    name: 'XL Axiata',
    short: 'XL',
    icon: '📱',
    color: '#00a651',
    category: 'pulsa',
    desc: 'Pulsa & Kuota XL',
    fields: [
      { id: 'phone', label: 'Nomor HP', placeholder: '08xxxxxxxxxx' }
    ],
    products: [
      { id: 'xl_5k', name: 'Pulsa 5.000', price: 6500 },
      { id: 'xl_10k', name: 'Pulsa 10.000', price: 11500 },
      { id: 'xl_25k', name: 'Pulsa 25.000', price: 26500 },
      { id: 'xl_50k', name: 'Pulsa 50.000', price: 51500 },
      { id: 'xl_8gb', name: 'Kuota 8 GB', price: 65000 },
      { id: 'xl_15gb', name: 'Kuota 15 GB', price: 105000 }
    ]
  },
  {
    id: 'tri',
    name: 'Tri (3)',
    short: 'Tri',
    icon: '📱',
    color: '#a83297',
    category: 'pulsa',
    desc: 'Pulsa & Kuota Tri',
    fields: [
      { id: 'phone', label: 'Nomor HP', placeholder: '08xxxxxxxxxx' }
    ],
    products: [
      { id: 'tri_5k', name: 'Pulsa 5.000', price: 6500 },
      { id: 'tri_10k', name: 'Pulsa 10.000', price: 11500 },
      { id: 'tri_25k', name: 'Pulsa 25.000', price: 26500 },
      { id: 'tri_10gb', name: 'Kuota 10 GB', price: 70000 },
      { id: 'tri_20gb', name: 'Kuota 20 GB', price: 130000 }
    ]
  },
  {
    id: 'smartfren',
    name: 'Smartfren',
    short: 'SF',
    icon: '📱',
    color: '#e60012',
    category: 'pulsa',
    desc: 'Pulsa & Kuota Smartfren',
    fields: [
      { id: 'phone', label: 'Nomor HP', placeholder: '08xxxxxxxxxx' }
    ],
    products: [
      { id: 'sf_5k', name: 'Pulsa 5.000', price: 6500 },
      { id: 'sf_10k', name: 'Pulsa 10.000', price: 11500 },
      { id: 'sf_25k', name: 'Pulsa 25.000', price: 26500 },
      { id: 'sf_10gb', name: 'Kuota 10 GB', price: 65000 }
    ]
  },
  {
    id: 'axis',
    name: 'Axis',
    short: 'Axis',
    icon: '📱',
    color: '#702082',
    category: 'pulsa',
    desc: 'Pulsa & Kuota Axis',
    fields: [
      { id: 'phone', label: 'Nomor HP', placeholder: '08xxxxxxxxxx' }
    ],
    products: [
      { id: 'axis_5k', name: 'Pulsa 5.000', price: 6500 },
      { id: 'axis_10k', name: 'Pulsa 10.000', price: 11500 },
      { id: 'axis_25k', name: 'Pulsa 25.000', price: 26500 },
      { id: 'axis_10gb', name: 'Kuota 10 GB', price: 60000 }
    ]
  }
];

// ============================================
// PAYMENT METHODS
// ============================================
const PAYMENTS = [
  { id: 'seabank', name: 'SEABANK', fee: 0, account: '901825485120', holder: 'YS Store' },
  { id: 'gopay', name: 'GOPAY', fee: 0, account: '083170617054', holder: 'YS Store' },
  { id: 'dana', name: 'DANA', fee: 0, account: '083170617054', holder: 'YS Store' },
  { id: 'ovo', name: 'OVO', fee: 0, account: '083170617054', holder: 'YS Store' },
  { id: 'shopeepay', name: 'ShopeePay', fee: 0, account: '083170617054', holder: 'YS Store' },
  { id: 'qris', name: 'QRIS', fee: 0, account: 'Scan QR', holder: 'YS Store' }
];

if (typeof window !== 'undefined') {
  window.GAMES = GAMES;
  window.DATA_PACKAGES = DATA_PACKAGES;
  window.PAYMENTS = PAYMENTS;
}

console.log('[games-data] YS Store — ' + GAMES.length + ' games + ' + DATA_PACKAGES.length + ' packages');
