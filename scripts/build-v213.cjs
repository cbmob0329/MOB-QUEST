const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
for(const [dest,patch,start,end] of [['js/game.js','js/update-v213.js','// UPDATE_V213_BEGIN','// UPDATE_V213_END'],['css/style.css','css/update-v213.css','/* UPDATE_V213_BEGIN */','/* UPDATE_V213_END */']]){
 const p=path.join(root,dest),addition=fs.readFileSync(path.join(root,patch),'utf8').trim();let s=fs.readFileSync(p,'utf8');
 if(s.includes(start)){const i=s.indexOf(start),j=s.indexOf(end,i)+end.length;s=s.slice(0,i)+addition+s.slice(j);}
 else if(dest.endsWith('.js')){const i=s.lastIndexOf('})();');s=s.slice(0,i)+addition+'\n\n'+s.slice(i);}else s+='\n'+addition+'\n';
 fs.writeFileSync(p,s);
}
const p=path.join(root,'index.html');fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace(/<div class="title-version">v\d+<\/div>/,'<div class="title-version">v213</div>'));
require('./sync-inline.cjs');
