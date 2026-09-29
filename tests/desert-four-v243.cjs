const assert=require('node:assert/strict'),{open}=require('./story-v172-harness.cjs');
(async()=>{
 const x=await open(`
 window.fourTest={
  async setup(stale=false){
   state.test.enabled=false;state.autoBattle=false;state.party=['yusha','pink','money','desert'].map(id=>[id,72]);
   state.adventure.worldIndex=MOB_DATA.adventureWorlds.findIndex(w=>w.id==='desert2');state.adventure.areaIndex=2;state.adventure.battleIndex=2;
   state.meta.seenMemosV236=Object.fromEntries(MEMOS_V236.map(m=>[m.id,true]));
   window.lines=[];fixedDelay=delay=async()=>{};startRound=()=>{};sceneFxV231=storyDarkBattlePulse=async()=>{};
   allyStoryCutin=async(id,text)=>lines.push([id,text]);enemyStoryCutin=async(e,text)=>lines.push([e.id,text]);actionCutin=async text=>lines.push(['narration',text]);
   const enc=createAdventureEncounter();const raw=structuredClone(enc);
   if(stale)for(const wave of enc.waves)for(const row of wave)delete row.startingHpRate;
   await beginBattle({mode:'adventure',waves:enc.waves,party:state.party,bg:currentArea().bg,bossBattle:true,storyWorldId:'desert2',storyAreaIndex:2});
   return raw;
  },snapshot(){const b=state.battle;return {enemies:b.enemies.map(e=>({id:e.id,hp:e.hp,maxHp:e.maxHp,atk:e.atk,def:e.def,cut:e.damageReduction||0,revived:!!e.revivedFourV231,actions:e.actionCount})),pending:b.pendingWaveConfigs.length,allies:b.allies.map(a=>({id:a.id,hp:a.hp,maxHp:a.maxHp})),lines:[...lines]};},
  async half(){for(const e of state.battle.enemies)e.hp=Math.floor(e.maxHp*.49);await checkBattleHpDialogue();},
  async winWave(){for(const e of state.battle.enemies){e.hp=0;recordEnemyDefeat(e);}return handleEnemyWaveClear();},
  async doubleWin(){for(const e of state.battle.enemies){e.hp=0;recordEnemyDefeat(e);}await Promise.all([spawnNextEnemyWave(),spawnNextEnemyWave()]);},
  injure(){for(const a of state.battle.allies)a.hp=Math.floor(a.maxHp*.4);},
  async final(){window.finishCount=0;finishBattle=()=>finishCount++;await this.winWave();return finishCount;}
 };`);
 try{
  const {page}=x;
  for(const stale of [false,true]){
   const enc=await page.evaluate(stale=>fourTest.setup(stale),stale);assert.deepEqual(enc.waves.map(w=>w.length),[2,2,4]);assert.ok(enc.waves[2].every(r=>r.startingHpRate===.3));
   const first=await page.evaluate(()=>fourTest.snapshot());assert.equal(first.pending,2);
   await page.evaluate(()=>fourTest.half());const half=await page.evaluate(()=>fourTest.snapshot());
   for(const e of half.enemies){const old=first.enemies.find(x=>x.id===e.id);assert.equal(e.atk,Math.round(old.atk*1.2));assert.ok(Math.abs(e.cut-old.cut-.15)<.001);}
   await page.evaluate(()=>fourTest.half());assert.equal((await page.evaluate(()=>fourTest.snapshot())).lines.filter(l=>l[1].includes('燃えてきたぜ')).length,1);
   await page.evaluate(()=>fourTest.doubleWin());const second=await page.evaluate(()=>fourTest.snapshot());assert.equal(second.pending,1);assert.deepEqual(second.enemies.map(e=>e.id).sort(),['d2-miranight','d2-miratime']);
   for(const text of ['くそ・・俺がやられるとはな・・','貴様ら如きにこの私が!!','中々やるじゃないか','遊びすぎなんですよあの二人は','そうですね\nあっという間に終わらせましょう'])assert.ok(second.lines.some(l=>l[1]===text),text);
   await page.evaluate(()=>fourTest.injure());const injured=await page.evaluate(()=>fourTest.snapshot());
   await page.evaluate(()=>fourTest.doubleWin());const revived=await page.evaluate(()=>fourTest.snapshot());assert.equal(revived.pending,0);assert.equal(revived.enemies.length,4);
   for(const e of revived.enemies){assert.ok(Math.abs(e.hp/e.maxHp-.3)<.001,JSON.stringify(e));assert.ok(e.revived&&e.actions>=1&&e.actions<=2);}
   for(const a of revived.allies){const prev=injured.allies.find(p=>p.id===a.id);assert.equal(a.hp,Math.min(a.maxHp,prev.hp+Math.round(a.maxHp*.3)));}
   for(const text of ['・・・・？','なんだろう\n嫌な予感がする','終わってないのか？','ソウル・タイム・ミラー！！','そんな!！','結局勝つのは私たちだ！','派手に暴れてやるぜ！','決着をつけようか','ゲームオーバーです','みんな、私に任せて！'])assert.ok(revived.lines.some(l=>l[1]===text),text);
   assert.equal(revived.lines.filter(l=>l[1]==='ソウル・タイム・ミラー！！').length,1);
   assert.equal(await page.evaluate(()=>fourTest.final()),1);
  }
  assert.deepEqual(x.errors,[]);console.log('PASS fresh + stale encounters: 2/2/4 stages, half-HP buffs once, defeat dialogue, revival dialogue, HP30%, 1–2 actions, party heal30%, duplicate transition guard, final victory.');
 }finally{await x.browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
