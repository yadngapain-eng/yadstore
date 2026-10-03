/* ============================================
   ADS REWARD SYSTEM
   Klik iklan → dapat koin (1-100)
   100 koin = Rp 1
   Weighted random probability
   ============================================ */

(function() {
  'use strict';

  console.log('[AdsReward] Loading...');

  window.AdsReward = {
    VERSION: 'v1',
    
    // ============================================
    // KONFIGURASI
    // ============================================
    CONFIG: {
      COOLDOWN_SECONDS: 30,
      MAX_KLIK_PER_HARI: 20,
      KOIN_PER_RUPIAH: 100,  // 100 koin = Rp 1
    },
    
    // ============================================
    // REWARD TABLE — Weighted Random
    // Semakin tinggi reward, semakin kecil chance
    // ============================================
    REWARD_TABLE: [
      { koin: 1,   weight: 40.0,  label: '1 koin' },
      { koin: 2,   weight: 15.0,  label: '2 koin' },
      { koin: 3,   weight: 10.0,  label: '3 koin' },
      { koin: 5,   weight: 5.0,   label: '5 koin' },
      { koin: 7,   weight: 4.0,   label: '7 koin' },
      { koin: 10,  weight: 15.0,  label: '10 koin' },
      { koin: 15,  weight: 5.0,   label: '15 koin' },
      { koin: 25,  weight: 3.0,   label: '25 koin' },
      { koin: 50,  weight: 2.0,   label: '50 koin' },
      { koin: 75,  weight: 0.5,   label: '75 koin' },
      { koin: 100, weight: 0.5,   label: '100 koin 🎉 JACKPOT!' },
    ],
    
    // ============================================
    // STORAGE HELPERS
    // ============================================
    get: function(key, def) {
      try {
        var v = localStorage.getItem('yadstore_adsreward_' + key);
        return v !== null ? JSON.parse(v) : def;
      } catch (e) { return def; }
    },
    
    set: function(key, val) {
      try { 
        localStorage.setItem('yadstore_adsreward_' + key, JSON.stringify(val)); 
      } catch (e) {}
    },
    
    getState: function() {
      var today = new Date().toISOString().split('T')[0];
      return {
        lastClickTime: this.get('lastClickTime', 0),
        todayCount: this.get('todayCount', 0),
        todayDate: this.get('todayDate', today),
        totalClicks: this.get('totalClicks', 0),
        totalEarned: this.get('totalEarned', 0),
        history: this.get('history', []),
      };
    },
    
    saveState: function(state) {
      this.set('lastClickTime', state.lastClickTime);
      this.set('todayCount', state.todayCount);
      this.set('todayDate', state.todayDate);
      this.set('totalClicks', state.totalClicks);
      this.set('totalEarned', state.totalEarned);
      this.set('history', state.history);
    },
    
    // ============================================
    // CEK APAKAH BISA KLIK
    // ============================================
    canClick: function() {
      var state = this.getState();
      var today = new Date().toISOString().split('T')[0];
      
      // Reset harian
      if (state.todayDate !== today) {
        state.todayCount = 0;
        state.todayDate = today;
        this.saveState(state);
      }
      
      // Cek limit harian
      if (state.todayCount >= this.CONFIG.MAX_KLIK_PER_HARI) {
        return {
          ok: false,
          reason: 'limit_harian',
          message: 'Limit harian tercapai (' + this.CONFIG.MAX_KLIK_PER_HARI + 'x). Kembali besok!',
        };
      }
      
      // Cek cooldown
      var now = Date.now();
      var elapsed = (now - state.lastClickTime) / 1000;
      
      if (elapsed < this.CONFIG.COOLDOWN_SECONDS) {
        var remain = Math.ceil(this.CONFIG.COOLDOWN_SECONDS - elapsed);
        return {
          ok: false,
          reason: 'cooldown',
          remain: remain,
          message: 'Tunggu ' + remain + ' detik lagi',
        };
      }
      
      return {
        ok: true,
        todayCount: state.todayCount,
        remaining: this.CONFIG.MAX_KLIK_PER_HARI - state.todayCount,
      };
    },
    
    // ============================================
    // WEIGHTED RANDOM
    // ============================================
    getRandomReward: function() {
      var totalWeight = 0;
      for (var i = 0; i < this.REWARD_TABLE.length; i++) {
        totalWeight += this.REWARD_TABLE[i].weight;
      }
      
      var random = Math.random() * totalWeight;
      var cumulative = 0;
      
      for (var i = 0; i < this.REWARD_TABLE.length; i++) {
        cumulative += this.REWARD_TABLE[i].weight;
        if (random <= cumulative) {
          return this.REWARD_TABLE[i];
        }
      }
      
      // Fallback
      return this.REWARD_TABLE[0];
    },
    
    // ============================================
    // KLIK IKLAN → DAPAT KOIN
    // ============================================
    clickAd: async function() {
      // Cek bisa klik atau tidak
      var check = this.canClick();
      if (!check.ok) {
        console.warn('[AdsReward] Cannot click:', check.reason);
        return {
          success: false,
          reason: check.reason,
          message: check.message,
          remain: check.remain,
        };
      }
      
      console.log('[AdsReward] Opening ad...');
      
      // Buka iklan Adsterra
      var adResult = null;
      try {
        if (typeof AdsManager !== 'undefined' && AdsManager.openRewarded) {
          adResult = await AdsManager.openRewarded();
        } else {
          // Fallback: buka smartlink langsung
          var smartlink = 'https://www.profitableratecpmnetwork.com/rnve2ckg?key=f15341dc4ed341cc62411d69d314d518';
          window.open(smartlink, '_blank', 'width=800,height=600');
          adResult = { success: true, method: 'direct' };
        }
      } catch (e) {
        console.error('[AdsReward] Ad error:', e);
        adResult = { success: false, reason: 'ad_error' };
      }
      
      // Kalau iklan gagal
      if (!adResult || !adResult.success) {
        if (adResult && adResult.reason === 'cooldown') {
          return {
            success: false,
            reason: 'cooldown',
            remain: adResult.remain,
            message: 'Tunggu ' + adResult.remain + ' detik lagi',
          };
        }
        return {
          success: false,
          reason: 'ad_failed',
          message: 'Iklan gagal dibuka. Coba lagi.',
        };
      }
      
      // Delay sebelum reward (biar user sempat lihat iklan)
      // Reward diberikan setelah user kembali
      var self = this;
      
      return new Promise(function(resolve) {
        // Simpan pending reward
        localStorage.setItem('yadstore_adsreward_pending', '1');
        
        // Setelah user kembali (visible kembali setelah 3 detik)
        var checkReturn = setInterval(function() {
          if (!document.hidden) {
            clearInterval(checkReturn);
            
            // Delay 2 detik biar user settle
            setTimeout(function() {
              var result = self.giveReward();
              localStorage.removeItem('yadstore_adsreward_pending');
              resolve(result);
            }, 2000);
          }
        }, 500);
        
        // Fallback: kasih reward setelah 10 detik
        setTimeout(function() {
          clearInterval(checkReturn);
          if (localStorage.getItem('yadstore_adsreward_pending')) {
            var result = self.giveReward();
            localStorage.removeItem('yadstore_adsreward_pending');
            resolve(result);
          }
        }, 10000);
      });
    },
    
    // ============================================
    // BERI REWARD
    // ============================================
    giveReward: function() {
      var reward = this.getRandomReward();
      var koin = reward.koin;
      var rupiah = koin / this.CONFIG.KOIN_PER_RUPIAH;
      
      // Update state
      var state = this.getState();
      state.lastClickTime = Date.now();
      state.todayCount += 1;
      state.totalClicks += 1;
      state.totalEarned += koin;
      
      // Tambah ke history
      state.history.unshift({
        koin: koin,
        rupiah: rupiah,
        date: new Date().toISOString(),
        label: reward.label,
      });
      if (state.history.length > 100) state.history = state.history.slice(0, 100);
      
      this.saveState(state);
      
      // Tambah koin ke saldo user
      try {
        if (typeof Rewards !== 'undefined' && Rewards.addCoin) {
          Rewards.addCoin(koin, '🎬 Klik Iklan (' + reward.label + ')');
        }
      } catch (e) {
        console.warn('[AdsReward] Failed to add coin:', e);
      }
      
      console.log('[AdsReward] ✅ Got ' + koin + ' koin (Rp ' + rupiah + ')');
      
      return {
        success: true,
        koin: koin,
        rupiah: rupiah,
        label: reward.label,
        isJackpot: koin >= 100,
        todayCount: state.todayCount,
        remaining: this.CONFIG.MAX_KLIK_PER_HARI - state.todayCount,
      };
    },
    
    // ============================================
    // RENDER UI
    // ============================================
    renderUI: function() {
      var state = this.getState();
      var check = this.canClick();
      
      var buttonDisabled = !check.ok;
      var buttonText = '🎬 KLIK IKLAN DAPAT KOIN';
      var buttonSub = 'Dapat 1-100 koin (100 koin = Rp 1)';
      
      if (check.reason === 'cooldown') {
        buttonDisabled = true;
        buttonText = '⏱️ Tunggu ' + check.remain + 's';
        buttonSub = 'Cooldown setelah klik';
      } else if (check.reason === 'limit_harian') {
        buttonDisabled = true;
        buttonText = '✅ Limit Harian Tercapai';
        buttonSub = 'Kembali besok untuk klik lagi';
      }
      
      var html = '' +
        '<div class="ads-reward-card" style="' +
          'background: linear-gradient(135deg, #1cb0f6, #0891b2);' +
          'border-radius: 20px;' +
          'padding: 20px;' +
          'margin-bottom: 16px;' +
          'color: white;' +
          'box-shadow: 0 12px 32px rgba(28,176,246,0.3);' +
          'position: relative;' +
          'overflow: hidden;' +
        '">' +
          '<div style="position:relative;z-index:1">' +
            '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">' +
              '<span style="font-size:28px">🎬</span>' +
              '<div style="flex:1">' +
                '<div style="font-size:16px;font-weight:900;margin-bottom:2px">Klik Iklan, Dapat Koin!</div>' +
                '<div style="font-size:11px;opacity:0.9">100 koin = Rp 1</div>' +
              '</div>' +
            '</div>' +
            
            '<div style="background:rgba(255,255,255,0.15);border-radius:12px;padding:12px;margin-bottom:12px">' +
              '<div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:12px">' +
                '<span>Hari ini:</span>' +
                '<strong>' + state.todayCount + '/' + this.CONFIG.MAX_KLIK_PER_HARI + '</strong>' +
              '</div>' +
              '<div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:12px">' +
                '<span>Total klik:</span>' +
                '<strong>' + state.totalClicks + 'x</strong>' +
              '</div>' +
              '<div style="display:flex;justify-content:space-between;font-size:12px">' +
                '<span>Total didapat:</span>' +
                '<strong>' + state.totalEarned + ' koin (Rp ' + (state.totalEarned / 100).toFixed(2) + ')</strong>' +
              '</div>' +
            '</div>' +
            
            '<button ' +
              'id="ads-reward-btn" ' +
              'onclick="AdsReward.handleClick()" ' +
              'style="' +
                'width:100%;' +
                'padding:16px;' +
                'background:' + (buttonDisabled ? '#94a3b8' : 'linear-gradient(135deg,#fbbf24,#f59e0b)') + ';' +
                'color:white;' +
                'border:none;' +
                'border-radius:12px;' +
                'font-family:inherit;' +
                'font-size:15px;' +
                'font-weight:900;' +
                'cursor:' + (buttonDisabled ? 'not-allowed' : 'pointer') + ';' +
                'box-shadow:0 4px 0 ' + (buttonDisabled ? '#64748b' : '#b45309') + ';' +
                'text-transform:uppercase;' +
                'letter-spacing:0.5px;' +
              '" ' +
              (buttonDisabled ? 'disabled' : '') +
            '>' +
              buttonText +
            '</button>' +
            
            '<div style="text-align:center;font-size:11px;margin-top:8px;opacity:0.9">' +
              buttonSub +
            '</div>' +
            
            // Reward chances
            '<details style="margin-top:12px;font-size:11px">' +
              '<summary style="cursor:pointer;opacity:0.8">📊 Lihat peluang reward</summary>' +
              '<div style="margin-top:8px;background:rgba(0,0,0,0.2);border-radius:8px;padding:8px">' +
                this.REWARD_TABLE.slice().reverse().map(function(r) {
                  return '<div style="display:flex;justify-content:space-between;padding:3px 0">' +
                    '<span>' + r.label + '</span>' +
                    '<span style="opacity:0.8">' + r.weight + '%</span>' +
                  '</div>';
                }).join('') +
              '</div>' +
            '</details>' +
          '</div>' +
        '</div>';
      
      return html;
    },
    
    // ============================================
    // HANDLE KLIK
    // ============================================
    handleClick: async function() {
      var btn = document.getElementById('ads-reward-btn');
      if (btn) {
        btn.disabled = true;
        btn.textContent = '⏳ Membuka iklan...';
      }
      
      // Haptic + sound
      if (typeof UI !== 'undefined') {
        if (UI.haptic) UI.haptic(20);
        if (UI.sound) UI.sound('click');
      }
      
      var result = await this.clickAd();
      
      // Render ulang UI
      this.updateUI();
      
      if (result.success) {
        this.showRewardPopup(result);
      } else {
        // Tampilkan error
        if (typeof Animate !== 'undefined') {
          Animate.toast('❌ ' + result.message, 'error');
        } else {
          alert(result.message);
        }
      }
    },
    
    // ============================================
    // UPDATE UI (tanpa re-render full)
    // ============================================
    updateUI: function() {
      var container = document.getElementById('ads-reward-container');
      if (container) {
        container.innerHTML = this.renderUI();
      }
    },
    
    // ============================================
    // POPUP REWARD
    // ============================================
    showRewardPopup: function(result) {
      var emoji = result.isJackpot ? '🎉' : (result.koin >= 50 ? '💰' : (result.koin >= 10 ? '🎁' : '🪙'));
      var title = result.isJackpot ? 'JACKPOT!' : 'SELAMAT!';
      
      var modal = document.createElement('div');
      modal.className = 'ads-reward-modal';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(12px);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn 0.3s ease';
      
      modal.innerHTML = 
        '<div style="' +
          'background:linear-gradient(135deg,' + (result.isJackpot ? '#fbbf24,#f59e0b,#fbbf24' : '#58cc02,#89e219') + ');' +
          'background-size:200% 200%;' +
          'animation:' + (result.isJackpot ? 'shimmerGold 2s infinite, ' : '') + 'popIn 0.5s cubic-bezier(0.68,-0.55,0.265,1.55);' +
          'border-radius:28px;' +
          'padding:40px 32px;' +
          'text-align:center;' +
          'max-width:360px;' +
          'width:100%;' +
          'color:white;' +
          'box-shadow:0 24px 80px rgba(0,0,0,0.4);' +
        '">' +
          '<div style="font-size:80px;margin-bottom:16px;animation:bounceIn 0.6s ease">' + emoji + '</div>' +
          '<div style="font-size:20px;font-weight:900;margin-bottom:8px">' + title + '</div>' +
          '<div style="font-size:56px;font-weight:900;line-height:1;margin-bottom:12px">+' + result.koin + '</div>' +
          '<div style="font-size:14px;font-weight:700;opacity:0.95;margin-bottom:20px">' +
            'koin (Rp ' + result.rupiah.toFixed(2) + ')' +
          '</div>' +
          '<button onclick="this.closest('.ads-reward-modal').remove()" ' +
            'style="' +
              'padding:14px 40px;' +
              'background:white;' +
              'color:' + (result.isJackpot ? '#b45309' : '#46a302') + ';' +
              'border:none;' +
              'border-radius:999px;' +
              'font-family:inherit;' +
              'font-size:15px;' +
              'font-weight:900;' +
              'cursor:pointer;' +
              'box-shadow:0 4px 16px rgba(0,0,0,0.15);' +
            '">Lanjut 🎉</button>' +
        '</div>';
      
      document.body.appendChild(modal);
      
      // Confetti untuk jackpot
      if (result.isJackpot && typeof UI !== 'undefined' && UI.confetti) {
        UI.confetti();
      }
      if (typeof Animate !== 'undefined' && Animate.confetti && result.koin >= 50) {
        Animate.confetti();
      }
      
      // Sound & haptic
      if (typeof UI !== 'undefined') {
        if (UI.haptic) UI.haptic([50, 30, 50]);
        if (UI.sound) UI.sound(result.isJackpot ? 'achievement' : 'coin');
      }
    },
    
    // ============================================
    // INIT — Inject UI ke halaman
    // ============================================
    init: function() {
      console.log('[AdsReward] Init...');
      
      var self = this;
      
      // Cari tempat inject UI
      function injectUI() {
        // Prioritas: setelah .page-header di halaman aktif
        var activePage = document.querySelector('.tab-page.active');
        if (!activePage) {
          setTimeout(injectUI, 500);
          return;
        }
        
        var existing = document.getElementById('ads-reward-container');
        if (existing) return;
        
        var container = document.createElement('div');
        container.id = 'ads-reward-container';
        
        // Cari anchor: page-header
        var header = activePage.querySelector('.page-header');
        if (header && header.nextSibling) {
          activePage.insertBefore(container, header.nextSibling);
        } else {
          activePage.insertBefore(container, activePage.firstChild);
        }
        
        container.innerHTML = self.renderUI();
        console.log('[AdsReward] UI injected');
      }
      
      setTimeout(injectUI, 1000);
      
      // Update UI setiap 1 detik (untuk cooldown countdown)
      setInterval(function() {
        var check = self.canClick();
        var btn = document.getElementById('ads-reward-btn');
        if (!btn) return;
        
        if (check.reason === 'cooldown') {
          btn.disabled = true;
          btn.textContent = '⏱️ Tunggu ' + check.remain + 's';
          btn.style.background = '#94a3b8';
          btn.style.boxShadow = '0 4px 0 #64748b';
          btn.style.cursor = 'not-allowed';
        } else if (check.reason === 'limit_harian') {
          btn.disabled = true;
          btn.textContent = '✅ Limit Harian Tercapai';
          btn.style.background = '#94a3b8';
          btn.style.boxShadow = '0 4px 0 #64748b';
          btn.style.cursor = 'not-allowed';
        } else {
          btn.disabled = false;
          btn.textContent = '🎬 KLIK IKLAN DAPAT KOIN';
          btn.style.background = 'linear-gradient(135deg,#fbbf24,#f59e0b)';
          btn.style.boxShadow = '0 4px 0 #b45309';
          btn.style.cursor = 'pointer';
        }
      }, 1000);
      
      console.log('[AdsReward] Ready');
    },
  };

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(function() { window.AdsReward.init(); }, 1500);
    });
  } else {
    setTimeout(function() { window.AdsReward.init(); }, 1500);
  }

  console.log('[AdsReward] Loaded');
})();
