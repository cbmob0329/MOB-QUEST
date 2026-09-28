const MINT_PARTY_V237=['pink','jessie','denden','nyoro'];
STORY179.mint={title:'部族村の伝統娯楽',world:'tribe',unlock:'tribe',unlockName:'部族村',image:'spenemy/89.png',diffs:[
 {name:'ノーマル',level:45,coins:5000,diamonds:100,figures:[61]},
 {name:'ハード',level:65,coins:10000,diamonds:200,figures:[],medal:'event-mint-medal'},
 {name:'インフェルノ',level:90,coins:50000,diamonds:300,figures:[62]}
]};
const mintMedalV237={id:'event-mint-medal',name:'モブミント',image:'spenemy/89.png',type:'メダル',types:['メダル'],rarity:'UR',attribute:'水',stats:{mag:50,def:30},traits:[{kind:'mintRepeatV237',chance:.03,label:'連続魔法発動率+3%（同じ魔法・追加MP消費なし）'}],traitLabel:'魔法使用時、3%の確率で同じ魔法を再発動（追加MP消費なし）'};
if(!weaponById(mintMedalV237.id))WEAPONS.push(mintMedalV237);
for(const row of MINT_FIGURES_V237){const existing=figureByImageV96(row.image);if(existing)Object.assign(existing,row);else FIGURES.push({...row,id:'v218-'+row.image.replace(/[/.]/g,'-'),eventExclusiveV163:true});}
for(const row of MINT_FIGURES_V237){const f=figureByImageV96(row.image),base=MOB_PIECE_BASE_V100[f.rarity];f.mobPieceV115??={cost:mobPieceCostV100(f),hp:base.life,attack:base.power,defense:base.defense,speed:base.speed};}
const mintPartyBaseV237=partyV179;
partyV179=function(key){return key==='mint'?MINT_PARTY_V237.map(id=>state.party.find(r=>canonicalPlayerId(r[0])===id)).filter(Boolean):mintPartyBaseV237(key);};
const mintDisplayBaseV237=storyDisplayPartyIds;
storyDisplayPartyIds=function(...args){return eventRunV174?.storyV179==='mint'?[...MINT_PARTY_V237,...(eventRunV174.area===0?['yusha']:[])]:mintDisplayBaseV237(...args);};
const mintStartBaseV237=startV179;
startV179=async function(key,d=0){if(key!=='mint')return mintStartBaseV237(key,d);if(eventRunV174||!openV179(key,d))return false;const party=partyV179(key);if(!party.length)return toast('出撃可能な仲間がいません');if(!await confirmStoryChallengeV179(STORY179.mint.title,STORY179.mint.diffs[d].name+'\n出撃：'+party.map(r=>player(r[0]).name).join(' / ')))return false;eventRunV174={storyV179:key,difficulty:d,area:0,vitals:{},rewarded:false};skipScopeV174='';skippedV174=false;$('#trainingFeaturePopup').hidden=true;state.meta.storyEventSeenV175??={};state.meta.storyEventSeenV175.mint=true;saveMeta();await startSavannaAreaV174();return true;};
const mintMenuBaseV237=renderEventQuestsV163;
renderEventQuestsV163=function(...args){const result=mintMenuBaseV237(...args);if(eventViewV163!=='story')return result;const panel=$('#trainingFeaturePanel .event-panel-v163');if(!panel)return result;
 if(selectedStoryV179===null){const b=document.createElement('button');b.className='event-story-card-v174 mint-card-v237';b.dataset.story237='mint';b.innerHTML=`<small>STORY / 全4 AREA</small><strong>部族村の伝統娯楽</strong><img src="spenemy/89.png" class="${seenV179('mint')?'':'event-silhouette-v175'}" alt="${seenV179('mint')?'モブミント':'未遭遇のボス'}"><small>${worldCleared('tribe')||testAllQuestsV171()?'挑戦する':'部族村クリア後に解放'}</small>`;b.onclick=()=>{selectedStoryV179='mint';renderEventQuestsV163();};($('.event-story-list-v177',panel)||panel).append(b);}
 if(selectedStoryV179==='mint'){const desc=$('.event-story-card-v174>small:last-child',panel);if(desc)desc.textContent='出撃可能：モブピンク / モブジェシー / モブデンデン / モブニョロ';$('[data-v179-start="mint:1"] .event-story-rewards-v174 img',panel)?.classList.add('mint-medal-v237');}
 return result;
};
function mintTemplateV237(kind,d=0){
 const kiba=kind==='kiba',ris=kind==='ris',level=(kiba?[45,55,90]:ris?[52,72,95]:[50,70,95])[d],base=kiba?baseByNameV179('モブキバ'):{};
 return{...base,id:'mint237-'+kind,mintV237:kind,name:kiba?'モブキバ':ris?'モブリスミント':'モブミント',image:kiba?base.image:ris?'spenemy/90.png':'spenemy/89.png',category:kiba?'normal':'boss',attribute:kiba?'地':'水',levelMin:level,levelMax:level,noEscape:true,damageReduction:kiba?.10:.12,permanentDamageReduction:true,evasion:kiba?.10:0,actionCount:kiba?2:3,forceActionCount:true,v144ActionMin:kiba?2:3,v144ActionMax:kiba?2:3,specialOptions:kiba?[]:[{special:'ミント・テンゲン',kind:'single',skillType:'magic',skillElement:'水',power:1.3}]};
}
function mintWaveV237(area,d){const t=mintTemplateV237(area<2?'kiba':area===2?'mint':'ris',d);return Array.from({length:area===0?3:area===1?4:1},()=>({template:t,level:t.levelMin}));}
const mintBuildBaseV237=buildEnemyFromTemplate;
buildEnemyFromTemplate=function(t,...args){const e=mintBuildBaseV237(t,...args);if(t.mintV237){e.mintV237=t.mintV237;e.actionCount=e.v144ActionMin=e.v144ActionMax=t.mintV237==='kiba'?2:3;e.forceActionCount=true;e.damageReduction=t.damageReduction;e.permanentDamageReduction=true;e.evasion=t.evasion;}return e;};
const mintSizeBaseV237=enemySizeClass;
enemySizeClass=e=>e?.mintV237?'normal':mintSizeBaseV237(e);
const mintActorBaseV237=storyActorInfo;
storyActorInfo=function(key){if(String(key).startsWith('mint237-')){const kind=key.slice(8)==='copy'?'mint':key.slice(8),t=mintTemplateV237(kind,eventRunV174?.difficulty||0);return{...t,enemyTemplate:{...t,category:'normal'}};}return mintActorBaseV237(key);};
function mintFxV237(host,kind='bubble'){
 const layer=document.createElement('div');layer.className='mint-fx-v237 '+kind;layer.setAttribute('aria-hidden','true');
 layer.innerHTML='<b class="mint-ring-v237"></b>'+Array.from({length:14},(_,i)=>`<i style="--i:${i};--x:${12+i*37%76}%;--s:${10+i%4*9}px"></i>`).join('');host.append(layer);return layer;
}
async function mintEnterV237(keys=['mint'],kind='bubble'){
 const sc=$('#storyScene'),group=$('#storyGuestGroup');sc.classList.add('mint-preparing-v237');let fxLayer,actors=[];
 try{await storyHideGuests();await storyShowGuests(keys.map(k=>'mint237-'+k));actors=[...group.children];actors.forEach(el=>el.style.opacity='0');fxLayer=mintFxV237(group,kind);await fixedDelay(320);
  const jobs=actors.map((el,i)=>animateV157(el,[{opacity:0,scale:'.35',translate:'0 30px'},{opacity:.75,scale:'1.06',translate:'0 -12px',offset:.7},{opacity:1,scale:'1',translate:'0 0'}],900+i*70).then(()=>el.style.removeProperty('opacity')));
  sc.classList.remove('mint-preparing-v237');await Promise.all(jobs);await fixedDelay(180);
 }finally{fxLayer?.remove();sc.classList.remove('mint-preparing-v237');actors.forEach(el=>el.style.removeProperty('opacity'));}
}
async function mintExitV237(){const group=$('#storyGuestGroup');await Promise.all([...group.children].filter(el=>el.matches('[data-story-actor]')).map(el=>animateV157(el,[{translate:'0 0',opacity:1},{translate:'40vw -12px',opacity:.7,offset:.6},{translate:'90vw 0',opacity:0}],650)));await storyHideGuests();}
async function mintTransformV237(){
 const el=storyAnchor('mint237-mint'),img=el?.querySelector('img');if(!el||!img)return;await preloadAsset('spenemy/90.png','high');const layer=mintFxV237(el,'sweet');el.classList.add('mint-transforming-v237');
 try{await animateV157(el,[{scale:'1'},{scale:'.9',rotate:'-5deg',offset:.5},{scale:'.6',opacity:0}],1400);el.style.opacity='0';await readyStoryImage(img,'spenemy/90.png');img.alt='モブリスミント';el.dataset.storyActor='mint237-ris';await animateV157(el,[{opacity:0,scale:'.6'},{opacity:1,scale:'1.12',offset:.6},{opacity:1,scale:'1'}],1600);}finally{el.style.removeProperty('opacity');el.classList.remove('mint-transforming-v237');layer.remove();}
}
async function mintIntroduceV237(){const pink=storyAnchor('pink'),hero=storyAnchor('yusha');if(!pink||!hero)return storySay('pink','この方でありますー！！');const p=pink.getBoundingClientRect(),h=hero.getBoundingClientRect(),dx=h.x-p.x+(p.x<h.x?-h.width:h.width)*.7;await animateV157(pink,[{translate:'0 0'},{translate:`${dx*.5}px -24px`,offset:.5},{translate:`${dx}px 0`}],650);pink.style.translate=`${dx}px 0`;try{await storySay('pink','この方でありますー！！');}finally{await animateV157(pink,[{translate:`${dx}px 0`},{translate:'0 -18px',offset:.7},{translate:'0 0'}],550);pink.style.removeProperty('translate');}}
async function mintStepsV237(steps){for(const [op,a,b]of steps){if(skipConversationV224())break;if(op==='say')await storySay(a,b);else if(op==='jump')await jumpSayV179(a,b);else if(op==='shake')await shakeSayV179(a,b);else if(op==='summon')await mintEnterV237(['mint'],a==='chess'?'chess':'bubble');else if(op==='exit')await mintExitV237();else if(op==='kiba')await mintEnterV237(Array(a).fill('kiba'),'aura');else if(op==='double')await mintEnterV237(['mint','copy']);else if(op==='transform')await mintTransformV237();else if(op==='introduce')await mintIntroduceV237();else if(op==='narrate')await storyNarrate(a);}}
async function mintQuizV237(){
 // Skipping dialogue must never choose an answer or bypass the quiz battle.
 const group=$('#storyGuestGroup');if(group.hidden||!group.classList.contains('visible')||group.children.length!==2||!group.querySelector('[data-story-actor="mint237-copy"]'))await mintEnterV237(['mint','copy']);
 const answer=await narrationDialog('本物ど～っちだ！',[['左','left','primary'],['右','right']]);const correct=answer==='left';eventRunV174.mintCorrectV237=correct;
 await scopedConversationV224(async()=>{await storySay('pink',correct?'左であります！':'右であります！');const badge=document.createElement('div');badge.className='mint-answer-v237 '+(correct?'correct':'wrong');badge.textContent=correct?'正解！':'不正解！';$('#storyScene').append(badge);try{await animateV157(badge,[{scale:'.5',opacity:0},{scale:'1.1',opacity:1,offset:.6},{scale:'1',opacity:1}],450);await fixedDelay(650);}finally{badge.remove();}
 await storySay('mint237-mint',correct?'正解！':'残念！');const copy=storyAnchor('mint237-copy');if(copy){await animateV157(copy,[{opacity:1},{opacity:0,scale:'.4'}],450);copy.remove();$('#storyGuestGroup').dataset.count='1';}
 await storySay('mint237-mint',correct?'次のエリアで待ってるね！':'また奥で待ってるね！');await mintExitV237();if(!correct)await mintEnterV237(Array(4).fill('kiba'),'aura');},[]);
 return correct;
}
async function mintSceneV237(phase){
 const r=eventRunV174,sc=$('#storyScene');$('#adventureScreen').classList.add('mint-transition-v237');showScreen('adventure');storyBusy=true;
 try{sc.classList.add('mint-story-v237');await openStoryScene('tribe',r.area);$('#adventureStageTitle').textContent=STORY179.mint.title;$('#adventureProgress').textContent=`AREA ${r.area+1} / ${STORY179.mint.diffs[r.difficulty].name}`;await scopedConversationV224(()=>mintStepsV237(MINT_DIALOGUE_V237[phase][r.area]),[]);if(phase==='pre'&&r.area===1)return await mintQuizV237();}
 finally{try{await closeStoryScene(false);}finally{sc.classList.remove('mint-story-v237','mint-preparing-v237');storyBusy=false;}}
 return false;
}
async function mintBattleEntranceV237(b){
 const screen=$('#battleScreen'),host=$('#enemyArea'),actors=b.enemies.map(e=>enemyVisual(e.uid)?.closest('.enemy-unit')).filter(Boolean),layer=mintFxV237(host,b.enemies[0]?.mintV237==='kiba'?'aura':'bubble');actors.forEach(el=>el.style.opacity='0');
 try{const jobs=actors.map(el=>animateV157(el,[{opacity:0,scale:'.45',translate:'0 28px'},{opacity:1,scale:'1.05',translate:'0 -8px',offset:.75},{opacity:1,scale:'1',translate:'0 0'}],800).then(()=>el.style.removeProperty('opacity')));screen.classList.remove('mint-battle-preparing-v237');await Promise.all(jobs);}finally{layer.remove();screen.classList.remove('mint-battle-preparing-v237');actors.forEach(el=>el.style.removeProperty('opacity'));}
}
const mintAreaBaseV237=startSavannaAreaV174;
startSavannaAreaV174=async function(...args){const r=eventRunV174;if(r?.storyV179!=='mint')return mintAreaBaseV237(...args);eventOverlayV163().hidden=true;try{const correct=await mintSceneV237('pre');if(r.area===1&&correct){showResultV179(true,null,true);return;}const bg=storySceneBg('tribe',r.area);await startBattleLoaded({mode:'eventStory174',storyEventV174:true,storyV179:'mint',worldId:'tribe',returnScreen:'training',party:partyV179('mint'),questVitals:r.vitals,enemyConfigs:mintWaveV237(r.area,r.difficulty),bg:bg.bg,fallbackBg:bg.fallback});$('#battleModeLabel').textContent=`${STORY179.mint.title} / ${STORY179.mint.diffs[r.difficulty].name} / AREA ${r.area+1}`;$('#battleBackBtn').style.display='';}catch(e){console.error('[mint237]',e);returnSavannaV174();toast('準備に失敗しました。もう一度お試しください。');}};
const mintFinishBaseV237=finishSavannaV174;
finishSavannaV174=async function(b,win){const r=eventRunV174;if(r?.storyV179!=='mint')return mintFinishBaseV237(b,win);if(b.finished)return;b.finished=true;b.auto=false;setCommandDisabled(true);$('#battleScreen').classList.add('mint-battle-preparing-v237');let reward=null;if(win){for(const a of b.allies)r.vitals[a.id]={hp:a.hp,mp:a.mpNow,dead:a.dead,status:{...a.status}};applyProgressRewards(b,r.vitals);await mintSceneV237('post');if(r.area===3)reward=rewardV179();}showResultV179(win,reward);};
const mintResultBaseV237=showResultV179;
showResultV179=function(win,reward,noBattle){const r=eventRunV174;if(r?.storyV179==='mint')$('#battleScreen').classList.add('mint-battle-preparing-v237');const result=mintResultBaseV237(win,reward,noBattle);if(r?.storyV179==='mint'){const card=$('.event-result-v163',eventOverlayV163());card?.classList.add('mint-result-v237');if(reward?.medal)$$('img',card).forEach(img=>img.classList.add('mint-medal-v237'));if(noBattle)showScreen('adventure');}return result;};
const mintReturnBaseV237=returnSavannaV174;
returnSavannaV174=function(...args){const result=mintReturnBaseV237(...args);$('#adventureScreen').classList.remove('mint-transition-v237');$('#battleScreen').classList.remove('mint-battle-preparing-v237','mint-battle-v237');return result;};
window.__mobBuildVersion='v237';
