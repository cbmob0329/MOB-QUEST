const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict'),{open,root}=require('./story-v172-harness.cjs');
const base=fs.readFileSync(path.join(__dirname,'rush-balance-v253.cjs'),'utf8').match(/const injection=`([\s\S]*?)`;/)[1];
const injection=vm.runInNewContext('`'+base+'`')+`
window.traits253=async()=>{
 balance252.setup(2,0,25201);startRound=()=>{};processQueue=async()=>{};state.party=[['money',60]];state.meta.equipment.money={main:null,sub:null,medals:[]};
 await beginBattle({mode:'training',party:state.party,waves:[[{template:clone(RUSH_DATA_V252.enemies['g-slime']),level:60}]]});
 const b=state.battle,a=b.allies[0],e=b.enemies[0],results=[];a.maxHp=10000;e.maxHp=e.hp=1000000;Math.random=()=>.5;
 const equip=ids=>{a.equipment={main:null,sub:null,medals:ids};a.hp=a.maxHp;a.dead=false;a.guardTurns=0;a.guard=0;a.mpNow=a.maxMp;b.busy=false;b.finished=false;b.queue=[{type:'ally',id:a.id}];b.queuePos=0;};
 for(const m of RUSH_DATA_V252.medals)for(const t of m.traits){let before,after,expected;
  if(['resist','physicalCut','guardExtraCut'].includes(t.kind)){
   const type=t.kind==='physicalCut'?'physical':'magic',el=t.kind==='resist'?t.element:'無';equip([]);if(t.kind==='guardExtraCut'){a.guard=.45;a.guardTurns=1;}before=await damageAlly(a,8,type,false,el);
   equip([m.id]);if(t.kind==='guardExtraCut'){a.guard=.45;a.guardTurns=1;}after=await damageAlly(a,8,type,false,el);expected=t.kind==='guardExtraCut'?Math.round((before/.55)*.55*(1-t.value)):Math.round(before*(1-t.value));
  }else if(['guardHpHeal','guardMpHeal'].includes(t.kind)){
   equip([m.id]);a.hp=a.maxHp/2;a.mpNow=a.maxMp/2;before=t.kind==='guardHpHeal'?a.hp:a.mpNow;await act('defend');after=t.kind==='guardHpHeal'?a.hp:a.mpNow;expected=(t.kind==='guardHpHeal'?a.maxHp:a.maxMp)*t.value;
  }else if(t.kind==='magicMpCut'){
   const skill=MOB_DATA.magicCatalog.filter(s=>s.element===t.element&&s.cost>=20).sort((x,y)=>x.cost-y.cost)[0];if(!skill)throw Error('No real magic fixture');equip([]);await performMagic(a,skill);before=a.maxMp-a.mpNow;equip([m.id]);await performMagic(a,skill);after=a.maxMp-a.mpNow;expected=Math.ceil(skill.cost*(1-t.value));
  }else if(t.kind==='crit'){
   Math.random=()=>TEMP_BALANCE.critRate+.01;equip([]);before=calcDamage(a,'physical',1,0,e).crit;equip([m.id]);after=calcDamage(a,'physical',1,0,e).crit;Math.random=()=>.5;
  }else if(t.kind==='evade'){
   Math.random=()=>t.value/2;equip([]);before=await damageAlly(a,1,'physical',false,'無');equip([m.id]);after=await damageAlly(a,1,'physical',false,'無');Math.random=()=>.5;
  }else if(t.kind==='poisonOnHit'){
   equip([m.id]);Math.random=()=>0;e.status.poison=0;await performAttack(a);after=e.status.poison;e.status.poison=0;Math.random=()=>.99;await performAttack(a);before=e.status.poison;Math.random=()=>.5;
  }
  results.push({medal:m.id,kind:t.kind,before,after,expected});
 }
 const ids=RUSH_DATA_V252.medals.map(m=>m.id),get=id=>({main:null,sub:null,medals:[id]}),dupes=ids.map(id=>({id,single:weaponTraitEntries(get(id)).length,duplicate:weaponTraitEntries({main:null,sub:null,medals:[id,id,id]}).length}));
 const stack={equipment:{main:null,sub:null,medals:['rush-golem-v252','rush-endurance-medal-v252','rush-sea-medal-v252']}};
 const stacking={hp:weaponGuardHpHeal(stack),mp:weaponGuardMpHeal(stack)};
 equip(stack.equipment.medals);a.hp=a.maxHp/2;a.mpNow=a.maxMp/2;await act('defend');stacking.actualHp=a.hp-a.maxHp/2;stacking.actualMp=a.mpNow-a.maxMp/2;stacking.maxMp=a.maxMp;
 equip(['rush-golem-v252','rush-golem-v252','rush-golem-v252']);a.hp=a.maxHp/2;await act('defend');stacking.duplicateHp=a.hp-a.maxHp/2;
 equip(stack.equipment.medals);a.hp=a.maxHp-1;a.mpNow=a.maxMp-1;await act('defend');stacking.capped=a.hp===a.maxHp&&a.mpNow===a.maxMp;
 state.meta.medals=Object.fromEntries(ids.map(id=>[id,1]));state.meta.equipment.money={main:null,sub:null,medals:ids.slice(0,3)};saveMeta();return {results,dupes,stacking,ids};
};window.traitReload253=()=>({medals:state.meta.medals,eq:equipmentFor('money'),count:weaponTraitEntries(equipmentFor('money')).length});`;
(async()=>{const x=await open(injection);try{const out=await x.page.evaluate(()=>traits253());for(const r of out.results){switch(r.kind){case'resist':case'physicalCut':case'guardExtraCut':assert.ok(r.after<r.before,JSON.stringify(r));assert.ok(Math.abs(r.after-r.expected)<=1,JSON.stringify(r));break;case'guardHpHeal':case'guardMpHeal':assert.ok(Math.abs(r.after-r.before-r.expected)<.001,JSON.stringify(r));break;case'magicMpCut':assert.equal(r.after,r.expected);assert.ok(r.after<r.before);break;case'crit':assert.equal(r.before,false);assert.equal(r.after,true);break;case'evade':assert.ok(r.before>0);assert.equal(r.after,0);break;case'poisonOnHit':assert.equal(r.before,0);assert.ok(r.after>0);break;default:throw Error('Untested trait '+r.kind);}}
 for(const d of out.dupes)assert.equal(d.single,d.duplicate,d.id);assert.equal(out.stacking.hp,.05);assert.equal(out.stacking.mp,.02);assert.equal(out.stacking.actualHp,500);assert.ok(Math.abs(out.stacking.actualMp-out.stacking.maxMp*.02)<.001);assert.equal(out.stacking.duplicateHp,200);assert.equal(out.stacking.capped,true);await x.page.reload({waitUntil:'load'});out.reloaded=await x.page.evaluate(()=>traitReload253());assert.equal(Object.keys(out.reloaded.medals).length,14);assert.deepEqual(out.reloaded.eq.medals,out.ids.slice(0,3));assert.equal(out.reloaded.count,6);assert.deepEqual(x.errors,[]);fs.writeFileSync(path.join(root,'artifacts/rush-v253/trait-results.json'),JSON.stringify(out,null,2));console.log('PASS '+out.results.length+' actual trait effects, duplicate suppression, different-medal stacking, recovery caps and save reload');
 }finally{await x.browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
