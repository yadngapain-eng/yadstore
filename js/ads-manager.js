/* ============================================
   YADSTORE — ADS MANAGER
   Rotasi Adsterra + Monetag tiap 1 menit
   Auto-fallback kalau gagal
   ============================================ */

const AdsManager = {
  // ============================================
  // AD NETWORKS CONFIG
  // ============================================
  NETWORKS: {
    adsterra: {
      name: 'Adsterra',
      enabled: true,
      priority: 1,  // ROTASI: 1 = prioritas pertama

      // Popunder tag
      popunder: '<script src="https://pl31468159.profitableratecpmnetwork.com/43/b7/10/43b7103677aebe9ac1a73fef2f093d8e.js"></script>',

      // Social Bar (native ads)
      socialbar: '<script src="https://pl31468161.profitableratecpmnetwork.com/5a/74/05/5a7405d3227ef77d3f28c27fb6024aa6.js"></script>',

      // Direct link
      directLink: 'https://www.profitableratecpmnetwork.com/hs7rgc2qv?key=ee5218af9bd180dc813a71fe59ddb5dd',
    },

    monetag: {
      name: 'Monetag',
      enabled: true,
      priority: 2,

      SW_DOMAIN: '5gvci.com',
      zones: {
        push: 11893259,
        vignette: 11893258,
        inpage: 11893257,
        popunder: 11893256,
      },
    },
  },

  // ============================================
  // STATE
  // ============================================
  currentNetwork: 'adsterra',
  lastRotation: 0,
  ROTATION_INTERVAL: 60 * 1000, // 1 menit
  failedNetworks: {},
  adHistory: [],

  // ============================================
  // INIT
  // ============================================
  init() {
    console.log('[AdsManager] Initializing...');

    // Rotasi otomatis tiap 1 menit
    setInterval(() => this.rotate(), this.ROTATION_INTERVAL);

    // Load network pertama
    this.loadNetwork(this.currentNetwork);

    console.log('[AdsManager] Ready. Current:', this.currentNetwork);
  },

  // ============================================
  // ROTASI NETWORK
  // ============================================
  rotate() {
    const networks = Object.keys(this.NETWORKS).filter(k => this.NETWORKS[k].enabled);
    if (networks.length < 2) return;

    const currentIdx = networks.indexOf(this.currentNetwork);
    const nextIdx = (currentIdx + 1) % networks.length;
    const nextNetwork = networks[nextIdx];

    console.log('[AdsManager] Rotating:', this.currentNetwork, '→', nextNetwork);

    this.currentNetwork = nextNetwork;
    this.lastRotation = Date.now();

    // Load network baru
    this.loadNetwork(nextNetwork);

    // Dispatch event untuk update UI
    window.dispatchEvent(new CustomEvent('adsManagerRotated', {
      detail: { network: nextNetwork }
    }));
  },

  // ============================================
  // LOAD NETWORK
  // ============================================
  loadNetwork(networkKey) {
    const net = this.NETWORKS[networkKey];
    if (!net || !net.enabled) return;

    console.log('[AdsManager] Loading:', networkKey);

    try {
      if (networkKey === 'adsterra') this.loadAdsterra(net);
      else if (networkKey === 'monetag') this.loadMonetag(net);
    } catch (e) {
      console.warn('[AdsManager] Load error:', e);
      this.markFailed(networkKey);
      this.fallbackToNext(networkKey);
    }
  },

  // ============================================
  // ADSTERRA LOADER
  // ============================================
  loadAdsterra(net) {
    // Inject popunder tag
    this.injectHtml(net.popunder, 'adsterra-popunder')
      .then(ok => {
        if (ok) {
          console.log('[AdsManager] Adsterra popunder OK');
          this.markSuccess('adsterra');
        } else {
          console.warn('[AdsManager] Adsterra popunder FAILED');
          this.markFailed('adsterra');
          this.fallbackToNext('adsterra');
        }
      });

    // Inject socialbar (async, tidak block)
    setTimeout(() => {
      this.injectHtml(net.socialbar, 'adsterra-socialbar');
    }, 2000);
  },

  // ============================================
  // MONETAG LOADER
  // ============================================
  loadMonetag(net) {
    const domain = net.SW_DOMAIN;
    const z = net.zones;

    // SW
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(e => {
        console.warn('[AdsManager] Monetag SW fail:', e.message);
      });
    }

    // Vignette
    this.injectScript('https://' + domain + '/act/files/tag.min.js?z=' + z.vignette, 'monetag-vignette')
      .then(ok => {
        if (ok) {
          console.log('[AdsManager] Monetag OK');
          this.markSuccess('monetag');
        } else {
          console.warn('[AdsManager] Monetag FAILED');
          this.markFailed('monetag');
          this.fallbackToNext('monetag');
        }
      });
  },

  // ============================================
  // FALLBACK — pindah ke network lain kalau gagal
  // ============================================
  fallbackToNext(failedNetwork) {
    const networks = Object.keys(this.NETWORKS).filter(k => 
      this.NETWORKS[k].enabled && k !== failedNetwork
    );

    if (networks.length === 0) {
      console.warn('[AdsManager] No fallback available');
      return;
    }

    // Pilih network pertama yang belum gagal
    for (const net of networks) {
      if (!this.failedNetworks[net] || Date.now() - this.failedNetworks[net] > 5 * 60 * 1000) {
        console.log('[AdsManager] Fallback to:', net);
        this.currentNetwork = net;
        this.loadNetwork(net);
        return;
      }
    }
  },

  // ============================================
  // HELPERS
  // ============================================
  injectScript(src, id) {
    return new Promise((resolve) => {
      // Cek kalau sudah ada
      if (id && document.getElementById(id)) {
        resolve(true);
        return;
      }

      try {
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.setAttribute('data-cfasync', 'false');
        if (id) s.id = id;

        let resolved = false;
        s.onload = () => {
          if (resolved) return;
          resolved = true;
          resolve(true);
        };
        s.onerror = () => {
          if (resolved) return;
          resolved = true;
          console.warn('[AdsManager] Script error:', src);
          resolve(false);
        };

        // Timeout fallback
        setTimeout(() => {
          if (resolved) return;
          resolved = true;
          resolve(true); // anggap OK kalau timeout (mungkin diblok silent)
        }, 5000);

        document.head.appendChild(s);
      } catch (e) {
        console.warn('[AdsManager] injectScript error:', e);
        resolve(false);
      }
    });
  },

  injectHtml(html, id) {
    return new Promise((resolve) => {
      try {
        const container = document.createElement('div');
        container.id = id;
        container.style.display = 'none';
        container.innerHTML = html;
        document.body.appendChild(container);

        // Check if script tag exists
        const script = container.querySelector('script');
        if (!script) {
          resolve(false);
          return;
        }

        // Extract src dan load manual
        const src = script.getAttribute('src');
        if (src) {
          this.injectScript(src, id + '-script').then(resolve);
        } else {
          resolve(true);
        }
      } catch (e) {
        console.warn('[AdsManager] injectHtml error:', e);
        resolve(false);
      }
    });
  },

  // ============================================
  // STATE MANAGEMENT
  // ============================================
  markSuccess(network) {
    delete this.failedNetworks[network];
    this.adHistory.push({
      network: network,
      status: 'success',
      date: new Date().toISOString(),
    });
    this.trimHistory();
  },

  markFailed(network) {
    this.failedNetworks[network] = Date.now();
    this.adHistory.push({
      network: network,
      status: 'failed',
      date: new Date().toISOString(),
    });
    this.trimHistory();
  },

  trimHistory() {
    if (this.adHistory.length > 50) {
      this.adHistory = this.adHistory.slice(-50);
    }
  },

  // ============================================
  // GET ACTIVE NETWORK
  // ============================================
  getActiveNetwork() {
    return this.currentNetwork;
  },

  getStats() {
    return {
      current: this.currentNetwork,
      lastRotation: this.lastRotation,
      nextRotationIn: Math.max(0, this.ROTATION_INTERVAL - (Date.now() - this.lastRotation)),
      history: this.adHistory.slice(-10),
    };
  },
};

// Auto-init
if (typeof window !== 'undefined') {
  window.AdsManager = AdsManager;

  // Init LANGSUNG (tidak tunggu DOM)
  try {
    AdsManager.init();
    console.log('[ads-manager] Init immediately');
  } catch (e) {
    console.warn('[ads-manager] Init error:', e);
  }

  console.log('[ads-manager] loaded');
}
