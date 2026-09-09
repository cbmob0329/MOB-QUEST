MOB QUEST v123 REGRESSION REPORT

BASE
- v122 OPENING / PROGRAM / COMMAND UI STABLE

NEW
1. Standard loading screen always shows one of 12 MOB QUEST GUIDE cards.
2. Four unique guide topics are selected per load; TAP！ advances and stops after 4/4.
3. Square guide card preserves authored line/paragraph breaks and clamps/shrinks text to prevent overflow.
4. Standard loading route retained for normal transitions, HOME, battle startup, castle rooms.
5. Heavy image preload gates added for equipment, inventory, figure selection, weapon/armor/medal selection, gacha lineup, MOB PIECE deck/list.
6. Figure preloads resolve allowed figure filename candidates then warm/decode the resolved asset before rendering.
7. Existing opening-specific black curtain remains separate intentionally; it is story staging rather than a normal gameplay loading screen.
8. v122 opening bubble/program reward/command-button fixes and all earlier cumulative systems remain in place.

STATIC VALIDATION
- js/data.js syntax: PASS
- js/game.js syntax: PASS
- standalone inline JS syntax: PASS
- inline CSS == css/style.css: PASS
- inline JS == js/data.js + js/game.js: PASS
- 12 guide topics present: PASS
- TAP cap 4 cards: PASS
- square/overflow-safe guide CSS present: PASS
- v123 patch executes before v99 runtime guard / boot binding: PASS
- title v123 / GAME_ASSET_VERSION 123 / data header v123: PASS
