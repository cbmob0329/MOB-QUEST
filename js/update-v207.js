// UPDATE_V207_BEGIN
/* v207: Reading Book authored-script refresh + AUTO ally-target support safety + stale Book-report guard.
   Source of truth for dialogue/presentation: user-provided 「読みかけの本(2).txt」. */

/* ---------- AUTO: support magic must never open a manual target request ---------- */
function autoSupportTargetV207(skill){
  if(!skill?.support||skill.target!=='ally')return null;
  const living=livingField().filter(x=>x&&!x.dead&&x.hp>0);
  if(!living.length)return null;
  if(skill.supportKind==='healSingle'){
    return living.filter(x=>x.hp<x.maxHp).sort((a,b)=>(a.hp/a.maxHp)-(b.hp/b.maxHp))[0]||null;
  }
  if(skill.supportKind==='atkBuff')return living.slice().sort((a,b)=>(Number(b.atk)||0)-(Number(a.atk)||0))[0]||living[0];
  if(skill.supportKind==='defBuff')return living.slice().sort((a,b)=>(Number(a.def)||0)-(Number(b.def)||0))[0]||living[0];
  return living[0];
}
function autoMagicPayloadV207(a,skill){
  if(!skill)return null;
  if(!skill.support||skill.target!=='ally')return skill;
  const target=autoSupportTargetV207(skill);
  if(!target)return null;
  return {...skill,targetId:target.id,targetName:target.name};
}
autoAct=async function(){
  const b=state.battle,a=activeAlly();
  if(!b||!a||!b.auto||b.busy||b.finished)return;
  const usable=readyUlts(a).filter(x=>x&&(!x.target||x.target!=='ally'));
  if(usable.length&&Math.random()<.32)return act('ultimate',pick(usable));
  const rawMagic=defaultMagicFor(a),magic=autoMagicPayloadV207(a,rawMagic),mCost=autoMagicCostV137(a,rawMagic);
  if(rawMagic&&magic&&a.mpNow>=mCost&&Math.random()<.30)return act('magic',magic);
  return act('attack');
};

/* ---------- Reading Book presentation helpers ---------- */
async function facilityTalkAnimatedV207(text,speaker,image,kind=''){
  const p=facilityTalk(text,speaker,image);
  await fixedDelay(110);
  const img=$('#dialogCharacter'),ov=$('#dialogOverlay');
  if(kind==='jump'&&img){img.classList.remove('book-pink-jump-v207');void img.offsetWidth;img.classList.add('book-pink-jump-v207');}
  if(kind==='big'&&ov)ov.classList.add('book-facility-big-v207');
  try{return await p;}finally{img?.classList.remove('book-pink-jump-v207');ov?.classList.remove('book-facility-big-v207');}
}
async function storyBookNarrateV207(text){
  const box=$('#storyNarration');box?.classList.add('book-page-narration-v207');
  try{return await storyNarrate(text);}finally{box?.classList.remove('book-page-narration-v207');}
}
async function storySayJaggedV207(key,text){
  const bubble=$('#storyBubble');bubble?.classList.add('story-bubble-jagged-v207','story-bubble-emphasis-v94');
  try{return await storySay(key,text);}finally{bubble?.classList.remove('story-bubble-jagged-v207','story-bubble-emphasis-v94');}
}
function addBookFxV207(kind){
  const scene=$('#storyScene');if(!scene)return null;
  const fx=document.createElement('div');fx.className=`book-scene-fx-v207 ${kind}`;
  if(kind==='book-pages-v207')fx.innerHTML='<i class="page-v207 blue"></i><i class="page-v207 red"></i><i class="smoke-v207"></i>';
  if(kind==='book-skull-v207')fx.innerHTML='<i class="summon-page-v207 left"></i><i class="summon-page-v207 right"></i>';
  scene.appendChild(fx);return fx;
}
async function bookArea2SummonFxV207(){const fx=addBookFxV207('book-pages-v207');try{await fixedDelay(2150);}finally{fx?.remove();}}
async function bookArea3SummonFxV207(){const fx=addBookFxV207('book-skull-v207');try{await fixedDelay(3000);}finally{fx?.remove();}}
async function jumpBookMinionsV207(){
  const group=$('#storyGuestGroup');if(!group)return;
  const els=$$('[data-story-actor="book-minion"]',group);
  await Promise.all(els.map(el=>animateV157(el,[{translate:'0 0'},{translate:'0 -30px'},{translate:'0 0'},{translate:'0 -18px'},{translate:'0 0'}],760)));
  for(const el of els)el.style.removeProperty('translate');
}
async function bookNaviHitKaijinV207(){
  const navi=storyAnchor('book-navi'),boss=storyAnchor('book-kaijin-boss');
  if(navi)await animateV157(navi,[{translate:'0 0',scale:'1'},{translate:'-18px -5px',scale:'1.06',offset:.35},{translate:'34px 0',scale:'1.08',offset:.62},{translate:'0 0',scale:'1'}],720);
  if(boss)await animateV157(boss,[{translate:'0 0',rotate:'0deg'},{translate:'-16px -6px',rotate:'-4deg',offset:.35},{translate:'-90px 20px',rotate:'-15deg',opacity:.35},{translate:'-120px 32px',rotate:'-20deg',opacity:0}],900);
  await storyImpact('ドン!!');
}
async function moveBookBossIntoPartyV207(){
  if(!state.party.some(x=>canonicalPlayerId(x[0])==='kaijin'))storyJoin('kaijin');
  saveParty();saveMeta();
  await storyHideGuest().catch(()=>{});
  await renderStoryParty();
  if($('[data-story-actor="yusha"]',$('#storyGuestGroup')))hideStoryPartyHeroV94(true);
  await fixedDelay(260);
}
async function showBookNaviHeroDuelV207(){
  restoreStoryPartyHeroV94();await renderStoryParty();hideStoryPartyHeroV94(true);bookHeroStoryModeV94='hero';
  await storyHideGuest().catch(()=>{});await storyHideGuests().catch(()=>{});
  await storyShowGuests(['book-navi','yusha'],{slow:true});
  const g=$('#storyGuestGroup');g?.classList.add('book-navi-hero-duel-v207');
  const hero=$('[data-story-actor="yusha"]',g);hero?.classList.add('book-hero-guest-v94');
}
async function restoreBookHeroToPartyV207(){
  await storyHideGuests().catch(()=>{});restoreStoryPartyHeroV94();bookHeroStoryModeV94='hero';await renderStoryParty();await glowV157('yusha',1);await fixedDelay(220);
}
function matrixOverlayV207(collapse=false){
  const fx=document.createElement('div');fx.className=`book-scene-fx-v207 book-matrix-v207${collapse?' collapse':''}`;document.body.appendChild(fx);return fx;
}
async function naviMatrixTransformV207(){
  const fx=matrixOverlayV207(false);
  try{await Promise.all([naviTransformV161(),fixedDelay(3000)]);}finally{fx.remove();}
}
async function naviMatrixCollapseV207(){
  const fx=matrixOverlayV207(true),navi=storyAnchor('book-navi-master');
  try{await Promise.all([fixedDelay(1350),navi?animateV157(navi,[{opacity:1,filter:'none',scale:'1'},{opacity:.65,filter:'brightness(2) contrast(1.7)',scale:'1.03',offset:.45},{opacity:0,filter:'blur(8px) brightness(4)',scale:'.08 .92'}],1250):Promise.resolve()]);}finally{fx.remove();}
  await storyHideGuest().catch(()=>{});
}
async function kingDashAwayV207(){
  const king=document.querySelector('[data-book-king-v119],[data-book-king-v92]');if(!king)return;
  await animateV157(king,[{translate:'0 0',opacity:1},{translate:'-24px 0',opacity:1,offset:.18},{translate:'18px 0',opacity:1,offset:.32},{translate:'42vw 0',opacity:1,offset:.62},{translate:'85vw 0',opacity:0}],1150);
  king.hidden=true;
}

/* ---------- Reading Book: authored dialogue / presentation ---------- */
async function bookArrivalV207(){
  bookHeroStoryModeV94='normal';await openStoryScene('unfinishedBook',0);
  await storySay('denden','ここが本の中でやんすか？');
  await storySay('jessie','実感ないわね');
  await storySay('desert','魔王を倒す武器か\nそんなものがあるとは思えんな');
  await storySay('nyoro','なんか平和なところニョロね～');
  await storyShowGuest('book-navi',{slow:true});
  await storySay('book-navi','おや？\n君たち異世界の住人だね？');
  await storySay('tetsu','皆警戒を！\n只者ではないでござる！');
  await storySay('desert','敵意どころか気配が無い\n何者だ？');
  await storySay('book-navi','私はこの世界を管理している者だ');
  await storySay('book-navi','と言っても');
  await storySay('book-navi','見守っているだけだがね');
  await storySay('nekoku','オラたち悪いやつじゃないぞ');
  await storySay('book-navi','だろうね');
  await storySay('nyoro','僕たち魔王を倒したいニョロ！');
  await storySay('pink','ここに\n超強い武器があるはずです！');
  await storySay('book-navi','超強い武器か\nあるにはあるな\nいや、いるな');
  await storySay('riro','いる、とは\nどういう意味ですカ？');
  await storySay('book-navi','おっと、時間だ\n気を付けることだ');
  await storySay('book-navi','今この世界は悪の手に落ちている\n怪人軍団に注意しろ');
  await storyHideGuest();
  await storySay('money','凄まじい魔力ね');
  await storySay('jessie','怪人は気になるけど、\n先へ進みましょう！');
  await storySay('riro','ここは異世界\n何が起きても');
  await storySay('riro','不思議ではないでス');
}
async function bookArea1PreV207(){
  await openStoryScene('unfinishedBook',0);await storyShowGuests(['book-minion','book-captain','book-minion'],{slow:true});
  await storySay('book-captain','キーキー！！');await jumpBookMinionsV207();await storySay('book-minion','キーキー！！');
  await storySay('desert','これが怪人か？');await storySay('pink','見た目は可愛いですが');await storySay('denden','強い覇気を感じるでやんす！');await storySay('tetsu','手加減無用でござるな');await storySay('nyoro','サポートし合うニョロ！');
}
async function bookArea1PostV207(){
  await openStoryScene('unfinishedBook',0);await storySay('jessie','これで手下なら\nボスは相当な強さね');await storySay('nekoku','あいつら\n本気じゃなかったぞ');await storySay('nekoku','みんな事情があるのよ');await storySay('pink','変な世界でありますね');await storySay('desert','先へ進むぞ');
}
async function bookArea2PreV207(){
  await openStoryScene('unfinishedBook',1);const fxPromise=bookArea2SummonFxV207();await fixedDelay(540);await storyShowGuests(['book-exec-blue','book-exec-red'],{slow:true});await fxPromise;
  await storySay('book-exec-blue','ここから先へは');await storySay('book-exec-red','通さない');await storySay('desert','敵の幹部の登場だな');await storySay('tetsu','良い構えをしているでござる');await storySay('book-exec-blue','我々の邪魔をするものは');await storySay('book-exec-red','始末しろとの命令だ');await storySay('nekoku','そこ通してもらわないと困るぞ');await storySay('nyoro','突き進むニョロ！');
}
async function bookArea2PostV207(){
  await openStoryScene('unfinishedBook',1);await storySay('pink','強かったであります、、');await storySay('denden','痛いでやんす、、');await storySay('jessie','しっかり休みながら進みましょう');await storySay('money','この本読んでみたくなったわ');await storySay('riro','あのヒーローは\nとっても強いのネ');await storySay('nekoku','あのヒーロー？\nオラ、知らない');await storySay('riro','フフッ\nきっとすぐ会えまス');
}
async function bookArea3PreV207(){
  await openStoryScene('unfinishedBook',2);await bookArea3SummonFxV207();await storyShowGuest('book-kaijin-boss',{slow:true});
  await storySay('book-kaijin-boss','ようこそ偽物のヒーロー達よ！\n残る正義はお前たちのみ！');await storySayJaggedV207('book-kaijin-boss','悪は必ず勝つのだ‼︎');await storySay('denden','敵のボスでやんすね！');await storySay('book-kaijin-boss','そう！\nこの俺がボス！\n一番偉いのだ！\n俺に従え！');await storySay('money','分かりやすい悪役ね');await storySay('jessie','保安官として見過ごせないわ！');await storySay('pink','正義の強さを見せるであります！');await storySay('desert','魔王に近い魔力だ\n気をつけろ！');await storySay('tetsu','拙者、\n力は惜しまないでござる！');await storySay('book-kaijin-boss','あのヒーローはこの世界から消えた！\nこの世界では俺が悪であり正義！\n俺こそが');await storySayJaggedV207('book-kaijin-boss','神だ‼︎');
}
async function bookArea3PostV207(){
  bookHeroStoryModeV94='normal';await openStoryScene('unfinishedBook',2);await storyShowGuest('book-kaijin-boss',{slow:true});
  await storySay('money','なによ、、\nコイツこんなに強いなんて、、');await storySay('nekoku','オラ、もう動けない、、');await storySay('pink','み、みんな、しっかりするであります！');await storySay('denden','強すぎるでやんす・・');await storySay('desert','ここで終わるわけにはいかない・・\n一旦引くぞ！');await storySay('book-kaijin-boss','ははは！\n逃がすとでも思っているのか？');
  await bookBlackSphereAttackV94();setAdventureVitalV89Final('yusha',{dead:true});state.meta.bookHeroDown=true;saveMeta();const hero=$('[data-story-actor="yusha"]',$('#storyPartyLine'));hero?.classList.add('book-hero-down-v94');
  await storySay('pink','勇者様ー！！');await storySay('desert','まずいぞ・・！');await storySay('money','こうなったら私の魔力で！！');
  await storyShowSecondaryGuestsV94(['book-navi'],'book-navi-beside-v94');await storySay('book-navi','まだ早いですね');await storySay('book-kaijin-boss','モブナビ！！\n俺の邪魔をするな！');await storySay('book-navi','そうはいかない');await storySay('book-kaijin-boss','クソー！！！');await warpV159('book-kaijin-boss');
  await storyHideGuest();await storySay('book-navi','さて\n勇者がやられたようだね\nだが私に出来るのはここまでだ\nやつを倒しに行ってくれ');await storyHideGuests();
  await storySay('pink','勇者様・・');await storySay('nyoro','もうだめだニョロ・・');await storySayBigV94('money','なーに言ってるのよ！');await storySay('jessie','そうよ！きっと勇者はまだ助かる！');await storySay('tetsu','立ち上がって先へ進むでござる！');await storySay('desert','そうだな\n必ず勝機はあるはずだ');await storySay('nekoku','あいつ、嫌いだ');
}
async function bookArea4PreV207(){
  bookHeroStoryModeV94='normal';await openStoryScene('unfinishedBook',3);setBookStoryHeroArtV92('down');await storyShowGuest('book-kaijin-boss',{slow:true});
  await storySay('book-kaijin-boss','さあフィナーレだ！\n俺達怪人軍団は\n遂に目的を果たすのだ！！');await storySay('desert','勇者の意志は俺たちと共にある！');await storySay('riro','サクラ一族の名のもと、あなたを倒しまス！');await storySay('denden','やるだけやってやるでやんす！！');
  for(const line of ['思い出が苦しくなる時は','読みかけの本を読もう','無力で惨めなその気持ち','あのヒーローにやっつけてもらおう'])await storyBookNarrateV207(line);
  await glowV157('yusha',2);await storySay('book-kaijin-boss','なんだこの光は！？');await bookHeroTransformV94();
  await storySay('book-kaijin-boss','あ、あのヒーロー、、\nなぜお前が！？');await storySay('pink','勇者様の・・特別な力');await storySay('desert','これが勇者');await storySay('jessie','魔王を倒すのは\nやっぱり勇者');await storySay('money','凄い！凄いよ勇者！');await storySay('nekoku','カッコいいぞ');await storySay('nyoro','勇者様ー！！');await storySay('riro','伝説再び・・ですネ');await storySay('tetsu','圧倒的な覇気\n至高のサムライでござる！');await storySay('denden','オイラ信じていたでやんす！');await storySay('book-kaijin-boss','そ、それがどうした！\n俺は強くなった！');await storySay('book-kaijin-boss','お前なんて・・！！');await glowV157('book-kaijin-boss',1);await storySay('pink','勇者様、\nお供するであります！');
}
async function bookArea4PostV207(){
  bookHeroStoryModeV94='hero';await openStoryScene('unfinishedBook',3);setBookStoryHeroArtV92('hero');await storyShowGuest('book-kaijin-boss',{slow:true});
  await storySay('book-kaijin-boss','また、始まるのか・・\nまた、終わるのか・・');await storySay('book-kaijin-boss','俺は、、');
  await storyShowSecondaryGuestsV94(['book-navi'],'book-navi-beside-v94');await storySay('book-navi','それがあなたの役目だ\nさっさと捨て台詞を吐いて消えなさい');await storySay('book-kaijin-boss','モブナビ・・');
  hideStoryPartyHeroV94(true);await storyShowSecondaryGuestsV94(['book-navi','yusha'],'book-navi-hero-duel-v207');const heroGuest=$('[data-story-actor="yusha"]',$('#storyGuestGroup'));heroGuest?.classList.add('book-hero-guest-v94');await fixedDelay(260);
  await storySay('book-navi','なんですか？');await storySay('pink','勇者様？');await storySay('book-kaijin-boss','なんのつもりだ？');await storySay('book-navi','ふう～・・\nそうですか');await storySay('book-navi','あなたは今やあのヒーロー\n気付いてしまいましたか');await storySay('jessie','気付く？');await storySay('desert','何かありそうだな');
  await storySay('book-navi','私はこの世界の支配者\n怪人はヒーローに倒される');await storySay('book-navi','そんな当たり前のループに疲れました\nなので');await storySay('book-navi','2人とも消えてもらうことにしました');await storySay('book-kaijin-boss','なんだと？\nあのヒーローが消えたのは\nお前の仕業か？');await storySay('book-navi','如何にも');await storySay('book-navi','あのヒーローが消えて\nあなたが誰かに倒されれば');await storySay('book-navi','二度と復活しない');await storySay('book-navi','だからずっと待っていました');await storySay('book-navi','あのヒーローが消えて\nあなたが倒れる日を');await storySay('pink','とんでもないやつであります！！');await storySay('book-navi','そうですか？\n私はこの世界の秩序を保っている');await storySay('book-navi','私は神なのです\n神の言うことに不満でも？');await storySay('tetsu','大いにあるでござる！\nお主は神などではない！\nただの悪党でござる！');
  await bookNaviHitKaijinV207();await moveBookBossIntoPartyV207();await storySay('kaijin','ぐは・・ッ');await storySay('desert','ここは勇者に任せるしかないな');await storySay('pink','勇者様！！');await storySay('nyoro','僕たちのヒーロー！！');
  await storyHideGuests().catch(()=>{});restoreStoryPartyHeroV94();$('#storyScene').hidden=true;await startBookNaviSoloV89Final();
  bookHeroStoryModeV94='hero';await openStoryScene('unfinishedBook',3);await showBookNaviHeroDuelV207();await storySay('jessie','このままじゃまずい！\nあいつ、ほとんどダメージを受けてないわ、、\nきっと何かカラクリがある！');await storySay('denden','オイラたちも一緒に戦うでやんす！');await storySay('tetsu','ヒーロー殿、助太刀いたす！');await storySay('desert','怪人よ\n俺たちはやつを倒す\nお前はどうする？');await storySay('money','敵の敵は味方じゃないの？');await storySay('kaijin','ハハッ・・\nヒーローと共闘か');await storySay('kaijin','おもしれえ！やってやるよ！！');await storySay('nekoku','お前、なんかカッコイイぞ');await storySay('denden','アチアチの展開でやんす！');await storySay('kaijin','やつは常にバリアを張っている！\n一斉に攻撃してバリアを破壊するんだ！');
  await restoreBookHeroToPartyV207();$('#storyScene').hidden=true;await bookPartyFormationV92();
  bookHeroStoryModeV94='hero';await openStoryScene('unfinishedBook',3);await storyShowGuest('book-navi',{slow:true});await storySay('book-navi','やれやれ、面倒だな');await naviMatrixTransformV207();await storySay('book-navi-master','さあ、どんなエンディングになるかな？');await storySay('pink','正義は勝つであります！');await storySay('money','ヒロインも勝つのよ！');await storySay('kaijin','ハハッ！\n最高の物語になりそうだな！！');await storyHideGuest();$('#storyScene').hidden=true;await bookNaviMasterBattleLoopV94();
  bookHeroStoryModeV94='hero';await openStoryScene('unfinishedBook',3);await storyShowGuest('book-navi-master',{slow:true});await storySay('book-navi-master','こ、の、わた、、、');await naviMatrixCollapseV207();await storySay('desert','やったな');await glowV157('yusha',2);bookHeroStoryModeV94='normal';setBookStoryHeroArtV92('normal');await storyFlash();setBookStoryHeroArtV92('normal');
  await storySay('money','おかえり勇者！');await storySay('pink','勇者様、\n最高の力を手に入れたであります！');await storySay('riro','恐らく\n外の世界で\n同じような効果は期待できなイ\nでも\n間違いなく強くはなるはずでス');await storySay('nyoro','怪人はこれからどうするニョロ？');await storySay('kaijin','さあな\n俺には目的も意味もねえ');await storySay('money','なら魔王を倒すの手伝ってよ！\n敵の敵は味方でしょ？');await storySay('jessie','なにそれ\n最高じゃない！');await storySay('kaijin','ハハッ・・\n最後まで付き合ってやるよ！');
  state.meta.heroPassive2Unlocked=true;state.meta.bookCompleted=true;state.meta.bookHeroDown=false;saveMeta();await renderStoryParty();await storyNarrate('モブ怪人のボスが仲間に加わった！');await storyNarrate('モブ勇者は新必殺技「読みかけの本」を習得した！');await storyNarrate('使用するとあのヒーローに変身し、全ステータス20%アップ\nさらに、必殺技の威力20%アップ');
  const worlds=MOB_DATA.adventureWorlds||[],wi=worlds.findIndex(w=>w.id==='demonCastle2');if(!Array.isArray(state.adventure.reportedWorlds))state.adventure.reportedWorlds=[];if(!state.adventure.reportedWorlds.includes('unfinishedBook'))state.adventure.reportedWorlds.push('unfinishedBook');if(wi>=0)state.adventure.worldIndex=wi;state.adventure.areaIndex=0;state.adventure.battleIndex=0;state.adventure.battleReady=false;state.adventure.awaitingReport=null;state.adventure.pendingEncounter=null;state.adventure.runSnapshot=null;saveAdventure();
}

/* Register Book keys as v207-owned so old layered Book scripts cannot run in parallel. */
for(const [key,area] of [['arrival:unfinishedBook',0],['pre:unfinishedBook:0',0],['post:unfinishedBook:0',0],['pre:unfinishedBook:1',1],['post:unfinishedBook:1',1],['pre:unfinishedBook:2',2],['post:unfinishedBook:2',2],['pre:unfinishedBook:3',3],['post:unfinishedBook:3',3]]){
  STORY_EVENTS[key]={...(STORY_EVENTS[key]||{}),worldId:'unfinishedBook',area,v207Custom:true,forceHome:false};
}
const BOOK_RUNNERS_V207={
  'arrival:unfinishedBook':bookArrivalV207,
  'pre:unfinishedBook:0':bookArea1PreV207,'post:unfinishedBook:0':bookArea1PostV207,
  'pre:unfinishedBook:1':bookArea2PreV207,'post:unfinishedBook:1':bookArea2PostV207,
  'pre:unfinishedBook:2':bookArea3PreV207,'post:unfinishedBook:2':bookArea3PostV207,
  'pre:unfinishedBook:3':bookArea4PreV207,'post:unfinishedBook:3':bookArea4PostV207
};

async function finishBookReturnV207(){
  /* No generic adventure report is allowed to survive the authored Book ending. */
  if(state.adventure?.awaitingReport?.worldId==='unfinishedBook')state.adventure.awaitingReport=null;
  saveAdventure();
  await closeStoryScene(false);await travelTo('castle','レコードの間へ戻っています…',renderCastle);await openCastleRoom('records');
  await facilityTalk('おお！無事に戻ったか！','モブスライムキング','play/007.png');
  await narrationDialog('モブピンクは起こった出来事を話した');
  await facilityTalk('そうか\nでは勇者はあのヒーローでもあるのか！','モブスライムキング','play/007.png');
  await facilityTalk('これで怖いもん無しじゃな！\n皆の者、準備が整い次第、','モブスライムキング','play/007.png');
  await facilityTalk('再び魔王城へ向かってくれ！','モブスライムキング','play/007.png');
  await facilityTalk('王の間にて知らせを待つ！\n武運を祈っておるぞ！','モブスライムキング','play/007.png');
  await kingDashAwayV207();state.meta.bookKingReturnDone=true;saveMeta();state.adventure.awaitingReport=null;saveAdventure();
}

const runStoryEventBaseV207=runStoryEvent;
runStoryEvent=async function(key,forceHomeOverride=false){
  const runner=BOOK_RUNNERS_V207[key];if(!runner)return runStoryEventBaseV207(key,forceHomeOverride);
  if(storyDone(key)||storyBusy)return false;storyBusy=true;let ok=false;
  try{await runner();markStoryDone(key);ok=true;}catch(err){console.error('[v207] Reading Book event failed:',key,err);throw err;}finally{storyBusy=false;}
  if(!ok)return false;
  if(key==='post:unfinishedBook:3'){await finishBookReturnV207();return true;}
  await closeStoryScene(false);if(screens.adventure.classList.contains('active'))renderAdventure();return true;
};

/* ---------- Exact Demon Castle report -> Record Room discovery ---------- */
async function demonCastleBookReportV207(){
  if(castleReportBusy||storyBusy)return;castleReportBusy=true;
  try{
    const r=state.adventure.awaitingReport;if(!r||r.worldId!=='demonCastle')return;
    if(!Array.isArray(state.adventure.reportedWorlds))state.adventure.reportedWorlds=[];if(!state.adventure.reportedWorlds.includes('demonCastle'))state.adventure.reportedWorlds.push('demonCastle');
    state.adventure.awaitingReport=null;state.adventure.battleReady=false;state.adventure.pendingEncounter=null;state.adventure.runSnapshot=null;const wi=(MOB_DATA.adventureWorlds||[]).findIndex(w=>w.id==='unfinishedBook');if(wi>=0)state.adventure.worldIndex=wi;state.adventure.areaIndex=0;state.adventure.battleIndex=0;
    state.meta.bookPortalReady=true;state.meta.bookEntered=false;state.meta.bookCompleted=false;state.meta.bookKingReturnDone=false;state.meta.record7Obtained=true;saveMeta();saveAdventure();
    await facilityTalk('王様ー！！\nレコードが7枚揃ったであります！','モブピンク','play/02.png');await facilityTalk('おーーー！！','モブスライムキング','play/007.png');
    await animateV157(document.querySelector('[data-castle-actor="king"]'),[{translate:'0 0'},{translate:'48px 0'},{translate:'-48px 0'},{translate:'34px 0'},{translate:'-34px 0'},{translate:'0 0'}],1500);const king=document.querySelector('[data-castle-actor="king"]');king?.style.removeProperty('translate');
    await facilityTalk('よくぞ揃えた！\n勇者、\nモブピンク、\n皆の者！\n本当によくやった！','モブスライムキング','play/007.png');await facilityTalkAnimatedV207('これで魔王を倒せますね！','モブピンク','play/02.png','jump');await facilityTalk('では早速レコードルームへ向かうのじゃ！','モブスライムキング','play/007.png');
    document.body.classList.add('record-reveal-v159');await travelTo('castle','レコードルームへ…',renderRecordRoom);await recordsReadyV159();const book=document.querySelector('[data-enter-book-v119],[data-enter-book-v92]');if(book){book.hidden=true;book.style.visibility='hidden';book.style.pointerEvents='none';}
    await facilityTalk('これで全てのレコードが揃った','モブスライムキング','play/007.png');await facilityTalk('さあ！','モブスライムキング','play/007.png');await facilityTalk('レコード達よ！','モブスライムキング','play/007.png');await facilityTalkAnimatedV207('世界を救ってくれ‼︎','モブスライムキング','play/007.png','big');
    await glowV157(document.querySelector('.record-stage-v119,.record-stage'),2);if(book){book.hidden=false;book.style.setProperty('visibility','visible','important');book.style.setProperty('pointer-events','auto','important');}await fixedDelay(2000);
    await facilityTalk('本・・でありますか？','モブピンク','play/02.png');await facilityTalk('本・・じゃな','モブスライムキング','play/007.png');await facilityTalk('タイトルは、\n読みかけの本？','モブピンク','play/02.png');await glowV157(book,2);document.body.classList.remove('record-reveal-v159');await facilityTalk('これは！\n本の中に入れるであります！','モブピンク','play/02.png');await facilityTalk('きっとそこに\n最強の武器があるのじゃ！','モブスライムキング','play/007.png');await facilityTalk('準備が出来次第、\n本の世界へ行くであります！','モブピンク','play/02.png');await narrationDialog('準備完了後、本をタップしてください');renderRecordRoom();
  }finally{castleReportBusy=false;document.body.classList.remove('record-reveal-v159');}
}

function clearStaleBookReportV207(){
  const r=state.adventure?.awaitingReport;if(r?.worldId!=='unfinishedBook')return false;
  state.adventure.awaitingReport=null;state.adventure.battleReady=false;state.adventure.pendingEncounter=null;state.adventure.runSnapshot=null;saveAdventure();return true;
}
const submitAdventureReportBaseV207=submitAdventureReport;
submitAdventureReport=async function(){
  const r=state.adventure?.awaitingReport;
  if(r?.worldId==='demonCastle')return demonCastleBookReportV207();
  if(r?.worldId==='unfinishedBook'){
    clearStaleBookReportV207();
    if(state.meta?.bookCompleted||state.meta?.bookKingReturnDone)return facilityTalk('武運を祈る！','モブスライムキング','play/007.png');
    return;
  }
  return submitAdventureReportBaseV207();
};

const castleActorSpeakBaseV207=castleActorSpeak;
castleActorSpeak=function(kind,actorEl){
  if(kind==='king'&&(state.meta?.bookKingReturnDone||state.meta?.bookCompleted)&&!state.meta?.finalBossDefeated){
    clearStaleBookReportV207();showCastleSpeech('モブスライムキング','武運を祈る！',actorEl,'center');return;
  }
  return castleActorSpeakBaseV207(kind,actorEl);
};

window.__mobBuildVersion='v207';
window.__mobV207ReadingBookScript=true;
window.__mobV207AutoTargetFix=true;
window.__mobV207BookReportGuard=true;
// UPDATE_V207_END
