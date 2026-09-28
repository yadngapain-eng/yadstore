
/* ============================================
   ADMIN REFERRAL — Full Featured (Fix permissions)
   ============================================ */
(function() {
  'use strict';

  function patchAdminReferral() {
    if (typeof Admin === 'undefined' || !Admin.renderReferral) {
      setTimeout(patchAdminReferral, 300);
      return;
    }
    if (Admin._refPatched) return;
    Admin._refPatched = true;

    Admin.renderReferral = async function(c) {
      c.innerHTML = '<div class="loading-inline">Memuat data referral...</div>';

      try {
        // ============================================
        // 1. Ambil users (rules sudah allow admin)
        // ============================================
        var usersSnap = await this.db.collection('users').limit(500).get();
        var users = usersSnap.docs.map(function(d) {
          return Object.assign({ uid: d.id }, d.data());
        });

        // ============================================
        // 2. Ambil referrals (dengan fallback)
        // ============================================
        var referrals = [];
        try {
          var refSnap = await this.db.collection('referrals')
            .orderBy('referredAt', 'desc')
            .limit(200)
            .get();
          referrals = refSnap.docs.map(function(d) {
            return Object.assign({ id: d.id }, d.data());
          });
        } catch (refErr) {
          console.warn('[Admin] referrals collection blocked:', refErr.message);
          // Fallback: bangun dari users collection
          referrals = users
            .filter(function(u) { return u.referredBy; })
            .map(function(u) {
              return {
                id: u.uid,
                referrerId: u.referredBy,
                referredId: u.uid,
                referredName: u.displayName,
                referredAt: u.referredAt,
                bonusGiven: true,
                bonusAmount: 500,
                code: u.referredByCode || '-',
              };
            });
        }

        // ============================================
        // 3. Hitung statistik
        // ============================================
        var referrers = users
          .filter(function(u) { return (u.referralCount || 0) > 0; })
          .sort(function(a, b) { return (b.referralCount || 0) - (a.referralCount || 0); });

        var totalReferrals = referrals.length;
        var totalReferrers = referrers.length;
        var totalBonus = totalReferrals * 500;

        // ============================================
        // 4. Render
        // ============================================
        var html = '';

        // Stats
        html += '<div class="stats-grid">' +
          '<div class="stat-card"><div class="stat-icon">👥</div><div class="stat-val">' + totalReferrals + '</div><div class="stat-label">Total Referral</div></div>' +
          '<div class="stat-card"><div class="stat-icon">🎯</div><div class="stat-val">' + totalReferrers + '</div><div class="stat-label">Pengundang</div></div>' +
          '<div class="stat-card"><div class="stat-icon">💰</div><div class="stat-val">' + totalBonus.toLocaleString('id-ID') + '</div><div class="stat-label">Koin Dibagikan</div></div>' +
        '</div>';

        // Top referrers
        html += '<div class="card"><h3>🏆 Top 10 Pengundang</h3>';
        if (referrers.length === 0) {
          html += '<p class="empty-msg">Belum ada referral</p>';
        } else {
          html += '<div class="table-wrap"><table><thead><tr>' +
            '<th>#</th><th>User</th><th>Kode</th><th>Teman</th><th>Koin</th></tr></thead><tbody>';
          referrers.slice(0, 10).forEach(function(u, i) {
            var medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '#' + (i + 1);
            var count = u.referralCount || 0;
            html += '<tr>' +
              '<td>' + medal + '</td>' +
              '<td>' + (u.avatar || '👤') + ' ' + (u.displayName || '-') + '</td>' +
              '<td><code>' + (u.referralCode || '-') + '</code></td>' +
              '<td><strong>' + count + '</strong></td>' +
              '<td>' + (count * 500).toLocaleString('id-ID') + '</td>' +
            '</tr>';
          });
          html += '</tbody></table></div>';
        }
        html += '</div>';

        // Log referral
        html += '<div class="card"><h3>📋 Log Referral Terbaru (' + referrals.length + ')</h3>';
        if (referrals.length === 0) {
          html += '<p class="empty-msg">Belum ada log referral</p>';
        } else {
          html += '<div class="table-wrap"><table><thead><tr>' +
            '<th>Waktu</th><th>User</th><th>Kode</th><th>Bonus</th><th>Status</th></tr></thead><tbody>';
          referrals.slice(0, 50).forEach(function(r) {
            var t = r.referredAt ? new Date(r.referredAt).toLocaleString('id-ID', {
              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
            }) : '-';
            var name = r.referredName || '-';
            var bonus = r.bonusGiven ? (r.bonusAmount || 500) : 0;
            var status = r.bonusGiven ? '✅ Aktif' : '⏳ Pending';
            html += '<tr>' +
              '<td style="font-size:11px">' + t + '</td>' +
              '<td>' + name + '</td>' +
              '<td><code>' + (r.code || '-') + '</code></td>' +
              '<td><strong>' + bonus + '</strong></td>' +
              '<td>' + status + '</td>' +
            '</tr>';
          });
          html += '</tbody></table></div>';
        }
        html += '</div>';

        // Semua user dengan kode
        html += '<div class="card"><h3>📊 Semua User dengan Kode (' + users.length + ')</h3>' +
          '<div class="table-wrap"><table><thead><tr>' +
          '<th>User</th><th>Email</th><th>Kode</th><th>Teman</th><th>Di-refer Oleh</th></tr></thead><tbody>';
        users.slice(0, 100).forEach(function(u) {
          var count = (u.referredUsers || []).length;
          html += '<tr>' +
            '<td>' + (u.avatar || '👤') + ' ' + (u.displayName || '-') + '</td>' +
            '<td style="font-size:11px">' + (u.email || '-') + '</td>' +
            '<td><code style="font-size:11px">' + (u.referralCode || '-') + '</code></td>' +
            '<td>' + count + '</td>' +
            '<td>' + (u.referredByCode ? '<code>' + u.referredByCode + '</code>' : '-') + '</td>' +
          '</tr>';
        });
        html += '</tbody></table></div></div>';

        c.innerHTML = html;

      } catch (e) {
        console.error('[Admin] renderReferral error:', e);
        c.innerHTML = '<div class="card">' +
          '<p style="color:red">❌ Error: ' + e.message + '</p>' +
          '<p style="color:#666;font-size:13px;margin-top:8px">Cek Firestore rules — pastikan admin punya akses ke collection referrals & users.</p>' +
          '<button onclick="Admin.renderReferral(document.getElementById(\'content\'))" ' +
          'style="padding:8px 16px;background:#58cc02;color:white;border:none;border-radius:8px;font-weight:900;cursor:pointer;margin-top:8px">🔄 Coba Lagi</button>' +
        '</div>';
      }
    };

    console.log('[AdminReferral] Patched');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(patchAdminReferral, 1000);
    });
  } else {
    setTimeout(patchAdminReferral, 1000);
  }
})();
