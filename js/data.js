// MOB QUEST v4
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
    jerry:{hp:48,mp:2.7,atk:7.0,mag:7.4,def:3.2,res:3.8,spd:3.4},
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
        {name:'勇者のパートナー',image:'ult/07.png',cost:28,kind:'yushaGuardAttack',power:1.55,type:'magic',desc:'敵単体中ダメージ＋勇者の被ダメージ50%軽減。'},
        {name:'キングダムソルジャー',image:'ult/08.png',cost:34,kind:'teamGuardAttack',power:1.85,type:'physical',desc:'敵単体大ダメージ＋味方全員30%軽減。'}
      ]
    },
    {
      id:'desert', name:'モブデザート', image:'play/03.png', symbol:'砂', attribute:'地', weapon:'太刀', role:'物理', passive:'サバクノマモリビト',
      ults:[
        {name:'デザートブラウニー',image:'ult/09.png',cost:16,kind:'selfHealAttack',power:1.65,type:'physical',desc:'自身小回復＋単体中ダメージ。'},
        {name:'ゴールドフィッシュ',image:'ult/10.png',cost:22,kind:'goldAttack',power:2.00,type:'physical',desc:'単体大ダメージ＋トレーニング外ではゴールドを奪う。'},
        {name:'サンドドラグーン',image:'ult/11.png',cost:28,kind:'speedDebuffAttack',power:2.05,type:'magic',desc:'単体大ダメージ＋敵SPD小ダウン。'},
        {name:'スナノサバキ',image:'ult/12.png',cost:36,kind:'damage',power:2.65,type:'physical',desc:'敵単体極大ダメージ。'}
      ]
    },
    {
      id:'nyoro', name:'モブニョロ', image:'play/04.png', symbol:'炎', attribute:'火', weapon:'銃・杖', role:'攻撃', passive:'マグマスイミング',
      ults:[
        {name:'マグマケロ',image:'ult/13.png',cost:18,kind:'burnAttack',power:1.60,type:'physical',chance:.10,desc:'中ダメージ＋10%でやけど。'},
        {name:'ヒノフルカヨウ',image:'ult/14.png',cost:24,kind:'damage',power:2.05,type:'physical',desc:'敵単体大ダメージ。'},
        {name:'ジューシーファイア',image:'ult/15.png',cost:28,kind:'burnAttack',power:2.15,type:'magic',chance:.30,desc:'大ダメージ＋30%でやけど。'},
        {name:'マグケロキングダム',image:'ult/16.png',cost:34,kind:'teamDefAttack',power:2.20,type:'physical',desc:'味方全体DEF小UP＋敵単体大ダメージ。'}
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
      id:'jerry', name:'モブジェリー', image:'play/06.png', symbol:'雷', attribute:'雷', weapon:'槍・銃', role:'雷撃', passive:'ダブルサンダー',
      ults:[
        {name:'サンダーロープ',image:'ult/21.png',cost:17,kind:'paralyzeAttack',power:1.62,type:'physical',chance:.10,desc:'中ダメージ＋10%でマヒ。'},
        {name:'ジャスティス+・スクリューブロー',image:'ult/22.png',cost:24,kind:'selfSpdAttack',power:2.00,type:'physical',desc:'大ダメージ＋自身SPDアップ。'},
        {name:'プティハードライトニング',image:'ult/23.png',cost:28,kind:'damage',power:2.20,type:'magic',desc:'敵単体大ダメージ。'},
        {name:'クライマックスチェイス',image:'ult/24.png',cost:36,kind:'paralyzeAttack',power:2.60,type:'physical',chance:.10,desc:'極大ダメージ＋10%でマヒ。'}
      ]
    },
    {
      id:'denden', name:'モブデンデン', image:'play/07.png', symbol:'電', attribute:'雷', weapon:'銃', role:'連撃', passive:'デンデン・ムキムキ・カナリツヨイ',
      ults:[
        {name:'マシンガングミ',image:'ult/25.png',cost:18,kind:'multiAttack',power:.70,type:'physical',hits:[3,6],desc:'ランダム3～6回の小ダメージ。'},
        {name:'イカシタイカヅチ',image:'ult/26.png',cost:25,kind:'teamRecovery',power:.16,desc:'味方全体HP・MP小回復＋DEF小UP。'},
        {name:'トリック・ザ・デンデン',image:'ult/27.png',cost:29,kind:'stunAttack',power:2.10,type:'physical',chance:.10,desc:'大ダメージ＋10%でひるみ。'},
        {name:'デンデンサンダーボルト',image:'ult/28.png',cost:37,kind:'damage',power:2.68,type:'magic',desc:'敵単体極大ダメージ。'}
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
        {name:'モブテツ一閃',image:'ult/37.png',cost:18,kind:'stunAttack',power:1.75,type:'physical',chance:.10,desc:'中ダメージ＋10%でひるみ。'},
        {name:'モブテツ流茄子落とし',image:'ult/38.png',cost:23,kind:'damage',power:2.20,type:'physical',crit:.20,priority:true,desc:'先制大ダメージ。20%で会心。'},
        {name:'モブテツ一文字',image:'ult/39.png',cost:30,kind:'stunAttack',power:2.25,type:'physical',chance:.50,desc:'大ダメージ＋50%でひるみ。'},
        {name:'鉄の極意',image:'ult/40.png',cost:38,kind:'tetsuFinal',power:2.72,type:'physical',desc:'自身ATK小UP＋敵DEFダウン＋極大ダメージ。'}
      ]
    },
    {
      id:'lilith', name:'モブリリス', image:'play/11.png', symbol:'薔', attribute:'闇', weapon:'杖', role:'魔法', passive:'ウルモブリリス',
      ults:[
        {name:'ブラックホール',image:'ult/41.png',cost:22,kind:'speedDebuffAttack',power:1.80,type:'magic',desc:'中ダメージ＋敵SPDダウン。'},
        {name:'リリス四姉妹',image:'ult/42.png',cost:30,kind:'multiAttack',power:.68,type:'magic',hits:[4,4],desc:'4属性の中ダメージを4回。'},
        {name:'薔薇の鼓動',image:'ult/43.png',cost:36,kind:'multiAttack',power:.58,type:'magic',hits:[6,6],desc:'闇の中ダメージを6回。'},
        {name:'ローズ・ウォール・ストリート',image:'ult/44.png',cost:44,kind:'healStunAttack',power:2.25,type:'magic',heal:.25,chance:.30,desc:'味方全体HP/MP回復＋大ダメージ＋30%ひるみ。'}
      ]
    },
    {
      id:'naraku', name:'モブナラク', image:'play/12.png', symbol:'魔', attribute:'闇', weapon:'太刀・大剣', role:'魔王系', passive:'魔王の系譜',
      ults:[
        {name:'ミラモブポイズン',image:'ult/45.png',cost:22,kind:'poisonAttack',power:1.90,type:'physical',chance:.30,desc:'中ダメージ＋30%で毒。'},
        {name:'ガーディアンシールド',image:'ult/46.png',cost:25,kind:'narakuShield',power:0,desc:'自身20%軽減＋味方全体10%軽減。'},
        {name:'フル・ドラゴンフレイム',image:'ult/47.png',cost:34,kind:'selfAtkAttack',power:2.30,type:'magic',desc:'自身ATK小UP＋火・闇の大ダメージ。'},
        {name:'マスター・オブ・ピラミッド',image:'ult/48.png',cost:44,kind:'damage',power:2.78,type:'magic',desc:'敵単体極大ダメージ。'}
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
    {id:'nepu',name:'モブネプ',stage:'海底',attribute:'水',image:'boss/008.png',symbol:'海',special:'ネプチューン・トライデント',kind:'aoe',power:1.50,bg:'back/sea4.png',fallbackBg:'back2/07.png'},
    {id:'hawk2',name:'モブホークⅡ',stage:'草原Ⅱ',attribute:'風',image:'boss/01.png',symbol:'鷹',special:'ホークダイブ',kind:'aoe',power:1.32,bg:'back/sougen4.png',fallbackBg:'back/sougen.png'},
    {id:'debuff',name:'モブデーバフ',stage:'部族村',attribute:'地',image:'boss/11.png',symbol:'岩',special:'デストロイボム',kind:'single',power:1.60,bg:'back/buzok4.png',fallbackBg:'back2/08.png'},
    {id:'debuff2',name:'モブデーバフ第二形態',stage:'部族村',attribute:'地',image:'boss/12.png',symbol:'岩',special:'デストロイボム',kind:'single',power:1.75,bg:'back/buzok4.png',fallbackBg:'back2/08.png'},
    {id:'berserk',name:'モブバーサク',stage:'部族村',attribute:'地',image:'boss/13.png',symbol:'獣',special:'デストロイボム',kind:'single',power:1.82,bg:'back/buzok4.png',fallbackBg:'back2/08.png'},
    {id:'berserk2',name:'モブバーサク第二形態',stage:'部族村',attribute:'地',image:'boss/14.png',symbol:'獣',special:'デストロイボム',kind:'single',power:1.95,bg:'back/buzok4.png',fallbackBg:'back2/08.png'},
    {id:'dendenBoss',name:'モブデンデン',stage:'田舎町Ⅱ',attribute:'雷',image:'boss/15.png',symbol:'電',special:'マシンガングミ',kind:'multi',power:.78,hits:[3,6],bg:'back/inaka4.png',fallbackBg:'back/inaka.png'},
    {id:'umiDenden',name:'ウミモブデンデン',stage:'田舎町Ⅱ',attribute:'雷',image:'boss/16.png',symbol:'海',special:'マシンガングミ',kind:'multi',power:.88,hits:[3,6],bg:'back/inaka4.png',fallbackBg:'back/inaka.png'},
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

// ===== MOB QUEST v23 : enemy catalog + adventure route (Grassland -> Undersea) =====
// The monster list / levels / source specials are based on the user's 2026-08-16 monster setting sheet.
// Skills not yet defined in the sheet are intentionally handled by the battle engine as temporary elemental AI.
TEMP_BALANCE.enemyProfiles={
  normal:{hpBase:78,hpPerLevel:38,atkBase:16,atkPerLevel:3.15,magBase:15,magPerLevel:3.0,defBase:9,defPerLevel:2.05,resBase:9,resPerLevel:2.0,spdBase:14,spdPerLevel:1.65},
  elite:{hpBase:330,hpPerLevel:92,hpPerMember:48,atkBase:24,atkPerLevel:3.85,magBase:24,magPerLevel:3.8,defBase:16,defPerLevel:2.65,resBase:16,resPerLevel:2.6,spdBase:18,spdPerLevel:1.85},
  boss:{hpBase:1050,hpPerLevel:178,hpPerMember:170,atkBase:34,atkPerLevel:5.0,magBase:34,magPerLevel:5.0,defBase:25,defPerLevel:3.25,resBase:25,resPerLevel:3.25,spdBase:22,spdPerLevel:2.0}
};

MOB_DATA.enemyCatalog=[
  // Grassland
  {id:'g-slime',name:'モブスライム',stage:'草原',category:'normal',attribute:'水',image:'enemy/01.png',symbol:'水',levelMin:1,levelMax:3},
  {id:'g-rock',name:'モブロック',stage:'草原',category:'normal',attribute:'地',image:'enemy/02.png',symbol:'岩',levelMin:2,levelMax:5,mods:{hp:1.18,def:1.18,spd:.82}},
  {id:'g-jouro',name:'モブジョーロ',stage:'草原',category:'normal',attribute:'水',image:'enemy/03.png',symbol:'雫',levelMin:3,levelMax:4,tempAi:'heal'},
  {id:'g-tendevi',name:'モブテンデビ',stage:'草原',category:'normal',attribute:'水',image:'enemy/04.png',symbol:'水',levelMin:2,levelMax:4},
  {id:'g-bird',name:'モブバード',stage:'草原',category:'normal',attribute:'風',image:'enemy/05.png',symbol:'翼',levelMin:1,levelMax:3,mods:{hp:.86,spd:1.22}},
  {id:'g-piyo-green',name:'モブピヨミドリ',stage:'草原',category:'normal',attribute:'風',image:'enemy/06.png',symbol:'風',levelMin:2,levelMax:4,mods:{hp:.9,spd:1.12}},
  {id:'g-piyo-red',name:'モブピヨレッド',stage:'草原',category:'normal',attribute:'火',image:'enemy/07.png',symbol:'火',levelMin:2,levelMax:4,mods:{atk:1.08}},
  {id:'g-beaver',name:'モブビーバー',stage:'草原',category:'normal',attribute:'地',image:'enemy/08.png',symbol:'木',levelMin:2,levelMax:5,mods:{hp:1.08,def:1.08}},
  {id:'g-savanna',name:'モブサバンナ',stage:'草原',category:'elite',attribute:'地',image:'enemy/09.png',symbol:'砂',levelMin:6,levelMax:6,special:'サバンナダンス',kind:'single',power:.80,skillElement:'地',skillType:'physical'},
  {id:'g-iwakiri',name:'モブイワキリ',stage:'草原',category:'elite',attribute:'雷',image:'enemy/10.png',symbol:'雷',levelMin:7,levelMax:7,special:'イワキリサンダー',kind:'aoe',power:.66,skillElement:'雷',skillType:'magic'},
  {id:'g-axe',name:'モブアックス',stage:'草原',category:'elite',attribute:'地',image:'enemy/13.png',symbol:'斧',levelMin:7,levelMax:7,special:'アックススクラッチ',kind:'single',power:.82,skillElement:'風',skillType:'physical'},
  {id:'boss-hawk',bossId:'hawk',name:'モブホーク',stage:'草原',category:'boss',attribute:'風',image:'boss/01.png',symbol:'鷹',levelMin:10,levelMax:10,special:'ホークダイブ',kind:'aoe',power:1.05,skillType:'physical'},

  // Desert
  {id:'d-mummy',name:'モブミイラ',stage:'砂漠',category:'normal',attribute:'地',image:'enemy/21.png',symbol:'包',levelMin:6,levelMax:9,mods:{hp:1.08,res:.88}},
  {id:'d-turco',name:'モブトルコ',stage:'砂漠',category:'normal',attribute:'地',image:'enemy/22.png',symbol:'砂',levelMin:6,levelMax:9},
  {id:'d-yamikamen',name:'モブヤミカーメン',stage:'砂漠',category:'normal',attribute:'闇',image:'enemy/23.png',symbol:'闇',levelMin:6,levelMax:10,mods:{mag:1.1}},
  {id:'d-gimmick',name:'モブギミック',stage:'砂漠',category:'normal',attribute:'地',image:'enemy/24.png',symbol:'宝',levelMin:7,levelMax:10,rare:true,coinReward:10000,mods:{hp:.88,spd:1.08}},
  {id:'d-adventure',name:'モブアドベンチャー',stage:'砂漠',category:'normal',attribute:'火',image:'enemy/25.png',symbol:'炎',levelMin:7,levelMax:10,mods:{atk:1.1}},
  {id:'d-lizard',name:'モブスナトカゲ',stage:'砂漠',category:'normal',attribute:'地',image:'enemy/26.png',symbol:'蜥',levelMin:7,levelMax:10,mods:{spd:1.12}},
  {id:'d-nekomummy',name:'モブネコミイラ',stage:'砂漠',category:'normal',attribute:'地',image:'enemy/27.png',symbol:'猫',levelMin:6,levelMax:10},
  {id:'d-akarock',name:'モブアカロック',stage:'砂漠',category:'normal',attribute:'地',image:'enemy/28.png',symbol:'岩',levelMin:7,levelMax:10,mods:{hp:1.18,def:1.18,spd:.82}},
  {id:'d-sharty',name:'モブシャーティー',stage:'砂漠',category:'elite',attribute:'光',image:'enemy/29.png',symbol:'光',levelMin:10,levelMax:10,special:'リビングデッド',kind:'reviveMummy',power:0},
  {id:'d-poison',name:'モブポイズン',stage:'砂漠',category:'elite',attribute:'闇',image:'enemy/30.png',symbol:'毒',levelMin:10,levelMax:10,special:'ポイズンクロー',kind:'poisonSingle',power:.82,chance:.10,skillType:'physical'},
  {id:'d-deathhead',name:'モブデスヘッド',stage:'砂漠',category:'elite',attribute:'闇',image:'enemy/31.png',symbol:'闇',levelMin:10,levelMax:10,special:'デスカーテン',kind:'single',power:.84,skillElement:'闇',skillType:'magic'},
  {id:'boss-mira',bossId:'mira',name:'ミラモブ',stage:'砂漠',category:'boss',attribute:'闇',image:'boss/03.png',symbol:'毒',levelMin:15,levelMax:15,special:'ミラモブポイズン',kind:'poisonSingle',power:1.35,chance:.50,skillType:'physical'},

  // Rural town
  {id:'r-hitode',name:'モブヒトデヤリ',stage:'田舎町',category:'normal',attribute:'水',image:'enemy/41.png',symbol:'槍',levelMin:13,levelMax:16},
  {id:'r-knife',name:'モブナイフ',stage:'田舎町',category:'normal',attribute:'地',image:'enemy/42.png',symbol:'刃',levelMin:13,levelMax:16,mods:{atk:1.08,spd:1.08}},
  {id:'r-purufu',name:'モブプルフ',stage:'田舎町',category:'normal',attribute:'水',image:'enemy/43.png',symbol:'水',levelMin:14,levelMax:16},
  {id:'r-nullblue',name:'モブヌルブルー',stage:'田舎町',category:'normal',attribute:'水',image:'enemy/44.png',symbol:'青',levelMin:14,levelMax:16,mods:{res:1.1}},
  {id:'r-adancer',name:'モブアダンサー',stage:'田舎町',category:'normal',attribute:'火',image:'enemy/45.png',symbol:'舞',levelMin:14,levelMax:17,mods:{spd:1.12}},
  {id:'r-upa',name:'モブウパルーパー',stage:'田舎町',category:'normal',attribute:'水',image:'enemy/46.png',symbol:'水',levelMin:14,levelMax:17},
  {id:'r-banken',name:'モブバンケン',stage:'田舎町',category:'normal',attribute:'地',image:'enemy/47.png',symbol:'犬',levelMin:14,levelMax:17,mods:{hp:1.12,def:1.08}},
  {id:'r-denchi',name:'モブデンチマーク',stage:'田舎町',category:'normal',attribute:'雷',image:'enemy/48.png',symbol:'電',levelMin:14,levelMax:17,mods:{mag:1.08}},
  {id:'r-dancer',name:'モブダンサー',stage:'田舎町',category:'normal',attribute:'火',image:'enemy/45.png',symbol:'舞',levelMin:15,levelMax:15,tempAsset:true,mods:{spd:1.12}},
  {id:'r-scouter',name:'モブスカウター',stage:'田舎町',category:'elite',attribute:'光',image:'enemy/52.png',symbol:'光',levelMin:19,levelMax:19,special:'スカウターライト',kind:'single',power:.84,skillElement:'光',skillType:'magic'},
  {id:'r-captain',name:'モブキャプテン',stage:'田舎町',category:'elite',attribute:'闇',image:'enemy/54.png',symbol:'船',levelMin:20,levelMax:20,special:'パイレーツボム',kind:'aoeStunChance',power:.68,chance:.03,skillType:'physical'},
  {id:'r-dean',name:'モブディーン',stage:'田舎町',category:'elite',attribute:'雷',image:'enemy/56.png',symbol:'雷',levelMin:20,levelMax:20,special:'サンダースピア',kind:'single',power:.84,skillElement:'闇',skillType:'physical'},
  {id:'boss-guardian',bossId:'guardian',name:'モブガーディアン',stage:'田舎町',category:'boss',attribute:'地',image:'boss/05.png',symbol:'盾',levelMin:23,levelMax:23,special:'ガーディアンシールド',kind:'shield',power:0},

  // Neon city
  {id:'n-naga',name:'モブナーガ',stage:'ネオン街',category:'normal',attribute:'光',image:'enemy/41.png',symbol:'光',levelMin:21,levelMax:24,mods:{mag:1.06}},
  {id:'n-lizard',name:'モブネオントカゲ',stage:'ネオン街',category:'normal',attribute:'光',image:'enemy/42.png',symbol:'蜥',levelMin:22,levelMax:25,mods:{spd:1.12}},
  {id:'n-kairo',name:'モブカイロ',stage:'ネオン街',category:'normal',attribute:'地',image:'enemy/43.png',symbol:'路',levelMin:21,levelMax:24},
  {id:'n-energy',name:'モブエナジー',stage:'ネオン街',category:'normal',attribute:'光',image:'enemy/44.png',symbol:'光',levelMin:21,levelMax:24,mods:{mag:1.12,res:1.08}},
  {id:'n-slime',name:'モブネオンスライム',stage:'ネオン街',category:'normal',attribute:'光',image:'enemy/45.png',symbol:'光',levelMin:21,levelMax:24,mods:{hp:.92}},
  {id:'n-glass',name:'モブガラス',stage:'ネオン街',category:'normal',attribute:'闇',image:'enemy/46.png',symbol:'闇',levelMin:21,levelMax:25,mods:{atk:1.08,def:.9}},
  {id:'n-banken',name:'モブバンケン',stage:'ネオン街',category:'normal',attribute:'地',image:'enemy/47.png',symbol:'犬',levelMin:21,levelMax:25,mods:{hp:1.12,def:1.08}},
  {id:'n-darknaga',name:'モブダークナーガ',stage:'ネオン街',category:'normal',attribute:'闇',image:'enemy/48.png',symbol:'闇',levelMin:22,levelMax:25,mods:{mag:1.12}},
  {id:'n-golem',name:'モブネオゴーレム',stage:'ネオン街',category:'elite',attribute:'光',image:'enemy/75.png',symbol:'拳',levelMin:25,levelMax:25,special:'パワーブーストパンチ',kind:'single',power:.86,skillType:'physical',mods:{hp:1.12,def:1.15,spd:.82}},
  {id:'n-chaser',name:'モブエネチェイサー',stage:'ネオン街',category:'elite',attribute:'地',image:'enemy/77.png',symbol:'線',levelMin:25,levelMax:25,special:'ケーブルチェイス',kind:'aoe',power:.66,skillType:'physical'},
  {id:'n-trainer',name:'モブスラトレーナー',stage:'ネオン街',category:'elite',attribute:'水',image:'enemy/80.png',symbol:'水',levelMin:26,levelMax:26,special:'スライムハンマー',kind:'single',power:.84,skillElement:'水',skillType:'physical'},
  {id:'boss-neon',bossId:'neon',name:'モブネオンバルス',stage:'ネオン街',category:'boss',attribute:'光',image:'boss/07.png',symbol:'光',levelMin:32,levelMax:32,special:'ネオンボム',kind:'singlePlusAoe',power:1.35,skillType:'magic'},
  {id:'boss-ace',bossId:'ace',name:'モブエース',stage:'ネオン街',category:'boss',attribute:'闇',image:'boss/08.png',symbol:'紫',levelMin:32,levelMax:32,sourceIncomplete:true},

  // Magma
  {id:'m-honoslime',name:'モブホノスライム',stage:'マグマ',category:'normal',attribute:'火',image:'enemy/85.png',symbol:'火',levelMin:30,levelMax:35},
  {id:'m-magrock',name:'モブマグロック',stage:'マグマ',category:'normal',attribute:'火',image:'enemy/86.png',symbol:'岩',levelMin:35,levelMax:37,mods:{hp:1.18,def:1.18,spd:.82}},
  {id:'m-magslime',name:'モブマグスライム',stage:'マグマ',category:'normal',attribute:'火',image:'enemy/87.png',symbol:'火',levelMin:30,levelMax:35},
  {id:'m-hinodevi',name:'モブヒノデビ',stage:'マグマ',category:'normal',attribute:'火',image:'enemy/88.png',symbol:'炎',levelMin:30,levelMax:35,mods:{mag:1.08}},
  {id:'m-lizard',name:'モブマグトカゲ',stage:'マグマ',category:'normal',attribute:'火',image:'enemy/89.png',symbol:'蜥',levelMin:33,levelMax:37,mods:{spd:1.12}},
  {id:'m-heatrock',name:'モブヒートロック',stage:'マグマ',category:'normal',attribute:'火',image:'enemy/90.png',symbol:'岩',levelMin:33,levelMax:37,mods:{hp:1.16,def:1.16,spd:.84}},
  {id:'m-bombthrow',name:'モブボムスロー',stage:'マグマ',category:'normal',attribute:'火',image:'enemy/91.png',symbol:'爆',levelMin:33,levelMax:37,tempAi:'aoe'},
  {id:'m-bomber',name:'モブボマー',stage:'マグマ',category:'normal',attribute:'火',image:'enemy/92.png',symbol:'爆',levelMin:34,levelMax:37,tempAi:'aoe',mods:{atk:1.08}},
  {id:'m-golem',name:'モブマグゴーレム',stage:'マグマ',category:'elite',attribute:'火',image:'enemy/95.png',symbol:'拳',levelMin:39,levelMax:39,special:'マグマパワーパンチ',kind:'single',power:1.18,skillType:'physical',mods:{hp:1.12,def:1.14,spd:.82}},
  {id:'m-honotail',name:'モブホノテイル',stage:'マグマ',category:'elite',attribute:'火',image:'enemy/100.png',symbol:'尾',levelMin:38,levelMax:38},
  {id:'m-hinotabi',name:'モブヒノタビ',stage:'マグマ',category:'elite',attribute:'火',image:'enemy/99.png',symbol:'炎',levelMin:40,levelMax:40,special:'フレイムマジック',kind:'aoe',power:.68,skillElement:'火',skillType:'magic'},
  {id:'m-blizzard',name:'モブブリザード',stage:'マグマ',category:'elite',attribute:'水',image:'enemy/101.png',symbol:'氷',levelMin:40,levelMax:40,special:'ブリザードフラッシュ',kind:'single',power:1.18,skillElement:'水',skillType:'magic'},
  {id:'m-flame',name:'モブフレイム',stage:'マグマ',category:'elite',attribute:'火',image:'enemy/102.png',symbol:'炎',levelMin:40,levelMax:40,special:'フレイムフラッシュ',kind:'aoe',power:.70,skillElement:'火',skillType:'magic'},
  {id:'m-frezard',name:'モブフレザード',stage:'マグマ',category:'elite',attribute:'水・火',image:'enemy/103.png',symbol:'双',levelMin:42,levelMax:42,specialOptions:[{special:'ブリザードフラッシュ',kind:'single',power:1.18,skillElement:'水',skillType:'magic'},{special:'フレイムフラッシュ',kind:'aoe',power:.70,skillElement:'火',skillType:'magic'}],mods:{hp:1.22,atk:1.08,mag:1.10}},
  {id:'boss-dragon',bossId:'dragon',name:'モブドラゴン',stage:'マグマ',category:'boss',attribute:'火',image:'boss/09.png',symbol:'竜',levelMin:45,levelMax:45,special:'ドラゴンフレイム',kind:'aoe',power:1.48,skillType:'magic'},

  // Undersea
  {id:'s-guard',name:'モブシーガード',stage:'海底',category:'normal',attribute:'水',image:'enemy/104.png',symbol:'盾',levelMin:42,levelMax:47,mods:{def:1.10}},
  {id:'s-soldier',name:'モブアビスソルジャー',stage:'海底',category:'normal',attribute:'水',image:'enemy/105.png',symbol:'兵',levelMin:42,levelMax:47,mods:{atk:1.08}},
  {id:'s-mist',name:'モブミスト',stage:'海底',category:'normal',attribute:'水',image:'enemy/106.png',symbol:'霧',levelMin:43,levelMax:48,tempAi:'debuff',mods:{mag:1.08}},
  {id:'s-nessie',name:'モブネッシー',stage:'海底',category:'normal',attribute:'水',image:'enemy/107.png',symbol:'海',levelMin:45,levelMax:48,mods:{hp:1.12}},
  {id:'s-jinbei',name:'モブジンベエ',stage:'海底',category:'normal',attribute:'水',image:'enemy/108.png',symbol:'鮫',levelMin:45,levelMax:49,mods:{hp:1.16,spd:.92}},
  {id:'s-doctor',name:'モブバブルドクター',stage:'海底',category:'normal',attribute:'水',image:'enemy/109.png',symbol:'医',levelMin:45,levelMax:49,tempAi:'heal',mods:{mag:1.10,res:1.10}},
  {id:'s-ninja',name:'モブサメニンジャ',stage:'海底',category:'normal',attribute:'水',image:'enemy/110.png',symbol:'忍',levelMin:45,levelMax:49,mods:{atk:1.08,spd:1.18,hp:.92}},
  {id:'s-hamon',name:'モブハモン',stage:'海底',category:'normal',attribute:'水',image:'enemy/111.png',symbol:'波',levelMin:45,levelMax:49,mods:{mag:1.08}},
  {id:'s-abyssknight',name:'モブアビスナイト',stage:'海底',category:'elite',attribute:'水',image:'enemy/117.png',symbol:'騎',levelMin:51,levelMax:51,special:'アビススクリュー',kind:'single',power:1.18,skillElement:'水',skillType:'physical'},
  {id:'s-marine',name:'モブマリン',stage:'海底',category:'elite',attribute:'水',image:'enemy/116.png',symbol:'海',levelMin:52,levelMax:52},
  {id:'s-jones',name:'モブジョーンズ',stage:'海底',category:'elite',attribute:'水',image:'enemy/118.png',symbol:'波',levelMin:53,levelMax:53,special:'ウェーブショック',kind:'aoe',power:.68,skillElement:'水',skillType:'magic'},
  {id:'s-sorcerer',name:'モブソーサラー',stage:'海底',category:'elite',attribute:'雷',image:'enemy/113.png',symbol:'術',levelMin:55,levelMax:55,special:'ミストラル',kind:'single',power:1.18,skillElement:'水',skillType:'magic'},
  {id:'s-uminight',name:'モブウミナイト',stage:'海底',category:'elite',attribute:'水',image:'enemy/19.png',symbol:'騎',levelMin:53,levelMax:53,special:'ウォータースパイラル',kind:'single',power:.84,skillElement:'水',skillType:'physical'},
  {id:'s-wave',name:'モブウェイブ',stage:'海底',category:'elite',attribute:'水',image:'enemy/120.png',symbol:'波',levelMin:55,levelMax:55,special:'ウォーターグラビディ',kind:'single',power:1.18,skillElement:'水',skillType:'magic'},
  {id:'boss-nepu',bossId:'nepu',name:'モブネプ',stage:'海底',category:'boss',attribute:'水',image:'boss/008.png',symbol:'海',levelMin:60,levelMax:60,special:'ネプチューン・トライデント',kind:'aoe',power:1.50,skillType:'physical'}
];

MOB_DATA.adventureWorlds=[
  {id:'grassland',name:'草原',fieldFallback:'back2/02.png',normalIds:['g-slime','g-rock','g-jouro','g-tendevi','g-bird','g-piyo-green','g-piyo-red','g-beaver'],areas:[
    {name:'AREA 1',bg:'back/sougen.png',boss:[{id:'g-beaver',level:4,qty:2},{id:'g-savanna',level:6}]},
    {name:'AREA 2',bg:'back/sougen2.png',boss:[{id:'g-iwakiri',level:7}]},
    {name:'AREA 3',bg:'back/sougen3.png',boss:[{id:'g-axe',level:7}]},
    {name:'AREA 4',bg:'back/sougen4.png',boss:[{id:'boss-hawk',level:10}]}
  ]},
  {id:'desert',name:'砂漠',fieldFallback:'back2/03.png',normalIds:['d-mummy','d-turco','d-yamikamen','d-gimmick','d-adventure','d-lizard','d-nekomummy','d-akarock'],areas:[
    {name:'AREA 1',bg:'back/sabaku.png',boss:[{id:'d-mummy',level:7,qty:2},{id:'d-sharty',level:10}]},
    {name:'AREA 2',bg:'back/sabaku2.png',boss:[{id:'d-poison',level:10}]},
    {name:'AREA 3',bg:'back/sabaku3.png',boss:[{id:'d-deathhead',level:10}]},
    {name:'AREA 4',bg:'back/sabaku4.png',boss:[{id:'boss-mira',level:15}]}
  ]},
  {id:'rural',name:'田舎町',fieldFallback:'back2/04.png',normalIds:['r-hitode','r-knife','r-purufu','r-nullblue','r-adancer','r-upa','r-banken','r-denchi'],areas:[
    {name:'AREA 1',bg:'back/inaka.png',boss:[{id:'r-dancer',level:15,qty:2},{id:'r-scouter',level:19}]},
    {name:'AREA 2',bg:'back/inaka2.png',boss:[{id:'r-captain',level:20}]},
    {name:'AREA 3',bg:'back/inaka3.png',boss:[{id:'r-dean',level:20}]},
    {name:'AREA 4',bg:'back/inaka4.png',boss:[{id:'boss-guardian',level:23}]}
  ]},
  {id:'neon',name:'ネオン街',fieldFallback:'back2/05.png',normalIds:['n-naga','n-lizard','n-kairo','n-energy','n-slime','n-glass','n-banken','n-darknaga'],areas:[
    {name:'AREA 1',bg:'back/neon.png',boss:[{id:'n-naga',level:22,qty:2},{id:'n-golem',level:25}]},
    {name:'AREA 2',bg:'back/neon2.png',boss:[{id:'n-chaser',level:25}]},
    {name:'AREA 3',bg:'back/neon3.png',boss:[{id:'n-trainer',level:26}]},
    {name:'AREA 4',bg:'back/neon4.png',boss:[{id:'boss-neon',level:32}]}
  ]},
  {id:'magma',name:'マグマ',fieldFallback:'back2/06.png',normalIds:['m-honoslime','m-magrock','m-magslime','m-hinodevi','m-lizard','m-heatrock','m-bombthrow','m-bomber'],areas:[
    {name:'AREA 1',bg:'back/magma.png',boss:[{id:'m-lizard',level:35,qty:2},{id:'m-golem',level:39}]},
    {name:'AREA 2',bg:'back/magma2.png',boss:[{id:'m-honotail',level:38},{id:'m-hinotabi',level:40}]},
    {name:'AREA 3',bg:'back/magma3.png',boss:[{id:'m-blizzard',level:40},{id:'m-flame',level:40}],nextWave:[{id:'m-frezard',level:42}]},
    {name:'AREA 4',bg:'back/magma4.png',boss:[{id:'boss-dragon',level:45}]}
  ]},
  {id:'sea',name:'海底',fieldFallback:'back2/07.png',normalIds:['s-guard','s-soldier','s-mist','s-nessie','s-jinbei','s-doctor','s-ninja','s-hamon'],areas:[
    {name:'AREA 1',bg:'back/sea.png',boss:[{id:'s-soldier',level:45,qty:2},{id:'s-abyssknight',level:51}]},
    {name:'AREA 2',bg:'back/sea2.png',boss:[{id:'s-marine',level:52},{id:'s-jones',level:53}]},
    {name:'AREA 3',bg:'back/sea3.png',boss:[{id:'s-sorcerer',level:55},{id:'s-uminight',level:53},{id:'s-wave',level:55}]},
    {name:'AREA 4',bg:'back/sea4.png',boss:[{id:'boss-nepu',level:60}]}
  ]}
];
