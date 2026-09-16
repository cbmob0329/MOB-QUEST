const fs=require('fs');
const game=fs.readFileSync('js/game.js','utf8');
const upd=fs.readFileSync('js/update-v181.js','utf8');
const css=fs.readFileSync('css/style.css','utf8');
const html=fs.readFileSync('index.html','utf8');
function ok(cond,msg){if(!cond){console.error('FAIL:',msg);process.exit(1)} console.log('OK:',msg)}
ok((game.match(/UPDATE_V181_BEGIN/g)||[]).length===1,'v181 appended exactly once');
ok(!game.includes('UPDATE_V181_HOTFIX')&&!upd.includes('UPDATE_V181_HOTFIX'),'no stale hotfix block');
ok(upd.includes('showGachaResultBaseV181=showGachaResultV115'),'gacha wrapper targets live result function');
ok(upd.includes('resultLockedV181'),'gacha outside-click result lock present');
ok(upd.includes('event-difficulty-v163[disabled]'),'locked event difficulties hidden');
ok(upd.includes('出撃可能キャラクター')&&upd.includes('このメンバーで出発しますか？'),'restricted party confirmation present');
ok(upd.includes("EVENT_PARTY_RULES_V181={custard:['pink','money','denden','nyoro']}"),'custard party restriction present');
ok(upd.includes("storageKey:'demonCastle2SplitV181'")&&upd.includes('Aグループ勝利！ 次はBグループの戦闘を開始します'),'Demon Castle II split sequence present');
ok(upd.includes("dc2WorldV181.areas[0].nextWave")&&upd.includes("{id:'dc2-lilith',level:85}"),'Demon Castle II two authored waves present');
ok(upd.includes("t.actionCount=3")&&upd.includes("t.damageReduction=.20"),'latest Demon King combat spec present');
ok(css.includes('dc2-fire-summon-v181')&&css.includes('dc2-maou-explosion-v181'),'Demon Castle II cinematic CSS present');
ok(html.includes('window.__mobV181Runtime=true'),'synced inline runtime contains v181');
console.log('PASS update-v181 static regression checks');
