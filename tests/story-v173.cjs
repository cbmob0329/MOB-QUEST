const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const {open,root}=require('./story-v172-harness.cjs');
const output=path.join(os.tmpdir(),'mob-quest-v173');fs.mkdirSync(output,{recursive:true});
const injection=`
window.test173={
 seed(){state.adventure=defaultAdventure();state.party=['yusha','pink','desert','denden','money','nyoro','nekoku','tetsu','jessie'].map(id=>[id,65]);state.meta.trainingPlayed=true;state.meta.openingCompleted=true;state.meta.bookHeroDown=false;state.meta.moneyStoryAwayV157=false;state.test.enabled=false;showScreen('adventure');},
 audit(){return {events:STORY_V173.events,battle:STORY_V173.battle,frog:STORY_EVENTS['post:grassland2:1'].steps,last:STORY_EVENTS['post:tribe:3'].steps.at(-1),missing:Object.values(STORY_V173.events).flatMap(e=>e.steps.flatMap(s=>['say','sayRed','guest','guestSlow','guestTransform'].includes(s[0])?[s[1]]:['guests','summonFourV173'].includes(s[0])?s[1]:[])).filter(id=>!storyActorInfo(id).image)};},
 async walk(){
  const base={storySay,storyNarrate,storySayDual,fixedDelay,animateV157},spoken=[];storySay=async(id,text)=>spoken.push([id,text]);storyNarrate=async()=>{};storySayDual=async(a,t,b,u)=>spoken.push([a,t],[b,u]);fixedDelay=async()=>{};animateV157=async()=>{};
  try{for(const [key,e]of Object.entries(STORY_V173.events)){state.adventure.worldIndex=MOB_DATA.adventureWorlds.findIndex(w=>w.id===e.worldId);await openStoryScene(e.worldId,e.area,e.layout||'default',e.extras||[]);await runStorySteps(e.steps);await closeStoryScene(false);}return {spoken,party:state.party.map(x=>x[0]),awakened:state.meta.desertMiraPowerV120};}
  finally{({storySay,storyNarrate,storySayDual,fixedDelay,animateV157}=base);}
 },
 async fade(multi=false){
  showScreen('adventure');await openStoryScene('magma2',3);
  const ids=multi?['m-blizzard','m-flame']:['dragon'];if(multi)await storyShowGuests(ids);else await storyShowGuest('dragon');
  const actors=ids.map(storyAnchor),samples=[];let running=true;
  const opacity=el=>{if(!el||el.hidden)return 0;let value=1;for(let n=el;n&&n!==document.body;n=n.parentElement){const s=getComputedStyle(n);if(n.hidden||s.display==='none'||s.visibility==='hidden')return 0;value*=Number(s.opacity);}return value;};
  function frame(){samples.push(actors.map(opacity));if(running)requestAnimationFrame(frame);}frame();
  await runStorySteps([['fadeV157',ids[0]]]);await new Promise(r=>setTimeout(r,180));running=false;
  const hidden=actors.map(a=>!a.isConnected||a.hidden||a.closest('#storyGuestGroup')?.hidden);await storyShowGuest('dragon');
  return {samples,hidden,reshown:opacity($('#storyGuest'))};
 },
 async soul(){await openStoryScene('neon2',3);await storyShowGuest('boss-neomaster');return storyEnergyTransfer('boss-neomaster','money');},
 async summon(){await openStoryScene('desert2',2);return summonFourV173(['d2-miraearth','d2-mirakarami','d2-miranight','d2-miratime']);},
 menu(type){showScreen('battle');const a=buildAlly(player('yusha'),90);a.mpNow=9999;state.battle={allies:[a],mainIds:[a.id],superIds:[],reserveIds:[],queue:[{type:'ally',id:a.id}],queuePos:0,turn:1};openSkillMenu(type);},
 async battle(){
  const base={enemyStoryCutin,allyStoryCutin,actionCutin,renderBattle,fx,floatNumber,fixedDelay,startRound,storyDarkBattlePulse},lines=[];
  enemyStoryCutin=async(e,t)=>lines.push([e.id,t]);allyStoryCutin=async(id,t)=>lines.push([id,t]);actionCutin=async()=>{};renderBattle=()=>{};fx=()=>{};floatNumber=()=>{};fixedDelay=async()=>{};startRound=async()=>{};storyDarkBattlePulse=async()=>{};
  try{
   const neo=buildEnemyWave([{id:'boss-neomaster',level:65}],4,'','')[0];const original={atk:neo.atk,maxHp:neo.maxHp,reduction:neo.damageReduction};
   state.battle={mode:'adventure',config:{},enemies:[neo],allies:[],turn:1,storyHpFlags:{}};
   neo.hp=Math.floor(neo.maxHp*.69);await checkBattleHpDialogue();const seventy={atk:neo.atk,maxHp:neo.maxHp};await checkBattleHpDialogue();const repeat=neo.atk;
   neo.hp=Math.floor(neo.maxHp*.39);await checkBattleHpDialogue();await checkBattleHpDialogue();const forty=neo.damageReduction;
   const neolineCount=lines.filter(x=>x[0]==='boss-neomaster').length;
   const guards=buildEnemyWave([{id:'d2-miraearth',level:65},{id:'d2-mirakarami',level:65}],4,'','');state.battle={mode:'adventure',config:{},enemies:guards,allies:[],turn:1,storyHpFlags:{}};guards.forEach(e=>e.hp=Math.floor(e.maxHp*.49));await checkBattleHpDialogue();const buffs=guards.map(e=>({atk:e.atkBuff,def:e.defBuff}));
   const area=MOB_DATA.adventureWorlds.find(w=>w.id==='desert2').areas[2],waves=area.nextWaves;
   state.battle={mode:'adventure',config:{},enemies:guards,allies:[],turn:1,pendingWaveConfigs:[waves[0]],bg:'',fallbackBg:''};await spawnNextEnemyWave();const pair=state.battle.enemies.map(e=>({id:e.id,atk:e.atkBuff,def:e.defBuff}));
   const allies=state.party.map(([id])=>({...buildAlly(player(id),65),hp:10}));allies.at(-1).hp=0;allies.at(-1).dead=true;
   state.battle.allies=allies;state.battle.mainIds=allies.slice(0,4).map(a=>a.id);state.battle.superIds=allies.slice(4,6).map(a=>a.id);state.battle.reserveIds=allies.slice(6).map(a=>a.id);state.battle.pendingWaveConfigs=[waves[1]];
   await spawnNextEnemyWave();return {original,seventy,repeat,forty,neolineCount,buffs,pair,revived:state.battle.enemies.map(e=>({hp:e.hp,maxHp:e.maxHp,actions:e.actionCount})),allies:allies.map(a=>({hp:a.hp,maxHp:a.maxHp,dead:a.dead})),lines};
  }finally{({enemyStoryCutin,allyStoryCutin,actionCutin,renderBattle,fx,floatNumber,fixedDelay,startRound,storyDarkBattlePulse}=base);}
 }
};`;
(async()=>{
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');assert(html.includes(fs.readFileSync(path.join(root,'js/game.js'),'utf8').trim()));
 const {browser,page,errors}=await open(injection);
 try{
  await page.waitForFunction(()=>window.__mobV173Runtime&&window.test173);await page.evaluate(()=>test173.seed());
  const audit=await page.evaluate(()=>test173.audit());assert.equal(Object.keys(audit.events).length,35);assert.deepEqual(audit.missing,[]);assert(audit.frog.some(s=>s[1]==='desert'&&s[2]==='アツいカエルだったな'));assert.deepEqual(audit.last,['say','money','あんたちょっと危険ね']);
  assert(audit.events['pre:neon2:3'].steps.some(s=>s[1]==='boss-neomaster'&&s[2]==='これも運命です\nモブマニー\nあなたも元気そうですね'),'a name inside dialogue is not a speaker label');
  for(const multi of [false,true]){const r=await page.evaluate(multi=>test173.fade(multi),multi);for(let col=0;col<r.samples[0].length;col++)for(let i=1;i<r.samples.length;i++)assert(r.samples[i][col]<=r.samples[i-1][col]+.035,'fade must never become visible again');assert(r.hidden.every(Boolean));assert(r.reshown>.95);}
  console.log('PASS corrected speakers; single/multiple guest fades stay hidden and can be shown again');
  const walked=await page.evaluate(()=>test173.walk());assert(walked.party.includes('riro'));assert(walked.awakened);assert(walked.spoken.some(([id,t])=>id==='money'&&t==='なんだかんだ\n勇者パーティーって感じになったわね'));assert(walked.spoken.some(([id,t])=>id==='desert'&&t==='砂漠の王よ\n安らかに・・'));
  const battle=await page.evaluate(()=>test173.battle());assert.equal(battle.seventy.atk,Math.round(battle.original.atk*1.1));assert.equal(battle.seventy.maxHp,Math.round(battle.original.maxHp*1.1));assert.equal(battle.repeat,battle.seventy.atk);assert(Math.abs(battle.forty-battle.original.reduction-.1)<1e-8);assert.equal(battle.neolineCount,2);assert(battle.buffs.every(e=>e.atk===.2&&e.def===.2));assert(battle.pair.every(e=>e.atk===.2&&e.def===.2));assert.equal(battle.revived.length,4);assert(battle.revived.every(e=>e.hp===Math.round(e.maxHp*.3)&&e.actions===1));assert(battle.allies.filter(a=>!a.dead).every(a=>a.hp===Math.min(a.maxHp,10+Math.round(a.maxHp*.3))));assert.equal(battle.allies.at(-1).hp,0);assert(battle.lines.some(([id,t])=>id==='nyoro'&&t==='復活したニョロ！'));
  console.log('PASS 35 scenes; Ri-ro joins; Desert awakening retained; Neo thresholds and 4-enemy revival/healing');
  for(const width of [390,320]){await page.setViewportSize({width,height:844});for(const type of ['magic','special','ultimate']){await page.evaluate(type=>test173.menu(type),type);const descriptions=page.locator('#skillMenu .skill-item small');assert(await descriptions.count());const layout=await descriptions.evaluateAll(els=>els.map(e=>({font:parseFloat(getComputedStyle(e).fontSize),scroll:e.scrollWidth,width:e.clientWidth})));assert(layout.every(e=>e.font>=14&&e.scroll<=e.width+1),type+' descriptions');if(width===390)await page.screenshot({path:path.join(output,type+'.png')});}}
  assert.deepEqual(errors,[]);console.log('PASS skill descriptions at 320px/390px; no browser errors');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
