const fs=require('fs');require('./build-v260.cjs');
const read=p=>fs.readFileSync(p,'utf8'),write=(p,s)=>fs.writeFileSync(p,s);
let g=read('js/game.js'),block='// UPDATE_V261_BEGIN\n'+read('js/denden-menu-v261.js')+'\n// UPDATE_V261_END';
g=g.includes('// UPDATE_V261_BEGIN')?g.replace(/\/\/ UPDATE_V261_BEGIN[\s\S]*?\/\/ UPDATE_V261_END/,()=>block):g.replace(/\}\)\(\);\s*$/,()=>block+'\n})();\n');
if(!g.includes("if(kind==='denden261')"))g=g.replace("if(kind==='stance260')","if(kind==='denden261')await resolveDendenV261(a);\n    else if(kind==='stance260')");write('js/game.js',g);
let c=read('css/style.css'),cb='/* UPDATE_V261_BEGIN */\n'+read('css/denden-menu-v261.css')+'\n/* UPDATE_V261_END */';c=c.includes('/* UPDATE_V261_BEGIN */')?c.replace(/\/\* UPDATE_V261_BEGIN \*\/[\s\S]*?\/\* UPDATE_V261_END \*\//,()=>cb):c+'\n'+cb;write('css/style.css',c);
write('index.html',read('index.html').replace(/<div class="title-version">v\d+<\/div>/,'<div class="title-version">v261</div>'));delete require.cache[require.resolve('./sync-inline.cjs')];require('./sync-inline.cjs');
