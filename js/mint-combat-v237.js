function mintWaterSpellV237(){return pick(['nepu','nepuma','nepumachun'].map(id=>MOB_DATA.magicCatalog.find(s=>s.id===id)));}
async function mintEnemyHitV237(e,power,all=false,type='magic',debuff=false,spell=null){
 const b=state.battle,oldCrit=enemyCriticalV163,oldAoe=enemyAoeV163,targets=all?livingField():[pick(livingMain().length?livingMain():livingField())].filter(Boolean);let total=0;
 try{enemyAoeV163=all;await beginEnemyLunge(e.uid);for(const a of targets){if(spell)await skillSprite(spell.frames,a.id,spell.mode);enemyCriticalV163=e.mintV237!=='kiba'&&Math.random()<.10;const n=await damageAlly(a,power*(e.mintV237==='ris'&&type==='magic'?1.11:1),type,isSuper(a),e.attribute);total+=n;if(n>0&&debuff){a.atkDebuff=Math.max(a.atkDebuff||0,.20);a.atkDebuffTurns=Math.max(a.atkDebuffTurns||0,rint(2,3));notice(`${a.name} ATK -20%`,'status',550);}}}finally{enemyCriticalV163=oldCrit;enemyAoeV163=oldAoe;endEnemyLunge();}return total;
}
const mintEnemyActionBaseV237=enemyAction;
enemyAction=async function(index=1,uid){const b=state.battle,e=enemyByUid(uid)||actingEnemy()||b?.enemy;if(!e?.mintV237)return mintEnemyActionBaseV237(index,uid);if(!b||b.finished||e.hp<=0||statusStopsActionV235(e))return;if(e.status.confuse>0)return confusedActionV235(e,true);const previous=b.actingEnemyId,oldEnemy=b.enemy;b.actingEnemyId=e.uid;b.enemy=e;
 try{if(e.mintV237==='kiba'){const type=index===1?'physical':'magic',all=Math.random()<.40;await actionCutin(type==='magic'?'地属性の魔法！':'地属性の特技！','danger',500);await mintEnemyHitV237(e,1,all,type);return;}
  const ultimate=index===1,all=index===2,spell=ultimate?null:mintWaterSpellV237();await actionCutin(ultimate?'ミント・テンゲン':spell.name,'danger',600);const layer=mintFxV237($('#enemyArea'));try{await fixedDelay(280);await mintEnemyHitV237(e,ultimate?1.3:spell.power,all,'magic',ultimate,spell);}finally{layer.remove();}
  if(!b.finished&&e.hp>0&&livingField().length&&Math.random()<.50){if(!b.mintGameSpokenV237){b.mintGameSpokenV237=true;await enemyStoryCutin(e,'守りは慎重に！攻めは積極的に！');}const follow=mintWaterSpellV237();await reactionV177(e,'ミントゲーム',follow.name+'で追撃！');await mintEnemyHitV237(e,follow.power,false,'magic',false,follow);}
 }finally{b.actingEnemyId=previous;b.enemy=oldEnemy;renderBattle();}
};
const mintCritBaseV237=calcDamage;
calcDamage=function(a,type,power,crit=0,e=targetEnemy()){const result=mintCritBaseV237(a,type,power,crit,e);if(e?.mintV237&&e.mintV237!=='kiba'&&result?.crit&&Math.random()<.80){result.value=Math.max(1,Math.round(result.value/TEMP_BALANCE.critPower));result.crit=false;}return result;};
const mintParseBaseV237=parseFigureEffectText;
parseFigureEffectText=function(text){const source=String(text||'').normalize('NFKC'),chance=+(source.match(/魔法追撃率\s*\+\s*(\d+(?:\.\d+)?)%/)?.[1]||0)/100;return{...mintParseBaseV237(source.replace(/魔法追撃率\s*\+\s*\d+(?:\.\d+)?%/g,'')),mintMagicFollowV237:chance};};
const mintMergeBaseV237=mergeFigureEffects;
mergeFigureEffects=function(a,b){const chance=(a.mintMagicFollowV237||0)+(b?.mintMagicFollowV237||0);return Object.assign(mintMergeBaseV237(a,b),{mintMagicFollowV237:chance});};
const mintEffectMarkupBaseV237=figureEffectStatusMarkup;
figureEffectStatusMarkup=function(pid){const chance=figureEffectsFor(pid).mintMagicFollowV237;return mintEffectMarkupBaseV237(pid)+(chance?`<section class="figure-extra-effects-v163"><span>魔法追撃率<b>+${figurePercentText(chance)}</b></span></section>`:'');};
const mintSoulBaseV237=applySoulTextV218;
applySoulTextV218=async function(f,a,own,enemies,text,piece=false){if(!piece&&['eventfig/61.png','eventfig/62.png'].includes(f.image)){for(const target of f.image==='eventfig/61.png'?[a]:own.filter(t=>t.hp>0&&!t.dead))target.mintGuaranteedTurnV237=state.battle.turn;notice('ミントマジック / このターン魔法追撃確定','buff',700);renderBattle();return 0;}return mintSoulBaseV237(f,a,own,enemies,text,piece);};
const mintMagicBaseV237=performMagic;
let mintRepeatingV237=false;
performMagic=async function(a,skill=null,...args){
 const b=state.battle,chosen=skill?.id?skill:defaultMagicFor(a),result=await mintMagicBaseV237(a,skill,...args);
 if(result===false||!chosen||!b||state.battle!==b||b.finished||a.dead||a.hp<=0||mintRepeatingV237||!livingEnemies().length)return result;
 const effects=a.figureEffects||figureEffectsFor(a.id),chance=1-(1-clamp(effects.mintMagicFollowV237||0,0,1))*(1-combinedTraitChance(a,'mintRepeatV237')),guaranteed=a.mintGuaranteedTurnV237===b.turn;
 if(!guaranteed&&!(chance>0&&Math.random()<chance))return result;
 mintRepeatingV237=true;const previousDouble=doubleMagicV221,mp=a.mpNow;doubleMagicV221=true;
 try{await actionCutin('ミントマジック / 追撃魔法！','buff',600);if(state.battle===b&&!b.finished&&!a.dead&&livingEnemies().length)await mintMagicBaseV237(a,{...chosen,cost:0},...args);}finally{a.mpNow=mp;doubleMagicV221=previousDouble;mintRepeatingV237=false;renderBattle();}
 return result;
};
