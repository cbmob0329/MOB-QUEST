const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'イベントクエスト/イベントクエスト  砂漠の盗賊ファミリー！.txt'),'utf8');
const speakers={'モブピンク':'pink','モブデザート':'desert','モブデンデン':'denden','モブマニー':'money','マニー':'money','モブニョロ':'nyoro','モブネコクー':'nekoku','モブハリネット':'bandit230-hari','モブエリマッキン':'bandit230-eri','モブエリマッキン！':'bandit230-eri','モブホラプエ':'bandit230-pue','モブオンブ':'bandit230-onbu','モブホラクイーン':'bandit230-queen','???':'unknown'};
const out=[[],[],[]];let d=-1,area=-1,phase='pre',speaker=null,battle=false;
const add=(...s)=>out[d][area][phase].push(s);
for(const raw of source.split(/\r?\n/)){
 const s=raw.trim();if(!s)continue;
 if(['ノーマル','ハード','インフェルノ'].includes(s)){d=['ノーマル','ハード','インフェルノ'].indexOf(s);area=-1;continue;}if(d<0)continue;
 const a=s.match(/^area\s*(\d)$/i);if(a){area=+a[1]-1;out[d][area]={pre:[],post:[]};phase='pre';speaker=null;battle=false;continue;}if(area<0)continue;
 if(/^(討伐後|戦闘後)$/.test(s)){phase='post';battle=false;speaker=null;continue;}
 if(s==='クリア演出'){speaker=null;continue;}
 if(speakers[s]){if(battle){phase='post';battle=false;}speaker=speakers[s];continue;}
 if(/^(戦闘|必殺技|パッシブ)$|^戦闘へ$|Lv\.|LV\.|Lv\s*\d|LV\s*\d/.test(s)){battle=true;speaker=null;continue;}
 if(battle)continue;
 if(/^ナレーション/.test(s)){speaker=null;continue;}
 if(/^ド[ドン、]|^ポン、|^プー！/.test(s)){add('beat',s);speaker=null;continue;}
 if(/跳ねて交差しながら/.test(s)){add('enter',['hari','eri'],'dance');speaker=null;continue;}
 if(/モブミイラ.*(?:3体|5体|体表示)/.test(s)){add('enter',Array(s.includes('3体')?3:5).fill('mummy'),'run');speaker=null;continue;}
 if(s.includes('モブシャーティー、モブポイズン')){add('enter',['sharty','poison'],'jump');speaker=null;continue;}
 if(/モブホラクイーンが♪/.test(s)){add('enter',['queen'],'fast');add('notes','queen');speaker=null;continue;}
 if(/(?:ゆっくりモブホラプエ|モブホラプエが高速)/.test(s)){add('enter',['pue'],s.includes('高速')?'fast':'walk');speaker=null;continue;}
 if(s==='モブホラプエ表示')continue;
 if(s==='モブオンブがゆっくり歩いてくる'){add('enter',['onbu'],'walk');speaker=null;continue;}
 if(s==='走ってくる演出'){add('enter',['hari','pue','eri'],'run');speaker=null;continue;}
 if(s==='盗賊団が高速で集まってくる'){add('enter',['hari','eri','queen','onbu','pue'],'fast');speaker=null;continue;}
 if(s.includes('！？マーク')){add('surprise',['hari','eri']);speaker=null;continue;}
 if(s==='二人が沈黙する演出'){add('pause');speaker=null;continue;}
 if(/^二人が.*(?:消えて|逃げ)/.test(s)){add('exit',['hari','eri']);speaker=null;continue;}
 if(s==='モブオンブが走って逃げる'){add('exit',['onbu']);speaker=null;continue;}
 if(s==='走って消える'){add('exit',[speaker?.replace('bandit230-','')]);speaker=null;continue;}
 if(s.includes('モブミイラ全員がランダム')){add('jumpGuests');speaker=null;continue;}
 if(s.includes('モブホラプエが揺れながら')){add('notes','pue');speaker=null;continue;}
 const mover=Object.keys(speakers).find(k=>s.startsWith(k+'が')&&/跳ね|震え/.test(s));
 if(mover){add(s.includes('震え')?'shake':'jump',speakers[mover]);speaker=null;continue;}
 if(s==='跳ねて踊りながら'){add('jump','denden');speaker=null;continue;}
 if(/^(※|効果音演出|中央に文字|超スピードで登場する演出|食い気味に|逃げたら|左に|右に|中央|左端|その隣|右端)/.test(s))continue;
 assert(speaker,`Unclassified ${d}/${area}/${phase}: ${s}`);add('say',speaker,s);
}
assert.deepEqual(out.map(x=>x.length),[4,3,4]);for(const rows of out)for(const row of rows)assert(row.pre.length&&row.post.length);
fs.writeFileSync(path.join(root,'js/bandit-dialogue-v230.json'),JSON.stringify(out,null,2)+'\n');console.log('bandit dialogue',out.flat().reduce((n,a)=>n+a.pre.length+a.post.length,0),'steps');
