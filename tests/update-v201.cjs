const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const data=fs.readFileSync(path.join(root,'js/data.js'),'utf8');
const game=fs.readFileSync(path.join(root,'js/game.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const expected="grassland:5,desert:10,rural:15,neon:20,magma:30,sea:40,grassland2:45,tribe:55,rural2:55,neon2:60,magma2:65,desert2:70,demonCastle:75,unfinishedBook:80,demonCastle2:85";
function ok(v,msg){if(!v){console.error('FAIL:',msg);process.exitCode=1;}else console.log('PASS:',msg);}
ok(data.includes(`const recommended={${expected}};`),'data.js has the canonical recommended-level table');
ok(game.includes(`const RECOMMENDED_LEVELS_V201={${expected}};`),'game.js final safety normalization matches canonical table');
ok(!game.includes("w.recommendedLevel=(Number(w.recommendedLevel)||5)+5"),'legacy blanket +5 adjustment is removed');
ok(game.includes("Object.entries({demonCastle:75,unfinishedBook:80,demonCastle2:85})"),'late-story legacy override matches final anchors');
ok(html.includes('<div class="title-version">v201</div>'),'title displays v201');
ok(game.includes("window.__mobBuildVersion='v201'"),'runtime build version is v201');
if(process.exitCode)process.exit(process.exitCode);
