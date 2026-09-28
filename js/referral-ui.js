
/* ============================================
   REFERRAL SYSTEM — Full Featured
   ============================================ */
(function() {
  'use strict';

  if (typeof Referral === 'undefined') {
    console.warn('[ReferralUI] Referral core tidak ditemukan');
    return;
  }

  var ReferralUI = {
    CONFIG: {
      BONUS_REFERRER: 500,
      BONUS_REFERRED: 250,
      BONUS_STREAK_3: 50,
      MAX_PER_DAY: 20,
      CODE_PREFIX: 'LE-',
      CODE_LENGTH: 6,
    },

    currentData: {
      code: '',
      link: '',
      stats: { count: 0, totalEarned: 0, list: [] },
      applied: false,
      usedCode: null,
    },

    // ============================================
    // RENDER MAIN PAGE
    // ============================================
    async render() {
      var container = document.getElementById('rewards-content');
      if (!container) return;

      // Load data
      await this.loadData();

      var hero = this.renderHero();
      var codeCard = this.renderCodeCard();
      var qrCard = this.renderQRCard();
      var shareGrid = this.renderShareButtons();
      var applyCard = this.renderApplyCard();
      var bonusInfo = this.renderBonusInfo();
      var history = this.renderHistory();

      container.innerHTML =
        '<div class="ref-page">' +
          hero +
          codeCard +
          qrCard +
          shareGrid +
          applyCard +
          bonusInfo +
          history +
        '</div>';
    },

    // ============================================
    // LOAD DATA FROM FIRESTORE
    // ============================================
    async loadData() {
      try {
        var code = '';
        if (typeof Referral !== 'undefined' && Referral.getMyCode) {
          code = await Referral.getMyCode();
        } else {
          code = localStorage.getItem('yadstore_referral_code') || '';
          if (!code) {
            code = 'LE-' + Math.random().toString(36).substr(2, 6).toUpperCase();
            localStorage.setItem('yadstore_referral_code', code);
          }
        }
        this.currentData.code = code;
        this.currentData.link = 'https://duniamu.my.id/?ref=' + code;

        // Cek sudah apply atau belum
        this.currentData.applied = !!localStorage.getItem('yadstore_used_referral');
        this.currentData.usedCode = localStorage.getItem('yadstore_used_referral');

        // Get stats
        if (typeof Referral !== 'undefined' && Referral.getMyStats) {
          try {
            var stats = await Referral.getMyStats();
            this.currentData.stats = stats;
          } catch (e) {
            console.warn('[ReferralUI] stats error:', e);
          }
        }
      } catch (e) {
        console.error('[ReferralUI] loadData error:', e);
      }
    },

    // ============================================
    // RENDER SECTIONS
    // ============================================
    renderHero() {
      var count = this.currentData.stats.count || 0;
      var earned = this.currentData.stats.totalEarned || 0;
      return '<div class="ref-hero">' +
        '<div class="ref-hero-content">' +
          '<span class="ref-hero-emoji">🎁</span>' +
          '<div class="ref-hero-title">Undang Teman,<br>Dapat Koin!</div>' +
          '<div class="ref-hero-subtitle">Ajak teman pakai Learn Earn, kalian berdua dapat koin!</div>' +
          '<div class="ref-hero-stats">' +
            '<div class="ref-stat">' +
              '<div class="ref-stat-value">' + count + '</div>' +
              '<div class="ref-stat-label">Teman</div>' +
            '</div>' +
            '<div class="ref-stat">' +
              '<div class="ref-stat-value">' + earned.toLocaleString('id-ID') + '</div>' +
              '<div class="ref-stat-label">Koin</div>' +
            '</div>' +
            '<div class="ref-stat">' +
              '<div class="ref-stat-value">' + (this.CONFIG.BONUS_REFERRER) + '</div>' +
              '<div class="ref-stat-label">Per Teman</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    },

    renderCodeCard() {
      var code = this.currentData.code;
      var link = this.currentData.link;
      return '<div class="ref-code-card">' +
        '<div class="ref-code-label">🔑 Kode Referral Kamu</div>' +
        '<div class="ref-code-box">' +
          '<div class="ref-code-value">' + code + '</div>' +
          '<button class="ref-code-copy" onclick="ReferralUI.copyCode()">' +
            '<span>📋</span><span>Copy</span>' +
          '</button>' +
        '</div>' +
        '<div class="ref-code-label" style="margin-top:12px">🔗 Link Referral</div>' +
        '<div class="ref-link-box">' +
          '<input class="ref-link-input" value="' + link + '" readonly id="ref-link-input">' +
          '<button class="ref-link-copy" onclick="ReferralUI.copyLink()">📋 Copy</button>' +
        '</div>' +
      '</div>';
    },

    renderQRCard() {
      var qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=440x440&data=' + encodeURIComponent(this.currentData.link);
      return '<div class="ref-qr-card">' +
        '<div class="ref-code-label" style="text-align:center">📱 QR Code</div>' +
        '<div class="ref-qr-wrap">' +
          '<img class="ref-qr-img" src="' + qrUrl + '" alt="QR Code" ' +
               'onerror="this.style.opacity=0.3">' +
        '</div>' +
        '<div class="ref-qr-hint">Scan atau screenshot untuk share ke teman</div>' +
        '<button class="ref-qr-download" onclick="ReferralUI.downloadQR()">' +
          '📥 Download QR Code' +
        '</button>' +
      '</div>';
    },

    renderShareButtons() {
      return '<div class="ref-share-grid">' +
        '<button class="ref-share-btn ref-share-wa" onclick="ReferralUI.shareWA()">' +
          '<span class="icon">💬</span><span>WhatsApp</span>' +
        '</button>' +
        '<button class="ref-share-btn ref-share-tg" onclick="ReferralUI.shareTG()">' +
          '<span class="icon">✈️</span><span>Telegram</span>' +
        '</button>' +
        '<button class="ref-share-btn ref-share-fb" onclick="ReferralUI.shareFB()">' +
          '<span class="icon">📘</span><span>Facebook</span>' +
        '</button>' +
      '</div>';
    },

    renderApplyCard() {
      if (this.currentData.applied) {
        return '<div class="ref-apply-card">' +
          '<div class="ref-apply-title">✅ Kamu sudah pakai referral</div>' +
          '<div class="ref-apply-desc">Kode: <strong>' + (this.currentData.usedCode || '-') + '</strong></div>' +
          '<div class="ref-apply-applied">' +
            '<span>🎉</span><span>Bonus sudah masuk ke saldo kamu!</span>' +
          '</div>' +
        '</div>';
      }

      return '<div class="ref-apply-card">' +
        '<div class="ref-apply-title">🎁 Punya kode dari teman?</div>' +
        '<div class="ref-apply-desc">Masukkan kode referral di bawah untuk dapat +' + this.CONFIG.BONUS_REFERRED + ' koin GRATIS!</div>' +
        '<div class="ref-apply-input-group">' +
          '<input class="ref-apply-input" id="ref-apply-input" placeholder="LE-XXXXXX" maxlength="12">' +
          '<button class="ref-apply-btn" onclick="ReferralUI.applyCode()">Pakai</button>' +
        '</div>' +
      '</div>';
    },

    renderBonusInfo() {
      var cfg = this.CONFIG;
      return '<div class="ref-bonus-info">' +
        '<div class="ref-bonus-title">💰 Bonus Referral</div>' +
        '<div class="ref-bonus-list">' +
          '<div class="ref-bonus-item">' +
            '<span class="icon">🎯</span>' +
            '<div>Kamu dapat <strong>+' + cfg.BONUS_REFERRER + ' koin</strong> per teman</div>' +
          '</div>' +
          '<div class="ref-bonus-item">' +
            '<span class="icon">🎁</span>' +
            '<div>Teman dapat <strong>+' + cfg.BONUS_REFERRED + ' koin</strong> saat login</div>' +
          '</div>' +
          '<div class="ref-bonus-item">' +
            '<span class="icon">🔥</span>' +
            '<div>Extra <strong>+' + cfg.BONUS_STREAK_3 + ' koin</strong> kalau teman aktif 3 hari</div>' +
          '</div>' +
          '<div class="ref-bonus-item">' +
            '<span class="icon">📊</span>' +
            '<div>Maksimal <strong>' + cfg.MAX_PER_DAY + ' teman/hari</strong></div>' +
          '</div>' +
        '</div>' +
      '</div>';
    },

    renderHistory() {
      var list = this.currentData.stats.list || [];
      var html = '<div class="ref-history-card">' +
        '<div class="ref-history-title">📜 Riwayat Referral (' + list.length + ')</div>';

      if (list.length === 0) {
        html += '<div class="ref-empty">' +
          '<span class="ref-empty-icon">👥</span>' +
          '<div class="ref-empty-text">Belum ada teman yang diundang</div>' +
        '</div>';
      } else {
        html += '<div class="ref-history-list">';
        list.slice(0, 20).forEach(function(item) {
          var name = item.referredName || item.name || 'Teman';
          var avatar = name.charAt(0).toUpperCase() || '?';
          var date = item.referredAt ? new Date(item.referredAt).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric'
          }) : '-';
          var bonus = item.bonusGiven ? (item.bonusAmount || 500) : 0;

          html += '<div class="ref-history-item">' +
            '<div class="ref-history-avatar">' + avatar + '</div>' +
            '<div class="ref-history-info">' +
              '<div class="ref-history-name">' + name + '</div>' +
              '<div class="ref-history-date">📅 ' + date + '</div>' +
            '</div>' +
            '<div class="ref-history-coin">+' + bonus + '</div>' +
          '</div>';
        });
        html += '</div>';
      }

      html += '</div>';
      return html;
    },

    // ============================================
    // ACTIONS
    // ============================================
    copyCode() {
      var code = this.currentData.code;
      this._copy(code);
      if (typeof Animate !== 'undefined') Animate.toast('📋 Kode dicopy!', 'success');
      if (typeof UI !== 'undefined') {
        if (UI.haptic) UI.haptic(20);
        if (UI.sound) UI.sound('click');
      }
    },

    copyLink() {
      var link = this.currentData.link;
      this._copy(link);
      if (typeof Animate !== 'undefined') Animate.toast('📋 Link dicopy!', 'success');
      if (typeof UI !== 'undefined') {
        if (UI.haptic) UI.haptic(20);
        if (UI.sound) UI.sound('click');
      }
    },

    _copy(text) {
      try {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text);
        } else {
          var ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
        }
      } catch (e) {}
    },

    shareWA() {
      var code = this.currentData.code;
      var link = this.currentData.link;
      var text = '🎁 Yuk gabung *Learn Earn*!\n\n' +
        'Belajar sambil dapat koin, bisa withdraw ke DANA/OVO/GoPay!\n\n' +
        'Pakai kode referral: *' + code + '*\n' +
        'Atau klik link ini:\n' + link + '\n\n' +
        'Dapat *' + this.CONFIG.BONUS_REFERRED + ' koin GRATIS* buat kamu! 🚀';
      window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
      if (typeof UI !== 'undefined' && UI.haptic) UI.haptic(15);
    },

    shareTG() {
      var code = this.currentData.code;
      var link = this.currentData.link;
      var text = '🎁 Gabung Learn Earn! Kode: ' + code + ' — Dapat 250 koin GRATIS!';
      window.open('https://t.me/share/url?url=' + encodeURIComponent(link) + '&text=' + encodeURIComponent(text), '_blank');
      if (typeof UI !== 'undefined' && UI.haptic) UI.haptic(15);
    },

    shareFB() {
      var link = this.currentData.link;
      window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(link), '_blank');
      if (typeof UI !== 'undefined' && UI.haptic) UI.haptic(15);
    },

    async downloadQR() {
      var qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=800x800&data=' + encodeURIComponent(this.currentData.link);
      try {
        var resp = await fetch(qrUrl);
        var blob = await resp.blob();
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'referral-' + this.currentData.code + '.png';
        a.click();
        URL.revokeObjectURL(url);
        if (typeof Animate !== 'undefined') Animate.toast('📥 QR Code downloaded!', 'success');
      } catch (e) {
        window.open(qrUrl, '_blank');
      }
    },

    async applyCode() {
      var input = document.getElementById('ref-apply-input');
      if (!input) return;
      var code = input.value.trim().toUpperCase();
      if (!code) {
        if (typeof Animate !== 'undefined') Animate.toast('⚠️ Masukkan kode referral', 'error');
        return;
      }
      if (code === this.currentData.code) {
        if (typeof Animate !== 'undefined') Animate.toast('❌ Tidak bisa pakai kode sendiri', 'error');
        return;
      }
      if (this.currentData.applied) {
        if (typeof Animate !== 'undefined') Animate.toast('⚠️ Kamu sudah pakai referral', 'error');
        return;
      }

      // Apply via Referral core
      if (typeof Referral !== 'undefined' && Referral.applyReferral) {
        var result = await Referral.applyReferral(code);
        if (result.success) {
          if (typeof Animate !== 'undefined') {
            Animate.confetti();
            Animate.toast('🎉 Berhasil! +' + (result.bonus || this.CONFIG.BONUS_REFERRED) + ' koin', 'success');
          }
          if (typeof UI !== 'undefined') {
            if (UI.sound) UI.sound('achievement');
            if (UI.haptic) UI.haptic([30, 50, 30]);
          }
          // Reload data & render
          await this.loadData();
          await this.render();
        } else {
          if (typeof Animate !== 'undefined') {
            Animate.toast('❌ ' + (result.error || 'Gagal pakai kode'), 'error');
          }
        }
      } else {
        if (typeof Animate !== 'undefined') Animate.toast('❌ Sistem belum siap', 'error');
      }
    },
  };

  // Expose ke window
  window.ReferralUI = ReferralUI;

  // Override Referral.renderRewardsPage untuk include referral section
  if (typeof Rewards !== 'undefined') {
    var origRender = Rewards.renderRewardsPage;
    if (origRender) {
      Rewards.renderRewardsPage = function() {
        // Kalau di halaman referral (via hash), tampilkan full referral
        if (window.location.hash === '#referral') {
          setTimeout(function() { ReferralUI.render(); }, 100);
          return '<div id="referral-fullpage" style="min-height:200px"><div style="text-align:center;padding:40px;color:#999">⏳ Memuat referral...</div></div>';
        }
        return origRender.call(Rewards);
      };
    }
  }

  console.log('[ReferralUI] Full system loaded');
})();
