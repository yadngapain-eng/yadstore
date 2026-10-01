# Security Notes — Learn Earn

## PERUBAHAN KRITIS (2026-10-01)

Repo ini menerima patch keamanan kritis. Baca dengan seksama.

---

## 1. Firestore Rules Diperketat

**SEBELUM:** User bisa write dokumen sendiri (termasuk balance).

**SESUDAH:** Semua write dari client DITOLAK. Hanya via Cloud Functions.

### LANGKAH MANUAL:

1. Buka Firebase Console -> Firestore -> Rules
2. Copy isi FIRESTORE_RULES.txt ke editor
3. Klik Publish

---

## 2. Token Telegram Dihapus

**SEBELUM:** BOT_TOKEN dan CHAT_ID di js/telegram-config.js

**SESUDAH:** Token dihapus. Semua request via proxy /api/notify

### LANGKAH MANUAL:

1. ROTATE Bot Token di BotFather:
   - /mybots -> pilih bot -> API Token -> Revoke current token

2. Set environment variable Cloudflare Worker:
   wrangler secret put BOT_TOKEN
   wrangler secret put CHAT_ID

3. Deploy worker:
   wrangler deploy workers/telegram-proxy.js --name=telegram-proxy

---

## 3. Cloud Functions

File functions/index.js berisi:
- earnReward() — validasi reward
- requestWithdraw() — validasi withdraw

### LANGKAH MANUAL:

1. Install Firebase CLI:
   npm install -g firebase-tools
   firebase login
   firebase init functions

2. Copy functions/index.js dan functions/package.json

3. Deploy:
   cd functions && npm install
   firebase deploy --only functions

4. Update js/rewards.js untuk pakai Cloud Function

---

## 4. Analytics Config

GA4 ID tidak lagi hardcoded. Di index.html:

    <script>
      window.ANALYTICS_CONFIG = {
        GA4_ID: 'G-XXXXXXXXXX',
        SENTRY_DSN: '',
        ENABLED: true
      };
    </script>

---

## 5. Checklist Setelah Patch

- [ ] Publish Firestore Rules baru
- [ ] Rotate Telegram Bot Token
- [ ] Set BOT_TOKEN & CHAT_ID di Worker
- [ ] Deploy Worker
- [ ] Deploy Cloud Functions
- [ ] Update client code pakai Cloud Function
- [ ] Test semua fitur
- [ ] Monitor logs 24 jam

---

## Test Apakah Rules Sudah Benar

Buka console (F12), coba:

    firebase.firestore().collection('users').doc('YOUR_UID').update({
      balance: 99999999
    });

Harus GAGAL dengan permission-denied.
Kalau BERHASIL -> rules masih bocor.
