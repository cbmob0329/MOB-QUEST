const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const names={'モブデンデン':'denden','モブジェシー':'jessie','モブマニー':'money','モブテツ':'tetsu','モブピンク':'pink','モブニョロ':'nyoro','モブデザート':'desert','モブネコクー':'nekoku','ネコクー':'nekoku','モブリーロ':'riro','モブネオタイガー':'n2-tiger','モブパレットレオン':'n2-palette','モブパレット':'n2-palette','モブネオマスター':'boss-neomaster','モブネオンマスター':'boss-neomaster','モブマグバスター':'m2-buster','モブドラゴン':'dragon','モブドラゴンⅡ':'boss-dragon2','ミラモブ':'boss-mira-d2','モブミラバスター':'d2-mirabuster','モブミラアース':'d2-miraearth','モブミラカラミ':'d2-mirakarami','モブミラナイト':'d2-miranight','モブミラタイム':'d2-miratime','ミラモブファラオ':'boss-dorafara'};
const worlds={'ネオン街Ⅱ':'neon2','マグマⅡ':'magma2','砂漠Ⅱ':'desert2'},four=['d2-miraearth','d2-mirakarami','d2-miranight','d2-miratime'];
const guests={neon2:[['n2-tiger'],['n2-tama','n2-kodora'],['n2-palette'],['boss-neomaster']],magma2:[['m2-yogan'],['m2-salamander'],['m2-buster'],['dragon']],desert2:[['boss-mira-d2'],['d2-mirabuster'],four,['boss-mira-d2']]};
const themes={neon2:['neon','hop','neon','neon-master'],magma2:['lava','fire','walk','fire'],desert2:['dark','souls','four','dark']};
let world,area=0,key,speaker=null,lines=[],metadata=false;const events={},battle={};
function push(row){(key.startsWith('battle:')?battle[key]:events[key].steps).push(row);}
function flush(){if(speaker&&lines.length){let text=lines.join('\n');if(key==='battle:earth50')text=text.replace('モブミラカラミ','モブミラアース');push([speaker==='narrate'?'narrate':speaker==='???'?'sayOff':'say',speaker==='narrate'?text:speaker,...(speaker==='narrate'?[]:[text])]);}speaker=null;lines=[];}
function begin(phase){flush();metadata=false;key=phase==='arrival'?`arrival:${world}`:`${phase}:${world}:${area}`;if(events[key])return;events[key]={worldId:world,area,steps:[]};if(phase==='pre')push(['entranceV231',guests[world][area],themes[world][area]]);if(phase==='post'&&area>=2){const ids=world==='magma2'&&area===3?['dragon']:guests[world][area];push(ids.length>1?['guests',ids]:['guest',ids[0]]);}}
function combat(id,who=null){flush();key='battle:'+id;battle[key]??=[];speaker=who;}
const actions={
 'モブネオタイガーがネオンラインエフェクトで高速登場':[],
 'モブマニーの身体が光って震える':[['motionV231','money','ill']],
 'モブデンデンが少し震えながら':[['motionV231','denden','shake']],
 'モブデンデン、モブピンクが跳ねながら':[['motionV231',['denden','pink'],'hop']],
 'モブマニーがよろける':[['motionV231','money','stagger']],
 'モブネオマスターがネオン柄に光って巨大球体がゆっくりゆらゆらモブマニーに入っていく':[['transferV231','boss-neomaster','money','neon']],
 '画面が一瞬少し明るくなってモブネオンマスターが消える':[['softLight'],['hideGuest']],
 'モブマニーが光る':[['motionV231','money','glow']],
 'モブジェシー以外をフェードアウトさせて':[['fadePartyExcept','jessie']],
 'モブデンデンが跳ねながら':[['motionV231','denden','hop']],
 'モブデンデンとモブピンクが跳ねながら':[['motionV231',['denden','pink'],'hop']],
 'モブドラゴンがモブドラゴンⅡに変身する演出':[['transformV231','boss-dragon2','fire']],
 '左右から火炎エネルギー→モブドラゴンが吸収する演出':[['flameAbsorbV231']],
 'モブギドラに変身':[],
 'モブリーロ登場演出':[['entranceV231',['riro'],'sakura']],
 'モブリーロが仲間に加わった！':[['join','riro','モブリーロが仲間に加わった！']],
 'モブニョロが震えて':[['motionV231','nyoro','shake']],
 'モブデンデンが震えて':[['motionV231','denden','shake']],
 '炎と大地の演出で戦闘スタート':[['sceneFxV231','earth-fire']],
 'ミラモブファラオが黒く光って燃える演出':[['sceneFxV231','dark'],['motionV231','boss-dorafara','glow']],
 'ミラモブ大爆発でミラモブファラオに変身':[['transformV231','boss-dorafara','dark']],
 'ミラモブがミラモブ四人衆を1体ずつ召喚し、':[['absorbFourV231']],
 'モブピンクが超跳ねながら':[['motionV231','pink','big-hop']],
 '黒いミラモブ型のオーラがミラモブからモブデザートに入る演出':[['transferV231','boss-mira-d2','desert','dark'],['awakenV231']],
 'モブピンクが跳ねる':[['motionV231','pink','hop']],
 'モブデンデンが跳ねる':[['motionV231','denden','hop']],
 'モブデザート以外フェードアウトし、':[['fadePartyExcept','desert']],
 'モブデザートもフェードアウトし、HOMEへ':[['fadeActor','desert']]
};
const ignored=/^(冒険 ネオン街Ⅱから|到着|中ボス表示|中ボスを表示|ボス表示|戦闘|戦闘中|戦闘中会話イベント発生|----以下戦闘終了後----|全員揃ったら|中央にカッコいいアメコミヴィラン風カットインで|ミラモブ四人衆|と2秒表示|両方倒したら演出|1体ずつ吸収する闇の演出|吸収するたびミラモブが黒と白に光る|全員吸収したら|パッシブⅡ ミラモブソウルを習得|魔法 デザート・ミラモブ・ポイズンを獲得)$/;
for(const raw of fs.readFileSync(path.join(root,'冒険 ネオン街Ⅱから.txt'),'utf8').replace(/\r/g,'').split('\n')){
 const line=raw.trim();if(!line){flush();continue;}
 const w=worlds[line.replace(/^[■・]/,'')];if(w&&!speaker){world=w;area=0;begin('arrival');continue;}
 const mid=line.match(/^中ボス([1-3])$/);if(mid){area=+mid[1]-1;begin('pre');continue;}
 if(/^(ボス戦|ボス|Area4)$/.test(line)){area=3;begin('pre');continue;}
 if(line==='討伐後'){begin('post');continue;}
 if(line.startsWith('ボスHPが70%')){combat('neo70');continue;}if(line.startsWith('ボスHPが40%')){combat('neo40');continue;}
 if(line==='倒したら戦闘中に変身演出'){combat('gidora');continue;}if(line==='戦闘中、倒したら一度復活演出'){combat('mira2');continue;}
 const triggers={'モブミラカラミHP50%以下':['karami50','d2-mirakarami'],'モブミラアースHP50%以下':['earth50','d2-miraearth'],'モブミラカラミ撃破':['karamiDown','d2-mirakarami'],'モブミラアース撃破':['earthDown','d2-miraearth'],'モブミラナイト、モブミラタイムが出現':['pair2'],'全員倒したら':['reviveBefore']};
 if(triggers[line]){combat(...triggers[line]);continue;}if(line.startsWith('その後、4体全員をHP30%')){combat('reviveAfter');continue;}
 if(actions[line]){flush();metadata=false;for(const step of actions[line])push(step);continue;}
 if(/のメダルを手に入れた/.test(line)){speaker=null;lines=[];push(['medalV231',world]);continue;}
 if(/メダルの性能|^メダル ミラモブ|^パッシブⅡ:/.test(line)){flush();metadata=true;continue;}
 if(metadata&&!line.includes('フェードアウト'))continue;
 if(line.startsWith('モブネオンマスターの全ステータス')||line.startsWith('モブネオンマスターのダメージ軽減')){flush();continue;}
 if(/フェードアウト/.test(line)){flush();push(['hideGuests']);push(['hideGuest']);continue;}
 if(line.startsWith('画面は暗め')){flush();push(['darkPulse']);continue;}
 if(/^(中ボス表示|中ボスを表示|ボス表示)$/.test(line))continue;
 if((!speaker&&ignored.test(line))||line.startsWith('※')||/ enemy\/\d+\.png$/.test(line)||/^(モブ|ミラモブ).+(表示|召喚表示)$/.test(line)||/^モブミラアース、モブミラカラミと先に/.test(line)||/^(ネオン|ひょこひょこ|溶岩風|燃え盛り|ゆっくり歩いて|桜吹雪|魂が舞う|大地の召喚|炎の召喚|斬撃の召喚|タイムマジック召喚)/.test(line)){flush();continue;}
 if(!speaker){if(names[line]){speaker=names[line];continue;}if(line==='？？？'){speaker='???';continue;}if(line.startsWith('ナレーション')){speaker='narrate';continue;}throw Error('Unmapped '+key+': '+line);}
 lines.push(line);
}
flush();
// The awakening card already contains this narration and both unlock names.
events['post:desert2:3'].steps=events['post:desert2:3'].steps.filter(s=>!(s[0]==='narrate'&&s[1]==='モブデザートがパワーアップした！'));
fs.writeFileSync(path.join(root,'js/story-v231.json'),JSON.stringify({events,battle},null,2)+'\n');
console.log('v231 imported',Object.keys(events).length,'scenes,',Object.keys(battle).length,'battle sequences');
