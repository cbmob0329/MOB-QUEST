// Original deterministic PCM synthesis. No downloads, network calls, or game state.
export const ATTRIBUTES=['火','水','雷','地','風','光','闇','無'];
export const CUES={select:'選択',confirm:'決定',back:'戻る',navigate:'画面移動',error:'エラー',deckAdd:'デッキ追加',deckRemove:'デッキ削除',deckArrange:'自動編成・整理',starter:'スターター',reward:'報酬・交換',start:'戦闘開始',draw:'ドロー',summon:'召喚',attack:'攻撃',hit:'被弾',guard:'防御・無効化',skill:'スキル',fusion:'ソウルフュージョン',defeat:'撃破',turn:'ターン開始',battle:'バトルフェイズ',end:'ターン終了',win:'勝利',lose:'敗北',move:'位置変更',gachaOpen:'ガチャ確認',gachaGather:'ガチャ集結',gachaCue:'ガチャ予兆',gachaAssemble:'ガチャ組立',gachaInk:'ガチャ彩色',gachaReveal:'ガチャ出現'};
const clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,n));
const E=(u,a,d)=>u<0?0:(1-Math.exp(-u/a))*Math.exp(-u/d);
const hash=s=>{let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;};
function random(seed){let s=seed||1;return ()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return (s>>>0)/4294967296;};}
export const attributesOf=value=>{const parts=[...new Set(String(value||'無').split('/').filter(a=>ATTRIBUTES.includes(a)))];return parts.length?parts:['無'];};
const strengthOf=n=>['small','medium','large'].includes(n)?n:'medium';
export function cueSpec(cue,options={}){
 const strength=strengthOf(options.strength),level={small:0,medium:1,large:2}[strength],attribute=attributesOf(options.attribute).join('/');
 const ui=['select','confirm','back','navigate','error','deckAdd','deckRemove','deckArrange','move'].includes(cue);
 let duration=ui?({error:.23,deckArrange:.3}[cue]||.1):({draw:.22,summon:.65,hit:.26,guard:.32,defeat:.4,turn:.3,battle:.3,end:.2,start:.85,win:1.3,lose:1.05,starter:.8,reward:.65,gachaOpen:.22,gachaGather:.7,gachaCue:.6,gachaAssemble:.6,gachaInk:.55,gachaReveal:1.15}[cue]||.65);
 if(['attack','skill','fusion'].includes(cue))duration=attribute.includes('火')?[.82,1.6,3.2][level]:[.48,.78,1.25][level];
 if(cue==='fusion')duration=Math.max(duration,1.05+level*.25);
 if(Number.isFinite(options.durationLimit))duration=Math.min(duration,Math.max(.08,options.durationLimit));
 duration=Math.round(duration*1000)/1000;
 return {cue,strength,level,attribute,attackType:options.attackType==='物理'?'物理':'魔法',special:!!options.special,healing:!!options.healing,duration,priority:ui?(cue==='error'?2:0):['start','win','lose','fusion','gachaReveal','starter'].includes(cue)?3:2};
}
export const cueKey=(cue,options)=>JSON.stringify(cueSpec(cue,options));
function tone(out,sr,start,duration,f0,f1,gain,type='sine',decay=.12){let phase=0;const first=Math.max(0,Math.floor(start*sr)),last=Math.min(out.length,Math.ceil((start+duration)*sr));for(let i=first;i<last;i++){const u=i/sr-start,progress=clamp(u/duration);phase+=2*Math.PI*(f0*Math.pow(Math.max(1,f1)/Math.max(1,f0),progress))/sr;let v=Math.sin(phase);if(type==='triangle')v=2/Math.PI*Math.asin(v);if(type==='bell')v+=.32*Math.sin(phase*2.76)+.12*Math.sin(phase*4.21);out[i]+=gain*E(u,.003,decay)*v;}}
function noise(out,sr,start,duration,low,high,gain,rng,attack=.004,decay=.15,flutter=0){let lp=0,hpLow=0;const a=1-Math.exp(-2*Math.PI*Math.min(high,sr*.42)/sr),b=1-Math.exp(-2*Math.PI*low/sr);for(let i=Math.max(0,Math.floor(start*sr));i<Math.min(out.length,(start+duration)*sr);i++){const u=i/sr-start;lp+=a*(rng()*2-1-lp);hpLow+=b*(lp-hpLow);out[i]+=(lp-hpLow)*gain*E(u,attack,decay)*(1+flutter*Math.sin(2*Math.PI*37*u));}}
function fire(out,sr,level,rng){
 // Timing/layering inspired by the supplied fire recipe. This is an original approximation,
 // not the inaccessible reference WAV or its sixth-order Butterworth reconstruction.
 const nominal=[.82,1.6,3.2][level],scale=out.length/sr/nominal;
 const S=(start,span,freq,gain,decay,attack)=>{
  const centers=[100,200,400,800,1600,3200,6400],states=centers.map(c=>({l:0,h:0,a:1-Math.exp(-2*Math.PI*Math.min(sr*.42,c*1.7)/sr),b:1-Math.exp(-2*Math.PI*c*.55/sr)}));
  start*=scale;span*=scale;decay*=scale;attack*=scale;
  for(let i=Math.floor(start*sr);i<out.length;i++){const u=i/sr-start,x=clamp(u/span),k=x<.4?0:1,v=k===0?x/.4:(x-.4)/.6,f=freq[k]*Math.pow(freq[k+1]/freq[k],v);let sum=0;for(let j=0;j<centers.length;j++){const q=states[j];q.l+=q.a*(rng()*2-1-q.l);q.h+=q.b*(q.l-q.h);sum+=(q.l-q.h)*.62*Math.exp(-.5*Math.pow(Math.log2(f/centers[j])/.78,2));}out[i]+=sum*gain*E(u,attack,decay)*(1+.38*Math.sin(u*2*Math.PI*38));}
 };
 const B=(start,gain,f0,f1,decay)=>{start*=scale;for(let i=Math.floor(start*sr);i<out.length;i++){const u=i/sr-start,p=2*Math.PI*(f1*u+(f0-f1)*.085*scale*(1-Math.exp(-u/(.085*scale))));out[i]+=gain*E(u,.004*scale,decay*scale)*(Math.sin(p)+.12*Math.sin(2.017*p));}};
 if(level===0){S(.006,.23,[3600,1250,420],.60,.115,.006);S(.055,.30,[1400,600,220],.30,.16,.008);B(.025,.39,210,79,.12);noise(out,sr,.045*scale,.6*scale,600,6500,.095,rng,.018*scale,.185*scale);}
 if(level===1){S(.004,.25,[550,1700,4000],.11,.12,.09);S(.178,.48,[4200,1500,250],.68,.30,.006);S(.235,.70,[1700,650,160],.40,.34,.013);B(.187,.54,147,46,.25);B(.277,.20,95,41,.24);noise(out,sr,.205*scale,1.2*scale,340,5000,.19,rng,.011*scale,.43*scale,.5);}
 if(level===2){S(0,.93,[200,750,4300],.16,.5,.13);tone(out,sr,0,.9*scale,90,280,.075,'bell',.7*scale);S(.908,.73,[5000,1200,160],.89,.46,.007);S(.971,.95,[2100,580,95],.61,.56,.015);B(.914,.73,118,34,.39);B(1.013,.30,85,31,.51);noise(out,sr,.95*scale,2.2*scale,65,520,.25,rng,.02*scale,.58*scale);noise(out,sr,.963*scale,2.2*scale,340,5800,.22,rng,.024*scale,.57*scale,.62);}
 const count=[7,15,28][level],first=[.085,.22,.99][level],last=[.47,1.18,2.61][level];for(let j=0;j<count;j++){const at=(first+(last-first)*j/count)*scale;noise(out,sr,at,.05*scale,1400+rng()*900,5000+rng()*5500,.19*(1-.8*j/count),rng,.0007,.00266+rng()*.00551);}
}
function element(out,sr,attribute,s,rng){const d=out.length/sr,k=s.level,attack=s.cue==='attack',fusion=s.cue==='fusion',skill=s.cue==='skill';
 if(attribute==='火')fire(out,sr,k,rng);
 if(attribute==='水'){noise(out,sr,0,d,240,2700,.7,rng,.018,d*.27);for(let j=0;j<7+k*3;j++)tone(out,sr,j*d*.065,d*.22,450+j*95,1200+j*150,.18,'sine',d*.06);}
 if(attribute==='雷'){for(let j=0;j<4+k*2;j++){noise(out,sr,j*d*.075,d*.15,1800,11000,.9,rng,.001,d*.025);tone(out,sr,j*d*.075,d*.13,2300,110,.16,'triangle',d*.025);}}
 if(attribute==='地'){noise(out,sr,0,d,35,700,1.1,rng,.003,d*.24);tone(out,sr,0,d,120,32,.65,'sine',d*.24);for(let j=1;j<5;j++)noise(out,sr,d*j*.11,d*.16,600,2400,.32,rng,.001,d*.025);}
 if(attribute==='風'){noise(out,sr,0,d,550,5000,.8,rng,d*.1,d*.3,.22);tone(out,sr,d*.03,d*.6,280,1700,.1,'sine',d*.26);}
 if(attribute==='光'){for(let j=0;j<5;j++)tone(out,sr,j*d*.08,d*.62,880*Math.pow(1.2599,j),880*Math.pow(1.2599,j),.22,'bell',d*.19);noise(out,sr,0,d,6000,12000,.16,rng,.01,d*.15);}
 if(attribute==='闇'){tone(out,sr,0,d,140,45,.6,'sine',d*.33);tone(out,sr,d*.03,d*.87,217,66,.21,'triangle',d*.3);noise(out,sr,0,d,70,1300,.6,rng,d*.13,d*.28);}
 if(attribute==='無'){noise(out,sr,0,d,500,3200,.4,rng,.003,d*.13);tone(out,sr,0,d,420,130,.4,'triangle',d*.18);}
 if(attack&&s.attackType==='物理'){noise(out,sr,0,d*.19,130,1900,.6,rng,.001,d*.025);tone(out,sr,0,d*.3,180,45,.4,'sine',d*.055);}
 if(skill||s.attackType==='魔法')for(let j=0;j<3;j++)tone(out,sr,j*d*.07,d*.6,520*(1+j*.5),800*(1+j*.5),.065,'bell',d*.19);
 if(fusion){for(let j=0;j<4;j++)tone(out,sr,j*d*.1,d*.65,165*Math.pow(1.26,j),440*Math.pow(1.26,j),.16,'bell',d*.25);tone(out,sr,d*.45,d*.5,100,45,.24,'sine',d*.15);}
 if(s.special)tone(out,sr,d*.35,d*.6,1320,1760,.14,'bell',d*.25);
 if(s.healing)for(let j=0;j<3;j++)tone(out,sr,d*(.2+j*.1),d*.5,660*(1+j*.25),660*(1+j*.25),.15,'bell',d*.2);
}
export function synthesizeCue(cue,options={},sampleRate=48000){
 if(!CUES[cue])throw Error('Unknown sound cue: '+cue);
 const s=cueSpec(cue,options),out=new Float32Array(Math.ceil(s.duration*sampleRate)),rng=random(hash(cueKey(cue,options))),d=s.duration,sr=sampleRate;
 if(['attack','skill','fusion'].includes(cue)){const attrs=attributesOf(s.attribute);for(const a of attrs){const layer=new Float32Array(out.length);element(layer,sr,a,s,rng);for(let i=0;i<out.length;i++)out[i]+=layer[i]/Math.sqrt(attrs.length);}}
 else if(['hit','guard','defeat'].includes(cue)){noise(out,sr,0,d,cue==='guard'?1700:100,cue==='guard'?7000:2600,.6,rng,.001,d*.19);tone(out,sr,0,d,cue==='guard'?1200:150,cue==='guard'?950:40,.4,cue==='guard'?'bell':'sine',d*.25);}
 else{const notes={select:[700],confirm:[660,990],back:[700,450],navigate:[540,720],error:[180,150],deckAdd:[620,930],deckRemove:[600,360],deckArrange:[440,550,660],draw:[800,1100],summon:[220,440,880],starter:[440,554,660,880],reward:[660,880,1320],start:[220,330,440],turn:[420,630],battle:[330,440],end:[550,360],win:[523,659,784,1047],lose:[392,330,261],move:[580,850],gachaOpen:[450,660],gachaGather:[180,270,405,610],gachaCue:[330,660,990],gachaAssemble:[500,700,950,1200],gachaInk:[440,660,880],gachaReveal:[523,659,784,1047,1568]}[cue]||[440];for(let j=0;j<notes.length;j++)tone(out,sr,j*d*.13,d*(1-j*.1),notes[j],notes[j]*(cue==='draw'?1.2:1),.4,cue==='error'?'triangle':'bell',d*.24);if(['draw','summon','gachaGather','gachaAssemble'].includes(cue))noise(out,sr,0,d,800,6000,.2,rng,.002,d*.23);}
 // DC removal, mild saturation, short edge fades and conservative per-cue peaks.
 let low=0,mean=0;const hp=1-Math.exp(-2*Math.PI*27/sr);for(let i=0;i<out.length;i++){low+=hp*(out[i]-low);out[i]=Math.tanh((out[i]-low)*1.15);mean+=out[i];}mean/=out.length;
 let peak=0;const tail=Math.min(d*.25,.18);for(let i=0;i<out.length;i++){const t=i/sr,fade=Math.sin(clamp(t/.003)*Math.PI/2)**2*Math.sin(clamp((d-t)/tail)*Math.PI/2)**2;out[i]=(out[i]-mean)*fade;peak=Math.max(peak,Math.abs(out[i]));}
 const target=s.priority===0?.13:cue==='error'?.2:10**(-[8,6.5,5.5][s.level]/20);if(peak)for(let i=0;i<out.length;i++)out[i]*=target/peak;
 return {samples:out,sampleRate,duration:d,spec:s};
}
