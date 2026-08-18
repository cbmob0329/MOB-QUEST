(() => {
'use strict';

const $=(s,p=document)=>p.querySelector(s);
const $$=(s,p=document)=>[...p.querySelectorAll(s)];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const rint=(a,b)=>Math.floor(a+Math.random()*(b-a+1));
const pct=(n,max)=>max?clamp(n/max*100,0,100):0;
const clone=v=>JSON.parse(JSON.stringify(v));
const GAME_ASSET_VERSION=41;
function versionedPlay(src){if(!src)return'';return /^play\//.test(src)?`${src}${src.includes('?')?'&':'?'}mqv=${GAME_ASSET_VERSION}`:src;}
function loadTestSettings(){try{const v=JSON.parse(localStorage.getItem('mobQuestTestSettingsV1'));if(v&&typeof v==='object')return{enabled:!!v.enabled,fast5:!!v.fast5};}catch(_){}return{enabled:false,fast5:false};}
function saveTestSettings(){try{localStorage.setItem('mobQuestTestSettingsV1',JSON.stringify(state.test));}catch(_){}}

const GAME_ITEMS=[
  {id:'01',name:'ライフゼリー',image:'item/01.png',price:500,weight:70,type:'hp',min:30,max:60},
  {id:'02',name:'スーパーライフゼリー',image:'item/02.png',price:2000,weight:30,type:'hp',min:75,max:120},
  {id:'03',name:'ハイパーライフゼリー',image:'item/03.png',price:5000,weight:10,type:'hp',min:200,max:300},
  {id:'04',name:'ウルトラライフゼリー',image:'item/04.png',price:10000,weight:3,type:'hp',min:500,max:600},
  {id:'05',name:'マジックラムネ',image:'item/05.png',price:1000,weight:60,type:'mp',min:20,max:40},
  {id:'06',name:'スーパーマジックラムネ',image:'item/06.png',price:3000,weight:25,type:'mp',min:60,max:100},
  {id:'07',name:'ハイパーマジックラムネ',image:'item/07.png',price:8000,weight:8,type:'mp',min:120,max:180},
  {id:'08',name:'ウルトラマジックラムネ',image:'item/08.png',price:15000,weight:2,type:'mp',min:200,max:250},
  {id:'09',name:'解毒カプセル',image:'item/09.png',price:3000,weight:30,type:'cure',status:'poison'},
  {id:'10',name:'やけどケアカプセル',image:'item/10.png',price:3000,weight:30,type:'cure',status:'burn'},
  {id:'11',name:'アンチマヒカプセル',image:'item/11.png',price:3000,weight:30,type:'cure',status:'paralyze'},
  {id:'12',name:'万能カプセル',image:'item/12.png',price:50000,weight:4,type:'cureAll'},
  {id:'13',name:'グロウアップカプセル',image:'item/13.png',price:20000,weight:5,type:'hpmp',amount:200},
  {id:'14',name:'キングカプセル',image:'item/14.png',price:100000,weight:2,type:'full'},
  {id:'15',name:'激辛カプセル',image:'item/15.png',price:10000,weight:5,type:'battleBuff',stat:'ATK',ratio:.20},
  {id:'16',name:'激冷えカプセル',image:'item/16.png',price:10000,weight:5,type:'battleBuff',stat:'DEF',ratio:.20},
  {id:'17',name:'チルパウダー',image:'item/17.png',price:15000,weight:4,type:'partyHp',amount:150},
  {id:'18',name:'リスポーンビスケット',image:'item/18.png',price:20000,weight:2,type:'revive',ratio:.50},
  {id:'36',name:'経験値レコード',image:'item/36.png',price:0,weight:0,type:'record',recordType:'exp'},
  {id:'37',name:'ゴールドレコード',image:'item/37.png',price:0,weight:0,type:'record',recordType:'gold'},
  {id:'38',name:'ボスレコード',image:'item/38.png',price:0,weight:0,type:'record',recordType:'boss'}
];
const DRINK_SETS=[
  {id:'19',name:'モブトマトジュースセット',image:'item/19.png',price:5000,heal:.30,cure:'poison',desc:'HP・MP30%回復＋毒解除'},
  {id:'20',name:'モブオレンジジュースセット',image:'item/20.png',price:5000,heal:.30,cure:'paralyze',desc:'HP・MP30%回復＋マヒ解除'},
  {id:'21',name:'モブサイダーセット',image:'item/21.png',price:5000,heal:.30,cure:'burn',desc:'HP・MP30%回復＋やけど解除'},
  {id:'22',name:'モブファイヤーオレンジジュースセット',image:'item/22.png',price:9000,heal:.30,buff:{atk:.20},desc:'HP・MP30%回復＋1AREA ATK20%UP'},
  {id:'23',name:'モブウォーターレモンジュースセット',image:'item/23.png',price:9000,heal:.30,buff:{def:.20},desc:'HP・MP30%回復＋1AREA DEF20%UP'},
  {id:'24',name:'モブサンダーシュガージュースセット',image:'item/24.png',price:9000,heal:.30,buff:{spd:.20},desc:'HP・MP30%回復＋1AREA SPD20%UP'},
  {id:'25',name:'モブロックカフェオレセット',image:'item/25.png',price:9000,heal:.30,buff:{mag:.20},desc:'HP・MP30%回復＋1AREA MAG20%UP'},
  {id:'26',name:'モブダークベリージュースセット',image:'item/26.png',price:15000,heal:.30,buff:{all:.10},desc:'HP・MP30%回復＋1AREA 全能力10%UP'},
  {id:'27',name:'モブヒーローミルクセーキセット',image:'item/27.png',price:12000,buff:{gold:.50},desc:'1AREA 獲得ゴールド50%UP'},
  {id:'29',name:'モブネオンコットンジュースセット',image:'item/29.png',price:12000,fullHp:true,desc:'HP全回復（追加効果は未確定）'},
  {id:'30',name:'モブメタルアルコールセット',image:'item/30.png',price:50000,buff:{exp:1.00},desc:'1AREA 獲得経験値100%UP'},
  {id:'31',name:'モブローズジュースセット',image:'item/31.png',price:15000,heal:.30,cureAll:true,desc:'HP・MP30%回復＋状態異常全解除'},
  {id:'32',name:'モブグレープジュースセット',image:'item/32.png',price:5000,heal:.40,desc:'HP・MP40%回復'},
  {id:'33',name:'モブメロンソーダセット',image:'item/33.png',price:5000,hpHeal:.60,desc:'HP60%回復'},
  {id:'34',name:'モブアップルジュースセット',image:'item/34.png',price:5000,mpHeal:.60,desc:'MP60%回復'},
  {id:'35',name:'モブメタルジュースセット',image:'item/35.png',price:25000,buff:{exp:.50},desc:'1AREA 獲得経験値50%UP'}
];
function defaultMeta(){return{coins:12500,exp:{},inventory:{},drinkSets:{},defeatedBosses:[],defeatedElites:[]};}
function loadMeta(){try{const v=JSON.parse(localStorage.getItem('mobQuestMetaV1'));if(v&&typeof v==='object')return{...defaultMeta(),...v,exp:{...(v.exp||{})},inventory:{...(v.inventory||{})},drinkSets:{...(v.drinkSets||{})},defeatedBosses:[...(v.defeatedBosses||[])],defeatedElites:[...(v.defeatedElites||[])]};}catch(_){}return defaultMeta();}
function saveMeta(){if(!state?.meta)return;state.meta.coins=state.coins;try{localStorage.setItem('mobQuestMetaV1',JSON.stringify(state.meta));}catch(_){}}
function itemData(id){return GAME_ITEMS.find(x=>x.id===String(id).padStart(2,'0'));}
function itemCount(id){return Math.max(0,Number(state.meta?.inventory?.[id])||0);}
function addItem(id,n=1){if(!state.meta.inventory)state.meta.inventory={};state.meta.inventory[id]=itemCount(id)+n;saveMeta();}
function consumeItem(id,n=1){if(itemCount(id)<n)return false;state.meta.inventory[id]=itemCount(id)-n;saveMeta();return true;}
function tentCount(){return Math.max(0,Number(state.meta?.inventory?.['mob-tent'])||0);}

const screens={home:$('#homeScreen'),loading:$('#loadingScreen'),tavern:$('#tavernScreen'),training:$('#trainingScreen'),quest:$('#questScreen'),adventure:$('#adventureScreen'),battle:$('#battleScreen')};
const defaultParty=[['yusha',5],['pink',5]];
const initialMeta=loadMeta();
const initialCoins=Number(initialMeta.coins);
const state={
  party:loadParty(), coins:Number.isFinite(initialCoins)?initialCoins:12500, meta:initialMeta,
  training:{party:null,enemySlots:[{id:'boss-hawk',level:10},null,null,null],activeEnemySlot:0,filter:'草原',mode:'test'},
  quest:null,
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
const SPECIAL_ENEMIES=[
  {id:'sp-metal',name:'モブメタルスライム',stage:'経験値',category:'normal',attribute:'無',image:'spenemy/001.png',symbol:'経',levelMin:2,levelMax:52,escapeRate:.30,rewardExpScale:3.2,rewardCoinScale:.25,mods:{hp:.72,def:1.6,res:1.6,spd:1.35}},
  {id:'sp-metal-coin',name:'モブメタルコインスライム',stage:'経験値',category:'normal',attribute:'無',image:'spenemy/002.png',symbol:'経',levelMin:12,levelMax:52,escapeRate:.40,rewardExpScale:5.0,rewardCoinScale:.35,mods:{hp:.80,def:1.75,res:1.75,spd:1.42}},
  {id:'sp-metal-king',name:'モブキングメタルスライム',stage:'経験値',category:'elite',attribute:'無',image:'spenemy/003.png',symbol:'王',levelMin:26,levelMax:52,escapeRate:.20,rewardExpScale:8.0,rewardCoinScale:.50,mods:{hp:.68,def:1.8,res:1.8,spd:1.35}},
  {id:'sp-gold',name:'モブゴールドスライム',stage:'ゴールド',category:'normal',attribute:'光',image:'spenemy/004.png',symbol:'G',levelMin:2,levelMax:52,rewardExpScale:.35,rewardCoinScale:4.0,mods:{hp:.78,def:1.45,res:1.45,spd:1.25}},
  {id:'sp-gold-coin',name:'モブゴールドコインスライム',stage:'ゴールド',category:'normal',attribute:'光',image:'spenemy/005.png',symbol:'G',levelMin:12,levelMax:52,rewardExpScale:.45,rewardCoinScale:7.0,mods:{hp:.84,def:1.55,res:1.55,spd:1.30}},
  {id:'sp-gold-king',name:'モブキングゴールドスライム',stage:'ゴールド',category:'elite',attribute:'光',image:'spenemy/006.png',symbol:'王',levelMin:26,levelMax:52,rewardExpScale:.60,rewardCoinScale:11.0,mods:{hp:.72,def:1.7,res:1.7,spd:1.28}}
];
function specialEnemyTemplate(id){return SPECIAL_ENEMIES.find(x=>x.id===id)||null;}
function trainingEnemyTemplate(id){return enemyTemplate(id)||specialEnemyTemplate(id)||trainingEnemyCatalog().find(x=>x.id===id)||null;}
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
function defaultAdventure(){return {worldIndex:0,areaIndex:0,battleIndex:0,battleReady:false,completed:false,pendingEncounter:null,vitals:null,checkpoint:null,storyFlags:{},pendingPostStory:null,campUsed:{},areaBuff:null};}
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
function worldCleared(id){const worlds=MOB_DATA.adventureWorlds||[],idx=worlds.findIndex(w=>w.id===id);if(idx<0)return false;return !!state.adventure.completed||(Number(state.adventure.worldIndex)||0)>idx;}
function syncDefeatedHistoryFromProgress(){for(const w of MOB_DATA.adventureWorlds||[]){if(!worldCleared(w.id))continue;for(const a of w.areas||[])for(const r of [...(a.boss||[]),...(a.nextWave||[])]){const t=trainingEnemyTemplate(r.id);if(!t)continue;if(t.category==='boss'&&!state.meta.defeatedBosses.includes(t.id))state.meta.defeatedBosses.push(t.id);if(t.category==='elite'&&!state.meta.defeatedElites.includes(t.id))state.meta.defeatedElites.push(t.id);}}saveMeta();}
function unlockedDrinkIds(){
  const ids=new Set(['19','20','21','32','33','34','22']);
  if(worldCleared('grassland'))ids.add('23');
  if(worldCleared('rural'))ids.add('24');
  if(worldCleared('neon'))ids.add('25');
  if(worldCleared('sea'))ids.add('27');
  if(worldCleared('tribe'))ids.add('29');
  if(worldCleared('desert2'))DRINK_SETS.forEach(d=>ids.add(d.id));
  return ids;
}
function drinkCount(id){return Math.max(0,Number(state.meta.drinkSets?.[id])||0);}
function addDrink(id,n=1){if(!state.meta.drinkSets)state.meta.drinkSets={};state.meta.drinkSets[id]=drinkCount(id)+n;saveMeta();}
function consumeDrink(id,n=1){if(drinkCount(id)<n)return false;state.meta.drinkSets[id]=drinkCount(id)-n;saveMeta();return true;}
function renderTavernDrinkShop(){
  const root=$('#tavernDrinkShop');if(!root)return;const unlocked=unlockedDrinkIds();$('#drinkShopCoin').textContent=`${state.coins.toLocaleString()} G`;
  root.innerHTML=DRINK_SETS.filter(d=>unlocked.has(d.id)).map(d=>`<button class="drink-shop-item ${drinkCount(d.id)>0?'owned':''}" data-buy-drink="${d.id}" type="button"><img src="${d.image}" alt="${d.name}"><div><b>${d.name}</b><small>${d.desc}</small><em>${d.price.toLocaleString()}G / 所持 ${drinkCount(d.id)}</em></div></button>`).join('');
  bindImages(root);$$('[data-buy-drink]',root).forEach(b=>b.onclick=async()=>{const d=DRINK_SETS.find(x=>x.id===b.dataset.buyDrink);if(!d)return;if(state.coins<d.price)return toast('ゴールドが足りません');const ans=await dialog(`${d.name}を購入しますか？\n${d.price.toLocaleString()}G`,[['はい','yes','primary'],['いいえ','no']],'DRINK SHOP');if(ans!=='yes')return;state.coins-=d.price;state.meta.coins=state.coins;addDrink(d.id,1);saveMeta();renderTavernDrinkShop();});
}
function renderTavern(){
  const levels=new Map(state.party.map(([id,lv])=>[id,lv]));
  const m=Math.min(4,state.party.length),s=Math.max(0,Math.min(2,state.party.length-4)),r=Math.max(0,state.party.length-6);
  $('#tavernPartyCount').textContent=`MAIN ${m}/4・SUPER ${s}/2・控え ${r}/4`;
  $('#tavernSlots').innerHTML=Array.from({length:10},(_,i)=>{const slot=state.party[i],z=zoneForIndex(i);const prefix=`<div class="formation-zone-label ${i===0?'first':''} ${i===4?'super-start':''} ${i===6?'reserve-start':''}"><b>${z.key}</b><span>${z.label} ${z.n}</span></div>`;if(!slot)return`${prefix}<div class="tavern-slot empty ${z.cls}"><b>EMPTY</b><small>${z.label}を選択</small></div>`;const p=player(slot[0]);const selected=state.tavernSwapIndex===i;return`${prefix}<div class="tavern-slot ${z.cls} ${selected?'swap-selected':''}"><span><img src="${versionedPlay(p.image)}" alt="${p.name}" loading="lazy" decoding="async"><i>${p.symbol}</i></span><div><b>${p.name}</b><small>${p.attribute} / ${p.role}</small></div><label>Lv<input class="tavern-level" data-id="${p.id}" type="number" min="1" max="${playerLevelCap()}" inputmode="numeric" value="${slot[1]}"></label><div class="slot-actions"><button data-swap-slot="${i}" type="button">↕</button><button data-remove-member="${p.id}" type="button">×</button></div></div>`;}).join('');
  $('#rosterGrid').innerHTML=MOB_DATA.players.map(p=>rosterCard(p,state.party.some(x=>x[0]===p.id),levels.get(p.id)||5)).join('');renderTavernDrinkShop();bindImages($('#tavernScreen'));
  $$('.tavern-level').forEach(i=>i.onchange=()=>{const x=state.party.find(v=>v[0]===i.dataset.id);if(x)x[1]=clamp(Number(i.value)||1,1,playerLevelCap());});
  $$('[data-remove-member]').forEach(b=>b.onclick=()=>{if(state.party.length<=1)return toast('最低1人は必要です');state.party=state.party.filter(x=>x[0]!==b.dataset.removeMember);state.tavernSwapIndex=null;renderTavern();});
  $$('[data-swap-slot]').forEach(b=>b.onclick=()=>{const idx=Number(b.dataset.swapSlot);if(state.tavernSwapIndex===null){state.tavernSwapIndex=idx;toast('入れ替えるもう1人を選んでください');return renderTavern();}if(state.tavernSwapIndex===idx){state.tavernSwapIndex=null;return renderTavern();}const a=state.tavernSwapIndex;if(state.party[a]&&state.party[idx])[state.party[a],state.party[idx]]=[state.party[idx],state.party[a]];state.tavernSwapIndex=null;renderTavern();});
  $$('[data-roster-id]').forEach(b=>b.onclick=()=>{const id=b.dataset.rosterId;const idx=state.party.findIndex(x=>x[0]===id);if(idx>=0){if(state.party.length<=1)return toast('最低1人は必要です');state.party.splice(idx,1);}else{if(state.party.length>=10)return toast('MAIN4＋SUPER2＋控え4で最大10人です');state.party.push([id,5]);}state.tavernSwapIndex=null;renderTavern();});
}

const TRAINING_MODES=[
  {id:'test',name:'テスト戦闘',icon:'mqicon/04.png',desc:'自由設定'},
  {id:'journal',name:'冒険日記',icon:'icon/14.png',desc:'クリア済みエリアを再体験'},
  {id:'exp',name:'経験値ターンテーブル',icon:'icon/15.png',desc:'経験値レコードを使用'},
  {id:'gold',name:'ゴールドターンテーブル',icon:'icon/16.png',desc:'ゴールドレコードを使用'},
  {id:'boss',name:'ボスターンテーブル',icon:'icon/17.png',desc:'撃破済みボスへ挑戦'}
];
const TURNTABLE_DIFFICULTIES={
  normal:{id:'normal',name:'ノーマル',cost:1,recommended:5},
  hard:{id:'hard',name:'ハード',cost:3,recommended:15},
  veryhard:{id:'veryhard',name:'ベリーハード',cost:5,recommended:30},
  inferno:{id:'inferno',name:'インフェルノ',cost:10,recommended:50}
};
const BOSS_DIFFICULTIES={
  normal:{id:'normal',name:'ノーマル',cost:1,recommended:25,itemRate:.10},
  hard:{id:'hard',name:'ハード',cost:1,recommended:40,itemRate:.25},
  veryhard:{id:'veryhard',name:'ベリーハード',cost:1,recommended:65,itemRate:.40},
  inferno:{id:'inferno',name:'インフェルノ',cost:1,recommended:90,itemRate:.60}
};
function setTrainingMode(mode){if(!TRAINING_MODES.some(x=>x.id===mode))mode='test';state.training.mode=mode;renderTraining();requestAnimationFrame(()=>{$(`[data-training-mode="${mode}"]`)?.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});});}
function renderTrainingModeCarousel(){const root=$('#trainingModeCarousel');if(!root)return;const mode=state.training.mode||'test';root.innerHTML=TRAINING_MODES.map(m=>`<button class="training-mode-card ${m.id===mode?'active':''}" data-training-mode="${m.id}" type="button"><img src="${m.icon}" alt="${m.name}"><b>${m.name}</b><small>${m.desc}</small></button>`).join('');bindImages(root);const cards=$$('[data-training-mode]',root);cards.forEach(b=>b.onclick=()=>setTrainingMode(b.dataset.trainingMode));let raf=0;root.onscroll=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{const rr=root.getBoundingClientRect(),cx=rr.left+rr.width/2;let best=null,dist=1e9;for(const c of cards){const r=c.getBoundingClientRect(),d=Math.abs(r.left+r.width/2-cx);if(d<dist){dist=d;best=c;}}cards.forEach(c=>c.classList.toggle('active',c===best));});};}
function clearedJournalWorlds(){const worlds=MOB_DATA.adventureWorlds||[];return worlds.filter((w,i)=>state.adventure.completed||(Number(state.adventure.worldIndex)||0)>i);}
function recordCountForMode(mode){return itemCount(mode==='exp'?'36':mode==='gold'?'37':'38');}
function renderTrainingFeature(mode){
  const root=$('#trainingFeaturePanel');root.hidden=false;const testFree=!!state.test?.enabled;if(mode==='boss')syncDefeatedHistoryFromProgress();
  if(mode==='journal'){
    const worlds=clearedJournalWorlds();root.innerHTML=`<section class="panel"><div class="section-title"><div><small>ADVENTURE JOURNAL</small><h2>クリア済みストーリーを再体験</h2></div><span class="pill">イベントなし</span></div><p class="panel-note">探索とバトルで経験値・コインを獲得できます。中ボスは出現しますがAREA4のボスは出現せず、エリアモンスター4体が出現します。</p><div class="training-feature-grid">${worlds.length?worlds.map((w,i)=>`<article class="training-feature-card"><div class="feature-head"><img src="icon/14.png" alt=""><div><h3>${w.name}</h3><p>4 AREA / 探索あり / セリフ・イベントなし</p></div></div><button data-start-journal="${(MOB_DATA.adventureWorlds||[]).indexOf(w)}" type="button">冒険日記を開始</button></article>`).join(''):'<div class="camp-empty-note">まだクリア済みのエリアがありません。</div>'}</div></section>`;$$('[data-start-journal]',root).forEach(b=>b.onclick=()=>startTrainingQuest('journal',{worldIndex:Number(b.dataset.startJournal)}));bindImages(root);return;
  }
  const isBoss=mode==='boss',recordId=mode==='exp'?'36':mode==='gold'?'37':'38',recordName=itemData(recordId)?.name||'レコード',defs=isBoss?BOSS_DIFFICULTIES:TURNTABLE_DIFFICULTIES,count=itemCount(recordId);
  const discovered=(state.meta.defeatedBosses||[]).length+(state.meta.defeatedElites||[]).length;
  root.innerHTML=`<section class="panel"><div class="section-title"><div><small>${mode.toUpperCase()} TURNTABLE</small><h2>${TRAINING_MODES.find(x=>x.id===mode)?.name||''}</h2></div><span class="pill">${recordName} ×${count}</span></div><div class="record-count-line"><span>経験値 ×${itemCount('36')}</span><span>ゴールド ×${itemCount('37')}</span><span>ボス ×${itemCount('38')}</span>${testFree?'<span>TEST MODE：消費なし</span>':''}</div><div class="training-feature-grid">${Object.values(defs).map(d=>{const can=(testFree||count>=d.cost)&&(!isBoss||discovered>0);return`<article class="training-feature-card ${can?'':'locked'}"><div class="feature-head"><img src="${mode==='exp'?'icon/15.png':mode==='gold'?'icon/16.png':'icon/17.png'}" alt=""><div><h3>${d.name}</h3><p>推奨 Lv${d.recommended}${isBoss?` / 限定アイテム率 ${Math.round(d.itemRate*100)}%`:''}</p></div></div><div class="feature-meta"><span>${recordName} ${d.cost}枚</span><span>4 AREA</span><span>1 AREA 1戦</span></div><button data-start-turntable="${mode}" data-difficulty="${d.id}" type="button" ${can?'':'disabled'}>${isBoss&&discovered===0?'撃破済みボスがいません':can?'出発する':'レコード不足'}</button></article>`;}).join('')}</div></section>`;
  $$('[data-start-turntable]',root).forEach(b=>b.onclick=()=>startTrainingQuest(b.dataset.startTurntable,{difficulty:b.dataset.difficulty}));bindImages(root);
}
function questRecordId(type){return type==='exp'?'36':type==='gold'?'37':type==='boss'?'38':'';}
function consumeQuestRecord(type,cost){if(state.test?.enabled)return true;const id=questRecordId(type);return id?consumeItem(id,cost):true;}
function freshQuestVitals(){const out={};for(const [id,lv] of state.party){const q=player(id),st=baseStats(q,lv);out[id]={hp:st.maxHp,mp:st.maxMp,dead:false,status:{poison:0,burn:0,sleep:0,stun:0,paralyze:0}};}return out;}
async function startTrainingQuest(type,opt={}){
  if(type==='journal'){
    const wi=clamp(Number(opt.worldIndex)||0,0,(MOB_DATA.adventureWorlds?.length||1)-1),w=MOB_DATA.adventureWorlds?.[wi];if(!w||!clearedJournalWorlds().includes(w))return toast('まだ選択できません');state.quest={type:'journal',worldIndex:wi,areaIndex:0,battleIndex:0,battleReady:false,explored:false,campUsed:false,vitals:freshQuestVitals(),finished:false};
  }else{
    const defs=type==='boss'?BOSS_DIFFICULTIES:TURNTABLE_DIFFICULTIES,d=defs[opt.difficulty]||defs.normal;if(!consumeQuestRecord(type,d.cost))return toast('レコードが足りません');state.quest={type,difficulty:d.id,areaIndex:0,battleIndex:0,battleReady:true,explored:true,campUsed:false,vitals:freshQuestVitals(),finished:false,itemRate:d.itemRate||0};
  }
  renderQuestScreen();showScreen('quest');
}
function questWorld(){return state.quest?.type==='journal'?MOB_DATA.adventureWorlds?.[state.quest.worldIndex]:null;}
function questBackground(){const q=state.quest;if(!q)return{bg:'back/metal.png',fallback:'back2/002.png'};if(q.type==='journal'){const w=questWorld(),a=w?.areas?.[q.areaIndex];return{bg:a?.bg||w?.fieldFallback||'back/sougen.png',fallback:w?.fieldFallback||'back2/002.png'};}if(q.type==='exp')return{bg:q.areaIndex===3?'back/metal2.png':'back/metal.png',fallback:'back2/002.png'};if(q.type==='gold')return{bg:q.areaIndex===3?'back/gold2.png':'back/gold.png',fallback:'back2/002.png'};return{bg:q.areaIndex===3?'back/boss2.png':'back/boss.png',fallback:'back2/002.png'};}
function questTitleText(){const q=state.quest;if(!q)return'';if(q.type==='journal')return`${questWorld()?.name||''}・冒険日記`;return TRAINING_MODES.find(x=>x.id===q.type)?.name||'トレーニング';}
function renderQuestScreen(){const q=state.quest;if(!q)return renderTraining();const bg=questBackground();setImage($('#questBg'),bg.bg,bg.fallback);$('#questTitle').textContent=questTitleText();$('#questKicker').textContent=q.type==='journal'?'ADVENTURE JOURNAL':'TRAINING QUEST';$('#questAreaPill').textContent=`AREA ${q.areaIndex+1} / 4`;$('#questAreaName').textContent=`AREA ${q.areaIndex+1}`;$('#questModeLabel').textContent=q.type==='journal'?(questWorld()?.name||'JOURNAL'):(q.difficulty||'').toUpperCase();$('#questDescription').textContent=q.type==='journal'?`戦闘 ${q.battleIndex+1}/3。イベント・セリフは発生しません。`:'探索なし。キャンプとバトルのみ。勝利すると次のAREAへ進みます。';const explore=$('#questExploreBtn');explore.style.display=q.type==='journal'?'flex':'none';explore.disabled=q.type==='journal'&&(q.battleReady||q.finished);$('#questBattleBtn').disabled=q.finished||(q.type==='journal'&&!q.battleReady);$('#questBattleHint').textContent=q.finished?'CLEAR':q.type==='journal'?(q.battleReady?'戦闘可能':'探索が必要'):'戦闘可能';$('#questCampBtn').disabled=q.campUsed||q.finished;$('#questCampBtn small').textContent=q.campUsed?'このAREAは休憩済み':'1 AREA 1回';$('#questExploreResult').hidden=true;bindImages($('#questScreen'));}
function questNormalConfigs(world,count){const used=[],out=[];for(let i=0;i<count;i++){let t=weightedNormalTemplate(world,used);if(!t)t=weightedNormalTemplate(world,[]);if(!t)break;used.push(t.id);out.push({id:t.id,level:rint(t.levelMin||1,t.levelMax||t.levelMin||1)});}return out;}
function journalEncounter(){const q=state.quest,w=questWorld(),a=w?.areas?.[q.areaIndex];if(!w||!a)return[];if(q.battleIndex<2)return questNormalConfigs(w,weightedEnemyCount(q.areaIndex));if(q.areaIndex===3)return questNormalConfigs(w,4);return expandEncounterEntries(a.boss||[]).filter(x=>trainingEnemyTemplate(x.id)?.category!=='boss');}
function turntableRange(diff){return diff==='normal'?[2,6]:diff==='hard'?[12,16]:diff==='veryhard'?[23,32]:[43,52];}
function makeTurntableConfigs(type,diff,area){
  const [lo,hi]=turntableRange(diff),is4=area===3,randLv=()=>rint(lo,hi);
  if(type==='exp'){
    if(is4){if(diff==='normal')return Array.from({length:3},()=>({id:'sp-metal',level:randLv(),noEscape:true}));if(diff==='hard')return[{id:'sp-metal',level:randLv(),noEscape:true},{id:'sp-metal-coin',level:randLv(),noEscape:true},{id:'sp-metal',level:randLv(),noEscape:true}];if(diff==='veryhard')return[{id:'sp-metal-coin',level:rint(22,32),noEscape:true},{id:'sp-metal',level:rint(30,32),noEscape:true},{id:'sp-metal-coin',level:rint(22,32),noEscape:true}];return[{id:'sp-metal-coin',level:rint(42,52),noEscape:true},{id:'sp-metal-king',level:rint(50,52),noEscape:true},{id:'sp-metal-coin',level:rint(42,52),noEscape:true}];}
    const count=rint(1,diff==='inferno'?4:3),arr=Array.from({length:count},()=>({id:'sp-metal',level:randLv()}));if(diff==='hard'&&Math.random()<.15)arr[rint(0,count-1)]={id:'sp-metal-coin',level:rint(12,16)};if(diff==='veryhard'){if(Math.random()<.18)arr[rint(0,count-1)]={id:'sp-metal-coin',level:rint(22,32)};if(Math.random()<.07)arr[rint(0,count-1)]={id:'sp-metal-king',level:rint(26,32)};}if(diff==='inferno'){if(Math.random()<.50)arr[rint(0,count-1)]={id:'sp-metal-coin',level:rint(42,52)};if(Math.random()<.20)arr[rint(0,count-1)]={id:'sp-metal-king',level:rint(46,52)};}return arr;
  }
  if(type==='gold'){
    const rateFor=id=>diff==='veryhard'||diff==='inferno'?(id==='sp-gold'?.30:id==='sp-gold-coin'?.40:id==='sp-gold-king'?.20:0):0;const withRate=x=>({...x,escapeRate:rateFor(x.id)});
    if(is4){if(diff==='normal')return Array.from({length:3},()=>withRate({id:'sp-gold',level:randLv()}));if(diff==='hard')return[{id:'sp-gold',level:randLv()},{id:'sp-gold-coin',level:randLv()},{id:'sp-gold',level:randLv()}].map(withRate);if(diff==='veryhard')return[{id:'sp-gold-coin',level:rint(22,32)},{id:'sp-gold',level:rint(30,32)},{id:'sp-gold-coin',level:rint(22,32)}].map(withRate);return[{id:'sp-gold-coin',level:rint(42,52)},{id:'sp-gold-king',level:rint(50,52)},{id:'sp-gold-coin',level:rint(42,52)}].map(withRate);}
    const count=rint(1,diff==='inferno'?4:3),arr=Array.from({length:count},()=>({id:'sp-gold',level:randLv()}));if(diff==='hard'&&Math.random()<.15)arr[rint(0,count-1)]={id:'sp-gold-coin',level:rint(12,16)};if(diff==='veryhard'){if(Math.random()<.18)arr[rint(0,count-1)]={id:'sp-gold-coin',level:rint(22,32)};if(Math.random()<.07)arr[rint(0,count-1)]={id:'sp-gold-king',level:rint(26,32)};}if(diff==='inferno'){if(Math.random()<.50)arr[rint(0,count-1)]={id:'sp-gold-coin',level:rint(42,52)};if(Math.random()<.20)arr[rint(0,count-1)]={id:'sp-gold-king',level:rint(46,52)};}return arr.map(withRate);
  }
  return[];
}
function bossQuestConfigs(){const q=state.quest,d=BOSS_DIFFICULTIES[q.difficulty]||BOSS_DIFFICULTIES.normal,bossIds=(state.meta.defeatedBosses||[]).map(trainingEnemyTemplate).filter(Boolean),eliteIds=(state.meta.defeatedElites||[]).map(trainingEnemyTemplate).filter(Boolean);if(!bossIds.length&&!eliteIds.length)return[];const main=pick(bossIds.length?bossIds:eliteIds),sides=[];const pool=eliteIds.filter(x=>x.id!==main.id);while(pool.length&&sides.length<2){const x=pool.splice(rint(0,pool.length-1),1)[0];sides.push(x);}const lvl=t=>Math.max(t.levelMin||1,d.recommended-5);return sides.length===2?[{id:sides[0].id,level:lvl(sides[0])},{id:main.id,level:lvl(main)},{id:sides[1].id,level:lvl(sides[1])}]:[{id:main.id,level:lvl(main)},...sides.map(t=>({id:t.id,level:lvl(t)}))];}
function currentQuestConfigs(){const q=state.quest;if(!q)return[];if(q.type==='journal')return journalEncounter();if(q.type==='boss')return bossQuestConfigs();return makeTurntableConfigs(q.type,q.difficulty,q.areaIndex);}
async function questExplore(){const q=state.quest;if(!q||q.type!=='journal'||q.battleReady)return;const box=$('#questExploreResult');box.hidden=false;box.textContent='勇者一行は周囲を探索した';await fixedDelay(420);for(let i=0;i<6;i++){box.textContent=`探索中${'.'.repeat(i%3+1)}`;await fixedDelay(180);}const r=Math.random();if(r<.70){const it=weightedPickItem();addItem(it.id,1);box.innerHTML=`<img src="${it.image}" alt=""><b>${it.name}を見つけた！</b><br><small>1つ入手</small>`;bindImages(box);}else if(r<.90){const arr=AREA_FLAVOR[questWorld()?.id]||['周囲を見渡した'];box.textContent=pick(arr);}else box.textContent='敵の気配を感じる…';q.battleReady=true;await fixedDelay(820);box.hidden=true;renderQuestScreen();}
async function questCamp(){const q=state.quest;if(!q||q.campUsed)return;const hasTent=tentCount()>0,ans=await dialog(`キャンプで休みますか？\nテント：全回復${hasTent?'':'（未所持）'}\n椅子：HP・MP30%回復`,[[hasTent?'テント':'テントなし','tent',hasTent?'primary':''],['椅子','chair'],['戻る','no']],'CAMP');if(ans==='no'||!ans)return;if(ans==='tent'&&!hasTent)return;if(ans==='tent')consumeItem('mob-tent',1);for(const [id,lv] of state.party){const st=baseStats(player(id),lv),v=q.vitals[id];if(!v||v.dead)continue;if(ans==='tent'){v.hp=st.maxHp;v.mp=st.maxMp;}else{v.hp=Math.min(st.maxHp,v.hp+Math.ceil(st.maxHp*.30));v.mp=Math.min(st.maxMp,v.mp+Math.ceil(st.maxMp*.30));}}q.campUsed=true;toast(ans==='tent'?'HP・MPが全回復した！':'HP・MPが少し回復した！');renderQuestScreen();}
async function startQuestBattle(){const q=state.quest;if(!q||q.finished||q.type==='journal'&&!q.battleReady)return;const configs=currentQuestConfigs();if(!configs.length)return toast('出現可能な敵がいません');const bg=questBackground();await startBattleLoaded({mode:'quest',returnScreen:'quest',enemyConfigs:configs,party:state.party,questVitals:q.vitals,bg:bg.bg,fallbackBg:bg.fallback,bossBattle:q.type==='boss'||configs.some(x=>trainingEnemyTemplate(x.id)?.category==='boss'),questType:q.type,questArea:q.areaIndex,questDifficulty:q.difficulty||'',adventureLabel:questTitleText()});}
function persistQuestVitals(){const q=state.quest,b=state.battle;if(!q||!b)return;q.vitals={};b.allies.forEach(a=>{q.vitals[a.id]={hp:Math.max(0,a.hp),mp:Math.max(0,a.mpNow),dead:!!a.dead,status:clone(a.status||{})};});}
function advanceQuestAfterWin(){const q=state.quest;if(!q)return;if(q.type==='journal'){q.battleReady=false;q.explored=false;q.battleIndex++;if(q.battleIndex<3)return;q.battleIndex=0;}q.areaIndex++;q.campUsed=false;if(q.areaIndex>=4)q.finished=true;}
function endQuestToTraining(){state.quest=null;setTrainingMode(state.training.mode||'test');showScreen('training');}
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
  renderTrainingModeCarousel();
  const mode=state.training.mode||'test',isTest=mode==='test';
  $('#trainingPageTitle').textContent=isTest?'テスト戦闘':(TRAINING_MODES.find(x=>x.id===mode)?.name||'トレーニング');
  $('#trainingRandomBtn').style.display=isTest?'block':'none';
  $('#trainingTestPanel').hidden=!isTest;$('#trainingFeaturePanel').hidden=isTest;$('#trainingStickyAction').hidden=!isTest;
  if(!isTest){renderTrainingFeature(mode);return;}
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
  const t=trainingEnemyTemplate(STORY_GUESTS[key]||key);if(t)return{key,name:t.name,image:t.image||'',symbol:t.symbol||'敵',player:false,category:t.category||'normal',enemyTemplate:t,sizeClass:enemySizeClass(t),winged:enemyIsWinged(t)};
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
let lastStoryPartyScale=.14;
async function sizeStoryPartyImages(root){
  const imgs=$$('[data-story-party-img]',root);
  await Promise.all(imgs.map(async img=>{try{await preloadAsset(img.getAttribute('src'),'high');if(img.decode)await img.decode();}catch(_){}}));
  const valid=imgs.filter(img=>img.naturalWidth>0&&img.naturalHeight>0);if(!valid.length)return;
  const count=valid.length,rows=Math.max(1,Math.ceil(count/6));
  const rowSums=[];for(let i=0;i<count;i+=6)rowSums.push(valid.slice(i,i+6).reduce((a,img)=>a+img.naturalWidth,0));
  const maxRowW=Math.max(...rowSums,1),maxH=Math.max(...valid.map(i=>i.naturalHeight));
  const rowH=Math.max(1,(root.clientHeight-4)/rows);
  /* v36: keep the asset-authored relative size, but make the event party a little smaller than v35. */
  /* v37: story party should sit lower/smaller so guests and bosses never collide with it. */
  const cap=count<=2?.148:count<=3?.134:count<=4?.124:count<=6?.108:.094;
  const sc=Math.min(cap,(root.clientWidth-8)/maxRowW,(rowH*.94)/maxH);
  lastStoryPartyScale=sc;
  valid.forEach(img=>{
    img.style.setProperty('width',`${Math.max(1,Math.round(img.naturalWidth*sc))}px`,'important');
    img.style.setProperty('height',`${Math.max(1,Math.round(img.naturalHeight*sc))}px`,'important');
    img.classList.add('size-ready');
  });
}
function fitNaturalSize(nw,nh,scale,maxW,maxH){
  if(!(nw>0&&nh>0))return{w:1,h:1,scale:0};
  const s=Math.min(scale,maxW/nw,maxH/nh,1);
  return{w:Math.max(1,Math.round(nw*s)),h:Math.max(1,Math.round(nh*s)),scale:s};
}
function storyEnemyScaleKind(info){return info?.sizeClass||enemySizeClass(info?.enemyTemplate||info||{});}
function applyStoryGuestNaturalSize(holder,img,info,{multi=false}={}){
  if(!holder||!img||!(img.naturalWidth>0&&img.naturalHeight>0))return;
  const scene=$('#storyScene')?.getBoundingClientRect();if(!scene?.width||!scene?.height)return;
  let sz;
  if(info?.player){
    /* New allies use exactly the same source-pixel scale as the visible event party. */
    const sc=Math.min(lastStoryPartyScale||.14,.17);
    sz=fitNaturalSize(img.naturalWidth,img.naturalHeight,sc,scene.width*(multi?.25:.32),scene.height*(multi?.22:.25));
  }else{
    const kind=storyEnemyScaleKind(info),base=clamp(scene.width/2550,.155,.205)*(multi?.88:1),tune=enemyVisualTune(info);
    const mul={small:.82,normal:1.00,elite:1.16,rock:1.24,golem:1.32,boss:1.72,dragon:1.98,frezard:2.08}[kind]||1;
    const maxW=scene.width*({small:.30,normal:.39,elite:.46,rock:.50,golem:.54,boss:.84,dragon:.92,frezard:.94}[kind]||.42)*(multi?.76:1);
    const maxH=scene.height*({small:.19,normal:.24,elite:.28,rock:.31,golem:.34,boss:.45,dragon:.50,frezard:.54}[kind]||.25)*(multi?.90:1);
    sz=fitNaturalSize(img.naturalWidth,img.naturalHeight,base*mul*tune.scale,maxW,maxH);
  }
  holder.style.setProperty('width',`${sz.w}px`,'important');
  holder.style.setProperty('height',`${sz.h}px`,'important');
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
async function storyShowGuest(key,opt={}){const g=$('#storyGuest'),img=$('#storyGuestImg'),info=storyActorInfo(key),duplicate=storyAnchor(key);g.dataset.storyActor=key;g.className='story-guest';g.classList.add(info.player?'story-guest-player':'story-guest-enemy');if(!info.player){g.classList.add(`story-enemy-${storyEnemyScaleKind(info)}`);if(info.winged)g.classList.add('story-enemy-winged');}if(opt.side==='right')g.classList.add('side-right');else if(opt.side==='left')g.classList.add('side-left');if(duplicate&&duplicate!==g){duplicate.classList.add('guest-duplicate-hidden');g.dataset.hiddenPartyActor=key;}else delete g.dataset.hiddenPartyActor;g.hidden=false;$('#storyGuestFallback').textContent=info.symbol||'?';await readyStoryImage(img,info.image);applyStoryGuestNaturalSize(g,img,info);if(opt.slow)g.classList.add('fade-slow');g.classList.add('visible');if(opt.drop){g.classList.add('drop');$('#storyScene').classList.add('shake');}await fixedDelay(opt.drop?760:(opt.slow?1050:520));g.classList.remove('drop');$('#storyScene').classList.remove('shake');await fixedDelay(500);}
async function storyHideGuest(){const g=$('#storyGuest'),hiddenKey=g.dataset.hiddenPartyActor;g.classList.remove('visible');await fixedDelay(520);g.hidden=true;g.dataset.storyActor='';if(hiddenKey){const a=$(`[data-story-actor="${hiddenKey}"]`,$('#storyScene'));a?.classList.remove('guest-duplicate-hidden');delete g.dataset.hiddenPartyActor;}}
async function storyShowGuests(keys=[],opt={}){
  await storyHideGuest().catch(()=>{});
  const group=$('#storyGuestGroup'),ids=(keys||[]).filter(Boolean).slice(0,4);if(!ids.length)return;
  group.hidden=false;group.className='story-guest-group';group.dataset.count=String(ids.length);group.innerHTML=ids.map(key=>{const info=storyActorInfo(key),kind=info.player?'player':storyEnemyScaleKind(info),winged=info.winged?' story-enemy-winged':'';return `<div class="story-guest-multi story-multi-${kind}${winged}" data-story-actor="${key}"><img src="${info.image||''}" alt="${info.name}"><span>${info.symbol||'敵'}</span></div>`;}).join('');
  bindImages(group);
  await Promise.all($$('.story-guest-multi',group).map(async holder=>{const img=$('img',holder),key=holder.dataset.storyActor,info=storyActorInfo(key),src=img?.getAttribute('src');if(!src)return;try{await preloadAsset(src,'high');if(img.decode)await img.decode();}catch(_){}if(img.naturalWidth){img.classList.add('size-ready');applyStoryGuestNaturalSize(holder,img,info,{multi:true});}else img.classList.add('asset-missing');}));
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
function storyJoin(id){if(state.party.some(x=>x[0]===id))return;const avg=state.party.length?Math.round(state.party.reduce((s,x)=>s+(Number(x[1])||5),0)/state.party.length):5;state.party.push([id,clamp(avg,5,120)]);if(state.meta?.exp&&state.meta.exp[id]==null)state.meta.exp[id]=0;saveParty();saveMeta();state.training.party=state.party.map(x=>[...x]);}
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
  const btn=$('#fieldBattleBtn');btn.disabled=!state.adventure.battleReady||state.adventure.completed||storyBusy;btn.classList.toggle('locked',btn.disabled);$('#fieldBattleHint').textContent=state.adventure.completed?'CLEAR':state.adventure.battleReady?(pending?.bossBattle?'強敵の気配':'戦闘可能'):'探索が必要';$('#exploreBtn').disabled=state.adventure.battleReady||state.adventure.completed||storyBusy;const campSmall=$('#campBtn small');if(campSmall)campSmall.textContent=areaCampUsed()?'このAREAは休憩済み':'1 AREA 1回';bindImages($('#adventureScreen'));applyAdventurePartyScale();
}
function currentAreaKey(){return `${state.adventure.worldIndex||0}:${state.adventure.areaIndex||0}`;}
function areaCampUsed(){return !!state.adventure.campUsed?.[currentAreaKey()];}
function markAreaCampUsed(){if(!state.adventure.campUsed||typeof state.adventure.campUsed!=='object')state.adventure.campUsed={};state.adventure.campUsed[currentAreaKey()]=true;saveAdventure();}
function ensureAdventureVitals(){
  if(!state.adventure.vitals||typeof state.adventure.vitals!=='object')state.adventure.vitals={};
  for(const [id,lv] of state.party){const p=player(id);if(!p)continue;const st=baseStats(p,lv),v=state.adventure.vitals[id];if(!v)state.adventure.vitals[id]={hp:st.maxHp,mp:st.maxMp,dead:false,status:{poison:0,burn:0,sleep:0,stun:0,paralyze:0}};else{v.hp=clamp(Number(v.hp)||0,0,st.maxHp);v.mp=clamp(Number(v.mp)||0,0,st.maxMp);v.status={poison:0,burn:0,sleep:0,stun:0,paralyze:0,...(v.status||{})};v.dead=!!v.dead||v.hp<=0;}}
  saveAdventure();return state.adventure.vitals;
}
function weightedPickItem(){const total=GAME_ITEMS.reduce((s,x)=>s+x.weight,0);let r=Math.random()*total;for(const x of GAME_ITEMS){r-=x.weight;if(r<=0)return x;}return GAME_ITEMS[0];}
const AREA_FLAVOR={grassland:['広大な草原が広がっている'],grassland2:['広大な草原が広がっている'],desert:['歴史的建造物が見える'],desert2:['歴史的建造物が見える'],rural:['とても良い空気だ'],rural2:['とても良い空気だ'],neon:['未来を感じる素晴らしい街だ'],neon2:['未来を感じる素晴らしい街だ'],magma:['マグマが煮えたぎっている'],magma2:['マグマが煮えたぎっている'],sea:['様々な種族が遊泳している'],tribe:['不気味な音が響いている・・'],demonCastle:['邪悪なオーラを感じる'],matrix:['デジタルな世界が広がっている'],prison:['長居したくない光景だ'],demonWorld:['凄まじい魔力をたくさん感じる'],roseCountry:['悪の国だが、美しい国だ'],unfinishedBook:['こんな世界があるのか','無力で惨めになってくる'],mobKingdom:['全ての始まり','そして全ての終わり'],roseCastle:['薔薇がとても美しい国だ'],glacier:['壮大な光景だ'],space:['人類はちっぽけだ','そう思えるくらい壮大だ']};
async function showExplorePhase(title,sub='',img=''){
  const ov=$('#exploreOverlay'),load=$('#exploreLoading'),reward=$('#exploreReward');ov.hidden=false;$('#exploreTitle').textContent='探索結果';load.hidden=true;reward.hidden=false;$('#exploreRewardText').textContent=title;$('#exploreRewardSub').textContent=sub||'';const im=$('#exploreRewardImg');if(img){im.hidden=false;im.src=img;bindImage(im);}else im.hidden=true;await fixedDelay(950);ov.hidden=true;
}
async function runExploreDots(){const ov=$('#exploreOverlay'),load=$('#exploreLoading'),reward=$('#exploreReward');ov.hidden=false;$('#exploreTitle').textContent='勇者一行は周囲を探索した';reward.hidden=true;load.hidden=false;for(let i=0;i<6;i++){const n=i%3+1;$('#exploreDots').textContent='.'.repeat(n);await fixedDelay(220);}load.hidden=true;}
function makeAmbushConfigs(){const w=currentWorld(),count=rint(2,4),used=[],list=[];for(let i=0;i<count;i++){let t=weightedNormalTemplate(w,used);if(!t)t=weightedNormalTemplate(w,[]);if(!t)break;used.push(t.id);list.push({id:t.id,level:rint(t.levelMin||1,t.levelMax||t.levelMin||1)});}return list;}
function completeExplorationUnlock(){const enc=createAdventureEncounter();state.adventure.pendingEncounter=enc;state.adventure.battleReady=true;saveAdventure();renderAdventure();}
async function startExploreAmbush(){const configs=makeAmbushConfigs(),w=currentWorld(),area=currentArea();if(!configs.length){completeExplorationUnlock();return;}$('#exploreOverlay').hidden=true;await startBattleLoaded({mode:'adventure',returnScreen:'adventure',enemyConfigs:configs,party:state.party,useAdventureVitals:true,bg:area.bg,fallbackBg:w.fieldFallback,bossBattle:false,explorationAmbush:true,adventureLabel:`${w.name} 探索遭遇`});}
function rollExploreRecord(){const r=Math.random();if(r<.05)return'36';if(r<.11)return'37';if(r<.15)return'38';return'';}
async function maybeExploreRecord(){const id=rollExploreRecord();if(!id)return;const it=itemData(id);addItem(id,1);await showExplorePhase(`${it.name}を見つけた！`,'1つ入手',it.image);}
async function exploreField(){
  if(state.adventure.completed||state.adventure.battleReady||storyBusy)return;
  $('#exploreBtn').disabled=true;await runExploreDots();const r=Math.random();
  if(r<.70){const it=weightedPickItem();addItem(it.id,1);await showExplorePhase(`${it.name}を見つけた！`,'1つ入手',it.image);await maybeExploreRecord();completeExplorationUnlock();}
  else if(r<.90){const w=currentWorld(),arr=AREA_FLAVOR[w.id]||[`${w.name}を見渡した`];await showExplorePhase(pick(arr));await maybeExploreRecord();completeExplorationUnlock();}
  else{await showExplorePhase('敵と遭遇した！','戦闘になります');await maybeExploreRecord();await startExploreAmbush();}
}

/* ===== CAMP ===== */
let campSwapIndex=null;
function openCamp(){renderCampMain();$('#campOverlay').hidden=false;}
function closeCamp(){$('#campOverlay').hidden=true;campSwapIndex=null;}
function renderCampMain(){const used=areaCampUsed();$('#campTitle').textContent=`キャンプ / ${currentArea()?.name||''}`;$('#campUsageText').textContent=used?'このAREAでは休憩済みです':'このAREAで1回だけ休憩できます';$('#campTentCount').textContent=tentCount();$('#campMainMenu').hidden=false;$('#campSubPanel').hidden=true;$$('[data-camp-action="tent"],[data-camp-action="chair"],[data-camp-action="drink"]',$('#campMainMenu')).forEach(b=>b.classList.toggle('camp-used',used));bindImages($('#campOverlay'));}
async function campFadeMessage(text,work){const f=$('#campFade');$('#campFadeText').textContent='';f.hidden=false;await nextPaint();f.classList.add('dark');await fixedDelay(620);if(work)await work();$('#campFadeText').textContent=text;await fixedDelay(900);f.classList.remove('dark');await fixedDelay(620);f.hidden=true;$('#campFadeText').textContent='';}
function healCampVitals(ratio=1){const v=ensureAdventureVitals();for(const [id,lv] of state.party){const p=player(id),st=baseStats(p,lv),x=v[id];if(!x||x.dead||x.hp<=0)continue;if(ratio>=1){x.hp=st.maxHp;x.mp=st.maxMp;}else{x.hp=Math.min(st.maxHp,x.hp+Math.ceil(st.maxHp*ratio));x.mp=Math.min(st.maxMp,x.mp+Math.ceil(st.maxMp*ratio));}}saveAdventure();}
async function useCampTent(){if(areaCampUsed())return dialog('このAREAではすでにキャンプを利用しました。',[['OK','ok']],'SYSTEM');if(tentCount()<1)return dialog('モブテントを所持していません！',[['OK','ok']],'SYSTEM');const ans=await dialog('テントで休みますか？\nモブテントを1つ消費します',[['はい','yes','primary'],['いいえ','no']],'SYSTEM');if(ans!=='yes')return;if(!consumeItem('mob-tent',1))return;await campFadeMessage('パーティーのHPとMPが全回復した！',async()=>{healCampVitals(1);markAreaCampUsed();saveCampCheckpoint();});renderCampMain();renderAdventure();}
async function useCampChair(){if(areaCampUsed())return dialog('このAREAではすでにキャンプを利用しました。',[['OK','ok']],'SYSTEM');const ans=await dialog('椅子で休みますか？',[['はい','yes','primary'],['いいえ','no']],'SYSTEM');if(ans!=='yes')return;await campFadeMessage('パーティーのHPとMPが少し回復した！',async()=>{healCampVitals(.30);markAreaCampUsed();saveCampCheckpoint();});renderCampMain();renderAdventure();}
function campBackButton(){return `<button class="camp-back" data-camp-back type="button">← 戻る</button>`;}
function renderCampPartyMenu(){const p=$('#campSubPanel');$('#campMainMenu').hidden=true;p.hidden=false;p.innerHTML=`${campBackButton()}<div class="camp-sub-title"><small>PARTY</small><h3>パーティー</h3></div><div class="camp-option-list"><button data-camp-party="formation" type="button">編成<small>MAIN / SUPER SUB / RESERVE の並び替え</small></button><button data-camp-party="equipment" type="button">装備<small>装備変更とステータス差分</small></button><button data-camp-party="inventory" type="button">持ち物<small>所持アイテムを使用</small></button><button data-camp-party="status" type="button">状態確認<small>HP・MP・状態を確認</small></button></div>`;bindCampSubEvents();}
function bindCampSubEvents(){$('[data-camp-back]',$('#campSubPanel'))?.addEventListener('click',renderCampMain);$$('[data-camp-party]',$('#campSubPanel')).forEach(b=>b.onclick=()=>{const a=b.dataset.campParty;if(a==='formation')renderCampFormation();else if(a==='equipment')renderCampEquipment();else if(a==='inventory')renderCampInventory();else renderCampStatus();});}
function renderCampFormation(){const p=$('#campSubPanel');p.innerHTML=`${campBackButton()}<div class="camp-sub-title"><small>FORMATION</small><h3>編成</h3><p>2人を順番にタップすると入れ替えます。</p></div><div class="camp-formation">${state.party.map(([id,lv],i)=>{const q=player(id),z=zoneForIndex(i);return `<button class="camp-member ${campSwapIndex===i?'selected':''}" data-camp-swap="${i}" type="button"><img src="${versionedPlay(q.image)}" alt="${q.name}"><span><small>${z.key} ${z.n}</small><b>${q.name}</b><em>Lv${lv}</em></span></button>`;}).join('')}</div>`;bindImages(p);$('[data-camp-back]',p).onclick=renderCampPartyMenu;$$('[data-camp-swap]',p).forEach(b=>b.onclick=()=>{const i=Number(b.dataset.campSwap);if(campSwapIndex===null){campSwapIndex=i;return renderCampFormation();}if(campSwapIndex===i){campSwapIndex=null;return renderCampFormation();}[state.party[campSwapIndex],state.party[i]]=[state.party[i],state.party[campSwapIndex]];campSwapIndex=null;saveParty();state.training.party=state.party.map(x=>[...x]);if(areaCampUsed())saveCampCheckpoint();renderCampFormation();renderAdventure();});}
function renderCampEquipment(){const p=$('#campSubPanel');p.innerHTML=`${campBackButton()}<div class="camp-sub-title"><small>EQUIPMENT</small><h3>装備</h3></div><div class="camp-empty-note">装備データ・装備効果がまだ未設定のため、ここでは仮の数値を作りません。<br>正式データ導入時は「変更前 → 変更後」のステータス差分を必ず表示します。</div>`;$('[data-camp-back]',p).onclick=renderCampPartyMenu;}
function statusLabel(v){if(v?.dead||v?.hp<=0)return'ダウン';const a=[];if(v?.status?.poison>0)a.push('毒');if(v?.status?.burn>0)a.push('やけど');if(v?.status?.paralyze>0)a.push('マヒ');if(v?.status?.sleep>0)a.push('睡眠');if(v?.status?.stun>0)a.push('ひるみ');return a.length?a.join('・'):'健康';}
function renderCampStatus(){const p=$('#campSubPanel'),v=ensureAdventureVitals();p.innerHTML=`${campBackButton()}<div class="camp-sub-title"><small>STATUS</small><h3>状態確認</h3></div><div class="camp-status-list">${state.party.map(([id,lv])=>{const q=player(id),st=baseStats(q,lv),x=v[id];return `<div class="camp-status-card"><img src="${versionedPlay(q.image)}" alt="${q.name}"><div><b>${q.name} <em>Lv${lv}</em></b><small>HP ${Math.round(x.hp)}/${st.maxHp}</small><small>MP ${Math.round(x.mp)}/${st.maxMp}</small><strong class="${x.dead?'down':''}">${statusLabel(x)}</strong></div></div>`;}).join('')}</div>`;bindImages(p);$('[data-camp-back]',p).onclick=renderCampPartyMenu;}
function itemEffectText(it){if(it.type==='hp')return`HP ${it.min}～${it.max}回復`;if(it.type==='mp')return`MP ${it.min}～${it.max}回復`;if(it.type==='cure')return`${{poison:'毒',burn:'やけど',paralyze:'マヒ'}[it.status]}を治す`;if(it.type==='cureAll')return'状態異常を全て治す';if(it.type==='hpmp')return'HP・MP 200回復';if(it.type==='full')return'HP・MP 全回復';if(it.type==='battleBuff')return`戦闘中 ${it.stat} 20%アップ`;if(it.type==='partyHp')return'味方全体 HP 150回復';if(it.type==='revive')return'ダウン1人をHP50%で復活';if(it.type==='record')return'トレーニング施設で使用するレコード';return'';}
function renderCampInventory(){const p=$('#campSubPanel'),owned=GAME_ITEMS.filter(it=>itemCount(it.id)>0);p.innerHTML=`${campBackButton()}<div class="camp-sub-title"><small>ITEM</small><h3>持ち物</h3></div><div class="camp-inventory">${owned.length?owned.map(it=>`<button data-field-item="${it.id}" type="button"><img src="${it.image}" alt="${it.name}"><div><b>${it.name}</b><small>${itemEffectText(it)}</small></div><em>×${itemCount(it.id)}</em></button>`).join(''):'<div class="camp-empty-note">使用できるアイテムを所持していません。</div>'}</div>`;bindImages(p);$('[data-camp-back]',p).onclick=renderCampPartyMenu;$$('[data-field-item]',p).forEach(b=>b.onclick=()=>openFieldItemTargets(b.dataset.fieldItem));}
async function openFieldItemTargets(id){const it=itemData(id);if(!it||itemCount(id)<1)return;if(it.type==='record')return dialog(`${it.name}はトレーニング施設で使用します。`,[['OK','ok']],'RECORD');if(it.type==='battleBuff')return dialog(`${it.name}は戦闘中に使用するアイテムです。`,[['OK','ok']],'SYSTEM');if(it.type==='partyHp'){const v=ensureAdventureVitals();let used=false;for(const [pid,lv] of state.party){const q=player(pid),st=baseStats(q,lv),x=v[pid];if(x&&!x.dead&&x.hp<st.maxHp){x.hp=Math.min(st.maxHp,x.hp+it.amount);used=true;}}if(!used)return dialog('HPが減っているメンバーはいません。',[['OK','ok']],'SYSTEM');consumeItem(id);saveAdventure();if(areaCampUsed())saveCampCheckpoint();toast(`${it.name}を使用しました`);return renderCampInventory();}
  const v=ensureAdventureVitals(),candidates=state.party.map(([pid,lv])=>{const q=player(pid),x=v[pid],st=baseStats(q,lv);return{pid,lv,q,x,st};});const p=$('#campSubPanel');p.innerHTML=`${campBackButton()}<div class="camp-sub-title"><small>USE ITEM</small><h3>${it.name}</h3><p>使用するメンバーを選んでください。</p></div><div class="camp-status-list">${candidates.map(c=>`<button class="camp-status-card item-target" data-item-target="${c.pid}" type="button"><img src="${versionedPlay(c.q.image)}" alt="${c.q.name}"><div><b>${c.q.name}</b><small>HP ${Math.round(c.x.hp)}/${c.st.maxHp}　MP ${Math.round(c.x.mp)}/${c.st.maxMp}</small><strong>${statusLabel(c.x)}</strong></div></button>`).join('')}</div>`;bindImages(p);$('[data-camp-back]',p).onclick=renderCampInventory;$$('[data-item-target]',p).forEach(b=>b.onclick=()=>useFieldItemOn(id,b.dataset.itemTarget));}
function useFieldItemOn(id,pid){const it=itemData(id),v=ensureAdventureVitals(),entry=state.party.find(x=>x[0]===pid),q=player(pid);if(!it||!entry||!q||itemCount(id)<1)return;const st=baseStats(q,entry[1]),x=v[pid];let ok=false,msg='';if(it.type==='hp'&&!x.dead&&x.hp<st.maxHp){const n=rint(it.min,it.max);x.hp=Math.min(st.maxHp,x.hp+n);ok=true;msg=`HPが${n}回復した！`;}else if(it.type==='mp'&&!x.dead&&x.mp<st.maxMp){const n=rint(it.min,it.max);x.mp=Math.min(st.maxMp,x.mp+n);ok=true;msg=`MPが${n}回復した！`;}else if(it.type==='cure'&&!x.dead&&x.status[it.status]>0){x.status[it.status]=0;ok=true;msg='状態異常が治った！';}else if(it.type==='cureAll'&&!x.dead&&Object.values(x.status).some(n=>n>0)){for(const k of Object.keys(x.status))x.status[k]=0;ok=true;msg='状態異常が全て治った！';}else if(it.type==='hpmp'&&!x.dead&&(x.hp<st.maxHp||x.mp<st.maxMp)){x.hp=Math.min(st.maxHp,x.hp+200);x.mp=Math.min(st.maxMp,x.mp+200);ok=true;msg='HPとMPが回復した！';}else if(it.type==='full'&&!x.dead&&(x.hp<st.maxHp||x.mp<st.maxMp)){x.hp=st.maxHp;x.mp=st.maxMp;ok=true;msg='HPとMPが全回復した！';}else if(it.type==='revive'&&x.dead){x.dead=false;x.hp=Math.max(1,Math.round(st.maxHp*it.ratio));x.mp=Math.min(x.mp,st.maxMp);ok=true;msg=`${q.name}が復活した！`;}if(!ok)return dialog('今はこのアイテムを使用できません。',[['OK','ok']],'SYSTEM');consumeItem(id);saveAdventure();if(areaCampUsed())saveCampCheckpoint();toast(msg);renderCampInventory();}
function applyDrinkImmediate(d){const v=ensureAdventureVitals();for(const [id,lv] of state.party){const q=player(id),st=baseStats(q,lv),x=v[id];if(!x||x.dead)continue;if(d.fullHp)x.hp=st.maxHp;if(d.heal){x.hp=Math.min(st.maxHp,x.hp+Math.ceil(st.maxHp*d.heal));x.mp=Math.min(st.maxMp,x.mp+Math.ceil(st.maxMp*d.heal));}if(d.hpHeal)x.hp=Math.min(st.maxHp,x.hp+Math.ceil(st.maxHp*d.hpHeal));if(d.mpHeal)x.mp=Math.min(st.maxMp,x.mp+Math.ceil(st.maxMp*d.mpHeal));if(d.cure)x.status[d.cure]=0;if(d.cureAll)for(const k of Object.keys(x.status))x.status[k]=0;}if(d.buff)state.adventure.areaBuff={...(state.adventure.areaBuff||{}),...d.buff,source:d.id};saveAdventure();}
async function useCampDrink(id){if(areaCampUsed())return dialog('このAREAではすでにキャンプを利用しました。',[['OK','ok']],'SYSTEM');const d=DRINK_SETS.find(x=>x.id===id);if(!d||drinkCount(id)<1)return;const ans=await dialog(`${d.name}を飲みますか？`,[['はい','yes','primary'],['いいえ','no']],'DRINK');if(ans!=='yes')return;if(!consumeDrink(id,1))return;applyDrinkImmediate(d);markAreaCampUsed();saveCampCheckpoint();await campFadeMessage(`勇者一行は${d.name}を楽しんだ！\n${d.desc}`);renderCampMain();renderAdventure();}
function renderCampDrinks(){const p=$('#campSubPanel');$('#campMainMenu').hidden=true;p.hidden=false;const owned=DRINK_SETS.filter(d=>drinkCount(d.id)>0);p.innerHTML=`${campBackButton()}<div class="camp-sub-title"><small>DRINK</small><h3>ドリンクセット</h3></div><div class="camp-inventory">${owned.length?owned.map(d=>`<button data-camp-drink="${d.id}" type="button"><img src="${d.image}" alt="${d.name}"><div><b>${d.name}</b><small>${d.desc}</small></div><em>×${drinkCount(d.id)}</em></button>`).join(''):'<div class="camp-empty-note">所持しているドリンクセットはありません。<br>酒場で購入できます。</div>'}</div>`;bindImages(p);$('[data-camp-back]',p).onclick=renderCampMain;$$('[data-camp-drink]',p).forEach(b=>b.onclick=()=>useCampDrink(b.dataset.campDrink));}

function saveCampCheckpoint(){const cp={worldIndex:state.adventure.worldIndex,areaIndex:state.adventure.areaIndex,battleIndex:state.adventure.battleIndex,battleReady:state.adventure.battleReady,completed:state.adventure.completed,pendingEncounter:clone(state.adventure.pendingEncounter),vitals:clone(state.adventure.vitals),storyFlags:clone(state.adventure.storyFlags||{}),campUsed:clone(state.adventure.campUsed||{}),areaBuff:clone(state.adventure.areaBuff),coins:state.coins,party:clone(state.party),meta:clone(state.meta)};state.adventure.checkpoint=cp;saveAdventure();saveParty();saveMeta();}
function restoreCampCheckpoint(){const cp=state.adventure.checkpoint;if(cp){state.adventure={...state.adventure,...clone(cp),checkpoint:clone(cp)};state.coins=Number(cp.coins)||0;if(cp.meta){state.meta={...defaultMeta(),...clone(cp.meta)};state.meta.coins=state.coins;saveMeta();}if(Array.isArray(cp.party)){state.party=clone(cp.party).map(x=>Array.isArray(x)?[canonicalPlayerId(x[0]),x[1]]:x);saveParty();}}else state.adventure=defaultAdventure();saveAdventure();}

function growthValue(lv,curve){lv=clamp(Number(lv)||1,1,120);const [v1,v99,v120=v99]=curve;if(lv<=99){const t=(lv-1)/98;return Math.round(v1+(v99-v1)*t);}const t=(lv-99)/21;return Math.round(v99+(v120-v99)*t);}
function baseStats(p,lv){const t=TEMP_BALANCE.playerTargets?.[p.id];if(!t){const old=TEMP_BALANCE.playerGrowth[p.id],b=TEMP_BALANCE.base;return{maxHp:Math.round(b.hp+old.hp*lv),maxMp:Math.round(b.mp+old.mp*lv),atk:Math.round(b.atk+old.atk*lv),mag:Math.round(b.mag+old.mag*lv),def:Math.round(b.def+old.def*lv),res:Math.round(b.res+old.res*lv),spd:Math.round(b.spd+old.spd*lv)};}return{maxHp:growthValue(lv,t.hp),maxMp:growthValue(lv,t.mp),atk:growthValue(lv,t.atk),mag:growthValue(lv,t.mag),def:growthValue(lv,t.def),res:growthValue(lv,t.res),spd:growthValue(lv,t.spd)};}
function buildAlly(p,lv,vital){lv=clamp(Number(lv)||1,1,120);const s=baseStats(p,lv),hp=vital?clamp(Number(vital.hp)||0,0,s.maxHp):s.maxHp,vs=vital?.status||{};return{...p,level:lv,...s,hp,mpNow:vital?clamp(Number(vital.mp)||0,0,s.maxMp):s.maxMp,dead:vital?.dead===true||hp<=0,guard:0,guardTurns:0,barrier:0,atkBuff:0,atkBuffTurns:0,atkDebuff:0,atkDebuffTurns:0,defBuff:0,defBuffTurns:0,spdBuff:0,spdBuffTurns:0,spdDebuff:0,spdDebuffTurns:0,allBuff:0,allBuffTurns:0,damageCut:0,damageCutTurns:0,status:{poison:Number(vs.poison)||0,burn:Number(vs.burn)||0,sleep:Number(vs.sleep)||0,stun:Number(vs.stun)||0,paralyze:Number(vs.paralyze)||0},pinkReviveUsed:false,lilithReviveUsed:false,transformed:false,narakuStacks:0,nextSupportTurn:rint(2,5)};}
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
function buildEnemyWave(records,partySize,bg,fallbackBg){const expanded=[];for(const r of records||[]){const base=trainingEnemyTemplate(r.id)||r.template||r;if(!base)continue;const t={...base,...r,id:base.id||r.id};const q=clamp(Number(r.qty)||1,1,4);for(let i=0;i<q;i++)expanded.push({t,level:r.level||t.levelMin||1});}const ordered=arrangeEnemyWaveCenter(expanded),count=Math.max(1,ordered.length);return ordered.map(x=>buildEnemyFromTemplate(x.t,x.level,partySize,count,bg,fallbackBg)).filter(Boolean);}
function beginBattle(config){
  if(state.test?.enabled&&state.test?.fast5)state.speed=5;else if(state.speed===5)state.speed=1;
  const partyList=(config.party||state.party).slice(0,10),vitals=config.questVitals|| (config.useAdventureVitals?state.adventure.vitals:null),allies=partyList.map(([id,lv])=>buildAlly(player(id),lv,vitals?.[id])),partySize=Math.min(4,allies.length);
  const areaBuff=config.useAdventureVitals?(state.adventure.areaBuff||null):null;if(areaBuff)for(const a of allies){if(areaBuff.atk){a.atkBuff=areaBuff.atk;a.atkBuffTurns=99;}if(areaBuff.def){a.defBuff=areaBuff.def;a.defBuffTurns=99;}if(areaBuff.spd){a.spdBuff=areaBuff.spd;a.spdBuffTurns=99;}if(areaBuff.mag){a.mag=Math.round(a.mag*(1+areaBuff.mag));}if(areaBuff.all){a.atk=Math.round(a.atk*(1+areaBuff.all));a.mag=Math.round(a.mag*(1+areaBuff.all));a.def=Math.round(a.def*(1+areaBuff.all));a.res=Math.round(a.res*(1+areaBuff.all));a.spd=Math.round(a.spd*(1+areaBuff.all));}}
  let waveConfigs=[];
  if(Array.isArray(config.waves)&&config.waves.length)waveConfigs=clone(config.waves);
  else if(Array.isArray(config.enemyConfigs)&&config.enemyConfigs.length)waveConfigs=[clone(config.enemyConfigs)];
  else if(Array.isArray(config.enemies)&&config.enemies.length)waveConfigs=[config.enemies.map(e=>({template:e,level:e.level||1}))];
  else if(config.enemy)waveConfigs=[[{template:config.enemy,level:config.enemy.level||1}]];
  else if(config.bossId){const bt=trainingEnemyCatalog().find(t=>t.bossId===config.bossId)||legacyBossTemplate(boss(config.bossId));waveConfigs=[[{id:bt.id,level:config.bossLevel||bt.levelMin||30}]];}
  const bg=config.bg||currentArea()?.bg||waveConfigs[0]?.[0]?.template?.bg||'back/sougen4.png',fallbackBg=config.fallbackBg||currentWorld()?.fieldFallback||'back/rpgmain.png';
  const enemies=buildEnemyWave(waveConfigs.shift()||[],partySize,bg,fallbackBg);const first=enemies[0];
  state.battle={mode:config.mode||'training',returnScreen:config.returnScreen||'training',allies,mainIds:allies.slice(0,4).map(a=>a.id),superIds:allies.slice(4,6).map(a=>a.id),reserveIds:allies.slice(6,10).map(a=>a.id),enemies,enemy:first,targetEnemyId:first?.uid||null,actingEnemyId:null,pendingWaveConfigs:waveConfigs,defeatedEnemies:[],turn:1,queue:[],queuePos:0,busy:false,auto:false,finished:false,teamGuard:0,teamGuardTurns:0,yushaGuard:0,yushaGuardTurns:0,config,bg,fallbackBg};
  state.noticeQueue=[];state.noticeBusy=false;setImage($('#battleBg'),bg,fallbackBg);$('#battleModeLabel').textContent=config.mode==='adventure'?(config.bossBattle?'BOSS / MID BOSS':'FIELD BATTLE'):config.mode==='story'?'EVENT BATTLE':config.mode==='quest'?'TRAINING QUEST':'TRAINING';$('#resultOverlay').hidden=true;$('#skillMenu').hidden=true;$('#autoBtn').classList.remove('active');$('#autoBtn').textContent='AUTO';$('#speedBtn').textContent=`×${state.speed}`;$('#battleBackBtn').disabled=config.mode==='story';$('#battleBackBtn').style.display=(config.mode==='training'?'':'none');renderBattle();showScreen('battle');setTimeout(()=>notice(`${enemies.map(e=>e.name).join('・')}が現れた！`,'danger',820),120);startRound();
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
function enemyVisualTune(e){
  const id=e?.id||e?.enemyTemplate?.id||'';
  const name=e?.name||e?.enemyTemplate?.name||'';
  if(id==='boss-neon'||name==='モブネオンバルス')return{scale:1.28,y:0};
  if(id==='boss-guardian'||name==='モブガーディアン')return{scale:1.12,y:14};
  return{scale:1,y:0};
}
function battleEnemyNaturalScale(root,kind,e=null){
  const w=root?.clientWidth||440,base=clamp(w/2450,.165,.225),tune=enemyVisualTune(e||{});
  return base*({small:.90,normal:1.10,elite:1.18,rock:1.30,golem:1.42,boss:1.90,dragon:2.18,frezard:2.28}[kind]||1)*tune.scale;
}
function applyEnemyVisualSizes(root=$('#enemyArea')){
  if(!root)return;
  $$('[data-enemy-target]',root).forEach(unit=>{
    const img=$('.enemy-sprite',unit);if(!img)return;
    const place=()=>{
      if(!(img.naturalWidth>0&&img.naturalHeight>0))return;
      const kind=['small','normal','elite','rock','golem','boss','dragon','frezard'].find(k=>unit.classList.contains(`enemy-size-${k}`))||'normal';
      const enemy=enemyByUid(unit.dataset.enemyTarget),tune=enemyVisualTune(enemy||{}),wrap=$('.enemy-sprite-wrap',unit);
      const field=$('#battle-field')||$('.battle-field')||$('#battleScreen'),fr=field?.getBoundingClientRect()||{width:root.clientWidth,height:root.clientHeight};
      const maxW=(fr.width||root.clientWidth)*({small:.27,normal:.32,elite:.36,rock:.40,golem:.44,boss:.82,dragon:.88,frezard:.92}[kind]||.32);
      const maxH=(fr.height||root.clientHeight)*({small:.31,normal:.38,elite:.42,rock:.45,golem:.48,boss:.74,dragon:.79,frezard:.84}[kind]||.38);
      const sz=fitNaturalSize(img.naturalWidth,img.naturalHeight,battleEnemyNaturalScale(root,kind,enemy),maxW,maxH);
      img.style.setProperty('width',`${sz.w}px`,'important');img.style.setProperty('height',`${sz.h}px`,'important');
      if(tune.y&&wrap)wrap.style.setProperty('transform',`translateY(${tune.y}px)`,'important');
      requestAnimationFrame(()=>positionEnemyTargetMarks(root));
    };
    place();if(!img.complete)img.addEventListener('load',place,{once:true});
  });
}
function positionEnemyTargetMarks(root=$('#enemyArea')){
  if(!root)return;
  $$('[data-enemy-target]',root).forEach(unit=>{
    const mark=$('.enemy-target-mark',unit),wrap=$('.enemy-sprite-wrap',unit),img=$('.enemy-sprite',unit);
    if(!mark||!wrap)return;
    const place=()=>{
      if(!img||!(img.getBoundingClientRect().width>0)){mark.style.setProperty('top','-12px','important');mark.style.setProperty('left','50%','important');return;}
      const wr=wrap.getBoundingClientRect(),ir=img.getBoundingClientRect();
      mark.style.setProperty('left',`${ir.left-wr.left+ir.width/2}px`,'important');
      mark.style.setProperty('top',`${Math.round(ir.top-wr.top-14)}px`,'important');
      mark.style.setProperty('bottom','auto','important');
    };
    place();if(img&&!img.complete)img.addEventListener('load',place,{once:true});
  });
}
function enemyMarkup(e){
  const tags=[];for(const[k,l]of[['poison','毒'],['burn','やけど'],['sleep','眠り'],['stun','ひるみ'],['paralyze','マヒ']])if(e.status[k]>0)tags.push(l);if(e.shieldTurns>0)tags.push('SHIELD');if(e.defDebuffTurns>0)tags.push('DEF↓↓');if(e.spdDebuffTurns>0)tags.push('SPD↓↓');
  const selected=state.battle?.targetEnemyId===e.uid&&e.hp>0,dead=e.hp<=0;
  const nameLen=[...String(e.name||'')].length,nameSize=nameLen>=11?4.7:nameLen>=9?5.1:nameLen>=7?5.6:6.2;
  return`<button type="button" class="enemy-unit enemy-size-${enemySizeClass(e)} ${enemyIsWinged(e)?'enemy-winged':''} ${selected?'selected':''} ${dead?'dead':''}" data-enemy-target="${e.uid}" ${dead?'disabled':''}><div class="enemy-sprite-wrap">${e.image?`<img class="enemy-sprite" data-enemy-sprite="${e.uid}" src="${e.image}" alt="${e.name}">`:''}<div class="enemy-symbol ${e.image?'fallback-only':''}" data-enemy-symbol="${e.uid}">${e.symbol||'敵'}</div>${selected?'<span class="enemy-target-mark">▼</span>':''}</div><div class="enemy-nameplate"><div class="enemy-name-row"><b style="font-size:${nameSize}px!important">${e.name}</b><small>Lv${e.level}</small>${tags.length?`<span class="enemy-tags">${tags.map(t=>`<em>${t}</em>`).join('')}</span>`:''}</div><div class="enemy-hp-row"><span>${dead?'DOWN':'HP'}</span><div class="gauge"><i class="hp" style="width:${pct(e.hp,e.maxHp)}%"></i></div><b>${Math.ceil(e.hp).toLocaleString()}/${e.maxHp.toLocaleString()}</b></div></div></button>`;
}
function statusText(a){return Object.entries(a.status).filter(([,v])=>v>0).map(([k])=>({poison:'毒',burn:'炎',sleep:'眠',stun:'怯',paralyze:'麻'}[k])).join(' ');}
function allyMarkup(a){const st=statusText(a);return`<button type="button" class="ally-hud-card ${a.dead?'dead':''} ${activeAlly()===a?'active turn-active':''}" data-ally-id="${a.id}"><span class="ally-hud-art"><img src="${versionedPlay(a.image)}" alt="${a.name}"><i>${a.symbol}</i>${st?`<em class="ally-status-mark">${st}</em>`:''}</span><div class="ally-title-line"><b>${a.name}</b><em>${a.dead?'DOWN':`Lv${a.level}`}</em></div><div class="ally-hud-line"><span>HP ${Math.ceil(a.hp)}/${a.maxHp}</span><span>MP ${Math.floor(a.mpNow)}/${a.maxMp}</span></div><div class="ally-gauges"><div class="gauge tiny"><i class="hp" style="width:${pct(a.hp,a.maxHp)}%"></i></div><div class="gauge tiny"><i class="mp" style="width:${pct(a.mpNow,a.maxMp)}%"></i></div></div></button>`;}
function superMarkup(a){const next=Math.max(0,a.nextSupportTurn-state.battle.turn);return`<div class="super-chip ${a.dead?'dead':''}" data-ally-id="${a.id}"><span><img src="${versionedPlay(a.image)}" alt="${a.name}"><i>${a.symbol}</i></span><div><b>${a.name}</b><small>${a.dead?'DOWN':`HP ${Math.ceil(a.hp)} / MP ${Math.floor(a.mpNow)}`}</small></div><em>${a.dead?'—':next===0?'READY':`+${next}T`}</em></div>`;}
function benchMarkup(a){return`<div class="bench-chip ${a.dead?'dead':''}" data-ally-id="${a.id}"><span><img src="${versionedPlay(a.image)}" alt="${a.name}"><i>${a.symbol}</i></span><div><b>${a.name}</b><small>${a.dead?'DOWN':`HP ${Math.ceil(a.hp)} / MP ${Math.floor(a.mpNow)}`}</small><div class="gauge tiny"><i class="hp" style="width:${pct(a.hp,a.maxHp)}%"></i></div></div></div>`;}
function renderBattle(){
  const b=state.battle;if(!b)return;targetEnemy();$('#battleTurnLabel').textContent='';const enemies=b.enemies||[];const area=$('#enemyArea');area.className=`enemy-area enemy-count-${Math.max(1,enemies.length)}`;area.innerHTML=enemies.map(enemyMarkup).join('');
  $('#allyStatus').innerHTML=mainAllies().map(allyMarkup).join('');$('#superStatus').innerHTML=superAllies().length?superAllies().map(superMarkup).join(''):`<div class="no-bench">援護なし</div>`;$('#benchStatus').innerHTML=reserveAllies().length?reserveAllies().map(benchMarkup).join(''):`<div class="no-bench">控えなし</div>`;
  const entry=currentEntry(),a=activeAlly(),acting=entry?.type==='enemy'?enemyByUid(entry.enemyId):null,target=targetEnemy();$('#activeActorBar').innerHTML=a?`<img src="${versionedPlay(a.image)}" alt=""><div><small>COMMAND / SPD ${Math.round(effective('spd',a))}</small><b>${a.name}</b><span>HP ${Math.ceil(a.hp)} / MP ${Math.floor(a.mpNow)}</span></div>`:entry?.type==='super'?`<div><small>AUTO ACTION</small><b>${allyById(entry.id)?.name||''}</b></div>`:`<div><small>${acting?'ENEMY ACTION':'TARGET'}</small><b>${acting?.name||target?.name||''}</b></div>`;
  bindImages($('#battleScreen'));applyEnemyVisualSizes(area);positionEnemyTargetMarks(area);requestAnimationFrame(()=>{applyEnemyVisualSizes(area);positionEnemyTargetMarks(area);});$$('[data-enemy-target]',area).forEach(btn=>btn.onclick=()=>setEnemyTarget(btn.dataset.enemyTarget));setCommandDisabled(b.busy||b.finished||!a);
}
function setCommandDisabled(dis){['attackBtn','skillBtn','specialBtn','ultimateBtn','defendBtn','itemBtn','escapeBtn','switchBtn'].forEach(id=>{const el=$('#'+id);if(el)el.disabled=dis;});}

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
function recordEnemyDefeat(e){if(!e||e._defeatRecorded)return;e._defeatRecorded=true;state.battle?.defeatedEnemies?.push({uid:e.uid,id:e.id,name:e.name,level:e.level,category:e.category,coinReward:e.coinReward||0,rewardExpScale:e.rewardExpScale||1,rewardCoinScale:e.rewardCoinScale||1});}
function applyEnemyDamageTo(a,e,power,type='physical',crit=0,showGenericFx=true,showHitPulse=true){
  if(!e||e.hp<=0)return{value:0,crit:false};const uid=e.uid,r=calcDamage(a,type,power,crit,e);let d=r.value;if(e.shieldTurns>0)d=Math.round(d*(1-(e.damageReduction||.2)));if(e.allyShieldTurns>0)d=Math.round(d*(1-(e.allyShieldReduction||.10)));const scriptedImmortal=state.battle?.mode==='story'&&state.battle?.config?.scriptedImmortalEnemy;e.hp=Math.max(scriptedImmortal?1:0,e.hp-d);
  if(e.hp<=0){recordEnemyDefeat(e);if(state.battle.targetEnemyId===uid){const next=livingEnemies().find(x=>x.uid!==uid);state.battle.targetEnemyId=next?.uid||null;if(!state.battle.actingEnemyId)state.battle.enemy=next||e;}}
  renderBattle();floatNumber(d,r.crit?'crit':'damage',`enemy:${uid}`);if(showGenericFx)fx(type==='magic'?'magic':'slash',`enemy:${uid}`);if(showHitPulse)pulseEnemy('hit',uid);wakeEnemyOnHit(e);if(e.hp<=0)notice(`${e.name} DOWN`,'danger',520);return{...r,value:d};
}
function applyEnemyDamage(a,power,type='physical',crit=0,showGenericFx=true){return applyEnemyDamageTo(a,targetEnemy(),power,type,crit,showGenericFx);}
async function playerAoeDamage(a,power,type='physical',crit=0,statusKind='',statusChance=0,statusTurns=3){
  let total=0;const targets=[...livingEnemies()];if(!targets.length)return 0;
  /* v38: an allied all-target attack visually hits every living enemy at the same moment. */
  const fxKind=type==='magic'?'magic':'slash';
  for(const e of targets){fx(fxKind,`enemy:${e.uid}`);pulseEnemy('hit',e.uid);}
  await delay(55);
  for(const e of targets){const r=applyEnemyDamageTo(a,e,power,type,crit,false,false);total+=r.value;if(statusKind&&e.hp>0)applyEnemyStatusTo(e,statusKind,statusChance,statusTurns);await delay(45);}return total;
}
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
function temporaryTechnique(a){const w=String(a.weapon||'');if(w.includes('大剣'))return{name:'大剣・強斬り',cost:4,power:1.14};if(w.includes('太刀'))return{name:'太刀・疾風斬り',cost:4,power:1.12};if(w.includes('槍'))return{name:'槍・貫通突き',cost:4,power:1.10};if(w.includes('銃'))return{name:'ガンラッシュ',cost:4,power:1.10};if(w.includes('杖'))return{name:'スタッフブロウ',cost:3,power:1.06};return{name:'特殊攻撃',cost:3,power:1.08};}
async function performSpecial(a){const t=temporaryTechnique(a);if(a.mpNow<t.cost){notice('MPが足りない！','danger');return false;}a.mpNow-=t.cost;await actionCutin(`${a.name}の${t.name}！`,'system',520);await weaponElementAttackFx(a,{quick:true});applyEnemyDamage(a,t.power,'physical',TEMP_BALANCE.critRate,false);await delay(210);return true;}
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
    case'multiAttack':{const n=rint(u.hits?.[0]||3,u.hits?.[1]||6),multiScale=a.id==='denden'?.82:.90,hitPower=(u.power||1)*multiScale;for(let i=0;i<n&&livingEnemies().length;i++)await hitEnemy(pick(livingEnemies()),hitPower,u.type||'physical');notice(`${n} HIT`,'system',420);break;}
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
  const b=state.battle,e=enemyByUid(enemyId)||actingEnemy()||b.enemy;if(!e||e.hp<=0)return;if(e.escapeRate&&!e.noEscape&&actionIndex===1&&Math.random()<e.escapeRate){await actionCutin(`${e.name}は逃げ出した！`,'system',620);e.hp=0;e.escaped=true;if(b.targetEnemyId===e.uid){const n=livingEnemies()[0];b.targetEnemyId=n?.uid||null;}renderBattle();await delay(220);return;}if(e.status.sleep>0){e.status.sleep--;notice(`${e.name}は眠っている！`,'status');await delay(350);return;}if(e.status.stun>0){e.status.stun--;notice(`${e.name}はひるんで動けない！`,'status');await delay(350);return;}if(e.status.paralyze>0){e.status.paralyze--;notice(`${e.name}はマヒして動けない！`,'status');await delay(350);return;}
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
    else if(kind==='special')consumed=await performSpecial(a);
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
async function performSwitch(payload){if(!payload)return false;const b=state.battle,out=allyById(payload.outId),incoming=allyById(payload.inId);if(!b||!out||!incoming||incoming.dead||incoming.hp<=0||!b.mainIds.includes(out.id))return false;if(!swapGroupMembers(out.id,incoming.id))return false;const entry=currentEntry();if(entry?.type==='ally'&&entry.id===out.id)entry.id=incoming.id;renderBattle();await actionCutin(`CHANGE! ${out.name} → ${incoming.name}`,'system',620);notice('入れ替えでは行動を消費しません','system',520);await delay(120);return false;}
function openSwitchMenu(){const a=activeAlly();if(!a)return;const candidates=[...superAllies(),...reserveAllies()].filter(x=>!x.dead&&x.hp>0);if(!candidates.length)return notice('入れ替え可能なメンバーがいません','danger');const sheet=$('#skillMenu'),list=$('#skillMenuList');sheet.hidden=false;$('#skillMenuKicker').textContent=`${a.name} / 行動消費なし`;$('#skillMenuTitle').textContent='入れ替える';list.innerHTML=`<div class="switch-zone-title super">援護メンバー</div>${superAllies().map(x=>`<button class="skill-item ${x.dead?'disabled':''}" data-switch-in="${x.id}" type="button" ${x.dead?'disabled':''}><span class="ult-thumb"><img src="${versionedPlay(x.image)}" alt=""><i>${x.symbol}</i></span><div><b>${x.name}</b><small>HP ${Math.ceil(x.hp)} / MP ${Math.floor(x.mpNow)}</small></div><em>援護</em></button>`).join('')}<div class="switch-zone-title reserve">RESERVE</div>${reserveAllies().map(x=>`<button class="skill-item ${x.dead?'disabled':''}" data-switch-in="${x.id}" type="button" ${x.dead?'disabled':''}><span class="ult-thumb"><img src="${versionedPlay(x.image)}" alt=""><i>${x.symbol}</i></span><div><b>${x.name}</b><small>HP ${Math.ceil(x.hp)} / MP ${Math.floor(x.mpNow)}</small></div><em>RESERVE</em></button>`).join('')}`;bindImages(list);$$('[data-switch-in]',list).forEach(btn=>btn.onclick=()=>{sheet.hidden=true;act('switch',{outId:a.id,inId:btn.dataset.switchIn});});}

async function autoAct(){const b=state.battle,a=activeAlly();if(!b||!a||!b.auto||b.busy||b.finished)return;const usable=availableUlts(a).filter(u=>a.mpNow>=u.cost);if(usable.length&&Math.random()<.32)return act('ultimate',pick(usable));const s=MOB_DATA.elements[normalizeElement(a.attribute)];if(a.mpNow>=s.cost&&Math.random()<.30)return act('magic');return act('attack');}
function openSkillMenu(type){const a=activeAlly();if(!a)return;const list=$('#skillMenuList');$('#skillMenu').hidden=false;if(type==='magic'){const s=MOB_DATA.elements[normalizeElement(a.attribute)];s.frames?.forEach(src=>preloadAsset(src,'high'));$('#skillMenuKicker').textContent=`${a.name} / MP ${Math.floor(a.mpNow)}`;$('#skillMenuTitle').textContent='魔法';list.innerHTML=`<button class="skill-item" data-use-magic type="button"><span class="skill-symbol">${normalizeElement(a.attribute)}</span><div><b>${s.spell}<em class="temp-badge">仮</em></b><small>${TEMP_BALANCE.magicNote}</small></div><em>MP ${s.cost} 仮</em></button>`;$('[data-use-magic]',list).onclick=()=>{$('#skillMenu').hidden=true;act('magic');};}else if(type==='special'){const t=temporaryTechnique(a);$('#skillMenuKicker').textContent=`${a.name} / MP ${Math.floor(a.mpNow)}`;$('#skillMenuTitle').textContent='特技';list.innerHTML=`<button class="skill-item ${a.mpNow<t.cost?'disabled':''}" data-use-special type="button"><span class="skill-symbol">技</span><div><b>${t.name}<em class="temp-badge">仮</em></b><small>斬撃・打撃・特殊攻撃の正式データが未設定のため、武器種に合わせた仮特技です。</small></div><em>MP ${t.cost} 仮</em></button>`;$('[data-use-special]',list).onclick=()=>{if(a.mpNow<t.cost)return notice('MPが足りない！','danger');$('#skillMenu').hidden=true;act('special');};}else{const unlocked=availableUlts(a);unlocked.forEach(u=>preloadAsset(u.image,'high'));$('#skillMenuKicker').textContent=`${a.name} / Lv${a.level} / MP ${Math.floor(a.mpNow)}`;$('#skillMenuTitle').textContent='必殺技';list.innerHTML=a.ults.map((u,i)=>{const req=i<4?[1,15,30,50][i]:null,ok=unlocked.includes(u);return`<button class="skill-item ${!ok?'locked':''} ${ok&&a.mpNow<u.cost?'disabled':''}" data-ult-index="${i}" type="button" ${!ok?'disabled':''}><span class="ult-thumb"><img src="${u.image}" alt=""><i>必</i></span><div><b>${u.name}</b><small>${u.desc}${!ok?` / Lv${req}で習得`:''}</small></div><em>${ok?`MP ${u.cost} 仮`:`LOCK`}</em></button>`;}).join('');bindImages(list);$$('[data-ult-index]',list).forEach(btn=>btn.onclick=()=>{const u=a.ults[Number(btn.dataset.ultIndex)];if(!availableUlts(a).includes(u))return;if(a.mpNow<u.cost)return notice('MPが足りない！','danger');$('#skillMenu').hidden=true;act('ultimate',u);});}}
function openItemMenu(){const list=$('#skillMenuList');$('#skillMenu').hidden=false;$('#skillMenuKicker').textContent='ITEM';$('#skillMenuTitle').textContent='アイテム';list.innerHTML=`<div class="switch-guide">アイテム効果・所持数・復活アイテムの設定がまだ無いため、現在はコマンド枠のみ実装しています。</div>`;}
function escapeAttempt(){notice('「逃げる」の成功率は未設定です','system',850);}

function persistAdventureVitals(){if(!state.battle)return;state.adventure.vitals={};state.battle.allies.forEach(a=>{state.adventure.vitals[a.id]={hp:Math.max(0,a.hp),mp:Math.max(0,a.mpNow),dead:!!a.dead,status:clone(a.status||{})};});saveAdventure();}
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
  adv.battleIndex=0;adv.areaBuff=null;
  if((adv.areaIndex||0)<3){adv.areaIndex=(adv.areaIndex||0)+1;return;}
  adv.areaIndex=0;
  if((adv.worldIndex||0)<worlds.length-1){adv.worldIndex=(adv.worldIndex||0)+1;return;}
  adv.completed=true;
}
function expToNext(level){level=clamp(Number(level)||1,1,120);return Math.round(42+level*8+Math.pow(level,1.32)*1.8);}
function enemyReward(e){const lv=Math.max(1,Number(e.level)||1),cat=e.category||'normal';let r=cat==='boss'?{exp:Math.round(50+lv*10),coin:Math.round(60+lv*6)}:cat==='elite'?{exp:Math.round(25+lv*7),coin:Math.round(20+lv*4)}:{exp:Math.round(10+lv*4),coin:Math.round(6+lv*2.5)};r.exp=Math.round(r.exp*(e.rewardExpScale||1));r.coin=Math.round(r.coin*(e.rewardCoinScale||1))+(Number(e.coinReward)||0);return r;}
function calcBattleRewards(b){let exp=0,coin=0;for(const e of b?.defeatedEnemies||[]){const r=enemyReward(e);exp+=r.exp;coin+=r.coin;}return{exp,coin};}
function learnedBetween(p,oldLv,newLv){const out=[],req=[1,15,30,50];for(let i=0;i<Math.min(4,p.ults?.length||0);i++)if(oldLv<req[i]&&newLv>=req[i])out.push(p.ults[i].name);return out;}
function applyProgressRewards(b,vitalsObj=null,buff=null){let reward=calcBattleRewards(b);if(buff?.exp)reward.exp=Math.round(reward.exp*(1+buff.exp));if(buff?.gold)reward.coin=Math.round(reward.coin*(1+buff.gold));const changes=[];state.coins+=reward.coin;state.meta.coins=state.coins;if(!state.meta.exp)state.meta.exp={};const cap=playerLevelCap();for(const slot of state.party){const id=slot[0],p=player(id);if(!p)continue;const startLv=slot[1],oldStats=baseStats(p,startLv);let lv=startLv,xp=Math.max(0,Number(state.meta.exp[id])||0)+reward.exp;while(lv<cap&&xp>=expToNext(lv)){xp-=expToNext(lv);lv++;}state.meta.exp[id]=xp;if(lv>startLv){slot[1]=lv;const ns=baseStats(p,lv),learned=learnedBetween(p,startLv,lv);changes.push({id,name:p.name,image:p.image,oldLevel:startLv,newLevel:lv,stats:{HP:ns.maxHp-oldStats.maxHp,MP:ns.maxMp-oldStats.maxMp,ATK:ns.atk-oldStats.atk,MAG:ns.mag-oldStats.mag,DEF:ns.def-oldStats.def,RES:ns.res-oldStats.res,SPD:ns.spd-oldStats.spd},learned});const v=vitalsObj?.[id];if(v&&!v.dead){v.hp=Math.min(ns.maxHp,Math.max(0,Number(v.hp)||0)+(ns.maxHp-oldStats.maxHp));v.mp=Math.min(ns.maxMp,Math.max(0,Number(v.mp)||0)+(ns.maxMp-oldStats.maxMp));}}}saveParty();saveMeta();return{...reward,changes};}
function applyAdventureRewards(b){const out=applyProgressRewards(b,state.adventure.vitals,state.adventure.areaBuff);saveAdventure();return out;}
function applyQuestRewards(b){return applyProgressRewards(b,state.quest?.vitals,null);}
function randomRecordId(){return pick(['36','37','38']);}
function adventureRecordDrops(b){const out=[];if(b?.mode!=='adventure'||b.config?.explorationAmbush)return out;const area=Number(b.config?.storyAreaIndex)||0,isBoss=!!b.config?.bossBattle;if(!isBoss)return out;const chance=area===3?1:.40;if(Math.random()<chance){const id=randomRecordId(),it=itemData(id);addItem(id,1);out.push({id,name:it.name,image:it.image,sub:area===3?'ボス撃破報酬':'中ボス撃破報酬'});}return out;}
function registerDefeatedBosses(b){if(!b?.defeatedEnemies)return;for(const e of b.defeatedEnemies){if(e.category==='boss'&&e.id&&!state.meta.defeatedBosses.includes(e.id))state.meta.defeatedBosses.push(e.id);if(e.category==='elite'&&e.id&&!state.meta.defeatedElites.includes(e.id))state.meta.defeatedElites.push(e.id);}saveMeta();}
function renderResultDrops(drops=[]){const root=$('#resultDrops');root.hidden=!drops.length;root.innerHTML=drops.map(d=>`<div class="result-drop"><img src="${d.image||''}" alt=""><div><b>${d.name}</b><small>${d.sub||''}</small></div></div>`).join('');bindImages(root);}
function renderResultProgression(changes=[]){const root=$('#resultProgression');root.innerHTML='';root.hidden=!changes.length;if(!changes.length)return;for(const c of changes){const statHtml=Object.entries(c.stats).filter(([,v])=>v>0).map(([k,v])=>`<span><b>${k}</b> +${v}</span>`).join('');const learned=c.learned?.length?`<div class="result-learn"><small>習得</small>${c.learned.map(x=>`<b>${x}</b>`).join('')}</div>`:'';root.insertAdjacentHTML('beforeend',`<article class="levelup-card"><div class="levelup-head"><img src="${versionedPlay(c.image)}" alt="${c.name}"><div><small>LEVEL UP</small><b>${c.name}</b><em>Lv${c.oldLevel} → Lv${c.newLevel}</em></div></div><div class="levelup-stats">${statHtml}</div>${learned}</article>`);}bindImages(root);requestAnimationFrame(()=>{[...root.children].forEach((el,i)=>setTimeout(()=>el.classList.add('show'),180+i*170));});}

function finishScriptedBattle(){const b=state.battle;if(!b||b.finished)return;b.finished=true;b.auto=false;$('#autoBtn').classList.remove('active');$('#autoBtn').textContent='AUTO';$('#battleBackBtn').disabled=false;setCommandDisabled(true);notice('3 TURN EVENT END','system',650);setTimeout(()=>{renderAdventure();showScreen('adventure');const r=scriptedBattleResolve;scriptedBattleResolve=null;if(r)r(true);},320);}
function finishBattle(win){
  const b=state.battle;if(!b||b.finished)return;if(b.mode==='story')return finishScriptedBattle();
  b.finished=true;b.resultWin=!!win;b.auto=false;$('#autoBtn').classList.remove('active');$('#autoBtn').textContent='AUTO';setCommandDisabled(true);
  notice(win?'VICTORY!':'DEFEAT...','system',900);
  let reward={exp:0,coin:0,changes:[]},drops=[];
  if(win&&b.mode==='adventure'){
    persistAdventureVitals();reward=applyAdventureRewards(b);registerDefeatedBosses(b);drops=adventureRecordDrops(b);
    if(!b.config?.explorationAmbush){
      if(b.config?.storyPostKey&&!storyDone(b.config.storyPostKey))state.adventure.pendingPostStory={key:b.config.storyPostKey,worldId:b.config.storyWorldId||currentWorld()?.id||'',areaIndex:Number(b.config.storyAreaIndex)||0,bg:b.bg||''};
      advanceAdventureAfterWin();
    }
    saveAdventure();
  }
  if(b.mode==='adventure'&&!win)restoreCampCheckpoint();
  if(b.mode==='quest'){
    persistQuestVitals();
    if(win){reward=applyQuestRewards(b);advanceQuestAfterWin();}
  }
  const summary=battleEnemySummary(b)||'ENEMY';
  $('#resultTitle').textContent=win?'VICTORY':'DEFEAT';
  $('#resultKicker').textContent=b.mode==='adventure'?(b.config?.adventureLabel||`${currentWorld()?.name||'冒険'} BATTLE`):b.mode==='quest'?questTitleText():'TRAINING RESULT';
  $('#resultText').textContent=win?`${summary} を撃破！ / ${b.turn}ターン`:(b.mode==='adventure'?'全員がダウンしました。直前のキャンプ地点のデータへ戻ります。':b.mode==='quest'?'クエスト戦闘に敗北しました。':`${summary} / ${b.turn}ターン目で全員ダウン`);
  const rw=$('#resultRewards');rw.hidden=!((b.mode==='adventure'||b.mode==='quest')&&win);$('#resultExp').textContent=`+${reward.exp.toLocaleString()}`;$('#resultCoin').textContent=`+${reward.coin.toLocaleString()}`;renderResultDrops(drops);renderResultProgression(reward.changes||[]);
  $('#resultRetryBtn').style.display=b.mode==='training'?'block':'none';
  $('#resultSetupBtn').textContent=b.mode==='training'?'トレーニングへ戻る':'NEXT';
  setTimeout(()=>{$('#resultOverlay').hidden=false;},560/state.speed);
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
  /* v36: only AREA 4's boss sends the player HOME. AREA 1-3 mid-bosses continue in Adventure. */
  const returnHomeAfterAreaClear=!!(bossEncounter&&areaIndex===3);
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

function lockMobileGestures(){const editable=el=>['INPUT','SELECT','TEXTAREA'].includes(el?.tagName);document.addEventListener('contextmenu',e=>{if(!editable(e.target))e.preventDefault();},{capture:true});document.addEventListener('dragstart',e=>e.preventDefault(),{capture:true});document.addEventListener('selectstart',e=>{if(!editable(e.target))e.preventDefault();},{capture:true});document.addEventListener('selectionchange',()=>{const a=document.activeElement;if(editable(a))return;const s=window.getSelection?.();if(s&&!s.isCollapsed)s.removeAllRanges();});['gesturestart','gesturechange','gestureend'].forEach(t=>document.addEventListener(t,e=>e.preventDefault(),{passive:false,capture:true}));document.addEventListener('touchmove',e=>{if(e.touches?.length>1)e.preventDefault();},{passive:false,capture:true});let last=0;document.addEventListener('touchend',e=>{const now=Date.now();if(now-last<320)e.preventDefault();last=now;},{passive:false,capture:true});document.addEventListener('dblclick',e=>e.preventDefault(),{passive:false,capture:true});}
function bindEvents(){
  const storyScene=$('#storyScene');if(storyScene){storyScene.addEventListener('pointerup',handleStoryTapAdvance,{passive:false});storyScene.addEventListener('contextmenu',e=>e.preventDefault());}
  $$('[data-home-action]').forEach(b=>b.onclick=()=>openHomeAction(b.dataset.homeAction));$$('[data-back-home]').forEach(b=>b.onclick=()=>{goHome();});
  $('#tavernResetBtn').onclick=()=>{state.party=defaultParty.map(x=>[...x]);state.tavernSwapIndex=null;renderTavern();};$('#savePartyBtn').onclick=async()=>{if(state.party.length<1)return;saveParty();state.training.party=state.party.map(x=>[...x]);toast('パーティーを保存しました');await goHome();};
  $('#trainingBackBtn').onclick=()=>{goHome();};$('#trainingRandomBtn').onclick=randomTraining;$('#allLevelBtn').onclick=()=>{ensureTrainingParty();state.training.party=state.training.party.map(x=>x?[x[0],50]:null);renderTraining();};$('#trainingEnemyAddBtn').onclick=()=>{ensureTrainingEnemies();const i=state.training.enemySlots.findIndex(x=>!x);if(i<0)return toast('敵は最大4体です');state.training.activeEnemySlot=i;renderTraining();};$('#trainingEnemyClearBtn').onclick=()=>{state.training.enemySlots=[null,null,null,null];state.training.activeEnemySlot=0;renderTraining();};$('#startTrainingBattleBtn').onclick=resetTrainingBattle;
  $('#exploreBtn').onclick=exploreField;$('#campBtn').onclick=openCamp;$('#fieldBattleBtn').onclick=startAdventureBattle;
  $('#questBackBtn').onclick=async()=>{if(!state.quest)return setTrainingMode(state.training.mode||'test');const a=await dialog('クエストを中断してトレーニングへ戻りますか？',[['はい','yes','primary'],['いいえ','no']],'QUEST');if(a==='yes')endQuestToTraining();};$('#questExploreBtn').onclick=questExplore;$('#questCampBtn').onclick=questCamp;$('#questBattleBtn').onclick=startQuestBattle;
  $('#battleBackBtn').onclick=()=>{if(!state.battle||state.battle.mode!=='training')return;state.battle.auto=false;renderTraining();showScreen('training');};
  $('#campCloseBtn').onclick=closeCamp;$$('[data-camp-action]').forEach(b=>b.onclick=()=>{const a=b.dataset.campAction;if(a==='tent')useCampTent();else if(a==='chair')useCampChair();else if(a==='party')renderCampPartyMenu();else renderCampDrinks();});
  $('#attackBtn').onclick=()=>act('attack');$('#skillBtn').onclick=()=>openSkillMenu('magic');$('#specialBtn').onclick=()=>openSkillMenu('special');$('#ultimateBtn').onclick=()=>openSkillMenu('ultimate');$('#defendBtn').onclick=()=>act('defend');$('#itemBtn').onclick=openItemMenu;$('#escapeBtn').onclick=escapeAttempt;$('#switchBtn').onclick=openSwitchMenu;$$('[data-close-sheet]').forEach(b=>b.onclick=()=>{$('#skillMenu').hidden=true;});
  $('#autoBtn').onclick=()=>{const b=state.battle;if(!b||b.finished)return;b.auto=!b.auto;$('#autoBtn').classList.toggle('active',b.auto);$('#autoBtn').textContent=b.auto?'AUTO ON':'AUTO';if(b.auto&&!b.busy&&activeAlly())autoAct();};$('#speedBtn').onclick=()=>{const speeds=state.test?.enabled?[1,1.5,2,5]:[1,1.5,2];let i=speeds.indexOf(state.speed);if(i<0)i=0;state.speed=speeds[(i+1)%speeds.length];$('#speedBtn').textContent=`×${state.speed}`;};
  $('#resultRetryBtn').onclick=resetTrainingBattle;$('#resultSetupBtn').onclick=async()=>{if(!state.battle)return;const b=state.battle;$('#resultOverlay').hidden=true;if(b.mode==='adventure'){renderAdventure();showScreen('adventure');if(b.config?.explorationAmbush){if(b.resultWin)completeExplorationUnlock();else{renderAdventure();showScreen('adventure');}return;}if(state.adventure.pendingPostStory)await runPendingPostStory(!!b.config?.returnHomeAfterAreaClear,!!b.config?.returnHomeAfterAreaClear);if(b.config?.returnHomeAfterAreaClear){await goHome();return;}renderAdventure();showScreen('adventure');return;}if(b.mode==='quest'){if(!b.resultWin){if(state.quest?.type==='boss'&&(state.test?.enabled||itemCount('38')>=3)){const a=await dialog('ボスレコードを3枚消費してコンテニューしますか？',[['はい','yes','primary'],['いいえ','no']],'CONTINUE');if(a==='yes'&&(state.test?.enabled||consumeItem('38',3))){state.quest.vitals=freshQuestVitals();renderQuestScreen();showScreen('quest');return;}}endQuestToTraining();return;}if(state.quest?.finished){toast('4 AREA CLEAR！');endQuestToTraining();return;}renderQuestScreen();showScreen('quest');return;}renderTraining();showScreen('training');};
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
