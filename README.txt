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


=== v100 ===
Base: v99 RUNTIME SCOPE / TAVERN GACHA FIX STABLE.
- Gacha detail/banner surfaces are hidden before confirmation, pull cinematic, and result.
- New capsule gacha cinematic: shaking capsule, accelerating MOB text orbit, text ingestion, glow, figure reveal.
- Result cards use rarity-sensitive glow and stronger reveal.
- Mob Piece Battle updated to canonical 2026-09-03 revision: exactly 25 unique pieces, max deck cost 80, SPD stat, center all stats +25%, move once and exchange once per turn, sequential five-card draw, 5v5 cartoon fight, first to two wins.
- Test mode: Items MAX / Coin MAX / Diamond MAX are persistent ON/OFF locks while test mode is enabled.
- Tavern menu icons: white wood-grain black-text labels and slow floating animation.
- Blacksmith exit line restored for castle back/home path.
- Castle menu banner typography/shadows improved.
- Equipment opened from Castle/Tavern/Training now keeps that facility background and BACK returns to that facility.
- Subquest battle enemy art is reduced slightly only for subquests.


=== v101 ===
Base: v100 GACHA / MOB PIECE / FACILITY UX STABLE.
- Castle menu: 「レコードルーム」 label no longer orphan-wraps; castle plaque text is thicker/bolder.
- Gacha cinematic capsule switched to icon/32.png.
- Gacha intro line changed from 「MOBの文字が集まっている…」 to 「フィギュア錬成パワーが集まっている…」.
- Orbiting MOB letters now use varied fonts and colors.
- Gacha result/readability pass: darker-banner black-text issues corrected; result presentation is brighter and easier to read.
- Figure cards/results now use chained image fallbacks to reduce missing-figure blanks.
- Mob Piece Battle: quitting a match now asks 「はい / いいえ」.
- Mob Piece Battle readability improved: brighter panels, clearer text, larger total-stat presentation, and more explicit active-effect display.
- Mob Piece battle animation strengthened: both teams gather centrally, white outlined cartoon smoke clouds, visible figure silhouettes peeking through, and star hit accents.
- GAME_ASSET_VERSION updated to 101.


=== v101 FINAL SYNC ===
- Standalone index.html rebuilt from final v101 CSS/JS.
- Figure image recovery now applies globally to fig / figene / figboss surfaces using safe filename variants before a generic fallback.
- Record Room plaque hardened against narrow-phone orphan wrapping.


=== v102 ===
Base: v101 CASTLE / MOB PIECE / GACHA FIX STABLE.
- Mob Piece deck header/empty-state spacing rebuilt.
- Added rarity/tag sort and filters to deck and 5-column Figure List.
- Deck add/remove preserves scroll position.
- Center move, exchange, deck clear/confirm, and quit use in-overlay yes/no confirmation (no Maple dialogue behind overlay).
- Battle UI: center reserved for BATTLE FLOOR; actual 5v5 brawl now renders in center with smoke/stars; only total stats and active tags remain as text.
- Strict contrast pass for Mob Piece UI.
- Gacha icon/32 square-shadow CSS removed; barrel shards/burst before figure reveal; rarity effects strengthened.
- 10-pull results reveal one figure at a time with NEXT below the figure.


=== v103 ===
Base: v102 MOBPIECE / GACHA UX STABLE.
- Undefined figure #17 is excluded from gacha/Mob Piece until canonical data exists.
- Gacha result images are preflight-loaded; failed image entries reroll instead of showing the barrel fallback.
- 10-pull cinematic no longer previews the highest rarity result before result 1/10.
- Rarity neon label beside each revealed figure and stronger rarity-specific reveal effects.
- Mob Piece tag/rarity filters preserve scroll position.
- Mob Piece movement buttons removed. Player cards can be dragged to reorder freely; card detail provides tap-based position selection.
- Placement can be changed repeatedly and TOTAL stats animate as green outlined counters.
- Exchange is once per round, confirmed, and uses outgoing/incoming animation.
- Tapping a player piece opens stats, details, active effects, placement buttons and a required close button.
- Mob Piece uses persistent PLAYER LIFE bars; damage animates and LIFE 0 loses. No draw result.
- Central battle floor brawl animation strengthened with colliding figures, outlined white cartoon smoke and hit stars.
- Figure/armor/equipment assets are preloaded on demand to reduce blank-image flashes.


=== v104 PLAYER BALANCE / LEARNSET FORMAL ===
Base: v103 GACHA / MOBPIECE LIFE STABLE.
- Formalized player base stat curves for 13 characters.
- Lv80 with endgame equipment is the target for clearing Demon Castle II.
- Added primary/sub attributes, base elemental resistances and individual status resistances.
- Added per-character level learnsets for single-target magic and techniques.
- Third-tier elemental magic is learned at Lv46 where applicable.
- All-target magic is NOT included in level learnsets (reserved for item learning).
- Ultimate unlocks remain Lv1 / 15 / 30 / 50; story fifth ultimates remain story unlocks.
- Added recommended levels: Desert 10 -> Demon Castle II 80; Grassland has no recommendation.
- Existing saves receive a one-time HP/MP refill to migrate safely to the larger v104 max values.


=== v105 ENEMY BALANCE / RESISTANCE / SKILLS ===
Base: v104 PLAYER BALANCE / LEARNSET STABLE.
- Formalized enemy stat curves for all enemy categories.
- Every enemy template now receives elemental resistance and status resistance.
- Bosses are completely immune to paralysis.
- Other boss status ailments can persist only 1-2 turns (flinch max 1).
- Existing authored boss/midboss specials from the boss specification are preserved.
- Previously generic enemies receive level/attribute-based formal magic or techniques instead of temporary placeholder attacks.
- Player-side elemental/status resistances from v104 remain active in battle.
- Target balance: Lv80 + strongest equipment can clear Demon Castle II.

=== v106 DEMON CASTLE PROGRESSION / STAGING FIX ===
Base: v105 ENEMY BALANCE / RESISTANCE / SKILLS STABLE.
- Fixed Demon Castle party split progression deadlock. Confirmation is now rendered inside the split overlay with explicit はい / いいえ, so it cannot hide behind the higher-z-index formation layer.
- Demon King silhouette is applied before the guest group is revealed; the full-color boss no longer flashes for a frame.
- Demon Castle background loading resets stale fallback history and uses a multi-stage castle fallback chain. The adventure background stays hidden while a fallback is loading instead of exposing a broken-image glyph.
- Kira Witch + Lara Witch 「お命頂戴！」 is now simultaneous character dialogue instead of explanatory narration.
- Post-Area1 witch absorption is now visual staging: Lilith appears between the two witches; both glow, shrink and merge into Lilith before disappearing.
- Lilith's four sisters summon is rebuilt as a five-character group (Lilith + 4 sisters), compact enough to fit the phone screen, with staggered summon animation.
- Demon King + Ace retreat uses a teleport animation rather than simply disappearing.
- v103-v105 runtime blocks were moved back inside the core IIFE before boot, preventing the old out-of-scope runtime-patch architecture regression.
- GAME_ASSET_VERSION and title version updated to v106.
- Final v106 safeguard: restored the complete STORY_EVENTS registry after runtime-scope relocation and added explicit Demon Castle actor image fallbacks (Ace / Demon King / Lilith / witches / four sisters).
