const fs=require('node:fs'),assert=require('node:assert/strict'),read=p=>fs.readFileSync(p,'utf8');
const js=read('js/game.js'),old=read('artifacts/equipment-v256/backup/js_game.js');
const strip=s=>s.replace(/\/\/ UPDATE_V256_BEGIN[\s\S]*?\/\/ UPDATE_V256_END\s*/,'').replace('armor:x.armor||null,mainMedal:x.mainMedal||null,subMedal:x.subMedal||null,medals:','armor:x.armor||null,medals:').trim();
assert.equal(strip(js),strip(old),'Only equipment extension and bootstrap normalization may change');
const css=read('css/style.css'),stripCss=s=>s.replace(/\/\* UPDATE_V256_BEGIN \*\/[\s\S]*?\/\* UPDATE_V256_END \*\//,'').trim();assert.equal(stripCss(css),stripCss(read('artifacts/equipment-v256/backup/css_style.css')));
const html=read('index.html');assert.equal(html.match(/<script id="mobQuestInlineData">([\s\S]*?)<\/script>/)[1].trim(),read('js/data.js').trim()+'\n'+js.trim());assert.equal(html.match(/<style id="mobQuestInlineStyle">([\s\S]*?)<\/style>/)[1].trim(),css.trim().replace(/url\((['"]?)\.\.\//g,'url($1'));
fs.writeFileSync('artifacts/equipment-v256/source-results.json',JSON.stringify({rushAndOtherSourcePreserved:true,bootstrapMigration:true,embeddedSourcesMatch:true},null,2));console.log('PASS rush/other source preservation, bootstrap migration, embedded JS/CSS sync');
