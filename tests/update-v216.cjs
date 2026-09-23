const assert=require('node:assert/strict');
const {open}=require('./story-v172-harness.cjs');
const injection=`window.test216={
 setup:async(mode='training')=>{
  state.meta.bookCompleted=true;state.meta.heroPassive2Unlocked=true;ensureBookCompletionRewardsV165();
  state.party=[['yusha',90]];state.autoBattle=false;storyBusy=false;passiveChance=()=>false;initiativeSpeed=e=>e.type==='ally'?100000:1;
  await beginBattle({mode,party:state.party,enemyConfigs:[{id:'dc2-lilith',level:85}],bg:'back/rpgmain.png'});
 },
 ready:()=>!!activeAlly()&&!state.battle.busy,
 transform:async()=>{const a=state.battle.allies[0],u=a.ults.find(u=>u.kind==='heroTransform');a.ultCooldowns=a.ults.map(()=>0);await performUltimate(a,u);a.ultCooldowns=a.ults.map(()=>0);},
 blocked:async()=>{const a=state.battle.allies[0],u=a.ults.find(u=>u.kind==='heroTransform'),before={mp:a.mpNow,hp:a.hp,cd:[...a.ultCooldowns]};const result=await performUltimate(a,u);return {result,unchanged:JSON.stringify(before)===JSON.stringify({mp:a.mpNow,hp:a.hp,cd:[...a.ultCooldowns]}),auto:readyUlts(a).includes(u),transformed:a.transformed};},
 end:kind=>{if(kind==='script')finishScriptedBattle();else finishBattle(kind==='win');},
 snap:()=>{const a=state.battle.allies[0],u=a.ults.find(u=>u.kind==='heroTransform');return {transformed:a.transformed,locked:bookTransformLockedV216(a,u),buff:a.allBuff,boost:a.heroTransformUltBoost||0};}
};`;
(async()=>{const {browser,page,errors}=await open(injection);try{
 for(const kind of ['win','lose','script','back']){
  await page.evaluate(m=>test216.setup(m),kind==='script'?'story':'training');
  await page.waitForFunction(()=>test216.ready());
  assert.equal((await page.evaluate(()=>test216.snap())).locked,false);
  await page.evaluate(()=>test216.transform());
  assert.deepEqual(await page.evaluate(()=>test216.blocked()),{result:false,unchanged:true,auto:false,transformed:true});
  await page.locator('#ultimateBtn').click();
  const book=page.locator('[data-ult-index]').filter({hasText:'読みかけの本'});
  assert.equal(await book.isDisabled(),true);assert((await book.innerText()).includes('変身中 / 使用不可'));
  await page.evaluate(()=>document.querySelector('#skillMenu').hidden=true);
  if(kind==='back')await page.locator('#battleBackBtn').click();else await page.evaluate(k=>test216.end(k),kind);
  const ended=await page.evaluate(()=>test216.snap());assert.equal(ended.transformed,false);assert.equal(ended.locked,false);assert.equal(ended.buff,0);assert.equal(ended.boost,0);
  if(kind==='win'||kind==='lose')await page.locator('#resultOverlay').waitFor({state:'visible'});
  else await page.waitForTimeout(400);
 }
 assert.deepEqual(errors,[]);console.log('v216 PASS: actual transform, menu disabled, direct/AUTO rejection without HP/MP/CT change, reset on win/loss/script/training exit, next battle unlocked');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
