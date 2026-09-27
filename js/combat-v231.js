function boostEnemyV231(e,rate,cut=0){
 for(const stat of ['maxHp','hp','maxMp','mp','atk','mag','def','res','spd'])if(Number.isFinite(e[stat]))e[stat]=Math.max(1,Math.round(e[stat]*(1+rate)));
 e.damageReduction=clamp((e.damageReduction||0)+cut,0,.9);e.permanentDamageReduction=true;fx('buff',`enemy:${e.uid}`);
}
const battleSequenceBaseV231=playBattleSequenceV173;
playBattleSequenceV173=async function(key,sayOnly=false){
 await battleSequenceBaseV231(key,sayOnly);
 const e=state.battle?.enemies?.find(e=>e.id==='boss-neomaster');
 if(key==='neo70'&&e&&!e.neo70V231){e.neo70V231=true;boostEnemyV231(e,.10,.10);e.critBonusV231=.10;await actionCutin('全ステータス・ダメージ軽減・会心率が10%アップ！','buff',1000);}
 if(key==='neo40'&&e&&!e.neo40V231){e.neo40V231=true;boostEnemyV231(e,0,.10);e.specialChanceV231=.8;e.actionCount=3;e.forceActionCount=true;await actionCutin('ダメージ軽減アップ！ 3回行動！','buff',1000);}
 if(key==='reviveBefore')await sceneFxV231('time',$('#battleFxLayer'));
 renderBattle();
};
async function flameAbsorbV231(){
 const layer=$('#battleFxLayer');if(!layer||skipConversationV224())return;
 const frames=Array.from({length:8},(_,i)=>{const img=new Image();img.src=`skill/${String(i+5).padStart(2,'0')}.png`;return img;});await Promise.all(frames.map(endingImageReadyV225));
 const images=[];try{
  for(const side of [-1,1]){const img=new Image();img.src='skill/05.png';img.className='flame-absorb-v231';img.style.cssText=`position:absolute;left:${side<0?0:80}%;top:20%;width:20%;height:35%;object-fit:contain;pointer-events:none;`;layer.append(img);images.push(img);}
  await Promise.all(images.map(endingImageReadyV225));
  for(let n=5;n<=12;n++){for(const img of images)img.src=`skill/${String(n).padStart(2,'0')}.png`;await fixedDelay(95);}
  await Promise.all(images.map((img,i)=>animateV157(img,[{left:i?'80%':'0%',opacity:.85},{left:'40%',opacity:0,scale:'.2'}],1000)));
 }finally{images.forEach(img=>img.remove());}
}
const damageAllyBaseV231=damageAlly;
damageAlly=async function(a,power,...args){const e=actingEnemy(),critical=!!e?.critBonusV231&&Math.random()<e.critBonusV231,old=enemyCriticalV163;if(critical){enemyCriticalV163=true;notice('会心の一撃！','danger',450);}try{return await damageAllyBaseV231(a,power*(critical?TEMP_BALANCE.critPower:1),...args);}finally{enemyCriticalV163=old;}};
const roundBaseV231=startRound;
startRound=function(...args){for(const e of state.battle?.enemies||[])if(e.revivedFourV231)e.actionCount=rint(1,2);return roundBaseV231(...args);};
const poisonV231=MOB_DATA.magicCatalog.find(s=>s.id==='mira-mob-poison');
Object.assign(poisonV231,{name:'デザート・ミラモブ・ポイズン',target:'all',element:'闇',effectText:'敵全体に闇属性中ダメージ＋会心率10%＋70%で毒'});
performMiraMobPoisonV120=async function(a,chosen){
 if(a.id!=='desert'||!desertAwakenedV120())return false;
 const cost=v120MagicCost(a,chosen);if(a.mpNow<cost.cost){notice('MPが足りない！','danger');return false;}const enemies=livingEnemies();if(!enemies.length)return false;a.mpNow-=cost.cost;
 await actionCutin(`${a.name}の${chosen.name}！`,'system',650);await miraChargeFxV120(a);await skillSprite(chosen.frames||[],'enemy-all');
 const b=state.battle,previous=b.weaponAttackContext;b.weaponAttackContext={normal:false,element:'闇'};
 try{for(const e of enemies){const result=applyEnemyDamageTo(a,e,chosen.power||1.7,'magic',chosen.crit||.1,false);if(!result?.miss&&e.hp>0)applyEnemyStatusTo(e,'poison',chosen.chance||.7,3);}return true;}finally{b.weaponAttackContext=previous;renderBattle();await delay(380);}
};
showDesertAwakeningV120=async function(){if(storySkippingV231())return;await storyNarrate('モブデザートがパワーアップした！\nパッシブⅡ「ミラモブソウル」を習得！\n「デザート・ミラモブ・ポイズン」を獲得！');};
const STORY_MEDALS_V231={
 neon2:{id:'story-neomaster-medal',name:'モブネオンマスター',actor:'boss-neomaster',stats:{mag:50,res:50,maxMp:200},traits:[{kind:'storyMagicCritV231',value:.05,label:'魔法会心率+5%'}]},
 magma2:{id:'story-dragon-medal',name:'モブドラゴン',actor:'dragon',stats:{atk:50,def:50,maxHp:200},traits:[{kind:'resist',element:'火',value:.15,label:'火属性耐性+15%'},{kind:'resist',element:'闇',value:.15,label:'闇属性耐性+15%'}]},
 desert2:{id:'story-mira-medal',name:'ミラモブ',actor:'boss-mira-d2',stats:{atk:80,spd:80},traits:[{kind:'darkMagicCritV231',value:.08,label:'闇属性魔法会心率+8%'}]}
};
for(const row of Object.values(STORY_MEDALS_V231)){row.image=storyActorInfo(row.actor).image;if(!weaponById(row.id))WEAPONS.push({...row,type:'メダル',types:['メダル'],rarity:'UR',attribute:'無',traitLabel:row.traits.map(t=>t.label).join(' / ')});}
function grantStoryMedalV231(world){const row=STORY_MEDALS_V231[world];if(!row)return false;const earned=state.meta.storyMedalsV231??={};if(earned[world])return false;addMedal(row.id,1);earned[world]=true;saveMeta();return true;}
async function awardStoryMedalV231(world){
 if(!grantStoryMedalV231(world)||storySkippingV231())return;
 const row=STORY_MEDALS_V231[world],el=document.createElement('div');el.className='story-medal-v231';const img=new Image();img.src=row.image;img.alt=row.name;const text=document.createElement('b');text.textContent=`${row.name}のメダルを手に入れた！`;el.append(img,text);document.body.append(el);
 try{await endingImageReadyV225(img);await fixedDelay(2400);}finally{el.remove();}
}
const medalCritBaseV231=calcDamage;
calcDamage=function(a,type,power,crit=0,e=targetEnemy()){const element=normalizeElement(state.battle?.weaponAttackContext?.element||a.attribute||'無'),bonus=type==='magic'?weaponTraitSum(a,'storyMagicCritV231')+(element==='闇'?weaponTraitSum(a,'darkMagicCritV231'):0):0;return medalCritBaseV231(a,type,power,bonus?Math.max(TEMP_BALANCE.critRate,crit)+bonus:crit,e);};
// Completed saves receive each newly introduced story reward once.
setTimeout(()=>{for(const world of Object.keys(STORY_MEDALS_V231))if(storyDone(`post:${world}:3`)||worldCleared(world))grantStoryMedalV231(world);},0);
