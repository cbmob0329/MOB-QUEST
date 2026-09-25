async function reportBackgroundV227(){
  for(const src of ['back/king1.png','back2/003.png'])if(await preloadAsset(src,'high'))return new URL(src,document.baseURI).href;
  return '';
}
function fitReportLineV227(stage){
  const line=stage.querySelector('.ending-bubble-v222 p');if(!line)return;
  line.style.fontSize='';const base=parseFloat(getComputedStyle(line).fontSize),width=line.clientWidth;
  if(line.scrollWidth>width)line.style.fontSize=`${Math.max(10,Math.floor(base*width/line.scrollWidth))}px`;
  while(line.scrollWidth>width&&parseFloat(getComputedStyle(line).fontSize)>10)line.style.fontSize=`${parseFloat(getComputedStyle(line).fontSize)-1}px`;
}
async function reportLineV227(stage,id,text,style='',last=false,narration=false){
  if(skipConversationV224())return;
  await stage.endingReadyV225;
  const pending=endingLineV222(stage,id,text,style,last);
  await Promise.resolve();
  if(narration)stage.querySelector('.ending-bubble-v222 b').textContent='ナレーション';
  fitReportLineV227(stage);await pending;
}
async function reportRecordV227(stage,text,worldId){
  const info=STORY_RECORDS_V119.find(r=>r.worldId===worldId);
  if(!info)throw new Error(`報告用レコードが未登録です: ${worldId}`);
  endingCastV222(stage,['king','pink']);const record=document.createElement('img');record.className='report-record-v227';record.src=info.image;record.alt=info.name;
  await endingImageReadyV225(record);stage.append(record);
  try{await animateV157(record,[{left:'70%',top:'45%',opacity:0},{left:'65%',top:'43%',opacity:1,offset:.2},{left:'25%',top:'43%',opacity:1,offset:.8},{left:'25%',top:'43%',opacity:0}],1000);await reportLineV227(stage,'king',text,'',false,true);}finally{record.remove();}
}
async function reportArmV227(stage){
  stage.querySelector('.ending-bubble-v222').hidden=true;const arm=document.createElement('img');arm.className='report-arm-v227';arm.src=player('helper218-lightarm').image;arm.alt='モブライトアーム';stage.append(arm);
  try{await animateV157(arm,[{transform:'translateX(0)'},{transform:'translateX(60vw)',offset:.35},{transform:'translateX(60vw)',offset:.6},{transform:'translateX(0)'}],2000);}finally{arm.remove();}
}
async function reportHandshakeV227(stage,text){
  endingCastV222(stage,['king','yusha']);const dx=stage.clientWidth*.14;
  await Promise.all([...stage.querySelectorAll('.ending-person-v222 img')].map((img,i)=>animateV157(img,[{translate:'0 0'},{translate:`${i?-dx:dx}px 0`,offset:.3},{translate:`${i?-dx:dx}px -9px`,offset:.5},{translate:`${i?-dx:dx}px 0`,offset:.7},{translate:'0 0'}],1500)));
  await reportLineV227(stage,'king',text,'',false,true);
}
const reportSubmitBaseV227=submitAdventureReport;
async function castleReportV227(report){
  if(castleReportBusy||storyBusy)return;castleReportBusy=true;
  const stage=document.createElement('section');stage.className='ending-stage-v222 rural-report-v223 castle-report-v227';stage.tabIndex=0;stage.setAttribute('aria-label',`${report.worldName||report.worldId}の報告`);
  stage.innerHTML='<div class="ending-cast-v222"></div><div class="ending-bubble-v222" hidden></div>';
  try{
    const background=await reportBackgroundV227();if(background)stage.style.backgroundImage=`url("${background}")`;
    document.body.append(stage);const resize=()=>fitReportLineV227(stage);window.addEventListener('resize',resize);
    try{for(const [kind,id,text,style]of CASTLE_REPORTS_V227[report.worldId]){
      if(kind==='record'){await reportRecordV227(stage,id,report.worldId);continue;}
      if(kind==='handshake'){await reportHandshakeV227(stage,id);continue;}
      if(kind==='arm'){await reportArmV227(stage);continue;}
      endingCastV222(stage,id==='king'?['king','pink']:['king',id]);
      // Every source line is its own tap. The final line also remains readable.
      await reportLineV227(stage,id,text,style);if(kind==='last')await fixedDelay(1000);
    }}finally{window.removeEventListener('resize',resize);}
    commitCastleReportProgressV126(report);renderCastle();showScreen('castle');
  }finally{stage.remove();castleReportBusy=false;}
}
submitAdventureReport=function(...args){const report=state.adventure?.awaitingReport;return CASTLE_REPORTS_V227[report?.worldId]?scopedConversationV224(()=>castleReportV227(report),[]):reportSubmitBaseV227(...args);};
/* Conditional equipment bonuses must not become unconditional evade/crit or
   flat MAG bonuses when the authored text is parsed. */
const effectsParseBaseV227=parseFigureEffectText;
parseFigureEffectText=function(text){
  let s=String(text||'').normalize('NFKC').replace(/混乱耐性\+20&/g,'混乱耐性+20%').replace(/特性発動率\s*(\d+)%アップ/g,'特殊効果発動率+$1%');
  const extra={};
  const take=(pattern,key,scale=100)=>{s=s.replace(pattern,(_,n)=>{extra[key]=(extra[key]||0)+Number(n)/scale;return '';});};
  take(/敵の回避率\s*(?:-\s*)?(\d+)%\s*(?:ダウン)?/g,'enemyEvadeDownV227');
  take(/連続攻撃確率(?:\(通常攻撃で追撃\))?\s*\+(\d+)%/g,'normalFollowV227');
  take(/必殺技会心率\s*\+(\d+)%/g,'ultimateCritV227');
  take(/MAG\s*\+(\d+)%/g,'magPercentV227');
  take(/獲得ソウルポイント\s*\+(\d+)/g,'soulGainV227',1);
  return Object.assign(effectsParseBaseV227(s),extra);
};
const mergeBaseV227=mergeFigureEffects;
mergeFigureEffects=function(a,b){const sums={};for(const key of ['enemyEvadeDownV227','normalFollowV227','ultimateCritV227','magPercentV227','soulGainV227'])sums[key]=Number(a[key]||0)+Number(b?.[key]||0);return Object.assign(mergeBaseV227(a,b),sums);};
const hitChanceBaseV227=playerAttackHitChance;
playerAttackHitChance=function(a,e,...args){const cut=Number((a?.figureEffects||figureEffectsFor(a?.id)).enemyEvadeDownV227||0);return hitChanceBaseV227(a,e&&cut?{...e,evasion:Math.max(0,Number(e.evasion||0)-cut)}:e,...args);};
const followupBaseV227=weaponFollowupSpec;
weaponFollowupSpec=function(a,kind,...args){const spec=followupBaseV227(a,kind,...args),extra=kind==='normalFollowup'?Number(a?.figureEffects?.normalFollowV227||0):0;return extra?{chance:1-(1-spec.chance)*(1-clamp(extra,0,1)),power:spec.power||.5}:spec;};
const critBaseV227=calcDamage;
calcDamage=function(a,type,power,crit=0,...args){return critBaseV227(a,type,power,crit+(state.battle?.currentActionKind==='ultimate'?Number(a?.figureEffects?.ultimateCritV227||0):0),...args);};
const statsBaseV227=weaponStatsForEquipment;
weaponStatsForEquipment=function(p,...args){const stats=statsBaseV227(p,...args),rate=Number(figureEffectsFor(p.id).magPercentV227||0);if(rate)stats.mag=Math.round(stats.mag*(1+rate));return stats;};
const soulGainBaseV227=gainSoulV220;
gainSoulV220=function(a,n){return soulGainBaseV227(a,n+(n>0?Number(a?.figureEffects?.soulGainV227||0):0));};
const effectsMarkupBaseV227=figureEffectStatusMarkup;
figureEffectStatusMarkup=function(pid){const effects=figureEffectsFor(pid),labels={enemyEvadeDownV227:'敵の回避率低下',normalFollowV227:'通常攻撃の追撃確率',ultimateCritV227:'必殺技会心率',magPercentV227:'MAG',soulGainV227:'獲得ソウルポイント'};return effectsMarkupBaseV227(pid)+`<section class="figure-extra-effects-v163">${Object.entries(labels).filter(([key])=>effects[key]>0).map(([key,label])=>`<span>${label}<b>+${key==='soulGainV227'?effects[key]:figurePercentText(effects[key])}</b></span>`).join('')}</section>`;};
window.__mobBuildVersion='v227';
