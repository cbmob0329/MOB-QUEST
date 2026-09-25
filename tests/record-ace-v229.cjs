const assert=require('node:assert/strict'),{open}=require('./story-v172-harness.cjs');
const injection=`window.verify229=async()=>{
const seen=[],stage=document.createElement('section');stage.innerHTML='<div class="ending-cast-v222"></div><div class="ending-bubble-v222"></div>';document.body.append(stage);
const anim=animateV157,line=reportLineV227;animateV157=async el=>{if(el.classList.contains('report-record-v227'))seen.push({src:el.getAttribute('src'),alt:el.alt,loaded:el.complete&&el.naturalWidth>0});};reportLineV227=async()=>{};
try{for(const worldId of ['grassland','desert','rural','neon','magma','sea'])await reportRecordV227(stage,'レコードを王様に渡した',worldId);}finally{animateV157=anim;reportLineV227=line;stage.remove();}
const regular=buildEnemyFromTemplate(trainingEnemyTemplate('boss-ace'),38),castle=buildEnemyFromTemplate(castleAceTemplateV178(),73);
return{seen,regular:Array.from({length:100},()=>enemySpecialSpec(regular).special),castle:Array.from({length:100},()=>enemySpecialSpec(castle).special),detail:enemyFormalDetailV105(regular)};
};`;
(async()=>{const x=await open(injection);try{const r=await x.page.evaluate(()=>verify229());assert.deepEqual(r.seen.map(x=>x.src),['icon/26.png','icon/30.png','icon/29.png','icon/28.png','icon/27.png','icon/31.png']);assert(r.seen.every(x=>x.loaded&&x.alt!=='レコード'));assert(!JSON.stringify(r).includes('紫雷撃'));assert(r.regular.every(x=>x&&!x.includes('仮')));assert(r.castle.every(x=>['レーザー・パルス・ストレート','エネルギー・エース・スマッシュ'].includes(x)));assert.deepEqual(x.errors,[]);console.log('v229 PASS: six correct loaded record images; removed Ace skill absent from runtime choices/detail; authored castle skills preserved');}finally{await x.browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
