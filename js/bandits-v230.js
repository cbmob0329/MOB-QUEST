const BANDIT_IDS_V230=['hari','eri','pue','onbu','queen'];
const BANDIT_NAMES_V230=['モブハリネット','モブエリマッキン','モブホラプエ','モブオンブ','モブホラクイーン'];
const BANDIT_PARTIES_V230=[['yusha','pink','desert','denden'],['yusha','money','nyoro','nekoku'],null];
STORY179.bandits={title:'砂漠の盗賊ファミリー！',world:'desert',unlock:'rural',unlockName:'田舎町',image:'spenemy/87.png',diffs:[
 {name:'ノーマル',level:25,coins:5000,diamonds:50,figures:[56,57],unlock:'rural',unlockName:'田舎町',areas:4},
 {name:'ハード',level:45,coins:10000,diamonds:100,figures:[58],medal:'event-horapue-medal',unlock:'sea',unlockName:'海底',areas:3},
 {name:'インフェルノ',level:65,coins:50000,diamonds:150,figures:[59,60],unlock:'rural2',unlockName:'田舎町Ⅱ',areas:4}
]};
if(!weaponById('event-horapue-medal'))WEAPONS.push({id:'event-horapue-medal',name:'モブホラプエ',image:'spenemy/85.png',type:'メダル',types:['メダル'],rarity:'UR',attribute:'水',stats:{spd:80},traits:[{kind:'normalFollowup',chance:.05,power:1.1,label:'5%で通常攻撃の110%で追撃'}],traitLabel:'5%の確率で通常攻撃の110%で追撃する'});
// Medal equipment uses 10% of the source stats: 80 SPD becomes the authored +8.
const banditOpenBaseV230=openV179;openV179=function(key,d=0){if(key!=='bandits')return banditOpenBaseV230(key,d);const q=STORY179.bandits.diffs[d],r=recordsV179(key);return !!q&&(testAllQuestsV171()||worldCleared(q.unlock)&&(d===0||!!r[d-1])&&!r[d]);};
function banditPartyV230(d){const ids=BANDIT_PARTIES_V230[d];return ids?ids.map(id=>state.party.find(r=>canonicalPlayerId(r[0])===id)).filter(Boolean):state.party;}
const banditPartyBaseV230=partyV179;partyV179=key=>key==='bandits'?banditPartyV230(eventRunV174?.difficulty||0):banditPartyBaseV230(key);
const banditDisplayBaseV230=storyDisplayPartyIds;storyDisplayPartyIds=function(...args){return eventRunV174?.storyV179==='bandits'?(eventRunV174.difficulty<2?partyV179('bandits').map(x=>x[0]):[...new Set([...partyV179('bandits').map(x=>x[0]),'pink','desert','denden','money','nyoro','nekoku'])]):banditDisplayBaseV230(...args);};
const banditStartBaseV230=startV179;startV179=async function(key,d=0){if(key!=='bandits')return banditStartBaseV230(key,d);if(eventRunV174||!openV179(key,d))return false;const party=banditPartyV230(d);if(!party.length)return toast('出撃可能な仲間がいません');const q=STORY179.bandits,desc=q.diffs[d];if(!await confirmStoryChallengeV179(q.title,desc.name+'\n出撃：'+party.map(r=>player(r[0]).name).join(' / ')))return false;eventRunV174={storyV179:key,difficulty:d,area:0,vitals:{},rewarded:false};skipScopeV174='';skippedV174=false;$('#trainingFeaturePopup').hidden=true;state.meta.storyEventSeenV175??={};state.meta.storyEventSeenV175.bandits=true;saveMeta();await startSavannaAreaV174();return true;};
const banditMenuBaseV230=renderEventQuestsV163;renderEventQuestsV163=function(){banditMenuBaseV230();if(eventViewV163!=='story')return;const panel=$('#trainingFeaturePanel .event-panel-v163');if(!panel)return;
 if(selectedStoryV179===null){const b=document.createElement('button');b.className='event-story-card-v174';b.dataset.story230='bandits';b.innerHTML='<small>三部作 / 4・3・4 AREA</small><strong>砂漠の盗賊ファミリー！</strong><img src="spenemy/87.png" alt="砂漠の盗賊団"><small>田舎町クリア後に解放</small>';b.onclick=()=>{selectedStoryV179='bandits';renderEventQuestsV163();};($('.event-story-list-v177',panel)||panel).append(b);}
 if(selectedStoryV179==='bandits'){const desc=$('.event-story-card-v174>small:last-child',panel);if(desc)desc.textContent='難易度ごとに出撃メンバーと物語が変わります';const list=$('.event-difficulties-v163',panel);list.innerHTML=STORY179.bandits.diffs.map((q,d)=>`<button class="event-difficulty-v163" data-v179-start="bandits:${d}" ${openV179('bandits',d)?'':'disabled'}><div><b>${q.name}</b><strong>適正 Lv.${q.level} / 全${q.areas} AREA</strong></div><p>${q.unlockName}クリア${d?'・前章クリア':''}後<br>出撃：${BANDIT_PARTIES_V230[d]?.map(id=>player(id).name).join(' / ')||'自由'}</p><div class="event-story-rewards-v174">コイン ${q.coins.toLocaleString()} / ◆ ${q.diamonds}<br>${q.figures.map(n=>`<img src="eventfig/${n}.png" alt="${figureByImageV96('eventfig/'+n+'.png').name}">`).join('')}${q.medal?'<img src="spenemy/85.png" alt="モブホラプエメダル">':''}</div>${recordsV179('bandits')[d]?'<em class="event-clear-stamp-v163">CLEAR</em>':''}</button>`).join('');$$('[data-v179-start]',list).forEach(b=>b.onclick=()=>startV179('bandits',+b.dataset.v179Start.split(':')[1]));const small=$('.event-story-card-v174>small',panel);if(small)small.textContent='ノーマル・ハード・インフェルノの三部作';}
};
function banditTemplateV230(key,level,escort=false){
 const i=BANDIT_IDS_V230.indexOf(key),common={id:'bandit230-'+key,banditV230:key,noEscape:true,levelMin:level,levelMax:level,permanentDamageReduction:true};
 const skills={hari:['ゴレマソード'],eri:['マッキン・モッキン'],pue:['プエルトリガー'],onbu:['ポンポコ乱撃'],queen:['ホラ・ロック・クイーン'],healer:['回復の魔法']};if(skills[key])common.specialOptions=skills[key].map(special=>({special,kind:'single',power:1,skillType:'physical'}));
 if(i<0){const names={mummy:'モブミイラ',sharty:'モブシャーティー',poison:'モブポイズン',healer:'モブミイラ'},t={...baseByNameV179(names[key]),...common,category:'normal'};if(key==='sharty'||key==='poison'){t.actionCount=2;t.forceActionCount=true;t.v144ActionMin=t.v144ActionMax=2;t.damageReduction=key==='sharty'||level===48?.1:0;t.evasion=key==='poison'&&level===26?.1:0;}return t;}
 const n=key==='hari'||key==='eri'?2:key==='queen'?2:3,max=key==='queen'?3:n;
 return{...common,name:BANDIT_NAMES_V230[i],image:`spenemy/${83+i}.png`,symbol:'♪',category:escort?'normal':'boss',attribute:['地','風','水','地','風'][i],damageReduction:escort?0:.1,evasion:escort?0:[.05,.05,.06,.05,.04][i],actionCount:escort?(key==='hari'||key==='eri'?1:2):n,forceActionCount:true,v144ActionMin:escort?1:n,v144ActionMax:escort?(key==='hari'||key==='eri'?1:2):max,banditEscortV230:escort};
}
// All five bandits use character-sized art, independently of boss/escort combat rules.
const banditSizeBaseV230=enemySizeClass;
enemySizeClass=function(e){return BANDIT_IDS_V230.includes(e?.banditV230)?'normal':banditSizeBaseV230(e);};
function banditWavesV230(d,area){
 const one=(k,lv,esc=false)=>({template:banditTemplateV230(k,lv,esc),level:lv}),m=(lv,n)=>Array.from({length:n},()=>one('mummy',lv));
 if(d===0)return [[m(25,3),m(25,3)],[[one('sharty',27),one('poison',26)]],[m(27,5),m(27,5)],[[one('hari',30),one('eri',30)]]][area];
 if(d===1)return [[m(45,5),m(45,5)],[m(45,5),m(45,5),[one('poison',48),one('poison',48)]],[[one('pue',50)]]][area];
 const final=(key,lv)=>{const row=one(key,lv,key!=='queen');row.template.category=key==='queen'?'boss':'elite';row.template.damageReduction=key==='queen'?.12:.05;return row;};
 return [[[one('hari',68),one('pue',68),one('eri',70)]],[m(65,5),m(65,5),m(65,5)],[[one('healer',68),one('onbu',70),one('healer',68)]],[[final('hari',70),final('eri',70),final('queen',78),final('onbu',74),final('pue',75)]]][area];
}
const banditBuildBaseV230=buildEnemyFromTemplate;buildEnemyFromTemplate=function(t,...args){const e=banditBuildBaseV230(t,...args);if(!t.banditV230)return e;Object.assign(e,{banditV230:t.banditV230,banditEscortV230:!!t.banditEscortV230});if(['onbu','queen'].includes(e.banditV230)&&!e.banditEscortV230)addAllElementResistV142(e,.1);if(e.banditV230==='pue'&&!e.banditEscortV230){e.statusResist={...e.statusResist,...Object.fromEntries(['poison','burn','paralyze','sleep','stun','confuse'].map(s=>[s,.8]))};}return e;};
const banditActorBaseV230=storyActorInfo;storyActorInfo=function(key){if(String(key).startsWith('bandit230-')){const t=banditTemplateV230(key.slice(10),30);return{...t,enemyTemplate:t};}return banditActorBaseV230(key);};
async function banditNotesV230(host,large=false){if(!host)return;const layer=document.createElement('div');layer.className='bandit-notes-v230';host.append(layer);try{for(let i=0;i<(large?18:9);i++){const n=document.createElement('i');n.textContent=i%2?'♪':'♫';n.style.setProperty('--i',i);layer.append(n);}await animateV157(host,[{translate:'0 0'},{translate:'-4px 0'},{translate:'4px 0'},{translate:'-3px 0'},{translate:'0 0'}],large?1000:650);await fixedDelay(250);}finally{layer.remove();}}
async function banditEnterV230(keys,mode='run'){
 const scene=$('#storyScene'),group=$('#storyGuestGroup');let actors=[];
 scene.classList.add('bandit-enter-preparing-v233');
 try{
  await storyShowGuests(keys.map(k=>'bandit230-'+k),{allowFive:true});
  group.classList.add('bandit-guests-v230');actors=[...group.children];
  actors.forEach(el=>el.style.opacity='0');
  // Seed the hidden first frame before revealing the container, including dance entrances.
  const jobs=actors.map((el,i)=>{const direction=i%2?-1:1,offscreen=direction*Math.max(scene.clientWidth,350);return animateV157(el,mode==='dance'?[{translate:`${offscreen}px 0`,opacity:0},{translate:`${direction*-35}px -32px`,opacity:1,offset:.3},{translate:`${direction*35}px 0`,opacity:1,offset:.6},{translate:'0 -24px',opacity:1,offset:.8},{translate:'0 0',opacity:1}]:[{translate:mode==='jump'?'0 -120px':`${offscreen}px 0`,opacity:0},{translate:'0 0',opacity:1}],mode==='walk'?1500:mode==='dance'?1600:mode==='fast'?500:900).then(()=>el.style.removeProperty('opacity'));});
  scene.classList.remove('bandit-enter-preparing-v233');await Promise.all(jobs);
 }finally{scene.classList.remove('bandit-enter-preparing-v233');actors.forEach(el=>el.style.removeProperty('opacity'));}
}
async function banditBattleEntranceV234(b){
 const screen=$('#battleScreen'),actors=b.enemies.map(e=>enemyVisual(e.uid)?.closest('.enemy-unit')).filter(Boolean);
 actors.forEach(el=>el.style.opacity='0');
 try{
  const jobs=actors.map((el,i)=>animateV157(el,[{translate:`${i%2?-100:100}vw 0`,opacity:0},{translate:'0 0',opacity:1}],750).then(()=>el.style.removeProperty('opacity')));
  screen.classList.remove('bandit-wave-preparing-v233');await Promise.all(jobs);
 }finally{screen.classList.remove('bandit-wave-preparing-v233');actors.forEach(el=>el.style.removeProperty('opacity'));}
}
async function banditSceneV230(phase){const r=eventRunV174;$('#adventureScreen').classList.add('bandit-transition-v233');showScreen('adventure');storyBusy=true;try{await openStoryScene('desert',r.area,'default');$('#storyScene').classList.add('bandit-story-v230');$('#adventureStageTitle').textContent=STORY179.bandits.title;$('#adventureProgress').textContent='AREA '+(r.area+1)+' / '+STORY179.bandits.diffs[r.difficulty].name;if(phase==='pre'&&r.area===0){const title=document.createElement('div');title.className='bandit-title-v230';title.innerHTML=`<small>第${['一','二','三'][r.difficulty]}章</small><b>${['砂漠の盗賊団登場！','ロックな出会い！','プーホラ盗賊団のライブ！'][r.difficulty]}</b>`;$('#storyScene').append(title);try{await fixedDelay(1700);}finally{title.remove();}}
 if(phase==='post'){const guests=([ [[],[],['hari','eri'],['hari','eri']], [[],['onbu'],['pue']], [['hari','pue','eri'],[],['onbu'],['hari','eri','queen','onbu','pue']] ])[r.difficulty][r.area];if(guests.length)await banditEnterV230(guests,'walk');}
 for(const [type,a,b]of BANDIT_DIALOGUE_V230[r.difficulty][r.area][phase]){if(skipConversationV224())break;
  if(type==='say'){if(a==='unknown')await storyNarrate('？？？\n'+b);else await storySay(a,b);}
  else if(type==='beat'){const el=document.createElement('div');el.className='bandit-beat-v230';el.textContent=a;$('#storyScene').append(el);try{await animateV157(el,[{scale:'.7',opacity:0},{scale:'1.08',opacity:1,offset:.3},{scale:'1',opacity:1}],650);await fixedDelay(400);}finally{el.remove();}}
  else if(type==='enter')await banditEnterV230(a,b);
  else if(type==='exit'){await Promise.all(a.map(async k=>{const el=storyAnchor('bandit230-'+k);if(el){await animateV157(el,[{translate:'0 0'},{translate:'110vw 0',opacity:0}],600);el.remove();}}));}
  else if(type==='notes')await banditNotesV230(storyAnchor('bandit230-'+a));
  else if(type==='pause')await fixedDelay(900);
  else {const els=type==='jumpGuests'?[...$('#storyGuestGroup').children]:type==='surprise'?a.map(k=>storyAnchor('bandit230-'+k)):[storyAnchor(a)];await Promise.all(els.filter(Boolean).map(async el=>{const mark=document.createElement('b');if(type==='surprise'){mark.className='bandit-surprise-v230';mark.textContent='！？';el.append(mark);}try{await animateV157(el,type==='shake'?[{translate:'-5px 0'},{translate:'5px 0'},{translate:'0 0'}]:[{translate:'0 0'},{translate:'0 -25px',offset:.25},{translate:'0 0',offset:.5},{translate:'0 -18px',offset:.75},{translate:'0 0'}],750);}finally{mark.remove();}}));}
 }
 }finally{try{await closeStoryScene(false);}finally{$('#storyScene').classList.remove('bandit-story-v230');storyBusy=false;}}}
const banditAreaBaseV230=startSavannaAreaV174;startSavannaAreaV174=async function(...args){const r=eventRunV174;if(r?.storyV179!=='bandits')return banditAreaBaseV230(...args);eventOverlayV163().hidden=true;try{await scopedConversationV224(()=>banditSceneV230('pre'),[]);const bg=storySceneBg('desert',r.area);await startBattleLoaded({mode:'eventStory174',storyEventV174:true,storyV179:'bandits',worldId:'desert',returnScreen:'training',party:partyV179('bandits'),questVitals:r.vitals,waves:banditWavesV230(r.difficulty,r.area),bg:bg.bg,fallbackBg:bg.fallback});$('#battleModeLabel').textContent=`砂漠の盗賊ファミリー！ / ${STORY179.bandits.diffs[r.difficulty].name} / AREA ${r.area+1}`;$('#battleBackBtn').style.display='';$('#adventureScreen').classList.remove('bandit-transition-v233');}catch(err){console.error('[bandits230]',err);$('#adventureScreen').classList.remove('bandit-transition-v233');returnSavannaV174();toast('準備に失敗しました。もう一度お試しください。');}};
const banditWaveBaseV230=spawnNextEnemyWave;spawnNextEnemyWave=async function(...args){const b=state.battle;if(b?.config?.storyV179!=='bandits')return banditWaveBaseV230(...args);if(!b.pendingWaveConfigs?.length)return false;const rows=b.pendingWaveConfigs.shift();b.enemies=buildEnemyWave(rows,Math.min(4,b.allies.length),b.bg,b.fallbackBg);b.enemy=b.enemies[0];b.targetEnemyId=b.enemy.uid;b.actingEnemyId=null;b.queue=[];b.queuePos=0;const screen=$('#battleScreen');screen.classList.add('bandit-wave-preparing-v233');renderBattle();try{await actionCutin('新たな敵が走ってくる！','danger',600);await banditBattleEntranceV234(b);}finally{screen.classList.remove('bandit-wave-preparing-v233');}b.turn++;b.busy=false;startRound();return true;};
const banditFinishBaseV230=finishSavannaV174;finishSavannaV174=async function(b,win){const r=eventRunV174;if(r?.storyV179!=='bandits')return banditFinishBaseV230(b,win);if(b.finished)return;b.finished=true;b.auto=false;setCommandDisabled(true);let reward=null;if(win){for(const a of b.allies)r.vitals[a.id]={hp:a.hp,mp:a.mpNow,dead:a.dead,status:{...a.status}};applyProgressRewards(b,r.vitals);await scopedConversationV224(()=>banditSceneV230('post'),[]);if(r.area===STORY179.bandits.diffs[r.difficulty].areas-1)reward=rewardV179();}showResultV179(win,reward);$('#adventureScreen').classList.remove('bandit-transition-v233');};
const banditResultBaseV230=showResultV179;showResultV179=function(win,...args){banditResultBaseV230(win,...args);const r=eventRunV174;if(r?.storyV179!=='bandits'||r.area!==STORY179.bandits.diffs[r.difficulty].areas-1)return;const b=$('[data-v179-next]',eventOverlayV163());b.textContent='クエストへ戻る';b.onclick=()=>returnSavannaV174();};
// The custom list and reward cards are created after the shared menu renderer.
// Apply the same discovery/clear rules after those images exist.
const banditSilhouetteBaseV230=renderEventQuestsV163;
renderEventQuestsV163=function(...args){const result=banditSilhouetteBaseV230(...args);if(eventViewV163!=='story')return result;const panel=$('#trainingFeaturePanel');
 const hide=(img,hidden,label)=>{if(!img)return;img.classList.toggle('event-silhouette-v175',hidden);img.alt=hidden?label:img.dataset.revealedAltV230||img.alt;};
 const boss=selectedStoryV179==='bandits'?$('.event-story-card-v174>img',panel):$('[data-story230="bandits"]>img',panel);if(boss){boss.dataset.revealedAltV230='砂漠の盗賊団';hide(boss,!seenV179('bandits'),'未遭遇のボス');}
 if(selectedStoryV179==='bandits')for(const card of $$('[data-v179-start^="bandits:"]',panel)){const d=+card.dataset.v179Start.split(':')[1];for(const img of $$('.event-story-rewards-v174 img',card)){img.dataset.revealedAltV230=img.alt;hide(img,!recordsV179('bandits')[d],'未獲得の限定報酬');}}
 return result;
};
window.__mobBuildVersion='v230';
