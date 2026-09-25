const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),root=path.resolve(__dirname,'..');
require('./build-v218.cjs');
const worlds={草原:'grassland',砂漠:'desert',田舎町:'rural',ネオン街:'neon',マグマ:'magma',海底:'sea','草原Ⅱ':'grassland2',部族村:'tribe','田舎町Ⅱ':'rural2','ネオン街Ⅱ':'neon2','マグマⅡ':'magma2','砂漠Ⅱ':'desert2'};
const speakers={モブスライムキング:'king',モブピンク:'pink',モブデザート:'desert',モブデンデン:'denden',モブマニー:'money',モブニョロ:'nyoro',モブネコクー:'nekoku',モブジェシー:'jessie',モブリーロ:'riro'};
const reports={};let world,steps,speaker,active=false;
function finish(){if(!world)return;assert(steps.length>0,world);const last=steps.at(-1);assert.equal(last[0],'talk');last[0]='last';if(reports[world])assert.deepEqual(reports[world],steps,'Repeated chapter must be identical');else reports[world]=steps;}
for(const raw of fs.readFileSync(path.join(root,'お城のイベント.txt'),'utf8').split(/\r?\n/)){
 const line=raw.trim();if(!line)continue;const heading=line.match(/^(.+)クリア後$/);
 if(heading){finish();world=worlds[heading[1]];assert(world,heading[1]);steps=[];active=false;speaker=null;continue;}
 if(line==='王様に話しかけると'){active=true;continue;}if(!active)continue;
 if(line==='1秒後'){active=false;continue;}
 if(speakers[line]){speaker=speakers[line];continue;}
 if(line==='ナレーションと演出'){speaker='narrator';continue;}
 if(line.startsWith('モブライトアームがダッシュ')){steps.push(['arm']);speaker=null;continue;}
 if(line.startsWith('ダッシュで戻ってくる演出'))continue;
 assert(speaker,`Unclassified source line: ${line}`);
 if(speaker==='narrator'){steps.push([line.includes('握手')?'handshake':'record',line]);speaker=null;continue;}
 const impact=/[（(](?:文字|迫力)/.test(line),text=line.replace(/[（(](?:文字|迫力)[^）)]*[）)]/g,'').replace(/\[$/,'');
 steps.push(['talk',speaker,text,impact?'shout':'']);
}finish();assert.equal(Object.keys(reports).length,12);
fs.writeFileSync(path.join(root,'js/castle-reports-v227.json'),JSON.stringify(reports,null,2)+'\n');
const addition='// UPDATE_V227_BEGIN\nconst CASTLE_REPORTS_V227='+JSON.stringify(reports)+';\n'+fs.readFileSync(path.join(root,'js/update-v227.js'),'utf8')+'\n// UPDATE_V227_END';
const p=path.join(root,'js/game.js');let game=fs.readFileSync(p,'utf8');if(game.includes('// UPDATE_V227_BEGIN'))game=game.replace(/\/\/ UPDATE_V227_BEGIN[\s\S]*?\/\/ UPDATE_V227_END/,()=>addition);else{const i=game.lastIndexOf('})();');game=game.slice(0,i)+addition+'\n'+game.slice(i);}fs.writeFileSync(p,game);
const css=path.join(root,'css/style.css');let style=fs.readFileSync(css,'utf8').replace(/\/\* UPDATE_V227_BEGIN \*\/[\s\S]*?\/\* UPDATE_V227_END \*\//,'');style+='\n/* UPDATE_V227_BEGIN */\n'+fs.readFileSync(path.join(root,'css/update-v227.css'),'utf8')+'\n/* UPDATE_V227_END */\n';fs.writeFileSync(css,style);
const html=path.join(root,'index.html');fs.writeFileSync(html,fs.readFileSync(html,'utf8').replace(/<div class="title-version">v\d+<\/div>/,'<div class="title-version">v227</div>'));delete require.cache[require.resolve('./sync-inline.cjs')];require('./sync-inline.cjs');
console.log('v227',Object.keys(reports).length,'reports',Object.values(reports).reduce((n,s)=>n+s.length,0),'steps');
