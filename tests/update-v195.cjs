const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const game=fs.readFileSync(path.join(root,'js','game.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
function ok(v,m){if(!v)throw new Error(m)}
ok(game.includes('window.__mobV195LilithIsolation=true'),'v195 isolation runtime missing');
ok(game.includes("ov.id='lilithIsolationV195'"),'white isolation layer missing');
ok(game.includes('パーティーを編成してください'),'formation narration missing');
ok(game.includes('data-lilith-isolation-start-v195'),'explicit formation button missing');
ok(game.includes('moneyFinalBridgeV195'),'Money fallback bridge missing');
ok(game.includes("state.adventure.lilithSplitReadyV183=true"),'legacy duplicate-split guard missing');
const v180=game.indexOf('// UPDATE_V180_END'),v181=game.indexOf('// UPDATE_V181_BEGIN');
ok(v180>=0&&v181>v180,'update boundaries missing');
ok(!game.slice(v180,v181).includes('})();'),'main app scope closes before v181');
ok(game.trimEnd().endsWith('})();'),'main app scope is not closed at final end');
ok(html.includes('<div class="title-version">v196</div>'),'title is not current v196');
ok(html.includes('window.__mobV196LilithInlineFormation=true'),'inline runtime not synchronized');
console.log('update-v195 base isolation tests: OK');
