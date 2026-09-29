const assert=require('node:assert/strict'),{open}=require('./story-v172-harness.cjs');
(async()=>{
 const x=await open(`
 const realRound244=startRound;
 window.balanceTest={
  async setup(world,area){
   state.test.enabled=false;state.autoBattle=false;state.party=['yusha','pink','desert','jessie'].map(id=>[id,72]);
   state.adventure.worldIndex=MOB_DATA.adventureWorlds.findIndex(w=>w.id===world);state.adventure.areaIndex=area;state.adventure.battleIndex=2;
   state.meta.seenMemosV236=Object.fromEntries(MEMOS_V236.map(m=>[m.id,true]));fixedDelay=delay=async()=>{};
   startRound=processQueue=async()=>{};allyStoryCutin=enemyStoryCutin=actionCutin=sceneFxV231=flameAbsorbV231=async()=>{};
   const enc=createAdventureEncounter(),config={mode:'adventure',bossBattle:true,storyWorldId:world,storyAreaIndex:area,waves:enc.waves,party:state.party,bg:currentArea().bg};
   const baseline=enc.waves.map(rows=>buildEnemyWave(rows,4).map(e=>({id:e.id,hp:e.maxHp,atk:e.atk,mag:e.mag,def:e.def,res:e.res})));
   const once=balanceStoryWavesV244(config),twice=balanceStoryWavesV244(once);await beginBattle(config);return {baseline,once:once.waves,twice:twice.waves,training:balanceStoryWavesV244({...config,mode:'training'}).waves};
  },snapshot(){const b=state.battle;return b.enemies.map(e=>({id:e.id,hp:e.maxHp,current:e.hp,atk:e.atk,mag:e.mag,def:e.def,res:e.res,actions:e.actionCount,revived:!!e.revivedFourV231}));},
  async advance(){for(const e of state.battle.enemies){e.hp=0;recordEnemyDefeat(e);}await handleEnemyWaveClear();},
  async queues(){const result=[];checkBattleHpDialogue=applyRoundDots=resolveRequiredReplacements=async()=>{};for(let i=0;i<12;i++){await realRound244();result.push(state.battle.enemies.map(e=>({id:e.id,count:state.battle.queue.filter(q=>q.enemyId===e.uid).length})));state.battle.turn++;}return result;}
 };`);
 try{
  const {page}=x;
  const magma=await page.evaluate(()=>balanceTest.setup('magma2',3));assert.deepEqual(magma.once,magma.twice);assert.ok(magma.training.flat().every(r=>!r.storyBossBalanceV244));
  await page.evaluate(()=>balanceTest.advance());const gidora=(await page.evaluate(()=>balanceTest.snapshot()))[0],old=magma.baseline[1][0];
  assert.equal(gidora.id,'boss-gidora');assert.ok(Math.abs(gidora.hp/old.hp-1.3)<.001);assert.ok(Math.abs(gidora.mag/old.mag-1.15)<.005);assert.equal(gidora.actions,3);
  assert.ok((await page.evaluate(()=>balanceTest.queues())).flat().every(e=>e.count===3));
  const desert=await page.evaluate(()=>balanceTest.setup('desert2',2));assert.deepEqual(desert.once,desert.twice);
  const first=await page.evaluate(()=>balanceTest.snapshot());for(const e of first){const base=desert.baseline[0].find(b=>b.id===e.id);assert.ok(Math.abs(e.hp/base.hp-1.35)<.001);assert.ok(Math.abs(e.atk/base.atk-1.15)<.005);assert.equal(e.actions,2);}
  assert.ok((await page.evaluate(()=>balanceTest.queues())).flat().every(e=>e.count===2));
  await page.evaluate(()=>balanceTest.advance());assert.ok((await page.evaluate(()=>balanceTest.queues())).flat().every(e=>e.count===2));
  await page.evaluate(()=>balanceTest.advance());const revived=await page.evaluate(()=>balanceTest.snapshot());assert.equal(revived.length,4);assert.ok(revived.every(e=>Math.abs(e.current/e.hp-.3)<.001&&e.revived));
  assert.ok((await page.evaluate(()=>balanceTest.queues())).flat().every(e=>e.count>=1&&e.count<=2));
  assert.deepEqual(x.errors,[]);console.log(JSON.stringify({gidoraBefore:old,gidoraAfter:gidora,fourBefore:desert.baseline[0],fourAfter:first},null,2));console.log('PASS story-only/idempotent tuning, actual 12-round action queues per phase, HP30% revival.');
 }finally{await x.browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
