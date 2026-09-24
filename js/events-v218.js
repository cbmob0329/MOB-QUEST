/* Boss catalogue additions. Existing keys remain stable for saved clear records. */
const bosses218=[
 ['barion','モブバリオン','grassland','雷','56',[12,50,87],[35],.10,0,0,0,1],
 ['whiteSavanna','モブシロサバンナ','grassland','光','53',[14,55,89],[40],.10,.08,.10,0,0],
 ['kobuchi','モブコブチー','desert','地','55',[17,50,88],[36],0,0,.20,0,1],
 ['crouton','モブクルトン','desert','風','54',[17,50,88],[37],0,0,.10,0,1],
 ['robe','モブローブ','rural','闇','57',[22,50,88],[41],.10,.05,0,0,1],
 ['mash','モブマッシュ','rural','地','58',[24,52,90],[42],.10,.05,.10,0,2],
 ['katchin','モブカッチン','neon','光','59',[27,50,87],[38],.10,0,.11,0,0],
 ['freza','モブフレザトカゲ','magma','火','60',[33,58,88],[39],0,.10,.10,0,1],
 ['jelly','モブスラゼリー','sea','水','61',[35,48,85],[43],.10,.10,.10,.20,0],
 ['ryu','モブリュウノツカイ','grassland2','風','62',[55,70,90],[44],.10,.10,.10,.10,0],
 ['skullMagic','モブスカルマジック','tribe','闇','63',[63,77,91],[45],0,0,.10,.10,3],
 ['cassette','モブカセット','rural2','地','64',[68,80,93],[46,47],.10,0,0,0,1],
 ['magnet2','モブマグネットMⅡ','neon2','雷','66',[70,83,95],[48],.10,0,.10,0,1],
 ['summoner','モブマグサモン & モブガマン','magma2','火','67',[75,85,98],[49,50],.10,0,0,0,1]
];
for(const [key,name,world,attribute,img,levels,drops,crit,evasion,cut,critNull,aoe]of bosses218)if(!EVENT_BOSSES_V163.some(q=>q.key===key))EVENT_BOSSES_V163.push({key,id:'event-'+key,name,world,attribute,image:`spenemy/${img}.png`,levels,drops,crit,evasion,cut,critNull,aoe,extraV218:true});
for(const [key,levels]of Object.entries({skull:[60,75,90],potion:[68,80,93],bubble:[70,83,95],bird:[60,75,90],sweets:[80,95,110],demon:[80,99,120],slime:[90,100,120]}))Object.assign(EVENT_BOSSES_V163.find(q=>q.key===key),{levels});
const eventTemplateBaseV218=eventTemplateV163;
eventTemplateV163=function(q,d){const t=eventTemplateBaseV218(q,d);if(q.extraV218)Object.assign(t,{extraBossV218:q.key,actionCount:['whiteSavanna','mash','skullMagic'].includes(q.key)?3:2,forceActionCount:true,v144ActionMin:['whiteSavanna','mash','skullMagic'].includes(q.key)?3:2,v144ActionMax:3});return t;};
Object.assign(EVENT_SKILLS_V163,{
 barion:[{name:'バリオンサンダー',all:true,type:'magic'},{name:'バリオンナックル',status:['paralyze'],chance:.10,infChance:.20}],
 whiteSavanna:[{name:'閃光の魔法',type:'magic',all:true}],kobuchi:[{name:'スナ・ジナラシ',all:true}],crouton:[{name:'サイコソヨカゼ',type:'magic',all:true}],robe:[{name:'闇の魔法',type:'magic',all:true}],mash:[{name:'ポイズン・ミュージック',type:'magic',all:true,status:['poison'],chance:.20}],katchin:[{name:'サイキック・ハイキック',element:'雷',status:['paralyze'],chance:.10,atk:.10}],freza:[{name:'火炎の特技',element:'火'},{name:'水流の特技',element:'水'}],jelly:[{name:'水の魔法',type:'magic',all:true}],ryu:[{name:'疾風の魔法',type:'magic',element:'風',all:true},{name:'炎の特技',element:'火'}],skullMagic:[{name:'闇の魔法',type:'magic',all:true}],cassette:[{name:'カセット・レーザー',type:'magic',power:1.8,status:['paralyze'],chance:.20}],magnet2:[{name:'マグネットソードM',status:['stun'],chance:.60}],summoner:[{name:'灼熱の魔法',type:'magic',all:true,power:1.6},{name:'火炎の特技',power:1.6}]
});
const extraThresholdBaseV218=eventThresholdV163;
eventThresholdV163=function(e){if(!e?.extraBossV218)return extraThresholdBaseV218(e);const s=e.eventV163;if(!s||s.low||e.hp<=0)return;const k=e.extraBossV218,threshold=['crouton','skullMagic'].includes(k)?.3:['cassette','magnet2','summoner'].includes(k)?(k==='cassette'&&s.difficulty===2?.6:.5):s.difficulty===2&&['robe','mash','freza','jelly'].includes(k)?.5:.4;if(e.hp/e.maxHp>threshold)return;s.low=true;
 if(['barion','whiteSavanna'].includes(k)){s.crit+=.2;e.evasion+=.2;}
 if(k==='kobuchi')s.cut+=.2;
 if(k==='crouton'){eventHealV163(e,.5);s.cut+=.2;}
 if(['robe','mash'].includes(k)){eventHealV163(e,.3);e.mag*=1.15;e.res*=1.15;}
 if(k==='katchin')e.def*=1.25;
 if(k==='freza'){eventHealV163(e,.4);e.frezaShieldV218=state.battle.turn;}
 if(k==='jelly'){e.actionCount=e.v144ActionMin=e.v144ActionMax=3;e.physicalCutV218=.3;}
 if(k==='ryu'){e.actionCount=e.v144ActionMin=e.v144ActionMax=3;e.aoeV218=2;s.cut+=.1;}
 if(k==='skullMagic'){eventHealV163(e,.4);s.magicCut+=.3;}
 if(k==='cassette'){e.level+=3;const ratio=e.hp/e.maxHp;for(const stat of ['maxHp','atk','mag','def','res','spd'])e[stat]=Math.round(e[stat]*1.1);e.hp=Math.ceil(e.maxHp*ratio);addAllElementResistV142(e,.1);e.actionCount=e.v144ActionMin=e.v144ActionMax=3;eventQueueV163(()=>eventTransformV163(e,'spenemy/65.png','モブカセットⅡ',true));}
 if(k==='magnet2')e.def*=1.2;if(k==='summoner'){e.mag*=1.2;e.def*=1.2;}eventUpdateDefenseV163(e);
};
const extraHitBaseV218=applyEnemyDamageTo;
applyEnemyDamageTo=function(a,e,power,type='physical',crit=0,...args){
 const k=e?.extraBossV218;if(!k)return extraHitBaseV218(a,e,power,type,crit,...args);const inf=e.eventV163?.difficulty===2,cut=e.damageReduction,passive=Math.random();let counter=0;
 if(k==='jelly'&&type==='magic'&&passive<.3){e.hp=Math.min(e.maxHp,e.hp+1000);renderBattle();floatNumber(1000,'heal',`enemy:${e.uid}`);return{value:0,miss:false};}
 if(k==='robe'&&passive<.10){power*=.5;counter=1.3;}
 if(k==='katchin'&&type==='physical'&&passive<.20){power*=.7;counter=1.2;}
 if(k==='kobuchi'&&type==='magic'&&passive<(inf?.4:.3))counter=1.2;
 if(k==='crouton'&&type==='magic'&&passive<(inf?.4:.3))a.mpNow=Math.floor(a.mpNow*.9);
 if(['ryu','skullMagic','magnet2'].includes(k)&&passive<(inf?(k==='magnet2'?.4:.2):.1))counter=k==='ryu'?2:1.2;
 if(e.physicalCutV218&&type==='physical')power*=1-e.physicalCutV218;
 if(e.frezaShieldV218===state.battle?.turn)power*=.2;
 try{const r=extraHitBaseV218(a,e,power,type,crit,...args);if(r?.miss&&k==='jelly')eventQueueV163(()=>eventCounterV163(e,a,1.5,true));if(r?.value>0&&e.hp>0&&counter){if(['robe','skullMagic'].includes(k))eventQueueV163(()=>eventSpecialV218(e,{name:pick((MOB_DATA.magicCatalog||[]).filter(s=>s.element==='闇'))?.name||'闇の魔法',power:1.2,type:'magic',status:k==='skullMagic'?['poison']:[],chance:.4}));else queueEnemyCounterV142(e,a,counter);}return r;}finally{e.damageReduction=cut;eventUpdateDefenseV163(e);}
};
const extraActionBaseV218=enemyAction;
enemyAction=async function(index=1,uid){const e=enemyByUid(uid)||actingEnemy(),b=state.battle,k=e?.extraBossV218;if(!k)return extraActionBaseV218(index,uid);if(!b||b.finished||e.hp<=0)return;for(const s of ['sleep','stun','paralyze'])if(e.status[s]>0){e.status[s]--;return;}
 const q=EVENT_BOSSES_V163.find(q=>q.key===k),old=b.actingEnemyId;b.actingEnemyId=e.uid;
 try{
 if(index===1&&k==='whiteSavanna'&&Math.random()<.1){e.atk*=1.08;e.spd*=1.08;}
 if(index===1&&k==='cassette'&&Math.random()<.1){eventHealV163(e,.2);livingField().forEach(clearPlayerBuffsV142);}
 if(index===1&&k==='summoner'&&Math.random()<.2&&livingEnemies().length<5){const t=pick(trainingEnemyCatalog().filter(t=>t.stage==='マグマ'&&t.category==='normal'));if(t){b.enemies.push(buildEnemyFromTemplate(t,Math.max(1,e.level-3)));renderBattle();}}
 if(index===1){const skill=pick(EVENT_SKILLS_V163[k]);await eventSpecialV218(e,skill);if(k==='freza'&&Math.random()<.2)await eventSpecialV218(e,EVENT_SKILLS_V163.freza.find(x=>x!==skill));}
 else {await beginEnemyLunge(e.uid);try{const all=index<=1+(e.aoeV218??q.aoe);for(const a of all?livingField():[pick(livingMain())].filter(Boolean)){await damageAlly(a,1,k==='skullMagic'?'magic':'physical',isSuper(a),e.attribute);if(k==='barion'&&Math.random()<.3)await damageAlly(a,1,'physical',isSuper(a),e.attribute);}}finally{endEnemyLunge();}}
 }finally{b.actingEnemyId=old;renderBattle();}
};
async function eventSpecialV218(e,skill){const b=state.battle,old=b.actingEnemyId;b.actingEnemyId=e.uid;try{await actionCutin(skill.name,'danger',650);await beginEnemyLunge(e.uid);for(let i=0;i<(skill.hits||1);i++){for(const a of skill.all?livingField():[pick(livingMain())].filter(Boolean)){const n=await damageAlly(a,skill.power||1.3,skill.type||'physical',isSuper(a),skill.element||e.attribute);if(n>0){for(const s of skill.status||[])if(Math.random()<(e.eventV163?.difficulty===2?skill.infChance??skill.chance:skill.chance))await inflictAllyStatus(a,s,s==='stun'?1:3);if(e.extraBossV218==='crouton')a.mpNow=Math.floor(a.mpNow*.9);if(e.extraBossV218==='kobuchi'){a.accuracyDownV218=.1;a.accuracyDownTurnsV218=rint(2,3);}if(e.extraBossV218==='mash'&&Math.random()<.1)e.hp=Math.min(e.maxHp,e.hp+n*.1);}}}if(skill.atk)e.atk*=1+skill.atk;}finally{endEnemyLunge();b.actingEnemyId=old;}}

const LEGENDS_V218=[
 {key:'caramel',name:'モブキャロメル',world:'rural',image:'spenemy/69.png',attribute:'火',level:60,evasion:.05,aoe:1},
 {key:'mu',name:'モブムゥクラブ',world:'tribe',image:'spenemy/70.png',attribute:'闇',level:70,aoe:1},
 {key:'gene',name:'モブジーン',world:'desert2',image:'spenemy/72.png',attribute:'火',level:80,aoe:1},
 {key:'magnum',name:'モブマグナム',world:'demonCastle',image:'spenemy/70.png',attribute:'無',level:90,aoe:2},
 {key:'anoko',name:'モブアノコ',world:'book',image:'spenemy/71.png',attribute:'闇',level:100,aoe:2}
];
const HELPERS_V218=[['dolphin','モブイルカエル','水','001','回復サポート','jessie'],['gonzo','モブゴンゾー','火','002','火の特技','desert'],['coach','モブコーチ','光','003','味方バフ','yusha'],['materia','モブマテリア','闇','005','状態異常','money'],['mita','モブミータ','地','006','味方バフ','pink'],['maple','モブメープル','光','009','状態異常解除','jessie'],['lightarm','モブライトアーム','風','008','高いHP','tetsu']];
const HELPER_PLAYERS_V218=HELPERS_V218.map(([key,name,attribute,img,role,base])=>({...clone(player(base)),id:'helper218-'+key,name,attribute,image:`play/${img}.png`,helperV218:role}));
const playerBaseV218=player;player=function(id){return HELPER_PLAYERS_V218.find(p=>p.id===id)||playerBaseV218(id);};
for(const [key,,,,,base]of HELPERS_V218){const id='helper218-'+key;if(TEMP_BALANCE.playerTargets?.[base])TEMP_BALANCE.playerTargets[id]=clone(TEMP_BALANCE.playerTargets[base]);if(TEMP_BALANCE.playerGrowth?.[base])TEMP_BALANCE.playerGrowth[id]=clone(TEMP_BALANCE.playerGrowth[base]);}
function legendOpenV218(q){return q.world==='book'?!!state.meta.bookCompleted:worldCleared(q.world);}
function legendRecordV218(q){return(state.meta.legendsV218??={})[q.key]??={};}
function legendPartyV218(){const rows=new Map();for(const [id,lv]of [...(state.meta.bookRosterV214||[]),...state.party])if(player(id)&&!String(id).startsWith('helper218-'))rows.set(id,[id,+lv||1]);return [...rows.values()];}
const raidBuildBaseV218=buildEnemyFromTemplate;
buildEnemyFromTemplate=function(t,...args){const e=raidBuildBaseV218(t,...args);if(t?.legendV218){e.maxHp=Math.round(e.maxHp*9);const rec=legendRecordV218(t.legendV218);e.hp=rec.remaining===undefined?e.maxHp:Math.min(e.maxHp,Math.max(Math.ceil(e.maxHp*.30),Math.ceil(rec.remaining*e.maxHp)));addAllElementResistV142(e,.10);}return e;};
const helperBuildBaseV218=buildAlly;buildAlly=function(p,...args){const a=helperBuildBaseV218(p,...args);if(p?.helperV218){for(const k of ['maxHp','maxMp','atk','mag','def','res','spd'])a[k]=Math.round(a[k]*.9);if(p.helperV218==='高いHP')a.maxHp=Math.round(a.maxHp*1.4);a.hp=a.maxHp;a.mpNow=a.maxMp;}return a;};
let legendSelectedV218=null,legendHelpersV218=[];
const legendRenderBaseV218=renderEventQuestsV163;
renderEventQuestsV163=function(){legendRenderBaseV218();const root=$('#trainingFeaturePanel'),panel=$('.event-panel-v163',root);if(!panel)return;
 if(eventViewV163==='boss'){const grid=$('.event-boss-grid-v163',panel);if(grid&&LEGENDS_V218.some(legendOpenV218)){const b=document.createElement('button');b.className='legend-door-v218';b.innerHTML='<span>？</span><strong>LEGEND BOSS</strong><small>伝説の扉を開く</small>';b.onclick=()=>{eventViewV163='legend';renderEventQuestsV163();};grid.append(b);}}
 if(eventViewV163!=='legend')return;panel.classList.add('legend-arena-v218');panel.innerHTML=`<header><h2>レジェンドボス</h2><button data-legend-back>戻る</button></header><p>仲間になっているパーティー全員＋助っ人2名で戦うレイドボス！<br>全滅してもやり直せる！諦めずなんども挑もう！</p><p>再挑戦時はボスのHPが全回復します。</p><div class="quest-cards-v218">${LEGENDS_V218.filter(legendOpenV218).map(q=>{const rec=legendRecordV218(q),ratio=1;return`<button data-legend="${q.key}"><img src="${q.image}" alt="${q.name}"><b>${q.name} Lv.${q.level}</b><meter min="0" max="1" value="${ratio}"></meter><small>次回HP ${Math.round(ratio*100)}%${rec.maxHp?` / ${Math.ceil(rec.maxHp*ratio).toLocaleString()} / ${rec.maxHp.toLocaleString()}`:''}${rec.cleared?' / CLEAR':''}</small></button>`;}).join('')}</div>`;
 $('[data-legend-back]',panel).onclick=()=>{eventViewV163='boss';renderEventQuestsV163();};$$('[data-legend]',panel).forEach(b=>b.onclick=()=>{legendSelectedV218=LEGENDS_V218.find(q=>q.key===b.dataset.legend);legendHelpersV218=[];renderHelpersV218();});
};
function renderHelpersV218(){const root=$('#trainingFeaturePanel'),q=legendSelectedV218;root.innerHTML=`<section class="quest-hub-v218 legend-arena-v218"><header><h2>${q.name}</h2><button data-back>戻る</button></header><p>助っ人を2名選択 ${legendHelpersV218.length}/2</p><div class="helper-grid-v218">${HELPERS_V218.map(([key,name,attribute,img,role])=>`<button data-helper="${key}" aria-pressed="${legendHelpersV218.includes(key)}"><img src="play/${img}.png" alt=""><b>${name}</b><small>${attribute} / ${role}</small></button>`).join('')}</div><button data-start class="primary-btn" ${legendHelpersV218.length===2?'':'disabled'}>挑戦する</button></section>`;$('[data-back]',root).onclick=()=>renderEventQuestsV163();$$('[data-helper]',root).forEach(b=>b.onclick=()=>{const key=b.dataset.helper;if(legendHelpersV218.includes(key))legendHelpersV218=legendHelpersV218.filter(x=>x!==key);else if(legendHelpersV218.length<2)legendHelpersV218.push(key);renderHelpersV218();});$('[data-start]',root).onclick=()=>startLegendV218(q,legendHelpersV218);}
async function startLegendV218(q,helpers){if(!legendOpenV218(q)||eventStartingV163||helpers.length!==2||new Set(helpers).size!==2)return false;eventStartingV163=true;try{const roster=legendPartyV218(),lv=Math.max(...roster.map(x=>+x[1])),party=[...roster,...helpers.map(id=>['helper218-'+id,lv])];$('#trainingFeaturePopup').hidden=true;const ov=eventOverlayV163();ov.innerHTML=`<div class="event-arrival-v163 legend-arena-v218"><small>LEGEND RAID</small><img src="${q.image}" alt=""><h2>${q.name}<strong>降臨!!</strong></h2></div>`;ov.hidden=false;await fixedDelay(1800);ov.hidden=true;const world=MOB_DATA.adventureWorlds.find(w=>w.id===q.world),bg=world?.areas?.[3]?.bg||'back/rpgmain.png';await startBattleLoaded({mode:'legend218',legendV218:q.key,party,returnScreen:'training',worldId:q.world,bg,fallbackBg:bg,enemyConfigs:[{template:{id:'legend218-'+q.key,...q,legendV218:q,category:'boss',actionCount:3,forceActionCount:true,v144ActionMin:3,v144ActionMax:5,noEscape:true},level:q.level}]});const e=state.battle?.enemies?.[0];if(e){const rec=legendRecordV218(q);rec.maxHp=e.maxHp;saveMeta();}$('#battleBackBtn').style.display='';renderBattle();return true;}finally{eventStartingV163=false;}}
function saveLegendV218(b,win=false){const e=b?.enemies.find(e=>e.legendV218);if(!e)return;const rec=legendRecordV218(e.legendV218);rec.remaining=win||b.legendWinV218?1:Math.max(0,e.hp/e.maxHp);rec.maxHp=e.maxHp;if(win)rec.cleared=true;saveMeta();}
const legendHitBaseV218=applyEnemyDamageTo;applyEnemyDamageTo=function(a,e,...args){if(e?.legendV218){const k=e.legendV218.key;if((k==='anoko'&&Math.random()<.08)||(k==='caramel'&&Math.random()<.05)){eventQueueV163(()=>legendSpecialV218(e));showMiss(`enemy:${e.uid}`);return{value:0,miss:true};}}
 const r=legendHitBaseV218(a,e,...args);if(e?.legendV218){if(e.hp>0&&e.legendV218.key==='magnum'&&Math.random()<.08){e.hp=Math.min(e.maxHp,e.hp+1000);for(const stat of ['atk','mag','def','res','spd'])e[stat]*=1.1;renderBattle();}saveLegendV218(state.battle);}return r;};
async function legendSpecialV218(e){if(e.hp<=0)return;const k=e.legendV218.key,skill={caramel:{name:'キャロットバレット',all:true,element:'火'},mu:{name:'ムゥハイジャンプ',all:true,status:['poison'],chance:.3},gene:{name:'イケナイネガイゴト',all:true,type:'magic',power:1.8,status:['burn'],chance:.5},magnum:{name:'マグナム・スターダスト',all:true,type:'magic',power:1.8},anoko:{name:'ジェノサイド・ナックル',power:2.5,status:['sleep'],chance:1}}[k];await eventSpecialV218(e,skill);if(k==='caramel'&&Math.random()<.7)await eventSpecialV218(e,{name:'キャロットバレット・追撃',all:true,power:.8});if(k==='magnum')for(let i=0;i<5&&Math.random()<.4;i++)await eventSpecialV218(e,{name:'マグナム・追撃',power:1.3});}
const legendActionBaseV218=enemyAction;enemyAction=async function(index=1,uid){const e=enemyByUid(uid)||actingEnemy(),b=state.battle;if(!e?.legendV218)return legendActionBaseV218(index,uid);if(!b||b.finished||e.hp<=0)return;for(const s of ['sleep','stun','paralyze'])if(e.status[s]>0){e.status[s]--;return;}const old=b.actingEnemyId,crit=enemyCriticalV163;b.actingEnemyId=e.uid;enemyCriticalV163=Math.random()<.05;try{if(index===1)await legendSpecialV218(e);else{await beginEnemyLunge(e.uid);try{for(const a of index<=e.legendV218.aoe?livingField():[pick(livingMain())].filter(Boolean))await damageAlly(a,1,'physical',false,e.attribute);}finally{endEnemyLunge();}}}finally{b.actingEnemyId=old;enemyCriticalV163=crit;saveLegendV218(b);renderBattle();}};
const legendFinishBaseV218=finishBattle;finishBattle=function(win){const b=state.battle;if(!b?.config?.legendV218)return legendFinishBaseV218(win);if(b.finished)return;b.finished=true;b.auto=false;b.legendWinV218=!!win;setCommandDisabled(true);const q=LEGENDS_V218.find(q=>q.key===b.config.legendV218),rec=legendRecordV218(q);let reward=null;if(win&&!rec.rewarded){reward=awardGachaFigureV115(figureByImageV96(`eventfig/${51+LEGENDS_V218.indexOf(q)}.png`));rec.rewarded=true;}saveLegendV218(b,win);const ov=eventOverlayV163();ov.innerHTML=`<div class="event-result-v163 legend-arena-v218"><h2>${win?'LEGEND CLEAR!!':'また挑戦しよう！'}</h2><p>${win?'伝説の討伐を記録しました。':'次回はボスのHPが全回復します。編成を整えて再挑戦しよう！'}</p>${reward?`<h3>初回確定報酬</h3><img style="width:120px;height:120px;object-fit:contain" src="${reward.f.image}" alt="${reward.f.name}"><p>${reward.f.name}${reward.converted?` / ルビー +${reward.ruby}`:reward.plus?` +${reward.plus}`:''}</p>`:''}<button data-return class="primary-btn">レジェンドボスへ戻る</button></div>`;ov.hidden=false;$('[data-return]',ov).onclick=returnLegendV218;};
function returnLegendV218(){saveLegendV218(state.battle);if(state.battle){state.battle.finished=true;state.battle.auto=false;}state.battle=null;eventOverlayV163().hidden=true;$('#resultOverlay').hidden=true;showScreen('training');eventViewV163='legend';renderEventQuestsV163();$('#trainingFeaturePopup').hidden=false;}
const legendBackV218=$('#battleBackBtn').onclick;$('#battleBackBtn').onclick=async function(){if(!state.battle?.config?.legendV218)return legendBackV218?.();const b=state.battle;if(b.busy)return;if(await narrationDialog('挑戦を終了しますか？次回はボスのHPが全回復します。',[['終了する','yes'],['続ける','no','primary']])==='yes')returnLegendV218();};
const raidRenderBaseV218=renderBattle;renderBattle=function(...args){const r=raidRenderBaseV218(...args),b=state.battle;$('#battleScreen')?.classList.toggle('raid-v218',!!b?.config?.legendV218);if(b?.config?.legendV218){$('#battleModeLabel').textContent='LEGEND RAID';const e=b.enemies[0];let bar=$('#raidHpV218');if(!bar){bar=document.createElement('div');bar.id='raidHpV218';$('#battleScreen').append(bar);}bar.textContent=`${e.name} HP ${Math.ceil(e.hp).toLocaleString()} / ${e.maxHp.toLocaleString()}`;}else $('#raidHpV218')?.remove();return r;};
