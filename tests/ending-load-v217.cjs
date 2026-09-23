const assert=require('node:assert/strict');
const {open}=require('./story-v172-harness.cjs');
const injection=`window.end217={
 load:n=>loadEndingFrameV217(n).then(el=>({fallback:el.classList.contains('ending-fallback-v217'),width:el.naturalWidth||0})),
 start:()=>{endingBusyV169=true;HTMLMediaElement.prototype.play=()=>new Promise(()=>{});window.endDone217=false;endingMontageV157().finally(()=>{endingBusyV169=false;window.endDone217=true;});},
 clear:()=>endingFramesV217.clear()
};`;
(async()=>{const {browser,page,errors}=await open(injection);try{
 await page.route('**/poster/02.png',r=>r.fulfill({status:404,body:''}));
 await page.route('**/poster/03.png',()=>new Promise(()=>{}));
 assert.equal((await page.evaluate(()=>end217.load(1))).width>0,true);
 assert.equal((await page.evaluate(()=>end217.load(2))).fallback,true);
 const started=Date.now();assert.equal((await page.evaluate(()=>end217.load(3))).fallback,true);assert(Date.now()-started<14000);
 await page.evaluate(()=>end217.clear());await page.route('**/poster/01.png',()=>new Promise(()=>{}));
 await page.evaluate(()=>end217.start());await page.locator('.ending-next-v217').click();
 await page.waitForFunction(()=>window.endDone217,{},{timeout:4000});assert.equal(await page.locator('.ending-v157').count(),0);
 assert.deepEqual(errors,[]);console.log('v217 load PASS: valid frame, 404 fallback, stalled request deadline, advance during stalled image and pending audio playback, overlay cleanup');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
