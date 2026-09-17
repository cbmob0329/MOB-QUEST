const fs=require('node:fs');
const game=fs.readFileSync(require('node:path').join(__dirname,'..','js','game.js'),'utf8');
if(!game.includes('window.__mobV195LilithIsolation=true')) throw new Error('v195 successor runtime missing');
if(game.includes('// UPDATE_V194_BEGIN')) throw new Error('obsolete v194 runtime still compiled');
console.log('update-v194 superseded by v195: OK');
