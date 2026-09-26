const Animate = {
  attachRipple() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-primary, .btn-secondary, .game-card, .product-card, .cat-tab, .lesson-card, .payment-card');
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const r = document.createElement('span');
      r.className = 'ripple';
      r.style.left = (e.clientX - rect.left) + 'px';
      r.style.top = (e.clientY - rect.top) + 'px';
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(r);
      setTimeout(() => r.remove(), 600);
    });
  },
  initParticles() {
    const c = document.createElement('canvas');
    c.id = 'bg-particles';
    c.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.4';
    document.body.insertBefore(c, document.body.firstChild);
    const ctx = c.getContext('2d');
    let w, h;
    const parts = [];
    function resize() { w = c.width = window.innerWidth; h = c.height = window.innerHeight; }
    resize(); window.addEventListener('resize', resize);
    const colors = ['#58cc02','#1cb0f6','#ce82ff','#ffc800','#ff4081'];
    for (let i = 0; i < 25; i++) {
      parts.push({ x: Math.random()*w, y: Math.random()*h, r: Math.random()*3+1,
        dx: (Math.random()-0.5)*0.5, dy: (Math.random()-0.5)*0.5,
        c: colors[Math.floor(Math.random()*colors.length)], o: Math.random()*0.4+0.2 });
    }
    function loop() {
      ctx.clearRect(0,0,w,h);
      parts.forEach(p => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > w) p.dx *= -1;
        if (p.y < 0 || p.y > h) p.dy *= -1;
        ctx.globalAlpha = p.o; ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(loop);
    }
    loop();
  },
  confetti() {
    const colors = ['#58cc02','#1cb0f6','#ce82ff','#ffc800','#ff4081'];
    const c = document.createElement('div');
    c.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden';
    document.body.appendChild(c);
    for (let i = 0; i < 60; i++) {
      const e = document.createElement('div');
      e.style.cssText = 'position:absolute;width:'+(Math.random()*10+5)+'px;height:'+(Math.random()*10+5)+'px;background:'+colors[Math.floor(Math.random()*colors.length)]+';left:'+(Math.random()*100)+'%;top:-20px;border-radius:'+(Math.random()>0.5?'50%':'2px')+';animation:confettiFall '+(Math.random()*2+2)+'s linear forwards';
      c.appendChild(e);
    }
    setTimeout(() => c.remove(), 4000);
  },
  toast(msg, type) {
    type = type || 'info';
    const t = document.createElement('div');
    t.className = 'toast toast-' + type;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 50);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2500);
  },
  init() { this.attachRipple(); this.initParticles(); }
};
if (typeof window !== 'undefined') window.Animate = Animate;
