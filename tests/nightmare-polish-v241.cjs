const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{open,root}=require('./story-v172-harness.cjs');
(async()=>{
 const x=await open(`
 window.nmCheck={
  async setup(){
   const stage=document.createElement('section');stage.className='nm-stage-v239';stage.innerHTML='<div class="nm-background-v239"></div><div class="nm-cast-v239"></div><div class="nm-veil-v239"></div><div class="nm-bubble-v239" hidden><b></b><p></p><span>▾</span></div>';document.body.append(stage);nmStageV239=stage;
   window.measureChecks=[];const paint=nextPaint;
   nextPaint=async()=>{const b=stage.querySelector('.nm-bubble-v239');if(!b.hidden)measureChecks.push(getComputedStyle(b).visibility);await paint();};
   storyAdvanceWait=()=>new Promise(resolve=>window.nextLine=resolve);
  },action:op=>nmActionV239(op),say:(k,t)=>nmSayV239(k,t),
  clear(){nmStageV239.querySelector('.nm-cast-v239').replaceChildren();},
  async sizes(){const result={};for(const key of ['dragon','king','nepu','mira','jones','gladi','wave','jessie','ace','money','yami']){const el=await nmActorV239(key,50,70);result[key]=el.getBoundingClientRect().width;}return result;},
  async duel(){await nmDuelV239('dragon','king');},
  cast:()=>[...nmStageV239.querySelectorAll('.nm-actor-v239:not([hidden])')].map(el=>{const r=el.getBoundingClientRect(),s=nmStageV239.getBoundingClientRect();return{id:el.dataset.nmActor,left:r.x-s.x,right:r.right-s.x,top:r.y-s.y,bottom:r.bottom-s.y,width:r.width,stage:s.width};})
 };`);
 try{
  const {page}=x,out=path.join(root,'artifacts/nightmare-v241');fs.mkdirSync(out,{recursive:true});await page.evaluate(()=>nmCheck.setup());
  for(const size of [{width:360,height:640},{width:390,height:844}]){
   await page.setViewportSize(size);
   await page.evaluate(()=>nmCheck.clear());
   const sizes=await page.evaluate(()=>nmCheck.sizes());
   assert.ok(sizes.dragon>sizes.king&&sizes.king>sizes.nepu&&sizes.nepu>sizes.jones&&sizes.jones>sizes.wave&&sizes.wave>sizes.money);
   for(const [a,b]of [['nepu','mira'],['jones','gladi'],['wave','jessie'],['wave','ace'],['money','yami']])assert.ok(Math.abs(sizes[a]-sizes[b])<.1);
   await page.evaluate(()=>nmCheck.clear());
   for(const op of ['invaders','knights','kingDuelSetup','threeArmies','stepBack','faceYami']){
    if(op==='kingDuelSetup')await page.evaluate(()=>nmCheck.clear());
    if(op==='threeArmies')await page.evaluate(async()=>{await nmCheck.action('moneyLight');await nmCheck.action('transform');});
    if(op==='faceYami')await page.evaluate(()=>{for(const key of ['dragon','gladi','mira'])document.querySelector('[data-nm-actor="'+key+'"]')?.remove();});
    await page.evaluate(op=>nmCheck.action(op),op);
    const cast=await page.evaluate(()=>nmCheck.cast());
    for(const c of cast){assert.ok(c.left>=0&&c.right<=c.stage+.1&&c.top>=0&&c.bottom<=size.height,JSON.stringify(c));if(['mira','king','gladi','jones','dragon'].includes(c.id))assert.ok(c.width>=100,JSON.stringify(c));}
    await page.screenshot({path:path.join(out,`${size.width}-${op}.png`)});
   }
  }
  for(const [key,text]of [['jones','間に合ったか！'],['king','下がっていろ！\nこいつはただのモンスターじゃない！'],['mira','魔王様の命により\nお前たちには消えてもらう！']]){
   await page.evaluate(([key,text])=>{window.nextLine=null;window.sayPromise=nmCheck.say(key,text);},[key,text]);
   await page.waitForFunction(()=>!!window.nextLine);
   assert.equal(await page.locator('.nm-bubble-v239').evaluate(b=>getComputedStyle(b).opacity),'1');
   await page.screenshot({path:path.join(out,`bubble-${key}.png`)});
   await page.evaluate(async()=>{nextLine();await sayPromise;});
   assert.equal(await page.locator('.nm-bubble-v239').evaluate(b=>getComputedStyle(b).display),'none');
  }
  assert.ok((await page.evaluate(()=>measureChecks)).every(v=>v==='hidden'));
  await page.evaluate(()=>nmCheck.clear());await page.evaluate(()=>nmCheck.action('kingDuelSetup'));
  await page.evaluate(()=>{window.duelPromise=nmCheck.duel();});
  await page.waitForTimeout(400);await page.screenshot({path:path.join(out,'duel-impact.png')});
  await page.evaluate(()=>duelPromise);
  assert.equal(await page.locator('.nm-strike-v241,.nm-impact-v241,.nm-orb-v239,.nm-burst-v239').count(),0);
  assert.deepEqual(x.errors,[]);console.log('PASS real animations, hidden dialogue measurement, actor bounds/sizes, duel FX cleanup.');
 }finally{await x.browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
