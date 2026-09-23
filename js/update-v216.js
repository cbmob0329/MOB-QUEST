// UPDATE_V216_BEGIN
/* Resolve the current start handler at click time, after story patches load. */
$('#fieldBattleBtn').onclick=()=>startAdventureBattle();

function bookTransformLockedV216(a,u){
  return a?.id==='yusha'&&!!a.transformed&&(u?.kind==='heroTransform'||u?.name==='読みかけの本');
}
const readyUltsBaseV216=readyUlts;
readyUlts=function(a){return readyUltsBaseV216(a).filter(u=>!bookTransformLockedV216(a,u));};
const performUltimateBaseV216=performUltimate;
performUltimate=async function(a,u,...args){
  if(bookTransformLockedV216(a,u)){notice('変身中は「読みかけの本」を使用できません','system',900);return false;}
  return performUltimateBaseV216(a,u,...args);
};
const openSkillMenuBaseV216=openSkillMenu;
openSkillMenu=function(type){
  const result=openSkillMenuBaseV216(type),a=activeAlly();
  if(type==='ultimate'&&a)for(const button of $$('[data-ult-index]',$('#skillMenuList'))){
    if(!bookTransformLockedV216(a,a.ults[Number(button.dataset.ultIndex)]))continue;
    button.disabled=true;button.classList.add('disabled');button.onclick=null;
    const label=$('em',button);if(label)label.textContent='変身中 / 使用不可';
  }
  return result;
};
function resetBookTransformV216(b){
  for(const a of b?.allies||[]){
    if(a.id!=='yusha')continue;
    if(a.transformed){a.allBuff=0;a.allBuffTurns=0;}
    a.transformed=false;
    for(const key of ['heroTransformUltBoost','bookHeroDamageCut','bookHeroDamageBoost','bookHeroStatusImmune','bookHeroNormalAoe','bookHeroAllAoe','bookHeroCrit100'])delete a[key];
  }
}
const finishBattleBaseV216=finishBattle;
finishBattle=function(...args){resetBookTransformV216(state.battle);return finishBattleBaseV216(...args);};
const finishScriptedBattleBaseV216=finishScriptedBattle;
finishScriptedBattle=function(...args){resetBookTransformV216(state.battle);return finishScriptedBattleBaseV216(...args);};
const battleBackBaseV216=$('#battleBackBtn').onclick;
$('#battleBackBtn').onclick=async function(...args){
  const b=state.battle,result=await battleBackBaseV216?.apply(this,args);
  if(b&&(b.finished||state.battle!==b||!$('#battleScreen').classList.contains('active')))resetBookTransformV216(b);
  return result;
};
window.__mobBuildVersion='v216';
// UPDATE_V216_END
