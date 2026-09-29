const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),write=(p,s)=>fs.writeFileSync(path.join(root,p),s);
let game=read('js/game.js');
const old='out.push({id:x.id,level:x.level,sourceIndex,sourceQty:q,';
const fixed='out.push({id:x.id,level:x.level,...(x.startingHpRate!=null?{startingHpRate:x.startingHpRate}:{}),sourceIndex,sourceQty:q,';
if(game.includes(old))game=game.replace(old,fixed);else if(!game.includes(fixed))throw Error('Encounter expansion hook missing');
const block='// UPDATE_V243_BEGIN\n'+read('js/desert-four-v243.js')+'\n// UPDATE_V243_END';
if(game.includes('// UPDATE_V243_BEGIN'))game=game.replace(/\/\/ UPDATE_V243_BEGIN[\s\S]*?\/\/ UPDATE_V243_END/,()=>block);else{const i=game.lastIndexOf('})();');game=game.slice(0,i)+block+'\n'+game.slice(i);}write('js/game.js',game);
write('index.html',read('index.html').replace(/<div class="title-version">v\d+<\/div>/,'<div class="title-version">v243</div>'));require('./sync-inline.cjs');
