/* Presentation extension; v252 IDs and save records intentionally retained. */
let rushPageV253=0,rushFilterV253='all',rushSceneDoneV253=null;
function rushMedalV253(id){return RUSH_DATA_V252.medals.find(m=>m.id===id);}
function rushMedallionV253(m,large=false){return `<span class="rush-medallion-v253${large?' large':''}" role="img" aria-label="${rushTextV252(m.name)} メダル"><img src="${m.image}" alt=""><i aria-hidden="true"></i></span>`;}
function rushFilteredV253(){return RUSH_DATA_V252.quests.filter(q=>rushFilterV253==='open'?rushOpenV252(q):rushFilterV253==='locked'?!rushUnlockedV252(q):rushFilterV253==='clear'?rushClearedV252(q):true).slice().sort((a,b)=>a.recommendedLevel-b.recommendedLevel);}
rushMenuV252=function(){
 const root=$('#trainingFeaturePanel');root.hidden=false;const list=rushFilteredV253(),pages=Math.max(1,Math.ceil(list.length/RUSH_DATA_V252.maxVisible));rushPageV253=clamp(rushPageV253,0,pages-1);
 root.innerHTML=`<section class="event-panel-v163 rush-panel-v252"><header><h2>モンスターラッシュ</h2><button data-rush-back>戻る</button></header><p>HP・MPを引き継いで連戦！<br>各クエスト初回のみ メダル1枚<br>途中の経験値・コイン・ドロップはありません</p><label class="rush-filter-v253">表示 <select data-rush-filter>${[['all','すべて'],['open','挑戦可能'],['locked','未解放'],['clear','受領済み']].map(([v,t])=>`<option value="${v}" ${v===rushFilterV253?'selected':''}>${t}</option>`).join('')}</select><span>${list.length}件 / 全${RUSH_DATA_V252.quests.length}件</span></label><nav class="rush-pages-v253" aria-label="ラッシュ一覧ページ"><button data-rush-page="-1" ${rushPageV253===0?'disabled':''}>前へ</button><b>${rushPageV253+1} / ${pages}</b><button data-rush-page="1" ${rushPageV253===pages-1?'disabled':''}>次へ</button></nav><div class="rush-list-v252">${list.slice(rushPageV253*RUSH_DATA_V252.maxVisible,(rushPageV253+1)*RUSH_DATA_V252.maxVisible).map(q=>{
 const unlocked=rushUnlockedV252(q),m=weaponById(q.reward),waves=q.areas.reduce((n,a)=>n+a.waves.length,0);
 return `<article class="rush-card-v252" data-rush-card="${q.id}"><img class="rush-icon-v252" src="${RUSH_DATA_V252.icon}" alt="連戦クエスト"><div><h3>${rushTextV252(q.title)}</h3><p>${q.areas.length} AREA / ${waves}連戦 / 推奨Lv.${q.recommendedLevel}</p><p>${unlocked?'解放済み':rushTextV252(q.unlock.label)+'で解放'}</p>${unlocked?`<div class="rush-medal-info-v253">${rushMedallionV253(m)}<b>MEDAL<br>${rushTextV252(m.name)}</b></div><p class="rush-traits-v253">${rushTextV252(m.traitLabel)}</p>`:'<p>報酬：中ボスメダル<br>解放後に公開</p>'}<button class="primary-btn" data-rush-start="${q.id}" ${rushOpenV252(q)?'':'disabled'}>${rushClearedV252(q)?'CLEAR / 受領済み':unlocked?'挑戦する':'未解放'}</button></div></article>`;
 }).join('')||'<p>該当するクエストはありません</p>'}</div></section>`;
 $('[data-rush-back]',root).onclick=()=>{eventViewV163='story';selectedStoryV179=null;renderEventQuestsV163();};
 $('[data-rush-filter]',root).onchange=e=>{rushFilterV253=e.target.value;rushPageV253=0;rushMenuV252();};
 $$('[data-rush-page]',root).forEach(b=>b.onclick=()=>{rushPageV253+=Number(b.dataset.rushPage);rushMenuV252();root.scrollTop=0;});
 $$('[data-rush-start]',root).forEach(b=>b.onclick=()=>startRushV252(b.dataset.rushStart));bindImages(root);
};
// One explicit source line is one anchored speech bubble and one tap.
rushDialogueV252=async function(lines,r){
 if(!lines.length||eventRunV174!==r)return;const q=rushQuestV252(r.rushV252),sc=$('#storyScene');r.difficulty??=0;
 const previousScreen=$('.screen.active')?.id;let finishScene;const done=new Promise(resolve=>finishScene=resolve);rushSceneDoneV253=done;showScreen('adventure');storyBusy=true;sc.classList.add('rush-scene-v253');
 try{
  await openStoryScene(q.world,r.area,'default',[...new Set(lines.map(l=>l.speaker).filter(id=>id!=='v179-phoenix'))]);
  $('#adventureStageTitle').textContent=q.title;$('#adventureProgress').textContent=`AREA ${r.area+1}`;
  for(const line of lines){if(eventRunV174!==r)break;if(line.speaker==='v179-phoenix')await storyShowGuest(line.speaker);else if(!$('#storyGuest').hidden)await storyHideGuest();
   for(const part of line.text.split('\n')){if(eventRunV174!==r)break;await storySay(line.speaker,part);}
  }
 }finally{try{await closeStoryScene(false);sc.classList.remove('rush-scene-v253');storyBusy=false;if(eventRunV174===r&&previousScreen==='battleScreen')showScreen('battle');}finally{if(rushSceneDoneV253===done)rushSceneDoneV253=null;finishScene();}}
};
const rushClearBaseV253=clearRushV252;clearRushV252=function(){const cleared=rushClearBaseV253();if(cleared&&storyTapResolve){const resolve=storyTapResolve;storyTapResolve=null;resolve();}return cleared;};
const rushHomeSceneBaseV253=goHome;goHome=async function(...args){if(eventRunV174?.rushV252&&rushSceneDoneV253){const pending=rushSceneDoneV253;clearRushV252();await pending;}return rushHomeSceneBaseV253(...args);};
// Ignore repeated copies of the same unique medal in malformed imported equipment.
const rushTraitEntriesBaseV253=weaponTraitEntries;
weaponTraitEntries=function(a){const seen=new Set();return rushTraitEntriesBaseV253(a).filter(entry=>{if(!rushMedalV253(entry.weapon?.id))return true;const key=entry.weapon.id+':'+entry.weapon.traits.indexOf(entry.trait);if(seen.has(key))return false;seen.add(key);return true;});};
function decorateRushMedalsV253(root=document){
 for(const img of root.querySelectorAll('.inventory-row img,.equipment-slot.medal img,.weapon-picker-item img,.weapon-card img,.rush-result-v252 img.rush-reward-v252')){
  if(img.closest('.rush-medallion-v253'))continue;const row=img.closest('[data-picker-weapon],[data-weapon-id]'),m=rushMedalV253(row?.dataset.pickerWeapon||row?.dataset.weaponId)||RUSH_DATA_V252.medals.find(m=>img.alt===m.name+'メダル'||img.classList.contains('rush-reward-v252')&&img.alt===m.name);
  if(m){const container=img.closest('.inventory-row,.equipment-slot.medal,.weapon-picker-item,.weapon-card'),title=container?.querySelector('b');if(title){const [name,caption]=m.name.split('・');title.innerHTML=`<span class="rush-medal-name-v253">${rushTextV252(name)}</span><span class="rush-medal-caption-v253">${rushTextV252(caption||'連戦の証')} / MEDAL</span>`;}if(container?.classList.contains('inventory-row')&&container.querySelector('small'))container.querySelector('small').textContent=m.traitLabel;img.outerHTML=rushMedallionV253(m,img.classList.contains('rush-reward-v252'));}
 }
 for(const row of root.querySelectorAll('.rush-result-v252'))if(row.querySelector('.rush-medallion-v253')&&!row.querySelector('.rush-traits-v253')){const m=rushMedalV253(rushQuestV252(eventRunV174?.rushV252)?.reward);if(m){const p=document.createElement('p');p.className='rush-traits-v253';p.textContent='MEDAL / '+m.traitLabel;row.querySelector('[data-rush-next]').before(p);}}
}
const rushRenderInventoryV253=renderInventory;renderInventory=function(...args){const out=rushRenderInventoryV253(...args);decorateRushMedalsV253();return out;};
const rushRenderEquipmentV253=renderEquipment;renderEquipment=function(...args){const out=rushRenderEquipmentV253(...args);decorateRushMedalsV253();return out;};
const rushPickerV253=openWeaponPicker;openWeaponPicker=async function(...args){const out=await rushPickerV253(...args);decorateRushMedalsV253();return out;};
const rushFinishDecorateV253=finishSavannaV174;finishSavannaV174=async function(...args){const out=await rushFinishDecorateV253(...args);if(args[0]?.config?.rushV252)decorateRushMedalsV253();return out;};
window.__mobBuildVersion='v253';
