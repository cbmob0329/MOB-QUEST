const fs=require('node:fs');
const game=fs.readFileSync(require('node:path').join(__dirname,'../js/game.js'),'utf8');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
function ok(cond,msg){if(!cond)throw new Error(msg);}
ok(game.includes('// UPDATE_V194_BEGIN'),'v194 block missing');
ok(game.includes("await storySay('money','リリスがいる方は3体\\n戦力の分け方が大事ね！');"),'Money final line missing');
ok(game.includes('await waitLilithFormationGateV194();'),'formation gate is not directly after dialogue');
ok(game.includes('await chooseSplitV181(LILITH_SPLIT_OPT_V194);'),'split call missing');
ok(!game.slice(game.indexOf('// UPDATE_V194_BEGIN')).includes('storyLineLocalV193'),'v193 bridge leaked into v194');
ok(!game.slice(game.indexOf('// UPDATE_V194_BEGIN')).includes('lilithFamilyRoseSummonBaseV185'),'v185 summon hook leaked into v194');
ok(html.includes('<div class="title-version">v194</div>'),'title is not v194');
ok(html.includes('window.__mobV194LilithCleanFlow=true'),'inline v194 block missing');
console.log('v194 clean Lilith flow static checks: PASS');
