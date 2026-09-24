const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'フィギュアについての修正と追加');
const read=f=>fs.readFileSync(path.join(dir,f),'utf8').replace(/\r/g,'');
const figures=[];
for(const [file,folder] of [['figure_list_main.txt','fig'],['figure_list_monsters_bosses.txt','figene'],['figure_list_chogokin.txt','spbossfig'],['figure_event_quest.txt','eventfig']]){
 let currentFolder=folder,current=null,section='';
 for(const raw of read(file).split('\n')){const line=raw.trim();let m;
  if((m=line.match(/^(figplay|figboss)\//))){currentFolder=m[1];continue;}
  if((m=line.match(/^([0-9]{2,3})$/))||(folder==='eventfig'&&(m=line.match(/^(モブ.+?)\s+(\d{2,3})$/)))){
   current={image:`${currentFolder}/${m[2]||m[1]}.png`,name:m[2]?m[1]:'',tags:[],adjacencyTags:[],source:file};figures.push(current);continue;
  }
  if(!current)continue;
  if(line==='アクセサリースキル:'){section='soul';continue;}
  if(line==='モブピースバトルスキル:'){section='piece';continue;}
  if(!current.name&&line){current.name=line;continue;}
  if((m=line.match(/^レア度\s*[:：]?\s*(MOB|UR|SSR|SR|R)/)))current.rarity=m[1];
  if((m=line.match(/^ステータス効果[:：](.*)/)))current.statsText=m[1].normalize('NFKC');
  else if(current.statsText===''&&/^(HP|MP|ATK|DEF|MAG|MND|SPD)\s*\+/.test(line))current.statsText=line.normalize('NFKC');
  if((m=line.match(/^特性[:：](.*)/)))current.traitText=m[1].normalize('NFKC');
  if((m=line.match(/^タグ[:：](.*)/)))current.tags=[...m[1].matchAll(/\d+/g)].map(x=>x[0].padStart(2,'0'));
  if((m=line.match(/^隣接(?:タグ)?[:：](.*)/)))current.adjacencyTags=[...m[1].matchAll(/\d+/g)].map(x=>x[0].padStart(2,'0'));
  if((m=line.match(/^ソウルコスト\s*(\d+)\s+([^:：]+)[:：](.*)/)))current.soul={cost:+m[1],name:m[2],text:m[3]};
  else if((m=line.match(/^ソウルコスト\s*(\d+)\s+(\S+)\s+(.+)/)))current.soul={cost:+m[1],name:m[2],text:m[3]};
  else if(section==='soul'&&current.soul&&/^(さらに|攻撃後|\d+%)/.test(line))current.soul.text+=line;
  if((m=line.match(/^ソウル(1|5|10)\s+([^:：]+)[:：](.*)/))){(current.pieceSoul??={})[m[1]]={name:m[2],text:m[3]};}
  else if((m=line.match(/^ソウル(1|5|10)[:：](.*)/))){(current.pieceSoul??={})[m[1]]={name:current.soul?.name||'',text:m[2]};}
 }
}
const tags=[];
for(const m of read('figure_system.txt').matchAll(/^(\d{2}) ([^\n]+)\n([\s\S]*?)(?=^\d{2} |^■|$(?![\s\S]))/gm)){
 const tiers=m[3].match(/2体\s*([^\n]*?)\s*3体\s*([^\n]+)/),piece=m[3].match(/モブピースバトル効果\s*\n2体\s*([^\n]*?)\s*3体\s*([^\n]+)/);
 if(tiers)tags.push({id:m[1],name:m[2],two:tiers[1].trim(),three:tiers[2].trim(),pieceTwo:piece?.[1],pieceThree:piece?.[2]});
}
const adjacency=[];
for(const m of read('figure_adjacent_tags.txt').matchAll(/^(\d{2})\n([^\n]+)\n装備[:：]([^\n]+)\nモブピースバトル[:：]([^\n]+)(?:\n(このタグ[^\n]+))?/gm))adjacency.push({id:m[1],name:m[2],equipment:m[3],piece:m[4]+(m[5]?' '+m[5]:'')});
// User-confirmed September 24 mapping supersedes duplicate numbering in the sheet.
for(const f of figures)if(f.image.startsWith('eventfig/')){const n={'モブキャロメル':51,'モブムゥクラブ':52,'モブジーン':53,'モブマグナム':54,'モブアノコ':55}[f.name];if(n)f.image=`eventfig/${n}.png`;if(f.name==='モブキャロメル')f.name='モブキャロル';}
for(const f of figures)if(f.soul)for(const skill of Object.values(f.pieceSoul||{}))skill.name=f.soul.name;
for(const f of figures){if(!fs.existsSync(path.join(root,f.image))){const alternate=f.image.replace(/\/0+(\d+)\.png$/,'/$1.png');if(fs.existsSync(path.join(root,alternate)))f.image=alternate;else f.assetMissingV218=true;}}
const validFigures=figures.filter(f=>f.rarity);
const duplicated=new Set(validFigures.filter((f,i)=>validFigures.findIndex(x=>x.image===f.image)!==i).map(f=>f.image));
for(const f of figures)if(duplicated.has(f.image))f.conflictV218=true;
const data={figures:figures.filter(f=>f.rarity),tags,adjacency};
fs.writeFileSync(path.join(root,'js/figure-catalog-v218.json'),JSON.stringify(data,null,2)+'\n');
let game=fs.readFileSync(path.join(root,'js/game.js'),'utf8');
if(!game.includes('  recordLegendAllyActionV219(b);'))game=game.replace(/  b\.queuePos\+\+;\r?\n  b\.busy=false;\r?\n  renderBattle\(\);\r?\n  await processQueue\(\);/,'  recordLegendAllyActionV219(b);\n  b.queuePos++;\n  b.busy=false;\n  renderBattle();\n  await processQueue();');
game=game.replace('1,dynamicBookRage?4:3);return Array.from','1,b.config?.legendV218?5:dynamicBookRage?4:3);return Array.from');
game=game.replace(/\r?\nmigrateFigureInventoryV115\(\);\r?\n/,'\n// Inventory migration is performed by v218 before the first interaction.\n');
game=game.replace('stats:{atk:30,maxHp:150,maxMp:250}', 'stats:{atk:3,maxHp:15,maxMp:25}');
game=game.replaceAll('atCap=figureOwned(f.id)>=figureOwnCapV115(f)', 'atCap=figureOwned(f.id)>0&&figurePlusV218(f.id)>=9');
game=game.replace("if(figureOwned(f.id)>=figureOwnCapV115(f))return facilityTalk", "if(figureOwned(f.id)>0&&figurePlusV218(f.id)>=9)return facilityTalk");
game=game.replace('所持 ${figureOwned(f.id)}/${figureOwnCapV115(f)}', "${figureOwned(f.id)?'所持 / 強化 +'+figurePlusV218(f.id):'未所持'}");
game=game.replace('(config.party||state.party).slice(0,10)','(config.party||state.party).slice(0,config.legendV218?20:10)');
game=game.replace('mainIds:allies.slice(0,4).map(a=>a.id),superIds:allies.slice(4,6).map(a=>a.id),reserveIds:allies.slice(6,10).map(a=>a.id)','mainIds:(config.legendV218?allies:allies.slice(0,4)).map(a=>a.id),superIds:config.legendV218?[]:allies.slice(4,6).map(a=>a.id),reserveIds:config.legendV218?[]:allies.slice(6,10).map(a=>a.id)');
game=game.replace('const base=FIGURES.filter(f=>usableFigureV103(f));','const base=FIGURES.filter(f=>usableFigureV103(f)&&cpuFigureAvailableV218(f));');
game=game.replace(/function unreleasedPartyFigureV132\(f\)\{[^\n]*\}/,'function unreleasedPartyFigureV132(f){return false;}');
game=game.replaceAll('const skill=Math.random()<raritySkillChanceV110(a.f?.rarity),crit=', 'const skill=false,crit=');
game=game.replace("e.atkBuff=Math.max(e.atkBuff||0,.30);e.magBuff=Math.max(e.magBuff||0,.30);e.atkBuffTurns=e.magBuffTurns=99;notice('火属性与ダメージ +30%'", "e.fireDamageV218=.30;notice('火属性与ダメージ +30%'");
game=game.replace("dealt+=await damageAlly(t,1.35,'physical',false,'火');for(const a of livingField())dealt+=await damageAlly(a,.45,'physical',isSuper(a),'火');", "dealt+=await damageAlly(t,1.8,'physical',false,'火');e.phoenixIgnoreV218=true;try{for(const a of livingField())dealt+=await damageAlly(a,.45,'physical',isSuper(a),'火');}finally{e.phoenixIgnoreV218=false;}");
const patch='// UPDATE_V218_BEGIN\nconst CATALOG_V218='+JSON.stringify(data)+';\n'+['update-v218.js','events-v218.js','soul-v218.js','integration-v218.js','update-v219.js','figures-v220.js','combat-v220.js','gacha-v220.js'].map(f=>fs.readFileSync(path.join(root,'js',f),'utf8')).join('\n')+'\n// UPDATE_V218_END';
if(game.includes('// UPDATE_V218_BEGIN'))game=game.replace(/\/\/ UPDATE_V218_BEGIN[\s\S]*?\/\/ UPDATE_V218_END/,()=>patch);
else {const i=game.lastIndexOf('})();');game=game.slice(0,i)+patch+'\n\n'+game.slice(i);}
fs.writeFileSync(path.join(root,'js/game.js'),game);
let css=fs.readFileSync(path.join(root,'css/style.css'),'utf8').replace(/\/\* UPDATE_V218_BEGIN \*\/[\s\S]*?\/\* UPDATE_V218_END \*\//,'');
fs.writeFileSync(path.join(root,'css/style.css'),css.trim()+'\n/* UPDATE_V218_BEGIN */\n'+['update-v218.css','quest-presentation-v218.css','update-v219.css','update-v220.css'].map(f=>fs.readFileSync(path.join(root,'css',f),'utf8')).join('\n')+'\n/* UPDATE_V218_END */\n');
const html=path.join(root,'index.html');fs.writeFileSync(html,fs.readFileSync(html,'utf8').replace(/<div class="title-version">v\d+<\/div>/,'<div class="title-version">v220</div>'));
require('./sync-inline.cjs');
console.log('v218',data.figures.length,'figures',tags.length,'tags',adjacency.length,'adjacency tags');
