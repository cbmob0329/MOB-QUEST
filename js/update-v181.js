// UPDATE_V181_BEGIN
(function(){
'use strict';

/* v181: split-party stability, gacha result lock, event visibility/restricted parties,
   and the latest Demon Castle II presentation. */

/* ---------- Robust two-party formation ---------- */
function validPartyRowsV181(){
  const seen=new Set(),out=[];
  for(const row of state.party||[]){
    const id=canonicalPlayerId(row?.[0]);
    if(!id||seen.has(id)||!player(id))continue;
    seen.add(id);out.push([id,Number(row?.[1])||5]);
  }
  return out;
}
function normalizeSplitV181(storageKey){
  const roster=validPartyRowsV181(),valid=new Map(roster.map(r=>[r[0],r])),used=new Set();
  const saved=state.meta?.[storageKey];
  const clean=list=>(Array.isArray(list)?list:[]).map(r=>canonicalPlayerId(r?.[0])).filter(id=>id&&valid.has(id)&&!used.has(id)&&used.add(id)).map(id=>[...valid.get(id)]);
  let A=clean(saved?.A),B=clean(saved?.B);
  for(const row of roster)if(!used.has(row[0]))(A.length<=B.length?A:B).push([...row]);
  if(!A.length||!B.length){A=[];B=[];roster.forEach((r,i)=>(i%2?B:A).push([...r]));if(!B.length&&A.length>1)B.push(A.pop());}
  return {A,B};
}
function renderSplitV181(overlay,split,opt){
  const roster=validPartyRowsV181(),teamOf=id=>split.A.some(r=>r[0]===id)?'A':'B';
  const member=(id,lv)=>{const p=player(id);if(!p)return'';const team=teamOf(id);return `<button type="button" data-v181-split-member="${id}" class="team-${team.toLowerCase()}"><em>${team}</em><img src="${versionedPlay(p.image)}" alt="${p.name}"><b>${p.name}</b><small>Lv${lv}</small></button>`;};
  overlay.innerHTML=`<div class="lilith-split-card split-card-v181"><div class="settings-head"><div><small>PARTY SPLIT</small><h2>${opt.title||'パーティーを2つに分けてください'}</h2></div></div><div class="lilith-opponents"><div><b>Aグループ</b><span>${opt.aEnemies}</span></div><div><b>Bグループ</b><span>${opt.bEnemies}</span></div></div><p>キャラクターをタップするとA/Bを移動します。</p><div class="lilith-split-roster">${roster.map(r=>member(r[0],r[1])).join('')}</div><div class="lilith-team-count"><span>A ${split.A.length}人</span><span>B ${split.B.length}人</span></div><button type="button" class="primary-btn" data-v181-split-confirm>編成を決定</button></div>`;
  bindImages(overlay);
}
async function chooseSplitV181(opt){
  const roster=validPartyRowsV181();
  if(roster.length<2){await narrationDialog('2パーティー戦には2人以上の仲間が必要です。',[['確認','ok','primary']],'PARTY SPLIT');throw new Error('split party requires at least two valid members');}
  let overlay=document.querySelector('#lilithSplitOverlay');
  if(!overlay){overlay=document.createElement('div');overlay.id='lilithSplitOverlay';overlay.className='lilith-split-overlay';document.body.appendChild(overlay);}
  overlay.hidden=false;overlay.classList.add('split-overlay-v181');overlay.style.zIndex='9999';
  const split=normalizeSplitV181(opt.storageKey);
  renderSplitV181(overlay,split,opt);
  return await new Promise(resolve=>{
    const bind=()=>{
      $$('[data-v181-split-member]',overlay).forEach(btn=>btn.onclick=e=>{e.preventDefault();e.stopPropagation();const id=canonicalPlayerId(btn.dataset.v181SplitMember),from=split.A.some(r=>r[0]===id)?split.A:split.B,to=from===split.A?split.B:split.A;if(from.length<=1)return toast('A/Bどちらにも1人以上必要です');const i=from.findIndex(r=>r[0]===id);if(i<0)return;to.push(from.splice(i,1)[0]);renderSplitV181(overlay,split,opt);bind();});
      const confirm=$('[data-v181-split-confirm]',overlay);if(confirm)confirm.onclick=async e=>{e.preventDefault();e.stopPropagation();if(!split.A.length||!split.B.length)return toast('A/Bどちらにもメンバーが必要です');if(confirm.disabled)return;confirm.disabled=true;let accepted;try{accepted=await confirmSplitInlineV210(overlay,split);}finally{confirm.disabled=false;}if(!accepted)return;state.meta[opt.storageKey]={A:clone(split.A),B:clone(split.B)};saveMeta();overlay.hidden=true;overlay.classList.remove('split-overlay-v181');resolve(state.meta[opt.storageKey]);};
    };bind();
  });
}
chooseLilithSplit=()=>chooseSplitV181({storageKey:'lilithSplit',title:'リリス四姉妹戦 パーティー編成',aEnemies:'モブリリス / モブヘルリリス / モブキリンリリス',bEnemies:'モブクフリリス / モブリヴァリリス'});
normalizeLilithSplit=()=>normalizeSplitV181('lilithSplit');

/* Demon Castle II Area 1 is A battle -> B battle, each with Lilith. */
const dc2WorldV181=(MOB_DATA.adventureWorlds||[]).find(w=>w.id==='demonCastle2');
if(dc2WorldV181?.areas?.[0]){
  dc2WorldV181.areas[0].boss=[{id:'dc2-hell',level:85},{id:'dc2-lilith',level:85},{id:'dc2-kirin',level:85}];
  dc2WorldV181.areas[0].nextWave=[{id:'dc2-kufu',level:85},{id:'dc2-lilith',level:85},{id:'dc2-riva',level:85}];
  delete dc2WorldV181.areas[0].nextWaves;
}
function currentDc2SplitV181(){return normalizeSplitV181('demonCastle2SplitV181');}
function switchBattleTeamV181(team){
  const b=state.battle;if(!b?.config?.dualPartyV181)return;
  const split=b.config.dualPartySplitV181||currentDc2SplitV181(),rows=team==='A'?split.A:split.B;
  persistAdventureVitals();persistUltimateCooldownsFromBattle();const vitals=ensureAdventureVitals();
  b.allies=rows.map(([id,lv])=>buildAlly(player(id),lv,vitals[id])).filter(Boolean);
  for(const a of b.allies){initUltimateCooldowns(a);const buff=state.adventure.areaBuff||{};for(const k of ['atk','def','spd'])if(buff[k]){a[k+'Buff']=buff[k];a[k+'BuffTurns']=99;}if(buff.mag)a.mag=Math.round(a.mag*(1+buff.mag));if(buff.all)for(const k of ['atk','mag','def','res','spd'])a[k]=Math.round(a[k]*(1+buff.all));}
  applyAreaFigureResonanceV96(b.allies,b.config);b.mainIds=b.allies.slice(0,4).map(a=>a.id);b.superIds=b.allies.slice(4,6).map(a=>a.id);b.reserveIds=b.allies.slice(6,10).map(a=>a.id);b.teamGuard=0;b.teamGuardTurns=0;b.yushaGuard=0;b.yushaGuardTurns=0;b.queue=[];b.queuePos=0;b.dualPartyTeamV181=team;saveAdventure();renderBattle();
}
const persistBattlePartyOrderBaseV181=persistBattlePartyOrder;
persistBattlePartyOrder=function(){if(state.battle?.config?.dualPartyV181)return;return persistBattlePartyOrderBaseV181();};
const spawnNextEnemyWaveBaseV181=spawnNextEnemyWave;
spawnNextEnemyWave=async function(...args){
  const b=state.battle,next=b?.pendingWaveConfigs?.[0]||[];
  if(b?.config?.dualPartyV181==='demonCastle2'&&b.dualPartyTeamV181!=='B'&&next.some(r=>['dc2-kufu','dc2-riva'].includes(r.id))){await actionCutin('Aグループ勝利！ 次はBグループの戦闘を開始します','system',1100);switchBattleTeamV181('B');}
  const enma2=next.some(r=>r.id==='dc2-enma2'),enma3=next.some(r=>r.id==='dc2-enma3');
  if(enma2||enma3){const fx=document.createElement('div');fx.className='dc2-battle-fire-v181';($('#battleScreen')||document.body).appendChild(fx);setTimeout(()=>fx.remove(),2100);}
  return spawnNextEnemyWaveBaseV181(...args);
};
const startAdventureBattleBaseV181=startAdventureBattle;
startAdventureBattle=async function(){
  const w=currentWorld(),areaIndex=Number(state.adventure?.areaIndex)||0;
  if(w?.id!=='demonCastle2'||areaIndex!==0)return startAdventureBattleBaseV181();
  if(!state.adventure.battleReady||state.adventure.completed||state.adventure.awaitingReport||storyBusy)return;
  let enc=state.adventure.pendingEncounter,area=currentArea(),bossEncounter=true,preKey='pre:demonCastle2:0';
  const expected=enc?.waves?.length===2&&enc.waves[0]?.some(r=>r.id==='dc2-lilith')&&enc.waves[1]?.some(r=>r.id==='dc2-lilith');if(!expected)enc=createAdventureEncounter();
  if(STORY_EVENTS[preKey]&&!storyDone(preKey))await runStoryEvent(preKey);
  if(!state.meta?.demonCastle2SplitV181)await chooseSplitV181({storageKey:'demonCastle2SplitV181',title:'魔王城Ⅱ A/Bグループ編成',aEnemies:'モブヘルリリス / モブリリス / モブキリンリリス',bEnemies:'モブクフリリス / モブリリス / モブリヴァリリス'});
  state.adventure.pendingEncounter=enc;saveAdventure();
  const postKey='post:demonCastle2:0',split=currentDc2SplitV181();
  await startBattleLoaded({mode:'adventure',returnScreen:'adventure',waves:enc.waves,party:split.A,useAdventureVitals:true,bg:area.bg,fallbackBg:w.fieldFallback,bossBattle:true,adventureLabel:enc.label,storyPostKey:postKey,storyWorldId:w.id,storyAreaIndex:0,worldId:w.id,returnHomeAfterAreaClear:false,dualPartyV181:'demonCastle2',dualPartySplitV181:split});
  if(state.battle?.config?.dualPartyV181)state.battle.dualPartyTeamV181='A';
};

/* ---------- Gacha: a result can only be closed by its explicit button ---------- */
const showGachaResultBaseV181=showGachaResultV115;
showGachaResultV115=function(...args){const ov=ensureGachaOverlayV96();ov.dataset.resultLockedV181='1';const p=showGachaResultBaseV181(...args);return Promise.resolve(p).finally(()=>{delete ov.dataset.resultLockedV181;});};
showGachaResultV100=showGachaResultV115;showGachaResultV96=showGachaResultV115;
document.addEventListener('click',e=>{const ov=e.target?.closest?.('#figureGachaOverlayV96');if(!ov||ov.dataset.resultLockedV181!=='1')return;if(e.target===ov){e.preventDefault();e.stopImmediatePropagation();ov.hidden=false;}},true);
document.addEventListener('pointerup',e=>{const ov=e.target?.closest?.('#figureGachaOverlayV96');if(ov?.dataset.resultLockedV181==='1'&&e.target===ov){e.preventDefault();e.stopImmediatePropagation();}},true);

/* ---------- Event quest availability & restricted-party contract ---------- */
const EVENT_PARTY_RULES_V181={custard:['pink','money','denden','nyoro']};
function eventAllowedRowsV181(key){const ids=EVENT_PARTY_RULES_V181[key];if(!ids)return state.party;const set=new Set(ids);return (state.party||[]).filter(([id])=>set.has(canonicalPlayerId(id))&&player(canonicalPlayerId(id)));}
partyV179=function(key){return eventAllowedRowsV181(key);};
let storyWhitelistV181=null;
const storyDisplayPartyIdsBaseV181=storyDisplayPartyIds;
storyDisplayPartyIds=function(extraIds=null){if(!storyWhitelistV181)return storyDisplayPartyIdsBaseV181(extraIds);return [...storyWhitelistV181];};
const sceneBaseV181=sceneV179;
sceneV179=async function(...args){const key=eventRunV174?.storyV179,rule=EVENT_PARTY_RULES_V181[key];if(!rule)return sceneBaseV181(...args);storyWhitelistV181=eventAllowedRowsV181(key).map(([id])=>canonicalPlayerId(id));try{return await sceneBaseV181(...args);}finally{storyWhitelistV181=null;}};
const quizBaseV181=quizV179;
quizV179=async function(...args){storyWhitelistV181=eventAllowedRowsV181('custard').map(([id])=>canonicalPlayerId(id));try{return await quizBaseV181(...args);}finally{storyWhitelistV181=null;}};
const startV179BaseV181=startV179;
startV179=async function(key,d=0){
  if(eventRunV174||!openV179(key,d))return false;
  const rule=EVENT_PARTY_RULES_V181[key];if(!rule)return startV179BaseV181(key,d);
  const rows=eventAllowedRowsV181(key);if(!rows.length)return toast('出撃可能キャラクターがいません');
  const q=STORY179[key],diff=q.oneTime?'':q.diffs[d]?.name||'',allowed=rule.map(id=>player(id)?.name||id).join(' / '),actual=rows.map(([id])=>player(canonicalPlayerId(id))?.name||id).join(' / ');
  const ans=await dialog(`${q.title}${diff?' '+diff:''}\n\n出撃可能キャラクター\n${allowed}\n\n今回の出撃メンバー\n${actual}\n\nこのメンバーで出発しますか？`,[['はい','yes','primary'],['いいえ','no']],'モブコーチ','play/003.png');
  if(ans!=='yes')return false;
  eventRunV174={storyV179:key,difficulty:d,area:0,vitals:{},rewarded:false};skipScopeV174='';skippedV174=false;$('#trainingFeaturePopup').hidden=true;await startSavannaAreaV174();return true;
};
const renderEventQuestsBaseV181=renderEventQuestsV163;
renderEventQuestsV163=function(){
  const test=testAllQuestsV171();
  if(eventViewV163==='story'&&selectedStoryV179){
    const unlocked=selectedStoryV179==='savanna'?worldCleared('rural'):selectedStoryV179==='hot'?worldCleared('neon'):!!STORY179[selectedStoryV179]&&worldCleared(STORY179[selectedStoryV179].unlock);
    if(!unlocked&&!test)selectedStoryV179=null;
  }
  const r=renderEventQuestsBaseV181();const root=$('#trainingFeaturePanel');if(!root)return r;
  if(eventViewV163==='menu'&&!test){const hasStory=worldCleared('rural')||worldCleared('neon')||worldCleared(STORY179.phoenix.unlock)||worldCleared(STORY179.custard.unlock)||worldCleared(STORY179.magnet.unlock);const hasBoss=eventBossesAvailableV163().length>0;if(!hasStory)$('[data-event-view=\"story\"]',root)?.remove();if(!hasBoss)$('[data-event-view=\"boss\"]',root)?.remove();}
  if(eventViewV163==='story'){
    const unlock={savanna:worldCleared('rural'),hot:worldCleared('neon'),phoenix:worldCleared(STORY179.phoenix.unlock),custard:worldCleared(STORY179.custard.unlock),magnet:worldCleared(STORY179.magnet.unlock)};
    $$('[data-story179]',root).forEach(btn=>{if(!test&&!unlock[btn.dataset.story179])btn.remove();});
  }
  if(eventViewV163==='difficulty'||eventViewV163==='story')$$('.event-difficulty-v163[disabled]',root).forEach(btn=>btn.remove());
  return r;
};


/* Latest boss sheet corrections. */
for(const id of ['dc2-hell','dc2-kirin','dc2-riva','dc2-kufu']){const t=trainingEnemyTemplate(id);if(t){t.actionCount=2;t.forceActionCount=true;t.actionCountRange=[2,2];}}
{const t=trainingEnemyTemplate('dc2-maou');if(t){t.actionCount=3;t.forceActionCount=true;t.actionCountRange=[3,3];t.damageReduction=.20;t.permanentDamageReduction=true;}}

/* ---------- Demon Castle II authored staging ---------- */
async function dc2AwakenSummonV181(){const fx=castleFxV180('rose-ultimate-v180');try{await storyShowGuests(['dc2-kirin','dc2-hell','boss-lilith-castle','dc2-riva','dc2-kufu'],{allowFive:true,compactLilith:true,raised:true,slow:true});await fixedDelay(700);}finally{fx?.remove();}}
async function dc2RoseCloneV181(){const fx=castleFxV180('rose-ultimate-v180');try{await cloneV157();await fixedDelay(500);}finally{fx?.remove();}}
async function dc2FireSummonV181(){const fx=castleFxV180('dc2-fire-summon-v181');try{await storyShowGuest('dc2-enma',{slow:true});await fixedDelay(700);}finally{fx?.remove();}}
async function dc2MaouSummonV181(){const fx=castleFxV180('dc2-hex-summon-v181');try{await storyShowGuest('dc2-maou',{slow:true});await fixedDelay(900);}finally{fx?.remove();}}
async function dc2MaouExplosionV181(){const sc=$('#storyScene'),fx=castleFxV180('dc2-maou-explosion-v181'),a=storyAnchor('dc2-maou');try{sc?.classList.add('shake');if(a)await animateV157(a,[{translate:'0 0',filter:'brightness(1)',opacity:1},{translate:'-10px 4px',filter:'brightness(2)',opacity:1,offset:.2},{translate:'12px -5px',filter:'brightness(4)',opacity:.85,offset:.55},{translate:'0 0',filter:'brightness(8)',opacity:0}],5000);}finally{sc?.classList.remove('shake');fx?.remove();if(a)a.hidden=true;}}
const runStoryStepsBaseV181=runStorySteps;
runStorySteps=async function(steps=[]){for(const st of steps){if(st[0]==='jumpSayV179')await jumpSayV179(st[1],st[2]);else if(st[0]==='dc2Awaken181')await dc2AwakenSummonV181();else if(st[0]==='dc2Split181')await chooseSplitV181({storageKey:'demonCastle2SplitV181',title:'魔王城Ⅱ A/Bグループ編成',aEnemies:'モブヘルリリス / モブリリス / モブキリンリリス',bEnemies:'モブクフリリス / モブリリス / モブリヴァリリス'});else if(st[0]==='dc2RoseClone181')await dc2RoseCloneV181();else if(st[0]==='dc2FireSummon181')await dc2FireSummonV181();else if(st[0]==='dc2MaouSummon181')await dc2MaouSummonV181();else await runStoryStepsBaseV181([st]);}};

STORY_EVENTS['arrival:demonCastle2']={worldId:'demonCastle2',area:0,steps:[['jumpSayV179','pink','ついに\n最終決戦であります‼︎'],['say','desert','長かった旅もここで終わりだ\n魔王を討つ！'],['say','money','絶対許さないんだから！'],['say','nyoro','準備バッチリニョロ！'],['jumpSayV179','denden','オイラ、\nいつでもやれるでやんす～！'],['say','riro','みんなで勝ちましょウ'],['say','nekoku','オラ、みんなと勝つ'],['say','money','私と友達の魔力\n思い知らせてやるわ！'],['say','jessie','さあ行きましょう！']]};
STORY_EVENTS['pre:demonCastle2:0']={worldId:'demonCastle2',area:0,steps:[['guest','boss-lilith-castle'],['say','boss-lilith-castle','ようこそ、また会ったね'],['say','money','モブリリス！'],['say','tetsu','No.2がここで登場でござるか？'],['say','boss-lilith-castle','レコードを揃えたんだね\n僕も揃えたかったな'],['say','jessie','大人しく道を開けなさい！'],['say','boss-lilith-castle','君たちこそ、大人しく帰った方がいいよ'],['say','boss-lilith-castle','今回は、容赦しない'],['dc2Awaken181'],['say','boss-lilith-castle','さあ、遊ぼうか'],['say','kaijin','俺の初陣にはピッタリの相手だな！'],['say','nyoro','力を合わせるニョロ！'],['narrate','パーティーを2つに分けてください\nAグループとBグループで連戦します'],['dc2Split181'],['narrate','Aグループの戦闘を開始します']]};
STORY_EVENTS['post:demonCastle2:0']={worldId:'demonCastle2',area:0,steps:[['guest','boss-lilith-castle'],['say','boss-lilith-castle','あ～あ\nムカつくなぁ'],['roseFade180','boss-lilith-castle'],['say','denden','モブリリスを追うでやんす！'],['say','riro','彼女を放っておくのは危険ネ'],['narrate','キャンプでパーティーを再編成出来ます']]};
STORY_EVENTS['pre:demonCastle2:1']={worldId:'demonCastle2',area:1,steps:[['lilithRoseSummon180'],['say','boss-lilith-castle','君たちもしつこいねー\nでも、さすがだね'],['say','pink','少しは見直したでありますか？'],['say','boss-lilith-castle','まあね\nでも\n来ない方が良かった'],['say','desert','お前の目的はなんだ？\nなぜ魔王に加担する？'],['say','boss-lilith-castle','僕の闇を抑えられるのは\n魔王様だけ'],['say','boss-lilith-castle','闇は僕を食べようとしてる\n僕はまだ消えたくない'],['say','money','じゃあ戦いなさいよ！\nあんたはそんな弱虫じゃないでしょ！'],['say','boss-lilith-castle','君とは境遇が似ているね\nネオン街の魔女'],['say','boss-lilith-castle','だから\nちょっとムカつく'],['say','jessie','モブリリス、、'],['say','desert','もはや必要なのは言葉ではない\n戦うぞ！'],['say','boss-lilith-castle','言ったでしょ？\n僕、強いよ'],['dc2RoseClone181'],['say','boss-lilith-castle','消えろ']]};
STORY_EVENTS['post:demonCastle2:1']={worldId:'demonCastle2',area:1,steps:[['guest','dc2-lilith'],['say','dc2-lilith','僕が、負けた、、\n僕は、、、'],['roseFade180','dc2-lilith'],['say','money','また会いましょう'],['say','pink','モブリリス\n好敵手でありました！'],['say','jessie','出会い方が違えば\n友達になれたかもね']]};
STORY_EVENTS['pre:demonCastle2:2']={worldId:'demonCastle2',area:2,steps:[['dc2FireSummon181'],['say','dc2-enma','まさかモブリリスがやられるとはな'],['say','kaijin','こりゃ強そうなのが出て来たな'],['say','nekoku','こいつ、危険\n地獄の番人'],['say','nekoku','モブ閻魔'],['say','dc2-enma','魔王の助っ人に来て正解だったな\nここから先へは通さない'],['say','desert','誰が相手でも\n俺たちは引かない！'],['say','denden','やってやるでやんす！'],['say','money','閻魔が何よ！\n魔女の力見せてやるわ！'],['say','tetsu','最高の強者、楽しみでござる！']]};
STORY_EVENTS['post:demonCastle2:2']={worldId:'demonCastle2',area:2,steps:[['guest','dc2-enma3'],['say','dc2-enma3','私は地獄の王・・\n滅びは・・しない・・'],['fadeV157','dc2-enma3'],['say','nyoro','地獄には\n行きたくないニョロ・・'],['jumpSayV179','pink','さあみなさん\n準備はいいですか？'],['say','denden','バッチリでやんす！'],['say','riro','最後の戦いでス'],['say','jessie','しっかり準備して挑みましょう！']]};
STORY_EVENTS['pre:demonCastle2:3']={worldId:'demonCastle2',area:3,steps:[['dc2MaouSummon181'],['say','dc2-maou','よくぞここまで来た\n勇者よ\nあのヒーローの力を得たのだな'],['say','pink','勇者様は無敵であります！'],['say','dc2-maou','あのヒーローは伝説の存在\n私のモノにする日を\n心待ちにしていたぞ‼︎'],['say','desert','それが狙いか'],['say','dc2-maou','私は全てを超越する魔王'],['say','money','あんたなんかに渡すもんですか！'],['say','jessie','あなたを倒せば全て終わる！'],['say','dc2-maou','お前達では不可能だ'],['say','nyoro','平和を取り戻すニョロ！'],['say','denden','オイラ、やるんでやんす！'],['say','nekoku','オラ、やる気だ！'],['say','dc2-maou','その他大勢が偉そうに'],['say','kaijin','あのヒーローは俺の獲物だ！'],['say','riro','これで最後でス！'],['say','dc2-maou','もうよい\nかかって来るがいい'],['say','tetsu','いざ！尋常に・・'],['chorusV157']]};

/* Use the latest wording for the fusion scene. */
if(Array.isArray(FUSION_LINES_V157))FUSION_LINES_V157.splice(0,FUSION_LINES_V157.length,
 ['dc2-ulrilis','そうだ'],['dc2-ulrilis','僕が'],['dc2-ulrilis','闇の王'],['dc2-ulrilis','ウルモブリリス'],['dc2-ulrilis','闇と仲良くなるんだよ'],['money','モブリリス！'],['desert','違う\n全く別のモンスターだ‼︎'],['pink','恐れるなであります！'],['tetsu','そうでござる！'],['tetsu','皆想いは様々\nしかし'],['tetsu','魔王討伐が平和への道\nそれだけは変わらないでござる！'],['denden','・・・・'],['denden','オイラは空海の国の護衛隊長\nモブデンデン‼︎'],['denden','魔王を討伐し、\n平和を取り戻すでやんす！'],['desert','空海の国か\n魔王退治の後は空の観光だな！'],['kaijin','クライマックスか！\n俺はこういうのに慣れてるんだ！\n暴れるぜ‼︎'],['dc2-ulrilis','全部'],['dc2-ulrilis','全部終わらせる'],['dc2-ulrilis','闇こそが正義\n闇こそが平和'],['dc2-ulrilis','僕は僕のために\n僕は君たちのために\n力は惜しまない'],['pink','最終決戦、アチアチであります‼︎']);

finalBossPostV89Final=async function(){
  await openStoryScene('demonCastle2',3);await storyShowGuest('dc2-ulrilis',{slow:true});await glowV157('dc2-ulrilis',2);await storyHideGuest();await storyShowGuests(['dc2-maou','boss-lilith-castle'],{slow:true});
  await storySay('dc2-maou','馬鹿な・・\nこの私が\n勇者などに・・‼︎');await dc2MaouExplosionV181();await storyHideGuests();await storyShowGuest('boss-lilith-castle',{slow:true});await storySay('boss-lilith-castle','ウッ・・・');await storySay('money','モブリリス！\n無事なの！？');await storySay('kaijin','あのヒーローの力だ\n悪を討ち、モブリリスを救った');await storySay('boss-lilith-castle','僕だって悪だよ\n魔王軍のNo.2');await storySay('boss-lilith-castle','モブリリスだ');await storySay('jessie','いいえ\nあなたはやろうと思えば\n私達をいつでも倒せたはず');await storySay('desert','ソウルフュージョンか');await storySay('denden','使われたら終わってたでやんす');await storySay('boss-lilith-castle','買い被りすぎだよ\n使いたくなかっただけ');await storySay('boss-lilith-castle','僕にそんな資格はない');await storySay('riro','あなたはまだやり直せまス\nサクラ一族として');await storySay('riro','あなたを魔王に任命します');await chorusV169('！？','riro');
  for(const t of ['世界の秩序を守るには\nバランスが大切でス','全てのエリアに\n新たなボスが必要でス','草原にはモブテツ','砂漠にはモブデザート','田舎町にはモブデンデン','ネオン街にはモブマニー','マグマにはモブニョロ','そして','魔王城にはモブリリス\nこれで世界は守られます'])await storySay('riro',t);
  await storySay('tetsu','拙者がボスでござるか？\n平和のためならやるでござる！');await storySay('desert','砂漠は俺が守る\n安心しろ');await storySay('denden','オイラ、\nもう何も怖くないでやんす\n町を守るでやんす！');await storySay('money','私が王・・\nいや無理でしょ！');await storySay('jessie','私もサポートするから安心して');await storySay('nyoro','偉大なる王達に負けないように\n僕もっと強くなるニョロ！');await storySay('kaijin','俺は元の世界に帰るぜ\nいいものを見せてもらった');await storySay('nekoku','あれ？オラは？');await storySay('riro','海底は王がまだいますかラ\nあなたは部族村を任せまス');await storySay('nekoku','部族村か\n楽しみだ！');await storySay('denden','ピッタリだと思うでやんす');await storySay('boss-lilith-castle','僕は・・\nいや、引き受けるよ');await storySay('boss-lilith-castle','魔王として世界を回ってみたい\nだから、\n君たちのパーティーに入っていいかな？');await storySay('money','大歓迎よ！\n魔法いっぱい教えてね！');await storySay('pink','まだまだ世界には\n危険なエリアがいっぱいであります！\nこんな心強い仲間は最高であります！');await storySay('desert','これは旅の終わりであり\n旅の始まりだな');storyJoin('lilith');state.meta.finalBossDefeated=true;saveMeta();await renderStoryParty();await storySay('pink','王様に報告へ行きましょう！');await storyNarrate('モブリリスが仲間になった！');
};

/* Ending text/source corrections. Existing ending input lock remains in force. */
finalEndingV89Final=async function(){
  if(endingBusyV169)return;endingBusyV169=true;document.body.classList.add('ending-report-v169');
  try{
  await preloadEndingV157().catch(()=>{});
  await facilityTalk('※一部音の導入があります。音量にご注意ください。','ナレーション','');
  await facilityTalk('皆のもの\nほんっっっとーに！\nよくやった！','モブスライムキング','play/007.png');await facilityTalk('みんなの力で成し遂げました！','モブピンク','play/02.png');await facilityTalk('うむ\n感謝するぞ\n世界に平和が訪れた','モブスライムキング','play/007.png');await facilityTalk('勇者よ\nお主に頼んで良かった！','モブスライムキング','play/007.png');await facilityTalk('少しいいかな？','モブリリス','play/14.png');await facilityTalk('薔薇の魔女モブリリスか\n良い、話せ','モブスライムキング','play/007.png');await facilityTalk('あの町を破壊した本当の理由\n王様は知っているのかな？','モブリリス','play/14.png');await facilityTalk('・・・うむ','モブスライムキング','play/007.png');await facilityTalk('そうか\nならいい\n悪いことしたね','モブリリス','play/14.png');await facilityTalk('あの町は封印の町\n封印していたのは\nモブマニー\nそして・・\n影の世界へのゲート','モブスライムキング','play/007.png');await facilityTalk('モブマニーの解放と共に\n影の世界のゲートも開いた\n魔王様はその力を求めたんだ','モブリリス','play/14.png');await facilityTalk('これから\n新たな戦いが始まるかもしれん\n皆その時は頼むぞ！','モブスライムキング','play/007.png');await facilityTalk('今日はゆっくり休むのじゃ！\n皆の者、最高～～じゃ！！','モブスライムキング','play/007.png');
  await facilityTalk('我々の冒険は終わらないであります！\nでも\n勇者様と魔王を倒す旅は\nここでひと段落でありますね','モブピンク','play/02.png');await facilityTalk('ウキウキワクワクの\n最高の旅でありました！\nまたお会いしましょう\nみなさん','モブピンク','play/02.png');await facilityTalk('それまでお達者で！','モブピンク','play/02.png');
  await endingMontageV157();for(const line of ['ゲームクリアおめでとうございます！','レコードの間から','影の世界へ行けるようになりました！','さらに、レベル上限が120まで解放されました！','新たな武器やフィギュアも追加されていきます！','冒険はまだまだ終わりません！','ですが、','ここまで遊んでくれてありがとうございました！','CB Memory'])await endingCaptionV157(line);
  state.meta.gameCleared=true;state.meta.eventQuestUnlocked=true;state.meta.otherWorldUnlocked=true;state.meta.shadowWorldUnlocked=true;saveMeta();await fixedDelay(3000);document.querySelector('.ending-caption-v157')?.remove();await showTitle();
  }finally{endingBusyV169=false;document.body.classList.remove('ending-report-v169');}
};



/* ---------- v183: force split-party formation even on already-viewed story saves ---------- */
const chooseSplitV181BaseV183=chooseSplitV181;
chooseSplitV181=async function(opt){
  const split=await chooseSplitV181BaseV183(opt);
  state.adventure??={};
  if(opt?.storageKey==='lilithSplit')state.adventure.lilithSplitReadyV183=true;
  if(opt?.storageKey==='demonCastle2SplitV181')state.adventure.demonCastle2SplitReadyV183=true;
  saveAdventure();
  return split;
};
function splitBossEncounterV183(w,areaIndex,enc){
  return !!w&&(((state.adventure?.battleIndex||0)===2)||!!w.oneBattlePerArea)&&!!enc?.bossBattle;
}
const startAdventureBattleBaseV183=startAdventureBattle;
startAdventureBattle=async function(){
  const w=currentWorld(),areaIndex=Number(state.adventure?.areaIndex)||0;
  if(!w)return startAdventureBattleBaseV183();
  const enc=state.adventure?.pendingEncounter||createAdventureEncounter();
  const bossEncounter=splitBossEncounterV183(w,areaIndex,enc);

  /* Old saves may already have pre:demonCastle:2 marked complete, so the lilithSplit
     story step never executes. In that exact case, require the formation UI here. */
  if(w.id==='demonCastle'&&areaIndex===2&&bossEncounter&&storyDone('pre:demonCastle:2')&&!state.adventure?.lilithSplitReadyV183){
    await chooseSplitV181({storageKey:'lilithSplit',title:'リリス四姉妹戦 パーティー編成',aEnemies:'モブリリス / モブヘルリリス / モブキリンリリス',bEnemies:'モブクフリリス / モブリヴァリリス'});
  }

  /* Same guard for Demon Castle II. Fresh saves still see the authored dialogue first;
     migrated saves that already consumed the pre-event are sent to formation before battle. */
  if(w.id==='demonCastle2'&&areaIndex===0&&bossEncounter&&storyDone('pre:demonCastle2:0')&&!state.adventure?.demonCastle2SplitReadyV183){
    await chooseSplitV181({storageKey:'demonCastle2SplitV181',title:'魔王城Ⅱ A/Bグループ編成',aEnemies:'モブヘルリリス / モブリリス / モブキリンリリス',bEnemies:'モブクフリリス / モブリリス / モブリヴァリリス'});
  }
  return startAdventureBattleBaseV183();
};
window.__mobV183LilithFormationFix=true;

window.__mobV181Runtime=true;
})();
// UPDATE_V181_END
