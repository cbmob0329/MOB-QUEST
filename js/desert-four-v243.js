// Repair old saved encounters too: their expanded rows lost startingHpRate.
function fourRevivalRowsV243(rows){
 return Array.isArray(rows)&&rows.length===4&&FOUR_V231.every(id=>rows.some(row=>row.id===id));
}
function repairFourWavesV243(waves){
 if(!Array.isArray(waves))return;
 for(const rows of waves)if(fourRevivalRowsV243(rows))for(const row of rows){row.startingHpRate=.30;row.forceActionCount=true;}
}
function isDesertFourConfigV243(config){
 return config?.mode==='adventure'&&(config.storyWorldId||config.worldId)==='desert2'&&Number(config.storyAreaIndex)===2&&config.bossBattle;
}
const fourBeginBaseV243=beginBattle;
beginBattle=async function(config){
 if(isDesertFourConfigV243(config))repairFourWavesV243(config.waves);
 return fourBeginBaseV243(config);
};
const fourAdventureBaseV243=startAdventureBattle;
startAdventureBattle=async function(...args){
 if(currentWorld()?.id==='desert2'&&Number(state.adventure.areaIndex)===2&&state.adventure.pendingEncounter?.bossBattle){
  repairFourWavesV243(state.adventure.pendingEncounter.waves);saveAdventure();
 }
 return fourAdventureBaseV243(...args);
};
const fourWaveBaseV243=spawnNextEnemyWave;
spawnNextEnemyWave=async function(...args){
 const b=state.battle;if(!isDesertFourConfigV243(b?.config))return fourWaveBaseV243(...args);
 repairFourWavesV243(b.pendingWaveConfigs);
 if(b.fourTransitionV243)return b.fourTransitionV243;
 if(!b.pendingWaveConfigs?.length)return fourWaveBaseV243(...args);
 b.busy=true;setCommandDisabled(true);
 b.fourTransitionV243=(async()=>{
  // Death dialogue also runs when both enemies fall in the same attack or from poison.
  await checkBattleHpDialogue();return fourWaveBaseV243(...args);
 })();
 try{return await b.fourTransitionV243;}finally{delete b.fourTransitionV243;}
};
