const assert=require('node:assert/strict');
const {open}=require('./story-v172-harness.cjs');
const injection=`window.test214={
 flash:async()=>{storyBusy=true;await openStoryScene('unfinishedBook',3);hideStoryPartyHeroV94(true);await storyShowSecondaryGuestsV94(['book-navi','yusha'],'book-navi-hero-duel-v207');let done=false,flashed=false;const p=moveBookBossIntoPartyV207().finally(()=>done=true);while(!done){await new Promise(requestAnimationFrame);const h=document.querySelector('#storyPartyLine [data-story-actor="yusha"]');if(h){const s=getComputedStyle(h);if(s.visibility!=='hidden'&&Number(s.opacity)>0)flashed=true;}}await p;await closeStoryScene(false);storyBusy=false;return flashed;},
 setup:()=>{state.party=['yusha','pink','tetsu','desert','denden','money','jessie','nyoro','nekoku','riro'].map(id=>[id,id==='riro'?77:90]);state.adventure=defaultAdventure();state.adventure.worldIndex=MOB_DATA.adventureWorlds.findIndex(w=>w.id==='unfinishedBook');state.adventure.areaIndex=3;delete state.meta.bookRosterV214;delete state.meta.demonCastle2SplitV181;state.meta.bookCompleted=false;storyJoin('kaijin');for(const v of Object.values(ensureAdventureVitals())){v.hp=1;v.mp=0;v.dead=true;v.status.poison=3;}showScreen('adventure');},
 formation:()=>{window.formationDone214=false;bookPartyFormationV92().then(()=>window.formationDone214=true);return state.party.every(([id,lv])=>{const v=state.adventure.vitals[id],s=baseStats(player(id),lv);return v.hp===s.maxHp&&v.mp===s.maxMp&&!v.dead&&Object.values(v.status).every(x=>x===0);});},
 lethal:async()=>{window.finalResult214='pending';startBookNaviMasterV89Final().then(r=>window.finalResult214=r);},
 damage:async()=>{const b=state.battle;b.finished=true;const a=b.allies.find(x=>x.id==='yusha');a.hp=1;a.barrier=0;const damage=calcEnemyDamage,evade=weaponEvasion,chance=passiveChance;calcEnemyDamage=()=>100000;weaponEvasion=()=>0;passiveChance=()=>false;try{await damageAlly(a,1);return {hp:a.hp,dead:a.dead,immortal:b.config.scriptedImmortalParty};}finally{calcEnemyDamage=damage;weaponEvasion=evade;passiveChance=chance;}},
 lose:()=>{for(const a of state.battle.allies){a.hp=0;a.dead=true;}state.battle.finished=false;finishBattle(false);},
 split:async()=>{state.meta.bookCompleted=true;state.adventure.worldIndex=MOB_DATA.adventureWorlds.findIndex(w=>w.id==='demonCastle2');state.adventure.areaIndex=0;showScreen('adventure');await openStoryScene('demonCastle2',0);await runStorySteps([['dc2Split181']]);window.splitDone214=true;},
 saved:()=>({split:state.meta.demonCastle2SplitV181,roster:dc2RosterV214(),active:state.party.length}),
 battle:async()=>{storyBusy=false;state.adventure.storyFlags['pre:demonCastle2:0']=true;state.adventure.battleReady=true;await closeStoryScene(false);await startAdventureBattle();return state.battle.allies.map(a=>a.id);},
 nextTeam:async()=>{state.battle.finished=false;for(const e of state.battle.enemies)e.hp=0;await spawnNextEnemyWave();return state.battle.allies.map(a=>a.id);},
 ready:()=>!!state.battle?.config?.bookNaviMasterFinal
};`;
(async()=>{const {browser,page,errors}=await open(injection);try{
 await page.evaluate(()=>test214.setup());assert.equal(await page.evaluate(()=>test214.flash()),false);assert.equal(await page.evaluate(()=>test214.formation()),true);
 await page.locator('.book-formation-done-v92').click();await page.locator('[data-v92-confirm-yes]').click();await page.waitForFunction(()=>window.formationDone214);
 await page.evaluate(()=>test214.lethal());await page.waitForFunction(()=>test214.ready());
 assert.deepEqual(await page.evaluate(()=>test214.damage()),{hp:0,dead:true,immortal:false});await page.evaluate(()=>test214.lose());await page.waitForFunction(()=>window.finalResult214===false);
 assert.equal(await page.evaluate(()=>test214.formation()),true);await page.locator('.book-formation-done-v92').click();await page.locator('[data-v92-confirm-yes]').click();
 await page.evaluate(()=>{test214.split().catch(e=>window.error214=e.stack);});await page.locator('[data-v181-split-confirm]').waitFor();
 assert.equal(await page.locator('[data-v181-split-member]').count(),11);
 assert.equal(await page.locator('.lilith-team-count').innerText(),'A 6人\nB 5人');
 await page.locator('[data-v181-split-member].team-a').first().click();
 assert.equal(await page.locator('.lilith-team-count').innerText(),'A 5人\nB 6人');
 await page.locator('[data-v181-split-confirm]').click();await page.locator('[data-split-answer-v210="true"]').click();await page.waitForFunction(()=>window.splitDone214);
 const saved=await page.evaluate(()=>test214.saved());assert.equal(saved.roster.length,11);assert.equal(saved.roster.find(r=>r[0]==='riro')[1],77);assert.equal(saved.active,10);assert.equal(new Set([...saved.split.A,...saved.split.B].map(r=>r[0])).size,11);
 const a=await page.evaluate(()=>test214.battle()),b=await page.evaluate(()=>test214.nextTeam());assert.equal(a.length,5);assert.equal(b.length,6);assert.equal(new Set([...a,...b]).size,11);
 await page.reload();const reload=await page.evaluate(()=>test214.saved());assert.equal(reload.roster.length,11);assert.equal(reload.roster.find(r=>r[0]==='riro')[1],77);assert.equal(reload.split.B.length,6);
 assert.deepEqual(errors,[]);console.log('v214 PASS: full heal before formation/retry, lethal HP 0 and defeat, 11 unique members, 5/6 selection, A/B battles, level persistence after reload');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
