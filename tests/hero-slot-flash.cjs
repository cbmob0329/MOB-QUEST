const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=process.env.MOB_FIX_ROOT||path.resolve(__dirname,'..');
function classes(initial=''){const set=new Set(initial.split(/\s+/).filter(Boolean));return {contains:x=>set.has(x),toggle(x,on){on?set.add(x):set.delete(x)},remove:x=>set.delete(x)};}
async function check(file){
 const source=fs.readFileSync(path.join(root,file),'utf8');
 const render=source.slice(source.indexOf('async function renderStoryParty(extraIds=null){'),source.indexOf('async function openStoryScene('));
 const hide=source.match(/function hideStoryPartyHeroV94\(on=true\)\{[^\n]+\}/)[0];
 let hero={classList:classes()},resume;
 const row={classList:classes(),dataset:{},set innerHTML(html){hero={classList:classes(html.match(/class="([^"]*)"/)[1])};}};
 const ctx=vm.createContext({$:(sel)=>sel==='#storyPartyLine'?row:hero,storyDisplayPartyIds:()=>['yusha'],storyActorInfo:()=>({key:'yusha',image:'hero.png',name:'勇者'}),bindImages(){},sizeStoryPartyImages:()=>new Promise(resolve=>resume=resolve)});
 vm.runInContext(render+'\n'+hide,ctx);
 vm.runInContext('hideStoryPartyHeroV94(true)',ctx);
 for(let i=0;i<3;i++){
   const rebuilding=vm.runInContext('renderStoryParty()',ctx);
   assert.ok(row.classList.contains('book-hero-away-v214'),'concealment must survive DOM replacement');
   assert.ok(hero.classList.contains('book-hero-relocated-v94'),'new hero must be hidden BEFORE image decode resolves');
   resume();await rebuilding;assert.ok(hero.classList.contains('book-hero-relocated-v94'));
 }
 vm.runInContext('hideStoryPartyHeroV94(false)',ctx);
 assert.ok(!row.classList.contains('book-hero-away-v214'));assert.ok(!hero.classList.contains('book-hero-relocated-v94'));
 const returned=vm.runInContext('renderStoryParty()',ctx);assert.ok(!hero.classList.contains('book-hero-relocated-v94'),'explicit return must show hero');resume();await returned;
 assert.ok(!source.includes("restoreStoryPartyHeroV94();await renderStoryParty();hideStoryPartyHeroV94(true)"),'duel resume must not reveal hero before rebuilding');
 assert.ok(source.includes("classList.remove('book-hero-away-v214');storySceneExtras=[]"),'closing must clear scene-only concealment');
}
(async()=>{await check('js/game.js');await check('index.html');console.log('PASS: Hero concealed before/during/after async rebuilds; explicit return and scene close release concealment; inline/runtime parity');})().catch(e=>{console.error(e);process.exitCode=1;});
