// UPDATE_V187_BEGIN
/* Runtime-scope repair is structural: update-v181 through update-v186 are inlined
   before the core game closure. This marker provides build diagnostics. */
window.__mobBuildVersion='v187';
window.__mobV187RuntimeScopeFix=true;
window.__mobV187Diagnostics=()=>({
  partyCount:Array.isArray(state.party)?state.party.length:0,
  world:currentWorld()?.id||'',
  area:Number(state.adventure?.areaIndex)||0,
  lilithStepTypes:(STORY_EVENTS['pre:demonCastle:2']?.steps||[]).map(st=>st?.[0]),
  lilithHasV186:(STORY_EVENTS['pre:demonCastle:2']?.steps||[]).some(st=>st?.[0]==='lilithSplitV186')
});
// UPDATE_V187_END
