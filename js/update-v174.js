/* v174: authored event stories and a data-driven adjacency catalogue. */
const ADJACENCY_TAGS_V174={
 '01':{name:'サバンナモンスターズ',equipment:'SPD+5 & 回避率+1% & ひるみ耐性+10%',piece:'ATK+60%・SPD+40% / 草原タグ全員の全ステータス+10%',stats:{atk:.60,spd:.40},auraTag:'41',aura:.10},
 '02':{name:'強欲モンスターズ',equipment:'DEF+5 & ダメージ軽減+1% & 会心ダメージ軽減+10%',piece:'DEF+30% / 輝きタグ全員の全ステータス+10%',stats:{def:.30},auraTag:'08',aura:.10}
};
const SAVANNA_FIGURES_V174=[
 {id:'event017',image:'eventfig/17.png',name:'モブミズサバンナ',rarity:'SR',statsText:'SPD +3',traitText:'回避率+1%',tags:['09','31','41','55'],adjacencyTags:['01']},
 {id:'event018',image:'eventfig/18.png',name:'モブカゼサバンナ',rarity:'SR',statsText:'SPD +3',traitText:'回避率+1%',tags:['02','09','41','55'],adjacencyTags:['01']},
 {id:'event019',image:'eventfig/19.png',name:'モブナギサバンナ',rarity:'SSR',statsText:'SPD +3',traitText:'回避率+3%',tags:['02','09','31','32','41','53','55'],adjacencyTags:['01']},
 {id:'event020',image:'eventfig/20.png',name:'モブメタルサバンナ',rarity:'UR',statsText:'SPD +3 & DEF +5',traitText:'ダメージ軽減+3%',tags:['08','09','32','39','41','53','55','57'],adjacencyTags:['01','02']}
];
for(const row of SAVANNA_FIGURES_V174){const old=FIGURES.find(f=>f.image===row.image);if(old)Object.assign(old,{...row,id:old.id});else FIGURES.push({...row,eventExclusiveV163:true});}
for(const n of [2,3]){const f=figureByImageV96(`eventfig/${String(n).padStart(2,'0')}.png`);if(f)f.adjacencyTags=['02'];}
function adjacentPairsV174(ids){const out=[];for(let i=0;i<ids.length-1;i++){const a=figureById(ids[i]),b=figureById(ids[i+1]);if(!a||!b)continue;for(const id of new Set(a.adjacencyTags||[]))if((b.adjacencyTags||[]).includes(id)&&ADJACENCY_TAGS_V174[id])out.push({id,left:i,right:i+1,tag:ADJACENCY_TAGS_V174[id]});}return out;}
const figureEffectsBaseV174=figureEffectsFor;
figureEffectsFor=function(pid){const out=figureEffectsBaseV174(pid);for(const p of adjacentPairsV174(figureEquipmentFor(pid)))mergeFigureEffects(out,parseFigureEffectText(p.tag.equipment));return out;};
function adjacencyMarkupV174(ids,piece=false){const pairs=adjacentPairsV174(ids);return `<section class="adjacency-v174"><b>隣接タグ ${pairs.length}件</b>${pairs.map(p=>`<span>${'ABCDE'[p.left]}↔${'ABCDE'[p.right]} ${p.tag.name}<br>${piece?p.tag.piece:p.tag.equipment}</span>`).join('')||'<span>同じ隣接タグのフィギュアを左右に並べると発動します。</span>'}</section>`;}
const resonanceMarkupBaseV174=figureResonanceMarkup;
figureResonanceMarkup=function(pid,...args){return resonanceMarkupBaseV174(pid,...args)+adjacencyMarkupV174(figureEquipmentFor(pid));};
const detailFigureBaseV174=figureDetailMarkupV96;
figureDetailMarkupV96=function(f,piece=false){return detailFigureBaseV174(f,piece)+(f?.adjacencyTags?.length?`<section class="adjacency-v174"><b>隣接タグ</b>${f.adjacencyTags.map(id=>{const t=ADJACENCY_TAGS_V174[id];return t?`<span>${id} ${t.name}<br>${piece?t.piece:t.equipment}</span>`:'';}).join('')}</section>`:'');};
let adjacencyQueueV174=Promise.resolve();
function showAdjacencyV174(pairs,piece=false){if(!pairs.length)return Promise.resolve();const task=async()=>{for(const p of pairs){const el=document.createElement('div');el.className='adjacency-up-v174';el.innerHTML=`<small>ADJACENCY · ${'ABCDE'[p.left]} ↔ ${'ABCDE'[p.right]}</small><b>${p.tag.name} 発動！</b><span>${piece?p.tag.piece:p.tag.equipment}</span>`;document.body.appendChild(el);try{await waitRealV100(1900);}finally{el.remove();}}};adjacencyQueueV174=adjacencyQueueV174.then(task,task);return adjacencyQueueV174;}
const equipFigureBaseV174=setFigureEquipment;
setFigureEquipment=function(pid,...args){const before=new Set(adjacentPairsV174(figureEquipmentFor(pid)).map(p=>`${p.id}:${p.left}`)),ok=equipFigureBaseV174(pid,...args);if(ok)void showAdjacencyV174(adjacentPairsV174(figureEquipmentFor(pid)).filter(p=>!before.has(`${p.id}:${p.left}`)));return ok;};
const pieceFightersBaseV174=pieceFightersV133;
pieceFightersV133=function(hand,...args){const rows=pieceFightersBaseV174(hand,...args),bonus=rows.map(()=>({maxHp:0,atk:0,def:0,spd:0}));for(const p of adjacentPairsV174(hand)){for(const i of [p.left,p.right])for(const [k,v]of Object.entries(p.tag.stats))bonus[i][k]+=v;for(let i=0;i<rows.length;i++)if(rows[i].f?.tags.includes(p.tag.auraTag))for(const k of Object.keys(bonus[i]))bonus[i][k]+=p.tag.aura;}rows.forEach((r,i)=>{for(const k of Object.keys(bonus[i]))r[k]=Math.max(1,Math.round(r[k]*(1+bonus[i][k])));r.hp=r.maxHp;});return rows;};
const pieceTagsBaseV174=activeTagsV103;
activeTagsV103=function(hand){return pieceTagsBaseV174(hand)+adjacencyMarkupV174(hand,true);};
async function animatePieceAdjacencyV174(pRows,cRows,b){for(const [hand,rows,label]of [[b.pHand,pRows,'プレイヤー'],[b.cHand,cRows,'CPU']])for(const p of adjacentPairsV174(hand)){const targets=rows.filter((r,i)=>i===p.left||i===p.right||r.f?.tags.includes(p.tag.auraTag)).map(r=>$(`[data-fighter-v110="${r.key}"]`)).filter(Boolean);targets.forEach(el=>el.classList.add('piece-adjacency-glow-v174'));try{await showAdjacencyV174([{...p,tag:{...p.tag,name:`${label} / ${p.tag.name}`}}],true);}finally{targets.forEach(el=>el.classList.remove('piece-adjacency-glow-v174'));}}}
const autoEquipBaseV174=applyFigureEquipmentSetV132;
applyFigureEquipmentSetV132=function(pid,...args){const before=new Set(adjacentPairsV174(figureEquipmentFor(pid)).map(p=>`${p.id}:${p.left}`)),r=autoEquipBaseV174(pid,...args);void showAdjacencyV174(adjacentPairsV174(figureEquipmentFor(pid)).filter(p=>!before.has(`${p.id}:${p.left}`)));return r;};

// EXP uses exactly the same threshold and saved remainder as level-up rewards.
const playerDetailBaseV174=openPlayerDetail;
openPlayerDetail=function(pid){playerDetailBaseV174(pid);pid=canonicalPlayerId(pid);const slot=state.party.find(x=>x[0]===pid),body=$('#playerDetailBody');if(!slot||!body||$('#playerDetailOverlay').hidden)return;const lv=Number(slot[1]),remaining=Math.max(0,expToNextRequiredV159(lv)-(Number(state.meta.exp?.[pid])||0)),el=document.createElement('section');el.className='next-exp-v174';el.innerHTML=lv>=playerLevelCap()?'<span>経験値</span><strong>現在のレベル上限に到達</strong>':`<span>次のレベル（Lv.${lv+1}）まで</span><strong>あと ${remaining.toLocaleString('ja-JP')} EXP</strong>`;body.prepend(el);};
const passiveBaseV174=passiveCutin;
passiveCutin=async function(a,text,duration=620){return passiveBaseV174(a,text,Math.max(duration,1700,Math.min(3200,[...String(text)].length*65)));};
// Notice queue remains ordered. Buff notices use wall-clock time even at 5x speed.
pumpNotice=async function(){if(state.noticeBusy)return;state.noticeBusy=true;const el=$('#centerMessage');try{while(state.noticeQueue.length){const n=state.noticeQueue.shift();el.textContent=n.text;el.dataset.tone=n.tone;el.classList.remove('play');void el.offsetWidth;el.classList.add('play');if(n.tone==='buff')await waitRealV100(Math.max(2200,Math.min(4200,[...String(n.text)].length*65)));else await delay(n.duration);el.classList.remove('play');await waitRealV100(90);}}finally{el.classList.remove('play');state.noticeBusy=false;}};

// Skip only presentation. Script steps with joins/rewards/unlocks still execute.
let eventRunV174=null,skipScopeV174='',skippedV174=false,battleSkipResolveV174=null;
function skipAllowedV174(){return !!state.test?.enabled||!!(eventRunV174&&eventRunV174.difficulty>=1);}
function skippingV174(){return skippedV174&&skipAllowedV174()&&!$('#storyScene').hidden;}
const skipBtnV174=document.createElement('button');skipBtnV174.id='storySkipV174';skipBtnV174.type='button';skipBtnV174.hidden=true;skipBtnV174.textContent='このAreaのイベントをスキップ';document.body.appendChild(skipBtnV174);
const allowedTargetBaseV174=conversationAllowedTargetV171;
conversationAllowedTargetV171=target=>!!target?.closest?.('#storySkipV174')||allowedTargetBaseV174(target);
skipBtnV174.onclick=e=>{e.preventDefault();e.stopPropagation();if(!skipAllowedV174())return;skippedV174=true;skipBtnV174.hidden=true;if(storyTapResolve){const resolve=storyTapResolve;storyTapResolve=null;resolve();}battleSkipResolveV174?.();for(const animation of $('#storyScene').getAnimations({subtree:true}))try{animation.finish();}catch(_){};};
waitBattleStoryTapV88=function(){if(skippedV174&&skipAllowedV174())return Promise.resolve();skipBtnV174.hidden=!skipAllowedV174();return new Promise(resolve=>{const ready=performance.now()+180,done=()=>{document.removeEventListener('pointerup',tap,true);battleSkipResolveV174=null;skipBtnV174.hidden=true;resolve();},tap=e=>{if(e.target.closest?.('#storySkipV174')||performance.now()<ready)return;e.preventDefault();e.stopPropagation();done();};battleSkipResolveV174=done;document.addEventListener('pointerup',tap,{capture:true,passive:false});});};
const battleDialogueBaseV174=battleStoryCutinV88;
battleStoryCutinV88=async function(...args){if(skippedV174&&skipAllowedV174())return;try{return await battleDialogueBaseV174(...args);}finally{skipBtnV174.hidden=true;}};
const openStoryBaseV174=openStoryScene;
openStoryScene=async function(world,area=0,...args){const scope=eventRunV174?`event:${eventRunV174.difficulty}:${eventRunV174.area}`:`${world}:${area}`;if(scope!==skipScopeV174){skipScopeV174=scope;skippedV174=false;}await openStoryBaseV174(world,area,...args);if(eventRunV174){$('#adventureScreen').classList.add('event-story-active-v174');$('#adventureStageTitle').textContent='サバンナスピードキング';$('#adventureProgress').textContent=`AREA ${eventRunV174.area+1} / ${SAVANNA_DIFFICULTIES_V174[eventRunV174.difficulty].name}`;}skipBtnV174.hidden=!skipAllowedV174()||skippedV174;};
const closeStoryBaseV174=closeStoryScene;
closeStoryScene=async function(...args){skipBtnV174.hidden=true;try{return await closeStoryBaseV174(...args);}finally{$('#adventureScreen').classList.remove('event-story-active-v174');}};
const advanceBaseV174=storyAdvanceWait;
storyAdvanceWait=function(){return skippingV174()?Promise.resolve():advanceBaseV174();};
const delayBaseV174=fixedDelay;
fixedDelay=function(ms){return skippingV174()?Promise.resolve():delayBaseV174(ms);};
const sayBaseV174=storySay;
storySay=async function(...args){if(skippingV174())return;return sayBaseV174(...args);};
const animateBaseV174=animateV157;
animateV157=async function(el,frames,ms){if(skippingV174())return;return animateBaseV174(el,frames,ms);};
const stepBaseV174=runStorySteps;
runStorySteps=async function(steps=[]){for(const st of steps){if(skippingV174()&&!['join','joinKeepGuest','joinSilent','rewardDrink','darkEnergyTransfer','energyTransfer','lilithSplit'].includes(st[0]))continue;if(st[0]==='savannaEntrance')await savannaEntranceV174(st[1],st[2]);else if(st[0]==='sayInterrupt'){const timer=setTimeout(()=>{if(storyTapResolve){const done=storyTapResolve;storyTapResolve=null;done();}},900);try{await storySay('pink','・・・・後ろ！');}finally{clearTimeout(timer);}await storySay('desert','左右だ');}else await stepBaseV174([st]);}};

const SAVANNA_STORY_V174=[
 {pre:[['say','pink','到着ー！\nであります！'],['say','denden','辺り一面草でやんすね～'],['say','pink','そこが良いのであります！'],['say','desert','この広さ\n素早い魔物が育つわけだな'],['savannaEntrance','normal'],['say','pink','やや！\n出ましたねー！'],['say','denden','スピード勝負でやんす！']],post:[['say','pink','もっともーっと早い種族も\nいるであります！'],['say','desert','チョロチョロと鬱陶しいな']]},
 {pre:[['say','pink','モブサバンナは\n草原でも古い種族であります'],['say','denden','昔からよく見るでやんすね～'],['say','pink','その分、進化もしています\n亜種には注意であります！'],['savannaEntrance','sides'],['say','denden','は、速いでやんす！'],['say','pink','僕は見えていたであります！'],['say','desert','どこから来たか見えたか？'],['sayInterrupt']],post:[['say','denden','ふぅ～\n目が痛いでやんす'],['say','desert','動体視力が鍛えられるな'],['say','pink','ちょっと酔ったであります・・']]},
 {pre:[['say','denden','ん？\n今なんかいたでやんすか？'],['say','pink','ん？\n気のせいでありましょう'],['say','desert','いや\n何かいたな'],['savannaEntrance','race'],['say','denden','か、風になっているでやんす！'],['say','pink','す、涼しかったであります！'],['say','desert','お前たち、集中しないと怒るぞ'],['sayDual','denden','はいでやんす！','pink','はいであります！']],post:[['say','desert','二度と会いたくないな'],['say','pink','疲れたであります・・'],['say','denden','勉強になったでやんす！']]},
 {pre:[['savannaEntrance','drop'],['say','denden','！？'],['say','pink','メタルであります！！'],['say','desert','経験値ボーナスだな\n確実に仕留めるぞ！'],['say','denden','強くなるでやんす～！！']],post:[['say','pink','やったであります～！'],['say','denden','オイラ強くなったでやんす～！'],['say','desert','良い戦いだったな']]}
];
const SAVANNA_DIFFICULTIES_V174=[
 {name:'ノーマル',level:22,coins:5000,diamonds:10,figures:[17,18]},
 {name:'ハード',level:45,coins:10000,diamonds:30,figures:[19]},
 {name:'インフェルノ',level:85,coins:50000,diamonds:50,figures:[20]}
];
function savannaRecordsV174(){return state.meta.storyEventsV174??=( {savanna:{}}),state.meta.storyEventsV174.savanna??={};}
function savannaOpenV174(d){return d>=0&&d<3&&(worldCleared('rural')||testAllQuestsV171())&&(d===0||savannaRecordsV174()[d-1]||testAllQuestsV171())&&!savannaRecordsV174()[d];}
function savannaTemplateV174(kind,d=0){const normal=trainingEnemyCatalog().find(e=>e.name==='モブサバンナ'),variant=trainingEnemyTemplate('sq-savanna-variant');const rows={
 normal:{...normal,name:'モブサバンナ',level:[19,43,82],cut:.10,evade:.10,actions:[1,2]},
 variant:{...variant,name:'モブサバンナ亜種',level:[21,45,85],cut:.10,evade:.15,actions:[2,2]},
 water:{image:'spenemy/35.png',name:'モブミズサバンナ',attribute:'水',level:[21,45,86],cut:.10,evade:.18,actions:[2,2],preemptive:true},
 wind:{image:'spenemy/37.png',name:'モブカゼサバンナ',attribute:'風',level:[21,45,86],cut:.08,evade:.22,actions:[2,2],preemptive:true},
 nagi:{image:'spenemy/38.png',name:'モブナギサバンナ',attribute:'風',level:[23,48,88],cut:.10,evade:.23,actions:[2,3]},
 metal:{image:'spenemy/36.png',name:'モブメタルサバンナ',attribute:'風',level:[25,50,90],cut:.90,evade:0,actions:[2,3],fixedHp:300}
 };const r=rows[kind];return {...r,id:'savanna174-'+kind,savannaKindV174:kind,category:['nagi','metal'].includes(kind)?'boss':'elite',levelMin:r.level[d],levelMax:r.level[d],damageReduction:r.cut,permanentDamageReduction:true,evasion:r.evade,actionCount:r.actions[0],forceActionCount:true,v144ActionMin:r.actions[0],v144ActionMax:r.actions[1],noEscape:true,...(kind==='metal'?{rewardExp:turntableMaxRewardV116('exp',['normal','hard','inferno'][d])}:{})};}
function savannaWaveV174(area,d){const kinds=[['normal','normal','normal'],['variant','variant'],['water','wind'],['normal','metal','normal']][area];return kinds.map(kind=>{const t=savannaTemplateV174(kind,d);return {template:t,level:area===3&&kind==='normal'?19:t.levelMin,forceActionCount:true};});}
const storyActorBaseV174=storyActorInfo;
storyActorInfo=function(key){if(String(key).startsWith('savanna174-')){const t=savannaTemplateV174(key.slice(11));return {...t,enemyTemplate:t};}return storyActorBaseV174(key);};
async function savannaEntranceV174(kind){
 const keys={normal:['normal','normal','normal'],sides:['variant','variant'],race:['water','wind'],drop:['normal','metal','normal']}[kind].map(k=>'savanna174-'+k);
 const sc=$('#storyScene');sc.classList.add('summoning-scene-v173');
 try{await storyShowGuests(keys);const actors=$$('.story-guest-multi',$('#storyGuestGroup'));if(skippingV174())return;
  if(kind==='normal'){sc.classList.remove('summoning-scene-v173');return;}
  if(kind==='drop'){for(const a of actors)a.style.opacity='1';sc.classList.remove('summoning-scene-v173');await animateV157(actors[1],[{translate:'0 -360px',opacity:0},{translate:'0 0',opacity:1}],520);await storyImpact('ドーン！');return;}
  const wind=document.createElement('div');wind.className='savanna-wind-v174';sc.appendChild(wind);
  try{await Promise.all(actors.map((a,i)=>{a.style.opacity='1';return animateV157(a,kind==='sides'?[{translate:`${i?-450:450}px 0`,opacity:0},{translate:'0 0',opacity:1}]:[{translate:'-400px -70px',opacity:0},{translate:'380px 80px',opacity:.5},{translate:'-330px 130px',opacity:.2},{translate:'300px -140px',opacity:.6},{translate:'0 0',opacity:1}],kind==='sides'?230:1100);}));}finally{wind.remove();}
 }finally{sc.classList.remove('summoning-scene-v173');}
}
const renderEventsBaseV174=renderEventQuestsV163;
renderEventQuestsV163=function(){renderEventsBaseV174();if(eventViewV163!=='story')return;const root=$('#trainingFeaturePanel'),open=worldCleared('rural')||testAllQuestsV171();$('.event-story-v163',root)?.remove();const content=document.createElement('div');content.innerHTML=`<div class="event-story-card-v174"><small>STORY 01 · 草原 / 全4 AREA</small><strong>サバンナスピードキング</strong><img src="spenemy/38.png" alt="モブナギサバンナ"><small>${open?'風を追い越す魔物たちとのスピード勝負！':'田舎町クリア後に解放'}</small></div><div class="event-difficulties-v163">${SAVANNA_DIFFICULTIES_V174.map((d,i)=>`<button class="event-difficulty-v163" data-savanna-start="${i}" ${savannaOpenV174(i)?'':'disabled'}><div><b>${d.name}</b><strong>適正 Lv.${d.level}</strong></div><div class="event-story-rewards-v174">コイン ${d.coins.toLocaleString()} / ◆ ${d.diamonds}<br>${d.figures.map(n=>`<img src="eventfig/${n}.png" alt="${SAVANNA_FIGURES_V174[n-17].name}">`).join('')}</div>${savannaRecordsV174()[i]?'<em class="event-clear-stamp-v163">CLEAR</em>':!open?'<p>田舎町クリアで解放</p>':i>0&&!savannaOpenV174(i)?`<p>${SAVANNA_DIFFICULTIES_V174[i-1].name}クリアで解放</p>`:''}</button>`).join('')}</div>`;$('.event-panel-v163',root).appendChild(content);$$('[data-savanna-start]',root).forEach(b=>b.onclick=()=>startSavannaV174(Number(b.dataset.savannaStart)));bindImages(root);};
async function startSavannaV174(d){if(eventRunV174||!savannaOpenV174(d))return false;eventRunV174={difficulty:d,area:0,vitals:{},rewarded:false};skipScopeV174='';skippedV174=false;$('#trainingFeaturePopup').hidden=true;await startSavannaAreaV174();return true;}
async function savannaSceneV174(phase){const r=eventRunV174;if(!r)return;showScreen('adventure');storyBusy=true;try{await openStoryScene('grassland',r.area,'default',['pink','denden','desert']);await runStorySteps(SAVANNA_STORY_V174[r.area][phase]);}finally{await closeStoryScene(false);storyBusy=false;}}
async function startSavannaAreaV174(){const r=eventRunV174;if(!r)return;eventOverlayV163().hidden=true;await savannaSceneV174('pre');const bg=storySceneBg('grassland',r.area);await startBattleLoaded({mode:'eventStory174',returnScreen:'training',worldId:'grassland',storyEventV174:true,party:state.party,questVitals:r.vitals,waves:r.area===2?[savannaWaveV174(r.area,r.difficulty),[{template:savannaTemplateV174('nagi',r.difficulty),level:[23,48,88][r.difficulty]}]]:[savannaWaveV174(r.area,r.difficulty)],bg:bg.bg,fallbackBg:bg.fallback});$('#battleModeLabel').textContent=`サバンナ / ${SAVANNA_DIFFICULTIES_V174[r.difficulty].name} / AREA ${r.area+1}`;$('#battleBackBtn').style.display='';}
function returnSavannaV174(){const b=state.battle;if(b?.config?.storyEventV174){b.finished=true;b.auto=false;state.battle=null;}eventRunV174=null;skippedV174=false;skipBtnV174.hidden=true;eventOverlayV163().hidden=true;$('#resultOverlay').hidden=true;$('#skillMenu').hidden=true;state.training.mode='event';eventViewV163='story';renderTraining();showScreen('training');$('#trainingFeaturePopup').hidden=false;$('#trainingFeaturePopup').dataset.mode='event';}
function rewardSavannaV174(){const r=eventRunV174;if(!r||r.rewarded||savannaRecordsV174()[r.difficulty])return null;const d=SAVANNA_DIFFICULTIES_V174[r.difficulty];r.rewarded=true;savannaRecordsV174()[r.difficulty]=true;state.coins+=d.coins;state.meta.coins=state.coins;state.meta.diamonds=(Number(state.meta.diamonds)||0)+d.diamonds;const figures=d.figures.map(n=>awardGachaFigureV115(figureByImageV96(`eventfig/${n}.png`)));saveMeta();return {...d,awarded:figures};}
async function finishSavannaV174(b,win){
 if(b.finished)return;b.finished=true;b.auto=false;setCommandDisabled(true);const r=eventRunV174;if(!r)return;
 let gained=null,reward=null;if(win){for(const a of b.allies)r.vitals[a.id]={hp:a.hp,mp:a.mpNow,dead:a.dead,status:{...a.status}};gained=applyProgressRewards(b,r.vitals);await savannaSceneV174('post');if(r.area===3)reward=rewardSavannaV174();}
 const ov=eventOverlayV163();ov.innerHTML=`<div class="event-result-v163"><small>SAVANNA SPEED KING</small><h2>${win?(reward?'QUEST CLEAR!!':'AREA CLEAR!'):'DEFEAT'}</h2><p>${SAVANNA_DIFFICULTIES_V174[r.difficulty].name} / AREA ${r.area+1}</p>${win?`<span class="event-clear-stamp-v163">CLEAR</span><p>獲得経験値 ${gained.exp.toLocaleString()} EXP</p>`:'<p>パーティーを整えて、再び挑戦しましょう。</p>'}${reward?`<h3>クリア報酬</h3><p>コイン +${reward.coins.toLocaleString()} / ◆ +${reward.diamonds}</p><div class="event-rewards-v174">${reward.awarded.map(f=>`<div>${figureImageTagV101(f.f)}<b>${f.f.name}</b><small>${f.converted?`ルビー +${f.ruby}`:'GET!'}</small></div>`).join('')}</div>`:''}<button class="primary-btn" data-savanna-next>${win&&r.area<3?'次のAreaへ':'クエストへ戻る'}</button></div>`;ov.hidden=false;bindImages(ov);$('[data-savanna-next]',ov).onclick=async function(){this.disabled=true;if(win&&r.area<3){r.area++;await startSavannaAreaV174();}else returnSavannaV174();};
}
const finishBaseV174=finishBattle;
finishBattle=function(win){const b=state.battle;if(b?.config?.storyEventV174)return finishSavannaV174(b,!!win);return finishBaseV174(win);};
const backBaseV174=$('#battleBackBtn').onclick;
$('#battleBackBtn').onclick=async function(){const b=state.battle;if(!b?.config?.storyEventV174)return backBaseV174?.();if(b.busy||b.finished)return;const auto=b.auto;b.auto=false;b.busy=true;try{if(await narrationDialog('この挑戦を終了しますか？',[['終了する','yes'],['続ける','no','primary']])==='yes')returnSavannaV174();}finally{if(state.battle===b&&!b.finished){b.busy=false;b.auto=auto;if(auto)void autoAct();}}};

const waveBaseV174=spawnNextEnemyWave;
spawnNextEnemyWave=async function(){const b=state.battle;if(!b?.config?.storyEventV174||!b.pendingWaveConfigs?.length)return waveBaseV174();
 // Both defeated forms briefly return with 1 HP solely for the fusion scene.
 for(const e of b.enemies)e.hp=1;
 if(!(skippedV174&&skipAllowedV174())){renderBattle();skipBtnV174.hidden=!skipAllowedV174();await actionCutin('2体がHP1で復活！','buff',1000);const field=$('#battleFxLayer'),wind=document.createElement('div');wind.className='savanna-wind-v174';field.appendChild(wind);
 try{await Promise.all(b.enemies.map(async(e,i)=>{const el=enemyVisual(e.uid);if(!el)return;const animation=el.animate([{translate:'0 0'},{translate:`${i?-180:180}px -90px`},{translate:`${i?160:-160}px 70px`},{translate:'0 -50px',rotate:'1080deg',scale:'.2',opacity:0}],{duration:1350,fill:'forwards'});try{await animation.finished;}finally{el.style.visibility='hidden';animation.cancel();}}));await storyFlashBattle();}finally{wind.remove();skipBtnV174.hidden=true;}}
 // Queue creation is kept in the existing wave transition, but no dead-form reward is repeated.
 const records=b.pendingWaveConfigs.shift(),next=buildEnemyWave(records,Math.min(4,b.allies.length),b.bg,b.fallbackBg);b.enemies=next;b.enemy=next[0];b.targetEnemyId=next[0].uid;b.actingEnemyId=null;b.queue=[];b.queuePos=0;renderBattle();await allyStoryCutin('pink','また速くなったであります！！');await allyStoryCutin('denden','よーーく狙うでやんす！');b.turn++;b.busy=false;startRound();return true;};
const enemyActionBaseV174=enemyAction;
enemyAction=async function(actionIndex=1,enemyId){const b=state.battle,e=enemyByUid(enemyId)||actingEnemy()||b?.enemy,k=e?.savannaKindV174;if(!k)return enemyActionBaseV174(actionIndex,enemyId);if(!b||b.finished||e.hp<=0)return;
 for(const s of ['sleep','stun','paralyze'])if(e.status[s]>0){e.status[s]--;notice(`${e.name}は動けない！`,'status',700);return;}
 const old=b.actingEnemyId;b.actingEnemyId=e.uid;try{
 if(actionIndex===1&&['water','nagi','metal'].includes(k)){
  const name=k==='nagi'?'サバンナ・ライト・ハリケーン':k==='metal'?'メタル・サバンナ・ボム':'ウォーターラッシュ',type=k==='metal'?'magic':'physical';await enemySkillImageCutinV134(e,{special:name,skillType:type,power:1.1});await aoeHit(.90,type,e.attribute);
  if(k==='nagi'){for(let i=0;i<3;i++){const a=pick(livingMain());if(a)await damageAlly(a,.65,'physical',false,'風');}e.savannaSpeedUntilV174=b.turn+3;fx('buff',`enemy:${e.uid}`);}
  if(k==='metal'){for(const a of livingField()){a.windDownUntilV174=b.turn+rint(2,3)+1;fx('debuff',a.id);}notice('風属性耐性が20%ダウン！ / 2～3ターン','buff',2200);}
 }else if(k==='wind'&&actionIndex===1)await bossSpecial({special:'ホクア',kind:'single',power:1.15,skillType:'magic',skillElement:'風'});else await bossNormal();
 await checkSpecialRevives();if(!livingRoster().length)finishBattle(false);
 }finally{b.actingEnemyId=old;}
};
const baseResistanceV174=playerBaseElementResistanceV104;
playerBaseElementResistanceV104=function(a,element){return baseResistanceV174(a,element)-(normalizeElement(element)==='風'&&Number(a?.windDownUntilV174)>Number(state.battle?.turn||0)?.20:0);};
const initiativeBaseV174=initiativeSpeed;
initiativeSpeed=function(entry){const e=entry.type==='enemy'?enemyByUid(entry.enemyId):null;return initiativeBaseV174(entry)*(Number(e?.savannaSpeedUntilV174)>Number(state.battle?.turn||0)?1.10:1);};
const startAreaBaseV174=startSavannaAreaV174;
startSavannaAreaV174=async function(){const previous=state.battle;try{await startAreaBaseV174();if(!state.battle?.config?.storyEventV174||state.battle===previous)throw Error('Event battle did not start');}catch(err){console.error('[v174 savanna]',err);returnSavannaV174();toast('準備に失敗しました。もう一度お試しください。');}};
window.__mobV174Runtime=true;

/* v175: concealed story rewards and readable passive activation details. */
const PASSIVE_EFFECTS_V175={
 yusha:'自身のHP30%回復・戦闘能力+10%（累積）',pink:'味方1人をHP35%で復活・自身の現在HPを半分消費',desert:'この攻撃の被ダメージを20%軽減',
 denden:'この通常攻撃が会心の一撃になる',nyoro:'通常攻撃が敵全体への攻撃になる',nekoku:'HP割合が最も低い味方1人のHP22%回復',
 money:'自身のMP12%回復',tetsu:'威力85%の物理攻撃で追撃',jessie:'威力90%の雷属性魔法で追撃',riro:'味方の状態異常を解除',
 lilith:'HP60%で復活・ATK/MAG/DEF/MND/SPD+20%',naraku:'戦闘能力+10%（累積）'
};
passiveCutin=async function(a,text,duration=620){
 const b=state.battle,desert=a?.id==='desert'&&String(text).includes('サバクノマモリビト'),repeat=desert&&b?.desertPassiveTurnV175===b.turn;
 if(desert&&b)b.desertPassiveTurnV175=b.turn;
 const effect=PASSIVE_EFFECTS_V175[a?.id],label=String(text)+(effect?'\n'+effect:''),ms=repeat?650:Math.max(2200,Math.min(3600,label.length*55),duration),wrap=$('#passiveCutin');
 wrap?.style.setProperty('--passive-duration-v175',ms+'ms');wrap?.classList.toggle('passive-repeat-v175',repeat);
 try{return await passiveBaseV174(a,label,ms);}finally{wrap?.classList.remove('passive-repeat-v175');}
};
const eventNoticeBaseV175=eventNoticeV163;
eventNoticeV163=function(e,text){
 const s=e?.eventV163,k=s?.key;
 const threshold={bilion:'会心率・回避率+20%',kanedoll:'ダメージ軽減+20%・第二形態に変身',xenon:'ATK・SPD+15%',psychic:'SPD・DEF+15%',magrock:'DEF+20%',marine:'3回行動に変化',leaf:'ダメージ軽減+10%・全属性耐性+20%',skull:'HP40%回復・ダメージ軽減+10%',potion:'ドラゴンを召喚',bubble:'SPD+20%',bird:'DEF・MND+20%',sweets:'DEF・MND+20%',slime:'巨大化・ダメージ軽減+30%',demon:'通常攻撃が全体化'};
 if(text==='潜在能力が発動！')text=`${e.v142Passive||'潜在能力'} / ${threshold[k]||'能力強化'}`;
 else if(text==='ゼノンブースト！')text+=' / 魔法ダメージ軽減+10%・必殺技威力+10%（累積）';
 return eventNoticeBaseV175(e,text);
};
const heroFourthV175=player('yusha')?.ults?.[3];
if(heroFourthV175)Object.assign(heroFourthV175,{kind:'lowHpBurstAoe',desc:'敵全体に火属性魔法の極大ダメージ。味方残HPが少ないほど強化。使用時、味方全体のHPを最大HPの10%回復。'});
const eventRenderBaseV175=renderEventQuestsV163;
renderEventQuestsV163=function(){eventRenderBaseV175();if(eventViewV163!=='story')return;const root=$('#trainingFeaturePanel'),seen=state.meta.storyEventSeenV175?.savanna||Object.values(savannaRecordsV174()).some(Boolean),boss=$('.event-story-card-v174 img',root);if(boss&&!seen){boss.classList.add('event-silhouette-v175');boss.alt='未遭遇のボス';}$$('[data-savanna-start]',root).forEach(card=>{const d=Number(card.dataset.savannaStart);if(!savannaRecordsV174()[d])$$('.event-story-rewards-v174 img',card).forEach(img=>{img.classList.add('event-silhouette-v175');img.alt='未獲得の限定フィギュア';});});};
const savannaSceneBaseV175=savannaSceneV174;
savannaSceneV174=async function(phase){if(eventRunV174?.area>=2){(state.meta.storyEventSeenV175??={}).savanna=true;saveMeta();}return savannaSceneBaseV175(phase);};
window.__mobV175Runtime=true;

/* v176: a scripted rescue continues the same encounter; it is not a defeat. */
function repairGrassReportV176(){
 const adv=state.adventure;if(!adv||Number(adv.worldIndex||0)!==0||adv.completed||adv.awaitingReport||(adv.reportedWorlds||[]).includes('grassland'))return false;
 const post='post:grassland:3',won=!!adv.storyFlags?.[post]||adv.pendingPostStory?.key===post;
 if(!won)return false;
 adv.areaIndex=3;adv.battleIndex=0;adv.battleReady=false;adv.pendingEncounter=null;adv.runSnapshot=null;adv.checkpoint=null;
 adv.awaitingReport={worldIndex:0,worldId:'grassland',worldName:MOB_DATA.adventureWorlds[0].name,nextWorldIndex:1};saveAdventure();return true;
}
const homeBaseV176=renderHome;
renderHome=function(...args){repairGrassReportV176();return homeBaseV176(...args);};
const castleBaseV176=renderCastle;
renderCastle=function(...args){repairGrassReportV176();return castleBaseV176(...args);};
repairGrassReportV176();
window.__mobV176Runtime=true;
