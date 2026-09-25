/* ============================================
   YADSTORE — GAMES DATA (Top Up)
   ============================================ */

const GAMES = [
  {
    id: 'mlbb', name: 'Mobile Legends', icon: '⚔️', color: '#1cb0f6',
    desc: 'Top up Diamond MLBB murah & cepat',
    products: [
      { id: 'ml_86', name: '86 Diamond', price: 20000, bonus: '' },
      { id: 'ml_172', name: '172 Diamond', price: 40000, bonus: '' },
      { id: 'ml_257', name: '257 Diamond', price: 60000, bonus: '' },
      { id: 'ml_344', name: '344 Diamond', price: 80000, bonus: '' },
      { id: 'ml_514', name: '514 Diamond', price: 120000, bonus: '' },
      { id: 'ml_706', name: '706 Diamond', price: 160000, bonus: '+50 Bonus' },
      { id: 'ml_1050', name: '1050 Diamond', price: 240000, bonus: '+100' },
      { id: 'ml_2195', name: '2195 Diamond', price: 480000, bonus: '+200' },
      { id: 'ml_weekly', name: 'Weekly Diamond Pass', price: 28000, bonus: 'Harian 7 hari' },
      { id: 'ml_starlight', name: 'Starlight Card', price: 45000, bonus: 'Skin bulanan' },
    ]
  },
  {
    id: 'ff', name: 'Free Fire', icon: '🔥', color: '#ff4081',
    desc: 'Top up Diamond FF termurah',
    products: [
      { id: 'ff_70', name: '70 Diamond', price: 15000, bonus: '' },
      { id: 'ff_140', name: '140 Diamond', price: 30000, bonus: '' },
      { id: 'ff_355', name: '355 Diamond', price: 70000, bonus: '' },
      { id: 'ff_720', name: '720 Diamond', price: 140000, bonus: '+50' },
      { id: 'ff_1440', name: '1440 Diamond', price: 270000, bonus: '+100' },
      { id: 'ff_weekly', name: 'Weekly Membership', price: 28000, bonus: 'Diamond harian' },
      { id: 'ff_elite', name: 'Elite Pass', price: 55000, bonus: 'Reward eksklusif' },
      { id: 'ff_monthly', name: 'Monthly Membership', price: 90000, bonus: 'Bonus besar' },
    ]
  },
  {
    id: 'pubg', name: 'PUBG Mobile', icon: '🎯', color: '#ff9800',
    desc: 'Top up UC PUBG Mobile',
    products: [
      { id: 'pubg_60', name: '60 UC', price: 15000, bonus: '' },
      { id: 'pubg_325', name: '325 UC', price: 70000, bonus: '' },
      { id: 'pubg_660', name: '660 UC', price: 140000, bonus: '+30' },
      { id: 'pubg_1800', name: '1800 UC', price: 350000, bonus: '+100' },
      { id: 'pubg_royal', name: 'Royal Pass', price: 65000, bonus: 'Season aktif' },
    ]
  },
  {
    id: 'genshin', name: 'Genshin Impact', icon: '🌸', color: '#7c4dff',
    desc: 'Top up Genesis Crystal',
    products: [
      { id: 'gi_60', name: '60 Genesis', price: 15000, bonus: '' },
      { id: 'gi_300', name: '300 + 30 Genesis', price: 75000, bonus: '+30' },
      { id: 'gi_980', name: '980 + 110 Genesis', price: 240000, bonus: '+110' },
      { id: 'gi_1980', name: '1980 + 260 Genesis', price: 480000, bonus: '+260' },
      { id: 'gi_bp', name: 'Battle Pass', price: 90000, bonus: 'Reward eksklusif' },
      { id: 'gi_welkin', name: 'Blessing of Welkin Moon', price: 75000, bonus: '30 hari' },
    ]
  },
  {
    id: 'cod', name: 'Call of Duty Mobile', icon: '🎖️', color: '#4caf50',
    desc: 'Top up CP COD Mobile',
    products: [
      { id: 'cod_80', name: '80 CP', price: 15000, bonus: '' },
      { id: 'cod_420', name: '420 CP', price: 70000, bonus: '' },
      { id: 'cod_880', name: '880 CP', price: 140000, bonus: '+40' },
      { id: 'cod_2400', name: '2400 CP', price: 350000, bonus: '+100' },
      { id: 'cod_bp', name: 'Battle Pass', price: 65000, bonus: 'Season aktif' },
    ]
  },
  {
    id: 'valorant', name: 'Valorant', icon: '🔫', color: '#ff4655',
    desc: 'Top up Valorant Points',
    products: [
      { id: 'val_125', name: '125 VP', price: 15000, bonus: '' },
      { id: 'val_420', name: '420 VP', price: 50000, bonus: '' },
      { id: 'val_700', name: '700 VP', price: 80000, bonus: '' },
      { id: 'val_1375', name: '1375 VP', price: 150000, bonus: '+75' },
      { id: 'val_2400', name: '2400 VP', price: 260000, bonus: '+150' },
      { id: 'val_bp', name: 'Battle Pass', price: 95000, bonus: 'Season aktif' },
    ]
  },
  {
    id: 'hok', name: 'Honor of Kings', icon: '👑', color: '#ffc107',
    desc: 'Top up Tokens Honor of Kings',
    products: [
      { id: 'hok_80', name: '80 Tokens', price: 15000, bonus: '' },
      { id: 'hok_240', name: '240 Tokens', price: 45000, bonus: '' },
      { id: 'hok_400', name: '400 Tokens', price: 75000, bonus: '' },
      { id: 'hok_800', name: '800 Tokens', price: 150000, bonus: '+50' },
      { id: 'hok_1600', name: '1600 Tokens', price: 300000, bonus: '+120' },
    ]
  },
  {
    id: 'roblox', name: 'Roblox', icon: '🧱', color: '#e91e63',
    desc: 'Top up Robux',
    products: [
      { id: 'rbx_80', name: '80 Robux', price: 15000, bonus: '' },
      { id: 'rbx_400', name: '400 Robux', price: 70000, bonus: '' },
      { id: 'rbx_800', name: '800 Robux', price: 140000, bonus: '' },
      { id: 'rbx_1700', name: '1700 Robux', price: 280000, bonus: '+100' },
      { id: 'rbx_4500', name: '4500 Robux', price: 700000, bonus: '+250' },
    ]
  },
  {
    id: 'steam', name: 'Steam Wallet', icon: '🎮', color: '#607d8b',
    desc: 'Top up Steam Wallet',
    products: [
      { id: 'stm_12k', name: 'IDR 12.000', price: 15000, bonus: '' },
      { id: 'stm_45k', name: 'IDR 45.000', price: 50000, bonus: '' },
      { id: 'stm_60k', name: 'IDR 60.000', price: 65000, bonus: '' },
      { id: 'stm_90k', name: 'IDR 90.000', price: 95000, bonus: '' },
      { id: 'stm_120k', name: 'IDR 120.000', price: 125000, bonus: '' },
      { id: 'stm_250k', name: 'IDR 250.000', price: 255000, bonus: '' },
    ]
  },
  {
    id: 'gplay', name: 'Google Play', icon: '▶️', color: '#4caf50',
    desc: 'Top up Google Play Gift Card',
    products: [
      { id: 'gp_20k', name: 'IDR 20.000', price: 22000, bonus: '' },
      { id: 'gp_50k', name: 'IDR 50.000', price: 53000, bonus: '' },
      { id: 'gp_100k', name: 'IDR 100.000', price: 103000, bonus: '' },
      { id: 'gp_150k', name: 'IDR 150.000', price: 154000, bonus: '' },
      { id: 'gp_300k', name: 'IDR 300.000', price: 307000, bonus: '' },
    ]
  },
];

if (typeof window !== 'undefined') window.GAMES = GAMES;
