async function resolveDendenV261(a){
 const b=state.battle,charge=a.dendenChargeV261;if(!b||!charge||charge.due!==b.turn||a.dead||a.hp<=0)return false;
 a.dendenChargeV261=null;const s=exclusiveByIdV260('exclusive-denden-storm');
 for(const [name,type,power,all]of [['デンデン','physical',1.3,true],['ゴロゴロ','magic',1.3,true],['ドッカーン!!','physical',1.9,false]]){
  if(state.battle!==b||b.finished||a.dead||a.hp<=0||!livingEnemies().length)break;
  await exclusiveCutinV260(a,name);await exclusiveHitV260(a,{...s,damageType:type},power,{all});
 }
 renderBattle();return true;
}
const dendenQueueBaseV261=processQueue;
processQueue=async function(...args){await dendenQueueBaseV261(...args);const b=state.battle,a=activeAlly();if(b&&!b.finished&&!b.busy&&a?.dendenChargeV261?.due===b.turn)await act('denden261');};
const dendenRoundBaseV261=startRound;
startRound=async function(...args){for(const a of state.battle?.allies||[])if(a.dendenChargeV261&&(a.dead||a.hp<=0||a.dendenChargeV261.due<state.battle.turn))a.dendenChargeV261=null;return dendenRoundBaseV261(...args);};
const dendenEvadeBaseV261=incomingEvadeV232;
incomingEvadeV232=a=>a?.dendenChargeV261?.turn===state.battle?.turn?0:dendenEvadeBaseV261(a);
const dendenDamageBaseV261=calcEnemyDamage;
calcEnemyDamage=function(a,...args){const damage=dendenDamageBaseV261(a,...args);return a?.dendenChargeV261?.turn===state.battle?.turn?Math.round(damage*1.1):damage;};
// Keep existing callbacks, confirmation dialogs and support-target selection intact.
let magicCategoryV261='attack';
const menuBaseV261=openSkillMenu;
openSkillMenu=function(type){
 document.querySelector('#skillFiltersV261')?.remove();
 const result=menuBaseV261(type),menu=$('#skillMenu'),list=$('#skillMenuList');
 menu.classList.toggle('skill-menu-v261',['magic','special'].includes(type));
 if(!['magic','special'].includes(type))return result;
 for(const btn of $$('[data-magic-id],[data-tech-id]',list)){
  const s=(type==='magic'?MOB_DATA.magicCatalog:MOB_DATA.techniqueCatalog).find(s=>s.id===(btn.dataset.magicId||btn.dataset.techId));if(!s)continue;
  btn.dataset.categoryV261=s.support?'support':'attack';btn.dataset.exclusiveV261=String(!!s.exclusiveV260);
  btn.style.setProperty('--skill-color',({'火':'#ff9677','水':'#72d8ff','風':'#98e9b4','雷':'#ffe27b','地':'#eac090','光':'#fff0b0','闇':'#d7a9ff'})[s.element]||'#bad6ff');
  const symbol=$('.skill-symbol',btn);if(symbol)symbol.textContent=s.support?'補':s.element||'技';
 }
 if(type==='magic'){
  const filters=document.createElement('div');filters.id='skillFiltersV261';filters.className='skill-filters-v261';filters.setAttribute('role','group');filters.setAttribute('aria-label','魔法の分類');
  filters.innerHTML='<button type="button" data-category="attack">攻撃魔法</button><button type="button" data-category="support">補助魔法</button><p class="skill-empty-v261" hidden>この分類の魔法はまだ習得していません。</p>';
  list.before(filters);
  const update=()=>{let count=0;for(const btn of $$('[data-magic-id]',list)){btn.hidden=btn.dataset.categoryV261!==magicCategoryV261;if(!btn.hidden)count++;}for(const btn of $$('[data-category]',filters)){const selected=btn.dataset.category===magicCategoryV261;btn.setAttribute('aria-pressed',String(selected));const n=$$('[data-magic-id]',list).filter(b=>b.dataset.categoryV261===btn.dataset.category).length;btn.textContent=(btn.dataset.category==='attack'?'攻撃魔法':'補助魔法')+' ('+n+')';}$('.skill-empty-v261',filters).hidden=count>0;list.scrollTop=0;};
  for(const btn of $$('[data-category]',filters))btn.onclick=()=>{magicCategoryV261=btn.dataset.category;update();};update();
 }
 return result;
};
const supportTargetBaseV261=renderSupportTargetMenuV109;
renderSupportTargetMenuV109=function(...args){$('#skillFiltersV261')?.remove();return supportTargetBaseV261(...args);};
window.__mobBuildVersion='v261';
const switchMenuBaseV261=openSwitchMenu;
openSwitchMenu=function(...args){$('#skillFiltersV261')?.remove();$('#skillMenu').classList.remove('skill-menu-v261');return switchMenuBaseV261(...args);};
