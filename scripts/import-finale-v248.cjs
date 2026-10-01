const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'..');
const source=process.argv[2]||'D:/MOB-QUEST-データ/ストーリー編集/魔王城Ⅱからエンディング_編集用_20261001.txt';
const text=fs.readFileSync(source,'utf8').replace(/^\uFEFF/,'').replace(/\r/g,'');
const names={'モブピンク':'pink','モブデザート':'desert','モブマニー':'money','モブテツ':'tetsu','モブネコクー':'nekoku','モブニョロ':'nyoro','モブデンデン':'denden','モブリーロ':'riro','モブジェシー':'jessie','モブ怪人のボス':'kaijin','モブリリス':'boss-lilith-castle','モブ閻魔':'dc2-enma','モブ閻魔 第二形態':'dc2-enma2','モブ閻魔 最終形態':'dc2-enma3','モブ魔王':'dc2-maou','ウルモブリリス':'dc2-ulrilis','モブスライムキング':'king','一同（モブリロ以外）':'chorus'};
const parts=text.split(/={10,}\n([^\n]+)\n={10,}\n/),sections={};
for(let i=1;i<parts.length;i+=2){const title=parts[i].trim(),steps=[];for(const paragraph of parts[i+1].trim().split(/\n\s*\n/)){const lines=paragraph.trim().split('\n');if(!lines[0])continue;const nameIndex=lines.findIndex(l=>names[l]);if(nameIndex>=0){if(nameIndex)steps.push({op:'direction',text:lines.slice(0,nameIndex).join('\n')});steps.push({op:'say',id:names[lines[nameIndex]],text:lines.slice(nameIndex+1).join('\n')});}else if(lines[0]==='【ナレーション】')steps.push({op:'narrate',text:lines.slice(1).join('\n')});else if(lines[0]==='【画面メッセージ】')steps.push({op:'message',text:lines.slice(1).join('\n')});else steps.push({op:'direction',text:paragraph.trim()});}sections[title]=steps;}
fs.writeFileSync(path.join(root,'js/finale-dialogue-v248.json'),JSON.stringify(sections,null,2)+'\n');
console.log(Object.entries(sections).map(([k,v])=>k+': '+v.filter(s=>s.op==='say').length+'台詞').join('\n'));
