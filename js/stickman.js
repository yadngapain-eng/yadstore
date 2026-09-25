/* ============================================
   YADSTORE — Stickman Animation v3
   - 5 karakter dengan aksi berbeda
   - Head bobbing + body sway
   - Blinking eyes
   - Squash & stretch
   - Particle trail
   - Smooth transitions
   ============================================ */

function initStickman(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = canvas.width = canvas.offsetWidth * 2;
  let H = canvas.height = canvas.offsetHeight * 2;
  canvas.style.width = canvas.offsetWidth + 'px';
  canvas.style.height = canvas.offsetHeight + 'px';
  ctx.scale(2, 2);
  let VW = canvas.offsetWidth;
  let VH = canvas.offsetHeight;

  let t = 0;

  const stickmen = [
    { x: 0.10, phase: 0, color: '#00e5ff', action: 'fight' },
    { x: 0.30, phase: 1, color: '#ff4081', action: 'drink' },
    { x: 0.50, phase: 2, color: '#ffd54f', action: 'eat' },
    { x: 0.70, phase: 3, color: '#7c4dff', action: 'dance' },
    { x: 0.90, phase: 4, color: '#00ff88', action: 'pushup' },
  ];

  // Trail particles
  const trails = [];

  function resize() {
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    VW = canvas.offsetWidth;
    VH = canvas.offsetHeight;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(2, 2);
  }
  window.addEventListener('resize', resize);

  function drawGround() {
    const baseY = VH * 0.75;
    const grad = ctx.createLinearGradient(0, baseY, 0, VH);
    grad.addColorStop(0, 'rgba(0,229,255,.08)');
    grad.addColorStop(0.5, 'rgba(124,77,255,.12)');
    grad.addColorStop(1, 'rgba(255,64,129,.05)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, baseY, VW, VH - baseY);

    // Glowing ground line
    ctx.strokeStyle = 'rgba(0,229,255,.4)';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00e5ff';
    ctx.beginPath();
    ctx.moveTo(0, baseY);
    ctx.lineTo(VW, baseY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Grid pattern
    ctx.strokeStyle = 'rgba(0,229,255,.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < VW; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, baseY);
      ctx.lineTo(i + 20, VH);
      ctx.stroke();
    }
  }

  function drawHead(cx, headY, headR, color, d, blinkPhase, tilt) {
    ctx.save();
    ctx.translate(cx, headY);
    ctx.rotate(tilt);

    // Head glow
    const headGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, headR * 1.8);
    headGrad.addColorStop(0, color);
    headGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = headGrad;
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.arc(0, 0, headR * 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Head
    ctx.fillStyle = color;
    ctx.shadowBlur = 20;
    ctx.shadowColor = color;
    ctx.beginPath();
    ctx.arc(0, 0, headR, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Blinking eyes
    const blink = Math.sin(blinkPhase) > 0.95 ? 0.1 : 1;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(-headR * 0.35, -headR * 0.15, headR * 0.18, headR * 0.22 * blink, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(headR * 0.35, -headR * 0.15, headR * 0.18, headR * 0.22 * blink, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    if (blink > 0.5) {
      ctx.fillStyle = '#0d1228';
      ctx.beginPath();
      ctx.arc(-headR * 0.35, -headR * 0.10, headR * 0.09, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(headR * 0.35, -headR * 0.10, headR * 0.09, 0, Math.PI * 2);
      ctx.fill();
    }

    // Smile
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, headR * 0.15, headR * 0.35, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();

    ctx.restore();
  }

  function drawStickman(sm, progress) {
    const cx = VW * sm.x;
    const baseY = VH * 0.75;
    const d = Math.min(VW, VH) / 60;

    // Head bob & sway
    const bob = Math.sin(progress * Math.PI * 4) * 2 * d;
    const sway = Math.sin(progress * Math.PI * 2) * 1.5 * d;

    // Squash & stretch
    const squash = 1 + Math.sin(progress * Math.PI * 4) * 0.03;

    const headR = 8 * d * squash;
    const headY = baseY - 42 * d + bob;
    const bodyTop = headY + headR;
    const bodyBot = baseY - 15 * d;
    const swing = Math.sin(progress * Math.PI * 2) * 14 * d;

    ctx.save();
    ctx.strokeStyle = sm.color;
    ctx.fillStyle = sm.color;
    ctx.lineWidth = 3.5 * d;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Head
    drawHead(cx + sway, headY, headR, sm.color, d, t * 1.5 + sm.phase * 3, sway * 0.02);

    // Body
    ctx.shadowBlur = 18;
    ctx.shadowColor = sm.color;
    ctx.beginPath();
    ctx.moveTo(cx + sway, bodyTop);
    ctx.quadraticCurveTo(cx + sway * 1.5, (bodyTop + bodyBot) / 2, cx + sway * 0.5, bodyBot);
    ctx.stroke();
    ctx.shadowBlur = 0;

    const armY = headY + headR + 8 * d;

    switch (sm.action) {
      case 'fight': {
        // Arms jabbing
        const jabL = Math.max(0, Math.sin(progress * Math.PI * 4)) * 25 * d;
        const jabR = Math.max(0, -Math.sin(progress * Math.PI * 4)) * 25 * d;
        ctx.beginPath();
        ctx.moveTo(cx + sway, armY);
        ctx.lineTo(cx - 22 * d - jabL, armY - swing * 0.3);
        ctx.moveTo(cx + sway, armY);
        ctx.lineTo(cx + 22 * d + jabR, armY + swing * 0.3);
        ctx.stroke();

        // Fists
        ctx.beginPath();
        ctx.arc(cx - 22 * d - jabL, armY - swing * 0.3, 3.5 * d, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + 22 * d + jabR, armY + swing * 0.3, 3.5 * d, 0, Math.PI * 2);
        ctx.fill();

        // Legs
        ctx.beginPath();
        ctx.moveTo(cx + sway * 0.5, bodyBot);
        ctx.lineTo(cx - 12 * d, baseY);
        ctx.moveTo(cx + sway * 0.5, bodyBot);
        ctx.lineTo(cx + 12 * d, baseY);
        ctx.stroke();

        // Impact star
        if (jabL > 20 * d || jabR > 20 * d) {
          const hitX = jabL > 20 * d ? cx - 25 * d - jabL : cx + 25 * d + jabR;
          const hitY = armY - swing * 0.3;
          ctx.fillStyle = '#ffd54f';
          ctx.shadowBlur = 20;
          ctx.shadowColor = '#ffd54f';
          for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2 + progress * 5;
            const r1 = 3 * d, r2 = 7 * d;
            ctx.beginPath();
            ctx.moveTo(hitX + Math.cos(a) * r1, hitY + Math.sin(a) * r1);
            ctx.lineTo(hitX + Math.cos(a) * r2, hitY + Math.sin(a) * r2);
            ctx.lineTo(hitX + Math.cos(a + 0.3) * r1, hitY + Math.sin(a + 0.3) * r1);
            ctx.fill();
          }
          ctx.shadowBlur = 0;
        }
        break;
      }

      case 'drink': {
        // One arm holding cup, other at side
        ctx.beginPath();
        ctx.moveTo(cx + sway, armY);
        ctx.lineTo(cx - 10 * d, armY + 12 * d);
        ctx.moveTo(cx + sway, armY);
        ctx.lineTo(cx + 14 * d, armY - 8 * d + swing * 0.3);
        ctx.stroke();

        // Cup
        const cupX = cx + 14 * d - 4 * d;
        const cupY = armY - 10 * d + swing * 0.3;
        ctx.fillStyle = '#00e5ff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00e5ff';
        ctx.fillRect(cupX, cupY, 8 * d, 12 * d);
        ctx.shadowBlur = 0;

        // Liquid
        const liquidH = 6 * d + Math.abs(swing) * 0.25;
        ctx.fillStyle = '#ffd54f';
        ctx.fillRect(cupX + 1 * d, cupY + (12 * d - liquidH), 6 * d, liquidH);

        // Legs
        ctx.beginPath();
        ctx.moveTo(cx + sway * 0.5, bodyBot);
        ctx.lineTo(cx - 10 * d, baseY);
        ctx.moveTo(cx + sway * 0.5, bodyBot);
        ctx.lineTo(cx + 10 * d, baseY);
        ctx.stroke();

        // Bubbles
        if (Math.sin(progress * Math.PI * 6) > 0.7) {
          ctx.fillStyle = 'rgba(0,229,255,.6)';
          const bx = cupX + 4 * d + Math.sin(progress * 20) * 3 * d;
          const by = cupY - 5 * d;
          ctx.beginPath();
          ctx.arc(bx, by, 2 * d, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }

      case 'eat': {
        // Arm bringing food to mouth
        const eatPhase = Math.sin(progress * Math.PI * 4);
        const reach = (eatPhase + 1) / 2;
        const handX = cx + sway + 10 * d * (1 - reach) + 4 * d * reach;
        const handY = armY + 14 * d * (1 - reach) + (headY + headR * 0.5) * reach;

        ctx.beginPath();
        ctx.moveTo(cx + sway, armY);
        ctx.lineTo(cx - 8 * d, armY + 14 * d);
        ctx.moveTo(cx + sway, armY);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        // Food (donut)
        ctx.fillStyle = '#ffd54f';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#ffd54f';
        ctx.beginPath();
        ctx.arc(handX + 4 * d, handY, 5 * d, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#7c4dff';
        ctx.beginPath();
        ctx.arc(handX + 4 * d, handY, 2 * d, 0, Math.PI * 2);
        ctx.fill();

        // Legs
        ctx.beginPath();
        ctx.moveTo(cx + sway * 0.5, bodyBot);
        ctx.lineTo(cx - 9 * d, baseY);
        ctx.moveTo(cx + sway * 0.5, bodyBot);
        ctx.lineTo(cx + 9 * d, baseY);
        ctx.stroke();

        // Crumb particles
        if (reach > 0.8) {
          trails.push({
            x: handX, y: handY,
            vx: (Math.random() - 0.5) * 2,
            vy: Math.random() * 1 + 1,
            life: 30, color: '#ffd54f',
            size: 2 * d,
          });
        }
        break;
      }

      case 'dance': {
        const dancePhase = progress * Math.PI * 6;
        const armWave = Math.sin(dancePhase) * 20 * d;
        const hipSway = Math.sin(dancePhase * 0.5) * 8 * d;

        // Arms up, waving
        ctx.beginPath();
        ctx.moveTo(cx + sway, armY);
        ctx.quadraticCurveTo(cx - 10 * d, armY - 10 * d, cx - 18 * d, armY - 22 * d + armWave);
        ctx.moveTo(cx + sway, armY);
        ctx.quadraticCurveTo(cx + 10 * d, armY - 10 * d, cx + 18 * d, armY - 22 * d - armWave);
        ctx.stroke();

        // Hands
        ctx.beginPath();
        ctx.arc(cx - 18 * d, armY - 22 * d + armWave, 3.5 * d, 0, Math.PI * 2);
        ctx.arc(cx + 18 * d, armY - 22 * d - armWave, 3.5 * d, 0, Math.PI * 2);
        ctx.fill();

        // Legs with hip sway
        ctx.beginPath();
        ctx.moveTo(cx + sway * 0.5 + hipSway * 0.3, bodyBot);
        ctx.lineTo(cx - 14 * d + hipSway, baseY);
        ctx.moveTo(cx + sway * 0.5 + hipSway * 0.3, bodyBot);
        ctx.lineTo(cx + 14 * d + hipSway, baseY);
        ctx.stroke();

        // Music notes
        if (Math.floor(progress * 8) % 2 === 0) {
          ctx.fillStyle = '#ff4081';
          ctx.font = 'bold ' + (11 * d) + 'px Arial';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#ff4081';
          const nPhase = (progress * 8) % 2;
          ctx.globalAlpha = 1 - nPhase * 0.5;
          ctx.fillText('♪', cx + 22 * d, headY - 10 * d - nPhase * 8 * d);
          ctx.fillText('♫', cx - 24 * d, headY - 14 * d - (1 - nPhase) * 8 * d);
          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
        }
        break;
      }

      case 'pushup': {
        const pushPhase = Math.abs(Math.sin(progress * Math.PI * 4));
        const lift = pushPhase * 10 * d;

        // Ground line for pushup
        ctx.beginPath();
        ctx.moveTo(cx - 18 * d, baseY - 3 * d);
        ctx.lineTo(cx + 18 * d, baseY - 3 * d);
        ctx.stroke();

        // Head at right
        ctx.save();
        ctx.translate(cx + 18 * d, baseY - 3 * d - lift * 0.5);
        ctx.fillStyle = sm.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = sm.color;
        ctx.beginPath();
        ctx.arc(0, 0, 6 * d, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();

        // Arms
        ctx.beginPath();
        ctx.moveTo(cx - 8 * d, baseY - 3 * d);
        ctx.lineTo(cx - 8 * d, baseY + 8 * d - lift);
        ctx.moveTo(cx + 4 * d, baseY - 3 * d);
        ctx.lineTo(cx + 4 * d, baseY + 8 * d - lift);
        ctx.stroke();

        // Sweat drop
        if (pushPhase > 0.9) {
          ctx.fillStyle = '#00e5ff';
          ctx.globalAlpha = 0.8;
          ctx.beginPath();
          ctx.arc(cx + 24 * d, baseY - 12 * d - Math.random() * 3 * d, 1.8 * d, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        break;
      }
    }

    ctx.restore();
  }

  function drawTrails() {
    for (let i = trails.length - 1; i >= 0; i--) {
      const t = trails[i];
      t.x += t.vx;
      t.y += t.vy;
      t.vy += 0.15;
      t.life--;

      ctx.globalAlpha = Math.max(0, t.life / 30);
      ctx.fillStyle = t.color;
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
      ctx.fill();

      if (t.life <= 0) trails.splice(i, 1);
    }
    ctx.globalAlpha = 1;
  }

  function loop() {
    t += 0.018;
    ctx.clearRect(0, 0, VW, VH);
    drawGround();
    stickmen.forEach(function(sm, i) {
      const p = (t + i * 0.35) % 1;
      drawStickman(sm, p);
    });
    drawTrails();
    requestAnimationFrame(loop);
  }
  loop();
}

document.addEventListener('DOMContentLoaded', function() {
  ['heroCanvas', 'menuCanvas'].forEach(function(id) {
    if (document.getElementById(id)) initStickman(id);
  });
});
