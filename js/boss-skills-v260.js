// Add variety at an existing ordinary attack slot; never add an action or replace a scripted phase.
function bossSkillPoolV260(e){if(!e||!(e.isBoss||e.isElite||['boss','elite'].includes(e.category)||['boss','midboss'].includes(e.encounterRole)||e.legendV218||e.eventV163))return[];
 const element=fxElementV251(e.attribute),level=Number(e.level||e.levelMin)||1;
 return MOB_DATA.techniqueCatalog.filter(s=>s.cartoonV259&&!s.exclusiveV260&&s.element===element&&(!s.selfBuffV259||s.tier===(level>=45?'medium':'small'))&&(s.target!=='all'||level>=25)&&!(s.kind==='slash'&&s.tier==='medium'&&level<18)).map(s=>s.id);
}
const bossBuildBaseV260=buildEnemyFromTemplate;
buildEnemyFromTemplate=function(...args){const e=bossBuildBaseV260(...args);if(e)e.extraSkillsV260=bossSkillPoolV260(e);return e;};
function chooseBossSkillV260(e,all=false){const b=state.battle;if(!e||!b||b.finished||b.turn<2||e.extraSkillTurnV260===b.turn||e.hp<=0)return null;
 const hash=[...String(e.id)].reduce((n,c)=>n+c.charCodeAt(0),0);if(!b.forceNewSkillV260&&(b.turn+hash)%3!==0)return null;
 // Retain the guaranteed normal opening of final bosses and authored phase attacks.
 if(e.finaleV248?.follow&&b.enemySlotV260===1)return null;
 const ids=e.extraSkillsV260?.length?e.extraSkillsV260:bossSkillPoolV260(e),pool=ids.map(id=>MOB_DATA.techniqueCatalog.find(s=>s.id===id)).filter(s=>s&&(all?s.target==='all':s.target!=='all'));if(!pool.length)return null;
 return pool[(Math.floor(b.turn/3)+hash)%pool.length];
}
async function useBossSkillV260(e,s){const b=state.battle,oldId=b.actingEnemyId,old=b.enemy,oldAoe=enemyAoeV163,oldCrit=enemyCriticalV163;e.extraSkillTurnV260=b.turn;b.actingEnemyId=e.uid;b.enemy=e;enemyAoeV163=s.target==='all';
 try{await inEnemyFxV251(e,{special:s.name},false,async()=>{await actionCutin(`${e.name}の${s.name}！`,'danger',620);const targets=s.target==='all'?livingField():[pick(livingMain().length?livingMain():livingField())].filter(Boolean);for(const a of targets){if(b.finished||e.hp<=0)break;await skillSprite(s.frames,a.id,s.mode);enemyCriticalV163=Math.random()<Math.min(.35,(e.eventV163?.crit||e.critChanceV245||0)+soulEffectValueV218(e,'crit'));await damageAlly(a,s.power*(enemyCriticalV163?TEMP_BALANCE.critPower:1),'physical',isSuper(a),s.element);}
  if(e.hp>0&&s.selfBuffV259){const f=s.selfBuffV259;uniqueBuffV260(e,f.key,f.value,2,'enemy-food260:'+f.family);await healingSequenceV251('enemy:'+e.uid,'buff');}
  if(e.hp>0&&e.banditV230==='onbu'){e.banditAttacksV230=(e.banditAttacksV230||0)+1;if(e.banditAttacksV230%5===0){eventHealV163(e,.08);notice('オンブ・ト・オンプ / HP回復','heal');}}
 });}finally{b.actingEnemyId=oldId;b.enemy=old;enemyAoeV163=oldAoe;enemyCriticalV163=oldCrit;renderBattle();}
}
const enemyActionBaseV260=enemyAction;
function directBossSlotV260(e,index){
 if(!e||index<=1)return null;
 if(e.legendV218)return index<=e.legendV218.aoe;
 if(e.mochiV218!==undefined)return index===2||(index===3&&Math.random()<.5);
 if(e.extraBossV218&&e.extraBossV218!=='barion'){const q=EVENT_BOSSES_V163.find(q=>q.key===e.extraBossV218);return index<=1+(e.aoeV218??q?.aoe??0);}
 if(e.hotKindV177==='passion')return false;
 if(e.hotKindV177==='iwakiri')return Math.random()<.5;
 if(index===2&&['custard','riscustard','magM','magO','magB','magMOB'].includes(e.story179Kind))return true;
 return null;
}
enemyAction=async function(index=1,uid){const b=state.battle;if(!b)return;const old=b.enemySlotV260;b.enemySlotV260=index;try{const e=enemyByUid(uid)||actingEnemy(),all=directBossSlotV260(e,index);if(all!==null&&!['sleep','stun','paralyze','confuse'].some(k=>e.status?.[k]>0)){const s=chooseBossSkillV260(e,all);if(s){await useBossSkillV260(e,s);if(e.legendV218)saveLegendV218(b);await drainReactionsV177();await checkSpecialRevives();if(!livingRoster().length)finishBattle(false);return;}}return await enemyActionBaseV260(index,uid);}finally{b.enemySlotV260=old;}};
const bossNormalBaseV260=bossNormal;
bossNormal=async function(...args){const e=actingEnemy()||state.battle?.enemy,s=chooseBossSkillV260(e);return s?useBossSkillV260(e,s):bossNormalBaseV260(...args);};
const bossSpecialBaseV260=bossSpecial;
bossSpecial=async function(spec){const e=actingEnemy()||state.battle?.enemy,chosen=spec||enemySpecialSpec(e),safe=['single','damage','aoe','singleDamage','aoeDamage'].includes(chosen?.kind),s=safe?chooseBossSkillV260(e,/aoe/i.test(chosen.kind)):null;return s?useBossSkillV260(e,s):bossSpecialBaseV260(chosen);};
const eventAttackBaseV260=eventAttackV163;
eventAttackV163=async function(e,s){const safe=!s.buff&&!s.summon&&!s.status&&!s.hpCost&&!s.debuff&&!s.chance&&(s.hits||1)===1,chosen=safe?chooseBossSkillV260(e,!!s.all):null;return chosen?useBossSkillV260(e,chosen):eventAttackBaseV260(e,s);};
const eventSpecialBaseV260=eventSpecialV218;
eventSpecialV218=async function(e,s){const safe=!s.heal&&!s.buff&&!s.atk&&!s.debuff&&!s.status?.length&&!s.chance&&(s.hits||1)===1,chosen=safe?chooseBossSkillV260(e,!!s.all):null;return chosen?useBossSkillV260(e,chosen):eventSpecialBaseV260(e,s);};
const macaronHitBaseV260=macaronHitV247;
macaronHitV247=async function(e,s,all=false,ultimate=false){const chosen=!ultimate?chooseBossSkillV260(e,all):null;return chosen?useBossSkillV260(e,chosen):macaronHitBaseV260(e,s,all,ultimate);};
const mintHitBaseV260=mintEnemyHitV237;
mintEnemyHitV237=async function(e,power,all=false,type='magic',debuff=false,spell=null){const chosen=!debuff?chooseBossSkillV260(e,all):null;return chosen?useBossSkillV260(e,chosen):mintHitBaseV260(e,power,all,type,debuff,spell);};
const banditHitBaseV260=banditHitV230;
banditHitV230=async function(e,power=1,all=false,element=e.attribute,crit=0,hits=1,confuse=0){const chosen=!confuse&&hits===1?chooseBossSkillV260(e,all):null;return chosen?useBossSkillV260(e,chosen):banditHitBaseV260(e,power,all,element,crit,hits,confuse);};
