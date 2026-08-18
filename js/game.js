(() => {
'use strict';

const $=(s,p=document)=>p.querySelector(s);
const $$=(s,p=document)=>[...p.querySelectorAll(s)];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const rint=(a,b)=>Math.floor(a+Math.random()*(b-a+1));
const pct=(n,max)=>max?clamp(n/max*100,0,100):0;
const clone=v=>JSON.parse(JSON.stringify(v));
const GAME_ASSET_VERSION=35;
function versionedPlay(src){if(!src)return'';return /^play\//.test(src)?`${src}${src.includes('?')?'&':'?'}mqv=${GAME_ASSET_VERSION}`:src;}
function loadTestSettings(){try{const v=JSON.parse(localStorage.getItem('mobQuestTestSettingsV1'));if(v&&typeof v==='object')return{enabled:!!v.enabled,fast5:!!v.fast5};}catch(_){}return{enabled:false,fast5:false};}
function saveTestSettings(){try{localStorage.setItem('mobQuestTestSettingsV1',JSON.stringify(state.test));}catch(_){}}

const screens={home:$('#homeScreen'),loading:$('#loadingScreen'),tavern:$('#tavernScreen'),training:$('#trainingScreen'),adventure:$('#adventureScreen'),battle:$('#battleScreen')};
const defaultParty=[['yusha',5],['pink',5]];
const state={
  party:loadParty(), coins:12500,
  training:{party:null,enemySlots:[{id:'boss-hawk',level:10},null,null,null],activeEnemySlot:0,filter:'草原'},
  adventure:loadAdventure(),
  battle:null, speed:1, tavernSwapIndex:null,
  test:loadTestSettings(),
  noticeQueue:[],noticeBusy:false
};
let scriptedBattleResolve=null;

const PASSIVE_RATE_SCALE=.80;
function spriteScale(){return 1;}
function passiveChance(base){return Math.random()<(base*PASSIVE_RATE_SCALE);}

function canonicalPlayerId(id){return id==='jerry'?'jessie':id;}
function player(id){const cid=canonicalPlayerId(id);return MOB_DATA.players.find(x=>x.id===cid);}
function boss(id){return MOB_DATA.bosses.find(x=>x.id===id);}
function enemyTemplate(id){return MOB_DATA.enemyCatalog?.find(x=>x.id===id)||null;}
function legacyBossTemplate(b){return{id:`legacy-${b.id}`,bossId:b.id,name:b.name,stage:b.stage,category:'boss',attribute:b.attribute,image:b.image,symbol:b.symbol||'敵',levelMin:50,levelMax:50,special:b.special,kind:b.kind,power:b.power,hits:b.hits,bg:b.bg,fallbackBg:b.fallbackBg,trainingLegacy:true};}
function trainingEnemyCatalog(){const base=[...(MOB_DATA.enemyCatalog||[])],seen=new Set(base.map(x=>x.bossId).filter(Boolean));for(const b of MOB_DATA.bosses||[])if(!seen.has(b.id))base.push(legacyBossTemplate(b));return base;}
function trainingEnemyTemplate(id){return enemyTemplate(id)||trainingEnemyCatalog().find(x=>x.id===id)||null;}
function currentWorld(){return MOB_DATA.adventureWorlds?.[clamp(state.adventure.worldIndex||0,0,(MOB_DATA.adventureWorlds?.length||1)-1)]||MOB_DATA.adventureWorlds?.[0];}
function currentArea(){const w=currentWorld();return w?.areas?.[clamp(state.adventure.areaIndex||0,0,3)]||w?.areas?.[0];}
function normalizeElement(attr){return ['火','水','雷','地','風','光','闇','無'].find(e=>String(attr).includes(e))||'無';}
function playerLevelCap(){if(state.test?.enabled)return 120;const worlds=MOB_DATA.adventureWorlds||[],castle=worlds.findIndex(w=>w.id==='demonCastle'),wi=Number(state.adventure?.worldIndex)||0;if(castle<0)return 99;return (wi>castle||(wi===castle&&state.adventure?.completed))?120:99;}
function delay(ms){return new Promise(r=>setTimeout(r,Math.max(25,ms/state.speed)));}
function fixedDelay(ms){return new Promise(r=>setTimeout(r,ms));}
function showScreen(name){Object.entries(screens).forEach(([k,v])=>v.classList.toggle('active',k===name));}
function toast(text){const el=$('#toast');el.textContent=text;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),1600);}

function saveParty(){try{localStorage.setItem('mobQuestPartyV4',JSON.stringify(state.party.slice(0,10)));}catch(_){} }
function loadParty(){
  try{
    const raw=localStorage.getItem('mobQuestPartyV4')||localStorage.getItem('mobQuestPartyV3')||localStorage.getItem('mobQuestPartyV2');
    const v=JSON.parse(raw);if(Array.isArray(v)&&v.length){const seen=new Set();const clean=v.filter(x=>Array.isArray(x)&&player(x[0])).map(x=>[canonicalPlayerId(x[0]),clamp(Number(x[1])||1,1,120)]).filter(x=>!seen.has(x[0])&&(seen.add(x[0])||true)).slice(0,10);if(clean.length)return clean;}
  }catch(_){}
  return defaultParty.map(x=>[...x]);
}
function defaultAdventure(){return {worldIndex:0,areaIndex:0,battleIndex:0,battleReady:false,completed:false,pendingEncounter:null,vitals:null,checkpoint:null,storyFlags:{},pendingPostStory:null};}
function loadAdventure(){
  try{const v=JSON.parse(localStorage.getItem('mobQuestAdventureV5'));if(v&&typeof v==='object'){const out={...defaultAdventure(),...v};out.storyFlags=(v.storyFlags&&typeof v.storyFlags==='object')?v.storyFlags:{};const last=Math.max(0,(MOB_DATA.adventureWorlds?.length||1)-1);if(out.completed&&Number(out.worldIndex)<last){out.completed=false;out.worldIndex=Math.min(last,(Number(out.worldIndex)||0)+1);out.areaIndex=0;out.battleIndex=0;out.battleReady=false;out.pendingEncounter=null;out.vitals=null;}out.worldIndex=clamp(Number(out.worldIndex)||0,0,last);return out;}}catch(_){}
  try{const old=JSON.parse(localStorage.getItem('mobQuestAdventureV4'));if(old&&typeof old==='object')return{...defaultAdventure(),areaIndex:clamp(Number(old.progress)||0,0,3),battleReady:!!old.battleReady,completed:false,vitals:old.vitals||null,checkpoint:null};}catch(_){}
  return defaultAdventure();
}
function saveAdventure(){try{localStorage.setItem('mobQuestAdventureV5',JSON.stringify(state.adventure));}catch(_){} }

function bindImage(img){if(!img||img.dataset.bound==='1')return;img.dataset.bound='1';img.draggable=false;img.addEventListener('error',()=>{const f=img.dataset.fallbackSrc;if(f&&img.dataset.tried!=='1'){img.dataset.tried='1';img.src=f;return;}img.classList.add('asset-missing');});img.addEventListener('load',()=>img.classList.remove('asset-missing'));}
function bindImages(root=document){$$('img',root).forEach(bindImage);}
function setImage(img,src,fallback=''){if(!img)return;img.classList.remove('asset-missing');img.dataset.tried='0';if(fallback)img.dataset.fallbackSrc=fallback;img.src=src;bindImage(img);}

const assetPreloadCache=new Map();
const assetImageCache=new Map();
function preloadAsset(src,priority='auto'){
  if(!src)return Promise.resolve(false);
  if(assetPreloadCache.has(src))return assetPreloadCache.get(src);
  const img=new Image();
  img.decoding='async';
  try{img.fetchPriority=priority;}catch(_){}
  assetImageCache.set(src,img);
  const task=new Promise(resolve=>{
    let settled=false;
    let watchdog=0;
    const done=async ok=>{
      if(settled)return;
      settled=true;
      clearTimeout(watchdog);
      img.onload=null;
      img.onerror=null;
      if(ok&&img.decode){
        try{await Promise.race([img.decode(),new Promise(r=>setTimeout(r,900))]);}catch(_){}
      }
      resolve(!!ok);
    };
    img.onload=()=>done(true);
    img.onerror=()=>done(false);
    /* A stalled GitHub Pages/image request must never freeze the whole game. */
    watchdog=setTimeout(()=>done(false),3200);
    try{img.src=src;}catch(_){done(false);return;}
    if(img.complete)done(img.naturalWidth>0);
  });
  assetPreloadCache.set(src,task);
  return task;
}
async function preloadAssets(paths,onProgress){
  const unique=[...new Set((paths||[]).filter(Boolean))];
  if(!unique.length){onProgress?.(1,1);return;}
  let done=0;
  await Promise.allSettled(unique.map(async src=>{
    try{return await preloadAsset(src);}finally{
      done++;
      onProgress?.(done,unique.length);
    }
  }));
}
async function preloadAssetsSafe(paths,timeout=800){
  try{
    await Promise.race([
      preloadAssets(paths),
      new Promise(resolve=>setTimeout(resolve,timeout))
    ]);
  }catch(_){/* visual preload must never stop battle flow */}
}
function fastWarmAssetList(){
  /* v21: warm the current party first. Do not flood mobile Safari with every asset at boot. */
  const partyPlayers=state.party.map(([id])=>player(id)).filter(Boolean);
  const partyImages=partyPlayers.map(p=>versionedPlay(p.image)).filter(Boolean);
  const partyMagic=partyPlayers.flatMap(p=>Object.values(MOB_DATA.elements).find(e=>e===MOB_DATA.elements[normalizeElement(p.attribute)])?.frames||[]).filter(Boolean);
  const mainUlts=partyPlayers.slice(0,4).flatMap(p=>(p.ults||[]).map(u=>u.image)).filter(Boolean);
  const restUlts=MOB_DATA.players.flatMap(p=>(p.ults||[]).map(u=>u.image)).filter(Boolean);
  const restMagic=Object.values(MOB_DATA.elements).flatMap(e=>e.frames||[]).filter(Boolean);
  return [...new Set([...partyImages,...partyMagic,...mainUlts,...restUlts,...restMagic])];
}
let backgroundWarmStarted=false;
function startFastBackgroundWarmup(){
  if(backgroundWarmStarted)return;
  backgroundWarmStarted=true;
  const queue=fastWarmAssetList();
  let cursor=0;
  const workers=Math.min(2,queue.length); // network/decode contention is much lower on iPhone
  const idle=()=>new Promise(resolve=>{
    if('requestIdleCallback' in window)requestIdleCallback(()=>resolve(),{timeout:180});
    else setTimeout(resolve,24);
  });
  const run=async()=>{
    while(cursor<queue.length){
      const src=queue[cursor++];
      try{await preloadAsset(src,'low');}catch(_){}
      await idle();
    }
  };
  for(let i=0;i<workers;i++)run();
}
function nextPaint(count=1){return new Promise(resolve=>{const step=()=>count--<=1?requestAnimationFrame(()=>resolve()):requestAnimationFrame(step);requestAnimationFrame(step);});}
async function ensureDomImageReady(img,src,timeout=650){
  if(!img||!src)return false;
  try{await Promise.race([preloadAsset(src,'high'),new Promise(r=>setTimeout(()=>r(false),timeout))]);}catch(_){}
  const abs=new URL(src,document.baseURI).href;
  if(img.src!==abs)img.src=src;
  try{
    if(img.decode)await Promise.race([img.decode(),new Promise(r=>setTimeout(r,timeout))]);
    else if(!img.complete)await Promise.race([new Promise(r=>{img.addEventListener('load',r,{once:true});img.addEventListener('error',r,{once:true});}),new Promise(r=>setTimeout(r,timeout))]);
  }catch(_){}
  await new Promise(requestAnimationFrame);
  return !!img.naturalWidth;
}
function pageAssets(target){
  const party=state.party.map(([id])=>player(id)).filter(Boolean);
  const common=['icon/01.png',versionedPlay('play/02.png'),'mqicon/06.png','mqicon/09.png','mqicon/10.png','mqicon/12.png'];
  if(target==='tavern')return [...common,'back2/001.png',...party.map(p=>versionedPlay(p.image))];
  if(target==='training'){const first=state.training.enemySlots?.find(Boolean);return ['back2/002.png',trainingEnemyTemplate(first?.id)?.image];}
  if(target==='adventure'){const w=currentWorld(),area=currentArea();return [...common,area?.bg,w?.fieldFallback,'mqicon/14.png','mqicon/15.png','mqicon/16.png',...party.slice(0,6).map(p=>versionedPlay(p.image))];}
  return common;
}
function configEnemyAssetRecords(config){
  if(Array.isArray(config.enemies))return config.enemies;
  if(Array.isArray(config.enemyConfigs))return config.enemyConfigs.map(x=>trainingEnemyTemplate(x.id)).filter(Boolean);
  if(Array.isArray(config.waves))return config.waves.flat().map(x=>trainingEnemyTemplate(x.id)).filter(Boolean);
  if(config.enemy)return [config.enemy];
  if(config.bossId)return [boss(config.bossId)].filter(Boolean);
  return [];
}
function battleAssets(config){
  const partyList=(config.party||state.party).slice(0,6),chars=partyList.map(([id])=>player(id)).filter(Boolean),enemies=configEnemyAssetRecords(config);
  return [...enemies.flatMap(e=>[e?.image,e?.bg,e?.fallbackBg]),...chars.map(c=>versionedPlay(c.image))].filter(Boolean);
}
function battleCriticalAssets(config){
  const partyList=(config.party||state.party).slice(0,4),chars=partyList.map(([id])=>player(id)).filter(Boolean),enemies=configEnemyAssetRecords(config);
  return [...enemies.flatMap(e=>[e?.image]),config.bg,config.fallbackBg,...enemies.slice(0,1).flatMap(e=>[e?.bg,e?.fallbackBg]),...chars.map(c=>versionedPlay(c.image))].filter(Boolean);
}
function battleActionAssets(config){
  const partyList=(config.party||state.party).slice(0,6),chars=partyList.map(([id])=>player(id)).filter(Boolean);
  const magic=chars.flatMap(c=>MOB_DATA.elements[normalizeElement(c.attribute)]?.frames||[]),ults=chars.flatMap(c=>(c.ults||[]).map(u=>u.image)),support=chars.slice(4).map(c=>versionedPlay(c.image));
  return [...new Set([...support,...magic,...ults].filter(Boolean))];
}
function warmBattleActionAssets(config){const queue=battleActionAssets(config);let i=0;const run=async()=>{while(i<queue.length){const src=queue[i++];try{await preloadAsset(src,'low');}catch(_){}await new Promise(r=>setTimeout(r,12));}};run();run();}
async function loadingWithAssets(text,assets){
  showScreen('loading');
  $('#loadingText').textContent=text;
  $('#loadingBar').style.width='0%';
  const detail=$('#loadingDetail');
  if(detail)detail.textContent='0%';
  let acceptingProgress=true;
  const preloadJob=preloadAssets(assets,(done,total)=>{
    if(!acceptingProgress)return;
    const per=Math.round(done/Math.max(1,total)*100);
    $('#loadingBar').style.width=`${per}%`;
    if(detail)detail.textContent=`${done} / ${total}　${per}%`;
  });
  /* Second watchdog: even an unexpected browser/network bug cannot trap the player on LOADING. */
  const timedOut=await Promise.race([
    preloadJob.then(()=>false).catch(()=>false),
    new Promise(resolve=>setTimeout(()=>resolve(true),5200))
  ]);
  acceptingProgress=false;
  $('#loadingBar').style.width='100%';
  if(detail)detail.textContent=timedOut?'READY / SKIP':'READY';
  await fixedDelay(timedOut?80:140);
}

function commonNavMarkup(){return `<button data-nav="home" type="button"><span><img src="mqicon/06.png" alt=""><i>⌂</i></span><b>HOME</b></button><button data-nav="equipment" type="button"><span><img src="mqicon/10.png" alt=""><i>◇</i></span><b>装備</b></button><button data-nav="items" type="button"><span><img src="mqicon/12.png" alt=""><i>□</i></span><b>持ち物</b></button><button data-nav="settings" type="button"><span><img src="mqicon/09.png" alt=""><i>⚙</i></span><b>設定</b></button>`;}
function initCommonNav(){$$('[data-common-nav]').forEach(n=>n.innerHTML=commonNavMarkup());$$('[data-nav]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.nav==='home'){goHome();}else if(b.dataset.nav==='settings')openSettings();else toast(`${b.textContent.trim()}は仕様待ちです`);}));bindImages();}

async function dialog(text,choices=[['OK','ok']],speaker='モブピンク'){
  const overlay=$('#dialogOverlay');$('#dialogSpeaker').textContent=speaker;$('#dialogText').textContent=text;$('#dialogChoices').innerHTML=choices.map(([label,val,cls=''])=>`<button type="button" data-dialog-value="${val}" class="${cls}">${label}</button>`).join('');overlay.hidden=false;
  return new Promise(resolve=>{$$('[data-dialog-value]',overlay).forEach(btn=>btn.onclick=()=>{overlay.hidden=true;resolve(btn.dataset.dialogValue);});});
}
async function travelTo(target,text,after){
  if(target==='training'){
    /* v21: a short critical preload only; the setup screen becomes interactive immediately afterwards. */
    showScreen('loading');$('#loadingText').textContent=text;$('#loadingBar').style.width='38%';const detail=$('#loadingDetail');if(detail)detail.textContent='ROOM';
    await preloadAssetsSafe(pageAssets(target),520);
    $('#loadingBar').style.width='100%';if(detail)detail.textContent='READY';
    if(after)after();showScreen(target);
    return;
  }
  await loadingWithAssets(text,pageAssets(target));if(after)after();showScreen(target);
}

const HOME_COMMON_SCALE_MAX=0.16;
async function applyHomeCommonScale(){
  /* v34: HOME no longer renders party character PNGs. Kept as a no-op so old resize hooks stay safe. */
  return;
}
async function renderHome(){
  $('#coinValue').textContent=state.coins.toLocaleString();
}
async function goHome(){
  /* HOME deliberately avoids player PNGs: this removes the native-size flash and unnecessary decode work. */
  showScreen('loading');
  $('#loadingText').textContent='HOMEを準備しています…';
  $('#loadingBar').style.width='35%';
  const detail=$('#loadingDetail');if(detail)detail.textContent='HOME';
  await preloadAssetsSafe(['back/rpgmain.png','icon/01.png'],900);
  $('#loadingBar').style.width='100%';if(detail)detail.textContent='READY';
  await renderHome();
  showScreen('home');
}

function zoneForIndex(i){return i<4?{key:'MAIN',label:'戦闘メンバー',n:i+1,cls:'main-slot'}:i<6?{key:'SUPER SUB',label:'自動支援',n:i-3,cls:'super-slot'}:{key:'RESERVE',label:'控えメンバー',n:i-5,cls:'reserve-slot'};}
function rosterCard(p,selected,level){return `<button class="roster-card ${selected?'selected':''}" data-roster-id="${p.id}" type="button"><span class="roster-art"><img src="${versionedPlay(p.image)}" alt="${p.name}" loading="lazy" decoding="async"><i>${p.symbol}</i></span><b>${p.name}</b><small>${p.attribute} / ${p.weapon}</small><em>Lv${level}</em></button>`;}
function renderTavern(){
  const levels=new Map(state.party.map(([id,lv])=>[id,lv]));
  const m=Math.min(4,state.party.length),s=Math.max(0,Math.min(2,state.party.length-4)),r=Math.max(0,state.party.length-6);
  $('#tavernPartyCount').textContent=`MAIN ${m}/4・SUPER ${s}/2・控え ${r}/4`;
  $('#tavernSlots').innerHTML=Array.from({length:10},(_,i)=>{const slot=state.party[i],z=zoneForIndex(i);const prefix=`<div class="formation-zone-label ${i===0?'first':''} ${i===4?'super-start':''} ${i===6?'reserve-start':''}"><b>${z.key}</b><span>${z.label} ${z.n}</span></div>`;if(!slot)return`${prefix}<div class="tavern-slot empty ${z.cls}"><b>EMPTY</b><small>${z.label}を選択</small></div>`;const p=player(slot[0]);const selected=state.tavernSwapIndex===i;return`${prefix}<div class="tavern-slot ${z.cls} ${selected?'swap-selected':''}"><span><img src="${versionedPlay(p.image)}" alt="${p.name}" loading="lazy" decoding="async"><i>${p.symbol}</i></span><div><b>${p.name}</b><small>${p.attribute} / ${p.role}</small></div><label>Lv<input class="tavern-level" data-id="${p.id}" type="number" min="1" max="${playerLevelCap()}" inputmode="numeric" value="${slot[1]}"></label><div class="slot-actions"><button data-swap-slot="${i}" type="button">↕</button><button data-remove-member="${p.id}" type="button">×</button></div></div>`;}).join('');
  $('#rosterGrid').innerHTML=MOB_DATA.players.map(p=>rosterCard(p,state.party.some(x=>x[0]===p.id),levels.get(p.id)||5)).join('');bindImages($('#tavernScreen'));
  $$('.tavern-level').forEach(i=>i.onchange=()=>{const x=state.party.find(v=>v[0]===i.dataset.id);if(x)x[1]=clamp(Number(i.value)||1,1,playerLevelCap());});
  $$('[data-remove-member]').forEach(b=>b.onclick=()=>{if(state.party.length<=1)return toast('最低1人は必要です');state.party=state.party.filter(x=>x[0]!==b.dataset.removeMember);state.tavernSwapIndex=null;renderTavern();});
  $$('[data-swap-slot]').forEach(b=>b.onclick=()=>{const idx=Number(b.dataset.swapSlot);if(state.tavernSwapIndex===null){state.tavernSwapIndex=idx;toast('入れ替えるもう1人を選んでください');return renderTavern();}if(state.tavernSwapIndex===idx){state.tavernSwapIndex=null;return renderTavern();}const a=state.tavernSwapIndex;if(state.party[a]&&state.party[idx])[state.party[a],state.party[idx]]=[state.party[idx],state.party[a]];state.tavernSwapIndex=null;renderTavern();});
  $$('[data-roster-id]').forEach(b=>b.onclick=()=>{const id=b.dataset.rosterId;const idx=state.party.findIndex(x=>x[0]===id);if(idx>=0){if(state.party.length<=1)return toast('最低1人は必要です');state.party.splice(idx,1);}else{if(state.party.length>=10)return toast('MAIN4＋SUPER2＋控え4で最大10人です');state.party.push([id,5]);}state.tavernSwapIndex=null;renderTavern();});
}

function ensureTrainingParty(){
  if(!Array.isArray(state.training.party))state.training.party=state.party.map(x=>[...x]);
  const src=state.training.party,seen=new Set();
  state.training.party=Array.from({length:10},(_,i)=>{const x=src[i];if(!Array.isArray(x)||!player(x[0])||seen.has(x[0]))return null;seen.add(x[0]);return[x[0],clamp(Number(x[1])||5,1,120)];});
  return state.training.party;
}
function trainingParty(){return ensureTrainingParty().filter(Boolean).map(x=>[...x]);}
function ensureTrainingEnemies(){
  if(!Array.isArray(state.training.enemySlots))state.training.enemySlots=[{id:'boss-hawk',level:10},null,null,null];
  state.training.enemySlots=Array.from({length:4},(_,i)=>{const x=state.training.enemySlots[i];if(!x||!trainingEnemyTemplate(x.id))return null;const t=trainingEnemyTemplate(x.id);return{id:x.id,level:clamp(Number(x.level)||t.levelMin||1,1,120)};});
  state.training.activeEnemySlot=clamp(Number(state.training.activeEnemySlot)||0,0,3);
  return state.training.enemySlots;
}
function trainingEnemyList(){return ensureTrainingEnemies().filter(Boolean);}
function enemyCategoryLabel(t){return t.category==='boss'?'BOSS':t.category==='elite'?'中ボス':'モンスター';}
function renderTraining(){
  ensureTrainingParty();ensureTrainingEnemies();
  const setup=state.training.party;
  $('#trainingPartySetup').innerHTML=Array.from({length:10},(_,i)=>{
    const slot=setup[i],z=zoneForIndex(i),start=i===0||i===4||i===6,p=slot?player(slot[0]):null,lv=slot?.[1]||5;
    const options=`<option value="" ${!slot?'selected':''}>— 空き —</option>`+MOB_DATA.players.map(q=>`<option value="${q.id}" ${p?.id===q.id?'selected':''}>${q.name} / ${q.attribute}</option>`).join('');
    return`${start?`<div class="training-zone-title ${i===4?'super':i===6?'reserve':''}"><b>${z.key}</b><small>${i<4?'戦闘開始メンバー':i<6?'2～5ターンごとに自動行動':'待機メンバー'}</small></div>`:''}<div class="training-slot ${z.cls} ${slot?'':'empty'}"><span>${p?`<img src="${versionedPlay(p.image)}" alt="${p.name}" loading="lazy" decoding="async"><i>${p.symbol}</i>`:'<i class="training-empty-mark">＋</i>'}</span><div class="training-slot-info"><small>${z.key} ${z.n}</small><select data-training-member="${i}">${options}</select></div><label>Lv<input data-training-level="${i}" type="number" min="1" max="120" inputmode="numeric" value="${lv}" ${slot?'':'disabled'}></label></div>`;
  }).join('');
  const slots=state.training.enemySlots,active=state.training.activeEnemySlot,enemyCount=slots.filter(Boolean).length,partyCount=trainingParty().length,previewPartySize=Math.max(1,Math.min(4,partyCount));
  $('#trainingEnemySlots').innerHTML=slots.map((x,i)=>{if(!x)return`<button class="training-enemy-slot empty ${active===i?'active':''}" data-training-enemy-slot="${i}" type="button"><b>ENEMY ${i+1}</b><span>＋</span><small>この枠を選択</small></button>`;const t=trainingEnemyTemplate(x.id),st=enemyStatPreview(t,x.level,enemyCount,previewPartySize);return`<div class="training-enemy-slot filled ${active===i?'active':''}" data-training-enemy-slot="${i}"><button class="training-enemy-select" type="button"><span><img src="${t.image||''}" alt="${t.name}" loading="lazy" decoding="async"><i>${t.symbol||'敵'}</i></span><div><small>ENEMY ${i+1} / ${enemyCategoryLabel(t)}</small><b>${t.name}</b><em>${t.attribute}　HP ${st.maxHp.toLocaleString()} / ATK ${st.atk}</em></div></button><label>Lv<input data-training-enemy-level="${i}" type="number" min="1" max="120" inputmode="numeric" value="${x.level}"></label><button class="training-enemy-remove" data-training-enemy-remove="${i}" type="button">×</button></div>`;}).join('');
  const catalog=trainingEnemyCatalog(),stages=['ALL',...new Set(catalog.map(b=>b.stage))];
  if(state.training.filter!=='ALL'&&!stages.includes(state.training.filter))state.training.filter='ALL';
  $('#bossTabs').innerHTML=stages.map(stage=>`<button class="boss-tab ${state.training.filter===stage?'active':''}" data-boss-stage="${stage}" type="button">${stage==='ALL'?'全て':stage}</button>`).join('');
  const list=state.training.filter==='ALL'?catalog:catalog.filter(b=>b.stage===state.training.filter);
  $('#bossCountLabel').textContent=`味方 ${partyCount}/10　敵 ${enemyCount}/4　${catalog.length}種`;
  $('#bossGrid').innerHTML=list.map(t=>`<button class="boss-choice enemy-catalog-card" data-training-enemy-id="${t.id}" type="button"><span><img src="${t.image||''}" alt="${t.name}" loading="lazy" decoding="async"><i>${t.symbol||'敵'}</i></span><div><b>${t.name}${t.rare?' ★RARE':''}</b><small>${t.stage} / ${t.attribute} / ${enemyCategoryLabel(t)}</small><em>Lv${t.levelMin}${t.levelMax!==t.levelMin?`～${t.levelMax}`:''}${t.special?` / ${t.special}`:' / 技は仮設定'}</em></div></button>`).join('');
  renderSelectedBoss();bindImages($('#trainingScreen'));
  $$('[data-training-member]').forEach(sel=>sel.onchange=()=>{
    const i=Number(sel.dataset.trainingMember),nextId=sel.value,current=state.training.party[i];
    if(!nextId){state.training.party[i]=null;return renderTraining();}
    const other=state.training.party.findIndex((x,j)=>j!==i&&x?.[0]===nextId);
    if(other>=0){state.training.party[other]=current||null;}
    state.training.party[i]=[nextId,current?.[1]||5];renderTraining();
  });
  $$('[data-training-level]').forEach(inp=>inp.onchange=()=>{const i=Number(inp.dataset.trainingLevel);if(state.training.party[i])state.training.party[i][1]=clamp(Number(inp.value)||1,1,120);});
  $$('[data-training-enemy-slot]').forEach(el=>el.onclick=e=>{if(e.target.closest('[data-training-enemy-remove]')||e.target.matches('input'))return;state.training.activeEnemySlot=Number(el.dataset.trainingEnemySlot);renderTraining();});
  $$('[data-training-enemy-level]').forEach(inp=>inp.onchange=()=>{const i=Number(inp.dataset.trainingEnemyLevel);if(state.training.enemySlots[i])state.training.enemySlots[i].level=clamp(Number(inp.value)||1,1,120);renderTraining();});
  $$('[data-training-enemy-remove]').forEach(btn=>btn.onclick=e=>{e.stopPropagation();const i=Number(btn.dataset.trainingEnemyRemove);state.training.enemySlots[i]=null;state.training.activeEnemySlot=i;if(!state.training.enemySlots.some(Boolean))state.training.activeEnemySlot=0;renderTraining();});
  $$('[data-boss-stage]').forEach(b=>b.onclick=()=>{state.training.filter=b.dataset.bossStage;renderTraining();});
  $$('[data-training-enemy-id]').forEach(btn=>btn.onclick=()=>{const t=trainingEnemyTemplate(btn.dataset.trainingEnemyId),i=state.training.activeEnemySlot;state.training.enemySlots[i]={id:t.id,level:t.levelMin||1};const next=state.training.enemySlots.findIndex((x,j)=>j>i&&!x);if(next>=0)state.training.activeEnemySlot=next;renderTraining();});
}
function renderSelectedBoss(){const list=trainingEnemyList(),partyCount=trainingParty().length,names=list.map(x=>trainingEnemyTemplate(x.id)?.name).filter(Boolean);$('#selectedBossMini').innerHTML=`<b>味方 ${partyCount}人 / 敵 ${list.length}体：${names.join(' / ')||'未設定'}</b><small>味方は空き枠ありでOK。敵は1～4体まで自由に設定できます</small>`;$('#startTrainingBattleBtn').disabled=!list.length||!partyCount;}
function weightedEnemyCount(areaIndex=0){
  // AREA 1 is always a two-enemy field battle. AREA 2+ uses 2-4 enemies, with four still uncommon.
  if(Number(areaIndex)===0)return 2;
  const r=Math.random();return r<.55?2:r<.90?3:4;
}
function weightedNormalTemplate(world,exclude=[]){
  const pool=(world.normalIds||[]).map(enemyTemplate).filter(Boolean).filter(t=>!exclude.includes(t.id));if(!pool.length)return null;
  const weighted=[];for(const t of pool){const weight=t.rare?1:8;for(let i=0;i<weight;i++)weighted.push(t);}return pick(weighted);
}
function expandEncounterEntries(entries=[]){const out=[];for(const x of entries){const q=clamp(Number(x.qty)||1,1,4);for(let i=0;i<q;i++)out.push({id:x.id,level:x.level});}return out.slice(0,4);}
function arrangeBossFormation(entries=[]){
  const list=[...entries];if(list.length<3)return list;
  // Put the main elite/boss in the visual centre while keeping attendants at their normal size/order.
  let primary=list.findIndex(x=>{const t=trainingEnemyTemplate(x.id);return t?.category==='boss';});
  if(primary<0)primary=list.findIndex(x=>trainingEnemyTemplate(x.id)?.category==='elite');
  if(primary<0)return list;
  const [main]=list.splice(primary,1),insertAt=list.length>=3?2:1;list.splice(insertAt,0,main);return list.slice(0,4);
}
function createAdventureEncounter(){
  const w=currentWorld(),area=currentArea(),battleIndex=clamp(state.adventure.battleIndex||0,0,2),areaIndex=clamp(state.adventure.areaIndex||0,0,3);
  if(battleIndex===2){const first=arrangeBossFormation(expandEncounterEntries(area.boss||[])),waves=[first];if(area.nextWave?.length)waves.push(arrangeBossFormation(expandEncounterEntries(area.nextWave)));return{waves,bossBattle:true,label:`${w.name} ${area.name} 中ボス/ボス`};}
  const count=weightedEnemyCount(areaIndex),used=[],list=[];for(let i=0;i<count;i++){let t=weightedNormalTemplate(w,used);if(!t)t=weightedNormalTemplate(w,[]);if(!t)break;used.push(t.id);list.push({id:t.id,level:rint(t.levelMin||1,t.levelMax||t.levelMin||1)});}return{waves:[list],bossBattle:false,label:`${w.name} ${area.name} 通常戦`};
}
function encounterNames(enc){return(enc?.waves?.[0]||[]).map(x=>{const t=trainingEnemyTemplate(x.id);return`${t?.name||x.id} Lv${x.level}`;}).join(' / ');}

const ADVENTURE_COMMON_SCALE_MAX=.14;
function setAdventureVisualLoading(on){const gate=$('#adventureVisualLoader'),root=$('#adventureParty');if(gate)gate.hidden=!on;if(root)root.classList.toggle('visual-loading',!!on);}
async function applyAdventurePartyScale(){
  const root=$('#adventureParty');if(!root)return;
  const imgs=$$('[data-adventure-party-img]',root);if(!imgs.length){setAdventureVisualLoading(false);return;}
  await Promise.all(imgs.map(async img=>{
    if(!(img.complete&&img.naturalWidth))await new Promise(resolve=>{const done=()=>resolve();img.addEventListener('load',done,{once:true});img.addEventListener('error',done,{once:true});});
    try{if(img.decode&&img.naturalWidth)await img.decode();}catch(_){}
  }));
  const valid=imgs.filter(img=>img.naturalWidth>0&&img.naturalHeight>0);if(!valid.length){setAdventureVisualLoading(false);return;}
  const sumW=valid.reduce((a,img)=>a+img.naturalWidth,0),maxH=Math.max(...valid.map(img=>img.naturalHeight));
  const scale=Math.min(ADVENTURE_COMMON_SCALE_MAX,Math.max(.01,(root.clientWidth-8)/Math.max(1,sumW)),Math.max(.01,(root.clientHeight-8)/Math.max(1,maxH)));
  valid.forEach(img=>{img.style.setProperty('width',`${Math.max(1,Math.round(img.naturalWidth*scale))}px`,'important');img.style.setProperty('height',`${Math.max(1,Math.round(img.naturalHeight*scale))}px`,'important');img.classList.add('size-ready');});
  await nextPaint();setAdventureVisualLoading(false);
}

/* ===== v26 STORY EVENT ENGINE ===== */
let storyBusy=false;
const STORY_GUESTS={
  mira:'boss-mira',guardian:'boss-guardian',neonBoss:'boss-neon',ace:'boss-ace',dragon:'boss-dragon',nepu:'boss-nepu'
};
/* v32: モブジェシー is the canonical play/06.png player character. */
const STORY_ONLY_ACTORS={};
let storySceneExtras=[];
function storyActorInfo(key){
  const e=STORY_ONLY_ACTORS[key];if(e)return{key,...e,image:versionedPlay(e.image),player:false,eventOnly:true};
  const p=player(key);if(p)return{key,name:p.name,image:versionedPlay(p.image),symbol:p.symbol||'仲',player:true};
  const t=trainingEnemyTemplate(STORY_GUESTS[key]||key);if(t)return{key,name:t.name,image:t.image||'',symbol:t.symbol||'敵',player:false};
  return{key,name:key||'???',image:'',symbol:'?'};
}
function storyFlags(){if(!state.adventure.storyFlags||typeof state.adventure.storyFlags!=='object')state.adventure.storyFlags={};return state.adventure.storyFlags;}
function storyDone(key){return!!storyFlags()[key];}
function markStoryDone(key){storyFlags()[key]=true;saveAdventure();}
function storyWorld(id){return(MOB_DATA.adventureWorlds||[]).find(w=>w.id===id)||currentWorld();}
function storySceneBg(worldId,areaIndex=0){const w=storyWorld(worldId),a=w?.areas?.[clamp(areaIndex,0,3)];return{bg:a?.bg||w?.fieldFallback||'back/rpgmain.png',fallback:w?.fieldFallback||'back/rpgmain.png'};}
let storyTapResolve=null;
let storyTapReadyAt=0;
function storyAdvanceWait(){
  return new Promise(resolve=>{storyTapResolve=resolve;storyTapReadyAt=performance.now()+80;});
}
function handleStoryTapAdvance(e){
  if(!storyTapResolve||performance.now()<storyTapReadyAt)return;
  e?.preventDefault?.();e?.stopPropagation?.();
  const resolve=storyTapResolve;storyTapResolve=null;storyTapReadyAt=0;resolve();
}
async function readyStoryImage(img,src){
  img.classList.remove('size-ready','asset-missing');if(!src){img.classList.add('asset-missing');return false;}
  img.src=src;bindImage(img);try{await preloadAsset(src,'high');if(img.decode)await img.decode();}catch(_){}
  await nextPaint();if(img.naturalWidth){img.classList.add('size-ready');return true;}img.classList.add('asset-missing');return false;
}
async function sizeStoryPartyImages(root){
  const imgs=$$('[data-story-party-img]',root);
  await Promise.all(imgs.map(async img=>{try{await preloadAsset(img.getAttribute('src'),'high');if(img.decode)await img.decode();}catch(_){}}));
  const valid=imgs.filter(img=>img.naturalWidth>0&&img.naturalHeight>0);if(!valid.length)return;
  const count=valid.length,rows=Math.max(1,Math.ceil(count/6));
  const rowSums=[];for(let i=0;i<count;i+=6)rowSums.push(valid.slice(i,i+6).reduce((a,img)=>a+img.naturalWidth,0));
  const maxRowW=Math.max(...rowSums,1),maxH=Math.max(...valid.map(i=>i.naturalHeight));
  const rowH=Math.max(1,(root.clientHeight-4)/rows);
  /* The previous .115 ceiling made a 2-person event party tiny. Asset-side relative sizes are preserved. */
  const cap=count<=2?.19:count<=3?.17:count<=4?.145:count<=6?.12:.105;
  const sc=Math.min(cap,(root.clientWidth-8)/maxRowW,(rowH*.98)/maxH);
  valid.forEach(img=>{img.style.width=`${Math.max(1,Math.round(img.naturalWidth*sc))}px`;img.style.height=`${Math.max(1,Math.round(img.naturalHeight*sc))}px`;img.classList.add('size-ready');});
}

async function renderStoryParty(extraIds=null){
  const root=$('#storyPartyLine');
  const list=state.party.map(([id])=>storyActorInfo(id)).filter(x=>x?.image);
  const extras=[...storySceneExtras,...(Array.isArray(extraIds)?extraIds:(extraIds?[extraIds]:[]))];
  for(const id of extras){const info=storyActorInfo(id);if(info?.image&&!list.some(x=>x.key===info.key))list.push(info);}
  root.dataset.partyCount=String(list.length);
  root.innerHTML=list.map(p=>`<div class="story-party-actor" data-story-actor="${p.key}"><img data-story-party-img src="${p.image}" alt="${p.name}"><span hidden>${p.symbol||'仲'}</span></div>`).join('');
  bindImages(root);await sizeStoryPartyImages(root);
}
async function openStoryScene(worldId,areaIndex=0,layout='default',extras=[]){
  const sc=$('#storyScene'),bg=storySceneBg(worldId,areaIndex),underParty=$('#adventureParty'),advScreen=$('#adventureScreen');
  setImage($('#adventureBg'),bg.bg,bg.fallback);$('#fieldEvent').hidden=true;
  if(advScreen)advScreen.classList.add('story-event-active');if(underParty)underParty.hidden=true;setAdventureVisualLoading(true);
  sc.classList.remove('closing','shake','story-layout-party-left');if(layout==='partyLeftGuestRight')sc.classList.add('story-layout-party-left');
  storySceneExtras=Array.isArray(extras)?extras.filter(Boolean):[];
  $('#storyGuest').hidden=true;$('#storyGuestGroup').hidden=true;$('#storyGuestGroup').innerHTML='';$('#storyBubble').hidden=true;$('#storyNarration').hidden=true;storyTapResolve=null;
  // Layout and decode first while invisible so a raw PNG can never flash at native size.
  sc.hidden=false;sc.style.visibility='hidden';await renderStoryParty();await nextPaint();sc.style.visibility='visible';setAdventureVisualLoading(false);await fixedDelay(240);
}
async function closeStoryScene(forceHome=false){
  const sc=$('#storyScene');sc.classList.add('closing');storyTapResolve=null;await fixedDelay(350);sc.hidden=true;sc.style.visibility='';sc.classList.remove('closing','shake','story-layout-party-left');$('#storyGuest').hidden=true;$('#storyGuestGroup').hidden=true;$('#storyGuestGroup').innerHTML='';$('#storyBubble').hidden=true;$('#storyNarration').hidden=true;$('#storyPartyLine').innerHTML='';storySceneExtras=[];
  const advScreen=$('#adventureScreen');if(advScreen)advScreen.classList.remove('story-event-active');const underParty=$('#adventureParty');if(underParty)underParty.hidden=false;
  if(forceHome){await goHome();}else{renderAdventure();showScreen('adventure');}
}
function storyAnchor(key){return $(`[data-story-actor="${key}"]`,$('#storyScene'))||($('#storyGuest').dataset.storyActor===key?$('#storyGuest'):null);}
function storyAnchorRect(anchor){
  if(!anchor)return null;
  const img=anchor.matches?.('img')?anchor:anchor.querySelector?.('img.size-ready,img:not(.asset-missing)');
  const target=(img&&img.getBoundingClientRect().width>0)?img:anchor;
  return target.getBoundingClientRect();
}
function setStorySpeaking(key,on){$$('.story-party-actor,.story-guest-multi',$('#storyScene')).forEach(el=>el.classList.toggle('speaking',on&&el.dataset.storyActor===key));const g=$('#storyGuest');g.classList.toggle('speaking',!!(on&&g.dataset.storyActor===key));}
async function storySayLine(key,line,displayName=null,anchorKey=null){
  const info=storyActorInfo(key),bubble=$('#storyBubble'),anchor=storyAnchor(anchorKey||key);
  $('#storySpeaker').textContent=displayName||info.name||'???';$('#storyText').textContent=line;
  // One source-script line = one bubble. Keep short lines compact, but cap width on phones.
  const visualChars=Math.max(String(line||'').length,String(displayName||info.name||'').length);
  bubble.style.width=`${clamp(132+Math.max(0,visualChars-5)*10,156,300)}px`;
  bubble.hidden=false;bubble.classList.remove('show','no-arrow');setStorySpeaking(anchorKey||key,true);
  await nextPaint();const scene=$('#storyScene').getBoundingClientRect(),br=bubble.getBoundingClientRect();let left=(scene.width-br.width)/2,top=scene.height*.18;
  if(anchor){
    const ar=storyAnchorRect(anchor),cx=ar.left-scene.left+ar.width/2;
    left=clamp(cx-br.width/2,8,scene.width-br.width-8);
    /* Point to the actual character art. If there is no room above, place the bubble just above the lower UI, never over a distant enemy. */
    top=clamp(ar.top-scene.top-br.height-10,66,scene.height-br.height-34);
    bubble.style.setProperty('--arrow-x',`${clamp(cx-left,22,br.width-22)}px`);
  }else bubble.classList.add('no-arrow');
  bubble.style.left=`${left}px`;bubble.style.top=`${top}px`;await nextPaint();bubble.classList.add('show');
  await storyAdvanceWait();bubble.classList.remove('show');setStorySpeaking(anchorKey||key,false);await fixedDelay(500);bubble.hidden=true;
}
async function storySay(key,text,displayName=null,anchorKey=null){
  const lines=String(text??'').split(/\r?\n/).filter(line=>line.length>0);
  if(!lines.length)lines.push('');
  for(const line of lines)await storySayLine(key,line,displayName,anchorKey);
}
async function storyNarrate(text){const box=$('#storyNarration');$('#storyNarrationText').textContent=text;box.hidden=false;await nextPaint();box.classList.add('show');await storyAdvanceWait();box.classList.remove('show');await fixedDelay(500);box.hidden=true;}
async function storyShowGuest(key,opt={}){const g=$('#storyGuest'),img=$('#storyGuestImg'),info=storyActorInfo(key),duplicate=storyAnchor(key);g.dataset.storyActor=key;g.className='story-guest';if(['denden','money','nyoro'].includes(key))g.classList.add('guest-compact');if(opt.side==='right')g.classList.add('side-right');else if(opt.side==='left')g.classList.add('side-left');if(duplicate&&duplicate!==g){duplicate.classList.add('guest-duplicate-hidden');g.dataset.hiddenPartyActor=key;}else delete g.dataset.hiddenPartyActor;g.hidden=false;$('#storyGuestFallback').textContent=info.symbol||'?';await readyStoryImage(img,info.image);if(opt.slow)g.classList.add('fade-slow');g.classList.add('visible');if(opt.drop){g.classList.add('drop');$('#storyScene').classList.add('shake');}await fixedDelay(opt.drop?760:(opt.slow?1050:520));g.classList.remove('drop');$('#storyScene').classList.remove('shake');await fixedDelay(500);}
async function storyHideGuest(){const g=$('#storyGuest'),hiddenKey=g.dataset.hiddenPartyActor;g.classList.remove('visible');await fixedDelay(520);g.hidden=true;g.dataset.storyActor='';if(hiddenKey){const a=$(`[data-story-actor="${hiddenKey}"]`,$('#storyScene'));a?.classList.remove('guest-duplicate-hidden');delete g.dataset.hiddenPartyActor;}}
async function storyShowGuests(keys=[],opt={}){
  await storyHideGuest().catch(()=>{});
  const group=$('#storyGuestGroup'),ids=(keys||[]).filter(Boolean).slice(0,4);if(!ids.length)return;
  group.hidden=false;group.className='story-guest-group';group.dataset.count=String(ids.length);group.innerHTML=ids.map(key=>{const info=storyActorInfo(key);return `<div class="story-guest-multi" data-story-actor="${key}"><img src="${info.image||''}" alt="${info.name}"><span>${info.symbol||'敵'}</span></div>`;}).join('');
  bindImages(group);
  await Promise.all($$('img',group).map(async img=>{const src=img.getAttribute('src');if(!src)return;try{await preloadAsset(src,'high');if(img.decode)await img.decode();}catch(_){}if(img.naturalWidth)img.classList.add('size-ready');else img.classList.add('asset-missing');}));
  await nextPaint();group.classList.add('visible');await fixedDelay(opt.slow?950:520);await fixedDelay(500);
}
async function storyHideGuests(){const group=$('#storyGuestGroup');if(group.hidden)return;group.classList.remove('visible');await fixedDelay(480);group.hidden=true;group.innerHTML='';group.dataset.count='0';}
async function storyExclaim(key){const g=$('#storyGuestMark');if($('#storyGuest').dataset.storyActor===key){g.hidden=false;void g.offsetWidth;await fixedDelay(700);g.hidden=true;}else{const a=storyAnchor(key);if(a){const mark=document.createElement('i');mark.className='story-mark';mark.textContent='!';a.appendChild(mark);await fixedDelay(700);mark.remove();}}await fixedDelay(500);}
async function storyFlash(){const f=$('#storyFlash');f.classList.remove('play');void f.offsetWidth;f.classList.add('play');await fixedDelay(460);f.classList.remove('play');await fixedDelay(500);}
async function storyImpact(text='ドン！ッ',dodge=false){if(dodge){const acts=$$('.story-party-actor',$('#storyPartyLine'));acts.forEach((a,i)=>a.classList.add(i%2?'dodge-right':'dodge-left'));}const sc=$('#storyScene'),el=$('#storyImpact');el.textContent=text;el.hidden=false;sc.classList.add('shake');el.classList.remove('play');void el.offsetWidth;el.classList.add('play');await fixedDelay(720);sc.classList.remove('shake');el.hidden=true;el.classList.remove('play');$$('.story-party-actor',$('#storyPartyLine')).forEach(a=>a.classList.remove('dodge-left','dodge-right'));await fixedDelay(500);}
async function storySayDual(keyA,lineA,keyB,lineB){
  const scene=$('#storyScene'),make=(key,line)=>{const info=storyActorInfo(key),anchor=storyAnchor(key),b=document.createElement('div');b.className='story-bubble story-bubble-temp';b.innerHTML=`<b></b><p></p>`;b.querySelector('b').textContent=info.name;b.querySelector('p').textContent=line;b.style.width=`${clamp(150+String(line||'').length*7,168,250)}px`;scene.appendChild(b);return{b,anchor,key};};
  const items=[make(keyA,lineA),make(keyB,lineB)];await nextPaint();const sr=scene.getBoundingClientRect();for(const it of items){const br=it.b.getBoundingClientRect(),ar=it.anchor?.getBoundingClientRect();let left=(sr.width-br.width)/2,top=sr.height*.18;if(ar){const cx=ar.left-sr.left+ar.width/2;left=clamp(cx-br.width/2,6,sr.width-br.width-6);top=clamp(ar.top-sr.top-br.height-14,52,sr.height-br.height-20);it.b.style.setProperty('--arrow-x',`${clamp(cx-left,20,br.width-20)}px`);}else it.b.classList.add('no-arrow');it.b.style.left=`${left}px`;it.b.style.top=`${top}px`;setStorySpeaking(it.key,true);it.b.classList.add('show');}
  // If both bubbles overlap, separate them horizontally while keeping each arrow aimed at its speaker.
  const [a,b]=items.map(x=>x.b.getBoundingClientRect());if(!(a.right+4<b.left||b.right+4<a.left)){items[0].b.style.left='6px';items[1].b.style.left=`${Math.max(6,sr.width-items[1].b.offsetWidth-6)}px`;}
  await storyAdvanceWait();for(const it of items){it.b.classList.remove('show');setStorySpeaking(it.key,false);}await fixedDelay(500);items.forEach(it=>it.b.remove());
}
function storyJoin(id){if(state.party.some(x=>x[0]===id))return;const avg=state.party.length?Math.round(state.party.reduce((s,x)=>s+(Number(x[1])||5),0)/state.party.length):5;state.party.push([id,clamp(avg,5,120)]);saveParty();state.training.party=state.party.map(x=>[...x]);}
async function storyJoinStep(id,message){await storyHideGuest();storyJoin(id);await renderStoryParty();await storyNarrate(message||`${player(id)?.name||id}が仲間に加わった！`);}
async function storyTempActor(id){const p=player(id);if(!p)return;await renderStoryParty(id);}
async function renderStoryPartyWithTemp(tempId){await renderStoryParty(tempId);}
async function storyJoinKeepGuest(id,message){storyJoin(id);await renderStoryParty();await storyNarrate(message||`${player(id)?.name||id}が仲間に加わった！`);}

const STORY_EVENTS={
  'arrival:desert':{worldId:'desert',area:0,layout:'partyLeftGuestRight',steps:[
    ['say','pink','ケホッ、ケホッ、\n凄い砂埃ですね、、\nん？\n誰か来ますよ！'],['guestRight','desert'],['say','desert','旅人か？\n今はやめておけ'],['say','pink','僕たちは国王の命令で\n魔王を倒すべく旅をしているのであります！'],['say','desert','なおさらやめておけ\nやつらの力は強大だ\nたった2人で何が出来る？'],['say','pink','ふぅ、、\nこのお方は勇者様です‼︎'],['say','desert','・・・勇者？\nそんなはずは、、'],['exclaim','desert'],['say','desert','いや、間違いなく勇者だ'],['say','pink','その通り！あなた見る目ありますねー！'],['say','desert','こんな日が来るとはな\nいいだろう\n俺も同行する'],['say','pink','大変ありがたいです！\nここのボスはミラモブと聞いています\n早速案内してください！'],['say','desert','やつは強い\nだが勇者ならあるいわ'],['join','desert','モブデザートが仲間に加わった！']
  ]},
  'pre:desert':{worldId:'desert',area:3,steps:[
    ['guest','mira'],['say','mira','何者だ？'],['say','desert','久しぶりだな、ミラモブ'],['say','mira','モブデザートか\n今更何をしに来た？\n王位にも就けず、魔物にもなれない半端者が'],['say','desert','用があるのは私ではない\nまあ、私もなくはないのだがな'],['say','pink','やいやいやい！\nやいやーい！'],['say','mira','なんだそのゴミは？'],['say','pink','ゴ、ゴミ、、'],['say','desert','そいつはいいとして\nもう1人を見てみろ'],['say','mira','こいつは・・'],['say','pink','このお方は勇者様だぞ！\n強いのだぞ！'],['say','mira','なるほど\nお前が強気に出られる理由はこれか\nこの私も\n舐められたものだ！'],['say','desert','来るぞ！']
  ]},
  'post:desert':{worldId:'desert',area:3,forceHome:true,steps:[
    ['say','pink','はあ、はあ、\n強すぎであります、、'],['say','desert','しかし、討伐成功だ\n見ろ\nこれがミラモブのレコード\nガラガラの旅 だ'],['narrate','7つのレコードの1つ、ガラガラの旅を手に入れた！'],['say','pink','これで2枚目であります！\n次は田舎町を目指します！'],['say','desert','海底への入り口か\n懐かしいな']
  ]},
  'arrival:rural':{worldId:'rural',area:0,steps:[
    ['say','pink','すぅ〜\nはぁ〜\n空気が美味しいですねー'],['say','desert','砂漠とは大違いだな\n奇妙な建物が多いが、悪くない'],['sayOff','???','どけどけどけー！でやんすー！'],['say','pink','な、なんですか⁉︎'],['guestDrop','denden','ドン！ッ'],['say','denden','いててて、、','???'],['say','desert','なんだこいつは？'],['say','pink','大丈夫ですか？'],['say','denden','あいやー\nご心配感謝ですやんす！\nオイラはモブデンデン！\nこんな時に観光とは珍しいでやんすねー'],['say','pink','観光ではありません！\n僕たちは勇者と仲間達！\n魔王を倒すため旅をしてるのであります！'],['say','desert','勇者と仲間達、、'],['say','denden','ほぅー！\nカッコいいでやんすねー\n勇者様にお会い出来るなんて\n感激でやんす！'],['say','pink','やんすさんは、\nこの辺り詳しいのですか？'],['say','denden','もちろん！\nこの辺りは庭でやんす！'],['say','desert','やんすさん..？'],['say','pink','ここのボスは\nモブガーディアンですね？\n討伐に協力していただきたい！'],['say','denden','ほぅー！\nオイラはとある国の\n護衛隊長をやっていたでやんす！'],['say','desert','そうなのか？'],['say','denden','勇者様のためなら\n一肌脱ぐでやんす！'],['join','denden','モブデンデンが仲間に加わった！']
  ]},
  'pre:rural':{worldId:'rural',area:3,steps:[
    ['guest','guardian'],['say','guardian','ガオォォォォー‼︎'],['say','denden','ライオンでやんすーーー‼︎'],['say','pink','いや、怪獣でありますーーー‼︎'],['say','guardian','・・・・・・。'],['say','desert','勇者よ、お前も苦労しているな'],['say','guardian','我の持つレコードが狙いだな？\n受けて立つ！'],['say','denden','風穴開けてやるでやんす！']
  ]},
  'post:rural':{worldId:'rural',area:3,steps:[
    ['say','pink','やりましたー！'],['say','desert','こいつも強敵だったな'],['say','denden','ガーディアンの名にふさわしい強さでやんす\nあと、たぶん根は悪いやつじゃなかったでやんす・・・。'],['say','desert','それが、お前が護衛隊長を辞めた理由か？'],['say','denden','だけ、ではないでやんす\n魔王は平和を乱す悪党でやんすから'],['narrate','3つめのレコード「案山子と小麦」を手に入れた！']
  ]},
  'arrival:neon':{worldId:'neon',area:0,steps:[
    ['say','denden','なんだかチカチカするでやんす・・'],['say','pink','ネオン街ですからね'],['say','desert','不思議な魔力をいくつか感じる'],['say','denden','味方だといいでやんすねー'],['sayOff','???','もらったー‼︎'],['say','desert','避けろ‼︎'],['flash'],['guestSlow','money'],['say','money','あれ？\nあなた達誰？'],['say','denden','人を攻撃しておいて何を言ってるでやんすか！'],['say','money','え？人？'],['say','desert','また面倒なやつが来たものだ'],['say','money','私はモブマニー！\n長年魔王に封印されていたの\nなぜか解放されて外に出てみたら\nすっかり街の雰囲気が変わってしまったの！'],['say','pink','どれくらい封印されていたのでありますか？'],['say','money','う〜ん\n分からない！'],['say','desert','ではなぜ封印されていた？'],['say','money','う〜ん\nう〜ん\n思い出せない・・'],['say','denden','まあ敵の敵は味方でやんす！\n一緒に魔王を倒すでやんす‼︎'],['say','money','えー\nあなたとー？'],['say','pink','いやいやいや\nこちらの方を見るであります！'],['say','money','ん？'],['say','pink','このお方は勇者様であります！'],['say','money','勇者？\n誰が？'],['say','pink','だ・か・ら！\nこのお方であります‼︎'],['say','money','ふーん\nなんか迫力ないわね\nまあいいわ！\n目的は同じだから協力しましょう！'],['join','money','モブマニーが仲間に加わった！']
  ]},
  'pre:neon':{worldId:'neon',area:3,steps:[
    ['guest','neonBoss'],['say','money','あなたがここのボス？\n前のボスよりイカついわね・・'],['say','desert','気を付けろ\n強力な魔力を感じる'],['say','denden','油断大敵でやんす！'],['say','neonBoss','お前たちは間違っている\n魔王様は秩序を保っている\nお前たちは守られているのだ'],['say','pink','どんな理由でも\nあの町の住人は帰ってこない・・！'],['say','neonBoss','平和に犠牲はつきものだ\nあの町は・・'],['say','denden','問答無用でやんす！'],['say','money','レコードはいただくわよ！']
  ]},
  'post:neon':{worldId:'neon',area:3,custom:'neonPost'},
  'arrival:magma':{worldId:'magma',area:0,steps:[
    ['say','denden','暑いでやんすー\nオイラ暑いの嫌いでやんすー'],['say','money','うるさいわね\nこっちまで暑くなるじゃない！'],['say','desert','砂漠も暑いが、ここはもっと過酷だな'],['say','pink','ここでも誰か案内してくれると良いのですが'],['say','money','そんな都合よく・・'],['guestDropDodge','nyoro','ドン！ッ'],['say','nyoro','おー・・\n痛いニョロ・・'],['say','pink','あなたさてはここに詳しいですね！'],['say','money','ボスのところに案内しなさい！'],['say','nyoro','ニョロ！？'],['say','denden','まあ待つでやんす'],['sayDual','money','お前が言うな！！','pink','お前が言うな！！（であります）'],['say','desert','俺が事情を説明しよう'],['narrate','モブニョロに事情を説明した'],['say','nyoro','お～！勇者様！\nお会いできて嬉しいニョロ！'],['say','desert','ここのボスはどんなやつだ？'],['say','nyoro','恐ろしいドラゴンニョロ・・'],['say','denden','ドラゴンニョロ・・\n変な名前でやんす'],['say','desert','気にせず続けてくれ'],['say','nyoro','先代の王モブフェニックス様との死闘は\nそりゃ～凄かったニョロ\nでも結局最後はモブドラゴンが勝ったニョロ\nそれからというもの、\n魔王軍が住みついて大変ニョロ・・'],['say','pink','どこも同じでありますね・・'],['say','denden','ドラゴンか\n会ってみたいでやんすね！'],['join','nyoro','モブニョロが仲間に加わった！']
  ]},
  'pre:magma':{worldId:'magma',area:3,steps:[
    ['guest','dragon'],['say','dragon','私に何か用か？'],['say','money','想像以上にドラゴンね・・！'],['say','denden','かっけえでやんす！'],['say','pink','これは手ごわいですよ・・！'],['say','dragon','目障りなやつらだ\n命惜しくば立ち去れ'],['say','desert','風格もさすがだな\nだが、去るわけにはいかん'],['say','nyoro','やるしかないニョロね！'],['say','dragon','手加減はせぬぞ！！']
  ]},
  'post:magma':{worldId:'magma',area:3,steps:[
    ['say','desert','はあ、はあ、'],['say','money','み、みんな無事？'],['say','denden','暑いでやんす・・'],['say','pink','強敵でありましたね'],['say','nyoro','でも、勝ったニョロ！\n信じられないニョロ！'],['narrate','5つ目のレコードを手に入れた！']
  ]},
  'arrival:sea':{worldId:'sea',area:0,steps:[
    ['say','nyoro','うわー空が海ニョロ！'],['say','money','海底だからね'],['say','denden','おっかないお魚がたくさんでやんす！'],['say','desert','とにかく進んでみよう'],['say','pink','みなさん、警戒を怠らず！']
  ]},
  'pre:sea':{worldId:'sea',area:3,steps:[
    ['guest','nepu'],['say','nepu','待っていたぞ勇者よ'],['say','denden','でっかいお魚でやんす！'],['say','pink','し、失礼ですよ！'],['say','nepu','構わぬ\n王を前にしてその陽気さ\nお主のような戦士はきっと強くなる'],['say','denden','えへへ・・でやんす！'],['say','desert','敵意を感じないな\nお前は魔王の手下ではないのか？'],['say','nepu','海底の歴史は地上を遥かに凌駕する\n魔王軍とて簡単に手は出せん'],['say','desert','では全ての事情も知っているのか？'],['say','nepu','もちろんだ\nお前たちがレコードを求めていることもな'],['say','pink','では、是非お譲りいただけませんか？'],['say','nepu','それは構わぬ\nだが、\nその前にお前たちの力を見せてくれ'],['say','desert','当然の展開だな'],['say','nyoro','勝負だニョロー！']
  ]},
  'post:sea':{worldId:'sea',area:3,keepGuest:'nepu',steps:[
    ['guest','nepu'],['say','nepu','素晴らしい強さだ\nだが、魔王には遥に及ばない\n旅を続け、力をつけるのだ'],['say','pink','はい！'],['say','nepu','モブネコクー！\nこちらへ来るのだ！'],['sayOff','モブネコクー','はいはい！'],['tempActor','nekoku'],['say','nekoku','お呼びでしょうか国王様！'],['say','nepu','お前も彼らと旅をするのだ\nきっとお互いのためになる'],['say','nekoku','オラがですか！？\nうーん\n分かりました！\n精一杯頑張ります！'],['say','nyoro','ヘンテコな戦士だニョロ'],['say','nekoku','オラが言えたもんじゃねえが\nおめえも大概変だぞ'],['say','money','勇者パーティーとは思えないわね\nでもそれもいいんじゃない？'],['say','denden','仲間が増えたでやんす！'],['joinKeepGuest','nekoku','6枚目のレコード「ケロの衣装」を手に入れた！']
  ]}
 };

/* ===== v32 story expansion: 草原 / 草原Ⅱ / 部族村 ===== */
Object.assign(STORY_EVENTS,{
  'arrival:grassland':{worldId:'grassland',area:0,steps:[
    ['say','pink','いよいよ冒険の始まりですね！\nウキウキ、ワクワクであります！']
  ]},
  'pre:grassland:0':{worldId:'grassland',area:0,steps:[
    ['guest','g-savanna'],['say','pink','やや！\n手ごわいモンスターが出ましたよ！'],['say','pink','Areaを進むに中ボスを倒しましょう！']
  ]},
  'post:grassland:0':{worldId:'grassland',area:0,steps:[
    ['say','pink','さすがは勇者様であります！\n先へ進みましょう！']
  ]},
  'pre:grassland:1':{worldId:'grassland',area:1,steps:[
    ['guest','g-iwakiri'],['say','pink','見るからに危険ですね・・\n気を引き締めてかかりましょう！']
  ]},
  'pre:grassland:2':{worldId:'grassland',area:2,steps:[
    ['guest','g-axe'],['narrate','相手は1人ですが、\nそれだけ強力です！\n全力で挑みましょう！']
  ]},
  'pre:grassland:3':{worldId:'grassland',area:3,steps:[
    ['guest','boss-hawk'],['say','boss-hawk','来客とは珍しいな\n何者だ？'],['say','pink','我々は勇者パーティー！\nここにあるレコードを譲ってもらいたい！'],['say','boss-hawk','戯言を\n現代に勇者の名など通用しない\n早々に立ち去るがよい'],['say','pink','ぐぬぬ・・\nここまで来たら引けません！\n戦いましょう！'],['say','boss-hawk','覚悟だけは認めてやる\n来い！']
  ]},
  'post:grassland:3':{worldId:'grassland',area:3,steps:[
    ['say','pink','やはりボスは強いですね・・\nでもこれでレコード入手です！'],['narrate','1枚目のレコード「」を手に入れた！'],['say','pink','まずは王様に報告に行きましょう！']
  ]},

  'arrival:grassland2':{worldId:'grassland2',area:0,steps:[
    ['say','pink','この場所ももう懐かしいですね・・\n急ぎましょう\nモブホークと再び決戦です！']
  ]},
  'pre:grassland2:0':{worldId:'grassland2',area:0,steps:[
    ['guest','g2-tsuru'],['say','g2-tsuru','申し訳ないが、お帰りいただこうか'],['say','pink','そうはいかない！'],['say','denden','いざ勝負でやんす！']
  ]},
  'post:grassland2:0':{worldId:'grassland2',area:0,steps:[
    ['say','desert','同じ地だと思って油断しないことだな\nモブホークもきっと、\n強大な力を得ているだろう']
  ]},
  'pre:grassland2:1':{worldId:'grassland2',area:1,steps:[
    ['guest','g2-merakero'],['say','g2-merakero','メラメラメラーーー！'],['say','nyoro','気合い入っているニョロね・・！'],['say','nekoku','オラ、カエルは苦手だ']
  ]},
  'post:grassland2:1':{worldId:'grassland2',area:1,steps:[
    ['say','money','アツいカエルだったわね'],['say','denden','漢でやんした！']
  ]},
  'pre:grassland2:2':{worldId:'grassland2',area:2,steps:[
    ['guest','g2-keroking'],['say','g2-keroking','私はケロの王ケロキング！\nモブホーク様の命により\nお前たちをここで仕留める！'],['say','desert','受けて立つ！'],['say','pink','ここを倒せばもうすぐであります！\nみなさん頑張りましょう！']
  ]},
  'post:grassland2:2':{worldId:'grassland2',area:2,steps:[
    ['say','desert','さあ、先へ進もう'],['say','nyoro','キング、立派だったニョロ！']
  ]},
  'pre:grassland2:3':{worldId:'grassland2',area:3,steps:[
    ['guest','boss-hawk2'],['say','boss-hawk2','クククク・・・\nようやく来たな'],['say','pink','往生際が悪いであります！'],['say','money','あんた一度負けてるって聞いたよ？'],['say','nekoku','オラ焼き鳥大好きだ'],['say','boss-hawk2','勇者よ、お前を認め\n魔王様から力を得た\n新たな私の強さ\n受け止める勇気があるかな？'],['say','denden','みんな、構えるでやんす！']
  ]},
  'post:grassland2:3':{worldId:'grassland2',area:3,steps:[
    ['guest','boss-hawk2'],['say','boss-hawk2','貴様ら如きに・・・'],['hideGuest'],['say','pink','なんとか勝てました・・！'],['say','desert','レコードは手に入らないが、\n必要な戦いだったな'],['say','pink','王様に報告に行きましょう！']
  ]},

  'arrival:tribe':{worldId:'tribe',area:0,steps:[
    ['say','pink','なんだか不思議な雰囲気でありますね'],['say','nekoku','オラ初めて見る景色だ'],['say','denden','ビリビリしそうな香りがするでやんす'],['say','desert','で、そこのお前が案内でもしてくれるのか？'],['sayOff','???','あら、気が付いていたの？\n中々やるわね'],['guest','jessie'],['say','jessie','私はネオン街の保安官\n通報を受けてこの村に来たの\nモブジェシーよ\nよろしくね'],['say','money','ネオン街！？\n私も、私も！'],['say','jessie','知っているわ\nモブマニーでしょ？\n私を覚えてない？'],['say','money','うーん\n私、魔王に封印されてたから'],['say','jessie','本当にそう？'],['say','money','え？'],['say','jessie','まあ、いずれ分かるわ'],['say','desert','この村は、どういう村なんだ？'],['say','jessie','魔王軍と直接は関係ないわ\nただ、あの町と関係はあるの'],['say','pink','あの町と繋がりが！？'],['say','jessie','ええ\nネオン街、部族村\nこの2つがあの町と大きく関係がある'],['say','pink','詳しく知りたいであります！'],['say','jessie','それもまたいずれね\nとにかく\nこの村は危険がいっぱいよ\n手を貸してあげるから油断しないことね']
  ]},
  'pre:tribe:0':{worldId:'tribe',area:0,extras:['jessie'],steps:[
    ['guest','t-kukuri'],['say','t-kukuri','タチサレ・・'],['say','pink','幹部の登場であります！'],['say','denden','気合い入れるでやんす！']
  ]},
  'post:tribe:0':{worldId:'tribe',area:0,extras:['jessie'],steps:[
    ['say','money','不気味だったわね・・'],['say','jessie','あなたたちも十分不気味よ'],['say','money','そういう意味じゃないわよ！'],['say','nyoro','喧嘩はやめるニョロ～！']
  ]},
  'pre:tribe:1':{worldId:'tribe',area:1,extras:['jessie'],steps:[
    ['guest','t-tough'],['say','t-tough','全く、大変な時に来たね君たち'],['say','pink','まともそうな人であります！'],['say','desert','そんなはずがないだろう'],['say','t-tough','まともかはともかく\n俺は連中とは違うよ'],['say','jessie','そう？\n危ないやつにしか出せないオーラよ'],['say','t-tough','これはこれは保安官\n大人しく影に隠れていてはどうですか？'],['say','jessie','あなた・・'],['say','nekoku','ん？'],['say','t-tough','まあお喋りはこれくらいにして\nやりますか\n他に道はないだろう？']
  ]},
  'post:tribe:1':{worldId:'tribe',area:1,extras:['jessie'],steps:[
    ['say','nyoro','強かったニョロ・・'],['say','denden','この村はみんな強いでやんす'],['say','jessie','さあ、しっかり休んで先へ行きましょう']
  ]},
  'pre:tribe:2':{worldId:'tribe',area:2,extras:['jessie'],steps:[
    ['guests',['t-hisui','t-ryugo']],['say','t-hisui','天よ・・こやつらに災いを'],['say','t-ryugo','もてなすぞ、客人'],['say','nekoku','強そうな2人だなー'],['say','money','みんな最初から飛ばしていくわよ！']
  ]},
  'post:tribe:2':{worldId:'tribe',area:2,extras:['jessie'],steps:[
    ['say','jessie','おかしい・・'],['say','desert','どうした？'],['say','jessie','この2人はこの村の長だったはず'],['say','money','なんで戦う前に言わないのよ！'],['say','jessie','腰が引けちゃうでしょ？'],['say','nyoro','それはそうだニョロ'],['say','desert','ということは\nさらに上がいるということか'],['say','jessie','そうなるわね'],['say','pink','大丈夫！\n力を合わせて進むであります！\n・・・・\nあります！'],['say','jessie','すっかり怖がっちゃって・・'],['say','denden','でも進むしかないでやんす！']
  ]},
  'pre:tribe:3':{worldId:'tribe',area:3,extras:['jessie'],steps:[
    ['guests',['boss-debuff','boss-berserk']],['say','boss-debuff','・・・・'],['say','boss-berserk','・・・・'],['say','jessie','もはや言葉すらないのね'],['say','denden','これが魔王の魔力でやんすか・・'],['say','nyoro','こ、怖いニョロ・・'],['say','money','うー・・\nさっさとやるわよ！'],['say','desert','やつらの力\n歴戦の魔王たちと近いものを感じる\n力を合わせ、全員で戦うぞ！'],['say','denden','もちろんでやんす！']
  ]},
  'post:tribe:3':{worldId:'tribe',area:3,extras:['jessie'],steps:[
    ['say','jessie','任務完了'],['say','desert','魔王とは、\n一体どこまで・・'],['say','pink','とりあえず王様に報告です！\nどうやらここにレコードは無いようです'],['say','jessie','私も行くわ\n魔王を倒さないと\n何も進まなそうだしね'],['say','nyoro','心強いニョロ！\nモブジェシー、強いニョロ！']
  ]}
});

async function runStorySteps(steps=[]){
  for(const st of steps){const [type,a,b,c,d]=st;
    if(type==='say')await storySay(a,b,c,d);
    else if(type==='sayAs')await storySay(a,b,c,a);
    else if(type==='sayDual')await storySayDual(a,b,c,d);
    else if(type==='sayOff')await storySay(a,b,c||a,null);
    else if(type==='narrate')await storyNarrate(a);
    else if(type==='guest')await storyShowGuest(a);
    else if(type==='guests')await storyShowGuests(a,b||{});
    else if(type==='hideGuests')await storyHideGuests();
    else if(type==='guestRight')await storyShowGuest(a,{side:'right'});
    else if(type==='guestSlow')await storyShowGuest(a,{slow:true});
    else if(type==='guestDrop'){await storyShowGuest(a,{drop:true});await storyImpact(b||'ドン！ッ');}
    else if(type==='guestDropDodge'){await storyShowGuest(a,{drop:true});await storyImpact(b||'ドン！ッ',true);}
    else if(type==='hideGuest')await storyHideGuest();
    else if(type==='exclaim')await storyExclaim(a);
    else if(type==='flash')await storyFlash();
    else if(type==='impact')await storyImpact(a||'ドン！ッ',!!b);
    else if(type==='join')await storyJoinStep(a,b);
    else if(type==='joinKeepGuest')await storyJoinKeepGuest(a,b);
    else if(type==='tempActor')await storyTempActor(a);
    else if(type==='wait')await fixedDelay(Number(a)||500);
  }
}
async function startAceStoryBattle(){
  const bg=storySceneBg('neon',3);return new Promise(async resolve=>{scriptedBattleResolve=resolve;await startBattleLoaded({mode:'story',returnScreen:'adventure',enemyConfigs:[{id:'boss-ace',level:38}],party:state.party,bg:bg.bg,fallbackBg:bg.fallback,bossBattle:true,scriptedTurnLimit:3,scriptedImmortalEnemy:true,scriptedImmortalParty:true,storyLabel:'モブエース EVENT BATTLE'});});
}
async function runNeonPostStory(){
  await openStoryScene('neon',3);
  await storySay('money','いてて・・');await storySay('denden','チカチカするでやんす・・');await storySay('desert','危ないところだったな');await storySay('pink','・・・？\n何か来ます！');
  await storyNarrate('まさかやつが敗れるとはな・・');await storyShowGuest('ace',{slow:true});
  await storySay('ace','我は\n魔王様の側近の1人\nモブエース');await storySay('money','モブエース！？');await storySay('desert','知っているのか？');await storySay('money','以前の王、モブネオンキングの息子・・');await storySay('ace','ほう、我を知る者もいるのか');await storySay('money','気を付けて！\nあいつは次の王と言われていた戦士よ！');await storySay('ace','魔王様のため、ここで消えてもらう！');
  $('#storyScene').hidden=true;await startAceStoryBattle();
  await openStoryScene('neon',3);await storyShowGuest('ace',{slow:true});
  await storySay('ace','見事だ\nここまでとは思わなかったぞ');await storySay('pink','なんて強さでありますか・・');await storySay('ace','一先ずは引いてやろう\n次に会う時が楽しみだ');await storyHideGuest();await storySay('desert','もっと強さが必要だな');await storySay('money','強力な武器も必要ね');await storyNarrate('4つ目のレコードを手に入れた！');
}
async function runStoryEvent(key,forceHomeOverride=false){
  const ev=STORY_EVENTS[key];if(!ev||storyDone(key)||storyBusy)return false;storyBusy=true;let ok=false;
  try{if(ev.custom==='neonPost')await runNeonPostStory();else{await openStoryScene(ev.worldId,ev.area||0,ev.layout||'default',ev.extras||[]);await runStorySteps(ev.steps||[]);}markStoryDone(key);ok=true;}finally{storyBusy=false;}
  const goHome=!!(ev.forceHome||forceHomeOverride);if(ok){await closeStoryScene(goHome);if(!goHome&&screens.adventure.classList.contains('active'))renderAdventure();}return ok;
}
async function maybeRunArrivalStory(){const w=currentWorld();if(!w)return false;const key=`arrival:${w.id}`;if(STORY_EVENTS[key]&&!storyDone(key))return await runStoryEvent(key);return false;}
async function runPendingPostStory(suppressArrival=false,forceHomeAfter=false){const p=state.adventure.pendingPostStory;if(!p?.key)return false;const key=p.key;if(storyDone(key)){state.adventure.pendingPostStory=null;saveAdventure();return false;}const ran=await runStoryEvent(key,forceHomeAfter);if(ran){state.adventure.pendingPostStory=null;saveAdventure();const ev=STORY_EVENTS[key];if(!suppressArrival&&!forceHomeAfter&&!ev?.forceHome){renderAdventure();showScreen('adventure');await maybeRunArrivalStory();}}return ran;}
async function handleAdventureEntry(){if(state.adventure.pendingPostStory){if(await runPendingPostStory())return;}await maybeRunArrivalStory();}

function renderAdventure(){
  const w=currentWorld(),area=currentArea(),bi=state.adventure.battleIndex||0;
  $('#adventureStageTitle').textContent=state.adventure.completed?'魔王城までCLEAR':w.name;
  $('#adventureProgress').textContent=state.adventure.completed?'CLEAR':`${area.name}　戦闘 ${bi+1}/3`;
  $('#areaName').textContent=state.adventure.completed?'魔王城までの冒険完了':`${w.name}・${area.name}`;
  const pending=state.adventure.pendingEncounter;
  $('#areaDescription').textContent=state.adventure.completed?'現在設定済みの草原～魔王城ルートをクリアしました。Lv上限が120になりました。':state.adventure.battleReady?(pending?.bossBattle?'強い気配がする。準備ができたら戦闘へ。':'敵の気配を感じる。何が現れるかは戦闘まで分からない。'):`探索 → バトルを3回行うと次のAREAへ進みます。3戦目は中ボス/ボスです。`;
  setImage($('#adventureBg'),area.bg,w.fieldFallback);setAdventureVisualLoading(true);
  const partyRoot=$('#adventureParty');partyRoot.innerHTML=state.party.slice(0,4).map(([id,lv])=>{const p=player(id);return p?`<div><img data-adventure-party-img src="${versionedPlay(p.image)}" alt="${p.name}" decoding="async"><span>${p.symbol}</span><small>Lv${lv}</small></div>`:'';}).join('');
  const btn=$('#fieldBattleBtn');btn.disabled=!state.adventure.battleReady||state.adventure.completed||storyBusy;btn.classList.toggle('locked',btn.disabled);$('#fieldBattleHint').textContent=state.adventure.completed?'CLEAR':state.adventure.battleReady?(pending?.bossBattle?'強敵の気配':'戦闘可能'):'探索が必要';$('#exploreBtn').disabled=state.adventure.battleReady||state.adventure.completed||storyBusy;bindImages($('#adventureScreen'));applyAdventurePartyScale();
}
async function exploreField(){
  if(state.adventure.completed||state.adventure.battleReady)return;const w=currentWorld(),area=currentArea();$('#fieldEvent').hidden=false;$('#fieldEvent').innerHTML=`<b>探索中...</b><small>${w.name}・${area.name}</small>`;await delay(500);
  const enc=createAdventureEncounter();state.adventure.pendingEncounter=enc;state.adventure.battleReady=true;saveAdventure();$('#fieldEvent').innerHTML=`<b>${enc.bossBattle?'強い気配を感じる…':'敵の気配を感じる…'}</b><p>戦闘まで正体は分からない</p>`;renderAdventure();await delay(720);$('#fieldEvent').hidden=true;
}
function saveCampCheckpoint(){state.adventure.vitals=null;state.adventure.checkpoint={worldIndex:state.adventure.worldIndex,areaIndex:state.adventure.areaIndex,battleIndex:state.adventure.battleIndex,battleReady:false,completed:state.adventure.completed,pendingEncounter:null,vitals:null,coins:state.coins,party:clone(state.party)};saveAdventure();saveParty();toast('キャンプで全回復し、現在のAREAを保存しました');}
function restoreCampCheckpoint(){const cp=state.adventure.checkpoint;if(cp){state.adventure={...state.adventure,...clone(cp),checkpoint:clone(cp)};state.coins=cp.coins;if(Array.isArray(cp.party)){state.party=clone(cp.party).map(x=>Array.isArray(x)?[canonicalPlayerId(x[0]),x[1]]:x);saveParty();}}else state.adventure=defaultAdventure();saveAdventure();}

function growthValue(lv,curve){lv=clamp(Number(lv)||1,1,120);const [v1,v99,v120=v99]=curve;if(lv<=99){const t=(lv-1)/98;return Math.round(v1+(v99-v1)*t);}const t=(lv-99)/21;return Math.round(v99+(v120-v99)*t);}
function baseStats(p,lv){const t=TEMP_BALANCE.playerTargets?.[p.id];if(!t){const old=TEMP_BALANCE.playerGrowth[p.id],b=TEMP_BALANCE.base;return{maxHp:Math.round(b.hp+old.hp*lv),maxMp:Math.round(b.mp+old.mp*lv),atk:Math.round(b.atk+old.atk*lv),mag:Math.round(b.mag+old.mag*lv),def:Math.round(b.def+old.def*lv),res:Math.round(b.res+old.res*lv),spd:Math.round(b.spd+old.spd*lv)};}return{maxHp:growthValue(lv,t.hp),maxMp:growthValue(lv,t.mp),atk:growthValue(lv,t.atk),mag:growthValue(lv,t.mag),def:growthValue(lv,t.def),res:growthValue(lv,t.res),spd:growthValue(lv,t.spd)};}
function buildAlly(p,lv,vital){lv=clamp(Number(lv)||1,1,120);const s=baseStats(p,lv),hp=vital?clamp(vital.hp,0,s.maxHp):s.maxHp;return{...p,level:lv,...s,hp,mpNow:vital?clamp(vital.mp,0,s.maxMp):s.maxMp,dead:hp<=0,guard:0,guardTurns:0,barrier:0,atkBuff:0,atkBuffTurns:0,atkDebuff:0,atkDebuffTurns:0,defBuff:0,defBuffTurns:0,spdBuff:0,spdBuffTurns:0,spdDebuff:0,spdDebuffTurns:0,allBuff:0,allBuffTurns:0,damageCut:0,damageCutTurns:0,status:{poison:0,burn:0,sleep:0,stun:0,paralyze:0},pinkReviveUsed:false,lilithReviveUsed:false,transformed:false,narakuStacks:0,nextSupportTurn:rint(2,5)};}
function enemyStatPreview(t,lv,groupSize=1,partySize=4){
  t=t||{category:'normal'};lv=clamp(Number(lv)||1,1,120);const profile=TEMP_BALANCE.enemyProfiles?.[t.category]||TEMP_BALANCE.enemyProfiles.normal,mods=t.mods||{};
  const hp=Math.round((profile.hpBase+lv*profile.hpPerLevel)*(mods.hp||1));
  return{maxHp:hp,atk:Math.round((profile.atkBase+lv*profile.atkPerLevel)*(mods.atk||1)),mag:Math.round((profile.magBase+lv*profile.magPerLevel)*(mods.mag||1)),def:Math.round((profile.defBase+lv*profile.defPerLevel)*(mods.def||1)),res:Math.round((profile.resBase+lv*profile.resPerLevel)*(mods.res||1)),spd:Math.round((profile.spdBase+lv*profile.spdPerLevel)*(mods.spd||1)),groupAttackScale:1};
}
let ENEMY_UID=0;
function buildEnemyFromTemplate(t,lv,partySize=4,groupSize=1,bg='',fallbackBg=''){
  if(!t)return null;const st=enemyStatPreview(t,lv,groupSize,partySize),b=t.bossId?boss(t.bossId):null;
  return{...t,uid:`enemy-${++ENEMY_UID}`,level:clamp(Number(lv)||t.levelMin||1,1,120),...st,hp:st.maxHp,isBoss:t.category==='boss',isElite:t.category==='elite',bg:bg||t.bg||b?.bg||'',fallbackBg:fallbackBg||t.fallbackBg||b?.fallbackBg||'',damageReduction:0,shieldTurns:0,atkBuff:0,atkBuffTurns:0,defDebuff:0,defDebuffTurns:0,spdDebuff:0,spdDebuffTurns:0,status:{poison:0,burn:0,sleep:0,stun:0,paralyze:0}};
}
function buildBossEnemy(b,lv,size){return buildEnemyFromTemplate(trainingEnemyCatalog().find(t=>t.bossId===b?.id)||legacyBossTemplate(b),lv,size,1,b?.bg,b?.fallbackBg);}
function buildNormalEnemy(raw,lv,size,bg){const t={...raw,id:raw.id||`legacy-normal-${raw.name}`,category:'normal',image:raw.image||'',levelMin:lv,levelMax:lv};return buildEnemyFromTemplate(t,lv,size,1,bg,'back/sougen.png');}
function arrangeEnemyWaveCenter(items){
  const list=[...(items||[])].slice(0,4);if(list.length<3)return list;
  const bosses=list.filter(x=>x.t?.category==='boss'),elites=list.filter(x=>x.t?.category==='elite');
  const lead=bosses.length===1?bosses[0]:(bosses.length===0&&elites.length===1?elites[0]:null);if(!lead)return list;
  const from=list.indexOf(lead),to=Math.floor((list.length-1)/2);if(from>=0&&from!==to){list.splice(from,1);list.splice(to,0,lead);}return list;
}
function buildEnemyWave(records,partySize,bg,fallbackBg){const expanded=[];for(const r of records||[]){const t=trainingEnemyTemplate(r.id)||r.template||r;if(!t)continue;const q=clamp(Number(r.qty)||1,1,4);for(let i=0;i<q;i++)expanded.push({t,level:r.level||t.levelMin||1});}const ordered=arrangeEnemyWaveCenter(expanded),count=Math.max(1,ordered.length);return ordered.map(x=>buildEnemyFromTemplate(x.t,x.level,partySize,count,bg,fallbackBg)).filter(Boolean);}
function beginBattle(config){
  if(state.test?.enabled&&state.test?.fast5)state.speed=5;else if(state.speed===5)state.speed=1;
  const partyList=(config.party||state.party).slice(0,10),vitals=config.useAdventureVitals?state.adventure.vitals:null,allies=partyList.map(([id,lv])=>buildAlly(player(id),lv,vitals?.[id])),partySize=Math.min(4,allies.length);
  let waveConfigs=[];
  if(Array.isArray(config.waves)&&config.waves.length)waveConfigs=clone(config.waves);
  else if(Array.isArray(config.enemyConfigs)&&config.enemyConfigs.length)waveConfigs=[clone(config.enemyConfigs)];
  else if(Array.isArray(config.enemies)&&config.enemies.length)waveConfigs=[config.enemies.map(e=>({template:e,level:e.level||1}))];
  else if(config.enemy)waveConfigs=[[{template:config.enemy,level:config.enemy.level||1}]];
  else if(config.bossId){const bt=trainingEnemyCatalog().find(t=>t.bossId===config.bossId)||legacyBossTemplate(boss(config.bossId));waveConfigs=[[{id:bt.id,level:config.bossLevel||bt.levelMin||30}]];}
  const bg=config.bg||currentArea()?.bg||waveConfigs[0]?.[0]?.template?.bg||'back/sougen4.png',fallbackBg=config.fallbackBg||currentWorld()?.fieldFallback||'back/rpgmain.png';
  const enemies=buildEnemyWave(waveConfigs.shift()||[],partySize,bg,fallbackBg);const first=enemies[0];
  state.battle={mode:config.mode||'training',returnScreen:config.returnScreen||'training',allies,mainIds:allies.slice(0,4).map(a=>a.id),superIds:allies.slice(4,6).map(a=>a.id),reserveIds:allies.slice(6,10).map(a=>a.id),enemies,enemy:first,targetEnemyId:first?.uid||null,actingEnemyId:null,pendingWaveConfigs:waveConfigs,defeatedEnemies:[],turn:1,queue:[],queuePos:0,busy:false,auto:false,finished:false,teamGuard:0,teamGuardTurns:0,yushaGuard:0,yushaGuardTurns:0,config,bg,fallbackBg};
  state.noticeQueue=[];state.noticeBusy=false;setImage($('#battleBg'),bg,fallbackBg);$('#battleModeLabel').textContent=config.mode==='adventure'?(config.bossBattle?'BOSS / MID BOSS':'FIELD BATTLE'):config.mode==='story'?'EVENT BATTLE':'TRAINING';$('#resultOverlay').hidden=true;$('#skillMenu').hidden=true;$('#autoBtn').classList.remove('active');$('#autoBtn').textContent='AUTO';$('#speedBtn').textContent=`×${state.speed}`;$('#battleBackBtn').disabled=config.mode==='story';renderBattle();showScreen('battle');setTimeout(()=>notice(`${enemies.map(e=>e.name).join('・')}が現れた！`,'danger',820),120);startRound();
}

function allyById(id){return state.battle?.allies.find(a=>a.id===id)||null;}
function idsToAllies(ids){return ids.map(allyById).filter(Boolean);}
function mainAllies(){return state.battle?idsToAllies(state.battle.mainIds):[];}
function superAllies(){return state.battle?idsToAllies(state.battle.superIds):[];}
function reserveAllies(){return state.battle?idsToAllies(state.battle.reserveIds):[];}
function fieldAllies(){return [...mainAllies(),...superAllies()];}
function livingMain(){return mainAllies().filter(a=>!a.dead&&a.hp>0);}
function livingSuper(){return superAllies().filter(a=>!a.dead&&a.hp>0);}
function livingField(){return fieldAllies().filter(a=>!a.dead&&a.hp>0);}
function livingRoster(){return state.battle?state.battle.allies.filter(a=>!a.dead&&a.hp>0):[];}
function enemyByUid(uid){return state.battle?.enemies?.find(e=>e.uid===uid)||null;}
function livingEnemies(){return state.battle?.enemies?.filter(e=>e.hp>0)||[];}
function targetEnemy(){const b=state.battle;if(!b)return null;let e=enemyByUid(b.targetEnemyId);if(!e||e.hp<=0){e=livingEnemies()[0]||null;b.targetEnemyId=e?.uid||null;}if(!b.actingEnemyId)b.enemy=e;return e;}
function actingEnemy(){return enemyByUid(state.battle?.actingEnemyId)||null;}
function setEnemyTarget(uid){const e=enemyByUid(uid);if(!e||e.hp<=0)return;state.battle.targetEnemyId=uid;if(!state.battle.actingEnemyId)state.battle.enemy=e;renderBattle();}
function currentEntry(){return state.battle?.queue[state.battle.queuePos]||null;}
function activeAlly(){const e=currentEntry();return e?.type==='ally'?allyById(e.id):null;}
function availableUlts(a){return a.ults.filter((u,i)=>i<4?a.level>=[1,15,30,50][i]:a.id==='yusha');}
function effective(stat,obj){let v=obj[stat];if(obj.allBuffTurns>0)v*=1+obj.allBuff;if(stat==='atk'&&obj.atkBuffTurns>0)v*=1+obj.atkBuff;if(stat==='atk'&&obj.atkDebuffTurns>0)v*=1-obj.atkDebuff;if(stat==='def'&&obj.defBuffTurns>0)v*=1+obj.defBuff;if(stat==='spd'&&obj.spdBuffTurns>0)v*=1+obj.spdBuff;if(stat==='spd'&&obj.spdDebuffTurns>0)v*=1-(obj.spdDebuff||0);return v;}

function enemySizeClass(e){const n=e.name||'';if(/フレザード/.test(n))return'frezard';if(e.category==='boss'&&/ドラゴン|ギドラ|ドラファラ/.test(n))return'dragon';if(e.category==='boss')return'boss';if(/ゴーレム/.test(n))return'golem';if(/ロック/.test(n))return'rock';if(e.category==='elite')return'elite';if(/スライム|ピヨ|ミスト|プルフ|ジョーロ|テンデビ|ミニブック|プニ|バブル/.test(n))return'small';return'normal';}
function enemyIsWinged(e){return /バード|ピヨ|ホーク|テンデビ|ヒノデビ|サキュバス|ドラゴン|ギドラ|フレザード|フェニックス/.test(e?.name||'');}
function positionEnemyTargetMarks(root=$('#enemyArea')){
  if(!root)return;
  $$('[data-enemy-target]',root).forEach(unit=>{
    const mark=$('.enemy-target-mark',unit),wrap=$('.enemy-sprite-wrap',unit),img=$('.enemy-sprite',unit);
    if(!mark||!wrap)return;
    const place=()=>{
      const w=wrap.clientWidth,h=wrap.clientHeight,nw=img?.naturalWidth||0,nh=img?.naturalHeight||0;
      if(!(w>0&&h>0&&nw>0&&nh>0)){mark.style.top='46%';return;}
      const scale=Math.min(w/nw,h/nh),paintedH=nh*scale,paintTop=Math.max(0,h-paintedH);
      mark.style.top=`${Math.max(1,paintTop-11)}px`;
      mark.style.bottom='auto';
    };
    place();
    if(img&&!img.complete)img.addEventListener('load',place,{once:true});
  });
}
function enemyMarkup(e){
  const tags=[];for(const[k,l]of[['poison','毒'],['burn','やけど'],['sleep','眠り'],['stun','ひるみ'],['paralyze','マヒ']])if(e.status[k]>0)tags.push(l);if(e.shieldTurns>0)tags.push('SHIELD');if(e.defDebuffTurns>0)tags.push('DEF↓↓');if(e.spdDebuffTurns>0)tags.push('SPD↓↓');
  const selected=state.battle?.targetEnemyId===e.uid&&e.hp>0,dead=e.hp<=0;
  return`<button type="button" class="enemy-unit enemy-size-${enemySizeClass(e)} ${enemyIsWinged(e)?'enemy-winged':''} ${selected?'selected':''} ${dead?'dead':''}" data-enemy-target="${e.uid}" ${dead?'disabled':''}><div class="enemy-sprite-wrap">${e.image?`<img class="enemy-sprite" data-enemy-sprite="${e.uid}" src="${e.image}" alt="${e.name}">`:''}<div class="enemy-symbol ${e.image?'fallback-only':''}" data-enemy-symbol="${e.uid}">${e.symbol||'敵'}</div>${selected?'<span class="enemy-target-mark">▼</span>':''}</div><div class="enemy-nameplate"><div><b>${e.name}</b><small>Lv${e.level} / ${e.attribute}</small></div><div class="gauge"><i class="hp" style="width:${pct(e.hp,e.maxHp)}%"></i></div><p><span>${dead?'DOWN':'HP'}</span><b>${Math.ceil(e.hp).toLocaleString()} / ${e.maxHp.toLocaleString()}</b></p><div class="enemy-tags">${tags.map(t=>`<em>${t}</em>`).join('')}</div></div></button>`;
}
function statusText(a){return Object.entries(a.status).filter(([,v])=>v>0).map(([k])=>({poison:'毒',burn:'炎',sleep:'眠',stun:'怯',paralyze:'麻'}[k])).join(' ');}
function allyMarkup(a){const st=statusText(a);return`<button type="button" class="ally-hud-card ${a.dead?'dead':''} ${activeAlly()===a?'active turn-active':''}" data-ally-id="${a.id}"><span class="ally-hud-art"><img src="${versionedPlay(a.image)}" alt="${a.name}"><i>${a.symbol}</i>${st?`<em class="ally-status-mark">${st}</em>`:''}</span><div class="ally-title-line"><b>${a.name}</b><em>${a.dead?'DOWN':`Lv${a.level}`}</em></div><div class="ally-hud-line"><span>HP ${Math.ceil(a.hp)}/${a.maxHp}</span><span>MP ${Math.floor(a.mpNow)}/${a.maxMp}</span></div><div class="ally-gauges"><div class="gauge tiny"><i class="hp" style="width:${pct(a.hp,a.maxHp)}%"></i></div><div class="gauge tiny"><i class="mp" style="width:${pct(a.mpNow,a.maxMp)}%"></i></div></div></button>`;}
function superMarkup(a){const next=Math.max(0,a.nextSupportTurn-state.battle.turn);return`<div class="super-chip ${a.dead?'dead':''}" data-ally-id="${a.id}"><span><img src="${versionedPlay(a.image)}" alt="${a.name}"><i>${a.symbol}</i></span><div><b>${a.name}</b><small>${a.dead?'DOWN':`HP ${Math.ceil(a.hp)} / MP ${Math.floor(a.mpNow)}`}</small></div><em>${a.dead?'—':next===0?'READY':`+${next}T`}</em></div>`;}
function benchMarkup(a){return`<div class="bench-chip ${a.dead?'dead':''}" data-ally-id="${a.id}"><span><img src="${versionedPlay(a.image)}" alt="${a.name}"><i>${a.symbol}</i></span><div><b>${a.name}</b><small>${a.dead?'DOWN':`HP ${Math.ceil(a.hp)} / MP ${Math.floor(a.mpNow)}`}</small><div class="gauge tiny"><i class="hp" style="width:${pct(a.hp,a.maxHp)}%"></i></div></div></div>`;}
function renderBattle(){
  const b=state.battle;if(!b)return;targetEnemy();$('#battleTurnLabel').textContent='';const enemies=b.enemies||[];const area=$('#enemyArea');area.className=`enemy-area enemy-count-${Math.max(1,enemies.length)}`;area.innerHTML=enemies.map(enemyMarkup).join('');
  $('#allyStatus').innerHTML=mainAllies().map(allyMarkup).join('');$('#superStatus').innerHTML=superAllies().length?superAllies().map(superMarkup).join(''):`<div class="no-bench">援護なし</div>`;$('#benchStatus').innerHTML=reserveAllies().length?reserveAllies().map(benchMarkup).join(''):`<div class="no-bench">控えなし</div>`;
  const entry=currentEntry(),a=activeAlly(),acting=entry?.type==='enemy'?enemyByUid(entry.enemyId):null,target=targetEnemy();$('#activeActorBar').innerHTML=a?`<img src="${versionedPlay(a.image)}" alt=""><div><small>COMMAND / SPD ${Math.round(effective('spd',a))}</small><b>${a.name}</b><span>HP ${Math.ceil(a.hp)} / MP ${Math.floor(a.mpNow)}</span></div>`:entry?.type==='super'?`<div><small>AUTO ACTION</small><b>${allyById(entry.id)?.name||''}</b></div>`:`<div><small>${acting?'ENEMY ACTION':'TARGET'}</small><b>${acting?.name||target?.name||''}</b></div>`;
  bindImages($('#battleScreen'));positionEnemyTargetMarks(area);requestAnimationFrame(()=>positionEnemyTargetMarks(area));$$('[data-enemy-target]',area).forEach(btn=>btn.onclick=()=>setEnemyTarget(btn.dataset.enemyTarget));setCommandDisabled(b.busy||b.finished||!a);
}
function setCommandDisabled(dis){['attackBtn','skillBtn','ultimateBtn','defendBtn','itemBtn','escapeBtn','switchBtn'].forEach(id=>{const el=$('#'+id);if(el)el.disabled=dis;});}

function notice(text,tone='system',duration=650){if(!state.battle||state.battle.finished&&tone!=='system')return;state.noticeQueue.push({text,tone,duration});pumpNotice();}
async function pumpNotice(){if(state.noticeBusy)return;state.noticeBusy=true;const el=$('#centerMessage');while(state.noticeQueue.length){const n=state.noticeQueue.shift();el.textContent=n.text;el.dataset.tone=n.tone;el.classList.remove('play');void el.offsetWidth;el.classList.add('play');await delay(n.duration);el.classList.remove('play');await delay(60);}state.noticeBusy=false;}
function fieldPointFromRect(r,x=.5,y=.5){const field=$('#battleScreen');if(!field||!r)return{left:'50%',top:'50%'};const fr=field.getBoundingClientRect();return{left:`${((r.left-fr.left)+r.width*x)/fr.width*100}%`,top:`${((r.top-fr.top)+r.height*y)/fr.height*100}%`};}
function enemyVisual(uid){uid=uid||state.battle?.actingEnemyId||state.battle?.targetEnemyId;return uid?($(`[data-enemy-sprite="${uid}"]`)||$(`[data-enemy-symbol="${uid}"]`)):null;}
function enemyTargetPoint(uid){const el=enemyVisual(uid);return el?fieldPointFromRect(el.getBoundingClientRect(),.5,.68):{left:'50%',top:'45%'};}
function allyTargetPoint(id){const root=$(`[data-ally-id="${id}"]`)||null;if(!root)return{left:'50%',top:'82%'};return fieldPointFromRect(root.getBoundingClientRect(),.5,.08);}
function positionEffect(el,target='enemy'){let p;if(!target||target==='enemy')p=enemyTargetPoint();else if(String(target).startsWith('enemy:'))p=enemyTargetPoint(String(target).slice(6));else p=allyTargetPoint(target);el.style.left=p.left;el.style.top=p.top;}
function pulseAllyDamage(id){const el=$(`[data-ally-id="${id}"]`);if(!el)return;el.classList.remove('damage-flash','hud-shake');void el.offsetWidth;el.classList.add('damage-flash','hud-shake');}
async function actionCutin(text,tone='system',duration=500){const el=$('#actionBanner');if(!el){notice(text,tone,duration);await delay(Math.min(duration,520));return;}el.textContent=text;el.dataset.tone=tone;const n=[...text].length;el.style.fontSize=n>=22?'12px':n>=18?'13px':n>=15?'14px':n>=12?'16px':'18px';el.classList.remove('play');void el.offsetWidth;el.classList.add('play');await delay(duration);el.classList.remove('play');await delay(55);}
async function passiveCutin(a,text,duration=620){
  const wrap=$('#passiveCutin'),img=$('#passiveCutinCharacter'),label=$('#passiveCutinText');
  if(!wrap||!a){notice(text,'system',duration);await fixedDelay(duration);return;}
  const src=versionedPlay(a.transformed&&a.id==='yusha'?'play/13.png':a.image);await preloadAsset(src);setImage(img,src,'');label.textContent=text;wrap.hidden=false;wrap.classList.remove('play');void wrap.offsetWidth;wrap.classList.add('play');await fixedDelay(duration);wrap.classList.remove('play');wrap.hidden=true;
}
async function passiveBeat(a,text,duration=620,preDelay=600){await fixedDelay(preDelay);await passiveCutin(a,text,duration);}
async function reactivePassiveBeat(a,text,duration=600){return passiveBeat(a,text,duration,140);}
function floatNumber(value,kind='damage',target='enemy'){const el=document.createElement('div');el.className=`float-number ${kind}`;el.textContent=(kind==='heal'?'+':'')+Math.round(value);positionEffect(el,target);$('#battleFxLayer').appendChild(el);setTimeout(()=>el.remove(),850/state.speed);}
function clearEnemyImpact(){for(const el of $$('[data-enemy-sprite],[data-enemy-symbol]')){el.classList.remove('enemy-hit','enemy-cast','enemy-damage-impact','enemy-advance');el.style.filter='';}}
function pulseEnemy(cls='hit',uid){const el=enemyVisual(uid);if(!el)return;el.classList.remove('enemy-hit','enemy-cast','enemy-advance','enemy-damage-impact');el.style.filter='';void el.offsetWidth;const className=cls==='cast'?'enemy-cast':cls==='advance'?'enemy-advance':'enemy-damage-impact';el.classList.add(className);if(cls!=='advance'){const cleanup=()=>{if(el.isConnected){el.classList.remove(className);el.style.filter='';}};el.addEventListener('animationend',cleanup,{once:true});setTimeout(cleanup,520);}}
async function beginEnemyLunge(uid){const screen=$('#battleScreen');if(screen)screen.classList.add('enemy-attacking');pulseEnemy('advance',uid);await fixedDelay(520);}
function endEnemyLunge(){const screen=$('#battleScreen');if(screen)screen.classList.remove('enemy-attacking');clearEnemyImpact();}
function fx(type='slash',target){if(target==null)target=(type==='buff'||type==='heal')?(activeAlly()?.id||'enemy'):'enemy';const el=document.createElement('div');el.className=`simple-fx ${type}`;positionEffect(el,target);$('#battleFxLayer').appendChild(el);setTimeout(()=>el.remove(),650/state.speed);}

/* ===== v22 procedural weapon + attribute attack FX =====
   Temporary battle animation system used until dedicated sprite assets are prepared.
   Weapon determines motion/shape; attribute determines the secondary impact animation. */
const NORMAL_ATTACK_WEAPON={
  yusha:'greatsword',pink:'greatsword',desert:'katana',nyoro:'gun',nekoku:'spear',
  jessie:'spear',denden:'gun',money:'staff',riro:'spear',tetsu:'katana',lilith:'staff',naraku:'katana'
};
function weaponKind(a){
  if(NORMAL_ATTACK_WEAPON[a?.id])return NORMAL_ATTACK_WEAPON[a.id];
  const w=String(a?.weapon||'');
  if(w.includes('大剣'))return'greatsword';if(w.includes('太刀'))return'katana';
  if(w.includes('片手剣'))return'sword';if(w.includes('槍'))return'spear';
  if(w.includes('銃'))return'gun';if(w.includes('杖'))return'staff';return'sword';
}
function elementFxKind(a){
  const e=normalizeElement(a?.attribute);
  return({'火':'fire','水':'water','雷':'thunder','地':'earth','風':'wind','光':'light','闇':'dark','無':'neutral'})[e]||'neutral';
}
function battlePointPx(target='enemy'){
  const screen=$('#battleScreen'),sr=screen?.getBoundingClientRect();if(!screen||!sr)return{x:0,y:0};let el=null,x=.5,y=.5;
  if(target==='enemy'||String(target).startsWith('enemy:')){const uid=String(target).startsWith('enemy:')?String(target).slice(6):undefined;el=enemyVisual(uid);x=.5;y=.66;}
  else{el=$(`[data-ally-id="${target}"]`);x=.5;y=.08;}
  if(!el)return{x:sr.width*.5,y:sr.height*(target==='enemy'?.45:.82)};const r=el.getBoundingClientRect();return{x:r.left-sr.left+r.width*x,y:r.top-sr.top+r.height*y};
}
function weaponFxMarkup(kind){
  if(kind==='greatsword')return'<i class="w-blade w-blade-a"></i><i class="w-blade w-blade-b"></i><i class="w-core"></i>';
  if(kind==='katana')return'<i class="w-katana k1"></i><i class="w-katana k2"></i><i class="w-katana k3"></i>';
  if(kind==='spear')return'<i class="w-pierce"></i><i class="w-spear-ring"></i><i class="w-core"></i>';
  if(kind==='gun')return'<i class="w-bullet"></i><i class="w-trail"></i><i class="w-gun-impact"></i>';
  if(kind==='staff')return'<i class="w-rune r1"></i><i class="w-rune r2"></i><i class="w-orb"></i>';
  return'<i class="w-sword-arc"></i><i class="w-core"></i>';
}
function elementFxMarkup(){return'<span class="e-overlay"><i></i><i></i><i></i><i></i><i></i><i></i></span>';}
async function weaponElementAttackFx(a,{quick=false}={}){
  const layer=$('#battleFxLayer');if(!layer)return;
  const kind=weaponKind(a),element=elementFxKind(a),end=battlePointPx('enemy'),start=battlePointPx(a.id);
  const el=document.createElement('div');
  el.className=`weapon-attack-fx weapon-${kind} element-${element}${quick?' quick':''}`;
  el.style.setProperty('--fx-rate',String(1/state.speed));
  el.innerHTML=weaponFxMarkup(kind)+elementFxMarkup();
  if(kind==='gun'||kind==='spear'){
    el.style.left=`${start.x}px`;el.style.top=`${start.y}px`;
    el.style.setProperty('--travel-x',`${end.x-start.x}px`);el.style.setProperty('--travel-y',`${end.y-start.y}px`);
    el.style.setProperty('--impact-x',`${end.x}px`);el.style.setProperty('--impact-y',`${end.y}px`);
  }else{el.style.left=`${end.x}px`;el.style.top=`${end.y}px`;}
  layer.appendChild(el);
  const life=quick?250:360;
  try{await delay(life);}finally{el.remove();}
}

async function skillSprite(frames,target='enemy'){
  if(!frames?.length){fx('magic',target);return;}
  const wrap=$('#skillSpriteFx');
  if(!wrap)return;
  positionEffect(wrap,target);
  wrap.hidden=true;wrap.style.display='none';wrap.style.opacity='0';
  wrap.replaceChildren();
  const nodes=frames.map((src,i)=>{
    const img=document.createElement('img');
    img.className='skill-frame';img.alt='';img.draggable=false;img.decoding='async';
    img.dataset.frame=String(i);img.src=src;bindImage(img);wrap.appendChild(img);return img;
  });
  try{
    /* Decode every frame before the first frame becomes visible. No src swapping during playback. */
    await Promise.all(nodes.map((img,i)=>ensureDomImageReady(img,frames[i],1200)));
    wrap.hidden=false;wrap.style.display='block';wrap.style.opacity='1';
    await nextPaint(2);
    for(let i=0;i<nodes.length;i++){
      nodes.forEach((img,j)=>img.classList.toggle('active',i===j));
      await fixedDelay(94);
    }
    await fixedDelay(45);
  }finally{
    nodes.forEach(img=>img.classList.remove('active'));
    wrap.style.opacity='0';wrap.hidden=true;wrap.style.display='none';
    wrap.replaceChildren();
  }
}
async function ultimateImpactFx(){
  const layer=$('#battleFxLayer');
  if(!layer)return;
  const el=document.createElement('div');
  el.className='ultimate-impact-fx';
  try{
    positionEffect(el,'enemy');
    layer.appendChild(el);
    await fixedDelay(420);
  }finally{
    el.remove();
  }
}
const SUPPORT_ONLY_ULTS=new Set(['selfAllBuff','heroTransform','healCleanse','teamRecovery','teamHealGuard','fullHealBarrier','narakuShield']);
async function ultimateCutin(a,u){
  const wrap=$('#ultimateCutin');
  if(!wrap)return;
  const banner=$('.cutin-character',wrap),art=$('.ult-art-wrap',wrap),name=$('#cutinName');
  const artImg=$('#cutinUltArt'),charImg=$('#cutinCharacter');
  const neon=$('.ult-neon-trace',wrap);
  const charSrc=versionedPlay(a.transformed&&a.id==='yusha'?'play/13.png':a.image);

  const hardHide=()=>{
    wrap.hidden=true;wrap.style.display='none';wrap.style.opacity='0';wrap.style.visibility='hidden';
    wrap.classList.remove('ult-v14-live');
    if(neon)neon.classList.remove('active');
    if(banner){banner.style.opacity='0';banner.style.visibility='hidden';banner.style.transform='none';}
    if(art){art.style.opacity='0';art.style.visibility='hidden';art.style.transform='translate(-50%,-42%) scale(1)';}
  };

  try{
    hardHide();
    if(name){
      name.textContent=u.name;
      const n=[...u.name].length;
      name.style.fontSize=n>=18?'12px':n>=15?'13px':n>=12?'15px':'18px';
    }
    const quote=$('#cutinQuote');if(quote)quote.textContent='';
    const fallback=$('#cutinUltFallback');if(fallback)fallback.textContent=u.name;

    /* v21: never reveal the ultimate until both images have completed decode. */
    await Promise.all([preloadAsset(charSrc,'high'),preloadAsset(u.image,'high')]);
    if(charImg){charImg.classList.remove('asset-missing');charImg.src=charSrc;}
    if(artImg){artImg.classList.remove('asset-missing');artImg.src=u.image;}
    await Promise.all([
      ensureDomImageReady(charImg,charSrc,1800),
      ensureDomImageReady(artImg,u.image,2200)
    ]);
    await nextPaint(2);

    wrap.hidden=false;wrap.style.display='block';wrap.style.opacity='1';wrap.style.visibility='visible';
    if(banner){banner.style.opacity='1';banner.style.visibility='visible';}
    if(art){art.style.opacity='1';art.style.visibility='visible';}
    wrap.classList.add('ult-v14-live');
    await new Promise(requestAnimationFrame);

    await fixedDelay(1120);

    if(neon){neon.classList.remove('active');void neon.offsetWidth;neon.classList.add('active');}
    await fixedDelay(300);

    hardHide();
    await new Promise(requestAnimationFrame);
    if(!SUPPORT_ONLY_ULTS.has(u.kind))await ultimateImpactFx();
  }catch(err){
    console.error('[MOB QUEST] ultimateCutin recovered:',err);
    hardHide();
  }finally{
    hardHide();
  }
}

function enemyDefense(type,e=targetEnemy()){if(!e)return 0;let v=type==='magic'?e.res:e.def;if(e.defDebuffTurns>0)v*=1-e.defDebuff;return v;}
function calcDamage(attacker,type,power,crit=0,e=targetEnemy()){const source=type==='magic'?effective('mag',attacker):effective('atk',attacker),def=enemyDefense(type,e);let d=Math.max(1,source*power-def*.45)*(.91+Math.random()*.18);const c=Math.random()<Math.max(TEMP_BALANCE.critRate,crit||0);if(c)d*=TEMP_BALANCE.critPower;return{value:Math.round(d),crit:c};}
function calcEnemyDamage(target,power,type='physical'){const e=actingEnemy()||state.battle.enemy;if(!e)return 0;const source=(type==='magic'?e.mag:e.atk)*(e.atkBuffTurns>0?1+e.atkBuff:1)*(e.groupAttackScale||1),def=type==='magic'?effective('res',target):effective('def',target);return Math.max(1,Math.round((source*power-def*.50)*(.9+Math.random()*.2)));}
function wakeEnemyOnHit(e){if(e?.status.sleep>0&&Math.random()<.70){e.status.sleep=0;notice(`${e.name}は眠りから覚めた！`,'status');}}
function recordEnemyDefeat(e){if(!e||e._defeatRecorded)return;e._defeatRecorded=true;state.battle?.defeatedEnemies?.push({uid:e.uid,name:e.name,level:e.level,coinReward:e.coinReward||0});}
function applyEnemyDamageTo(a,e,power,type='physical',crit=0,showGenericFx=true){
  if(!e||e.hp<=0)return{value:0,crit:false};const uid=e.uid,r=calcDamage(a,type,power,crit,e);let d=r.value;if(e.shieldTurns>0)d=Math.round(d*(1-(e.damageReduction||.2)));if(e.allyShieldTurns>0)d=Math.round(d*(1-(e.allyShieldReduction||.10)));const scriptedImmortal=state.battle?.mode==='story'&&state.battle?.config?.scriptedImmortalEnemy;e.hp=Math.max(scriptedImmortal?1:0,e.hp-d);
  if(e.hp<=0){recordEnemyDefeat(e);if(state.battle.targetEnemyId===uid){const next=livingEnemies().find(x=>x.uid!==uid);state.battle.targetEnemyId=next?.uid||null;if(!state.battle.actingEnemyId)state.battle.enemy=next||e;}}
  renderBattle();floatNumber(d,r.crit?'crit':'damage',`enemy:${uid}`);if(showGenericFx)fx(type==='magic'?'magic':'slash',`enemy:${uid}`);pulseEnemy('hit',uid);wakeEnemyOnHit(e);if(e.hp<=0)notice(`${e.name} DOWN`,'danger',520);return{...r,value:d};
}
function applyEnemyDamage(a,power,type='physical',crit=0,showGenericFx=true){return applyEnemyDamageTo(a,targetEnemy(),power,type,crit,showGenericFx);}
async function playerAoeDamage(a,power,type='physical',crit=0,statusKind='',statusChance=0,statusTurns=3){let total=0;const targets=[...livingEnemies()];for(const e of targets){const r=applyEnemyDamageTo(a,e,power,type,crit,true);total+=r.value;if(statusKind&&e.hp>0)applyEnemyStatusTo(e,statusKind,statusChance,statusTurns);await delay(65);}return total;}
function applyEnemyStatusTo(e,kind,chance,turns=3){if(!e||e.hp<=0)return false;let c=chance;if(e.isBoss&&(kind==='paralyze'||kind==='sleep'))c*=.25;if(Math.random()>=c)return false;e.status[kind]=Math.max(e.status[kind],e.isBoss?rint(1,2):turns);return true;}
function heal(a,amount){if(a.dead)return 0;const before=a.hp;a.hp=Math.min(a.maxHp,a.hp+amount);const h=Math.round(a.hp-before);if(h>0)floatNumber(h,'heal',a.id);return h;}
function healField(ratio){let total=0;livingField().forEach(a=>total+=heal(a,a.maxHp*ratio));renderBattle();return total;}
function restoreMpField(ratio){livingField().forEach(a=>a.mpNow=Math.min(a.maxMp,a.mpNow+a.maxMp*ratio));renderBattle();}
function cleanse(a){Object.keys(a.status).forEach(k=>a.status[k]=0);}
function applyBossStatus(kind,chance,turns=3){return applyEnemyStatusTo(targetEnemy(),kind,chance,turns);}

async function checkSpecialRevives(){const field=fieldAllies(),pink=field.find(a=>a.id==='pink'&&!a.dead&&!a.pinkReviveUsed);for(const a of field){if(a.dead&&a.id==='lilith'&&!a.lilithReviveUsed){await reactivePassiveBeat(a,'ウルモブリリス！');a.dead=false;a.lilithReviveUsed=true;a.transformed=true;a.hp=Math.round(a.maxHp*.60);a.atk*=1.2;a.mag*=1.2;a.def*=1.2;a.res*=1.2;a.spd*=1.2;renderBattle();notice('モブリリスが復活！','heal',650);await fixedDelay(600);}else if(a.dead&&pink&&!pink.pinkReviveUsed&&a.id!=='pink'){await reactivePassiveBeat(pink,'支える力！');pink.pinkReviveUsed=true;pink.hp=Math.max(1,Math.floor(pink.hp*.5));a.dead=false;a.hp=Math.round(a.maxHp*.35);renderBattle();notice(`${a.name}が復活！`,'heal',650);await fixedDelay(600);break;}}}
async function maybeArtistCleanse(target){const riro=livingField().find(a=>a.id==='riro');if(riro&&target&&passiveChance(.50)){await reactivePassiveBeat(riro,'アーティスト・マインド！');cleanse(target);notice(`${target.name}の状態異常を解除！`,'status');await fixedDelay(600);return true;}return false;}
function isSuper(a){return state.battle.superIds.includes(a.id);}
async function damageAlly(a,power,type='physical',superHalf=false){
  if(!a||a.dead)return 0;
  if(a.barrier>0){a.barrier--;notice(`${a.name}のバリアが攻撃を無効化！`,'buff');renderBattle();return 0;}
  let d=calcEnemyDamage(a,power,type);
  if(superHalf||isSuper(a))d=Math.round(d*.5);
  if(a.guardTurns>0)d=Math.round(d*(1-a.guard));
  if(a.damageCutTurns>0)d=Math.round(d*(1-a.damageCut));
  if(state.battle.teamGuardTurns>0)d=Math.round(d*(1-state.battle.teamGuard));
  if(a.id==='yusha'&&state.battle.yushaGuardTurns>0)d=Math.round(d*(1-state.battle.yushaGuard));
  const desert=livingField().find(x=>x.id==='desert');if(desert&&passiveChance(.20)){await reactivePassiveBeat(desert,'サバクノマモリビト！');d=Math.round(d*.8);await fixedDelay(360);}
  const scriptedImmortal=state.battle?.mode==='story'&&state.battle?.config?.scriptedImmortalParty;a.hp=Math.max(scriptedImmortal?1:0,a.hp-d);
  if(a.hp<=0)a.dead=true;
  renderBattle();
  pulseAllyDamage(a.id);
  floatNumber(d,'damage',a.id);
  fx(type==='magic'?'magic':'enemy',a.id);
  if(a.dead)notice(`${a.name} DOWN`,'danger',850);
  return d;
}
async function inflictAllyStatus(a,kind,turns){if(!a||a.dead)return false;const resist=.2; if(Math.random()<resist)return false;a.status[kind]=Math.max(a.status[kind],turns);if(await maybeArtistCleanse(a))return false;return true;}

async function performAttack(a,auto=false){await actionCutin(`${a.name}の攻撃！`,'system',480);let crit=TEMP_BALANCE.critRate,denPassive=false;if(a.id==='denden'&&passiveChance(.20)){await passiveBeat(a,'デンデン・ムキムキ・カナリツヨイ！');crit=1;denPassive=true;}const nyoroAoe=a.id==='nyoro'&&livingEnemies().length>1&&passiveChance(.70);if(nyoroAoe)await passiveBeat(a,'マグマスイミング！');await weaponElementAttackFx(a);if(nyoroAoe)await playerAoeDamage(a,1,'physical',crit);else applyEnemyDamage(a,1,'physical',crit,false);if(denPassive)await fixedDelay(600);if(a.id==='tetsu'&&livingEnemies().length&&passiveChance(.30)){await passiveBeat(a,'テツの意志！');await weaponElementAttackFx(a,{quick:true});applyEnemyDamage(a,.85,'physical',TEMP_BALANCE.critRate,false);await fixedDelay(600);}await delay(auto?150:220);}
async function performMagic(a,auto=false){const element=normalizeElement(a.attribute),s=MOB_DATA.elements[element];if(a.mpNow<s.cost){notice('MPが足りない！','danger');return false;}a.mpNow-=s.cost;const magicReady=preloadAssets(s.frames);await actionCutin(`${a.name}の${s.spell}！`,'system',560);await magicReady;await skillSprite(s.frames,'enemy');const r=applyEnemyDamage(a,s.power,'magic');if(a.id==='jessie'&&element==='雷'&&state.battle.enemy.hp>0&&passiveChance(.50)){await passiveBeat(a,'ダブルサンダー！');await skillSprite(s.frames,'enemy');const r2=applyEnemyDamage(a,s.power*.9,'magic');await fixedDelay(600);}await delay(auto?170:240);return true;}
async function performUltimate(a,u){if(a.mpNow<u.cost){notice('MPが足りない！','danger');return false;}a.mpNow-=u.cost;await ultimateCutin(a,u);let total=0,r,lastHitEnemy=null;
  const hit=async(power=u.power,type=u.type||'physical',crit=u.crit||0)=>{const e=targetEnemy();lastHitEnemy=e;r=applyEnemyDamageTo(a,e,power,type,crit);total+=r.value;await delay(90);return r;};
  const hitEnemy=async(e,power=u.power,type=u.type||'physical',crit=u.crit||0)=>{lastHitEnemy=e;r=applyEnemyDamageTo(a,e,power,type,crit);total+=r.value;await delay(80);return r;};
  const aoe=async(power=u.power,type=u.type||'physical',crit=u.crit||0,status='',chance=0,turns=3)=>{const x=await playerAoeDamage(a,power,type,crit,status,chance,turns);total+=x;return x;};
  const allEnemyDebuff=(key,value,turns=3)=>{for(const e of livingEnemies()){e[key]=value;e[`${key}Turns`]=turns;}};
  switch(u.kind){
    case'selfAllBuff':a.allBuff=.20;a.allBuffTurns=rint(3,5);a.damageCut=.10;a.damageCutTurns=a.allBuffTurns;fx('buff',a.id);notice('ALL STATUS ↑↑ / DAMAGE CUT','buff');break;
    case'jumanji':{await hit();const buff=pick(['atk','def','spd']);a[`${buff}Buff`]=.15;a[`${buff}BuffTurns`]=3;const deb=pick(['defDebuff','spdDebuff']);for(const e of livingEnemies()){e[deb]=.12;e[`${deb}Turns`]=3;}notice(`${buff.toUpperCase()} ↑ / ENEMY ALL ${deb.startsWith('def')?'DEF':'SPD'} ↓`,'buff');break;}
    case'lowHpBurst':{const all=livingField(),avg=all.reduce((s,x)=>s+x.hp/x.maxHp,0)/Math.max(1,all.length);await hit(u.power*(1+(1-avg)*.65),'magic');break;}
    case'heroTransform':heal(a,a.maxHp*.5);a.transformed=true;a.allBuff=.30;a.allBuffTurns=99;notice('あのヒーローに変身！ ALL STATUS ↑30%','buff',1000);break;
    case'shieldAttack':await hit();a.guard=.20;a.guardTurns=1;notice('GUARD ↑','buff');break;
    case'healCleanse':healField(u.power);livingField().forEach(x=>{if(Math.random()<.5)cleanse(x);fx('heal',x.id);});notice('PARTY HP RECOVER / CLEANSE','heal');break;
    case'yushaGuardAoe':await aoe();state.battle.yushaGuard=.50;state.battle.yushaGuardTurns=1;notice('勇者 DAMAGE CUT','buff');break;
    case'teamGuardAoe':await aoe();state.battle.teamGuard=.30;state.battle.teamGuardTurns=1;notice('PARTY GUARD','buff');break;
    case'selfHealAttack':heal(a,a.maxHp*.16);await hit();notice('HP RECOVER','heal');break;
    case'goldAttack':await hit();break;
    case'speedDebuffAttack':await hit();if(lastHitEnemy){lastHitEnemy.spdDebuff=.15;lastHitEnemy.spdDebuffTurns=3;}notice('SPD ↓↓','status');break;
    case'aoeSpeedDebuff':await aoe();allEnemyDebuff('spdDebuff',.15,3);notice('ENEMY ALL SPD ↓↓','status');break;
    case'burnAttack':await hit();if(lastHitEnemy&&applyEnemyStatusTo(lastHitEnemy,'burn',u.chance||.1))notice(`${lastHitEnemy.name}はやけど状態！`,'status');break;
    case'aoeBurn':await aoe(u.power,u.type||'physical',0,'burn',u.chance||.1,3);notice('敵全体にやけど判定！','status');break;
    case'teamDefAoe':await aoe();livingField().forEach(x=>{x.defBuff=.15;x.defBuffTurns=3;});notice('PARTY DEF ↑','buff');break;
    case'teamDefAttack':await hit();livingField().forEach(x=>{x.defBuff=.15;x.defBuffTurns=3;});notice('PARTY DEF ↑','buff');break;
    case'selfCleanseAttack':cleanse(a);await hit();notice('状態異常解除！','status');break;
    case'sleepAttack':await hit();if(lastHitEnemy&&applyEnemyStatusTo(lastHitEnemy,'sleep',u.chance||.1))notice(`${lastHitEnemy.name}は眠った！`,'status');break;
    case'paralyzeAttack':await hit();if(lastHitEnemy&&applyEnemyStatusTo(lastHitEnemy,'paralyze',u.chance||.1))notice(`${lastHitEnemy.name}はマヒした！`,'status');break;
    case'aoeSelfSpd':await aoe();a.spdBuff=.18;a.spdBuffTurns=3;notice('SPD ↑','buff');break;
    case'selfSpdAttack':await hit();a.spdBuff=.18;a.spdBuffTurns=3;notice('SPD ↑','buff');break;
    case'playerSinglePlusAoe':await hit();await aoe(u.aoePower||.70,u.type||'magic');break;
    case'playerSinglePlusAoeParalyze':await hit();await aoe(u.aoePower||1.35,u.type||'physical',0,'paralyze',u.chance||.10,2);notice('敵全体にマヒ判定！','status');break;
    case'multiAttack':{const n=rint(u.hits?.[0]||3,u.hits?.[1]||6);for(let i=0;i<n&&livingEnemies().length;i++)await hitEnemy(pick(livingEnemies()),u.power,u.type||'physical');notice(`${n} HIT`,'system',420);break;}
    case'teamRecovery':healField(.16);restoreMpField(.10);livingField().forEach(x=>{x.defBuff=.12;x.defBuffTurns=3;});notice('PARTY HP/MP RECOVER / DEF ↑','heal');break;
    case'stunAttack':await hit();if(lastHitEnemy&&applyEnemyStatusTo(lastHitEnemy,'stun',u.chance||.1,1))notice(`${lastHitEnemy.name}をひるませた！`,'status');break;
    case'aoeStun':await aoe(u.power,u.type||'physical',0,'stun',u.chance||.1,1);notice('敵全体にひるみ判定！','status');break;
    case'selfRecoveryAttack':await hit();heal(a,a.maxHp*.12);a.mpNow=Math.min(a.maxMp,a.mpNow+a.maxMp*.08);notice('HP・MP RECOVER','heal');break;
    case'teamHealGuard':healField(u.power||.28);state.battle.teamGuard=.10;state.battle.teamGuardTurns=3;notice('PARTY HP RECOVER / DAMAGE CUT','heal');break;
    case'fullHealBarrier':heal(a,a.maxHp);livingField().forEach(x=>x.barrier=Math.max(x.barrier,1));notice('FULL HEAL / PARTY BARRIER','heal');break;
    case'teamAtkAttack':await hit();livingField().forEach(x=>{x.atkBuff=.15;x.atkBuffTurns=3;});notice('PARTY ATK ↑','buff');break;
    case'healAttack':healField(u.heal||.24);await hit();notice('PARTY HP RECOVER','heal');break;
    case'tetsuFinal':a.atkBuff=.18;a.atkBuffTurns=3;{const e=targetEnemy();if(e){e.defDebuff=.15;e.defDebuffTurns=3;await hitEnemy(e);}}notice('ATK ↑ / DEF ↓','buff');break;
    case'healAoeStun':healField(u.heal||.25);restoreMpField(.10);await aoe(u.power,u.type||'magic',0,'stun',u.chance||.3,1);notice('PARTY RECOVER / 敵全体ひるみ判定','heal');break;
    case'healStunAttack':healField(u.heal||.25);restoreMpField(.10);await hit();if(lastHitEnemy&&applyEnemyStatusTo(lastHitEnemy,'stun',u.chance||.3,1))notice('ひるみ！','status');else notice('PARTY RECOVER','heal');break;
    case'poisonAttack':await hit();if(lastHitEnemy&&applyEnemyStatusTo(lastHitEnemy,'poison',u.chance||.3))notice(`${lastHitEnemy.name}は毒になった！`,'status');break;
    case'aoePoison':await aoe(u.power,u.type||'physical',0,'poison',u.chance||.3,3);notice('敵全体に毒判定！','status');break;
    case'narakuShield':a.damageCut=.20;a.damageCutTurns=3;state.battle.teamGuard=.10;state.battle.teamGuardTurns=3;notice('GUARD ↑↑ / PARTY GUARD ↑','buff');break;
    case'selfAtkAoe':a.atkBuff=.18;a.atkBuffTurns=3;await aoe();notice('ATK ↑ / ENEMY ALL DAMAGE','buff');break;
    case'selfAtkAttack':a.atkBuff=.18;a.atkBuffTurns=3;await hit();notice('ATK ↑','buff');break;
    case'aoeDamage':await aoe();break;
    case'damage':default:await hit();break;
  }
  renderBattle();await delay(250);return true;
}

async function applyRoundDots(){
  for(const e of state.battle.enemies||[]){if(e.hp<=0)continue;for(const k of ['poison','burn'])if(e.status[k]>0){const d=Math.max(1,Math.round(e.maxHp*.025));e.hp=Math.max(state.battle?.mode==='story'&&state.battle?.config?.scriptedImmortalEnemy?1:0,e.hp-d);e.status[k]--;floatNumber(d,'damage',`enemy:${e.uid}`);notice(`${e.name}に${k==='poison'?'毒':'やけど'}ダメージ！`,'status');if(e.hp<=0)recordEnemyDefeat(e);}}
  for(const a of fieldAllies()){if(a.dead)continue;for(const k of ['poison','burn'])if(a.status[k]>0){const d=Math.max(1,Math.round(a.maxHp*.025));a.hp=Math.max(state.battle?.mode==='story'&&state.battle?.config?.scriptedImmortalParty?1:0,a.hp-d);a.status[k]--;if(a.hp<=0){a.dead=true;notice(`${a.name} DOWN`,'danger');}else notice(`${a.name}に${k==='poison'?'毒':'やけど'}ダメージ！`,'status');}}
  if(!livingEnemies().length)state.battle.targetEnemyId=null;renderBattle();await checkSpecialRevives();
}
function tickBuffs(){const b=state.battle;for(const e of b.enemies||[])for(const k of ['shieldTurns','allyShieldTurns','atkBuffTurns','defDebuffTurns','spdDebuffTurns'])if(e[k]>0)e[k]--;if(b.teamGuardTurns>0)b.teamGuardTurns--;if(b.yushaGuardTurns>0)b.yushaGuardTurns--;fieldAllies().forEach(a=>{for(const k of ['guardTurns','damageCutTurns','atkBuffTurns','atkDebuffTurns','defBuffTurns','spdBuffTurns','spdDebuffTurns'])if(a[k]>0)a[k]--;if(a.allBuffTurns>0&&a.allBuffTurns<90)a.allBuffTurns--;});}
function initiativeSpeed(entry){if(entry.type==='enemy'){const e=enemyByUid(entry.enemyId);return e?e.spd*(e.spdDebuffTurns>0?1-e.spdDebuff:1):0;}const a=allyById(entry.id);return a?effective('spd',a):0;}
async function playFrezardFusion(){
  const b=state.battle,field=$('#battleField')||$('#battleScreen'),layer=$('#battleFxLayer');if(!b||!field||!layer)return;const fr=field.getBoundingClientRect(),center={x:fr.width*.5,y:fr.height*.43},sources=(b.enemies||[]).slice(0,2);const ghosts=[];
  for(const e of sources){const vis=enemyVisual(e.uid),r=vis?.getBoundingClientRect();if(!vis||!r)continue;const img=document.createElement('img');img.className='fusion-ghost';img.src=e.image||'';img.style.left=`${r.left-fr.left+r.width/2}px`;img.style.top=`${r.top-fr.top+r.height/2}px`;img.style.width=`${Math.max(42,r.width)}px`;img.style.height=`${Math.max(42,r.height)}px`;img.style.setProperty('--merge-x',`${center.x-(r.left-fr.left+r.width/2)}px`);img.style.setProperty('--merge-y',`${center.y-(r.top-fr.top+r.height/2)}px`);layer.appendChild(img);ghosts.push(img);}
  await nextPaint();ghosts.forEach(g=>g.classList.add('merge'));await actionCutin('2人の魔物は合体した！','danger',850);await fixedDelay(120);ghosts.forEach(g=>g.remove());await storyFlashBattle();
}
async function storyFlashBattle(){const el=document.createElement('div');el.className='battle-fusion-flash';$('#battleFxLayer')?.appendChild(el);await fixedDelay(260);el.remove();}
async function spawnNextEnemyWave(){
  const b=state.battle;if(!b?.pendingWaveConfigs?.length)return false;const records=b.pendingWaveConfigs.shift(),isFrezard=records.some(r=>r.id==='m-frezard');if(isFrezard)await playFrezardFusion();const next=buildEnemyWave(records,Math.min(4,b.allies.length),b.bg,b.fallbackBg);if(!next.length)return false;b.enemies=next;b.targetEnemyId=next[0].uid;b.enemy=next[0];b.actingEnemyId=null;b.queue=[];b.queuePos=0;renderBattle();if(isFrezard){await actionCutin('モブフレザードが出現！','danger',650);}else{await actionCutin('ENEMY PHASE CHANGE!','danger',650);notice(`${next.map(e=>e.name).join('・')}が現れた！`,'danger',900);}await fixedDelay(450);b.turn++;b.busy=false;startRound();return true;
}
async function handleEnemyWaveClear(){if(livingEnemies().length)return false;if(state.battle.pendingWaveConfigs?.length)return await spawnNextEnemyWave();finishBattle(true);return true;}
async function startRound(){
  const b=state.battle;if(!b||b.finished)return;b.busy=true;b.queuePos=0;await applyRoundDots();if(!livingEnemies().length){b.busy=false;return handleEnemyWaveClear();}if(!livingRoster().length)return finishBattle(false);await resolveRequiredReplacements();if(!livingRoster().length)return finishBattle(false);
  for(const a of fieldAllies().filter(x=>!x.dead)){
    if(a.id==='nekoku'&&passiveChance(.30)){const target=[...livingField()].sort((x,y)=>x.hp/x.maxHp-y.hp/y.maxHp)[0];if(target){await passiveBeat(a,'癒しのプニプニ！');const h=heal(target,target.maxHp*.14);if(h)notice(`${target.name} HP +${h}`,'heal');await fixedDelay(600);}}
    if(a.id==='money'&&passiveChance(.30)){await passiveBeat(a,'マニーは海を渡る！');const m=Math.round(a.maxMp*.12);a.mpNow=Math.min(a.maxMp,a.mpNow+m);notice(`MP +${m}`,'heal');await fixedDelay(600);}
    if(a.id==='naraku'){await passiveBeat(a,'魔王の系譜！');a.narakuStacks++;a.allBuff=Math.min(.80,a.narakuStacks*.10);a.allBuffTurns=99;notice(`ALL STATUS ↑${a.narakuStacks*10}%`,'buff');await fixedDelay(600);}
  }
  const enemyEntries=livingEnemies().flatMap(e=>e.isBoss?[{type:'enemy',enemyId:e.uid,action:1},{type:'enemy',enemyId:e.uid,action:2}]:[{type:'enemy',enemyId:e.uid,action:1}]);
  b.queue=[...livingMain().map(a=>({type:'ally',id:a.id})),...enemyEntries,...livingSuper().filter(a=>b.turn>=a.nextSupportTurn).map(a=>({type:'super',id:a.id}))].sort((x,y)=>initiativeSpeed(y)-initiativeSpeed(x)+((Math.random()-.5)*.01));b.busy=false;renderBattle();await processQueue();
}
async function processQueue(){
  const b=state.battle;if(!b||b.finished||b.busy)return;while(b.queuePos<b.queue.length){const entry=b.queue[b.queuePos];
    if(entry.type==='ally'){const a=allyById(entry.id);if(!a||a.dead||!b.mainIds.includes(a.id)){b.queuePos++;continue;}if(a.status.sleep>0){a.status.sleep--;notice(`${a.name}は眠っている！`,'status');b.queuePos++;await delay(300);continue;}if(a.status.stun>0){a.status.stun--;notice(`${a.name}はひるんで動けない！`,'status');b.queuePos++;await delay(300);continue;}if(a.status.paralyze>0){notice(`${a.name}はマヒして動けない！`,'status');b.queuePos++;await delay(300);continue;}renderBattle();if(b.auto)setTimeout(autoAct,100);return;}
    if(entry.type==='enemy'){const e=enemyByUid(entry.enemyId);if(!e||e.hp<=0){b.queuePos++;continue;}const prev=b.queue[b.queuePos-1];if(prev&&(prev.type==='ally'||prev.type==='super'))await fixedDelay(1000);else if(prev&&prev.type==='enemy')await fixedDelay(600);b.busy=true;b.actingEnemyId=e.uid;b.enemy=e;renderBattle();await enemyAction(entry.action||1,e.uid);b.actingEnemyId=null;b.enemy=targetEnemy();b.busy=false;b.queuePos++;if(b.finished)return;await resolveRequiredReplacements();if(b.finished)return;continue;}
    if(entry.type==='super'){const a=allyById(entry.id);if(!a||a.dead||!b.superIds.includes(a.id)){b.queuePos++;continue;}b.busy=true;renderBattle();await superSubAction(a);a.nextSupportTurn=b.turn+rint(2,5);b.busy=false;b.queuePos++;if(!livingEnemies().length){if(await handleEnemyWaveClear())return;}continue;}
  }await endRound();
}
async function endRound(){const b=state.battle;if(!b||b.finished)return;tickBuffs();b.turn++;if(b.mode==='story'&&b.config?.scriptedTurnLimit&&b.turn>Number(b.config.scriptedTurnLimit)){return finishScriptedBattle();}await delay(120);startRound();}
function temporaryEnemySpecial(e){
  const attr=normalizeElement(e.attribute),names={火:'フレイムショット（仮）',水:'ウォーターバブル（仮）',雷:'サンダーショック（仮）',地:'ロックブロー（仮）',風:'ウィンドカッター（仮）',光:'ライトパルス（仮）',闇:'ダークミスト（仮）',無:'パワーアタック（仮）'};
  if(e.tempAi==='heal')return{special:'リカバリー（仮）',kind:'enemyHeal',power:.18,temporary:true};
  if(e.tempAi==='aoe')return{special:'エレメントボム（仮）',kind:'aoe',power:.60,skillElement:attr,skillType:'magic',temporary:true};
  if(e.tempAi==='debuff')return{special:'ミストブレイク（仮）',kind:'single',power:.72,skillElement:attr,skillType:'magic',temporary:true};
  return{special:names[attr]||names['無'],kind:'single',power:e.category==='elite'?.82:.74,skillElement:attr,skillType:(attr==='地'||attr==='無')?'physical':'magic',temporary:true};
}
function enemySpecialSpec(e){if(e.specialOptions?.length)return pick(e.specialOptions);if(e.special)return e;return temporaryEnemySpecial(e);}
async function enemyAction(actionIndex=1,enemyId){
  const b=state.battle,e=enemyByUid(enemyId)||actingEnemy()||b.enemy;if(!e||e.hp<=0)return;if(e.status.sleep>0){e.status.sleep--;notice(`${e.name}は眠っている！`,'status');await delay(350);return;}if(e.status.stun>0){e.status.stun--;notice(`${e.name}はひるんで動けない！`,'status');await delay(350);return;}if(e.status.paralyze>0){e.status.paralyze--;notice(`${e.name}はマヒして動けない！`,'status');await delay(350);return;}
  const hasSource=!!(e.special||e.specialOptions?.length),useSpecial=e.isBoss?(actionIndex===1&&b.turn%(e.specialEvery||TEMP_BALANCE.bossSpecialEvery)===0):e.isElite?(hasSource?b.turn%3===0:Math.random()<.22):Math.random()<.18;
  if(useSpecial)await bossSpecial(enemySpecialSpec(e));else await bossNormal();if(!livingRoster().length)finishBattle(false);
}
async function bossNormal(){const e=actingEnemy()||state.battle.enemy,t=pick(livingMain());if(!e||!t)return;await actionCutin(`${e.name}の攻撃！`,'danger',520);await beginEnemyLunge(e.uid);try{await damageAlly(t,1,'physical',false);await delay(320);}finally{endEnemyLunge();}}
async function aoeHit(power,type='physical'){let total=0;for(const a of [...livingMain()]){total+=await damageAlly(a,power,type,false);await delay(70);}for(const a of [...livingSuper()]){total+=await damageAlly(a,power,type,true);await delay(70);}return total;}
async function bossSpecial(spec){
  const e=actingEnemy()||state.battle.enemy;if(!e)return;spec=spec||enemySpecialSpec(e);await actionCutin(`${e.name}の${spec.special}！`,'danger',700);await beginEnemyLunge(e.uid);let t,d,total=0;const hit=async(target,m=spec.power||1.0,type=spec.skillType||'physical')=>{const x=await damageAlly(target,m,type,false);await delay(80);return x;};
  try{switch(spec.kind){
    case'shield':e.damageReduction=.20;e.shieldTurns=3;for(const ally of livingEnemies())if(ally.uid!==e.uid){ally.allyShieldReduction=.10;ally.allyShieldTurns=3;fx('buff',`enemy:${ally.uid}`);}fx('buff',`enemy:${e.uid}`);notice('自身20% / 味方10% DAMAGE CUT','buff');break;
    case'reviveMummy':{const dead=(state.battle.enemies||[]).find(x=>x.hp<=0&&String(x.name).includes('ミイラ'));if(dead){dead.hp=Math.max(1,Math.round(dead.maxHp*.45));dead.status={poison:0,burn:0,sleep:0,stun:0,paralyze:0};notice(`${dead.name}が復活！`,'heal',800);floatNumber(dead.hp,'heal',`enemy:${dead.uid}`);}else{t=pick(livingMain());if(t)await hit(t,.72,'magic');}break;}
    case'enemyHeal':{const target=[...livingEnemies()].sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0]||e;if(target){const h=Math.round(target.maxHp*(spec.power||.18));target.hp=Math.min(target.maxHp,target.hp+h);floatNumber(h,'heal',`enemy:${target.uid}`);notice(`${target.name} HP回復`,'heal');}break;}
    case'poisonSingle':t=pick(livingMain());if(t){d=await hit(t,spec.power||.82,spec.skillType||'physical');if(Math.random()<(spec.chance??.10)&&await inflictAllyStatus(t,'poison',3))notice(`${t.name}は毒になった！`,'status');}break;
    case'burnSingle':t=pick(livingMain());if(t){d=await hit(t,spec.power,'magic');if(Math.random()<(spec.chance??.5)&&await inflictAllyStatus(t,'burn',3))notice(`${t.name}はやけど状態！`,'status');}break;
    case'stunSingle':t=pick(livingMain());if(t){d=await hit(t,spec.power,'magic');await inflictAllyStatus(t,'stun',1);notice(`${t.name}はひるんだ！`,'status');}break;
    case'doubleSingleStun':t=pick(livingMain());if(t){total+=await hit(t,spec.power,'magic');if(!t.dead)total+=await hit(t,spec.power,'magic');await inflictAllyStatus(t,'stun',1);notice(`${t.name}はひるんだ！`,'status');}break;
    case'singlePlusAoe':t=pick(livingMain());if(t)total+=await hit(t,spec.power,'magic');total+=await aoeHit(.52,'magic');break;
    case'singleSpdDown':t=pick(livingMain());if(t){total+=await hit(t,spec.power||1.0,spec.skillType||'physical');t.spdDebuff=Math.max(t.spdDebuff||0,spec.debuff||.12);t.spdDebuffTurns=Math.max(t.spdDebuffTurns||0,3);notice(`${t.name} SPD ↓`,'status');}break;
    case'aoeParalyzeChance':total=await aoeHit(spec.power||.64,spec.skillType||'magic');for(const a of [...livingMain(),...livingSuper()])if(Math.random()<(spec.chance||.20))await inflictAllyStatus(a,'paralyze',2);break;
    case'healAoeBoss':total=await aoeHit(spec.power||1.25,spec.skillType||'magic');{const h=Math.round(e.maxHp*(spec.heal||.06));e.hp=Math.min(e.maxHp,e.hp+h);floatNumber(h,'heal',`enemy:${e.uid}`);fx('buff',`enemy:${e.uid}`);notice(`${e.name} HP +${h}`,'heal');}break;
    case'aoeAtkDown':total=await aoeHit(spec.power||.68,spec.skillType||'magic');for(const a of [...livingMain(),...livingSuper()]){a.atkDebuff=Math.max(a.atkDebuff||0,spec.debuff||.05);a.atkDebuffTurns=Math.max(a.atkDebuffTurns||0,3);}notice(`PARTY ATK ↓${Math.round((spec.debuff||.05)*100)}%`,'status');break;
    case'aoeStunChance':total=await aoeHit(spec.power||.68,spec.skillType||'physical');for(const a of [...livingMain(),...livingSuper()])if(Math.random()<(spec.chance||.03))await inflictAllyStatus(a,'stun',1);break;
    case'multi':case'multiFixed':{const n=rint(spec.hits?.[0]||3,spec.hits?.[1]||6);for(let i=0;i<n&&livingMain().length;i++)total+=await hit(pick(livingMain()),spec.power);notice(`${n} HIT`,'system',420);break;}
    case'healSingle':t=pick(livingMain());if(t)d=await hit(t,spec.power,'magic');{const h=Math.round(e.maxHp*.06);e.hp=Math.min(e.maxHp,e.hp+h);floatNumber(h,'heal',`enemy:${e.uid}`);notice(`BOSS HP +${h}`,'heal');}break;
    case'buffAoe':e.atkBuff=.18;e.atkBuffTurns=3;total=await aoeHit(spec.power,'magic');notice('ATK ↑','buff');break;
    case'doubleAoe':for(let n=0;n<2;n++)total+=await aoeHit(spec.power,'physical');notice('2 HIT','system',420);break;
    case'aoeStun':total=await aoeHit(spec.power,'magic');for(const a of livingMain())if(Math.random()<.7)await inflictAllyStatus(a,'stun',1);for(const a of livingSuper())if(Math.random()<.7)await inflictAllyStatus(a,'stun',1);notice('ひるみ判定','status');break;
    case'aoe':total=await aoeHit(spec.power||.68,spec.skillType||((spec.skillElement||e.attribute).includes('火')||(spec.skillElement||e.attribute).includes('闇')?'magic':'physical'));break;
    case'single':default:t=pick(livingMain());if(t)d=await hit(t,spec.power||.82,spec.skillType||'physical');break;
  }}finally{endEnemyLunge();}await checkSpecialRevives();renderBattle();await delay(280);
}

async function superSubAction(a){await fixedDelay(600);await actionCutin(`${a.name}の援護！`,'system',650);try{if(a.status.sleep>0){a.status.sleep--;notice(`${a.name}は眠っている！`,'status');return;}if(a.status.stun>0){a.status.stun--;notice(`${a.name}はひるんで動けない！`,'status');return;}if(a.status.paralyze>0){notice(`${a.name}はマヒして動けない！`,'status');return;}const low=livingField().some(x=>x.hp/x.maxHp<.45);if((a.id==='money'||a.id==='pink'||a.id==='riro')&&low){const h=healField(.12);notice(`SUPER SUPPORT / PARTY HP +${h}`,'heal');return;}const s=MOB_DATA.elements[normalizeElement(a.attribute)];if(a.mpNow>=s.cost&&Math.random()<.45){await performMagic(a,true);return;}await performAttack(a,true);}finally{clearEnemyImpact();await fixedDelay(600);}}

function findGroup(id){const b=state.battle;for(const key of ['mainIds','superIds','reserveIds']){const i=b[key].indexOf(id);if(i>=0)return{key,index:i};}return null;}
function swapGroupMembers(outId,inId){const b=state.battle,a=findGroup(outId),c=findGroup(inId);if(!a||!c)return false;[b[a.key][a.index],b[c.key][c.index]]=[b[c.key][c.index],b[a.key][a.index]];return true;}
function replacementCandidates(exclude=[]){const b=state.battle,ids=[...b.superIds,...b.reserveIds].filter(id=>!exclude.includes(id)),seen=new Set();return ids.map(allyById).filter(a=>a&&!a.dead&&a.hp>0&&!seen.has(a.id)&&(seen.add(a.id)||true));}
function reserveReplacementCandidates(exclude=[]){const b=state.battle;return b.reserveIds.filter(id=>!exclude.includes(id)).map(allyById).filter(a=>a&&!a.dead&&a.hp>0);}
async function chooseReplacement(title,candidates){if(!candidates.length)return null;if(state.battle.auto)return candidates[0].id;const sheet=$('#skillMenu'),list=$('#skillMenuList');sheet.hidden=false;$('#skillMenuKicker').textContent='MEMBER CHANGE';$('#skillMenuTitle').textContent=title;list.innerHTML=candidates.map(a=>`<button class="skill-item" data-replace-id="${a.id}" type="button"><span class="ult-thumb"><img src="${versionedPlay(a.image)}" alt=""><i>${a.symbol}</i></span><div><b>${a.name}</b><small>HP ${Math.ceil(a.hp)} / ${a.maxHp}　MP ${Math.floor(a.mpNow)}</small></div><em>${state.battle.superIds.includes(a.id)?'援護':'RESERVE'}</em></button>`).join('');bindImages(list);return new Promise(resolve=>{$$('[data-replace-id]',list).forEach(btn=>btn.onclick=()=>{sheet.hidden=true;resolve(btn.dataset.replaceId);});});}
async function resolveRequiredReplacements(){const b=state.battle;if(!b||b.finished)return;await checkSpecialRevives();for(let i=0;i<b.mainIds.length;i++){const a=allyById(b.mainIds[i]);if(a&&!a.dead&&a.hp>0)continue;const candidates=replacementCandidates();if(!candidates.length)continue;const inId=await chooseReplacement(`${a?.name||'メイン'}の交代メンバーを選択`,candidates);if(inId){const incoming=allyById(inId);swapGroupMembers(b.mainIds[i],inId);notice(`CHANGE → ${incoming.name}`,'system',750);renderBattle();}}
  for(let i=0;i<b.superIds.length;i++){const a=allyById(b.superIds[i]);if(a&&!a.dead&&a.hp>0)continue;const candidates=reserveReplacementCandidates();if(!candidates.length)continue;const inId=await chooseReplacement(`援護枠 ${i+1}を入れ替えますか？`,candidates);if(inId){const incoming=allyById(inId);swapGroupMembers(b.superIds[i],inId);incoming.nextSupportTurn=b.turn+rint(2,5);notice(`援護 CHANGE → ${incoming.name}`,'system',750);renderBattle();}}
  if(!livingRoster().length)finishBattle(false);
}

async function act(kind,payload){
  const b=state.battle,a=activeAlly();
  if(!b||!a||b.busy||b.finished)return;
  b.busy=true;setCommandDisabled(true);
  let consumed=true;
  try{
    if(kind==='attack')await performAttack(a);
    else if(kind==='magic')consumed=await performMagic(a);
    else if(kind==='ultimate')consumed=await performUltimate(a,payload);
    else if(kind==='defend'){
      a.guard=.45;a.guardTurns=1;
      await actionCutin(`${a.name}の防御！`,'buff',420);
      notice(`${a.name}は身を守っている！`,'buff');fx('buff',a.id);await delay(220);
    }else if(kind==='switch')consumed=await performSwitch(payload);
  }catch(err){
    console.error('[MOB QUEST] action recovered:',kind,err);
    // Consume the selected action rather than leaving the battle permanently locked.
    consumed=true;
  }
  if(!consumed){b.busy=false;renderBattle();return;}
  if(!livingEnemies().length){
    b.busy=false;
    renderBattle();
    await handleEnemyWaveClear();
    return;
  }
  b.queuePos++;
  b.busy=false;
  renderBattle();
  await processQueue();
}
async function performSwitch(payload){if(!payload)return false;const out=allyById(payload.outId),incoming=allyById(payload.inId);if(!out||!incoming||incoming.dead||incoming.hp<=0||!state.battle.mainIds.includes(out.id))return false;if(!swapGroupMembers(out.id,incoming.id))return false;renderBattle();await actionCutin(`CHANGE! ${out.name} → ${incoming.name}`,'system',700);await delay(180);return true;}
function openSwitchMenu(){const a=activeAlly();if(!a)return;const candidates=[...superAllies(),...reserveAllies()].filter(x=>!x.dead&&x.hp>0);if(!candidates.length)return notice('入れ替え可能なメンバーがいません','danger');const sheet=$('#skillMenu'),list=$('#skillMenuList');sheet.hidden=false;$('#skillMenuKicker').textContent=`${a.name}の行動 / ターン消費`;$('#skillMenuTitle').textContent='入れ替える';list.innerHTML=`<div class="switch-zone-title super">援護メンバー</div>${superAllies().map(x=>`<button class="skill-item ${x.dead?'disabled':''}" data-switch-in="${x.id}" type="button" ${x.dead?'disabled':''}><span class="ult-thumb"><img src="${versionedPlay(x.image)}" alt=""><i>${x.symbol}</i></span><div><b>${x.name}</b><small>HP ${Math.ceil(x.hp)} / MP ${Math.floor(x.mpNow)}</small></div><em>援護</em></button>`).join('')}<div class="switch-zone-title reserve">RESERVE</div>${reserveAllies().map(x=>`<button class="skill-item ${x.dead?'disabled':''}" data-switch-in="${x.id}" type="button" ${x.dead?'disabled':''}><span class="ult-thumb"><img src="${versionedPlay(x.image)}" alt=""><i>${x.symbol}</i></span><div><b>${x.name}</b><small>HP ${Math.ceil(x.hp)} / MP ${Math.floor(x.mpNow)}</small></div><em>RESERVE</em></button>`).join('')}`;bindImages(list);$$('[data-switch-in]',list).forEach(btn=>btn.onclick=()=>{sheet.hidden=true;act('switch',{outId:a.id,inId:btn.dataset.switchIn});});}

async function autoAct(){const b=state.battle,a=activeAlly();if(!b||!a||!b.auto||b.busy||b.finished)return;const usable=availableUlts(a).filter(u=>a.mpNow>=u.cost);if(usable.length&&Math.random()<.32)return act('ultimate',pick(usable));const s=MOB_DATA.elements[normalizeElement(a.attribute)];if(a.mpNow>=s.cost&&Math.random()<.30)return act('magic');return act('attack');}
function openSkillMenu(type){const a=activeAlly();if(!a)return;const list=$('#skillMenuList');$('#skillMenu').hidden=false;if(type==='magic'){const s=MOB_DATA.elements[normalizeElement(a.attribute)];s.frames?.forEach(src=>preloadAsset(src,'high'));$('#skillMenuKicker').textContent=`${a.name} / MP ${Math.floor(a.mpNow)}`;$('#skillMenuTitle').textContent='魔法';list.innerHTML=`<button class="skill-item" data-use-magic type="button"><span class="skill-symbol">${normalizeElement(a.attribute)}</span><div><b>${s.spell}<em class="temp-badge">仮</em></b><small>${TEMP_BALANCE.magicNote}</small></div><em>MP ${s.cost} 仮</em></button>`;$('[data-use-magic]',list).onclick=()=>{$('#skillMenu').hidden=true;act('magic');};}else{const unlocked=availableUlts(a);unlocked.forEach(u=>preloadAsset(u.image,'high'));$('#skillMenuKicker').textContent=`${a.name} / Lv${a.level} / MP ${Math.floor(a.mpNow)}`;$('#skillMenuTitle').textContent='必殺技';list.innerHTML=a.ults.map((u,i)=>{const req=i<4?[1,15,30,50][i]:null,ok=unlocked.includes(u);return`<button class="skill-item ${!ok?'locked':''} ${ok&&a.mpNow<u.cost?'disabled':''}" data-ult-index="${i}" type="button" ${!ok?'disabled':''}><span class="ult-thumb"><img src="${u.image}" alt=""><i>必</i></span><div><b>${u.name}</b><small>${u.desc}${!ok?` / Lv${req}で習得`:''}</small></div><em>${ok?`MP ${u.cost} 仮`:`LOCK`}</em></button>`;}).join('');bindImages(list);$$('[data-ult-index]',list).forEach(btn=>btn.onclick=()=>{const u=a.ults[Number(btn.dataset.ultIndex)];if(!availableUlts(a).includes(u))return;if(a.mpNow<u.cost)return notice('MPが足りない！','danger');$('#skillMenu').hidden=true;act('ultimate',u);});}}
function openItemMenu(){const list=$('#skillMenuList');$('#skillMenu').hidden=false;$('#skillMenuKicker').textContent='ITEM';$('#skillMenuTitle').textContent='アイテム';list.innerHTML=`<div class="switch-guide">アイテム効果・所持数・復活アイテムの設定がまだ無いため、現在はコマンド枠のみ実装しています。</div>`;}
function escapeAttempt(){notice('「逃げる」の成功率は未設定です','system',850);}

function persistAdventureVitals(){if(!state.battle)return;state.adventure.vitals={};state.battle.allies.forEach(a=>{state.adventure.vitals[a.id]={hp:Math.max(0,a.hp),mp:Math.max(0,a.mpNow)};});saveAdventure();}
function battleEnemySummary(b){
  const seen=new Map();
  for(const e of b?.defeatedEnemies||[]){
    const key=`${e.name}|${e.level}`;seen.set(key,{...e,count:(seen.get(key)?.count||0)+1});
  }
  if(!seen.size)for(const e of b?.enemies||[]){const key=`${e.name}|${e.level}`;seen.set(key,{name:e.name,level:e.level,count:(seen.get(key)?.count||0)+1});}
  return [...seen.values()].map(e=>`${e.name} Lv${e.level}${e.count>1?` ×${e.count}`:''}`).join(' / ');
}
function advanceAdventureAfterWin(){
  const adv=state.adventure,worlds=MOB_DATA.adventureWorlds||[];
  adv.battleReady=false;adv.pendingEncounter=null;
  if((adv.battleIndex||0)<2){adv.battleIndex=(adv.battleIndex||0)+1;return;}
  adv.battleIndex=0;
  if((adv.areaIndex||0)<3){adv.areaIndex=(adv.areaIndex||0)+1;return;}
  adv.areaIndex=0;
  if((adv.worldIndex||0)<worlds.length-1){adv.worldIndex=(adv.worldIndex||0)+1;return;}
  adv.completed=true;
}
function finishScriptedBattle(){const b=state.battle;if(!b||b.finished)return;b.finished=true;b.auto=false;$('#autoBtn').classList.remove('active');$('#autoBtn').textContent='AUTO';$('#battleBackBtn').disabled=false;setCommandDisabled(true);notice('3 TURN EVENT END','system',650);setTimeout(()=>{renderAdventure();showScreen('adventure');const r=scriptedBattleResolve;scriptedBattleResolve=null;if(r)r(true);},320);}
function finishBattle(win){
  const b=state.battle;if(!b||b.finished)return;if(b.mode==='story')return finishScriptedBattle();
  b.finished=true;b.auto=false;$('#autoBtn').classList.remove('active');$('#autoBtn').textContent='AUTO';setCommandDisabled(true);
  notice(win?'VICTORY!':'DEFEAT...','system',1000);
  let bonusCoin=0;
  if(win&&b.mode==='adventure'){
    bonusCoin=(b.defeatedEnemies||[]).reduce((sum,e)=>sum+(Number(e.coinReward)||0),0);
    if(bonusCoin>0){state.coins+=bonusCoin;notice(`RARE BONUS +${bonusCoin.toLocaleString()} COIN`,'heal',1200);}
  }
  if(b.mode==='adventure'&&win){
    persistAdventureVitals();
    if(b.config?.storyPostKey&&!storyDone(b.config.storyPostKey)){
      state.adventure.pendingPostStory={key:b.config.storyPostKey,worldId:b.config.storyWorldId||currentWorld()?.id||'',areaIndex:Number(b.config.storyAreaIndex)||0,bg:b.bg||''};
    }
    advanceAdventureAfterWin();saveAdventure();
  }
  if(b.mode==='adventure'&&!win)restoreCampCheckpoint();
  const summary=battleEnemySummary(b)||'ENEMY';
  $('#resultTitle').textContent=win?'VICTORY':'DEFEAT';
  $('#resultKicker').textContent=b.mode==='adventure'?(b.config?.adventureLabel||`${currentWorld()?.name||'冒険'} BATTLE`):'TRAINING RESULT';
  $('#resultText').textContent=win?`${summary} を撃破！ / ${b.turn}ターン${bonusCoin?` / +${bonusCoin.toLocaleString()} COIN`:''}`:(b.mode==='adventure'?`全員がダウンしました。直前のキャンプ地点のデータへ戻ります。`:`${summary} / ${b.turn}ターン目で全員ダウン`);
  $('#resultRetryBtn').style.display=b.mode==='training'?'block':'none';
  $('#resultSetupBtn').textContent=b.mode==='training'?'トレーニングへ戻る':(b.config?.returnHomeAfterAreaClear?'HOMEへ戻る':'冒険へ戻る');
  setTimeout(()=>{$('#resultOverlay').hidden=false;},650/state.speed);
}

async function startBattleLoaded(config){
  await loadingWithAssets('戦闘用画像を読み込んでいます…',battleCriticalAssets(config));
  beginBattle(config);
  warmBattleActionAssets(config);
}
function trainingBattleBackground(list){
  const first=trainingEnemyTemplate(list?.[0]?.id);if(!first)return{bg:'back/sougen4.png',fallbackBg:'back2/02.png'};
  const w=(MOB_DATA.adventureWorlds||[]).find(x=>x.name===first.stage);
  if(w)return{bg:w.areas?.[3]?.bg||w.areas?.[0]?.bg||'back/sougen4.png',fallbackBg:w.fieldFallback||'back/rpgmain.png'};
  const b=first.bossId?boss(first.bossId):null;return{bg:b?.bg||first.bg||'back/sougen4.png',fallbackBg:b?.fallbackBg||first.fallbackBg||'back/rpgmain.png'};
}
async function startAdventureBattle(){
  if(!state.adventure.battleReady||state.adventure.completed||storyBusy)return;
  const enc=state.adventure.pendingEncounter||createAdventureEncounter(),w=currentWorld(),area=currentArea();
  const areaIndex=state.adventure.areaIndex||0,bossEncounter=(state.adventure.battleIndex||0)===2&&!!enc.bossBattle;
  const specificPre=bossEncounter?`pre:${w.id}:${areaIndex}`:'',legacyPre=(bossEncounter&&areaIndex===3)?`pre:${w.id}`:'';
  const preKey=STORY_EVENTS[specificPre]?specificPre:(STORY_EVENTS[legacyPre]?legacyPre:'');
  if(preKey&&!storyDone(preKey))await runStoryEvent(preKey);
  state.adventure.pendingEncounter=enc;saveAdventure();
  const specificPost=bossEncounter?`post:${w.id}:${areaIndex}`:'',legacyPost=(bossEncounter&&areaIndex===3)?`post:${w.id}`:'';
  const postKey=STORY_EVENTS[specificPost]?specificPost:(STORY_EVENTS[legacyPost]?legacyPost:'');
  const returnHomeAfterAreaClear=!!enc.bossBattle;
  await startBattleLoaded({mode:'adventure',returnScreen:'adventure',waves:enc.waves,party:state.party,useAdventureVitals:true,bg:area.bg,fallbackBg:w.fieldFallback,bossBattle:!!enc.bossBattle,adventureLabel:enc.label,storyPostKey:postKey,storyWorldId:w.id,storyAreaIndex:state.adventure.areaIndex,returnHomeAfterAreaClear});
}
async function resetTrainingBattle(){
  const list=trainingEnemyList().map(x=>({id:x.id,level:x.level}));if(!list.length)return toast('敵を1体以上設定してください');const party=trainingParty();if(!party.length)return toast('味方を1人以上設定してください');
  const bg=trainingBattleBackground(list);
  await startBattleLoaded({mode:'training',returnScreen:'training',enemyConfigs:list,party,...bg});
}

function renderSettings(){
  const t=state.test||loadTestSettings();state.test=t;
  const on=$('#testModeToggle'),fast=$('#testFastToggle'),controls=$('#testModeControls');
  on.textContent=t.enabled?'ON':'OFF';on.classList.toggle('on',!!t.enabled);
  fast.textContent=t.fast5?'ON':'OFF';fast.classList.toggle('on',!!(t.enabled&&t.fast5));
  fast.disabled=!t.enabled;controls.classList.toggle('disabled',!t.enabled);
  $('#testLevelInput').disabled=!t.enabled;$('#applyTestLevelBtn').disabled=!t.enabled;
}
function openSettings(){renderSettings();$('#settingsOverlay').hidden=false;}
function closeSettings(){$('#settingsOverlay').hidden=true;}
async function deleteAllGameData(){
  closeSettings();
  const confirm=await dialog('本当に全データを削除しますか？\nこの操作は取り消せません。冒険イベントも最初から確認できます。',[['削除する','yes','danger'],['キャンセル','no']],'SYSTEM');
  if(confirm!=='yes')return openSettings();
  try{for(let i=localStorage.length-1;i>=0;i--){const key=localStorage.key(i);if(key&&key.startsWith('mobQuest')&&key!=='mobQuestTestSettingsV1')localStorage.removeItem(key);}}catch(_){}
  location.reload();
}
function openHomeAction(action){
  if(action==='home')return toast('ここがHOMEです');
  if(['equipment','items'].includes(action))return toast(`${action==='equipment'?'装備':'持ち物'}は仕様待ちです`);
  if(action==='settings')return openSettings();
  if(action==='castle')return dialog('お城に向かいますか？\nMOB SHOPや宿舎は、まだ詳細仕様待ちです。',[['はい','yes'],['いいえ','no']]).then(v=>{if(v==='yes')toast('お城内部は次の実装対象です');});
  if(action==='tavern')return dialog('酒場に向かいますか？\nパーティー編成が出来ます！',[['はい','yes','primary'],['いいえ','no']]).then(v=>{if(v==='yes')travelTo('tavern','酒場へ向かっています…',renderTavern);});
  if(action==='training')return dialog('トレーニングに向かいますか？\n敵を1～4体、種類・人数・Lvまで自由に設定して戦えます！',[['はい','yes','primary'],['いいえ','no']]).then(v=>{if(v==='yes')travelTo('training','トレーニングルームへ向かっています…',renderTraining);});
  if(action==='adventure'){const w=currentWorld();return dialog(`冒険に向かいますか？\n現在の目的地は「${w?.name||'草原'}」です！`,[['はい','yes','primary'],['いいえ','no']]).then(async v=>{if(v==='yes'){await travelTo('adventure',`${w?.name||'草原'}へ出発です！`,renderAdventure);await handleAdventureEntry();}});}
}
function randomTraining(){
  const arr=[...MOB_DATA.players].sort(()=>Math.random()-.5).slice(0,10);state.training.party=Array.from({length:10},(_,i)=>arr[i]?[arr[i].id,rint(5,95)]:null);
  const catalog=trainingEnemyCatalog(),count=rint(1,4);state.training.enemySlots=[null,null,null,null];
  for(let i=0;i<count;i++){const t=pick(catalog);state.training.enemySlots[i]={id:t.id,level:rint(t.levelMin||1,t.levelMax||t.levelMin||50)};}
  state.training.activeEnemySlot=Math.min(count,3);state.training.filter='ALL';renderTraining();
}

function lockMobileGestures(){document.addEventListener('contextmenu',e=>e.preventDefault());document.addEventListener('dragstart',e=>e.preventDefault());document.addEventListener('selectstart',e=>{if(!['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))e.preventDefault();});['gesturestart','gesturechange','gestureend'].forEach(t=>document.addEventListener(t,e=>e.preventDefault(),{passive:false}));document.addEventListener('touchmove',e=>{if(e.touches?.length>1)e.preventDefault();},{passive:false});let last=0;document.addEventListener('touchend',e=>{const now=Date.now();if(now-last<300)e.preventDefault();last=now;},{passive:false});document.addEventListener('dblclick',e=>e.preventDefault(),{passive:false});}
function bindEvents(){
  const storyScene=$('#storyScene');if(storyScene){storyScene.addEventListener('pointerup',handleStoryTapAdvance,{passive:false});storyScene.addEventListener('contextmenu',e=>e.preventDefault());}
  $$('[data-home-action]').forEach(b=>b.onclick=()=>openHomeAction(b.dataset.homeAction));$$('[data-back-home]').forEach(b=>b.onclick=()=>{goHome();});
  $('#tavernResetBtn').onclick=()=>{state.party=defaultParty.map(x=>[...x]);state.tavernSwapIndex=null;renderTavern();};$('#savePartyBtn').onclick=async()=>{if(state.party.length<1)return;saveParty();state.training.party=state.party.map(x=>[...x]);toast('パーティーを保存しました');await goHome();};
  $('#trainingBackBtn').onclick=()=>{goHome();};$('#trainingRandomBtn').onclick=randomTraining;$('#allLevelBtn').onclick=()=>{ensureTrainingParty();state.training.party=state.training.party.map(x=>x?[x[0],50]:null);renderTraining();};$('#trainingEnemyAddBtn').onclick=()=>{ensureTrainingEnemies();const i=state.training.enemySlots.findIndex(x=>!x);if(i<0)return toast('敵は最大4体です');state.training.activeEnemySlot=i;renderTraining();};$('#trainingEnemyClearBtn').onclick=()=>{state.training.enemySlots=[null,null,null,null];state.training.activeEnemySlot=0;renderTraining();};$('#startTrainingBattleBtn').onclick=resetTrainingBattle;
  $('#adventureBackBtn').onclick=()=>{goHome();};$('#exploreBtn').onclick=exploreField;$('#campBtn').onclick=saveCampCheckpoint;$('#fieldBattleBtn').onclick=startAdventureBattle;
  $('#battleBackBtn').onclick=()=>{if(!state.battle)return;state.battle.auto=false;if(state.battle.mode==='adventure'){renderAdventure();showScreen('adventure');}else{renderTraining();showScreen('training');}};
  $('#attackBtn').onclick=()=>act('attack');$('#skillBtn').onclick=()=>openSkillMenu('magic');$('#ultimateBtn').onclick=()=>openSkillMenu('ultimate');$('#defendBtn').onclick=()=>act('defend');$('#itemBtn').onclick=openItemMenu;$('#escapeBtn').onclick=escapeAttempt;$('#switchBtn').onclick=openSwitchMenu;$$('[data-close-sheet]').forEach(b=>b.onclick=()=>{$('#skillMenu').hidden=true;});
  $('#autoBtn').onclick=()=>{const b=state.battle;if(!b||b.finished)return;b.auto=!b.auto;$('#autoBtn').classList.toggle('active',b.auto);$('#autoBtn').textContent=b.auto?'AUTO ON':'AUTO';if(b.auto&&!b.busy&&activeAlly())autoAct();};$('#speedBtn').onclick=()=>{const speeds=state.test?.enabled?[1,1.5,2,5]:[1,1.5,2];let i=speeds.indexOf(state.speed);if(i<0)i=0;state.speed=speeds[(i+1)%speeds.length];$('#speedBtn').textContent=`×${state.speed}`;};
  $('#resultRetryBtn').onclick=resetTrainingBattle;$('#resultSetupBtn').onclick=async()=>{if(!state.battle)return;const b=state.battle;$('#resultOverlay').hidden=true;if(b.mode==='adventure'){renderAdventure();showScreen('adventure');if(state.adventure.pendingPostStory)await runPendingPostStory(!!b.config?.returnHomeAfterAreaClear,!!b.config?.returnHomeAfterAreaClear);if(b.config?.returnHomeAfterAreaClear){await goHome();return;}renderAdventure();showScreen('adventure');}else{renderTraining();showScreen('training');}};$('#resultHomeBtn').onclick=async()=>{const b=state.battle;$('#resultOverlay').hidden=true;if(b?.mode==='adventure'&&state.adventure.pendingPostStory){renderAdventure();showScreen('adventure');await runPendingPostStory(true,true);}await goHome();};
  $('#settingsCloseBtn').onclick=closeSettings;
  $('#testModeToggle').onclick=()=>{state.test.enabled=!state.test.enabled;if(!state.test.enabled){state.test.fast5=false;if(state.speed===5)state.speed=1;}saveTestSettings();renderSettings();toast(state.test.enabled?'テストモード ON':'テストモード OFF');};
  $('#testFastToggle').onclick=()=>{if(!state.test.enabled)return;state.test.fast5=!state.test.fast5;saveTestSettings();renderSettings();toast(state.test.fast5?'戦闘速度 ×5 をON':'戦闘速度 ×5 をOFF');};
  $('#applyTestLevelBtn').onclick=()=>{if(!state.test.enabled)return;const lv=clamp(Number($('#testLevelInput').value)||5,1,120);state.party=state.party.map(([id])=>[id,lv]);state.adventure.vitals=null;saveParty();saveAdventure();state.training.party=state.party.map(x=>[...x]);renderSettings();toast(`現在のパーティーをLv${lv}に設定しました / HP・MP全回復`);};
  $('#deleteDataBtn').onclick=deleteAllGameData;
}

window.addEventListener('resize',()=>{if(screens.home.classList.contains('active'))applyHomeCommonScale();if(screens.adventure.classList.contains('active'))applyAdventurePartyScale();});
lockMobileGestures();initCommonNav();bindImages();bindEvents();
/* Boot must always escape the loader, even if a malformed/missing asset throws unexpectedly. */
(async()=>{
  try{await goHome();}
  catch(err){
    console.error('[MOB QUEST] HOME boot recovery',err);
    try{await renderHome();}catch(_){}
    showScreen('home');
  }
})();
preloadAssets(['icon/01.png','back/rpgmain.png','icon/02.png','icon/03.png','icon/04.png','icon/05.png','icon/06.png','icon/07.png','icon/08.png']).catch(()=>{});
setTimeout(startFastBackgroundWarmup,1400);
})();
