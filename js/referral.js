/* ============================================
   YADSTORE — REFERRAL SYSTEM v1
   Undang teman, dapat koin!
   ============================================ */

const Referral = {
  // ============================================
  // CONFIG
  // ============================================
  CONFIG: {
    BONUS_REFERRER: 500,           // koin untuk pengundang
    BONUS_REFERRED: 250,           // koin untuk yang diundang
    BONUS_STREAK_3: 50,            // bonus kalau yang diundang aktif 3 hari
    MAX_PER_DAY: 20,               // max referral per hari
    CODE_PREFIX: 'LE-',            // prefix kode
    CODE_LENGTH: 6,                // panjang kode
  },

  // ============================================
  // GENERATE KODE REFERRAL UNIK
  // ============================================
  generateCode: function() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = this.CONFIG.CODE_PREFIX;
    for (let i = 0; i < this.CONFIG.CODE_LENGTH; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  },

  // ============================================
  // GET REFERRAL CODE (buat kalau belum ada)
  // ============================================
  async getMyCode() {
    // Cek dulu di localStorage
    let code = localStorage.getItem('yadstore_referral_code');
    if (code) return code;

    // Cek di profile user
    if (typeof Auth !== 'undefined' && Auth.profile && Auth.profile.referralCode) {
      code = Auth.profile.referralCode;
      localStorage.setItem('yadstore_referral_code', code);
      return code;
    }

    // Generate baru
    code = this.generateCode();
    localStorage.setItem('yadstore_referral_code', code);

    // Simpan ke Firestore
    if (typeof Auth !== 'undefined' && Auth.db && Auth.user && !Auth.user.isLocal) {
      try {
        await Auth.db.collection('users').doc(Auth.user.uid).update({
          referralCode: code,
          updatedAt: new Date().toISOString(),
        });
        if (Auth.profile) Auth.profile.referralCode = code;
      } catch (e) { console.warn('[Referral] save code error:', e); }
    }

    return code;
  },

  // ============================================
  // GET LINK REFERRAL
  // ============================================
  getLink: function(code) {
    if (!code) code = localStorage.getItem('yadstore_referral_code') || '';
    return 'https://duniamu.my.id/?ref=' + code;
  },

  // ============================================
  // GET QR CODE URL
  // ============================================
  getQRUrl: function(code) {
    if (!code) code = localStorage.getItem('yadstore_referral_code') || '';
    const link = this.getLink(code);
    // Pakai API gratis QR Server
    return 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodeURIComponent(link);
  },

  // ============================================
  // CEK APAKAH USER SUDAH PERNAH DI-REFER
  // ============================================
  hasUsedReferral: function() {
    return !!localStorage.getItem('yadstore_used_referral');
  },

  // ============================================
  // APPLY REFERRAL CODE (saat user baru masuk)
  // ============================================
  async applyReferral(code) {
    if (!code) return { success: false, error: 'Kode kosong' };

    // Cek user sudah pernah pakai
    if (this.hasUsedReferral()) {
      return { success: false, error: 'Kamu sudah pernah pakai kode referral' };
    }

    // Cek bukan kode sendiri
    const myCode = localStorage.getItem('yadstore_referral_code');
    if (myCode && code === myCode) {
      return { success: false, error: 'Tidak bisa pakai kode sendiri' };
    }

    // Cari user yang punya kode ini
    if (typeof Auth === 'undefined' || !Auth.db) {
      return { success: false, error: 'Sistem belum siap' };
    }

    try {
      const snap = await Auth.db.collection('users')
        .where('referralCode', '==', code)
        .limit(1)
        .get();

      if (snap.empty) {
        return { success: false, error: 'Kode referral tidak ditemukan' };
      }

      const referrerDoc = snap.docs[0];
      const referrer = referrerDoc.data();
      const referrerId = referrerDoc.id;

      // Cek user login (untuk simpan ke Firestore)
      if (!Auth.user) {
        return { success: false, error: 'Login dulu untuk pakai referral' };
      }

      const myId = Auth.user.uid;

      // Cek apakah sudah pernah di-refer oleh user ini
      if (referrer.referredUsers && referrer.referredUsers.includes(myId)) {
        return { success: false, error: 'Kamu sudah pernah di-refer user ini' };
      }

      // ===== SIMPAN DATA REFERRAL =====
      const referralData = {
        code: code,
        referrerId: referrerId,
        referredId: myId,
        referredAt: new Date().toISOString(),
        status: 'active',
        bonusGiven: false,
        streak3Bonus: false,
      };

      // Simpan ke Firestore referrer
      await Auth.db.collection('users').doc(referrerId).update({
        referredUsers: firebase.firestore.FieldValue.arrayUnion(myId),
        referralCount: (referrer.referralCount || 0) + 1,
        updatedAt: new Date().toISOString(),
      });

      // Simpan data referrer di user yang di-refer
      await Auth.db.collection('users').doc(myId).update({
        referredBy: referrerId,
        referredByCode: code,
        referredAt: new Date().toISOString(),
        usedReferral: code,
        updatedAt: new Date().toISOString(),
      });

      // Simpan log referral
      await Auth.db.collection('referrals').add(referralData);

      // Simpan di localStorage
      localStorage.setItem('yadstore_used_referral', code);

      return {
        success: true,
        referrerId: referrerId,
        referrerName: referrer.displayName || 'User',
        bonus: this.CONFIG.BONUS_REFERRED,
      };
    } catch (e) {
      console.error('[Referral] applyReferral error:', e);
      return { success: false, error: e.message };
    }
  },

  // ============================================
  // PROCESS REWARD (dipanggil saat user yang di-refer dapat reward)
  // ============================================
  async processReward(referredId, type) {
    if (typeof Auth === 'undefined' || !Auth.db) return;

    try {
      const userDoc = await Auth.db.collection('users').doc(referredId).get();
      if (!userDoc.exists) return;
      const user = userDoc.data();

      if (!user.referredBy) return;  // User ini tidak di-refer

      const referrerId = user.referredBy;

      // ===== BONUS 1: Saat referral aktif (pertama kali) =====
      if (type === 'first_active') {
        // Cek apakah bonus sudah pernah dikasih
        const refSnap = await Auth.db.collection('referrals')
          .where('referredId', '==', referredId)
          .limit(1)
          .get();

        if (!refSnap.empty) {
          const refDoc = refSnap.docs[0];
          const refData = refDoc.data();

          if (!refData.bonusGiven) {
            // Update referrer dengan bonus
            const refUserDoc = await Auth.db.collection('users').doc(referrerId).get();
            if (refUserDoc.exists) {
              const refUser = refUserDoc.data();
              await Auth.db.collection('users').doc(referrerId).update({
                balance: (refUser.balance || 0) + this.CONFIG.BONUS_REFERRER,
                totalEarned: (refUser.totalEarned || 0) + this.CONFIG.BONUS_REFERRER,
                updatedAt: new Date().toISOString(),
              });
            }

            // Update referred user dengan bonus
            await Auth.db.collection('users').doc(referredId).update({
              balance: (user.balance || 0) + this.CONFIG.BONUS_REFERRED,
              totalEarned: (user.totalEarned || 0) + this.CONFIG.BONUS_REFERRED,
              updatedAt: new Date().toISOString(),
            });

            // Update log referral
            await refDoc.ref.update({
              bonusGiven: true,
              bonusGivenAt: new Date().toISOString(),
            });

            console.log('[Referral] Bonus given to referrer:', referrerId);
            return true;
          }
        }
      }

      // ===== BONUS 2: Streak 3 hari =====
      if (type === 'streak_3') {
        const refSnap = await Auth.db.collection('referrals')
          .where('referredId', '==', referredId)
          .where('streak3Bonus', '==', false)
          .limit(1)
          .get();

        if (!refSnap.empty) {
          const refDoc = refSnap.docs[0];

          // Bonus untuk referrer
          const refUserDoc = await Auth.db.collection('users').doc(referrerId).get();
          if (refUserDoc.exists) {
            const refUser = refUserDoc.data();
            await Auth.db.collection('users').doc(referrerId).update({
              balance: (refUser.balance || 0) + this.CONFIG.BONUS_STREAK_3,
              totalEarned: (refUser.totalEarned || 0) + this.CONFIG.BONUS_STREAK_3,
              updatedAt: new Date().toISOString(),
            });
          }

          await refDoc.ref.update({
            streak3Bonus: true,
            streak3BonusAt: new Date().toISOString(),
          });

          console.log('[Referral] Streak 3 bonus given');
          return true;
        }
      }
    } catch (e) {
      console.error('[Referral] processReward error:', e);
    }
    return false;
  },

  // ============================================
  // GET MY STATS
  // ============================================
  async getMyStats() {
    if (typeof Auth === 'undefined' || !Auth.db || !Auth.user) {
      return { count: 0, totalEarned: 0, list: [] };
    }

    try {
      // Ambil dari profile user
      const doc = await Auth.db.collection('users').doc(Auth.user.uid).get();
      if (!doc.exists) return { count: 0, totalEarned: 0, list: [] };

      const data = doc.data();
      const count = (data.referredUsers || []).length;
      const totalEarned = count * this.CONFIG.BONUS_REFERRER;

      // Ambil list referral
      const refSnap = await Auth.db.collection('referrals')
        .where('referrerId', '==', Auth.user.uid)
        .orderBy('referredAt', 'desc')
        .limit(50)
        .get();

      const list = refSnap.docs.map(d => d.data());

      return { count, totalEarned, list };
    } catch (e) {
      console.warn('[Referral] getMyStats error:', e);
      return { count: 0, totalEarned: 0, list: [] };
    }
  },

  // ============================================
  // RENDER UI REFERRAL
  // ============================================
  renderReferralSection: async function() {
    const code = await this.getMyCode();
    const link = this.getLink(code);
    const qrUrl = this.getQRUrl(code);
    const stats = await this.getMyStats();

    let html = '';

    // ===== CARD REFERRAL =====
    html += '<div class="reward-missions" style="background:linear-gradient(135deg,#e0e7ff,#c7d2fe);border:2px solid #6366f1">' +
      '<h3 style="color:#3730a3">🎁 Undang Teman</h3>' +
      '<p style="color:#4f46e5;font-size:13px;margin-bottom:12px">Ajak teman pakai Learn Earn, dapat koin untuk kalian berdua!</p>' +

      // Kode referral
      '<div style="background:white;border-radius:12px;padding:14px;margin-bottom:12px">' +
        '<div style="font-size:11px;color:#666;font-weight:700;text-transform:uppercase;margin-bottom:4px">Kode Referral Kamu</div>' +
        '<div style="display:flex;align-items:center;gap:8px">' +
          '<div id="my-ref-code" style="flex:1;font-family:monospace;font-size:18px;font-weight:900;color:#3730a3;letter-spacing:2px;background:#f0f4ff;padding:10px;border-radius:8px;text-align:center">' + code + '</div>' +
          '<button onclick="Referral.copyCode()" style="padding:10px 14px;background:#6366f1;color:white;border:none;border-radius:8px;font-weight:900;cursor:pointer;font-size:12px">📋 Copy</button>' +
        '</div>' +
      '</div>' +

      // Link
      '<div style="background:white;border-radius:12px;padding:14px;margin-bottom:12px">' +
        '<div style="font-size:11px;color:#666;font-weight:700;text-transform:uppercase;margin-bottom:4px">Link Referral</div>' +
        '<div style="display:flex;align-items:center;gap:8px">' +
          '<input id="my-ref-link" value="' + link + '" readonly style="flex:1;font-size:11px;padding:10px;border:2px solid #e5e5e5;border-radius:8px;background:#fafafa">' +
          '<button onclick="Referral.copyLink()" style="padding:10px 14px;background:#10b981;color:white;border:none;border-radius:8px;font-weight:900;cursor:pointer;font-size:12px">📋 Copy</button>' +
        '</div>' +
      '</div>' +

      // QR Code
      '<div style="background:white;border-radius:12px;padding:14px;text-align:center;margin-bottom:12px">' +
        '<div style="font-size:11px;color:#666;font-weight:700;text-transform:uppercase;margin-bottom:8px">QR Code</div>' +
        '<img src="' + qrUrl + '" alt="QR Code" style="width:180px;height:180px;border-radius:8px;margin-bottom:8px" onerror="this.style.display=\'none\'">' +
        '<div style="font-size:11px;color:#666;margin-bottom:8px">Scan atau screenshot untuk share</div>' +
        '<button onclick="Referral.downloadQR()" style="padding:8px 16px;background:#f59e0b;color:white;border:none;border-radius:8px;font-weight:900;cursor:pointer;font-size:12px">📥 Download QR</button>' +
      '</div>' +

      // Share buttons
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">' +
        '<button onclick="Referral.shareWhatsApp()" style="flex:1;min-width:100px;padding:12px;background:#25d366;color:white;border:none;border-radius:8px;font-weight:900;cursor:pointer;font-size:12px">💬 WhatsApp</button>' +
        '<button onclick="Referral.shareTelegram()" style="flex:1;min-width:100px;padding:12px;background:#0088cc;color:white;border:none;border-radius:8px;font-weight:900;cursor:pointer;font-size:12px">✈️ Telegram</button>' +
        '<button onclick="Referral.shareFacebook()" style="flex:1;min-width:100px;padding:12px;background:#1877f2;color:white;border:none;border-radius:8px;font-weight:900;cursor:pointer;font-size:12px">📘 Facebook</button>' +
      '</div>' +

      // Stats
      '<div style="background:white;border-radius:12px;padding:14px;margin-bottom:12px">' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +
          '<div style="text-align:center">' +
            '<div style="font-size:24px;font-weight:900;color:#6366f1">' + stats.count + '</div>' +
            '<div style="font-size:11px;color:#666;font-weight:700">Teman Diundang</div>' +
          '</div>' +
          '<div style="text-align:center">' +
            '<div style="font-size:24px;font-weight:900;color:#10b981">' + stats.totalEarned.toLocaleString('id-ID') + '</div>' +
            '<div style="font-size:11px;color:#666;font-weight:700">Total Koin Didapat</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      // Info bonus
      '<div style="background:#fef3c7;border:2px solid #f59e0b;border-radius:12px;padding:12px">' +
        '<div style="font-size:12px;color:#78350f;line-height:1.6">' +
          '<strong>💰 Bonus:</strong><br>' +
          '• Kamu dapat <strong>' + this.CONFIG.BONUS_REFERRER + ' koin</strong> per teman<br>' +
          '• Teman dapat <strong>' + this.CONFIG.BONUS_REFERRED + ' koin</strong> saat login<br>' +
          '• Extra <strong>' + this.CONFIG.BONUS_STREAK_3 + ' koin</strong> kalau teman aktif 3 hari<br>' +
          '• Maksimal <strong>' + this.CONFIG.MAX_PER_DAY + ' teman/hari</strong>' +
        '</div>' +
      '</div>' +
    '</div>';

    return html;
  },

  // ============================================
  // COPY CODE
  // ============================================
  copyCode: function() {
    const el = document.getElementById('my-ref-code');
    if (!el) return;
    this._copy(el.textContent);
    if (typeof Animate !== 'undefined') Animate.toast('Kode dicopy!', 'success');
  },

  // ============================================
  // COPY LINK
  // ============================================
  copyLink: function() {
    const el = document.getElementById('my-ref-link');
    if (!el) return;
    this._copy(el.value);
    if (typeof Animate !== 'undefined') Animate.toast('Link dicopy!', 'success');
  },

  _copy: function(text) {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
    } catch (e) {}
  },

  // ============================================
  // SHARE HELPERS
  // ============================================
  shareWhatsApp: function() {
    const code = localStorage.getItem('yadstore_referral_code') || '';
    const text = '🎁 Yuk gabung Learn Earn! Belajar sambil dapat koin, bisa withdraw ke DANA/OVO/GoPay!\n\nPakai kode referral: *' + code + '*\nAtau klik link: ' + this.getLink(code) + '\n\nDapat 250 koin GRATIS buat kamu! 🚀';
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
  },

  shareTelegram: function() {
    const code = localStorage.getItem('yadstore_referral_code') || '';
    const text = '🎁 Yuk gabung Learn Earn! Pakai kode referral: ' + code + '\n' + this.getLink(code);
    window.open('https://t.me/share/url?url=' + encodeURIComponent(this.getLink(code)) + '&text=' + encodeURIComponent(text), '_blank');
  },

  shareFacebook: function() {
    const code = localStorage.getItem('yadstore_referral_code') || '';
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(this.getLink(code)), '_blank');
  },

  downloadQR: async function() {
    const code = localStorage.getItem('yadstore_referral_code') || '';
    const qrUrl = this.getQRUrl(code);
    try {
      // Fetch image dan download
      const resp = await fetch(qrUrl);
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'referral-' + code + '.png';
      a.click();
      URL.revokeObjectURL(url);
      if (typeof Animate !== 'undefined') Animate.toast('QR Code downloaded!', 'success');
    } catch (e) {
      // Fallback: buka di tab baru
      window.open(qrUrl, '_blank');
    }
  },

  // ============================================
  // APPLY DARI URL PARAMETER (saat user buka link referral)
  // ============================================
  async checkUrlReferral() {
    try {
      const params = new URLSearchParams(window.location.search);
      const refCode = params.get('ref');
      if (!refCode) return;

      console.log('[Referral] URL has ref:', refCode);

      // Simpan sementara di localStorage (untuk diproses setelah login)
      localStorage.setItem('yadstore_pending_referral', refCode);

      // Kalau user sudah login, langsung apply
      setTimeout(async () => {
        if (typeof Auth !== 'undefined' && Auth.user && !Auth.user.isAnonymous && !Auth.user.isLocal) {
          const pending = localStorage.getItem('yadstore_pending_referral');
          if (pending && !this.hasUsedReferral()) {
            const result = await this.applyReferral(pending);
            if (result.success) {
              localStorage.removeItem('yadstore_pending_referral');
              if (typeof Animate !== 'undefined') {
                Animate.confetti();
                Animate.toast('🎉 Referral berhasil! +' + result.bonus + ' koin', 'success');
              }
            }
          }
        }
      }, 3000);

      // Bersihkan URL
      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (e) {
      console.warn('[Referral] checkUrlReferral error:', e);
    }
  },
};

if (typeof window !== 'undefined') {
  window.Referral = Referral;
  console.log('[referral] v1 loaded');
}
