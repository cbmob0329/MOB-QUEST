const assert=require('node:assert/strict'),fs=require('node:fs');
const {open}=require('C:/Users/CB-Me/Documents/GitHub/MOB-QUEST/tests/story-v172-harness.cjs');
const injection=`window.balanceQA263={
 data(){
  state.test.enabled=false;state.party=['yusha','pink','money','desert'].map(id=>[id,80]);
  const copy=x=>JSON.parse(JSON.stringify(x)),newPreview=enemyStatPreview;
  function pair(make){const random=Math.random;Math.random=()=>.5;try{const after=copy(make());enemyStatPreview=enemyRolePreviewBaseV263;return {before:copy(make()),after};}finally{enemyStatPreview=newPreview;Math.random=random;}}
  const catalog=trainingEnemyCatalog().map(t=>({id:t.id,name:t.name,role:enemyRoleV263(t),...pair(()=>buildEnemyWave([{id:t.id,level:t.levelMin||1}],4))}));
  const encounters=[];
  for(const [wi,w]of MOB_DATA.adventureWorlds.entries())for(const [ai,a]of w.areas.entries()){
   state.adventure.worldIndex=wi;state.adventure.areaIndex=ai;state.adventure.battleIndex=2;
   const enc=createAdventureEncounter(),cfg=balanceStoryWavesV244({mode:'adventure',bossBattle:true,storyWorldId:w.id,storyAreaIndex:ai,waves:enc.waves});
   encounters.push({world:w.id,worldName:w.name,area:ai,...pair(()=>cfg.waves.map(wave=>buildEnemyWave(wave,4)))});
  }
  const rematch=pair(()=>buildEnemyWave(fourRematchWaveV245(),4));
  const fixed=pair(()=>buildEnemyWave([{id:'d2-miraearth',level:75,fixedHp:12345}],4));
  const scaleTests=[];
  for(const id of Object.keys(ENEMY_ROLES_V263))for(const lv of [1,75,120]){
   const t=trainingEnemyTemplate(id),p=pair(()=>enemyStatPreview(t,lv,4,4));
   scaleTests.push({id,lv,...p});
  }
  return {build:window.__mobBuildVersion,profiles:ENEMY_ROLES_V263,aliases:ENEMY_ROLE_ALIASES_V263,catalog,encounters,rematch,fixed,scaleTests};
 },
 async rematchActions(){
  startRound=processQueue=async()=>{};
  await beginBattle({mode:'training',party:state.party,enemyConfigs:fourRematchWaveV245()});
  const log=[],original=bossSpecial;bossSpecial=async spec=>log.push({enemy:actingEnemy().id,...spec});
  try{for(const e of state.battle.enemies){await enemyAction(1,e.uid);await enemyAction(2,e.uid);}}
  finally{bossSpecial=original;}
  return log;
 }
};`;
(async()=>{
 const x=await open(injection);
 try{
  const d=await x.page.evaluate(()=>balanceQA263.data());assert.equal(d.build,'v263');
  let changed=0;
  const statKeys=['maxHp','atk','mag','def','res','spd'];
  function invariant(a,b){
   const normalize=e=>Object.fromEntries(Object.entries(e).filter(([k])=>!['uid','hp',...statKeys].includes(k)));
   assert.deepEqual(normalize(a),normalize(b),a.id+' non-stat settings changed');
   for(const k of statKeys)assert(Number.isFinite(b[k])&&b[k]>0,a.id+' '+k);
  }
  for(const c of d.catalog){
   invariant(c.before[0],c.after[0]);
   const diff=statKeys.some(k=>c.before[0][k]!==c.after[0][k]);
   if(c.role){assert(diff,c.id);changed++;}
   else assert(!diff,c.id+' outside adjustment scope');
  }
  assert.equal(changed,31); // 27 base profiles + 4 awakened sisters; rematch uses aliases.
  for(const e of d.encounters)for(let w=0;w<e.before.length;w++)for(let n=0;n<e.before[w].length;n++)invariant(e.before[w][n],e.after[w][n]);
  for(const r of d.scaleTests)for(const k of statKeys)assert.equal(r.after[k],Math.max(1,Math.round(r.before[k]*d.profiles[r.id][k])),r.id+' '+r.lv+' '+k);
  assert.equal(d.fixed.before[0].maxHp,d.fixed.after[0].maxHp,'fixed HP must be preserved');
  const four=d.rematch.after;
  assert.equal(four.length,4);assert.equal(new Set(four.map(e=>statKeys.map(k=>e[k]).join(','))).size,4);
  const sum=(arr,k)=>arr.reduce((s,e)=>s+e[k],0);
  assert(Math.abs(sum(four,'maxHp')/sum(d.rematch.before,'maxHp')-1)<.002,'four total HP budget');
  for(let i=0;i<4;i++){
   invariant(d.rematch.before[i],four[i]);
   assert.equal(four[i].actionCount,2);assert.equal(four[i].damageReduction,.12);assert.equal(four[i].evasion,.10);assert.equal(four[i].critChanceV245,.14);
  }
  const byId=Object.fromEntries(four.map(e=>[e.id,e]));
  assert(byId['four245-earth'].def>byId['four245-time'].def);
  assert(byId['four245-fire'].mag>byId['four245-earth'].mag);
  assert(byId['four245-time'].spd>byId['four245-earth'].spd);
  const actionLog=await x.page.evaluate(()=>balanceQA263.rematchActions());
  assert.equal(actionLog.length,8);
  for(let i=0;i<8;i+=2){assert(actionLog[i].kind.startsWith('aoe'));assert(!actionLog[i+1].kind.startsWith('aoe'));}
  assert.deepEqual(x.errors,[]);
  fs.writeFileSync('D:/GitHub/MOB-QUEST/artifacts/balance-v263/results.json',JSON.stringify({...d,actionLog},null,2));
  console.log(JSON.stringify({pass:true,catalogChecked:d.catalog.length,changed,rematchVariants:4,storyAreas:d.encounters.length,levelChecks:d.scaleTests.length,rematchActions:actionLog.length}));
 }finally{await x.browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
