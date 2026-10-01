function finaleSectionV248(prefix){const key=Object.keys(FINALE_SCRIPT_V248).find(k=>k.startsWith(prefix));if(!key)throw Error('Missing finale section '+prefix);return FINALE_SCRIPT_V248[key];}
function finaleStepsV248(prefix){return finaleSectionV248(prefix).filter(r=>r.op==='say'||r.op==='narrate'||r.op==='direction'&&!/^【(?:戦闘|最終戦|背景|進行)/.test(r.text)).map(r=>['finaleStepV248',r]);}
for(const [key,section]of [['arrival:demonCastle2','01　'],...Array.from({length:4},(_,i)=>['pre:demonCastle2:'+i,'02-'+(i+1)]),...Array.from({length:3},(_,i)=>['post:demonCastle2:'+i,'AREA'+(i+1)+'　討伐後'])])STORY_EVENTS[key]={...STORY_EVENTS[key],steps:finaleStepsV248(section)};
let finaleMotionV248=null,finaleInsetV248=null;
async function finaleMotionSayV248(id,text){const m=finaleMotionV248;finaleMotionV248=null;const actor=storyAnchor(id);try{if(m&&actor){await Promise.all([storySay(id,text),animateV157(actor,m==='shake'?[{translate:'0 0'},{translate:'-5px 0',offset:.2},{translate:'5px 0',offset:.4},{translate:'-5px 0',offset:.6},{translate:'5px 0',offset:.8},{translate:'0 0'}]:[{translate:'0 0'},{translate:`0 ${m==='big'?-75:-30}px`,offset:.4},{translate:'0 0'}],m==='big'?1000:650)]);}else await storySay(id,text);}finally{finaleInsetV248?.remove();finaleInsetV248=null;}}
async function finaleAwakenV248(){const ids=['c-lilith-kirin','c-lilith-hell','boss-lilith-castle','c-lilith-riva','c-lilith-kufu'],after=['dc2-kirin','dc2-hell','boss-lilith-castle','dc2-riva','dc2-kufu'];await storyHideGuest();await dc2EntranceV211(ids,'rose',{allowFive:true,compactLilith:true,raised:true});const fx=dc2EffectV211('rose');fx.classList.add('finale-awaken-v248');try{await Promise.all(ids.map(async(id,i)=>{if(i===2)return;const actor=storyAnchor(id),img=actor?.querySelector('img');if(!actor||!img)return;await animateV157(actor,[{opacity:1,scale:'1'},{opacity:0,scale:'.75',filter:'brightness(1.6)'}],1100);actor.style.opacity='0';await readyStoryImage(img,trainingEnemyTemplate(after[i]).image);actor.hidden=false;actor.dataset.storyActor=after[i];img.alt=trainingEnemyTemplate(after[i]).name;await animateV157(actor,[{opacity:0,scale:'.75'},{opacity:1,scale:'1.06',offset:.7},{opacity:1,scale:'1',filter:'none'}],1400);actor.style.opacity='1';}));}finally{fx.remove();}}
async function finaleAbyssV248(){await storyHideGuests();await storyHideGuest();const fx=dc2EffectV211('abyss');fx.classList.add('finale-abyss-v248');try{await animateV157(fx,[{opacity:0,scale:'.35'},{opacity:1,scale:'1'}],1200);await dc2EntranceV211(['dc2-ulrilis'],'abyss');await animateV157($('#storyScene'),[{translate:'0 0'},{translate:'-5px 3px',offset:.25},{translate:'5px -3px',offset:.5},{translate:'0 0'}],650);}finally{fx.remove();}}
async function finaleExplosionV248(){const actor=storyAnchor('dc2-maou'),fx=dc2EffectV211('abyss');fx.classList.add('finale-explosion-v248');try{if(actor)await animateV157(actor,[{opacity:1,translate:'0 0'},{opacity:1,translate:'-8px 3px',filter:'brightness(1.5)',offset:.25},{opacity:.8,translate:'8px -4px',filter:'brightness(2)',offset:.6},{opacity:0,scale:'.3',filter:'blur(8px)'}],5000);}finally{fx.remove();if(actor)actor.hidden=true;}}
async function finaleStoryDirectionV248(text){
 if(/震えながら/.test(text)){finaleMotionV248='shake';return;}
 if(/跳ね/.test(text)&&!/全員|仲間/.test(text)){finaleMotionV248=text.includes('超')?'big':'jump';return;}
 if(text==='画面をシェイク'){await animateV157($('#storyScene'),[{translate:'0 0'},{translate:'-7px 2px',offset:.2},{translate:'6px -2px',offset:.5},{translate:'0 0'}],650);return;}
 if(text.includes('覚醒バージョン'))return finaleAwakenV248();
 if(text.includes('パーティーをAグループ'))return finaleRunBaseV248([['dc2Split181']]);
 if(text.includes('超演出召喚'))return finaleAbyssV248();
 if(text.includes('薔薇の召喚演出から'))return dc2EntranceV211(['boss-lilith-castle'],'rose');
 if(text.includes('鏡・分身'))return dc2EntranceV211(['dc2-lilith','dc2-lilith','dc2-lilith'],'mirror');
 if(text.includes('炎の召喚演出から'))return dc2EntranceV211(['dc2-enma'],'flame');
 if(text.includes('闇の召喚演出から'))return dc2EntranceV211(['dc2-maou'],'abyss');
 if(text.includes('闇の召喚：'))return dc2EntranceV211(['dc2-ulrilis'],'abyss');
 if(text.includes('発光（2回）'))return glowV157('dc2-ulrilis',2);
 if(text.includes('シルエット')){await Promise.all(['dc2-maou','boss-lilith-castle'].map(id=>animateV157(storyAnchor(id),[{opacity:1,filter:'none'},{opacity:1,filter:'brightness(0) drop-shadow(0 0 18px #842eff)',offset:.6},{opacity:0,filter:'brightness(0)'}],3000)));return;}
 if(text.includes('爆発・消滅'))return finaleExplosionV248();
 if(text.includes('敵の表示を消す')){await storyHideGuests();await storyHideGuest();return;}
 if(text.includes('薔薇の演出とともに消える')){await dc2VanishV211('boss-lilith-castle','rose');await storyHideGuests();await storyHideGuest();return;}
 if(text.includes('炎の演出とともに消える')){await dc2VanishV211('dc2-enma3','flame');await storyHideGuests();await storyHideGuest();return;}
 if(text.includes('モブリリスが加入')){storyJoin('lilith');await renderStoryParty();return;}
 if(text.includes('モブ閻魔 最終形態を表示'))return storyShowGuest('dc2-enma3');
 if(text.includes('表示：モブ魔王、モブリリス'))return storyShowGuests(['dc2-maou','boss-lilith-castle'],{slow:true});
 if(text.includes('表示：モブ魔王'))return storyShowGuest('dc2-maou',{slow:true});
 if(text.includes('モブリリスを表示')||text.includes('表示：モブリリス'))return storyShowGuest('boss-lilith-castle',{slow:true});
 if(text.includes('全員で「勝負！！」'))return chorusV158('勝負！！',true);
 if(text.includes('背景を小さく')){const world=Object.entries({草原:'grassland',砂漠:'desert',田舎町:'rural',ネオン街:'neon',マグマ:'magma'}).find(([name])=>text.startsWith(name))?.[1];if(world){finaleInsetV248?.remove();const img=new Image();img.className='finale-inset-v248';img.alt='';await readyStoryImage(img,storySceneBg(world,0).bg);$('#storyScene').append(img);finaleInsetV248=img;}return;}
 if(text.includes('準備ロード')){await closeStoryScene(false);await loadingWithAssets('お城へ移動中…',['back/king1.png',...MOB_DATA.players.map(p=>p.image)]);await Promise.all([preloadEndingV157(),reportBackgroundV227()]);return;}
 if(/^【(?:背景|進行|戦闘|最終戦)/.test(text))return;
 throw Error('Unmapped finale direction: '+text);
}
const finaleRunBaseV248=runStorySteps;
runStorySteps=async function(steps=[]){for(const st of steps){if(st[0]!=='finaleStepV248'){await finaleRunBaseV248([st]);continue;}if(skipConversationV224())continue;const r=st[1];if(r.op==='say'){if(r.id==='chorus')await chorusV169(r.text,'riro');else await finaleMotionSayV248(r.id,r.text);}else if(r.op==='narrate')await storyNarrate(r.text);else await finaleStoryDirectionV248(r.text);}};
fusionV157=async function(){const b=state.battle,old=storyBusy;storyBusy=true;if(b){b.busy=true;b.queue=[];b.queuePos=0;}setCommandDisabled(true);showScreen('adventure');try{await openStoryScene('demonCastle2',3);await scopedConversationV224(()=>runStorySteps(finaleStepsV248('AREA4　モブ魔王撃破後')),[]);}finally{await closeStoryScene(false);storyBusy=old;if(state.battle===b)showScreen('battle');}};
finalBossPostV89Final=async function(){showScreen('adventure');await openStoryScene('demonCastle2',3);try{await runStorySteps(finaleStepsV248('03　'));if(!state.party.some(r=>canonicalPlayerId(r[0])==='lilith'))storyJoin('lilith');state.meta.finalBossDefeated=true;saveMeta();}finally{finaleInsetV248?.remove();finaleInsetV248=null;finaleMotionV248=null;}};
dc2HandoffDialogueV215=async function(b){for(const r of finaleSectionV248('AREA1　Aグループ').filter(r=>r.op==='say')){if(r.id==='boss-lilith-castle')await enemyStoryCutin(b.enemies.find(e=>e.id==='dc2-lilith')||trainingEnemyTemplate('dc2-lilith'),r.text);else await allyStoryCutin(r.id,r.text);}await storyDarkBattlePulse();};
async function finaleEnmaLinesV248(b,form){const e=b.enemies.find(e=>e.id===(form===2?'dc2-enma':'dc2-enma2'));if(!e)return;for(const r of finaleSectionV248('AREA3　'+(form===2?'第二形態':'最終形態')).filter(r=>r.op==='say'))await enemyStoryCutin(e,r.text);}


