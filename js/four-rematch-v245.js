STORY179.fourRematch={title:'ミラモブ4人衆再び',world:'desert',unlock:'desert2',unlockName:'砂漠Ⅱ',image:'enemy/40.png',diffs:[{name:'ハード',level:75,coins:100000,diamonds:150,figures:[]}]};
const FOUR_REMATCH_V245=[
 {key:'earth',id:'d2-miraearth',element:'地',cut:'magic',all:{special:'ソウル・アース・グラビディクラッシュ',kind:'aoe',power:1.16,skillType:'physical'},single:{special:'グラビディクラッシュ',kind:'singleSpdDown',power:1.08,debuff:.12,skillType:'physical'}},
 {key:'fire',id:'d2-mirakarami',element:'火',cut:'physical',all:{special:'ホワイトミイラフレイム',kind:'aoe',power:1.05,skillType:'magic'},single:{special:'ソウル・ヘル・ミイラフレイム',kind:'single',power:1.65,skillType:'magic'}},
 {key:'water',id:'d2-miranight',element:'水',cut:'physical',all:{special:'ソウル・ダイダル・スパイラル',kind:'aoe',power:1.18,skillType:'magic'},single:{special:'シャドウ・オーラ・スパイラル',kind:'sleepSingle',power:1.65,chance:.30,skillType:'magic'}},
 {key:'time',id:'d2-miratime',element:'光',cut:'magic',all:{special:'デザート・ストーム・タイム',kind:'aoeParalyzeChance',power:.66,chance:.20,skillType:'magic'},single:{special:'ソウル・マジック・ゴーストタイム',kind:'stunSingle',power:1.12,chance:.70,skillType:'magic'}}
];
function fourRematchWaveV245(){return FOUR_REMATCH_V245.map(q=>{
 const base=trainingEnemyTemplate(q.id);
 return {level:75,template:{...base,id:'four245-'+q.key,fourRematchV245:q.key,attribute:q.element,mods:{...(base.mods||{}),hp:1.35,atk:1.15,mag:1.15,def:1.10,res:1.10},actionCount:2,forceActionCount:true,v144ActionMin:2,v144ActionMax:2,damageReduction:.12,permanentDamageReduction:true,evasion:.10,fourTypeCutV245:q.cut,critChanceV245:.14,noEscape:true}};
});}
const fourActionBaseV245=enemyAction;
const fourPowerBaseV245=enemyMainSkillPower;
enemyMainSkillPower=function(e,spec){return e?.fourRematchV245?Math.max(.01,Number(spec?.power)||1):fourPowerBaseV245(e,spec);};
enemyAction=async function(index=1,uid){
 const e=enemyByUid(uid),b=state.battle,q=FOUR_REMATCH_V245.find(q=>q.key===e?.fourRematchV245);
 if(!q)return fourActionBaseV245(index,uid);
 if(!b||b.finished||e.hp<=0||statusStopsActionV235(e))return;
 if(e.status.confuse>0)return confusedActionV235(e,true);
 const old=b.enemy,oldId=b.actingEnemyId;b.enemy=e;b.actingEnemyId=e.uid;
 try{await bossSpecial({... (index===1?q.all:q.single),skillElement:q.element});}finally{b.enemy=old;b.actingEnemyId=oldId;renderBattle();}
};
const fourDamageBaseV245=damageAlly;
damageAlly=async function(a,power,...args){
 const e=actingEnemy();if(!e?.fourRematchV245)return fourDamageBaseV245(a,power,...args);
 const old=enemyCriticalV163,critical=Math.random()<.14;enemyCriticalV163=critical;
 try{return await fourDamageBaseV245(a,power*(critical?TEMP_BALANCE.critPower:1),...args);}finally{enemyCriticalV163=old;}
};
const fourHitBaseV245=applyEnemyDamageTo;
applyEnemyDamageTo=function(a,e,power,type='physical',...args){
 if(!e?.fourRematchV245||e.fourTypeCutV245!==type)return fourHitBaseV245(a,e,power,type,...args);
 const old=e.damageReduction;e.damageReduction=1-(1-Number(old||0))*.9;
 try{return fourHitBaseV245(a,e,power,type,...args);}finally{e.damageReduction=old;}
};

const fourMenuBaseV245=renderEventQuestsV163;
renderEventQuestsV163=function(...args){
 const selected=selectedStoryV179;if(selected==='fourRematch')selectedStoryV179=null;
 let result;try{result=fourMenuBaseV245(...args);}finally{selectedStoryV179=selected;}
 if(eventViewV163!=='story')return result;
 const panel=$('#trainingFeaturePanel .event-panel-v163');if(!panel)return result;
 const q=STORY179.fourRematch,unlocked=worldCleared('desert2')||testAllQuestsV171(),cleared=!!recordsV179('fourRematch')[0];
 if(selected===null){
  const card=document.createElement('button');card.className='event-story-card-v174 four-rematch-card-v245';card.dataset.fourRematch='';
  card.innerHTML='<small>HARD / AREA 4</small><strong>ミラモブ4人衆再び</strong><div>'+FOUR_REMATCH_V245.map(q=>`<img src="${trainingEnemyTemplate(q.id).image}" alt="${trainingEnemyTemplate(q.id).name}">`).join('')+'</div><small></small>';
  $('small:last-child',card).textContent=cleared?'CLEAR':unlocked?'適正 Lv.75':'砂漠Ⅱクリア後に解放';card.onclick=()=>{selectedStoryV179='fourRematch';renderEventQuestsV163();};($('.event-story-list-v177',panel)||panel).append(card);
 }else if(selected==='fourRematch'){
  panel.innerHTML='<button data-nm-back type="button">戻る</button><div class="four-rematch-detail-v245"><h2>ミラモブ4人衆再び</h2><p>ハード限定 / 適正 Lv.75</p><p>砂漠 AREA 4 / 4体同時戦</p><div class="four-rematch-portraits-v245">'+FOUR_REMATCH_V245.map(q=>`<img src="${trainingEnemyTemplate(q.id).image}" alt="${trainingEnemyTemplate(q.id).name}">`).join('')+'</div><p>クリア報酬<br>コイン 100,000 / ダイヤ 150個</p><button class="primary-btn" data-four-start type="button"></button></div>';
  $('[data-nm-back]',panel).onclick=()=>{selectedStoryV179=null;renderEventQuestsV163();};const start=$('[data-four-start]',panel);start.disabled=!openV179('fourRematch',0);start.textContent=cleared?'CLEAR':unlocked?'ハードに挑戦する':'砂漠Ⅱクリア後に解放';start.onclick=()=>startV179('fourRematch',0);
 }
 $('.quest-cards-v218',panel)?.dispatchEvent(new Event('scroll'));return result;
};
const fourStartBaseV245=startV179;
startV179=async function(key,d=0){
 if(key!=='fourRematch')return fourStartBaseV245(key,d);
 if(eventRunV174||d!==0||!openV179(key,0))return false;
 if(!await confirmStoryChallengeV179(STORY179[key].title,'ハード / 適正 Lv.75'))return false;
 eventRunV174={storyV179:key,difficulty:0,area:3,vitals:{},rewarded:false};skippedV174=false;skipScopeV174='';$('#trainingFeaturePopup').hidden=true;await startSavannaAreaV174();return true;
};
const fourInfoBaseV245=nmInfoV239;
nmInfoV239=function(key){const q=FOUR_REMATCH_V245.find(q=>q.id===key);if(q)return trainingEnemyTemplate(key);if(['pink','denden','desert','nyoro'].includes(key))return player(key);return fourInfoBaseV245(key);};
for(const id of [...FOUR_V231,'pink','denden','desert','nyoro'])NM_NAMES_V239[id]=FOUR_V231.includes(id)?trainingEnemyTemplate(id).name:player(id).name;
const FOUR_PRE_V245=[['d2-mirakarami','また会ったな！！'],['pink','出ましたね！\nミラモブ四人衆！'],['d2-miraearth','さあリベンジの時だ'],['denden','またやっつけるでやんす！'],['d2-miranight','今度は油断しない'],['desert','新たな力、存分に試させてもらうぞ！'],['d2-miratime','ゲームスタートだ！']];
const FOUR_POST_V245=[['nyoro','やったニョロ～！'],['money','もう会いたくないわね'],['desert','いや、いずれまた会うことになるだろう']];
async function fourCastV245(){await Promise.all(FOUR_V231.map((key,i)=>nmActorV239(key,i%2?74:26,i<2?33:54,1,'bubble')));}
async function fourSummonV245(){
 const stage=nmStageV239,fx=document.createElement('div');fx.className='four-summon-v245';fx.innerHTML='<div class="four-summon-rune-v245">'+nmRuneSvgV242()+'</div>'+['time','fire','earth','water'].map((k,i)=>`<i class="${k}" style="--orbit:${i*90}deg"><span></span></i>`).join('');stage.append(fx);
 try{await nmMotionV242(fx,[{opacity:0,scale:'.2'},{opacity:.9,scale:'1',offset:.3},{opacity:1,scale:'1.12'}],2200,'ease-in');await fourCastV245();await nmMotionV242(fx,[{opacity:1,scale:'1.12'},{opacity:0,scale:'1.5'}],650);}finally{fx.remove();}
}
async function fourPyramidV245(){
 const stage=nmStageV239;
 await Promise.all(FOUR_V231.map(async(key)=>{
  const actor=nmElV239(key),r=nmRectV239(actor),s=stage.getBoundingClientRect(),fx=document.createElement('div');fx.className='four-pyramid-v245';fx.style.cssText=`left:${r.x+r.width/2-s.x}px;top:${r.bottom-s.y}px;width:${r.width*1.3}px;height:${r.height*1.45}px`;
  fx.innerHTML='<svg viewBox="0 0 120 150" preserveAspectRatio="none"><path d="M60 4L4 132 60 147 116 132Z"/><path d="M60 4V147M4 132L60 115 116 132"/></svg>';stage.append(fx);
  try{await nmMotionV242(fx,[{opacity:0,scale:'1 .05'},{opacity:1,scale:'1 1'}],1300,'ease-out');await nmMotionV242(actor,[{opacity:1},{opacity:0,scale:'.3'}],900);actor.hidden=true;actor.style.opacity='0';await nmMotionV242(fx,[{opacity:1},{opacity:0,scale:'.1',translate:'0 -35px'}],1100);}finally{fx.remove();}
 }));
}
async function fourSceneV245(phase){
 $('#adventureScreen').classList.add('nm-underlay-v239');showScreen('adventure');storyBusy=true;
 const stage=document.createElement('section');stage.className='nm-stage-v239 four-stage-v245';stage.setAttribute('aria-label',STORY179.fourRematch.title);stage.innerHTML='<div class="nm-background-v239"></div><div class="nm-cast-v239"></div><div class="nm-bubble-v239" hidden><b></b><p></p><span>▾</span></div>';document.body.append(stage);nmStageV239=stage;stage.onclick=e=>handleStoryTapAdvance(e);const scope=beginConversationV224();
 try{
  if(phase==='pre')await fourSummonV245();else{await fourCastV245();await fourPyramidV245();}
  const heroes=phase==='pre'?['pink','denden','desert']:['nyoro','money','desert'];await Promise.all(heroes.map((id,i)=>nmActorV239(id,20+i*30,88)));
  for(const [id,text]of phase==='pre'?FOUR_PRE_V245:FOUR_POST_V245)await nmSayV239(id,text);
  await nmMotionV242(stage,[{opacity:1},{opacity:0}],450);
 }finally{endConversationV224(scope);stage.remove();nmStageV239=null;storyBusy=false;}
}
const fourAreaBaseV245=startSavannaAreaV174;
startSavannaAreaV174=async function(...args){
 const r=eventRunV174;if(r?.storyV179!=='fourRematch')return fourAreaBaseV245(...args);
 eventOverlayV163().hidden=true;
 try{await fourSceneV245('pre');await startBattleLoaded({mode:'eventStory174',storyEventV174:true,storyV179:'fourRematch',worldId:'desert',returnScreen:'training',party:state.party,questVitals:r.vitals,enemyConfigs:fourRematchWaveV245(),bg:'back/sabaku4.png',fallbackBg:'back/sabaku.png'});$('#battleModeLabel').textContent='ミラモブ4人衆再び / ハード / AREA 4';}catch(error){console.error('[fourRematch245]',error);returnSavannaV174();toast('イベントの準備に失敗しました。もう一度お試しください。');}
};
const fourFinishBaseV245=finishSavannaV174;
finishSavannaV174=async function(b,win){
 const r=eventRunV174;if(r?.storyV179!=='fourRematch')return fourFinishBaseV245(b,win);
 if(b.finished)return;b.finished=true;b.auto=false;setCommandDisabled(true);$('#battleScreen').classList.add('mint-battle-preparing-v237');let reward=null;
 if(win){for(const a of b.allies)r.vitals[a.id]={hp:a.hp,mp:a.mpNow,dead:a.dead,status:{...a.status}};applyProgressRewards(b,r.vitals);await fourSceneV245('post');reward=rewardV179();}
 showResultV179(win,reward);$('.event-result-v163',eventOverlayV163())?.classList.add('four-result-v245');
};
