// Main-story tuning only: training, subquests and event templates stay independent.
const STORY_BOSS_BALANCE_V244={
 'boss-gidora':{hp:1.30,atk:1.10,mag:1.15},
 'd2-miraearth':{hp:1.35,atk:1.15,mag:1.15,def:1.10,res:1.10},
 'd2-mirakarami':{hp:1.35,atk:1.15,mag:1.15,def:1.10,res:1.10},
 'd2-miranight':{hp:1.35,atk:1.15,mag:1.15,def:1.10,res:1.10},
 'd2-miratime':{hp:1.35,atk:1.15,mag:1.15,def:1.10,res:1.10}
};
function balanceStoryWavesV244(config){
 const world=config.storyWorldId||config.worldId,area=Number(config.storyAreaIndex);
 if(config.mode!=='adventure'||!config.bossBattle||!((world==='magma2'&&area===3)||(world==='desert2'&&area===2)))return config;
 return {...config,waves:config.waves?.map(wave=>wave.map(row=>{
  const factors=STORY_BOSS_BALANCE_V244[row.id];if(!factors||row.storyBossBalanceV244)return {...row};
  const template=trainingEnemyTemplate(row.id),mods={...(template?.mods||{}),...(row.mods||{})};
  for(const [stat,multiplier]of Object.entries(factors))mods[stat]=(mods[stat]??1)*multiplier;
  const revival=Number(row.startingHpRate)>0&&Number(row.startingHpRate)<=.31||fourRevivalRowsV243(wave);
  return {...row,mods,storyBossBalanceV244:true,forceActionCount:true,actionCount:row.id==='boss-gidora'?3:revival?1:2};
 }))};
}
const storyBattleBaseV244=beginBattle;
beginBattle=async function(config){return storyBattleBaseV244(balanceStoryWavesV244(config));};
