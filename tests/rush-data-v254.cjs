const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const read=p=>fs.readFileSync(p,'utf8'),data=JSON.parse(read('js/rush-v254.json')),validate=require('../js/rush-validation-v254.js');
const context={worldIds:vm.runInNewContext(read('js/data.js')+'\nMOB_DATA.adventureWorlds.map(w=>w.id)'),assetExists:p=>fs.existsSync(p)};
assert.equal(validate(data,context),true);
const mutations=[
 d=>d.quests[0].areas[0].waves[0].splice(1),
 d=>d.quests[0].areas[0].waves[0].push(...d.quests[0].areas[0].waves[0]),
 d=>delete d.enemies['g-slime'].rushPassive,
 d=>{delete d.enemies['g-slime'].enemySkills;delete d.enemies['g-slime'].special;delete d.enemies['g-slime'].specialOptions;},
 d=>d.enemies['g-slime'].actionCount=1.5,
 d=>d.difficulties[1].levelOffset=0,
 d=>d.difficulties[2].hp=-1,
 d=>d.quests[0].areas[0].waves[0][0].level=120,
 d=>d.quests[0].areas[0].pre[0].text='開始します。',
 d=>d.quests[0].reward=d.quests[1].reward,
 d=>d.quests[0].unlock.world='missing-world',
 d=>d.medals[0].tiers[0].traits[0].value=1,
 d=>d.medals[0].image='../outside.png',
 d=>d.quests.find(q=>q.unlock.story==='phoenix').unlock.story=null
];
for(const mutate of mutations){const d=structuredClone(data);mutate(d);assert.throws(()=>validate(d,context));}
const stripJs=s=>s.replace(/\/\/ UPDATE_V252_BEGIN[\s\S]*?\/\/ UPDATE_V252_END/,'RUSH');
const stripCss=s=>s.replace(/\/\* UPDATE_V252_BEGIN \*\/[\s\S]*?\/\* UPDATE_V252_END \*\//,'RUSH');
assert.equal(stripJs(read('js/game.js')),stripJs(read('artifacts/rush-v254/backup/js_game.js')),'non-rush JS unchanged');
assert.equal(stripCss(read('css/style.css')),stripCss(read('artifacts/rush-v254/backup/css_style.css')),'non-rush CSS unchanged');
const html=read('index.html'),css=read('css/style.css').trim().replace(/url\((['"]?)\.\.\//g,'url($1');
assert.equal(html.match(/<style id="mobQuestInlineStyle">([\s\S]*?)<\/style>/)[1].trim(),css);
assert.equal(html.match(/<script id="mobQuestInlineData">([\s\S]*?)<\/script>/)[1].trim(),read('js/data.js').trim()+'\n'+read('js/game.js').trim());
const balance=JSON.parse(read('artifacts/rush-v254/balance-results.json'));
assert.equal(balance.length,270);assert.equal(new Set(balance.map(x=>`${x.quest}:${x.tier}:${x.seed}`)).size,270);assert.ok(balance.every(x=>x.win));
const result={stages:30,difficulties:3,waves:data.quests.reduce((n,q)=>n+q.areas.reduce((s,a)=>s+a.waves.length,0),0),negativeCases:mutations.length,nonRushUnchanged:true,embeddedSourcesIdentical:true,balanceWins:270};
fs.writeFileSync('artifacts/rush-v254/data-results.json',JSON.stringify(result,null,2));console.log('PASS',result);
