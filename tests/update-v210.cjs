const assert=require('node:assert/strict');
const {open}=require('./story-v172-harness.cjs');
const injection=`
window.test210={state,getBusy:()=>storyBusy,
 setup:()=>{state.party=['yusha','pink','tetsu','desert','denden','money','jessie','nyoro','nekoku','riro'].map(id=>[id,85]);state.adventure=defaultAdventure();state.adventure.worldIndex=MOB_DATA.adventureWorlds.findIndex(w=>w.id==='demonCastle2');state.adventure.battleReady=true;state.meta.demonCastle2SplitV181=null;showScreen('adventure');},
 start:async()=>{storySay=async()=>{};storyNarrate=async()=>{};await startAdventureBattle();},
 riro:async()=>{storyBusy=true;state.party=state.party.filter(r=>r[0]!=='riro');await openStoryScene('unfinishedBook',3);await renderStoryParty();return !!document.querySelector('#storyPartyLine [data-story-actor="riro"]');},
 matrix:async()=>{showScreen('adventure');await storyShowGuest('book-navi');const fx=matrixOverlayV208();await readyStoryImage(fx.querySelector('img'),storyActorInfo('book-navi-master').image);fx.classList.add('decoded');await fixedDelay(1000);return !!fx.querySelector('.matrix-actor-v210 img').naturalWidth;},
 transform:async()=>{await naviMatrixTransformV207();return {actor:document.querySelector('#storyGuest').dataset.storyActor,fx:document.querySelectorAll('.book-matrix-v210').length};},
 entrance:async()=>{await BOOK_RUNNERS_V207['pre:unfinishedBook:0']();return {actors:document.querySelectorAll('#storyGuestGroup [data-story-actor]').length,fx:document.querySelectorAll('.book-arrival-v210').length};},
 returnBook:async()=>{storyBusy=false;let arrival=0;runStoryEvent=async()=>{showScreen('castle');return true;};maybeRunArrivalStory=async()=>{arrival++;};state.battle={mode:'adventure'};state.adventure.pendingPostStory={key:'post:unfinishedBook:3'};await document.querySelector('#resultSetupBtn').onclick();return {arrival,castle:screens.castle.classList.contains('active'),pending:state.adventure.pendingPostStory};}
};`;
(async()=>{
 const {browser,page,errors}=await open(injection);
 try{
  assert.deepEqual(errors,[],'boot must finish without assignment exceptions');
  assert.equal(await page.evaluate(()=>window.__mobBuildVersion),'v210');
  await page.evaluate(()=>{test210.setup();test210.start().then(()=>window.flowDone210=true).catch(e=>window.flowError210=e.stack);});
  await page.locator('[data-v181-split-confirm]').waitFor({timeout:30000});
  await page.locator('[data-v181-split-member="yusha"]').click();
  await page.locator('[data-v181-split-confirm]').click();
  await page.locator('[data-split-answer-v210="false"]').click();
  await page.locator('[data-v181-split-confirm]').click();
  await page.locator('[data-split-answer-v210="true"]').click();
  await page.waitForFunction(()=>window.flowDone210||window.flowError210,{},{timeout:30000});
  assert.equal(await page.evaluate(()=>window.flowError210),undefined);
  const battle=await page.evaluate(()=>({mode:test210.state.battle?.mode,team:test210.state.battle?.dualPartyTeamV181,ready:test210.state.adventure.demonCastle2SplitReadyV183,busy:test210.getBusy()}));
  assert.deepEqual(battle,{mode:'adventure',team:'A',ready:true,busy:false});
  assert.equal(await page.evaluate(()=>test210.riro()),true,'Riro remains after adventure cursor advanced and party slot was replaced');
  assert.equal(await page.evaluate(()=>test210.matrix()),true);
  await page.screenshot({path:require('node:path').join(__dirname,'v210-matrix.png')});
  await page.evaluate(()=>document.querySelectorAll('.book-matrix-v210').forEach(el=>el.remove()));
  assert.deepEqual(await page.evaluate(()=>test210.transform()),{actor:'book-navi-master',fx:0});
  assert.deepEqual(await page.evaluate(()=>test210.entrance()),{actors:3,fx:0});
  await page.screenshot({path:require('node:path').join(__dirname,'v210-kaijin.png')});
  assert.deepEqual(await page.evaluate(()=>test210.returnBook()),{arrival:0,castle:true,pending:null});
  assert.deepEqual(errors,[]);
  console.log('v210 browser: boot, DC2 dialogue/formation/no/yes/battle, Riro, Matrix, Book return PASS');
 }catch(e){console.log(await page.evaluate(()=>({error:window.flowError210,done:window.flowDone210,busy:test210.getBusy(),adventure:test210.state.adventure,dialog:document.querySelector('#dialogText')?.textContent})));throw e;}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
