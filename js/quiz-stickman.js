// ============================
// QUIZ STICKMAN ANIMATION
// Stickman bergerak sesuai state quiz:
// - thinking: mikir (tangan di dagu, kepala miring)
// - happy: lompat-lompat pas jawab benar
// - sad: duduk nunduk pas jawab salah
// ============================

let quizCanvas, quizCtx, quizState = 'thinking', quizAnimT = 0, quizAnimFrame;

function initQuizStickman(){
  quizCanvas = document.getElementById('quizStickman');
  if (!quizCanvas) return;
  quizCtx = quizCanvas.getContext('2d');
  quizCanvas.width = quizCanvas.offsetWidth;
  quizCanvas.height = quizCanvas.offsetHeight;
  cancelAnimationFrame(quizAnimFrame);
  loopQuizStickman();
}

function loopQuizStickman(){
  if (!quizCtx) return;
  const W = quizCanvas.width;
  const H = quizCanvas.height;
  quizAnimT += 0.05;
  quizCtx.clearRect(0, 0, W, H);

  // Background glow
  const g = quizCtx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W/2);
  if (quizState === 'happy') {
    g.addColorStop(0, 'rgba(76,175,80,.15)');
    g.addColorStop(1, 'transparent');
  } else if (quizState === 'sad') {
    g.addColorStop(0, 'rgba(244,67,54,.15)');
    g.addColorStop(1, 'transparent');
  } else {
    g.addColorStop(0, 'rgba(0,229,255,.1)');
    g.addColorStop(1, 'transparent');
  }
  quizCtx.fillStyle = g;
  quizCtx.fillRect(0, 0, W, H);

  drawQuizStickman(W, H);
  quizAnimFrame = requestAnimationFrame(loopQuizStickman);
}

function drawQuizStickman(W, H){
  const cx = W / 2;
  const baseY = H * 0.85;
  const d = Math.min(W, H) / 40;
  const headR = 8 * d;
  let headY = baseY - 42 * d;
  let bodyTop = headY + headR;
  let bodyBot = baseY - 15 * d;

  const color = quizState === 'happy' ? '#4caf50'
              : quizState === 'sad' ? '#f44336'
              : '#00e5ff';

  quizCtx.save();
  quizCtx.strokeStyle = color;
  quizCtx.fillStyle = color;
  quizCtx.lineWidth = 3.5 * d;
  quizCtx.lineCap = 'round';
  quizCtx.shadowBlur = 15;
  quizCtx.shadowColor = color;

  let armAngleL = 0, armAngleR = 0, legAngleL = 0, legAngleR = 0;
  let headTilt = 0, bodyBob = 0;

  // ==== ANIMASI BERDASARKAN STATE ====
  if (quizState === 'thinking') {
    // Kepala miring, tangan di dagu
    headTilt = Math.sin(quizAnimT * 1.5) * 0.15;
    armAngleL = -Math.PI * 0.7 + Math.sin(quizAnimT * 2) * 0.1;
    armAngleR = Math.PI * 0.3 + Math.sin(quizAnimT * 2) * 0.1;
    // Kaki diam
    bodyBob = Math.sin(quizAnimT * 2) * 2;
    // Tanda tanya berkedip
    if (Math.sin(quizAnimT * 3) > 0.3) {
      quizCtx.font = (12*d) + 'px Arial';
      quizCtx.fillText('?', cx + 20*d, headY - 12*d);
    }
  } else if (quizState === 'happy') {
    // Lompat-lompat
    bodyBob = -Math.abs(Math.sin(quizAnimT * 3)) * 12 * d;
    headY += bodyBob;
    bodyTop = headY + headR;
    bodyBot = baseY - 15 * d + bodyBob;
    // Tangan ke atas
    armAngleL = -Math.PI * 0.5 + Math.sin(quizAnimT * 4) * 0.3;
    armAngleR = Math.PI * 1.5 - Math.sin(quizAnimT * 4) * 0.3;
    // Kaki terbuka
    legAngleL = -0.3 + Math.sin(quizAnimT * 3) * 0.2;
    legAngleR = 0.3 - Math.sin(quizAnimT * 3) * 0.2;
    // Bintang
    quizCtx.fillStyle = '#ffd54f';
    for (let i = 0; i < 3; i++) {
      const angle = quizAnimT * 2 + i * Math.PI * 2 / 3;
      const sx = cx + Math.cos(angle) * 40 * d;
      const sy = headY - 20 * d + Math.sin(angle) * 10 * d;
      drawStar(sx, sy, 4*d, 6*d);
    }
    quizCtx.fillStyle = color;
  } else if (quizState === 'sad') {
    // Duduk nunduk
    headTilt = 0.3;
    bodyBob = 6 * d;
    headY += bodyBob;
    bodyTop = headY + headR;
    bodyBot = baseY - 5 * d;
    // Tangan di lutut
    armAngleL = Math.PI * 0.6;
    armAngleR = Math.PI * 0.4;
    // Kaki ditekuk
    legAngleL = -0.5;
    legAngleR = 0.5;
    // Air mata
    const tearY = headY + headR + 4*d + (quizAnimT * 8 % (8*d));
    quizCtx.fillStyle = '#4fc3f7';
    quizCtx.beginPath();
    quizCtx.arc(cx - 5*d, tearY, 1.8*d, 0, Math.PI*2);
    quizCtx.fill();
    quizCtx.beginPath();
    quizCtx.arc(cx + 5*d, tearY + 2*d, 1.5*d, 0, Math.PI*2);
    quizCtx.fill();
    quizCtx.fillStyle = color;
  }

  // Gambar kepala (dengan rotasi)
  quizCtx.save();
  quizCtx.translate(cx, headY);
  quizCtx.rotate(headTilt);
  quizCtx.beginPath();
  quizCtx.arc(0, 0, headR, 0, Math.PI * 2);
  quizCtx.fill();
  // Mata
  quizCtx.fillStyle = '#0a0e27';
  if (quizState === 'happy') {
    // Mata ^ ^ (senang)
    quizCtx.strokeStyle = '#0a0e27';
    quizCtx.lineWidth = 2*d;
    quizCtx.beginPath();
    quizCtx.moveTo(-4*d, -2*d); quizCtx.lineTo(-2*d, -4*d); quizCtx.lineTo(0, -2*d);
    quizCtx.moveTo(0, -2*d); quizCtx.lineTo(2*d, -4*d); quizCtx.lineTo(4*d, -2*d);
    quizCtx.stroke();
  } else if (quizState === 'sad') {
    // Mata turun
    quizCtx.beginPath();
    quizCtx.arc(-3*d, 0, 1.2*d, 0, Math.PI*2);
    quizCtx.arc(3*d, 0, 1.2*d, 0, Math.PI*2);
    quizCtx.fill();
    // Mulut sedih
    quizCtx.strokeStyle = '#0a0e27';
    quizCtx.lineWidth = 1.5*d;
    quizCtx.beginPath();
    quizCtx.arc(0, 4*d, 2.5*d, Math.PI, 0, true);
    quizCtx.stroke();
  } else {
    // Mata berpikir
    quizCtx.beginPath();
    quizCtx.arc(-3*d, -1*d, 1.5*d, 0, Math.PI*2);
    quizCtx.arc(3*d, -1*d, 1.5*d, 0, Math.PI*2);
    quizCtx.fill();
  }
  quizCtx.restore();
  quizCtx.fillStyle = color;

  // Badan
  quizCtx.beginPath();
  quizCtx.moveTo(cx, bodyTop);
  quizCtx.lineTo(cx, bodyBot);
  quizCtx.stroke();

  // Tangan kiri & kanan (pakai angle)
  const armLen = 20 * d;
  quizCtx.beginPath();
  quizCtx.moveTo(cx, bodyTop + 8*d);
  quizCtx.lineTo(cx + Math.cos(armAngleL) * armLen, bodyTop + 8*d + Math.sin(armAngleL) * armLen);
  quizCtx.moveTo(cx, bodyTop + 8*d);
  quizCtx.lineTo(cx + Math.cos(armAngleR) * armLen, bodyTop + 8*d + Math.sin(armAngleR) * armLen);
  quizCtx.stroke();

  // Kaki
  const legLen = 18 * d;
  quizCtx.beginPath();
  quizCtx.moveTo(cx, bodyBot);
  quizCtx.lineTo(cx + Math.cos(Math.PI/2 + legAngleL) * legLen, bodyBot + Math.sin(Math.PI/2 + legAngleL) * legLen);
  quizCtx.moveTo(cx, bodyBot);
  quizCtx.lineTo(cx + Math.cos(Math.PI/2 + legAngleR) * legLen, bodyBot + Math.sin(Math.PI/2 + legAngleR) * legLen);
  quizCtx.stroke();

  quizCtx.restore();
}

function drawStar(cx, cy, innerR, outerR){
  quizCtx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) quizCtx.moveTo(x, y);
    else quizCtx.lineTo(x, y);
  }
  quizCtx.closePath();
  quizCtx.fill();
}

function setQuizState(state){
  quizState = state;
  quizAnimT = 0;
}

// Ekspos ke global
window.setQuizState = setQuizState;
window.initQuizStickman = initQuizStickman;
