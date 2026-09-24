// ============================
// STICKMAN ANIMATION — 5+ karakter
// Aksi: bertarung, makan, minum, menari, push-up
// ============================

function initStickman(canvasId){
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width = canvas.offsetWidth;
  let H = canvas.height = canvas.offsetHeight;
  let t = 0;

  const stickmen = [
    { x: 0.10, phase: 0, color:'#00e5ff', action:'fight' },
    { x: 0.30, phase: 1, color:'#ff4081', action:'drink' },
    { x: 0.50, phase: 2, color:'#ffd54f', action:'eat' },
    { x: 0.70, phase: 3, color:'#7c4dff', action:'dance' },
    { x: 0.90, phase: 4, color:'#00ff88', action:'pushup' }
  ];

  function resize(){
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize);

  function drawGround(){
    const g = ctx.createLinearGradient(0, H*0.75, 0, H);
    g.addColorStop(0, 'rgba(0,229,255,.05)');
    g.addColorStop(1, 'rgba(124,77,255,.15)');
    ctx.fillStyle = g;
    ctx.fillRect(0, H*0.75, W, H*0.25);

    // Garis horizon
    ctx.strokeStyle = 'rgba(0,229,255,.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, H*0.75);
    ctx.lineTo(W, H*0.75);
    ctx.stroke();
  }

  function drawStickman(sm, progress){
    const cx = W * sm.x;
    const baseY = H * 0.75;
    const d = Math.min(W, H) / 60;
    const headR = 8 * d;
    const headY = baseY - 42 * d;
    const bodyTop = headY + headR;
    const bodyBot = baseY - 15 * d;
    const swing = Math.sin(progress * Math.PI * 2) * 14 * d;

    ctx.save();
    ctx.strokeStyle = sm.color;
    ctx.fillStyle = sm.color;
    ctx.lineWidth = 3.5 * d;
    ctx.lineCap = 'round';
    ctx.shadowBlur = 15;
    ctx.shadowColor = sm.color;

    // Kepala
    ctx.beginPath();
    ctx.arc(cx, headY, headR, 0, Math.PI * 2);
    ctx.fill();

    // Badan
    ctx.beginPath();
    ctx.moveTo(cx, bodyTop);
    ctx.lineTo(cx, bodyBot);
    ctx.stroke();

    const armY = headY + headR + 8 * d;

    switch(sm.action){
      case 'fight':
        // Lengan pukul-pukulan
        ctx.beginPath();
        ctx.moveTo(cx, armY);
        ctx.lineTo(cx - 22*d, armY - swing*0.5);
        ctx.moveTo(cx, armY);
        ctx.lineTo(cx + 22*d, armY + swing*0.5);
        ctx.stroke();
        // Kaki
        ctx.beginPath();
        ctx.moveTo(cx, bodyBot);
        ctx.lineTo(cx - 12*d, baseY);
        ctx.moveTo(cx, bodyBot);
        ctx.lineTo(cx + 12*d, baseY);
        ctx.stroke();
        // Efek tabrakan
        if (Math.abs(swing) > 10*d) {
          ctx.beginPath();
          ctx.arc(cx + 24*d, armY, 3*d, 0, Math.PI*2);
          ctx.fillStyle = '#fff';
          ctx.fill();
        }
        break;

      case 'drink':
        // Lengan pegang gelas
        ctx.beginPath();
        ctx.moveTo(cx, armY);
        ctx.lineTo(cx - 10*d, armY + 12*d);
        ctx.moveTo(cx, armY);
        ctx.lineTo(cx + 14*d, armY - 8*d + swing*0.3);
        ctx.stroke();
        // Kaki
        ctx.beginPath();
        ctx.moveTo(cx, bodyBot);
        ctx.lineTo(cx - 10*d, baseY);
        ctx.moveTo(cx, bodyBot);
        ctx.lineTo(cx + 10*d, baseY);
        ctx.stroke();
        // Gelas
        ctx.fillStyle = '#00e5ff';
        ctx.fillRect(cx + 14*d - 4*d, armY - 10*d + swing*0.3, 8*d, 12*d);
        // Cairan bergerak
        ctx.fillStyle = '#ffd54f';
        const liquidH = 6 * d + Math.abs(swing) * 0.2;
        ctx.fillRect(cx + 14*d - 3*d, armY - 10*d + swing*0.3 + (12*d - liquidH), 6*d, liquidH);
        break;

      case 'eat':
        // Lengan ke mulut
        ctx.beginPath();
        ctx.moveTo(cx, armY);
        ctx.lineTo(cx - 8*d, armY + 14*d);
        ctx.moveTo(cx, armY);
        ctx.lineTo(cx + 10*d, headY + 4*d + swing*0.3);
        ctx.stroke();
        // Kaki
        ctx.beginPath();
        ctx.moveTo(cx, bodyBot);
        ctx.lineTo(cx - 9*d, baseY);
        ctx.moveTo(cx, bodyBot);
        ctx.lineTo(cx + 9*d, baseY);
        ctx.stroke();
        // Makanan (donat)
        ctx.beginPath();
        ctx.arc(cx + 12*d, headY + 4*d + swing*0.3, 5*d, 0, Math.PI*2);
        ctx.fillStyle = '#ffd54f';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + 12*d, headY + 4*d + swing*0.3, 2*d, 0, Math.PI*2);
        ctx.fillStyle = '#7c4dff';
        ctx.fill();
        break;

      case 'dance':
        // Lengan menari
        ctx.beginPath();
        ctx.moveTo(cx, armY);
        ctx.lineTo(cx - 18*d, armY - 14*d + swing*0.8);
        ctx.moveTo(cx, armY);
        ctx.lineTo(cx + 18*d, armY - 14*d - swing*0.8);
        ctx.stroke();
        // Kaki menari
        ctx.beginPath();
        ctx.moveTo(cx, bodyBot);
        ctx.lineTo(cx - 14*d + swing*0.5, baseY);
        ctx.moveTo(cx, bodyBot);
        ctx.lineTo(cx + 14*d - swing*0.5, baseY);
        ctx.stroke();
        // Not musik
        if (Math.floor(progress * 8) % 2 === 0) {
          ctx.fillStyle = '#ff4081';
          ctx.font = (10*d) + 'px Arial';
          ctx.fillText('♪', cx + 20*d, headY - 8*d);
          ctx.fillText('♫', cx - 20*d, headY - 12*d);
        }
        break;

      case 'pushup':
        // Tubuh horizontal
        ctx.beginPath();
        ctx.moveTo(cx - 18*d, baseY - 3*d);
        ctx.lineTo(cx + 18*d, baseY - 3*d);
        ctx.stroke();
        // Kepala di ujung
        ctx.beginPath();
        ctx.arc(cx + 18*d, baseY - 3*d, headR, 0, Math.PI*2);
        ctx.fill();
        // Lengan naik turun
        const lift = Math.abs(swing) * 0.3;
        ctx.beginPath();
        ctx.moveTo(cx - 8*d, baseY - 3*d);
        ctx.lineTo(cx - 8*d, baseY + 8*d - lift);
        ctx.moveTo(cx + 4*d, baseY - 3*d);
        ctx.lineTo(cx + 4*d, baseY + 8*d - lift);
        ctx.stroke();
        // Efek keringat
        if (lift > 2*d) {
          ctx.beginPath();
          ctx.arc(cx + 20*d, baseY - 10*d, 1.5*d, 0, Math.PI*2);
          ctx.fillStyle = '#00e5ff';
          ctx.fill();
        }
        break;
    }

    ctx.restore();
  }

  function loop(){
    t += 0.04;
    ctx.clearRect(0, 0, W, H);
    drawGround();
    stickmen.forEach((sm, i) => {
      const progress = (t + i * 0.7) % 1;
      drawStickman(sm, progress);
    });
    requestAnimationFrame(loop);
  }

  loop();
}

// Auto-init untuk semua canvas
document.addEventListener('DOMContentLoaded', () => {
  ['heroCanvas', 'menuCanvas'].forEach(id => {
    if (document.getElementById(id)) initStickman(id);
  });
});
