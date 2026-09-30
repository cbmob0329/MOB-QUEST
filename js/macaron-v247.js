const MACARON_PARTY_V247=['denden','money','nyoro','nekoku'];
STORY179.macaron={title:'マグマを彩るワンピース',world:'magma',unlock:'magma',unlockName:'マグマ',image:'spenemy/94.png',diffs:[
 {name:'ノーマル',level:60,coins:5000,diamonds:10,figures:[63]},
 {name:'ハード',level:75,coins:10000,diamonds:50,figures:[],medal:'event-macaron-medal'},
 {name:'インフェルノ',level:95,coins:50000,diamonds:100,figures:[64]}
]};
const macaronMedalV247={id:'event-macaron-medal',name:'モブマカロン',image:'spenemy/94.png',type:'メダル',types:['メダル'],rarity:'UR',attribute:'光',stats:{atk:100},traits:[{kind:'macaronFollowV247',chance:.03,label:'特技使用時、連撃発動率+3%（通常攻撃の110%で追撃）'}],traitLabel:'特技使用時、連撃発動率+3%（通常攻撃の110%で追撃）'};
if(!weaponById(macaronMedalV247.id))WEAPONS.push(macaronMedalV247);
for(const row of MACARON_FIGURES_V247){const existing=figureByImageV96(row.image);if(existing)Object.assign(existing,row);else FIGURES.push({...row,id:'v218-'+row.image.replace(/[/.]/g,'-'),eventExclusiveV163:true});}
for(const row of MACARON_FIGURES_V247){const f=figureByImageV96(row.image),base=MOB_PIECE_BASE_V100[f.rarity];f.mobPieceV115??={cost:mobPieceCostV100(f),hp:base.life,attack:base.power,defense:base.defense,speed:base.speed};}
const macaronPartyBaseV247=partyV179;
partyV179=function(key){return key==='macaron'?MACARON_PARTY_V247.map(id=>state.party.find(r=>canonicalPlayerId(r[0])===id)).filter(Boolean):macaronPartyBaseV247(key);};
const macaronDisplayBaseV247=storyDisplayPartyIds;
storyDisplayPartyIds=function(...args){return eventRunV174?.storyV179==='macaron'?MACARON_PARTY_V247:macaronDisplayBaseV247(...args);};
const macaronStartBaseV247=startV179;
startV179=async function(key,d=0){if(key!=='macaron')return macaronStartBaseV247(key,d);if(eventRunV174||!openV179(key,d))return false;const party=partyV179(key);if(!party.length)return toast('出撃可能な仲間がいません');if(!await confirmStoryChallengeV179(STORY179.macaron.title,STORY179.macaron.diffs[d].name+'\n出撃：'+party.map(r=>player(r[0]).name).join(' / ')))return false;eventRunV174={storyV179:key,difficulty:d,area:0,vitals:{},rewarded:false};skipScopeV174='';skippedV174=false;$('#trainingFeaturePopup').hidden=true;state.meta.storyEventSeenV175??={};state.meta.storyEventSeenV175.macaron=true;saveMeta();await startSavannaAreaV174();return true;};
const macaronMenuBaseV247=renderEventQuestsV163;
renderEventQuestsV163=function(...args){const result=macaronMenuBaseV247(...args);if(eventViewV163!=='story')return result;const panel=$('#trainingFeaturePanel .event-panel-v163');if(!panel)return result;
 if(selectedStoryV179===null){const b=document.createElement('button');b.className='event-story-card-v174 macaron-card-v247';b.dataset.story247='macaron';b.innerHTML=`<small>STORY / 全4 AREA</small><strong>マグマを彩るワンピース</strong><img src="spenemy/94.png" class="${seenV179('macaron')?'':'event-silhouette-v175'}" alt="${seenV179('macaron')?'モブマカロン':'未遭遇のボス'}"><small>${worldCleared('magma')||testAllQuestsV171()?'挑戦する':'マグマクリア後に解放'}</small>`;b.onclick=()=>{selectedStoryV179='macaron';renderEventQuestsV163();};($('.event-story-list-v177',panel)||panel).append(b);}
 if(selectedStoryV179==='macaron'){const desc=$('.event-story-card-v174>small:last-child',panel);if(desc)desc.textContent='出撃可能：モブデンデン / モブマニー / モブニョロ / モブネコクー';$('[data-v179-start="macaron:1"] .event-story-rewards-v174 img',panel)?.classList.add('macaron-medal-v247');}
 const grid=$('.quest-cards-v218',panel);if(grid){for(const card of [...grid.children].filter(e=>e.tagName==='BUTTON').sort((a,b)=>questCardOrderV246(a)-questCardOrderV246(b)))grid.append(card);grid.scrollLeft=0;grid.dispatchEvent(new Event('scroll'));}
 return result;
};
function macaronTemplateV247(kind,d=0){
 const kiba=kind==='kiba',ris=kind==='ris',level=(kiba?[60,75,95]:ris?[67,82,99]:[63,79,97])[d],base=kiba?baseByNameV179('モブマグトカゲ'):{};
 return{...base,id:'macaron247-'+kind,macaronV247:kind,name:kiba?'モブマグトカゲ':ris?'モブネコマカロン':'モブマカロン',image:kiba?base.image:ris?'spenemy/95.png':'spenemy/94.png',category:kiba?'normal':'boss',attribute:kiba?'火':'光',levelMin:level,levelMax:level,noEscape:true,damageReduction:kiba?.10:ris?.14:.12,permanentDamageReduction:true,evasion:kiba?.10:.08,actionCount:kiba?2:3,forceActionCount:true,v144ActionMin:kiba?2:3,v144ActionMax:kiba?2:ris?4:3,specialOptions:kiba?[]:[{special:'マカロン・ノータイム',kind:'single',skillType:'physical',skillElement:'光',power:1.65}]};
}
function macaronWaveV247(area,d){const t=macaronTemplateV247(area<2?'kiba':area===2?'macaron':'ris',d);return Array.from({length:area<2?3:1},()=>({template:t,level:t.levelMin}));}
const macaronBuildBaseV247=buildEnemyFromTemplate;
buildEnemyFromTemplate=function(t,...args){const e=macaronBuildBaseV247(t,...args);if(t.macaronV247){e.macaronV247=t.macaronV247;e.actionCount=e.v144ActionMin=t.macaronV247==='kiba'?2:3;e.v144ActionMax=t.v144ActionMax;e.forceActionCount=true;e.damageReduction=t.damageReduction;e.permanentDamageReduction=true;e.evasion=t.evasion;}return e;};
const macaronSizeBaseV247=enemySizeClass;
enemySizeClass=e=>e?.macaronV247?'normal':macaronSizeBaseV247(e);
const macaronAreaBaseV247=startSavannaAreaV174;
startSavannaAreaV174=async function(...args){const r=eventRunV174;if(r?.storyV179!=='macaron')return macaronAreaBaseV247(...args);eventOverlayV163().hidden=true;try{const correct=await macaronSceneV247('pre');if(r.area===1&&correct){showResultV179(true,null,true);return;}const bg=storySceneBg('magma',r.area);await startBattleLoaded({mode:'eventStory174',storyEventV174:true,storyV179:'macaron',worldId:'magma',returnScreen:'training',party:partyV179('macaron'),questVitals:r.vitals,enemyConfigs:macaronWaveV247(r.area,r.difficulty),bg:bg.bg,fallbackBg:bg.fallback});$('#battleModeLabel').textContent=`${STORY179.macaron.title} / ${STORY179.macaron.diffs[r.difficulty].name} / AREA ${r.area+1}`;$('#battleBackBtn').style.display='';}catch(e){console.error('[macaron247]',e);returnSavannaV174();toast('準備に失敗しました。もう一度お試しください。');}};
const macaronFinishBaseV247=finishSavannaV174;
finishSavannaV174=async function(b,win){const r=eventRunV174;if(r?.storyV179!=='macaron')return macaronFinishBaseV247(b,win);if(b.finished)return;b.finished=true;b.auto=false;setCommandDisabled(true);$('#battleScreen').classList.add('mint-battle-preparing-v237');let reward=null;if(win){for(const a of b.allies)r.vitals[a.id]={hp:a.hp,mp:a.mpNow,dead:a.dead,status:{...a.status}};applyProgressRewards(b,r.vitals);await macaronSceneV247('post');if(r.area===3)reward=rewardV179();}showResultV179(win,reward);};
const macaronResultBaseV247=showResultV179;
showResultV179=function(win,reward,noBattle){const r=eventRunV174;if(r?.storyV179==='macaron')$('#battleScreen').classList.add('mint-battle-preparing-v237');const result=macaronResultBaseV247(win,reward,noBattle);if(r?.storyV179==='macaron'){const card=$('.event-result-v163',eventOverlayV163());card?.classList.add('macaron-result-v247');if(reward?.medal)$$('img',card).forEach(img=>img.classList.add('macaron-medal-v247'));if(noBattle)showScreen('adventure');}return result;};
const macaronReturnBaseV247=returnSavannaV174;
returnSavannaV174=function(...args){const result=macaronReturnBaseV247(...args);$('#adventureScreen').classList.remove('macaron-transition-v247');$('#battleScreen').classList.remove('mint-battle-preparing-v237','mint-battle-v237');return result;};
window.__mobBuildVersion='v247';
