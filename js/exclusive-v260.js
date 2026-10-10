Object.assign(SKILL_ATLASES_V259,EXCLUSIVE_ATLASES_V260);
const exclusiveByIdV260=id=>MOB_DATA.techniqueCatalog.find(s=>s.id===id&&s.exclusiveV260);
function exclusiveRemainingV260(a,s){return Math.min(2,Math.max(0,(a.exclusiveReadyV260?.[s.id]||0)-(state.battle?.turn||1)));}
function exclusiveCostV260(a,s){return Math.ceil(s.cost*(1-clamp(Number((a.figureEffects||figureEffectsFor(a.id)).mpCut||0),0,.8)));}
function exclusiveErrorV260(a,s){if(s.owner!==a.id||a.helperV218)return'このキャラクターの専用技ではありません';if(a.level<s.level&&!state.test?.allSkills)return`Lv.${s.level}で習得します`;if(exclusiveRemainingV260(a,s))return`次の使用可能まで${exclusiveRemainingV260(a,s)}ターン`;if(a.mpNow<exclusiveCostV260(a,s))return'MPが足りない！';if(figureSoulV218(a)<1)return'ソウルが足りない！';return'';}
function uniqueBuffV260(a,key,value,turns,source,start=state.battle.turn){a.soulEffectsV218=(a.soulEffectsV218||[]).filter(e=>e.sourceV260!==source||e.key!==key);a.soulEffectsV218.push({key,value,until:start+turns,startV260:start,sourceV260:source});}
const effectValueBaseV260=soulEffectValueV218;
soulEffectValueV218=function(a,key){const all=a?.soulEffectsV218;if(!all)return effectValueBaseV260(a||{},key);return all.filter(e=>e.key===key&&e.until>(state.battle?.turn||0)&&(!e.startV260||e.startV260<=state.battle.turn)).reduce((v,e)=>v+e.value,0);};
async function exclusiveCutinV260(a,name){const el=document.createElement('div');el.className='exclusive-cutin-v260';el.innerHTML=`<img src="${versionedPlay(a.image)}" alt=""><strong></strong>`;$('strong',el).textContent=name;$('#battleFxLayer')?.append(el);try{await delay(650);}finally{el.remove();}}
async function exclusiveArtV260(s,target,row){const sk=row==null?s:{...s,cartoonV259:{...s.cartoonV259,row}};return cartoonSpriteV259(sk,target);}
async function exclusiveHitV260(a,s,power,{all=false,normal=false,crit=TEMP_BALANCE.critRate,element=s.element,row=null}={}){
 const b=state.battle,old=b.weaponAttackContext,oldElements=a.multiElementsV221,elements=String(element).split(/[・/]/);b.weaponAttackContext={normal,element,sure:crit===1};if(elements.length>1)a.multiElementsV221=elements;
 try{await exclusiveArtV260(s,all?'enemy-all':'enemy',row);if(state.battle!==b||b.finished)return 0;if(all)return await playerAoeDamage(a,power,s.damageType,crit);const e=targetEnemy();return e?applyEnemyDamageTo(a,e,power,s.damageType,crit,false)?.value||0:0;}finally{b.weaponAttackContext=old;if(oldElements===undefined)delete a.multiElementsV221;else a.multiElementsV221=oldElements;}
}
async function exclusivePartyV260(a,s,healRate,buffs,self=false){const targets=self?[a]:livingField();await Promise.all(targets.map(t=>exclusiveArtV260(s,t.id)));for(const t of targets){if(healRate)heal(t,t.maxHp*healRate);for(const [key,value]of buffs)uniqueBuffV260(t,key,value,2,s.id);}}
async function performExclusiveV260(a,s){
 const b=state.battle;if(!b||b.finished)return false;const error=exclusiveErrorV260(a,s);if(error){notice(error,'danger');return false;}
 let form=Number(s.formV260)||0;if(s.action==='stance'&&!form){const answer=await narrationDialog('モブテツの型',[['壱式：次ターンATK+50%・通常攻撃2回','1','primary'],['弐式：今ターン回避・次ターン全体会心','2'],['参式：今ターンかばう・次ターン反撃','3'],['戻る','cancel']]);if(answer==='cancel')return false;form=Number(answer);}
 if(s.action==='stance'&&![1,2,3].includes(form))return false;if(state.battle!==b||b.finished||exclusiveErrorV260(a,s))return false;
 a.mpNow-=exclusiveCostV260(a,s);a.soulPointsV220=figureSoulV218(a)-1;(a.exclusiveReadyV260??={})[s.id]=b.turn+3;updateSoulBadgesV220();
 await exclusiveCutinV260(a,s.action==='stance'?`モブテツの型 ${['','壱','弐','参'][form]}式！！`:s.name);
 const hit=(power,opts)=>exclusiveHitV260(a,s,power,opts),buff=(key,value,turns=2,start=b.turn)=>uniqueBuffV260(a,key,value,turns,s.id,start);
 switch(s.action){
 case'dendenWhip':await hit(1.6,{all:true,crit:Math.min(.35,livingEnemies().length*.07)});break;
 case'dendenCharge':a.dendenChargeV261={turn:b.turn,due:b.turn+1};await exclusiveArtV260(s,a.id);notice('雷をためている！ 次ターンに3連撃','buff',800);break;
 case'twin':for(let i=0;i<2&&livingEnemies().length;i++)await hit(.9,{normal:true});break;
 case'fate':await hit(Math.random()<.3?3.5:2.2);break;
 case'pinkHeal':await exclusivePartyV260(a,s,.18,[['damageCut',.05]]);break;
 case'kingHeal':await exclusivePartyV260(a,s,.32,[]);buff('damageCut',.05);break;
 case'double':buff('mag',.10);a.doubleMagicTurnV260=b.turn+1;await exclusiveArtV260(s,a.id);break;
 case'field':await exclusivePartyV260(a,s,0,[['res',.30]]);a.magicCritTurnV260=b.turn+1;break;
 case'nimo':await hit(1.4);buff('crit',.10,1,b.turn+1);break;
 case'force':await hit(1.6);heal(a,a.maxHp*.10);fx('heal',a.id);break;
 case'net':await hit(1.4,{all:true});for(const e of livingEnemies())applyEnemyStatusTo(e,'stun',.15,1);break;
 case'road':await exclusivePartyV260(a,s,0,[['atk',.25],['def',.25]]);break;
 case'bear':await exclusivePartyV260(a,s,0,[['damageCut',.07]]);break;
 case'launcher':await hit(1.6);if(livingEnemies().length)await hit(1.4,{all:true});break;
 case'blizzard':await hit(1.6,{all:true});buff('crit',.20);buff('spd',.50);break;
 case'organize':await exclusiveArtV260(s,'enemy-all');for(const e of livingEnemies())uniqueBuffV260(e,'damageCut',-.10,2,s.id);break;
 case'stance':a.stanceV260={form,turn:b.turn,due:b.turn+1,hits:0};await exclusiveArtV260(s,a.id,form-1);break;
 case'zero':await hit(1.6,{element:'風'});if(livingEnemies().length)await hit(1.6,{element:'地'});break;
 case'flicker':for(let i=0,n=rint(2,3);i<n&&livingEnemies().length;i++)await hit(1.4);break;
 case'thunder':await hit(2.2,{all:true});break;
 case'claw':await hit(1.6);buff('atk',.15);break;
 case'dominion':await hit(2.2,{all:true});buff('damageCut',.10);break;
 case'drain':await hit(1.6);heal(a,a.maxHp*.15);fx('heal',a.id);break;
 case'tempest':await hit(2.2,{all:true});for(const e of livingEnemies())uniqueBuffV260(e,'res',-.15,2,s.id);break;
 }
 renderBattle();return true;
}
const exclusiveActionV260=banditWrapActionV230(performExclusiveV260),specialBaseV260=performSpecial;
performSpecial=async function(a,s,...args){return s?.exclusiveV260?exclusiveActionV260(a,s):specialBaseV260(a,s,...args);};
const magicBaseV260=performMagic;
performMagic=async function(a,s=null,...args){const b=state.battle,chosen=s?.id?s:defaultMagicFor(a),result=await magicBaseV260(a,s,...args);if(result!==false&&b&&state.battle===b&&!b.finished&&!a.dead&&a.doubleMagicTurnV260===b.turn&&!a.repeatingMagicV260){a.repeatingMagicV260=true;try{await actionCutin('ダブルマニー','buff',400);await magicBaseV260(a,{...chosen,cost:0},...args);}finally{a.repeatingMagicV260=false;}}return result;};
const damageCalcBaseV260=calcDamage;
calcDamage=function(a,type,power,crit=0,...args){if(type==='magic'&&a.magicCritTurnV260===state.battle?.turn)crit+=.30;return damageCalcBaseV260(a,type,power,crit,...args);};
async function resolveTetsuStanceV260(a){const b=state.battle,stance=a.stanceV260;if(!stance||stance.due!==b.turn)return false;a.stanceV260=null;const s={...exclusiveByIdV260('exclusive-tetsu-form'),cartoonV259:{atlas:'exclusive-tetsu',row:stance.form-1,boost:1.18}};await exclusiveCutinV260(a,`モブテツの型 ${['','壱','弐','参'][stance.form]}式！！`);
 if(stance.form===1){uniqueBuffV260(a,'atk',.5,1,'tetsu-release260');for(let i=0;i<2&&livingEnemies().length;i++)await exclusiveHitV260(a,s,1,{normal:true,element:weaponCombatElement(a)});}
 if(stance.form===2)await exclusiveHitV260(a,s,1,{all:true,normal:true,crit:1,element:weaponCombatElement(a)});
 if(stance.form===3)for(let i=0;i<stance.hits&&livingEnemies().length;i++)await exclusiveHitV260(a,s,1,{normal:true,element:weaponCombatElement(a)});
 return true;
}
const queueBaseV260=processQueue;
processQueue=async function(...args){await queueBaseV260(...args);const b=state.battle,a=activeAlly();if(b&&!b.finished&&!b.busy&&a?.stanceV260?.due===b.turn)await act('stance260');};
const roundBaseV260=startRound;
startRound=async function(...args){for(const a of state.battle?.allies||[])if(a.stanceV260&&a.stanceV260.due<(state.battle?.turn||0))a.stanceV260=null;return roundBaseV260(...args);};
const allyDamageBaseV260=damageAlly;
damageAlly=async function(a,...args){const b=state.battle;if(!b)return allyDamageBaseV260(a,...args);const guard=livingField().find(t=>t.id==='tetsu'&&t.stanceV260?.form===3&&t.stanceV260.turn===b.turn);if(guard)a=guard;
 if(a?.stanceV260?.form===2&&a.stanceV260.turn===b.turn){await exclusiveArtV260({...exclusiveByIdV260('exclusive-tetsu-form'),cartoonV259:{atlas:'exclusive-tetsu',row:1}},a.id);floatNumber('MISS','miss',a.id);return 0;}
 const d=await allyDamageBaseV260(a,...args);if(guard&&d>0&&guard.stanceV260)guard.stanceV260.hits++;
 if(d>0&&a.id==='nyoro'&&!a.dead&&state.battle===b&&!b.finished&&!b.nyoroCounterV260&&livingEnemies().length&&passiveChance(.10)){b.nyoroCounterV260=true;try{await reactivePassiveBeat(a,'ニョロは空を飛ぶ！');await exclusiveHitV260(a,exclusiveByIdV260('exclusive-magma-net'),.9,{all:true,normal:true});}finally{b.nyoroCounterV260=false;}}
 return d;
};
PASSIVE_DESCRIPTIONS_V172.nyoro='攻撃を受けた時、10%の確率で敵全体に火属性物理・通常攻撃の90%で反撃。';
PASSIVE_EFFECTS_V175.nyoro='敵全体に火属性物理・通常攻撃の90%で反撃';
const skillsAvailableBaseV260=availableTechniqueSkillsV104;
availableTechniqueSkillsV104=function(a){return skillsAvailableBaseV260(a).filter(s=>!s.exclusiveV260||s.owner===a.id&&!a.helperV218);};
const exclusiveMenuBaseV260=openSkillMenu;
openSkillMenu=function(type){const result=exclusiveMenuBaseV260(type),a=activeAlly();if(type!=='special'||!a)return result;for(const btn of $$('[data-tech-id]',$('#skillMenuList'))){const s=exclusiveByIdV260(btn.dataset.techId);if(!s)continue;if(s.owner!==a.id||a.helperV218){btn.remove();continue;}const error=exclusiveErrorV260(a,s),cd=exclusiveRemainingV260(a,s);btn.classList.toggle('disabled',!!error);$('em',btn).textContent=cd?`次の使用可能まで${cd}ターン`:`MP ${exclusiveCostV260(a,s)} / ソウル1`;
 btn.onclick=async()=>{const why=exclusiveErrorV260(a,s);if(why)return notice(why,'danger');if(!await confirmBattleSkillUse('special',s,a))return;$('#skillMenu').hidden=true;await act('special',s);};}return result;};
const clearBaseV260=clearPlayerBuffsV142;
clearPlayerBuffsV142=function(a){const result=clearBaseV260(a);a.soulEffectsV218=(a.soulEffectsV218||[]).filter(e=>!e.sourceV260);a.doubleMagicTurnV260=a.magicCritTurnV260=0;return result;};
window.__mobBuildVersion='v260';
