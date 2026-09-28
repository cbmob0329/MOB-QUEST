const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),write=(p,s)=>fs.writeFileSync(path.join(root,p),s);
let game=read('js/game.js'),block='// UPDATE_V242_BEGIN\n'+read('js/nightmare-cinema-v242.js')+'\n// UPDATE_V242_END';
if(game.includes('// UPDATE_V242_BEGIN'))game=game.replace(/\/\/ UPDATE_V242_BEGIN[\s\S]*?\/\/ UPDATE_V242_END/,()=>block);else{const i=game.lastIndexOf('})();');game=game.slice(0,i)+block+'\n'+game.slice(i);}write('js/game.js',game);
let css=read('css/style.css'),style='/* UPDATE_V242_BEGIN */\n'+read('css/nightmare-cinema-v242.css')+'\n/* UPDATE_V242_END */';
if(css.includes('/* UPDATE_V242_BEGIN */'))css=css.replace(/\/\* UPDATE_V242_BEGIN \*\/[\s\S]*?\/\* UPDATE_V242_END \*\//,()=>style);else css+='\n'+style;
write('css/style.css',css);write('index.html',read('index.html').replace(/<div class="title-version">v\d+<\/div>/,'<div class="title-version">v242</div>'));require('./sync-inline.cjs');
