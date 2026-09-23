// UPDATE_V215_BEGIN
/* Castle II: authored dialogue and an explicit, locked A-to-B handoff. */
async function dc2HandoffDialogueV215(b){
  await allyStoryCutin('money','このまま一気に倒すわよ！');
  await allyStoryCutin('denden','モブリリス、覚悟でやんす！');
  await allyStoryCutin('kaijin','薔薇の魔女！最高の獲物だぜ！');
  const lilith=b.enemies.find(e=>e.id==='dc2-lilith')||trainingEnemyTemplate('dc2-lilith');
  await enemyStoryCutin(lilith,'うるさいなー');
  await enemyStoryCutin(lilith,'怒るよ？');
  await storyDarkBattlePulse();
}
async function dc2HandoffStageV215(team,allies){
  await Promise.all(allies.map(a=>preloadAsset(versionedPlay(a.image)).catch(()=>{})));
  const stage=document.createElement('div');stage.className=`dc2-handoff-v215 team-${team.toLowerCase()}`;
  stage.innerHTML=`<div class="dc2-handoff-ring-v215"></div><section><small>${team==='A'?'1戦目 終了':'2戦目 開始'}</small><h2>${team}グループ${team==='A'?'から交代':' 出陣！'}</h2><div class="dc2-handoff-members-v215">${allies.map(a=>`<figure><img src="${versionedPlay(a.image)}" alt=""><figcaption>${a.name}</figcaption></figure>`).join('')}</div></section>`;
  $('#battleScreen').appendChild(stage);
  try{await nextPaint();await fixedDelay(team==='A'?950:1700);}finally{stage.remove();}
}
const renderBattleBaseV215=renderBattle;
renderBattle=function(...args){
  const result=renderBattleBaseV215(...args),b=state.battle;
  if(b?.config?.dualPartyV181==='demonCastle2')$('#battleModeLabel').textContent=`魔王城Ⅱ / ${b.dualPartyTeamV181==='B'?'Bグループ・2戦目':'Aグループ・1戦目'}`;
  return result;
};
window.__mobBuildVersion='v215';
// UPDATE_V215_END
