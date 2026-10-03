const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const data=read('js/rush-v252.json'),runs=read('artifacts/rush-v252/balance-results.json');
if(runs.length!==36||runs.some(r=>!r.finished||!r.win||Object.values(r.medals).reduce((a,b)=>a+b,0)!==1))throw Error('Expected 36 complete runs with exactly one medal');
const groups=data.quests.flatMap(q=>[-3,0,3].map(offset=>{const rows=runs.filter(r=>r.quest===q.id&&r.level===q.recommendedLevel+offset);return {quest:q.id,title:q.title,level:q.recommendedLevel+offset,recommended:offset===0,wins:rows.filter(r=>r.win).length,runs:rows.length,turns:rows.map(r=>r.ends.reduce((s,e)=>s+e.turn,0)),finalMinimumHpPercent:Math.round(Math.min(...rows.flatMap(r=>r.final.map(a=>a.hp/a.maxHp)))*100),finalMinimumMpPercent:Math.round(Math.min(...rows.flatMap(r=>r.final.map(a=>a.mp/a.maxMp)))*100)};}));
fs.writeFileSync(path.join(root,'artifacts/rush-v252/balance-summary.json'),JSON.stringify({mode:'isolated real-engine automated playthrough, not manual',runs:runs.length,wins:runs.filter(r=>r.win).length,phoenixModifiers:data.enemies['v179-phoenix'].mods,groups},null,2));
let table='| クエスト | Lv. | 勝利 | AREA合計ターン | 終了時の最低HP | 終了時の最低MP |\n|---|---:|---:|---:|---:|---:|\n';
for(const g of groups){const min=Math.min(...g.turns),max=Math.max(...g.turns),fmt=s=>g.recommended?'**'+s+'**':s;table+='| '+[g.title,fmt(g.level),fmt(g.wins+'/'+g.runs),fmt(min===max?min:min+'～'+max),fmt(g.finalMinimumHpPercent+'%'),fmt(g.finalMinimumMpPercent+'%')].join(' | ')+' |\n';}
const file=path.join(root,'memo/モンスターラッシュ実戦検証-v252.md'),text=fs.readFileSync(file,'utf8');fs.writeFileSync(file,text.replace(/\| クエスト \| Lv\.[\s\S]*?(?=\nAREA間)/,table));
console.log('PASS 36 wins/36 runs, one medal each; updated report and summary');
