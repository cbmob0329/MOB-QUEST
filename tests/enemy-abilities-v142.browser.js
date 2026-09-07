// Injected only by the test runner, inside the game closure. Never shipped in index.html.
window.startEnemyAbilitySmokeV142=()=>beginBattle({mode:'training',enemyConfigs:[{id:'s-abyssknight',level:41}],party:[['yusha',99],['jessie',99],['nyoro',99],['tetsu',99]],bg:'back/sea4.png',fallbackBg:'back/rpgmain.png'});
window.enemyAbilitySmokeStateV142=()=>({hp:state.battle?.enemies[0]?.hp,queuePos:state.battle?.queuePos,busy:state.battle?.busy,active:activeAlly()?.id});
window.runEnemyAbilityTestsV142=async function(){
  const results=[],events=[];
  const assert=(condition,message)=>{if(!condition)throw new Error(message||'Assertion failed');};
  const near=(a,b,message)=>assert(Math.abs(a-b)<.00001,`${message||'Values differ'}: ${a} != ${b}`);
  const test=async(name,run)=>{try{Math.random=()=>.5;events.length=0;await run();results.push({name,ok:true});}catch(e){results.push({name,ok:false,error:e.message});}};
  const originalRandom=Math.random;
  // Keep real combat/math/data; remove only UI animation and wall-clock delays.
  renderBattle=()=>{};notice=(text)=>events.push({notice:text});fx=()=>{};floatNumber=()=>{};
  pulseEnemy=()=>{};pulseAllyDamage=()=>{};showCriticalDamageV92=()=>{};showMiss=()=>{};
  delay=async()=>{};fixedDelay=async()=>{};beginEnemyLunge=async()=>{};endEnemyLunge=()=>{};
  actionCutin=async(text)=>events.push({action:text});
  enemySkillImageCutinV134=async(e,spec)=>events.push({skill:spec.special});
  const fixture=(names,turn=1)=>{
    const allies=['yusha','jessie','nyoro','tetsu'].map(id=>buildAlly(player(id),50));
    const enemies=names.map(name=>{
      const template=MOB_DATA.enemyCatalog.find(e=>e.name===name)||trainingEnemyCatalog().find(e=>e.id===name);
      assert(template,`Missing template: ${name}`);
      return buildEnemyFromTemplate(template,template.levelMin||50,4,names.length);
    });
    state.battle={mode:'training',allies,mainIds:allies.map(a=>a.id),superIds:[],reserveIds:[],enemies,enemy:enemies[0],targetEnemyId:enemies[0]?.uid,actingEnemyId:enemies[0]?.uid,turn,config:{},pendingWaveConfigs:[],defeatedEnemies:[],queue:[],queuePos:0,busy:false,finished:false};
    return {b:state.battle,e:enemies[0],a:allies[0],enemies,allies};
  };
  const hit=(a,e,power=.01,type='physical')=>applyEnemyDamageTo(a,e,power,type,0,false,false);
  const forceProc=()=>{Math.random=()=>0;};
  try{
    await test('All 29 requested monster definitions are mapped, including same-name quest variants',()=>{
      assert(Object.keys(ENEMY_ABILITIES_V142).length===29);
      for(const name of Object.keys(ENEMY_ABILITIES_V142)){
        const {e}=fixture([name]);assert(enemyAbilityV142(e).passive||enemyAbilityV142(e).ultimate,name);
      }
      const q=trainingEnemyTemplate('sq-wave-serious');assert(enemyAbilityV142(q).ultimate.every===3);
    });
    for(const [name,ratio,every,type] of [['モブアビスナイト',1.2,2,'physical'],['モブジョーンズ',1.5,3,'physical'],['モブウェイブ',1.3,3,'magic'],['モブクウカイ',1.3,3,'magic']]){
      await test(`${name}: ratio ${ratio}, all targets, every ${every} turns, once per turn`,async()=>{
        const {e,b,allies,a}=fixture([name],every);
        const normal=_calcEnemyDamageV142Base(a,1,type);
        const scaled=await withEnemyRatioV142(ratio,()=>calcEnemyDamage(a,1,type));
        assert(scaled===Math.round(normal*ratio),`Normal ${normal}, scaled ${scaled}`);
        const before=allies.map(a=>a.hp);
        await enemyAction(1,e.uid);await enemyAction(2,e.uid);
        assert(allies.every((a,i)=>a.hp<before[i]),'Must hit entire main party');
        assert(events.filter(x=>x.skill===enemyAbilityV142(e).ultimate.special).length===1,'Ultimate duplicated');
        b.turn=every+1;events.length=0;await enemyAction(1,e.uid);
        assert(!events.some(x=>x.skill===enemyAbilityV142(e).ultimate.special),'Ultimate outside interval');
        b.turn=every*2;events.length=0;await enemyAction(1,e.uid);
        assert(events.some(x=>x.skill===enemyAbilityV142(e).ultimate.special),'Ultimate did not repeat');
      });
    }
    await test('Water Freeze: sleep proc and non-proc, with existing status resistance',async()=>{
      let {e,allies}=fixture(['モブウェイブ'],3);
      // .4 passes the .5 proc and the .15 base resistance for Yusha.
      Math.random=()=>.4;await bossSpecial({...enemyAbilityV142(e).ultimate,v142Ultimate:true});
      assert(allies.some(a=>a.status.sleep>0),'Sleep missing');
      ({e,allies}=fixture(['モブクウカイ'],3));Math.random=()=>.8;
      await bossSpecial({...enemyAbilityV142(e).ultimate,v142Ultimate:true});
      assert(allies.every(a=>!a.status.sleep),'Sleep should fail');
    });
    for(const [name,changes] of [['モブジョーンズ',{atk:1.1,heal:.3}],['モブパレットレオン',{spd:1.2,def:1.2,heal:.3}],['モブミラバスター',{heal:.3,cut:.1}],['グラディモブ',{cut:.1,evade:.1}]]){
      await test(`${name}: HP50% threshold and once-only buffs`,()=>{
        const {e}=fixture([name]);const base={atk:e.atk,spd:e.spd,def:e.def};
        e.hp=e.maxHp*.51;enemyLowHpV142(e);assert(!e.v142LowHpUsed);
        e.hp=e.maxHp*.5;enemyLowHpV142(e);assert(e.v142LowHpUsed);
        near(e.hp,e.maxHp*.5+Math.round(e.maxHp*(changes.heal||0)));
        for(const k of ['atk','spd','def'])if(changes[k])near(e[k],base[k]*changes[k]);
        if(changes.cut)near(e.v142ExtraCut,changes.cut);
        if(changes.evade)near(e.v142ExtraEvade,changes.evade);
        const after=JSON.stringify(e);enemyLowHpV142(e);assert(JSON.stringify(e)===after,'Repeated activation');
      });
    }
    await test('Dragon Soul: 3 actions, 10% cut and all-element resistance, isolated per enemy',()=>{
      const {e,enemies}=fixture(['モブギドラ','モブギドラ']);const resist={...e.elementResist};
      assert(e.actionCount===3);e.hp=e.maxHp*.5;enemyLowHpV142(e);
      near(e.v142ExtraCut,.1);
      for(const key of ['無','火','水','雷','地','風','光','闇']){near(e.elementResist[key],resist[key]+.1);near(enemies[1].elementResist[key],resist[key]);}
    });
    await test('Merakero: low-HP damage cut is conditional and additive with existing shields',()=>{
      const {e,a}=fixture(['モブメラケロ']);
      const base=_calcDamageV142Base(a,'physical',1,0,e).value;
      e.hp=e.maxHp*.51;assert(calcDamage(a,'physical',1,0,e).value===base);
      e.hp=e.maxHp*.5;assert(calcDamage(a,'physical',1,0,e).value===Math.round(base*.7));
      e.shieldTurns=2;e.damageReduction=.2;
      assert(calcDamage(a,'physical',1,0,e).value===Math.round(base*.5/.8));
      e.hp=e.maxHp;assert(calcDamage(a,'physical',1,0,e).value===base);
    });
    await test('Hawk/Tiger evasion and Tiger exact 50% on turns 3,6 only',()=>{
      let {e,a}=fixture(['モブホークⅡ']);near(playerAttackHitChance(a,e),.9);
      let f=fixture(['モブネオタイガー']);e=f.e;a=f.a;
      for(const turn of [1,2,3,4,5,6]){f.b.turn=turn;near(playerAttackHitChance(a,e),turn%3===0?.5:.9);}
      assert(e.evasion===0,'Temporary evasion leaked');
    });
    await test('Wave protects self and allies at 30%; Jurassic protects and queues normal counters at 20%',async()=>{
      let {e,a,enemies,b}=fixture(['モブスライム','モブウェイブ']);forceProc();
      let raw=_calcDamageV142Base(a,'physical',1,0,e).value;
      assert(calcDamage(a,'physical',1,0,e).value===Math.round(raw*.7));
      raw=_calcDamageV142Base(a,'physical',1,0,enemies[1]).value;
      assert(calcDamage(a,'physical',1,0,enemies[1]).value===Math.round(raw*.7));
      ({e,a,enemies,b}=fixture(['モブスライム','モブラプチー','モブティラ']));forceProc();
      raw=_calcDamageV142Base(a,'physical',1,0,e).value;
      assert(calcDamage(a,'physical',1,0,e).value===Math.round(raw*.8*.8),'Independent protection should multiply');
      const out=hit(a,e);assert(out.v142Counters.length===2,'Both living protectors should react');
      assert(b.v142Reactions.length===2);
      Math.random=()=>.5;const before=a.hp;await drainEnemyReactionsV142();assert(a.hp<before);
      assert(b.v142Reactions.length===0&&!b.v142Draining);
      assert(b.actingEnemyId===e.uid,'Counter actor leaked');
    });
    for(const name of ['モブフレザード','モブヨーガンスライム']){
      await test(`${name}: exactly two nullifications, reset in next battle`,()=>{
        let {e,a}=fixture([name]);forceProc();const before=e.hp;
        assert(hit(a,e).v142Negated);assert(hit(a,e).v142Negated);assert(e.hp===before);
        const third=hit(a,e);assert(!third.v142Negated&&third.value>0);
        ({e,a}=fixture([name]));forceProc();assert(hit(a,e).v142Negated);
      });
    }
    for(const [name,healAmount,ratio] of [['モブネオマスター',0,1.5],['モブ魔王',500,0],['ウルモブリリス',1000,1.3]]){
      await test(`${name}: nullify, exact healing and counter ratio`,async()=>{
        const {e,a,b}=fixture([name]);e.hp=e.maxHp-2000;const before=e.hp;forceProc();
        const r=hit(a,e);assert(r.value===0&&r.v142Negated);assert(e.hp===before+healAmount);
        if(ratio){assert(b.v142Reactions[0].ratio===ratio);const hp=a.hp;Math.random=()=>.5;await drainEnemyReactionsV142();assert(a.hp<hp);}
        else assert(!b.v142Reactions?.length);
      });
    }
    await test('Violin: counter targets attacker; death ultimate precedes wave clear and fires only once',async()=>{
      const {e,a,b,allies}=fixture(['モブバイオリン']);const before=a.hp;
      hit(a,e);await drainEnemyReactionsV142();assert(a.hp<before);
      e.hp=0;recordEnemyDefeat(e);recordEnemyDefeat(e);
      assert(b.v142Reactions.length===1&&b.v142Reactions[0].deathUltimate==='ラストコール');
      const hp=allies.map(a=>a.hp);await drainEnemyReactionsV142();
      assert(allies.every((a,i)=>a.hp===hp[i]-Math.round(a.maxHp*.10)));
      assert(allies.every(a=>a.status.poison>0));assert(b.defeatedEnemies.length===1);
    });
    await test('Slime Soul transformation delays defeat/reward, preserves UID, full slime HP once',()=>{
      const {e,b}=fixture(['モブスラミイラ']);const uid=e.uid;e.hp=0;recordEnemyDefeat(e);
      assert(e.id==='g-slime'&&e.hp===e.maxHp&&e.uid===uid);assert(b.defeatedEnemies.length===0);
      e.hp=0;recordEnemyDefeat(e);assert(e.hp===0&&b.defeatedEnemies.length===1);
    });
    await test('Pharaoh survives lethal damage once at HP30%, cut30%, three actions',()=>{
      const {e,b}=fixture(['ミラモブファラオ']);assert(e.actionCount===3);e.hp=0;recordEnemyDefeat(e);
      assert(e.hp===Math.round(e.maxHp*.3)&&e.v142ExtraCut===.3&&e.actionCount===3);
      assert(b.defeatedEnemies.length===0);e.hp=0;recordEnemyDefeat(e);assert(b.defeatedEnemies.length===1);
    });
    await test('Kuukai heals20% and DEF+10 percentage points per actual allied defeat',()=>{
      const {e,enemies,b}=fixture(['モブクウカイ','モブスライム','モブスライム']);
      const def=e.def;e.hp=1;
      for(const ally of enemies.slice(1)){ally.hp=0;recordEnemyDefeat(ally);recordEnemyDefeat(ally);}
      assert(e.hp===1+2*Math.round(e.maxHp*.2));near(e.def,def*1.2);assert(b.defeatedEnemies.length===2);
    });
    await test('Lilith guards heal only the surviving witch on partner defeat',()=>{
      const {e,enemies}=fixture(['モブキラウィッチ','モブララウィッチ','モブスライム']);
      e.hp=1;enemies[2].hp=0;recordEnemyDefeat(enemies[2]);assert(e.hp===1);
      enemies[1].hp=0;recordEnemyDefeat(enemies[1]);assert(e.hp===e.maxHp&&e.v142ExtraCut===.2);
      assert(enemies[1].hp===0,'Defeated partner must not revive');
    });
    await test('Salamander burns physical attackers only, with status resistance',async()=>{
      let {e,a,b}=fixture(['モブサラマンダー']);forceProc();hit(a,e,.01,'physical');
      assert(b.v142Reactions[0]?.status==='burn');Math.random=()=>.5;await drainEnemyReactionsV142();assert(a.status.burn>0);
      ({e,a,b}=fixture(['モブサラマンダー']));forceProc();hit(a,e,.01,'magic');assert(!b.v142Reactions?.length);
    });
    await test('Hawk ailments: both confuse and flinch branches on successful attacks',async()=>{
      for(const kind of ['confuse','stun']){
        const {e,a}=fixture(['モブホークⅡ']);
        // Damage jitter, passive proc, ailment choice, then existing status resistance.
        const randoms=[.5,.05,kind==='confuse'?.2:.8,.9];
        Math.random=()=>randoms.shift()??.9;
        await damageAlly(a,1,'physical',false,e.attribute);
        // The exact RNG draw count is asserted by checking the resulting status below.
        assert(a.status[kind]>0,`${kind} not applied`);
      }
    });
    await test('Kuukai/Palette always AoE; Pyramid Force proc and non-proc',async()=>{
      for(const name of ['モブクウカイ','モブパレットレオン','モブミラアース','モブミラカラミ','モブミラナイト','モブミラタイム']){
        const {allies}=fixture([name]);const hp=allies.map(a=>a.hp);Math.random=()=>.1;
        await bossNormal();assert(allies.every((a,i)=>a.hp<hp[i]),`${name} did not hit all`);
      }
      const {allies}=fixture(['モブミラアース']);const hp=allies.map(a=>a.hp);Math.random=()=>.5;
      await bossNormal();assert(allies.filter((a,i)=>a.hp<hp[i]).length===1,'Failed proc should hit one');
    });
    await test('Yogan has two attacks, exactly one normal AoE, including escort construction',async()=>{
      const {e,allies}=fixture(['モブヨーガンスライム']);assert(e.actionCount===2);
      assert(buildEnemyWave([{id:e.id,escort:true}],4,'','')[0].actionCount===2);
      let hp=allies.map(a=>a.hp);await enemyAction(1,e.uid);assert(allies.filter((a,i)=>a.hp<hp[i]).length===1);
      hp=allies.map(a=>a.hp);await enemyAction(2,e.uid);assert(allies.every((a,i)=>a.hp<hp[i]));
    });
    await test('Umi Denden critical: 20% proc scales normal damage by critical multiplier',async()=>{
      const {e,a}=fixture(['モブウミデンデン']);Math.random=()=>.1;
      await bossNormal();assert(events.some(x=>x.notice==='会心の一撃！'));
      events.length=0;Math.random=()=>.5;await bossNormal();assert(!events.some(x=>x.notice==='会心の一撃！'));
    });
    for(const name of ['モブギドラ','ミラモブファラオ']){
      await test(`${name}: at most one special despite three actions`,async()=>{
        const {e}=fixture([name],3);
        for(let i=1;i<=3;i++)await enemyAction(i,e.uid);
        assert(events.filter(x=>x.skill).length===1,JSON.stringify(events));
      });
    }
    await test('Maou dispels every fifth turn, once, without touching equipment/negative statuses',()=>{
      const {e,b,a}=fixture(['モブ魔王'],4);a.atkBuff=.2;a.atkBuffTurns=3;a.barrier=2;a.status.poison=2;
      const atk=a.atk,equipment=JSON.stringify(a.equipment);
      enemyTurnPassivesV142();assert(a.atkBuff===.2);
      b.turn=5;enemyTurnPassivesV142();assert(a.atkBuff===0&&a.atkBuffTurns===0&&a.barrier===0);
      assert(a.status.poison===2&&a.atk===atk&&JSON.stringify(a.equipment)===equipment);
      a.atkBuff=.1;a.atkBuffTurns=1;enemyTurnPassivesV142();assert(a.atkBuff===.1);
      b.turn=10;enemyTurnPassivesV142();assert(a.atkBuff===0);
    });
    await test('Untargeted enemy damage unchanged and existing Tribe passives still work',()=>{
      let {e,a}=fixture(['モブスライム']);
      assert(calcDamage(a,'physical',1,0,e).value===_calcDamageV142Base(a,'physical',1,0,e).value);
      ({e,a}=fixture(['t-ryugo']));forceProc();const hp=e.hp;assert(hit(a,e).v141KingsRage&&e.hp===hp);
    });
    await test('Misses do not consume reflection or trigger counters',()=>{
      const {e,a,b}=fixture(['モブフレザード']);e.evasion=.8;Math.random=()=>.99;
      assert(hit(a,e).miss);assert(!e.v142Negations&&!b.v142Reactions?.length);
    });
    await test('Round integration: guaranteed action counts and fifth-turn dispel precede player input',async()=>{
      const {b,a}=fixture(['モブギドラ','ミラモブファラオ','モブヨーガンスライム','モブ魔王'],5);
      a.atkBuff=.2;a.atkBuffTurns=3;
      const originalProcessQueue=processQueue;processQueue=async()=>{};
      try{await startRound();}finally{processQueue=originalProcessQueue;}
      assert(a.atkBuff===0,'Round-start dispel not wired');
      for(const [i,count] of [[0,3],[1,3],[2,2]])assert(b.queue.filter(x=>x.enemyId===b.enemies[i].uid).length===count,'Wrong actual queue length');
    });
    await test('Real lethal attack transforms/survives before victory and reward registration',()=>{
      for(const name of ['モブスラミイラ','ミラモブファラオ']){
        const {e,a,b}=fixture([name]);e.hp=1;hit(a,e,100);
        assert(e.hp>0&&b.defeatedEnemies.length===0&&livingEnemies().includes(e),'Lethal attack bypassed survival');
      }
    });
    await test('Poison death triggers Last Call before wave clear',async()=>{
      const {e,a,b}=fixture(['モブバイオリン']);e.hp=1;e.status.poison=1;const hp=a.hp;
      await applyRoundDots();assert(e.hp===0&&a.hp<hp);
      assert(events.some(x=>x.skill==='ラストコール')&&!b.v142Reactions.length);
    });
    await test('Last Call simultaneous party wipe produces defeat instead of false victory',async()=>{
      const {e,allies,b}=fixture(['モブバイオリン']);for(const a of allies)a.hp=1;
      e.hp=0;recordEnemyDefeat(e);await handleEnemyWaveClear();
      assert(b.finished&&b.resultWin===false,'Wipe incorrectly rewarded as victory');
    });
  }finally{Math.random=originalRandom;}
  return results;
};
