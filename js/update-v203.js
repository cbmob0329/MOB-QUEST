// UPDATE_V203_BEGIN
/* v203: Demon Castle AREA4 presentation cleanup.
   - Money disappears before Yami Money is revealed.
   - Yami Money uses player-like story scale (battle boss scale is untouched).
   - Pink's head-shake/jump preserve her moved story position.
   - Story projectile/magic animations keep their final frame until removal (no snap-back).
   - Money/Yami inner-scene pair is normalized before dialogue positioning. */

/* Keep the final visual frame when a Web Animation finishes.  Previously cancel() restored
   the element to its origin for a paint, which made launched story magic/projectiles appear
   to fly back into the caster's hand. */
animateV157=async function(el,frames,duration=900){
  if(!el)return;
  const a=el.animate(frames,{duration,easing:'ease-in-out',fill:'forwards'});
  try{
    await a.finished;
    try{
      if(typeof a.commitStyles==='function')a.commitStyles();
      else{
        const last=frames?.at?.(-1)||{};
        for(const [k,v] of Object.entries(last)){
          if(k==='offset'||k==='easing'||k==='composite'||v==null)continue;
          try{el.style.setProperty(k,String(v));}catch(_){}
        }
      }
    }catch(_){}
  }finally{
    if(frames?.at?.(-1)?.opacity===0&&el.matches?.('#storyGuest,.story-guest-multi,.story-party-actor'))el.hidden=true;
    a.cancel();
  }
};

/* Story-only Yami Money scale: treat the art like a player character instead of a giant boss.
   This does not touch battle enemy sizing. */
const applyStoryGuestNaturalSizeBaseV203=applyStoryGuestNaturalSize;
applyStoryGuestNaturalSize=function(holder,img,info,opt={}){
  const key=holder?.dataset?.storyActor||info?.id||'';
  if(key!=='boss-yami-money')return applyStoryGuestNaturalSizeBaseV203(holder,img,info,opt);
  if(!holder||!img||!(img.naturalWidth>0&&img.naturalHeight>0))return;
  const scene=$('#storyScene')?.getBoundingClientRect();if(!scene?.width||!scene?.height)return;
  let sc=Math.min(lastStoryPartyScale||.14,.17);
  const multi=!!opt?.multi;
  const sz=fitNaturalSize(img.naturalWidth,img.naturalHeight,sc,scene.width*(multi?.25:.32),scene.height*(multi?.22:.25));
  holder.style.setProperty('width',`${sz.w}px`,'important');
  holder.style.setProperty('height',`${sz.h}px`,'important');
  holder.classList.add('yami-money-story-scale-v203');
};

/* In the transformation reveal, hide normal Money first, then reveal Maou + Yami Money. */
const storyShowGuestsBaseV203=storyShowGuests;
storyShowGuests=async function(keys=[],opt={}){
  const ids=(keys||[]).map(String);
  if(ids.includes('boss-maou-castle')&&ids.includes('boss-yami-money')){
    hideMoneyV157();
    await fixedDelay(260);
  }
  return storyShowGuestsBaseV203(keys,opt);
};

/* The old inner-scene code forces both actors to 31% x 100% immediately before “あ！あんた！”.
   Re-apply natural player-sized dimensions synchronously before the mark/dialogue paints. */
function normalizeMoneyInnerPairV203(){
  const sc=$('#storyScene');if(!sc?.classList.contains('money-inner-v180'))return;
  const group=$('#storyGuestGroup');
  for(const holder of $$('.story-guest-multi',group)){
    const img=$('img',holder),info=storyActorInfo(holder.dataset.storyActor);
    if(img?.naturalWidth)applyStoryGuestNaturalSize(holder,img,info,{multi:true});
  }
}
const castleMarkBaseV203=castleMarkV178;
castleMarkV178=async function(id){
  if(id==='money'||id==='boss-yami-money')normalizeMoneyInnerPairV203();
  return castleMarkBaseV203(id);
};

/* Bubble anchors in the white inner-space scene sit a little closer to the visible characters. */
const storyAnchorRectBaseV203=storyAnchorRect;
storyAnchorRect=function(anchor){
  const r=storyAnchorRectBaseV203(anchor);
  if(!r)return r;
  if($('#storyScene')?.classList.contains('money-inner-v180')&&anchor?.closest?.('#storyGuestGroup')){
    const shift=Math.min(14,r.height*.08);
    return{left:r.left,top:r.top+shift,width:r.width,height:Math.max(1,r.height-shift),right:r.right,bottom:r.bottom,x:r.x,y:(r.y??r.top)+shift};
  }
  return r;
};

/* Pink was already moved toward Jessie.  Never animate translate from 0, or she jumps back
   into the party row for the shake/jump frames. */
pinkHeadShakeV180=async function(){
  const a=storyAnchor('pink');if(!a)return;
  await animateV157(a,[{rotate:'0deg'},{rotate:'-5deg',offset:.2},{rotate:'5deg',offset:.4},{rotate:'-4deg',offset:.6},{rotate:'4deg',offset:.8},{rotate:'0deg'}],650);
};
const castleJumpBaseV203=castleJumpV178;
castleJumpV178=async function(id){
  if(id!=='pink')return castleJumpBaseV203(id);
  const a=storyAnchor('pink');if(!a)return;
  await animateV157(a,[{transform:'translateY(0)'},{transform:'translateY(-30px)',offset:.22},{transform:'translateY(0)',offset:.48},{transform:'translateY(-23px)',offset:.72},{transform:'translateY(0)'}],900);
};

/* Correct the requested wording without duplicating the very large Demon Castle scene body. */
const storySayBaseV203=storySay;
storySay=async function(key,text,...args){
  if(key==='pink'&&typeof text==='string'&&text.includes('モブマニーが自らを封印し')){
    text=text.replace('モブマニーが自らを封印し','モブマニーが封印されて');
  }
  return storySayBaseV203(key,text,...args);
};

window.__mobBuildVersion='v203';
window.__mobV203DemonCastlePresentation=true;
// UPDATE_V203_END
