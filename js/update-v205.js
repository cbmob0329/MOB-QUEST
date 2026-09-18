// UPDATE_V205_BEGIN
/* v205: fix Mob Lilith history narration paragraphing. Keep each narration page to one or two intentional lines. */
const LILITH_HISTORY_PAGES_V205=[
  "モブネオンキングがネオン街を治めていた頃\n魔王様からネオン街を支配するよう命令が下った",
  "ネオン街に隠されている「ある秘宝」を手に入れるため\nグラディモブ モブドラゴン ミラモブ",
  "最高のメンバーでネオン街へ向かった",
  "ネオン街の王はモブドラゴンと互角\n気高い戦士だったけど兵力が違う",
  "魔王軍からしてみれば簡単な任務だった",
  "でも\nそんな時1人の魔女が現れた",
  "その魔女は数々のボスを一瞬で倒し\nグラディモブすら寄せ付けなかった",
  "しかし\n魔女は暴走しネオン街の王を攻撃した",
  "魔王軍は撤退し\nネオン街と魔女の戦いになる",
  "長い長い戦いの果て\nネオン街の戦士達によって",
  "ついに魔女は封印された",
  "それが\nある町の消滅と共に封印が解かれた",
  "そして今\n本来の力を失い勇者と旅をし",
  "僕の目の前にいる"
];
(function patchLilithHistoryParagraphsV205(){
  const steps=STORY_EVENTS?.['post:demonCastle:2']?.steps;
  if(!Array.isArray(steps))return;
  const history=steps.find(step=>Array.isArray(step)&&step[0]==='castleHistory178');
  if(history)history[1]=LILITH_HISTORY_PAGES_V205.slice();
})();
window.__mobBuildVersion='v205';
window.__mobV205LilithNarration=true;
// UPDATE_V205_END
