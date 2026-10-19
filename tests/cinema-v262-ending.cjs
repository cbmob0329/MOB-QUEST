const assert=require('assert/strict'),{open}=require('./story-v172-harness.cjs');
(async()=>{const x=await open(`window.end262={async run(fail){
 let time=0;Object.defineProperty(performance,'now',{configurable:true,value:()=>time});
 const oldAudio=window.Audio,oldDelay=fixedDelay,oldAnimate=animateV157,oldLoad=loadEndingFrameV217;
 const cues=[],captions=[];let audio;
 window.Audio=function(){audio=this;this.volume=0;this.duration=136.939;this.currentTime=0;this.paused=true;this.ended=false;this.play=()=>{this.paused=!!fail;return fail?Promise.reject(Error('blocked')):Promise.resolve();};this.pause=()=>{this.paused=true;};this.removeAttribute=()=>{};this.load=()=>{};};
 const advance=ms=>{time+=ms;if(audio&&!audio.paused){audio.currentTime=Math.min(audio.duration,audio.currentTime+ms/1000);audio.ended=audio.currentTime>=audio.duration;}};
 fixedDelay=async ms=>advance(ms);animateV157=async(el,frames,ms)=>{if(el.classList.contains('ending-slide-v240'))cues.push({time:time/1000,src:el.firstChild?.src});if(el.classList.contains('ending-card-v240'))captions.push(el.textContent);advance(ms);};
 loadEndingFrameV217=async n=>{const i=new Image();i.src='poster/'+String(n).padStart(2,'0')+'.png';return i;};
 try{await endingMontageV157();return{cues,time,remaining:document.querySelectorAll('.ending-montage-v262').length,paused:audio.paused};}finally{window.Audio=oldAudio;fixedDelay=oldDelay;animateV157=oldAnimate;loadEndingFrameV217=oldLoad;delete performance.now;}
}};`);try{for(const fail of [false,true]){const r=await x.page.evaluate(f=>end262.run(f),fail);assert.equal(r.cues.length,31);r.cues.forEach((c,i)=>{assert.ok(Math.abs(c.time-i*4)<.1);assert.ok(c.src.endsWith(String(i+1).padStart(2,'0')+'.png'));});assert.equal(r.remaining,0);assert.equal(r.paused,true);assert.ok(r.time>=(fail?128000:140000));console.log(fail?'blocked audio fallback':'music clock',r.time);}assert.deepEqual(x.errors,[]);console.log('PASS 31 ordered frames, four-second music cues, musical tail, silent fallback, cleanup');}finally{await x.browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
