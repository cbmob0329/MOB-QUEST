const assert=require('node:assert/strict'),path=require('node:path');
const {open}=require('./story-v172-harness.cjs');
const injection=`window.flameTest213={
 setup:async()=>{state.party=[['yusha',90],['pink',90]];await startBattleLoaded({mode:'training',enemyConfigs:[{id:'book-kaijin-boss',level:80}],party:state.party,bg:'back/king4.png'});state.battle.finished=true;await fixedDelay(3000);},
 cast:async()=>{const u=player('yusha').ults.find(x=>x.name==='ネバー・エンディング・フレイム');if(!u)throw Error('missing ultimate');await playUltimatePostAnimation({id:'yusha'},u);},
};`;
(async()=>{const {browser,page,errors}=await open(injection);try{
 assert.deepEqual(errors,[]);await page.evaluate(()=>flameTest213.setup());
 await page.evaluate(()=>{flameTest213.cast().then(()=>window.flameDone213=true).catch(e=>window.flameError213=e.stack);});
 await page.locator('.never-flame-v213.burst').waitFor();
 const size=await page.evaluate(()=>({art:document.querySelector('.flame-art-v213').getBoundingClientRect().width,frames:document.querySelectorAll('.flame-art-v213 img').length,ready:Array.from(document.querySelectorAll('.flame-art-v213 img')).every(x=>x.naturalWidth>0)}));
 assert(size.art>300);assert.equal(size.frames,4);assert.equal(size.ready,true);
 await page.screenshot({path:path.join(__dirname,'v213-flame.png')});
 await page.waitForFunction(()=>window.flameDone213||window.flameError213);assert.equal(await page.evaluate(()=>window.flameError213),undefined);assert.equal(await page.locator('.never-flame-v213').count(),0);
 await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>flameTest213.cast());assert.equal(await page.locator('.never-flame-v213').count(),0);assert.deepEqual(errors,[]);
 console.log('Flame PASS: four decoded images, >300px at 390px viewport, effect cleanup, reduced motion');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
