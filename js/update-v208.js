// UPDATE_V208_BEGIN
/* MOB STORY v208
   Reading Book staging / access / reward-lock fixes and playable Kaijin rebalance.
*/

/* Keep the temporarily displaced tenth party member visible during the authored
   Area 4 sequence. The old join helper reserves a slot for Kaijin immediately,
   which can otherwise make the final core member (normally Riro) vanish from the
   story lineup before the actual join announcement. */
let bookDisplacedPartyMemberV208=null;
const renderStoryPartyBaseV208=renderStoryParty;
renderStoryParty=async function(extraIds=null){
  let extras=Array.isArray(extraIds)?[...extraIds]:(extraIds?[extraIds]:[]);
  const inBookFinal=currentWorld()?.id==='unfinishedBook'&&Number(state.adventure?.areaIndex||0)===3&&storyBusy;
  if(inBookFinal&&bookDisplacedPartyMemberV208&&!extras.includes(bookDisplacedPartyMemberV208))extras.push(bookDisplacedPartyMemberV208);
  return renderStoryPartyBaseV208(extras.length?extras:null);
};

moveBookBossIntoPartyV207=async function(){
  const already=state.party.some(x=>canonicalPlayerId(x[0])==='kaijin');
  if(!already){
    if(state.party.length>=10){
      const row=state.party[state.party.length-1];
      bookDisplacedPartyMemberV208=canonicalPlayerId(row?.[0])||null;
    }
    storyJoin('kaijin');
  }
  saveParty();saveMeta();
  await storyHideGuest().catch(()=>{});
  await renderStoryParty(bookDisplacedPartyMemberV208);
  if($('[data-story-actor="yusha"]',$('#storyGuestGroup')))hideStoryPartyHeroV94(true);
  await fixedDelay(260);
};

/* On the second scene after the solo duel, keep Navi/Hero at the enemy stage but
   do not replay the first "Hero flies to Navi" animation. */
showBookNaviHeroDuelV207=async function(){
  restoreStoryPartyHeroV94();await renderStoryParty();hideStoryPartyHeroV94(true);bookHeroStoryModeV94='hero';
  await storyHideGuest().catch(()=>{});await storyHideGuests().catch(()=>{});
  await storyShowGuests(['book-navi','yusha'],{slow:true});
  const g=$('#storyGuestGroup');g?.classList.add('book-navi-hero-duel-v207','book-duel-resume-v208');
  const hero=$('[data-story-actor="yusha"]',g);hero?.classList.add('book-hero-guest-v94');
};

/* Reading Book is entered ONLY from the Record Room book. HOME > Adventure must
   never launch the world directly, including test mode. */
const openHomeActionBaseV208=openHomeAction;
openHomeAction=function(action){
  if(action==='adventure'&&currentWorld()?.id==='unfinishedBook'&&!state.meta?.bookCompleted){
    return facilityTalk('読みかけの本へは、レコードルームの本をタップして入るであります！','モブピンク','play/02.png');
  }
  return openHomeActionBaseV208(action);
};

/* Do not let the old save-migration helper convert mere world progress into a
   Reading Book clear. Only the explicit authored completion flag can grant the
   reward now. This closes reload/test edge cases around AREA 4. */
const ensureBookCompletionRewardsBaseV208=ensureBookCompletionRewardsV165;
ensureBookCompletionRewardsV165=function(){
  if(state.meta?.bookCompleted!==true)return false;
  return ensureBookCompletionRewardsBaseV208();
};
const applyTestChapterBaseV208=applyTestChapter;
applyTestChapter=function(...args){
  const r=applyTestChapterBaseV208(...args);
  if(state.test?.enabled){
    const worlds=MOB_DATA.adventureWorlds||[],bookIndex=worlds.findIndex(w=>w.id==='unfinishedBook'),wi=Number(state.adventure?.worldIndex)||0;
    if(bookIndex>=0&&wi===bookIndex){state.meta.bookCompleted=false;state.meta.heroPassive2Unlocked=false;saveMeta();}
    else if(bookIndex>=0&&wi>bookIndex){state.meta.bookCompleted=true;ensureBookCompletionRewardsV165();saveMeta();}
  }
  return r;
};

/* Hero's fifth ultimate is a true clear reward. Test "all skills", stale unlock
   flags, and direct battle calls must not expose it before bookCompleted. */
const transformUnlockedBaseV208=transformUnlockedV158;
transformUnlockedV158=function(u){
  if(u?.kind==='heroTransform'||u?.name==='読みかけの本')return state.meta?.bookCompleted===true;
  return transformUnlockedBaseV208(u);
};
const availableUltsBaseV208=availableUlts;
availableUlts=function(a){
  const rows=availableUltsBaseV208(a)||[];
  if(a?.id!=='yusha'||state.meta?.bookCompleted===true)return rows;
  return rows.filter(u=>u?.kind!=='heroTransform'&&u?.name!=='読みかけの本');
};
const performUltimateBaseV208=performUltimate;
performUltimate=async function(a,u,...args){
  if(a?.id==='yusha'&&(u?.kind==='heroTransform'||u?.name==='読みかけの本')&&state.meta?.bookCompleted!==true){
    notice('「読みかけの本」をクリアすると習得します','system',850);return false;
  }
  return performUltimateBaseV208(a,u,...args);
};

/* Stronger asynchronous Matrix transformation: independent MOB columns, scan
   lines, glitch layers, perspective grid and a central pulse. */
function matrixOverlayV208(collapse=false){
  const fx=document.createElement('div');
  fx.className=`book-scene-fx-v207 book-matrix-v208${collapse?' collapse':''}`;
  const cols=Array.from({length:14},(_,i)=>{
    const delay=(-(i%7)*0.17).toFixed(2),speed=(0.78+(i%5)*0.13).toFixed(2),offset=((i*7)%19)-9;
    return `<i class="matrix-col-v208" style="--i:${i};--delay:${delay}s;--speed:${speed}s;--offset:${offset}px">M<br>O<br>B<br>M<br>O<br>B<br>M<br>O<br>B<br>M<br>O<br>B</i>`;
  }).join('');
  fx.innerHTML=`<div class="matrix-grid-v208"></div><div class="matrix-rain-v208">${cols}</div><div class="matrix-scan-v208"></div><div class="matrix-glitch-v208 g1">MOB</div><div class="matrix-glitch-v208 g2">MOB</div><div class="matrix-core-v208">MOB</div><div class="matrix-ring-v208"></div>`;
  document.body.appendChild(fx);return fx;
}
matrixOverlayV207=matrixOverlayV208;
naviMatrixTransformV207=async function(){
  const fx=matrixOverlayV208(false),navi=storyAnchor('book-navi');
  navi?.classList.add('book-navi-matrix-charge-v208');
  const sc=$('#storyScene');sc?.classList.add('book-matrix-shake-v208');
  try{
    await Promise.all([naviTransformV161(),fixedDelay(3200)]);
  }finally{
    navi?.classList.remove('book-navi-matrix-charge-v208');sc?.classList.remove('book-matrix-shake-v208');fx.remove();
  }
};
naviMatrixCollapseV207=async function(){
  const fx=matrixOverlayV208(true),navi=storyAnchor('book-navi-master');
  try{await Promise.all([fixedDelay(1450),navi?animateV157(navi,[{opacity:1,filter:'none',scale:'1'},{opacity:.75,filter:'brightness(2.7) contrast(1.9)',scale:'1.06',offset:.38},{opacity:.45,filter:'blur(2px) brightness(3.5)',scale:'.92 1.06',offset:.66},{opacity:0,filter:'blur(10px) brightness(5)',scale:'.04 .88'}],1350):Promise.resolve()]);}finally{fx.remove();}
  await storyHideGuest().catch(()=>{});
};

window.__mobBuildVersion='v208';
window.__mobV208ReadingBookStageFix=true;
window.__mobV208BookUltimateHardLock=true;
window.__mobV208MatrixEnhanced=true;
// UPDATE_V208_END
