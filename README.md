# YadStore v2

Platform modern untuk belajar coding, game store, dan article.

## Fitur

- Animasi stickman di header (5 karakter)
- Background partikel hidup
- Live user counter + activity feed
- 10 pelajaran coding + quiz
- 16+ game & item
- 20+ article, berita, novel
- Admin panel lengkap (CRUD, markup harga, upload gambar)
- Chart analytics
- Payment fee calculator
- Bulk import/export CSV

## Struktur

Lihat file `README-struktur.md` untuk detail lengkap folder.

## Admin Login

- Username: `YADI`
- Password: `YADIGANTENG2026`

Halaman admin: `/admin.html`

## Environment Variables (Vercel)

Set di Vercel Dashboard -> Settings -> Environment Variables:

- `ADMIN_USER` - Username admin (wajib)
- `ADMIN_PASS` - Password admin (wajib)
- `JWT_SECRET` - Random string 40+ karakter (wajib)
- `CLOUDINARY_CLOUD_NAME` - Untuk upload gambar (opsional)
- `CLOUDINARY_API_KEY` - Untuk upload gambar (opsional)
- `CLOUDINARY_API_SECRET` - Untuk upload gambar (opsional)

## Deploy

1. Push ke GitHub
2. Import di vercel.com
3. Set Environment Variables
4. Deploy

## Lisensi

MIT - Dibuat dengan love oleh Ysdev

Copyright 2026 YadStore
