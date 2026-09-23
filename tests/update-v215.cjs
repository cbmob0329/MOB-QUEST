const assert=require('node:assert/strict');
const {open}=require('./story-v172-harness.cjs');
const injection=`window.test215={
 setup:async(n)=>{
  const rows=['yusha','pink','tetsu','desert','denden','money','jessie','nyoro','nekoku','riro','kaijin'].map(id=>[id,90]);
  state.party=rows.slice(0,10);state.meta.bookRosterV214=rows;state.meta.bookCompleted=true;
  state.meta.demonCastle2SplitV181={A:rows.slice(0,n),B:rows.slice(n)};
  state.adventure=defaultAdventure();state.adventure.worldIndex=MOB_DATA.adventureWorlds.findIndex(w=>w.id==='demonCastle2');
  state.adventure.areaIndex=0;state.adventure.battleReady=true;state.adventure.demonCastle2SplitReadyV183=true;
  state.adventure.storyFlags['pre:demonCastle2:0']=true;state.autoBattle=false;storyBusy=false;
  passiveChance=()=>false;initiativeSpeed=e=>e.type==='ally'?100000:1;
  renderAdventure();showScreen('adventure');
 },
 prepare:()=>{const b=state.battle;for(const e of b.enemies)e.hp=1;const a=activeAlly();a.bookHeroNormalAoe=true;a.bookHeroCrit100=true;return a.id;},
 snap:()=>{const b=state.battle;if(!b)return {busy:true,queue:[]};return {ids:b.allies.map(a=>a.id),team:b.dualPartyTeamV181,busy:b.busy,pending:b.pendingWaveConfigs.length,enemies:b.enemies.map(e=>e.id),queue:b.queue.filter(e=>e.type!=='enemy').map(e=>e.id),label:$('#battleModeLabel').textContent,finished:b.finished,locked:!!b.dc2TransitionV215};},
 duplicate:()=>{spawnNextEnemyWave().then(()=>window.duplicateDone215=true);act('attack');},
 result:()=>({post:state.adventure.pendingPostStory?.key,visible:!$('#resultOverlay').hidden})
};`;
(async()=>{const {browser,page,errors}=await open(injection);try{
 for(const count of [5,6]){
  await page.evaluate(n=>test215.setup(n),count);
  await page.locator('#fieldBattleBtn').click();
  await page.waitForFunction(()=>{const s=test215.snap();return s.team==='A'&&!s.finished&&!s.busy&&s.queue.length>0;});
  const first=await page.evaluate(()=>test215.snap());assert.equal(first.ids.length,count);
  await page.evaluate(()=>test215.prepare());await page.locator('#attackBtn').click();
  const lines=[['モブマニー','このまま一気に倒すわよ！'],['モブデンデン','モブリリス、覚悟でやんす！'],['モブ怪人のボス','薔薇の魔女！最高の獲物だぜ！'],['モブリリス','うるさいなー'],['モブリリス','怒るよ？']];
  for(const [speaker,line]of lines){
   await page.waitForFunction(t=>document.querySelector('#passiveCutinText').textContent===t&&!document.querySelector('#passiveCutin').hidden,line);
   assert.equal(await page.locator('#passiveCutin small').innerText(),speaker);
   assert.equal((await page.evaluate(()=>test215.snap())).busy,true);
   if(line===lines[0][1])await page.evaluate(()=>test215.duplicate());
   await page.waitForTimeout(230);await page.mouse.click(195,450);
  }
  await page.locator('.dc2-handoff-v215.team-b').waitFor();
  assert.equal(await page.locator('.team-b .dc2-handoff-members-v215 figure').count(),11-count);
  await page.waitForTimeout(650);
  await page.screenshot({path:require('node:path').join(__dirname,`../artifacts/dc2-b-team-${11-count}-v215.png`)});
  await page.waitForFunction(()=>{const s=test215.snap();return s.team==='B'&&!s.busy&&!s.locked&&s.queue.length>0;});
  const second=await page.evaluate(()=>test215.snap());assert.equal(second.ids.length,11-count);
  assert.equal(new Set([...first.ids,...second.ids]).size,11);assert.equal(second.pending,0);
  assert.deepEqual([...second.enemies].sort(),['dc2-kufu','dc2-lilith','dc2-riva']);
  assert(second.queue.every(id=>second.ids.includes(id)));assert(second.label.includes('Bグループ・2戦目'));
  await page.evaluate(()=>test215.prepare());await page.locator('#attackBtn').click();
  await page.waitForFunction(()=>test215.snap().finished&&test215.result().visible);
  assert.equal((await page.evaluate(()=>test215.result())).post,'post:demonCastle2:0');
 }
 assert.deepEqual(errors,[]);console.log('v215/v216 UI PASS: actual attack -> five dialogue taps -> A/B handoff, 5/6 and 6/5, duplicate/AUTO guard, B-only queue, second victory and post-story');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
