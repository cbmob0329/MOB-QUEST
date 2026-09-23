// UPDATE_V217_BEGIN
/* Battle dialogue lives in the adventure screen, not the battle screen. */
const fusionBaseV217=fusionV157;
fusionV157=async function(...args){
  const b=state.battle,wasStoryBusy=storyBusy;storyBusy=true;
  if(b){b.busy=true;b.queue=[];b.queuePos=0;}setCommandDisabled(true);
  showScreen('adventure');
  try{return await fusionBaseV217(...args);}
  finally{storyBusy=wasStoryBusy;if(state.battle===b)showScreen('battle');}
};
const waveBaseV217=spawnNextEnemyWave;
spawnNextEnemyWave=async function(...args){
  const b=state.battle;
  if(b?.finalTransitionV217)return b.finalTransitionV217;
  const finalWave=b?.pendingWaveConfigs?.[0]?.some(r=>r.id==='dc2-ulrilis')&&b.enemies.some(e=>e.id==='dc2-maou');
  if(!finalWave)return waveBaseV217(...args);
  b.busy=true;setCommandDisabled(true);
  b.finalTransitionV217=waveBaseV217(...args);
  try{return await b.finalTransitionV217;}finally{delete b.finalTransitionV217;}
};
const finalPostBaseV217=finalBossPostV89Final;
finalBossPostV89Final=async function(...args){showScreen('adventure');return finalPostBaseV217(...args);};

function decodeImageBoundedV217(img,ms=1500){
  if(!img?.decode)return Promise.resolve(false);
  return new Promise(resolve=>{let done=false;const finish=ok=>{if(done)return;done=true;clearTimeout(timer);resolve(ok);},timer=setTimeout(()=>finish(false),ms);Promise.resolve().then(()=>img.decode()).then(()=>finish(true),()=>finish(false));});
}

/* Stream only the current and next two posters; do not decode 80 MB before
   the first ending conversation. Failed requests have a finite deadline. */
const endingFramesV217=new Map();
function loadEndingFrameV217(n){
  if(endingFramesV217.has(n))return endingFramesV217.get(n);
  const task=(async()=>{
    for(let attempt=0;attempt<2;attempt++){
      const img=new Image();img.alt=`冒険の記録 ${n}`;img.decoding='async';
      const ok=await new Promise(resolve=>{let done=false;const finish=value=>{if(done)return;done=true;clearTimeout(timer);img.onload=img.onerror=null;resolve(value);},timer=setTimeout(()=>finish(false),5000);img.onload=()=>finish(true);img.onerror=()=>finish(false);img.src=`poster/${String(n).padStart(2,'0')}.png`;if(img.complete)finish(img.naturalWidth>0);});
      if(ok){await decodeImageBoundedV217(img);return img;}
      img.removeAttribute('src');
    }
    const fallback=document.createElement('div');fallback.className='ending-fallback-v217';fallback.textContent=`冒険の記録 ${n}\n画像を読み込めませんでした。\nエンディングは続きます。`;return fallback;
  })();endingFramesV217.set(n,task);return task;
}
preloadEndingV157=async function(){
  const loading=document.createElement('div');loading.className='ending-loading-v169';loading.textContent='エンディングを準備しています… 0 / 2';document.body.appendChild(loading);
  let count=0;
  try{await Promise.all([1,2].map(async n=>{await loadEndingFrameV217(n);loading.textContent=`エンディングを準備しています… ${++count} / 2`;}));}
  finally{loading.remove();}
};
endingMontageV157=async function(){
  const root=document.createElement('div');root.className='ending-v157 ending-montage-v169';root.setAttribute('aria-label','エンディング');
  const status=document.createElement('div');status.className='ending-status-v217';status.setAttribute('role','status');
  const skip=document.createElement('button');skip.type='button';skip.className='ending-next-v217';skip.textContent='メッセージへ';root.append(status,skip);document.body.appendChild(root);
  const audio=new Audio('music/end.mp3');audio.volume=.55;let skipped=false,stop;
  const stopped=new Promise(resolve=>stop=resolve);skip.onclick=()=>{skipped=true;stop();audio.pause();};
  const wait=promise=>Promise.race([promise,stopped]);
  const audioDone=new Promise(resolve=>{audio.onended=audio.onerror=resolve;});
  let deadline;
  try{
    // Playback can remain pending on a stalled media response. Slides still run.
    const played=audio.play();if(played?.catch)played.catch(()=>{});
    let previous=null;
    for(let n=1;n<=31&&!skipped;n++){
      status.textContent=`冒険の記録 ${n} / 31 を読み込んでいます…`;
      const frame=await wait(loadEndingFrameV217(n));if(skipped)break;
      for(let next=n+1;next<=Math.min(31,n+2);next++)void loadEndingFrameV217(next);
      frame.classList.add('ending-frame-v169');root.insertBefore(frame,status);
      await wait(animateV157(frame,[{opacity:0},{opacity:1}],800));frame.style.opacity='1';previous?.remove();previous=frame;endingFramesV217.delete(n-1);
      status.textContent=`冒険の記録 ${n} / 31`;await wait(fixedDelay(3200));
    }
    if(!skipped&&!audio.ended&&!audio.error&&!audio.paused){
      status.textContent='エンディング曲を再生中…「メッセージへ」で進めます';
      const remaining=Number.isFinite(audio.duration)?Math.max(0,audio.duration-audio.currentTime)*1000+1500:15000;
      await wait(Promise.race([audioDone,new Promise(resolve=>{deadline=setTimeout(resolve,Math.min(remaining,120000));})]));
    }
    await animateV157(root,[{opacity:1},{opacity:0}],1000);
  }finally{clearTimeout(deadline);audio.pause();audio.removeAttribute('src');audio.load();root.remove();endingFramesV217.clear();}
};

/* Keep a report checkpoint until the entire ending succeeds, including reloads. */
const endingBaseV217=finalEndingV89Final;
finalEndingV89Final=async function(...args){
  if(endingBusyV169)return;
  state.meta.pendingFinalEndingV217=true;saveMeta();
  try{const result=await endingBaseV217(...args);delete state.meta.pendingFinalEndingV217;saveMeta();return result;}
  finally{document.querySelectorAll('.ending-loading-v169,.ending-v157,.ending-caption-v157').forEach(el=>el.remove());}
};
function restoreEndingReportV217(){
  if(state.meta?.pendingFinalEndingV217&&state.meta?.finalBossDefeated&&!state.adventure.awaitingReport){state.adventure.awaitingReport={worldId:'demonCastle2',worldName:'魔王城Ⅱ'};saveAdventure();}
}
const renderCastleBaseV217=renderCastle;
renderCastle=function(...args){restoreEndingReportV217();return renderCastleBaseV217(...args);};
restoreEndingReportV217();
window.__mobBuildVersion='v217';
// UPDATE_V217_END
