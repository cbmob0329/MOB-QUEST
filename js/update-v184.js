// UPDATE_V184_BEGIN
/* v184: boss HP +10%, strengthened Mob Umi Denden, visible build version. */
;(()=>{
const BOSS_HP_MULTIPLIER_V184=1.10;
const enemyStatPreviewBaseV184=enemyStatPreview;
enemyStatPreview=function(t,...args){
  const st=enemyStatPreviewBaseV184(t,...args);
  if(t?.category==='boss'&&!t?.noGlobalBossHpV184){
    st.maxHp=Math.max(1,Math.round(Number(st.maxHp||1)*BOSS_HP_MULTIPLIER_V184));
  }
  return st;
};

function patchUmiDendenV184(){
  const t=trainingEnemyTemplate('boss-umidenden');
  if(t)Object.assign(t,{name:'モブウミデンデン',levelMin:68,levelMax:68,actionCount:2,forceActionCount:true,v144ActionMin:2,v144ActionMax:3,damageReduction:.10,permanentDamageReduction:true,evasion:.10,umiDendenV184:true});
  const b=(MOB_DATA.bosses||[]).find(x=>x.id==='umiDenden');
  if(b)Object.assign(b,{name:'モブウミデンデン'});
}
patchUmiDendenV184();

/* One action every round is a true party-wide physical attack. The normal
   Machinegun Gummy special remains available on the following action. */
const enemyActionBaseV184=enemyAction;
enemyAction=async function(actionIndex=1,enemyId){
  const b=state.battle,e=enemyByUid(enemyId)||actingEnemy()||b?.enemy;
  if(e?.id==='boss-umidenden'){
    if(actionIndex===1){
      await actionCutin(`${e.name}の全体攻撃！`,'danger',560);
      await beginEnemyLunge(e.uid);
      try{await aoeHit(.90,'physical','雷');}finally{endEnemyLunge();}
      if(!livingRoster().length)finishBattle(false);
      return;
    }
    if(actionIndex===2&&b&&b.turn%Math.max(1,Number(e.specialEvery)||Number(TEMP_BALANCE.bossSpecialEvery)||3)===0){
      await bossSpecial(enemySpecialSpec(e));
      if(!livingRoster().length)finishBattle(false);
      return;
    }
  }
  return enemyActionBaseV184(actionIndex,enemyId);
};

window.__mobV184Balance={bossHpMultiplier:BOSS_HP_MULTIPLIER_V184,umiDenden:true};
})();
// UPDATE_V184_END
