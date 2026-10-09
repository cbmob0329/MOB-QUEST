const assert=require('node:assert/strict');
const {open}=require('./story-v172-harness.cjs');
(async()=>{const x=await open('window.atlasQA259={atlases:SKILL_ATLASES_V259,play:atlasSequenceV251,load:loadAtlasV251,style:atlasFrameStyleV251};');try{
 const p=x.page;await p.setViewportSize({width:800,height:1600});
 for(const [name,atlas] of Object.entries(await p.evaluate(()=>atlasQA259.atlases))){
  await p.evaluate(async ({atlas,name})=>{await atlasQA259.load(atlas);document.body.innerHTML='<div id="gallery"></div>';const g=document.querySelector('#gallery');g.style.cssText='display:grid;grid-template-columns:repeat(4,180px);gap:8px;padding:15px;background:#263b49;';
   for(let r=0;r<atlas.rows;r++)for(let c=0;c<4;c++){const cell=document.createElement('div');cell.style.cssText='width:180px;height:195px;color:white;font:12px sans-serif;';const f=document.createElement('div');f.style.cssText=`width:180px;height:180px;background-image:url(${atlas.src});background-size:400% ${atlas.rows*100}%;background-position:${c*100/3}% ${r*100/(atlas.rows-1)}%;background-repeat:no-repeat;overflow:hidden;outline:1px solid #617783;`;atlasQA259.style(f,atlas,r,c);cell.append(f,document.createTextNode(`${name} row ${r+1} frame ${c+1}`));g.append(cell);}
  },{atlas,name});
  await p.locator('#gallery').screenshot({path:`artifacts/skills-v259/atlas-${name}.png`});
 }
 // Verify every frame is advanced and all four atlas types clean up after playback.
 await p.reload();await p.evaluate(()=>{document.body.insertAdjacentHTML('beforeend','<div id="battleFxLayer"></div>');window.seen251=[];new MutationObserver(ms=>ms.forEach(m=>{if(m.attributeName==='data-frame')seen251.push(m.target.dataset.frame);})).observe(document.querySelector('#battleFxLayer'),{subtree:true,attributes:true,attributeFilter:['data-frame']});});
 for(const name of ['food','sweep','slash','fire']){await p.evaluate(async n=>{seen251.length=0;await atlasQA259.play(atlasQA259.atlases[n],0,'enemy');},name);assert.deepEqual(await p.evaluate(()=>seen251),['1','2','3','4']);assert.equal(await p.locator('.battle-sequence-v251').count(),0);}
 assert.deepEqual(x.errors,[]);console.log('PASS all atlas frame transitions and cleanup; contact sheets saved for cell bleed inspection');
}finally{await x.browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
