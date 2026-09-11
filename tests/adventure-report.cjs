const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
let chromium;
try{({chromium}=require('playwright'));}catch{({chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')));}
const root=path.resolve(__dirname,'..');
const injection=`window.adventureReportTest={
  seed(){state.adventure=defaultAdventure();state.meta.trainingPlayed=true;state.adventure.areaIndex=3;state.adventure.battleIndex=2;},
  clear(){advanceAdventureAfterWin();saveAdventure();renderHome();},
  open(){void openHomeAction('adventure');},
  report(){commitCastleReportProgressV126(state.adventure.awaitingReport);renderHome();},
  colors(){state.adventure=defaultAdventure();renderAdventure();applyAdventureAreaTheme();},
  snapshot(){return JSON.parse(JSON.stringify(state.adventure));}
};`;
(async()=>{
  const browser=await chromium.launch({headless:true,channel:'msedge'});
  try{
    const page=await browser.newPage({viewport:{width:390,height:844}});
    await page.route('http://mob.test/**',async route=>{
      const url=new URL(route.request().url()),file=path.resolve(root,'.'+(url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname)));
      if(!file.startsWith(root+path.sep))return route.fulfill({status:403,body:''});
      try{if(file===path.join(root,'index.html'))return route.fulfill({contentType:'text/html; charset=utf-8',body:fs.readFileSync(file,'utf8').replace('/* ===== END MOB QUEST v171 ===== */',injection)});await route.fulfill({path:file});}catch{await route.fulfill({status:404,body:''});}
    });
    await page.goto('http://mob.test/');
    await page.waitForFunction(()=>window.adventureReportTest);
    await page.evaluate(()=>{adventureReportTest.seed();adventureReportTest.clear();adventureReportTest.open();});
    await page.waitForFunction(()=>document.querySelector('#dialogText').textContent==='王様へ報告に行きましょう！');
    assert.equal(await page.locator('#dialogText').innerText(),'王様へ報告に行きましょう！');
    assert.equal(await page.locator('#adventureDepartureV126').count(),0);
    assert.equal(await page.locator('[data-home-action="adventure"]').first().getAttribute('aria-disabled'),'true');
    assert.equal((await page.evaluate(()=>adventureReportTest.snapshot())).awaitingReport.worldId,'grassland');
    await page.reload();await page.waitForFunction(()=>window.adventureReportTest);
    await page.evaluate(()=>adventureReportTest.open());
    await page.waitForFunction(()=>document.querySelector('#dialogText').textContent==='王様へ報告に行きましょう！');
    assert.equal(await page.locator('#dialogText').innerText(),'王様へ報告に行きましょう！');
    await page.evaluate(()=>{adventureReportTest.report();adventureReportTest.open();});
    assert.equal(await page.locator('[data-home-action="adventure"]').first().getAttribute('aria-disabled'),'false');
    assert.equal(await page.locator('#adventureDepartureV126').count(),1);
    await page.evaluate(()=>adventureReportTest.colors());
    for(const [selector,color] of [['#exploreBtn b','rgb(255, 255, 255)'],['#exploreTitle','rgb(23, 18, 13)'],['#exploreRewardText','rgb(23, 18, 13)']]){
      const actual=await page.locator(selector).evaluate(el=>{const s=getComputedStyle(el);return [s.color,s.webkitTextFillColor];});
      assert.deepEqual(actual,[color,color],selector);
    }
    console.log('PASS: clear -> report lock -> reload -> report -> unlock; exploration text colors');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
