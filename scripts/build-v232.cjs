const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
require('./build-v231.cjs');
const file=path.join(root,'js/game.js');let game=fs.readFileSync(file,'utf8');
game=game.replaceAll('お城へ向かおう！','お城へ向かいましょう！');
game=game.replace("ev=clamp(weaponEvasion(a)+Number(fe.evade||0),0,.65);if(ev>0", "ev=incomingEvadeV232(a);if(ev>0");
const block='// UPDATE_V232_BEGIN\n'+fs.readFileSync(path.join(root,'js/accuracy-v232.js'),'utf8')+'\n// UPDATE_V232_END';
if(game.includes('// UPDATE_V232_BEGIN'))game=game.replace(/\/\/ UPDATE_V232_BEGIN[\s\S]*?\/\/ UPDATE_V232_END/,()=>block);else{const i=game.lastIndexOf('})();');game=game.slice(0,i)+block+'\n'+game.slice(i);}fs.writeFileSync(file,game);
const html=path.join(root,'index.html');fs.writeFileSync(html,fs.readFileSync(html,'utf8').replace(/<div class="title-version">v\d+<\/div>/,'<div class="title-version">v232</div>'));delete require.cache[require.resolve('./sync-inline.cjs')];require('./sync-inline.cjs');
