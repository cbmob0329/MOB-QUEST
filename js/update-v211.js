// UPDATE_V211_BEGIN
/* Scene effects use the existing actor artwork and never accept input. */
function dc2FxMarkupV211(){
  return '<div class="dc2-veil-v211"></div><div class="dc2-seal-v211"><i></i><i></i><i></i></div><div class="dc2-beam-v211"></div><div class="dc2-rift-v211"></div>'+Array.from({length:24},(_,i)=>`<i class="dc2-particle-v211" style="--i:${i};--x:${(i*43)%100}%;--dx:${(i%2?1:-1)*(30+i*4)}px;--delay:${-(i%8)*.17}s"></i>`).join('');
}
function dc2EffectV211(kind,parent=$('#storyScene')){
  const fx=document.createElement('div');fx.className=`dc2-cinematic-v211 ${kind}-v211`;fx.setAttribute('aria-hidden','true');fx.innerHTML=dc2FxMarkupV211();parent?.appendChild(fx);return fx;
}
async function dc2EntranceV211(ids,kind='rose',opt={}){
  const group=ids.length>1,holder=$(group?'#storyGuestGroup':'#storyGuest');
  const visibility=holder?.style.visibility||'',fx=dc2EffectV211(kind);
  holder?.style.setProperty('visibility','hidden');
  try{
    await fixedDelay(360);
    if(group)await storyShowGuests(ids,{...opt,slow:false});else await storyShowGuest(ids[0],{slow:false});
    const actors=group?$$('[data-story-actor]',holder):[holder].filter(Boolean);
    for(const actor of actors)actor.style.opacity='0';
    fx.classList.add('release');if(holder)holder.style.visibility=visibility;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    await Promise.all(actors.map(async(actor,i)=>{
      try{
        await fixedDelay(reduced?0:i*130);
        await animateV157(actor,reduced?[{opacity:0},{opacity:1}]:[
          {opacity:0,translate:kind==='flame'?'0 55px':'0 -25px',filter:'brightness(0) blur(7px)',scale:'.8'},
          {opacity:1,translate:'0 0',filter:'brightness(.15) drop-shadow(0 0 16px var(--dc2-glow, #db8aff))',scale:'1.04',offset:.55},
          {opacity:1,translate:'0 0',filter:'brightness(1.7)',scale:'1',offset:.8},
          {opacity:1,translate:'0 0',filter:'none',scale:'1'}
        ],reduced?300:1100);
      }finally{actor.style.removeProperty('opacity');}
    }));
    fx.classList.add('settle');await fixedDelay(450);
  }finally{if(holder)holder.style.visibility=visibility;fx.remove();}
}
async function dc2VanishV211(id,kind='rose'){
  const actor=storyAnchor(id),fx=dc2EffectV211(kind);fx.classList.add('release','vanish');
  try{
    if(actor)await animateV157(actor,[{opacity:1,filter:'none'},{opacity:.9,filter:'brightness(2) blur(1px)',offset:.4},{opacity:0,translate:'0 -30px',filter:'brightness(3) blur(12px)',scale:'.65'}],1400);
    await fixedDelay(300);
  }finally{fx.remove();}
}

/* Replace authored effect steps, preserving every dialogue and formation step. */
const dc2StepsBaseV211=runStorySteps;
runStorySteps=async function(steps=[]){
  for(const step of steps){
    const dc2=$('#storyScene')?.classList.contains('story-world-demonCastle2');
    if(!dc2){await dc2StepsBaseV211([step]);continue;}
    const [type,id]=step;
    if(type==='guest'&&id==='boss-lilith-castle' || type==='lilithRoseSummon180')await dc2EntranceV211(['boss-lilith-castle'],'rose');
    else if(type==='dc2Awaken181')await dc2EntranceV211(['dc2-kirin','dc2-hell','boss-lilith-castle','dc2-riva','dc2-kufu'],'rose',{allowFive:true,compactLilith:true,raised:true});
    else if(type==='dc2RoseClone181')await dc2EntranceV211(['dc2-lilith','dc2-lilith','dc2-lilith'],'mirror');
    else if(type==='dc2FireSummon181')await dc2EntranceV211(['dc2-enma'],'flame');
    else if(type==='dc2MaouSummon181')await dc2EntranceV211(['dc2-maou'],'abyss');
    else if(type==='roseFade180')await dc2VanishV211(id,'rose');
    else if(type==='fadeV157'&&id==='dc2-enma3'){await dc2VanishV211(id,'flame');await storyHideGuests();await storyHideGuest();}
    else await dc2StepsBaseV211([step]);
  }
};
window.__mobBuildVersion='v211';
// UPDATE_V211_END
