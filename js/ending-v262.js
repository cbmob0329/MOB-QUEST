// Poster cues follow the music clock rather than accumulating decoding/fade time.
endingMontageV157=async function(){
 endConversationV224(conversationV224);
 storySoundV257.setBgm(false);
 const root=document.createElement('div');root.className='ending-v157 ending-montage-v240 ending-montage-v262';root.setAttribute('aria-label','エンディング');document.body.append(root);
 const audio=new Audio('music/end.mp3');audio.volume=.45;audio.preload='auto';
 let previous,started=performance.now(),lastProgress=started,lastTime=0,silent=false;
 const preload=n=>loadEndingFrameV217(n);
 const waitUntil=async cue=>{
  while(true){
   const now=performance.now();
   if(audio.currentTime>lastTime+.01){lastTime=audio.currentTime;lastProgress=now;}
   if(!silent&&(audio.error||audio.ended||now-lastProgress>2500)){silent=true;started=now-lastTime*1000;}
   const elapsed=silent?(now-started)/1000:audio.currentTime;
   if(elapsed>=cue)return;
   await fixedDelay(Math.min(80,(cue-elapsed)*1000));
  }
 };
 try{
  await Promise.all([preload(1),preload(2),preload(3)]);
  started=lastProgress=performance.now();audio.play()?.catch(()=>{silent=true;started=performance.now();});
  for(let n=1;n<=31;n++){
   await waitUntil((n-1)*4);
   const artwork=await preload(n),slide=document.createElement('div');slide.className='ending-slide-v240';
   if(artwork instanceof HTMLImageElement){artwork.className='ending-art-v240';slide.append(artwork);}
   root.append(slide);
   for(let next=n+1;next<=Math.min(31,n+3);next++)void preload(next);
   await animateV157(slide,[{opacity:0},{opacity:1}],1200);slide.style.opacity='1';previous?.remove();previous=slide;endingFramesV217.delete(n-1);
  }
  // Keep the last image through the musical tail, including natural silence.
  await waitUntil(124);
  if(!silent&&Number.isFinite(audio.duration))await waitUntil(Math.max(124,audio.duration));
  await fixedDelay(900);
  await animateV157(root,[{opacity:1},{opacity:0}],2400);
  await fixedDelay(700);
 }finally{audio.pause();audio.removeAttribute('src');audio.load();root.remove();endingFramesV217.clear();}
};
// Authored content and line breaks remain unchanged.
endingCaptionV157=async function(text){
 let root=document.querySelector('.ending-caption-v157');
 if(!root){root=document.createElement('div');root.className='ending-caption-v157 ending-caption-v240';document.body.append(root);}
 root.replaceChildren();
 const card=document.createElement('div');card.className='ending-card-v240';root.append(card);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(text==='CB Memory'){
  card.classList.add('ending-signature-v240');
  const logo=new Image();logo.src=$('.title-logo')?.getAttribute('src')||'icon/01.png';logo.alt='MOB STORY';
  await decodeImageBoundedV217(logo);
  card.append(logo);
  const label=document.createElement('p');label.textContent=text;label.style.opacity='0';card.append(label);
  await animateV157(card,[{opacity:0},{opacity:1}],2000);
  await animateV157(label,[{opacity:0},{opacity:1}],1700);label.style.opacity='1';return;
 }
 const p=document.createElement('p');card.append(p);
 for(const line of ENDING_LINES_V240[text]||[text]){const span=document.createElement('span');span.textContent=line;p.append(span);}
 // Preserve intentional sentence breaks; fit each complete line on small screens.
 const available=root.clientWidth*.86;
 const natural=Math.max(...Array.from(p.children,el=>el.getBoundingClientRect().width));
 if(natural>available)p.style.fontSize=parseFloat(getComputedStyle(p).fontSize)*available/natural+'px';
 await animateV157(card,[{opacity:0,transform:reduced?'none':'translateY(9px)'},{opacity:1,transform:'translateY(0)'}],1900);
 await fixedDelay(text==='ですが、'?1900:text.includes('ありがとうございました')?5200:Math.max(3400,Math.min(4600,text.length*110)));
 await animateV157(card,[{opacity:1},{opacity:0}],1500);
 card.style.opacity='0';await fixedDelay(650);
};
