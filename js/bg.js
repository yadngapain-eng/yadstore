/* ============================================
   YADSTORE — Background Animation v2
   - Multi-layer parallax
   - Gradient orbs
   - Shooting stars
   - Connection lines
   - Mouse interaction
   ============================================ */

function initBg() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const COLORS = ['#00e5ff', '#7c4dff', '#ff4081', '#ffd54f', '#00ff88'];
  const mouse = { x: W / 2, y: H / 2, active: false };

  // ---------- PARTICLES ----------
  const PARTICLE_COUNT = Math.min(100, Math.floor(W * H / 12000));
  const particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 2.2 + 0.6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.3,
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.03,
    });
  }

  // ---------- GRADIENT ORBS (background blur) ----------
  const orbs = [
    { x: W * 0.15, y: H * 0.20, r: 280, color: 'rgba(0,229,255,.10)', vx: 0.15, vy: 0.10 },
    { x: W * 0.85, y: H * 0.30, r: 320, color: 'rgba(124,77,255,.10)', vx: -0.12, vy: 0.14 },
    { x: W * 0.50, y: H * 0.85, r: 300, color: 'rgba(255,64,129,.08)', vx: 0.10, vy: -0.12 },
  ];

  // ---------- SHOOTING STARS ----------
  const shootingStars = [];
  function spawnShootingStar() {
    if (Math.random() > 0.008) return;
    const startX = Math.random() * W;
    const startY = Math.random() * H * 0.4;
    const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.4;
    const speed = 8 + Math.random() * 6;
    shootingStars.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      len: 80 + Math.random() * 100,
      alpha: 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
  }

  // ---------- RESIZE ----------
  window.addEventListener('resize', function() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  // ---------- MOUSE ----------
  window.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });
  window.addEventListener('mouseleave', function() {
    mouse.active = false;
  });

  // ---------- LOOP ----------
  function loop() {
    ctx.clearRect(0, 0, W, H);

    // Draw gradient orbs
    orbs.forEach(function(o) {
      o.x += o.vx;
      o.y += o.vy;
      if (o.x < -100 || o.x > W + 100) o.vx *= -1;
      if (o.y < -100 || o.y > H + 100) o.vy *= -1;

      const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
      grad.addColorStop(0, o.color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw shooting stars
    spawnShootingStar();
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const s = shootingStars[i];
      s.x += s.vx;
      s.y += s.vy;
      s.alpha -= 0.012;

      ctx.save();
      ctx.globalAlpha = Math.max(0, s.alpha);
      const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * s.len / 8, s.y - s.vy * s.len / 8);
      grad.addColorStop(0, s.color);
      grad.addColorStop(1, 'transparent');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.vx * s.len / 8, s.y - s.vy * s.len / 8);
      ctx.stroke();
      ctx.restore();

      if (s.alpha <= 0 || s.x > W + 100 || s.y > H + 100) {
        shootingStars.splice(i, 1);
      }
    }

    // Draw connection lines (behind particles)
    ctx.globalAlpha = 0.09;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const alpha = (1 - dist / 140) * 0.15;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const grad = ctx.createLinearGradient(
            particles[i].x, particles[i].y,
            particles[j].x, particles[j].y
          );
          grad.addColorStop(0, particles[i].color);
          grad.addColorStop(1, particles[j].color);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    // Draw mouse connection lines
    if (mouse.active) {
      particles.forEach(function(p) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          const alpha = (1 - dist / 180) * 0.4;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
      ctx.globalAlpha = 1;

      // Mouse glow
      const mGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 150);
      mGrad.addColorStop(0, 'rgba(0,229,255,.08)');
      mGrad.addColorStop(1, 'rgba(0,229,255,0)');
      ctx.fillStyle = mGrad;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 150, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw particles with pulse
    particles.forEach(function(p) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      p.pulsePhase += p.pulseSpeed;
      const pulse = 1 + Math.sin(p.pulsePhase) * 0.3;

      // Outer glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha * 0.12;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2);
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    requestAnimationFrame(loop);
  }

  loop();
}

document.addEventListener('DOMContentLoaded', initBg);
