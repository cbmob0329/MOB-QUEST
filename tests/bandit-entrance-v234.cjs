const assert=require('node:assert/strict'),fs=require('node:fs'),{open}=require('./story-v172-harness.cjs');
const injection=`
window.test234={checks:[],samples:[],setup(){state.party=['yusha','pink','money','nyoro'].map(id=>[id,70]);state.meta.openingCompleted=true;state.meta.trainingPlayed=true;startRound=()=>{};fixedDelay=delay=async()=>{};actionCutin=async()=>{test234.checks.push({phase:'cutin',hidden:getComputedStyle($('#enemyArea')).visibility==='hidden'});await nextPaint();};},
async battle(d,a){await beginBattle({mode:'training',storyV179:'bandits',party:state.party,waves:banditWavesV230(d,a),bg:'back2/05.png'});await nextPaint();return state.battle.enemies.map(e=>{const el=enemyVisual(e.uid),r=el.getBoundingClientRect();return{key:e.banditV230,kind:enemySizeClass(e),w:r.width,h:r.height,x:r.left,y:r.top,loaded:el.complete&&el.naturalWidth>0,category:e.category};});},
async wave(){await spawnNextEnemyWave();},
async story(mode){showScreen('adventure');await openStoryScene('desert',0);$('#storyScene').classList.add('bandit-story-v230');await banditEnterV230(['hari','pue','eri','queen','onbu'],mode);return [...$('#storyGuestGroup').children].map(el=>({opacity:getComputedStyle(el).opacity,visibility:getComputedStyle(el).visibility}));}};
const animation234=animateV157;
animateV157=async function(el,frames,ms){if(el.matches('.enemy-unit,.story-guest-multi')){
 const story=el.matches('.story-guest-multi');test234.checks.push({phase:story?'story':'battle',hidden:getComputedStyle(el).visibility==='hidden',opacity:getComputedStyle(el).opacity,first:frames[0].opacity});
 const job=animation234(el,frames,ms);await new Promise(r=>requestAnimationFrame(r));test234.samples.push({phase:story?'story':'battle',opacity:+getComputedStyle(el).opacity,animations:el.getAnimations().length});return job;
}return animation234(el,frames,ms);};
`;
(async()=>{const x=await open(injection);try{
 const{page}=x;await page.evaluate(()=>test234.setup());fs.mkdirSync('artifacts/bandits-v234',{recursive:true});
 for(const viewport of [{width:390,height:844},{width:360,height:640}]){
  await page.setViewportSize(viewport);
  for(const[d,a]of [[1,2],[2,0],[2,1],[2,2],[2,3]]){
   const sizes=await page.evaluate(([d,a])=>test234.battle(d,a),[d,a]);
   for(const s of sizes){assert(s.loaded);assert(s.w<=180&&s.h<=200,JSON.stringify(s));assert(s.x>=-1&&s.x+s.w<=viewport.width+1,JSON.stringify(s));if(['hari','pue','eri','onbu','queen'].includes(s.key))assert.equal(s.kind,'normal');}
   await page.screenshot({path:'artifacts/bandits-v234/battle-'+viewport.height+'-'+d+'-'+a+'.png'});
   if(d===2&&a===1)await page.evaluate(()=>test234.wave());
  }
 }
 for(const mode of ['run','walk','jump','dance','fast']){const s=await page.evaluate(m=>test234.story(m),mode);assert(s.every(x=>x.opacity==='1'&&x.visibility==='visible'));}
 const out=await page.evaluate(()=>({checks:test234.checks,samples:test234.samples}));
 assert(out.checks.filter(c=>c.phase==='cutin').every(c=>c.hidden));
 assert(out.checks.filter(c=>c.phase!=='cutin').every(c=>c.hidden&&c.opacity==='0'&&c.first===0),JSON.stringify(out.checks));
 assert(out.samples.every(c=>c.animations>0&&c.opacity<.2),JSON.stringify(out.samples));assert.deepEqual(x.errors,[]);
 console.log('PASS first battle / reinforcement / five story entrances hidden until animation; all Inferno formations and Horapue fit both viewports');
}finally{await x.browser.close();}})().then(()=>process.exit(0),e=>{console.error(e);process.exit(1)});
