/* YADSTORE - DATA dengan icon CDN stable */

const GAMES = [
  { id: 'mlbb', name: 'Mobile Legends', icon: 'https://cdn-icons-png.flaticon.com/128/3307/3307685.png', color: '#1cb0f6', category: 'game', desc: 'Top up Diamond MLBB',
    fields: [{ id: 'user_id', label: 'User ID', placeholder: '12345678' }, { id: 'zone_id', label: 'Zone ID', placeholder: '1234' }],
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
      { id: 'ml_2195', name: '2195 Diamond', price: 512000, bonus: '+200' },
    ]},
  { id: 'ff', name: 'Free Fire', icon: 'https://cdn-icons-png.flaticon.com/128/10426/10426263.png', color: '#ff4081', category: 'game', desc: 'Top up Diamond FF',
    fields: [{ id: 'user_id', label: 'User ID', placeholder: '123456789' }],
    products: [
      { id: 'ff_5', name: '5 Diamond', price: 1500 },
      { id: 'ff_12', name: '12 Diamond', price: 3500 },
      { id: 'ff_70', name: '70 Diamond', price: 10000 },
      { id: 'ff_140', name: '140 Diamond', price: 19000 },
      { id: 'ff_355', name: '355 Diamond', price: 48000 },
      { id: 'ff_720', name: '720 Diamond', price: 95000 },
      { id: 'ff_1440', name: '1440 Diamond', price: 190000 },
    ]},
  { id: 'pubg', name: 'PUBG Mobile', icon: 'https://cdn-icons-png.flaticon.com/128/10347/10347882.png', color: '#ff9800', category: 'game', desc: 'Top up UC PUBG',
    fields: [{ id: 'user_id', label: 'User ID', placeholder: '51234567' }],
    products: [
      { id: 'pubg_60', name: '60 UC', price: 15000 },
      { id: 'pubg_325', name: '325 UC', price: 70000 },
      { id: 'pubg_660', name: '660 UC', price: 140000 },
      { id: 'pubg_1800', name: '1800 UC', price: 350000 },
    ]},
  { id: 'genshin', name: 'Genshin Impact', icon: 'https://cdn-icons-png.flaticon.com/128/10347/10347884.png', color: '#7c4dff', category: 'game', desc: 'Top up Genesis',
    fields: [{ id: 'user_id', label: 'UID', placeholder: '812345678' }, { id: 'server', label: 'Server', placeholder: 'Asia' }],
    products: [
      { id: 'gi_60', name: '60 Genesis', price: 16000 },
      { id: 'gi_300', name: '300+30 Genesis', price: 75000 },
      { id: 'gi_980', name: '980+110 Genesis', price: 240000 },
      { id: 'gi_1980', name: '1980+260 Genesis', price: 480000 },
    ]},
  { id: 'cod', name: 'COD Mobile', icon: 'https://cdn-icons-png.flaticon.com/128/2103/2103633.png', color: '#4caf50', category: 'game', desc: 'Top up CP COD',
    fields: [{ id: 'user_id', label: 'Open ID', placeholder: '6512345678' }],
    products: [
      { id: 'cod_80', name: '80 CP', price: 15000 },
      { id: 'cod_420', name: '420 CP', price: 70000 },
      { id: 'cod_880', name: '880 CP', price: 140000 },
      { id: 'cod_2400', name: '2400 CP', price: 350000 },
    ]},
  { id: 'valorant', name: 'Valorant', icon: 'https://cdn-icons-png.flaticon.com/128/3307/3307682.png', color: '#ff4655', category: 'game', desc: 'Top up VP',
    fields: [{ id: 'user_id', label: 'Riot ID', placeholder: 'Player#1234' }],
    products: [
      { id: 'val_125', name: '125 VP', price: 15000 },
      { id: 'val_420', name: '420 VP', price: 48000 },
      { id: 'val_700', name: '700 VP', price: 78000 },
      { id: 'val_1375', name: '1375 VP', price: 152000 },
    ]},
  { id: 'roblox', name: 'Roblox', icon: 'https://cdn-icons-png.flaticon.com/128/2103/2103631.png', color: '#e91e63', category: 'game', desc: 'Top up Robux',
    fields: [{ id: 'user_id', label: 'Username', placeholder: 'Player123' }],
    products: [
      { id: 'rbx_80', name: '80 Robux', price: 15000 },
      { id: 'rbx_400', name: '400 Robux', price: 70000 },
      { id: 'rbx_800', name: '800 Robux', price: 138000 },
      { id: 'rbx_1700', name: '1700 Robux', price: 280000 },
    ]},
  { id: 'hok', name: 'Honor of Kings', icon: 'https://cdn-icons-png.flaticon.com/128/2103/2103635.png', color: '#ffc107', category: 'game', desc: 'Top up Tokens',
    fields: [{ id: 'user_id', label: 'Open ID', placeholder: '12345678' }],
    products: [
      { id: 'hok_80', name: '80 Tokens', price: 15000 },
      { id: 'hok_240', name: '240 Tokens', price: 45000 },
      { id: 'hok_400', name: '400 Tokens', price: 75000 },
      { id: 'hok_800', name: '800 Tokens', price: 148000 },
    ]},
  { id: 'steam', name: 'Steam Wallet', icon: 'https://cdn.simpleicons.org/steam/1b2838', color: '#607d8b', category: 'voucher', desc: 'Voucher Steam',
    fields: [],
    products: [
      { id: 'stm_12k', name: 'IDR 12.000', price: 15000 },
      { id: 'stm_45k', name: 'IDR 45.000', price: 50000 },
      { id: 'stm_60k', name: 'IDR 60.000', price: 65000 },
      { id: 'stm_90k', name: 'IDR 90.000', price: 95000 },
    ]},
  { id: 'gplay', name: 'Google Play', icon: 'https://cdn.simpleicons.org/googleplay/4caf50', color: '#4caf50', category: 'voucher', desc: 'Voucher Google Play',
    fields: [],
    products: [
      { id: 'gp_20k', name: 'IDR 20.000', price: 22000 },
      { id: 'gp_50k', name: 'IDR 50.000', price: 53000 },
      { id: 'gp_100k', name: 'IDR 100.000', price: 103000 },
    ]},
];

const DATA_PACKAGES = [
  { id: 'telkomsel', name: 'Telkomsel', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Telkomsel_2021_icon.svg/240px-Telkomsel_2021_icon.svg.png', color: '#e60000', category: 'kuota', desc: 'Pulsa & Kuota',
    fields: [{ id: 'phone', label: 'Nomor HP', placeholder: '081234567890' }],
    products: [
      { id: 'tsel_5k', name: 'Pulsa 5.000', price: 6500 },
      { id: 'tsel_10k', name: 'Pulsa 10.000', price: 11500 },
      { id: 'tsel_25k', name: 'Pulsa 25.000', price: 26500 },
      { id: 'tsel_50k', name: 'Pulsa 50.000', price: 51500 },
      { id: 'tsel_1gb', name: 'Kuota 1 GB', price: 12000 },
      { id: 'tsel_5gb', name: 'Kuota 5 GB', price: 45000 },
      { id: 'tsel_10gb', name: 'Kuota 10 GB', price: 80000 },
    ]},
  { id: 'indosat', name: 'Indosat', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Indosat_Ooredoo_Hutchison_logo.svg/240px-Indosat_Ooredoo_Hutchison_logo.svg.png', color: '#ffcc00', category: 'kuota', desc: 'Pulsa & Kuota',
    fields: [{ id: 'phone', label: 'Nomor HP', placeholder: '085712345678' }],
    products: [
      { id: 'isat_5k', name: 'Pulsa 5.000', price: 6500 },
      { id: 'isat_10k', name: 'Pulsa 10.000', price: 11500 },
      { id: 'isat_25k', name: 'Pulsa 25.000', price: 26500 },
      { id: 'isat_5gb', name: 'Kuota 5 GB', price: 42000 },
      { id: 'isat_10gb', name: 'Kuota 10 GB', price: 75000 },
    ]},
  { id: 'xl', name: 'XL Axiata', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/XL_Axiata_logo.svg/240px-XL_Axiata_logo.svg.png', color: '#00a651', category: 'kuota', desc: 'Pulsa & Kuota',
    fields: [{ id: 'phone', label: 'Nomor HP', placeholder: '081712345678' }],
    products: [
      { id: 'xl_5k', name: 'Pulsa 5.000', price: 6500 },
      { id: 'xl_10k', name: 'Pulsa 10.000', price: 11500 },
      { id: 'xl_25k', name: 'Pulsa 25.000', price: 26500 },
      { id: 'xl_8gb', name: 'Kuota 8 GB', price: 65000 },
    ]},
  { id: 'tri', name: 'Tri (3)', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Tri_Indonesia_logo.svg/240px-Tri_Indonesia_logo.svg.png', color: '#a83297', category: 'kuota', desc: 'Pulsa & Kuota',
    fields: [{ id: 'phone', label: 'Nomor HP', placeholder: '089612345678' }],
    products: [
      { id: 'tri_5k', name: 'Pulsa 5.000', price: 6500 },
      { id: 'tri_10k', name: 'Pulsa 10.000', price: 11500 },
      { id: 'tri_25k', name: 'Pulsa 25.000', price: 26500 },
      { id: 'tri_10gb', name: 'Kuota 10 GB', price: 70000 },
    ]},
  { id: 'smartfren', name: 'Smartfren', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Smartfren_logo.svg/240px-Smartfren_logo.svg.png', color: '#e60012', category: 'kuota', desc: 'Pulsa & Kuota',
    fields: [{ id: 'phone', label: 'Nomor HP', placeholder: '088712345678' }],
    products: [
      { id: 'sf_5k', name: 'Pulsa 5.000', price: 6500 },
      { id: 'sf_10k', name: 'Pulsa 10.000', price: 11500 },
      { id: 'sf_25k', name: 'Pulsa 25.000', price: 26500 },
    ]},
  { id: 'axis', name: 'Axis', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Axis_Telekomunikasi_Indonesia_logo.svg/240px-Axis_Telekomunikasi_Indonesia_logo.svg.png', color: '#702082', category: 'kuota', desc: 'Pulsa & Kuota',
    fields: [{ id: 'phone', label: 'Nomor HP', placeholder: '083812345678' }],
    products: [
      { id: 'axis_5k', name: 'Pulsa 5.000', price: 6500 },
      { id: 'axis_10k', name: 'Pulsa 10.000', price: 11500 },
      { id: 'axis_25k', name: 'Pulsa 25.000', price: 26500 },
    ]},
];

const PAYMENTS = [
  { id: 'qris', name: 'QRIS', fee: 0 },
  { id: 'dana', name: 'DANA', fee: 0 },
  { id: 'gopay', name: 'GoPay', fee: 0 },
  { id: 'ovo', name: 'OVO', fee: 0 },
  { id: 'shopeepay', name: 'ShopeePay', fee: 0 },
  { id: 'bca', name: 'BCA', fee: 2500 },
  { id: 'bni', name: 'BNI', fee: 2500 },
  { id: 'bri', name: 'BRI', fee: 2500 },
  { id: 'mandiri', name: 'Mandiri', fee: 2500 },
];

if (typeof window !== 'undefined') {
  window.GAMES = GAMES;
  window.DATA_PACKAGES = DATA_PACKAGES;
  window.PAYMENTS = PAYMENTS;
}
console.log('[games-data] loaded');
