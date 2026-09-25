function initStickman(canvasId){
  const canvas=document.getElementById(canvasId);
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  let W=canvas.width=canvas.offsetWidth,H=canvas.height=canvas.offsetHeight,t=0;
  const stickmen=[
    {x:0.10,phase:0,color:'#00e5ff',action:'fight'},
    {x:0.30,phase:1,color:'#ff4081',action:'drink'},
    {x:0.50,phase:2,color:'#ffd54f',action:'eat'},
    {x:0.70,phase:3,color:'#7c4dff',action:'dance'},
    {x:0.90,phase:4,color:'#00ff88',action:'pushup'}
  ];
  function resize(){W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight}
  window.addEventListener('resize',resize);
  function drawGround(){
    const g=ctx.createLinearGradient(0,H*0.75,0,H);
    g.addColorStop(0,'rgba(0,229,255,.05)');
    g.addColorStop(1,'rgba(124,77,255,.15)');
    ctx.fillStyle=g;ctx.fillRect(0,H*0.75,W,H*0.25);
    ctx.strokeStyle='rgba(0,229,255,.2)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(0,H*0.75);ctx.lineTo(W,H*0.75);ctx.stroke();
  }
  function drawStickman(sm,progress){
    const cx=W*sm.x,baseY=H*0.75,d=Math.min(W,H)/60;
    const headR=8*d,headY=baseY-42*d;
    const bodyTop=headY+headR,bodyBot=baseY-15*d;
    const swing=Math.sin(progress*Math.PI*2)*14*d;
    ctx.save();
    ctx.strokeStyle=sm.color;ctx.fillStyle=sm.color;
    ctx.lineWidth=3.5*d;ctx.lineCap='round';
    ctx.shadowBlur=15;ctx.shadowColor=sm.color;
    ctx.beginPath();ctx.arc(cx,headY,headR,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.moveTo(cx,bodyTop);ctx.lineTo(cx,bodyBot);ctx.stroke();
    const armY=headY+headR+8*d;
    switch(sm.action){
      case'fight':
        ctx.beginPath();
        ctx.moveTo(cx,armY);ctx.lineTo(cx-22*d,armY-swing*0.5);
        ctx.moveTo(cx,armY);ctx.lineTo(cx+22*d,armY+swing*0.5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx,bodyBot);ctx.lineTo(cx-12*d,baseY);
        ctx.moveTo(cx,bodyBot);ctx.lineTo(cx+12*d,baseY);
        ctx.stroke();
        break;
      case'drink':
        ctx.beginPath();
        ctx.moveTo(cx,armY);ctx.lineTo(cx-10*d,armY+12*d);
        ctx.moveTo(cx,armY);ctx.lineTo(cx+14*d,armY-8*d+swing*0.3);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx,bodyBot);ctx.lineTo(cx-10*d,baseY);
        ctx.moveTo(cx,bodyBot);ctx.lineTo(cx+10*d,baseY);
        ctx.stroke();
        ctx.fillStyle='#00e5ff';
        ctx.fillRect(cx+14*d-4*d,armY-10*d+swing*0.3,8*d,12*d);
        break;
      case'eat':
        ctx.beginPath();
        ctx.moveTo(cx,armY);ctx.lineTo(cx-8*d,armY+14*d);
        ctx.moveTo(cx,armY);ctx.lineTo(cx+10*d,headY+4*d+swing*0.3);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx,bodyBot);ctx.lineTo(cx-9*d,baseY);
        ctx.moveTo(cx,bodyBot);ctx.lineTo(cx+9*d,baseY);
        ctx.stroke();
        ctx.beginPath();ctx.arc(cx+12*d,headY+4*d+swing*0.3,5*d,0,Math.PI*2);
        ctx.fillStyle='#ffd54f';ctx.fill();
        break;
      case'dance':
        ctx.beginPath();
        ctx.moveTo(cx,armY);ctx.lineTo(cx-18*d,armY-14*d+swing*0.8);
        ctx.moveTo(cx,armY);ctx.lineTo(cx+18*d,armY-14*d-swing*0.8);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx,bodyBot);ctx.lineTo(cx-14*d+swing*0.5,baseY);
        ctx.moveTo(cx,bodyBot);ctx.lineTo(cx+14*d-swing*0.5,baseY);
        ctx.stroke();
        if(Math.floor(progress*8)%2===0){
          ctx.fillStyle='#ff4081';
          ctx.font=(10*d)+'px Arial';
          ctx.fillText('♪',cx+20*d,headY-8*d);
          ctx.fillText('♫',cx-20*d,headY-12*d);
        }
        break;
      case'pushup':
        ctx.beginPath();
        ctx.moveTo(cx-18*d,baseY-3*d);ctx.lineTo(cx+18*d,baseY-3*d);
        ctx.stroke();
        ctx.beginPath();ctx.arc(cx+18*d,baseY-3*d,headR,0,Math.PI*2);ctx.fill();
        const lift=Math.abs(swing)*0.3;
        ctx.beginPath();
        ctx.moveTo(cx-8*d,baseY-3*d);ctx.lineTo(cx-8*d,baseY+8*d-lift);
        ctx.moveTo(cx+4*d,baseY-3*d);ctx.lineTo(cx+4*d,baseY+8*d-lift);
        ctx.stroke();
        break;
    }
    ctx.restore();
  }
  function loop(){
    t+=0.04;
    ctx.clearRect(0,0,W,H);
    drawGround();
    stickmen.forEach((sm,i)=>{
      const p=(t+i*0.7)%1;
      drawStickman(sm,p);
    });
    requestAnimationFrame(loop);
  }
  loop();
}
document.addEventListener('DOMContentLoaded',()=>{
  ['heroCanvas','menuCanvas'].forEach(id=>{
    if(document.getElementById(id))initStickman(id);
  });
});
