const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
require('./build-v227.cjs');require('./build-v228.cjs');
const p=path.join(root,'js/game.js'),mark="// UPDATE_V229_BEGIN\nwindow.__mobBuildVersion='v229';\n// UPDATE_V229_END";let game=fs.readFileSync(p,'utf8');if(!game.includes('// UPDATE_V229_BEGIN')){const i=game.lastIndexOf('})();');game=game.slice(0,i)+mark+'\n'+game.slice(i);fs.writeFileSync(p,game);}
const h=path.join(root,'index.html');fs.writeFileSync(h,fs.readFileSync(h,'utf8').replace(/<div class="title-version">v\d+<\/div>/,'<div class="title-version">v229</div>'));delete require.cache[require.resolve('./sync-inline.cjs')];require('./sync-inline.cjs');
