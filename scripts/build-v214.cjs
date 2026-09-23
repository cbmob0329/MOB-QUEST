const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
// Fix the currently used final battle only; the solo event keeps its scripted survival.
{const p=path.join(root,'js/game.js');let s=fs.readFileSync(p,'utf8');s=s.replace('scriptedImmortalParty:true,bookHeroPower:true,bookNaviMasterFinal:true','scriptedImmortalParty:false,bookHeroPower:true,bookNaviMasterFinal:true');fs.writeFileSync(p,s);}
for(const file of ['js/update-v181.js']){
 const p=path.join(root,file);let s=fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n');
 s=s.replace('function validPartyRowsV181(){','function validPartyRowsV181(storageKey){\n  if(storageKey===\'demonCastle2SplitV181\')return dc2RosterV214();');
 s=s.replace('const roster=validPartyRowsV181(),valid=', 'const roster=validPartyRowsV181(storageKey),valid=');
 s=s.replace('const roster=validPartyRowsV181(),teamOf=', 'const roster=validPartyRowsV181(opt.storageKey),teamOf=');
 s=s.replace('const roster=validPartyRowsV181();','const roster=validPartyRowsV181(opt.storageKey);');
 if(!s.includes("if(storageKey==='demonCastle2SplitV181'){while"))s=s.replace('return {A,B};\n}',"if(storageKey==='demonCastle2SplitV181'){while(A.length>6)B.push(A.pop());while(B.length>6)A.push(B.pop());}\n  return {A,B};\n}");
 s=s.replace("if(from.length<=1)return toast('A/Bどちらにも1人以上必要です');const i=from.findIndex", "if(from.length<=1)return toast('A/Bどちらにも1人以上必要です');if(opt.storageKey==='demonCastle2SplitV181'&&to.length>=6)return toast('1グループは6人までです');const i=from.findIndex");
 // The old helper truncated levels through the ten active slots; split uses the
 // saved eleven-member pool and the existing battle engine supports six allies.
 fs.writeFileSync(p,s);
}
{const p=path.join(root,'js/game.js');let s=fs.readFileSync(p,'utf8');
 s=s.replace("if(opt.storageKey==='demonCastle2SplitV181'&&to.length>=6)return toast('1グループは6人までです');",'');
 const start=s.indexOf('// UPDATE_V181_BEGIN'),end=s.indexOf('// UPDATE_V181_END',start)+'// UPDATE_V181_END'.length;
 s=s.slice(0,start)+fs.readFileSync(path.join(root,'js/update-v181.js'),'utf8').trim()+s.slice(end);fs.writeFileSync(p,s);
}
for(const file of ['js/game.js','js/update-v207.js']){
 const p=path.join(root,file);let s=fs.readFileSync(p,'utf8');
 s=s.replace("bookHeroStoryModeV94='hero';await openStoryScene('unfinishedBook',3);await showBookNaviHeroDuelV207();", "bookHeroStoryModeV94='hero';hideStoryPartyHeroV94(true);await openStoryScene('unfinishedBook',3);await showBookNaviHeroDuelV207();");fs.writeFileSync(p,s);
}
{const p=path.join(root,'js/game.js'),addition=fs.readFileSync(path.join(root,'js/update-v214.js'),'utf8').trim();let s=fs.readFileSync(p,'utf8');const start='// UPDATE_V214_BEGIN',end='// UPDATE_V214_END';
 if(s.includes(start)){const i=s.indexOf(start),j=s.indexOf(end,i)+end.length;s=s.slice(0,i)+addition+s.slice(j);}else{const i=s.lastIndexOf('})();');s=s.slice(0,i)+addition+'\n\n'+s.slice(i);}fs.writeFileSync(p,s);
}
const p=path.join(root,'index.html');fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace(/<div class="title-version">v\d+<\/div>/,'<div class="title-version">v214</div>'));
require('./sync-inline.cjs');
