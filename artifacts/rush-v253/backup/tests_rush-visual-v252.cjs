const assert=require('node:assert/strict'),path=require('node:path'),{open,root}=require('./story-v172-harness.cjs');
const injection=`window.rushVisual={
 setup(){state.party=['yusha','pink','denden','money'].map(id=>[id,10]);state.training.party=state.party.map(r=>[...r]);state.meta.openingCompleted=true;state.meta.trainingPlayed=true;state.meta.seenMemosV236=Object.fromEntries(MEMOS_V236.map(m=>[m.id,true]));state.adventure.reportedWorlds=['grassland'];state.test.enabled=false;state.autoBattle=false;startRound=()=>{};eventViewV163='story';selectedStoryV179=null;showScreen('training');renderEventQuestsV163();$('#trainingFeaturePopup').hidden=false;},
 back:()=>returnRushV252(),
 snap:()=>({run:eventRunV174?.rushV252,battle:state.battle?.config?.rushV252}),
 async allDialogue(){const r=eventRunV174={rushV252:'rush-ember-v252',area:0};window.linesDone=false;for(const q of RUSH_DATA_V252.quests)for(const a of q.areas)for(const phase of ['pre','post'])await rushDialogueV252(a[phase],r);window.linesDone=true;clearRushV252();}
};`;
async function advance(page,value){const button=page.locator('[data-dialog-value="'+value+'"]');for(let i=0;i<40;i++){if(await button.isVisible()){await button.click();return;}if(await page.locator('#dialogOverlay.dialog-page-v152').isVisible())await page.locator('#dialogText').click();await page.waitForTimeout(100);}throw Error('Dialogue choice unavailable '+value);}
(async()=>{const x=await open(injection);try{const {page,errors}=x;await page.evaluate(()=>rushVisual.setup());await page.locator('[data-rush-door]').click();assert.equal(await page.locator('[data-rush-start]:not(:disabled)').count(),1);
 for(const viewport of [{width:390,height:844},{width:360,height:640}]){await page.setViewportSize(viewport);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.screenshot({path:path.join(root,'artifacts/rush-v252/locked-'+viewport.width+'.png')});}
 await page.locator('[data-rush-start="rush-grass-v252"]').click();await page.waitForTimeout(300);await advance(page,'yes');
 for(let i=0;i<3;i++){await page.waitForTimeout(300);assert.ok((await page.locator('#dialogText').innerText()).length);if(i===0)await page.screenshot({path:path.join(root,'artifacts/rush-v252/dialogue.png')});await advance(page,'next');}
 await page.waitForFunction(()=>rushVisual.snap().battle==='rush-grass-v252');await page.evaluate(()=>rushVisual.back());
 await page.evaluate(()=>{void rushVisual.allDialogue();});let count=0;while(!await page.evaluate(()=>window.linesDone)){await page.waitForTimeout(150);await advance(page,'next');count++;if(count>60)throw Error('Dialogue did not terminate');}
 const expected=require('../js/rush-v252.json').quests.reduce((n,q)=>n+q.areas.reduce((s,a)=>s+a.pre.length+a.post.length,0),0);assert.ok(count>=expected&&count<=expected+5);assert.deepEqual(errors,[]);console.log('PASS rush visual: actual unlock progress, story entry, confirm/click dialogue, all '+expected+' dialogue lines, 390/360 widths, images');
 }finally{await x.browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
