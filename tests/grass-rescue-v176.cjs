const assert=require('node:assert/strict');const {open}=require('./story-v172-harness.cjs');
const injection=`window.test176={
 async seed(count=0){state.adventure=defaultAdventure();state.adventure.areaIndex=3;state.adventure.battleIndex=2;state.adventure.battleReady=true;state.party=['yusha','pink','desert','denden'].map(id=>[id,20]);state.meta.trainingPlayed=true;state.meta.firstGrassReviveCount=count;state.meta.firstGrassReviveUsed=count>0;state.test.enabled=false;actionCutin=async()=>{};fixedDelay=async()=>{};startRound=async()=>{};await beginBattle({mode:'adventure',party:state.party,enemyConfigs:[{id:'boss-hawk',level:10}],storyWorldId:'grassland',storyAreaIndex:3,storyPostKey:'post:grassland:3',bossBattle:true});for(const a of state.battle.allies){a.hp=0;a.dead=true;}},
 lose(){finishBattle(false);return this.read();},
 read(){return {area:state.adventure.areaIndex,battle:state.adventure.battleIndex,rescuing:state.battle.firstGrassRescueInProgress,finished:state.battle.finished,report:state.adventure.awaitingReport,alive:state.battle.allies.every(a=>!a.dead&&a.hp>0)};},
 win(){for(const e of state.battle.enemies){e.hp=0;recordEnemyDefeat(e);}finishBattle(true);return this.read();},
 async report(){const calls=[];runCastleReportScriptV126=async id=>calls.push(id);await submitAdventureReport();return {calls,world:state.adventure.worldIndex,report:state.adventure.awaitingReport};},
 broken(pending=true){state.adventure=defaultAdventure();state.adventure.areaIndex=2;state.adventure.battleIndex=1;if(pending)state.adventure.pendingPostStory={key:'post:grassland:3',worldId:'grassland',areaIndex:3};else state.adventure.storyFlags={'post:grassland:3':true};saveAdventure();},
 repair(){return repairGrassReportV176();},
 snapshot(){return state.adventure;}
};`;
(async()=>{const {browser,page,errors}=await open(injection);try{
await page.waitForFunction(()=>window.__mobV176Runtime);
for(const count of [0,1]){await page.evaluate(n=>test176.seed(n),count);const loss=await page.evaluate(()=>test176.lose());assert.equal(loss.area,3);assert.equal(loss.battle,2);await page.waitForFunction(()=>!test176.read().rescuing);assert((await page.evaluate(()=>test176.read())).alive);const win=await page.evaluate(()=>test176.win());assert.equal(win.report.worldId,'grassland');const report=await page.evaluate(()=>test176.report());assert.deepEqual(report.calls,['grassland']);assert.equal(report.world,1);assert.equal(report.report,null);}
await page.evaluate(()=>test176.seed(2));const loss=await page.evaluate(()=>test176.lose());assert.equal(loss.area,2);assert.equal(loss.battle,0);assert.equal(await page.evaluate(()=>test176.repair()),false);
for(const pending of [true,false]){await page.evaluate(p=>test176.broken(p),pending);await page.reload();await page.waitForFunction(()=>window.__mobV176Runtime);const a=await page.evaluate(()=>test176.snapshot());assert.equal(a.awaitingReport.worldId,'grassland');assert.equal(a.areaIndex,3);assert.equal(await page.evaluate(()=>test176.repair()),false);}
assert.deepEqual(errors,[]);console.log('PASS first/second rescue -> Hawk victory -> king report; exhausted rescue defeat; pending/completed post-story save repair on reload');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
