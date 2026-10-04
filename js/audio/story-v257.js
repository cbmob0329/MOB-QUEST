// Local STORY integration. Audio never changes battle state or awaits playback.
const storySoundV257=STORY_AUDIO_V257.createSoundSystem();
storySoundV257.init();
window.MOB_STORY_SOUND=storySoundV257;
let soundScopeV257=storySoundV257.beginScope('screen'),soundScreenV257='',soundHushV257=0;
function seV257(cue,options={}){if(performance.now()<soundHushV257)return false;return storySoundV257.play(cue,{scope:soundScopeV257,...options,durationLimit:Math.max(.12,(options.durationLimit||.8)/Math.max(1,state.speed||1))});}
function battleSeV257(cue,options={}){if(!screens.battle.classList.contains('active')||!state.battle||state.battle.finished)return false;return seV257(cue,options);}
function stopSeV257(){storySoundV257.endScope(soundScopeV257);storySoundV257.stopAll();soundScopeV257=storySoundV257.beginScope('screen');}
const screenSeBaseV257=showScreen;
showScreen=function(name,...args){if(name!==soundScreenV257){stopSeV257();soundScreenV257=name;}const r=screenSeBaseV257(name,...args);if(name==='battle'&&state.battle&&!state.battle.finished){const b=state.battle;if(!b.seStartedV257){b.seStartedV257=true;seV257(b.config?.bossBattle?'summon':'start');}}return r;};
document.addEventListener('pointerdown',()=>{void storySoundV257.unlock();},{capture:true,passive:true});
document.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')void storySoundV257.unlock();},true);
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopSeV257();storySoundV257.background();}else storySoundV257.foreground();});
window.addEventListener('pagehide',()=>{stopSeV257();storySoundV257.background();});
document.addEventListener('click',e=>{const b=e.target.closest?.('button,[role=button]');if(!b||b.closest('#storySoundSettingsV257')||b.closest('.nm-stage-v239,.rush-holo-overlay-v254'))return;const label=(b.getAttribute('aria-label')||b.textContent||'').trim(),id=b.id||'';if(/skip|abort/i.test(id)||b.matches('[data-rush-fx-skip],[data-rush-fx-abort],[data-rush-home]')||/スキップ/.test(label)){stopSeV257();soundHushV257=performance.now()+180;return;}if(b.disabled||b.getAttribute('aria-disabled')==='true'){seV257('error');return;}if(/Close|Back|Home/i.test(id)||/^(戻る|閉じる|キャンセル|HOME|×|←)/.test(label)){stopSeV257();seV257('back');return;}if(storyBusy||b.matches('[data-socket-medal],[data-equip-slot]'))return;seV257(/^(決定|開始|挑戦|出発|はい|購入|交換|受け取)/.test(label)?'confirm':'select');},true);
const equipSeBaseV257=setPlayerEquipment;
setPlayerEquipment=function(...args){const before=JSON.stringify(equipmentFor(args[0])),r=equipSeBaseV257(...args);if(r===false)seV257('error');else if(before!==JSON.stringify(equipmentFor(args[0])))seV257(args[3]?'deckAdd':'deckRemove');return r;};
const partySeBaseV257=saveParty;let partySeSnapshotV257=JSON.stringify(state.party);
saveParty=function(...args){const s=JSON.stringify(state.party),r=partySeBaseV257(...args);if(s!==partySeSnapshotV257&&screens.tavern.classList.contains('active'))seV257('deckArrange');partySeSnapshotV257=s;return r;};
const toastSeBaseV257=toast;
toast=function(text,...args){if(/足り|できません|失敗|必要|不可|未解放/.test(text))seV257('error');return toastSeBaseV257(text,...args);};
const normalSeBaseV257=normalSequenceV251;
normalSequenceV251=function(a,target,weapon,element,...args){battleSeV257('attack',{attribute:element||a?.attribute,attackType:'物理',strength:'small'});return normalSeBaseV257(a,target,weapon,element,...args);};
const projectileSeBaseV257=projectileV251;
projectileV251=function(a,target,element,kind,...args){if(kind==='special')battleSeV257('skill',{attribute:element||a?.attribute,strength:'small'});return projectileSeBaseV257(a,target,element,kind,...args);};
const spriteSeBaseV257=skillSprite;
skillSprite=function(frames,...args){const skill=[...(MOB_DATA.magicCatalog||[]),...(MOB_DATA.techniqueCatalog||[])].find(s=>s.frames?.length&&s.frames[0]===frames?.[0]);battleSeV257('skill',{attribute:skill?.element||state.battle?.weaponAttackContext?.element||activeAlly()?.attribute,strength:'small'});return spriteSeBaseV257(frames,...args);};
const ultimateSeBaseV257=playUltimatePostAnimation;
playUltimatePostAnimation=function(a,u,...args){battleSeV257('fusion',{attribute:u?.attackElement||a?.attribute,attackType:u?.type==='physical'?'物理':'魔法',strength:'large'});return ultimateSeBaseV257(a,u,...args);};
const pulseSeBaseV257=pulseAllyDamage;
pulseAllyDamage=function(...args){battleSeV257('hit');return pulseSeBaseV257(...args);};
const enemyPulseSeBaseV257=pulseEnemy;
pulseEnemy=function(kind,...args){if(kind==='cast')battleSeV257('skill',{attribute:actingEnemy()?.attribute,strength:'small'});else if(kind==='hit')battleSeV257('hit');return enemyPulseSeBaseV257(kind,...args);};
const critSeBaseV257=showCriticalBeat;
showCriticalBeat=function(...args){battleSeV257('guard',{special:true});return critSeBaseV257(...args);};
const missSeBaseV257=showMiss;
showMiss=function(...args){battleSeV257('back');return missSeBaseV257(...args);};
const healSeBaseV257=heal;
heal=function(...args){const r=healSeBaseV257(...args);if(r>0)battleSeV257('skill',{attribute:'光',healing:true,strength:'small',durationLimit:.35});return r;};
const fxSeBaseV257=fx;
fx=function(kind,...args){if(kind==='buff'||kind==='break')battleSeV257(kind==='buff'?'summon':'guard',{durationLimit:.3});return fxSeBaseV257(kind,...args);};
const cutinSeBaseV257=actionCutin;
actionCutin=function(text,tone,...args){if(/防御|身を守/.test(text))battleSeV257('guard');else if(tone==='status')battleSeV257('skill',{attribute:'闇',strength:'small'});return cutinSeBaseV257(text,tone,...args);};
const noticeSeBaseV257=notice;
notice=function(text,tone,...args){if(/回避/.test(text))battleSeV257('back');else if(/バリア.*無効/.test(text))battleSeV257('guard');else if(/足りない|未習得/.test(text))battleSeV257('error');else if(tone==='status')battleSeV257('skill',{attribute:'闇',strength:'small',durationLimit:.3});return noticeSeBaseV257(text,tone,...args);};
const defeatSeBaseV257=recordEnemyDefeat;
recordEnemyDefeat=function(e,...args){if(e&&!e.seDownV257){e.seDownV257=true;battleSeV257('defeat');}return defeatSeBaseV257(e,...args);};
const statusSeBaseV257=applyEnemyStatusTo;
applyEnemyStatusTo=function(...args){const r=statusSeBaseV257(...args);if(r)battleSeV257('skill',{attribute:'闇',strength:'small',durationLimit:.3});return r;};
const allyStatusSeBaseV257=inflictAllyStatus;
inflictAllyStatus=async function(...args){const b=state.battle,r=await allyStatusSeBaseV257(...args);if(r&&state.battle===b)battleSeV257('skill',{attribute:'闇',strength:'small',durationLimit:.3});return r;};
const progressRewardSeBaseV257=applyProgressRewards;
applyProgressRewards=function(...args){const r=progressRewardSeBaseV257(...args);if(r?.coin>0)seV257('reward');return r;};
const exploreSeBaseV257=showExplorePhase;
showExplorePhase=function(title,...args){seV257(/獲得|発見|宝|コイン|手に入/.test(title)?'reward':'navigate');return exploreSeBaseV257(title,...args);};
const rushFxSeBaseV257=rushFxV255;
rushFxV255=function(kind,...args){if(['win','defeat'].includes(kind)&&state.battle)state.battle.seResultV257=true;stopSeV257();seV257(({start:'start',boss:'summon',win:'win',defeat:'lose',abort:'back'})[kind]||'navigate');return rushFxSeBaseV257(kind,...args);};
const clearRushSeBaseV257=clearRushV252;
clearRushV252=function(...args){stopSeV257();return clearRushSeBaseV257(...args);};
// Replace the old independent nightmare oscillator so SE mute/volume also governs it.
nmSoundV239=function(kind){seV257('attack',{attribute:({water:'水',thunder:'雷',fire:'火',dark:'闇'})[kind]||'無',strength:'small'});};
// Result presentation covers ordinary battles and event/rush overlays without altering reward paths.
const resultSeenSeV257=new WeakMap();
const resultObserverSeV257=new MutationObserver(()=>{for(const el of [$('#resultOverlay'),$('#eventOverlayV163')]){if(!el)continue;if(el.hidden){resultSeenSeV257.delete(el);continue;}if(!screens.battle.classList.contains('active'))continue;const title=el.querySelector('h2,#resultTitle')?.textContent||'';if(!/VICTORY|DEFEAT|CLEAR|勝利|敗北/.test(title)||(resultSeenSeV257.get(el)?.title===title&&resultSeenSeV257.get(el)?.battle===state.battle))continue;resultSeenSeV257.set(el,{title,battle:state.battle});if(state.battle?.seResultV257)continue;if(state.battle)state.battle.seResultV257=true;stopSeV257();seV257(/DEFEAT|敗北/.test(title)?'lose':'win');}});
resultObserverSeV257.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden']});
const progressionSeBaseV257=renderResultProgression;
renderResultProgression=function(changes,...args){const r=progressionSeBaseV257(changes,...args);if(changes?.length)seV257('starter');return r;};
const medalSeBaseV257=addMedal;
addMedal=function(id,n=1,...args){const r=medalSeBaseV257(id,n,...args);if(n>0)seV257('reward');return r;};
const rushRewardSeBaseV257=rewardRushV252;
rewardRushV252=function(...args){const r=rushRewardSeBaseV257(...args);if(r)seV257('reward');return r;};
function renderSoundSettingsV257(){let el=$('#storySoundSettingsV257');if(!el){el=document.createElement('section');el.id='storySoundSettingsV257';el.className='settings-section';el.innerHTML='<h3>効果音（SE）</h3><label>音量 <output id="storySeValueV257"></output><input id="storySeVolumeV257" type="range" min="0" max="100" step="1" aria-label="効果音の音量"></label><div><button id="storySeMuteV257" type="button"></button><button id="storySePreviewV257" type="button">試聴</button></div><small>SEのみ調整します。エンディング曲は従来どおりです。</small>';$('#settingsOverlay .settings-head')?.after(el);$('#storySeVolumeV257',el).oninput=e=>{storySoundV257.setSettings({volume:Number(e.target.value)/100});renderSoundSettingsV257();};$('#storySeMuteV257',el).onclick=()=>{storySoundV257.setSettings({muted:!storySoundV257.getSettings().muted});void storySoundV257.unlock();renderSoundSettingsV257();};$('#storySePreviewV257',el).onclick=async()=>{if(await storySoundV257.unlock())seV257('confirm');};}const s=storySoundV257.getSettings();$('#storySeVolumeV257').value=Math.round(s.volume*100);$('#storySeValueV257').textContent=Math.round(s.volume*100)+'%';$('#storySeMuteV257').textContent=s.muted?'消音中：解除':'効果音ON：消音';$('#storySeMuteV257').setAttribute('aria-pressed',String(s.muted));$('#storySePreviewV257').disabled=s.muted||s.volume===0;}
const settingsSeBaseV257=renderSettings;
renderSettings=function(...args){const r=settingsSeBaseV257(...args);renderSoundSettingsV257();return r;};
renderSoundSettingsV257();
window.__mobBuildVersion='v257';
