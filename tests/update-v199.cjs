const fs=require('fs'),vm=require('vm'),assert=require('assert');
const data=fs.readFileSync('js/data.js','utf8');
const game=fs.readFileSync('js/game.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const ctx={console};ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(data+'\n;globalThis.__T={MOB_DATA,TEMP_BALANCE};',ctx,{filename:'data.js'});
const {MOB_DATA,TEMP_BALANCE}=ctx.__T;
assert.equal(MOB_DATA.playerBalanceVersion,199);
assert.equal(MOB_DATA.maxPlayerMp,999);
function growth(lv,c){const [v1,v99,v120=v99]=c;if(lv<=99){const t=(lv-1)/98;return Math.round(v1+(v99-v1)*t);}const t=(lv-99)/21;return Math.round(v99+(v120-v99)*t);}
for(const p of MOB_DATA.players){const t=TEMP_BALANCE.playerTargets[p.id];if(!t)continue;const mp60=growth(60,t.mp);assert(mp60>=350&&mp60<=500,`${p.id} Lv60 MP ${mp60}`);assert(growth(99,t.mp)<=700,`${p.id} Lv99 MP too high`);}
assert.equal(growth(99,TEMP_BALANCE.playerTargets.money.mp),700);
assert.deepEqual(Array.from(TEMP_BALANCE.playerTargets.yusha.hp),[210,1313,1575]);
assert.deepEqual(Array.from(TEMP_BALANCE.playerTargets.yusha.mp),[95,578,693]);
const hero=MOB_DATA.players.find(p=>p.id==='yusha');
assert(hero);
const dmg=hero.ults.filter(u=>Number(u.power)>0).map(u=>u.power);
assert.deepEqual(Array.from(dmg),[1.815,2.255,2.805]);
assert(game.includes("target.maxHp*.15"));
assert(game.includes('対象の最大HPの15%回復'));
assert(!game.includes('対象の最大HPの22%回復'));
assert(game.includes('maxMp:Math.min(999,growthValue(lv,t.mp))'));
assert(game.includes('out.maxMp=Math.min(999'));
assert(game.includes("window.__mobBuildVersion='v199'"));
assert(game.includes('function waitLilithPartyNextV198()'));
assert(game.includes("state.adventure.storyFlags[`arrival:${id}`]=true"));
assert(html.includes('<div class="title-version">v199</div>'));
console.log('v199 balance checks PASS');
