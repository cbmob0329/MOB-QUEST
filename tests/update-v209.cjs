const fs=require('fs'),assert=require('assert'),path=require('path');
const root=path.resolve(__dirname,'..');
const game=fs.readFileSync(path.join(root,'js/game.js'),'utf8');
const css=fs.readFileSync(path.join(root,'css/style.css'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');

assert(game.includes('// UPDATE_V209_BEGIN'),'v209 runtime patch missing');
assert(game.includes("window.__mobBuildVersion='v209'"),'v209 build marker missing');
assert(html.includes('<div class="title-version">v209</div>'),'v209 title missing');

// Boss is story-only downsized; battle sizing is not modified by this patch.
assert(game.includes("key!=='book-kaijin-boss'"),'Kaijin story-only sizing guard missing');
assert(game.includes('multi ? 0.185 : 0.30'),'Kaijin story sizing cap missing');

// Enhanced entrance must use the boss art and replace the old Area 3 runner.
assert(game.includes('async function bookKaijinBossEntranceV209()'),'enhanced Kaijin entrance missing');
assert(game.includes("storyActorInfo('book-kaijin-boss')"),'Kaijin entrance does not use boss art');
assert(game.includes("BOOK_RUNNERS_V207['pre:unfinishedBook:2']=bookArea3PreV209"),'Area 3 runner was not replaced');
assert(css.includes('.book-kaijin-intro-v209'),'enhanced Kaijin entrance CSS missing');
assert(css.includes('.kaijin-portal-v209'),'Kaijin portal effect missing');
assert(css.includes('.kaijin-seal-v209'),'Kaijin MOB seal effect missing');

// Join redraw order: conceal row -> join/render -> restore relocated Hero -> reveal row.
const joinStart=game.indexOf('moveBookBossIntoPartyV207=async function(){',game.indexOf('// UPDATE_V209_BEGIN'));
assert(joinStart>=0,'v209 Kaijin join override missing');
const joinEnd=game.indexOf('showBookNaviHeroDuelV207=async function(){',joinStart);
const joinBlock=game.slice(joinStart,joinEnd);
const conceal=joinBlock.indexOf("classList.add('book-party-rebuild-v209')");
const join=joinBlock.indexOf("storyJoin('kaijin')");
const render=joinBlock.indexOf('await renderStoryParty');
const hideHero=joinBlock.indexOf('hideStoryPartyHeroV94(true)');
const reveal=joinBlock.indexOf("classList.remove('book-party-rebuild-v209')");
assert(conceal>=0&&join>conceal&&render>join&&hideHero>render&&reveal>hideHero,'atomic Kaijin join redraw order is unsafe');
assert(css.includes('.story-party-line.book-party-rebuild-v209{visibility:hidden!important'),'party rebuild conceal CSS missing');
assert(css.includes('bookKaijinPartyArriveV209'),'intentional Kaijin arrival animation missing');

// Hero + Navi stage is explicitly placed in the enemy lane.
assert(css.includes('.story-guest-group.book-navi-hero-duel-v207{'),'Hero/Navi duel layout missing');
assert(css.includes('bottom:46%!important'),'enemy-lane vertical placement missing');
assert(game.includes("storyShowSecondaryGuestsV94(['book-navi','yusha'],'book-navi-hero-duel-v207 book-duel-resume-v208')"),'Hero/Navi group is not created directly in staged position');

// Inline build must contain the same patch after sync.
assert(html.includes('// UPDATE_V209_BEGIN'),'inline v209 JS missing');
assert(html.includes('/* ===== MOB STORY v209: KAIJIN BOSS / READING BOOK PRESENTATION ===== */'),'inline v209 CSS missing');
console.log('v209 static checks: PASS');
