const MOB_DATA = {
  elements: {
    '火': { label:'火', spell:'ホノマ', cost:10, power:1.35, frames:['skill/05.png','skill/06.png','skill/07.png','skill/08.png'] },
    '水': { label:'水', spell:'ネプマ', cost:10, power:1.35, frames:['skill/17.png','skill/18.png','skill/19.png','skill/17.png'] },
    '雷': { label:'雷', spell:'トルマ', cost:10, power:1.38, frames:['skill/29.png','skill/30.png','skill/31.png','skill/30.png'] },
    '地': { label:'地', spell:'ゴレマ', cost:10, power:1.38, frames:['skill/39.png','skill/40.png','skill/41.png','skill/42.png'] },
    '風': { label:'風', spell:'プテマ', cost:10, power:1.35, frames:['skill/49.png','skill/50.png','skill/51.png','skill/52.png'] },
    '光': { label:'光', spell:'ネオマ', cost:11, power:1.42, frames:['skill/54.png','skill/55.png','skill/57.png','skill/58.png','skill/56.png'] },
    '闇': { label:'闇', spell:'ミラマ', cost:11, power:1.42, frames:['skill/65.png','skill/66.png','skill/67.png','skill/68.png'] },
    '無': { label:'無', spell:'アノマ', cost:9, power:1.30, frames:[] }
  },

  players: [
    {
      id:'yusha', name:'モブ勇者', image:'play/01.png', symbol:'勇', attribute:'光', weapon:'両手剣・片手剣', role:'勇者',
      growth:{hp:54,mp:2.5,atk:7.6,mag:7.2,def:3.8,res:3.7,spd:2.8}, passive:'あのヒーローにやっつけてもらおう',
      ults:[
        {name:'星降りの一振り',image:'ult/01.png',cost:18,kind:'damage',power:1.65,type:'physical',crit:.10,desc:'敵単体中ダメージ。10%で会心。'},
        {name:'特別だと信じる力',image:'ult/02.png',cost:20,kind:'selfAllBuff',power:0,desc:'自身の全能力20%UP＋被ダメージ10%軽減。'},
        {name:'エピソード・ジューマンジ',image:'ult/03.png',cost:30,kind:'jumanji',power:2.05,type:'magic',desc:'敵単体大ダメージ＋自身バフ＋敵デバフ。'},
        {name:'ネバー・エンディング・ブラスト',image:'ult/04.png',cost:38,kind:'lowHpBurst',power:2.55,type:'magic',desc:'敵単体極大ダメージ。味方残HPが少ないほど強化。'},
        {name:'読みかけの本',image:'play/13.png',cost:55,kind:'heroTransform',power:0,desc:'HP50%回復し「あのヒーロー」に変身。全能力30%UP。'}
      ]
    },
    {
      id:'pink', name:'モブピンク', image:'play/02.png', symbol:'桃', attribute:'無', weapon:'片手剣', role:'サポート',
      growth:{hp:50,mp:2.8,atk:6.2,mag:6.5,def:4.5,res:4.4,spd:2.5}, passive:'支える力',
      ults:[
        {name:'シールドアタック',image:'ult/05.png',cost:16,kind:'shieldAttack',power:1.60,type:'physical',desc:'単体中ダメージ＋このターン自身20%軽減。'},
        {name:'癒しのピンクボンボン',image:'ult/06.png',cost:24,kind:'healCleanse',power:.18,desc:'味方全体小回復＋50%で状態異常解除。'},
        {name:'勇者のパートナー',image:'ult/07.png',cost:28,kind:'yushaGuardAttack',power:1.55,type:'magic',desc:'敵単体中ダメージ＋勇者の被ダメージ50%軽減。'},
        {name:'キングダムソルジャー',image:'ult/08.png',cost:34,kind:'teamGuardAttack',power:1.85,type:'physical',desc:'敵単体大ダメージ＋味方全員30%軽減。'}
      ]
    },
    {
      id:'desert', name:'モブデザート', image:'play/03.png', symbol:'砂', attribute:'地', weapon:'両手剣・太刀', role:'物理',
      growth:{hp:56,mp:2.0,atk:8.0,mag:5.6,def:4.0,res:3.4,spd:2.4}, passive:'サバクノマモリビト',
      ults:[
        {name:'デザートブラウニー',image:'ult/09.png',cost:16,kind:'selfHealAttack',power:1.65,type:'physical',desc:'自身小回復＋単体中ダメージ。'},
        {name:'ゴールドフィッシュ',image:'ult/10.png',cost:22,kind:'goldAttack',power:2.00,type:'physical',desc:'単体大ダメージ＋トレーニング外ではゴールドを奪う。'},
        {name:'サンドドラグーン',image:'ult/11.png',cost:28,kind:'speedDebuffAttack',power:2.05,type:'magic',desc:'単体大ダメージ＋敵SPD小ダウン。'},
        {name:'スナノサバキ',image:'ult/12.png',cost:36,kind:'damage',power:2.65,type:'physical',desc:'敵単体極大ダメージ。'}
      ]
    },
    {
      id:'nyoro', name:'モブニョロ', image:'play/04.png', symbol:'炎', attribute:'火', weapon:'太刀・銃', role:'攻撃',
      growth:{hp:49,mp:2.2,atk:7.5,mag:6.5,def:3.3,res:3.4,spd:3.0}, passive:'マグマスイミング',
      ults:[
        {name:'マグマケロ',image:'ult/13.png',cost:18,kind:'burnAttack',power:1.60,type:'physical',chance:.10,desc:'中ダメージ＋10%でやけど。'},
        {name:'ヒノフルカヨウ',image:'ult/14.png',cost:24,kind:'damage',power:2.05,type:'physical',desc:'敵単体大ダメージ。'},
        {name:'ジューシーファイア',image:'ult/15.png',cost:28,kind:'burnAttack',power:2.15,type:'magic',chance:.30,desc:'大ダメージ＋30%でやけど。'},
        {name:'マグケロキングダム',image:'ult/16.png',cost:34,kind:'teamDefAttack',power:2.20,type:'physical',desc:'味方全体DEF小UP＋敵単体大ダメージ。'}
      ]
    },
    {
      id:'nekoku', name:'モブネコクー', image:'play/05.png', symbol:'水', attribute:'水', weapon:'大剣・槍', role:'戦士',
      growth:{hp:55,mp:2.2,atk:7.7,mag:5.9,def:4.2,res:3.6,spd:2.6}, passive:'癒しのプニプニ',
      ults:[
        {name:'ネコクージェット',image:'ult/17.png',cost:17,kind:'damage',power:1.65,type:'physical',sure:true,desc:'必中の単体中ダメージ。'},
        {name:'ネコトクジラ',image:'ult/18.png',cost:23,kind:'selfCleanseAttack',power:2.00,type:'physical',desc:'自身の状態異常解除＋単体大ダメージ。'},
        {name:'ネムレナイヨル',image:'ult/19.png',cost:29,kind:'sleepAttack',power:2.10,type:'magic',chance:.50,desc:'大ダメージ＋50%で眠り。'},
        {name:'ウォーターキル・ザ・ビート',image:'ult/20.png',cost:36,kind:'sleepAttack',power:2.60,type:'magic',chance:.10,desc:'極大ダメージ＋10%で眠り。'}
      ]
    },
    {
      id:'jerry', name:'モブジェリー', image:'play/06.png', symbol:'雷', attribute:'雷', weapon:'片手剣・槍', role:'雷撃',
      growth:{hp:48,mp:2.7,atk:7.0,mag:7.4,def:3.2,res:3.8,spd:3.4}, passive:'ダブルサンダー',
      ults:[
        {name:'サンダーロープ',image:'ult/21.png',cost:17,kind:'paralyzeAttack',power:1.62,type:'physical',chance:.10,desc:'中ダメージ＋10%でマヒ。'},
        {name:'ジャスティス+・スクリューブロー',image:'ult/22.png',cost:24,kind:'selfSpdAttack',power:2.00,type:'physical',desc:'大ダメージ＋自身SPDアップ。'},
        {name:'プティハードライトニング',image:'ult/23.png',cost:28,kind:'damage',power:2.20,type:'magic',desc:'敵単体大ダメージ。'},
        {name:'クライマックスチェイス',image:'ult/24.png',cost:36,kind:'paralyzeAttack',power:2.60,type:'physical',chance:.10,desc:'極大ダメージ＋10%でマヒ。'}
      ]
    },
    {
      id:'denden', name:'モブデンデン', image:'play/07.png', symbol:'電', attribute:'雷', weapon:'銃・片手剣', role:'連撃',
      growth:{hp:53,mp:2.4,atk:7.8,mag:6.4,def:3.7,res:3.6,spd:2.8}, passive:'デンデン・ムキムキ・カナリツヨイ',
      ults:[
        {name:'マシンガングミ',image:'ult/25.png',cost:18,kind:'multiAttack',power:.70,type:'physical',hits:[3,6],desc:'ランダム3～6回の小ダメージ。'},
        {name:'イカシタイカヅチ',image:'ult/26.png',cost:25,kind:'teamRecovery',power:.16,desc:'味方全体HP・MP小回復＋DEF小UP。'},
        {name:'トリック・ザ・デンデン',image:'ult/27.png',cost:29,kind:'stunAttack',power:2.10,type:'physical',chance:.10,desc:'大ダメージ＋10%でひるみ。'},
        {name:'デンデンサンダーボルト',image:'ult/28.png',cost:37,kind:'damage',power:2.68,type:'magic',desc:'敵単体極大ダメージ。'}
      ]
    },
    {
      id:'money', name:'モブマニー', image:'play/08.png', symbol:'光', attribute:'光', weapon:'杖・槍', role:'回復',
      growth:{hp:47,mp:3.2,atk:5.7,mag:8.0,def:3.1,res:4.8,spd:2.5}, passive:'マニーは海を渡る',
      ults:[
        {name:'バブルネオン',image:'ult/29.png',cost:18,kind:'selfRecoveryAttack',power:1.70,type:'magic',desc:'単体中ダメージ＋自身HP/MP小回復。'},
        {name:'レッドブルーボム',image:'ult/30.png',cost:27,kind:'damage',power:2.20,type:'magic',desc:'火・水・光を持つ単体大ダメージ。'},
        {name:'マニーズハウス',image:'ult/31.png',cost:30,kind:'teamHealGuard',power:.28,desc:'味方全体中回復＋被ダメージ10%軽減。'},
        {name:'レトロミラージュマニー',image:'ult/32.png',cost:42,kind:'fullHealBarrier',power:0,desc:'自身全回復＋味方全体に1回無効バリア。'}
      ]
    },
    {
      id:'riro', name:'モブリーロ', image:'play/09.png', symbol:'風', attribute:'風', weapon:'太刀・片手剣', role:'万能',
      growth:{hp:50,mp:2.7,atk:7.0,mag:6.6,def:3.5,res:4.1,spd:3.1}, passive:'アーティスト・マインド',
      ults:[
        {name:'トゥエルラッシュ',image:'ult/33.png',cost:16,kind:'damage',power:1.65,type:'physical',desc:'単体中ダメージ。'},
        {name:'タロ・アンド・リーロ',image:'ult/34.png',cost:25,kind:'healCleanse',power:.26,desc:'味方全体中回復＋50%で状態異常解除。'},
        {name:'ディスコスパイラル',image:'ult/35.png',cost:28,kind:'teamAtkAttack',power:2.10,type:'physical',desc:'味方全体ATK小UP＋単体大ダメージ。'},
        {name:'リーロ・トゥ・ステイシー',image:'ult/36.png',cost:38,kind:'healAttack',power:2.60,type:'physical',heal:.24,desc:'味方全体中回復＋単体極大ダメージ。'}
      ]
    },
    {
      id:'tetsu', name:'モブテツ', image:'play/10.png', symbol:'鉄', attribute:'地', weapon:'太刀・両手剣', role:'剣豪',
      growth:{hp:57,mp:2.0,atk:8.4,mag:4.8,def:4.3,res:3.2,spd:2.7}, passive:'テツの意志',
      ults:[
        {name:'モブテツ一閃',image:'ult/37.png',cost:18,kind:'stunAttack',power:1.75,type:'physical',chance:.10,desc:'中ダメージ＋10%でひるみ。'},
        {name:'モブテツ流茄子落とし',image:'ult/38.png',cost:23,kind:'damage',power:2.20,type:'physical',crit:.20,priority:true,desc:'先制大ダメージ。20%で会心。'},
        {name:'モブテツ一文字',image:'ult/39.png',cost:30,kind:'stunAttack',power:2.25,type:'physical',chance:.50,desc:'大ダメージ＋50%でひるみ。'},
        {name:'鉄の極意',image:'ult/40.png',cost:38,kind:'tetsuFinal',power:2.72,type:'physical',desc:'自身ATK小UP＋敵DEFダウン＋極大ダメージ。'}
      ]
    },
    {
      id:'lilith', name:'モブリリス', image:'play/11.png', symbol:'薔', attribute:'闇', weapon:'杖・銃', role:'魔法',
      growth:{hp:49,mp:3.1,atk:5.9,mag:8.3,def:3.4,res:4.6,spd:3.0}, passive:'ウルモブリリス',
      ults:[
        {name:'ブラックホール',image:'ult/41.png',cost:22,kind:'speedDebuffAttack',power:1.80,type:'magic',desc:'中ダメージ＋敵SPDダウン。'},
        {name:'リリス四姉妹',image:'ult/42.png',cost:30,kind:'multiAttack',power:.68,type:'magic',hits:[4,4],desc:'4属性の中ダメージを4回。'},
        {name:'薔薇の鼓動',image:'ult/43.png',cost:36,kind:'multiAttack',power:.58,type:'magic',hits:[6,6],desc:'闇の中ダメージを6回。'},
        {name:'ローズ・ウォール・ストリート',image:'ult/44.png',cost:44,kind:'healStunAttack',power:2.25,type:'magic',heal:.25,chance:.30,desc:'味方全体HP/MP回復＋大ダメージ＋30%ひるみ。'}
      ]
    },
    {
      id:'naraku', name:'モブナラク', image:'play/12.png', symbol:'魔', attribute:'闇', weapon:'太刀・片手剣', role:'魔王系',
      growth:{hp:58,mp:2.7,atk:7.9,mag:7.8,def:4.0,res:4.0,spd:2.7}, passive:'魔王の系譜',
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
    {id:'neon',name:'モブネオン',stage:'ネオン街',attribute:'光',image:'boss/07.png',symbol:'光',special:'ネオンボム',kind:'singlePlusAoe',power:1.35,bg:'back/neon4.png',fallbackBg:'back/neon.png'},
    {id:'ace',name:'モブエース',stage:'ネオン街',attribute:'闇',image:'boss/08.png',symbol:'紫',special:'紫雷撃',kind:'single',power:1.65,bg:'back/neon4.png',fallbackBg:'back/neon.png'},
    {id:'dragon',name:'モブドラゴン',stage:'マグマ',attribute:'火',image:'boss/09.png',symbol:'竜',special:'ドラゴンフレイム',kind:'aoe',power:1.48,bg:'back/magma4.png',fallbackBg:'back/magma.png'},
    {id:'nepu',name:'モブネプ',stage:'海底',attribute:'水',image:'boss/008.png',symbol:'海',special:'ネプチューン・トライデント',kind:'aoe',power:1.50,bg:'back2/07.png',fallbackBg:'back/sougen4.png'},
    {id:'hawk2',name:'モブホークⅡ',stage:'草原Ⅱ',attribute:'風',image:'boss/01.png',symbol:'鷹',special:'ホークダイブ',kind:'aoe',power:1.32,bg:'back/sougen4.png',fallbackBg:'back/sougen.png'},
    {id:'debuff',name:'モブデーバフ',stage:'部族村',attribute:'地',image:'boss/11.png',symbol:'岩',special:'デストロイボム',kind:'single',power:1.60,bg:'back2/08.png',fallbackBg:'back/inaka4.png'},
    {id:'debuff2',name:'モブデーバフ第二形態',stage:'部族村',attribute:'地',image:'boss/12.png',symbol:'岩',special:'デストロイボム',kind:'single',power:1.75,bg:'back2/08.png',fallbackBg:'back/inaka4.png'},
    {id:'berserk',name:'モブバーサク',stage:'部族村',attribute:'地',image:'boss/13.png',symbol:'獣',special:'デストロイボム',kind:'single',power:1.82,bg:'back2/08.png',fallbackBg:'back/inaka4.png'},
    {id:'berserk2',name:'モブバーサク第二形態',stage:'部族村',attribute:'地',image:'boss/14.png',symbol:'獣',special:'デストロイボム',kind:'single',power:1.95,bg:'back2/08.png',fallbackBg:'back/inaka4.png'},
    {id:'dendenBoss',name:'モブデンデン',stage:'田舎町Ⅱ',attribute:'雷',image:'boss/15.png',symbol:'電',special:'マシンガングミ',kind:'multi',power:.78,hits:[3,6],bg:'back/inaka4.png',fallbackBg:'back/inaka.png'},
    {id:'umiDenden',name:'ウミモブデンデン',stage:'田舎町Ⅱ',attribute:'雷',image:'boss/16.png',symbol:'海',special:'マシンガングミ',kind:'multi',power:.88,hits:[3,6],bg:'back/inaka4.png',fallbackBg:'back/inaka.png'},
    {id:'moneyBoss',name:'モブマニー',stage:'ネオン街Ⅱ',attribute:'光',image:'boss/17.png',symbol:'銭',special:'バブルネオン',kind:'healSingle',power:1.55,bg:'back/neon4.png',fallbackBg:'back/neon.png'},
    {id:'neoMaster',name:'モブネオマスター',stage:'ネオン街Ⅱ',attribute:'光',image:'boss/18.png',symbol:'光',special:'バブルネオン',kind:'healSingle',power:1.72,bg:'back/neon4.png',fallbackBg:'back/neon.png'},
    {id:'dragon2',name:'モブドラゴンⅡ',stage:'マグマⅡ',attribute:'火',image:'boss/10.png',symbol:'竜',special:'ドラゴンフレイム',kind:'aoe',power:1.72,bg:'back/magma4.png',fallbackBg:'back/magma.png'},
    {id:'gidora',name:'モブギドラ',stage:'マグマⅡ',attribute:'火',image:'boss/19.png',symbol:'龍',special:'フル・ドラゴンフレイム',kind:'buffAoe',power:1.80,bg:'back/magma4.png',fallbackBg:'back/magma.png'},
    {id:'dorafara',name:'ドラファラモブ',stage:'砂漠Ⅱ',attribute:'火・闇',image:'boss/20.png',symbol:'炎',special:'フル・ドラゴンフレイム',kind:'buffAoe',power:1.90,bg:'back/sabaku4.png',fallbackBg:'back/sabaku.png'},
    {id:'gladi',name:'グラディモブ',stage:'魔王城',attribute:'火',image:'boss/39.png',symbol:'将',special:'将軍進撃',kind:'doubleAoe',power:1.0,bg:'back/maojo4.png',fallbackBg:'back/maojo.png'},
    {id:'lilithBoss',name:'モブリリス',stage:'魔王城',attribute:'闇',image:'boss/21.png',symbol:'薔',special:'ブラックホール',kind:'aoe',power:1.85,bg:'back/maojo4.png',fallbackBg:'back/maojo.png'},
    {id:'maou',name:'モブ魔王',stage:'魔王城',attribute:'闇',image:'boss/22.png',symbol:'王',special:'マスター・オブ・ピラミッド',kind:'aoe',power:2.12,bg:'back/maojo4.png',fallbackBg:'back/maojo.png'},
    {id:'natalie',name:'モブナタリー',stage:'マトリックス',attribute:'光',image:'boss/23.png',symbol:'光',special:'ダブルエナジー',kind:'burnSingle',power:1.75,bg:'back2/10.png',fallbackBg:'back/neon4.png'},
    {id:'smith',name:'モブスミス',stage:'マトリックス',attribute:'風',image:'boss/24.png',symbol:'眼',special:'ゴールデン・アイ',kind:'multiFixed',power:1.38,hits:[3,3],bg:'back2/10.png',fallbackBg:'back/neon4.png'},
    {id:'unlock',name:'モブアンロック',stage:'監獄',attribute:'地',image:'boss/25.png',symbol:'鎖',special:'悪意の行進',kind:'aoe',power:2.18,bg:'back2/11.png',fallbackBg:'back/maojo4.png'},
    {id:'yamigami',name:'モブヤミガミ',stage:'魔界',attribute:'火',image:'boss/26.png',symbol:'闇',special:'キャロット・ファイヤー',kind:'stunSingle',power:1.75,bg:'back2/12.png',fallbackBg:'back/maojo4.png'},
    {id:'yamigami2',name:'モブヤミガミ第二形態',stage:'魔界',attribute:'火',image:'boss/27.png',symbol:'闇',special:'ダブル・キャロット・ファイヤー',kind:'doubleSingleStun',power:1.32,bg:'back2/12.png',fallbackBg:'back/maojo4.png'},
    {id:'yamigamiDark',name:'モブヤミガミ・闇',stage:'魔界',attribute:'闇',image:'boss/28.png',symbol:'闇',special:'キャロット・バニッシュ',kind:'single',power:2.12,bg:'back2/12.png',fallbackBg:'back/maojo4.png'},
    {id:'enma',name:'モブ閻魔',stage:'魔界',attribute:'闇・火',image:'boss/30.png',symbol:'閻',special:'ヒノカグヅチ',kind:'single',power:2.25,bg:'back2/12.png',fallbackBg:'back/maojo4.png'},
    {id:'enma2',name:'モブ閻魔・第二形態',stage:'魔界',attribute:'闇・火',image:'boss/31.png',symbol:'閻',special:'レンゴクカグヅチ',kind:'aoe',power:2.18,bg:'back2/12.png',fallbackBg:'back/maojo4.png'},
    {id:'enmaFinal',name:'モブ閻魔・最終形態',stage:'魔界',attribute:'闇・火',image:'boss/32.png',symbol:'閻',special:'ゴウカノシンパン',kind:'aoeStun',power:2.35,bg:'back2/12.png',fallbackBg:'back/maojo4.png'}
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
