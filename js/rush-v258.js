/* Eight representative routes, three tiers. Keep legacy records and medals in place. */
const rushGateBaseV258=rushTierOpenV254;
rushTierOpenV254=(q,t=rushDifficultyV254)=>!!q&&Number.isInteger(t)&&t>=0&&t<3&&rushGateBaseV258(q,t)&&(q.stage===1||rushTierV254(RUSH_DATA_V252.quests[q.stage-2],t)||rushTierV254(q,t));
const rushRewardBaseV258=rewardRushV252;
rewardRushV252=function(r,b){const q=rushQuestV252(r?.rushV252);if(q&&rushTierV254(q,r.tier)){if(eventRunV174===r&&state.battle===b&&b.finished&&b.rushWonV252&&!r.rewarded&&r.area===q.areas.length-1&&!b.pendingWaveConfigs.length&&r.wave===q.areas[r.area].waves.length-1&&!livingEnemies().length){r.rewarded=true;r.coinReward=0;r.rewardOutcome='受領済みっちゃ';}return false;}return rushRewardBaseV258(r,b);};
const rushMenuBaseV258=rushMenuV252;
rushMenuV252=function(){rushMenuBaseV258();const root=$('#trainingFeaturePanel');for(const q of RUSH_DATA_V252.quests){const card=$('[data-rush-card="'+q.id+'"]',root);if(!card)continue;const h=$('h3',card);h.textContent=`${rushDifficultyV254*8+q.stage}. ${q.title}`;if(!rushTierOpenV254(q)&&q.stage>1){const p=document.createElement('p');p.textContent=`前のクエスト ${rushDifficultyV254*8+q.stage-1} クリアが必要`;p.className='rush-progression-v258';h.after(p);}}};
window.__mobRushLayoutVersion=258;
