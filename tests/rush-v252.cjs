const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{open,root}=require('./story-v172-harness.cjs');
const validate=require('../js/rush-validation-v252.js'),data=require('../js/rush-v252.json');
validate(data,{assetExists:p=>fs.existsSync(path.join(root,p))});
for(const mutate of [d=>d.quests.push(d.quests[0]),d=>d.quests[0].areas[0].waves[0].push(d.quests[0].areas[0].waves[0][0]),d=>d.quests[0].reward='bad',d=>d.quests[0].areas[0].waves[0][0].level=121,d=>d.quests[3].unlock.story='bad',d=>d.medals[0].stats.atk=999,d=>d.quests[0].areas[0].pre[0].speaker='missing']){const d=structuredClone(data);mutate(d);assert.throws(()=>validate(d));}
const injection=`window.rushTest={
 data:RUSH_DATA_V252,
 setup(){state.party=['yusha','pink','denden','money','nyoro','jessie'].map(id=>[id,80]);state.training.party=state.party.map(r=>[...r]);state.meta.openingCompleted=true;state.meta.trainingPlayed=true;state.meta.seenMemosV236=Object.fromEntries(MEMOS_V236.map(m=>[m.id,true]));state.test.enabled=false;state.meta.monsterRushV252={};state.meta.storyEventsV179={};state.autoBattle=false;state.meta.medals={};window.rushWorlds=[];worldCleared=id=>rushWorlds.includes(id);confirmStoryChallengeV179=async()=>true;window.rushOriginalRound=startRound;startRound=()=>{};actionCutin=async()=>{};window.rushRealDialogue=rushDialogueV252;rushDialogueV252=async(lines)=>{window.rushLines=(window.rushLines||[]).concat(lines);};},
 locks(){return RUSH_DATA_V252.quests.map(q=>rushOpenV252(q));},
 unlock(){window.rushWorlds=['grassland','rural','magma','tribe'];state.meta.storyEventsV179={phoenix:{clear:true}};},
 menu(){eventViewV163='rush252';renderEventQuestsV163();$('#trainingFeaturePopup').hidden=false;showScreen('training');},
 start:startRushV252,
 snap(){const b=state.battle;return {run:eventRunV174&&{...eventRunV174},finished:b?.finished,enemies:b?.enemies.map(e=>({id:e.id,level:e.level,actions:e.actionCount,min:e.v144ActionMin,max:e.v144ActionMax,hp:e.hp,cut:e.damageReduction,passive:e.v142Passive})),vitals:b?.allies.map(a=>({id:a.id,hp:a.hp,mp:a.mpNow,dead:a.dead})),coins:state.coins,diamonds:state.meta.diamonds,exp:JSON.stringify(state.meta.exp),medals:{...state.meta.medals},records:{...state.meta.monsterRushV252}};},
 async win(){const b=state.battle;for(const e of b.enemies){e.hp=0;recordEnemyDefeat(e);}await handleEnemyWaveClear();},
 lose:()=>finishBattle(false),
 reward:()=>rewardRushV252(eventRunV174,state.battle),
 home:()=>goHome(),
 back:()=>{$('#battleBackBtn').disabled=false;state.battle.busy=false;narrationDialog=async()=> 'yes';return $('#battleBackBtn').onclick();},
 damage(){const a=state.battle.allies[0];a.hp=Math.max(1,a.hp-17);a.mpNow=Math.max(0,a.mpNow-3);return {hp:a.hp,mp:a.mpNow};},
 stats:()=>RUSH_DATA_V252.medals.map(m=>weaponStatBonus({main:null,sub:null,medals:[m.id]})),
 traits:()=>RUSH_DATA_V252.medals.map(m=>({fire:weaponResistance({equipment:{main:null,sub:null,medals:[m.id]}},'火'),earth:weaponResistance({equipment:{main:null,sub:null,medals:[m.id]}},'地'),guard:weaponGuardExtraCut({equipment:{main:null,sub:null,medals:[m.id]}})})),
 async queue(){const previous=processQueue;processQueue=async()=>{};await rushOriginalRound();processQueue=previous;return state.battle.queue.filter(x=>x.type==='enemy').length;},
 async action(){const old={damageAlly,beginEnemyLunge,endEnemyLunge,skillSprite};const hits=[];damageAlly=async(a,p,t,c,e)=>{hits.push({power:p,type:t,element:e});return 1;};beginEnemyLunge=async()=>{};endEnemyLunge=()=>{};skillSprite=async()=>{};try{for(const e of state.battle.enemies)await enemyAction(1,e.uid);return hits;}finally{({damageAlly,beginEnemyLunge,endEnemyLunge,skillSprite}=old);}},
 save:()=>{saveMeta();return {...localStorage};},
 restore:()=>{state.meta=JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>localStorage.getItem(k)?.includes('monsterRushV252'))));return rushTest.locks();}
};`;
(async()=>{const x=await open(injection);try{const {page,errors}=x;await page.evaluate(()=>rushTest.setup());assert.deepEqual(errors,[]);assert.deepEqual(await page.evaluate(()=>rushTest.locks()),[false,false,false,false]);
 await page.evaluate(()=>rushTest.menu());assert.equal(await page.locator('[data-rush-start]:disabled').count(),4);assert.equal(await page.evaluate(()=>rushTest.start('rush-grass-v252')),false);
 await page.evaluate(()=>{rushWorlds=['grassland'];});assert.deepEqual(await page.evaluate(()=>rushTest.locks()),[true,false,false,false]);
 await page.evaluate(()=>{rushWorlds=['grassland','rural','magma','tribe'];});assert.deepEqual(await page.evaluate(()=>rushTest.locks()),[true,true,true,false]);
 await page.evaluate(()=>rushTest.unlock());assert.deepEqual(await page.evaluate(()=>rushTest.locks()),[true,true,true,true]);
 const stats=await page.evaluate(()=>rushTest.stats());assert.equal(stats[0].def,3);assert.equal(stats[0].maxHp,10);assert.equal(stats[1].atk,4);assert.equal(stats[2].mag,4);assert.equal(stats[3].maxHp,20);
 const traits=await page.evaluate(()=>rushTest.traits());assert.equal(traits[0].earth,.03);assert.equal(traits[2].fire,.05);assert.equal(traits[3].guard,.05);
 await page.evaluate(()=>rushTest.menu());fs.mkdirSync(path.join(root,'artifacts/rush-v252'),{recursive:true});await page.screenshot({path:path.join(root,'artifacts/rush-v252/menu.png')});
 // Defeat and interrupted runs must not pay or consume an entry.
 console.log('defeat check');const before=await page.evaluate(()=>rushTest.snap());await page.evaluate(()=>rushTest.start('rush-grass-v252'));assert.equal(await page.evaluate(()=>rushTest.reward()),false);console.log('started first');await page.evaluate(()=>rushTest.lose());await page.locator('[data-rush-next]').click();assert.deepEqual((await page.evaluate(()=>rushTest.snap())).medals,{});
 await page.evaluate(()=>rushTest.start('rush-grass-v252'));console.log('abort check');await page.evaluate(()=>rushTest.win());await page.evaluate(()=>rushTest.back());assert.equal((await page.evaluate(()=>rushTest.snap())).run,null);
 await page.evaluate(()=>rushTest.start('rush-grass-v252'));console.log('home check');await page.evaluate(()=>{window.rushHomeDone=false;rushTest.home().then(()=>window.rushHomeDone=true);});for(let i=0;i<20;i++){if(await page.evaluate(()=>window.rushHomeDone))break;const button=page.getByRole('button',{name:'確認',exact:true});if(await button.isVisible())await button.click();await page.waitForTimeout(200);}await page.waitForFunction(()=>window.rushHomeDone);assert.equal((await page.evaluate(()=>rushTest.snap())).run,null);assert.equal(await page.locator('#homeScreen').evaluate(e=>e.classList.contains('active')),true);
 for(const q of data.quests){console.log(q.id);await page.evaluate(()=>rushTest.menu());assert.equal(await page.evaluate(id=>rushTest.start(id),q.id),true);const concurrent=await page.evaluate(id=>rushTest.start(id),q.id);assert.equal(concurrent,false);
  let expectedVitals=null;
  for(let a=0;a<q.areas.length;a++){
   for(let w=0;w<q.areas[a].waves.length;w++){
    console.log('wave',a,w);const s=await page.evaluate(()=>rushTest.snap());assert.equal(s.run.area,a);assert.equal(s.run.wave,w);assert.equal(s.enemies.length,q.areas[a].waves[w].length);assert.ok(s.enemies.length<=2);
    assert.deepEqual(s.enemies.map(e=>e.level),q.areas[a].waves[w].map(e=>e.level));assert.ok(s.enemies.every(e=>e.actions>=e.min&&e.actions<=e.max&&e.actions<=3));
    if(expectedVitals){assert.equal(s.vitals[0].hp,expectedVitals.hp);assert.equal(s.vitals[0].mp,expectedVitals.mp);}
    const queue=await page.evaluate(()=>rushTest.queue());assert.ok(queue>=s.enemies.length&&queue<=s.enemies.reduce((n,e)=>n+e.max,0));
    await page.evaluate(()=>rushTest.action());expectedVitals=await page.evaluate(()=>rushTest.damage());
    if(q.id==='rush-grass-v252'&&a===0&&w===0)await page.screenshot({path:path.join(root,'artifacts/rush-v252/battle.png')});
    await page.evaluate(()=>rushTest.win());
   }
   await page.locator('[data-rush-next]').waitFor({state:'visible'});
   if(a===q.areas.length-1){assert.equal(await page.evaluate(()=>rushTest.reward()),false);const s=await page.evaluate(()=>rushTest.snap());assert.equal(s.medals[q.reward],1);assert.equal(s.records[q.id],true);await page.screenshot({path:path.join(root,'artifacts/rush-v252/'+q.id+'-clear.png')});}
   await page.locator('[data-rush-next]').click();if(a<q.areas.length-1)await page.waitForFunction(()=>rushTest.snap().finished===false);
  }
  assert.equal(await page.evaluate(id=>rushTest.start(id),q.id),false);
 }
 const after=await page.evaluate(()=>rushTest.snap());assert.equal(after.coins,before.coins);assert.equal(after.diamonds,before.diamonds);assert.equal(after.exp,before.exp);assert.equal(Object.values(after.medals).reduce((a,b)=>a+b,0),4);
 const saved=await page.evaluate(()=>rushTest.save());await page.reload({waitUntil:'load'});assert.deepEqual(await page.evaluate(()=>{worldCleared=()=>true;return rushTest.locks();}),[false,false,false,false]);assert.equal(Object.values((await page.evaluate(()=>rushTest.snap())).medals).reduce((a,b)=>a+b,0),4);
 assert.deepEqual(errors,[]);console.log('PASS rush v252: validation, locks, 14 waves, action queues/actions, vitals, defeat/abort/HOME/retry, finite medals, save reload, no currency/EXP rewards');
 }finally{await x.browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
