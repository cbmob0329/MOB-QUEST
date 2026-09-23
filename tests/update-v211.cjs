const assert=require('node:assert/strict'),path=require('node:path');
const {open}=require('./story-v172-harness.cjs');
const injection=`
window.test211={
 setup:async()=>{state.party=['yusha','pink','tetsu','desert','denden','money','jessie','nyoro','nekoku','riro'].map(id=>[id,85]);state.adventure=defaultAdventure();state.adventure.worldIndex=MOB_DATA.adventureWorlds.findIndex(w=>w.id==='demonCastle2');showScreen('adventure');storySay=async()=>{};storyNarrate=async()=>{};await openStoryScene('demonCastle2',0);},
 scene:async(area)=>{await openStoryScene('demonCastle2',area);},
 split:async()=>{storyBusy=true;try{await runStorySteps([['narrate','パーティーを2つに分けてください\\nAグループとBグループで連戦します'],['dc2Split181']]);return state.adventure.demonCastle2SplitReadyV183;}finally{storyBusy=false;}},
 step:async(step)=>{await runStorySteps([step]);return {single:$('#storyGuest').hidden?null:$('#storyGuest').dataset.storyActor,group:$('#storyGuestGroup').hidden?[]:Array.from(document.querySelectorAll('#storyGuestGroup [data-story-actor]')).map(x=>x.dataset.storyActor),fx:document.querySelectorAll('.dc2-cinematic-v211').length};},
 book:async()=>{const rows=[];const base=storySay;storySay=async(id,text)=>rows.push([id,text]);try{await BOOK_RUNNERS_V207['post:unfinishedBook:0']();return rows;}finally{storySay=base;}},
 ul:async()=>{await dc2EntranceV211(['dc2-ulrilis'],'abyss');return $('#storyGuest').dataset.storyActor;},
 fail:async()=>{const base=storyShowGuest;storyShowGuest=async()=>{throw new Error('test load failure');};try{await dc2EntranceV211(['dc2-maou'],'abyss');}catch(e){return {message:e.message,fx:document.querySelectorAll('.dc2-cinematic-v211').length,visibility:$('#storyGuest').style.visibility};}finally{storyShowGuest=base;}},
 preview:()=>{const fx=dc2EffectV211('abyss');fx.classList.add('release');}
};`;
(async()=>{
 const {browser,page,errors}=await open(injection);
 try{
  assert.deepEqual(errors,[]);assert.equal(await page.evaluate(()=>window.__mobBuildVersion),'v211');
  await page.evaluate(()=>test211.setup());
  const rows=await page.evaluate(()=>test211.book());
  const i=rows.findIndex(r=>r[1].includes('本気じゃなかったぞ'));assert.equal(rows[i][0],'nekoku');assert.deepEqual(rows[i+1],['jessie','みんな事情があるのよ']);
  await page.evaluate(()=>test211.scene(0));
  let r=await page.evaluate(()=>test211.step(['guest','boss-lilith-castle']));assert.equal(r.single,'boss-lilith-castle');assert.equal(r.fx,0);
  r=await page.evaluate(()=>test211.step(['dc2Awaken181']));assert.equal(r.group.length,5);assert.equal(r.fx,0);
  await page.evaluate(()=>test211.scene(1));
  r=await page.evaluate(()=>test211.step(['dc2RoseClone181']));assert.deepEqual(r.group,['dc2-lilith','dc2-lilith','dc2-lilith']);assert.equal(r.fx,0);
  await page.evaluate(()=>test211.step(['roseFade180','dc2-lilith']));
  await page.evaluate(()=>test211.scene(2));
  r=await page.evaluate(()=>test211.step(['dc2FireSummon181']));assert.equal(r.single,'dc2-enma');assert.equal(r.fx,0);
  await page.evaluate(()=>test211.scene(3));
  r=await page.evaluate(()=>test211.step(['dc2MaouSummon181']));assert.equal(r.single,'dc2-maou');assert.equal(r.fx,0);
  await page.evaluate(()=>test211.preview());
  await page.screenshot({path:path.join(__dirname,'v211-maou.png')});
  await page.evaluate(()=>document.querySelectorAll('.dc2-cinematic-v211').forEach(x=>x.remove()));
  assert.equal(await page.evaluate(()=>test211.ul()),'dc2-ulrilis');
  assert.deepEqual(await page.evaluate(()=>test211.fail()),{message:'test load failure',fx:0,visibility:''});
  await page.evaluate(()=>{test211.split().then(value=>window.splitDone211=value);});
  await page.locator('[data-v181-split-confirm]').click();
  await page.locator('[data-split-answer-v210="false"]').click();
  await page.locator('[data-v181-split-confirm]').click();
  await page.locator('[data-split-answer-v210="true"]').click();
  await page.waitForFunction(()=>window.splitDone211===true);
  assert.deepEqual(errors,[]);console.log('v211 browser PASS: Jessie dialogue, Lilith, five sisters, clones, fade, Enma, Maou, Ulrilis, effect cleanup on success/failure');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
