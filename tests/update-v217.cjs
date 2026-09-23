const assert=require('node:assert/strict'),path=require('node:path'),os=require('node:os');
const {open}=require('./story-v172-harness.cjs');
const injection=`
const delay217=fixedDelay,animation217=animateV157;
fixedDelay=ms=>delay217(Math.min(ms,30));animateV157=(el,frames,ms)=>animation217(el,frames,Math.min(ms||900,35));
HTMLMediaElement.prototype.play=()=>Promise.reject(new Error('Test autoplay denied'));
Math.random=()=>.5;
window.lines217=[];window.invisible217=[];
const say217=storySay;storySay=async function(id,text,...args){window.lines217.push([id,text]);if(!$('#adventureScreen').classList.contains('active'))window.invisible217.push(text);return say217(id,text,...args);};
window.test217={
 setup:()=>{state.party=['yusha','pink','tetsu','desert','denden','money','jessie','nyoro','nekoku','kaijin'].map(id=>[id,99]);state.meta.bookCompleted=true;state.meta.openingCompleted=true;state.meta.trainingPlayed=true;state.adventure=defaultAdventure();state.adventure.worldIndex=MOB_DATA.adventureWorlds.findIndex(w=>w.id==='demonCastle2');state.adventure.areaIndex=3;state.adventure.battleIndex=2;state.adventure.battleReady=true;state.adventure.storyFlags['pre:demonCastle2:3']=true;state.autoBattle=false;storyBusy=false;passiveChance=()=>false;initiativeSpeed=e=>e.type==='ally'?100000:1;renderAdventure();showScreen('adventure');},
 prepare:()=>{const b=state.battle;for(const e of b.enemies)e.hp=1;const a=activeAlly();a.bookHeroNormalAoe=true;a.bookHeroCrit100=true;},
 snap:()=>({enemy:state.battle?.enemies[0]?.id,busy:state.battle?.busy,finished:state.battle?.finished,queue:state.battle?.queue?.length,screen:document.querySelector('.screen.active')?.id,tap:!!storyTapResolve,storyBusy,post:state.adventure.pendingPostStory?.key,report:state.adventure.awaitingReport,defeated:state.meta.finalBossDefeated,cleared:state.meta.gameCleared,pending:state.meta.pendingFinalEndingV217}),
 throne:async()=>{await travelTo('castle','王様へ報告しています…',renderCastle);await openCastleRoom('throne');},
 resumeSeed:()=>{state.meta.pendingFinalEndingV217=true;state.meta.finalBossDefeated=true;state.adventure.awaitingReport=null;saveMeta();saveAdventure();},
 cache:()=>endingFramesV217.size,
 stalledDecode:()=>decodeImageBoundedV217({decode:()=>new Promise(()=>{})},25)
};`;
async function advance(page,done,limit=90000){const start=Date.now();while(Date.now()-start<limit){if(await page.evaluate(done))return;
 const state=await page.evaluate(()=>test217.snap());
 if(state.tap){assert.equal(state.screen,'adventureScreen','pending story dialogue must be visible');await page.locator('#storyScene').click({position:{x:190,y:350},timeout:2000});}
 else if(await page.locator('[data-event-unlock-close]').isVisible())await page.locator('[data-event-unlock-close]').click();
 else if(await page.locator('[data-home-unlock-close-v137]').isVisible())await page.locator('[data-home-unlock-close-v137]').click();
 else if(await page.locator('#passiveCutin.battle-story-hold-v88').isVisible())await page.mouse.click(190,450);
 else if(await page.locator('#dialogOverlay').isVisible()){const buttons=page.locator('#dialogChoices button:visible');if(await buttons.count())await buttons.first().click();else await page.locator('#dialogOverlay').click({position:{x:190,y:350}});}
 await page.waitForTimeout(100);
 }throw Error('Progress timeout: '+JSON.stringify(await page.evaluate(()=>test217.snap())));}
(async()=>{const {browser,page,errors}=await open(injection);try{
 await page.evaluate(()=>test217.setup());await page.locator('#fieldBattleBtn').click();
 await page.waitForFunction(()=>{const s=test217.snap();return s.enemy==='dc2-maou'&&!s.busy&&s.queue>0;});
 await page.evaluate(()=>test217.prepare());await page.locator('#attackBtn').click();
 await advance(page,()=>{const s=test217.snap();return s.enemy==='dc2-ulrilis'&&!s.busy&&s.queue>0;});
 console.log('Fusion and Ulrilis battle OK');const lines=await page.evaluate(()=>lines217);assert(lines.some(x=>x[1].includes('ウルモブリリス')));assert.deepEqual(await page.evaluate(()=>invisible217),[]);
 await page.screenshot({path:path.join(os.tmpdir(),'mob-ulrilis-v217.png')});
 await page.evaluate(()=>test217.prepare());await page.locator('#attackBtn').click();await page.locator('#resultOverlay').waitFor({state:'visible'});
 await page.locator('#resultSetupBtn').click();await advance(page,()=>test217.snap().defeated&&!test217.snap().storyBusy&&!test217.snap().post);
 assert.deepEqual(await page.evaluate(()=>invisible217),[]);assert.equal((await page.evaluate(()=>test217.snap())).report.worldId,'demonCastle2');
 console.log('Post-story and report checkpoint OK');await page.evaluate(()=>test217.throne());await page.locator('#castleHeaderPill').click();
 let maxCache=0;const observer=setInterval(async()=>{try{maxCache=Math.max(maxCache,await page.evaluate(()=>test217.cache()));}catch{}},100);
 await advance(page,()=>test217.snap().cleared&&test217.snap().screen==='titleScreen'&&!test217.snap().pending,120000);clearInterval(observer);
 assert(maxCache<=4,'streaming cache must stay bounded');assert.equal(await page.locator('.ending-v157,.ending-loading-v169,.ending-caption-v157').count(),0);
 assert.equal(await page.evaluate(()=>test217.stalledDecode()),false);
 await page.evaluate(()=>test217.resumeSeed());await page.reload();assert.equal((await page.evaluate(()=>test217.snap())).report.worldId,'demonCastle2');
 assert.deepEqual(errors,[]);console.log('v217 PASS: battle button -> Maou defeat -> visible fusion dialogue -> Ulrilis battle -> victory NEXT -> full post-story -> report -> 31-frame ending -> title; bounded decode/cache and reload recovery');
}finally{if(errors.length)console.error('Browser errors:',errors);await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
