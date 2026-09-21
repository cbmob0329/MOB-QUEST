const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const game=fs.readFileSync(path.join(root,'js/game.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
function ok(cond,msg){if(!cond)throw new Error(msg);}
ok(game.includes("window.__mobBuildVersion='v207'"),'v207 build marker missing');
ok(html.includes('<div class="title-version">v207</div>'),'v207 title missing');
ok(game.includes('autoSupportTargetV207'),'AUTO support-target fix missing');
ok(game.includes('targetId:target.id'),'AUTO magic targetId missing');
ok(game.includes("if(r?.worldId==='unfinishedBook')"),'stale Reading Book report guard missing');
ok(game.includes("'武運を祈る！'"),'post-Book King line missing');
for(const s of [
  'ここは異世界\\n何が起きても','手加減無用でござるな','サポートし合うニョロ！',
  '良い構えをしているでござる','気をつけろ！','強すぎるでやんす・・',
  'アチアチの展開でやんす！','正義は勝つであります！','ヒロインも勝つのよ！',
  '王の間にて知らせを待つ！\\n武運を祈っておるぞ！'
])ok(game.includes(s),`authored line missing: ${s}`);
ok(!game.includes("bookArea3PostV207(){\n  bookHeroStoryModeV94='normal';await openStoryScene('unfinishedBook',2);await storyShowGuest('book-kaijin-boss',{slow:true});\n  await storySay('money','なによ、、\\nコイツこんなに強いなんて、、');await storySay('nekoku','オラ、もう動けない、、');await storySay('pink','み、みんな、しっかりするであります！');await storySay('denden','強すぎるでやんす・・');await storySay('desert','ここで終わるわけにはいかない・・\\n一旦引くぞ！');await storySay('book-kaijin-boss','ははは！\\n逃がすとでも思っているのか？');\n  await partyHealFxV159"),'unauthorized party-heal effect reintroduced');
console.log('v207 static checks PASS');
