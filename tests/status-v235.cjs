const assert=require('node:assert/strict'),fs=require('node:fs'),{open}=require('./story-v172-harness.cjs');
const injection=`
window.test235=async()=>{
 state.party=[['yusha',40],['pink',40]];state.meta.openingCompleted=true;state.meta.trainingPlayed=true;
 const originalRound=startRound;startRound=()=>{};fixedDelay=delay=async()=>{};actionCutin=async()=>{};skillSprite=weaponElementAttackFx=async()=>{};notice=floatNumber=fx=()=>{};passiveChance=()=>false;checkBattleHpDialogue=checkSpecialRevives=async()=>{};
 await beginBattle({mode:'training',party:state.party,enemyConfigs:[{id:'n2-tiger',level:40},{id:'n2-kodora',level:40}]});
 const b=state.battle,[a,t]=b.allies,[e,f]=b.enemies;const out={};
 const clear=()=>{for(const u of [a,t,e,f]){u.status={poison:0,burn:0,sleep:0,paralyze:0,confuse:0,stun:0};u.hp=u.maxHp=10000;u.dead=false;u.figureEffects={};u.evasion=0;u.barrier=0;}b.finished=false;b.busy=false;b.actingEnemyId=e.uid;b.enemy=e;};clear();
 a.status.poison=a.status.burn=e.status.poison=e.status.burn=1;a.status.sleep=e.status.sleep=1;
 for(let i=0;i<5;i++)await applyRoundDots();out.dot={ally:a.hp,enemy:e.hp,as:{...a.status},es:{...e.status}};
 clear();const speed=effective('spd',a),espeed=initiativeSpeed({type:'enemy',enemyId:e.uid,action:1});a.status.burn=e.status.burn=1;out.speed=[effective('spd',a)/speed,initiativeSpeed({type:'enemy',enemyId:e.uid,action:1})/espeed];
 clear();a.figureEffects={evade:.65,aoeEvade:1};e.evasion=.8;a.status.paralyze=e.status.paralyze=1;out.evade=[incomingEvadeV232(a),playerAttackHitChance(a,e)];
 const random=Math.random;Math.random=()=>.99;await enemyAction(1,e.uid);await superSubAction(a);out.paralyze=[a.status.paralyze,e.status.paralyze];
 clear();a.status.sleep=e.status.sleep=1;await enemyAction(1,e.uid);await superSubAction(a);endRound=async()=>{};b.queue=[{type:'ally',id:a.id}];b.queuePos=0;await processQueue();out.sleep=[a.status.sleep,e.status.sleep,b.queuePos];
 // Exercise the real HP damage entry points with sleep/confusion on both sides.
 clear();a.status.sleep=a.status.confuse=e.status.sleep=e.status.confuse=1;Math.random=()=>.29;
 await damageAlly(a,1);applyEnemyDamageTo(t,e,1,'physical');out.wake=[a.status.sleep,a.status.confuse,e.status.sleep,e.status.confuse];
 clear();a.status.confuse=e.status.confuse=1;Math.random=()=>.30;await damageAlly(a,1);applyEnemyDamageTo(t,e,1,'physical');out.stillConfused=[a.status.confuse,e.status.confuse];
 clear();a.status.sleep=e.status.sleep=1;a.barrier=1;Math.random=()=>.99;await damageAlly(a,1);e.evasion=.8;Math.random=()=>.99;applyEnemyDamageTo(t,e,1,'physical');out.noHit=[a.status.sleep,e.status.sleep];
 clear();a.status.poison=e.status.poison=1;b.weaponAttackContext={sure:true};Math.random=()=>.099;out.poisonMiss=[calcDamage(a,'magic',1,0,e).miss,await damageAlly(t,1)];Math.random=()=>.10;out.poisonHit=calcDamage(a,'physical',1,0,e).miss===true;out.incomingHit=await damageAlly(t,1)>0;
 clear();Math.random=()=>.1;a.status.confuse=1;const oldCalc=calcDamage;calcDamage=()=>({value:100,miss:false});await confusedActionV235(a);out.friendly=[a.hp,t.hp,e.hp];calcDamage=oldCalc;
 clear();Math.random=()=>.9;a.status.confuse=1;b.queue=[{type:'ally',id:a.id}];b.queuePos=0;b.busy=false;await processQueue();out.enemyNormal={enemyHit:e.hp<e.maxHp||f.hp<f.maxHp,friendHit:a.hp<10000||t.hp<10000,queue:b.queuePos,confuse:a.status.confuse};
 clear();Math.random=()=>.1;e.status.confuse=1;const oldEnemyCalc=calcEnemyDamage;calcEnemyDamage=()=>100;await enemyAction(1,e.uid);out.enemyFriendly=[e.hp,f.hp,a.hp];calcEnemyDamage=oldEnemyCalc;
 clear();Math.random=()=>.9;e.status.confuse=1;await enemyAction(1,e.uid);out.enemyConfusedAttack=a.hp<10000||t.hp<10000;
 clear();Math.random=()=>.5;out.custard=[];
 for(const key of ['custard','riscustard'])for(let d=0;d<3;d++){const template=customTemplateV179(key,d),enemy=buildEnemyFromTemplate(template,template.levelMin,2,1);out.custard.push([enemy.actionCount,enemy.v144ActionMin,enemy.v144ActionMax]);}
 clear();out.items=[];for(const k of ['poison','burn','paralyze']){a.status[k]=1;const item=GAME_ITEMS.find(i=>i.type==='cure'&&i.status===k);addItem(item.id,1);const before=itemCount(item.id);const used=await performBattleItem(t,{id:item.id,targetId:a.id});out.items.push({used,status:a.status[k],spent:before-itemCount(item.id)});}
 // Actual round construction and skill announcements, not just template values.
 clear();out.custardTurns=[];const queueBase=processQueue;processQueue=async()=>{};out.names=[];actionCutin=async text=>out.names.push(text);beginEnemyLunge=async()=>{};endEnemyLunge=()=>{};
 for(const key of ['custard','riscustard']){const template=customTemplateV179(key,0),enemy=buildEnemyFromTemplate(template,template.levelMin,2,1);b.enemies=[enemy];b.enemy=enemy;b.actingEnemyId=enemy.uid;b.turn=1;enemy.syrupNextV179=99;await originalRound();out.custardTurns.push(b.queue.filter(q=>q.type==='enemy').length);await enemyAction(1,enemy.uid);}
 processQueue=queueBase;Math.random=random;return out;
};`;
(async()=>{const x=await open(injection);try{const r=await x.page.evaluate(()=>test235());console.log(JSON.stringify(r,null,2));assert.equal(r.dot.ally,7500);assert.equal(r.dot.enemy,7500);for(const s of [r.dot.as,r.dot.es])for(const k of ['sleep','poison','burn'])assert.equal(s[k],1);assert.deepEqual(r.speed,[.5,.5]);assert.deepEqual(r.evade,[0,1]);assert.deepEqual(r.paralyze,[1,1]);assert.deepEqual(r.sleep,[1,1,1]);assert.deepEqual(r.wake,[0,0,0,0]);assert.deepEqual(r.stillConfused,[1,1]);assert.deepEqual(r.noHit,[1,1]);assert.deepEqual(r.poisonMiss,[true,0]);assert.equal(r.poisonHit,false);assert(r.incomingHit);assert.deepEqual(r.friendly,[10000,9950,10000]);assert.deepEqual(r.enemyNormal,{enemyHit:true,friendHit:false,queue:1,confuse:1});assert.deepEqual(r.enemyFriendly,[10000,9950,10000]);assert(r.enemyConfusedAttack);assert(r.custard.every(x=>x.every(n=>n===3)));assert.deepEqual(x.errors,[]);
 assert.deepEqual(r.items,Array.from({length:3},()=>({used:true,status:0,spent:1})));assert.deepEqual(r.custardTurns,[3,3]);assert.equal(r.names.filter(s=>s==='カスタード・コモク').length,2);
 const story=require('../js/story-v231.json');for(const e of Object.values(story.events))assert(!e.steps.some(s=>s[0]==='say'&&/^(中ボス表示|ボス表示)$/.test(s[2])));assert(!fs.readFileSync('js/update-v179.js','utf8').includes('カスタード・クロス'));console.log('PASS persistent ailments, DOT percentages, speed/evade, hit cures, poison boundary, confusion turns/damage, cure items, custard round/skill and dialogue');
}finally{await x.browser.close();}})().then(()=>process.exit(0),e=>{console.error(e);process.exit(1)});
