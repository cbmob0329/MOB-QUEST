// One-time migration. Never overwrites later dialogue edits.
const fs=require('node:fs'),d=require('../js/rush-v252.json'),catalog=require('../artifacts/rush-v253/catalog.json');
if(d.quests.length!==4)throw Error('Migration requires the original four quests');
const L=(speaker,text)=>({speaker,text});
const dialogue=[
 [[L('pink','次々に来るであります！'),L('denden','休まず三連戦でやんす！'),L('pink','HPとMPを残して\n進むであります！')],[L('denden','最後まで戦い抜いた\nでやんす！'),L('pink','連戦を乗り越えた\n証であります！')]],
 [[L('money','見張りの向こうにも\nまだいるわね'),L('pink','一戦ずつ相手にする\nであります！'),L('money','回復するタイミングも\n考えてね')],[L('pink','見張り稽古は完了\nであります！'),L('money','ふう 次もこの調子で\n乗り切りましょう')]],
 [[L('denden','熱いのと冷たいの\n両方でやんすか！？'),L('money','魔法を使い切らないで\nまだ先があるわ')],[L('pink','次も今のHPとMPで\n進むであります！')]],
 [[L('money','最後は炎と氷の相手ね\n油断しないで！')],[L('denden','オイラたちの連携も\n負けてないでやんす！')]],
 [[L('nyoro','もう一度 力を\n見てもらうニョロ！'),L('money','まずはここを抜けるわよ\n温存も忘れないで')],[L('pink','ここからが本番\nであります！')]],
 [[L('nyoro','フェニックス様\nまた来たニョロ！'),L('v179-phoenix','よかろう\n今日は力を抑えよう\n連戦の成果を見せよ')],[L('v179-phoenix','よく戦い抜いた\nその経験を\n次の戦いに生かせ'),L('pink','ありがとうであります！')]]
];
let n=0;for(const q of d.quests)for(const a of q.areas)[a.pre,a.post]=dialogue[n++];
const trait=(kind,value,label,extra={})=>({kind,value,label,...extra});
d.medals[0].traits.push(trait('physicalCut',.02,'草原の構え：物理ダメージ2%軽減'));
d.medals[1].traits.push(trait('crit',.02,'隊長の眼：会心率+2%'));
d.medals[3].traits.push(trait('guardHpHeal',.02,'溶岩の構え：防御時HP2%回復'));
const specs=[
 ['sand','砂風と毒の試練','desert',17,'d-poison',{atk:20,maxHp:100},[{kind:'poisonOnHit',chance:.03,label:'毒の爪：通常攻撃後3%で毒付与判定'}],[[['d-mummy',13],['d-yamikamen',13]],[['d-sharty',15]],[['d-poison',17]]],false,'砂の向こうにも敵が\n待っているでやんす！','毒を受けたら早めに\n治して進みましょう','毒の爪も乗り越えた\nであります！'],
 ['neon','ネオン追跡訓練','neon',32,'n-chaser',{spd:30,maxMp:100},[trait('evade',.03,'追跡の足取り：回避率+3%')],[[['n-energy',27],['n-glass',27]],[['n-golem',29]],[['n-chaser',32]]],false,'光の向こうへ\n逃がさないニョロ！','広い攻撃に気をつけて\n一体ずつ追いましょう','最後まで追いついた\nであります！'],
 ['sea','深海の守り手','sea',50,'s-wave',{res:40,maxMp:100},[trait('resist',.05,'深海の衣：水耐性+5%',{element:'水'}),trait('guardMpHeal',.02,'波の呼吸：防御時MP2%回復')],[[['s-guard',44],['s-doctor',44]],[['s-abyssknight',46]],[['s-jones',48]],[['s-wave',50]]],true,'深い海でも連戦\nでやんすか！？','眠らされたら危険ね\n回復役を守りましょう','波を越えたニョロ！'],
 ['lantern','草原の灯火','grassland2',57,'g2-merakero',{mag:40,maxHp:100},[trait('magicMpCut',.05,'蛙の灯火：火魔法の消費MP5%軽減',{element:'火'})],[[['g2-jouro',51],['g2-piyo-red',51]],[['g2-tsuru',54]],[['g2-merakero',57]]],false,'草原にも熱い相手が\nいるであります！','炎を甘く見ないで\n水の技も用意してね','火の粉を抜けた\nでやんす！'],
 ['endurance','部族の持久稽古','tribe',63,'t-tough',{def:40,maxHp:150},[trait('guardHpHeal',.03,'不屈の呼吸：防御時HP3%回復')],[[['t-warrior',58],['t-jukon',58]],[['t-kukuri',60]],[['t-tough',63]]],false,'硬そうな相手が\n待っているニョロ！','守って立て直すのも\n大切な戦い方よ','最後まで粘り勝ち\nであります！'],
 ['dino','町外れの恐竜競走','rural2',67,'r2-rapty',{atk:40,spd:20},[trait('crit',.03,'恐竜の勘：会心率+3%')],[[['r2-banken',61],['r2-denchi',61]],[['r2-tira',65]],[['r2-rapty',67]]],false,'大きな足音が来る\nでやんす！','力比べだけじゃ危険よ\n相手の属性を見てね','追いかけっこなら\n負けないニョロ！'],
 ['afterimage','ネオン残像勝負','neon2',70,'n2-tiger',{spd:40,atk:20},[trait('evade',.04,'虎の残像：回避率+4%')],[[['n2-naga',64],['n2-darknaga',64]],[['n2-tama',67]],[['n2-tiger',70]]],false,'今の残像ニョロ！？','相手も避けるわよ\n焦らず攻めましょう','目で追えたであります！'],
 ['reflection','溶岩の反射稽古','magma2',74,'m2-yogan',{res:40,maxHp:100},[trait('physicalCut',.03,'溶岩の膜：物理ダメージ3%軽減'),trait('resist',.05,'溶岩の膜：火耐性+5%',{element:'火'})],[[['m2-honoslime',68],['m2-magrock',68]],[['m2-buster',70]],[['m2-salamander',72]],[['m2-yogan',74]]],true,'溶岩まで動いてる\nでやんす！','反射する相手もいるわ\n残りHPを見て攻めてね','跳ね返されても\n踏ん張ったであります！'],
 ['souls','砂宮の魂巡り','desert2',80,'d2-mirabuster',{mag:40,maxMp:100},[trait('magicMpCut',.05,'魂の循環：闇魔法の消費MP5%軽減',{element:'闇'}),trait('resist',.05,'魂の衣：闇耐性+5%',{element:'闇'})],[[['d2-yamikamen',72],['d2-gimmick',72]],[['d2-slamummy',75]],[['d2-miraearth',77]],[['d2-mirabuster',80]]],true,'砂の奥から\n気配がするニョロ！','連続攻撃に備えてね\n最後まで油断は禁物よ','魂の試練を突破\nであります！'],
 ['guard','魔城の近衛演習','demonCastle',90,'c-killwitch',{mag:40,res:40},[trait('guardMpHeal',.03,'魔女の息継ぎ：防御時MP3%回復'),trait('resist',.05,'近衛の衣：闇耐性+5%',{element:'闇'})],[[['c-picodark',80],['c-devilslime',80]],[['c-miraheld',83]],[['c-succubus',86]],[['c-killwitch',90]]],true,'近衛の相手でも\nひるまないであります！','毒と魔法に備えるわよ\n回復の余力も残してね','力を合わせた成果\nでやんす！']
];
for(const [key,title,world,lv,reward,stats,traits,waves,two,intro,hint,end] of specs){
 for(const wave of waves)for(const [id] of wave)if(!d.enemies[id]){const e=structuredClone(catalog.enemies.find(e=>e.id===id));if(!e)throw Error(id);const count=e.category==='normal'?1:2;Object.assign(e,{noEscape:true,forceActionCount:true,actionCount:count,v144ActionMin:count,v144ActionMax:count});d.enemies[id]=e;}
 const enemy=d.enemies[reward],mid='rush-'+key+'-medal-v252';d.medals.push({id:mid,name:enemy.name+'・連戦の証',image:enemy.image,rarity:lv<40?'SR':'SSR',attribute:enemy.attribute,type:'メダル',types:['メダル'],stats,traits});
 const rows=waves.map(w=>w.map(([enemy,level])=>({enemy,level}))),groups=two?[rows.slice(0,2),rows.slice(2)]:[rows];
 d.quests.push({id:'rush-'+key+'-v252',title,world,recommendedLevel:lv,unlock:{world,label:catalog.worlds.find(w=>w.id===world).name+'クリア'},reward:mid,areas:groups.map((waves,i)=>({waves,pre:i?[L('money','ここからが後半ね\n温存した力を見せて')]:[L(key==='sand'||key==='sea'||key==='reflection'||key==='dino'?'denden':key==='neon'||key==='endurance'||key==='afterimage'||key==='souls'?'nyoro':'pink',intro),L('money',hint)],post:i===groups.length-1?[L(key==='sea'||key==='dino'?'nyoro':key==='lantern'||key==='guard'?'denden':'pink',end)]:[L('pink','次も今のHPとMPで\n進むであります！')]}))});
}
// Keep early dialogue within the actual recruitment timeline.
const quest=key=>d.quests.find(q=>q.id==='rush-'+key+'-v252');
quest('grass').areas[0].pre[1]=L('pink','休まず三連戦であります！');quest('grass').areas[0].post[0]=L('pink','最後まで戦い抜いた\nであります！');
quest('rural').areas[0].pre=[L('denden','見張りの向こうにも\nまだいるでやんす'),L('pink','一戦ずつ相手にする\nであります！'),L('denden','回復するタイミングも\n大事でやんす！')];quest('rural').areas[0].post[1]=L('denden','ふう 次もこの調子で\n乗り切るでやんす！');
quest('sand').areas[0].pre=[L('desert','砂の向こうにも\n敵が待っているぞ'),L('pink','毒を受けたら早めに\n治すであります！')];quest('neon').areas[0].pre[0]=L('denden','光の向こうへ\n逃がさないでやんす！');
for(const m of d.medals)m.traitLabel=m.traits.map(t=>t.label).join(' / ');
fs.writeFileSync('js/rush-v252.json',JSON.stringify(d,null,2)+'\n');
console.log('Migrated 4 to 14 rush quests; stable IDs retained');
