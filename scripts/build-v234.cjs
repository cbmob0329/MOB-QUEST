const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const gamePath=path.join(root,'js/game.js');let game=fs.readFileSync(gamePath,'utf8');
const old="renderBattle();showScreen('battle');await actionCutin(`${enemies.map(e=>e.name).join('・')}が現れた！`,'danger',1000);await fixedDelay(100);startRound();";
const replacement=`
  const banditEntrance=config.storyV179==='bandits',battleScreen=$('#battleScreen');
  battleScreen.classList.toggle('bandit-wave-preparing-v233',banditEntrance);
  battleScreen.classList.toggle('bandit-battle-v234',banditEntrance);
  renderBattle();showScreen('battle');
  try{
    await actionCutin(\`\${enemies.map(e=>e.name).join('・')}が現れた！\`,'danger',1000);
    if(banditEntrance)await banditBattleEntranceV234(state.battle);
  }finally{battleScreen.classList.remove('bandit-wave-preparing-v233');}
  await fixedDelay(100);startRound();`;
if(game.includes(old))game=game.replace(old,replacement);
else if(!game.includes('const banditEntrance='))throw Error('Battle start hook not found');
if(!game.includes("classList.toggle('bandit-battle-v234'"))game=game.replace("battleScreen.classList.toggle('bandit-wave-preparing-v233',banditEntrance);","battleScreen.classList.toggle('bandit-wave-preparing-v233',banditEntrance);\n  battleScreen.classList.toggle('bandit-battle-v234',banditEntrance);");
game=game.replace('battleEnemyNaturalScale(root,kind,enemy),maxW,maxH);',"battleEnemyNaturalScale(root,kind,enemy),state.battle?.config?.storyV179==='bandits'&&root.children.length>=4?Math.min(maxW,root.clientWidth/root.children.length-8):maxW,maxH);");
const block='// UPDATE_V230_BEGIN\nconst BANDIT_DIALOGUE_V230='+JSON.stringify(JSON.parse(fs.readFileSync(path.join(root,'js/bandit-dialogue-v230.json'),'utf8')))+';\n'+['bandits-v230.js','bandit-combat-v230.js'].map(f=>fs.readFileSync(path.join(root,'js',f),'utf8')).join('\n')+'\n// UPDATE_V230_END';
game=game.replace(/\/\/ UPDATE_V230_BEGIN[\s\S]*?\/\/ UPDATE_V230_END/,()=>block);
game=game.replace(/window\.__mobBuildVersion='v233';/g,"window.__mobBuildVersion='v234';");fs.writeFileSync(gamePath,game);
const css=path.join(root,'css/style.css');let style=fs.readFileSync(css,'utf8');style=style.replace(/\/\* UPDATE_V234_BEGIN \*\/[\s\S]*?\/\* UPDATE_V234_END \*\//,'');fs.writeFileSync(css,style.trimEnd()+'\n/* UPDATE_V234_BEGIN */\n'+fs.readFileSync(path.join(root,'css/bandits-v234.css'),'utf8')+'\n/* UPDATE_V234_END */\n');
const html=path.join(root,'index.html');fs.writeFileSync(html,fs.readFileSync(html,'utf8').replace(/<div class="title-version">v\d+<\/div>/,'<div class="title-version">v234</div>'));
require('./sync-inline.cjs');
