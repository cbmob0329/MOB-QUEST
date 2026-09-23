const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const p=path.join(root,'js/game.js');let s=fs.readFileSync(p,'utf8');
s=s.replace("$('#fieldBattleBtn').onclick=startAdventureBattle;","$('#fieldBattleBtn').onclick=()=>startAdventureBattle();");
const addition=fs.readFileSync(path.join(root,'js/update-v216.js'),'utf8').trim(),start='// UPDATE_V216_BEGIN',end='// UPDATE_V216_END';
if(s.includes(start)){const i=s.indexOf(start),j=s.indexOf(end,i)+end.length;s=s.slice(0,i)+addition+s.slice(j);}
else{const i=s.lastIndexOf('})();');s=s.slice(0,i)+addition+'\n\n'+s.slice(i);}
fs.writeFileSync(p,s);
const html=path.join(root,'index.html');fs.writeFileSync(html,fs.readFileSync(html,'utf8').replace(/<div class="title-version">v\d+<\/div>/,'<div class="title-version">v216</div>'));
require('./sync-inline.cjs');
