/* Short, finite monster rushes. Isolated from existing event clear/drop records. */
validateRushV252(RUSH_DATA_V252,{worldIds:MOB_DATA.adventureWorlds.map(w=>w.id),storyIds:Object.keys(STORY179),playerIds:MOB_DATA.players.map(p=>p.id)});
for(const medal of RUSH_DATA_V252.medals){if(weaponById(medal.id))throw Error('Duplicate rush medal '+medal.id);WEAPONS.push(clone(medal));}
let rushStartingV252=false;
const rushQuestV252=id=>RUSH_DATA_V252.quests.find(q=>q.id===id);
const rushClearedV252=q=>!!state.meta.monsterRushV252?.[q.id];
function rushUnlockedV252(q){return !!q&&worldCleared(q.unlock.world)&&(!q.unlock.story||!!state.meta.storyEventsV179?.[q.unlock.story]?.[q.unlock.record]);}
function rushOpenV252(q){return rushUnlockedV252(q)&&!rushClearedV252(q);}
const rushTextV252=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function rushMenuV252(){
 const root=$('#trainingFeaturePanel');root.hidden=false;
 root.innerHTML=`<section class="event-panel-v163 rush-panel-v252"><header><h2>モンスターラッシュ</h2><button data-rush-back>戻る</button></header><p>HP・MPを引き継いで連戦！<br>全戦勝利でメダル1枚。各クエスト1回限り。<br>途中の経験値・コイン・ドロップはありません。</p><div class="rush-list-v252">${RUSH_DATA_V252.quests.map(q=>{
 const open=rushUnlockedV252(q),cleared=rushClearedV252(q),m=weaponById(q.reward),waves=q.areas.reduce((n,a)=>n+a.waves.length,0);
 return `<article class="rush-card-v252"><img class="rush-icon-v252" src="${RUSH_DATA_V252.icon}" alt="連戦クエスト"><div><h3>${rushTextV252(q.title)}</h3><p>全${q.areas.length} AREA / ${waves}連戦 / 推奨Lv.${q.recommendedLevel}</p><p>${open?'解放済み':rushTextV252(q.unlock.label)+'で解放'}</p><p>${open?`<img class="rush-medal-v252" src="${m.image}" alt="">${rushTextV252(m.name)}<br>${rushTextV252(m.traitLabel)}`:'報酬：中ボスメダル（解放後に公開）'}</p><button class="primary-btn" data-rush-start="${q.id}" ${rushOpenV252(q)?'':'disabled'}>${cleared?'CLEAR / 受領済み':open?'挑戦する':'未解放'}</button></div></article>`;
 }).join('')}</div></section>`;
 $('[data-rush-back]',root).onclick=()=>{eventViewV163='story';selectedStoryV179=null;renderEventQuestsV163();};
 $$('[data-rush-start]',root).forEach(b=>b.onclick=()=>startRushV252(b.dataset.rushStart));bindImages(root);
}
const rushMenuBaseV252=renderEventQuestsV163;
renderEventQuestsV163=function(...args){if(eventViewV163==='rush252')return rushMenuV252();const result=rushMenuBaseV252(...args);
 if(eventViewV163==='menu'||eventViewV163==='story'&&selectedStoryV179===null){const panel=$('#trainingFeaturePanel .event-panel-v163');if(panel&&!$('[data-rush-door]',panel)){const b=document.createElement('button');b.className='rush-door-v252';b.dataset.rushDoor='';b.innerHTML=`<img src="${RUSH_DATA_V252.icon}" alt=""><span><b>モンスターラッシュ</b><small>1～2 AREAの短い連戦 / 初回メダル報酬</small></span>`;b.onclick=()=>{eventViewV163='rush252';renderEventQuestsV163();};panel.append(b);}}return result;};
async function rushDialogueV252(lines,r){for(const line of lines){if(eventRunV174!==r)return;const actor=line.speaker==='v179-phoenix'?{name:'モブフェニックス',image:'spenemy/41.png'}:player(line.speaker);await dialog(line.text,[['次へ','next','primary']],actor.name,actor.image);}}
async function startRushV252(id){const q=rushQuestV252(id);if(rushStartingV252||eventRunV174||!rushOpenV252(q))return false;rushStartingV252=true;
 try{if(!await confirmStoryChallengeV179(q.title,`推奨Lv.${q.recommendedLevel} / 全${q.areas.length} AREA`))return false;if(eventRunV174||!rushOpenV252(q))return false;
  eventRunV174={rushV252:id,area:0,wave:0,vitals:{},rewarded:false};$('#trainingFeaturePopup').hidden=true;await startRushAreaV252(eventRunV174);return true;
 }catch(err){console.error('[rush252]',err);returnRushV252();toast('準備に失敗しました。もう一度挑戦してください。');return false;}finally{rushStartingV252=false;}
}
function rushWavesV252(q,index){return q.areas[index].waves.map(w=>w.map(row=>({template:clone(RUSH_DATA_V252.enemies[row.enemy]),level:row.level})));}
async function startRushAreaV252(r){if(eventRunV174!==r)return;const q=rushQuestV252(r.rushV252),a=q.areas[r.area];eventOverlayV163().hidden=true;
 await rushDialogueV252(a.pre,r);if(eventRunV174!==r)return;const bg=storySceneBg(q.world,r.area);
 await startBattleLoaded({mode:'eventStory174',storyEventV174:true,rushV252:q.id,worldId:q.world,returnScreen:'training',party:state.party,questVitals:r.vitals,waves:rushWavesV252(q,r.area),bg:bg.bg,fallbackBg:bg.fallback,...(a.waves.some(w=>w.some(e=>e.enemy==='v179-phoenix'))?{storyV179:'phoenix'}:{})});
 if(eventRunV174!==r)return;if(state.battle?.config?.rushV252!==q.id)throw Error('Rush battle not started');rushLabelV252();$('#battleBackBtn').style.display='';$('#battleBackBtn').disabled=false;
}
function rushLabelV252(){const r=eventRunV174;if(!r?.rushV252)return;const q=rushQuestV252(r.rushV252);$('#battleModeLabel').textContent=`${q.title} / AREA ${r.area+1} / WAVE ${r.wave+1}/${q.areas[r.area].waves.length}`;}
const rushWaveBaseV252=spawnNextEnemyWave;
spawnNextEnemyWave=async function(...args){const b=state.battle,r=eventRunV174;if(!b?.config?.rushV252)return rushWaveBaseV252(...args);if(b.finished||b.rushTransitionV252||!b.pendingWaveConfigs?.length||!r)return false;
 b.rushTransitionV252=true;b.busy=true;try{const records=b.pendingWaveConfigs.shift();const next=buildEnemyWave(records,Math.min(4,b.allies.length),b.bg,b.fallbackBg);if(!next.length||next.length>RUSH_DATA_V252.maxSimultaneous)throw Error('Rush wave cap');
  b.enemies=next;b.enemy=next[0];b.targetEnemyId=next[0].uid;b.actingEnemyId=null;b.queue=[];b.queuePos=0;r.wave++;rushLabelV252();renderBattle();await actionCutin(`WAVE ${r.wave+1} / 次の相手が出現！`,'danger',650);if(state.battle!==b||eventRunV174!==r)return false;b.busy=false;await startRound();return true;
 }finally{b.rushTransitionV252=false;}
};
// No partial progress payout, including indirect calls from other event wrappers.
const rushProgressBaseV252=applyProgressRewards;
applyProgressRewards=function(b,...args){return b?.config?.rushV252?{exp:0,coin:0,changes:[]}:rushProgressBaseV252(b,...args);};
function rewardRushV252(r,b){const q=rushQuestV252(r?.rushV252);if(!q||eventRunV174!==r||state.battle!==b||!b.finished||!b.rushWonV252||r.rewarded||rushClearedV252(q)||r.area!==q.areas.length-1||b.pendingWaveConfigs.length||r.wave!==q.areas[r.area].waves.length-1||livingEnemies().length)return false;
 r.rewarded=true;state.meta.monsterRushV252??={};state.meta.monsterRushV252[q.id]=true;state.meta.medals??={};state.meta.medals[q.reward]=medalOwned(q.reward)+1;saveMeta();return true;
}
const rushFinishBaseV252=finishSavannaV174;
finishSavannaV174=async function(b,win){if(!b?.config?.rushV252)return rushFinishBaseV252(b,win);const r=eventRunV174;if(!r||b.finished||b.rushTransitionV252)return;if(win&&(livingEnemies().length||b.pendingWaveConfigs.length))return;
 b.finished=true;b.auto=false;b.rushWonV252=!!win;setCommandDisabled(true);persistUltimateCooldownsFromBattle();const q=rushQuestV252(r.rushV252),last=r.area===q.areas.length-1;
 if(win){for(const a of b.allies)r.vitals[a.id]={hp:a.hp,mp:a.mpNow,dead:a.dead,status:{...a.status}};if(last)rewardRushV252(r,b);await rushDialogueV252(q.areas[r.area].post,r);}
 if(eventRunV174!==r)return;const ov=eventOverlayV163(),m=weaponById(q.reward);ov.innerHTML=`<div class="event-result-v163 rush-result-v252"><small>${rushTextV252(q.title)}</small><h2>${win?last?'QUEST CLEAR!!':'AREA CLEAR!':'DEFEAT'}</h2><p>AREA ${r.area+1}</p>${win&&last?`<img class="rush-reward-v252" src="${m.image}" alt="${rushTextV252(m.name)}"><p>${rushTextV252(m.name)} ×1<br>受領済み</p>`:win?'<p>HP・MP・状態異常を引き継いで進みます。</p>':'<p>報酬は未受領です。編成を整えて再挑戦できます。</p>'}<button class="primary-btn" data-rush-next>${win&&!last?'次のAREAへ':'クエストへ戻る'}</button><button data-rush-home>HOMEへ</button></div>`;ov.hidden=false;bindImages(ov);
 $('[data-rush-next]',ov).onclick=async function(){this.disabled=true;if(win&&!last){r.area++;r.wave=0;try{await startRushAreaV252(r);}catch(err){console.error('[rush252]',err);returnRushV252();toast('準備に失敗しました。再挑戦できます。');}}else returnRushV252();};
 $('[data-rush-home]',ov).onclick=()=>goHome();
};
function clearRushV252(){if(!eventRunV174?.rushV252)return false;const b=state.battle;if(b?.config?.rushV252){b.finished=true;b.auto=false;state.battle=null;}eventRunV174=null;skippedV174=false;skipBtnV174.hidden=true;eventOverlayV163().hidden=true;$('#resultOverlay').hidden=true;$('#skillMenu').hidden=true;return true;}
function returnRushV252(){clearRushV252();state.training.mode='event';eventViewV163='rush252';renderTraining();showScreen('training');$('#trainingFeaturePopup').hidden=false;$('#trainingFeaturePopup').dataset.mode='event';}
const rushReturnBaseV252=returnSavannaV174;
returnSavannaV174=function(...args){return eventRunV174?.rushV252?returnRushV252():rushReturnBaseV252(...args);};
const rushHomeBaseV252=goHome;
goHome=async function(...args){if(clearRushV252())$('#trainingFeaturePopup').hidden=true;return rushHomeBaseV252(...args);};
window.__mobBuildVersion='v252';
