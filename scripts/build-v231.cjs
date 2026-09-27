const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
// Nested legacy builders rewrite the same bundle several times. Windows can
// temporarily hold it between writes; retry only transient sharing failures.
const writeFileSync=fs.writeFileSync;
fs.writeFileSync=function(...args){for(let attempt=0;;attempt++){try{return writeFileSync.apply(fs,args);}catch(error){if(attempt>=5||!['EBUSY','UNKNOWN'].includes(error.code))throw error;Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,100);}}};
require('./build-v230.cjs');require('./import-story-v231.cjs');
const p=path.join(root,'js/game.js');let game=fs.readFileSync(p,'utf8');
for(const name of ['karami','earth']){
 game=game.replace(`${name}.atkBuff=.20;${name}.atkBuffTurns=99;${name}.defBuff=.20;${name}.defBuffTurns=99;fx('buff',\`enemy:\${${name}.uid}\`);`,`boostEnemyV231(${name},.20,.15);`);
}
game=game.replace("for(const e of next){e.atkBuff=.20;e.atkBuffTurns=99;e.defBuff=.20;e.defBuffTurns=99;}","for(const e of next)boostEnemyV231(e,.20,.15);");
game=game.replaceAll('のATKとDEFが20%アップした！','の全ステータスが20%・ダメージ軽減が15%アップした！');
game=game.replace('2人のATKとDEFが20%アップした！','2人の全ステータスが20%・ダメージ軽減が15%アップした！');
game=game.replace('if(isD2Revive)for(const e of next){e.actionCount=1;e.forceActionCount=true;}','if(isD2Revive)for(const e of next){e.actionCount=rint(1,2);e.forceActionCount=true;e.revivedFourV231=true;}');
game=game.replace('const oldDragon=(b.enemies||[]).find(e=>e.id===\'boss-dragon2\');if(oldDragon)await enemyStoryCutin(oldDragon,`素晴らしい\\n本当に素晴らしいぞ勇者よ！\\n私は嬉しいぞ\\nようやく\\n本当の好敵手に出会えた！！`,1200);await storyFlashBattle();',"await playBattleSequenceV173('gidora',true);await flameAbsorbV231();");
game=game.replace('useSpecial=(e.alwaysSpecial||authoredAlways)?true:', 'useSpecial=e.specialChanceV231!=null?Math.random()<e.specialChanceV231:(e.alwaysSpecial||authoredAlways)?true:');
const block='// UPDATE_V231_BEGIN\nconst STORY_V231='+JSON.stringify(JSON.parse(fs.readFileSync(path.join(root,'js/story-v231.json'),'utf8')))+';\n'+['story-v231.js','combat-v231.js'].map(f=>fs.readFileSync(path.join(root,'js',f),'utf8')).join('\n')+'\n// UPDATE_V231_END';
if(game.includes('// UPDATE_V231_BEGIN'))game=game.replace(/\/\/ UPDATE_V231_BEGIN[\s\S]*?\/\/ UPDATE_V231_END/,()=>block);else{const i=game.lastIndexOf('})();');game=game.slice(0,i)+block+'\n'+game.slice(i);}fs.writeFileSync(p,game);
const css=path.join(root,'css/style.css');let s=fs.readFileSync(css,'utf8').replace(/\/\* UPDATE_V231_BEGIN \*\/[\s\S]*?\/\* UPDATE_V231_END \*\//,'');fs.writeFileSync(css,s.replace(/(?:\r?\n){4,}(?=\/\* UPDATE_V)/g,'\n\n').trimEnd()+'\n\n/* UPDATE_V231_BEGIN */\n'+fs.readFileSync(path.join(root,'css/story-v231.css'),'utf8')+'\n/* UPDATE_V231_END */\n');
const html=path.join(root,'index.html');fs.writeFileSync(html,fs.readFileSync(html,'utf8').replace(/<div class="title-version">v\d+<\/div>/,'<div class="title-version">v231</div>'));delete require.cache[require.resolve('./sync-inline.cjs')];require('./sync-inline.cjs');
fs.writeFileSync=writeFileSync;
