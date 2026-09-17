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
  const skip=document.getElementById('storySkipV174');
  const skipWasHidden=!!skip?.hidden;
  if(skip)skip.hidden=true;
  await realWaitV195(900);
  isolationMarkupV195('button');
  await new Promise(resolve=>{
    const btn=shell.querySelector('[data-lilith-isolation-start-v195]');
    const go=e=>{e?.preventDefault?.();e?.stopPropagation?.();btn.onclick=null;resolve(true);};
    btn.onclick=go;
  });

  /* v196: the formation UI lives INSIDE the white isolation layer itself.
     Do not call chooseSplitV181 here: that helper is private to the v181 IIFE.
     Keeping the roster, confirmation, and buttons in this one layer also avoids
     the old !important z-index rules on #lilithSplitOverlay / #dialogOverlay. */
  const roster=[];const seen=new Set();
  for(const row of state.party||[]){
    const id=canonicalPlayerId(row?.[0]);
    if(!id||seen.has(id)||!player(id))continue;
    seen.add(id);roster.push([id,Number(row?.[1])||5]);
  }
  if(roster.length<2){
    shell.innerHTML='<div style="width:min(88vw,390px);padding:20px;border:3px solid #111;border-radius:18px;background:#fff;color:#111"><b style="display:block;font-size:21px;margin-bottom:10px">パーティー編成エラー</b><p style="font-size:14px;line-height:1.6;margin:0">A/B編成には2人以上の仲間が必要です。</p></div>';
    throw new Error('v196 isolated split requires at least two valid party members');
  }
  const valid=new Map(roster.map(r=>[r[0],r])),used=new Set();
  const saved=state.meta?.lilithSplit;
  const clean=list=>(Array.isArray(list)?list:[])
    .map(r=>canonicalPlayerId(r?.[0]))
    .filter(id=>id&&valid.has(id)&&!used.has(id)&&used.add(id))
    .map(id=>[...valid.get(id)]);
  let A=clean(saved?.A),B=clean(saved?.B);
  for(const row of roster)if(!used.has(row[0]))(A.length<=B.length?A:B).push([...row]);
  if(!A.length||!B.length){A=[];B=[];roster.forEach((r,i)=>(i%2?B:A).push([...r]));if(!B.length&&A.length>1)B.push(A.pop());}
  const split={A,B};

  const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  const teamOf=id=>split.A.some(r=>r[0]===id)?'A':'B';
  let done=false;
  const render=()=>{
    const cards=roster.map(([id,lv])=>{const p=player(id),team=teamOf(id);return `<button type="button" data-v196-member="${esc(id)}" style="display:grid;grid-template-columns:38px 48px minmax(0,1fr);gap:7px;align-items:center;width:100%;min-height:66px;padding:6px 8px;border:3px solid ${team==='A'?'#b43e62':'#3c74a6'};border-radius:14px;background:${team==='A'?'#fff0f5':'#eef7ff'};color:#111;text-align:left;font:inherit;touch-action:manipulation"><strong style="font-size:18px;text-align:center">${team}</strong><img src="${versionedPlay(p.image)}" alt="${esc(p.name)}" style="width:48px;height:54px;object-fit:contain"><span style="min-width:0"><b style="display:block;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(p.name)}</b><small style="font-size:10px">Lv${lv}</small></span></button>`;}).join('');
    shell.innerHTML=`<div data-v196-formation style="width:min(94vw,480px);max-height:92dvh;overflow:auto;padding:16px 14px 18px;border:4px solid #111;border-radius:22px;background:#fff;color:#111;box-shadow:0 16px 40px rgba(0,0,0,.16);box-sizing:border-box;text-align:left"><div style="text-align:center;margin-bottom:10px"><small style="display:block;font-size:10px;font-weight:1000;letter-spacing:.16em;color:#777">PARTY SPLIT</small><h2 style="font-size:22px;margin:4px 0 0">リリス四姉妹戦 パーティー編成</h2></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0"><div style="padding:9px;border-radius:12px;background:#5a2740;color:#fff"><b style="display:block;font-size:12px">Aパーティー</b><span style="display:block;font-size:9px;line-height:1.45;margin-top:3px">モブリリス / モブヘルリリス / モブキリンリリス</span></div><div style="padding:9px;border-radius:12px;background:#274d72;color:#fff"><b style="display:block;font-size:12px">Bパーティー</b><span style="display:block;font-size:9px;line-height:1.45;margin-top:3px">モブクフリリス / モブリヴァリリス</span></div></div><p style="font-size:11px;line-height:1.5;margin:8px 0;text-align:center">キャラクターをタップするとA/Bを移動します。</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:7px">${cards}</div><div style="display:flex;justify-content:center;gap:8px;margin:12px 0"><span style="padding:7px 13px;border-radius:999px;background:#5a2740;color:#fff;font-size:12px;font-weight:1000">A ${split.A.length}人</span><span style="padding:7px 13px;border-radius:999px;background:#274d72;color:#fff;font-size:12px;font-weight:1000">B ${split.B.length}人</span></div><button type="button" data-v196-confirm style="width:100%;min-height:58px;border:3px solid #111;border-radius:14px;background:#111;color:#fff;font:inherit;font-size:17px;font-weight:1000;touch-action:manipulation">編成を決定</button><div data-v196-inline-confirm></div></div>`;
    bindImages(shell);
    shell.querySelectorAll('[data-v196-member]').forEach(btn=>btn.onclick=e=>{e.preventDefault();e.stopPropagation();if(done)return;const id=canonicalPlayerId(btn.dataset.v196Member),from=split.A.some(r=>r[0]===id)?split.A:split.B,to=from===split.A?split.B:split.A;if(from.length<=1)return toast('A/Bどちらにも1人以上必要です');const i=from.findIndex(r=>r[0]===id);if(i<0)return;to.push(from.splice(i,1)[0]);render();});
    const confirm=shell.querySelector('[data-v196-confirm]');
    if(confirm)confirm.onclick=e=>{e.preventDefault();e.stopPropagation();if(done)return;if(!split.A.length||!split.B.length)return toast('A/Bどちらにもメンバーが必要です');const names=t=>t.map(([id])=>player(id)?.name||id).join(' / '),box=shell.querySelector('[data-v196-inline-confirm]');box.innerHTML=`<div style="margin-top:12px;padding:12px;border:3px solid #111;border-radius:14px;background:#f7f7f7;text-align:left"><b style="display:block;font-size:15px;margin-bottom:7px">このパーティーで挑みますか？</b><div style="font-size:11px;line-height:1.55"><strong>A：</strong>${esc(names(split.A))}<br><strong>B：</strong>${esc(names(split.B))}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:11px"><button type="button" data-v196-yes style="min-height:48px;border:3px solid #111;border-radius:12px;background:#111;color:#fff;font:inherit;font-weight:1000">はい</button><button type="button" data-v196-no style="min-height:48px;border:3px solid #111;border-radius:12px;background:#fff;color:#111;font:inherit;font-weight:1000">いいえ</button></div></div>`;box.scrollIntoView({block:'nearest',behavior:'smooth'});box.querySelector('[data-v196-no]').onclick=ev=>{ev.preventDefault();ev.stopPropagation();box.innerHTML='';};box.querySelector('[data-v196-yes]').onclick=ev=>{ev.preventDefault();ev.stopPropagation();done=true;state.meta.lilithSplit={A:clone(split.A),B:clone(split.B)};saveMeta();shell.dispatchEvent(new CustomEvent('mob-v196-split-done'));};};
  };
  render();
  await new Promise(resolve=>shell.addEventListener('mob-v196-split-done',resolve,{once:true}));

  /* v197: the white isolation layer ends the instant formation is confirmed.
     All following dialogue and battle preparation must be rendered by the normal
     story/battle UI, never inside the white formation layer. */
  hideIsolationV195();
  if(skip)skip.hidden=skipWasHidden;
  await realWaitV195(80);
  await storySay('nyoro','素晴らしい采配ニョロ！');
  await storySay('desert','では、まずBパーティーの出陣だ！');
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
  /* v197: hard guarantee that the formation-only white layer can never cover
     normal battle loading or the battle screen. */
  hideIsolationV195();
  try{return await startAdventureBattleBaseV195();}
  finally{hideIsolationV195();}
};

window.__mobBuildVersion='v197';
window.__mobV195LilithIsolation=true;
window.__mobV196LilithInlineFormation=true;
window.__mobV197LilithRestoreAfterFormation=true;
window.__mobV195LilithDiagnostics=()=>({
  world:currentWorld()?.id||'',area:Number(state.adventure?.areaIndex)||0,
  flowDone:!!state.adventure?.lilithFlowV195Done,splitReady:!!state.adventure?.lilithSplitReadyV183,
  isolationVisible:document.getElementById('lilithIsolationV195')?.style.display==='flex',
  splitVisible:!document.getElementById('lilithSplitOverlay')?.hidden
});
})();
// UPDATE_V195_END
