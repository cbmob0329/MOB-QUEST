// UPDATE_V194_BEGIN
/* v194: clean Demon Castle AREA3 Lilith flow.
   Built from stable v184.  No v185-v193 Lilith patches are carried forward.
   One authored path only: sisters reveal -> dialogue -> center formation button -> split -> battle. */
;(()=>{
const LILITH_PRE_KEY_V194='pre:demonCastle:2';
const LILITH_SPLIT_OPT_V194={
  storageKey:'lilithSplit',
  title:'リリス四姉妹戦 パーティー編成',
  aEnemies:'モブリリス / モブヘルリリス / モブキリンリリス',
  bEnemies:'モブクフリリス / モブリヴァリリス'
};

function ensureLilithFormationGateV194(){
  let gate=document.getElementById('lilithFormationGateV194');
  if(!gate){
    gate=document.createElement('div');
    gate.id='lilithFormationGateV194';
    gate.hidden=true;
    Object.assign(gate.style,{
      position:'fixed',inset:'0',zIndex:'2147483640',display:'none',
      alignItems:'center',justifyContent:'center',padding:'20px',boxSizing:'border-box',
      background:'rgba(0,0,0,.18)',pointerEvents:'auto'
    });
    gate.innerHTML=`<button type="button" data-lilith-formation-v194 style="width:min(86vw,350px);min-height:92px;border:4px solid #f4cce4;border-radius:20px;background:#6f2d59;color:#fff;box-shadow:0 14px 36px rgba(0,0,0,.58),inset 0 0 0 2px rgba(255,255,255,.18);font-family:inherit;font-weight:900;letter-spacing:.04em;padding:12px 16px;touch-action:manipulation;-webkit-tap-highlight-color:transparent"><span style="display:block;font-size:21px;line-height:1.2">パーティー編成</span><small style="display:block;margin-top:6px;font-size:11px;line-height:1.35;opacity:.94">A / B パーティーを決める</small></button>`;
    document.body.appendChild(gate);
  }
  return gate;
}

async function waitLilithFormationGateV194(){
  const gate=ensureLilithFormationGateV194();
  const btn=gate.querySelector('[data-lilith-formation-v194]');
  const bubble=$('#storyBubble');
  if(bubble)bubble.hidden=true;
  const narration=$('#storyNarration');
  if(narration){narration.hidden=true;narration.classList.remove('show');}
  gate.hidden=false;gate.style.display='flex';
  await nextPaint();
  return await new Promise(resolve=>{
    let done=false;
    const finish=e=>{
      e?.preventDefault?.();e?.stopPropagation?.();
      if(done)return;
      done=true;
      gate.hidden=true;gate.style.display='none';
      btn.onclick=null;
      resolve(true);
    };
    btn.onclick=finish;
  });
}

/* The formation button and split UI are intentionally outside #storyScene.
   Permit only these two controls while storyBusy is true. */
const conversationAllowedTargetBaseV194=conversationAllowedTargetV171;
conversationAllowedTargetV171=target=>
  !!target?.closest?.('#lilithFormationGateV194,#lilithSplitOverlay') ||
  conversationAllowedTargetBaseV194(target);

function hideLilithGateV194(){
  const gate=document.getElementById('lilithFormationGateV194');
  if(gate){gate.hidden=true;gate.style.display='none';}
}

async function runDemonCastleLilithPreV194(){
  if(storyBusy)return false;
  storyBusy=true;
  let ok=false;
  hideLilithGateV194();
  try{
    await openStoryScene('demonCastle',2);

    /* Lilith appears alone. */
    {const fx=castleFxV180('rose-summon-v180');try{await storyShowGuest('boss-lilith-castle',{slow:true});await fixedDelay(450);}finally{fx?.remove();}}
    await storySay('boss-lilith-castle','凄いね君たち');
    await storySay('boss-lilith-castle','グラディモブ\n強かったでしょ');
    await storySay('desert','ああ\n強敵だった');
    await storySay('boss-lilith-castle','まあ\n僕の方が強いんだけどね');
    await storySay('boss-lilith-castle','ちょっとだけ寂しくなるな');
    await storySay('money','あんたなんて\n私の魔法でぶっ飛ばしてやるわ！');
    await storySay('boss-lilith-castle','ネオン街の魔女\n僕も手合わせしてみたかった');
    await storySay('boss-lilith-castle','良い機会ね');
    await storySay('jessie','あなたを倒せば\nあとは魔王だけ！');
    await storySay('boss-lilith-castle','うーん\nそれはどうだろう');
    await storySay('boss-lilith-castle','行ってみないと分からないよね\nまあ');
    await storySay('boss-lilith-castle','行けないんだけどね');

    /* Four sisters appear. No formation logic is attached to this summon. */
    {const fx=castleFxV180('rose-ultimate-v180');try{await demonLilithSummonV106();await fixedDelay(650);}finally{fx?.remove();}}
    await storySay('boss-lilith-castle','君たちは\nこのリリス四姉妹が遊んでくれるよ\nあ、僕も入れたら五姉妹か？\nいや僕は親？うーん');
    await storySay('pink','あれを全部相手は大変であります・・');
    await storySay('desert','2手に分かれよう');
    await storySay('denden','ナイスアイデアでやんす！');
    await storySay('jessie','どう分かれるの？');
    await storySay('riro','勇者様が\n決めればいいでス');
    await storySay('denden','そうでやんすね！');
    await storySay('money','リリスがいる方は3体\n戦力の分け方が大事ね！');

    /* No narration Promise, no local pointer bridge, no automatic modal.
       The user explicitly presses the center button. */
    await waitLilithFormationGateV194();
    await chooseSplitV181(LILITH_SPLIT_OPT_V194);

    await storySay('nyoro','素晴らしい采配ニョロ！');
    await storySay('desert','では、まずBパーティーの出陣だ！');

    markStoryDone(LILITH_PRE_KEY_V194);
    state.adventure??={};
    state.adventure.lilithFlowV194Done=true;
    state.adventure.lilithSplitReadyV183=true;
    saveAdventure();
    ok=true;
  }finally{
    hideLilithGateV194();
    storyBusy=false;
  }
  if(!ok)return false;
  await closeStoryScene(false);
  if(screens.adventure?.classList?.contains('active'))renderAdventure();
  return true;
}

/* Replace only this one pre-boss story. All other stories use the v184 path. */
const runStoryEventBaseV194=runStoryEvent;
runStoryEvent=async function(key,forceHomeOverride=false){
  if(key!==LILITH_PRE_KEY_V194)return runStoryEventBaseV194(key,forceHomeOverride);
  if(state.adventure?.lilithFlowV194Done)return false;
  return runDemonCastleLilithPreV194();
};

/* For AREA3 boss only, run the clean v194 story even if an older build already
   marked pre:demonCastle:2 as viewed. Then fall back to the stable v184 battle path. */
const startAdventureBattleBaseV194=startAdventureBattle;
startAdventureBattle=async function(){
  const w=currentWorld(),areaIndex=Number(state.adventure?.areaIndex)||0;
  if(w?.id!=='demonCastle'||areaIndex!==2)return startAdventureBattleBaseV194();
  if(!state.adventure?.battleReady||state.adventure.completed||state.adventure.awaitingReport||storyBusy)return;
  const enc=state.adventure.pendingEncounter||createAdventureEncounter();
  const bossEncounter=(((state.adventure.battleIndex||0)===2)||!!w.oneBattlePerArea)&&!!enc?.bossBattle;
  if(!bossEncounter)return startAdventureBattleBaseV194();

  if(!state.adventure?.lilithFlowV194Done){
    const ran=await runDemonCastleLilithPreV194();
    if(!ran&&!state.adventure?.lilithFlowV194Done)return;
  }
  return startAdventureBattleBaseV194();
};

window.__mobBuildVersion='v194';
window.__mobV194LilithCleanFlow=true;
window.__mobV194LilithDiagnostics=()=>({
  world:currentWorld()?.id||'',
  area:Number(state.adventure?.areaIndex)||0,
  flowDone:!!state.adventure?.lilithFlowV194Done,
  splitReady:!!state.adventure?.lilithSplitReadyV183,
  gateVisible:document.getElementById('lilithFormationGateV194')?.style.display==='flex'
});
})();
// UPDATE_V194_END
