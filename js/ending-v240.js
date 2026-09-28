// Center decoded artwork inside opaque, independently fading cinema frames.
endingMontageV157=async function(){
 endConversationV224(conversationV224);
 const root=document.createElement('div');
 root.className='ending-v157 ending-montage-v240';
 root.setAttribute('aria-label','エンディング');
 document.body.append(root);
 const audio=new Audio('music/end.mp3');audio.volume=.45;
 let deadline,previous;
 const done=new Promise(resolve=>{audio.onended=audio.onerror=resolve;});
 try{
  for(let n=1;n<=31;n++){
   const artwork=await loadEndingFrameV217(n);
   const slide=document.createElement('div');slide.className='ending-slide-v240';
   if(artwork instanceof HTMLImageElement){artwork.className='ending-art-v240';slide.append(artwork);}
   root.append(slide);
   if(n===1)audio.play()?.catch(()=>{});
   for(let next=n+1;next<=Math.min(31,n+2);next++)void loadEndingFrameV217(next);
   // Fade the black backing too: different aspect ratios cannot leave old edges behind.
   await animateV157(slide,[{opacity:0},{opacity:1}],1000);
   slide.style.opacity='1';previous?.remove();previous=slide;
   endingFramesV217.delete(n-1);
   await fixedDelay(3000);
  }
  if(!audio.ended&&!audio.error&&!audio.paused){
   const remaining=Number.isFinite(audio.duration)?Math.max(0,audio.duration-audio.currentTime)*1000+2000:180000;
   await Promise.race([done,new Promise(resolve=>{deadline=setTimeout(resolve,remaining);})]);
  }
  await animateV157(root,[{opacity:1},{opacity:0}],1600);
 }finally{
  clearTimeout(deadline);audio.pause();audio.removeAttribute('src');audio.load();
  root.remove();endingFramesV217.clear();
 }
};

const ENDING_LINES_V240={
 'さらに、レベル上限が120まで解放されました！':['さらに、レベル上限が','120まで解放されました！'],
 '新たな武器やフィギュアも追加されていきます！':['新たな武器やフィギュアも','追加されていきます！'],
 'ここまで遊んでくれてありがとうございました！':['ここまで遊んでくれて','ありがとうございました！']
};
endingCaptionV157=async function(text){
 let root=document.querySelector('.ending-caption-v157');
 if(!root){root=document.createElement('div');root.className='ending-caption-v157 ending-caption-v240';document.body.append(root);}
 root.replaceChildren();
 const card=document.createElement('div');card.className='ending-card-v240';root.append(card);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(text==='CB Memory'){
  card.classList.add('ending-signature-v240');
  const logo=new Image();logo.src=$('.title-logo')?.getAttribute('src')||'icon/01.png';logo.alt='MOB QUEST';
  await decodeImageBoundedV217(logo);
  card.append(logo);
  const label=document.createElement('p');label.textContent=text;label.style.opacity='0';card.append(label);
  await animateV157(card,[{opacity:0},{opacity:1}],1600);
  await animateV157(label,[{opacity:0},{opacity:1}],1400);label.style.opacity='1';return;
 }
 const p=document.createElement('p');card.append(p);
 for(const line of ENDING_LINES_V240[text]||[text]){const span=document.createElement('span');span.textContent=line;p.append(span);}
 // Preserve intentional sentence breaks; fit each complete line on small screens.
 const available=root.clientWidth*.86;
 const natural=Math.max(...Array.from(p.children,el=>el.getBoundingClientRect().width));
 if(natural>available)p.style.fontSize=parseFloat(getComputedStyle(p).fontSize)*available/natural+'px';
 await animateV157(card,[{opacity:0,transform:reduced?'none':'translateY(9px)'},{opacity:1,transform:'translateY(0)'}],1500);
 await fixedDelay(text==='ですが、'?1600:3400);
 await animateV157(card,[{opacity:1},{opacity:0}],1100);
 card.style.opacity='0';await fixedDelay(350);
};
