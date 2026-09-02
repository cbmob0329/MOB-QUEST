MOB QUEST v91 - POSTGAME GATE STABLE

BASE
- MOB-QUEST-playable-core-v90-CLIMAX-FIDELITY-STABLE.zip
- v90 stable boot/title/HOME/castle/subquest/equipment/weapon/tap interaction and climax code retained.

v91 CHANGES
- Implemented the post-game OTHER WORLD entrance that the ending already announced.
- After game clear, the Record Room changes from LOCKED to OTHER WORLD and opens an Other World hub.
- Added the canonical post-game index for "影の国の冒険日記":
  1. 影の世界 / 2. 影の城 / 3. 桃屋敷 / 4. 影の秘密 / 5. 影とヒカリ.
- Added the canonical boss/midboss/join index for the five Shadow chapters.
- Added the canonical "落ちた英雄" five-world index and listed its specified bosses/midbosses.
- Added "アンティークワールド" and "神の書" to the Other World hub without inventing missing battle data.
- Implemented the post-game EVENT QUEST entry in Training. It appears only after game clear (or test mode).
- Event Quest individual battles remain DATA WAIT because the supplied canonical files do not yet define their enemy/reward data.
- Kept the actual Lv120 cap unlock already working in v90 and surfaced LEVEL CAP 120 in the post-game UI.
- Fixed a v90 duplicate-function regression: the shortened final King-room report could override the complete version. v91 pins the full canonical report as the final runtime definition.
- Added the missing final-report lines "どういうことでありますか？" and "異世界！？" from the latest script.
- Castle Record Room menu label now changes dynamically: LOCKED -> BOOK -> OTHER WORLD.

STABILITY POLICY
- Built directly from v90 CLIMAX FIDELITY STABLE.
- No title boot rewrite, HOME layout replacement, battle core replacement, or save-key migration.
- Unknown post-game enemy stats/rewards were not fabricated.
