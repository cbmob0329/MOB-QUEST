// UPDATE_V210_BEGIN
/* Book endings own their destination; generic result handling must not resume
   adventure after the authored return to the Record Room. */
const pendingPostBaseV210=runPendingPostStory;
runPendingPostStory=async function(suppressArrival=false,forceHomeAfter=false){
  const key=state.adventure.pendingPostStory?.key;
  if(key!=='post:unfinishedBook:3')return pendingPostBaseV210(suppressArrival,forceHomeAfter);
  return pendingPostBaseV210(true,false);
};
const resultNextV210=$('#resultSetupBtn'),resultNextBaseV210=resultNextV210?.onclick;
if(resultNextV210)resultNextV210.onclick=async function(...args){
  if(state.battle?.mode!=='adventure'||state.adventure.pendingPostStory?.key!=='post:unfinishedBook:3')return resultNextBaseV210?.apply(this,args);
  if(this.disabled)return;
  this.disabled=true;$('#resultOverlay').hidden=true;
  try{renderAdventure();showScreen('adventure');await runPendingPostStory(true,false);}finally{this.disabled=false;}
};

/* The adventure cursor has already advanced when post-battle scenes run.
   Use the scene being displayed, not currentWorld(), to preserve Riro. */
const renderPartyBaseV210=renderStoryParty;
renderStoryParty=async function(extraIds=null){
  const extras=Array.isArray(extraIds)?[...extraIds]:(extraIds?[extraIds]:[]);
  if(storyBusy&&$('#storyScene')?.classList.contains('story-world-unfinishedBook')){
    extras.push('riro');
    if(bookDisplacedPartyMemberV208)extras.push(bookDisplacedPartyMemberV208);
  }
  return renderPartyBaseV210([...new Set(extras)]);
};

/* Formation stays in one visible layer, including its confirmation. This also
   avoids handing input from the split overlay to the shared dialogue overlay. */
function confirmSplitInlineV210(overlay,split){
  return new Promise(resolve=>{
    const roster=overlay.firstElementChild,wasInert=roster?.inert;if(roster)roster.inert=true;
    const card=document.createElement('div');card.className='split-confirm-v210';
    const title=document.createElement('h3');title.textContent='このパーティーで挑みますか？';card.appendChild(title);
    for(const team of ['A','B']){const line=document.createElement('p');line.textContent=`${team}：${split[team].map(([id])=>player(id)?.name||id).join(' / ')}`;card.appendChild(line);}
    for(const [label,value] of [['はい',true],['いいえ',false]]){
      const button=document.createElement('button');button.type='button';button.textContent=label;button.dataset.splitAnswerV210=String(value);
      button.onclick=e=>{e.preventDefault();e.stopPropagation();card.remove();if(roster)roster.inert=wasInert;resolve(value);};card.appendChild(button);
    }
    overlay.appendChild(card);card.scrollIntoView({block:'nearest'});
  });
}

let bookEntranceActiveV210=false;
for(const key of ['pre:unfinishedBook:0','pre:unfinishedBook:1']){
  const runner=BOOK_RUNNERS_V207[key];
  BOOK_RUNNERS_V207[key]=async function(){bookEntranceActiveV210=true;try{return await runner();}finally{bookEntranceActiveV210=false;}};
}
const showGuestsBaseV210=storyShowGuests;
storyShowGuests=async function(ids,opt={}){
  if(!bookEntranceActiveV210)return showGuestsBaseV210(ids,opt);
  const scene=$('#storyScene'),fx=document.createElement('div');fx.className='book-arrival-v210';
  fx.innerHTML='<i></i><i></i><i></i><b>MOB</b>';scene?.appendChild(fx);
  const group=$('#storyGuestGroup'),visibility=group?.style.visibility||'';group?.style.setProperty('visibility','hidden');
  try{
    await showGuestsBaseV210(ids,{...opt,slow:false});
    const actors=$$('[data-story-actor]',group);
    for(const actor of actors)actor.style.opacity='0';
    await fixedDelay(400);if(group)group.style.visibility=visibility;
    await Promise.all(actors.map(async(actor,i)=>{
      actor.style.opacity='0';await fixedDelay(i*180);
      await animateV157(actor,[{opacity:0,translate:'0 -65px',filter:'brightness(0)'},{opacity:1,translate:'0 8px',filter:'brightness(2)',offset:.7},{opacity:1,translate:'0 0',filter:'none'}],750);
      actor.style.removeProperty('opacity');
    }));
  }finally{if(group)group.style.visibility=visibility;fx.remove();}
};

const matrixBaseV210=matrixOverlayV208;
matrixOverlayV208=function(collapse=false){
  const fx=matrixBaseV210(collapse);fx.classList.add('book-matrix-v210');
  const focal=document.createElement('div');focal.className='matrix-actor-v210';
  const img=document.createElement('img');img.alt='';img.src=storyActorInfo(collapse?'book-navi-master':'book-navi').image;focal.appendChild(img);fx.appendChild(focal);
  const fragments=document.createElement('div');fragments.className='matrix-fragments-v210';
  fragments.innerHTML=Array.from({length:24},(_,i)=>`<i style="--i:${i};--x:${(i*37)%100}%;--y:${(i*23)%100}%">${['M','O','B'][i%3]}</i>`).join('');fx.appendChild(fragments);
  fx.setAttribute('aria-hidden','true');return fx;
};
naviMatrixTransformV207=async function(){
  const fx=matrixOverlayV208(false);
  try{
    await fixedDelay(700);fx.classList.add('encoding');
    await naviAbsorbV161();await storyHideGuest();
    const img=$('.matrix-actor-v210 img',fx);await readyStoryImage(img,storyActorInfo('book-navi-master').image);
    fx.classList.add('decoded');await storyShowGuest('book-navi-master',{slow:true});
    await fixedDelay(700);fx.classList.add('reveal');await fixedDelay(650);
  }finally{fx.remove();}
};
window.__mobBuildVersion='v210';
// UPDATE_V210_END
