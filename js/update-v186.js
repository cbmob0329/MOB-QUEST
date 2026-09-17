// UPDATE_V186_BEGIN
/* v186: Demon Castle Area 3 split formation is shown at the authored point:
   AFTER all dialogue + the party-split narration. No early popup at the five-Lilith reveal.
   Persisted ready flags from older builds are deliberately ignored for this scene. */
;(()=>{
let lilithSplitConfirmedThisSessionV186=false;

/* Undo v185's early popup hook. Keep only the original rose summon visual here. */
lilithFamilyRoseSummonV180=async function(){
  const fx=castleFxV180('rose-ultimate-v180');
  try{await demonLilithSummonV106();await fixedDelay(650);}finally{fx?.remove();}
};

function splitRowsV186(){
  const seen=new Set(),rows=[];
  for(const row of (state.party||[])){
    const id=canonicalPlayerId(row?.[0]);
    if(!id||seen.has(id)||!player(id))continue;
    seen.add(id);rows.push([id,Number(row?.[1])||5]);
  }
  return rows;
}
function normalizedLilithSplitV186(){
  const roster=splitRowsV186(),byId=new Map(roster.map(r=>[r[0],r])),used=new Set();
  const saved=state.meta?.lilithSplit;
  const take=list=>(Array.isArray(list)?list:[]).map(r=>canonicalPlayerId(r?.[0])).filter(id=>id&&byId.has(id)&&!used.has(id)&&used.add(id)).map(id=>[...byId.get(id)]);
  let A=take(saved?.A),B=take(saved?.B);
  for(const row of roster)if(!used.has(row[0]))(A.length<=B.length?A:B).push([...row]);
  if(!A.length||!B.length){A=[];B=[];roster.forEach((r,i)=>(i%2?B:A).push([...r]));if(!B.length&&A.length>1)B.push(A.pop());}
  return {A,B};
}
function ensureLilithOverlayV186(){
  let ov=document.getElementById('lilithSplitOverlayV186');
  if(!ov){
    ov=document.createElement('div');ov.id='lilithSplitOverlayV186';ov.hidden=true;
    Object.assign(ov.style,{position:'fixed',inset:'0',zIndex:'2147483600',background:'rgba(4,4,10,.96)',display:'none',alignItems:'flex-start',justifyContent:'center',overflowY:'auto',padding:'calc(18px + env(safe-area-inset-top,0px)) 10px calc(18px + env(safe-area-inset-bottom,0px))',boxSizing:'border-box',touchAction:'pan-y'});
    document.body.appendChild(ov);
    for(const type of ['pointerdown','pointerup','touchstart','touchend','click'])ov.addEventListener(type,e=>{e.stopPropagation();},{passive:false});
  }
  return ov;
}
function namesV186(rows){return rows.map(([id])=>player(id)?.name||id).join(' / ');}
function renderLilithFormationV186(ov,split,resolve){
  const roster=splitRowsV186(),team=id=>split.A.some(r=>r[0]===id)?'A':'B';
  ov.hidden=false;ov.style.display='flex';
  ov.innerHTML=`<section style="width:min(96vw,540px);margin:auto 0;background:#f8eee2;color:#241b20;border:4px solid #7b315f;border-radius:22px;padding:14px;box-sizing:border-box;box-shadow:0 20px 60px #000;max-height:94vh;overflow:auto;font-family:inherit">
    <small style="display:block;font-size:9px;font-weight:900;letter-spacing:.16em;color:#78516f">PARTY SPLIT / v186</small>
    <h2 style="margin:4px 0 7px;font-size:19px">リリス四姉妹戦 パーティー編成</h2>
    <p style="font-size:10px;line-height:1.55;margin:0 0 9px">A/Bの2パーティーを作ってください。仲間をタップすると移動します。</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:9px">
      <div style="background:#64284f;color:#fff;border-radius:11px;padding:8px"><b>Aパーティー</b><small style="display:block;line-height:1.45;margin-top:3px">モブリリス<br>モブヘルリリス<br>モブキリンリリス</small></div>
      <div style="background:#28536d;color:#fff;border-radius:11px;padding:8px"><b>Bパーティー</b><small style="display:block;line-height:1.45;margin-top:3px">モブクフリリス<br>モブリヴァリリス</small></div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px">${roster.map(([id,lv])=>{const q=player(id),t=team(id);return `<button type="button" data-v186-member="${id}" style="min-height:64px;display:grid;grid-template-columns:28px 1fr 40px;gap:5px;align-items:center;text-align:left;border:2px solid ${t==='A'?'#a33e61':'#3979aa'};background:${t==='A'?'#fff1f5':'#eef8ff'};color:#211921;border-radius:11px;padding:5px"><strong style="font-size:15px">${t}</strong><span><b style="display:block;font-size:10px">${q.name}</b><small>Lv${lv}</small></span><img src="${versionedPlay(q.image)}" alt="${q.name}" style="width:38px;height:48px;object-fit:contain"></button>`}).join('')}</div>
    <div style="display:flex;gap:7px;justify-content:center;margin:10px 0"><b style="background:#64284f;color:#fff;padding:5px 10px;border-radius:999px">A ${split.A.length}人</b><b style="background:#28536d;color:#fff;padding:5px 10px;border-radius:999px">B ${split.B.length}人</b></div>
    <div data-v186-confirm><button type="button" data-v186-decide style="width:100%;height:44px;border:0;border-radius:11px;background:#79355f;color:#fff;font-weight:900;font-size:12px">編成を決定</button></div>
  </section>`;
  bindImages(ov);
  ov.querySelectorAll('[data-v186-member]').forEach(btn=>btn.onclick=e=>{
    e.preventDefault();e.stopPropagation();
    const id=canonicalPlayerId(btn.dataset.v186Member),from=split.A.some(r=>r[0]===id)?split.A:split.B,to=from===split.A?split.B:split.A;
    if(from.length<=1)return toast('A/Bどちらにも1人以上必要です');
    const i=from.findIndex(r=>r[0]===id);if(i<0)return;to.push(from.splice(i,1)[0]);renderLilithFormationV186(ov,split,resolve);
  });
  ov.querySelector('[data-v186-decide]').onclick=e=>{
    e.preventDefault();e.stopPropagation();
    if(!split.A.length||!split.B.length)return toast('A/Bどちらにもメンバーが必要です');
    const box=ov.querySelector('[data-v186-confirm]');
    box.innerHTML=`<div style="background:#fff;border:2px solid #80536f;border-radius:12px;padding:10px"><b style="display:block;font-size:12px;margin-bottom:6px">このパーティーで挑みますか？</b><small style="display:block;line-height:1.55;margin-bottom:9px">A：${namesV186(split.A)}<br>B：${namesV186(split.B)}</small><div style="display:grid;grid-template-columns:1fr 1fr;gap:7px"><button type="button" data-v186-yes style="height:42px;border:0;border-radius:10px;background:#79355f;color:#fff;font-weight:900">はい</button><button type="button" data-v186-no style="height:42px;border:1px solid #866b7e;border-radius:10px;background:#eee3e9;color:#2a2027;font-weight:900">いいえ</button></div></div>`;
    box.querySelector('[data-v186-no]').onclick=ev=>{ev.preventDefault();ev.stopPropagation();renderLilithFormationV186(ov,split,resolve);};
    box.querySelector('[data-v186-yes]').onclick=ev=>{
      ev.preventDefault();ev.stopPropagation();
      state.meta??={};state.meta.lilithSplit={A:clone(split.A),B:clone(split.B)};saveMeta();
      state.adventure??={};state.adventure.lilithSplitReadyV183=true;state.adventure.lilithSplitReadyV185=true;state.adventure.lilithSplitReadyV186=true;saveAdventure();
      lilithSplitConfirmedThisSessionV186=true;
      ov.hidden=true;ov.style.display='none';ov.innerHTML='';
      resolve(clone(state.meta.lilithSplit));
    };
  };
}
async function chooseLilithSplitV186(){
  const roster=splitRowsV186();
  if(roster.length<2){toast('2パーティー戦には2人以上の仲間が必要です');throw new Error('v186 lilith split requires two members');}
  const ov=ensureLilithOverlayV186(),split=normalizedLilithSplitV186();
  return await new Promise(resolve=>renderLilithFormationV186(ov,split,resolve));
}

/* Allow only the dedicated formation UI through the conversation input lock. */
const conversationAllowedBaseV186=conversationAllowedTargetV171;
conversationAllowedTargetV171=target=>!!target?.closest?.('#lilithSplitOverlayV186')||conversationAllowedBaseV186(target);

/* Replace only the authored opcode, which sits AFTER Money's line + narrator. */
const evV186=STORY_EVENTS['pre:demonCastle:2'];
if(evV186?.steps)evV186.steps=evV186.steps.map(st=>st?.[0]==='lilithSplit'?['lilithSplitV186']:st);
const runStoryStepsBaseV186=runStorySteps;
runStorySteps=async function(steps=[]){
  for(const st of steps){
    if(st?.[0]==='lilithSplitV186')await chooseLilithSplitV186();
    else await runStoryStepsBaseV186([st]);
  }
};

/* If an old save already consumed the pre-event, force formation immediately before battle.
   This ignores stale persisted ready flags; only a confirmation in THIS page session counts. */
const startAdventureBattleBaseV186=startAdventureBattle;
startAdventureBattle=async function(){
  const w=currentWorld(),areaIndex=Number(state.adventure?.areaIndex)||0;
  if(w?.id==='demonCastle'&&areaIndex===2&&storyDone('pre:demonCastle:2')&&!lilithSplitConfirmedThisSessionV186){
    await chooseLilithSplitV186();
  }
  return startAdventureBattleBaseV186();
};

/* Build marker visible from title/version areas that use runtime build text. */
window.__mobBuildVersion='v186';
window.__mobV186LilithFormationPointFix=true;
})();
// UPDATE_V186_END
