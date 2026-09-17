// UPDATE_V188_BEGIN
/* v188: Demon Castle Lilith split-flow repair.
   - No formation popup at the five-Lilith reveal.
   - One formation point only: after Money's line + split narration.
   - Demon Castle AREA 3 battle starts through a dedicated continuation path,
     bypassing stale v183-v186 startAdventureBattle guards. */
;(()=>{
let lilithSplitConfirmedSessionV188=false;

/* Permanently neutralize the old v185 early-popup hook. This function is visual only. */
lilithFamilyRoseSummonV180=async function(){
  const fx=castleFxV180('rose-ultimate-v180');
  try{await demonLilithSummonV106();await fixedDelay(650);}finally{fx?.remove();}
};

function splitRowsV188(){
  const seen=new Set(),rows=[];
  for(const row of (state.party||[])){
    const id=canonicalPlayerId(row?.[0]);
    if(!id||seen.has(id)||!player(id))continue;
    seen.add(id);rows.push([id,Number(row?.[1])||5]);
  }
  return rows;
}
function normalizeLilithSplitV188(){
  const roster=splitRowsV188(),valid=new Map(roster.map(r=>[r[0],r])),used=new Set();
  const saved=state.meta?.lilithSplit;
  const clean=list=>(Array.isArray(list)?list:[])
    .map(r=>canonicalPlayerId(r?.[0]))
    .filter(id=>id&&valid.has(id)&&!used.has(id)&&used.add(id))
    .map(id=>[...valid.get(id)]);
  let A=clean(saved?.A),B=clean(saved?.B);
  for(const row of roster)if(!used.has(row[0]))(A.length<=B.length?A:B).push([...row]);
  if(!A.length||!B.length){
    A=[];B=[];roster.forEach((r,i)=>(i%2?B:A).push([...r]));
    if(!B.length&&A.length>1)B.push(A.pop());
  }
  return {A,B};
}
function validLilithSplitV188(){
  const rosterIds=new Set(splitRowsV188().map(r=>r[0])),s=state.meta?.lilithSplit;
  if(!Array.isArray(s?.A)||!Array.isArray(s?.B)||!s.A.length||!s.B.length)return false;
  const ids=[...s.A,...s.B].map(r=>canonicalPlayerId(r?.[0]));
  return ids.length>=2&&ids.every(id=>rosterIds.has(id))&&new Set(ids).size===ids.length;
}
function ensureLilithOverlayV188(){
  let ov=document.getElementById('lilithSplitOverlayV188');
  if(ov)return ov;
  ov=document.createElement('div');ov.id='lilithSplitOverlayV188';ov.hidden=true;
  Object.assign(ov.style,{position:'fixed',inset:'0',zIndex:'2147483640',background:'rgba(4,4,10,.96)',display:'none',alignItems:'flex-start',justifyContent:'center',overflowY:'auto',padding:'calc(18px + env(safe-area-inset-top,0px)) 10px calc(18px + env(safe-area-inset-bottom,0px))',boxSizing:'border-box',touchAction:'pan-y'});
  document.body.appendChild(ov);
  for(const type of ['pointerdown','pointerup','touchstart','touchend','click'])ov.addEventListener(type,e=>e.stopPropagation(),{passive:false});
  return ov;
}
function splitNamesV188(rows){return rows.map(([id])=>player(id)?.name||id).join(' / ');}
function renderLilithSplitV188(ov,split,resolve){
  const roster=splitRowsV188(),team=id=>split.A.some(r=>r[0]===id)?'A':'B';
  ov.hidden=false;ov.style.display='flex';
  ov.innerHTML=`<section style="width:min(96vw,540px);margin:auto 0;background:#f8eee2;color:#241b20;border:4px solid #7b315f;border-radius:22px;padding:14px;box-sizing:border-box;box-shadow:0 20px 60px #000;max-height:94vh;overflow:auto;font-family:inherit">
    <small style="display:block;font-size:9px;font-weight:900;letter-spacing:.16em;color:#78516f">PARTY SPLIT / v188</small>
    <h2 style="margin:4px 0 7px;font-size:19px">リリス四姉妹戦 パーティー編成</h2>
    <p style="font-size:10px;line-height:1.55;margin:0 0 9px">仲間をタップしてA/Bの2パーティーに分けてください。</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:9px">
      <div style="background:#64284f;color:#fff;border-radius:11px;padding:8px"><b>Aパーティー</b><small style="display:block;line-height:1.45;margin-top:3px">モブリリス<br>モブヘルリリス<br>モブキリンリリス</small></div>
      <div style="background:#28536d;color:#fff;border-radius:11px;padding:8px"><b>Bパーティー</b><small style="display:block;line-height:1.45;margin-top:3px">モブクフリリス<br>モブリヴァリリス</small></div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px">${roster.map(([id,lv])=>{const q=player(id),t=team(id);return `<button type="button" data-v188-member="${id}" style="min-height:64px;display:grid;grid-template-columns:28px 1fr 40px;gap:5px;align-items:center;text-align:left;border:2px solid ${t==='A'?'#a33e61':'#3979aa'};background:${t==='A'?'#fff1f5':'#eef8ff'};color:#211921;border-radius:11px;padding:5px"><strong style="font-size:15px">${t}</strong><span><b style="display:block;font-size:10px">${q.name}</b><small>Lv${lv}</small></span><img src="${versionedPlay(q.image)}" alt="${q.name}" style="width:38px;height:48px;object-fit:contain"></button>`}).join('')}</div>
    <div style="display:flex;gap:7px;justify-content:center;margin:10px 0"><b style="background:#64284f;color:#fff;padding:5px 10px;border-radius:999px">A ${split.A.length}人</b><b style="background:#28536d;color:#fff;padding:5px 10px;border-radius:999px">B ${split.B.length}人</b></div>
    <div data-v188-confirm><button type="button" data-v188-decide style="width:100%;height:44px;border:0;border-radius:11px;background:#79355f;color:#fff;font-weight:900;font-size:12px">編成を決定</button></div>
  </section>`;
  bindImages(ov);
  ov.querySelectorAll('[data-v188-member]').forEach(btn=>btn.onclick=e=>{
    e.preventDefault();e.stopPropagation();
    const id=canonicalPlayerId(btn.dataset.v188Member),from=split.A.some(r=>r[0]===id)?split.A:split.B,to=from===split.A?split.B:split.A;
    if(from.length<=1)return toast('A/Bどちらにも1人以上必要です');
    const i=from.findIndex(r=>r[0]===id);if(i<0)return;
    to.push(from.splice(i,1)[0]);renderLilithSplitV188(ov,split,resolve);
  });
  ov.querySelector('[data-v188-decide]').onclick=e=>{
    e.preventDefault();e.stopPropagation();
    if(!split.A.length||!split.B.length)return toast('A/Bどちらにもメンバーが必要です');
    const box=ov.querySelector('[data-v188-confirm]');
    box.innerHTML=`<div style="background:#fff;border:2px solid #80536f;border-radius:12px;padding:10px"><b style="display:block;font-size:12px;margin-bottom:6px">このパーティーで挑みますか？</b><small style="display:block;line-height:1.55;margin-bottom:9px">A：${splitNamesV188(split.A)}<br>B：${splitNamesV188(split.B)}</small><div style="display:grid;grid-template-columns:1fr 1fr;gap:7px"><button type="button" data-v188-yes style="height:42px;border:0;border-radius:10px;background:#79355f;color:#fff;font-weight:900">はい</button><button type="button" data-v188-no style="height:42px;border:1px solid #866b7e;border-radius:10px;background:#eee3e9;color:#2a2027;font-weight:900">いいえ</button></div></div>`;
    box.querySelector('[data-v188-no]').onclick=ev=>{ev.preventDefault();ev.stopPropagation();renderLilithSplitV188(ov,split,resolve);};
    box.querySelector('[data-v188-yes]').onclick=ev=>{
      ev.preventDefault();ev.stopPropagation();
      state.meta??={};state.meta.lilithSplit={A:clone(split.A),B:clone(split.B)};saveMeta();
      state.adventure??={};
      state.adventure.lilithSplitReadyV183=true;
      state.adventure.lilithSplitReadyV185=true;
      state.adventure.lilithSplitReadyV186=true;
      state.adventure.lilithSplitReadyV188=true;
      saveAdventure();
      lilithSplitConfirmedSessionV188=true;
      ov.hidden=true;ov.style.display='none';ov.innerHTML='';
      resolve(clone(state.meta.lilithSplit));
    };
  };
}
async function chooseLilithSplitV188(){
  const roster=splitRowsV188();
  if(roster.length<2){toast('2パーティー戦には2人以上の仲間が必要です');throw new Error('v188 lilith split requires two members');}
  const ov=ensureLilithOverlayV188(),split=normalizeLilithSplitV188();
  return await new Promise(resolve=>renderLilithSplitV188(ov,split,resolve));
}

/* Conversation lock: permit only the v188 formation while storyBusy is true. */
const conversationAllowedTargetBaseV188=conversationAllowedTargetV171;
conversationAllowedTargetV171=target=>!!target?.closest?.('#lilithSplitOverlayV188')||conversationAllowedTargetBaseV188(target);

/* Guarantee exactly one split opcode, placed immediately after the authored narration. */
const lilithEventV188=STORY_EVENTS['pre:demonCastle:2'];
if(lilithEventV188?.steps){
  const cleaned=lilithEventV188.steps.filter(st=>!['lilithSplit','lilithSplitV186','lilithSplitV188'].includes(st?.[0]));
  const i=cleaned.findIndex(st=>st?.[0]==='narrate'&&String(st?.[1]||'').includes('パーティーを2つ作ってください'));
  cleaned.splice(i>=0?i+1:cleaned.length,0,['lilithSplitV188']);
  lilithEventV188.steps=cleaned;
}

const runStoryStepsBaseV188=runStorySteps;
runStorySteps=async function(steps=[]){
  for(const st of steps){
    if(st?.[0]==='lilithSplitV188')await chooseLilithSplitV188();
    else await runStoryStepsBaseV188([st]);
  }
};

/* Dedicated AREA 3 continuation. Do not call the stale v183-v186 wrappers here. */
const startAdventureBattleBaseV188=startAdventureBattle;
startAdventureBattle=async function(){
  const w=currentWorld(),areaIndex=Number(state.adventure?.areaIndex)||0;
  if(w?.id!=='demonCastle'||areaIndex!==2)return startAdventureBattleBaseV188();
  if(!state.adventure.battleReady||state.adventure.completed||state.adventure.awaitingReport||storyBusy)return;

  const enc=state.adventure.pendingEncounter||createAdventureEncounter();
  const area=currentArea();
  const bossEncounter=(((state.adventure.battleIndex||0)===2)||!!w.oneBattlePerArea)&&!!enc?.bossBattle;
  if(!bossEncounter)return startAdventureBattleBaseV188();

  const preKey='pre:demonCastle:2';
  if(!storyDone(preKey)){
    const ran=await runStoryEvent(preKey);
    if(!ran&&!storyDone(preKey))return;
  }else if(!validLilithSplitV188()){
    await chooseLilithSplitV188();
  }

  /* If a migrated save already has a valid split, use it without an extra popup. */
  if(!validLilithSplitV188())await chooseLilithSplitV188();
  lilithSplitConfirmedSessionV188=true;

  const split=currentLilithSplit();
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

window.__mobBuildVersion='v188';
window.__mobV188LilithFlowFix=true;
window.__mobV188Diagnostics=()=>({
  world:currentWorld()?.id||'',area:Number(state.adventure?.areaIndex)||0,
  splitValid:validLilithSplitV188(),confirmed:lilithSplitConfirmedSessionV188,
  stepTypes:(STORY_EVENTS['pre:demonCastle:2']?.steps||[]).map(st=>st?.[0]),
  splitIndex:(STORY_EVENTS['pre:demonCastle:2']?.steps||[]).findIndex(st=>st?.[0]==='lilithSplitV188')
});
})();
// UPDATE_V188_END
