MOB QUEST playable core v11

Updated from v10:
- HOME title logo enlarged substantially.
- MAIN party sprites normalized with small per-character visual-scale corrections (Pink smaller, Desert slightly larger).
- Battle MAIN 4 HUD rebuilt to make character art dominant; name/Lv/HP/MP compressed.
- Removed the SUPER SUB label from the battle HUD; support members remain visible as a compact row.
- Battle command buttons now display icon/02.png through icon/08.png only; duplicate text labels removed.
- Ultimate square-art extra hold changed to 0.3 sec, followed by a stronger explicit shake before disappearance.
- Magic frame playback now preloads/decodes the selected sequence and waits for paint frames before advancing.
- Battle loading now preloads only immediate battle assets instead of every ultimate/magic frame for all ten members.
- Passive activations now use a character-image cut-in and retain timing pauses.
- Random passive activation rates reduced to 80% of the previous test rates. Guaranteed/passive-by-definition effects remain guaranteed.
- Existing MAIN4 + support2 + reserve4, boss double action, mobile gesture lock, battle cut-ins, impact flashes/shakes remain.

Unconfirmed balance values remain temporary test values.


v13 修正: 必殺技演出を固定タイマー＋JSシェイクへ変更。画像ロード/演出エラーが発生しても戦闘キューを復旧する安全処理を追加。


[MOB QUEST v14]
- HOME background fast warm cache for ultimate and magic images.
- Ultimate banner and square art stay synchronized.
- Final 0.3s neon border trace before impact effect.
