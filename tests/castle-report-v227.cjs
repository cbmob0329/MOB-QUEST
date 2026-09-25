const assert=require('node:assert/strict'),{open}=require('./story-v172-harness.cjs');
const scripts=require('../js/castle-reports-v227.json');
const injection=`
window.results227={lines:[],overflow:[],done:false};
fixedDelay=()=>Promise.resolve();animateV157=()=>Promise.resolve();
const lineTest227=endingLineV222;endingLineV222=function(stage,id,text,...args){results227.lines.push([id,text]);return lineTest227(stage,id,text,...args);};
window.test227={background:(ok)=>{preloadAsset=async src=>ok&&!src.includes('king1');},start:(id)=>{results227={lines:[],overflow:[],done:false};state.meta.openingCompleted=true;state.meta.trainingPlayed=true;state.adventure=defaultAdventure();const i=MOB_DATA.adventureWorlds.findIndex(w=>w.id===id);state.adventure.worldIndex=i;state.adventure.awaitingReport={worldId:id,nextWorldIndex:i+1};showScreen('castle');submitAdventureReport().then(()=>results227.done=true).catch(e=>results227.error=e.stack);},snap:()=>({pending:state.adventure.awaitingReport,reported:state.adventure.reportedWorlds,busy:castleReportBusy,screen:document.querySelector('.screen.active')?.id}),advance:()=>{const stage=document.querySelector('.castle-report-v227'),p=stage?.querySelector('p');if(p&&p.scrollWidth>p.clientWidth+1)results227.overflow.push(p.textContent);stage?.click();}};
`;
(async()=>{const x=await open(injection);try{const{page,errors}=x;
for(const width of [390,320]){await page.setViewportSize({width,height:844});for(const [id,steps]of Object.entries(scripts)){
await page.evaluate(id=>test227.start(id),id);await page.waitForSelector('.castle-report-v227');
if(width===390&&id==='grassland'){const bg=await page.locator('.castle-report-v227').evaluate(e=>getComputedStyle(e).backgroundImage);assert(bg.includes('http://mob.test/back/king1.png'));await page.screenshot({path:'tests/v227-castle-report.png'});}
await page.evaluate(()=>{window.click227=setInterval(()=>test227.advance(),10);});await page.waitForFunction(()=>results227.done||results227.error);await page.evaluate(()=>clearInterval(click227));
const r=await page.evaluate(()=>results227);assert.equal(r.error,undefined,id);assert.deepEqual(r.overflow,[],id+' '+width);assert.deepEqual(r.lines,steps.filter(s=>s[0]!=='arm').map(s=>['talk','last'].includes(s[0])?s.slice(1,3):['king',s[1]]),id);
const s=await page.evaluate(()=>test227.snap());assert.equal(s.pending,null);assert(s.reported.includes(id));assert.equal(s.busy,false);assert.equal(s.screen,'castleScreen');
}}
// Verify both the alternate room and the non-black fallback when assets fail.
await page.route('**/back/king1.png',r=>r.fulfill({status:404,body:''}));
await page.evaluate(()=>{test227.background(true);test227.start('grassland');});await page.waitForSelector('.castle-report-v227');assert((await page.locator('.castle-report-v227').evaluate(e=>e.style.backgroundImage)).includes('back2/003.png'));
await page.evaluate(()=>{window.click227=setInterval(()=>test227.advance(),10);});await page.waitForFunction(()=>results227.done);await page.evaluate(()=>clearInterval(click227));
await page.evaluate(()=>{test227.background(false);test227.start('grassland');});await page.waitForSelector('.castle-report-v227');const fallback=await page.locator('.castle-report-v227').evaluate(e=>getComputedStyle(e).backgroundImage);assert(fallback.includes('gradient'));await page.screenshot({path:'tests/v227-castle-fallback.png'});
assert.deepEqual(errors,[]);console.log('v227 PASS: 12 complete report flows at 390/320px, source dialogue order and one-line fit, progress commits, background and two fallback levels');
}finally{await x.browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
