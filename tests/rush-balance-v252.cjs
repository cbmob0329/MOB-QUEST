// Isolated real-engine playthroughs. Only presentation/wait functions are replaced.
const fs=require('node:fs'),path=require('node:path'),{open,root}=require('./story-v172-harness.cjs');
const injection=`
window.balance252={};
const noop252=()=>{},asyncNoop252=async()=>{};
delay=fixedDelay=nextPaint=actionCutin=skillSprite=beginEnemyLunge=weaponElementAttackFx=allyStoryCutin=enemyStoryCutin=passiveBeat=reactivePassiveBeat=atlasSequenceV251=projectileV251=normalSequenceV251=healingSequenceV251=asyncNoop252;
endEnemyLunge=notice=floatNumber=fx=pulseEnemy=renderBattle=setCommandDisabled=warmBattleActionAssets=supportMagicFxV109=noop252;
preloadAssets=preloadAssetsSafe=asyncNoop252;confirmStoryChallengeV179=async()=>true;rushDialogueV252=asyncNoop252;
choosePinkReviveTarget=async rows=>rows[0];chooseReplacement=async(label,rows)=>rows[0]?.id;
startBattleLoaded=async config=>beginBattle(config);
const originalFinish252=finishSavannaV174;
finishSavannaV174=async function(b,win){if(b.config.rushV252)balance252.ends.push({area:eventRunV174.area,wave:eventRunV174.wave,turn:b.turn,win,allies:balance252.vitals()});return originalFinish252(b,win);};
balance252.vitals=()=>state.battle.allies.map(a=>({id:a.id,hp:Math.round(a.hp),maxHp:a.maxHp,mp:Math.round(a.mpNow),maxMp:a.maxMp,dead:a.dead}));
balance252.setup=(index,offset,seed)=>{
 let rng=seed>>>0;Math.random=()=>{rng=(Math.imul(rng,1664525)+1013904223)>>>0;return rng/4294967296;};
 state.meta.monsterRushV252={};state.meta.medals={};state.meta.equipment={};state.meta.weapons={};state.meta.armors={};state.meta.figures={};state.meta.figureEquipment={};state.meta.ultimateCooldowns={};state.meta.heroPassive2Unlocked=false;state.meta.moneyFriendsUnlocked=false;state.meta.gameCleared=false;
 state.meta.storyEventsV179=index===3?{phoenix:{clear:true}}:{};state.meta.openingCompleted=true;state.meta.seenMemosV236=Object.fromEntries(MEMOS_V236.map(m=>[m.id,true]));state.test.enabled=false;state.autoBattle=false;
 state.adventure=defaultAdventure();const last=[0,2,4,7][index];state.adventure.worldIndex=last;state.adventure.reportedWorlds=MOB_DATA.adventureWorlds.slice(0,last+1).map(w=>w.id);
 const ids=index===0?['yusha','pink']:index===1?['yusha','pink','desert','denden']:['yusha','pink','money','nyoro','desert','denden'];const lv=RUSH_DATA_V252.quests[index].recommendedLevel+offset;
 const weapons=index<2?{yusha:'01',pink:'01',desert:'02',denden:'04'}:{yusha:'07',pink:'07',money:'10',nyoro:'10',desert:'23',denden:'14'};
 state.party=ids.map(id=>[id,lv]);state.training.party=clone(state.party);for(const [i,id] of ids.entries()){const main=weapons[id],armor=String(i+1).padStart(2,'0');if(!blacksmithShopWeapons().some(w=>w.id===main)||!canEquipWeapon(player(id),weaponById(main)))throw Error('Unavailable weapon '+main);if(!SUBQUEST_AREAS.some(area=>worldCleared(area.worldId)&&area.quests.some(q=>q.reward?.armor===armor)))throw Error('Unavailable armor '+armor);state.meta.weapons[main]=(state.meta.weapons[main]||0)+1;state.meta.armors[armor]=1;state.meta.equipment[id]={main,sub:null,armor,medals:[null,null,null]};}
 eventRunV174=null;state.battle=null;balance252.ends=[];balance252.actions=[];balance252.waves=[];balance252.lastWave='';
 return {quest:RUSH_DATA_V252.quests[index].id,level:lv,seed,party:ids.map(id=>({id,weapon:weaponById(weapons[id]).name,armor:armorById(state.meta.equipment[id].armor).name})),shopSeason:blacksmithWeaponSeasonV128()};
};
balance252.pick=a=>{
 const skills=availableMagicSkillsV104(a).filter(s=>s.cost<=a.mpNow),hurt=livingField().sort((x,y)=>x.hp/x.maxHp-y.hp/y.maxHp),low=hurt[0];
 if(low&&low.hp/low.maxHp<.65){const party=skills.filter(s=>s.support&&['healParty','partyHealCleanse'].includes(s.supportKind));if(hurt.filter(x=>x.hp/x.maxHp<.7).length>=2&&party.length)return ['magic',party.sort((a,b)=>(b.heal||0)-(a.heal||0))[0]];
 const heal=skills.filter(s=>s.supportKind==='healSingle').sort((x,y)=>(y.heal||0)-(x.heal||0))[0];if(heal)return ['magic',{...heal,targetId:low.id}];}
 const e=targetEnemy(),res=el=>1-(e.elementResist?.[el]||0),penalty=el=>e.story179Kind==='phoenix'&&el!=='水'?.4:1;
 const candidates=[{kind:'attack',score:a.atk*res(weaponCombatElement(a))*penalty(weaponCombatElement(a))/Math.max(1,e.def)}];
 for(const s of skills.filter(s=>!s.support&&s.power&&a.mpNow-s.cost>=Math.min(18,a.maxMp*.12)))candidates.push({kind:'magic',payload:s,score:a.mag*s.power*res(s.element)*penalty(s.element)/Math.max(1,e.res)});
 for(const s of availableTechniqueSkillsV104(a).filter(s=>s.power&&s.cost<=a.mpNow&&a.mpNow-s.cost>=Math.min(18,a.maxMp*.12)))candidates.push({kind:'special',payload:s,score:a.atk*s.power*res(s.element)*penalty(s.element)/Math.max(1,e.def)});
 const ult=readyUlts(a).filter(u=>a.mpNow-u.cost>=Math.min(18,a.maxMp*.12));if(ult.length&&e.hp/e.maxHp>.30&&state.battle.turn%3===0)return ['ultimate',ult[0]];
 candidates.sort((x,y)=>y.score-x.score);return [candidates[0].kind,candidates[0].payload];
};
balance252.run=async(index,offset,seed)=>{
 const out=balance252.setup(index,offset,seed);await startRushV252(out.quest);out.initial=balance252.vitals();const started=Date.now();
 for(let count=0;count<1200;count++){
  const b=state.battle,r=eventRunV174;if(!b||!r)throw Error('Run lost');const tag=r.area+':'+r.wave;if(balance252.lastWave!==tag){balance252.lastWave=tag;balance252.waves.push({area:r.area,wave:r.wave,turn:b.turn,allies:balance252.vitals(),enemies:b.enemies.map(e=>({name:e.name,hp:e.hp,atk:e.atk,mag:e.mag,level:e.level}))});}
  if(Date.now()-started>90000)throw Error('Simulation timeout '+out.quest+' '+JSON.stringify({busy:b.busy,turn:b.turn}));
  if(b.busy&&!b.finished){await new Promise(resolve=>setTimeout(resolve,1));count--;continue;}
  if(b.finished){if(!b.rushWonV252||r.area===RUSH_DATA_V252.quests[index].areas.length-1){out.win=!!b.rushWonV252;break;}r.area++;r.wave=0;await startRushAreaV252(r);continue;}
  if(b.turn>100){out.win=false;out.stalled=true;break;}
  const a=activeAlly();if(!a){await processQueue();continue;}const [kind,payload]=balance252.pick(a);balance252.actions.push({area:r.area,wave:r.wave,turn:b.turn,actor:a.id,kind,skill:payload?.name,mp:a.mpNow,target:payload?.targetId});await act(kind,payload);
 }
 out.ends=balance252.ends;out.waves=balance252.waves;out.actions=balance252.actions;out.final=balance252.vitals();out.medals={...state.meta.medals};out.finished=!!state.battle.finished;out.debug={turn:state.battle.turn,busy:state.battle.busy,transition:state.battle.rushTransitionV252,queuePos:state.battle.queuePos,queue:state.battle.queue,enemies:state.battle.enemies.map(e=>({id:e.id,hp:e.hp})),pending:state.battle.pendingWaveConfigs.length};clearRushV252();return out;
};`;
(async()=>{const x=await open(injection),results=[];try{const args=process.argv.slice(2),single=args.includes('--single');for(let i=args.includes('--late')?3:0;i<4;i++)for(const offset of(single?[0]:[-3,0,3]))for(const seed of(single?[25201]:[25201,25202,25203])){console.log('RUN',i,offset,seed);const r=await x.page.evaluate(async([i,o,s])=>balance252.run(i,o,s),[i,offset,seed]);results.push(r);fs.writeFileSync(path.join(root,'artifacts/rush-v252/balance-results.json'),JSON.stringify(results,null,2));console.log(r.quest,r.level,r.win?'WIN':'LOSS','actions='+r.actions.length,JSON.stringify(r.final.map(a=>[a.id,a.hp,a.mp])));}if(x.errors.length)throw Error(x.errors.join('\n'));console.log('DONE '+results.length+' real-engine runs');}finally{await x.browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
