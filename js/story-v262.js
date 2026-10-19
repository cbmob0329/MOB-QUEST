// Story continuity and participation rewards.
function partyExpRateV262(b,id){
 const main=b?.mainIds||state.party.slice(0,4).map(x=>x[0]);
 const sub=b?.superIds||state.party.slice(4,6).map(x=>x[0]);
 return main.includes(id)?1:sub.includes(id)?.7:.5;
}
{
 const magma=STORY_EVENTS['arrival:magma'],grass=STORY_EVENTS['arrival:grassland2'];
 const introduction=grass.steps.slice(1).map(s=>[...s]);
 // Nekoku has not joined yet in magma. Preserve his question through Desert.
 for(const s of introduction)if(s[1]==='nekoku'){s[1]='desert';s[2]='お前、オトナシの国出身だな？\n同じ匂いを知っている';}
 introduction.splice(introduction.findIndex(s=>s[0]==='dashGuestV172')+1,0,['guests',['nyoro','tetsu']]);
 const at=introduction.findIndex(s=>s[0]==='say'&&s[1]==='tetsu');
 introduction.splice(at+1,0,['say','tetsu','行く先に迷っていたところ'],['say','tetsu','この者に出会い行動を共にしていたでござる！'],['say','nyoro','そんな感じニョロ♪']);
 const nyoroJoin=magma.steps.pop();
 magma.steps.push(...introduction.filter(s=>s[0]!=='join'),nyoroJoin,['join','tetsu','モブテツが仲間に加わった！']);
 grass.steps=grass.steps.slice(0,1);
 for(const [key,event]of Object.entries(STORY_EVENTS))if(key.includes('grassland2'))for(const s of event.steps||[]){
  if(s[2]==='初陣でござる！')s[2]='いざ、参るでござる！';
  if(s[2]==='仲間が増えたぞ')s[2]='みんな、強くなったぞ';
 }
}
function migrateTetsuV262(){
 if(storyDone('arrival:magma')&&state.party.some(s=>s[0]==='nyoro')&&!state.party.some(s=>s[0]==='tetsu'))storyJoinSilent('tetsu');
}
const homeBaseV262=renderHome;
renderHome=function(...args){migrateTetsuV262();return homeBaseV262(...args);};
window.__mobBuildVersion='v262';
