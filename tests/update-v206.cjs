const fs=require('node:fs');
const src=fs.readFileSync(require('node:path').join(__dirname,'..','js','game.js'),'utf8');
function must(x,msg){if(!x)throw new Error(msg);}
must(src.includes('function resetReusableStoryGuestVisualV206'), 'v206 reset helper missing');
must(src.includes("['opacity','filter','transform','translate','rotate','scale','visibility','display']"), 'stale visual properties are not cleared');
must(src.includes('const storyShowGuestBaseV206=storyShowGuest'), 'storyShowGuest wrapper missing');
must(src.includes("window.__mobBuildVersion='v206'"), 'build version not v206');
const final=src.slice(src.lastIndexOf('demonFinalPreV89Final=async function()'));
must(final.includes("await storyHideGuests();await storyShowGuest('boss-maou-castle',{slow:true})"), 'Demon King re-show after Ace sequence missing');
console.log('v206 reusable story guest reset: PASS');
