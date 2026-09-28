const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {open,root}=require('./story-v172-harness.cjs');
(async()=>{
 const x=await open(`
 window.endingTest={montage:()=>endingMontageV157(),caption:t=>endingCaptionV157(t),messages:ENDING_MESSAGES_V222};
 window.endingLog=[];
 fixedDelay=async ms=>{window.endingLog.push(['hold',ms]);};
 animateV157=async(el,frames,ms)=>{
  if(el.classList.contains('ending-slide-v240')){
   const art=el.querySelector('img'),r=art?.getBoundingClientRect();
   window.endingLog.push(['slide',art?.getAttribute('src'),ms,r?{x:r.x,y:r.y,width:r.width,height:r.height}:null,getComputedStyle(el).backgroundColor,el.parentNode.children.length]);
  }
  Object.assign(el.style,frames.at(-1));
 };
 HTMLMediaElement.prototype.play=()=>Promise.reject(new Error('No audio in test'));
 `);
 try{
  const {page}=x;await page.waitForFunction(()=>window.endingTest);
  const out=path.join(root,'artifacts/ending-v240');fs.mkdirSync(out,{recursive:true});
  for(const viewport of [{width:360,height:640},{width:390,height:844},{width:1280,height:720}]){
   await page.setViewportSize(viewport);
   await page.evaluate(async()=>{window.endingLog=[];await endingTest.montage();});
   const slides=await page.evaluate(()=>endingLog.filter(x=>x[0]==='slide'));
   assert.equal(slides.length,31);
   slides.forEach((s,i)=>{
    assert.equal(s[1],`poster/${String(i+1).padStart(2,'0')}.png`);
    assert.equal(s[2],1000);assert.equal(s[4],'rgb(0, 0, 0)');assert.ok(s[5]<=2);
    assert.ok(Math.abs(s[3].x+s[3].width/2-viewport.width/2)<1);
    assert.ok(Math.abs(s[3].y+s[3].height/2-viewport.height/2)<1);
   });
   assert.equal(await page.locator('.ending-montage-v240').count(),0);
   for(const text of await page.evaluate(()=>endingTest.messages)){
    await page.evaluate(t=>endingTest.caption(t),text);
    const data=await page.locator('.ending-card-v240 p').evaluate(p=>({text:p.textContent,width:p.getBoundingClientRect().width}));
    assert.equal(data.text,text);assert.ok(data.width<=viewport.width*.86+1,`${text}: ${data.width}`);
   }
   await page.locator('.ending-card-v240').evaluate(el=>el.style.opacity='1');
   await page.screenshot({path:path.join(out,`message-${viewport.width}.png`)});
   await page.evaluate(()=>endingTest.caption('CB Memory'));
   await page.screenshot({path:path.join(out,`logo-${viewport.width}.png`)});
   await page.locator('.ending-caption-v157').evaluate(el=>el.remove());
  }
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(async()=>{
   const root=document.createElement('div');root.className='ending-v157 ending-montage-v240';
   root.innerHTML='<div class="ending-slide-v240" style="opacity:1"><img class="ending-art-v240" src="poster/01.png"></div>';
   document.body.append(root);await root.querySelector('img').decode();
  });
  await page.screenshot({path:path.join(out,'poster-390.png')});
  assert.deepEqual(x.errors,[]);console.log('PASS: 31 real posters centered at 3 sizes; opaque transitions; messages fit; cleanup.');
 }finally{await x.browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
