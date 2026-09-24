/* Catalogue identities are matched by image so existing saves keep their IDs. */
for(const row of CATALOG_V218.figures){
 if(row.conflictV218||row.assetMissingV218)continue;
 const f=FIGURES.find(x=>x.image===row.image),data={...row,pending:false};delete data.source;
 if(row.image.startsWith('spbossfig/')){delete data.soul;delete data.pieceSoul;data.adjacencyTags=[];}
 if(f)Object.assign(f,data);
 else FIGURES.push({...data,id:'v218-'+row.image.replace(/[/.]/g,'-'),eventExclusiveV163:row.image.startsWith('eventfig/')});
}
for(const row of CATALOG_V218.tags){const t=FIGURE_TAGS.find(t=>t.id===row.id);if(t)Object.assign(t,{name:row.name,two:row.two,three:row.three});}
for(const row of CATALOG_V218.adjacency){
 const stats={};for(const m of row.piece.matchAll(/(ATK|DEF|SPD|HP)\+(\d+)%/g))stats[{ATK:'atk',DEF:'def',SPD:'spd',HP:'maxHp'}[m[1]]]=+m[2]/100;
 const aura=row.piece.match(/このタグ発生時、(.+?)(?:の)?タグを持つすべてのフィギュアの全ステータスを(\d+)%/);
 ADJACENCY_TAGS_V174[row.id]={...row,stats,auraTag:aura?FIGURE_TAGS.find(t=>t.name===aura[1].replace(/の$/,''))?.id:null,aura:aura?+aura[2]/100:0};
}
function migrateFiguresV218(){
 const m=state.meta;if(m.figureMigrationV218)return;
 m.figureBackupV218={figures:clone(m.figures||{}),equipment:clone(m.figureEquipment||{}),deck:clone(m.mobPieceDeck||[])};
 m.figurePlusV218??={};m.subFiguresV218??={};m.figureShelfV218??=[];
 for(const [id,raw] of Object.entries(m.figures||{})){const count=Math.max(0,Math.floor(Number(raw)||0));if(!count)continue;m.figures[id]=1;m.figurePlusV218[id]=Math.min(9,count-1);if(count>10)setRubyV115(rubyOwnedV115()+(count-10)*figureOverflowRubyV115(figureById(id)));}
 const used=new Set();for(const [pid,raw] of Object.entries(m.figureEquipment||{}))m.figureEquipment[pid]=normalizeFigureEquipmentRecord(raw).map(id=>{if(!id||!figureOwned(id)||used.has(id))return null;used.add(id);return id;});
 m.figureInventoryV115Migrated=true;m.figureMigrationV218=true;saveMeta();
}
figureOverflowRubyV115=f=>({R:1,SR:3,SSR:8,UR:20,MOB:50}[f?.rarity]||1);
function figurePlusV218(id){return clamp(Number(state.meta.figurePlusV218?.[id])||0,0,9);}
awardGachaFigureV115=function(f){
 if(!f)throw new Error('フィギュアの登録がありません');migrateFiguresV218();const m=state.meta;m.figures??={};m.figureOrder??=[];m.figurePlusV218??={};
 if(!figureOwned(f.id)){m.figures[f.id]=1;if(!m.figureOrder.includes(f.id))m.figureOrder.push(f.id);return{f,ruby:0,converted:false};}
 if(figurePlusV218(f.id)<9){m.figurePlusV218[f.id]=figurePlusV218(f.id)+1;return{f,ruby:0,converted:false,plus:m.figurePlusV218[f.id]};}
 const ruby=figureOverflowRubyV115(f);setRubyV115(rubyOwnedV115()+ruby);return{f,ruby,converted:true};
};
function rawFigureEffectsV218(id){const f=figureById(id),out=emptyFigureEffects();if(!f)return out;mergeFigureEffects(out,parseFigureEffectText(f.traitText));const stats=parseFigureStatsText(f.statsText);for(const [k,v]of Object.entries(stats))if(v)stats[k]+=figurePlusV218(id);mergeFigureEffects(out,{stats});return out;}
function scaleFigureEffectsV218(value,path=''){
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,scaleFigureEffectsV218(v,path?path+'.'+k:k)]));
 if(typeof value!=='number')return false;
 const flat=path.startsWith('stats.')||/CtCut$|Flat$/.test(path),factor=flat?1:100,raw=value*factor*.3;
 return raw<=1?0:Math.floor(raw+1e-9)/factor;
}
figureEffectsFor=function(pid){const out=emptyFigureEffects();mergeFigureEffects(out,armorEffectsFor(pid));for(const id of figureEquipmentFor(pid))mergeFigureEffects(out,rawFigureEffectsV218(id));for(const r of activeFigureResonances(pid))mergeFigureEffects(out,r.effects);for(const p of adjacentPairsV174(figureEquipmentFor(pid)))mergeFigureEffects(out,parseFigureEffectText(p.tag.equipment));for(const id of state.meta.subFiguresV218?.[pid]||[])mergeFigureEffects(out,scaleFigureEffectsV218(rawFigureEffectsV218(id)));const shelf=emptyFigureEffects();for(const id of state.meta.figureShelfV218||[])mergeFigureEffects(shelf,rawFigureEffectsV218(id));mergeFigureEffects(out,scaleFigureEffectsV218(shelf));return out;};
function detachFigureV218(id){
 for(const [pid,raw]of Object.entries(state.meta.figureEquipment||{}))state.meta.figureEquipment[pid]=normalizeFigureEquipmentRecord(raw).map(x=>x===id?null:x);
 for(const [pid,raw]of Object.entries(state.meta.subFiguresV218||{}))state.meta.subFiguresV218[pid]=raw.map(x=>x===id?null:x);
 state.meta.figureShelfV218=(state.meta.figureShelfV218||[]).filter(x=>x!==id);
}
const equipBaseV218=setFigureEquipment;
setFigureEquipment=function(pid,index,id){if(id&&!figureOwned(id))return false;const backup=clone({equipment:state.meta.figureEquipment||{},sub:state.meta.subFiguresV218||{},shelf:state.meta.figureShelfV218||[]});if(id)detachFigureV218(id);const ok=equipBaseV218(pid,index,id);if(!ok){state.meta.figureEquipment=backup.equipment;state.meta.subFiguresV218=backup.sub;state.meta.figureShelfV218=backup.shelf;}return ok;};
const autoEquipBaseV218=applyFigureEquipmentSetV132;
applyFigureEquipmentSetV132=function(pid,set,...args){if(!set||set.length<4)return false;for(const f of set)detachFigureV218(f.id);return autoEquipBaseV218(pid,set,...args);};
const shelfLimitsV218={MOB:1,UR:3,SSR:5,SR:7,R:12};
function assignFigureV218(id,mode,pid,index){
 if(id&&!figureOwned(id))return false;migrateFiguresV218();
 if(mode==='shelf'){const f=figureById(id);if(!f)return false;const shelf=state.meta.figureShelfV218;if(shelf.includes(id)){state.meta.figureShelfV218=shelf.filter(x=>x!==id);saveMeta();return true;}if(shelf.filter(x=>figureById(x)?.rarity===f.rarity).length>=shelfLimitsV218[f.rarity])return false;detachFigureV218(id);state.meta.figureShelfV218.push(id);}
 else {if(!player(pid)||index<0||index>3)return false;if(id)detachFigureV218(id);state.meta.subFiguresV218??={};const row=state.meta.subFiguresV218[pid]??=[null,null,null,null];row[index]=id||null;}
 saveMeta();return true;
}
function openFigureExtraV218(mode='shelf',pid='',slot=0){
 let ov=$('#figureExtraV218');if(!ov){ov=document.createElement('div');ov.id='figureExtraV218';ov.className='figure-extra-v218';document.body.append(ov);}ov.hidden=false;
 const shelf=state.meta.figureShelfV218||[],title=mode==='shelf'?'フィギュアを飾る':`サブフィギュア ${slot+1}`;
 ov.innerHTML=`<section><header><h2>${title}</h2><button data-close>閉じる</button></header><p>ステータス・特性の30%が有効。装備と棚の同時使用はできません。</p>${mode==='shelf'?`<div class="shelf-v218">${Object.entries(shelfLimitsV218).map(([rarity,max])=>`<div><small>${rarity} ${shelf.filter(id=>figureById(id)?.rarity===rarity).length}/${max}</small><div>${shelf.filter(id=>figureById(id)?.rarity===rarity).map(id=>`<button data-figure="${id}" aria-label="${figureById(id).name}を棚から外す"><img src="${figureById(id).image}" alt="${figureById(id).name}"></button>`).join('')}</div></div>`).join('')}</div>`:'<button data-remove>外す</button>'}<div class="figure-grid-v218">${FIGURES.filter(f=>figureOwned(f.id)>0&&!f.pending).map(f=>`<button data-figure="${f.id}"><img src="${f.image}" alt=""><b>${f.name} +${figurePlusV218(f.id)}</b><small>${f.rarity}${shelf.includes(f.id)?' / 展示中':''}</small></button>`).join('')}</div></section>`;
 $('[data-close]',ov).onclick=()=>{ov.hidden=true;renderHome();if(mode==='sub')renderFigureEquipment();};
 $('[data-remove]',ov)?.addEventListener('click',()=>{assignFigureV218(null,'sub',pid,slot);ov.hidden=true;renderFigureEquipment();});
 $$('[data-figure]',ov).forEach(b=>b.onclick=()=>{if(!assignFigureV218(b.dataset.figure,mode,pid,slot))return toast('このレア度の展示枠はいっぱいです');if(mode==='shelf')openFigureExtraV218(mode);else{ov.hidden=true;renderFigureEquipment();}});
}
const homeBaseV218=renderHome;renderHome=function(...args){const r=homeBaseV218(...args);if(mapleShopUnlocked()&&!$('#shelfButtonV218')){const b=document.createElement('button');b.id='shelfButtonV218';b.textContent='フィギュアを飾る';b.onclick=()=>openFigureExtraV218();$('#homeScreen').append(b);}return r;};
const equipmentBaseV218=renderFigureEquipment;renderFigureEquipment=function(...args){equipmentBaseV218(...args);const pid=equipmentPlayerId,el=document.createElement('section');el.className='panel';el.innerHTML=`<h3>サブフィギュア / 効果30%</h3><div class="sub-figures-v218">${Array.from({length:4},(_,i)=>{const f=figureById(state.meta.subFiguresV218?.[pid]?.[i]);return`<button data-sub="${i}">${f?`<img src="${f.image}" alt="${f.name}">`:'＋'}<small>${f?f.name:'未装備'}</small></button>`;}).join('')}</div>`;$('#equipmentContent').append(el);$$('[data-sub]',el).forEach(b=>b.onclick=()=>openFigureExtraV218('sub',pid,+b.dataset.sub));};
const detailBaseV218=figureDetailMarkupV96;figureDetailMarkupV96=function(f,piece=false){return detailBaseV218(f,piece)+`<p>強化 +${figurePlusV218(f.id)} / 9</p>`+(f.soul?`<section class="adjacency-v174"><b>${piece?'モブピース SOUL':'フィギュアスキル'} / ${f.soul.name}</b>${piece?Object.entries(f.pieceSoul||{}).map(([n,s])=>`<span>SOUL ${n}：${s.text}</span>`).join(''):`<span>必要SOUL ${f.soul.cost}：${f.soul.text}</span>`}</section>`:'');};

/* Hit reactions survive renderBattle(), including the poison spell's final render. */
const hitBaseV218=applyEnemyDamageTo;
applyEnemyDamageTo=function(a,e,...args){const r=hitBaseV218(a,e,...args);if(r?.value>0&&!r.miss&&e)e.hitUntilV218=performance.now()+360;return r;};
const battleRenderBaseV218=renderBattle;
renderBattle=function(...args){const r=battleRenderBaseV218(...args);for(const e of state.battle?.enemies||[])if(e.hitUntilV218>performance.now())enemyVisual(e.uid)?.closest('.enemy-unit')?.classList.add('impact-v218');return r;};
const attackBaseV218=performAttack;
performAttack=async function(a,...args){const el=$(`[data-ally-id="${a.id}"]`);el?.classList.add('attack-v218');try{return await attackBaseV218(a,...args);}finally{el?.classList.remove('attack-v218');}};
for(const e of MOB_DATA.enemyCatalog||[])if(e.name==='モブウミナイト')e.image='enemy/119.png';
const templateBaseV218=trainingEnemyTemplate;trainingEnemyTemplate=function(...args){const t=templateBaseV218(...args);if(t?.name==='モブウミナイト')t.image='enemy/119.png';return t;};
STORY179.phoenix.diffs[0].level='75～80';
const customBaseV218=customTemplateV179;customTemplateV179=function(key,d=0){const t=customBaseV218(key,d);if(key==='phoenix')t.levelMin=t.levelMax=75;return t;};

/* Four-area Mochi story, using the established event/save/reward pipeline. */
STORY179.mochi={title:'草原の餅つきの達人！？',world:'grassland',unlock:'neon',unlockName:'ネオン街',image:'spenemy/51.png',diffs:[{name:'ノーマル',level:30,coins:5000,diamonds:10,figures:[30]},{name:'ハード',level:60,coins:10000,diamonds:30,figures:[32]},{name:'インフェルノ',level:90,coins:50000,diamonds:50,figures:[33,34]}]};
const partyBaseV218=partyV179;partyV179=function(key){return key==='mochi'?state.party.filter(([id])=>['desert','denden','pink','money'].includes(id)):partyBaseV218(key);};
const openStoryBaseV218=openV179;openV179=function(key,d=0){if(key!=='mochi')return openStoryBaseV218(key,d);const rec=recordsV179(key);return d>=0&&d<3&&(worldCleared('neon')||testAllQuestsV171())&&(d===0||rec[d-1]||testAllQuestsV171())&&(Number(rec[d]||0)<(d===0?2:1)||testAllQuestsV171());};
function mochiTemplateV218(area,d){return{id:'mochi218-'+area,name:['モブトイティラ','モブトイティラ・ムシャ','モブトイティラ・ビーム','モブトイティラ・モチ','モブスラモチ'][area],image:`spenemy/${48+area}.png`,category:area===4?'normal':'boss',attribute:area===2?'水':'風',levelMin:[30,32,33,35,30][area]+d*30,levelMax:[30,32,33,35,30][area]+d*30,mochiV218:area,mochiDifficultyV218:d,damageReduction:area===4?0:area===3?.14:.11,permanentDamageReduction:true,evasion:.06,actionCount:area===4?1:3,forceActionCount:true,v144ActionMin:area===4?1:3,v144ActionMax:area===4?2:3,noEscape:true};}
const waveBaseV218=waveV179;waveV179=function(key,area,d){if(key!=='mochi')return waveBaseV218(key,area,d);const t=mochiTemplateV218(area,d);return[{template:t,level:t.levelMin}];};
const actorBaseV218=storyActorInfo;storyActorInfo=function(key){if(String(key).startsWith('mochi218-')){const t=mochiTemplateV218(+key.split('-')[1],0);return{...t,enemyTemplate:t};}return actorBaseV218(key);};
PRE_V179.mochi=[
 [['say','pink','みなさん\nお餅は好きでありますか？'],['jumpSayV179','denden','大好きでやんす～！'],['say','desert','まあ、嫌いではない'],['say','money','う～ん\nあまり食べないかな'],['say','pink','草原には\n餅つき名人がいるであります！'],['jumpSayV179','denden','お餅が食べれるでやんすか！'],['mochiEntranceV218',0],['say','pink','たしかこんな感じの・・'],['say','denden','お餅一つ～！\nでやんす！'],['say','money','なんか違うみたいよ？']],
 [['mochiEntranceV218',1],['say','money','あれ？\nさっきのやつまたいるわよ'],['say','pink','なにか食べているであります！'],['say','denden','お餅でやんすか！？']],
 [['mochiEntranceV218',2],['say','denden','ビームでやんす～！'],['say','pink','かっけ～であります！']],
 [['mochiEntranceV218',3]]
];
POST_V179.mochi=[
 [['say','desert','やはり\n強力なモンスターばかりだな'],['sayDual','pink','油断してたでありますね～','denden','油断してたでやんすね～'],['shakeSayV179','money','あらら～？'],['say','desert','俺もまだまだか・・']],
 [['say','desert','どんどん強くなってるな'],['say','money','なんか嫌～な予感']],
 [['say','money','ん・・？\n何かいい匂いしない？']],
 [['jumpSayV179','denden','オイラ、\n当分お餅は要らないでやんす・・']]
];
const stepsBaseV218=runStoryStepsV179;runStoryStepsV179=async function(steps){for(const st of steps){if(st[0]!=='mochiEntranceV218'){await stepsBaseV218([st]);continue;}await storyShowGuest('mochi218-'+st[1]);const el=$('#storyGuest');await animateV157(el,st[1]===2?[{translate:'0 -240px',rotate:'-15deg'},{translate:'0 0',rotate:'15deg'},{rotate:'0deg'}]:[{translate:'240px 0'},{translate:'150px -35px'},{translate:'90px 0'},{translate:'40px -30px'},{translate:'0 0'}],1100);}};
const rewardBaseV218=rewardV179;rewardV179=function(){const r=eventRunV174;if(r?.storyV179!=='mochi')return rewardBaseV218();if(r.rewarded)return null;const rec=recordsV179('mochi'),count=Number(rec[r.difficulty]||0),d=STORY179.mochi.diffs[r.difficulty];r.rewarded=true;rec[r.difficulty]=count+1;const figures=r.difficulty===0&&count===1?[31]:d.figures;state.coins+=d.coins;state.meta.coins=state.coins;state.meta.diamonds=(Number(state.meta.diamonds)||0)+d.diamonds;const awarded=figures.map(n=>awardGachaFigureV115(figureByImageV96(`eventfig/${n}.png`)));saveMeta();return{...d,figures,awarded};};
const buildBaseV218=buildEnemyFromTemplate;buildEnemyFromTemplate=function(t,...args){const e=buildBaseV218(t,...args);if(t?.mochiV218!==undefined){e.mochiV218=t.mochiV218;e.mochiDifficultyV218=t.mochiDifficultyV218;if(t.mochiV218!==4)addAllElementResistV142(e,.15);}if(e?.name==='モブウミナイト')e.image='enemy/119.png';return e;};
const mochiHitBaseV218=applyEnemyDamageTo;applyEnemyDamageTo=function(a,e,power,type='physical',...args){if(e?.mochiV218===undefined)return mochiHitBaseV218(a,e,power,type,...args);const cut=e.damageReduction,body=e.mochiV218!==4&&Math.random()<.20;const extra=(e.mochiV218===2?type==='physical':type==='magic')&&e.mochiV218!==4?.10:0;e.damageReduction=1-(1-cut)*(1-extra)*(body?.9:1);try{const r=mochiHitBaseV218(a,e,power,type,...args);if(body&&r?.value>0&&e.hp>0)queueEnemyCounterV142(e,a,1.3);return r;}finally{e.damageReduction=cut;}};
const enemyActionBaseV218=enemyAction;enemyAction=async function(action=1,uid){const e=enemyByUid(uid)||actingEnemy(),b=state.battle;if(e?.mochiV218===undefined)return enemyActionBaseV218(action,uid);if(!b||b.finished||e.hp<=0)return;for(const k of ['sleep','stun','paralyze'])if(e.status[k]>0){e.status[k]--;return;}
 const old=b.actingEnemyId;b.actingEnemyId=e.uid;try{
 if(e.mochiV218===3&&action===1&&(b.turn-1)%3===0&&e.mochiSummonTurnV218!==b.turn){e.mochiSummonTurnV218=b.turn;await actionCutin('餅つきの達人','danger',700);const free=Math.max(0,5-livingEnemies().length);for(let i=0;i<Math.min(2,free);i++){const t=mochiTemplateV218(4,e.mochiDifficultyV218),add=buildEnemyFromTemplate(t,t.levelMin);b.enemies.push(add);}renderBattle();for(const add of b.enemies.filter(x=>x.mochiV218===4&&x.hp>0))enemyVisual(add.uid)?.animate([{transform:'translateY(-140px) scale(.3,1.5)'},{transform:'scale(1.35,.7)'},{transform:'scale(1)'}],{duration:650});const n=e.mochiSummonsV218=(e.mochiSummonsV218||0)+1;for(const [id,line]of [[['denden','お、お見事でやんす！'],['money','感心している場合じゃないでしょう!!']],[['pink','職人技であります！！'],['desert','キリがないな']],[['denden','いい加減にするでやんす！！']],[['pink','もう見飽きたであります！！']]][n-1]||[])await allyStoryCutin(id,line);return;}
 if([1,3].includes(e.mochiV218)&&action===1&&b.turn%3===0){await actionCutin('トイ・ムシャムシャ','heal',650);eventHealV163(e,.25);e.defBuff=.20;e.defBuffTurns=3;renderBattle();return;}
 const special=action===1,all=action===2||(action===3&&Math.random()<.5),beam=e.mochiV218===2;
 if(special)await actionCutin(beam?'トイ・ビーム':e.mochiV218===4?'風の魔法':'トイ・ヘッドバッド','danger',650);
 await beginEnemyLunge(e.uid);try{for(const t of all?livingField():[pick(livingMain())].filter(Boolean)){const dealt=await damageAlly(t,special?(beam?1.8:1.3):1,e.mochiV218===4?'magic':'physical',isSuper(t),e.attribute);if(dealt>0&&special){if(beam){if(Math.random()<.8)await inflictAllyStatus(t,'sleep',3);}else if(e.mochiV218!==4)soulBuffV218(t,'baseResist:風',-.10,rint(2,3));}}}finally{endEnemyLunge();}
 }finally{b.actingEnemyId=old;renderBattle();}};

/* Real scroll snap pages retain keyboard and native swipe navigation. */
const eventRenderBaseV218=renderEventQuestsV163;
renderEventQuestsV163=function(){eventRenderBaseV218();const root=$('#trainingFeaturePanel'),panel=$('.event-panel-v163',root);if(!panel)return;
 panel.classList.add('quest-hub-v218','quest-enter-v218');panel.dataset.questTheme=eventViewV163==='story'?'story':'boss';
 if(eventViewV163==='story'&&!selectedStoryV179&&(worldCleared('neon')||testAllQuestsV171())){const b=document.createElement('button');b.className='event-story-card-v174';b.innerHTML=`<img class="event-portrait-v163 ${seenV179('mochi')?'':'silhouette'}" src="spenemy/51.png" alt=""><strong>草原の餅つきの達人！？</strong>`;b.onclick=()=>{selectedStoryV179='mochi';renderEventQuestsV163();};($('.event-story-list-v177',panel)||panel).append(b);}
 if(eventViewV163==='story'&&selectedStoryV179==='mochi'){const card=$('.event-story-card-v174',panel);if(card){const p=document.createElement('p');p.textContent='出撃可能：モブデザート / モブデンデン / モブピンク / モブマニー';card.append(p);}$$('[data-v179-start]',panel).forEach(b=>{const d=+b.dataset.v179Start.split(':')[1],p=document.createElement('p');p.textContent=d===0?'初回報酬：フィギュア30 / 2回目報酬：フィギュア31':'初回報酬のみ';b.append(p);});}
 const grid=$('.event-boss-grid-v163,.event-story-list-v177',panel);if(grid)grid.classList.add('quest-cards-v218');
};
migrateFiguresV218();
window.__mobBuildVersion='v218';
