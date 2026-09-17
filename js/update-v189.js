/* ===== MOB STORY v189: Lilith split bridge hard repair ===== */
/* The authored Demon Castle flow must be:
   Money's final line -> automatic party-split notice -> A/B formation -> Nyoro/Desert lines -> B battle.
   Do not insert another tap-waiting narration between Money and the formation UI. */

function hideLegacyLilithSplitOverlaysV189(){
  for(const sel of ['#splitPartyOverlayV185','#lilithSplitOverlayV186','#lilithSplitOverlay']){
    const el=document.querySelector(sel);if(!el)continue;
    el.hidden=true;el.style.display='none';
  }
}

async function lilithSplitBridgeV189(){
  hideLegacyLilithSplitOverlaysV189();
  const box=$('#storyNarration'),text=$('#storyNarrationText');
  if(box&&text){
    text.textContent='パーティーを2つ作ってください\nAパーティー：モブリリス、モブヘルリリス、モブキリンリリス\nBパーティー：モブクフリリス、モブリヴァリリス';
    box.hidden=false;
    await nextPaint();
    box.classList.add('show');
    await fixedDelay(900);
    box.classList.remove('show');
    await fixedDelay(180);
    box.hidden=true;
  }
  const pending=chooseLilithSplitV188();
  await nextPaint();
  const badge=document.querySelector('#lilithSplitOverlayV188 small');
  if(badge)badge.textContent='PARTY SPLIT / v189';
  return await pending;
}

/* Replace the fragile narration + split pair with one bridge immediately after Money's final line. */
const lilithEventV189=STORY_EVENTS['pre:demonCastle:2'];
if(lilithEventV189?.steps){
  const steps=lilithEventV189.steps;
  const moneyIndex=steps.findIndex(st=>st?.[0]==='say'&&st?.[1]==='money'&&String(st?.[2]||'').includes('リリスがいる方は3体'));
  if(moneyIndex>=0){
    const head=steps.slice(0,moneyIndex+1);
    const tail=steps.slice(moneyIndex+1).filter(st=>{
      const type=st?.[0],text=String(st?.[1]||'');
      if(['lilithSplit','lilithSplitV186','lilithSplitV188','lilithSplitBridgeV189'].includes(type))return false;
      if(type==='narrate'&&text.includes('パーティーを2つ作ってください'))return false;
      return true;
    });
    lilithEventV189.steps=[...head,['lilithSplitBridgeV189'],...tail];
  }
}

const runStoryStepsBaseV189=runStorySteps;
runStorySteps=async function(steps=[]){
  for(const st of steps){
    if(st?.[0]==='lilithSplitBridgeV189')await lilithSplitBridgeV189();
    else await runStoryStepsBaseV189([st]);
  }
};

window.__mobBuildVersion='v189';
window.__mobV189LilithBridgeFix=true;
window.__mobV189Diagnostics=()=>{
  const steps=STORY_EVENTS['pre:demonCastle:2']?.steps||[];
  const money=steps.findIndex(st=>st?.[0]==='say'&&st?.[1]==='money'&&String(st?.[2]||'').includes('リリスがいる方は3体'));
  return {
    moneyIndex:money,
    nextType:steps[money+1]?.[0]||'',
    bridgeCount:steps.filter(st=>st?.[0]==='lilithSplitBridgeV189').length,
    staleSplitCount:steps.filter(st=>['lilithSplit','lilithSplitV186','lilithSplitV188'].includes(st?.[0])).length,
    staleNarrationCount:steps.filter(st=>st?.[0]==='narrate'&&String(st?.[1]||'').includes('パーティーを2つ作ってください')).length
  };
};
/* ===== END MOB STORY v189 ===== */
