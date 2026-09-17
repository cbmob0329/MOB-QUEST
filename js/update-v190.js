// UPDATE_V190_BEGIN
/* v190: Demon Castle AREA 3 Lilith flow is now one dedicated transaction.
   Do not use the v185-v189 split hooks for this scene.
   Canonical order:
   sisters reveal -> all authored dialogue -> Money's final line -> split narration
   -> A/B formation -> Nyoro/Desert lines -> B battle -> A battle. */
;(()=>{
const LILITH_PRE_KEY_V190='pre:demonCastle:2';

function hideLegacyLilithOverlaysV190(){
  for(const sel of ['#splitPartyOverlayV185','#lilithSplitOverlayV186','#lilithSplitOverlayV188','#lilithSplitOverlay']){
    const el=document.querySelector(sel);if(!el)continue;
    el.hidden=true;el.style.display='none';
  }
}

function splitRowsV190(){
  const seen=new Set(),rows=[];
  for(const row of (state.party||[])){
    const id=canonicalPlayerId(row?.[0]);
    if(!id||seen.has(id)||!player(id))continue;
    seen.add(id);rows.push([id,Number(row?.[1])||5]);
  }
  return rows;
}
function normalizeLilithSplitV190(){
  const roster=splitRowsV190(),valid=new Map(roster.map(r=>[r[0],r])),used=new Set();
  const saved=state.meta?.lilithSplit;
  const take=list=>(Array.isArray(list)?list:[])
    .map(r=>canonicalPlayerId(r?.[0]))
    .filter(id=>id&&valid.has(id)&&!used.has(id)&&used.add(id))
    .map(id=>[...valid.get(id)]);
  let A=take(saved?.A),B=take(saved?.B);
  for(const row of roster)if(!used.has(row[0]))(A.length<=B.length?A:B).push([...row]);
  if(!A.length||!B.length){
    A=[];B=[];roster.forEach((row,i)=>(i%2?B:A).push([...row]));
    if(!B.length&&A.length>1)B.push(A.pop());
  }
  return {A,B};
}
function validLilithSplitV190(){
  const roster=splitRowsV190(),ids=new Set(roster.map(r=>r[0])),s=state.meta?.lilithSplit;
  if(!s||!Array.isArray(s.A)||!Array.isArray(s.B)||!s.A.length||!s.B.length)return false;
  const all=[...s.A,...s.B].map(r=>canonicalPlayerId(r?.[0]));
  if(all.length!==ids.size||new Set(all).size!==all.length)return false;
  return all.every(id=>ids.has(id));
}
function currentLilithSplitV190(){return normalizeLilithSplitV190();}
function namesV190(rows){return rows.map(([id])=>player(id)?.name||id).join(' / ');}

function ensureLilithOverlayV190(){
  let ov=document.getElementById('lilithSplitOverlayV190');
  if(ov)return ov;
  ov=document.createElement('div');ov.id='lilithSplitOverlayV190';ov.hidden=true;
  Object.assign(ov.style,{position:'fixed',inset:'0',zIndex:'2147483640',background:'rgba(4,4,10,.96)',display:'none',alignItems:'flex-start',justifyContent:'center',overflowY:'auto',padding:'calc(18px + env(safe-area-inset-top,0px)) 10px calc(18px + env(safe-area-inset-bottom,0px))',boxSizing:'border-box',touchAction:'pan-y'});
  document.body.appendChild(ov);
  for(const type of ['pointerdown','pointerup','touchstart','touchend','click'])ov.addEventListener(type,e=>{e.stopPropagation();},{passive:false});
  return ov;
}
function renderLilithFormationV190(ov,split,resolve){
  const roster=splitRowsV190(),team=id=>split.A.some(r=>r[0]===id)?'A':'B';
  ov.hidden=false;ov.style.display='flex';
  ov.innerHTML=`<section style="width:min(96vw,540px);margin:auto 0;background:#f8eee2;color:#241b20;border:4px solid #7b315f;border-radius:22px;padding:14px;box-sizing:border-box;box-shadow:0 20px 60px #000;max-height:94vh;overflow:auto;font-family:inherit">
    <small style="display:block;font-size:9px;font-weight:900;letter-spacing:.16em;color:#78516f">PARTY SPLIT / v192</small>
    <h2 style="margin:4px 0 7px;font-size:19px">リリス四姉妹戦 パーティー編成</h2>
    <p style="font-size:10px;line-height:1.55;margin:0 0 9px">仲間をタップするとA/Bを移動します。</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:9px">
      <div style="background:#64284f;color:#fff;border-radius:11px;padding:8px"><b>Aパーティー</b><small style="display:block;line-height:1.45;margin-top:3px">モブリリス<br>モブヘルリリス<br>モブキリンリリス</small></div>
      <div style="background:#28536d;color:#fff;border-radius:11px;padding:8px"><b>Bパーティー</b><small style="display:block;line-height:1.45;margin-top:3px">モブクフリリス<br>モブリヴァリリス</small></div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px">${roster.map(([id,lv])=>{const q=player(id),t=team(id);return `<button type="button" data-v190-member="${id}" style="min-height:64px;display:grid;grid-template-columns:28px 1fr 40px;gap:5px;align-items:center;text-align:left;border:2px solid ${t==='A'?'#a33e61':'#3979aa'};background:${t==='A'?'#fff1f5':'#eef8ff'};color:#211921;border-radius:11px;padding:5px"><strong style="font-size:15px">${t}</strong><span><b style="display:block;font-size:10px">${q.name}</b><small>Lv${lv}</small></span><img src="${versionedPlay(q.image)}" alt="${q.name}" style="width:38px;height:48px;object-fit:contain"></button>`}).join('')}</div>
    <div style="display:flex;gap:7px;justify-content:center;margin:10px 0"><b style="background:#64284f;color:#fff;padding:5px 10px;border-radius:999px">A ${split.A.length}人</b><b style="background:#28536d;color:#fff;padding:5px 10px;border-radius:999px">B ${split.B.length}人</b></div>
    <div data-v190-confirm><button type="button" data-v190-decide style="width:100%;height:44px;border:0;border-radius:11px;background:#79355f;color:#fff;font-weight:900;font-size:12px">編成を決定</button></div>
  </section>`;
  bindImages(ov);
  ov.querySelectorAll('[data-v190-member]').forEach(btn=>btn.onclick=e=>{
    e.preventDefault();e.stopPropagation();
    const id=canonicalPlayerId(btn.dataset.v190Member),from=split.A.some(r=>r[0]===id)?split.A:split.B,to=from===split.A?split.B:split.A;
    if(from.length<=1)return toast('A/Bどちらにも1人以上必要です');
    const i=from.findIndex(r=>r[0]===id);if(i<0)return;
    to.push(from.splice(i,1)[0]);renderLilithFormationV190(ov,split,resolve);
  });
  ov.querySelector('[data-v190-decide]').onclick=e=>{
    e.preventDefault();e.stopPropagation();
    if(!split.A.length||!split.B.length)return toast('A/Bどちらにもメンバーが必要です');
    const box=ov.querySelector('[data-v190-confirm]');
    box.innerHTML=`<div style="background:#fff;border:2px solid #80536f;border-radius:12px;padding:10px"><b style="display:block;font-size:12px;margin-bottom:6px">このパーティーで挑みますか？</b><small style="display:block;line-height:1.55;margin-bottom:9px">A：${namesV190(split.A)}<br>B：${namesV190(split.B)}</small><div style="display:grid;grid-template-columns:1fr 1fr;gap:7px"><button type="button" data-v190-yes style="height:42px;border:0;border-radius:10px;background:#79355f;color:#fff;font-weight:900">はい</button><button type="button" data-v190-no style="height:42px;border:1px solid #866b7e;border-radius:10px;background:#eee3e9;color:#2a2027;font-weight:900">いいえ</button></div></div>`;
    box.querySelector('[data-v190-no]').onclick=ev=>{ev.preventDefault();ev.stopPropagation();renderLilithFormationV190(ov,split,resolve);};
    box.querySelector('[data-v190-yes]').onclick=ev=>{
      ev.preventDefault();ev.stopPropagation();
      state.meta??={};state.meta.lilithSplit={A:clone(split.A),B:clone(split.B)};saveMeta();
      state.adventure??={};state.adventure.lilithSplitReadyV190=true;saveAdventure();
      ov.hidden=true;ov.style.display='none';ov.innerHTML='';
      resolve(clone(state.meta.lilithSplit));
    };
  };
}
async function chooseLilithSplitV190(){
  hideLegacyLilithOverlaysV190();
  const roster=splitRowsV190();
  if(roster.length<2){toast('2パーティー戦には2人以上の仲間が必要です');throw new Error('v190 lilith split requires two members');}
  const ov=ensureLilithOverlayV190(),split=normalizeLilithSplitV190();
  return await new Promise(resolve=>renderLilithFormationV190(ov,split,resolve));
}


function ensureLilithFormationButtonV192(){
  const scene=$('#storyScene');
  let gate=document.getElementById('lilithFormationGateV192');
  if(gate&&gate.parentElement!==scene){gate.remove();gate=null;}
  if(!gate){
    gate=document.createElement('div');gate.id='lilithFormationGateV192';gate.hidden=true;
    Object.assign(gate.style,{position:'absolute',inset:'0',zIndex:'2147483635',display:'none',alignItems:'center',justifyContent:'center',pointerEvents:'none',padding:'18px',boxSizing:'border-box'});
    gate.innerHTML=`<button type="button" data-lilith-formation-v192 style="pointer-events:auto;width:min(84vw,330px);min-height:86px;border:4px solid #f4cce4;border-radius:18px;background:#6f2d59;color:#fff;box-shadow:0 12px 34px rgba(0,0,0,.55),inset 0 0 0 2px rgba(255,255,255,.18);font-family:inherit;font-weight:900;letter-spacing:.04em;padding:10px 14px;touch-action:manipulation;-webkit-tap-highlight-color:transparent"><span style="display:block;font-size:20px;line-height:1.25">パーティー編成</span><small style="display:block;margin-top:5px;font-size:10px;line-height:1.35;opacity:.92">A / B パーティーを決める</small></button>`;
    scene.appendChild(gate);
  }
  return gate;
}
async function waitLilithFormationButtonV192(){
  const gate=ensureLilithFormationButtonV192(),btn=gate.querySelector('[data-lilith-formation-v192]');
  $('#storyBubble').hidden=true;
  gate.hidden=false;gate.style.display='flex';
  await nextPaint();
  return await new Promise(resolve=>{
    let done=false;
    const finish=e=>{
      e?.preventDefault?.();e?.stopPropagation?.();
      if(done)return;done=true;
      gate.hidden=true;gate.style.display='none';
      btn.onclick=null;
      resolve(true);
    };
    btn.onclick=finish;
    btn.onpointerup=e=>{e.stopPropagation();};
    btn.ontouchend=e=>{e.stopPropagation();};
  });
}

/* Conversation input stays locked except for the dedicated v190 formation overlay. */
const conversationAllowedTargetBaseV190=conversationAllowedTargetV171;
conversationAllowedTargetV171=target=>!!target?.closest?.('#lilithSplitOverlayV190')||conversationAllowedTargetBaseV190(target);

async function runDemonCastleLilithPreV190(){
  if(storyBusy)return false;
  storyBusy=true;let ok=false;
  hideLegacyLilithOverlaysV190();
  try{
    await openStoryScene('demonCastle',2);

    /* Lilith appears alone. This is visual-only: never call old split hooks here. */
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

    /* Four sisters appear. Again visual-only. Formation must NOT open here. */
    {const fx=castleFxV180('rose-ultimate-v180');try{await demonLilithSummonV106();await fixedDelay(650);}finally{fx?.remove();}}
    await storySay('boss-lilith-castle','君たちは\nこのリリス四姉妹が遊んでくれるよ\nあ、僕も入れたら五姉妹か？\nいや僕は親？うーん');
    await storySay('pink','あれを全部相手は大変であります・・');
    await storySay('desert','2手に分かれよう');
    await storySay('denden','ナイスアイデアでやんす！');
    await storySay('jessie','どう分かれるの？');
    await storySay('riro','勇者様が\n決めればいいでス');
    await storySay('denden','そうでやんすね！');
    await storySay('money','リリスがいる方は3体\n戦力の分け方が大事ね！');

    /* v192: do not auto-open formation.  After Money's final line, present a
       deliberate center-screen PARTY FORMATION button.  This removes the fragile
       dialogue -> overlay automatic bridge entirely. */
    const staleNarrationV192=$('#storyNarration');
    if(staleNarrationV192){staleNarrationV192.classList.remove('show');staleNarrationV192.hidden=true;}
    storyTapResolve=null;storyTapReadyAt=0;
    await nextPaint();
    await waitLilithFormationButtonV192();
    await chooseLilithSplitV190();

    await storySay('nyoro','素晴らしい采配ニョロ！');
    await storySay('desert','では、まずBパーティーの出陣だ！');

    markStoryDone(LILITH_PRE_KEY_V190);
    state.adventure??={};state.adventure.lilithFlowV190Done=true;saveAdventure();
    ok=true;
  }finally{
    storyBusy=false;
  }
  if(!ok)return false;
  await closeStoryScene(false);
  if(screens.adventure?.classList?.contains('active'))renderAdventure();
  return true;
}

/* Bypass every historical pre:demonCastle:2 runStorySteps patch. */
const runStoryEventBaseV190=runStoryEvent;
runStoryEvent=async function(key,forceHomeOverride=false){
  if(key!==LILITH_PRE_KEY_V190)return runStoryEventBaseV190(key,forceHomeOverride);
  if(state.adventure?.lilithFlowV190Done)return false;
  return runDemonCastleLilithPreV190();
};

/* Bypass all v183-v189 battle-start wrappers for this one boss encounter. */
const startAdventureBattleBaseV190=startAdventureBattle;
startAdventureBattle=async function(){
  const w=currentWorld(),areaIndex=Number(state.adventure?.areaIndex)||0;
  if(w?.id!=='demonCastle'||areaIndex!==2)return startAdventureBattleBaseV190();
  if(!state.adventure.battleReady||state.adventure.completed||state.adventure.awaitingReport||storyBusy)return;

  const enc=state.adventure.pendingEncounter||createAdventureEncounter(),area=currentArea();
  const bossEncounter=(((state.adventure.battleIndex||0)===2)||!!w.oneBattlePerArea)&&!!enc?.bossBattle;
  if(!bossEncounter)return startAdventureBattleBaseV190();

  /* Old broken builds may have marked the story flag. v190 uses its own completion marker. */
  if(!state.adventure?.lilithFlowV190Done){
    const ran=await runDemonCastleLilithPreV190();
    if(!ran&&!state.adventure?.lilithFlowV190Done)return;
  }
  if(!validLilithSplitV190())await chooseLilithSplitV190();

  const split=currentLilithSplitV190();
  state.adventure.pendingEncounter=enc;saveAdventure();
  const postKey=STORY_EVENTS['post:demonCastle:2']?'post:demonCastle:2':'';
  await startBattleLoaded({
    mode:'adventure',returnScreen:'adventure',waves:enc.waves,party:split.B,
    useAdventureVitals:true,bg:area.bg,fallbackBg:w.fieldFallback,
    bossBattle:!!enc.bossBattle,adventureLabel:enc.label,storyPostKey:postKey,
    storyWorldId:w.id,storyAreaIndex:areaIndex,worldId:w.id,
    returnHomeAfterAreaClear:false,lilithSplitBattle:true,lilithSplit:split
  });
};

window.__mobBuildVersion='v192';
window.__mobV190LilithSingleFlow=true;
window.__mobV190Diagnostics=()=>({
  world:currentWorld()?.id||'',area:Number(state.adventure?.areaIndex)||0,
  flowDone:!!state.adventure?.lilithFlowV190Done,splitValid:validLilithSplitV190(),
  legacy185HookStillDefined:typeof lilithFamilyRoseSummonBaseV185!=='undefined'
});
})();
// UPDATE_V190_END
