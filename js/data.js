// MOB QUEST v42
// 未決定の初期ステータス・レベル成長・通常魔法威力・敵能力値・必殺技の数値倍率は
// 正式設定ではありません。テスト戦闘だけを成立させるため TEMP_BALANCE に隔離しています。
const TEMP_BALANCE = {
  base:{hp:420,mp:72,atk:38,mag:38,def:28,res:28,spd:28},
  enemy:{hpBase:1800,hpPerLevel:175,hpPerMember:350,atkBase:52,atkPerLevel:8.1,magBase:52,magPerLevel:8.0,defBase:52,defPerLevel:4.1,resBase:52,resPerLevel:4.0,spdBase:30,spdPerLevel:2.15},
  normalEnemy:{hpBase:850,hpPerLevel:105,hpPerMember:150,atkBase:35,atkPerLevel:6.2,magBase:30,magPerLevel:5.5,defBase:32,defPerLevel:3.2,resBase:30,resPerLevel:3.0,spdBase:26,spdPerLevel:2.0},
  playerGrowth:{
    yusha:{hp:54,mp:2.5,atk:7.6,mag:7.2,def:3.8,res:3.7,spd:2.8},
    pink:{hp:50,mp:2.8,atk:6.2,mag:6.5,def:4.5,res:4.4,spd:2.5},
    desert:{hp:56,mp:2.0,atk:8.0,mag:5.6,def:4.0,res:3.4,spd:2.4},
    nyoro:{hp:49,mp:2.2,atk:7.5,mag:6.5,def:3.3,res:3.4,spd:3.0},
    nekoku:{hp:55,mp:2.2,atk:7.7,mag:5.9,def:4.2,res:3.6,spd:2.6},
    jessie:{hp:48,mp:2.7,atk:7.0,mag:7.4,def:3.2,res:3.8,spd:3.4},
    denden:{hp:53,mp:2.4,atk:7.8,mag:6.4,def:3.7,res:3.6,spd:2.8},
    money:{hp:47,mp:3.2,atk:5.7,mag:8.0,def:3.1,res:4.8,spd:2.5},
    riro:{hp:50,mp:2.7,atk:7.0,mag:6.6,def:3.5,res:4.1,spd:3.1},
    tetsu:{hp:57,mp:2.0,atk:8.4,mag:4.8,def:4.3,res:3.2,spd:2.7},
    lilith:{hp:49,mp:3.1,atk:5.9,mag:8.3,def:3.4,res:4.6,spd:3.0},
    naraku:{hp:58,mp:2.7,atk:7.9,mag:7.8,def:4.0,res:4.0,spd:2.7},
  },
  bossSpecialEvery:3, critRate:.03, critPower:1.5, evadeMin:.02, evadeMax:.05,
  damageScale:{small:.78,medium:1.6,large:2.1,extra:2.45,extreme:2.72},
  healScale:{small:.16,medium:.26,large:.40},
  magicNote:'通常魔法の習得・消費MP・威力は未設定のためテスト用仮値'
};

const MOB_DATA = {
  elements: {
    '火': { label:'火', temporary:true, spell:'ホノマ', cost:10, power:1.35, frames:['skill/05.png','skill/06.png','skill/07.png','skill/08.png'] },
    '水': { label:'水', temporary:true, spell:'ネプマ', cost:10, power:1.35, frames:['skill/17.png','skill/18.png','skill/19.png','skill/17.png'] },
    '雷': { label:'雷', temporary:true, spell:'トルマ', cost:10, power:1.38, frames:['skill/29.png','skill/30.png','skill/31.png','skill/30.png'] },
    '地': { label:'地', temporary:true, spell:'ゴレマ', cost:10, power:1.38, frames:['skill/39.png','skill/40.png','skill/41.png','skill/42.png'] },
    '風': { label:'風', temporary:true, spell:'プテマ', cost:10, power:1.35, frames:['skill/49.png','skill/50.png','skill/51.png','skill/52.png'] },
    '光': { label:'光', temporary:true, spell:'ネオマ', cost:11, power:1.42, frames:['skill/54.png','skill/55.png','skill/57.png','skill/58.png','skill/56.png'] },
    '闇': { label:'闇', temporary:true, spell:'ミラマ', cost:11, power:1.42, frames:['skill/65.png','skill/66.png','skill/67.png','skill/68.png'] },
    '無': { label:'無', temporary:true, spell:'アノマ', cost:9, power:1.30, frames:[] }
  },

  players: [
    {
      id:'yusha', name:'モブ勇者', image:'play/01.png', symbol:'勇', attribute:'光', weapon:'大剣・杖', role:'勇者', passive:'あのヒーローにやっつけてもらおう',
      ults:[
        {name:'星降りの一振り',image:'ult/01.png',cost:18,kind:'damage',power:1.65,type:'physical',crit:.10,desc:'敵単体中ダメージ。10%で会心。'},
        {name:'特別だと信じる力',image:'ult/02.png',cost:20,kind:'selfAllBuff',power:0,desc:'自身の全能力20%UP＋被ダメージ10%軽減。'},
        {name:'エピソード・ジューマンジ',image:'ult/03.png',cost:30,kind:'jumanji',power:2.05,type:'magic',desc:'敵単体大ダメージ＋自身バフ＋敵デバフ。'},
        {name:'ネバー・エンディング・ブラスト',image:'ult/04.png',cost:38,kind:'lowHpBurst',power:2.55,type:'magic',desc:'敵単体極大ダメージ。味方残HPが少ないほど強化。'},
        {name:'読みかけの本',image:'play/13.png',cost:55,kind:'heroTransform',power:0,desc:'HP50%回復し「あのヒーロー」に変身。全能力30%UP。'}
      ]
    },
    {
      id:'pink', name:'モブピンク', image:'play/02.png', symbol:'桃', attribute:'無', weapon:'大剣', role:'サポート', passive:'支える力',
      ults:[
        {name:'シールドアタック',image:'ult/05.png',cost:16,kind:'shieldAttack',power:1.60,type:'physical',desc:'単体中ダメージ＋このターン自身20%軽減。'},
        {name:'癒しのピンクボンボン',image:'ult/06.png',cost:24,kind:'healCleanse',power:.18,desc:'味方全体小回復＋50%で状態異常解除。'},
        {name:'勇者のパートナー',image:'ult/07.png',cost:28,kind:'yushaGuardAoe',power:1.55,type:'magic',desc:'敵全体中ダメージ＋勇者の被ダメージ50%軽減。'},
        {name:'キングダムソルジャー',image:'ult/08.png',cost:34,kind:'teamGuardAoe',power:1.85,type:'physical',desc:'敵全体大ダメージ＋味方全員30%軽減。'}
      ]
    },
    {
      id:'desert', name:'モブデザート', image:'play/03.png', symbol:'砂', attribute:'地', weapon:'太刀', role:'物理', passive:'サバクノマモリビト',
      ults:[
        {name:'デザートブラウニー',image:'ult/09.png',cost:16,kind:'selfHealAttack',power:1.65,type:'physical',desc:'自身小回復＋単体中ダメージ。'},
        {name:'ゴールドフィッシュ',image:'ult/10.png',cost:22,kind:'goldAttack',power:2.00,type:'physical',desc:'単体大ダメージ＋トレーニング外ではゴールドを奪う。'},
        {name:'サンドドラグーン',image:'ult/11.png',cost:28,kind:'aoeSpeedDebuff',power:2.05,type:'magic',desc:'敵全体大ダメージ＋敵全体SPD小ダウン。'},
        {name:'スナノサバキ',image:'ult/12.png',cost:36,kind:'aoeDamage',power:2.65,type:'physical',desc:'敵全体極大ダメージ。'}
      ]
    },
    {
      id:'nyoro', name:'モブニョロ', image:'play/04.png', symbol:'炎', attribute:'火', weapon:'銃・杖', role:'攻撃', passive:'マグマスイミング',
      ults:[
        {name:'マグマケロ',image:'ult/13.png',cost:18,kind:'aoeBurn',power:1.60,type:'physical',chance:.10,desc:'敵全体中ダメージ＋10%でやけど。'},
        {name:'ヒノフルカヨウ',image:'ult/14.png',cost:24,kind:'aoeDamage',power:2.05,type:'physical',desc:'敵全体大ダメージ。'},
        {name:'ジューシーファイア',image:'ult/15.png',cost:28,kind:'burnAttack',power:2.15,type:'magic',chance:.30,desc:'大ダメージ＋30%でやけど。'},
        {name:'マグケロキングダム',image:'ult/16.png',cost:34,kind:'teamDefAoe',power:2.20,type:'physical',desc:'味方全体DEF小UP＋敵全体大ダメージ。'}
      ]
    },
    {
      id:'nekoku', name:'モブネコクー', image:'play/05.png', symbol:'水', attribute:'水', weapon:'槍', role:'戦士', passive:'癒しのプニプニ',
      ults:[
        {name:'ネコクージェット',image:'ult/17.png',cost:17,kind:'damage',power:1.65,type:'physical',sure:true,desc:'必中の単体中ダメージ。'},
        {name:'ネコトクジラ',image:'ult/18.png',cost:23,kind:'selfCleanseAttack',power:2.00,type:'physical',desc:'自身の状態異常解除＋単体大ダメージ。'},
        {name:'ネムレナイヨル',image:'ult/19.png',cost:29,kind:'sleepAttack',power:2.10,type:'magic',chance:.50,desc:'大ダメージ＋50%で眠り。'},
        {name:'ウォーターキル・ザ・ビート',image:'ult/20.png',cost:36,kind:'sleepAttack',power:2.60,type:'magic',chance:.10,desc:'極大ダメージ＋10%で眠り。'}
      ]
    },
    {
      id:'jessie', name:'モブジェシー', image:'play/06.png', symbol:'雷', attribute:'雷', weapon:'槍・銃', role:'雷撃', passive:'ダブルサンダー',
      ults:[
        {name:'サンダーロープ',image:'ult/21.png',cost:17,kind:'paralyzeAttack',power:1.62,type:'physical',chance:.10,desc:'中ダメージ＋10%でマヒ。'},
        {name:'ジャスティス+・スクリューブロー',image:'ult/22.png',cost:24,kind:'aoeSelfSpd',power:2.00,type:'physical',desc:'敵全体大ダメージ＋自身SPDアップ。'},
        {name:'プティハードライトニング',image:'ult/23.png',cost:28,kind:'playerSinglePlusAoe',power:2.20,aoePower:.72,type:'magic',desc:'敵単体大ダメージ＋敵全体小ダメージ。'},
        {name:'クライマックスチェイス',image:'ult/24.png',cost:36,kind:'playerSinglePlusAoeParalyze',power:2.10,aoePower:1.45,type:'physical',chance:.10,desc:'敵単体大ダメージ＋敵全体中ダメージ＋10%でマヒ。'}
      ]
    },
    {
      id:'denden', name:'モブデンデン', image:'play/07.png', symbol:'電', attribute:'雷', weapon:'銃', role:'連撃', passive:'デンデン・ムキムキ・カナリツヨイ',
      ults:[
        {name:'マシンガングミ',image:'ult/25.png',cost:18,kind:'multiAttack',power:.70,type:'physical',hits:[3,6],desc:'ランダムな敵へ3～6回の小ダメージ。'},
        {name:'イカシタイカヅチ',image:'ult/26.png',cost:25,kind:'teamRecovery',power:.16,desc:'味方全体HP・MP小回復＋DEF小UP。'},
        {name:'トリック・ザ・デンデン',image:'ult/27.png',cost:29,kind:'aoeStun',power:2.10,type:'physical',chance:.10,desc:'敵全体大ダメージ＋10%でひるみ。'},
        {name:'デンデンサンダーボルト',image:'ult/28.png',cost:37,kind:'aoeDamage',power:2.68,type:'magic',desc:'敵全体極大ダメージ。'}
      ]
    },
    {
      id:'money', name:'モブマニー', image:'play/08.png', symbol:'光', attribute:'光', weapon:'杖', role:'回復', passive:'マニーは海を渡る',
      ults:[
        {name:'バブルネオン',image:'ult/29.png',cost:18,kind:'selfRecoveryAttack',power:1.70,type:'magic',desc:'単体中ダメージ＋自身HP/MP小回復。'},
        {name:'レッドブルーボム',image:'ult/30.png',cost:27,kind:'damage',power:2.20,type:'magic',desc:'火・水・光を持つ単体大ダメージ。'},
        {name:'マニーズハウス',image:'ult/31.png',cost:30,kind:'teamHealGuard',power:.28,desc:'味方全体中回復＋被ダメージ10%軽減。'},
        {name:'レトロミラージュマニー',image:'ult/32.png',cost:42,kind:'fullHealBarrier',power:0,desc:'自身全回復＋味方全体に1回無効バリア。'}
      ]
    },
    {
      id:'riro', name:'モブリーロ', image:'play/09.png', symbol:'風', attribute:'風', weapon:'槍・太刀', role:'万能', passive:'アーティスト・マインド',
      ults:[
        {name:'トゥエルラッシュ',image:'ult/33.png',cost:16,kind:'damage',power:1.65,type:'physical',desc:'単体中ダメージ。'},
        {name:'タロ・アンド・リーロ',image:'ult/34.png',cost:25,kind:'healCleanse',power:.26,desc:'味方全体中回復＋50%で状態異常解除。'},
        {name:'ディスコスパイラル',image:'ult/35.png',cost:28,kind:'teamAtkAttack',power:2.10,type:'physical',desc:'味方全体ATK小UP＋単体大ダメージ。'},
        {name:'リーロ・トゥ・ステイシー',image:'ult/36.png',cost:38,kind:'healAttack',power:2.60,type:'physical',heal:.24,desc:'味方全体中回復＋単体極大ダメージ。'}
      ]
    },
    {
      id:'tetsu', name:'モブテツ', image:'play/10.png', symbol:'鉄', attribute:'地', weapon:'太刀', role:'剣豪', passive:'テツの意志',
      ults:[
        {name:'モブテツ一閃',image:'ult/37.png',cost:18,kind:'aoeStun',power:1.75,type:'physical',chance:.10,desc:'敵全体中ダメージ＋10%でひるみ。'},
        {name:'モブテツ流茄子落とし',image:'ult/38.png',cost:23,kind:'damage',power:2.20,type:'physical',crit:.20,priority:true,desc:'先制大ダメージ。20%で会心。'},
        {name:'モブテツ一文字',image:'ult/39.png',cost:30,kind:'aoeStun',power:2.25,type:'physical',chance:.50,desc:'敵全体大ダメージ＋50%でひるみ。'},
        {name:'鉄の極意',image:'ult/40.png',cost:38,kind:'tetsuFinal',power:2.72,type:'physical',desc:'自身ATK小UP＋敵DEFダウン＋極大ダメージ。'}
      ]
    },
    {
      id:'lilith', name:'モブリリス', image:'play/14.png', symbol:'薔', attribute:'闇', weapon:'杖', role:'魔法', passive:'ウルモブリリス',
      ults:[
        {name:'ブラックホール',image:'ult/41.png',cost:22,kind:'aoeSpeedDebuff',power:1.80,type:'magic',desc:'敵全体中ダメージ＋敵全体SPDダウン。'},
        {name:'リリス四姉妹',image:'ult/42.png',cost:30,kind:'multiAttack',power:.68,type:'magic',hits:[4,4],desc:'4属性の中ダメージを4回。'},
        {name:'薔薇の鼓動',image:'ult/43.png',cost:36,kind:'multiAttack',power:.58,type:'magic',hits:[6,6],desc:'闇の中ダメージを6回。'},
        {name:'ローズ・ウォール・ストリート',image:'ult/44.png',cost:44,kind:'healAoeStun',power:2.25,type:'magic',heal:.25,chance:.30,desc:'味方全体HP/MP中回復＋敵全体大ダメージ＋30%でひるみ。'}
      ]
    },
    {
      id:'naraku', name:'モブナラク', image:'play/12.png', symbol:'魔', attribute:'闇', weapon:'太刀・大剣', role:'魔王系', passive:'魔王の系譜',
      ults:[
        {name:'ミラモブポイズン',image:'ult/45.png',cost:22,kind:'aoePoison',power:1.90,type:'physical',chance:.30,desc:'敵全体中ダメージ＋30%で毒。'},
        {name:'ガーディアンシールド',image:'ult/46.png',cost:25,kind:'narakuShield',power:0,desc:'自身20%軽減＋味方全体10%軽減。'},
        {name:'フル・ドラゴンフレイム',image:'ult/47.png',cost:34,kind:'selfAtkAoe',power:2.30,type:'magic',desc:'自身ATK小UP＋敵全体に火・闇の大ダメージ。'},
        {name:'マスター・オブ・ピラミッド',image:'ult/48.png',cost:44,kind:'aoeDamage',power:2.78,type:'magic',desc:'敵全体極大ダメージ。'}
      ]
    }
  ],

  bosses: [
    {id:'hawk',name:'モブホーク',stage:'草原',attribute:'風',image:'boss/01.png',symbol:'鷹',special:'ホークダイブ',kind:'aoe',power:1.05,bg:'back/sougen4.png',fallbackBg:'back/sougen.png'},
    {id:'mira',name:'ミラモブ',stage:'砂漠',attribute:'闇',image:'boss/03.png',symbol:'毒',special:'ミラモブポイズン',kind:'poisonSingle',power:1.35,bg:'back/sabaku4.png',fallbackBg:'back/sabaku.png'},
    {id:'guardian',name:'モブガーディアン',stage:'田舎町',attribute:'地',image:'boss/05.png',symbol:'盾',special:'ガーディアンシールド',kind:'shield',power:0,bg:'back/inaka4.png',fallbackBg:'back/inaka.png'},
    {id:'neon',name:'モブネオンバルス',stage:'ネオン街',attribute:'光',image:'boss/07.png',symbol:'光',special:'ネオンボム',kind:'singlePlusAoe',power:1.35,bg:'back/neon4.png',fallbackBg:'back/neon.png'},
    {id:'ace',name:'モブエース',stage:'ネオン街',attribute:'闇',image:'boss/08.png',symbol:'紫',special:'紫雷撃',kind:'single',power:1.65,bg:'back/neon4.png',fallbackBg:'back/neon.png'},
    {id:'dragon',name:'モブドラゴン',stage:'マグマ',attribute:'火',image:'boss/09.png',symbol:'竜',special:'ドラゴンフレイム',kind:'aoe',power:1.48,bg:'back/magma4.png',fallbackBg:'back/magma.png'},
    {id:'nepu',name:'モブネプチューン',stage:'海底',attribute:'水',image:'boss/008.png',symbol:'海',special:'ネプチューン・トライデント',kind:'aoe',power:1.50,bg:'back/sea4.png',fallbackBg:'back2/07.png'},
    {id:'hawk2',name:'モブホークⅡ',stage:'草原Ⅱ',attribute:'風',image:'boss/02.png',symbol:'鷹',special:'スクリューホークダイブ',kind:'aoe',power:1.52,bg:'back/sougen4.png',fallbackBg:'back/sougen.png'},
    {id:'debuff',name:'モブデーバフ',stage:'部族村',attribute:'地',image:'boss/11.png',symbol:'岩',special:'デストロイボム',kind:'single',power:1.60,bg:'back/buzok4.png',fallbackBg:'back2/08.png'},
    {id:'debuff2',name:'モブデーバフ第二形態',stage:'部族村',attribute:'地',image:'boss/12.png',symbol:'岩',special:'デストロイボム',kind:'single',power:1.75,bg:'back/buzok4.png',fallbackBg:'back2/08.png'},
    {id:'berserk',name:'モブバーサク',stage:'部族村',attribute:'地',image:'boss/13.png',symbol:'獣',special:'デストロイボム',kind:'single',power:1.82,bg:'back/buzok4.png',fallbackBg:'back2/08.png'},
    {id:'berserk2',name:'モブバーサク第二形態',stage:'部族村',attribute:'地',image:'boss/14.png',symbol:'獣',special:'デストロイボム',kind:'single',power:1.95,bg:'back/buzok4.png',fallbackBg:'back2/08.png'},
    {id:'dendenBoss',name:'モブデンデン',stage:'田舎町Ⅱ',attribute:'雷',image:'boss/15.png',symbol:'電',special:'マシンガングミ',kind:'multi',power:.78,hits:[3,6],bg:'back/inaka4.png',fallbackBg:'back/inaka.png'},
    {id:'umiDenden',name:'ウミデンデン',stage:'田舎町Ⅱ',attribute:'雷',image:'boss/16.png',symbol:'海',special:'マシンガングミ',kind:'multi',power:.88,hits:[3,6],bg:'back/inaka4.png',fallbackBg:'back/inaka.png'},
    {id:'moneyBoss',name:'モブマニー',stage:'ネオン街Ⅱ',attribute:'光',image:'boss/17.png',symbol:'銭',special:'バブルネオン',kind:'healSingle',power:1.55,bg:'back/neon4.png',fallbackBg:'back/neon.png'},
    {id:'neoMaster',name:'モブネオマスター',stage:'ネオン街Ⅱ',attribute:'光',image:'boss/18.png',symbol:'光',special:'バブルネオン',kind:'healSingle',power:1.72,bg:'back/neon4.png',fallbackBg:'back/neon.png'},
    {id:'dragon2',name:'モブドラゴンⅡ',stage:'マグマⅡ',attribute:'火',image:'boss/10.png',symbol:'竜',special:'ドラゴンフレイム',kind:'aoe',power:1.72,bg:'back/magma4.png',fallbackBg:'back/magma.png'},
    {id:'gidora',name:'モブギドラ',stage:'マグマⅡ',attribute:'火',image:'boss/19.png',symbol:'龍',special:'フル・ドラゴンフレイム',kind:'buffAoe',power:1.80,bg:'back/magma4.png',fallbackBg:'back/magma.png'},
    {id:'dorafara',name:'ドラファラモブ',stage:'砂漠Ⅱ',attribute:'火・闇',image:'boss/20.png',symbol:'炎',special:'フル・ドラゴンフレイム',kind:'buffAoe',power:1.90,bg:'back/sabaku4.png',fallbackBg:'back/sabaku.png'},
    {id:'gladi',name:'グラディモブ',stage:'魔王城',attribute:'火',image:'boss/39.png',symbol:'将',special:'将軍進撃',kind:'doubleAoe',power:1.0,bg:'back/maoh4.png',fallbackBg:'back2/09.png'},
    {id:'lilithBoss',name:'モブリリス',stage:'魔王城',attribute:'闇',image:'boss/21.png',symbol:'薔',special:'ブラックホール',kind:'aoe',power:1.85,bg:'back/maoh4.png',fallbackBg:'back2/09.png'},
    {id:'maou',name:'モブ魔王',stage:'魔王城',attribute:'闇',image:'boss/22.png',symbol:'王',special:'マスター・オブ・ピラミッド',kind:'aoe',power:2.12,bg:'back/maoh4.png',fallbackBg:'back2/09.png'},
    {id:'natalie',name:'モブナタリー',stage:'マトリックス',attribute:'光',image:'boss/23.png',symbol:'光',special:'ダブルエナジー',kind:'burnSingle',power:1.75,bg:'back/matrix4.png',fallbackBg:'back2/10.png'},
    {id:'smith',name:'モブスミス',stage:'マトリックス',attribute:'風',image:'boss/24.png',symbol:'眼',special:'ゴールデン・アイ',kind:'multiFixed',power:1.38,hits:[3,3],bg:'back/matrix4.png',fallbackBg:'back2/10.png'},
    {id:'unlock',name:'モブアンロック',stage:'監獄',attribute:'地',image:'boss/25.png',symbol:'鎖',special:'悪意の行進',kind:'aoe',power:2.18,bg:'back/kangoku4.png',fallbackBg:'back2/11.png'},
    {id:'yamigami',name:'モブヤミガミ',stage:'魔界',attribute:'火',image:'boss/26.png',symbol:'闇',special:'キャロット・ファイヤー',kind:'stunSingle',power:1.75,bg:'back/makai4.png',fallbackBg:'back2/12.png'},
    {id:'yamigami2',name:'モブヤミガミ第二形態',stage:'魔界',attribute:'火',image:'boss/27.png',symbol:'闇',special:'ダブル・キャロット・ファイヤー',kind:'doubleSingleStun',power:1.32,bg:'back/makai4.png',fallbackBg:'back2/12.png'},
    {id:'yamigamiDark',name:'モブヤミガミ・闇',stage:'魔界',attribute:'闇',image:'boss/28.png',symbol:'闇',special:'キャロット・バニッシュ',kind:'single',power:2.12,bg:'back/makai4.png',fallbackBg:'back2/12.png'},
    {id:'enma',name:'モブ閻魔',stage:'魔界',attribute:'闇・火',image:'boss/30.png',symbol:'閻',special:'ヒノカグヅチ',kind:'single',power:2.25,bg:'back/makai4.png',fallbackBg:'back2/12.png'},
    {id:'enma2',name:'モブ閻魔・第二形態',stage:'魔界',attribute:'闇・火',image:'boss/31.png',symbol:'閻',special:'レンゴクカグヅチ',kind:'aoe',power:2.18,bg:'back/makai4.png',fallbackBg:'back2/12.png'},
    {id:'enmaFinal',name:'モブ閻魔・最終形態',stage:'魔界',attribute:'闇・火',image:'boss/32.png',symbol:'閻',special:'ゴウカノシンパン',kind:'aoeStun',power:2.35,bg:'back/makai4.png',fallbackBg:'back2/12.png'}
  ],

  adventure: {
    id:'grassland', name:'草原', bossId:'hawk', level:12,
    areas:[
      {name:'草原・入口',bg:'back/sougen.png',fallback:'back/sougen4.png',explore:'やわらかな風が吹いている。草むらの奥から気配を感じる。'},
      {name:'草原・小道',bg:'back/sougen2.png',fallback:'back/sougen.png',explore:'足跡を発見した！この先にモンスターがいるようだ。'},
      {name:'草原・高台',bg:'back/sougen3.png',fallback:'back/sougen.png',explore:'高台から巨大な影が飛び立った。ボスの縄張りは近い。'},
      {name:'草原・モブホークの縄張り',bg:'back/sougen4.png',fallback:'back/sougen.png',explore:'強烈な風圧！モブホークが姿を現した！'}
    ],
    normalEnemies:[
      {name:'草原モンスター',symbol:'草',attribute:'風',power:.88},
      {name:'草原の強敵',symbol:'牙',attribute:'地',power:.98},
      {name:'草原の番人',symbol:'翼',attribute:'風',power:1.06}
    ]
  }
};

// ===== MOB QUEST v44 : player base-growth targets =====
// Lv99 strong targets: HP/MP 1200, ATK/SPD 600, DEF 550, MAG 580, MND 570.
// A weak aptitude is about 120 below the strong target. Lv120 adds roughly +300 HP/MP and +100 to other stats.
TEMP_BALANCE.playerTargets={
  yusha:{hp:[120,1140,1440],mp:[100,1140,1440],atk:[45,600,700],mag:[43,580,680],def:[38,490,590],res:[39,510,610],spd:[40,540,640]},
  pink:{hp:[120,1140,1440],mp:[100,1140,1440],atk:[35,480,580],mag:[39,520,620],def:[42,550,650],res:[43,570,670],spd:[35,480,580]},
  desert:{hp:[130,1200,1500],mp:[90,1080,1380],atk:[45,600,700],mag:[35,460,560],def:[38,490,590],res:[35,450,550],spd:[40,540,640]},
  nyoro:{hp:[120,1140,1440],mp:[100,1140,1440],atk:[45,600,700],mag:[39,520,620],def:[34,430,530],res:[35,450,550],spd:[45,600,700]},
  nekoku:{hp:[130,1200,1500],mp:[90,1080,1380],atk:[45,600,700],mag:[35,460,560],def:[42,550,650],res:[39,510,610],spd:[40,540,640]},
  jessie:{hp:[110,1080,1380],mp:[100,1140,1440],atk:[40,540,640],mag:[43,580,680],def:[34,430,530],res:[39,510,610],spd:[45,600,700]},
  denden:{hp:[120,1140,1440],mp:[100,1140,1440],atk:[45,600,700],mag:[39,520,620],def:[38,490,590],res:[39,510,610],spd:[45,600,700]},
  money:{hp:[110,1080,1380],mp:[110,1200,1500],atk:[35,480,580],mag:[43,580,680],def:[34,430,530],res:[43,570,670],spd:[40,540,640]},
  riro:{hp:[120,1140,1440],mp:[100,1140,1440],atk:[40,540,640],mag:[39,520,620],def:[38,490,590],res:[43,570,670],spd:[45,600,700]},
  tetsu:{hp:[130,1200,1500],mp:[90,1080,1380],atk:[45,600,700],mag:[35,460,560],def:[42,550,650],res:[35,450,550],spd:[40,540,640]},
  lilith:{hp:[110,1080,1380],mp:[110,1200,1500],atk:[35,480,580],mag:[43,580,680],def:[38,490,590],res:[43,570,670],spd:[40,540,640]},
  naraku:{hp:[130,1200,1500],mp:[100,1140,1440],atk:[45,600,700],mag:[43,580,680],def:[38,490,590],res:[43,570,670],spd:[40,540,640]}
};

// ===== MOB QUEST v25 : enemy catalog + adventure route through Magma II =====
// Source-defined levels/skills are preserved. Undefined skills use temporary elemental AI in game.js.
// Enemy stats are generated from category profiles and individual role modifiers so 1–4 enemy groups stay playable.
TEMP_BALANCE.enemyProfiles={
  normal:{hpBase:80,hpPerLevel:9,hpQuad:.10,atkBase:18,atkPerLevel:3.3,atkQuad:.002,magBase:18,magPerLevel:3.25,magQuad:.002,defBase:15,defPerLevel:2.6,defQuad:.002,resBase:15,resPerLevel:2.6,resQuad:.002,spdBase:16,spdPerLevel:3.2,spdQuad:.001},
  elite:{hpBase:220,hpPerLevel:28,hpQuad:.42,atkBase:24,atkPerLevel:3.65,atkQuad:.003,magBase:24,magPerLevel:3.60,magQuad:.003,defBase:20,defPerLevel:2.9,defQuad:.0025,resBase:20,resPerLevel:2.9,resQuad:.0025,spdBase:18,spdPerLevel:3.5,spdQuad:.0015},
  boss:{hpBase:420,hpPerLevel:42,hpQuad:.90,atkBase:30,atkPerLevel:4.0,atkQuad:.004,magBase:30,magPerLevel:4.0,magQuad:.004,defBase:26,defPerLevel:3.15,defQuad:.003,resBase:26,resPerLevel:3.15,resQuad:.003,spdBase:20,spdPerLevel:3.8,spdQuad:.0018}
};
Object.assign(MOB_DATA.elements['火'],{cost:9,power:1.18});
Object.assign(MOB_DATA.elements['水'],{cost:9,power:1.18});
Object.assign(MOB_DATA.elements['雷'],{cost:10,power:1.20});
Object.assign(MOB_DATA.elements['地'],{cost:10,power:1.20});
Object.assign(MOB_DATA.elements['風'],{cost:9,power:1.18});
Object.assign(MOB_DATA.elements['光'],{cost:11,power:1.22});
Object.assign(MOB_DATA.elements['闇'],{cost:11,power:1.22});
Object.assign(MOB_DATA.elements['無'],{cost:8,power:1.12});

const V25_ENEMIES=[
  // 砂漠Ⅱ
  {id:'d2-mummy',name:'モブミイラ',stage:'砂漠Ⅱ',category:'normal',attribute:'地',image:'enemy/21.png',symbol:'包',levelMin:63,levelMax:67,mods:{hp:1.08}},
  {id:'d2-turco',name:'モブトルコ',stage:'砂漠Ⅱ',category:'normal',attribute:'地',image:'enemy/22.png',symbol:'地',levelMin:63,levelMax:68,mods:{atk:1.06}},
  {id:'d2-yamikamen',name:'モブヤミカーメン',stage:'砂漠Ⅱ',category:'normal',attribute:'闇',image:'enemy/23.png',symbol:'闇',levelMin:63,levelMax:66,mods:{mag:1.10}},
  {id:'d2-gimmick',name:'モブギミック',stage:'砂漠Ⅱ',category:'normal',attribute:'地',image:'enemy/24.png',symbol:'宝',levelMin:63,levelMax:66,rare:true,coinReward:10000,mods:{hp:.92,spd:1.16}},
  {id:'d2-adventure',name:'モブアドベンチャー',stage:'砂漠Ⅱ',category:'normal',attribute:'火',image:'enemy/25.png',symbol:'火',levelMin:63,levelMax:67,mods:{atk:1.08}},
  {id:'d2-lizard',name:'モブスナトカゲ',stage:'砂漠Ⅱ',category:'normal',attribute:'地',image:'enemy/26.png',symbol:'蜥',levelMin:65,levelMax:67,mods:{spd:1.12}},
  {id:'d2-nekomummy',name:'モブネコミイラ',stage:'砂漠Ⅱ',category:'normal',attribute:'地',image:'enemy/27.png',symbol:'猫',levelMin:62,levelMax:65,mods:{res:1.08}},
  {id:'d2-akarock',name:'モブアカロック',stage:'砂漠Ⅱ',category:'normal',attribute:'地',image:'enemy/28.png',symbol:'岩',levelMin:64,levelMax:64,mods:{hp:1.14,def:1.14,spd:.85}},
  {id:'d2-sharty',name:'モブシャーティー',stage:'砂漠Ⅱ',category:'normal',attribute:'光',image:'enemy/29.png',symbol:'光',levelMin:63,levelMax:65,tempAi:'heal'},
  {id:'d2-poison',name:'モブポイズン',stage:'砂漠Ⅱ',category:'normal',attribute:'闇',image:'enemy/30.png',symbol:'毒',levelMin:66,levelMax:66,special:'ポイズンクロー',kind:'poisonSingle',power:.72,chance:.10,skillType:'physical'},
  {id:'d2-deathhead',name:'モブデスヘッド',stage:'砂漠Ⅱ',category:'normal',attribute:'闇',image:'enemy/31.png',symbol:'骸',levelMin:68,levelMax:68,special:'デスカーテン',kind:'single',power:.72,skillElement:'闇',skillType:'magic'},
  {id:'boss-mira-d2',name:'ミラモブ',stage:'砂漠Ⅱ',category:'boss',attribute:'闇',image:'boss/03.png',symbol:'毒',levelMin:66,levelMax:66,bossId:'miraD2',special:'ミラモブポイズン',kind:'poisonSingle',power:1.25,chance:.50,skillType:'physical'},
  {id:'boss-mira2-d2',name:'ミラモブⅡ',stage:'砂漠Ⅱ',category:'boss',attribute:'闇',image:'boss/04.png',symbol:'毒',levelMin:72,levelMax:72,bossId:'mira2D2',special:'ミラモブポイズン',kind:'poisonSingle',power:1.35,chance:.50,skillType:'physical'},
  {id:'d2-slamummy',name:'モブスラミイラ',stage:'砂漠Ⅱ',category:'elite',attribute:'水',image:'enemy/33.png',symbol:'斧',levelMin:63,levelMax:63,special:'スライムアックス',kind:'stunSingle',power:.72,chance:.20,skillType:'physical'},
  {id:'d2-mirabuster',name:'モブミラバスター',stage:'砂漠Ⅱ',category:'elite',attribute:'闇',image:'enemy/36.png',symbol:'闇',levelMin:70,levelMax:70,special:'バニッシュフレイム',kind:'aoeStunChance',power:.62,chance:.10,skillType:'magic'},
  {id:'d2-twinsoul',name:'モブツインソウル',stage:'砂漠Ⅱ',category:'elite',attribute:'雷',image:'enemy/35.png',symbol:'雷',levelMin:66,levelMax:66,special:'ハイタッチサンダー',kind:'aoe',power:1.02,skillElement:'雷',skillType:'magic'},
  {id:'d2-miraearth',name:'モブミラアース',stage:'砂漠Ⅱ',category:'elite',attribute:'地',image:'enemy/36.png',symbol:'地',levelMin:70,levelMax:70,special:'グラビディクラッシュ',kind:'singleSpdDown',power:1.08,debuff:.12,skillElement:'地',skillType:'physical'},
  {id:'d2-mirakarami',name:'モブミラカラミ',stage:'砂漠Ⅱ',category:'elite',attribute:'火',image:'enemy/36.png',symbol:'火',levelMin:70,levelMax:70,special:'ソウルフレイム',kind:'aoe',power:1.02,skillElement:'火',skillType:'magic'},
  {id:'d2-miranight',name:'モブミラナイト',stage:'砂漠Ⅱ',category:'elite',attribute:'水',image:'enemy/36.png',symbol:'水',levelMin:70,levelMax:70,special:'シャドウオーラスパイラル',kind:'single',power:1.08,skillElement:'水',skillType:'magic'},
  {id:'d2-miratime',name:'モブミラタイム',stage:'砂漠Ⅱ',category:'elite',attribute:'光',image:'enemy/36.png',symbol:'時',levelMin:70,levelMax:70,special:'デザート・ストーム・タイム',kind:'aoeParalyzeChance',power:.64,chance:.20,skillElement:'光',skillType:'magic'},
  {id:'boss-dorafara',name:'ドラファラモブ',stage:'砂漠Ⅱ',category:'boss',attribute:'火・闇',image:'boss/20.png',symbol:'炎',levelMin:78,levelMax:78,bossId:'dorafara',special:'フル・ドラゴンフレイム',kind:'buffAoe',power:1.55,skillElement:'火・闇',skillType:'magic',specialOptions:[{special:'ミラモブポイズン',kind:'poisonSingle',power:1.25,chance:.50,skillType:'physical'},{special:'フル・ドラゴンフレイム',kind:'buffAoe',power:1.55,skillElement:'火・闇',skillType:'magic'}]},
  // 魔王城
  {id:'c-picodark',name:'モブピコダーク',stage:'魔王城',category:'normal',attribute:'闇',image:'enemy/131.png',symbol:'闇',levelMin:72,levelMax:77},
  {id:'c-devilslime',name:'モブデビルスライム',stage:'魔王城',category:'normal',attribute:'水',image:'enemy/132.png',symbol:'水',levelMin:73,levelMax:75},
  {id:'c-darkgob',name:'モブダークゴブ',stage:'魔王城',category:'normal',attribute:'闇',image:'enemy/133.png',symbol:'闇',levelMin:73,levelMax:78,mods:{atk:1.08}},
  {id:'c-punirider',name:'モブプニライダー',stage:'魔王城',category:'normal',attribute:'水',image:'enemy/134.png',symbol:'水',levelMin:73,levelMax:76,mods:{spd:1.08}},
  {id:'c-minibook',name:'モブミニブック',stage:'魔王城',category:'normal',attribute:'光',image:'enemy/135.png',symbol:'本',levelMin:73,levelMax:77,mods:{mag:1.10}},
  {id:'c-loopmagic',name:'モブループマジック',stage:'魔王城',category:'normal',attribute:'闇',image:'enemy/136.png',symbol:'魔',levelMin:75,levelMax:77,mods:{mag:1.12}},
  {id:'c-hellshadow',name:'モブヘルシャドウ',stage:'魔王城',category:'normal',attribute:'火',image:'enemy/137.png',symbol:'炎',levelMin:72,levelMax:75,mods:{spd:1.10}},
  {id:'c-metasword',name:'モブメタソード',stage:'魔王城',category:'normal',attribute:'闇',image:'enemy/138.png',symbol:'剣',levelMin:74,levelMax:77,mods:{atk:1.12,def:1.08}},
  {id:'c-cockpit',name:'モブコクピット',stage:'魔王城',category:'normal',attribute:'闇',image:'enemy/139.png',symbol:'機',levelMin:73,levelMax:75,mods:{def:1.10,res:1.10}},
  {id:'c-assassin',name:'モブアサシン',stage:'魔王城',category:'normal',attribute:'闇',image:'enemy/140.png',symbol:'刃',levelMin:76,levelMax:76,special:'ダークウィンドウ',kind:'aoe',power:.62,skillElement:'闇',skillType:'physical',mods:{spd:1.16}},
  {id:'c-deathspear',name:'モブデススピア',stage:'魔王城',category:'normal',attribute:'闇',image:'enemy/141.png',symbol:'槍',levelMin:78,levelMax:78,special:'デススパイラル',kind:'single',power:1.08,skillElement:'闇',skillType:'physical',mods:{atk:1.12}},
  {id:'c-killwitch',name:'モブキラウィッチ',stage:'魔王城',category:'elite',attribute:'闇',image:'enemy/146.png',symbol:'魔',levelMin:80,levelMax:80,special:'ウィッチ・スウィート・ベリー',kind:'poisonSingle',power:1.08,chance:.40,skillType:'magic'},
  {id:'c-succubus',name:'モブサキュバス',stage:'魔王城',category:'elite',attribute:'火',image:'enemy/147.png',symbol:'炎',levelMin:80,levelMax:80,special:'プティ・ヘルファイヤ',kind:'burnSingle',power:1.08,chance:.50,skillType:'magic'},
  {id:'c-miraheld',name:'モブミラヘルド',stage:'魔王城',category:'normal',attribute:'火',image:'enemy/143.png',symbol:'炎',levelMin:75,levelMax:75,special:'コーク・ハイ・フレイム',kind:'stunSingle',power:1.05,chance:.20,skillType:'magic'},
  {id:'boss-gladi',name:'グラディモブ',stage:'魔王城',category:'boss',attribute:'火',image:'boss/39.png',symbol:'将',levelMin:82,levelMax:82,bossId:'gladi',special:'将軍進撃',kind:'doubleAoe',power:.72,skillType:'physical'},
  {id:'c-yamieater',name:'モブヤミイーター',stage:'魔王城',category:'normal',attribute:'闇',image:'enemy/144.png',symbol:'闇',levelMin:75,levelMax:75,special:'デビルスラッシュ',kind:'single',power:1.05,skillType:'physical'},
  {id:'c-boukun',name:'モブボウクン',stage:'魔王城',category:'normal',attribute:'闇',image:'enemy/145.png',symbol:'拳',levelMin:75,levelMax:75,special:'メトロブロウ',kind:'single',power:1.05,skillType:'physical'},
  {id:'boss-lilith-castle',name:'モブリリス',stage:'魔王城',category:'boss',attribute:'闇',image:'boss/21.png',symbol:'薔',levelMin:85,levelMax:85,bossId:'lilithBoss',special:'ブラックホール',kind:'healAoeBoss',power:1.25,heal:.06,skillType:'magic'},
  {id:'boss-maou-castle',name:'モブ魔王',stage:'魔王城',category:'boss',attribute:'闇',image:'boss/22.png',symbol:'王',levelMin:95,levelMax:95,bossId:'maou',special:'マスター・オブ・ピラミッド',kind:'aoe',power:1.72,skillType:'magic',mods:{hp:1.12,mag:1.08}}
];
MOB_DATA.enemyCatalog.push(...V25_ENEMIES);
MOB_DATA.adventureWorlds.push(
  {id:'desert2',name:'砂漠Ⅱ',fieldFallback:'back2/03.png',normalIds:['d2-mummy','d2-turco','d2-yamikamen','d2-gimmick','d2-adventure','d2-lizard','d2-nekomummy','d2-akarock','d2-sharty','d2-poison','d2-deathhead'],areas:[
    {name:'AREA 1',bg:'back/sabaku.png',boss:[{id:'boss-mira-d2',level:66}],nextWave:[{id:'boss-mira2-d2',level:72}]},
    {name:'AREA 2',bg:'back/sabaku2.png',boss:[{id:'d2-slamummy',level:63},{id:'d2-mirabuster',level:70},{id:'d2-twinsoul',level:66}]},
    {name:'AREA 3',bg:'back/sabaku3.png',boss:[{id:'d2-miraearth',level:70},{id:'d2-mirakarami',level:70}],nextWave:[{id:'d2-miranight',level:70},{id:'d2-miratime',level:70}]},
    {name:'AREA 4',bg:'back/sabaku4.png',boss:[{id:'boss-dorafara',level:78}]}
  ]},
  {id:'demonCastle',name:'魔王城',fieldFallback:'back2/09.png',normalIds:['c-picodark','c-devilslime','c-darkgob','c-punirider','c-minibook','c-loopmagic','c-hellshadow','c-metasword','c-cockpit','c-assassin','c-deathspear'],areas:[
    {name:'AREA 1',bg:'back/maoh.png',boss:[{id:'c-killwitch',level:80},{id:'c-succubus',level:80}]},
    {name:'AREA 2',bg:'back/maoh2.png',boss:[{id:'c-miraheld',level:75},{id:'boss-gladi',level:82},{id:'c-yamieater',level:75}]},
    {name:'AREA 3',bg:'back/maoh3.png',boss:[{id:'c-boukun',level:75},{id:'boss-lilith-castle',level:85},{id:'c-boukun',level:75}]},
    {name:'AREA 4',bg:'back/maoh4.png',boss:[{id:'boss-maou-castle',level:95}]}
  ]}
);
