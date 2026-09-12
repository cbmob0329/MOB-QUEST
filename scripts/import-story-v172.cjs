// Import the authored dialogue; stage directions are mapped explicitly below.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),source=process.argv[2];
if(!source)throw Error('Pass the authored UTF-8 text file');
const names={'モブデンデン':'denden','デンデン':'denden','モブマニー':'money','モブデザート':'desert','モブピンク':'pink','モブニョロ':'nyoro','モブネコクー':'nekoku','モブテツ':'tetsu','モブジェシー':'jessie','モブヒノタビ':'m-hinotabi','モブブリザード':'m-blizzard','モブフレイム':'m-flame','モブフレザード':'m-frezard','モブドラゴン':'dragon','モブアビスナイト':'s-abyssknight','モブジョーンズ':'s-jones','モブウェイブ':'s-wave','モブネプチューン':'nepu','モブツルガンナー':'g2-tsuru','モブメラケロ':'g2-merakero','モブケロキング':'g2-keroking','モブホークⅡ':'boss-hawk2','モブククリ':'t-kukuri','モブタフネス':'t-tough','モブヒスイ':'t-hisui','モブリュウゴウ':'t-ryugo','モブデーバフ':'boss-debuff','モブバーサク':'boss-berserk'};
const worlds={'マグマ':'magma','海底':'sea','草原Ⅱ':'grassland2','部族村':'tribe'};
const guests={magma:[['m-golem'],['m-hinotabi'],['m-blizzard','m-flame'],['dragon']],sea:[['s-abyssknight'],['s-jones'],['s-wave'],['nepu']],grassland2:[['g2-tsuru'],['g2-merakero'],['g2-keroking'],['boss-hawk2']],tribe:[['t-kukuri'],['t-tough'],['t-hisui','t-ryugo'],['boss-debuff','boss-berserk']]};
let world,area=0,key,speaker=null,text=[],events={},battle={};
function push(row){(key.startsWith('battle:')?(battle[key]??=[]):events[key].steps).push(row);}
function flush(){if(!speaker)return;let value=text.join('\n');if(value){if(speaker==='dual'){push(['sayDual','money','お前が言うな！！','pink','お前が言うな！！（であります）']);}else if(speaker==='narrate')push(['narrate',value]);else if(speaker==='???')push(['sayOff','???',value]);else if(world==='sea'&&speaker==='nekoku'&&value==='はいはい！')push(['sayOff','モブネコクー',value]);else push([value.includes('（赤文字迫力）')?'sayRed':'say',speaker,value.replace('（赤文字迫力）','')]);}speaker=null;text=[];}
function begin(phase){flush();key=phase==='arrival'?`arrival:${world}`:area===3&&['magma','sea'].includes(world)?`${phase}:${world}`:`${phase}:${world}:${area}`;events[key]={worldId:world,area,steps:[]};if(world==='tribe'&&phase!=='arrival')events[key].extras=['jessie'];if(phase==='pre'){const ids=guests[world][area];push(ids.length>1?['guests',ids]:[world==='magma'&&area===3?'guestSlow':'guest',ids[0]]);}if(phase==='post'&&((world==='sea')||(world==='magma'&&area===3)||(world==='grassland2'&&[0,2,3].includes(area))))push(['guest',guests[world][area][0]]);}
const ignored=/^(AREA 到着|到着後|中ボスを表示|ドラゴン遭遇|フェードインでドラゴン登場|みんな横に避ける|演出後|戦闘$|合体後|変身演出後|※|戦闘中なので)/i;
for(const raw of fs.readFileSync(source,'utf8').replace(/\r/g,'').split('\n')){
 const line=raw.trim();if(!line){flush();continue;}
 if(line.startsWith('■')){world=worlds[line.slice(1)];if(!world)throw Error(line);area=0;begin('arrival');continue;}
 const match=line.match(/^[・]?area\s*([1-4])/i);if(match){area=Number(match[1])-1;begin('pre');continue;}
 if(/^(討伐後|撃破後|勝利後|戦闘後)$/.test(line)){begin('post');continue;}
 if(line.startsWith('戦闘中合体')){flush();key='battle:magma:fusion';continue;}
 if(line.startsWith('戦闘中、どちらか')){flush();key='battle:tribe:transform';continue;}
 if(names[line]||line==='モブマニー＆モブピンク'||line==='中央ナレーション'||/^(\?\?\?|？？？)$/.test(line)){flush();speaker=names[line]||(line==='中央ナレーション'?'narrate':line==='モブマニー＆モブピンク'?'dual':'???');continue;}
 if(line==='上からモブニョロが降ってくる'){flush();push(['guestDropDodge','nyoro','ドン！ッ']);continue;}
 if(line.includes('二人がデンデンに突進')){flush();push(['doubleRushV172']);continue;}
 if(line==='モブテツが超高速で走って来る演出'){flush();push(['dashGuestV172','tetsu']);continue;}
 if(line==='モブマニーがピンクの球体魔法を溜める演出'){flush();push(['chargeOrbV172']);continue;}
 if(line==='モブマニーが魔法を消す演出'){flush();push(['dismissOrbV172']);continue;}
 if(line==='モブネコクーを表示'){flush();push(['seaGuestV172']);continue;}
 if(line==='モブジェシーを表示'){flush();push(['guest','jessie']);continue;}
 if(line==='モブツルガンナー表示'){flush();push(['guests',['g2-tsuru','boss-hawk2','g2-savanna']]);continue;}
 if(line==='フェードアウト'){flush();push(['fadeV157',guests[world][area][0]]);continue;}
 if(line==='モブテツが仲間に加わった！'){flush();push(['join','tetsu',line]);continue;}
 if(line==='モブトマトジュースセットを1つ手に入れた！'){flush();push(['rewardDrink','19',line]);continue;}
 if(/^[56][つ枚]/.test(line)){flush();push(['narrate',line]);continue;}
 if(ignored.test(line)||/^モブ.+を表示$/.test(line)){flush();continue;}
 if(!speaker)throw Error('Unmapped direction: '+line);
 text.push(line);
}
flush();
events['arrival:magma'].steps.push(['join','nyoro','モブニョロが仲間に加わった！']);
// Keep the already-established early playable join while updating the authored dialogue.
events['arrival:tribe'].steps.push(['joinSilent','jessie']);
const sea=events['post:sea'].steps;sea.splice(sea.findIndex(s=>s[1]==='denden'&&s[2]==='仲間が増えたでやんす！')+1,0,['joinSilent','nekoku']);
const result={events,battle};
// The final reply addresses Tetsu; its speaker label in the memo repeats Tetsu.
const last=events['post:tribe:3'].steps.at(-1);if(last?.[2]==='あんたちょっと危険ね')last[1]='jessie';
fs.writeFileSync(path.join(root,'js/story-v172.json'),JSON.stringify(result,null,2)+'\n');
console.log(`${Object.keys(events).length} scenes and ${Object.keys(battle).length} battle conversations imported`);

