const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
for(const file of ['js/update-v181.js','js/game.js']){
  const p=path.join(root,file);let s=fs.readFileSync(p,'utf8');
  const start=s.indexOf("const names=t=>t.map(([id])=>player(id)?.name||id).join(' / ');overlay.hidden=true;const ans=await narrationDialog(`A：${names(split.A)}");
  if(start>=0){const end=s.indexOf('state.meta[opt.storageKey]=',start);if(end<0)throw Error('split boundary');s=s.slice(0,start)+"if(confirm.disabled)return;confirm.disabled=true;let accepted;try{accepted=await confirmSplitInlineV210(overlay,split);}finally{confirm.disabled=false;}if(!accepted)return;"+s.slice(end);}
  fs.writeFileSync(p,s);
}
for(const [dest,patch,marker] of [['js/game.js','js/update-v210.js','// UPDATE_V210_BEGIN'],['css/style.css','css/update-v210.css','/* v210: phased']]){
  const p=path.join(root,dest);let s=fs.readFileSync(p,'utf8'),addition=fs.readFileSync(path.join(root,patch),'utf8');
  if(s.includes(marker)){
    const start=s.indexOf(marker);
    if(dest.endsWith('.js')){const end=s.indexOf('// UPDATE_V210_END',start)+'// UPDATE_V210_END'.length;s=s.slice(0,start)+addition.trimEnd()+s.slice(end);}
    else s=s.slice(0,start)+addition;
  }else if(dest.endsWith('.js')){const end=s.lastIndexOf('})();');s=s.slice(0,end)+addition+'\n'+s.slice(end);}else s+='\n'+addition;
  fs.writeFileSync(p,s);
}
const p=path.join(root,'index.html');fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace('<div class="title-version">v209</div>','<div class="title-version">v210</div>'));
require('./sync-inline.cjs');
