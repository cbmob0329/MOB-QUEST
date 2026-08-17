MOB QUEST v24

今回の更新
- 冒険ルートを草原～マグマⅡまで拡張。アップロードされた最新ボス.txtのレベル・画像・技を反映。
- 未設定技は属性/役割に応じた仮AI。通常/中ボス/ボスのステータスはLvと人数に応じて自動バランス。
- トレーニングの味方10枠を空きにでき、1人以上いれば戦闘開始可能。
- 敵は1～4体を必ず横一列表示。敵を囲っていた外側の四角い選択枠を削除。
- 味方の全体攻撃を正式仕様に合わせて修正。モブピンク/デザート/ニョロ/ジェリー/デンデン/テツ/リリス/ナラク等の全体必殺を複数敵へ適用。
- モブニョロ「マグマスイミング」: 通常攻撃が70%で敵全体攻撃。
- マグマⅡ「マグポヨ～」: 全体火属性小ダメージ + ATK 5%ダウンを仮実装。
- マグマⅡAREA4はモブドラゴンⅡ撃破後にモブギドラへ変身/次ウェーブ。

注記
- ストーリーイベントは未実装。モブエースの3ターン絶対勝利イベントは設定を保持しつつ、現段階ではトレーニング用の強敵として扱います。
- 部族村AREA4は現戦闘エンジン上、モブデーバフ+モブバーサク撃破後に第二形態2体が出る2ウェーブ戦として実装しています。
- ユーザー未指定の通常敵技は（仮）表記の一時設定です。

MOB QUEST playable core v23

[Monster / Adventure / Training expansion]
- 草原・砂漠・田舎町・ネオン街・マグマ・海底の通常モンスター、中ボス、ボスを登録。
- ユーザー指定のLv帯・属性・画像・既知の技/必殺を反映。
- 未設定の通常技/魔法は属性と役割に応じた仮AI/仮技として隔離実装。
- 通常 / 中ボス / ボスで別のTEMP_BALANCEステータス成長式を使用。
- 2～4体戦は敵1体ごとの攻撃倍率を人数に応じて抑え、理不尽な集中火力を軽減。
- ボスは従来どおり2回行動。

[Training]
- 敵を1～4体まで自由に設定可能。
- 同じ敵の複数配置、各敵のLv 1～99変更、通常敵/中ボス/ボス混成に対応。
- 草原～海底の新規敵に加え、従来の後半ボスもトレーニングカタログに維持。
- ランダム設定も1～4体の敵編成に対応。

[Adventure]
- 1ワールド = AREA1～AREA4。
- 各AREAで 探索→バトル を3回。1・2戦目はエリア通常敵からランダム1～4体。
- 4体出現は4%で低確率。
- 3戦目は設定済み中ボス/ボス編成。
- AREA4クリアで次ワールドへ移動。現在は草原→砂漠→田舎町→ネオン街→マグマ→海底まで。
- マグマAREA3はモブブリザード＋モブフレイム撃破後、モブフレザードの第2ウェーブ。
- レアのモブギミックは冒険で撃破すると10000 COIN。

[Multi enemy battle]
- 1～4体を同時表示し、敵をタップしてターゲット変更可能。
- HP、Lv、属性、状態異常を敵ごとに管理。
- 敵ごとの行動順、複数ボス2回行動、次ウェーブに対応。

[Source gaps kept temporary]
- 田舎町AREA1のモブダンサーは画像/属性が資料に無いため、enemy/45.png・火属性を仮使用。
- モブエースは資料にLv/技が無いため、トレーニング用Lv32・仮AI扱い。冒険AREA4には入れていない。
- 正式な敵ステータス、通常魔法/技の詳細は今後差し替え可能。

v20 HOME common scale, v21 asset/magic/ultimate stabilization, v22 weapon+element attack FX are retained.


[v25]
- Progression added through 砂漠Ⅱ and 魔王城 based on latest boss/enemy sheet.
- モブリリス player image changed to play/14.png.
- Initial party level changed to Lv5. Player base stat curve targets ~HP1200 at Lv99 and up to HP1500 at Lv120 after clearing 魔王城.
- Removed enemy-count/party-size automatic weakening. Enemy stats are fixed by level/category.
- Enemy sprite scale no longer changes with 1–4 enemies. Normal mobs use the 4-enemy footprint; slimes/small mobs are smaller, elites only slightly larger, bosses larger.
- Fixed enemy hit flash/shake selector for actual PNG sprites.
- Pure buff/heal ultimates no longer play enemy impact FX; buff/heal FX are placed on allies.
- Reactive passives such as サバクノマモリビト display earlier.
- Settings now includes full local save-data deletion for testing.

[v26]
- 冒険イベント/会話演出を砂漠～海底まで導入（未定のレコード名は未定のまま）
- セリフ吹き出し、ナレーション、フェード、ビックリマーク、落下/シェイク/フラッシュ演出
- ネオン街クリア後にモブエース3ターン強制終了イベント戦
- 砂漠/田舎町/ネオン街/マグマ/海底で仲間加入イベント
- 設定からテストモード：Lv1～120、現在パーティー一括Lv設定、戦闘×5 ON/OFF
- 設定から全データ削除し、勇者+モブピンク Lv5からイベントを再テスト可能
- 冒険中キャラをPNGの相対サイズを維持した共通倍率表示へ変更
- play画像を?v=相当のmqv=26で統一し、旧巨大PNGキャッシュの一瞬表示を抑止


[v27]
- Story event underlay party is hidden while events are active (no duplicate actors).
- Desert arrival staging: current party left, Desert right at the higher adventure-event baseline.
- Desert now fades in only after Pink says "誰か来ますよ！".
- Script newlines are now interpreted as separate speech bubbles (one source line per bubble).
- Bubble position/arrow is recalculated for each speaking actor.
