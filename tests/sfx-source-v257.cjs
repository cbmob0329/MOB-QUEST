const fs=require('node:fs'),assert=require('node:assert/strict'),read=p=>fs.readFileSync(p,'utf8');
const js=read('js/game.js'),css=read('css/style.css'),html=read('index.html');
assert.equal(js.replace(/\/\/ UPDATE_V257_BEGIN[\s\S]*?\/\/ UPDATE_V257_END\s*/,'').trim(),read('artifacts/sfx-v257/backup/js_game.js').trim());
assert.equal(css.replace(/\/\* UPDATE_V257_BEGIN \*\/[\s\S]*?\/\* UPDATE_V257_END \*\//,'').trim(),read('artifacts/sfx-v257/backup/css_style.css').trim());
assert.equal(html.match(/<script id="mobQuestInlineData">([\s\S]*?)<\/script>/)[1].trim(),read('js/data.js').trim()+'\n'+js.trim());
assert.equal(html.match(/<style id="mobQuestInlineStyle">([\s\S]*?)<\/style>/)[1].trim(),css.trim().replace(/url\((['"]?)\.\.\//g,'url($1'));
console.log('PASS existing JS/CSS preserved outside v257, embedded source sync');
