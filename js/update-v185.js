// UPDATE_V185_BEGIN
/* v185: hard fix for Demon Castle Lilith split-party freeze.
   The five-sister reveal now opens an independent formation UI immediately,
   without relying on the older story-step modal chain. */
;(()=>{
const SPLIT_Z_V185='2147483000';
function splitRowsV185(){
  const seen=new Set(),out=[];
  for(const row of (state.party||[])){
    const id=canonicalPlayerId(row?.[0]);
    if(!id||seen.has(id)||!player(id))continue;
    seen.add(id);out.push([id,Number(row?.[1])||5]);
  }
  return out;
}
function normalizeSplitHardV185(storageKey){
  const roster=splitRowsV185(),valid=new Map(roster.map(r=>[r[0],r])),used=new Set();
  const saved=state.meta?.[storageKey];
  const clean=list=>(Array.isArray(list)?list:[]).map(r=>canonicalPlayerId(r?.[0])).filter(id=>id&&valid.has(id)&&!used.has(id)&&used.add(id)).map(id=>[...valid.get(id)]);
  let A=clean(saved?.A),B=clean(saved?.B);
  for(const row of roster)if(!used.has(row[0]))(A.length<=B.length?A:B).push([...row]);
  if(!A.length||!B.length){A=[];B=[];roster.forEach((r,i)=>(i%2?B:A).push([...r]));if(!B.length&&A.length>1)B.push(A.pop());}
  return {A,B};
}
function ensureSplitHardOverlayV185(){
  let ov=document.getElementById('splitPartyOverlayV185');
  if(ov)return ov;
  ov=document.createElement('div');ov.id='splitPartyOverlayV185';ov.hidden=true;
  Object.assign(ov.style,{position:'fixed',inset:'0',zIndex:SPLIT_Z_V185,background:'rgba(3,4,10,.94)',display:'flex',alignItems:'flex-start',justifyContent:'center',overflow:'auto',padding:'calc(18px + env(safe-area-inset-top,0px)) 10px calc(18px + env(safe-area-inset-bottom,0px))',boxSizing:'border-box',touchAction:'pan-y'});
  document.body.appendChild(ov);
  for(const type of ['pointerdown','pointerup','touchstart','touchend','click'])ov.addEventListener(type,e=>{e.stopPropagation();},{passive:false});
  return ov;
}
function splitNamesV185(rows){return rows.map(([id])=>player(id)?.name||id).join(' / ')}
function renderSplitHardV185(ov,split,opt,resolve){
  const roster=splitRowsV185(),teamOf=id=>split.A.some(r=>r[0]===id)?'A':'B';
  ov.hidden=false;ov.style.display='flex';
  ov.innerHTML=`<section style="width:min(96vw,520px);margin:auto 0;background:#f6eadb;color:#251b1e;border:4px solid #6d2e62;border-radius:22px;padding:14px;box-sizing:border-box;box-shadow:0 18px 55px #000;max-height:94vh;overflow:auto;font-family:inherit">
    <small style="display:block;font-size:9px;font-weight:900;letter-spacing:.14em;color:#774c70">PARTY SPLIT / v186</small>
    <h2 style="margin:4px 0 8px;font-size:19px">${opt.title}</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:9px">
      <div style="background:#5b294b;color:white;border-radius:11px;padding:8px"><b>Aグループ</b><small style="display:block;line-height:1.45;margin-top:3px">${opt.aEnemies}</small></div>
      <div style="background:#294c6a;color:white;border-radius:11px;padding:8px"><b>Bグループ</b><small style="display:block;line-height:1.45;margin-top:3px">${opt.bEnemies}</small></div>
    </div>
    <p style="font-size:10px;margin:6px 0 9px">仲間をタップするとA/Bを移動します。</p>
    <div data-v185-roster style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px">${roster.map(([id,lv])=>{const q=player(id),team=teamOf(id);return `<button type="button" data-v185-member="${id}" style="min-height:62px;display:grid;grid-template-columns:30px 1fr auto;gap:5px;align-items:center;text-align:left;border:2px solid ${team==='A'?'#a33c60':'#3979aa'};background:${team==='A'?'#fff0f4':'#eef7ff'};color:#211921;border-radius:11px;padding:5px"><strong style="font-size:15px">${team}</strong><span><b style="display:block;font-size:10px">${q.name}</b><small>Lv${lv}</small></span><img src="${versionedPlay(q.image)}" alt="${q.name}" style="width:38px;height:48px;object-fit:contain"></button>`}).join('')}</div>
    <div style="display:flex;gap:7px;justify-content:center;margin:10px 0"><b style="background:#5b294b;color:#fff;padding:5px 10px;border-radius:999px">A ${split.A.length}人</b><b style="background:#294c6a;color:#fff;padding:5px 10px;border-radius:999px">B ${split.B.length}人</b></div>
    <div data-v185-confirm-area><button type="button" data-v185-confirm style="width:100%;height:44px;border:0;border-radius:11px;background:#74345f;color:#fff;font-weight:900;font-size:12px">編成を決定</button></div>
  </section>`;
  bindImages(ov);
  ov.querySelectorAll('[data-v185-member]').forEach(btn=>btn.onclick=e=>{e.preventDefault();e.stopPropagation();const id=canonicalPlayerId(btn.dataset.v185Member),from=split.A.some(r=>r[0]===id)?split.A:split.B,to=from===split.A?split.B:split.A;if(from.length<=1){toast('A/Bどちらにも1人以上必要です');return;}const i=from.findIndex(r=>r[0]===id);if(i<0)return;to.push(from.splice(i,1)[0]);renderSplitHardV185(ov,split,opt,resolve);});
  ov.querySelector('[data-v185-confirm]').onclick=e=>{e.preventDefault();e.stopPropagation();if(!split.A.length||!split.B.length){toast('A/Bどちらにもメンバーが必要です');return;}const area=ov.querySelector('[data-v185-confirm-area]');area.innerHTML=`<div style="background:#fff;border:2px solid #7c536f;border-radius:12px;padding:10px"><b style="display:block;font-size:12px;margin-bottom:5px">このパーティーで挑みますか？</b><small style="display:block;line-height:1.55;margin-bottom:9px">A：${splitNamesV185(split.A)}<br>B：${splitNamesV185(split.B)}</small><div style="display:grid;grid-template-columns:1fr 1fr;gap:7px"><button type="button" data-v185-yes style="height:42px;border:0;border-radius:10px;background:#74345f;color:#fff;font-weight:900">はい</button><button type="button" data-v185-no style="height:42px;border:1px solid #866b7e;border-radius:10px;background:#eee3e9;color:#2a2027;font-weight:900">いいえ</button></div></div>`;
    area.querySelector('[data-v185-no]').onclick=ev=>{ev.preventDefault();ev.stopPropagation();renderSplitHardV185(ov,split,opt,resolve);};
    area.querySelector('[data-v185-yes]').onclick=ev=>{ev.preventDefault();ev.stopPropagation();state.meta??={};state.meta[opt.storageKey]={A:clone(split.A),B:clone(split.B)};saveMeta();state.adventure??={};if(opt.storageKey==='lilithSplit'){state.adventure.lilithSplitReadyV183=true;state.adventure.lilithSplitReadyV185=true;}if(opt.storageKey==='demonCastle2SplitV181'){state.adventure.demonCastle2SplitReadyV183=true;state.adventure.demonCastle2SplitReadyV185=true;}saveAdventure();ov.hidden=true;ov.style.display='none';ov.innerHTML='';resolve(clone(state.meta[opt.storageKey]));};
  };
}
async function chooseSplitHardV185(opt){
  const roster=splitRowsV185();
  if(roster.length<2){toast('2パーティー戦には2人以上の仲間が必要です');throw new Error('v185 split requires at least two party members');}
  const ov=ensureSplitHardOverlayV185(),split=normalizeSplitHardV185(opt.storageKey);
  return await new Promise(resolve=>renderSplitHardV185(ov,split,opt,resolve));
}
const LILITH_OPT_V185={storageKey:'lilithSplit',title:'リリス四姉妹戦 パーティー編成',aEnemies:'モブリリス / モブヘルリリス / モブキリンリリス',bEnemies:'モブクフリリス / モブリヴァリリス'};
const DC2_OPT_V185={storageKey:'demonCastle2SplitV181',title:'魔王城Ⅱ A/Bグループ編成',aEnemies:'モブヘルリリス / モブリリス / モブキリンリリス',bEnemies:'モブクフリリス / モブリリス / モブリヴァリリス'};

/* Conversation lock must explicitly allow this modal because it appears while storyBusy=true. */
const conversationAllowedTargetBaseV185=conversationAllowedTargetV171;
conversationAllowedTargetV171=target=>!!target?.closest?.('#splitPartyOverlayV185')||conversationAllowedTargetBaseV185(target);

/* Crucial fix: the user's freeze is at the five-sister reveal, BEFORE the old
   lilithSplit step. Open formation right there, then let the authored dialogue continue. */
const lilithFamilyRoseSummonBaseV185=lilithFamilyRoseSummonV180;
lilithFamilyRoseSummonV180=async function(){
  await lilithFamilyRoseSummonBaseV185();
  if(!state.adventure?.lilithSplitReadyV185)await chooseSplitHardV185(LILITH_OPT_V185);
};

/* If execution reaches the authored split opcode later, do not ask twice. */
chooseLilithSplit=async function(){
  if(state.adventure?.lilithSplitReadyV185&&state.meta?.lilithSplit)return clone(state.meta.lilithSplit);
  return chooseSplitHardV185(LILITH_OPT_V185);
};

/* Replace the v181 split entry point too, so Demon Castle II uses the same hard modal. */
const chooseSplitV181BaseV185=chooseSplitV181;
chooseSplitV181=async function(opt){
  if(opt?.storageKey==='lilithSplit')return chooseLilithSplit();
  if(opt?.storageKey==='demonCastle2SplitV181'){
    if(state.adventure?.demonCastle2SplitReadyV185&&state.meta?.demonCastle2SplitV181)return clone(state.meta.demonCastle2SplitV181);
    return chooseSplitHardV185(DC2_OPT_V185);
  }
  return chooseSplitV181BaseV185(opt);
};

/* Fresh explicit opcode guard at the top of the story-step chain. */
const runStoryStepsBaseV185=runStorySteps;
runStorySteps=async function(steps=[]){
  for(const st of steps){
    if(st?.[0]==='lilithSplit')await chooseLilithSplit();
    else if(st?.[0]==='dc2Split181')await chooseSplitV181(DC2_OPT_V185);
    else await runStoryStepsBaseV185([st]);
  }
};

window.__mobV185LilithSplitHardFix=true;
})();
// UPDATE_V185_END
