// UPDATE_V206_BEGIN
/* v206: clear stale story-actor animation styles before a reused single guest is shown.
   v203 intentionally preserves final animation frames so projectiles do not snap back.
   That also left opacity/filter/transform values on #storyGuest after an actor faded out,
   which could make a later actor (notably Mob Demon King after the Ace sequence) invisible. */
function resetReusableStoryGuestVisualV206(el){
  if(!el)return;
  for(const prop of ['opacity','filter','transform','translate','rotate','scale','visibility','display']){
    el.style.removeProperty(prop);
  }
  el.hidden=false;
}
const storyShowGuestBaseV206=storyShowGuest;
storyShowGuest=async function(key,opt={}){
  const holder=$('#storyGuest');
  resetReusableStoryGuestVisualV206(holder);
  const result=await storyShowGuestBaseV206(key,opt);
  /* Reassert visibility after image sizing/fade classes; never inherit a previous actor's fade-out. */
  resetReusableStoryGuestVisualV206(holder);
  holder.classList.add('visible');
  return result;
};
window.__mobBuildVersion='v206';
window.__mobV206ReusableGuestReset=true;
// UPDATE_V206_END
