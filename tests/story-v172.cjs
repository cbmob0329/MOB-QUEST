const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {open,root}=require('./story-v172-harness.cjs');
const artifacts=path.join(require('node:os').tmpdir(),'mob-quest-v172');fs.mkdirSync(artifacts,{recursive:true});
const injection=`
window.test172={
 seed(){state.adventure=defaultAdventure();state.party=['yusha','pink','desert','denden','money'].map(id=>[id,35]);state.meta.trainingPlayed=true;state.meta.openingCompleted=true;state.meta.bookHeroDown=false;state.meta.moneyStoryAwayV157=false;state.coins=70000;state.meta.inventory={};},
 audit(){return {levels:MOB_DATA.adventureWorlds.map(w=>w.recommendedLevel),scenes:Object.keys(STORY_V172.events),missing:Object.values(STORY_V172.events).flatMap(e=>e.steps.flatMap(s=>s[0]==='say'||s[0]==='sayRed'||s[0].startsWith('guest')&&s[0]!=='guests'?[s[1]]:s[0]==='guests'?s[1]:[])).filter(id=>!storyActorInfo(id).image),items:GAME_ITEMS.map(i=>i.id)};},
 shop(){showScreen('castle');renderMobShopRoom();openCastleShopPopup();},
 async buy(){const original=facilityTalk;facilityTalk=async()=>{};try{await buyCastleItemQty();}finally{facilityTalk=original;}},
 wallet(){return {coins:state.coins,tents:tentCount()};},
 funds(n){state.coins=n;},
 detail(id){if(!state.party.some(x=>x[0]===id))state.party.push([id,35]);openPlayerDetail(id);},
 smith(){closePlayerDetail();showScreen('castle');renderBlacksmithPopup('shop');},
 async sea(){showScreen("adventure");state.adventure.worldIndex=MOB_DATA.adventureWorlds.findIndex(w=>w.id==='sea');await openStoryScene('sea',3);await storyShowGuest('nepu');await storyTempActor('nekoku');},
 async walk(){
   showScreen("adventure");const originals={storySay,storyNarrate,storySayDual,fixedDelay,animateV157};const spoken=[],missing=[];
   fixedDelay=async()=>{};animateV157=async()=>{};
   storySay=async(id,text)=>{spoken.push([id,text]);if(id==='nekoku'&&text==='お呼びでしょうか国王様！'){const a=storyAnchor('nekoku'),im=a?.querySelector('img');if(!a||!im?.naturalWidth||a.getBoundingClientRect().width===0)missing.push('nekoku');}};
   storyNarrate=async()=>{};storySayDual=async()=>{};
   try{for(const [key,e]of Object.entries(STORY_V172.events)){state.adventure.worldIndex=MOB_DATA.adventureWorlds.findIndex(w=>w.id===e.worldId);await openStoryScene(e.worldId,e.area,e.layout||'default',e.extras||[]);await runStorySteps(e.steps);await closeStoryScene(false);}return {spoken,missing,party:state.party.map(x=>x[0]),drinks:drinkCount('19')};}
   finally{({storySay,storyNarrate,storySayDual,fixedDelay,animateV157}=originals);}
 },
 journal(finished,win=true){state.quest={type:'journal',worldIndex:0,areaIndex:0,battleIndex:0,finished:false,vitals:freshQuestVitals()};if(finished)for(let n=0;n<12;n++)advanceQuestAfterWin();state.training.mode='journal';state.battle={mode:'quest',resultWin:win};return $('#resultSetupBtn').onclick();},
 state(){return {quest:state.quest,screen:[...document.querySelectorAll('.screen.active')].map(x=>x.id)};},
 async phase(which){
  const original={actionCutin,allyStoryCutin,enemyStoryCutin,fixedDelay,playFrezardFusion,storyFlashBattle,renderBattle,notice,startRound};const lines=[];startRound=async()=>{};
  actionCutin=async()=>{};allyStoryCutin=async(id,t)=>lines.push([id,t]);enemyStoryCutin=async(e,t)=>lines.push([e.id,t]);fixedDelay=async()=>{};playFrezardFusion=async()=>{};storyFlashBattle=async()=>{};renderBattle=()=>{};notice=()=>{};
  try{const ids=which==='tribe'?['boss-debuff2','boss-berserk2']:['m-frezard'];state.battle={mode:'adventure',config:{},enemies:[],allies:[],pendingWaveConfigs:[ids.map(id=>({id,level:50}))],bg:'back/sougen.png',fallbackBg:'back2/002.png',turn:1};await spawnNextEnemyWave();return {lines,enemies:state.battle.enemies.map(e=>({id:e.id,hp:e.hp,maxHp:e.maxHp}))};}
  finally{({actionCutin,allyStoryCutin,enemyStoryCutin,fixedDelay,playFrezardFusion,storyFlashBattle,renderBattle,notice,startRound}=original);}
 }
};`;
(async()=>{
 assert(fs.readFileSync(path.join(root,'index.html'),'utf8').includes(fs.readFileSync(path.join(root,'js/game.js'),'utf8').trim()),'inline game matches source');
 const {browser,page,errors}=await open(injection);
 try{
  await page.waitForFunction(()=>window.__mobV172Runtime&&window.test172);await page.evaluate(()=>test172.seed());
  const audit=await page.evaluate(()=>test172.audit());assert.equal(audit.scenes.length,36);assert.deepEqual(audit.missing,[]);assert.deepEqual(audit.levels,[5,10,15,20,30,35,40,55,50,55,60,65,75,85,90]);assert(!audit.items.includes('mob-tent'),'tent must not alter random exploration drops');
  await page.evaluate(()=>test172.shop());await page.locator('[data-buy-castle-item="mob-tent"]').click();assert.match(await page.locator('#castleQtyUnitPrice').innerText(),/35,000/);
  await page.locator('#castleQtyPlusBtn').click();await page.evaluate(()=>test172.buy());assert.deepEqual(await page.evaluate(()=>test172.wallet()),{coins:0,tents:2});
  await page.locator('[data-buy-castle-item="mob-tent"]').click();assert(await page.locator('#castleQtyBuyBtn').isDisabled());await page.evaluate(()=>test172.buy());assert.deepEqual(await page.evaluate(()=>test172.wallet()),{coins:0,tents:2});
  await page.reload();await page.waitForFunction(()=>window.test172);assert.equal((await page.evaluate(()=>test172.wallet())).tents,2);
  await page.evaluate(()=>test172.seed());
  for(const id of ['yusha','pink','desert','nyoro','nekoku','jessie','denden','money','riro','tetsu','lilith','naraku','kaijin']){await page.evaluate(id=>test172.detail(id),id);assert.equal(await page.locator('.player-passive-v172').count(),1);assert((await page.locator('.player-passive-v172 p').innerText()).length>10);}
  await page.evaluate(()=>test172.smith());const perf=page.locator('#blacksmithPopup [data-buy-weapon] em').first();assert(await perf.count());assert(await perf.evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=15));
  await page.evaluate(()=>test172.seed());await page.evaluate(()=>test172.sea());const cat=page.locator('#storyPartyLine [data-story-actor="nekoku"] img');assert(await cat.isVisible());assert(await cat.evaluate(el=>el.naturalWidth>0));assert(await page.locator('#storyGuest[data-story-actor="nepu"]').isVisible());
  await page.screenshot({path:path.join(artifacts,'sea-v172.png')});
  await page.evaluate(()=>test172.seed());const walked=await page.evaluate(()=>test172.walk());assert.deepEqual(walked.missing,[]);assert(walked.party.includes('nekoku')&&walked.party.includes('tetsu')&&walked.party.includes('jessie'));assert.equal(walked.drinks,1);assert(walked.spoken.some(([id,t])=>id==='jessie'&&t==='あんたちょっと危険ね'));console.log('PASS 36 scenes, guest assets and joins');
  const tribe=await page.evaluate(()=>test172.phase('tribe'));assert.equal(tribe.enemies.length,2);assert(tribe.enemies.every(e=>e.hp===e.maxHp));assert.equal(tribe.lines.length,3);
  const fusion=await page.evaluate(()=>test172.phase('magma'));assert(fusion.lines.some(([id,t])=>id==='pink'&&t==='負けないであります！'));
  await page.evaluate(()=>{void test172.journal(true);});await page.waitForSelector('.journal-clear-v172.show');assert.equal(await page.locator('.journal-clear-card-v172 b').innerText(),'草原');await page.waitForTimeout(900);await page.screenshot({path:path.join(artifacts,'journal-v172.png')});await page.locator('.journal-clear-v172 button').click();await page.waitForFunction(()=>!test172.state().quest);assert((await page.evaluate(()=>test172.state())).screen.includes('trainingScreen'));
  await page.evaluate(()=>test172.journal(false));assert.equal(await page.locator('.journal-clear-v172').count(),0);assert((await page.evaluate(()=>test172.state())).quest);
  await page.evaluate(()=>test172.journal(false,false));assert.equal(await page.locator('.journal-clear-v172').count(),0);assert.equal((await page.evaluate(()=>test172.state())).quest,null);
  console.log('PASS tent purchase/persistence/insufficient funds, 13 passive panels, weapon font, level +5, battle phases, journal completion');
  assert.deepEqual(errors,[],'browser runtime errors');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

