for(const [key,event]of Object.entries(STORY_V231.events))STORY_EVENTS[key]={...STORY_EVENTS[key],...event};
Object.assign(STORY_V173.battle,STORY_V231.battle);
if(enemyTemplate('boss-neomaster'))enemyTemplate('boss-neomaster').name='モブネオンマスター';
const FOUR_V231=['d2-miraearth','d2-mirakarami','d2-miranight','d2-miratime'];
function storySkippingV231(){return skippingV174()||skipConversationV224();}
async function sceneFxV231(theme,host=$('#storyScene'),target=null){
 if(!host||storySkippingV231())return;
 const layer=document.createElement('div');layer.className='story-fx-v231 '+theme;layer.setAttribute('aria-hidden','true');
 if(target){const hr=host.getBoundingClientRect(),r=storyAnchorRect(target);layer.style.cssText=`left:${r.left-hr.left+r.width/2}px;top:${r.top-hr.top+r.height/2}px;width:230px;height:230px;transform:translate(-50%,-50%);`;}
 for(let i=0;i<18;i++){const p=document.createElement('i');p.style.setProperty('--i',i);p.style.setProperty('--x',((i*37)%100)+'%');p.style.setProperty('--y',((i*61)%100)+'%');layer.append(p);}host.append(layer);
 try{await animateV157(layer,[{opacity:0},{opacity:.8,offset:.2},{opacity:.7,offset:.7},{opacity:0}],theme==='neon-master'?1800:1000);}finally{layer.remove();}
}
async function motionV231(ids,kind){
 await Promise.all((Array.isArray(ids)?ids:[ids]).map(async id=>{const actor=storyAnchor(id);if(!actor)return;
  if(kind==='ill'||kind==='glow')await sceneFxV231('neon',$('#storyScene'),actor);
  const height=kind==='big-hop'?65:24;
  const frames=kind==='hop'||kind==='big-hop'?[{translate:'0 0'},{translate:`0 -${height}px`,offset:.2},{translate:'0 0',offset:.45},{translate:`0 -${height*.7}px`,offset:.7},{translate:'0 0'}]:kind==='stagger'?[{rotate:'0deg'},{rotate:'-14deg',translate:'-12px 7px'},{rotate:'8deg',translate:'5px 0'},{rotate:'0deg',translate:'0 0'}]:[{translate:'0 0'},{translate:'-6px 0'},{translate:'5px 0'},{translate:'-4px 0'},{translate:'0 0'}];
  if(kind!=='glow')await animateV157(actor,frames,850);
 }));
}
async function entranceV231(ids,theme){
 const scene=$('#storyScene');scene.classList.add('entrance-hidden-v231');
 try{if(ids.length>1)await storyShowGuests(ids,{raised:theme==='four'});else await storyShowGuest(ids[0]);
  const actors=ids.map(storyAnchor).filter(Boolean);actors.forEach(el=>el.style.opacity='0');scene.classList.remove('entrance-hidden-v231');
  for(const [i,actor]of actors.entries()){
   const mode=theme==='four'?['earth','fire','slash','time'][i]:theme;
   const frames=mode==='walk'?[{translate:'120px 0',opacity:0},{translate:'80px -6px',offset:.25,opacity:1},{translate:'45px 0',offset:.5},{translate:'20px -5px',offset:.75},{translate:'0 0',opacity:1}]:mode==='lava'?[{scale:'1.4 .1',opacity:0},{scale:'.8 1.2',offset:.65,opacity:1},{scale:'1',opacity:1}]:mode==='hop'?[{translate:'110px -25px',opacity:0},{translate:'65px 0',opacity:1,offset:.4},{translate:'25px -28px',offset:.7},{translate:'0 0',opacity:1}]:[{translate:mode.startsWith('neon')?'180px 0':'0 40px',scale:'.55',opacity:0},{translate:'-8px 0',scale:'1.04',opacity:1,offset:.8},{translate:'0 0',scale:'1',opacity:1}];
   await Promise.all([sceneFxV231(mode,scene,actor),animateV157(actor,frames,mode==='walk'?1600:900)]);actor.style.opacity='';
  }
  if(theme==='four'&&!storySkippingV231()){const title=document.createElement('div');title.className='four-title-v231';title.textContent='ミラモブ四人衆';scene.append(title);try{await fixedDelay(2000);}finally{title.remove();}}
 }finally{scene.classList.remove('entrance-hidden-v231');for(const id of ids)storyAnchor(id)?.style.removeProperty('opacity');}
}
async function transferV231(fromId,toId,theme){
 if(storySkippingV231())return;
 const from=storyAnchor(fromId),to=storyAnchor(toId),scene=$('#storyScene');if(!from||!to)return;
 await sceneFxV231(theme,scene,from);const sr=scene.getBoundingClientRect(),fr=storyAnchorRect(from),tr=storyAnchorRect(to),orb=document.createElement('div');
 orb.className='transfer-orb-v231 '+theme;orb.style.left=fr.left-sr.left+fr.width/2+'px';orb.style.top=fr.top-sr.top+fr.height/2+'px';
 if(theme==='dark'){const img=new Image();img.src=storyActorInfo(fromId).image;orb.append(img);}
 scene.append(orb);const dx=tr.left+tr.width/2-fr.left-fr.width/2,dy=tr.top+tr.height/2-fr.top-fr.height/2;
 try{await animateV157(orb,[{translate:'0 0',scale:'.2',opacity:0},{translate:`${dx*.15}px ${dy*.15-18}px`,scale:'1',opacity:.85,offset:.2},{translate:`${dx*.5}px ${dy*.5+20}px`,opacity:.85,offset:.5},{translate:`${dx*.8}px ${dy*.8-12}px`,opacity:.75,offset:.8},{translate:`${dx}px ${dy}px`,scale:'.1',opacity:0}],2800);}finally{orb.remove();}
 await sceneFxV231(theme,scene,to);
}
async function absorbFourV231(){
 const scene=$('#storyScene'),boss=storyAnchor('boss-mira-d2');if(!boss)return;
 for(const id of FOUR_V231){if(storySkippingV231())break;const info=storyActorInfo(id),ghost=new Image();ghost.src=info.image;ghost.className='absorb-ghost-v231';scene.append(ghost);await endingImageReadyV225(ghost);const sr=scene.getBoundingClientRect(),br=storyAnchorRect(boss),dx=br.left+br.width/2-sr.left-sr.width*.2,dy=br.top+br.height/2-sr.top-sr.height*.35;
  try{await sceneFxV231('souls',scene,ghost);await animateV157(ghost,[{opacity:0,scale:'.5'},{opacity:1,scale:'1',offset:.25},{opacity:0,translate:`${dx}px ${dy}px`,scale:'.05'}],1200);await animateV157(boss,[{filter:'brightness(1)'},{filter:'brightness(.35)',offset:.4},{filter:'brightness(1.35)',offset:.65},{filter:'brightness(1)'}],500);}finally{ghost.remove();}
 }
}
async function transformV231(id,theme){await sceneFxV231(theme);await storyTransformGuest(id);await sceneFxV231(theme,$('#storyScene'),storyAnchor(id));}
const storyStepsBaseV231=runStorySteps;
runStorySteps=async function(steps=[]){for(const [type,a,b,c,...rest]of steps){
 if(type==='medalV231'){await awardStoryMedalV231(a);continue;}if(type==='awakenV231'){await awakenDesertV120();continue;}
 if(storySkippingV231()&&type.endsWith('V231'))continue;
 if(type==='entranceV231')await entranceV231(a,b);
 else if(type==='motionV231')await motionV231(a,b);
 else if(type==='sceneFxV231')await sceneFxV231(a);
 else if(type==='transferV231')await transferV231(a,b,c);
 else if(type==='transformV231')await transformV231(a,b);
 else if(type==='absorbFourV231')await absorbFourV231();
 else await storyStepsBaseV231([[type,a,b,c,...rest]]);
}};
window.__mobBuildVersion='v231';
