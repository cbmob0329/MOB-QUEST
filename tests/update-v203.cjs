const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const g=fs.readFileSync(path.join(root,'js/game.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
function ok(v,msg){if(!v)throw new Error(msg);}
ok(g.includes('// UPDATE_V203_BEGIN'),'v203 marker missing');
ok(g.includes("ids.includes('boss-maou-castle')&&ids.includes('boss-yami-money')"),'Money/Yami reveal guard missing');
ok(g.indexOf('hideMoneyV157();',g.indexOf('// UPDATE_V203_BEGIN'))<g.indexOf('return storyShowGuestsBaseV203',g.indexOf('// UPDATE_V203_BEGIN')),'Money is not hidden before group reveal');
ok(g.includes("key!=='boss-yami-money'"),'Yami Money story scale override missing');
ok(g.includes("pinkHeadShakeV180=async function")&&g.includes("rotate:'-5deg'"),'Pink position-safe head shake missing');
ok(g.includes("castleJumpV178=async function(id)")&&g.includes("transform:'translateY(-30px)'"),'Pink position-safe jump missing');
ok(g.includes("a.commitStyles()"),'story animation final-frame commit missing');
ok(g.includes("モブマニーが封印されて"),'dialogue wording replacement missing');
ok(g.includes('normalizeMoneyInnerPairV203'),'Money/Yami inner pair normalization missing');
ok(html.includes('<div class="title-version">v203</div>'),'title version is not v203');
console.log('v203 static checks: PASS');
