const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const p=path.join(root,'js/game.js');let s=fs.readFileSync(p,'utf8');
// A bounded preload followed by an unbounded decode could still hang a scene.
s=s.replaceAll('if(img.decode)await img.decode();','if(img.decode)await decodeImageBoundedV217(img);');
s=s.replace("if(document.querySelector('.ending-v157,.portal-party-v157')){", "if(document.querySelector('.ending-v157,.portal-party-v157')&&!e.target?.closest?.('.ending-next-v217')){");
const addition=fs.readFileSync(path.join(root,'js/update-v217.js'),'utf8').trim(),start='// UPDATE_V217_BEGIN',end='// UPDATE_V217_END';
if(s.includes(start)){const i=s.indexOf(start),j=s.indexOf(end,i)+end.length;s=s.slice(0,i)+addition+s.slice(j);}
else{const i=s.lastIndexOf('})();');s=s.slice(0,i)+addition+'\n\n'+s.slice(i);}
fs.writeFileSync(p,s);
const html=path.join(root,'index.html');fs.writeFileSync(html,fs.readFileSync(html,'utf8').replace(/<div class="title-version">v\d+<\/div>/,'<div class="title-version">v217</div>'));
require('./sync-inline.cjs');
