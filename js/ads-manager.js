/* ============================================
   YADSTORE — ADS MANAGER v6
   Smartlink Rewarded System
   ============================================ */

window.AdsManager = {
  SMARTLINKS: {
    adsterra: {
      name: 'Adsterra',
      url: 'https://www.profitableratecpmnetwork.com/hs7rgc2qv?key=ee5218af9bd180dc813a71fe59ddb5dd',
      enabled: true,
    },
  },

  currentSmartlink: 'adsterra',
  lastOpen: 0,
  OPEN_INTERVAL: 30 * 1000,

  init() {
    console.log('[AdsManager] v6 Smartlink');

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('[AdsManager] SW OK'))
        .catch(e => console.warn('[AdsManager] SW fail:', e.message));
    }

    console.log('[AdsManager] Ready. Smartlink:', this.currentSmartlink);
  },

  async openRewarded() {
    const sl = this.SMARTLINKS[this.currentSmartlink];
    if (!sl || !sl.enabled) {
      console.warn('[AdsManager] No smartlink');
      return { success: false, reason: 'no_smartlink' };
    }

    const now = Date.now();
    if (now - this.lastOpen < this.OPEN_INTERVAL) {
      const remain = Math.ceil((this.OPEN_INTERVAL - (now - this.lastOpen)) / 1000);
      return { success: false, reason: 'cooldown', remain: remain };
    }

    console.log('[AdsManager] Opening smartlink:', sl.name);

    let popup = null;
    try {
      popup = window.open(sl.url, '_blank', 'width=800,height=600,noopener,noreferrer');
    } catch (e) {
      console.warn('[AdsManager] popup error:', e);
    }

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      console.log('[AdsManager] Popup blocked, direct navigation');
      try {
        sessionStorage.setItem('yadstore_ad_pending', Date.now().toString());
        window.location.href = sl.url;
        return { success: true, method: 'redirect' };
      } catch (e) {
        return { success: false, reason: 'popup_blocked' };
      }
    }

    console.log('[AdsManager] Popup opened');
    this.lastOpen = Date.now();
    return { success: true, method: 'popup' };
  },

  getSmartlinkUrl() {
    const sl = this.SMARTLINKS[this.currentSmartlink];
    return sl ? sl.url : null;
  },

  getActiveNetwork() {
    return this.currentSmartlink;
  },
};

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.AdsManager.init());
  } else {
    setTimeout(() => window.AdsManager.init(), 300);
  }
}
console.log('[ads-manager] v6 smartlink loaded');
