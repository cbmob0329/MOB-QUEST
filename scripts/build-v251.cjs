const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),write=(p,s)=>fs.writeFileSync(path.join(root,p),s);
let game=read('js/game.js');const block='// UPDATE_V251_BEGIN\n'+read('js/battle-animation-v251.js')+'\n// UPDATE_V251_END';
if(game.includes('// UPDATE_V251_BEGIN'))game=game.replace(/\/\/ UPDATE_V251_BEGIN[\s\S]*?\/\/ UPDATE_V251_END/,()=>block);
else{const i=game.lastIndexOf('})();');if(i<0)throw Error('Missing game closure');game=game.slice(0,i)+block+'\n'+game.slice(i);}
write('js/game.js',game);write('index.html',read('index.html').replace(/<div class="title-version">v\d+<\/div>/,'<div class="title-version">v251</div>'));let css=read('css/style.css'),style='/* UPDATE_V251_BEGIN */\n'+read('css/battle-animation-v251.css')+'\n/* UPDATE_V251_END';css=css.includes('/* UPDATE_V251_BEGIN */')?css.replace(/\/\* UPDATE_V251_BEGIN \*\/[\s\S]*?\/\* UPDATE_V251_END \*\//,()=>style):css+'\n'+style;write('css/style.css',css);require('./sync-inline.cjs');
