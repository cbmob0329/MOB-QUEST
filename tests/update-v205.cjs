const fs=require('fs');
const p=process.argv[2]||'js/game.js';
const s=fs.readFileSync(p,'utf8');
const must=[
  'UPDATE_V205_BEGIN',
  'LILITH_HISTORY_PAGES_V205',
  'でも\\nそんな時1人の魔女が現れた',
  'それが\\nある町の消滅と共に封印が解かれた',
  "window.__mobBuildVersion='v205'"
];
for(const x of must){if(!s.includes(x)){console.error('missing',x);process.exit(1)}}
console.log('v205 lilith narration static checks OK');
