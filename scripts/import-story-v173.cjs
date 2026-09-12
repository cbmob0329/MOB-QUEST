// Convert this revision's dialogue and explicit stage directions to reviewable data.
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
if(!process.argv[2])throw Error('Pass the UTF-8 story memo path');
const names={'モブデンデン':'denden','モブジェシー':'jessie','モブマニー':'money','モブテツ':'tetsu','モブピンク':'pink','モブニョロ':'nyoro','モブデザート':'desert','モブネコクー':'nekoku','モブリーロ':'riro','モブバイオリン':'r2-violin','モブラプチー':'r2-rapty','モブティラ':'r2-tira','モブクウカイ':'r2-kuukai','モブウミデンデン':'boss-umidenden','モブネオタイガー':'n2-tiger','モブパレットレオン':'n2-palette','モブネオマスター':'boss-neomaster','モブマグバスター':'m2-buster','モブドラゴン':'dragon','モブドラゴンⅡ':'boss-dragon2','ミラモブ':'boss-mira-d2','モブミラバスター':'d2-mirabuster','モブミラアース':'d2-miraearth','モブミラカラミ':'d2-mirakarami','モブミラナイト':'d2-miranight','モブミラタイム':'d2-miratime','ミラモブファラオ':'boss-dorafara'};
const worlds={'田舎町Ⅱ':'rural2','ネオン街Ⅱ':'neon2','マグマⅡ':'magma2','砂漠Ⅱ':'desert2'};
const guests={rural2:[['r2-violin'],['r2-rapty','r2-tira'],['r2-kuukai'],['boss-umidenden']],neon2:[['n2-tiger'],['n2-tama','n2-kodora'],['n2-palette'],['boss-neomaster']],magma2:[['m2-yogan'],['m2-salamander'],['m2-buster'],['dragon']],desert2:[['boss-mira-d2'],['d2-mirabuster'],['d2-miraearth','d2-mirakarami','d2-miranight','d2-miratime'],['boss-dorafara']]};
let world,area=0,key,speaker=null,lines=[];const events={},battle={};
function push(row){(key.startsWith('battle:')?battle[key]:events[key].steps).push(row);}
function flush(){if(speaker&&lines.length){let text=lines.join('\n');if(key==='battle:earth50'&&speaker==='narrate')text=text.replace('モブミラカラミ','モブミラアース');
 if(speaker==='dual')push(['sayDual','r2-rapty',text,'r2-tira',text]);
 else if(speaker==='narrate')push(['narrate',text]);
 else if(speaker==='???')push(['sayOff','???',text]);
 else push([text.includes('(赤色強めの文字)')?'sayRed':'say',speaker,text.replace('(赤色強めの文字)','')]);
}speaker=null;lines=[];}
function begin(phase){flush();key=phase==='arrival'?`arrival:${world}`:`${phase}:${world}:${area}`;if(events[key])return;events[key]={worldId:world,area,steps:[]};
 if(phase==='pre'){const ids=guests[world][area];push(world==='desert2'&&area===2?['summonFourV173',ids]:ids.length>1?['guests',ids]:['guest',ids[0]]);}
 if(phase==='post'&&((world==='neon2'&&area>=2)||(world==='magma2'&&area>=2)||world==='desert2')){const ids=guests[world][area];push(world==='desert2'&&area===3?['guest','boss-mira-d2']:ids.length>1?['guests',ids]:['guest',ids[0]]);}
}
function combat(id,who=null){flush();key='battle:'+id;battle[key]??=[];speaker=who;}
for(const raw of fs.readFileSync(process.argv[2],'utf8').replace(/\r/g,'').split('\n')){
 const line=raw.trim();if(!line){flush();continue;}
 const w=worlds[line.replace(/^[■・]/,'')];if(!speaker&&w){world=w;area=0;begin('arrival');continue;}
 const mid=line.match(/^中ボス([1-3])$/);if(mid){area=Number(mid[1])-1;begin('pre');continue;}
 if(/^(ボス戦|ボス|Area4)$/.test(line)){area=3;begin('pre');continue;}
 if(line==='討伐後'){begin('post');continue;}
 if(line.startsWith('ボスHPが70%')){combat('neo70');continue;}
 if(line.startsWith('ボスHPが40%')){combat('neo40');continue;}
 if(line==='倒したら戦闘中に変身演出'){combat('gidora');continue;}
 if(line==='戦闘中、倒したら一度復活演出'){combat('mira2');continue;}
 if(line==='モブミラカラミHP50%以下'){combat('karami50','d2-mirakarami');continue;}
 if(line==='モブミラアースHP50%以下'){combat('earth50','d2-miraearth');continue;}
 if(line==='モブミラカラミ撃破'){combat('karamiDown','d2-mirakarami');continue;}
 if(line==='モブミラアース撃破'){combat('earthDown','d2-miraearth');continue;}
 if(line==='モブミラナイト、モブミラタイムが出現'){combat('pair2');continue;}
 if(line==='全員倒したら'){combat('reviveBefore');continue;}
 if(line.startsWith('その後、4体全員をHP30%')){combat('reviveAfter');continue;}
 if(line==='※ぴょんぴょん跳ねる演出'){flush();push(['bounceV173','denden']);continue;}
 if(line==='モブネオマスターが光って球体がゆっくりゆらゆらモブマニーに入っていく'){flush();push(['energyTransfer','boss-neomaster','money']);continue;}
 if(line==='画面が一瞬少し明るくなってモブネオマスターが消える'){flush();push(['softLight']);push(['hideGuest']);continue;}
 if(line==='モブジェシー以外をフェードアウトさせて'){flush();push(['fadePartyExcept','jessie']);continue;}
 if(line==='モブデザート以外フェードアウトし、'){flush();push(['fadePartyExcept','desert']);continue;}
 if(line==='モブデザートもフェードアウト'){flush();push(['fadeActor','desert']);continue;}
 if(line==='モブドラゴンがモブドラゴンⅡに変身する演出'){flush();push(['guestTransform','boss-dragon2']);continue;}
 if(line==='モブギドラに変身'){flush();push(['narrate','モブギドラに変身！']);continue;}
 if(line==='モブリーロ登場演出'){flush();push(['guestSlow','riro']);continue;}
 if(line==='モブリーロが仲間に加わった！'){flush();push(['join','riro',line]);continue;}
 if(line==='4体が光る演出'){flush();push(['glowFourV173',guests.desert2[2]]);continue;}
 if(line==='ミラモブファラオが黒く光る演出'){flush();push(['darkGlowGuest']);continue;}
 if(line==='黒いオーラ魂がミラモブからモブデザートにゆらゆら入る演出'){flush();push(['darkEnergyTransfer','boss-mira-d2','desert']);continue;}
 if(/フェードアウト/.test(line)){flush();push(['hideGuests']);push(['hideGuest']);continue;}
 if(line==='モブネオマスターの全ステータス+10%'){flush();push(['buffAll','boss-neomaster',.10]);continue;}
 if(line==='モブネオマスターの軽減+10%'){flush();push(['damageReduction','boss-neomaster',.10]);continue;}
 if(line.startsWith('画面は暗め')){flush();push(['darkPulse']);continue;}
 if(/^(到着後?|中ボス(を表示|表示)|ボス(を表示|表示)|戦闘中会話イベント発生|戦闘中|戦闘へ|----以下戦闘終了後----|順番に召喚演出表示|両方倒したら演出)$/.test(line)||line.startsWith('※')||/ enemy\/\d+\.png$/.test(line)||/^モブミラアース、モブミラカラミと先に/.test(line)||/^(モブ|ミラモブ).+(を表示|表示)$/.test(line)){flush();continue;}
 // Names inside a speech (e.g. the master addressing Money) remain dialogue.
 if(!speaker){if(names[line]){speaker=names[line];continue;}if(line.startsWith('モブラプチー＆モブティラ')){speaker='dual';continue;}if(line==='？？？'){speaker='???';continue;}if(/^ナレーション/.test(line)){speaker='narrate';continue;}throw Error('Unmapped direction: '+line);}
 lines.push(line);
}
flush();
fs.writeFileSync(path.join(root,'js/story-v173.json'),JSON.stringify({events,battle},null,2)+'\n');
console.log(`${Object.keys(events).length} scenes, ${Object.keys(battle).length} battle sequences imported`);
