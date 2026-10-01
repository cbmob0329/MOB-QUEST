const FINALE_ENEMIES_V248={
 'dc2-hell':{level:88,cut:.08,evade:.07,resist:{火:.5}},'dc2-kirin':{level:88,cut:.08,evade:.07,resist:{雷:.5}},
 'dc2-kufu':{level:85,cut:.08,evade:.07,resist:{光:.5}},'dc2-riva':{level:85,cut:.08,evade:.07,resist:{水:.5}},
 'dc2-lilith':{level:90,cut:.12,evade:.08,crit:.08,resist:Object.fromEntries(['火','水','雷','風','地','光','闇','無'].map(k=>[k,.1]))},
 'dc2-enma':{level:92,cut:.12,evade:.06,crit:.10,resist:{火:1},follow:.10,followPower:1},
 'dc2-enma2':{level:94,cut:.13,evade:.06,crit:.10,resist:{火:1},follow:.20,followPower:1.2},
 'dc2-enma3':{level:95,cut:.14,evade:.06,crit:.10,resist:{火:1},follow:.20,followPower:1.2,heal:.05},
 'dc2-maou':{level:95,cut:.14,evade:.06,crit:.10,actions:[3,4],follow:.12,followPower:1.2,absorb:.05},
 'dc2-ulrilis':{level:99,cut:.15,evade:.06,crit:.10,actions:[3,4],follow:.12,followPower:1.2,absorb:.05}
};
for(const [id,q]of Object.entries(FINALE_ENEMIES_V248)){const t=trainingEnemyTemplate(id);if(t)Object.assign(t,{levelMin:q.level,levelMax:q.level,damageReduction:q.cut,permanentDamageReduction:true,evasion:q.evade,finaleV248:q,...(q.resist?{elementResist:{...q.resist}}:{}),...(q.actions?{forceActionCount:true,actionCount:3,v144ActionMin:3,v144ActionMax:4}:{})});}
const finaleWorldV248=MOB_DATA.adventureWorlds.find(w=>w.id==='demonCastle2');for(const a of finaleWorldV248.areas)for(const rows of [a.boss,a.nextWave,...a.nextWaves||[]])for(const row of rows||[])if(FINALE_ENEMIES_V248[row.id])row.level=FINALE_ENEMIES_V248[row.id].level;
const finaleBuildBaseV248=buildEnemyFromTemplate;
buildEnemyFromTemplate=function(t,...args){const e=finaleBuildBaseV248(t,...args),q=FINALE_ENEMIES_V248[t.id];if(q){e.finaleV248=q;e.damageReduction=q.cut;e.permanentDamageReduction=true;e.evasion=q.evade;if(q.resist)e.elementResist={...q.resist};if(q.actions){e.actionCount=e.v144ActionMin=q.actions[0];e.v144ActionMax=q.actions[1];e.forceActionCount=true;}}return e;};
const finaleDamageBaseV248=damageAlly;
let finaleFollowPowerV248=1;
damageAlly=async function(a,power,...args){const e=actingEnemy(),q=e?.finaleV248;if(!q)return finaleDamageBaseV248(a,power,...args);const old=enemyCriticalV163,critical=q.crit>0&&Math.random()<q.crit;enemyCriticalV163=critical;try{return await finaleDamageBaseV248(a,power*finaleFollowPowerV248*(critical?TEMP_BALANCE.critPower:1),...args);}finally{enemyCriticalV163=old;}};
const finaleNormalBaseV248=bossNormal;
bossNormal=async function(...args){const b=state.battle,e=actingEnemy(),q=e?.finaleV248;const result=await finaleNormalBaseV248(...args);if(q?.follow&&state.battle===b&&!b.finished&&e.hp>0&&livingField().length&&Math.random()<q.follow){const old=finaleFollowPowerV248;finaleFollowPowerV248=q.followPower;try{await reactionV177(e,'連撃','');await finaleNormalBaseV248(...args);}finally{finaleFollowPowerV248=old;}}return result;};
const finaleIncomingBaseV248=applyEnemyDamageTo;
applyEnemyDamageTo=function(a,e,power,type='physical',...args){const q=e?.finaleV248;if(!q||!e||e.hp<=0||state.test?.enabled&&state.test.oneHitV224)return finaleIncomingBaseV248(a,e,power,type,...args);const element=normalizeElement(attackElementFromContext(a,type));if(q.resist?.[element]===1){floatNumber(0,'damage',`enemy:${e.uid}`);notice(element+'属性無効','system',500);return{value:0,crit:false,miss:false,immune:true,element};}if(type==='magic'&&q.absorb&&Math.random()<q.absorb){const amount=Math.min(e.maxHp-e.hp,Math.round(e.maxHp*.05));e.hp+=amount;floatNumber(amount,'heal',`enemy:${e.uid}`);notice('魔法吸収','heal',650);renderBattle();return{value:0,crit:false,miss:false,absorbed:true,healed:amount,element};}return finaleIncomingBaseV248(a,e,power,type,...args);};
const finaleRoundBaseV248=startRound;
startRound=async function(...args){const b=state.battle;if(b&&!b.finished)for(const e of livingEnemies()){if(!e.finaleV248?.heal||e.finaleHealTurnV248===b.turn)continue;e.finaleHealTurnV248=b.turn;if(Math.random()<e.finaleV248.heal){const hp=Math.min(e.maxHp-e.hp,Math.round(e.maxHp*.05));e.hp+=hp;if(hp){notice(e.name+' HP回復','heal',600);floatNumber(hp,'heal',`enemy:${e.uid}`);renderBattle();}}}return finaleRoundBaseV248(...args);};
function figureSlotsV248(){try{return state.meta?.gameCleared?6:4;}catch{return 6;}}
const finaleFigureRenderBaseV248=renderFigureGroupV220;
renderFigureGroupV220=function(...args){const result=finaleFigureRenderBaseV248(...args),panel=$('.figure-group-v220');if(panel){const p=document.createElement('p');p.className='finale-slot-info-v248';p.textContent=figureSlotsV248()===6?'本編クリア特典：メイン・サブ各6体まで装備可能':'メイン・サブ各4体まで装備可能';$('h2',panel)?.after(p);}return result;};
// Keep every existing technique; reserve the first action for the authored normal-attack passive.
const finaleActionBaseV248=enemyAction;
enemyAction=async function(index=1,uid){const b=state.battle,e=enemyByUid(uid)||actingEnemy()||b?.enemy;if(!e?.finaleV248?.follow||index!==1)return finaleActionBaseV248(index,uid);if(!b||b.finished||e.hp<=0||statusStopsActionV235(e))return;if(e.status.confuse>0)return confusedActionV235(e,true);const old=b.enemy,oldId=b.actingEnemyId;b.enemy=e;b.actingEnemyId=e.uid;try{await bossNormal();if(!livingRoster().length)await finishBattle(false);}finally{b.enemy=old;b.actingEnemyId=oldId;}};
