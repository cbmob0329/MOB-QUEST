MOB QUEST v92 - BOOK FIDELITY / BATTLE UI STABLE

BASE
- MOB-QUEST-playable-core-v91-POSTGAME-GATE-STABLE.zip
- v91のタイトル / HOME / お城 / 冒険 / 装備 / サブクエスト / クリア後ゲートを維持。

v92 修正
1. 「読みかけの本.txt」を基準に、読みかけの本ルートを台詞省略なし方向へ復元。
   - 魔王城報告 → 7枚のレコード → レコードルーム → 読みかけの本出現
   - 本の世界到着
   - AREA 1～4 前後イベント
   - 勇者ダウン / 黒塗り
   - あのヒーロー変身（パーティー画像も play/13.png）
   - モブナビの正体説明
   - 勇者単独3ターン戦
   - モブナビマスター前の実パーティー編成
   - 戦闘後の仲間加入 / 新必殺技 / レコードルーム帰還 / 王様の台詞
2. 変身能力の数値説明ナレーションを削除（原文仕様「ナレーションなど説明不要」）。
3. 読みかけの本の敵画像を個別スケール＋最大サイズ上限で縮小。
4. 魔王城 / 魔王城II のモブリリス敵画像を縮小（旧 1.18 → v92 0.64 + 上限）。
5. 特技ボタンを他の戦闘ボタンと同一ボックス / 同一アイコン占有率へ統一。
6. 必殺技CTが 0 になった瞬間に「必殺技CTが溜まった！」演出を表示。
7. 会心表示を中央バナーから廃止。
   - 敵の位置に「会心の一撃！」
   - その直下に会心ダメージ数値
8. 読みかけの本の「あのヒーロー」は通常攻撃だけでなく魔法・特技・単体攻撃型必殺も全体攻撃化。
9. GAME_ASSET_VERSION を 92 に更新。

NOTES
- 添付アセットフォルダは従来どおりこのコードZIPには含めていません。
- v91セーブキーは変更していません。v91からそのまま継続できます。


=== v93 ===
Reading Book uses back/yomi1.png through back/yomi4.png and is entered only from the book in the Record Room. Test selection prepares that book in the Record Room. The Record Room is unlocked from the start. Adventure quit moved into CAMP. Subquests now expose only one global next quest (starting Grassland QUEST 1), and the required-party warning no longer shows a literal \n.

=== v94 ===
Base: v93 BOOK ENTRY / SUBQUEST FIX STABLE.
- Reading Book event entrance scale reduced for Mob Navi / Navi Master / minions / captain.
- Awakened executives: red boss/55.png, blue boss/56.png.
- AREA3 Hero stays normal until a large black sphere attack visibly hits, then becomes black/down.
- Downed Hero stays black on the normal Adventure field with no one-frame normal-art flash.
- Adventure field level badges removed.
- AREA3 Navi now appears beside the Kaijin boss; the boss leaves only after its scripted line.
- Money's 「なーに言ってるのよ！」 bubble/text enlarged.
- Hero transformation disappears first, then play/13.png slowly fades in, slightly larger than normal Hero.
- After 「俺は、、」 transformed Hero is staged to Navi's right.
- After 「ぐは・・ッ」 Kaijin boss moves down to the party side.
- Navi Master party immortality removed.
- Navi Master 80% damage reduction now applies only while barrier is active; barrier break allows full damage.


=== v95 ARMOR / DEMON CASTLE FIDELITY ===
Base: v94 BOOK STAGING / NAVI MASTER FIX STABLE.
- Armor 01-67 retained as canonical drop-only equipment; dedicated Armor equipment tab restored.
- Armor subquest drops, stat/trait effects, inventory, equipping, and 100% blacksmith sale retained.
- Demon Castle dialogue rebuilt from the newly uploaded canonical script.
- Tavern facility buttons are icon-only.
- Demon Castle exploration uses dark red-purple and white text.
- Unlearned ultimate skills are not rendered in the battle ultimate list.
- Castle menu labels use white banners for readability.


=== v96 OPENING / FIGURE GACHA / MOB PIECE TRIAL ===
Base: v95 ARMOR / DEMON CASTLE FIDELITY STABLE.
- Opening castle speech anchors to visible character art.
- Adventure is locked until Training is used; pressing Adventure guides directly to Training.
- Tavern/coaching facility dialogue uses natural browser wrapping, preventing orphan symbols and overflow.
- Event Quest guide replaced with one line: 「今はまだ利用できないぞ！」.
- Subquests require the corresponding main story world to be cleared; Grass QUEST 1 no longer appears before Grass clear.
- All party-formation cards use beige/black presentation, larger numeric text, and a green HP bar.
- Figure tag RPG resonances 41-52 restored; tag 52 Reading Book added.
- Figure gacha 001-022 implemented from uploaded pools. Rates: R50 / SR30 / SSR15 / UR4.5 / MOB0.5; 10th pull SR+ guaranteed; pickup shares 55% of its rarity bucket.
- MOB Piece Battle trial implemented in Maple menu: 25-card deck, five-card draw, center move/exchange cost, center Power +50%, tag effects, best-of-three CPU battle, trial Rank points.
- MOB Piece tag effects 01-08 use uploaded specification; 09-52 are provisional balanced effects designed for the trial.

- Final validation: area-tag resonances 41-48/52 now apply +10% all stats only in their matching battle area; 3-piece adds 10% damage reduction.
- Gacha 017/020/022 are intentionally data-wait/disabled because the uploaded gacha spec conflicts with or references figure definitions absent from the uploaded figure lists. No wrong character is substituted.


=== v97 ===
Base: v96 FIGURE GACHA / MOB PIECE STABLE.
- Maple tavern introduction split into two exact subtitle cards.
- Maple figure-shop introduction split into two exact subtitle cards.
- Repeat shop line changed to 「やっほ〜 / どのガチャにする？」.
- Explicit Maple line breaks are preserved instead of being auto-reflowed.
- Figure-shop popup is rendered while hidden, then shown after layout is ready.
- Maple portrait in the figure shop is hard-limited to a compact contained size; native-size image overflow bug fixed.
- Figure-shop card now scrolls vertically instead of clipping its gacha UI.


=== v98 ===
Base: v97 MAPLE DIALOG / FIGURE SHOP FIX STABLE.
- Tavern host dialogue uses explicit authored line breaks and does not auto-reflow them.
- Irukaeru bubble pointer moved upward to head/upper-body level instead of feet.
- Corrected Maple introduction and shop dialogue pagination.
- Figure gacha popup now opens directly below the page header instead of as a shallow bottom sheet.
- Gacha selection is a horizontal swipe carousel of gacha/XXX.png banners.
- A capture handler blocks the legacy static FIGURE SHOP placeholder path.
- Existing v96/v97 gacha logic, rates, lineup, draw, results, and Mob Piece Battle remain in use.


=== v99 ===
Base: v98 TAVERN DIALOG / GACHA CAROUSEL STABLE.
ROOT CAUSE FIX:
- v95-v98 patch blocks had been appended after the main game IIFE was already closed.
- v95 therefore threw ReferenceError: renderEquipment is not defined at startup.
- Because execution stopped there, v96/v97/v98 code existed in the file but never became active.
- v95-v98 blocks are now inside the core game scope and execute before boot event binding.

TAVERN / MAPLE:
- Exact manual dialogue line breaks now execute.
- Maple intro: 「やっほ〜 / モブメープルです！」 then separate 「これからよろしくねー」.
- Irukaeru corrected lines execute with exact breaks.
- Maple shop first/repeat dialogue uses the requested split.
- v98 upper-body speech layout is now actually active.

FIGURE GACHA:
- The obsolete static FIGURE SHOP placeholder is no longer the active path.
- Figure button renders the real horizontal swipe carousel before the popup becomes visible.
- Popup opens high on screen rather than as a shallow bottom panel.
- Static fallback text no longer claims lineup/rates are undecided.
