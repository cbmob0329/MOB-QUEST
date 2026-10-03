const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),write=(p,s)=>fs.writeFileSync(path.join(root,p),s);
const data=JSON.parse(read('js/rush-v252.json'));
const worldIds=vm.runInNewContext(read('js/data.js')+'\nMOB_DATA.adventureWorlds.map(w=>w.id)',{}, {timeout:5000});
const source=read('js/game.js'),baseStories=source.match(/const STORY179=\{([\s\S]*?)\n\};/)?.[1]||'';
const storyIds=[...baseStories.matchAll(/^\s*(\w+):\{/gm),...source.matchAll(/STORY179\.(\w+)\s*=/g)].map(m=>m[1]);
require('../js/rush-validation-v252.js')(data,{worldIds,storyIds,assetExists:p=>fs.existsSync(path.join(root,p))});
const replace=(s,start,end,body)=>{const a=s.indexOf(start),b=s.indexOf(end);if(a<0)return null;if(b<a||s.indexOf(start,a+start.length)>=0)throw Error('Ambiguous build boundary');return s.slice(0,a)+body+s.slice(b+end.length);};
let game=read('js/game.js');
const block='// UPDATE_V252_BEGIN\nconst RUSH_DATA_V252='+JSON.stringify(data).replace(/</g,'\\u003c')+';\n'+read('js/rush-validation-v252.js')+'\n'+read('js/rush-v252.js')+'\n// UPDATE_V252_END';
const patched=replace(game,'// UPDATE_V252_BEGIN','// UPDATE_V252_END',block);
if(patched!==null)game=patched;else{const i=game.lastIndexOf('})();');if(i<0)throw Error('Missing game closure');game=game.slice(0,i)+block+'\n'+game.slice(i);}
let css=read('css/style.css'),style='/* UPDATE_V252_BEGIN */\n'+read('css/rush-v252.css')+'\n/* UPDATE_V252_END */';css=replace(css,'/* UPDATE_V252_BEGIN */','/* UPDATE_V252_END */',style)??css+'\n'+style;
write('js/game.js',game);write('css/style.css',css);write('index.html',read('index.html').replace(/<div class="title-version">v\d+<\/div>/,'<div class="title-version">v252</div>'));require('./sync-inline.cjs');console.log('PASS v252 data validation + inline build');
