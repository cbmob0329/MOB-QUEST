const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),write=(p,s)=>fs.writeFileSync(path.join(root,p),s);
const dataBlock='// SKILL_DATA_V259_BEGIN\n'+read('js/skills-data-v259.js')+'\n// SKILL_DATA_V259_END';
let data=read('js/data.js');data=data.includes('// SKILL_DATA_V259_BEGIN')?data.replace(/\/\/ SKILL_DATA_V259_BEGIN[\s\S]*?\/\/ SKILL_DATA_V259_END/,()=>dataBlock):data+'\n'+dataBlock;write('js/data.js',data);
const gameBlock='// UPDATE_V259_BEGIN\nconst SKILL_ATLASES_V259='+read('skill4/v259/frames.json')+';\n'+read('js/skills-v259.js')+'\n// UPDATE_V259_END';
let game=read('js/game.js');game=game.includes('// UPDATE_V259_BEGIN')?game.replace(/\/\/ UPDATE_V259_BEGIN[\s\S]*?\/\/ UPDATE_V259_END/,()=>gameBlock):game.replace(/\}\)\(\);\s*$/,()=>gameBlock+'\n})();\n');
// The enemy shared-spell path must call the current renderer, including new player cartoons.
game=game.replace('await skillSpriteFxBaseV251(ctx.skill.frames,a.id,ctx.skill.mode)','await skillSprite(ctx.skill.frames,a.id,ctx.skill.mode)');write('js/game.js',game);
write('js/battle-animation-v251.js',read('js/battle-animation-v251.js').replace('await skillSpriteFxBaseV251(ctx.skill.frames,a.id,ctx.skill.mode)','await skillSprite(ctx.skill.frames,a.id,ctx.skill.mode)'));
const cssBlock='/* UPDATE_V259_BEGIN */\n'+read('css/skills-v259.css')+'\n/* UPDATE_V259_END */';let css=read('css/style.css');css=css.includes('/* UPDATE_V259_BEGIN */')?css.replace(/\/\* UPDATE_V259_BEGIN \*\/[\s\S]*?\/\* UPDATE_V259_END \*\//,()=>cssBlock):css+'\n'+cssBlock;write('css/style.css',css);
write('index.html',read('index.html').replace(/<div class="title-version">v\d+<\/div>/,'<div class="title-version">v259</div>'));require('./sync-inline.cjs');
