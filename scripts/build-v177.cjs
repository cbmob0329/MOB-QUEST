const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8').replace(/\r\n/g,'\n');let game=read('js/game.js');
const beforePhysical="notice('武器特性 / 追撃！','buff',480);await weaponElementAttackFx(a,{quick:true});applyEnemyDamage(a,f.power||.5,'physical',TEMP_BALANCE.critRate,false);";
const beforeMagic="notice('武器特性 / MAG追撃！','buff',480);const old=state.battle.weaponAttackContext;state.battle.weaponAttackContext={normal:false,element:weaponCombatElement(a)};applyEnemyDamage(a,mf.power||.5,'magic',0,false);state.battle.weaponAttackContext=old;";
game=game.replace(beforePhysical,"await weaponFollowupV177(a,f.power||.5,'physical');").replace(beforeMagic,"await weaponFollowupV177(a,mf.power||.5,'magic');");
const block='// UPDATE_V177_BEGIN\n'+read('js/update-v177.js').trim()+'\n// UPDATE_V177_END';game=game.includes('// UPDATE_V177_BEGIN')?game.replace(/\/\/ UPDATE_V177_BEGIN[\s\S]*?\/\/ UPDATE_V177_END/,()=>block):game.replace(/\}\)\(\);\s*$/,()=>block+'\n})();\n');fs.writeFileSync(path.join(root,'js/game.js'),game);
cp.execFileSync(process.execPath,[path.join(__dirname,'build-v174.cjs')],{stdio:'inherit'});
let html=read('index.html'),css='<style id="updateV177Style">\n'+read('css/update-v177.css').trim()+'\n</style>';html=html.includes('<style id="updateV177Style">')?html.replace(/<style id="updateV177Style">[\s\S]*?<\/style>/,()=>css):html.replace('</head>',()=>css+'\n</head>');fs.writeFileSync(path.join(root,'index.html'),html);
