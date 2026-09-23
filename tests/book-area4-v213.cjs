const assert=require('node:assert/strict');
const {open}=require('./story-v172-harness.cjs');
const injection=`window.bookProbe213={
 start:async()=>{
  state.party=['yusha','pink','tetsu','desert','denden','money','jessie','nyoro','nekoku','riro'].map(id=>[id,90]);
  state.adventure=defaultAdventure();state.adventure.worldIndex=MOB_DATA.adventureWorlds.findIndex(w=>w.id==='unfinishedBook');state.adventure.areaIndex=3;
  state.meta.bookCompleted=false;state.meta.bookKingReturnDone=false;
  const bg=storySceneBg('unfinishedBook',3);
  await startBattleLoaded({mode:'adventure',enemyConfigs:[{id:'book-kaijin-boss',level:85}],party:state.party,bg:bg.bg,fallbackBg:bg.fallback,bossBattle:true,storyWorldId:'unfinishedBook',storyAreaIndex:3,storyPostKey:'post:unfinishedBook:3',returnHomeAfterAreaClear:true,bookHeroPower:true});
  for(const enemy of state.battle.enemies)enemy.hp=0;
  finishBattle(true);await fixedDelay(1300);
  storySay=async(id,text)=>{window.lastLine213=id+': '+text;if(!document.querySelector('#adventureScreen').classList.contains('active'))throw new Error('Story dialogue is waiting inside inactive adventure screen');};storyNarrate=async text=>{window.lastLine213=text;};
  facilityTalk=async()=>{};narrationDialog=async()=>{};
  await document.querySelector('#resultSetupBtn').onclick();
 },
 tick:()=>{const b=state.battle;if(b?.mode==='story'&&!b.finished){window.storyBattles213=(window.storyBattles213||[]).concat(b.config?.storyLabel);finishScriptedBattle();}},
 status:()=>({done:window.done213,error:window.error213,line:window.lastLine213,busy:storyBusy,screen:document.querySelector('.screen.active')?.id,battle:state.battle?.mode,complete:state.meta.bookCompleted,returnDone:state.meta.bookKingReturnDone,formation:!!document.querySelector('#bookFormationV92'),battles:window.storyBattles213})
};`;
(async()=>{const {browser,page,errors}=await open(injection);try{
 await page.evaluate(()=>{bookProbe213.start().then(()=>window.done213=true).catch(e=>window.error213=e.stack);});
 const until=Date.now()+90000;
 while(Date.now()<until){
  await page.evaluate(()=>bookProbe213.tick());
  const yes=page.locator('[data-v92-confirm-yes]');const next=page.locator('.book-formation-done-v92');
  if(await yes.isVisible())await yes.click({timeout:2000});else if(await next.isVisible())await next.click({timeout:2000});
  const s=await page.evaluate(()=>bookProbe213.status());if(s.done||s.error){console.log(s);break;}
  await page.waitForTimeout(250);
 }
 const s=await page.evaluate(()=>bookProbe213.status());console.log(s,errors);assert.equal(s.error,undefined);assert.equal(s.done,true);assert.equal(s.complete,true);assert.equal(s.returnDone,true);assert.equal(s.battles.length,2);assert.deepEqual(errors,[]);
 console.log('Area4 post-boss → solo → formation → master → Record Room PASS');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
