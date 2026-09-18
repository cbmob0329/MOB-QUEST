// UPDATE_V202_BEGIN
/* v202: retune main-adventure enemy levels against the finalized recommended-level curve.
   Only level bands are changed here; enemy skills, passives, stats, AI and rewards are preserved. */
const ENEMY_LEVELS_V202={
  'r2-hitode':[58,60],'r2-knife':[58,60],'r2-purufu':[59,60],'r2-nullblue':[59,61],
  'r2-adancer':[59,62],'r2-upa':[59,62],'r2-banken':[60,62],'r2-denchi':[60,62],
  'r2-scouter':[62,62],'r2-captain':[62,62],'r2-dean':[62,62],
  'r2-violin':[63,63],'r2-rapty':[64,64],'r2-tira':[64,64],'r2-kuukai':[65,65],
  'r2-akui':[64,64],'r2-shitsui':[64,64],'r2-yamai':[64,64],'boss-umidenden':[68,68],

  'm2-honoslime':[64,66],'m2-magrock':[64,66],'m2-magslime':[64,67],'m2-hinodevi':[64,67],
  'm2-lizard':[65,67],'m2-heatrock':[65,67],'m2-bombthrow':[65,67],'m2-bomber':[66,68],
  'm2-golem':[68,68],'m2-honotail':[68,68],'m2-hinotabi':[68,68],'m2-blizzard':[67,67],'m2-flame':[67,67],
  'm2-yogan':[70,70],'m2-salamander':[70,70],'m2-buster':[70,70],
  'boss-dragon2':[72,72],'boss-gidora':[75,75],

  'd2-mummy':[67,70],'d2-turco':[67,71],'d2-yamikamen':[67,70],'d2-gimmick':[67,70],
  'd2-adventure':[67,71],'d2-lizard':[68,71],'d2-nekomummy':[67,69],'d2-akarock':[68,68],
  'd2-sharty':[68,70],'d2-poison':[70,70],'d2-deathhead':[71,71],
  'boss-mira-d2':[70,70],'boss-mira2-d2':[72,72],
  'd2-slamummy':[70,70],'d2-mirabuster':[72,72],'d2-twinsoul':[70,70],
  'd2-miraearth':[72,72],'d2-mirakarami':[72,72],'d2-miranight':[72,72],'d2-miratime':[72,72],
  'boss-dorafara':[78,78],

  'book-minion':[75,75]
};
for(const e of MOB_DATA.enemyCatalog||[]){
  const lv=ENEMY_LEVELS_V202[e.id];
  if(lv){e.levelMin=lv[0];e.levelMax=lv[1];}
}
function setAdventureRecordLevelV202(worldId,areaIndex,id,level){
  const w=(MOB_DATA.adventureWorlds||[]).find(x=>x.id===worldId),a=w?.areas?.[areaIndex];
  if(!a)return;
  const walk=v=>{
    if(Array.isArray(v)){for(const x of v)walk(x);return;}
    if(v&&typeof v==='object'){
      if(v.id===id)v.level=level;
      for(const x of Object.values(v))if(x&&typeof x==='object')walk(x);
    }
  };
  walk(a);
}
/* Tribe: remove the old Lv48 leftovers from Area1. */
setAdventureRecordLevelV202('tribe',0,'t-kiba',55);
/* Rural II encounter progression. */
setAdventureRecordLevelV202('rural2',0,'r2-adancer',60);
setAdventureRecordLevelV202('rural2',0,'r2-violin',63);
setAdventureRecordLevelV202('rural2',1,'r2-rapty',64);
setAdventureRecordLevelV202('rural2',1,'r2-tira',64);
setAdventureRecordLevelV202('rural2',2,'r2-kuukai',65);
for(const id of ['r2-akui','r2-shitsui','r2-yamai'])setAdventureRecordLevelV202('rural2',2,id,64);
/* Magma II encounter progression. */
setAdventureRecordLevelV202('magma2',0,'m2-heatrock',66);
setAdventureRecordLevelV202('magma2',0,'m2-yogan',70);
setAdventureRecordLevelV202('magma2',1,'m2-golem',68);
setAdventureRecordLevelV202('magma2',1,'m2-salamander',70);
setAdventureRecordLevelV202('magma2',2,'m2-bomber',68);
setAdventureRecordLevelV202('magma2',2,'m2-buster',70);
setAdventureRecordLevelV202('magma2',3,'boss-dragon2',72);
/* Desert II encounter progression. */
setAdventureRecordLevelV202('desert2',0,'boss-mira-d2',70);
setAdventureRecordLevelV202('desert2',0,'boss-mira2-d2',72);
setAdventureRecordLevelV202('desert2',1,'d2-slamummy',70);
setAdventureRecordLevelV202('desert2',1,'d2-mirabuster',72);
setAdventureRecordLevelV202('desert2',1,'d2-twinsoul',70);
for(const id of ['d2-miraearth','d2-mirakarami','d2-miranight','d2-miratime'])setAdventureRecordLevelV202('desert2',2,id,72);
/* Unfinished Book: minions stay clearly weaker than the Lv80 captain without falling ten levels behind. */
setAdventureRecordLevelV202('unfinishedBook',0,'book-minion',75);

/* Rural II is now its own bridge tier instead of sharing Tribe's entry level. */
MOB_DATA.recommendedLevels={...(MOB_DATA.recommendedLevels||{}),rural2:58};
const rural2WorldV202=(MOB_DATA.adventureWorlds||[]).find(x=>x.id==='rural2');
if(rural2WorldV202)rural2WorldV202.recommendedLevel=58;

window.__mobBuildVersion='v202';
window.__mobV202EnemyLevelRetune=true;
// UPDATE_V202_END
