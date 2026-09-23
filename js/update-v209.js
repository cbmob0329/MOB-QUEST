// UPDATE_V209_BEGIN
/* MOB STORY v209
   Reading Book presentation polish:
   - atomic Kaijin join redraw (no first-slot/hero flash)
   - stronger Kaijin boss entrance after the book reveal
   - smaller story-only Kaijin boss scale
   - Hero + Navi staging stays on the enemy lane
*/

/* Story-only size correction. Battle enemy size is intentionally untouched. */
const applyStoryGuestNaturalSizeBaseV209=applyStoryGuestNaturalSize;
applyStoryGuestNaturalSize=function(holder,img,info,opt={}){
  applyStoryGuestNaturalSizeBaseV209(holder,img,info,opt);
  if(!holder||!img||!(img.naturalWidth>0&&img.naturalHeight>0))return;
  const key=String(holder.dataset?.storyActor||info?.key||info?.enemyTemplate?.id||info?.id||'');
  if(key!=='book-kaijin-boss')return;
  const scene=$('#storyScene')?.getBoundingClientRect();if(!scene?.width||!scene?.height)return;
  const multi=!!opt?.multi||holder.classList.contains('story-guest-multi');
  const maxW=scene.width*(multi ? 0.185 : 0.30),maxH=scene.height*(multi ? 0.255 : 0.34);
  const scale=Math.min(maxW/img.naturalWidth,maxH/img.naturalHeight,1);
  holder.style.setProperty('width',`${Math.max(1,Math.round(img.naturalWidth*scale))}px`,'important');
  holder.style.setProperty('height',`${Math.max(1,Math.round(img.naturalHeight*scale))}px`,'important');
  holder.classList.add('book-kaijin-story-scale-v209');
};

/* Full entrance: book opens -> dark portal -> Kaijin silhouette -> seal pulse ->
   actual story actor fades in under the effect. No simple X-line finish. */
async function bookKaijinBossEntranceV209(){
  const scene=$('#storyScene'),info=storyActorInfo('book-kaijin-boss');
  if(!scene||!info?.image){await storyShowGuest('book-kaijin-boss',{slow:true});return;}
  const fx=document.createElement('div');
  fx.className='book-kaijin-intro-v209';
  fx.innerHTML=`
    <div class="kaijin-book-v209"><i class="left"></i><i class="right"></i><b>MOB</b></div>
    <div class="kaijin-portal-v209"><i></i><i></i><i></i></div>
    <div class="kaijin-boss-shadow-v209"><img alt="${info.name||'モブ怪人のボス'}"></div>
    <div class="kaijin-seal-v209">MOB</div>
    <div class="kaijin-floor-v209"></div>
    <div class="kaijin-shards-v209">${Array.from({length:10},(_,i)=>`<i style="--i:${i}"></i>`).join('')}</div>`;
  scene.appendChild(fx);
  const img=$('img',fx);await readyStoryImage(img,info.image);await nextPaint();fx.classList.add('play');
  await fixedDelay(1500);
  const reveal=storyShowGuest('book-kaijin-boss',{slow:false});
  await fixedDelay(620);fx.classList.add('handoff');
  await Promise.all([reveal,fixedDelay(480)]);fx.remove();
}

/* Replace only the Area 3 pre-battle runner so the boss reveal and dialogue are
   one authored sequence. */
async function bookArea3PreV209(){
  await openStoryScene('unfinishedBook',2);await bookKaijinBossEntranceV209();
  await storySay('book-kaijin-boss','ようこそ偽物のヒーロー達よ！\n残る正義はお前たちのみ！');
  await storySayJaggedV207('book-kaijin-boss','悪は必ず勝つのだ‼︎');
  await storySay('denden','敵のボスでやんすね！');
  await storySay('book-kaijin-boss','そう！\nこの俺がボス！\n一番偉いのだ！\n俺に従え！');
  await storySay('money','分かりやすい悪役ね');
  await storySay('jessie','保安官として見過ごせないわ！');
  await storySay('pink','正義の強さを見せるであります！');
  await storySay('desert','魔王に近い魔力だ\n気をつけろ！');
  await storySay('tetsu','拙者、\n力は惜しまないでござる！');
  await storySay('book-kaijin-boss','あのヒーローはこの世界から消えた！\nこの世界では俺が悪であり正義！\n俺こそが');
  await storySayJaggedV207('book-kaijin-boss','神だ‼︎');
}
BOOK_RUNNERS_V207['pre:unfinishedBook:2']=bookArea3PreV209;

/* The party DOM is rebuilt while concealed. The relocated Hero class is restored
   before the new DOM becomes visible, preventing the first slot from flashing. */
moveBookBossIntoPartyV207=async function(){
  const already=state.party.some(x=>canonicalPlayerId(x[0])==='kaijin');
  if(!already&&state.party.length>=10){
    const row=state.party[state.party.length-1];
    bookDisplacedPartyMemberV208=canonicalPlayerId(row?.[0])||null;
  }
  await storyHideGuest().catch(()=>{});
  const line=$('#storyPartyLine');
  line?.classList.add('book-party-rebuild-v209');
  if(!already)storyJoin('kaijin');
  saveParty();saveMeta();
  await renderStoryParty(bookDisplacedPartyMemberV208);
  /* Hero also exists on the enemy stage during this beat. Hide the party copy
     before revealing the rebuilt party row. */
  if($('[data-story-actor="yusha"]',$('#storyGuestGroup')))hideStoryPartyHeroV94(true);
  const joined=line?$('[data-story-actor="kaijin"]',line):null;joined?.classList.add('book-kaijin-party-arrive-v209');
  await nextPaint();line?.classList.remove('book-party-rebuild-v209');
  await fixedDelay(620);joined?.classList.remove('book-kaijin-party-arrive-v209');
};

/* Resume scene after the solo duel: build Navi/Hero directly on the enemy lane,
   without first painting them at the generic guest position. */
showBookNaviHeroDuelV207=async function(){
  bookHeroStoryModeV94='hero';hideStoryPartyHeroV94(true);await renderStoryParty();
  await storyHideGuest().catch(()=>{});await storyHideGuests().catch(()=>{});
  await storyShowSecondaryGuestsV94(['book-navi','yusha'],'book-navi-hero-duel-v207 book-duel-resume-v208');
  const hero=$('[data-story-actor="yusha"]',$('#storyGuestGroup'));hero?.classList.add('book-hero-guest-v94');
};

window.__mobBuildVersion='v209';
window.__mobV209KaijinJoinFlashFix=true;
window.__mobV209KaijinEntranceEnhanced=true;
window.__mobV209BookEnemyLane=true;
// UPDATE_V209_END
