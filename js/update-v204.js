/* UPDATE_V204_BEGIN
   Battle presentation: fit passive/ultimate text inside its frame and accelerate
   passive notices after the first activation of the same passive in a battle. */

function passiveKeyV204(actor,text){
  const first=String(text??'').split('\n')[0].replace(/\s+/g,'').replace(/[！!。．]/g,'');
  return `${actor?.id||actor?.name||actor?.uid||'actor'}|${first}`;
}
function passiveSeenCountV204(actor,text){
  const b=state.battle;if(!b)return 0;
  const bag=b.passiveViewsV204??={};
  return Number(bag[passiveKeyV204(actor,text)]||0);
}
function markPassiveSeenV204(actor,text){
  const b=state.battle;if(!b)return 0;
  const bag=b.passiveViewsV204??={};const key=passiveKeyV204(actor,text);
  bag[key]=Number(bag[key]||0)+1;return bag[key];
}
function fitTextHeightV204(el,{max=15,min=9,available=150,lineHeight=1.32}={}){
  if(!el)return;
  let size=max;el.style.setProperty('font-size',`${size}px`,'important');
  el.style.setProperty('line-height',String(lineHeight),'important');
  for(let i=0;i<14&&size>min;i++){
    if(el.scrollHeight<=available+1&&el.scrollWidth<=el.clientWidth+2)break;
    size=Math.max(min,size-.5);el.style.setProperty('font-size',`${size}px`,'important');
  }
}
async function preparePassiveFrameV204(wrap,label,text){
  if(!wrap||!label)return;
  wrap.classList.add('passive-fit-v204');
  const n=[...String(text||'')].length;
  const max=n>100?11:n>72?12:n>48?13:15;
  await nextPaint();
  const available=Math.max(58,Math.min(176,window.innerHeight*.28)-30);
  fitTextHeightV204(label,{max,min:8.5,available,lineHeight:1.28});
}

/* Player passives: first activation remains readable; every later activation of the
   same passive in the same battle is deliberately short. */
passiveCutin=async function(a,text,duration=620){
  const wrap=$('#passiveCutin'),img=$('#passiveCutinCharacter'),label=$('#passiveCutinText'),small=$('small',wrap);
  if(!wrap||!a){notice(text,'system',duration);await fixedDelay(duration);return;}
  const repeated=passiveSeenCountV204(a,text)>0;markPassiveSeenV204(a,text);
  const effect=PASSIVE_EFFECTS_V175?.[a?.id],full=String(text)+(effect?'\n'+effect:'');
  const src=versionedPlay(transformedArtV158(a));if(src)try{await preloadAsset(src);}catch(_){}
  if(src)setImage(img,src,'');else img.removeAttribute('src');
  if(small){small.hidden=false;small.textContent=repeated?'PASSIVE / QUICK':'PASSIVE';}
  label.textContent=full;
  wrap.hidden=false;wrap.classList.remove('play','battle-story-dialogue-v133','battle-story-hold-v88','battle-story-out-v88','enemy-skill-cutin-v134','passive-repeat-v175');
  wrap.classList.toggle('passive-quick-v204',repeated);
  await preparePassiveFrameV204(wrap,label,full);
  const firstMs=Math.max(1750,Math.min(3000,900+[...full].length*28),Number(duration)||0);
  wrap.style.setProperty('--passive-duration-v175',`${repeated?480:firstMs}ms`);
  wrap.classList.add('play');
  await fixedDelay(repeated?480:firstMs);
  wrap.classList.remove('play','passive-quick-v204','passive-fit-v204');
  label.style.removeProperty('font-size');label.style.removeProperty('line-height');
  wrap.hidden=true;
};
passiveBeat=async function(a,text,duration=620,preDelay=600){
  const repeated=passiveSeenCountV204(a,text)>0;
  await fixedDelay(repeated?80:preDelay);
  await passiveCutin(a,text,duration);
};
reactivePassiveBeat=async function(a,text,duration=600){return passiveBeat(a,text,duration,140);};

/* Enemy passive/reaction card: same once-per-battle quick rule, with dynamic fitting. */
reactionV177=async function(actor,name,effect,{weapon=false,gidora=false,skill=false}={}){
  const b=state.battle,isPassive=!weapon&&!skill,keyText=String(name).replace(/\(\d+\/\d+\)/g,''),repeated=isPassive&&passiveSeenCountV204(actor,keyText)>0;
  if(isPassive)markPassiveSeenV204(actor,keyText);
  const layer=document.createElement('div');layer.className='reaction-v177'+(gidora?' gidora':'')+(repeated?' repeat-v178 passive-quick-v204':'');
  layer.innerHTML='<div class="reaction-card-v177"><img alt=""><div><small></small><b></b><p></p></div></div>';
  $('img',layer).src=weapon?versionedPlay(actor.image):actor.image;
  $('small',layer).textContent=(weapon?'武器特性 / ':skill?'必殺技 / ':'敵パッシブ / ')+actor.name;
  reactionTextV178($('b',layer),name);reactionTextV178($('p',layer),effect);document.body.appendChild(layer);
  await nextPaint();
  const card=$('.reaction-card-v177',layer),title=$('b',layer),body=$('p',layer),limit=Math.max(110,Math.min(250,window.innerHeight*.42));
  fitTextHeightV204(title,{max:19,min:11,available:Math.max(36,limit*.30),lineHeight:1.22});
  fitTextHeightV204(body,{max:14,min:9,available:Math.max(58,limit*.58),lineHeight:1.35});
  if(card&&card.scrollHeight>limit){card.style.setProperty('padding','11px','important');const im=$('img',layer);if(im){im.style.width='72px';im.style.height='88px';}}
  const visual=weapon?$(`[data-ally-id="${actor.id}"]`):enemyVisual(actor.uid);visual?.classList.add('passive-glow-v177');
  try{await waitRealV100(repeated?480:gidora?2100:weapon?1100:skill?1150:1750);}finally{visual?.classList.remove('passive-glow-v177');layer.remove();}
};

/* Enemy magic/technique/ultimate name uses the same flexible frame instead of clipping. */
enemySkillImageCutinV134=async function(e,spec){
  if(!e||!spec?.special)return;const wrap=$('#passiveCutin'),img=$('#passiveCutinCharacter'),label=$('#passiveCutinText'),small=$('small',wrap);
  if(!wrap||!img||!label){await actionCutin(`${e.name}の${spec.special}！`,'danger',520);return;}
  const src=e.image||'';if(src)try{await preloadAsset(src,'high');}catch(_){}if(src)setImage(img,src,e.name);else img.removeAttribute('src');
  if(small){small.hidden=false;small.textContent=enemySkillCutinLabelV134(e,spec);}label.textContent=spec.special;
  wrap.hidden=false;wrap.classList.remove('play','battle-story-dialogue-v133','battle-story-out-v88','passive-quick-v204');wrap.classList.add('enemy-skill-cutin-v134','battle-story-hold-v88','passive-fit-v204');
  await preparePassiveFrameV204(wrap,label,spec.special);await nextPaint();
  await fixedDelay((e.isBoss||e.category==='boss')?720:580);wrap.classList.add('battle-story-out-v88');await fixedDelay(140);
  wrap.classList.remove('enemy-skill-cutin-v134','battle-story-hold-v88','battle-story-out-v88','passive-fit-v204');
  label.style.removeProperty('font-size');label.style.removeProperty('line-height');wrap.hidden=true;
};

/* Player ultimate banner: allow two lines and fit the actual rendered banner. */
ultimateCutin=async function(a,u){
  const wrap=$('#ultimateCutin');if(!wrap)return;
  const banner=$('.cutin-character',wrap),art=$('.ult-art-wrap',wrap),name=$('#cutinName'),artImg=$('#cutinUltArt'),charImg=$('#cutinCharacter'),neon=$('.ult-neon-trace',wrap),charSrc=versionedPlay(transformedArtV158(a));
  const hardHide=()=>{wrap.hidden=true;wrap.style.display='none';wrap.style.opacity='0';wrap.style.visibility='hidden';wrap.classList.remove('ult-v14-live');if(neon)neon.classList.remove('active');if(banner){banner.style.opacity='0';banner.style.visibility='hidden';banner.style.transform='none';}if(art){art.style.opacity='0';art.style.visibility='hidden';art.style.transform='translate(-50%,-42%) scale(1)';}};
  try{
    hardHide();if(name){name.textContent=u.name;name.style.removeProperty('font-size');}
    const quote=$('#cutinQuote');if(quote)quote.textContent='';const fallback=$('#cutinUltFallback');if(fallback)fallback.textContent=u.name;
    await Promise.all([preloadAsset(charSrc,'high'),preloadAsset(u.image,'high')]);if(charImg){charImg.classList.remove('asset-missing');charImg.src=charSrc;}if(artImg){artImg.classList.remove('asset-missing');artImg.src=u.image;}
    await Promise.all([ensureDomImageReady(charImg,charSrc,1800),ensureDomImageReady(artImg,u.image,2200)]);await nextPaint(2);
    wrap.hidden=false;wrap.style.display='block';wrap.style.opacity='1';wrap.style.visibility='visible';if(banner){banner.style.opacity='1';banner.style.visibility='visible';}if(art){art.style.opacity='1';art.style.visibility='visible';}
    wrap.classList.add('ult-v14-live','ultimate-fit-v204');await nextPaint();
    if(name){const h=Math.max(42,Math.min(78,banner?.clientHeight?banner.clientHeight-12:68));fitTextHeightV204(name,{max:17,min:9.5,available:h,lineHeight:1.12});}
    await fixedDelay(1120);if(neon){neon.classList.remove('active');void neon.offsetWidth;neon.classList.add('active');}await fixedDelay(300);hardHide();await new Promise(requestAnimationFrame);
  }catch(err){console.error('[MOB STORY] v204 ultimateCutin recovered:',err);hardHide();}
  finally{if(name){name.style.removeProperty('font-size');name.style.removeProperty('line-height');}wrap.classList.remove('ultimate-fit-v204');hardHide();}
};

window.__mobBuildVersion='v204';
window.__mobV204BattleTextFit=true;
// UPDATE_V204_END
