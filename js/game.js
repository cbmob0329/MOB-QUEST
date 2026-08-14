(() => {
'use strict';

const $=(s,p=document)=>p.querySelector(s);
const $$=(s,p=document)=>[...p.querySelectorAll(s)];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const rint=(a,b)=>Math.floor(a+Math.random()*(b-a+1));
const pct=(n,max)=>max?clamp(n/max*100,0,100):0;

const screens={home:$('#homeScreen'),loading:$('#loadingScreen'),tavern:$('#tavernScreen'),training:$('#trainingScreen'),adventure:$('#adventureScreen'),battle:$('#battleScreen')};
const defaultParty=[['yusha',30],['pink',30],['desert',30],['nyoro',30],['nekoku',30],['jerry',30],['denden',30],['money',30]];
const state={
  party:loadParty(), coins:12500,
  training:{party:null,bossId:'hawk',bossLevel:30,filter:'ALL'},
  adventure:{progress:0,battleReady:false,completed:false,vitals:null},
  battle:null,
  dialogResolve:null,
  speed:1, tavernSwapIndex:null
};

function player(id){return MOB_DATA.players.find(x=>x.id===id);}
function boss(id){return MOB_DATA.bosses.find(x=>x.id===id);}
function normalizeElement(attr){return ['火','水','雷','地','風','光','闇','無'].find(e=>String(attr).includes(e))||'無';}
function saveParty(){try{localStorage.setItem('mobQuestPartyV3',JSON.stringify(state.party.slice(0,8)));}catch(_){} }
function loadParty(){try{const raw=localStorage.getItem('mobQuestPartyV3')||localStorage.getItem('mobQuestPartyV2');const v=JSON.parse(raw);if(Array.isArray(v)&&v.length){const seen=new Set();const clean=v.filter(x=>Array.isArray(x)&&player(x[0])&&!seen.has(x[0])&&(seen.add(x[0])||true)).map(x=>[x[0],clamp(Number(x[1])||1,1,99)]).slice(0,8);if(clean.length)return clean;}}catch(_){}return defaultParty.map(x=>[...x]);}
function delay(ms){return new Promise(r=>setTimeout(r,Math.max(25,ms/state.speed)));}
function showScreen(name){Object.entries(screens).forEach(([k,v])=>v.classList.toggle('active',k===name));}
function toast(text){const el=$('#toast');el.textContent=text;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),1600);}

function bindImage(img){
  if(!img||img.dataset.bound==='1')return;img.dataset.bound='1';img.draggable=false;
  img.addEventListener('error',()=>{const f=img.dataset.fallbackSrc;if(f&&img.dataset.tried!=='1'){img.dataset.tried='1';img.src=f;return;}img.classList.add('asset-missing');});
  img.addEventListener('load',()=>img.classList.remove('asset-missing'));
}
function bindImages(root=document){$$('img',root).forEach(bindImage);}
function setImage(img,src,fallback=''){if(!img)return;img.classList.remove('asset-missing');img.dataset.tried='0';if(fallback)img.dataset.fallbackSrc=fallback;img.src=src;bindImage(img);}

function commonNavMarkup(){return `
  <button data-nav="home" type="button"><span><img src="mqicon/06.png" alt=""><i>⌂</i></span><b>HOME</b></button>
  <button data-nav="equipment" type="button"><span><img src="mqicon/10.png" alt=""><i>◇</i></span><b>装備</b></button>
  <button data-nav="items" type="button"><span><img src="mqicon/12.png" alt=""><i>□</i></span><b>持ち物</b></button>
  <button data-nav="settings" type="button"><span><img src="mqicon/09.png" alt=""><i>⚙</i></span><b>設定</b></button>`;}
function initCommonNav(){$$('[data-common-nav]').forEach(n=>{n.innerHTML=commonNavMarkup();});$$('[data-nav]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.nav==='home'){renderHome();showScreen('home');}else toast(`${b.textContent.trim()}は次の実装用に入口だけ接続済みです`);}));bindImages();}

async function dialog(text,choices=[['OK','ok']],speaker='モブピンク'){
  const overlay=$('#dialogOverlay');$('#dialogSpeaker').textContent=speaker;$('#dialogText').textContent=text;$('#dialogChoices').innerHTML=choices.map(([label,val,cls=''])=>`<button type="button" data-dialog-value="${val}" class="${cls}">${label}</button>`).join('');overlay.hidden=false;
  return new Promise(resolve=>{state.dialogResolve=resolve;$$('[data-dialog-value]',overlay).forEach(btn=>btn.onclick=()=>{overlay.hidden=true;state.dialogResolve=null;resolve(btn.dataset.dialogValue);});});
}

async function travelTo(target,text,after){
  showScreen('loading');$('#loadingText').textContent=text;$('#loadingBar').style.width='0%';await delay(80);$('#loadingBar').style.width='100%';await delay(650);if(after)after();showScreen(target);
}

function renderHome(){
  $('#coinValue').textContent=state.coins.toLocaleString();
  $('#homeParty').innerHTML=state.party.slice(0,4).map(([id,lv],i)=>{const p=player(id);if(!p)return'';return `<div class="home-member slot-${i}"><div class="home-sprite"><img src="${p.image}" alt="${p.name}"><span>${p.symbol}</span></div><small>${p.name}</small><b>Lv${lv}</b></div>`;}).join('');
  bindImages($('#homeParty'));
}

function rosterCard(p,selected,level){return `<button class="roster-card ${selected?'selected':''}" data-roster-id="${p.id}" type="button"><span class="roster-art"><img src="${p.image}" alt="${p.name}"><i>${p.symbol}</i></span><b>${p.name}</b><small>${p.attribute} / ${p.weapon}</small><em>Lv${level}</em></button>`;}
function renderTavern(){
  const levels=new Map(state.party.map(([id,lv])=>[id,lv]));
  const mainCount=Math.min(4,state.party.length),reserveCount=Math.max(0,state.party.length-4);
  $('#tavernPartyCount').textContent=`MAIN ${mainCount}/4・控え ${reserveCount}/4`;
  $('#tavernSlots').innerHTML=Array.from({length:8},(_,i)=>{const slot=state.party[i];const zone=i<4?'MAIN':'RESERVE';const zoneNo=i<4?i+1:i-3;const prefix=`<div class="formation-zone-label ${i===0?'first':''} ${i===4?'reserve-start':''}"><b>${zone}</b><span>${i<4?'戦闘メンバー':'控えメンバー'} ${zoneNo}</span></div>`;if(!slot)return`${prefix}<div class="tavern-slot empty ${i<4?'main-slot':'reserve-slot'}"><b>EMPTY</b><small>${i<4?'前衛メンバーを選択':'控えを選択'}</small></div>`;const p=player(slot[0]);const swapSelected=state.tavernSwapIndex===i;return `${prefix}<div class="tavern-slot ${i<4?'main-slot':'reserve-slot'} ${swapSelected?'swap-selected':''}"><span><img src="${p.image}" alt="${p.name}"><i>${p.symbol}</i></span><div><b>${p.name}</b><small>${p.attribute} / ${p.role}</small></div><label>Lv<input class="tavern-level" data-id="${p.id}" type="number" min="1" max="99" inputmode="numeric" value="${slot[1]}"></label><div class="slot-actions"><button data-swap-slot="${i}" type="button" title="配置を入れ替え">↕</button><button data-remove-member="${p.id}" type="button" title="外す">×</button></div></div>`;}).join('');
  $('#rosterGrid').innerHTML=MOB_DATA.players.map(p=>rosterCard(p,state.party.some(x=>x[0]===p.id),levels.get(p.id)||30)).join('');
  bindImages($('#tavernScreen'));
  $$('.tavern-level').forEach(i=>i.addEventListener('change',()=>{const s=state.party.find(x=>x[0]===i.dataset.id);if(s)s[1]=clamp(Number(i.value)||1,1,99);}));
  $$('[data-remove-member]').forEach(b=>b.addEventListener('click',()=>{if(state.party.length<=1)return toast('最低1人は必要です');state.party=state.party.filter(x=>x[0]!==b.dataset.removeMember);state.tavernSwapIndex=null;renderTavern();}));
  $$('[data-swap-slot]').forEach(b=>b.addEventListener('click',()=>{const idx=Number(b.dataset.swapSlot);if(state.tavernSwapIndex===null){state.tavernSwapIndex=idx;toast('入れ替えるもう1人を選んでください');renderTavern();return;}if(state.tavernSwapIndex===idx){state.tavernSwapIndex=null;renderTavern();return;}const a=state.tavernSwapIndex;if(state.party[a]&&state.party[idx]){[state.party[a],state.party[idx]]=[state.party[idx],state.party[a]];toast('配置を入れ替えました');}state.tavernSwapIndex=null;renderTavern();}));
  $$('[data-roster-id]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.rosterId;const idx=state.party.findIndex(x=>x[0]===id);if(idx>=0){if(state.party.length<=1)return toast('最低1人は必要です');state.party.splice(idx,1);}else{if(state.party.length>=8)return toast('メイン4人＋控え4人で最大8人です');state.party.push([id,30]);}state.tavernSwapIndex=null;renderTavern();}));
}

function ensureTrainingParty(){
  if(!state.training.party)state.training.party=state.party.map(x=>[...x]);
  const seen=new Set();state.training.party=state.training.party.filter(x=>player(x[0])&&!seen.has(x[0])&&(seen.add(x[0])||true)).slice(0,8);
  for(const p of MOB_DATA.players){if(state.training.party.length>=8)break;if(!seen.has(p.id)){state.training.party.push([p.id,30]);seen.add(p.id);}}
  return state.training.party;
}
function trainingParty(){return ensureTrainingParty();}
function renderTraining(){
  ensureTrainingParty();
  $('#trainingPartySetup').innerHTML=state.training.party.map(([id,lv],i)=>{const p=player(id);const zone=i<4?'MAIN':'RESERVE';return `${i===0||i===4?`<div class="training-zone-title ${i===4?'reserve':''}"><b>${zone}</b><small>${i<4?'戦闘開始時に出る4人':'戦闘中に交代できる控え4人'}</small></div>`:''}<div class="training-slot ${i<4?'main-slot':'reserve-slot'}"><span><img src="${p.image}" alt="${p.name}"><i>${p.symbol}</i></span><div class="training-slot-info"><small>${zone} ${i<4?i+1:i-3}</small><select data-training-member="${i}">${MOB_DATA.players.map(q=>`<option value="${q.id}" ${q.id===id?'selected':''}>${q.name} / ${q.attribute}</option>`).join('')}</select></div><label>Lv<input data-training-level="${i}" type="number" min="1" max="99" inputmode="numeric" value="${lv}"></label></div>`;}).join('');
  const stages=['ALL',...new Set(MOB_DATA.bosses.map(b=>b.stage))];
  $('#bossTabs').innerHTML=stages.map(s=>`<button class="boss-tab ${state.training.filter===s?'active':''}" data-boss-stage="${s}" type="button">${s==='ALL'?'全て':s}</button>`).join('');
  const list=state.training.filter==='ALL'?MOB_DATA.bosses:MOB_DATA.bosses.filter(b=>b.stage===state.training.filter);
  $('#bossCountLabel').textContent=`${MOB_DATA.bosses.length} BOSS`;
  $('#bossGrid').innerHTML=list.map(b=>`<button class="boss-choice ${b.id===state.training.bossId?'selected':''}" data-boss-id="${b.id}" type="button"><span><img src="${b.image}" alt="${b.name}"><i>${b.symbol}</i></span><div><b>${b.name}</b><small>${b.stage} / ${b.attribute}</small><em>${b.special}</em></div></button>`).join('');
  $('#bossLevel').value=state.training.bossLevel;$('#bossLevelValue').textContent=state.training.bossLevel;renderSelectedBoss();bindImages($('#trainingScreen'));
  $$('[data-training-member]').forEach(sel=>sel.addEventListener('change',()=>{const i=Number(sel.dataset.trainingMember);if(state.training.party.some((x,j)=>j!==i&&x[0]===sel.value)){toast('同じキャラクターは2人編成できません');renderTraining();return;}state.training.party[i][0]=sel.value;renderTraining();}));
  $$('[data-training-level]').forEach(i=>i.addEventListener('change',()=>{state.training.party[Number(i.dataset.trainingLevel)][1]=clamp(Number(i.value)||1,1,99);}));
  $$('[data-boss-stage]').forEach(b=>b.addEventListener('click',()=>{state.training.filter=b.dataset.bossStage;renderTraining();}));
  $$('[data-boss-id]').forEach(b=>b.addEventListener('click',()=>{state.training.bossId=b.dataset.bossId;renderTraining();}));
}
function renderSelectedBoss(){const b=boss(state.training.bossId)||MOB_DATA.bosses[0];$('#selectedBossMini').innerHTML=`<b>${b.name}</b><small>${b.stage} / ${b.attribute} / Lv${state.training.bossLevel}</small>`;}

function renderAdventure(){
  const adv=MOB_DATA.adventure;const prog=state.adventure.progress;const area=adv.areas[Math.min(prog,3)];
  $('#adventureStageTitle').textContent=adv.name;$('#adventureProgress').textContent=state.adventure.completed?'CLEAR':`戦闘 ${prog}/4`;$('#areaName').textContent=area.name;$('#areaDescription').textContent=state.adventure.completed?'モブホークを倒した！草原の探索は完了しています。':state.adventure.battleReady?(prog===3?'ボスが待ち構えている！':'モンスターを発見した！バトルが可能です。'):'まずはじっくり探索してみましょう！';
  setImage($('#adventureBg'),area.bg,area.fallback);
  $('#adventureParty').innerHTML=state.party.slice(0,4).map(([id,lv])=>{const p=player(id);return`<div><img src="${p.image}" alt="${p.name}"><span>${p.symbol}</span><small>Lv${lv}</small></div>`;}).join('');
  const battleBtn=$('#fieldBattleBtn');battleBtn.disabled=!state.adventure.battleReady||state.adventure.completed;battleBtn.classList.toggle('locked',battleBtn.disabled);$('#fieldBattleHint').textContent=state.adventure.completed?'CLEAR':state.adventure.battleReady?(prog===3?'BOSS':'戦闘可能'):'探索が必要';$('#exploreBtn').disabled=state.adventure.battleReady||state.adventure.completed;
  bindImages($('#adventureScreen'));
}
async function exploreField(){
  const adv=MOB_DATA.adventure;const prog=state.adventure.progress;if(state.adventure.completed)return;
  const area=adv.areas[Math.min(prog,3)];$('#fieldEvent').hidden=false;$('#fieldEvent').innerHTML=`<b>探索中...</b><small>${area.name}</small>`;await delay(500);$('#fieldEvent').innerHTML=`<b>${prog===3?'BOSS ENCOUNTER':'ENCOUNTER'}</b><p>${area.explore}</p>`;state.adventure.battleReady=true;renderAdventure();await delay(800);$('#fieldEvent').hidden=true;
}

function baseStats(p,lv){const g=p.growth;return {maxHp:Math.round(420+g.hp*lv),maxMp:Math.round(72+g.mp*lv),atk:Math.round(38+g.atk*lv),mag:Math.round(38+g.mag*lv),def:Math.round(28+g.def*lv),res:Math.round(28+g.res*lv),spd:Math.round(28+g.spd*lv)};}
function buildAlly(p,lv,vital){const s=baseStats(p,lv);const hp=vital?clamp(vital.hp,0,s.maxHp):s.maxHp;return {...p,level:lv,...s,hp,mpNow:vital?clamp(vital.mp,0,s.maxMp):s.maxMp,dead:hp<=0,guard:0,guardTurns:0,barrier:0,atkBuff:0,atkBuffTurns:0,defBuff:0,defBuffTurns:0,allBuff:0,allBuffTurns:0,damageCut:0,damageCutTurns:0,status:{poison:0,burn:0,sleep:0,stun:0,paralyze:0},pinkReviveUsed:false,lilithReviveUsed:false,transformed:false,narakuStacks:0};}
function buildBossEnemy(b,lv,size){const maxHp=Math.round(1800+lv*175+size*350);return {...b,isBoss:true,level:lv,maxHp,hp:maxHp,maxMp:0,mpNow:0,atk:Math.round(52+lv*8.1),mag:Math.round(52+lv*8.0),def:Math.round(52+lv*4.1),res:Math.round(52+lv*4.0),spd:Math.round(30+lv*2.15),guard:0,damageReduction:0,shieldTurns:0,atkBuff:0,atkBuffTurns:0,defDebuff:0,defDebuffTurns:0,spdDebuff:0,spdDebuffTurns:0,status:{poison:0,burn:0,sleep:0,stun:0,paralyze:0}};}
function buildNormalEnemy(raw,lv,size,bg){const maxHp=Math.round(850+lv*105+size*150);return {...raw,id:'grassEnemy',image:'',isBoss:false,level:lv,maxHp,hp:maxHp,atk:Math.round(35+lv*6.2),mag:Math.round(30+lv*5.5),def:Math.round(32+lv*3.2),res:Math.round(30+lv*3.0),spd:Math.round(26+lv*2),special:'草原ラッシュ',kind:'single',bg,fallbackBg:'back/sougen.png',status:{poison:0,burn:0,sleep:0,stun:0,paralyze:0},shieldTurns:0,atkBuffTurns:0,defDebuffTurns:0,spdDebuffTurns:0};}

function beginBattle(config){
  const partyList=(config.party||state.party).slice(0,8);const vitals=config.useAdventureVitals?state.adventure.vitals:null;
  const allies=partyList.map(([id,lv])=>buildAlly(player(id),lv,vitals?.[id]));
  const enemy=config.enemy||buildBossEnemy(boss(config.bossId),config.bossLevel||30,Math.min(4,allies.length));
  const activeIds=allies.slice(0,4).map(a=>a.id);
  state.battle={mode:config.mode||'training',returnScreen:config.returnScreen||'training',isBoss:enemy.isBoss,allies,activeIds,roundQueue:[],enemy,turn:1,actorPos:0,busy:false,auto:false,finished:false,teamGuard:0,teamGuardTurns:0,yushaGuard:0,yushaGuardTurns:0,narration:[],config};
  setImage($('#battleBg'),enemy.bg||'back/sougen4.png',enemy.fallbackBg||'back/rpgmain.png');$('#battleModeLabel').textContent=config.mode==='adventure'?(enemy.isBoss?'BOSS BATTLE':'FIELD BATTLE'):'TRAINING';$('#resultOverlay').hidden=true;$('#skillMenu').hidden=true;$('#autoBtn').classList.remove('active');$('#autoBtn').textContent='AUTO';renderBattle();showScreen('battle');narrate(`${enemy.name}が現れた！`);if(benchAllies().length)narrate(`控え${benchAllies().length}人が後方で待機している。`);centerMessage(enemy.isBoss?'BOSS BATTLE':'BATTLE START');startRound();
}

function allyById(id){return state.battle?.allies.find(a=>a.id===id)||null;}
function frontAllies(){const b=state.battle;if(!b)return[];return b.activeIds.map(allyById).filter(Boolean);}
function benchAllies(){const b=state.battle;if(!b)return[];return b.allies.filter(a=>!b.activeIds.includes(a.id));}
function livingAllies(){return frontAllies().filter(a=>!a.dead&&a.hp>0);}
function livingRoster(){return state.battle?state.battle.allies.filter(a=>!a.dead&&a.hp>0):[];}
function activeAlly(){const b=state.battle;if(!b)return null;while(b.actorPos<b.roundQueue.length){const a=allyById(b.roundQueue[b.actorPos]);if(a&&b.activeIds.includes(a.id)&&!a.dead&&a.hp>0)return a;b.actorPos++;}return null;}
async function emergencyDeploy(){const b=state.battle;if(!b||livingAllies().length||!livingRoster().length)return false;const reserves=benchAllies().filter(a=>!a.dead&&a.hp>0);if(!reserves.length)return false;for(let i=0;i<b.activeIds.length&&reserves.length;i++){const current=allyById(b.activeIds[i]);if(current&&!current.dead&&current.hp>0)continue;const incoming=reserves.shift();b.activeIds[i]=incoming.id;narrate(`控えの${incoming.name}が前に出た！`);}centerMessage('RESERVE IN');renderBattle();await delay(420);return livingAllies().length>0;}

function effective(stat,obj){let v=obj[stat];if(obj.allBuffTurns>0)v*=1+obj.allBuff;if(stat==='atk'&&obj.atkBuffTurns>0)v*=1+obj.atkBuff;if(stat==='def'&&obj.defBuffTurns>0)v*=1+obj.defBuff;if(stat==='spd'&&obj.spdBuffTurns>0)v*=1+obj.spdBuff;return v;}
function enemyDefense(type){const e=state.battle.enemy;let v=type==='magic'?e.res:e.def;if(e.defDebuffTurns>0)v*=1-e.defDebuff;return v;}
function calcDamage(attacker,type,power,crit=0){const source=type==='magic'?effective('mag',attacker):effective('atk',attacker);const defense=enemyDefense(type);let d=Math.max(1,source*power-defense*.34)*(.91+Math.random()*.18);const isCrit=Math.random()<crit;if(isCrit)d*=1.65;return {value:Math.round(d),crit:isCrit};}
function calcEnemyDamage(target,power,type='physical'){const e=state.battle.enemy;const source=(type==='magic'?e.mag:e.atk)*(e.atkBuffTurns>0?1+e.atkBuff:1);const def=(type==='magic'?effective('res',target):effective('def',target));return Math.max(1,Math.round((source*power-def*.32)*(.9+Math.random()*.2)));}

function enemyMarkup(e){const tags=[];for(const [k,label] of [['poison','毒'],['burn','やけど'],['sleep','眠り'],['stun','ひるみ'],['paralyze','マヒ']])if(e.status[k]>0)tags.push(label);if(e.shieldTurns>0)tags.push('SHIELD');if(e.defDebuffTurns>0)tags.push('DEF↓↓');if(e.spdDebuffTurns>0)tags.push('SPD↓↓');return `<div class="enemy-nameplate"><div><b>${e.name}</b><small>Lv${e.level} / ${e.attribute}</small></div><div class="gauge"><i class="hp" style="width:${pct(e.hp,e.maxHp)}%"></i></div><p><span>HP</span><b>${Math.ceil(e.hp).toLocaleString()} / ${e.maxHp.toLocaleString()}</b></p><div class="enemy-tags">${tags.map(t=>`<em>${t}</em>`).join('')}</div></div><div class="enemy-sprite-wrap">${e.image?`<img id="enemySprite" src="${e.image}" alt="${e.name}">`:''}<div class="enemy-symbol ${e.image?'fallback-only':''}">${e.symbol||'敵'}</div></div>`;}
function allyMarkup(a,i){const st=Object.entries(a.status).filter(([,v])=>v>0).map(([k])=>({poison:'毒',burn:'炎',sleep:'眠',stun:'怯',paralyze:'麻'}[k])).join(' ');return `<button type="button" class="ally-hud-card ${a.dead?'dead':''} ${activeAlly()===a?'active':''}" data-hud-ally="${i}"><span class="ally-hud-art"><img src="${a.image}" alt="${a.name}"><i>${a.symbol}</i></span><b>${a.name}</b><small>Lv${a.level} ${st}</small><div class="tiny-row"><span>HP</span><em>${Math.ceil(a.hp)}</em></div><div class="gauge tiny"><i class="hp" style="width:${pct(a.hp,a.maxHp)}%"></i></div><div class="tiny-row"><span>MP</span><em>${Math.floor(a.mpNow)}</em></div><div class="gauge tiny"><i class="mp" style="width:${pct(a.mpNow,a.maxMp)}%"></i></div></button>`;}
function benchMarkup(a){return `<div class="bench-chip ${a.dead?'dead':''}"><span><img src="${a.image}" alt="${a.name}"><i>${a.symbol}</i></span><div><b>${a.name}</b><small>HP ${Math.ceil(a.hp)} / MP ${Math.floor(a.mpNow)}</small><div class="gauge tiny"><i class="hp" style="width:${pct(a.hp,a.maxHp)}%"></i></div></div></div>`;}
function renderBattle(){const b=state.battle;if(!b)return;$('#battleTurnLabel').textContent=`TURN ${b.turn}`;$('#enemyArea').innerHTML=enemyMarkup(b.enemy);$('#allyStatus').innerHTML=frontAllies().map(allyMarkup).join('');$('#benchStatus').innerHTML=benchAllies().length?benchAllies().map(benchMarkup).join(''):`<div class="no-bench">控えなし</div>`;const a=activeAlly();$('#activeActorBar').innerHTML=a?`<img src="${a.image}" alt=""><div><small>NEXT COMMAND</small><b>${a.name}</b><span>HP ${Math.ceil(a.hp)} / MP ${Math.floor(a.mpNow)}</span></div>`:`<div><small>ENEMY TURN</small><b>${b.enemy.name}</b></div>`;bindImages($('#battleScreen'));setCommandDisabled(b.busy||b.finished||!a);}
function setCommandDisabled(dis){['attackBtn','skillBtn','ultimateBtn','defendBtn','switchBtn'].forEach(id=>{$('#'+id).disabled=dis;});}
function narrate(text){const b=state.battle;if(!b)return;b.narration.unshift(text);b.narration=b.narration.slice(0,5);$('#battleNarration').innerHTML=b.narration.map((x,i)=>`<div class="${i===0?'new':''}">${x}</div>`).join('');}
function centerMessage(text){const el=$('#centerMessage');el.textContent=text;el.classList.remove('play');void el.offsetWidth;el.classList.add('play');}
function floatNumber(value,kind='damage'){const el=document.createElement('div');el.className=`float-number ${kind}`;el.textContent=(kind==='heal'?'+':'')+Math.round(value);$('#battleFxLayer').appendChild(el);setTimeout(()=>el.remove(),900/state.speed);}
function pulseEnemy(cls='hit'){const el=$('#enemySprite')||$('.enemy-symbol');if(!el)return;el.classList.remove('enemy-hit','enemy-cast');void el.offsetWidth;el.classList.add(cls==='cast'?'enemy-cast':'enemy-hit');}
function fx(type='slash'){const el=document.createElement('div');el.className=`simple-fx ${type}`;$('#battleFxLayer').appendChild(el);setTimeout(()=>el.remove(),700/state.speed);}

async function skillSprite(frames){if(!frames?.length){fx('magic');return;}const wrap=$('#skillSpriteFx'),img=$('img',wrap);wrap.hidden=false;for(const src of frames){setImage(img,src,'');await delay(105);}await delay(120);wrap.hidden=true;}
async function ultimateCutin(a,u){const wrap=$('#ultimateCutin');setImage($('#cutinCharacter'),a.image,'');setImage($('#cutinUltArt'),u.image,'');$('#cutinName').textContent=a.name;$('#cutinQuote').textContent=`「${u.name}！」`;$('#cutinUltFallback').textContent=u.name;wrap.hidden=false;wrap.classList.remove('play');void wrap.offsetWidth;wrap.classList.add('play');await delay(1150);wrap.hidden=true;wrap.classList.remove('play');}

function wakeEnemyOnHit(){const e=state.battle.enemy;if(e.status.sleep>0&&Math.random()<.70){e.status.sleep=0;narrate(`${e.name}は眠りから覚めた！`);}}
function applyEnemyDamage(a,power,type='physical',crit=0){const e=state.battle.enemy;const r=calcDamage(a,type,power,crit);let d=r.value;if(e.shieldTurns>0)d=Math.round(d*(1-(e.damageReduction||.2)));e.hp=Math.max(0,e.hp-d);floatNumber(d,r.crit?'crit':'damage');fx(type==='magic'?'magic':'slash');pulseEnemy();wakeEnemyOnHit();renderBattle();return {...r,value:d};}
function heal(a,amount){if(a.dead)return 0;const before=a.hp;a.hp=Math.min(a.maxHp,a.hp+amount);const h=Math.round(a.hp-before);if(h>0)floatNumber(h,'heal');return h;}
function healTeam(ratio){let t=0;livingAllies().forEach(a=>t+=heal(a,a.maxHp*ratio));renderBattle();return t;}
function restoreMpTeam(ratio){livingAllies().forEach(a=>a.mpNow=Math.min(a.maxMp,a.mpNow+a.maxMp*ratio));renderBattle();}
function cleanse(a){Object.keys(a.status).forEach(k=>a.status[k]=0);}
function applyBossStatus(kind,chance,turns=3){const e=state.battle.enemy;let c=chance;if(e.isBoss&&(kind==='paralyze'||kind==='sleep'))c*=.25;if(Math.random()>=c)return false;const dur=e.isBoss?rint(1,2):turns;e.status[kind]=Math.max(e.status[kind],dur);return true;}

async function checkSpecialRevives(){const allies=frontAllies();const pink=allies.find(a=>a.id==='pink'&&!a.dead&&!a.pinkReviveUsed);for(const a of allies){if(a.dead&&a.id==='lilith'&&!a.lilithReviveUsed){a.dead=false;a.lilithReviveUsed=true;a.transformed=true;a.hp=Math.round(a.maxHp*.60);a.atk*=1.2;a.mag*=1.2;a.def*=1.2;a.res*=1.2;a.spd*=1.2;narrate('モブリリスはウルモブリリスへ変身して復活した！');centerMessage('UL MOB LILITH');renderBattle();await delay(450);}else if(a.dead&&pink&&!pink.pinkReviveUsed&&a.id!=='pink'){pink.pinkReviveUsed=true;pink.hp=Math.max(1,Math.floor(pink.hp*.5));a.dead=false;a.hp=Math.round(a.maxHp*.35);narrate(`モブピンクの「支える力」！ ${a.name}が復活した！`);centerMessage('REVIVE');renderBattle();await delay(450);break;}}
}
function maybeArtistCleanse(target){const riro=livingAllies().find(a=>a.id==='riro');if(riro&&target&&Math.random()<.5){cleanse(target);narrate(`モブリーロの「アーティスト・マインド」！ ${target.name}の状態異常を解除！`);return true;}return false;}

async function performAttack(a){narrate(`${a.name}の攻撃！`);let crit=a.id==='denden'?.25:.05;let r=applyEnemyDamage(a,1,'physical',crit);narrate(`${state.battle.enemy.name}に${r.value}ダメージ！${r.crit?' 会心の一撃！':''}`);if(a.id==='tetsu'&&state.battle.enemy.hp>0&&Math.random()<.30){await delay(180);const r2=applyEnemyDamage(a,.85,'physical',.05);narrate(`テツの意志！ 2回目の攻撃で${r2.value}ダメージ！`);}await delay(330);}
async function performMagic(a){const element=normalizeElement(a.attribute);const s=MOB_DATA.elements[element];if(a.mpNow<s.cost){narrate(`${a.name}はMPが足りない！`);await delay(260);return;}a.mpNow-=s.cost;narrate(`${a.name}は${s.spell}を唱えた！`);await skillSprite(s.frames);const r=applyEnemyDamage(a,s.power,'magic',.03);narrate(`${s.spell}！ ${state.battle.enemy.name}に${r.value}ダメージ！`);if(a.id==='jerry'&&element==='雷'&&state.battle.enemy.hp>0&&Math.random()<.5){await delay(170);narrate('ダブルサンダー！ 同じ魔法がもう一度発動！');await skillSprite(s.frames);const r2=applyEnemyDamage(a,s.power*.9,'magic');narrate(`追加で${r2.value}ダメージ！`);}await delay(300);}

async function performUltimate(a,u){if(a.mpNow<u.cost){narrate(`${a.name}はMPが足りない！`);return false;}a.mpNow-=u.cost;narrate(`${a.name}は必殺技「${u.name}」を放つ！`);await ultimateCutin(a,u);let r,total=0;
  const hit=async(power=u.power,type=u.type||'physical',crit=u.crit||0)=>{r=applyEnemyDamage(a,power,type,crit);total+=r.value;await delay(110);return r;};
  switch(u.kind){
    case'selfAllBuff':a.allBuff=.20;a.allBuffTurns=rint(3,5);a.damageCut=.10;a.damageCutTurns=a.allBuffTurns;fx('buff');narrate(`${a.name}の全能力が20%上がり、受けるダメージも軽減！`);break;
    case'jumanji':await hit();a.atkBuff=.15;a.atkBuffTurns=3;state.battle.enemy.defDebuff=.12;state.battle.enemy.defDebuffTurns=3;narrate(`${total}ダメージ！ 自身ATK↑、敵DEF↓！`);break;
    case'lowHpBurst':{const avg=livingAllies().reduce((s,x)=>s+x.hp/x.maxHp,0)/Math.max(1,livingAllies().length);await hit(u.power*(1+(1-avg)*.65),'magic');narrate(`${total}ダメージ！ 残りHPが力に変わった！`);break;}
    case'heroTransform':heal(a,a.maxHp*.5);a.transformed=true;a.allBuff=.30;a.allBuffTurns=99;setImage($('#cutinCharacter'),'play/13.png','');narrate(`${a.name}は「あのヒーロー」に変身！ 全能力30%アップ！`);break;
    case'shieldAttack':await hit();a.guard=.20;a.guardTurns=1;narrate(`${total}ダメージ！ ${a.name}はシールドを構えた！`);break;
    case'healCleanse':healTeam(u.power);livingAllies().forEach(x=>{if(Math.random()<.5)cleanse(x);});fx('heal');narrate('味方全体を回復！ 状態異常解除判定！');break;
    case'yushaGuardAttack':await hit();state.battle.yushaGuard=.50;state.battle.yushaGuardTurns=1;narrate(`${total}ダメージ！ このターン勇者を50%軽減！`);break;
    case'teamGuardAttack':await hit();state.battle.teamGuard=.30;state.battle.teamGuardTurns=1;narrate(`${total}ダメージ！ 味方全体を30%軽減！`);break;
    case'selfHealAttack':heal(a,a.maxHp*.18);await hit();narrate(`自身を回復し、${total}ダメージ！`);break;
    case'goldAttack':await hit();narrate(`${total}ダメージ！ トレーニングではゴールド獲得効果なし。`);break;
    case'speedDebuffAttack':await hit();state.battle.enemy.spdDebuff=.18;state.battle.enemy.spdDebuffTurns=3;narrate(`${total}ダメージ！ 敵SPD↓↓`);break;
    case'burnAttack':await hit();if(applyBossStatus('burn',u.chance,3))narrate(`${total}ダメージ！ ${state.battle.enemy.name}はやけど状態！`);else narrate(`${total}ダメージ！`);break;
    case'teamDefAttack':livingAllies().forEach(x=>{x.defBuff=.18;x.defBuffTurns=3;});await hit();narrate(`${total}ダメージ！ 味方全体DEF↑↑`);break;
    case'selfCleanseAttack':cleanse(a);await hit();narrate(`状態異常を解除し、${total}ダメージ！`);break;
    case'sleepAttack':await hit();if(applyBossStatus('sleep',u.chance,3))narrate(`${total}ダメージ！ ${state.battle.enemy.name}を眠らせた！`);else narrate(`${total}ダメージ！`);break;
    case'paralyzeAttack':await hit();if(applyBossStatus('paralyze',u.chance,3))narrate(`${total}ダメージ！ ${state.battle.enemy.name}はマヒした！`);else narrate(`${total}ダメージ！ マヒは効かなかった。`);break;
    case'selfSpdAttack':await hit();a.spdBuff=.20;a.spdBuffTurns=3;narrate(`${total}ダメージ！ ${a.name}のSPD↑↑`);break;
    case'multiAttack':{const n=rint(u.hits[0],u.hits[1]);for(let i=0;i<n&&state.battle.enemy.hp>0;i++)await hit(u.power,u.type);narrate(`${n}回攻撃！ 合計${total}ダメージ！`);break;}
    case'teamRecovery':healTeam(u.power);restoreMpTeam(.13);livingAllies().forEach(x=>{x.defBuff=.15;x.defBuffTurns=3;});narrate('味方全体のHP・MP回復＋DEF↑！');break;
    case'stunAttack':await hit();if(applyBossStatus('stun',u.chance,1))narrate(`${total}ダメージ！ ${state.battle.enemy.name}をひるませた！`);else narrate(`${total}ダメージ！`);break;
    case'selfRecoveryAttack':await hit();heal(a,a.maxHp*.16);a.mpNow=Math.min(a.maxMp,a.mpNow+a.maxMp*.12);narrate(`${total}ダメージ！ 自身のHP・MPを回復！`);break;
    case'teamHealGuard':healTeam(u.power);state.battle.teamGuard=.10;state.battle.teamGuardTurns=3;narrate('味方全体を中回復＋受けるダメージ10%軽減！');break;
    case'fullHealBarrier':heal(a,a.maxHp);livingAllies().forEach(x=>x.barrier=1);narrate('自身全回復！ 味方全体に1回無効バリア！');break;
    case'teamAtkAttack':livingAllies().forEach(x=>{x.atkBuff=.15;x.atkBuffTurns=3;});await hit();narrate(`${total}ダメージ！ 味方全体ATK↑！`);break;
    case'healAttack':healTeam(u.heal);await hit();narrate(`味方を回復し、${total}ダメージ！`);break;
    case'tetsuFinal':a.atkBuff=.18;a.atkBuffTurns=3;state.battle.enemy.defDebuff=.18;state.battle.enemy.defDebuffTurns=3;await hit();narrate(`${total}ダメージ！ 自身ATK↑、敵DEF↓↓！`);break;
    case'healStunAttack':healTeam(u.heal);restoreMpTeam(.14);await hit();if(applyBossStatus('stun',u.chance,1))narrate(`味方を回復し${total}ダメージ！ 敵をひるませた！`);else narrate(`味方を回復し${total}ダメージ！`);break;
    case'poisonAttack':await hit();if(applyBossStatus('poison',u.chance,3))narrate(`${total}ダメージ！ 敵を毒にした！`);else narrate(`${total}ダメージ！`);break;
    case'narakuShield':a.guard=.20;a.guardTurns=3;state.battle.teamGuard=.10;state.battle.teamGuardTurns=3;narrate('自身20%軽減＋味方全体10%軽減！');break;
    case'selfAtkAttack':a.atkBuff=.18;a.atkBuffTurns=3;await hit();narrate(`自身ATK↑！ ${total}ダメージ！`);break;
    case'damage':default:await hit();narrate(`${state.battle.enemy.name}に${total}ダメージ！${r?.crit?' 会心！':''}`);break;
  }
  renderBattle();await delay(360);return true;
}

async function applyEnemyDot(){const e=state.battle.enemy;if(e.status.poison>0){const d=Math.round(e.maxHp*.035);e.hp=Math.max(0,e.hp-d);e.status.poison--;floatNumber(d);narrate(`${e.name}は毒で${d}ダメージ！`);await delay(180);}if(e.status.burn>0&&e.hp>0){const d=Math.round(e.maxHp*.035);e.hp=Math.max(0,e.hp-d);e.status.burn--;floatNumber(d);narrate(`${e.name}はやけどで${d}ダメージ！`);await delay(180);}renderBattle();}
async function applyAllyDots(){for(const a of livingAllies()){if(a.status.poison>0){const d=Math.round(a.maxHp*.045);a.hp=Math.max(0,a.hp-d);a.status.poison--;narrate(`${a.name}は毒で${d}ダメージ！`);if(a.hp<=0)a.dead=true;await delay(130);}if(!a.dead&&a.status.burn>0){const d=Math.round(a.maxHp*.04);a.hp=Math.max(0,a.hp-d);a.status.burn--;narrate(`${a.name}はやけどで${d}ダメージ！`);if(a.hp<=0)a.dead=true;await delay(130);}}await checkSpecialRevives();renderBattle();}

function reductionFor(target){let mult=1;if(target.guardTurns>0)mult*=1-target.guard;if(target.damageCutTurns>0)mult*=1-target.damageCut;if(state.battle.teamGuardTurns>0)mult*=1-state.battle.teamGuard;if(target.id==='yusha'&&state.battle.yushaGuardTurns>0)mult*=1-state.battle.yushaGuard;if(livingAllies().some(a=>a.id==='desert')&&Math.random()<.20){mult*=.80;narrate('サバクノマモリビト！ ダメージを軽減！');}return mult;}
async function damageAlly(target,power,type='physical'){if(target.barrier>0){target.barrier--;narrate(`${target.name}のバリアが攻撃を無効化した！`);return 0;}let d=Math.round(calcEnemyDamage(target,power,type)*reductionFor(target));target.hp=Math.max(0,target.hp-d);if(target.hp<=0)target.dead=true;renderBattle();await checkSpecialRevives();return d;}
async function inflictAllyStatus(target,kind,turns){if(target.dead)return false;target.status[kind]=Math.max(target.status[kind],turns);if(maybeArtistCleanse(target))return false;return true;}

async function enemyTurn(){const b=state.battle,e=b.enemy;if(e.hp<=0)return finishBattle(true);b.busy=true;renderBattle();await applyEnemyDot();if(e.hp<=0)return finishBattle(true);
  if(e.status.sleep>0){e.status.sleep--;narrate(`${e.name}は眠っている！`);await delay(350);return endRound();}
  if(e.status.stun>0){e.status.stun--;narrate(`${e.name}はひるんで動けない！`);await delay(350);return endRound();}
  if(e.status.paralyze>0){e.status.paralyze--;narrate(`${e.name}はマヒして動けない！`);await delay(350);return endRound();}
  const special=b.turn%3===0;
  if(special)await bossSpecial();else await bossNormal();
  if(!livingAllies().length){if(await emergencyDeploy())return endRound();if(!livingRoster().length)return finishBattle(false);}return endRound();
}
async function bossNormal(){const e=state.battle.enemy,t=pick(livingAllies());narrate(`${e.name}の攻撃！`);pulseEnemy('cast');await delay(180);const d=await damageAlly(t,1);fx('enemy');narrate(`${t.name}に${d}ダメージ！`);await delay(320);}
async function bossSpecial(){const e=state.battle.enemy,targets=livingAllies();centerMessage(e.special);pulseEnemy('cast');narrate(`${e.name}は「${e.special}」を使った！`);await delay(300);const hit=async(t,m=e.power||1.5,type='physical')=>{const d=await damageAlly(t,m,type);await delay(100);return d;};let t,d,total=0;
  switch(e.kind){
    case'shield':e.damageReduction=.20;e.shieldTurns=3;fx('buff');narrate(`${e.name}はシールドを展開！ 受けるダメージ20%軽減！`);break;
    case'poisonSingle':t=pick(targets);d=await hit(t);if(Math.random()<.5&&await inflictAllyStatus(t,'poison',3))narrate(`${t.name}に${d}ダメージ！ 毒におかされた！`);else narrate(`${t.name}に${d}ダメージ！`);break;
    case'burnSingle':t=pick(targets);d=await hit(t,e.power,'magic');if(Math.random()<.5&&await inflictAllyStatus(t,'burn',3))narrate(`${t.name}に${d}ダメージ！ やけど状態！`);else narrate(`${t.name}に${d}ダメージ！`);break;
    case'stunSingle':t=pick(targets);d=await hit(t,e.power,'magic');await inflictAllyStatus(t,'stun',1);narrate(`${t.name}に${d}ダメージ！ ひるませた！`);break;
    case'doubleSingleStun':t=pick(targets);total+=await hit(t,e.power,'magic');if(!t.dead)total+=await hit(t,e.power,'magic');await inflictAllyStatus(t,'stun',1);narrate(`${t.name}に合計${total}ダメージ！`);break;
    case'singlePlusAoe':t=pick(targets);total+=await hit(t,e.power,'magic');for(const a of [...livingAllies()])total+=await hit(a,.52,'magic');narrate(`ネオンボム！ 合計${total}ダメージ！`);break;
    case'multi':case'multiFixed':{const n=rint(e.hits?.[0]||3,e.hits?.[1]||6);for(let i=0;i<n&&livingAllies().length;i++)total+=await hit(pick(livingAllies()),e.power);narrate(`${n}回攻撃！ 合計${total}ダメージ！`);break;}
    case'healSingle':t=pick(targets);d=await hit(t,e.power,'magic');const h=Math.round(e.maxHp*.06);e.hp=Math.min(e.maxHp,e.hp+h);floatNumber(h,'heal');narrate(`${t.name}に${d}ダメージ！ ${e.name}はHPを${h}回復！`);break;
    case'buffAoe':e.atkBuff=.18;e.atkBuffTurns=3;for(const a of [...livingAllies()])total+=await hit(a,e.power,'magic');narrate(`ATK↑！ 味方全体に合計${total}ダメージ！`);break;
    case'doubleAoe':for(let n=0;n<2;n++)for(const a of [...livingAllies()])total+=await hit(a,e.power);narrate(`将軍進撃！ 全体2回攻撃で合計${total}ダメージ！`);break;
    case'aoeStun':for(const a of [...livingAllies()]){total+=await hit(a,e.power,'magic');if(!a.dead&&Math.random()<.7)await inflictAllyStatus(a,'stun',1);}narrate(`全体に${total}ダメージ！ ひるみ判定！`);break;
    case'aoe':for(const a of [...livingAllies()])total+=await hit(a,e.power,e.attribute.includes('火')||e.attribute.includes('闇')?'magic':'physical');narrate(`味方全体に合計${total}ダメージ！`);break;
    case'single':default:t=pick(targets);d=await hit(t,e.power||1.55);narrate(`${t.name}に${d}ダメージ！`);break;
  }renderBattle();await delay(380);
}

async function startRound(){const b=state.battle;if(!b||b.finished)return;b.busy=true;b.actorPos=0;await applyAllyDots();if(!livingAllies().length){if(!(await emergencyDeploy())&&!livingRoster().length)return finishBattle(false);}b.roundQueue=livingAllies().map(a=>a.id);
  for(const a of livingAllies()){
    if(a.id==='nekoku'&&Math.random()<.30){const target=[...livingAllies()].sort((x,y)=>x.hp/x.maxHp-y.hp/y.maxHp)[0];const h=heal(target,target.maxHp*.14);narrate(`癒しのプニプニ！ ${target.name}のHPが${h}回復！`);}
    if(a.id==='money'&&Math.random()<.30){const m=Math.round(a.maxMp*.12);a.mpNow=Math.min(a.maxMp,a.mpNow+m);narrate(`マニーは海を渡る！ MPが${m}回復！`);}
    if(a.id==='naraku'){a.narakuStacks++;a.allBuff=Math.min(.80,a.narakuStacks*.10);a.allBuffTurns=99;narrate(`魔王の系譜！ モブナラクの全能力がさらに上がった！`);}
  }
  b.busy=false;renderBattle();await skipDisabledActors();if(b.auto&&!b.finished)setTimeout(autoAct,120);
}
async function skipDisabledActors(){let a=activeAlly();while(a&&!state.battle.finished){if(a.status.sleep>0){a.status.sleep--;narrate(`${a.name}は眠っている！`);state.battle.actorPos++;await delay(250);}else if(a.status.stun>0){a.status.stun--;narrate(`${a.name}はひるんで動けない！`);state.battle.actorPos++;await delay(250);}else if(a.status.paralyze>0){narrate(`${a.name}はマヒして動けない！`);state.battle.actorPos++;await delay(250);}else break;a=activeAlly();}renderBattle();if(!a&&!state.battle.finished)await enemyTurn();}
async function endRound(){const b=state.battle;if(b.finished)return;if(b.enemy.shieldTurns>0)b.enemy.shieldTurns--;if(b.enemy.atkBuffTurns>0)b.enemy.atkBuffTurns--;if(b.enemy.defDebuffTurns>0)b.enemy.defDebuffTurns--;if(b.enemy.spdDebuffTurns>0)b.enemy.spdDebuffTurns--;if(b.teamGuardTurns>0)b.teamGuardTurns--;if(b.yushaGuardTurns>0)b.yushaGuardTurns--;frontAllies().forEach(a=>{if(a.guardTurns>0)a.guardTurns--;if(a.damageCutTurns>0)a.damageCutTurns--;if(a.atkBuffTurns>0)a.atkBuffTurns--;if(a.defBuffTurns>0)a.defBuffTurns--;if(a.spdBuffTurns>0)a.spdBuffTurns--;if(a.allBuffTurns>0&&a.allBuffTurns<90)a.allBuffTurns--;});b.turn++;centerMessage(`TURN ${b.turn}`);await delay(200);startRound();}

async function act(kind,payload){const b=state.battle,a=activeAlly();if(!b||!a||b.busy||b.finished)return;b.busy=true;setCommandDisabled(true);let consumed=true;
  if(kind==='attack')await performAttack(a);else if(kind==='magic')await performMagic(a);else if(kind==='ultimate')consumed=await performUltimate(a,payload);else if(kind==='defend'){a.guard=.45;a.guardTurns=1;narrate(`${a.name}は身を守っている！`);fx('buff');await delay(260);}else if(kind==='switch')consumed=await performSwitch(a,payload);if(!consumed){b.busy=false;renderBattle();return;}
  if(b.enemy.hp<=0)return finishBattle(true);b.actorPos++;b.busy=false;renderBattle();await skipDisabledActors();if(b.auto&&!b.finished&&activeAlly())setTimeout(autoAct,120);
}
async function performSwitch(actor,payload){const b=state.battle;if(!payload)return false;const outId=payload.outId,inId=payload.inId;const slot=b.activeIds.indexOf(outId),incoming=allyById(inId),outgoing=allyById(outId);if(slot<0||!incoming||b.activeIds.includes(inId))return false;if(incoming.dead||incoming.hp<=0){toast('戦闘不能の控えとは交代できません');return false;}b.activeIds[slot]=inId;$('#skillMenu').hidden=true;narrate(`${outgoing.name}が控えへ下がり、${incoming.name}が前に出た！`);centerMessage('CHANGE');renderBattle();await delay(420);return true;}
function openSwitchMenu(){const b=state.battle,a=activeAlly();if(!b||!a)return;const reserves=benchAllies();if(!reserves.length)return toast('交代できる控えがいません');$('#skillMenu').hidden=false;$('#skillMenuKicker').textContent=`${a.name}の行動 / 交代するとターンを消費` ;$('#skillMenuTitle').textContent='メンバー交代';const list=$('#skillMenuList');list.innerHTML=`<div class="switch-guide">交代で下げるメインメンバーを選択</div><div class="switch-front-grid">${frontAllies().map(x=>`<button class="switch-person ${x.id===a.id?'recommended':''}" data-switch-out="${x.id}" type="button"><span><img src="${x.image}" alt=""><i>${x.symbol}</i></span><div><b>${x.name}</b><small>${x.dead?'戦闘不能':`HP ${Math.ceil(x.hp)} / MP ${Math.floor(x.mpNow)}`}</small></div></button>`).join('')}</div><div class="switch-guide reserve">控えから出すメンバーを選択</div><div class="switch-reserve-grid">${reserves.map(x=>`<button class="switch-person ${x.dead?'disabled':''}" data-switch-in="${x.id}" type="button" ${x.dead?'disabled':''}><span><img src="${x.image}" alt=""><i>${x.symbol}</i></span><div><b>${x.name}</b><small>${x.dead?'戦闘不能':`HP ${Math.ceil(x.hp)} / MP ${Math.floor(x.mpNow)}`}</small></div></button>`).join('')}</div><div id="switchSelectionText" class="switch-selection">下げるメンバー：${a.name}</div>`;bindImages(list);let outId=a.id;$$('[data-switch-out]',list).forEach(btn=>btn.onclick=()=>{outId=btn.dataset.switchOut;$$('[data-switch-out]',list).forEach(x=>x.classList.toggle('chosen',x.dataset.switchOut===outId));const o=allyById(outId);$('#switchSelectionText').textContent=`下げるメンバー：${o.name}`;});const first=$(`[data-switch-out="${a.id}"]`,list);if(first)first.classList.add('chosen');$$('[data-switch-in]',list).forEach(btn=>btn.onclick=()=>{if(btn.disabled)return;const inId=btn.dataset.switchIn;$('#skillMenu').hidden=true;act('switch',{outId,inId});});}

async function autoAct(){const b=state.battle,a=activeAlly();if(!b||!a||!b.auto||b.busy||b.finished)return;const usable=a.ults.filter(u=>a.mpNow>=u.cost);if(usable.length&&Math.random()<.36)await act('ultimate',pick(usable));else if(a.mpNow>=(MOB_DATA.elements[normalizeElement(a.attribute)]?.cost||99)&&Math.random()<.35)await act('magic');else await act('attack');}

function openSkillMenu(type){const a=activeAlly();if(!a)return;const list=$('#skillMenuList');$('#skillMenu').hidden=false;if(type==='magic'){const s=MOB_DATA.elements[normalizeElement(a.attribute)];$('#skillMenuKicker').textContent=`${a.name} / MP ${Math.floor(a.mpNow)}`;$('#skillMenuTitle').textContent='技・魔法';list.innerHTML=`<button class="skill-item" data-use-magic type="button"><span class="skill-symbol">${normalizeElement(a.attribute)}</span><div><b>${s.spell}</b><small>${normalizeElement(a.attribute)}属性の中ダメージ</small></div><em>MP ${s.cost}</em></button>`;bindImages(list);$('[data-use-magic]').onclick=()=>{$('#skillMenu').hidden=true;act('magic');};}else{$('#skillMenuKicker').textContent=`${a.name} / MP ${Math.floor(a.mpNow)}`;$('#skillMenuTitle').textContent='必殺技';list.innerHTML=a.ults.map((u,i)=>`<button class="skill-item ${a.mpNow<u.cost?'disabled':''}" data-ult-index="${i}" type="button"><span class="ult-thumb"><img src="${u.image}" alt=""><i>必</i></span><div><b>${u.name}</b><small>${u.desc}</small></div><em>MP ${u.cost}</em></button>`).join('');bindImages(list);$$('[data-ult-index]').forEach(btn=>btn.onclick=()=>{const u=a.ults[Number(btn.dataset.ultIndex)];if(a.mpNow<u.cost)return toast('MPが足りません');$('#skillMenu').hidden=true;act('ultimate',u);});}}

function persistAdventureVitals(){if(!state.battle)return;state.adventure.vitals={};state.battle.allies.forEach(a=>{state.adventure.vitals[a.id]={hp:Math.max(0,a.hp),mp:Math.max(0,a.mpNow)};});}
function finishBattle(win){const b=state.battle;if(!b||b.finished)return;b.finished=true;b.auto=false;$('#autoBtn').classList.remove('active');$('#autoBtn').textContent='AUTO';setCommandDisabled(true);centerMessage(win?'VICTORY!':'DEFEAT...');
  if(b.mode==='adventure')persistAdventureVitals();
  if(win&&b.mode==='adventure'){if(b.isBoss){state.adventure.completed=true;state.adventure.battleReady=false;}else{state.adventure.progress=Math.min(3,state.adventure.progress+1);state.adventure.battleReady=false;}}
  $('#resultTitle').textContent=win?'VICTORY':'DEFEAT';$('#resultKicker').textContent=b.mode==='adventure'?(b.isBoss?'GRASSLAND BOSS':'GRASSLAND BATTLE'):'TRAINING RESULT';$('#resultText').textContent=win?`${b.enemy.name} Lv${b.enemy.level} を撃破！ / ${b.turn}ターン`:`${b.enemy.name} Lv${b.enemy.level} / ${b.turn}ターン目で全滅`;
  $('#resultRetryBtn').style.display=b.mode==='training'?'block':'none';$('#resultSetupBtn').textContent=b.mode==='training'?'トレーニングへ戻る':'草原へ戻る';setTimeout(()=>{$('#resultOverlay').hidden=false;},450/state.speed);
}

async function startAdventureBattle(){const adv=MOB_DATA.adventure,prog=state.adventure.progress;if(!state.adventure.battleReady)return;if(prog===3){const e=buildBossEnemy(boss(adv.bossId),adv.level+8,Math.min(4,state.party.length));beginBattle({mode:'adventure',returnScreen:'adventure',enemy:e,party:state.party,useAdventureVitals:true});}else{const raw=adv.normalEnemies[prog];const area=adv.areas[prog];const e=buildNormalEnemy(raw,adv.level+prog*2,Math.min(4,state.party.length),area.bg);beginBattle({mode:'adventure',returnScreen:'adventure',enemy:e,party:state.party,useAdventureVitals:true});}}
function resetTrainingBattle(){const p=trainingParty();beginBattle({mode:'training',returnScreen:'training',bossId:state.training.bossId,bossLevel:state.training.bossLevel,party:p});}

function openHomeAction(action){
  if(action==='home')return toast('ここがHOMEです');
  if(['equipment','items','settings'].includes(action))return toast(`${action==='equipment'?'装備':action==='items'?'持ち物':'設定'}は次の実装用に入口を残しています`);
  if(action==='castle')return dialog('お城に向かいますか？\nMOB SHOPや宿舎は、まだ中身の素材・仕様待ちです。',[['はい','yes'],['いいえ','no']]).then(v=>{if(v==='yes')toast('お城内部は次の実装対象です');});
  if(action==='tavern')return dialog('酒場に向かいますか？\nパーティー編成が出来ます！',[['はい','yes','primary'],['いいえ','no']]).then(v=>{if(v==='yes')travelTo('tavern','酒場へ向かっています…',renderTavern);});
  if(action==='training')return dialog('トレーニングに向かいますか？\nパーティーとボスを自由に設定してテスト戦闘が出来ます！',[['はい','yes','primary'],['いいえ','no']]).then(v=>{if(v==='yes')travelTo('training','トレーニングルームへ向かっています…',renderTraining);});
  if(action==='adventure')return dialog('冒険に向かいますか？\n今回の目的地は「草原」です！',[['はい','yes','primary'],['いいえ','no']]).then(v=>{if(v==='yes')travelTo('adventure','草原へ出発です！',()=>{renderAdventure();setTimeout(()=>dialog('草原に到着しました！\nまずはじっくり探索してみましょう！\nそれとも一度ゆっくり休みますか？',[['冒険を始める','ok','primary']]),100);});});
}

function randomTraining(){const arr=[...MOB_DATA.players].sort(()=>Math.random()-.5).slice(0,8);state.training.party=arr.map(p=>[p.id,rint(15,80)]);state.training.bossId=pick(MOB_DATA.bosses).id;state.training.bossLevel=rint(15,80);state.training.filter='ALL';renderTraining();}
function resetAdventure(){state.adventure={progress:0,battleReady:false,completed:false,vitals:null};renderAdventure();}

function lockMobileGestures(){
  document.addEventListener('contextmenu',e=>e.preventDefault());document.addEventListener('dragstart',e=>e.preventDefault());document.addEventListener('selectstart',e=>{if(!['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))e.preventDefault();});
  ['gesturestart','gesturechange','gestureend'].forEach(t=>document.addEventListener(t,e=>e.preventDefault(),{passive:false}));document.addEventListener('touchmove',e=>{if(e.touches?.length>1)e.preventDefault();},{passive:false});let last=0;document.addEventListener('touchend',e=>{const now=Date.now();if(now-last<300)e.preventDefault();last=now;},{passive:false});document.addEventListener('dblclick',e=>e.preventDefault(),{passive:false});
}
function bindEvents(){
  $$('[data-home-action]').forEach(b=>b.addEventListener('click',()=>openHomeAction(b.dataset.homeAction)));$$('[data-back-home]').forEach(b=>b.addEventListener('click',()=>{renderHome();showScreen('home');}));
  $('#tavernResetBtn').onclick=()=>{state.party=defaultParty.map(x=>[...x]);state.tavernSwapIndex=null;renderTavern();};$('#savePartyBtn').onclick=()=>{if(state.party.length<1)return;saveParty();state.training.party=state.party.map(x=>[...x]);renderHome();toast('パーティーを保存しました');showScreen('home');};
  $('#trainingBackBtn').onclick=()=>{renderHome();showScreen('home');};$('#trainingRandomBtn').onclick=randomTraining;$('#allLevelBtn').onclick=()=>{state.training.party=trainingParty().map(x=>[x[0],50]);renderTraining();};$('#bossLevel').oninput=e=>{state.training.bossLevel=clamp(Number(e.target.value),1,99);$('#bossLevelValue').textContent=state.training.bossLevel;renderSelectedBoss();};$('#startTrainingBattleBtn').onclick=resetTrainingBattle;
  $('#adventureBackBtn').onclick=()=>{renderHome();showScreen('home');};$('#exploreBtn').onclick=exploreField;$('#campBtn').onclick=()=>{state.adventure.vitals=null;toast('キャンプでHP・MPを全回復しました');};$('#fieldBattleBtn').onclick=startAdventureBattle;
  $('#battleBackBtn').onclick=()=>{if(!state.battle)return;state.battle.auto=false;if(state.battle.mode==='adventure'){renderAdventure();showScreen('adventure');}else{renderTraining();showScreen('training');}};
  $('#attackBtn').onclick=()=>act('attack');$('#skillBtn').onclick=()=>openSkillMenu('magic');$('#ultimateBtn').onclick=()=>openSkillMenu('ultimate');$('#defendBtn').onclick=()=>act('defend');$('#switchBtn').onclick=openSwitchMenu;$$('[data-close-sheet]').forEach(b=>b.onclick=()=>{$('#skillMenu').hidden=true;});
  $('#autoBtn').onclick=()=>{const b=state.battle;if(!b||b.finished)return;b.auto=!b.auto;$('#autoBtn').classList.toggle('active',b.auto);$('#autoBtn').textContent=b.auto?'AUTO ON':'AUTO';if(b.auto&&!b.busy)autoAct();};$('#speedBtn').onclick=()=>{state.speed=state.speed===1?1.5:state.speed===1.5?2:1;$('#speedBtn').textContent=`×${state.speed}`;};
  $('#resultRetryBtn').onclick=()=>resetTrainingBattle();$('#resultSetupBtn').onclick=()=>{if(!state.battle)return;$('#resultOverlay').hidden=true;if(state.battle.mode==='adventure'){renderAdventure();showScreen('adventure');}else{renderTraining();showScreen('training');}};$('#resultHomeBtn').onclick=()=>{$('#resultOverlay').hidden=true;renderHome();showScreen('home');};
}

lockMobileGestures();initCommonNav();bindImages();bindEvents();renderHome();
})();
