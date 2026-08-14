(() => {
'use strict';

const $=(s,p=document)=>p.querySelector(s);
const $$=(s,p=document)=>[...p.querySelectorAll(s)];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const rint=(a,b)=>Math.floor(a+Math.random()*(b-a+1));
const pct=(n,max)=>max?clamp(n/max*100,0,100):0;
const clone=v=>JSON.parse(JSON.stringify(v));

const screens={home:$('#homeScreen'),loading:$('#loadingScreen'),tavern:$('#tavernScreen'),training:$('#trainingScreen'),adventure:$('#adventureScreen'),battle:$('#battleScreen')};
const defaultParty=[['yusha',30],['pink',30],['desert',30],['nyoro',30],['nekoku',30],['jerry',30],['denden',30],['money',30],['riro',30],['tetsu',30]];
const state={
  party:loadParty(), coins:12500,
  training:{party:null,bossId:'hawk',bossLevel:30,filter:'ALL'},
  adventure:loadAdventure(),
  battle:null, speed:1, tavernSwapIndex:null,
  noticeQueue:[],noticeBusy:false
};

const PASSIVE_RATE_SCALE=.80;
function spriteScale(){return 1;}
function passiveChance(base){return Math.random()<(base*PASSIVE_RATE_SCALE);}

function player(id){return MOB_DATA.players.find(x=>x.id===id);}
function boss(id){return MOB_DATA.bosses.find(x=>x.id===id);}
function normalizeElement(attr){return ['火','水','雷','地','風','光','闇','無'].find(e=>String(attr).includes(e))||'無';}
function delay(ms){return new Promise(r=>setTimeout(r,Math.max(25,ms/state.speed)));}
function fixedDelay(ms){return new Promise(r=>setTimeout(r,ms));}
function showScreen(name){Object.entries(screens).forEach(([k,v])=>v.classList.toggle('active',k===name));}
function toast(text){const el=$('#toast');el.textContent=text;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),1600);}

function saveParty(){try{localStorage.setItem('mobQuestPartyV4',JSON.stringify(state.party.slice(0,10)));}catch(_){} }
function loadParty(){
  try{
    const raw=localStorage.getItem('mobQuestPartyV4')||localStorage.getItem('mobQuestPartyV3')||localStorage.getItem('mobQuestPartyV2');
    const v=JSON.parse(raw);if(Array.isArray(v)&&v.length){const seen=new Set();const clean=v.filter(x=>Array.isArray(x)&&player(x[0])&&!seen.has(x[0])&&(seen.add(x[0])||true)).map(x=>[x[0],clamp(Number(x[1])||1,1,99)]).slice(0,10);if(clean.length)return clean;}
  }catch(_){}
  return defaultParty.map(x=>[...x]);
}
function defaultAdventure(){return {progress:0,battleReady:false,completed:false,vitals:null,checkpoint:null};}
function loadAdventure(){try{const v=JSON.parse(localStorage.getItem('mobQuestAdventureV4'));return v&&typeof v==='object'?{...defaultAdventure(),...v}:defaultAdventure();}catch(_){return defaultAdventure();}}
function saveAdventure(){try{localStorage.setItem('mobQuestAdventureV4',JSON.stringify(state.adventure));}catch(_){} }

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
    const done=async ok=>{
      if(settled)return;settled=true;
      if(ok&&img.decode){try{await img.decode();}catch(_){}}
      resolve(ok);
    };
    img.onload=()=>done(true);
    img.onerror=()=>done(false);
    img.src=src;
    if(img.complete&&img.naturalWidth>0)done(true);
  });
  assetPreloadCache.set(src,task);
  return task;
}
async function preloadAssets(paths,onProgress){
  const unique=[...new Set((paths||[]).filter(Boolean))];
  if(!unique.length){onProgress?.(1,1);return;}
  let done=0;
  await Promise.all(unique.map(async src=>{await preloadAsset(src);done++;onProgress?.(done,unique.length);}));
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
  const ult=MOB_DATA.players.flatMap(p=>(p.ults||[]).map(u=>u.image)).filter(Boolean);
  const magic=Object.values(MOB_DATA.elements).flatMap(e=>e.frames||[]).filter(Boolean);
  const party=state.party.map(([id])=>player(id)?.image).filter(Boolean);
  return [...new Set([...party,...ult,...magic])];
}
function startFastBackgroundWarmup(){
  const queue=fastWarmAssetList();
  let cursor=0;
  const workers=Math.min(6,queue.length);
  const run=async()=>{
    while(cursor<queue.length){
      const src=queue[cursor++];
      try{await preloadAsset(src,'low');}catch(_){}
      await new Promise(r=>setTimeout(r,0));
    }
  };
  for(let i=0;i<workers;i++)run();
}
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
  const common=['icon/01.png','play/02.png','mqicon/06.png','mqicon/09.png','mqicon/10.png','mqicon/12.png'];
  if(target==='tavern')return [...common,'back2/001.png',...party.map(p=>p.image)];
  if(target==='training')return [...common,'back2/002.png',...party.map(p=>p.image),boss(state.training.bossId)?.image];
  if(target==='adventure'){
    const area=MOB_DATA.adventure.areas[Math.min(state.adventure.progress,3)];
    return [...common,area?.bg,area?.fallback,'mqicon/14.png','mqicon/15.png','mqicon/16.png',...party.slice(0,6).map(p=>p.image)];
  }
  return common;
}
function battleAssets(config){
  const partyList=(config.party||state.party).slice(0,6);
  const chars=partyList.map(([id])=>player(id)).filter(Boolean);
  const e=config.enemy||boss(config.bossId);
  return [
    e?.image,e?.bg,e?.fallbackBg,
    'icon/02.png','icon/03.png','icon/04.png','icon/05.png','icon/06.png','icon/07.png','icon/08.png',
    ...chars.map(c=>c.image)
  ];
}
async function loadingWithAssets(text,assets){
  showScreen('loading');
  $('#loadingText').textContent=text;
  $('#loadingBar').style.width='0%';
  const detail=$('#loadingDetail');
  if(detail)detail.textContent='0%';
  await preloadAssets(assets,(done,total)=>{
    const per=Math.round(done/Math.max(1,total)*100);
    $('#loadingBar').style.width=`${per}%`;
    if(detail)detail.textContent=`${done} / ${total}　${per}%`;
  });
  $('#loadingBar').style.width='100%';
  if(detail)detail.textContent='READY';
  await fixedDelay(180);
}

function commonNavMarkup(){return `<button data-nav="home" type="button"><span><img src="mqicon/06.png" alt=""><i>⌂</i></span><b>HOME</b></button><button data-nav="equipment" type="button"><span><img src="mqicon/10.png" alt=""><i>◇</i></span><b>装備</b></button><button data-nav="items" type="button"><span><img src="mqicon/12.png" alt=""><i>□</i></span><b>持ち物</b></button><button data-nav="settings" type="button"><span><img src="mqicon/09.png" alt=""><i>⚙</i></span><b>設定</b></button>`;}
function initCommonNav(){$$('[data-common-nav]').forEach(n=>n.innerHTML=commonNavMarkup());$$('[data-nav]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.nav==='home'){renderHome();showScreen('home');}else toast(`${b.textContent.trim()}は仕様待ちです`);}));bindImages();}

async function dialog(text,choices=[['OK','ok']],speaker='モブピンク'){
  const overlay=$('#dialogOverlay');$('#dialogSpeaker').textContent=speaker;$('#dialogText').textContent=text;$('#dialogChoices').innerHTML=choices.map(([label,val,cls=''])=>`<button type="button" data-dialog-value="${val}" class="${cls}">${label}</button>`).join('');overlay.hidden=false;
  return new Promise(resolve=>{$$('[data-dialog-value]',overlay).forEach(btn=>btn.onclick=()=>{overlay.hidden=true;resolve(btn.dataset.dialogValue);});});
}
async function travelTo(target,text,after){await loadingWithAssets(text,pageAssets(target));if(after)after();showScreen(target);}

function renderHome(){
  $('#coinValue').textContent=state.coins.toLocaleString();
  $('#homeParty').innerHTML=state.party.slice(0,4).map(([id,lv],i)=>{const p=player(id);return p?`<div class="home-member slot-${i}"><div class="home-sprite"><img src="${p.image}" alt="${p.name}"><span>${p.symbol}</span></div><small>${p.name}</small><b>Lv${lv}</b></div>`:'';}).join('');bindImages($('#homeParty'));
}

function zoneForIndex(i){return i<4?{key:'MAIN',label:'戦闘メンバー',n:i+1,cls:'main-slot'}:i<6?{key:'SUPER SUB',label:'自動支援',n:i-3,cls:'super-slot'}:{key:'RESERVE',label:'控えメンバー',n:i-5,cls:'reserve-slot'};}
function rosterCard(p,selected,level){return `<button class="roster-card ${selected?'selected':''}" data-roster-id="${p.id}" type="button"><span class="roster-art"><img src="${p.image}" alt="${p.name}"><i>${p.symbol}</i></span><b>${p.name}</b><small>${p.attribute} / ${p.weapon}</small><em>Lv${level}</em></button>`;}
function renderTavern(){
  const levels=new Map(state.party.map(([id,lv])=>[id,lv]));
  const m=Math.min(4,state.party.length),s=Math.max(0,Math.min(2,state.party.length-4)),r=Math.max(0,state.party.length-6);
  $('#tavernPartyCount').textContent=`MAIN ${m}/4・SUPER ${s}/2・控え ${r}/4`;
  $('#tavernSlots').innerHTML=Array.from({length:10},(_,i)=>{const slot=state.party[i],z=zoneForIndex(i);const prefix=`<div class="formation-zone-label ${i===0?'first':''} ${i===4?'super-start':''} ${i===6?'reserve-start':''}"><b>${z.key}</b><span>${z.label} ${z.n}</span></div>`;if(!slot)return`${prefix}<div class="tavern-slot empty ${z.cls}"><b>EMPTY</b><small>${z.label}を選択</small></div>`;const p=player(slot[0]);const selected=state.tavernSwapIndex===i;return`${prefix}<div class="tavern-slot ${z.cls} ${selected?'swap-selected':''}"><span><img src="${p.image}" alt="${p.name}"><i>${p.symbol}</i></span><div><b>${p.name}</b><small>${p.attribute} / ${p.role}</small></div><label>Lv<input class="tavern-level" data-id="${p.id}" type="number" min="1" max="99" inputmode="numeric" value="${slot[1]}"></label><div class="slot-actions"><button data-swap-slot="${i}" type="button">↕</button><button data-remove-member="${p.id}" type="button">×</button></div></div>`;}).join('');
  $('#rosterGrid').innerHTML=MOB_DATA.players.map(p=>rosterCard(p,state.party.some(x=>x[0]===p.id),levels.get(p.id)||30)).join('');bindImages($('#tavernScreen'));
  $$('.tavern-level').forEach(i=>i.onchange=()=>{const x=state.party.find(v=>v[0]===i.dataset.id);if(x)x[1]=clamp(Number(i.value)||1,1,99);});
  $$('[data-remove-member]').forEach(b=>b.onclick=()=>{if(state.party.length<=1)return toast('最低1人は必要です');state.party=state.party.filter(x=>x[0]!==b.dataset.removeMember);state.tavernSwapIndex=null;renderTavern();});
  $$('[data-swap-slot]').forEach(b=>b.onclick=()=>{const idx=Number(b.dataset.swapSlot);if(state.tavernSwapIndex===null){state.tavernSwapIndex=idx;toast('入れ替えるもう1人を選んでください');return renderTavern();}if(state.tavernSwapIndex===idx){state.tavernSwapIndex=null;return renderTavern();}const a=state.tavernSwapIndex;if(state.party[a]&&state.party[idx])[state.party[a],state.party[idx]]=[state.party[idx],state.party[a]];state.tavernSwapIndex=null;renderTavern();});
  $$('[data-roster-id]').forEach(b=>b.onclick=()=>{const id=b.dataset.rosterId;const idx=state.party.findIndex(x=>x[0]===id);if(idx>=0){if(state.party.length<=1)return toast('最低1人は必要です');state.party.splice(idx,1);}else{if(state.party.length>=10)return toast('MAIN4＋SUPER2＋控え4で最大10人です');state.party.push([id,30]);}state.tavernSwapIndex=null;renderTavern();});
}

function ensureTrainingParty(){if(!state.training.party)state.training.party=state.party.map(x=>[...x]);const seen=new Set();state.training.party=state.training.party.filter(x=>player(x[0])&&!seen.has(x[0])&&(seen.add(x[0])||true)).slice(0,10);for(const p of MOB_DATA.players){if(state.training.party.length>=10)break;if(!seen.has(p.id)){state.training.party.push([p.id,30]);seen.add(p.id);}}return state.training.party;}
function trainingParty(){return ensureTrainingParty();}
function renderTraining(){
  ensureTrainingParty();
  $('#trainingPartySetup').innerHTML=state.training.party.map(([id,lv],i)=>{const p=player(id),z=zoneForIndex(i),start=i===0||i===4||i===6;return`${start?`<div class="training-zone-title ${i===4?'super':i===6?'reserve':''}"><b>${z.key}</b><small>${i<4?'戦闘開始メンバー':i<6?'2～5ターンごとに自動行動':'待機メンバー'}</small></div>`:''}<div class="training-slot ${z.cls}"><span><img src="${p.image}" alt="${p.name}"><i>${p.symbol}</i></span><div class="training-slot-info"><small>${z.key} ${z.n}</small><select data-training-member="${i}">${MOB_DATA.players.map(q=>`<option value="${q.id}" ${q.id===id?'selected':''}>${q.name} / ${q.attribute}</option>`).join('')}</select></div><label>Lv<input data-training-level="${i}" type="number" min="1" max="99" inputmode="numeric" value="${lv}"></label></div>`;}).join('');
  const stages=['ALL',...new Set(MOB_DATA.bosses.map(b=>b.stage))];$('#bossTabs').innerHTML=stages.map(s=>`<button class="boss-tab ${state.training.filter===s?'active':''}" data-boss-stage="${s}" type="button">${s==='ALL'?'全て':s}</button>`).join('');const list=state.training.filter==='ALL'?MOB_DATA.bosses:MOB_DATA.bosses.filter(b=>b.stage===state.training.filter);$('#bossCountLabel').textContent=`${MOB_DATA.bosses.length} BOSS`;$('#bossGrid').innerHTML=list.map(b=>`<button class="boss-choice ${b.id===state.training.bossId?'selected':''}" data-boss-id="${b.id}" type="button"><span><img src="${b.image}" alt="${b.name}"><i>${b.symbol}</i></span><div><b>${b.name}</b><small>${b.stage} / ${b.attribute}</small><em>${b.special}</em></div></button>`).join('');$('#bossLevel').value=state.training.bossLevel;$('#bossLevelValue').textContent=state.training.bossLevel;renderSelectedBoss();bindImages($('#trainingScreen'));
  $$('[data-training-member]').forEach(sel=>sel.onchange=()=>{const i=Number(sel.dataset.trainingMember),nextId=sel.value,other=state.training.party.findIndex((x,j)=>j!==i&&x[0]===nextId);if(other>=0){const currentId=state.training.party[i][0];state.training.party[i][0]=nextId;state.training.party[other][0]=currentId;}else{state.training.party[i][0]=nextId;}renderTraining();});$$('[data-training-level]').forEach(i=>i.onchange=()=>{state.training.party[Number(i.dataset.trainingLevel)][1]=clamp(Number(i.value)||1,1,99);});$$('[data-boss-stage]').forEach(b=>b.onclick=()=>{state.training.filter=b.dataset.bossStage;renderTraining();});$$('[data-boss-id]').forEach(b=>b.onclick=()=>{state.training.bossId=b.dataset.bossId;renderTraining();});
}
function renderSelectedBoss(){const b=boss(state.training.bossId)||MOB_DATA.bosses[0];$('#selectedBossMini').innerHTML=`<b>${b.name}</b><small>${b.stage} / ${b.attribute} / Lv${state.training.bossLevel}　※能力値は仮</small>`;}

function renderAdventure(){const adv=MOB_DATA.adventure,prog=state.adventure.progress,area=adv.areas[Math.min(prog,3)];$('#adventureStageTitle').textContent=adv.name;$('#adventureProgress').textContent=state.adventure.completed?'CLEAR':`戦闘 ${prog}/4`;$('#areaName').textContent=area.name;$('#areaDescription').textContent=state.adventure.completed?'モブホークを倒した！草原の探索は完了しています。':state.adventure.battleReady?(prog===3?'ボスが待ち構えている！':'モンスターを発見した！バトルが可能です。'):'まずはじっくり探索してみましょう！';setImage($('#adventureBg'),area.bg,area.fallback);$('#adventureParty').innerHTML=state.party.slice(0,4).map(([id,lv])=>{const p=player(id);return`<div><img src="${p.image}" alt="${p.name}"><span>${p.symbol}</span><small>Lv${lv}</small></div>`;}).join('');const btn=$('#fieldBattleBtn');btn.disabled=!state.adventure.battleReady||state.adventure.completed;btn.classList.toggle('locked',btn.disabled);$('#fieldBattleHint').textContent=state.adventure.completed?'CLEAR':state.adventure.battleReady?(prog===3?'BOSS':'戦闘可能'):'探索が必要';$('#exploreBtn').disabled=state.adventure.battleReady||state.adventure.completed;bindImages($('#adventureScreen'));}
async function exploreField(){if(state.adventure.completed)return;const adv=MOB_DATA.adventure,prog=state.adventure.progress,area=adv.areas[Math.min(prog,3)];$('#fieldEvent').hidden=false;$('#fieldEvent').innerHTML=`<b>探索中...</b><small>${area.name}</small>`;await delay(500);$('#fieldEvent').innerHTML=`<b>${prog===3?'BOSS ENCOUNTER':'ENCOUNTER'}</b><p>${area.explore}</p>`;state.adventure.battleReady=true;saveAdventure();renderAdventure();await delay(750);$('#fieldEvent').hidden=true;}
function saveCampCheckpoint(){state.adventure.vitals=null;state.adventure.checkpoint={progress:state.adventure.progress,battleReady:false,completed:state.adventure.completed,vitals:null,coins:state.coins,party:clone(state.party)};saveAdventure();saveParty();toast('キャンプで全回復し、状況を保存しました');}
function restoreCampCheckpoint(){const cp=state.adventure.checkpoint;if(cp){state.adventure.progress=cp.progress;state.adventure.battleReady=cp.battleReady;state.adventure.completed=cp.completed;state.adventure.vitals=clone(cp.vitals);state.coins=cp.coins;if(Array.isArray(cp.party)){state.party=clone(cp.party);saveParty();}}else{state.adventure={...defaultAdventure(),checkpoint:null};}saveAdventure();}

function baseStats(p,lv){const g=TEMP_BALANCE.playerGrowth[p.id],b=TEMP_BALANCE.base;return{maxHp:Math.round(b.hp+g.hp*lv),maxMp:Math.round(b.mp+g.mp*lv),atk:Math.round(b.atk+g.atk*lv),mag:Math.round(b.mag+g.mag*lv),def:Math.round(b.def+g.def*lv),res:Math.round(b.res+g.res*lv),spd:Math.round(b.spd+g.spd*lv)};}
function buildAlly(p,lv,vital){const s=baseStats(p,lv),hp=vital?clamp(vital.hp,0,s.maxHp):s.maxHp;return{...p,level:lv,...s,hp,mpNow:vital?clamp(vital.mp,0,s.maxMp):s.maxMp,dead:hp<=0,guard:0,guardTurns:0,barrier:0,atkBuff:0,atkBuffTurns:0,defBuff:0,defBuffTurns:0,spdBuff:0,spdBuffTurns:0,allBuff:0,allBuffTurns:0,damageCut:0,damageCutTurns:0,status:{poison:0,burn:0,sleep:0,stun:0,paralyze:0},pinkReviveUsed:false,lilithReviveUsed:false,transformed:false,narakuStacks:0,nextSupportTurn:rint(2,5)};}
function buildBossEnemy(b,lv,size){const t=TEMP_BALANCE.enemy,maxHp=Math.round(t.hpBase+lv*t.hpPerLevel+size*t.hpPerMember);return{...b,isBoss:true,level:lv,maxHp,hp:maxHp,atk:Math.round(t.atkBase+lv*t.atkPerLevel),mag:Math.round(t.magBase+lv*t.magPerLevel),def:Math.round(t.defBase+lv*t.defPerLevel),res:Math.round(t.resBase+lv*t.resPerLevel),spd:Math.round(t.spdBase+lv*t.spdPerLevel),damageReduction:0,shieldTurns:0,atkBuff:0,atkBuffTurns:0,defDebuff:0,defDebuffTurns:0,spdDebuff:0,spdDebuffTurns:0,status:{poison:0,burn:0,sleep:0,stun:0,paralyze:0}};}
function buildNormalEnemy(raw,lv,size,bg){const t=TEMP_BALANCE.normalEnemy,maxHp=Math.round(t.hpBase+lv*t.hpPerLevel+size*t.hpPerMember);return{...raw,id:'grassEnemy',image:'',isBoss:false,level:lv,maxHp,hp:maxHp,atk:Math.round(t.atkBase+lv*t.atkPerLevel),mag:Math.round(t.magBase+lv*t.magPerLevel),def:Math.round(t.defBase+lv*t.defPerLevel),res:Math.round(t.resBase+lv*t.resPerLevel),spd:Math.round(t.spdBase+lv*t.spdPerLevel),special:'草原ラッシュ',kind:'single',bg,fallbackBg:'back/sougen.png',status:{poison:0,burn:0,sleep:0,stun:0,paralyze:0},shieldTurns:0,atkBuffTurns:0,defDebuffTurns:0,spdDebuffTurns:0};}

function beginBattle(config){
  const partyList=(config.party||state.party).slice(0,10),vitals=config.useAdventureVitals?state.adventure.vitals:null,allies=partyList.map(([id,lv])=>buildAlly(player(id),lv,vitals?.[id])),enemy=config.enemy||buildBossEnemy(boss(config.bossId),config.bossLevel||30,Math.min(4,allies.length));
  state.battle={mode:config.mode||'training',returnScreen:config.returnScreen||'training',allies,mainIds:allies.slice(0,4).map(a=>a.id),superIds:allies.slice(4,6).map(a=>a.id),reserveIds:allies.slice(6,10).map(a=>a.id),enemy,turn:1,queue:[],queuePos:0,busy:false,auto:false,finished:false,teamGuard:0,teamGuardTurns:0,yushaGuard:0,yushaGuardTurns:0,config};
  state.noticeQueue=[];state.noticeBusy=false;setImage($('#battleBg'),enemy.bg||'back/sougen4.png',enemy.fallbackBg||'back/rpgmain.png');$('#battleModeLabel').textContent=config.mode==='adventure'?(enemy.isBoss?'BOSS BATTLE':'FIELD BATTLE'):'TRAINING';$('#resultOverlay').hidden=true;$('#skillMenu').hidden=true;$('#autoBtn').classList.remove('active');$('#autoBtn').textContent='AUTO';renderBattle();showScreen('battle');setTimeout(()=>notice(`${enemy.name}が現れた！`,'danger',760),120);startRound();
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
function currentEntry(){return state.battle?.queue[state.battle.queuePos]||null;}
function activeAlly(){const e=currentEntry();return e?.type==='ally'?allyById(e.id):null;}
function availableUlts(a){return a.ults.filter((u,i)=>i<4?a.level>=[1,15,30,50][i]:a.id==='yusha');}
function effective(stat,obj){let v=obj[stat];if(obj.allBuffTurns>0)v*=1+obj.allBuff;if(stat==='atk'&&obj.atkBuffTurns>0)v*=1+obj.atkBuff;if(stat==='def'&&obj.defBuffTurns>0)v*=1+obj.defBuff;if(stat==='spd'&&obj.spdBuffTurns>0)v*=1+obj.spdBuff;return v;}

function enemyMarkup(e){const tags=[];for(const[k,l]of[['poison','毒'],['burn','やけど'],['sleep','眠り'],['stun','ひるみ'],['paralyze','マヒ']])if(e.status[k]>0)tags.push(l);if(e.shieldTurns>0)tags.push('SHIELD');if(e.defDebuffTurns>0)tags.push('DEF↓↓');if(e.spdDebuffTurns>0)tags.push('SPD↓↓');return`<div class="enemy-nameplate"><div><b>${e.name}</b><small>Lv${e.level} / ${e.attribute} <em class="temp-badge">能力値 仮</em></small></div><div class="gauge"><i class="hp" style="width:${pct(e.hp,e.maxHp)}%"></i></div><p><span>HP</span><b>${Math.ceil(e.hp).toLocaleString()} / ${e.maxHp.toLocaleString()}</b></p><div class="enemy-tags">${tags.map(t=>`<em>${t}</em>`).join('')}</div></div><div class="enemy-sprite-wrap">${e.image?`<img id="enemySprite" src="${e.image}" alt="${e.name}">`:''}<div class="enemy-symbol ${e.image?'fallback-only':''}">${e.symbol||'敵'}</div></div>`;}
function statusText(a){return Object.entries(a.status).filter(([,v])=>v>0).map(([k])=>({poison:'毒',burn:'炎',sleep:'眠',stun:'怯',paralyze:'麻'}[k])).join(' ');}
function allyMarkup(a){const st=statusText(a);return`<button type="button" class="ally-hud-card ${a.dead?'dead':''} ${activeAlly()===a?'active turn-active':''}" data-ally-id="${a.id}"><span class="ally-hud-art"><img src="${a.image}" alt="${a.name}"><i>${a.symbol}</i>${st?`<em class="ally-status-mark">${st}</em>`:''}</span><div class="ally-title-line"><b>${a.name}</b><em>${a.dead?'DOWN':`Lv${a.level}`}</em></div><div class="ally-hud-line"><span>HP ${Math.ceil(a.hp)}/${a.maxHp}</span><span>MP ${Math.floor(a.mpNow)}/${a.maxMp}</span></div><div class="ally-gauges"><div class="gauge tiny"><i class="hp" style="width:${pct(a.hp,a.maxHp)}%"></i></div><div class="gauge tiny"><i class="mp" style="width:${pct(a.mpNow,a.maxMp)}%"></i></div></div></button>`;}
function superMarkup(a){const next=Math.max(0,a.nextSupportTurn-state.battle.turn);return`<div class="super-chip ${a.dead?'dead':''}" data-ally-id="${a.id}"><span><img src="${a.image}" alt="${a.name}"><i>${a.symbol}</i></span><div><b>${a.name}</b><small>${a.dead?'DOWN':`HP ${Math.ceil(a.hp)} / MP ${Math.floor(a.mpNow)}`}</small></div><em>${a.dead?'—':next===0?'READY':`+${next}T`}</em></div>`;}
function benchMarkup(a){return`<div class="bench-chip ${a.dead?'dead':''}" data-ally-id="${a.id}"><span><img src="${a.image}" alt="${a.name}"><i>${a.symbol}</i></span><div><b>${a.name}</b><small>${a.dead?'DOWN':`HP ${Math.ceil(a.hp)} / MP ${Math.floor(a.mpNow)}`}</small><div class="gauge tiny"><i class="hp" style="width:${pct(a.hp,a.maxHp)}%"></i></div></div></div>`;}
function renderBattle(){const b=state.battle;if(!b)return;$('#battleTurnLabel').textContent='';$('#enemyArea').innerHTML=enemyMarkup(b.enemy);$('#allyStatus').innerHTML=mainAllies().map(allyMarkup).join('');$('#superStatus').innerHTML=superAllies().length?superAllies().map(superMarkup).join(''):`<div class="no-bench">援護なし</div>`;$('#benchStatus').innerHTML=reserveAllies().length?reserveAllies().map(benchMarkup).join(''):`<div class="no-bench">控えなし</div>`;const e=currentEntry(),a=activeAlly();$('#activeActorBar').innerHTML=a?`<img src="${a.image}" alt=""><div><small>COMMAND / SPD ${Math.round(effective('spd',a))}</small><b>${a.name}</b><span>HP ${Math.ceil(a.hp)} / MP ${Math.floor(a.mpNow)}</span></div>`:e?.type==='super'?`<div><small>AUTO ACTION</small><b>${allyById(e.id)?.name||''}</b></div>`:`<div><small>WAIT</small><b>${b.enemy.name}</b></div>`;bindImages($('#battleScreen'));setCommandDisabled(b.busy||b.finished||!a);}
function setCommandDisabled(dis){['attackBtn','skillBtn','ultimateBtn','defendBtn','itemBtn','escapeBtn','switchBtn'].forEach(id=>{const el=$('#'+id);if(el)el.disabled=dis;});}

function notice(text,tone='system',duration=650){if(!state.battle||state.battle.finished&&tone!=='system')return;state.noticeQueue.push({text,tone,duration});pumpNotice();}
async function pumpNotice(){if(state.noticeBusy)return;state.noticeBusy=true;const el=$('#centerMessage');while(state.noticeQueue.length){const n=state.noticeQueue.shift();el.textContent=n.text;el.dataset.tone=n.tone;el.classList.remove('play');void el.offsetWidth;el.classList.add('play');await delay(n.duration);el.classList.remove('play');await delay(60);}state.noticeBusy=false;}
function fieldPointFromRect(r,x=.5,y=.5){const field=$('#battleScreen');if(!field||!r)return{left:'50%',top:'50%'};const fr=field.getBoundingClientRect();return{left:`${((r.left-fr.left)+r.width*x)/fr.width*100}%`,top:`${((r.top-fr.top)+r.height*y)/fr.height*100}%`};}
function enemyTargetPoint(){const el=$('#enemySprite')||$('.enemy-symbol');return el?fieldPointFromRect(el.getBoundingClientRect(),.5,.70):{left:'50%',top:'56%'};}
function allyTargetPoint(id){const root=$(`[data-ally-id="${id}"]`)||null;if(!root)return{left:'50%',top:'118%'};return fieldPointFromRect(root.getBoundingClientRect(),.5,.08);}
function positionEffect(el,target='enemy'){const p=(target==='enemy'||!target)?enemyTargetPoint():allyTargetPoint(target);el.style.left=p.left;el.style.top=p.top;}
function pulseAllyDamage(id){const el=$(`[data-ally-id="${id}"]`);if(!el)return;el.classList.remove('damage-flash','hud-shake');void el.offsetWidth;el.classList.add('damage-flash','hud-shake');}
async function actionCutin(text,tone='system',duration=500){const el=$('#actionBanner');if(!el){notice(text,tone,duration);await delay(Math.min(duration,520));return;}el.textContent=text;el.dataset.tone=tone;const n=[...text].length;el.style.fontSize=n>=22?'12px':n>=18?'13px':n>=15?'14px':n>=12?'16px':'18px';el.classList.remove('play');void el.offsetWidth;el.classList.add('play');await delay(duration);el.classList.remove('play');await delay(55);}
async function passiveCutin(a,text,duration=620){
  const wrap=$('#passiveCutin'),img=$('#passiveCutinCharacter'),label=$('#passiveCutinText');
  if(!wrap||!a){notice(text,'system',duration);await fixedDelay(duration);return;}
  await preloadAsset(a.transformed&&a.id==='yusha'?'play/13.png':a.image);
  setImage(img,a.transformed&&a.id==='yusha'?'play/13.png':a.image,'');
  label.textContent=text;
  wrap.hidden=false;wrap.classList.remove('play');void wrap.offsetWidth;wrap.classList.add('play');
  await fixedDelay(duration);
  wrap.classList.remove('play');wrap.hidden=true;
}
async function passiveBeat(a,text,duration=620){await fixedDelay(600);await passiveCutin(a,text,duration);}
function floatNumber(value,kind='damage',target='enemy'){const el=document.createElement('div');el.className=`float-number ${kind}`;el.textContent=(kind==='heal'?'+':'')+Math.round(value);positionEffect(el,target);$('#battleFxLayer').appendChild(el);setTimeout(()=>el.remove(),850/state.speed);}
function clearEnemyImpact(){
  const el=$('#enemySprite')||$('.enemy-symbol');
  if(!el)return;
  el.classList.remove('enemy-hit','enemy-cast','enemy-damage-impact');
  el.style.filter='';
}
function pulseEnemy(cls='hit'){
  const el=$('#enemySprite')||$('.enemy-symbol');
  if(!el)return;
  el.classList.remove('enemy-hit','enemy-cast','enemy-advance','enemy-damage-impact');
  el.style.filter='';
  void el.offsetWidth;
  const className=cls==='cast'?'enemy-cast':cls==='advance'?'enemy-advance':'enemy-damage-impact';
  el.classList.add(className);
  if(cls!=='advance'){
    const cleanup=()=>{if(el.isConnected){el.classList.remove(className);el.style.filter='';}};
    el.addEventListener('animationend',cleanup,{once:true});
    setTimeout(cleanup,520);
  }
}
async function beginEnemyLunge(){
  const screen=$('#battleScreen');
  if(screen)screen.classList.add('enemy-attacking');
  pulseEnemy('advance');
  await fixedDelay(520);
}
function endEnemyLunge(){const screen=$('#battleScreen');if(screen)screen.classList.remove('enemy-attacking');}
function fx(type='slash',target='enemy'){const el=document.createElement('div');el.className=`simple-fx ${type}`;positionEffect(el,target);$('#battleFxLayer').appendChild(el);setTimeout(()=>el.remove(),650/state.speed);}
async function skillSprite(frames,target='enemy'){
  if(!frames?.length){fx('magic',target);return;}
  frames.forEach(src=>preloadAsset(src,'high'));
  const wrap=$('#skillSpriteFx'),img=$('img',wrap);
  positionEffect(wrap,target);
  wrap.hidden=false;wrap.style.display='block';wrap.style.opacity='1';
  try{
    for(const src of frames){
      img.classList.remove('asset-missing');
      await ensureDomImageReady(img,src,380);
      wrap.style.opacity='1';
      await new Promise(requestAnimationFrame);
      await fixedDelay(92);
    }
    await fixedDelay(55);
  }finally{
    wrap.style.opacity='0';wrap.hidden=true;wrap.style.display='none';
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
async function ultimateCutin(a,u){
  const wrap=$('#ultimateCutin');
  if(!wrap)return;
  const banner=$('.cutin-character',wrap),art=$('.ult-art-wrap',wrap),name=$('#cutinName');
  const artImg=$('#cutinUltArt'),charImg=$('#cutinCharacter');
  const neon=$('.ult-neon-trace',wrap);
  const charSrc=a.transformed&&a.id==='yusha'?'play/13.png':a.image;

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

    if(charImg){charImg.classList.remove('asset-missing');charImg.src=charSrc;}
    if(artImg){artImg.classList.remove('asset-missing');artImg.src=u.image;}
    await Promise.all([
      ensureDomImageReady(charImg,charSrc,700),
      ensureDomImageReady(artImg,u.image,700)
    ]);

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
    await ultimateImpactFx();
  }catch(err){
    console.error('[MOB QUEST] ultimateCutin recovered:',err);
    hardHide();
  }finally{
    hardHide();
  }
}

function enemyDefense(type){const e=state.battle.enemy;let v=type==='magic'?e.res:e.def;if(e.defDebuffTurns>0)v*=1-e.defDebuff;return v;}
function calcDamage(attacker,type,power,crit=0){const source=type==='magic'?effective('mag',attacker):effective('atk',attacker),def=enemyDefense(type);let d=Math.max(1,source*power-def*.34)*(.91+Math.random()*.18);const c=Math.random()<Math.max(TEMP_BALANCE.critRate,crit||0);if(c)d*=TEMP_BALANCE.critPower;return{value:Math.round(d),crit:c};}
function calcEnemyDamage(target,power,type='physical'){const e=state.battle.enemy,source=(type==='magic'?e.mag:e.atk)*(e.atkBuffTurns>0?1+e.atkBuff:1),def=type==='magic'?effective('res',target):effective('def',target);return Math.max(1,Math.round((source*power-def*.32)*(.9+Math.random()*.2)));}
function wakeEnemyOnHit(){const e=state.battle.enemy;if(e.status.sleep>0&&Math.random()<.70){e.status.sleep=0;notice(`${e.name}は眠りから覚めた！`,'status');}}
function applyEnemyDamage(a,power,type='physical',crit=0){
  const e=state.battle.enemy,r=calcDamage(a,type,power,crit);
  let d=r.value;
  if(e.shieldTurns>0)d=Math.round(d*(1-(e.damageReduction||.2)));
  e.hp=Math.max(0,e.hp-d);
  // Rebuild first, then animate the NEW enemy DOM so the flash/shake is not erased.
  renderBattle();
  floatNumber(d,r.crit?'crit':'damage','enemy');
  fx(type==='magic'?'magic':'slash','enemy');
  pulseEnemy('hit');
  wakeEnemyOnHit();
  return{...r,value:d};
}
function heal(a,amount){if(a.dead)return 0;const before=a.hp;a.hp=Math.min(a.maxHp,a.hp+amount);const h=Math.round(a.hp-before);if(h>0)floatNumber(h,'heal',a.id);return h;}
function healField(ratio){let total=0;livingField().forEach(a=>total+=heal(a,a.maxHp*ratio));renderBattle();return total;}
function restoreMpField(ratio){livingField().forEach(a=>a.mpNow=Math.min(a.maxMp,a.mpNow+a.maxMp*ratio));renderBattle();}
function cleanse(a){Object.keys(a.status).forEach(k=>a.status[k]=0);}
function applyBossStatus(kind,chance,turns=3){const e=state.battle.enemy;let c=chance;if(e.isBoss&&(kind==='paralyze'||kind==='sleep'))c*=.25;if(Math.random()>=c)return false;e.status[kind]=Math.max(e.status[kind],e.isBoss?rint(1,2):turns);return true;}

async function checkSpecialRevives(){const field=fieldAllies(),pink=field.find(a=>a.id==='pink'&&!a.dead&&!a.pinkReviveUsed);for(const a of field){if(a.dead&&a.id==='lilith'&&!a.lilithReviveUsed){await passiveBeat(a,'ウルモブリリス！');a.dead=false;a.lilithReviveUsed=true;a.transformed=true;a.hp=Math.round(a.maxHp*.60);a.atk*=1.2;a.mag*=1.2;a.def*=1.2;a.res*=1.2;a.spd*=1.2;renderBattle();notice('モブリリスが復活！','heal',650);await fixedDelay(600);}else if(a.dead&&pink&&!pink.pinkReviveUsed&&a.id!=='pink'){await passiveBeat(pink,'支える力！');pink.pinkReviveUsed=true;pink.hp=Math.max(1,Math.floor(pink.hp*.5));a.dead=false;a.hp=Math.round(a.maxHp*.35);renderBattle();notice(`${a.name}が復活！`,'heal',650);await fixedDelay(600);break;}}}
async function maybeArtistCleanse(target){const riro=livingField().find(a=>a.id==='riro');if(riro&&target&&passiveChance(.50)){await passiveBeat(riro,'アーティスト・マインド！');cleanse(target);notice(`${target.name}の状態異常を解除！`,'status');await fixedDelay(600);return true;}return false;}
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
  const desert=livingField().find(x=>x.id==='desert');if(desert&&passiveChance(.20)){await passiveBeat(desert,'サバクノマモリビト！');d=Math.round(d*.8);await fixedDelay(600);}
  a.hp=Math.max(0,a.hp-d);
  if(a.hp<=0)a.dead=true;
  renderBattle();
  pulseAllyDamage(a.id);
  floatNumber(d,'damage',a.id);
  fx(type==='magic'?'magic':'enemy',a.id);
  if(a.dead)notice(`${a.name} DOWN`,'danger',850);
  return d;
}
async function inflictAllyStatus(a,kind,turns){if(!a||a.dead)return false;const resist=.2; if(Math.random()<resist)return false;a.status[kind]=Math.max(a.status[kind],turns);if(await maybeArtistCleanse(a))return false;return true;}

async function performAttack(a,auto=false){await actionCutin(`${a.name}の攻撃！`,'system',480);let crit=TEMP_BALANCE.critRate,denPassive=false;if(a.id==='denden'&&passiveChance(.20)){await passiveBeat(a,'デンデン・ムキムキ・カナリツヨイ！');crit=1;denPassive=true;}let r=applyEnemyDamage(a,1,'physical',crit);if(denPassive)await fixedDelay(600);if(a.id==='tetsu'&&state.battle.enemy.hp>0&&passiveChance(.30)){await passiveBeat(a,'テツの意志！');const r2=applyEnemyDamage(a,.85,'physical',TEMP_BALANCE.critRate);await fixedDelay(600);}await delay(auto?190:260);}
async function performMagic(a,auto=false){const element=normalizeElement(a.attribute),s=MOB_DATA.elements[element];if(a.mpNow<s.cost){notice('MPが足りない！','danger');return false;}a.mpNow-=s.cost;const magicReady=preloadAssets(s.frames);await actionCutin(`${a.name}の${s.spell}！`,'system',560);await magicReady;await skillSprite(s.frames,'enemy');const r=applyEnemyDamage(a,s.power,'magic');if(a.id==='jerry'&&element==='雷'&&state.battle.enemy.hp>0&&passiveChance(.50)){await passiveBeat(a,'ダブルサンダー！');await skillSprite(s.frames,'enemy');const r2=applyEnemyDamage(a,s.power*.9,'magic');await fixedDelay(600);}await delay(auto?170:240);return true;}
async function performUltimate(a,u){if(a.mpNow<u.cost){notice('MPが足りない！','danger');return false;}a.mpNow-=u.cost;await ultimateCutin(a,u);let total=0,r;const hit=async(power=u.power,type=u.type||'physical',crit=u.crit||0)=>{r=applyEnemyDamage(a,power,type,crit);total+=r.value;await delay(90);return r;};
  switch(u.kind){
    case'selfAllBuff':a.allBuff=.20;a.allBuffTurns=rint(3,5);a.damageCut=.10;a.damageCutTurns=a.allBuffTurns;fx('buff');notice('ALL STATUS ↑↑ / DAMAGE CUT','buff');break;
    case'jumanji':await hit();a.atkBuff=.15;a.atkBuffTurns=3;state.battle.enemy.defDebuff=.12;state.battle.enemy.defDebuffTurns=3;notice('ATK ↑ / DEF ↓','buff');break;
    case'lowHpBurst':{const all=livingField(),avg=all.reduce((s,x)=>s+x.hp/x.maxHp,0)/Math.max(1,all.length);await hit(u.power*(1+(1-avg)*.65),'magic');break;}
    case'heroTransform':heal(a,a.maxHp*.5);a.transformed=true;a.allBuff=.30;a.allBuffTurns=99;notice('あのヒーローに変身！ ALL STATUS ↑30%','buff',1000);break;
    case'shieldAttack':await hit();a.guard=.20;a.guardTurns=1;notice('GUARD ↑','buff');break;
    case'healCleanse':healField(u.power);livingField().forEach(x=>{if(Math.random()<.5)cleanse(x);});fx('heal');notice('PARTY HP RECOVER / CLEANSE','heal');break;
    case'yushaGuardAttack':await hit();state.battle.yushaGuard=.50;state.battle.yushaGuardTurns=1;notice('勇者 DAMAGE CUT','buff');break;
    case'teamGuardAttack':await hit();state.battle.teamGuard=.30;state.battle.teamGuardTurns=1;notice('PARTY GUARD','buff');break;
    case'selfHealAttack':heal(a,a.maxHp*.16);await hit();notice('HP RECOVER','heal');break;
    case'goldAttack':await hit();break;
    case'speedDebuffAttack':await hit();state.battle.enemy.spdDebuff=.15;state.battle.enemy.spdDebuffTurns=3;notice('SPD ↓↓','status');break;
    case'burnAttack':await hit();if(applyBossStatus('burn',u.chance||.1))notice(`${state.battle.enemy.name}はやけど状態！`,'status');break;
    case'teamDefAttack':await hit();livingField().forEach(x=>{x.defBuff=.15;x.defBuffTurns=3;});notice('PARTY DEF ↑','buff');break;
    case'selfCleanseAttack':cleanse(a);await hit();notice('状態異常解除！','status');break;
    case'sleepAttack':await hit();if(applyBossStatus('sleep',u.chance||.1))notice(`${state.battle.enemy.name}は眠った！`,'status');break;
    case'paralyzeAttack':await hit();if(applyBossStatus('paralyze',u.chance||.1))notice(`${state.battle.enemy.name}はマヒした！`,'status');break;
    case'selfSpdAttack':await hit();a.spdBuff=.18;a.spdBuffTurns=3;notice('SPD ↑','buff');break;
    case'multiAttack':{const n=rint(u.hits?.[0]||3,u.hits?.[1]||6);for(let i=0;i<n&&state.battle.enemy.hp>0;i++)await hit();notice(`${n} HIT`,'system',420);break;}
    case'teamRecovery':healField(.16);restoreMpField(.10);livingField().forEach(x=>{x.defBuff=.12;x.defBuffTurns=3;});notice('PARTY HP/MP RECOVER / DEF ↑','heal');break;
    case'stunAttack':await hit();if(applyBossStatus('stun',u.chance||.1,1))notice(`${state.battle.enemy.name}をひるませた！`,'status');break;
    case'selfRecoveryAttack':await hit();heal(a,a.maxHp*.12);a.mpNow=Math.min(a.maxMp,a.mpNow+a.maxMp*.08);notice('HP・MP RECOVER','heal');break;
    case'teamHealGuard':healField(u.power||.28);state.battle.teamGuard=.10;state.battle.teamGuardTurns=3;notice('PARTY HP RECOVER / DAMAGE CUT','heal');break;
    case'fullHealBarrier':heal(a,a.maxHp);livingField().forEach(x=>x.barrier=Math.max(x.barrier,1));notice('FULL HEAL / PARTY BARRIER','heal');break;
    case'teamAtkAttack':await hit();livingField().forEach(x=>{x.atkBuff=.15;x.atkBuffTurns=3;});notice('PARTY ATK ↑','buff');break;
    case'healAttack':healField(u.heal||.24);await hit();notice('PARTY HP RECOVER','heal');break;
    case'tetsuFinal':a.atkBuff=.18;a.atkBuffTurns=3;state.battle.enemy.defDebuff=.15;state.battle.enemy.defDebuffTurns=3;await hit();notice('ATK ↑ / DEF ↓','buff');break;
    case'healStunAttack':healField(u.heal||.25);restoreMpField(.10);await hit();if(applyBossStatus('stun',u.chance||.3,1))notice('ひるみ！','status');else notice('PARTY RECOVER','heal');break;
    case'poisonAttack':await hit();if(applyBossStatus('poison',u.chance||.3))notice(`${state.battle.enemy.name}は毒になった！`,'status');break;
    case'narakuShield':a.damageCut=.20;a.damageCutTurns=3;state.battle.teamGuard=.10;state.battle.teamGuardTurns=3;notice('GUARD ↑↑ / PARTY GUARD ↑','buff');break;
    case'selfAtkAttack':a.atkBuff=.18;a.atkBuffTurns=3;await hit();notice('ATK ↑','buff');break;
    case'damage':default:await hit();break;
  }
  renderBattle();await delay(250);return true;
}

async function applyRoundDots(){const e=state.battle.enemy;if(e.status.poison>0){const d=Math.max(1,Math.round(e.maxHp*.025));e.hp=Math.max(0,e.hp-d);e.status.poison--;floatNumber(d,'damage');notice('毒のダメージ！','status');}if(e.status.burn>0){const d=Math.max(1,Math.round(e.maxHp*.025));e.hp=Math.max(0,e.hp-d);e.status.burn--;floatNumber(d,'damage');notice('やけどのダメージ！','status');}for(const a of fieldAllies()){if(a.dead)continue;for(const k of ['poison','burn'])if(a.status[k]>0){const d=Math.max(1,Math.round(a.maxHp*.025));a.hp=Math.max(0,a.hp-d);a.status[k]--;if(a.hp<=0){a.dead=true;notice(`${a.name} DOWN`,'danger');}else notice(`${a.name}に${k==='poison'?'毒':'やけど'}ダメージ！`,'status');}}renderBattle();await checkSpecialRevives();}
function tickBuffs(){const b=state.battle,e=b.enemy;for(const k of ['shieldTurns','atkBuffTurns','defDebuffTurns','spdDebuffTurns'])if(e[k]>0)e[k]--;if(b.teamGuardTurns>0)b.teamGuardTurns--;if(b.yushaGuardTurns>0)b.yushaGuardTurns--;fieldAllies().forEach(a=>{for(const k of ['guardTurns','damageCutTurns','atkBuffTurns','defBuffTurns','spdBuffTurns'])if(a[k]>0)a[k]--;if(a.allBuffTurns>0&&a.allBuffTurns<90)a.allBuffTurns--;});}

function initiativeSpeed(entry){if(entry.type==='enemy'){const e=state.battle.enemy;return e.spd*(e.spdDebuffTurns>0?1-e.spdDebuff:1);}const a=allyById(entry.id);return a?effective('spd',a):0;}
async function startRound(){const b=state.battle;if(!b||b.finished)return;b.busy=true;b.queuePos=0;await applyRoundDots();if(b.enemy.hp<=0)return finishBattle(true);if(!livingRoster().length)return finishBattle(false);await resolveRequiredReplacements();if(!livingRoster().length)return finishBattle(false);
  for(const a of fieldAllies().filter(x=>!x.dead)){
    if(a.id==='nekoku'&&passiveChance(.30)){const target=[...livingField()].sort((x,y)=>x.hp/x.maxHp-y.hp/y.maxHp)[0];if(target){await passiveBeat(a,'癒しのプニプニ！');const h=heal(target,target.maxHp*.14);if(h)notice(`${target.name} HP +${h}`,'heal');await fixedDelay(600);}}
    if(a.id==='money'&&passiveChance(.30)){await passiveBeat(a,'マニーは海を渡る！');const m=Math.round(a.maxMp*.12);a.mpNow=Math.min(a.maxMp,a.mpNow+m);notice(`MP +${m}`,'heal');await fixedDelay(600);}
    if(a.id==='naraku'){await passiveBeat(a,'魔王の系譜！');a.narakuStacks++;a.allBuff=Math.min(.80,a.narakuStacks*.10);a.allBuffTurns=99;notice(`ALL STATUS ↑${a.narakuStacks*10}%`,'buff');await fixedDelay(600);}
  }
  const enemyEntries=b.enemy.isBoss?[{type:'enemy',action:1},{type:'enemy',action:2}]:[{type:'enemy',action:1}];b.queue=[...livingMain().map(a=>({type:'ally',id:a.id})),...enemyEntries,...livingSuper().filter(a=>b.turn>=a.nextSupportTurn).map(a=>({type:'super',id:a.id}))].sort((x,y)=>initiativeSpeed(y)-initiativeSpeed(x)+((Math.random()-.5)*.01));b.busy=false;renderBattle();await processQueue();
}
async function processQueue(){const b=state.battle;if(!b||b.finished||b.busy)return;while(b.queuePos<b.queue.length){const e=b.queue[b.queuePos];if(e.type==='ally'){const a=allyById(e.id);if(!a||a.dead||!b.mainIds.includes(a.id)){b.queuePos++;continue;}if(a.status.sleep>0){a.status.sleep--;notice(`${a.name}は眠っている！`,'status');b.queuePos++;await delay(300);continue;}if(a.status.stun>0){a.status.stun--;notice(`${a.name}はひるんで動けない！`,'status');b.queuePos++;await delay(300);continue;}if(a.status.paralyze>0){notice(`${a.name}はマヒして動けない！`,'status');b.queuePos++;await delay(300);continue;}renderBattle();if(b.auto)setTimeout(autoAct,100);return;}
    if(e.type==='enemy'){const prev=b.queue[b.queuePos-1];if(prev&&(prev.type==='ally'||prev.type==='super'))await fixedDelay(1000);else if(prev&&prev.type==='enemy')await fixedDelay(600);b.busy=true;renderBattle();await enemyAction(e.action||1);b.busy=false;b.queuePos++;if(b.finished)return;await resolveRequiredReplacements();if(b.finished)return;continue;}
    if(e.type==='super'){const a=allyById(e.id);if(!a||a.dead||!b.superIds.includes(a.id)){b.queuePos++;continue;}b.busy=true;renderBattle();await superSubAction(a);a.nextSupportTurn=b.turn+rint(2,5);b.busy=false;b.queuePos++;if(b.enemy.hp<=0)return finishBattle(true);continue;}
  }
  await endRound();
}
async function endRound(){const b=state.battle;if(!b||b.finished)return;tickBuffs();b.turn++;await delay(120);startRound();}

async function enemyAction(actionIndex=1){const b=state.battle,e=b.enemy;if(e.hp<=0)return finishBattle(true);if(e.status.sleep>0){e.status.sleep--;notice(`${e.name}は眠っている！`,'status');await delay(350);return;}if(e.status.stun>0){e.status.stun--;notice(`${e.name}はひるんで動けない！`,'status');await delay(350);return;}if(e.status.paralyze>0){e.status.paralyze--;notice(`${e.name}はマヒして動けない！`,'status');await delay(350);return;}const special=e.isBoss&&actionIndex===1&&b.turn%TEMP_BALANCE.bossSpecialEvery===0;if(special)await bossSpecial();else await bossNormal();if(!livingRoster().length)finishBattle(false);}
async function bossNormal(){
  const e=state.battle.enemy,t=pick(livingMain());if(!t)return;
  await actionCutin(`${e.name}の攻撃！`,'danger',520);
  await beginEnemyLunge();
  try{
    await damageAlly(t,1,'physical',false);
    await delay(320);
  }finally{endEnemyLunge();}
}
async function aoeHit(power,type='physical'){let total=0;for(const a of [...livingMain()]){total+=await damageAlly(a,power,type,false);await delay(70);}for(const a of [...livingSuper()]){total+=await damageAlly(a,power,type,true);await delay(70);}return total;}
async function bossSpecial(){const e=state.battle.enemy;await actionCutin(`${e.name}の${e.special}！`,'danger',700);await beginEnemyLunge();let t,d,total=0;const hit=async(target,m=e.power||1.5,type='physical')=>{const x=await damageAlly(target,m,type,false);await delay(80);return x;};
  try{switch(e.kind){
    case'shield':e.damageReduction=.20;e.shieldTurns=3;fx('buff');notice('DAMAGE CUT 20%','buff');break;
    case'poisonSingle':t=pick(livingMain());if(t){d=await hit(t);if(Math.random()<.5&&await inflictAllyStatus(t,'poison',3))notice(`${t.name}は毒になった！`,'status');}break;
    case'burnSingle':t=pick(livingMain());if(t){d=await hit(t,e.power,'magic');if(Math.random()<.5&&await inflictAllyStatus(t,'burn',3))notice(`${t.name}はやけど状態！`,'status');}break;
    case'stunSingle':t=pick(livingMain());if(t){d=await hit(t,e.power,'magic');await inflictAllyStatus(t,'stun',1);notice(`${t.name}はひるんだ！`,'status');}break;
    case'doubleSingleStun':t=pick(livingMain());if(t){total+=await hit(t,e.power,'magic');if(!t.dead)total+=await hit(t,e.power,'magic');await inflictAllyStatus(t,'stun',1);notice(`${t.name}はひるんだ！`,'status');}break;
    case'singlePlusAoe':t=pick(livingMain());if(t)total+=await hit(t,e.power,'magic');total+=await aoeHit(.52,'magic');break;
    case'multi':case'multiFixed':{const n=rint(e.hits?.[0]||3,e.hits?.[1]||6);for(let i=0;i<n&&livingMain().length;i++)total+=await hit(pick(livingMain()),e.power);notice(`${n} HIT`,'system',420);break;}
    case'healSingle':t=pick(livingMain());if(t)d=await hit(t,e.power,'magic');{const h=Math.round(e.maxHp*.06);e.hp=Math.min(e.maxHp,e.hp+h);floatNumber(h,'heal');notice(`BOSS HP +${h}`,'heal');}break;
    case'buffAoe':e.atkBuff=.18;e.atkBuffTurns=3;total=await aoeHit(e.power,'magic');notice('ATK ↑','buff');break;
    case'doubleAoe':for(let n=0;n<2;n++)total+=await aoeHit(e.power,'physical');notice('2 HIT','system',420);break;
    case'aoeStun':total=await aoeHit(e.power,'magic');for(const a of livingMain())if(Math.random()<.7)await inflictAllyStatus(a,'stun',1);for(const a of livingSuper())if(Math.random()<.7)await inflictAllyStatus(a,'stun',1);notice('ひるみ判定','status');break;
    case'aoe':total=await aoeHit(e.power,e.attribute.includes('火')||e.attribute.includes('闇')?'magic':'physical');break;
    case'single':default:t=pick(livingMain());if(t){d=await hit(t,e.power||1.55);}break;
  }}finally{endEnemyLunge();}
  await checkSpecialRevives();renderBattle();await delay(280);
}

async function superSubAction(a){await fixedDelay(600);await actionCutin(`${a.name}の援護！`,'system',650);try{if(a.status.sleep>0){a.status.sleep--;notice(`${a.name}は眠っている！`,'status');return;}if(a.status.stun>0){a.status.stun--;notice(`${a.name}はひるんで動けない！`,'status');return;}if(a.status.paralyze>0){notice(`${a.name}はマヒして動けない！`,'status');return;}const low=livingField().some(x=>x.hp/x.maxHp<.45);if((a.id==='money'||a.id==='pink'||a.id==='riro')&&low){const h=healField(.12);notice(`SUPER SUPPORT / PARTY HP +${h}`,'heal');return;}const s=MOB_DATA.elements[normalizeElement(a.attribute)];if(a.mpNow>=s.cost&&Math.random()<.45){await performMagic(a,true);return;}await performAttack(a,true);}finally{clearEnemyImpact();await fixedDelay(600);}}

function findGroup(id){const b=state.battle;for(const key of ['mainIds','superIds','reserveIds']){const i=b[key].indexOf(id);if(i>=0)return{key,index:i};}return null;}
function swapGroupMembers(outId,inId){const b=state.battle,a=findGroup(outId),c=findGroup(inId);if(!a||!c)return false;[b[a.key][a.index],b[c.key][c.index]]=[b[c.key][c.index],b[a.key][a.index]];return true;}
function replacementCandidates(exclude=[]){const b=state.battle,ids=[...b.superIds,...b.reserveIds].filter(id=>!exclude.includes(id)),seen=new Set();return ids.map(allyById).filter(a=>a&&!a.dead&&a.hp>0&&!seen.has(a.id)&&(seen.add(a.id)||true));}
function reserveReplacementCandidates(exclude=[]){const b=state.battle;return b.reserveIds.filter(id=>!exclude.includes(id)).map(allyById).filter(a=>a&&!a.dead&&a.hp>0);}
async function chooseReplacement(title,candidates){if(!candidates.length)return null;if(state.battle.auto)return candidates[0].id;const sheet=$('#skillMenu'),list=$('#skillMenuList');sheet.hidden=false;$('#skillMenuKicker').textContent='MEMBER CHANGE';$('#skillMenuTitle').textContent=title;list.innerHTML=candidates.map(a=>`<button class="skill-item" data-replace-id="${a.id}" type="button"><span class="ult-thumb"><img src="${a.image}" alt=""><i>${a.symbol}</i></span><div><b>${a.name}</b><small>HP ${Math.ceil(a.hp)} / ${a.maxHp}　MP ${Math.floor(a.mpNow)}</small></div><em>${state.battle.superIds.includes(a.id)?'援護':'RESERVE'}</em></button>`).join('');bindImages(list);return new Promise(resolve=>{$$('[data-replace-id]',list).forEach(btn=>btn.onclick=()=>{sheet.hidden=true;resolve(btn.dataset.replaceId);});});}
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
  if(b.enemy.hp<=0){b.busy=false;return finishBattle(true);}
  b.queuePos++;
  b.busy=false;
  renderBattle();
  await processQueue();
}
async function performSwitch(payload){if(!payload)return false;const out=allyById(payload.outId),incoming=allyById(payload.inId);if(!out||!incoming||incoming.dead||incoming.hp<=0||!state.battle.mainIds.includes(out.id))return false;if(!swapGroupMembers(out.id,incoming.id))return false;renderBattle();await actionCutin(`CHANGE! ${out.name} → ${incoming.name}`,'system',700);await delay(180);return true;}
function openSwitchMenu(){const a=activeAlly();if(!a)return;const candidates=[...superAllies(),...reserveAllies()].filter(x=>!x.dead&&x.hp>0);if(!candidates.length)return notice('入れ替え可能なメンバーがいません','danger');const sheet=$('#skillMenu'),list=$('#skillMenuList');sheet.hidden=false;$('#skillMenuKicker').textContent=`${a.name}の行動 / ターン消費`;$('#skillMenuTitle').textContent='入れ替える';list.innerHTML=`<div class="switch-zone-title super">援護メンバー</div>${superAllies().map(x=>`<button class="skill-item ${x.dead?'disabled':''}" data-switch-in="${x.id}" type="button" ${x.dead?'disabled':''}><span class="ult-thumb"><img src="${x.image}" alt=""><i>${x.symbol}</i></span><div><b>${x.name}</b><small>HP ${Math.ceil(x.hp)} / MP ${Math.floor(x.mpNow)}</small></div><em>援護</em></button>`).join('')}<div class="switch-zone-title reserve">RESERVE</div>${reserveAllies().map(x=>`<button class="skill-item ${x.dead?'disabled':''}" data-switch-in="${x.id}" type="button" ${x.dead?'disabled':''}><span class="ult-thumb"><img src="${x.image}" alt=""><i>${x.symbol}</i></span><div><b>${x.name}</b><small>HP ${Math.ceil(x.hp)} / MP ${Math.floor(x.mpNow)}</small></div><em>RESERVE</em></button>`).join('')}`;bindImages(list);$$('[data-switch-in]',list).forEach(btn=>btn.onclick=()=>{sheet.hidden=true;act('switch',{outId:a.id,inId:btn.dataset.switchIn});});}

async function autoAct(){const b=state.battle,a=activeAlly();if(!b||!a||!b.auto||b.busy||b.finished)return;const usable=availableUlts(a).filter(u=>a.mpNow>=u.cost);if(usable.length&&Math.random()<.32)return act('ultimate',pick(usable));const s=MOB_DATA.elements[normalizeElement(a.attribute)];if(a.mpNow>=s.cost&&Math.random()<.30)return act('magic');return act('attack');}
function openSkillMenu(type){const a=activeAlly();if(!a)return;const list=$('#skillMenuList');$('#skillMenu').hidden=false;if(type==='magic'){const s=MOB_DATA.elements[normalizeElement(a.attribute)];$('#skillMenuKicker').textContent=`${a.name} / MP ${Math.floor(a.mpNow)}`;$('#skillMenuTitle').textContent='魔法';list.innerHTML=`<button class="skill-item" data-use-magic type="button"><span class="skill-symbol">${normalizeElement(a.attribute)}</span><div><b>${s.spell}<em class="temp-badge">仮</em></b><small>${TEMP_BALANCE.magicNote}</small></div><em>MP ${s.cost} 仮</em></button>`;$('[data-use-magic]',list).onclick=()=>{$('#skillMenu').hidden=true;act('magic');};}else{const unlocked=availableUlts(a);$('#skillMenuKicker').textContent=`${a.name} / Lv${a.level} / MP ${Math.floor(a.mpNow)}`;$('#skillMenuTitle').textContent='必殺技';list.innerHTML=a.ults.map((u,i)=>{const req=i<4?[1,15,30,50][i]:null,ok=unlocked.includes(u);return`<button class="skill-item ${!ok?'locked':''} ${ok&&a.mpNow<u.cost?'disabled':''}" data-ult-index="${i}" type="button" ${!ok?'disabled':''}><span class="ult-thumb"><img src="${u.image}" alt=""><i>必</i></span><div><b>${u.name}</b><small>${u.desc}${!ok?` / Lv${req}で習得`:''}</small></div><em>${ok?`MP ${u.cost} 仮`:`LOCK`}</em></button>`;}).join('');bindImages(list);$$('[data-ult-index]',list).forEach(btn=>btn.onclick=()=>{const u=a.ults[Number(btn.dataset.ultIndex)];if(!availableUlts(a).includes(u))return;if(a.mpNow<u.cost)return notice('MPが足りない！','danger');$('#skillMenu').hidden=true;act('ultimate',u);});}}
function openItemMenu(){const list=$('#skillMenuList');$('#skillMenu').hidden=false;$('#skillMenuKicker').textContent='ITEM';$('#skillMenuTitle').textContent='アイテム';list.innerHTML=`<div class="switch-guide">アイテム効果・所持数・復活アイテムの設定がまだ無いため、現在はコマンド枠のみ実装しています。</div>`;}
function escapeAttempt(){notice('「逃げる」の成功率は未設定です','system',850);}

function persistAdventureVitals(){if(!state.battle)return;state.adventure.vitals={};state.battle.allies.forEach(a=>{state.adventure.vitals[a.id]={hp:Math.max(0,a.hp),mp:Math.max(0,a.mpNow)};});saveAdventure();}
function finishBattle(win){const b=state.battle;if(!b||b.finished)return;b.finished=true;b.auto=false;$('#autoBtn').classList.remove('active');$('#autoBtn').textContent='AUTO';setCommandDisabled(true);notice(win?'VICTORY!':'DEFEAT...','system',1000);if(b.mode==='adventure'&&win){persistAdventureVitals();if(b.enemy.isBoss){state.adventure.completed=true;state.adventure.battleReady=false;}else{state.adventure.progress=Math.min(3,state.adventure.progress+1);state.adventure.battleReady=false;}saveAdventure();}if(b.mode==='adventure'&&!win)restoreCampCheckpoint();$('#resultTitle').textContent=win?'VICTORY':'DEFEAT';$('#resultKicker').textContent=b.mode==='adventure'?(b.enemy.isBoss?'GRASSLAND BOSS':'GRASSLAND BATTLE'):'TRAINING RESULT';$('#resultText').textContent=win?`${b.enemy.name} Lv${b.enemy.level} を撃破！ / ${b.turn}ターン`:(b.mode==='adventure'?`全員がダウンしました。直前のキャンプ地点のデータへ戻ります。`:`${b.enemy.name} Lv${b.enemy.level} / ${b.turn}ターン目で全員ダウン`);$('#resultRetryBtn').style.display=b.mode==='training'?'block':'none';$('#resultSetupBtn').textContent=b.mode==='training'?'トレーニングへ戻る':'キャンプ地点へ戻る';setTimeout(()=>{$('#resultOverlay').hidden=false;},650/state.speed);}

async function startBattleLoaded(config){
  await loadingWithAssets('戦闘用画像を読み込んでいます…',battleAssets(config));
  beginBattle(config);
}
async function startAdventureBattle(){const adv=MOB_DATA.adventure,prog=state.adventure.progress;if(!state.adventure.battleReady)return;if(prog===3){const e=buildBossEnemy(boss(adv.bossId),adv.level+8,Math.min(4,state.party.length));await startBattleLoaded({mode:'adventure',returnScreen:'adventure',enemy:e,party:state.party,useAdventureVitals:true});}else{const raw=adv.normalEnemies[prog],area=adv.areas[prog],e=buildNormalEnemy(raw,adv.level+prog*2,Math.min(4,state.party.length),area.bg);await startBattleLoaded({mode:'adventure',returnScreen:'adventure',enemy:e,party:state.party,useAdventureVitals:true});}}
async function resetTrainingBattle(){await startBattleLoaded({mode:'training',returnScreen:'training',bossId:state.training.bossId,bossLevel:state.training.bossLevel,party:trainingParty()});}

function openHomeAction(action){if(action==='home')return toast('ここがHOMEです');if(['equipment','items','settings'].includes(action))return toast(`${action==='equipment'?'装備':action==='items'?'持ち物':'設定'}は仕様待ちです`);if(action==='castle')return dialog('お城に向かいますか？\nMOB SHOPや宿舎は、まだ詳細仕様待ちです。',[['はい','yes'],['いいえ','no']]).then(v=>{if(v==='yes')toast('お城内部は次の実装対象です');});if(action==='tavern')return dialog('酒場に向かいますか？\nパーティー編成が出来ます！',[['はい','yes','primary'],['いいえ','no']]).then(v=>{if(v==='yes')travelTo('tavern','酒場へ向かっています…',renderTavern);});if(action==='training')return dialog('トレーニングに向かいますか？\nパーティーとボスを自由に設定してテスト戦闘が出来ます！',[['はい','yes','primary'],['いいえ','no']]).then(v=>{if(v==='yes')travelTo('training','トレーニングルームへ向かっています…',renderTraining);});if(action==='adventure')return dialog('冒険に向かいますか？\n今回の目的地は「草原」です！',[['はい','yes','primary'],['いいえ','no']]).then(v=>{if(v==='yes')travelTo('adventure','草原へ出発です！',()=>{renderAdventure();setTimeout(()=>dialog('草原に到着しました！\nまずはじっくり探索してみましょう！\nそれとも一度ゆっくり休みますか？',[['冒険を始める','ok','primary']]),100);});});}
function randomTraining(){const arr=[...MOB_DATA.players].sort(()=>Math.random()-.5).slice(0,10);state.training.party=arr.map(p=>[p.id,rint(15,80)]);state.training.bossId=pick(MOB_DATA.bosses).id;state.training.bossLevel=rint(15,80);state.training.filter='ALL';renderTraining();}

function lockMobileGestures(){document.addEventListener('contextmenu',e=>e.preventDefault());document.addEventListener('dragstart',e=>e.preventDefault());document.addEventListener('selectstart',e=>{if(!['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))e.preventDefault();});['gesturestart','gesturechange','gestureend'].forEach(t=>document.addEventListener(t,e=>e.preventDefault(),{passive:false}));document.addEventListener('touchmove',e=>{if(e.touches?.length>1)e.preventDefault();},{passive:false});let last=0;document.addEventListener('touchend',e=>{const now=Date.now();if(now-last<300)e.preventDefault();last=now;},{passive:false});document.addEventListener('dblclick',e=>e.preventDefault(),{passive:false});}
function bindEvents(){
  $$('[data-home-action]').forEach(b=>b.onclick=()=>openHomeAction(b.dataset.homeAction));$$('[data-back-home]').forEach(b=>b.onclick=()=>{renderHome();showScreen('home');});
  $('#tavernResetBtn').onclick=()=>{state.party=defaultParty.map(x=>[...x]);state.tavernSwapIndex=null;renderTavern();};$('#savePartyBtn').onclick=()=>{if(state.party.length<1)return;saveParty();state.training.party=state.party.map(x=>[...x]);renderHome();toast('パーティーを保存しました');showScreen('home');};
  $('#trainingBackBtn').onclick=()=>{renderHome();showScreen('home');};$('#trainingRandomBtn').onclick=randomTraining;$('#allLevelBtn').onclick=()=>{state.training.party=trainingParty().map(x=>[x[0],50]);renderTraining();};$('#bossLevel').oninput=e=>{state.training.bossLevel=clamp(Number(e.target.value),1,99);$('#bossLevelValue').textContent=state.training.bossLevel;renderSelectedBoss();};$('#startTrainingBattleBtn').onclick=resetTrainingBattle;
  $('#adventureBackBtn').onclick=()=>{renderHome();showScreen('home');};$('#exploreBtn').onclick=exploreField;$('#campBtn').onclick=saveCampCheckpoint;$('#fieldBattleBtn').onclick=startAdventureBattle;
  $('#battleBackBtn').onclick=()=>{if(!state.battle)return;state.battle.auto=false;if(state.battle.mode==='adventure'){renderAdventure();showScreen('adventure');}else{renderTraining();showScreen('training');}};
  $('#attackBtn').onclick=()=>act('attack');$('#skillBtn').onclick=()=>openSkillMenu('magic');$('#ultimateBtn').onclick=()=>openSkillMenu('ultimate');$('#defendBtn').onclick=()=>act('defend');$('#itemBtn').onclick=openItemMenu;$('#escapeBtn').onclick=escapeAttempt;$('#switchBtn').onclick=openSwitchMenu;$$('[data-close-sheet]').forEach(b=>b.onclick=()=>{$('#skillMenu').hidden=true;});
  $('#autoBtn').onclick=()=>{const b=state.battle;if(!b||b.finished)return;b.auto=!b.auto;$('#autoBtn').classList.toggle('active',b.auto);$('#autoBtn').textContent=b.auto?'AUTO ON':'AUTO';if(b.auto&&!b.busy&&activeAlly())autoAct();};$('#speedBtn').onclick=()=>{state.speed=state.speed===1?1.5:state.speed===1.5?2:1;$('#speedBtn').textContent=`×${state.speed}`;};
  $('#resultRetryBtn').onclick=resetTrainingBattle;$('#resultSetupBtn').onclick=()=>{if(!state.battle)return;$('#resultOverlay').hidden=true;if(state.battle.mode==='adventure'){renderAdventure();showScreen('adventure');}else{renderTraining();showScreen('training');}};$('#resultHomeBtn').onclick=()=>{$('#resultOverlay').hidden=true;renderHome();showScreen('home');};
}

lockMobileGestures();initCommonNav();bindImages();bindEvents();renderHome();preloadAssets(['icon/01.png','back/rpgmain.png',...state.party.slice(0,4).map(([id])=>player(id)?.image)]);setTimeout(startFastBackgroundWarmup,80);
})();
