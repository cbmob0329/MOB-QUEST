const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
for(const file of ['js/game.js','js/update-v207.js']){
 const p=path.join(root,file);let s=fs.readFileSync(p,'utf8');s=s.replace("storySay('nekoku','みんな事情があるのよ')","storySay('jessie','みんな事情があるのよ')");fs.writeFileSync(p,s);
}
for(const file of ['js/game.js','js/update-v181.js']){
 const p=path.join(root,file);let s=fs.readFileSync(p,'utf8');
 s=s.replace("fx.className='dc2-battle-fire-v181';","fx.className='dc2-battle-fire-v181 dc2-cinematic-v211 flame-v211 release';fx.innerHTML=dc2FxMarkupV211();");
 s=s.replaceAll("await storyShowGuest('dc2-ulrilis',{slow:true});","await dc2EntranceV211(['dc2-ulrilis'],'abyss');");
 fs.writeFileSync(p,s);
}
// The fusion runner is outside the step dispatcher; enhance its final reveal too.
{const p=path.join(root,'js/game.js');let s=fs.readFileSync(p,'utf8');s=s.replaceAll("await storyShowGuest('dc2-ulrilis',{slow:true});","await dc2EntranceV211(['dc2-ulrilis'],'abyss');");fs.writeFileSync(p,s);}
for(const [dest,patch,start,end] of [['js/game.js','js/update-v211.js','// UPDATE_V211_BEGIN','// UPDATE_V211_END'],['css/style.css','css/update-v211.css','/* UPDATE_V211_BEGIN */','/* UPDATE_V211_END */']]){
 const p=path.join(root,dest),addition=fs.readFileSync(path.join(root,patch),'utf8').trim();let s=fs.readFileSync(p,'utf8');
 if(s.includes(start)){const i=s.indexOf(start),j=s.indexOf(end,i)+end.length;s=s.slice(0,i)+addition+s.slice(j);}
 else if(dest.endsWith('.js')){const i=s.lastIndexOf('})();');s=s.slice(0,i)+addition+'\n\n'+s.slice(i);}else s+='\n'+addition+'\n';
 fs.writeFileSync(p,s);
}
const p=path.join(root,'index.html');fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace(/<div class="title-version">v\d+<\/div>/,'<div class="title-version">v211</div>'));
require('./sync-inline.cjs');
