const fs=require('node:fs'),old=require('../js/rush-v252.json'),cat=require('../artifacts/rush-v253/catalog.json');
if(fs.existsSync('js/rush-v254.json'))throw Error('Existing editable data will not be overwritten');
const d=structuredClone(old);d.schemaVersion=2;d.maxSimultaneous=3;d.minSimultaneous=2;d.difficulties=[{id:'normal',name:'ノーマル',levelOffset:0,hp:1,attack:1,medalScale:1},{id:'hard',name:'ハード',levelOffset:8,hp:1.12,attack:1.08,medalScale:1.25},{id:'inferno',name:'インフェルノ',levelOffset:16,hp:1.25,attack:1.16,medalScale:1.5}];d.narrator={name:'モブホロ博士',image:null,width:150,height:180};
const additions=[
 ['rockaxe','岩斧の挟撃','grassland',12,'g-axe',['g-rock','g-beaver','g-axe','g-iwakiri']],
 ['sandwall','砂岩の二重壁','desert',19,'d-sharty',['d-akarock','g-rock','d-sharty','d-deathhead']],
 ['waterside','水辺の包囲','rural',25,'r-scouter',['r-hitode','g-jouro','r-scouter','r-dean']],
 ['circuit','光と闇の回路','neon',34,'n-golem',['n-naga','n-darknaga','n-golem','n-trainer']],
 ['crater','火口の三重奏','magma',45,'m-flame',['m-golem','n-energy','m-flame','m-blizzard']],
 ['tides','潮騒の追撃','sea',54,'s-jones',['s-ninja','r-hitode','s-jones','s-uminight']],
 ['returnfield','草原再訪の群れ','grassland2',59,'g2-tsuru',['g2-bird','g2-piyo-red','g2-tsuru','g2-tsunoleon']],
 ['fangs','部族の双牙','tribe',65,'t-kukuri',['t-warrior','g2-axe','t-kukuri','t-hisui']],
 ['snipers','恐竜と狙撃','rural2',69,'r2-tira',['r2-denchi','g2-tsuru','r2-tira','r2-rapty']],
 ['beasts','雷光の獣列','neon2',73,'n2-palette',['n2-energy','r2-banken','n2-palette','n2-tiger']],
 ['crossfire','炎氷の交差','magma2',76,'m2-salamander',['m2-bomber','s-mist','m2-salamander','m2-blizzard']],
 ['fourknights','砂宮の四騎','desert2',82,'d2-miranight',['d2-miraearth','d2-mirakarami','d2-miranight','d2-miratime']],
 ['castlearmy','魔城の混成隊','demonCastle',91,'c-succubus',['c-metasword','d2-nekomummy','c-succubus','c-killwitch']],
 ['hawkdrill','草原王の演習','grassland',15,'g-iwakiri',['g-piyo-green','g-slime','g-iwakiri','boss-hawk']],
 ['seaking','深海王の演習','sea',58,'s-sorcerer',['s-hamon','s-doctor','s-sorcerer','boss-nepu']],
 ['veterans','魔城の歴戦演習','demonCastle',94,'c-lilith-hell',['c-assassin','c-deathspear','c-lilith-hell','boss-gladi']]
];
for(const [key,title,world,lv,reward,ids] of additions){const m=cat.enemies.find(e=>e.id===reward);if(!m)throw Error(reward);const id='rush-'+key+'-v252',mid='rush-'+key+'-medal-v252';
 const physical=['rockaxe','sandwall','waterside','tides','returnfield','fangs','snipers','beasts','hawkdrill','veterans'].includes(key),defensive=['rockaxe','sandwall','hawkdrill','veterans'].includes(key),kind=defensive?'guardHpHeal':physical?'crit':'magicMpCut',value=defensive?.02:physical?.025:.05,element=m.attribute.split('・')[0];
 const label=defensive?'防御時HP2%回復':physical?'会心率+2.5%':element+'魔法の消費MP5%軽減';
 d.medals.push({id:mid,name:m.name+'・'+title+'の証',image:m.image,rarity:lv<40?'SR':'SSR',attribute:element,type:'メダル',types:['メダル'],stats:defensive?{def:40,maxHp:150}:physical?{atk:40,spd:20}:{mag:40,maxMp:120},traits:[{kind,value,label,...(kind==='magicMpCut'?{element}: {})},{kind:'resist',element,value:.04,label:element+'耐性+4%'}],design:defensive?'防御で立て直す耐久型':physical?'速さと会心を支える攻撃型':'属性魔法の継戦を支える魔法型'});
 const rows=[[{enemy:ids[0],level:lv-5},{enemy:ids[1],level:lv-5}],[{enemy:ids[2],level:lv-2},{enemy:ids[0],level:lv-4}],[{enemy:ids[3],level:lv},{enemy:ids[1],level:lv-3}]];
 if(!ids[3].startsWith('boss-')&&lv>=25)rows[0].push({enemy:ids[1],level:lv-6});
 d.quests.push({id,title,world,recommendedLevel:lv,unlock:{world,label:cat.worlds.find(w=>w.id===world).name+'クリア'},reward:mid,areas:lv>=50?[{waves:rows.slice(0,2)},{waves:rows.slice(2)}]:[{waves:rows}]});
}
const support={grassland:'g-slime',desert:'d-mummy',rural:'r-knife',neon:'n-energy',magma:'m-lizard',sea:'s-guard',grassland2:'g2-rock',tribe:'t-warrior',rural2:'r2-denchi',neon2:'n2-naga',magma2:'m2-magrock',desert2:'d2-mummy',demonCastle:'c-picodark'};
const source=new Map(cat.enemies.map(e=>[e.id,e]));for(const e of Object.values(old.enemies))if(!source.has(e.id))source.set(e.id,e);
d.enemies={};
for(const q of d.quests)for(const [i,a] of q.areas.entries()){
 for(const wave of a.waves){if(wave.length===1)wave.push({enemy:support[q.world],level:Math.max(1,wave[0].level-4)});for(const row of wave){if(d.enemies[row.enemy])continue;const original=source.get(row.enemy);if(!original)throw Error('Unknown '+row.enemy);const e=structuredClone(original),native=e.v144ActionMax||e.actionCount,actions=native|| (e.category==='normal'?1:2);e.actionCount=native?e.actionCount||e.v144ActionMin||native:actions;e.v144ActionMin=e.v144ActionMin||e.actionCount;e.v144ActionMax=e.v144ActionMax||e.actionCount;e.forceActionCount=true;e.noEscape=true;e.nativeActionCount=!!native;
  e.mods={...e.mods,hp:(e.mods?.hp||1)*(e.story179Kind==='phoenix'?1:.70),atk:(e.mods?.atk||1)*.85,mag:(e.mods?.mag||1)*.85};
  if(e.story179Kind==='phoenix')e.mods={...e.mods,hp:.30,atk:.6375,mag:.6375};
  const element=(e.attribute||'無').split('・')[0];e.rushPassive={kind:'elementWard',element,value:.06,label:element+'の解析障壁：'+element+'耐性+6%'};
  d.enemies[row.enemy]=e;
 }}
 a.pre=[{speaker:'holo',text:i?'後半の計測を開始っちゃ\n残りの力を使うっちゃ':'編成データを受信っちゃ\n連戦テストを開始っちゃ'}];
 a.post=[{speaker:'holo',text:i===q.areas.length-1?'全WAVEの解析完了っちゃ\n成果を記録したっちゃ':'前半の解析完了っちゃ\nHPとMPを維持するっちゃ'}];
}
for(const m of d.medals){m.traitLabel=m.traits.map(t=>t.label).join(' / ');m.design??='中ボスの特性を小さな補助効果として装備する';m.tiers=d.difficulties.map((diff,i)=>{const traits=m.traits.map(t=>{const v=Number(((t.chance??t.value)*(1+i*.2)).toFixed(4));return {...t,[t.chance===undefined?'value':'chance']:v,label:t.label.replace(/\d+(?:\.\d+)?%/g,Number((v*100).toFixed(2))+'%')};});return {stats:Object.fromEntries(Object.entries(m.stats).map(([k,v])=>[k,Math.round(v*diff.medalScale/10)*10])),traits,traitLabel:traits.map(t=>t.label).join(' / ')};});}
d.narrator.defeat=[{"speaker":"holo","text":"敗北データを解析っちゃ\n編成を見直すっちゃ"}];
d.narrator.messages={"alreadyClaimed":"受領済みのため追加報酬なし","upgraded":"所持メダルを強化したっちゃ","received":"メダルを1枚受領したっちゃ","continueArea":"HP・MPを引き継いで進むっちゃ","noReward":"報酬は未受領っちゃ"};
for(const q of d.quests){const waves=q.areas.reduce((n,a)=>n+a.waves.length,0);q.clearCoins=d.difficulties.map((t,i)=>Math.round((1500+(q.recommendedLevel+t.levelOffset)*450)*(waves/3)*[1,1.5,2.2][i]/500)*500);}
fs.writeFileSync('js/rush-v254.json',JSON.stringify(d,null,2)+'\n');console.log('Created 30 stages / 3 difficulties');
