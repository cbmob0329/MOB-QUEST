// Presentation only. Draw probabilities, currency and awards remain in drawGachaV96.
function gachaSceneV238(canvas,pattern,reduced=false){
 const ctx=canvas.getContext('2d');if(!ctx)return{paint(){},stop(){}};
 let frame=0,stopped=false,start=performance.now(),manual=null;
 const ease=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);},stars=Array.from({length:70},(_,i)=>({x:((i*137.508)%360)/180-1,y:((i*73.17)%230)/115-1,z:.15+(i*31%83)/100}));
 const kinds=pattern.id==='choice'?['wood','gold']:pattern.id==='rush'?['gold','rainbow','gold','rainbow','gold']:[pattern.id==='wood'?'wood':pattern.id==='rainbow'?'rainbow':'gold'];
 const paint=ms=>{
  const t=reduced?4.8:ms/1000,w=canvas.clientWidth,h=canvas.clientHeight,dpr=Math.min(devicePixelRatio||1,2);if(!w||!h)return;
  if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}ctx.setTransform(dpr,0,0,dpr,0,0);
  const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#090f24');bg.addColorStop(.5,'#192c46');bg.addColorStop(1,'#121923');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
  const rise=ease((t-1)/1.2),opening=ease((t-3.5)/1.1),flight=ease((t-4.7)/1.6),cx=w*.5,cy=h*.48;
  const halo=ctx.createRadialGradient(cx,cy,1,cx,cy,w*.72);halo.addColorStop(0,pattern.id==='rainbow'||pattern.id==='rush'?'#78639b38':'#b58c5933');halo.addColorStop(1,'#1b274000');ctx.fillStyle=halo;ctx.fillRect(0,0,w,h);
  for(const s of stars){const z=.2+((s.z+(reduced?0:t*.025))%1),x=cx+s.x*w*.45/z,y=cy+s.y*h*.38/z;ctx.fillStyle=`rgba(159,189,208,${.12+.3*(1-z)})`;ctx.beginPath();ctx.arc(x,y,Math.max(.45,1.4-z),0,7);ctx.fill();}
  // Floor ellipse and broken orbit lines give the treasure a grounded space.
  ctx.save();ctx.translate(cx,h*.65);ctx.scale(1,.28);for(let i=0;i<3;i++){ctx.strokeStyle=['#729baa32','#a9bbae24','#49698142'][i];ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,w*(.29+i*.13),w*(.29+i*.13),0,t*.12+i,t*.12+i+Math.PI*1.7);ctx.stroke();}ctx.restore();
  function chest(kind,index){
   const count=kinds.length,spread=count===5?.18:count===2?.36:0,ox=cx+(index-(count-1)/2)*w*spread,oy=cy+(1-rise)*-h*.4+(count===5?Math.abs(index-2)*17:0)+Math.sin(Math.min(1,(t-2.2)*4)*Math.PI)*Math.max(0,1-(t-2.2))*8;
   const unit=w*(count===5?.087:count===2?.15:.24)*(1+opening*.08)*(1-flight*.45),yaw=-.58+Math.sin(t*.7+index)*.13,pitch=.38;
   const project=([x,y,z])=>{const X=x*Math.cos(yaw)+z*Math.sin(yaw),Z=-x*Math.sin(yaw)+z*Math.cos(yaw),Y=y*Math.cos(pitch)-Z*Math.sin(pitch),depth=y*Math.sin(pitch)+Z*Math.cos(pitch),p=5/(5+depth);return[ox+X*unit*p,oy+Y*unit*p,depth];};
   ctx.save();ctx.globalAlpha=1-flight;ctx.fillStyle='#02081388';ctx.beginPath();ctx.ellipse(ox,h*.65,unit*1.1,unit*.2,0,0,7);ctx.fill();
   const faces=[],wood=kind==='wood',colors=wood?['#95643e','#68472e','#b07c4b']:kind==='gold'?['#c99b4c','#896335','#e2b96b']:['#9275b4','#526e9b','#75aea4'];
   function box(x,y,z,sx,sy,sz,palette,hinge=false){const v=[];for(const [a,b,c]of [[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]]){let X=x+a*sx,Y=y+b*sy,Z=z+c*sz;if(hinge){const angle=-opening*1.85,dy=Y+.25,dz=Z-.55;Y=-.25+dy*Math.cos(angle)-dz*Math.sin(angle);Z=.55+dy*Math.sin(angle)+dz*Math.cos(angle);}v.push(project([X,Y,Z]));}for(const [ids,col]of [[[0,1,2,3],palette[0]],[[4,5,6,7],palette[1]],[[0,4,7,3],palette[1]],[[1,5,6,2],palette[1]],[[0,1,5,4],palette[2]],[[3,2,6,7],palette[1]]])faces.push({points:ids.map(i=>v[i]),color:col,depth:ids.reduce((s,i)=>s+v[i][2],0)/4});}
   // Hollow chest: four thick walls and a dark interior, with real hinged lid.
   box(-1,-.25,-.6,2,1,.15,colors);box(-1,-.25,.45,2,1,.15,colors);box(-1,-.25,-.6,.14,1,1.2,colors);box(.86,-.25,-.6,.14,1,1.2,colors);box(-.86,.65,-.45,1.72,.08,.9,['#292f3d','#242638','#413b48']);
   const metal=wood?['#b8a67e','#716448','#d3bf8b']:['#d1ba78','#88744e','#e1c990'];
   for(const x of [-.79,.64]){box(x,-.28,-.625,.15,1.07,1.25,metal);box(x,-.72,-.64,.15,.48,1.28,metal,true);}
   box(-1,-.69,-.61,2,.43,1.22,colors,true);box(-1,-.74,-.49,2,.10,.98,[colors[2],colors[0],colors[2]],true);
   box(-.16,-.32-opening*.23,-.72-opening*.14,.32,.38,.12,metal);
   faces.sort((a,b)=>b.depth-a.depth);for(const face of faces){ctx.beginPath();face.points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();const shine=ctx.createLinearGradient(0,oy-unit,0,oy+unit);shine.addColorStop(0,face.color);shine.addColorStop(1,'#'+face.color.slice(1).match(/../g).map(n=>Math.round(parseInt(n,16)*.72).toString(16).padStart(2,'0')).join(''));ctx.fillStyle=shine;ctx.fill();ctx.strokeStyle='#182332';ctx.lineWidth=1.7;ctx.stroke();}
   // Front straps are surface decals, so adjacent wall polygons cannot occlude them.
   for(const x of [-.79,.64]){const pts=[[x,-.24,-.77],[x+.15,-.24,-.77],[x+.15,.74,-.77],[x,.74,-.77]].map(project);ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=metal[0];ctx.fill();ctx.strokeStyle=metal[1];ctx.stroke();}
   // Rivets and boards follow the same projection as the box.
   for(const x of [-.72,.72])for(const y of [-.12,.52]){const p=project([x,y,-.78]);ctx.fillStyle='#e4cc94';ctx.beginPath();ctx.arc(p[0],p[1],Math.max(1,unit*.028),0,7);ctx.fill();}
   if(wood){ctx.strokeStyle='#3f322d60';for(const y of [.1,.36]){const a=project([-.97,y,-.78]),b=project([.97,y,-.78]);ctx.beginPath();ctx.moveTo(...a.slice(0,2));ctx.lineTo(...b.slice(0,2));ctx.stroke();}}
   if(opening){const p=project([0,-.3,0]),glow=ctx.createRadialGradient(p[0],p[1],2,p[0],p[1],unit*.95);glow.addColorStop(0,`rgba(210,189,117,${opening*.42})`);glow.addColorStop(1,'#bb9b5300');ctx.fillStyle=glow;ctx.fillRect(p[0]-unit,p[1]-unit,unit*2,unit*2);}
   ctx.restore();
  }
  kinds.forEach(chest);
  if(opening&&!reduced){ctx.save();ctx.globalAlpha=opening*(1-flight)*.4;for(let i=0;i<5;i++){ctx.strokeStyle=['#88b6b8','#b9a677','#8e98b8'][i%3];ctx.lineWidth=i%2?1:2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.bezierCurveTo(cx-w*.42,cy-h*.12,cx+w*.5,cy-h*.22,cx+Math.sin(t+i)*w*.26,cy-h*.32);ctx.stroke();}ctx.restore();}
  // Faceted stars rise out of the open chest, arc overhead, then rush toward the viewer.
  const release=ease((t-4.15)/.7);if(release){const count=pattern.id==='rush'?15:pattern.id==='rainbow'?10:6;for(let i=0;i<count;i++){const angle=i*2.399+t*.24,orbit=(.15+flight*.55)*w,px=cx+Math.sin(angle)*orbit*release,py=cy-Math.sin(release*Math.PI*.55)*h*.19+Math.cos(angle)*orbit*.3-flight*h*.2,r=(5+i%3*2)*(1+flight*3),alpha=release*(1-ease((t-6.5)/.55));ctx.save();ctx.globalAlpha=alpha;ctx.translate(px,py);ctx.rotate(angle);const palette=pattern.id==='rainbow'||pattern.id==='rush'?['#a98bbf','#83bdb5','#c7ac72']:['#c9ab70','#c9ab70','#9bbed0'];ctx.strokeStyle=palette[i%3]+'55';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-Math.sin(angle)*flight*70,50*flight);ctx.stroke();for(let n=0;n<8;n++){const a=n*Math.PI/4,b=(n+1)*Math.PI/4,ra=n%2?r*.35:r,rb=(n+1)%2?r*.35:r;ctx.fillStyle=n%2?'#70889c':palette[i%3];ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(a)*ra,Math.sin(a)*ra);ctx.lineTo(Math.cos(b)*rb,Math.sin(b)*rb);ctx.fill();}ctx.restore();}}
  const vignette=ctx.createRadialGradient(cx,cy,w*.2,cx,cy,h*.7);vignette.addColorStop(0,'#02061200');vignette.addColorStop(1,'#020612bb');ctx.fillStyle=vignette;ctx.fillRect(0,0,w,h);
 };
 const tick=now=>{if(stopped||!canvas.isConnected)return;paint(manual??now-start);frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);
 return{paint(ms){manual=ms;paint(ms);},stop(){stopped=true;cancelAnimationFrame(frame);}};
}
pinkGachaV220=async function(pattern){
 const ov=gachaSurfaceV219(),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 ov.innerHTML=`<section class="gacha-stage-v238" aria-label="ガチャ演出"><canvas aria-hidden="true"></canvas><div class="gacha-pink-v238"><img src="${player('pink').image}" alt="モブピンク"></div><div class="gacha-speech-v238">行ってくるであります‼</div></section>`;
 const stage=$('.gacha-stage-v238',ov),scene=gachaSceneV238($('canvas',stage),pattern,reduced);
 try{await fixedDelay(reduced?100:1700);stage.classList.add('found');$('.gacha-speech-v238',stage).textContent=pattern.line;await fixedDelay(reduced?450:1650);stage.classList.add('opening');await fixedDelay(reduced?150:3600);stage.classList.add('finish');await fixedDelay(reduced?80:350);}finally{scene.stop();}
};
const gachaResultBaseV238=showGachaResultV115;
showGachaResultV115=function(...args){const pending=gachaResultBaseV238(...args),ov=ensureGachaOverlayV96();$('.gacha-result-v219',ov)?.classList.add('gacha-result-v238');$$('[data-result]',ov).forEach((el,i)=>el.style.setProperty('--reveal-delay',`${i*65}ms`));return pending;};
window.__mobBuildVersion='v238';
