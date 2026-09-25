const assert=require('node:assert/strict');const {open}=require('./story-v172-harness.cjs');
const injection=`window.report226={
 settings:flags=>{state.test.enabled=true;Object.assign(state.meta,{bookCompleted:false,bookKingReturnDone:false,finalBossDefeated:false},flags);renderSettings();$('#settingsOverlay').hidden=false;},
 win:async()=>{state.adventure.areaIndex=3;state.adventure.battleIndex=2;state.adventure.battleReady=true;state.adventure.storyFlags['pre:grassland:3']=true;state.adventure.storyFlags['pre:grassland']=true;passiveChance=()=>false;const sr=startRound;startRound=async()=>{};try{await startAdventureBattle();}finally{startRound=sr;}for(const e of state.battle.enemies){e.hp=0;recordEnemyDefeat(e);}finishBattle(true);},
 throne:async()=>{await openCastleRoom('throne');},
 read:()=>({world:state.adventure.worldIndex,report:state.adventure.awaitingReport,reported:state.adventure.reportedWorlds,busy:castleReportBusy}),
 saved:()=>saveAdventure()
};`;
(async()=>{const {browser,page,errors}=await open(injection);try{
 for(const [i,flags]of [{bookCompleted:true},{bookKingReturnDone:true},{}].entries()){
  await page.evaluate(f=>report226.settings(f),flags);await page.locator('#testChapterSelect').selectOption('0');await page.locator('#testAreaSelect').selectOption('0');await page.locator('#testChapterApplyBtn').click();
  assert.equal((await page.evaluate(()=>report226.read())).world,0);
  await page.evaluate(()=>report226.win());await page.locator('#resultOverlay').waitFor({state:'visible'});
  assert.equal((await page.evaluate(()=>report226.read())).report.worldId,'grassland');
  if(i===0){await page.evaluate(()=>report226.saved());await page.reload();}
  await page.evaluate(()=>report226.throne());await page.locator('[data-castle-actor="king"]').click();
  await page.waitForFunction(()=>document.querySelector('.castle-report-v227 p')?.textContent.trim().length>0||(document.querySelector('#dialogOverlay').hidden===false&&document.querySelector('#dialogText').textContent.trim().length>0));
  assert.equal((await page.evaluate(()=>report226.read())).busy,true);
  assert((await page.locator('.castle-report-v227 p, #dialogText').allTextContents()).some(t=>t.trim().length>0));
  if(await page.locator('#conversationSkipV224').isVisible())await page.locator('#conversationSkipV224').click();
  // A currently displayed facility line is advanced by its own pointer handler.
  for(let n=0;n<160;n++){
   const state=await page.evaluate(()=>report226.read());if(!state.report&&!state.busy)break;
   if(await page.locator('.castle-report-v227').count())await page.locator('.castle-report-v227').click({position:{x:190,y:500}});
   if(await page.locator('#dialogOverlay').isVisible()){const choices=page.locator('#dialogChoices button:visible');if(await choices.count())await choices.first().click();else await page.locator('#dialogOverlay').click({position:{x:190,y:350}});}
   await page.waitForTimeout(150);
  }
  const after=await page.evaluate(()=>report226.read());assert.equal(after.report,null);assert.equal(after.world,1);assert(after.reported.includes('grassland'));
 }
 assert.deepEqual(errors,[]);console.log('v226 PASS: test chapter UI -> Hawk victory -> king click -> grassland report -> desert; stale book flags, reload and fresh state');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
