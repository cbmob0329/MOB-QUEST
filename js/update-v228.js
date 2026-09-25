/* Portrait taps inspect; the surrounding card retains its selection action. */
function portraitPlayerV228(img){
  if(!img?.matches('img'))return null;
  const card=img.closest('[data-equip-player],[data-armor-player-v95],[data-person],[data-camp-equip-player],[data-v181-split-member],[data-lilith-member],[data-roster-id],[data-tavern-swap],.training-slot,.book-formation-grid-v92>button');
  if(card){
    if(card.hasAttribute('data-person')&&!card.closest('#equipmentContent'))return null;
    for(const key of ['equipPlayer','armorPlayerV95','person','campEquipPlayer','v181SplitMember','lilithMember','rosterId'])if(card.dataset[key])return card.dataset[key];
    return formationMemberInfoV96(card)?.pid||null;
  }
  return img.matches('#equipmentContent .equipment-selected>img')?equipmentPlayerId:null;
}
function decoratePortraitsV228(){
  for(const img of document.querySelectorAll('#equipmentContent img,#campSubPanel img,.tavern-simple-member img,.training-slot img,[data-roster-id] img,.lilith-split-roster img,.book-formation-grid-v92 img')){
    const id=portraitPlayerV228(img),p=player(id);if(!p)continue;
    img.classList.add('inspect-portrait-v228');img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label',`${p.name}のステータス・パッシブ`);img.title='タップでステータス・パッシブ';
    const region=img.closest('.equipment-party-strip,.camp-equip-party,#tavernSlots,.lilith-split-roster,.book-formation-grid-v92');
    if(region&&!region.previousElementSibling?.classList.contains('portrait-hint-v228')){const hint=document.createElement('p');hint.className='portrait-hint-v228';hint.textContent='画像：ステータス・パッシブ ／ 名前・余白：選択・入替';region.before(hint);}
  }
  for(const p of document.querySelectorAll('.lilith-split-card>p,.book-formation-card-v92>p')){
    if(p.textContent==='キャラクターをタップするとA/Bを移動します。')p.textContent='名前・余白をタップするとA/Bを移動します。';
    if(p.textContent.startsWith('入れ替えたい2人を順番にタップ'))p.textContent='入れ替えたい2人の名前・余白を順番にタップしてください。';
  }
}
function inspectPortraitV228(event){
  if(event.type==='keydown'&&!['Enter',' '].includes(event.key))return;
  const img=event.target.closest?.('img'),id=portraitPlayerV228(img);if(!id||!player(id))return;
  event.preventDefault();event.stopImmediatePropagation();openPlayerDetail(id);
}
document.addEventListener('click',inspectPortraitV228,true);
document.addEventListener('keydown',inspectPortraitV228,true);
let portraitUpdateV228=false;
new MutationObserver(()=>{if(portraitUpdateV228)return;portraitUpdateV228=true;queueMicrotask(()=>{portraitUpdateV228=false;decoratePortraitsV228();});}).observe(document.body,{childList:true,subtree:true});
decoratePortraitsV228();
window.__mobBuildVersion='v228';
