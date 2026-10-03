// Shared by the game and the Node build; throws before registering invalid data.
function validateRushV252(data,context={}){
 const fail=message=>{throw new Error('[rush-v252] '+message);};
 if(data.schemaVersion!==1||data.completionLimit!==1||data.battleRewards!==false)fail('schema/reward policy');
 if(!Number.isInteger(data.maxVisible)||data.maxVisible<1||data.maxVisible>4||data.quests.length>data.maxVisible)fail('quest display cap');
 if(!Number.isInteger(data.maxSimultaneous)||data.maxSimultaneous<1||data.maxSimultaneous>2)fail('enemy display cap');
 const ids=new Set(),rewards=new Set(),image=p=>{if(typeof p!=='string'||!/^[-\w/]+\.png$/.test(p)||p.includes('..'))fail('image path');if(context.assetExists&&!context.assetExists(p))fail('missing image '+p);};
 image(data.icon);
 const unique=id=>{if(typeof id!=='string'||!/^rush-[a-z0-9-]+-v252$/.test(id)||ids.has(id))fail('duplicate/invalid id '+id);ids.add(id);};
 for(const m of data.medals){unique(m.id);image(m.image);if(!m.name||m.type!=='メダル')fail('medal type/name');
  for(const [k,v] of Object.entries(m.stats)){if(!['atk','mag','def','res','spd','maxHp','maxMp'].includes(k)||!Number.isFinite(v)||v<0||v>(k.startsWith('max')?250:80))fail('medal stat '+m.id);}
  if(!Array.isArray(m.traits)||m.traits.length>2)fail('medal traits');
  for(const t of m.traits)if(!['resist','guardExtraCut'].includes(t.kind)||!(t.value>0&&t.value<=.05)||!t.label||(t.kind==='resist'&&!['火','水','雷','地','風','光','闇','無'].includes(t.element)))fail('trait '+m.id);
 }
 for(const [id,e] of Object.entries(data.enemies)){if(e.id!==id||!e.name||!['normal','elite','boss'].includes(e.category))fail('enemy '+id);image(e.image);
  if(!e.forceActionCount||!e.noEscape||![e.actionCount,e.v144ActionMin,e.v144ActionMax].every(n=>Number.isInteger(n)&&n>=1&&n<=3)||e.v144ActionMin>e.v144ActionMax)fail('actions '+id);
  for(const k of ['evasion','damageReduction'])if(e[k]!==undefined&&!(e[k]>=0&&e[k]<=.3))fail('passive '+id);
  for(const [k,v] of Object.entries(e.mods||{}))if(!['hp','mp','atk','mag','def','res','spd'].includes(k)||!Number.isFinite(v)||v<.1||v>3)fail('enemy stat multiplier '+id);
 }
 for(const q of data.quests){unique(q.id);if(!q.title||!Number.isInteger(q.recommendedLevel)||q.recommendedLevel<1||q.recommendedLevel>120)fail('quest title/level');
  if(context.worldIds&&(!context.worldIds.includes(q.world)||!context.worldIds.includes(q.unlock.world)))fail('unknown world '+q.id);
  if(!q.unlock.world||!q.unlock.label||q.unlock.story&&(!['clear','0','1','2'].includes(String(q.unlock.record))||context.storyIds&&!context.storyIds.includes(q.unlock.story)))fail('unlock '+q.id);
  if(!data.medals.some(m=>m.id===q.reward)||rewards.has(q.reward))fail('reward '+q.id);rewards.add(q.reward);
  if(!Array.isArray(q.areas)||q.areas.length<1||q.areas.length>2)fail('AREA count');let waves=0;
  q.areas.forEach(a=>{if(!Array.isArray(a.waves)||!a.waves.length)fail('empty AREA');waves+=a.waves.length;
   for(const w of a.waves){if(!Array.isArray(w)||!w.length||w.length>data.maxSimultaneous)fail('wave cap');for(const row of w){if(!data.enemies[row.enemy]||!Number.isInteger(row.level)||row.level<1||row.level>120)fail('wave enemy/level');if(row.enemy==='v179-phoenix'&&(q.unlock.story!=='phoenix'||q.unlock.record!=='clear'))fail('phoenix spoiler gate');}}
   for(const phase of ['pre','post']){if(!Array.isArray(a[phase]))fail('dialogue');for(const line of a[phase])if(!['pink','denden','money','nyoro','v179-phoenix'].includes(line.speaker)||typeof line.text!=='string'||!line.text.trim())fail('dialogue speaker/text');}
  });if(waves<2||waves>4)fail('wave count');
 }
 return true;
}
if(typeof module!=='undefined'&&module.exports)module.exports=validateRushV252;
