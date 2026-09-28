const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{open,root}=require('./story-v172-harness.cjs');
(async()=>{
 const x=await open(`
 window.c242={
  menu(){state.meta.gameCleared=true;state.meta.seenMemosV236=Object.fromEntries(MEMOS_V236.map(m=>[m.id,true]));eventViewV163='story';selectedStoryV179='nightmare';renderEventQuestsV163();$('#trainingFeaturePopup').hidden=false;showScreen('training');},
  async setup(mode){
   document.querySelector('.nm-stage-v239')?.remove();
   const stage=document.createElement('section');stage.className='nm-stage-v239';stage.innerHTML='<div class="nm-background-v239"></div><div class="nm-cast-v239"></div><div class="nm-veil-v239"></div><div class="nm-bubble-v239" hidden><b></b><p></p><span>▾</span></div>';document.body.append(stage);nmStageV239=stage;
   const cast=mode==='seal'?[['yami',50,54],['jessie',28,72],['ace',73,72],['master',50,26]]:mode==='water'?[['yami',25,57],['nepu',75,57]]:mode==='army'?[['dragon',32,58],['gladi',18,78],['mira',20,33],['yami',68,44]]:[['dragon',30,52],['king',74,52],['jessie',40,81],['ace',64,91]];
   await Promise.all(cast.map(([key,x,y])=>nmActorV239(key,x,y)));await Promise.all(Object.keys(NM_FRAMES_V241).map(nmLoadFramesV241));
  },run:mode=>mode==='seal'?nmActionV239('seal'):mode==='water'?nmDuelV239('yami','nepu','water'):mode==='army'?nmDuelV239(['dragon','gladi','mira'],'yami','dark'):nmDuelV239('dragon','king'),
  black:()=>nmActionV239('black'),
  positions(){return [...nmStageV239.querySelectorAll('.nm-actor-v239')].map(e=>[e.dataset.nmActor,e.style.left,e.style.top]);}
 };
 window.dashLog=[];const dash242=nmDashV242;nmDashV242=async function(key,x,y,ms){const r=nmElV239(key).getBoundingClientRect();await dash242(key,x,y,ms);const end=nmElV239(key).getBoundingClientRect();dashLog.push({key,ms,distance:Math.hypot(end.x-r.x,end.y-r.y)});};
 `);
 try{
  const {page}=x,out=path.join(root,'artifacts/nightmare-v242');fs.mkdirSync(out,{recursive:true});
  await page.evaluate(()=>c242.menu());const back=page.locator('[data-nm-back]');
  const colors=await back.evaluate(e=>({fg:getComputedStyle(e).color,bg:getComputedStyle(e).backgroundColor}));
  assert.equal(colors.fg,'rgb(255, 255, 255)');assert.equal(colors.bg,'rgb(36, 54, 79)');
  await page.screenshot({path:path.join(out,'menu.png')});await back.click();assert.equal(await page.locator('[data-nm-back]').count(),0);
  for(const size of [{width:390,height:844},{width:360,height:640}]){
   await page.setViewportSize(size);await page.evaluate(()=>c242.setup('dragon'));const before=await page.evaluate(()=>c242.positions());
   await page.evaluate(()=>{window.currentRun=c242.run('dragon');});
   await page.waitForSelector('.nm-breath-v242');await page.waitForTimeout(650);await page.screenshot({path:path.join(out,`${size.width}-breath.png`)});
   await page.evaluate(()=>currentRun);assert.deepEqual(await page.evaluate(()=>c242.positions()),before);
   const dashes=await page.evaluate(()=>dashLog.splice(0));assert.ok(dashes.length>=8);assert.ok(dashes.filter(d=>d.distance>70&&d.ms<=115).length>=3,JSON.stringify(dashes));
   assert.equal(await page.locator('.nm-dash-trail-v242,.nm-breath-v242,.nm-shock-v242').count(),0);
   await page.evaluate(()=>c242.setup('seal'));await page.evaluate(()=>{window.currentRun=c242.run('seal');});await page.waitForSelector('.nm-seal-v242.binding');
   assert.equal(await page.locator('.nm-orb-v239,.nm-spell-v241,.nm-burst-v239,.nm-impact-v241').count(),0,'seal must not use attack effects');
   await page.screenshot({path:path.join(out,`${size.width}-seal-rising.png`)});await page.evaluate(()=>currentRun);
   assert.equal(await page.locator('.nm-seal-v242.locked').count(),1);assert.equal(await page.locator('.nm-seal-circuit-v242 path').count(),3);
   const bounds=await page.locator('.nm-seal-floor-v242').boundingBox();assert.ok(bounds.x>=0&&bounds.x+bounds.width<=size.width);
   await page.screenshot({path:path.join(out,`${size.width}-seal-locked.png`)});await page.evaluate(()=>c242.black());assert.equal(await page.locator('.nm-seal-v242').count(),0);
  }
  for(const mode of ['water','army']){await page.evaluate(m=>c242.setup(m),mode);const before=await page.evaluate(()=>c242.positions());await page.evaluate(m=>c242.run(m),mode);assert.deepEqual(await page.evaluate(()=>c242.positions()),before);}
  await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>c242.setup('seal'));await page.evaluate(()=>c242.run('seal'));assert.equal(await page.locator('.nm-seal-v242.locked').count(),1);await page.evaluate(()=>c242.black());
  assert.deepEqual(x.errors,[]);console.log('PASS menu/back contrast; 90–115ms traversals; 3 choreographies; fire breath; rune prison without attacks; 2 phone layouts; reduced motion; cleanup.');
 }finally{await x.browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
