const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const game=fs.readFileSync(path.join(root,'js','game.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
function ok(v,m){if(!v)throw new Error(m)}
function between(a,b){const i=game.indexOf(a),j=game.indexOf(b,i);ok(i>=0&&j>i,`missing range ${a}`);return game.slice(i,j)}
const split=between('async function isolatedSplitV195(){','async function runDemonCastleLilithPreV195(){');
ok(html.includes('<div class="title-version">v196</div>'),'title is not v196');
ok(game.includes("window.__mobBuildVersion='v196'"),'runtime version is not v196');
ok(game.includes('window.__mobV196LilithInlineFormation=true'),'v196 marker missing');
ok(split.includes('data-v196-formation'),'inline formation screen missing');
ok(split.includes('data-v196-member'),'inline member controls missing');
ok(split.includes('data-v196-confirm'),'inline confirm missing');
ok(split.includes('data-v196-yes')&&split.includes('data-v196-no'),'inline yes/no missing');
ok(split.includes('state.meta.lilithSplit={A:clone(split.A),B:clone(split.B)}'),'split save missing');
ok(!split.includes('chooseSplitV181('),'private v181 chooseSplitV181 must not be called from v195/v196 scope');
ok(!split.includes("document.getElementById('lilithSplitOverlay')")&&!split.includes('querySelector(\"#lilithSplitOverlay\")'),'legacy split overlay DOM must not be used by isolated v196 flow');
ok(!split.includes("document.getElementById('dialogOverlay')")&&!split.includes("$('#dialogOverlay')"),'legacy dialog overlay DOM must not be used by isolated v196 flow');
ok(game.includes("conversationAllowedTargetV171=target=>!!target?.closest?.('#lilithIsolationV195,#lilithSplitOverlay,#dialogOverlay')"),'isolation input whitelist missing');
ok(game.includes('state.adventure.lilithSplitReadyV183=true'),'legacy duplicate split guard missing');
console.log('update-v196 inline isolated formation tests: OK');
