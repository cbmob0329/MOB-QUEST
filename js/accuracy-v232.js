// Accuracy's saved keys remain readable; all effects now modify the target's evade.
function opponentEvadeCutV232(a){
 const fe=a?.figureEffects||figureEffectsFor(a?.id),gun=String(a?.weapon||player(a?.id)?.weapon||'').includes('銃');
 return Number(fe?.accuracy||0)+Number(fe?.enemyEvadeDownV227||0)+weaponTraitSum(a,'accuracy')+(gun?Number(fe?.gunAccuracy||0):0)+soulEffectValueV218(a||{},'accuracy')-(a?.accuracyDownTurnsV218>0?Number(a.accuracyDownV218||0):0);
}
playerAttackHitChance=function(a,e){
 if(state.battle?.weaponAttackContext?.sure)return 1;
 const evade=clamp(Number(e?.evasion||0)+soulEffectValueV218(e||{},'evade'),0,.8);
 return 1-clamp(evade-opponentEvadeCutV232(a),0,1);
};
function incomingEvadeV232(a){
 const fe=a?.figureEffects||figureEffectsFor(a?.id),base=clamp(weaponEvasion(a)+Number(fe?.evade||0),0,.65),e=actingEnemy();
 return clamp(base-soulEffectValueV218(e||{},'accuracy'),0,1);
}
const oldAccuracyTextV232=new Map();
function accuracyTextV232(value){
 if(typeof value!=='string'||!value.includes('命中'))return value;
 let text=value.replace(/命中率\s*[+＋]\s*(\d+(?:\.\d+)?)%/g,'相手の回避率-$1%');
 text=text.replace('自分のSPDと命中率を2ターンの間25%アップし、回避率を10%アップする','自分のSPDを2ターンの間25%アップし、攻撃時の相手の回避率を25%下げ、回避率を10%アップする');
 text=text.replace('自分のSPD・命中率・回避率を2ターンの間15%アップする','自分のSPD・回避率を2ターンの間15%アップし、攻撃時の相手の回避率を15%下げる');
 text=text.replace('敵単体の命中率を15%ダウンさせる','敵単体の攻撃時、こちらの回避率を15%上げる');
 text=text.replace(/命中率を(\d+)%アップする/g,'攻撃時の相手の回避率を$1%下げる');
 text=text.replace(/命中率を(\d+)%ダウンさせる/g,'攻撃時の相手の回避率を$1%上げる');
 text=text.replaceAll('銃装備時命中率','銃装備時の相手回避率低下量').replaceAll('命中率','相手回避率低下量');
 oldAccuracyTextV232.set(text,value);return text;
}
function legacyAccuracyTextV232(text){return oldAccuracyTextV232.get(text)||String(text).replace(/相手の回避率\s*-\s*(\d+(?:\.\d+)?)%/g,'命中率+$1%').replaceAll('相手回避率低下量','命中率');}
const parseAccuracyBaseV232=parseFigureEffectText;
parseFigureEffectText=text=>parseAccuracyBaseV232(legacyAccuracyTextV232(text));
const soulAccuracyBaseV232=applySoulTextV218;
applySoulTextV218=(f,a,own,enemies,text,...args)=>soulAccuracyBaseV232(f,a,own,enemies,legacyAccuracyTextV232(text),...args);
function rewriteAccuracyDataV232(data){if(!data||typeof data!=='object')return;for(const key of Object.keys(data)){const value=data[key];if(typeof value==='string')data[key]=accuracyTextV232(value);else if(value&&typeof value==='object')rewriteAccuracyDataV232(value);}}
for(const data of [FIGURES,FIGURE_TAGS,CATALOG_V218,ADJACENCY_TAGS_V174,WEAPONS,MOB_DATA.magicCatalog,MOB_DATA.techniqueCatalog])rewriteAccuracyDataV232(data);
const figureStatusBaseV232=figureEffectStatusMarkup;
figureEffectStatusMarkup=pid=>accuracyTextV232(figureStatusBaseV232(pid));
const equipmentStatusBaseV232=equipmentDetailMarkup;
equipmentDetailMarkup=function(pid){const a={...player(pid),id:pid,equipment:equipmentFor(pid),figureEffects:figureEffectsFor(pid)},cut=opponentEvadeCutV232(a);return accuracyTextV232(equipmentStatusBaseV232(pid)).replace(/基本命中 100% \/ 補正 [+-]?\d+(?:\.\d+)?%/,`攻撃時の相手回避率 ${cut>=0?'-':'+'}${figurePercentText(Math.abs(cut))}`);};
window.__mobBuildVersion='v232';
