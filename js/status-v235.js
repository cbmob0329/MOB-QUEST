// Persistent ailments use the existing positive status flags (compatible with saved vitals).
function recoverOnHitV235(a){
 if(!a?.status)return;
 if(a.status.sleep>0){a.status.sleep=0;notice(`${a.name}は眠りから覚めた！`,'status');}
 if(a.status.confuse>0&&Math.random()<.30){a.status.confuse=0;notice(`${a.name}の混乱が治った！`,'status');}
}
wakeEnemyOnHit=recoverOnHitV235;
const statusEffectiveV235=effective;
effective=function(stat,a){return statusEffectiveV235(stat,a)*(stat==='spd'&&a?.status?.burn>0?.5:1);};
const statusInitiativeV235=initiativeSpeed;
initiativeSpeed=function(entry){const e=entry.type==='enemy'?enemyByUid(entry.enemyId):null;return statusInitiativeV235(entry)*(e?.status?.burn>0?.5:1);};
const statusHitV235=playerAttackHitChance;
playerAttackHitChance=function(a,e,...args){return e?.status?.paralyze>0?1:statusHitV235(a,e,...args);};
const statusEvadeV235=incomingEvadeV232;
incomingEvadeV232=a=>a?.status?.paralyze>0?0:statusEvadeV235(a);
const statusCalcV235=calcDamage;
calcDamage=function(a,type,power,crit,e=targetEnemy()){
 if(a?.status?.poison>0&&Math.random()<.10)return{value:0,crit:false,miss:true};
 return statusCalcV235(a,type,power,crit,e);
};
const statusIncomingV235=damageAlly;
damageAlly=async function(a,...args){
 if((actingEnemy()||state.battle?.enemy)?.status?.poison>0&&Math.random()<.10){showMiss(a.id);return 0;}
 return statusIncomingV235(a,...args);
};
function statusStopsActionV235(a){
 for(const k of ['sleep','paralyze','stun'])if(a?.status?.[k]>0){
  if(k==='stun')a.status.stun--;
  notice(`${a.name}は${k==='sleep'?'眠っている':k==='paralyze'?'マヒして動けない':'ひるんで動けない'}！`,'status');return true;
 }
 return false;
}
async function confusedActionV235(a,isEnemy=false){
 const b=state.battle;if(!b||b.finished||a.dead||a.hp<=0)return;
 const oldActor=b.actingEnemyId,oldEnemy=b.enemy,context=b.weaponAttackContext,kind=b.currentActionKind;
 const friendly=Math.random()<.5;
 const own=(isEnemy?livingEnemies():livingField()).filter(t=>t!==a);
 const target=friendly?pick(own.length?own:[a]):pick(isEnemy?livingMain():livingEnemies());
 if(!target)return;
 b.currentActionKind='attack';b.weaponAttackContext={normal:true,element:isEnemy?a.attribute:weaponCombatElement(a)};
 if(isEnemy){b.actingEnemyId=a.uid;b.enemy=a;}
 try{
  await actionCutin(`${a.name}は混乱している！`,'status',500);
  if(!friendly){
   if(isEnemy)await damageAlly(target,1,'physical',false,a.attribute);
   else applyEnemyDamageTo(a,target,1,'physical');
  }else{
   // Calculate one normal hit first, then halve its damage. Never trigger follow-ups on an ally.
   let result;
   if(isEnemy){const miss=(a.status.poison>0&&Math.random()<.10)||(target.status.paralyze<=0&&Math.random()<Number(target.evasion||0));result={miss,value:miss?0:calcEnemyDamage(target,1,'physical')};}
   else result=calcDamage(a,'physical',1,0,{...target,evasion:incomingEvadeV232(target)});
   const dest=isEnemy?`enemy:${target.uid}`:target.id;
   if(result.miss){showMiss(dest);return;}
   if(!isEnemy&&target.barrier>0){target.barrier--;notice('バリアが攻撃を無効化！','buff');return;}
   const damage=Math.max(1,Math.round(result.value*.5));
   const immortal=isEnemy?b.config?.scriptedImmortalEnemy:b.config?.scriptedImmortalParty||b.config?.forcePartyOneHp;
   target.hp=Math.max(immortal?1:0,target.hp-damage);recoverOnHitV235(target);
   floatNumber(damage,'damage',dest);if(isEnemy){pulseEnemy('hit',target.uid);if(target.hp<=0)recordEnemyDefeat(target);}else{pulseAllyDamage(target.id);if(target.hp<=0){target.dead=true;await triggerYushaMission(target);}}
  }
  await checkSpecialRevives();
 }finally{b.actingEnemyId=oldActor;b.enemy=oldEnemy;b.weaponAttackContext=context;b.currentActionKind=kind;renderBattle();}
}
const statusEnemyActionV235=enemyAction;
enemyAction=async function(index=1,uid){const e=enemyByUid(uid)||actingEnemy()||state.battle?.enemy;if(!e||e.hp<=0||state.battle?.finished)return;if(statusStopsActionV235(e))return;if(e.status.confuse>0)return confusedActionV235(e,true);return statusEnemyActionV235(index,uid);};
const statusSupportV235=superSubAction;
superSubAction=async function(a,...args){if(statusStopsActionV235(a))return;if(a.status.confuse>0)return confusedActionV235(a);return statusSupportV235(a,...args);};
window.__mobBuildVersion='v235';
