const assert=require('node:assert/strict'),{open}=require('./story-v172-harness.cjs');
const injection=`window.mechanics218=async()=>{
 const f=figureByImageV96('eventfig/51.png');state.meta.figures[f.id]=1;state.meta.figurePlusV218[f.id]=0;setRubyV115(1000);
 const exchange=rubyExchangeFigureV115(f),plus=figurePlusV218(f.id);state.meta.figurePlusV218[f.id]=9;const before=rubyOwnedV115(),blocked=rubyExchangeFigureV115(f);
 const a={hp:100,maxHp:100,atk:100,def:100,spd:100},e={hp:100,maxHp:100,atk:100,def:100,spd:100};
 await applySoulTextV218(f,a,[a],[e],'味方全体のATKを12.5%アップし、SPDを10%アップする。敵全体のDEFを20%ダウンさせる',true);
 const skills={atk:a.atk,spd:a.spd,def:e.def};
 const dual=[];state.battle={turn:1,weaponAttackContext:null};fixedDelay=()=>Promise.resolve();positionEffect=()=>{};fx=()=>{};applyEnemyDamageTo=(a,e,p)=>{dual.push([state.battle.weaponAttackContext.element,p]);return{value:10};};
 await applySoulTextV218(f,a,[a],[{...e,uid:'test'}],'敵単体に火属性と水属性の2連続物理中ダメージを与える');
 return{exchange:exchange.ok,plus,blocked:blocked.ok,unchanged:before===rubyOwnedV115(),skills,dual,helperHidden:!MOB_DATA.players.some(p=>p.helperV218),medal:weaponById('event-phoenix-medal').stats};
};`;
(async()=>{const x=await open(injection);try{const r=await x.page.evaluate(()=>mechanics218());assert.equal(r.exchange,true);assert.equal(r.plus,1);assert.equal(r.blocked,false);assert(r.unchanged);assert.deepEqual(r.skills,{atk:113,spd:110,def:80});assert.deepEqual(r.dual,[['火',1.3],['水',1.3]]);assert(r.helperHidden);assert.deepEqual(r.medal,{atk:3,maxHp:15,maxMp:25});assert.deepEqual(x.errors,[]);console.log('v218 MECHANICS PASS: ruby upgrades/cap, PVP target and decimal effects, dual elements, helper isolation, medal');}finally{await x.browser.close();}})().then(()=>process.exit(0),e=>{console.error(e);process.exit(1)});
