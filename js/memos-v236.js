// Player memos are collected only after their image has actually been displayed.
let memoTailV236=Promise.resolve();
const memoPendingV236=new Map();
function memoSeenV236(id){return state.meta?.seenMemosV236?.[id]===true;}
function memoIdleV236(){return !openingSequenceBusy&&!conversationInputLockedV171()&&$('#dialogOverlay')?.hidden!==false;}
function memoModalV236(title){
 const dialog=document.createElement('dialog');dialog.className='memo-modal-v236';
 dialog.innerHTML='<section><header><h2></h2></header><div class="memo-body-v236"></div><footer><button type="button" data-memo-close>閉じる</button></footer></section>';
 $('h2',dialog).textContent=title;$('h2',dialog).id='memo-title-v236';dialog.setAttribute('aria-labelledby','memo-title-v236');document.body.append(dialog);return dialog;
}
function showMemoV236(memo,{collect=false}={}){
 return new Promise(resolve=>{
  const dialog=memoModalV236(memo.title),body=$('.memo-body-v236',dialog),previous=document.activeElement,owner=state.meta;
  const image=document.createElement('img');image.className='memo-image-v236';image.alt=memo.title;image.draggable=false;
  const message=document.createElement('p');message.className='memo-load-v236';message.textContent='読み込み中…';message.setAttribute('role','status');body.append(message,image);
  let done=false;
  const finish=()=>{if(done)return;done=true;dialog.close();dialog.remove();if(previous?.isConnected)previous.focus({preventScroll:true});resolve();};
  $('[data-memo-close]',dialog).onclick=finish;dialog.addEventListener('cancel',e=>{e.preventDefault();finish();});
  image.onload=()=>{if(done)return;message.remove();image.classList.add('ready');if(collect&&owner===state.meta){state.meta.seenMemosV236={...state.meta.seenMemosV236,[memo.id]:true};saveMeta();}};
  image.onerror=()=>{if(done)return;message.textContent='画像を読み込めませんでした。';const retry=document.createElement('button');retry.type='button';retry.textContent='再読み込み';retry.onclick=()=>{retry.remove();message.textContent='読み込み中…';image.src=memo.image+'?retry='+Date.now();};message.append(retry);};
  if(memo.rows){const text=document.createElement('details');text.className='memo-text-v236';const summary=document.createElement('summary');summary.textContent='文章で読む';text.append(summary);for(const [heading,copy] of memo.rows){const p=document.createElement('p'),strong=document.createElement('strong');strong.textContent=heading;p.append(strong,document.createElement('br'),document.createTextNode(copy));text.append(p);}body.append(text);}
  dialog.showModal();image.src=memo.image;
 });
}
function firstMemoV236(id){
 const memo=MEMOS_V236.find(m=>m.id===id),owner=state.meta;
 if(!memo||memoSeenV236(id))return Promise.resolve();
 if(memoPendingV236.get(id)?.owner===owner)return memoPendingV236.get(id).promise;
 const entry={owner};
 entry.promise=memoTailV236.catch(()=>{}).then(async()=>{
  while(owner===state.meta&&!memoIdleV236())await new Promise(r=>setTimeout(r,120));
  if(owner===state.meta&&!memoSeenV236(id))await showMemoV236(memo,{collect:true});
 }).catch(e=>console.warn('[memo v236]',e)).finally(()=>{if(memoPendingV236.get(id)===entry)memoPendingV236.delete(id);});
 memoPendingV236.set(id,entry);memoTailV236=entry.promise;return entry.promise;
}
function openMemoCollectionV236(){
 if($('.memo-modal-v236'))return;
 const dialog=memoModalV236('メモを見る'),body=$('.memo-body-v236',dialog),rows=MEMOS_V236.filter(m=>memoSeenV236(m.id));
 body.classList.add('memo-list-v236');
 if(!rows.length){const p=document.createElement('p');p.textContent='まだメモを見ていません。';body.append(p);}
 for(const memo of rows){const b=document.createElement('button');b.type='button';b.textContent=memo.title;b.onclick=async()=>{dialog.close();dialog.remove();await showMemoV236(memo);openMemoCollectionV236();};body.append(b);}
 const close=()=>{dialog.close();dialog.remove();$('#memoButtonV236')?.focus({preventScroll:true});};
 $('[data-memo-close]',dialog).onclick=close;dialog.addEventListener('cancel',e=>{e.preventDefault();close();});dialog.showModal();
}
const memoAllowedTargetV236=conversationAllowedTargetV171;
conversationAllowedTargetV171=target=>!!target?.closest?.('.memo-modal-v236')||memoAllowedTargetV236(target);
const memoHomeRenderV236=renderHome;
renderHome=function(...args){const result=memoHomeRenderV236(...args),brand=$('#homeScreen .brand-box');if(brand){let button=$('#memoButtonV236');if(!button){button=document.createElement('button');button.id='memoButtonV236';button.type='button';button.textContent='メモを見る';button.onclick=openMemoCollectionV236;}const shelf=$('#shelfButtonV218');if(shelf)shelf.after(button);else brand.append(button);}return result;};
const memoGoHomeV236=goHome;
let memoOpeningFlowV236=false;
async function openingMemosV236(){await firstMemoV236('status');await firstMemoV236('combat');}
goHome=async function(...args){const result=await memoGoHomeV236(...args);if(state.meta.openingCompleted&&!openingSequenceBusy&&!memoOpeningFlowV236)await openingMemosV236();return result;};
const memoOpeningV236=runOpeningV74;
runOpeningV74=async function(...args){memoOpeningFlowV236=true;try{await memoOpeningV236(...args);}finally{memoOpeningFlowV236=false;}if(state.meta.openingCompleted)await openingMemosV236();};
const memoTavernV236=enterTavern;
enterTavern=async function(...args){const result=await memoTavernV236(...args);await firstMemoV236('tavern');return result;};
const memoSmithV236=openBlacksmithFacility;
openBlacksmithFacility=async function(...args){const result=await memoSmithV236(...args);await firstMemoV236('smith');return result;};
const memoCampV236=openCamp;
openCamp=function(...args){const result=memoCampV236(...args);if(!$('#campOverlay').hidden)void firstMemoV236('camp');return result;};
// This button was bound during boot, before the late update modules ran.
$('#campBtn').onclick=()=>openCamp();
// This button was bound during boot, before the late update modules ran.
$('#campBtn').onclick=()=>openCamp();
const memoAdventureV236=handleAdventureEntry;
handleAdventureEntry=async function(...args){if(!state.adventure.awaitingReport)await firstMemoV236('adventure');return memoAdventureV236(...args);};
const memoTrainingV236=setTrainingMode;
setTrainingMode=async function(mode,...args){const result=await memoTrainingV236(mode,...args);if(['program','subquest','journal','exp','gold','boss','event'].includes(mode)&&state.training.mode===mode&&$('#trainingFeaturePopup')?.hidden===false)await firstMemoV236(mode);return result;};
const memoEventV236=renderEventQuestsV163;
renderEventQuestsV163=function(...args){const result=memoEventV236(...args),id={story:'event-story',boss:'event-boss',legend:'legend'}[eventViewV163];if(id&&screens.training.classList.contains('active')&&$('#trainingFeaturePopup')?.hidden===false)void firstMemoV236(id);return result;};
const memoFigureChooseV236=openFigureChooseV220;
openFigureChooseV220=function(...args){const result=memoFigureChooseV236(...args);void firstMemoV236('figures');return result;};
const memoFigureRenderV236=renderFigureGroupV220;
renderFigureGroupV220=function(...args){const result=memoFigureRenderV236(...args);if(screens.equipment.classList.contains('active'))void firstMemoV236('figures');return result;};
const memoScreenV236=showScreen;
showScreen=function(name,...args){const result=memoScreenV236(name,...args);if(name==='equipment'&&['figures','subfigures'].includes(equipmentTab))void firstMemoV236('figures');return result;};
const memoFigureShopV236=openTavernFigureShopV98;
openTavernFigureShopV98=async function(...args){const result=await memoFigureShopV236(...args);if($('#tavernFigurePopup')?.hidden===false)await firstMemoV236('figures');return result;};
showTavernFigureShop=openTavernFigureShopV98;
window.__mobBuildVersion='v236';
