// UPDATE_V195_BEGIN
/* v195: isolated Lilith formation transition.
   The final Money line has its own bridge, then all existing game/story UI is covered
   by a white top-level layer. Formation runs only from the explicit button. */
;(()=>{
const LILITH_KEY_V195='pre:demonCastle:2';
const LILITH_OPT_V195={
  storageKey:'lilithSplit',
  title:'リリス四姉妹戦 パーティー編成',
  aEnemies:'モブリリス / モブヘルリリス / モブキリンリリス',
  bEnemies:'モブクフリリス / モブリヴァリリス'
};
const realWaitV195=ms=>new Promise(resolve=>setTimeout(resolve,ms));

function ensureLilithIsolationV195(){
  let ov=document.getElementById('lilithIsolationV195');
  if(!ov){
    ov=document.createElement('div');
    ov.id='lilithIsolationV195';
    ov.hidden=true;
    Object.assign(ov.style,{
      position:'fixed',inset:'0',zIndex:'2147482000',background:'#fff',color:'#111',
      display:'none',alignItems:'center',justifyContent:'center',padding:'24px',
      boxSizing:'border-box',fontFamily:'inherit',textAlign:'center',pointerEvents:'auto'
    });
    document.body.appendChild(ov);
  }
  return ov;
}
function isolationMarkupV195(mode='narration'){
  const ov=ensureLilithIsolationV195();
  if(mode==='narration'){
    ov.innerHTML='<div style="width:min(86vw,360px)"><small style="display:block;font-size:11px;font-weight:900;letter-spacing:.18em;color:#777;margin-bottom:12px">NARRATION</small><div style="font-size:22px;line-height:1.5;font-weight:1000">パーティーを編成してください</div></div>';
  }else if(mode==='button'){
    ov.innerHTML='<button type="button" data-lilith-isolation-start-v195 style="position:relative;z-index:2147482500;width:min(84vw,360px);min-height:96px;border:4px solid #111;border-radius:20px;background:#fff;color:#111;box-shadow:0 12px 30px rgba(0,0,0,.18);font:inherit;font-weight:1000;font-size:22px;letter-spacing:.04em;touch-action:manipulation">パーティー編成<span style="display:block;margin-top:7px;font-size:11px;font-weight:800;color:#666">A / B パーティーを決める</span></button>';
  }else if(mode==='nyoro'){
    ov.innerHTML='<div style="width:min(86vw,360px)"><small style="display:block;font-size:11px;font-weight:900;color:#777;margin-bottom:10px">モブニョロ</small><div style="font-size:20px;line-height:1.5;font-weight:1000">素晴らしい采配ニョロ！</div></div>';
  }else if(mode==='desert'){
    ov.innerHTML='<div style="width:min(86vw,360px)"><small style="display:block;font-size:11px;font-weight:900;color:#777;margin-bottom:10px">モブデザート</small><div style="font-size:20px;line-height:1.5;font-weight:1000">では、まずBパーティーの出陣だ！</div></div>';
  }else{
    ov.innerHTML='<div style="font-size:18px;font-weight:1000">戦闘準備中…</div>';
  }
}
function showIsolationV195(){const ov=ensureLilithIsolationV195();ov.hidden=false;ov.style.display='flex';}
function hideIsolationV195(){const ov=document.getElementById('lilithIsolationV195');if(ov){ov.hidden=true;ov.style.display='none';ov.innerHTML='';}}

/* storyBusy blocks controls outside #storyScene. Explicitly allow only the isolated flow,
   split overlay and the confirmation dialog while this transition is active. */
const allowedTargetBaseV195=conversationAllowedTargetV171;
conversationAllowedTargetV171=target=>!!target?.closest?.('#lilithIsolationV195,#lilithSplitOverlay,#dialogOverlay')||allowedTargetBaseV195(target);

/* The historical final-line Promise has been the unstable bridge. Resolve the scene tap
   ourselves as a fallback, so reaching the white isolation layer does not depend on it. */
async function moneyFinalBridgeV195(){
  const scene=$('#storyScene');
  let finished=false,finishBridge;
  const bridge=new Promise(resolve=>finishBridge=resolve);
  const finish=()=>{if(finished)return;finished=true;scene?.removeEventListener('pointerup',tap,true);finishBridge(true);};
  const ready=performance.now()+100;
  const tap=e=>{
    if(performance.now()<ready)return;
    const text=String($('#storyText')?.textContent||'');
    if(!text.includes('戦力の分け方が大事ね'))return;
    /* Let the normal speech Promise continue if it is alive, but never depend on it. */
    if(storyTapResolve){const r=storyTapResolve;storyTapResolve=null;storyTapReadyAt=0;try{r();}catch(_){}}
    finish();
  };
  scene?.addEventListener('pointerup',tap,true);
  Promise.resolve(storySay('money','リリスがいる方は3体\n戦力の分け方が大事ね！')).then(finish).catch(err=>{console.warn('[v195] Money bridge recovered',err);finish();});
  await bridge;
  await realWaitV195(100);
  const bubble=$('#storyBubble');if(bubble){bubble.classList.remove('show');bubble.hidden=true;}
  setStorySpeaking('money',false);
}

async function isolatedSplitV195(){
  const shell=ensureLilithIsolationV195();
  isolationMarkupV195('narration');showIsolationV195();
  const skip=document.getElementById('storySkipV174');if(skip)skip.hidden=true;
  await realWaitV195(900);
  isolationMarkupV195('button');
  await new Promise(resolve=>{
    const btn=shell.querySelector('[data-lilith-isolation-start-v195]');
    const go=e=>{e?.preventDefault?.();e?.stopPropagation?.();btn.onclick=null;resolve(true);};
    btn.onclick=go;
  });

  /* Keep the entire old scene covered. The split UI and its yes/no dialog alone sit above it. */
  let splitOv=document.getElementById('lilithSplitOverlay');
  if(!splitOv){splitOv=document.createElement('div');splitOv.id='lilithSplitOverlay';splitOv.className='lilith-split-overlay';splitOv.hidden=true;document.body.appendChild(splitOv);}
  const oldSplitZ=splitOv.style.zIndex,dialog=$('#dialogOverlay'),oldDialogZ=dialog?.style.zIndex||'';
  splitOv.style.zIndex='2147483500';
  if(dialog)dialog.style.zIndex='2147483600';
  try{await chooseSplitV181(LILITH_OPT_V195);}finally{
    splitOv.style.zIndex=oldSplitZ;
    if(dialog)dialog.style.zIndex=oldDialogZ;
  }
  isolationMarkupV195('nyoro');await realWaitV195(650);
  isolationMarkupV195('desert');await realWaitV195(750);
  isolationMarkupV195('loading');
  return true;
}

async function runDemonCastleLilithPreV195(){
  if(storyBusy)return false;
  storyBusy=true;let ok=false;
  hideIsolationV195();
  try{
    await openStoryScene('demonCastle',2);
    {const fx=castleFxV180('rose-summon-v180');try{await storyShowGuest('boss-lilith-castle',{slow:true});await fixedDelay(450);}finally{fx?.remove();}}
    await storySay('boss-lilith-castle','凄いね君たち');
    await storySay('boss-lilith-castle','グラディモブ\n強かったでしょ');
    await storySay('desert','ああ\n強敵だった');
    await storySay('boss-lilith-castle','まあ\n僕の方が強いんだけどね');
    await storySay('boss-lilith-castle','ちょっとだけ寂しくなるな');
    await storySay('money','あんたなんて\n私の魔法でぶっ飛ばしてやるわ！');
    await storySay('boss-lilith-castle','ネオン街の魔女\n僕も手合わせしてみたかった');
    await storySay('boss-lilith-castle','良い機会ね');
    await storySay('jessie','あなたを倒せば\nあとは魔王だけ！');
    await storySay('boss-lilith-castle','うーん\nそれはどうだろう');
    await storySay('boss-lilith-castle','行ってみないと分からないよね\nまあ');
    await storySay('boss-lilith-castle','行けないんだけどね');
    {const fx=castleFxV180('rose-ultimate-v180');try{await demonLilithSummonV106();await fixedDelay(650);}finally{fx?.remove();}}
    await storySay('boss-lilith-castle','君たちは\nこのリリス四姉妹が遊んでくれるよ\nあ、僕も入れたら五姉妹か？\nいや僕は親？うーん');
    await storySay('pink','あれを全部相手は大変であります・・');
    await storySay('desert','2手に分かれよう');
    await storySay('denden','ナイスアイデアでやんす！');
    await storySay('jessie','どう分かれるの？');
    await storySay('riro','勇者様が\n決めればいいでス');
    await storySay('denden','そうでやんすね！');
    await moneyFinalBridgeV195();
    await isolatedSplitV195();

    markStoryDone(LILITH_KEY_V195);
    state.adventure??={};
    state.adventure.lilithFlowV195Done=true;
    state.adventure.lilithFlowV194Done=true; /* bypass obsolete v194 route if present in an old save/build */
    state.adventure.lilithSplitReadyV183=true;
    saveAdventure();
    ok=true;
  }catch(err){
    console.error('[v195] Lilith isolated formation failed',err);
    hideIsolationV195();
    throw err;
  }finally{
    storyBusy=false;
  }
  if(!ok)return false;
  await closeStoryScene(false);
  return true;
}

const runStoryEventBaseV195=runStoryEvent;
runStoryEvent=async function(key,forceHomeOverride=false){
  if(key!==LILITH_KEY_V195)return runStoryEventBaseV195(key,forceHomeOverride);
  if(state.adventure?.lilithFlowV195Done)return false;
  return runDemonCastleLilithPreV195();
};

const startAdventureBattleBaseV195=startAdventureBattle;
startAdventureBattle=async function(){
  const w=currentWorld(),areaIndex=Number(state.adventure?.areaIndex)||0;
  if(w?.id!=='demonCastle'||areaIndex!==2)return startAdventureBattleBaseV195();
  if(!state.adventure?.battleReady||state.adventure.completed||state.adventure.awaitingReport||storyBusy)return;
  const enc=state.adventure.pendingEncounter||createAdventureEncounter();
  const bossEncounter=(((state.adventure.battleIndex||0)===2)||!!w.oneBattlePerArea)&&!!enc?.bossBattle;
  if(!bossEncounter)return startAdventureBattleBaseV195();
  if(!state.adventure?.lilithFlowV195Done){
    const ran=await runDemonCastleLilithPreV195();
    if(!ran&&!state.adventure?.lilithFlowV195Done)return;
  }
  try{return await startAdventureBattleBaseV195();}
  finally{hideIsolationV195();}
};

window.__mobBuildVersion='v195';
window.__mobV195LilithIsolation=true;
window.__mobV195LilithDiagnostics=()=>({
  world:currentWorld()?.id||'',area:Number(state.adventure?.areaIndex)||0,
  flowDone:!!state.adventure?.lilithFlowV195Done,splitReady:!!state.adventure?.lilithSplitReadyV183,
  isolationVisible:document.getElementById('lilithIsolationV195')?.style.display==='flex',
  splitVisible:!document.getElementById('lilithSplitOverlay')?.hidden
});
})();
// UPDATE_V195_END
