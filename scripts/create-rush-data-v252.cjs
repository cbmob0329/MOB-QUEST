// One-time authoring helper. The editable JSON is authoritative after creation.
const fs=require('node:fs');
const audit=JSON.parse(fs.readFileSync('artifacts/rush-audit.json','utf8'));
const phoenix=JSON.parse(fs.readFileSync('artifacts/rush-phoenix-audit.json','utf8'));
const enemies={};
for(const id of ['g-slime','g-rock','g-savanna','g-iwakiri','r-knife','r-denchi','r-scouter','r-captain','m-golem','m-blizzard','m-flame','m-frezard']){
 const t=structuredClone(audit.enemies.find(e=>e.id===id));if(!t)throw Error(id);
 const actions=t.category==='normal'?1:2;
 Object.assign(t,{actionCount:actions,forceActionCount:true,v144ActionMin:actions,v144ActionMax:actions,noEscape:true});enemies[id]=t;
}
enemies[phoenix.id]={...phoenix,actionCount:2,v144ActionMin:2,v144ActionMax:3,mods:{hp:.3,atk:.75,mag:.75}};
const say=(speaker,text)=>({speaker,text});
const wave=(...rows)=>rows.map(([enemy,level])=>({enemy,level}));
const area=(waves,pre=[],post=[])=>({waves,pre,post});
const medal=(id,name,image,rarity,attribute,stats,traits)=>({id,name,image,rarity,attribute,type:'メダル',types:['メダル'],stats,traits,traitLabel:traits.map(t=>t.label).join(' / ')});
const data={schemaVersion:1,icon:'mqicon/rush-v252.png',maxVisible:4,maxSimultaneous:2,completionLimit:1,battleRewards:false,enemies,medals:[
 medal('rush-savanna-v252','モブサバンナ・連戦の証','enemy/09.png','SR','地',{def:30,maxHp:100},[{kind:'resist',element:'地',value:.03,label:'地属性耐性+3%'}]),
 medal('rush-captain-v252','モブキャプテン・連戦の証','enemy/54.png','SR','闇',{atk:40,maxMp:100},[{kind:'resist',element:'闇',value:.05,label:'闇属性耐性+5%'}]),
 medal('rush-frezard-v252','モブフレザード・連戦の証','enemy/103.png','SSR','火',{mag:40,res:40},[{kind:'resist',element:'火',value:.05,label:'火属性耐性+5%'},{kind:'resist',element:'水',value:.05,label:'水属性耐性+5%'}]),
 medal('rush-golem-v252','モブマグゴーレム・連戦の証','enemy/94.png','SSR','火',{def:50,maxHp:200},[{kind:'guardExtraCut',value:.05,label:'防御時の追加ダメージ軽減+5%'}])
],quests:[
 {id:'rush-grass-v252',title:'草原の連戦稽古',world:'grassland',recommendedLevel:10,unlock:{world:'grassland',label:'草原クリア'},reward:'rush-savanna-v252',areas:[area([
 wave(['g-slime',7],['g-rock',7]),wave(['g-savanna',9]),wave(['g-iwakiri',10])
 ],[say('pink','次から次へと来るであります！'),say('denden','休まず三連戦でやんす！'),say('pink','HPとMPを残して進むであります！')],[say('denden','最後まで戦い抜いたでやんす！'),say('pink','このメダルは、連戦を乗り越えた証であります！')])]},
 {id:'rush-rural-v252',title:'田舎町の見張り稽古',world:'rural',recommendedLevel:23,unlock:{world:'rural',label:'田舎町クリア'},reward:'rush-captain-v252',areas:[area([
 wave(['r-knife',19],['r-denchi',19]),wave(['r-scouter',21]),wave(['r-captain',23])
 ],[say('money','見張りの向こうに、まだいるわね。'),say('pink','まとめて相手にはしないであります！'),say('money','一戦ずつよ。回復のタイミングも考えてね。')],[say('pink','見張り稽古、完了であります！'),say('money','ふう。この調子で次も乗り切りましょう。')])]},
 {id:'rush-magma-v252',title:'炎と氷の連戦稽古',world:'magma',recommendedLevel:43,unlock:{world:'magma',label:'マグマクリア'},reward:'rush-frezard-v252',areas:[
 area([wave(['m-golem',39]),wave(['m-blizzard',40])],[say('denden','熱いのと冷たいの、両方でやんすか！？'),say('money','魔法を使い切らないで。まだ先があるわ。')],[say('pink','次のAREAも、今のHPとMPで進むであります！')]),
 area([wave(['m-flame',41]),wave(['m-frezard',43])],[say('money','最後は炎と氷の相手ね。油断しないで！')],[say('denden','オイラたちの連携も負けてないでやんす！')])]},
 {id:'rush-ember-v252',title:'灼熱の再挑戦',world:'magma',recommendedLevel:80,unlock:{world:'tribe',story:'phoenix',record:'clear',label:'部族村と「復活！モブフェニックス！」クリア'},reward:'rush-golem-v252',areas:[
 area([wave(['m-golem',72]),wave(['m-flame',73]),wave(['m-frezard',75])],[say('nyoro','もう一度、力を見てもらうニョロ！'),say('money','まずはここを抜けるわよ。温存も忘れないで。')],[say('pink','ここからが本番であります！')]),
 area([wave(['v179-phoenix',80])],[say('nyoro','モブフェニックス様、また来たニョロ！'),say('v179-phoenix','よかろう。\n今日は力を抑え、連戦の成果を見届けよう。')],[say('v179-phoenix','よく戦い抜いた。\nその経験を、次の戦いに生かせ。'),say('pink','ありがとうであります！')])]
 }
]};
if(fs.existsSync('js/rush-v252.json'))throw Error('Refusing to overwrite editable rush data');
fs.writeFileSync('js/rush-v252.json',JSON.stringify(data,null,2)+'\n');
