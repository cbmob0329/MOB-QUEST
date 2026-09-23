const assert=require('node:assert/strict'),path=require('node:path');
const {open}=require('./story-v172-harness.cjs');
const injection=`window.test212={
 caption:async()=>{showScreen('adventure');await openStoryScene('unfinishedBook',3);storyNarrate=async text=>{const box=document.querySelector('#storyNarration');document.querySelector('#storyNarrationText').textContent=text;box.hidden=false;box.classList.add('show');await new Promise(resolve=>window.releaseCaption212=resolve);};window.captionPromise212=storyBookNarrateV207('あのヒーローにやっつけてもらおう');},
 spell:async(id)=>{showScreen('battle');const spell=MOB_DATA.magicCatalog.find(m=>m.id===id);let done=false,overlap=false;const promise=skillSprite(spell.frames,'enemy',spell.mode).finally(()=>done=true);while(!done){await new Promise(requestAnimationFrame);const count=Array.from(document.querySelectorAll('.smooth-spell-layer-v212')).filter(el=>{const o=Number(getComputedStyle(el).opacity);return o>.02&&o<.98;}).length;if(count>=2)overlap=true;}await promise;return {overlap,hidden:document.querySelector('#skillSpriteFx').hidden,children:document.querySelector('#skillSpriteFx').childElementCount};}
};`;
(async()=>{
 const {browser,page,errors}=await open(injection);
 try{
  assert.deepEqual(errors,[]);assert.equal(await page.evaluate(()=>window.__mobBuildVersion),'v212');
  await page.evaluate(()=>test212.caption());
  for(const width of [320,390,768]){
   await page.setViewportSize({width,height:844});
   const r=await page.evaluate(()=>{const el=document.querySelector('#storyNarrationText'),range=document.createRange();range.selectNodeContents(el);return {lines:range.getClientRects().length,overflow:el.scrollWidth>el.clientWidth+1,text:el.textContent};});
   assert.equal(r.lines,1);assert.equal(r.overflow,false);
  }
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(__dirname,'v212-book-line.png')});
  await page.evaluate(async()=>{releaseCaption212();await captionPromise212;});
  assert.equal(await page.evaluate(()=>document.querySelector('#storyNarration').classList.contains('book-single-line-v212')),false);
  for(const id of ['neomanipool','goremagardy'])assert.deepEqual(await page.evaluate(id=>test212.spell(id),id),{overlap:true,hidden:true,children:0});
  assert.deepEqual(errors,[]);console.log('v212 PASS: single line at 320/390/768px; both spells crossfade and clean up');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
