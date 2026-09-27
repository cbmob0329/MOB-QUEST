const shelfChooseV233={query:'',rarity:'all',mode:'single',selected:new Set()};
function shelfFreeV233(rarity,selected=[]){return Math.max(0,(shelfLimitsV218[rarity]||0)-(state.meta.figureShelfV218||[]).filter(id=>figureById(id)?.rarity===rarity).length-selected.filter(id=>figureById(id)?.rarity===rarity).length);}
function shelfCandidatesV233(){return figureSearchRowsV220(shelfChooseV233.query,shelfChooseV233.rarity);}
function shelfAutoSelectV233(){
 const selected=[];
 for(const f of shelfCandidatesV233().filter(f=>!figureOwnersV220(f.id).length).sort((a,b)=>figureStatValueV132(b)-figureStatValueV132(a)||figurePlusV218(b.id)-figurePlusV218(a.id)||a.id.localeCompare(b.id)))if(shelfFreeV233(f.rarity,selected)>0)selected.push(f.id);
 shelfChooseV233.selected=new Set(selected);return selected;
}
function shelfCommitV233(){
 const chosen=[...shelfChooseV233.selected],counts={};
 // Validate the whole selection before moving anything out of equipment.
 for(const id of chosen){const f=figureById(id);if(!f||!figureOwned(id)||state.meta.figureShelfV218?.includes(id)||((counts[f.rarity]=(counts[f.rarity]||0)+1)>shelfFreeV233(f.rarity)))return toast('棚がいっぱいだ！');}
 if(!chosen.length)return;
 for(const id of chosen)assignFigureV218(id,'shelf');
 shelfChooseV233.selected.clear();renderHome();openFigureChooseV220('shelf');toast(`${chosen.length}体を棚に飾りました`);
}
const shelfChooseBaseV233=openFigureChooseV220;
openFigureChooseV220=function(mode,...args){
 const previous=$('#figureChooseV220'),wasShelf=previous?.dataset.shelfV233==='true'&&!previous.hidden;
 if(wasShelf){shelfChooseV233.query=$('input[type="search"]',previous).value;shelfChooseV233.rarity=$('select',previous).value;}
 const scroll=wasShelf?$('section',previous).scrollTop:0;
 shelfChooseBaseV233(mode,...args);
 const ov=$('#figureChooseV220');ov.dataset.shelfV233=String(mode==='shelf');if(mode!=='shelf')return;
 for(const id of shelfChooseV233.selected)if(!figureOwned(id)||state.meta.figureShelfV218?.includes(id))shelfChooseV233.selected.delete(id);
 const search=$('input[type="search"]',ov),rarity=$('select',ov),list=$('[data-figure-list]',ov),toolbar=document.createElement('div'),footer=document.createElement('div');
 const effects=list.previousElementSibling;if(effects?.tagName==='SECTION'){const details=document.createElement('details');details.className='shelf-effects-v233';details.innerHTML='<summary>棚で発動中の効果を確認</summary>';effects.before(details);details.append(effects);}
 toolbar.className='shelf-modes-v233';toolbar.setAttribute('role','group');toolbar.setAttribute('aria-label','フィギュアの選び方');
 toolbar.innerHTML='<button type="button" data-shelf-mode="single">1つずつ選ぶ</button><button type="button" data-shelf-mode="multi">まとめて選択</button><button type="button" data-shelf-auto>お任せ</button>';
 $('.figure-search-v220',ov).before(toolbar);
 const hint=document.createElement('p');hint.className='shelf-hint-v233';hint.textContent='お任せは、絞り込み条件に合う未使用のフィギュアから空き枠分を選びます。';toolbar.after(hint);
 footer.className='shelf-selection-v233';footer.innerHTML='<span data-selected-count aria-live="polite"></span><small data-selected-owners></small><div><button type="button" data-clear-selection>選択を解除</button><button type="button" data-shelf-commit>棚に飾る</button></div>';$('section',ov).append(footer);
 function update(){
  const multi=shelfChooseV233.mode==='multi',ids=[...shelfChooseV233.selected];
  $$('[data-shelf-mode]',toolbar).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.shelfMode===shelfChooseV233.mode)));
  footer.hidden=!multi;$('[data-selected-count]',footer).textContent=`${ids.length}体を選択中`;
  const equipped=ids.filter(id=>figureOwnersV220(id).some(o=>o.mode!=='shelf')).length;
  $('[data-selected-owners]',footer).textContent=equipped?`装備中の${equipped}体は棚へ移動します。`:'';
  const commit=$('[data-shelf-commit]',footer);commit.disabled=!ids.length;commit.textContent=`${ids.length}体を棚に飾る`;
  $$('[data-choose]',list).forEach(b=>{const selected=shelfChooseV233.selected.has(b.dataset.choose);b.classList.toggle('shelf-selected-v233',selected);if(multi)b.setAttribute('aria-pressed',String(selected));else b.removeAttribute('aria-pressed');});
 }
 function decorate(){
  shelfChooseV233.query=search.value;shelfChooseV233.rarity=rarity.value;
  $$('[data-choose]',list).forEach(b=>{
   const detail=document.createElement('button');detail.type='button';detail.className='shelf-detail-v233';detail.textContent='性能・タグを確認';detail.setAttribute('aria-label',`${figureById(b.dataset.choose).name}の性能・タグを確認`);
   detail.onclick=()=>{const f=figureById(b.dataset.choose),pop=document.createElement('div');pop.className='figure-confirm-v220';pop.innerHTML='<section><button type="button" data-back>← 一覧へ戻る</button>'+figureDetailMarkupV96(f)+'</section>';ov.append(pop);bindImages(pop);$('[data-back]',pop).onclick=()=>pop.remove();};
   const row=document.createElement('div');row.className='shelf-row-v233';b.before(row);row.append(b,detail);
  });update();
 }
 list.addEventListener('click',e=>{const button=e.target.closest('[data-choose]');if(!button||shelfChooseV233.mode!=='multi')return;e.preventDefault();e.stopImmediatePropagation();const id=button.dataset.choose,f=figureById(id),selected=shelfChooseV233.selected;
  if(selected.has(id))selected.delete(id);else{if(state.meta.figureShelfV218?.includes(id)||shelfFreeV233(f.rarity,[...selected])<=0)return toast('棚がいっぱいだ！');selected.add(id);}update();
 },true);
 search.value=shelfChooseV233.query;rarity.value=shelfChooseV233.rarity;
 search.oninput();decorate();search.addEventListener('input',decorate);rarity.addEventListener('change',decorate);
 $$('[data-shelf-mode]',toolbar).forEach(b=>b.onclick=()=>{shelfChooseV233.mode=b.dataset.shelfMode;update();});
 $('[data-shelf-auto]',toolbar).onclick=()=>{shelfChooseV233.mode='multi';const ids=shelfAutoSelectV233();update();if(!ids.length)toast(Object.keys(shelfLimitsV218).every(r=>shelfFreeV233(r)===0)?'棚がいっぱいだ！':'条件に合う未使用のフィギュアがありません');};
 $('[data-clear-selection]',footer).onclick=()=>{shelfChooseV233.selected.clear();update();};$('[data-shelf-commit]',footer).onclick=shelfCommitV233;
 $('[data-close]',ov).addEventListener('click',()=>{shelfChooseV233.selected.clear();});$('section',ov).scrollTop=scroll;
};
window.__mobBuildVersion='v233';
