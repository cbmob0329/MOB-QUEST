const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),write=(p,s)=>fs.writeFileSync(path.join(root,p),s);
let game=read('js/game.js');const block='// UPDATE_V249_BEGIN\n'+read('js/boss-hp-v249.js')+'\n// UPDATE_V249_END';
if(game.includes('// UPDATE_V249_BEGIN'))game=game.replace(/\/\/ UPDATE_V249_BEGIN[\s\S]*?\/\/ UPDATE_V249_END/,()=>block);
else{const i=game.lastIndexOf('})();');if(i<0)throw Error('Missing game closure');game=game.slice(0,i)+block+'\n'+game.slice(i);}
write('js/game.js',game);write('index.html',read('index.html').replace(/<div class="title-version">v\d+<\/div>/,'<div class="title-version">v249</div>'));require('./sync-inline.cjs');
