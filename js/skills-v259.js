// Sprite atlases are clipped to inspected frame rectangles, never shown as whole sheets.
async function cartoonSpriteV259(skill,target){
 const spec=skill.cartoonV259,atlas=SKILL_ATLASES_V259[spec.atlas],b=state.battle;
 await loadAtlasV251(atlas);if(!b||state.battle!==b)return;
 const group=target==='enemy-all',el=fxNodeV251(target,'cartoon-skill-v259 '+(group?'group ':''),skill.element);if(!el)return;
 el.dataset.skill=skill.id;el.dataset.target=target;el.style.backgroundImage=`url("${atlas.src}")`;
 const size=(spec.atlas==='fire'?180:155)*(spec.boost||1);el.style.width=group?'min(92%, 480px)':`clamp(120px,${size/4}vw,${size}px)`;el.style.height=`clamp(120px,${size/4}vw,${size}px)`;
 battleSeV257('skill',{attribute:skill.element,strength:spec.boost>1?'large':'small'});
 try{for(let i=0;i<4;i++){if(state.battle!==b||b.finished)break;atlasFrameStyleV251(el,atlas,spec.row,i);el.dataset.frame=String(i+1);el.style.setProperty('--cartoon-scale',String([.86,1.04,1,.92][i]));await delay([90,105,125,90][i]);}}
 finally{el.remove();}
}
const spriteBaseV259=skillSprite;
skillSprite=async function(frames,target='enemy',mode='default'){
 const id=String(mode).startsWith('cartoon259:')?String(mode).slice(11):enemyFxContextV251?.skill?.cartoonV259?enemyFxContextV251.skill.id:null;
 const skill=id?[...MOB_DATA.magicCatalog,...MOB_DATA.techniqueCatalog].find(s=>s.id===id):null;
 if(!skill?.cartoonV259)return spriteBaseV259(frames,target,mode);
 if(enemyFxContextV251)enemyFxContextV251.played.add(String(target));
 return cartoonSpriteV259(skill,target);
};
// Wrap the common advanced-technique entry so existing repeat attacks, equipment and figures still run.
const advancedTechniqueBaseV259=performAdvancedTechniqueV120;
performAdvancedTechniqueV120=async function(a,t){
 if(!t.selfBuffV259)return advancedTechniqueBaseV259(a,t);
 const b=state.battle;if(!b||b.finished||!targetEnemy())return false;
 const result=await advancedTechniqueBaseV259(a,t);
 if(result===false||state.battle!==b||a.dead||a.hp<=0)return result;
 const buff=t.selfBuffV259,tag='food259:'+buff.family,bonus=Number((a.figureEffects||figureEffectsFor(a.id)).buffEffectV230||0),value=buff.value*(1+bonus);
 // Recasting refreshes this family; it never accumulates with itself or its upper version.
 const previous=(a.soulEffectsV218||[]).find(e=>e.sourceV259===tag&&e.until>b.turn);
 a.soulEffectsV218=(a.soulEffectsV218||[]).filter(e=>e.sourceV259!==tag);
 a.soulEffectsV218.push({key:buff.key,value:Math.max(value,previous?.value||0),until:b.turn+buff.turns,sourceV259:tag});
 supportMagicFxV109(buff.key,a.id);battleSeV257('buff');
 await atlasSequenceV251(FX_ATLASES_V251.recovery,1,a.id,'recovery buff','光',true);
 notice(`${a.name} ${buff.label}+${Math.round(Math.max(value,previous?.value||0)*100)}% / 2ターン`,'system',750);renderBattle();return result;
};
const clearBuffsBaseV259=clearPlayerBuffsV142;
clearPlayerBuffsV142=function(a){const r=clearBuffsBaseV259(a);a.soulEffectsV218=(a.soulEffectsV218||[]).filter(e=>!e.sourceV259);return r;};
const effectSummaryBaseV259=battleEffectSummary;
battleEffectSummary=function(kind,item){return kind==='special'&&item?.effectText?item.effectText:effectSummaryBaseV259(kind,item);};
// Refresh skill descriptions in the menu using the actual effect text.
const skillMenuBaseV259=openSkillMenu;
openSkillMenu=function(type){const r=skillMenuBaseV259(type);if(type==='special'){const list=$('#skillMenuList');for(const btn of $$('[data-tech-id]',list)){const t=MOB_DATA.techniqueCatalog.find(s=>s.id===btn.dataset.techId);if(t?.effectText&&$('small',btn))$('small',btn).textContent=t.effectText;}}return r;};
window.__mobBuildVersion='v259';
