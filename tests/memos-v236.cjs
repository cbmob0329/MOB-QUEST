const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{open,root}=require('./story-v172-harness.cjs');
const injection=`
window.memoTest={
 setup(){state.party=[['yusha',20],['pink',20]];state.meta.seenMemosV236={};state.meta.openingCompleted=false;state.meta.trainingPlayed=true;state.training.mode='menu';state.adventure.awaitingReport=false;state.test.enabled=true;openingSequenceBusy=false;storyBusy=false;loadingWithAssets=async()=>{};ensureCriticalBackgroundV128=async()=>{};showHomeUnlockAnnouncementsV137=async()=>{};window.talks=[];facilityTalk=async(text,name)=>{window.talks.push({text,name});if(window.holdTalk)await new Promise(r=>window.releaseTalk=r);};facilitySequenceV155=async(texts,name)=>{for(const text of texts)await facilityTalk(text,name);};maybeRunArrivalStory=async()=>{window.arrived=true;};worldCleared=()=>true;saveMeta();},
 run(name,arg){window.memoDone=false;window.memoFailure='';const actions={home:()=>goHome(),tavern:()=>enterTavern(),smith:()=>openBlacksmithFacility(),camp:()=>openCamp(),adventure:()=>handleAdventureEntry(),training:()=>setTrainingMode(arg),figures:()=>openFigureExtraV218(),shop:()=>openTavernFigureShopV98()};Promise.resolve().then(actions[name]).then(()=>window.memoDone=true).catch(e=>window.memoFailure=e.stack);},
 completed(value){state.meta.openingCompleted=value;},
 seen(){return state.meta.seenMemosV236||{};},
 forget(id){delete state.meta.seenMemosV236[id];saveMeta();},
 collection:()=>openMemoCollectionV236(),
 request:id=>{void firstMemoV236(id);},
 screen:name=>showScreen(name),
 event:view=>{eventViewV163=view;renderEventQuestsV163();},
 locked(value){worldCleared=()=>!value;state.test.enabled=!value;},
 awaiting(value){state.adventure.awaitingReport=value;},
 hide(){for(const id of ['campOverlay','trainingFeaturePopup','figureChooseV220','tavernFigurePopup']){const el=document.getElementById(id);if(el)el.hidden=true;}},
 loadSaved(){state.meta=loadMeta();renderHome();showScreen('home');},
 ownerChange(){state.meta={...state.meta,seenMemosV236:{}};},
 opening(){this.setup();openingNarrationSequenceV78=openingCastleSay=openingSceneCaption=waitForOpeningCastleV118=homeTutorialSay=async()=>{};fixedDelay=async()=>{};window.memoDone=false;window.memoFailure='';runOpeningV74().then(()=>window.memoDone=true).catch(e=>window.memoFailure=e.stack);},
 catalog:MEMOS_V236
};`;
(async()=>{
 const {browser,page,errors}=await open(injection);page.setDefaultTimeout(15000);
 const out=path.join(root,'artifacts/memos-v236');fs.mkdirSync(out,{recursive:true});
 const call=(name,arg)=>page.evaluate(([n,a])=>window.memoTest.run(n,a),[name,arg]);
 const done=()=>page.waitForFunction(()=>window.memoDone||window.memoFailure).then(async()=>assert.equal(await page.evaluate(()=>window.memoFailure),''));
 const memo=async(id)=>{const info=await page.evaluate(id=>window.memoTest.catalog.find(x=>x.id===id),id);await page.locator('.memo-modal-v236 h2').filter({hasText:info.title}).waitFor();await page.waitForFunction(()=>document.querySelector('.memo-image-v236')?.naturalWidth>0);assert.equal(await page.locator('.memo-modal-v236').count(),1);assert.equal(await page.evaluate(id=>window.memoTest.seen()[id],id),true);};
 const close=()=>page.locator('.memo-modal-v236 [data-memo-close]').click();
 try{
  await page.evaluate(()=>window.memoTest.setup());
  await call('home');await done();assert.equal(await page.locator('.memo-modal-v236').count(),0);
  await page.locator('#memoButtonV236').click();assert.match(await page.locator('.memo-body-v236').innerText(),/まだメモを見ていません/);await close();
  await page.evaluate(()=>window.memoTest.completed(true));await call('home');await memo('status');
  await page.screenshot({path:path.join(out,'opening-status.png')});await close();await memo('combat');await close();await done();
  await call('home');await done();assert.equal(await page.locator('.memo-modal-v236').count(),0);
  await page.evaluate(()=>window.memoTest.collection());assert.deepEqual(await page.locator('.memo-list-v236>button').allTextContents(),['状態異常についてのメモ','会心・連撃についてのメモ']);await close();
  // Existing character guidance completes before the separate, character-free memo.
  await page.evaluate(()=>{window.holdTalk=true;window.memoTest.screen('tavern');});await call('tavern');await page.waitForFunction(()=>window.releaseTalk);assert.equal(await page.locator('.memo-modal-v236').count(),0);
  await page.evaluate(()=>{window.holdTalk=false;window.releaseTalk();});await memo('tavern');assert.ok((await page.evaluate(()=>window.talks)).some(t=>t.name==='モブイルカエル'));await close();await done();
  await call('tavern');await done();assert.equal(await page.locator('.memo-modal-v236').count(),0);
  await call('smith');await memo('smith');assert.ok((await page.evaluate(()=>window.talks)).some(t=>t.name==='モブゴンゾー'));await close();await done();
  await page.evaluate(()=>window.memoTest.screen('adventure'));await page.locator('#campBtn').click();await memo('camp');await close();await page.evaluate(()=>window.memoTest.hide());
  await call('adventure');await memo('adventure');assert.notEqual(await page.evaluate(()=>window.arrived),true);await close();await done();assert.equal(await page.evaluate(()=>window.arrived),true);
  await page.evaluate(()=>window.memoTest.screen('training'));
  for(const id of ['program','subquest','journal','exp','gold','boss','event']){await call('training',id);await memo(id);await close();await done();}
  for(const [view,id] of [['story','event-story'],['boss','event-boss'],['legend','legend']]){await page.evaluate(v=>window.memoTest.event(v),view);await memo(id);await close();}
  await page.evaluate(()=>{window.memoTest.hide();window.memoTest.screen('home');});await call('figures');await memo('figures');await close();await done();await page.evaluate(()=>window.memoTest.hide());
  // Unseen memos stay absent, including a locked menu. Gacha is a second figure entry path.
  await page.evaluate(()=>{window.memoTest.forget('figures');window.memoTest.screen('tavern');});await call('shop');await memo('figures');await close();await done();
  await page.evaluate(()=>{window.memoTest.hide();window.memoTest.forget('event');window.memoTest.locked(true);window.memoTest.screen('training');});await call('training','menu');await done();await call('training','event');await done();assert.equal(await page.evaluate(()=>window.memoTest.seen().event),undefined);assert.equal(await page.locator('.memo-modal-v236').count(),0);
  // A failed asset never becomes a collected memo; it can be retried later.
  await page.route('**/adventure-v236.png',r=>r.abort());await page.evaluate(()=>{window.memoTest.forget('adventure');window.memoTest.request('adventure');});await page.getByText('画像を読み込めませんでした。',{exact:false}).waitFor();assert.equal(await page.evaluate(()=>window.memoTest.seen().adventure),undefined);await close();await page.unroute('**/adventure-v236.png');
  await page.evaluate(()=>window.memoTest.request('adventure'));await memo('adventure');await close();
  await page.evaluate(()=>{window.memoTest.locked(false);window.memoTest.loadSaved();});
  assert.equal(await page.evaluate(()=>document.getElementById('shelfButtonV218').nextElementSibling.id),'memoButtonV236');
  await page.screenshot({path:path.join(out,'home.png')});
  await page.locator('#memoButtonV236').click();assert.equal(await page.locator('.memo-list-v236>button').count(),16);assert.equal(await page.locator('.memo-list-v236').getByText('イベントクエストについてのメモ',{exact:true}).count(),0);
  await page.screenshot({path:path.join(out,'collection.png')});await page.getByRole('button',{name:'フィギュアについてのメモ',exact:true}).click();await memo('figures');
  for(const size of [{width:390,height:844},{width:360,height:640}]){await page.setViewportSize(size);const bounds=await page.locator('.memo-modal-v236').boundingBox();assert.ok(bounds.x>=0&&bounds.y>=0&&bounds.x+bounds.width<=size.width+1&&bounds.y+bounds.height<=size.height+1);await page.screenshot({path:path.join(out,`figures-${size.width}.png`)});}
  await page.keyboard.press('Escape');await page.locator('.memo-list-v236').waitFor();await close();
  // Reload the document and read the saved collection (no game test setup reset).
  await page.reload();await page.evaluate(()=>window.memoTest.loadSaved());await page.locator('#memoButtonV236').click();assert.equal(await page.locator('.memo-list-v236>button').count(),16);await close();
  await page.evaluate(()=>window.memoTest.opening());await page.locator('.opening-title-splash.ready button').click();await memo('status');assert.ok((await page.evaluate(()=>window.talks)).some(t=>t.text==='冒険の始まりであります！'));await close();await memo('combat');await close();await done();
  for(const m of JSON.parse(fs.readFileSync(path.join(root,'js/memos-v236.json'),'utf8'))){const bytes=fs.readFileSync(path.join(root,m.image));assert.equal(bytes.readUInt32BE(16),bytes.readUInt32BE(20));assert.ok(bytes.readUInt32BE(16)>=1024);}
  assert.deepEqual(errors,[]);console.log('PASS: actual opening completion order, first-use facility/training/event/figure hooks, preserved tutorials, locking, failed-image retry, collection persistence, 17 square images and mobile layouts.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
