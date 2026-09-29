const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),write=(p,s)=>fs.writeFileSync(path.join(root,p),s);
let game=read('js/game.js'),block='// UPDATE_V246_BEGIN\n'+read('js/quest-access-v246.js')+'\n// UPDATE_V246_END';
if(game.includes('// UPDATE_V246_BEGIN'))game=game.replace(/\/\/ UPDATE_V246_BEGIN[\s\S]*?\/\/ UPDATE_V246_END/,()=>block);else{const i=game.lastIndexOf('})();');game=game.slice(0,i)+block+'\n'+game.slice(i);}write('js/game.js',game);
write('index.html',read('index.html').replace(/<div class="title-version">v\d+<\/div>/,'<div class="title-version">v246</div>'));require('./sync-inline.cjs');
