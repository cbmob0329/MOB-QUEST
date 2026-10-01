// User-edited v249 boss workbook, 2026-10-02. Scope is the listed main-story encounter.
const BOSS_EDITS_V250={
 'boss-dragon':{world:'magma',area:3,damageReduction:.05},
 'boss-nepu':{world:'sea',area:3,actions:3,damageReduction:.05},
 'boss-debuff2':{world:'tribe',area:3,damageReduction:.05,evasion:.05},
 'boss-berserk2':{world:'tribe',area:3,damageReduction:.05,evasion:.05},
 'boss-umidenden':{world:'rural2',area:3,actions:3},
 'boss-neomaster':{world:'neon2',area:3,actions:3,evasion:.05},
 'boss-dragon2':{world:'magma2',area:3,damageReduction:.05},
 'boss-gidora':{world:'magma2',area:3,fixedHp:23333,damageReduction:.11},
 'boss-mira-d2':{world:'desert2',area:0,actions:2,damageReduction:.05,evasion:.05},
 'boss-mira2-d2':{world:'desert2',area:0,actions:2,damageReduction:.05,evasion:.05},
 'boss-dorafara':{world:'desert2',area:3,actions:3,damageReduction:.11},
 'boss-gladi':{world:'demonCastle',area:1,actions:3}
};
function bossEditFieldsV250(q){const fields={};if(q.fixedHp!=null){fields.fixedHp=q.fixedHp;fields.noGlobalBossHpV184=true;}if(q.damageReduction!=null){fields.damageReduction=q.damageReduction;fields.permanentDamageReduction=true;}if(q.evasion!=null)fields.evasion=q.evasion;if(q.actions!=null)Object.assign(fields,{forceActionCount:true,actionCount:q.actions,v144ActionMin:q.actions,v144ActionMax:q.actions});return fields;}
const bossEditBalanceBaseV250=balanceStoryWavesV244;
balanceStoryWavesV244=function(config){const result=bossEditBalanceBaseV250(config);if(result.mode!=='adventure'||!result.bossBattle)return result;const world=result.storyWorldId||result.worldId,area=Number(result.storyAreaIndex);return{...result,waves:result.waves?.map(w=>w.map(row=>{const q=BOSS_EDITS_V250[row.id];return q&&q.world===world&&q.area===area?{...row,...bossEditFieldsV250(q),bossEditV250:row.id}:row;}))};};
// Reapply authored values after older enemy-specific builders; other encounter variants are untouched.
const bossEditBuildBaseV250=buildEnemyFromTemplate;
buildEnemyFromTemplate=function(t,...args){const e=bossEditBuildBaseV250(t,...args),q=BOSS_EDITS_V250[t?.bossEditV250];if(e&&q)Object.assign(e,bossEditFieldsV250(q));return e;};
window.__mobBuildVersion='v250';
