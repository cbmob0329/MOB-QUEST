const assert=require('node:assert/strict'),fs=require('node:fs'),{open}=require('./story-v172-harness.cjs');
const injection=`
window.test232={
 run:async()=>{
  state.meta.openingCompleted=true;state.meta.trainingPlayed=true;state.party=[['yusha',30],['pink',30]];
  const a={...buildAlly(player('yusha'),30),equipment:{main:null,sub:null,medals:[]},figureEffects:{},soulEffectsV218:[]},e=buildEnemyWave([{id:'n2-tiger',level:30}],4,'','')[0];e.evasion=.3;
  state.battle={allies:[a],enemies:[e],mainIds:[a.id],superIds:[],reserveIds:[],queue:[],queuePos:0,turn:1,config:{},actingEnemyId:e.uid};
  const result={base:playerAttackHitChance(a,e)};a.figureEffects.accuracy=.1;result.old=playerAttackHitChance(a,e);a.figureEffects.enemyEvadeDownV227=.1;result.stack=playerAttackHitChance(a,e);result.unchanged=e.evasion;
  a.figureEffects={};e.evasion=.8;result.high=playerAttackHitChance(a,e);a.figureEffects.accuracy=.9;result.floor=playerAttackHitChance(a,e);a.soulEffectsV218=[{key:'accuracy',value:-.1,until:3}];state.battle.weaponAttackContext={sure:true};result.sure=playerAttackHitChance(a,e);state.battle.weaponAttackContext={};a.figureEffects={};e.evasion=0;result.debuff=playerAttackHitChance(a,e);state.battle.turn=3;result.expired=playerAttackHitChance(a,e);
  a.soulEffectsV218=[];e.evasion=.3;a.figureEffects={gunAccuracy:.2};a.weapon='銃';result.gun=playerAttackHitChance(a,e);a.weapon='剣';result.notGun=playerAttackHitChance(a,e);
  e.soulEffectsV218=[{key:'accuracy',value:-.15,until:5}];a.figureEffects={};result.incoming=incomingEvadeV232(a);
  const before=FIGURES.filter(f=>f.traitText?.includes('相手の回避率')).map(f=>({text:f.traitText,parsed:parseFigureEffectText(f.traitText)}));result.figures=before;
  result.oldParsed=parseFigureEffectText('命中率+10%').accuracy;result.newParsed=parseFigureEffectText('相手の回避率-10%').accuracy;result.existingParsed=parseFigureEffectText('敵の回避率-20%').enemyEvadeDownV227;
  result.ui=equipmentDetailMarkup('yusha')+figureEffectStatusMarkup('yusha');
  const f=FIGURES.find(f=>f.soul?.name==='サバイバルステップ');a.figureEffects={};a.soulEffectsV218=[];e.soulEffectsV218=[];const saved={notice,renderBattle,delay,fixedDelay};notice=renderBattle=()=>{};delay=fixedDelay=async()=>{};try{await applySoulTextV218(f,a,[a],[e],f.soul.text);result.soul=soulEffectValueV218(a,'accuracy');result.soulText=f.soul.text;}finally{({notice,renderBattle,delay,fixedDelay}=saved);}
  const talk=facilityTalk;let spoken;facilityTalk=async text=>spoken=text;state.meta.finalBossDefeated=true;state.meta.gameCleared=false;try{await openHomeAction('shop');}finally{facilityTalk=talk;}result.spoken=spoken;return result;
 }
};`;
(async()=>{const x=await open(injection);try{const r=await x.page.evaluate(()=>test232.run()),near=(actual,expected)=>assert(Math.abs(actual-expected)<1e-9,actual+' != '+expected);near(r.base,.7);near(r.old,.8);near(r.stack,.9);near(r.unchanged,.3);near(r.high,.2);near(r.floor,1);near(r.sure,1);near(r.debuff,.9);near(r.expired,1);near(r.gun,.9);near(r.notGun,.7);near(r.incoming,.15);near(r.oldParsed,.1);near(r.newParsed,.1);near(r.existingParsed,.2);near(r.soul,.25);assert(r.figures.length>0);assert(!r.ui.includes('命中'));assert(!r.soulText.includes('命中'));assert.equal(r.spoken,'お城へ向かいましょう！');assert.deepEqual(x.errors,[]);assert(!fs.readFileSync('index.html','utf8').includes('お城へ向かおう！'));console.log('PASS evade reduction, legacy/new/combined traits, 0% floor, guaranteed hits, gun condition, timed effects/expiry, incoming enemy debuff, SOUL application, UI wording, Pink report lock dialogue');}finally{await x.browser.close();}})().then(()=>process.exit(0),e=>{console.error(e);process.exit(1)});
