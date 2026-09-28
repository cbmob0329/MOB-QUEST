const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),write=(p,s)=>fs.writeFileSync(path.join(root,p),s);
// Import only the two newly authored figures, leaving the existing catalog intact.
const source=read('フィギュアについての修正と追加/figure_event_quest.txt').replace(/\r/g,''),figures=[];
for(const n of [61,62]){const chunk=source.match(new RegExp('^'+n+'\\n([\\s\\S]*?)(?=^\\d{2}\\n|$(?![\\s\\S]))','m'))?.[1];if(!chunk)throw Error('Missing figure '+n);const get=re=>chunk.match(re)?.[1]?.trim(),soul=chunk.match(/ソウルコスト\s*(\d+)\s+([^:：]+)[:：](.*)/),pieceSoul={};for(const m of chunk.matchAll(/ソウル(1|5|10)\s+([^:：]+)[:：](.*)/g))pieceSoul[m[1]]={name:m[2].trim(),text:m[3].trim()};figures.push({image:`eventfig/${n}.png`,name:chunk.split('\n')[0].trim(),rarity:get(/レア度\s+(\S+)/),statsText:get(/ステータス効果[:：](.*)/),traitText:get(/特性[:：](.*)/),tags:get(/^タグ[:：](.*)/m).split('.'),adjacencyTags:get(/^隣接タグ[:：](.*)/m).split('.'),soul:{cost:+soul[1],name:soul[2].trim(),text:soul[3].trim()},pieceSoul,source:'figure_event_quest.txt'});}
write('js/mint-figures-v237.json',JSON.stringify(figures,null,2)+'\n');
let game=read('js/game.js');
if(!game.includes("const mintEntrance=config.storyV179==='mint'")){
 const hook="const banditEntrance=config.storyV179==='bandits',battleScreen=$('#battleScreen');";if(!game.includes(hook))throw Error('Missing entrance hook');
 game=game.replace(hook,hook+"\n  const mintEntrance=config.storyV179==='mint';\n  battleScreen.classList.toggle('mint-battle-preparing-v237',mintEntrance);\n  battleScreen.classList.toggle('mint-battle-v237',mintEntrance);");
 game=game.replace('if(banditEntrance)await banditBattleEntranceV234(state.battle);','if(banditEntrance)await banditBattleEntranceV234(state.battle);\n    if(mintEntrance)await mintBattleEntranceV237(state.battle);');
 game=game.replace("}finally{battleScreen.classList.remove('bandit-wave-preparing-v233');}","}finally{battleScreen.classList.remove('bandit-wave-preparing-v233','mint-battle-preparing-v237');}");
}
const block='// UPDATE_V237_BEGIN\nconst MINT_FIGURES_V237='+JSON.stringify(figures)+';\nconst MINT_DIALOGUE_V237='+JSON.stringify(JSON.parse(read('js/mint-dialogue-v237.json')))+';\n'+read('js/mint-v237.js')+'\n'+read('js/mint-combat-v237.js')+'\n// UPDATE_V237_END';
if(game.includes('// UPDATE_V237_BEGIN'))game=game.replace(/\/\/ UPDATE_V237_BEGIN[\s\S]*?\/\/ UPDATE_V237_END/,()=>block);else{const i=game.lastIndexOf('})();');game=game.slice(0,i)+block+'\n'+game.slice(i);}write('js/game.js',game);
let css=read('css/style.css');const style='/* UPDATE_V237_BEGIN */\n'+read('css/mint-v237.css')+'\n/* UPDATE_V237_END */';if(css.includes('/* UPDATE_V237_BEGIN */'))css=css.replace(/\/\* UPDATE_V237_BEGIN \*\/[\s\S]*?\/\* UPDATE_V237_END \*\//,()=>style);else css+='\n'+style;write('css/style.css',css);
write('index.html',read('index.html').replace(/<div class="title-version">v\d+<\/div>/,'<div class="title-version">v237</div>'));require('./sync-inline.cjs');
