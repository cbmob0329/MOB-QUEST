const assert=require('assert/strict'),fs=require('fs'),{open}=require('./story-v172-harness.cjs');
const out=require('node:path').join(__dirname,'../artifacts/v262');fs.mkdirSync(out,{recursive:true});
(async()=>{const x=await open(`window.test262={
 check(){
  const magma=STORY_EVENTS['arrival:magma'].steps,grass=STORY_EVENTS['arrival:grassland2'].steps;
  state.party=['yusha','pink','money','desert','denden','nyoro','tetsu'].map(id=>[id,50]);state.meta.exp={};state.test.enabled=false;
  calcBattleRewards=()=>({exp:100,coin:0});partyFigureRewardBonus=()=>0;
  const b={mainIds:['yusha','pink','money','desert'],superIds:['denden','nyoro'],allies:[],config:{}};
  applyProgressRewards(b);
  return {magma,grass,exp:state.meta.exp,checkpoint:storyJoinsForCheckpoint(MOB_DATA.adventureWorlds.findIndex(w=>w.id==='magma'),1)};
 },async stage(mode){
  document.querySelector('.nm-stage-v239')?.remove();const stage=document.createElement('section');stage.className='nm-stage-v239';stage.innerHTML='<div class="nm-background-v239"></div><div class="nm-cast-v239"></div><div class="nm-veil-v239"></div><div class="nm-bubble-v239" hidden><b></b><p></p><span>▾</span></div>';document.body.append(stage);nmStageV239=stage;
  const cast=mode==='seal'?[['yami',50,54],['jessie',28,72],['ace',73,72],['master',50,26]]:[['dragon',28,50],['king',76,50]];
  await Promise.all(cast.map(([key,x,y])=>nmActorV239(key,x,y)));await nmLoadAtlasV262();
 },run:mode=>mode==='seal'?nmSealV242():nmDuelV239('dragon','king'),
 atlas(){const wrap=document.createElement('div');wrap.id='atlas262';wrap.style.cssText='position:fixed;inset:0;z-index:999999;background:#12202c;display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(6,1fr)';for(let r=0;r<6;r++)for(let f=0;f<4;f++){const cell=document.createElement('div');cell.style.cssText='position:relative;border:1px solid #445';const s=nmSpriteV262(r,f,125);s.style.left='50%';s.style.top='50%';cell.append(s);wrap.append(cell);}document.body.append(wrap);},
 async inset(){document.querySelector('.nm-stage-v239')?.remove();showScreen('adventure');await openStoryScene('demonCastle2',3);await finaleStoryDirectionV248('草原の背景を小さく');return [...document.querySelectorAll('.finale-inset-v248')].map(e=>({width:e.clientWidth,src:e.src}));}
};`);
try{
 const {page}=x;const c=await page.evaluate(()=>test262.check());assert.deepEqual(c.exp,{yusha:100,pink:100,money:100,desert:100,denden:70,nyoro:70,tetsu:50});assert.deepEqual(c.magma.filter(s=>s[0]==='join').map(s=>s[1]),['nyoro','tetsu']);assert.ok(!c.grass.some(s=>s[0]==='join'));assert.ok(c.checkpoint.includes('tetsu'));
 await page.setViewportSize({width:560,height:840});await page.evaluate(()=>test262.atlas());await page.screenshot({path:out+'/atlas.png'});await page.locator('#atlas262').evaluate(e=>e.remove());
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>test262.stage('dragon'));await page.evaluate(()=>{window.run262=test262.run('dragon');});await page.waitForSelector('.nm-breath-v242');await page.waitForTimeout(850);await page.screenshot({path:out+'/dragon.png'});await page.evaluate(()=>run262);assert.equal(await page.locator('.nm-depth-v262').count(),0);
 await page.evaluate(()=>test262.stage('seal'));await page.evaluate(()=>{window.run262=test262.run('seal');});await page.waitForSelector('.nm-seal-v242.binding');await page.screenshot({path:out+'/seal.png'});await page.evaluate(()=>run262);assert.equal(await page.locator('.nm-seal-v242.locked .nm-seal-art-v262').count(),1);
 const inset=await page.evaluate(()=>test262.inset());assert.ok(inset[0].width>300);console.log('inset',inset);await page.screenshot({path:out+'/inset.png'});assert.deepEqual(x.errors,[]);console.log('PASS exp 100/70/50, magma dual recruit, grassland no recruit, checkpoint, dragon/seal effects cleanup, page errors');
}finally{await x.browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});



