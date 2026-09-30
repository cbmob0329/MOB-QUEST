const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),write=(p,s)=>fs.writeFileSync(path.join(root,p),s);
// Import only the two newly authored figures, leaving the existing catalog intact.
const source=read('フィギュアについての修正と追加/figure_event_quest.txt').replace(/\r/g,''),figures=[];
for(const n of [63,64]){const chunk=source.match(new RegExp('^'+n+'\\n([\\s\\S]*?)(?=^\\d{2}\\n|$(?![\\s\\S]))','m'))?.[1];if(!chunk)throw Error('Missing figure '+n);const get=re=>chunk.match(re)?.[1]?.trim(),soul=chunk.match(/ソウルコスト\s*(\d+)\s+([^:：]+)[:：](.*)/),pieceSoul={};for(const m of chunk.matchAll(/ソウル(1|5|10)[:：](.*)/g))pieceSoul[m[1]]={name:'マカロンダッシュ',text:m[2].trim()};figures.push({image:`eventfig/${n}.png`,name:chunk.split('\n')[0].trim(),rarity:get(/レア度\s+(\S+)/),statsText:get(/ステータス効果[:：](.*)/),traitText:get(/特性[:：](.*)/),tags:get(/^タグ[:：](.*)/m).split('.'),adjacencyTags:get(/^隣接タグ[:：](.*)/m).split('.'),soul:{cost:+soul[1],name:soul[2].trim(),text:soul[3].trim()},pieceSoul,source:'figure_event_quest.txt'});}
write('js/macaron-figures-v247.json',JSON.stringify(figures,null,2)+'\n');
let game=read('js/game.js');
game=game.replace("const mintEntrance=config.storyV179==='mint'||!!config.nightmareV239;", "const mintEntrance=config.storyV179==='mint'||!!config.nightmareV239||config.storyV179==='macaron';");
game=game.replace("b.config?.nightmareV239?4:dynamicBookRage?4:3", "(b.config?.nightmareV239||b.config?.storyV179==='macaron')?4:dynamicBookRage?4:3");
const block='// UPDATE_V247_BEGIN\nconst MACARON_FIGURES_V247='+JSON.stringify(figures)+';\nconst MACARON_DIALOGUE_V247='+JSON.stringify(JSON.parse(read('js/macaron-dialogue-v247.json')))+';\n'+read('js/macaron-v247.js')+'\n'+read('js/macaron-scene-v247.js')+'\n'+read('js/macaron-combat-v247.js')+'\n// UPDATE_V247_END';
if(game.includes('// UPDATE_V247_BEGIN'))game=game.replace(/\/\/ UPDATE_V247_BEGIN[\s\S]*?\/\/ UPDATE_V247_END/,()=>block);else{const i=game.lastIndexOf('})();');game=game.slice(0,i)+block+'\n'+game.slice(i);}write('js/game.js',game);
let css=read('css/style.css');const style='/* UPDATE_V247_BEGIN */\n'+read('css/macaron-v247.css')+'\n/* UPDATE_V247_END */';if(css.includes('/* UPDATE_V247_BEGIN */'))css=css.replace(/\/\* UPDATE_V247_BEGIN \*\/[\s\S]*?\/\* UPDATE_V247_END \*\//,()=>style);else css+='\n'+style;write('css/style.css',css);
write('index.html',read('index.html').replace(/<div class="title-version">v\d+<\/div>/,'<div class="title-version">v247</div>'));require('./sync-inline.cjs');
