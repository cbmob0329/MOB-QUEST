// UPDATE_V214_BEGIN
/* Retain the recruited story roster independently of the ten active slots. */
const BOOK_ROSTER_V214=['yusha','pink','tetsu','desert','denden','money','jessie','nyoro','nekoku','riro','kaijin'];
function rememberBookRosterV214(rows){
  const saved=new Map((state.meta.bookRosterV214||[]).map(row=>[row[0],row[1]]));
  for(const [raw,lv] of rows||[]){const id=canonicalPlayerId(raw);if(BOOK_ROSTER_V214.includes(id))saved.set(id,Number(lv)||1);}
  state.meta.bookRosterV214=[...saved];saveMeta();
}
const joinBaseV214=storyJoin;
storyJoin=function(id){
  if(canonicalPlayerId(id)==='kaijin')rememberBookRosterV214(state.party);
  const r=joinBaseV214(id);
  if(canonicalPlayerId(id)==='kaijin')rememberBookRosterV214(state.party);
  return r;
};
function dc2RosterV214(){
  const stored=state.meta.bookRosterV214||[],split=state.meta.demonCastle2SplitV181||{};
  const history=[...(state.adventure.checkpoint?.party||[]),...(state.adventure.runSnapshot?.party||[])];
  const levels=new Map([...history,...stored,...(split.A||[]),...(split.B||[]),...state.party].map(([id,lv])=>[canonicalPlayerId(id),Number(lv)||1]));
  const fallback=levels.get('yusha')||85;
  // Older saves discarded the displaced member; restore that story companion
  // at the Hero's level only when no recorded level survives.
  const order=[...new Set([...state.party.map(r=>canonicalPlayerId(r[0])),...BOOK_ROSTER_V214])].filter(id=>BOOK_ROSTER_V214.includes(id)&&player(id));
  const rows=order.map(id=>[id,levels.get(id)||fallback]);rememberBookRosterV214(rows);return rows;
}

/* Heal before the user sees the final formation, including defeated members. */
const bookFormationBaseV214=bookPartyFormationV92;
bookPartyFormationV92=async function(){
  fullHealAtCastleInn();
  for(const ally of state.battle?.allies||[]){
    if(!state.party.some(row=>canonicalPlayerId(row[0])===ally.id))continue;
    ally.hp=ally.maxHp;ally.mpNow=ally.maxMp;ally.dead=false;
    ally.status={poison:0,burn:0,sleep:0,stun:0,paralyze:0,confuse:0};
  }
  rememberBookRosterV214(state.party);
  const pending=bookFormationBaseV214();
  const grid=$('.book-formation-grid-v92');
  if(grid){const note=document.createElement('p');note.className='book-recovered-v214';note.textContent='全員のHP・MPが全回復しました';grid.before(note);}
  return pending;
};
window.__mobBuildVersion='v214';
// UPDATE_V214_END
