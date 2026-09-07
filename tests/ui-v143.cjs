const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
let chromium;
try{({chromium}=require('playwright'));}catch{({chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')));}
const injection=`
window.uiTestV143={
  story(text){showScreen('adventure');const scene=$('#storyScene');scene.hidden=false;scene.classList.add('active');void storySayLine('nekoku',text);},
  hide(){ $('#storyScene').hidden=true;$('#storyBubble').hidden=true;$('#dialogOverlay').hidden=true;$('#passiveCutin').hidden=true; },
  facility(text){void tavernTalkExactV98(text);},
  narration(text){void narrationDialog(text);},
  castle(text){renderThroneRoom();showScreen('castle');showCastleSpeech('モブスライムキング',text,$('[data-castle-actor="king"]'),'right');},
  battle(text){showScreen('battle');const box=$('#passiveCutin');box.hidden=false;box.classList.add('battle-story-dialogue-v133');$('#passiveCutinText').textContent=text;},
  seed(){state.party=[['yusha',30],['pink',30],['jessie',30]];state.coins=100000;state.meta.coins=state.coins;state.meta.weapons={'01':3,'02':2};state.meta.armors={'01':2,'02':1};state.meta.equipment={yusha:{main:'01',sub:null,armor:'01',medals:[]},pink:{main:null,sub:null,armor:'02',medals:[]}};state.adventure=defaultAdventure();state.meta.gameCleared=false;saveMeta();saveParty();saveAdventure();},
  gear(){openEquipmentScreen();},
  tab(tab){equipmentTab=tab;renderEquipment();showScreen('equipment');},
  picker(kind){return openWeaponPicker('yusha',kind,0,renderEquipment);},
  smith(mode){showScreen('castle');renderBlacksmithPopup(mode);},
  snapshot(){return {coins:state.coins,armor:{...state.meta.armors},weapons:{...state.meta.weapons},eq:JSON.parse(JSON.stringify(state.meta.equipment)),tradeBusy:gearTradeBusyV143,screen:[...document.querySelectorAll('.screen.active')].map(x=>x.id)};},
  funds(n){state.coins=n;saveMeta();},
  async staleSell(){const p=tradeEquipmentV143('sell','armor','01');state.meta.equipment.jessie={armor:'01'};return p;},
  camp(){showScreen('adventure');$('#campOverlay').hidden=false;syncCampModalV133();return openWeaponPicker('yusha','armor',0,()=>{});}
};
`;
async function lineInfo(el){
  const lines=new Map(),walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let node;
  while(node=walker.nextNode()){
    let offset=0;
    for(const char of node.textContent){
      const range=document.createRange();range.setStart(node,offset);offset+=char.length;range.setEnd(node,offset);
      const rect=range.getBoundingClientRect();if(!char.trim()||!rect.width)continue;
      const key=Math.round(rect.top);lines.set(key,(lines.get(key)||'')+char);
    }
  }
  const r=el.getBoundingClientRect(),s=getComputedStyle(el);
  return {lines:[...lines.values()],text:el.textContent,width:r.width,left:r.left,right:r.right,scroll:el.scrollWidth,client:el.clientWidth,font:s.fontSize,wrap:s.textWrap,word:s.wordBreak,white:s.whiteSpace};
}
async function main(){
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  for(const file of ['css/style.css','js/data.js','js/game.js'])assert(html.includes(fs.readFileSync(path.join(root,file),'utf8').trim()),`${file} inline mismatch`);
  const browser=await chromium.launch({headless:true,channel:'msedge'});
  try{
    const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.route('http://mob.test/**',async route=>{
      const url=new URL(route.request().url()),file=path.resolve(root,'.'+(url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname)));
      if(!file.startsWith(root+path.sep))return route.fulfill({status:403,body:''});
      try{if(file===path.join(root,'index.html'))return await route.fulfill({contentType:'text/html; charset=utf-8',body:html.replace('/* ===== END MOB STORY v143 ===== */',injection)});await route.fulfill({path:file});}catch{await route.fulfill({status:404,body:''});}
    });
    await page.goto('http://mob.test/',{waitUntil:'load'});await page.waitForFunction(()=>window.__mobV143Runtime);
    const phrase='海底は平和だ。だから守らないと';
    for(const width of [320,360,390,430]){
      await page.setViewportSize({width,height:844});
      // Reload removes unresolved tap-to-continue promises from the previous screen.
      for(const [surface,selector] of [['story','#storyText'],['facility','#dialogText'],['narration','#dialogText'],['battle','#passiveCutinText'],['castle','#castleSpeech p']]){
        await page.reload({waitUntil:'load'});
        await page.evaluate(({surface,phrase})=>window.uiTestV143[surface](phrase),{surface,phrase});
        await page.locator(selector).waitFor({state:'visible'});
        const info=await page.locator(selector).evaluate(lineInfo);
        assert.equal(info.text,phrase,`${surface}: text changed`);
        assert(info.lines.length>0&&info.lines.every(line=>[...line].length>1),`${width}/${surface}: orphan ${JSON.stringify(info)}`);
        assert(info.scroll<=info.client+1&&info.left>=-1&&info.right<=width+1,`${width}/${surface}: overflow ${JSON.stringify(info)}`);
        console.log(`PASS ${width}px ${surface}: ${info.lines.join(' / ')}`);
        if(width===390&&surface==='story')await page.screenshot({path:path.join(process.env.TEMP,'mob-story-v143-dialog.png')});
      }
    }
    await page.setViewportSize({width:390,height:844});await page.reload({waitUntil:'load'});
    await page.evaluate(()=>{window.uiTestV143.seed();window.uiTestV143.gear();});
    await page.locator('#equipmentScreen.active').waitFor();
    assert.equal(await page.locator('[data-equipment-tab]').count(),5);
    await page.screenshot({path:path.join(process.env.TEMP,'mob-story-v143-equipment.png')});
    await page.evaluate(()=>window.uiTestV143.picker('armor'));
    assert(await page.locator('#weaponPickerList .gear-delta-v143').count()>0,'Missing comparison');
    await page.getByRole('searchbox',{name:'装備候補を検索'}).fill('存在しない名前');
    assert.equal(await page.locator('#weaponPickerList .weapon-picker-item:not(.clear):visible').count(),0,'Picker search');
    await page.getByRole('searchbox',{name:'装備候補を検索'}).fill('');
    await page.locator('[data-picker-armor="01"]').click();
    assert.equal((await page.evaluate(()=>window.uiTestV143.snapshot())).eq.yusha.armor,'01');
    await page.locator('[data-equipment-tab="sell"]').click();
    await page.screenshot({path:path.join(process.env.TEMP,'mob-story-v143-sell.png')});
    assert(await page.locator('[data-gear-trade="02"][data-gear-kind="armor"]').isDisabled(),'Equipped armor must be protected');
    let before=await page.evaluate(()=>window.uiTestV143.snapshot());
    await page.locator('[data-gear-trade="01"][data-gear-kind="armor"]').click();
    await page.locator('[data-cancel]').click();
    assert.deepEqual(await page.evaluate(()=>window.uiTestV143.snapshot()),before,'Cancel mutated save');
    await page.locator('[data-gear-trade="01"][data-gear-kind="armor"]').click();
    await page.getByRole('spinbutton').fill('2');assert(await page.locator('[data-confirm]').isDisabled(),'Cannot sell equipped copy');
    await page.getByRole('spinbutton').fill('1');await page.locator('[data-confirm]').click();
    await page.locator('.gear-transaction-v143').waitFor({state:'detached'});
    let after=await page.evaluate(()=>window.uiTestV143.snapshot());
    assert.equal(after.armor['01'],1);assert(after.coins>before.coins);assert.equal(after.eq.yusha.armor,'01');
    assert(await page.locator('[data-gear-trade="01"][data-gear-kind="armor"]').isDisabled());
    console.log('PASS armor sale, cancel, quantity validation, equipped-stock protection');
    await page.locator('[data-equipment-tab="shop"]').click();
    const buy=page.locator('[data-gear-trade]').first(),buyId=await buy.getAttribute('data-gear-trade');
    before=await page.evaluate(()=>window.uiTestV143.snapshot());await buy.click();
    await page.getByRole('spinbutton').fill('2');await page.locator('[data-confirm]').click();await page.locator('.gear-transaction-v143').waitFor({state:'detached'});
    after=await page.evaluate(()=>window.uiTestV143.snapshot());assert.equal(after.weapons[buyId],(before.weapons[buyId]||0)+2);assert(after.coins<before.coins);
    await page.screenshot({path:path.join(process.env.TEMP,'mob-story-v143-shop.png')});
    await page.reload({waitUntil:'load'});let saved=await page.evaluate(()=>window.uiTestV143.snapshot());
    assert.equal(saved.weapons[buyId],after.weapons[buyId]);assert.equal(saved.armor['01'],1);assert.equal(saved.eq.yusha.armor,'01');assert.equal(saved.coins,after.coins);
    console.log('PASS quantity purchase and save/reload consistency');
    await page.evaluate(()=>{window.uiTestV143.funds(0);window.uiTestV143.tab('shop');});
    assert.equal(await page.locator('[data-gear-trade]:enabled').count(),0,'Insufficient funds');
    await page.evaluate(()=>{window.uiTestV143.seed();window.uiTestV143.smith('sell');});
    assert(await page.locator('#blacksmithPopup [data-gear-kind="armor"]:enabled').count()>0,'Blacksmith sale access');
    await page.reload({waitUntil:'load'});await page.evaluate(()=>{window.uiTestV143.seed();void window.uiTestV143.staleSell();});
    await page.locator('[data-confirm]').click();assert(await page.locator('[data-confirm]').isDisabled(),'Confirm must recheck equipped stock');await page.locator('[data-cancel]').click();
    saved=await page.evaluate(()=>window.uiTestV143.snapshot());assert.equal(saved.armor['01'],2);
    await page.reload({waitUntil:'load'});await page.evaluate(()=>{window.uiTestV143.seed();return window.uiTestV143.camp();});
    assert((await page.evaluate(()=>window.uiTestV143.snapshot())).screen.includes('adventureScreen'),'Camp picker changed screen');
    console.log('PASS stock recheck, blacksmith access and camp context');
    assert.deepEqual(errors,[],'Browser runtime errors');
    await context.close();console.log('PASS v143 UI and transaction checks');
  }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
