// UPDATE_V180_BEGIN
/* v180: authored Demon Castle enhancement + event guest scale correction. */

/* --- Event quest visual scale correction --- */
const storyGuestSizeBaseV180=applyStoryGuestNaturalSize;
applyStoryGuestNaturalSize=function(holder,img,info,opt={}){
  storyGuestSizeBaseV180(holder,img,info,opt);
  if(!holder||!img||!(img.naturalWidth>0&&img.naturalHeight>0))return;
  const key=String(holder.dataset?.storyActor||info?.key||info?.id||'');
  const scene=$('#storyScene');if(!scene)return;const r=scene.getBoundingClientRect();
  let maxW=0,maxH=0;
  if(key==='v179-phoenix'){maxW=r.width*.76;maxH=r.height*.38;holder.classList.add('phoenix-sized-v180');}
  else if(key==='v179-custard'||key==='v179-riscustard'){maxW=r.width*.34;maxH=r.height*.22;holder.classList.add('custard-sized-v180');}
  else return;
  const scale=Math.min(maxW/img.naturalWidth,maxH/img.naturalHeight,1);
  holder.style.setProperty('width',`${Math.max(1,Math.round(img.naturalWidth*scale))}px`,'important');
  holder.style.setProperty('height',`${Math.max(1,Math.round(img.naturalHeight*scale))}px`,'important');
};
fitPhoenixGuestV179=function(){const sc=$('#storyScene'),g=$('#storyGuest'),img=$('#storyGuestImg');if(!sc||!g||!img||!(img.naturalWidth>0&&img.naturalHeight>0))return;const r=sc.getBoundingClientRect(),maxW=r.width*.70,maxH=r.height*.345,scale=Math.min(maxW/img.naturalWidth,maxH/img.naturalHeight,1);g.style.setProperty('width',`${Math.max(1,Math.round(img.naturalWidth*scale))}px`,'important');g.style.setProperty('height',`${Math.max(1,Math.round(img.naturalHeight*scale))}px`,'important');g.classList.add('phoenix-sized-v179','phoenix-sized-v180');};

/* --- Demon Castle authored enemy specifications --- */
function patchEnemyV180(id,patch){const t=enemyTemplate(id);if(t)Object.assign(t,patch);return t;}
patchEnemyV180('c-killwitch',{name:'モブキラウィッチ',levelMin:80,levelMax:80,damageReduction:.10,permanentDamageReduction:true,magicDamageReductionV180:.20});
patchEnemyV180('c-succubus',{name:'モブララウィッチ',levelMin:80,levelMax:80,damageReduction:.10,permanentDamageReduction:true,magicDamageReductionV180:.20});
patchEnemyV180('c-miraheld',{levelMin:75,levelMax:75,damageReduction:.10,permanentDamageReduction:true,specialOptions:[
  {special:'コーク・ハイ・フレイム',kind:'stunSingle',power:1.05,chance:.20,skillElement:'火',skillType:'magic'},
  {special:'フレイムマジック',kind:'aoe',power:.82,skillElement:'火',skillType:'magic'},
  {special:'ヒートリカバー',kind:'enemyHeal',power:.16,skillElement:'火',skillType:'magic'}
]});
patchEnemyV180('boss-gladi',{levelMin:82,levelMax:82,damageReduction:.12,permanentDamageReduction:true,evasion:.10,kind:'tripleAoeV180',power:.62,special:'将軍進撃',skillType:'physical'});
patchEnemyV180('c-yamieater',{levelMin:75,levelMax:75,specialOptions:[
  {special:'デビルスラッシュ',kind:'single',power:1.05,skillElement:'闇',skillType:'physical'},
  {special:'ダークマジック',kind:'aoe',power:.78,skillElement:'闇',skillType:'magic'}
]});
patchEnemyV180('c-lilith-hell',{damageReduction:.10,permanentDamageReduction:true});
patchEnemyV180('boss-yami-money',{levelMin:90,levelMax:90,actionCount:2,forceActionCount:true,v144ActionMin:2,v144ActionMax:3,damageReduction:.10,permanentDamageReduction:true,magicDamageReductionV180:.10,critDamageReduction:.20});

const aceTemplateBaseV180=castleAceTemplateV178;
castleAceTemplateV178=function(){return {...aceTemplateBaseV180(),damageReduction:.10,permanentDamageReduction:true,evasion:.10};};

/* Magic-only reduction used by the authored Demon Castle enemies. */
const enemyHitBaseV180=applyEnemyDamageTo;
applyEnemyDamageTo=function(a,e,power,type='physical',...rest){
  if(!e?.magicDamageReductionV180||type!=='magic')return enemyHitBaseV180(a,e,power,type,...rest);
  const oldCut=e.damageReduction,oldPermanent=e.permanentDamageReduction;
  e.damageReduction=1-(1-Number(oldCut||0))*(1-Number(e.magicDamageReductionV180||0));e.permanentDamageReduction=true;
  try{return enemyHitBaseV180(a,e,power,type,...rest);}finally{e.damageReduction=oldCut;e.permanentDamageReduction=oldPermanent;}
};

const projectileBaseV180=playEnemyProjectile;
playEnemyProjectile=async function(e,target){
  if(e?.id!=='boss-gladi')return projectileBaseV180(e,target);
  const layer=$('#battleFxLayer'),from=enemyTargetPoint(e?.uid),to=allyTargetPoint(target?.id);if(!layer)return;
  const b=document.createElement('i');b.className='enemy-projectile-bullet gladi-bullet-v180';b.style.left=from.left;b.style.top=from.top;b.style.setProperty('--bullet-x',`calc(${to.left} - ${from.left})`);b.style.setProperty('--bullet-y',`calc(${to.top} - ${from.top})`);layer.appendChild(b);await fixedDelay(185);b.remove();
};

const bossSpecialBaseV180=bossSpecial;
bossSpecial=async function(spec){
  const e=actingEnemy()||state.battle?.enemy;
  if(spec?.kind!=='tripleAoeV180')return bossSpecialBaseV180(spec);
  await enemySkillImageCutinV134(e,spec);let total=0;
  for(let i=0;i<3;i++){total+=await aoeHit(Number(spec.power)||.62,spec.skillType||'physical',spec.skillElement||e?.attribute||'火');await fixedDelay(90);}
  notice('3 HIT','system',520);return total;
};

/* Lilith gains the authored 50% HP buff. */
const hpDialogueBaseV180=checkBattleHpDialogue;
checkBattleHpDialogue=async function(...args){
  await hpDialogueBaseV180(...args);const b=state.battle;if(!b||b.finished)return;
  const e=(b.enemies||[]).find(x=>x.id==='boss-lilith-castle'&&x.hp>0);
  if(e&&b.config?.lilithSplitBattle&&e.hp/Math.max(1,e.maxHp)<=.50&&!b.lilithHalfBuffV180){
    b.lilithHalfBuffV180=true;addEnemyDamageCutV142(e,.05);e.magBuff=Math.max(Number(e.magBuff)||0,.30);e.magBuffTurns=99;fx('buff',`enemy:${e.uid}`);notice('モブリリス DAMAGE CUT +5% / MAG +30%','buff',900);
  }
};

/* Every third Yami Money turn is suppressed by normal Money, as authored. */
const enemyActionBaseV180=enemyAction;
enemyAction=async function(index=1,uid){
  const b=state.battle,e=enemyByUid(uid)||actingEnemy()||b?.enemy;
  if(e?.id==='boss-yami-money'&&b&&!b.finished&&b.turn>0&&b.turn%3===0){
    b.yamiStoppedTurnsV180??={};if(!b.yamiStoppedTurnsV180[b.turn]){b.yamiStoppedTurnsV180[b.turn]=true;await allyStoryCutin('money','（みんな！今のうちに攻撃を！）');await enemyStoryCutin(e,'クッ・・邪魔をするな！');}
    return;
  }
  return enemyActionBaseV180(index,uid);
};

/* --- Demon Castle cinematic helpers --- */
function castleFxV180(className){const sc=$('#storyScene');if(!sc)return null;const fx=document.createElement('div');fx.className=`castle-fx-v180 ${className}`;sc.appendChild(fx);return fx;}
async function acePurpleSummonV180(){const fx=castleFxV180('ace-purple-lightning-v180');$('#storyScene')?.classList.add('ace-summon-v180');try{await fixedDelay(650);await storyShowGuest('boss-ace',{slow:true});await fixedDelay(450);}finally{$('#storyScene')?.classList.remove('ace-summon-v180');fx?.remove();}}
async function blackSphereV180(){const fx=castleFxV180('black-sphere-v180');try{await fixedDelay(1100);}finally{fx?.remove();}}
async function roseMagicV180(ms=900){const fx=castleFxV180('rose-magic-v180');try{await fixedDelay(ms);}finally{fx?.remove();}}
async function roseFadeV180(id){const a=storyAnchor(id);const fx=castleFxV180('rose-magic-v180 fade-v180');try{if(a)await animateV157(a,[{opacity:1,filter:'brightness(1)'},{opacity:.7,filter:'brightness(1.7) drop-shadow(0 0 18px #ff86cf)'},{opacity:0,filter:'brightness(.25) drop-shadow(0 0 22px #9a1c74)'}],1100);}finally{fx?.remove();if(a)a.hidden=true;}}
async function lilithRoseSummonV180(){const fx=castleFxV180('rose-summon-v180');try{await storyShowGuest('boss-lilith-castle',{slow:true});await fixedDelay(450);}finally{fx?.remove();}}
async function lilithFamilyRoseSummonV180(){const fx=castleFxV180('rose-ultimate-v180');try{await demonLilithSummonV106();await fixedDelay(650);}finally{fx?.remove();}}
async function pinkHeadShakeV180(){const a=storyAnchor('pink');if(!a)return;await animateV157(a,[{translate:'0 0'},{translate:'-10px 0',offset:.2},{translate:'10px 0',offset:.4},{translate:'-9px 0',offset:.6},{translate:'8px 0',offset:.8},{translate:'0 0'}],650);}
async function pinkChargeV180(){const a=storyAnchor('pink');if(!a)return;a.classList.add('pink-charge-v178');await glowV157('pink',2);}
async function witchesMergeV180(){const fx=castleFxV180('witch-merge-fx-v180');try{await demonWitchesMergeIntoLilithV106();}finally{fx?.remove();}}

const runStepsBaseV180=runStorySteps;
runStorySteps=async function(steps=[]){for(const st of steps){
  if(st[0]==='roseFade180')await roseFadeV180(st[1]);
  else if(st[0]==='lilithRoseSummon180')await lilithRoseSummonV180();
  else if(st[0]==='lilithFamilyRoseSummon180')await lilithFamilyRoseSummonV180();
  else if(st[0]==='witchMerge180')await witchesMergeV180();
  else await runStepsBaseV180([st]);
}};

/* --- Authored Demon Castle opening --- */
runDemonCastleArrivalStory=async function(){
  await openStoryScene('demonCastle',0);
  const pink=storyAnchor('pink');pink?.classList.add('event-shiver-v179');await storySay('pink','ここが魔王城でありますね・・！');pink?.classList.remove('event-shiver-v179');
  await storySay('desert','覚悟は決まったか？');await storySay('tetsu','拙者');await storySay('tetsu','絶好調でござる');
  await acePurpleSummonV180();
  await storySay('boss-ace','まさか');await storySay('boss-ace','ここまで来るとはな');await storySay('money','！？');await storySay('jessie','モブエース！！');await storySay('boss-ace','久しぶりだな');await storySay('boss-ace','このような形での\n再開は望んでいなかった');
  await storySay('desert','魔王の側近と\n随分と仲が良さそうだな');await storySay('jessie','かつての仲間よ\n共にネオン街を守っていた');await storySay('jessie','保安官仲間');await storySay('desert','通りで強いわけだ\nさらに、王の息子なのだろう？');await storySay('pink','なぜ魔王軍に！');await storySay('denden','退屈だからでやんすか！？');await storySay('boss-ace','退屈か');await storySay('boss-ace','そうであれば\nどれほど幸せだろな');await storySay('money','はっきりとは覚えてないけど\n悪いやつではなかったはずよ！');await storySay('boss-ace','そうか\n少しは覚えているのか');
  await storySay('jessie','モブエース！\n１つ答えなさい！');await storySay('jessie','なぜネオン街を捨てた！');await storySay('boss-ace','捨ててなどいない\nお前と同じだモブジェシー！');await storySay('desert','目的の相違での戦い\n俺にも経験がある');await storySay('desert','避けては通れないぞ！');await storySay('nekoku','オラ、みんなを守るぞ');await storySay('riro','悲しい戦いネ\nいや');await storySay('riro','戦いは悲しいネ');await storySay('riro','でも');await storySay('denden','やるしかないでやんす！');await storySay('nyoro','戦うニョロ！');
  $('#storyScene').hidden=true;await startDemonAceStoryBattle();
  await openStoryScene('demonCastle',0);await storyShowGuest('boss-ace',{slow:true});await storySay('boss-ace','俺はまだ・・\n消えるわけにはいかない・・');await storySay('denden','オイラたちの勝ちでやんす！');await storySay('nyoro','もう終わりニョロ！');await storySay('jessie','いえ、まだよ');await storySay('money','まだ？');await blackSphereV180();await storyNarrate('？？？「情けない」');
  await storyShowGuests(['boss-ace','boss-maou-castle'],{slow:true,silhouetteKeys:['boss-maou-castle']});
  await storySay('boss-maou-castle','我の側近が無様な姿を晒すとは');await storySay('boss-ace','申し訳、、ありません・・');await storySay('pink','魔王であります！！');await storySay('desert','こんなに早く出会うとはな');await storySay('boss-maou-castle','まあよい\n一度引き上げるぞ');await storySay('jessie','逃がさないわよ！');await projectileV178('jessie','boss-ace');await storyImpact('バチィッ!!');await storySay('boss-ace','グッ・・・！');await storySay('boss-maou-castle','ハハハ・・');await storySay('boss-maou-castle','お前も随分と嫌われたようだな\n行くぞ');
  await demonTeleportPairV106();await storySay('denden','待つでやんす！！');await storySay('money','臆病者！');await storySay('desert','城内にいるはずだ\n先へ進むぞ！');
};

/* --- Areas 1–3, exactly following the new authored script --- */
Object.assign(STORY_EVENTS,{
 'pre:demonCastle:0':{worldId:'demonCastle',area:0,steps:[
   ['guests',['c-killwitch','c-succubus']],['say','c-killwitch','我ら！'],['sayAs','c-succubus','リリス親衛隊！','モブララウィッチ'],['say','c-killwitch','モブキラウィッチ！'],['sayAs','c-succubus','モブララウィッチ！','モブララウィッチ'],['sayDual','c-killwitch','お命頂戴！','c-succubus','お命頂戴！'],['say','denden','か、かっけえでやんす・・'],['say','nekoku','オラ、好きだ'],['say','money','何馬鹿な事言ってるの！\nこの2人相当強いわよ！'],['say','jessie','簡単には通してくれなさそうね'],['say','nyoro','早く倒してモブエースを追うニョロ！']
 ]},
 'post:demonCastle:0':{worldId:'demonCastle',area:0,steps:[
   ['guests',['c-killwitch','boss-lilith-castle','c-succubus'],{mergeSetup:true,raised:true}],['sayAs','c-succubus','リリス様・・','モブララウィッチ'],['say','c-killwitch','申し訳、、ありません、、'],['say','boss-lilith-castle','2人ともよく頑張ったね'],['say','boss-lilith-castle','もういいから\nゆっくり休んでね\nあとは僕に任せて'],['witchMerge180'],['say','boss-lilith-castle','どうも勇者様\n引き返すならここが最後だよ'],['say','nekoku','魔王軍のNo.2だぞ！'],['say','jessie','薔薇の魔女、モブリリス・・！'],['say','boss-lilith-castle','ネオン街の魔女に保安官ね\n大人しくお家に帰る気はない？'],['say','pink','魔王を倒すまで\n僕たちは止まらないであります！'],['say','desert','薔薇の魔女がもう相手をしてくれるのか？'],['say','boss-lilith-castle','そんなわけないでしょ'],['say','boss-lilith-castle','そこのピンクちゃん'],['say','boss-lilith-castle','死相が出てるわ'],['say','boss-lilith-castle','警告に来てあげただけ'],['say','pink','そんな脅し怖くないであります！'],['say','boss-lilith-castle','脅し？\n僕割と優しいんだけどね'],['say','boss-lilith-castle','まあ\nせいぜい死なないことね'],['roseFade180','boss-lilith-castle'],['hideGuests'],['say','desert','死相など全員に出ている'],['say','desert','覚悟を決めて\n先へ進むぞ！'],['say','money','あいつ、やばいわね\nもっと魔力を溜めないと！']
 ]},
 'pre:demonCastle:1':{worldId:'demonCastle',area:1,steps:[
   ['castleGladi178'],['say','boss-gladi','我・・見参！'],['say','desert','魔王軍 No.3の登場か'],['say','jessie','ゴールデンバレットの\nグラディモブ！'],['say','denden','撃ち合いなら負けないでやんす！'],['say','boss-gladi','エース'],['say','boss-gladi','ララ'],['say','boss-gladi','キラ'],['say','boss-gladi','やつらを倒すとは\n賞賛に値するぞ'],['say','money','あなたもリストに加えてあげるわ！'],['say','boss-gladi','ネオン街の魔女\nお前に弾丸を撃ち込むこの時\n心待ちにしていたぞ'],['say','money','？'],['say','money','私はあんたに恨みなんてないけど'],['say','money','そこを通してもらうわ！'],['say','boss-gladi','大人しく通すと思うか？'],['say','jessie','みんな気を付けて！\nやつの攻撃は通常攻撃で状態異常弾丸を使ってくる！'],['say','jessie','かかったらすぐアイテムで回復するのよ！'],['say','boss-gladi','モブエースが心配か？'],['say','jessie','仲間を心配するのは当然でしょう！'],['say','boss-gladi','仲間・・か\nそうだな'],['say','boss-gladi','さあ\n行くぞ！！']
 ]},
 'post:demonCastle:1':{worldId:'demonCastle',area:1,steps:[
   ['guest','boss-gladi'],['say','boss-gladi','グフッ・・'],['say','pink','我々の勝ちであります！'],['say','boss-gladi','我の負けだ・・\nだが\n魔王様には遠く及ばない'],['say','boss-gladi','ネオン街の魔女よ\n二度もお前に敗れるとはな'],['say','money','さっきから何を言っているの？\n誰かと間違えてない？'],['say','boss-gladi','先へ進むがいい\nそして'],['say','boss-gladi','運命とどう戦うのか\nその答えを見せてくれ'],['say','denden','いい戦いだったでやんす！'],['say','boss-gladi','良い腕だったぞモブデンデン\nまたいずれどこかで・・'],['castleDarkFade178','boss-gladi'],['hideGuest'],['say','desert','残りはモブリリス、そして魔王だけだ'],['say','jessie','奥の手でもない限りはね'],['say','nekoku','オラ\n誰が相手でも戦う！'],['say','nyoro','平和まであと少しニョロ！'],['say','pink','先へ進むであります！'],['say','tetsu','いざいざ！！']
 ]},
 'pre:demonCastle:2':{worldId:'demonCastle',area:2,steps:[
   ['lilithRoseSummon180'],['say','boss-lilith-castle','凄いね君たち'],['say','boss-lilith-castle','グラディモブ\n強かったでしょ'],['say','desert','ああ\n強敵だった'],['say','boss-lilith-castle','まあ\n僕の方が強いんだけどね'],['say','boss-lilith-castle','ちょっとだけ寂しくなるな'],['say','money','あんたなんて\n私の魔法でぶっ飛ばしてやるわ！'],['say','boss-lilith-castle','ネオン街の魔女\n僕も手合わせしてみたかった'],['say','boss-lilith-castle','良い機会ね'],['say','jessie','あなたを倒せば\nあとは魔王だけ！'],['say','boss-lilith-castle','うーん\nそれはどうだろう'],['say','boss-lilith-castle','行ってみないと分からないよね\nまあ'],['say','boss-lilith-castle','行けないんだけどね'],['lilithFamilyRoseSummon180'],['say','boss-lilith-castle','君たちは\nこのリリス四姉妹が遊んでくれるよ\nあ、僕も入れたら五姉妹か？\nいや僕は親？うーん'],['say','pink','あれを全部相手は大変であります・・'],['say','desert','2手に分かれよう'],['say','denden','ナイスアイデアでやんす！'],['say','jessie','どう分かれるの？'],['say','riro','勇者様が\n決めればいいでス'],['say','denden','そうでやんすね！'],['say','money','リリスがいる方は3体\n戦力の分け方が大事ね！'],['narrate','パーティーを2つ作ってください\nAパーティーの対戦相手\nモブリリス、モブヘルリリス、モブキリンリリス\nBパーティーの対戦相手\nモブクフリリス、モブリヴァリリス'],['lilithSplit'],['say','nyoro','素晴らしい采配ニョロ！'],['say','desert','では、まずBパーティーの出陣だ！']
 ]},
 'post:demonCastle:2':{worldId:'demonCastle',area:2,steps:[
   ['guest','boss-lilith-castle'],['say','boss-lilith-castle','僕の負けだね\nいいソウルを持ったチーム'],['say','boss-lilith-castle','でも僕は特別なんだ'],['say','money','なによ！まだやる気！？'],['say','boss-lilith-castle','そんなつもりないよ\n今はね'],['say','boss-lilith-castle','代わりに良い話を聞かせてあげよう'],['say','denden','笑える話でやんすか？'],['say','boss-lilith-castle','かもね'],['say','desert','あまり時間はないのだが\n薔薇の魔女からの話\n興味はあるな'],['say','boss-lilith-castle','聞いてどうするかは\n君たち次第だけどね'],['castleHistory178',[
     'モブネオンキングがネオン街を治めていた頃','魔王様からネオン街を支配するよう命令が下った','ネオン街に隠されている"ある秘宝"を手に入れるため','グラディモブ モブドラゴン ミラモブ','最高のメンバーでネオン街へ向かった','ネオン街の王はモブドラゴンと互角','気高い戦士だったけど兵力が違う','魔王軍からしてみれば簡単な任務だった','でも','そんな時1人の魔女が現れた','その魔女は数々のボスを一瞬で倒し','グラディモブすら寄せ付けなかった','しかし','魔女は暴走しネオン街の王を攻撃した','魔王軍は撤退し','ネオン街と魔女の戦いになる','長い長い戦いの果て','ネオン街の戦士達によって','ついに魔女は封印された','それが','ある町の消滅と共に封印が解かれた','そして今','本来の力を失い勇者と旅をし','僕の目の前にいる'
   ]],['say','boss-lilith-castle','そう君だよ'],['say','boss-lilith-castle','ネオン街の魔女\nモブマニー'],['say','money','私が、王を・・？'],['castleJump178','jessie'],['say','jessie','そんなはずは無い！\nモブマニーは魔王に封印された！'],['say','jessie','私はこの目で見た！'],['say','desert','どういうことだ？'],['say','boss-lilith-castle','僕の話はここまで'],['say','boss-lilith-castle','あとは魔王様にでも聞くんだね'],['say','boss-lilith-castle','君たちとはまた会う気がするよ'],['say','boss-lilith-castle','またね'],['roseFade180','boss-lilith-castle'],['hideGuest'],['say','money','私が、、'],['say','denden','気にすることないでやんす！'],['say','denden','もし魔女だとしても'],['say','denden','今は優しくて強い\n勇者パーティーのモブマニーでやんす！'],['say','nyoro','そうだニョロ！'],['say','nekoku','オラ、モブマニー好き\n大事な仲間'],['say','pink','言いたいこと\n全部言われたであります'],['say','jessie','モブマニー\n今のあなたが本当のあなたよ'],['say','money','・・・ありがとう'],['say','desert','さあ最終決戦だ\n魔王の元へ行くぞ！']
 ]}
});

/* --- Final Area cinematic --- */
demonFinalPreV89Final=async function(){
  await blackSceneV178(0,['いつまで寝ているのだ','立て'],async()=>{await openStoryScene('demonCastle',3);duelPartyV158(true);await storyShowGuests(['boss-maou-castle','boss-ace'],{slow:true});});
  await storySay('boss-maou-castle','モブリリスがやられた\n我が軍は私とお前だけだ');await storySay('boss-ace','なんと、、');await storySay('boss-maou-castle','だが、終わりでは無い\n勇者を滅ぼし');await storySay('boss-maou-castle','新たな軍勢を作る');await storySay('boss-ace','では、現状援軍などは無いと？');await storySay('boss-maou-castle','不要であろう\n私とお前がいる');await storySay('boss-ace','そうか');
  await storySay('boss-ace','この日をどれほど夢見たことか');await storySay('boss-ace','力を得て');await storySay('boss-ace','お前の側近となり\n討伐する');await storySay('boss-ace','この日を！！');await storySay('boss-maou-castle','ほう、面白いな');await storySay('boss-ace','俺はネオン街の戦士\nモブエース');await storySay('boss-ace','お前を倒すチャンスを\nずっと伺っていた');await storySay('boss-maou-castle','この状況がチャンスだと？\nそんな体で何が出来る');await storySay('boss-ace','モブジェシーが放ったのは\n回復魔法だ');await storySay('boss-ace','そして');storyAnchor('boss-ace')?.classList.add('ace-charge-v178');await glowV157('boss-ace',2);await storySay('boss-ace','長年お前を見てきた\n闘い方、癖、仲間の強さ');await storySay('boss-ace','1対1なら\n今の俺なら勝てる!!');await storySay('boss-maou-castle','言いたいことはそれだけか？\nならば');await storySay('boss-maou-castle','早く攻め入るが良い\n先に攻撃させてやる');await storySay('boss-ace','その油断が、お前の命取りだ！');
  await aceAttackV157();storyAnchor('boss-ace')?.classList.remove('ace-charge-v178');await storySay('boss-maou-castle','もう終わりか？');await storySay('boss-ace','はあ、はあ、\n化け物め・・');await storySay('boss-maou-castle','化け物か\n悪くない響きだ');await storySay('boss-ace','くそ、、\nこんなはずでは');await storySay('boss-maou-castle','お前は最初から間違えている');await storySay('boss-maou-castle','やつは\n世界を滅ぼす');await storySay('boss-maou-castle','お前などが\n何をやったところで\n結果は変わらない');await storySay('boss-ace','意味ならあるさ\n必ず・・！！');await storySay('boss-maou-castle','お前の働きには感謝しているぞ\n安らかに眠れ');await projectileV178('boss-maou-castle','boss-ace','pyramid');await storySay('boss-ace','ッ・・！！');const ace=storyAnchor('boss-ace');if(ace)ace.style.opacity='.4';await fixedDelay(1000);await storySay('boss-ace','あとは任せたぞ・・');
  duelPartyV158(false);$('#storyPartyLine').style.removeProperty('visibility');await storySay('money','そこまでよ！');await darkFadeV178('boss-ace');await storyHideGuests();await storyShowGuest('boss-maou-castle',{slow:true});await storySay('boss-maou-castle','一足遅かったな');await storySay('jessie','モブエース・・');await storySay('desert','仲間割れか？');await storySay('tetsu','腐っているでござる・・！');await storySay('nyoro','仲間を手にかけるなんて');await storySay('denden','血も涙もないでやんす！');await storySay('boss-maou-castle','仲間だと？\nハハハッ！こいつがか？\n笑わせるな');await storySay('jessie','それ以上モブエースを侮辱してみなさい\n後悔させてやるわ');await storySay('money','モブジェシー？');await storySay('boss-maou-castle','先代モブネオンキング\nモブエース\nあとは、お前達だけだな');await storySay('money','ネオン街がそんなに怖い！？');await storySay('desert','何か秘密がありそうだな');await storySay('pink','僕たちを惑わそうとしているであります!!');
  await storySay('boss-maou-castle','ネオン街での戦いは\n2つの心を持つ魔女によって終結された');await storySay('boss-maou-castle','王の息子と娘が魔女を封印し');await storySay('boss-maou-castle','封印が解かれる日まで\n長年見守り続けてきた');await storySay('nekoku','思い出した\n「ネオン街の悪夢」\n国王様から聞いたことがある');await storySay('money','私は');await storySay('money','あんたに封印された！！');await storySay('boss-maou-castle','私に見覚えがあるか？');await storySay('money','それは・・');await storySay('boss-maou-castle','モブジェシー、お前はどうだ？');await storySay('jessie','私は、、');await storySay('boss-maou-castle','全て教えてやろう\nモブジェシー、モブエース');await storySay('boss-maou-castle','お前たちはネオン街の王\nモブネオンキングの娘と息子だ');await storySay('boss-maou-castle','そして');await storySay('boss-maou-castle','モブマニーは\nネオン街に突如現れ');await storySayRed('boss-maou-castle','王に娘として育てられた魔女');await storySay('pink','2人は姉妹ということでありますか!?');await storySay('nyoro','だからモブエースは、、\nニョロ・・');await storySay('boss-maou-castle','モブジェシー、モブエースは\n命をかけてモブマニーを封印し');await storySay('boss-maou-castle','記憶を改ざんしようとした\n封印はうまくいったが');await storySay('boss-maou-castle','様々な記憶にノイズを入れることなったのだ');await storySay('desert','話しが噛み合わなかったのはそのためか');await storySay('pink','そのノイズのせいでありますか・・！');
  await storySay('jessie','それがなんだというの？');await storySay('jessie','それが本当なら\nモブマニーは大切な妹で心強い仲間');await storySay('jessie','何も変わらない！');await storySay('boss-maou-castle','お前たちはそうであろうな\nだが');await storySay('boss-maou-castle','モブマニー、お前はどうだ？\nネオン街を半壊し王を消した魔女\nどんな気分だ？');await storySay('money','・・・・');await storySay('desert','答えなくていい\nお前は俺たちの仲間だ\nどうなっても変わらない');await storySay('boss-maou-castle','どうなっても、か');await storySay('nyoro','分からないニョロ・・');await storySay('nyoro','こんな話をして\n魔王になんのメリットがあるニョロ？');await storySay('denden','そうでやんす\nこの程度じゃ僕たちは揺るがないでやんす！');await storySay('boss-maou-castle','下等な生き物は察しがいいな');await storySay('riro','鍵・・ネ');await storySay('pink','鍵？');await storySay('boss-maou-castle','ほうさすがだなサクラ一族');await storySay('riro','モブマニーは異世界への扉を開く最後の鍵');await storySay('jessie','どういうこと？');await storySay('pink','・・・・！');await quietPinkV178();
  await storySay('boss-maou-castle','その通り');await storySay('boss-maou-castle','お前たちに易々とレコードを渡したのは\n全てのレコードを1か所に集結させるため');await storySay('boss-maou-castle','モブマニーを手にし\n我ら魔王軍は異世界へと侵略する');await storySay('jessie','それがお前の野望・・！');await storySay('pink','そんなこと絶対にさせない！');await storySay('boss-maou-castle','おしゃべりはここまでだ\nこの魔法を発動するまで');await storySay('boss-maou-castle','良い時間稼ぎになった');await storySay('boss-maou-castle','「魔力解放の陣」');await glowV157('boss-maou-castle',2);await sealV157('money');await storySay('money','うわああああああ！！！！');await storyFlash();await storyHideGuest();await storyShowGuests(['boss-maou-castle','boss-yami-money'],{slow:true});hideMoneyV157();await storySay('jessie','モブマニー・・？');await storySay('boss-yami-money','私はモブマニー');await storySay('boss-yami-money','闇の魔女\nモブマニー');await storySay('jessie','そんな・・！');await storySay('boss-maou-castle','さあ、どんな風に踊ってくれるのだ？\nいずれまた会おう');await storySay('boss-maou-castle','勇者と仲間達よ');await darkFadeV178('boss-maou-castle');await storyHideGuests();await storyShowGuest('boss-yami-money');
  await storySay('desert','魔力が巨大すぎる！一度退くぞ！');await storySay('denden','急ぐでやんす！');await storySay('pink','ここで逃げたら\nモブマニーは元に戻らないかもしれない！\n戦うべきであります！');await storySay('boss-yami-money','私は全てを滅ぼす存在\n勇者よ、覚悟!!');await storySay('jessie','戦わないで！');await moveV157('jessie',.5,.5);await storySay('riro','モブジェシー危なイ！');await storySay('tetsu','下がるでござる！');await orbV157('boss-yami-money','jessie');actorV157('jessie').style.opacity='.4';await storyImpact('ズドン!!');await storySay('jessie','うっ・・');await storySay('nyoro','まともに当たったニョロ！\n早く手当てをしないと！');await storySay('desert','いや、これは・・');await storySay('denden','そんな、、');await storySay('pink','僕に任せるであります');await moveV157('pink',.65,.5);await storySay('denden','何をする気でやんす！？');await storySay('pink','僕たち王国の兵士には');await storySay('pink','自身の生命エネルギーを\n他者に与える力があります');await storySay('nyoro','ニョロ！？');await storySay('desert','馬鹿な真似はよせ！');await pinkHeadShakeV180();await storySay('pink','80年であります');await storySay('nekoku','・・・・');await storySay('pink','モブマニーが自らを封印し\n前ネオン街の王が闇に消えてから');await storySay('pink','80年であります');await storySay('desert','80年・・');await storySay('pink','その間\nモブジェシーは・・');await storySay('pink','モブジェシーとモブエースは');await storySay('pink','ずっと');await storySay('pink','ずっと\nすっと');await storySay('pink','戦い続けたのであります');await storySay('pink','守り続けたのであります');await storySayBigV94('pink','大切な妹を！');await storySay('pink','僕たち兵士はいくらでも代わりがいる！\n僕たちは所詮モブキャラだから！');await castleJumpV178('pink');await storySayBigV94('pink','でも!!');await storySay('pink','みなさんは違います・・');await storySay('tetsu','同じでござる！！\nお主の代わりなどいない！！');await storySay('pink','みなさん\n必ず、魔王を倒してください！！');await pinkChargeV180();await storySay('pink','勇者様');await storySay('pink','お供できて');storyAnchor('pink')?.classList.add('full');await storySayBigV94('pink','光栄でした！');
  await storySay('boss-yami-money','（待って！モブピンク！）', 'モブマニー');await orbV157('boss-yami-money','jessie',true);await glowV157('jessie',1);actorV157('jessie').style.opacity='1';await storySay('desert','モブピンク、待て！');await castleMarkV178('pink');await storySay('jessie','ん・・');await storySay('tetsu','モブジェシー！！');storyAnchor('pink')?.classList.remove('pink-charge-v178','full');await storySay('pink','気が付いたでありますか！？');await storySay('boss-yami-money','（みんな聞こえる！？）','モブマニー');await storySay('denden','モブマニーでやんす！');await storySay('nyoro','聞こえるニョロ！');await storySay('boss-yami-money','（私は大丈夫だから、）','モブマニー');await storySay('boss-yami-money','（遠慮なくぶっ飛ばして！）','モブマニー');await storySay('desert','そういうことなら任せろ');await storySay('pink','必ず助けるであります！');await resetMotionV157();await storySay('jessie','信じるよ！');await storySay('denden','オイラ強いでやんすよ！\nモブマニー！！');
};

async function moneyYamiInnerV180(){
  await openStoryScene('demonCastle',3);restoreMoneyV157();const sc=$('#storyScene'),line=$('#storyPartyLine');sc.classList.add('money-inner-v180');line.innerHTML='';line.style.visibility='hidden';
  const orbs=document.createElement('div');orbs.className='money-inner-orbs-v180';orbs.innerHTML='<i></i><i></i><i></i><i></i><i></i><i></i>';sc.appendChild(orbs);
  await storyShowGuest('money',{slow:true});await fixedDelay(3000);await storySay('money','あれ..？\nここは？');await storyShowGuests(['money','boss-yami-money'],{slow:true});
  /* The party line is empty, so both speakers anchor to the equal-size center pair. */
  const group=$('#storyGuestGroup');for(const h of $$('.story-guest-multi',group)){h.style.setProperty('width','31%','important');h.style.setProperty('height','100%','important');}
  await castleMarkV178('money');await storySay('money','あ！\nあんた！');await storySay('boss-yami-money','・・・・');await storySay('money','って\n今怒っても仕方ないわね');await storySay('boss-yami-money','私は\nヤミモブマニー');await storySay('boss-yami-money','私は・・');await storySay('money','はいはい\nもう分かったわよ');await storySay('money','私には、あんたと私\n２つの心があるのね？');await storySay('boss-yami-money','私は闇\n1人の闇');await storySay('money','私と一緒で頑固なのね');await storySay('money','まあいいわ');await storySay('money','あんたは\nたっくさん悪いことをした');await storySay('money','それは私でもある');await storySay('money','消えたいくらい辛いし\n消えたいくらい怖い');await storySay('boss-yami-money','・・・・');await storySay('money','だからあんたは\nずっと出てこなかった');await storySay('boss-yami-money','私は\n怖い');await storySay('boss-yami-money','私は\n私が怖い');await storySay('money','分かってる');await storySay('money','だからこれからは\n私があんたを守ってあげる');await castleMarkV178('boss-yami-money');await storySay('money','代わりに\n私に力を貸して！');await storySay('boss-yami-money','私は\n闇');await storySay('boss-yami-money','戦ったら\n壊しちゃう');await storySay('money','一緒に戦うの！');await storySay('boss-yami-money','・・私は闇');await storySay('money','そう！闇！');await storySay('money','でも今から私の友達！');await storySay('boss-yami-money','・・トモダチ？');await storySay('money','友達！');await storySay('money','友達は支え合うんだよ');await storySay('money','さっき見てたでしょ？');await storySay('money','私の友達はすっごく強い！');await storySay('money','むかつく時もあるけど、\n絶対に助けてくれる！');await storySay('boss-yami-money','・・モブマニー、トモダチ');
  const y=storyAnchor('boss-yami-money'),m=storyAnchor('money');if(y&&m){const yr=y.getBoundingClientRect(),mr=m.getBoundingClientRect(),dx=mr.left+mr.width/2-(yr.left+yr.width/2),dy=mr.top+mr.height/2-(yr.top+yr.height/2);await animateV157(y,[{translate:'0 0',opacity:1,filter:'brightness(1)'},{translate:`${dx}px ${dy}px`,opacity:.75,filter:'brightness(2.4) drop-shadow(0 0 26px #ff78e8)',offset:.75},{translate:`${dx}px ${dy}px`,opacity:0,filter:'brightness(4)'}],1300);await glowV157('money',2);}
  await storyHideGuests();orbs.remove();sc.classList.remove('money-inner-v180');line.style.removeProperty('visibility');await renderStoryParty();await fixedDelay(2000);
}

demonFinalPostV89Final=async function(){
  await moneyYamiInnerV180();await storySay('jessie','モブマニー！');await storySay('pink','無事でありますか！？');await storySay('denden','返事するでやんす！');await sayLinesV178('money',['・・・・','・・・・','・・・・']);await storySayBigV94('money','うわ！');await storySay('desert','気が付いたか！');await storySay('nyoro','良かったニョロ～！！');await storySay('nekoku','オラ、嬉しい！');await storySay('tetsu','そなたは最高のサムライでござる！');await storySay('riro','本当に良かっタ・・');await storySay('jessie','闇に勝ったのね');await storySay('money','う～ん\n友達になった！');await chorusV158('え！？',true);await storySay('money','あの子はあの子で大変そうでさ');await storySay('money','ここまで来たら友達になろうって！');await storySay('desert','あの力が使えるのか？');await storySay('money','うん！私もっと強くなったよ！');await storySay('nyoro','心強いニョロ～！');await storySay('tetsu','また手合わせ願いたいでござるなー');await storySay('nekoku','！\n何か落ちてるぞ？');await storySay('desert','これは、、レコード！');await storyNarrate('7枚目のレコード\n「読みかけの本」を手に入れた！');state.meta.moneyFriendsUnlocked=true;state.meta.record7Obtained=true;saveMeta();await storySay('money','なんか\n私の友達が持ってたみたいね');await storySay('pink','7枚揃ったであります！\n王様に報告しましょう！');await storySay('money','待って！\nみんな\n・・・・\nありがとう！');await storyNarrate('モブマニーは新必殺技を覚えた！\n新必殺技「マニーフレンズ」\nヤミモブマニーに変身し、\n全てのステータス20%アップ\n状態異常耐性を20%アップ\n魔法会心率を20%アップする\n戦闘終了後、解除される');
};

/* Clean transient v180 effects even after a skipped/cancelled scene. */
const closeStoryBaseV180=closeStoryScene;
closeStoryScene=async function(...args){const sc=$('#storyScene');sc?.classList.remove('money-inner-v180','ace-summon-v180');$$('.castle-fx-v180,.money-inner-orbs-v180',sc||document).forEach(x=>x.remove());return closeStoryBaseV180(...args);};

window.__mobV180Runtime=true;
// UPDATE_V180_END
